
// let  CHUAMMEI_BASE_URL = "https://tb30.chuanmeidayin.com"
// let chuammei_order_status = {
//     WAIT_SELLER_SEND_GOODS:"待发货",
// }

//  代发货页面
function apiwoda_wait_send_page_init(){
        woda_update_wait_send_page_data()


}


//更新我打
function woda_update_wait_send_page_data(){

        let tb_order_number_list  = []
        let cur_wangwang_id = ""
        console.log($(".table-body-area")[0])
        let main_contain_div = $(".table-body-area")[0]
        let all_div = $(main_contain_div).children("div")
        $("span:contains('重置')").parent().after("<span style='background: greenyellow;' id='not_place_order_show'>只显示未下单订单</span>")
        $("span:contains('重置')").parent().after("<span style='background: greenyellow;margin-left: 2em' id='select_order_to_cache'>选中的订单缓存</span>")
        $("#select_order_to_cache").click(function () {
            $(".item_item_check_box_input_17:checked").each(function () {
               console.log("地址",$(this).parent().parent().children()[3])
                let address_div = $(this).parent().parent().children()[3]

                let address =$(address_div).text().replace("复制收件人","").replace("一键复制","").replace("修改","")
                replace_art_no_str_list = [
                    {"old":"  ","new":""}
                ]
                let new_address = mcommon_replace_all(replace_art_no_str_list,address)
                console.log("新地址：",new_address)

            })
        })
        $("#not_place_order_show").click(function () {

            let dis = $(".order_info_table_17").parent().parent().css("display")
            console.log("地对地导弹",dis)
            if(dis==="flex" ){
                $('.order_info_table_17').parent().parent().css("display",'none')
                $('.order_info_table_17').parent().parent().prev().css("display",'none')
            }else{
                $('.order_info_table_17').parent().parent().css("display",'flex')
                 $('.order_info_table_17').parent().parent().prev().css("display",'flex')
            }
             


        })
        for(let i = 0 ; i< all_div.length;i++){
            let divtext = $(all_div[i]).text()
            let div_css = divtext.css()
            console.log("divcss",div_css    )
            if(divtext.indexOf("合并前")!==-1){
                console.log("divtext:",divtext)
                let wang_wang_id  = $(all_div[i]).find("label").text()
                 console.log("wang_wang_id:",wang_wang_id)
                if(wang_wang_id !==undefined && wang_wang_id !==""){
                    cur_wangwang_id  = wang_wang_id
                }
            }else{}

            let cur_div_class_name = $(all_div[i]).attr("class")
            if(cur_div_class_name !==undefined  && cur_div_class_name.indexOf("detail-border-bottom") !==-1){
                let order_number_div  = $(all_div[i]).find(".trade-detail-column1")
                let pre_elem = $(all_div[i]).prev()
                let item_check_box_input = $($(pre_elem).children()[1]).find("input")[0]
                $(item_check_box_input).addClass("item_item_check_box_input_17")
                $($(pre_elem).children()[2]).append("<lable style='background: yellow;display: inline-block'>"+cur_wangwang_id+"</lable>")
                let tb_order_number =  $(order_number_div).find("a").attr("href")
                let tb_order_number2 =  $(order_number_div).find("a").text().trim()
                $($(order_number_div).children()[0]).addClass("17_tb_order_number_div")
                console.log("tb_order_number:",tb_order_number)
                console.log("tb_order_number2:",tb_order_number2)
                tb_order_number_list.push(tb_order_number2)
            }
            console.log("当前类名:",cur_div_class_name)
        }

        chrome.runtime.sendMessage({order_number_list: JSON.stringify(tb_order_number_list),method:'get_orders_from17'},function(response) {
           let order_list = replace_data(JSON.parse(response))
            console.log("传美售后获取17订单结果：",order_list)
            $('.order_info_table_17').remove()
            woda_add_order_info_to_wait_send_page(order_list,"order")

	    });
        chrome.runtime.sendMessage({order_number_list: JSON.stringify(tb_order_number_list),method:'get_null_orders_from17'},function(response) {
           let order_list = replace_null_order_data(JSON.parse(response))
            console.log("传美售后获取17订单结果：",order_list)
            $('.null_order_info_table_17').remove()
            woda_add_order_info_to_wait_send_page(order_list,"null_order")

	    });

}



//添加17订单信息到我打待发页面
function woda_add_order_info_to_wait_send_page(order_list,order_type){
        if(order_type === undefined){
            order_type = "order"
        }
         let table_17 = null
        let table_calss_17 = ""
        if(order_type === "order"){
            table_17 = $('.order_info_table_17')
            table_calss_17 = "order_info_table_17"
        }else if(order_type === "null_order"){
             table_17 = $('.null_order_info_table_17')
            table_calss_17 = "null_order_info_table_17"
        }

        let order_number_div = $("div[class='17_tb_order_number_div']")
        table_17.remove()

        for(let i = 0; i<order_number_div.length;i++){
            let item_div = order_number_div[i]
           let tb_order_number = $(item_div).find("a").text().trim()

            let order = find_order(tb_order_number,order_list)


            let newget = null;

           if(order!==null){
                    let back_color = "ffff99"
                    var d=order
                    let goods_status_span = ""
                    if(d.orderGoods !== undefined   ){
                        for(let n = 0 ; n<d.orderGoods.length;n++){
                             let goods_status = d.orderGoods[n].status
                             let service_message = d.orderGoods[n].customer_service_message
                             goods_status_span = goods_status_span +'<span style="margin-right: 40px; ">[商品'+n+" "+goods_status+"]  客服留言："+service_message+'</span>';
                             // if(goods_status !== "已取消" && goods_status !== '已退款' ){
                             //     back_color = 'red'
                             // }
                        }
                    }
                    newget = '<table style="display: inline-block;" class = '+table_calss_17+' width="100%" ><tr bgcolor='+back_color+'><td height="30" align="center"><span style="margin-right: 40px;">17代发订单：'+d.tb_order_number+'</span>';
                    newget += '<span style="margin-right: 40px;">快递：'+d.logistics_name+'</span>';
                    newget += '<span style="margin-right: 40px;">单号：'+d.logistics_number+'</span>';
                    newget += '<span style="margin-right: 40px;">订单状态：'+d.order_status+'</span>';
                    newget += goods_status_span


                    // newget += '<span>拿货情况：'+d.over_taking+'/'+d.pro_count+'</span>';
                    newget += '</td></tr></table>';
                    $(item_div).parent().parent().parent().parent().prepend(newget)
                }

     }

}

   //参数n为休眠时间，单位为毫秒:
    function sleep(n) {
        var start = new Date().getTime();

        while (true) {
            if (new Date().getTime() - start > n) {
                break;
            }
        }
    }

//循环取代所有字符
function mcommon_replace_all(replace_list,str){
    for(let i = 0 ; i<replace_list.length;i++){
        let replace_old = replace_list[i]["old"]
        let replace_new = replace_list[i]["new"]
        str = str.replace(new RegExp(replace_old,"g"),replace_new)

    }
    return str

}
