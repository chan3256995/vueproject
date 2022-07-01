
<!-- 自定义 QRBox 组件 -->
<template>
  <div class="message-box" v-show="isShowMessageBox">
    <div class="mask" @click="cancel"></div>
    <div class="message-content">
      <svg class="icon" aria-hidden="true" @click="cancel">
        <use xlink:href="#icon-delete"></use>
      </svg>

      <h3 class="title">{{ title }}</h3>
      <p class="content">{{ content }}</p>
      <div  >
        <table class="market_table1">
          <tr><img v-bind:src="shop_obj.image_url" style="width: 4em;height: 4em"/></tr>
          <tr  >
            <td  ><input v-model="shop_obj.image_url"  placeholder="店铺图片" /></td>
            <td  ><input v-model="shop_obj.monitor_url" placeholder="监控地址" /></td>
            <td  ><input v-model="shop_obj.shop_name" placeholder="店铺名字" /></td>
            <td><input v-model="shop_obj.shop_id" placeholder="店铺字符ID"   /></td>
            <td><input v-model="shop_obj.shop_id2" placeholder="店铺数字ID"   /></td>
          </tr>


        </table>

        <table class="market_table1">

          <tr> <td><input v-model="shop_obj.remarks"  placeholder="备注"     /></td>

          </tr>
          <tr>
            <td><input  v-model="taget_url" placeholder="抖音店铺地址"    /></td>
            <td><button class="btn-primary btn-confirm"  @click="get_dou_yin_shop_info(taget_url)"   >抓取信息</button></td>
          </tr>
        </table>

      </div>


      <div class="btn-group">

        <button class="btn-default" @click="cancel" v-show="isShowCancelBtn">{{ cancelBtnText }}</button>
        <button class="btn-primary btn-confirm" :disabled="submit_btn_disable" @click="confirm" v-show="isShowConfimrBtn">{{ confirmBtnText }}</button>
      </div>
    </div>
  </div>
</template>

<script>
   import mGlobal from '../mGlobal';
    import mcommon_function from '../mcommon_function';
   import $ from 'jquery'
  export default {
     // 复用模块组件
    mixins:[mcommon_function],
    props: {
      myGoods:{},

      title: {
        type: String,
        default: '标题'
      },
      content: {
        type: String,
        default: ''
      },
      isShowInput: false,
      inputValue: '',
      isShowCancelBtn: {
        type: Boolean,
        default: true
      },
      isShowConfimrBtn: {
        type: Boolean,
        default: true
      },
      cancelBtnText: {
        type: String,
        default: '取消'
      },
      confirmBtnText: {
        type: String,
        default: '确定'
      }
    },
    data () {
      return {
        mGlobal:mGlobal,

        isShowMessageBox: false,
        resolve: '',
        reject: '',
        promise: '', // 保存promise对象
        submit_btn_disable :false,
        taget_url :"",

        shop_obj:{
          shop_id:"",
          shop_id2:"",
          image_url:"",
          shop_name:"",
          remarks:"",
          monitor_url:"",



        },
      };
    },
    created(){

    },
    mounted(){

      // Object.assign(this.orderGoodsBackUp,this.orderGoods)

    },


    methods: {

      //抓取信息
      get_dou_yin_shop_info: function(url){
          let ser_url = this.mGLOBAL.DJANGO_SERVER_BASE_URL+"/user/getWebPageContent/"
          let  result = this.mcommon_return_url_params(url)
          let return_data = {}
          console.log("result:",result)
          let shop_str_id = result["id"]

          let dou_yinshop_url = "https://ec.snssdk.com/shop/getInfo?id="+shop_str_id+"&b_type_new=0&device_id=0&is_outside=1"
          let params_obj = {
            "method":"GET",
            "url":dou_yinshop_url,
            "header":{
              "user-agent":"Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.3770.100 Safari/537.36",
            },
          }
          this.$axios.post(ser_url,{

                        "req_parms": JSON.stringify(params_obj),


       }).then((res)=>{
        console.log("res",res)
         if(res.data.code === "1000"){

            this.$toast("抓取成功")
           console.log("res.data.data",res.data.data)
            let data = JSON.parse(res.data.data)
           console.log("return_data0",return_data)
           return_data = data.data
           console.log("return_data1",return_data)
           this.shop_obj.shop_id = return_data['id']
           this.shop_obj.shop_name = return_data['shop_name']
           this.shop_obj.image_url = return_data['shop_logo']
           this.shop_obj.shop_id2  = return_data['report_id__for_event']

           this.shop_obj.monitor_url = "https://lianmengapi.snssdk.com/aweme/v1/store/product/list/?sec_shop_id="+this.shop_obj.shop_id+"&goods_type=1&sort_type=2&sort=0&cursor=0&size=20&iid=3364954170996542&device_id=2995518243341992&channel=juyouliang_douyin_and15&aid=1128&app_name=aweme&version_code=200300&version_name=20.3.0&device_platform=android&os=android&device_type=MI+6s&device_brand=Xiaomi&os_api=23&os_version=6.0.1"


         }
          this.submit_btn_disable = false;
          }).catch(error => {
            alert("访问错误")

          })

      },

      // 确定,将promise断定为resolve状态
      confirm: function () {
        console.log(this.inputValue)





        this.submit_btn_disable = true;
        let url = this.mGLOBAL.DJANGO_SERVER_BASE_URL+"/user/userDouYinShopAdd/"


        console.log(url)
        this.$axios.post(url,{

                        "shop_id": this.shop_obj.shop_id,

                        "shop_id2": this.shop_obj.shop_id2,
                        "image_url": this.shop_obj.image_url,

                        "shop_name": this.shop_obj.shop_name,
                        "remarks": this.shop_obj.remarks,
                        "monitor_url": this.shop_obj.monitor_url,


       }).then((res)=>{

         if(res.data.code === "1000"){

            this.$toast("添加成功")
            this.isShowMessageBox = false;
            this.resolve('confirm');
            this.remove();
         }else{
            alert("修改失败:"+res.data.message)
         }
          this.submit_btn_disable = false;
          }).catch(error => {
            alert("访问错误")
            this.submit_btn_disable = false;
          })

      },


      // 取消,将promise断定为reject状态
      cancel: function () {
        this.isShowMessageBox = false;
        this.reject('cancel');
        this.remove();
      },
      // 弹出messageBox,并创建promise对象
      showMsgBox: function () {
        this.isShowMessageBox = true;
        this.promise = new Promise((resolve, reject) => {
            this.resolve = resolve;
          this.reject = reject;
        });
        // 返回promise对象
        return this.promise;
      },
      remove: function () {
        setTimeout(() => {
          this.destroy();
        }, 300);
      },
      destroy: function () {
        this.$destroy();
        document.body.removeChild(this.$el);
      }
    },
        watch: {



      },
  };
</script>

<style lang="less" scoped>
  .market_table1 td{
    width: 20%;
  }
  .market_table1 input{
    width: 100%;
  }
  .message-box {
    width: 30em;
    position: relative;
    .mask {
      position: fixed;
      top: 0;
      left: 0;
      bottom: 0;
      right: 0;
      z-index: 50000;
      background: rgba(0, 0, 0, 0.5);
    }
    .message-content {
      width: 30em;
      position: fixed;
      box-sizing: border-box;
      padding: 1em;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      border-radius: 0.4em;
      background: #fff;
      z-index: 50001;
      .icon {
        position: absolute;
        top: 1em;
        right: 1em;
        width: 0.9em;
        height: 0.9em;
        color: #878d99;
        cursor: pointer;
        &:hover {
          color: #2d8cf0;
        }
      }
      .title {
        font-size: 1.2em;
        font-weight: 600;
        margin-bottom: 1em;
      }
      .content {
        width: 300px;
        font-size: 1em;
        line-height: 2em;
        color: #555;
      }
      input {

        margin: 1em 0;
        background-color: #fff;
        border-radius: 0.4em;
        border: 1px solid #d8dce5;
        box-sizing: border-box;
        color: #5a5e66;
        display: inline-block;
        font-size: 14px;
        height: 3em;
        line-height: 1;
        outline: none;
        padding: 0 1em;
        &:focus {
          border-color: #2d8cf0;
        }
      }
      .btn-group {
        margin-top: 1em;
        float: right;
        overflow: hidden;
        .btn-default {
          padding: 0.8em 1.5em;
          font-size: 1em;
          color: #555;
          border: 1px solid #d8dce5;
          border-radius: 0.2em;
          cursor: pointer;
          background-color: #fff;
          outline: none;

          &:hover {
            color: #2d8cf0;
            border-color: #c6e2ff;
            background-color: #ecf5ff;
          }
        }

        .btn-primary {
          padding: 0.8em 1.5em;
          font-size: 1em;
          color: #fff;
          border-radius: 0.2em;
          cursor: pointer;
          border: 1px solid #2d8cf0;
          background-color: #2d8cf0;
          outline: none;

          &:hover {
            opacity: .8;
          }
        }
        .btn-confirm {
          margin-left: 1em;
        }
      }
    }
  }
</style>
