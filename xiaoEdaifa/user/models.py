from django.db import models

# Create your models here.
from django.db import models
from utils import mcommon


# Create your models here.
class User(models.Model):
    user_type_choices =(
        (1, '客户'),
        (2, '拿货人')
    )
    user_name = models.CharField(max_length=30, null=False, unique=True)
    qq = models.BigIntegerField(null=True, unique=True)
    email = models.CharField(max_length=30, null=True, unique=True)
    password = models.CharField(max_length=128, null=False)
    # 用户类型
    type = models.SmallIntegerField(choices=user_type_choices,default=1)
    phone = models.BigIntegerField(null=True, unique=True)
    add_time = models.BigIntegerField(null=True)
    # 余额
    balance = models.FloatField(default=0.0)
    pay_password = models.CharField(max_length=128, null=True)


# 邀请注册信息
class InviteRegisterInfo(models.Model):
    # 邀请人
    inviter = models.ForeignKey(User, on_delete=models.CASCADE)
    # 受邀人
    be_inviter = models.ForeignKey(User, on_delete=models.CASCADE, related_name='be_inviter')
    # 审核状态
    check_status = models.SmallIntegerField(choices=mcommon.common_check_status_choices)
    check_time = models.BigIntegerField()
    add_time = models.BigIntegerField()


# 用户支付宝真实信息
class UserAlipayRealInfo(models.Model):
    user = models.OneToOneField(to='User', on_delete=models.CASCADE,unique=True)
    alipay_account = models.CharField(max_length=50, null=False, unique=True)
    alipay_real_name = models.CharField(max_length=30, null=False)
    # 提交的审核转账单号  0.8元
    check_trade_no = models.CharField(max_length=50, null=True)
    # 审核状态
    check_status = models.SmallIntegerField(choices=mcommon.common_check_status_choices,default=mcommon.common_check_status_choices2.get('未审核'))
    check_time = models.BigIntegerField()
    add_time = models.BigIntegerField()


class UserToken(models.Model):
    user = models.OneToOneField(to='User', on_delete=models.CASCADE)
    token = models.CharField(max_length=128)
    add_time = models.BigIntegerField()
