<template>
  <div class="container">
    <div  style="margin-top:0.5em" >
        <input v-model="query_q" placeholder="订单ID，订单号，收货人名，手机号，快递单号" style="width: 30em; height: 2em ; "  /><button @click='on_orders_query({"q":query_q.trim()})' style="margin-left: 0.5em">查询</button><button style="margin-left: 0.5em" @click='on_orders_query(null,null,"search_all_order_btn")' >查询全部{{all_order_counts}}</button>
        <!--<label style="margin-left: 0.5em">时间选择</label><input style="width: 12em" placeholder="点击选择时间" @click="calendar_show = !calendar_show" v-model="during_str">-->
      </div>
    <ul class = "items_ul">
        <li class="item_order" v-for="(item,index) in order_list" :key="index">
          <div  class="order_div" >
              <label  class="order_label" >订单号：{{item.order_number}}</label>
              <label> {{item.consignee_name}} {{item.consignee_phone}} {{item.consignee_address}}</label>
          </div>
              <div class="item_goods"  v-for="(goods,index2) in item.orderGoods">
                 <label>商品：{{index+1}}
                    {{goods.shop_market_name}}_{{goods.shop_floor}}_{{goods.shop_stalls_no}}_{{goods.art_no}}_{{goods.goods_color}}_{{goods.goods_size}}_{{goods.goods_price}}元_{{goods.goods_count}}件
                 </label>
                 <div style="float:right;margin-right: 4em">
                         <label>{{goods.refund_apply.value}}</label>
                         <label>{{goods.goods_price}} x {{goods.goods_count}} =  {{goods.goods_price * goods.goods_count}}元 </label>


                          <button  v-if="goods.refund_apply.length>0" @click="check_pass(goods.refund_apply[0].id)"  >通过</button>
                         <!--<select @change="selectVal($event,goods)" >-->
                           <!--<option :value="option.value" v-for="(option,index) in options" :key="index">{{option.text}}</option>-->
                         <!--</select>-->
                </div>
                  <div><label >   商品状态：{{goods_status[goods.status]}}  </label> </div>
                  <div style="display: block"><label style="float: left">售后类型：</label><label :class="{red_color:refund_apply_status[goods.refund_apply_status]!=='无售后'}">   {{refund_apply_status[goods.refund_apply_status]}}  </label> </div>
                  <div style="display: block">
                    <label style="float: left" >售后进度:</label>
                    <label v-if="goods.refund_apply.length > 0 " style="color: red"  > {{ refund_apply_progress[goods.refund_apply[0].refund_apply_progress]}}</label>
                  </div>
                   <div v-if="goods.refund_apply.length>0 && goods.refund_apply[0].refund_apply_type === refund_apply_type['退货退款'] || goods.refund_apply.length>0 && goods.refund_apply[0].refund_apply_type === refund_apply_type['换货']">
                        <label style="float: left">售后物流： {{goods.refund_apply[0].return_logistics_name}}</label>

                        <label >单号：{{goods.refund_apply[0].return_logistics_number}}</label>
                        <label >申请留言：{{goods.refund_apply[0].apply_message}}</label>
                   </div>

                <div>
                 <label style="color: red" >   下单备注：{{goods.customer_message}}</label>
                 <label style="color: red">   客服留言：{{goods.customer_service_message}}</label>
                    <input style="" v-model="goods.new_message"/>
                <button  @click="alter_order_goods_info(goods.id,{'customer_service_message' : goods.customer_service_message + goods.new_message})" >确定修改</button>
                </div>
              </div>
              <div>
                <label style="padding-left: 0.5em">订单总价：{{item.logistics_fee}} + {{item.agency_fee}}+ {{item.orderGoodsTotalMoney}} =
                              {{item.logistics_fee + item.agency_fee + item.orderGoodsTotalMoney}}
                </label>
              </div>
              <div>
                <label style="padding-left: 0.5em">下单时间:{{item.add_time}}</label>
              <label>快递：{{item.logistics_name}}</label>
              <label>单号：{{item.logistics_number}}</label>
              </div>
        </li>
    </ul>
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
  import mtime from '../../../utils/mtime.js';
  import mGlobal from '../../../utils/mGlobal';
    import  axios  from 'axios'
     //设为true 就会带cookies 访问
    axios.defaults.withCredentials=true;
    export default {
        name: "MyOrder",
      data(){
          return{
            customer_service_message:"",
            all_order_counts:"",
            query_q:"",
            next_page_url :"",
            selected_op :"",
            options: [
            { text: '请选择', value: '' },
            { text: '退货退款', value: '1' },
            { text: '仅退款', value: '2' }
          ],
            refund_apply_progress:mGlobal.REFUND_APPLY_PROGRESS,
            logistics_name:{

            },
              refund_apply_type:mGlobal.REFUND_APPLY_TYPE,
              refund_apply_status :mGlobal.REFUND_APPLY_STATUS,
              goods_status: mGlobal.GOODS_STATUS,

            prePageShow:true,
            nextPageShow:true,
            order_list:[],
            prePageUrl:"",
            nextPageUrl:"",
          }
      },

      methods:{
          on_orders_query(query_data,search_btn){
             const url = this.mGLOBAL.DJANGO_SERVER_BASE_URL+"/back/goodsRefund/";
             this.loadOrderPage(url,query_data,search_btn);
          },

           //修改商品信息
        alter_order_goods_info(id ,data){
          const url = this.mGLOBAL.DJANGO_SERVER_BASE_URL+"/back/orderGoods/"+id+"/";
          axios.defaults.withCredentials=true;
           axios.put(url,data)
             .then(res=>{
               if(res.data.code === "1000"){
               alert("修改成功")
                 this.refresh_cur_page();
               }else{
                 alert("修改失败"+res.data.message)
               }

              console.log(res.data);
           }).catch(error =>{
              alert("修改失败"+error)
          })
        },
            check_pass(refund_apply_id){
            const url = this.mGLOBAL.DJANGO_SERVER_BASE_URL+"/back/goodsRefund/"+refund_apply_id+"/";
             //设为true 就会带cookies 访问
            axios.defaults.withCredentials=true;
            axios.delete(url,{}).then((res)=>{
             if(res.data.code === "1000"){
               alert("提交成功")
                this.refresh_cur_page();
             }else{
                alert("提交失败")
             }
        }).catch(error => {
            console.log(error)
             alert("提交失败")
        })
       },
        refresh_cur_page(){
              let cur_page_url = "";
              let cur_page_num ;
              console.log("-------------------------------")
              console.log(this.nextPageUrl)
              console.log("********************************")
              console.log(this.prePageUrl)
            if(this.nextPageUrl !== null && this.nextPageUrl !==""){
              let next_page_num_arr= this.nextPageUrl.match(/page=\d/);
              let next_page_num = next_page_num_arr[0].split("=")[1]
              let base_url = this.nextPageUrl.substring(0,next_page_num_arr.index);
              let cur_page_num = parseInt(next_page_num)-1;
              cur_page_url = base_url+"page="+cur_page_num;

            }else if(this.prePageUrl !== null && this.prePageUrl !==""){
               let pre_page_num_arr= this.prePageUrl.match(/page=\d/);
               let pre_page_num = pre_page_num_arr[0].split("=")[1];
               let base_url = this.prePageUrl.substring(0,pre_page_num_arr.index);
               let  cur_page_num = parseInt(pre_page_num)-1;
               cur_page_url = base_url+"page="+cur_page_num;
            }else{
                cur_page_url = this.mGLOBAL.DJANGO_SERVER_BASE_URL+"/back/goodsRefund/";
            }
             this.loadOrderPage(cur_page_url);
        },


          replaceData() {
            for(let i = 0;i<this.order_list.length;i++){
                 let item =  this.order_list[i];
                 let  mdate = mtime.formatDateStrFromTimeSt(item.add_time);
              console.log(mdate)
              item.add_time =mdate;
              let orderGoodsTotalMoney = 0;
                for(let g = 0; g < item.orderGoods.length;g++){
                    orderGoodsTotalMoney = orderGoodsTotalMoney + item.orderGoods[g].goods_price * item.orderGoods[g].goods_count
                    item.orderGoods[g]['new_message'] = ""
                }
                item['orderGoodsTotalMoney'] = orderGoodsTotalMoney
            }
          },

          prePage(){
            console.log(this.prePageUrl)
            this.loadOrderPage(this.prePageUrl)
          },

          nextPage(){
             console.log(this.nextPageUrl)
            this.loadOrderPage(this.nextPageUrl)
          },

        loadOrderPage(url,query_data,search_btn){
           axios.defaults.withCredentials=true;
           axios.get(url,{
               params:query_data,
          }
        ).then((res)=>{
          console.log(res.data)
          this.order_list = res.data.results;
          this.replaceData()

             console.log(this.order_list)
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
          const url = this.mGLOBAL.DJANGO_SERVER_BASE_URL+"/back/goodsRefund/";
          this.loadOrderPage(url);
      },

    }
</script>

<style scoped>
  .red_color{
    color: red;
  }
  .item_order{
    margin-top: 3em;
    background: #f0f0f0;
    padding-bottom: 0.5em;
    border-top:1px solid gray;
  }
.items_ul li{
  list-style: none;

}
  .container{
    width: 900px;
    height: 1000px;
    margin: 0 auto;
    text-align: left;

  }
  .page_table{
    margin: 0 auto;
    float: bottom;
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
  .refund_apply_btn{
    cursor:pointer;
    width: 4em;
    height: 2em;
    margin: 5px auto;
    color: #fff;
   padding: 0.2em;
    font-size: 1.0em;
  background: #3bb4f2;
  border-color: #3bb4f2;
  }

</style>
