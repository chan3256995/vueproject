

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

function apipdd_sudmit_order_data(submit_list){
    //数据来源拼多多buyer订单



    let  params = {
        "submit_list":submit_list
    }


    chrome.runtime.sendMessage({method:'submit_pdd_buyer_order_data_to_17' ,"params":JSON.stringify(params)},function(response) {


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
        order_new_item["logistics_number"] = item_obj['tracking_number']
        order_new_item["shop_name"] = item_obj['mall']['mall_name']
        order_new_item["shop_id"] = item_obj['mall']['id']
        let order_goods_list = []
        for(let i = 0 ; i< item_obj['order_goods'].length ;i++){
            let goods_item = item_obj['order_goods'][i]
            let order_goods = {}

            order_goods['goods_id']=goods_item['goods_id']
            order_goods['goods_name']=goods_item['goods_name']
            order_goods['goods_count']=goods_item['goods_number']
            order_goods['goods_price']=goods_item['goods_price']
            order_goods['goods_type']=goods_item['goods_type']
            order_goods['color_size']=goods_item['spec']
            order_goods['image_src']=goods_item['thumb_url']
            order_goods_list.push(order_goods)
        }
        order_new_item['order_goods_list'] = order_goods_list


        order_data_list.push(order_new_item)
        logistics_list.push(logistics_new_item)
    }



     let  return_data = {"logistics_list":logistics_list,"order_data_list":order_data_list}
      console.log("return_data->",return_data)
    return return_data


}
function apipdd_analysis_shop_goods_data(goods_list,pdd_account){
     Toast("共"+goods_list.length+"条数据")
    //数据来源拼多多店铺商品

    let new_goods_list = []

    for(let i=0;i<goods_list.length;i++){
        let item_obj = goods_list[i];
        let goods_new_obj = {};
        goods_new_obj["goods_name"] = item_obj['goods_name']
        goods_new_obj["group_id"] = item_obj['group_id']
        goods_new_obj["image_url"] = item_obj['thumb_url']
        goods_new_obj["link_url"] = item_obj['link_url']
        goods_new_obj["sales_tip"] = item_obj['sales_tip']
        goods_new_obj["price"] = item_obj['price']
        goods_new_obj["is_new_goods"] = false
        goods_new_obj["shipping_date"] = ""
        let tag_list = item_obj['tag_list']
        let match_reg  = /【(.*?)天内发货】/
         let match_text = goods_new_obj["goods_name"].match(match_reg)
        if(match_text !== null && match_text.length!==0){
            goods_new_obj["shipping_date"] = match_text[0]
        }
        for(let t = 0 ; t<tag_list.length;t++){

           let temp_new =tag_list[t]['text']

            if(temp_new === '新品'){
                goods_new_obj["is_new_goods"]  = true
                break
            }
        }



        new_goods_list.push(goods_new_obj)

    }



     let  return_data = {"new_goods_list":new_goods_list}
      console.log("return_data->",return_data)
    return return_data


}
function apipdd_update_shop_page_ui(goods_list,pdd_account){
     Toast("共"+goods_list.length+"条数据")
    //数据来源拼多多店铺商品

    let new_goods_list = []
    let str_html  = "<div class='new_goods_div_17' style='display:flex;flex-wrap:wrap;float:left;width:300px;font-size:5px;position: fixed;top: 0px;'>  "


    for(let i=0;i<goods_list.length;i++){
        let item_obj = goods_list[i];
        let goods_new_obj = {};

        if(item_obj['is_new_goods']!==true){
            continue
        }
        goods_new_obj["goods_name"] = item_obj['goods_name']
        goods_new_obj["group_id"] = item_obj['group_id']

        goods_new_obj["link_url"] = item_obj['link_url']
        goods_new_obj["sales_tip"] = item_obj['sales_tip']
        goods_new_obj["price"] = item_obj['price']
         str_html = str_html + "<div  style='width: 120px;position: relative;display: inline-block;margin-bottom: 1px'> " +
             "<img style='width: 120px;height: 120px' src='"+item_obj['image_url']+"'/>" +
             "<span style=' position: absolute;width: 100%;bottom: 0;left: 0;color: red;background:white '>"+item_obj['sales_tip']+item_obj['shipping_date']+"</span>" +


             "</div> "







    }

    str_html = str_html +  "  </div>"


    $(".new_goods_div_17").remove()
    $("html").prepend(str_html)

    Toast("更新完毕")

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

               apipdd_sudmit_order_data(result_['order_data_list'])


           }
            return
       }




       if(ev.data.url !==undefined && ev.data.url.indexOf('proxy/api/api/turing/mall/query_cat_goods?')!==-1 ){
           let respone_data = JSON.parse(ev.data.responseText)
             console.log("pdd查询店铺消息",respone_data)
           if(respone_data['goods_list'] !==undefined){

               let result_ = apipdd_analysis_shop_goods_data(respone_data['goods_list'])
               apipdd_update_shop_page_ui(result_['new_goods_list'])



           }
            return
       }

 })
