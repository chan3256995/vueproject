cash_in_out_platform_choices=(
    (0, '无'),
    (1, '支付宝'),
    (2, '微信'),
)
cash_in_out_type_choices =(
    (1, '收入'),
    (2, '支出'),
)

cash_in_out_type_choices2 = {
    '收入': 1,
    '支出': 2,
}
trade_source_choices = (
    (1, '订单'),
    (2, '商品'),
    (3, '充值'),
    (4, '提现'),
    (5, '其他费用'),
)
trade_source_choices2 = {
    '订单': 1,
    '商品': 2,
    '充值': 3,
    '提现': 4,
    '其他费用': 5,
}

status_choices = (
    (1, '待付款'),
    (2, '已付款'),
    (3, '拿货中'),
    (4, '已拿货'),
    (5, '已发货'),
    (6, '已退款'),
    (7, '明日有货'),
    (8, '已取消'),
    (9, '缺货'),
    (10, '标签打印'),
    (11, '快递打印'),
)

status_choices2 = {
    '待付款': 1,
    '已付款': 2,
    '拿货中': 3,
    '已拿货': 4,
    '已发货': 5,
    '已退款': 6,
    '明日有货': 7,
    '已取消': 8,
    '缺货': 9,
    '标签打印': 10,
    '快递打印': 11,
}

refund_apply_choices = (
    (0, '无售后'),
    (1, '退货退款'),
    (2, '仅退款'),
    (3, '换货'),
    (4, '取消订单'),
    (5, '拦截发货'),

)

refund_apply_choices2 = {
    '无售后': 0,
    '退货退款': 1,
    '仅退款': 2,
    '换货': 3,
    '取消订单': 4,
    '拦截发货': 5,
}

# 服务费
service_fee = 2.0

market_short_name = {
    '国投': "投",
    '国大': "大",
    '金富丽': "富",
    '佰润': "佰",
    '女人街': "女",
    '大时代': "时",
    '非凡': "非",
    '宝华': "宝",
    '新金马': "新金",
    '柏美': "柏",
    '新潮都': "潮",
    '三晟': "晟",
    '大西豪': "豪",
    '西街': "西街",
    '犀牛角': "犀",
    '景叶': "景",
    '跨客城': "跨",
    '国大金沙': "金沙",
    '老金马' : "老金",
    '国泰': "泰",
    '拼商城': "拼",
    '泓发': "泓",
    '大利广场': "利",
    '国润': "润",
    '国马': "国马",
    '东金网批': "东金"
}


def get_time_0clock_of_today():
    import time
    # 当天0点时间戳
    zero_point = int(time.time()) - int(time.time() - time.timezone) % 86400
    return zero_point


def get_time_0clock_of_yestoday():
    import time
    # 当天0点时间戳
    zero_point = int(time.time()) - int(time.time() - time.timezone) % 86400
    # 昨天0点时间戳
    yesterday_zero_point = zero_point - 86400
    return yesterday_zero_point


def format_from_time_stamp(time_stamp):
    import time
    time_array = time.localtime(time_stamp)
    other_style_time = time.strftime("%Y-%m-%d %H:%M:%S", time_array)
    return other_style_time


# 发送邮件
def send_email(subject, message, sender, receiver, html_message):
    from django.core.mail import send_mail
    import os, django
    # 只有加了下面两行  用 send_mail() 函数 才不会出错
    os.environ.setdefault("DJANGO_SETTINGS_MODULE", "xiaoEdaifa.settings")  # project_name 项目名称 要并写正确
    django.setup()
    # subject = '主题'
    # message = '内容'
    # sender = settings.EMAIL_FROM		#发送邮箱，已经在settings.py设置，直接导入
    # receiver = ['80131490@qq.com']		#目标邮箱
    # html_message = '八嘎牙路'		#发送html格式
    # django 封装了发送邮件函数 再setting 读取邮件配置参数
    send_mail(subject=subject, message=message, from_email=sender, recipient_list=receiver, html_message=html_message)
