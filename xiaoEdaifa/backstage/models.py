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

