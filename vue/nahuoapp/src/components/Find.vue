<template>
  <div>
      <div style="color: red">拿货扫描（扫描标签上的商品ID）</div>
       <div class="top" v-show="is_scan_show" >
          <div  class="top2" id="bcid" v-show="is_scan_show">
            <!--<div ></div>-->
            <p class="tip">...载入中...</p>
          </div>


       </div>
      <button @click="mstartRecognize"> 开始扫描</button><button @click="mcloseScan">关闭</button>
    <div  >
      <table v-for="(order_goods,index) in order_goods_list" :key="index">
        <tr>
          <td>
            <input  v-model="order_goods.id" />
          </td>
          <td><label style="color: red">{{order_goods.message}}</label></td>
          <td><button @click="delete_item(order_goods_list,index)">删除</button></td>

        </tr>

      </table >

    </div>
    <div>
      <button @click="submit_order_goods(order_goods_list)">提交</button>
    </div>
    </div>
</template>

<script>
   import  axios  from 'axios'
   import pGlobal from '../utils/pGlobal'
    import mscan from '../utils/mscan.js'
    export default {
        name: "Find",

        data(){
          return{
            is_scan_show:false,
            order_goods_list: [
              {'id':99, 'message':'状态异常'},
              {'id':'ll6++','message':'字符异常' },
              {'id':9787, }
            ]
          }
        },
        methods:{
          delete_item(order_goods_list,index){
            order_goods_list.splice(index,1)
          },
        submit_order_goods(order_goods_list){
             let order_goods_id_list = []
            for(let i = 0;i< order_goods_list.length;i++){
              order_goods_id_list.push(order_goods_list[i].id)
            }
             let url = pGlobal.DJANGO_SERVER_BASE_URL+"/nahuo/scanTagToPurchasedStatus/"
             axios.post(url,{
                 'goods_list':order_goods_id_list
               }).then((res)=>{
                console.log(res.data)
               if(res.data.code==="1000"){

                 this.$toast("提交成功,")
                 let exception_goods_list = res.data.exception_goods_list
                 this.order_goods_list = exception_goods_list
                 // for(let i =0 ;i<exception_goods_list.length;i++){
                 //   this.order_goods_list = exception_goods_list[i]
                 // }

               }else{
                 this.$toast("提交失败")
               }

            })
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

          result = result.replace(/\n/g, "");

          this.order_goods_list.unshift({"id":result,"message":''})
          // window.localStorage.codeUrl = result;

          this.mcloseScan()
          this.mstartRecognize()
        },

        // 开始扫码
        mstartRecognize() {
          this.is_scan_show = true
          let that = this;
            setTimeout(function () {
            mscan.startRecognize(that.onmarked)
          }, 20);


        },

        // 关闭扫码
        mcloseScan() {
          this.is_scan_show = false
          mscan.closeScan()
        },

        }
    }
</script>

<style scoped>
.top{

  z-index:  999;
  max-width:  1080px;
  width:  100%;
  border-top:  1px solid #C0C0C0;
  background: white;
  height: 370px;
}

.top2{

  z-index:  999;
  max-width:  1080px;
  width:  100%;
  border-top:  1px solid #C0C0C0;
  background: white;
  height: 350px;
}
</style>
