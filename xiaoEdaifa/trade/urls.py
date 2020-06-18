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
from django.conf.urls import url
from trade import views
urlpatterns = [
        url(r'^order/$', views.OrderView.as_view()),  # newnew
        url('qualityTest/', views.QualityTestView.as_view()),  # new
        url('logistics/', views.LogisticsView.as_view()),  # new
        url('nullPackageLogistics/', views.NullPackageLogisticsView.as_view()),  # new
        url('payInfo/', views.PayInfoView.as_view()),  # new
]