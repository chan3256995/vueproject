<template style="width: 100%">
  <div class="root">
    <div class="orders_str_div" style="display:block; background: aqua">
 <img class="tip_img" src="../assets/1.jpg">
    <textarea v-model="order_text"   id="order_text" placeholder="
市场名_楼层_店铺位置_货号_颜色_尺码_价格_件数/
市场名_楼层_店铺位置_货号_颜色_尺码_价格_件数/
熊**，86-15808*****，四川省 南充市 高坪区 清溪街道 **路3小区 ，000000；"> </textarea>
    <button id="match_btn" @click="match_btn" style="display:block">匹配</button>

      </div>
    <li class = "items_li" v-for="(item,index) in order_obj['order_list']" >

    <div class="review_order_div" >
      <label class = "order_label">订单：{{index+1}}</label>
            <table class = "market_table">
              <tr>
                 <td>市场</td>
                 <td>楼层</td>
                 <td>档口</td>
                 <td>款号</td>
                  <td>颜色</td>
                 <td>尺码</td>
                 <td>价格</td>
                 <td>件数</td>
            </tr>
            <tr   v-for="(goodsitem,index) in item.orderGoods ">
                 <td><input    v-model="goodsitem.shop_market_name"/></td>
                 <td><input    v-model="goodsitem.shop_floor"/></td>
                 <td><input    v-model="goodsitem.shop_stalls_no" /></td>
                 <td><input    v-model="goodsitem.art_no"/></td>
                 <td><input    v-model="goodsitem.goods_color"/></td>
                 <td><input   v-model="goodsitem.goods_size"/></td>
                 <td><input   type="number" v-model="goodsitem.goods_price"/></td>
                 <td><input  type="number"   v-model="goodsitem.goods_count"/> </td>

            </tr>

            </table>
      <div style="padding-top: 3em">
           <table class="address">
             <tr >
                <td> 姓名：<input  v-model="item.address.name" /></td>
               <td>电话：<input type="number" oninput="if(value.length>11) value=value.slice(0,11)"    v-model="item.address.phone"/></td>
             </tr>
           </table>
            <table class="address">

              <tr >
                 <td>   省份：<input   v-model="item.address.province" /></td>
                 <td>    城市：<input  v-model="item.address.city"/></td>
                 <td>   地区：<input   v-model="item.address.area"/></td>
              </tr>

            </table>
        <div class="detailed_address_div">
          <label>详细地址：</label>
            <textarea  v-model="item.address.address_detail" ></textarea>

        </div>
        <div style="display: block;height: 2em">
          <label style="color:red; float: right">
          {{item.goodsTolPrice}} + {{item.postage_totals}} + {{item.agencyFee_totals}}=
          {{item.goodsTolPrice*1.0 +item.postage_totals*1.0 + item.agencyFee_totals*1.0}}元
          </label>
        </div>
    </div>
    </div>
    </li>
      <div >
        <select class="logistic_select" v-model="selected_logistics">
            <option :value="option" v-for="(option,index) in options" :key="index">{{option.logistics_name}}</option>
        </select>
        <label style="font-weight: bold; color: red;margin-left: 3em">总价格：{{order_obj.allPrice}} 元</label></div>
    <button class="submit_btn" @click="submit" :disabled="submit_btn_disable" v-text="submit_btn"></button>
  </div>

</template>

<script>
    import  axios  from 'axios'
    export default {
        name: "PlaceOrder",
      created(){
           this.selected_logistics = this.options[0];
           console.log('**************1')
           console.log(this.$route.query.data);
           if(this.$route.query.data !== 'undefined'){
              let goods =  JSON.parse(this.$route.query.data);
              this.order_text = goods.shop_market_name + "_" + goods.shop_floor + "_" + goods.shop_stalls_no +"_" + goods.art_no+"_"
                            +goods.goods_color+"_"+goods.goods_size+"_"+ goods.goods_price +"_1/"
           }

      },
      mounted(){
          console.log('**************2  ')
          console.log(this.$route.query.data)
      },

      data(){
        return{
          submit_btn :"提交",
          submit_btn_disable: false,
          order_text:"",
           selected_logistics:"",
          options: [
            { logistics_name: '韵达', price: '4.0' },
            { logistics_name: '中通', price: '5.0' },
            { logistics_name: '圆通', price: '6.0' }
          ],

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
              let eValue = eval('goodsObj.' + key_arr[x]).trim();//根据对象属性名得到值
              console.log(eValue)

              if (eValue == null || !eValue.length) {
                return  true;
              }
            }
            return false
          },
          check_data(){
            let iscontinue = true;
           let order_list = this.order_obj["order_list"]
            for(let i=0;i<order_list.length;i++){
              if(iscontinue == false){
                break;
              }

              for(let z = 0; z< order_list[i].orderGoods.length;z++){
                    if(this.checkGoodsIsNull(order_list[i].orderGoods[z])){
                       let tem_nul = i+1;
                      alert("第"+tem_nul+"条订单商品详情不能为空")
                      iscontinue = false;
                      break
                    }
              }



              let arr = Object.keys(order_list[i].address);
              for(let x = 0;x<arr.length;x++){
                 let eValue=eval('order_list[i].address.'+arr[x]);//根据对象属性名得到值
                 console.log(eValue)

                if(eValue == null || !eValue.length){
                   let tem_nul = i+1
                    alert("第"+tem_nul+"条订单地址不能为空")
                  iscontinue = false;
                  break;
                }
              }
            }

          },
         // 提交数据到服务器
         submit(){

           if(this.order_obj.order_list.length === 0){
             return;
           }
           this.check_data();
           let news_list = [];
           let order_list = this.order_obj["order_list"]
           console.log(order_list)
            for(let i = 0;i<order_list.length;i++){
                let consignee_address = order_list[i].address.province+","+
                          order_list[i].address.city+","+
                          order_list[i].address.area+","+
                          order_list[i].address.address_detail+",";
                let consignee_name =order_list[i].address.name;
                let consignee_phone =order_list[i].address.phone;

                let orderGoods = order_list[i].orderGoods;
                news_list.push({"consignee_address":consignee_address,"consignee_name":consignee_name,'logistics_name':this.selected_logistics.logistics_name,
                "consignee_phone":consignee_phone,"orderGoods":orderGoods
                })
            }
            let jsonStr = JSON.stringify(news_list);
           console.log("-------------json----------------");
           console.log(jsonStr)
            this.postToServer(jsonStr);
         },

         postToServer(data){
                 const url  = this.mGLOBAL.DJANGO_SERVER_BASE_URL+"/user/addOrders/"
        console.log(url)
           //设为true 就会带cookies 访问
           axios.defaults.withCredentials=true
          this.submit_btn = "正在提交...."
          this.submit_btn_disable = true;

        axios.post(url,{
            "order_list":data
          }

        ).then((res)=>{
         console.log(res.data) ;
         if(1000 === res.data.code){
           alert("提交成功！")
           this.order_obj = {
            order_list: [],
          };
           this.order_text = ""

         }else{
           alert("提交失败")
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
// 市场名_楼层_店铺位置_货号_颜色_尺码_价格_件数/
// 市场名_楼层_店铺位置_货号_颜色_尺码_价格_件数/
// 熊**，86-15808*****，四川省 南充市 高坪区 清溪街道 **路3小区 ，000000；

            console.log("111111111111111111111111111111111111")
            console.log(orderStr)
           //--------------------------分析地址---------------------------------
              //分割出商品跟地址  tem_index 为商品跟地址的分割线
              let tem_index =  orderStr.lastIndexOf("/");
              //拆分收货地址
              let addressStr = orderStr.substring(tem_index+1,orderStr.length).trim();


              let indexof2 = this.find_index(addressStr,'，',2)
              console.log(indexof2)

              let name_phone_str = addressStr.substring(0,indexof2);
              let logictis_address_str = addressStr.substring(indexof2+1,addressStr.length);
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
              let logistic_name = this.selected_logistics_name;
              let addressObj  =  {"phone":phone,"name":name,"province":province, "city":city,"area":area,"address_detail":address_detail}
 //--------------------------分析地址---------------------------------


//--------------------------下面分析商品---------------------------------

                //得到多个商品字符串
              let goodsStr =  orderStr.substring(0,tem_index);
              //得到商品数组
              let oldGoodsList  = goodsStr.split('/')
            //商品列表
              let newsGoodsList = []
            // 遍历一个订单下面的多个商品
              for(let i = 0;i<oldGoodsList.length;i++){
                   let detailObj = {}
                   let goodsDetials_arr = oldGoodsList[i].trim().split("_")
                   //var arr = str.match(/\d+(.\d+)?/g);
                   let goods_price_arr = goodsDetials_arr[6].trim().match(/\d+\.?\d*/g);
                   let goods_count_arr = goodsDetials_arr[7].trim().match(/\d+\.?\d*/g);
                   if(goods_price_arr!== null ){
                     goods_price_arr = goods_price_arr[0];
                   }
                   if(goods_count_arr !== null){
                     goods_count_arr = goods_count_arr[0];
                   }
                   console.log(goods_price_arr)
                   console.log(goods_count_arr)
                   detailObj = {
                              "shop_market_name":goodsDetials_arr[0].trim(),
                              "shop_floor":goodsDetials_arr[1].trim(),
                              "shop_stalls_no":goodsDetials_arr[2].trim(),
                              "art_no":goodsDetials_arr[3].trim(),
                              "goods_color":goodsDetials_arr[4].trim(),
                              "goods_size":goodsDetials_arr[5].trim(),
                                //价格数量必须是数字  不是的话就复制为空字符串
                              "goods_price":(isNaN(goods_price_arr)?"":goods_price_arr),
                              "goods_count":(isNaN(goods_count_arr)?"":goods_count_arr),
                         }
                newsGoodsList.push(detailObj)
              }
//--------------------------分析商品---------------------------------

             let orderObj = {"logistic_name":logistic_name,"address":addressObj,"orderGoods":newsGoodsList}
             return orderObj
         },

          //计算一个订单的商品价格
         calcOneOrderAmount(orderItem){

                //计算商品价格
                  let goodsTolPrice = 0;
                  for(let p = 0;p<orderItem.orderGoods.length;p++){
                    goodsTolPrice = goodsTolPrice + orderItem.orderGoods[p ].goods_price * orderItem.orderGoods[p].goods_count;
                  }
                  orderItem['goodsTolPrice'] = goodsTolPrice;
                  let goodsCounts = 0;
                  for(let g = 0;g<orderItem.orderGoods.length ;g++){
                    goodsCounts = orderItem.orderGoods[g].goods_count*1.0 + goodsCounts
                  }
                  orderItem['agencyFee_totals'] = goodsCounts * 2;
                  console.log("ppppppppppppppp")
                  console.log(this.selected_logistics)
                  console.log(this.selected_logistics.price)
                  orderItem['postage_totals'] =this.selected_logistics.price;
                  console.log(orderItem['goodsTolPrice'])
         },
         calcAllOrderAmount(orderList){
           let allPrice = 0;
             for(let i = 0;i<orderList.length;i++){
                let sum = orderList[i].goodsTolPrice*1.0 + orderList[i].agencyFee_totals*1.0 +  orderList[i].postage_totals*1.0
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
          console.log(this.order_text)
           let str=this.order_text;
          // 替换掉英文引号
          while(str.match(";")){
             str = str.replace(";","；")
          }
          str = str.trim()
          //一个分号结束代表一个订单
          let orderList=str.split('；');
          console.log(orderList)

          for(let i = 0;i< orderList.length;i++){
            console.log(i)
            orderList[i] = orderList[i].trim()
            if(orderList[i] =="")
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


           console.log("****************");
         console.log( this.order_obj);
         let jsonStr = JSON.stringify( this.order_obj);

         console.log(jsonStr)
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
.root{
  margin:0 auto;
  text-align: center;

  width: 100%;


}

.tip_img{
  width: 100%;
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
  margin-top: 2em;
  width: 5em;
  height: 2em;
}
.items_li{
  list-style: none;
}
.address td{
  padding-left: 1em;

}

.orders_str_div{
  width: 100%;
  height: auto;
    margin: 0 auto;
  background: azure;
}
  #match_btn{
    width: 4em;
    height: 2em;
    float: right;
    margin: 5px auto;
    color: #fff;
    border-radius: 4px;
    font-size: 1.2em;
  background: #3bb4f2;
  border-color: #3bb4f2;
  }
  .detailed_address_div{
    text-align: left;
    padding-top: 0.5em;
  }
  .detailed_address_div textarea{
    width: 100%;
    height: 8em;
  }
  .detailed_address_div label{
    margin-bottom: 3em;
  }
.review_order_div{
  display: block;
  padding: 0.3em;
  width:auto;
  background: #f0f0f0;
  margin: 5em auto;
}
    #order_text{
    width: 100%;
    height: 200px;
    display:block;
    margin:0 auto
  }

.market_table {
   text-align: left;
}
  .market_table input{
    width: 100%;
    height: 1.5em;

  }
.order_label{
  text-align: left;
  background: darkgray;
  width: 100%;
  float: left;
  display: inline-block;
  padding: 0.2em;
  padding-left: 0.4em;
}
</style>
