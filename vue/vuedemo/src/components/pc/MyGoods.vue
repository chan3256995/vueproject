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
        <input v-model="query_q" style="width: 85%;height: 2em;max-width: 40em; " placeholder="用户编码，货号"/><button @click='on_orders_query(query_q)' style="margin-left: 0.5em">查询</button><button @click="add_goods()"  style="margin-left: 0.5em">添加商品</button>
        <!--<label>时间选择</label><input @click="calendar_show = !calendar_show" v-model="during_str">-->
    </div>



    <div  class = "items_ul">


          <div  class="global_background" style=" width:98% ">
            <table   style=" width:98% " >


              <tr style="background: white" v-for="(goods,index2) in goods_list">

                <td ><input type="checkbox"  ></td>
                 <td style="width: 5em"><button @click="delete_my_goods({'id_list':[goods.id]})" style="width: 4em;padding-left: 0;padding-right: 0px">删除</button> <button @click="alter_goods(goods)" style="width: 6em;margin-top:0.2em;display: inline">确定修改</button></td>
                <td><img v-bind:src="goods.image_url"style="width: 3em;height: 3em"/></td>
                <td>

                  <div style="border: grey solid 1px;margin-bottom: 2px"><label style="float: left">商品图片</label><input style="width: 5em" v-model="goods.image_url"></div>
                  <div style="border: grey solid 1px;"><label style="float: left">用户编码</label><input  v-model="goods.user_code"></div>
                </td>

                <td>
                  <div style="border: grey solid 1px;margin-bottom: 2px"><label style="float: left">档口名</label><input style="width: 5em" v-model="goods.shop_name"></div>
                  <div style="border: grey solid 1px;margin-bottom: 2px"><label style="float: left">市场</label><input style="width: 5em" v-model="goods.shop_market_name"></div>
                </td>
                 <td>
                  <div style="border: grey solid 1px;margin-bottom: 2px"><label style="float: left">楼层</label><input style="width: 5em" v-model="goods.shop_floor"></div>
                  <div style="border: grey solid 1px;margin-bottom: 2px"><label style="float: left">档口号</label><input style="width: 5em" v-model="goods.shop_stalls_no"></div>
                </td>
                <td>
                  <div style="border: grey solid 1px;margin-bottom: 2px"><label style="float: left">款号</label><input style="width: 5em" v-model="goods.art_no"></div>
                  <div style="border: grey solid 1px;margin-bottom: 2px"><label style="float: left">价格</label><input style="width: 5em" v-model="goods.goods_price"></div>
                  <!--<div style="border: grey solid 1px;margin-bottom: 2px"><label style="float: left">替换规则</label><input style="width: 5em" v-model="goods.replace_string"></div>-->
                </td>
                <td>
                  <div style="border: grey solid 1px;margin-bottom: 2px"><label style="float: left">商品源地址</label><input style="width: 5em" v-model="goods.origin_url"></div>
                  <div style="border: grey solid 1px;margin-bottom: 2px"><label style="float: left">备注</label><input style="width: 5em" v-model="goods.remarks"></div>
                </td>
                 <td>
                  <div style="border: grey solid 1px;margin-bottom: 2px"><label style="float: left">颜色</label><input style="width: 5em" v-model="goods.goods_color"></div>
                  <div style="border: grey solid 1px;margin-bottom: 2px"><label style="float: left">尺码</label><input style="width: 5em" v-model="goods.goods_size"></div>
                </td>
                <td>
                  <div style="border: grey solid 1px;margin-bottom: 2px"><label style="float: left">锁定</label><input type="checkbox"  v-model="goods.is_default" ></div>

                </td>


              </tr>
            </table>


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
          alter_goods(goods){
              if(!confirm("确定修改订单吗？")) {
                return ;
              }
              const url = this.mGLOBAL.DJANGO_SERVER_BASE_URL+"/user/userGoodsEdit/";
              let post_goods = {
     	          "user_goods_data":{
     	   	      "id":goods.id,
     	   	      "origin_url": goods.origin_url,
                        "image_url": goods.image_url,
                        "user_code":  goods.user_code,
                        "replace_string": goods.replace_string,
                        "shop_market_name": goods.shop_market_name,
                        "shop_floor": goods.shop_floor,
                        "shop_stalls_no": goods.shop_stalls_no,
                        "art_no": goods.art_no,
                        "shop_name": goods.shop_name,
                        "goods_price": goods.goods_price,
                        "goods_color": goods.goods_color,
                        "goods_size": goods.goods_size,
                        "remarks": goods.remarks,
                        "is_default": goods.is_default,
     	          }
     }
               axios.post(url,post_goods).then((res)=>{
              if(res.data.code ==="1000"){
                console.log(res.data)
                this.$toast("提交成功！")
              }else{
                this.$toast("修改密码失败！"+res.data.message)
              }

            }).catch(error=>{
                console.log("提交失败")
                this.$toast("请求错误")
            })
      },
          // 添加商品
          add_goods(){
            this.$myGoodsBox2.showMsgBox({
                  title: '添加商品',
                  isShowInput: false,

              }).then(async (val) => {
                   if(val === "confirm"){
                     this.refresh_cur_page();
                   }


              }).catch(() => {
                  // ...
              });
          },
                  // 删除订单(未付款订单)
          delete_my_goods(goods_id_list){
                  if(!confirm("确定删除吗？删除后不可恢复。")) {
                    return ;
                  }
                const url = this.mGLOBAL.DJANGO_SERVER_BASE_URL+"/user/userGoodsDelete/";
                axios.post(url,goods_id_list).then((res)=>{
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
            const url = this.mGLOBAL.DJANGO_SERVER_BASE_URL+"/user/userGoodsInfo/";
            let query_data = {"keys":query_keys.trim()};
            this.loadOrderPage(url,query_data)
          },

        //刷新当前页面
        refresh_cur_page(){
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
                cur_page_url = this.mGLOBAL.DJANGO_SERVER_BASE_URL+"/user/userGoodsInfo/";
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
