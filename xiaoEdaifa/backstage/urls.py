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
from django.contrib.staticfiles import views as my_view
from django.views.static import serve
from backstage import views
from backstage import trade_views
from rest_framework import routers
from xiaoEdaifa import settings
router = routers.DefaultRouter()
router.register(r'orderGoods', views.OrderGoodsViewSet, base_name='orderGoods')
router.register(r'orders', views.OrderViewSet, base_name='orders')
router.register(r'goodsRefund', views.OrderGoodsRefundViewSet, base_name='goodsRefund')
router.register(r'tradeInfo', trade_views.TradeInfoViewSet, base_name='tradeInfo')
# router.register(r'tagPrint', trade_views.TagPrintViewSet, base_name='tradeInfo')

urlpatterns = [
    # url(r'^static/(?P<path>.*)$', my_view.serve),
    url(r'static/(?P<path>.*)',serve,{'document_root':settings.STATIC_ROOT}),
    url('outputExcel/', views.OutPutOrdersView.as_view()),
    url('rechargePass/', trade_views.RechargePassView.as_view()),
    url('stopDeliverPass/', trade_views.StopDeliverPass.as_view()),
    # 打印标签请求  把商品状态改为打印标签
    url('tagPrint/', trade_views.TagPrintView.as_view()),
    # 采购中
    url('purchaseGoods/', trade_views.PurchaseGoodsView.as_view()),
    # 采购完成 /已拿货
    url('purchaseGoodsComplete/', trade_views.PurchasedGoodsCompleteView.as_view()),
    # 快递单打印
    url('logisticsPrint/', trade_views.LogisticsPrintView.as_view()),
    # 发货
    url('deliverGoods/', trade_views.DeliverGoodsView.as_view()),
# 这个接口只为315物流来源发货
    url('deliverFrom315/', trade_views.DeliverFrom315View.as_view()),
    #  明天有货
    url('tomorrowGoods/', trade_views.TomorrowGoodsView.as_view()),
    # 修改拿货中状态商品 统一用这个接口（如 拿货中状态 改为 明日有货  2-5天有货 已拿货  其他）
    url('changePurchasingStatus/', trade_views.ChangePurchasingStatus.as_view()),
    url('notGoods/', trade_views.NotHasGoods.as_view()),
    # 明日有货 重新修改为 付款状态
    url('tomorrowStatusReset/', trade_views.TomorrowStatusResetView.as_view()),

    # 明日有货 重新修改为 付款状态 定时器开关
    url('timeSwitch/', trade_views.TimeSwitchView.as_view()),

    url(r'', include(router.urls))
]
