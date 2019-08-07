<template>
    
</template>

<script>
  // const DJANGO_SERVER_BASE_URL = "http://39.96.69.115:8089"
    const DJANGO_SERVER_BASE_URL = "http://192.168.1.102:8009"
    export default {
        DJANGO_SERVER_BASE_URL,
      SERVER_FEE:2.0,
       LOGISTICS: [
            { logistics_name: '圆通', price: '4.0' },
            { logistics_name: '韵达', price: '4.0' },
            { logistics_name: '中通', price: '5.0' },

          ],
      //商品状态
        GOODS_STATUS:{
              1:"未付款",//未付款
              2:"已付款",//已付款
              3:"拿货中",//拿货中
              4:"已拿货",//已拿货
              5:"已发货",//已发货
              6:"已退款",//已退款
              7:"明日有货",//明日有货
               8:"已取消",
               9:"缺货",
               10:"标签打印",
               11:"快递打印",
            },
      GOODS_STATUS2:{
              "未付款":1,//未付款
              "已付款":2,//已付款
              "拿货中":3,//拿货中
              "已拿货":4,//已拿货
              "已发货":5,//已发货
              "已退款":6,//已退款
              "明日有货":7,//明日有货
               "已取消":8,
               "缺货":9,
               "标签打印":10,
               "快递打印":11,
            },
      GOODS_STATUS_OPTIONS:[
              {text:"未付款",value:1},
              {text:"已付款",value:2},
              {text:"拿货中",value:3},
              {text:"已拿货",value:4},
              {text:"已发货",value:5},
              {text:"已退款",value:6},
              {text:"明日有货",value:7},
              {text:"已取消",value:8},
              {text:"缺货",value:9},
              {text:"标签打印",value:10},
              {text:"快递打印",value:11},
            ],

         REFUND_APPLY_STATUS: {
            0:"无售后",
            1:"退货退款",
            2:"仅退款",
            // 3:"已申请换货",
            // 4:"已取消订单",
             5:"拦截发货",
        },

      REFUND_APPLY_TYPE:{
          "退货退款":1,
          "仅退款":2,
          // "换货":3,
          // "取消订单":4,
          "拦截发货":5,
      },

      REFUND_APPLY_TYPE_OPTIONS:[
            { text: '无售后',value:0},
            { text: '退货退款',value:1},
            // { text: '仅退款' ,value:2},
            // { text: '换货' ,value:3},
            // { text: '取消订单' ,value:4},
      ],
      REFUND_APPLY_TYPE_OPTIONS2:[
            { text: '退货退款',value:1},
            // { text: '仅退款' ,value:2},
            // { text: '换货' ,value:3},
      ],
    }
</script>

<style scoped>

</style>
