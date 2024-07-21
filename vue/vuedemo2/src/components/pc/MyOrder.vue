<template>
  <div id= 'container_id' class="container">

    <div style="text-align: center">
      <p style="color:red;font-size: 1.2em;padding-left: 5em"> 只有商品状态为明日有货的第二天才默认继续拿货，其余的状态要申请退款重新下单</p>
      <div style="width: 50% ;text-align: center;margin: 0px auto;" id="calendar" v-if="calendar_show">
          <inlineCalendar    mode="during"  :disabledDate="disabledDate"  :defaultDate="defaultDate" @change="on_calendar_change"/>
          <button @click="calendar_show = false">确定</button>
          <button @click="during_str='' ;calendar_show = false">取消</button>
      </div>

    </div>
    <div style="padding-left: 5em">
        <input v-model="query_q" style="width: 85%;height: 2em;max-width: 40em; " placeholder="订单号 ，收货人名，手机号，快递单号,淘宝订单号"/><button @click='on_orders_query(query_q)' style="margin-left: 0.5em">查询</button>
        <!--<label>时间选择</label><input @click="calendar_show = !calendar_show" v-model="during_str">-->
    </div>
    <ul  class = "status_ul" >
      <li ><a @click="on_order_filter({'status':goods_status2['未付款'],'order_remarks':remarks_type_selected},'未付款')" :class="{status_select:cur_order_status_filter==='未付款'}">未付款{{un_pay_counts}}</a></li>
      <li ><a @click="on_order_filter({'status':goods_status2['已付款']},'已付款')" :class="{status_select:cur_order_status_filter==='已付款'}">已付款{{is_payed_counts}}</a></li>
      <li ><a @click="on_order_filter({'status':goods_status2['已发货']},'已发货')" :class="{status_select:cur_order_status_filter==='已发货'}">已发货{{is_delivered_counts}}</a></li>
      <li ><a @click="on_order_filter({'status_list':goods_status2['已付款']+','+goods_status2['标签打印']+','+goods_status2['拿货中']+','+goods_status2['快递打印']+','+goods_status2['已拿货']+','+goods_status2['明日有货']+','+goods_status2['2-5天有货']+','+goods_status2['已下架']+','+goods_status2['其他']},'未发货')" :class="{status_select:cur_order_status_filter==='未发货'}">未发货 {{un_delivered_counts}}</a></li>
      <li ><a @click="on_order_filter({},'全部订单')" :class="{status_select:cur_order_status_filter==='全部订单'}">全部订单{{all_counts}}</a></li>
      <li ><a @click="on_order_filter({'refund_apply_status':'有售后订单'},'售后订单')" :class="{status_select:cur_order_status_filter==='售后订单'}">售后订单{{refund_counts}}</a></li>


      <li>

            <select style="font-size: 1.1em" v-model="remarks_type_selected">
              <option :value="option" v-for="(option,index) in remarks_type_options" :key="index">{{option}}</option>-->
            </select>
      </li>

      <li>

         <select  style="margin-left:0.5em;width: 5em"  v-model="order_by_selected">
          <option :value="option" v-for="(option,index) in order_by_options" :key="index">{{option.text}}</option>
         </select>
         <select  style="margin-left:0.5em;width: 5em"  v-model="seller_wangwang_selected">
          <option :value="option" v-for="(option,index) in seller_wangwang_options" :key="index">{{option.text}}</option>
         </select>
         <label @click="on_not_temp_art_no_click()" :class="{status_select:is_not_temp_art_no===true}" >不显示临时款号订单</label>
      </li>
    </ul>

    <div style="padding-left: 3em">
      <button @click="select_all_unpay_orders(is_all_unpay_order_selected)">全选{{selected_order_list.length}}</button>
      <button @click="orders_pay(go_pay_order_list)" v-if="cur_order_status_filter==='未付款'">合并付款</button>

      <label style="color: red"> 总计: {{go_pay_money_totals}} 元</label>
      <button @click="move_order_to_null_package(go_pay_order_list)" v-if="cur_order_status_filter==='未付款'">转至空包订单</button>
      <button @click="send_order_to_taobao(order_list)" v-if="cur_order_status_filter==='已发货'">选中的到淘宝发货</button>
      <!--<button  v-bind:value = "aselect_order_item_cache" id = "move_order_to_chuanmei" v-show="cur_order_status_filter==='未付款'">转至传美打印</button>-->
    </div>
    <div  class = "items_ul">
        <li  class="item_order" :class="{item_order_div_tip:item.is_recent_update===true}"   v-for="(item,index) in order_list" :key="index">

            <div  class="global_background order_div" >
            <table style="width: 98%" >
              <tr>
                <td style="width:80%">
                  <div style="float: left">
                    <input style="width: 2em;height: 2em" @change="check_box_change(item)" type="checkbox" v-model="item.is_order_selected" />
                  </div>


                    <div style="float: left">
                       <label  class="order_label"  >订单号：{{item.order_number}}</label>
                    </div>
                    <div style="float: left">
                      <label>店铺：{{item.wangwang_id}}</label>
                       <label  class="order_label"  style="color: red" v-if="item.tb_order_number!=='' && item.tb_order_number!==null " > 淘宝订单号：{{item.tb_order_number}}</label>
                    </div>
                     <div style="cursor:pointer; float: left;padding-left: 0.5em" @click="modify_remarks(item)">
                      <label   style="color: gray ;cursor:pointer;"    @click="modify_remarks(item)">▼</label>
                      <label style="cursor:pointer;color:red;padding-left: 0px"  v-if="item.order_remarks!== null && item.order_remarks!==''" @click="modify_remarks(item)">  {{item.order_remarks.remarks_type}}</label>
                      <label style="cursor:pointer;color:red;padding-left: 0px"  v-if="item.order_remarks!== null && item.order_remarks.remarks_text!==''" @click="modify_remarks(item)">  （{{item.order_remarks.remarks_text}}）</label>
                     </div>




                    <label> {{item.consignee_name}} {{item.consignee_phone}} {{item.consignee_address}}</label></td>
                <td style="text-align: right ;width:20% ">
                  <button @click="delete_order(item.order_number)" v-if="item.orderGoods[0].status == goods_status2['未付款']">删除订单</button>
                  <a class = "refund_apply_btn"  @click="alter_address(item)"   v-if="item.orderGoods[0].status == goods_status2['未付款']" >修改地址</a>
                  <!--<a class = "refund_apply_btn"  @click="alter_address(item)"  v-if="item.is_address_alter" >修改地址</a>-->

                </td>
              </tr>
            </table>
          </div>
              <div class="item_goods"  v-for="(goods,index2) in item.orderGoods">

                <img style="width: 3.5em; height: 3.5em;float: left" v-bind:src="goods.image_url"/>
                <div style="" >
                  <div style="   margin-bottom: 1em;">

                     <label style="color:red"  >{{goods.tb_goods_id}} </label>
                    <label :class="{yellow_background_color:goods.art_no==='临时款号'}" >商品:{{index2+1}}

                      {{goods.shop_market_name}}_{{goods.shop_floor}}_{{goods.shop_stalls_no}}_{{goods.art_no}}_{{goods.goods_price}}元_{{goods.goods_color}}_{{goods.goods_count}}件
                   </label>
                    <!--<button @click="test(goods)">修改商品</button>-->
                    <!--<a  @click="alter_goods(goods)"  style="margin-bottom: 1em" class = "refund_apply_btn" v-if="(goods_status[goods.status] ==='未付款' || goods_status[goods.status] ==='已付款' ||goods_status[goods.status] ==='明日有货' || goods_status[goods.status] ==='已下架' ||  goods_status[goods.status] ==='2-5天有货' ||  goods_status[goods.status] ==='其他' || goods_status[goods.status] ==='缺货') &&  refund_apply_status[goods.refund_apply_status] ==='无售后'">修改商品</a>-->
                    <a  @click="alter_goods(goods)"  style="margin-bottom: 1em" class = "refund_apply_btn" v-if="(goods_status[goods.status] ==='未付款' )">修改商品</a>
                  </div>

                   <div style="float:right;margin-right: 4em">
                           <label>{{goods.refund_apply.value}}</label>
                           <label>{{goods.goods_price}} x {{goods.goods_count}} =  {{goods.goods_price * goods.goods_count}}元 </label>
                            <a  @click="apply_click(goods,item)" class = "refund_apply_btn" v-if="goods_status[goods.status] ==='已发货' ">申请售后</a>
                            <a  @click="apply_refund(goods.goods_count,goods.goods_number,refund_apply_type['拦截发货'],'确定拦截发货吗？申请后不能恢复发货，系统自动转为售后订单')" class = "refund_apply_btn" v-if="(goods_status[goods.status] ==='拿货中') &&  (refund_apply_status[goods.refund_apply_status] ==='无售后') &&  item.orderGoods.length===1">拦截发货</a>
                            <a  @click="apply_refund(goods.goods_count,goods.goods_number,refund_apply_type['仅退款'], '确定申请退款吗？')" class = "refund_apply_btn" v-if="(goods_status[goods.status] ==='2-5天有货' || goods_status[goods.status] ==='已下架' || goods_status[goods.status] ==='已下架' || goods_status[goods.status] ==='明日有货' ||  goods_status[goods.status] ==='其他' || goods_status[goods.status] ==='已付款') &&  refund_apply_status[goods.refund_apply_status] ==='无售后'">申请退款</a>
                            <a  @click="goto_place_order_page(JSON.stringify(goods))" class = "refund_apply_btn">再次下单</a>
                           <!--<select @change="selectVal($event,goods)" >-->
                             <!--<option :value="option.value" v-for="(option,index) in options" :key="index">{{option.text}}</option>-->
                           <!--</select>-->
                  </div>

                    <div style="float: left" > <label style="width: 5em;float: left" >商品状态:</label>  <label style="width:3em;color: red" >{{goods_status[goods.status]}}  </label><label style="color: red" v-if="goods.log !== null && goods.log!==''">({{goods.log}})</label> </div>
                    <div  >
                      <label style="padding-left: 2em">申请类型:</label>
                      <label  style="color: red"  > {{ refund_apply_status[goods.refund_apply_status]}}</label>
                      <label style="padding-left: 2em">售后进度:</label>
                      <!--<label  style="color: red" :class="{red_color:refund_apply_status[goods.refund_apply_status]!=='无售后'}"> {{refund_apply_status[goods.refund_apply_status]}}</label>-->
                      <!--<label v-if="refund_apply_status[goods.refund_apply_status]!=='无售后' && goods.refund_apply.length === 0 " style="color: red" :class="{red_color:refund_apply_status[goods.refund_apply_status]!=='无售后'}"> （已处理）</label>-->
                      <!--<label v-else-if="refund_apply_status[goods.refund_apply_status]!=='无售后' && goods.refund_apply.length >0 " style="color: red" :class="{red_color:refund_apply_status[goods.refund_apply_status]!=='无售后'}"> （处理中）</label>-->
                      <label v-if="goods.refund_apply.length > 0 " style="color: red"  > {{ refund_apply_progress[goods.refund_apply[0].refund_apply_progress]}}</label>

                    </div>
                    <div v-if="goods.return_logistics_name !== null " ><label style="float: left">售后物流:</label><label  > {{goods.return_logistics_name}}:{{goods.return_logistics_number}}  </label> </div>
                   <label style="float:none;display:block;color: red"v-if="goods.customer_message!==null && goods.customer_message!==''">  我的留言：{{goods.customer_message}}</label>

                   <label style="float:none;display:block;color: red" v-if="goods.customer_service_message!==null && goods.customer_service_message!==''">   客服留言:{{goods.customer_service_message}}</label>

              </div>
              </div>
              <div>


                <label style="padding-left: 0.5em;color:red">拿/发货时间:{{return_format_time(item.update_time)}}</label>
                <label style="padding-left: 0.5em">订单总价：{{item.logistics_fee}} + {{item.agency_fee}}+ {{item.quality_testing_fee}}+{{item.orderGoodsTotalMoney}} =
                              {{item.logistics_fee + item.agency_fee + item.quality_testing_fee + item.orderGoodsTotalMoney}}
                </label>

              </div>
              <div>

                <label style="padding-left: 0.5em;">下单时间:{{item.add_time}}</label>
                <label>快递：{{item.logistics_name}}</label>
               <label>单号：{{item.logistics_number}}</label>
                <button @click="show_logistics_qr(item.logistics_number)" v-if="item.logistics_number!=='' && item.logistics_number !== null">二维码单号</button>
                <a  @click=" advance_logistics_number(item)"class = "refund_apply_btn" v-if="(item.logistics_number ==='' ||  item.logistics_number === null) && is_allow_advance_logistics_number(item)===true ">预支单号</a>
              </div>


        </li>
    </div>
    <table class="page_table">
      <tr>
        <td style=" cursor:pointer;"><a @click="firstPage">首页</a></td>
        <td style=" cursor:pointer;" v-if="prePageShow"><a  @click="prePage" style="">上一页</a></td>
        <td  style=" cursor:pointer;" v-if="nextPageShow"><a @click="nextPage">下一页</a></td>

      </tr>
    </table>
</div>
</template>

<script>
  import mtime from '../../utils/mtime.js';
   import mcommon_function from '../../utils/mcommon_function';
  import mGlobal from '../../utils/mGlobal';
  import  axios  from 'axios'

     //设为ttrue 就会带cookies 访问
    axios.defaults.withCredentials=true;
    export default {
      mixins:[mcommon_function],
      name: "MyOrder",
      data(){
          return{
            //是否筛选临时款号商品定案
            is_not_temp_art_no:false,
            calendar_show:false,
            defaultDate:[],
            disabledDate:[],
            during_str:"",
            // 选中订单数据缓存
            aselect_order_item_cache : [],

            // 加载数据后是否滚动到顶端
            is_scroll_top:true,
            un_pay_counts: "",
            is_delivered_counts : "",
            is_payed_counts : "",
            un_delivered_counts: "",
            refund_counts:"",
            all_counts: "",
            //未付款订单全选
            is_all_unpay_order_selected :true,
            cur_order_status_filter:"全部订单",
            // 合并付款总金额
            go_pay_money_totals :0,
            go_pay_order_list:[],
            selected_order_list:[],
            query_q :"",
            selected_op :"",
            order_by_selected :  {value:"",text:"请选择"},
            seller_wangwang_selected :  {value:"",text:"请选择"},
            order_by_options:[
              {value:"",text:"请选择"},
              {value:"update_time",text:"发货时间排序"},
              {value:"goods",text:"商品排序 "},

            ],
            seller_wangwang_options:[
              {value:"",text:"请选择"},
              {value:"moonlight539",text:"moonlight539"},
              {value:"chenqling3",text:"chenqling3 "},
              {value:"tb143754675",text:"tb143754675 "},

            ],
            options: [
            { text: '请选择', value: '' },
            { text: '退货退款', value: '1' },
            { text: '仅退款', value: '2' }
          ],
        remarks_type_selected :"",
        remarks_type_options:[
        "",
        "灰",
        "红",
        "黄",
        "绿",
        "蓝",
        "紫",
      ],
            logistics_name:{

            },
              refund_apply_type:mGlobal.REFUND_APPLY_TYPE,
              refund_apply_status :mGlobal.REFUND_APPLY_STATUS,
              refund_apply_progress:mGlobal.REFUND_APPLY_PROGRESS,
              goods_status: mGlobal.GOODS_STATUS,
              goods_status2: mGlobal.GOODS_STATUS2,

            prePageShow:true,
            nextPageShow:true,
            order_list:[],
            firstPageUrl:this.mGLOBAL.DJANGO_SERVER_BASE_URL+"/user/orders/",
            curPageUrl:"",
            prePageUrl:"",
            nextPageUrl:"",
          }
      },

      methods:{
          on_not_temp_art_no_click(){
            this.is_not_temp_art_no = !this.is_not_temp_art_no
          },
          on_calendar_change(date) {
            this.during_str = ""
            for(let i = 0;i<date.length;i++){
              let tem_date = date[i].format("YYYY-MM-DD")
              console.log();
              if(this.during_str !== ""){
                this.during_str = this.during_str+" / " +tem_date
              }else{
                this.during_str = tem_date
              }

            }

    },

          return_format_time(stmp){
            if (stmp === 0){
               return ""
            }
            return mtime.formatDateStrFromTimeSt(stmp)
          },
          // 修改商品信息
          alter_goods(order_goods){
            this.$orderGoodsBox.showMsgBox({
                  title: '修改商品信息',
                  content: '',
                  isShowInput: true,
                  orderGoods:order_goods,
                  orderGoodsBackUp:Object.assign({},order_goods),
              }).then(async (val) => {
                  this.refresh_cur_page();


              }).catch(() => {
                  // ...
              });
      },
          // 是否允许预支单号
          is_allow_advance_logistics_number(order_item){

            // 已退款数量
            let yituikuan_number = 0
            let order_goods_list = order_item["orderGoods"]
            for(let i = 0;i< order_goods_list.length;i++){
               if(order_goods_list[i]['status'] === this.goods_status2["已退款"]){
                 yituikuan_number = yituikuan_number+1
               }
               if(order_goods_list[i]['status'] !== this.goods_status2["已拿货"] && order_goods_list[i]['status'] !== this.goods_status2["已退款"]){
                 return false
               }
               if(order_goods_list.length === yituikuan_number){
                 return false

               }
            }
            return true
          },
          advance_logistics_number(item){
            let order_number = item.order_number
            let order_number_list = []
            order_number_list.push(order_number)
            const user_url = mGlobal.DJANGO_SERVER_BASE_URL+"/user/bl_get_order_logistics_number/"
            axios.post(user_url,{"order_number_list":order_number_list}).then((res)=>{
              console.log("res--->",res)
              if(res.data.code ==="1000"){
                  let success_order_list = res.data.success_list
                  for(let i = 0 ;i< success_order_list.length;i++){
                  if(success_order_list[i]['order_number'] ===order_number ){
                    item.logistics_number = success_order_list[i]['advance_logistics_number']
                    console.log("item------",item)
                     return success_order_list[i]['order_number']
                  }
                }
              }

              return ""
            }).catch(error=>{
                console.log("请求错误")
            })

        },
          // 用二维码显示物理单号
          show_logistics_qr(logistics_number){
            if(logistics_number.toString().trim() === ""){
              alert("单号不能为空")
              return
            }
          this.$qrBox2.showMsgBox({
                  title: '二维码',
                  qr_value: logistics_number,
                  content: '用淘宝等平台的扫码填单功能扫上面的二维码',
                  isShowInput: true,
                  isShowConfimrBtn :true,
                  confirmBtnText :"关闭",
                  isShowCancelBtn :false,
              }).then(async (val) => {
            })

          },
          check_box_change(item){

             this.go_pay_order_list = this.get_unpay_order_list();
             this.selected_order_list = this.get_selected_order_list();
             this.go_pay_money_totals = this.calc_unpay_order_moneys(this.go_pay_order_list)
             this.aselect_order_item_cache = JSON.stringify(this.go_pay_order_list)
          },

        // 计算未付款订单金额
        calc_unpay_order_moneys(go_pay_order_list){
            // go_pay_order_list = this.get_unpay_order_list();
            let go_pay_money_totals = 0;
            console.log(go_pay_order_list)
            for(let i  = 0;i<go_pay_order_list.length;i++){
              go_pay_money_totals = go_pay_money_totals+ go_pay_order_list[i].total_price
              console.log(go_pay_money_totals)
            }
            return go_pay_money_totals
        },

        select_all_unpay_orders(is_selected){
            //选中准备付款的订单
            this.go_pay_order_list = []

             for(let i = 0;i< this.order_list.length;i++){
              let is_continue = true
              for(let g = 0 ; g< this.order_list[i].orderGoods.length;g++){
                    this.$delete(this.order_list[i], 'is_order_selected');
                    this.$set(this.order_list[i], 'is_order_selected', is_selected);
                  // if(this.order_list[i].orderGoods[g].status !== mGlobal.GOODS_STATUS2['未付款']){
                  //   // 不是未付款的 跳过
                  //   is_continue = false
                  // }else{
                  //
                  //   this.$delete(this.order_list[i], 'is_order_selected');
                  //   this.$set(this.order_list[i], 'is_order_selected', is_selected);
                  //
                  //
                  // }
                }
            }
            this.is_all_unpay_order_selected = !is_selected;

            this.go_pay_order_list = this.get_unpay_order_list()
            this.selected_order_list = this.get_selected_order_list()
            this.go_pay_money_totals = this.calc_unpay_order_moneys(this.go_pay_order_list)
        },
         go_tb_send_order_page(order_list,logistics_name){
    let tb_order_number = ""
    for (let i = 0 ;i<order_list.length;i++){
        tb_order_number = tb_order_number + order_list[i].tb_order_number+","
    }
    let url = "https://wuliu.taobao.com/user/batch_consign.htm?trade_ids="+tb_order_number
           // url = url+"2717022096459639556,"
           console.log("准备跳转的url:",url)
    window.open(url)
},
        // 统计当前已选的未付款订单
        get_unpay_order_list(){
            let go_pay_order_list= []
            for(let i = 0;i< this.order_list.length;i++){
              console.log(this.order_list[i].is_order_selected)
              let is_continue = true
              if(this.order_list[i].is_order_selected ===true){
                for(let g = 0 ; g< this.order_list[i].orderGoods.length;g++){
                  if(this.order_list[i].orderGoods[g].status !== mGlobal.GOODS_STATUS2['未付款']){
                    is_continue = false
                  }
                }
                if(is_continue === true){
                   go_pay_order_list.push(this.order_list[i])
                }

              }
            }
            return  go_pay_order_list
        },
        // 已选择订单
        get_selected_order_list(){
            let selected_order_list= []
            for(let i = 0;i< this.order_list.length;i++){
              console.log(this.order_list[i].is_order_selected)

              if(this.order_list[i].is_order_selected ===true){


                   selected_order_list.push(this.order_list[i])


              }
            }
            return  selected_order_list
        },
          //订单支付
          orders_pay(go_pay_order_list){

            let go_pay_order_number_list = []
            if(go_pay_order_list.length===0){
              this.$toast("请选择未付款订单")
              return
            }

            for(let i=0;i<go_pay_order_list.length;i++){
              go_pay_order_number_list.push(go_pay_order_list[i].order_number)
            }
            console.log(go_pay_order_number_list)
            this.go_order_pay({"order_list":go_pay_order_number_list})
          },

          move_order_to_null_package(go_move_order_list){

            let go_move_order_id_list = []
            if(go_move_order_list.length===0){
              this.$toast("请选择未付款订单")
              return
            }

            for(let i=0;i<go_move_order_list.length;i++){
              go_move_order_id_list.push(go_move_order_list[i].order_number)
            }
            console.log(go_move_order_id_list)
            let data = {"order_number_list":go_move_order_id_list}
            const user_url = mGlobal.DJANGO_SERVER_BASE_URL+"/user/moveOrderToNullOrderTem/"
            axios.post(user_url,data).then((res)=>{
              console.log("res--->",res)
              if(res.data.code ==="1000"){
                if(confirm("提交成功，是否跳转到空包页面继续？")){
                   this.$router.push({path:"/pc/nullPackageHome/pNullOrder"})
                }else{
                  this.refresh_cur_page()
                }
              }
            }).catch(error=>{
                console.log("请求错误")
            })



          },
          send_order_to_taobao(send_order_list){

            let go_send_order_list = []

            let order_number_list_str = ""
            for(let i=0;i<send_order_list.length;i++){
              if(send_order_list[i].tb_order_number!==undefined && send_order_list[i].tb_order_number!==null  && send_order_list[i].tb_order_number !== "" && send_order_list[i].is_order_selected === true){
                go_send_order_list.push(send_order_list[i])

              }

            }
            let new_order_list = []
                           // 根据物流分类储存
            let order_list_sort_object = {}
            for(let g = 0 ;g<go_send_order_list.length;g++){
                  if (go_send_order_list[g].logistics_number !==null && go_send_order_list[g].logistics_number !==''){
                          new_order_list.push(go_send_order_list[g])
                          if(order_list_sort_object[go_send_order_list[g].logistics_name] === undefined ){
                               let new_list =  [];
                              new_list.push(go_send_order_list[g])
                              order_list_sort_object[go_send_order_list[g].logistics_name] = new_list
                          }else{
                               order_list_sort_object[go_send_order_list[g].logistics_name].push(go_send_order_list[g])
                          }
                     }
                 }
                console.log("order_list_sort_object------->",order_list_sort_object)

            for(let key in order_list_sort_object){
                   let order_list = order_list_sort_object[key]
                   let logistics_name = key
                  console.log("sendMessage-------order_list>",order_list)
                   this.go_tb_send_order_page(order_list,logistics_name)


               }




          },
          move_order_to_chuanmei(go_move_order_list){
            console.log(go_move_order_list)

          },
          go_order_pay(data){
            const user_url = mGlobal.DJANGO_SERVER_BASE_URL+"/user/details/-1/"
            axios.get(user_url).then((res)=>{
              if(res.data.code ==="1000"){

                this.show_order_pay_box(data,this.go_pay_money_totals,res.data.user.balance)
              }
            }).catch(error=>{
                console.log("请求错误")
            })

             return false

          },
          to_stop_deliver(data){

            this.$msgBox.showMsgBox({
                  title: '支付',
                  content: '拦截发货先预付 2元/每件 退货费用，如果实际未拿货，费用(2元/件)系统会自动退回到账户"',
                  isShowInput: true
              }).then(async (val) => {
                   const url = this.mGLOBAL.DJANGO_SERVER_BASE_URL+"/user/refundApply/";
                   console.log(val)
                   if(val ==="" || typeof(val) ==="undefined"){
                     this.$toast("密码不能为空")
                     return
                   }
                   data['pay_pwd'] = val
                   axios.post(url,data).then((res)=>{
                   if(res.data.code === "1000"){
                        this.$toast("支付成功")
                       this.refresh_cur_page();
                   }else if(res.data.code === "1001"){
                       console.log("支付失败")
                      alert(res.data.message+" 请刷新")
                     return false
                   }
                    }).catch(error => {
                         alert("提交失败")
                    })

              }).catch(() => {
                  // ...
              });
          },
          show_order_pay_box(data,go_pay_money_totals, user_balance){
             this.$msgBox.showMsgBox({
                  title: '订单支付',
                  content: '支付金额'+go_pay_money_totals+' ，账户余额'+user_balance,
                  isShowInput: true
              }).then(async (val) => {
                   const url = this.mGLOBAL.DJANGO_SERVER_BASE_URL+"/user/ordersPay/";
                   console.log(val)
                   if(val ==="" || typeof(val) ==="undefined"){
                     this.$toast("密码不能为空")
                     return
                   }
                   data['pay_pwd'] = val
                   axios.post(url,data).then((res)=>{
                   if(res.data.code === "1000"){
                        this.$toast("支付成功")
                        this.go_pay_order_list = []
                        this.go_pay_money_totals = this.calc_unpay_order_moneys(this.go_pay_order_list)
                       this.refresh_cur_page();
                   }else if(res.data.code === "1001"){
                       console.log("支付失败")
                      alert(res.data.message+" 请刷新")
                     return false
                   }
                    }).catch(error => {
                         alert("提交失败")
                    })

              }).catch(() => {
                  // ...
              });
          },
      // 修改订单地址
         alter_address(order){
            let name = order.consignee_name
            let phone = order.consignee_phone;
            let address_arr = order.consignee_address.split(',')
            let province = address_arr[0]
            let city = address_arr[1]
            let area = address_arr[2]
            let address_detail = address_arr[3]
            let orderBackUp = {
              'name':name,
              'phone':phone,
              'province':province,
              'city':city,
              'area':area,
              'address_detail' : address_detail
            }
            this.$orderAddressBox.showMsgBox({
                  title: '修改地址信息',
                  isShowInput: false,
                  order:order,
                  orderBackUp:orderBackUp
              }).then(async (val) => {

                   // axios.post(url,data).then((res)=>{)
                   // if(res.data.code === "1000"){
                   //      this.$toast("支付成功")
                   //     this.refresh_cur_page();
                   // }else if(res.data.code === "1001"){
                   //     console.log("支付失败")
                   //    alert(res.data.message+" 请刷新")
                   //   return false
                   // }
                   //  }).catch(error => {
                   //       alert("提交失败")
                   //  })

              }).catch(() => {
                  // ...
              });
      },

        // 修改备注信息
         modify_remarks(item){


            this.$orderRemarksBox.showMsgBox({
                  title: '修改备注信息',
                  isShowInput: false,

                  item:item,

              }).then(async (val) => {



              }).catch(() => {
                  // ...
              });
      },

          // 删除订单(未付款订单)
          delete_order(order_number){
              if(!confirm("确定删除订单吗？删除后不可恢复。")) {
                return ;
              }
            const url = this.mGLOBAL.DJANGO_SERVER_BASE_URL+"/user/orders/"+order_number+"/";
            axios.delete(url).then((res)=>{
             if(res.data.code === "1000"){
               alert("删除订单成功")

                this.refresh_cur_page();
             }else if(res.data.code === "1001"){
                alert("删除订单失败")
             }
        }).catch(error => {
             alert("访问错误")
        })
          },
          on_order_filter(query_data,btn_tag){
             // let query_data ;
            console.log(query_data)
            console.log("btn_tag",btn_tag)

              if (this.order_by_selected.text !=="请选择"){
                Object.assign(query_data,{'order_by':this.order_by_selected.value})

            }
             if (this.seller_wangwang_selected.text !=="请选择"){
                Object.assign(query_data,{'seller_wangwang_id':this.seller_wangwang_selected.value})

            }
             if (this.is_not_temp_art_no === true){
                Object.assign(query_data,{'not_art_no':"临时款号"})

            }

            this.cur_order_status_filter = btn_tag

            this.order_list = []
            const url = this.mGLOBAL.DJANGO_SERVER_BASE_URL+"/user/orders/";

            this.loadOrderPage(url,query_data)
          },


           on_orders_query(query_keys){

             console.log(query_keys)
            const url = this.mGLOBAL.DJANGO_SERVER_BASE_URL+"/user/orders/";
            let query_data = {"q":query_keys.trim()};
            this.loadOrderPage(url,query_data)
          },
            apply_refund(goods_count,goods_number, refund_apply_type,alter_message){


              if(!confirm(alter_message)) {
                return ;
              }
              let data_ = {
              "goods_counts":goods_count,
              "goods_number":goods_number,
              "refund_apply_type":refund_apply_type,
            }
              if (refund_apply_type === mGlobal.REFUND_APPLY_TYPE["拦截发货"]){
                  this.to_stop_deliver(data_)
              }else{

                const url = this.mGLOBAL.DJANGO_SERVER_BASE_URL+"/user/refundApply/";
                axios.post(url,data_).then((res)=>{
                 if(res.data.code === "1000"){
                   this.$toast("提交成功");
                   console.log("提交成功")
                    this.refresh_cur_page();
                 }else if(res.data.code === "1001"){
                    alert(res.data.message+" 请刷新")
                 }
            }).catch(error => {
                 alert("提交失败")
            })
              }

       },

        //刷新当前页面
        refresh_cur_page(goods_status){
              let cur_page_url = "";

              this.is_scroll_top = false;
              console.log("this.nextPageUrl",this.nextPageUrl)
              console.log("this.prePageUrl",this.prePageUrl)
             let url_params = {}
              let base_url = this.mGLOBAL.DJANGO_SERVER_BASE_URL+"/user/orders/"
            if(this.nextPageUrl !== null && this.nextPageUrl !==""){
             base_url = this.nextPageUrl.substring(0,this.nextPageUrl.indexOf("?"));

              // let next_page_num_arr= this.nextPageUrl.match(/page=\d+/);
              // let next_page_num = next_page_num_arr[0].split("=")[1]
              //
              // let cur_page_num = parseInt(next_page_num)-1;
              // cur_page_url = base_url+"?page="+cur_page_num;
              //********************************************************
              url_params = this.mcommon_return_url_params(this.nextPageUrl)
              console.log("下一页获取的参数： ",url_params)
              if(url_params["page"]===undefined){
                url_params["page"] = 1
              }
              url_params["page"] = parseInt(url_params["page"])-1;
              //********************************************************

            }else if(this.prePageUrl !== null && this.prePageUrl !==""){
              base_url = this.prePageUrl.substring(0,this.prePageUrl.indexOf("?"));
               // let pre_page_num_arr= this.prePageUrl.match(/page=\d+/);
               //  let pre_page_num = 1
               // if(pre_page_num_arr === null){
               //   //第二页的时候上一页没有页码
               //   pre_page_num  = 1
               // }else{
               //   pre_page_num = pre_page_num_arr[0].split("=")[1];
               // }
               //
               //
               //
               // let  cur_page_num = parseInt(pre_page_num)+1;
               // cur_page_url = base_url+"?page="+cur_page_num;


              //********************************************************
              url_params = this.mcommon_return_url_params(this.prePageUrl)
              console.log("上一页 一页获取的参数： ",url_params)
              if(url_params["page"]===undefined){
                url_params["page"] = 1
              }
              url_params["page"] = parseInt(url_params["page"])+1;
              //********************************************************

            }
            console.log("cur_page_url",cur_page_url)
            let query_data =""
            // if(this.cur_order_status_filter!==""){
            //     if(this.cur_order_status_filter ==="未付款"){
            //
            //       query_data = {"status":this.goods_status2["未付款"]}
            //     }else if(this.cur_order_status_filter ==="已发货"){
            //       query_data = {"status":this.goods_status2["已发货"]}
            //     }else if(this.cur_order_status_filter ==="已付款"){
            //       query_data = {"status":this.goods_status2["已付款"]}
            //     }else if(this.cur_order_status_filter ==="全部订单"){
            //
            //     }
            // }
            cur_page_url = base_url+"?"
            for(let key in url_params){
              cur_page_url = cur_page_url+key+"="+url_params[key]+"&"
            }
            cur_page_url = cur_page_url.substring(0,cur_page_url.length-1)
            if(this.curPageUrl !==""){
              cur_page_url = this.curPageUrl
            }
            console.log("即将刷新当前页面地址为："+cur_page_url)
             this.loadOrderPage(cur_page_url);
        },
        goto_place_order_page(data){

          this.$router.push({path:"/pc/home/porder",query:{data:data}})
        },

        apply_click(goods,order){

              // this.$router.push({path:"/pc/refund",query:{goods:goods,order:order}})
               //传参传对象当跳转后的页面刷新参数会丢失 用字符串传不会丢失
              this.$router.push({path:"/pc/refund",query:{order_goods_id:goods.id,order:JSON.stringify(order)}})
        },

          replaceData() {
            let cur_time_stmp = new Date().getTime()
            console.log("当前时间：",cur_time_stmp)
            for(let i = 0;i<this.order_list.length;i++){
               let item =  this.order_list[i];
               let  mdate = mtime.formatDateStrFromTimeSt(item.add_time);

              if(item.update_time!==0){
                 let recent_time = cur_time_stmp - item.update_time
                 let three_min  = 3 * 60 * 1000

                if(recent_time < three_min){
                  item["is_recent_update"] = true
                }

              }

              item.add_time =mdate;
              let is_address_alter = true
              let orderGoodsTotalMoney = 0;
              for(let g = 0; g < item.orderGoods.length;g++){
                 if(item.orderGoods[g].status !== mGlobal.GOODS_STATUS2['已退款']){
                  orderGoodsTotalMoney = orderGoodsTotalMoney + item.orderGoods[g].goods_price * item.orderGoods[g].goods_count
                }

              }

              for(let g = 0; g < item.orderGoods.length;g++){
                   if(item.orderGoods[g].status !== this.goods_status2['已付款'] && item.orderGoods[g].status !== this.goods_status2['未付款']){
                    is_address_alter = false
                     break;
                  }
              }
              item['orderGoodsTotalMoney'] = orderGoodsTotalMoney
              item['is_order_selected'] = false
              item['is_address_alter'] = is_address_alter
            }

            console.log("after replace data：",this.order_list)
          },

          prePage(){
            this.is_scroll_top = true
            console.log(this.prePageUrl)
            this.loadOrderPage(this.prePageUrl)
          },

          nextPage(){
            this.is_scroll_top = true
            console.log(this.nextPageUrl)
            this.loadOrderPage(this.nextPageUrl)
          },

          firstPage(){
            this.is_scroll_top = true
            if(this.firstPageUrl!==""){
              this.loadOrderPage(this.firstPageUrl)
            }

          },
        loadOrderPage(url,query_data){
             console.log("query_data",query_data)
           if(query_data!=="" && query_data !== undefined){

              this.curPageUrl = url +"?"
             for(let key in query_data){
               this.curPageUrl = this.curPageUrl +key+"="+query_data[key]+"&"
             }
             this.curPageUrl = this.curPageUrl.substring(0,this.curPageUrl.length-1)
             console.log("有参数url：",this.curPageUrl)
           }else{
             this.curPageUrl = url
             console.log("wu参数url：",this.curPageUrl)
           }

           axios.defaults.withCredentials=true;
           this.$axios.get(url,{
              params:query_data,
          }
        ).then((res)=>{
          console.log(res.data)
          this.order_list = res.data.results;
          if(this.is_scroll_top){
            window.scrollTo(0,0);
          }

          this.replaceData()

          this.update_order_counts(this.cur_order_status_filter,res.data.count)
          if(res.data.previous == null){
            this.prePageShow = false;
          }else{
              this.prePageShow = true;
          }
           this.prePageUrl = res.data.previous;

          if(res.data.next == null){
            this.nextPageShow = false;
          }else{
            this.nextPageShow = true;
          }
           this.nextPageUrl = res.data.next;

        }).catch(error => {
          this.$toast("加载错误哦")
          console.log(error) ;
        })
        },
        // 更新显示订单数量
        update_order_counts(cur_order_status_filter,counts){
                if(this.cur_order_status_filter ==="未付款"){

                   this.un_pay_counts = counts
                }else if(this.cur_order_status_filter ==="已发货"){
                   this.is_delivered_counts = counts
                }else if(this.cur_order_status_filter ==="已付款"){
                   this.is_payed_counts = counts
                }else if(this.cur_order_status_filter ==="未发货"){
                   this.un_delivered_counts = counts
                }else if(this.cur_order_status_filter ==="全部订单"){
                  this.all_counts = counts
                }else if(this.cur_order_status_filter ==="售后订单"){
                  this.refund_counts = counts
                }
        },


      },
      watch:{
        'order_list': {
          deep: true,
　　　　  handler(new_order_list, old_order_list) {
                console.log("order_list")
                console.log(new_order_list)
　　　　  },
         }
      },
      created(){
          // const url = this.mGLOBAL.DJANGO_SERVER_BASE_URL+"/user/orders/?access_token="+this.$cookies.get("access_token");
          const url = this.mGLOBAL.DJANGO_SERVER_BASE_URL+"/user/orders/"
          this.loadOrderPage(url);
      },
      mount(){

      }
    }
</script>

<style scoped>
  @import "../../../static/css/PGLOBALCSS.css";
  .status_ul{
      display: block;
      height: 1.5em;
  }

  .status_select{
    background: #f0f0f0 ;
    color: #3bb4f2;
    border:gainsboro solid 1px;
  }
  .status_ul li{
    list-style: none;
    float: left;
  }
   .status_ul a{
     list-style: none;
     padding: 0.3em;
     cursor: pointer;
  }
  .condition_ul{
      display: block;
      height: 1.5em;
  }

  .condition_select{
    background: #f0f0f0 ;
    color: #3bb4f2;
    border:gainsboro solid 1px;
  }
  .condition_ul li{
    list-style: none;
    font-size: 0.8em;
    float: left;
  }
   .condition_ul a{
     list-style: none;
     padding: 0.3em;
     cursor: pointer;
  }
  .red_color{
    color: red;
  }
  .yellow_background_color{
    background: yellow;
  }
  .item_order{
    margin-top: 2em;
    padding-bottom: 0.5em;
    border-top:1px solid gray;

  }
  .item_order_div_tip{

    border: 1px solid red;
  }
  .items_ul{
    padding-top: 0px;
    margin-top: 0px;
  }
.items_ul li{
  list-style: none;
}
  .container{
    width: 100%;
    height: 1000px;
    margin: 0 auto;
    text-align: left;

  }
  .page_table{
    margin: 0 auto;
    float: bottom;
    font-size: 2em;
  }

  .order_div {
    width: 100%;
    padding-top: 0.5em;
    padding-bottom: 0.5em;
    color: #000;
  }
  /*.item_goods label{*/
    /*display: block; padding-bottom: 0.4em*/
  /*}*/


  .item_goods{
    margin-bottom: 1.5em;

    background: #f0f0f0;
    padding-left: 1.5em

  ;
  }
  .order_div label{
  text-align: left;
    padding-left: 0.5em;
  display: inline-block;

}

  .refund_apply_btn{
    cursor:pointer;
    width: 4em;
    height: 2em;
    margin-top: 2px;
    margin-bottom: 2px;

    color: #fff;
   padding: 0.2em;
    font-size: 1.0em;
    border-radius: 4px;
  background: #3bb4f2;
  border-color: #3bb4f2;
  }

</style>
