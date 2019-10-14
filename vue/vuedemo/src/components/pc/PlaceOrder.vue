<template>
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
            </tr>
            <tr v-for="(goodsitem,index) in processed_goods_list">
                 <td><input    :class="{'input_tip':(goodsitem.shop_market_name===''  && is_tip === true )}" v-model="goodsitem.shop_market_name" /></td>
                 <td><input    :class="{'input_tip':(goodsitem.shop_floor==='' && is_tip === true)}" v-model="goodsitem.shop_floor" /></td>
                 <td><input    :class="{'input_tip':goodsitem.shop_stalls_no==='' && is_tip === true }"  v-model="goodsitem.shop_stalls_no"/></td>
                 <td><input    :class="{'input_tip':goodsitem.art_no==='' && is_tip === true}" v-model="goodsitem.art_no"/></td>
                 <td><input    :class="{'input_tip':goodsitem.goods_price==='' && is_tip === true}"  v-model="goodsitem.goods_price" type="number" /></td>
                 <td><input    :class="{'input_tip':goodsitem.goods_color==='' && is_tip === true}" v-model="goodsitem.goods_color"/></td>
                 <td><input    :class="{'input_tip':goodsitem.goods_count==='' && is_tip === true}" v-model="goodsitem.goods_count" type="number" /> </td>
                  <td><button @click="onDeleteRawGoods(index,processed_goods_list)">删除</button></td>
            </tr>
            </table>
        </div>
      <button class = "default_button" @click="onHandAddGoodsClick">添加商品</button>
      <div>
            <table>
                    <tr>
                        <td><input placeholder="市场名_楼层_档口号_货号_价格_颜色尺码_件数" class = "defalut_input auto_goods_input" v-model="raw_goods_txt"/></td>
                        <td><button class = "default_button" @click="onAddGoodsClick">识别添加商品</button></td>
                    </tr>
                     <tr>

                       <td><label style="color: red" class = "defalut_input auto_goods_input" v-model="raw_goods_txt">市场名_楼层_档口号_货号_价格_颜色尺码_件数(用空格 逗号 下划线 隔开)</label></td>
                        <td></td>
                    </tr>

            </table>
        </div>
      <div style="padding-top: 3em">
           <table class="address">
             <tr >
                <td> 姓名：<input :class="{'input_tip':(processed_address_object.name===''  && is_tip === true )} " class = "defalut_input" v-model="processed_address_object.name" /></td>
               <td>电话：<input  :class="{'input_tip':(processed_address_object.phone===''  && is_tip === true )} " class = "defalut_input" v-model="processed_address_object.phone" type="number" oninput="if(value.length>11) value=value.slice(0,11)"    /></td>
             </tr>
           </table>
           <table class="address">

              <tr >
                 <td>   省份：<input type="text" :class="{'input_tip':(processed_address_object.province===''  && is_tip === true )} " class = "defalut_input" v-model="processed_address_object.province"   /></td>
                 <td>    城市：<input :class="{'input_tip':(processed_address_object.city===''  && is_tip === true )} " class = "defalut_input" v-model="processed_address_object.city"  /></td>
                 <td>   地区：<input   class = "defalut_input" v-model="processed_address_object.area" /></td>
              </tr>

            </table>
           <div class="detailed_address_div">
               <label>详细地址：</label>
               <textarea  :class="{'input_tip':(processed_address_object.address_detail===''  && is_tip === true )} "   v-model="processed_address_object.address_detail" ></textarea>
            </div>
          <div >
                 <label style="color:red; float: right"></label>
                 <div style=" text-align: left">
                   <textarea class = "defalut_input auto_address_input" v-text="raw_address" v-model="raw_address"></textarea>
                  <button class = "default_button " @click="onAddAddressClick">识别地址</button>

                </div>
                <div><button class = "match_btn" @click="onAddOrderOk">确认添加</button></div>



           </div>
      </div>
    </div>

    <div style="margin-top: 2em;margin-bottom: 2em">
                <select class="logistic_select" v-model="selected_logistics">
                  <option :value="option" v-for="(option,index) in logistics_options" :key="index">{{option.logistics_name}}</option>
                </select>
                <label style="margin-left: 0.5em">{{selected_logistics.logistics_price}}元</label>

                   <select class="logistic_select" v-model="selected_quality_test">
                  <option :value="option" v-for="(option,index) in quality_test_options" :key="index">{{option.quality_testing_name}}</option>
                </select>
    </div>

    <div class="mul_add_div"  style="display: block" v-if="raw_goods_txt==='656'">
                  <div style="margin: 0.5em" ><label style="background: darkgrey; width: 200px ;padding: 0.4em" >批量添加订单</label></div>

                  <div style="text-align: left; font-size: 0.6em;padding-top: 0.5em;padding-left: 0.5em">

                    <li>市场名 楼层 档口号 货号 价格 颜色尺码 /件数@    <label style="color: red">商品1(注：每个商品用 "@" 结束)</label></li>
                    <li>市场名 楼层 档口号 货号 价格 颜色尺码 /件数@    <label style="color: red">商品2(注：每个商品用 "@" 结束)</label></li>
                    <li> 熊**，86-15808*****，四川省 南充市 高坪区 清溪街道 **路3小区 ，000000； <label style="color: red">（注：每个地址用"；"结束）</label></li>

                  </div>
                <textarea v-model="order_text"   id="order_text" placeholder="
            市场名 楼层 档口号 货号 价格 颜色尺码 /件数@
            市场名 楼层 档口号 货号 价格 颜色尺码 /件数@
            熊**，86-15808*****，四川省 南充市 高坪区 清溪街道 **路3小区 ，000000；"> </textarea>
                <button class="match_btn" @click="match_btn" style="display:block">批量添加</button>
            </div>

  </div>


   <div>
      <li class = "items_li" v-for="(item,index) in order_obj['order_list']" >
       <div class="review_order_div" >
         <div class = "order_div">
            <label class = "">订单：{{index+1}}</label>
          <button style=" width:4em;height:2em;float: right; margin-right: 2em" @click="onDeleteRawGoods(index,order_obj['order_list'])">删除</button>
         </div>

            <table class = "market_table">
              <tr>
                 <td>市场</td>
                 <td>楼层</td>
                 <td>档口</td>
                 <td>款号</td>
                 <td>价格</td>
                  <td>颜色尺码</td>
                 <td>件数</td>
            </tr>
            <tr   v-for="(goodsitem,index) in item.orderGoods ">
                 <td><input    :class="{'input_tip':goodsitem.shop_market_name===''}" v-model="goodsitem.shop_market_name"/></td>
                 <td><input    :class="{'input_tip':goodsitem.shop_floor===''}" v-model="goodsitem.shop_floor"/></td>
                 <td><input    :class="{'input_tip':goodsitem.shop_stalls_no===''}" v-model="goodsitem.shop_stalls_no" /></td>
                 <td><input    :class="{'input_tip':goodsitem.art_no===''}" v-model="goodsitem.art_no"/></td>
                 <td><input   :class="{'input_tip':goodsitem.goods_price===''}" type="number" v-model="goodsitem.goods_price"/></td>
                 <td><input   :class="{'input_tip':goodsitem.goods_color===''}"    v-model="goodsitem.goods_color"/></td>
                 <td><input   :class="{'input_tip':goodsitem.goods_count===''}" type="number"   v-model="goodsitem.goods_count"/> </td>

            </tr>

            </table>
      <div style="padding-top: 3em">
           <table class="address">
             <tr >
                <td> 姓名：<input :class="{'input_tip':item.address.name===''}"  v-model="item.address.name" /></td>
               <td>电话：<input :class="{'input_tip':item.address.phone===''}"  type="number" oninput="if(value.length>11) value=value.slice(0,11)"    v-model="item.address.phone"/></td>
             </tr>
           </table>
            <table class="address">
              <tr >
                 <td>省份：<input   :class="{'input_tip':item.address.province===''}"  v-model="item.address.province" /></td>
                 <td>城市：<input  :class="{'input_tip':item.address.city.trim()===''}"  v-model="item.address.city"/></td>
                 <td>地区：<input    v-model="item.address.area"/></td>
              </tr>

            </table>
        <div class="detailed_address_div">
          <label>详细地址：</label>
            <textarea  v-model="item.address.address_detail" ></textarea>
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
   <div style="margin-top: 2em">
     <label style="font-weight: bold; color: red;margin-left: 3em">总价格：{{order_obj.allPrice}} 元</label></div>
     <button class="submit_btn" @click="submit" :disabled="submit_btn_disable" v-text="submit_btn"></button>
  </div>

</template>

<script>
    import  axios  from 'axios'
    import mStringUtils from "../../utils/mStringUtils.js"
    import mGlobal from "../../utils/mGlobal"
    import marketData from "../../../static/marketData"

    export default {
        name: "PlaceOrder",
      created(){

             this.load_quality_test()
             this.load_logistics()
             this.selected_logistics = this.logistics_options[1];
           if(typeof(this.$route.query.data) !== 'undefined'){
              let goods =  JSON.parse(this.$route.query.data);
              this.raw_goods_txt = goods.shop_market_name + "_" + goods.shop_floor + "_" + goods.shop_stalls_no +"_" + goods.art_no+"_"+goods.goods_price+"_"
                            +goods.goods_color+"/1@"
           }
      },
      mounted(){

      },

      data(){
        return{
          //开始用户添加未处理的数据

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
           // 加载物流选项信息
          load_logistics(){
            const url  = this.mGLOBAL.DJANGO_SERVER_BASE_URL+"/trade/logistics/"
           //设为true 就会带cookies 访问
           axios.defaults.withCredentials=true
            axios.get(url,

           ).then((res)=>{
             if("1000" === res.data.code){
                 console.log(res.data)
                  this.logistics_options = this.analysis_logistics(res.data.data)
                  this.selected_logistics =  this.logistics_options[1]
                console.log("selected_logistics")
                console.log(this.selected_logistics)
             }else{

             }
              }).catch(error => {
                console.log(error) ;

              })
          },


          // 加载质检选项信息
          load_quality_test(){
            const url  = this.mGLOBAL.DJANGO_SERVER_BASE_URL+"/trade/qualityTest/"
           //设为true 就会带cookies 访问
           axios.defaults.withCredentials=true
            axios.get(url,

           ).then((res)=>{
             if("1000" === res.data.code){
                 console.log(res.data)
                  this.quality_test_options = this.analysis_quality_test_data(res.data.data)
                  this.selected_quality_test =  this.quality_test_options[0]

             }else{

             }
              }).catch(error => {
                console.log(error) ;

              })
          },

         // 解析 数据
          analysis_logistics(data){
            let logistics_list = []
            for(let i = 0;i<data.length;i++){
              let item = {}
              item["logistics_name"] = data[i].logistics_name
              item["logistics_price"] = data[i].logistics_price
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
            let goods_list = marketData.get_goods_list(this.raw_goods_txt)


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
            let key_arr = Object.keys(goodsObj);
            for(let x = 0;x<key_arr.length;x++) {
              console.log( key_arr[x])
              let eValue = eval('goodsObj.' + key_arr[x]).trim();//根据对象属性名得到值
              if (eValue == null || !eValue.length) {
                return  true;
              }
            }
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
            for(let i = 0;i<order_list.length;i++){
                let consignee_address = order_list[i].address.province+","+
                          order_list[i].address.city+","+
                          order_list[i].address.area+","+
                          order_list[i].address.address_detail+",";
                let consignee_name =order_list[i].address.name;
                let consignee_phone =order_list[i].address.phone;

                let orderGoods = order_list[i].orderGoods;
                news_list.push({"consignee_address":consignee_address,"consignee_name":consignee_name,'logistics_name':order_list[i].logistics.logistics_name,
                "consignee_phone":consignee_phone,"orderGoods":orderGoods,"quality_testing_name":order_list[i].quality_test.quality_testing_name
                })
            }
            let jsonStr = JSON.stringify(news_list);
            this.postToServer(jsonStr);
         },

         postToServer(data){
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
           alert("提交成功！")
           this.order_obj = {
            order_list: [],
          };
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

         //any
         analysis_address_goods:function(orderStr){
            // 市场名_楼层_店铺位置_货号_颜色/尺码_价格_件数/
            // 市场名_楼层_店铺位置_货号_颜色/尺码_价格_件数/
            // 熊**，86-15808*****，四川省 南充市 高坪区 清溪街道 **路3小区 ，000000；
           //分割出商品跟地址  tem_index 为商品跟地址的分割线
              let tem_index =  orderStr.lastIndexOf("@");
              let goods_address = this.split_goods_address_str(orderStr);
              if(goods_address[0]=== "" || goods_address[1]=== "" ){
                 goods_address[0] = orderStr.substring(0,tem_index);
                 goods_address[1] = orderStr.substring(tem_index+1,orderStr.length);
              }
              console.log("**********************************************");
              console.log(goods_address);
              console.log("**********************************************");
              //拆分收货地址
              let address_str  = goods_address[1];
              let addressObj = mStringUtils.getAddressInfo(address_str);
              let logistics = this.selected_logistics;
              let goods_str  = goods_address[0];
              let goods_list = marketData.get_goods_list(goods_str);


              let orderObj = {"quality_test":this.selected_quality_test,"logistics":logistics,"address":addressObj,"orderGoods":goods_list};
             return orderObj
         },


          split_goods_address_str(orderStr){
            let goods_str = "";
            let address_str = "";
            let phone_index = orderStr.search(/\d{11}/ig);
              if(phone_index !== -1){
                while(orderStr.search("\t") !== -1){
                  orderStr = orderStr.replace("\t"," ");
                }
                while(orderStr.search(",") !== -1){
                  orderStr = orderStr.replace(",","，");
                }
                 while(orderStr.search("，，") !== -1){
                  orderStr = orderStr.replace("，，","，");
                }
                 while(orderStr.search("//") !== -1 ){
                  orderStr = orderStr.replace("//","/");
                }
                while(orderStr.search("  ") !== -1){
                  orderStr = orderStr.replace("  "," ");
                }
                 while(orderStr.search("\n") !== -1) {
                orderStr = orderStr.replace("\n", "@");
              }
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
         //给出特地字符 从后面开始查找 找到就返回索引值
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
                  if(order_goods_counts< 3){
                    orderItem['postage_totals'] =orderItem.logistics.logistics_price;
                  }else{
                    orderItem['postage_totals'] =orderItem.logistics.logistics_price*1.0 + 5;
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

<style scoped>
.default_button{
  padding: 0.5em;
  margin-bottom: 0.5em;
  margin-top: 0.5em;
}
.defalut_input{
  height: 1.5em;
}

.auto_goods_input{
  width:30em;
  height: 1.8em;
}
.auto_address_input{
  width:40em;
  height: 5em;
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
.address td{
  padding-left: 1em;

}
.address input{
  width: 10em;
}

.orders_str_div{
  width: 900px;
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
    width: 20em;
    height: 4em;
  }
  .detailed_address_div label{
    margin-bottom: 3em;
  }
.review_order_div{
  border: darkgrey solid 1px;
  display: block;
  width:auto;
  height: auto;
  background: #f0f0f0;

}
#order_text{

    padding: 0px;
    width: 100%;
    height: 200px;
    margin:0 auto
  }

.market_table {
   text-align: left;
}
  .market_table input{
    width: 7em;
    height: 1.5em;

  }
.order_div{
  text-align: left;
  background: darkgray;
  width: 100%;

  display: inline-block;
  padding-top: 0.5em;
  padding-bottom: 0.5em;
}
</style>
