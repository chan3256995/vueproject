# 订单状态选择
status_choices = (
    (1, '待付款'),
    (2, '已付款'),
    (3, '拿货中'),
    (4, '已拿货'),
    (5, '已发货'),
    (6, '退款中'),
    (7, '已取消'),
)
status_choices2 = {
    '待付款': 1,
    '已付款': 2,
    '拿货中': 3,
    '已拿货': 4,
    '已发货': 5,
    '已退款': 6,
    '缺货': 7,
}
print(status_choices[1])
print(status_choices2['已付款'])
print(status_choices2.get('已付款'))