<template>
  <div class="scan">
    <header>
      <p @click="mcloseScan">返回</p>

      <button @click="mstartRecognize">startRecognize</button>
      <span>请扫码二维码</span>
      <p @click="scanImg">相册</p>
       <span >{{codeUrl}}</span>
    </header>

    <div v-show="is_scan_show" id="bcid">
      <div style="height:60%"></div>
      <p class="tip">...载入中...</p>
    </div>
  </div>
</template>

<script type='text/ecmascript-6'>
  import mscan from '../utils/mscan.js'
let scan = null;
let styles = {frameColor: "#2e5dea",scanbarColor: "#2e5dea",};//边框属性，中间线属性，背景色
 // let filter = [plus.barcode.QR, plus.barcode.EAN8, plus.barcode.EAN13];
let filter;//扫码格式 空为全类型
export default {
  name: 'qrtest',
  data() {
    return {
      codeUrl2: "",
      codeUrl: "666",
      is_scan_show: false
    };
  },


  methods: {

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
        this.codeUrl = result;
        // window.localStorage.codeUrl = result;
       alert(result);
        this.mcloseScan()

      },

    mstartRecognize(){
        this.is_scan_show = true
        let that = this
        setTimeout(function () {
        mscan.startRecognize(that.onmarked)
      },1000);


    },

    mcloseScan(){
       this.is_scan_show = false
       mscan.closeScan()
    },


    scanImg() {
      // 从系统相册选择文件
      if (!window.plus) return;
      plus.gallery.pick(
        function(path) {
         // alert(path);
          plus.barcode.scan(
            path,
            function(type, result) {
             // alert("Scan success:(" + type + ")" + result);
              window.localStorage.codeUrl2 = result;
            },
            function(e) {
              console.log(e);
              window.localStorage.codeUrl2 = e;
              plus.nativeUI.alert("如果图片无法识别,请用扫码上传");
            }
          );
        },
        function(e) {
          alert("取消选择图片");
        },
        { filter: "image" }
      );
    }
  }
};
</script>
<style  >
.scan {
  height: 100%;
}
  .scan  #bcid {
    width: 100%;
    position: absolute;
    left: 0;
    right: 0;
    top: 1rem;
    bottom: 0;
    text-align: center;
    color: #fff;
    background: #ccc;
  }
  .scan  header {
    position: absolute;
    display: flex;
    justify-content: space-between;
    font-size: 16px;
    color:#009DE2;
    left: 0.3rem;
    top: 0;
    right: 0.3rem;
    height: 1rem;
    line-height: 1rem;
    z-index: 2;

  }
  .scan header span{
      color: #000;
    }
</style>

