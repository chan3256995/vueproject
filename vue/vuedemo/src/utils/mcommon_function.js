
import  axios  from 'axios'
export default {

    data () {
      return {
         axios:axios,
         skw_goods_obj:{}

      };
    },
   copyToClipboard(txt) {
   if (window.clipboardData) {
    window.clipboardData.clearData();
    window.clipboardData.setData("Text", txt);
    alert("复制成功！");

   } else if (navigator.userAgent.indexOf("Opera") != -1) {
    window.location = txt;
   } else if (window.netscape) {
    try {
     window.netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect");
    } catch (e) {
     alert("被浏览器拒绝！\n请在浏览器地址栏输入'about:config'并回车\n然后将 'signed.applets.codebase_principal_support'设置为'true'");
    }
    let clip = Components.classes['@mozilla.org/widget/clipboard;1'].createInstance(Components.interfaces.nsIClipboard);
    if (!clip)
     return;
    let trans = Components.classes['@mozilla.org/widget/transferable;1'].createInstance(Components.interfaces.nsITransferable);
    if (!trans)
     return;
    trans.addDataFlavor("text/unicode");
    let str = new Object();
    let len = new Object();
     str = Components.classes["@mozilla.org/supports-string;1"].createInstance(Components.interfaces.nsISupportsString);
    let copytext = txt;
    str.data = copytext;
    trans.setTransferData("text/unicode", str, copytext.length * 2);
    let clipid = Components.interfaces.nsIClipboard;
    if (!clip)
     return false;
    clip.setData(trans, null, clipid.kGlobalClipboard);
    alert("复制成功！");
   }
  },
  
   copy_to_clipboard(copyTxt)
        {
            let createInput = document.createElement('input');
            createInput.value = copyTxt;
            document.body.appendChild(createInput);
            createInput.select(); // 选择对象
            document.execCommand("Copy"); // 执行浏览器复制命令
            createInput.className = 'createInput';
            createInput.style.display='none';
            alert("复制成功");//没有layui的可以改为alert
        },
  
  

methods: {


      //抓取信息
   mcommon_get_skw_goods_details(url){
        console.log("开始抓取.....")

        let responsse_obj = {
          goods_url:"",
          shop_name:"",
          market_name:"",
          floor:"",
          shop_stalls_no:"",
          art_no:"",
          main_img:"",
          goods_color:"",
          goods_size:"",
          goods_price:0,
        }
          $.ajax({
          async : false,
          url :url,
          type : "GET",

          timeout : 5000,
          success : function(res) {
             console.log("result",res)
             let resopnse_text = res
             let htmlt = resopnse_text.substring(resopnse_text.indexOf("<html>"),resopnse_text.indexOf("</html>")+7)
             let dom = $($.parseHTML(htmlt))
             let shop_div = dom.find(".shop-wrapper")
             let shop_address_dd = dom.find("dt:contains('地址')").next()
             let shop_name = $(dom.find(".shop-title")[0]).text().replace("修改信息","").trim()
             console.log("shop_address_dd:",shop_address_dd)
              let address_text = $(shop_address_dd[0]).text().trim()
               console.log("address_text:",address_text)
              let address_arr = address_text.replace("  "," ").split(" ")
              let market_name = address_arr[0]
              let floor = address_arr[1].replace("楼","F")
              let shop_stalls_no = address_arr[2].trim()
              let main_img_arr = resopnse_text.match(/_INDEXIMGURL = '(.*?)'/,resopnse_text)
              let art_no_arr = resopnse_text.match(/_ARTNO = '(.*?)'/,resopnse_text)
              let goods_url= url
              let goods_color_arr = resopnse_text.match(/_COLOR = '(.*?)'/,resopnse_text)
              let goods_size_arr = resopnse_text.match(/_SIZE = '(.*?)'/,resopnse_text)
              let goods_price_arr = resopnse_text.match(/_DISCOUNTPRICE = '(.*?)'/,resopnse_text)

              let art_no = ""
              let main_img = ""
              let goods_color = ""
              let goods_size = ""
              let goods_price = 0
              if(main_img_arr.length !== 0){
                main_img = main_img_arr[0].substring("_INDEXIMGURL = '".length,main_img_arr[0].length-1)
              }
              if(art_no_arr.length !== 0){
                art_no = art_no_arr[0].substring("_ARTNO = '".length,art_no_arr[0].length-1)
              }
              if(goods_color_arr.length !== 0){
                goods_color = goods_color_arr[0].substring("_COLOR = '".length,goods_color_arr[0].length-1)
              }
              if(goods_size_arr.length !== 0){
                goods_size = goods_size_arr[0].substring("_SIZE = '".length,goods_size_arr[0].length-1)
              }
              if(goods_price_arr.length !== 0){
                goods_price = goods_price_arr[0].substring("_DISCOUNTPRICE = '".length,goods_price_arr[0].length-1)
              }
              responsse_obj['goods_url'] = goods_url
              responsse_obj['shop_name'] = shop_name
              responsse_obj['market_name'] = market_name
              responsse_obj['floor'] = floor
              responsse_obj['shop_stalls_no'] = shop_stalls_no
              responsse_obj['art_no'] = art_no
              responsse_obj['main_img'] = "http:"+main_img
              responsse_obj['goods_color'] = goods_color
              responsse_obj['goods_size'] = goods_size
              responsse_obj['goods_price'] = goods_price
              console.log("抓取搜款网商品结果responsse_obj",responsse_obj)
            },
          error:function (err) {
             console.log("错了:" + err);

            }
          });



        return responsse_obj
      },

   mcommon_get_skw_goods_details2(url){

      let p1 = new Promise((resolve, reject) => {
         let responsse_obj = {
          goods_url:"",
          shop_name:"",
          market_name:"",
          floor:"",
          shop_stalls_no:"",
          art_no:"",
          main_img:"",
          goods_color:"",
          goods_size:"",
          goods_price:0,
        }

        this.$axios.get(url,{}).then((res)=>{

         let resopnse_text = res['data']

         let htmlt = resopnse_text.substring(resopnse_text.indexOf("<html>"),resopnse_text.indexOf("</html>")+7)
         let dom = $($.parseHTML(htmlt))
         let shop_div = dom.find(".shop-wrapper")
         let shop_address_dd = dom.find("dt:contains('地址')").next()
         let shop_name = $(dom.find(".shop-title")[0]).text().replace("修改信息","").trim()
         console.log("shop_address_dd:",shop_address_dd)
          let address_text = $(shop_address_dd[0]).text().trim()
           console.log("address_text:",address_text)
          let address_arr = address_text.replace("  "," ").split(" ")
          let market_name = address_arr[0]
          let floor = address_arr[1].replace("楼","F")
          let shop_stalls_no = address_arr[2].trim()
          let main_img_arr = resopnse_text.match(/_INDEXIMGURL = '(.*?)'/,resopnse_text)
          let art_no_arr = resopnse_text.match(/_ARTNO = '(.*?)'/,resopnse_text)
          let goods_url= url
          let goods_color_arr = resopnse_text.match(/_COLOR = '(.*?)'/,resopnse_text)
          let goods_size_arr = resopnse_text.match(/_SIZE = '(.*?)'/,resopnse_text)
          let goods_price_arr = resopnse_text.match(/_DISCOUNTPRICE = '(.*?)'/,resopnse_text)

          let art_no = ""
          let main_img = ""
          let goods_color = ""
          let goods_size = ""
          let goods_price = 0
          if(main_img_arr.length !== 0){
            main_img = main_img_arr[0].substring("_INDEXIMGURL = '".length,main_img_arr[0].length-1)
          }
          if(art_no_arr.length !== 0){
            art_no = art_no_arr[0].substring("_ARTNO = '".length,art_no_arr[0].length-1)
          }
          if(goods_color_arr.length !== 0){
            goods_color = goods_color_arr[0].substring("_COLOR = '".length,goods_color_arr[0].length-1)
          }
          if(goods_size_arr.length !== 0){
            goods_size = goods_size_arr[0].substring("_SIZE = '".length,goods_size_arr[0].length-1)
          }
          if(goods_price_arr.length !== 0){
            goods_price = goods_price_arr[0].substring("_DISCOUNTPRICE = '".length,goods_price_arr[0].length-1)
          }
          responsse_obj['goods_url'] = goods_url
          responsse_obj['shop_name'] = shop_name
          responsse_obj['market_name'] = market_name
          responsse_obj['floor'] = floor
          responsse_obj['shop_stalls_no'] = shop_stalls_no
          responsse_obj['art_no'] = art_no
          responsse_obj['main_img'] = "http:"+main_img
          responsse_obj['goods_color'] = goods_color
          responsse_obj['goods_size'] = goods_size
          responsse_obj['goods_price'] = goods_price
          console.log("抓取搜款网商品结果responsse_obj",responsse_obj)
           this.$toast("抓取完成！");
           this.skw_goods_obj =  responsse_obj

          }).catch(error => {

             console.log("访问错误：",error)
          })


      });

      Promise.all([p1]).then((res) => {
      return this.skw_goods_obj
})


   },

   mcommon_return_url_params(url){
     let index1 = url.indexOf("?")
     let params_str = url.substring(index1+1,url.length)
     let params_obj = {}
     let params_arr = params_str.split("&")
     for(let i=0;i<params_arr.length;i++){
       let params_item_arr = params_arr[i].split("=")
       params_obj[params_item_arr[0]] = params_item_arr[1]
     }
     return params_obj
   }

}

}


