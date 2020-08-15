
STATIC_URL_BK = "http://39.96.69.115:8089"
STATIC_VUE_URL = "http://17daina.com"
# STATIC_URL_BK = "http://192.168.2.110:8009"
# STATIC_VUE_URL ="http://192.168.2.110:8082"


# 获取交易单号
class BaseTrade():
    def __init__(self,user):
        self.user = user

    def get_trade_number(self):
        # 当前时间+userid+随机数
        from time import strftime
        from random import Random
        random_ins = Random()
        trade_number = "tr{time_str}{userid}{ranstr}".format(time_str=strftime("%Y%m%d%H%M%S"),
                                                             userid=self.user.id,
                                                             ranstr=random_ins.randint(10, 99999))
        return trade_number
