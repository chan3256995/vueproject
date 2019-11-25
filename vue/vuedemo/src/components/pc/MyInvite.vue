<template xmlns:v-clipboard="http://www.w3.org/1999/xhtml">
    <div class="root">
        <div style="margin-top: 3em">

          <p style="color: red">邀请一人注册并且对方支付宝实名认证后可获得一张四个月快递费优惠卡(快递费每单减0.5元，不限单数)</p>
          <label>我的邀请地址：</label><input style="width: 40%" v-model="my_invite_http_address"/>
          <a style="cursor:pointer; text-decoration:underline; color:blue" v-if="alipay_account_info==''"  @click="go_to_personal">点击支付宝实名认证</a>
          <label style="color: red" v-if="alipay_account_info==''">( 支付宝实名认证后才有地址 )</label>
          <button @click="mcommon_function.copy_to_clipboard(my_invite_http_address)">复制地址</button>

        </div>
        <table class = "list_table">
          <tr>
            <td>我邀请的用户</td>
            <td>邀请注册时间</td>
            <td>审核状态</td>

          </tr>
          <tr  v-for="(item,index) in be_inviter_list" :key="index">
            <td style="width: 15em">{{item.be_inviter.user_name}}</td>
            <td >{{format_time_stamp(item.add_time)}}</td>
            <td >{{mGlobal.COMMON_CHECK_STATUS[item.check_status]}}</td>
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
       import mGlobal from '../../utils/mGlobal';
      import mtime from '../../utils/mtime.js';
      import mcommon_function from '../../utils/mcommon_function'

     //设为true 就会带cookies 访问
    axios.defaults.withCredentials=true;
    export default {
      name: "MyInvite",
      data(){
        return {
            mcommon_function:mcommon_function,
            my_invite_http_address:"",
            alipay_account_info:"",
            prePageShow:true,
            nextPageShow:true,
            be_inviter_list:[],
            prePageUrl:"",
            nextPageUrl:"",
            mGlobal:mGlobal,
            user:"",
        }
      },
      methods:{
          go_to_personal(){
             let  routeData = this.$router.resolve({ path: '/pc/personal/userDetails'})
            window.open(routeData.href, '_blank')
          },
         format_time_stamp(time_stamp){
           return  mtime.formatDateStrFromTimeSt(time_stamp);
         },

         load_user(){
            const url = mGlobal.DJANGO_SERVER_BASE_URL+"/user/details/-1/"
            axios.get(url).then((res)=>{
              if(res.data.code ==="1000"){
                this.user = res.data.user

              }

            }).catch(error=>{
                console.log("请求错误")
            })
          },
         prePage(){
            console.log(this.prePageUrl)
            this.loadInvitePage(this.prePageUrl)
          },

          nextPage(){
             console.log(this.nextPageUrl)
            this.loadInvitePage(this.nextPageUrl)
          },

        loadInvitePage(url){

           axios.defaults.withCredentials=true;
           axios.get(url,{

          }
        ).then((res)=>{

          this.be_inviter_list = res.data.results;

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

         load_alipay_info(){
          const url = mGlobal.DJANGO_SERVER_BASE_URL+"/user/userAlipayRealInfo/-1/"
          axios.get(url).then((res)=>{
              if(res.data.code ==="1000"){
                console.log(res.data)
                if(res.data.alipay_account_info !==null && res.data.alipay_account_info.check_status === mGlobal.COMMON_CHECK_STATUS2['审核通过']){
                  this.alipay_account_info = res.data.alipay_account_info
                   this.my_invite_http_address = mGlobal.VUE_REQUEST_BASE_URL+"/pc/register/?inviter_id="+this.alipay_account_info.user
                }


              }

            }).catch(error=>{
                console.log("请求错误")
            })
        },
      },
      created(){
        const url = mGlobal.DJANGO_SERVER_BASE_URL+"/user/inviteInfo/"
        this.load_user()
        this.loadInvitePage(url,{})
        this.load_alipay_info()


      }

    }
</script>

<style lang="less" scoped>
@import "../../../static/css/PGLOBALCSS.css";
@import "../../../static/css/PGLOBALLESS.less";
  .root{
    width: 1000px;
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
    width: auto;
    margin: 0 auto;
    float: bottom;
  }
</style>
