let BASE_URL_315 ="https://www.315df.com"
let logistics_choies = {
    "圆通[菜鸟]":19,
    "圆通[拼多多]":27,
    "韵达":3,
}
let testing_choies_315 = {
    "普通质检":19,
    "精检":19,
}


function api315_check_is_login(){
    let is_login = false
    $.ajax({
                async: false,
                url: BASE_URL_315+"/user/profile/myinfo",
                type: "GET",
                // dataType : 'json',
                // data: submit_data_str,
                timeout: 5000,
                success: function (result) {
                console.log("check login :",result)
                  if (result.indexOf("个人资料")!==-1){
                    is_login = true
                }

        },
                 error: function (err) {
                    console.log("错了:" + err);
                    console.log("错了:" + JSON.stringify(err));


        }

    });
    return is_login
}

 function api315_get_return_package(return_logistics_number,cookies){
    
    
    let url_315_tuihuan = BASE_URL_315+"/user/order/tuihuan"
    let pacakge_info = null
     let header = {

        // "Host": return_logistics_number,
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.169 Safari/537.36",

          'Content-Type': 'application/x-www-form-urlencoded',
                // "Host": "315df.com",
                'origin': 'http://www.315df.com',
                'referer': 'http://www.315df.com/user/order/tuihuan',
     }
     let parms ={"kw": return_logistics_number}
    let post_data = {

        "url": url_315_tuihuan,
        "method": "POST",
        "parms":parms,
        "header":header,
        "cookies":cookies,
    }

    $.ajax({
                async: false,
                url: "http://39.96.69.115:8089/user/getWebPageContent/",
                type: "POST",
                // dataType : 'application/json',
                data: {"req_parms":JSON.stringify(post_data)},
                timeout: 5000,
                success: function (result) {
                    let data = result['data']
                    let htmlt = data.substring(data.indexOf("<html>"),data.indexOf("</html>")+7)
                    let html = $.parseHTML(htmlt)
                    console.log("html--------->",htmlt)
                    let dom = $(html)
                    let tr_el = dom.find("button:contains('商品日志')").parent().parent()
                    if(tr_el.length !==0){

                        let text1 = $($(tr_el[0]).children()[6]).text().trim()
                        let text2 = $($(tr_el[0]).children()[8]).text().trim()
                        let text3 = $($(tr_el[0]).next().find("td")[0]).text().trim()
                        try{
                            text3 = text3.replace(/  /g," ")
                            text1 = text1.replace(/  /g," ")
                            text2 = text2.replace(/  /g," ")
                        }catch (e) {

                        }


                         pacakge_info = " ["+text1 +" "+ text2  + "("+text3+")]"
                    }




        },
                 error: function (err) {
                    console.log("错了:" + err);
                    console.log("错了:" + JSON.stringify(err));


        }

    });
    return pacakge_info
}

//查询订单
 function api315_query_order(params_obj,cookies){
   const murl = "https://ec.snssdk.com/productcategory/getShopList?shop_id=RIiZTPaL&type=6&sort=0&size=10&page=0&b_type_new=0&device_id=0&is_outside=1"

          $.ajax({
          async : false,
          url :murl,
          type : "GET",
          timeout : 5000,
          success : function(res) {
             console.log("result",res)

            },
          error:function (err) {
             console.log("错了:" + err);

            }
          });
    let return_data = {
        is_success:false,
        message:""
    }
    let params_str = ""
     console.log("params_obj:",params_obj)
    for(let key in params_obj){
        params_str = params_str + key + "="+params_obj[key]+"&"
    }
    params_str = params_str.substring(0,params_str.length-1)
 //search_field=goods_sn&q="+art_no+"&status=&do=&reserdate=
    let url_315_order_check = BASE_URL_315+"/user/order/daifa?"+params_str
     // url_315_order_check = "https://www.315df.com/user/order/daifa?search_field=goods_sn&q=8055&status=&do=&reserdate="
    let pacakge_info = null
     let header = {

        // "Host": return_logistics_number,
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.169 Safari/537.36",

          'Content-Type': 'application/x-www-form-urlencoded',
                // "Host": "315df.com",
                'origin': 'http://www.315df.com',
                // 'referer': 'http://www.315df.com/user/order/tuihuan',
     }

    let post_data = {

        "url": url_315_order_check,
        "method": "GET",

        "header":header,
        "cookies":cookies,
    }

    $.ajax({
                async: false,
                url: "http://39.96.69.115:8089/user/getWebPageContent/",
                // url: "http://192.168.1.202:8009/user/getWebPageContent/",
                // url: url_315_order_check,
                type: "post",
                // dataType : 'application/json',
                data: {"req_parms":JSON.stringify(post_data)},
                timeout: 5000,
                success: function (result) {
                    let order_list = []

                    let data = result['data']
                    let htmlt = data.substring(data.indexOf("<html>"),data.indexOf("</html>")+7)
                    let html = $.parseHTML(htmlt)
                    // console.log("html--------->",htmlt)
                    let dom = $(html)
                    let orderlist_div = dom.find(".orderlist")[0]
                    let order_list_ul = $(orderlist_div).children("ul")

                    for(let i = 0;i<order_list_ul.length;i++){
                        console.log("99999:",$(order_list_ul[i]))
                        let order_td = $($(order_list_ul[i]).find(".goods").find("tr")[0]).find("td")[0]
                        let order_time_elems = $(order_list_ul[i]).find(".top").find("strong")
                        let order_time = $(order_time_elems[0]).text()

                        let goods_item_list_ul = $(order_td).children("ul")
                        console.log("goods_item_list_ul:",goods_item_list_ul)
                        let order_id = $(order_td)[0].id.replace("goodsItem_","")
                        let order_obj = {}
                        order_obj['order_id'] = order_id
                        order_obj['order_time'] = order_time
                        let goods_list = []
                        for(let g = 0;g<goods_item_list_ul.length;g++){
                             let goods_info = {}
                             let goods_id = $(goods_item_list_ul[g])[0].id.replace("Item_","")
                             let goods_price = $($($(goods_item_list_ul[g])[0]).children("li")[1]).text()
                             let goods_counts = $($($(goods_item_list_ul[g])[0]).children("li")[2]).text()
                             let goods_status = $($($(goods_item_list_ul[g])[0]).children("li")[3]).find("font").text()

                             let message = $(goods_item_list_ul[g]).find(".goods_info")
                            console.log("goods_info_div:",message)
                             let goods_message_text = $(goods_item_list_ul[g]).find(".goods_info").text().trim()
                            try {
                                goods_message_text = goods_message_text.replace(/\s+/g,' ')
                            }catch (e) {
                                console.log("replaceAll 方法调用失败")
                            }
                            goods_info['goods_id'] = goods_id
                            goods_info['goods_message_text'] = goods_message_text
                            goods_info['goods_status'] = goods_status
                            goods_info['purchase'] = ""
                            goods_info['goods_price'] = goods_price
                            goods_info['goods_counts'] = goods_counts
                            let goods_status_str_index0 =  goods_message_text.indexOf("采购状态：")
                            if(goods_status_str_index0 !== -1){
                                let sp_arr = goods_message_text.split("采购状态：")
                                if(sp_arr.length > 0){
                                    goods_info['purchase'] = sp_arr[1]
                                }
                            }
                            goods_list.push(goods_info)

                        }

                        order_obj['goods_list'] = goods_list
                        order_list.push(order_obj)
                        console.log("order_obj:",order_obj)
                    }
                    return_data["is_success"] = true
                    return_data["order_list"] = order_list
                    
                    console.log("查询315得到订单数据:",order_list)




        },
                 error: function (err) {
                    console.log("错了:" + err);
                    console.log("错了:" + JSON.stringify(err));
                    return_data["is_success"] = false
                    return_data["message"] = JSON.stringify(err)


        }

    });
    return return_data
}

// 返回商品
function return_goods_status(){}





