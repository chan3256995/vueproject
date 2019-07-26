<template>
  <div class="container">
    <div style="padding-left: 5em">
        <input v-model="query_q" style="width: 30em; height: 2em ; " placeholder="订单号 ，收货人名，手机号，快递单号"/><button @click='on_orders_query(query_q)' style="margin-left: 0.5em">查询</button>
    </div>
    <div>
        <ul class = "status_ul" >
          <li ><a @click="on_order_filter(goods_status2['未付款'])" :class="{status_select:status_filter_object['未付款']===true}">未付款</a></li>
          <li ><a @click="on_order_filter(goods_status2['已发货'])" :class="{status_select:status_filter_object['已发货']===true}">已发货</a></li>
          <li ><a @click="on_order_filter(-1)" :class="{status_select:status_filter_object['全部订单']===true}">全部订单</a></li>
        </ul>
     </div>
    <div style="padding-left: 3em;"> <button style="margin-right: 0.5em" @click="select_all(is_all_order_selected)">全选</button>
         <button @click="go_print_format_page()">打 印</button></div>
    <ul class = "items_ul">
        <li class="item_order" v-for="(item,index) in order_list" :key="index">
          <div  class="order_div" >
            <input style="width: 1.5em; height: 1.5em " type="checkbox" v-model="item.is_checked">
              <label  class="order_label" >订单号：{{item.order_number}}</label>
              <label> {{item.consignee_name}} {{item.consignee_phone}} {{item.consignee_address}}</label>
          </div>
              <div class="item_goods"  v-for="(goods,index2) in item.orderGoods">
                 <label>商品：{{index+1}}
                    {{goods.shop_market_name}}_{{goods.shop_floor}}_{{goods.shop_stalls_no}}_{{goods.art_no}}_{{goods.goods_price}}元_{{goods.goods_color}}_{{goods.goods_count}}件
                 </label>

                  <div>
                    <label style="float: left;margin-right: 0.8em">   商品状态：{{goods_status[goods.status]}} </label>
                    <label style="float: left">售后状态：</label><label :class="{red_color:refund_apply_status[goods.refund_apply_status]!=='无售后'}">   {{refund_apply_status[goods.refund_apply_status]}}  </label>
                  </div>
                  <div ></div>
                  <div v-if="goods.return_logistics_name !== null " ><label style="float: left">售后物流：</label><label  >   {{goods.return_logistics_name}}:{{goods.return_logistics_number}}  </label> </div>
                 <label style="color: red; float: left; margin-right: 1em" >   下单备注：{{goods.customer_message}}</label>
                 <label style="color: red">   客服留言：{{goods.customer_service_message}}</label>

              </div>
              <div>
                <label style="padding-left: 0.5em">订单总价：{{item.logistics_fee}} + {{item.agency_fee}}+ {{item.orderGoodsTotalMoney}} =
                              {{item.logistics_fee + item.agency_fee + item.orderGoodsTotalMoney}}
                </label>
              </div>
              <div>
                <label style="padding-left: 0.5em">下单时间:{{item.add_time}}</label>
              <label>快递：{{item.logistics_name}}</label>
              <label>单号：{{item.logistics_number}}</label>
              </div>
        </li>
    </ul>
    <table class="page_table">
      <tr>
        <td style=" cursor:pointer;"><a >首页</a></td>
        <td style=" cursor:pointer;" v-if="prePageShow"><a  @click="prePage" style="">上一页</a></td>
        <td  style=" cursor:pointer;" v-if="nextPageShow"><a @click="nextPage">下一页</a></td>

      </tr>
    </table>
</div>
</template>

<script>
  import mtime from '../../../utils/mtime.js';
  import mGlobal from '../../../utils/mGlobal';
    import  axios  from 'axios'
     //设为true 就会带cookies 访问
    axios.defaults.withCredentials=true;
    export default {
        name: "MyOrder",
        data(){
          return{
            query_q :"",
            next_page_url :"",
            selected_op :"",
            // 订单是否全选
            is_all_order_selected:false,
            status_filter_object:{
              "未付款":false,
              "已发货":false,
              "全部订单":false,
            },
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
            prePageUrl:"",
            nextPageUrl:"",
          }
      },

      methods:{
          go_print_format_page(){
            let  routeData = this.$router.resolve({ path: '/pc/back/printPageFormat',query: {order_list: JSON.stringify(this.order_list)}})
            window.open(routeData.href, '_blank')

          },
          select_all(is_select){
            console.log("777777777")
            for(let i = 0;i<this.order_list.length;i++){
              console.log("999999999999999999999")
              console.log(this.order_list[i].is_checked)
              let befor_status = this.order_list[i].is_checked
              this.$delete(this.order_list[i],'is_checked');
              this.$set(this.order_list[i], 'is_checked', !this.is_all_order_selected);

            }
            this.is_all_order_selected = !this.is_all_order_selected
          },
          on_order_filter(goods_status){
             let query_data ;
            if("未付款" === this.goods_status[goods_status]){
               this.status_filter_object={"未付款":true,"已发货":false, "全部订单":false, }
               query_data = {"status":goods_status};
            }else if("已发货" === this.goods_status[goods_status]){
              this.status_filter_object={"未付款":false,"已发货":true, "全部订单":false, }
               query_data = {"status":goods_status};
            }else{
                  this.status_filter_object={"未付款":false,"已发货":false, "全部订单":true, }
            }
            const url = this.mGLOBAL.DJANGO_SERVER_BASE_URL+"/back/orders/";
            this.loadOrderPage(url,query_data)
          },
           on_orders_query(query_keys){
             console.log("99999999999999999999999999")
             console.log(query_keys)
            const url = this.mGLOBAL.DJANGO_SERVER_BASE_URL+"/back/orders/";
            let query_data = {"q":query_keys.trim()};
            this.loadOrderPage(url,query_data)
          },

        refresh_cur_page(){
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
                cur_page_url = this.mGLOBAL.DJANGO_SERVER_BASE_URL+"/back/orders/";
            }
             this.loadOrderPage(cur_page_url);
        },

          replaceData() {
            for(let i = 0;i<this.order_list.length;i++){
              let item =  this.order_list[i];
               let  mdate = mtime.formatDateStrFromTimeSt(item.add_time);
              console.log(mdate)
              item.add_time =mdate;
              item['is_checked'] = true;
              let orderGoodsTotalMoney = 0;
                for(let g = 0; g < item.orderGoods.length;g++){
                    orderGoodsTotalMoney = orderGoodsTotalMoney + item.orderGoods[g].goods_price * item.orderGoods[g].goods_count
                }
                item['orderGoodsTotalMoney'] = orderGoodsTotalMoney
            }
          },

          prePage(){
            console.log(this.prePageUrl)
            this.loadOrderPage(this.prePageUrl)
          },

          nextPage(){
             console.log(this.nextPageUrl)
            this.loadOrderPage(this.nextPageUrl)
          },

        loadOrderPage(url,query_data){

           axios.defaults.withCredentials=true;
           axios.get(url,{
              params:query_data,
          }
        ).then((res)=>{
          console.log(res.data)
          this.order_list = res.data.results;
          this.replaceData()
             console.log(JSON.stringify(this.order_list))
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
          console.log("myorder------------------------------------") ;
          console.log(error) ;
        })
        }
      },

      created(){
          const url = this.mGLOBAL.DJANGO_SERVER_BASE_URL+"/back/orders/";
          this.loadOrderPage(url);
      },

    }
</script>

<style scoped>
  .status_ul{
    display: inline-block
  }
  .status_select{
    background: #f0f0f0 ;
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
    margin-bottom: 3em;
    background: #f0f0f0;
    padding-bottom: 0.5em;
    border-top:1px solid gray;
  }
.items_ul li{
  list-style: none;

}
  .container{
    width: 900px;
    height: 1000px;
    margin: 0 auto;
    text-align: left;

  }
  .page_table{
    margin: 0 auto;
    float: bottom;
  }

  .order_div {
    width: 100%;
    background: darkgray;
    padding-top: 0.5em;
    padding-bottom: 0.5em;
  }
  .item_goods label{
    display: block; padding-bottom: 0.4em
  }


  .item_goods{
    margin-bottom: 0.5em;

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
