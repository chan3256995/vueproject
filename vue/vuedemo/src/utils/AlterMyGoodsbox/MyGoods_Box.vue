
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
          <tr><img v-bind:src="goods_obj.main_img" style="width: 4em;height: 4em"/></tr>
          <tr  >
            <td  ><input v-model="goods_obj.main_img"  placeholder="商品图片" /></td>
            <td  ><input v-model="goods_obj.shop_name" placeholder="档口名" /></td>
            <td><input v-model="goods_obj.user_code" placeholder="用户编码"   /></td>
          </tr>
          <tr>
            <td  ><input v-model="goods_obj.market_name"  placeholder="市场" /></td>
            <td  ><input v-model="goods_obj.floor"  placeholder="楼层" /></td>
            <td  ><input v-model="goods_obj.shop_stalls_no"  placeholder="档口号" /></td>
            <td  ><input v-model="goods_obj.art_no"  placeholder="货号" /></td></tr>
          <tr></tr>
        </table>

        <table class="market_table1">

          <tr>

            <td><input placeholder="颜色"  v-model="goods_obj.goods_color"  /></td>
            <td><input placeholder="尺码"  v-model="goods_obj.goods_size" /></td>
            <td><input placeholder="单价"  type="number" v-model="goods_obj.goods_price" /></td>


          </tr>
          <tr> <td><input v-model="goods_obj.remark"  placeholder="备注"     /></td>
            <td><input v-model="goods_obj.goods_url" placeholder="商品源地址"     /></td>
          </tr>
          <tr>
            <td><input  v-model="taget_url" placeholder="搜款网商品地址"    /></td>
            <td><button class="btn-primary btn-confirm"  @click="get_skw_goods_details(taget_url)"   >抓取信息</button></td>
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

        pay_moneys:0,
        isShowMessageBox: false,
        resolve: '',
        reject: '',
        promise: '', // 保存promise对象
        submit_btn_disable :false,
        // 抓取的目标地址
        taget_url:"",
        goods_obj:{
          user_code:"",
          goods_url:"",
          shop_name:"",
          market_name:"",
          floor:"",
          shop_stalls_no:"",
          main_img:"",
          goods_color:"",
          goods_size:"",
          goods_price:0,
          art_no:'',
          remark:"",



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
      get_skw_goods_details(url){
          let  result = this.mcommon_get_skw_goods_details(url)

          this.goods_obj['goods_url'] = result['goods_url']
          this.goods_obj['shop_name'] = result['shop_name']
          this.goods_obj['market_name'] = result['market_name']
          this.goods_obj['floor'] = result['floor']
          this.goods_obj['shop_stalls_no'] =  result['shop_stalls_no']

           result['shop_stalls_no'] =  this.mcommon_replace_all(result['art_no'])

          this.goods_obj['art_no'] = result['shop_stalls_no']
          this.goods_obj['main_img'] = result['main_img']
          this.goods_obj['goods_color'] = result['goods_color']
          this.goods_obj['goods_size'] = result['goods_size']
          this.goods_obj['goods_price'] = result['goods_price']

      },


      // 确定,将promise断定为resolve状态
      confirm: function () {
        console.log(this.inputValue)





        this.submit_btn_disable = true;
        let url = this.mGLOBAL.DJANGO_SERVER_BASE_URL+"/user/userGoodsAdd/"

        console.log(url)
        this.$axios.post(url,{
                      "origin_url": this.goods_obj.goods_url,
                        "image_url": this.goods_obj.main_img,
                        "user_code":  this.goods_obj.user_code,
                        "shop_market_name": this.goods_obj.market_name,
                        "replace_string": '',
                        "shop_floor": this.goods_obj.floor,
                        "shop_stalls_no": this.goods_obj.shop_stalls_no,
                        "shop_name": this.goods_obj.shop_name,
                        "goods_price": this.goods_obj.goods_price,
                        "goods_color": this.goods_obj.goods_color,
                        "goods_size": this.goods_obj.goods_size,
                        "remarks": this.goods_obj.remark,
                        "art_no": this.goods_obj.art_no,

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
