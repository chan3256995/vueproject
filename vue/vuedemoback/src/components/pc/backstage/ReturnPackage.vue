<template>
    <div class="root">

      <table  >

          <tr>
            <td><input placeholder="物流名" v-model="add_logistics_name" ></td>
            <td><input placeholder="物流单号"  v-model="add_logistics_number"></td>


            <td><button @click="add_return_package({'return_logistics_name':add_logistics_name,'return_logistics_number':add_logistics_number})">添加退件</button></td>
          </tr>
      </table>
      <div style="text-align: left">

        <input placeholder="快递单号" v-model="logistics_name">
        <button @click="load_return_package_info(logistics_name)">查询</button>
        <button @click="all_data">全部</button>
      </div>

      <table class = "list_table">
          <tr  >
            <td>物流名</td>
            <td>物流单号</td>
            <td>入库时间</td>


          </tr>
          <tr v-for="(item,index) in return_package_info_list" :key="index">
            <td>{{item.return_logistics_name}}</td>
            <td>{{item.return_logistics_number}}</td>
            <td>{{time_format(item.add_time)}}</td>
            <td>{{item.id}}</td>


            <td><button @click = delete_return_package(item.id)>删除</button></td>


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
      name: "ReturnPackage",
      data(){
        return {
           pGlobal :mGlobal,
           prePageShow:true,
            nextPageShow:true,
            add_user_name:"",
            logistics_name:"",
            add_logistics_name:'',
            add_logistics_number:'',
            prePageUrl:"",
            nextPageUrl:"",
            return_package_info_list:[],
        }
      },
      methods:{
        all_data(){
           const url = mGlobal.DJANGO_SERVER_BASE_URL+"/back/returnPackageInfo/"
           this.load_return_package_info_page(url)
        },
        add_return_package(package_obj){
//

         let package_list = []
          package_list.push(package_obj)
         const url = mGlobal.DJANGO_SERVER_BASE_URL+"/back/addReturnPackages/"
          axios.post(url,{
            "return_package_list":JSON.stringify(package_list)
          }
        ).then((res)=>{
            if(res.data.code === '1000'){
               this.$toast("添加成功")

            }else {
              this.$toast("添加失败："+res.data.message)
            }
           }).catch(err=>{
            this.$toast("访问错误")
           })
        },
        time_format(time_stmp){
         return mtime.formatDateStrFromTimeSt(time_stmp)
        },

        // 删除
        delete_item(id){
             if(!confirm("确定删除订单吗？删除后不可恢复。")) {
                return ;
              }
          const url = mGlobal.DJANGO_SERVER_BASE_URL+"/back/returnPackageInfo/"+id+"/"
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
        load_return_package_info(logistics_number){
          const url = mGlobal.DJANGO_SERVER_BASE_URL+"/back/returnPackageInfo/"
          let params = {
            'logistics_number': logistics_number
          }
          this.load_return_package_info_page(url,params)
        },

         prePage(){
            console.log(this.prePageUrl)
              this.load_return_package_info_page(this.prePageUrl)
          },

          nextPage(){
             console.log(this.nextPageUrl)
              this.load_return_package_info_page(this.nextPageUrl)
          },
          delete_return_package(package_id){
          if(!confirm("确定删除订单吗？删除后不可恢复。")) {
                return ;
              }
          const url = mGlobal.DJANGO_SERVER_BASE_URL+"/back/returnPackageInfo/"+package_id+"/"
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
       load_return_package_info_page(url, query_data){

           axios.defaults.withCredentials=true;
           axios.get(url,{
              params:query_data,
          }
        ).then((res)=>{
          console.log(res.data)
          this.return_package_info_list = res.data.results;


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
         const url = mGlobal.DJANGO_SERVER_BASE_URL+"/back/returnPackageInfo/"
         this.load_return_package_info_page(url)

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
