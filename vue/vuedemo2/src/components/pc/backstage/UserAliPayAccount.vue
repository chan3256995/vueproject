<template>
    <div class="root">


      <div style="text-align: left">

        <input placeholder="用户名" v-model="query_user_name">
        <button @click="load_user_alipay_info(query_user_name)">查询</button>
      </div>

      <table class = "list_table">
          <tr  >
            <td>用户名</td>
            <td>用户ID</td>
            <td>支付宝账号</td>
            <td>支付宝真实名</td>
            <td>转账单号</td>
            <td>申请时间</td>
            <td>状态</td>



          </tr>
          <tr v-for="(item,index) in alipay_account_list" :key="index">
            <td>{{item.user.user_name}}</td>
            <td>{{item.user.id}}</td>
            <td>{{item.alipay_account}}</td>
            <td>{{item.alipay_real_name}}</td>
            <td>{{item.check_trade_no}}</td>
            <td>{{time_format(item.add_time)}}</td>
            <td>{{pGlobal.COMMON_CHECK_STATUS[item.check_status]}}</td>

            <td><button @click = delete_user_alipay_account_info(item.id)>删除</button></td>
            <td><button v-if="item.check_status!==pGlobal.COMMON_CHECK_STATUS2['审核通过']" @click = check_pass(item.id)>通过</button></td>

          </tr>
        </table>
      <table class="page_table">
          <tr>
            <td style=" cursor:pointer;"><a >首页</a></td>
            <td style=" cursor:pointer;" v-if="prePageShow"><a  @click="prePage" style="">上一页</a></td>
            <td  style=" cursor:pointer;" v-if="nextPageShow"><a @click="nextPage">下一页</a></td>
      </tr>
      </table>
    </div>
</template>

<script>
      import  axios  from 'axios'
      import mGlobal from '../../../utils/mGlobal';
      import mtime from '../../../utils/mtime.js';

     //设为true 就会带cookies 访问
    axios.defaults.withCredentials=true;
    export default {
      name: "UserAliPayAccount",
      data(){
        return {
           pGlobal :mGlobal,
           prePageShow:true,
            nextPageShow:true,
            add_user_name:"",
            query_user_name:"",

            prePageUrl:"",
            nextPageUrl:"",
           alipay_account_list:[],
        }
      },
      methods:{
        time_format(time_stmp){
         return mtime.formatDateStrFromTimeSt(time_stmp)
        },
        check_pass(id){


          const url = mGlobal.DJANGO_SERVER_BASE_URL+"/back/userAlipayAccountCheckPass/"
           axios.post(url,{
              "user_ali_info_id":id
          }
        ).then((res)=>{
            if(res.data.code === '1000'){
               this.$toast("提交成功")
            }else {
              this.$toast("提交失败："+res.data.message)
            }
           }).catch(err=>{
            this.$toast("访问错误")
           })
        },
        // 删除用户的支付宝账号信息
        delete_user_alipay_account_info(alipay_account_info_id){
             if(!confirm("确定删除订单吗？删除后不可恢复。")) {
                return ;
              }
          const url = mGlobal.DJANGO_SERVER_BASE_URL+"/back/alipayAccountInfo/"+alipay_account_info_id+"/"
           axios.delete(url,{
          }
        ).then((res)=>{
            if(res.data.code === '1000'){
               this.$toast("删除成功")
            }else {
              this.$toast("删除失败："+res.data.message)
            }
           }).catch(err=>{
            this.$toast("访问错误")
           })
        },
        load_user_alipay_info(user_name){
          const url = mGlobal.DJANGO_SERVER_BASE_URL+"/back/alipay_account_info_id/"
          let params = {
            'user_name': user_name
          }
          this.load_user_alipay_account_info_page(url,params)
        },
        // 提交新卡信息
       //  submit_discount_card_info(){
       //    console.log(parseInt(this.discount_card_days))
       //    console.log(parseFloat(this.discount_card_money))
       //    let discount_card_days = parseInt(this.discount_card_days)
       //    let discount_card_money = parseFloat(this.discount_card_money)
       //    if(discount_card_days< 0 || discount_card_days === 0 || discount_card_money< 0 || discount_card_money === 0){
       //      alert("天数跟面额要大于零")
       //    }
       //
       //    let timestamp=new Date().getTime();
       //    let expire_stamp = this.discount_card_days * 24 * 60 * 60 * 1000
       //
       //  let discount_card_info = {
       //        "user_name":this.add_user_name,
       //        "discount_card_type":mGlobal.DISCOUNT_CARD_TYPE2['物流金额优惠卡'],
       //        "discount":this.discount_card_money,
       //        "expire_time":timestamp + expire_stamp
       //  }
       //   const url = mGlobal.DJANGO_SERVER_BASE_URL+"/back/add_discount_card/"
       //    axios.post(url,{
       //     "discount_card_info":discount_card_info
       // }).then((res)=>{
       //        if(res.data.code === "1000") {
       //          this.$toast("提交成功")
       //        }else if( res.data.code === "1001"){
       //           this.$toast(res.data.message)
       //        }
       //
       //    }).catch(error => {
       //      alert("访问错误")
       //
       //    })
       //  },
         prePage(){
            console.log(this.prePageUrl)
              this.load_user_alipay_account_info_page(this.prePageUrl)
          },

          nextPage(){
             console.log(this.nextPageUrl)
              this.load_user_alipay_account_info_page(this.nextPageUrl)
          },

       load_user_alipay_account_info_page(url, query_data){

           axios.defaults.withCredentials=true;
           axios.get(url,{
              params:query_data,
          }
        ).then((res)=>{
          console.log(res.data)
          this.alipay_account_list = res.data.results;


          if(res.data.previous == null){
            this.prePageShow = false;
          }else{
              this.prePageShow = true;
          }
           this.prePageUrl = res.data.previous;

          if(res.data.next == null){
            this.nextPageShow = false;
          }else{
            this.nextPageShow = true;
          }
           this.nextPageUrl = res.data.next;

        }).catch(error => {

          console.log(error) ;
        })
        }

      },
      created(){
         const url = mGlobal.DJANGO_SERVER_BASE_URL+"/back/alipayAccountInfo/"
         this.load_user_alipay_account_info_page(url)

      }

    }
</script>

<style scoped>
  .root{
    width: 1100px;
  }
  .list_table{
    width: 100%;

  }
  .list_table tr td{
    padding: 0px;
    margin: 0px;
    border: darkgrey 1px solid;
  }
  .page_table{
    margin: 0 auto;
    float: bottom;
  }
</style>
