<template>
    <div class="root">
      <div>
        <table  >
          <tr>
            <td>用户名</td>
            <td>金额</td>
            <td>备注</td>

          </tr>
          <tr>
            <td><input v-model="add_balance_user_name" ></td>
            <td><input type="number" v-model="add_money" ></td>
            <td><input   v-model="add_message" ></td>

            <td><button @click="add_balance({'user_name':add_balance_user_name,'add_money':add_money,'message':add_message})">添加余额</button></td>
          </tr>
      </table>
        <div style="text-align: left">

          <input placeholder="用户名" v-model="query_user_name">
          <button @click="load_user_info_by_name(query_user_name)">查询</button>
        </div>
      </div>

        <table class = "list_table">
          <tr  >
            <td>用户名</td>
            <td>用户ID</td>
            <td>qq</td>
            <td>余额</td>
            <td>邮箱</td>
            <td>类型</td>
            <td>添加时间</td>


          </tr>
          <tr v-for="(item,index) in user_list" :key="index">
            <td>{{item.user_name}}</td>
            <td>{{item.id}}</td>
            <td>{{item.qq}}</td>
            <td>{{item.balance}}</td>
            <td>{{item.email}}</td>
            <td>{{item.type}}</td>


            <td> <label v-text="time_format(item.add_time)"></label></td>
            <td><button  >删除</button></td>

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
      name: "Users",
      data(){
        return {
           pGlobal :mGlobal,
           prePageShow:true,
            nextPageShow:true,
            add_balance_user_name:"",
            add_money:"",
            add_message:"",
            query_user_name:"",

            prePageUrl:"",
            nextPageUrl:"",

          user_list:[]
        }
      },
      methods:{
        time_format(time_stmp){
         return mtime.formatDateStrFromTimeSt(time_stmp)
        },
        add_balance(query_data){
           if(query_data["add_money"] === null || query_data["add_money"] ==="" ||isNaN(query_data["add_money"])){
             alert("非法金额")
             return
           }
            if(query_data["user_name"] === null || query_data['user_name'] === ''){
             alert("用户名不能为空")
             return
           }
           const url = mGlobal.DJANGO_SERVER_BASE_URL+"/back/addUserBalance/"
           axios.defaults.withCredentials=true;
           axios.post(url,
            query_data,

        ).then((res)=>{
           if(res.data.code ==="1000"){

              this.$toast("提交成功")
              this.add_balance = "";
              this.add_money = "";
              this.add_message = "";
           }else{
             this.$toast("提交失败")
           }
           }).catch((err)=>{
               this.$toast("提交失败"+error)
                 console.log(error) ;
           })

        },
        load_user_info_by_name(user_name){
          const url = mGlobal.DJANGO_SERVER_BASE_URL+"/back/users/"
          let params = {
            'user_name': user_name
          }
          this.load_user_info_page(url,params)
        },

         prePage(){
            console.log(this.prePageUrl)
            this.load_user_info_page(this.prePageUrl)
          },

          nextPage(){
             console.log(this.nextPageUrl)
             this.load_user_info_page(this.nextPageUrl)
          },

       load_user_info_page(url, query_data){

           axios.defaults.withCredentials=true;
           axios.get(url,{
              params:query_data,
          }
        ).then((res)=>{
          console.log(res.data)
          this.user_list = res.data.results;


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
         const url = mGlobal.DJANGO_SERVER_BASE_URL+"/back/users/"
         this.load_user_info_page(url)

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
