<template>
    <div class="root">
      <div>
        <table class = "add_discount_card">
          <tr>
            <td>用户名</td>
            <td>面额</td>
            <td>天数</td>
          </tr>
        <tr>
            <td><input v-model="add_user_name"></td>
            <td><input type="number" v-model="discount_card_money"></td>
            <td><input type="number" v-model="discount_card_days"></td>
            <td><button @click="submit_discount_card_info">提交</button></td>
          </tr>
      </table>
        <div style="text-align: left">

          <input placeholder="用户名" v-model="query_user_name">
          <button @click="load_discount_card_info_by_name(query_user_name)">查询</button>
        </div>
      </div>

        <table class = "list_table">
          <tr  >
            <td>用户名</td>
            <td>用户ID</td>
            <td>优惠面额</td>
            <td>折扣卡类型</td>
            <td>过期时间</td>
            <td>添加时间</td>


          </tr>
          <tr v-for="(item,index) in discount_card_list" :key="index">
            <td>{{item.user.user_name}}</td>
            <td>{{item.user.id}}</td>
            <td>{{item.discount}}</td>
            <td>{{pGlobal.DISCOUNT_CARD_TYPE[item.discount_card_type]}}</td>
            <td> <label v-text="time_format(item.expire_time)"></label></td>
            <td> <label v-text="time_format(item.add_time)"></label></td>
            <td><button @click = delete_discount_card(item.id)>删除</button></td>

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
      name: "DiscountCard",
      data(){
        return {
           pGlobal :mGlobal,
           prePageShow:true,
            nextPageShow:true,
            add_user_name:"",
            query_user_name:"",
            discount_card_money:0,
            discount_card_days:0,
            prePageUrl:"",
            nextPageUrl:"",
          alipay_account_list:[],
          discount_card_list:[]
        }
      },
      methods:{
        time_format(time_stmp){
         return mtime.formatDateStrFromTimeSt(time_stmp)
        },
        // 删除优惠卡
        delete_discount_card(card_id){
           if(!confirm("确定删除吗？删除后不可恢复。")) {
                return ;
              }
          const url = mGlobal.DJANGO_SERVER_BASE_URL+"/back/discountCard/"+card_id+"/"
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
        load_discount_card_info_by_name(user_name){
          const url = mGlobal.DJANGO_SERVER_BASE_URL+"/back/discountCard/"
          let params = {
            'user_name': user_name
          }
          this.load_discount_card_info_page(url,params)
        },
        // 提交新卡信息
        submit_discount_card_info(){

          let discount_card_days = parseInt(this.discount_card_days)
          let discount_card_money = parseFloat(this.discount_card_money)
          if(discount_card_days< 0 || discount_card_days === 0 || discount_card_money< 0 || discount_card_money === 0){
            alert("天数跟面额要大于零")
          }

          let timestamp=new Date().getTime();
          let expire_stamp = this.discount_card_days * 24 * 60 * 60 * 1000

        let discount_card_info = {
              "user_name":this.add_user_name,
              "discount_card_type":mGlobal.DISCOUNT_CARD_TYPE2['物流金额优惠卡'],
              "discount":this.discount_card_money,
              "expire_time":timestamp + expire_stamp
        }
          const url = mGlobal.DJANGO_SERVER_BASE_URL+"/back/add_discount_card/"
          axios.post(url,{
           "discount_card_info":discount_card_info
       }).then((res)=>{
              if(res.data.code === "1000") {
                this.$toast("提交成功")
              }else if( res.data.code === "1001"){
                 this.$toast(res.data.message)
              }
          }).catch(error => {
            alert("访问错误")

          })
        },
         prePage(){
            console.log(this.prePageUrl)
            this.load_discount_card_info_page(this.prePageUrl)
          },

          nextPage(){
             console.log(this.nextPageUrl)
             this.load_discount_card_info_page(this.nextPageUrl)
          },

       load_discount_card_info_page(url, query_data){

           axios.defaults.withCredentials=true;
           axios.get(url,{
              params:query_data,
          }
        ).then((res)=>{
          console.log(res.data)
          this.discount_card_list = res.data.results;


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
         const url = mGlobal.DJANGO_SERVER_BASE_URL+"/back/discountCard/"
         this.load_discount_card_info_page(url)

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
