var back_base_url = "http://192.168.2.110:8009"
var daifa_vue_url = "http://192.168.2.110:8082";
var daifa_server_url = "http://192.168.2.110:8009";
var web_url = "http://www.17to17.vip";
 // let null_package_logistics_type_choise_gs = {"圆通实包":15, }
 let null_package_logistics_type_choise_js = {"圆通实包":15, }
 // let null_package_logistics_type_choise = null_package_logistics_type_choise_gs


chrome.webRequest.onCompleted.addListener(

    function(details) {
        if(details.url.indexOf("/back/nullOrders/")!== -1){
         chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
             console.log("tabs000",tabs)
          chrome.tabs.sendMessage(tabs[0].id, {"method":"update_null_package_plugs"}, function(response)
          {
          });
         });
        }else if(details.url.indexOf("/back/orders/")!== -1){
             chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
             console.log("tabs000",tabs)
             chrome.tabs.sendMessage(tabs[0].id, {"method":"update_order_page_plugs"}, function(response){
          });
         });
        }
    },{urls: ["<all_urls>"]}
);
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
	if (method === "add_null_order_tobl")
	{
                     let base_url = mcommon_get_null_package_base_url_bl()
                    let user_info = apibl_get_user_name_and_pwd()
                    apibl_login2(base_url,user_info['user_name'],user_info['password'])
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
            let url = mcommon_get_base_url_17()+"/back/outputNullOrder/?access_token_bk="+cookies_obj['access_token_bk']
            let order_list = []
            let success_counts = 0;
            let start_time_stmp = new Date().getTime()
            do{
                let cur_time_stamp = new Date().getTime();
                if ((cur_time_stamp - start_time_stmp) > 3 * 60 * 1000){
                         break
                     }
                order_list = load_null_order_from17(url,{'for':"logistics_print"});
                let res = apibl_init_add_null_order_page_parms(mcommon_get_null_package_base_url_bl())

                if(res.is_success){

                     let ret = start_add_null_package_order_tobl(order_list,mcommon_get_null_package_base_url_bl(),res.parms)
                    success_counts = success_counts + ret['success_counts']
                    if(ret['message']==="未登录"){
                         window.open(mcommon_get_null_package_base_url_bl()+"/Login.aspx/");
                         break
                    }else if(ret['message']==='stop_task'){
                        console.log("stop_task")
                        break
                    }
                }else{
                    if(res.message==="未登录"){
                         window.open(mcommon_get_null_package_base_url_bl()+"/Login.aspx/");
                    }
                }


            }while(order_list.length>0)
             chrome.tabs.sendMessage(sender.tab.id, {"method":"add_null_order_tobl_compeleted","success_counts":success_counts}, function(response) {

             });
        })
    }else if(method === "delivery_null_order_blto17"){
	    console.log("method",method)
	    chrome.cookies.getAll({'url':mcommon_get_base_vue_url_17()}, function(cookie) {
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

            let is_login = apibl_check_is_login(mcommon_get_null_package_base_url_bl())
            if(!is_login){
                window.open(mcommon_get_null_package_base_url_bl())
                return
            }
            let result  = apibl_init_null_order_page_parms()

            let parms = result.parms
            let date = new Date()
            let  end_time=  dateFtt("yyyy-MM-dd hh:mm:ss", date)
            date.setDate(date.getDate()-5)
            let  start_time=  dateFtt("yyyy-MM-dd hh:mm:ss",date )
            parms['__EVENTARGUMENT'] = 1
            parms['__EVENTTARGET'] = "ctl00$ContentPlaceHolder1$AspNetPager1"
            parms['ctl00$ContentPlaceHolder1$txtStart'] = start_time
            parms['ctl00$ContentPlaceHolder1$txtEnd'] = end_time
 console.log("11111")
            let page_info = result.page_info
            let i = 0
            let task_start_time_stmp = new Date().getTime()

            while(parseInt(page_info.cur_page) < parseInt(page_info.page_counts) || parseInt(page_info.cur_page) ===  parseInt(page_info.page_counts)){
                     let cur_time_stamp = new Date().getTime();
                     if ((cur_time_stamp - task_start_time_stmp) > 3 * 60 * 1000){
                         break
                     }
                     sleep(800)
                 console.log("2222")
                     let result2 = apibl_load_null_order_frombl(parms)
                     console.log("result266666",result2)
                     let page_info = result2.page_info
                     api17_delivery_null_package_to17(result2.order_list,cookie_string,mcommon_get_base_url_17())
                     parms['__EVENTARGUMENT'] = parseInt(page_info.cur_page)+1;
                     page_info.cur_page = parseInt(page_info.cur_page)+1;
                     if(parseInt(page_info.cur_page) > parseInt(page_info.page_counts))
                         break


            }
        })


    }else if(method === "delivery_order_blto17"){
	        console.log("method",method)
             chrome.cookies.getAll({'url':mcommon_get_base_vue_url_17()}, function(cookie) {
                 let cookies_obj = {}
                 let cookie_str = ""
                 let cookie_string = ""
                 for (let i in cookie) {
                     let name = cookie[i].name;
                     let value = cookie[i].value;
                     cookies_obj[name] = value;
                     cookie_str += (name + "=" + value + ";\n");
                     cookie_string += (name + "=" + value + "&");
                 }
                 console.log("获取17vue cookies：，",cookies_obj)
                let is_login = apibl_check_is_login(mcommon_get_base_url_bl())
                 if(!is_login){
                     window.open(mcommon_get_base_url_bl()+"/Login.aspx/")
                     return
                 }
                let result  = apibl_init_order_page_parms(mcommon_get_base_url_bl())
                console.log("apibl_init_order_page_parms-----",result)

                let parms = result.parms
                let date = new Date()
                let  end_time=  dateFtt("yyyy-MM-dd hh:mm:ss", date)
                date.setDate(date.getDate()-3)

                let  start_time=  dateFtt("yyyy-MM-dd hh:mm:ss",date )


                parms['__EVENTARGUMENT'] = 1
                parms['__EVENTTARGET'] = "ctl00$ContentPlaceHolder1$AspNetPager1"
                parms['ctl00$ContentPlaceHolder1$txtStart'] = start_time
                parms['ctl00$ContentPlaceHolder1$txtEnd'] = end_time

                let page_info = result.page_info
                let i = 0
                let task_start_time_stmp = new Date().getTime()

                while((parseInt(page_info.cur_page) < parseInt(page_info.page_counts)) || (parseInt(page_info.cur_page)  === parseInt(page_info.page_counts)) ){
                         let cur_time_stamp = new Date().getTime();
                         if ((cur_time_stamp - task_start_time_stmp) > 3 * 60 * 1000){
                             break
                         }
                         sleep(800)

                         parms['ctl00$ContentPlaceHolder1$txtPageSize'] = 10
                         let result2 = apibl_load_order_frombl(parms,mcommon_get_base_url_bl())
                         console.log("result2",result2)
                         let page_info = result2.page_info

                         api17_delivery_order_to17(result2.order_sended_list,mcommon_get_base_url_17(),cookies_obj)
                         api17_yinahuo_order_to17(result2.order_yinahuo_list,mcommon_get_base_url_17(),cookies_obj)
                         parms['__EVENTARGUMENT'] = parseInt(page_info.cur_page)+1;
                         page_info.cur_page = parseInt(page_info.cur_page)+1;
                         if(parseInt(page_info.cur_page) > parseInt(page_info.page_counts))
                             break


                }


                 })


    }else if(method === "delivery_order_315to17"){
	  

	        console.log("method",method)
            let date = new Date()
            let  end_time=  dateFtt("yyyy-MM-dd ", date)
            date.setDate(date.getDate()-5)
            let  start_time=  dateFtt("yyyy-MM-dd",date )
            console.log("end_time",end_time)
            console.log("start_time",start_time)
            let data = {
	            reserdate:start_time+" - "+end_time,
                status:3,
                page:1
            }

            let page_info = {}
             chrome.cookies.getAll({'url':mcommon_get_base_url_17()}, function(cookie) {
                 let cookies_obj = {}
                 let cookie_str = ""
                 let cookie_string = ""
                 for (let i in cookie) {
                     let name = cookie[i].name;
                     let value = cookie[i].value;
                     cookies_obj[name] = value;
                     cookie_str += (name + "=" + value + ";\n");
                     cookie_string += (name + "=" + value + "&");

                 }
                  console.log("获取17 cookies：，",cookies_obj)
                 do{
                        let result  = api315_get_order_from315(data)
                        console.log("api315_get_order_from315--->result",result)

                        api17_delivery_order_to17(result.data.order_list,mcommon_get_base_url_17(),cookies_obj)
                        page_info = result.data.page_info
                        data['page'] = parseInt(page_info.cur_page) +1
                        page_info.cur_page = parseInt(page_info.cur_page)+1;
                    }while((parseInt(page_info.cur_page) < parseInt(page_info.page_counts)) || (parseInt(page_info.cur_page) ===  parseInt(page_info.page_counts)) )
             })




            let i = 0
            let task_start_time_stmp = new Date().getTime()



    }else  if ( method === 'get_tab_id' ){
            sendResponse({ tabId: sender.tab.id });
	}else if(method === 'api17_get_order_to_tag_print_to315'){
	     let cookies_url = request.url;
	      let new_order_number_list =JSON.parse( request.new_order_number_list)
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
            console.log(JSON.stringify(cookies_obj))
              
             let order_list = api17_get_order_to_tag_print_to315(new_order_number_list,cookies_obj)
             
             chrome.tabs.sendMessage(sender.tab.id, {"method":"api17_get_order_to_tag_print_to315_compeleted","order_list":order_list,from_btn:request.btn_tag}, function(response) {

             });
        })
	   
	    
         
    }else if(method == "apibl_check_is_login"){
	    let is_login = apibl_check_is_login(mcommon_get_base_url_bl())
        sendResponse(is_login)
    }else if (method == "api315_check_is_login"){
	     let is_login = api315_check_is_login(mcommon_get_base_url_315())
        sendResponse(is_login)
    }else if(method == "apibl_add_order_17tobl"){
	    let submit_order_list = JSON.parse(request.submit_order_list)
	    let res = apibl_add_order_17tobl(submit_order_list,mcommon_get_base_url_bl())
        sendResponse(JSON.stringify(res))
    }else if(method == "api315_add_order_17to315"){
	    let submit_order_list = JSON.parse(request.submit_order_list)
	    let res = api315_add_order_17to315(submit_order_list)
        sendResponse(JSON.stringify(res))
    }else if(method ==="shoudong_add_order_17tobl" ){
	    let order_list = JSON.parse(request.submit_order_list)
         let ret = {"code":"ok","message":""}
        // 已存在订单
        let exits_in_lb_order_list=[]
        let success_order_list=[]
        for(let i = 0;i<order_list.length;i++){
            let result = apibl_shoudong_add_order_step1(mcommon_get_base_url_bl())

        if(result.code === "ok"){
            let order_goods_list = order_list[i].goodinfo
            let result2 = apibl_shoudong_add_order_step2( result.parms,order_goods_list)
            ret = result2
            if(result2.code ==="ok"){
                let result3 = apibl_shoudong_add_order_step3()
                 ret = result3
                if(result3.code ==="ok"){

                     let name = order_list[i].name
                     let phone = order_list[i].phone
                     let address = order_list[i].address
                     let order_number = order_list[i].order_number
                     let logistics_name = order_list[i].logistics_name


                     let result4 = apibl_shoudong_add_order_step4(result3.parms,name,phone,address,order_number,logistics_name)

                     if(result4.code==="ok"){

                        success_order_list.push(order_list[i])
                     }else if (result4.code==="error" && result4.message==="订单已存在"){
                           exits_in_lb_order_list.push(order_list[i])

                     }

                }
            }

        }
        }

          ret["exits_in_lb_order_list"] = exits_in_lb_order_list
          ret["success_order_list"] = success_order_list
        sendResponse(JSON.stringify(ret))
    }else if(method === "load_tuihuan_order_frombl"){

	        console.log("method",method)
             chrome.cookies.getAll({'url':mcommon_get_base_vue_url_17()}, function(cookie) {
                 let cookies_obj = {}
                 let cookie_str = ""
                 let cookie_string = ""
                 for (let i in cookie) {
                     let name = cookie[i].name;
                     let value = cookie[i].value;
                     cookies_obj[name] = value;
                     cookie_str += (name + "=" + value + ";\n");
                     cookie_string += (name + "=" + value + "&");
                 }
                let is_login = apibl_check_is_login(mcommon_get_base_url_bl())
                 if(!is_login){
                     window.open(mcommon_get_base_url_bl()+"/Login.aspx/")
                     return
                 }

                let result  = apibl_init_tuihuan_page_parms(mcommon_get_base_url_bl())
                console.log("apibl_init_tuihuan_page_parms-----",result)

                let parms = result.parms
                 parms['__EVENTARGUMENT'] = 1
                 parms['__EVENTTARGET'] = "ctl00$ContentPlaceHolder1$AspNetPager1"


                let page_info = result.page_info
                let i = 0
                let task_start_time_stmp = new Date().getTime()

                while((parseInt(page_info.cur_page) < parseInt(page_info.page_counts)) || (parseInt(page_info.cur_page)  === parseInt(page_info.page_counts)) ){
                      console.log("page_info0",page_info)
                     let cur_time_stamp = new Date().getTime();
                         if ((cur_time_stamp - task_start_time_stmp) >  5 * 1000){
                             break
                         }
                         sleep(800)

                         parms['ctl00$ContentPlaceHolder1$txtYunDanHao'] = ""
                         parms['ctl00$ContentPlaceHolder1$txtOrderNo'] = ""
                         parms['ctl00$ContentPlaceHolder1$rblType'] = ""
                         let result2 = apibl_load_tuihuan_order_frombl(parms,mcommon_get_base_url_bl(),"退款退货","处理中")
                         console.log("333333333333333333333",result2)

                         page_info = result2.page_info
                         let ruijain_list = result2.order_tuihuotuikuan_list
                         if(ruijain_list !== null){
                             let submit_list = []
                             for(let i = 0 ;i<ruijain_list.length;i++){
                                 let logistics_name = ""
                                 let logistics_number = ruijain_list[i].logistics_number
                                 if(ruijain_list[i].refund_type === "退款退货" && ruijain_list[i].refund_status==="已签收退货中"){
                                     let obj = {
                                                "return_logistics_name":logistics_name,
                                                "return_logistics_number":logistics_number,
                                     }
                                     submit_list.push(obj)
                                 }
                             }
                                let objd = submit_list[0]
                             submit_list.push(objd)
                             api17_add_return_package_to17(submit_list,mcommon_get_base_url_17(),cookies_obj)

                         }
 console.log("page_info1",page_info)
                         page_info.cur_page = parseInt(page_info.cur_page)+1;
                         console.log("page_info2",page_info)
                         parms['__EVENTARGUMENT'] = page_info.cur_page
                         if(parseInt(page_info.cur_page) > parseInt(page_info.page_counts))
                             break


                }


                 })
    }else if(method === "keep_cookie_active_315"){
        // api315_keep_cookie_active()
	         
    }else if(method === "add_tag_to_chuanmei_tb"){
	    let post_data = JSON.parse(request.post_data)
        let result = apichuanmei_add_tag_tb(post_data['tb_wangwangid'],post_data['tb_order_number'],post_data['flag'])
        sendResponse(JSON.stringify(result))
	         
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

function start_add_null_package_order_tobl(order_list,url_base,page_parms){
            

            let success_id_list = []
            let fail_id_list = []
            let is_continue = true
            let ret_message = ""
            for(let i = 0;i<order_list.length;i++){
                sleep(400)
                let order_text = ""
                let mark = order_list[i].id
                if(mcommon_get_base_url_17() === mcommon_get_base_url_remote_server_address_17){
                    mark = "r"+mark
                }
                let name = order_list[i].consignee_name
                if(name.length > 5){
                    name = name.substring(0,4)
                }
                order_text = order_text+ name+" ",
                order_text = order_text+ order_list[i].consignee_phone+" ",
                order_text = order_text+ order_list[i].consignee_address
                let null_package_logistics_type_choise = mcommon_get_null_package_logistics_type_choise_bl()
                let logistics_type = null_package_logistics_type_choise[order_list[i].logistics_name]
                let ret = {}

                    ret= apibl_add_null_package_order_tobl(order_text,mark,logistics_type,url_base,page_parms)
                    console.log("ret",ret)
                    let success_counts = ret['success_counts']
                    let is_success = ret['is_success']
                    let message = ret['message']
                    if (is_success === false && message==="未登录"){
                        is_continue =false;
                        ret_message = "未登录"

                    }
                    if (is_success === false ){
                        if( message==="未知错误"){

                            ret_message = "stop_task"
                             fail_id_list.push(order_list[i].id)
                        }else if(parseInt(success_counts) === 0 ){
                             console.log(order_text+" 失败66666")

                             ret_message = "失败66666"
                             fail_id_list.push(order_list[i].id)
                        }
                    }else{
                         if(parseInt(success_counts) === 1){
                        console.log(order_text+" 下单成功")
                        success_id_list.push(order_list[i].id)
                     }
                    }



            }

            api17_submit_success_null_order_to17(success_id_list,mcommon_get_base_url_17())
            api17_submit_fail_null_order_to17(fail_id_list,mcommon_get_base_url_17())

            return {"message":ret_message,"success_counts":success_id_list.length}
}
 


 

function init_base_data(){

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
                    window.open(mcommon_get_base_vue_url_17()+"/#/pc/back/login/");
                }

            }
        });
         return order_list
        }



