<template>
  <div>

       <div class="top" v-show="is_scan_show" >
          <div  class="top2" id="bcid" v-show="is_scan_show">
            <!--<div ></div>-->
            <p class="tip">...载入中...</p>
          </div>


       </div>
      <button @click="mstartRecognize"> 开始扫描</button><button style="margin-left: 1em" @click="mcloseScan">关闭</button>
    <div style="color: red">{{tip_message}}</div>
    <div  >
      <table v-for="(m_package,index) in package_list" :key="index">
        <tr>
          <td>
            <input  v-model="m_package.return_logistics_number" />
          </td>
          <td><label style="color: red">{{m_package.return_logistics_name}}</label></td>
          <td><button @click="delete_item(package_list,index)">删除</button></td>

        </tr>

      </table >

    </div>
    <div>
      <button style="margin-top: 1em" @click="submit_order_goods(package_list)">提交</button>
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
            tip_message:"",
            package_list: [
              // {'return_logistics_number':5555, 'return_logistics_name':'圆通'},
              // {'return_logistics_number':99, 'return_logistics_name':'韵达'},
              // {'return_logistics_number':44444, 'return_logistics_name':'申通'},
              // {"return_logistics_number":"78426883530856","return_logistics_name":'st',"is_inbound":true}

            ]
          }
        },
        methods:{
          delete_item(package_list,index){
            package_list.splice(index,1)
          },
        load_return_package(){
            const url = pGlobal.DJANGO_SERVER_BASE_URL + "/back/returnPackageInfo/"
            //设为true 就会带cookies 访问
          axios.defaults.withCredentials = true
          axios.get(url,
          ).then((res) => {
            if ("1000" === res.data.code) {
              console.log(res.data)

            }
          }).catch(error => {
            console.log(error);

          })
        },
        submit_order_goods(package_list){

             let url = pGlobal.DJANGO_SERVER_BASE_URL+"/back/addReturnPackages/"
             this.tip_message = ""
             axios.post(url,{
                 'return_package_list':JSON.stringify(package_list)
               }).then((res)=>{
                console.log(res.data)
               if(res.data.code==="1000"){

                 this.$toast("提交成功,")
                 let exits_list = res.data.exits_list
                 this.package_list = exits_list
                  if(exits_list.length !==0){
                   this.tip_message = "下面单号已经提交过"
                 }


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


          this.package_list.unshift({"return_logistics_number":result,"return_logistics_name":'',"is_inbound":true})
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

        },
created(){
          this.load_return_package()
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
