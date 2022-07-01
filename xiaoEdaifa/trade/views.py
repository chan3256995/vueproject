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
from user import  models as user_models
import traceback
from utils.permission import UserPermission
from utils.m_serializers import TradeAddOrdersSerializer
from utils import m_serializers
from utils import mcommon
import time
from trade import trade_utils
from backstage import back_utils
from _decimal import Decimal


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
        return Response(ret)# 物流表


# 空包物流
class NullPackageLogisticsView(APIView):
    authentication_classes = []

    class NullPackageLogisticsViewSerializer(serializers.ModelSerializer):
        class Meta:
            model = trade_models.NullPackageLogistics
            fields = "__all__"

    def get(self, request, *args, **kwargs):
        print(request.data)
        try:
            ret = {'code': "1000", 'message': ""}
            logistics = trade_views.NullPackageLogistics.objects.all()
            ser = self.NullPackageLogisticsViewSerializer(instance=logistics, many=True)
            ret['data'] = ser.data
        except:
            traceback.print_exc()
            logger.info('%s url:%s method:%s' % (traceback.format_exc(), request.path, request.method))
            ret['code'] = "1001"
            ret['message'] = '查询失败'
        return Response(ret)


# 付款信息入库
class PayInfoView(APIView):
    authentication_classes = []

    def post(self, request, *args, **kwargs):
        print(request.data)
        try:
            ret = {'code': "1000", 'message': ""}
            d = request.data
            # items = d.dict()
            # req_data = {}
            req_data = d
            # for key in items.keys():
            #     req_data = eval(key)
            #     break
            # req_data = {"pay":"Ali","uid":"2088012229532543","mark":"1574483704625_12_最初_17pay","money":"50.00","tradeNo":"201909182000400111005400396189"}
            trade_info = trade_models.TradeInfo.objects.filter(recharge_number=req_data.get("tradeNo")).first()
            # 如果该支付订单存在则自动审核
            if trade_info is not None:
                if Decimal(str(trade_info.trade_money)) == Decimal(str(req_data.get("money"))) and trade_info.is_pass is False:
                    back_utils.recharge_pass(trade_info.trade_number)
                    ret['code'] = "1000"
                    ret['message'] = '提交成功'
                    return Response(status=200, data=ret)
                else:
                    ret['code'] = "1001"
                    ret['message'] = '提交失败'
                    logger.info('%s url:%s method:%s' % ("数据库存在该订单 自动审核发现金额不一致或者已经审核通过", request.path, request.method))
                    return Response(status=400, data=ret)

            if  req_data !={}:
                if self.save_pay_info(req_data):
                    trade_info = trade_models.TradeInfo.objects.filter(recharge_number=req_data.get("tradeNo")).first()
                    back_utils.recharge_pass(trade_info.trade_number)
                    ret['code'] = "1000"
                    ret['message'] = '提交成功'
                    return Response(status=200, data=ret)
                else:
                    ret['code'] = "1001"
                    ret['message'] = '提交失败'
                    print("数据库存在该订单 自动审核发现金额不一致或者已经审核通过")
                    logger.info('%s url:%s method:%s' % ("数据库存在该订单 自动审核发现金额不一致或者已经审核通过", request.path, request.method))
                    return Response(status=400, data=ret)
            else:
                ret['code'] = "1001"
                ret['message'] = '提交失败'
                print("提交数据空")
                return Response(status=400, data=ret)

        except:
            traceback.print_exc()
            logger.info('%s url:%s method:%s' % (traceback.format_exc(), request.path, request.method))
            ret['code'] = "1001"
            ret['message'] = '提交失败'
            return Response(status=400, data=ret)
        return Response(status=200,data=ret)

    # def customize_code(self,request,req_data):


# 保存Android客户端监听到的支付订单信息
    def save_pay_info(self,req_data):
        try:
            if req_data !={}:
                trade_info = trade_models.TradeInfo.objects.filter(recharge_number=req_data.get("tradeNo")).first()
                if trade_info is not None:
                    return False
                mark = req_data.get('mark')
                if mark.endswith("_17pay"):
                    user = None
                    if mark is not None or mark !="":
                        mark_array = mark.split("_")
                        mark_msg = mark_array[0]
                        mark_user_id = int(mark_array[1])
                        user = user_models.User.objects.filter(id = mark_user_id).first()
                        if user is None:
                            return False
                    save_data = {}
                    save_data.update({'recharge_number': req_data.get("tradeNo")})
                    save_data.update({'trade_money': req_data.get("money")})
                    save_data.update({'user': user.id})
                    ser = m_serializers.PayInfoSerializer(data=save_data, context={'request': self.request})
                    ser.is_valid(raise_exception=True)

                    ser.validated_data['trade_source'] = mcommon.trade_source_choices2.get("充值")
                    ser.validated_data['cash_in_out_type'] = mcommon.cash_in_out_type_choices2.get("收入")
                    ser.validated_data['trade_number'] = trade_utils.get_trade_number(self,user.id)
                    ser.validated_data['mark'] = mark_msg
                    ser.validated_data['user_balance'] = user.balance
                    ser.validated_data['add_time'] = time.time() * 1000
                    ser.validated_data['message'] = "充值 " + " 充值号：" + save_data.get( "recharge_number") + " mark：" + mark + "金额：" + save_data.get("trade_money")
                    ser.save()
                else:
                    return False
            else:
                return False
        except:
            traceback.print_exc()
            logger.info('%s url:%s method:%s' % (traceback.format_exc(), self.request.path, self.request.method))
            raise Exception(traceback.format_exc())
        return True


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
    permission_classes = [UserPermission, ]

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
