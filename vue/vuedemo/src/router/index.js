import Vue from 'vue'

import VueRouter from 'vue-router'//路由插件
import pLogin from '../components/pc/Login.vue'
import pRegister from '../components/pc/Register.vue'
import pForgetPassword from '../components/pc/ForgotPassword'
import pResetPassword from '../components/pc/ResetPassword'
import pHome from '../components/pc/Home.vue'
import ppOrder from '../components/pc/PlaceOrder.vue'
import pMyOrder from '../components/pc/MyOrder.vue'
import pRefundApply from '../components/pc/RefundApply'
import pPersonal from '../components/pc/Personal'
import pUserDetails from '../components/pc/UserDetails'
import pCapitalAccount from '../components/pc/CapitalAccount'
import pRecharge from '../components/pc/Recharge'
import pRecharge2 from '../components/pc/Recharge2'
import pbkHome from '../components/pc/backstage/Home'
import pbkLogin from '../components/pc/backstage/Login'
import pbkQR from '../components/pc/backstage/qrtest.vue'
import pbkOrder from '../components/pc/backstage/Order'
import pbRefund from '../components/pc/backstage/Refund'
import pOutPutOrdersForExcel from '../components/pc/backstage/OutPutOrderForExcel'
import pExcelToString from '../components/pc/backstage/ExcelToString'
import pPrint from '../components/pc/backstage/Print'
import pTradeInfo from '../components/pc/backstage/TradeInfo'
import pPrintFormat from '../components/pc/backstage/printFormatPage'

Vue.use(VueRouter)
export default new VueRouter({
  // mode:'history',
  routes:[

    //根目录默认地址
    {path: '/', redirect: '/pc/home/porder'},


    {//注册
      path:'/pc/register',
      name:'pRegister',
      component:pRegister
    },

      {//忘记密码
      path:'/pc/forgotPassword',
      name:'pForgetPassword',
      component:pForgetPassword
    },

      {//重置密码
      path:'/pc/resetPassword',
      name:'pResetPassword',
      component:pResetPassword
    },
    {
      path:'/pc/refund',
      name:'pRefund',
      component:pRefundApply
    },

    {
      path:'/pc/login',
      name:'pLogin',
      component:pLogin
    } ,
    {
      path:'/pc/personal',
      name:'pPersonal',
      component:pPersonal,
      children:[
        {
          path:'/pc/personal/userDetails',
          name:'pUserDetails',
          component:pUserDetails
        },
        {
          path:'/pc/personal/CapitalAccount',
          name:'pCapitalAccount',
          component:pCapitalAccount
        },
        {
          path:'/pc/personal/recharge',
          name:'pRecharge',
          component:pRecharge
        },

        {
          path:'/pc/personal/recharge2',
          name:'pRecharge2',
          component:pRecharge2
        },
      ]
    } ,
    {
      path: '/pc/home',
      name: 'pHome',
      component: pHome,
      children: [
        {
          path:'/pc/home/porder',
          name:'ppPorder',
          component:ppOrder
         },
         {
          path:'/pc/home/myorder',
          name:'pMyOrder',
          component:pMyOrder
         },
      ]
    },




    //后台路由

       {
      path:'/pc/back/qr',
      name:'pbkQR',
      component:pbkQR
    } ,
    {
      path:'/pc/back/login',
      name:'pbkLogin',
      component:pbkLogin
    } ,
    {
          path:'/pc/back/printPageFormat',
          name:'pPrintFormat',
          component:pPrintFormat
    },

    {
      path: '/pc/back/home',
      name: 'pbkHome',
      component: pbkHome,
      children: [
        {
          path:'/pc/back/home/order',
          name:'pbkOrder',
          component:pbkOrder
         },

         {
          path:'/pc/back/home/refund',
          name:'pbRefund',
          component:pbRefund
         },

        {
          path:'/pc/back/home/outPutExcel',
          name:'pOutPutOrdersForExcel',
          component:pOutPutOrdersForExcel
         },       
        {
          path:'/pc/back/home/excelToString',
          name:'pExcelToString',
          component:pExcelToString
         },

        {
          path:'/pc/back/home/print',
          name:'pPrint',
          component:pPrint
         },
        {
          path:'/pc/back/home/tradeInfo',
          name:'pTradeInfo',
          component:pTradeInfo
         },


      ]
    }
  ]
})
