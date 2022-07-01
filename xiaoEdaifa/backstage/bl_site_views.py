from rest_framework.views import APIView
from utils.auth import BackStageAuthentication,BackStageNahuoAuthentication
from utils.permission import Superpermission,NahuoUserpermission
from trade import models as trade_models
from rest_framework.response import Response
from django.db import transaction
from utils import mcommon
from utils import bl_site_utils
from utils.auth import UserAuthtication
from utils.permission import UserPermission
import json
import traceback
import logging
logger = logging.getLogger('stu')


# // 申请退货退款
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
        ret["exception_list"] = exception_order_list
        ret["success_list"] = success_order_list
        return Response(ret)



class BLGetOrderInfo(APIView):

    authentication_classes = [BackStageAuthentication, BackStageNahuoAuthentication]
    permission_classes = [NahuoUserpermission]

    def post(self, request, *args, **kwargs):
        try:
            with transaction.atomic():
                ret = {'code': "1000", 'message': ""}
                print(request.data)
                req_order_list =  json.loads(request.data.get("order_list"))

                for req_order in req_order_list:
                    order_number = req_order['order_number']
                    req_order_goods_list = req_order['order_goods_list']
                    od_number = order_number.replace("os", "")
                    if od_number is not None and od_number!='':
                        login_result = bl_site_utils.login()
                        if login_result.get("code") == 'ok':
                            page_parms = bl_site_utils.init_order_page_parms(login_result.get("cookies"))
                            params = page_parms['parms']
                            params['ctl00$ContentPlaceHolder1$txtOrderNum'] = od_number
                            params['ctl00$ContentPlaceHolder1$btnSearch'] = '查 询'
                            params['ctl00$ContentPlaceHolder1$txtPageSize'] = '20'

                            order_res = bl_site_utils.load_order_list(login_result.get("cookies"),params)
                            if order_res is not None :
                                order_info_list = order_res['order_info_list']
                                ret['code'] = "1000"
                                ret['message'] = ""
                                ret['order_info_list'] = order_info_list
                                return Response(ret)

        except:
            print(traceback.print_exc())
            ret['code'] = "1001"
            ret['message'] = "查询异常"
            logger.info('%s url:%s method:%s' % (traceback.format_exc(), request.path, request.method))
            return Response(ret)
        return Response(ret)


# 获取账户记录
class BLGetAccountRecordByOrderNumber(APIView):
    authentication_classes = []
    permission_classes = []

    def post(self, request, *args, **kwargs):
        try:
            with transaction.atomic():
                ret = {'code': "1000", 'message': ""}
                print(request.data)
                order_number = request.data.get("order_number")

                od_number = str(order_number).replace("os", "")
                if od_number is not None and od_number != '':
                    login_result = bl_site_utils.login()
                    if login_result.get("code") == 'ok':
                        url ="/User/MyAccount.aspx"
                        params = bl_site_utils.get_page_params(url,login_result.get("cookies"))

                        params['ctl00$ContentPlaceHolder1$txtStart'] = ''
                        params['ctl00$ContentPlaceHolder1$txtEnd'] = ''
                        params['ctl00$ContentPlaceHolder1$txtOrderNumber'] = od_number
                        params['ctl00$ContentPlaceHolder1$txtOperateuser'] = ''
                        params['ctl00$ContentPlaceHolder1$dllType'] = ''
                        params['ctl00$ContentPlaceHolder1$txtRemark'] = ''
                        params['ctl00$ContentPlaceHolder1$btnSearch'] = '查询'

                        order_res = bl_site_utils.get_account_record_by_order_number(login_result.get("cookies"), params)
                        if order_res is not None:
                            accout_record_list = order_res['accout_record_list']
                            ret['code'] = "1000"
                            ret['message'] = ""
                            ret['accout_record_list'] = accout_record_list
                            return Response(ret)

        except:
            print(traceback.print_exc())
            ret['code'] = "1001"
            ret['message'] = "查询异常"
            logger.info('%s url:%s method:%s' % (traceback.format_exc(), request.path, request.method))
            return Response(ret)
        return Response(ret)