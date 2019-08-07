
from hashlib import sha1
from xiaoEdaifa import settings
from django.core.mail import send_mail
import os,django


def send(subject, message, sender, receiver, html_message):
    # 只有加了下面两行  用 send_mail() 函数 才不会出错
    os.environ.setdefault("DJANGO_SETTINGS_MODULE", "xiaoEdaifa.settings")  # project_name 项目名称 要并写正确
    django.setup()
    # subject = '主题'
    # message = '内容'
    # sender = settings.EMAIL_FROM		#发送邮箱，已经在settings.py设置，直接导入
    # receiver = ['80131490@qq.com']		#目标邮箱
    # html_message = '八嘎牙路'		#发送html格式
    send_mail(subject=subject, message=message, sender=sender, receiver=receiver, html_message=html_message)

send()	#使用函数)

