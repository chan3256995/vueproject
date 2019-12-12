<template>
  <div>
    <div class="top" v-show="is_scan_show" >
      <div  class="top2" id="bcid" v-show="is_scan_show">
        <!--<div ></div>-->
        <p class="tip">...载入中...</p>
      </div>
      <div style="position: absolute;bottom: 0; width: 100%"><button style="height: 22px;" @click="mcloseScan">关闭</button></div>
    </div>
    <div style="margin-bottom:1em;height: 2em">

      <label style="margin-bottom: 0.2em;padding-right:0.2em;color: blue;float: right" @click="log_out">退出登录</label>
      <label style="margin-bottom: 0.2em;color: blue;float: right;padding-right:0.4em;">{{user.user_name}}</label>
    </div>
    <div>
      <div style="height: 2em;">
        <div v-show="is_display_market_search_elems" style="float: left;" >
          <select  v-model="market_name_selected">
            <option :value="market_name" v-for="(market_name,index) in market_name_options" :key="index">{{market_name}}</option>
          </select>
          <input v-model="search_shop_floor" style="width: 5em; height: 2em ; " placeholder="楼层"/>
          <input v-model="search_stall_no" style="width: 5em; height: 2em ; " placeholder="档口号"/>
          <input v-model="search_art_no" style="width: 5em; height: 2em ; " placeholder="款号"/>
        </div>

        <label @click="is_display_market_search_elems = ! is_display_market_search_elems"style="float: right; overflow: hidden">▼</label>
      </div>

      <div style="display: block">
            <select  v-model="goods_status_selected">
          <option :value="goods_status_option.value" v-for="(goods_status_option,index) in goods_status_options" :key="index">{{goods_status_option.text}}</option>
      </select>
        <label style="font-size: smaller">市场⇅</label>  <input type="checkbox" v-model="is_order_by_market"/>
        <button @click="on_order_filter_load({'args_and':{'market_name':market_name_selected,'market_floor':search_shop_floor,'stalls_no':search_stall_no,'art_no':search_art_no,'goods_status':goods_status_selected}})"> 查询 {{results_count}}</button><button @click="un_delivered_order">未发货订单 {{no_delivered_counts}}</button>
       </div>
      </div>
    <div style="text-align: left; margin-bottom: 10px;" v-for="(order,index) in order_list" :key="index">
      <div style="background: paleturquoise">
         <label style="margin-right: 0.2em; color:black; font-size: 1.3em" > {{order.id}}</label>
         <label style="width: 40% ;font-size: smaller">订单号：{{order.order_number}}</label>
         <label style="  padding-left: 0.2em" >{{order.consignee_name}}</label>
         <label style="  padding-left: 0.2em;font-size: 0.8em" >{{order.add_time}}</label>
        <label>下单人:{{order.order_owner.user_name}}</label>
      </div>
      <div :class="{'refunded': order_goods.status === goods_status2['已退款']}" style="padding-left: 4%; padding-bottom: 5px " v-for="(order_goods,goods_index) in order.orderGoods">
        id:<label style="font-size: 1.2em">{{order_goods.id}}</label>
        {{order_goods.shop_market_name}}
        {{order_goods.shop_floor}}
        {{order_goods.shop_stalls_no}}
        <label :class="{'red_color': order_goods.status !== goods_status2['已退款']}">{{order_goods.art_no}}</label>
        {{order_goods.goods_color}}
        <div >
          <label>{{goods_status[order_goods.status]}}</label>
          <label v-if="order_goods.status === goods_status2['其他']">({{order_goods.log}})</label>
          <label >{{refund_apply_status[order_goods.refund_apply_status]}}</label>
           <label :class="{'red_color': order_goods.status !== goods_status2['已退款']}"  >{{order_goods.goods_price}}元</label>
           <label :class="{'red_color': order_goods.status !== goods_status2['已退款']}">{{order_goods.goods_count}}件</label>
            <label style="padding-left: 0.5em" @click="force_show_message(order_goods)">▼</label>
        </div>
        <div>
        <label v-show="order_goods.customer_message !== null && order_goods.customer_message !== ''" style="color:red">客户留言：{{order_goods.customer_message}}</label>

  </div>
        <div v-show="(order_goods.customer_service_message !== null && order_goods.customer_service_message !== '') || order_goods.force_show_service_message === true">

          <label style="color:red">客服留言：</label>
          <input style="color:red" v-model="order_goods.customer_service_message"> <button  @click="alter_order_goods_info(order_goods.id,{'customer_service_message':order_goods.customer_service_message})" >确定修改</button>
        </div>


        <div  v-if="order_goods.status!== goods_status2['已退款']">
          <button   :class="{'red_border_btn':order_goods.status ===  pGLOBAL.GOODS_STATUS2['明日有货']}" @click="tomorrow_goods([{'order_number':order.order_number,'order_goods_list':[{'goods_number':order_goods.goods_number }]}], pGLOBAL.GOODS_STATUS2['明日有货'])">明天有货</button>
          <button  :class="{'red_border_btn':order_goods.status ===  pGLOBAL.GOODS_STATUS2['已下架']}" @click="tomorrow_goods([{'order_number':order.order_number,'order_goods_list':[{'goods_number':order_goods.goods_number }]}], pGLOBAL.GOODS_STATUS2['已下架'])">已下架</button>
          <button  :class="{'red_border_btn':order_goods.status ===  pGLOBAL.GOODS_STATUS2['2-5天有货']}" @click="tomorrow_goods([{'order_number':order.order_number,'order_goods_list':[{'goods_number':order_goods.goods_number }]}], pGLOBAL.GOODS_STATUS2['2-5天有货'])">2-5天有货</button>
          <button  :class="{'red_border_btn':order_goods.status ===  pGLOBAL.GOODS_STATUS2['已拿货']}" @click="tomorrow_goods([{'order_number':order.order_number,'order_goods_list':[{'goods_number':order_goods.goods_number }]}], pGLOBAL.GOODS_STATUS2['已拿货'])">已拿货</button>
          <button  :class="{'red_border_btn':order_goods.status ===  pGLOBAL.GOODS_STATUS2['其他']}" @click="tomorrow_goods([{'order_number':order.order_number,'order_goods_list':[{'goods_number':order_goods.goods_number,'message':order_goods.selected_reason}]}], pGLOBAL.GOODS_STATUS2['其他'])">其他</button>
          <select  v-model="order_goods.selected_reason">
              <option :value="option.reason" v-for="(option,index) in options" :key="index">{{option.reason}}</option>
          </select>
       </div>
        <div style="text-align: left">
          <label style="color: gainsboro">--------------------------------------------</label>

        </div>

      </div>
      <div>
        <div>
          <label>快递</label>
          <select v-if="search_shop_floor === '666'"  v-model="order.logistics_selected" >
            <option :value="option" v-for="(option,index) in logistics_options" :key="index">{{option.logistics_name}}</option>
        </select>
          <label v-text="order.logistics_name">单号</label>

          <input v-model="order.logistics_number" v-bind:disabled="order.logistics_number_input_disabled" />
          <button v-if="order.is_delivered === true" @click="modify_logistics(order,order.logistics_number)">修改快递</button>
        </div>
        <button  v-if="search_shop_floor === '666'" :disabled="print_tag_btn_disable" @click="print_tag([order_list[index].order_number])" >打印标签</button>
        <button v-if="search_shop_floor === '666'" :disabled="print_logistics_btn_disable" @click="print_logistics([order_list[index].order_number])" >打印物流单</button>
        <button v-if="search_shop_floor === '666'" :disabled="purchase_goods_btn_disable" @click="purchase_goods_submit([order_list[index]])" >拿货</button>
        <button  :disabled="scan_qr_code_btn_disable" @click="mstartRecognize(index)">扫描填单</button>
        <button :disabled="deliver_ok_btn_disable" @click="deliver_submit([order_list[index]])">确定发货</button>
      </div>
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
    import pGlobal from '../utils/pGlobal'
    import mscan from '../utils/mscan.js'
    import mtime from '../utils/mtime';

    import  cookiesUtils from '../utils/cookieUtil'
    import  axios  from 'axios'
    // import pcommon_function from "../utils/pcommon_function2";
    export default {
      name: "My",
      data() {
        return {
          is_display_market_search_elems:false,
          user:'',
          is_order_by_market:false,
          order_list: "",
          results_count:"",
          pGLOBAL: pGlobal,
          goods_status: pGlobal.GOODS_STATUS,
          goods_status2: pGlobal.GOODS_STATUS2,
          refund_apply_status:pGlobal.REFUND_APPLY_STATUS,
          market_name_options:[].concat(pGlobal.MARKET_NAME_LIST),
          goods_status_options :[].concat(pGlobal.GOODS_STATUS_OPTIONS),
          goods_status_selected :"",
          market_name_selected :"",
          search_shop_floor:'',
          search_stall_no:'',
          search_art_no:'',
          // 未发货数量
          no_delivered_counts:"",
          options: [
            {reason: '价格有误', reason_value: '价格有误'},
            {reason: '尺码缺货', reason_value: '尺码缺货'},
            {reason: '档口或货号不对', reason_value: '档口或货号不对'},
            {reason: '其他', reason_value: '其他'}
          ],
          logistics_options: [],
          // 扫码返回的值
          cur_scan_code: "",
          is_scan_show: false,
          cur_scan_item_index: "",
          prePageShow: true,
          nextPageShow: true,

          firstPageUrl: pGlobal.DJANGO_SERVER_BASE_URL + "/nahuo/orders/",
          prePageUrl: "",
          nextPageUrl: "",
          default_query_params: {"is_order_follower": true},
          cur_query_params:{},
          print_tag_btn_disable : false,
          print_logistics_btn_disable:false,
          purchase_goods_btn_disable:false,
          scan_qr_code_btn_disable:false,
          deliver_ok_btn_disable:false,
        }


      },
      watch: {
        'order_list': {
          deep: true,
          handler(new_order_list, old_order_list) {
            console.log(new_order_list)
          },
        }
      },
      methods: {

        init_data(){
           this.market_name_options.unshift("全部")
           this.goods_status_options.unshift({text:"全部",value:"全部"},)
           this.market_name_selected = this.market_name_options[0];
           this.goods_status_selected = this.goods_status_options[0].value

        },

        replace_data(order_list){
          for(let i = 0;i<order_list.length;i++){
              let item =  order_list[i];
              let  mdate = mtime.formatDateStrFromTimeSt(item.add_time);
              mdate=mdate.substr(5,11)

              item.add_time =mdate;
              item['logistics_number_input_disabled'] = true
              item['force_show_service_message'] =false;
            }
            return order_list
        },

        force_show_message(order_goods){
           let is_force = !order_goods.force_show_service_message
           this.$delete(order_goods, 'force_show_service_message');
           this.$set(order_goods, 'force_show_service_message', is_force);
        },
        alter_order_goods_info(id ,data){
          const url = pGlobal.DJANGO_SERVER_BASE_URL+"/back/orderGoods/"+id+"/";
          axios.defaults.withCredentials=true;
           axios.put(url,data)
             .then(res=>{
               if(res.data.code === "1000"){
               alert("修改成功")
               }else{
                 alert("修改失败"+res.data.message)
               }

              console.log(res.data);
           }).catch(error =>{
              alert("修改失败"+error)
          })
        },

        // 修改物流
        modify_logistics(order,new_logistics_number){
            if(order.logistics_number_input_disabled === true){

           this.$delete(order, 'logistics_number_input_disabled');
           this.$set(order, 'logistics_number_input_disabled', false);

              return
            }
            if(!confirm("该订单已发货，确定修改物流信息吗？")) {
                return ;
              }
              let new_logistics_name = order.logistics_name
               if(order.logistics_selected !==""  && order.logistics_selected.logistics_name !=="请选择" && order.logistics_selected.logistics_name !== order.logistics_name) {
                 if (!confirm("确定更改物流吗？")) {
                   return;
                 } else {
                   new_logistics_name = order.logistics_selected.logistics_name
                 }
               }
              let new_order = {
              "order_number":order.order_number,
              "logistics_name":new_logistics_name,
              "logistics_number":new_logistics_number,
              }
           const url = pGlobal.DJANGO_SERVER_BASE_URL + "/nahuo/modifyLogistics/";
           axios.post(url, {"order": new_order}).then((res) => {
            if (res.data.code === "1000") {
              // #状态发生改变的订单

              this.$toast("提交成功")
            } else {
              alert("提交失败")
            }
          }).catch(error => {
            console.log(error)
            alert("提交失败")
          })
        },
        //  全部
        all_btn_disable(){
          this.print_tag_btn_disable = false;
          this.print_logistics_btn_disable=false;
          this.purchase_goods_btn_disable=false;
          this.scan_qr_code_btn_disable=false;
          this.deliver_ok_btn_disable=false;
        },
        // 已付款状态
        is_payed_status_btn_disable(){
          this.print_tag_btn_disable = false;
          this.print_logistics_btn_disable=true;
          this.purchase_goods_btn_disable=true;
          this.scan_qr_code_btn_disable=true;
          this.deliver_ok_btn_disable=true;
        },
        // 标签打印状态
        is_print_tag_status_btn_disable(){
          this.print_tag_btn_disable = true;
          this.print_logistics_btn_disable=true;
          this.purchase_goods_btn_disable=false;
          this.scan_qr_code_btn_disable=true;
          this.deliver_ok_btn_disable=true;
        },

        // 拿货中状态
        is_purchase_goodsing_status_btn_disable(){
          this.print_tag_btn_disable = true;
          this.print_logistics_btn_disable=true;
          this.purchase_goods_btn_disable=true;
          this.scan_qr_code_btn_disable=true;
          this.deliver_ok_btn_disable=true;
        },

                // 已拿货状态
        is_purchase_goodsed_status_btn_disable(){
          this.print_tag_btn_disable = true;
          this.print_logistics_btn_disable=false;
          this.purchase_goods_btn_disable=true;
          this.scan_qr_code_btn_disable=false;
          this.deliver_ok_btn_disable=false;
        },

                        // 快递打印状态
        is_print_logistics_status_btn_disable(){
          this.print_tag_btn_disable = true;
          this.print_logistics_btn_disable=true;
          this.purchase_goods_btn_disable=true;
          this.scan_qr_code_btn_disable=false;
          this.deliver_ok_btn_disable=false;
        },


                        // 已发货
        is_deliver_status_btn_disable(){
          this.print_tag_btn_disable = true;
          this.print_logistics_btn_disable=true;
          this.purchase_goods_btn_disable=true;
          this.scan_qr_code_btn_disable=false;
          this.deliver_ok_btn_disable=true;
        },
        //
        log_out(){
          cookiesUtils.deleteCookies("access_token_nh")
          this.$router.push("/login");
        },
        // 打印标签
        print_tag(order_number_list){
          const url = pGlobal.DJANGO_SERVER_BASE_URL + "/back/tagPrint/";
          //设为true 就会带cookies 访问
          axios.defaults.withCredentials = true;
          axios.post(url, {"order_list": order_number_list}).then((res) => {
            if (res.data.code === "1000") {
              // #状态发生改变的订单
              let exception_order_list = res.data.exception_order
              this.$toast("提交成功")
            } else {
              alert("提交失败")
            }
          }).catch(error => {
            console.log(error)
            alert("提交失败")
          })
        },


        // 打印物流
        print_logistics(order_number_list){
          const url = pGlobal.DJANGO_SERVER_BASE_URL + "/back/logisticsPrint/";
          //设为true 就会带cookies 访问
          axios.defaults.withCredentials = true;
          axios.post(url, {"print_logistic_order_list": order_number_list}).then((res) => {
            if (res.data.code === "1000") {
              // #状态发生改变的订单
              let exception_order_list = res.data.exception_order
              if(exception_order_list.length > 0){
                this.$toast(exception_order_list.length+"失败")
              }else{
                 this.$toast("提交成功")
              }

            } else {
              alert("提交失败")
            }
          }).catch(error => {
            console.log(error)
            alert("提交失败")
          })
        },

        //明日有货
        tomorrow_goods(order_list, type) {
          let submit_order_list = []

          for (let i = 0; i < order_list.length; i++) {
            let submit_order_goods_list = []
            for (let g = 0; g < order_list[i].order_goods_list.length; g++) {
              if(type === this.goods_status2["其他"] && order_list[i].order_goods_list[g].message === ""){
                 this.$toast("请选择原因")
                return
              }
              submit_order_goods_list.push(order_list[i].order_goods_list[g])
            }
            submit_order_list.push({"order_number": order_list[i].order_number, "orderGoods": submit_order_goods_list})

          }
          const url = pGlobal.DJANGO_SERVER_BASE_URL + "/back/changePurchasingStatus/";
          //设为true 就会带cookies 访问
          axios.defaults.withCredentials = true;
          axios.post(url, {"order_list": submit_order_list, "status_type": type}).then((res) => {
            if (res.data.code === "1000") {
              // #状态发生改变的订单
              let exception_order_list = res.data.exception_order
                if(exception_order_list.length > 0){
                this.$toast(exception_order_list.length+"失败")
              }else{
                 this.$toast("提交成功")
              }
            } else {
              alert("提交失败")
            }
          }).catch(error => {

            console.log(error)
            alert("提交失败")
          })
        },

        deliver_submit(order_list) {
          let url = pGlobal.DJANGO_SERVER_BASE_URL + "/back/deliverGoods/"
          let deliver_order_list = [];
          for (let i = 0; i < order_list.length; i++) {
            if (order_list[i].order_number !== "" && order_list[i].logistics_name !== "" && order_list[i].logistics_number !== "") {
              let logistics_name = order_list[i].logistics_name
               alert(order_list[i].logistics_selected)
              if(order_list[i].logistics_selected !==""  && order_list[i].logistics_selected.logistics_name !=="请选择" && order_list[i].logistics_selected !==order_list[i].logistics_name){
                if(!confirm("确定更改物流吗？")) {
                return ;
              }else{
                  logistics_name = order_list[i].logistics_selected.logistics_name
                }
              }


              let tem_order_object = {
                "order_number": order_list[i].order_number,
                "logistics_name": logistics_name,
                "logistics_number": order_list[i].logistics_number
              }
              deliver_order_list.push(tem_order_object);
            }
          }

          axios.post(url, {"deliver_order_list": deliver_order_list}).then((res) => {
            if (res.data.code === "1000") {
              // #状态发生改变的订单

              let exception_order_list = res.data.exception_order
              if(exception_order_list.length > 0){
                alert(exception_order_list.length+"个订单发货失败")
              }else{
                this.$toast("提交成功")
              }

            } else {
              alert("提交失败，"+res.data.message)
            }
          }).catch(error => {

            console.log(error)
            alert("访问异常")
          })
        },
        //拿货
        purchase_goods_submit(order_list) {
          let purchase_order_list = []
          for (let i = 0; i < order_list.length; i++) {
            purchase_order_list.push(order_list[i].order_number)
          }
          const url = pGlobal.DJANGO_SERVER_BASE_URL + "/back/purchaseGoods/";
          //设为true 就会带cookies 访问
          axios.defaults.withCredentials = true;
          axios.post(url, {"order_list": purchase_order_list}).then((res) => {
            if (res.data.code === "1000") {
              // #状态发生改变的订单
              let exception_order_list = res.data.exception_order
              if(exception_order_list.length > 0){
                this.$toast(exception_order_list.length+"失败")
              }else{
                 this.$toast("提交成功")
              }
            } else {
              alert("提交失败")
            }
          }).catch(error => {
            console.log(error)
            alert("提交失败")
          })
        },


        analysis_order_data(order_list) {
          for (let i = 0; i < order_list.length; i++) {
            for (let g = 0; g < order_list[i].orderGoods.length; g++) {
              order_list[i].orderGoods[g]['selected_reason'] = ""
            }
            order_list[i]['logistics_selected'] = ""
          }
          return order_list
        },



        // 加载物流选项信息
        load_logistics() {
          const url = pGlobal.DJANGO_SERVER_BASE_URL + "/trade/logistics/"
          //设为true 就会带cookies 访问
          axios.defaults.withCredentials = true
          axios.get(url,
          ).then((res) => {
            if ("1000" === res.data.code) {
              console.log(res.data)
              let logistics_options = res.data.data
              let item_data = {"logistics_name": "请选择"}
              logistics_options.unshift(item_data)
              this.logistics_options = logistics_options

              console.log("selected_logistics")
              console.log(this.logistics_options)
            } else {

            }
          }).catch(error => {
            console.log(error);

          })
        },

        fill_logistics_number(logistics_number2, order_list, index) {

          this.$delete(order_list[index], 'logistics_number');
          this.$set(order_list[index], 'logistics_number', logistics_number2);

        },
        // 扫码回到函数
        onmarked(type, result, file) {

          switch (type) {
            case plus.barcode.QR:
              type = "QR";
              break;
            case plus.barcode.EAN13:
              type = "EAN13";
              break;
            case plus.barcode.EAN8:
              type = "EAN8";
              break;
            default:
              type = "其它" + type;
              break;
          }

          result = result.replace(/\n/g, "");
          this.cur_scan_code = result;
          this.fill_logistics_number(this.cur_scan_code, this.order_list, this.cur_scan_item_index)
          // window.localStorage.codeUrl = result;

          this.mcloseScan()

        },

        // 开始扫码
        mstartRecognize(item_index) {
          this.is_scan_show = true
          this.cur_scan_item_index = item_index
          let that = this
          setTimeout(function () {
            mscan.startRecognize(that.onmarked)
          }, 100);


        },

        // 关闭扫码
        mcloseScan() {
          this.is_scan_show = false
          mscan.closeScan()
        },

     prePage() {
        console.log(this.prePageUrl)
        this.loadOrderPage(this.prePageUrl)
      },

      nextPage() {
        console.log(this.nextPageUrl)
        this.loadOrderPage(this.nextPageUrl)
      },
      firstPage() {
        if (this.firstPageUrl !== "") {
          this.loadOrderPage(this.firstPageUrl,this.default_query_params)
        }

      },

      loadOrderPage(url, query_data,tag) {

          // console.log("default_query_params",this.default_query_params)
        // let cur_query_params = {}
        // Object.assign(cur_query_params, this.default_query_params);
        // Object.assign(cur_query_params, query_data);

        axios.defaults.withCredentials = true;
        this.$axios.get(url, {
          params: query_data,
          }
        ).then((res) => {
          console.log(res.data)

          if (tag !== null && tag==="no_delivered_tag"){
          this.no_delivered_counts =  res.data.count
        }else{
             this.results_count = res.data.count
          }
          this.order_list = res.data.results;
          this.order_list = this.analysis_order_data(this.order_list)
          this.order_list = this.replace_data(this.order_list)

          if (res.data.previous == null) {
            this.prePageShow = false;
          } else {
            this.prePageShow = true;
          }
          this.prePageUrl = res.data.previous;

          if (res.data.next == null) {
            this.nextPageShow = false;
          } else {
            this.nextPageShow = true;
          }
          this.nextPageUrl = res.data.next;

        }).catch(error => {

          console.log(error);
        })
      },

        un_delivered_order(){
          let tag='no_delivered_tag'
          let query_data = {'status_list':this.goods_status2['已付款']+','+this.goods_status2['标签打印']+','+this.goods_status2['拿货中']+','+this.goods_status2['已拿货']+','+this.goods_status2['明日有货']+','+this.goods_status2['2-5天有货']+','+this.goods_status2['其他']}
           this.order_list = []
            const url = this.firstPageUrl
            Object.assign(query_data,this.default_query_params)
            this.loadOrderPage(url,query_data,tag)
        },

        //按选择状态过滤订单查询
      on_order_filter_load(args_and){
           // let query_data ;
               let market_name = null;
                let goods_status = null;
                if(args_and.args_and.market_name==='全部'){
                    args_and.args_and.market_name =null
                }
                if (args_and.args_and.goods_status === '全部'  ){
                    args_and.args_and.goods_status = null
                }


                if(this.goods_status2['已付款']===this.goods_status_selected ){
                  this.is_payed_status_btn_disable()
                }else if(this.goods_status2['标签打印']===this.goods_status_selected ){
                  this.is_print_tag_status_btn_disable()
                }else if(this.goods_status2['拿货中']===this.goods_status_selected ){
                  this.is_purchase_goodsing_status_btn_disable()
                }else if(this.goods_status2['已拿货']===this.goods_status_selected ){
                  this.is_purchase_goodsed_status_btn_disable()
                }else if(this.goods_status2['已发货']===this.goods_status_selected ){
                  this.is_deliver_status_btn_disable()
                }else if(this.goods_status2['快递打印']===this.goods_status_selected ){
                  this.is_print_logistics_status_btn_disable()
                }
            let query_data=args_and
            this.order_list = []
            const url = this.firstPageUrl
            if(this.is_order_by_market){
              Object.assign(query_data,{'order_by':'-orderGoods__shop_market_name,orderGoods__shop_floor,orderGoods__shop_stalls_no'})
            }
            Object.assign(query_data,this.default_query_params)
            this.loadOrderPage(url,query_data)
        },

          load_user_info(){
        // cookiesUtils.setCookies("access_token_nh",res.data.token)
             let user_info = this.getLocalValue("user");
             console.log("create----------------",user_info)
            if(user_info !==""){
              this.user = JSON.parse(user_info)
            }
      },
      },


      created(){
          this.init_data();
          this.loadOrderPage(this.firstPageUrl,this.default_query_params)
          this.load_logistics()
          this.load_user_info()
      }
    }
</script>

<style lang="less" scoped>
  /*// 已退款样式*/
  .refunded{
    color: #878d99;
    .refunded label{
      color: #878d99;
    }
  }
  .red_color{
    color:red
  }

  .red_border_btn{
    border: red solid 1px;
  }
    .status_ul{
      display: block;
      height: 1.5em;
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
    .page_table{
    margin: 0 auto;
    float: bottom;
  }
.top{
  position: fixed;
  top:  0;
  z-index:  999;
  max-width:  1080px;
  width:  100%;
  border-top:  1px solid #C0C0C0;
  background: white;
  height: 370px;
}

  .top2{
  position: fixed;
  top:  0;
  z-index:  999;
  max-width:  1080px;
  width:  100%;
  border-top:  1px solid #C0C0C0;
  background: white;
  height: 350px;
}
</style>
