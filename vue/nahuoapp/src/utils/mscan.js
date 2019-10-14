
let scan = null;
let styles = {frameColor: "#2e5dea",scanbarColor: "#2e5dea",position:"absolute"};//边框属性，中间线属性，背景色

let filter;//扫码格式 空为全类型
 // filter = [plus.barcode.QR, plus.barcode.EAN8, plus.barcode.EAN13];


   // 加载用户信息
export default {


 // 创建扫描控件
    startRecognize(onmarked) {
       filter = [window.plus.barcode.QR,window.plus.barcode.CODE128];
      if (!window.plus) return;
      scan = new plus.barcode.Barcode(
        "bcid",filter,styles
      );
      scan.onmarked = onmarked;

      // 开始扫描
      scan.start();
      // function onmarked(type, result, file) {
      // //   switch (type) {
      // //     case plus.barcode.QR:
      // //       type = "QR";
      // //       break;
      // //     case plus.barcode.EAN13:
      // //       type = "EAN13";
      // //       break;
      // //     case plus.barcode.EAN8:
      // //       type = "EAN8";
      // //       break;
      // //     default:
      // //       type = "其它" + type;
      // //       break;
      // //   }
      //   result = result.replace(/\n/g, "");
      //   that.codeUrl = result;
      //   // window.localStorage.codeUrl = result;
      //  alert(result);
      //    that.closeScan();
      // }
    },
   // 关闭返回
    closeScan() {
      if (!window.plus) return;
      scan.close();
      // this.$router.push({ path: "/home" });
    },
}



