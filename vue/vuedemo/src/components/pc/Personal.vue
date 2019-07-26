<template>
  <div class="root">
    <div style="width: 8em;height: auto; float:left;">

    <ul >
      <li > <router-link class="nav"  to = "/pc/personal/userDetails" >个人资料</router-link></li>
      <li > <router-link class="nav"  to = "/pc/personal/capitalAccount" >账户记录</router-link></li>
      <li > <router-link class="nav"  to = "/pc/personal/recharge" >充值</router-link></li>

    </ul>
      </div>
      <div style="float: left;padding-left: 2em">
          <router-view></router-view>
      </div>
  </div>
</template>

<script>
    export default {
        name: "Personal"
    }
</script>

<style scoped>
  .root ul li{
    padding-top: 1em;
    list-style: none;
  }
.nav{

  text-decoration:none;
  padding: 0.5em;
  border-radius: 4px;


}
  .root{
    width: 90%;
  }
</style>
