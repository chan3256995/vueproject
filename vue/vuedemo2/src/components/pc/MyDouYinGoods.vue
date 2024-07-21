<template>
  <div id= 'container_id' class="container">

    <div style="text-align: center">



    </div>
    <div style="padding-left: 5em">
        <!--<input v-model="query_q" style="width: 85%;height: 2em;max-width: 40em; " placeholder="店铺ID，店铺名称"/><button @click='on_shop_query(query_q)' style="margin-left: 0.5em">查询</button><button @click="add_shop()"  style="margin-left: 0.5em">添加店铺</button>-->
        <!--<label>时间选择</label><input @click="calendar_show = !calendar_show" v-model="during_str">-->
    </div>


<div style="margin-left: 3em">

        <input v-model="search_sell_num" style="width: 5em; height: 2em ; " placeholder="销量">
        <input v-model="search_shop_name" style="width: 5em; height: 2em ; " placeholder="店铺名"/>
        <input v-model="search_fav_shop_remarks" style="width: 5em; height: 2em ; " placeholder="店铺备注信息"/>
        <label @click="is_my_fav_click()" :class="{status_select:is_user_fav_shop_data===true}" >只显示我关注的</label>
        <label @click="order_by_today_sell_num()" :class="{status_select:is_order_by_today_sell_num===true}" >今日销量排序</label>
        <select  style="margin-left:0.5em;width: 5em"  v-model="goods_add_time_selected1">
            <option :value="option" v-for="(option,index) in goods_add_time_options1" :key="index">{{option.text}}</option>
         </select>
        <button @click='mul_condition_query()' style="margin-left: 0.5em">条件筛选</button>
        <button @click="all_query()" >全部</button>
        <button @click="clean_douyin_goods_item()" >清除商品数据</button>
        <input v-model="clean_days" style="width: 5em; height: 2em ; " placeholder="清除多少天前数据"/>


      </div>
    <div  class = "items_ul">


          <div  class="global_background" style=" width:98% ">
            <table   style=" width:98% " >

              <tr>
                <td></td>
                <td>图片</td>
                <td>标题</td>
                <td>价格</td>
                <td>店铺名称</td>
                <td>采集记录</td>
                <td>销量</td>
                <td>今日销量</td>
                <td>更新/添加时间</td>

              </tr>
              <tr style="background: white" v-for="(goods,index2) in goods_list">

                <td ><input type="checkbox"  ></td>

                <td><img v-bind:src="goods.image"style="width: 7em;height: 7em"/>
                <td>
                <a v-bind:href="goods.goods_url" target="_blank">{{goods.goods_name}}</a>

                </td>
                <td>
                   <label   >{{goods.goods_price}}</label>

                </td>
                <td>
                  <a v-bind:href="goods.shop_url" target="_blank">{{goods.dou_yin_shop.shop_name}}</a>
                    <label style="display: block"  >({{goods.dou_yin_shop.remarks}})</label>

                </td>

                <td>


                  <button @click="show_goods_record(goods.id)" >显示记录</button>


                </td>

                <td>
                   <label   >{{goods.sell_num}}</label>
                </td>
                <td>
                   <label   >{{goods.today_sell_num}}</label>
                </td>
                <td>
                   <label style="display: block"  >{{goods.update_time}}</label>
                   <label   >/{{goods.add_time}}</label>

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
        name: "MyDouYinGoods",
      data(){
          return{
            calendar_show:false,
            defaultDate:[],
            disabledDate:[],
            during_str:"",
            clean_days:30,
            search_sell_num:"",
            search_shop_name:"",
            search_fav_shop_remarks:"",
            is_order_by_update_time :false,
            // 加载数据后是否滚动到顶端
            is_scroll_top:true,
            is_user_fav_shop_data:true,
            is_order_by_today_sell_num:false,
            goods_add_time_selected1:{value:"",text:"商品添加时间"},
            goods_add_time_options1 :[
              {value:"",text:"商品添加时间"},
              {value:"14400000",text:"4小时"},
              {value:"43200000",text:"12小时 "},
              {value:"86400000",text:"24小时 "},
              {value:"172800000",text:"48小时 "},

            ],
            prePageShow:true,
            nextPageShow:true,
            goods_list:[],
            firstPageUrl:this.mGLOBAL.DJANGO_SERVER_BASE_URL+"/user/userDouYinGoodsInfo/",
            prePageUrl:"",
            nextPageUrl:"",
          }
      },

      methods:{
          show_goods_record(id){

            this.$douYinGoodsCollectLogBox.showMsgBox({
                  title: '商品采集记录',
                  isShowInput: false,
                  req_dou_yin_goods_info: {"id":id},
                  isShowConfimrBtn: false,

              }).then(async (val) => {



              }).catch(() => {
                  // ...
              });

          },
          is_my_fav_click(){
            this.is_user_fav_shop_data = !this.is_user_fav_shop_data
          },
          order_by_today_sell_num(){
            this.is_order_by_today_sell_num = !this.is_order_by_today_sell_num
          },
          all_query(){

              this.is_user_fav_shop_data =false
              let query_data = { "search_condition":{

                  "is_order_by_today_sell_num":this.is_order_by_today_sell_num,
                 },}
              this.on_shop_query(query_data,"all_btn")

        },
          clean_douyin_goods_item(){
           let data = {"days":this.clean_days}
            const user_url = mGlobal.DJANGO_SERVER_BASE_URL+"/user/cleanDouGoodsView/"
            axios.post(user_url,data).then((res)=>{
              console.log("res--->",res)
              if(res.data.code ==="1000"){

              }
            }).catch(error=>{
                console.log("请求错误")
            })


        },
          mul_condition_query(){


              let query_data = { "search_condition":{"is_user_fav_shop_data":this.is_user_fav_shop_data,
                  "search_sell_num":this.search_sell_num,
                  "is_order_by_today_sell_num":this.is_order_by_today_sell_num,
                  "search_fav_shop_remarks":this.search_fav_shop_remarks,
                  "search_shop_name":this.search_shop_name},}
              if(this.goods_add_time_selected1.text !== "商品添加时间"){
                let goods_add_time = new Date().getTime() -  this.goods_add_time_selected1.value
                query_data['search_condition']["search_goods_add_time"] = goods_add_time
              }



              this.on_shop_query(query_data,"search_condition_btn")

        },
           return_format_time(stmp){
            if (stmp === 0){
               return ""
            }
            return mtime.formatDateStrFromTimeSt(stmp)
          },






          on_goods_query(query_data,btn_tag){
            const url = this.mGLOBAL.DJANGO_SERVER_BASE_URL+"/user/userDouYinGoodsInfo/"

            //
            // if(this.during_str!==""){
            //   Object.assign(query_data,{"during_time":this.during_str})
            // }

            this.loadOrderPage(url,query_data,btn_tag)
          },

           on_shop_query(query_data,btn){

             console.log(query_data)
            const url = this.mGLOBAL.DJANGO_SERVER_BASE_URL+"/user/userDouYinGoodsInfo/";

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
                cur_page_url = this.mGLOBAL.DJANGO_SERVER_BASE_URL+"/user/userDouYinGoodsInfo/";
            }

            let query_data =""


             this.loadOrderPage(cur_page_url,query_data);
        },



          replaceData() {
            for(let i = 0;i<this.goods_list.length;i++){
               let item =  this.goods_list[i];
               let  mdate = mtime.formatDateStrFromTimeSt(item.add_time);
               let  update_time = mtime.formatDateStrFromTimeSt(item.update_time);

               mdate = mdate.substring(5,16)
               update_time = update_time.substring(5,16)
              console.log(mdate)
              item.add_time =mdate;
              item.update_time =update_time;
              item.goods_price =item.goods_price/100;


              item['is_selected'] = false
              item['goods_url'] = "https://haohuo.jinritemai.com/views/product/detail?id="+item['goods_id']
              item['shop_url'] = "https://haohuo.jinritemai.com/views/shop/index?id="+item['dou_yin_shop']['shop_id']

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
          this.replaceData()
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

      },
      created(){

          // const url = this.mGLOBAL.DJANGO_SERVER_BASE_URL+"/user/userDouYinGoodsInfo/"
          // this.loadOrderPage(url);
          this.mul_condition_query()



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
 .status_select{
    background: #f0f0f0 ;
    color: #3bb4f2;
    border:gainsboro solid 1px;
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
