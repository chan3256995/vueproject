<template style="width: 100%; ">
  <div>
  <div style="width:50em; text-align: center">
    <label>生成标签打印状态订单</label>
     <button id="excel_btn" @click="out_put_order_for_excel({'for':'print_tag'})" v-text="produce_excel_btn" :disabled="submit_btn_disable">生成excel</button>

    <a :href="down_excel_url" v-show="down_excel_url!==''">下载</a>
  </div>
  <div style="width:50em; text-align: center">
    <label>生成标签打印状态订单（315格式）</label>

     <button id="" @click="out_put_order_for_excel({'for':'315'})"  :disabled="submit_btn_disable">生成315格式excel</button>
    <a :href="down_315excel_url" v-show="down_315excel_url!==''">下载</a>
  </div>
    </div>
</template>

<script>
  import axios from 'axios'
    export default {
        name: "OutPutOrderForExcel",
        data(){
          return{
             down_excel_url:"",
            down_315excel_url:"",
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
               if (params.for === "315"){
                 this.down_315excel_url = res.data.excel_url
               }else{
                 this.down_excel_url = res.data.excel_url
               }

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
