
 let user_name = "root"
 let password = "a123a123a"
 // let base_url = "http://39.96.69.115:8089"
 // let base_url = "http://192.168.2.33:8009"

 function api17_back_login() {
    let url = "/user/login/?access_token=null"
    let request_url = mcommon_get_base_server_url_17() +  url
    let  return_data = null
     let parms = {
        "username":user_name,
        "password":password,
     }
    $.ajax({
            async : false,
            url :request_url,
            type : "POST",
            // dataType : 'json',
            data : parms,
            timeout : 5000,
            complete: function(jqXHR){


    },
            success : function(result) {

                    console.log("登录17结果...........",result)
                   let result1 =result
                    if(result1['code'] === "1000"){
                        return_data = {"is_suc":true,"token":result1['token']}
                    }



            },
            error:function (err) {
                console.log("错了:" + err);
                console.log("错了:" + JSON.stringify(err));

            }
        });


     return return_data
 }
 function api17_back_get_return_package(token,logistics_number) {
    let url = "/back/returnPackageInfo/"
    let request_url = mcommon_get_base_server_url_17() +  url +"?access_token_bk="+token+"&logistics_number="+logistics_number
    let  return_data = null
     // let parms = {
     //    "logistics_number":logistics_number,
     //
     // }
    $.ajax({
            async : false,
            url :request_url,
            type : "GET",
            // dataType : 'json',
            // data : parms,
            timeout : 5000,
            complete: function(jqXHR){


    },
            success : function(result) {

                    console.log("获取17退包结果...........",result)
                   let res = result['results']
              
                    if(res!== undefined  && res.length !==0){
                        return_data = {
                            "add_time":res[0]['add_time'],
                            "return_logistics_name":res[0]['return_logistics_name'],
                            "return_logistics_number":res[0]['return_logistics_number']
                        }
                    }



            },
            error:function (err) {
                console.log("错了:" + err);
                console.log("错了:" + JSON.stringify(err));

            }
        });


     return return_data
 }

function api17_get_one_page_order(order_number_list) {
            let ret_result = null
		   $.ajax({
            async : false,
            url :mcommon_get_base_server_url_17()+"/user/getOrderByTBOrderNumberList/",
            type : "GET",
            // dataType : 'json',
            data : {'tb_order_number_list':order_number_list},
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
function get_one_page_null_order(order_number_list) {
            console.log("mcommon_get_base_server_url_17",mcommon_get_base_server_url_17())
            let ret_result = null
		   $.ajax({
            async : false,
            url :mcommon_get_base_server_url_17()+"/user/getNullOrderByTBOrderNumberList/",
            type : "GET",
            // dataType : 'json',
            data : {'tb_order_number_list':order_number_list},
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

//提交物流信息到退货记录
function api17_submit_logistics_data(data_list){
     let url = mcommon_get_base_server_url_17()+"/back/addReturnPackages/"
    console.log("url--->",url)
     let params = {"return_package_list":JSON.stringify(data_list)}
     let return_result ={}
     $.ajax({
                async: false,
                url: url,
                type: "POST",
                // dataType : 'json',
                data: params,
                contentType:"application/x-www-form-urlencoded",
                timeout: 5000,
                success: function (result) {

                console.log(" 提交结果结果:",JSON.stringify(result))

                return_result['success'] =result.success
                return_result['message'] =result.message
                return_result['result'] =result


        },
            error: function (err) {
            console.log("错了:" + err);
            console.log("错了:" + JSON.stringify(err));
              return_result['success'] = false
             return_result['message'] = "访问错误"

        }


    });

     return return_result
}


//提交多多订单信息到17
function api17_submit_PlatformOrder_data(data_list){
     let url = mcommon_get_base_server_url_17()+"/back/addPlatformOrderInfo/"
     console.log("url--->",url)
     let params = {"order_list":JSON.stringify(data_list)}
     let return_result ={}
     $.ajax({
                async: false,
                url: url,
                type: "POST",
                // dataType : 'json',
                data: params,
                contentType:"application/x-www-form-urlencoded",
                timeout: 5000,
                success: function (result) {

                console.log(" 提交结果结果:",JSON.stringify(result))

                return_result['success'] =result.success
                return_result['message'] =result.message
                return_result['result'] =result


        },
            error: function (err) {
            console.log("错了:" + err);
            console.log("错了:" + JSON.stringify(err));
              return_result['success'] = false
             return_result['message'] = "访问错误"

        }


    });

     return return_result
}

//千牛卖家商品数据保存到服务器
function api17_submit_tb_seller_qianniu_goods_data(goods_list,seller_id){
     let shop_unique_id_option = {
         'moonlight539':{},
         'moonlight539:xiao01':{},
     }
     if(shop_unique_id_option[seller_id] === undefined){
         console.log("不符合条件店铺",seller_id)
         return
     }
     let data_source = '千牛卖家'
     let url = mcommon_get_base_server_url_17()+"/back/addPlatformGoodsInfo/"
     let params = {"goods_list":JSON.stringify(goods_list),'shop_unique_id':seller_id,"data_source":data_source}

     console.log("params>",params)
     let return_result ={}
     $.ajax({
                async: false,
                url: url,
                type: "POST",
                // dataType : 'json',
                data: params,
                contentType:"application/x-www-form-urlencoded",
                timeout: 5000,
                success: function (result) {

                console.log(" 提交结果结果:",JSON.stringify(result))

                return_result['success'] =result.success
                return_result['message'] =result.message
                return_result['result'] =result


        },
            error: function (err) {
            console.log("错了:" + err);
            console.log("错了:" + JSON.stringify(err));
              return_result['success'] = false
             return_result['message'] = "访问错误"

        }


    });
     return return_result

}








