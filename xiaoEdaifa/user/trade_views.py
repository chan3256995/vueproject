import logging
from rest_framework.views import APIView
from django.http.response import JsonResponse
from utils import m_serializers
from user import models as user_models
from trade import models as trade_models
from utils import mcommon
from django.db import transaction
from utils.auth import UserAuthtication
from utils.permission import UserPermission
logger = logging.getLogger('stu')
import traceback
from rest_framework import mixins
from rest_framework.viewsets import GenericViewSet
from rest_framework.pagination import PageNumberPagination
import time
from utils import encryptions
from _decimal import Decimal
from rest_framework import serializers
class UsersPagination(PageNumberPagination):
    # 指定每一页的个数
    page_size = 10
    # 可以让前端来设置page_szie参数来指定每页个数
    page_size_query_param = 'page_size'
    # 设置页码的参数
    page_query_param = 'page'


class BaseTrade():
    def __init__(self,user):
        self.user = user

    def get_trade_number(self):
        # 当前时间+userid+随机数
        from time import strftime
        from random import Random
        random_ins = Random()
        trade_number = "tr{time_str}{userid}{ranstr}".format(time_str=strftime("%Y%m%d%H%M%S"),
                                                             userid=self.user.id,
                                                             ranstr=random_ins.randint(10, 99999))
        return trade_number


# 充值
class BalanceRecharge(APIView):

    def post(self, request, *args, **kwargs):
        ret = {'code': "1000", 'message': None}
        try:
            print("------------data----------------")
            print(request.query_params)
            print(request.data)
            trade_info = trade_models.TradeInfo.objects.filter(recharge_number = request.data.get("recharge_number")).first()
            if trade_info is not None:
                ret['code'] = "1001"
                ret['message'] = "请勿重复提交"
                return JsonResponse(ret)
            user = request.user
            ser = m_serializers.RechargeBalanceSerializer(data=request.data,context={'request': request})
            ser.is_valid(raise_exception=True)
            ser.validated_data['trade_source'] = mcommon.trade_source_choices2.get("充值")
            ser.validated_data['cash_in_out_type'] = mcommon.cash_in_out_type_choices2.get("收入")
            ser.validated_data['trade_number'] = self.get_trade_number()
            ser.validated_data['user_balance'] = user.balance
            ser.validated_data['add_time'] = time.time() * 1000
            ser.validated_data['message'] = "充值 " + "充值号：" + request.data.get("recharge_number") + "金额：" + request.data.get("trade_money")
            ser.save()
        except:
            traceback.print_exc()
            logger.info('%s url:%s method:%s' % (traceback.format_exc(), request.path, request.method))
            ret['code'] = "1001"
            ret['message'] = "提交失败"
        return JsonResponse(ret)

    def get_trade_number(self):
        # 当前时间+userid+随机数
        from time import strftime
        from random import Random
        random_ins = Random()
        trade_number = "tr{time_str}{userid}{ranstr}".format(time_str=strftime("%Y%m%d%H%M%S"),
                                                                 userid=self.request.user.id,
                                                                 ranstr=random_ins.randint(10, 99999))
        return trade_number


# 查询个人交易信息
class TradeInfoViewSet(mixins.ListModelMixin,GenericViewSet):
    serializer_class = m_serializers.QueryTradeInfoSerializer
    # serializer_class = m_serializers.TradeOrderQuerySerializer
    # 设置分页的class
    pagination_class = UsersPagination

    def list(self, request, *args, **kwargs):
        try:
            ret = {'code': "1000", 'message': ""}
            queryset = self.filter_queryset(self.get_queryset())
            page = self.paginate_queryset(queryset)
            if page is not None:
                serializer = self.get_serializer(page, many=True)

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

    # def get_serializer_class(self):
    #     if self.action == "retrieve":
    #         return m_serializers.TradeOrderQuerySerializer
    #     elif self.action == "create":
    #         return m_serializers.TradeOrderQuerySerializer
    #     elif self.action == "update":
    #         return m_serializers.TradeOrderQuerySerializer
    #     elif self.action == "delete":
    #         return m_serializers.TradeOrderQuerySerializer
    #
    #     return m_serializers.TradeOrderQuerySerializer
    def get_serializer_class(self):
        return m_serializers.QueryTradeInfoSerializer

    def get_object(self):
        return self.request.user

    def get_queryset(self):
        return trade_models.TradeInfo.objects.filter(user = self.request.user).order_by("-add_time")


# 支付宝真实信息
class UserAlipayRealInfoViewSet( mixins.UpdateModelMixin, mixins.RetrieveModelMixin,GenericViewSet):

    class QueryUserAlipayInfo(serializers.ModelSerializer):
        class Meta:
            model = user_models.UserAlipayRealInfo
            fields = "__all__"

    serializer_class = [QueryUserAlipayInfo]

    def retrieve(self, request, *args, **kwargs):
        try:
            ret = {"code": "1000", "message": ""}
            ql_alipay_real_info = user_models.UserAlipayRealInfo.objects.filter(user=request.user).first()
            if ql_alipay_real_info is not None:
                serializer = self.QueryUserAlipayInfo(ql_alipay_real_info,many=False)
                ret['alipay_account_info'] = serializer.data
            else:
                ret['alipay_account_info'] = None
        except:
            traceback.print_exc()
            ret['code'] = "1001"
            ret['message'] = "提交异常"
            logger.info('%s url:%s method:%s' % (traceback.format_exc(), request.path, request.method))
        return JsonResponse(ret)

    def update(self, request, *args, **kwargs):
        try:
            ret = {"code": "1000", "message": ""}
            req_data = request.data
            req_alipay_account_info = req_data.get("alipay_account_info")

            create_data = {
                    'user' : request.user,
                    'alipay_account': req_alipay_account_info.get('alipay_account'),
                    'alipay_real_name': req_alipay_account_info.get('alipay_real_name'),
                    'check_trade_no': req_alipay_account_info.get('check_trade_no'),
                    'check_status': mcommon.common_check_status_choices2.get('未审核'),
                    'check_time': time.time()*1000,
                    'add_time': time.time()*1000

                }
            update_data ={
                'alipay_account': req_alipay_account_info.get('alipay_account'),
                'alipay_real_name': req_alipay_account_info.get('alipay_real_name'),
                'check_trade_no': req_alipay_account_info.get('check_trade_no'),

            }
            sql_alipay_account_info = user_models.UserAlipayRealInfo.objects.filter(user=request.user).first()
            if sql_alipay_account_info is None:
                # 该用户没有提交认证信息
                sql_alipay_account_info = user_models.UserAlipayRealInfo.objects.filter(alipay_account=update_data.get('alipay_account')).first()
                if sql_alipay_account_info is not None:
                    # 提交的认证账户已经存在
                    ret['code'] = "1001"
                    ret['message'] = "该支付宝账户已存在"
                    return JsonResponse(ret)
                else:

                    user_models.UserAlipayRealInfo.objects.create(**create_data)
            else:
                if sql_alipay_account_info.check_status == mcommon.common_check_status_choices2.get("审核通过"):
                    ret['code'] = "1001"
                    ret['message'] = "审核通过不可修改"
                    return JsonResponse(ret)
                sql_alipay_account_info.alipay_account = update_data.get('alipay_account')
                sql_alipay_account_info.alipay_real_name = update_data.get('alipay_real_name')
                sql_alipay_account_info.save()
        except:
            traceback.print_exc()
            ret['code'] = "1001"
            ret['message'] = "提交异常"
            logger.info('%s url:%s method:%s' % (traceback.format_exc(), request.path, request.method))
        return JsonResponse(ret)





# 订单支付
class OrderPayView(APIView):
    authentication_classes = [UserAuthtication]
    permission_classes = [UserPermission]

    def post(self,request, *args, **kwargs):
        print("order_list--------------")
        print(request.data.get("order_list"))
        order_list = request.data.get("order_list")
        ret = {'code': "1000", 'message': ""}
        try:
            pay_pwd = request.data.get("pay_pwd")
            print("pay_pwd",pay_pwd)
            pay_pwd_ = encryptions.get_sha_encryptions(pay_pwd)
            if request.user.pay_password != pay_pwd_:
                ret['code'] = "1001"
                ret['message'] = "密码错误"
                logger.info('%s url:%s method:%s' % (traceback.format_exc(), request.path, request.method))
                return JsonResponse(ret)
            query_set = trade_models.Order.objects.filter(order_number__in=order_list)
            pay_money = 0.0;
            for order in query_set:
                if order.order_owner != request.user:
                    # 订单不是该请求用户的跳过
                    continue
                print(order.total_price)
                pay_cur_order_continue = True
                trade_item = trade_models.TradeInfo.objects.filter(order_number = order.order_number).first()
                if trade_item is not None:
                    #  该订单已经有支付记录
                    pay_cur_order_continue = False
                order_goods_query = trade_models.OrderGoods.objects.filter(order=order)
                for order_gooods in order_goods_query:
                    if order_gooods.status != mcommon.status_choices2.get("待付款"):
                        # 订单有非 待付款的订单 该订单不进行支付
                        pay_cur_order_continue = False
                        break

                if pay_cur_order_continue is False:
                    continue
                data = {
                    "trade_money":  order.total_price,
                    "order_number": order.order_number,
                }
                ser = m_serializers.OrderPayBalanceSerializer(data=data, context={'request': request})
                ser.is_valid(raise_exception=True)
                ser.validated_data['trade_number'] = BaseTrade(request.user).get_trade_number()
                ser.validated_data['trade_source'] = mcommon.trade_source_choices2.get("订单")
                ser.validated_data['cash_in_out_type'] = mcommon.cash_in_out_type_choices2.get("支出")
                ser.validated_data['user_balance'] = request.user.balance
                ser.validated_data['add_time'] = time.time()*1000
                ser.validated_data['message'] = "订单："+order.order_number

                if request.user.balance >= order.total_price:
                    request.user.balance = Decimal(str(request.user.balance)) - Decimal(str(order.total_price))
                    ser.validated_data['user_balance'] = Decimal(str(request.user.balance))
                    ser.validated_data['is_pass'] = True
                    with transaction.atomic():
                        for order_gooods in order_goods_query:
                            order_gooods.status = mcommon.status_choices2.get("已付款")
                            order_gooods.save()

                        ser.save()
                        request.user.save()
                else:
                    ret['code'] = "1001"
                    ret['message'] = "余额不足"



        except:
            traceback.print_exc()
            ret['code'] = "1001"
            ret['message'] = "支付失败"
            logger.info('%s url:%s method:%s' % (traceback.format_exc(), request.path, request.method))
        return JsonResponse(ret)
