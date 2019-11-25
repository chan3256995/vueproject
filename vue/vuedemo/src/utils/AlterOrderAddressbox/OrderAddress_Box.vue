
<!-- 自定义 QRBox 组件 -->
<template>
  <div class="message-box" v-show="isShowMessageBox">
    <div class="mask" @click="cancel"></div>
    <div class="message-content">
      <svg class="icon" aria-hidden="true" @click="cancel">
        <use xlink:href="#icon-delete"></use>
      </svg>
      <h3 class="title">{{ title }}</h3>
      <!--<p class="content">{{ content }}</p>-->
      <div  >
        <table class="market_table1">
          <tr  >
            <td  ><input  placeholder='姓名' v-model="orderBackUp.name" /></td>
            <td  ><input placeholder='手机' v-model="orderBackUp.phone"  /></td>
            <td  > </td>

          </tr>
          <tr  >
            <td  ><input  placeholder='省份' v-model="orderBackUp.province" /></td>
            <td  ><input placeholder='城市' v-model="orderBackUp.city"  /></td>
            <td  ><input placeholder='地区' v-model="orderBackUp.area"   /></td>

          </tr>
          <tr></tr>
        </table>
        <input style="width: 70%; height: 5em;"  v-model="orderBackUp.address_detail"  placeholder='详细地址'/>
      </div>
      <div>

      </div>


      <div>
        <input style="width: 70%; height: 5em;" placeholder='新地址' v-model="new_address"/>
        <button @click="onAddAddressClick(new_address)"  class="btn-primary btn-confirm" >识别地址</button>
      </div>
      <div class="btn-group">

        <button class="btn-default" @click="cancel" v-show="isShowCancelBtn">{{ cancelBtnText }}</button>
        <button class="btn-primary btn-confirm" :disabled="submit_btn_disable" @click="confirm" v-show="isShowConfimrBtn">{{ confirmBtnText }}</button>
      </div>
    </div>
  </div>
</template>

<script>
   import mStringUtils from "../mStringUtils.js"
  export default {
    props: {
      order:{},
      orderBackUp:{},
      title: {
        type: String,
        default: '标题'
      },
      content: {
        type: String,
        default: '这是弹框内容'
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
        pay_moneys:0,
        isShowMessageBox: false,
        resolve: '',
        reject: '',
        promise: '', // 保存promise对象
        submit_btn_disable :false,
        new_address:'',

      };
    },
    created(){

    },
    mounted(){
    console.log('orderBackUp',this.orderBackUp)


    },


    methods: {

   // 识别地址
      onAddAddressClick(address_str){

           address_str = mStringUtils.replace_redundance_str(address_str)
          //一个分号结束代表一个订单
          let addressObj = mStringUtils.getAddressInfo(address_str);
           this.orderBackUp = addressObj




          },

      // 确定,将promise断定为resolve状态
      confirm: function () {

        this.submit_btn_disable = true;
        let url = this.mGLOBAL.DJANGO_SERVER_BASE_URL+"/user/alterOrderAddress/"

        console.log(url)
        console.log('this.orderGoodsBackUp',this.orderBackUp)
        this.$axios.post(url,{

           'order':Object.assign({'order_number':this.order.order_number},this.orderBackUp)

       }).then((res)=>{

         if(res.data.code === "1000"){
             alert("修改成功")
            this.order.consignee_name = this.orderBackUp.name
            this.order.consignee_phone = this.orderBackUp.phone
            this.order.consignee_address = this.orderBackUp.province+","+ this.orderBackUp.city+","+this.orderBackUp.area+","+this.orderBackUp.address_detail
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
