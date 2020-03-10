var curLocation = window.location.href.toString();
var daifa_vue_url = "http://192.168.2.110:8082";
var daifa_server_url = "http://192.168.2.110:8009";


if(curLocation.indexOf("pc/back/home/nullOrder")!==-1){
    window.onload=function(){

    init_null_package_page()



    }

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
function get_all_null_package(){
        let parms = {
                 "__VIEWSTATE":"",
                "__EVENTTARGET":"",
                "__VIEWSTATEGENERATOR":"AFA9FE57",
                "__EVENTVALIDATION":"",
                "__EVENTARGUMENT":"",



       }
        let result = get_null_package_page(parms)
        console.log("result--->",result)
         let date = new Date()
         let  end_time=  dateFtt("yyyy-MM-dd hh:mm:ss", date)

        date.setDate(date.getDate()-90)
         let  start_time=  dateFtt("yyyy-MM-dd hh:mm:ss",date )
        parms = result.parms
        parms['__EVENTARGUMENT'] = 1
        parms['__EVENTTARGET'] = "ctl00$ContentPlaceHolder1$AspNetPager1"
        parms['ctl00$ContentPlaceHolder1$txtStart'] = start_time
        parms['ctl00$ContentPlaceHolder1$txtEnd'] = end_time
        let page_info = result.page_info
        let i = 0
        let start_time_stmp = new Date().getTime()
                     let order_list = [
                     {
"logistics_name": "圆通（包洗衣粉）4.5元",
"logistics_number": "YT4264800713842",
"id": "14",
                     }
                 ]
                 delivery_null_package(order_list)
    return
        while(parseInt(page_info.cur_page) < parseInt(page_info.page_counts) ){
                 let cur_time_stamp = new Date().getTime();
                 if ((cur_time_stamp - start_time_stmp) > 3 * 60 * 1000){
                     break
                 }

                 sleep(2000)
                 let result2 = get_null_package_page(parms)
                 console.log("result2---->",result2)

                 let page_info = result2.page_info

                 parms['__EVENTARGUMENT'] = parseInt(page_info.cur_page)+1
                 page_info.cur_page = parseInt(page_info.cur_page)+1

                 console.log("page_info--->",page_info)

                 if(parseInt(page_info.cur_page) > parseInt(page_info.page_counts)  )
                     break
             i = i+1;
                 if(i>10)
                     break

        }
}
function delivery_null_package(order_list) {
    let parms = {
        "deliver_order_list":JSON.stringify(order_list),
    }
    let request_url = daifa_server_url+"/back/deliverNullOrder/"
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
function get_null_package_page(parms){
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

function add_null_package_order(order_text,mark,logistics_type,cookies){


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


    let url = daifa_server_url+"/back/outputNullOrder/?access_token_bk="+cookies['access_token_bk']
    let result = loadOrderPage(url,{'for':"logistics_print"})

return

        $.ajax({
            url:"http://www.17to17.vip/User/KB_Add.aspx",
            type: 'POST',
            data: data,
            // dataType: 'JSON',
            cache: false,
            processData: false,
            contentType: false,
              success : function(result) {
                console.log("555555555",result)


            },
            error:function (err) {
                console.log("错了:" + err);
                console.log("错了:" + JSON.stringify(err));
                return null
            }
        });




     return false;

      let request_url  = "http://http://www.17to17.vip/User/KB_Add.aspx"
      let parms = {
                 "__EVENTARGUMENT":5

             }
             parms = $(form_e).serialize()
             //******************
      // parms = "------WebKitFormBoundaryqwXBbsZnb1Adb2jh\n" +
      //     "Content-Disposition: form-data; name=\"ctl00$ContentPlaceHolder1$ddlExpress01\"\n" +
      //     "\n" +
      //     "15\n" +
      //     "------WebKitFormBoundaryqwXBbsZnb1Adb2jh\n" +
      //     "Content-Disposition: form-data; name=\"ctl00$ContentPlaceHolder1$txtRemark01\"\n" +
      //     "\n" +
      //     "124\n" +
      //     "------WebKitFormBoundaryqwXBbsZnb1Adb2jh\n" +
      //     "Content-Disposition: form-data; name=\"ctl00$ContentPlaceHolder1$txtAddressList\"\n" +
      //     "\n" +
      //     "张三 15888886666 河南省 安阳市 殷都区 梅园庄街道安钢四二区27号楼\n" +
      //     "张三2 15888886666 河南省 安阳市 殷都区 梅园庄街道安钢四二区27号楼\n" +
      //     "------WebKitFormBoundaryqwXBbsZnb1Adb2jh\n" +
      //     "Content-Disposition: form-data; name=\"ctl00$ContentPlaceHolder1$btnPLTextAdd\"\n" +
      //     "\n" +
      //     "提交订单\n" +
      //     "------WebKitFormBoundaryqwXBbsZnb1Adb2jh\n" +
      //     "Content-Disposition: form-data; name=\"ctl00$ContentPlaceHolder1$ddlExpress02\"\n" +
      //     "\n" +
      //     "18\n"
    //********************
    let  return_data = null
    $.ajax({
            async : false,
            url :request_url,
            type : "POST",
            // dataType : 'JSON',

            data : parms,

            cache: false,
            processData: false,
            contentType: "multipart/form-data" ,
            timeout : 5000,
            success : function(result) {
                console.log("result777777777777777",result)


            },
            error:function (err) {
                console.log("错了:" + err);
                console.log("错了:" + JSON.stringify(err));
                return null
            }
        });
    return return_data
}

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
function  loadOrderPage(url,query_data){
    let result = {}

 $.ajax({
            url:url,
            type: 'POST',
            data: query_data,
            // dataType: 'JSON',
            success : function(result) {
                try {

                    let order_list = result.results;
                    console.log("成功:" , order_list);

                }catch (e) {
                   console.log("错了2222:" + e.toString());
                }

            },
            error:function (err) {
                console.log("错了:" + err);
                console.log("错了:" + JSON.stringify(err));

            }
        });
         return result
        }
function init_null_package_page(){

         if($("#gs_delivery_button").length !==0){return}
          $("#query_div2").after(" <input type='button' id='gs_delivery_button'   value='gs空包发货'>");
         $("#gs_delivery_button").click(function () {
            chrome.runtime.sendMessage({"method":"delivery_null_order_to17"},function (response) {
           })
         })

         $("#query_div2").after(" <input type='button' id='gs_add_null_order_button'   value='空包下单到gs'>");
         $("#gs_add_null_order_button").click(function () {
         $("#gs_add_null_order_button").attr("disabled",true)
             let cookies_url = daifa_vue_url

         chrome.runtime.sendMessage({"method":"get_tab_id" },function (response) {
                    chrome.runtime.sendMessage({"method":"add_null_order_tobl","url":cookies_url },function (response) {
                    })
             })

         })
}
chrome.runtime.onMessage.addListener( function(request, sender, sendResponse){

    if(request.method ==="add_null_order_tobl_compeleted"){
         alert(request.success_counts +"个订单成功")
         $("#gs_add_null_order_button").attr("disabled",false)
    }else  if(request.method ==="update_null_package_plugs"){
         init_null_package_page()
    }
})


