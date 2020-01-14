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
        <input v-model="search_market_name" style="width: 5em; height: 2em ; " placeholder="市场名"/>
        <input v-model="search_shop_floor" style="width: 5em; height: 2em ; " placeholder="楼层"/>
        <input v-model="search_stall_no" style="width: 5em; height: 2em ; " placeholder="档口号"/>
        <input v-model="search_art_no" style="width: 5em; height: 2em ; " placeholder="款号"/>
        <select  v-model="goods_status_selected">
          <option :value="goods_status_option" v-for="(goods_status_option,index) in goods_status_options" :key="index">{{goods_status_option.text}}</option>
      </select>

        <button @click='mul_condition_query()' style="margin-left: 0.5em">条件查询{{search_mul_or_order_counts}}</button>

      </div>
      <div style="margin-top:0.5em" >
        <input v-model="query_q" placeholder="订单ID，订单号，收货人名，手机号，快递单号" style="width: 30em; height: 2em ; "  /><button @click='on_orders_query({"q":query_q.trim()})' style="margin-left: 0.5em">查询</button><button style="margin-left: 0.5em" @click='on_orders_query(null,null,"search_all_order_btn")' >查询全部{{all_order_counts}}</button>
        <label style="margin-left: 0.5em">时间选择</label><input style="width: 12em" placeholder="点击选择时间" @click="calendar_show = !calendar_show" v-model="during_str">
      </div>
        <li class="item_order" v-for="(item,index) in order_list" :key="index">
          <div  class="order_div" >
            <label style="margin-right: 0.2em; color:black; font-size: 1.2em">{{item.id}}</label>
            <a style="cursor:pointer; text-decoration:underline; " @click="show_user(item.order_owner)">下单人:{{item.order_owner.user_name}}</a>
              <label  class="order_label" >订单号：{{item.order_number}}</label>
             <label   style="color:black">跟单人：</label>
             <label v-if="item.order_follower !==null" style="color:black">{{item.order_follower.user_name}}</label>
            <label>包裹状态：{{order_status[item.order_status]}}</label>
              <label> {{item.consignee_name}} {{item.consignee_phone}} {{item.consignee_address}}</label>
          </div>
          <div style="display: inline-block;width: 100%" ><button @click="item_detail_show(index,item)" style="float: right">显示/隐藏</button></div>
          <div :class="{'refunded_style': goods.status === goods_status2['已退款'],'refunded_style input':goods.status === goods_status2['已退款'],'refunded_style button':goods.status === goods_status2['已退款'],'refunded_style select':goods.status === goods_status2['已退款']}"  class="item_goods"  v-for="(goods,index2) in item.orderGoods" v-if="item.show">
          <div   class="order_goods_div" >
          <table class="" >
            <tr>
                 <td>市场</td>
                 <td>楼层</td>
                 <td>档口</td>
                 <td>款号</td>
                  <td>颜色尺码</td>
                 <td>价格</td>
                 <td>件数</td>
            </tr>
            <tr >
                 <td><input      v-model="goods.shop_market_name" /></td>
                 <td><input     v-model="goods.shop_floor" /></td>
                 <td><input      v-model="goods.shop_stalls_no"/></td>
                 <td><input     v-model="goods.art_no"/></td>
                 <td><input     v-model="goods.goods_color"/></td>
                 <td><input     v-model="goods.goods_price" type="number" /></td>
                 <td><input    v-model="goods.goods_count" type="number" /> </td>
                 <td><button  @click="alter_order_goods_info(goods.id,{'shop_market_name':goods.shop_market_name,
                                                                             'shop_floor':goods.shop_floor,
                                                                             'shop_stalls_no':goods.shop_stalls_no,
                                                                             'art_no':goods.art_no,
                                                                             'goods_color':goods.goods_color,
                                                                             'goods_price':goods.goods_price,
                                                                             'goods_count':goods.goods_count})">确定修改</button></td>

            </tr>
            </table>
            </div>
           <div style="float:right;margin-right: 4em">
                         <label>{{goods.refund_apply.value}}</label>
                         <label>{{goods.goods_price}} x {{goods.goods_count}} =  {{goods.goods_price * goods.goods_count}}元 </label>
           </div>
           <div>   商品状态：
                       <select class="" v-model="goods.status">
                            <option :value="option.value" v-for="(option,index) in goods_status_options" :key="index">{{option.text}}</option>
                       </select>
                        <button @click="alter_order_goods_info(goods.id,{'status':goods.status})">确定修改</button>
                  </div>
           <div>
                    售后状态：
                   <select class="" v-model="goods.refund_apply_status">
                            <option :value="option.value" v-for="(option,index) in refund_apply_status_options" :key="index">{{option.text}}</option>
                       </select>
                        <button @click="alter_order_goods_info(goods.id,{'refund_apply_status':goods.refund_apply_status})">确定修改</button>
                </div>
           <label :class="{'color_red':goods.status !==goods_status2['已退款']}" >   下单备注：{{goods.customer_message}}</label>
                 <label :class="{'color_red':goods.status !==goods_status2['已退款']}">   客服留言：{{goods.customer_service_message}}</label>
                 <input   v-model="goods.customer_service_message"/>
                 <button  @click="alter_order_goods_info(goods.id,{'customer_service_message':goods.customer_service_message})" >确定修改</button>
           </div>



              <div>
                <label>订单总价：{{item.orderGoodsTotalMoney}}+ {{item.logistics_fee}} + {{item.agency_fee}} + {{item.quality_testing_fee}}  =
                              {{item.logistics_fee + item.agency_fee + item.orderGoodsTotalMoney + item.quality_testing_fee}}
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
              {value:"order_follower_user_name",text:"跟单人用户名"},

            ],
            order_status:mGlobal.ORDER_STATUS,
            goods_status: mGlobal.GOODS_STATUS,
            goods_status2: mGlobal.GOODS_STATUS2,

            refund_apply_status:mGlobal.REFUND_APPLY_STATUS,
            refund_apply_status_options:mGlobal.REFUND_APPLY_TYPE_OPTIONS,
            goods_status_options :[].concat(mGlobal.GOODS_STATUS_OPTIONS),
            goods_status_selected :"",
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
            const url  = this.mGLOBAL.DJANGO_SERVER_BASE_URL+"/trade/logistics/"
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
              if(this.goods_status_selected.text !== '全部'){
                 query_data['status'] = this.goods_status_selected.value
              }

           this.on_orders_query(query_data,"search_mul_or_order_btn")

        },

        on_orders_query(query_data,btn_tag){
            const url = this.mGLOBAL.DJANGO_SERVER_BASE_URL+"/back/orders/"


            // let query_data = {}
            // if(query_by==="default"){
            //   query_data = {'q':query_keys.trim()}
            // }else if(query_by==="by_order_follower_user_name"){
            //    query_data = {'order_follower_user_name':query_keys.trim()}
            // }else if(query_by==="by_user_name"){
            //    query_data = {'user_name':query_keys.trim()}
            // }else if (query_by==="market_full"){
            //
            //   query_data={
            //       "market_full":{
            //       "shop_market_name":query_keys['shop_market_name'],
            //       "shop_floor":query_keys['shop_floor'],
            //       "shop_stalls_no":query_keys['shop_stalls_no'],
            //       "art_no":query_keys.art_no
            //     }
            //   }
            // }
            if(this.during_str!==""){
              Object.assign(query_data,{"during_time":this.during_str})
            }

            this.loadOrderPage(url,query_data,btn_tag)
          },
        on_orders_query_by_user_name(user_name){
            const url = this.mGLOBAL.DJANGO_SERVER_BASE_URL+"/back/orders/"
            let query_data = {"user_name":user_name.trim()}
            this.loadOrderPage(url,query_data)
          },
          //修改订单信息
        alter_order_info(id,data){
            console.log("订单id",id)
          const url = this.mGLOBAL.DJANGO_SERVER_BASE_URL+"/back/orders/"+id+"/";
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
          //修改商品信息
        alter_order_goods_info(id ,data){
          const url = this.mGLOBAL.DJANGO_SERVER_BASE_URL+"/back/orderGoods/"+id+"/";
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

        goto_place_order_page(data){

          this.$router.push({path:"/pc/home/porder",query:{data:data}})
        },

        replaceData() {
            for(let i = 0;i<this.order_list.length;i++){
              let item =  this.order_list[i];
               let  mdate = mtime.formatDateStrFromTimeSt(item.add_time);
              console.log(mdate)
              item.add_time =mdate;
              let orderGoodsTotalMoney = 0;
                for(let g = 0; g < item.orderGoods.length;g++){
                  if(item.orderGoods[g].status !== mGlobal.GOODS_STATUS2['已退款']){

                     orderGoodsTotalMoney = orderGoodsTotalMoney + item.orderGoods[g].goods_price * item.orderGoods[g].goods_count
                  }

                }
                item['orderGoodsTotalMoney'] = orderGoodsTotalMoney;
                item['show'] = true;
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
           this.goods_status_options.unshift({text:"全部",value:"全部"},)
          this.goods_status_selected = this.goods_status_options[0].value
        }
      },

      created(){

          const url = this.mGLOBAL.DJANGO_SERVER_BASE_URL+"/back/orders/";
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
