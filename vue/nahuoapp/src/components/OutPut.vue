<template>
  <div>
      <div style="width: 90% ; margin-bottom: 2em; padding-bottom: 5px; border: 1px black solid">
      <label style="color: red;">只导出登录账号跟进的状态 (标签打印 已付款) 的商品  </label>
      <button @click="out_put_order_for_excel({'for':'for_tag'})" :disabled="submit_btn_disable">导出标签打印订单</button>
        <a style="margin-left: 1em" v-if="down_tag_excel_url!==''" :href="down_tag_excel_url">下载</a>
        <div>
         历史生成excel <a style="margin-left: 1em" v-if="last_time_excel_url!==''" :href="last_time_excel_url">下载</a>
        </div>
      </div>

      <div style="width: 90% ; padding-bottom: 5px; border: 1px black solid">
        <label style="color: red; margin-bottom: 5px">只导出登录账号跟进的 状态 (已拿货 快递打印) 的订单  </label>
        <button @click="out_put_order_for_excel({'for':'for_logistics'})" :disabled="submit_btn_disable">导出快递打印地址</button>
        <a style="margin-left: 1em" v-if="down_logistics_excel_url!==''" :href="down_logistics_excel_url">下载</a>
      </div>
   </div>
</template>

<script>
  import pGlobal from '../utils/pGlobal'

  import  axios  from 'axios'
    export default {
        name: "OutPut",
      data(){
          return {
            down_tag_excel_url:"",
            down_logistics_excel_url:"",
            last_time_excel_url:"",
            submit_btn_disable :false,
          }
      },
      methods:{
           out_put_order_for_excel(params){
            const url = pGlobal.DJANGO_SERVER_BASE_URL+"/nahuo/outputExcel/";
             //设为true 就会带cookies 访问
            this.submit_btn_disable = true;
            axios.post(url,params).then((res)=>{
             if(res.data.code === "1000"){
               this.submit_btn_disable = false;
               alert("生成成功")
               if (params.for === "for_tag"){
                 this.down_tag_excel_url = res.data.excel_url
               }else{
                 this.down_logistics_excel_url = res.data.excel_url
               }

                console.log(res.data.excel_url)
             }else{
               this.submit_btn_disable = false;
                alert("生成失败"+res.data.message)
                this.last_time_excel_url =  res.data.last_time_excel_url
             }
        }).catch(error => {
             console.log(error)
              this.submit_btn_disable = false;
             alert("生成失败")
        })
       },
      }
    }
</script>

<style scoped>

</style>
