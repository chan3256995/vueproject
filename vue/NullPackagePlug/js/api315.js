let BASE_URL_315 ="https://www.315df.com"
let logistics_choies_315 = {
    "圆通[菜鸟]":19,
    "圆通[拼多多]":27,
    "圆通":19,
    "韵达":3,
    "EMS":29,
}
let testing_choies_315 = {
    "普通质检":19,
    "精检":19,
}
let lipin_315 = {
    "3元好评卡":9,
    "2元好评卡":10,
    "5元好评卡":12,
}
// 根据所选物流检查地址是否可到达
function api315_check_address_is_ok(logistics_name,privince,address){
        let return_result = {
            "code":"error",
            "message":""
        }
        let kdid = logistics_choies_315[logistics_name]
        let area = privince
        let adr = address
        // let url_ = "https://www.315df.com"+"/ajax/kuaidi?kdid="+logistics_value+"&area="+privince+"&adr="+address
        let url_ = "https://www.315df.com/ajax/kuaidi?kdid="+kdid+"&area="+privince+"&adr="+address

  
    $.ajax({
                async: false,
                url: url_,
                type: "GET",
                headers:{
                    "x-requested-with": "XMLHttpRequest",
                },
                // dataType : 'json',
                // data: submit_data_str,
                timeout: 5000,
                success: function (result) {
                return_result['code'] = "ok"
                return_result['data'] = result


        },
                 error: function (err) {
                    console.log("错了:" + err);
                    console.log("错了:" + JSON.stringify(err));
                    return_result['code'] = "error"
                    return_result['message'] = JSON.stringify(err)


        }

    });
    return return_result
}
function api315_keep_cookie_active(){
    let _time = 3*60*1000
    console.log("保持315 cookie 存活 ----"+ new Date())
    setTimeout(function () {
        api315_check_is_login(BASE_URL_315)
        apibl_check_is_login(mcommon_get_null_package_base_url_bl())
        api315_keep_cookie_active()
    },_time)
}
function api315_check_is_login(balse_url){
    let is_login = false
    $.ajax({
                async: false,
                url: balse_url+"/user/profile/myinfo",
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
function api315_add_order_17to315(submit_order_list){
     let ret = {"code":"ok","message":""}
     let submit_data_str = ""
             for(let i = 0;i<submit_order_list.length;i++){
                submit_data_str = submit_data_str +"&orderjson[]="+JSON.stringify(submit_order_list[i])
             }
             submit_data_str = submit_data_str.substring(1,submit_data_str.length)
     $.ajax({
                async: false,
                url: BASE_URL_315+"/user/quick?charset=utf",
                type: "POST",
                // dataType : 'json',
                data: submit_data_str,
                contentType:"application/x-www-form-urlencoded",
                timeout: 5000,
                success: function (result) {

                    if(result === ""){
                         console.log("quick success",result)
                         ret['code'] = 'error'
                         ret['message'] = '未登录'
                    }else if(result.indexOf('<p class="error">')!==-1){
                        console.log(" 没有满足条件的订单或提交数据有错")
                        ret['code'] = 'error'
                        ret['message'] = '没有满足条件的订单或提交数据有错'
                    }else{
                         let html = result.substring(result.indexOf("<html>"),result.indexOf("</html>")+7)
                        let dom = $.parseHTML(html)
                        let page_dom = $(dom).find(".order-item")

                         // let order_item_elems = $(page_dom).find("div[class='order-item']")
                         let order_item_elems = $(dom).find(".order-item")
                         console.log("order_item_elems",order_item_elems)
                         console.log("page_dom",page_dom)
                         // console.log("批量代发页面数据html",html)

                         for(let i = 0;i<order_item_elems.length;i++){
                             let order_number =$(order_item_elems[i]).find("input[name = 'tb_orderid']")[0].value
                             let order = find_order_by_order_number(submit_order_list,order_number)
                             let goodcustomize = order['goodcustomize']
                             if(order!==null){
                                 let goods_list_elems = $(order_item_elems[i]).find(".daiFaGoods")
                                  for(let g = 0;g<goods_list_elems.length;g++){
                                         if(goodcustomize[g]!==undefined && goodcustomize[g] !==""&& goodcustomize[g] !==null){
                                             $(goods_list_elems[g]).find("input[name='customize']")[0].setAttribute("value",goodcustomize[g])
                                         }

                                    }
                                 if(order.testing_name === "基本质检"){
                                        //普通质检
                                         $($(order_item_elems[i]).find(".inspect0")[0]).attr("checked",'true')
                                 }else if(order.testing_name === "精检"){
                                          $($(order_item_elems[i]).find(".inspect1")[0]).attr("checked",'true')
                                 }
                                  if( logistics_choies_315[order.logistics_name]!== undefined){
                                    $($(order_item_elems[i]).find("select[name='shipping_id']")[0]).find("option")[0].setAttribute("value",logistics_choies_315[order.logistics_name])
                                  }
                                  if( order.gift_315!== undefined){
                                     let lipin_value = lipin_315[order.gift_315]
                                    $($(order_item_elems[i]).find("input[name='liping'][value='"+lipin_value+"']")[0]).attr("checked",'true')
                                  }
                             }
                         }

                        let order_count = page_dom.length

                        let save_result = saveCheckOrder(page_dom)
                        console.log("保存",order_count)
                        if(save_result.code === "ok"){
                           
                           
                        }else{
                            
                             ret['code'] = 'error'
                             ret['message'] = save_result.message
                        }
                    }


        },
                error: function (err) {
            console.log("错了:" + err);
            console.log("错了:" + JSON.stringify(err));
            let  err_str = JSON.stringify(err)
            if (err_str.indexOf("\"readyState\":0,\"status\":0,\"statusText\":\"NetworkError: Failed to execute 'send' on 'XMLHttpRequest': Failed to load")!==-1){
                console.log("未登录")
                ret['code'] = 'error'
                ret['message'] = '未登录'
            }else if(err_str.indexOf('"status":500,"statusText":"error"')!==-1){
                console.log("提交数据异常，提交失败")
                 ret['code'] = 'error'
                ret['message'] = '提交数据异常，提交失败'
            }

        }


    });
     return ret
}
function api315_get_order_from315(params){
   let url = BASE_URL_315+"/user/order/daifa"
    let order_list = []
    let ret = {"code":"ok", "message":""}
    let obj = {}
    let page_info = {}
    $.ajax({
                async: false,
                url: url,
                type: "GET",
                // dataType : 'json',
                data: params,
                timeout: 5000,
                success: function (result) {
                     let html = result.substring(result.indexOf("<html"),result.indexOf("</html>")+7)
                     let dom = $.parseHTML(html)
                     let order_list_div = $(dom).find("div[class='orderlist']")
                     let paginator_ul = $(dom).find("ul[class='pagination']")
                     let cur_page = 1
                     let page_counts = 1
                    if(paginator_ul.length > 0){
                        console.log("paginator_ul",paginator_ul)
                        let paginator_span = $(paginator_ul[0]).find("span:contains(条记录)")
                        console.log("paginator_span",paginator_span)
                        let paginator_text = $(paginator_span[0]).text().trim()
                         console.log("paginator_text",paginator_text)
                        let cur_page_reg = "第\\d+页"
                        let page_counts_reg = "共\\d+页"
                        cur_page =  paginator_text.match(cur_page_reg)[0].replace("第",'').replace("页",'').trim()
                        page_counts = paginator_text.match(page_counts_reg)[0].replace("共",'').replace("页",'').trim()
                    }

                    if(order_list_div.length !==0){

                          let ul_elems = $(order_list_div[0]).find("ul")
                         for(let i = 0 ;i<ul_elems.length;i++){
                             let logistics_name = ""
                             let logistics_number = ""
                             let tb_order_number = ""
                             console.log("ul_elems",i)
                             // let tb_order_number_td_elems0 = $(ul_elems[i]).find("td:contains(同步淘宝订单)")
                             let tb_order_number_td_elems = $($(ul_elems[i]).find("tbody").find("tr")[1]).find("td:contains(备注：)")
                             console.log("tb_order_number_td_elems:",tb_order_number_td_elems)

                             let logistics_td_elems = $(ul_elems[i]).find("td:contains(单号)")

                             if(tb_order_number_td_elems.length !==0){
                                 let order_number_str = $(tb_order_number_td_elems[0]).text().replace("插件同步淘宝订单：","").replace("备注：" ,"")
                                 // let tem_arr = order_number_str.split("：")
                                 // let length = tem_arr.length
                                 // let order_number = tem_arr[length-1]
                                 console.log("tb_order_number",order_number_str)
                                 tb_order_number = "os"+order_number_str
                                 if(mcommon_get_base_url_remote_server_address_17() === mcommon_get_base_url_remote_server_address_17()){
                                     tb_order_number = "r"+tb_order_number
                                 }

                             }
                             if(logistics_td_elems.length !==0){
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
                              console.log("logistics_number1",logistics_number)
                             if(logistics_name !=="" && logistics_number!=="" &&  tb_order_number !==""){
                                 logistics_number = logistics_number.replace("上传PDF","").trim()
                                let obj = {"logistics_name":logistics_name,"logistics_number":logistics_number,"order_number":tb_order_number}
                                console.log("logistics_number2",logistics_number)
                                order_list.push(obj)
                         }



                     }
                     

                    }

                    page_info = {
                    "cur_page":cur_page,
                    "page_counts":page_counts,
                  }
                   obj = {
                      "order_list":order_list,
                      "page_info" : page_info,
                  }
                  ret['data'] = obj
                },
                error: function (err) {
                   // 状态码
                    console.log(err.status);
                    // 状态
                    console.log(err.readyState);
                    console.log("错了:" + JSON.stringify(err));
                    if(err.status=== 0 && err.readyState === 0){
                         ret['message'] = "未登录"
                         ret['code'] = "fail"
                     }




        }


    });
   return ret
}

function find_order_by_order_number(order_list,order_number){
    for(let i = 0 ; i<order_list.length;i++){
        if(order_list[i].order_number === order_number){
            return order_list[i]
        }
    }
    return null
}
function saveCheckOrder(page_dom){
        let postdata = null ;
        let  ret = {"code":"error","message":""}
        // postdata = changeOrder(form_elem)
        let check_results = checkOrderData(page_dom)
        if(check_results.code === "ok"){
           postdata =check_results.order
        }else{
            ret['code'] = "error"
            ret['message'] = check_results.message
            return  ret
        }


         $.ajax({
                        async: false,
                        url: BASE_URL_315+"/user/quick/save.html",
                        type: "POST",
                        // dataType : 'json',
                        data: {jsonstr:postdata},
                        timeout: 5000,
                        success: function (result) {
                         if(result['errcode']===1){
                              ret['code'] = "error"
                              ret['message'] = result['errmsg']
                             console.log("提交错误,",result['errmsg'])
                         }else{
                             ret['code'] = "ok"
                              ret['message'] = ""
                         }

                },
                error: function (err) {
                    console.log("错了:" + err);
                    console.log("错了:" + JSON.stringify(err));
                    let  err_str = JSON.stringify(err)
                    if (err_str.indexOf("\"readyState\":0,\"status\":0,\"statusText\":\"NetworkError: Failed to execute 'send' on 'XMLHttpRequest': Failed to load")!==-1){
                        console.log("未登录")
                          ret['code'] = "error"
                          ret['message'] = "未登录"
                    }else if(err_str.indexOf("\"readyState\":4,\"responseText\"")){
                        console.log("提交异常出错 ")
                        ret['code'] = "error"
                         ret['message'] = "提交异常出错"
                    }

                }

    });
        return ret



    }
function checkOrderData(form_elem){
        let order = new Array();
        let ret = {"code":"error","message":""}
        console.log("$(form_elem).find(\".order-list .order-item\")",$(form_elem).find(".order-list .order-item"))
        console.log("$(form_elem).find(\".order-item\")",$(form_elem).find(".order-item"))
        console.log(" $(form_elem)", $(form_elem))
        $(form_elem).each(function (index) {
            let obj = {};
            obj.order_sn = $(this).find("input[name='order_sn']").val();
            obj.tb_orderid = $(this).find("input[name='tb_orderid']").val();
            obj.address_user =  $(this).find("input[name='address_user']").val()
            obj.address_tel = $(this).find("input[name='address_tel']").val();
            obj.area = $(this).find("input[name='area']").val();
            obj.address = $(this).find("input[name='address']").val();
            obj.mark = $(this).find("input[name='mark']").val();
            obj.wuliu = $(this).find("select[name='shipping_id']").val();
            obj.regards = $(this).find("select[name='regards']").val();
            obj.inspect = changeRadio($(this).find("input[type='radio']"));
            obj.lipin = changeLipin($(this).find(".lipin").find("input"));
            let check_goods_result = checkGoodsData($(this).find(".daiFaGoods"));
            if(check_goods_result.code==="error"){
                ret["code"] = "error"
                ret["message"] = check_goods_result.message
                return ret
            }
            obj.goodsitem = check_goods_result.goodsItem
            if(obj.address_user===undefined || obj.address_user === ""){
                ret["code"] = "error"
                ret["message"] = "收件人不能为空"
                return ret
            };
            if(obj.address_tel===undefined || obj.address_tel === ""){
                ret["code"] = "error"
                ret["message"] = "收件人电话不能为空"
                return ret

            } ;
            if(obj.area===undefined || obj.area === ""){
                ret["code"] = "error"
                ret["message"] = "收件人地址不能为空"
                return ret

            };
            if(obj.address===undefined || obj.address === ""){
                ret["code"] = "error"
                ret["message"] = "收件人详细地址不能为空"
                return ret

            };
            order.push(obj);



        });
        ret["code"] = "ok"
        ret["message"] = ""
        ret["order"] = order
        console.log("即将保存提交到315的数据order-->",ret)
        return ret
    }
function checkGoodsData(obj) {
        var goodsItem = new Array();
        obj.each(function () {
            var item = {};
            var market = $(this).find("select[name='market']").val().split("|");
            item.market_id = market[1] || 0;
            item.market_name = market[0] || '';
            item.floor = $(this).find("select[name='floor']").val();
            item.goodids = $(this).find("input[name='goodids']").val();
            item.goods_code = $(this).find("input[name='goods_code']").val();
            item.isbh = $(this).find("input[name='isbh']").val();
            item.ids = $(this).find("input[name='ids']").val();
            item.goods_name = $(this).find("input[name='goods_name']").val();
            item.mouths = $(this).find("input[name='mouths']").val();
            item.remark = $(this).find("input[name='remark']").val();
            item.goods_sn = $(this).find("input[name='goods_sn']").val();
            item.goods_attr = $(this).find("input[name='goods_attr']").val();
            item.num = $(this).find("input[name='num']").val();
            item.price = $(this).find("input[name='price']").val();
            item.goods_img = $(this).find("input[name='goods_img']").val();
            item.customize = $(this).find("input[name='customize']").val();
            item.product_id = 0;
            item.product_attr_id = 0;
            item.product_ware_id = 0;
            item.product_user_id = 0;
            if(item.market_name===undefined || obj.market_name === ""){return {"code":"error","message":"市场不能为空"}};
            if(item.floor===undefined || obj.floor === ""){return {"code":"error","message":"楼层不能为空"}};
            if(item.mouths===undefined || obj.mouths === ""){return {"code":"error","message":"档口号不能为空"}};
            if(item.goods_sn===undefined || obj.goods_sn === ""){return {"code":"error","message":"货号不能为空"}};
            if(item.goods_attr===undefined || obj.goods_attr === ""){return {"code":"error","message":"颜色尺码不能为空"}};
            if(item.num===undefined || obj.num === ""){return {"code":"error","message":"数量不能为空"}};
            if(item.price===undefined || obj.price === ""){return {"code":"error","message":"价格不能为空"}};
            goodsItem.push(item);
        });

        return {"code":"ok","message":"","goodsItem":goodsItem};
    }
function changeOrder(form_elem){
        var order = new Array();
        console.log("$(form_elem).find(\".order-list .order-item\")",$(form_elem).find(".order-list .order-item"))
        $(form_elem).find(".order-list .order-item").each(function (index) {
            var obj = {};
            obj.order_sn = $(this).find("input[name='order_sn']").val();
            obj.tb_orderid = $(this).find("input[name='tb_orderid']").val();
            obj.address_user = $(this).find("input[name='address_user']").val();
            obj.address_tel = $(this).find("input[name='address_tel']").val();
            obj.area = $(this).find("input[name='area']").val();
            obj.address = $(this).find("input[name='address']").val();
            obj.mark = $(this).find("input[name='mark']").val();
            obj.wuliu = $(this).find("select[name='shipping_id']").val();
            obj.regards = $(this).find("select[name='regards']").val();
            obj.inspect = changeRadio($(this).find("input[type='radio']"));
            obj.lipin = changeLipin($(this).find(".lipin").find("input"));
            obj.goodsitem = changeGoods($(this).find(".daiFaGoods"));
            order.push(obj);
        });
        return order;
    }

     function changeRadio(obj){
        var val = 0;
        obj.each(function () {
            if($(this).is(":checked")==true){
                val = $(this).val();
            }
        });
        return val;
    }

    function changeLipin(obj){
        var lp_ids="0";
        obj.each(function () {
            if($(this).is(":checked")){
                lp_ids+= ','+ $(this).val();
            }
        });
        return lp_ids;
    }

    function changeGoods(obj) {
        var goodsItem = new Array();
        obj.each(function () {
            var item = {};
            var market = $(this).find("select[name='market']").val().split("|");
            item.market_id = market[1] || 0;
            item.market_name = market[0] || '';
            item.floor = $(this).find("select[name='floor']").val();
            item.goodids = $(this).find("input[name='goodids']").val();
            item.goods_code = $(this).find("input[name='goods_code']").val();
            item.isbh = $(this).find("input[name='isbh']").val();
            item.ids = $(this).find("input[name='ids']").val();
            item.goods_name = $(this).find("input[name='goods_name']").val();
            item.mouths = $(this).find("input[name='mouths']").val();
            item.remark = $(this).find("input[name='remark']").val();
            item.goods_sn = $(this).find("input[name='goods_sn']").val();
            item.goods_attr = $(this).find("input[name='goods_attr']").val();
            item.num = $(this).find("input[name='num']").val();
            item.price = $(this).find("input[name='price']").val();
            item.goods_img = $(this).find("input[name='goods_img']").val();
            item.customize = $(this).find("input[name='customize']").val();
            goodsItem.push(item);
        });
        return goodsItem;
    }