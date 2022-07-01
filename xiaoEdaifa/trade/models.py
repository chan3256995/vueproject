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
    origin_url = models.CharField(max_length=240, null=True)
    # 商品主图
    image_url = models.CharField(max_length=240, null=True)
    # 店铺市场名 女人街
    shop_market_name = models.CharField(max_length=120, null=False)
    # 店铺楼层 2楼
    shop_floor = models.CharField(max_length=120, null=False)
    # 店铺地址 档口吗
    shop_stalls_no = models.CharField(max_length=120, null=False)
    # 货号
    art_no = models.CharField(max_length=50, null=False)
    goods_price = models.FloatField(null=False)
    goods_color = models.CharField(max_length=50, null=False)
    goods_size = models.CharField(max_length=50, null=False,default="")
    add_time = models.BigIntegerField(null=False)
    # 是否删除（逻辑删除）
    is_delete = models.BooleanField(default=False, null=False)
    add_time = models.BigIntegerField(null=False)


# 用户保存在本地的商品
class UserGoods(models.Model):
    goods_owner = models.ForeignKey(User, on_delete=models.CASCADE)
    # 货源网址soukw
    origin_url = models.CharField(max_length=240, null=True)
    # 商品主图
    image_url = models.CharField(max_length=240, null=True)
    # 用户自定义唯一标识
    user_code = models.CharField(max_length=120, null=True)
    # 替换字符规则  比如颜色字符替换  价格替换等
    replace_string = models.CharField(max_length=120, null=True)
    # 店铺市场名 女人街
    shop_market_name = models.CharField(max_length=120, null=False)
    # 店铺楼层 2楼
    shop_floor = models.CharField(max_length=120, null=False)
    # 店铺地址 档口吗
    shop_stalls_no = models.CharField(max_length=120, null=False)
    # 店铺档口名
    shop_name = models.CharField(max_length=120, null=True)
    # 货号
    art_no = models.CharField(max_length=50, null=False)
    goods_price = models.FloatField(null=False)
    goods_color = models.CharField(max_length=50, null=False)
    goods_size = models.CharField(max_length=50, null=False,default="")
    goods_title = models.CharField(max_length=200, null=True)
    # 备注
    remarks = models.CharField(max_length=200, null=True)
    add_time = models.BigIntegerField(null=False)
    # 是否删除（逻辑删除）
    is_delete = models.BooleanField(default=False, null=False)
    # 是否默认
    is_default = models.BooleanField(default=False, null=False)

# ********************************抖音********************************



# 用户添加的抖音店铺
class UserFocusDouYinShop(models.Model):
    owner = models.ForeignKey(User, on_delete=models.CASCADE)
    # 字符ID
    shop_id = models.CharField(null=False,max_length=40,unique=True)
    # 要监控的地址
    monitor_url = models.CharField(max_length=1024, null=True)
    # 数字ID
    shop_id2 = models.CharField(null=False,max_length=40,unique=True, blank=True)
    # 店铺主图
    image_url = models.CharField(max_length=240, null=True)

    # 店铺名
    shop_name = models.CharField(max_length=120, null=True)
    # 备注
    remarks = models.CharField(max_length=200, null=True)
    # 是否监控
    is_monitor = models.BooleanField(default=False, null=False)
    update_time = models.BigIntegerField(null=False,default=0)
    add_time = models.BigIntegerField(null=False)


class UserFavDouYinShopInfo(models.Model):
    owner = models.ForeignKey(User, on_delete=models.CASCADE)
    dou_yin_shop = models.ForeignKey(UserFocusDouYinShop, on_delete=models.CASCADE)
    # 备注
    remarks = models.CharField(max_length=200, null=True)
    # 是否监控
    is_monitor = models.BooleanField(default=False, null=False)
    # 要监控的地址
    monitor_url = models.CharField(max_length=1024, null=True)

    # 分组
    type = models.SmallIntegerField(choices=mcommon.dou_yin_fav_shop_type_choices,default=1)
    add_time = models.BigIntegerField(null=False)


# 抖音商品
class DouYinGoods(models.Model):
    owner = models.ForeignKey(User, on_delete=models.CASCADE)
    dou_yin_shop = models.ForeignKey(UserFocusDouYinShop,related_name="douYinGoods" ,on_delete=models.CASCADE)
    #
    image = models.CharField(max_length=240, null=True)
    img = models.CharField(max_length=240, null=True)
    discount_price = models.FloatField(null=False)
    goods_price = models.FloatField(null=False)
    market_price = models.FloatField(null=False)
    show_price = models.FloatField(null=False)
    goods_id = models.CharField(max_length=64,null=False,unique=True)
    goods_name = models.CharField(max_length=160, null=True)
    name = models.CharField(max_length=160, null=True)
    shop_id = models.CharField(max_length=120, null=True)
    product_id = models.CharField(max_length=120, null=True,unique=True)
    sell_num = models.IntegerField(null=False,default=0)
    today_sell_num =  models.IntegerField(null=True,default=0)
    add_time = models.BigIntegerField(null=False)
    update_time = models.BigIntegerField(null=False)


# 抖音商品采集记录
class DouYinGoodsCollectRecord(models.Model):
    dou_yin_goods = models.ForeignKey(DouYinGoods, on_delete=models.CASCADE)
    discount_price = models.FloatField(null=False)
    goods_price = models.FloatField(null=False)
    market_price = models.FloatField(null=False)
    show_price = models.FloatField(null=False)
    goods_id = models.CharField(max_length=64,null=False)
    goods_name = models.CharField(max_length=160, null=True)
    name = models.CharField(max_length=160, null=True)
    product_id = models.CharField(max_length=120, null=True)
    sell_num = models.IntegerField(null=False,default=0)
    add_time = models.BigIntegerField(null=False)



# ********************************抖音********************************


class TradeInfo(models.Model):
    # 所属用户
    user = models.ForeignKey(User,on_delete=models.CASCADE,null=True)
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
    order_follower = models.ForeignKey(User,null=True,default=None,on_delete=models.SET_NULL, related_name="orderFollower")
    order_remarks = models.ForeignKey("OrderRemarks",null=True,default=None,on_delete=models.SET_NULL ,related_name="orderRemarks")
    # 第三方平台名    淘宝 天猫  屁多多
    shop_platform = models.CharField(max_length=30,null=True)
    # 卖家旺旺id
    wangwang_id = models.CharField(max_length=40,null=True)
    shop_name = models.CharField(max_length=100,null=True)
    # 订单号
    order_number = models.CharField(max_length=30, null=False ,unique=True)
    # 淘宝订单号
    tb_order_number = models.CharField(max_length=30, null=True ,unique=True)
    # 付款单号
    pay_no = models.CharField(max_length=128, null=True)
    #  做标记用的（导出数据的时候用）
    tag_type = models.SmallIntegerField(null=True)
    # 收件人信息
    consignee_address = models.CharField(null=False,max_length=140)
    consignee_name = models.CharField(max_length=30,null=False)
    consignee_phone = models.CharField(max_length=30,null=False)

    # 寄件人信息
    sender_address = models.CharField(null=False, max_length=140)
    sender_name = models.CharField(max_length=30, null=False)
    sender_phone = models.CharField(max_length=30,null=False)
    # 是否已发货
    is_delivered = models.BooleanField(default=False)
    # 订单状态选择
    order_status = models.SmallIntegerField(choices=mcommon.order_status_choices,null=False,default=mcommon.order_status_choices2.get('未处理'))

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
    logistics_number = models.CharField(null=True, max_length=30,blank=True)
    # 重量
    weight = models.FloatField(default="0.0")
    # 总价格
    total_price = models.FloatField(default="0.0")
    update_time = models.BigIntegerField(null=False,default=0)
    add_time = models.BigIntegerField(null=False)


# 备注
class OrderRemarks(models.Model):
    order = models.ForeignKey(Order,on_delete=models.CASCADE)
    remarks_type = models.CharField(choices=mcommon.remarks_type_choices, null=False, max_length=10 )
    remarks_text = models.CharField(null=True ,max_length=40)


# 空包订单
class NullPackageOrder(models.Model):
    order_owner = models.ForeignKey(User, on_delete=models.CASCADE)

    # 订单号
    order_number = models.CharField(max_length=30, null=False ,unique=True)
    # 淘宝订单号
    tb_order_number = models.CharField(max_length=30, null=True ,unique=True)
    # 卖家旺旺ID
    tb_seller_wangwang_id = models.CharField(max_length=50, null=True ,unique=False)

    # 收件人信息
    consignee_address = models.CharField(null=False,max_length=140)
    consignee_name = models.CharField(max_length=30,null=False)
    consignee_phone = models.CharField(max_length=30,null=False)

    # 寄件人信息
    sender_address = models.CharField(null=False, max_length=140)
    sender_name = models.CharField(max_length=30, null=False)
    sender_phone = models.CharField(max_length=30,null=False)

    # 订单状态选择
    order_status = models.SmallIntegerField(choices=mcommon.null_package_order_status_choices,null=False,default=mcommon.null_package_order_status_choices2.get('未付款'))

    # 是否删除（逻辑删除）
    is_delete = models.BooleanField(default=False, null=False)

    # 运费
    logistics_fee = models.FloatField()

    tag_type = models.SmallIntegerField(null=True)

    # 物流名
    logistics_name = models.CharField(null=True,max_length=30)
    # 物流单号
    logistics_number = models.CharField(null=True, max_length=30)
    # 重量
    weight = models.FloatField(default="0.0")
    # 总价格
    total_price = models.FloatField(default="0.0")
    add_time = models.BigIntegerField(null=False)


# 空包订单临时表
class NullPackageTemp(models.Model):
    order_owner = models.ForeignKey(User, on_delete=models.CASCADE)
    # 淘宝订单号
    tb_order_number = models.CharField(max_length=30, null=True ,unique=True)
    # 卖家旺旺ID
    tb_seller_wangwang_id = models.CharField(max_length=50, null=True)
    # 收件人信息
    consignee_address = models.CharField(null=False,max_length=140)
    consignee_name = models.CharField(max_length=30,null=False)
    consignee_phone = models.CharField(max_length=30,null=False)
    add_time = models.BigIntegerField(null=False)


# 空包快递
class NullPackageLogistics(models.Model):
    logistics_name = models.CharField(null=False,max_length=40,unique=True)
    logistics_price = models.FloatField(null=False,max_length=40,default=4.0)


# 订单商品
class OrderGoods(models.Model):
    # 商品主图
    image_url = models.CharField(max_length=240, null=True)
    # 商品状态选择
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
    goods_color = models.CharField(max_length=50, null=False)
    goods_size = models.CharField(max_length=50, null=False)
    goods_count = models.IntegerField(default=1)
    tb_goods_id = models.CharField(null=True,  max_length=120)
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
    refund_apply_reasons_type = models.SmallIntegerField(choices=mcommon.refund_apply_reasons_choices, null=True,default=0)
    # 售后进度
    refund_apply_progress = models.SmallIntegerField(choices=mcommon.refund_apply_progress_choices, null=True,default=0)
    apply_message = models.CharField(max_length=256)
    # 申请退货商品数量
    goods_counts = models.SmallIntegerField(default=1)
    return_logistics_name = models.CharField(null=False, max_length=30)
    # 退货物流单号
    return_logistics_number = models.CharField(null=True, max_length=40,unique=True)


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


# 退回的包裹信息
class ReturnPackageInfo(models.Model):
    return_logistics_name = models.CharField(null=True, max_length=30)
    # 退货物流单号
    return_logistics_number = models.CharField(null=False, max_length=40,unique=True)
    add_time = models.BigIntegerField(null=False)


# 退回包裹的操作日志
class ReturnPackageLogInfo(models.Model):
    return_package = models.ForeignKey(ReturnPackageInfo, on_delete=models.CASCADE)
    operateUser = models.ForeignKey(User,default=None,null=True,on_delete=models.SET_NULL, related_name="operateUser")
    add_time = models.BigIntegerField(null=False)
    message = models.CharField(max_length=256, null=True)


# 折扣卡
class DiscountCard(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    discount_card_type = models.SmallIntegerField(choices=mcommon.discount_card_type_choices)
    # 折扣率 或 优惠面额
    discount = models.FloatField(null=False)
    add_time = models.BigIntegerField(null=False)
    # 过期时间
    expire_time = models.BigIntegerField(null=False)
