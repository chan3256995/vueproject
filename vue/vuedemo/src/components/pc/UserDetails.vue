<template>
    <div>
      <div class="comm_div" >
        <table>
          <tr>
            <td>用户名：</td><td style="text-align: left"><label >{{user.user_name}}</label></td>

          </tr>
          <tr>
            <td>邮箱：</td><td><input v-model="user.email"/></td>
          </tr>
          <tr>
          <td>手机号：</td><td><input v-model="user.phone"/></td>
          </tr>
          <tr>
          <td>QQ：</td><td><input v-model="user.qq"/></td>
          </tr>
        </table>
        <button @click="alter_user_detail(user.email,user.phone,user.qq)">确认修改</button>
        </div>
        <div class="comm_div">
          <table>
            <tr>
                <td>原登录密码</td><td style="text-align: left"><input   @focus="password_input_focus()" v-model="old_password" type="password" /></td>

              </tr>

              <tr>
                <td>新登录密码</td><td style="text-align: left"><input   @focus="password_input_focus()" v-model="new_password" type="password" /><label v-if="new_password_tip===true" style="color: red">密码不能为空</label></td>

              </tr>
              <tr>
                <td> 再次输入密码：</td><td><input type="password" @focus="password_input_focus()"  v-model="new_re_password" /><label v-if="new_re_password_tip===true" style="color: red">密码不一致</label></td>
              </tr>
            </table>
          <button @click="alter_passwrod(new_password,old_password)">确认修改</button>
        </div>

              <div class="comm_div">
          <table>
                  <tr>
                <td>登录密码</td><td style="text-align: left"><input   @focus="password_input_focus()" v-model="old_password2" type="password" /></td>

              </tr>
              <tr>
                <td>新支付密码</td><td style="text-align: left"><input   @focus="password_input_focus()" v-model="new_pay_password" type="password" /><label v-if="new_pay_password_tip===true" style="color: red">密码不能为空</label></td>

              </tr>
              <tr>
                <td> 再次输入支付密码：</td><td><input type="password" @focus="password_input_focus()"  v-model="re_new_pay_password" /><label v-if="re_new_pay_password_tip===true" style="color: red">密码不一致</label></td>
              </tr>
            </table>
          <button @onfocus="password_input_focus()" @click="alter_pay_passwrod(old_password2,new_pay_password)">确认修改</button>
        </div>
    </div>

</template>

<script>
      import  axios  from 'axios'
       import mGlobal from '../../utils/mGlobal';
     //设为true 就会带cookies 访问
    axios.defaults.withCredentials=true;
    export default {
      name: "UserDetails",
      data(){
        return {
          user:"",
          new_password : "",
          new_re_password : "",
          new_pay_password : "",
          re_new_pay_password:"",
          old_password : "",
          old_password2 : "",
          new_re_password_tip: false,
          new_password_tip: false,
          new_pay_password_tip: false,
          re_new_pay_password_tip: false
        }
      },
      methods:{

        password_input_focus(){
            this.new_re_password_tip= false,
          this.new_password_tip= false,
          this.new_pay_password_tip= false,
          this. re_new_pay_password_tip= false
        },
        alter_user_detail(email,phone,qq){
               if(!confirm("确定修改吗？")) {
                return ;
              }

              const url = mGlobal.DJANGO_SERVER_BASE_URL+"/user/details/-1/"
              let data_ = {
              "email":email,
              "phone":phone,
              "qq":qq,
            }
          axios.put(url,data_).then((res)=>{
              if(res.data.code ==="1000"){
                console.log(res.data)
                this.$toast("修改成功！")
              }else{
                this.$toast("修改失败！"+res.data.message)
              }

            }).catch(error=>{
                console.log("请求错误")
                this.$toast("请求错误")
            })
        },
        alter_pay_passwrod(login_password,pay_password){
          if(login_password===""){
             this.$toast("登录密码不能为空")
            return
          }
          if(!confirm("确定修改吗？")) {
                return ;
              }
          if(pay_password!== this.re_new_pay_password){
            this.re_new_pay_password_tip = true
            return
          }
          const url = mGlobal.DJANGO_SERVER_BASE_URL+"/user/alterPayPwd/"
                  let data_ = {
              "payPassword":pay_password,
              "loginPassword":login_password,
            }
          axios.post(url,data_).then((res)=>{
              if(res.data.code ==="1000"){
                console.log(res.data)
                this.$toast("修改密码成功！")
              }else{
                this.$toast("修改密码失败！"+res.data.message)
              }

            }).catch(error=>{
                console.log("请求错误")
                this.$toast("请求错误")
            })
        },

        alter_passwrod(new_password,old_password){
          if(new_password===""){
             this.new_password_tip = true
            return
          }
          if(this.new_re_password !== new_password){
            this.new_re_password_tip = true
            return
          }
          if(!confirm("确定修改吗？")) {
                return ;
              }
          const url = mGlobal.DJANGO_SERVER_BASE_URL+"/user/alterPwd/"
                  let data_ = {
              "newPassword":new_password,
              "oldPassword":old_password,
            }
          axios.post(url,data_).then((res)=>{
              if(res.data.code ==="1000"){
                console.log(res.data)
                this.$toast("修改密码成功！")
              }else{
                this.$toast("修改密码失败！"+res.data.message)
              }

            }).catch(error=>{
                console.log("请求错误")
                this.$toast("请求错误")
            })
        },
          load_user(){
            const url = mGlobal.DJANGO_SERVER_BASE_URL+"/user/details/-1/"
            axios.get(url).then((res)=>{
              if(res.data.code ==="1000"){
                console.log("**************************************")
                console.log(res.data)
                this.user = res.data.user
              }

            }).catch(error=>{
                console.log("请求错误")
            })
          },
      },
      created(){
        this.load_user()
      }

    }
</script>

<style scoped>
.comm_div{
   border: darkgrey 1px solid; width: 30em;  border-radius: 4px;
   margin-top: 1em;
  padding: 1em;
}
</style>
