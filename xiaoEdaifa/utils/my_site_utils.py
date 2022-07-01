import json
import time
import requests
from utils import mglobal
from user import models as user_models
from trade import models as trade_models
from django.db.models import Q
from utils import mtime
url_17 = mglobal.STATIC_URL_BK


# 保存抖音商品数据到数据库
def save_dou_yin_goods_data_to_db(self,douyin_goods_list,shop_id):
    ret = {'code': "1000", 'message': ""}
    sql_user_shop = trade_models.UserFocusDouYinShop.objects.filter(shop_id=shop_id).first()
    if sql_user_shop is None:
        ret["code"] = "1001"
        ret["message"] = "不存在该店铺"
        return ret
    cur_time = time.time() * 1000
    if douyin_goods_list is not None and len(douyin_goods_list) > 0:
        raw_goods_list = []
        print("共有" + str(len(douyin_goods_list)) + "条商品")
        for goods_item in douyin_goods_list:
            m_goods_obj = {}

            m_goods_obj['shop_id'] = shop_id
            if goods_item['img_url_list'] is not None:
                m_goods_obj['image'] = goods_item['img_url_list'][0]
                m_goods_obj['img'] = goods_item['img_url_list'][0]

            if goods_item['price'] is not None:
                m_goods_obj['discount_price'] = goods_item['price']
                m_goods_obj['goods_price'] = goods_item['price']
                m_goods_obj['show_price'] = goods_item['price']
            if goods_item['market_price'] is not None:
                m_goods_obj['market_price'] = goods_item['market_price']

            if goods_item['product_id'] is not None:
                m_goods_obj['goods_id'] = goods_item['product_id']
                m_goods_obj['product_id'] = goods_item['product_id']
            if goods_item['name'] is not None:
                m_goods_obj['goods_name'] = goods_item['name']
                m_goods_obj['name'] = goods_item['name']

            if goods_item['sell_num'] is not None:
                m_goods_obj['sell_num'] = str(goods_item['sell_num']).replace("+", "")
                if m_goods_obj['sell_num'].find("万") != -1:
                    m_goods_obj['sell_num'] = m_goods_obj['sell_num'].replace("万", "").strip()

                    m_goods_obj['sell_num'] = float(m_goods_obj['sell_num']) * 10000
            raw_goods_list.append(m_goods_obj)
        for raw_goods in raw_goods_list:
            shop_id = raw_goods['shop_id']
            if shop_id is not None and shop_id != "":
                tem_goods = trade_models.DouYinGoods.objects.filter(goods_id=raw_goods['goods_id']).first()
                raw_goods['dou_yin_shop'] = sql_user_shop
                raw_goods['update_time'] = cur_time
                dou_yin_goods_records_data = {}
                dou_yin_goods_records_data['discount_price'] = raw_goods['discount_price']
                dou_yin_goods_records_data['goods_price'] = raw_goods['goods_price']
                dou_yin_goods_records_data['market_price'] = raw_goods['market_price']
                dou_yin_goods_records_data['show_price'] = raw_goods['show_price']
                dou_yin_goods_records_data['goods_id'] = raw_goods['goods_id']
                dou_yin_goods_records_data['goods_name'] = raw_goods['goods_name']
                dou_yin_goods_records_data['name'] = raw_goods['name']
                dou_yin_goods_records_data['product_id'] = raw_goods['product_id']
                dou_yin_goods_records_data['sell_num'] = raw_goods['sell_num']

                if tem_goods is None:
                    raw_goods['add_time'] = time.time() * 1000
                    # 判断非游客用户
                    if isinstance(self.request.user, user_models.User):
                        raw_goods['owner'] = self.request.user
                    else:
                        raw_goods['owner'] = user_models.User.objects.filter(id=1).first()
                    raw_goods['today_sell_num'] =  raw_goods['sell_num']
                    new_goods = trade_models.DouYinGoods.objects.create(**raw_goods)
                    dou_yin_goods_records_data['dou_yin_goods'] = new_goods
                    new_goods.save()

                else:
                    sql_dou_yin_goods_query = trade_models.DouYinGoods.objects.filter(goods_id=raw_goods['goods_id'])
                    sql_dou_yin_goods = sql_dou_yin_goods_query.first()
                    sql_last_dou_yin_goods_records = trade_models.DouYinGoodsCollectRecord.objects.filter(dou_yin_goods=sql_dou_yin_goods).order_by("-add_time").first()
                    last_record_time = 0
                    sql_last_dou_yin_goods_records_sell_num = 0
                    sql_today_sell_num = 0
                    if sql_last_dou_yin_goods_records is None:
                        last_record_time = time.time() * 1000
                        sql_last_dou_yin_goods_records_sell_num = 0
                    else:
                        sql_last_dou_yin_goods_records_sell_num  = sql_last_dou_yin_goods_records.sell_num
                        sql_today_sell_num = sql_dou_yin_goods.today_sell_num
                        last_record_time = sql_last_dou_yin_goods_records.add_time
                    # 当天0点的时间戳
                    today_0clock_stamp = mtime.get_time_0clock_of_today()*1000

                    raw_goods['today_sell_num'] = int(raw_goods['sell_num'])

                    if last_record_time < today_0clock_stamp:
                        # 最后一次更新不是当天
                        raw_goods['today_sell_num'] = 0

                    else:
                        sell_counts = int(raw_goods['sell_num']) - sql_last_dou_yin_goods_records_sell_num
                        if sell_counts > 0:
                            raw_goods['today_sell_num'] = sql_today_sell_num + sell_counts
                        else:
                            raw_goods['today_sell_num'] = sql_today_sell_num

                    sql_dou_yin_goods_query.update(**raw_goods)
                    dou_yin_goods_records_data['dou_yin_goods'] = tem_goods

                dou_yin_goods_records_data['add_time'] = time.time() * 1000
                new_goods_record = trade_models.DouYinGoodsCollectRecord.objects.create(**dou_yin_goods_records_data)
                new_goods_record.save()
    return  ret


# 采集抖音商品数据
def get_dou_yin_goods_data2(self, url, m_cookies, mheader, req_params,sql_user_shop,shop_id):
    # req_params = {
    #     "sec_shop_id" :"uuRYaTIP",
    #              "goods_type": "1" ,
    #     "sort_type": "2",
    # "sort" : "0" ,
    # "cursor" : "0",
    # "size" : "20",
    # "iid" : "3364954170996542",
    # "device_id" : "2995518243341992",
    # "channel" : "juyouliang_douyin_and15",
    # "aid" : "1128" ,
    # "app_name" : "aweme",
    # "version_code" : "200300" ,
    # "version_name" : "20.3.0" ,
    # "device_platform" : "android" ,
    # "os" : "android" ,
    # "device_type" : "MI + 6s" ,
    # "device_brand" : "Xiaomi",
    # "os_api" : "23" ,
    # "os_version" :" 6.0.1",
    #
    # }
    from requests.cookies import RequestsCookieJar
    jar = RequestsCookieJar()

    if m_cookies is not None:
        for key in m_cookies:
            jar.set(key, m_cookies[key])
    # url = "https://lianmengapi.snssdk.com/aweme/v1/store/product/list/?sec_shop_id=uuRYaTIP&goods_type=1&sort_type=2&sort=0&cursor=0&size=20&iid=3364954170996542&device_id=2995518243341992&channel=juyouliang_douyin_and15&aid=1128&app_name=aweme&version_code=200300&version_name=20.3.0&device_platform=android&os=android&device_type=MI+6s&device_brand=Xiaomi&os_api=23&os_version=6.0.1"
    cur_time = time.time() * 1000
    response = requests.get(url, cookies=jar, headers=mheader)
    print(response.text)
    response_data = json.loads(response.text)["products"]
    if response_data is not None:
        douyin_goods_list = response_data

        if douyin_goods_list is not None and len(douyin_goods_list) > 0:

            save_dou_yin_goods_data_to_db(self, douyin_goods_list, shop_id)
            # --------------------------------------------------------
            # raw_goods_list = []

           #  for goods_item in douyin_goods_list:
           #      m_goods_obj = {}
           #
           #      m_goods_obj['shop_id'] = shop_id
           #      if goods_item['img_url_list'] is not None:
           #          m_goods_obj['image'] = goods_item['img_url_list'][0]
           #          m_goods_obj['img'] = goods_item['img_url_list'][0]
           #
           #      if goods_item['price'] is not None:
           #          m_goods_obj['discount_price'] = goods_item['price']
           #          m_goods_obj['goods_price'] = goods_item['price']
           #          m_goods_obj['show_price'] = goods_item['price']
           #      if goods_item['market_price'] is not None:
           #          m_goods_obj['market_price'] = goods_item['market_price']
           #
           #      if goods_item['product_id'] is not None:
           #          m_goods_obj['goods_id'] = goods_item['product_id']
           #          m_goods_obj['product_id'] = goods_item['product_id']
           #      if goods_item['name'] is not None:
           #          m_goods_obj['goods_name'] = goods_item['name']
           #          m_goods_obj['name'] = goods_item['name']
           #
           #      if goods_item['sell_num'] is not None:
           #          m_goods_obj['sell_num'] = str(goods_item['sell_num']).replace("+", "")
           #          if m_goods_obj['sell_num'].find("万") != -1:
           #              m_goods_obj['sell_num'] = m_goods_obj['sell_num'].replace("万", "").strip()
           #
           #              m_goods_obj['sell_num'] = float(m_goods_obj['sell_num']) * 10000
           #      raw_goods_list.append(m_goods_obj)
           #  for raw_goods in raw_goods_list:
           #      shop_id = raw_goods['shop_id']
           #      if shop_id is not None and shop_id != "":
           #          tem_goods = trade_models.DouYinGoods.objects.filter(goods_id=raw_goods['goods_id']).first()
           #          raw_goods['dou_yin_shop'] = sql_user_shop
           #          raw_goods['update_time'] = cur_time
           #          dou_yin_goods_records_data = {}
           #          dou_yin_goods_records_data['discount_price'] = raw_goods['discount_price']
           #          dou_yin_goods_records_data['goods_price'] = raw_goods['goods_price']
           #          dou_yin_goods_records_data['market_price'] = raw_goods['market_price']
           #          dou_yin_goods_records_data['show_price'] = raw_goods['show_price']
           #          dou_yin_goods_records_data['goods_id'] = raw_goods['goods_id']
           #          dou_yin_goods_records_data['goods_name'] = raw_goods['goods_name']
           #          dou_yin_goods_records_data['name'] = raw_goods['name']
           #          dou_yin_goods_records_data['product_id'] = raw_goods['product_id']
           #          dou_yin_goods_records_data['sell_num'] = raw_goods['sell_num']
           #
           #          if tem_goods is None:
           #              raw_goods['add_time'] = time.time() * 1000
           #              # 判断非游客用户
           #              if isinstance(self.request.user, user_models.User):
           #                  raw_goods['owner'] = self.request.user
           #              else:
           #                  raw_goods['owner'] = user_models.User.objects.filter(id=1).first()
           #              new_goods = trade_models.DouYinGoods.objects.create(**raw_goods)
           #              dou_yin_goods_records_data['dou_yin_goods'] = new_goods
           #              new_goods.save()
           #
           #          else:
           #              trade_models.DouYinGoods.objects.filter(goods_id=raw_goods['goods_id']).update(**raw_goods)
           #              dou_yin_goods_records_data['dou_yin_goods'] = tem_goods
           #
           #          dou_yin_goods_records_data['add_time'] = time.time() * 1000
           #          new_goods_record = trade_models.DouYinGoodsCollectRecord.objects.create(
           #              **dou_yin_goods_records_data)
           #          new_goods_record.save()
            # --------------------------------------------------------


# 真实订单已发货同步到17网
def delivery_order_to17(order_list,cookies_obj):
    args = Q(user_name='root') | Q(user_name='admin')
    user_obj = user_models.User.objects.filter(args).first()
    user_token_obj = user_models.UserToken.objects.filter(user_id=user_obj.id).first()
    token = user_token_obj.token
    # token = '348ba4ef4405328f2c4b2d006821fd85'
    parms = {
        "deliver_order_list": json.dumps(order_list),
    }

    request_url = url_17+"/back/deliverFromBL/?access_token_bk="+token
    response = requests.post(request_url,data=parms)
    print(response)


# 真实订单已拿货同步到17网 （上传ordernumber 代表整个订单已拿货）
def yinahuo_order_to17(order_number_list,cookies_obj):
    args = Q(user_name='root') | Q(user_name='admin')
    user_obj = user_models.User.objects.filter(args).first()
    user_token_obj = user_models.UserToken.objects.filter(user_id=user_obj.id).first()
    token = user_token_obj.token
    # token = '348ba4ef4405328f2c4b2d006821fd85'
    parms = {
        "order_number_list":json.dumps(order_number_list),
    }

    request_url = url_17+"/back/changePurchasingStatusByOrderNumber/?access_token_bk="+token
    response = requests.post(request_url,data=parms)
    print(response)

