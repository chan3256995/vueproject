<template>
    <div>
      <div class="comm_div">
           <label style="color: red; padding-bottom: 1em">支付宝信息认证({{mGlobal.COMMON_CHECK_STATUS[alipay_account_info.check_status]}})</label>
          <table>
                  <tr>
                <td>支付宝账号</td><td style="text-align: left"><input   class="global_input_default_style" v-model="alipay_account_info.alipay_account"   /></td>

              </tr>
              <tr>
                <td>支付宝真实姓名</td><td style="text-align: left"><input class="global_input_default_style"    v-model="alipay_account_info.alipay_real_name"  /> </td>

              </tr>

              <tr>
                <td>支付宝转账单号</td><td style="text-align: left"><input class="global_input_default_style"    v-model="alipay_account_info.check_trade_no"  /> </td>

              </tr>

            </table>
            <p style="color:red"> 用上面填写的支付宝给 a554966117@163.com 转 0.08元 作为审核凭证并把支付宝转账单号填写提交</p>
          <button class = "global_btn_normal_style"  :disabled = "alipay_account_info.check_status !== undefined && alipay_account_info.check_status === mGlobal.COMMON_CHECK_STATUS['审核通过']" @click="submit_alipay_info(alipay_account_info.alipay_account,alipay_account_info.alipay_real_name,alipay_account_info.check_trade_no )">确定提交</button>
        </div>
      <div class="comm_div" >
        <table style="text-align: left;">
          <tr>
            <td>用户名：</td><td style="text-align: left"><label >{{user.user_name}}</label></td>

          </tr>
          <tr>
            <td>邮箱：</td><td><input class="global_input_default_style" v-model="user.email"/></td>
          </tr>
          <tr>
          <td>手机号：</td><td><input class="global_input_default_style" v-model="user.phone"/></td>
          </tr>
          <tr>
          <td>QQ：</td><td><input class="global_input_default_style" v-model="user.qq"/></td>
          </tr>
          <tr>
            -----------
          </tr>
          <tr>
          <td>寄件人姓名：</td><td><input class="global_input_default_style" v-model="user.sender_name"/></td>
          </tr>
          <tr>
          <td>寄件人电话：</td><td><input class="global_input_default_style" v-model="user.sender_phone"/></td>
          </tr>
          <tr>
          <td >寄件人地址：</td>
            <td><input class="global_input_default_style" style="width: 25%;" placeholder="省份" v-model="user.sender_province"/>
            <input class="global_input_default_style" style="width: 25%;"   placeholder="城市"  v-model="user.sender_city"/>
            <input style="width: 25%;" class="global_input_default_style"  placeholder="县/区"  v-model="user.sender_area"/></td>
          </tr>
          <tr>
          <td>详细地址：</td><td><input class="global_input_default_style" style="height: 5em"   placeholder="详细地址" v-model="user.sender_address_details"/></td>
          </tr>
        </table>
        <button class="global_btn_normal_style" @click="alter_user_detail(user.email,user.phone,user.qq,user.sender_name,user.sender_phone,user.sender_province,user.sender_city,user.sender_area,user.sender_address_details)">确认修改</button>
        </div>
      <div class="comm_div">
          <label style="color: red; padding-bottom: 1em">修改登录密码</label>
          <table>
            <tr>
                <td>原登录密码</td><td style="text-align: left"><input  class="global_input_default_style"  @focus="password_input_focus()" v-model="old_password" type="password" /></td>

              </tr>

              <tr>
                <td>新登录密码</td><td style="text-align: left"><input  class="global_input_default_style"  @focus="password_input_focus()" v-model="new_password" type="password" /><label v-if="new_password_tip===true" style="color: red">密码不能为空</label></td>

              </tr>
              <tr>
                <td> 再次输入密码：</td><td><input class="global_input_default_style" type="password" @focus="password_input_focus()"  v-model="new_re_password" /><label v-if="new_re_password_tip===true" style="color: red">密码不一致</label></td>
              </tr>
            </table>
          <button  class = "global_btn_normal_style" @click="alter_passwrod(new_password,old_password)">确认修改</button>
        </div>
      <div class="comm_div">
           <label style="color: red; padding-bottom: 1em">修改支付密码</label>
          <table>
                  <tr>
                <td>登录密码</td><td style="text-align: left"><input   class="global_input_default_style" @focus="password_input_focus()" v-model="old_password2" type="password" /></td>

              </tr>
              <tr>
                <td>新支付密码</td><td style="text-align: left"><input class="global_input_default_style"   @focus="password_input_focus()" v-model="new_pay_password" type="password" /><label v-if="new_pay_password_tip===true" style="color: red">密码不能为空</label></td>

              </tr>
              <tr>
                <td> 再次输入支付密码：</td><td><input class="global_input_default_style" type="password" @focus="password_input_focus()"  v-model="re_new_pay_password" /><label v-if="re_new_pay_password_tip===true" style="color: red">密码不一致</label></td>
              </tr>
            </table>
          <button class = "global_btn_normal_style" @onfocus="password_input_focus()" @click="alter_pay_passwrod(old_password2,new_pay_password)">确认修改</button>
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
          alipay_account_info:{
            'alipay_account':"",
            'alipay_real_name':"",
            'check_trade_no':"",

          },
          new_re_password_tip: false,
          new_password_tip: false,
          new_pay_password_tip: false,
          re_new_pay_password_tip: false,
          mGlobal:mGlobal,
        }
      },
      methods:{

        password_input_focus(){
            this.new_re_password_tip= false,
          this.new_password_tip= false,
          this.new_pay_password_tip= false,
          this. re_new_pay_password_tip= false
        },
        alter_user_detail(email,phone,qq,sender_name,sender_phone,sender_province,sender_city,sender_area,sender_address_details){
               if(!confirm("确定修改吗？")) {
                return ;
              }

              const url = mGlobal.DJANGO_SERVER_BASE_URL+"/user/details/-1/"
              let data_ = {
              "email":email,
              "phone":phone,
              "sender_name":sender_name,
              "sender_phone":sender_phone,
              "sender_province":sender_province,
              "sender_city":sender_city,
              "sender_area":sender_area,
              "sender_address_details":sender_address_details,
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
        submit_alipay_info(alipay_account,alipay_real_name,check_trade_no){
          const url = mGlobal.DJANGO_SERVER_BASE_URL+"/user/userAlipayRealInfo/-1/"

          if(alipay_account==="" || alipay_real_name ===""){
             this.$toast("账号和密码不能为空")
            return
          }
          if(!confirm("确定修改吗？")) {
                return ;
              }
              let alipay_account_info = {
              "alipay_account":alipay_account,
              "alipay_real_name":alipay_real_name,
              "check_trade_no":check_trade_no,
            }

              axios.put(url,{
                "alipay_account_info":alipay_account_info
              }).then((res)=>{
              if(res.data.code ==="1000"){
                console.log(res.data)
                this.$toast("提交成功！")
                this.load_alipay_info()
              }else{
                this.$toast("提交失败！"+res.data.message)
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
        load_alipay_info(){
          const url = mGlobal.DJANGO_SERVER_BASE_URL+"/user/userAlipayRealInfo/-1/"
          axios.get(url).then((res)=>{
              if(res.data.code ==="1000"){
                if (res.data.alipay_account_info !==null){
                  this.alipay_account_info = res.data.alipay_account_info
                  alert(alipay_account_info)
                }

              }

            }).catch(error=>{
                console.log("请求错误")
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
        this.load_user();
        this.load_alipay_info();
      }

    }
</script>

<style lang="less" scoped>
@import "../../../static/css/PGLOBALCSS.css";
@import "../../../static/css/PGLOBALLESS.less";
.comm_div{
   border: darkgrey 1px solid; width: 30em;  border-radius: 4px;
   margin-top: 1em;
   padding: 1em;

}
</style>
