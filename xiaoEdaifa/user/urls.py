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
router.register(r'details', user_views.UserViewSet, base_name='details')
router.register(r'orders', user_views.UserOrderViewSet, base_name='orders')
router.register(r'addOrders', user_views.UserMulOrderSaveViewSet, base_name='addOrders')
router.register(r'orderChange', user_views.UserOrderGoodsChangeViewSet, base_name='orderChange')
router.register(r'refundApply', user_views.UserRefundApplyViewSet, base_name='refundApply')
router.register(r'orderGoods', user_views.OrderGoodsViewSet, base_name='orderGoods')
router.register(r'tradeInfo', user_trade_views.TradeInfoViewSet, base_name='tradeInfo')
# router.register(r'orderList', user_views.UserOrderListViewSet, base_name='orderList')

urlpatterns = [
    url('login/', LoginView.as_view()),  # new
    url('alterPayPwd/', AlterPayPasswordView.as_view()),  # new
    url('alterPwd/', AlterPasswordView.as_view()),  # new
    url('ordersPay/', user_trade_views.OrderPayView.as_view()),  # new
    url('recharge/', user_trade_views.BalanceRecharge.as_view()),  # new
    # 根据穿过来的字段检查用户是否存在
    url('checkUser/', user_views.UserCheckView.as_view()),  # new
    # url('orderGoods/', user_views.OrderGoodsViewSet.as_view()),  # new
    # url('addOrders/', user_views.UserMulOrderSaveView.as_view()),  # new
    # url('order/', UserOrderViewSet.as_view()),  # new
    url(r'', include(router.urls))

]
