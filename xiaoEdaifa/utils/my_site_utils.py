import json
import requests
from utils import mglobal
from user import models as user_models
from django.db.models import Q
url_17 = mglobal.STATIC_URL_BK


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

