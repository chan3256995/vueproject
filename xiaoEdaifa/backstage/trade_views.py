
from rest_framework.views import APIView
from django.http.response import JsonResponse
from django.http import HttpResponse
from trade import models as trade_models
from trade import trade_utils
from user import models as user_models
from django.db.models import Q
from utils.auth import BackStageAuthentication,BackStageNahuoAuthentication
from utils.permission import Superpermission,NahuoUserpermission
from backstage import back_utils
from xiaoEdaifa import settings
from utils import mfile_utils
from utils import mcommon
from utils import mtime
from rest_framework.response import Response
import traceback
from rest_framework.pagination import PageNumberPagination
from rest_framework import mixins
from django.db import transaction
from rest_framework.viewsets import GenericViewSet
from utils import m_serializers
from utils import mIP_utils
import time
import datetime
import threading
import logging
import json
import requests
logger = logging.getLogger('stu')


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
    #
    # 设置分页的class
    pagination_class = UsersPagination
    authentication_classes = [BackStageAuthentication]
    permission_classes = [Superpermission]

    def list(self, request, *args, **kwargs):
        try:
            ret = {'code': "1000", 'message': ""}
            check_status = request.query_params.get('check_status')
            trade_number = request.query_params.get('trade_number')
            user_name = request.query_params.get('user_name')
            mul_args_and = request.query_params.get('args_and')
            mul_args_or = request.query_params.get('args_or')
            # queryset = self.filter_queryset(self.get_queryset())
            if check_status is not None:
                queryset = trade_models.TradeInfo.objects.filter(is_pass=check_status).order_by("-add_time")
            elif trade_number is not None :
                queryset = trade_models.TradeInfo.objects.filter(trade_number=trade_number).order_by("-add_time")
            elif user_name is not None :
                queryset = trade_models.TradeInfo.objects.filter(user__user_name=user_name).order_by("-add_time")
            elif mul_args_and is not None :


                args_and = json.loads(mul_args_and)
                user_name = args_and.get('user_name')
                trade_source = args_and.get('trade_source')
                cash_in_out_type = args_and.get('cash_in_out_type')
                args = Q()
                if user_name !='':
                    args =args & Q(user__user_name=user_name)
                if trade_source != '':
                    args = args & Q(trade_source=trade_source)
                if cash_in_out_type != '':
                    args = args & Q(cash_in_out_type=cash_in_out_type)
                is_pass = args_and.get('is_pass')
                if is_pass != '':
                    args = args & Q(is_pass = is_pass)


                print("args:")
                print(args)
                queryset = trade_models.TradeInfo.objects.filter(args).order_by("-add_time")
            else:
                queryset = trade_models.TradeInfo.objects.filter().order_by("-add_time")

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


#
class TimeSwitchView(APIView):
    authentication_classes = [BackStageAuthentication]
    permission_classes = [Superpermission]

    def post(self, request, *args, **kwargs):
        print("tag print''''''''''''''")
        print(request.data)
        try:
            ret = {'code': "1000", 'message': ""}
            file_path = settings.BASE_DIR + "/backstage/msettings.txt"
            mfile_utils.create_file(file_path)
            req_switch = request.data.get('switch')
            file = open(file_path)
            content = file.read()
            file.close()

            if content != "":
                sett = content.split('=')
                sett_is_running = sett[3]
                if req_switch == 'ON':
                    if sett_is_running == "False":
                        # start running
                        content = "TIMER_SWITCH_ON=ON=IS_RUNNIG=False"
                        file = open(file_path,'w')
                        file.write(content)
                        file.close()
                        self.start_run_thread()
                elif req_switch == 'OFF':
                    content = "TIMER_SWITCH_ON=OFF=IS_RUNNIG=" + sett_is_running
                    file = open(file_path, 'w')
                    file.write(content)
                    file.close()

        except:
            traceback.print_exc()
            ret['code'] = "1001"
            ret['message'] = "查询异常"
            logger.info('%s url:%s method:%s' % (traceback.format_exc(), request.path, request.method))
            return JsonResponse(ret)
        return JsonResponse(ret)

    def start_run_thread(self):
        print("haha")
        file_path = settings.BASE_DIR + "/backstage/msettings.txt"
        file = open(file_path)
        content = file.read()
        file.close()
        sett = content.split('=')
        sett_switch_on = sett[1]

        if sett_switch_on == 'OFF':
            file = open(file_path,'w')
            content = "TIMER_SWITCH_ON=OFF=IS_RUNNIG=False"
            file.write(content)
            file.close()
        elif sett_switch_on == 'ON':# 为 True 说要进行任务
            file = open(file_path,'w')
            content = "TIMER_SWITCH_ON=ON=IS_RUNNIG=True"
            file.write(content)
            file.close()
            # do someting
            mcommon.send_email(subject="闹钟测试", sender=settings.EMAIL_FROM, message="测试",
                               html_message='hello word 3',
                               receiver=['80131490@qq.com'])
            duration_time = mtime.get_duration("03:00:00")

            timer = threading.Timer(duration_time,  self.start_run_thread)
            timer.start()

from rest_framework.renderers import JSONRenderer


class GBKJSONRenderer(JSONRenderer):
    charset = 'GBK'


class Temp(APIView):
    authentication_classes = []
    renderer_classes = [GBKJSONRenderer, ]

    def post(self, request, *args, **kwargs):
        try:
            print("tag print''''''''''''''")
            print(request.data)
            # req_data = json.loads(request.data.get("utf_str"))
            req_data = request.data.get("utf_str").encode("gbk")
            tb_cookies = json.loads(request.data.get("cookies"))
            cookies_str = ""
            from requests.cookies import RequestsCookieJar
            jar = RequestsCookieJar()
            ret = {'code': "1000", 'message': ""}
            # for key, value in req_data.items():
            #     req_data[key] = str(value).encode("gbk")
            for key, value in tb_cookies.items():
                cookies_str = cookies_str+key+"="+value+";"
                jar.set(key, value)

            header = {
                # cookie 这里就不贴出来了 ![(☆_☆)/~~]
                #  "Cookie": "JSESSIONID=3A2EFB775241DD7BFACA1E75D99624AF-n1",
                # 'content-type': 'charset=gbk',
                'Content-Type': 'application/x-www-form-urlencoded',

                'origin': 'https://wuliu.taobao.com',
                'referer': 'https://wuliu.taobao.com/user/order_list_new.htm?order_status_show=send&mytmenu=fh',
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.169 Safari/537.36",

            }
            response = requests.post('https://wuliu.taobao.com/user/batch_consign.htm', data=req_data, cookies=jar,headers=header)
            if response.text.find("扫码登录更安全")!=-1:
                ret['message'] = "cookie 无效"
            print("")
            return Response(ret)
        except:
            traceback.print_exc()
            ret['code'] = "1001"
            ret['message'] = "查询异常"
            logger.info('%s url:%s method:%s' % (traceback.format_exc(), request.path, request.method))
        return Response(ret)
        # return JsonResponse(ret)


class AppClient(APIView):
    authentication_classes = []
    permission_classes = []
    def get(self,request, *args, **kwargs):
        try:
            ret = {'code': "1000", 'message': ""}
            print("tag print''''''''''''''")
            print(request.data)

            return Response(ret)
        except:
            traceback.print_exc()
            ret['code'] = "1001"
            ret['message'] = "查询异常"
            logger.info('%s url:%s method:%s' % (traceback.format_exc(), request.path, request.method))
        return Response(ret)

    def post(self, request, *args, **kwargs):
        try:
            ret = {'code': "1000", 'message': ""}
            print("tag print''''''''''''''")
            print(request.data)

            return Response(ret)
        except:
            traceback.print_exc()
            ret['code'] = "1001"
            ret['message'] = "查询异常"
            logger.info('%s url:%s method:%s' % (traceback.format_exc(), request.path, request.method))
        return Response(ret)
        # return JsonResponse(ret)


class AddOrderToChuanMeiView(APIView):
    authentication_classes = []
    renderer_classes = [GBKJSONRenderer, ]

    def post(self, request, *args, **kwargs):
        try:
            ret = {'code': "1000", 'message': ""}
            # requests.post('http://httpbin.org/post', data={'hee': 'llo'})
            header = {
                # cookie 这里就不贴出来了 ![(☆_☆)/~~]
                "Cookie": "JSESSIONID=3A2EFB775241DD7BFACA1E75D99624AF-n1",
                # 'content-type': 'charset=gbk',
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.169 Safari/537.36"
            }

            data = {
                'receiverName': '侯立铁' ,
                'buyerNick': '王者荣耀乖' ,
                'receiver_state': '陕西省' ,
                'receiver_city': '西安市' ,
                'receiver_district': '雁塔区' ,
                'receiver_address': '电子城街道太白南路191号1栋2707室' ,
                'receiver_phone': '',
                'receiver_mobile': 15514388713,
                'receiver_zip': 450000,
                'expTempId': 1580533562274,
                'seller_memo': '',
                'expOrderId': '',
                'orders': '{"orders":[{"title":"简易仰卧起坐女辅助器宿舍床上家用固定脚压脚器做健身器材学生男","outid":"","skuname":"颜色分类:[黑色]加长款","num":1,"price":49.2,"discountfee":0,"payment":25.51,"outerskuid":"","outeriid":"Y1001","weight":0.01}]}',
                'sendInfoContactName': '陈清龙',
                'sendInfoMobilePhone': 17087987015,
                'sendInfoProvince': '广东省' ,
                'sendInfoCity': '梅州市' ,
                'sendInfoCountry': '兴宁市' ,
                'sendCompany': '青火龙健身' ,
                'sendInfoAddr': '鸿达花园 兴鸿一街（金河湾车库入口对面）。'
            }
            for key, value in data.items():
                data[key] = str(value).encode("gbk")



            response = requests.post('https://tb1.chuanmeidayin.com/cmdy/operation/offline?method=save',data = data ,headers = header)
            print(response)
            ret['code'] = "1000"


        except:
            traceback.print_exc()
            ret['code'] = "1001"
            ret['message'] = "查询异常"
            logger.info('%s url:%s method:%s' % (traceback.format_exc(), request.path, request.method))
            return Response(ret)
        return Response(ret)


class AddReturnPackages(APIView):

    authentication_classes = [BackStageAuthentication, BackStageNahuoAuthentication]
    permission_classes = [NahuoUserpermission]

    def post(self, request, *args, **kwargs):
        try:
            with transaction.atomic():
                ret = {'code': "1000", 'message': ""}
                logistics_number_list = request.data.get("logistics_number_list")
                new_logistics_number_list = []
                exits_logistics_number_list = []
                query_set = trade_models.ReturnPackageInfo.objects.filter(return_logistics_number__in=logistics_number_list)
                for returnPackage in query_set:
                    exits_logistics_number_list.append(returnPackage.return_logistics_number)
                for logistics_number in logistics_number_list:
                    if logistics_number not in exits_logistics_number_list:
                        new_logistics_number_list.append(logistics_number)
                for new_logistics_number in new_logistics_number_list:
                    obj = trade_models.ReturnPackageInfo.objects.create(return_logistics_number=new_logistics_number,add_time=time.time()*1000)
                    if obj is not None:
                        refund_apply = trade_models.RefundApply.objects.select_for_update().filter(return_logistics_number=new_logistics_number).first()
                        if refund_apply is not None and refund_apply.refund_apply_progress == mcommon.refund_apply_progress_choices2['未处理']:
                            refund_apply.refund_apply_progress = mcommon.refund_apply_progress_choices2['仓库已收到退件']
                            refund_apply.save()
                ret['exits_list'] = exits_logistics_number_list
        except:
            traceback.print_exc()
            ret['code'] = "1001"
            ret['message'] = "查询异常"
            logger.info('%s url:%s method:%s' % (traceback.format_exc(), request.path, request.method))
            return Response(ret)
        return Response(ret)


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


# # 明日有货 重新修改为 付款状态
class TomorrowStatusResetView(APIView):
    authentication_classes = [BackStageAuthentication, ]
    permission_classes = [Superpermission]

    def post(self, request, *args, **kwargs):
        print("tag print''''''''''''''")
        print(request.data)
        try:
            with transaction.atomic():
                ret = {'code': "1000", 'message': ""}
                back_utils.change_tomorrow_status()

        except:
            traceback.print_exc()
            ret['code'] = "1001"
            ret['message'] = "查询异常"
            logger.info('%s url:%s method:%s' % (traceback.format_exc(), request.path, request.method))
            return JsonResponse(ret)
        return JsonResponse(ret)


# 修改拿货中状态商品 统一用这个接口（如 拿货中状态 改为 明日有货  2-5天有货 已拿货  其他）
class ChangePurchasingStatus(APIView):
    authentication_classes = [BackStageAuthentication, BackStageNahuoAuthentication]
    permission_classes = [NahuoUserpermission]

    def post(self, request, *args, **kwargs):
        # {'order_list': [{'order_number': 'os20191007141753133698', 'orderGoods': [{'goods_number': 'gs20191007141753153630', 'goods_count': 1}]}]}
        print(" ChangePurchasingStatus''''''''''''''")
        print(request.data)
        try:
            with transaction.atomic():
                ret = {'code': "1000", 'message': ""}
                req_status_type =  request.data.get("status_type")

                req_order_list = request.data.get("order_list")
                req_order_number_list = []
                # 异常状态订单
                exception_order_list = []
                for req_order_object in req_order_list:
                    req_order_number_list.append(req_order_object.get("order_number"))
                order_queryset = trade_models.Order.objects.filter(Q(order_number__in = req_order_number_list)).distinct()
                for sql_order in order_queryset:
                    # 订单里有一个商品状态该为已拿货 就更新时间
                    is_update_time = False
                    tem_exceptions_order_goods = []
                    sql_order_goods_query = trade_models.OrderGoods.objects.filter(order = sql_order)
                    req_order = self.find_order(sql_order.order_number,req_order_list)
                    for sql_order_goods in sql_order_goods_query:
                        # 请求列表找商品
                        req_goods = self.find_goods(sql_order_goods.goods_number, req_order.get("orderGoods"))
                        # 提交上来的数据没有该商品
                        if req_goods == "":
                            continue
                        if sql_order_goods.refund_apply_status != mcommon.refund_apply_choices2.get("无售后"):
                            tem_exceptions_order_goods.append(sql_order_goods.goods_number)
                            continue

                        if (req_status_type == mcommon.status_choices2.get("明日有货") or req_status_type == mcommon.status_choices2.get( "2-5天有货") or req_status_type == mcommon.status_choices2.get( "已下架") or req_status_type == mcommon.status_choices2.get("已拿货")) and sql_order_goods.refund_apply_status == mcommon.refund_apply_choices2.get("无售后"):
                             if sql_order_goods.status == mcommon.status_choices2.get("拿货中") or sql_order_goods.status == mcommon.status_choices2.get("明日有货") or sql_order_goods.status == mcommon.status_choices2.get( "2-5天有货") or sql_order_goods.status == mcommon.status_choices2.get( "已下架") or sql_order_goods.status == mcommon.status_choices2.get("已拿货") or sql_order_goods.status == mcommon.status_choices2.get("其他"):
                                sql_order_goods.status = req_status_type
                                sql_order_goods.log = ""
                                sql_order_goods.save()
                             else:
                                tem_exceptions_order_goods.append(sql_order_goods.goods_number)

                        elif req_status_type == mcommon.status_choices2.get("其他") and req_goods !="" and sql_order_goods.refund_apply_status == mcommon.refund_apply_choices2.get("无售后"):
                            if sql_order_goods.status == mcommon.status_choices2.get(
                                    "拿货中") or sql_order_goods.status == mcommon.status_choices2.get(
                                    "明日有货") or sql_order_goods.status == mcommon.status_choices2.get(
                                    "2-5天有货") or sql_order_goods.status == mcommon.status_choices2.get(
                                    "已下架") or sql_order_goods.status == mcommon.status_choices2.get(
                                    "已拿货"):
                                sql_order_goods.status = req_status_type
                                sql_order_goods.log = req_goods.get("message")
                                sql_order_goods.save()
                            else:
                                tem_exceptions_order_goods.append(sql_order_goods.goods_number)

                        else:
                            tem_exceptions_order_goods.append(sql_order_goods.goods_number)
                        if req_status_type == req_status_type == mcommon.status_choices2.get("已拿货"):
                            is_update_time = True

                    if is_update_time:
                        sql_order.update_time = time.time() * 1000
                        sql_order.save()
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



# 明日有货
class TomorrowGoodsView(APIView):
    authentication_classes = [BackStageAuthentication, BackStageNahuoAuthentication]

    def post(self, request, *args, **kwargs):
        # {'tomorrow_order_list': [{'order_number': 'os20191007141753133698', 'orderGoods': [{'goods_number': 'gs20191007141753153630', 'goods_count': 1}]}]}
        print(" TomorrowGoodsView''''''''''''''")
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
                                and sql_order_goods.refund_apply_status != mcommon.refund_apply_choices2.get("无售后"):
                            # 状态正常  者有售后申请
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
    authentication_classes = [BackStageAuthentication,BackStageNahuoAuthentication ]
    permission_classes = [NahuoUserpermission]

    def post(self, request, *args, **kwargs):

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
                        elif (sql_order_goods.status == mcommon.status_choices2.get("快递打印") or sql_order_goods.status == mcommon.status_choices2.get("已拿货")) and sql_order_goods.refund_apply_status == mcommon.refund_apply_choices2.get("无售后"):
                            tem_nomal_order_goods.append(sql_order_goods)
                        else:
                            # 商品状态已经改变了 比如改为拦截发货  并且 客户端提交了该商品
                            # 有异常状态商品 该订单都不能发货
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
                        sql_order.is_delivered = True
                        sql_order.order_status = mcommon.order_status_choices2.get('已发货')
                        sql_order.update_time = time.time() * 1000
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


# 空包 发货
class DeliverNullOrderView(APIView):
    authentication_classes = [BackStageAuthentication,BackStageNahuoAuthentication ]
    permission_classes = [NahuoUserpermission]

    def post(self, request, *args, **kwargs):

        print(request.data)
        try:
            with transaction.atomic():
                ip = mIP_utils.get_windows_local_ip()
                ret = {'code': "1000", 'message': ""}
                req_order_list = json.loads(request.data.get("deliver_order_list"))
                req_order_id_list = []
                # 异常状态订单
                exception_order_list = []
                for req_order_object in req_order_list:
                    req_id = req_order_object.get("id")
                    if req_id is not None and req_id != "":
                        if ip.find('172.17.1.38') != -1:
                            if req_id.startswith("r") is False:
                                ret['code'] = "1001"
                                ret['message'] = "数据异常"
                                return JsonResponse(ret)
                            else:
                                req_id = req_id.replace('r', '')
                                req_order_id_list.append(req_id)

                order_queryset = trade_models.NullPackageOrder.objects.select_for_update().filter(Q(id__in=req_order_id_list)).distinct()
                for sql_order in order_queryset:
                    req_order = self.find_order(sql_order.id, req_order_list)
                    logistic_name = req_order.get("logistics_name")
                    req_order_logistic_name = back_utils.back_null_package_logistic_choices[logistic_name]
                    if req_order_logistic_name is None:
                        req_order["message"] = "物流名称异常"
                        exception_order_list.append(req_order)
                        continue

                    req_order_logistic_number = req_order.get("logistics_number")
                    if (sql_order.order_status != mcommon.null_package_order_status_choices2.get('已付款') and sql_order.order_status !=  mcommon.null_package_order_status_choices2.get('快递打印')) or  req_order_logistic_name == "" or req_order_logistic_number == "" :
                        req_order["message"] = "状态异常"
                        exception_order_list.append(req_order)
                    else:
                        sql_order.logistics_number = req_order_logistic_number
                        sql_order.logistics_name = req_order_logistic_name
                        sql_order.order_status = mcommon.null_package_order_status_choices2.get('已发货')
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

    def find_order(self,id,req_order_list):
        for req_order in req_order_list:
            if str(id) == req_order.get("id"):
                return req_order
        return ""


# 这个接口只为315物流来源发货
class DeliverFrom315View(APIView):
    authentication_classes = [BackStageAuthentication,BackStageNahuoAuthentication ]
    permission_classes = [NahuoUserpermission]

    def post(self, request, *args, **kwargs):
        print("tag print''''''''''''''")
        print(request.data)
        try:
            ip = mIP_utils.get_windows_local_ip()
            with transaction.atomic():
                ret = {'code': "1000", 'message': ""}
                req_order_list = request.data.get("deliver_order_list")
                req_order_id_list = []
                # 异常状态订单
                exception_order_list = []
                for i in range(0,len(req_order_list)):
                    order_number = req_order_list[i].get("order_number")
                    if ip.find('172.17.1.38') != -1:
                        if order_number.startswith("r") is False:
                            ret['code'] = "1001"
                            ret['message'] = "数据异常"
                            return JsonResponse(ret)
                        else:
                            order_number = order_number.replace('r', '')
                            req_order_list[i]['order_number'] = order_number

                    req_order_id_list.append(order_number)

                order_queryset = trade_models.Order.objects.filter(Q(id__in=req_order_id_list)).distinct()
                for sql_order in order_queryset:
                    tem_exceptions_order_goods = []
                    tem_nomal_order_goods = []
                    sql_order_goods_query = trade_models.OrderGoods.objects.filter(order=sql_order)
                    for sql_order_goods in sql_order_goods_query:

                        if sql_order_goods.status == mcommon.status_choices2.get("已退款") :
                            pass
                        elif (sql_order_goods.status == mcommon.status_choices2.get("快递打印") or
                              sql_order_goods.status == mcommon.status_choices2.get("已拿货") or
                              sql_order_goods.status == mcommon.status_choices2.get("拿货中") ) and sql_order_goods.refund_apply_status == mcommon.refund_apply_choices2.get("无售后"):
                            tem_nomal_order_goods.append(sql_order_goods)
                        else:
                            # 商品状态已经改变了 比如改为拦截发货  并且 客户端提交了该商品
                            # 有异常状态商品 该订单都不能发货
                            tem_exceptions_order_goods.append(sql_order_goods.goods_number)
                            break
                    req_order = self.find_order(sql_order.id, req_order_list)
                    req_order_logistic_name = req_order.get("logistics_name")
                    req_order_logistic_number = req_order.get("logistics_number")
                    if len(tem_exceptions_order_goods) != 0 or req_order_logistic_name == "" or req_order_logistic_number == "" :
                        exception_order_list.append(
                            {"order_number": sql_order.id, 'orderGoods': tem_exceptions_order_goods})
                    else:
                        for nomal_order_goods in tem_nomal_order_goods:
                            nomal_order_goods.status = mcommon.status_choices2.get("已发货")
                            nomal_order_goods.save()
                        sql_order.logistics_number = req_order_logistic_number
                        sql_order.logistics_name = req_order_logistic_name
                        sql_order.is_delivered = True
                        sql_order.update_time = time.time() * 1000
                        sql_order.order_status = mcommon.order_status_choices2.get('已发货')
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
            if str(order_number) == str(req_order.get("order_number")):
                return req_order
        return ""


# 这个接口只为bl物流来源发货
class DeliverFromBLView(APIView):
    authentication_classes = [BackStageAuthentication,BackStageNahuoAuthentication ]
    permission_classes = [NahuoUserpermission]

    def post(self, request, *args, **kwargs):
        print("tag print''''''''''''''")
        print(request.data)
        try:
            ip = mIP_utils.get_windows_local_ip()
            with transaction.atomic():
                ret = {'code': "1000", 'message': ""}
                req_order_list = json.loads(request.data.get("deliver_order_list"))
                req_order_order_number_list = []
                # 异常状态订单
                exception_order_list = []
                for i in range(0,len(req_order_list)):
                    order_number = req_order_list[i].get("order_number")
                    if ip.find('172.17.1.38') != -1:
                        if order_number.startswith("r") is False:
                            ret['code'] = "1001"
                            ret['message'] = "数据异常"
                            return JsonResponse(ret)
                        else:
                            order_number = order_number.replace('r', '')
                            req_order_list[i]['order_number'] = order_number
                    req_order_order_number_list.append(order_number)
                ret['query_order_numbe_list'] = req_order_order_number_list
                order_queryset = trade_models.Order.objects.select_for_update().filter(Q(order_number__in=req_order_order_number_list)).distinct()
                for sql_order in order_queryset:
                    tem_exceptions_order_goods = []
                    tem_nomal_order_goods = []
                    sql_order_goods_query = trade_models.OrderGoods.objects.filter(order=sql_order)
                    for sql_order_goods in sql_order_goods_query:

                        if sql_order_goods.status == mcommon.status_choices2.get("已退款") :
                            pass
                        elif (sql_order_goods.status == mcommon.status_choices2.get("快递打印") or
                              sql_order_goods.status == mcommon.status_choices2.get("已拿货") or
                              sql_order_goods.status == mcommon.status_choices2.get("拿货中") ) and sql_order_goods.refund_apply_status == mcommon.refund_apply_choices2.get("无售后"):
                            tem_nomal_order_goods.append(sql_order_goods)
                        else:
                            # 商品状态已经改变了 比如改为拦截发货  并且 客户端提交了该商品
                            # 有异常状态商品 该订单都不能发货
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
                        sql_order.is_delivered = True
                        sql_order.update_time = time.time() * 1000
                        sql_order.order_status = mcommon.order_status_choices2.get('已发货')
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
            if str(order_number) == str(req_order.get("order_number")):
                return req_order
        return ""


# 打印物流单
class LogisticsPrintView(APIView):
    authentication_classes = [BackStageAuthentication,BackStageNahuoAuthentication ]
    permission_classes = [NahuoUserpermission]

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
                    # 异常商品
                    tem_exceptions_order_goods = []
                    # 正常商品
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
                        sql_order.order_status = mcommon.order_status_choices2.get('快递打印')
                        sql_order.save()
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
                    # 订单里有一个商品状态该为已拿货 就更新时间
                    is_update_time = False
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
                            is_update_time = True
                            sql_order_goods.save()
                            pass
                    if is_update_time:
                        sql_order.update_time = time.time() * 1000
                        sql_order.save()
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
    authentication_classes = [BackStageAuthentication, BackStageNahuoAuthentication]
    # permission_classes = [Superpermission,NahuoUserpermission]

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
                        if order_goods.status != mcommon.status_choices2.get("标签打印") and order_goods.status != mcommon.status_choices2.get("已付款"):
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
    authentication_classes = [BackStageAuthentication,BackStageNahuoAuthentication ]
    permission_classes = [NahuoUserpermission]

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
                    # 订单跟进人
                    order.order_follower = request.user
                    order.save()

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


class AddDiscountCardView(APIView):
    authentication_classes = [BackStageAuthentication, ]
    permission_classes = [Superpermission, ]

    def post(self, request, *args, **kwargs):
        try:
            ret = {'code': "1000", 'message': ""}
            req_discount_card_info = request.data.get("discount_card_info")
            req_user_name  =req_discount_card_info.get("user_name")
            discount_card_type  =req_discount_card_info.get("discount_card_type")
            # 折扣率 或 折扣面额
            discount = req_discount_card_info.get("discount")
            expire_time =req_discount_card_info.get("expire_time")
            add_time = time.time() * 1000

            sql_user = user_models.User.objects.filter(user_name = req_user_name).first()
            if sql_user is None:
                ret['code'] = "1001"
                ret['message'] = "用户名不存在"
            else:
                save_data = {
                    "user":sql_user,
                    "discount_card_type":discount_card_type,
                    "discount":discount,
                    "expire_time":expire_time,
                    "add_time":add_time,

                }
                if trade_utils.add_discount_card_to_sql(save_data):
                    ret['code'] = "1000"
                    ret['message'] = "添加成功"
                else:
                    ret['code'] = "1001"
                    ret['message'] = "添加失败"


        except:
            traceback.print_exc()
            ret['code'] = "1001"
            ret['message'] = "添加异常"
            logger.info('%s url:%s method:%s' % (traceback.format_exc(), request.path, request.method))
        return JsonResponse(ret)


# 充值审核通过
class RechargePassView(APIView):
    # authentication_classes = []
    # permission_classes = []
    authentication_classes = [BackStageAuthentication, ]
    permission_classes = [Superpermission, ]

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


# 支付宝认证审核通过
class UserAlipayAccountCheckPassView(APIView):

    authentication_classes = [BackStageAuthentication, ]
    permission_classes = [Superpermission, ]

    def post(self, request, *args, **kwargs):
        ret = {'code': "1000", 'message': ""}
        try:
            with transaction.atomic():
                req_ali_info_id = request.data.get("user_ali_info_id")
                sql_ali_info_obj = user_models.UserAlipayRealInfo.objects.filter(id = req_ali_info_id).first()
                if sql_ali_info_obj is not None:
                    sql_ali_info_obj.check_status = mcommon.common_check_status_choices2['审核通过']
                    sql_ali_info_obj.check_time = time.time() * 1000
                    sql_ali_info_obj.save()
                    # 送一张 一星期的折扣卡
                    save_data = {
                        "user": sql_ali_info_obj.user,
                        "discount_card_type": mcommon.discount_card_type_choices2['物流金额优惠卡'],
                        "discount": 0.5,
                        "expire_time": time.time() * 1000 + 10 * 24 * 60 * 60 * 1000,
                        "add_time": time.time() * 1000,

                    }
                    trade_utils.add_discount_card_to_sql(save_data)
                    # 阿里支付宝认证通过  找出当前用户的被邀请注册信息
                    invite_reg_info = user_models.InviteRegisterInfo.objects.filter( be_inviter=sql_ali_info_obj.user).first()
                    if invite_reg_info is not None:
                        back_utils.invite_reg_info_pass(invite_reg_info)
        except:
            traceback.print_exc()
            ret['code'] = "1001"
            ret['message'] = "修改失败"
            logger.info('%s url:%s method:%s' % (traceback.format_exc(), request.path, request.method))
        return JsonResponse(ret)
