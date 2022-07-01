from django.core import serializers as dj_serializers
from django.forms.models import model_to_dict
from utils import permission
from rest_framework.views import APIView
from utils import mcommon
from user import user_utils
from rest_framework import mixins
from utils import m_serializers
from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response
from rest_framework.viewsets import GenericViewSet
from django.db.models import Q
from utils.permission import Superpermission
from utils.permission import NahuoUserpermission
from utils.auth import BackStageAuthentication
from utils.auth import BackStageNahuoAuthentication
from utils import mIP_utils
from django.db import transaction
from rest_framework  import serializers
from trade import models as trade_models
from user import models as user_models
from backstage import models as back_models
from utils import mfile_utils
from datetime import datetime
from xiaoEdaifa import settings
from utils import mglobal
from trade import trade_utils
from backstage import bserializers
from _decimal import Decimal
from utils import mtime
from contextlib import closing
import time
from utils import String
import requests
import xlwt
import traceback
import logging
import json
logger = logging.getLogger('stu')


class GetZhaoYaoJingImage(APIView):
    authentication_classes = []
    permission_classes = []

    def post(self, request, *args, **kwargs):
        ret = {"code": "1000", "message": ""}
        data = request.data
        referer = data.get("referer")
        image_list = json.loads(data.get("image_list"))
        return_image_url_list = []
        try:
            headers = {
                # cookie 这里就不贴出来了 ![(☆_☆)/~~]
                #  "Cookie": "JSESSIONID=3A2EFB775241DD7BFACA1E75D99624AF-n1",
                # 'content-type': 'charset=gbk',
                # 'Content-Type': 'application/x-www-form-urlencoded',
                # 'Connection': 'keep-alive',
                # 'Accept-Encoding': 'gzip, deflate',
                # 'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
                # 'host':',
                # # 'origin': '',
                'Referer': referer,
                # "User-Agent": "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.169 Safari/537.36",
                "User-Agent": "Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.54 Safari/537.36",

            }

            today = datetime.today()

            # today_date = mtime.stamp_to_time(time.time(), "%Y-%m-%d %H-%M-%S")



            # zhaoyaojing_pic2 = str(today_date) + 'zhaoyaojing_pic2.png'
            # zhaoyaojing_pic1 = 'zhaoyaojing_pic1.png'
            # zhaoyaojing_pic2 = 'zhaoyaojing_pic2.png'

            # 需要导出保存的订单
            new_order_list = []
            # 文件保存地址
            zhaoyaojing_pic_path = settings.TEMP_FILE_DIRS + "/bk2/"
            # 文件远程访问地址





            # url1 = "http://192.168.1.102:8009/back/static/temp/bk2/zhaoyaojing_pic1.png"
            # url1 = "http://i.cy1788.cn/data/m/20211102/e5c439cc9a8f40979a0765f9780e3597.png"

            for i in range(len(image_list)):
                today_date = int(time.time() * 1000)
                zhaoyaojing_pic = str(today_date) + 'zhaoyaojing_pic.png'
                zhaoyaojing_pic_url = mglobal.STATIC_URL_BK + "/back" + settings.STATIC_URL + "temp/bk2/" + zhaoyaojing_pic
                with closing(requests.get(image_list[i], headers=headers, stream=True)) as response:
                    with open(zhaoyaojing_pic_path + zhaoyaojing_pic, "wb") as file:
                        for data in response.iter_content(128):
                            file.write(data)
                return_image_url_list.append(zhaoyaojing_pic_url)



                # 保存之前把之前生成的文件都删除了 以免时间长了存留太多文件
            file_list = mfile_utils.get_file_list(settings.TEMP_FILE_DIRS + "/bk2/")
            for file in file_list:
                print("文件名：" + file)
                m_time = int(file[0:13])
                curr_time= int(time.time() * 1000 )
                tt = curr_time - m_time
                expire_time =  30 * 60 *1000
                if tt > expire_time:
                    mfile_utils.delete_file(settings.TEMP_FILE_DIRS + "/bk2/" + file)

            # wbk.save(excel_path + zhaoyaojing_pic2)
            ret['image_list'] = return_image_url_list
        except:
            print(traceback.print_exc())
            traceback.print_exc()
            ret['code'] = "1001"
            ret['message'] = "获取失败"
            logger.info('%s url:%s method:%s' % (traceback.format_exc(), request.path, request.method))
        return Response(ret)


# 导出标签打印状态的订单
class OutPutOrdersView(APIView):
    authentication_classes = [BackStageAuthentication,]
    permission_classes = [Superpermission]

    def post(self, request, *args, **kwargs):
        try:
            ret = {"code": "1000", "message": ""}
            data = request.data
            if data.get("for") == "315":
                return self.out_to_315(request, args, kwargs)
            elif data.get("for") == "other_website":
                return self.out_to_other_website(request, args, kwargs)
            elif data.get("for") == "print_tag":
                return self.out_to_print(request, args, kwargs, data.get("for"))
            elif data.get("for") == "re_print_tag":
                return self.out_to_print(request, args, kwargs, data.get("for"))
        except:
            print(traceback.print_exc())
            traceback.print_exc()
            ret['code'] = "1001"
            ret['message'] = "生成失败"
            logger.info('%s url:%s method:%s' % (traceback.format_exc(), request.path, request.method))
        return Response(ret)

    def out_to_print(self,request, args, kwargs, condition):
        ret = {"code": "1000", "message": ""}

        args =   Q(orderGoods__status=mcommon.status_choices2.get("标签打印"))
        try:

            # 实例化一个Workbook()对象(即excel文件)
            wbk = xlwt.Workbook()
            # 新建一个名为Sheet1的excel sheet。此处的cell_overwrite_ok =True是为了能对同一个单元格重复操作。
            sheet = wbk.add_sheet('Sheet1', cell_overwrite_ok=True)
            # 获取当前日期，得到一个datetime对象如：(2016, 8, 9, 23, 12, 23, 424000)
            today = datetime.today()
            # 将获取到的datetime对象仅取日期如：2016-8-9
            today_date = datetime.date(today)
            print("ddddd")
            query_set = trade_models.Order.objects.filter(args).distinct().order_by('-add_time')

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
                order_goods_query = trade_models.OrderGoods.objects.filter(order=order)
                # 有效打印商品总数（ps: 状态为  标签打印 为有效打印商品）
                order_goods_avail_counts = self.get_curr_order_avail_tag_goods_count(order_goods_query)
                print(order.consignee_name)
                print("order_goods_avail_counts:" + str(order_goods_avail_counts))
                cur_avail_goods_index = 0
                for j in range(len(order_goods_query)):
                    order_goods = order_goods_query[j]
                    if order_goods.status != mcommon.status_choices2.get("标签打印"):
                        continue
                    cur_avail_goods_index = cur_avail_goods_index + 1
                    cur_row = cur_row + 1
                    # order_goods = order.orderGoods
                    sheet.write(cur_row, 0, order.consignee_name)
                    if order_goods_avail_counts > 1:
                        tem_str = str(order_goods_avail_counts) + "-" + str(cur_avail_goods_index) + "-"
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

            excel_name = str(today_date) + '.xls'
            excel_path = settings.TEMP_FILE_DIRS + "/bk/" + excel_name
            excel_url = mglobal.STATIC_URL_BK+"/back" + settings.STATIC_URL + "temp/bk/" + excel_name

            # 保存之前把之前生成的文件都删除了 以免时间长了存留太多文件
            file_list = mfile_utils.get_file_list(settings.TEMP_FILE_DIRS + "/bk/")
            for file in file_list:
                mfile_utils.delete_file(settings.TEMP_FILE_DIRS + "/bk/"+file)
            if mfile_utils.create_dir(excel_path):
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
        order_number_list = request.data.get("order_number_list")
        try:
            with transaction.atomic():
                ip = mIP_utils.get_windows_local_ip()
                # 实例化一个Workbook()对象(即excel文件)
                wbk = xlwt.Workbook()
                # 新建一个名为Sheet1的excel sheet。此处的cell_overwrite_ok =True是为了能对同一个单元格重复操作。
                sheet = wbk.add_sheet('Sheet1', cell_overwrite_ok=True)
                # 获取当前日期，得到一个datetime对象如：(2016, 8, 9, 23, 12, 23, 424000)
                today = datetime.today()
                # 将获取到的datetime对象仅取日期如：2016-8-9
                # today_date = datetime.date(today)
                today_date = mtime.stamp_to_time(time.time(), "%Y-%m-%d---%H-%M-%S")

                args = Q(Q(orderGoods__status=mcommon.status_choices2.get("标签打印")) | Q(orderGoods__status=mcommon.status_choices2.get("已付款")))  & Q(orderGoods__refund_apply_status=mcommon.refund_apply_choices2.get("无售后"))
                if order_number_list is not None:
                    order_number_list = json.loads(order_number_list)
                    args = args & Q(order_number__in=order_number_list)
                query_set = trade_models.Order.objects.filter(args).distinct().order_by('-add_time')
                # 合并第1行到第2行的第0列到第3列。
                sheet.write_merge(0, 0, 0, 10,"666")
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
                sheet.write(1, 10, "自定义编码")
                sheet.write(1, 11, "详细地址")
                cur_row = 1
                excel_name = str(today_date) + 'tag315.xls'
                # 保存json格式数据的文件名
                json_file_name = str(today_date) + 'tag315.json'
                # 需要导出保存的订单
                new_order_list = []
                # 文件保存地址
                excel_path = settings.TEMP_FILE_DIRS + "/bk/"
                # 文件远程访问地址
                excel_url = mglobal.STATIC_URL_BK +"/back"+ settings.STATIC_URL + "temp/bk/" + excel_name
                if len(query_set) == 0:
                    ret['code'] = "1001"
                    ret['message'] = "没有符合条件的商品"

                    file_list = mfile_utils.get_file_list(excel_path)
                    last_time_excel_url = ""
                    last_time_json_str = ""
                    for excel_name in file_list:
                        if excel_name.find('tag') != -1 and excel_name.find('xls') != -1:
                            last_time_excel_url = mglobal.STATIC_URL_BK+"/back" + settings.STATIC_URL + "temp/bk/" + excel_name

                            break
                    for json_file_name in file_list:
                        if json_file_name.find('tag') != -1 and json_file_name.find('json') != -1 :
                            json_file_path = settings.TEMP_FILE_DIRS + "/bk/" + json_file_name
                            last_time_json_str = mfile_utils.read_file_content(json_file_path)
                            print(last_time_json_str)
                            break
                    ret['last_time_excel_url'] = last_time_excel_url
                    ret['last_time_json_str'] = last_time_json_str

                    return Response(ret)
                new_order_list = []
                for i in range(len(query_set)):
                    order = query_set[i]
                    order_number = order.order_number
                    goods_query = trade_models.OrderGoods.objects.filter(order = order)
                    if self.is_continue(goods_query) is False:
                        continue

                    cur_order_row = cur_row + 1
                    new_order  = {}
                    # 将每一行的每个元素按行号i,列号j,写入到excel中
                    new_order_goods_list = []
                    consignee_address = order.consignee_address.replace("，", " ").replace("  ", " ").replace(' ','').replace( ",", " ", 3)

                    new_order['consignee_name'] = order.consignee_name
                    new_order['consignee_phone'] = order.consignee_phone
                    new_order['consignee_address'] = consignee_address
                    new_order['logistics_name'] = order.logistics_name
                    new_order['order_number'] = order_number
                    new_order['quality_testing_name'] = order.quality_testing_name
                    for j in range(len(goods_query)):
                        cur_row = cur_row + 1
                        order_goods = goods_query[j]
                        order_goods.status = mcommon.status_choices2.get("拿货中")
                        order_goods.save()

                        # order_goods = order.orderGoods
                        sheet.write(cur_row, 0, "广州")
                        sheet.write(cur_row, 1, order_goods.shop_market_name)

                        floor = order_goods.shop_floor
                        stall_no = order_goods.shop_stalls_no
                        while floor.find("楼") !=-1:
                            floor = floor.replace("楼","F")

                        while floor.find("区") !=-1:
                            floor = floor.replace("区","")
                        floor = floor[0:floor.find('F')+1]
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

                        sheet.write(cur_row, 9, order_goods.customer_message)
                        id_ = order_goods.id
                        if ip.find('172.17.1.38') != -1:
                            id_ = "r"+str(order.id)+"-"+str(order_goods.id)

                        else:
                            id_ = str(order.id) + "-" + str(order_goods.id)

                        sheet.write(cur_row, 10, id_)
                        sheet.write(cur_row, 11, consignee_address)
                        # 合并第1行到第2行的第0列到第3列。
                        sheet.write_merge(cur_order_row, cur_row, 11, 11, order.consignee_name + "，" + str(order.consignee_phone) + "，" + consignee_address)

                        # ---------------------
                        new_order_goods = {}
                        new_order_goods['shop_market_name'] = order_goods.shop_market_name
                        new_order_goods['shop_floor'] = floor
                        new_order_goods['shop_stalls_no'] = stall_no
                        new_order_goods['art_no'] = order_goods.art_no
                        new_order_goods['goods_color'] = order_goods.goods_color
                        new_order_goods['goods_count'] = order_goods.goods_count
                        new_order_goods['goods_price'] = order_goods.goods_price
                        new_order_goods['customer_message'] = order_goods.customer_message
                        new_order_goods['id'] = id_
                        new_order_goods_list.append(new_order_goods)
                        new_order["order_goods"] = new_order_goods_list
                        # ---------------------
                    new_order_list.append(new_order)
                print(new_order_list)

                # 保存之前把之前生成的文件都删除了 以免时间长了存留太多文件
                file_list = mfile_utils.get_file_list(settings.TEMP_FILE_DIRS + "/bk/")
                for file in file_list:
                    mfile_utils.delete_file(settings.TEMP_FILE_DIRS + "/bk/"+file)
                # 以传递的name+当前日期作为excel名称保存。
                wbk.save(excel_path+ excel_name)
                mfile_utils.create_file(settings.TEMP_FILE_DIRS + "/bk/"+json_file_name)
                mfile_utils.write_file(settings.TEMP_FILE_DIRS + "/bk/"+json_file_name,json.dumps(new_order_list))
                ret['excel_url'] = excel_url
                ret['json_str'] = json.dumps(new_order_list)
        except:
            traceback.print_exc()
            ret['code'] = "1001"
            ret['message'] = "生成失败"
            logger.info('%s url:%s method:%s' % (traceback.format_exc(), request.path, request.method))
        return Response(ret)

    def out_to_other_website(self, request, *args, **kwargs):

        ret = {"code": "1000", "message": ""}
        order_number_list = request.data.get("order_number_list")
        try:
            with transaction.atomic():
                ip = mIP_utils.get_windows_local_ip()

                # 实例化一个Workbook()对象(即excel文件)
                wbk = xlwt.Workbook()
                # 新建一个名为Sheet1的excel sheet。此处的cell_overwrite_ok =True是为了能对同一个单元格重复操作。
                sheet = wbk.add_sheet('Sheet1', cell_overwrite_ok=True)
                # 获取当前日期，得到一个datetime对象如：(2016, 8, 9, 23, 12, 23, 424000)
                today = datetime.today()
                # 将获取到的datetime对象仅取日期如：2016-8-9
                # today_date = datetime.date(today)
                today_date = mtime.stamp_to_time(time.time(), "%Y-%m-%d---%H-%M-%S")

                args = Q(Q(orderGoods__status=mcommon.status_choices2.get("标签打印")) | Q(orderGoods__status=mcommon.status_choices2.get("已付款")))  & Q(orderGoods__refund_apply_status=mcommon.refund_apply_choices2.get("无售后"))
                if order_number_list is not None:
                    order_number_list = json.loads(order_number_list)
                    args = args & Q(order_number__in=order_number_list)
                order_query_set = trade_models.Order.objects.select_for_update().filter(args).distinct().order_by('-add_time')
                # 合并第1行到第2行的第0列到第3列。
                sheet.write_merge(0, 0, 0, 10,"666")
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
                sheet.write(1, 10, "自定义编码")
                sheet.write(1, 11, "详细地址")
                cur_row = 1
                excel_name = str(today_date) + 'tag315.xls'
                # 保存json格式数据的文件名
                json_file_name = str(today_date) + 'tag315.json'
                # 需要导出保存的订单
                new_order_list = []
                # 文件保存地址
                excel_path = settings.TEMP_FILE_DIRS + "/bk/"
                # 文件远程访问地址
                excel_url = mglobal.STATIC_URL_BK+"/back" + settings.STATIC_URL + "temp/bk/" + excel_name
                if len(order_query_set) == 0:
                    ret['code'] = "1001"
                    ret['message'] = "没有符合条件的商品"

                    file_list = mfile_utils.get_file_list(excel_path)
                    last_time_excel_url = ""
                    last_time_json_str = ""
                    for excel_name in file_list:
                        if excel_name.find('tag') != -1 and excel_name.find('xls') != -1:
                            last_time_excel_url = mglobal.STATIC_URL_BK+"/back" + settings.STATIC_URL + "temp/bk/" + excel_name

                            break
                    for json_file_name in file_list:
                        if json_file_name.find('tag') != -1 and json_file_name.find('json') != -1 :
                            json_file_path = settings.TEMP_FILE_DIRS + "/bk/" + json_file_name
                            last_time_json_str = mfile_utils.read_file_content(json_file_path)
                            print(last_time_json_str)
                            break
                    ret['last_time_excel_url'] = last_time_excel_url
                    ret['last_time_json_str'] = last_time_json_str

                    return Response(ret)
                new_order_list = []
                for i in range(len(order_query_set)):
                    order = order_query_set[i]
                    order_number = order.order_number
                    goods_query = trade_models.OrderGoods.objects.filter(order = order)
                    if self.is_continue(goods_query) is False:
                        continue

                    cur_order_row = cur_row + 1
                    new_order  = {}
                    # 将每一行的每个元素按行号i,列号j,写入到excel中
                    new_order_goods_list = []
                    consignee_address = order.consignee_address.replace("，", " ").replace("  ", " ").replace(' ','').replace( ",", " ", 3)

                    new_order['consignee_name'] = order.consignee_name
                    new_order['consignee_phone'] = order.consignee_phone
                    new_order['consignee_address'] = consignee_address
                    new_order['logistics_name'] = order.logistics_name
                    new_order['order_number'] = order_number
                    new_order['quality_testing_name'] = order.quality_testing_name
                    for j in range(len(goods_query)):
                        cur_row = cur_row + 1
                        order_goods = goods_query[j]
                        order_goods.status = mcommon.status_choices2.get("拿货中")
                        order_goods.save()

                        # order_goods = order.orderGoods
                        sheet.write(cur_row, 0, "广州")
                        sheet.write(cur_row, 1, order_goods.shop_market_name)

                        floor = order_goods.shop_floor
                        stall_no = order_goods.shop_stalls_no
                        print("floor_befor:",floor)
                        while floor.find("楼") !=-1:
                            floor = floor.replace("楼","F")

                        # while floor.find("区") !=-1:
                        #     floor = floor.replace("区","")
                        while floor.find("f") != -1:
                            floor = floor.replace("f", "F")
                        # floor = floor[0:floor.find('F')+1]
                        import re
                        reg_ = '^[0-9]F'
                        result = re.match(reg_, stall_no)
                        print("floor_after:", floor)
                        if result is not  None:
                            stall_no = stall_no.replace(result[0],"")
                        sheet.write(cur_row, 2, floor)
                        sheet.write(cur_row, 3, stall_no)
                        sheet.write(cur_row, 4, order_goods.art_no)
                        sheet.write(cur_row, 5, order_goods.goods_color)
                        sheet.write(cur_row, 6, order_goods.goods_count)
                        sheet.write(cur_row, 7, order_goods.goods_price)
                        sheet.write(cur_row, 8, order_goods.image_url)

                        sheet.write(cur_row, 9, order_goods.customer_message)
                        id_ = order_goods.id


                        if ip.find('172.17.1.38') != -1:
                            id_ = "r"+str(order.id)+"-"+str(order_goods.id)

                        else:
                            id_ = str(order.id) + "-" + str(order_goods.id)

                        sheet.write(cur_row, 10, id_)
                        sheet.write(cur_row, 11, consignee_address)
                        sheet.write(cur_row, 12, order_goods.tb_goods_id)
                        # 合并第1行到第2行的第0列到第3列。
                        sheet.write_merge(cur_order_row, cur_row, 11, 11, order.consignee_name + "，" + str(order.consignee_phone) + "，" + consignee_address)

                        # ---------------------
                        new_order_goods = {}
                        new_order_goods['shop_market_name'] = order_goods.shop_market_name
                        new_order_goods['shop_floor'] = floor
                        new_order_goods['shop_stalls_no'] = stall_no
                        new_order_goods['art_no'] = order_goods.art_no
                        new_order_goods['goods_color'] = order_goods.goods_color
                        new_order_goods['goods_count'] = order_goods.goods_count
                        new_order_goods['goods_price'] = order_goods.goods_price
                        new_order_goods['image_url'] = order_goods.image_url
                        new_order_goods['customer_message'] = order_goods.customer_message

                        new_order_goods['id'] = id_
                        new_order_goods['tb_goods_id'] = order_goods.tb_goods_id
                        new_order_goods_list.append(new_order_goods)
                        new_order["order_goods"] = new_order_goods_list
                        print("last:", new_order_goods['shop_floor'])
                        # ---------------------
                    order.tag_type = 1
                    order.save()
                    new_order_list.append(new_order)


                # 保存之前把之前生成的文件都删除了 以免时间长了存留太多文件
                file_list = mfile_utils.get_file_list(settings.TEMP_FILE_DIRS + "/bk/")
                for file in file_list:
                    mfile_utils.delete_file(settings.TEMP_FILE_DIRS + "/bk/"+file)
                # 以传递的name+当前日期作为excel名称保存。
                wbk.save(excel_path+ excel_name)
                mfile_utils.create_file(settings.TEMP_FILE_DIRS + "/bk/"+json_file_name)
                mfile_utils.write_file(settings.TEMP_FILE_DIRS + "/bk/"+json_file_name,json.dumps(new_order_list))
                ret['excel_url'] = excel_url
                ret['json_str'] = json.dumps(new_order_list)
                print("out_putdata:",json.dumps(new_order_list))
        except:
            traceback.print_exc()
            ret['code'] = "1001"
            ret['message'] = "生成失败"
            logger.info('%s url:%s method:%s' % (traceback.format_exc(), request.path, request.method))
        return Response(ret)


    def is_continue(self,goods_query):
        for j in range(len(goods_query)):
            order_goods = goods_query[j]
            if order_goods.status != mcommon.status_choices2.get("标签打印") and order_goods.status != mcommon.status_choices2.get("已付款"):
                return False
        return True

    # 统计一个订单有效标签打印的商品数量
    def get_curr_order_avail_tag_goods_count(self,order_goods_query):
        avail_counts = 0
        for order_goods in order_goods_query:
            if order_goods.status == mcommon.status_choices2.get("标签打印") and order_goods.refund_apply_status == mcommon.refund_apply_choices2.get("无售后"):
                avail_counts = avail_counts + 1
        return avail_counts


# 输出付款状态的空包订单 同时修改为快递打印状态
class OutPutNullOrderView(APIView):
    authentication_classes = [BackStageAuthentication,]
    permission_classes = [Superpermission]

    def post(self, request, *args, **kwargs):
        try:
            ret = {"code": "1000", "message": ""}
            data = request.data

            if data.get("for") == "logistics_print":
                return self.out_to_print(request, args, kwargs, data.get("for"))
        except:
            print(traceback.print_exc())
            traceback.print_exc()
            ret['code'] = "1001"
            ret['message'] = "导出失败"
            logger.info('%s url:%s method:%s' % (traceback.format_exc(), request.path, request.method))
        return Response(ret)

    def out_to_print(self,request, args, kwargs, condition):
        ret = {"code": "1000", "message": ""}

        args = Q(order_status=mcommon.null_package_order_status_choices2.get("已付款"))
        try:
            with transaction.atomic():
                order_list = []
                query_set = trade_models.NullPackageOrder.objects.select_for_update().filter(args).distinct().order_by('-add_time')[0:5]
                for i in range(len(query_set)):
                    order = query_set[i]
                    order.order_status = mcommon.null_package_order_status_choices2['快递打印']
                    order.tag_type = 1
                    order.save()
                    order_dict = model_to_dict(order)
                    order_list.append(order_dict)
                ret['results'] = order_list
        except:
            traceback.print_exc()
            ret['code'] = "1001"
            ret['message'] = "生成失败"
            logger.info('%s url:%s method:%s' % (traceback.format_exc(), request.path, request.method))
        return Response(ret)


class OutputNullOrderOtherSiteSuccessView(APIView):
    authentication_classes = [BackStageAuthentication,]
    permission_classes = [Superpermission]

    def post(self, request, *args, **kwargs):
        try:
            ret = {"code": "1000", "message": ""}
            data = request.data
            order_id_list = json.loads(data.get("order_id_list"))
            with transaction.atomic():
                qs = trade_models.NullPackageOrder.objects.select_for_update().filter(id__in=order_id_list)
                for order in qs:
                    order.tag_type = None
                    order.save()
            ret['message'] = "提交成功"


        except:

            traceback.print_exc()
            ret['code'] = "1001"
            ret['message'] = "提交失败"
            logger.info('%s url:%s method:%s' % (traceback.format_exc(), request.path, request.method))
        return Response(ret)



class OutputNullOrderOtherSiteExceptionView(APIView):
    authentication_classes = [BackStageAuthentication,]
    permission_classes = [Superpermission]

    def post(self, request, *args, **kwargs):
        try:
            ret = {"code": "1000", "message": ""}
            data = request.data
            exception_order_id_list = json.loads(data.get("exception_order_id_list"))
            with transaction.atomic():
                qs = trade_models.NullPackageOrder.objects.select_for_update().filter(id__in=exception_order_id_list)
                for order in qs:
                    if order.order_status == mcommon.null_package_order_status_choices2['快递打印'] and order.tag_type == 1:
                        order.tag_type = None
                        order.order_status = mcommon.null_package_order_status_choices2['已付款']
                        order.save()
            ret['message'] = "提交成功"
        except:
            traceback.print_exc()
            ret['code'] = "1001"
            ret['message'] = "提交失败"
            logger.info('%s url:%s method:%s' % (traceback.format_exc(), request.path, request.method))
        return Response(ret)


# 导入到其他网站异常订单时候调用此接口
class OutputOrderOtherSiteExceptionView(APIView):
    authentication_classes = [BackStageAuthentication,]
    permission_classes = [Superpermission]

    def post(self, request, *args, **kwargs):
        try:
            ret = {"code": "1000", "message": ""}
            data = request.data
            exception_order_number_list = json.loads(data.get("exception_order_number_list"))
            ret_exception_order_list =  []
            with transaction.atomic():
                qs = trade_models.Order.objects.select_for_update().filter(order_number__in=exception_order_number_list)
                for order in qs:
                    order_goods_qs = trade_models.OrderGoods.select_for_update().finter(order = order)
                    for order_goods in order_goods_qs:

                        if order_goods.status == mcommon.status_choices2['拿货中'] :
                            if order_goods.refund_apply_status == mcommon.refund_apply_choices2["无售后"]:
                                order_goods.status = mcommon.status_choices2['已付款']
                                order_goods.save()
                            else:
                                return
            ret['message'] = "提交成功"
        except:
            traceback.print_exc()
            ret['code'] = "1001"
            ret['message'] = "提交失败"
            logger.info('%s url:%s method:%s' % (traceback.format_exc(), request.path, request.method))
        return Response(ret)


class OutputOrderOtherSiteSuccessView(APIView):
    authentication_classes = [BackStageAuthentication,]
    permission_classes = [Superpermission]

    def post(self, request, *args, **kwargs):
        try:
            ret = {"code": "1000", "message": ""}
            data = request.data
            order_number_list = json.loads(data.get("order_number_list"))
            with transaction.atomic():
                qs = trade_models.Order.objects.select_for_update().filter(order_number__in=order_number_list)
                for order in qs:
                    order.tag_type = None
                    order.save()
            ret['message'] = "提交成功"

        except:
            print(traceback.print_exc())
            traceback.print_exc()
            ret['code'] = "1001"
            ret['message'] = "提交失败"
            logger.info('%s url:%s method:%s' % (traceback.format_exc(), request.path, request.method))
        return Response(ret)






class OrderGoodsViewSet(mixins.UpdateModelMixin,GenericViewSet):
    authentication_classes = [BackStageAuthentication, BackStageNahuoAuthentication]
    permission_classes = [NahuoUserpermission]
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
    serializer_class = m_serializers.tTradeOrderQuerySerializer

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


class CommonPagination(PageNumberPagination):
    # 指定每一页的个数
    page_size = 20
    # 可以让前端来设置page_szie参数来指定每页个数
    page_size_query_param = 'page_size'
    # 设置页码的参数
    page_query_param = 'page'


class OrderViewSet(mixins.ListModelMixin,mixins.UpdateModelMixin, GenericViewSet):
        authentication_classes = [BackStageAuthentication, ]
        permission_classes = [permission.Superpermission,]
        serializer_class = bserializers.BackTradeOrderQuerySerializer
        # 设置分页的class
        pagination_class = CommonPagination

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
            order_by = ["-add_time"]
            default_query_keys = self.request.query_params.get("q")
            status_filter = self.request.query_params.get("status")
            user_name_query = self.request.query_params.get("user_name")
            during_time = self.request.query_params.get("during_time")
            order_follower_user_name = self.request.query_params.get("order_follower_user_name")
            market_full = self.request.query_params.get("market_full")
            order_by_params = self.request.query_params.get("order_by")
            print("query_keys")
            print(order_by_params)
            args = Q()
            if order_by_params is not None:
                if order_by_params == "update_time" :
                    order_by = ["-update_time","-add_time"]
                elif order_by_params == "goods":
                    order_by = ["orderGoods__tb_goods_id", "-add_time"]
            if during_time is not None:
                if during_time.find('/') != -1:
                    time_arr = during_time.split('/')
                    start_time_str = time_arr[0].strip()
                    end_time_str = time_arr[1].strip()
                    print(start_time_str)
                    print(end_time_str)

                    start_stamp = mtime.get_time_stamp13(start_time_str+" 00:00:00.000")
                    end_stamp = mtime.get_time_stamp13(end_time_str+" 00:00:00.000") + 24 * 60 * 60 * 1000  # 下一天 毫秒级时间戳
                    args = args & Q(add_time__gte=start_stamp ) & Q(add_time__lt=end_stamp)
                else:
                    start_stamp = mtime.get_time_stamp13(during_time.strip() + " 00:00:00.000")
                    end_stamp = mtime.get_time_stamp13( during_time.strip() + " 00:00:00.000") + 24 * 60 * 60 * 1000  # 下一天 毫秒级时间戳
                    args = args & Q(add_time__gte=start_stamp) & Q(add_time__lt=end_stamp)
            if default_query_keys is not None:

                query_keys_args = Q(order_number=default_query_keys) | Q(consignee_name__contains=default_query_keys) | Q(logistics_number=default_query_keys) | Q(tb_order_number=default_query_keys)
                # 手机字段为数字 用字符查询会报错
                if default_query_keys.isdigit():
                    query_keys_args = query_keys_args | Q(consignee_phone=default_query_keys)
                    if len(query_keys_args) < 10:
                        query_keys_args = query_keys_args | Q(id=default_query_keys)
                args = args & query_keys_args
                # return trade_models.Order.objects.filter(args).order_by('-add_time')
            if status_filter is not None:
                args = args & Q(orderGoods__status=status_filter)
                # return trade_models.Order.objects.filter(args).distinct().order_by( "-add_time")
            if user_name_query is not None:
                args = args & Q(order_owner__user_name=user_name_query)
                # return trade_models.Order.objects.filter(args).distinct().order_by( "-add_time")
            if order_follower_user_name is not None:
                args = args & Q(order_follower__user_name=order_follower_user_name)
                # return trade_models.Order.objects.filter(args).distinct().order_by( "-add_time")
            if market_full is not None:
                market_full = json.loads(market_full)
                shop_market_name = market_full.get('shop_market_name')
                shop_floor = market_full.get('shop_floor')
                shop_stalls_no = market_full.get('shop_stalls_no')
                art_no = market_full.get('art_no')
                tb_goods_id = market_full.get('tb_goods_id')
                args = args & Q(orderGoods__shop_market_name__contains=shop_market_name) & Q(orderGoods__shop_floor__contains=shop_floor) & Q(orderGoods__shop_stalls_no__contains=shop_stalls_no) & Q(orderGoods__art_no__contains=art_no)& Q(orderGoods__tb_goods_id__contains=tb_goods_id)
                # return trade_models.Order.objects.filter(args).distinct().order_by( "-add_time")


            return trade_models.Order.objects.filter(args).distinct().order_by(*order_by)


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
                print(traceback.print_exc())
                print(serializer.error)

                ret = {"code": "1001", "message": "更改失败"}
                logger.info('%s url:%s method:%s' % (traceback.format_exc(), request.path, request.method))
                return Response(ret)

            ret['code'] = "1000"
            ret['message'] = "更新成功"
            ret['data'] = serializer.data
            return Response(ret)

        def get_serializer_class(self):
            if self.action == "retrieve":
                return m_serializers.tTradeOrderQuerySerializer
            elif self.action == "create":
                return m_serializers.tTradeOrderQuerySerializer
            elif self.action == "update":
                return m_serializers.tTradeOrderQuerySerializer
            elif self.action == "delete":
                return m_serializers.tTradeOrderQuerySerializer

            return bserializers.BackTradeOrderQuerySerializer

        def get_object(self):
            return self.request.user


class NullOrderViewSet(mixins.ListModelMixin, mixins.UpdateModelMixin, GenericViewSet):
    authentication_classes = [BackStageAuthentication, ]
    permission_classes = [permission.Superpermission, ]
    serializer_class = bserializers.BackTradeNullOrderQuerySerializer
    # 设置分页的class
    pagination_class = CommonPagination

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
        default_query_keys = self.request.query_params.get("q")
        status_filter = self.request.query_params.get("status")
        user_name_query = self.request.query_params.get("user_name")
        during_time = self.request.query_params.get("during_time")
        seller_wangwang_id = self.request.query_params.get("seller_wangwang_id")
        status_filter_list_str = self.request.query_params.get("status_list")

        print("query_keys")
        print(default_query_keys)
        args = Q()
        if during_time is not None:
            if during_time.find('/') != -1:
                time_arr = during_time.split('/')
                start_time_str = time_arr[0].strip()
                end_time_str = time_arr[1].strip()

                start_stamp = mtime.get_time_stamp13(start_time_str + " 00:00:00.000")
                end_stamp = mtime.get_time_stamp13(end_time_str + " 00:00:00.000") + 24 * 60 * 60 * 1000  # 下一天 毫秒级时间戳
                args = args & Q(add_time__gte=start_stamp) & Q(add_time__lt=end_stamp)
            else:
                start_stamp = mtime.get_time_stamp13(during_time.strip() + " 00:00:00.000")
                end_stamp = mtime.get_time_stamp13(
                    during_time.strip() + " 00:00:00.000") + 24 * 60 * 60 * 1000  # 下一天 毫秒级时间戳
                args = args & Q(add_time__gte=start_stamp) & Q(add_time__lt=end_stamp)
        if seller_wangwang_id is not None:
            args = args & Q(tb_seller_wangwang_id=seller_wangwang_id)
        if default_query_keys is not None:

            query_keys_args = Q(order_number=default_query_keys) | Q(consignee_name__contains=default_query_keys) | Q(
                logistics_number=default_query_keys)
            # 手机字段为数字 用字符查询会报错
            if default_query_keys.isdigit():
                query_keys_args = query_keys_args | Q(consignee_phone=default_query_keys)
                if len(query_keys_args) < 10:
                    query_keys_args = query_keys_args | Q(id=default_query_keys)
            args = args & query_keys_args
            # return trade_models.Order.objects.filter(args).order_by('-add_time')
        if status_filter is not None:
            args = args & Q(order_status=status_filter)
            # return trade_models.Order.objects.filter(args).distinct().order_by( "-add_time")
        elif status_filter_list_str is not None:
            status_filter_list = status_filter_list_str.split(',')
            args = Q()
            for status2 in status_filter_list:
                args = args | Q(order_status=status2)

        if user_name_query is not None:
            args = args & Q(order_owner__user_name=user_name_query)
            # return trade_models.Order.objects.filter(args).distinct().order_by( "-add_time")

        return trade_models.NullPackageOrder.objects.filter(args).distinct().order_by("-add_time")

    def update(self, request, *args, **kwargs):
        ret = {"code": "1000", "message": ""}
        try:
            order_id = kwargs.get("pk")
            partial = True
            instance = trade_models.NullPackageOrder.objects.filter(id=order_id).first()
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

        ret['code'] = "1000"
        ret['message'] = "更新成功"
        ret['data'] = serializer.data
        return Response(ret)



    def get_object(self):
        return self.request.user


class DiscountCardViewSet(mixins.ListModelMixin, mixins.UpdateModelMixin,mixins.DestroyModelMixin, GenericViewSet):
    authentication_classes = [BackStageAuthentication, ]
    permission_classes = [permission.Superpermission, ]
    serializer_class = bserializers.BackDiscountCardQuerySerializer
    # 设置分页的class
    pagination_class = CommonPagination

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
            ret = {"code": "1001", "message": "获取数据失败"}
            logger.info('%s url:%s method:%s' % (traceback.format_exc(), request.path, request.method))
            return Response(ret)

    def get_queryset(self):
        print(self.request.query_params)
        query_keys = self.request.query_params.get("user_name")
        print("query_keys")
        print(query_keys)
        if query_keys is not None:
            return trade_models.DiscountCard.objects.filter(user__user_name=query_keys).order_by('-add_time')
        else:
            return trade_models.DiscountCard.objects.all().order_by('-add_time')

    def update(self, request, *args, **kwargs):
        ret = {"code": "1000", "message": ""}
        try:
            discount_card_id = kwargs.get("pk")
            partial = True
            instance = trade_models.DiscountCard.objects.filter(id=discount_card_id).first()
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

        ret['code'] = "1000"
        ret['message'] = "更新成功"
        ret['data'] = serializer.data
        return Response(ret)

    def destroy(self, request, *args, **kwargs):
        ret = {"code": "1000", "message": ""}
        print(kwargs.get("pk"))
        try:
            ret = {"code": "1000", "message": ""}
            discount_card_id = kwargs.get("pk")
            trade_models.DiscountCard.objects.filter(id=discount_card_id).delete()
        except:
            print(traceback.print_exc())
            ret['code'] = "1001"
            ret['message'] = "删除失败"
        return Response(ret)

    def get_object(self):
        return self.request.user


class UserViewSet(mixins.ListModelMixin, mixins.UpdateModelMixin,mixins.DestroyModelMixin, GenericViewSet):
    authentication_classes = [BackStageAuthentication, ]
    permission_classes = [permission.Superpermission, ]
    serializer_class = m_serializers.UserDetailSerializer
    # 设置分页的class
    pagination_class = CommonPagination

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
            ret = {"code": "1001", "message": "获取数据失败"}
            logger.info('%s url:%s method:%s' % (traceback.format_exc(), request.path, request.method))
            return Response(ret)

    def get_queryset(self):
        print(self.request.query_params)
        query_keys = self.request.query_params.get("user_name")
        print("query_keys")
        print(query_keys)
        if query_keys is not None:
            return user_models.User.objects.filter(user_name=query_keys).order_by('-add_time')
        else:
            return user_models.User.objects.all().order_by('-add_time')

    def update(self, request, *args, **kwargs):
        ret = {"code": "1000", "message": ""}
        try:
            discount_card_id = kwargs.get("pk")
            partial = True
            instance = user_models.User.objects.filter(id=discount_card_id).first()
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

        ret['code'] = "1000"
        ret['message'] = "更新成功"
        ret['data'] = serializer.data
        return Response(ret)

    def destroy(self, request, *args, **kwargs):
        ret = {"code": "1000", "message": ""}
        print(kwargs.get("pk"))
        try:
            ret = {"code": "1000", "message": ""}
            user_id = kwargs.get("pk")
            user_models.User.objects.filter(id=user_id).delete()
        except:
            print(traceback.print_exc())
            ret['code'] = "1001"
            ret['message'] = "删除失败"
        return Response(ret)

    def get_object(self):
        return self.request.user


class AlipayAccountInfoViewSet(mixins.ListModelMixin, mixins.UpdateModelMixin,mixins.DestroyModelMixin, GenericViewSet):
    authentication_classes = [BackStageAuthentication, ]
    permission_classes = [permission.Superpermission, ]
    serializer_class = bserializers.AliPayAccountInfoQuerySerializer
    # 设置分页的class
    pagination_class = CommonPagination

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
            ret = {"code": "1001", "message": "获取数据失败"}
            logger.info('%s url:%s method:%s' % (traceback.format_exc(), request.path, request.method))
            return Response(ret)

    def get_queryset(self):
        print(self.request.query_params)
        query_keys = self.request.query_params.get("user_name")
        print("query_keys")
        print(query_keys)
        if query_keys is not None:
            return user_models.UserAlipayRealInfo.objects.filter(user__user_name=query_keys).order_by('-add_time')
        else:
            return user_models.UserAlipayRealInfo.objects.all().order_by('-add_time')

    def update(self, request, *args, **kwargs):
        ret = {"code": "1000", "message": ""}
        try:
            with transaction.atomic():
                alipay_info_id = kwargs.get("pk")
                partial = True
                user_alipay_real_info = user_models.UserAlipayRealInfo.objects.filter(id=alipay_info_id).first()
                print(user_alipay_real_info)
                update_info={
                    'check_time':time.time() *1000,
                    'check_status': request.data.get('check_status')
                }




                serializer = self.get_serializer(user_alipay_real_info, data=update_info, partial=partial)
                serializer.is_valid(raise_exception=True)
                self.perform_update(serializer)
        except:
            print(serializer.error)
            print(traceback.print_exc())
            ret = {"code": "1001", "message": "更改失败"}
            logger.info('%s url:%s method:%s' % (traceback.format_exc(), request.path, request.method))
            return Response(ret)

        ret['code'] = "1000"
        ret['message'] = "更新成功"
        ret['data'] = serializer.data
        return Response(ret)

    def destroy(self, request, *args, **kwargs):
        ret = {"code": "1000", "message": ""}
        print(kwargs.get("pk"))
        try:
            ret = {"code": "1000", "message": ""}
            alipay_info_id = kwargs.get("pk")
            user_models.UserAlipayRealInfo.objects.filter(id=alipay_info_id).delete()
        except:
            print(traceback.print_exc())
            ret['code'] = "1001"
            ret['message'] = "删除失败"
        return Response(ret)


class InviteRegisterInfoViewSet(mixins.ListModelMixin, mixins.UpdateModelMixin,mixins.DestroyModelMixin, GenericViewSet):
    authentication_classes = [BackStageAuthentication, ]
    permission_classes = [permission.Superpermission, ]
    serializer_class = bserializers.InviteRegisterInfoQuerySerializer
    # 设置分页的class
    pagination_class = CommonPagination

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
            ret = {"code": "1001", "message": "获取数据失败"}
            logger.info('%s url:%s method:%s' % (traceback.format_exc(), request.path, request.method))
            return Response(ret)

    def get_queryset(self):
        print(self.request.query_params)
        # 邀请人 用户名
        inviter_user_name = self.request.query_params.get("user_name")
        print("query_keys")
        print(inviter_user_name)
        if inviter_user_name is not None:
            return user_models.InviteRegisterInfo.objects.filter(inviter__user_name=inviter_user_name).order_by('-add_time')
        else:
            return user_models.InviteRegisterInfo.objects.all().order_by('-add_time')

    def destroy(self, request, *args, **kwargs):
        ret = {"code": "1000", "message": ""}
        print(kwargs.get("pk"))
        try:
            ret = {"code": "1000", "message": ""}
            invite_reg_info_id = kwargs.get("pk")
            user_models.InviteRegisterInfo.objects.filter(id=invite_reg_info_id).delete()
        except:
            print(traceback.print_exc())
            ret['code'] = "1001"
            ret['message'] = "删除失败"
        return Response(ret)


class ReturnPackageInfoViewSet(mixins.ListModelMixin, mixins.UpdateModelMixin,mixins.DestroyModelMixin, GenericViewSet):
    authentication_classes = [BackStageAuthentication, ]
    permission_classes = [permission.Superpermission, ]
    serializer_class = bserializers.ReturnPackageInfoQuerySerializer
    # 设置分页的class
    pagination_class = CommonPagination

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
            ret = {"code": "1001", "message": "获取数据失败"}
            logger.info('%s url:%s method:%s' % (traceback.format_exc(), request.path, request.method))
            return Response(ret)

    def get_queryset(self):
        print(self.request.query_params)

        logistics_number = self.request.query_params.get("logistics_number")
        print("query_keys")
        print(logistics_number)
        if logistics_number is not None:
            return trade_models.ReturnPackageInfo.objects.filter(return_logistics_number=logistics_number).order_by('-add_time')
        else:
            return trade_models.ReturnPackageInfo.objects.all().order_by('-add_time')

    def destroy(self, request, *args, **kwargs):
        ret = {"code": "1000", "message": ""}
        print(kwargs.get("pk"))
        try:
            ret = {"code": "1000", "message": ""}
            id_ = kwargs.get("pk")
            trade_models.ReturnPackageInfo.objects.filter(id=id_).delete()
        except:
            print(traceback.print_exc())
            ret['code'] = "1001"
            ret['message'] = "删除失败"
        return Response(ret)


class TaskThreadViewSet(mixins.CreateModelMixin,mixins.ListModelMixin, mixins.UpdateModelMixin,mixins.DestroyModelMixin, GenericViewSet):
    authentication_classes = [BackStageAuthentication, ]
    permission_classes = [permission.Superpermission, ]
    serializer_class = bserializers.TaskThreadQuerySerializer
    # 设置分页的class
    pagination_class = CommonPagination

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
            ret = {"code": "1001", "message": "获取数据失败"}
            logger.info('%s url:%s method:%s' % (traceback.format_exc(), request.path, request.method))
            return Response(ret)

    def get_queryset(self):
        print(self.request.query_params)

        logistics_number = self.request.query_params.get("task_name")

        if logistics_number is not None:
            return back_models.ThreadTask.objects.filter(task_name=logistics_number).order_by('-add_time')
        else:
            return back_models.ThreadTask.objects.all().order_by('-add_time')

    def destroy(self, request, *args, **kwargs):
        ret = {"code": "1000", "message": ""}
        print(kwargs.get("pk"))
        try:
            ret = {"code": "1000", "message": ""}
            id_ = kwargs.get("pk")
            back_models.ThreadTask.objects.filter(id=id_).delete()
        except:
            print(traceback.print_exc())
            ret['code'] = "1001"
            ret['message'] = "删除失败"
        return Response(ret)

    def update(self, request, *args, **kwargs):
            ret = {"code": "1000", "message": ""}
            try:
                id_ = kwargs.get("pk")
                partial = True
                instance = back_models.ThreadTask.objects.filter(id=id_).first()
                print(instance)
                serializer = self.get_serializer(instance, data=request.data, partial=partial)
                serializer.is_valid(raise_exception=True)
                self.perform_update(serializer)
            except:
                print(traceback.print_exc())
                print(serializer.error)

                ret = {"code": "1001", "message": "更改失败"}
                logger.info('%s url:%s method:%s' % (traceback.format_exc(), request.path, request.method))
                return Response(ret)

            ret['code'] = "1000"
            ret['message'] = "更新成功"
            ret['data'] = serializer.data
            return Response(ret)

    def create(self, request, *args, **kwargs):
        ret = {"code": "1000", "message": ""}
        try:
            with transaction.atomic():
                # 得请求数据然后得到序列化对象  得到的是上面serializer_class对象模型
                serializer = self.get_serializer(data=request.data)
                # 进行数据校验
                serializer.is_valid(raise_exception=True)
                task = self.perform_create(serializer)
                ret_dict = serializer.data


        except:
            print(traceback.print_exc())


            ret = {"code": "1001", "message": "保存失败"}
            logger.info('%s url:%s method:%s' % (traceback.format_exc(), request.path, request.method))
        return Response(ret)


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
    pagination_class = CommonPagination

    def list(self, request, *args, **kwargs):
        self.serializer_class = m_serializers.tTradeOrderQuerySerializer

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
                    order_owner =  user_models.User.objects.select_for_update().filter(id =order_goods.order.order_owner.id ).first()
                    # 申请退货数量不能大于下单的数量
                    if refund_apply_obj.goods_counts > order_goods.goods_count:
                        raise Exception
                    trade_moneys = order_goods.goods_price * refund_apply_obj.goods_counts
                    self.log_user_pay_info(order_goods,order_goods.order,trade_moneys,"商品退货退款：","")
                    order_owner.balance = order_owner.balance + trade_moneys
                    order_owner.save()
                    refund_apply_obj.refund_apply_progress = mcommon.refund_apply_progress_choices2['已退货退款']
                    refund_apply_obj.save()
                    # refund_apply_obj.delete()
            elif refund_apply_obj.refund_apply_type == mcommon.refund_apply_choices2.get("拦截发货"):
                with transaction.atomic():
                    cur_order_goods = trade_models.OrderGoods.objects.filter(id=refund_apply_obj.orderGoods_id).first()
                    # 退回快递费
                    return_logistics_fee = self.is_return_logistics_fee(cur_order_goods.order,cur_order_goods)
                    logistics_name = refund_apply_obj.return_logistics_name
                    logistics_num = refund_apply_obj.return_logistics_number
                    order_goods = trade_models.OrderGoods.objects.filter(id=refund_apply_obj.orderGoods_id).first()
                    order_goods.status = mcommon.status_choices2.get("已退款")
                    # order_goods.refund_apply_status = mcommon.refund_apply_choices2.get("无售后")
                    order_goods.return_logistics_name = logistics_name
                    order_goods.return_logistics_number = logistics_num
                    order_goods.save()
                    order_owner = order_goods.order.order_owner
                    order_owner = user_models.User.objects.select_for_update().filter(id=order_owner.id).first()
                    # 申请退货数量不能大于下单的数量
                    if refund_apply_obj.goods_counts > order_goods.goods_count:
                        raise Exception

                    logistics_fee = return_logistics_fee
                    goods_moneys =  Decimal(str(order_goods.goods_price)) * Decimal(str(refund_apply_obj.goods_counts))
                    trade_moneys = goods_moneys + Decimal(str(logistics_fee))
                    self.log_user_pay_info(order_goods, order_goods.order, trade_moneys, "拦截发货审核通过 ","商品费用："+str(goods_moneys)+" 物流费：" + str(logistics_fee))
                    order_owner.balance = Decimal(str(order_owner.balance)) + Decimal(str(trade_moneys))
                    order_owner.save()
                    is_return_lanjie_fee = bool(request._request.GET.get('is_return_lanjie_fee'))

                    if is_return_lanjie_fee is True:
                        # 退回拦截支付费用
                        return_lanjie_money = refund_apply_obj.goods_counts * String.SERVER_FEE
                        self.return_lanjie_fee(order_owner,order_goods,return_lanjie_money)
                    # refund_apply_obj.delete()

        except:
            print(traceback.print_exc())
            ret['code'] = "1001"
            ret['message'] = "更改失败"
        return Response(ret)

#
    def return_lanjie_fee(self, order_owner, order_goods,return_lanjie_money):

        data = {
            "user": order_owner,
            "trade_number": trade_utils.get_trade_number(self, order_owner.id),
            "trade_source": mcommon.trade_source_choices2.get("其他费用"),
            "cash_in_out_type": mcommon.cash_in_out_type_choices2.get("收入"),
            "user_balance": order_owner.balance,
            "add_time": time.time() * 1000,
            "trade_money": return_lanjie_money,
            "is_pass": True,
            "message": "退回拦截发货费用，订单编号：" + order_goods.order.order_number + " 商品编号：" + order_goods.goods_number,
        }
        order_owner.balance = Decimal(order_owner.balance) - Decimal(return_lanjie_money)
        data['user_balance'] = order_owner.balance
        trade_info = trade_models.TradeInfo.objects.create(**data)
        order_owner.save()


    # 是否退 快递费
    def is_return_logistics_fee(self, order, cur_order_goods):
        # 这个函数只适合拦截退款款类型
        order_goods_queryset = trade_models.OrderGoods.objects.filter(order = order)
        # 只有一个商品 进行退运费
        if len(order_goods_queryset) == 1 and order_goods_queryset[0].goods_number == cur_order_goods.goods_number:
            return order.logistics_fee
        sql_active_goods_counts = 0  # 有效商品数量
        for order_goods in order_goods_queryset:
            # 订单有已发货状态的商品就不能退运费
            if order_goods.status == mcommon.status_choices2.get("已发货"):
                return 0.0
            if order_goods.status != mcommon.status_choices2.get('待付款')  and order_goods.status != mcommon.status_choices2.get('已退款')  and order_goods.status != mcommon.status_choices2.get('已取消'):
                sql_active_goods_counts = Decimal(str(sql_active_goods_counts)) + Decimal(str(order_goods.goods_count))
        # 剩余有效商品
        after_change_active_goods_counts = sql_active_goods_counts - cur_order_goods.goods_count
        if after_change_active_goods_counts == 0:
            return_logistics_fee = order.logistics_fee
        elif after_change_active_goods_counts > String.FIRST_WEIGHT :
                return_logistics_fee = cur_order_goods.goods_count * 3
        elif after_change_active_goods_counts < String.FIRST_WEIGHT + 1 :
            return_logistics_fee = Decimal(str(order.logistics_fee)) - Decimal(str(user_utils.get_user_logistics_after_discount_price(self,order.logistics_name)))


        return return_logistics_fee

    def log_user_pay_info(self,order_goods,order,trade_moneys,ex_message_start,message_end):
        order_owner_balance = Decimal(str(order.order_owner.balance)) + Decimal(str(trade_moneys))
        message = ex_message_start+ "  订单编号："+order.order_number +" 商品编号："+order_goods.goods_number +"" +message_end
        trade_models.TradeInfo.objects.create(user = order.order_owner,
                                              trade_number=trade_utils.get_trade_number(self,self.request.user.id),
                                              user_balance=order_owner_balance,
                                              trade_source=mcommon.trade_source_choices2.get("商品"),
                                              message=message,
                                              cash_in_out_type=mcommon.cash_in_out_type_choices2.get("收入"),
                                              trade_money=trade_moneys,
                                              is_pass=True,
                                              add_time=time.time()*1000)

    def get_queryset(self,):
        default_query_keys = self.request.query_params.get("q")
        status_filter = self.request.query_params.get("status")
        user_name_query = self.request.query_params.get("user_name")
        args= Q(orderGoods__refund_apply_status=mcommon.refund_apply_choices2.get("退货退款")) | Q(
            orderGoods__refund_apply_status=mcommon.refund_apply_choices2.get("换货")) | Q(
            orderGoods__refund_apply_status=mcommon.refund_apply_choices2.get("拦截发货")) | Q(
            orderGoods__refund_apply_status=mcommon.refund_apply_choices2.get("取消订单"))
        # 不包括已退款的
        args = args & ~Q(orderGoods__status=mcommon.status_choices2.get("已退款"))

        if default_query_keys is not None:
            query_keys_args = Q(order_number=default_query_keys) | Q(consignee_name__contains=default_query_keys) | Q(logistics_number=default_query_keys) | Q(tb_order_number=default_query_keys)
            # 手机字段为数字 用字符查询会报错
            if default_query_keys.isdigit():
                query_keys_args = query_keys_args | Q(consignee_phone=default_query_keys)
                if len(query_keys_args) < 10:
                    # id 查询
                    query_keys_args = query_keys_args | Q(id=default_query_keys)
            args = args & query_keys_args

        # args = args & args_2
        return trade_models.Order.objects.filter( args).distinct().order_by("-orderGoods__refund_apply__add_time")

