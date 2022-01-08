var curLocation = window.location.href.toString();


 window.onload=function(){

      mcommon_get_plugs_version()

    }

if(curLocation.indexOf("main.m.taobao.com/mytaobao/index.html")!==-1){
    window.onload=function(){
       m_set_timeout()
    }
}

function get_my_order_div(){

    return $(".main-layout").children("div:eq(1)")
}
function m_set_timeout(){
    setTimeout(function () {
    if(get_my_order_div().length !==0){
        get_my_order_div().after(" <button style=' background: #3bb4f2; border-color: #3bb4f2;color:white ;padding: 0.2em;border-radius: 4px;' class='tb_logout'  >退出登录</button> ")
        get_my_order_div().after(" <button style=' background: #3bb4f2; border-color: #3bb4f2;color:white ;padding: 0.2em;border-radius: 4px;' class='synchronization_all_order_to17'  >同步所有订单到17代发网</button> ")
         let request_url = "https://wuliu.taobao.com/user/order_list_new.htm"
        $(".tb_logout").click(function () {
             chrome.runtime.sendMessage({order_number_list: "",method:'remove_cookies'},function(response) {
             location.reload()
	    });

        })
         $(".synchronization_all_order_to17").click(function () {


         $($(".synchronization_all_order_to17")[0]).attr("disabled",true) ;
          setTimeout(function(){

               let order_page = get_all_page_order_from_tb()

               let order_list =  order_page.result
               let tb_order_number_list = []

                for(let i = 0;i<order_list.length;i++){
                    let  tb_order_number = order_list[i].tb_order_number
                    tb_order_number_list.push(tb_order_number)
                }
                //*********
               chrome.runtime.sendMessage({order_number_list: JSON.stringify(tb_order_number_list),method:'get_orders_from17'},function(response) {
                   console.log("response",response)
               let response_order_list = JSON.parse(response)
               let new_order_list = []
                   console.log("order_list:",order_list)
                   console.log("response_order_list:",response_order_list)
                   for(let i = 0;i<order_list.length;i++){
                       let is_exits = false
                       for(let g = 0 ;g<response_order_list.length;g++){
                           if (order_list[i].tb_order_number === response_order_list[g].tb_order_number){
                               is_exits = true
                                break
                           }
                       }
                       if(!is_exits){
                           new_order_list.push(order_list[i])
                       }


                   }
                 if(!confirm("共 "+new_order_list.length+" 单，确定跳转下单?？")) {
                    return ;
                }
                let data_ = JSON.stringify(new_order_list)

                data_ =  data_.replace(/#/g,"^^^")

               window.open(mcommon_get_base_vue_url_17()+"/#/pc/home/porder/?plug_order_data="+data_);

	    });

               $($(".synchronization_all_order_to17")[0]).attr("disabled",false) ;
          },500)

         })
    }else{
        m_set_timeout()
    }

}, 1000);
}
function get_page_order_from_tb(page_number,page_counts){

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
            success : function(result) {
                    console.log("result777777777777777",result)
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


                    $(html).find(".J_Trigger").each(function () {
                        // console.log("11",$(this))

                    })
                    console.log("page_number",page_number)
                    console.log("page_counts99999999",page_counts)
                     return_data =  {
                         "result":result,
                         "page_number":page_number,
                         "page_counts":page_counts
                     }


            },
            error:function (err) {
                console.log("错了:" + err);
                console.log("错了:" + JSON.stringify(err));
                return null
            }
        });


     return return_data
}
function get_all_page_order_from_tb(){

         let order_list = []
         let order_page = null

          order_page = get_page_order_from_tb()
          console.log("oooooooooooooooooooo",order_page)
          let order_page_result = order_page.result;

         order_list = order_list.concat(order_page_result)
         let page_numb =order_page.page_number
         let page_counts = order_page.page_counts
         console.log("page_numb1",page_numb)
         console.log("page_counts1",page_counts)
         while(page_numb < page_counts){
                console.log("page_numb",page_numb)
                console.log("page_counts",page_counts)
                  order_page = get_page_order_from_tb(page_numb+1,page_counts)
                 console.log("order_page",order_page_result)
                 page_numb =order_page.page_number
                 page_counts = order_page.page_counts
                 order_list = order_list.concat(order_page.result)
         }


          return  order_list

}

//已卖列表
if (curLocation.indexOf("trade.taobao.com/trade/itemlist/list_sold_items.htm") !== -1) {
        setTimeout(function () {
                  let tb_order_number_list = []
        if( $("span:contains(三个月前订单)").length !==0){
        let three_months_div =  $("span:contains(三个月前订单)")[0].parentNode
            $(three_months_div).after(" <button  style=' background: #3bb4f2; border-color: #3bb4f2;color:white ;padding: 0.2em;border-radius: 4px;' class='synchronization_all_order_to17'  >同步所有订单到17代发网</button> ")
         let request_url = "https://wuliu.taobao.com/user/order_list_new.htm"

         $(".synchronization_all_order_to17").click(function () {


         $($(".synchronization_all_order_to17")[0]).attr("disabled",true) ;
         $($(".synchronization_all_order_to17")[0]).css({'background':'grey', 'border-color': 'grey'});
          setTimeout(function(){
              let order_list = get_all_page_order_from_tb()

               let tb_order_number_list = []

                for(let i = 0;i<order_list.length;i++){
                    let  tb_order_number = order_list[i].tb_order_number
                    tb_order_number_list.push(tb_order_number)
                }
               chrome.runtime.sendMessage({order_number_list: JSON.stringify(tb_order_number_list),method:'get_orders_from17'},function(response) {
                   console.log("response",response)
               let response_order_list = JSON.parse(response)
               let new_order_list = []
                   console.log("order_list:",order_list)
                   console.log("response_order_list:",response_order_list)
                   for(let i = 0;i<order_list.length;i++){
                       let is_exits = false
                       for(let g = 0 ;g<response_order_list.length;g++){
                           if (order_list[i].tb_order_number === response_order_list[g].tb_order_number){
                               is_exits = true
                                break
                           }
                       }
                       if(!is_exits){
                           new_order_list.push(order_list[i])
                       }
                   }
                 if(!confirm("共 "+new_order_list.length+" 单，确定跳转下单1？")) {
                    return ;
                }
                 let data_ = JSON.stringify(new_order_list)

                data_ =  data_.replace(/#/g,"^^^")
               window.open(mcommon_get_base_vue_url_17()+"/#/pc/home/porder/?plug_order_data="+data_);

	    });

               $($(".synchronization_all_order_to17")[0]).attr("disabled",false) ;
                $($(".synchronization_all_order_to17")[0]).css({'background':'#3bb4f2', 'border-color': '#3bb4f2'});
          },500)

         })
     }
        update_list_sold_page()
        },5000)

       window.onload=function() {
            //此处为是否加载完成
    }
}else if(curLocation.indexOf("pc/home/porder")!==-1){
    chrome.storage.local.get({"my_tb_wait_send_order_cache":{}},function (local_data) {

         let lacal_obj = local_data["my_tb_wait_send_order_cache"]
         console.log("拿到谷歌插件缓存订单数据:",lacal_obj)
         window.localStorage.setItem("my_tb_wait_send_order_cache",lacal_obj)
         let my_tb_wait_send_order_cache =    window.localStorage.getItem("my_tb_wait_send_order_cache")
        console.log("window缓存的订单数据:",my_tb_wait_send_order_cache)
         chrome.storage.local.remove("my_tb_wait_send_order_cache")

            })
}
function update_list_sold_page() {
    let tb_order_number_list = []
        console.log("sold_container",$("#sold_container").find("div:eq(0)").children("div:eq(6)"))
        console.log("sold_container2", $("#sold_container").find("div:eq(0)"))

        $("#sold_container").find("div:eq(0)").children("div:eq(7)").children("div").each(function () {

        var tb_order_number = $(this).find("tr:eq(0)").find("td:eq(0)").find("span:eq(2)").text();
        console.log("tb_order_number:",tb_order_number)
        if(tb_order_number !== undefined && tb_order_number !==""){
            var status = $(this).find("tr:eq(1)").find("td:eq(5)").find("span").text();
             var e = $(this).find("table:last");

             tb_order_number_list.push(tb_order_number)
        }


    })
    console.log("update_list_sold_page获取到的订单list,",tb_order_number_list)
    chrome.runtime.sendMessage({order_number_list: JSON.stringify(tb_order_number_list),method: 'get_orders'}, function (response) {
        let order_list = replace_data(JSON.parse(response).results)
        add_order_info_to_sold_list_page(order_list)
    })
    chrome.runtime.sendMessage({order_number_list: JSON.stringify(tb_order_number_list),method:'get_null_orders2'},function(response) {
         let order_list = replace_null_order_data(JSON.parse(response))
		add_order_info_to_sold_list_page(order_list)

	    });
}
 
function update_17_home_page(){
console.log("update_17_home_page")
if(curLocation.indexOf("/pc/home")!==-1) {

             console.log("update_17_home_page2s")


            $(".tb_order").unbind("click");
            $(".delivery_tb_order").unbind("click");

            $(".tb_order").css({'display': 'inline-block'});
            $(".delivery_tb_order").css({'display': 'inline-block'});
            $(".tb_order_old").css({'display': 'none'});
            $(".delivery_tb_order_old").css({'display': 'none'});
            //
            $(".tb_order").click(function () {

                let text = $(".tb_order").text();
                $(".tb_order").text("正在同步淘宝订单...")
                $(".tb_order").attr("disabled", true)
                $(".tb_order").css("color", "grey")

                setTimeout(function () {
                    chrome.runtime.sendMessage({method: 'get_order_from_tb'}, function (response) {
                        $(".tb_order").text(text)
                        $(".tb_order").attr("disabled", false)
                        $(".tb_order").css("color", "black")

                        let order_page = JSON.parse(response)
                        console.log("response8888888888888", order_page)
                        let is_success = order_page.is_success
                        let message = order_page.message
                        if (is_success === false && message === "go_to_login_tb") {
                            window.open("https://login.taobao.com/");
                            return
                        }
                        let tb_order_list = order_page.result
                        let tb_order_number_list = []

                        for (let i = 0; i < tb_order_list.length; i++) {
                            let tb_order_number = tb_order_list[i].tb_order_number
                            tb_order_number_list.push(tb_order_number)
                        }


                        let p1 = new Promise(function (resolve, reject) {
                            let result = ""
                            chrome.runtime.sendMessage({
                                order_number_list: JSON.stringify(tb_order_number_list),
                                method: 'get_orders_from17'
                            }, function (response) {
                                let response_order_list = JSON.parse(response)

                                resolve({"orders": response_order_list})

                            });
                        })
                        let p2 = new Promise(function (resolve, reject) {

                            chrome.runtime.sendMessage({
                                order_number_list: JSON.stringify(tb_order_number_list),
                                method: 'get_null_orders2'
                            }, function (response) {
                                let response_order_list = JSON.parse(response)

                                resolve({"null_orders": response_order_list})

                            });
                        });
                        Promise.all([p1, p2]).then(function (results) {

                            let null_orders_list_17 = {}
                            let orders_list_17 = {}
                            if (results[0].orders !== null) {
                                orders_list_17 = Object(results[0].orders)
                                null_orders_list_17 = Object(results[1].null_orders)
                            } else {
                                orders_list_17 = Object(results[1].orders)
                                null_orders_list_17 = Object(results[0].null_orders)
                            }

                            let new_order_list = []

                            //不存在的订单才同步

                            for (let i = 0; i < tb_order_list.length; i++) {
                                let order = find_order(tb_order_list[i].tb_order_number, orders_list_17)
                                let null_order = find_order(tb_order_list[i].tb_order_number, null_orders_list_17)
                                if (order === null && null_order === null) {
                                    new_order_list.push(tb_order_list[i])

                                }
                            }
                            chrome.runtime.sendMessage({new_order_list: JSON.stringify(new_order_list),method:'get_more_address_by_order_numbers_tb_orders'},function(response) {
                                //***********************testdata************************
                            // new_order_list = get_temp_data();
                             //***********************testdata************************

                                 let new_order_list = JSON.parse(response)
                                chrome.runtime.sendMessage({new_order_list: JSON.stringify(new_order_list),method:'get_tb_goods_id_by_trade_id'},function (response) {

                                    let new_order_list = JSON.parse(response)
                                      console.log("获取goods后：",new_order_list)
                                    let data_ = JSON.stringify(new_order_list)
                                    window.localStorage.setItem("my_tb_wait_send_order_cache",data_)

                                    console.log("chajian等待发货的淘宝订单缓存：",window.localStorage.getItem("my_tb_wait_send_order_cache"))
                                    console.log("共 " , new_order_list)
                                     if (!confirm("共 " + new_order_list.length + " 单，确定跳转下单2？")) {
                                        return;
                                    }

                                    data_ =  data_.replace(/#/g,"^^^")
                                    window.open(mcommon_get_base_vue_url_17() + "/#/pc/home/porder/?plug_order_data=" + data_);
                                })




                             });

                            
                        }).catch(function (r) {

                            console.log(r);
                        });
                    })
                }, 500)

            })
            $(".delivery_tb_order").click(function () {
                let text = $(".delivery_tb_order").text();
                $(".delivery_tb_order").text("正在后台发货中...")
                $(".delivery_tb_order").attr("disabled", true)
                $(".delivery_tb_order").css("color", "grey")
                // test_fun()
                // return
                delivery_tb_order_timeout()

            })





}

}

function get_gbk(str){
    let retdata = ""
    $.ajax({
                async: false,
                url: "http://192.168.2.110:8009/back/covGBK/",
                type: "POST",
                data: {"data":str},
                timeout: 5000,
                success: function (result) {
                    console.log("result:" + result.data);
                 retdata =  result.data

        },
             error: function (err) {
             console.log("错了:" + err);
             console.log("错了:" + JSON.stringify(err));
             ret['code'] = "error"
             ret['message'] = JSON.stringify(err)

        }

    });
    return retdata
}
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    var method = request.method;
    var to = request.to;

    if(to ==="list_sold_page" && method ==="update_page_data"){
        if (curLocation.indexOf("trade.taobao.com/trade/itemlist/list_sold_items.htm") !== -1) {
             update_list_sold_page()
     }
    }else if(to ==="17_home_page" && method ==="update_17_home_page_data") {

        if (curLocation.indexOf(mcommon_get_base_vue_url_17() + "/#/pc/home") !== -1) {

            update_17_home_page()
        }

    }else if(to === "17_unpay_order_page" && method ==="update_add_order_to_chuammei_compeleted"){
        let result = request.result;
        console.log("下单到传美完成！",result)
         $("#move_order_to_chuanmei").attr("disabled",false)
        if(result.code==="fail" ){
            if( result.message === "传美cookies无效"){
                 window.open("https://dayin.chuanmeidayin.com/common/main.jsp")
                 return
            }
            let exception_order_list = result.exception_order_list
                let message = exception_order_list!==undefined?exception_order_list.length+"个失败！":""
                Toast(result.message+" "+message+" 请刷新")
        }else{
                let exception_order_list = result.exception_order_list
                let message = exception_order_list!==undefined?exception_order_list.length+"个失败！":""
                Toast("操作成功！"+result.message+" "+message+" 请刷新")
        }
    } 
})
function init_wuliu_order_info(){
     let tb_order_number_list = []
         $(".info").not(".msg").each(function() {
            var tbody_elems = $(this).parents("tbody");
            var orderdetail_size = tbody_elems.find(".orderdetail").size();
            var orders_number=tbody_elems.find(".order-number").text().replace('订单编号：','').trim();
            tb_order_number_list.push(orders_number)
         })

          chrome.runtime.sendMessage({order_number_list: JSON.stringify(tb_order_number_list),method:'get_orders'},function(response) {
                let order_list = replace_data(JSON.parse(response).results)
                add_order_info_to_wuliu_page(order_list)
	        });
           chrome.runtime.sendMessage({order_number_list: JSON.stringify(tb_order_number_list),method:'get_null_orders2'},function(response) {
                let order_list = replace_null_order_data(JSON.parse(response))
                add_order_info_to_wuliu_page(order_list)
	        });


}

if (curLocation.indexOf("wuliu.taobao.com/user/order_list_new.htm") != -1) {

    window.onload=function(){   //页面加载完成执行
     init_wuliu_order_info()
     init_daifa_elems()
     //    alert('test2')
        // test2()
        // my_functon()
    }
       //********************
}
if(curLocation.indexOf("wuliu.taobao.com/user/batch_consign.htm") !== -1){
    window.onload=function(){
        let my_logistics_elems = $("input[type='radio'][name='logisType']").parents('li').find("input:last");
        my_logistics_elems.get(0).checked=true
       $("input[class='J_ShippingNumber logis:mailNo']").each(function () {
            if($(this).get(0).value==='可以在物流公司取货后填写'){
                $(this).get(0).value=''
            }
            }
        )

        let tb_order_number_list = []
        $(".order-number").each(function() {
            tb_order_number_list.push( $(this).text().replace('订单编号：','').trim())
        })
        chrome.runtime.sendMessage({order_number_list: JSON.stringify(tb_order_number_list),method:'get_orders'},function(response) {
             let order_list = replace_data(JSON.parse(response).results)
             add_order_info_to_batch_consign_page(order_list)
	    });
         chrome.runtime.sendMessage({order_number_list: JSON.stringify(tb_order_number_list),method:'get_null_orders2'},function(response) {
             let order_list = replace_null_order_data(JSON.parse(response))
             add_order_info_to_batch_consign_page(order_list)
	    });
    }
}
// function get_order_goods_str_from_elems(elems){
//      if( $(elems).find("label:contains(尺码：)").length !==0){
//          $(elems).find("label:contains(尺码：)").next().addClass("17_size");
//      }
//      if(  $(elems).find("label:contains(尺寸：)").length !==0){
//          $(elems).find("label:contains(尺寸：)").next().addClass("17_size");
//      }
//      $(elems).find("label:contains(颜色)").next().addClass("17_color");
//       var order_list = []
//     $(elems).find(".info").not(".msg").each(function() {
//         var tbody_elems = $(this).parents("tbody");
//
//         var orderdetail_size = tbody_elems.find(".orderdetail").size();
//         var m = "";
//         var total = "";
//
//         var order_goods_list=[]
//         for (var i = 0; i <= orderdetail_size - 1; i++) {
//
//             var order_goods_obj = {}
//             m = "";
//
//             m+= '"img":"'+tbody_elems.find("img:eq("+i+")").attr("src")+'",';
//             order_goods_obj['img'] = tbody_elems.find("img:eq("+i+")").attr("src")
//
//             total = tbody_elems.find(".total:eq(" + i + ")").text().toString().trim();
//             total = total.substring(total.indexOf("×") + 1).trim();
//             order_goods_obj['total'] = total
//
//             if (tbody_elems.find(".desc:eq(" + i + ")").length != 0) {
//                 m += '"code":"' + tbody_elems.find(".desc:eq(" + i + ")").attr("title")+'",';
//                 order_goods_obj['code'] = tbody_elems.find(".desc:eq(" + i + ")").attr("title")
//             }
//
//
//             if (tbody_elems.find(".17_size:eq(" + i + ")").length != 0) {
//                 m += '"size":"' + tbody_elems.find(".17_size:eq(" + i + ")").text().toString() + '",';
//                 order_goods_obj['size'] = tbody_elems.find(".17_size:eq(" + i + ")").text().toString()
//             }
//             if (tbody_elems.find(".17_color:eq(" + i + ")").length != 0) {
//                 m += '"color":"' + tbody_elems.find(".17_color:eq(" + i + ")").text().toString() + '",';
//                 order_goods_obj['color'] = tbody_elems.find(".17_color:eq(" + i + ")").text().toString()
//             }
//             m += '"total":"' + total + '"';
//             order_goods_list.push(order_goods_obj)
//
//
//         }
//         var order_goods_list_str = JSON.stringify(order_goods_list)
//
//         var order_obj = new Object();
//         var c = new Array();
//         var f = tbody_elems
//
//         f.find(".info").children("span").not(".j_telephone,.j_mobilePhone").remove();
//         var l = f.find(".info").text().toString().trim("	");
//         //console.log(l);
//         var g = l.split("，");
//         var b = g[g.length - 2].trim();//name
//         var m = g[0].trim();
//         var h = g[g.length - 1].trim();//phone
//
//         order_obj['name'] = b;
//         order_obj['address']  = m;
//         order_obj['phone'] = h;
//
//         // d.postscript = f.find("span.postscript").text().trim(" ");
//        order_obj['tb_order_number'] = f.find("span.order-number").text().replace("订单编号：",'').trim();
//        var new_goods_str_list = []
//        for (var x = 0; x < order_goods_list.length; x++) {
//         var order_goods = new Object()
//
//
//         order_goods['code'] =  typeof order_goods_list[x].code === "undefined" ? "" :order_goods_list[x].code.replace("#","^^^")
//         order_goods['img']= typeof order_goods_list[x].img === "undefined" ? "" : order_goods_list[x].img;
//         order_goods['size']= typeof order_goods_list[x].size === "undefined" ? "" : order_goods_list[x].size
//         order_goods['color']= typeof order_goods_list[x].color === "undefined" ? "" : order_goods_list[x].color;
//         order_goods['count']= typeof order_goods_list[x].total === "undefined" ? "" : order_goods_list[x].total;
//         new_goods_str_list.push(order_goods)
//     // d.goodinfo[x] = ordergoodslist[x];
//
//     }
//
//         order_obj['order_goods_list']=new_goods_str_list
//         order_list.push(order_obj)
//
//     })
//     return order_list
// }
function my_functon(){
alert("my_functon666666")


}
function init_daifa_elems() {
    $("input[value='批量打印发货单']").after(" <input type='button' class='synchronization_all_order_to17'  value='同步所有订单到17代发网'>");
    $("input[value='批量打印发货单']").after(" <input type='button' class='daifa_17'  value='17批量代发'>");
     if( $("label:contains(尺码：)").length !==0){
         $("label:contains(尺码：)").next().addClass("17_size");
     }

     if( $("label:contains(尺寸：)").length !==0){
         $("label:contains(尺寸：)").next().addClass("17_size");

     }
     
    $("label:contains(颜色)").next().addClass("17_color");
    $("label:contains(买家留言)").next().addClass("17_postscript");
     $(".info.msg").each(function() {
        $(this).remove();
    });
     $(".info").not(".msg").each(function() {
        var tbody_elems = $(this).parents("tbody");
        var orderdetail_size = tbody_elems.find(".orderdetail").size();
        var m = "";
        var total = "";
        tbody_elems.find("a.btn").after(" <form class='form_17' style='display:none' action='" + mcommon_get_base_vue_url_17() + "/#/pc/home/porder' method='get' target='_blank'></form>");
        var order_goods_list=[]
        for (var i = 0; i <= orderdetail_size - 1; i++) {
            var order_goods_obj = {}
            m = "";

            m+= '"img":"'+tbody_elems.find("img:eq("+i+")").attr("src")+'",';
            order_goods_obj['img'] = tbody_elems.find("img:eq("+i+")").attr("src")

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
            order_goods_list.push(order_goods_obj)


        }
        var order_goods_list_str = JSON.stringify(order_goods_list)
          tbody_elems.find("form.form_17").append("<input  name='goods[]' type='hidden' value='{" + m + "}' />");
          // tbody_elems.find("form.etong").append("<input  name='goods[]' type='hidden' value='{" + m + "}' />");
          tbody_elems.append("<input name='ordergood[]' value='" + order_goods_list_str + "' type='hidden'  /> ");
          tbody_elems.find("a.btn").after(" <a class='btn' style='background-position:0 -25px;color:white'>17代发</a>");
        var ordersid=tbody_elems.find(".order-number").text().replace('订单编号：','').trim();


     });

     $("a.btn:contains('17代发')").click(function() {
                     // var xmlHttp = new XMLHttpRequest();
                     //    xmlHttp.open("GET", mcommon_get_base_vue_url_17()+"/#/pc/home/porder", true);
                     //    xmlHttp.send();

        var e = $(this).parents("tbody");

        var info = e.find(".info");
        info.children("span").not(".j_telephone,.j_mobilePhone").remove();
        var k = info.text().toString().trim("	")
        var f = k.split("，");
        var g = f[f.length - 1].trim();//phone
        var b = f[f.length - 2].trim();//name
        var l = f[0].trim();
        var order_obj = {};
        var goods_str_list = []
        var c = e.find(".orderdetail").size();
        //商品
        for (var d = 0; d <= c - 1; d++) {
            var goods_str = {}
             if (e.find(".desc:eq(" + d + ")").length != 0) {
                goods_str['code'] = e.find(".desc:eq(" + d + ")").attr("title").replace("#", "^^^") ;
                //     m += '"i":"' + e.find(".desc:eq(" + d + ")").attr("title").replace("#", "*") + '",';
            }

             if (e.find(".s50:eq(" + d + ")").length !== 0) {
                 goods_str['img'] = e.find(".s50:eq(" + d + ")").find("img").attr("src")
                // m += '"img":"' + e.find(".s50:eq(" + d + ")").find("img").attr("src") + '",'
            }


            if (e.find(".17_size:eq(" + d + ")").length !== 0) {
               goods_str['size']=  e.find(".17_size:eq(" + d + ")").text().toString() ;
            }
            if (e.find(".17_color:eq(" + d + ")").length !== 0) {
               goods_str['color']= e.find(".17_color:eq(" + d + ")").text().toString().trim() ;
            }
            var count = e.find(".total:eq(" + d + ")").text().toString().trim();
            count = count.substring(count.indexOf("×") + 1).trim();
            goods_str['count'] = count
            goods_str_list.push(goods_str)


        }
        if (e.find(".order-number").text().replace('订单编号：','')) {
                 order_obj['tb_order_number']  = e.find(".order-number").text().replace('订单编号：','').trim();
             }
        // 地址
        var info = e.find(".info");
        info.children("span").not(".j_telephone,.j_mobilePhone").remove();
        var k = info.text().toString().trim("	");
        var f = k.split("，");
        var phone = f[f.length - 1].trim();//phone
        var name = f[f.length - 2].trim();//name
        var address = f[0].trim();
        order_obj['phone'] = phone;
        order_obj['name'] = name;
        order_obj['address']  = address;
        order_obj['order_goods_list']=goods_str_list
        var order_list = []
        order_list.push(order_obj)
        window.open(mcommon_get_base_vue_url_17()+"/#/pc/home/porder/?plug_order_data="+JSON.stringify(order_list));
    // `   goods_obj['phone'] = phone;
    //     goods_obj['name'] = name;
    //     goods_obj['address']  = address;
    //      window.open(mcommon_get_base_vue_url_17()+"/#/pc/home/porder/?plug_data="+JSON.stringify(goods_obj));

chrome.runtime.sendMessage({greeting: m},function(response) {
		// alert('收到来自后台的回复：' + response);
	}
);


 });

          //批量代发
        $(".daifa_17").click(function () {
        var checkblinput = 0;

        var order_list = []

        $(".J_Trigger:checked").each(function () {

            try {
                var order_obj = new Object();
                var c = new Array();
                var f = $(this).parents("tbody");

                f.find(".info").children("span").not(".j_telephone,.j_mobilePhone").remove();
                var l = f.find(".info").text().toString().trim("	");
                //console.log(l);
                var g = l.split("，");
                var b = g[g.length - 2].trim();//name
                var m = g[0].trim();
                var h = g[g.length - 1].trim();//phone

                order_obj['name'] = b;
                order_obj['address']  = m;
                order_obj['phone'] = h;

                // d.postscript = f.find("span.postscript").text().trim(" ");
               order_obj['tb_order_number'] = f.find("span.order-number").text().replace("订单编号：",'').trim();

                // d.goodinfo = new Array();
                var new_goods_str_list =[]
                var ordergoodstr = f.find("input[name='ordergood[]']").val();

                 var ordergoodslist = new Array()
                     ordergoodslist = $.evalJSON(ordergoodstr);

                for (var x = 0; x < ordergoodslist.length; x++) {
                        var order_goods = new Object()


                        order_goods['code'] =  typeof ordergoodslist[x].code === "undefined" ? "" :ordergoodslist[x].code.replace("#","^^^")
                        order_goods['img']= typeof ordergoodslist[x].img === "undefined" ? "" : ordergoodslist[x].img;
                        order_goods['size']= typeof ordergoodslist[x].size === "undefined" ? "" : ordergoodslist[x].size
                        order_goods['color']= typeof ordergoodslist[x].color === "undefined" ? "" : ordergoodslist[x].color;
                        order_goods['count']= typeof ordergoodslist[x].total === "undefined" ? "" : ordergoodslist[x].total;
                        new_goods_str_list.push(order_goods)
                    // d.goodinfo[x] = ordergoodslist[x];

                }

                order_obj['order_goods_list']=new_goods_str_list

                order_list.push(order_obj)
                checkblinput++;
            }
            catch (e) {
                alert(e.message + e.name);
            }
        });

        if (checkblinput === 0) {
            alert("请勾选要代发的订单");
            return false;
        }

         window.open(mcommon_get_base_vue_url_17()+"/#/pc/home/porder/?plug_order_data="+JSON.stringify(order_list));
        //***********************testdata************************
        //  order_list = get_temp_data()
        //  window.open(mcommon_get_base_vue_url_17()+"/#/pc/home/porder/?plug_order_data="+JSON.stringify(order_list));
          //***********************testdata************************

    });
        $(".synchronization_all_order_to17").click(function () {


              let eye_elems = $(".logis-info")



            show_tb_address(eye_elems,0)


            return


            let request_url = "https://wuliu.taobao.com/user/order_list_new.htm"
            let parms = "" +
                 "source:\n" +
                 "callUrl:\n" +
                 "_tb_token_:ffe0157689337\n" +
                 "orderStatusShow:send\n" +
                 "receiverName:\n" +
                 "receiverWangWangId:\n" +
                 "beginDate:\n" +
                 "endDate:\n" +
                 "taobaoTradeId:\n" +
                 "shipping2:-1\n" +
                 "orderType:-1\n" +
                 "orderSource:0\n" +
                 "currentPage:2\n" +
                 "currentPage:2"
             parms = {
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
                 "currentPage" :"2",

             }

		   $.ajax({
            async : false,
            url :request_url,
              xhrFields: {
       withCredentials: false,
    },
            type : "POST",
            // dataType : 'json',
            data : parms,
            timeout : 5000,
            success : function(result) {
                 // sendResponse(JSON.stringify(result));
                    console.log(result)
            },
            error:function (err) {
                console.log("错了:" + err);
            }
        });

         })


}
//显示地址
function show_tb_address(img_elems,index){

    if(index === img_elems.length){
        go_to_get_page_data()
        return
    }
    let check_box = $(img_elems[index]).parent().parent().find("input[type='checkbox']")
    let next_time = 0
    if(check_box[0].checked === true){
        next_time = 800
        $(img_elems[index]).find('img')[0].click()
    }

    setTimeout(function () {
        show_tb_address(img_elems,index+1)
    },next_time)
}
//获取页面订单数据
function go_to_get_page_data(){
    let html_el = $("html")
    let shop_wangwang_id = $($(".user-nick")[0]).text()
    let tb_order_list = get_order_goods_str_from_elems(html_el)
    console.log("获取当前页面订单结果：",tb_order_list)
            for(let r = 0 ; r<tb_order_list.length;r++){
                tb_order_list[r]['wangwang_id'] = shop_wangwang_id
            }



    let tb_order_number_list = []



    for (let i = 0; i < tb_order_list.length; i++) {
        let tb_order_number = tb_order_list[i].tb_order_number
        tb_order_number_list.push(tb_order_number)
    }


    let p1 = new Promise(function (resolve, reject) {
        let result = ""
        chrome.runtime.sendMessage({
            order_number_list: JSON.stringify(tb_order_number_list),
            method: 'get_orders_from17'
        }, function (response) {
            let response_order_list = JSON.parse(response)

            resolve({"orders": response_order_list})

        });
    })
    let p2 = new Promise(function (resolve, reject) {

        chrome.runtime.sendMessage({
            order_number_list: JSON.stringify(tb_order_number_list),
            method: 'get_null_orders2'
        }, function (response) {
            let response_order_list = JSON.parse(response)

            resolve({"null_orders": response_order_list})

        });
    });
    Promise.all([p1, p2]).then(function (results) {

        let null_orders_list_17 = {}
        let orders_list_17 = {}
        if (results[0].orders !== null) {
            orders_list_17 = Object(results[0].orders)
            null_orders_list_17 = Object(results[1].null_orders)
        } else {
            orders_list_17 = Object(results[1].orders)
            null_orders_list_17 = Object(results[0].null_orders)
        }

        let new_order_list = []

        //不存在的订单才同步

        for (let i = 0; i < tb_order_list.length; i++) {
            let order = find_order(tb_order_list[i].tb_order_number, orders_list_17)
            let null_order = find_order(tb_order_list[i].tb_order_number, null_orders_list_17)
            if (order === null && null_order === null) {
                new_order_list.push(tb_order_list[i])

            }
        }

        chrome.runtime.sendMessage({new_order_list: JSON.stringify(new_order_list),method:'get_tb_goods_id_by_trade_id'},function (response) {

                let new_order_list = JSON.parse(response)
                  console.log("获取goods后：",new_order_list)
                let data_ = JSON.stringify(new_order_list)
                  chrome.storage.local.set({"my_tb_wait_send_order_cache":data_},function () {
                        console.log("保存成功，",data_)
                        Toast("缓存成功")
                    })
                window.localStorage.setItem("my_tb_wait_send_order_cache",data_)
                console.log("chajian等待发货的淘宝订单缓存：",window.localStorage.getItem("my_tb_wait_send_order_cache"))
                console.log("共 " , new_order_list)
                 if (!confirm("共 " + new_order_list.length + " 单，确定跳转下单2？")) {
                    return;
                }

                data_ =  data_.replace(/#/g,"^^^")
                window.open(mcommon_get_base_vue_url_17() + "/#/pc/home/porder/?plug_order_data=" + data_);
            })




    }).catch(function (r) {

        console.log(r);
            });
}
function test2(){
        let cookies_str = "thw=cn; x=e%3D1%26p%3D*%26s%3D0%26c%3D0%26f%3D0%26g%3D0%26t%3D0%26__ll%3D-1%26_ato%3D0; UM_distinctid=16e05f0e1cbb-00cfe32c7d77f6-414f0120-100200-16e05f0e1e198; ali_ab=14.145.20.89.1573560710123.3; enc=qYWvpLGuick%2Bhk6UxW09VN4q7nbQ%2B7E%2BbHUE%2Fr%2F%2FS45ELZMl1w1hADasz6Ef8fKzdcOY79b0rD65aln%2Fouq6Fw%3D%3D; _tb_token_=3b188ee531e13; _m_h5_tk=294cdb948d414fd13cf2cbe27d1f11ee_1578508753416; _m_h5_tk_enc=6cac515c2a928e80a5a0b0b5eadfdce1; hng=CN%7Czh-CN%7CCNY%7C156; cna=wM0AFqmil2ACAQ6RFdC6+aZ7; v=0; unb=467630318; uc3=nk2=Dl9OSr7zuFtrsHxW&vt3=F8dBxdkPcshw7druT0I%3D&id2=VypX6SrwnB2D&lg2=UtASsssmOIJ0bQ%3D%3D; csg=3f2f5c22; lgc=moonlight539; t=9aadd5cb9e648a6ef819fab9412b4f2c; cookie17=VypX6SrwnB2D; dnk=moonlight539; skt=80cb40d22cbfb37a; cookie2=7aa0e53d696146d2ca0bc63a970984e6; existShop=MTU3ODU4MzUzOQ%3D%3D; uc4=id4=0%40VX09oVN3jNtOEoQ3xYH23218yXs%3D&nk4=0%40DDrLLMRjgg0NBiw%2B4kn75YvcyBmAlkk%3D; tracknick=moonlight539; mt=ci=8_1; _cc_=WqG3DMC9EA%3D%3D; tg=0; _l_g_=Ug%3D%3D; sg=982; _nk_=moonlight539; cookie1=UojUVLRQa87pXVPPGSFD6QOf%2F%2Fm0wWOHAeNIbLq7vI4%3D; lui=VypX6SrwnB2D; luo=Uw%3D%3D; uc1=cookie14=UoTbldfTL%2F2r2w%3D%3D&lng=zh_CN&cookie16=URm48syIJ1yk0MX2J7mAAEhTuw%3D%3D&existShop=true&cookie21=UIHiLt3xTwwM1tbQXg%3D%3D&tag=8&cookie15=V32FPkk%2Fw0dUvg%3D%3D&pas=0; l=dBQb0belqGel3MdyBOCCnurza779SIRYYuPzaNbMi_5IF186-I_OoY2XceJ6cjWftM8B4fuWYvy9-etkiIRBJhSUvddkZxDc.; isg=BPj4EFuH0kwo2T1sUx0dRtNiyaaKYVzryfr9kjJpQDPkTZg32nDle-5vBQXYBhTD"
        let cooke_arr = cookies_str.split(";")
         console.log(cooke_arr)
        // for(let i = 0 ; i<cooke_arr.length;i++){
        //   this.$cookies.set(cooke_arr[i].split('=')[0].trim(),cooke_arr[i].split('=')[1].trim())
        // }
        let url = "https://wuliu.taobao.com/user/order_list_new.htm?spm=a1z09.1.category.d679.8c653606B7SmTj&order_status_show=send&mytmenu=fh"
        // let url = "/api444"
        // let url = "api444//trade/itemlist/list_sold_items.htm?action=itemlist/SoldQueryAction&event_submit_do_query=1&auctionStatus=SEND&tabCode=haveSendGoods"
        let query_data = {
      'action':	'itemlist/SoldQueryAction',
      'auctionType':	0,
'buyerNick':'',
'close':	0,
'dateBegin':0,
'dateEnd':	0,
'logisticsService':'',
'orderStatus':'SEND',
'pageNum':	1,
'pageSize':	15,
'queryMore':	true,
'queryOrder':'desc',
'rateStatus':'',
'refund':'',
'rxAuditFlag':	0,
'rxElectronicAllFlag':	0,
'rxElectronicAuditFlag':	0,
'rxHasSendFlag':0,
'rxOldFlag':	0,
'rxSendFlag':	0,
'rxSuccessflag':	0,
'rxWaitSendflag':	0,
'sellerNick':'',
'tabCode':	'haveSendGoods',
'tradeTag':0,
'useCheckcode':	false,
'useOrderInfo':	false,
'errorCheckcode':false,
'prePageNo':	2}
$.ajax({
            async : false,
            url :url,
            type : "GET",
            // dataType : 'json',
    xhrFields: {
       withCredentials: true
    },
            // data : {'tb_order_number_list':order_number_list},
            timeout : 5000,
            success : function(result) {
 console.log("7777777777777777777:",result)
                    alert("777777777777777777777777:"+result)

            },
            error:function (err) {
                console.log("错了:" + err);
                 alert("6666666666666666:"+err)
            }
        });

// ***********************************
//         axios.post(
//           // url,qs.stringify(query_data),
//           url, qs.stringify(query_data),
//           {headers: { 'content-type': 'application/x-www-form-urlencoded','Referer': 'https://trade.taobao.com/trade/itemlist/list_sold_items.htm?action=itemlist/SoldQueryAction&event_submit_do_query=1&auctionStatus=SEND&tabCode=haveSendGoods' }},
//           // {headers: {'token': 'Bearer ','Content-Type': 'multipart/form-data','referer':'https://trade.taobao.com/trade/itemlist/list_sold_items.htm?action=itemlist/SoldQueryAction&event_submit_do_query=1&auctionStatus=SEND&tabCode=haveSendGoods','origin':'https://trade.taobao.com','user-agent':'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/49.0.2623.112 Safari/537.369'},}
//         ).then((res)=>{
//         console.log("结果 ：",res)
//
//           }).catch(error => {
//             alert("访问错误")
//             alert(error)
//
//           })
         // ***********************************
      }
function replace_data(order_list){
     let ORDER_STATUS = {
          0:'未处理',
          1: '快递打印',
          2: '已发货',
      }
      let GOODS_STATUS={
              1:"未付款",//未付款
              2:"已付款",//已付款
              3:"拿货中",//拿货中
              4:"已拿货",//已拿货
              5:"已发货",//已发货
              6:"已退款",//已退款
              7:"明日有货",//明日有货
               8:"已取消",
               9:"缺货",
               10:"标签打印",
               11:"快递打印",
              12: '已下架',
              13: '2-5天有货',
              14:'其他',
            }
    for(let i = 0;i <order_list.length;i++){
         var order=order_list[i];


            order.order_status =ORDER_STATUS[order.order_status]

         for(let g = 0 ;g<order.orderGoods.length;g++){
             order.orderGoods[g].status = GOODS_STATUS[order.orderGoods[g].status]
             if(order.orderGoods[g].status === 1){
                 order.order_status = '未付款'
             }
             if(order.orderGoods[g].status === 5){
                 order.order_status = '已发货'
             }
         }
    }
    return order_list
}
function replace_null_order_data(order_list){

    // # 空包订单状态
    let null_package_order_status_choices2 = {
    1: '未付款',
    2:'已付款',
    3:'快递打印',
    4:'已发货',
    5:'已退款'

}
    for(let i = 0;i <order_list.length;i++){
         var order=order_list[i];
         order.order_status = null_package_order_status_choices2[order.order_status]
         order.order_status = order.order_status + "(刷包)"

    }

    return order_list
}
function find_order(tb_order_number,order_list){
        for(let i = 0;i<order_list.length;i++){
                    if(tb_order_number === order_list[i]['tb_order_number']){
                        return order_list[i]
                }
            }
            return null
}
function add_order_info_to_wuliu_page(order_list){

  $(".info").not(".msg").each(function() {
   var tbody_elems = $(this).parents("tbody");
    var orders_number=tbody_elems.find(".order-number").text().replace('订单编号：','').trim();
    let order = find_order(orders_number,order_list)
      var table_17 = tbody_elems.find(".order_info_table_17")
      var newget = null
     if(order!==null){
         table_17.remove()
        newget = '<table  class="order_info_table_17" width="100%"><tr bgcolor="#ffff99"><td height="30" align="center"><span style="margin-right: 40px;">17代发订单：'+order.tb_order_number+' </span>';
        newget += '<span style="margin-right: 40px;">快递：'+order.logistics_name+'</span>';
        newget += '<span style="margin-right: 40px;">单号：'+order.logistics_number+'</span>';
        newget += '<span style="margin-right: 40px;">订单状态：'+order.order_status+'</span>';
        newget += '</td></tr></table>';


      }else{
           table_17 = tbody_elems.find(".order_info_table_17")

           if(table_17.length === 0){
                        newget = '<table  class="order_info_table_17" width="100%"><tr bgcolor="#ffff99"><td height="30" align="center"><span  style="margin-right: 40px;font-size: 1.3em">未下单... </span>';
                         newget += '</td></tr></table>';
                    }



     }
        tbody_elems.find(".order-title").after(newget)
  })
}
function add_order_info_to_sold_list_page(order_list){


     $("#sold_container").find("div:eq(0)").children("div:eq(7)").children("div").each(function () {
        var tb_order_number = $(this).find("tr:eq(0)").find("td:eq(0)").find("span:eq(2)").text();
        if(tb_order_number !== undefined){
            var status = $(this).find("tr:eq(1)").find("td:eq(5)").find("span").text();
             let order = find_order(tb_order_number,order_list);
             var e = $(this).find("table:last");
             var table_17 = $(this).find(".order_info_get_order_from_tbtable_17")
              if(order!==null){

                        table_17.remove()
                        e = $(this).find("table:last");
                        var d=order;
                        var newget = '<table class="order_info_table_17" width="100%"><tr bgcolor="#ffff99"><td height="30" align="center"><span style="margin-right: 40px;">17代发订单：'+d.tb_order_number+'</span>';
                        newget += '<span style="margin-right: 40px;">快递：'+d.logistics_name+'</span>';
                        newget += '<span style="margin-right: 40px;">单号：'+d.logistics_number+'</span>';
                        newget += '<span style="margin-right: 40px;">订单状态：'+d.order_status+'</span>';
                        if(d.orderGoods !== undefined   ){
                            for(let n = 0 ; n<d.orderGoods.length;n++){
                                d.orderGoods[n].status
                                newget += '<span style="margin-right: 40px;">[商品'+n+" "+d.orderGoods[n].status+']</span>';
                            }
                        }


                        // newget += '<span>拿货情况：'+d.over_taking+'/'+d.pro_count+'</span>';
                        newget += '</td></tr></table>';
                        e.after(newget);
              }else{
                     table_17 = $(this).find(".order_info_table_17")
                    if(table_17.length === 0){
                        e = $(this).find("table:last");
                        var newget = '<table class="order_info_table_17" width="100%"><tr bgcolor="#ffff99"><td height="30" align="center">';
                        newget += '<span style="margin-right: 40px;">未下单...</span>';
                        newget += '</td></tr></table>';
                        e.after(newget);
                    }


               }
        }

    })




}
function add_order_info_to_batch_consign_page(order_list){


     $(".order-number").each(function(){
                let orders_number =$(this).text().replace('订单编号：','').trim();
                let order = find_order(orders_number,order_list)

                let tboy_elems = $(this).parents("tbody")
                let table_17 = tboy_elems.find('.order_info_table_17')
               var newget=null
                if(order!==null){
                    table_17.remove()
                    var d=order
                    var newget = '<table class = "order_info_table_17" width="100%"><tr bgcolor="#ffff99"><td height="30" align="center"><span style="margin-right: 40px;">17代发订单：'+d.tb_order_number+'</span>';
                    newget += '<span style="margin-right: 40px;">快递：'+d.logistics_name+'</span>';
                    newget += '<span style="margin-right: 40px;">单号：'+d.logistics_number+'</span>';
                    newget += '<span style="margin-right: 40px;">订单状态：'+d.order_status+'</span>';
                    if(d.orderGoods !== undefined   ){
                        for(let n = 0 ; n<d.orderGoods.length;n++){
                            d.orderGoods[n].status
                             newget += '<span style="margin-right: 40px;">[商品'+n+" "+d.orderGoods[n].status+']</span>';
                        }
                    }

                    // newget += '<span>拿货情况：'+d.over_taking+'/'+d.pro_count+'</span>';
                    newget += '</td></tr></table>';
                    tboy_elems.find(".order-title").before(newget);
                }else{
                     table_17 = tboy_elems.find(".order_info_table_17")
                     if(table_17.length === 0) {
                         newget = '<table class = "order_info_table_17" width="100%"><tr bgcolor="#ffff99"><td height="30" align="center"><span  style="margin-right: 40px;font-size: 1.3em">未下单... </span>';
                         newget += '</td></tr></table>';
                         tboy_elems.find(".order-title").before(newget);
                     }

                }







        })
}
document.addEventListener('DOMContentLoaded',my_functon);
function delivery_tb_order_timeout(){
     setTimeout(function(){

        chrome.runtime.sendMessage({ method:'get_order_from_tb'},function(response) {
            console.log("response8888888888888",response)
            let order_page = JSON.parse(response)
            let is_success = order_page.is_success
            let message = order_page.message
            if(is_success===false && message==="go_to_login_tb"){
                 $(".delivery_tb_order").text("淘宝订单发货")
                 $(".delivery_tb_order").attr("disabled",false)
                 $(".delivery_tb_order").css("color","black")
                 window.open("https://login.taobao.com/");
                 return
            }
            let order_list = order_page.result
            let tb_order_number_list = []

           for(let i = 0;i<order_list.length;i++){
              let  tb_order_number = order_list[i].tb_order_number
              tb_order_number_list.push(tb_order_number)
           }
           let p1 =new Promise(function(resolve,reject){
                deliveried_order_to_tb(tb_order_number_list)
                resolve(1);
        });
            let p2 =new Promise(function(resolve,reject){
                deliveried_null_order_to_tb(tb_order_number_list)
                resolve(2);
        });

            Promise.all([p1,p2]).then(function (results) {
            console.log('success:'+results);
            Toast("发货完成")
            $(".delivery_tb_order").text("淘宝订单发货")
            $(".delivery_tb_order").attr("disabled",false)
            $(".delivery_tb_order").css("color","black")
        }).catch(function(r){
             $(".delivery_tb_order").text("淘宝订单发货")
            $(".delivery_tb_order").attr("disabled",false)
            $(".delivery_tb_order").css("color","black")
            console.log("error");
            console.log(r);
        });


      })
  },500)
}



function test_fun(){
    let data = {
        "backFill":"",
"_fmw.to._0.t":"",
"source":"",
"callUrl":"","_tb_token_":"e1e3ee3e5f7b3",
"action":"user/batch_consign_action",
"event_submit_do_batch_consign_save":"1",
"_fmw.f._0.co":"110178029",
"_fmw.f._0.coun":"441481",
"_fmw.f._0.c":"陈清龙",
"_fmw.f._0.p":"",
"_fmw.f._0.ci":"",
"_fmw.f._0.cou":"",
"_fmw.f._0.adr":"福兴街道金河湾车库入口对面",
"_fmw.f._0.dd":"广东省梅州市兴宁市福兴街道金河湾车库入口对面",
"_fmw.f._0.ad":"广东省^^^梅州市^^^兴宁市^^^+++福兴街道金河湾车库入口对面",
"_fmw.f._0.z":"514500",
"_fmw.f._0.ddd":"",
"_fmw.f._0.ph":"",
"_fmw.f._0.b":"",
"_fmw.f._0.t":"",
"_fmw.f._0.m":"18719368068",
"_fmw.re._0.co":"110178029",
"_fmw.re._0.coun":"441481",
"_fmw.re._0.c":"陈清龙",
"_fmw.re._0.p":"",
"_fmw.re._0.ci":"",
"_fmw.re._0.cou":"",
"_fmw.re._0.adr":"福兴街道金河湾车库入口对面",
"_fmw.re._0.dd":"广东省梅州市兴宁市福兴街道金河湾车库入口对面",
"_fmw.re._0.ad":"广东省^^^梅州市^^^兴宁市^^^+++福兴街道金河湾车库入口对面",
"_fmw.re._0.z":"514500",
"_fmw.re._0.ddd":"",
"_fmw.re._0.ph":"",
"_fmw.re._0.b":"",
"_fmw.re._0.t":"",
"_fmw.re._0.m":"18719368068",
"sameLogisCompanyId":"102",
"logisType":"2",
"_fmw.f._0.f":"",
"_fmw.f._0.fe":"",
"_fmw.f._0.fet":"",
// "orderId":["180064860450","176521994963"],

"_fmw.r.180064860450.count":"211302",
"_fmw.r.180064860450.p":"",
"_fmw.r.180064860450.ci":"",
"_fmw.r.180064860450.d":"",
"_fmw.r.180064860450.coun":"",
"_fmw.r.180064860450.adr":"站南街道+++珠江蓝海城A区4号楼二单元",
"_fmw.r.180064860450.dd":"辽宁省朝阳市双塔区+站南街道+++珠江蓝海城A区4号楼二单元",
"_fmw.r.180064860450.ad":"辽宁省^^^朝阳市^^^双塔区^^^+站南街道+++珠江蓝海城A区4号楼二单元",
"_fmw.r.180064860450.c":"王昭岩",
"_fmw.r.180064860450.ddd":"",
"_fmw.r.180064860450.ph":"",
"_fmw.r.180064860450.b":"",
"_fmw.r.180064860450.t":"",
"_fmw.r.180064860450.mo":"13704211050",
"_fmw.r.180064860450.z":"000000",
"_fmw.r.180064860450.is":"",
"_fmw.m.180064860450.m":"4305893930196",
"_fmw.m.180064860450.goods":"+您可以在此输入备忘信息（仅卖家自己可见）。",

"_fmw.r.176521994963.count":"371329",
"_fmw.r.176521994963.p":"",
"_fmw.r.176521994963.ci":"",
"_fmw.r.176521994963.d":"",
"_fmw.r.176521994963.coun":"",
"_fmw.r.176521994963.adr":"临沭街道+++225省道临沭县人民医院新院区+门诊楼二楼+检验科",
"_fmw.r.176521994963.dd":"山东省临沂市临沭县+临沭街道+++225省道临沭县人民医院新院区+门诊楼二楼+检验科",
"_fmw.r.176521994963.ad":"山东省^^^临沂市^^^临沭县^^^+临沭街道+++225省道临沭县人民医院新院区+门诊楼二楼+检验科",
"_fmw.r.176521994963.c":"刘美萍",
"_fmw.r.176521994963.ddd":"",
"_fmw.r.176521994963.ph":"",
"_fmw.r.176521994963.b":"",
"_fmw.r.176521994963.t":"",
"_fmw.r.176521994963.mo":"18265395612",
"_fmw.r.176521994963.z":"000000",
"_fmw.r.176521994963.is":"",
"_fmw.m.176521994963.m":"4305893997556",
"_fmw.m.176521994963.goods":"+您可以在此输入备忘信息（仅卖家自己可见）。"
    }
    let str = ""
    for(let key in data){

        str = str + key+"="+data[key]+"&"
    }
    str = str + "orderId=180064860450&orderId=176521994963"

    $.ajax({
            async : false,
            url :"https://wuliu.taobao.com/user/batch_consign.htm",
            type : "POST",
            // dataType : 'json',
            data : str,
            timeout : 5000,
            success : function(result) {
                    console.log("test999999:",result)


            },
            error:function (err) {
                console.log("错了:" + err);
            }
        });
}
function Toast(msg,duration,elem){
      duration=isNaN(duration)?3000:duration;
      var m = document.createElement('div');
      // m = elem
      m.innerHTML = msg;
      m.style.cssText="max-width:60%;min-width: 150px;padding:0 14px;height: 40px;color: rgb(255, 255, 255);line-height: 40px;text-align: center;border-radius: 4px;position: fixed;top: 50%;left: 50%;transform: translate(-50%, -50%);z-index: 999999;background: rgba(0, 0, 0,.7);font-size: 16px;";
      document.body.appendChild(m);
      setTimeout(function() {
        var d = 0.5;
        m.style.webkitTransition = '-webkit-transform ' + d + 's ease-in, opacity ' + d + 's ease-in';
        m.style.opacity = '0';
        setTimeout(function() { document.body.removeChild(m) }, d * 1000);
      }, duration);
    }
function deliveried_order_to_tb(tb_order_number_list){
     chrome.runtime.sendMessage({order_number_list: JSON.stringify(tb_order_number_list),method:'get_orders_from17'},function(response) {
               let response_order_list = replace_data(JSON.parse(response))
               let new_order_list = []

               console.log("response_order_list:",response_order_list)
               // 根据物流分类储存
               let order_list_sort_object = {}
               for(let g = 0 ;g<response_order_list.length;g++){
                       if (response_order_list[g].order_status ==='已发货' && response_order_list[g].logistics_number !==null && response_order_list[g].logistics_number !==''){
                            new_order_list.push(response_order_list[g])
                            if(order_list_sort_object[response_order_list[g].logistics_name] === undefined ){
                                 let new_list =  [];
                                new_list.push(response_order_list[g])
                                order_list_sort_object[response_order_list[g].logistics_name] = new_list
                            }else{
                                 order_list_sort_object[response_order_list[g].logistics_name].push(response_order_list[g])
                            }
                       }
                   }
                console.log("order_list_sort_object------->",order_list_sort_object)

               for(let key in order_list_sort_object){
                   let order_list = order_list_sort_object[key]
                   let logistics_name = key
                        console.log("sendMessage-------order_list>",order_list)
                   chrome.runtime.sendMessage({order_list: JSON.stringify(order_list),method:'delivery_order_to_tb',logistics_name:logistics_name},function(response) {


                });
               }

            });
}
function deliveried_null_order_to_tb(tb_order_number_list){
     chrome.runtime.sendMessage({order_number_list: JSON.stringify(tb_order_number_list),method:'get_null_orders2'},function(response) {
               let response_order_list = replace_null_order_data(JSON.parse(response))
               let new_order_list = []

               console.log("get_null_orders2:",response_order_list)
                 let order_list_sort_object = {}
               for(let g = 0 ;g<response_order_list.length;g++){
                       if (response_order_list[g].order_status ==='已发货(刷包)' && response_order_list[g].logistics_number !==null && response_order_list[g].logistics_number !==''){
                            new_order_list.push(response_order_list[g])
                            if(order_list_sort_object[response_order_list[g].logistics_name] === undefined ){
                                let new_list =  [];
                                new_list.push(response_order_list[g])
                                order_list_sort_object[response_order_list[g].logistics_name] =new_list
                            }else{
                                 order_list_sort_object[response_order_list[g].logistics_name].push(response_order_list[g])
                            }
                       }
                   }

               for(let key in order_list_sort_object){
                   let order_list = order_list_sort_object[key]
                   let logistics_name = key
                   console.log("order_list55555",order_list)
                   chrome.runtime.sendMessage({order_list: JSON.stringify(order_list),method:'delivery_order_to_tb',logistics_name:logistics_name},function(response) {


                });
               }

            });
}

function get_temp_data(){
    let list = []
    let  order_obj = {};
    let goods_str_list = [];
    let goods_obj = {};
    let goods_obj2 = {};
    goods_obj['code'] = '女人街_2F_225_258_55';
    goods_obj['img'] = ''
    goods_obj['color'] ='黑色2xl';
    goods_obj['count'] = 1;
    goods_obj2['code'] = '金富丽_2F_303_9356_43';
    goods_obj2['img'] = ''
    goods_obj2['color'] ='粉色5XL';
    goods_obj2['count'] = 1;
    goods_str_list.push(goods_obj);

    order_obj['phone'] = "18791676995";
    order_obj['name'] = "许强";
    order_obj['address']  = "湖北省宜昌市伍家岗区 伍家乡   湖北省宜昌市伍区桔乡路";
    order_obj['order_goods_list']=goods_str_list
    order_obj['tb_order_number']="2020022025555"



    let  order_obj2 = {};
    let goods2_str_list = [];
    let goods2_obj = {};

    goods2_obj['code'] = '女人街_2F_225_258_55';
    goods2_obj['img'] = ''
    goods2_obj['color'] ='黑色2xl';
    goods2_obj['count'] = 1;
    goods2_obj['code'] = '金富丽_2F_303_9356_43';
    goods2_obj['img'] = ''
    goods2_obj['color'] ='粉色5XL';
    goods2_obj['count'] = 1;
    goods2_str_list.push(goods2_obj);

    order_obj2['phone'] = "13798985625";
    order_obj2['name'] = "胡伟";
    order_obj2['address']  = "广东省 广州市 番禺区 大石街道 毛毛超市对面";
    order_obj2['order_goods_list']=goods2_str_list
    order_obj2['tb_order_number']="2020201147575"
    list.push(order_obj)
    list.unshift(order_obj2)
    return list
}

 
