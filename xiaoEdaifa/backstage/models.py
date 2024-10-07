from django.db import models

# Create your models here.
from django.db import models

from user.models import User

class ThreadTask(models.Model):
    # 任务名
    task_name = models.CharField(max_length=40, null=False,unique=True)
    describe = models.CharField(max_length=150, null=True)
    # 任务执行时间间隔 单位为秒
    time_interval = models.IntegerField(null=False)
    # 最后一次运行时间
    last_run_time = models.BigIntegerField(null=True)
    # 是否继续运行
    is_run = models.BooleanField(default=False)

    add_time = models.BigIntegerField(null=True)


# 问题单跟单
class TroubleOrders(models.Model):
    # 添加数据的账号
    owner = models.ForeignKey(User, on_delete=models.CASCADE)

    # 快递单号
    logistics_number = models.CharField(max_length=20, null=True)
    # 平台订单号
    plat_form_order_number = models.CharField(max_length=64, null=True)
    # 所属平台  0其他 1淘宝  2拼多多 3抖音 4京东
    plat_form = models.SmallIntegerField(null=True, default=0)

    # 订单状态 0 未处理 1跟进中 2已完结
    order_status  = models.SmallIntegerField(null=True, default=1)
    # 店铺名
    shop_name = models.CharField(max_length=128, null=True)

    # 备注
    remarks = models.CharField(max_length=200, null=True)

    update_time = models.BigIntegerField(null=False,default=0)

    add_time = models.BigIntegerField(null=False,default=0)


# 电商平台订单信息
class PlatformOrder(models.Model):
    add_time = models.BigIntegerField(null=False)
    # 店铺名
    shop_name = models.CharField(max_length=80)
    shop_id = models.CharField(null=True,max_length=80)
    # 账户
    account = models.CharField(max_length=80)
    # 订单号
    order_number = models.CharField(unique=True, max_length=80)
    # 物流信息

    logistics_info = models.CharField(null=True, max_length=500)
    # 物流单号
    logistics_number = models.CharField(null=False, max_length=40)
    # 物流是否已入库
    logistics_is_inbounded =  models.BooleanField(default=False)
    # 数据来源  如拼多多 淘宝
    data_source = models.CharField(null=True, max_length=20)


# 电商平台订单信息
class PlatformOrderGoods(models.Model):
    # 属于那个订单
    platformOrder = models.ForeignKey(PlatformOrder, related_name="platformOrderGoods", on_delete=models.CASCADE)

    # 商品图片
    image_src =  models.CharField(max_length=300)
    goods_name =  models.CharField(max_length=150)
    goods_id =  models.CharField(max_length=30)
    # 尺码颜色
    color_size = models.CharField( max_length=200)
    # 数量
    goods_count = models.SmallIntegerField(null=False)
    # 单价
    goods_price = models.IntegerField(null=True)

    add_time = models.BigIntegerField(null=False)


# 电商平台的商品信息
class PlatformGoods(models.Model):

    # 数据来源  如拼多多 淘宝
    data_source = models.CharField(null=True, max_length=20)
    shop_unique_id =  models.CharField(null=True,max_length=80)
    # 商品图片
    image_src = models.CharField(max_length=300)
    goods_name = models.CharField(max_length=150)
    goods_id = models.CharField(max_length=30)
    goods_id_md5 = models.CharField(max_length=30)
    # 商品编码
    goods_code = models.CharField(null=True,max_length=60)
    # 单价
    goods_price = models.IntegerField(null=True)
    remarks = models.CharField(max_length=1000,null=True)
    add_time = models.BigIntegerField(null=False)