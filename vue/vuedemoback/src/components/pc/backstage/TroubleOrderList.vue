<template>
    <div class="root">

      <table  >

          <tr>
            <select  style="width: 7em"  v-model="add_plat_form_selected">
              <option :value="option" v-for="(option,index) in plat_form_options" :key="index">{{option.text}}</option>
            </select>



            <td><input placeholder="平台订单号" v-model="add_plat_form_order_number" ></td>
            <td><input placeholder="店铺名" v-model="add_shop_name" ></td>
            <td><input placeholder="物流单号"  v-model="add_logistics_number"></td>
            <td><input placeholder="问题描述"  v-model="add_remarks"></td>


            <td><button @click="add_trouber_order({ 'plat_form_order_number':add_plat_form_order_number,'logistics_number':add_logistics_number,'plat_form':add_plat_form_selected.value,'order_status':1,'shop_name':add_shop_name,'remarks':add_remarks})">添加问题单</button></td>
          </tr>
      </table>
      <div style="text-align: left">

        <input placeholder="物流单号,平台单号" v-model="query_key">
        <select  style="width: 7em"  v-model="order_status_query_selected">
              <option :value="option" v-for="(option,index) in order_status_query_options" :key="index">{{option.text}}</option>
            </select>
        <button @click="load_trouble_order_info(query_key.trim(),order_status_query_selected.value)">查询</button>
        <button @click="all_data">全部</button>
      </div>

      <table class = "list_table">
          <tr  >
            <td>物流单号</td>
            <td>问题描述</td>
             <td style="width: 5em;">店铺名</td>
            <td>平台订单号</td>
            <td>处理状态</td>
            <td>所属平台</td>

            <td>添加时间</td>


          </tr>
          <tr v-for="(item,index) in trouble_orders_list" :key="index">
            <td> <input v-model="item.logistics_number"/></td>
            <td> <input v-model="item.remarks"/></td>
            <td> <input v-model="item.shop_name"/></td>
            <td> <input v-model="item.plat_form_order_number"/></td>
            <td>
                 <select  style="width: 7em"  v-model="item.order_status">
                  <option :value="option.value" v-for="(option,index) in order_status_item_options" :key="index">{{option.text}}</option>

                </select>
            </td><td>
                 <select  style="width: 7em"  v-model="item.plat_form">
                  <option :value="option.value" v-for="(option,index) in plat_form_options" :key="index">{{option.text}}</option>

                </select>
            </td>


            <td>{{time_format(item.add_time)}}</td>



            <td>

              <button @click =' edit_trouble_order({"id":item.id,"plat_form_order_number":item.plat_form_order_number,"logistics_number":item.logistics_number,"plat_form":item.plat_form,"order_status":item.order_status,"shop_name":item.shop_name,"remarks":item.remarks})'>确定修改</button>
              <button @click = delete_trouble_order(item.id)>删除</button>
            </td>


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
      name: "TroubleOrderList",
      data(){
        return {
           pGlobal :mGlobal,
           prePageShow:true,
            nextPageShow:true,
            add_user_name:"",
            logistics_name:"",
            query_key:"",
            add_logistics_number:'',
            add_shop_name:'',
            add_plat_form_order_number:'',
            add_remarks:'',
            prePageUrl:"",
            nextPageUrl:"",
            trouble_orders_list:[],
            order_status_query_selected:{"text":"跟进中","value":1},//0 未处理 1跟进中 2已完结
            order_status_query_options:[
              {"text":"全部","value":"全部"},
              {"text":"未处理","value":0},
              {"text":"跟进中","value":1},
              {"text":"已完结","value":2},

            ],

              order_status_item_options:[

              {"text":"未处理","value":0},
              {"text":"跟进中","value":1},
              {"text":"已完结","value":2},

            ],
            add_plat_form_selected:{"text":"其他平台","value":0},

            plat_form_options:[
              {"text":"其他平台","value":0},
              {"text":"淘宝","value":1},
              {"text":"拼多多","value":2},
              {"text":"抖音","value":3},
              {"text":"京东","value":4},

            ]
        }
      },
      methods:{
        all_data(){
           const url = mGlobal.DJANGO_SERVER_BASE_URL+"/back/troubleOrderList/"
          this.query_key  = ""
          this.order_status_query_selected = {"text":"全部","value":"全部"}
           this.load_trouble_order_list_page(url)
        },
        add_trouber_order(package_obj){
//

         let package_list = []
          package_list.push(package_obj)
         const url = mGlobal.DJANGO_SERVER_BASE_URL+"/back/troubleOrderAdd/"
          axios.post(url,package_obj
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
          const url = mGlobal.DJANGO_SERVER_BASE_URL+"/back/troubleOrderDelete/"+id+"/"
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
        load_trouble_order_info(keys,order_status){
          const url = mGlobal.DJANGO_SERVER_BASE_URL+"/back/troubleOrderList/"


          let params = {
            'keys': keys,

          }
          if(order_status!=="全部"){
            params['order_status'] = order_status

          }

          this.load_trouble_order_list_page(url,params)
        },

         prePage(){
            console.log(this.prePageUrl)
              this.load_trouble_order_list_page(this.prePageUrl)
          },

          nextPage(){
             console.log(this.nextPageUrl)
              this.load_trouble_order_list_page(this.nextPageUrl)
          },
          delete_trouble_order(id){
          if(!confirm("确定删除订单吗？删除后不可恢复。")) {
                return ;
              }
          const url = mGlobal.DJANGO_SERVER_BASE_URL+"/back/troubleOrderDelete/"
           axios.post(url,{"id_list":[id]
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

        edit_trouble_order(post_obj){

          const url = mGlobal.DJANGO_SERVER_BASE_URL+"/back/troubleOrderEdit/"
           axios.post(url,{'trouble_order_data':post_obj}
        ).then((res)=>{
            if(res.data.code === '1000'){
               this.$toast("修改成功")
            }else {
              this.$toast("修改失败："+res.data.message)
            }
           }).catch(err=>{
            this.$toast("访问错误")
           })
       },
       load_trouble_order_list_page(url, query_data){

           axios.defaults.withCredentials=true;
           axios.get(url,{
              params:query_data,
          }
        ).then((res)=>{
          console.log(res.data)
          this.trouble_orders_list = res.data.results;


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
         const url = mGlobal.DJANGO_SERVER_BASE_URL+"/back/troubleOrderList/"
         this.load_trouble_order_list_page(url,{"order_status":1})

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
