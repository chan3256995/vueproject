<template>
    <div class="root">


      <div style="text-align: left">

        <input placeholder="用户名" v-model="query_user_name">
        <button @click="load_user_invite_info(query_user_name)">查询</button>
      </div>

      <table class = "list_table">
          <tr  >
            <td>邀请人</td>
            <td>被邀请人</td>
            <td>邀请时间</td>

            <td>状态</td>



          </tr>
          <tr v-for="(item,index) in invite_reg_info_list" :key="index">
            <td>{{item.inviter.user_name}}</td>
            <td>{{item.be_inviter.user_name}}</td>
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
      name: "InviteRegister",
      data(){
        return {
           pGlobal :mGlobal,
           prePageShow:true,
            nextPageShow:true,
            add_user_name:"",
            query_user_name:"",

            prePageUrl:"",
            nextPageUrl:"",
           invite_reg_info_list:[],
        }
      },
      methods:{
        time_format(time_stmp){
         return mtime.formatDateStrFromTimeSt(time_stmp)
        },
        check_pass(id){


          const url = mGlobal.DJANGO_SERVER_BASE_URL+"/back/inviteRegInfo/"
           axios.post(url,{
              "invite_reg_info_id":id
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
          const url = mGlobal.DJANGO_SERVER_BASE_URL+"/back/inviteRegInfo/"+alipay_account_info_id+"/"
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
        load_user_invite_info(user_name){
          const url = mGlobal.DJANGO_SERVER_BASE_URL+"/back/inviteRegInfo/"
          let params = {
            'user_name': user_name
          }
          this.load_invite_reg_info_page(url,params)
        },

         prePage(){
            console.log(this.prePageUrl)
              this.load_invite_reg_info_page(this.prePageUrl)
          },

          nextPage(){
             console.log(this.nextPageUrl)
              this.load_invite_reg_info_page(this.nextPageUrl)
          },

       load_invite_reg_info_page(url, query_data){

           axios.defaults.withCredentials=true;
           axios.get(url,{
              params:query_data,
          }
        ).then((res)=>{
          console.log(res.data)
          this.invite_reg_info_list = res.data.results;


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
         const url = mGlobal.DJANGO_SERVER_BASE_URL+"/back/inviteRegInfo/"
         this.load_invite_reg_info_page(url)

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
