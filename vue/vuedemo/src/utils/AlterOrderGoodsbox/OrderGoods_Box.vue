
<!-- 自定义 QRBox 组件 -->
<template>
  <div class="message-box" v-show="isShowMessageBox">
    <div class="mask" @click="cancel"></div>
    <div class="message-content">
      <svg class="icon" aria-hidden="true" @click="cancel">
        <use xlink:href="#icon-delete"></use>
      </svg>
      <div><label style="color: red">{{ skw_goods_info_obj.goods_color }}</label> <label style="color: red">{{ skw_goods_info_obj.goods_size }}</label></div>


      <h3 class="title">{{ title }}</h3>
      <p class="content">{{ content }}</p>
      <div  >
        <table class="market_table1">
          <tr  >
            <td  >市场</td>
            <td  >楼层</td>
            <td  >档口号</td>
            <td >货号</td>
          </tr>
          <tr  >
            <td  ><input v-model="orderGoodsBackUp.shop_market_name"/></td>
            <td  ><input v-model="orderGoodsBackUp.shop_floor" /></td>
            <td  ><input v-model="orderGoodsBackUp.shop_stalls_no"  /></td>
            <td  ><input v-model="orderGoodsBackUp.art_no"  /></td>
          </tr>
          <tr></tr>
        </table>

        <table class="market_table1">
          <tr>
            <td>颜色/尺码</td>
            <td>单价</td>
            <td>数量</td>

          </tr>
          <tr>
            <td><input v-model="orderGoodsBackUp.goods_color"  /></td>
            <td><input type="number" v-model="orderGoodsBackUp.goods_price" /></td>
            <td><input type="number" v-model="orderGoodsBackUp.goods_count"     /></td>

          </tr>
          <tr>
            <td><input  v-model="skw_url" placeholder="抓取的搜款网地址" /></td>
            <td> <button class="btn-default" @click="get_skw_goods_details(skw_url)"   >开始抓取</button></td>

          </tr>
        </table>

      </div>
      <div v-if="orderGoodsBackUp.status !== mGlobal.GOODS_STATUS2['未付款']">
        <div>
        <label>应付金额：</label><label style="color: red"> {{pay_moneys}}</label><label>元</label><label style="color: red">（负数为应退金额，正数为应付金额）</label>
      </div>
      <table style="text-align: center">
        <tr>
          <td> <label style="float: left">支付密码：</label></td>
          <td> <input style="width:15em;" type="password" v-model="inputValue" v-if="isShowInput" ref="input" @keyup.enter="confirm"></td>
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
   import mGlobal from '../../utils/mGlobal';
   import mcommon_function from '../../utils/mcommon_function';
  export default {
    // 复用模块组件
    mixins:[mcommon_function],
    props: {
      orderGoods:{},
      orderGoodsBackUp:{},
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
        mGlobal:mGlobal,
        skw_url:"",
        skw_goods_info_obj:"",
        pay_moneys:0,
        isShowMessageBox: false,
        resolve: '',
        reject: '',
        promise: '', // 保存promise对象
        submit_btn_disable :false,
      };
    },
    created(){

    },
    mounted(){

      // Object.assign(this.orderGoodsBackUp,this.orderGoods)

    },


    methods: {
      // 获取搜款网信息
      get_skw_goods_details(url){
        console.log("获取搜款网信息:"+url)
        if(url === undefined || url === ""){
          this.$toast("地址不能为空！");
          return
        }


        let  result = this.mcommon_get_skw_goods_details(url)
        this.skw_goods_info_obj = result

        this.orderGoodsBackUp.shop_market_name =result['market_name']
        this.orderGoodsBackUp.shop_floor = result['floor']
        this.orderGoodsBackUp.shop_stalls_no = result['shop_stalls_no']
        this.orderGoodsBackUp.goods_price = result['goods_price']
        this.orderGoodsBackUp.art_no =this.mcommon_replace_all(result['art_no'])



      },

      // 计算差价
      calc_price(){
        this.pay_moneys  = (this.orderGoodsBackUp.goods_price * this.orderGoodsBackUp.goods_count) - (this.orderGoods.goods_price * this.orderGoods.goods_count)
        console.log('pay_moneys',this.pay_moneys)
      },

      // 确定,将promise断定为resolve状态
      confirm: function () {
        console.log(this.inputValue)
        if(this.orderGoodsBackUp.status  !== mGlobal.GOODS_STATUS2['未付款']){
           if(this.inputValue === "" || this.inputValue === undefined){
          alert("支付密码不能为空")
          return
        }
        }

        if(isNaN(this.orderGoodsBackUp.goods_price) ||  this.orderGoodsBackUp.goods_price === 0 ){
          alert("价格必须大于 0 ")
          return
        }


         if(isNaN(this.orderGoodsBackUp.goods_count) ||  this.orderGoodsBackUp.goods_count < 1   ){
          alert("数量必须大于 0 的整数")
          return
        }
        this.submit_btn_disable = true;
        let url = this.mGLOBAL.DJANGO_SERVER_BASE_URL+"/user/alterOrderGoodsDetails/"

        console.log(url)
        this.$axios.post(url,{
           'new_order_goods':this.orderGoodsBackUp,
           'pay_pwd':this.inputValue

       }).then((res)=>{

         if(res.data.code === "1000"){
             alert("修改成功")
            this.orderGoods.goods_price = this.orderGoodsBackUp.goods_price
           this.$delete(this.orderGoods,'goods_price')
           this.$set(this.orderGoods,'goods_price', this.orderGoodsBackUp.goods_price)
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

         'orderGoodsBackUp.goods_price': function(newVal,oldVal) {

            this.calc_price()

         },
          'orderGoodsBackUp.goods_count':function(newVal,oldVal){
           console.log('goods_count',newVal, oldVal)

             this.calc_price()
          }
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
