from django.shortcuts import render
import logging
logger = logging.getLogger('stu')
# Create your views here.
from rest_framework.views import APIView
from django.http.response import JsonResponse,HttpResponse
from rest_framework.response import Response
from rest_framework import serializers
from trade import models as trade_views
from trade import  models as trade_models
import  traceback
from utils.permission import VIPPermission
from utils.m_serializers import TradeAddOrdersSerializer

# class Authtication(object):
#     def authenticate(self,request):
#         token = request._request.GET.get('token')
#         token_obj = models.UserToken.objects.filter(token=token).first()
#         if not token_obj:
#             raise exceptions.AuthenticationFailed("用户认证失败")
#         # zai rest  framework 内部会将两字段复制给request（request.user,request.util），
#         return (token_obj.user, token_obj)
#
#     def authenticate_header(self,request):
#         pass


# 物流表
class LogisticsView(APIView):
    authentication_classes = []

    class LogisticsSerializer(serializers.ModelSerializer):
        class Meta:
            model = trade_models.Logistics
            fields = "__all__"

    def get(self, request, *args, **kwargs):
        print(request.data)
        try:
            ret = {'code': "1000", 'message': ""}
            quality_test_query = trade_views.Logistics.objects.all()
            ser = self.LogisticsSerializer(instance=quality_test_query, many=True)
            ret['data'] = ser.data
        except:
            traceback.print_exc()
            logger.info('%s url:%s method:%s' % (traceback.format_exc(), request.path, request.method))
            ret['code'] = "1001"
            ret['message'] = '查询失败'
        return Response(ret)


# 质检表
class QualityTestView(APIView):
    class QueryQualityTestSerializer(serializers.ModelSerializer):
        class Meta:
            model = trade_models.QualityTest
            fields = "__all__"

    def get(self, request, *args, **kwargs):
        print(request.data)
        try:
            ret = {'code': "1000", 'message': ""}
            quality_test_query = trade_views.QualityTest.objects.all()
            ser = self.QueryQualityTestSerializer(instance=quality_test_query, many=True)
            ret['data'] = ser.data
        except:
            traceback.print_exc()
            logger.info('%s url:%s method:%s' % (traceback.format_exc(), request.path, request.method))
            ret['code'] = "1001"
            ret['message'] = '查询失败'
        return Response(ret)


class OrderView(APIView):
    permission_classes = [VIPPermission, ]

    def get(self,request,*args,**kwargs):
        ret = {'code': "1000", 'message': None}
        try:
            order_infos = trade_views.Order.objects.all()
            print(order_infos)
            ser = TradeAddOrdersSerializer(instance=order_infos, many=True)
            # ret = json.dumps(ser.data, ensure_ascii=False)
            print(ret)
            return Response(ser.data)
        except Exception as e:
            traceback.print_exc()
            print('11111111111')
        return Response(ser.data)
