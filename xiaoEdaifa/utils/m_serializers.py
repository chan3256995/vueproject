from rest_framework import serializers
from trade import models
from user import models as user_models
import re
from utils import encryptions
import time
import utils
from utils import mcommon


class UserDetailSerializer(serializers.ModelSerializer):
    """
    用户个人信息
    """
    class Meta:
        model = models.User
        fields = ("id","email", "type", "phone", "balance","user_name")


# 对 android 监听到（支付宝或其他）提交上来的支付信息进行校验
class PayInfoSerializer(serializers.ModelSerializer):

    # 充值号 如支付宝 微信充值订单号
    recharge_number = serializers.CharField(max_length=64)

    # 交易金额
    trade_money = serializers.FloatField(required=True)
    # 该交易是否通过
    is_pass = serializers.BooleanField(default=False)
    add_time = serializers.CharField(default=time.time()*1000)

    class Meta:
        model = models.TradeInfo
        fields = ["user","trade_money","recharge_number","is_pass","add_time"]
        depth = 0

    def validate_recharge_number(self,recharge_number):
        if recharge_number == "":
            raise serializers.ValidationError("充值号不能为空")
        return recharge_number

    def validate_trade_money(self,trade_money):
        try:
            trade_money = float(trade_money)
            if trade_money < 0 or trade_money == 0:
                raise serializers.ValidationError("充值金额要大于0")
        except:
            raise serializers.ValidationError("非法金额")
        return trade_money



# 用户提交充值信息
class RechargeBalanceSerializer(serializers.ModelSerializer):
    user = serializers.HiddenField(
        default=serializers.CurrentUserDefault()
    )
    # # 交易来源
    # trade_source = serializers.ChoiceField(choices=mcommon.trade_source_choices,required=True)

    # 充值号 如支付宝 微信充值订单号
    recharge_number = serializers.CharField(max_length=64)

    # 交易金额
    trade_money = serializers.FloatField(required=True)
    # 该交易是否通过
    is_pass = serializers.BooleanField(default=False)
    add_time = serializers.CharField(default=time.time()*1000)

    class Meta:
        model = models.TradeInfo
        fields = ["user","trade_money","recharge_number","is_pass","add_time"]
        depth = 0

    def validate_recharge_number(self,recharge_number):
        if recharge_number == "":
            raise serializers.ValidationError("充值号不能为空")
        return recharge_number

    def validate_trade_money(self,trade_money):
        try:
            trade_money = float(trade_money)
            if trade_money < 0 or trade_money == 0:
                raise serializers.ValidationError("充值金额要大于0")
        except:
            raise serializers.ValidationError("非法金额")
        return trade_money


# 退款校验
class OrderGoodsRefundBalanceSerializer(serializers.ModelSerializer):
    user = serializers.HiddenField(
        default=serializers.CurrentUserDefault()
    )
    # # # 交易来源
    # trade_source = serializers.ChoiceField(choices=mcommon.trade_source_choices,required=True)

    # # 收入或支出
    # cash_in_out_type = serializers.IntegerField(choices=mcommon.cash_in_out_type_choicess)
    # 交易金额
    trade_money = serializers.FloatField(required=True)
    # 该交易是否通过
    is_pass = serializers.BooleanField(default=False)
    add_time = serializers.CharField()
    class Meta:
        model = models.TradeInfo
        fields = ["user","trade_money","is_pass","add_time"]
        depth = 0


# 订单支付验证
class OrderPayBalanceSerializer(serializers.ModelSerializer):
    user = serializers.HiddenField(
        default=serializers.CurrentUserDefault()
    )
    # # # 交易来源
    # trade_source = serializers.ChoiceField(choices=mcommon.trade_source_choices,required=True)

    # # 收入或支出
    # cash_in_out_type = serializers.IntegerField(choices=mcommon.cash_in_out_type_choicess)
    # 交易金额
    trade_money = serializers.FloatField(required=True)
    # 该交易是否通过
    is_pass = serializers.BooleanField(default=False)
    add_time = serializers.CharField(default=time.time()*1000)
    order_number = serializers.CharField(max_length=32)

    class Meta:
        # trade_money = serializers.FloatField(required=True)
        # # 该交易是否通过
        # is_pass = serializers.BooleanField(default=False)
        # add_time = serializers.CharField(default=time.time() * 1000)
        # order_number = serializers.CharField(max_length=32)
        model = models.TradeInfo
        fields = ["user","order_number","trade_money","is_pass","add_time"]
        depth = 0


# 查询交易信息
class QueryTradeInfoSerializer(serializers.ModelSerializer):
    user = UserDetailSerializer()

    class Meta:
        model = models.TradeInfo
        fields = "__all__"
        # fields = ["user","trade_number","user_balance","trade_source","recharge_number","trade_source","trade_money","is_pass","add_time"]
        depth = 1

    # def get_order_owner(self, obj):
    #         if obj.order_owner:
    #             return obj.order_owner.user_name
    #         return None


class UserOrderGoodsRefundApplySerializer(serializers.ModelSerializer):
    class Meta:
        model = models.RefundApply
        fields = "__all__"
        depth = 0


class TradeOrderGoodsSerializer(serializers.ModelSerializer):
    """
    订单商品
    """

    """
    status_choices = (
    (1, '待付款'),
    (2, '已付款'),
    (3, '拿货中'),
    (4, '已拿货'),
    (5, '已发货'),
    (6, '已退款'),
    (7, '缺货'),)
    """
    # 订单状态选择
    status_choices = mcommon.status_choices
    goods_number = serializers.CharField(max_length=30,required=False,default='')
    shop_floor = serializers.CharField(allow_null=False)
    status = serializers.ChoiceField(choices=status_choices,default=1)
    shop_market_name = serializers.CharField(required=True,max_length=120)
    shop_floor = serializers.CharField(required=True,max_length=30)
    shop_stalls_no = serializers.CharField(required=True,max_length=30)
    art_no = serializers.CharField(required=True,max_length=20)
    goods_price = serializers.FloatField(required=True)
    goods_color = serializers.CharField(required=True,max_length=20)
    goods_size = serializers.CharField(required=False,max_length=20)
    goods_count = serializers.IntegerField(min_value=1,default=1)
    add_time = serializers.IntegerField(default=time.time(), write_only=True)
    is_delete = serializers.BooleanField(default=False)
    # refund_apply 做为属性  是在RefundApply模型中关联的 related_name 一致
    refund_apply = UserOrderGoodsRefundApplySerializer(many=True,read_only= True)


    def validate_goods_number(self,order_number):
        # 当前时间+userid+随机数
        from time import strftime
        from random import Random
        random_ins = Random()

        if order_number is None or order_number == "":
            order_number = "gs{time_str}{userid}{ranstr}".format(time_str=strftime("%Y%m%d%H%M%S"),
                                                             userid=self.context["request"].user.id,
                                                             ranstr=random_ins.randint(10, 99999))
        return order_number

    class Meta:
        model = models.OrderGoods
        # fields = ['consignee_address',]
        # fields = "__all__"
        fields = '__all__'
        # fields = ("shop_floor", "shop_market_name", "status")
        # 查表深度  关联表的数据也会查处出来  深度值官方推荐 0-10
        depth = 0


class TradeOrderCreateSerializer(serializers.ModelSerializer):


    # 收件人信息
    consignee_address = serializers.CharField( max_length=140)
    consignee_name = serializers.CharField(max_length=30)
    consignee_phone = serializers.IntegerField()

    def get_order_owner(self, obj):
        if obj.order_owner:
            return obj.order_owner.user_name
        return None

    class Meta:
        model = models.Order
        # fields = ['consignee_address',]
        fields = ("consignee_address", "consignee_name", "consignee_phone")
        # 查表深度  关联表（父表）的数据也会查处出来  深度值官方推荐 0-10
        depth = 0


class tTradeOrderQuerySerializer(serializers.ModelSerializer):
    order_owner = serializers.HiddenField(
        default=serializers.CurrentUserDefault()
    )

    # orderGoods = serializers.PrimaryKeyRelatedField(many=True,queryset=models.OrderGoods.objects.all())
    def get_order_owner(self, obj):
        if obj.order_owner:
            return obj.order_owner.user_name
        return None


    # 反向序列化  要在model.OrderGoods 理的对应指向Order的字段 设置 related_name 为 ‘orderGoods’
    orderGoods = TradeOrderGoodsSerializer(many=True, read_only=True)


    class Meta:
        model = models.Order
        fields = ["id","order_number","order_owner"
                          ,"pay_no","consignee_address","consignee_name","consignee_phone","sender_address","sender_name","sender_phone","is_delete","quality_testing_name",
                           "quality_testing_fee","logistics_fee","agency_fee","logistics_name","logistics_number","weight","total_price","add_time","orderGoods","order_status","update_time"]
        # fields = '__all__'
        # 查表深度  关联表（父表）的数据也会查处出来  深度值官方推荐 0-10
        depth = 2


class OrderGoodsSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.OrderGoods
        fields = "__all__"


class TradeAddOrdersSerializer(serializers.ModelSerializer):
    order_owner = serializers.HiddenField(
        default=serializers.CurrentUserDefault()
    )
    # 订单号
    order_number = serializers.CharField(read_only=True,max_length=30,)
    # 付款单号
    pay_no = serializers.CharField(read_only= True,max_length=128)

    # 收件人信息
    consignee_address = serializers.CharField(required=True, max_length=140)
    consignee_name = serializers.CharField(required=True, max_length=30)
    consignee_phone = serializers.IntegerField(required=True)

    # 寄件人信息
    sender_address = serializers.CharField(max_length=140,default="广东省，广州市，天河区风刀霜剑法律的精神")
    sender_name = serializers.CharField(max_length=30,default="小刘")
    sender_phone = serializers.IntegerField(default=17820158888)
    # 是否删除（逻辑删除）
    is_delete = serializers.BooleanField(default=False)
    # 运费
    logistics_fee = serializers.FloatField(default=0.0)
    # 物流单号
    logistics_number = serializers.CharField(required=False,max_length=30)
    logistics_name = serializers.CharField(default="")
    # 重量
    weight = serializers.FloatField(default="0.0")
    # 总价格
    total_price = serializers.FloatField(default="0.0")
    add_time = serializers.IntegerField(default=time.time())

    def get_order_owner(self, obj):
        if obj.order_owner:
            return obj.order_owner.user_name
        return None
    # 反向序列化
    orderGoods = TradeOrderGoodsSerializer(many=True, read_only=True)

    def validate_order_number(self,order_number):
        print("validate_order_numbervalidate_order_numbervalidate_order_numbervalidate_order_number")
        return self.generate_order_sn(self)


    # 生成订单号函数
    def generate_order_sn(self,order_sn):
        # 当前时间+userid+随机数
        from time import strftime
        from random import Random
        random_ins = Random()

        if order_sn is None or order_sn == "":
           order_sn = "os{time_str}{userid}{ranstr}".format(time_str=strftime("%Y%m%d%H%M%S"),
                                                       userid=self.context["request"].user.id,
                                                       ranstr=random_ins.randint(10, 99999))
        print(order_sn)
        return order_sn

    class Meta:
        model = models.Order
        # fields = ['consignee_address',]
        fields = '__all__'
        # 查表深度  关联表（父表）的数据也会查处出来  深度值官方推荐 0-10
        depth = 1


class UserQuerySerializer(serializers.ModelSerializer):
    """
    用户个人信息
    """
    class Meta:
        model = models.User
        fields = ("id","email", "type","qq", "phone", "balance","user_name")


class UserPasswordSerializer(serializers.ModelSerializer):
    password = serializers.CharField(max_length=64, write_only=True, error_messages ={
        "blank": "用户名不能为空",
        "required": "用户名不能为空",
        "max_length": "用户名长度限制",
    })

    class Meta:
        model = models.User
        fields = ("password")


class UserUpdateSerializer(serializers.ModelSerializer):
    """
    用户更新
    """

    class Meta:
        model = models.User
        fields = ("email", "phone" , "qq" )


# 用户注册序列化组件
# 不使用 ModelSerializer, 并不需要所有的字段, 会有麻烦
class UserRegisterSerializer(serializers.ModelSerializer):
    """
    用户注册
    """
    # phone = serializers.CharField(max_length=11)
    # write_only 是只在保存序列化的时候用这个字段，返回客户端时候不用这个字段，read_only作用反之
    password = serializers.CharField(max_length=64, write_only=True)
    email = serializers.CharField(max_length=30)
    user_name = serializers.CharField(max_length=30,error_messages = {
        "blank": "用户名不能为空",
        "required": "用户名不能为空",
        "max_length": "用户名长度限制",
    })

    def validate_email(self, email):
        # EMALI_REGEX = "^[a-z0-9A-Z]+[-|a-z0-9A-Z._]+@([a-z0-9A-Z]+(-[a-z0-9A-Z]+)?\\.)+[a-z]{2,}$"
        EMALI_REGEX = "^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$"
        # 邮箱是否注册
        if models.User.objects.filter(email=email).count():
            raise serializers.ValidationError("邮箱已经注册")
        if not re.match(EMALI_REGEX, email):
            raise serializers.ValidationError("邮箱格式不正确")
        return email

    # #  验证手机号码
    # # validate_ + 字段名 的格式命名
    # def validate_phone(self,mobile):
    #     # 手机是否注册
    #     if models.User.objects.filter(phone=mobile).count():
    #         raise serializers.ValidationError("手机号已经注册")
    #
    #     REGEX_MOBILE = "^1[3578]\d{9}$|^147\d{8}$|^176\d{8}$"
    #     # 验证手机号码是否合法
    #     if not re.match(REGEX_MOBILE, mobile):
    #         raise serializers.ValidationError("手机号码非法")
    #     return mobile

        # validate_ + 字段名 的格式命名
    def validate_user_name(self, user_name):
        if  user_name.find(' ') !=-1 or user_name.find("　") !=-1 or user_name.find("   ") !=-1:
            raise serializers.ValidationError("用户名不能有空格")
        if models.User.objects.filter(user_name = user_name).count():
            raise serializers.ValidationError("用户名已存在")

        return user_name

    # validate_ + 字段名 的格式命名
    def validate_password(self, password):
        if len(password) > 16:
            raise serializers.ValidationError("密码过长")
        password = encryptions.get_sha_encryptions(password)
        return password

        # validate_ + 字段名 的格式命名

    def validate_pay_password(self, pay_password):
        if len(pay_password) > 16:
            raise serializers.ValidationError("密码过长")
        pay_password = encryptions.get_sha_encryptions(pay_password)
        return pay_password

    class Meta:
        model = models.User
        fields = ("user_name",  "email", "password","pay_password")

