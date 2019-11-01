<template>

<div class="login">

  <table style="margin: 0 auto">
    <tr>
      <td>用户名：</td>
      <td><input class="global_input_default_style"  v-model="username"/></td>
    </tr>
    <tr>
      <td> 密  码 ：</td>
      <td> <input class="global_input_default_style" v-model="password" type="password"/></td>
    </tr>
    <tr>
      <td> </td>
      <td> <button :class="{'global_btn_normal_style':!submit_btn_disable  , 'global_btn_clicked_style':submit_btn_disable  }" @click="login" :disabled="submit_btn_disable">登录</button>
        <button class="global_btn_normal_style" @click = 'register'>注册</button></td>
      <td><a @click="go_forgot_password_page" style="color: blue">忘记密码？</a></td>
    </tr>
  </table>

</div>
</template>

<script>
  import  axios  from 'axios'
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
    created(){
      this.$axios.get("/api333/cityjson")
      .then(res=>{
        console.log(res)
      })
      .catch(err=>{
        console.log(err)
      })
    },
    methods:{

      go_forgot_password_page(){
        this.$router.push("/pc/forgotPassword");
      },
      login(){
        const username = this.username.trim()
        const password = this.password.trim()
        if (!username || !password){
          alert("账号密码不能为空")
          return;
        }
        // const url =this.HOST + "/user/login/"
        this.submit_btn_disable = true
        let url = this.mGLOBAL.DJANGO_SERVER_BASE_URL+"/user/login/"

        console.log(url)
        axios.post(url,{
          'username':this.username,
           'password':this.password,
       }).then((res)=>{
          this.submit_btn_disable = false;
         if(res.data.code === "1000"){
            this.setLocalValue("user",JSON.stringify(res.data.user))
            this.$router.push("/pc/home/porder");
            this.$cookies.set("access_token" ,res.data.token)
            this.$router.push("/pc/home/porder");
         }else{
           alert("登录失败："+res.data.message)
         }

          }).catch(error => {
            alert("访问错误")
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

<style lang="less" scoped>
    @import "../../../static/css/PGLOBALCSS.css";
    @import "../../../static/css/PGLOBALLESS.less";



.login{
  margin:0 auto;
  padding-top: 5em;
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
