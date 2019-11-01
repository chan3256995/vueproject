from rest_framework import serializers
from utils import mcommon
from utils import m_serializers
from trade import models as trade_models
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
                  "total_price", "add_time", "orderGoods", "is_delivered"]
        # fields = '__all__'
        # 查表深度  关联表（父表）的数据也会查处出来  深度值官方推荐 0-10
        depth = 2