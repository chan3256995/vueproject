import requests
import logging
import traceback
import time
import re
from utils import my_site_utils
from requests.cookies import RequestsCookieJar
from utils import mglobal
from _decimal import Decimal
from html.parser import HTMLParser

from lxml import etree
logger = logging.getLogger('stu')
base_url_bl = "http://speed.tkttt.com"
bl_user_name = "海文"
bl_password = "137637653"


# 预支物流单号物流选择
def is_allow_advanllce_logistics(logistics_number):
    logistics_choise = {}
    if base_url_bl == "http://speed.tkttt.com":
        logistics_choise= {"圆通":"圆通" }
    if  logistics_number!='' and logistics_choise[logistics_number] is not None:
        return True
    return False




def get_bl_tuihuotuik_reson_type():
    if base_url_bl == "http://speed.tkttt.com":
        return {
            "非质量问题":2,
            "质量问题":1
        }


def check_login(cookie):
    try:
        url = base_url_bl+"/User/Charge.aspx"
        jar = RequestsCookieJar()
        cookies_str = ""
        for key, value in cookie.items():
            cookies_str = cookies_str + key + "=" + value + ";"
            jar.set(key, value)

        # jar.set("ASP.NET_SessionId", "xgvmk1stokeiiwah3fjdb2ye")
        # jar.set(".ASPXAUTH", "518BE5C9561C4B8FE94A5E2FC94F5E1CE4878549F234B5A255A01C2D4AA72E7F74D097AFB3812C56BECDA75CE25D82ECD133A43ED8F891A89DF31181C321BB57FB1FBEB559373EE83503A98D052F715E1D610B95A626F326CE9664CA952C6D60CCB3C0AEB351488DFBB442E6C2F921EFC7F147FA94341F5536C1A3DAE55EAC06")
        header = {
            # cookie 这里就不贴出来了 ![(☆_☆)/~~]
            # "Cookie": "ASP.NET_SessionId=pg1lpw5gm1owdfjnx0il22hf&.ASPXAUTH=1411FAF265576FA799C33E4D989698497B677D1318CC59F9B2E4A581CA5E5E46B7E139A0E1B8347A3BEC2F51956F12D0765CA4B8011E83DB082634DCF496B8890EEE4BCD08E43E9D844B3A8D6D4681A95E0168358EB8DB21C2BC781F659A3D332CAD94904A21FE773106F060925CE88186D792931E4E21702342F1213EE8E8D6",
            # 'content-type': 'charset=gbk',
            # 'origin': 'https://wuliu.taobao.com',

            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.169 Safari/537.36"
        }

        response = requests.get(url, cookies=jar, headers=header)
        if response.text.find("帐户余额") != -1:
            return True
        return False
    except :
        logger.info('%s url ' % (traceback.format_exc()))
    return False


def login():
    return_obj = {"code": "error", "message": ""}
    try:
        url = base_url_bl+"/ajax/Login.ashx?username="+bl_user_name+"&userpass="+bl_password


        header = {
            # cookie 这里就不贴出来了 ![(☆_☆)/~~]
            # "Cookie": "ASP.NET_SessionId=pg1lpw5gm1owdfjnx0il22hf&.ASPXAUTH=1411FAF265576FA799C33E4D989698497B677D1318CC59F9B2E4A581CA5E5E46B7E139A0E1B8347A3BEC2F51956F12D0765CA4B8011E83DB082634DCF496B8890EEE4BCD08E43E9D844B3A8D6D4681A95E0168358EB8DB21C2BC781F659A3D332CAD94904A21FE773106F060925CE88186D792931E4E21702342F1213EE8E8D6",
            # 'content-type': 'charset=gbk',
            # 'origin': 'https://wuliu.taobao.com',

            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.169 Safari/537.36"
        }
        data = {
            "user_name":bl_user_name,
            "userpass":bl_password,
        }
        response = requests.get(url,   headers=header)
        if response.text.find("密码输入错误") !=-1:
            return_obj["code"] = 'error'
            return_obj['message'] = "密码错误"
            return return_obj
        if response.text.find("用户名不存在")!=-1:
            return_obj["code"] = 'error'
            return_obj['message'] = "用户名不存在"
            return return_obj
        if response.text == '1':
            cookie = requests.utils.dict_from_cookiejar(response.cookies)
            return_obj["code"] = 'ok'
            return_obj['cookies'] = cookie
            return return_obj



    except :
        return_obj["code"] = 'error'
        print(traceback.format_exc())
        logger.info('%s url ' % (traceback.format_exc()))
    return return_obj


def start_delivery_order_blto17(cookie):
    result = init_order_page_parms(cookie)
    parms = result['parms']

    end_time = time.strftime("%Y-%m-%d %H:%M:%S", time.localtime())
    start_time_stamp = time.time() - 4 * 24 * 60 * 60
    start_time = time.strftime("%Y-%m-%d %H:%M:%S", time.localtime(start_time_stamp))
    parms['__EVENTARGUMENT'] = 1
    parms['__EVENTTARGET'] = "ctl00$ContentPlaceHolder1$AspNetPager1"
    parms['ctl00$ContentPlaceHolder1$txtStart'] = start_time
    parms['ctl00$ContentPlaceHolder1$txtEnd'] = end_time
    action_time = time.time()
    page_info = result['page_info']
    while (int(page_info['cur_page']) < int(page_info['page_counts'])) or (int(page_info['cur_page']) == int(page_info['page_counts'])):
        cur_time = time.time()
        if cur_time - action_time > 60 * 3:
            # 大于三分钟停止 防止死循环
            break
        parms['ctl00$ContentPlaceHolder1$txtPageSize'] = 10
        result2 = load_order_list(cookie,parms )
        my_site_utils.yinahuo_order_to17(result2['order_yinahuo_list'],{})
        my_site_utils.delivery_order_to17(result2['order_sended_list'],{})
        page_info = result2['page_info']
        parms['__EVENTARGUMENT'] = int(page_info['cur_page']) + 1
        page_info['cur_page'] = int(page_info['cur_page']) + 1
        if int(page_info['cur_page']) > int(page_info['page_counts']):
            break


# 获取订单页面参数信息
def init_order_page_parms(cookie):
    parms = {
                 "__VIEWSTATE":"",
                "__EVENTTARGET":"",
                "__VIEWSTATEGENERATOR":"AFA9FE57",
                "__EVENTVALIDATION":"",
                "__EVENTARGUMENT":"",

       }

    result = load_order_list(cookie,parms)
    return  result


# 申请退款 目前 多个商品的订单暂不支持申请
def refund_tuikuan_bl(order_goods_item):
    try:
        ret={'code':"error",'message':''}
        order_number = order_goods_item['order_number']
        mainid = order_goods_item['order_id']
        sonid = order_goods_item['order_goods_id']

        result = login()
        if result.get('code') == "ok":
            page_parms = init_order_page_parms(result.get('cookies'))
            parms = page_parms.get("parms")

            parms['ctl00$ContentPlaceHolder1$txtOrderNum'] = order_number
            parms['ctl00$ContentPlaceHolder1$btnSearch'] = '查 询'
            parms['ctl00$ContentPlaceHolder1$txtPageSize'] = '20'
            res = load_order_list(result.get('cookies'), parms)

            order_info_list = res['order_info_list']
            if len(order_info_list)> 0 :
                # bl 网站没有goods_id 做标记 多个商品的订单暂不支持申请
                if len(order_info_list[0]['order_goods_list']) > 1 :
                    ret['code'] = 'error'
                    ret['message'] = '该订单暂不支持申请'
                    return ret
                order_info = order_info_list[0]['order_goods_list'][0]
                if order_info['status'] == '正常':
                    url = '/User/TuiKuan.aspx?sonid='+order_info['sonid']+'&mainid='+order_info['mainid']
                    refund_parms = get_page_params(url,result.get('cookies'))
                    refund_parms['__EVENTTARGET'] = 'ctl00$ContentPlaceHolder1$btnAdd'
                    refund_parms['__EVENTARGUMENT'] = ''
                    refund_parms['ctl00$ContentPlaceHolder1$txtTuiKuanShuoMing'] = ''
                    refund_parms['total'] = Decimal(float(order_info['goods_price'])) * Decimal(float(order_info['goods_count']))

                    refund_result = go_refund_tuikuan(refund_parms,result.get('cookies'),url)
                    if refund_result['code'] == 'ok':
                        ret['code'] = 'ok'
                        ret['message'] = '申请成功'
                    print(refund_parms)
                else:
                    ret['code'] = 'error'
                    ret['message'] = '状态不允许申请仅退款'
            else:
                ret['code'] = 'error'
                ret['message'] = '未找到该订单'
    except:
        print(traceback.format_exc())
        logger.info('%s bl 申请退款失败 ' % (traceback.format_exc()))
        ret['code'] = 'error'
        ret['message'] = '申请失败'
    return ret


# 退货退款申请
def refund_tuihuotuik_bl(order_goods_item):
    try:
        ret={'code':"error",'message':''}
        order_number = order_goods_item['order_number']
        order_id = order_goods_item['order_id']
        order_goods_id = order_goods_item['order_goods_id']
        # order_number = '202008090808352077139'
        # order_goods_item['return_logistics_name'] = "申通"
        # order_goods_item['return_logistics_number'] = "773050562347891"
        result = login()
        if result.get('code') == "ok":
            page_parms = init_order_page_parms(result.get('cookies'))
            parms = page_parms.get("parms")
            parms['ctl00$ContentPlaceHolder1$txtOrderNum'] = order_number
            parms['ctl00$ContentPlaceHolder1$btnSearch'] = '查 询'
            parms['ctl00$ContentPlaceHolder1$txtPageSize'] = '20'
            res = load_order_list(result.get('cookies'), parms)
            order_info_list = res['order_info_list']
            if len(order_info_list)> 0 and len(order_info_list[0]['order_goods_list']) > 1 :
                # bl 网站没有goods_id 做标记 多个商品的订单暂不支持申请
                ret['code'] = 'error'
                ret['message'] = '该订单暂不支持申请'
                return ret
            elif len(order_info_list) == 0:
                ret['code'] = 'error'
                ret['message'] = 'bl未有该订单信息'
                return ret
            order_goods_info = order_info_list[0]['order_goods_list'][0]
            if order_goods_info['status'] == '已拿货' and order_info_list[0]['order_status'] == '已发货':
                url = "/User/TuiHuanSelect.aspx?mainid="+order_goods_info['mainid']
                refund_parms = get_page_params(url, result.get('cookies'))
                refund_parms['ctl00$ContentPlaceHolder1$btntuikuantuihuo'] = "退款并退货"
                url = "/User/TuiKuanTuiHuo.aspx?id=" + order_goods_info['mainid']
                resutlt = get_tuihuotuik_page_info(refund_parms,result.get('cookies') , url, order_goods_info['sonid'], order_goods_item)
                if resutlt['code'] == 'error':
                    ret['code'] = 'error'
                    ret['message'] = resutlt['message']
                    return ret
            else:
                ret['code'] = 'error'
                ret['message'] = "状态异常"

    except:
        print(traceback.format_exc())
        logger.info('%s bl 申请退款失败 ' % (traceback.format_exc()))
        ret['code'] = 'error'
        ret['message'] = '申请失败'
    return ret


#从 bl 网站预支单号
def get_order_logistics_numbers_bl(order_number):
    try:
        ret={'code':"error",'message':''}
        url = "/ajax/VipHuoQuDanHao.ashx?id="
        jar = RequestsCookieJar()
        login_result = login()
        if login_result['code'] == "ok":
            cookies = login_result.get("cookies")
            result = get_order_info_by_order_number( cookies, order_number)
            if result['code'] == 'ok':
                order_info  = result['order_info']
                logistics_name = order_info["logistics_name"]
                is_logistics_allow = is_allow_advanllce_logistics(logistics_name)
                if is_logistics_allow is False:
                    ret['code'] = 'error'
                    ret['message'] = '该快递暂不支持预支单号'
                main_id = order_info['order_goods_list'][0]["mainid"]
                request_url = base_url_bl + url + main_id
                cookies_str = ""
                for key, value in cookies.items():
                    cookies_str = cookies_str + key + "=" + value + ";"
                    jar.set(key, value)

                header = {

                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.169 Safari/537.36"
                }
                response = requests.get(request_url, cookies=jar,  headers=header)
                if response.text.find("运单号不为空") != -1:
                    ret['code'] = 'error'
                    ret['message'] = '该订单已有快递单号不能重复获取'
                elif response.text.find("不是付款成功或者缺货的订单不能操作") !=-1:
                    ret['code'] = 'error'
                    ret['message'] = '该订单已有快递单号不能重复获取'
                else:
                    ret['code'] = 'ok'
                    ret["logistics_number"] = response.text
            else:
                ret['code'] = 'error'
                ret['message'] = ''
    except:
        print(traceback.format_exc())
        logger.info('%s bl 获取单号失败 ' % (traceback.format_exc()))
        ret['code'] = 'error'
        ret['message'] = '申请失败'
    return ret


def get_order_info_by_order_number(cookies,order_number):
    try:
        # order_number = "202008171720272339608"
        ret = {'code': "error", 'message': ''}
        ret['order_info_list'] = []
        page_parms = init_order_page_parms(cookies)
        params = page_parms['parms']
        params['ctl00$ContentPlaceHolder1$txtOrderNum'] = order_number
        params['ctl00$ContentPlaceHolder1$btnSearch'] = '查 询'
        params['ctl00$ContentPlaceHolder1$txtPageSize'] = '20'
        order_res = load_order_list(cookies, params)
        if order_res is not None:
            order_info_list = order_res['order_info_list']
            ret['code'] = "ok"
            ret['order_info'] = order_info_list[0]
        else:
            ret['code'] = "error"
    except:
         raise Exception
    return ret


def get_tuihuotuik_page_info(params,cookies,url,sonid,order_goods_item):
    try:
        ret = {'code': "error", 'message': ''}
        request_url = base_url_bl + url
        jar = RequestsCookieJar()
        cookies_str = ""
        for key, value in cookies.items():
            cookies_str = cookies_str + key + "=" + value + ";"
            jar.set(key, value)

        header = {

            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.169 Safari/537.36"
        }
        response = requests.post(request_url, cookies=jar,data=params, headers=header)
        if response.status_code == 200:
            print(response.text)
            if response.text.find("只有已发货") != -1:
                ret['code'] = 'error'
                ret['message'] = '状态异常'
                return ret
            html = etree.HTML(response.text)

            parms = {}
            parms['__VIEWSTATE'] = html.xpath("//input[@id='__VIEWSTATE']/@value")[0]
            parms['__EVENTVALIDATION'] = html.xpath("//input[@id='__EVENTVALIDATION']/@value")[0]
            parms['__VIEWSTATEGENERATOR'] = html.xpath("//input[@id='__VIEWSTATEGENERATOR']/@value")[0]
            parms['__EVENTTARGET'] = "ctl00$ContentPlaceHolder1$btnAdd"
            parms['__EVENTARGUMENT'] = ""
            productlist_elem = html.xpath("//table[@class='productlist']")[0]

            tr_elems = productlist_elem.xpath(".//tr")
            for i in range(len(tr_elems)):
                if i == 0:
                    continue
                input_sonid = tr_elems[i].xpath(".//td")[0].xpath(".//input//@value")[0]
                market_text_list = tr_elems[i].xpath(".//td")[1].xpath(".//text()")
                floor_text_list = tr_elems[i].xpath(".//td")[2].xpath(".//text()")
                stall_text_list = tr_elems[i].xpath(".//td")[3].xpath(".//text()")
                art_text_list = tr_elems[i].xpath(".//td")[4].xpath(".//text()")
                color_text_list = tr_elems[i].xpath(".//td")[5].xpath(".//text()")
                count_text_list = tr_elems[i].xpath(".//td")[6].xpath(".//text()")
                price_text_list = tr_elems[i].xpath(".//td")[7].xpath(".//text()")
                tuikuan_text_list = tr_elems[i].xpath(".//td")[8].xpath(".//text()")
                goods_status_text_list = tr_elems[i].xpath(".//td")[9].xpath(".//text()")
                mark_text_list = tr_elems[i].xpath(".//td")[10].xpath(".//text()")
                goods_status_text = get_list_str(goods_status_text_list)
                tuikuan_text = get_list_str(tuikuan_text_list).strip()
                if input_sonid == sonid and goods_status_text =="已拿货":
                    request_url = base_url_bl + url
                    total_str = "total"+sonid
                    reason = get_bl_tuihuotuik_reson_type()
                    parms['ordersonid'] = sonid
                    parms['ctl00$ContentPlaceHolder1$txtExpressCompany'] = order_goods_item['return_logistics_name']
                    parms['ctl00$ContentPlaceHolder1$txtExpressNo'] = order_goods_item['return_logistics_number']
                    parms['ctl00$ContentPlaceHolder1$rblReasonType'] = reason['非质量问题']
                    parms['ctl00$ContentPlaceHolder1$ddlReasonOther'] =""
                    parms['ctl00$ContentPlaceHolder1$txtTuiKuanShuoMing'] = ""
                    parms[total_str] = tuikuan_text
                    response = requests.post(request_url, cookies=jar, data=parms, headers=header)
                    print(response.text)
                    if response.text.find("申请退款并退货成功") != -1 :
                        ret['code'] = 'ok'
                    if response.text.find("单号已使用过") != -1 :
                        ret['code'] = 'error'
                        ret['message'] = '快递单号已存在'
                    return ret

    except:

        print(traceback.format_exc())
        logger.info('%s url ' % (traceback.format_exc()))
        ret['code'] = 'error'
        ret['message'] = '申请失败'
    ret['code'] = 'ok'
    ret['message'] = ''
    return ret


def go_refund_tuikuan(params,cookies,url):
    try:
        ret = {'code': "error", 'message': ''}
        request_url = base_url_bl + url
        jar = RequestsCookieJar()
        cookies_str = ""
        for key, value in cookies.items():
            cookies_str = cookies_str + key + "=" + value + ";"
            jar.set(key, value)

        header = {

            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.169 Safari/537.36"
        }
        response = requests.post(request_url, cookies=jar,data=params, headers=header)
        if response.status_code == 200:
            if response.text.find("申请退款成功") != -1:
                ret['code'] = 'ok'
                ret['message'] = ''
        print(response.text)
    except:

        print(traceback.format_exc())
        logger.info('%s url ' % (traceback.format_exc()))
        ret['code'] = 'error'
        ret['message'] = '申请失败'
    return ret


 #加载订单
def load_order_list(cookie,parms):
    return_obj = {"code": "error", "message": ""}
    try:
        request_type = "POST"
        if parms['__VIEWSTATE'] == "":
            request_type = "GET"
            parms = {}

        order_sended_list = []
        order_yinahuo_list = []
        order_info_list = []
        obj = {}
        page_info = {}
        url = base_url_bl+"/User/OrderList.aspx"
        jar = RequestsCookieJar()
        cookies_str = ""
        for key, value in cookie.items():
            cookies_str = cookies_str + key + "=" + value + ";"
            jar.set(key, value)

        header = {

            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.169 Safari/537.36"
        }
        response = None
        if request_type == "GET":
            response = requests.get(url, cookies=jar,data=parms, headers=header)
        else:
            response = requests.post(url, cookies=jar, data=parms, headers=header)
        if response.text.find("<script>top.location.href='/Login.aspx';</script>") != -1:
            return_obj["message"] = "未登录"
            return_obj["code"] = "error"
            return return_obj
        html = etree.HTML(response.text)


        cur_page = 1

        page_counts = 1
        page_info_result = analyse_paginator(html)
        orderlist_table_list = html.xpath('//*[@class="orderlist"]')

        parms['__VIEWSTATE'] = page_info_result['__VIEWSTATE']
        parms['__EVENTVALIDATION'] = page_info_result['__EVENTVALIDATION']
        parms['__VIEWSTATEGENERATOR'] = page_info_result['__VIEWSTATEGENERATOR']
        cur_page = page_info_result['cur_page']
        page_counts = page_info_result['page_counts']
        # 按字符串序列化HTML文档
        # result = etree.tostring(html)
        # 遍历每个item
        for order_list_item in orderlist_table_list:
            result_yinahuo_item = analyse_yinahuo_order(order_list_item)
            result_sended_item = analyse_sended_order(order_list_item)
            result_order_info_item = analyse_order_info(order_list_item)
            if result_order_info_item is not None:
                order_info_list.append(result_order_info_item)
            if result_yinahuo_item is not None:
                order_yinahuo_list.append(result_yinahuo_item)

            if result_sended_item is not None:
                order_sended_list.append(result_sended_item)
        page_info = {
            "cur_page": cur_page,
            "page_counts": page_counts,
        }
        obj = {
            "order_sended_list": order_sended_list,
            "order_yinahuo_list": order_yinahuo_list,
            "order_info_list": order_info_list,
            "parms": parms,
            "page_info": page_info,
        }

    except :
        print(traceback.format_exc())
        logger.info('%s url ' % (traceback.format_exc()))
        return None
    return obj


# 分析页面信息  当前页 共多少页
def analyse_paginator(html):
    paginator_elems = html.xpath("//div[@class='pagerright']")

    cur_page = 1

    page_counts = 1
    if len(paginator_elems) > 0:

        paginator_text = paginator_elems[0].text
        cur_page_reg = "第\\d+页"
        page_counts_reg = "共\\d+页"
        cur_page = re.search(cur_page_reg, paginator_text).group(0).replace("第", '').replace("页", '').strip()
        page_counts = re.search(page_counts_reg, paginator_text).group(0).replace("共", '').replace("页", '').strip()

    __VIEWSTATE = html.xpath("//input[@id='__VIEWSTATE']/@value")[0]
    __EVENTVALIDATION = html.xpath("//input[@id='__EVENTVALIDATION']/@value")[0]
    __VIEWSTATEGENERATOR = html.xpath("//input[@id='__VIEWSTATEGENERATOR']/@value")[0]

    return {"cur_page": cur_page, "page_counts":page_counts,"__VIEWSTATE":__VIEWSTATE ,"__EVENTVALIDATION":__EVENTVALIDATION,"__VIEWSTATEGENERATOR":__VIEWSTATEGENERATOR }


# 分析已拿货订单  一个订单所有商品都拿到货了则返回该订单号
def analyse_yinahuo_order(item_elems):
    ol_row1 = item_elems.xpath('.//tr[@class="ol_row1"]')
    order_number_text_list = ol_row1[0].xpath('.//td//text()')
    logistics_text_list = item_elems.xpath('.//td[contains(text(), "快递：")]//text()')
    # 商品标签
    order_goods_ul = item_elems.xpath(".//ul[@class='sonpro']")[0]
    order_goods_li = order_goods_ul.xpath(".//li")

    is_all_yinahuo = False
    for order_goods_item in order_goods_li:
        div_elem = order_goods_item.xpath(".//div[@class='detailright']")[0]
        goods_status_text_list = div_elem.xpath('.//div[contains(text(), "状态")]//text()')
        goods_status_text = get_list_str(goods_status_text_list)

        if goods_status_text.find("已拿货") != -1:
            is_all_yinahuo = True
        else:
            is_all_yinahuo = False
            break
    order_number_text = get_list_str(order_number_text_list)
    logistics_text = get_list_str(logistics_text_list)

    index0 = order_number_text.find("订单号：")
    index1 = order_number_text.find("收货人：")
    if index0 != -1 and index1 != -1:
        order_number = order_number_text[index0:index1].replace("订单号：", '').strip()

    logistics_name = logistics_text.split("单号")[0].replace("快递：", "").strip()
    logistics_number = logistics_text.split("单号")[1].replace("：", "").strip()
    if logistics_name.find("圆通") != -1:
        logistics_name = "圆通"
    elif logistics_name.find("中通") != -1:
        logistics_name = "中通"
    elif logistics_name.find("韵达") != -1:
        logistics_name = "韵达"
    elif logistics_name.find("申通") != -1:
        logistics_name = "申通"
    elif logistics_name.find("百世") != -1:
        logistics_name = "百世"
    else:
        logistics_name = ""

    if is_all_yinahuo == True and logistics_number == "":
        return "os" + order_number
    return None


def analyse_sended_order(item_elems):
    ol_row1 = item_elems.xpath('.//tr[@class="ol_row1"]')
    order_number_text_list = ol_row1[0].xpath('.//td//text()')
    logistics_text_list = item_elems.xpath('.//td[contains(text(), "快递：")]//text()')
    # 商品标签
    order_goods_ul = item_elems.xpath(".//ul[@class='sonpro']")[0]
    order_goods_li = order_goods_ul.xpath(".//li")

    is_all_yinahuo = False
    for order_goods_item in order_goods_li:
        div_elem = order_goods_item.xpath(".//div[@class='detailright']")[0]
        goods_status_text_list = div_elem.xpath('.//div[contains(text(), "状态")]//text()')
        goods_status_text = get_list_str(goods_status_text_list)

        if goods_status_text.find("已拿货") != -1:
            is_all_yinahuo = True
        else:
            is_all_yinahuo = False
            break
    order_number_text = get_list_str(order_number_text_list)
    logistics_text = get_list_str(logistics_text_list)

    index0 = order_number_text.find("订单号：")
    index1 = order_number_text.find("收货人：")
    if index0 != -1 and index1 != -1:
        order_number = order_number_text[index0:index1].replace("订单号：", '').strip()

    logistics_name = logistics_text.split("单号")[0].replace("快递：", "").strip()
    logistics_number = logistics_text.split("单号")[1].replace("：", "").strip()
    if logistics_name.find("圆通") != -1:
        logistics_name = "圆通"
    elif logistics_name.find("中通") != -1:
        logistics_name = "中通"
    elif logistics_name.find("韵达") != -1:
        logistics_name = "韵达"
    elif logistics_name.find("申通") != -1:
        logistics_name = "申通"
    elif logistics_name.find("百世") != -1:
        logistics_name = "百世"
    else:
        logistics_name = ""

    if is_all_yinahuo is True and logistics_number != "" and logistics_name != "":
        item = {
            "logistics_number": logistics_number,
            "logistics_name": logistics_name,
            "order_number": "os" + order_number,
        }
        if mglobal.STATIC_URL_BK.find("39.96.69.115"):
            item["order_number"] = "r" + item["order_number"]
        return item
    return None


# 返回订单id 商品id 信息
def analyse_order_info(item_elems):
    ol_row1 = item_elems.xpath('.//tr[@class="ol_row1"]')
    # d订单，商品 信息 tr
    tr_trlist_elem = item_elems.xpath(".//tr[@class='ol_trlist']")[0]
    #  订单状态
    order_status_elem = tr_trlist_elem.xpath('.//td')[3]
    order_number_text_list = ol_row1[0].xpath('.//td//text()')
    logistics_text_list = item_elems.xpath('.//td[contains(text(), "快递：")]//text()')
    order_status_elem_text_list = order_status_elem.xpath('.//text()')
    order_status_text = get_list_str(order_status_elem_text_list).strip()
    # 商品标签
    order_goods_ul = item_elems.xpath(".//ul[@class='sonpro']")[0]
    order_goods_li = order_goods_ul.xpath(".//li")



    order_goods_list = []
    for order_goods_item in order_goods_li:
        div_detailright_elem = order_goods_item.xpath(".//div[@class='detailright']")[0]
        div_detailshouhuo_elem = order_goods_item.xpath(".//div[@class='detailshouhuo']")[0]

        goods_status_text_list = div_detailright_elem.xpath('.//div[contains(text(), "状态")]//text()')
        goods_price_text_list = div_detailright_elem.xpath('.//div[contains(text(), "价格")]//text()')
        goods_count_text_list = div_detailright_elem.xpath('.//div[contains(text(), "数量")]//text()')
        goods_mark_text_list = div_detailright_elem.xpath('.//div[contains(text(), "备注")]//text()')
        goods_refund_text = div_detailshouhuo_elem.xpath('.//a[contains(text(), "申请退款")]/@href')[0]
        sonid_mainid = goods_refund_text.split("?")[1].split("&")
        sonid = sonid_mainid[0].split("=")[1]
        mainid = sonid_mainid[1].split("=")[1]

        goods_mark_text = get_list_str(goods_mark_text_list).strip()
        goods_status_text = get_list_str(goods_status_text_list).strip()
        goods_price_text = get_list_str(goods_price_text_list).strip()
        goods_count_text = get_list_str(goods_count_text_list).strip()
        goods_status_text = goods_status_text.split("状态：")[1]
        goods_price = 0
        goods_count = goods_count_text[goods_price_text.find('数量'):len(goods_count_text)].replace("数量：","").strip()
        goods_mark_text = goods_mark_text.replace("备注：","")
        if goods_price_text.find('数量') != -1:
            goods_price = goods_price_text[0:goods_price_text.find('数量')].replace("价格：","").strip()
        else:
            goods_price = goods_price_text.replace("价格：","").strip()
        goods = {
            "status":goods_status_text,
            "mainid":mainid,
            "sonid":sonid,
            "goods_price":goods_price,
            "goods_count":goods_count,
            "mark":goods_mark_text,

        }
        order_goods_list.append(goods)

    order_number_text = get_list_str(order_number_text_list)
    logistics_text = get_list_str(logistics_text_list)

    index0 = order_number_text.find("订单号：")
    index1 = order_number_text.find("收货人：")
    order_number = ""
    if index0 != -1 and index1 != -1:
        order_number = order_number_text[index0:index1].replace("订单号：", '').strip()

    logistics_name = logistics_text.split("单号")[0].replace("快递：", "").strip()
    logistics_number = logistics_text.split("单号")[1].replace("：", "").strip()
    if logistics_name.find("圆通") != -1:
        logistics_name = "圆通"
    elif logistics_name.find("中通") != -1:
        logistics_name = "中通"
    elif logistics_name.find("韵达") != -1:
        logistics_name = "韵达"
    elif logistics_name.find("申通") != -1:
        logistics_name = "申通"
    elif logistics_name.find("百世") != -1:
        logistics_name = "百世"
    else:
        logistics_name = ""

    item = {
            "logistics_number": logistics_number,
            "logistics_name": logistics_name,
            "order_number": "os" + order_number,
            "order_goods_list":order_goods_list,
            "order_status":order_status_text
        }

    return item

# 返回list 里面的字符串
def get_list_str(list):
    tem = ""
    for item in list:
        tem = tem + item
    return tem


# 根据单号查询资金流水记录
def get_account_record_by_order_number(cookie,parms):
    return_obj = {"code": "error", "message": ""}
    try:
        request_type = "POST"
        if parms['__VIEWSTATE'] == "":
            request_type = "GET"
            parms = {}


        obj = {}
        page_info = {}
        url = base_url_bl + "/User/MyAccount.aspx"
        jar = RequestsCookieJar()
        cookies_str = ""
        for key, value in cookie.items():
            cookies_str = cookies_str + key + "=" + value + ";"
            jar.set(key, value)

        header = {

            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.169 Safari/537.36"
        }
        response = None
        if request_type == "GET":
            response = requests.get(url, cookies=jar, data=parms, headers=header)
        else:
            response = requests.post(url, cookies=jar, data=parms, headers=header)
        if response.text.find("<script>top.location.href='/Login.aspx';</script>") != -1:
            return_obj["message"] = "未登录"
            return_obj["code"] = "error"
            return return_obj
        html = etree.HTML(response.text)

        accout_record_list = []
        tr_list = html.xpath('//*[@class="trlist"]')

        # 按字符串序列化HTML文档
        # result = etree.tostring(html)
        # 遍历每个item
        for tr_item in tr_list:
            td_elems = tr_item.xpath('.//td')
            operater = get_list_str(td_elems[0].xpath(".//text()")).strip()
            type = get_list_str(td_elems[1].xpath(".//text()")).strip()
            money = get_list_str(td_elems[2].xpath(".//text()")).strip()
            remain_money = get_list_str(td_elems[3].xpath(".//text()")).strip()
            order_number = get_list_str(td_elems[4].xpath(".//text()")).strip()
            mark = get_list_str(td_elems[5].xpath(".//text()")).strip()
            add_time = get_list_str(td_elems[6].xpath(".//text()")).strip()
            tem_obj = {
                "operater":operater,
                "type":type,
                "money":money,
                "remain_money":remain_money,
                "order_number":order_number,
                "mark":mark,
                "add_time":add_time,

            }
            accout_record_list.append(tem_obj)


        obj = {
            "accout_record_list": accout_record_list,

        }

    except:
        print(traceback.format_exc())
        logger.info('%s url ' % (traceback.format_exc()))
        return None
    return obj


# 得到页面参数信息
def get_page_params(url,cookies):
    parms = {
    }
    request_url = base_url_bl+url
    jar = RequestsCookieJar()
    cookies_str = ""
    for key, value in cookies.items():
        cookies_str = cookies_str + key + "=" + value + ";"
        jar.set(key, value)

    header = {

        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.169 Safari/537.36"
    }
    response = requests.get(request_url, cookies=jar, headers=header)

    html = etree.HTML(response.text)
    __VIEWSTATE = html.xpath("//input[@id='__VIEWSTATE']/@value")[0]
    __EVENTVALIDATION = html.xpath("//input[@id='__EVENTVALIDATION']/@value")[0]
    __VIEWSTATEGENERATOR = html.xpath("//input[@id='__VIEWSTATEGENERATOR']/@value")[0]
    parms['__VIEWSTATE'] = __VIEWSTATE
    parms['__EVENTVALIDATION'] = __EVENTVALIDATION
    parms['__VIEWSTATEGENERATOR'] = __VIEWSTATEGENERATOR
    return parms



