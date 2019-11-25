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
import pMyInvite from '../components/pc/MyInvite'
import pMyDiscountCard from '../components/pc/MyDiscountCard'
import pbkHome from '../components/pc/backstage/Home'
import pbkLogin from '../components/pc/backstage/Login'
import pbkQR from '../components/pc/backstage/qrtest.vue'
import pbkOrder from '../components/pc/backstage/Order'
import pbRefund from '../components/pc/backstage/Refund'
import pbkOutPutOrdersForExcel from '../components/pc/backstage/OutPutOrderForExcel'
import pbkExcelToString from '../components/pc/backstage/ExcelToString'
import pbkPrint from '../components/pc/backstage/Print'
import pbkTradeInfo from '../components/pc/backstage/TradeInfo'
import pbkPrintFormat from '../components/pc/backstage/printFormatPage'
// 会员卡管理
import pbkDiscountCard from '../components/pc/backstage/DiscountCard'
// 用户支付宝账户认证信息
import pbkUserAliPayAccountInfo from '../components/pc/backstage/UserAliPayAccount'
import pbkInviteRegisterInfo from '../components/pc/backstage/InviteRegister'

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
        {
          path:'/pc/personal/myInvite',
          name:'pMyInvite',
          component:pMyInvite
        },        
        {
          path:'/pc/personal/myDiscountCard',
          name:'pMyDiscountCard',
          component:pMyDiscountCard
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
          component:pbkPrintFormat
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
          name:'pbkOutPutOrdersForExcel',
          component:pbkOutPutOrdersForExcel
         },       
        {
          path:'/pc/back/home/excelToString',
          name:'pbkExcelToString',
          component:pbkExcelToString
         },

        {
          path:'/pc/back/home/print',
          name:'pbkPrint',
          component:pbkPrint
         },
        {
          path:'/pc/back/home/tradeInfo',
          name:'pbkTradeInfo',
          component:pbkTradeInfo
         },

        {
          // 打折卡
          path:'/pc/back/home/discountCard',
          name:'pbkDiscountCard',
          component:pbkDiscountCard
         },
         {
          // 用户支付宝认证信息
          path:'/pc/back/home/userAliPayAccountInfo',
          name:'pbkUserAliPayAccountInfo',
          component:pbkUserAliPayAccountInfo
         },
        {
          // 邀请注册信息
          path:'/pc/back/home/inviteRegisterInfo',
          name:'pbkInviteRegisterInfo',
          component:pbkInviteRegisterInfo
         },

      ]
    }
  ]
})
