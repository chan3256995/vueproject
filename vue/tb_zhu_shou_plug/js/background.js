chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
	var method = request.method;
    console.log("method---",method)
	if (method === "get_goods_time") {

           let goods_url = request.goods_url
        console.log("goods_url")
        console.log(goods_url)
           let result = get_goods_details(goods_url)
           let res_arr =  result.match("dbst             : \\d+")
           let match_time = 0
           if(res_arr.length>0){
                              console.log("match_time:",res_arr[0].replace("dbst             :"))
               match_time = res_arr[0].replace("dbst             :","").trim()
               match_time = format(match_time)

                         }
           sendResponse(JSON.stringify(match_time));
	}else if(method === "zhaoyaojing_query"){
	    console.log("zhaoyaojing_query",request.query_data)
	     let req_data = JSON.parse(request.query_data)
	     let user_name = req_data["user_name"]
         let user_info = zhaoyjingapi_get_user_info()
         zhaoyjingapi_login(user_info['user_name'],user_info['pwd'])
	     let result = zhaoyjingapi_check_user(user_name)
         console.log("照妖镜图片结果:",result)
         let image_list = result['image_list']
        //  let image_list = [
        //     "http://i.cy1788.cn/data/m/20211103/2e9a421863554d8197cf2bb4d270ef75.png",
        //     "http://i.cy1788.cn/data/m/20211103/e8f40d6762fa4d0b9ee8ce7c8ecf33b8.png",
        // ]
        if(image_list !== undefined){
             let res = zhaoyjingapi_get_image_content(image_list)
             if(res['success']===true){
                   sendResponse(JSON.stringify(res['image_list']))
             }

        }

    }else if(method === "get_zhangmenren_task_tb_link"){
	    
        let result = {'tb_link':''}
        let order_id = request.order_id
         let req_result = zhangmenrenapi_get_order_tb_link(order_id)
        console.log("根据订单号查找淘宝链接结果：",req_result)
        result['tb_link'] = req_result['goods_link']
         sendResponse(JSON.stringify(result));

    } else if(method === "wuxie_dabiao"){

        let result = {'tb_link':''}
        let wangwang_id = request.wangwang_id
        let tb_link = request.tb_link
        let key_words = request.key_words
         let dabiao_resutl = wuxieapi_dabiao(key_words,tb_link,wangwang_id)
        console.log("d打标结果：",dabiao_resutl)

         sendResponse(dabiao_resutl);
    }else if(method === "get_tb_last_three_month_order"){
	      chrome.storage.local.get({"last3months_item":"88"},function (result) {
             console.log("读取谷歌储存2：",result)
         })
    }else if(method === "get_zhangmenren_order_info"){
	    let tb_order_number_list = JSON.parse(request.tb_order_number_list)
        let result = {}
        for(let i = 0 ; i<tb_order_number_list.length;i++){
           let res = zhangmenrenapi_get_order_tb_link("",tb_order_number_list[i])
            result[tb_order_number_list[i]] = res
        }
	    sendResponse(JSON.stringify(result));

    }else if(method === "login_17"){
	    let result = api17_back_login()
        console.log("登录17后台结果:",result)
        sendResponse(JSON.stringify(result)); 

    }else if(method === "get_17return_package"){
	      let req_list = JSON.parse(request.req_info_list)
         console.log("req_list:",req_list)
        let return_res ={}
        for(let i = 0;i<req_list.length;i++){
            let return_logistics_number = req_list[i]["return_logistics_number"]
            let order_number = req_list[i]["order_number"]
            if(order_number!==undefined){
                 let return_package_17resultt =  api17_back_get_return_package(request.token,return_logistics_number)
                  
                if(return_package_17resultt === null){
                    continue
                }


                    if(order_number===""){
                        order_number = req_list[i]["return_logistics_number"]
                    }
                    return_res[order_number] = {
                         "return_logistics_name":return_package_17resultt['return_logistics_name'],
                         "return_logistics_number":return_package_17resultt['return_logistics_number'],
                         "add_time":return_package_17resultt['add_time'],

                }

            }

        }
	      
        sendResponse(JSON.stringify(return_res));

    }else if(method === "get_315_tuikuan_package"){
	     let return_logistics_number =  request.return_logistics_number
	      let url_315 = BASE_URL_315
         let from = request.from;
	    chrome.cookies.getAll({'url':url_315}, function(cookie) {
	    let cookie_obj_315 =  mcommon_chrome_cookie_to_obj(cookie)
         let result = api315_get_return_package(return_logistics_number,cookie_obj_315)
         console.log("get 315 return package result:",result)
            let returndata = {"return_logistics_number":return_logistics_number,"data":result}
            chrome.tabs.sendMessage(sender.tab.id, {method:"result_315_tuikuan_package",to:from,result_data:JSON.stringify(returndata)}, function(response) {

                 });
            // chrome.runtime.sendMessage({method:"result_315_tuikuan_package",to:"tb_refund2_page",result_data:JSON.stringify(returndata)},function (response) {
            //     console.log("result_315_tuikuan_package,",response)
            // })


                })
       

    }else if(method === "get_315_order"){
	    //search_field=goods_sn&q="+art_no+"&status=&do=&reserdate=
	     let parms_obj =  JSON.parse(request.parms_str)
	      let url_315 = BASE_URL_315
         let from = request.from;
	    chrome.cookies.getAll({'url':url_315}, function(cookie) {
	    let cookie_obj_315 =  mcommon_chrome_cookie_to_obj(cookie)
         let result = api315_query_order(parms_obj,cookie_obj_315)
         console.log("get 315 order result:",result)
             
         chrome.tabs.sendMessage(sender.tab.id, {method:"result_315_order_query",to:from,result_data:""}, function(response) {

                 });
            // chrome.runtime.sendMessage({method:"result_315_tuikuan_package",to:"tb_refund2_page",result_data:JSON.stringify(returndata)},function (response) {
            //     console.log("result_315_tuikuan_package,",response)
            // })


                })


    }else if(method === "keep_web_cookies_alive"){
	  
// keep_web_cookies_alive()

    }else if(method === "get_orders_from17"){
	      let page_size = 15
            if(request.page_size!==undefined && request.page_size !== null){
                page_size = request.page_size
            }
            let order_number_list = request.order_number_list
            let group_list =  group(JSON.parse(order_number_list),page_size)
            let all_result_list = []
            for(let i = 0 ;i<group_list.length;i++){
                let result = api17_get_one_page_order(JSON.stringify(group_list[i]))
               all_result_list =  all_result_list.concat(result.results)
           }

            sendResponse(JSON.stringify(all_result_list));



	//
	//
	//       let order_number_list = request.order_number_list
    //        let result = api17_get_one_page_order(order_number_list)
    //        sendResponse(JSON.stringify(result));
    }else if (method === "get_null_orders_from17") {

            let page_size = 15
            if(request.page_size!==undefined && request.page_size !== null){
                page_size = request.page_size
            }
            let order_number_list = request.order_number_list
            let group_list =  group(JSON.parse(order_number_list),page_size)
            let all_result_list = []

            for(let i = 0 ;i<group_list.length;i++){
                let result = get_one_page_null_order(JSON.stringify(group_list[i]))
               all_result_list =  all_result_list.concat(result.results)
           }

            sendResponse(JSON.stringify(all_result_list));

	}

});

function keep_web_cookies_alive(){
    let _time = 3*60*1000
    console.log("保持  cookie 存活 ----"+ new Date())
    setTimeout(function () {
        tbapi_check_login()
        keep_web_cookies_alive()
    },_time)
}
function add0(m){return m<10?'0'+m:m }
function format(shijianchuo)
{
//shijianchuo是整数，否则要parseInt转换
     shijianchuo = parseInt(shijianchuo)
var time = new Date(shijianchuo);
var y = time.getFullYear();
var m = time.getMonth()+1;
var d = time.getDate();
var h = time.getHours();
var mm = time.getMinutes();
var s = time.getSeconds();
return y+'-'+add0(m)+'-'+add0(d)+' '+add0(h)+':'+add0(mm)+':'+add0(s);
}
function group(array, subGroupLength) {

      let index = 0;
      let newArray = [];
      while(index < array.length) {
          newArray.push(array.slice(index, index += subGroupLength));
      }

      return newArray;
  }

function get_goods_details(goods_url) {
            let ret_result = null
		   $.ajax({
            async : false,
            url :goods_url,
            type : "GET",
            // dataType : 'json',
            // data : {'tb_order_number_list':order_number_list},
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

chrome.webRequest.onCompleted.addListener(

    function(details) {
        
        if(details.url.indexOf("s.taobao.com/search")!== -1){
            console.log("tabs000url",details.url)
         chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
             console.log("tabs000",tabs)
             chrome.tabs.sendMessage(tabs[0].id, {from:'background',method:'update_tb_search_page_data',to:'tb_search_page'}, function(response)
                {

          });
         });
        }else if(details.url.indexOf("https://refund2.taobao.com/dispute/adjust/adjustSellerList.json")!== -1){
            console.log("插件监听到请求完：",details)
           chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
             console.log("tabs000",tabs)
               //淘宝售后数据更新
             chrome.tabs.sendMessage(tabs[0].id, {from:'background',method:'update_tb_refund2_page_data',to:'tb_refund2_page'}, function(response)
                {

          });
         });
        }else if(details.url.indexOf("chuanmeidayin.com/app/refund/list.do")!== -1){
            console.log("插件监听到传美售后请求完成地址：",details.url)
           chrome.tabs.query({active: true, currentWindow: true}, function(tabs){

               //淘传美售后数据更新
             chrome.tabs.sendMessage(tabs[0].id, {from:'background',method:'update_chuanmei_refund_page_data',to:'chuanmei_refund_page'}, function(response)
                {

          });
         });
        }else if(details.url.indexOf("chuanmeidayin.com/printMulti/searchMulti.do")!==-1){
             console.log("请求订单完成地质：",details)
             chrome.tabs.query({active: true, currentWindow: true}, function(tabs){

               //淘传美售后数据更新

         });
        }
    },{urls: ["<all_urls>"]}
);