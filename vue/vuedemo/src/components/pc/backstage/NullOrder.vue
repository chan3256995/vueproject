<template>
  <div class="container">
    <ul class = "items_ul">
      <div style="width: 50% ;text-align: center;margin: 0px auto;" id="calendar" v-if="calendar_show">
          <inlineCalendar    mode="during"  :disabledDate="disabledDate"  :defaultDate="defaultDate" @change="on_calendar_change"/>
          <button @click="calendar_show = false">确定</button>
          <button @click="during_str='' ;calendar_show = false">取消</button>
         <label style="color:red;display: block"> 可以指定某一天，也可以选择时间段</label>
      </div>
      <div >
        <select  style="width: 5em"  v-model="query_by_selected">
          <option :value="option" v-for="(option,index) in query_by_options" :key="index">{{option.text}}</option>
        </select>
        <input v-model="name_search" width="3em" :placeholder="query_by_selected.text">

        <select  v-model="null_order_status_selected">
          <option :value="null_order_status_option" v-for="(null_order_status_option,index) in null_order_status_options" :key="index">{{null_order_status_option.text}}</option>
      </select>

        <button @click='mul_condition_query()' style="margin-left: 0.5em">条件查询{{search_mul_or_order_counts}}</button>

      </div>
      <div style="margin-top:0.5em" id="query_div2" >
        <input v-model="query_q" placeholder="订单ID，订单号，收货人名，手机号，快递单号" style="width: 30em; height: 2em ; "  /><button @click='on_orders_query({"q":query_q.trim()})' style="margin-left: 0.5em">查询</button><button style="margin-left: 0.5em" @click='on_orders_query(null,null,"search_all_order_btn")' >查询全部{{all_order_counts}}</button>
        <label style="margin-left: 0.5em">时间选择</label><input style="width: 12em" placeholder="点击选择时间" @click="calendar_show = !calendar_show" v-model="during_str">
      </div>
        <li class="item_order" v-for="(item,index) in order_list" :key="index">
          <div  class="order_div" >
            <label style="margin-right: 0.2em; color:black; font-size: 1.2em">{{item.id}}</label>
            <a style="cursor:pointer; text-decoration:underline; " @click="show_user(item.order_owner)">下单人:{{item.order_owner.user_name}}</a>
              <label  class="order_label" >订单号：{{item.order_number}}</label>
              <label  class="order_label" style="color: red;" v-if="item.tb_order_number !==null && item.tb_order_number !==''" >淘宝订单号：{{item.tb_order_number}}</label>

              <label> {{item.consignee_name}} {{item.consignee_phone}} {{item.consignee_address}}</label>
          </div>





              <div>
                  <label  v-if="item.tag_type ===1" style="margin-left: 0.5em;color:red;font-size: 1.4em" @click="alter_order_info(item.id,{'tag_type':null},'确定清除标记？')">⚫</label>
                  <label >订单状态:</label>
                  <label style="color: red">{{null_order_status[item.order_status]}}</label>
                  <label style="margin-left: 0.5em">订单总价： {{item.logistics_fee}}

                </label>
              </div>
              <div>
                <label style="padding-left: 0.5em">下单时间:{{item.add_time}}</label>
                <label>物流名:{{item.logistics_name}}</label>
              <label>快递：</label>

                 <select style="width: 5em" v-model="item.logistics_name">
                            <option :value="option.logistics_name" v-for="(option,index) in logistics_options" :key="index">{{option.logistics_name}}</option>
                 </select>
              <label>单号：</label>
                <input v-model="item.logistics_number"/>
                <button @click="alter_order_info(item.id,{'logistics_number':item.logistics_number,'logistics_name':item.logistics_name})">确定修改</button>
              </div>
        </li>
    </ul>
    <table class="page_table">
      <tr>
        <td style=" cursor:pointer;"><a >首页</a></td>
        <td style=" cursor:pointer;" v-if="prePageShow"><a  @click="prePage" style="">上一页</a></td>
        <td  style=" cursor:pointer;" v-if="nextPageShow"><a @click="nextPage">下一页</a></td>
        <td> 共{{counts}}条，{{cur_page_number}}/{{ show_page_count(counts)}}页</td>

      </tr>
    </table>
</div>
</template>

<script>
  import mtime from '../../../utils/mtime.js';
  import pcommon_function   from '../../../utils/pcommon_function.js'
    import  axios  from 'axios'
     //设为true 就会带cookies 访问
    axios.defaults.withCredentials=true;
    import mGlobal from "../../../utils/mGlobal"
    import Vue from 'vue'
    export default {
        name: "MyOrder",
      data(){
          return{
            calendar_show:false,
            defaultDate:[],
            disabledDate:[],
            during_str:"",

            search_market_name:"",
            search_shop_floor:"",
            search_stall_no:"",
            search_art_no:"",
            name_search:'',
            query_by_selected :  {value:"none",text:"请选择"},
            query_by_options:[
              {value:"none",text:"请选择"},
              {value:"user_name",text:"下单用户名"},


            ],


            null_order_status:mGlobal.NULL_ORDER_STATUS,
            refund_apply_status:mGlobal.REFUND_APPLY_STATUS,
            refund_apply_status_options:mGlobal.REFUND_APPLY_TYPE_OPTIONS,
            null_order_status_options :[].concat(mGlobal.NULL_ORDER_STATUS_OPTIONS),
            null_order_status_selected :"",
            prePageShow:true,
            nextPageShow:true,
            // 全部条件
            all_order_counts :0,
            // 查询结果总数量
            search_mul_or_order_counts:0,
            counts:0,
            // 总页数
            page_counts : 0,
            order_list:[],
            cur_page_url:"",
            cur_page_number:0,
            prePageUrl:"",
            nextPageUrl:"",
            query_q:"",
            query_:"",
            logistics_options:[]
          }

      },

      methods:{
        on_calendar_change(date) {
            this.during_str = ""
            for(let i = 0;i<date.length;i++){
              let tem_date = date[i].format("YYYY-MM-DD")
              console.log();
              if(this.during_str !== ""){
                this.during_str = this.during_str+" / " +tem_date
              }else{
                this.during_str = tem_date
              }

            }

    },
        show_page_count(counts){
          if(counts === 0){
            return 0
          }else if(counts<10){
            return 1
          }else{
            return parseInt(counts/10) +1
          }

        },
          // 显示用户信息
        show_user(user){
           this.$msgBox.showMsgBox({
                  title: '用户信息',
                  content: JSON.stringify(user)+" ",
                  isShowInput: false,
                  isShowConfimrBtn:false
              }).then(async (val) => {


              }).catch(() => {
                  // ...
              });
        },
          // 加载物流选项信息
        load_logistics(){
            let return_value = ""
            const url  = this.mGLOBAL.DJANGO_SERVER_BASE_URL+"/trade/nullPackageLogistics/"
           //设为true 就会带cookies 访问
           axios.defaults.withCredentials=true
            axios.get(url,

           ).then((res)=>{
             if("1000" === res.data.code){
                 console.log(res.data)
                  this.logistics_options =pcommon_function.analysis_logistics(res.data.data)
               console.log(this.logistics_options)
               return_value =  "物流信息"
             }else{
              return "物流信息"
             }
              }).catch(error => {
                console.log(error) ;
                return "物流信息"
              })
          },

        item_detail_show: function(index, item){
            let  show = !item.show;
            this.$delete(item,'show')
            this.$set(item, 'show', show);
},

        mul_condition_query(){
          console.log("name:",this.name_search)

              let query_data = {   "market_full":{"shop_market_name":this.search_market_name, "shop_floor":this.search_shop_floor,"shop_stalls_no":this.search_stall_no,"art_no":this.search_art_no},
              }
              if (this.name_search.trim() !== ""){
                query_data[this.query_by_selected.value] = this.name_search.trim()
              }
              if(this.null_order_status_selected.text !== '全部'){
                 query_data['status'] = this.null_order_status_selected.value
              }

           this.on_orders_query(query_data,"search_mul_or_order_btn")

        },

        on_orders_query(query_data,btn_tag){
            const url = this.mGLOBAL.DJANGO_SERVER_BASE_URL+"/back/nullOrders/"

            // }
            if(this.during_str!==""){
              Object.assign(query_data,{"during_time":this.during_str})
            }

            this.loadOrderPage(url,query_data,btn_tag)
          },
        on_orders_query_by_user_name(user_name){
            const url = this.mGLOBAL.DJANGO_SERVER_BASE_URL+"/back/nullOrders/"
            let query_data = {"user_name":user_name.trim()}
            this.loadOrderPage(url,query_data)
          },
          //修改订单信息
        alter_order_info(id,data,alert_message){
            console.log("订单id",id)
          if(alert_message!==null && alert_message !== ""){
             if(!confirm(alert_message)) {
                return ;
              }
          }
          const url = this.mGLOBAL.DJANGO_SERVER_BASE_URL+"/back/nullOrders/"+id+"/";
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



        replaceData() {
            for(let i = 0;i<this.order_list.length;i++){
              let item =  this.order_list[i];
               let  mdate = mtime.formatDateStrFromTimeSt(item.add_time);
              console.log(mdate)
              item.add_time =mdate;


            }
          },

        prePage(){
            console.log(this.prePageUrl)
            this.loadOrderPage(this.prePageUrl)
          },

        nextPage(){
             console.log(this.nextPageUrl);
            this.loadOrderPage(this.nextPageUrl)
          },
         update_cur_page_url(){
              let cur_page_url = "";
               let cur_page_num  = ""


              console.log("this.nextPageUrl",this.nextPageUrl)
            if(this.nextPageUrl !== null && this.nextPageUrl !==""){
              let next_page_num_arr= this.nextPageUrl.match(/page=\d+/);
              let next_page_num = next_page_num_arr[0].split("=")[1]
              let base_url = this.nextPageUrl.substring(0,next_page_num_arr.index);
              cur_page_num = parseInt(next_page_num)-1;
              cur_page_url = base_url+"page="+cur_page_num;

            }else if(this.prePageUrl !== null && this.prePageUrl !==""){
               let pre_page_num_arr= this.prePageUrl.match(/page=\d+/);
               let pre_page_num = pre_page_num_arr[0].split("=")[1];
               let base_url = this.prePageUrl.substring(0,pre_page_num_arr.index);
               let  cur_page_num = parseInt(pre_page_num)-1;
               cur_page_url = base_url+"page="+cur_page_num;
            }

            if(this.counts === 0){
              cur_page_num = 0
            }

            return {cur_page_url,cur_page_num}


        },
        loadOrderPage(url,query_data,btn_tag){
           axios.defaults.withCredentials=true;
           axios.get(url,{
                    params:query_data,
             }
           ).then((res)=>{

          this.order_list = res.data.results;

          this.replaceData()
             // console.log(JSON.stringify(this.order_list))
             this.counts = res.data.count
             if(btn_tag ==="search_all_order_btn"){
               this.all_order_counts =  res.data.count
             }else if(btn_tag ==="search_mul_or_order_btn"){
               // 多条件组合或查询
               this.search_mul_or_order_counts =  res.data.count
             }
          if(res.data.previous == null){
            this.prePageShow = false;
          }else{
              this.prePageShow = true;
              this.prePageUrl = res.data.previous;
          }

          if(res.data.next == null){
            this.nextPageShow = false;
          }else{
            this.nextPageShow = true;
            this.nextPageUrl = res.data.next;
          }
          let cur_page_obj = this.update_cur_page_url()
          this.cur_page_url = cur_page_obj.cur_page_url
          this.cur_page_number = cur_page_obj.cur_page_num
        }).catch(error => {


          console.log(error) ;
        })
        },
        init_data(){
           this.query_by_selected = this.query_by_options[0]
           this.null_order_status_options.unshift({text:"全部",value:"全部"},)
          this.null_order_status_selected = this.null_order_status_options[0].value
        }
      },

      created(){

          const url = this.mGLOBAL.DJANGO_SERVER_BASE_URL+"/back/nullOrders/";
          this.loadOrderPage(url,null,"search_all_order_btn");
          this.load_logistics();
          this.init_data()

      },

    }
</script>

<style lang="less" scoped>
  .item_order{
    background: #f0f0f0;
    margin-top: 3em;
    border-top:1px solid gray;
  }
.items_ul li{
  list-style: none;

}


.order_goods_div input{
  width: 5em;
}
.color_red{
  color: red;
}
  /*// 已退款样式*/
  .refunded_style{
    color: #878d99;

  }
 .refunded_style input{
      color: #878d99;
    }
  .refunded_style button{
      color: #878d99;
    }
    .refunded_style select{
      color: #878d99;
    }
  .container{
    width: 960px;
    height: 1000px;
    margin: 0 auto;
    text-align: left;

  }
  .page_table{
    margin: 0 auto;
    float: bottom;
    height: 3em;
    font-size: 1.5em;
  }
  .page_table tr td{

    padding-left: 1em;
  }

  .order_div {
    width: 100%;
    background: darkgray;
    padding-top: 0.5em;
    padding-bottom: 0.5em;
  }
  .item_goods label{
    display: block; padding-bottom: 0.4em
  }


  .item_goods{
    margin-bottom: 0.5em;
    padding-left: 1.5em
  ;
  }
  .order_div label{
  text-align: left;
    padding-left: 0.5em;
  display: inline-block;

}


</style>
