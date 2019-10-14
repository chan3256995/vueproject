<template>
  <div style="padding-bottom: 5em">
    <div style="text-align: left" v-for="(order,index) in order_list" :key="index">
      <div style="background: paleturquoise ;overflow:hidden">
          <label style="width: 40% ;font-size: smaller">订单号：{{order.order_number}}</label>
        <button style="float: right" v-if="order.order_follower === null " @click="add_to_my_follow_order(order.order_number)">添加</button>
      </div>

      <div style="padding-left: 4%; padding-bottom: 5px" v-for="order_goods in order.orderGoods">
        id:{{order_goods.id}}
        {{order_goods.shop_market_name}}
        {{order_goods.shop_floor}}
        {{order_goods.shop_stalls_no}}
        {{order_goods.art_no}}
        {{order_goods.goods_color}}
 <div style="color: red;">{{goods_status[order_goods.status]}}</div>
      </div>


    </div>
  </div>
</template>

<script>
  import pGlobal from '../utils/pGlobal'
  import  axios  from 'axios'
  import  cookiesUtils from '../utils/cookieUtil'
    export default {
        name: "Home",
        data(){
          return{
          order_list :"",
            goods_status :pGlobal.GOODS_STATUS
          }


        },

        methods:{
          add_to_my_follow_order(order_number){
            let data_ = {
              "order_list":[order_number],

            }
              let url = pGlobal.DJANGO_SERVER_BASE_URL+"/nahuo/selectOrders/"
             axios.post(url,data_).then((res)=>{
                console.log(res.data.results)

            })
          },
          load_order(){
             let url = pGlobal.DJANGO_SERVER_BASE_URL+"/nahuo/orders/"
             axios.get(url,{

              }).then((res)=>{
                console.log(res.data)
               this.order_list = res.data.results
            })
          }
        },
      created(){
          this.load_order()
      }
    }



</script>

<style scoped>

</style>
