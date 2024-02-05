
function kuaid100_get_logistics_info(params){

    let url = "https://www.kuaidi100.com/query?type=youzhengguonei&postid=9873890994118&temp=0.4481761584371624&phone="

          let return_result = {
        success:false,
        message:"",
    }
     $.ajax({
                async: false,
                url: url,
                type: "GET",
                // dataType : 'json',
                // data: submit_data,
                contentType:"application/x-www-form-urlencoded",
                timeout: 5000,
                success: function (result) {

                console.log(" kuaid100物流信息:",result)

                return_result['success'] =result.success
                return_result['message'] =result.message






        },
            error: function (err) {
            console.log("错了:" + err);
            console.log("错了:" + JSON.stringify(err));
              return_result['success'] = false
             return_result['message'] = "访问错误"

        }


    });
}
//根据物流单号返回快递编号
function kuaid100_get_logistics_code(logistics_number){
    if(logistics_number.startsWith("98")  ){
            return "youzhengguonei"
    }else if(logistics_number.startsWith("YT") || logistics_number.startsWith("yt") ){
            return "yuantong"
    }else if(logistics_number.startsWith("62")   ){
            return "danniao"
    }else if(logistics_number.startsWith("JT")   || logistics_number.startsWith("jt") ){
            return "jtexpress"
    }else if(logistics_number.startsWith("12")    ){
            return "ems"
    }else if(logistics_number.startsWith("77")    ){
            return "shentong"
    }
    return ""
}


function kuaid100_get_logistics_info2(cookie_obj,params){

    // skw_shop_url = "https://www.kuaidi100.com/query?type=youzhengguonei&postid=9873890994118&temp=0.4481761584371624&phone"
      let result_ = {
          "success":"success",

          "logistics_data":[],
          "message":"",

      }
    let logistics_number= params['logistics_number']
    let logistics_code= kuaid100_get_logistics_code(logistics_number)
    if(logistics_code === ""){
        result_["success"] = "fail"
        result_["message"] = "暂不支持的快递"
        return result_
    }
    let url  = "https://www.kuaidi100.com/query?type="+logistics_code+"&postid="+logistics_number+"&temp=0.4481761584371624&phone"
    console.log("cookie_obj_kuaid100",cookie_obj)

      let  DJANGO_SERVER_BASE_URL = "http://39.96.69.115:8089"
      let ser_url = DJANGO_SERVER_BASE_URL+"/user/getWebPageContent/"

           let  header = {

                "Host": "www.kuaidi100.com",
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.169 Safari/537.36",
                'Content-Type': 'application/x-www-form-urlencoded',
                'referer': 'https://www.kuaidi100.com/?from=openv',
    }
      let params_obj = {
            "method":"GET",
            "url":url,
            "header":header,
            "cookies":cookie_obj,
          }
 $.ajax({
            async : false,
            url :ser_url,
            // url :"https://wuliu.taobao.com/user/batch_consign.htm",
            type : "POST",
            // dataType : 'json',
            data :{"req_parms": JSON.stringify(params_obj)},
            timeout : 5000,
            success : function(result) {

                console.log("result",result)
                if(result['code']==="1000"){
                    let kuaid_data = JSON.parse(result['data'])
                    if(kuaid_data["status"]==="200" && kuaid_data["message"] === "ok"){
                            result_["success"] = "success"
                            result_["logistics_data"] = JSON.parse(result['data'])
                    }else{
                        result_["success"] = "fail"
                        result_["message"] = kuaid_data["message"]
                    }
                }


            },
            error:function (err) {
                console.log("错了:" + err);
                result_['success'] = "fail"
                return result_
            }

        });

     return result_


}

