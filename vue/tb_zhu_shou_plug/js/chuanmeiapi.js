


function chuanmeiapi_save_order_to_chuamei(order_data){
    let request_url = "https://tb1.chuanmeidayin.com/cmdy/operation/offline?method=save"
    let parms = order_data
      $.ajax({
            async : false,
            url :request_url,
            type : "POST",
            // dataType : 'json',
            data : parms,
            timeout : 5000,
            scriptCharset: 'GBK',
            success : function(result) {

                console.log(result)

            },
            error:function (err) {

            }
        });
}