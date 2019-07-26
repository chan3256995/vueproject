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
    </div>
    <textarea  placeholder = "请描述售后详细原因......" style="width:40em;height: 8em" v-model="message"></textarea>
    <div>
      <button class="submit_btn" @click="submit" :disabled="submit_btn_disable" v-text="submit_btn" >提 交</button>
    </div>

    </div>

</template>

<script>
   import  axios  from 'axios'
    export default {

        name: "RefundApply",
      data() {
        return {
          // props:['goods'],
          // goods:JSON.parse(this.$route.query.goods),
          goods:"",
          submit_btn :"提交",
          submit_btn_disable: false,
          order:JSON.parse(this.$route.query.order),
          order_goods_id :this.$route.query.order_goods_id,
          selected_logistics_name :"",
          logistics_number:"",
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
          apply_type_options:[
            { text: '退货退款',value:1},
            { text: '仅退款' ,value:2},
          ],
          refund_apply_status:{
            0:"无售后",
            1:"已申请退货退款",
            2:"已申请仅退款",
          },
          goods_status: {
              1:"未付款",//未付款
              2:"已付款",//已付款
              3:"拿货中",//拿货中
              4:"已拿货",//已拿货
              5:"已发货",//已发货
              6:"已退款",//已退款
              7:"缺货",//缺货
            },
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
               if(res.data.code === 1000){
                 alert("关闭成功")
                this.reflashPage();

                  // this.$router.replace({path:"/refund",query:{order_goods_id:this.order_goods_id, order :this.$route.query.order}})
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

                if(this.select_apply_type === 1 && this.goods.status !== 5){
                    alert("该商品状态暂不支持退货退款")
                  return false;
                }
                console.log(this.goods.status)
                console.log(this.select_apply_type)
                if(this.select_apply_type === 2  && (this.goods.status !== 2 &&  this.goods.status !== 7)){
                  alert("该商品状态不支持仅退款")
                  return false;
                }


               if(this.select_apply_type == 1){
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
            let data_ = {
              "orderGoods":order_goods,
              "refund_apply_type":refund_apply_type,
              "apply_message":apply_message,
              "return_logistics_name":return_logistics_name,
              "return_logistics_number":return_logistics_number,

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
  width:100%;
  height: 800px;
  margin: 0 auto;
  text-align: left;
}
  .table{
    text-align: right;
    padding-bottom: 2em;
  }
</style>
