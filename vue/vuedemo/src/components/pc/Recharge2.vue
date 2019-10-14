<template>
    <div>

        <table>

          <vue-qr v-if="user!=''" :text="config.value" :margin="0" colorDark="black" colorLight="#fff" :logoSrc="config.imagePath" :logoScale="0.3" :size="200"></vue-qr>
        </table>

       <table>
          <tr>
            <td>用户名：</td>
            <td>{{user.user_name}}</td>
            <td style="padding-left: 2em">余额：</td>
            <td style="color: red">{{user.balance}}</td>
            <td><button @click="load_user_info('刷新成功')"> 刷新余额</button></td>
          </tr>

        </table>
      <div style="border: #878d99 solid 1px;padding:2em;margin-top: 2em;">

       <label style="color: red">如果扫码转账后长时间未到账请提交转账单号跟金额</label>
      <table style="  ;padding-right: 10em">

           <tr>
          <td> </td>
          <td></td>
        </tr>
        <tr>
          <td>金额：</td>
          <td><input v-model="trade_money" /></td>
        </tr>
        <tr>
          <td>交易单号：</td>
          <td><input v-model="recharge_number"/></td>
        </tr>
        <tr>
          <td><button @click="recharge(recharge_number,trade_money)"> 提 交</button></td>
        </tr>
      </table>
</div>
    </div>
</template>

<script>
     import VueQr from 'vue-qr'
      import  axios  from 'axios'

     import mGlobal from '../../utils/mGlobal';
     import pcommon_function from '../../utils/pcommon_function'
     //设为true 就会带cookies 访问
    axios.defaults.withCredentials=true;

    export default {

      name: "Recharge2",
      components: {
          VueQr,

    },
      data(){

        return{
          repeat : 5,
          user: "",
          recharge_number:"",
          trade_money:"",
          config: {
           　　 value: 'alipays://platformapi/startapp?appId=20000123&actionType=scan&biz_data={"s":"money","u":"2088012229532543","a":"","m":"999"}',
            　　imagePath: require('../../assets/logo.png'),　　// 注意这里的图片使用require
            　　filter: 'color'
        　　}
        }

      },
      methods:{
            recharge(recharge_number, trade_money){
            const url = mGlobal.DJANGO_SERVER_BASE_URL+"/user/recharge/"
            let datas = {
              "recharge_number":recharge_number,
              "trade_money":trade_money
            }
            if(trade_money ==="" || trade_money< 0 || trade_money===0){
              this.$toast("充值金额大于0")
              return
            }
            if(recharge_number ===""){
              this.$toast("充值号不能为空")
              return
            }
            axios.post(url,datas).then((res)=>{
              console.log(res.data)
              if(res.data.code ==="1000"){
                this.$toast("提交成功")
              }else{
                this.$toast("提交失败："+res.data.message)
              }
            }).catch(error=>{
                this.$toast("请求错误")
            })
          },

           // 刷新二维码和用户信息
          refresh_qr_and_user() {
            pcommon_function.load_user().then((res) => {
              if (res.data.code === "1000") {
                console.log("**************************************")
                console.log(res.data)
                this.user = res.data.user
                let timestamp = new Date().getTime() + "_" + this.user.id
                this.config =
                  {
                    value: 'alipays://platformapi/startapp?appId=20000123&actionType=scan&biz_data={"s":"money","u":"2088012229532543","a":"","m":"' + timestamp + '"}',
                    imagePath: require('../../assets/logo.png'),　　// 注意这里的图片使用require
                    filter: 'color'
                  }
                  // 限制执行次数为5次

              } else {

              }

            }).catch(error => {
              console.log("请求错误")

            })
          },
  //加载用户信息
        load_user_info(tip_message){
          pcommon_function.load_user().then((res)=>{
              if(res.data.code ==="1000"){
                this.user =  res.data.user
                console.log('tipmessage ')
                console.log(tip_message)
                if(tip_message !== undefined){
                  this.$toast(tip_message)
                }

              }else{

              }

            }).catch(error=>{
                console.log("请求错误")

            })
          },

        },


      created(){
         this.refresh_qr_and_user()

      }

    }
</script>

<style scoped>

</style>
