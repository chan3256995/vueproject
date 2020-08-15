<template>

<div class="login">
  <!--<button @click="test">test</button>-->
  <!--<button @click="test2">test2</button>-->
  <!--<button  @click="test3" >test3</button>-->
  <table style="margin: 0 auto">
    <tr>
      <td>用户名：</td>
      <td><input class="global_input_default_style"  v-model="username"/></td>
    </tr>
    <tr>
      <td> 密  码 ：</td>
      <td> <input class="global_input_default_style" v-model="password" type="password"/></td>
    </tr>
    <tr>
      <td> </td>
      <td> <button :class="{'global_btn_normal_style':!submit_btn_disable  , 'global_btn_clicked_style':submit_btn_disable  }" @click="login" :disabled="submit_btn_disable">登录</button>
        <button class="global_btn_normal_style" @click = 'register'>注册</button></td>
      <td><a @click="go_forgot_password_page" style="color: blue">忘记密码？</a></td>
    </tr>
  </table>

</div>
</template>

<script>
  import  axios  from 'axios'
  import qs from 'qs';
  export default {
    name: 'login',
    data(){
      return{
        submit_btn_disable: false,
        username:'',
        password:'',
        datas:{},

      }
    },
    created(){

    },
    methods:{
      test(){

        let url = "api333/taobao/api_call.php?page=&tabCode=&dateBegin=&dateEnd=&buyerNick=&itemTitle=&orderId=&lastStartRow=&detail=&api_name=seller_order_list&lang=zh-CN&key=tel17820155888&secret=20191220&cookie=dGh3PWNuOyB4PWUlM0QxJTI2cCUzRColMjZzJTNEMCUyNmMlM0QwJTI2ZiUzRDAlMjZnJTNEMCUyNnQlM0QwJTI2X19sbCUzRC0xJTI2X2F0byUzRDA7IFVNX2Rpc3RpbmN0aWQ9MTZlMDVmMGUxY2JiLTAwY2ZlMzJjN2Q3N2Y2LTQxNGYwMTIwLTEwMDIwMC0xNmUwNWYwZTFlMTk4OyBhbGlfYWI9MTQuMTQ1LjIwLjg5LjE1NzM1NjA3MTAxMjMuMzsgZXZlcnl3aGVyZV90b29sX3dlbGNvbWU9dHJ1ZTsgaG5nPUNOJTdDemgtQ04lN0NDTlklN0MxNTY7IHY9MDsgX21faDVfdGs9ZGEwMzM4Y2UxZGY0Yzk3ZmZmNDRjYWVjYjQxNDc0NGZfMTU3Njg1NDY2NjE2MDsgX21faDVfdGtfZW5jPTYzMzI3ZDAzMzc0MTczZjcwOTA0MmI1NDNjMGRhMGY4OyBtdW5iPTQ2NzYzMDMxODsgY25hPXdNMEFGcW1pbDJBQ0FRNlJGZEM2K2FaNzsgZW5jPW1rMUpSWHdBZUF5d1pEeFpxaG9JaFFCblBKRXVJc1I4eERsZVdmckdEMHJSWFJ2OXFidVd1SWt4UFdROTRYYnpJRk9tUjN0bGI4a1EzaVFjZUNmWFRBJTNEJTNEOyBfdGJfdG9rZW5fPTNiMTg4ZWU1MzFlMTM7IHVuYj00Njc2MzAzMTg7IHVjMz1uazI9RGw5T1NyN3p1RnRyc0h4VyZsZzI9VjMyRlBrayUyRncwZFV2ZyUzRCUzRCZpZDI9VnlwWDZTcnduQjJEJnZ0Mz1GOGRCeXVxanBGT1hROU9xM09JJTNEOyBjc2c9MDRjYmJmMTc7IGxnYz1tb29ubGlnaHQ1Mzk7IHQ9OWFhZGQ1Y2I5ZTY0OGE2ZWY4MTlmYWI5NDEyYjRmMmM7IGNvb2tpZTE3PVZ5cFg2U3J3bkIyRDsgZG5rPW1vb25saWdodDUzOTsgc2t0PTJkNDQxZTBhYjI5ZGI5ZjE7IGNvb2tpZTI9N2FhMGU1M2Q2OTYxNDZkMmNhMGJjNjNhOTcwOTg0ZTY7IGV4aXN0U2hvcD1NVFUzTmprek16WXlNdyUzRCUzRDsgdWM0PWlkND0wJTQwVlgwOW9WTjNqTnRPRW9RM3hZOHlBNXVFWnNBJTNEJm5rND0wJTQwRERyTExNUmpnZzBOQml3JTJCNGtuNzVZWHRoT0RIc3FNJTNEOyB0cmFja25pY2s9bW9vbmxpZ2h0NTM5OyBtdD1jaT0wXzE7IF9jY189VUlIaUx0M3hTdyUzRCUzRDsgdGc9MDsgX2xfZ189VWclM0QlM0Q7IHNnPTk4MjsgX25rXz1tb29ubGlnaHQ1Mzk7IGNvb2tpZTE9VW9qVVZMUlFhODdwWFZQUEdTRkQ2UU9mJTJGJTJGbTB3V09IQWVOSWJMcTd2STQlM0Q7IGlzZz1CQU1EZGx2TldwVFpxQll0bEZTbTk0eDdrc2V0ZUplNnBqTVdFelhnUjJMWjlDTVd2VTBxQ3U5bmFzUWYxTy15OyBsPWRCUWIwYmVscUdlbDNzU0tCT0N3b3VyemE3N3Q3SVJBZ3VQemFOYk1pXzVRdjZUc2RQYk9rZS1yQ0Y5NmNqV2ZUeFRCNGZ1V1l2eTktZXRrYUdyU0QyU3BYVUo2R3hEYy47IHVjMT1jb29raWUxNj1WcThsJTJCS0NMeVNMWk1GV0h4cXM4ZndxbkV3JTNEJTNEJmNvb2tpZTIxPVZxOGwlMkJLQ0xqNkhrM1o3ZHJ3JTNEJTNEJmNvb2tpZTE1PVZxOGwlMkJLQ0x6MyUyRjY1QSUzRCUzRCZleGlzdFNob3A9dHJ1ZSZwYXM9MCZjb29raWUxND1Vb1RibTg0Zlp6OVhkZyUzRCUzRCZ0YWc9OCZsbmc9emhfQ047IA"
        axios.post(url).then((res)=>{
       console.log(res)

          }).catch(error => {

            alert(error)

          })
      },
      test3(){
           let parms = {
                 "source":"",
                 "callUrl":"",
                 // "_tb_token_":"ffe0157689337",
                 "orderStatusShow" :"send",
                 "receiverName" :"",
                 "receiverWangWangId":"" ,
                 "beginDate" :"",
                 "endDate" :"",
                 "taobaoTradeId" :"",
                 "shipping2":"-1",
                 "orderType":"-1",
                 "orderSource":"0",
                 "currentPage" :1,

             }
fetch("https://wuliu.taobao.com/user/order_list_new.htm?order_status_show=send", {
     method: 'GET',
     mode: 'no-cors',
     credentials: 'include',
     //body: parms,



}).then(function(response) {
  console.log(response);
});

      },
      test2(){
        let cookies_str = "thw=cn; x=e%3D1%26p%3D*%26s%3D0%26c%3D0%26f%3D0%26g%3D0%26t%3D0%26__ll%3D-1%26_ato%3D0; UM_distinctid=16e05f0e1cbb-00cfe32c7d77f6-414f0120-100200-16e05f0e1e198; ali_ab=14.145.20.89.1573560710123.3; everywhere_tool_welcome=true; hng=CN%7Czh-CN%7CCNY%7C156; v=0; munb=467630318; cna=wM0AFqmil2ACAQ6RFdC6+aZ7; enc=mk1JRXwAeAywZDxZqhoIhQBnPJEuIsR8xDleWfrGD0rRXRv9qbuWuIkxPWQ94XbzIFOmR3tlb8kQ3iQceCfXTA%3D%3D; _tb_token_=3b188ee531e13; unb=467630318; uc3=id2=VypX6SrwnB2D&vt3=F8dByuqh7KAnSm3dtlg%3D&lg2=U%2BGCWk%2F75gdr5Q%3D%3D&nk2=Dl9OSr7zuFtrsHxW; csg=735219a7; lgc=moonlight539; t=9aadd5cb9e648a6ef819fab9412b4f2c; cookie17=VypX6SrwnB2D; dnk=moonlight539; skt=a612d98a82986f4f; cookie2=7aa0e53d696146d2ca0bc63a970984e6; existShop=MTU3NzE5OTA4Nw%3D%3D; uc4=id4=0%40VX09oVN3jNtOEoQ3xY74byFiG3Y%3D&nk4=0%40DDrLLMRjgg0NBiw%2B4kn75YQOkYKwoAM%3D; tracknick=moonlight539; mt=ci=0_1; _cc_=VT5L2FSpdA%3D%3D; tg=0; _l_g_=Ug%3D%3D; sg=982; _nk_=moonlight539; cookie1=UojUVLRQa87pXVPPGSFD6QOf%2F%2Fm0wWOHAeNIbLq7vI4%3D; uc1=cookie16=WqG3DMC9UpAPBHGz5QBErFxlCA%3D%3D&cookie21=URm48syIYRhCUUEvKg%3D%3D&cookie15=V32FPkk%2Fw0dUvg%3D%3D&existShop=true&pas=0&cookie14=UoTbmhFnaHN%2FiQ%3D%3D&tag=8&lng=zh_CN; _m_h5_tk=57fc1727c2970fe9e5ed3f26b9d05017_1577209549769; _m_h5_tk_enc=efcd08f15335979e056c8cb12186b117; l=cBQb0belqGel3GZoBOCZnurza77TIIRfguPzaNbMi_5Qvs81dybOojoonUJ6cjWhGkLB4fuWYvyT6FtgJsuYuJ3VvzVD5; isg=BFxc-iHDbm0X9xmAVwnx0p8uLXoO1QD_9UbZPjZdYscqgf0LXufnj99z5ancCThX"
        let cooke_arr = cookies_str.split(";")
         console.log(cooke_arr)
        for(let i = 0 ; i<cooke_arr.length;i++){
          this.$cookies.set(cooke_arr[i].split('=')[0].trim(),cooke_arr[i].split('=')[1].trim())
        }
        let url = "api444/trade/itemlist/asyncSold.htm?event_submit_do_query=1&_input_charset=utf8"
        // let url = "/api444"
        // let url = "api444//trade/itemlist/list_sold_items.htm?action=itemlist/SoldQueryAction&event_submit_do_query=1&auctionStatus=SEND&tabCode=haveSendGoods"
        let query_data = {
      'action':	'itemlist/SoldQueryAction',
      'auctionType':	0,
'buyerNick':'',
'close':	0,
'dateBegin':0,
'dateEnd':	0,
'logisticsService':'',
'orderStatus':'SEND',
'pageNum':	1,
'pageSize':	15,
'queryMore':	true,
'queryOrder':'desc',
'rateStatus':'',
'refund':'',
'rxAuditFlag':	0,
'rxElectronicAllFlag':	0,
'rxElectronicAuditFlag':	0,
'rxHasSendFlag':0,
'rxOldFlag':	0,
'rxSendFlag':	0,
'rxSuccessflag':	0,
'rxWaitSendflag':	0,
'sellerNick':'',
'tabCode':	'haveSendGoods',
'tradeTag':0,
'useCheckcode':	false,
'useOrderInfo':	false,
'errorCheckcode':false,
'prePageNo':	2}
        axios.post(
          // url,qs.stringify(query_data),
          url, qs.stringify(query_data),
          {headers: { 'content-type': 'application/x-www-form-urlencoded','Referer': 'https://trade.taobao.com/trade/itemlist/list_sold_items.htm?action=itemlist/SoldQueryAction&event_submit_do_query=1&auctionStatus=SEND&tabCode=haveSendGoods' }},
          // {headers: {'token': 'Bearer ','Content-Type': 'multipart/form-data','referer':'https://trade.taobao.com/trade/itemlist/list_sold_items.htm?action=itemlist/SoldQueryAction&event_submit_do_query=1&auctionStatus=SEND&tabCode=haveSendGoods','origin':'https://trade.taobao.com','user-agent':'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/49.0.2623.112 Safari/537.369'},}
        ).then((res)=>{
        console.log("结果 ：",res)

          }).catch(error => {
            alert("访问错误")
            alert(error)

          })
      },
      go_forgot_password_page(){
        this.$router.push("/pc/forgotPassword");
      },
      login(){
        const username = this.username.trim()
        const password = this.password.trim()
        if (!username || !password){
          alert("账号密码不能为空")
          return;
        }
        // const url =this.HOST + "/user/login/"
        this.submit_btn_disable = true
        let url = this.mGLOBAL.DJANGO_SERVER_BASE_URL+"/user/login/"

        console.log(url)
        axios.post(url,{
          'username':this.username,
           'password':this.password,
       }).then((res)=>{
          this.submit_btn_disable = false;
         if(res.data.code === "1000"){
            this.setLocalValue("user",JSON.stringify(res.data.user))
            this.$router.push("/pc/home/porder");
            this.$cookies.set("access_token" ,res.data.token)
            console.log(this.$cookies.get("access_token" ))

            this.$router.push("/pc/home/porder");
         }else{
           alert("登录失败："+res.data.message)
         }

          }).catch(error => {
            alert("访问错误")
            this.submit_btn_disable = false;
          })
      },
      register(){
        this.$router.push({
            name:'pRegister'
          })
      }
    },

  }
</script>

<style lang="less" scoped>
    @import "../../../static/css/PGLOBALCSS.css";
    @import "../../../static/css/PGLOBALLESS.less";



.login{
  margin:0 auto;
  padding-top: 5em;
  width: auto;
  height: auto;
  text-align: center;

}
.login td{
  margin-top: 0.5em;
  width: 5em;
  height: 2.5em;
}
.login li{

  text-align: center;
  list-style: none;
  background: lavenderblush;
  padding: 0.1em;
  width: auto;
  height:auto;
}
  .login  input{
    margin:0 auto;
    width: 16em;
    height: 2.5em;
  }
  .login button{
    width:4.5em;
    height: 2.5em;
    margin: 0.5em;
  }
</style>
