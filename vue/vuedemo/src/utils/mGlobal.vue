<template>
    
</template>

<script>
  //后台服务器地址

  // const DJANGO_SERVER_BASE_URL = "http://39.96.69.115:8089"
    const DJANGO_SERVER_BASE_URL = "http://192.168.2.110:8009"
  // 前段访问地址
  //   const VUE_REQUEST_BASE_URL = "http://17daina.com/#"
    const VUE_REQUEST_BASE_URL = "http://192.168.2.110:8082/#"
    export default {
     DJANGO_SERVER_BASE_URL,
     VUE_REQUEST_BASE_URL,
     SERVER_FEE:2.0,
       // LOGISTICS: [
       //      { logistics_name: '圆通', price: '4.0' },
       //      { logistics_name: '韵达', price: '4.0' },
       //      { logistics_name: '中通', price: '5.0' },
       //
       //    ],
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
              12: '已下架',
              13: '2-5天有货',
              14:'其他',
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
              '已下架': 12,
               '2-5天有货': 13,
              '其他': 14,
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
              {text:"已下架",value:12},
              {text:"2-5天有货",value:13},
              {text:"其他",value:14},
            ],
      //空包订单状态
     NULL_ORDER_STATUS:{
        1:'未付款',
        2:'已付款',
        3:'快递打印',
        4:'已发货',
        5:'已退款',
      },
 NULL_ORDER_STATUS2:{
    '未付款': 1,
    '已付款': 2,
    '快递打印': 3,
    '已发货': 4,
    '已退款': 5,
 },
     NULL_ORDER_STATUS_OPTIONS:[
              {text:"未付款",value:1},
              {text:"已付款",value:2},
              {text:"快递打印",value:3},
              {text:"已发货",value:4},
              {text:"已退款",value:5},

            ],
// 订单状态
     ORDER_STATUS:{
          0:'未处理',
          1: '快递打印',
          2: '已发货',
      },
     ORDER_STATUS2:{
        '未处理': 0,
        '快递打印': 1,
        '已发货': 2,
      },
     ORDER_STATUS_OPTIONS:[
         {text:"未处理",value:0},
         {text:"快递打印",value:1},
         {text:"已发货",value:2},
      ],
     COMMON_CHECK_STATUS:{
          0:'未审核',
          1: '审核通过',
          2: '审核不通过',
      },
     COMMON_CHECK_STATUS2:{
        '未审核': 0,
        '审核通过': 1,
        '审核不通过': 2,
      },
      // 优惠卡类型
     DISCOUNT_CARD_TYPE:{

          1: '物流金额优惠卡',
          2: '物流折扣率优惠卡',
      },

     DISCOUNT_CARD_TYPE2:{
        '物流金额优惠卡': 1,
        '物流折扣率优惠卡': 2,
      },
      // 交易来源
      TRADE_INFO_SOURCE:{
          1:'订单',
          2: '商品',
          3: '充值',
          4: '提现',
          5: '其他费用',
      },
      // 交易来源
     TRADE_INFO_SOURCE2:{
            '订单': 1,
            '商品': 2,
            '充值': 3,
            '提现': 4,
            '其他费用': 5,
      },

     TRADE_INFO_SOURCE_OPTIONS:[
              {text:"订单",value:1},
              {text:"商品",value:2},
              {text:"充值",value:3},
              {text:"提现",value:4},
              {text:"其他费用",value:5},
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
