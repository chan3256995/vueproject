<template>
    <div class="root">
        <table class = "list_table">
          <tr>
            <td>用户</td>
            <td>交易号</td>
            <td>收支</td>
            <td>金额</td>
            <td>描述</td>
            <td>时间</td>
            <td>状态</td>
            <td>余额</td>
            <td></td>
          </tr>
          <tr  v-for="(item,index) in account_log_list" :key="index">
            <td style="width: 8em">{{item.user.user_name}}</td>
            <td style="width: 15em">{{item.trade_number}}</td>
            <td v-if="item.cash_in_out_type ===1">收入</td>
            <td v-else-if="item.cash_in_out_type ===2">支出</td>
            <td>{{item.trade_money}}</td>
            <td style="width: 22em" >{{item.message}}</td>
            <td style="width: 8em">{{item.add_time}}</td>
            <td style="width: 2em" v-if="item.is_pass === true">已通过</td>
            <td style="width: 2em" v-else-if="item.is_pass === false">未审核</td>

            <td>{{item.user_balance}}</td>
            <td>
              <button v-if="item.is_pass === false" @click="recharge_pass(item.trade_number)">通过</button>
            </td>

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
      name: "CapitalAccount",
      data(){
        return {
           prePageShow:true,
            nextPageShow:true,
            account_log_list:[],
            prePageUrl:"",
            nextPageUrl:"",
        }
      },
      methods:{

        // 充值通过
         recharge_pass(trade_number){
            const url = mGlobal.DJANGO_SERVER_BASE_URL+"/back/rechargePass/"
           axios.defaults.withCredentials=true;
            let query_data = {
              "trade_number":trade_number
            }
           axios.post(url,query_data

        ).then((res)=>{
          console.log(res.data)

        }).catch(error => {

          console.log(error) ;
        })
         },
          replaceData() {
            for(let i = 0;i<this.account_log_list.length;i++){
              let item =  this.account_log_list[i];
               let  mdate = mtime.formatDateStrFromTimeSt(item.add_time);
              item.add_time =mdate;
            }
          },

         prePage(){
            console.log(this.prePageUrl)
            this.loadCapitalPage(this.prePageUrl)
          },

          nextPage(){
             console.log(this.nextPageUrl)
            this.loadCapitalPage(this.nextPageUrl)
          },

        loadCapitalPage(url,query_data){

           axios.defaults.withCredentials=true;
           axios.get(url,{
              params:query_data,
          }
        ).then((res)=>{
          console.log(res.data)
          this.account_log_list = res.data.results;


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
          this.replaceData();
        }).catch(error => {

          console.log(error) ;
        })
        }
      },
      created(){
         const url = mGlobal.DJANGO_SERVER_BASE_URL+"/back/tradeInfo/"
        this.loadCapitalPage(url,{})
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
    width: 100%;
    margin: 0 auto;
    float: bottom;
  }
</style>
