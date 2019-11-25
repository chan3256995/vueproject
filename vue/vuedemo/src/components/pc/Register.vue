<template>
    <div >
      <p style="font-size: 2em;margin-top: 2em">用户注册</p>
 <table class="register">
    <tr>
        <td>用户名<label style="color:red;font-size: 1.5em">*</label></td>
       <td><input class="global_input_default_style"  @focus="username_focous" @blur="username_bl" v-model="username"/></td>
      <td><label >{{username_tip}}</label></td>
    </tr>

    <tr>
      <td>邮箱<label style="color:red;font-size: 1.5em">*</label></td>
       <td><input class="global_input_default_style" @focus="email_focous" @blur="email_bl" v-model="email"/></td>
      <td><label>{{email_tip}}</label></td>
    </tr>
   <tr>
      <td>手机号</td>
      <td><input class="global_input_default_style" type="number"  v-model="phone"/></td>

    </tr>
    <tr>
      <td>密码<label style="color:red;font-size: 1.5em">*</label></td>
      <td><input class="global_input_default_style" type="password" v-model="password"/></td>
    </tr>
   <tr>
      <td>重复密码<label style="color:red;font-size: 1.5em">*</label></td>
      <td><input  class="global_input_default_style" @blur="password_tip_bl" @focus="re_password_focus" type="password" v-model="re_password"  /></td>
      <td><label >{{password_tip}}</label></td>
    </tr>

      <tr>
      <td>QQ</td>
      <td><input class="global_input_default_style" type="number" v-model="qq"/></td>
    </tr>
    </table>
  <button @click="register" class="register_submit_btn" :class="{'global_btn_normal_style':!submit_btn_disable , 'global_btn_clicked_style':submit_btn_disable }">提交注册</button>

</div>
</template>

<script>
   import  axios  from 'axios'
    export default {
      name: "Register",
      data() {
        return {
          inviter_id :this.$route.query.inviter_id,
          submit_btn_disable: false,
          username: '',
          password: '',
          email:'',
          phone:'',
          qq:'',
          re_password:'',
          username_tip:'',
          password_tip:'',
          phone_tip:'',
          email_tip:'',
        }
      },
      created(){
        console.log("created_inviter_id:"+this.inviter_id)
      },
      mounted(){
         console.log("mounted_inviter_id:"+this.inviter_id)
      },
      methods:{
        register(){
              if(this.check_data() === false){
                return
              }
            this.submit_btn_disable = true;
            const url =  this.mGLOBAL.DJANGO_SERVER_BASE_URL+"/user/reg/"
            let datas = {};
            datas.user_name = this.username;
            datas.email = this.email;
            datas.phone = this.phone;
            datas.qq = this.qq;
            datas.password = this.password;
            if(this.inviter_id !== undefined && (! isNaN(this.inviter_id))){
              datas.inviter_id = this.inviter_id
            }
             axios.post(url,datas).then((res)=>{
                console.log(res.data)
                 this.submit_btn_disable = false;
                 if(res.data.code === '1000') {
                   alert("注册成功")
                   this.$router.push("/pc/home/porder");
                   this.$cookies.set("access_token" ,res.data.token)
                   this.$router.push("/pc/home/porder");
                 }else{
                   alert("注册失败")
                 }
            }).catch(error => {
              this.submit_btn_disable = false;
              alert("请求错误")
            })
            },

        check_data(){
              if(this.username.trim() === ""){
                alert("用户名不能为空")
                return false;
              }
              if(this.password.trim() === "" || this.re_password.trim() === ""){
                alert("密码不能为空")
                return false;
              }
              return true;

        },

         username_focous(){
              this.username_tip=""
        },
        //  phone_focous(){
        //       this.phone_tip=""
        // },
        re_password_focus(){
              this.password_tip=""
        },
        password_tip_bl(){
              console.log(this.password)
              console.log(this.re_password)
              if(this.password !==  this.re_password){
                this.password_tip = "两次密码不一致"
              }
      },
        email_bl(){
            const url  = this.mGLOBAL.DJANGO_SERVER_BASE_URL+"/user/checkUser/";
            console.log(url);
            var datas = {};

              if(this.email.trim() === "" || !this.is_vaild_email(this.email) ){
                this.email_tip = '邮箱格式错误';
                return;
              }
            datas.email = this.email;
             axios.post(url,datas).then((res)=>{
                console.log(res.data)
                 if(res.data.code === '1000'){
                   this.email_tip = '可用'
                 }else if(res.data.code === '1002'){
                   this.email_tip = '邮箱已注册'
                 }
            }).catch(error => {
            })

        },
        is_vaild_email(email){
          let filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
          if (filter.test(email)) {
              return true;
                } else {
                    return false;
                }


        },
        email_focous(){
          this.email_tip = ""
        },
        checkUser:function(datas,){

            const url  = this.mGLOBAL.DJANGO_SERVER_BASE_URL+"/user/checkUser/";
            console.log(url);
             axios.post(url,datas).then((res)=>{
                console.log(res.data)
                 if(res.data.code === '1000'){
                   this.username_tip = '可用'
                 }else if(res.data.code === '1002'){
                   this.username_tip = res.data.message
                 }
            }).catch(error => {
            })
        },
        username_bl(){
          var datas = {};
          if(this.username.trim() === ""){
                return;
              }
          datas.username = this.username
          this.checkUser(datas);

        },

      },

    }
</script>

<style scoped>
@import "../../../static/css/PGLOBALCSS.css";
@import "../../../static/css/PGLOBALLESS.less";

  .register label{
    color: red;

  }
.register{
  margin:0 auto;
  padding: 0.3em;
  width: auto;
  height: auto;
  text-align: center;
  background:white;
}
.register button{
  margin-top: 0.5em;
  width: 5em;
  height: 2.5em;
}
.register tr{

  text-align: center;
  background: white;
  padding: 0.1em;
  width: auto;
  height:auto;
}
  .register tr input{
    margin:0 auto;
    width: 16em;
    height: 2.5em;
  }
.register_submit_btn{
  font-size: 1.4em;
  padding: 0.2em;
  padding-left: 0.4em;
  padding-right: 0.4em;
}

</style>
