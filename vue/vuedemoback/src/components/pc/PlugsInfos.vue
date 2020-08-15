<template>
    <div>

       <a :href="down_tag_excel_url">点击下载插件</a>
    </div>
</template>

<script>
      import  axios  from 'axios'
       import mGlobal from '../../utils/mGlobal';
     //设为true 就会带cookies 访问
    axios.defaults.withCredentials=true;
    export default {
      name: "PlugsInfos",
      data(){
        return{
          down_tag_excel_url:mGlobal.DJANGO_SERVER_BASE_URL+"/statics/plugs.txt",

        }

      },
      methods:{

      },
      created(){

      }

    }
</script>

<style scoped>

</style>
