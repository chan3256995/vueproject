import logging
from trade import models as trade_models
from user import  models as user_models
from utils import mcommon
from django.db import transaction
from utils import mtime
from django.db.models import Q
from _decimal import Decimal
logger = logging.getLogger('stu')
from utils import encryptions
import traceback



# 充值订单审核
def recharge_pass(trade_number):
    try:
        trade_info = trade_models.TradeInfo.objects.filter(trade_number=trade_number).first()
        if trade_info.cash_in_out_type == mcommon.cash_in_out_type_choices2.get("收入"):
            with transaction.atomic():
                user = user_models.User.objects.filter(id=trade_info.user.id).first()

                user.balance = float(Decimal(str(user.balance)) + Decimal(str(trade_info.trade_money)))
                trade_info.user_balance = user.balance
                trade_info.is_pass = True
                user.save()
                trade_info.save()

    except:
        traceback.print_exc()
        raise Exception(traceback.format_exc())
    return True


def change_tomorrow_status():
    zero_clock_stamp = mtime.get_time_0clock_of_today()
    order_goods_queryset = trade_models.OrderGoods.objects.filter(
        Q(status=mcommon.status_choices2.get('明日有货')) & Q(add_time__lt=zero_clock_stamp) & Q(
            refund_apply_status=mcommon.refund_apply_choices2.get('无售后'))).distinct()
    for order_goods in order_goods_queryset:
        order_goods.status = mcommon.status_choices2.get('已付款')
        order_goods.save()
