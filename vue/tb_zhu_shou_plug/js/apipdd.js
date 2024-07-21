

//拼多多物流查询来源
let  pingdd_buyer_logistics_status = {
     500:"已送达",
     400:"已送达",
     300:"运输中",
     200:"运输中",
}

//我的订单来源的物流
let  pingdd_buyer_logistics_status_by_order = {
     0:"运输中",
     1:"运输中",
     2:"运输中",
     3:"运输中",
     4:"运输中",
}


function apipdd_sudmit_logistics_data(data_list,pdd_account){
    //数据来源拼多多买家物流
    let submit_list = []
    Toast("共"+data_list.length+"条数据")
    for(let i=0;i<data_list.length;i++){
        let item_obj = data_list[i];
        let new_item = {};
        if((item_obj['status_type'] ===200 && item_obj['track_desc'].startsWith('商家已发货') ) || item_obj['status_type'] ===100 || item_obj['source_type_desc'] ==='我退货的' || item_obj['source_type_desc'] ==='我查过的'){

            continue
        }
        new_item["data_source"] = "拼多多买家"
        new_item["source_type"] =  item_obj['source_type']
        new_item["account"] = pdd_account
        new_item["return_logistics_name"] = item_obj['track_desc'].substring(0,item_obj['track_desc'].indexOf("："))
        new_item["return_logistics_number"] = item_obj['tracking_number']
        new_item["logistics_info"] = item_obj['track_desc']
        new_item["logistics_status_type_desc"] =pingdd_buyer_logistics_status[item_obj['status_type']]
        new_item["logistics_status_type"] = item_obj['status_type']
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


function apipdd_sudmit_logistics_data_by_order(submit_list){
    //数据来源拼多多订单物流信息



    let  params = {
        "submit_list":submit_list
    }


    chrome.runtime.sendMessage({method:'submit_return_package_data_to_17' ,"params":JSON.stringify(params)},function(response) {


            console.log(response)
        });

}
function apipdd_analysis_order_data(data_list,pdd_account){
     Toast("共"+data_list.length+"条数据")
    //数据来源拼多多订单物流信息
    let logistics_list = []
    let order_data_list = []

    for(let i=0;i<data_list.length;i++){
        let item_obj = data_list[i];
        let logistics_new_item = {};
        let order_new_item = {};
        if((item_obj['status'] !==3 ) || item_obj['tracking_number'] === undefined || item_obj['tracking_number'] === ""){

            continue
        }
        let logistics_update_time  = item_obj['extra_info']['order_hint']['extra_map']['time']
        logistics_new_item["data_source"] = "拼多多买家"

        logistics_new_item["account"] = pdd_account
        logistics_new_item["return_logistics_name"] = ''
        logistics_new_item["return_logistics_number"] = item_obj['tracking_number']
        logistics_new_item["logistics_info"] = item_obj['extra_info']['order_hint']['message'] +'【'+logistics_update_time+'】'
        logistics_new_item["logistics_update_time"] = logistics_update_time

        logistics_new_item["logistics_status_type"] = item_obj['status_type']
        logistics_new_item["logistics_status_type_desc"] = "未知"

        let is_recieved =  mcommon_is_recieved(item_obj['extra_info']['order_hint']['message'])
        if(is_recieved === true){
            logistics_new_item["logistics_status_type_desc"] = "已送达"
        }
        order_new_item['data_source'] = "拼多多买家"
        order_new_item["account"] = pdd_account
        order_new_item["order_number"] = item_obj['source_biz_sn']
        order_new_item["return_logistics_number"] = item_obj['tracking_number']
        let order_goods_list = []
        for(let i = 0 ; i< item_obj['order_goods'].length ;i++){
            let goods_item = item_obj['order_goods'][i]
            let order_goods = {}
            order_goods['goods_id']=goods_item['goods_id']
            order_goods['goods_name']=goods_item['goods_name']
            order_goods['goods_number']=goods_item['goods_number']
            order_goods['goods_price']=goods_item['goods_price']
            order_goods['goods_type']=goods_item['goods_type']
            order_goods['color_size']=goods_item['spec']
            order_goods['pic_url']=goods_item['thumb_url']
            order_goods_list.push(order_goods)
        }
        order_new_item['order_goods_list'] = order_goods_list


        order_data_list.push(order_new_item)
        logistics_list.push(logistics_new_item)
    }
    console.log("logistics_list->",logistics_list)
    console.log("order_data_list->",order_data_list)


    return {"logistics_list":logistics_list,"order_data_list":order_data_list}


}
 window.addEventListener("message",ev => {
// https://mobile.yangkeduo.com/proxy/api/api/aristotle/order_list_v4?pdduid=3166608334
       if(ev.data.url !==undefined && ev.data.url.indexOf('proxy/api/api/express_trackbox/list?pdduid=')!==-1 ){
           let respone_data = JSON.parse(ev.data.responseText)
             console.log("pdd收到消息",respone_data)
           if(respone_data['success'] ===true){
               let pdd_account =  ev.data.url.split("pdduid=")[1]
               if(pdd_account.indexOf("&")!==0){
                    pdd_account = pdd_account.substring(0,pdd_account.indexOf("&"))
               }
               if(respone_data['result']['track_info_list'] !==undefined){
                   apipdd_sudmit_logistics_data(respone_data['result']['track_info_list'],pdd_account)
               }

           }
            return
       }


       if(ev.data.url !==undefined && ev.data.url.indexOf('proxy/api/api/aristotle/order_list_v4?pdduid=')!==-1 ){
           let respone_data = JSON.parse(ev.data.responseText)
             console.log("pdd收到消息",respone_data)
           if(respone_data['orders'] !==undefined){
               let pdd_account =  ev.data.url.split("pdduid=")[1]
               if(pdd_account.indexOf("&")!==-1){
                    pdd_account = pdd_account.substring(0,pdd_account.indexOf("&"))
               }
               let result_ = apipdd_analysis_order_data(respone_data['orders'],pdd_account)
               apipdd_sudmit_logistics_data_by_order(result_['logistics_list'])


           }
            return
       }

 })
