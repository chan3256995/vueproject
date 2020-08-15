from django.db import models

# Create your models here.
from django.db import models


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
