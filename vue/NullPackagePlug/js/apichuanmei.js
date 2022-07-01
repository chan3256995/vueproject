let BASE_URL_tb_chuanmei ="https://tb30.chuanmeidayin.com/"


function apichuanmei_add_tag_tb(tb_wangwangid,tb_order_number,flag){
    let return_result = {
        success:false,
        message:"",
    }
     let  submit_data = {
         shopTid: '{"tid":"'+tb_order_number+'","name":"'+tb_wangwangid+'"}',
         from: 0,
         flag: 0,
         cmFlag: flag,
         memo:"",
         isFxFlag: 1
     }
     let url = BASE_URL_tb_chuanmei+"/tradeMulti/editMemo.do"
    $.ajax({
                async: false,
                url: url,
                type: "POST",
                // dataType : 'json',
                data: submit_data,
                contentType:"application/x-www-form-urlencoded",
                timeout: 5000,
                success: function (result) {

                console.log(" 传美备注标签结果:",result)

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
    return return_result
}
