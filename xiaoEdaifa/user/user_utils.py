
from utils import encryptions
from trade import models as trade_models
from utils import mcommon
from _decimal import Decimal
import traceback
import logging
import time
logger = logging.getLogger('stu')
# 检查密码是否正确
def check_pay_password(self,user, pwd):
    pay_pwd = pwd
    print("pay_pwd", pay_pwd)
    pay_pwd_ = encryptions.get_sha_encryptions(pay_pwd)
    if  user.pay_password != pay_pwd_:
        logger.info('%s url:%s method:%s' % (traceback.format_exc(), self.request.path, self.request.method))
        return False
    return True


# 生成订单号函数
def generate_order_sn(self):
    # 当前时间+userid+随机数
    from time import strftime
    from random import Random
    random_ins = Random()
    order_sn = "os{time_str}{userid}{ranstr}".format(time_str=strftime("%Y%m%d%H%M%S"),
                                                   userid=self.request.user.id,
                                                   ranstr=random_ins.randint(10, 99999))

    return order_sn


# 生成空包订单号函数
def generate_null_order_sn(self):
    # 当前时间+userid+随机数
    from time import strftime
    from random import Random
    random_ins = Random()
    order_sn = "NS{time_str}{userid}{ranstr}".format(time_str=strftime("%Y%m%d%H%M%S"),
                                                   userid=self.request.user.id,
                                                   ranstr=random_ins.randint(10, 99999))

    return order_sn


def get_user_logistics_after_discount_price(self,logistics_name):
    logistics = trade_models.Logistics.objects.filter(logistics_name=logistics_name).first()
    discount_card = trade_models.DiscountCard.objects.filter(user=self.request.user,discount_card_type=mcommon.discount_card_type_choices2.get("物流金额优惠卡")).first()
    logistics_price = logistics.logistics_price

    if discount_card is not None:
        if discount_card.discount_card_type == mcommon.discount_card_type_choices2.get("物流金额优惠卡"):
            if logistics_price > discount_card.discount and discount_card.expire_time > time.time()*1000:
                logistics_price = Decimal(str(logistics_price)) - Decimal(str(discount_card.discount))

    return logistics_price

