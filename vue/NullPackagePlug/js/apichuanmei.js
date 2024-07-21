let BASE_URL_tb_chuanmei ="https://tb69.chuanmeidayin.com"


function apichuanmei_add_tag_tb(tb_wangwangid,tb_order_number,flag){
    let return_result = {
        success:false,
        message:"",
    }
     let  submit_data = {
         shopTid: '{"name":"'+tb_order_number+'","tid":"'+tb_wangwangid+'"}',
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

//批量插旗
function apichuanmei_batch_add_tag_tb(tid_list,cmflag,memo,flag,from,is_cover){
    //cmflag 传美旗帜   flag 淘宝旗帜
    let return_result = {
        success:false,
        message:"",
    }
    if(flag===null || flag ===undefined){
        flag = 0
    }
    if(cmflag===null || cmflag ===undefined){
        cmflag = 0
    }
    if(memo===null || memo ===undefined){
        memo = ""
    }
    if(from===null || from ===undefined){
        from = 0
    }
     let  submit_data = {
         shopTid: JSON.stringify(tid_list),
         from: from,
         flag: flag,
         cmFlag:cmflag,
         memo:memo,
         // cmMemo:,
         is_cover: is_cover
     }
     let url = BASE_URL_tb_chuanmei+"/tradeMulti/batchUpdateFlag.do"
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
                return_result['data'] =result.data




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







