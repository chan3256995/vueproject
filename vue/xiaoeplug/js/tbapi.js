let default_tb_code = "女人街 12F A12-A-临时款号#12"
let default_tb_code2_youfei = "youfei"
let logistics_choies2 = {
    "圆通":101,
    "圆通[菜鸟]":101,
    "圆通[拼多多]":101,
    "圆通实包":101,
    "圆通空包":101,
    "圆通纸板":101,
    "圆通洗衣粉":101,
    "圆通纸巾":101,
    "韵达":102,
    "韵达空包":102,
    "韵达纸板":102,
    "韵达纸巾":102,
    "韵达洗衣粉":102,
    "EMS":2,

}
// 颜色 需要修改的取代
let replace_goods_data = {

    "国大_6F_ 665_45_#9815":{"size":"","color":{"绿色":"绿格子","其他二":"碎花色"}},
    "女人街 2F C07-53#8667":{"size":"","color":{"白色":"白色裙子","其他二":"碎花色"}},
}
function get_utf_to_gbk_char(seria_str,server_url){
      chrome.cookies.getAll({'url':'https://trade.taobao.com'}, function(cookie) {
          let cookies_obj = {}
          let cookie_str = ""
          let cookie_string = ""
          for (let i in cookie) {
              let name = cookie[i].name;
              let value = cookie[i].value;
              cookies_obj[name] = value;
              cookie_str += (name + "=" + value + ";\n");
              cookie_string += (name + "=" + value + "&");
          }

            $.ajax({
            async : false,
            url :server_url+"/back/temp/",
            // url :"https://wuliu.taobao.com/user/batch_consign.htm",
            type : "POST",
            // dataType : 'json',
            data :{"utf_str":seria_str,"cookies":JSON.stringify(cookies_obj)},
            timeout : 5000,
            success : function(result) {
                console.log("result",result)

            },
            error:function (err) {
                console.log("错了:" + err);
            }

        });
      })

}
function tbapi_delivery_order_to_tb(order_list,logistics_name,server_url){
    let ret_form = null
    let tb_order_number = ""
    for (let i = 0 ;i<order_list.length;i++){
        tb_order_number = tb_order_number + order_list[i].tb_order_number+","
    }

     $.ajax({
            async : false,
            url :"https://wuliu.taobao.com/user/batch_consign.htm?trade_ids="+tb_order_number,
            // url :"https://wuliu.taobao.com/user/batch_consign.htm",
            type : "GET",
            // dataType : 'json',
            // data : data2,
            timeout : 5000,
            success : function(result) {

                    let htmlt = result.substring(result.indexOf("<html>"),result.indexOf("</html>")+7)
                    let html = $.parseHTML(htmlt)
                    console.log("html--------->",htmlt)
                    let dom = $(html)

                    let step3_div = dom.find("div[id='step3']")[0]
                    let item_table = $(step3_div).find("table")
                    for(let i = 0 ;i <item_table.length;i++){
                       let page_order_number_elem =  $(item_table[i]).find("tbody").find("span[class='order-number']")[0]
                       let page_order_number =  $(page_order_number_elem).text().replace("订单编号：","")
                       let page_order_id =  $($(item_table[i]).find("thead").find("input[name='orderId']")[0]).val()
                       console.log("page_order_number:"+page_order_number+" page_order_id:"+page_order_id)
                       let order = find_order_by_order_number(order_list,page_order_number)
                       if(order!==null){
                          let logistic_elem = $(item_table[i]).find("input[name='_fmw.m."+page_order_id+".m']")[0]
                          let post_code_elem = $(item_table[i]).find("input[name='_fmw.r."+page_order_id+".z']")[0]
                           let post_code = $(post_code_elem).val()
                           if(post_code !== undefined && post_code.length!==6){
                               post_code_elem.setAttribute("value",'000000')
                           }
                          logistic_elem.setAttribute("value",order.logistics_number)

                       }
                    }

                    let form = dom.find('form')[0]
                     let logistic_type_elem = dom.find("input[name='logisType']")[0]
                     let logistic_company_id_elem = dom.find("select[name='sameLogisCompanyId']")[0]
                    logistic_type_elem.setAttribute("value","2")
                    $(logistic_company_id_elem).val(logistics_choies2[logistics_name])
                    // form.setAttribute("action","https://wuliu.taobao.com/user/batch_consign.htm")
                    form.setAttribute("action","https://wuliu.taobao.com/user/batch_consign.htm")
                    form.setAttribute("accept-charset","GBK")
                    console.log("form+++++++++++",$(form))
                    let serialize0 = $(form).serialize()

                    let seria_obj = mcommon_form_serialize_data_to_obj(serialize0)
                    console.log("seria_obj",seria_obj)

                    let gbk_str = get_utf_to_gbk_char(decodeURIComponent(serialize0),server_url)
                    let gbk_obj = gbk_str

                    console.log("gbk_obj",gbk_obj)
                return
         $.ajax({
            async : false,
            url :"https://wuliu.taobao.com/user/batch_consign.htm",
            type : "POST",
            // dataType : 'json',
            data : seria_obj,
            timeout : 5000,
            success : function(result) {
                    console.log("gbk_objresult:",result)


            },
            error:function (err) {
                console.log("错了:" + err);
            }
        });

                            // 1.基本参数设置
    var options = {
       // type: 'POST',     // 设置表单提交方式
       // url: "https://wuliu.taobao.com/user/batch_consign.htm",    // 设置表单提交URL,默认为表单Form上action的路径
             url :"https://wuliu.taobao.com/user/batch_consign.htm",
             type : "POST",
        // dataType : 'json',
        //data : {'tb_order_number_list':order_number_list},
//         dataType: 'json',    // 返回数据类型
        beforeSend: function(formData, jqForm, option){    // 表单提交之前的回调函数，一般用户表单验证
            // formData: 数组对象,提交表单时,Form插件会以Ajax方式自动提交这些数据,格式Json数组,形如[{name:userName, value:admin},{name:passWord, value:123}]
            // jqForm: jQuery对象,，封装了表单的元素   
            // options: options对象
//             var str = $.param(formData);    // name=admin&passWord=123
            var dom = jqForm[0];    // 将jqForm转换为DOM对象
            var name = dom.name.value;    // 访问jqForm的DOM元素
                console.log("pppppppppppp")
                        /* 表单提交前的操作 */
            return false;  // 只要不返回false,表单都会提交 
        },
   beforeSubmit: function(formData, jqForm, option){    // 表单提交之前的回调函数，一般用户表单验证
            // formData: 数组对象,提交表单时,Form插件会以Ajax方式自动提交这些数据,格式Json数组,形如[{name:userName, value:admin},{name:passWord, value:123}]
            // jqForm: jQuery对象,，封装了表单的元素   
            // options: options对象
//             var str = $.param(formData);    // name=admin&passWord=123
            var dom = jqForm[0];    // 将jqForm转换为DOM对象
            var name = dom.name.value;    // 访问jqForm的DOM元素
                console.log("pppppppppppp")
                        /* 表单提交前的操作 */
            return false;  // 只要不返回false,表单都会提交 
        },
                success: function(responseText, statusText, xhr, $form){    // 成功后的回调函数(返回数据由responseText获得)
            if (responseText.status == '1') {
                alert("操作成功!" + responseText.msg);
                console.log("操作成功!" ,responseText.msg);
                /* 成功后的操作 */
            } else {
                             console.log("操作失败!" ,responseText.msg);
                alert("操作失败!" + responseText.msg);    // 成功访问地址，并成功返回数据，由于不符合业务逻辑的失败
            }
        },  
        error: function(xhr, status, err) {     
                console.log("操作失败!" ,err);       
            alert("操作失败!");    // 访问地址失败，或发生异常没有正常返回
        },
        clearForm: true,    // 成功提交后，清除表单填写内容
        resetForm: true    // 成功提交后，重置表单填写内容
    };
   
    // 2.绑定ajaxSubmit()

         return
        form.submit(function(){
        console.log("submit---")
        $(this).ajaxSubmit(options)
    return false
    });

                    return
                     let serialize = $(form).serialize()
                     form.setAttribute("accept-charset","gb2312")
                    console.log('serialize--',serialize)
                    let serialize_arr = serialize.split("&")
                    console.log('serialize_arr',serialize_arr)
                    let tem_data = {}
                    for (let i = 0;i<serialize_arr.length;i++){
                        let item = serialize_arr[i].split("=")
                        tem_data[item[0]] = item[1]
                    }
                    tem_data['logisType'] = 2
                    // tem_data['sameLogisCompanyId'] = 102
                    tem_data['sameLogisCompanyId'] = 5000000178661
                    tem_data['_fmw.m.'+order_id2+'.m'] = 43042331270642222
                    console.log('tem_data',tem_data)
                    let new_serialize = ""
                    for(let name in tem_data){
                        new_serialize = new_serialize + name+"="+tem_data[name]+'&'
                    }
                    console.log("new_serialize--->",new_serialize)
                    new_serialize = new_serialize.substring(0,new_serialize.length-1)

                    console.log("new_serialize---2>",new_serialize)

                    console.log("new_serialize---encodeURI>",encodeURI(new_serialize))
                    console.log("new_serialize---escape>",escape(new_serialize))


                    let test_text = "backFill=&_fmw.to._0.t=&source=&callUrl=&_tb_token_=7a337563796d5&action=user%2Fbatch_consign_action&event_submit_do_batch_consign_save=1&_fmw.f._0.co=762418401&_fmw.f._0.coun=441481&_fmw.f._0.c=%B3%C2%C7%E5%C1%FA&_fmw.f._0.p=&_fmw.f._0.ci=&_fmw.f._0.cou=&_fmw.f._0.adr=%BA%E8%B4%EF%BB%A8%D4%B0+%D0%CB%BA%E8%D2%BB%BD%D6%A3%A8%BD%F0%BA%D3%CD%E5%B3%B5%BF%E2%C8%EB%BF%DA%B6%D4%C3%E6%A3%A9%A1%A3&_fmw.f._0.dd=%B9%E3%B6%AB%CA%A1%C3%B7%D6%DD%CA%D0%D0%CB%C4%FE%CA%D0%BA%E8%B4%EF%BB%A8%D4%B0+%D0%CB%BA%E8%D2%BB%BD%D6%A3%A8%BD%F0%BA%D3%CD%E5%B3%B5%BF%E2%C8%EB%BF%DA%B6%D4%C3%E6%A3%A9%A1%A3&_fmw.f._0.ad=%B9%E3%B6%AB%CA%A1%5E%5E%5E%C3%B7%D6%DD%CA%D0%5E%5E%5E%D0%CB%C4%FE%CA%D0%5E%5E%5E%BA%E8%B4%EF%BB%A8%D4%B0+%D0%CB%BA%E8%D2%BB%BD%D6%A3%A8%BD%F0%BA%D3%CD%E5%B3%B5%BF%E2%C8%EB%BF%DA%B6%D4%C3%E6%A3%A9%A1%A3&_fmw.f._0.z=514500&_fmw.f._0.ddd=&_fmw.f._0.ph=&_fmw.f._0.b=&_fmw.f._0.t=&_fmw.f._0.m=17087987015&_fmw.re._0.co=762418401&_fmw.re._0.coun=441481&_fmw.re._0.c=%B3%C2%C7%E5%C1%FA&_fmw.re._0.p=&_fmw.re._0.ci=&_fmw.re._0.cou=&_fmw.re._0.adr=%BA%E8%B4%EF%BB%A8%D4%B0+%D0%CB%BA%E8%D2%BB%BD%D6%A3%A8%BD%F0%BA%D3%CD%E5%B3%B5%BF%E2%C8%EB%BF%DA%B6%D4%C3%E6%A3%A9%A1%A3&_fmw.re._0.dd=%B9%E3%B6%AB%CA%A1%C3%B7%D6%DD%CA%D0%D0%CB%C4%FE%CA%D0%BA%E8%B4%EF%BB%A8%D4%B0+%D0%CB%BA%E8%D2%BB%BD%D6%A3%A8%BD%F0%BA%D3%CD%E5%B3%B5%BF%E2%C8%EB%BF%DA%B6%D4%C3%E6%A3%A9%A1%A3&_fmw.re._0.ad=%B9%E3%B6%AB%CA%A1%5E%5E%5E%C3%B7%D6%DD%CA%D0%5E%5E%5E%D0%CB%C4%FE%CA%D0%5E%5E%5E%BA%E8%B4%EF%BB%A8%D4%B0+%D0%CB%BA%E8%D2%BB%BD%D6%A3%A8%BD%F0%BA%D3%CD%E5%B3%B5%BF%E2%C8%EB%BF%DA%B6%D4%C3%E6%A3%A9%A1%A3&_fmw.re._0.z=514500&_fmw.re._0.ddd=&_fmw.re._0.ph=&_fmw.re._0.b=&_fmw.re._0.t=&_fmw.re._0.m=17087987015&sameLogisCompanyId=-1&logisType=2&_fmw.f._0.f=&_fmw.f._0.fe=&_fmw.f._0.fet=&orderId=170556691650&_fmw.r.170556691650.count=510122&_fmw.r.170556691650.p=&_fmw.r.170556691650.ci=&_fmw.r.170556691650.d=&_fmw.r.170556691650.coun=&_fmw.r.170556691650.adr=%BB%AA%D1%F4%D5%F2%BD%D6%B5%C0+++%C4%CF%BA%FE%BD%F5%D4%B7%C8%FD%B5%A5%CE%BB%D2%BB%B6%B0204&_fmw.r.170556691650.dd=%CB%C4%B4%A8%CA%A1%B3%C9%B6%BC%CA%D0%CB%AB%C1%F7%C7%F8+%BB%AA%D1%F4%D5%F2%BD%D6%B5%C0+++%C4%CF%BA%FE%BD%F5%D4%B7%C8%FD%B5%A5%CE%BB%D2%BB%B6%B0204&_fmw.r.170556691650.ad=%CB%C4%B4%A8%CA%A1%5E%5E%5E%B3%C9%B6%BC%CA%D0%5E%5E%5E%CB%AB%C1%F7%C7%F8%5E%5E%5E+%BB%AA%D1%F4%D5%F2%BD%D6%B5%C0+++%C4%CF%BA%FE%BD%F5%D4%B7%C8%FD%B5%A5%CE%BB%D2%BB%B6%B0204&_fmw.r.170556691650.c=%D5%C5%D0%C0%D0%C0&_fmw.r.170556691650.ddd=&_fmw.r.170556691650.ph=&_fmw.r.170556691650.b=&_fmw.r.170556691650.t=&_fmw.r.170556691650.mo=13778350323&_fmw.r.170556691650.z=000000&_fmw.r.170556691650.is=&_fmw.m.170556691650.m=&_fmw.m.170556691650.goods=+%C4%FA%BF%C9%D2%D4%D4%DA%B4%CB%CA%E4%C8%EB%B1%B8%CD%FC%D0%C5%CF%A2%A3%A8%BD%F6%C2%F4%BC%D2%D7%D4%BC%BA%BF%C9%BC%FB%A3%A9%A1%A3"





fetch("https://wuliu.taobao.com/user/batch_consign.htm", {
     method: 'POST',
     mode: 'cors',
     credentials: 'include',
     body: serialize,

  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',

  },

}).then(function(response) {
  console.log(response);
});
            },
            error:function (err) {
                console.log("错了:" + err);
            }

        });
return ret_form







    return
    let order_id = ""
    let parms =  {}
    parms ['orderId']=order_id
    parms ['parms_fmw.r.'+order_id+'.count']=371002
    parms ['_fmw.r.'+order_id+'.p']=''
    parms ['_fmw.r.'+order_id+'.ci']=''
    parms ['_fmw.r.'+order_id+'.d']=''
    parms ['_fmw.r.'+order_id+'.coun']=''
    parms ['_fmw.r.'+order_id+'.ddd']=''
    parms ['_fmw.r.'+order_id+'.ph']=''
    parms ['_fmw.r.'+order_id+'.b']=''
    parms ['_fmw.r.'+order_id+'.t']=''
    parms ['_fmw.r.'+order_id+'.mo']='15234169725'
    parms ['_fmw.r.'+order_id+'.z']='000000'
    parms ['_fmw.r.'+order_id+'.is']=''
    parms ['_fmw.m.'+order_id+'.m']='430210463590'


    let data = {
        'backFill':'',
        '_fmw.to._0.t':'',
        'source':'',
        'callUrl':'',
        '_tb_token_':'e515db0153e16',   //*
'action':'user/batch_consign_action',   //*
'event_submit_do_batch_consign_save':1,   //*
'_fmw.f._0.co':762418401,        //*
'_fmw.f._0.coun':440113,      //*
// _fmw.f._0.c:(unable to decode value),
'_fmw.f._0.p':'',
'_fmw.f._0.ci':'',
'_fmw.f._0.cou':'',
// _fmw.f._0.adr:(unable to decode value)
// _fmw.f._0.dd:(unable to decode value)
// _fmw.f._0.ad:(unable to decode value)
'_fmw.f._0.z':514500,          //*
'_fmw.f._0.ddd':'',
'_fmw.f._0.ph':'',
'_fmw.f._0.b':'',
'_fmw.f._0.t':'',
'_fmw.f._0.m':17087987015,      //*
'_fmw.re._0.co':762418401,      //*
'_fmw.re._0.coun':441481,      //*
// _fmw.re._0.c:(unable to decode value)
'_fmw.re._0.p':'',
'_fmw.re._0.ci':'',
'_fmw.re._0.cou':'',
// _fmw.re._0.adr:(unable to decode value)
// _fmw.re._0.dd:(unable to decode value)
// _fmw.re._0.ad:(unable to decode value)
'_fmw.re._0.z':514500,       //*
'_fmw.re._0.ddd':'',
'_fmw.re._0.ph':'',
'_fmw.re._0.b':'',
'_fmw.re._0.t':'',
'_fmw.re._0.m':17087987015,   //*
'sameLogisCompanyId':102,     //*
'logisType':2,                //*
'_fmw.f._0.f':'',
'_fmw.f._0.fe':'',
'_fmw.f._0.fet':'',
//**************
// 'orderId':165763654977,   //*
// '_fmw.r.165763654977.count':371002,
// '_fmw.r.165763654977.p':'',
// '_fmw.r.165763654977.ci':'',
// '_fmw.r.165763654977.d':'',
// '_fmw.r.165763654977.coun':'',
// // _fmw.r.165763654977.adr:(unable to decode value)
// // _fmw.r.165763654977.dd:(unable to decode value)
// // _fmw.r.165763654977.ad:(unable to decode value)
// // _fmw.r.165763654977.c:(unable to decode value)
// '_fmw.r.165763654977.ddd':'',
// '_fmw.r.165763654977.ph':'',
// '_fmw.r.165763654977.b':'',
// '_fmw.r.165763654977.t':'',
// '_fmw.r.165763654977.mo':18715434316,
// '_fmw.r.165763654977.z':'000000',
// '_fmw.r.165763654977.is':'',
// '_fmw.m.165763654977.m':4303719242904,
// // _fmw.m.165763654977.goods:(unable to decode value)
        //**************
    }
    data = Object.assign(data,parms)
    console.log("data=======",data)
    return
 $.ajax({
            async : false,
            url :"https://wuliu.taobao.com/user/batch_consign.htm",
            type : "POST",
            // dataType : 'json',
            data : data,
            timeout : 5000,
            success : function(result) {
                    console.log("page_result:",result)


            },
            error:function (err) {
                console.log("错了:" + err);
            }
        });
}

function tbapi_get_all_page_order_from_tb(){
    let order_list = []
    let order_page = null

    order_page = tbapi_get_page_order_from_tb()
    let is_success = order_page.is_success
    if(is_success===false && order_page.message==="go_to_login_tb"){
        return {
                "is_success":false,
                "message":"go_to_login_tb"
            }

          }
     let order_page_result = order_page.result;

     order_list = order_list.concat(order_page_result)
     let page_numb =order_page.page_number
     let page_counts = order_page.page_counts

     while(page_numb < page_counts){

        console.log("page_numb",page_numb)
        console.log("page_counts",page_counts)
        order_page = tbapi_get_page_order_from_tb(page_numb+1,page_counts)
        if(order_page.is_success===false && order_page.message==="go_to_login_tb"){
            return {"is_success":false,"message":"go_to_login_tb" }

         }
        page_numb =order_page.page_number
        page_counts = order_page.page_counts
        order_list = order_list.concat(order_page.result)
     }


          return    {"result":order_list,"is_success":true }

}

function tbapi_get_page_order_from_tb(page_number,page_counts){

    if(page_number === undefined || page_number === null){
        page_number = 1
    }
    if(page_counts === undefined ||  page_counts === null){
        page_counts = 1
    }
    let request_url = "https://wuliu.taobao.com/user/order_list_new.htm"
    let parms = {
                 "source":"",
                 "callUrl":"",
                 // "_tb_token_":"ffe0157689337",
                 "orderStatusShow" :"send",
                 "receiverName" :"",
                 "receiverWangWangId":"" ,
                 "beginDate" :"",
                 "endDate" :"",
                 "taobaoTradeId" :"",
                 "shipping2":"-1",
                 "orderType":"-1",
                 "orderSource":"0",
                 "currentPage" :page_number,

             }
    let  return_data = null
    $.ajax({
            async : false,
            url :request_url,
            type : "POST",
            // dataType : 'json',
            data : parms,
            timeout : 5000,
            complete: function(jqXHR){

                if(jqXHR.responseText !==undefined && jqXHR.responseText.indexOf("扫码登录更安全")!==-1){
                    return_data =  {"is_success":false, "message":"go_to_login_tb", }
            }
    },
            success : function(result) {
                    if (result !== ""){
                        let shop_wangwang_id = null
                        let reg = /AES_CONFIG.username = "(.*?)"/
                         let name_arr =  result.match(reg)
                        if(name_arr.length !==0){
                             shop_wangwang_id = name_arr[0].substring(0,name_arr[0].length-1).replace('AES_CONFIG.username = "',"")
                        }
                        console.log("店铺旺旺id:",shop_wangwang_id)

                        let html = result.substring(result.indexOf("<html>"),result.indexOf("</html>")+7)
                         html = $.parseHTML(html)
                     if(page_number===1){
                          let dom = html
                          let page_dom = $(dom).find(".page-top")[0]
                          let  papge_a = $(page_dom).find("a")
                          papge_a.each(function () {
                          if(!isNaN($(this).text())){
                            page_counts = $(this).text()
                        }
                    })
                     }
                    result = get_order_goods_str_from_elems(html)
                    for(let r = 0 ; r<result.length;r++){
                        result[r]['wangwang_id'] = shop_wangwang_id
                    }


                    $(html).find(".J_Trigger").each(function () {
                        // console.log("11",$(this))

                    })

                     return_data =  {
                         "result":result,
                         "page_number":page_number,
                         "page_counts":page_counts,
                         "is_success":true
                     }
                    }



            },
            error:function (err) {
                console.log("错了:" + err);
                console.log("错了:" + JSON.stringify(err));
                if(JSON.stringify(err).indexOf("NetworkError: Failed to execute 'send'")){
                    return_data =  {"is_success":false, "message":"go_to_login_tb", }
                }else{
                    return_data =  {

                         "is_success":false,
                         "message":"",
                     }
                }

                return return_data
            }
        });

            console.log("return_data",return_data)

     return return_data
}
// 获取订单详细信息
function tbapi_get_order_address_details(orderId){
    console.log("开始获取地址信息。。。");
    // orderId = "45483656317"
    var urls =  "https://wuliu.taobao.com/user/ajax_real_address.do?orderId="+orderId+"&_input_charset=utf-8"
    var  return_result = {success:false}
    $.ajax({
            async : false,
            url :urls,
            // url :"https://wuliu.taobao.com/user/batch_consign.htm",
            type : "GET",
            // dataType : 'json',
            // data : data2,
            timeout : 5000,
            success : function(result){
                console.log("获取淘宝详细信息结果："+result)
                return_result  = result
            },
            error:function (err) {
                console.log("获取淘宝详细信息失败" + err);
            }

        });
    console.log("结束获取地址信息。。。");
    return return_result
}
function tbapi_get_tb_goods_id_by_trade_id(trade_href){

    // trade_id = "2125690599487847907"
    var urls =  "https:"+trade_href+"&snapShot=true"
    console.log("获取商品id,url",urls);
    var  return_result = {success:false}

    $.ajax({
            async : false,
            url :urls,
            // url :"https://wuliu.taobao.com/user/batch_consign.htm",
            type : "GET",
            // dataType : 'json',
            // data : data2,
            timeout : 5000,
            success : function(result){
                console.log("交易快照结果："+result)

                let tem_str1 = result.substring(result.indexOf(" var data = JSON.parse("),result.length)


                let tem_str2 = tem_str1.substring(0,tem_str1.indexOf("</script>"))

                let tem_str3 = tem_str2.replace("var data = JSON.parse(","").trim()

                let tem_str4 = tem_str3.substring(0,tem_str3.length-2)

                console.log("tem_str4：",tem_str4)
                let reg = /id=\d{12,13}&/;

                let match_result =   tem_str4.match(reg)


                if(match_result!==null && match_result.length !== 0){
                    return_result["success"] = true
                    return_result["goods_id"] = match_result[0].replace("id=","").replace("&","")
                }
            },
            error:function (err) {
                console.log("交易快照结果失败" + err);
            }

        });

    return return_result
}
function get_order_goods_str_from_elems(elems){
     if( $(elems).find("label:contains(尺码：)").length !==0){
         $(elems).find("label:contains(尺码：)").next().addClass("17_size");
     }
     if(  $(elems).find("label:contains(尺寸：)").length !==0){
         $(elems).find("label:contains(尺寸：)").next().addClass("17_size");
     }
     $(elems).find("label:contains(颜色)").next().addClass("17_color");
      var order_list = []
    $(elems).find(".info").not(".msg").each(function() {
        var tbody_elems = $(this).parents("tbody");

        var orderdetail_size = tbody_elems.find(".orderdetail").size();
        var m = "";
        var total = "";

        var order_goods_list=[]
        for (var i = 0; i <= orderdetail_size - 1; i++) {

            var order_goods_obj = {}
            m = "";

            m+= '"tb_trade_href":"'+tbody_elems.find("a:eq("+i+")").attr("href")+'",';
            order_goods_obj['tb_trade_href'] = tbody_elems.find("a:eq("+i+")").attr("href")

            let item_details = tbody_elems.find(".orderdetail:eq("+i+")")

            m+= '"img":"'+$(item_details).find("img:eq(0)").attr("src")+'",';

            order_goods_obj['img'] = $(item_details).find("img:eq(0)").attr("src")

            total = tbody_elems.find(".total:eq(" + i + ")").text().toString().trim();
            total = total.substring(total.indexOf("×") + 1).trim();
            order_goods_obj['total'] = total

            if (tbody_elems.find(".desc:eq(" + i + ")").length != 0) {
                m += '"code":"' + tbody_elems.find(".desc:eq(" + i + ")").attr("title")+'",';
                order_goods_obj['code'] = tbody_elems.find(".desc:eq(" + i + ")").attr("title")
            }


            if (tbody_elems.find(".17_size:eq(" + i + ")").length != 0) {
                m += '"size":"' + tbody_elems.find(".17_size:eq(" + i + ")").text().toString() + '",';
                order_goods_obj['size'] = tbody_elems.find(".17_size:eq(" + i + ")").text().toString()
            }
            if (tbody_elems.find(".17_color:eq(" + i + ")").length != 0) {
                m += '"color":"' + tbody_elems.find(".17_color:eq(" + i + ")").text().toString() + '",';
                order_goods_obj['color'] = tbody_elems.find(".17_color:eq(" + i + ")").text().toString()
            }
            m += '"total":"' + total + '"';
            console.log("页面内单条订单信息：",order_goods_obj)
            order_goods_list.push(order_goods_obj)


        }
        var order_goods_list_str = JSON.stringify(order_goods_list)

        var order_obj = new Object();
        var c = new Array();
        var f = tbody_elems
       order_obj['tb_order_number'] = f.find("span.order-number").text().replace("订单编号：",'').trim();
       order_obj['order_id'] = f.find("input.trigger").val().trim();

       console.log("order_id",order_obj['order_id'])
        f.find(".logis-info").children("span").not(".j_telephone,.j_mobilePhone").remove();

        var user_wangwang_span = f.find(".info").children("span")[0]
        var address_span = f.find(".info").children("span")[1]
        var address_str1 = $(address_span).text().toString().trim(" ");
        var user_wangwang_id = $(user_wangwang_span).text().toString().trim();

        // 从淘宝获取地址详细信息
       // var order_address_result = tbapi_get_order_address_details(order_obj['order_id'])
       //  if(order_address_result.success === true){
       //      address_str1 = order_address_result.data
       //  }
        // // 从淘宝获取地址详细信息

        console.log("---...--.-address_str1.-",address_str1);
        while(address_str1.indexOf(", ")!==-1){
            address_str1 = address_str1.replace(", ","，")
        }

        var g = address_str1.split("，");

        var b = g[g.length - 2].trim();//name
        var m = g[0].trim();
        var h = g[g.length - 1].trim();//phone

        order_obj['name'] = b;
        order_obj['address']  = m;
        order_obj['phone'] = h;
        order_obj['user_wangwang_id'] = user_wangwang_id;

        // d.postscript = f.find("span.postscript").text().trim(" ");

       var new_goods_str_list = []
       for (var x = 0; x < order_goods_list.length; x++) {
        var order_goods = new Object()

        let m_code =  typeof order_goods_list[x].code === "undefined" ? "" :order_goods_list[x].code.trim()

        let new_code = mcommon_replace_goods_code_str(m_code)   
        // let   new_code = m_code.replace(/#/g,"^^^").trim()
        //
        // if (new_code === default_tb_code2_youfei){
        //     continue
        // }
        // if (new_code === ""){
        //     new_code = default_tb_code
        // }
        // // ***********************************************************去除搜款网编码的尾巴（id）
        // // 搜款网商品id
        // let skw_goods_id= new_code.substring(new_code.lastIndexOf('-')+1,new_code.length)
        //   
        // if(!isNaN(skw_goods_id) &&  skw_goods_id >1000000){
        //     console.log("收款网id 是数字")
        //     //去掉数字id
        //     new_code = new_code.substring(0,new_code.lastIndexOf('-'))
        //
        // }else{
        //     console.log("收款网id 不是数字")
        // }
        //  // ***********************************************************去除搜款网编码的尾巴（id）
 console.log("new_code:",new_code)
        let new_color= typeof order_goods_list[x].color === "undefined" ? "" : order_goods_list[x].color;
        if(new_color.indexOf("+")!== -1){
            new_color = new_color.replace("+","＋")
        }
        order_goods['code'] = new_code
        order_goods['img']= typeof order_goods_list[x].img === "undefined" ? "" : order_goods_list[x].img;
        order_goods['size']= typeof order_goods_list[x].size === "undefined" ? "" : order_goods_list[x].size
        order_goods['color']= new_color
        order_goods['count']= typeof order_goods_list[x].total === "undefined" ? "" : order_goods_list[x].total;
        order_goods['tb_trade_href'] = order_goods_list[x]['tb_trade_href']
        //取代一些字符
        replace_goods_property(order_goods,new_code)
        new_goods_str_list.push(order_goods)
    // d.goodinfo[x] = ordergoodslist[x];

    }

        order_obj['order_goods_list']=new_goods_str_list
        order_list.push(order_obj)

    })
    console.log("一页订单数据：",order_list)

    return order_list
}

// 修改商品属性 比如颜色
function replace_goods_property(order_goods,code){
           //取代一些字符

         let rep_object =  replace_goods_data[code]
           console.log("商家编码",rep_object)
           if(rep_object !== undefined){
               let rep_color_obj = rep_object['color']
               if(rep_color_obj !== undefined){
                   for(let key in rep_color_obj){
                   order_goods['color'] = order_goods['color'].replace(key,rep_color_obj[key])
               }
               }

           }
}

function find_order_by_order_number(order_list,order_number){
    for(let  i=0; i<order_list.length;i++){
        if(order_number === order_list[i].tb_order_number){
            return order_list[i];
        }
    }
    return null;
}