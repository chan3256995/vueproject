<template>
    <div class="root">
      <div  style="margin-top: 3em">

        <p style="color: red">邀请一人注册并且对方支付宝实名认证后可获得一张三个月快递费优惠卡(快递费每单减0.5元，不限单数)</p>
        <a style="cursor:pointer; text-decoration:underline; color:blue"   @click="go_to_personal">去支付宝实名认证(审核通过默认送10天快递0.5元优惠卡)</a>
      </div>

        <table class = "list_table" v-if="discount_card_list.length > 0">
          <tr  >
            <td>用户ID</td>
            <td>优惠面额</td>
            <td>折扣卡类型</td>
            <td>过期时间</td>
            <td>添加时间</td>


          </tr>
          <tr v-for="(item,index) in discount_card_list" :key="index">
            <td>{{item.user}}</td>

            <td>{{item.discount}}</td>
            <td>{{pGlobal.DISCOUNT_CARD_TYPE[item.discount_card_type]}}</td>
            <td> <label v-text="time_format(item.expire_time)"></label></td>
            <td> <label v-text="time_format(item.add_time)"></label></td>


          </tr>
        </table>
      <table class="page_table" v-if="discount_card_list.length > 0" >
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
      import mGlobal from '../../utils/mGlobal';
      import mtime from '../../utils/mtime.js';

     //设为true 就会带cookies 访问
    axios.defaults.withCredentials=true;
    export default {
      name: "MyDiscountCard",
      data(){
        return {
           pGlobal :mGlobal,
           prePageShow:true,
            nextPageShow:true,

            prePageUrl:"",
            nextPageUrl:"",
          discount_card_list:[],
        }
      },
      methods:{
        time_format(time_stmp){
         return mtime.formatDateStrFromTimeSt(time_stmp)
        },
         go_to_personal(){
             let  routeData = this.$router.resolve({ path: '/pc/personal/userDetails'})
            window.open(routeData.href, '_blank')
          },

          load_discount_card_info_page(url, query_data){

           axios.defaults.withCredentials=true;
           axios.get(url,{
              params:query_data,
          }
        ).then((res)=>{
          console.log(res.data)
          this.discount_card_list = res.data.data;


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
        },


         prePage(){
            console.log(this.prePageUrl)

          },

          nextPage(){
             console.log(this.nextPageUrl)

          },

      },
      created(){
         const url = mGlobal.DJANGO_SERVER_BASE_URL+"/user/userDiscountCards/"
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
