import  time
from utils import mcommon
from trade import models as trade_models
from user import  models as user_models
from utils import mcommon
from _decimal import Decimal
import utils
import traceback
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


def add_discount_card_to_sql(discount_card):

    try:
        if isinstance(discount_card.get('user'),user_models.User):
            req_data = {
                "user": discount_card.get('user'),
                "add_time": discount_card.get('add_time'),
                "discount_card_type": discount_card.get('discount_card_type'),
                "discount": discount_card.get('discount'),
                "expire_time": discount_card.get('expire_time'),
            }
            card = trade_models.DiscountCard.objects.filter(user=discount_card.get('user')).first()
            if card is not None:
                if card.discount_card_type == discount_card.get('discount_card_type') :
                    cur_timesmtp = (time.time() * 1000)
                    if card.expire_time > cur_timesmtp and card.discount == float(req_data.get("discount")):
                        # 有未过期的相同类型的优惠卡 时间叠加
                        req_data['expire_time'] = card.expire_time +  (req_data.get('expire_time') - cur_timesmtp)
                    else:
                        return False

                card.delete()
            trade_models.DiscountCard.objects.create(**req_data)
        else:
            return False
    except:
        traceback.print_exc()
        raise Exception
    return True


# 重新计算用户未付款订单的费用    物流费 商品费 质检费 代拿费 订单总价格

def re_calc_un_pay_order_fee(self, order):

    order_goods_list = trade_models.OrderGoods.objects.filter(order=order)
    logistics = trade_models.Logistics.objects.filter(logistics_name=order.logistics_name).first()
    discount_card = trade_models.DiscountCard.objects.filter(user=self.request.user).first()
    logistics_price = logistics.logistics_price
    logistics_fee = logistics_price
    order_agency_fee = 0  # 代拿费用
    # 订单里商品送数量
    order_goods_counts = 0
    # 默认 无质检
    quality_testing_fee = 0.0
    # 商品总费用
    order_goods_fee = 0
    if discount_card is not None:
        curr_time = time.time()*1000
        if discount_card.discount_card_type == mcommon.discount_card_type_choices2.get("物流金额优惠卡") and discount_card.expire_time > curr_time:
            if logistics_price > discount_card.discount:
                logistics_price = Decimal(str(logistics_price)) - Decimal(str(discount_card.discount))
                logistics_fee = logistics_price

    for og in order_goods_list:
        order_goods_counts = order_goods_counts + og.goods_count
        order_agency_fee = Decimal(str(order_agency_fee)) + Decimal(str(og.goods_count)) * Decimal(
            str(utils.String.AGENCY_FEE))
        order_goods_fee = Decimal(str(order_goods_fee)) + Decimal(str(og.goods_price)) * Decimal(str(og.goods_count))
    if order_goods_counts > 2:
        # 超出数量 每件3元计算
        extra_counts = order_goods_counts - 2
        logistics_fee = Decimal(str(logistics_price)) + (Decimal(str(extra_counts)) * Decimal(str(3)))

    quality_test_query = trade_models.QualityTest.objects.filter( quality_testing_name=order.quality_testing_name).first()
    # 质检服务费
    if quality_test_query is not None:
        quality_testing_fee = Decimal(str(quality_test_query.quality_testing_price)) * Decimal(str(order_goods_counts))
    total_fee = Decimal(str(order_goods_fee)) + Decimal(str(logistics_fee)) + Decimal(str(order_agency_fee)) + Decimal(str(quality_testing_fee))
    # order.quality_testing_fee = quality_testing_fee
    # order.logistics_fee = logistics_fee
    # order.agency_fee = order_agency_fee
    # order.total_price = total_fee
    # order.save()
    print(quality_testing_fee, logistics_fee, order_agency_fee, total_fee)
    return quality_testing_fee, logistics_fee, order_agency_fee, total_fee


# 重新计算用户已经支付订单的费用    物流费 商品费 质检费 代拿费 订单总价格

def re_calc_payed_order_fee(self, order):
    order_goods_list = trade_models.OrderGoods.objects.filter(order=order)
    logistics = trade_models.Logistics.objects.filter(logistics_name=order.logistics_name).first()
    discount_card = trade_models.DiscountCard.objects.filter(user=self.request.user).first()
    logistics_price = logistics.logistics_price
    logistics_fee = logistics_price
    order_agency_fee = 0  # 代拿费用
    # 订单里商品送数量
    order_goods_counts = 0
    # 默认 无质检
    quality_testing_fee = 0.0
    # 商品总费用
    order_goods_fee = 0
    if discount_card is not None:
        curr_time = time.time() * 1000
        if discount_card.discount_card_type == mcommon.discount_card_type_choices2.get(
                "物流金额优惠卡") and discount_card.expire_time > curr_time:
            if logistics_price > discount_card.discount:
                logistics_price = Decimal(str(logistics_price)) - Decimal(str(discount_card.discount))
                logistics_fee = logistics_price
    active_goods_counts = 0  # 计算有效商品数量
    for og in order_goods_list:
        # 有效商品
        if og.status != mcommon.status_choices2.get('待付款') and og.status != mcommon.status_choices2.get('已退款') and og.status != mcommon.status_choices2.get('已取消'):
            active_goods_counts = Decimal(str(active_goods_counts)) + Decimal(str(og.goods_count))

            order_agency_fee = Decimal(str(order_agency_fee)) + Decimal(str(og.goods_count)) * Decimal( str(utils.String.AGENCY_FEE))
            order_goods_fee = Decimal(str(order_goods_fee)) + Decimal(str(og.goods_price)) * Decimal(str(og.goods_count))
    if active_goods_counts > 2:
        # 超出数量 每件3元计算
        extra_counts = active_goods_counts - 2
        logistics_fee = Decimal(str(logistics_price)) + (Decimal(str(extra_counts)) * Decimal(str(3)))

    quality_test_query = trade_models.QualityTest.objects.filter(
        quality_testing_name=order.quality_testing_name).first()
    # 质检服务费
    if quality_test_query is not None:
        quality_testing_fee = Decimal(str(quality_test_query.quality_testing_price)) * Decimal(str(order_goods_counts))

    total_fee = Decimal(str(order_goods_fee)) + Decimal(str(logistics_fee)) + Decimal(str(order_agency_fee)) + Decimal(
        str(quality_testing_fee))
    # order.quality_testing_fee = quality_testing_fee
    # order.logistics_fee = logistics_fee
    # order.agency_fee = order_agency_fee
    # order.total_price = total_fee
    # order.save()
    print(quality_testing_fee, logistics_fee, order_agency_fee, total_fee)
    return quality_testing_fee, logistics_fee, order_agency_fee, total_fee
