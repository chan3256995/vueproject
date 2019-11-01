<template>
  <div id= 'container_id' class="container">
    <div style="padding-left: 5em">
        <input v-model="query_q" style="width: 85%;height: 2em;max-width: 40em; " placeholder="订单号 ，收货人名，手机号，快递单号"/><button @click='on_orders_query(query_q)' style="margin-left: 0.5em">查询</button>
      </div>
    <ul  class = "status_ul" >
      <li ><a @click="on_order_filter({'status':goods_status2['未付款']},'未付款')" :class="{status_select:cur_order_status_filter==='未付款'}">未付款{{un_pay_counts}}</a></li>
      <li ><a @click="on_order_filter({'status':goods_status2['已付款']},'已付款')" :class="{status_select:cur_order_status_filter==='已付款'}">已付款{{is_payed_counts}}</a></li>
      <li ><a @click="on_order_filter({'status':goods_status2['已发货']},'已发货')" :class="{status_select:cur_order_status_filter==='已发货'}">已发货{{is_delivered_counts}}</a></li>
      <li ><a @click="on_order_filter({'status_list':goods_status2['已付款']+','+goods_status2['标签打印']+','+goods_status2['拿货中']+','+goods_status2['已拿货']+','+goods_status2['明日有货']+','+goods_status2['2-5天有货']+','+goods_status2['其他']},'未发货')" :class="{status_select:cur_order_status_filter==='未发货'}">未发货 {{un_delivered_counts}}</a></li>
      <li ><a @click="on_order_filter(-1,'全部订单')" :class="{status_select:cur_order_status_filter==='全部订单'}">全部订单{{all_counts}}</a></li>
      <li ><a @click="on_order_filter({'refund_apply_status':'有售后订单'},'售后订单')" :class="{status_select:cur_order_status_filter==='售后订单'}">售后订单{{refund_counts}}</a></li>

    </ul>
    <div style="padding-left: 3em" v-if="cur_order_status_filter==='未付款'">
      <button @click="select_all_unpay_orders(is_all_unpay_order_selected)">全选</button>
      <button @click="orders_pay(go_pay_order_list)" v-if="cur_order_status_filter==='未付款'">合并付款</button><label style="color: red"> 总计: {{go_pay_money_totals}} 元</label>

    </div>

    <div  class = "items_ul">
        <li class="item_order " v-for="(item,index) in order_list" :key="index">
          <div  class="global_background order_div" >
            <table  >
              <tr>
                <td style="width:90%">
                   <input style="width: 1.2em;height: 1.2em" @change="check_box_change(item)" type="checkbox" v-model="item.is_order_selected" v-if="cur_order_status_filter==='未付款'"/>
                    <label  class="order_label" >订单号：{{item.order_number}}</label>
                    <label> {{item.consignee_name}} {{item.consignee_phone}} {{item.consignee_address}}</label></td>
                <td><button @click="delete_order(item.order_number)" v-if="item.orderGoods[0].status == goods_status2['未付款']">删除订单</button></td>
              </tr>
            </table>

          </div>

              <div class="item_goods"  v-for="(goods,index2) in item.orderGoods">
                <div>
                  <label>商品:{{index2+1}}
                    {{goods.shop_market_name}}_{{goods.shop_floor}}_{{goods.shop_stalls_no}}_{{goods.art_no}}_{{goods.goods_price}}元_{{goods.goods_color}}_{{goods.goods_count}}件
                 </label>
                </div>

                 <div style="float:right;margin-right: 4em">
                         <label>{{goods.refund_apply.value}}</label>
                         <label>{{goods.goods_price}} x {{goods.goods_count}} =  {{goods.goods_price * goods.goods_count}}元 </label>
                          <a  @click="apply_click(goods,item)" class = "refund_apply_btn" v-if="goods_status[goods.status] ==='已发货' ">申请售后</a>
                          <!--<a  @click="apply_refund(goods.goods_number,refund_apply_type['拦截发货'],'确定拦截发货吗？申请后不能恢复发货，系统自动转为售后订单')" class = "refund_apply_btn" v-if="(goods_status[goods.status] ==='拿货中' ||  goods_status[goods.status] ==='已拿货') &&  refund_apply_status[goods.refund_apply_status] ==='无售后' ">拦截发货</a>-->
                          <a  @click="apply_refund(goods.goods_number,refund_apply_type['仅退款'], '确定申请退款吗？')" class = "refund_apply_btn" v-if="(goods_status[goods.status] ==='2-5天有货' || goods_status[goods.status] ==='已下架' || goods_status[goods.status] ==='已下架' || goods_status[goods.status] ==='明日有货' ||  goods_status[goods.status] ==='其他' || goods_status[goods.status] ==='已付款') &&  refund_apply_status[goods.refund_apply_status] ==='无售后'">申请退款</a>
                          <a  @click="goto_place_order_page(JSON.stringify(goods))" class = "refund_apply_btn">再次下单</a>
                         <!--<select @change="selectVal($event,goods)" >-->
                           <!--<option :value="option.value" v-for="(option,index) in options" :key="index">{{option.text}}</option>-->
                         <!--</select>-->
                </div>

                  <div style="float: left" > <label style="width: 5em;float: left" >商品状态:</label>  <label style="width:3em;color: red" >{{goods_status[goods.status]}}  </label> </div>
                  <div  >
                    <label style="padding-left: 2em">售后状态:</label>
                    <label  style="color: red" :class="{red_color:refund_apply_status[goods.refund_apply_status]!=='无售后'}"> {{refund_apply_status[goods.refund_apply_status]}}</label>
                    <label v-if="refund_apply_status[goods.refund_apply_status]!=='无售后' && goods.refund_apply.length === 0 " style="color: red" :class="{red_color:refund_apply_status[goods.refund_apply_status]!=='无售后'}"> （已处理）</label>
                    <label v-else-if="refund_apply_status[goods.refund_apply_status]!=='无售后' && goods.refund_apply.length >0 " style="color: red" :class="{red_color:refund_apply_status[goods.refund_apply_status]!=='无售后'}"> （处理中）</label>
                  </div>
                  <div v-if="goods.return_logistics_name !== null " ><label style="float: left">售后物流:</label><label  > {{goods.return_logistics_name}}:{{goods.return_logistics_number}}  </label> </div>
                 <!--<label style="display:block;color: red" >   下单备注：{{goods.customer_message}}</label>-->
                 <label style="float:none;display:block;color: red">   客服留言:{{goods.customer_service_message}}</label>

              </div>
              <div>
                <label style="padding-left: 0.5em">订单总价：{{item.logistics_fee}} + {{item.agency_fee}}+ {{item.quality_testing_fee}}+{{item.orderGoodsTotalMoney}} =
                              {{item.logistics_fee + item.agency_fee + item.quality_testing_fee + item.orderGoodsTotalMoney}}
                </label>
              </div>
              <div>
                <label style="padding-left: 0.5em">下单时间:{{item.add_time}}</label>
                <label>快递：{{item.logistics_name}}</label>
               <label>单号：{{item.logistics_number}}</label>
                <button @click="show_logistics_qr(item.logistics_number)" v-if="item.logistics_number!=='' && item.logistics_number !== null">二维码单号</button>
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
  import mGlobal from '../../utils/mGlobal';
    import  axios  from 'axios'

     //设为ttrue 就会带cookies 访问
    axios.defaults.withCredentials=true;
    export default {
        name: "MyOrder",
      data(){
          return{
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
            query_q :"",
            selected_op :"",

            options: [
            { text: '请选择', value: '' },
            { text: '退货退款', value: '1' },
            { text: '仅退款', value: '2' }
          ],

            logistics_name:{

            },
              refund_apply_type:mGlobal.REFUND_APPLY_TYPE,
              refund_apply_status :mGlobal.REFUND_APPLY_STATUS,
              goods_status: mGlobal.GOODS_STATUS,
              goods_status2: mGlobal.GOODS_STATUS2,

            prePageShow:true,
            nextPageShow:true,
            order_list:[],
            firstPageUrl:this.mGLOBAL.DJANGO_SERVER_BASE_URL+"/user/orders/",
            prePageUrl:"",
            nextPageUrl:"",
          }
      },

      methods:{

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
            this.go_pay_money_totals = this.calc_unpay_order_moneys(this.go_pay_order_list)
          },

        // 计算未付款订单金额
        calc_unpay_order_moneys(go_pay_order_list){
            // go_pay_order_list = this.get_unpay_order_list();
            let go_pay_money_totals = 0;
            console.log("ggggggggggggggggggggggg")
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
            if(this.cur_order_status_filter !== "未付款"){
              return
            }
             for(let i = 0;i< this.order_list.length;i++){
              let is_continue = true
              for(let g = 0 ; g< this.order_list[i].orderGoods.length;g++){
                  if(this.order_list[i].orderGoods[g].status !== mGlobal.GOODS_STATUS2['未付款']){
                    // 不是未付款的 跳过
                    is_continue = false
                  }else{
                    console.log(is_selected)
                    this.$delete(this.order_list[i], 'is_order_selected');
                    this.$set(this.order_list[i], 'is_order_selected', is_selected);


                  }
                }
            }
            this.is_all_unpay_order_selected = !is_selected;

            this.go_pay_order_list = this.get_unpay_order_list()
            this.go_pay_money_totals = this.calc_unpay_order_moneys(this.go_pay_order_list)
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

          go_order_pay(data){
            const user_url = mGlobal.DJANGO_SERVER_BASE_URL+"/user/details/-1/"
            axios.get(user_url).then((res)=>{
              if(res.data.code ==="1000"){
                console.log("**************************************")
                console.log(res.data)

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
                  content: '支付金额 2元 + 1元手续费 = 3元"',
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
          // 删除订单(未付款订单)
          delete_order(order_number){
              if(!confirm("确定删除订单吗？删除后不可恢复。")) {
                return ;
              }
            const url = this.mGLOBAL.DJANGO_SERVER_BASE_URL+"/user/orders/"+order_number+"/";
            axios.delete(url).then((res)=>{
             if(res.data.code === "1000"){
               alert("删除订单成功")
               console.log("删除订单成功")
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
            console.log("2555555555555555555555")
            console.log(query_data)
            this.cur_order_status_filter = btn_tag

            this.order_list = []
            const url = this.mGLOBAL.DJANGO_SERVER_BASE_URL+"/user/orders/";
            container_id.scrollIntoView()
            this.loadOrderPage(url,query_data)
          },


           on_orders_query(query_keys){

             console.log(query_keys)
            const url = this.mGLOBAL.DJANGO_SERVER_BASE_URL+"/user/orders/";
            let query_data = {"q":query_keys.trim()};
            this.loadOrderPage(url,query_data)
          },
            apply_refund(goods_number, refund_apply_type,alter_message){


              if(!confirm(alter_message)) {
                return ;
              }
              let data_ = {
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
              let cur_page_num ;
              console.log("-------------------------------")
              console.log(this.nextPageUrl)
              console.log("********************************")
              console.log(this.prePageUrl)

            if(this.nextPageUrl !== null && this.nextPageUrl !==""){
              let next_page_num_arr= this.nextPageUrl.match(/page=\d/);
              let next_page_num = next_page_num_arr[0].split("=")[1]
              let base_url = this.nextPageUrl.substring(0,next_page_num_arr.index);
              let cur_page_num = parseInt(next_page_num)-1;
              cur_page_url = base_url+"page="+cur_page_num;

            }else if(this.prePageUrl !== null && this.prePageUrl !==""){
               let pre_page_num_arr= this.prePageUrl.match(/page=\d/);
               let pre_page_num = pre_page_num_arr[0].split("=")[1];
               let base_url = this.prePageUrl.substring(0,pre_page_num_arr.index);
               let  cur_page_num = parseInt(pre_page_num)-1;
               cur_page_url = base_url+"page="+cur_page_num;
            }else{
                cur_page_url = this.mGLOBAL.DJANGO_SERVER_BASE_URL+"/user/orders/";
            }
            let query_data =""
            if(this.cur_order_status_filter!==""){
                if(this.cur_order_status_filter ==="未付款"){

                  query_data = {"status":this.goods_status2["未付款"]}
                }else if(this.cur_order_status_filter ==="已发货"){
                  query_data = {"status":this.goods_status2["已发货"]}
                }else if(this.cur_order_status_filter ==="已付款"){
                  query_data = {"status":this.goods_status2["已付款"]}
                }else if(this.cur_order_status_filter ==="全部订单"){

                }
            }
             this.loadOrderPage(cur_page_url,query_data);
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
            for(let i = 0;i<this.order_list.length;i++){
               let item =  this.order_list[i];
               let  mdate = mtime.formatDateStrFromTimeSt(item.add_time);
              console.log(mdate)
              item.add_time =mdate;
              let orderGoodsTotalMoney = 0;
                for(let g = 0; g < item.orderGoods.length;g++){
                    orderGoodsTotalMoney = orderGoodsTotalMoney + item.orderGoods[g].goods_price * item.orderGoods[g].goods_count
                }
                item['orderGoodsTotalMoney'] = orderGoodsTotalMoney
                item['is_order_selected'] = false
            }
          },

          prePage(){
            this.scrollToTop()
            console.log(this.prePageUrl)
            this.loadOrderPage(this.prePageUrl)
          },

          nextPage(){
           this.scrollToTop()

             console.log(this.nextPageUrl)
            this.loadOrderPage(this.nextPageUrl)
          },

          firstPage(){
            if(this.firstPageUrl!==""){
              this.loadOrderPage(this.firstPageUrl)
            }

          },
        loadOrderPage(url,query_data){

           axios.defaults.withCredentials=true;
           this.$axios.get(url,{
              params:query_data,
          }
        ).then((res)=>{
          console.log(res.data)
          this.order_list = res.data.results;
           window.scrollTo(0,0);
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

        //滚动页面到顶端
        scrollToTop() {
      　　let scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
      　　console.log(scrollTop)

}
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
  .red_color{
    color: red;
  }
  .item_order{
    margin-top: 3em;
    padding-bottom: 0.5em;
    border-top:1px solid gray;
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
    margin-bottom: 0.5em;

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
    margin: 5px auto;
    color: #fff;
   padding: 0.2em;
    font-size: 1.0em;
  background: #3bb4f2;
  border-color: #3bb4f2;
  }

</style>
