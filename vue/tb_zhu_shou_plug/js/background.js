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

         chrome.tabs.sendMessage(sender.tab.id, {method:"result_315_order_query",to:from,result_data:JSON.stringify(result)}, function(response) {

                 });
            // chrome.runtime.sendMessage({method:"result_315_tuikuan_package",to:"tb_refund2_page",result_data:JSON.stringify(returndata)},function (response) {
            //     console.log("result_315_tuikuan_package,",response)
            // })


                })


    }else if(method === "get_skw_goods_details"){
            console.log("获取搜款网商品详细信息")
         let parms_obj =  JSON.parse(request.parms_str)
         let result= apiskw_get_skw_goods_details(parms_obj["url"])
        sendResponse(JSON.stringify(result));

    }else if(method === "get_shop_recommend_goods_list"){
	    let parms_obj =  JSON.parse(request.parms_str)
        let skw_shop_url    = parms_obj ["skw_shop_url"]
        let from = request.from;
       chrome.cookies.getAll({'url':'https://www.vvic.com'}, function(cookie) {
	      let cookie_obj_skw =  mcommon_chrome_cookie_to_obj(cookie)


            let result = apiskw_get_shop_recommend_goods_list(skw_shop_url,cookie_obj_skw)
            chrome.tabs.sendMessage(sender.tab.id, {method:"get_shop_recommend_goods_list_result",to:from,result_data:JSON.stringify(result)}, function(response) {

                 });
            // chrome.runtime.sendMessage({method:"result_315_tuikuan_package",to:"tb_refund2_page",result_data:JSON.stringify(returndata)},function (response) {
            //     console.log("result_315_tuikuan_package,",response)
            // })


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
    }else if(method === "add_tag_to_chuanmei_tb"){
	    let post_data = JSON.parse(request.post_data)
        let result  = apichuanmei_add_tag_tb(post_data['seller_wangwang_id'],post_data['order_number'],post_data['cmflag'],post_data['memo'],post_data['flag'],post_data['from'])//post_data["my_money"]+"/"+post_data["platm_money"]

        sendResponse(JSON.stringify(result))

    }else if(method === "batch_add_tag_to_chuanmei_tb"){
	    let post_data = JSON.parse(request.post_data)

        let result = apichuanmei_batch_add_tag_tb(post_data['tid_order_list'],post_data['cmflag'],post_data['memo'],post_data['flag'],post_data['from'],post_data['is_cover'])

        sendResponse(JSON.stringify(result))

    }else if(method === "query_chuammei_has_send_order"){
	    let post_data = JSON.parse(request.post_data)
        let seller_wangwang_id = post_data['seller_wangwang_id']
        let tb_order_number = post_data['tb_order_number']
        let start_time = post_data['start_time']
        let end_time = post_data['end_time']
        let result = apichuammei_query_sended_order(seller_wangwang_id,tb_order_number,start_time,end_time)
        sendResponse(JSON.stringify(result))

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

	}else if (method === "get_tb_refund_details") {
            let request_refund_params_list = JSON.parse(request.request_refund_params_list)
            let refund_result_infos = {}
            for(let i = 0 ;i<request_refund_params_list.length;i++){
                 let order_number =request_refund_params_list[i]['order_number']
                 let refund_url =request_refund_params_list[i]['refund_url']
                mcomon_thread_sleep(1000)
                let result = tbapi_get_refund2_info(refund_url)
                if(result["send_info"]==null && result["return_info"]==null){
                    //得不到数据 需要手动过滑块验证码
                    break
                }


               refund_result_infos[order_number]  = result

            }

            sendResponse(JSON.stringify(refund_result_infos));

	}else if(method === "delivery_null_order_to17"){
	    console.log("method",method)

	    let send_order_list = JSON.parse(request.send_order_list)
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


           api17_delivery_null_package_to17(send_order_list,cookie_string,mcommon_get_base_server_url_17())

            })


    }else if(method === "get_kuaid100_logistics"){
	    console.log("method",method)
        let url = "https://www.kuaidi100.com/ "
	    let m_params = JSON.parse(request.params)
        console.log("m_params",m_params)
	    chrome.cookies.getAll({'url':url}, function(cookie) {
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

                let  query_result = kuaid100_get_logistics_info2(cookies_obj,m_params)
                console.log("query_result",query_result)
                chrome.tabs.sendMessage(sender.tab.id, {method:"update_kuaid100_logistics_data",to:"chuammei",kuaidi100_data:JSON.stringify(query_result)}, function(response) {

                 });


            })


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



//空包订单已发货同步到17网
function api17_delivery_null_package_to17(order_list,cookies_str,url_17) {
    let parms = {
        "deliver_order_list":JSON.stringify(order_list),
    }
    let request_url = url_17+"/back/deliverNullOrder/"+"?"+cookies_str
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
        }else if(details.url.indexOf("alibaba.refundface2.disputeservice.qianniu.pc.disputelist")!== -1){
            //https://h5api.m.taobao.com/h5/mtop.alibaba.refundface2.disputeservice.qianniu.pc.disputelist/1.0/?jsv=2.6.1&appKey=12574478&t=1672297035400&sign=3d640802cd7d29b8fce98f057e9d8360&api=mtop.alibaba.refundface2.disputeservice.qianniu.pc.disputelist&v=1.0&ttid=11320%40taobao_WEB_9.9.99&type=originaljson&dataType=json
            //https://refund2.taobao.com/dispute/adjust/adjustSellerList.json
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
             console.log("插件监听到传美请求订单完成：",details)
             chrome.tabs.query({active: true, currentWindow: true}, function(tabs){

                //淘传美售后数据更新
             chrome.tabs.sendMessage(tabs[0].id, {from:'background',method:'update_chuanmei_wait_send_page_data',to:'chuanmei_wait_send_page'}, function(response)
                {

          });

         });
        }else if(details.url.indexOf("woda.com/printSend.do?m=queryTrades")!==-1){
             console.log("我打请求订单完成地质：",details)
             chrome.tabs.query({active: true, currentWindow: true}, function(tabs){

               //我打数据更新
                  chrome.tabs.sendMessage(tabs[0].id, {from:'background',method:'update_woda_order_page_data',to:'woda_wait_print_page'}, function(response)
                {

          });

         });
        }
    },{urls: ["<all_urls>"]}
);