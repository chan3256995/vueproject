
let  CHUAMMEI_BASE_URL = "https://tb31.chuanmeidayin.com"
let chuammei_order_status = {
    WAIT_SELLER_SEND_GOODS:"待发货",
    WAIT_BUYER_CONFIRM_GOODS:"等待买家确认",
}
let  chuammei_goods_status = {
     WAIT_SELLER_SEND_GOODS:"待发货",
     WAIT_BUYER_CONFIRM_GOODS:"等待买家确认",


}

let  chuammei_goods_refund_status = {
     WAIT_SELLER_CONFIRM_GOODS:"待卖家确认",
     WAIT_SELLER_AGREE:"待卖家同意",
     WAIT_BUYER_RETURN_GOODS:"待买家退货",
     NO_REFUND:"无退款",
     CLOSED:"退款关闭",
     SUCCESS:"退款成功",

}


function websqlapi_init_chuanmei_db(){
      let db2 = openDatabase('my_tb_db',"1.0","chuanmeishuju",5*1024*1024)
             db2.transaction(function (tx) {
             console.log("1111:进入事务")
             tx.executeSql('CREATE TABLE IF NOT EXISTS   CHUANMEIORDER (sellerNick,tb_order_number unique ,buner_nick,create_time,pay_time,chuammei_oaid,payFee,order_goods_json,order_status,refund_status)',[],function (tx,res) {
                 console.log("创建表TBCOMMONTS结果:",res)
             })
         })
}

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
//获取最近多少天的订单总量
function apichuammei_get_recent_order_counts(day,page_size0){
        let end_time_stm = new Date().getTime()
        let dur_time_stm = day*24*60*60*1000
        let start_time_stm = end_time_stm  - dur_time_stm

        let start_time = format_stmp_to_time(start_time_stm)
        let end_time = format_stmp_to_time(end_time_stm)

        let counts_result = apichuanmei_get_order_counts(start_time,end_time)
        console.log("counts_result",counts_result)
        let counts = 0
        let total_page = 0
        let page_size = page_size0
        if(counts_result.success === true){
            counts = counts_result["data"]['counts']
        }
        total_page  = Math.ceil(parseInt(counts,10)/page_size)// 向上去整
    return {total_page:total_page,start_time:start_time,end_time:end_time}
}
function apichuanmei_get_order_counts(start_time,end_time){
    let return_result = {
        success:false,
        message:"",
    }
     let  submit_data = {
         multiShops: 'chenqling3,moonlight539,tb143754675',
tradeType: 1,
selTime: 1,
starttime: start_time,//'2021-08-26 00:00:00'
endtime: end_time,//'2021-11-24 23:59:59'
payment1: -1,
payment2: -1,
selItemInfo: 1,
itemInfo:'',
itemField:'',
inputVal1:'',
inputVal2:'',
itemKinds: -1,
itemNums: -1,
weight1: -1,
weight2: -1,
hasPrint: 0,
hasLy: 0,
orderState: 0,
groupStatus: -1,
hasTui: 0,
sellerFlag: -1,
goodsnum: -1,
hasinvoice: -1,
invoiceType: -1,
multiField:'',
ex: -1,
islock: 0,
cmFlag: 0,
province: 0,
receiverCity:'',
receiverArea:'',
isHasLy: 0,
isHasBz: 0,
buyerMessage:'',
sellerMemo:'',
itemSku1:'',
itemSku2:'',
isHasPrint: 0,
isHasSendPrint: 0,
hasExpressOrder: -1,
hasAsdpAds: 0,
hasAsdpBizType: -1,
buyerNick:'',
receiverName:'',
receiverMobile:'',
addressId: 0,
obTag: 0,
     }
     let url = CHUAMMEI_BASE_URL+"/printMulti/getMultiCount.do"
    $.ajax({
                async: false,
                url: url,
                type: "POST",
                // dataType : 'json',
                data: submit_data,
                contentType:"application/x-www-form-urlencoded",
                timeout: 5000,
                success: function (result) {

                console.log(" 传美获取订单数量结果:",result)

                return_result['success'] = true
                return_result['data'] = {
                    counts:result['data']['commonNum']
                }




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

//获取传美一页数据

function apichuanmei_get_order(start_time,end_time,pageNo,page_size=20){
    let return_result = {
        success:false,
        message:"",
    }
     let  submit_data = {
multiShops: 'chenqling3,moonlight539,tb143754675',
tradeType: 1,
selTime: 1,
starttime: start_time,
endtime: end_time,
payment1: -1,
payment2: -1,
selItemInfo: 1,
itemInfo:"",
itemField:"",
inputVal1:"",
inputVal2:"",
itemKinds: -1,
itemNums: -1,
weight1: -1,
weight2: -1,
hasPrint: 0,
hasLy: 0,
orderState: 0,
groupStatus: -1,
hasTui: 0,
sellerFlag: -1,
goodsnum: -1,
hasinvoice: -1,
invoiceType: -1,
multiField:"",
ex: -1,
islock: 0,
cmFlag: 0,
pageNo: pageNo,
pageSize: page_size,
province: 0,
receiverCity:"",
receiverArea:"",
isHasLy: 0,
isHasBz: 0,
buyerMessage:"",
sellerMemo:"",
itemSku1:"",
itemSku2:"",
isHasPrint: 0,
isHasSendPrint: 0,
hasExpressOrder: -1,
hasAsdpAds: 0,
hasAsdpBizType: -1,
buyerNick:"",
receiverName:"",
receiverMobile:"",
addressId: 0,
obTag: 0,
     }
     let url = CHUAMMEI_BASE_URL+"/printMulti/searchMulti.do"
    $.ajax({
                async: false,
                url: url,
                type: "POST",
                // dataType : 'json',
                data: submit_data,
                contentType:"application/x-www-form-urlencoded",
                timeout: 5000,
                success: function (result) {

                console.log(" 传美获取订单结果:",result)
                if(result['success'] === true && result['status'] === true){
                     return_result['success'] = true
                     return_result['list'] = result['data']['listhb']
                }






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
function apichuanmei_get_order_address(sellerNick,oaid,tid){
    let return_result = {
        success:false,
        message:"",
    }
     let  submit_data = {
        tid: tid,
oaid: oaid,
sellerNick: sellerNick,
scene: 1004
     }
     let url = CHUAMMEI_BASE_URL+"/app/trade/getTradeDecryptOaid.do"
    $.ajax({
                async: false,
                url: url,
                type: "POST",
                // dataType : 'json',
                data: submit_data,
                contentType:"application/x-www-form-urlencoded",
                timeout: 5000,
                success: function (result) {

                console.log(" 传美获取订单地址结果:",result)
                if(result["success"] === true){
                    return_result['success'] = true
                    return_result['data'] = result['data']
                }else{
                    return_result['success'] = false
                    return_result['data'] = result['message']
                }






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

//把已发货商品记录到表里
function apichuanmei_save_has_send_goods(all_goods_list){
        websqlapi_open_db()
        // websqlapi_drop_table("tb_has_send_goods_table")
        websqlapi_init_tb_has_send_goods_table()
        websqlapi_insert_tb_has_send_goods_table_data(all_goods_list)
}
//把标题跟商品id记录到表里
function apichuanmei_save_goods_title_change_record(all_goods_list){
        let all_goods_obj = {}
        let new_goods_list = []
        for(let i = 0;i<all_goods_list.length;i++){
            all_goods_obj[all_goods_list[i]['title']] = all_goods_list[i]
        }
        for(let key in all_goods_obj){
            new_goods_list.push(all_goods_obj[key])
        }
        all_goods_list = new_goods_list
        websqlapi_insert_tb_goods_title_update_table_data(all_goods_list)
}

// 传入传美已发货对象，返回自定义对象
function apichuanmei_has_send_order_item_replace(chuanmei_order_item){

            let new_goods_list = []
            for(let g = 0;g<chuanmei_order_item['orderslist'].length;g++){
                let goods_item = chuanmei_order_item['orderslist'][g]
                let new_goods_obj = {}
                let  new_order_obj = {}

                let tb_order_number = chuanmei_order_item['tid']
                let goods_code = goods_item['outerId']
                let sku_code = goods_item['outerSkuId']
                let color_size_arr = goods_item['skuPropName'].replace("主要颜色:","").replace("颜色分类:","").replace("尺寸:","").replace("尺码:","").split(";")


                let color = color_size_arr[0]
                let size = color_size_arr[1]



                new_order_obj['sellerNick'] =chuanmei_order_item['sellerNick']
                new_order_obj['tb_order_number'] = tb_order_number
                new_order_obj['buyer_nick'] = chuanmei_order_item['buyerNick']
                new_order_obj['create_time'] = chuanmei_order_item['created']
                new_order_obj['send_time'] = chuanmei_order_item['sendTime']
                new_order_obj['pay_time'] = chuanmei_order_item['payTime']
                new_order_obj['chuammei_oaid'] = chuanmei_order_item['oaid']
                new_order_obj['payFee'] = chuanmei_order_item['payment']
                new_order_obj['order_status'] = chuammei_order_status[chuanmei_order_item['status']]
                new_order_obj['address'] = chuanmei_order_item['receiverAddress']
                new_order_obj['province'] = chuanmei_order_item['receiverState']
                new_order_obj['city'] = chuanmei_order_item['receiverCity']
                new_order_obj['area'] = chuanmei_order_item['receiverDistrict']
                new_order_obj['towm'] = chuanmei_order_item['receiverTown']
                new_order_obj['youbian'] = chuanmei_order_item['receiverZip']
                new_order_obj['name'] = chuanmei_order_item['receiverName']
                new_order_obj['phone'] = chuanmei_order_item['receiverMobile']
                new_order_obj['cmFlag'] = chuanmei_order_item['cmFlag']
                new_order_obj['obTag'] = chuanmei_order_item['obTag']
                new_order_obj['sellerFlag'] = chuanmei_order_item['sellerFlag']
                // 卖家留言
                new_order_obj['seller_remarks'] = chuanmei_order_item['sellerMemo']

                if(sku_code!==""){
                    goods_code = sku_code
                }


                if(color === undefined){
                    color = "颜色"
                }
                if(size === undefined){
                    size = "尺码"
                }
                if(g>0){
                    new_order_obj['tb_order_number'] = tb_order_number+"-"+g
                }

                new_goods_obj['color'] = color_size_replace_string(color)
                new_goods_obj['size'] = color_size_replace_string(size)

                // new_goods_obj['code'] = goods_code

                new_goods_obj['goods_id'] = goods_item['numIID']
                new_goods_obj['goods_pic'] = goods_item['picPath']
                new_goods_obj['goods_counts'] = goods_item['num']
                new_goods_obj['refund_status'] = chuammei_goods_refund_status[goods_item['refundStatus']]
                new_goods_obj['status'] = chuammei_goods_status[goods_item['status']]
                new_goods_obj['title'] = goods_item['title']



                new_goods_obj['order_info'] = new_order_obj
                new_goods_list.push(new_goods_obj)
            }



    return {"goods_list":new_goods_list }
}


// 传入传美对象，返回自定义对象
function apichuanmei_order_item_replace(chuanmei_order_item){
            let  new_order_obj = {}
            let all_goods_list = []
            let tb_order_number = chuanmei_order_item['tid']
            new_order_obj['sellerNick'] =chuanmei_order_item['sellerNick']
            new_order_obj['tb_order_number'] = tb_order_number
            new_order_obj['buyer_nick'] = chuanmei_order_item['buyerNick']
            new_order_obj['create_time'] = chuanmei_order_item['created']
            new_order_obj['pay_time'] = chuanmei_order_item['payTime']
            new_order_obj['chuammei_oaid'] = chuanmei_order_item['oaid']
            new_order_obj['payFee'] = chuanmei_order_item['payment']
            new_order_obj['order_status'] = chuammei_order_status[chuanmei_order_item['status']]
            new_order_obj['address'] = chuanmei_order_item['receiverAddress']
            new_order_obj['province'] = chuanmei_order_item['receiverState']
            new_order_obj['city'] = chuanmei_order_item['receiverCity']
            new_order_obj['area'] = chuanmei_order_item['receiverDistrict']
            new_order_obj['towm'] = chuanmei_order_item['receiverTown']
            new_order_obj['youbian'] = chuanmei_order_item['receiverZip']
            new_order_obj['name'] = chuanmei_order_item['receiverName']
            new_order_obj['phone'] = chuanmei_order_item['receiverMobile']
            new_order_obj['cmFlag'] = chuanmei_order_item['cmFlag']
            new_order_obj['obTag'] = chuanmei_order_item['obTag']
            new_order_obj['sellerFlag'] = chuanmei_order_item['sellerFlag']
            // 卖家留言
            new_order_obj['seller_remarks'] = chuanmei_order_item['sellerMemo']
            let new_goods_list = []
            for(let g = 0;g<chuanmei_order_item['orders'].length;g++){
                let goods_item = chuanmei_order_item['orders'][g]
                let new_goods_obj = {}
                let goods_code = goods_item['outerId']
                let sku_code = goods_item['outerSkuId']
                let color_size_arr = goods_item['skuPropName'].replace("主要颜色:","").replace("颜色分类:","").replace("尺寸:","").replace("尺码:","").split(";")


                let color = color_size_arr[0]
                let size = color_size_arr[1]
                if(sku_code!==""){
                    goods_code = sku_code
                }

                // goods_code = goods_code.replace("东街","国投")
                goods_code = mcommon_replace_goods_code_str(goods_code)

                if(color === undefined){
                    color = "颜色"
                }
                if(size === undefined){
                    size = "尺码"
                }
                new_goods_obj['color'] = color_size_replace_string(color)
                new_goods_obj['size'] = color_size_replace_string(size)

                new_goods_obj['code'] = goods_code

                new_goods_obj['goods_id'] = goods_item['numIID']
                new_goods_obj['goods_pic'] = goods_item['picPath']
                new_goods_obj['goods_counts'] = goods_item['num']
                new_goods_obj['refund_status'] = chuammei_goods_refund_status[goods_item['refundStatus']]
                new_goods_obj['status'] = chuammei_goods_status[goods_item['status']]
                new_goods_obj['title'] = goods_item['title']
                new_goods_list.push(new_goods_obj)
            }
            all_goods_list= all_goods_list.concat(new_goods_list)
            new_order_obj['order_goods'] = new_goods_list

    return {"new_order_obj":new_order_obj,"item_goods_list":all_goods_list}
}


function color_size_replace_string(old_string){

    let reg_list  = [
        /\[建议(.*?)斤\]/,
        /\[(.*?)斤\]/,
        /【建议(.*?)斤】/,
        /【(.*?)斤】/,
        /\[建议(.*?)\]/,
        /【建议(.*?)】/,
    ]
    for(let i=0;i<reg_list.length;i++){
        let reg_item = reg_list[i]
        let match_str_arr  = old_string.match(reg_item,old_string)

        if(match_str_arr!==null && match_str_arr.length>0){
           old_string = old_string.replace(match_str_arr[0],"")
        }
    }

    return old_string
}

function apichuammei_wait_send_tab_init(){
        console.log("apichuammei_wait_send_tab_init")
        $("#daifa_page_span").remove()
        $(".StatisticsTradeCount").prepend('<span id="daifa_page_span" class="StatisticsTradeTab StatisticsTradeTabCheck">代发页面订单</span>')
        $("#daifa_page_span").click(function () {
             $(".data_div17").remove()
             let disp = $(".WaitPrintListHeight").css("display")
             let chuanmei_data_show = "flex"
             let data_show_17 = "None"
             let data_show_curr_page_17 = "None"
             if(disp === "flex"){
                 chuanmei_data_show = "None"
                 data_show_17 = "flex"
             }else{
                 chuanmei_data_show = "flex"
                 data_show_17 = "None"
             }

             if(data_show_17 === "flex"){

                 chrome.storage.local.get({"chuanmei_order_list_cache":{}},function (local_data) {

                 let append_elems_str = '<div class="data_div17">\n'+
                     '<div>' +
                     '<button id="to_place_order_17"  style="margin: 1em; padding-left: 1em;padding-right: 1em">选中的获取地址去下单</button>' +
                     '<button id="add_order_to17"  style="margin: 1em; padding-left: 1em;padding-right: 1em">选中的缓存到待下单缓存</button>' +
                     '<button id="go_to_place_order_to_17"  style="margin: 1em; padding-left: 1em;padding-right: 1em">跳转到17下单页面</button>' +

                     '<button   style="width: 6em" id="clean_table_17" >清除表数据(删表)</button>' +
                     '<button id="ignore_order_btn">不显示已下单订单</button>' +
                     '<span id="total_pages17"></span>' +
                     '<input placeholder="第几页" style="width: 4em" id="dump_page_input17"  value="1"/>' +
                     '<button  style="width: 4em" id="dump_page_btn17" >跳转</button>' +
                     '<button  style="width: 4em" id="dump_pre_page_btn17" >上一页</button>' +
                     '<button  style="width: 4em" id="dump_next_page_btn17" >下一页</button>' +


                     '</div>'
                 let wait_send_list = local_data["chuanmei_order_list_cache"]
                 console.log("读取本地储存记录,",wait_send_list)
                      $(".item_data_div17").remove()
                     apichuammei_curr_page_ui_update()

                 append_elems_str = append_elems_str + "</div>"
                 $(".WaitPrintListHeight").after(append_elems_str)
                  apichuammei_wait_send_page_init()
                  update_chuammei_wait_send_page_data()

                })
             }
             $(".WaitPrintListHeight").css("display",chuanmei_data_show)
             $(".data_div17").css("display",data_show_17)


         })


}

// 传美代发货页面
function apichuammei_wait_send_page_init(){
        let dum_page = 0
        let page_size = 20
        let result =  apichuammei_get_recent_order_counts(60,20)
        let total_page = result['total_page']
        $("#dump_pre_page_btn17").unbind("click")
        $("#dump_next_page_btn17").unbind("click")
        $("#to_place_order_17").unbind("click")
        $("#add_order_to17").unbind("click")
        $("#go_to_place_order_to_17").unbind("click")
        $("#clean_table_17").unbind("click")
        $(".show_goods_lb_17").unbind("click")
        $(".show_goods_sku_lb_17").unbind("click")

        $("#ignore_order_btn").unbind("click")
        $("#dump_page_btn17").unbind("click")
        $(".tb_flag_label").unbind("click")
        $(".show_goods_lb_17").click(function () {
            let parent_div = $(this).parent()
            let cur_item_goods_id = $(parent_div.find(".goods_id_lb")[0]).text().trim()
            websqlapi_query_tb_refund_order_data("tb_refund_table",{"goods_id":cur_item_goods_id,"refund_address":"我仓地址","update_page":"待发货页面","click_button":$(this)})
        })

        $(".show_goods_sku_lb_17").click(function () {
            let parent_div = $(this).parent()
            let cur_item_goods_id = $(parent_div.find(".goods_id_lb")[0]).text().trim()
            let goods_color_lb = $(parent_div.find(".goods_color_lb")[0]).text().trim()
            let goods_size_lb = $(parent_div.find(".goods_size_lb")[0]).text().trim()
            websqlapi_query_tb_refund_order_data("tb_refund_table",{"goods_id":cur_item_goods_id,"refund_address":"我仓地址","update_page":"待发货页面","color":goods_color_lb,"size":goods_size_lb,"click_button":$(this)})
        })
         $(".tb_flag_label").click(function(){
            console.log("旺旺ID：", $(this).parent().find(".seller_wang_wang_id_17"))
            let tb_order_number = $($(this).parent().find(".tb_order_number_lb_17")[0]).text().trim()
            let sell_wangwang_id = $($(this).parent().find(".seller_wang_wang_id_17")[0]).text().trim()
             let seller_remarks = $($(this).parent().find(".seller_remarks_17")[0]).text().trim()
             let tb_flag = $(this).text().trim().replace("淘宝旗帜：","")

             console.log("tb_flag:",tb_flag)
             let tb_flag_new = 5
             if(tb_flag !=="0"){
                 tb_flag_new = 0
             }

             let result_  = apichuanmei_add_tag_tb(sell_wangwang_id,tb_order_number,null,seller_remarks,tb_flag_new)
              if(result_["success"] === false){
                                   Toast(tb_order_number+" 插旗失败，"+result_["message"])
                               }else{
                                    Toast(tb_order_number+" 插旗成功，"+result_["message"],300)
                               }

         })
         $("#dump_page_btn17").click(function () {
            let dum_page =    $("#dump_page_input17")[0].value
             apichuanmei_dump_page(dum_page,page_size,total_page,result['start_time'],result['end_time'])
        })


         $("#dump_pre_page_btn17").click(function () {
            let dum_page =    $("#dump_page_input17")[0].value
            dum_page = parseInt(dum_page)
             if(dum_page  > 0){
                 dum_page = dum_page - 1
                 apichuanmei_dump_page(dum_page,page_size,total_page,result['start_time'],result['end_time'])
             }

        })
        $("#dump_next_page_btn17").click(function () {
            let dum_page =    $("#dump_page_input17")[0].value
            dum_page = parseInt(dum_page)
            total_page = parseInt(total_page)
             if(dum_page < total_page ){
                 dum_page = dum_page + 1
                apichuanmei_dump_page(dum_page,page_size,total_page,result['start_time'],result['end_time'])
             }

        })
        console.log("获取到的总页数：",total_page)
        $("#total_pages17").text("共"+total_page+"页")

       $("#to_place_order_17").click(function () {
             chrome.storage.local.get({"chuanmei_order_list_cache":{}},function (local_data) {
             let chuammei_wait_send_list = local_data["chuanmei_order_list_cache"]
             $(".check_box_17:checked").each(function () {
                     let select_order_number = $($(this).parent().find(".tb_order_number_lb_17")[0]).text().trim()
                     let order = find_order(select_order_number,chuammei_wait_send_list)
                     let oaid = order['chuammei_oaid']
                     let sellerNick =  order['sellerNick']
                     let tb_order_number =  order['tb_order_number']
                     let address_result = apichuanmei_get_order_address(sellerNick,oaid,tb_order_number)
                     if(address_result.success === true){
                             let mobile = address_result['data']['mobile']
                             order['name'] = address_result['data']['name']
                             if(mobile===undefined || mobile === null || mobile ===""){
                                 mobile = address_result['data']['phone']
                             }
                             order['phone'] = mobile
                             order['province'] = address_result['data']['state']
                             order['city'] = address_result['data']['city']
                             order['area'] = address_result['data']['district']
                             order['towm'] = address_result['data']['towm']
                             order['address'] = address_result['data']['addressDetail']
                             chuammei_wait_send_list = update_order(order,chuammei_wait_send_list)
                         }else{
                         Toast("获取地址失败，"+address_result["message"])
                     }
                     console.log("获取地址结果:",address_result)
                    })
                     chrome.storage.local.set({"chuanmei_order_list_cache":chuammei_wait_send_list},function () {
                                    console.log("传美更新地址后，保存成功，",chuammei_wait_send_list)

                                })

                     chrome.storage.local.get({"my_tb_wait_send_order_cache1":{}},function(data0){
                          // 用于下单到17网 列表
                         let my_tb_wait_send_order_cache1 = data0["my_tb_wait_send_order_cache1"]


                         for(let m = 0;m<chuammei_wait_send_list.length;m++){
                              let cur_item = chuammei_wait_send_list[m]
                              let new_item = {}
                              // 镇
                              let towm = cur_item["towm"]
                             if(towm===undefined){
                                 towm = ""
                             }

                             new_item['address'] = cur_item["province"]+","+cur_item["city"]+","+cur_item["area"]+towm+cur_item["address"]
                             new_item['province'] = cur_item["province"]
                             new_item['city'] = cur_item["city"]
                             new_item['area'] = cur_item["area"]
                             new_item['address_details'] = cur_item["address"]
                             new_item['name'] = cur_item["name"]
                              new_item['tb_seller_wangwang_id'] = cur_item["sellerNick"]
                              new_item['wangwang_id'] = cur_item["sellerNick"]
                              new_item['order_id'] = ""
                              new_item['phone'] = cur_item["phone"]
                              new_item['tb_order_number'] = cur_item["tb_order_number"]
                              new_item['user_wangwang_id'] = cur_item["buyer_nick"]
                              let cur_item_order_goods_list = cur_item["order_goods"]
                              let order_goods_list = []
                              for(let g = 0;g<cur_item_order_goods_list.length;g++){
                                  let goods = {}
                                  let code = cur_item_order_goods_list[g]['code']
                                  goods['code'] = code
                                  goods['color'] = cur_item_order_goods_list[g]['color']
                                  goods['size'] = cur_item_order_goods_list[g]['size']
                                  goods['img'] = cur_item_order_goods_list[g]['goods_pic']
                                  goods['tb_goods_id'] = cur_item_order_goods_list[g]['goods_id']
                                  //用户编码
                                  goods['user_code'] = cur_item_order_goods_list[g]['goods_id']
                                  if(code!==undefined && code!==default_tb_code){
                                      goods['user_code'] = code
                                        //自定义编码带有商品id的忽略
                                     console.log("code_"+code)
                                     console.log("tb_goods_id"+goods['tb_goods_id'])
                                      if(code.indexOf(goods['tb_goods_id'])!==-1){
                                          code = default_tb_code
                                          goods['code'] = code
                                      }
                                  }


                                  goods['count'] = cur_item_order_goods_list[g]['goods_counts']
                                  order_goods_list.push(goods)
                              }
                               new_item['order_goods_list'] = order_goods_list
                             let order = find_order(new_item['tb_order_number'],my_tb_wait_send_order_cache1)
                             if(order == null){
                                 my_tb_wait_send_order_cache1.push(new_item)
                             }





                     }
                         chrome.storage.local.set({"my_tb_wait_send_order_cache1":my_tb_wait_send_order_cache1},function () {
                                    console.log("保存成功my_tb_wait_send_order_cache1，",my_tb_wait_send_order_cache1)
                                    Toast("my_tb_wait_send_order_cache1")

                                    let tb_order_number_list = []
                                    for(let c = 0;c<my_tb_wait_send_order_cache1.length;c++){
                                        tb_order_number_list.push(my_tb_wait_send_order_cache1[c]['tb_order_number'])
                                    }
                                    let p1 = new Promise(function (resolve, reject) {

                                        chrome.runtime.sendMessage({order_number_list: JSON.stringify(tb_order_number_list),method: 'get_orders_from17'}, function (response) {
                                            let response_order_list = JSON.parse(response)
                                            resolve({"orders": response_order_list})
                                            });
                                    })
                                    let p2 = new Promise(function (resolve, reject) {

                                        chrome.runtime.sendMessage({order_number_list: JSON.stringify(tb_order_number_list),method: 'get_null_orders_from17'}, function (response) {
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

                                    let my_tb_wait_send_order_cache = []

                                    //不存在的订单才同步

                                    for (let i = 0; i < my_tb_wait_send_order_cache1.length; i++) {
                                        let order = find_order(my_tb_wait_send_order_cache1[i].tb_order_number, orders_list_17)
                                        let null_order = find_order(my_tb_wait_send_order_cache1[i].tb_order_number, null_orders_list_17)
                                        if (order === null && null_order === null) {
                                            my_tb_wait_send_order_cache.push(my_tb_wait_send_order_cache1[i])

                                        }
                                    }

                                    let my_tb_wait_send_order_cache_str = JSON.stringify(my_tb_wait_send_order_cache)
                                    chrome.storage.local.set({"my_tb_wait_send_order_cache":my_tb_wait_send_order_cache},function () {
                                        console.log("数据保存到谷歌插件成功my_tb_wait_send_order_cache",my_tb_wait_send_order_cache)


                                        if (!confirm("共 " + my_tb_wait_send_order_cache.length + " 单，确定跳转下单2？")) {
                                                    return;
                                        }
                                        my_tb_wait_send_order_cache_str =  my_tb_wait_send_order_cache_str.replace(/#/g,"^^^")
                                        window.open(mcommon_get_base_vue_url_17() + "/#/pc/home/porder/?plug_order_data=" + my_tb_wait_send_order_cache_str);


                                    })






                                    }).catch(function (r) {
                                       console.log(r);
                                        });

                                })
                     })

                })

         })
       // 添加到17网下单缓存
       $("#add_order_to17").click(function () {
             chrome.storage.local.get({"chuanmei_curr_page_order_list_cache":{}},function (local_data) {
                 let chuanmei_curr_page_order_list_cache = local_data["chuanmei_curr_page_order_list_cache"]
                     // 17网下单需要该数据
                 let order_to_17_list = []
                 $(".check_box_17:checked").each(function () {
                         let select_order_number = $($(this).parent().find(".tb_order_number_lb_17")[0]).text().trim()
                         let order = find_order(select_order_number,chuanmei_curr_page_order_list_cache)
                         let oaid = order['chuammei_oaid']
                         let sellerNick =  order['sellerNick']
                         let tb_order_number =  order['tb_order_number']
                         let address_result = apichuanmei_get_order_address(sellerNick,oaid,tb_order_number)
                         if(address_result.success === true){
                                 let mobile = address_result['data']['mobile']
                                 order['name'] = address_result['data']['name']
                                 if(mobile===undefined || mobile === null || mobile ===""){
                                     mobile = address_result['data']['phone']
                                 }
                                 order['phone'] = mobile
                                 order['province'] = address_result['data']['state']
                                 order['city'] = address_result['data']['city']
                                 order['area'] = address_result['data']['district']
                                 order['towm'] = address_result['data']['towm']


                                 let address_raw = address_result['data']['addressDetail']
                                let match_str_arr  = address_raw.match(/【配送拨打(.*?)】/,address_raw)

                                if(match_str_arr!==null && match_str_arr.length>0){
                                   address_raw = address_raw.replace(match_str_arr[0],"")
                                }

                                order['address'] = address_raw


                                 chuanmei_curr_page_order_list_cache = update_order(order,chuanmei_curr_page_order_list_cache)
                                 order_to_17_list.push(order)
                             }else{
                             Toast("获取地址失败，"+address_result["message"])
                         }
                         console.log("获取地址结果:",address_result)
                        })
                 chrome.storage.local.set({"chuanmei_order_list_cache":chuanmei_curr_page_order_list_cache},function () {
                                console.log("传美更新地址后，保存成功，",chuanmei_curr_page_order_list_cache)

                            })


                 chrome.storage.local.get({"my_tb_wait_send_order_cache1":[]},function (data0) {
                      // 用于下单到17网 列表
                       let my_tb_wait_send_order_cache1 = data0["my_tb_wait_send_order_cache1"]
                      console.log("已经缓存的要添加到17网的数据：",my_tb_wait_send_order_cache1)
                      console.log("即将添加到17网的临时缓存的数据",order_to_17_list)

                   for(let m = 0;m<order_to_17_list.length;m++){
                       // 没在缓存的才同步

                      let cur_item = order_to_17_list[m]
                      let new_item = {}
                      // 镇
                      let towm = cur_item["towm"]
                      let order = find_order( cur_item["tb_order_number"] , my_tb_wait_send_order_cache1)
                        console.log("order:",order)
                       if(order!==null){
                           console.log("已存在缓存订单，跳过不添加：",order)
                           continue
                       }

                     if(towm===undefined){
                         towm = ""
                     }

                     new_item['address'] = cur_item["province"]+","+cur_item["city"]+","+cur_item["area"]+towm+cur_item["address"]
                     new_item['province'] = cur_item["province"]
                     new_item['city'] = cur_item["city"]
                     new_item['area'] = cur_item["area"]
                     new_item['address_details'] = cur_item["address"]
                     new_item['name'] = cur_item["name"]
                      new_item['wangwang_id'] = cur_item["sellerNick"]
                      new_item['tb_seller_wangwang_id'] = cur_item["sellerNick"]
                      new_item['order_id'] = ""
                      new_item['phone'] = cur_item["phone"]
                      new_item['tb_order_number'] = cur_item["tb_order_number"]
                      new_item['user_wangwang_id'] = cur_item["buyer_nick"]
                      new_item['remarks_text'] = cur_item["remarks_text"]
                      let cur_item_order_goods_list = cur_item["order_goods"]
                      let order_goods_list = []
                      for(let g = 0;g<cur_item_order_goods_list.length;g++){
                          let goods = {}
                          let code = cur_item_order_goods_list[g]['code']
                          let goods_refund_status =  cur_item_order_goods_list[g]['refund_status']
                          if(goods_refund_status !== '无退款'){
                              continue
                          }
                          goods['code'] = code
                          goods['color'] = cur_item_order_goods_list[g]['color']
                          goods['size'] = cur_item_order_goods_list[g]['size']
                          goods['img'] = cur_item_order_goods_list[g]['goods_pic']
                          goods['tb_goods_id'] = cur_item_order_goods_list[g]['goods_id']

                          //用户编码
                          goods['user_code'] = cur_item_order_goods_list[g]['goods_id']
                          if(code!==undefined && code!==default_tb_code){
                              goods['user_code'] = code
                                console.log("code_"+code)
                                console.log("tb_goods_id"+goods['tb_goods_id'])
                              if(code.indexOf(goods['tb_goods_id'])!==-1){
                                  code = default_tb_code
                                  goods['code'] = code
                              }
                          }
                        //自定义编码带有商品id的忽略


                          goods['count'] = cur_item_order_goods_list[g]['goods_counts']
                          order_goods_list.push(goods)
                      }
                      if(order_goods_list.length==0){
                          console.log("当前订单无正常状态商品")
                          continue
                      }
                       new_item['order_goods_list'] = order_goods_list

                     my_tb_wait_send_order_cache1.push(new_item)

                 }
                       chrome.storage.local.set({"my_tb_wait_send_order_cache1":my_tb_wait_send_order_cache1},function () {
                            console.log("保存成功要添加到17网的数据8888888，",my_tb_wait_send_order_cache1)
                            Toast("保存成功要添加到17网的数据")



                            })
                 })




                })

         })
       $("#clean_table_17").click(function (){
           websqlapi_drop_table("tb_goods_title_update_table")
       })
       $("#go_to_place_order_to_17").click(function(){

            chrome.storage.local.get({"my_tb_wait_send_order_cache1":[]},function (data0) {
                // 用于下单到17网 列表
                let my_tb_wait_send_order_cache1 = data0["my_tb_wait_send_order_cache1"]
                let tb_order_number_list = []
                //

                for(let c = 0;c<my_tb_wait_send_order_cache1.length;c++){
                    tb_order_number_list.push(my_tb_wait_send_order_cache1[c]['tb_order_number'])

                }


                let p1 = new Promise(function (resolve, reject) {

                    chrome.runtime.sendMessage({order_number_list: JSON.stringify(tb_order_number_list),method: 'get_orders_from17'}, function (response) {
                        let response_order_list = JSON.parse(response)
                        resolve({"orders": response_order_list})
                        });
                })
                let p2 = new Promise(function (resolve, reject) {

                    chrome.runtime.sendMessage({order_number_list: JSON.stringify(tb_order_number_list),method: 'get_null_orders_from17'}, function (response) {
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

                let my_tb_wait_send_order_cache = []

                //不存在的订单才同步

                for (let i = 0; i < my_tb_wait_send_order_cache1.length; i++) {
                    let order = find_order(my_tb_wait_send_order_cache1[i].tb_order_number, orders_list_17)
                    let null_order = find_order(my_tb_wait_send_order_cache1[i].tb_order_number, null_orders_list_17)
                    if (order === null && null_order === null) {
                        my_tb_wait_send_order_cache.push(my_tb_wait_send_order_cache1[i])

                    }
                }

                let my_tb_wait_send_order_cache_str = JSON.stringify(my_tb_wait_send_order_cache)
                chrome.storage.local.set({"my_tb_wait_send_order_cache":my_tb_wait_send_order_cache},function () {
                    console.log("数据保存到谷歌插件成功my_tb_wait_send_order_cache",my_tb_wait_send_order_cache)


                    if (!confirm("共 " + my_tb_wait_send_order_cache.length + " 单，确定跳转下单2？")) {
                                return;
                    }
                    my_tb_wait_send_order_cache_str =  my_tb_wait_send_order_cache_str.replace(/#/g,"^^^")
                    window.open(mcommon_get_base_vue_url_17() + "/#/pc/home/porder/?plug_order_data=" + my_tb_wait_send_order_cache_str);


                })
                chrome.storage.local.set({"my_tb_wait_send_order_cache1":[]},function () {


                })






                }).catch(function (r) {
                   console.log(r);
                    });
            })



       })

       $("#ignore_order_btn").click(function () {

           $(".order_info_table_17").each(function(){
                let dis = $(this).parent().css("display")
                if(dis ==="none"){
                    $(this).parent().css("display",'list-item')
                }else{
                    $(this).parent().css("display",'none')
                }
                })
           $(".null_order_info_table_17").each(function(){
                let dis = $(this).parent().css("display")
                if(dis ==="none"){
                    $(this).parent().css("display",'list-item')
                }else{
                    $(this).parent().css("display",'none')
                }
                })

             $(".is_goods_sended_warning").each(function(){
                    $(this).parent().css("display",'list-item')
                })

        })


}
//订单统计页面
function apichuammei_beihuo_page_init(){
        console.log("传美备货页面初始化............")
      websqlapi_open_db()
      websqlapi_init_tb_refund_table()
     $(".StatisticsTradeCount").prepend('<span  id="return_packge_totel" class="">实时退件统计(已派件/签收)</span>')
      $("#return_packge_totel").click(function () {
             // $(".data_div17").remove()
             let disp = $(".StockUpList").css("display")
             let chuanmei_data_show = "flex"
             let data_show_17 = "None"
             let data_show_curr_page_17 = "None"
             if(disp === "flex"){
                 chuanmei_data_show = "None"
                 data_show_17 = "flex"
             }else{
                 chuanmei_data_show = "flex"
                 data_show_17 = "None"
             }




             if(data_show_17 === "flex"){
                 if($(".data_div17").length == 0){
                      let append_elems_str = '<div class="data_div17 data_div17_top">\n'+
                         '<div>' +
                         '<span >传美售后文件</span>' +

                         '<input type="file" id="chuanmei_refund_excel_file">' +

                          '<span >  淘宝售后文件</span>' +
                         '<input type="file" id="chuanmei_refund_excel_taobao_file">' +
                          '<button   class="submit_refund_logistics_data">提交退货物流信息</button>' +
                         '<button   class="all_return_order">显示全部退货sku</button>' +
                         '<button  style="margin-left: 1em"  class="is_received_return_order">显示已签收退货sku</button>' +
                             '<button  style="margin-left: 1em"  class="is_received_long_time_order">显示已签收很久的sku</button>' +
                         '<button  style="margin-left: 1em"  class="has_logistics_log_return_order">显示有物流退货sku</button>' +
                             '<select id="renfund_order_show_model_17">\n' +
                          '<option value="统计模式">统计模式</option>\n' +
                          '<option value="列表模式">列表模式</option>\n' +
                          '</select>' +
                         '<select id="renfund_order_select_17">\n' +
                          '<option value="显示全部">显示全部</option>\n' +
                          '<option value="显示有物流的">显示有物流的</option>\n' +
                          '</select>' +
                          '<select id="renfund_address_select_17">\n' +
                          '<option value="全部地址">全部地址</option>\n' +
                          '<option value="我仓地址">我仓地址</option>\n' +
                          '<option value="315地址">315地址</option>\n' +
                          '</select>' +

                           '<select id="tb_shop_select_17">\n' +
                          '<option value="显示全部">显示全部</option>\n' +
                          '<option value="moonlight539">moonlight539</option>\n' +
                          '<option value="chenqling3">chenqling3</option>\n' +
                          '</select>' +
                         '<button  style="margin-left: 1em"  id="query_refund_data_17_btn">查询售后订单</button>' +
                         '<button  style="margin-left: 1em"  class="clean_all_data">清除售后数据(包括删表)</button>' +
                         '<button  style="margin-left: 4em"  class="query_has_send_data">查询已发货</button>' +
                           '<button  style="margin-left: 1em"  class="clean_has_send_table_data">清除已发货数据(包括删表)</button>' +
                         '</div>'
                     append_elems_str = append_elems_str + "</div>"

                     $(".StockUpList").after(append_elems_str)

                     $('#chuanmei_refund_excel_taobao_file').change(function (e) {
                        let files = e.target.files;
                        let fileReader = new FileReader();
                         let workbook ;
                         let persons = []
                         fileReader.onload = function(ev) {
                                try {
                                    let data = ev.target.result
                                    workbook = XLSX.read(data, {
                                            type: 'binary'
                                        }) // 以二进制流方式读取得到整份excel表格对象
                                     persons = []; // 存储获取到的数据
                                } catch (e) {
                                    console.log('文件类型不正确');
                                    return;
                                }

                                // 表格的表格范围，可用于判断表头是否数量是否正确
                                let fromTo = '';
                                // 遍历每张表读取
                                for (let sheet in workbook.Sheets) {
                                    if (workbook.Sheets.hasOwnProperty(sheet)) {
                                        fromTo = workbook.Sheets[sheet]['!ref'];//读取的全部数据 A1:AN203
                                        console.log(fromTo);
                                        persons = persons.concat(XLSX.utils.sheet_to_json(workbook.Sheets[sheet], {header:1,defval:''}));//合并数据
                                        break; // 如果只取第一张表，就取消注释这行
                                    }
                                }
                                //在控制台打印出来表格中的数据
                                console.log("数据内容1：",persons);
                                persons.shift()



                                let return_data = apichuammei_get_excel_refund_taobao_item_data(persons)
                                let new_data_obj=return_data['return_data_obj']
                                let return_data_list=return_data['return_data_list']
                                console.log("读取淘宝售后excel数据：new_data_obj",new_data_obj)
                                console.log("读取淘宝售后excel数据：return_data_list",return_data_list)
                                websqlapi_insert_tb_refund_order_data(return_data_list,"taobao")
                                websqlapi_add_tb_flag()
                                return
                                chrome.storage.local.get({"chuanmei_refund_order_cache":{}},function (local_data_obj) {
                                    console.log("chuanmei_refund_order_cache缓存，",local_data_obj)
                                    let local_cache_data  = local_data_obj["chuanmei_refund_order_cache"]

                                    for(let key in local_cache_data){

                                       let new_obj =  Object.assign(local_cache_data[key],new_data_obj[key])
                                        console.log("合并前1：",local_cache_data[key])
                                        console.log("合并后2：",new_data_obj[key])
                                        local_cache_data[key] = new_obj
                                    }
                                    chrome.storage.local.set({"chuanmei_refund_order_cache":local_cache_data},function () {
                                    console.log("传美售后订单保存成功1，",local_cache_data)
                                    Toast("售后订单保存成功")
                                        let chuammei_refund_data = local_cache_data
                                        for(let key in chuammei_refund_data){
                                        let tb_flag = chuammei_refund_data[key]['taobao_flag']
                                        let seller_wangwang_id_tb = chuammei_refund_data[key]['seller_wangwang_id_tb']
                                        let seller_phone_tb = chuammei_refund_data[key]['seller_phone_tb']
                                        let order_number_tb = chuammei_refund_data[key]['order_number_tb']
                                        let seller_remarks = chuammei_refund_data[key]['seller_remarks']
                                            console.log("tb_flag",tb_flag)
                                            console.log("seller_phone_tb",seller_phone_tb)
                                            if(tb_flag !=='蓝色' && seller_phone_tb !== undefined && seller_phone_tb.indexOf("020")!==-1){
                                                let result_ = apichuanmei_add_tag_tb(seller_wangwang_id_tb,order_number_tb,null,seller_remarks,4)
                                                if(result_["success"] === false){
                                                Toast(order_number_tb+" 插旗失败，"+result_["message"])
                                                }else{
                                                    Toast(order_number_tb+" 插旗成功，"+result_["message"],300)
                                                }
                                            }
                                   }

                                })

                            })

                        };
                        // 以二进制方式打开文件
                        fileReader.readAsBinaryString(files[0]);
                     })
                     $('#chuanmei_refund_excel_file').change(function(e) {
                        let files = e.target.files;
                        let fileReader = new FileReader();
                         let workbook ;
                         let persons = []
                         fileReader.onload = function(ev) {
                                try {
                                    let data = ev.target.result
                                    workbook = XLSX.read(data, {
                                            type: 'binary'
                                        }) // 以二进制流方式读取得到整份excel表格对象
                                     persons = []; // 存储获取到的数据
                                } catch (e) {
                                    console.log('文件类型不正确');
                                    return;
                                }

                                // 表格的表格范围，可用于判断表头是否数量是否正确
                                let fromTo = '';
                                // 遍历每张表读取
                                for (let sheet in workbook.Sheets) {
                                    if (workbook.Sheets.hasOwnProperty(sheet)) {
                                        fromTo = workbook.Sheets[sheet]['!ref'];//读取的全部数据 A1:AN203
                                        console.log(fromTo);
                                        persons = persons.concat(XLSX.utils.sheet_to_json(workbook.Sheets[sheet], {header:1,defval:''}));//合并数据
                                        break; // 如果只取第一张表，就取消注释这行
                                    }
                                }
                                //在控制台打印出来表格中的数据
                                console.log("数据内容1：",persons);
                                persons.shift()
                                websqlapi_open_db()
                                websqlapi_delete_all_data_from_table("tb_refund_table")
                                apichuammei_save_refun_data_to_db(persons)
                                // websqlapi_query_tb_refund_order_data("",{"refund_address":"我仓地址"})


                             // text=persons;//训练数据集text
                                // console.log(persons)
                        };
                        // 以二进制方式打开文件
                        fileReader.readAsBinaryString(files[0]);

            });
                      $("#query_refund_data_17_btn").click(function (){

                         let value = $("#renfund_order_select_17").find("option:selected").val()
                         let address_value = $("#renfund_address_select_17").find("option:selected").val()
                         let  show_model_17 = $("#renfund_order_show_model_17").find("option:selected").val()

                          console.log("value",value)
                          console.log("address_value",address_value)
                          websqlapi_open_db()
                          websqlapi_query_tb_refund_order_data("",{"refund_address":address_value,"logistics_status":value,"show_model":show_model_17,"update_page":"备货页面","order_by":[ " logistics_update_time asc"]})
                     });

                      $(".query_has_send_data").click(function (){
                          let  tb_shop_select_17 = $("#tb_shop_select_17").find("option:selected").val()
                          let where_condition = "cmFlag != '4'"
                          if(tb_shop_select_17 !=="显示全部"){
                                where_condition = where_condition +" and sellerNick='"+tb_shop_select_17+"'"
                          }
                          websqlapi_open_db()
                          // websqlapi_query_tb_has_send_goods_table_data([],{"update_page":"备货页面","show_model":"单个商品退货率","goods_id":"736913524034","order_by":[ " send_time desc"],"where_condition":where_condition})
                          websqlapi_query_tb_has_send_goods_table_data([],{"update_page":"备货页面","show_model":"多商品退货率","order_by":[ " send_time desc"],"where_condition":where_condition})
                     });
                     $(".submit_refund_logistics_data").click(function () {
                            websqlapi_query_tb_refund_order_data("",{"submit_data":"提交售后物流信息","refund_address":"我仓地址","order_by":[ " logistics_update_time asc"]})
                     })
                      $(".all_return_order").click(function () {
                           let data_str  =  $($(".all_return_order")[0]).val()
                          console.log("data_str",data_str)
                          let all_data = JSON.parse(data_str)
                          console.log("all_data",all_data)
                          $(".data_div17_all_content").remove()
                          $(".data_div17_received_content").remove()
                          $(".has_logistics_log_content").remove()
                          let append_elems_str = apichuammei_return_refund_table(all_data)
                           $(".data_div17_top").after(append_elems_str)

                      })
                     $(".clean_all_data").click(function () {
                         $($(".all_return_order")[0]).attr('value','')
                         $($(".is_received_return_order")[0]).attr('value','')
                         $($(".has_logistics_log_return_order")[0]).attr('value','')
                          $(".data_div17_all_content").remove()
                          $(".data_div17_received_content").remove()
                          $(".has_logistics_log_content").remove()
                            websqlapi_drop_table("tb_refund_table")

                     })
                     $(".clean_has_send_table_data").click(function () {

                            websqlapi_drop_table("tb_has_send_goods_table")

                     })

                     $(".is_received_return_order").click(function () {
                           let data_str  =  $($(".is_received_return_order")[0]).val()

                          let received_data = JSON.parse(data_str)
                          console.log("received_data",received_data)
                          $(".data_div17_all_content").remove()
                          $(".data_div17_received_content").remove()
                          $(".has_logistics_log_content").remove()

                           let append_elems_str = apichuammei_return_refund_table(received_data)
                           $(".data_div17_top").after(append_elems_str)


                      })
                      $(".is_received_long_time_order").click(function () {
                           let data_str  =  $($(".is_received_long_time_order")[0]).val()

                          let is_received_long_time_list = JSON.parse(data_str)
                          console.log("received_data",is_received_long_time_list)
                          $(".data_div17_all_content").remove()
                          $(".data_div17_received_content").remove()
                          $(".data_div17_received_long_time_content").remove()
                          $(".has_logistics_log_content").remove()


                           let append_elems_str = apichuammei_is_recived_long_time_table(is_received_long_time_list)
                           $(".data_div17_top").after(append_elems_str)


                      })
                     $(".has_logistics_log_return_order").click(function () {
                           let data_str  =  $($(".has_logistics_log_return_order")[0]).val()

                          let logistics_log_data = JSON.parse(data_str)
                          console.log("has_logistics_log_return_order",logistics_log_data)
                          $(".data_div17_all_content").remove()
                          $(".data_div17_received_content").remove()
                          $(".has_logistics_log_content").remove()

                          let append_elems_str = apichuammei_return_refund_table(logistics_log_data)


                           $(".data_div17_top").after(append_elems_str)


                      })
                 }




             }
             $(".StockUpList").css("display",chuanmei_data_show)
             $(".data_div17").css("display",data_show_17)


         })
}

///传美售后数据更到页面
function apichuammei_save_update_page_data_refund_order(chuanmei_excel_data_list){
    let new_data_obj = apichuanmei_analysis_beihuo_data(chuanmei_excel_data_list)

    console.log("new_data_obj",new_data_obj)
   let all_data = new_data_obj["all_data"]
   let is_received_long_time_list = new_data_obj["is_recived_long_time_list"]
   let is_received_data = new_data_obj["is_received_data"]
   let has_logistics_log_data = new_data_obj["has_logistics_log_data"]
   let chuammei_refund_data = new_data_obj["chuammei_refund_data"]
   //传美售后订单数据缓存到插件
   chrome.storage.local.set({"chuanmei_refund_order_cache":chuammei_refund_data},function () {
      console.log("传美售后订单保存成功，",chuammei_refund_data)
      Toast("传美售后订单保存成功")



    })
   for(let key   in all_data){

       all_data[key]['color_size_list'] = mcommon_clcle_list_same_value_counts(all_data[key]["color_size_list"])
   }
   for(let key   in is_received_data){

       is_received_data[key]['color_size_list'] = mcommon_clcle_list_same_value_counts(is_received_data[key]["color_size_list"])
   }
   for(let key   in has_logistics_log_data){

       has_logistics_log_data[key]['color_size_list'] = mcommon_clcle_list_same_value_counts(has_logistics_log_data[key]["color_size_list"])
   }
   console.log("all_data:",all_data)
   console.log("is_received_data:",is_received_data)
   console.log("has_logistics_log_data:",has_logistics_log_data)
   console.log("is_received_long_time_order:",is_received_long_time_list)
   $(".all_return_order").attr("value",JSON.stringify(all_data))
   $(".is_received_return_order").attr("value",JSON.stringify(is_received_data))
   $(".is_received_long_time_order").attr("value",JSON.stringify(is_received_long_time_list))
   $(".has_logistics_log_return_order").attr("value",JSON.stringify(has_logistics_log_data))

    let append_elems_str = apichuammei_return_refund_table(all_data)
    $(".data_div17_all_content").remove()
    $(".data_div17_top").after(append_elems_str)

}

//数据填充到表格
function apichuammei_return_refund_table(all_data){
     let append_elems_str = '<div class="data_div17 data_div17_all_content">'
          for(let key in all_data){
              let sku_elems__str = ""
              let goods_item_sum = 0
              for(let i = 0;i<all_data[key]['color_size_list'].length;i++){
                    goods_item_sum = goods_item_sum + parseInt( all_data[key]['color_size_list'][i]['num'])
                    sku_elems__str = sku_elems__str +'' +
                        '<li style="border-bottom:1px solid black;border-left:1px solid black; color:#000000;text-align:center;">' +
                        ''+all_data[key]['color_size_list'][i]['name'] + ' ' +all_data[key]['color_size_list'][i]['num'] + '件'
                        '</li>'
              }
               let goods_img = "https://"+all_data[key]['img']
               append_elems_str = append_elems_str +'<li>' +
                    '<table style="border-bottom:1px solid black;border-left:1px solid black; color:#000000;text-align:center;font-family:宋体;font-size:12px;font-weight:normal;;height: 32px;word-break: break-word;position:relative;">'+
                       '<tr style="padding:1em;border-bottom:1px solid black;border-left:1px solid black; color:#000000;text-align:center;font-family:宋体;font-size:12px;font-weight:normal;;height: 32px;word-break: break-word;position:relative;">' +
                            '<td>'+key+'<img style="width: 5em;height: 5em; display: block"  src="'+goods_img+'"></td>'+
                            '<td>' +
                                sku_elems__str+
                            '</td>'+
                            '<td style="padding:1em;border-bottom:1px solid black;border-left:1px solid black; color:#000000;">   共'+goods_item_sum+'件</td>'+
                            '<td></td>'+
                       '</tr>'
                   '</table>'+
                '</li>'
          }


      append_elems_str = append_elems_str +'</div>'
    return append_elems_str
}
//传美备货页面统计退货率
function apichuammei_calculate_refund_percent(all_data_list){

      let goods_calculate_obj = {}
      let total_obj = {"has_refund_list":[],"no_refund_list":[]}

      for(let i = 0;i<all_data_list.length;i++){
          let curr_item = all_data_list[i]
          let goods_id = curr_item["goods_id"]

          if(goods_calculate_obj[goods_id] ===undefined ){
              let goods_item_demo = {"has_refund_list":[],"no_refund_list":[],"img_url":"","title":""}
              goods_calculate_obj[goods_id] = goods_item_demo
          }
          if(curr_item.refund_status == chuammei_goods_refund_status["NO_REFUND"] || curr_item.refund_status == chuammei_goods_refund_status["CLOSED"]){
               goods_calculate_obj[goods_id]['no_refund_list'].push(curr_item)

               total_obj['no_refund_list'].push(curr_item)
          }else{
              goods_calculate_obj[goods_id]['has_refund_list'].push(curr_item)
              total_obj['has_refund_list'].push(curr_item)
          }
            goods_calculate_obj[goods_id]['img_url'] = curr_item.img_url
            goods_calculate_obj[goods_id]['title'] = curr_item.title
      }

       let result =  {"goods_calculate_obj":goods_calculate_obj,"total_obj":total_obj}
         console.log("result",result)
         console.log("总退货率:",total_obj['has_refund_list'].length/(total_obj['has_refund_list'].length+total_obj['no_refund_list'].length))
       return result
}

//传美备货页面统计单个商品退货率
function apichuammei_calculate_one_goods_refund_percent(all_data_list){

      let goods_calculate_obj = {}
      let total_obj = {"has_refund_list":[],"no_refund_list":[]}

      for(let i = 0;i<all_data_list.length;i++){
          let curr_item = all_data_list[i]
          let send_time_day = curr_item["send_time"].split(" ")[0]

          if(goods_calculate_obj[send_time_day] ===undefined ){
              let goods_item_demo = {"has_refund_list":[],"no_refund_list":[],"img_url":"","title":""}
              goods_calculate_obj[send_time_day] = goods_item_demo
          }
          if(curr_item.refund_status === chuammei_goods_refund_status["NO_REFUND"] || curr_item.refund_status === chuammei_goods_refund_status["CLOSED"]){
               goods_calculate_obj[send_time_day]['no_refund_list'].push(curr_item)

               total_obj['no_refund_list'].push(curr_item)
          }else{
              goods_calculate_obj[send_time_day]['has_refund_list'].push(curr_item)
              total_obj['has_refund_list'].push(curr_item)
          }
            goods_calculate_obj[send_time_day]['img_url'] = curr_item.img_url
            goods_calculate_obj[send_time_day]['title'] = curr_item.title
      }

       let result =  {"goods_calculate_obj":goods_calculate_obj,"total_obj":total_obj}
         console.log("result",result)
         console.log("总退货率:",total_obj['has_refund_list'].length/(total_obj['has_refund_list'].length+total_obj['no_refund_list'].length))
       return result
}


//传美备货页商品统计退货率
function apichuammei_goods_refund_percent_model_model(all_data_obj){
            let data_obj = all_data_obj['goods_calculate_obj']

            console.log("data_objJ:",data_obj)
            let append_elems_str_content = ""
             let all_item_counts = 0
              let all_has_refund_counts = 0
              let all_no_refund_counts = 0
              for(let key in data_obj ){
                    console.log("")
                    let goods_img = data_obj[key]["img_url"]
                    let has_refund_count = data_obj[key]["has_refund_list"].length
                    let not_refund_count = data_obj[key]["no_refund_list"].length
                    let count = has_refund_count + not_refund_count
                    all_item_counts = all_item_counts +  has_refund_count +not_refund_count
                    all_has_refund_counts = all_has_refund_counts + has_refund_count
                    all_no_refund_counts = all_has_refund_counts + not_refund_count
                    let item_percent = (has_refund_count/count).toFixed(2) * 100
                    append_elems_str_content = append_elems_str_content +'<li>' +
                        ' <img src="'+goods_img+'" style="width: 3em; height: 3em"/>'+
                        ' <span class="refund_goods_id_show_17">'+key+'</span>  '+

                        has_refund_count +'/'+count+'='+item_percent +'% '+

                '</li> '
              }


              append_elems_str_content = append_elems_str_content +'</div>'
      let all_data_percent = (all_has_refund_counts/all_item_counts).toFixed(2) * 100
     let append_elems_str_head = '<div class="data_div17 data_div17_all_content" style="padding-bottom: 10em">  总计：'+ all_has_refund_counts +'/'+all_item_counts+'='+all_data_percent +"%"
    return append_elems_str_head + append_elems_str_content
}

//传美备货页面列表单个商品统计退货率
function apichuammei_one_goods_refund_percent_model(all_data_obj){
            let data_obj = all_data_obj['goods_calculate_obj']
            let goods_img = ""
            console.log("data_objJ:",data_obj)
            let append_elems_str_content = ""


              for(let key in data_obj ){
                    console.log("")
                    goods_img = data_obj[key]["img_url"]

                    let has_refund_count = data_obj[key]["has_refund_list"].length
                    let not_refund_count = data_obj[key]["no_refund_list"].length
                    let count = has_refund_count + not_refund_count
                    append_elems_str_content = append_elems_str_content +'<li>' +

                        key +'  '+
                        has_refund_count +'/'+count+'='+(has_refund_count/count).toFixed(2) +' '+

                '</li> '
              }


              append_elems_str_content = append_elems_str_content +'</div>'
     let append_elems_str_head = '<div class="data_div17 refund_goods_log_div_17" style=" overflow-y:scroll;padding:10px;background: #bbbbbb; position: absolute;display: block;left:0px ;top: 0px;width:30em;height: 25em;"><span class="single_goods_refund_percent_span_17">close</span> <img src="'+goods_img+'" style="width: 3em; height: 3em"/>'
    return append_elems_str_head + append_elems_str_content
}

//传美备货页面列表模式
function apichuammei_is_list_model(all_data_list){
     let append_elems_str = '<div class="data_div17 data_div17_all_content">'

              for(let i = 0;i<all_data_list.length;i++){

                    append_elems_str = append_elems_str +'<li style="float: left;">' +
                        '<img src="'+all_data_list[i]["img_url"]+'" style="width: 3em; height: 3em"/>'+
                        all_data_list[i]["goods_name"] +"  "+
                        all_data_list[i]["logistics_update_time"] +"  "+
                        all_data_list[i]["return_logistics_number"] +"  "+

                        // all_data_list[i]["return_logistics_info"].substring(0,30) +"  "+
                '</li> '
              }
               // let goods_img = "https://"+all_data[key]['img']




      append_elems_str = append_elems_str +'</div>'
    return append_elems_str
}
// 分析售后订单返回
function apichuammei_analysis_refund_order_list(data_list){
    console.log("refund_list",data_list)
    let return_obj = {}
    //根据标题保存图片
    let title_img_obj = {}
     //根据id保存图片
    let goods_id_img_obj = {}
    for(let i = 0; i < data_list.length;i++){
            for(let g=0;g<data_list[i]['refundOrderList'].length;g++){
                    let refund_goods_item =  data_list[i]['refundOrderList'][g]
                    title_img_obj[refund_goods_item['title']] = refund_goods_item['picPath']
                    goods_id_img_obj[refund_goods_item['numIID']] = refund_goods_item['picPath']
            }

    }
    return_obj["title_img_obj"] = title_img_obj
    return_obj["goods_id_img_obj"] = goods_id_img_obj
    return return_obj
}

//把传美售后订单保存到db
function apichuammei_save_refun_data_to_db(data_list){

    //     0: "店铺名"
// 1: "退款单ID"
// 2: "商品名称"
// 3: "商品编码"
// 4: "属性名称"
// 5: "属性编码"
// 6: "数量"
// 7: "发货单号"
// 8: "回退单号"
// 9: "退款标识"
// 10: "更新时间"
// 11: "订单号"
// 12: "退款金额"
// 13: "发货单号最新物流"
// 14: "回退单号最新物流"
// 15: "卖家备注"
// 16: "卖家旗帜"




    console.log("data_list111111",data_list)
    for(let i=0;i<data_list.length;i++){
        let item_data = data_list[i]
        // let save_data_item = [item_data[0],item_data[1],item_data[2],item_data[3],item_data[4],item_data[5],item_data[6],item_data[7],item_data[8],item_data[10],item_data[11],item_data[12],item_data[13],item_data[14],item_data[15],item_data[16],]
        let refund_item_obj = return_data_list(item_data)

        let temp_list = []
        temp_list.push(refund_item_obj)
        websqlapi_insert_tb_refund_order_data(temp_list,"chuammei")



    }


}
function apichuanmei_analysis_beihuo_data(data_list){
//     0: "店铺名"
// 1: "退款单ID"
// 2: "商品名称"
// 3: "商品编码"
// 4: "属性名称"
// 5: "属性编码"
// 6: "数量"
// 7: "发货单号"
// 8: "回退单号"
// 9: "退款标识"
// 10: "更新时间"
// 11: "订单号"
// 12: "退款金额"
// 13: "发货单号最新物流"
// 14: "回退单号最新物流"
// 15: "卖家备注"
// 16: "卖家旗帜"
    let all_obj={}
    //原始列表数据
    let all_orgin_list=[]
    // 已签收的列表  签收时间超时未处理
    let is_recived_long_time_list =[]
    // 已签收的
    let is_received_obj={}//标题做key
    let has_logistics_log_obj={}//标题做key
    let return_data={}//标题做key
    let chuammei_refund_data={}//淘宝订单号做key
    for(let i=0;i<data_list.length;i++){
        let item_data = data_list[i]

        let is_recived = apichuanmei_is_recieved(item_data["return_logistics_info"])//item_data[14]
        let new_item_data_obj = apichuammei_get_excel_refund_item_data(item_data)
        chuammei_refund_data[new_item_data_obj['order_number']] = new_item_data_obj


        if(all_obj[item_data['goods_name']]!==undefined && all_obj[item_data['goods_name']]!==""){
            all_obj[item_data['goods_name']]["color_size_list"].push(item_data['sku_name'])
            all_obj[item_data['goods_name']]["img"] = item_data['img_url']

        }else{

            let tem_color_list = [item_data['sku_name']]
            let tem_obj = {
                "color_size_list":tem_color_list,
                "img":item_data['img_url']
            }
            all_obj[item_data['goods_name']] = tem_obj
        }

        if(is_recived){
             console.log("已到货物流:",item_data['return_logistics_info'])

              is_recived_long_time_list.push(return_data_list(item_data))
            //已签收
            if(is_received_obj[item_data['goods_name']]!==undefined && is_received_obj[item_data['goods_name']]!==""){
                is_received_obj[item_data['goods_name']]["color_size_list"].push(item_data['sku_name'])

            }else{

                let tem_color_list = [item_data['sku_name']]
                let tem_obj = {
                "color_size_list":tem_color_list
            }
            is_received_obj[item_data['goods_name']] = tem_obj
            }
        }

        if(item_data['return_logistics_number']!==undefined && item_data['return_logistics_number']!==""){
            //已签收
            if(has_logistics_log_obj[item_data['goods_name']]!== undefined && has_logistics_log_obj[item_data['goods_name']]!==""){
                has_logistics_log_obj[item_data['goods_name']]["color_size_list"].push(item_data['sku_name'])
            }else{

                let tem_color_list = [item_data['sku_name']]
                let tem_obj = {
                "color_size_list":tem_color_list
            }
            has_logistics_log_obj[item_data['goods_name']] = tem_obj
            }
        }

    }
    is_recived_long_time_list.sort(function(a,b){return a.return_logistic_update_time-b.return_logistic_update_time});
    return_data['all_data'] = all_obj
    return_data['is_received_data'] = is_received_obj
    return_data['has_logistics_log_data'] = has_logistics_log_obj
    return_data['chuammei_refund_data'] = chuammei_refund_data
    return_data['is_recived_long_time_list'] = is_recived_long_time_list
    return return_data


}
// 传媒售后
    function return_data_list(return_data){
        //     0: "店铺名"
// 1: "退款单ID"
// 2: "商品名称"
// 3: "商品编码"
// 4: "属性名称"
// 5: "属性编码"
// 6: "数量"
// 7: "发货单号"
// 8: "回退单号"
// 9: "退款标识"
// 10: "更新时间"
// 11: "订单号"
// 12: "退款金额"
// 13: "发货单号最新物流"
// 14: "回退单号最新物流"
// 15: "卖家备注"
// 16: "卖家旗帜"
        let shop_name = return_data[0]
        let refund_order_id = return_data[1]
        let goods_name = return_data[2]
        let goods_code = return_data[3]
        let sku_name = return_data[4]
        let sku_code = return_data[5]
        let goods_counts = return_data[6]
        let send_logistics_number = return_data[7]
        let return_logistics_number = return_data[8]
        let refund_flag = return_data[9]
        let logistics_update_time = return_data[10]
        let order_number = return_data[11]
        let send_logistics_info = return_data[13]
        let return_logistics_info = return_data[14]
        let seller_memo = return_data[15]
        let seller_flag = return_data[16]
         let return_obj = {
            "refund_flag":refund_flag,
            "refund_order_id":refund_order_id,
            "goods_counts":goods_counts,
            "shop_name":shop_name,
            "goods_name":goods_name,
            "goods_code":goods_code,
            "sku_name":sku_name,
            "sku_code":sku_code,
            "send_logistics_number":send_logistics_number,
            "return_logistics_number":return_logistics_number,
            "logistics_update_time":logistics_update_time,
            "order_number":order_number,
            "send_logistics_info":send_logistics_info,
            "return_logistics_info":return_logistics_info,
            "seller_memo":seller_memo,
            "seller_flag":seller_flag,
         }


        return return_obj
    }
//传美导出的售后订单数据
function apichuammei_get_excel_refund_item_data(item_list){
    let new_item_obj = {}
    new_item_obj['seller_wangwang_id'] = item_list['seller_wangwang_id_tb']//item_list[0]
    new_item_obj['refund_order_number'] = item_list['refund_order_id']//item_list[1]
    new_item_obj['goods_name'] = item_list['goods_name']//item_list[2]
    new_item_obj['goods_code'] = item_list['goods_code']//item_list[3]
    new_item_obj['sku_name'] = item_list['sku_name']//item_list[4]
    new_item_obj['sku_code'] = item_list['sku_code']//item_list[5]
// 2: "商品名称"
// 3: "商品编码"
// 4: "属性名称"
    new_item_obj['send_logistic_number'] = item_list['send_logistics_number']//item_list[7]
    new_item_obj['return_logistic_number'] =item_list['return_logistics_number'] //item_list[8]
     new_item_obj['return_logistic_update_time'] = item_list['logistics_update_time']//item_list[10]
     new_item_obj['order_number'] = item_list['order_number']//item_list[11]
    new_item_obj['send_logistic_info'] = item_list['send_logistics_info']//item_list[13]
    new_item_obj['return_logistic_info'] = item_list['return_logistics_info']//item_list[14]
    new_item_obj['seller_remarks'] = item_list['seller_memo']//item_list[15]
    new_item_obj['taobao_flag'] = item_list['seller_flag']//item_list[16]
    new_item_obj['seller_phone_tb'] = item_list['seller_phone_tb']
    new_item_obj['seller_mobile_tb'] = item_list['seller_mobile_tb']
    new_item_obj['seller_wangwang_id_tb'] = item_list['seller_wangwang_id_tb']
    new_item_obj['img_url'] = item_list['img_url']
    return new_item_obj
}


//淘宝导出的售后订单数据
function apichuammei_get_excel_refund_taobao_item_data(item_list){
    //0订单编号	1退款编号	2支付宝交易号	3订单付款时间	4商品编码	5退款完结时间	6买家实际支付金额	7宝贝标题	8买家退款金额	9手工退款/系统退款	10是否需要退货	11退款的申请时间	12超时时间	13退款状态	14货物状态	15退货物流信息	16发货物流信息	17客服介入状态	18卖家真实姓名 19卖家真实姓名新	20卖家退货地址	21卖家邮编	22卖家电话	23卖家手机	24退货物流单号	25退货物流公司	26买家退款原因	27买家退款说明	28买家退货时间	29责任方	30售中或售后	31商家备注	32完结时间	33部分退款/全部退款	34审核操作人	35举证超时	36是否零秒响应	37退款操作人	38退款原因标签	39业务类型	40是否帮他退款	41帮他退款操作账号

    let return_data = {}
    let return_data_obj = {}
    let return_data_list = []
    for(let i= 0;i<item_list.length;i++){
        let new_item_obj = {}
        new_item_obj['order_number_tb'] = item_list[i][0]
        new_item_obj['refund_order_number_tb'] = item_list[i][1]



        new_item_obj['return_logistic_number_tb'] = item_list[i][24]

        new_item_obj['seller_wangwang_id_tb'] = item_list[i][18]
        new_item_obj['refund_address_tb'] = item_list[i][20]
        new_item_obj['seller_phone_tb'] = item_list[i][22]
        new_item_obj['seller_mobile_tb'] = item_list[i][23]
        new_item_obj['return_logistics_name'] = item_list[i][25]
        return_data_obj[new_item_obj['order_number_tb']] = new_item_obj
        return_data_list.push(new_item_obj)
    }
    return_data["return_data_obj"] = return_data_obj
    return_data["return_data_list"] = return_data_list
    return return_data
}


//判断是否已经签收的包裹订单
function apichuanmei_is_recieved(return_logistic_str){
    // console.log("return_logistic_str:",return_logistic_str)
    //根据物流判断是否签收
    let keys_list = [
        '送达',
        '已签收',
        '代收',
        '签收',
        '暂存',
        '驿站',
        '取件地址',
        // '派件中',
        // '派送中',
        // '正在派件',
        // '正在为您派件',
        // '正在为您派送',
        // '到达,兴宁',
    ]
    if(return_logistic_str === undefined || return_logistic_str===""){
        return false
    }
    for(let i = 0 ;i<keys_list.length;i++){
        let keys_arry = keys_list[i].split(",")

        let is_item_true = true
        for(let k = 0;k<keys_arry.length;k++){
            if(return_logistic_str.indexOf(keys_arry[k]) === -1){

               is_item_true = false
                break
        }

        }
        if(is_item_true){
            return is_item_true
        }


    }

 return false
}
// 跳转页面获取
function apichuanmei_dump_page(dum_page,page_size,total_page,start_time,end_time){
             // let dum_page =    $("#dump_page_input17")[0].value

             if(dum_page!==undefined && dum_page!=='' && dum_page!==0 && (!isNaN(dum_page)) && (dum_page < (total_page  + 1))){
                 console.log("开始访问"+dum_page+"数据，总共："+total_page+"页")

               let result_data = apichuanmei_get_order(start_time,end_time,dum_page,page_size)
                 console.log("第"+dum_page+"数据：",result_data)
              apichuammei_save_page_data(result_data['list'],dum_page)

            }else {
                 Toast("页数错误")
                 return
             }
}
// 保存已发货页面的数据到缓存
function apichuammei_save_has_send_order_page_data(result_data,dum_page){
                console.log("一页数据：",result_data)
                let all_goods_list = []


                for(let j = 0;j < result_data.length;j++){


                    let order_item_list = result_data[j]


                    for(let o = 0;o<order_item_list.length;o++){
                        let return_obj =  apichuanmei_has_send_order_item_replace(order_item_list[o])

                        let goods_list =  return_obj["goods_list"]
                        all_goods_list  = all_goods_list.concat(goods_list)
                    }

                }
                console.log("has_send_goods:",all_goods_list)

                apichuanmei_save_has_send_goods(all_goods_list)

}

// 保存一个页面的数据到缓存
function apichuammei_save_page_data(result_data,dum_page){
                console.log("一页数据：",result_data)
                let all_goods_list = []
                let order_data = {}
                let order_data_list = []

                for(let j = 0;j < result_data.length;j++){

                    //同个用户同地址多订单
                    let order_item_list = result_data[j]
                    let tem_order_data_list = []
                    let mul_order_tb_order_number_str = "【多订单"
                    for(let o = 0;o<order_item_list.length;o++){
                        let return_obj =  apichuanmei_order_item_replace(order_item_list[o])
                        let new_order_obj =  return_obj["new_order_obj"]
                        let item_goods_list =  return_obj["item_goods_list"]
                        all_goods_list  = all_goods_list.concat(item_goods_list)

                        let tb_order_number = new_order_obj['tb_order_number']
                        order_data[tb_order_number] = new_order_obj
                        if(order_item_list.length > 1){
                             // 合并订单
                            new_order_obj['merge_order']  = order_item_list.length + "-" + (o+1)
                            mul_order_tb_order_number_str = mul_order_tb_order_number_str+"-"+tb_order_number
                        }

                        tem_order_data_list.push(new_order_obj)
                    }
                    mul_order_tb_order_number_str  = mul_order_tb_order_number_str +"】"
                    if(tem_order_data_list.length > 1){
                        //同地址订单进行备注
                            for(let k = 0;k<tem_order_data_list.length;k++){
                                tem_order_data_list[k]["remarks_text"]=mul_order_tb_order_number_str
                            }
                        }
                    order_data_list = order_data_list.concat(tem_order_data_list)
                    // order_list.push(new_order_obj)
                }
                apichuanmei_save_goods_title_change_record(all_goods_list)

                //实时页面数据缓存
                 chrome.storage.local.set({"chuanmei_curr_page_order_list_cache":order_data_list},function () {
                     console.log("实时页面数据缓存保存成功，",order_data_list)
                     Toast("缓存成功")
                     apichuammei_curr_page_ui_update(dum_page)
                     //***********************************************
                //      chrome.storage.local.get({"chuanmei_curr_page_order_list_cache":{}},function (local_data) {
                //     $(".item_data_div17").remove()
                //
                //
                //  let wait_send_list = local_data["chuanmei_curr_page_order_list_cache"]
                //  console.log("读取本地储存记录,",wait_send_list)
                //  for(let i = 0 ;i<wait_send_list.length;i++){
                //       let chuammei_flag = wait_send_list[i]["cmFlag"]
                //       let seller_remarks = wait_send_list[i]["seller_remarks"]
                //       let chuammei_flag_label = "<label class='chuammei_flag_label' > 传美旗帜："+wait_send_list[i]['cmFlag']+" </label>"
                //       let seller_remarks_label = "<label class='chuammei_flag_label' >   </label>"
                //       if(chuammei_flag===1){
                //             chuammei_flag_label = "<label class='chuammei_flag_label'  style='color:red;background: yellow'> 传美旗帜："+wait_send_list[i]['cmFlag']+" </label>"
                //       }
                //       if(seller_remarks!==undefined && seller_remarks.trim() !==""){
                //             seller_remarks_label = "<label class='chuammei_flag_label' style='color:white;background: red' > 卖家留言："+wait_send_list[i]['seller_remarks']+"  </label>"
                //       }
                //       let merge_order = ""
                //       if(wait_send_list[i]["merge_order"] !== undefined){
                //           merge_order  =  '                   <label>'+wait_send_list[i]["merge_order"]+'</label> \n'
                //       }
                //       let append_elems_str  =
                //        '<div class="item_data_div17" style="margin-bottom: 0.5em">\n' +
                //
                //          '              <li style="margin-bottom: 1em">\n' +
                //          '                <div style=" background: #79d7fa;padding: 1em;">\n' +
                //          '                  <input style="width: 2em;height: 2em" class="check_box_17" type="checkbox"/>\n' +
                //           merge_order +
                //          '                  <label>[买]：</label><label>'+wait_send_list[i]["buyer_nick"]+'</label><label> [卖]：</label><label class="seller_wang_wang_id_17">'+wait_send_list[i]["sellerNick"]+'</label> '+seller_remarks_label + chuammei_flag_label+'<label> 订单编号：</label> <label class="tb_order_number_lb_17">'+wait_send_list[i]["tb_order_number"]+'</label><label> 地址：</label><label>'+wait_send_list[i]["name"]+','+wait_send_list[i]["phone"]+','+wait_send_list[i]["province"]+','+wait_send_list[i]["city"]+','+wait_send_list[i]["area"]+','+wait_send_list[i]["address"]+'</label>\n' +
                //          '                </div>\n' +
                //          '                <div  >'
                //
                //
                //           let goods_list = wait_send_list[i]['order_goods']
                //           for(let g = 0;g<goods_list.length;g++){
                //                let goods_refund_tip =  ""
                //                if(goods_list[g]["refund_status"] !== "无退款"){
                //                    goods_refund_tip = "background:#b83400"
                //                }
                //                let goods_str =
                //                  '  <div style="background: white;padding-left: 2em">\n' +
                //                  '    <img style="width: 5em;height: 5em;" src="https:'+goods_list[g]["goods_pic"]+'">\n' +
                //                      '    <label style="margin-left: 1em">'+goods_list[g]["goods_id"]+' <label>\n' +
                //                  '    <label>商家编码：</label><label style="margin-left: 1em">'+goods_list[g]["code"]+'<label>\n' +
                //                  '    <label style="'+goods_refund_tip+'">'+goods_list[g]["refund_status"]+'</label>'+
                //                  '    <label style="color:red;">'+goods_list[g]["status"]+'</label><label>  颜色尺码：</label><label>'+goods_list[g]["color"]+'</label><label>'+goods_list[g]["size"]+'</label><label> x'+goods_list[g]["goods_counts"]+'件</label>\n' +
                //                  '</div>\n'
                //             append_elems_str = append_elems_str +goods_str
                //           }
                //            append_elems_str = append_elems_str+
                //            '  <label>'+wait_send_list[i]["pay_time"]+'</label> <label style="color: red"> 总价'+wait_send_list[i]["payFee"]+'元</label>\n'+
                //          '   </div>\n' +
                //          '  </li>\n' +
                //          ' </div> '
                //
                //        $(".data_div17").append(append_elems_str)
                //  }
                //  // append_elems_str = append_elems_str + "</div>"
                //  // $(".WaitPrintListHeight").after(append_elems_str)
                //  if(dum_page!==undefined){
                //       $("#dump_page_input17").val(dum_page)
                //  }
                //
                //   apichuammei_wait_send_page_init()
                //   update_chuammei_wait_send_page_data()
                //
                // })
                     //***********************************************

                    })
}

// 页面列表数据更新
function apichuammei_curr_page_ui_update(dum_page){

               chrome.storage.local.get({"chuanmei_curr_page_order_list_cache":{}},function (local_data) {
                 $(".item_data_div17").remove()

                 let wait_send_list = local_data["chuanmei_curr_page_order_list_cache"]
                 console.log("读取本地储存记录,",wait_send_list)
                 for(let i = 0 ;i<wait_send_list.length;i++){
                      let chuammei_flag = wait_send_list[i]["cmFlag"]
                      let seller_flag = wait_send_list[i]["sellerFlag"]
                      let chuammei_buyer_cuicu = wait_send_list[i]["obTag"]
                      let seller_remarks = wait_send_list[i]["seller_remarks"]
                      let cm_flag_label = ""
                      let tb_flag_label = "<label class='tb_flag_label' > 淘宝旗帜："+seller_flag+" </label>"
                      let buyer_cuicu = ""
                      let seller_remarks_label = "<label class='tb_flag_label seller_remarks_17' >   </label>"
                      if(chuammei_flag !=='0' && chuammei_flag !== 0){
                          cm_flag_label = "<label class='cm_flag_label'  style='color:black;background: red' > 传美旗帜："+chuammei_flag+" </label>"
                      }
                      if(seller_flag===5){
                            tb_flag_label = "<label class='tb_flag_label'  style='color:red;background: yellow'> 淘宝旗帜："+seller_flag+" </label>"
                      }
                      if(chuammei_buyer_cuicu==='lg'){
                            buyer_cuicu = "<label  style='color: red' > 催 </label>"
                      }
                      if(seller_remarks!==undefined && seller_remarks.trim() !==""){
                            seller_remarks_label = "<label style='color:white;background: red'> 卖家留言：</label><label class='tb_flag_label seller_remarks_17' style='color:white;background: red' >"+wait_send_list[i]['seller_remarks']+"  </label>"
                      }
                      let merge_order = ""
                      if(wait_send_list[i]["merge_order"] !== undefined){
                          merge_order  =  '                   <label>'+wait_send_list[i]["merge_order"]+'</label> \n'
                      }
                      let append_elems_str  =
                       '<div class="item_data_div17" style="margin-bottom: 0.5em">\n' +

                         '              <li style="margin-bottom: 1em">\n' +
                         '                <div style=" background: #79d7fa;padding: 1em;">\n' +
                         buyer_cuicu +
                         '                  <input style="width: 2em;height: 2em" class="check_box_17" type="checkbox"/>\n' +
                          merge_order +
                         '                  <label>[买]：</label><label>'+wait_send_list[i]["buyer_nick"]+'</label><label> [卖]：</label><label class="seller_wang_wang_id_17">'+wait_send_list[i]["sellerNick"]+'</label> '+seller_remarks_label +cm_flag_label+ tb_flag_label+'<label> 订单编号：</label> <label class="tb_order_number_lb_17">'+wait_send_list[i]["tb_order_number"]+'</label><label> 地址：</label><label>'+wait_send_list[i]["name"]+','+wait_send_list[i]["phone"]+','+wait_send_list[i]["province"]+','+wait_send_list[i]["city"]+','+wait_send_list[i]["area"]+','+wait_send_list[i]["address"]+'</label>\n' +
                         '                </div>\n' +
                         '                <div  >'


                          let goods_list = wait_send_list[i]['order_goods']
                          for(let g = 0;g<goods_list.length;g++){
                               let goods_refund_tip =  ""
                               if(goods_list[g]["refund_status"] !== "无退款"){
                                   goods_refund_tip = "background:#b83400"
                               }

                               let goods_str =
                                 '  <div style="background: white;padding-left: 2em">\n' +
                                 '    <img style="width: 5em;height: 5em;" src="https:'+goods_list[g]["goods_pic"]+'">\n' +
                                    '        <label class="show_goods_lb_17" style="background: #0b97c4">show </label> \n' +
                                     '    <label class="goods_id_lb" style="margin-left: 1em">'+goods_list[g]["goods_id"]+' </label>\n' +
                                     '    <label  class="goods_title_lb" style="margin-left: 1em;display: none">'+goods_list[g]["title"]+' </label>\n' +

                                 '    <label>商家编码：</label><label style="margin-left: 1em">'+goods_list[g]["code"]+'</label>\n' +
                                 '    <label style="'+goods_refund_tip+'">'+goods_list[g]["refund_status"]+'</label>'+
                                 '    <label style="color:red;">'+goods_list[g]["status"]+'</label><label>  颜色尺码：</label><label class="goods_color_lb">'+goods_list[g]["color"]+'</label><label class="goods_size_lb">'+goods_list[g]["size"]+'</label><label> x'+goods_list[g]["goods_counts"]+'件</label>       <label class="show_goods_sku_lb_17" style="background: #0b97c4">show </label>    \n' +
                                 '</div>\n'
                            append_elems_str = append_elems_str +goods_str
                          }

                           append_elems_str = append_elems_str+
                           '  <label>'+wait_send_list[i]["pay_time"]+'</label> <label style="color: red"> 总价'+wait_send_list[i]["payFee"]+'元</label>\n'+
                         '   </div>\n' +
                         '  </li>\n' +
                         ' </div> '

                       $(".data_div17").append(append_elems_str)
                 }
                 // append_elems_str = append_elems_str + "</div>"
                 // $(".WaitPrintListHeight").after(append_elems_str)
                 if(dum_page!==undefined){
                      $("#dump_page_input17").val(dum_page)
                 }

                  apichuammei_wait_send_page_init()
                  update_chuammei_wait_send_page_data()

                })
}

function show_goods_refund(elem,params){
 console.log("this:",elem)
}

// 获取售后订单
 function apichuammei_get_refund_order_list(submit_data){
    let url = CHUAMMEI_BASE_URL + "/app/refund/list.do"
      let return_result = {
        success:false,
        message:"",
    }
     $.ajax({
                async: false,
                url: url,
                type: "POST",
                // dataType : 'json',
                data: submit_data,
                contentType:"application/x-www-form-urlencoded",
                timeout: 5000,
                success: function (result) {

                console.log(" 获取售后订单结果:",result)

                return_result['success'] =result.success
                return_result['message'] =result.message
                return_result['refund_list'] = result.data.refundList





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
//单个插旗
function apichuanmei_add_tag_tb(tb_seller_wangwangid,tb_order_number,cmflag,memo,flag,from){
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
         shopTid: '{"tid":"'+tb_order_number+'","name":"'+tb_seller_wangwangid+'"}',
         from: from,
         flag: flag,
         cmFlag:cmflag,
         memo:memo,
         isFxFlag: 1
     }
     let url = CHUAMMEI_BASE_URL+"/tradeMulti/editMemo.do"
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
     let url = CHUAMMEI_BASE_URL+"/tradeMulti/batchUpdateFlag.do"
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

//本地缓存数据附加数据到传美售后页面
function apichuammei_add_local_refund_info_to_chuanmei_refund_page(){

        let table_17 = $('.order_info_table_17')

        //
        let order_number_div = $("div[class='RefundOrderBox']")
        // table_17.remove()
        console.log("本地缓存数据附加数据到传美售后页面..............")
        chrome.storage.local.get({"chuanmei_refund_order_cache":{}},function (local_data_obj) {

                    let local_cache_data  = local_data_obj["chuanmei_refund_order_cache"]
                    console.log("chuanmei_refund_order_cache缓存，",local_cache_data)
                    $(".local_refund_info_17").remove()
                    for(let i = 0; i<order_number_div.length;i++){
                        let item_div = order_number_div[i]
                        let order_number_span = $(item_div).find("span:contains('[复制]')")[0]
                        let tb_order_number = $(order_number_span).attr('data-clipboard-text')
                        let order = local_cache_data[tb_order_number]



                        let newget = null;

                        if(order!==undefined && order!== null){
                                let back_color = "ffff99"

                                let goods_status_span = ""
                                let table_calss_item_17 = "local_refund_info_17"

                                let returna_address = order.seller_phone_tb+order.seller_mobile_tb +""
                                let address_back_ground_color = ""

                                if(returna_address.indexOf("020")!==-1){
                                    address_back_ground_color = "background: #01AAED"
                                }
                                newget = '<table class = "'+table_calss_item_17+'" width="100%"><tr bgcolor='+back_color+'><td height="30" align="center"> ';
                                newget += '<span style="margin-right: 40px; '+address_back_ground_color+'" class="return_address_17"> 退货地址：'+returna_address+'</span>';
                                newget += '<span style="margin-right: 40px;"> 发货单号：'+order.send_logistic_number+'</span>';
                                newget += '<span style="margin-right: 40px;" value="'+order.return_logistic_number+'" class="return_logistic_number_17"> 退货单号：'+order.return_logistic_number+'</span>';
                                newget += '<span style="margin-right: 40px;" value="'+order.refund_order_number+'" class="refund_order_number_17"></span>';
                                newget += '<span style="margin-right: 40px;"> 退货物流信息：'+order.return_logistic_info+'</span>';
                                newget += goods_status_span


                                // newget += '<span>拿货情况：'+d.over_taking+'/'+d.pro_count+'</span>';
                                newget += '</td></tr></table>';
                                $(item_div).append(newget);
                            }

     }

         })



}

function apichuanmei_start_listen_jin_tuikuan(){
    //开始或暂停监听仅退款订单


     chrome.storage.local.get({"chuanmei_listen_jin_tuikuan":{}},function (local_data_obj) {
                            console.log("chuanmei_listen_jin_tuikuan get成功1，",local_data_obj["chuanmei_listen_jin_tuikuan"])
                             let chuanmei_listen_jin_tuikuan  = local_data_obj["chuanmei_listen_jin_tuikuan"]
                             let listen_is_run  = chuanmei_listen_jin_tuikuan["chuanmei_listen_is_run"]

                             if(listen_is_run === undefined || listen_is_run === false){
                                  listen_is_run = true
                             }else{
                                  listen_is_run = false
                             }
                            chuanmei_listen_jin_tuikuan["chuanmei_listen_is_run"] = listen_is_run
                            Toast("开启：",listen_is_run)
    chrome.storage.local.set({"chuanmei_listen_jin_tuikuan":chuanmei_listen_jin_tuikuan},function () {

                                    console.log("chuanmei_listen_jin_tuikuan，保存成功，",chuanmei_listen_jin_tuikuan)
                                    apichuammei_auto_click_tuikuan_btn(0)

                                })
                        })

}

 function apichuammei_auto_click_tuikuan_btn(time_out){
    // 监听仅退款自动点击查询

      chrome.storage.local.get({"chuanmei_listen_jin_tuikuan":{}},function (local_data_obj) {
                              let chuanmei_listen_jin_tuikuan  = local_data_obj["chuanmei_listen_jin_tuikuan"]
                              let listen_is_run  = chuanmei_listen_jin_tuikuan["chuanmei_listen_is_run"]
                                console.log("apichuammei_auto_click_tuikuan_btn。。。。。。")
                                console.log("apichuammei_auto_click_tuikuan_btn",chuanmei_listen_jin_tuikuan)
                               if(listen_is_run === true){

                                   let cur_time = dateFtt("yyyy-MM-dd hh:mm:ss",new Date())
                                   console.log("执行退款扫描----",cur_time)
                                   setTimeout(function (){
                                         $("span:contains('查询(回车)')").click()
                                         apichuanmei_media_tip_jin_tuikuan_order()
                                         apichuammei_auto_click_tuikuan_btn(300000)
                                   },time_out)

                               }
      })
}
function apichuanmei_media_tip_jin_tuikuan_order(){

      chrome.storage.local.get({"chuanmei_listen_jin_tuikuan":{}},function (local_data_obj) {
                              let chuanmei_listen_jin_tuikuan  = local_data_obj["chuanmei_listen_jin_tuikuan"]
                              let listen_is_run  = chuanmei_listen_jin_tuikuan["chuanmei_listen_is_run"]
                                console.log("apichuanmei_media_tip_jin_tuikuan_order。。。。。。")
                                console.log("apichuanmei_media_tip_jin_tuikuan_order",chuanmei_listen_jin_tuikuan)
                               if(listen_is_run !== true){return }
            chrome.storage.local.get({"chuanmei_media_warnning_order_cache":{}},function (local_data_obj) {
                               console.log("忽略语音提醒订单get成功1，",local_data_obj["chuanmei_media_warnning_order_cache"])
                               let local_cache_data  = local_data_obj["chuanmei_media_warnning_order_cache"]

                               setTimeout(function (){
                                 let is_play = false
                                 $(".ingore_media_warning").each(function (){
                                    let order_number = $(this).val()
                                    console.log("order_number",order_number)
                                    let find_order  = local_cache_data[order_number]
                                    console.log("find_order",find_order)
                                     if(find_order == undefined){
                                         is_play = true

                                     }
                                     if(is_play){
                                         $("#myAudio")[0].pause()
                                         $("#myAudio")[0].play();
                                         console.log("播放完毕")
                                     }
                                })
                             },4000)

                        })
      })



}

// 提交售后物流信息到服务器
function apichuanmei_submit_logistic(data_list){
    let submit_list = []
    for(let i=0;i<data_list.length;i++){
        let item_obj = data_list[i];
        let seller_mobile_tb = item_obj['seller_mobile_tb']
        if(seller_mobile_tb !=="18719368068"){
            continue
        }

        let new_item = {};
        new_item["data_source"] = "淘宝售后"
        new_item["account"] = item_obj['shop_name']

        new_item["return_logistics_name"] = item_obj['return_logistics_name']
        new_item["return_logistics_number"] = item_obj['return_logistics_number']
        new_item["logistics_info"] = item_obj['return_logistics_info']
        new_item["logistics_status_type_desc"] = "未知"

        let is_recieved =  apichuanmei_is_recieved(item_obj['return_logistics_info'])
        if(is_recieved === true){
            new_item["logistics_status_type_desc"] = "已送达"
        }
        submit_list.push(new_item)
    }
    console.log("submit_list->",submit_list)
        let  params = {
        "submit_list":submit_list
    }
   chrome.runtime.sendMessage({method:'submit_return_package_data_to_17' ,"params":JSON.stringify(params)},function(response) {


            console.log(response)
        });
}
// 传美待发货上面记录页面
function apichuanmei_show_refund_goods_log_dailog(goods_log_list,click_button){
console.log("click_button:",click_button)
    let m_postion = $(click_button).offset();
    console.log("m_postion:",m_postion)
    let parent_height = $(click_button).parent().height()
    let goods_list_data = goods_log_list

    let div_str  = " <div class='refund_goods_log_div_17' style='padding:10px;background: #bbbbbb; position: absolute;display: block;left:0px ;top: 0px'>" +
        "<svg id='barcodeContainer' style='display: none' ></svg>"+
     "<span class='close_refund_goods_log_div_17' style='display: block'>close</span>"
        for(let i=0;i<goods_list_data.length;i++){
            div_str = div_str+
            "<li style='display: block'>"+
                "<img style='width: 3em; height: 3em' src='"+goods_list_data[i]["img_url"]+"'>" +
                "<label>"+goods_list_data[i]["sku_name"]+"</label>  "+
                "<label class='return_logistics_number_dialog_17'>"+goods_list_data[i]["return_logistics_number"]+"</label>  "+

                "<label>"+goods_list_data[i]["logistics_update_time"]+"</label>  "+
                "<label class='query_logistics_dialog_17'>查询物流</label>  "+

            " </li>"

        }

        "</div>"
    $(".refund_goods_log_div_17").remove()

    $(".data_div17").append(div_str)
     $(".refund_goods_log_div_17").offset(m_postion)
    $(".close_refund_goods_log_div_17").click(function () {
        $(".refund_goods_log_div_17").remove()
    })
    $(".query_logistics_dialog_17").click(function () {

        let logistics_number_lb =   $(this).parent().find(".return_logistics_number_dialog_17")
        console.log("logistics_number_lb",logistics_number_lb)
        let logistics_number  = $( $(this).parent().find(".return_logistics_number_dialog_17")[0]).text().trim()
        let params = {"logistics_number":logistics_number}
         $(".kuaid100_last_message_show").remove()
         $("#barcodeContainer").remove()
         // $(".kuaid100_last_message_show").barcode("1234567890128", "ean13");


        chrome.runtime.sendMessage({method:'get_kuaid100_logistics' ,"params":JSON.stringify(params)},function(response) {


            console.log(response)
        });
    })

}


//查询已发货订单
function apichuammei_query_sended_order(seller_wangwang_id,tb_order_number,start_time,end_time){

    let return_result = {}
    let params = {
        multiShops: seller_wangwang_id,
        itemKinds: -1,
        itemNums: -1,
        noExpress: -1,
        hasinvoice: -1,
        ex: -1,
        tradeType: 1,
        province: 0,
        params1: 0,
        params4: -1,
        value1:"",
        value1_1:"" ,
        value1_2:"",
        value4: "",
        receiver_name: "",
        tradeComeFrom: "",
        express_order_id: "",
        buyer_nick: "",
        tid: tb_order_number,
        receiver_mobile: "",
        message_memo: "",
        hasisSendprint: -1,
        islogistics: -1,
        sendTradeStatus: -1,
        sellerFlag: -1,
        hasLy: -1,
        hasBz: -1,
        starttime: start_time,
        endtime: end_time,
        totalFee1: "",
        totalFee2:"",
        receiver_city: "",
        hasPrint: -1,
        seltime: 2,
        hasTui: -1,
        cmFlag: 0,
        islock: 0,
        addressId: 0,
        pageNo: 1,
        pageSize: 20,
        subSellerFlag:"",
    }

    let url = CHUAMMEI_BASE_URL+"/printMulti/searchHassendMulti.do"
    $.ajax({
                async: false,
                url: url,
                type: "POST",
                // dataType : 'json',
                data: params,
                contentType:"application/x-www-form-urlencoded",
                timeout: 5000,
                success: function (result) {

                console.log(" 传美查询 已发货订单结果:",JSON.stringify(result))

                return_result['success'] =result.success
                return_result['message'] =result.message
                return_result['result'] =result





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




window.addEventListener("message",e=>{
    // {"responseText":this.responseText,"url":this._url},"*"

    if(e.data.url !==undefined && e.data.url.indexOf('printMulti/searchMulti.do')!==-1 ){
        console.log("传美js接收到消息",e.data.responseText)
         websqlapi_open_db()
         websqlapi_init_tb_goods_title_update_table()
         apichuammei_save_page_data(JSON.parse(e.data.responseText).data.listhb)
        if(main_is_return() === false){
            setTimeout(function () {
                apichuammei_wait_send_tab_init()
            },2000)

        }
        return
    }
  if(e.data.url !==undefined && e.data.url.indexOf('printMulti/searchHassendMulti.do')!==-1 ){
        console.log("传美js接收到消息",JSON.parse(e.data.responseText))


       apichuammei_save_has_send_order_page_data(JSON.parse(e.data.responseText).data.listhb)

        return
    }
    if(e.data.url !==undefined && e.data.url.indexOf('app/refund/scanList.do')!==-1 ){
        console.log("传美js接收到消息",e.data.responseText)
        let list_data = JSON.parse(e.data.responseText).data.refundList
        console.log("list_data",list_data)
        for(let i = 0; i<list_data.length;i++){
            let sellerFlag = 3 //淘宝官方旗帜
            let tb_order_number = list_data[i]["tid"]
            let tb_seller_wangwangid = list_data[i]["sellerNick"]
            //淘宝的备注
            let sellerMemo = list_data[i]["sellerMemo"]
            console.log("order_number:",tb_order_number)
            console.log("sellerMemo:",sellerMemo)
            if(sellerMemo!=="" && (sellerMemo.indexOf("质量问题")!==-1 || sellerMemo.indexOf("jjjj")!==-1)){
                 Toast("质量问题")
                 alert("质量问题")
                 return
            }
            let result_ = apichuanmei_add_tag_tb(tb_seller_wangwangid,tb_order_number,null,sellerMemo,sellerFlag)
            if(result_["success"] === false){
                                   Toast(result_["message"])
                                    alert("插旗失败")
             }else{
                                    Toast(" 插旗成功，"+result_["message"],3000)
             }

        }
        let content = $(".el-input__inner").select()

        return
    }
})


chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    var method = request.method;
    var to = request.to;
    console.log("chuanmei_api_addListener:",request)

    if(to ==="chuammei" && method ==="update_kuaid100_logistics_data"){
         let data = JSON.parse(request.kuaidi100_data)
         if(data["success"] !=="success"){
             Toast(data["message"],5000)
             if(data["message"] ==="暂不支持的快递"){
                  let barcodeData = data["logistics_number"];

                   $(".refund_goods_log_div_17").prepend("<svg id='barcodeContainer'></svg>")
                  JsBarcode("#barcodeContainer", barcodeData);
             }

                 return
         }
         let logistics_data =data["logistics_data"]

        if(logistics_data["data"]!==undefined && logistics_data["data"].length !==0){
            let content  = logistics_data["data"][0]["ftime"]+" " +logistics_data["data"][0]["context"]
            console.log(content)


             $(".refund_goods_log_div_17").prepend("<div class='kuaid100_last_message_show'>"+content+"</div>")


        }
        console.log(data)

    }
})


