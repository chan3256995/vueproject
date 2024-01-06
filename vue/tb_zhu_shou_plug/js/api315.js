// let BASE_URL_315 ="https://www.315df.com"
let BASE_URL_315 ="http://315df.com"
let logistics_choies = {
    "圆通[菜鸟]":19,
    "圆通[拼多多]":27,
    "韵达":3,
}
let testing_choies_315 = {
    "普通质检":19,
    "精检":19,
}

// 通过淘宝订单号去315获取订单信息
function api315_order_info_by_tb_order_number(tb_order_number){
    let url = BASE_URL_315 + "/plugin/chaorder?orderid="+tb_order_number

    $.ajax({
                async: false,
                url:url,
                type: "GET",
                // dataType : 'json',
                // data: submit_data_str,
                timeout: 5000,
                success: function (result) {
                console.log("api315_order_info_by_tb_order_number :",result)
                return result

        },
                 error: function (err) {
                    console.log("错了:" + err);
                    console.log("错了:" + JSON.stringify(err));


        }

    });
    return null
}
// 通过淘宝订单号去315获取订单信息
function api315_update_315_data_to_qianniu_refund_page(tb_order_number,order_info_315){
    let logistic_number = ""
    if(order_info_315["status"]!==100 || order_info_315["data"]['invoice_no']!==undefined){
        logistic_number = order_info_315["data"]['invoice_no']
    }else{
        return
    }
    let order_num_list_a = $($(".next-table-body")[1]).find("a:contains('订单号')")
    console.log("order_num_list_a",order_num_list_a)
    for(let i = 0;i<order_num_list_a.length;i++){
        let order_number = order_num_list_a[i].text.replace("订单号：","").trim().trim()
        if(tb_order_number.trim() === order_number ){
            $(order_num_list_a[i]).parent().append("<span style='margin-left: 1em;background: #01AAED; class='"+tb_order_number+"_315'"+" '  >"+logistic_number+"</span>")
        }
    }
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
     // let parms ={"kw": return_logistics_number}
     let parms ={"refund_sn": return_logistics_number,"Submit2": "请输入《退货时》填写的退货快递单号，查询仓库是否收到退包"}
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

//315代发页面初始化
function api315_init_daifa_order_page(){

     let all_select_span_elems  = $("span:contains(全选)")
    $(all_select_span_elems).append("<button  id='add_goods_no_to_taobao'  style='margin-left: 2em; '>订单商品款号标注到淘宝备注</button>")

    console.log("all_select_span_elems:",all_select_span_elems)
    $("#add_goods_no_to_taobao").click(function () {
        let result315_list = api315_get_order_info()

        let tb_order_number_list = []

        for(let i = 0;i<result315_list.length;i++){

            let order_item  = result315_list[i]

            let goods_no_list = order_item['goods_item_list']
            let goods_no_str = ""

            let order_number = order_item['order_number'].replace("os","")
            tb_order_number_list.push(order_number)
            for(let g = 0;g<goods_no_list.length;g++){
                 goods_no_str = goods_no_str + goods_no_list[g]['goods_no']
            }




        }

           chrome.runtime.sendMessage({order_number_list: JSON.stringify(tb_order_number_list),method:'get_orders_from17'},function(response) {
           let order_list = replace_data(JSON.parse(response))
            console.log("315订单页面获取17订单信息结果：",order_list)



            for(let i = 0;i<result315_list.length;i++){

                let tb_order_number =  result315_list[i]["order_number"].replace("os","")

                let order17_item = find_order(tb_order_number,order_list)
                if(order17_item === null){
                    continue
                }

                let seller_wangwang_id  = order17_item['wangwang_id']
                 let remarks_tb = ""
                if(seller_wangwang_id!==undefined && seller_wangwang_id!==""){

                    let goods315_item_list = result315_list[i]["goods_item_list"]
                    for(let d = 0;d<goods315_item_list.length;d++){
                        remarks_tb = remarks_tb + goods315_item_list[d]['goods_no']
                    }



                     let cmflag=6
                     let memo=remarks_tb
                     let tbflag=null
                     let from=1
                    let date = new Date()
                    let  end_time=  dateFtt("yyyy-MM-dd hh:mm:ss", date)
                    date.setDate(date.getDate()-45)

                    let  start_time=  dateFtt("yyyy-MM-dd hh:mm:ss",date )
                     // let start_time = "2023-05-01 00:00:00"
                     // let end_time = "2023-07-1 23:59:59"

                    let post_data = {
                         "seller_wangwang_id":seller_wangwang_id,
                         "tb_order_number":tb_order_number,
                         "start_time":start_time,
                         "end_time":end_time,


                        }
                       chrome.runtime.sendMessage({method:'query_chuammei_has_send_order',post_data:JSON.stringify(post_data)},function (response) {
                        let result_data =JSON.parse(response)
                           console.log("resultdata:",result_data)
                           if(result_data['success'] === true && result_data['result']['data']['listhb'].length !==0){
                               let order_item = result_data['result']['data']['listhb'][0][0]
                               // tbflag = order_item['flag']
                               tbflag = order_item['sellerFlag']
                               let sellerMemo = order_item['sellerMemo']
                               if(sellerMemo.indexOf("质量问题")!==-1){
                                   memo = sellerMemo+memo
                               }

                               console.log("查询到的订单：",order_item)
                               console.log("官方插旗：",order_item['flag'])
                               console.log("传美插旗：",order_item['cmFlag'])
                               console.log("卖家留言：",order_item['sellerMemo'])


//                                shopTid: {"tid":"3478299265165542431","name":"moonlight539"}
// from: 0
// flag: 0
// cmFlag: 4
// memo:
// isFxFlag: 1
                               let input_data = {
                                   "seller_wangwang_id":seller_wangwang_id,
                                   "order_number":tb_order_number,
                                   "cmflag":cmflag,
                                   "memo":memo,
                                   "flag":tbflag,
                                   "from":from,
                               }

                               chrome.runtime.sendMessage({"method":"add_tag_to_chuanmei_tb","post_data":JSON.stringify(input_data)},function (response) {
                              console.log("传美插旗结果，",response)
                              let result = JSON.parse(response)
                               if(result["success"] === false){
                                   Toast(" 插旗失败，"+result["message"])
                               }else{
                                    Toast(" 插旗成功，"+result["message"],300)
                               }

                            })

                            // let result_ = apichuanmei_add_tag_tb(seller_wangwang_id,tb_order_number,cmflag,memo,tbflag,from)
                            // if(result_["success"] === false){
                            //                Toast(result_["message"])
                            //                 alert("插旗失败")
                            //  }else{
                            //                 Toast(" 插旗成功，"+result_["message"],3000)
                            //  }
                            }
                            })



                    // let add_tag_result =  apichuanmei_add_tag_tb(seller_wangwang_id,tb_order_number,null,remarks_tb,null)

                }




        }


	    });
    })

    //*****************************************
        //   let tr_ =  $(".daiFaGoods")
        // let add_goods_btn =  $("button:contains('添加商品')")
        // console.log("315添加商品按钮：",add_goods_btn)
        //     add_goods_btn.after("<button style='float:left;'>添加商品</button>")
        //   tr_.after("<span  class='init_btn'  style='margin-top: 2em;float:left;background: #2d8cf0;color: white'>初始化按钮</span>")
        //
        //
        // $(".init_btn").click(function () {
        //      $(".tianjia_shanggpin").remove()
        //      $(".shanchu_shanggpin").remove()
        //      let add_goods_btn_item =  $("button:contains('增加商品')")
        //     let delete_goods_btn_item =  $("button:contains('删除商品')")
        //
        //     add_goods_btn_item.parent().parent().prepend("<span  class='tianjia_shanggpin'  style='margin-top: 2em;float:left;background: #2d8cf0;color: white'>增加商品</span>")
        //     delete_goods_btn_item.parent().parent().prepend("<span  class='shanchu_shanggpin'  style='margin-top: 2em;float:left;background: #2d8cf0;color: white'>删除商品</span>")
        //      $(".tianjia_shanggpin").click(function () {
        //     console.log("tianjiasss ",$(this).parent().find("button:contains('增加商品')"))
        //     $(this).parent().find("button:contains('增加商品')").click()
        //     })
        //     $(".shanchu_shanggpin").click(function () {
        //         console.log("tianjiasss ",$(this).parent().find("button:contains('删除商品')"))
        //     $(this).parent().find("button:contains('删除商品')").click()
        // })
        // })
     //*****************************************
}


// 获取订单信息
function api315_get_order_info(){

                     // let html = html_str.substring(html_str.indexOf("<html"),html_str.indexOf("</html>")+7)
                     // let dom = $.parseHTML(html)
                     // let order_list_div = $(dom).find("div[class='orderlist']")
                     let order_list_div = $("div[class='orderlist']")
                     let tb_order_list = []

                    if(order_list_div.length !==0){

                          let ul_elems = $(order_list_div[0]).find("ul")
                         for(let i = 0 ;i<ul_elems.length;i++){
                             let logistics_name = ""
                             let logistics_number = ""
                             let tb_order_number = ""

                             // let tb_order_number_td_elems0 = $(ul_elems[i]).find("td:contains(同步淘宝订单)")
                             let tb_order_number_td_elems = $($(ul_elems[i]).find("tbody").find("tr")[1]).find("td:contains(备注：)")
                             let goods_ul_elems =           $($($(ul_elems[i]).find("tbody").find("tr")[0]).find("td")[0]).find("ul")
                             let goods_item_list = []

                             for(let g=0;g<goods_ul_elems.length;g++){

                                      let goods_info_text = $(goods_ul_elems[g]).text().trim()

                                    let match_reg  = /\[货号：(.*?)]/
                                     let match_text = goods_info_text.match(match_reg)

                                     let goods_status =  ""
                                     console.log("goods_info_text",goods_info_text)
                                     if(goods_info_text.indexOf("已拿货")!==-1){
                                         goods_status = "已拿货"
                                         let goods_item = {
                                             "goods_no":match_text[0],
                                             "goods_status":goods_status,
                                         }
                                         goods_item_list.push(goods_item)
                                     }

                             }




                             let logistics_td_elems = $(ul_elems[i]).find("td:contains(单号：)")



                             if(tb_order_number_td_elems.length !==0){
                                 let order_number_str  =  $(tb_order_number_td_elems[0]).text()
                                 if(order_number_str.indexOf("第三方订单")!==-1){
                                     order_number_str = order_number_str.substring(0,order_number_str.indexOf("第三方订单"))
                                 }
                                 order_number_str = order_number_str.replace("插件同步淘宝订单：","").replace("备注：" ,"")

                                 console.log("tb_order_number",order_number_str)
                                 tb_order_number = "os"+order_number_str
                                 // if(mcommon_get_base_url_remote_server_address_17() === mcommon_get_base_url_remote_server_address_17()){
                                 //     tb_order_number = "r"+tb_order_number
                                 // }

                             }
                             if(logistics_td_elems.length !==0){
                                 console.log("物流元素:",logistics_td_elems)
                                 let text_arr = $(logistics_td_elems[0]).text().split("名称：")

                                 let name_number_arr = text_arr[1].split("单号：")

                                 if(name_number_arr.length===2){
                                     let logistics_name1 = name_number_arr[0].trim()
                                     let logistics_number1 = name_number_arr[1].trim()
                                     if(logistics_name1 !=="" && logistics_number1!=="" ){
                                         if(logistics_name1==="圆通-【菜鸟】"){
                                             logistics_name1 = logistics_name1.replace("圆通-【菜鸟】","圆通[菜鸟]")
                                         }
                                        logistics_name = logistics_name1
                                        logistics_number = logistics_number1
                                     }
                                 }
                             }

                             if(logistics_name !=="" && logistics_number!=="" &&  tb_order_number !=="" && goods_item_list.length!==0){
                                 logistics_number = logistics_number.replace("上传PDF","").trim()
                                let obj = {"logistics_name":logistics_name,"logistics_number":logistics_number,"order_number":tb_order_number,"goods_item_list":goods_item_list,}

                                 if(obj['order_number'].indexOf("-")!==-1){
                                     let pre_str  = obj['order_number'].substring(0,obj['order_number'].indexOf("os")+2)
                                     let content_str = obj['order_number'].replace(pre_str,"")


                                      let content_arr = content_str.split("-")
                                      for(let o = 0 ;o<content_arr.length;o++ ){
                                          let obj_ = {"goods_item_list":goods_item_list,"logistics_name":logistics_name,"logistics_number":logistics_number,"order_number":pre_str+content_arr[o]}

                                          tb_order_list.push(obj_)
                                          console.log("添加对象obj_：",obj_)
                                      }
                                 }else{
                                        tb_order_list.push(obj)
                                     console.log("添加对象obj：",obj)
                                 }


                         }



                     }


                    }
                    console.log("tb_order_list:",tb_order_list)
    return tb_order_list

}






