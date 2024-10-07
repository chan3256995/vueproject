
from rest_framework.views import APIView
from django.http.response import JsonResponse
from django.http import HttpResponse
from trade import models as trade_models
from trade import trade_utils
from utils import commom_utils
from utils import my_site_utils
from backstage import models as back_models
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
from utils import mglobal
from utils import bl_site_utils
from _decimal import Decimal
from backstage import bserializers
from rest_framework.mixins import CreateModelMixin,RetrieveModelMixin,UpdateModelMixin,ListModelMixin,DestroyModelMixin
import time
import datetime
import threading
import logging
import json
import requests
import random

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


# 临时处理代码 比如批量修改数据库信息
class Temp2(APIView):
    authentication_classes = []
    renderer_classes = [GBKJSONRenderer, ]
    permission_classes = []


    def get_url_params(self,url):
        return_obj = {}
        indextem = url.index("?")
        sum_length = len(url)
        params_str = url[url.index("?") + 1:len(url)]
        print("params_str:" + params_str)
        params_arr = params_str.split("&")
        print(params_arr)
        for item_ in params_arr:
            item_key_value = item_.split("=")
            key1 = item_key_value[0]
            value1 = item_key_value[1]
            return_obj[key1] = value1
        return return_obj

    def post(self, request, *args, **kwargs):
        ret = {'code': "1000", 'message': ""}
        try:
            query_ = trade_models.UserFocusDouYinShop.objects.filter()
            for item_query in query_:
                url = item_query.monitor_url
                base_url = url.split("?")[0]
                base_url = "https://lianmengapi5-core-lf.ecombdapi.com/aweme/v1/store/product/list/"
                params_obj = self.get_url_params(url)
                params_obj['iid'] = 4270948144395438
                params_obj['device_id'] = 2335807680293166
                params_obj['channel'] = "tengxun_juguang1_dy_rta_1011"

                str_ = ""
                for key in params_obj.keys():
                    str_ = str_ + str(key) + "=" + str(params_obj[key]) + "&"
                str_ = str_[0:len(str_) - 1]
                new_monitor_url = base_url + "?" + str_
                print(url)
                print("新地址:"+new_monitor_url)
                item_query.monitor_url = new_monitor_url
                item_query.save()
            print(request.data)

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

    def post(self, request, *args, **kwargs):
        try:
            ret = {'code': "1000", 'message': ""}
            # return Response(ret)
            print("tag print''''''''''''''")
            print(request.data)
            req_data = request.data
            alipay_trade_no = req_data.get("tradeNo")
            trade_info = trade_models.TradeInfo.objects.filter(recharge_number=alipay_trade_no).first()

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
            if self.save_pay_info(req_data):
                return Response(ret)
            else:
                return Response(status=400, data=ret)
        except:
            traceback.print_exc()
            ret['code'] = "1001"
            ret['message'] = "查询异常"
            logger.info('%s url:%s method:%s' % (traceback.format_exc(), request.path, request.method))
        return Response(ret)
        # return JsonResponse(ret)

# 保存Android客户端监听到的支付订单信息  监听自己生成的二维码付款信息
    def save_pay_info(self,req_data):
        try:
            if req_data !={}:
                pay_trade_no = req_data.get("tradeNo")
                trade_info = trade_models.TradeInfo.objects.filter(recharge_number=pay_trade_no).first()
                if trade_info is not None:
                    return False

                mark = req_data.get('mark')
                if mark.endswith("_17pay"):
                    user = None
                    if mark is not None or mark != "":
                        mark_array = mark.split("_")
                        mark_msg = mark_array[0]
                        mark_user_id = int(mark_array[1])
                        user = user_models.User.objects.filter(id=mark_user_id).first()
                        if user is None:
                            return False
                save_data = {}
                save_data.update({'recharge_number':pay_trade_no})
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
                ser.validated_data['message'] = "充值 " + " 充值号：" + save_data.get( "recharge_number")  + "金额：" + save_data.get("trade_money")
                ser.save()

            else:
                return False
        except:
            traceback.print_exc()
            logger.info('%s url:%s method:%s' % (traceback.format_exc(), self.request.path, self.request.method))
            raise Exception(traceback.format_exc())
            return False
        return True



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
                'receiver_address': '电子城街道太白南路' ,
                'receiver_phone': '',
                'receiver_mobile': 11,
                'receiver_zip': 450000,
                'expTempId': 111,
                'seller_memo': '',
                'expOrderId': '',
                'orders': '{"orders":[{"title":"简易仰卧起坐女辅助器宿舍床上家用固定脚压脚器做健身器材学生男","outid":"","skuname":"颜色分类:[黑色]加长款","num":1,"price":49.2,"discountfee":0,"payment":25.51,"outerskuid":"","outeriid":"Y1001","weight":0.01}]}',
                'sendInfoContactName': '陈清龙',
                'sendInfoMobilePhone': 17087987015,
                'sendInfoProvince': '广东省' ,
                'sendInfoCity': '梅州市' ,
                'sendInfoCountry': '兴宁市' ,
                'sendCompany': '22' ,
                'sendInfoAddr': '22'
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


class SaveDouYinGoods(APIView):

    authentication_classes = []
    permission_classes = []

    def post(self, request, *args, **kwargs):
        try:
            ret = {'code': "1000", 'message': ""}
            print(request.data)
            douyin_goods_list = request.data.get("douyin_goods_list")
            shop_id = request.data.get("shop_id")
            # 不更新时间
            is_ignore_shop_update_time = request.data.get("is_ignore_shop_update_time")
            sql_user_shop = trade_models.UserFocusDouYinShop.objects.filter(shop_id=shop_id).first()
            if sql_user_shop is None:
                ret["code"] = "1001"
                ret["message"] = "不存在该店铺"
                return  Response(ret)
            shop_update_time_old = sql_user_shop.update_time
            cur_time = time.time() * 1000


            if is_ignore_shop_update_time is not None and  is_ignore_shop_update_time is True:
                # 更新时间不小于 1 小时
                sql_user_shop.update_time = shop_update_time_old
            else:
                dur_time = cur_time - shop_update_time_old
                one_hour = 60 * 60 * 1000
                sql_user_shop.update_time = dur_time
                print("店铺更上次更新时间:" + mtime.stamp_to_time(shop_update_time_old / 1000, "%Y-%m-%d %H:%M:%S"))
                if dur_time < one_hour:
                    ret = {'code': "1001", 'message': ""}
                    return Response(ret)
            my_site_utils.save_dou_yin_goods_data_to_db(self, douyin_goods_list, shop_id)
            sql_user_shop.save()
            print("店铺:" + shop_id +"更新成功")
            ret = {'code': "1000", 'message': ""}



        except:
            traceback.print_exc()
            ret['code'] = "1001"
            ret['message'] = "查询异常"
            logger.info('%s url:%s method:%s' % (traceback.format_exc(), request.path, request.method))
            return Response(ret)
        return Response(ret)


class AddReturnPackages(APIView):

    # authentication_classes = [BackStageAuthentication, BackStageNahuoAuthentication]
    authentication_classes = []
    # permission_classes = [NahuoUserpermission]
    permission_classes = []

    def post(self, request, *args, **kwargs):
        try:

            ret = {'code': "1000", 'message': ""}
            return_package_list = json.loads(request.data.get("return_package_list"))
            new_return_package_list = []
            exits_return_package_list = []

            for returnPackage in return_package_list:
                pacakge_obj = trade_models.ReturnPackageInfo.objects.filter(return_logistics_number=returnPackage.get('return_logistics_number')).first()
                # 入库的包裹对应的平台订单属性更新为True
                is_platformOrder_inbound = False
                
                with transaction.atomic():
                    if pacakge_obj is None:
                        new_return_package_list.append(returnPackage)
                        return_logistics_name = returnPackage.get('return_logistics_name')
                        return_logistics_number = returnPackage.get('return_logistics_number')
                        data_source = returnPackage.get('data_source')
                        logistics_info = returnPackage.get('logistics_info')
                        account = returnPackage.get('account')
                        logistics_status = returnPackage.get('logistics_status_type_desc')
                        is_inbound = returnPackage.get('is_inbound')
                        logistics_info2 = logistics_info
                        if logistics_info2 is None:
                            logistics_info2 = ""
                        print(is_inbound)
                        data = {

                            "logistics_status": logistics_status,
                            "account": account,
                            "logistics_info": mtime.stamp_to_time(time.time(), None) + " " + logistics_info2,
                            "data_source": data_source,
                            "return_logistics_name": return_logistics_name,
                            "return_logistics_number": return_logistics_number,
                            "add_time": time.time() * 1000,

                        }
                        if is_inbound is True:
                            data['is_inbounded'] = True
                            data['inbound_time'] = time.time() * 1000
                            is_platformOrder_inbound = True
                        if logistics_status == back_utils.back_return_package_logistics_status_choise["已送达"]:
                            data['update_time'] = time.time() * 1000
                        obj = trade_models.ReturnPackageInfo.objects.create(**data)
                        if obj is not None:
                            with transaction.atomic():
                                refund_apply = trade_models.RefundApply.objects.select_for_update().filter(return_logistics_number=return_logistics_number).first()
                                if refund_apply is not None and refund_apply.refund_apply_progress == mcommon.refund_apply_progress_choices2['未处理']:
                                    refund_apply.refund_apply_progress = mcommon.refund_apply_progress_choices2['仓库已收到退件']
                                    refund_apply.save()
                    else:
                        is_exits_package = True
                        if returnPackage.get('logistics_info') != None and returnPackage.get('logistics_info') != "":
                            pacakge_obj.logistics_info = mtime.stamp_to_time(time.time(),None) + " " + returnPackage.get('logistics_info')
                        if returnPackage.get('is_inbound') is True and pacakge_obj.is_inbounded is not True:
                            pacakge_obj.is_inbounded = True
                            pacakge_obj.inbound_time = time.time() * 1000
                            is_platformOrder_inbound = True
                            is_exits_package = False
                        if pacakge_obj.logistics_status != back_utils.back_return_package_logistics_status_choise["已送达"] and returnPackage.get('logistics_status_type_desc') == back_utils.back_return_package_logistics_status_choise["已送达"]:
                            # 记录未送达 最新为送达
                            pacakge_obj.logistics_status = back_utils.back_return_package_logistics_status_choise["已送达"]
                            pacakge_obj.update_time = time.time() * 1000

                        pacakge_obj.save()
                        if is_platformOrder_inbound is True:
                            back_models.PlatformOrder.objects.filter(logistics_number=returnPackage.get('return_logistics_number')).update(logistics_is_inbounded=True)

                        if is_exits_package is True:
                            exits_return_package_list.append(returnPackage)


            ret['exits_list'] = exits_return_package_list
        except:
            traceback.print_exc()
            ret['code'] = "1001"
            ret['message'] = "提交失败"+traceback.format_exc()
            logger.info('%s url:%s method:%s' % (traceback.format_exc(), request.path, request.method))
            return Response(ret)
        return Response(ret)


# 添加电商平台订单信息
class AddPlatformOrderInfo(APIView):

    # authentication_classes = [BackStageAuthentication, BackStageNahuoAuthentication]
    authentication_classes = []
    # permission_classes = [NahuoUserpermission]
    permission_classes = []

    def post(self, request, *args, **kwargs):
        try:

            ret = {'code': "1000", 'message': ""}
            order_list = json.loads(request.data.get("order_list"))
            new_list = []
            fail_list = []

            for platformOrder in order_list:
                try:
                    order_obj = back_models.PlatformOrder.objects.filter(order_number=platformOrder.get('order_number')).first()
                    if order_obj is None:
                        with transaction.atomic():
                            new_list.append(platformOrder)
                            logistics_number = platformOrder.get('logistics_number')
                            data_source = platformOrder.get('data_source')
                            # logistics_info = platformOrder.get('logistics_info')
                            shop_name = platformOrder.get('shop_name')
                            shop_id = platformOrder.get('shop_id')
                            order_number = platformOrder.get('order_number')
                            account = platformOrder.get('account')

                            order_data = {
                                "logistics_number": logistics_number,
                                "account": account,
                                "shop_id": shop_id,
                                "data_source": data_source,
                                # "logistics_info": logistics_info,
                                "shop_name": shop_name,
                                "order_number": order_number,
                                "add_time": time.time() * 1000,
                            }
                            # 该订单对应的包裹物流
                            ret_package_obj = trade_models.ReturnPackageInfo.objects.filter(return_logistics_number=logistics_number).first()
                            if ret_package_obj is not None and ret_package_obj.is_inbounded is True:
                                # 该订单对应的包裹物流
                                order_data['logistics_is_inbounded'] = True
                            success_order = back_models.PlatformOrder.objects.create(**order_data)
                            if success_order is not None:
                                order_goods_list = platformOrder.get("order_goods_list")
                                for order_goods in order_goods_list:
                                    order_goods_data = {
                                        "platformOrder" : success_order,
                                        "goods_name": order_goods.get("goods_name"),
                                        "goods_id": order_goods.get("goods_id"),
                                        "image_src": order_goods.get("image_src"),
                                        "color_size": order_goods.get("color_size"),
                                        "goods_count": order_goods.get("goods_count"),
                                        "goods_price": order_goods.get("goods_price"),
                                        "add_time": time.time() * 1000,

                                    }
                                    obj = back_models.PlatformOrderGoods.objects.create(**order_goods_data)

                except:
                    fail_list.append(platformOrder)
                    traceback.print_exc()

                    logger.info('%s url:%s method:%s' % (traceback.format_exc(), request.path, request.method))
            ret['fail_list'] = fail_list
        except:
            traceback.print_exc()
            ret['code'] = "1001"
            ret['message'] = "查询异常"
            logger.info('%s url:%s method:%s' % (traceback.format_exc(), request.path, request.method))
            return Response(ret)
        return Response(ret)


# 添加电商平商品记录
class AddPlatformGoodsInfo(APIView):

    # authentication_classes = [BackStageAuthentication, BackStageNahuoAuthentication]
    authentication_classes = []
    # permission_classes = [NahuoUserpermission]
    permission_classes = []

    def post(self, request, *args, **kwargs):
        try:

            ret = {'code': "1000", 'message': ""}
            goods_list = json.loads(request.data.get("goods_list"))
            shop_unique_id =  request.data.get("shop_unique_id")
            data_source =  request.data.get("data_source")
            print("datasource:"+data_source)


            new_list = []
            fail_list = []

            for platformGoods in goods_list:
                try:
                    data_source = data_source
                    goods_name = platformGoods.get('goods_name')
                    img_url = platformGoods.get('img_url')
                    goods_id = platformGoods.get('goods_id')
                    remarks = platformGoods.get('remarks')
                    new_goods_data = {
                        "data_source": data_source,
                        "goods_name": goods_name,
                        "image_src": img_url,
                        "goods_id": goods_id,
                        "shop_unique_id": shop_unique_id,
                    }
                    goods_obj = back_models.PlatformGoods.objects.filter(goods_id=platformGoods.get('goods_id')).first()
                    if goods_obj is None:
                            new_list.append(platformGoods)
                            new_goods_data['add_time'] = time.time() * 1000
                            new_goods_data['remarks'] = remarks
                            success_goods = back_models.PlatformGoods.objects.create(**new_goods_data)
                            success_goods.goods_code = success_goods.id
                            success_goods.save()
                    else:
                        goods_obj.goods_name = goods_name
                        goods_obj.image_src = img_url
                        goods_obj.save()

                except:
                    fail_list.append(platformGoods)
                    traceback.print_exc()

                    logger.info('%s url:%s method:%s' % (traceback.format_exc(), request.path, request.method))
            ret['fail_list'] = fail_list
        except:
            traceback.print_exc()
            ret['code'] = "1001"
            ret['message'] = "查询异常"+'%s url:%s method:%s' % (traceback.format_exc(), request.path, request.method)
            logger.info('%s url:%s method:%s' % (traceback.format_exc(), request.path, request.method))
            return Response(ret)
        return Response(ret)


    # 添加问题单跟单

# 添加问题单跟单
class AddTroubleOrderView(APIView):

    authentication_classes = [BackStageAuthentication]
    def post(self, request, *args, **kwargs):
        try:
            ret = {'code': "1000", 'message': ""}
            post_obj = request.data
            print(post_obj)
            with transaction.atomic():
                data = {
                    "owner": request.user,
                    "plat_form_order_number": post_obj['plat_form_order_number'],
                    "logistics_number": post_obj['logistics_number'],
                    "plat_form": post_obj['plat_form'],
                    "order_status": post_obj['order_status'],
                    "shop_name": post_obj['shop_name'],
                    "remarks": post_obj['remarks'],
                    "update_time": time.time() * 1000,
                    "add_time": time.time() * 1000,
                }

                data['update_time'] = 0
                troubleOrders = back_models.TroubleOrders.objects.create(**data)
                troubleOrders.save()

        except:
            logger.info('%s userid->%s ,  url:%s method:%s' % (
                "提交异常" + traceback.format_exc(), self.request.user.id, self.request.path, self.request.method))
            traceback.print_exc()
            ret['code'] = "1001"
            ret['message'] = '添加异常，,' + traceback.format_exc()
            return Response(ret)

        return Response(ret)


# 问题单跟单编辑
class EditTroubleOrderView(APIView):
    authentication_classes = [BackStageAuthentication]
    permission_classes = [NahuoUserpermission]

    def post(self, request, *args, **kwargs):
        ret = {"code": "1000", "message": ""}
        try:
            data = request.data
            req_trouble_order = data.get("trouble_order_data")
            print(req_trouble_order)

            # 判断非游客用户
            if isinstance(request.user, user_models.User):
                with transaction.atomic():

                    sql_trouble_order = back_models.TroubleOrders.objects.filter(id=req_trouble_order.get('id')).first()
                    if sql_trouble_order is not None:
                        if req_trouble_order.get('plat_form_order_number') is not None:
                            sql_trouble_order.plat_form_order_number = req_trouble_order.get('plat_form_order_number')
                        if req_trouble_order.get('logistics_number') is not None:
                            sql_trouble_order.logistics_number = req_trouble_order.get('logistics_number')
                        if req_trouble_order.get('plat_form') is not None:
                            sql_trouble_order.plat_form = req_trouble_order.get('plat_form')
                        if req_trouble_order.get('order_status') is not None:
                            sql_trouble_order.order_status = req_trouble_order.get('order_status')
                        if req_trouble_order.get('shop_name') is not None:
                            sql_trouble_order.shop_name = req_trouble_order.get('shop_name')
                        if req_trouble_order.get('remarks') is not None:
                            sql_trouble_order.remarks = req_trouble_order.get('remarks')

                        sql_trouble_order.save()

                    else:
                        ret['code'] = "1001"
                        ret['message'] = "不存在"
                        return Response(ret)
            else:
                ret['code'] = "1001"
                ret['message'] = '无效用户'
                return JsonResponse(ret)
        except:

            ret['code'] = "1001"
            ret['message'] = '查询异常'
            ret['message2'] = '查询异常'+traceback.format_exc()
            traceback.print_exc()
            logger.info('%s url:%s method:%s' % (traceback.format_exc(), request.path, request.method))
            return JsonResponse(ret)
        return JsonResponse(ret)

        # 问题单跟单删除


class DeleteTroubleOrderView(APIView):
    authentication_classes = [BackStageAuthentication]
    permission_classes = [NahuoUserpermission]

    def post(self,request, *args, **kwargs):
        try:
            ret = {'code': "1000", 'message': ""}
            data = request.data
            print(data)
            id_list = data.get("id_list")

            with transaction.atomic():
                back_models.TroubleOrders.objects.filter(owner = request.user,id__in= id_list).delete()



        except:
            logger.info('%s userid->%s ,  url:%s method:%s' % ("提交异常" + traceback.format_exc(), self.request.user.id, self.request.path, self.request.method))
            traceback.print_exc()
            ret['code'] = "1001"
            ret['message'] = '查询异常'
            ret['message2'] = '查询异常,'+traceback.format_exc()
            return Response(ret)

        return Response(ret)


# 问题单列表
class TroubleOrderView(ListModelMixin, GenericViewSet):
    authentication_classes = [BackStageAuthentication]
    permission_classes = [NahuoUserpermission]
    # 设置分页的class
    pagination_class = UsersPagination

    serializer_class = bserializers.BackTroubleOrderSQuerySerializer

    def get_queryset(self):
        try:
            print(self.request.query_params)
            query_keys = self.request.query_params.get("keys")
            order_status = self.request.query_params.get("order_status")
            order_by = ["add_time"]
            args = Q()
            if order_status is not None:
                args  = args & Q(order_status=order_status)
            if query_keys is not None:
                upper_query_key = query_keys.upper()
                args = args & Q(Q(remarks__contains=query_keys)| Q(logistics_number__contains=upper_query_key)  | Q(logistics_number__contains=query_keys) | Q(shop_name__contains=query_keys)| Q(plat_form_order_number__contains=query_keys))

            return back_models.TroubleOrders.objects.filter(args).order_by(*order_by)

        except:
            traceback.print_exc()

    def list(self,request, *args, **kwargs):
        ret = {'code': "1000", 'message': ""}
        try:
            trouble_orders_query_set = self.filter_queryset(self.get_queryset())
            page = self.paginate_queryset(trouble_orders_query_set)
            if page is not None:
                serializer = self.get_serializer(page, many=True)

                return self.get_paginated_response(serializer.data)

            serializer = self.get_serializer(trouble_orders_query_set, many=True)
            ret['code'] = "1000"
            ret['result'] = serializer.data
            return JsonResponse(ret)
            # ser = self.QueryInviteRegisterInfoSerializer(instance=invite_register_info_query_set, many=True)
            # ret['results'] = ser.data
        except:
            traceback.print_exc()
            logger.info('%s url:%s method:%s' % (traceback.format_exc(), request.path, request.method))
            ret['code'] = "1001"
            ret['message'] = '查询失败'
        return Response(ret)
# 给你用户添加余额
class AddUserBalance(APIView):

    authentication_classes = [BackStageAuthentication, BackStageNahuoAuthentication]
    permission_classes = [NahuoUserpermission]

    def post(self, request, *args, **kwargs):
        try:
            with transaction.atomic():
                ret = {'code': "1000", 'message': ""}
                req_user_name = request.data.get("user_name")
                money = request.data.get("add_money")
                message = request.data.get("message")
                print(request.data)

                user_obj = user_models.User.objects.select_for_update().filter(user_name=req_user_name).first()

                if user_obj is None:
                    ret['code'] = "1001"
                    ret['message'] = "用户名不存在"
                    return Response(ret)
                if message is None:
                    message = ""
                data = {
                    "trade_money": money,
                }
                ser = m_serializers.UserBalanceAlertSerializer(data=data, context={'request': request})
                ser.is_valid(raise_exception=True)
                ser.validated_data['user'] = user_obj
                ser.validated_data['trade_number'] = mglobal.BaseTrade(user_obj).get_trade_number()
                ser.validated_data['trade_source'] = mcommon.trade_source_choices2.get("其他费用")
                ser.validated_data['cash_in_out_type'] = mcommon.cash_in_out_type_choices2.get("收入")
                ser.validated_data['add_time'] = time.time() * 1000
                ser.validated_data['message'] = "手工充值： "+money+"元，"+message
                user_obj.balance = Decimal(str(user_obj.balance)) + Decimal(str(money))
                ser.validated_data['user_balance'] = Decimal(str(user_obj.balance))
                ser.validated_data['is_pass'] = True
                user_obj.save()
                ser.save()
        except:
            traceback.print_exc()
            ret['code'] = "1001"
            ret['message'] = "查询异常"
            logger.info('%s url:%s method:%s' % (traceback.format_exc(), request.path, request.method))
            return Response(ret)
        return Response(ret)


class BLTuihuotuikApply(APIView):

    authentication_classes = [BackStageAuthentication, BackStageNahuoAuthentication]
    permission_classes = [NahuoUserpermission]

    def post(self, request, *args, **kwargs):
        try:
            with transaction.atomic():
                ret = {'code': "1000", 'message': ""}
                req_order_goods_list =  json.loads(request.data.get("tuihuo_order_goods_list"))
                exception_order_list = []
                success_order_list = []
                for req_order_goods in req_order_goods_list:
                    goods_number = req_order_goods['goods_number']
                    goods_id = req_order_goods['goods_id']
                    return_logistics_name = req_order_goods['return_logistics_name']
                    return_logistics_number = req_order_goods['return_logistics_number']
                    print(request.data)
                    orderGoods = trade_models.OrderGoods.objects.select_for_update().filter(goods_number=goods_number).first()
                    od_number = orderGoods.order.order_number.replace("os", "")
                    if return_logistics_number is not None and return_logistics_number!='':
                        refund_result = bl_site_utils.refund_tuihuotuik_bl({"order_number": od_number, "order_id": orderGoods.order.id, "order_goods_id": orderGoods.id,"return_logistics_name": return_logistics_name, "return_logistics_number": return_logistics_number})
                        if refund_result['code'] == "ok":
                            success_order_list.append({"order_goods": req_order_goods, "message":""})
                        elif refund_result['code'] == "error":
                            exception_order_list.append({"order_goods": req_order_goods, "message": refund_result['message']})
                    else :
                        ret["code"] = "1001"
                        ret["message"] = "物流单号不能为空"
                        exception_order_list.append({"order_goods": req_order_goods,"message":"物流单号不能为空"})



        except:
            print(traceback.print_exc())
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


# 自动扫描lb网站已拿货的订单
class AutoScanYiNaHuoOrder(APIView):
    authentication_classes = []
    permission_classes = []
    def post(self, request, *args, **kwargs):

        print(request.data)
        try:

            ret = {'code': "1000", 'message': ""}
            self.start_run_thread()
            # *******************
            # result = bl_site_utils.login("海文","137637653")
            # if result.get("code") == 'ok':
            #     # bl_site_utils.check_login(result.get('cookies'))
            #     bl_site_utils.start_delivery_order_blto17(result.get('cookies'))
            #     # bl_site_utils.load_order_list(result.get('cookies'),{"ss":55})
            # *******************

        except:
            traceback.print_exc()
            ret['code'] = "1001"
            ret['message'] = "查询异常"
            logger.info('%s url:%s method:%s' % (traceback.format_exc(), request.path, request.method))

        return JsonResponse(ret)

    def start_run_thread(self):
        main_thread = back_models.ThreadTask.objects.filter(task_name='main_thread').first()
        if main_thread is None:
            return
        time_interval = main_thread.time_interval
        main_last_time = main_thread.last_run_time
        main_thread.last_run_time = time.time()
        main_thread.save()
        if main_thread.is_run is True:

            query_set = back_models.ThreadTask.objects.filter()
            for item in query_set:
                if item.task_name == 'load_order_yinahuo_yifahuo':
                    self.start_load_yinahuo_yifahuo_thread(item)

                elif item.task_name == 'collect_dou_yin_shop_goods_task':
                    self.start_collect_douyin_goods_thread(item)

            # timer = threading.Timer(time_interval, self.start_run_thread)
            # timer.start()

        main_thread.last_run_time = time.time()
        last_time2 = time.strftime("%Y-%m-%d %H:%M:%S", time.localtime(time.time()))
        print("main_thread----")
        print(last_time2)
        main_thread.save()

    # 已拿货已发货任务时间间隔 返回时间秒
    def get_load_order_yinahuo_yifahuo_task_interval_time(self,cur_hour):
        if (cur_hour>0 and cur_hour<12) or cur_hour == 12 or cur_hour == 0:
            return 2 * 60 * 60
        elif cur_hour == 13:
            return 1 * 60 * 60
        elif cur_hour == 14:
            # 半小时
            return 30 * 60
        elif cur_hour > 14 and cur_hour < 19:
            return 15 * 60
        elif  cur_hour == 19:
            return 30 *60
        elif cur_hour > 19 and cur_hour < 24 :
            return 1 * 60 * 60

    #   返回采集时间间隔秒
    def get_collect_douyin_goods_task_interval_time(self, cur_hour):
        if (cur_hour > 0 and cur_hour < 6) or cur_hour == 6  :
            return 10 * 60

        elif (cur_hour > 6 and cur_hour < 10) or cur_hour == 10:
            return 10 * 60
        elif (cur_hour > 10 and cur_hour < 13) or cur_hour == 13:
            return 10 * 60
        elif (cur_hour > 13 and cur_hour < 18) or cur_hour == 18:
            return 10 * 60
        elif (cur_hour > 18 and cur_hour < 24)or cur_hour == 0 :
            return 10 * 60
        return 1 * 60 * 60



    def start_collect_douyin_goods_thread(self, task_item):
        m_cookies = {"sessionid": "ca0ec46f81673efc6aa837137c747c96"}
        headers = {"User-Agent": "com.ss.android.ugc.aweme/200301 (Linux; U; Android 6.0.1; zh_CN; MI 5s; Build/V417IR;tt-ok/3.10.0.2)",
                   "X-Tt-Token": "00ca0ec46f81673efc6aa837137c747c9604fb27ef72651c1fd4b199ca16890c5ccfc721366594729e4a2efe0baf02cb8b8ed32adf51d884817dfb07f2a700f3dbaf7b88a1562790b6fef13cca65a0f2339b36264050497e61f24e3ea4e5e6f6efa62-1.0.1",
                   "X-Ladon": "xjgKZdbr258QQyMJ1R2N1QOGm3usLvEhPc59187ybvHYt+yQ",
                   }

        # 最后 一次运行时间
        last_time = task_item.last_run_time
        is_run = task_item.is_run
        # 运行时间间隔 单位 秒
        time_interval = task_item.time_interval
        cur_time = time.time()
        if is_run is False:
            return
        #

        m_time = cur_time - (last_time + time_interval)

        if m_time > 0:
            task_item.last_run_time = time.time()
            task_item.save()
            last_time2 = time.strftime("%Y-%m-%d %H:%M:%S", time.localtime(last_time))
            cur_time_format = time.strftime("%Y-%m-%d %H:%M:%S", time.localtime(cur_time))
            cur_hour = cur_time_format.split(" ")[1].split(":")[0]
            order_by = ["update_time"]
            query_set = trade_models.UserFocusDouYinShop.objects.filter(is_monitor=True).order_by(*order_by)[0:25]
            print("即将采集店铺数："+str(len(query_set)))
            for sql_shop_info in query_set:



                try:
                    is_monitor = sql_shop_info.is_monitor
                    if is_monitor is False:
                        continue
                    update_time = sql_shop_info.update_time
                    monitor_url = sql_shop_info.monitor_url
                    url = monitor_url
                    mheader = headers
                    req_params = commom_utils.get_url_params(url)
                    if url.find("lianmengapi5-core-lf.ecombdapi.com") != -1:
                        shop_id = req_params['sec_shop_id']
                        sql_user_shop = trade_models.UserFocusDouYinShop.objects.filter(shop_id=shop_id).first()
                        if sql_user_shop is None:
                            continue
                        shop_update_time_old = sql_user_shop.update_time
                        m_cur_time = time.time() * 1000
                        # 更新时间不小于 1 小时
                        one_hour = 60 * 60 * 1000
                        dur_time = m_cur_time - shop_update_time_old

                        print("店铺更上次更新时间:" + mtime.stamp_to_time(shop_update_time_old / 1000, "%Y-%m-%d %H:%M:%S"))
                        if dur_time < one_hour:
                            continue

                        my_site_utils.get_dou_yin_goods_data2(self, url, m_cookies, mheader, req_params, sql_user_shop,
                                                              req_params['sec_shop_id'])
                        sql_user_shop.update_time = m_cur_time

                        sql_user_shop.save()
                    random_num = random.randint(1, 3)
                    print("随机数:" + str(random_num))
                    time.sleep(random_num)
                except:
                    traceback.print_exc()

                    logger.info('%s url:%s method:%s' % (traceback.format_exc(), "", "start_collect_douyin_goods_thread"))
            interval_time = self.get_collect_douyin_goods_task_interval_time(int(cur_hour))
            task_item.time_interval = interval_time
            # task_item.last_run_time = time.time()
            task_item.save()

    def start_load_yinahuo_yifahuo_thread(self, item):
        # 最后 一次运行时间
        last_time = item.last_run_time
        is_run = item.is_run
        # 运行时间间隔 单位 秒
        time_interval = item.time_interval
        cur_time = time.time()

        if last_time is None or last_time == "":
            last_time = time.time()
            item.last_run_time = last_time
            item.save()
        if is_run is False:
            return
        #
        m_time = cur_time - (last_time + time_interval)
        print("m_time:" + str(m_time))
        if m_time > 0:
            last_time2 = time.strftime("%Y-%m-%d %H:%M:%S", time.localtime(last_time))
            cur_time_format = time.strftime("%Y-%m-%d %H:%M:%S", time.localtime(cur_time))
            cur_hour = cur_time_format.split(" ")[1].split(":")[0]
            print("laod thread----")
            print(last_time2)
            print(cur_hour)
            result = bl_site_utils.login()
            if result.get("code") == 'ok':
                bl_site_utils.start_delivery_order_blto17(result.get('cookies'))
            interval_time = self.get_load_order_yinahuo_yifahuo_task_interval_time(int(cur_hour))
            item.time_interval = interval_time
            item.last_run_time = time.time()
            item.save()


class ChangeAllOrderGoodsPurchasingStatusViews(APIView):
    authentication_classes = [BackStageAuthentication, BackStageNahuoAuthentication]
    permission_classes = [NahuoUserpermission]

    def post(self, request, *args, **kwargs):
        print(request.data)
        try:
            with transaction.atomic():
                ret = {'code': "1000", 'message': ""}
                ip = mIP_utils.get_windows_local_ip()
                req_order_number_list = json.loads(request.data.get("order_number_list"))

                order_queryset = trade_models.Order.objects.filter(Q(order_number__in=req_order_number_list)).distinct()

                # 异常状态订单
                exception_order_list = []
                for sql_order in order_queryset:
                    # 订单里有一个商品状态该为已拿货 就更新时间
                    is_update_time = True
                    tem_exceptions_order_goods = []
                    sql_order_goods_query = trade_models.OrderGoods.objects.filter(order=sql_order)
                    for sql_order_goods in sql_order_goods_query:
                        if sql_order_goods.refund_apply_status == mcommon.refund_apply_choices2.get("无售后"):
                            if sql_order_goods.status == mcommon.status_choices2.get("拿货中") or sql_order_goods.status == mcommon.status_choices2.get("明日有货") or sql_order_goods.status == mcommon.status_choices2.get("2-5天有货") or sql_order_goods.status == mcommon.status_choices2.get("已下架") or sql_order_goods.status == mcommon.status_choices2.get("已拿货") or sql_order_goods.status == mcommon.status_choices2.get("其他"):
                                sql_order_goods.status = mcommon.status_choices2.get("已拿货")
                                sql_order_goods.log = ""
                                sql_order_goods.save()
                            else:
                                tem_exceptions_order_goods.append(sql_order_goods.id)
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


# 修改拿货中状态商品 统一用这个接口（如 拿货中状态 改为 明日有货  2-5天有货 已拿货  其他）
class ChangePurchasingStatus(APIView):
    authentication_classes = [BackStageAuthentication, BackStageNahuoAuthentication]
    permission_classes = [NahuoUserpermission]

    def post(self, request, *args, **kwargs):
        # {'order_list': [{'order_number': 'os20191007141753133698', 'orderGoods': [{'goods_number': 'gs20191007141753153630', 'goods_count': 1}]}]}
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
    # authentication_classes = []
    permission_classes = [NahuoUserpermission]
    # permission_classes = []

    def post(self, request, *args, **kwargs):

        print(request.data)
        try:
            with transaction.atomic():
                ret = {'code': "1000", 'message': ""}
                find_order_by = "id"
                ip = mIP_utils.get_windows_local_ip()
                # if ip.find('172.17.1.38') == -1:
                #     ret['code'] = "1001"
                #     ret['message'] = "数据异常"
                #     return JsonResponse(ret)

                req_order_list = json.loads(request.data.get("deliver_order_list"))
                req_order_id_list = []
                req_order_tb_order_number_list = []
                # 异常状态订单
                exception_order_list = []
                for i in range(0,len(req_order_list)):
                    req_id = req_order_list[i].get("id")
                    tb_order_number = req_order_list[i].get("tb_order_number")
                    if req_id is not None and req_id != "":
                        if req_id.startswith("r") is False:
                            ret['code'] = "1001"
                            ret['message'] = "数据异常"
                            return JsonResponse(ret)
                        else:
                            req_id = req_id.replace('r', '')
                            req_order_list[i]['id'] = req_id
                        req_order_id_list.append(req_id)
                    if tb_order_number is not None and tb_order_number != "":
                        req_order_tb_order_number_list.append(tb_order_number)

                if len(req_order_id_list)>0:
                    find_order_by = "id"
                    order_queryset = trade_models.NullPackageOrder.objects.select_for_update().filter(Q(id__in=req_order_id_list)).distinct()
                elif len(req_order_tb_order_number_list) > 0:
                    find_order_by = "tb_order_number"
                    order_queryset = trade_models.NullPackageOrder.objects.select_for_update().filter(Q(tb_order_number__in=req_order_tb_order_number_list)).distinct()

                for sql_order in order_queryset:
                    req_order = None
                    if find_order_by == "id":
                        req_order = self.find_order(id=sql_order.id,tb_order_number="",req_order_list=req_order_list)
                    else:
                        req_order = self.find_order(id="",tb_order_number=sql_order.tb_order_number, req_order_list=req_order_list)
                    if req_order is None:
                        continue
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
            ret['message'] = '%s url:%s method:%s' % (traceback.format_exc(), request.path, request.method)
            logger.info('%s url:%s method:%s' % (traceback.format_exc(), request.path, request.method))
            return JsonResponse(ret)
        return JsonResponse(ret)

    def find_order(self,id,tb_order_number,req_order_list):
        for req_order in req_order_list:
            if (id!="") and (str(id) == req_order.get("id")):
                return req_order
            elif (tb_order_number!="") and (str(tb_order_number) == req_order.get("tb_order_number")):
                return req_order
        return None


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
