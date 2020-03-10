<template >
 <div class="root">

  <div class="orders_str_div" >

    <div class="mul_add_div"  style="display: block"  >
                  <div style="margin: 0.5em" ><label style="background: darkgrey; width: 200px ;padding: 0.4em" >批量添加订单</label></div>

                  <div style="text-align: left; font-size: 0.6em;padding-top: 0.5em;padding-left: 0.5em">


                    <li> 熊**，86-15808*****，四川省 南充市 高坪区 清溪街道 **路3小区  <label style="color: red">（注：每一个地址一行）</label></li>
                    <li> 小花，17808*****，广东省 广州市 天河区  ***街道 **路小区 <label style="color: red">（注：每一个地址一行）</label></li>

                  </div>
                <textarea v-model="order_text"   id="order_text" placeholder="

            熊**，86-15808*****，四川省 南充市 高坪区 清溪街道 **路3小区
            小花，17808*****，广东省 广州市 天河区  ***街道 **路小区
"> </textarea>
                <button class="match_btn" @click="match_btn" style="display:block">批量添加</button>
            </div>
 <div style="margin-top: 2em;margin-bottom: 2em">

                <select class="logistic_select" v-model="selected_logistics">
                  <option :value="option" v-for="(option,index) in logistics_options" :key="index">{{option.logistics_name}}</option>
                </select>

                <label style="margin-left: 0.5em">{{selected_logistics.logistics_price}} 元 </label>


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


       <div style="padding-top:5px">

            <table class="address">
              <tr>

             </tr>
              <tr >
                <td> 姓名：<input class="global_input_default_style defalut_input " :class="{'input_tip':item.address.name===''}"  v-model="item.address.name" /></td>
               <td>电话：<input class="global_input_default_style defalut_input " :class="{'input_tip':item.address.phone===''}"    v-model="item.address.phone"/></td>

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
            <label style="display: block" >运费</label>
              <label style="color:red;">
              {{item.logistics.logistics_price}} 元
              </label>
          </div>

        </div>
    </div>
    </div>

      </li>
   </div>
   <div   style="margin-top: 2em">
     <label v-if="selected_logistics!==''" style="font-weight: bold; color: red;margin-left: 3em">总价格：{{order_obj.order_list.length*selected_logistics.logistics_price}} 元</label></div>
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
        name: "PlaceNullOrder",
      created(){
             if(this.getLocalValue("user")!==''){
               this.my_account = JSON.parse(this.getLocalValue("user"))
             }else{
                router.replace("/pc/back/Login")
             }



             let p2 = this.load_logistics()


             Promise.all([ p2]).then((res) => {

})



      },
      mounted(){

      },

      data(){
        return{


            my_account:"",


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

          logistics_options:[],


          order_obj: {
            order_list: [],
          }
      }
    },

      watch:{
     },
       methods:{

       time_format(time_stmp){
         return mtime.formatDateStrFromTimeSt(time_stmp)
        },





           // 加载物流选项信息
       load_logistics(){
            const url  = this.mGLOBAL.DJANGO_SERVER_BASE_URL+"/trade/nullPackageLogistics/"
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




          onDeleteRawGoods(index,list){
            list.splice(index,1)
          },



         //
          check_data(order_list){

            for(let i=0;i<order_list.length;i++){


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
                let tb_order_number =order_list[i].tb_order_number;


                news_list.push(
                  {"tb_order_number":tb_order_number,
                    "consignee_address":consignee_address,
                    "consignee_name":consignee_name,
                    "consignee_phone":consignee_phone,
                    'logistics_name':order_list[i].logistics.logistics_name,
                    'logistics_id':order_list[i].logistics.logistics_id,

                })
            }
            let jsonStr = JSON.stringify(news_list);
            this.postToServer(jsonStr);
         },

         postToServer(data){
           const url  = this.mGLOBAL.DJANGO_SERVER_BASE_URL+"/user/addNullPackageOrder/"
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


        match_btn(){
           this.order_obj = {
             order_list : [],

           }
            let order_list = this.order_obj["order_list"]

           let str=this.order_text;
          // 替换掉英文引号
          while(str.match(";")){
             str = str.replace(";","；")
          }
          str = str.trim()

          str = mStringUtils.replace_redundance_str(str)

          //一个分号结束代表一个订单
          let orderList=str.split('@');

          for(let i = 0;i< orderList.length;i++){
            orderList[i] = orderList[i].trim();
            if(orderList[i] ==="")
                continue;
                 let addressObj = mStringUtils.getAddressInfo(orderList[i]);
                order_list.push({"address":addressObj,"logistics":  this.selected_logistics})
          }

         this.order_obj["order_list"] = order_list

        },

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
</style>
