var back_base_url = "http://192.168.2.110:8009"
var daifa_vue_url = "http://192.168.2.110:8082";
var daifa_server_url = "http://192.168.2.110:8009";
var web_url = "http://www.17to17.vip";

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



chrome.tabs.onUpdated.addListener(function (id, info, tab) {

    if(tab.status==='complete'){
         chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
         console.log("tabs[0]",tabs[0].url);
         if(tabs[0].url.indexOf("back/home/nullOrder/") !== -1){
             chrome.tabs.sendMessage(tabs[0].id, {"method":"update_null_package_plugs"}, function(response) {

                 });
         }
        })
    }
});



chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
	let method = request.method;
	if (method === "add_null_order_tobl"){
	    let cookies_url = request.url;
        chrome.cookies.getAll({'url':cookies_url}, function(cookie) {
            let cookies_obj = {}
            let cookie_str = ""
            let cookie_string = ""
            for (let i in cookie) {
                    let name = cookie[i].name;
                    let value = cookie[i].value;
                    cookies_obj[name] = value;
                    cookie_str += (name + "=" + value + ";\n");
                    cookie_string += (name + "=" + value +"&");
                }
            let url = daifa_server_url+"/back/outputNullOrder/?access_token_bk="+cookies_obj['access_token_bk']
            let order_list = []
            let success_counts = 0;
            let start_time_stmp = new Date().getTime()
            do{
                let cur_time_stamp = new Date().getTime();
                if ((cur_time_stamp - start_time_stmp) > 3 * 60 * 1000){
                         break
                     }
                order_list = load_null_order_from17(url,{'for':"logistics_print"});

                let ret = start_add_null_package_order_tobl(order_list)
                success_counts = success_counts + ret['success_counts']
                if(ret['message']==="go_bl_login"){
                     window.open(web_url+"/Login.aspx/");
                     break
                }else if(ret['message']==='stop_task'){
                    console.log("stop_task")
                    break
                }
            }while(order_list.length>0)
		         chrome.tabs.sendMessage(sender.tab.id, {"method":"add_null_order_tobl_compeleted","success_counts":success_counts}, function(response) {

                 });
        })
    }else if(method === "delivery_null_order_to17"){
	    chrome.cookies.getAll({'url':daifa_vue_url}, function(cookie) {
	        let cookies_obj = {}
            let cookie_str = ""
            let cookie_string = ""
            for (let i in cookie) {
                    let name = cookie[i].name;
                    let value = cookie[i].value;
                    cookies_obj[name] = value;
                    cookie_str += (name + "=" + value + ";\n");
                    cookie_string += (name + "=" + value +"&");
                }


            let result  = init_request_parms()
            let parms = result.parms
            let date = new Date()
            let  end_time=  dateFtt("yyyy-MM-dd hh:mm:ss", date)
            date.setDate(date.getDate()-90)
            let  start_time=  dateFtt("yyyy-MM-dd hh:mm:ss",date )
            parms['__EVENTARGUMENT'] = 1
            parms['__EVENTTARGET'] = "ctl00$ContentPlaceHolder1$AspNetPager1"
            parms['ctl00$ContentPlaceHolder1$txtStart'] = start_time
            parms['ctl00$ContentPlaceHolder1$txtEnd'] = end_time

            let page_info = result.page_info
            let i = 0
            let task_start_time_stmp = new Date().getTime()

            while(parseInt(page_info.cur_page) < parseInt(page_info.page_counts) ){
                     let cur_time_stamp = new Date().getTime();
                     if ((cur_time_stamp - task_start_time_stmp) > 3 * 60 * 1000){
                         break
                     }
                     sleep(800)
                     let result2 = load_null_package_frombl(parms)
                     let page_info = result2.page_info
                     delivery_null_package_to17(result2.order_list,cookie_string)
                     parms['__EVENTARGUMENT'] = parseInt(page_info.cur_page)+1;
                     page_info.cur_page = parseInt(page_info.cur_page)+1;
                     if(parseInt(page_info.cur_page) > parseInt(page_info.page_counts))
                         break
                     i = i+1;
                     if(i>10)
                         break

            }
        })


    }else  if ( method === 'get_tab_id' ){
            sendResponse({ tabId: sender.tab.id });
        }
});
 function  dateFtt(fmt,date) {

    var o = {
        "M+" : date.getMonth()+1, //月份
        "d+" : date.getDate(), // 日
        "h+" : date.getHours(),// 小时
        "m+" : date.getMinutes(),// 分
        "s+" : date.getSeconds(),// 秒
        "q+" : Math.floor((date.getMonth()+3)/3),// 季度
        "S" : date.getMilliseconds()// 毫秒
        };
        if(/(y+)/.test(fmt))
            fmt=fmt.replace(RegExp.$1, (date.getFullYear()+"").substr(4 - RegExp.$1.length));
        for(var k in o)
            if(new RegExp("("+ k +")").test(fmt))
                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
            return fmt;
}
function group(array, subGroupLength) {

      let index = 0;
      let newArray = [];
      while(index < array.length) {
          newArray.push(array.slice(index, index += subGroupLength));
      }
      return newArray;
  }
   //参数n为休眠时间，单位为毫秒:
function sleep(n) {
        var start = new Date().getTime();

        while (true) {
            if (new Date().getTime() - start > n) {
                break;
            }
        }
    }

function start_add_null_package_order_tobl(order_list){
            console.log("start_add_null_package_order_tobl------------------")
             let logistics_type_choise = {"圆通实包":15, }
            let logistics_type = "15"
            let success_id_list = []
            let fail_id_list = []
            let is_continue = true
            let ret_message = ""
            for(let i = 0;i<order_list.length;i++){
                sleep(600)
                let order_text = ""
                let mark = order_list[i].id
                order_text = order_text+ order_list[i].consignee_name+" ",
                order_text = order_text+ order_list[i].consignee_phone+" ",
                order_text = order_text+ order_list[i].consignee_address
                logistics_type = logistics_type_choise[order_list[i].logistics_name]
                let ret = {}
                if(is_continue === true){
                     ret= add_null_package_order_tobl(order_text,mark,logistics_type)
                    let success_counts = ret['success_counts']
                    let is_success = ret['is_success']
                    let message = ret['message']
                    if (is_success === false && message==="未登录"){
                        is_continue =false;
                        ret_message = "go_bl_login"
                    }
                    if (is_success === false && message==="未知错误"){
                        is_continue =false;
                        ret_message = "stop_task"
                    }
                    if(is_success === false && parseInt(success_counts) === 0 ){
                        console.log(order_text+" 失败66666")
                        fail_id_list.push(order_list[i].id)
                    }else if(parseInt(success_counts) === 1){
                        console.log(order_text+" 下单成功")
                        success_id_list.push(order_list[i].id)
                    }
                }else{
                        console.log(order_text+" 失败")
                        fail_id_list.push(order_list[i].id)
                    }

            }

            submit_success_null_order_to17(success_id_list)
            submit_fail_null_order_to17(fail_id_list)

            return {"message":ret_message,"success_counts":success_id_list.length}
}
  //其他网站下单成功 后 通知17服务器
function submit_success_null_order_to17(order_id_list) {
        let request_url = daifa_server_url+"/back/outputNullOrderOtherSiteSuccess/"
        let parms = {"order_id_list":JSON.stringify(order_id_list)}
        $.ajax({
        async: false,
        url: request_url,
        type: "POST",
        // dataType : 'json',
        data: parms,
        timeout: 5000,
        success: function (result) {
            console.log("3333333333333333", result)

        },
        error: function (err) {
            console.log("错了:" + err);
            console.log("错了:" + JSON.stringify(err));


        }

    });
}

  //其他网站下单失败订单提交  17服务器
function submit_fail_null_order_to17(exception_order_id_list) {
        let request_url = daifa_server_url+"/back/outputNullOrderOtherSiteException/"
        let parms = {"exception_order_id_list":JSON.stringify(exception_order_id_list)}
        $.ajax({
        async: false,
        url: request_url,
        type: "POST",
        // dataType : 'json',
        data: parms,
        timeout: 5000,
        success: function (result) {
            console.log("3333333333333333", result)

        },
        error: function (err) {
            console.log("错了:" + err);
            console.log("错了:" + JSON.stringify(err));


        }

    });
}
//下单空包到bl网站
function add_null_package_order_tobl(order_text,mark,logistics_type){
     var data = new FormData();
    // data.append("ctl00$ContentPlaceHolder1$txtAddressList","lis 15888886666 河南省 安阳市 殷都区 梅园庄街道安钢四二区27号楼\nlis 15888886666 河南省 安阳市 殷都区 梅园庄街道安钢四二区27号楼")
    // data.append("ctl00$ContentPlaceHolder1$btnPLTextAdd","提交订单")
    // data.append("ctl00$ContentPlaceHolder1$ddlExpress01","15")
    // data.append("ctl00$ContentPlaceHolder1$txtRemark01","8888")
    data.append("__VIEWSTATE","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")
    data.append("__VIEWSTATEGENERATOR","2825E971")
    data.append("__EVENTVALIDATION","/wEdAA4udLgl4Brppp2zryf+gOulU0VdjY42VcBHg8QisOvLkjrD0WdmcuH4/b0wqb3G58Wm/un8qu1h4rhOphoBDoGIcuYsk48g/YpZfmS1zaKS03qxVisBfUa3OleRtN3lltIOk3uqh3XciS2UdU3CIDuxfmgBmOOd+Q+o0SwJ5dPwBbJfeqxyvDtD8VJDx9cNSZxk3cz2OOF2r/VQFLv7/zogwYj/yIc0sOWmsta+4dpZcQ72KKzwrUhUX/nOd01MDg6b+ZVO3z3mUQFl2jij295NEU+RETIxfc8Dxx5sFPMJvvl42ZZ5JmfhR38lFVd5LrK2fhmHTgeizXfcuyueD+iA")
    // data.append("ctl00$ContentPlaceHolder1$ddlExpress01","15")
    data.append("ctl00$ContentPlaceHolder1$ddlExpress01",logistics_type)
    data.append("ctl00$ContentPlaceHolder1$txtRemark01",mark)
    // data.append("ctl00$ContentPlaceHolder1$txtAddressList","3333，15888886666，广东省 广州市 白云区 XX路XX号")
    data.append("ctl00$ContentPlaceHolder1$txtAddressList",order_text)
    data.append("ctl00$ContentPlaceHolder1$btnPLTextAdd","提交订单")
    data.append("ctl00$ContentPlaceHolder1$ddlExpress02","18")
    data.append("ctl00$ContentPlaceHolder1$txtRemark02","")
    let null_order_status2 = {
            '未付款': 1,
            '已付款': 2,
            '快递打印': 3,
            '已发货': 4,
            '已退款': 5,
    }

    let success_counts = 0
    let ret = {
        "success_counts":0,
         "is_success":false,
         "message":"",

    }
    $.ajax({
            async:false,
            url:web_url+"/User/KB_Add.aspx",
            type: 'POST',
            data: data,
            // dataType: 'JSON',
            cache: false,
            processData: false,
            contentType: false,
              success : function(result) {
               console.log("result-------------->",result)
               if(result.indexOf("网站会员登录")!==-1 || result.indexOf("请输入密码")!==-1){

                    ret['is_success'] = false
                    ret['message'] = "未登录"

               }else if(result.indexOf("提交订单成功")!== -1){
                   ret['success_counts'] =  result.match("提交订单成功：\\d+")[0].replace("提交订单成功：","")
                   ret['is_success'] = true
                   console.log("成功数量：",success_counts)
               }else{
                     ret['is_success'] = false
                     ret['message'] = "未知错误"
                  }



            },
            error:function (err) {
                console.log("错了:" + err);
                console.log("错了:" + JSON.stringify(err));

            }
        });




     return ret;



}
function init_request_parms(){

    let parms = {
                 "__VIEWSTATE":"",
                "__EVENTTARGET":"",
                "__VIEWSTATEGENERATOR":"AFA9FE57",
                "__EVENTVALIDATION":"",
                "__EVENTARGUMENT":"",

       }

    let result = load_null_package_frombl(parms)
    return  result
}
function load_null_package_frombl(parms){

    let request_url  = "http://www.17to17.vip/User/KB_List.aspx"
    let request_type = "POST"
    if(parms.__VIEWSTATE === ""){
        request_type = "GET"
        parms = {}
    }
    let order_list = []
    let obj = {}
    let page_info = {}
    $.ajax({
            async : false,
            url :request_url,
            type : request_type,
            // dataType : 'json',
            data : parms,
            timeout : 5000,
            success : function(result) {
                // console.log("result777777777777777",result)
                let body = result.substring(result.indexOf("<body>"),result.indexOf("</body>")+7)
                body = $.parseHTML(body)

                 let paginator_text = $($(body).find("div[class='paginator']")[1]).text().trim()
                 let reg = "共\\d+页"


                 let paginator = $(body).find("div[class='paginator']")[2]
                 let cur_page =  $(paginator).find("span[class='cpb']").text().trim()
                  let page_counts = paginator_text.match(reg)[0].replace("共",'').replace("页",'').trim()

                  let __VIEWSTATE = $(body).find("input[id='__VIEWSTATE']").val()
                  let __EVENTVALIDATION = $(body).find("input[id='__EVENTVALIDATION']").val()
                  let __VIEWSTATEGENERATOR = $(body).find("input[id='__VIEWSTATEGENERATOR']").val()
                  parms.__VIEWSTATE = __VIEWSTATE
                  parms.__EVENTVALIDATION = __EVENTVALIDATION
                  $(body).find("tr[class='trlist']").each(function () {
                      // console.log("hi-->",$($(this).find("td")[0]).find("a").text().trim())
                      // console.log("kk-->",$(this).find("td:last").text().trim())
                      let logistic_number = $($(this).find("td")[0]).find("a").text().trim();

                      let td_clone = $($(this).find("td")[0]).clone();
                      td_clone.find(':nth-child(n)').remove()
                      let logistic_name =td_clone.text().trim()


                      let mark = $(this).find("td:last").text().trim()
                      logistic_number = mark
                      let item  = {
                          "logistics_number":logistic_number,
                          "logistics_name":logistic_name,
                          "id":mark,
                      }

                      order_list.push(item)

            })
                  page_info = {
                    "cur_page":cur_page,
                    "page_counts":page_counts,
                  }
                   obj = {
                      "order_list":order_list,
                      "parms" : parms,
                      "page_info" : page_info,
                  }



            },
            error:function (err) {
                console.log("错了:" + err);
                console.log("错了:" + JSON.stringify(err));
                obj =  null
            }
        });

    return obj



}
function delivery_null_package_to17(order_list,cookies_str) {
    let parms = {
        "deliver_order_list":JSON.stringify(order_list),
    }
    let request_url = daifa_server_url+"/back/deliverNullOrder/"+"?"+cookies_str
    $.ajax({
        async: false,
        url: request_url,
        type: "POST",
        // dataType : 'json',
        data: parms,
        timeout: 5000,
        success: function (result) {
            console.log("3333333333333333", result)


        },
        error: function (err) {
            console.log("错了:" + err);
            console.log("错了:" + JSON.stringify(err));


        }

    });
}
function get_null_package_page_from_bl(parms){
    let request_url  = web_url+"/User/KB_List.aspx"
    let request_type = "POST"
    if(parms.__VIEWSTATE === ""){
        request_type = "GET"
        parms = {}
    }
 let order_list = []
    let obj = {}
    let page_info = {}
    $.ajax({
            async : false,
            url :request_url,
            type : request_type,
            // dataType : 'json',
            data : parms,
            timeout : 5000,
            success : function(result) {
                // console.log("result777777777777777",result)
                let body = result.substring(result.indexOf("<body>"),result.indexOf("</body>")+7)
                body = $.parseHTML(body)

                 let paginator_text = $($(body).find("div[class='paginator']")[1]).text().trim()
                 let reg = "共\\d+页"


                 let paginator = $(body).find("div[class='paginator']")[2]
                 let cur_page =  $(paginator).find("span[class='cpb']").text().trim()
                  let page_counts = paginator_text.match(reg)[0].replace("共",'').replace("页",'').trim()

                  let __VIEWSTATE = $(body).find("input[id='__VIEWSTATE']").val()
                  let __EVENTVALIDATION = $(body).find("input[id='__EVENTVALIDATION']").val()
                  let __VIEWSTATEGENERATOR = $(body).find("input[id='__VIEWSTATEGENERATOR']").val()
                  parms.__VIEWSTATE = __VIEWSTATE
                  parms.__EVENTVALIDATION = __EVENTVALIDATION
                  $(body).find("tr[class='trlist']").each(function () {
                      // console.log("hi-->",$($(this).find("td")[0]).find("a").text().trim())
                      // console.log("kk-->",$(this).find("td:last").text().trim())
                      let logistic_number = $($(this).find("td")[0]).find("a").text().trim();

                      let td_clone = $($(this).find("td")[0]).clone();
                      td_clone.find(':nth-child(n)').remove()
                      let logistic_name =td_clone.text().trim()

                      let mark = $(this).find("td:last").text().trim()
                      let item  = {
                          "logistic_number":logistic_number,
                          "logistic_name":logistic_name,
                          "mark":mark,
                      }

                      order_list.push(item)

            })
                  page_info = {
                    "cur_page":cur_page,
                    "page_counts":page_counts,
                  }
                   obj = {
                    "order_list":order_list,
                      "parms" : parms,
                      "page_info" : page_info,
                  }



            },
            error:function (err) {
                console.log("错了:" + err);
                console.log("错了:" + JSON.stringify(err));
                obj =  null
            }
        });

    return obj

}

// 加载已付款订单
function  load_null_order_from17(url,query_data){
    let order_list = {}

 $.ajax({
            async : false,
            url:url,
            type: 'POST',
            data: query_data,
            // dataType: 'JSON',
            success : function(result) {
                try {

                     order_list = result.results;

                    console.log("成功:" , order_list);

                }catch (e) {
                   console.log("错了2222:" + e.toString());
                }

            },
            error:function (err) {
                console.log("错了:" + err);
                console.log("错了:" + JSON.stringify(err));
                if(err.status === 403){
                    window.open(daifa_vue_url+"/#/pc/back/login/");
                }

            }
        });
         return order_list
        }



