
let  CHUAMMEI_BASE_URL = "https://tb29.chuanmeidayin.com"
let chuammei_order_status = {
    WAIT_SELLER_SEND_GOODS:"待发货",
}
let  chuammei_goods_status = {
     WAIT_SELLER_SEND_GOODS:"待发货",

}

let  chuammei_goods_refund_status = {
     WAIT_SELLER_AGREE:"售后待同意",
     NO_REFUND:"无退款",
     CLOSED:"退款关闭",

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

function apichuanmei_get_order_counts(start_time,end_time){
    let return_result = {
        success:false,
        message:"",
    }
     let  submit_data = {
         multiShops: 'chenqling3,moonlight539',
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
multiShops: 'chenqling3,moonlight539',
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
// 传入传美对象，返回自定义对象
function apichuanmei_order_item_replace(chuanmei_order_item){
            let  new_order_obj = {}
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
            let new_goods_list = []
            for(let g = 0;g<chuanmei_order_item['orders'].length;g++){
                let goods_item = chuanmei_order_item['orders'][g]
                let new_goods_obj = {}
                let goods_code = goods_item['outerId']
                let sku_code = goods_item['outerSkuId']
                let color_size_arr = goods_item['skuPropName'].replace("主要颜色:","").replace("颜色分类:","").replace("尺码:","").split(";")
                let color = color_size_arr[0]
                let size = color_size_arr[1]
                if(sku_code!==""){
                    goods_code = sku_code
                }
                goods_code = mcommon_replace_goods_code_str(goods_code)

                new_goods_obj['color'] = color
                new_goods_obj['size'] = size
                
                new_goods_obj['code'] = goods_code

                new_goods_obj['goods_id'] = goods_item['numIID']
                new_goods_obj['goods_pic'] = goods_item['picPath']
                new_goods_obj['goods_counts'] = goods_item['num']
                new_goods_obj['refund_status'] = chuammei_goods_refund_status[goods_item['refundStatus']]
                new_goods_obj['status'] = chuammei_goods_status[goods_item['status']]
                new_goods_obj['title'] = goods_item['title']
                new_goods_list.push(new_goods_obj)
            }
            new_order_obj['order_goods'] = new_goods_list
                    
    return new_order_obj
}
// 传美代发货页面
function apichuammei_wait_send_page_init(){

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
                     // 用于下单到17网 列表
                     let my_tb_wait_send_order_cache1 = []
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
                              }

                              goods['count'] = cur_item_order_goods_list[g]['goods_counts']
                              order_goods_list.push(goods)
                          }
                           new_item['order_goods_list'] = order_goods_list
                         my_tb_wait_send_order_cache1.push(new_item)

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

       $("#order_cache_btn").click(function () {

            let customer_set_page_count = 0
            customer_set_page_count =  $("#order_cache_page_count")[0].value
            let end_time_stm = new Date().getTime()
            let dur_time_stm = 60*24*60*60*1000
            let start_time_stm = end_time_stm  - dur_time_stm

            let start_time = format_stmp_to_time(start_time_stm)
            let end_time = format_stmp_to_time(end_time_stm)

            let counts_result = apichuanmei_get_order_counts(start_time,end_time)
            console.log("counts_result",counts_result)
            let counts = 0
            let total_page = 0
            let page_size = 20
            if(counts_result.success === true){
                counts = counts_result["data"]['counts']
            }

            total_page  = Math.ceil(parseInt(counts,10)/page_size)// 向上去整
           if(customer_set_page_count!==undefined && customer_set_page_count!=='' && customer_set_page_count!==0 && (!isNaN(customer_set_page_count)) && customer_set_page_count < total_page){
               total_page =  customer_set_page_count
            }
            console.log("总页数："+total_page)
            let order_list = []
            let order_data = {}
            let order_data_list = []

            for(let i=0;i<total_page;i++){
                let pageNo = i+1
                let result_data = apichuanmei_get_order(start_time,end_time,pageNo,page_size)
                for(let j = 0;j < result_data['list'].length;j++){

                    //同个用户同地址多订单
                    let order_item_list = result_data['list'][j]
                    for(let o = 0;o<order_item_list.length;o++){
                        let new_order_obj =  apichuanmei_order_item_replace(order_item_list[o])
                        let tb_order_number = new_order_obj['tb_order_number']
                        order_data[tb_order_number] = new_order_obj
                        order_data_list.push(new_order_obj)
                    }

                    // order_list.push(new_order_obj)
                }

            }


            console.log("所有订单:",order_data)
             chrome.storage.local.set({"chuanmei_order_cache":order_data},function () {
                                console.log("保存成功，",order_data)
                                Toast("缓存成功")
                            })
            chrome.storage.local.set({"chuanmei_order_list_cache":order_data_list},function () {
                                console.log("保存成功，",order_data_list)
                                Toast("缓存成功")
                            })
            console.log("总页数:",total_page)
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
        })


}

 



