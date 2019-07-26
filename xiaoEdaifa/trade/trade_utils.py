# 返回一个交易号
def get_trade_number(user):
    # 当前时间+userid+随机数
    from time import strftime
    from random import Random
    random_ins = Random()
    trade_number = "tr{time_str}{userid}{ranstr}".format(time_str=strftime("%Y%m%d%H%M%S"),
                                                         userid=user.id,
                                                         ranstr=random_ins.randint(10, 99999))
    return trade_number