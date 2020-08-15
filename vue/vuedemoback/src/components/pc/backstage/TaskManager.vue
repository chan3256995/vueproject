<template style="width: 100%; ">
      <div class="root">

      <table  >

          <tr>
            <td><input placeholder="任务名" v-model="add_task_name" ></td>
            <td><input placeholder="描述"  v-model="add_task_describe"></td>
            <td><input placeholder="时间间隔 (秒"  v-model="add_task_interval_time"></td>


            <td><button @click="add_task({'task_name':add_task_name,'describe':add_task_describe,'time_interval':add_task_interval_time})">添加任务</button></td>
            <td><button @click="load_all()">查询全部</button></td>
            <td><button @click="start_thread()">启动执行任务</button></td>
          </tr>
      </table>

      <table class = "list_table">
          <tr  >
            <td>id</td>
            <td>任务名</td>
            <td>描述</td>
            <td>时间间隔 (秒)</td>
            <td>最后运行时间</td>
            <td>是否继续运行</td>
            <td>添加时间</td>


          </tr>
          <tr v-for="(item,index) in task_list" :key="index">
            <td><input v-model="item.id"/></td>
             <td><input v-model="item.task_name"/></td>
            <td> <input v-model="item.describe"/></td>
             <td><input v-model="item.time_interval"/></td>
             <td><input v-model="item.last_run_time"/></td>

            <td> <input v-model="item.is_run"/></td>
            <td> <input v-model="item.add_time"/></td>




            <td ><button  style="width: 5em"   @click = "update_item(item.id,{'task_name':item.task_name,'describe':item.describe,'time_interval':item.time_interval,'is_run':item.is_run})">修改</button></td>
            <td><button  style="width: 5em"  @click = delete_item(item.id)>删除</button></td>


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
  import axios from 'axios'
  import mGlobal from '../../../utils/mGlobal';
  import mtime from '../../../utils/mtime'
    export default {
        name: "TaskManager",
        data(){
          return{
            task_list:[],
            add_task_name:"",
            add_task_describe:"",
            //时间间隔 单位 秒
            add_task_interval_time:"",
            prePageShow:true,
            nextPageShow:true,
            mtime:mtime,
          }
        },
      mounted() {

  },
      created(){
           const url = mGlobal.DJANGO_SERVER_BASE_URL+"/back/taskThread/"
           this.load_task_thread_info_page(url)
      },
        methods:{
          load_all(){
              const url = mGlobal.DJANGO_SERVER_BASE_URL+"/back/taskThread/"
              this.load_task_thread_info_page(url)
          },
          start_thread(){
              const url = mGlobal.DJANGO_SERVER_BASE_URL+"/back/autoScanYiNaHuoOrder/"

               axios.defaults.withCredentials=true;
               axios.post(url,{

          }
        ).then((res)=>{


        }).catch(error => {

          console.log(error) ;
        })
          },
 replace_data(list){
          for(let i = 0;i<list.length;i++){
             list[i].last_run_time = mtime.formatDateStrFromTimeSt(list[i].last_run_time)
            console.log( "last_time",list[i].last_run_time)
          }
          return list
          },

        all_data(){
           const url = mGlobal.DJANGO_SERVER_BASE_URL+"/back/taskThread/"
           this.load_return_package_info_page(url)
        },
        add_task_thread(package_obj){
//

         let package_list = []
          package_list.push(package_obj)
         const url = mGlobal.DJANGO_SERVER_BASE_URL+"/back/addReturnPackages/"
          axios.post(url,{
            "return_package_list":package_list
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

                    //修改商品信息
        update_item(id ,data){
          const url = this.mGLOBAL.DJANGO_SERVER_BASE_URL+"/back/taskThread/"+id+"/";
          axios.defaults.withCredentials=true;
           axios.put(url,data)
             .then(res=>{
               if(res.data.code === "1000"){
               alert("修改成功")
               }else{
                 alert("修改失败"+res.data.message)
               }

              console.log(res.data);
           }).catch(error =>{
              alert("修改失败"+error)
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
          const url = mGlobal.DJANGO_SERVER_BASE_URL+"/back/taskThread/"+id+"/"
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
          add_task(task){
const url = mGlobal.DJANGO_SERVER_BASE_URL+"/back/taskThread/"
           axios.defaults.withCredentials=true;
           axios.post(url, task
        ).then((res)=>{
          console.log(res.data)
          if(res.data.code === "1000"){
             this.$toast("添加成功！")
          }else{
             this.$toast("修改失败！"+res.data.message)
          }


        }).catch(error => {

          console.log(error) ;
        })
          },
        load_task_thread_by_name(name){
          const url = mGlobal.DJANGO_SERVER_BASE_URL+"/back/taskThread/"
          let params = {
            'task_name': name
          }
          this.load_task_thread_info_page(url,params)
        },

          prePage(){
            console.log(this.prePageUrl)
              this.load_return_package_info_page(this.prePageUrl)
          },

          nextPage(){
             console.log(this.nextPageUrl)
              this.load_return_package_info_page(this.nextPageUrl)
          },

          load_task_thread_info_page(url, query_data){

           axios.defaults.withCredentials=true;
           axios.get(url,{
              params:query_data,
          }
        ).then((res)=>{
          console.log(res.data)
           this.task_list =  this.replace_data( res.data.results)



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
       border: none;
  }
  .page_table{
    margin: 0 auto;
    float: bottom;
  }
</style>
