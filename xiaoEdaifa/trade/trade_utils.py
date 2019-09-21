import  time
from utils import mcommon
from trade import models as trade_models
# 返回一个交易号
def get_trade_number(user):
    # 当前时间+userid+随机数
    from time import strftime
    from random import Random
    random_ins = Random()
    trade_number = "tr{time_str}{userid}{ranstr}".format(time_str=strftime("%Y%m%d%H%M%S"),
                                                         userid=user.id,
                                                         ranstr=random_ins.randint(10, 99999))
    return trade_number


def create_refund_apply(order_goods,refund_apply_type,apply_message,goods_counts,return_logistics_name,return_logistics_number):
    req_data = {
        "orderGoods": order_goods,
        "add_time": time.time() * 1000,
        "refund_apply_type": refund_apply_type,
        "apply_message": apply_message,
        "goods_counts": goods_counts,
        "return_logistics_name": return_logistics_name,
        "return_logistics_number":return_logistics_number,
    }
    refundApply = trade_models.RefundApply.objects.create(req_data)

    order_goods.refund_apply_status = mcommon.refund_apply_choices2.get("退货退款")
    order_goods.save()


# 生成一个交易单号
def get_trade_number(self,user_id):
        # 当前时间+userid+随机数
        from time import strftime
        from random import Random
        random_ins = Random()
        trade_number = "tr{time_str}{userid}{ranstr}".format(time_str=strftime("%Y%m%d%H%M%S"),
                                                                 userid=user_id,
                                                                 ranstr=random_ins.randint(10, 99999))
        return trade_number
