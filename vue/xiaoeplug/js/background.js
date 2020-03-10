var back_base_url = "http://192.168.2.110:8009"
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

	if (method == "get_orders") {

           let order_number_list = request.order_number_list
           let result = get_one_page_order(order_number_list)
           sendResponse(JSON.stringify(result));
	}else if (method === "get_orders2") {
            let page_size = 15
            if(request.page_size!==undefined && request.page_size !== null){
                page_size = request.page_size
            }
            let order_number_list = request.order_number_list
            let group_list =  group(JSON.parse(order_number_list),page_size)
            let all_result_list = []
            for(let i = 0 ;i<group_list.length;i++){
                let result = get_one_page_order(JSON.stringify(group_list[i]))
               all_result_list =  all_result_list.concat(result.results)
           }

            sendResponse(JSON.stringify(all_result_list));

	}else if(method === "get_order_from_tb"){
	    let all_result_list = get_all_page_order_from_tb()
         sendResponse(JSON.stringify(all_result_list));
    }else if(method ==="remove_cookies"){


	    chrome.cookies.remove({url:"https://main.m.taobao.com/olist/index.html",name:"cookie2"})
        sendResponse("success")
    }
	if(method == "test"){
	    test2()
    }

});
function group(array, subGroupLength) {
    console.log("array:------>",array)
      let index = 0;
      let newArray = [];
      while(index < array.length) {
          newArray.push(array.slice(index, index += subGroupLength));
      }
      return newArray;
  }
function get_one_page_order(order_number_list) {
            let ret_result = null
		   $.ajax({
            async : false,
            url :back_base_url+"/user/getOrderByTBOrderNumberList/",
            type : "GET",
            // dataType : 'json',
            data : {'tb_order_number_list':order_number_list},
            timeout : 5000,
            success : function(result) {
                    console.log("page_result:",result)
                    ret_result =  result
                 
            },
            error:function (err) {
                console.log("错了:" + err);
            }
        });
            return ret_result
}

/*
chrome.browserAction.setBadgeText({
   text: "55"
 });
*/

// get_msg();

// setInterval(function () { get_msg();}, 1000 * 60 * 10);



function get_page_order_from_tb(page_number,page_counts){

    if(page_number === undefined || page_number === null){
        page_number = 1
    }
    if(page_counts === undefined ||  page_counts === null){
        page_counts = 1
    }
    let request_url = "https://wuliu.taobao.com/user/order_list_new.htm"
    let parms = {
                 "source":"",
                 "callUrl":"",
                 // "_tb_token_":"ffe0157689337",
                 "orderStatusShow" :"send",
                 "receiverName" :"",
                 "receiverWangWangId":"" ,
                 "beginDate" :"",
                 "endDate" :"",
                 "taobaoTradeId" :"",
                 "shipping2":"-1",
                 "orderType":"-1",
                 "orderSource":"0",
                 "currentPage" :page_number,

             }
    let  return_data = null
    $.ajax({
            async : false,
            url :request_url,
            type : "POST",
            // dataType : 'json',
            data : parms,
            timeout : 5000,
            success : function(result) {
                    console.log("result777777777777777",result)
                    let html = result.substring(result.indexOf("<html>"),result.indexOf("</html>")+7)
                         html = $.parseHTML(html)
                     if(page_number===1){
                          let dom = html
                          let page_dom = $(dom).find(".page-top")[0]
                          let  papge_a = $(page_dom).find("a")
                          papge_a.each(function () {
                          if(!isNaN($(this).text())){
                            page_counts = $(this).text()
                        }
                    })
                     }
                    result = get_order_goods_str_from_elems(html)


                    $(html).find(".J_Trigger").each(function () {
                        // console.log("11",$(this))

                    })

                     return_data =  {
                         "result":result,
                         "page_number":page_number,
                         "page_counts":page_counts,
                         "is_success":true
                     }


            },
            error:function (err) {
                console.log("错了:" + err);
                console.log("错了:" + JSON.stringify(err));
                if(JSON.stringify(err).indexOf("NetworkError: Failed to execute 'send'")){
                    return_data =  {"is_success":false, "message":"go_to_login_tb", }
                }else{
                    return_data =  {

                         "is_success":false,
                         "message":"",
                     }
                }

                return return_data
            }
        });

            console.log("return_data",return_data)

     return return_data
}
function get_all_page_order_from_tb(){
    let order_list = []
    let order_page = null

    order_page = get_page_order_from_tb()
    let is_success = order_page.is_success
    if(is_success===false && order_page.message==="go_to_login_tb"){
        return {
                "is_success":false,
                "message":"go_to_login_tb"
            }

          }
     let order_page_result = order_page.result;

     order_list = order_list.concat(order_page_result)
     let page_numb =order_page.page_number
     let page_counts = order_page.page_counts

     while(page_numb < page_counts){

        console.log("page_numb",page_numb)
        console.log("page_counts",page_counts)
        order_page = get_page_order_from_tb(page_numb+1,page_counts)
        if(order_page.is_success===false && order_page.message==="go_to_login_tb"){
            return {"is_success":false,"message":"go_to_login_tb" }

         }
        page_numb =order_page.page_number
        page_counts = order_page.page_counts
        order_list = order_list.concat(order_page.result)
     }


          return    {"result":order_list,"is_success":true }

}
function get_order_goods_str_from_elems(elems){
     if( $(elems).find("label:contains(尺码：)").length !==0){
         $(elems).find("label:contains(尺码：)").next().addClass("17_size");
     }
     if(  $(elems).find("label:contains(尺寸：)").length !==0){
         $(elems).find("label:contains(尺寸：)").next().addClass("17_size");
     }
      var order_list = []
    $(elems).find(".info").not(".msg").each(function() {
        var tbody_elems = $(this).parents("tbody");

        var orderdetail_size = tbody_elems.find(".orderdetail").size();
        var m = "";
        var total = "";

        var order_goods_list=[]
        for (var i = 0; i <= orderdetail_size - 1; i++) {

            var order_goods_obj = {}
            m = "";

            m+= '"img":"'+tbody_elems.find("img:eq("+i+")").attr("src")+'",';
            order_goods_obj['img'] = tbody_elems.find("img:eq("+i+")").attr("src")

            total = tbody_elems.find(".total:eq(" + i + ")").text().toString().trim();
            total = total.substring(total.indexOf("×") + 1).trim();
            order_goods_obj['total'] = total

            if (tbody_elems.find(".desc:eq(" + i + ")").length != 0) {
                m += '"code":"' + tbody_elems.find(".desc:eq(" + i + ")").attr("title")+'",';
                order_goods_obj['code'] = tbody_elems.find(".desc:eq(" + i + ")").attr("title")
            }


            if (tbody_elems.find(".17_size:eq(" + i + ")").length != 0) {
                m += '"size":"' + tbody_elems.find(".17_size:eq(" + i + ")").text().toString() + '",';
                order_goods_obj['size'] = tbody_elems.find(".17_size:eq(" + i + ")").text().toString()
            }
            if (tbody_elems.find(".17_color:eq(" + i + ")").length != 0) {
                m += '"color":"' + tbody_elems.find(".17_color:eq(" + i + ")").text().toString() + '",';
                order_goods_obj['color'] = tbody_elems.find(".17_color:eq(" + i + ")").text().toString()
            }
            m += '"total":"' + total + '"';
            order_goods_list.push(order_goods_obj)


        }
        var order_goods_list_str = JSON.stringify(order_goods_list)

        var order_obj = new Object();
        var c = new Array();
        var f = tbody_elems

        f.find(".info").children("span").not(".j_telephone,.j_mobilePhone").remove();
        var l = f.find(".info").text().toString().trim("	");
        //console.log(l);
        var g = l.split("，");
        var b = g[g.length - 2].trim();//name
        var m = g[0].trim();
        var h = g[g.length - 1].trim();//phone

        order_obj['name'] = b;
        order_obj['address']  = m;
        order_obj['phone'] = h;

        // d.postscript = f.find("span.postscript").text().trim(" ");
       order_obj['tb_order_number'] = f.find("span.order-number").text().replace("订单编号：",'').trim();
       var new_goods_str_list = []
       for (var x = 0; x < order_goods_list.length; x++) {
        var order_goods = new Object()


        order_goods['code'] =  typeof order_goods_list[x].code === "undefined" ? "" :order_goods_list[x].code.replace("#","^^^")
        order_goods['img']= typeof order_goods_list[x].img === "undefined" ? "" : order_goods_list[x].img;
        order_goods['size']= typeof order_goods_list[x].size === "undefined" ? "" : order_goods_list[x].size
        order_goods['color']= typeof order_goods_list[x].color === "undefined" ? "" : order_goods_list[x].color;
        order_goods['count']= typeof order_goods_list[x].total === "undefined" ? "" : order_goods_list[x].total;
        new_goods_str_list.push(order_goods)
    // d.goodinfo[x] = ordergoodslist[x];

    }

        order_obj['order_goods_list']=new_goods_str_list
        order_list.push(order_obj)

    })
    return order_list
}


