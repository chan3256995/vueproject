
 let user_name = "root"
 let password = "a123a123a"
 let base_url = "http://39.96.69.115:8089"

 function api17_back_login() {
    let url = "/user/login/?access_token=null"
    let request_url = base_url +  url
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
    let request_url = base_url +  url +"?access_token_bk="+token+"&logistics_number="+logistics_number
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
 function api17_get_server_base_url(){
    return base_url
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






