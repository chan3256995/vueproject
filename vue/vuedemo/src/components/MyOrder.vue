<template>
  <div class="container">
    <ul class = "items_ul">
        <li class="item_order" v-for="(item,index) in order_list" :key="index">
          <div  class="order_div" >
              <label  class="order_label" >订单号：{{item.order_number}}</label>
              <label> {{item.consignee_name}} {{item.consignee_phone}} {{item.consignee_address}}</label>
          </div>
              <div class="item_goods"  v-for="(goods,index2) in item.orderGoods">
                 <label>商品：{{index+1}}
                    {{goods.shop_market_name}}_{{goods.shop_floor}}_{{goods.shop_stalls_no}}_{{goods.art_no}}_{{goods.goods_color}}_{{goods.goods_price}}元_{{goods.goods_count}}件
                 </label>
                 <div style="float:right;margin-right: 4em">
                         <label>{{goods.refund_apply.value}}</label>
                         <label>{{goods.goods_price}} x {{goods.goods_count}} =  {{goods.goods_price * goods.goods_count}}元 </label>
                          <a  @click="apply_click(goods,item)" class = "refund_apply_btn">申请售后</a>
                          <a  @click="goto_place_order_page(JSON.stringify(goods))" class = "refund_apply_btn">再次下单</a>

                </div>
                  <div><label >   商品状态：{{goods_status[goods.status]}}  </label> </div>
                 <label style="color: red" >   下单备注：{{goods.customer_message}}</label>
                 <label style="color: red">   客服留言：{{goods.customer_service_message}}</label>

              </div>
              <div>
                <label>订单总价：{{item.logistics_fee}} + {{item.agency_fee}}+ {{item.orderGoodsTotalMoney}} =
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
  import mtime from '../utils/mtime.js';
  import mGlobal from '../utils/mGlobal'
    import  axios  from 'axios'

    axios.defaults.withCredentials=true;


    export default {
        name: "MyOrder",
      data(){
          return{
            selected_op :"",
            options: [
            { text: '请选择', value: '' },
            { text: '退货退款', value: '1' },
            { text: '仅退款', value: '2' }
          ],

            logistics_name:{

            },

              goods_status: mGlobal.GOODS_STATUS,
            // goods_status: {
            //   "unpaid":1,//未付款
            //   "paid":2,//已付款
            //   "getting":3,//拿货中
            //   "got_goods":4,//已拿货
            //   "delivered":5,//已发货
            //   "refunded":6,//已退款
            //   "shortage":7,//缺货
            // },
            prePageShow:true,
            nextPageShow:true,
            order_list:[],
            prePageUrl:"",
            nextPageUrl:"",
          }
      },

      methods:{

        goto_place_order_page(data){

          this.$router.push({path:"/home/porder",query:{data:data}})
        },
        apply_click(goods,order){

              // this.$router.push({path:"/refund",query:{goods:goods,order:order}})
               //传参传对象当跳转后的页面刷新参数会丢失 用字符串传不会丢失
              this.$router.push({path:"/refund",query:{order_goods_id:goods.id,order:JSON.stringify(order)}})
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
          loadOrderPage(url){
           axios.defaults.withCredentials=true;
           axios.get(url,{
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
              this.prePageUrl = res.data.previous;
          }

          if(res.data.next == null){
            this.nextPageShow = false;
          }else{
            this.nextPageShow = true;
            this.nextPageUrl = res.data.next;
          }
        }).catch(error => {

          console.log("myorder------------------------------------") ;
          console.log(error) ;
        })
        }
      },

      created(){
          const url = this.mGLOBAL.DJANGO_SERVER_BASE_URL+"/user/orders/";
          this.loadOrderPage(url);
      },

    }
</script>

<style scoped>
  .item_order{
    margin-top: 3em;
    border-top:1px solid gray;
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
    background: beige;
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
