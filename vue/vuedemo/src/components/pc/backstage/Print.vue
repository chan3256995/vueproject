<template>
  <div class="container">
    <div style="padding-left: 5em">
        <input v-model="query_q" style="width: 30em; height: 2em ; " placeholder="订单号 ，收货人名，手机号，快递单号"/><button @click='on_orders_query(query_q)' style="margin-left: 0.5em">查询</button>
    </div>
    <div>
        <ul class = "status_ul" >
          <li ><a @click="on_order_filter({'status':goods_status2['未付款']},'未付款')" :class="{status_select:cur_order_status_filter === '未付款'}">未付款</a></li>
          <li ><a @click="on_order_filter({'status':goods_status2['已付款']},'已付款')" :class="{status_select:cur_order_status_filter === '已付款'}">已付款</a></li>
          <li ><a @click="on_order_filter({'status':goods_status2['标签打印']},'标签打印')" :class="{status_select:cur_order_status_filter === '标签打印'}">已打印标签</a></li>
          <li ><a @click="on_order_filter({'status':goods_status2['拿货中']},'拿货中')" :class="{status_select:cur_order_status_filter ==='拿货中'}">拿货中</a></li>
          <li ><a @click="on_order_filter({'status':goods_status2['已拿货']},'已拿货')" :class="{status_select:cur_order_status_filter ==='已拿货'}">已拿货</a></li>
          <li ><a  @click="on_order_filter({'status':goods_status2['快递打印']},'快递打印')" :class="{status_select:cur_order_status_filter ==='快递打印'}">已打印快递</a></li>
          <li ><a @click="on_order_filter({'status':goods_status2['已发货']},'已发货')" :class="{status_select:cur_order_status_filter ==='已发货'}">已发货</a></li>

          <li ><a @click="on_order_filter(-1,'全部订单')" :class="{status_select:cur_order_status_filter ==='全部订单'}">全部订单</a></li>

        </ul>
     </div>
    <div style="padding-left: 3em;"> <button style="margin-right: 0.5em" @click="select_all(is_all_order_selected)">全选</button>
         <button  :disabled ="cur_order_status_filter!=='已付款'" @click="print_submit(order_list)">打印标签</button>
         <button :disabled ="cur_order_status_filter!=='标签打印'" @click="purchase_goods_submit(order_list)">进行拿货</button>
         <button :disabled ="cur_order_status_filter!=='拿货中'"  @click="purchase_goods_compelted(order_list)">已拿货</button>
       <button   :disabled ="cur_order_status_filter!=='拿货中'"  @click=" tomorrow_goods(order_list)">明日有货</button>
         <button   :disabled ="cur_order_status_filter!=='拿货中'"  @click="not_goods(order_list) ">缺货</button>
         <button   :disabled ="cur_order_status_filter!=='已拿货'"  @click="logistics_print(order_list) ">打印快递单</button>

         <button   :disabled ="cur_order_status_filter!=='快递打印'"  @click=" deliver_goods(order_list)">发货</button>
    </div>
    <ul class = "items_ul">
        <li class="item_order" v-for="(item,index) in order_list" :key="index">
          <div  class="order_div" >
            <input style="width: 1.5em; height: 1.5em " type="checkbox" v-model="item.is_checked">
              <label  class="order_label" >订单号：{{item.order_number}}</label>
              <label> {{item.consignee_name}} {{item.consignee_phone}} {{item.consignee_address}}</label>
          </div>
              <div class="item_goods"  v-for="(goods,index2) in item.orderGoods">
                <div>
                   <input style="width: 1.2em; height: 1.2em ;float: left" type="checkbox" v-model="goods.is_checked">
                   <label>商品：{{index2+1}}
                      {{goods.shop_market_name}}_{{goods.shop_floor}}_{{goods.shop_stalls_no}}_{{goods.art_no}}_{{goods.goods_price}}元_{{goods.goods_color}}_{{goods.goods_count}}件
                   </label>
                </div>

                  <div style="padding-left: 1.2em">
                    <label style="float: left;margin-right: 0.8em"> 商品状态：{{goods_status[goods.status]}} </label>
                    <label style="float: left">售后状态：</label><label :class="{red_color:refund_apply_status[goods.refund_apply_status]!=='无售后'}">   {{refund_apply_status[goods.refund_apply_status]}}  </label>
                  </div>
                  <div ></div>
                  <div style="padding-left: 1.2em" v-if="goods.return_logistics_name !== null " ><label style="float: left">售后物流：</label><label  >   {{goods.return_logistics_name}}:{{goods.return_logistics_number}}  </label> </div>
                <div style="padding-left: 1.2em">
                 <label style="color: red; float: left; margin-right: 1em" >   下单备注：{{goods.customer_message}}</label>
                 <label style="color: red">   客服留言：{{goods.customer_service_message}}</label>
                </div>
              </div>
              <div>
                <label style="padding-left: 0.5em">订单总价：{{item.logistics_fee}} + {{item.agency_fee}}+ {{item.orderGoodsTotalMoney}} =
                              {{item.logistics_fee + item.agency_fee + item.orderGoodsTotalMoney}}
                </label>
              </div>
              <div>
                <label style="padding-left: 0.5em">下单时间:{{item.add_time}}</label>
                <select v-if ="cur_order_status_filter ==='快递打印'" style="width: 5em" v-model="item.logistics_name">
                            <option :value="option.logistics_name" v-for="(option,index) in logistics_options" :key="index">{{option.logistics_name}}</option>
                 </select>
                <label v-else="" v-text="item.logistics_name"></label>
              <!--<select v-else="">快递：{{item.logistics_name}}</select>-->

              <input v-if="cur_order_status_filter ==='快递打印'" v-model="item.logistics_number">
              <label v-else>单号：{{item.logistics_number}}</label>
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
  import pcommon_function from '../../../utils/pcommon_function';
  import mGlobal from '../../../utils/mGlobal';
    import  axios  from 'axios'

     //设为true 就会带cookies 访问
    axios.defaults.withCredentials=true;
    export default {
        name: "MyOrder",
        data(){
          return{
            query_q :"",
            next_page_url :"",
            selected_op :"",
            print_btn_disable :false,
            purchase_goods_btn_disable :false,
            // 订单是否全选
            is_all_order_selected:false,
            cur_order_status_filter:"已付款",
            options: [
            { text: '请选择', value: '' },
            { text: '退货退款', value: '1' },
            { text: '仅退款', value: '2' }
          ],
            logistics_options:"",
            logistics_name:{

            },
              refund_apply_type:mGlobal.REFUND_APPLY_TYPE,
              refund_apply_status :mGlobal.REFUND_APPLY_STATUS,
              goods_status: mGlobal.GOODS_STATUS,
              goods_status2: mGlobal.GOODS_STATUS2,

            prePageShow:true,
            nextPageShow:true,
            order_list:[],
            prePageUrl:"",
            nextPageUrl:"",
          }
      },

      methods:{
                    // 加载物流选项信息
          load_logistics(){
            const url  = this.mGLOBAL.DJANGO_SERVER_BASE_URL+"/trade/logistics/"
           //设为true 就会带cookies 访问
           axios.defaults.withCredentials=true
            axios.get(url,

           ).then((res)=>{
             if("1000" === res.data.code){
                 console.log(res.data)
                  this.logistics_options = pcommon_function.analysis_logistics( res.data.data)
                  console.log(this.logistics_options)

             }else{
              console.log("获取物流失败")
             }
              }).catch(error => {
                console.log(error) ;

              })
          },
          // 发货
          deliver_goods(order_list){
            let deliver_order_list = []
            for(let i = 0;i<order_list.length;i++){
               if(order_list[i].is_checked  === true){
                  deliver_order_list.push({"order_number":order_list[i].order_number,"logistics_name":order_list[i].logistics_name,"logistics_number":order_list[i].logistics_number})
                  }
                }
            const url = this.mGLOBAL.DJANGO_SERVER_BASE_URL+"/back/deliverGoods/";
             //设为true 就会带cookies 访问
              axios.defaults.withCredentials=true;
              axios.post(url,{"deliver_order_list":deliver_order_list}).then((res)=>{
             if(res.data.code === "1000"){
               // #状态发生改变的订单
               let exception_order_list = res.data.exception_order
               this.$toast("提交成功")
             }else{
                alert("提交失败")
             }
            }).catch(error => {

              console.log(error)
              alert("提交失败")
            })
          },
          // 快递单打印
          logistics_print(order_list){
            let print_logistic_order_list = []
            for(let i = 0;i<order_list.length;i++){
               if(order_list[i].is_checked  === true){
                  print_logistic_order_list.push(order_list[i].order_number)
                  }
                }

              const url = this.mGLOBAL.DJANGO_SERVER_BASE_URL+"/back/logisticsPrint/";
             //设为true 就会带cookies 访问
              axios.defaults.withCredentials=true;
              axios.post(url,{"print_logistic_order_list":print_logistic_order_list}).then((res)=>{
             if(res.data.code === "1000"){
               // #状态发生改变的订单
               let exception_order_list = res.data.exception_order
               this.$toast("提交成功")
             }else{
                alert("提交失败")
             }
            }).catch(error => {
              console.log(error)
              alert("提交失败")
            })
            },


          //明日有货
          not_goods(order_list){
             let submit_order_list = []
            for(let i = 0;i<order_list.length;i++){
               if(order_list[i].is_checked  === true){
                 let submit_order_goods_list = []
                 for(let g = 0;g < order_list[i].orderGoods.length;g++){
                   if(order_list[i].orderGoods[g]["is_checked"] === true){
                     submit_order_goods_list.push({"goods_number":order_list[i].orderGoods[g].goods_number,"goods_count":order_list[i].orderGoods[g].goods_count})
                   }
                 }
                  submit_order_list.push({"order_number":order_list[i].order_number,"orderGoods":submit_order_goods_list})
               }
            }
            const url = this.mGLOBAL.DJANGO_SERVER_BASE_URL+"/back/notGoods/";
             //设为true 就会带cookies 访问
            axios.defaults.withCredentials=true;
            axios.post(url,{"no_goods_order_list":submit_order_list}).then((res)=>{
             if(res.data.code === "1000"){
               // #状态发生改变的订单
               let exception_order_list = res.data.exception_order


               this.$toast("提交成功")
             }else{
                alert("提交失败")
             }
        }).catch(error => {
           this.purchase_goods_btn_disable = false;
            console.log(error)
             alert("提交失败")
        })
          },




         //明日有货
          tomorrow_goods(order_list){
             let submit_order_list = []
            for(let i = 0;i<order_list.length;i++){
               if(order_list[i].is_checked  === true){
                 let submit_order_goods_list = []
                 for(let g = 0;g < order_list[i].orderGoods.length;g++){
                   if(order_list[i].orderGoods[g]["is_checked"] === true){
                     submit_order_goods_list.push({"goods_number":order_list[i].orderGoods[g].goods_number,"goods_count":order_list[i].orderGoods[g].goods_count})
                   }
                 }
                  submit_order_list.push({"order_number":order_list[i].order_number,"orderGoods":submit_order_goods_list})
               }
            }
            const url = this.mGLOBAL.DJANGO_SERVER_BASE_URL+"/back/tomorrowGoods/";
             //设为true 就会带cookies 访问
            axios.defaults.withCredentials=true;
            axios.post(url,{"tomorrow_order_list":submit_order_list}).then((res)=>{
             if(res.data.code === "1000"){
               // #状态发生改变的订单
               let exception_order_list = res.data.exception_order


               this.$toast("提交成功")
             }else{
                alert("提交失败")
             }
        }).catch(error => {
           this.purchase_goods_btn_disable = false;
            console.log(error)
             alert("提交失败")
        })
          },




          //已拿货
          purchase_goods_compelted(order_list){

             let submit_order_list = []
            for(let i = 0;i<order_list.length;i++){
               if(order_list[i].is_checked  === true){
                 let submit_order_goods_list = []
                 for(let g = 0;g < order_list[i].orderGoods.length;g++){
                   if(order_list[i].orderGoods[g]["is_checked"] === true){
                     submit_order_goods_list.push({"goods_number":order_list[i].orderGoods[g].goods_number,"goods_count":order_list[i].orderGoods[g].goods_count})
                   }
                 }
                  submit_order_list.push({"order_number":order_list[i].order_number,"orderGoods":submit_order_goods_list})
               }
            }
            const url = this.mGLOBAL.DJANGO_SERVER_BASE_URL+"/back/purchaseGoodsComplete/";
             //设为true 就会带cookies 访问
            axios.defaults.withCredentials=true;
            axios.post(url,{"purchase_complete_order_list":submit_order_list}).then((res)=>{
             if(res.data.code === "1000"){
               // #状态发生改变的订单
               let exception_order_list = res.data.exception_order


               this.$toast("提交成功")
             }else{
                alert("提交失败")
             }
        }).catch(error => {
           this.purchase_goods_btn_disable = false;
            console.log(error)
             alert("提交失败")
        })
          },

          //拿货
          purchase_goods_submit(order_list){
            this.purchase_goods_btn_disable = true;
             let purchase_order_list = []
            for(let i = 0;i<order_list.length;i++){
               if(order_list[i].is_checked  === true){
                  purchase_order_list.push(order_list[i].order_number)
               }
            }
            const url = this.mGLOBAL.DJANGO_SERVER_BASE_URL+"/back/purchaseGoods/";
             //设为true 就会带cookies 访问
            axios.defaults.withCredentials=true;
            axios.post(url,{"order_list":purchase_order_list}).then((res)=>{
             if(res.data.code === "1000"){

               // #状态发生改变的订单
               let exception_order_list = res.data.exception_order

               this.purchase_goods_btn_disable = false;
               this.$toast("提交成功")
             }else{
                alert("提交失败")
             }
        }).catch(error => {
           this.purchase_goods_btn_disable = false;
            console.log(error)
             alert("提交失败")
        })



          },
          start_tag_print(){
            for(let i=0;i< this.order_list.length;i++){
              for(let g = 0; g<this.order_list[i].orderGoods.length;g++){

                console.log(this.order_list[i].orderGoods[g].hasOwnProperty("stop_tag_print"))
              }
            }
          },
          // 提交打印
          print_submit(order_list){
            this.print_btn_disable = true
            let print_order_list = []
            for(let i = 0;i<order_list.length;i++){
               if(order_list[i].is_checked  === true){
                  print_order_list.push(order_list[i].order_number)
               }
            }
            console.log(print_order_list)
            const url = this.mGLOBAL.DJANGO_SERVER_BASE_URL+"/back/tagPrint/";
             //设为true 就会带cookies 访问
            axios.defaults.withCredentials=true;
            axios.post(url,{"order_list":print_order_list}).then((res)=>{
             if(res.data.code === "1000"){

               // #状态发生改变的订单
               let exception_order_list = res.data.exception_order
               console.log(".......................................................")
               console.log(this.order_list)
               print_order_list=  this.filter_exception_order_goods(this.order_list,exception_order_list)
               this.start_tag_print()
               console.log(this.order_list)
               console.log(".......................................................")
               this.print_btn_disable = false
               this.$toast("打印完成")
             }else{
                alert("提交失败")
             }
        }).catch(error => {
           this.print_btn_disable = false
            console.log(error)
             alert("提交失败")
        })
          },
        // 过滤异常状态的商品 如已退款的商品
        filter_exception_order_goods(print_order_list,exception_order_list){
            console.log("1")
            for(let i = 0 ;i<print_order_list.length;i++){
              console.log("2")
              for(let  e = 0;e <exception_order_list.length;e++){
                console.log("3")
                let index = this.get_order_by_order_number(print_order_list,exception_order_list[e].order_number)
                console.log("找到index",index)
                if(index!==-1){

                   console.log("4")
                  console.log("index",print_order_list[index])
                  for(let o = 0;o<exception_order_list[e].orderGoods.length;o++){
                    let goods_index = this.get_order_goods_index_by_goods_number(print_order_list[index].orderGoods,exception_order_list[e].orderGoods[o])
                    if(goods_index !== -1){
                      console.log("orderGoods",print_order_list[index].orderGoods[goods_index])
                      print_order_list[index].orderGoods[goods_index]['stop_tag_print'] = true
                      print_order_list[index].orderGoods[goods_index]['is_checked'] = false
                    }
                  }
                }
              }
            }
            return print_order_list
        },
        get_order_goods_index_by_goods_number(goods_list,goods_number){
            for(let i = 0;i<goods_list.length;i++){
              if(goods_list[i].goods_number === goods_number){
                return i;
              }
            }
            return -1;
        },
        get_order_by_order_number(order_list,order_number){
          for(let i = 0;i<order_list.length;i++){
            if(order_list[i].order_number === order_number){
               return i;
            }

          }
          return -1;
        },
          go_print_format_page(){
            let  routeData = this.$router.resolve({ path: '/pc/back/printPageFormat',query: {order_list: JSON.stringify(this.order_list)}})
            window.open(routeData.href, '_blank')

          },
          select_all(is_select){
            console.log("777777777")
            for(let i = 0;i<this.order_list.length;i++){
              console.log("999999999999999999999")
              console.log(this.order_list[i].is_checked)
              let befor_status = this.order_list[i].is_checked
              this.$delete(this.order_list[i],'is_checked');
              this.$set(this.order_list[i], 'is_checked', !this.is_all_order_selected);

            }
            this.is_all_order_selected = !this.is_all_order_selected
          },
            on_order_filter(query_data,btn_tag){
             // let query_data ;
               this.cur_order_status_filter=btn_tag;

            this.order_list = []
            const url = this.mGLOBAL.DJANGO_SERVER_BASE_URL+"/back/orders/";
            this.loadOrderPage(url,query_data)
          },
           on_orders_query(query_keys){
             console.log("99999999999999999999999999")
             console.log(query_keys)
            const url = this.mGLOBAL.DJANGO_SERVER_BASE_URL+"/back/orders/";
            let query_data = {"q":query_keys.trim()};
            this.loadOrderPage(url,query_data)
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
                cur_page_url = this.mGLOBAL.DJANGO_SERVER_BASE_URL+"/back/orders/";
            }
             this.loadOrderPage(cur_page_url);
        },

          replaceData() {
            for(let i = 0;i<this.order_list.length;i++){
              let item =  this.order_list[i];
               let  mdate = mtime.formatDateStrFromTimeSt(item.add_time);
              console.log(mdate)
              item.add_time =mdate;
              item['is_checked'] = true;
              let orderGoodsTotalMoney = 0;
                for(let g = 0; g < item.orderGoods.length;g++){
                    orderGoodsTotalMoney = orderGoodsTotalMoney + item.orderGoods[g].goods_price * item.orderGoods[g].goods_count
                    if(this.cur_order_status_filter ===  "拿货中"){
                        item.orderGoods[g]["is_checked"] = false
                    }else{
                       item.orderGoods[g]["is_checked"] = true
                    }


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

        loadOrderPage(url,query_data){

           axios.defaults.withCredentials=true;
           axios.get(url,{
              params:query_data,
          }
        ).then((res)=>{

          console.log(res.data)
          this.order_list = res.data.results;
          this.replaceData()

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
          console.log("myorder------------------------------------") ;
          console.log(error) ;
        })
        }
      },

      created(){
          this.load_logistics()
          const url = this.mGLOBAL.DJANGO_SERVER_BASE_URL+"/back/orders/";
          this.loadOrderPage(url);
      },

    }
</script>

<style scoped>
  .status_ul{
    display: inline-block
  }
  .status_select{
    background: #f0f0f0 ;
    border:gainsboro solid 1px;
  }
  .status_ul li{
    list-style: none;
    float: left;
  }
   .status_ul a{
     list-style: none;
     padding: 0.3em;
     cursor: pointer;
  }
  .red_color{
    color: red;
  }
  .item_order{
    margin-bottom: 3em;
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
