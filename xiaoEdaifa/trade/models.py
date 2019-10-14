from django.db import models
from django.contrib.contenttypes.fields import GenericForeignKey, GenericRelation
# Create your models here.
from django.contrib.contenttypes import models as con_models
from django.db import models
from user.models import User
from utils import mcommon
import time


# 保存在本地的商品
class Goods(models.Model):
    # 货源网址soukw
    origin_url = models.CharField(max_length=120, null=True)
    # 商品主图
    image_url = models.CharField(max_length=120, null=True)
    # 店铺市场名 女人街
    shop_market_name = models.CharField(max_length=120, null=False)
    # 店铺楼层 2楼
    shop_floor = models.CharField(max_length=120, null=False)
    # 店铺地址 档口吗
    shop_stalls_no = models.CharField(max_length=120, null=False)
    # 货号
    art_no = models.CharField(max_length=20, null=False)
    goods_price = models.FloatField(null=False)
    goods_color = models.CharField(max_length=10, null=False)
    goods_size = models.CharField(max_length=10, null=False,default="")
    add_time = models.BigIntegerField(null=False)
    # 是否删除（逻辑删除）
    is_delete = models.BooleanField(default=False, null=False)
    add_time = models.BigIntegerField(null=False)


class TradeInfo(models.Model):
    # 所属用户
    user = models.ForeignKey(User,on_delete=models.CASCADE)
    # 交易流水号
    trade_number = models.CharField(max_length=30, null=False, unique=True)
    # 用户当前剩下金额
    user_balance = models.FloatField(null = True)
    # 标记
    mark = models.CharField(max_length=30,default="")
    # 交易来源
    trade_source = models.SmallIntegerField(choices=mcommon.trade_source_choices)
    message = models.CharField(max_length=256,null=True)
    #  订单号
    order_number = models.CharField(max_length=30, null=True)
    # 充值号 如支付宝 微信充值订单号
    recharge_number = models.CharField(max_length=64,null=True)
    # 收入或支出
    cash_in_out_type = models.SmallIntegerField(choices=mcommon.cash_in_out_type_choices)
    # 交易金额
    trade_money = models.FloatField(null=False)
    # 该交易是否通过
    is_pass = models.BooleanField(default=False)
    add_time = models.BigIntegerField(null=False)
    # 是否删除（逻辑删除）
    is_delete = models.BooleanField(default=False, null=False)





# 质检服务
class QualityTest(models.Model):
    quality_testing_name = models.CharField(null=False,max_length=40,unique=True)
    quality_testing_price = models.FloatField(null=False)


# 快递
class Logistics(models.Model):
    logistics_name = models.CharField(null=False,max_length=40,unique=True)
    logistics_price = models.FloatField(null=False,max_length=40,default=4.0)


# 订单
class Order(models.Model):
    order_owner = models.ForeignKey(User, on_delete=models.CASCADE)
    # 订单跟进人
    order_follower = models.ForeignKey(User,null = True,default=None,on_delete=models.SET_NULL,related_name="orderFollower")
    # 订单号
    order_number = models.CharField(max_length=30, null=False ,unique=True)
    # 付款单号
    pay_no = models.CharField(max_length=128, null=True)

    # 收件人信息
    consignee_address = models.CharField(null=False,max_length=140)
    consignee_name = models.CharField(max_length=30,null=False)
    consignee_phone = models.BigIntegerField(null=False)

    # 寄件人信息
    sender_address = models.CharField(null=False, max_length=140)
    sender_name = models.CharField(max_length=30, null=False)
    sender_phone = models.BigIntegerField(null=False)
    # 物流单号是否已打印
    is_logistics_print = models.BooleanField(default=False)
    # 是否删除（逻辑删除）
    is_delete = models.BooleanField(default=False, null=False)
    # 质检服务
    quality_testing_name = models.CharField(null=True,max_length=30)
    # 质检费用
    quality_testing_fee = models.FloatField(default=0.0)
    # 运费
    logistics_fee = models.FloatField()
    # 代拿费用
    agency_fee = models.FloatField(default=0.0)
    # 物流名
    logistics_name = models.CharField(null=True,max_length=30)
    # 物流单号
    logistics_number = models.CharField(null=True, max_length=30)
    # 重量
    weight = models.FloatField(default="0.0")
    # 总价格
    total_price = models.FloatField(default="0.0")
    add_time = models.BigIntegerField(null=False)


# 订单商品
class OrderGoods(models.Model):


    # 订单状态选择
    status_choices = mcommon.status_choices
    # 退款状态
    refund_apply_choices = mcommon.refund_apply_choices
    # 订单号
    goods_number = models.CharField(max_length=30, null=True, unique=True)
    refund_apply_status = models.SmallIntegerField(choices = refund_apply_choices , default=0)
    # 数据库保存的商品
    goods = models.ForeignKey(Goods, on_delete=models.CASCADE,null=True)
    # 属于那个订单
    order = models.ForeignKey(Order,  related_name="orderGoods", on_delete=models.CASCADE)
    # 商品状态
    status = models.IntegerField(choices=status_choices, null=False)
    # 商品日志
    log = models.CharField(null=True,max_length=2048)
    # 是否打印标签
    is_tag_print = models.BooleanField(default=False)
    # 是否被拦截
    is_stop_deliver = models.BooleanField(default=False)
    # 客服留言
    customer_service_message = models.CharField(null=True,max_length=2048)
    # 下单人留言
    customer_message = models.CharField(null=True,max_length=2048)
    # 货源网址soukw
    origin_url = models.CharField(max_length=120, null=True)
    # 店铺市场名 女人街
    shop_market_name = models.CharField(max_length=120, null=False)
    # 店铺楼层 2楼
    shop_floor = models.CharField(max_length=120, null=False)
    # 店铺地址 档口吗
    shop_stalls_no = models.CharField(max_length=120, null=False)
    # 货号
    art_no = models.CharField(max_length=20, null=False)
    goods_price = models.FloatField(null=False)
    goods_color = models.CharField(max_length=30, null=False)
    goods_size = models.CharField(max_length=30, null=False)
    goods_count = models.IntegerField(default=1)
    add_time = models.BigIntegerField(null=False)
    return_logistics_name = models.CharField(null=True,max_length=30)
    # 退货物流单号
    return_logistics_number = models.CharField(null=True, max_length=40)

    # 是否删除（逻辑删除）
    is_delete = models.BooleanField(default=False, null=False)



# 售后申请
class RefundApply(models.Model):
    orderGoods = models.ForeignKey(OrderGoods,related_name="refund_apply", on_delete=models.CASCADE)
    add_time = models.BigIntegerField(default=time.time())
    refund_apply_choices = mcommon.refund_apply_choices
    refund_apply_type = models.SmallIntegerField(choices=refund_apply_choices, null=False)
    apply_message = models.CharField(max_length=256)
    # 申请退货商品数量
    goods_counts = models.SmallIntegerField(default=1)
    return_logistics_name = models.CharField(null=False, max_length=30)
    # 退货物流单号
    return_logistics_number = models.CharField(null=False, max_length=40)





class RefundInfo(models.Model):
    """
    退款信息
    """
    # 退款订单商品
    order_goods = models.ForeignKey(OrderGoods, on_delete=models.CASCADE)
    # 退款流水号
    refund_sn = models.CharField(max_length=128,null=False,unique=True)
    # 退款金额
    refund_money_amount = models.FloatField(null=False)
    add_time = models.BigIntegerField(null=False)