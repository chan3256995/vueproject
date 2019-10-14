<template>
  <div class="root">
    <div style="width: 8em;height: auto; float:left;">
    <ul >
      <li > <router-link class="nav"  to = "/pc/back/home/order" >订单列表</router-link></li>
      <li > <router-link class="nav"  to = "/pc/back/home/refund/" >售后订单</router-link></li>
      <li > <router-link class="nav"  to = "/pc/back/home/outPutExcel/" >导出订单</router-link></li>
      <li > <router-link class="nav"  to = "/pc/back/home/print/" >打 印</router-link></li>
      <li > <router-link class="nav"  to = "/pc/back/home/tradeInfo/" >交易信息</router-link></li>
      <li > <router-link class="nav"  to = "/pc/back/home/excelToString/" >转换数据</router-link></li>
    </ul>
      </div>
      <div style="float: left">
          <router-view></router-view>
      </div>
  </div>
</template>

<script>
    export default {
        name: "Home"
    }
</script>

<style scoped>
  .root ul li{
    padding-top: 1em;
  }
.nav{

  text-decoration:none;
  padding: 0.5em;
  border-radius: 4px;


}
  .root{
    width: 1300px;
  }
</style>
