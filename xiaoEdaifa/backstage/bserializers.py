from rest_framework import serializers
from utils import mcommon
from utils import m_serializers
from trade import models as trade_models
from backstage import models as back_models
from user import models as user_models
import time


class BackTradeOrderQuerySerializer(serializers.ModelSerializer):

    order_owner = m_serializers.UserQuerySerializer()
    order_follower = m_serializers.UserQuerySerializer()
    #
    # # orderGoods = serializers.PrimaryKeyRelatedField(many=True,queryset=models.OrderGoods.objects.all())
    # def get_order_owner(self, obj):
    #     if obj.order_owner:
    #         return obj.order_owner.user_name
    #     return None

    # 反向序列化  要在model.OrderGoods 理的对应指向Order的字段 设置 related_name 为 ‘orderGoods’
    orderGoods = m_serializers.TradeOrderGoodsSerializer(many=True, read_only=True)
    def get_order_owner(self,order_owner):
        return order_owner

    class Meta:
        model = trade_models.Order
        fields = ["id", "order_number", "order_owner","order_follower"
            , "pay_no", "consignee_address", "consignee_name", "consignee_phone", "sender_address", "sender_name",
                  "sender_phone", "is_delete", "quality_testing_name",
                  "quality_testing_fee", "logistics_fee", "agency_fee", "logistics_name", "logistics_number", "weight",
                  "total_price", "add_time", "orderGoods", "is_delivered",'order_status',"tag_type","tb_order_number","wangwang_id","order_remarks"]
        # fields = '__all__'
        # 查表深度  关联表（父表）的数据也会查处出来  深度值官方推荐 0-10
        depth = 2


class BackTradeNullOrderQuerySerializer(serializers.ModelSerializer):
    order_owner = m_serializers.UserQuerySerializer()

    class Meta:
        model = trade_models.NullPackageOrder
        # fields = ["id", "order_number", "order_owner","order_follower"
        #     , "pay_no", "consignee_address", "consignee_name", "consignee_phone", "sender_address", "sender_name",
        #           "sender_phone", "is_delete", "quality_testing_name",
        #           "quality_testing_fee", "logistics_fee", "agency_fee", "logistics_name", "logistics_number", "weight",
        #           "total_price", "add_time", "orderGoods", "is_delivered",'order_status']
        fields = '__all__'
        # 查表深度  关联表（父表）的数据也会查处出来  深度值官方推荐 0-10
        depth = 2


        # 问题单跟进
class BackTroubleOrderSQuerySerializer(serializers.ModelSerializer):
    owner = m_serializers.UserQuerySerializer()

    class Meta:
        model = back_models.TroubleOrders

        fields = '__all__'
        # 查表深度  关联表（父表）的数据也会查处出来  深度值官方推荐 0-10
        depth = 2

# 折扣卡查询
class BackDiscountCardQuerySerializer(serializers.ModelSerializer):
    user = m_serializers.UserQuerySerializer()
    class Meta:
        model = trade_models.DiscountCard
        fields = '__all__'
        # 查表深度  关联表（父表）的数据也会查处出来  深度值官方推荐 0-10
        depth = 1


# 用户阿里账户信息
class AliPayAccountInfoQuerySerializer(serializers.ModelSerializer):
    user = m_serializers.UserQuerySerializer()
    class Meta:
        model = user_models.UserAlipayRealInfo
        fields = '__all__'
        # 查表深度  关联表（父表）的数据也会查处出来  深度值官方推荐 0-10
        depth = 1


# 邀请注册查询
class InviteRegisterInfoQuerySerializer(serializers.ModelSerializer):
    inviter = m_serializers.UserQuerySerializer()
    be_inviter = m_serializers.UserQuerySerializer()

    class Meta:
        model = user_models.InviteRegisterInfo
        fields = '__all__'
        # 查表深度  关联表（父表）的数据也会查处出来  深度值官方推荐 0-10
        depth = 0





# 记录的电商平台买家的订单信息
class TradePlatformOrderGoodsSerializer(serializers.ModelSerializer):
    class Meta:
        model = back_models.PlatformGoods

        fields = '__all__'
        # fields = ("shop_floor", "shop_market_name", "status")
        # 查表深度  关联表的数据也会查处出来  深度值官方推荐 0-10
        depth = 0

class PlatformGoodsInfoQuerySerializer(serializers.ModelSerializer):

    class Meta:
        model = back_models.PlatformGoods
        fields = '__all__'
        # 查表深度  关联表（父表）的数据也会查处出来  深度值官方推荐 0-10
        depth = 0
class PlatformOrderGoodsSerializer(serializers.ModelSerializer):

    class Meta:
        model = back_models.PlatformOrderGoods
        fields = '__all__'
        # 查表深度  关联表（父表）的数据也会查处出来  深度值官方推荐 0-10
        depth = 2
class PlatformOrderInfoQuerySerializer(serializers.ModelSerializer):
    # 反向序列化  要在model.PlatformOrderGoods 理的对应指向Order的字段 设置 related_name 为 ‘platformOrderGoods’
    platformOrderGoods = PlatformOrderGoodsSerializer(many=True, read_only=True)
    class Meta:
        model = back_models.PlatformOrder
        # fields = '__all__'
        fields = ('platformOrderGoods','account', 'add_time', 'data_source', 'id', 'logistics_info', 'logistics_is_inbounded', 'logistics_number', 'order_number', 'shop_id', 'shop_name')
        # 查表深度  关联表（父表）的数据也会查处出来  深度值官方推荐 0-10
        depth = 2








# 退回包裹
class ReturnPackageInfoQuerySerializer(serializers.ModelSerializer):

    class Meta:
        model = trade_models.ReturnPackageInfo
        fields = '__all__'
        # 查表深度  关联表（父表）的数据也会查处出来  深度值官方推荐 0-10
        depth = 0


# 后台执行任务
class TaskThreadQuerySerializer(serializers.ModelSerializer):

    class Meta:
        model = back_models.ThreadTask
        fields = '__all__'
        # 查表深度  关联表（父表）的数据也会查处出来  深度值官方推荐 0-10
        depth = 0