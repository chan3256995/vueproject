import logging
logger = logging.getLogger('stu')
from rest_framework.views import APIView
from django.http.response import JsonResponse
from trade import models as trade_models
from user import models as user_models
from utils import mcommon
import traceback
from rest_framework.pagination import PageNumberPagination
from rest_framework import mixins
from django.db import transaction
from rest_framework.viewsets import GenericViewSet
from utils import m_serializers


class UsersPagination(PageNumberPagination):
    # 指定每一页的个数
    page_size = 10
    # 可以让前端来设置page_szie参数来指定每页个数
    page_size_query_param = 'page_size'
    # 设置页码的参数
    page_query_param = 'page'


# 查询个人交易信息
class TradeInfoViewSet(mixins.ListModelMixin,GenericViewSet):
    serializer_class = m_serializers.QueryTradeInfoSerializer
    # serializer_class = m_serializers.TradeOrderQuerySerializer
    # 设置分页的class
    pagination_class = UsersPagination
    authentication_classes = []
    permission_classes = []

    def list(self, request, *args, **kwargs):
        try:
            ret = {'code': "1000", 'message': ""}
            # queryset = self.filter_queryset(self.get_queryset())
            queryset =  trade_models.TradeInfo.objects.filter().order_by("-add_time")

            page = self.paginate_queryset(queryset)
            if page is not None:
                serializer = self.get_serializer(page, many=True)
                print(serializer.data)
                return self.get_paginated_response(serializer.data)

            serializer = self.get_serializer(queryset, many=True)
            return JsonResponse(serializer.data)
        except:
            traceback.print_exc()
            ret['code'] = "1001"
            ret['message'] = "查询异常"
            logger.info('%s url:%s method:%s' % (traceback.format_exc(), request.path, request.method))
            return JsonResponse(ret)
        return JsonResponse(ret)


# 充值审核通过
class RechargePassView(APIView):
    authentication_classes = [ ]
    permission_classes = [ ]
    # authentication_classes = [BackStageAuthentication, ]
    # permission_classes = [permission.Superpermission, ]

    def post(self, request, *args, **kwargs):
        ret = {'code': "1000", 'message': ""}
        try:
            print("99999999999999")
            print(request.data)
            trade_number = request.data.get("trade_number")
            trade_info = trade_models.TradeInfo.objects.filter(trade_number=trade_number).first()
            if trade_info.cash_in_out_type == mcommon.cash_in_out_type_choices2.get("收入"):
                with transaction.atomic():
                    user = user_models.User.objects.filter(id = trade_info.user.id).first()
                    user.balance = user.balance+trade_info.trade_money
                    trade_info.user_balance = user.balance
                    trade_info.is_pass = True
                    user.save()
                    trade_info.save()
        except:
            traceback.print_exc()
            ret['code'] = "1001"
            ret['message'] = "修改失败"
            logger.info('%s url:%s method:%s' % (traceback.format_exc(), request.path, request.method))
        return JsonResponse(ret)
