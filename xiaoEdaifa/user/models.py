from django.db import models

# Create your models here.
from django.db import models


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



class UserToken(models.Model):
    user = models.OneToOneField(to='User', on_delete=models.CASCADE)
    token = models.CharField(max_length=128)
    add_time = models.BigIntegerField()
