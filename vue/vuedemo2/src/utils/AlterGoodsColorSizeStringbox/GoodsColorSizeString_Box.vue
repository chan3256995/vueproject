
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
          <tr>
            <td>旧字符(包括颜色尺码)</td>
            <td>新字符(包括颜色尺码)</td>
          </tr>
          <tr v-for="(item,index) in  replace_obj_list">
            <td><input placeholder="旧字符"  v-model="item.old"     /> </td>
            <td><input placeholder="新字符"  v-model="item.new" /> </td>
            <td><button @click="delete_item(index)">删除</button></td>
          </tr>

          <tr> <button class="btn-primary btn-confirm"   @click="add_item"  > 添加 </button></tr>
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
        replace_obj_list:[],
        pay_moneys:0,
        isShowMessageBox: false,
        resolve: '',
        reject: '',
        promise: '', // 保存promise对象
        submit_btn_disable :false,


      };
    },
    created(){
      console.log("myGoods",this.myGoods)

    },
    mounted(){
      console.log("myGoods",this.myGoods)
       this.get_goods({"id_list":JSON.stringify([this.myGoods.id])})
      // Object.assign(this.orderGoodsBackUp,this.orderGoods)

    },


    methods: {
      delete_item:function(index){

         this.replace_obj_list.splice(index,1)

      },
      add_item:function(){

       // this.myGoods.replace_string.push({ "old":"旧字符",'new':"新字符"})
        this.replace_obj_list.push({ "old":"旧字符",'new':"新字符"})
        //  let mlist = []
        //  mlist = this.myGoods.replace_string
        // this.$delete(this.myGoods, 'replace_string');
        // this.$set(this.myGoods,'replace_string',mlist)



        console.log(this.replace_obj_list)
      },
      // 确定,将promise断定为resolve状态
      confirm: function () {
        this.submit_btn_disable = true;
         this.alter_goods(this.myGoods)








      },
        //获取商品
         get_goods(query_data){
             const url = this.mGLOBAL.DJANGO_SERVER_BASE_URL+"/user/userGoodsInfo/";
              this.$axios.get(url,{params:query_data}).then((res)=>{

              if(res.data.results !== undefined  && res.data.results.length ===1){



                 this.myGoods = res.data.results[0]
                if(this.myGoods['replace_string']!==undefined && this.myGoods['replace_string'] !==""){
                    this.replace_obj_list = JSON.parse(this.myGoods['replace_string'])
                }

                console.log("666", this.replace_obj_list)

              }
              this.submit_btn_disable = false;
            }).catch(error=>{

                this.$toast("请求错误")

            })
         },
       // 修改商品信息
          alter_goods(goods){
              if(!confirm("确定修改订单吗？")) {
                return ;
              }
              const url = this.mGLOBAL.DJANGO_SERVER_BASE_URL+"/user/userGoodsEdit/";
              let post_goods = {
     	          "user_goods_data":{
     	   	      "id":goods.id,
     	   	      "origin_url": goods.origin_url,
                        "image_url": goods.image_url,
                        "user_code":  goods.user_code,
                        "replace_string": JSON.stringify(this.replace_obj_list),
                        "shop_market_name": goods.shop_market_name,
                        "shop_floor": goods.shop_floor,
                        "shop_stalls_no": goods.shop_stalls_no,
                        "art_no": goods.art_no,
                        "shop_name": goods.shop_name,
                        "goods_price": goods.goods_price,
                        "goods_color": goods.goods_color,
                        "goods_size": goods.goods_size,
                        "remarks": goods.remarks,



                        "is_default": goods.is_default,
     	          }
     }
               this.$axios.post(url,post_goods).then((res)=>{
              if(res.data.code ==="1000"){
                console.log(res.data)

                this.$toast("添加成功")
                this.isShowMessageBox = false;
                this.resolve('confirm');
                this.remove();
              }else{
                this.$toast("修改密码失败！"+res.data.message)
              }
              this.submit_btn_disable = false;
            }).catch(error=>{
                console.log("提交失败")
                this.$toast("请求错误")
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
