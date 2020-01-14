
function test2(){
        let cookies_str = "thw=cn; x=e%3D1%26p%3D*%26s%3D0%26c%3D0%26f%3D0%26g%3D0%26t%3D0%26__ll%3D-1%26_ato%3D0; UM_distinctid=16e05f0e1cbb-00cfe32c7d77f6-414f0120-100200-16e05f0e1e198; ali_ab=14.145.20.89.1573560710123.3; enc=qYWvpLGuick%2Bhk6UxW09VN4q7nbQ%2B7E%2BbHUE%2Fr%2F%2FS45ELZMl1w1hADasz6Ef8fKzdcOY79b0rD65aln%2Fouq6Fw%3D%3D; _tb_token_=3b188ee531e13; _m_h5_tk=294cdb948d414fd13cf2cbe27d1f11ee_1578508753416; _m_h5_tk_enc=6cac515c2a928e80a5a0b0b5eadfdce1; hng=CN%7Czh-CN%7CCNY%7C156; cna=wM0AFqmil2ACAQ6RFdC6+aZ7; v=0; unb=467630318; uc3=nk2=Dl9OSr7zuFtrsHxW&vt3=F8dBxdkPcshw7druT0I%3D&id2=VypX6SrwnB2D&lg2=UtASsssmOIJ0bQ%3D%3D; csg=3f2f5c22; lgc=moonlight539; t=9aadd5cb9e648a6ef819fab9412b4f2c; cookie17=VypX6SrwnB2D; dnk=moonlight539; skt=80cb40d22cbfb37a; cookie2=7aa0e53d696146d2ca0bc63a970984e6; existShop=MTU3ODU4MzUzOQ%3D%3D; uc4=id4=0%40VX09oVN3jNtOEoQ3xYH23218yXs%3D&nk4=0%40DDrLLMRjgg0NBiw%2B4kn75YvcyBmAlkk%3D; tracknick=moonlight539; mt=ci=8_1; _cc_=WqG3DMC9EA%3D%3D; tg=0; _l_g_=Ug%3D%3D; sg=982; _nk_=moonlight539; cookie1=UojUVLRQa87pXVPPGSFD6QOf%2F%2Fm0wWOHAeNIbLq7vI4%3D; lui=VypX6SrwnB2D; luo=Uw%3D%3D; uc1=cookie14=UoTbldfTL%2F2r2w%3D%3D&lng=zh_CN&cookie16=URm48syIJ1yk0MX2J7mAAEhTuw%3D%3D&existShop=true&cookie21=UIHiLt3xTwwM1tbQXg%3D%3D&tag=8&cookie15=V32FPkk%2Fw0dUvg%3D%3D&pas=0; l=dBQb0belqGel3MdyBOCCnurza779SIRYYuPzaNbMi_5IF186-I_OoY2XceJ6cjWftM8B4fuWYvy9-etkiIRBJhSUvddkZxDc.; isg=BPj4EFuH0kwo2T1sUx0dRtNiyaaKYVzryfr9kjJpQDPkTZg32nDle-5vBQXYBhTD"
        let cooke_arr = cookies_str.split(";")
         console.log(cooke_arr)
        // for(let i = 0 ; i<cooke_arr.length;i++){
        //   this.$cookies.set(cooke_arr[i].split('=')[0].trim(),cooke_arr[i].split('=')[1].trim())
        // }
        // let url = "https://wuliu.taobao.com/user/order_list_new.htm?spm=a1z09.1.category.d679.8c653606B7SmTj&order_status_show=send&mytmenu=fh"
        let url = "http://192.168.1.110:8009/trade/logistics/"
        // let url = "/api444"
        // let url = "api444//trade/itemlist/list_sold_items.htm?action=itemlist/SoldQueryAction&event_submit_do_query=1&auctionStatus=SEND&tabCode=haveSendGoods"
        let query_data = {
      'action':	'itemlist/SoldQueryAction',
      'auctionType':	0,
'buyerNick':'',
'close':	0,
'dateBegin':0,
'dateEnd':	0,
'logisticsService':'',
'orderStatus':'SEND',
'pageNum':	1,
'pageSize':	15,
'queryMore':	true,
'queryOrder':'desc',
'rateStatus':'',
'refund':'',
'rxAuditFlag':	0,
'rxElectronicAllFlag':	0,
'rxElectronicAuditFlag':	0,
'rxHasSendFlag':0,
'rxOldFlag':	0,
'rxSendFlag':	0,
'rxSuccessflag':	0,
'rxWaitSendflag':	0,
'sellerNick':'',
'tabCode':	'haveSendGoods',
'tradeTag':0,
'useCheckcode':	false,
'useOrderInfo':	false,
'errorCheckcode':false,
'prePageNo':	2}
$.ajax({
            async : false,
            url :url,
            type : "GET",
            // dataType : 'json',
    xhrFields: {
       withCredentials: true
    },
            // data : {'tb_order_number_list':order_number_list},
            timeout : 5000,
            success : function(result) {
 console.log("testddd:",result)
                    alert("testddd:"+result)

            },
            error:function (err) {
                console.log("错了:" + err);
                 alert("testddd:"+err)
            }
        });

// ***********************************
//         axios.post(
//           // url,qs.stringify(query_data),
//           url, qs.stringify(query_data),
//           {headers: { 'content-type': 'application/x-www-form-urlencoded','Referer': 'https://trade.taobao.com/trade/itemlist/list_sold_items.htm?action=itemlist/SoldQueryAction&event_submit_do_query=1&auctionStatus=SEND&tabCode=haveSendGoods' }},
//           // {headers: {'token': 'Bearer ','Content-Type': 'multipart/form-data','referer':'https://trade.taobao.com/trade/itemlist/list_sold_items.htm?action=itemlist/SoldQueryAction&event_submit_do_query=1&auctionStatus=SEND&tabCode=haveSendGoods','origin':'https://trade.taobao.com','user-agent':'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/49.0.2623.112 Safari/537.369'},}
//         ).then((res)=>{
//         console.log("结果 ：",res)
//
//           }).catch(error => {
//             alert("访问错误")
//             alert(error)
//
//           })
         // ***********************************
      }
chrome.webRequest.onBeforeRequest.addListener(
    function(details) {
        // console.log("details.url",details.url)
    },
    {urls: ["<all_urls>"]},
  ["blocking"]
);
chrome.webRequest.onCompleted.addListener(
    function(details) {
        if(details.url.indexOf("trade.taobao.com/trade/itemlist/asyncSold.htm")!== -1){
            console.log("details:",details)
         chrome.tabs.query({active: true, currentWindow: true}, function(tabs)
      {
          chrome.tabs.sendMessage(tabs[0].id, {from:'background',method:'update_page_data',to:'list_sold_page'}, function(response)
          {

          });
      });
        }
    },{urls: ["<all_urls>"]}
);
console.log("chrome.webRequest:",chrome.webRequest)
console.log("chrome:",chrome)
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
	var method = request.method;
alert("background_messsage_listener:"+request)
	if (method == "get_orders") {

            let order_number_list = request.order_number_list
		   $.ajax({
            async : false,
            url :"http://192.168.1.110:8009/user/getOrderByTBOrderNumberList/",
            type : "GET",
            // dataType : 'json',
            data : {'tb_order_number_list':order_number_list},
            timeout : 5000,
            success : function(result) {
                 sendResponse(JSON.stringify(result));
                    console.log(result)
            },
            error:function (err) {
                console.log("错了:" + err);
            }
        });

	}
	if(method == "test"){
	    test2()
    }

 //xmlHttp-------------- start
 //          var xmlHttp = new XMLHttpRequest();
 //        xmlHttp.open("GET", "http://192.168.1.110:8009/trade/logistics/", true);
 //
 //        xmlHttp.onreadystatechange = function() {
 //        sendResponse("hiii9999");
 //            if(this.readyState==4 && this.status==200){
 //                console.log(this.responseText)
 //
 //            }
 //        };
 //        xmlHttp.send();
 //xmlHttp-------------- end




	// if (request.content) {
	// var content = request.content;
	// }
	// console.log(request);
	// console.log(sender);
	// console.log(sendResponse);
});

/*
chrome.browserAction.setBadgeText({
   text: "55"
 });
*/

// get_msg();

// setInterval(function () { get_msg();}, 1000 * 60 * 10);







