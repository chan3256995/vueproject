let BASE_URL_315 ="https://www.315df.com"
let logistics_choies = {
    "圆通[菜鸟]":19,
    "圆通[拼多多]":27,
    "韵达":3,
}
let testing_choies_315 = {
    "普通质检":19,
    "精检":19,
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
     let parms ={"kw": return_logistics_number}
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
                        let text1 = $($(tr_el[0]).children()[6]).text().trim().replaceAll("  "," ")
                        let text2 = $($(tr_el[0]).children()[8]).text().trim().replaceAll("  "," ")
                         pacakge_info = text1 + text2
                    }




        },
                 error: function (err) {
                    console.log("错了:" + err);
                    console.log("错了:" + JSON.stringify(err));


        }

    });
    return pacakge_info
}





