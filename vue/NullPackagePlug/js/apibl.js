
function apibl_login(base_url){
    let user = mcommon_order_get_login_account_info_bl()
     url =  "/ajax/Login.ashx?username="+user['user_name']+"&userpass="+user["password"]
     let is_login = false
    $.ajax({
                async: false,
                url: base_url+url,
                type: "GET",
                // dataType : 'json',
                // data: submit_data_str,
                timeout: 5000,
                complete: function(jqXHR){


    },
                success: function (data, textStatus, request) {
                    console.log("data",data)
                    console.log("textStatus",textStatus)
                    console.log("request",request)
                    console.log("some_header",request.getResponseHeader('some_header'))
                    console.log("getAllResponseHeaders",request.getAllResponseHeaders())


        },
                 error: function (err) {
                    console.log("错了:" + err);
                    console.log("错了:" + JSON.stringify(err));
                    console.log("检查登录错误")


        }

    });
    return is_login
}
function apibl_login2(base_url,user_name,password){
   
     url =  "/ajax/Login.ashx?username="+user_name+"&userpass="+password
     let is_login = false
    $.ajax({
                async: false,
                url: base_url+url,
                type: "GET",
                // dataType : 'json',
                // data: submit_data_str,
                timeout: 5000,
                complete: function(jqXHR){


    },
                success: function (data, textStatus, request) {
                    console.log("data",data)
                    console.log("textStatus",textStatus)
                    console.log("request",request)
                    console.log("some_header",request.getResponseHeader('some_header'))
                    console.log("getAllResponseHeaders",request.getAllResponseHeaders())


        },
                 error: function (err) {
                    console.log("错了:" + err);
                    console.log("错了:" + JSON.stringify(err));
                    console.log("检查登录错误")


        }

    });
    return is_login
}
function apibl_get_user_name_and_pwd(site_name_bl){
    if(site_name_bl ==="光速代发"){
        let user_info = {
            user_name : "gs01",
            password :"a123a123a",
        }

        return user_info
    }else if(site_name_bl ==="海鸥代发"){
        let user_info = {
            user_name : "haiou01",
            password :"a123a123a",
        }
         return user_info
    }
    return null

}
function apibl_check_is_login(base_url){
    let is_login = false
    $.ajax({
                async: false,
                url: base_url+"/User/Charge.aspx",
                type: "GET",
                // dataType : 'json',
                // data: submit_data_str,
                timeout: 5000,
                complete: function(jqXHR){


    },
                success: function (result) {

                    if (result.indexOf("帐户余额")!==-1){
                        is_login = true
                    }

        },
                 error: function (err) {
                    console.log("错了:" + err);
                    console.log("错了:" + JSON.stringify(err));
                    console.log("检查登录错误")


        }

    });
    return is_login
}
function apibl_add_order_17tobl(submit_order_list,base_url,web_site_name){
      
     let ret = {"code":"ok","message":""}
     let submit_data_str = ""
     for(let i = 0;i<submit_order_list.length;i++){
        submit_data_str = submit_data_str +"&orderjson[]="+JSON.stringify(submit_order_list[i])
     }

     submit_data_str = submit_data_str.substring(1,submit_data_str.length)

     // submit_data_str = 'orderjson[]={"name":"李彩虹","address":"天津天津市蓟州区+别山镇+++天津市蓟州区州河湾西园85号楼一单元301室","phone":"17602679645","postscript":"","order_number":"订单编号：937907584313359087","goodinfo":[{"i":"女人街@1F@1002@6969@59","c":"[黑色]加长款","img":"//img.alicdn.com/bao/uploaded/i2/1695255946/TB22LY_eFXXXXXAXXXXXXXXXXXX_!!1695255946.jpg_sum.jpg","n":"1"}]}'
     submit_data_str = encodeURI(submit_data_str)

     $.ajax({
                async: false,
                url: base_url+"/User/quick_daifa.aspx",
                type: "POST",
                // dataType : 'json',
                data: submit_data_str,
                timeout: 5000,
                success: function (result) {

                if(result.indexOf("location.href='/Login.aspx'")!== -1){
                    console.log("未登录")
                    ret['code'] = "error"
                    ret['message'] = "未登录"

                }else{
                    console.log("quick_daifa", result)

                    let re2 = /alert\('.*?'\)/
                    let res_arr2 = result.match(re2)
                    console.log("res_arr2---->",res_arr2)
                    let exits_in_lb_order_list = []
                    if(res_arr2 !== null && res_arr2.length !== 0){
                        let alter_content = res_arr2[0].replace("alert('","").replace("')","")
                        let split_arr = alter_content.split(";")
                        for(let i = 0 ;i<split_arr.length;i++){
                            if(split_arr[i].indexOf("已存在跳过")!== -1){
                                exits_in_lb_order_list.push(split_arr[i].replace("已存在跳过",""))
                            }
                        }
                    }
                    ret['exits_in_lb_order_list'] = exits_in_lb_order_list
                    console.log("exits_order_list",exits_in_lb_order_list)
                    let html = result.substring(result.indexOf("<form"),result.indexOf("</form>")+7)

                    let submit_form = $.parseHTML(html)[0]

                     let  submit_data_obj = serialize_data_to_obj($(submit_form).serialize())

                    console.log("submit_data_obj",submit_data_obj)
                    let post_data = {}
                    post_data["__VIEWSTATEGENERATOR"] = submit_data_obj["__VIEWSTATEGENERATOR"]
                    post_data["__VIEWSTATE"] = submit_data_obj["__VIEWSTATE"]
                    post_data["__EVENTVALIDATION"] = submit_data_obj["__EVENTVALIDATION"]
                    post_data["ctl00$ContentPlaceHolder1$ddlGeShi"] = 2
                    post_data["ctl00$ContentPlaceHolder1$btnNew"] = "重新解析"
                    post_data["ctl00$ContentPlaceHolder1$HForderlist"] =  submit_data_obj["ctl00$ContentPlaceHolder1$HForderlist"]
                    let res = re_analysis(post_data,web_site_name)
                    if(res.code === "ok"){
                          let dom = res.data
                          let order_number_elems_list = $(dom).find("input[name='ordernumber']")
                          console.log("order_number_elems_list",order_number_elems_list)
                          for(let i = 0;i<order_number_elems_list.length;i++){
                             let order_number = order_number_elems_list[i].value
                             let express = "express_"+order_number
                             let order = find_order_by_order_number(submit_order_list,order_number)
                             if(order !==null && mcommon_get_logistics_type_choies_bl()[order.logistics_name] !== undefined){
                                 console.log("order----",order)
                                 let logistics_name = order.logistics_name
                                 $( $(dom).find("select[name="+express+"] ")).find("option")[0].setAttribute("value",mcommon_get_logistics_type_choies_bl()[logistics_name])

                             }

                          }

                          let data_obj = serialize_data_to_obj($(dom).serialize())
                            data_obj['ctl00$ContentPlaceHolder1$btnAdd'] = '提交导入系统'
                            let submit_order_list2 = submit_order_list
                            for(let i = 0;i<submit_order_list2.length;i++){
                                let order_number = submit_order_list2[i].order_number
                                //customehuohao_20200507224757193753
                                let customerhuohao = "customehuohao_"+order_number
                                let order_remark = "remark_"+order_number

                                 let huohao = ""
                                 let order_remark_content = ""

                                 for(let g = 0;g<submit_order_list2[i].goodinfo.length;g++){
                                      huohao = huohao +","+submit_order_list2[i].goodinfo[g].cou


                                 }
                                if( huohao.startsWith(",")){

                                         huohao = huohao.substring(1,huohao.length)
                                     }

                                 data_obj[customerhuohao] = huohao
                                 data_obj[order_remark] = submit_order_list2[i].order_remark
                                 console.log("huohaot",data_obj[customerhuohao])
                            }
                            console.log("data_obj",data_obj)
                            // 有符合条件的才进行提交
                           if(order_number_elems_list.length > 0 ){
                                let submit_result =  submit_order_tobl_ajax(data_obj,web_site_name)
                                ret = Object.assign(ret,submit_result)
                           }else{
                                ret['code'] = 'ok'
                                ret['message'] = "没有符合条件的或者数据格式错误"
                           }

                    }else{
                         ret['code'] = 'error'
                         ret['message'] = res.message

                    }
                }


        },
                 error: function (err) {
            console.log("错了:" + err);
            console.log("错了:" + JSON.stringify(err));


        }

    });
      return ret;
}
//下单空包到bl网站
function apibl_add_null_package_order_tobl(order_text,mark,logistics_type,base_url,page_parms){
     if(mcommon_get_base_url_17() === mcommon_get_base_url_remote_server_address_17()){
                          mark = "r"+mark
                      }
     var data = new FormData();
    // data.append("ctl00$ContentPlaceHolder1$txtAddressList","lis 15888886666 河南省 安阳市 殷都区 梅园庄街道安钢四二区27号楼\nlis 15888886666 河南省 安阳市 殷都区 梅园庄街道安钢四二区27号楼")
    // data.append("ctl00$ContentPlaceHolder1$btnPLTextAdd","提交订单")
    // data.append("ctl00$ContentPlaceHolder1$ddlExpress01","15")
    // data.append("ctl00$ContentPlaceHolder1$txtRemark01","8888")
    data.append("__VIEWSTATE",page_parms['__VIEWSTATE'])
    data.append("__VIEWSTATEGENERATOR",page_parms['__VIEWSTATEGENERATOR'])
    data.append("__EVENTVALIDATION",page_parms['__EVENTVALIDATION'])
    // data.append("ctl00$ContentPlaceHolder1$ddlExpress01","15")
    data.append("ctl00$ContentPlaceHolder1$ddlExpress01",logistics_type)
    data.append("ctl00$ContentPlaceHolder1$txtRemark01",mark)
    // data.append("ctl00$ContentPlaceHolder1$txtAddressList","3333，15888886666，广东省 广州市 白云区 XX路XX号")
    data.append("ctl00$ContentPlaceHolder1$txtAddressList",order_text)
    data.append("ctl00$ContentPlaceHolder1$btnPLTextAdd","提交订单")
    data.append("ctl00$ContentPlaceHolder1$ddlExpress02",logistics_type)
    data.append("ctl00$ContentPlaceHolder1$txtRemark02","")
    let null_order_status2 = {
            '未付款': 1,
            '已付款': 2,
            '快递打印': 3,
            '已发货': 4,
            '已退款': 5,
    }

    let success_counts = 0
    let ret = {
        "success_counts":0,
         "is_success":false,
         "message":"",

    }
    $.ajax({
            async:false,
            url:base_url+"/User/Gift_Add.aspx",
            type: 'POST',
            data: data,
            // dataType: 'JSON',
            cache: false,
            processData: false,
            contentType: false,
              success : function(result) {
               console.log("result-------------->下单到空包结果：",result)
               if(result.indexOf("网站会员登录")!==-1 || result.indexOf("请输入密码")!==-1){

                    ret['is_success'] = false
                    ret['message'] = "未登录"

               }else if(result.indexOf("提交订单成功")!== -1){
                   ret['success_counts'] =  result.match("提交订单成功：\\d+")[0].replace("提交订单成功：","")
                   ret['is_success'] = true
                   console.log("成功数量：",success_counts)
               }else{
                     ret['is_success'] = false
                     ret['message'] = "未知错误"
                  }



            },
            error:function (err) {
                console.log("错了:" + err);
                console.log("错了:" + JSON.stringify(err));

            }
        });




     return ret;



}

//从bl网 加载订单
function apibl_load_order_frombl(parms,base_url_bl){

    let request_url  = base_url_bl+"/User/OrderList.aspx"
    console.log("request0",request_url)
    let request_type = "POST"
    if(parms.__VIEWSTATE === ""){
        request_type = "GET"
        parms = {}
    }
    let order_sended_list = []
    let order_yinahuo_list = []
    let obj = {}
    let page_info = {}
    $.ajax({
            async : false,
            url :request_url,
            type : request_type,
            // dataType : 'json',
            data : parms,
            timeout : 5000,
            success : function(result) {
                 console.log("result777777777777777",result)

                let body = result.substring(result.indexOf("<body>"),result.indexOf("</body>")+7)
                body = $.parseHTML(body)

                 let paginator_elems = $(body).find("div[class='pagerright']")
                console.log("paginator_elems---",paginator_elems)
                 let cur_page = 1
                 let page_counts = 1
                if(paginator_elems.length > 0){
                    let paginator_text = $(paginator_elems[0]).text().trim()
                     console.log("paginator_text",paginator_text)
                    let cur_page_reg = "第\\d+页"
                    let page_counts_reg = "共\\d+页"
                    cur_page =  paginator_text.match(cur_page_reg)[0].replace("第",'').replace("页",'').trim()
                    page_counts = paginator_text.match(page_counts_reg)[0].replace("共",'').replace("页",'').trim()
                }

                  let __VIEWSTATE = $(body).find("input[id='__VIEWSTATE']").val()
                  let __EVENTVALIDATION = $(body).find("input[id='__EVENTVALIDATION']").val()
                  let __VIEWSTATEGENERATOR = $(body).find("input[id='__VIEWSTATEGENERATOR']").val()
                  parms.__VIEWSTATE = __VIEWSTATE
                  parms.__EVENTVALIDATION = __EVENTVALIDATION

                  $(body).find("table[class='orderlist']").each(function () {
                       let order_sended_item =  analyse_sended_order_frombl(this)
                       let order_yinahuo_order_number =  analyse_yinahuo_order_frombl(this)
                      if(order_sended_item !== null){
                          order_sended_list.push(order_sended_item)
                      }
                      if(order_yinahuo_order_number !== null){
                          order_yinahuo_list.push(order_yinahuo_order_number)
                      }

                    })
                  page_info = {
                    "cur_page":cur_page,
                    "page_counts":page_counts,
                  }
                   obj = {
                      "order_sended_list":order_sended_list,
                      "order_yinahuo_list":order_yinahuo_list,
                      "parms" : parms,
                      "page_info" : page_info,
                  }



            },
            error:function (err) {
                console.log("错了:" + err);
                console.log("错了:" + JSON.stringify(err));
                obj =  null
            }
        });

    return obj



}
function analyse_sended_order_frombl(item_elems){

                      let order_number = $($(item_elems).find("tr[class='ol_row1']")[0]).find('td').text().trim();

                      let index0 = order_number.indexOf("订单号：")
                      let index1 = order_number.indexOf("收货人：")
                      order_number = order_number.substring(index0,index1).replace("订单号：",'').trim()
                      // logistics  demo  "快递：中通快递  单号：75319119740456"
                      let logistics = $(item_elems).find("td:contains(快递：)").text()
                      let order_status = $($(item_elems).find("td")[4]).text().trim()
                      let is_all_yinahuo =  false
                      $($(item_elems).find("ul[class='sonpro']")[0]).find("li").each(function () {
                           console.log("goods_div",$(this).find("div[class='detailright']").find("div:contains(状态)"))
                           let goods_status = $(this).find("div[class='detailright']").find("div:contains(状态)").text()
                           if(goods_status.indexOf("已拿货") !== -1  || goods_status.indexOf("验货完成") !== -1){
                               is_all_yinahuo = true
                           }else{
                               is_all_yinahuo = false
                                // jquery each跳出当前循环
                                return true
                           }
                      })



                      console.log("order_status",order_status)
                      let logistics_name = logistics.split("单号")[0].replace("快递：","").trim()
                      if(logistics_name.indexOf("圆通") !== -1){
                          logistics_name = "圆通[菜鸟]"
                      }else if(logistics_name.indexOf("中通") !== -1){
                          logistics_name = "中通"
                      }else if(logistics_name.indexOf("韵达") !== -1){
                          logistics_name = "韵达"
                      } else if(logistics_name.indexOf("申通") !== -1){
                          logistics_name = "申通"
                      } else if(logistics_name.indexOf("百世") !== -1){
                          logistics_name = "百世"
                      }else{
                          logistics_name = ""
                      }
                      let logistics_number = logistics.split("单号")[1].replace("：","").trim()
                      if( is_all_yinahuo === true){

                          if(logistics_number !=="" && logistics_name !=="" ){
                             let item  = {
                                "logistics_number":logistics_number,
                                "logistics_name":logistics_name,
                                "order_number":"os"+order_number,
                                }
                             if(mcommon_get_base_url_17() === mcommon_get_base_url_remote_server_address_17()){
                                item["order_number"] = "r"+item["order_number"]
                              }
                              return    item
                          }


                      }
      return null
}
function analyse_yinahuo_order_frombl(item_elems){

                      let order_number = $($(item_elems).find("tr[class='ol_row1']")[0]).find('td').text().trim();

                      let index0 = order_number.indexOf("订单号：")
                      let index1 = order_number.indexOf("收货人：")
                      order_number = order_number.substring(index0,index1).replace("订单号：",'').trim()
                      // logistics  demo  "快递：中通快递  单号：75319119740456"
                      let logistics = $(item_elems).find("td:contains(快递：)").text()
                      let order_status = $($(item_elems).find("td")[4]).text().trim()
                      let is_all_yinahuo =  false
                      $($(item_elems).find("ul[class='sonpro']")[0]).find("li").each(function () {
                           console.log("goods_div",$(this).find("div[class='detailright']").find("div:contains(状态)"))
                           let goods_status = $(this).find("div[class='detailright']").find("div:contains(状态)").text()
                           if(goods_status.indexOf("已拿货") !== -1){
                               is_all_yinahuo = true
                           }else{
                               is_all_yinahuo = false
                                // jquery each跳出当前循环
                                return true
                           }
                      })
                      let logistics_name = logistics.split("单号")[0].replace("快递：","").trim()

                      if(logistics_name.indexOf("圆通") !== -1){
                          logistics_name = "圆通"
                      }else if(logistics_name.indexOf("中通") !== -1){
                          logistics_name = "中通"
                      }else if(logistics_name.indexOf("韵达") !== -1){
                          logistics_name = "韵达"
                      } else if(logistics_name.indexOf("申通") !== -1){
                          logistics_name = "申通"
                      } else if(logistics_name.indexOf("百世") !== -1){
                          logistics_name = "百世"
                      }else{
                          logistics_name = ""
                      }
                     let logistics_number = logistics.split("单号")[1].replace("：","").trim()
                                // 订单里面全部商品已拿货 并且没有物流单号
                      if( is_all_yinahuo === true && logistics_number ===""){


                            return    "os"+order_number
                      }
      return null
}
// 退款列表分析
function analyse_tuihuan_order_frombl(item_elems){
    // 退货退款
    let tuihuotuikuan_obj =null
    //退款
    let tuikuan_obj = null

                      let order_number = $($(item_elems).find('td')[0]).text().trim();


                      let logistics_number =$($(item_elems).find('td')[1]).find('a').text().trim()

                      let refund_type = $($(item_elems).find('td')[3]).text().trim();

                      let refund_status = $($(item_elems).find("td")[4]).text().trim()

                          if(refund_type==="退款退货" && logistics_number !==""  ){
                              tuihuotuikuan_obj = {}
                              tuihuotuikuan_obj['logistics_number'] = logistics_number
                              tuihuotuikuan_obj['refund_status'] = refund_status
                              tuihuotuikuan_obj['order_number'] = "os"+order_number
                              tuihuotuikuan_obj['refund_type'] = refund_type
                              tuihuotuikuan_obj['refund_status'] = refund_status//已签收退货中
                             if(mcommon_get_base_url_17() === mcommon_get_base_url_remote_server_address_17()){
                                tuihuotuikuan_obj["order_number"] = "r"+tuihuotuikuan_obj["order_number"]
                              }


                          }else if(refund_type==="退款"){
                               tuikuan_obj = {}
                               tuikuan_obj['order_number'] = "os"+order_number
                               tuikuan_obj['refund_type'] = refund_type
                               tuikuan_obj['refund_status'] = refund_status

                             if(mcommon_get_base_url_17() === mcommon_get_base_url_remote_server_address_17()){
                                tuikuan_obj["order_number"] = "r"+tuikuan_obj["order_number"]
                              }

                          }
        let return_obj = {
        "tuihuotuikuan_obj":tuihuotuikuan_obj,
        "tuikuan_obj":tuikuan_obj,
    }
      return return_obj
}
//从bl网 加载空包订单
function apibl_load_null_order_frombl(parms,web_site_name){
 console.log("request_url----00")
    let request_url  = mcommon_get_null_package_base_url_bl(web_site_name)+"/User/Gift_List.aspx"
    console.log("request_url----0",request_url)
    let request_type = "POST"
    if(parms.__VIEWSTATE === ""){
        request_type = "GET"
        parms = {}
    }
    let order_list = []
    let obj = {}
    let page_info = {}
    $.ajax({
            async : false,
            url :request_url,
            type : request_type,
            // dataType : 'json',
            data : parms,
            timeout : 5000,
            success : function(result) {
                // console.log("result777777777777777",result)
                let body = result.substring(result.indexOf("<body>"),result.indexOf("</body>")+7)
                body = $.parseHTML(body)

                 let paginator_elems = $(body).find("div[class='paginator']")
                  let cur_page = 1
                 let page_counts = 1
                if(paginator_elems.length > 0){
                    let paginator_text = $(paginator_elems[1]).text().trim()
                     console.log("paginator_text",paginator_text)
                    let reg = "共\\d+页"
                    let paginator = $(body).find("div[class='paginator']")[2]
                    cur_page =  $(paginator).find("span[class='cpb']").text().trim()
                    page_counts = paginator_text.match(reg)[0].replace("共",'').replace("页",'').trim()
                }

                  let __VIEWSTATE = $(body).find("input[id='__VIEWSTATE']").val()
                  let __EVENTVALIDATION = $(body).find("input[id='__EVENTVALIDATION']").val()
                  let __VIEWSTATEGENERATOR = $(body).find("input[id='__VIEWSTATEGENERATOR']").val()
                  parms.__VIEWSTATE = __VIEWSTATE
                  parms.__EVENTVALIDATION = __EVENTVALIDATION
                  $(body).find("tr[class='trlist']").each(function () {
                      // console.log("hi-->",$($(this).find("td")[0]).find("a").text().trim())
                      // console.log("kk-->",$(this).find("td:last").text().trim())
                      let logistic_number = $($(this).find("td")[0]).find("a").text().trim();
                      let td_clone = $($(this).find("td")[0]).clone();
                      td_clone.find(':nth-child(n)').remove()
                      let logistic_name =td_clone.text().trim()
                       if(logistic_name.indexOf("圆通")!==-1 && logistic_name.indexOf("洗衣粉")!==-1) {
                           logistic_name = "圆通洗衣粉"
                       }else if(logistic_name.indexOf("圆通")!==-1 && logistic_name.indexOf("实包")!==-1){
                            logistic_name = "圆通实包"
                       }else if(logistic_name.indexOf("圆通")!==-1 && logistic_name.indexOf("纸盒")!==-1){
                            logistic_name = "圆通纸板"
                       }else if(logistic_name.indexOf("圆通")!==-1 && logistic_name.indexOf("纸板")!==-1){
                            logistic_name = "圆通纸板"
                       }else if(logistic_name.indexOf("圆通")!==-1 && logistic_name.indexOf("纸巾")!==-1){
                            logistic_name = "圆通纸巾"
                       }else if(logistic_name.indexOf("韵达")!==-1 && logistic_name.indexOf("信封")!==-1){
                            logistic_name = "韵达信封"
                       }else if(logistic_name.indexOf("韵达")!==-1 && logistic_name.indexOf("实包")!==-1){
                            logistic_name = "韵达实包"
                       }else if(logistic_name.indexOf("韵达")!==-1 && logistic_name.indexOf("纸盒")!==-1){
                            logistic_name = "韵达纸盒"
                       }else if(logistic_name.indexOf("韵达")!==-1 && logistic_name.indexOf("纸巾")!==-1){
                            logistic_name = "韵达纸巾"
                       }else if(logistic_name.indexOf("韵达")!==-1 && logistic_name.indexOf("洗衣粉")!==-1){
                            logistic_name = "韵达洗衣粉"
                       }else if(logistic_name.indexOf("中通")!==-1 && logistic_name.indexOf("空包")!==-1){
                            logistic_name = "中通空包"
                       }
                      let mark = $(this).find("td:last").text().trim()

                      if(mcommon_get_base_url_17() === mcommon_get_base_url_remote_server_address_17()){
                            if(!mark.startsWith("r")){
                                // jquery each跳出当前循环
                                return true
                            }
                        }else{
                            if(mark.startsWith("r")){
                              // jquery each跳出当前循环
                                 return true
                            }
                      }

                      let item  = {
                          "logistics_number":logistic_number,
                          "logistics_name":logistic_name,
                          "id":mark,
                      }


                      order_list.push(item)

            })
                  page_info = {
                    "cur_page":cur_page,
                    "page_counts":page_counts,
                  }
                   obj = {
                      "order_list":order_list,
                      "parms" : parms,
                      "page_info" : page_info,
                  }



            },
            error:function (err) {
                console.log("错了:" + err);
                console.log("错了:" + JSON.stringify(err));
                console.log("加载空包数据出错");
                obj =  null
            }
        });
    console.log("加载空包订单结果：",obj)
    return obj



}

// 初始化空包订单页面信息
function apibl_init_null_order_page_parms(web_site_name){

    let parms = {
                 "__VIEWSTATE":"",
                "__EVENTTARGET":"",
                "__VIEWSTATEGENERATOR":"AFA9FE57",
                "__EVENTVALIDATION":"",
                "__EVENTARGUMENT":"",

       }

    let result = apibl_load_null_order_frombl(parms,web_site_name)

    return  result
}

function apibl_init_add_null_order_page_parms(url){

      let parms = {
                 "__VIEWSTATE":"",
                "__EVENTTARGET":"",
                "__VIEWSTATEGENERATOR":"AFA9FE57",
                "__EVENTVALIDATION":"",
                "__EVENTARGUMENT":"",

       }
       let ret = {"is_success":true,"message":"","parms":parms}

      $.ajax({
            async : false,
            url :url+"/User/Gift_Add.aspx",
            type : "GET",
            // dataType : 'json',
            // data : parms,
            timeout : 5000,
            success : function(result) {
                if(result.indexOf("网站会员登录")!==-1 || result.indexOf("请输入密码")!==-1){

                    ret['is_success'] = false
                    ret['message'] = "未登录"

               }else{
                    // console.log("result777777777777777",result)
                    let body = result.substring(result.indexOf("<body>"),result.indexOf("</body>")+7)
                    body = $.parseHTML(body)

                      let __VIEWSTATE = $(body).find("input[id='__VIEWSTATE']").val()
                      let __EVENTVALIDATION = $(body).find("input[id='__EVENTVALIDATION']").val()
                      let __VIEWSTATEGENERATOR = $(body).find("input[id='__VIEWSTATEGENERATOR']").val()
                      let __EVENTTARGET = $(body).find("input[id='__EVENTTARGET']").val()
                      let __EVENTARGUMENT = $(body).find("input[id='__EVENTARGUMENT']").val()
                      parms.__VIEWSTATE = __VIEWSTATE
                      parms.__EVENTVALIDATION = __EVENTVALIDATION
                      parms.__EVENTTARGET = __EVENTTARGET
                      parms.__VIEWSTATEGENERATOR = __VIEWSTATEGENERATOR
                      parms.__EVENTARGUMENT = __EVENTARGUMENT
                      ret['is_success'] = true
                      ret['parms'] =parms
                }

                
            },
            error:function (err) {
                console.log("错了:" + err);
                console.log("错了:" + JSON.stringify(err));
                
            }
        });
    return  ret
}

function apibl_init_order_page_parms(base_url_bl){

    let parms = {
                 "__VIEWSTATE":"",
                "__EVENTTARGET":"",
                "__VIEWSTATEGENERATOR":"",
                "__EVENTVALIDATION":"",
                "__EVENTARGUMENT":"",

       }

    let result = apibl_load_order_frombl(parms,base_url_bl)
    return  result
}
// 初始化退货退款页面参数信息
function apibl_init_tuihuan_page_parms(base_url_bl){

    let parms = {

                "__VIEWSTATEGENERATOR":"",
                "__EVENTVALIDATION":"",
                "__VIEWSTATE":"",


       }

    let result = apibl_load_tuihuan_order_frombl(parms,base_url_bl)
    return  result
}
//从bl网 退货退款信息 refund_type 售后类型（退款退货，退款）  refund_status 状态
function apibl_load_tuihuan_order_frombl(parms,base_url_bl,refund_type,refund_status){

    let request_url  = base_url_bl+"/User/TuiHuanList.aspx"
    console.log("request0",request_url)
    let request_type = "POST"

     // parms['ctl00$ContentPlaceHolder1$btnSearch'] = "查  询"
    if(parms.__VIEWSTATE === ""){
        request_type = "GET"
        parms = {}
    }

    if(refund_type !== null){
        let refund_type_obj = {
            '换货':3,
            '退款退货':2,
            '退款':1,
            '全部':"",
        }
        parms['ctl00$ContentPlaceHolder1$rblType'] = refund_type_obj[refund_type]

    }
     if(refund_status !==null){
         let refund_status_obj = {
            '全部':"",
            '未处理':0,
            '处理中':1,
            '已完成':2,
        }
         parms['ctl00$ContentPlaceHolder1$rblStatus'] = refund_status_obj[refund_status]
     }

    let obj = {}
    let page_info = {}
    $.ajax({
            async : false,
            url :request_url,
            type : request_type,
            // dataType : 'json',
            data : parms,
            timeout : 5000,
            success : function(result) {


                let body = result.substring(result.indexOf("<body>"),result.indexOf("</body>")+7)
                body = $.parseHTML(body)

                 let paginator_elems = $(body).find("div[class='paginator']")
                console.log("paginator_elems---",paginator_elems)
                 let cur_page = 1
                 let page_counts = 1
                if(paginator_elems.length > 0){
                    let paginator_text = $(paginator_elems[0]).text().trim()
                     console.log("paginator_text",paginator_text)
                    let cur_page_reg = "第\\d+页"
                    let page_counts_reg = "共\\d+页"
                    cur_page =  paginator_text.match(cur_page_reg)[0].replace("第",'').replace("页",'').trim()
                    page_counts = paginator_text.match(page_counts_reg)[0].replace("共",'').replace("页",'').trim()
                }

                  let __VIEWSTATE = $(body).find("input[id='__VIEWSTATE']").val()
                  let __EVENTVALIDATION = $(body).find("input[id='__EVENTVALIDATION']").val()
                  let __VIEWSTATEGENERATOR = $(body).find("input[id='__VIEWSTATEGENERATOR']").val()
                  parms.__VIEWSTATE = __VIEWSTATE
                  parms.__EVENTVALIDATION = __EVENTVALIDATION
                  parms.__VIEWSTATEGENERATOR = __VIEWSTATEGENERATOR
                    let order_tuihuotuikuan_list= []
                    let order_tuikuan_list= []
                  $(body).find("tr[class='trlist']").each(function () {
                       let order_tuihuan_item=  analyse_tuihuan_order_frombl(this)

                      if(order_tuihuan_item.tuihuotuikuan_obj !== null){
                          order_tuihuotuikuan_list.push(order_tuihuan_item.tuihuotuikuan_obj)
                      }
                      if(order_tuihuan_item.tuikuan_obj !== null){
                          order_tuikuan_list.push(order_tuihuan_item.tuikuan_obj)
                      }



                    })
                  page_info = {
                    "cur_page":cur_page,
                    "page_counts":page_counts,
                  }
                   obj = {
                      "order_tuihuotuikuan_list":order_tuihuotuikuan_list,
                      "order_tuikuan_list":order_tuikuan_list,

                      "parms" : parms,
                      "page_info" : page_info,
                  }



            },
            error:function (err) {
                console.log("错了:" + err);
                console.log("错了:" + JSON.stringify(err));
                obj =  null
            }
        });

    return obj



}

function find_order_by_order_number(order_list,order_number){
    for(let i = 0 ; i<order_list.length;i++){
        if(order_list[i].order_number === order_number){
            return order_list[i]
        }
    }
    return null
}
function serialize_data_to_obj(serialize_data){
       serialize_data = decodeURIComponent(serialize_data)
        let    serialize_data_array = serialize_data.split("&")
        // let  submit_data_obj = {'ctl00$ContentPlaceHolder1$btnNew':'重新解析'}
        let  data_obj = {}
        for(let i = 0;i < serialize_data_array.length;i++){
             let data_arr = serialize_data_array[i].split("=");
             let tem_datA ="";
             if(data_arr.length >2){
                      tem_datA =serialize_data_array[i].substring(serialize_data_array[i].indexOf("=")+1,serialize_data_array[i].length)
             }else{
                  tem_datA = data_arr[1]
             }
             if(data_obj[data_arr[0]] === undefined){
                  data_obj[data_arr[0]] = tem_datA
             }else{
                 data_obj[data_arr[0]] += "," +tem_datA
             }

         }
        return data_obj
}
function re_analysis(post_data,web_site_name){
    console.log("post_form_data",post_data)
    let ret = {"code":"ok","message":""}
    $.ajax({
                async: false,
                url: mcommon_get_base_url_bl(web_site_name)+"/User/quick_daifa.aspx",
                type: "POST",
                data: post_data,
                timeout: 5000,
                success: function (result) {
                if(result.indexOf("location.href='/Login.aspx'")!== -1){
                    console.log("未登录")
                    ret['code'] = "error"
                    ret['message'] = "未登录"
                }else{
                     let html = result.substring(result.indexOf("<form"),result.indexOf("</form>")+7)
                     let dom = $.parseHTML(html)
                     ret['code'] = "ok"
                     ret['message'] = ""
                     ret['data'] = dom

                }
        },
             error: function (err) {
             console.log("错了:" + err);
             console.log("错了:" + JSON.stringify(err));
             ret['code'] = "error"
             ret['message'] = JSON.stringify(err)

        }

    });
    return ret
}

function submit_order_tobl_ajax(post_data,web_site_name) {
    console.log("post_form_data",post_data)
    let ret = {"code":"ok","message":""}
    $.ajax({
                async: false,
                url: mcommon_get_base_url_bl(web_site_name)+"/User/quick_daifa.aspx",
                type: "POST",
                data: post_data,
                timeout: 5000,
                success: function (result) {

                    if(result.indexOf("location.href='/Login.aspx'")!== -1){
                        console.log("未登录")
                        ret['code'] = "error"
                        ret['message'] = "未登录"
                    }else{

                         let res_arr = result.match("成功\\d+，失败\\d+")
                         if(res_arr.length>0){
                              console.log("match:",res_arr[0])
                             ret["success_counts"] = res_arr[0]
                         }


                    }
        },
             error: function (err) {
             console.log("错了:" + err);
             console.log("错了:" + JSON.stringify(err));
             ret['code'] = "error"
             ret['message'] = JSON.stringify(err)

        }

    });
    return ret
}

// 初始化参数信息
function apibl_shoudong_add_order_step1(base_url_bl){
    let url = "/User/ShopCart.aspx"
    let parms = {
                 "__VIEWSTATE":"",

                "__VIEWSTATEGENERATOR":"",
                "__EVENTVALIDATION":"",


       }
     let ret = {"code":"ok","message":"","parms":parms}

    $.ajax({
                async: false,
                url: mcommon_get_base_url_bl()+url,
                type: "GET",

                timeout: 5000,
                success: function (result) {

                    if(result.indexOf("location.href='/Login.aspx'")!== -1){
                        console.log("未登录")
                        ret['code'] = "error"
                        ret['message'] = "未登录"
                    }else{




                      let body = result.substring(result.indexOf("<body>"),result.indexOf("</body>")+7)
                      body = $.parseHTML(body)
                      let __VIEWSTATE = $(body).find("input[id='__VIEWSTATE']").val()
                      let __EVENTVALIDATION = $(body).find("input[id='__EVENTVALIDATION']").val()
                      let __VIEWSTATEGENERATOR = $(body).find("input[id='__VIEWSTATEGENERATOR']").val()
                      parms.__VIEWSTATE = __VIEWSTATE
                      parms.__EVENTVALIDATION = __EVENTVALIDATION
                      parms.__VIEWSTATEGENERATOR = __VIEWSTATEGENERATOR
                         let order_goods_table_elems = $(body).find("table[class='newordertable']")[0]
                         let tbody_elems = $(order_goods_table_elems).find("tbody")
                      console.log("tbody_elems---->",tbody_elems)
                        // 所有购物车商品删除链接
                      let a_elems =  $(tbody_elems[0]).find("a:contains(删除)")
                      for(let e = 0;e<a_elems.length;e++){
                           let u = $(a_elems[e]).attr("href")
                          // /User/ShopCart.aspx?delid=3131

                           $.ajax({
                                async: false,
                                url: mcommon_get_base_url_bl()+url+u,
                                type: "GET",

                                timeout: 5000,
                                success: function (result) {

                                },
                                 error: function (err) {
                                 console.log("错了:" + err);
                                 console.log("错了:" + JSON.stringify(err));
                                 console.log("删除购物车商品失败")
                                 ret['code'] = "error"
                                 ret['message'] = JSON.stringify(err)

                                }

                            });
                        }


                    }
        },
             error: function (err) {
             console.log("错了:" + err);
             console.log("错了:" + JSON.stringify(err));
             console.log("手动添加订单第一步访问失败")
             ret['code'] = "error"
             ret['message'] = JSON.stringify(err)

        }

    });
    return ret
}
// 添加商品到购物车
function apibl_shoudong_add_order_step2(parms,order_goods_list){

     let ret = {"code":"ok","message":""}
     for(let i = 0 ;i<order_goods_list.length;i++){
         add_one_order_goods_to_shop_cart(parms,order_goods_list[i])
     }





    return ret
}
//添加一个商品到购物车
function add_one_order_goods_to_shop_cart(parms,order_goods){
     let url = "/User/ShopCart.aspx"
    let ret = {"code":"ok","message":""}
         let datam = {
        'locationshichang':'女人街',
        "locationlou":'2F',
        'ctl00$ContentPlaceHolder1$txtImageName':'',
        'location3':'2Fa14a',
        'itemNo':'8163',
        'price':'33.00',
        'color':'红色',
        'chima':'xl',
        'counts':'1',
        'weight':'',
        'sonremark':'wod',
        'caijiurl':'',
        'ctl00$ContentPlaceHolder1$btnAddCart':'第一步先加入购物车',
       }
       // 金富丽@2F@2F303@9356@43
       let market_d = order_goods.i.split("@")
       datam['locationshichang'] = market_d[0]
       datam['locationlou'] = market_d[1]
       datam['location3'] = market_d[2]
       datam['itemNo'] = market_d[3]
       datam['price'] = market_d[4]
       datam['color'] = order_goods.c
       datam['chima'] = ""
       datam['counts'] = order_goods.n
       datam['sonremark'] = order_goods.customer_message
       datam['ctl00$ContentPlaceHolder1$btnAddCart'] = "第一步先加入购物车"
       let new_parms = Object.assign(datam,parms)
       $.ajax({
                async: false,
                url: mcommon_get_base_url_bl()+url,
                type: "POST",
                data:new_parms,
                timeout: 5000,
                success: function (result) {
  console.log("添加一个商品结果result：",result)
                    if(result.indexOf("location.href='/Login.aspx'")!== -1){
                        console.log("未登录")
                        ret['code'] = "error"
                        ret['message'] = "未登录"
                    }else{




                    }
        },
             error: function (err) {
             console.log("错了:" + err);
             console.log("错了:" + JSON.stringify(err));
             console.log("手动添加单个商品失败")
             ret['code'] = "error"
             ret['message'] = JSON.stringify(err)

        }

    });
}
function apibl_shoudong_add_order_step3(){
    let url = "/User/NewOrder.aspx"

    let parms = {
                 "__VIEWSTATE":"",

                "__VIEWSTATEGENERATOR":"",
                "__EVENTVALIDATION":"",


       }
       let ret = {"code":"ok","message":"","parms":parms}


       $.ajax({
                async: false,
                url: mcommon_get_base_url_bl()+url,
                type: "GET",

                timeout: 5000,
                success: function (result) {

                    if(result.indexOf("location.href='/Login.aspx'")!== -1){
                        console.log("未登录")
                        ret['code'] = "error"
                        ret['message'] = "未登录"
                    }else{


                      let body = result.substring(result.indexOf("<body>"),result.indexOf("</body>")+7)
                      body = $.parseHTML(body)
                      let __VIEWSTATE = $(body).find("input[id='__VIEWSTATE']").val()
                      let __EVENTVALIDATION = $(body).find("input[id='__EVENTVALIDATION']").val()
                      let __VIEWSTATEGENERATOR = $(body).find("input[id='__VIEWSTATEGENERATOR']").val()
                      parms.__VIEWSTATE = __VIEWSTATE
                      parms.__EVENTVALIDATION = __EVENTVALIDATION
                      parms.__VIEWSTATEGENERATOR = __VIEWSTATEGENERATOR
                      console.log("step3-->parms:",parms)

                    }
        },
             error: function (err) {
             console.log("错了:" + err);
             console.log("错了:" + JSON.stringify(err));
             console.log("手动添加订单第三步访问失败")
             ret['code'] = "error"
             ret['message'] = JSON.stringify(err)

        }

    });
         return ret
}
function apibl_shoudong_add_order_step4(params,name,phone,address,order_number,logistics_name){
    let url = "/User/NewOrder.aspx"
     let address_full = name+" " + phone+" " +address
    let analysis_address_url = "/ajax/AddressAnalysis.ashx?address="+address_full
    let province = ""
    let adddress_2 =address
  let ret = {"code":"error","message":""}
    $.ajax({
                async: false,
                url: mcommon_get_base_url_bl()+analysis_address_url,
                type: "GET",

                timeout: 5000,
                success: function (result) {
console.log("apibl_shoudong_add_order_step4,",result)
                    if(result.indexOf("location.href='/Login.aspx'")!== -1){
                        console.log("未登录")
                        ret['code'] = "error"
                        ret['message'] = "未登录"
                    }else{
                        result = JSON.parse(result)
                        province = result.province
                        adddress_2 = result.city + result.area + result.address


                    }
        },
             error: function (err) {
             console.log("错了:" + err);
             console.log("错了:" + JSON.stringify(err));
             console.log("获取地址分析错误")
             ret['code'] = "error"
             ret['message'] = JSON.stringify(err)

        }

    });
    let datam = {
        "ctl00$ContentPlaceHolder1$txtTBAddress":"李月月  15256682286  安徽省+蚌埠市+龙子湖区+东海大道（旧）址蚌埠新车管所斜对面壹米滴答物流",
        "ctl00$ContentPlaceHolder1$txtTaoBaoOrder":"",
        "ctl00$ContentPlaceHolder1$txtReceiveName":"李月月",
        "ctl00$ContentPlaceHolder1$txtMobile":"15256682286",
        "ddlProvince":"",
        "ctl00$ContentPlaceHolder1$txtAddress":"蚌埠市龙子湖区东海大道（旧）址蚌埠新车管所斜对面壹米滴答物流",
        "ctl00$ContentPlaceHolder1$txtSendName":"",
        "ctl00$ContentPlaceHolder1$txtRemark":"",
        "ctl00$ContentPlaceHolder1$rblXianFa":'0',
        "ctl00$ContentPlaceHolder1$ddlExpress":"",
        "ctl00$ContentPlaceHolder1$ddlLeiXing":"10",
        "express":"",
        "ctl00$ContentPlaceHolder1$btnOrderOk":"提交订单",
    }
    if(province!=="" && province !== null){
         datam['ddlProvince'] = province
    }else {
           ret['code'] = "error"
           ret['message'] = "省份代码错误"
               return ret
    }
    datam['ctl00$ContentPlaceHolder1$txtTBAddress'] = address_full
    datam['ctl00$ContentPlaceHolder1$txtTaoBaoOrder'] = order_number
    datam['ctl00$ContentPlaceHolder1$txtReceiveName'] = name
    datam['ctl00$ContentPlaceHolder1$txtMobile'] = phone
    datam['ctl00$ContentPlaceHolder1$txtAddress'] = adddress_2
    datam['ctl00$ContentPlaceHolder1$ddlExpress'] = mcommon_get_logistics_type_choies_bl()[logistics_name]
    let new_params = Object.assign(datam,params)

    $.ajax({
                async: false,
                url: mcommon_get_base_url_bl()+url,
                type: "POST",
                data:new_params,
                timeout: 5000,
                success: function (result) {

                    if(result.indexOf("location.href='/Login.aspx'")!== -1){
                        console.log("未登录")
                        ret['code'] = "error"
                        ret['message'] = "未登录"
                    }else{

                        if(result.indexOf("提交成功") !==-1){
                             ret['code'] = "ok"
                        }else if(result.indexOf("订单已存在")){
                             ret['code'] = "error"
                             ret['message'] = "订单已存在"
                        }


                    }
        },
             error: function (err) {
             console.log("错了:" + err);
             console.log("错了:" + JSON.stringify(err));
             console.log("手动添加订单第四步访问失败")
             ret['code'] = "error"
             ret['message'] = JSON.stringify(err)

        }

    });
    return ret
}
