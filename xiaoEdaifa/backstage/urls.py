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
router.register(r'nullOrders', views.NullOrderViewSet, base_name='nullOrders')
# 优惠卡
router.register(r'discountCard', views.DiscountCardViewSet, base_name='discountCard')
#  用户认证
router.register(r'alipayAccountInfo', views.AlipayAccountInfoViewSet, base_name='alipayAccountInfo')
# 邀请注册信息
router.register(r'inviteRegInfo', views.InviteRegisterInfoViewSet, base_name='inviteRegInfo')
router.register(r'returnPackageInfo', views.ReturnPackageInfoViewSet, base_name='returnPackageInfo')
router.register(r'goodsRefund', views.OrderGoodsRefundViewSet, base_name='goodsRefund')
router.register(r'tradeInfo', trade_views.TradeInfoViewSet, base_name='tradeInfo')
# router.register(r'tagPrint', trade_views.TagPrintViewSet, base_name='tradeInfo')

urlpatterns = [
    # url(r'^static/(?P<path>.*)$', my_view.serve),
    url(r'static/(?P<path>.*)', serve, {'document_root': settings.STATIC_ROOT}),
    # 导出标签打印状态订单
    url('outputExcel/', views.OutPutOrdersView.as_view()),

    # 导出付款状态的订单 （同时修改状态为快递打印【tag_type字段为1】）(tag_type 默认为null ， 0 为失败  ，1为进行中状态)
    url('outputNullOrder/', views.OutPutNullOrderView.as_view()),
    # 导出付款状态的订单 （同时修改状态为快递打印【tag_type字段为1】）下单到第三方失败要调用这个接口修改恢复订单状态为付款状态 tag_type 为0
    url('outputNullOrderOtherSiteException/', views.OutputNullOrderOtherSiteExceptionView.as_view()),
    # 导出付款状态的订单 （同时修改状态为快递打印【tag_type字段为1】）下单到第三方成功之后要调用这个接口修改tag_type 为0
    url('outputNullOrderOtherSiteSuccess/', views.OutputNullOrderOtherSiteSuccessView.as_view()),

    # (tag_type 默认为null  0 为失败  1为进行中状态)
    # 导出付款状态的订单 （同时修改状态为【tag_type字段为1】）下单到第三方失败要调用这个接口修改恢复订单状态为付款状态 tag_type 为0
    url('outputOrderOtherSiteException/', views.OutputOrderOtherSiteExceptionView.as_view()),
    # 导出付款状态的订单 （同时修改状态为快递打印【tag_type字段为1】）下单到第三方成功之后要调用这个接口修改tag_type 为0
    url('outputOrderOtherSiteSuccess/', views.OutputOrderOtherSiteSuccessView.as_view()),
    # 充值审核通过
    url('rechargePass/', trade_views.RechargePassView.as_view()),
    # 支付宝账号真实信息审核通过
    url('userAlipayAccountCheckPass/', trade_views.UserAlipayAccountCheckPassView.as_view()),
    url('stopDeliverPass/', trade_views.StopDeliverPass.as_view()),
    # 添加折扣卡
    url('add_discount_card/', trade_views.AddDiscountCardView.as_view()),
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
    # 空包发货
    url('deliverNullOrder/', trade_views.DeliverNullOrderView.as_view()),

    # 这个接口只为315物流来源发货
    url('deliverFrom315/', trade_views.DeliverFrom315View.as_view()),
    # 这个接口只为BL物流来源发货
    url('deliverFromBL/', trade_views.DeliverFromBLView.as_view()),
    #  明天有货
    url('tomorrowGoods/', trade_views.TomorrowGoodsView.as_view()),
    # 修改拿货中状态商品 统一用这个接口（如 拿货中状态 改为 明日有货  2-5天有货 已拿货  其他）
    url('changePurchasingStatus/', trade_views.ChangePurchasingStatus.as_view()),
    url('notGoods/', trade_views.NotHasGoods.as_view()),
    # 明日有货 重新修改为 付款状态
    url('tomorrowStatusReset/', trade_views.TomorrowStatusResetView.as_view()),

    # 明日有货 重新修改为 付款状态 定时器开关
    url('timeSwitch/', trade_views.TimeSwitchView.as_view()),
    url('temp/', trade_views.Temp.as_view()),
    url('appclient/', trade_views.AppClient.as_view()),
    url('addOrderToChuanMei/', trade_views.AddOrderToChuanMeiView.as_view()),
    url('addReturnPackages/', trade_views.AddReturnPackages.as_view()),


    url(r'', include(router.urls))
]
