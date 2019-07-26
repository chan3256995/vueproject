<template>
  <div>
    <ul>
      <router-link class="nav" to = "/home/porder" >下订单</router-link>
      <router-link class="nav" to = "/home/myorder" >我的订单</router-link>
    </ul>
    <div>
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
.nav{
text-decoration:none;
  padding-left: 3em;
  padding-right: 3em;
  padding-bottom: 0.5em;
  padding-top: 0.5em;
    border-radius: 4px;
  font-weight: bold;
}
</style>
