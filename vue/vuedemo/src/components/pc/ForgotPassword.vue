<template>


  <table style="margin: 0 auto">
    <tr>
      <td>邮箱：</td>
      <td><input v-model="email"/></td>
    </tr>

    <tr>
      <td> </td>
      <td> <button @click="submit_email(email)" :disabled="submit_btn_disable">提交</button> </td>
    </tr>
  </table>
</template>

<script>
  import axios from "axios"
    export default {
        name: "ForgotPassword",
        data(){
          return{
            email:"",
            submit_btn_disable :false
          }
        },
        methods:{
          submit_email(email){


        if (email.trim() === ""){
          alert("邮箱不能空")
          return;
        }
        // const url =this.HOST + "/user/login/"
        this.submit_btn_disable = true
        let url = this.mGLOBAL.DJANGO_SERVER_BASE_URL+"/user/forget_password/"
        console.log(url)
        axios.post(url,{
          'email':email,
       }).then((res)=>{
         console.log(res.data) ;
          console.log("token",res.data.token)
          this.submit_btn_disable = false;
         if(res.data.code === "1000"){
           this.$toast("提交成功，请到邮箱进行修改密码")

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
