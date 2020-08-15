<template>
    <div>
        <table>

          <tr>
            <td>金额：</td><td><input type="number" v-model="trade_money"/></td>
            <td>支付宝交易号：</td><td><input v-model="recharge_number"/></td>
          </tr>
        </table>
      <button @click="recharge(recharge_number,trade_money)"> 提 交</button>
    </div>
</template>

<script>
      import  axios  from 'axios'
       import mGlobal from '../../utils/mGlobal';
     //设为true 就会带cookies 访问
    axios.defaults.withCredentials=true;
    export default {
      name: "Recharge",
      data(){
        return{
          recharge_number:"",
          trade_money:""
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
      },
      created(){

      }

    }
</script>

<style scoped>

</style>
