// 获取需要打印标签的订单 315格式
 
function api17_get_order_to_tag_print_to315(order_number_list,cookies_obj){
//http://192.168.2.110:8009/back/static/temp/bk/2020-04-05---22-21-16tag315.xls
    let  return_order_list = []
    $.ajax({
                async: false,
                url: mcommon_get_base_url_17()+"/back/outputExcel/?access_token_bk="+cookies_obj['access_token_bk'],
                type: "POST",
                // dataType : 'json',

                data: {'for':'other_website',"order_number_list":JSON.stringify(order_number_list)},
                timeout: 5000,
                success: function (result) {
                console.log("outputExcel", result)
                if(result.json_str !==undefined && result.json_str !==""){
                    return_order_list= JSON.parse(result.json_str)
                    console.log("order_list",return_order_list)
                }else  if(result.last_time_json_str !==undefined && result.last_time_json_str !==""){
                    // return_order_list= JSON.parse(result.last_time_json_str)
                    // console.log("order_list",return_order_list)
                }
                
        },
        error: function (err) {
            console.log("错了:" + err);
            console.log("错了:" + JSON.stringify(err));


        }

    });
    return return_order_list
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

//真实订单已发货同步到17网
function api17_delivery_order_to17(order_list,url_17,cookies_obj) {
    let parms = {
        "deliver_order_list":JSON.stringify(order_list),
    }
    let request_url = url_17+"/back/deliverFromBL/?access_token_bk="+cookies_obj['access_token_bk']
    $.ajax({
        async: false,
        url: request_url,
        type: "POST",
        // dataType : 'json',
        data: parms,
        timeout: 5000,
        success: function (result) {
            console.log("api17_delivery_order_to17", result)
        },
        error: function (err) {
            console.log("错了:" + err);
            console.log("错了:" + JSON.stringify(err));


        }

    });
}
// 添加退件包裹到17
function api17_add_return_package_to17(order_list,url_17,cookies_obj) {
    let parms = {
        "return_package_list":JSON.stringify(order_list),
    }
    let request_url = url_17+"/back/addReturnPackages/?access_token_bk="+cookies_obj['access_token_bk']
    $.ajax({
        async: false,
        url: request_url,
        type: "POST",

        data: parms,
        timeout: 5000,
        success: function (result) {
            console.log("api17_add_return_package_to17", result)
        },
        error: function (err) {
            console.log("错了:" + err);
            console.log("错了:" + JSON.stringify(err));
            console.log("添加退件包裹到17出错")

        }

    });
}
//真实订单已拿货同步到17网 （上传ordernumber 代表整个订单已拿货）
function api17_yinahuo_order_to17(order_number_list,url_17,cookies_obj) {
    let parms = {
        "order_number_list":JSON.stringify(order_number_list),
    }
    let request_url = url_17+"/back/changePurchasingStatusByOrderNumber/?access_token_bk="+cookies_obj['access_token_bk']
    $.ajax({
        async: false,
        url: request_url,
        type: "POST",
        // dataType : 'json',
        data: parms,
        timeout: 5000,
        success: function (result) {
            console.log("已拿货同步到17 成功")
        },
        error: function (err) {
            console.log("错了:" + err);
            console.log("错了:" + JSON.stringify(err));
            console.log("已拿货同步到17失败")

        }

    });
}

  //空包其他网站下单成功 后 通知17服务器
function api17_submit_success_null_order_to17(order_id_list,url_17) {
        let request_url = url_17+"/back/outputNullOrderOtherSiteSuccess/"
        let parms = {"order_id_list":JSON.stringify(order_id_list)}
        $.ajax({
        async: true,
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

  //空包其他网站下单失败订单提交  17服务器
function api17_submit_fail_null_order_to17(exception_order_id_list,url_17) {
        let request_url = url_17+"/back/outputNullOrderOtherSiteException/"
        let parms = {"exception_order_id_list":JSON.stringify(exception_order_id_list)}
        $.ajax({
        async: true,
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



  //实单其他网站下单成功 后 通知17服务器
function api17_submit_success_order_to17(order_number_list,url_17) {
        let request_url = url_17+"/back/outputOrderOtherSiteSuccess/"
        let parms = {"order_number_list":JSON.stringify(order_number_list)}
        $.ajax({
        async: true,
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

