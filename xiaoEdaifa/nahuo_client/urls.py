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
from rest_framework import routers
from nahuo_client import views as nahuo_views

router = routers.DefaultRouter()
# 订单
router.register(r'orders', nahuo_views.OrderViewSet, base_name='orders')





urlpatterns = [
    # 把上面的router引用进来  上面的router才能用
    url(r'', include(router.urls)),
    url('login/', nahuo_views.LoginView.as_view()),  # new

    # 选取已付款的订单
    url('selectOrders/', nahuo_views.SelectOrderView.as_view()),  # new

]
