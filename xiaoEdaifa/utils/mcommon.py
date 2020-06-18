cash_in_out_platform_choices=(
    (0, '无'),
    (1, '支付宝'),
    (2, '微信'),
)
cash_in_out_type_choices =(
    (1, '收入'),
    (2, '支出'),
)
# 打折卡
discount_card_type_choices=(
    (1, '物流金额优惠卡'),
    (2, '物流折扣率优惠卡'),

)

# 打折卡
discount_card_type_choices2 = {
     '物流金额优惠卡': 1,
     '物流折扣率优惠卡': 2,

}

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
    (6, '空包'),
)
trade_source_choices2 = {
    '订单': 1,
    '商品': 2,
    '充值': 3,
    '提现': 4,
    '其他费用': 5,
    '空包': 6,
}
# 商品状态
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
    (12, '已下架'),
    (13, '2-5天有货'),
    (14, '其他'),
)
# 商品状态
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
    '已下架': 12,
    '2-5天有货': 13,
    '其他': 14,


}

# 备注选择
remarks_type_choices = (
    ("灰", '灰'),
    ("红", '红'),
    ("黄", '黄'),
    ("绿", '绿'),
    ("蓝", '蓝'),
    ("紫", '紫'),

)

# 备注选择
remarks_type_choices2= {

"":None,
"灰":"灰",
"红":"红",
"黄":"黄",
"绿":"绿",
"蓝":"蓝",
"紫":"紫",

}
# 订单状态
order_status_choices = (
    (0, '未处理'),
    (1, '快递打印'),
    (2, '已发货'),
)

# 订单状态
order_status_choices2 = {
    '未处理': 0,
    '快递打印': 1,
    '已发货': 2,
}

# 空包订单状态
null_package_order_status_choices = (
    (1, '未付款'),
    (2, '已付款'),
    (3, '快递打印'),
    (4, '已发货'),
    (5, '已退款'),
)
# 空包订单状态
null_package_order_status_choices2 = {
    '未付款': 1,
    '已付款': 2,
    '快递打印': 3,
    '已发货': 4,
    '已退款': 5,

}
# 公用的审核状态
common_check_status_choices = (
    (0, '未审核'),
    (1, '审核通过'),
    (2, '审核不通过'),
)

# 公用的审核状态
common_check_status_choices2 = {
    '未审核': 0,
    '审核通过': 1,
    '审核不通过': 2,
}
# 售后申请原因
refund_apply_reasons_choices = (
    (0, '其他'),
    (1, '质量问题'),
    (2, '尺码发错'),
    (3, '颜色发错'),
    (4, '款式发错'),
)

refund_apply_reasons_choices2 = {
    '其他': 0,
    '质量问题': 1,
    '尺码发错': 2,
    '颜色发错': 3,
    '款式发错': 4,


}

# 售后进度
refund_apply_progress_choices = (
    (0, '未处理'),
    (1, '已退款(仅退款)'),
    (2, '已退货退款'),
    (3, '拒绝退款'),
    (4, '仓库已收到退件'),
    (5, '拦截中'),
)

refund_apply_progress_choices2 = {
    '未处理': 0,
    '已退款(仅退款)': 1,
    '已退货退款': 2,
    '拒绝退款': 3,
    '仓库已收到退件': 4,
    '拦截中': 5,


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

# 退货服务费
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
