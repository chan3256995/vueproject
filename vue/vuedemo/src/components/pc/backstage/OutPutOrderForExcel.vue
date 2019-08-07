<template style="width: 100%; ">
  <div style="width:50em; text-align: center">
    <label>只生成当天00:00 到当前时间的订单</label>
     <button id="excel_btn" @click="out_put_order_for_excel" v-text="produce_excel_btn" :disabled="submit_btn_disable">生成excel</button>
     <button id="" @click="out_put_order_for_excel({'for_315':true})"  :disabled="submit_btn_disable">生成315格式excel</button>
    <a :href="down_excel_url" v-show="down_excel_url!==''">下载</a>
  </div>

</template>

<script>
  import axios from 'axios'
    export default {
        name: "OutPutOrderForExcel",
        data(){
          return{
             down_excel_url:"",
            produce_excel_btn:"生成excel",
            submit_btn_disable :false
          }

        },
        methods:{
            out_put_order_for_excel(params){
            const url = this.mGLOBAL.DJANGO_SERVER_BASE_URL+"/back/outputExcel/";
             //设为true 就会带cookies 访问
            axios.defaults.withCredentials=true;
            this.submit_btn_disable = true;
            axios.post(url,params).then((res)=>{
             if(res.data.code === "1000"){
               this.submit_btn_disable = false;
               alert("生成成功")
               this.down_excel_url = res.data.excel_url
                console.log(res.data.excel_url)
             }else{
               this.submit_btn_disable = false;
                alert("生成失败")
             }
        }).catch(error => {
             console.log(error)
             alert("生成失败")
        })
       },
        }
    }
</script>

<style scoped>

</style>
