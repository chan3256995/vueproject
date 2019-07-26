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



urlpatterns = [
    # url(r'^static/(?P<path>.*)$', my_view.serve),
    url(r'static/(?P<path>.*)',serve,{'document_root':settings.STATIC_ROOT}),
    url('outputExcel/', views.OutPutOrdersView.as_view()),
    url('rechargePass/', trade_views.RechargePassView.as_view()),
    url(r'', include(router.urls))
]
