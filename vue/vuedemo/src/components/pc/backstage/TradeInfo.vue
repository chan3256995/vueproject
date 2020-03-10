<template>
    <div class="root">
      <div>
        <input placeholder="交易号" style="width: 40%" v-model="query_trade_number"><button @click="filter_data({'trade_number':query_trade_number})">查询</button>
      </div>
      <div style="margin-top:0.4em; margin-bottom: 0.4em">
        <input placeholder="用户名" style="width: 10%" v-model="query_user_name2" >

        <select   v-model="trade_source_selected">
                  <option :value="option" v-for="(option,index) in trade_info_source_option" :key="index">{{option.text}}</option>
        </select>
        <select   v-model="trade_type_selected">
                  <option :value="option" v-for="(option,index) in trade_type_option" :key="index">{{option.text}}</option>
        </select>
        <select   v-model="pass_type_selected">
                  <option :value="option" v-for="(option,index) in pass_type_option" :key="index">{{option.text}}</option>
        </select>

        <button @click="filter_data({'args_and':{'user_name':query_user_name2, 'trade_source':trade_source_selected.value , 'cash_in_out_type':trade_type_selected.value,'is_pass':pass_type_selected.value}})">查询2</button> <button @click="filter_data({'check_status':0})">未通过</button><button @click="filter_data({})">全部</button>
      </div>
        <table class = "list_table">
          <tr>
            <td>用户</td>
            <td style="width: 4em">ID</td>
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
            <td style="width: 4em">{{item.user.id}}</td>
            <td style="width: 15em">{{item.trade_number}}</td>
            <td v-if="item.cash_in_out_type ===1">收入</td>
            <td v-else-if="item.cash_in_out_type ===2">支出</td>
            <td>{{item.trade_money}}</td>
            <td style="width: 22em" >{{item.message}}</td>
            <td style="width: 8em">{{item.add_time}}</td>
            <td style="width: 2em" v-if="item.is_pass === true">已通过</td>
            <td style="width: 2em" v-else-if="item.is_pass === false">未审核</td>

            <td>{{item.user_balance}}</td>
            <td v-if="item.is_pass === false">
              <button  @click="recharge_pass(item)">通过</button>
              <input style="border: #3bb4f2 1px solid; margin-top: 0.2em" v-model="item.validation_recharge_number"  />
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
      name: "TradeInfo",
      data(){
        return {

          // 交易来源
            trade_source_selected:{text:"全部",value:""},
            trade_type_selected:{text:"全部",value:""},
            pass_type_selected:{text:"全部",value:""},
            trade_info_source_option:[].concat(mGlobal.TRADE_INFO_SOURCE_OPTIONS),
            trade_type_option:[

              {text:"全部",value:""},
              {text:"收入",value:1},
              {text:"支出",value:2},

            ],
            pass_type_option:[

              {text:"全部",value:""},
              {text:"通过",value:true},
              {text:"未通过",value:false},

            ],
            mGlobal:mGlobal,
            query_trade_number:"",
            query_user_name:"",
            query_user_name2:"",
            prePageShow:true,
            nextPageShow:true,
            account_log_list:[],
            prePageUrl:"",
            nextPageUrl:"",
            user_trade_info_url : mGlobal.DJANGO_SERVER_BASE_URL+"/back/tradeInfo/"
        }
      },
      methods:{
          filter_data(params){

             this.loadCapitalPage(this.user_trade_info_url,params)
          },

        // 充值通过
         recharge_pass(item){
            const url = mGlobal.DJANGO_SERVER_BASE_URL+"/back/rechargePass/"
           if(item.validation_recharge_number===""){
              if(!confirm("校验单号为空,确定继续？")) {
                return ;
              }
           }else{
             if(item.validation_recharge_number !== item.recharge_number){
                if(!confirm("校验单号失败，确定继续？")) {

                return ;
              }
             }

           }
           axios.defaults.withCredentials=true;
            let query_data = {
              "trade_number":item.trade_number
            }
           axios.post(url,query_data

        ).then((res)=>{
          if(res.data.code === "1000"){
            this.$toast("提交成功")
          }


        }).catch(error => {

          console.log(error) ;
        })
         },
        replaceData() {
            for(let i = 0;i<this.account_log_list.length;i++){
              let item =  this.account_log_list[i];
               let  mdate = mtime.formatDateStrFromTimeSt(item.add_time);
               item.add_time =mdate;
               item['validation_recharge_number'] ="";

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
        this.trade_info_source_option.unshift({text:"全部",value:''})
        this.loadCapitalPage(this.user_trade_info_url,{})
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
