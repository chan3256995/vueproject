import Vue from 'vue'

import VueRouter from 'vue-router'//路由插件
import pLogin from '../components/pc/Login.vue'
import pRegister from '../components/pc/Register.vue'
import pForgetPassword from '../components/pc/ForgotPassword'
import pResetPassword from '../components/pc/ResetPassword'
import pHome from '../components/pc/Home.vue'
import pNullPackageHome from '../components/pc/NullPackageHome.vue'
import pDouYinHome from '../components/pc/DouYinHome.vue'
import pPlugsInfo from '../components/pc/PlugsInfos.vue'
import pMyGoods from '../components/pc/MyGoods.vue'

import pNullOrder from '../components/pc/PlaceNullOrder.vue'
import pMyFocusDouYinShop from '../components/pc/MyFocusDouYinShop.vue'
import pMyFocusDouYinZhuBo from '../components/pc/MyFocusDouYinZhuBo.vue'
import pMyDouYinGoods from '../components/pc/MyDouYinGoods.vue'
import pMyDouYinVideo from '../components/pc/MyDouYinVideo.vue'
import pMyNullOrder from '../components/pc/MyNullOrder.vue'
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
import pbkNullOrder from '../components/pc/backstage/NullOrder'
import pbRefund from '../components/pc/backstage/Refund'
import pbkOutPutOrdersForExcel from '../components/pc/backstage/OutPutOrderForExcel'
import pbkExcelToString from '../components/pc/backstage/ExcelToString'
import pbkPrint from '../components/pc/backstage/Print'
import pbkTradeInfo from '../components/pc/backstage/TradeInfo'
import pbkPrintFormat from '../components/pc/backstage/printFormatPage'
// 会员卡管理
import pbkDiscountCard from '../components/pc/backstage/DiscountCard'
// 后台用户显示
import pbkUsers from '../components/pc/backstage/Users'
// 用户支付宝账户认证信息
import pbkUserAliPayAccountInfo from '../components/pc/backstage/UserAliPayAccount'
import pbkInviteRegisterInfo from '../components/pc/backstage/InviteRegister'
import pbkReturnPackageInfo from '../components/pc/backstage/ReturnPackage'

Vue.use(VueRouter)
export default new VueRouter({
  // mode:'history',
  routes:[

    //根目录默认地址
    {path: '/', redirect: '/pc/home/myorder'},


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
     {
      path: '/pc/nullPackageHome',
      name: 'pNullPackageHome',
      component: pNullPackageHome,
        children: [
           {
            path:'/pc/nullPackageHome/pNullOrder',
            name:'pNullOrder',
            component:pNullOrder
         },
          {
            path:'/pc/nullPackageHome/pMyNullOrder',
            name:'pMyNullOrder',
            component:pMyNullOrder
         },
        ]

    },



     {
      path: '/pc/douYinHome',
      name: 'pDouYinHome',
      component: pDouYinHome,
        children: [
           {
            path:'/pc/douYinHome/pMyDouYinGoods',
            name:'pMyDouYinGoods',
            component:pMyDouYinGoods
          },           
          {
            path:'/pc/douYinHome/pMyDouYinVideo',
            name:'pMyDouYinVideo',
            component:pMyDouYinVideo
          },
            {
            path:'/pc/douYinHome/pMyFocusDouYinShop',
            name:'pMyFocusDouYinShop',
            component:pMyFocusDouYinShop
         },

          {
            path:'/pc/douYinHome/pMyFocusDouYinZhuBo',
            name:'pMyFocusDouYinZhuBo',
            component:pMyFocusDouYinZhuBo
         },
        ]

    },


    {
      path: '/pc/pMyFocusDouYinShop',
      name: 'pMyFocusDouYinShop',
      component: pMyFocusDouYinShop,
    },

     {
      path: '/pc/pMyDouYinGoods',
      name: 'pMyDouYinGoods',
      component: pMyDouYinGoods,
    },
      {
      path: '/pc/pMyGoods',
      name: 'pMyGoods',
      component: pMyGoods,
    },
    {
      path: '/pc/pPlugsInfo',
      name: 'pPlugsInfo',
      component: pPlugsInfo,
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
          path:'/pc/back/home/nullOrder',
          name:'pbkNullOrder',
          component:pbkNullOrder
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
          // 用户列表
          path:'/pc/back/home/users',
          name:'pbkUsers',
          component:pbkUsers
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
        {
          // 退件信息
          path:'/pc/back/home/returnPackageInfo',
          name:'pbkReturnPackageInfo',
          component:pbkReturnPackageInfo
         },
      ]
    }
  ]
})
