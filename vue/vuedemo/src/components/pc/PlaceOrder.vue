<template >
 <div class="root">

  <div class="orders_str_div" >
    <div class="review_order_div" >
      <div>
      <table class = "market_table">
              <tr>
                 <td>市场</td>
                 <td>楼层</td>
                 <td>档口</td>
                 <td>款号</td>
                 <td>价格</td>
                 <td>颜色尺码</td>
                 <td>件数</td>
                 <td></td>
            </tr>


            </table>
        <table class = "market_table" style="width: 100%" v-for="(goodsitem,index) in processed_goods_list">
           <tr >
                 <td><input  class="global_input_default_style defalut_input "    :class="{'input_tip':(goodsitem.shop_market_name===''  && is_tip === true )}" v-model="goodsitem.shop_market_name" /></td>
                 <td><input  class="global_input_default_style defalut_input "   :class="{'input_tip':(goodsitem.shop_floor==='' && is_tip === true)}" v-model="goodsitem.shop_floor" /></td>
                 <td><input   class="global_input_default_style defalut_input "  :class="{'input_tip':goodsitem.shop_stalls_no==='' && is_tip === true }"  v-model="goodsitem.shop_stalls_no"/></td>
                 <td><input   class="global_input_default_style defalut_input "  :class="{'input_tip':goodsitem.art_no==='' && is_tip === true}" v-model="goodsitem.art_no"/></td>
                 <td><input  class="global_input_default_style defalut_input "   :class="{'input_tip':goodsitem.goods_price==='' && is_tip === true}"  v-model="goodsitem.goods_price" type="number" /></td>
                 <td><input   class="global_input_default_style defalut_input "  :class="{'input_tip':goodsitem.goods_color==='' && is_tip === true}" v-model="goodsitem.goods_color"/></td>
                 <td><input   class="global_input_default_style defalut_input "  :class="{'input_tip':goodsitem.goods_count==='' && is_tip === true}" v-model="goodsitem.goods_count" type="number" /> </td>
                  <td><button @click="onDeleteRawGoods(index,processed_goods_list)">删除</button></td>

            </tr>

        </table>
        </div>
      <button class = "default_button global_btn_normal_style" @click="onHandAddGoodsClick">添加商品</button>
      <div>
        <div>
          <input placeholder="货号记录搜索" @focus="art_no_input_focus" @blur="art_no_input_blur" style="width: 6em"  class="global_input_default_style defalut_input  auto_goods_input"/>
          <input :placeholder="goods_str_format_selected.text" class="global_input_default_style defalut_input  auto_goods_input" v-model="raw_goods_txt"/>
         <button style="height: 2.4em ; margin-bottom: 0px" class = "default_button global_btn_normal_style" @click="onAddGoodsClick">识别商品</button>
          <select v-model="goods_str_format_selected">
              <option :value="option" v-for="(option,index) in goods_str_format_options" :key="index">{{option.abbreviate}}</option>
          </select>
             <ul  v-show="art_no_auto_search_ul_is_show" @focus="art_no_ul_focus" @blur="art_no_ul_blur" class="huohaolist">
            <li  >市场名_楼层_档口号_货号_价格_颜色尺码_件数</li>
            <li>市场名_楼层_档口号_货号_价格_颜色尺码_件数</li>
            <li>市场名_楼层_档口号_货号_价格_颜色尺码_件数</li>
            <li>市场名_楼层_档口号_货号_价格_颜色尺码_件数</li>
            <li>市场名_楼层_档口号_货号_价格_颜色尺码_件数</li>
            <li>市场名_楼层_档口号_货号_价格_颜色尺码_件数</li>
            <li>市场名_楼层_档口号_货号_价格_颜色尺码_件数</li>
            <li>市场名_楼层_档口号_货号_价格_颜色尺码_件数</li>
            <li>市场名_楼层_档口号_货号_价格_颜色尺码_件数</li>
            <li>市场名_楼层_档口号_货号_价格_颜色尺码_件数</li>
          </ul>
        </div>

        <div  >

        </div>
        <label style="color: red" class = "defalut_input auto_goods_input"  v-text="goods_str_format_selected.text" >市场名_楼层_档口号_货号_价格_颜色尺码_件数(用空格 逗号 下划线 隔开)</label>


        </div>
      <div style="padding-top: 3em; text-align: center">

           <table class="address">
             <tr >

             </tr>
              <tr >
                <td> 姓名：<input class="global_input_default_style defalut_input " :class="{'input_tip':(processed_address_object.name===''  && is_tip === true )} "   v-model="processed_address_object.name" /></td>
                <td>电话： <input  :class="{'input_tip':(processed_address_object.phone===''  && is_tip === true )} " class="global_input_default_style defalut_input "  v-model="processed_address_object.phone" type="number" oninput="if(value.length>11) value=value.slice(0,11)"    /></td>

                 <td>   省份：<input type="text" :class="{'input_tip':(processed_address_object.province===''  && is_tip === true )} " class="global_input_default_style defalut_input "  v-model="processed_address_object.province"   /></td>
                 <td>    城市：<input :class="{'input_tip':(processed_address_object.city===''  && is_tip === true )} " class="global_input_default_style defalut_input "  v-model="processed_address_object.city"  /></td>
                 <td>   地区：<input   class="global_input_default_style defalut_input "  v-model="processed_address_object.area" /></td>
              </tr>

            </table>
           <div class="detailed_address_div">
                <label style="display: block">详细地址</label>
               <textarea  :class="{'input_tip':(processed_address_object.address_detail===''  && is_tip === true )} "   v-model="processed_address_object.address_detail" ></textarea>

            </div>
          <div >

                 <div style=" text-align: left;margin-top: 0.4em">
                   <textarea placeholder="
       把地址粘贴到此处进行识别，也可以把商品跟地址一起粘贴到此处智能势识别

                    下面为格式样例：
                    女人街 3F 324 889 60 黑色2xl 1
                    金富丽 4F 4F057-114-39  白色均码 1
                    熊**，86-15808*****，四川省 南充市 高坪区 清溪街道 **路3小区" class="global_input_default_style defalut_input auto_address_input" v-text="raw_address" v-model="raw_address"></textarea>
                  <button class = "default_button global_btn_normal_style" @click="onAddAddressClick">智能识别</button>
                </div>
                <div><button class = "match_btn" @click="onAddOrderOk">确认添加</button></div>

           </div>
      </div>
    </div>



    <div style="margin-top: 2em;margin-bottom: 2em">
                <p style="color: red" v-if="logistics_discount_card!==null">{{discount_card_type_choise[logistics_discount_card.discount_card_type] }}   {{logistics_discount_card.discount}}元  有效期至：{{time_format(logistics_discount_card.expire_time)}}</p>
                <select class="logistic_select" v-model="selected_logistics">
                  <option :value="option" v-for="(option,index) in logistics_options" :key="index">{{option.logistics_name}}</option>
                </select>
                <label v-if="logistics_discount_card!==null" style="margin-left: 0.5em">{{selected_logistics.logistics_price}} - {{logistics_discount_card.discount}} ={{selected_logistics.logistics_price - logistics_discount_card.discount}}元</label>
                <label v-else style="margin-left: 0.5em">{{selected_logistics.logistics_price}}  </label>
                <select class="logistic_select" v-model="selected_quality_test">
                  <option :value="option" v-for="(option,index) in quality_test_options" :key="index">{{option.quality_testing_name}}</option>
                </select>
              <label style="margin-left: 0.5em">{{selected_quality_test.quality_testing_price}}  </label>
    </div>
        <div style="margin-top: 2em;margin-bottom: 2em">
              <div style="cursor:pointer;background: darkgrey;width:10em;margin: 0 auto" @click="on_multi_add_div_clicked" >
                 <label style="cursor:pointer; " >批量添加订单</label><label v-if="is_multi_add">▼</label><label v-if="!is_multi_add">▲</label>
              </div>
    </div>

    <div class="mul_add_div"  style="display: block" v-if="is_multi_add" >
                  <div style="margin: 0.5em" ><label style="background: darkgrey; width: 200px ;padding: 0.4em" >批量添加订单</label></div>

                  <div style="text-align: left; font-size: 0.6em;padding-top: 0.5em;padding-left: 0.5em">

                    <li>市场名 楼层 档口号 货号 价格 颜色尺码 件数    <label style="color: red">商品1</label></li>
                    <li>市场名 楼层 档口号 货号 价格 颜色尺码 件数    <label style="color: red">商品2</label></li>
                    <li> 熊**，86-15808*****，四川省 南充市 高坪区 清溪街道 **路3小区 ，000000； <label style="color: red">（注：每个地址用"；"结束）</label></li>

                  </div>
                <textarea v-model="order_text"   id="order_text" placeholder="
            女人街 3F 324 889 60 黑色2xl 1
            金富丽 4F 4F057-114-39  白色均码 1
            熊**，86-15808*****，四川省 南充市 高坪区 清溪街道 **路3小区 ，000000；

            大西豪_3F_320-A_#8185_59  黑色3xl 1
            小花，17808*****，广东省 广州市 天河区  ***街道 **路小区 ，000000；
"> </textarea>
                <button class="match_btn" @click="match_btn" style="display:block">批量添加</button>
            </div>

  </div>
   <div    style="font-size:1.5em; text-align: left">
      <label>共</label>
      <label style="color:red">{{order_obj.order_list.length}}</label>
      <label>件</label>
    </div>
   <div id="div-id"   >
      <li class = "items_li" v-for="(item,index) in order_obj['order_list']" >
       <div class="review_order_div" >
         <div class = "order_div global_background ">
            <label style="color:black">订单:{{index+1}}</label>
            <label   v-if="item.tb_order_number!==undefined && item.tb_order_number!==''" style="color:black;margin-left: 1em">淘宝订单号:{{item.tb_order_number}}</label>
            <label   v-if="item.return_message!==undefined && item.return_message!==''" style="color:red;margin-left: 1em"> {{item.return_message}}</label>
          <button style=" width:4em;height:2em;float: right; margin-right: 2em" @click="onDeleteRawGoods(index,order_obj['order_list'])">删除</button>
         </div>

         <table class = "market_table" style="margin-left: 3em">

                <tr>

                 <td>市场</td>
                 <td>楼层</td>
                 <td>档口</td>
                 <td>款号</td>
                 <td>价格</td>
                  <td>颜色尺码</td>
                 <td>件数</td>
            </tr>



            </table>

         <table class = "market_table" style="width: 100%" v-for="(goodsitem,index) in item.orderGoods " >
           <div>
                 <img style="width:2.5em; height: 2.5em;float: left" v-bind:src="goodsitem.image_url"/>
            <tr   >
                 <td><input  class="global_input_default_style defalut_input "   :class="{'input_tip':goodsitem.shop_market_name===''}" v-model="goodsitem.shop_market_name"/></td>
                 <td><input   class="global_input_default_style defalut_input " :class="{'input_tip':goodsitem.shop_floor===''}" v-model="goodsitem.shop_floor"/></td>
                 <td><input   class="global_input_default_style defalut_input " :class="{'input_tip':goodsitem.shop_stalls_no===''}" v-model="goodsitem.shop_stalls_no" /></td>
                 <td><input  class="global_input_default_style defalut_input "  :class="{'input_tip':goodsitem.art_no===''}" v-model="goodsitem.art_no"/></td>
                 <td><input  class="global_input_default_style defalut_input " :class="{'input_tip':goodsitem.goods_price===''}" type="number" v-model="goodsitem.goods_price"/></td>
                 <td><input  class="global_input_default_style defalut_input " :class="{'input_tip':goodsitem.goods_color===''}"    v-model="goodsitem.goods_color"/></td>
                 <td><input  class="global_input_default_style defalut_input " :class="{'input_tip':goodsitem.goods_count===''}" type="number"   v-model="goodsitem.goods_count"/> </td>
            </tr>
                <tr  v-if="my_account!==''" style="display: block; color:red">
                <!--<tr  v-if="my_account!=='' && user_id_is_in_list(my_account.id,allow_message_user_id_list)===true "style="display: block; color:red">-->
                      <label> </label><input style="color:red"  placeholder="留言" class="global_input_default_style defalut_input "      v-model="goodsitem.customer_message" />
              </tr>
           </div>

        </table>
       <div style="padding-top:5px">

            <table class="address">
              <tr>

             </tr>
              <tr >
                <td> 姓名：<input class="global_input_default_style defalut_input " :class="{'input_tip':item.address.name===''}"  v-model="item.address.name" /></td>
               <td>电话：<input class="global_input_default_style defalut_input " :class="{'input_tip':item.address.phone===''}"      v-model="item.address.phone"/></td>

                 <td>省份：<input  class="global_input_default_style defalut_input " :class="{'input_tip':item.address.province===''}"  v-model="item.address.province" /></td>
                 <td>城市：<input class="global_input_default_style defalut_input " :class="{'input_tip':item.address.city.trim()===''}"  v-model="item.address.city"/></td>
                 <td>地区：<input  class="global_input_default_style defalut_input "  v-model="item.address.area"/></td>
              </tr>

            </table>
        <div class="detailed_address_div">
          <textarea  class="global_input_default_style defalut_input" v-model="item.address.address_detail" ></textarea>

          <!--<label>详细地址：</label>-->

        </div>
        <div style="display: block;height: 3em">
          <label>快递：{{item.logistics.logistics_name}}</label>
          <div style="float: right;padding-right: 1em">
            <label style="display: block" >商品+运费+代拿费+质检费</label>
              <label style="color:red;">
              {{item.goodsTolPrice}} + {{item.postage_totals}}  + {{item.agencyFee_totals}} + {{item.quality_test_fee}}=
              {{item.goodsTolPrice*1.0 +item.postage_totals*1.0 + item.quality_test_fee*1.0 + item.agencyFee_totals*1.0}}元
              </label>
          </div>

        </div>
    </div>
    </div>

      </li>
   </div>
   <div   style="margin-top: 2em">
     <label style="font-weight: bold; color: red;margin-left: 3em">总价格：{{order_obj.allPrice}} 元</label></div>
     <button class="submit_btn" @click="submit" :disabled="submit_btn_disable" v-text="submit_btn"></button>
  </div>

</template>

<script>
    import  axios  from 'axios'
    import mStringUtils from "../../utils/mStringUtils.js"
    import pcommon_function from "../../utils/pcommon_function.js"
    import mGlobal from "../../utils/mGlobal"
    import marketData from "../../../static/marketData"
    import mtime from '../../utils/mtime.js';
     import router from '../../../src/router'
    export default {
        name: "PlaceOrder",
      created(){
             if(this.getLocalValue("user")!==''){
               this.my_account = JSON.parse(this.getLocalValue("user"))
             }else{
                router.replace("/pc/Login")
             }


             let p1 =this.load_quality_test()
             let p2 = this.load_logistics()
             let p3 =  this.load_discount_card()

             Promise.all([p1, p2, p3]).then((res) => {
               let my_tb_wait_send_order_cache =    window.localStorage.getItem("my_tb_wait_send_order_cache")
               console.log("windows拿到缓存订单数据：",my_tb_wait_send_order_cache)
           //     if(typeof(this.$route.query.plug_order_data) !== 'undefined'){
           //        this.analysis_tb_plug_order_data(this.$route.query.plug_order_data)
           //
           //        console.log('mount:',document.getElementById('div-id').offsetTop);
           //        window.scrollTo(0,document.getElementById('div-id').offsetTop);
           // }

                if(typeof(my_tb_wait_send_order_cache) !== 'undefined'){
                  this.analysis_tb_plug_order_data(my_tb_wait_send_order_cache)
                  window.localStorage.removeItem("my_tb_wait_send_order_cache")
                  console.log('mount:',document.getElementById('div-id').offsetTop);
                  window.scrollTo(0,document.getElementById('div-id').offsetTop);
           }
})

           // if(typeof(this.$route.query.data) !== 'undefined'){
           //    let goods =  JSON.parse(this.$route.query.data);
           //    this.raw_goods_txt = goods.shop_market_name + "_" + goods.shop_floor + "_" + goods.shop_stalls_no +"_" + goods.art_no+"_"+goods.goods_price+"_"
           //                  +goods.goods_color+"/1@"
           // }

      },
      mounted(){

      },

      data(){
        return{
            art_no_auto_search_ul_is_show:false,
            goods_str_format_selected:{'text':'市场名_楼层_档口号_货号_价格_颜色尺码_件数(用空格 逗号 下划线 隔开)','value':'default',"abbreviate":"默认"},
            goods_str_format_options:[
             {'text':'市场名_楼层_档口号_货号_价格_颜色尺码_件数(用空格 逗号 下划线 隔开)','value':'default',"abbreviate":"默认"},
             {'text':'市场名_楼层_档口号_价格_货号_颜色尺码_件数(用空格 逗号 下划线 隔开)','value':'vvic',"abbreviate":'搜款网格式'},

           ],
            allow_message_user_id_list : [1,12,20],
            my_account:"",
          // 显示批量添加
          is_multi_add:false,
          //开始用户添加未处理的数据
          discount_card_type_choise:mGlobal.DISCOUNT_CARD_TYPE,
          raw_goods_txt:"",
          raw_address:"",
          //处理后的地址对象
          processed_address_object:{

          },
          is_tip: false,
          processed_goods_list:[
            {
              "shop_market_name":"",
              "shop_floor":"",
              "shop_stalls_no":"",
              "art_no":"",
              "goods_color":"",
              "goods_price":"",
              "goods_count":"",


            }

          ],
          submit_btn :"提交",
          submit_btn_disable: false,
          order_text:"",
          selected_logistics:"",
          selected_quality_test:"",
          logistics_options:[],
          quality_test_options:[],
          //物流优惠卡
          logistics_discount_card :null,
          order_obj: {
            order_list: [],
          }
      }
    },

      watch:{
          selected_logistics:function(newValue, oldValue){
          this.calcAgainAllAmount(this.order_obj.order_list)
        },


　      　'order_obj.order_list': {
          deep: true,
　　　　  handler(new_order_list, old_order_list) {
                this.calcAgainAllAmount(new_order_list)
　　　　},
     }},
      methods:{
        // 货号自动搜索框聚焦
        art_no_input_focus(){
            console.log("art_no_input_focus")
          this.art_no_auto_search_ul_is_show = true
        },
        // 货号自动搜索框失焦
        art_no_input_blur(){
          console.log("art_no_input_blur")
          this.art_no_auto_search_ul_is_show = false
        },
        art_no_ul_focus(){
          console.log("art_no_ul_focus")
          this.art_no_auto_search_ul_is_show = true
        },

        art_no_ul_blur(){
          console.log("art_no_ul_blur")
          this.art_no_auto_search_ul_is_show = false
        },
       user_id_is_in_list(id,list){
         for(let i = 0;i<list.length;i++){
           if(id===list[i]){
             return true
           }
         }
         return false
       },
       time_format(time_stmp){
         return mtime.formatDateStrFromTimeSt(time_stmp)
        },
       on_multi_add_div_clicked(){
            this.is_multi_add = ! this.is_multi_add
          },


         //解析淘宝插件传 过来的数据
       analysis_tb_plug_order_data(tb_plug_order_data){
                     // tb_plug_order_data = "[{\"tb_order_number\":\"795556705506266015\",\"phone\":\"13123940906\",\"name\":\"水影\",\"address\":\"安徽省阜阳市临泉县 陈集镇   安徽省阜阳市临泉县陈集镇农村淘宝服务站\",\"order_goods_list\":[{\"code\":\"金富丽 3F 3F030-52#9323\",\"img\":\"//img.alicdn.com/bao/uploaded/i3/467630318/O1CN01VlxsyO1EDgWOFxIt8_!!467630318.jpg_sum.jpg\",\"size\":\"4XL(140-160斤)\",\"color\":\"黑色\",\"count\":\"1\"}]}]"
               console.log("plug_order_data==================1--->",tb_plug_order_data)
                let plug_order_data = JSON.parse(tb_plug_order_data )
                console.log("plug_order_data==================2--->",plug_order_data)
               for(let i = 0;i<plug_order_data.length;i++){

                  let address_str = plug_order_data[i]['name']+","+ plug_order_data[i]['phone']+ ","+plug_order_data[i].address
                  let tb_order_number = plug_order_data[i]['tb_order_number']
                  let wangwang_id = plug_order_data[i]['wangwang_id']

                  let addressObj = mStringUtils.getAddressInfo(address_str,plug_order_data[i]['name'],plug_order_data[i]['phone'],plug_order_data[i]['province'],plug_order_data[i]['city'],plug_order_data[i]['area'],plug_order_data[i]['address_details']);
                  console.log("解析后的地址对象：",addressObj)
                  let order_goods_list = []


                  for(let g = 0 ;g<plug_order_data[i].order_goods_list.length;g++){
                    plug_order_data[i].order_goods_list[g]['code'] = plug_order_data[i].order_goods_list[g].code.replace("^^^","#")
                    let color = plug_order_data[i].order_goods_list[g].color.replace("-",'^').replace("/","^").replace(" ","").trim()
                    let size = ""

                    if(plug_order_data[i].order_goods_list[g].size !==undefined){
                      size = plug_order_data[i].order_goods_list[g].size.replace("-",'^').replace("/","^").replace(" ","").trim()
                    }

                    let goods_str =  plug_order_data[i].order_goods_list[g].code +" "+color+size+" "+plug_order_data[i].order_goods_list[g].count
                    console.log("goods_str------",goods_str)
                    console.log("商品图片",plug_order_data[i].order_goods_list[g].img)
                    // 用搜款网格式解析
                    let return_list =  marketData.get_goods_list(goods_str,this.goods_str_format_options[1].value)
                    if(return_list.length === 1){
                      let goods_img = plug_order_data[i].order_goods_list[g].img
                      let tb_goods_id = plug_order_data[i].order_goods_list[g].tb_goods_id
                      let user_code = plug_order_data[i].order_goods_list[g].user_code
                      if(goods_img!==undefined && goods_img !== ""){
                         return_list[0]["image_url"] = "https:"+goods_img.replace("https:","")
                      }
                      if(tb_goods_id!==undefined && tb_goods_id !== ""){
                         return_list[0]["tb_goods_id"] = tb_goods_id
                      }
                      if(user_code!==undefined && user_code !== ""){
                         return_list[0]["user_code"] = user_code
                      }

                    }
                    order_goods_list =order_goods_list.concat(return_list )

                 }
                  let orderItem = {"quality_test":this.selected_quality_test,"logistics":this.selected_logistics,"address":addressObj,"orderGoods":order_goods_list};
                 if(tb_order_number !== undefined && tb_order_number.trim() !==""){
                   orderItem['tb_order_number']=tb_order_number

                 }
                 if(wangwang_id !== undefined && wangwang_id.trim() !==""){
                   orderItem['wangwang_id']=wangwang_id

                 }
                 if(orderItem['remarks_text']!==undefined && orderItem['remarks_text'] !==""){
                    orderItem['remarks_type']="红"

                 }


                  console.log("orderItem-------------------------------------------",orderItem)
                  this.order_obj.order_list.unshift(orderItem);
               }
         },
         // 加载用户优惠卡信息
       load_discount_card(){
           const url  = this.mGLOBAL.DJANGO_SERVER_BASE_URL+"/user/userDiscountCards/"
           //设为true 就会带cookies 访问
           axios.defaults.withCredentials=true
            // axios.get(url,).then((res)=>{
            //  if("1000" === res.data.code){
            //      console.log(res.data)
            //    for(let i = 0;i<res.data.data.length;i++){
            //      let discount_card =res.data.data[i]
            //      if (discount_card.discount_card_type === mGlobal.DISCOUNT_CARD_TYPE2['物流金额优惠卡']){
            //        this.logistics_discount_card = discount_card
            //        break;
            //      }
            //    }
            //
            //  }else{
            //
            //  }
            //   }).catch(error => {
            //     console.log(error) ;
            //
            //   })
          let p1 = new Promise((resolve, reject) => {
           axios.get(url).then(res=>{
             if("1000" === res.data.code){
                 console.log(res.data)
               for(let i = 0;i<res.data.results.length;i++){
                 let discount_card =res.data.results[i]
                 if (discount_card.discount_card_type === mGlobal.DISCOUNT_CARD_TYPE2['物流金额优惠卡']){
                   this.logistics_discount_card = discount_card
                   break;
                 }
               }

             }else{

             }
              resolve(res)
          }).catch(err=>{
            console.log(err) ;
              reject(err)
          })
      });

           return p1
         },
           // 加载物流选项信息
       load_logistics(){
            const url  = this.mGLOBAL.DJANGO_SERVER_BASE_URL+"/trade/logistics/"
           //设为true 就会带cookies 访问
            axios.defaults.withCredentials=true


           let p1 = new Promise((resolve, reject) => {
           axios.get(url).then(res=>{
             if("1000" === res.data.code){
                 console.log(res.data)
                  this.logistics_options = this.analysis_logistics(res.data.data)
                  this.selected_logistics =  this.logistics_options[0]

             }else{

             }
              resolve(res)
          }).catch(err=>{
            console.log(err) ;
              reject(err)
          })
      });

           return p1
          },

          // 加载质检选项信息
       load_quality_test(){
            const url  = this.mGLOBAL.DJANGO_SERVER_BASE_URL+"/trade/qualityTest/"
           //设为true 就会带cookies 访问
            axios.defaults.withCredentials=true
            // axios.get(url,).then((res)=>{
            //  if("1000" === res.data.code){
            //       console.log(res.data)
            //       this.quality_test_options = this.analysis_quality_test_data(res.data.data)
            //
            //       let user_info = this.getLocalValue("user");
            //       console.log("create----------------",user_info)
            //       if(user_info !==""){
            //       this.user = JSON.parse(user_info)
            //      }
            //      for(let i = 0;i< this.quality_test_options.length;i++){
            //        if(this.user.id === 12){
            //          if( this.quality_test_options[i].quality_testing_name === '精检2'){
            //            this.quality_test_options.splice(i,1)
            //          }
            //        }else  {
            //           if( this.quality_test_options[i].quality_testing_name === '精检'){
            //            this.quality_test_options.splice(i,1)
            //          }
            //        }
            //      }
            //       this.selected_quality_test =  this.quality_test_options[0]
            //
            //  }else{
            //
            //  }
            //   }).catch(error => {
            //     console.log(error) ;
            //
            //   })

           let p1 = new Promise((resolve, reject) => {
           axios.get(url).then(res=>{
               if("1000" === res.data.code){
                  console.log(res.data)
                  this.quality_test_options = this.analysis_quality_test_data(res.data.data)

                  let user_info = this.getLocalValue("user");
                  console.log("create----------------",user_info)
                  if(user_info !==""){
                  this.user = JSON.parse(user_info)
                 }
                 for(let i = 0;i< this.quality_test_options.length;i++){
                   if(this.user !== null && this.user.id === 12){
                     if( this.quality_test_options[i].quality_testing_name === '精检2'){
                       this.quality_test_options.splice(i,1)
                     }
                   }else  {
                      if( this.quality_test_options[i].quality_testing_name === '精检'){
                       this.quality_test_options.splice(i,1)
                     }
                   }
                 }
                  this.selected_quality_test =  this.quality_test_options[0]

             }else{

             }
              resolve(res)
          }).catch(err=>{
              console.log(err) ;
              reject(err)
          })
      });

           return p1

          },

         // 解析 数据
       analysis_logistics(data){
            let logistics_list = []
            for(let i = 0;i<data.length;i++){
              let item = {}
              item["logistics_name"] = data[i].logistics_name
              item["logistics_price"] = data[i].logistics_price
              item["logistics_id"] = data[i].id
              logistics_list.push(item)
            }
            return logistics_list
          },


         // 解析 数据
       analysis_quality_test_data(data){
            let quality_test_server_list = []
            for(let i = 0;i<data.length;i++){
              let item = {}
              item["quality_testing_name"] = data[i].quality_testing_name
              item["quality_testing_price"] = data[i].quality_testing_price
              quality_test_server_list.push(item)
            }
            return quality_test_server_list
          },
         // 判断列表最后一组是否为有效数据  有空 等情况 为无效数据
       is_last_order_goods_item_valid(order_goods_list){
            if(order_goods_list.length>0){
               let item = order_goods_list[order_goods_list.length-1]
               if(this.checkGoodsIsNull(item)){
                 return false;
               }else{
                 return true;
               }
            }

          },
          onDeleteRawGoods(index,list){
            list.splice(index,1)
          },
       onHandAddGoodsClick(){
            this.is_tip = false;
            this.processed_goods_list.push( {
              "shop_market_name":"",
              "shop_floor":"",
              "shop_stalls_no":"",
              "art_no":"",
              "goods_color":"",
              "goods_price":"",
              "goods_count":"",

            })
         },
       onAddGoodsClick(){
            // let goodsObj = this.analysis_goods_str(this.raw_goods_txt)
            let goods_list = marketData.get_goods_list(this.raw_goods_txt,this.goods_str_format_selected.value)


            if(this.is_last_order_goods_item_valid(this.processed_goods_list) === false){
              let index = this.processed_goods_list.length - 1;
              this.processed_goods_list.splice(index,1)
            }
            this.processed_goods_list = this.processed_goods_list.concat(goods_list);
          //   //只有一个默认的数据就删除
          //   if(this.processed_goods_list.length===1 &&  this.processed_goods_list[0].shop_market_name.trim()===""){
          //     this.processed_goods_list.splice(0,1)
          //   }
          //   this.processed_goods_list = this.processed_goods_list.concat(goods_list)
          },

       onAddOrderOk(){

            this.is_tip = true;
             let logistics = this.selected_logistics;
             let orderItem = {"quality_test":this.selected_quality_test,"logistics":logistics,"address":this.processed_address_object,"orderGoods":this.processed_goods_list};
              let arr = [];
              arr.push(orderItem)
             if(this.check_data(arr)){
               this.order_obj.order_list.unshift(orderItem);

               this.is_tip = false;
                this.raw_goods_txt="";
                this.raw_address="";
               this.processed_address_object={};
               this.processed_goods_list =
                 [
                      {
                        "shop_market_name":"",
                        "shop_floor":"",
                        "shop_stalls_no":"",
                        "art_no":"",
                        "goods_color":"",
                        "goods_price":"",
                        "goods_count":"",

                      }]
               alert("添加成功")
            }

          },
       onAddAddressClick(){
            let order_list = [];
           let str= this.raw_address;
          // 替换掉英文引号
          while(str.match(";")){
             str = str.replace(";","；")
          }
          while(str.match("　")){
             str = str.replace("　","，")
          }
          str = str.trim()
          //一个分号结束代表一个订单
          let orderList=str.split('；');
          for(let i = 0;i< orderList.length;i++){
             orderList[i] = orderList[i].trim();
            console.log(orderList[i])
            if(orderList[i] ===""){
              continue;
            }

            let orderItem = this.analysis_address_goods(orderList[i]);

            order_list.push(orderItem)
          }

            // let orderObj = {"logistics":logistics,"address":addressObj,"orderGoods":goods_list};
            if(order_list[0].orderGoods !==null && order_list[0].orderGoods.length>0){
              let is_pass = true;
              for(let i = 0;i<order_list[0].orderGoods.length;i++){
                if(this.checkGoodsIsNull(order_list[0].orderGoods[i])){
                 is_pass = false;
              }
              }
              if(is_pass){
                this.processed_goods_list = order_list[0].orderGoods;
              }

            }

           this.processed_address_object = order_list[0].address;
          },

          //重新统计金额
       calcAgainAllAmount(new_order_list){
            for(let i = 0;i<new_order_list.length;i++){
           // 统计每单的金额
              this.calcOneOrderAmount(new_order_list[i]);
            }
              this.calcAllOrderAmount(new_order_list);
          },

          //检查页面上商品参数是否正确
          checkGoodsIsNull(goodsObj){
            console.log(goodsObj)
            if(goodsObj.shop_market_name == null || !goodsObj.shop_market_name.length){
                                return  true;
            }
            if(goodsObj.shop_floor == null || !goodsObj.shop_floor.length){
                return  true;
            }
            if(goodsObj.shop_stalls_no == null || !goodsObj.shop_stalls_no.length){
                return  true;
            }
            if(goodsObj.art_no == null || !goodsObj.art_no.length){
                return  true;
            }
            if(goodsObj.goods_price == null || !goodsObj.goods_price.length){
                return  true;
            }
            if(goodsObj.goods_color == null || !goodsObj.goods_color.length){
                 return  true;
            }
            if(goodsObj.goods_count == null || !goodsObj.goods_count.length){
                return  true;
            }

            // let key_arr = Object.keys(goodsObj);
            // for(let x = 0;x<key_arr.length;x++) {
            //   console.log( key_arr[x])
            //   let eValue = eval('goodsObj.' + key_arr[x]).trim();//根据对象属性名得到值
            //   if (eValue == null || !eValue.length) {
            //     alert('goodsObj.' + key_arr[x])
            //     return  true;
            //   }
            // }
            return false
          },
         //
          check_data(order_list){

            for(let i=0;i<order_list.length;i++){

              for(let z = 0; z< order_list[i].orderGoods.length;z++){
                    if(this.checkGoodsIsNull(order_list[i].orderGoods[z])){
                       let tem_nul = i+1;
                      alert("第"+tem_nul+"条订单商品详情不能为空")
                      return false
                    }
              }
                let arr = Object.keys(order_list[i].address);
              if (arr.length===0){

                 alert("第地址不能有空")
                return;
              }

              for(let x = 0;x<arr.length;x++){
                console.log(arr[x])
                 let eValue=eval('order_list[i].address.'+arr[x]);//根据对象属性名得到值
                 if(arr[x] === 'area'){
                   continue
                 }

                if(eValue == null || !eValue.length){
                   let tem_nul = i+1
                    alert("第"+tem_nul+"条订单收件人信息不全")
                  return false
                }
              }
            }
            return true;
          },
         // 提交数据到服务器
         submit(){

           if(this.order_obj.order_list.length === 0){
             return;
           }
           if(this.check_data(this.order_obj["order_list"]) === false){
             return;
           }
           let news_list = [];
           let order_list = this.order_obj["order_list"]
           console.log("order_list",order_list)
            for(let i = 0;i<order_list.length;i++){
                let consignee_address = order_list[i].address.province+","+
                          order_list[i].address.city+","+
                          order_list[i].address.area+","+
                          order_list[i].address.address_detail+",";
                let consignee_name =order_list[i].address.name;
                let consignee_phone =order_list[i].address.phone;
                let tb_order_number =order_list[i].tb_order_number;
                let remarks_type =order_list[i].remarks_type;
                let remarks_text =order_list[i].remarks_text;
                let wangwang_id =order_list[i].wangwang_id;

                let orderGoods = order_list[i].orderGoods;
                news_list.push(
                  {
                    "remarks_text":remarks_text,
                    "remarks_type":remarks_type,
                    "tb_order_number":tb_order_number,
                    "wangwang_id":wangwang_id,
                    "consignee_address":consignee_address,"consignee_name":consignee_name,'logistics_name':order_list[i].logistics.logistics_name,
                    'logistics_id':order_list[i].logistics.logistics_id,
                   "consignee_phone":consignee_phone,"orderGoods":orderGoods,"quality_testing_name":order_list[i].quality_test.quality_testing_name
                })
            }
            console.log("news_list:",news_list)
            let jsonStr = JSON.stringify(news_list);
            this.postToServer(jsonStr);
         },

         postToServer(data){
          console.log("data:",data)
           const url  = this.mGLOBAL.DJANGO_SERVER_BASE_URL+"/user/addOrders/"
           //设为true 就会带cookies 访问
           axios.defaults.withCredentials=true
          this.submit_btn = "正在提交...."
          this.submit_btn_disable = true;

        axios.post(url,{
            "order_list":data
          }

        ).then((res)=>{
         if("1000" === res.data.code){

           if(res.data.exception_order_list !== undefined){

               let exception_order_list=  JSON.parse(res.data.exception_order_list)
               let new_exception_order_list = []
             for(let e = 0;e<exception_order_list.length;e++){
              let addressObj = mStringUtils.getAddressInfo(exception_order_list[e].consignee_name +" "+  exception_order_list[e].consignee_phone+" "+exception_order_list[e].consignee_address);
              //str.replace(/word/g,"Excel") ;//g 的意义是：执行全局匹配（查找所有匹配而不是在找到第一个匹配后停止）。
              addressObj.address_detail = addressObj.address_detail.replace(/,/g,' ').trim()

               let logistics = {"logistics_name":exception_order_list[e]['logistics_name'],"logistics_id":exception_order_list[e]['logistics_id']}
               for(let l = 0;l<this.logistics_options.length;l++){
                if(this.logistics_options[l].logistics_id === exception_order_list[e].logistics_id){
                  logistics = this.logistics_options[l]
                  break
                }
              }
              let quality_test = {}
              for(let q = 0;q<this.quality_test_options.length;q++){
                if(this.quality_test_options[q].quality_testing_name === exception_order_list[e].quality_testing_name){
                  quality_test = this.quality_test_options[q]
                  break
                }
              }
              let order_item  = {'address':addressObj,'logistics':logistics,"quality_test":quality_test,"orderGoods":exception_order_list[e].orderGoods,"phone":exception_order_list[e].consignee_phone,"name":exception_order_list[e].consignee_name}
              if(exception_order_list[e].tb_order_number !== undefined){
                order_item['tb_order_number'] = exception_order_list[e].tb_order_number
              }
              if(exception_order_list[e].return_message !== undefined){
                order_item['return_message'] = exception_order_list[e].return_message
              }
              new_exception_order_list.push(order_item)

             }
             this.order_obj.order_list = new_exception_order_list
           }else{
             alert("提交成功！")
             this.order_obj.order_list = []
           }


           this.order_text = ""

         }else{
           this.$toast("提交失败")
         }
          this.submit_btn_disable = false;
          this.submit_btn = "提交"
        }).catch(error => {
          console.log(error) ;
          this.submit_btn_disable = false;
            this.submit_btn = "提交"
             alert("提交失败")
        })
         },

         //拆分 商品 跟地址  对象形式数据返回
         analysis_address_goods:function(orderStr){
            // 市场名_楼层_店铺位置_货号_颜色/尺码_价格_件数/
            // 市场名_楼层_店铺位置_货号_颜色/尺码_价格_件数/
            // 熊**，86-15808*****，四川省 南充市 高坪区 清溪街道 **路3小区 ，000000；
           //分割出商品跟地址  tem_index 为商品跟地址的分割线


              orderStr = mStringUtils.replace_redundance_str(orderStr)
              let goods_address = this.split_goods_address_str(orderStr);

              if(goods_address[0]=== "" || goods_address[1]=== "" ){
                 let tem_index =  orderStr.lastIndexOf("@");
                 goods_address[0] = orderStr.substring(0,tem_index);
                 goods_address[1] = orderStr.substring(tem_index+1,orderStr.length);
              }



              //拆分收货地址
              let address_str  = goods_address[1];
              let addressObj = mStringUtils.getAddressInfo(address_str);
              let logistics = this.selected_logistics;
              let goods_str  = goods_address[0];

              let goods_list = marketData.get_goods_list(goods_str);


              let orderObj = {"quality_test":this.selected_quality_test,"logistics":logistics,"address":addressObj,"orderGoods":goods_list};
             return orderObj
         },

          // 分割商品跟地址
          split_goods_address_str(orderStr){
            let goods_str = "";
            let address_str = "";
            let phone_index = orderStr.search(/\d{11}/ig);
              if(phone_index !== -1){
                 goods_str = orderStr.substring(0,phone_index);
                 let reg = /[, /]{2}|[， /]{2}/;//“， /”三个字符出现两个 不分顺序
                 while(goods_str.match(reg)){
                   let result =  goods_str.match(reg);
                  goods_str = goods_str.replace(result[0],"，")
                 }

               let index =  this.get_index_for_special_chars(["，"," ","@","/"],goods_str);
               if(index !== -1){
                 goods_str = goods_str.substring(0,index);
                 index = this.get_index_for_special_chars(["，"," ","@","/"],goods_str);
                 goods_str = goods_str.substring(0,index).trim();
                 address_str = orderStr.substring(index+1,orderStr.length);
               }
              }

              return [goods_str,address_str];
          },

         get_index_for_special_chars(chars,str){
           for(let i = str.length;i--; i> -1){
                for(let c = 0 ;c<chars.length;c++){
                if(str[i] === chars[c] ){
                  return i;
                }
            }
           }

            return -1;
         },

         //分析一个地址
         analysis_address_str(address_str){
                while(address_str.match(",")){
               address_str =  address_str.replace(",","，");
              }
             let indexof2 = this.find_index(address_str,'，',2)
              let name_phone_str = address_str.substring(0,indexof2);
              let logictis_address_str = address_str.substring(indexof2+1,address_str.length)

              while(logictis_address_str.match("  ")){
               logictis_address_str =  logictis_address_str.replace("  "," ");
              }
              let name  = name_phone_str.split("，")[0]
              let phone  = name_phone_str.split("，")[1].replace("86-","").trim();
              //不是数字就设为空
                   phone = isNaN(phone)?"":phone;
              let province  = logictis_address_str.split(" ")[0];
              let city  = logictis_address_str.split(" ")[1];
              let area  = logictis_address_str.split(" ")[2];
              let address_detail  = logictis_address_str.split(" ")[3];
              let addressObj  =  {"phone":phone,"name":name,"province":province, "city":city,"area":area,"address_detail":address_detail}
              return addressObj
         },

         //分析一个商品的字符串
         analysis_goods_str(goods_str){
            let detailObj = {}
                   let goodsDetials_arr = goods_str.trim().split("_")
                   //var arr = str.match(/\d+(.\d+)?/
                // 数量 价格 字符串里匹配
                   let goods_price_arr = goodsDetials_arr[4].match(/\d+\.?\d*/g);
                   let goods_count_arr = goodsDetials_arr[6].match(/\d+\.?\d*/g);
                   if(goods_price_arr!== null ){
                     goods_price_arr = goods_price_arr[0];
                   }else{
                     goods_price_arr  = ""
                   }
                   if(goods_count_arr !== null){
                     goods_count_arr = goods_count_arr[0];
                   }else{
                     goods_count_arr = ""
                   }

                   detailObj = {
                              "shop_market_name":typeof (goodsDetials_arr[0])!=="undifiend"?goodsDetials_arr[0].trim():"",
                              "shop_floor":typeof (goodsDetials_arr[1])!=="undifiend"?goodsDetials_arr[1].trim():"",
                              "shop_stalls_no":typeof (goodsDetials_arr[2])!=="undifiend"?goodsDetials_arr[2].trim():"",
                              "art_no":typeof (goodsDetials_arr[3])!=="undifiend"?goodsDetials_arr[3].trim():"",
                              "goods_color":typeof (goodsDetials_arr[5])!=="undifiend"?goodsDetials_arr[4].trim():"",
                                //价格数量必须是数字  不是的话就复制为空字符串
                              "goods_price":(isNaN(goods_price_arr)?"":goods_price_arr),
                              "goods_count":(isNaN(goods_count_arr)?"":goods_count_arr),
                         }
                   return detailObj;
         },

          //计算一个订单的商品价格
         calcOneOrderAmount(orderItem){
                //计算商品价格
                  let goodsTolPrice = 0;
                  for(let p = 0;p<orderItem.orderGoods.length;p++){
                    goodsTolPrice = goodsTolPrice + orderItem.orderGoods[p ].goods_price * orderItem.orderGoods[p].goods_count;
                  }
                  orderItem['goodsTolPrice'] = goodsTolPrice;
                  let order_goods_counts = 0;
                  for(let g = 0;g<orderItem.orderGoods.length ;g++){
                    order_goods_counts = orderItem.orderGoods[g].goods_count*1.0 + order_goods_counts
                  }
                  orderItem['agencyFee_totals'] = order_goods_counts * mGlobal.SERVER_FEE;
                  //  优惠金额
                  let discount_amount = 0
                  let cur_time_stmp = new Date().getTime()
                  if(this.logistics_discount_card !==null && this.logistics_discount_card.discount_card_type === mGlobal.DISCOUNT_CARD_TYPE2['物流金额优惠卡'] &&  this.logistics_discount_card.expire_time > cur_time_stmp){
                        discount_amount  = this.logistics_discount_card.discount
                    }
                  console.log("discount_amount",discount_amount)
                  if(order_goods_counts< 3){
                        orderItem['postage_totals'] =orderItem.logistics.logistics_price - discount_amount;
                  }else{
                    orderItem['postage_totals'] =orderItem.logistics.logistics_price*1.0 - discount_amount + (order_goods_counts - 2)*3;
                  }
                  orderItem['quality_test_fee'] = orderItem.quality_test.quality_testing_price * order_goods_counts


         },
         calcAllOrderAmount(orderList){
           let allPrice = 0;
             for(let i = 0;i<orderList.length;i++){
                let sum = orderList[i].goodsTolPrice*1.0 + orderList[i].agencyFee_totals*1.0 +  orderList[i].postage_totals*1.0 +orderList[i].quality_test_fee *1.0
                allPrice = allPrice + sum;
             }
             this.order_obj.allPrice = allPrice;
         },

        match_btn(){
           this.order_obj = {
             order_list : [],
             allPrice:0
           }
            let order_list = this.order_obj["order_list"]

           let str=this.order_text;
          // 替换掉英文引号
          while(str.match(";")){
             str = str.replace(";","；")
          }
          str = str.trim()
          //一个分号结束代表一个订单
          let orderList=str.split('；');
          for(let i = 0;i< orderList.length;i++){
            orderList[i] = orderList[i].trim();
            if(orderList[i] ==="")
                continue;
                let orderItem = this.analysis_address_goods(orderList[i]);
                order_list.push(orderItem)
          }


          // 统计每个订单的价格
          for(let i = 0;i<order_list.length;i++){
            this.calcOneOrderAmount(order_list[i])
          }

            // 计算所有订单加起来的金额
         this.calcAllOrderAmount(orderList);

         let jsonStr = JSON.stringify( this.order_obj);

        },

        // 查找字符cha第n次出现第索引
         find_index:function(str,cha,n){
          let index=str.indexOf(cha);
          for(let i=1; i < n;i++){
           index=str.indexOf(cha,index+1);
           }
          return index;
         }
        }
    }

</script>

<style lang="less" scoped>
@import "../../../static/css/PGLOBALCSS.css";
@import "../../../static/css/PGLOBALLESS.less";
.default_button{
  padding: 0.5em;
  margin-bottom: 0.5em;
  margin-top: 0.5em;
  font-size: 1em;
}
.defalut_input{
  height: 2em;

}

.auto_goods_input{
  width:50%;
  height: 1.8em;
}
.auto_address_input{
  width:70%;
  height: 10em;
}
  .input_tip{
    border-style: solid;
    border-width: 1px;
    border-color: red;
  }
.root{
  margin:0 auto;
  text-align: center;
  margin: 0 auto;
  width: 100%;

}
.root li{
   list-style: none;
}

.tip_img{
  width: 900px;
}
.submit_btn{
  width: auto;
  height: 2em;
  padding-left: 0.5em;
  padding-right: 0.5em;
  margin: 3em auto;
  color: #fff;
  border-radius: 4px;
  font-size: 1.2em;
  background: #3bb4f2;
  border-color: #3bb4f2;
}
.logistic_select{
  width: 10em;
  height: 2em;
}
.items_li{
  list-style: none;
}
.address{
  width: 95%;

}
.address tr{
  width: 100%;
}
.address td{
  width: 18%;
  max-width: 8em;
  padding-left: 1%;

}

.address input{
  width:100%;

}



.orders_str_div{
  width: 100%;
  height: auto;
    margin: 0 auto;

}
  .match_btn{
    width: 6em;
    height: 2em;
    margin: 5px auto;
    color: #fff;
    border-radius: 4px;
    font-size: 1.2em;
    background: #3bb4f2;
    border-color: #3bb4f2;
  }
  .mul_add_div{
    width:100%;background: #f0f0f0; border: solid 1px #a9a9a9;
    padding-top: 0.5em;
  }
  .detailed_address_div{
    text-align: left;
    padding-top: 0.5em;
  }
  .detailed_address_div textarea{
    width: 70%;
    height: 6em;
  }

.review_order_div{
  border: darkgrey solid 1px;
  display: block;
  width:auto;
  height: auto;
  background: #f0f0f0;
  margin-bottom: 1em;


}

#order_text{

    padding: 0px;
    width: 100%;
    height: 200px;
    margin:0 auto
  }

.market_table {
   width: 100%;
   text-align: left;
}
.market_table tr {
   width: 100%;
   text-align: left;
}
 .market_table td{
    width: 12%;
    height: 1.5em;

  }
  .market_table td  input{
    width :95%;
    height: 1.5em;

  }
.order_div{
  text-align: left;
  width: 100%;
  display: inline-block;
  padding-top: 0.5em;
  padding-bottom: 0.5em;
}
  .huohaolist {left: 0; z-index: 999; background-color: #fff; top: 25px; width: 500px; height: auto; max-height: 150px; overflow-y: scroll; border: 1px solid #bbbbbb; }
  .huohaolist li { height: 20px; line-height: 20px; border-bottom: 1px dashed #efefef;text-align: left }
  .huohaolist li:hover { background-color: #1e90ff; color: #fff; }
</style>
