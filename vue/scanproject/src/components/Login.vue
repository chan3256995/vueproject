<template>

<div class="login">
  <div>
    <label style="color: red">可用 admin 账号登录</label>
  </div>
  <table style="margin: 0 auto">
    <tr>
      <td>用户名：</td>
      <td><input v-model="username"/></td>
    </tr>
    <tr>
      <td> 密  码 ：</td>
      <td> <input v-model="password" type="password"/></td>
    </tr>
    <tr>
      <td> </td>
      <td> <button @click="login" :disabled="submit_btn_disable">登录</button> </td>
    </tr>
  </table>
</div>
</template>

<script>
  import  axios  from 'axios'
  import  cookiesUtils from '../utils/cookieUtil'
  import pGlobal from '../utils/pGlobal'
  export default {
    name: 'login',
    data(){
      return{
        submit_btn_disable: false,
        username:'',
        password:'',
        datas:{}
      }
    },
    methods:{
      login(){
        const username = this.username.trim()
        const password = this.password.trim()
        if (!username || !password){
          alert("账号密码不能为空")
          return;
        }
        // const url =this.HOST + "/user/login/"
        this.submit_btn_disable = true
        let url = pGlobal.DJANGO_SERVER_BASE_URL+"/user/login/"

        console.log(url)
        axios.post(url,{
           'username':this.username,
           'password':this.password,
       }).then((res)=>{
         console.log(res.data) ;
          console.log("token",res.data.token)
          this.submit_btn_disable = false;
         if(res.data.code === "1000"){
            this.setLocalValue("user",JSON.stringify(res.data.user))
            cookiesUtils.setCookies("access_token_bk",res.data.token)
            // this.$cookies.set("access_token_bk" ,res.data.token)
            this.$router.push("/find");


         }else{
           alert("登录失败："+res.data.msg)
         }

          }).catch(error => {
            alert("访问错误")
          console.log(error)
            this.submit_btn_disable = false;
          })
      },
      register(){
        this.$router.push({
            name:'pRegister'
          })
      }
    }
  }
</script>

<style scoped>
.login{
  margin:0 auto;
  padding: 0.3em;
  width: auto;
  height: auto;
  text-align: center;

}
.login td{
  margin-top: 0.5em;
  width: 5em;
  height: 2.5em;
}
.login li{

  text-align: center;
  list-style: none;
  background: lavenderblush;
  padding: 0.1em;
  width: auto;
  height:auto;
}
  .login  input{
    margin:0 auto;
    width: 16em;
    height: 2.5em;
  }
  .login button{
    width:4.5em;
    height: 2.5em;
    margin: 0.5em;
  }
</style>
