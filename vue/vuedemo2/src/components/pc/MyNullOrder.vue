<template>
  <div id= 'container_id' class="container">

    <div style="text-align: center">

      <div style="width: 50% ;text-align: center;margin: 0px auto;" id="calendar" v-if="calendar_show">
          <inlineCalendar    mode="during"  :disabledDate="disabledDate"  :defaultDate="defaultDate" @change="on_calendar_change"/>
          <button @click="calendar_show = false">确定</button>
          <button @click="during_str='' ;calendar_show = false">取消</button>
      </div>

    </div>
    <div style="padding-left: 5em">
        <input v-model="query_q" style="width: 85%;height: 2em;max-width: 40em; " placeholder="订单号 ，收货人名，手机号，快递单号"/><button @click='on_orders_query(query_q)' style="margin-left: 0.5em">查询</button>
        <!--<label>时间选择</label><input @click="calendar_show = !calendar_show" v-model="during_str">-->
    </div>
    <ul  class = "status_ul" >
      <li ><a @click="on_order_filter({'status':null_order_status2['未付款']},'未付款')" :class="{status_select:cur_order_status_filter==='未付款'}">未付款{{un_pay_counts}}</a></li>
      <li ><a @click="on_order_filter({'status':null_order_status2['已付款']},'已付款')" :class="{status_select:cur_order_status_filter==='已付款'}">已付款{{is_payed_counts}}</a></li>
      <li ><a @click="on_order_filter({'status':null_order_status2['已发货']},'已发货')" :class="{status_select:cur_order_status_filter==='已发货'}">已发货{{is_delivered_counts}}</a></li>
      <li ><a @click="on_order_filter({'status_list':null_order_status2['已付款']+','+null_order_status2['快递打印']},'未发货')" :class="{status_select:cur_order_status_filter==='未发货'}">未发货 {{un_delivered_counts}}</a></li>
      <li ><a @click="on_order_filter({},'全部订单')" :class="{status_select:cur_order_status_filter==='全部订单'}">全部订单{{all_counts}}</a></li>
      <li ><a @click="on_order_filter({'refund_apply_status':'退款订单'},'退款订单')" :class="{status_select:cur_order_status_filter==='退款订单'}">退款订单{{refund_counts}}</a></li>


    </ul>

    <div style="padding-left: 3em" v-if="cur_order_status_filter==='未付款'">
      <button @click="select_all_unpay_orders(is_all_unpay_order_selected)">全选</button>
      <button @click="orders_pay(go_pay_order_list)" v-if="cur_order_status_filter==='未付款'">合并付款</button><label style="color: red"> 总计: {{go_pay_money_totals}} 元</label>
    </div>
    <div  class = "items_ul">
        <li class="item_order " v-for="(item,index) in order_list" :key="index">
          <div  class="global_background order_div" >
            <table style="width: 98%" >
              <tr>
                <td style="width:80%">
                   <input style="width: 1.2em;height: 1.2em" @change="check_box_change(item)" type="checkbox" v-model="item.is_order_selected" v-if="cur_order_status_filter==='未付款'"/>
                    <label  class="order_label" >订单号：{{item.order_number}}</label>
                    <label  class="order_label"  style="color: red" v-if="item.tb_order_number!=='' && item.tb_order_number!==null " >淘宝订单号：{{item.tb_order_number}}</label>
                    <label> {{item.consignee_name}} {{item.consignee_phone}} {{item.consignee_address}}</label></td>
                <td style="text-align: right ;width:20% ">
                  <button @click="delete_order(item.order_number)" v-if="item.order_status === null_order_status2['未付款']">删除订单</button>
                  <a class = "refund_apply_btn" @click="apply_refund(item.id,'确定退款？')"   v-if="item.order_status === null_order_status2['已付款']" >申请退款</a>
                  <!--<a class = "refund_apply_btn"  @click="alter_address(item)"  v-if="item.is_address_alter" >修改地址</a>-->

                </td>
              </tr>
            </table>

          </div>

              <div>
                <label style="padding-left: 0.5em">订单状态：{{null_order_status[item.order_status]}} </label>
                <label style="padding-left: 0.5em">运费：{{item.logistics_fee}} </label>
              </div>
              <div>

                <label style="padding-left: 0.5em;">下单时间:{{item.add_time}}</label>
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
        name: "MyNullOrder",
      data(){
          return{
            calendar_show:false,
            defaultDate:[],
            disabledDate:[],
            during_str:"",

            is_order_by_update_time :false,
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
              null_order_status: mGlobal.NULL_ORDER_STATUS,
              null_order_status2: mGlobal.NULL_ORDER_STATUS2,

            prePageShow:true,
            nextPageShow:true,
            order_list:[],
            firstPageUrl:this.mGLOBAL.DJANGO_SERVER_BASE_URL+"/user/nullOrders/",
            prePageUrl:"",
            nextPageUrl:"",
          }
      },

      methods:{
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

            for(let i  = 0;i<go_pay_order_list.length;i++){
              go_pay_money_totals = go_pay_money_totals+ go_pay_order_list[i].logistics_fee

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

              if(this.order_list[i].order_status !== mGlobal.NULL_ORDER_STATUS2['未付款']){
                // 不是未付款的 跳过
                is_continue = false
              }else{
                console.log(is_selected)
                this.$delete(this.order_list[i], 'is_order_selected');
                this.$set(this.order_list[i], 'is_order_selected', is_selected);


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

              if(this.order_list[i].is_order_selected ===true){

                if(this.order_list[i].order_status !== mGlobal.NULL_ORDER_STATUS2['未付款']){
                  continue;
                }


                go_pay_order_list.push(this.order_list[i])


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
                   const url = this.mGLOBAL.DJANGO_SERVER_BASE_URL+"/user/nullOrdersPay/";
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

    apply_refund(order_id,alter_message){
              if(!confirm(alter_message)) {
                return ;
              }
              let data_ = {
              "order_id":order_id,
            }
            const url = this.mGLOBAL.DJANGO_SERVER_BASE_URL+"/user/nullOrderRefund/";
            axios.post(url,data_).then((res)=>{
             if(res.data.code === "1000"){
               this.$toast("提交成功");

                this.refresh_cur_page();
             }else if(res.data.code === "1001"){
                alert(res.data.message+" 请刷新")
             }
          }).catch(error => {
               alert("提交失败")
          })


       },

          // 删除订单(未付款订单)
          delete_order(order_number){
              if(!confirm("确定删除订单吗？删除后不可恢复。")) {
                return ;
              }
            const url = this.mGLOBAL.DJANGO_SERVER_BASE_URL+"/user/nullOrders/"+order_number+"/";
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
            if(btn_tag === "全部订单" ||  btn_tag==="已发货" ){
              if (this.is_order_by_update_time){
                Object.assign(query_data,{'order_by':'update_time'})
              }
            }

            this.cur_order_status_filter = btn_tag

            this.order_list = []
            const url = this.mGLOBAL.DJANGO_SERVER_BASE_URL+"/user/nullOrders/";

            this.loadOrderPage(url,query_data)
          },


           on_orders_query(query_keys){

             console.log(query_keys)
            const url = this.mGLOBAL.DJANGO_SERVER_BASE_URL+"/user/nullOrders/";
            let query_data = {"q":query_keys.trim()};
            this.loadOrderPage(url,query_data)
          },

        //刷新当前页面
        refresh_cur_page(null_order_status){
              let cur_page_url = "";
              let cur_page_num ;

              this.is_scroll_top = false;
              console.log("this.nextPageUrl",this.nextPageUrl)
            if(this.nextPageUrl !== null && this.nextPageUrl !==""){
              let next_page_num_arr= this.nextPageUrl.match(/page=\d+/);
              let next_page_num = next_page_num_arr[0].split("=")[1]
              let base_url = this.nextPageUrl.substring(0,next_page_num_arr.index);
              let cur_page_num = parseInt(next_page_num)-1;
              cur_page_url = base_url+"page="+cur_page_num;

            }else if(this.prePageUrl !== null && this.prePageUrl !==""){
               let pre_page_num_arr= this.prePageUrl.match(/page=\d+/);
               let pre_page_num = pre_page_num_arr[0].split("=")[1];
               let base_url = this.prePageUrl.substring(0,pre_page_num_arr.index);
               let  cur_page_num = parseInt(pre_page_num)-1;
               cur_page_url = base_url+"page="+cur_page_num;
            }else{
                cur_page_url = this.mGLOBAL.DJANGO_SERVER_BASE_URL+"/user/nullOrders/";
            }

            let query_data =""
            if(this.cur_order_status_filter!==""){
                if(this.cur_order_status_filter ==="未付款"){

                  query_data = {"status":this.null_order_status2["未付款"]}
                }else if(this.cur_order_status_filter ==="已发货"){
                  query_data = {"status":this.null_order_status2["已发货"]}
                }else if(this.cur_order_status_filter ==="已付款"){
                  query_data = {"status":this.null_order_status2["已付款"]}
                }else if(this.cur_order_status_filter ==="全部订单"){

                }
            }

             this.loadOrderPage(cur_page_url,query_data);
        },



          replaceData() {
            for(let i = 0;i<this.order_list.length;i++){
               let item =  this.order_list[i];
               let  mdate = mtime.formatDateStrFromTimeSt(item.add_time);
              console.log(mdate)
              item.add_time =mdate;
              let is_address_alter = true



              item['is_order_selected'] = false
              item['is_address_alter'] = is_address_alter
            }
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
                }else if(this.cur_order_status_filter ==="退款订单"){
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
          const url = this.mGLOBAL.DJANGO_SERVER_BASE_URL+"/user/nullOrders/"
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
