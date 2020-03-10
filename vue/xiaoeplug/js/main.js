var curLocation = window.location.href.toString();
var daifa_vue_url = "http://192.168.2.110:8082";

if(curLocation.indexOf("/pc/home")!==-1) {
    window.onload = function () {

        $(".tb_order").click(function () {

          let text =  $(".tb_order").text();
            $(".tb_order").text("正在同步淘宝订单...")
            $(".tb_order").attr("disabled",true)
            $(".tb_order").css("color","grey")

             setTimeout(function(){
                   chrome.runtime.sendMessage({ method:'get_order_from_tb'},function(response) {
                         $(".tb_order").text(text)
                        $(".tb_order").attr("disabled",false)
                       $(".tb_order").css("color","black")
                   console.log("response8888888888888",response)
                    let order_page = JSON.parse(response)
                    let is_success = order_page.is_success
                    let message = order_page.message
                    if(is_success===false && message==="go_to_login_tb"){
                        window.open("https://login.taobao.com/");
                        return
                    }
                    let order_list = order_page.result
                    let tb_order_number_list = []

                   for(let i = 0;i<order_list.length;i++){
                      let  tb_order_number = order_list[i].tb_order_number
                      tb_order_number_list.push(tb_order_number)
                   }
                   chrome.runtime.sendMessage({order_number_list: JSON.stringify(tb_order_number_list),method:'get_orders2'},function(response) {

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
                   if(!confirm("共 "+new_order_list.length+" 单，确定跳转下单？")) {
                     return ;
                   }
                   window.open(daifa_vue_url+"/#/pc/home/porder/?plug_order_data="+JSON.stringify(new_order_list));

	                });
              })
          },2000)

        })
        $(".tb_order").css({'display':'inline' });
    }
}
if(curLocation.indexOf("main.m.taobao.com/mytaobao/index.html")!==-1){
    window.onload=function(){
       set_timeout()
    }
}
function get_my_order_div(){

    return $(".main-layout").children("div:eq(1)")
}
function set_timeout(){
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
               chrome.runtime.sendMessage({order_number_list: JSON.stringify(tb_order_number_list),method:'get_orders2'},function(response) {
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
                 if(!confirm("共 "+new_order_list.length+" 单，确定跳转下单？")) {
                    return ;
                }
               window.open(daifa_vue_url+"/#/pc/home/porder/?plug_order_data="+JSON.stringify(new_order_list));

	    });

               $($(".synchronization_all_order_to17")[0]).attr("disabled",false) ;
          },500)

         })
    }else{
        set_timeout()
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
if (curLocation.indexOf("trade.taobao.com/trade/itemlist/list_sold_items.htm") != -1) {
    window.onload=function() {   //此处为是否加载完成
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
               chrome.runtime.sendMessage({order_number_list: JSON.stringify(tb_order_number_list),method:'get_orders2'},function(response) {
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
                 if(!confirm("共 "+new_order_list.length+" 单，确定跳转下单？")) {
                    return ;
                }
               window.open(daifa_vue_url+"/#/pc/home/porder/?plug_order_data="+JSON.stringify(new_order_list));

	    });

               $($(".synchronization_all_order_to17")[0]).attr("disabled",false) ;
                $($(".synchronization_all_order_to17")[0]).css({'background':'#3bb4f2', 'border-color': '#3bb4f2'});
          },500)

         })
     }
        $(".trade-order-main").each(function(){
            var tb_order_number=$(this).find("tr:eq(0)").find("td:eq(0)").find("span:eq(2)").text();
            var status=$(this).find("tr:eq(1)").find("td:eq(5)").find("span").text();
            var e = $(this).find("table:last");
              
             tb_order_number_list.push(tb_order_number)

        })
 
        chrome.runtime.sendMessage({order_number_list: JSON.stringify(tb_order_number_list),method:'get_orders'},function(response) {
            
		add_order_info_to_sold_list_page(JSON.parse(response).results)

	    });
    }
}
function update_list_sold_page() {
    let tb_order_number_list = []
// ********************
    // $(".trade-order-main").each(function () {
    //     var tb_order_number = $(this).find("tr:eq(0)").find("td:eq(0)").find("span:eq(2)").text();
    //     var status = $(this).find("tr:eq(1)").find("td:eq(5)").find("span").text();
    //     var e = $(this).find("table:last");
    //     console.log("555555status:",status)
    //     tb_order_number_list.push(tb_order_number)
    //
    // })
// *******************
    console.log("vvvvvvv:",$("#sold_container").find("div:eq(0)").children("div:eq(5)").children("div"))
        $("#sold_container").find("div:eq(0)").children("div:eq(5)").children("div").each(function () {
        var tb_order_number = $(this).find("tr:eq(0)").find("td:eq(0)").find("span:eq(2)").text();
        if(tb_order_number !== undefined){
            var status = $(this).find("tr:eq(1)").find("td:eq(5)").find("span").text();
        var e = $(this).find("table:last");
        console.log("555555status:",status)
        tb_order_number_list.push(tb_order_number)
        }


    })
    chrome.runtime.sendMessage({
        order_number_list: JSON.stringify(tb_order_number_list),
        method: 'get_orders'
    }, function (response) {

        add_order_info_to_sold_list_page(JSON.parse(response).results)
    })
}
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    var method = request.method;
    var to = request.to;
    console.log("main-listener:",request)
    if(to ==="list_sold_page" && method ==="update_page_data"){
        if (curLocation.indexOf("trade.taobao.com/trade/itemlist/list_sold_items.htm") != -1) {
             update_list_sold_page()
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

                add_order_info_to_wuliu_page(JSON.parse(response).results)
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
        add_order_info_to_batch_consign_page(JSON.parse(response).results)
	    });
    }
}
function get_order_goods_str_from_elems(elems){
     if( $(elems).find("label:contains(尺码：)").length !==0){
         $(elems).find("label:contains(尺码：)").next().addClass("17_size");
     }
     if(  $(elems).find("label:contains(尺寸：)").length !==0){
         $(elems).find("label:contains(尺寸：)").next().addClass("17_size");
     }
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

        var order_obj = new Object();
        var c = new Array();
        var f = tbody_elems

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
       var new_goods_str_list = []
       for (var x = 0; x < order_goods_list.length; x++) {
        var order_goods = new Object()


        order_goods['code'] =  typeof order_goods_list[x].code === "undefined" ? "" :order_goods_list[x].code.replace("#","^^^")
        order_goods['img']= typeof order_goods_list[x].img === "undefined" ? "" : order_goods_list[x].img;
        order_goods['size']= typeof order_goods_list[x].size === "undefined" ? "" : order_goods_list[x].size
        order_goods['color']= typeof order_goods_list[x].color === "undefined" ? "" : order_goods_list[x].color;
        order_goods['count']= typeof order_goods_list[x].total === "undefined" ? "" : order_goods_list[x].total;
        new_goods_str_list.push(order_goods)
    // d.goodinfo[x] = ordergoodslist[x];

    }

        order_obj['order_goods_list']=new_goods_str_list
        order_list.push(order_obj)

    })
    return order_list
}
function my_functon(){
alert("my_functon666666")


}
function init_daifa_elems() {
    $("input[value='批量打印运单']").after(" <input type='button' class='synchronization_all_order_to17'  value='同步所有订单到17代发网'>");
    $("input[value='批量打印运单']").after(" <input type='button' class='daifa_17'  value='17批量代发'>");
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
        tbody_elems.find("a.btn").after(" <form class='form_17' style='display:none' action='" + daifa_vue_url + "/#/pc/home/porder' method='get' target='_blank'></form>");
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
                     //    xmlHttp.open("GET", daifa_vue_url+"/#/pc/home/porder", true);
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
        window.open(daifa_vue_url+"/#/pc/home/porder/?plug_order_data="+JSON.stringify(order_list));
    // `   goods_obj['phone'] = phone;
    //     goods_obj['name'] = name;
    //     goods_obj['address']  = address;
    //      window.open(daifa_vue_url+"/#/pc/home/porder/?plug_data="+JSON.stringify(goods_obj));

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

        if (checkblinput == 0) {
            alert("请勾选要代发的订单");
            return false;
        }

         window.open(daifa_vue_url+"/#/pc/home/porder/?plug_order_data="+JSON.stringify(order_list));

        // $("input[value='批量打印运单']").after("<form class='subdaifapl' accept-charset='utf-8' style='display:none' method='post' action='" + a + "/User/quick_daifa.aspx'  target='_blank'>" + listhtml + "</form>");

        //var josnparam = "{\"list\":[" + listurl + "]}";
        //alert(josnparam);
        //var queryurl = "http://" + daifaURL + "/User/quick_daifa.aspx?jsonlist=" + listurl;
        //window.open(queryurl);

        // $(".subdaifapl").submit();
        //$(".subdaifapl").empty();
    });
        $(".synchronization_all_order_to17").click(function () {
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
    for(let i = 0;i <order_list.length;i++){
         var order=order_list[i];
         order.order_status = '进行中...'
        if(order.order_status ===2){
            order.order_status = '已发货'
        }
         for(let g = 0 ;g<order.orderGoods.length;g++){
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
function find_order(tb_order_number,order_list){
        for(let i = 0;i<order_list.length;i++){
                    if(tb_order_number === order_list[i]['tb_order_number']){
                        return order_list[i]
                }
            }
            return null
}
function add_order_info_to_wuliu_page(order_list){
  order_list = replace_data(order_list)
  $(".info").not(".msg").each(function() {
   var tbody_elems = $(this).parents("tbody");
    var orders_number=tbody_elems.find(".order-number").text().replace('订单编号：','').trim();
    let order = find_order(orders_number,order_list)
      var newget = null
     if(order!==null){
        newget = '<table width="100%"><tr bgcolor="#ffff99"><td height="30" align="center"><span style="margin-right: 40px;">17代发订单：'+order.tb_order_number+' </span>';
        newget += '<span style="margin-right: 40px;">快递：'+order.logistics_name+'</span>';
        newget += '<span style="margin-right: 40px;">单号：'+order.logistics_number+'</span>';
        newget += '<span style="margin-right: 40px;">订单状态：'+order.order_status+'</span>';
        newget += '</td></tr></table>';


      }else{
         newget = '<table width="100%"><tr bgcolor="#ffff99"><td height="30" align="center"><span  style="margin-right: 40px;font-size: 1.3em">未下单... </span>';

        newget += '</td></tr></table>';


     }
        tbody_elems.find(".order-title").after(newget)
  })
}
function add_order_info_to_sold_list_page(order_list){

    order_list = replace_data(order_list)
     $("#sold_container").find("div:eq(0)").children("div:eq(5)").children("div").each(function () {
        var tb_order_number = $(this).find("tr:eq(0)").find("td:eq(0)").find("span:eq(2)").text();
        if(tb_order_number !== undefined){
            var status = $(this).find("tr:eq(1)").find("td:eq(5)").find("span").text();
             var e = $(this).find("table:last");

                    let order = find_order(tb_order_number,order_list);
                    if(order!==null){
                        var d=order;
                        var newget = '<table width="100%"><tr bgcolor="#ffff99"><td height="30" align="center"><span style="margin-right: 40px;">17代发订单：'+d.tb_order_number+'</span>';
                        newget += '<span style="margin-right: 40px;">快递：'+d.logistics_name+'</span>';
                        newget += '<span style="margin-right: 40px;">单号：'+d.logistics_number+'</span>';
                        newget += '<span style="margin-right: 40px;">订单状态：'+d.order_status+'</span>';
                        // newget += '<span>拿货情况：'+d.over_taking+'/'+d.pro_count+'</span>';
                        newget += '</td></tr></table>';
                        e.after(newget);
              }else{
                    var newget = '<table width="100%"><tr bgcolor="#ffff99"><td height="30" align="center">';
                    newget += '<span style="margin-right: 40px;">未下单...</span>';
                    newget += '</td></tr></table>';
                    e.after(newget);

               }
        }

    })




}
function add_order_info_to_batch_consign_page(order_list){

    order_list = replace_data(order_list)
     $(".order-number").each(function(){
                let orders_number =$(this).text().replace('订单编号：','').trim();
                let order = find_order(orders_number,order_list)
               var newget=null
                if(order!==null){
                    var d=order
                    var newget = '<table width="100%"><tr bgcolor="#ffff99"><td height="30" align="center"><span style="margin-right: 40px;">17代发订单：'+d.tb_order_number+'</span>';
                    newget += '<span style="margin-right: 40px;">快递：'+d.logistics_name+'</span>';
                    newget += '<span style="margin-right: 40px;">单号：'+d.logistics_number+'</span>';
                    newget += '<span style="margin-right: 40px;">订单状态：'+d.order_status+'</span>';
                    // newget += '<span>拿货情况：'+d.over_taking+'/'+d.pro_count+'</span>';
                    newget += '</td></tr></table>';
                }else{
                         newget = '<table width="100%"><tr bgcolor="#ffff99"><td height="30" align="center"><span  style="margin-right: 40px;font-size: 1.3em">未下单... </span>';
                         newget += '</td></tr></table>';
                }

                 $(this).parents("tbody").before    (newget);





        })
}
document.addEventListener('DOMContentLoaded',my_functon);


