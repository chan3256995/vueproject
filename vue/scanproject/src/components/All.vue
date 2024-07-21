<template>
  <div style="padding-bottom: 5em">
    <div>

       <select  v-model="market_name_selected">
          <option :value="market_name" v-for="(market_name,index) in market_name_options" :key="index">{{market_name}}</option>
       </select>
        <input v-model="search_shop_floor" style="width: 5em; height: 2em ; " placeholder="楼层"/>
        <input v-model="search_stall_no" style="width: 5em; height: 2em ; " placeholder="档口号"/>
        <input v-model="search_art_no" style="width: 5em; height: 2em ; " placeholder="款号"/>
       <select  v-show="false"  v-model="goods_status_selected">
          <option :value="goods_status_option.value" v-for="(goods_status_option,index) in goods_status_options" :key="index">{{goods_status_option.text}}</option>
       </select>
      <input  style="width: 6em;" v-model="search_user_name" placeholder="用户名">
        <button @click="on_order_filter_load({'args_and':{'user_name':search_user_name,'market_name':market_name_selected,'market_floor':search_shop_floor,'stalls_no':search_stall_no,'art_no':search_art_no}})"> 查询</button>

     </div>

    <div style="text-align: left" v-for="(order,index) in order_list" :key="index">
      <div style="background: paleturquoise ;overflow:hidden">
          <label style="color: black ; font-size: 1.2em">{{order.id}}</label>
          <label style="width: 40% ;font-size: smaller">订单号：{{order.order_number}}</label>
        <label style="font-size: smaller;">{{return_format_time(order.add_time)}}</label>

        <label>下单人:{{order.order_owner.user_name}}</label>
        <label style="margin-left:0.5em;">跟单人: </label>
         <label v-if="order.order_follower !==null" style="color:black">{{order.order_follower.user_name}}</label>
      </div>

      <div style="padding-left: 4%; padding-bottom: 5px" v-for="order_goods in order.orderGoods">
        id:{{order_goods.id}}
        {{order_goods.shop_market_name}}
        {{order_goods.shop_floor}}
        {{order_goods.shop_stalls_no}}
        {{order_goods.art_no}}
        {{order_goods.goods_color}}
      <div style="color: red;">{{goods_status[order_goods.status]}} {{order_goods.goods_price}}元  {{order_goods.goods_count}}件</div>

      <div style="color: red;"></div>
      </div>


    </div>

    <table class="page_table">
      <tr>
        <td style=" cursor:pointer;"><a @click="firstPage">首页</a></td>
        <td style=" cursor:pointer;" v-if="prePageShow"><a  @click="prePage" style="">上一页</a></td>
        <td  style=" cursor:pointer;" v-if="nextPageShow"><a @click="nextPage">下一页</a></td>

      </tr>
    </table>
  </div>
</template>

<script>
  import pGlobal from '../utils/pGlobal'
  import  axios  from 'axios'
  import mtime from '../utils/mtime'
  import  cookiesUtils from '../utils/cookieUtil'
    export default {
        name: "Home",
        data(){
          return{
            default_query_params: {"is_order_follower": "all"},
            default_goods_status : {'status_list': pGlobal.GOODS_STATUS2['已付款']+','+
                pGlobal.GOODS_STATUS2['拿货中']+','+
                pGlobal.GOODS_STATUS2['已拿货']+','+
                pGlobal.GOODS_STATUS2['已发货']+','+
                pGlobal.GOODS_STATUS2['已退款']+','+
                pGlobal.GOODS_STATUS2['明日有货']+','+
                pGlobal.GOODS_STATUS2['已取消']+','+
                pGlobal.GOODS_STATUS2['缺货']+','+
                pGlobal.GOODS_STATUS2['标签打印']+','+
                pGlobal.GOODS_STATUS2['快递打印']+','+
                pGlobal.GOODS_STATUS2['已下架']+','+
                pGlobal.GOODS_STATUS2['2-5天有货']+','+
                pGlobal.GOODS_STATUS2['其他']},
              //       "未付款":1,//未付款
              // "已付款":2,//已付款
              // "拿货中":3,//拿货中
              // "已拿货":4,//已拿货
              // "已发货":5,//已发货
              // "已退款":6,//已退款
              // "明日有货":7,//明日有货
              //  "已取消":8,
              //  "缺货":9,
              //  "标签打印":10,
              //  "快递打印":11,
              // '已下架': 12,
              // '2-5天有货': 13,
              // '其他': 14,
            order_list :"",
            is_all_order_selected:false,
            goods_status :pGlobal.GOODS_STATUS,
            goods_status2 :pGlobal.GOODS_STATUS2,
            prePageShow:true,
            nextPageShow:true,
            goods_status_selected :"",
            market_name_selected :"",
            search_user_name:"",
            search_shop_floor:'',
            search_stall_no:'',
            search_art_no:'',
            // 后面要对 market_name_options 数据进行加工  需要另外开辟一个数组合并数据 不然会影响pGlobal.MARKET_NAME_LIST 源数据
            market_name_options :[].concat(pGlobal.MARKET_NAME_LIST),
            goods_status_options  :[].concat(pGlobal.GOODS_STATUS_OPTIONS),
            firstPageUrl:pGlobal.DJANGO_SERVER_BASE_URL+"/nahuo/orders/",
            prePageUrl:"",
            nextPageUrl:"",
          }

        },

        methods:{

             select_all_orders(order_list){

             for(let i = 0;i< order_list.length;i++){
                    console.log(this.is_all_order_selected)
                    this.$delete(order_list[i], 'is_order_selected');
                    this.$set(order_list[i], 'is_order_selected', !this.is_all_order_selected);
               }
               this.is_all_order_selected = !this.is_all_order_selected
        },
          prePage(){
            console.log(this.prePageUrl)
            this.loadOrderPage(this.prePageUrl)
          },

          nextPage(){
             console.log(this.nextPageUrl)
            this.loadOrderPage(this.nextPageUrl)
          },
           firstPage(){
            if(this.firstPageUrl!==""){
              let query_data  = {}
              Object.assign(query_data,this.default_query_params)
              Object.assign(query_data,this.default_goods_status)
              this.loadOrderPage(this.firstPageUrl,query_data)
            }

          },

           loadOrderPage(url,query_data){

           axios.defaults.withCredentials=true;
           this.$axios.get(url,{
              params:query_data,
          }
        ).then((res)=>{
          console.log(res.data)
          this.order_list = res.data.results;
          this.order_list = this.replaceData(this.order_list)
          this.is_all_order_selected = false
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
        },

          add_all_to_my_follow_order(order_list){
                let order_number_list= []
               for(let i = 0;i<order_list.length;i++){
                 if(order_list[i].is_order_selected === true){
                   order_number_list.push(order_list[i].order_number)
                 }
               }
               if(order_number_list.length !== 0){
                 this.add_to_my_follow_order(order_number_list)
               }

          },
          add_to_my_follow_order(order_number_list){
            let data_ = {
              "order_list":order_number_list,

            }
             let url = pGlobal.DJANGO_SERVER_BASE_URL+"/nahuo/selectOrders/"
             axios.post(url,data_).then((res)=>{
                console.log(res.data)
               if(res.data.code==="1000"){

                 this.$toast("提交成功,")

               }else{
                 this.$toast("提交失败")
               }

            })
          },
          init_data(){

           this.market_name_options.unshift("全部")
           this.goods_status_options.unshift({text:"全部",value:"全部"},);

           this.market_name_selected = this.market_name_options[0];
            this.goods_status_selected = this.goods_status_options[0].value
        },
          on_order_filter_load(args_and){
                 // let query_data ;
                let market_name = null;
                let goods_status = null;
                if(args_and.args_and.market_name==='全部'){
                    args_and.args_and.market_name =null
                }
                if (args_and.args_and.goods_status === '全部'  ){
                    args_and.args_and.goods_status = null
                }
                 // let query_data={'market':market_name,'status':goods_status}
                let query_data=args_and
                this.order_list = []
                const url = this.firstPageUrl

                  Object.assign(query_data,this.default_query_params)

                  Object.assign(query_data,this.default_goods_status)

                  console.log("query_data---",query_data)
                this.loadOrderPage(url,query_data)
              },

           replaceData(order_list) {
            for(let i = 0;i<order_list.length;i++){
               let item =  order_list[i];
               let  mdate = mtime.formatDateStrFromTimeSt(item.add_time);
              console.log(mdate)
              item.add_time =mdate;
              let orderGoodsTotalMoney = 0;
                for(let g = 0; g < item.orderGoods.length;g++){
                    orderGoodsTotalMoney = orderGoodsTotalMoney + item.orderGoods[g].goods_price * item.orderGoods[g].goods_count
                }
                item['orderGoodsTotalMoney'] = orderGoodsTotalMoney
                item['is_order_selected'] = false
            }
            return order_list
          },
        return_format_time(time_stamp){
          let  mdate = mtime.formatDateStrFromTimeSt(time_stamp);
             return  mdate=mdate.substr(5,11)
      }
        },


        created(){
          this.init_data();
           // let query_data={'args_and':{'goods_status':this.goods_status2['已付款']}}
          let query_data = {}
          Object.assign(query_data,this.default_goods_status)
          Object.assign(query_data,this.default_query_params)
          this.loadOrderPage(this.firstPageUrl,query_data)
      }
    }



</script>

<style scoped>
  .page_table{
    margin: 0 auto;
    float: bottom;
  }
</style>
