"""xxdaina URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/1.11/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  url(r'^$', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  url(r'^$', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.conf.urls import url, include
    2. Add a URL to urlpatterns:  url(r'^blog/', include('blog.urls'))
"""
from django.conf.urls import url,include
from user.views import LoginView,UserOrderViewSet,AlterPasswordView,AlterPayPasswordView
from django.contrib import admin
from user import views as user_views
from user import trade_views as user_trade_views
from rest_framework import routers
router = routers.DefaultRouter()

router.register(r'reg', user_views.UserRegViewSet, base_name='reg')
# 用户信息
router.register(r'details', user_views.UserViewSet, base_name='details')
# 订单
router.register(r'orders', user_views.UserOrderViewSet, base_name='orders')
router.register(r'nullOrders', user_views.UsernNullOrdersViewSet, base_name='nullOrders')
# router.register(r'douYinGoods', user_views.DouYinGoodsViewSet, base_name='douYinGoods')
# 添加多订单
router.register(r'addOrders', user_views.UserMulOrderSaveViewSet, base_name='addOrders')
router.register(r'addNullPackageOrder', user_views.AddNullPackageOrderViewSet, base_name='addNullPackageOrder')
router.register(r'orderChange', user_views.UserOrderGoodsChangeViewSet, base_name='orderChange')
# 售后申请
router.register(r'refundApply', user_views.UserRefundApplyViewSet, base_name='refundApply')

# 商品
router.register(r'orderGoods', user_views.OrderGoodsViewSet, base_name='orderGoods')
# 用户交易信息
router.register(r'tradeInfo', user_trade_views.TradeInfoViewSet, base_name='tradeInfo')
# 支付宝实名认证信息
router.register(r'userAlipayRealInfo', user_trade_views.UserAlipayRealInfoViewSet, base_name='userAlipayRealInfo')
# 通过淘宝订单号获取订单
router.register(r'getOrderByTBOrderNumberList', user_views.GetOrderByTBOrderNumberListViewSet,base_name='getOrderByTBOrderNumberList')  # new
# 通过淘宝订单号获取空包订单
router.register(r'getNullOrderByTBOrderNumberList', user_views.GetNullOrderByTBOrderNumberListViewSet,base_name='getNullOrderByTBOrderNumberList')  # new

#  获取用户被邀请用户信息

router.register(r'inviteInfo', user_views.InviteInfoViewSet, base_name='inviteInfo')

# 用户保存的商品
router.register(r'userGoodsInfo', user_views.UserGoodsInfoViewSet, base_name='userGoodsInfo')

# 用关注的抖音店铺
router.register(r'userDouYinShopInfo', user_views.UserDouYinShopViewSet,base_name='userDouYinShopInfo')

# 主播列表
router.register(r'userFavDouYinZhuBoInfo', user_views.UserDouYinZhuBoViewSet,base_name='userFavDouYinZhuBoInfo')
# 商品采集记录
router.register(r'douYinGoodsCollectRecord', user_views.DouYinGoodsCollectRecordViewSet,base_name='douYinGoodsCollectRecord')

router.register(r'userDouYinGoodsInfo', user_views.UserDouYinGoodsViewSet,base_name='userDouYinGoodsInfo')
router.register(r'userDouYinVideoInfo', user_views.UserDouYinVideoViewSet,base_name='userDouYinVideoInfo')


urlpatterns = [
    url('login/', LoginView.as_view()),  # new
    # 修改支付密码
    url('alterPayPwd/', AlterPayPasswordView.as_view()),  # new
    # 修改登录密码
    url('alterPwd/', AlterPasswordView.as_view()),  # new
    url('ordersPay/', user_trade_views.OrderPayView.as_view()),  # new
    url('nullOrdersPay/', user_trade_views.NullOrdersPayView.as_view()),  # new
    # 充值
    url('recharge/', user_trade_views.BalanceRecharge.as_view()),  # new
    # 根据穿过来的字段检查用户是否存在
    url('checkUser/', user_views.UserCheckView.as_view()),  # new
    # 找回密码
    url('forget_password/', user_views.ForgetPasswordView.as_view()),  # new
    # 重置密码
    url('reset_password/', user_views.ResetPasswordView.as_view()),  # new
    # 修改商品信息
    url('alterOrderGoodsDetails/', user_views.AlterOrderGoodsDetailsView.as_view()),  # new
    # 修改订单地址
    url('alterOrderAddress/', user_views.AlterOrderAddressView.as_view()),
    # 获取用户优惠卡信息
    url('userDiscountCards/', user_views.GetUserDiscountCardsView.as_view()),  # new
    # 空包订单退款
    url('nullOrderRefund/', user_views.UserNullOrderRefundView.as_view()),  # new
    #   给订单添加备注
    url('addOrUpdateOrderRemarks/', user_views.AddOrderRemarksView.as_view()),  # new
    # 把未付款的订单转向临时空包变
    url('moveOrderToNullOrderTem/', user_views.MoveOrderToNullOrderTemView.as_view()),  # new
    # 删除用户空包临时表订单
    url('deleteNullOrderTem/', user_views.DeleteNullOrderTemView.as_view()),  # new
    # 获取yoghurt临时表订单
    url('getNullOrderTem/', user_views.GetNullOrderTemView.as_view()),  # new

    url('addOrderToChuanMei/', user_views.AddOrderToChuanMeiView.as_view()),

    url('getPlugsVersion/', user_views.GetPlugsVersionView.as_view()),
    #  访问网页内容 返回给客户端
    url('getWebPageContent/', user_views.GetWebPageContentView.as_view()),

    #  访问网页内容 返回给客户端
    url('getWebPageContent2/', user_views.GetWebPageContentView2.as_view()),

    # ***************************抖音**********************************
    # 搜集抖音商品信息
    url('collectDouYinData/', user_views.CollectDouYinGoodsDataView.as_view()),
    # 收集抖音视频信息
    url('collectDouYinVideoData/', user_views.CollectDouYinVideoDataView.as_view()),
    #  用户关注的抖音店铺
    url('userDouYinShopAdd/', user_views.AddUserDouYinShopView.as_view()),
    #  添加抖音主播
    url('douYinZhuBoAdd/', user_views.AddDouYinZhuBoView.as_view()),

    #  用户添加的抖音店铺删除
    url('userDouYinShopDelete/', user_views.DeleteDouYinShopView.as_view()),

    #  用户添加的主播删除
    url('userDouYinZhuBoDelete/', user_views.DeleteDouYinZhuBoView.as_view()),

    #  用户自己保存的修改
    url('useDouYinShopEdit/', user_views.EditDouYinShopView.as_view()),

    #  修改主播信息
    url('useDouYinZhuBoEdit/', user_views.EditDouYinZhuBoView.as_view()),

    # 用户收藏的item修改
    url('userDouYinFavShopInfoEdit/', user_views.EditUserDouYinFavShopInfoView.as_view()),

    # 用户收藏的主播信息修改
    url('userDouYinFavZhuBoInfoEdit/', user_views.EditUserDouYinFavZhuBoInfoView.as_view()),
        #  清除数据
    url('cleanDouGoodsView/', user_views.CleanDouGoodsView.as_view()),
    # 清除视频数据
    url('cleanDouVideosView/', user_views.CleanDoVideosView.as_view()),
    # ***************************抖音**********************************

    #  用户自己保存的商品
    url('userGoodsAdd/', user_views.AddUserGoodsView.as_view()),
    #  用户自己保存的商品删除
    url('userGoodsDelete/', user_views.DeleteUserGoodsView.as_view()),



    #  用户自己保存的修改
    url('userGoodsEdit/', user_views.EditUserGoodsView.as_view()),




# 预支无酒单号
    url('bl_get_order_logistics_number/', user_trade_views.BLGetOrderLogisticsInfo.as_view()),







    # url('stopDeliver/', user_views.UserStopDeliverView.as_view()),  # new
    # url('orderGoods/', user_views.OrderGoodsViewSet.as_view()),  # new
    # url('addOrders/', user_views.UserMulOrderSaveView.as_view()),  # new
    # url('order/', UserOrderViewSet.as_view()),  # new
    url(r'', include(router.urls))

]
