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

//空包数据天教导页面表格 用于导出excel
function api17_null_package_to_excel(data_list){
 let cur_data = new Date()
 let coast =    (data_list.length-1) *2.5
 let file_name =    (cur_data.getMonth()+1)  +"月" +  cur_data.getDate() + "日"+ (data_list.length-1)+"单="+coast+"元"
 common_exportExcel_list_data(data_list,file_name)

}
//空包发货  excel数据来源
function api17_get_excel_null_package_sended_data(item_list){
    console.log("item_list",item_list)


    let return_data_list = []

    for(let i= 0;i<item_list.length;i++){
        let item  = {
                          "logistics_number":'',
                          "logistics_name":'',
                          "id":'',
                      }
        item['logistics_name'] = '韵达'
        for(let key in item_list[i]){
            console.log(key,item_list[i][key])
            if(key.indexOf("订单编号")!==-1){
                item['id'] = item_list[i][key].trim()
            }

            if(key.indexOf("快递名称")!==-1){
                item['logistics_name'] = item_list[i][key].trim()
                if(item['logistics_name'].indexOf("韵达")!==-1){
                    item['logistics_name'] = "韵达"
                }else if(item['logistics_name'].indexOf("中通")!==-1){
                     item['logistics_name'] = "中通实包"
                }else if(item['logistics_name'].indexOf("圆通")!==-1){
                     item['logistics_name'] = "圆通实包"
                }else if(item['logistics_name'].indexOf("申通")!==-1){
                     item['logistics_name'] = "申通实包"
                }else if(item['logistics_name'].indexOf("极兔")!==-1){
                     item['logistics_name'] = "极兔实包"
                }
            }
            if( key.indexOf("发货信息")!==-1 || key.indexOf("备注")!==-1 || key.indexOf("代收金额")!==-1){
                // key.indexOf("发货信息")!==-1 || key.indexOf("快递单号")!==-1
                if(item_list[i][key].trim().length === 15){
                    item['logistics_number'] = item_list[i][key].trim()
                }

            }


        }

        console.log("item:",item)
        if(item['logistics_number']!=="" &&  item['logistics_name'] !=="" &&  item['id'] !==""){
                return_data_list.push(item)
            }

    }
    console.log("return_data_list",return_data_list)
    return return_data_list
}

function api17_get_one_page_order(order_number_list) {
            let ret_result = null
		   $.ajax({
            async : false,
            url :mcommon_get_base_url_17()+"/user/getOrderByTBOrderNumberList/",
            type : "GET",
            // dataType : 'json',
            data : {'tb_order_number_list':order_number_list},
            timeout : 5000,
            success : function(result) {
                    console.log("api17_get_one_page_order:",result)
                    ret_result =  result

            },
            error:function (err) {
                console.log("错了:" + err);
            }
        });
            return ret_result
}

function api17_batch_add_chuammei_tab_by_17order(order_315_data_list,order_17_list){
    return
    let m_result = {}
    let tid_list = []
    for(let i = 0; i < order_17_list.length;i++){
        if(order_17_list[i]['order_status']  !==2){
            // order_status 2是已发货
            let tid_obj = {
                "name":order_17_list[i]['wangwang_id'],
                // "name":"moonlight539",
                "tid":order_17_list[i]['tb_order_number'],
            }
            tid_list.push(tid_obj)
        }


    }
    // tid_list  = [
    //     {
    //             "name":"chenqling3",
    //
    //             "tid":"3584545776713872506",
    //      },
    //     {
    //             "name":"moonlight539",
    //
    //             "tid":"3584091600248980308",
    //      },
    // ]
    console.log("批量传美添加标签tid_list:",tid_list)
    if(tid_list.length!==0){
        console.log("批量传美添加标签tid_list2:",tid_list)
        let result =  apichuanmei_batch_add_tag_tb(tid_list,4,'备注了啊',-1,0,0)
        m_result = result
    }
    return m_result

}