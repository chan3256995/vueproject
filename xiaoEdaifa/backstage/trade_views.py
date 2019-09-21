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
import time
from django.db.models import Q
from utils.auth import BackStageAuthentication
from utils.permission import Superpermission
from backstage import back_utils
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



# 缺货
class NotHasGoods(APIView):
    authentication_classes = [BackStageAuthentication, ]
    permission_classes = [Superpermission]

    def post(self, request, *args, **kwargs):
        print("tag print''''''''''''''")
        print(request.data)
        try:
            with transaction.atomic():
                ret = {'code': "1000", 'message': ""}
                req_order_list = request.data.get("no_goods_order_list")
                req_order_number_list = []
                # 异常状态订单
                exception_order_list = []
                for req_order_object in req_order_list:
                    req_order_number_list.append(req_order_object.get("order_number"))
                order_queryset = trade_models.Order.objects.filter(Q(order_number__in = req_order_number_list)).distinct()
                for sql_order in order_queryset:
                    tem_exceptions_order_goods = []
                    sql_order_goods_query = trade_models.OrderGoods.objects.filter(order = sql_order)
                    req_order = self.find_order(sql_order.order_number,req_order_list)
                    for sql_order_goods in sql_order_goods_query:
                        # 请求列表找商品
                        req_goods = self.find_goods(sql_order_goods.goods_number, req_order.get("orderGoods"))
                        # 提交上来的数据没有该商品
                        if req_goods == "":
                            continue
                        # 商品状态已经改变了 比如改为拦截发货  并且 客户端提交了该商品
                        if sql_order_goods.status != mcommon.status_choices2.get("拿货中") and req_goods != "":
                            tem_exceptions_order_goods.append(sql_order_goods.goods_number)
                        elif sql_order_goods.status == mcommon.status_choices2.get("拿货中") and req_goods !="" \
                                and req_goods.get("goods_count") != sql_order_goods.goods_count \
                                or sql_order_goods.refund_apply_status != mcommon.refund_apply_choices2.get("无售后"):
                            # 状态正常  数量对不上或者有售后申请
                            tem_exceptions_order_goods.append(sql_order_goods.goods_number)
                        elif sql_order_goods.status == mcommon.status_choices2.get("拿货中"):
                            sql_order_goods.status = mcommon.status_choices2.get("缺货")
                            sql_order_goods.save()
                            pass

                    if len(tem_exceptions_order_goods) != 0:
                        exception_order_list.append({"order_number": sql_order.order_number, 'orderGoods':tem_exceptions_order_goods})
                ret['exception_order'] = exception_order_list
                return JsonResponse(ret)

        except:
            traceback.print_exc()
            ret['code'] = "1001"
            ret['message'] = "查询异常"
            logger.info('%s url:%s method:%s' % (traceback.format_exc(), request.path, request.method))
            return JsonResponse(ret)
        return JsonResponse(ret)
    def find_order(self,order_number,req_order_list):
        for req_order in req_order_list:
            if order_number == req_order.get("order_number"):
                return req_order
        return ""

    # 查找一个商品是在列表里
    def find_goods(self,goods_number,req_order_goods_list):
        for i in range(len(req_order_goods_list)):
            if goods_number == req_order_goods_list[i].get("goods_number"):
                return req_order_goods_list[i]
        return ""


# 明日有货
class TomorrowGoodsView(APIView):
    authentication_classes = [BackStageAuthentication, ]
    permission_classes = [Superpermission]

    def post(self, request, *args, **kwargs):
        print("tag print''''''''''''''")
        print(request.data)
        try:
            with transaction.atomic():
                ret = {'code': "1000", 'message': ""}
                req_order_list = request.data.get("tomorrow_order_list")
                req_order_number_list = []
                # 异常状态订单
                exception_order_list = []
                for req_order_object in req_order_list:
                    req_order_number_list.append(req_order_object.get("order_number"))
                order_queryset = trade_models.Order.objects.filter(Q(order_number__in = req_order_number_list)).distinct()
                for sql_order in order_queryset:
                    tem_exceptions_order_goods = []
                    sql_order_goods_query = trade_models.OrderGoods.objects.filter(order = sql_order)
                    req_order = self.find_order(sql_order.order_number,req_order_list)
                    for sql_order_goods in sql_order_goods_query:
                        # 请求列表找商品
                        req_goods = self.find_goods(sql_order_goods.goods_number, req_order.get("orderGoods"))
                        # 提交上来的数据没有该商品
                        if req_goods == "":
                            continue
                        # 商品状态已经改变了 比如改为拦截发货  并且 客户端提交了该商品
                        if sql_order_goods.status != mcommon.status_choices2.get("拿货中") and req_goods != "":
                            tem_exceptions_order_goods.append(sql_order_goods.goods_number)
                        elif sql_order_goods.status == mcommon.status_choices2.get("拿货中") and req_goods !="" \
                                and req_goods.get("goods_count") != sql_order_goods.goods_count \
                                or sql_order_goods.refund_apply_status != mcommon.refund_apply_choices2.get("无售后"):
                            # 状态正常  数量对不上或者有售后申请
                            tem_exceptions_order_goods.append(sql_order_goods.goods_number)
                        elif sql_order_goods.status == mcommon.status_choices2.get("拿货中"):
                            sql_order_goods.status = mcommon.status_choices2.get("明日有货")
                            sql_order_goods.save()
                            pass

                    if len(tem_exceptions_order_goods) != 0:
                        exception_order_list.append({"order_number": sql_order.order_number, 'orderGoods':tem_exceptions_order_goods})
                ret['exception_order'] = exception_order_list
                return JsonResponse(ret)

        except:
            traceback.print_exc()
            ret['code'] = "1001"
            ret['message'] = "查询异常"
            logger.info('%s url:%s method:%s' % (traceback.format_exc(), request.path, request.method))
            return JsonResponse(ret)
        return JsonResponse(ret)
    def find_order(self,order_number,req_order_list):
        for req_order in req_order_list:
            if order_number == req_order.get("order_number"):
                return req_order
        return ""

# # 查找一个商品是在列表里
    def find_goods(self,goods_number,req_order_goods_list):
        for i in range(len(req_order_goods_list)):
            if goods_number == req_order_goods_list[i].get("goods_number"):
                return req_order_goods_list[i]
        return ""

# 发货
class DeliverGoodsView(APIView):
    authentication_classes = [BackStageAuthentication, ]
    permission_classes = [Superpermission]

    def post(self, request, *args, **kwargs):
        print("tag print''''''''''''''")
        print(request.data)
        try:
            with transaction.atomic():
                ret = {'code': "1000", 'message': ""}
                req_order_list = request.data.get("deliver_order_list")
                req_order_number_list = []
                # 异常状态订单
                exception_order_list = []
                for req_order_object in req_order_list:
                    req_order_number_list.append(req_order_object.get("order_number"))
                order_queryset = trade_models.Order.objects.filter(Q(order_number__in=req_order_number_list)).distinct()
                for sql_order in order_queryset:
                    tem_exceptions_order_goods = []
                    tem_nomal_order_goods = []
                    sql_order_goods_query = trade_models.OrderGoods.objects.filter(order=sql_order)
                    for sql_order_goods in sql_order_goods_query:

                        if sql_order_goods.status == mcommon.status_choices2.get("已退款") :
                            pass
                        elif sql_order_goods.status == mcommon.status_choices2.get("快递打印") and sql_order_goods.refund_apply_status == mcommon.refund_apply_choices2.get("无售后"):
                            tem_nomal_order_goods.append(sql_order_goods)
                        else:
                            # 商品状态已经改变了 比如改为拦截发货  并且 客户端提交了该商品
                            tem_exceptions_order_goods.append(sql_order_goods.goods_number)
                            break
                    req_order = self.find_order(sql_order.order_number, req_order_list)
                    req_order_logistic_name = req_order.get("logistics_name")
                    req_order_logistic_number = req_order.get("logistics_number")
                    if len(tem_exceptions_order_goods) != 0 or req_order_logistic_name == "" or req_order_logistic_number == "" :
                        exception_order_list.append(
                            {"order_number": sql_order.order_number, 'orderGoods': tem_exceptions_order_goods})
                    else:
                        for nomal_order_goods in tem_nomal_order_goods:
                            nomal_order_goods.status = mcommon.status_choices2.get("已发货")
                            nomal_order_goods.save()
                        sql_order.logistics_number = req_order_logistic_number
                        sql_order.logistics_name = req_order_logistic_name
                        sql_order.save()
                ret['exception_order'] = exception_order_list
                return JsonResponse(ret)

        #
        except:
            traceback.print_exc()
            ret['code'] = "1001"
            ret['message'] = "查询异常"
            logger.info('%s url:%s method:%s' % (traceback.format_exc(), request.path, request.method))
            return JsonResponse(ret)
        return JsonResponse(ret)

    def find_order(self,order_number,req_order_list):
        for req_order in req_order_list:
            if order_number == req_order.get("order_number"):
                return req_order
        return ""


# 打印物流单
class LogisticsPrintView(APIView):
    authentication_classes = [BackStageAuthentication, ]
    permission_classes = [Superpermission]

    def post(self, request, *args, **kwargs):
        print("LogisticsPrintView print''''''''''''''")
        print(request.data)
        try:
            with transaction.atomic():
                ret = {'code': "1000", 'message': ""}
                req_order_number_list = request.data.get("print_logistic_order_list")
                # 异常状态订单
                exception_order_list = []
                order_queryset = trade_models.Order.objects.filter(Q(order_number__in = req_order_number_list)).distinct()
                for sql_order in order_queryset:
                    tem_exceptions_order_goods = []
                    tem_nomal_order_goods = []
                    sql_order_goods_query = trade_models.OrderGoods.objects.filter(order = sql_order)
                    for sql_order_goods in sql_order_goods_query:
                        if sql_order_goods.status == mcommon.status_choices2.get("已退款") :
                            pass
                        elif sql_order_goods.status == mcommon.status_choices2.get("已拿货") and sql_order_goods.refund_apply_status == mcommon.refund_apply_choices2.get("无售后"):
                            tem_nomal_order_goods.append(sql_order_goods)
                        else:
                            # 商品状态已经改变了 比如改为拦截发货  并且 客户端提交了该商品订单
                            tem_exceptions_order_goods.append(sql_order_goods.goods_number)
                            break
                    if len(tem_exceptions_order_goods) != 0:
                        # 有异常状态商品
                        exception_order_list.append({"order_number": sql_order.order_number, 'orderGoods':tem_exceptions_order_goods})
                    else:
                        for nomal_order_goods in tem_nomal_order_goods:
                            nomal_order_goods.status = mcommon.status_choices2.get("快递打印")
                            nomal_order_goods.save()
                ret['exception_order'] = exception_order_list
                return JsonResponse(ret)

        #
        except:
            traceback.print_exc()
            ret['code'] = "1001"
            ret['message'] = "查询异常"
            logger.info('%s url:%s method:%s' % (traceback.format_exc(), request.path, request.method))
            return JsonResponse(ret)
        return JsonResponse(ret)


# 已拿货
class PurchasedGoodsCompleteView(APIView):
    authentication_classes = [BackStageAuthentication, ]
    permission_classes = [Superpermission]

    def post(self, request, *args, **kwargs):
        print("tag print''''''''''''''")
        print(request.data)
        try:
            with transaction.atomic():
                ret = {'code': "1000", 'message': ""}
                req_order_list = request.data.get("purchase_complete_order_list")
                req_order_number_list = []
                # 异常状态订单
                exception_order_list = []
                for req_order_object in req_order_list:
                    req_order_number_list.append(req_order_object.get("order_number"))
                order_queryset = trade_models.Order.objects.filter(Q(order_number__in = req_order_number_list)).distinct()
                for sql_order in order_queryset:
                    tem_exceptions_order_goods = []
                    sql_order_goods_query = trade_models.OrderGoods.objects.filter(order = sql_order)
                    req_order = self.find_order(sql_order.order_number,req_order_list)
                    for sql_order_goods in sql_order_goods_query:
                        # 请求列表找商品
                        req_goods = self.find_goods(sql_order_goods.goods_number, req_order.get("orderGoods"))
                        # 提交上来的数据没有该商品
                        if req_goods == "":
                            continue
                        # 商品状态已经改变了 比如改为拦截发货  并且 客户端提交了该商品
                        if sql_order_goods.status != mcommon.status_choices2.get("拿货中") and req_goods != "":
                            tem_exceptions_order_goods.append(sql_order_goods.goods_number)
                        elif sql_order_goods.status == mcommon.status_choices2.get("拿货中") and req_goods !="" \
                                and req_goods.get("goods_count") != sql_order_goods.goods_count \
                                or sql_order_goods.refund_apply_status != mcommon.refund_apply_choices2.get("无售后"):
                            # 状态正常  数量对不上或者有售后申请
                            tem_exceptions_order_goods.append(sql_order_goods.goods_number)
                        elif sql_order_goods.status == mcommon.status_choices2.get("拿货中"):
                            sql_order_goods.status = mcommon.status_choices2.get("已拿货")
                            sql_order_goods.save()
                            pass

                    if len(tem_exceptions_order_goods) != 0:
                        exception_order_list.append({"order_number": sql_order.order_number, 'orderGoods':tem_exceptions_order_goods})
                ret['exception_order'] = exception_order_list
                return JsonResponse(ret)

        except:
            traceback.print_exc()
            ret['code'] = "1001"
            ret['message'] = "查询异常"
            logger.info('%s url:%s method:%s' % (traceback.format_exc(), request.path, request.method))
            return JsonResponse(ret)
        return JsonResponse(ret)

    # 查找一个订单里面的所有商品是否在列表里
    def find_all_goods_of_order(self,normal_status_order_goods_list,req_order_goods_list):
        tem_goods_list = []

        for normal_goods in normal_status_order_goods_list:
            search_goods = {"goods_number": "", "goods_count": 0}
            # req_order_item = self.get_item_by_order_number(normal_goods.order_number,req_order_list)
            for i in range(normal_goods.goods_count):
                is_find, req_order_goods_list = self.find_goods(normal_goods, req_order_goods_list)
                if is_find is True:
                    search_goods['goods_number'] = normal_goods.goods_number
                    search_goods['goods_count'] = search_goods.get("goods_count") + 1
            tem_goods_list.append(search_goods)
        return tem_goods_list
    #
    def find_order(self,order_number,req_order_list):
        for req_order in req_order_list:
            if order_number == req_order.get("order_number"):
                return req_order

    # 查找一个商品是在列表里
    def find_goods(self,goods_number,req_order_goods_list):
        for i in range(len(req_order_goods_list)):
            if goods_number == req_order_goods_list[i].get("goods_number"):
                return req_order_goods_list[i]
        return ""


    def get_item_by_order_number(self,order_number,req_order_list):
        for item in req_order_list:
            if item.get("order_number") == order_number:
                return item
        return ""



#  采购/拿货
class PurchaseGoodsView(APIView):
    authentication_classes = [BackStageAuthentication, ]
    permission_classes = [Superpermission]

    def post(self, request, *args, **kwargs):

        print(request.data)
        try:
            with transaction.atomic():
                ret = {'code': "1000", 'message': ""}
                order_list = request.data.get("order_list")
                # 异常状态订单
                exception_order_list=[]
                order_queryset = trade_models.Order.objects.filter(Q(order_number__in = order_list) ).distinct()
                for order in order_queryset:
                    order_goods_query = trade_models.OrderGoods.objects.filter(order = order)
                    tem_exceptions_order_goods = []
                    for order_goods in order_goods_query:
                        if order_goods.status != mcommon.status_choices2.get("标签打印"):
                            tem_exceptions_order_goods.append(order_goods.goods_number)
                        else:
                            order_goods.status = mcommon.status_choices2.get("拿货中")
                            order_goods.save()
                    if len(tem_exceptions_order_goods) != 0:
                        exception_order_list.append({"order_number": order.order_number, 'orderGoods':tem_exceptions_order_goods})

                ret['exception_order'] = exception_order_list
                return JsonResponse(ret)
        except:
            traceback.print_exc()
            ret['code'] = "1001"
            ret['message'] = "查询异常"
            logger.info('%s url:%s method:%s' % (traceback.format_exc(), request.path, request.method))
            return JsonResponse(ret)
        return JsonResponse(ret)


# 打印标签
class TagPrintView(APIView):
    authentication_classes = [BackStageAuthentication, ]
    permission_classes = [Superpermission]

    def post(self, request, *args, **kwargs):
        print("tag print''''''''''''''")
        print(request.data)
        try:
            with transaction.atomic():
                ret = {'code': "1000", 'message': ""}
                order_list = request.data.get("order_list")
                # 异常状态订单
                exception_order_list=[]
                order_queryset = trade_models.Order.objects.filter(Q(order_number__in = order_list) ).distinct()
                for order in order_queryset:
                    order_goods_query = trade_models.OrderGoods.objects.filter(order = order)
                    tem_exceptions_order_goods = []
                    for order_goods in order_goods_query:
                        if order_goods.status != mcommon.status_choices2.get("已付款"):
                            tem_exceptions_order_goods.append(order_goods.goods_number)
                        else:
                            order_goods.status = mcommon.status_choices2.get("标签打印")
                            order_goods.save()
                    if len(tem_exceptions_order_goods) != 0:
                        exception_order_list.append({"order_number": order.order_number, 'orderGoods':tem_exceptions_order_goods})

                ret['exception_order'] = exception_order_list
                return JsonResponse(ret)
        except:
            traceback.print_exc()
            ret['code'] = "1001"
            ret['message'] = "查询异常"
            logger.info('%s url:%s method:%s' % (traceback.format_exc(), request.path, request.method))
            return JsonResponse(ret)
        return JsonResponse(ret)


class  StopDeliverRefundView(APIView):
    def post(self, request, *args, **kwargs):
        print("StopDeliverPass''''''''''''''")
        print(request.data)
        try:
            ret = {'code': "1000", 'message': ""}
            goods_number = request.data.get("goods_number")

        except:
            traceback.print_exc()
            ret['code'] = "1001"
            ret['message'] = "查询异常"
            logger.info('%s url:%s method:%s' % (traceback.format_exc(), request.path, request.method))
            return JsonResponse(ret)






# 收到包裹留言
class StopDeliverPass(APIView):
    def post(self, request, *args, **kwargs):
        print("StopDeliverPass''''''''''''''")
        print(request.data)
        try:
            with transaction.atomic():
                ret = {'code': "1000", 'message': ""}
                goods_number =request.data.get("goods_number")
                order_goods = trade_models.models.object.filter(goods_number = goods_number).first()
                if order_goods.is_stop_deliver is True:
                    order_goods.customer_server_message = order_goods.customer_server_message + "拦截发货成功,进行退货处理...."+ mcommon.format_from_time_stamp(time.time())

        except:
            traceback.print_exc()
            ret['code'] = "1001"
            ret['message'] = "查询异常"
            logger.info('%s url:%s method:%s' % (traceback.format_exc(), request.path, request.method))
            return JsonResponse(ret)


# 充值审核通过
class RechargePassView(APIView):
    authentication_classes = []
    permission_classes = []
    # authentication_classes = [BackStageAuthentication, ]
    # permission_classes = [permission.Superpermission, ]

    def post(self, request, *args, **kwargs):
        ret = {'code': "1000", 'message': ""}
        try:
            trade_number = request.data.get("trade_number")
            if back_utils.recharge_pass(trade_number):
                ret['code'] = "1000"
                ret['message'] = "修改成功"
            else:
                ret['code'] = "1001"
                ret['message'] = "修改失败"

        except:
            traceback.print_exc()
            ret['code'] = "1001"
            ret['message'] = "修改失败"
            logger.info('%s url:%s method:%s' % (traceback.format_exc(), request.path, request.method))
        return JsonResponse(ret)
