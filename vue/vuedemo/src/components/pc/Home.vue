<template>
  <div style="width: 100%;margin: 0 auto; ">

    <div class="top">
      <ul style="padding-right: 3em">
      <li><a style="cursor:pointer;color: blue" @click="on_logout" >退出登录</a></li>
      <li style=""><a style="cursor:pointer;color: blue" @click="go_to_personal" v-text="user"> 个人中心</a></li>
    </ul>
    </div>

    <div class="nav_div">
      <router-link class="nav" to = "/pc/home/porder" >下订单</router-link>
      <router-link class="nav" to = "/pc/home/myorder" >我的订单</router-link>
      <router-link class="nav" to = "/pc/personal/recharge2" >充值</router-link>
    </div>
    <div style="width: 100%; " >
      <keep-alive><router-view style="width: 100%"></router-view></keep-alive>
    </div>
  </div>
</template>

<script>
    export default {
      name: "Home",
      data(){
        return{
          user :"个人中心"
        }
      },
      methods:{
          go_to_personal(){
             let  routeData = this.$router.resolve({ path: '/pc/personal/userDetails'})
            window.open(routeData.href, '_blank')
          },
          on_logout(){
            this.$cookies.set("access_token" ,"");
            this.$router.replace("/pc/login/")
          },

      },
      created(){
            let user_info = this.getLocalValue("user");
            console.log("user_info--------------------------")
            console.log(user_info)
            if(user_info !==""){
              this.user = JSON.parse(user_info).user_name
            }
      }
    }
</script>

<style scoped>
  .nav_div{
    width: 100%;
    text-align: center;
    height: 5em;

  }
  .top{
    width: 100%;
    height: 2em;
    padding-right: 2em;
  }
  .top ul{
    float: right;
  }
  .top ul li{
    width: auto;
    float: left;
    list-style: none;
    padding-left: 0.5em;
  }
.nav{
 text-decoration:none;
  border-radius: 4px;
  font-weight: bold;
  padding: 5px;
}
</style>
