<template>
  <div class="container">

      <div >
          <label>订单编号:</label>
        <!--{{this.$route.query.order}}-->
        <!--{{this.$route.query.goods}}-->
        <!--{{ this.$route.query.order_goods_id}}-->

          <label>{{order.order_number}}</label>
      <div>
        <div>

        </div>
      <ul  class = "address" >
        <li>
          <label style="font-weight: bolder  " >商品：</label>
          <label>{{goods.shop_market_name}}_{{goods.shop_floor}}_{{goods.shop_stalls_no}}_{{goods.art_no}}_{{goods.goods_color}}_{{goods.goods_size}}_{{goods.goods_price}}元_{{goods.goods_count}}件</label>
        </li>
        <li>
           <label style="font-weight: bold " >收件人：</label>
           <label>{{order.consignee_name}}</label>
        </li>
        <li>
           <label style="font-weight: bold " >联系号码：</label>
           <label>{{order.consignee_phone}}</label>
        </li>
        <li>
           <label style="font-weight: bold " >地址：</label>
           <label>{{order.consignee_address}}</label>
        </li>
         <li>
           <label  style="font-weight: bold " >商品状态：</label>
           <label style="color: red">{{goods_status[goods.status]}}</label>
        </li>
        <li>
           <label  style="font-weight: bold " >售后状态：</label>
           <label style="color: red">{{refund_apply_status[goods.refund_apply_status]}}</label>
           <button @click="closeApply" v-if="goods.refund_apply_status !== 0" style="">关闭申请</button>
        </li>
        <li>
           <label  style="font-weight: bold " >商品总价：</label>
           <label style="color: red">{{goods.goods_price}} x {{goods.goods_count}} =  {{goods.goods_price * goods.goods_count}}元  </label>
        </li>


      </ul>
      </div>

    </div>
    <div>
        <table  class="table">
      <tr>
        <td style="text-align: left"></td>
      </tr>
      <tr >
        <td >申请售后类型:</td>
        <td style="text-align: left" >
              <select  v-model="select_apply_type">
              <option :value="option.value" v-for="(option,index) in apply_type_options" :key="index">{{option.text}}</option>
            </select>
        </td>
        <td>申请商品件数:</td>
        <td><input style="width: 4em" v-model="apply_goods_counts"/></td>
      </tr>
      <tr>
        <td><label>售后物流公司：</label><label style="color: red">*</label></td>
         <td><input style="height: 1.5em" v-model="selected_logistics_name"/></td>
        <td>
             <select class="logistic_select" v-model="selected_logistics_name">
              <option :value="option.text" v-for="(option,index) in options" :key="index">{{option.text}}</option>
            </select>
        </td>
      </tr>
        <td><label>售后物流单号：</label><label style="color: red">*</label></td>

       <td><input v-model="logistics_number" style="height: 1.5em"></td>


    </table>
    </div><label style="color: red; font-size: 1.5em">*</label>
    <textarea  placeholder = "请描述售后详细原因......" style="width:40em;height: 8em" v-model="message"></textarea>
    <div v-show="select_apply_type=== REFUND_APPLY_TYPE['退货退款']" style="margin-top: 1em">
       <div>
        <label >支付金额：</label>
         <label style="font-size: 1.2em;color: red">{{apply_goods_counts *  server_fee}} 元</label>

      </div>
      <div >
        <label>支付密码：</label>
      <input type="password" style="margin-top:0.5em;height: 2.5em; width: 20em; background-color: #fff;
        border-radius: 0.4em;
        border: 1px solid #d8dce5;
        box-sizing: border-box;
        color: #5a5e66;" v-model="pay_pwd"/>
      </div>


    </div>
<button class="submit_btn" @click="submit" :disabled="submit_btn_disable" v-text="submit_btn" >提 交</button>
    </div>

</template>

<script>
   import  axios  from 'axios'
   import  mGlobal from "../../utils/mGlobal"
    export default {

        name: "RefundApply",
      watch:{
          apply_goods_counts:function (newValue,oldValue) {
            if(isNaN(newValue)){
              this.apply_goods_counts = oldValue
            }
            if(newValue> this.goods.goods_count){
            this.apply_goods_counts = oldValue
            }
          }
      },
      data() {
        return {
          // props:['goods'],
          // goods:JSON.parse(this.$route.query.goods),
          REFUND_APPLY_TYPE : mGlobal.REFUND_APPLY_TYPE,
          server_fee : mGlobal.SERVER_FEE,
          goods:"",
          submit_btn :"提交",
          submit_btn_disable: false,
          order:JSON.parse(this.$route.query.order),
          order_goods_id :this.$route.query.order_goods_id,
          selected_logistics_name :"",
          logistics_number:"",
          // 申请商品的数量
          apply_goods_counts :1,
          message :"",
           options: [
            { text: '韵达快递'},
            { text: '中通快递' },
            { text: '圆通快递' },
            { text: '申通' },
            { text: '百世快递' },
            { text: '天天快递' }
          ],
          select_apply_type:"",
          apply_type_options:mGlobal.REFUND_APPLY_TYPE_OPTIONS2,
          refund_apply_status:mGlobal.REFUND_APPLY_STATUS,
          goods_status: mGlobal.GOODS_STATUS,
          pay_pwd: "",
        }

      },

         created(){
           console.log("created------------")
           const url = this.mGLOBAL.DJANGO_SERVER_BASE_URL+"/user/orderGoods/"+this.order_goods_id+"/";
             //设为true 就会带cookies 访问
            axios.defaults.withCredentials=true;
            axios.get(url,).then((res)=>{
                console.log(res.data)
                this.goods = res.data;
        }).catch(error => {
        })
       },
      methods:{

        closeApply(){
               const url = this.mGLOBAL.DJANGO_SERVER_BASE_URL+"/user/refundApply/"+this.order_goods_id+"/";
             //设为true 就会带cookies 访问
               axios.defaults.withCredentials=true;
               axios.delete(url,).then((res)=>{
               console.log(res.data)
               if(res.data.code === "1000"){
                 alert("关闭成功")
                this.reflashPage();

                  // this.$router.replace({path:"/pc/refund",query:{order_goods_id:this.order_goods_id, order :this.$route.query.order}})
               }

        }).catch(error => {

        })
              },
        reflashPage(){
            let NewPage = '_empty' + '?time=' + new Date().getTime()/500;
            this.$router.push(NewPage);
            this.$router.go(-1);
},
             checkData(){
               if(this.goods.refund_apply_status !== 0){
                 alert("关闭申请退款后才能再次申请")
                 return false;
               }

                if(this.select_apply_type === mGlobal.REFUND_APPLY_TYPE["退货退款"] && this.goods.status !== mGlobal.GOODS_STATUS2['已发货']){
                    alert("该商品状态暂不支持退货退款")
                  return false;
                }

                if(this.select_apply_type === mGlobal.REFUND_APPLY_TYPE["仅退款"]  && (this.goods.status !== mGlobal.GOODS_STATUS2['已付款'] &&  this.goods.status !== mGlobal.GOODS_STATUS2['缺货'])){
                  alert("该商品状态不支持仅退款")
                  return false;
                }


               if(this.select_apply_type == mGlobal.REFUND_APPLY_TYPE["退货退款"]){
                       if(this.selected_logistics_name.trim() === ""){
                        alert("物流名称不能为空")
                        return false;
                      }
                      if(this.logistics_number.trim() === ""){
                        alert("物流单号不能为空")
                        return false;
                      }
                  }

                if(this.select_apply_type === ""){
                  alert("请选择申请售后类型")
                  return false;
                }
                if(this.message === ""){
                   alert("描述不能为空")
                  return false;
                }

                return true
            },
          submit(){
             if(this.checkData() == false){
               return;
             }
            let order_goods = this.goods.id;
            let refund_apply_type = this.select_apply_type;
            let apply_message = this.message;
            let return_logistics_name = this.selected_logistics_name;
            let return_logistics_number = this.logistics_number;
            let apply_goods_counts = this.apply_goods_counts;
            let pay_pwd = this.pay_pwd;
            let data_ = {
              "orderGoods":order_goods,
              "refund_apply_type":refund_apply_type,
              "apply_message":apply_message,
              "return_logistics_name":return_logistics_name,
              "return_logistics_number":return_logistics_number,
              "goods_counts":apply_goods_counts,
              "pay_pwd":pay_pwd,

            }
            const url = this.mGLOBAL.DJANGO_SERVER_BASE_URL+"/user/refundApply/";
             //设为true 就会带cookies 访问
            axios.defaults.withCredentials=true;
            this.submit_btn = "正在提交...."
            this.submit_btn_disable = true;
            axios.post(url,data_).then((res)=>{
             this.submit_btn_disable = false;
             this.submit_btn = "提交"
             if(res.data.code === "1000"){
               alert("提交成功")
                this.reflashPage();
             }else{
                alert("提交失败")
             }
        }).catch(error => {
              this.submit_btn_disable = false;
              this.submit_btn = "提交"
             alert("提交失败")
        })
       },

        }
    }
</script>

<style scoped>
  .submit_btn{
        width: 4em;
    height: 2em;
    margin: 5px auto;
    margin-left: 5em;
    color: #fff;
    border-radius: 4px;
    float: left;
    font-size: 1.2em;
    background: #3bb4f2;
     border-color: #3bb4f2;
    display: block;
  }
  .logistic_select{
    width: 8em;
    height: 1.5em;
  }
  .address{width: auto}
.address li{
  width: auto;
  text-align: left;
  list-style: none;

}
.container{
  width:900px;
  height: 800px;
  margin: 0 auto;
  text-align: left;
}
  .table{
    text-align: right;
    padding-bottom: 2em;
  }
</style>
