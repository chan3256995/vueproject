<template>
  <div>

    <div class="top" v-show="is_scan_show" id="bcid">
      <!--<div ></div>-->
      <p class="tip">...载入中...</p>
      <div style="position: absolute;bottom: 0; width: 100%"><button @click="mcloseScan">关闭</button></div>
    </div>
    <div style="text-align: left; margin-bottom: 10px;background: " v-for="(order,index) in order_list" :key="index">
      <div style="background: paleturquoise">
          <label style="width: 40% ;font-size: smaller">订单号：{{order.order_number}}</label>
      </div>
      <div style="padding-left: 4%; padding-bottom: 5px" v-for="(order_goods,goods_index) in order.orderGoods">
        id:{{order_goods.id}}
        {{order_goods.shop_market_name}}
        {{order_goods.shop_floor}}
        {{order_goods.shop_stalls_no}}
        {{order_goods.art_no}}
        {{order_goods.goods_color}}
        <label style="color: red;display: block">{{goods_status[order_goods.status]}}</label>

        <button  @click="tomorrow_goods([{'order_number':order.order_number,'order_goods_list':[{'goods_number':order_goods.goods_number }]}], pGLOBAL.GOODS_STATUS2['明日有货'])">明天有货</button>
        <button  @click="tomorrow_goods([{'order_number':order.order_number,'order_goods_list':[{'goods_number':order_goods.goods_number }]}], pGLOBAL.GOODS_STATUS2['已下架'])">已下架</button>
        <button  @click="tomorrow_goods([{'order_number':order.order_number,'order_goods_list':[{'goods_number':order_goods.goods_number }]}], pGLOBAL.GOODS_STATUS2['2-5天有货'])">2-5天有货</button>
        <button  @click="tomorrow_goods([{'order_number':order.order_number,'order_goods_list':[{'goods_number':order_goods.goods_number }]}], pGLOBAL.GOODS_STATUS2['已拿货'])">已拿货</button>
        <button  @click="tomorrow_goods([{'order_number':order.order_number,'order_goods_list':[{'goods_number':order_goods.goods_number,'message':order_goods.selected_reason}]}], pGLOBAL.GOODS_STATUS2['其他'])">其他</button>
        <select  v-model="order_goods.selected_reason">
            <option :value="option" v-for="(option,index) in options" :key="index">{{option.reason}}</option>
        </select>
      </div>
      <div>
        <div>
          <label>快递</label>
          <select  v-model="order.logistics_selected" placeholder="请选择推荐人" >
            <option :value="option" v-for="(option,index) in logistics_options" :key="index">{{option.logistics_name}}</option>
        </select>
          <label v-text="order.logistics_name">单号</label>
          <input v-model="order.logistics_number"/>
        </div>
        <button >打印</button>
        <button @click="purchase_goods_submit([order_list[index]])" >拿货</button>
        <button  @click="mstartRecognize(index)">扫描填单</button><button @click="deliver_submit([order_list[index]])">确定发货</button>
      </div>
    </div>
    </div>
</template>

<script>
    import pGlobal from '../utils/pGlobal'
      import mscan from '../utils/mscan.js'
  import  axios  from 'axios'
    export default {
        name: "My",
        data(){
          return{
          order_list :"",
            goods_status :pGlobal.GOODS_STATUS,
            pGLOBAL : pGlobal ,

          options: [
            { reason: '价格有误', reason_value: '价格有误' },
            { reason: '尺码缺货', reason_value: '尺码缺货' },
            { reason: '档口或货号不对', reason_value: '档口或货号不对' }
          ],
          logistics_options : [],
            // 扫码返回的值
            cur_scan_code :"",
             is_scan_show: true,
             cur_scan_item_index :""
          }



        },
        watch:{
                'order_list': {
          deep: true,
　　　　  handler(new_order_list, old_order_list) {
                 console.log(new_order_list)
　　　　},
        }},
        methods:{


                  //明日有货
          tomorrow_goods(order_list,type){
             let submit_order_list = []

            for(let i = 0;i<order_list.length;i++){

                 let submit_order_goods_list = []
                 for(let g = 0;g < order_list[i].order_goods_list.length;g++){
                     submit_order_goods_list.push(order_list[i].order_goods_list[g])
                 }
                  submit_order_list.push({"order_number":order_list[i].order_number,"orderGoods":submit_order_goods_list})

            }
            const url = pGlobal.DJANGO_SERVER_BASE_URL+"/back/changePurchasingStatus/";
             //设为true 就会带cookies 访问
            axios.defaults.withCredentials=true;
            axios.post(url,{"order_list":submit_order_list,"status_type":type}).then((res)=>{
             if(res.data.code === "1000"){
               // #状态发生改变的订单
               let exception_order_list = res.data.exception_order


               this.$toast("失败："+exception_order_list.length)
             }else{
                alert("提交失败")
             }
          }).catch(error => {

              console.log(error)
               alert("提交失败")
          })
          },

          deliver_submit(order_list){
            let url = pGlobal.DJANGO_SERVER_BASE_URL+"/back/deliverGoods/"
            let deliver_order_list = [];
            for(let i = 0; i<order_list.length;i++){
              if(order_list[i].order_number !=="" && order_list[i].logistics_name !=="" && order_list[i].logistics_number !==""){
                let tem_order_object = {
                  "order_number":order_list[i].order_number,
                  "logistics_name":order_list[i].logistics_name ,
                  "logistics_number": order_list[i].logistics_number
                }
                deliver_order_list.push(tem_order_object);
              }
            }

            axios.post(url,{"deliver_order_list":deliver_order_list}).then((res)=>{
             if(res.data.code === "1000"){
               // #状态发生改变的订单
               let exception_order_list = res.data.exception_order


               this.$toast("提交成功")
             }else{
                alert("提交失败")
             }
          }).catch(error => {

              console.log(error)
               alert("提交失败")
          })
          },
            //拿货
          purchase_goods_submit(order_list){
             let purchase_order_list = []
            for(let i = 0;i<order_list.length;i++){
                  purchase_order_list.push(order_list[i].order_number)
            }
            const url = pGlobal.DJANGO_SERVER_BASE_URL+"/back/purchaseGoods/";
             //设为true 就会带cookies 访问
            axios.defaults.withCredentials=true;
            axios.post(url,{"order_list":purchase_order_list}).then((res)=>{
             if(res.data.code === "1000"){
               // #状态发生改变的订单
               let exception_order_list = res.data.exception_order
               this.$toast("提交成功")
             }else{
                alert("提交失败")
             }
        }).catch(error => {
            console.log(error)
             alert("提交失败")
        })
},



            analysis_order_data(order_list){
            for(let i = 0;i < order_list.length;i++){
               for(let g = 0 ; g < order_list[i].orderGoods.length;g++){
                 order_list[i].orderGoods[g].selected_reason = ""
               }
               order_list[i].logistics_selected = ""
            }
          },


          load_order(query_data){
             let url = pGlobal.DJANGO_SERVER_BASE_URL+"/nahuo/orders/"
             axios.get(url,{
                 params:query_data
              }).then((res)=>{
                console.log(res.data)
               this.order_list = res.data.results
               this.analysis_order_data(this.order_list)
                this.load_logistics()
            })
          },
          // 加载物流选项信息
           load_logistics(){
            const url  = pGlobal.DJANGO_SERVER_BASE_URL+"/trade/logistics/"
           //设为true 就会带cookies 访问
           axios.defaults.withCredentials=true
            axios.get(url,

           ).then((res)=>{
             if("1000" === res.data.code){
                 console.log(res.data)
                let logistics_options = res.data.data
                let item_data = {"logistics_name":"请选择"}
                logistics_options.unshift(item_data)
               this.logistics_options = logistics_options

                console.log("selected_logistics")
                console.log(this.logistics_options)
             }else{

             }
              }).catch(error => {
                console.log(error) ;

              })
          },

          fill_logistics_number(logistics_number2,order_list,index){
            alert(index)
            alert(order_list[index].order_number)
            this.$delete(order_list[index], 'logistics_number');
            this.$set(order_list[index], 'logistics_number', logistics_number2);



            alert(order_list[index].order_number)
            alert(order_list[index].logistics_number)
          },
          // 扫码回到函数
     onmarked(type, result, file) {

        switch (type) {
          case plus.barcode.QR:
            type = "QR";
            break;
          case plus.barcode.EAN13:
            type = "EAN13";
            break;
          case plus.barcode.EAN8:
            type = "EAN8";
            break;
          default:
            type = "其它" + type;
            break;
        }
         alert(type)
        result = result.replace(/\n/g, "");
        this.cur_scan_code = result;
        this.fill_logistics_number(this.cur_scan_code,this.order_list,this.cur_scan_item_index)
        // window.localStorage.codeUrl = result;
        alert(result);
        this.mcloseScan()

      },

    mstartRecognize(item_index){
        this.is_scan_show = true
        this.cur_scan_item_index = item_index
        let that = this
        setTimeout(function () {
        mscan.startRecognize(that.onmarked)
      },1000);


    },

    mcloseScan(){
       this.is_scan_show = false
       mscan.closeScan()
    },


        },



      created(){
          this.load_order({"is_order_follower":true})
      }
    }
</script>

<style scoped>
.top{
  position: fixed;
  top:  0;
  z-index:  999;
  max-width:  1080px;
  width:  100%;
  border-top:  1px solid #C0C0C0;
  background: white;
  height: 300px;
}
</style>
