<template>
  <div id= 'container_id' class="container">

    <div style="text-align: center">

      <div style="width: 50% ;text-align: center;margin: 0px auto;" id="calendar" v-if="calendar_show">
          <inlineCalendar    mode="during"  :disabledDate="disabledDate"  :defaultDate="defaultDate" @change="on_calendar_change"/>
          <button @click="calendar_show = false">确定</button>
          <button @click="during_str='' ;calendar_show = false">取消</button>
      </div>

    </div>
    <div style="padding-left: 5em">
        <input v-model="query_q" style="width: 85%;height: 2em;max-width: 40em; " placeholder="订单号 ，收货人名，手机号，快递单号"/><button @click='on_orders_query(query_q)' style="margin-left: 0.5em">查询</button>
        <!--<label>时间选择</label><input @click="calendar_show = !calendar_show" v-model="during_str">-->
    </div>



    <div  class = "items_ul">


          <div  class="global_background" style=" width:98% ">
            <table   style=" width:98% " >
             <tr>
                <td  >全选</td>
                <td>操作</td>
                <td>图片</td>

                <td>商家编号</td>
                <td>档口名</td>
                <td>市场</td>
                <td>楼层</td>
                <td>档口</td>
                <td>货号</td>
                <td>替换规则</td>
                <td>商品地址</td>
                <td>默认</td>

              </tr>
              <tr style="background: gainsboro" v-for="(goods,index2) in goods_list">

                <td ><input type="checkbox"  ></td>
                 <td> <button style="width: 4em;padding-left: 0;padding-right: 0px">编辑</button> <button style="width: 6em;margin-top:0.2em;display: inline">确定修改</button></td>
                <td><input style="width: 5em" v-model="goods.image_url"></td>

                <td><input  v-model="goods.user_code"></td>
                <td><input style="width: 5em" v-model="goods.shop_name"></td>
                <td><input style="width: 5em" v-model="goods.shop_market_name"></td>
                <td><input style="width: 5em"  v-model="goods.shop_floor"></td>
                <td><input v-model="goods.shop_stalls_no"></td>
                <td><input style="width: 5em" v-model="goods.art_no"></td>
                <td><input v-model="goods.replace_string"></td>
                <td><input style="width: 5em" v-model="goods.origin_url"></td>
                <td ><input type="checkbox"  v-model="goods.is_default" ></td>


              </tr>
            </table>
            <div style="background: gainsboro;padding-bottom: 0.5em">
              <li>
                <div style="padding-left: 1em;">
                  <input type="checkbox"/>
                  <label>[买]：</label><label>向日葵200815</label><label> [卖]：</label><label>moonight539</label><label> 订单编号：</label> <label>2386640667784697520</label><label> 地址：</label><label>黄鹏 15997807627 湖北省,十堰市,丹江口市, 蒿坪镇 湖北省丹江口市蒿坪镇,</label>
                </div>
                <div  >
                  <div style="background: white;padding-left: 0.5em">
                    <img style="width: 3em;height: 3em" v-bind:src="tem_img_urm" />
                    <label>颜色尺码：</label><label>白色XL</label><label style="margin-left: 1em">98.00</label><label>x</label><label>1</label>
                  </div>
                  <div style="background: white;padding-left: 0.5em">

                    <img style="width: 3em;height: 3em" v-bind:src="tem_img_urm"/>
                    <label>颜色尺码：</label><label>白色XL</label><label style="margin-left: 1em">98.00</label><label>x</label><label>1</label>
                  </div>
                </div>
              </li>
            </div>

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
  import mtime from '../../utils/mtime.js';
  import mGlobal from '../../utils/mGlobal';
  import  axios  from 'axios'

     //设为ttrue 就会带cookies 访问
    axios.defaults.withCredentials=true;
    export default {
        name: "MyGoods",
      data(){
          return{
            calendar_show:false,
            defaultDate:[],
            disabledDate:[],
            during_str:"",
            tem_img_urm:"https://img.alicdn.com/bao/uploaded/i2/467630318/O1CN01B8sVqV1EDgg889sZS_!!467630318.jpg_60x60.jpg",
            is_order_by_update_time :false,
            // 加载数据后是否滚动到顶端
            is_scroll_top:true,







            prePageShow:true,
            nextPageShow:true,
            goods_list:[],
            firstPageUrl:this.mGLOBAL.DJANGO_SERVER_BASE_URL+"/user/userGoodsInfo/",
            prePageUrl:"",
            nextPageUrl:"",
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

          return_format_time(stmp){
            if (stmp === 0){
               return ""
            }
            return mtime.formatDateStrFromTimeSt(stmp)
          },
          // 修改商品信息
          alter_goods(order_goods){
            this.$orderGoodsBox.showMsgBox({
                  title: '修改商品信息',
                  content: '',
                  isShowInput: true,
                  orderGoods:order_goods,
                  orderGoodsBackUp:Object.assign({},order_goods),
              }).then(async (val) => {
                  this.refresh_cur_page();


              }).catch(() => {
                  // ...
              });
      },








          // 删除订单(未付款订单)
          delete_order(order_number){
              if(!confirm("确定删除订单吗？删除后不可恢复。")) {
                return ;
              }
            const url = this.mGLOBAL.DJANGO_SERVER_BASE_URL+"/user/userGoodsInfo/"+order_number+"/";
            axios.delete(url).then((res)=>{
             if(res.data.code === "1000"){
               alert("删除订单成功")

                this.refresh_cur_page();
             }else if(res.data.code === "1001"){
                alert("删除订单失败")
             }
        }).catch(error => {
             alert("访问错误")
        })
          },



           on_orders_query(query_keys){

             console.log(query_keys)
            const url = this.mGLOBAL.DJANGO_SERVER_BASE_URL+"/user/nullOrders/";
            let query_data = {"q":query_keys.trim()};
            this.loadOrderPage(url,query_data)
          },

        //刷新当前页面
        refresh_cur_page(null_order_status){
              let cur_page_url = "";
              let cur_page_num ;

              this.is_scroll_top = false;
              console.log("this.nextPageUrl",this.nextPageUrl)
            if(this.nextPageUrl !== null && this.nextPageUrl !==""){
              let next_page_num_arr= this.nextPageUrl.match(/page=\d+/);
              let next_page_num = next_page_num_arr[0].split("=")[1]
              let base_url = this.nextPageUrl.substring(0,next_page_num_arr.index);
              let cur_page_num = parseInt(next_page_num)-1;
              cur_page_url = base_url+"page="+cur_page_num;

            }else if(this.prePageUrl !== null && this.prePageUrl !==""){
               let pre_page_num_arr= this.prePageUrl.match(/page=\d+/);
               let pre_page_num = pre_page_num_arr[0].split("=")[1];
               let base_url = this.prePageUrl.substring(0,pre_page_num_arr.index);
               let  cur_page_num = parseInt(pre_page_num)-1;
               cur_page_url = base_url+"page="+cur_page_num;
            }else{
                cur_page_url = this.mGLOBAL.DJANGO_SERVER_BASE_URL+"/user/nullOrders/";
            }

            let query_data =""


             this.loadOrderPage(cur_page_url,query_data);
        },



          replaceData() {
            for(let i = 0;i<this.goods_list.length;i++){
               let item =  this.goods_list[i];
               let  mdate = mtime.formatDateStrFromTimeSt(item.add_time);
              console.log(mdate)
              item.add_time =mdate;
              let is_address_alter = true



              item['is_order_selected'] = false
              item['is_address_alter'] = is_address_alter
            }
          },

          prePage(){
            this.is_scroll_top = true
            console.log(this.prePageUrl)
            this.loadOrderPage(this.prePageUrl)
          },

          nextPage(){
            this.is_scroll_top = true
            console.log(this.nextPageUrl)
            this.loadOrderPage(this.nextPageUrl)
          },

          firstPage(){
            this.is_scroll_top = true
            if(this.firstPageUrl!==""){
              this.loadOrderPage(this.firstPageUrl)
            }

          },
        loadOrderPage(url,query_data){

           axios.defaults.withCredentials=true;
           this.$axios.get(url,{
              params:query_data,
          }
        ).then((res)=>{
          console.log(res.data)
          this.goods_list = res.data.results;
          if(this.is_scroll_top){
            window.scrollTo(0,0);
          }

          // this.replaceData()


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
          this.$toast("加载错误哦")
          console.log(error) ;
        })
        },



      },
      watch:{
        'goods_list': {
          deep: true,
　　　　  handler(new_goods_list, old_goods_list) {
                console.log("goods_list")
                console.log(new_goods_list)
　　　　  },
         }
      },
      created(){

          const url = this.mGLOBAL.DJANGO_SERVER_BASE_URL+"/user/userGoodsInfo/"
          this.loadOrderPage(url);
      },
      mount(){

      }
    }
</script>

<style scoped>
  @import "../../../static/css/PGLOBALCSS.css";
  .status_ul{
      display: block;
      height: 1.5em;
  }
  .status_select{
    background: #f0f0f0 ;
    color: #3bb4f2;
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
    margin-top: 3em;
    padding-bottom: 0.5em;
    border-top:1px solid gray;
  }
  .items_ul{
    padding-top: 0px;
    margin-top: 0px;
  }
.items_ul li{
  list-style: none;
}
  .container{
    width: 100%;
    height: 1000px;
    margin: 0 auto;
    text-align: left;

  }
  .page_table{
    margin: 0 auto;
    float: bottom;
    font-size: 2em;
  }

  .order_div {
    width: 100%;
    padding-top: 0.5em;
    padding-bottom: 0.5em;
    color: #000;
  }
  /*.item_goods label{*/
    /*display: block; padding-bottom: 0.4em*/
  /*}*/



  .order_div label{
  text-align: left;
    padding-left: 0.5em;
  display: inline-block;

}

  .refund_apply_btn{
    cursor:pointer;
    width: 4em;
    height: 2em;
    margin-top: 2px;
    margin-bottom: 2px;

    color: #fff;
   padding: 0.2em;
    font-size: 1.0em;
    border-radius: 4px;
  background: #3bb4f2;
  border-color: #3bb4f2;
  }

</style>
