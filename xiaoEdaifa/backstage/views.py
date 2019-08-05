import logging
logger = logging.getLogger('stu')
from utils import permission
from rest_framework.views import APIView
from utils import mcommon
# Create your views here.
from rest_framework import mixins
from utils import m_serializers
from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response
from rest_framework.viewsets import GenericViewSet
import traceback
from django.db.models import Q
from utils.permission import Superpermission
from utils.auth import BackStageAuthentication
from django.db import transaction
from rest_framework  import serializers
from trade import models as trade_models
import xlwt
from datetime import datetime
from xiaoEdaifa import settings
from utils import mglobal
from trade import trade_utils
import time

class OutPutOrdersView(APIView):
    authentication_classes = [BackStageAuthentication,]
    permission_classes = [Superpermission]

    def post(self, request, *args, **kwargs):
        data = request.data
        if data.get("for_315") is not None:
            return self.out_to_315(request, *args, **kwargs)
        else:
            return self.out_to_print(request, *args, **kwargs)


    def out_to_print(self,request, *args, **kwargs):
        ret = {"code": "1000", "message": ""}

        try:
            zero_point_today = mcommon.get_time_0clock_of_today()
            print(zero_point_today)
            # 实例化一个Workbook()对象(即excel文件)
            wbk = xlwt.Workbook()
            # 新建一个名为Sheet1的excel sheet。此处的cell_overwrite_ok =True是为了能对同一个单元格重复操作。
            sheet = wbk.add_sheet('Sheet1', cell_overwrite_ok=True)
            # 获取当前日期，得到一个datetime对象如：(2016, 8, 9, 23, 12, 23, 424000)
            today = datetime.today()
            # 将获取到的datetime对象仅取日期如：2016-8-9
            today_date = datetime.date(today)
            print("ddddd")
            query_set = trade_models.Order.objects.filter( orderGoods__status=mcommon.status_choices2.get("已付款")).distinct().order_by('-add_time')
            # query_set = trade_models.Order.objects.filter(add_time__gte=zero_point_today).values('order_number','logistics_name',
            #                  'consignee_name','consignee_phone','consignee_address','orderGoods__shop_market_name','orderGoods__shop_floor').order_by('-add_time')

            sheet.write(0, 0, "收件人")
            sheet.write(0, 1, "单号")
            sheet.write(0, 2, "市场")
            sheet.write(0, 3, "楼层")
            sheet.write(0, 4, "档口")
            sheet.write(0, 5, "货号")
            sheet.write(0, 6, "价格")
            sheet.write(0, 7, "颜色")
            # sheet.write(0, 8, "尺码")
            sheet.write(0, 8, "数量")
            sheet.write(0, 9, "快递")
            sheet.write(0, 10, "电话")
            sheet.write(0, 11, "地址")
            sheet.write(0, 12, "下单日期")
            cur_row = 0
            for i in range(len(query_set)):
                # 将每一行的每个元素按行号i,列号j,写入到excel中
                order = query_set[i]
                order_number = order.order_number
                goods_query = trade_models.OrderGoods.objects.filter(order=order)
                for j in range(len(goods_query)):
                    if order_goods.status != mcommon.status_choices2.get("已付款"):
                        continue
                    cur_row = cur_row + 1
                    order_goods = goods_query[j]

                    # order_goods = order.orderGoods
                    sheet.write(cur_row, 0, order.consignee_name)
                    if len(goods_query) > 1:
                        tem_str = str(len(goods_query)) + "-" + str(j + 1) + "-"
                        sheet.write(cur_row, 1, tem_str + str(order.id))
                    else:
                        sheet.write(cur_row, 1, str(order.id))
                    sheet.write(cur_row, 2, mcommon.market_short_name.get(order_goods.shop_market_name))
                    floor = order_goods.shop_floor
                    stall_no = order_goods.shop_stalls_no
                    while floor.find("楼") != -1:
                        floor = floor.replace("楼", "F")

                    while floor.find("区") != -1:
                        floor = floor.replace("区", "")
                    import re
                    reg_ = '^[0-9]F'
                    result = re.match(reg_, stall_no)
                    if result is not None:
                        stall_no = stall_no.replace(result[0], "")
                    sheet.write(cur_row, 3, floor)
                    sheet.write(cur_row, 4, stall_no)
                    sheet.write(cur_row, 5, order_goods.art_no)
                    sheet.write(cur_row, 6, order_goods.goods_price)
                    sheet.write(cur_row, 7, order_goods.goods_color)
                    sheet.write(cur_row, 8, order_goods.goods_count)
                    sheet.write(cur_row, 9, order.logistics_name[0:1])

                    sheet.write(cur_row, 10, order.consignee_phone)
                    sheet.write(cur_row, 11, order.consignee_address)
                    sheet.write(cur_row, 12, mcommon.format_from_time_stamp(int(str(order.add_time)[0:10])))

            excel_url = mglobal.STATIC_URL_BASE + settings.STATIC_URL + str(today_date) + '.xls'
            excel_path = settings.STATIC_ROOT + "/" + str(today_date) + '.xls'
            # 以传递的name+当前日期作为excel名称保存。
            wbk.save(excel_path)
            ret['excel_url'] = excel_url
        except:
            traceback.print_exc()
            ret['code'] = "1001"
            ret['message'] = "生成失败"
            logger.info('%s url:%s method:%s' % (traceback.format_exc(), request.path, request.method))
        return Response(ret)



    def out_to_315(self, request, *args, **kwargs):
        ret = {"code": "1000", "message": ""}
        try:
            zero_point_today = mcommon.get_time_0clock_of_today()
            print(zero_point_today)
            # 实例化一个Workbook()对象(即excel文件)
            wbk = xlwt.Workbook()
            # 新建一个名为Sheet1的excel sheet。此处的cell_overwrite_ok =True是为了能对同一个单元格重复操作。
            sheet = wbk.add_sheet('Sheet1', cell_overwrite_ok=True)
            # 获取当前日期，得到一个datetime对象如：(2016, 8, 9, 23, 12, 23, 424000)
            today = datetime.today()
            # 将获取到的datetime对象仅取日期如：2016-8-9
            today_date = datetime.date(today)
            print("ddddd")
            query_set = trade_models.Order.objects.filter(orderGoods__status = mcommon.status_choices2.get("已付款")).distinct().order_by('-add_time')

            sheet.write(1, 0, "城市")
            sheet.write(1, 1, "市场")
            sheet.write(1, 2, "楼层")
            sheet.write(1, 3, "档口号")
            sheet.write(1, 4, "商品货号")
            sheet.write(1, 5, "规格（颜色/尺码）")
            sheet.write(1, 6, "件数")
            sheet.write(1, 7, "单件价格")
            sheet.write(1, 8, "图片路径")
            # sheet.write(0, 8, "尺码")
            sheet.write(1, 9, "备注")
            sheet.write(1, 10, "详细地址")
            cur_row = 1
            for i in range(len(query_set)):

                # 当前订单行
                cur_order_row = cur_row+1
                # 将每一行的每个元素按行号i,列号j,写入到excel中
                order = query_set[i]
                order_number = order.order_number
                goods_query = trade_models.OrderGoods.objects.filter(order = order)
                for j in range(len(goods_query)):
                    cur_row = cur_row + 1
                    order_goods = goods_query[j]
                    print(order_goods)
                    print(j)

                    # order_goods = order.orderGoods
                    sheet.write(cur_row, 0, "广州")
                    sheet.write(cur_row, 1, order_goods.shop_market_name)

                    floor = order_goods.shop_floor
                    stall_no = order_goods.shop_stalls_no
                    while floor.find("楼") !=-1:
                        floor = floor.replace("楼","F")

                    while floor.find("区") !=-1:
                        floor = floor.replace("区","")
                    import re
                    reg_ = '^[0-9]F'
                    result = re.match(reg_, stall_no)
                    if result is not  None:
                        stall_no = stall_no.replace(result[0],"")
                    sheet.write(cur_row, 2, floor)
                    sheet.write(cur_row, 3, stall_no)
                    sheet.write(cur_row, 4, order_goods.art_no)
                    sheet.write(cur_row, 5, order_goods.goods_color)
                    sheet.write(cur_row, 6, order_goods.goods_count)
                    sheet.write(cur_row, 7, order_goods.goods_price)
                    sheet.write(cur_row, 8, "")

                    sheet.write(cur_row, 9, "")
                    sheet.write(cur_row, 10, order.consignee_address)

                consignee_address = order.consignee_address.replace(","," ",3)
                # 合并第1行到第2行的第0列到第3列。
                sheet.write_merge(cur_order_row, cur_row, 10, 10,order.consignee_name+"，"+str(order.consignee_phone)+"，"+ consignee_address)

            excel_url = mglobal.STATIC_URL_BASE + settings.STATIC_URL + str(today_date) + '.xls'
            excel_path = settings.STATIC_ROOT + "/" + str(today_date) + '.xls'
            # 以传递的name+当前日期作为excel名称保存。
            wbk.save(excel_path)
            ret['excel_url'] = excel_url
        except:
            traceback.print_exc()
            ret['code'] = "1001"
            ret['message'] = "生成失败"
            logger.info('%s url:%s method:%s' % (traceback.format_exc(), request.path, request.method))
        return Response(ret)


class OrderGoodsViewSet(mixins.UpdateModelMixin,GenericViewSet):
    authentication_classes = [BackStageAuthentication,]
    permission_classes = [Superpermission]
    serializer_class = m_serializers.TradeOrderGoodsSerializer

    def update(self, request, *args, **kwargs):
        print(request.user)
        ret = {"code": "1000", "message": ""}
        try:
            goods_id = kwargs.get("pk")
            # 如果修改的信息时候退款申请 或 商品状态 下检查是否存在售后申请
            refund_apply_status = request.data.get("refund_apply_status")
            status = request.data.get("status")
            if (refund_apply_status is not None and refund_apply_status != "") or (status is not None and status != ""):
                with transaction.atomic():
                    query_set = trade_models.RefundApply.objects.filter(orderGoods=goods_id).first()
                    if query_set is not None:
                        ret = {"code": "1001", "message": "该商品有售后申请,先处理"}
                        return Response(ret)
            partial = True
            instance = trade_models.OrderGoods.objects.filter(id=kwargs.get("pk")).first()
            print(instance)
            # server_message = request.data.get("customer_service_message")
            # if server_message is not None:
            #     request.data['customer_service_message'] = instance.customer_service_message+ request.data.get("customer_service_message") + '\n'
            serializer = self.get_serializer(instance, data=request.data, partial=partial)
            serializer.is_valid(raise_exception=True)
            self.perform_update(serializer)
            ret['code'] = "1000"
            ret['message'] = "更新成功"
            print("..........3.......")
            ret['data'] = serializer.data
        except:
            print(traceback.print_exc())
            print(serializer.error)
            ret = {"code": "1001", "message": "更改失败"}
            logger.info('%s url:%s method:%s' % (traceback.format_exc(), request.path, request.method))
            return Response(ret)

        # if getattr(instance, '_prefetched_objects_cache', None):
        #     # If 'prefetch_related' has been applied to a queryset, we need to
        #     # forcibly invalidate the prefetch cache on the instance.
        #     instance._prefetched_objects_cache = {}

        return Response(ret)


class OrderViewSet2(mixins.UpdateModelMixin,GenericViewSet):
    authentication_classes = [BackStageAuthentication, ]
    serializer_class = m_serializers.TradeOrderQuerySerializer

    def update(self, request, *args, **kwargs):
        ret = {"code": "1000", "message": ""}
        try:
            partial = True
            instance = trade_models.Order.objects.filter(id=kwargs.get("pk")).first()
            print(instance)
            serializer = self.get_serializer(instance, data=request.data, partial=partial)
            serializer.is_valid(raise_exception=True)
            self.perform_update(serializer)
        except:
            print(serializer.error)
            print(traceback.print_exc())
            ret = {"code": "1001", "message": "更改失败"}
            logger.info('%s url:%s method:%s' % (traceback.format_exc(), request.path, request.method))
            return Response(ret)

        # if getattr(instance, '_prefetched_objects_cache', None):
        #     # If 'prefetch_related' has been applied to a queryset, we need to
        #     # forcibly invalidate the prefetch cache on the instance.
        #     instance._prefetched_objects_cache = {}
        ret['code'] = "1000"
        ret['message'] = "更新成功"

        ret['data'] = serializer.data
        return Response(ret)

    def perform_update(self, serializer):
        serializer.save()

    def partial_update(self, request, *args, **kwargs):
        kwargs['partial'] = True
        return self.update(request, *args, **kwargs)


class SuperUserOrderGoodsAlterView(APIView):
        authentication_classes = [BackStageAuthentication, ]
        permission_classes = [permission.Superpermission, ]
        # 用户类型99 拥有修改订单状态的所用权限
        # 订单状态选择
        # status_choices = (
        # (1, '待付款'),
        # (2, '已付款'),
        # (3, '拿货中'),
        # (4, '已拿货'),
        # (5, '已发货'),
        # (6, '已退款'),
        # (7, '明日有货'),
        # )
        # status_choices = mcommon.status_choices

        def post(self, request, *args, **kwargs):
            ret = {"code": "1000", "message": ""}
            acp_status = [mcommon.status_choices2.get("待付款"),
                          mcommon.status_choices2.get("已付款"),
                          mcommon.status_choices2.get("拿货中"),
                          mcommon.status_choices2.get("已拿货"),
                          mcommon.status_choices2.get("已发货"),
                          mcommon.status_choices2.get("已退款"),
                          mcommon.status_choices2.get("明日有货"),
                          mcommon.status_choices2.get("其他状态"),
                          ]
            data = self.request.data
            if data['status'] not in acp_status:
                ret['code'] = "1001"
                ret['message'] = "status错误"
                return Response(ret)

            query = trade_models.OrderGoods.objects.filter(id=data['order_goods_id'])
            if query.count() == 1:
                query.update(status=data['status'])
                ret['code'] = "1000"
                ret['message'] = "更新成功"
                return Response(ret)
            else:
                ret['code'] = "1001"
                ret['message'] = "数据错误"
                return Response(ret)


class OrderPagination(PageNumberPagination):
    # 指定每一页的个数
    page_size = 10
    # 可以让前端来设置page_szie参数来指定每页个数
    page_size_query_param = 'page_size'
    # 设置页码的参数
    page_query_param = 'page'


class OrderViewSet(mixins.ListModelMixin,mixins.UpdateModelMixin, GenericViewSet):
        authentication_classes = [BackStageAuthentication, ]
        permission_classes = [permission.Superpermission,]
        serializer_class = m_serializers.TradeOrderQuerySerializer
        # 设置分页的class
        pagination_class = OrderPagination

        def list(self, request, *args, **kwargs):
            ret = {"code": 1000, "message": ""}
            try:
                queryset = self.filter_queryset(self.get_queryset())
                page = self.paginate_queryset(queryset)
                if page is not None:
                    serializer = self.get_serializer(page, many=True)
                    return self.get_paginated_response(serializer.data)
                serializer = self.get_serializer(queryset, many=True)
                return Response(serializer.data)
            except:
                traceback.print_exc()
                ret = {"code": "1001", "message": "获取订单失败"}
                logger.info('%s url:%s method:%s' % (traceback.format_exc(), request.path, request.method))
                return Response(ret)

        def get_queryset(self):
            print(self.request.query_params)
            query_keys = self.request.query_params.get("q")
            status_filter = self.request.query_params.get("status")
            print("query_keys")
            print(query_keys)
            if query_keys is not None:
                args = Q(order_number=query_keys) | Q(consignee_name=query_keys) | Q(logistics_number=query_keys)
                # 手机字段为数字 用字符查询会报错
                if query_keys.isdigit():
                    args = args | Q(consignee_phone=query_keys)
                return trade_models.Order.objects.filter(args).order_by('add_time')
            elif status_filter is not None:
                return trade_models.Order.objects.filter(orderGoods__status=status_filter).distinct().order_by( "-add_time")

            else:
                return trade_models.Order.objects.all().order_by('-add_time')

        def update(self, request, *args, **kwargs):
            ret = {"code": "1000", "message": ""}
            try:
                order_id = kwargs.get("pk")
                partial = True
                instance = trade_models.Order.objects.filter(id=order_id).first()
                print(instance)
                serializer = self.get_serializer(instance, data=request.data, partial=partial)
                serializer.is_valid(raise_exception=True)
                self.perform_update(serializer)
            except:
                print(serializer.error)
                print(traceback.print_exc())
                ret = {"code": "1001", "message": "更改失败"}
                logger.info('%s url:%s method:%s' % (traceback.format_exc(), request.path, request.method))
                return Response(ret)

            # if getattr(instance, '_prefetched_objects_cache', None):
            #     # If 'prefetch_related' has been applied to a queryset, we need to
            #     # forcibly invalidate the prefetch cache on the instance.
            #     instance._prefetched_objects_cache = {}
            ret['code'] = "1000"
            ret['message'] = "更新成功"
            ret['data'] = serializer.data
            return Response(ret)

        def get_serializer_class(self):
            if self.action == "retrieve":
                return m_serializers.TradeOrderQuerySerializer
            elif self.action == "create":
                return m_serializers.TradeOrderQuerySerializer
            elif self.action == "update":
                return m_serializers.TradeOrderQuerySerializer
            elif self.action == "delete":
                return m_serializers.TradeOrderQuerySerializer

            return m_serializers.TradeOrderQuerySerializer

        def get_object(self):
            return self.request.user


class OrderGoodsRefundViewSet(mixins.ListModelMixin, mixins.DestroyModelMixin, GenericViewSet):
    class RefundApplyQuerySerializer(serializers.ModelSerializer):
        class Meta:
            model = trade_models.RefundApply
            fields = "__all__"
            depth = 2
    authentication_classes = [BackStageAuthentication, ]
    permission_classes = [permission.Superpermission, ]
    serializer_class = RefundApplyQuerySerializer
    # 设置分页的class
    pagination_class = OrderPagination

    def list(self, request, *args, **kwargs):
        self.serializer_class = m_serializers.TradeOrderQuerySerializer

        ret = {"code": "1000", "message": ""}
        try:
            queryset = self.filter_queryset(self.get_queryset())
            page = self.paginate_queryset(queryset)
            if page is not None:
                serializer = self.get_serializer(page, many=True)
                return self.get_paginated_response(serializer.data)
            serializer = self.get_serializer(queryset, many=True)
            return Response(serializer.data)
        except:
            traceback.print_exc()
            ret = {"code": "1001", "message": "查询失败"}
        return Response(ret)

    def destroy(self, request, *args, **kwargs):
        print("destroy")
        print(kwargs.get("pk"))
        try:
            ret = {"code": "1000", "message": ""}
            refund_apply_id = kwargs.get("pk")
            refund_apply_obj = trade_models.RefundApply.objects.filter(id=refund_apply_id).first()
            print(refund_apply_obj)
            if refund_apply_obj.refund_apply_type == mcommon.refund_apply_choices2.get("仅退款"):
                with transaction.atomic():
                    trade_models.OrderGoods.objects.filter(id=refund_apply_obj.orderGoods_id)\
                                            .update(status=mcommon.status_choices2.get("已退款"), refund_apply_status=mcommon.refund_apply_choices2.get("无售后"))
                    trade_models.RefundApply.objects.filter(id=refund_apply_id).delete()

            elif refund_apply_obj.refund_apply_type == mcommon.refund_apply_choices2.get("退货退款"):
                with transaction.atomic():
                    logistics_name = refund_apply_obj.return_logistics_name
                    logistics_num = refund_apply_obj.return_logistics_number
                    order_goods = trade_models.OrderGoods.objects.filter(id=refund_apply_obj.orderGoods_id).first()
                    order_goods.status = mcommon.status_choices2.get("已退款")
                    # order_goods.refund_apply_status = mcommon.refund_apply_choices2.get("无售后")
                    order_goods.return_logistics_name = logistics_name
                    order_goods.return_logistics_number = logistics_num
                    order_goods.save()
                    order_owner = order_goods.order.order_owner
                    # 申请退货数量不能大于下单的数量
                    if refund_apply_obj.goods_counts > order_goods.goods_count:
                        raise Exception
                    trade_moneys = order_goods.goods_price * refund_apply_obj.goods_counts
                    self.log_user_pay_info(order_goods,order_goods.order,trade_moneys)
                    order_owner.balance = order_owner.balance + trade_moneys
                    order_owner.save()
                    refund_apply_obj.delete()
            elif refund_apply_obj.refund_apply_type == mcommon.refund_apply_choices2.get("拦截发货"):
                with transaction.atomic():
                    logistics_name = refund_apply_obj.return_logistics_name
                    logistics_num = refund_apply_obj.return_logistics_number
                    order_goods = trade_models.OrderGoods.objects.filter(id=refund_apply_obj.orderGoods_id).first()
                    order_goods.status = mcommon.status_choices2.get("已退款")
                    # order_goods.refund_apply_status = mcommon.refund_apply_choices2.get("无售后")
                    order_goods.return_logistics_name = logistics_name
                    order_goods.return_logistics_number = logistics_num
                    order_goods.save()
                    order_owner = order_goods.order.order_owner
                    # 申请退货数量不能大于下单的数量
                    if refund_apply_obj.goods_counts > order_goods.goods_count:
                        raise Exception
                    trade_moneys = order_goods.goods_price * refund_apply_obj.goods_counts
                    self.log_user_pay_info(order_goods,order_goods.order,trade_moneys)
                    order_owner.balance = order_owner.balance + trade_moneys
                    order_owner.save()
                    refund_apply_obj.delete()

        except:
            print(traceback.print_exc())
            ret['code'] = "1001"
            ret['message'] = "更改失败"
        return Response(ret)


    def log_user_pay_info(self,order_goods,order,trade_moneys):
        order_owner_balance = order.order_owner.balance + trade_moneys
        message = "商品退货退款" + " 订单编号："+order.order_number +" 商品编号："+order_goods.goods_number
        trade_models.TradeInfo.objects.create(user = order.order_owner,
                                              trade_number=trade_utils.get_trade_number(self.request.user),
                                              user_balance=order_owner_balance,
                                              trade_source=mcommon.trade_source_choices2.get("商品"),
                                              message=message,
                                              cash_in_out_type=mcommon.cash_in_out_type_choices2.get("收入"),
                                              trade_money=trade_moneys,
                                              is_pass=True,
                                              add_time=time.time()*1000)

    def get_queryset(self,):
        return trade_models.Order.objects.filter(Q(orderGoods__refund_apply_status=mcommon.refund_apply_choices2.get("退货退款")) |
                                                 Q(orderGoods__refund_apply_status=mcommon.refund_apply_choices2.get("仅退款")) |
                                                 Q(orderGoods__refund_apply_status=mcommon.refund_apply_choices2.get("换货")) |
                                                 Q(orderGoods__refund_apply_status=mcommon.refund_apply_choices2.get("拦截发货")) |
                                                 Q(orderGoods__refund_apply_status=mcommon.refund_apply_choices2.get("取消订单"))
                                                 ).distinct().order_by('-add_time')

