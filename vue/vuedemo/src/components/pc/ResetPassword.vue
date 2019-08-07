<template>


  <table style="margin: 0 auto">
    <tr>
      <td>密码：</td>
      <td><input v-model="password"/></td>
    </tr>

    <tr>
      <td>再次输入密码：</td>
      <td><input v-model="re_password"/></td>
    </tr>

    <tr>
      <td> </td>
      <td> <button @click="submit_email(password,re_password)" :disabled="submit_btn_disable">提交</button> </td>
    </tr>
  </table>
</template>

<script>
  import axios from "axios"
    export default {
        name: "ResetPassword",
        data(){
          return{
            password:"",
            re_password:"",
            submit_btn_disable :false,
            access_token:"",
          }
        },

        methods:{
          check_password(password,re_password){
            if(re_password ==="" || password ===""){
              this.$toast("密码不能为空")
              return false
            }
            if(password !== re_password){
              this.$toast("两次密码不一致")
              return false;
            }
          return true
          },
          submit_email(password,re_password){
            if(!this.check_password(password,re_password)){
              return;
            }

        // const url =this.HOST + "/user/login/"
        this.submit_btn_disable = true
        let url = this.mGLOBAL.DJANGO_SERVER_BASE_URL+"/user/reset_password/?access_token="+this.$route.query.access_token
        console.log(url)
        axios.post(url,{
          'password':password,
       }).then((res)=>{
         console.log(res.data) ;
          console.log("token",res.data.token)
          this.submit_btn_disable = false;
         if(res.data.code === "1000"){
           this.$toast("修改密码成功")


         }else{
            this.$toast("提交失败"+ res.data.message)
         }

          }).catch(error => {
            this.$toast("访问错误")
          this.submit_btn_disable = false
          })
          },
        },

    }
</script>

<style scoped>

</style>
