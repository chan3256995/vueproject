var curLocation = window.location.href.toString();
function main_is_return(){
    return false
}

 let injectedjs = document.createElement('script');

 injectedjs.src = chrome.extension.getURL('js/injected.js')

injectedjs.onload=function(){
     this.remove()
};

(document.head || document.documentElement).appendChild(injectedjs)









console.log("curLocation",curLocation)

if(curLocation.indexOf("taobao.com/search.htm")!==-1){

    console.log("pc 淘宝店铺页面.....")
//get_shop_recommend_goods_list_result
     window.onload=function(){
        if(main_is_return()) {return}
        setTimeout(function(){
            tbapi_init_taobao_shop_page_data()

    },1000)
     }


}else if(curLocation.indexOf("trade.taobao.com/trade/itemlist/list_sold_items.htm")!==-1){


     window.onload=function(){
          if(main_is_return()) {return}
        console.log("近三个月已卖出订单.......")

        console.log("不显示已关闭。",$("span:contains('不显示已关闭的订单')"))

       $("span:contains('不显示已关闭的订单')").after(" <button id='save_order_to_local_btn'  >订单缓存到本地</button>");
        $("#save_order_to_local_btn").click(function () {


               chrome.storage.local.get({"last3months_item":{}},function (local_data) {
                    let valid_time = 3 * 24 * 60 * 60 * 1000
                   let local_order_obj = local_data['last3months_item']
                   console.log("读取谷歌储存：",local_order_obj)
                     let req_page_num = 1;
                    let result  = tbapi_get_order_info_last_months(req_page_num)
                    result = JSON.parse(result)
                    if(result["error"] !== ""){
                        return
                    }
                    console.log("页面"+req_page_num+"订单",result)
                    console.log("error",result["error"])
                    console.log("extra",result["extra"])
                    let curr_page = result['page']["currentPage"]
                    let total_page = result['page']["totalPage"]

                   let is_break = false
                   for(let num = 0;num<total_page; num++ ){
                        if(is_break === true){
                            break
                        }
                        curr_page = num+1

                        let result  = tbapi_get_order_info_last_months(curr_page)
                        result = JSON.parse(result)
                         if(result["error"] === ""){

                            let main_orders = result['mainOrders']
                            for(let i = 0;i < main_orders.length ; i++){
                                let item = main_orders[i]
                                let order_number = item['orderInfo']['id']
                                let create_time = item['orderInfo']['createTime']
                                let save_obj = {"buyer_nick":item["buyer"]["nick"],"createTime":create_time,"order_number":order_number,"pay_status":item["statusInfo"]["text"],"actualFee":item['payInfo']['actualFee']}
                                // let save_obj = {}
                                // save_obj[order_number] = obj
                                let order_create_time_stm = new Date(create_time).getTime()
                                let curr_time_stm = new Date().getTime()


                                let expire_time_stm = curr_time_stm - valid_time
                                console.log("过期时间:",expire_time_stm)
                                if(order_create_time_stm < expire_time_stm){
                                    console.log("时间过期退出："+order_create_time_stm)
                                     is_break = true
                                    break
                                }
                                console.log("local_order_list[order_number]",local_order_obj[order_number])
                                if(local_order_obj[order_number] !==undefined && local_order_obj[order_number] !==null){
                                    console.log("订单已存在退出："+local_order_obj[order_number])
                                    is_break = true
                                    break
                                }

                                local_order_obj[order_number] = save_obj
                            }




                            for (let key in local_order_obj){
                                let order_create_date = local_order_obj[key]['createTime']
                                let order_create_time_stm = new Date(order_create_date).getTime()
                                let curr_time_stm = new Date().getTime()
                                if((curr_time_stm - order_create_time_stm) > valid_time ){
                                    delete local_order_obj[key]
                                }
                            }

                            chrome.storage.local.set({"last3months_item":local_order_obj},function () {
                                console.log("保存成功，",local_order_obj)
                            })
                    }
                    }
                        })
            return







        })

     }

}
if(curLocation.indexOf("s.taobao.com/search")!==-1 && curLocation.indexOf("search?q=&imgfile")===-1){

    window.onload=function(){
         if(main_is_return()) {return}
      init_search_page_elems_data()

    }
}


if(curLocation.indexOf("vvic.com/user/favoriteshop")!==-1 ) {
    //https://www.vvic.com/user/favoriteshop.html

    window.onload = function () {
         if(main_is_return()) {return}
        console.log("搜款网店铺收藏页面。。。。。。")
             setTimeout(function () {
                     apiskw_fav_shop_page_init()
                },2000)


    }


}
if(curLocation.indexOf("taobao.vvic.com/item?id")!==-1 ) {

    window.onload = function () {
         if(main_is_return()) {return}
        console.log("搜款网上传淘宝页面。。。。。。")
        console.log("批发价_div000",$("div:contains('价格')[class='label']"))


         $("div:contains('价格')[class='label']").before(" <div style='margin-top: 1em; width: 5em;height: 2em;background: #2d8cf0'><input style='width: 5em;height: 2em;background: #2d8cf0;color: white' type='button' id='change_price_input'   value='改价格'></div>");

        $("#change_price_input").click(function () {

            shoukuanw_update()

        })

    }
}



if(curLocation.indexOf("vvic.com/shop/")!==-1 ) {
    window.onload = function () {
         if(main_is_return()) {return}
        console.log("店铺主页..........")
        var title_div_list = $(".goods-list").find(".item").find('.title')
        for(var i = 0 ;i<title_div_list.length;i++){
            var a_elems = $(title_div_list[i]).find('a')[0]
            var ctl = a_elems.getAttribute("ctl")
            var href = a_elems.getAttribute("href")
            var clt_str_arr = ctl.split(",")
            var goods_id = clt_str_arr[1]
             //https://taobao.vvic.com/item?id=27866836&p=1
            var up_to_taobao_url = "https://taobao.vvic.com/item?id="+goods_id+"&p=1"
            var down_video_url = "https://www.vvic.com"+href+"?down_video=true"
             console.log("up_to_taobao_url:",up_to_taobao_url)
            // $(title_div_list[i]).after(" <div  style='margin-top: 1em; width: 5em;height: 2em;background: #2d8cf0;display: block'><input style='width: 5em;height: 2em;background: #2d8cf0;color: white' type='button' class='update_to_tb'   value='上传到淘宝'></div>");
            $(title_div_list[i]).after("   <a style='background: #2d8cf0; color: white' href='"+up_to_taobao_url+"' target='_blank'>上传到淘宝<a> ");
            $(title_div_list[i]).after("   <a style='background: #2d8cf0; color: white' href='"+down_video_url+"' target='_blank'>下载视频<a> ");
        }









    }
}
if(curLocation.indexOf("vvic.com/user/favoriteUpload")!==-1 ) {
    window.onload = function () {
         if(main_is_return()) {return}
        console.log("我的上传页面..........")
        var title_div_list = $(".goods-list").find(".item").find('.title')
        for(var i = 0 ;i<title_div_list.length;i++){
            var a_elems = $(title_div_list[i]).find('a')[0]

            var href = a_elems.getAttribute("href")

             //https://taobao.vvic.com/item?id=27866836&p=1

            var down_video_url = "https://www.vvic.com"+href

            // $(title_div_list[i]).after(" <div  style='margin-top: 1em; width: 5em;height: 2em;background: #2d8cf0;display: block'><input style='width: 5em;height: 2em;background: #2d8cf0;color: white' type='button' class='update_to_tb'   value='上传到淘宝'></div>");

            $(title_div_list[i]).after("   <span  style='background: #2d8cf0; color: white;float: left' id='id_"+i+"' href='"+down_video_url+"' target='_blank'>下载视频</span>");

            $("#id_"+i).click(function (urlt) {

                var urlt = $(this).attr("href")
                 let goods_id = get_goods_id(urlt)
                 var down_video_url2 = "https://www.vvic.com/item/"+goods_id+"?down_video=true"
                window.open(down_video_url2,"_blank" )
            })

        }









    }
}else if(curLocation.indexOf("tusou.vvic.com/list")!==-1 || curLocation.indexOf("vvic.com/main/sameStyle")!==-1 || curLocation.indexOf("www.vvic.com/user/favorite.html")!==-1){
     //clearfix shop-name-box
    window.onload = function(){
         if(main_is_return()) {return}
       apiskw_tusou_fav_goods_page_init()

    }
}

if(curLocation.indexOf("#/pc/home/myorder")!==-1){
    window.onload = function () {
         if(main_is_return()) {return}
         console.log("17代拿我的订单页面..........")

        $("button:contains('查询')").after("<input style='width: 10em;height: 1.5em; background: #adadad' type='button' value='从掌门人获取订单信息' id='tb_zhushou_get_zmr_order'>")
        $("#tb_zhushou_get_zmr_order").click(function () {
             $(".zhangmenren").remove()
                  let tb_order_number_labels = $(".item_order").find("label:contains('淘宝订单号')")

                  let order_number_list = []
                  for(let i = 0 ;i < tb_order_number_labels.length;i++){
                      let label_text = $(tb_order_number_labels[i]).text().trim()
                      label_text = label_text.replace("淘宝订单号：","")
                      console.log("label_text:",label_text  )
                      order_number_list.push(label_text)
                  }
                  chrome.runtime.sendMessage({method:'get_zhangmenren_order_info',tb_order_number_list:JSON.stringify(order_number_list)},function(response) {
                    let result = JSON.parse(response)
                    console.log(response)
                     let tb_order_number_labels = $(".item_order").find("label:contains('淘宝订单号')")
                  console.log("tb_order_number_labels22222222:",tb_order_number_labels)

                  for(let i = 0 ;i < tb_order_number_labels.length;i++){
                      let order_number = $(tb_order_number_labels[i]).text().trim()
                      order_number = order_number.replace("淘宝订单号：","")
                      if(result[order_number] !== {} && result[order_number]["user_name"] !==undefined && result[order_number]["user_name"] !==""){
                           $(tb_order_number_labels[i]).after("<label class='zhangmenren' style='background: yellow'>(掌门人)"+result[order_number]["user_name"]+"</label>")
                      }
                      console.log("label_text:",order_number  )

                  }
                    Toast(response,3000)

        });
        })
    }
}
if(curLocation.indexOf("member/auditBuyerAccount/index")!==-1 ) {
    //掌门人 网站
    window.onload = function () {
         if(main_is_return()) {return}
        console.log("掌门人审核管理页面..........")
         // $('#tasklist').prepend("<button id='zhaoyaojing_btn' style='margin-top: 1em;display: block'>照妖镜查询</button>")

         $('#tasklist').prepend("   <input id='key_words' style='margin-top: 1em; width: 20em;display: block' placeholder='打标词' value=''   ><input id='tb_link' style='margin-top: 1em;width: 40em;display: block' placeholder='淘宝链接' value=''   >  <input id='dabiao_wangwang_id' placeholder='旺旺id' value='' style='margin-top: 1em;width: 20em;display: block'  ><button id='wuxie_dabiao_btn' style='margin-top: 1em;display: block'>进行打标</button>");

         $('tbody').find('tr').append("<td>" +
             "<input style='width: 5em;height: 1.5em; background: #adadad' type='button' value='获取打标信息' class='wuxietagbtn'>" +
             "<input style='width: 5em;height: 1.5em; background: #adadad;margin-top: 2em' type='button' value='淘宝照妖镜查询' class='zhaoyaojingbtn'>" +
             "</td>")
        // $("#zhaoyaojing_btn").click(function () {
        //     let data = {user_name:"tbtbtb0621"}
        //
        //      chrome.runtime.sendMessage({method:'zhaoyaojing_query',query_data:JSON.stringify(data)},function(response) {
        //          console.log(response)
        //          let imagelist = JSON.parse(response)
        //         $(".zhaoyaojing_image").remove()
        //         $('#tasklist').prepend("<image class='zhaoyaojing_image' src="+imagelist[0]+">")
        //         $('#tasklist').prepend("<image class='zhaoyaojing_image' src="+imagelist[1]+">")
        //
        // });
        // })
        $(".wuxietagbtn").click(function () {
             $(this).parent().find("td")[3]
             $(this).parent().find("td")[4]
             console.log("关键词：", $($(this).parent().parent().find("td")[3]).text())
             $("#key_words").val($($(this).parent().parent().find("td")[3]).text().trim())
             $("#dabiao_wangwang_id").val($($(this).parent().parent().find("td")[7]).text().trim())
             let order_id  = $($(this).parent().parent().find("td")[4]).text().trim()
             console.log("关键词：", $(this).parent())
             // 获取掌门人任务的淘宝链接
              chrome.runtime.sendMessage({method:'get_zhangmenren_task_tb_link',order_id:order_id},function(response) {

               console.log(response)

               let result = JSON.parse(response)

                  console.log("result['tb_link']:",result['tb_link'])
               $("#tb_link").val(result['tb_link'])
        });
         })
        $(".zhaoyaojingbtn").click(function () {


             let wangwang_id = $($(this).parent().parent().find("td")[7]).text().trim()

                  let data = {user_name:wangwang_id}

             chrome.runtime.sendMessage({method:'zhaoyaojing_query',query_data:JSON.stringify(data)},function(response) {
                 console.log(response)
                 let imagelist = JSON.parse(response)
                $(".zhaoyaojing_image").remove()

                // $('#tasklist').prepend("<div class='zhaoyaojing_image' style='background:url('"+imagelist[0]+"') > </div>")
                $('#tasklist').prepend("<image class='zhaoyaojing_image' src="+imagelist[1]+">")
                $('#tasklist').prepend("<image class='zhaoyaojing_image' src="+imagelist[0]+">")

                $('#tasklist').prepend("<span >照妖镜查询:"+wangwang_id+"</span>")




        });
         })



         console.log("tr",$('tbody').find('tr'))
         let item_list_tr = $('tbody').find('tr')
         let order_id_record_obj = []

         for(let i = 0 ;i< item_list_tr.length;i++){
             let  item  =item_list_tr[i]
             let tem_str = window.localStorage.getItem("zhangmenren_data")
             console.log("本地储存0:",tem_str)
             if(tem_str!== null){
                 order_id_record_obj = JSON.parse(tem_str)
             }else{
                 order_id_record_obj = {}
             }
             //订单id
             let  action_time = $($(item).find("td")[1]).text().trim()
             let order_id = $($(item).find("td")[4]).text().trim()
             let  task_id = $($(item).find("td")[5]).text().trim()
             let  buyer_id = $($(item).find("td")[6]).text().trim()
             // 买手购物平台账号
             let  buyer_account = $($(item).find("td")[6]).text().trim()
             let curr_record = order_id_record_obj[order_id]


             let obj = {"action_time":action_time,"order_id":order_id,"task_id":task_id,"buyer_id":buyer_id}
              console.log("ORDER_ID:",order_id)


             let cur_order_id_list = order_id_record_obj[order_id]
             if(cur_order_id_list === null || cur_order_id_list === undefined){
                 cur_order_id_list = []
             }

             for(let k = 0;k<cur_order_id_list.length;k++){


                 if(buyer_id === cur_order_id_list[k]['buyer_id']){
                     cur_order_id_list.splice(k,1)
                     break
                 }
             }
             cur_order_id_list.push(obj)
             order_id_record_obj[order_id] = cur_order_id_list
             window.localStorage.setItem("zhangmenren_data",JSON.stringify(order_id_record_obj))
              $($(item).find("td")[0]).append("<span style='background: yellow;display: block'>"+cur_order_id_list.length+"</span>")

         }
         let tem_str = window.localStorage.getItem("zhangmenren_data")
         let record_data = JSON.parse(tem_str)
        console.log("读取本地储存记录,",record_data)
         for(let key in record_data){

             let cur_order_id_list = record_data[key]

             if(cur_order_id_list.length === 0){

                delete record_data[key]
                 continue
             }
             for(let k = 0;k<cur_order_id_list.length;k++){

                   let action_time = cur_order_id_list[k]['action_time']
                 if(action_time !=="" && action_time !==undefined){
                     let action_time_stm = new Date(action_time).getTime()

                     let expire_time = action_time_stm + 3 * 60 * 60 *1000
                     let curr_time = new Date().getTime()
                     console.log("  curr_time",curr_time)
                     console.log("expire_time",expire_time)
                     if(curr_time> expire_time){

                          cur_order_id_list.splice(k,1)

                          if(k === 1){
                              break
                          }
                          k = k -1


                     }
                 }
             }

         }
           window.localStorage.setItem("zhangmenren_data",JSON.stringify(record_data))

             console.log("本地储存:",JSON.parse(window.localStorage.getItem("zhangmenren_data")))

        $("#wuxie_dabiao_btn").click(function () {
                  chrome.runtime.sendMessage({method:'wuxie_dabiao',wangwang_id:$("#dabiao_wangwang_id").val(),tb_link: $("#tb_link").val(),key_words: $("#key_words").val()},function(response) {

                    console.log(response)
                      Toast(response,3000)

        });
        })








    }
}
if(curLocation.indexOf("member/Taskmanage/expressNumberManagement")!==-1 || curLocation.indexOf("member/taskmanage/expressnumbermanagement")!==-1 ) {
    window.onload = function(){
         if(main_is_return()) {return}
            $("a:contains('批量修改快递')").after("<button id='check_address_17'> 修正地址</button> <button id='add_logistic_to_17'> 订单号同步到17</button> <input value='申通' id='logistic_name_17'/> ")
               let sended_item_list = []
                let all_item_list = []
                let order_item_div = $(".exp-item")
                for(let i = 0 ; i< order_item_div.length;i++){

                   let tbordernumber_input =  $(order_item_div[i]).find("input[name='tbOrderId']")
                    console.log("tbordernumber_input",tbordernumber_input)
                    let select_logistic_text =  $(order_item_div[i]).find("#expressNo option:selected").text()
                    console.log("物流名称："+select_logistic_text)
                    let select_logistic_name = ""
                    if(select_logistic_text.indexOf("申通")!==-1){
                        select_logistic_name = "申通"
                    }else if(select_logistic_text.indexOf("中通")!==-1){
                        select_logistic_name = "中通"
                    }else if(select_logistic_text.indexOf("邮政")!==-1){
                        select_logistic_name = "邮政"
                    }else if(select_logistic_text.indexOf("顺丰")!==-1){
                        select_logistic_name = "顺丰"
                    }else if(select_logistic_text.indexOf("圆通")!==-1){
                        select_logistic_name = "圆通"
                    }
                    let item_obj = {
                       "tb_order_number" :"",
                       "logistics_number" :"",
                       "logistics_name" :select_logistic_name
                    }
                    if(tbordernumber_input.length!==0){
                        let tbordernumber = $(tbordernumber_input[0]).val().trim()
                        if(tbordernumber!==null && tbordernumber !==""){
                            item_obj['tb_order_number'] = tbordernumber
                        }

                        let logistics_span = $(order_item_div[i]).find("span:contains('运单号：')")
                        if(logistics_span.length!==0){
                            let logistics_num = $(logistics_span[0]).text().replace("运单号：","").trim()

                            if(logistics_num!==null && logistics_num !==""){
                            item_obj['logistics_number'] = logistics_num
                        }

                        }
                    }

                    if(item_obj["tb_order_number"] !=="" && item_obj["logistics_num"] !=="" ){

                            sended_item_list.push(item_obj)
                        }
                    all_item_list.push(item_obj)

                    console.log("sended_item_list",sended_item_list)
            }
                $("#add_logistic_to_17").attr("value",JSON.stringify(all_item_list))
            $("#add_logistic_to_17").click(function () {
                 let item_list = JSON.parse($($("#add_logistic_to_17")[0]).val())
                 let sended_item_list = []
                 for(let i = 0;i<item_list.length;i++){
                     if(item_list[i]['tb_order_number'] !==undefined && item_list[i]['tb_order_number'] !=="" && item_list[i]['logistics_number'] !==undefined && item_list[i]['logistics_number'] !==""){}
                      sended_item_list.push(item_list[i])
                 }
                 chrome.runtime.sendMessage({method:'delivery_null_order_to17',send_order_list:JSON.stringify(sended_item_list)},function(response) {

                   console.log(response)

                    Toast("发送完成")
                 });


            })
            $("#check_address_17").click(function () {

                 let item_list = JSON.parse($($("#add_logistic_to_17")[0]).val())
                 let order_number_list = []
                 for(let i = 0;i<item_list.length;i++){
                     order_number_list.push(item_list[i]['tb_order_number'])
                 }

              chrome.runtime.sendMessage({method:'get_null_orders_from17',order_number_list:JSON.stringify(order_number_list)},function(response) {



                   let result = JSON.parse(response)
                   let result_obj = {}
                   for(let i = 0;i<result.length;i++){
                       let tb_order_number = result[i]["tb_order_number"]
                       if(tb_order_number !==undefined && tb_order_number !==""){
                           result_obj[tb_order_number] = result[i]
                       }
                   }

                   let order_item_div = $(".exp-item")
                   for(let i = 0 ; i< order_item_div.length;i++){

                       let tbordernumber_input =  $(order_item_div[i]).find("input[name='tbOrderId']")
                        console.log("tbordernumber_input",tbordernumber_input)
                       let item_obj = {
                           "tb_order_number" :"",
                           "logistics_number" :"",

                        }
                       if(tbordernumber_input.length!==0){
                            let tbordernumber = $(tbordernumber_input[0]).val().trim()
                            if(tbordernumber!==null && tbordernumber !==""){
                                item_obj['tb_order_number'] = tbordernumber
                                }
                           let curr_item_data = result_obj[tbordernumber]
                           if(curr_item_data!==undefined){
                               let re_address_arr = curr_item_data['consignee_address'].split(",")
                               $($(order_item_div[i]).find("input[name='rName']")[0]).val(curr_item_data['consignee_name'])
                               // $($(order_item_div[i]).find("input[name='rPhone']")[0]).val(curr_item_data['consignee_phone'])
                               $($(order_item_div[i]).find("input[name='rProvince']")[0]).val(re_address_arr[0])
                               $($(order_item_div[i]).find("input[name='rCity']")[0]).val(re_address_arr[1])
                               $($(order_item_div[i]).find("input[name='rArea']")[0]).val(re_address_arr[2])
                               $($(order_item_div[i]).find("input[name='rAddress']")[0]).val(re_address_arr[3])
                               $(order_item_div[i]).find("div:contains('收件人')").attr("style","color:red")

                           }

                            }


            }
                   console.log(result)

                   Toast("订单获取完成")

        });

            })

        return
    }
}
if(curLocation.indexOf("member/auditBuyerAccount/index")!==-1 ) {
    //掌门人 网站
    window.onload = function () {
         if(main_is_return()) {return}
        console.log("掌门人审核管理页面..........")
         // $('#tasklist').prepend("<button id='zhaoyaojing_btn' style='margin-top: 1em;display: block'>照妖镜查询</button>")

         $('#tasklist').prepend("   <input id='key_words' style='margin-top: 1em; width: 20em;display: block' placeholder='打标词' value=''   ><input id='tb_link' style='margin-top: 1em;width: 40em;display: block' placeholder='淘宝链接' value=''   >  <input id='dabiao_wangwang_id' placeholder='旺旺id' value='' style='margin-top: 1em;width: 20em;display: block'  ><button id='wuxie_dabiao_btn' style='margin-top: 1em;display: block'>进行打标</button>");

         $('tbody').find('tr').append("<td>" +
             "<input style='width: 5em;height: 1.5em; background: #adadad' type='button' value='获取打标信息' class='wuxietagbtn'>" +
             "<input style='width: 5em;height: 1.5em; background: #adadad;margin-top: 2em' type='button' value='淘宝照妖镜查询' class='zhaoyaojingbtn'>" +
             "</td>")
        // $("#zhaoyaojing_btn").click(function () {
        //     let data = {user_name:"tbtbtb0621"}
        //
        //      chrome.runtime.sendMessage({method:'zhaoyaojing_query',query_data:JSON.stringify(data)},function(response) {
        //          console.log(response)
        //          let imagelist = JSON.parse(response)
        //         $(".zhaoyaojing_image").remove()
        //         $('#tasklist').prepend("<image class='zhaoyaojing_image' src="+imagelist[0]+">")
        //         $('#tasklist').prepend("<image class='zhaoyaojing_image' src="+imagelist[1]+">")
        //
        // });
        // })
        $(".wuxietagbtn").click(function () {
             $(this).parent().find("td")[3]
             $(this).parent().find("td")[4]
             console.log("关键词：", $($(this).parent().parent().find("td")[3]).text())
             $("#key_words").val($($(this).parent().parent().find("td")[3]).text().trim())
             $("#dabiao_wangwang_id").val($($(this).parent().parent().find("td")[7]).text().trim())
             let order_id  = $($(this).parent().parent().find("td")[4]).text().trim()
             console.log("关键词：", $(this).parent())
             // 获取掌门人任务的淘宝链接
              chrome.runtime.sendMessage({method:'get_zhangmenren_task_tb_link',order_id:order_id},function(response) {

               console.log(response)

               let result = JSON.parse(response)

                  console.log("result['tb_link']:",result['tb_link'])
               $("#tb_link").val(result['tb_link'])
        });
         })
        $(".zhaoyaojingbtn").click(function () {


             let wangwang_id = $($(this).parent().parent().find("td")[7]).text().trim()

                  let data = {user_name:wangwang_id}

             chrome.runtime.sendMessage({method:'zhaoyaojing_query',query_data:JSON.stringify(data)},function(response) {
                 console.log(response)
                 let imagelist = JSON.parse(response)
                $(".zhaoyaojing_image").remove()

                // $('#tasklist').prepend("<div class='zhaoyaojing_image' style='background:url('"+imagelist[0]+"') > </div>")
                $('#tasklist').prepend("<image class='zhaoyaojing_image' src="+imagelist[1]+">")
                $('#tasklist').prepend("<image class='zhaoyaojing_image' src="+imagelist[0]+">")

                $('#tasklist').prepend("<span >照妖镜查询:"+wangwang_id+"</span>")




        });
         })



         console.log("tr",$('tbody').find('tr'))
         let item_list_tr = $('tbody').find('tr')
         let order_id_record_obj = []

         for(let i = 0 ;i< item_list_tr.length;i++){
             let  item  =item_list_tr[i]
             let tem_str = window.localStorage.getItem("zhangmenren_data")
             console.log("本地储存0:",tem_str)
             if(tem_str!== null){
                 order_id_record_obj = JSON.parse(tem_str)
             }else{
                 order_id_record_obj = {}
             }
             //订单id
             let  action_time = $($(item).find("td")[1]).text().trim()
             let order_id = $($(item).find("td")[4]).text().trim()
             let  task_id = $($(item).find("td")[5]).text().trim()
             let  buyer_id = $($(item).find("td")[6]).text().trim()
             // 买手购物平台账号
             let  buyer_account = $($(item).find("td")[6]).text().trim()
             let curr_record = order_id_record_obj[order_id]


             let obj = {"action_time":action_time,"order_id":order_id,"task_id":task_id,"buyer_id":buyer_id}
              console.log("ORDER_ID:",order_id)


             let cur_order_id_list = order_id_record_obj[order_id]
             if(cur_order_id_list === null || cur_order_id_list === undefined){
                 cur_order_id_list = []
             }

             for(let k = 0;k<cur_order_id_list.length;k++){


                 if(buyer_id === cur_order_id_list[k]['buyer_id']){
                     cur_order_id_list.splice(k,1)
                     break
                 }
             }
             cur_order_id_list.push(obj)
             order_id_record_obj[order_id] = cur_order_id_list
             window.localStorage.setItem("zhangmenren_data",JSON.stringify(order_id_record_obj))
              $($(item).find("td")[0]).append("<span style='background: yellow;display: block'>"+cur_order_id_list.length+"</span>")

         }
         let tem_str = window.localStorage.getItem("zhangmenren_data")
         let record_data = JSON.parse(tem_str)
        console.log("读取本地储存记录,",record_data)
         for(let key in record_data){

             let cur_order_id_list = record_data[key]

             if(cur_order_id_list.length === 0){

                delete record_data[key]
                 continue
             }
             for(let k = 0;k<cur_order_id_list.length;k++){

                   let action_time = cur_order_id_list[k]['action_time']
                 if(action_time !=="" && action_time !==undefined){
                     let action_time_stm = new Date(action_time).getTime()

                     let expire_time = action_time_stm + 3 * 60 * 60 *1000
                     let curr_time = new Date().getTime()
                     console.log("  curr_time",curr_time)
                     console.log("expire_time",expire_time)
                     if(curr_time> expire_time){

                          cur_order_id_list.splice(k,1)

                          if(k === 1){
                              break
                          }
                          k = k -1


                     }
                 }
             }

         }
           window.localStorage.setItem("zhangmenren_data",JSON.stringify(record_data))

             console.log("本地储存:",JSON.parse(window.localStorage.getItem("zhangmenren_data")))

        $("#wuxie_dabiao_btn").click(function () {
                  chrome.runtime.sendMessage({method:'wuxie_dabiao',wangwang_id:$("#dabiao_wangwang_id").val(),tb_link: $("#tb_link").val(),key_words: $("#key_words").val()},function(response) {

                    console.log(response)
                      Toast(response,3000)

        });
        })

        return

    }

}
if(curLocation.indexOf("Order/SellerRefundOrder")!==-1 ) {
    window.onload =function () {
        taojinglingapi_init_fankuan_page()
        return
    }

}else if(curLocation.indexOf("member/Taskmanage/advancePaymentManagement")!==-1 ) {
    //掌门人            member/Taskmanage/advancePaymentManagement.html
    window.onload = function () {
         if(main_is_return()) {return}
        console.log("垫付任务返款管理页面..........")


         let order_id_record_obj = []


    chrome.storage.local.get({"chuanmei_order_cache":{}},function (local_data) {

         console.log("读取本地储存记录,",local_data)
         let lacal_obj = local_data["chuanmei_order_cache"]
         let item_div = $("#form1").find("div[class='d-b']")
         $("a:contains('切换排序')").after("<button id='add_tag_to_chuammei'> 选中的标记到传美</button>")
         for(let i = 0;i<item_div.length;i++){
             let item_data_obj = {}
             let  item_li_list = $(item_div[i]).find("li")
             let p_order_number = $(item_li_list[1]).find("p:contains('买手提交单号')")
             let p_wangwang_id = $(item_li_list[2]).find("p:contains('旺旺号')")
             let p_shop_name = $(item_li_list[1]).find("p:contains('商家店铺名称')")
             let p_my_money = $(item_li_list[5]).find("p:contains('商家押金')")
             let p_platm_money = $(item_li_list[5]).find("p:contains('平台提交金额')")

             let input_order_number = $(p_order_number[0]).find("input")
             let input_wangwang_id = $(p_wangwang_id[0]).find("input")
             let order_number = $(input_order_number[0]).attr("data-copy").trim()
             let wangwang_id = $(input_wangwang_id[0]).attr("data-copy").trim()
             let shop_name = $(p_shop_name[0]).text().replace("商家店铺名称：","")
             console.log("shop_name:"+shop_name)
             let my_money = $(p_my_money[0]).text()
             let platm_money = $(p_platm_money[0]).text()
             let local_tb_order_data = lacal_obj[order_number]
             if(my_money!==undefined && my_money!==""){
                 my_money = my_money.replace("商家押金：","").replace("￥","").replace("元","").trim()
             }if(platm_money!==undefined && platm_money!==""){
                 platm_money = platm_money.replace("平台提交金额：","").replace("￥","").replace("元","").trim()
             }

             item_data_obj["order_number"]  = order_number

             item_data_obj["wangwang_id"]  = wangwang_id
             item_data_obj["shop_name"]  = shop_name
             item_data_obj["my_money"]  = my_money
             item_data_obj["platm_money"]  = platm_money
             console.log("页面数据:",item_data_obj)
              let p_input = $(item_li_list[0]).find("input").attr("data",JSON.stringify(item_data_obj))

             if(local_tb_order_data!== undefined && local_tb_order_data !== null){
                 let refund_ = ""
                  for(let g = 0;g<local_tb_order_data['order_goods'].length;g++){

                      if(local_tb_order_data["order_goods"][g]['refund_status'] !== undefined){
                          refund_ = "有售后"
                      }
                  }
                 $(item_li_list[5]).append("<p   style='margin-top: 1em; color:red;display: block'> 淘宝 "+local_tb_order_data['order_status']+" "+ local_tb_order_data['payFee']+" "+ refund_+"</p>")
             }


         }
         $("#add_tag_to_chuammei").click(function () {
             $("input[type='checkbox']")
              $(".choose_one:checked").each(function(){

                  let input_data_str = $(this).attr("data").trim()
                    console.log("选中的数据:",input_data_str)
                  if(input_data_str!==undefined && input_data_str!==""){
                     let input_data = JSON.parse(input_data_str)
                     // let result = apichuanmei_add_tag_tb(seller_id_choies[input_data['shop_name']],input_data['order_number'],4,input_data["my_money"]+"/"+input_data["platm_money"])
                     // console.log("标记"+result['success']+"，"+result['message'])
                         chrome.runtime.sendMessage({"method":"add_tag_to_chuanmei_tb","post_data":JSON.stringify(input_data)},function (response) {
                              console.log("传美插旗结果，",response)
                              let result = JSON.parse(response)
                               if(result["success"] === false){
                                   Toast(" 插旗失败，"+result["message"])
                               }else{
                                    Toast(" 插旗成功，"+result["message"],3000)
                               }

                            })
                  }
                  }
              )
         })
         console.log("item：",item_div)

})







    }
}else if(curLocation.indexOf("pc/home/porder")!==-1){

    console.log("tb_zhusou_plug项目入注",curLocation)
    chrome.storage.local.get({"my_tb_wait_send_order_cache":null},function (local_data) {
         if(main_is_return()) {return}
         let lacal_obj = local_data["my_tb_wait_send_order_cache"]
         console.log("bt_zhushou_拿到谷歌插件缓存订单数据:",lacal_obj)
         if(lacal_obj === null){

             return
         }

         window.localStorage.setItem("my_tb_wait_send_order_cache",JSON.stringify(lacal_obj))
         let my_tb_wait_send_order_cache =    window.localStorage.getItem("my_tb_wait_send_order_cache")
         console.log("window缓存的订单数据:",my_tb_wait_send_order_cache)
         chrome.storage.local.remove("my_tb_wait_send_order_cache")

            })
}

function get_goods_id(goods_url){
            let return_goods_id = ""
               $.ajax({
            async : false,
            url :goods_url,
            // url :"https://wuliu.taobao.com/user/batch_consign.htm",
            type : "GET",
            // dataType : 'json',
            // data : data2,
            timeout : 5000,
            success : function(result){
                console.log("获取页面结果："+result)
            let head_str = result.substring(result.indexOf("<head>"),result.indexOf("</head>")+7)

            let tem_str = head_str.substring(head_str.indexOf("https://m.vvic.com/item/"),head_str.indexOf("</head>")+7)

            let goods_id = tem_str.substring("https://m.vvic.com/item/".length,tem_str.indexOf('"'))
                return_goods_id = goods_id
            },
            error:function (err) {
                console.log("获取页面结果失败" + err);
            },


        });
            return  return_goods_id
}
// if(curLocation.indexOf("vvic.com/item/)!==-1 ") ){
//     window.onload = function () {
//         console.log("搜款网商品详情页。。。。。。")
//         console.log("imgage_video_div",$("div[class='detail-btn imgage_video_download']"))
//         console.log("imgage_video_span",$("div[class='detail-btn imgage_video_download']").find("span"))
//
//
//
//
//     }
// }






  if(curLocation.indexOf("chuanmeidayin.com/dist/index.html#/afterSales/refund")!==-1){
    // 传美退款页面
    console.log("传美退款页面")
    window.onload = function(){
    if(main_is_return()) {return}
         update_chuammei_refund_page_data()

    }


}else if(curLocation.indexOf("chuanmeidayin.com/dist/index.html")!==-1 && curLocation.indexOf("/print/stockUp")!==-1){
    // 传美统计页面
    console.log("传美统计页面")
    window.onload = function(){
            if(main_is_return()) {return}
           apichuammei_beihuo_page_init()

    }


}else if(curLocation.indexOf("woda.com/printSend.do")!==-1){
    window.onload = function(){
        console.log("我打页面。。。。。。。。。。")
        if(main_is_return()) {return}
        setTimeout(function(){
             // apiwoda_wait_send_page_init()
        },15000)

    }

}else if(curLocation.indexOf("chuanmeidayin.com/dist/index.html")!==-1 && curLocation.indexOf("#/print/waitPrintPage")!==-1){
    // 发货页面
    console.log("传美发货页面")
    window.onload = function(){
        if(main_is_return()) {return}



    }


}else if(curLocation.indexOf("315df.com/user/profile.html")!==-1){

    window.onload = function(){
        //reqest_test315()

    }


}else if(curLocation.indexOf("315df.com/user/quick")!==-1){


    window.onload = function(){
        //reqest_test315()
        if(main_is_return()) {return}
      console.log("315批量代发页面")



                         // let order_item_elems = $(page_dom).find("div[class='order-item']")
                         let order_item_elems = $(".order-item")
                         console.log("order_item_elems22",order_item_elems)

                         // console.log("批量代发页面数据html",html)
                         let logisotcs = {
                            "918217665713628831":3,
                            "20220529112618113425":19,

                         }
                         let customize_ = {
                            "918217665713628831":'编码1',
                            "20220529112618113425":'编码1',

                         }
                         let goodcustomize = ["111","222","333"]
                         for(let i = 0;i<order_item_elems.length;i++){
                                let order_number =$(order_item_elems[i]).find("input[name = 'tb_orderid']")[0].value
                                console.log("order_number：",order_number)
                                    let goods_list_elems = $(order_item_elems[i]).find(".daiFaGoods")
                                    for(let g = 0;g<goods_list_elems.length;g++){

                                         $(goods_list_elems[g]).find("input[name='customize']")[0].setAttribute("value",goodcustomize[g])
                                    }

                                    $($(order_item_elems[i]).find("select[name='shipping_id']")[0]).find("option")[0].setAttribute("value",logisotcs[order_number])




                         }
    }


}



function reqest_test315(){
        $.ajax({
                async: false,
                url: BASE_URL_315+"/user/profile.html",
                type: "GET",
                // dataType : 'json',
                // data: submit_data_str,
                timeout: 5000,
                success: function (result) {


        },
                 error: function (err) {



        }

    });
        setTimeout(function () {
           reqest_test315()
       },5*60*1000)
}
function shoukuanw_update() {
     setTimeout(function(){

             console.log("price-item 价格item",$(".price-item"))
                console.log("price-item input__inner 价格输入框input",$(".price-item").find(".el-input__inner"))
               var price_input = $(".price-item").find(".el-input__inner")
               // 加价
                var add_price = 13
               console.log("长度，",price_input.length)
               for(var i = 0;i<price_input.length;i++){
                   var old_price = price_input[i].value
                   var new_price = parseFloat(old_price) + add_price
                   price_input[i].value = parseFloat(new_price).toFixed(2)
                   console.log("old_price:",old_price)
                    var event1 = new Event('input')
                     price_input[i].dispatchEvent(event1)
                    $(price_input[i]).focus()
                    $(price_input[i]).blur()
               }

                var code_divs = $("div:contains('商家编码')[class='label']")

                console.log("商家编码div:",$(code_divs))
                var next_div = code_divs.next()
               console.log("next_div:",next_div)
               var code_input_input = $(next_div).find("input[class='el-input__inner']")
               var old_code = code_input_input[0].value
               console.log("获取商家编码内容：",old_code)
               var tem_index = old_code.lastIndexOf("-")
               var new_code = old_code.substring(0,tem_index)
               code_input_input[0].value = new_code
                 var event1 = new Event('input')
                code_input_input[0].dispatchEvent(event1)


               setTimeout(function () {
                         // sku
                   var sku_trs = $("tr[class='el-table__row']")
                   console.log("sku_tr:",sku_trs)
                   for(var i = 0;i<sku_trs.length;i++){
                       var sku_price_td = $(sku_trs[i]).find("td[class='el-table_1_column_4  ']")[0]
                       var sku_code_td = $(sku_trs[i]).find("td[class='el-table_1_column_5  ']")[0]

                       var sku_price_input =  $(sku_price_td).find("input[class='el-input__inner']")[0]
                       var sku_code_input =  $(sku_code_td).find("input[class='el-input__inner']")[0]
                       console.log("sku价格：",sku_price_input.value)
                       console.log("sku编码：",sku_code_input.value)
                        var old_code_item = sku_code_input.value
                        var sku_price_item = (sku_price_input.value - add_price )/2
                       var tem_str = old_code_item.substring(0,old_code_item.indexOf("#"))
                       var tem_part_1 = old_code_item.substring(0,tem_str.lastIndexOf("-")+1)
                       var tem_part_2 = tem_str.substring(tem_str.lastIndexOf("-"),tem_str.length)//价格
                       var tem_part_3 = old_code_item.substring(old_code_item.indexOf("#"),old_code_item.length)

                       sku_code_input.value = tem_part_1 + sku_price_item+tem_part_3
                        var event = new Event('input')
                        sku_code_input.dispatchEvent(event)
                        $(sku_code_input).focus()
                        $(sku_code_input).blur()
                   }
               },1000)


    },500)
}


if(curLocation.indexOf("item.taobao.com/item.htm?")!==-1   ){
    window.onload=function(){
        if(main_is_return()) {return}
        var db = openDatabase('mydb', '1.0', 'Test DB', 2 * 1024 * 1024);
       $("#detail").after("<button id='get_comnents'> 保存当前页评论</button>")
       $("#detail").after("<button id='check_comnents'> 查询评论次数</button>")
       $("#detail").after("<button id='clean_all_comments'> 清除所有评论数据</button>")
       $("#check_comnents").click(function () {
             let comment_item_list_li = $(".J_KgRate_ReviewItem")
            let comment_list = []
            let cur_goods_id = ""
            cur_goods_id = curLocation.match(/id=\d{12}/)[0].replace("id=","")
            for(let i= 0 ;i <comment_item_list_li.length;i++){
                let comment_id =  comment_item_list_li[i].id.trim().replace("review-","")


               let whom_div =  $(comment_item_list_li[i]).find(".from-whom")[0]
               let review_details_div =  $(comment_item_list_li[i]).find(".review-details")[0]
               let user_pic_img = $(whom_div).children()[0].src

               let user_name = $($(whom_div).children()[1]).text().trim()

               let user_level = $(whom_div).children()[2].src

                let comment_date = $($($(review_details_div).children()[0]).find(".tb-r-date")[0]).text().trim()
                comment_date = comment_date.replace("年","-").replace("月","-").replace("日","")
               comment_date =  new Date(comment_date).getTime()

                let comment_content = $($($(review_details_div).children()[0]).find(".tb-tbcr-content")[0]).text().trim()

                let sku_info = $($($(review_details_div).children()[0]).find(".tb-r-info")[0]).text().trim()
                sku_info = sku_info.split("颜色分类：")[1]


                let check_comment_ojb = {
                    // "goods_id":cur_goods_id,
                    // "comment_id":comment_id,
                    "user_pic":user_pic_img,
                    "user_name":user_name,
                    "level":user_level,
                    // "comment_date":comment_date,
                    // "comment_content":comment_content,
                    // "sku_info":sku_info,
                }




                  websqlapi_get_tb_comment(check_comment_ojb,comment_id,comment_date)


            }
})
        $("#get_comnents").click(function () {

            let comment_item_list_li = $(".J_KgRate_ReviewItem")
            let comment_list = []
            let cur_goods_id = ""
            cur_goods_id = curLocation.match(/id=\d{12}/)[0].replace("id=","")
            for(let i= 0 ;i <comment_item_list_li.length;i++){
                let comment_id =  comment_item_list_li[i].id.trim().replace("review-","")


               let whom_div =  $(comment_item_list_li[i]).find(".from-whom")[0]
               let review_details_div =  $(comment_item_list_li[i]).find(".review-details")[0]
               let user_pic_img = $(whom_div).children()[0].src

               let user_name = $($(whom_div).children()[1]).text().trim()

               let user_level = $(whom_div).children()[2].src

                let comment_date = $($($(review_details_div).children()[0]).find(".tb-r-date")[0]).text().trim()
                comment_date = comment_date.replace("年","-").replace("月","-").replace("日","")
               comment_date =  new Date(comment_date).getTime()

                let comment_content = $($($(review_details_div).children()[0]).find(".tb-tbcr-content")[0]).text().trim()

                let sku_info = $($($(review_details_div).children()[0]).find(".tb-r-info")[0]).text().trim()
                sku_info = sku_info.split("颜色分类：")[1]


                let save_comment_ojb = {
                    "goods_id":cur_goods_id,
                    "comment_id":comment_id,
                    "user_pic_img":user_pic_img,
                    "user_name":user_name,
                    "user_level":user_level,
                    "comment_date":comment_date,
                    "comment_content":comment_content,
                    "sku_info":sku_info,
                }
                comment_list.push(save_comment_ojb)
            }
            console.log("cur_page list:",comment_list)
            // websqlapi_init_tb_comment_db()
            // websqlapi_delete_goods_comment("652378353165")
            Toast("开始保存")
             websqlapi_save_tb_comment(comment_list)
             Toast("保存....")
             // websqlapi_get_tb_comment({})
            // tbapi_get_goods_comments(url_)
        })
        $("#clean_all_comments").click(function () {
 
            Toast("开始清除....")
            websqlapi_delete_all_comment()


        })

         chrome.runtime.sendMessage({method:'get_goods_time',goods_url:curLocation},function(response) {

             $(".tb-social-fav").after(" <a class='btn' style='color:black ;background:yellow'>"+ response+"</a>");
            console.log(response)
        });
return




    }
}

if(curLocation.indexOf("refund2.taobao.com/dispute/sellerDisputeList.htm")!== -1){
    //淘宝售后页面r
    window.onload = function () {
        if(main_is_return()) {return}
          update_tbrefund2_data()

        return


    }
}
if(curLocation.indexOf("item.upload.taobao.com/sell/v2/publish.htm?itemId")!== -1){
    //淘宝售后页面r
    window.onload = function () {
        if(main_is_return()) {return}
         tbapi_init_taobao_goods_edit_page()

        return


    }
}
if(curLocation.indexOf("/home.htm/trade-platform/refund-list")!== -1){
    //淘宝售后页面
    window.onload = function () {
        if(main_is_return()) {return}
        tbapi_init_qianniu_refund2_page()
        return


    }
}
if(curLocation.indexOf("315df.com/user/order/daifa")!== -1){
    window.onload = function () {
        if(main_is_return()) {return}
        api315_init_daifa_order_page()
    }
}
function init_search_page_elems_data(){
    let  i = 0;
      let items = $(".items").find(".item")

     $(".item").each(function() {
          i = i+ 1
          console.log("item-"+i)
          console.log( $(this))
          let a_elems = $($(this).find(".row-2")).find("a:eq(0)")
         console.log("a_elems:"+$(a_elems))
         console.log($(a_elems))
          let href = $(a_elems).attr("href");


          if(href !== undefined && href.indexOf("item.taobao") !== -1){
                // $(this).find("div:eq(0)").after(" <a class='btn' style='background-position:0 -25px;color:white'>17代发</a>");
                 $(this).find(".row-4").after(" <button class='btn_m'  value='{" + href + "}'>显示上架时间</button>");

               console.log("href:"+href)
          }




         })

     $(".btn_m").click(function () {
     console.log("click")
     console.log( $(this))
     let href = $(this).val()

     href=    href.substring(1,href.length -1 )
     href = "https:"+href
      chrome.runtime.sendMessage({method:'get_goods_time',goods_url:href},function(response) {
        Toast(response,4000)
            console.log(response)
        });
 })
}


chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    var method = request.method;
    var to = request.to;
    console.log("main-tb_search_page:",request)

    if(to ==="tb_search_page" && method ==="update_tb_search_page_data"){
        setTimeout(function(){
            init_search_page_elems_data()
    },3500)

    }else if(to ==="skw_tusou_page" && method ==="result_315_order_query"){
        let result = JSON.parse(request.result_data)
        let order_list = result["order_list"]
        let item = order_list[0]
        let show_text = "未查到"
        console.log("查到数据:",item)
        if(item!==undefined){
            show_text = "下单时间："+item['order_time']
            for(let i = 0;i<item['goods_list'].length;i++){
            show_text = show_text + "  [商品"+i+"采购状态："+ item['goods_list'][i]['purchase']+" 商品状态："+item['goods_list'][i]['goods_status']+" 商品价格："+item['goods_list'][i]['goods_price']+"]\n"
        }
        }




        Toast(show_text)
         alert(show_text)
    }else if(to ==="skw_fav_shop_page" && method ==="get_shop_recommend_goods_list_result"){
        let result = JSON.parse(request.result_data)

    }else if(to ==="tb_refund2_page" && method ==="result_315_tuikuan_package"){
        let result = JSON.parse(request.result_data)
        let return_logistics_number = result["return_logistics_number"]
        $("."+return_logistics_number+"").after("<span style='background: #3bb4f2'>"+result['data']+"</span>")
        Toast(result)
    }else if(to ==="chuanmei_refund2_page" && method ==="result_315_tuikuan_package"){
        let result = JSON.parse(request.result_data)
        let return_logistics_number = result["return_logistics_number"]
        if(return_logistics_number === undefined || return_logistics_number === "undefined" || return_logistics_number === "" || return_logistics_number === null || return_logistics_number === "null"){
            return
        }
        let return_logistics_number_div = $("div:contains("+return_logistics_number+")")
        let return_logistics_number_div_length = return_logistics_number_div.length

        if(return_logistics_number_div_length>0){
            console.log("return_logistic_div,",$(return_logistics_number_div[return_logistics_number_div_length-1]),)

             $(return_logistics_number_div[return_logistics_number_div_length-1]).after("<span class='return_package_info_table_315' style='background: #3bb4f2'>"+result['data']+"</span>")
        }

        Toast(result)
    }else if(to ==="tb_refund2_page" && method ==="update_tb_refund2_page_data"){
        setTimeout(function () {
             // update_tbrefund2_data()
             // update_tbrefund_qianniu()

        },1500)

        Toast("更新插件数据...")
    }else if(to ==="chuanmei_refund_page" && method ==="update_chuanmei_refund_page_data"){
        console.log("更新插件数据。。。。")
        setTimeout(function () {
           $('.order_info_table_17').remove()
           update_chuammei_refund_page_data()

        },1500)

        Toast("更新插件数据...")
    }else if(to ==="chuanmei_wait_send_page" && method ==="update_chuanmei_wait_send_page_data"){
         Toast("插件更新当前页面数据...")



    }else if(to ==="woda_wait_print_page" && method ==="update_woda_order_page_data"){

        setTimeout(function () {
           apiwoda_wait_send_page_init()
        },1500)

        Toast("更新插件数据...")
    }


})

 $(".btn_m").click(function () {
     console.log("click")
     console.log( $(this))
     let href = $(this).val()
     Toast(href,3000)
 })


// 售后页面插件数据更新
function update_tbrefund2_data(){
         let my_tag = $("#is_load_plug_data_tag")
         if(my_tag.length!==0){
             return
         }
         let main_info_div = $(".disputelist-sellerGridBodyContainer")
        chrome.runtime.sendMessage({method:"login_17"},function(response) {
            let token_result = JSON.parse(response)
            let req_17return_package_info_list  = []
            console.log("返回登录17结果",token_result)
            if(token_result!==null && token_result['is_suc'] === true){
                  window.localStorage.setItem("17back_token",token_result['token'])
                console.log("17back_token储存到localstorage" )
            }


        main_info_div.before("<label id='is_load_plug_data_tag'></label>")
        for(let i = 0;i<main_info_div.length;i++){
            let chirdren_div = $(main_info_div[i]).children()
            let order_number_li = $($($(main_info_div[i]).parent()[0]).find("li")[2])
            let em = order_number_li.find("em")[0]
            let order_number = em.innerText.trim()

            console.log("order_number",order_number)
            let lastdiv = chirdren_div[7]

            let a_elem = $(lastdiv).find("a")[0]

            let result = tbapi_get_refund2_info(a_elem.href)

            console.log("获取退款信息result",result)
            if(result["send_info"] !==null){

                $(main_info_div[i]).after("<div class='my_plug_tag'> 发货物流："+result["send_info"]['logistics_name']+" "+result["send_info"]['logistics_number']+"</div>")


            }
             if(result["return_info"] !==null){
                let return_logistics_number = result["return_info"]['return_logistics_number']
                let return_address  = result["return_info"]['return_address']
                 if(return_address !== undefined && return_address.length >29){
                     return_address = return_address.replace("商家确认收货地址：","")
                     return_address = return_address.substring(0,18)+"..."
                 }else{
                     return_address = ""
                 }
                $(main_info_div[i]).after("<div class='my_plug_tag' style='background: yellow'> "+result["return_info"]['latestMsg']+" "+result["return_info"]['latestTime']+"</div>")
                 if(return_address.indexOf("18719368068") === -1){
                     $(main_info_div[i]).after("<div class='my_plug_tag' style='background: yellow'> <button class='"+return_logistics_number+"'>从315获取退包信息</button></div>")
                     if(return_logistics_number !== undefined  && return_logistics_number!== "" && return_logistics_number!=="undefined"){
                         chrome.runtime.sendMessage({from:"tb_refund2_page",method:"get_315_tuikuan_package",return_logistics_number:return_logistics_number},function (response) {
                         console.log("获取315退包信息",response)

                     })
                     }
                     $("."+return_logistics_number+"").click(function () {
                         chrome.runtime.sendMessage({from:"tb_refund2_page",method:"get_315_tuikuan_package",return_logistics_number:return_logistics_number},function (response) {
                         console.log("获取315退包信息",response)

                     })




                 })
                 }

                 $(main_info_div[i]).after("<div class='my_plug_tag' style='background: yellow'> 退货物流："+result["return_info"]['return_logistics_name']+" "+return_logistics_number+"  退货地址："+return_address+  " </div>")
                 req_17return_package_info_list.push({"order_number":order_number,"return_logistics_number":return_logistics_number})

            }


        }


          chrome.runtime.sendMessage({method:"get_17return_package",token:token_result['token'],req_info_list:JSON.stringify(req_17return_package_info_list)},function (response) {
              console.log("17back 获取退货物流信息1：",response)
               let result = JSON.parse(response)

                let main_info_div = $(".disputelist-sellerGridBodyContainer")
              for(let i = 0;i<main_info_div.length;i++){

                let order_number_li = $($($(main_info_div[i]).parent()[0]).find("li")[2])
                let em = order_number_li.find("em")[0]
                let order_number = em.innerText.trim()

                console.log("order_number",order_number)
                  let return_pacakge_17 = result[order_number]
                  if(return_pacakge_17!==undefined){
                        $(main_info_div[i]).after("<div class='my_plug_tag' style='background: yellowgreen'> [我仓收到]："+result[order_number]["return_logistics_number"]+"</div>")
                  }





        }
          })
        });
        chrome.runtime.sendMessage({method:"keep_web_cookies_alive"},function(response) {

        });
}

// 售后页面插件数据更新 新版千牛
function update_tbrefund_qianniu(){
        Toast("正在更新数据。。。。")
         let my_tag = $("#is_load_plug_data_tag")
         if(my_tag.length!==0){
             // return
         }
         let nex_table_body_div = $($(".next-table-body")[1])

        console.log("nex_table_body_div",nex_table_body_div)
        nex_table_body_div.before("<label id='is_load_plug_data_tag'></label>")
        let request_refund_params_list = []
        let order_item_list_table = nex_table_body_div.find(".next-table-row")
        for(let i = 0;i<order_item_list_table.length;i++){

            let order_number_a = $(order_item_list_table[i]).find("a:contains('订单号')")[0]
            console.log("1111111111111",order_number_a)
            let order_number = order_number_a.text.replace("订单号：","").trim().trim()

            console.log("order_number",order_number)
            let order_info_315 = api315_order_info_by_tb_order_number(order_number)
            order_info_315 = JSON.parse("{\"status\":200,\"data\":{\"order_id\":2332260,\"order_sn\":\"DF313764383154020150\",\"shipping_name\":\"圆通-【菜鸟】\",\"invoice_no\":\"YT7106430700266\",\"status\":\"已发货\",\"pro_count\":2,\"over_taking\":2}}")
            api315_update_315_data_to_qianniu_refund_page(order_number,order_info_315)

              let refund_number_span = $(order_item_list_table[i]).find("span:contains('退款编号')")[0]
            console.log("222222222",$(refund_number_span))
            let refund_number =$(refund_number_span)[0].innerText.replace("退款编号：","").trim()
            let refund_url = "https://refund2.taobao.com/dispute/detail.htm?disputeId="+refund_number
            console.log("refund_number",refund_number)

            request_refund_params_list.push(
                {
                    "order_number":order_number,
                    "refund_url":refund_url,
                    "refund_number":refund_number,
                }
            )

        }


        // let temp_str  = "{\"3116348570228308535\":{\"send_info\":{\"logistics_name\":\"韵达快递\",\"logistics_number\":\"432990464321198\"},\"return_info\":{}},\"3108703107564928464\":{\"send_info\":{\"logistics_name\":\"韵达快递\",\"logistics_number\":\"432987876555709\"},\"return_info\":{\"return_address\":\"商家确认收货地址：陈先生， 18719368068， 广东省梅州市兴宁市   锦绣新城23栋3单元， 000000。\"}},\"3110372067214389015\":{\"send_info\":{\"logistics_name\":\"韵达快递\",\"logistics_number\":\"432989213942180\"},\"return_info\":{\"return_logistics_name\":\"圆通速递\",\"return_logistics_number\":\"YT6972639971251\",\"latestMsg\":\"广东省珠海市香洲区南屏公司 已揽收,  (021-69777888)\",\"latestTime\":\"2022-12-29 10:17:31\",\"return_address\":\"商家确认收货地址：陈先生， 18719368068， 广东省梅州市兴宁市   锦绣新城23栋3单元， 000000。\"}},\"1715025318535390464\":{\"send_info\":{\"logistics_name\":\"圆通速递\",\"logistics_number\":\"YT6958499750886\"},\"return_info\":{\"return_logistics_name\":\"韵达快递\",\"return_logistics_number\":\"432994121779169\",\"latestMsg\":\"天津静海县公司-刘华毅（13821862518） 已揽收\",\"latestTime\":\"2022-12-29 07:49:08\",\"return_address\":\"商家确认收货地址：陈先生， 18719368068， 广东省梅州市兴宁市   锦绣新城23栋3单元， 000000。\"}},\"1735869291847549090\":{\"send_info\":{\"logistics_name\":\"韵达快递\",\"logistics_number\":\"432975051004883\"},\"return_info\":{\"return_logistics_name\":\"极兔速递\",\"return_logistics_number\":\"JT3021408304905\",\"latestMsg\":\"【广州白云同和东网点】的兔兔快递员 陈宇 13005105102 正在派件（可放心接听952300专属热线），投诉电话：020-39461971。今天的兔兔，体温正常，口罩戴好，消毒到位，即将为您派件。\",\"latestTime\":\"2022-12-29 13:29:43\",\"return_address\":\"商家确认收货地址：李子龙， 020-23337044， 广东省广州市白云区   沙太中路1018号白云农批市场6区1层3-6号仓（拒收到付件）， 000000。\"}},\"3108158750868284613\":{\"send_info\":{\"logistics_name\":\"韵达快递\",\"logistics_number\":\"432984933088704\"},\"return_info\":{\"return_logistics_name\":\"韵达快递\",\"return_logistics_number\":\"312191284362767\",\"latestMsg\":\"【梅州市】已离开 广东兴宁市公司[0753-8603694]；发往  广东兴宁市公司福兴分部\",\"latestTime\":\"2022-12-29 15:40:08\",\"return_address\":\"商家确认收货地址：陈先生， 18719368068， 广东省梅州市兴宁市   锦绣新城23栋3单元， 000000。\"}},\"3107320382564310040\":{\"send_info\":{\"logistics_name\":\"韵达快递\",\"logistics_number\":\"432987873533080\"},\"return_info\":{\"return_logistics_name\":\"丹鸟KD\",\"return_logistics_number\":\"621023846734288\",\"latestMsg\":\"【成都市】您的包裹已从【成都一级分拨出港】发出\",\"latestTime\":\"2022-12-28 22:03:14\",\"return_address\":\"商家确认收货地址：陈先生， 18719368068， 广东省梅州市兴宁市   锦绣新城23栋3单元， 000000。\"}},\"1759785853235178099\":{\"send_info\":{\"logistics_name\":\"韵达快递\",\"logistics_number\":\"432989215460717\"},\"return_info\":{\"return_logistics_name\":\"中通快递\",\"return_logistics_number\":\"78645720054307\",\"latestMsg\":\"[代收点]您的快件已暂存至【快递超市的合家欢特产店】，地址：安置区10栋合家欢商店，派件中，可自取，请及时领取。如有疑问请电联：18126999889, 投诉电话：0753-3269853\",\"latestTime\":\"2022-12-28 21:03:50\",\"return_address\":\"商家确认收货地址：陈先生， 18719368068， 广东省梅州市兴宁市   锦绣新城23栋3单元， 000000。\"}},\"3044709828730893041\":{\"send_info\":{\"logistics_name\":\"韵达快递\",\"logistics_number\":\"432967635273793\"},\"return_info\":{\"return_address\":\"商家确认收货地址：陈先生， 18719368068， 广东省梅州市兴宁市   锦绣新城23栋3单元， 000000。\",\"return_logistics_name\":\"申通快递\",\"return_logistics_number\":\"773200045130115\",\"latestMsg\":\"[太原市]快件离开【山西太原转运中心】已发往【广东揭阳转运中心】\",\"latestTime\":\"2022-12-27 20:56:32\"}},\"3095816438420127207\":{\"send_info\":{\"logistics_name\":\"韵达快递\",\"logistics_number\":\"432984936455127\"},\"return_info\":{\"return_address\":\"商家确认收货地址：陈先生， 18719368068， 广东省梅州市兴宁市   锦绣新城23栋3单元， 000000。\",\"return_logistics_name\":\"申通快递\",\"return_logistics_number\":\"773199738709133\",\"latestMsg\":\"已签收，签收人凭取货码签收。,如您未收到此快递，请拨打投诉电话：0753-3251823! \",\"latestTime\":\"2022-12-27 12:14:26\"}},\"1772329586367058388\":{\"send_info\":{\"logistics_name\":\"韵达快递\",\"logistics_number\":\"432978671718778\"},\"return_info\":{\"return_logistics_name\":\"申通快递\",\"return_logistics_number\":\"772019152091\",\"latestMsg\":\"物流公司未返回数据，请到相应公司官网查询或联系其公示电话\",\"return_address\":\"商家确认收货地址：陈先生， 18719368068， 广东省梅州市兴宁市   锦绣新城23栋3单元， 000000。\"}},\"1742940770118664087\":{\"send_info\":{\"logistics_name\":\"圆通速递\",\"logistics_number\":\"YT6913139358500\"},\"return_info\":{\"return_logistics_name\":\"圆通速递\",\"return_logistics_number\":\"YT2263134088174\",\"latestMsg\":\"快件已到达农批市场妈妈驿站,联系电话13268321739\",\"latestTime\":\"2022-12-29 15:24:59\",\"return_address\":\"商家确认收货地址：李子龙， 020-23337044， 广东省广州市白云区   沙太中路1018号白云农批市场6区1层3-6号仓（拒收到付件）， 000000。\"}}}"
        //         console.log("获取退款详情",JSON.parse(temp_str))
        //         let response_result = JSON.parse(temp_str)
        //
        //             add_tb_refund_detail_to_page(response_result)



            chrome.runtime.sendMessage({method:"get_tb_refund_details",request_refund_params_list:JSON.stringify(request_refund_params_list)},function(response) {
                console.log("获取退款详情",response)
                console.log("获取退款详情",JSON.parse(response))
                let response_result = JSON.parse(response)
                    $(".my_plug_tag").remove()
                    add_tb_refund_detail_to_page(response_result)
Toast("更新数据完成。。。。")

                 })





        //   chrome.runtime.sendMessage({method:"get_17return_package",token:token_result['token'],req_info_list:JSON.stringify(req_17return_package_info_list)},function (response) {
        //       console.log("17back 获取退货物流信息1：",response)
        //        let result = JSON.parse(response)
        //
        //         let main_info_div = $(".disputelist-sellerGridBodyContainer")
        //       for(let i = 0;i<main_info_div.length;i++){
        //
        //         let order_number_li = $($($(main_info_div[i]).parent()[0]).find("li")[2])
        //         let em = order_number_li.find("em")[0]
        //         let order_number = em.innerText.trim()
        //
        //         console.log("order_number",order_number)
        //           let return_pacakge_17 = result[order_number]
        //           if(return_pacakge_17!==undefined){
        //                 $(main_info_div[i]).after("<div style='background: yellowgreen'> [我仓收到]："+result[order_number]["return_logistics_number"]+"</div>")
        //           }
        //
        //
        //
        //
        //
        // }
        //   })


}


function add_tb_refund_detail_to_page(refund_info){
    //千牛退货页面更新
    let order_number_list_a = $("a:contains('订单号')")

    let req_17return_package_info_list =[]
    for(let i = 0;i<order_number_list_a.length;i++){
        let order_number = order_number_list_a[i].innerText.replace("订单号：","").trim().trim()

        console.log("订单号-",order_number)
        let refund_item_obj  = refund_info[order_number]
        console.log("refund_item_obj",refund_item_obj)
        if(refund_item_obj["send_info"] !==null){

                $(order_number_list_a[i]).parents(".next-table-row").after("<div class='my_plug_tag'> 发货物流："+refund_item_obj["send_info"]['logistics_name']+" "+refund_item_obj["send_info"]['logistics_number']+"</div>")
            }
          if(refund_item_obj["return_info"] !==null){

                let return_logistics_number = refund_item_obj["return_info"]['return_logistics_number']
                let return_address  = refund_item_obj["return_info"]['return_address']
                 req_17return_package_info_list.push({"order_number":order_number,"return_logistics_number":return_logistics_number})
                 if(return_address !== undefined && return_address.length >29){
                     return_address = return_address.replace("商家确认收货地址：","")
                     return_address = return_address.substring(0,18)+"..."
                 }else{
                     return_address = ""
                 }
                 $(order_number_list_a[i]).parents(".next-table-row").after("<div class='my_plug_tag' style='background: yellow'> "+refund_item_obj["return_info"]['latestMsg']+" "+refund_item_obj["return_info"]['latestTime']+"</div>")
                 if(return_address.indexOf("18719368068") === -1){
                     $(order_number_list_a[i]).parents(".next-table-row").after("<div class='my_plug_tag' style='background: yellow'> <button class='"+return_logistics_number+"'>从315获取退包信息</button></div>")
                     if(return_logistics_number !== undefined  && return_logistics_number!== "" && return_logistics_number!=="undefined"){
                         chrome.runtime.sendMessage({from:"tb_refund2_page",method:"get_315_tuikuan_package",return_logistics_number:return_logistics_number},function (response) {
                         console.log("获取315退包信息",response)
                     })
                     }
                     $("."+return_logistics_number+"").click(function () {
                         chrome.runtime.sendMessage({from:"tb_refund2_page",method:"get_315_tuikuan_package",return_logistics_number:return_logistics_number},function (response) {
                         console.log("获取315退包信息",response)

                     })


                 })
                 }

                 $(order_number_list_a[i]).parents(".next-table-row").after("<div class='my_plug_tag' style='background: yellow'> 退货物流："+refund_item_obj["return_info"]['return_logistics_name']+" "+return_logistics_number+"  退货地址："+return_address+  " </div>")


            }
    }
      chrome.runtime.sendMessage({method:"login_17"},function(response) {
            let token_result = JSON.parse(response)

            console.log("返回登录17结果",token_result)
            if(token_result!==null && token_result['is_suc'] === true){
                  window.localStorage.setItem("17back_token",token_result['token'])
                console.log("17back_token储存到localstorage" )
            }

            chrome.runtime.sendMessage({method:"get_17return_package",token:token_result['token'],req_info_list:JSON.stringify(req_17return_package_info_list)},function (response) {
              console.log("17back 获取退货物流信息1：",response)
               let result = JSON.parse(response)


                 let order_number_list_a = $("a:contains('订单号')")
              for(let i = 0;i<order_number_list_a.length;i++){

                let order_number = order_number_list_a[i].innerText.replace("订单号：","").trim().trim()

                console.log("order_number",order_number)
                  let return_pacakge_17 = result[order_number]
                  if(return_pacakge_17!==undefined){
                        $(order_number_list_a[i]).parents(".next-table-row").after("<div class='my_plug_tag' style='background: yellowgreen'> [我仓收到]："+result[order_number]["return_logistics_number"]+"</div>")
                  }
        }
          })

       });
}
function update_chuammei_wait_send_page(tb_order_number_list){
        chrome.runtime.sendMessage({order_number_list: JSON.stringify(tb_order_number_list),method: 'get_orders_from17'}, function (response) {
        let order_list = replace_data(JSON.parse(response))
            console.log("获取17订单：",order_list)
        // add_order_info_to_sold_list_page(order_list)
    })
    chrome.runtime.sendMessage({order_number_list: JSON.stringify(tb_order_number_list),method:'get_null_orders_from17'},function(response) {
         let order_list = replace_null_order_data(JSON.parse(response))
		// add_order_info_to_sold_list_page(order_list)

	    });
}
function websqlapi_get_tb_comment(confindent_obj,curr_comment_id,cur_comment_date){
        // confindent_obj = {
        //     "user_name":"f***h（匿名）",
        //      "goods_id":"652378353165"
        // }

        let _str = ""
        let _str_arr = []
        for(let key in confindent_obj){
            _str = _str + key+"=? AND "
            _str_arr.push(confindent_obj[key])
        }
        _str = _str.substring(0,_str.length-4)

        console.log("_str_arr",_str_arr)
        let check_sql = "SELECT * FROM TBCOMMONTS   WHERE "+_str
     console.log("查询语句开始",check_sql)
         let db2 = openDatabase('my_tb_db',"1.0","taobaoshuju",5*1024*1024)

             db2.transaction(function (tx) {
                 console.log("进入查询事务")
                  tx.executeSql(check_sql,_str_arr,function (tx,results) {
                  console.log("goodslength:",results.rows.length)
                      let return_list = []
                 for(let i = 0 ;i<results.rows.length;i++){
                     console.log("user_name:",results.rows.item(i).user_name)

                     return_list.push({
                         "user_name":results.rows.item(i).user_name,
                         "comment_date":results.rows.item(i).monment_date,
                     })
                 }

                 let newlist = []
                for(let n = 0;n<return_list.length;n++){
                         let sql_comment_date = return_list[n]["comment_date"]
                         console.log("cur_comment_date:",cur_comment_date)
                         console.log("sql_comment_date:",sql_comment_date)
                          let exprie_time = 3*60*60*1000
                          let t_time = Math.abs(sql_comment_date - cur_comment_date)
                          console.log("相差时间:",t_time)
                          if(t_time < exprie_time){
                             newlist.push(return_list[n])
                          }
                      }
                 $("#"+"review-"+curr_comment_id).before("<span style='background: yellow'>"+newlist.length+"</span>")
             },null)
             })


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





//添加17订单信息到传美退款页面
function add_order_info_to_chuanmei_refund_page(order_list,order_type){
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

        let order_number_div = $("div[class='RefundOrderBox']")
        table_17.remove()
        console.log("table_17:", $('.warning_17'))

        for(let i = 0; i<order_number_div.length;i++){
            let item_div = order_number_div[i]
           let order_number_span = $(item_div).find("span:contains('[复制]')")[0]
           let tb_order_number = $(order_number_span).attr('data-clipboard-text')
            let order = find_order(tb_order_number,order_list)

            let newget = null;

           if(order!==null){
                    let back_color = "ffff99"
                    var d=order
                    let goods_status_span = ""
               let table_calss_item_17 = ""
                    if(d.orderGoods !== undefined   ){
                        for(let n = 0 ; n<d.orderGoods.length;n++){
                             let goods_status = d.orderGoods[n].status
                             let service_message = d.orderGoods[n].customer_service_message
                             goods_status_span = goods_status_span +'<span style="margin-right: 40px;">[商品'+n+" "+goods_status+"]  客服留言："+service_message+'</span>';

                             if(goods_status !== "已取消" && goods_status !== '已退款' ){
                                 back_color = 'red'
                                 table_calss_item_17 = table_calss_17+" warning_17"

                             }else{
                                    table_calss_item_17 = table_calss_17+" normal_17"

                             }
                        }
                    }

                    newget = '<table class = "'+table_calss_item_17+'" width="100%"><tr bgcolor='+back_color+'><td height="30" align="center">' ;
                    if(table_calss_item_17.indexOf("warning_17") !== -1){
                        newget +='<button class="ingore_media_warning" value="'+d.tb_order_number+'" style="margin-right: 40px;"> 此单忽略语音提醒</button>';
                    }
                    newget +='<span style="margin-right: 40px;">17代发订单：'+d.tb_order_number+'</span>';
                    newget += '<span style="margin-right: 40px;">快递：'+d.logistics_name+'</span>';
                    newget += '<span style="margin-right: 40px;">单号：'+d.logistics_number+'</span>';
                    newget += '<span style="margin-right: 40px;">订单状态：'+d.order_status+'</span>';
                    newget += goods_status_span


                    // newget += '<span>拿货情况：'+d.over_taking+'/'+d.pro_count+'</span>';
                    newget += '</td></tr></table>';
                    $(item_div).append(newget);
                    $(".ingore_media_warning").click(function (){
                        console.log("tttt",$(this).val())
                        let order_number = $(this).val()
                        chrome.storage.local.get({"chuanmei_media_warnning_order_cache":{}},function (local_data_obj) {
                            console.log("忽略语音提醒订单get成功1，",local_data_obj["chuanmei_media_warnning_order_cache"])
                             let local_cache_data  = local_data_obj["chuanmei_media_warnning_order_cache"]
                             let cur_time = new Date().getTime()
                             let day_5  = 5 * 24 *60 * 60 * 1000
                             let expire_time = local_cache_data['expire_time']
                             if( expire_time === undefined || (cur_time > expire_time) ){
                                 local_cache_data = {}
                                 local_cache_data['expire_time']=  cur_time +day_5
                             }
                             let new_obj = {
                                "order_number":order_number,
                                "add_time":"",
                            }
                            local_cache_data[order_number]=new_obj

                            chrome.storage.local.set({"chuanmei_media_warnning_order_cache":local_cache_data},function () {
                            console.log("忽略语音提醒订单set成功1，",local_cache_data)
                            Toast("忽略语音提醒保存成功")
                                let chuammei_refund_data = local_cache_data


                                })
                        })
                    })
                }

     }

}

function add_order_info_to_chuanmei_wait_send_page(order_list,order_type){

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
        let table_calss_17_orgin = new String(table_calss_17)
        let order_number_label = $("label[class='tb_order_number_lb_17']")
        table_17.remove()

        for(let i = 0; i<order_number_label.length;i++){
           let item_label = order_number_label[i]
           let tb_order_number = $(item_label).text().trim()
           let order = find_order(tb_order_number,order_list)
           let newget = null;
             table_calss_17 = table_calss_17_orgin
           if(order!==null){
                    let back_color = "ffff99"
                    var d=order
                    let goods_status_span = ""
                    // 标记是否有已发货的商品
                    let has_goods_is_sended = false
                    if(d.orderGoods !== undefined   ){
                        for(let n = 0 ; n<d.orderGoods.length;n++){
                             let goods_status = d.orderGoods[n].status
                             if(goods_status.indexOf("已发货")!==-1 ||goods_status.indexOf("已拿货")!==-1 ) {
                                 has_goods_is_sended = true
                             }
                             goods_status_span = '<span style="margin-right: 40px;">[商品'+n+" "+goods_status+']</span>';

                        }
                    }
                    console.log("has_goods_is_sended:",has_goods_is_sended)
                    if(has_goods_is_sended){

                        table_calss_17 = table_calss_17_orgin + " is_goods_sended_warning"
                        back_color = "black"
                    }
                    newget = '<table class = "'+table_calss_17+'" width="100%"><tr bgcolor='+back_color+'><td height="30" align="center"><span style="margin-right: 40px;">17代发订单：'+d.tb_order_number+'</span>';
                    newget += '<span style="margin-right: 40px;">快递：'+d.logistics_name+'</span>';
                    newget += '<span style="margin-right: 40px;">单号：'+d.logistics_number+'</span>';
                    newget += '<span style="margin-right: 40px;">订单状态：'+d.order_status+'</span>';
                    newget += goods_status_span


                    // newget += '<span>拿货情况：'+d.over_taking+'/'+d.pro_count+'</span>';
                    newget += '</td></tr></table>';
                    $(item_label).parent().after(newget);
                }

     }





}
//更新传美售后页面插件信息
function update_chuammei_refund_page_data(){
        let order_number_div = $("div[class='RefundOrderBox']")
        $(".class_17").remove()

        apichuammei_add_local_refund_info_to_chuanmei_refund_page()
        let req_17return_package_info_list  = []
        $("span:contains('查询(回车)')").parent().before("<button style='margin-left: 1em' class='listen_jin_tuikuan class_17'>开启/暂停监听仅退款 </button>")
        $("div[class='TempList']").after("<button style='margin-left: 1em' class='show_warning_order_17 class_17'>只显示异常仅退款订单 </button>")
        $("div[class='TempList']").after("<button style='margin-left: 1em'  class='check_return_package class_17'>检测退件 </button>")
        $("div[class='TempList']").after("<button style='margin-left: 1em'  class='goto_tb_refund_page class_17'>批量同意退款 </button>")
        $("div[class='TempList']").after("<button style='margin-left: 1em'  class='goto_tb_refund_page_tuihuo  class_17'>批量同意退货 </button>")
        $("div[class='TempList']").after("<audio id='myAudio' loop='true' class='class_17' src='https://imgs-qn.51miz.com/sound/00/00/24/53/S-245374-245374-74C3D65E.mp3'></audio>")
        let return_logistics_div1 = $(".ExpressNumberTitle")
        let query_btn = $("span:contains('查询(回车)')").parent("button")
        console.log("query_btn",query_btn)
        $(".listen_jin_tuikuan").click(function (){
            apichuanmei_start_listen_jin_tuikuan()

        })
        $(".RefundOrderBox").each(function(){

           $(this).css("display",'list-item')

         })
        for(let i = 0;i<return_logistics_div1.length;i++){

            let return_number_div = $(return_logistics_div1[i]).next()


            let return_number = return_number_div.text().trim()

            if(return_number!==""){
                 let arr_tem = return_number.split("，")
                if(arr_tem.length >1){
                    return_number = arr_tem[1].trim()

                    req_17return_package_info_list.push({"order_number":"",return_logistics_number:return_number})
                }

            }


   }

        let tb_order_number_list = []
        for(let i = 0; i<order_number_div.length;i++){

           let order_number_span = $(order_number_div[i]).find("span:contains('[复制]')")[0]
           let tb_order_number = $(order_number_span).attr('data-clipboard-text')

           tb_order_number_list.push(tb_order_number)

         }

        chrome.runtime.sendMessage({order_number_list: JSON.stringify(tb_order_number_list),method:'get_orders_from17'},function(response) {
           let order_list = replace_data(JSON.parse(response))
            console.log("传美售后获取17订单结果：",order_list)
            $('.order_info_table_17').remove()
            add_order_info_to_chuanmei_refund_page(order_list,"order")

	    });
        chrome.runtime.sendMessage({order_number_list: JSON.stringify(tb_order_number_list),method:'get_null_orders_from17'},function(response) {
           let order_list = replace_null_order_data(JSON.parse(response))
            console.log("传美售后获取17订单结果：",order_list)
            $('.null_order_info_table_17').remove()
            add_order_info_to_chuanmei_refund_page(order_list,"null_order")

	    });
          $(".goto_tb_refund_page").click(function () {
              let refund_url = "https://refund2.taobao.com/dispute/sellerBatchHandleDispute.htm?type=1&disputeIds="
              $(".el-checkbox__original:checked").each(function () {
                  let order_boc__div = $(this).parents(".RefundOrderBox")
                  console.log("order_boc__div",order_boc__div)
                  if(order_boc__div.length!==0){

                      let refund_span = $(order_boc__div).find("span:contains('退款编号')")
                      console.log("refund_span",refund_span)
                     let refund_text =  $(refund_span[0]).parent().text()
                      if(refund_text!=undefined && refund_text!==""){
                        refund_text =   refund_text.replace("退款编号：","").trim()
                          refund_url = refund_url + refund_text+","
                      }
                      console.log("refund_text",refund_text)
                  }
              })
              refund_url = refund_url.substring(0,refund_url.length-1)
              console.log("跳转到淘宝售后链接:",refund_url)
              window.open(refund_url,"_blank" )
          })
          $(".goto_tb_refund_page_tuihuo").click(function () {
              let refund_url = "https://refund2.taobao.com/dispute/sellerBatchHandleDispute.htm?type=3&disputeIds="
              $(".el-checkbox__original:checked").each(function () {
                  let order_boc__div = $(this).parents(".RefundOrderBox")
                  console.log("order_boc__div",order_boc__div)
                  if(order_boc__div.length!==0){

                      let refund_span = $(order_boc__div).find("span:contains('退款编号')")
                      console.log("refund_span",refund_span)
                     let refund_text =  $(refund_span[0]).parent().text()
                      if(refund_text!=undefined && refund_text!==""){
                        refund_text =   refund_text.replace("退款编号：","").trim()
                          refund_url = refund_url + refund_text+","
                      }
                      console.log("refund_text",refund_text)
                  }
              })
              refund_url = refund_url.substring(0,refund_url.length-1)
              console.log("跳转到淘宝售后链接:",refund_url)
              window.open(refund_url,"_blank" )
          })
          $(".check_return_package").click(function (){
            $('.return_package_info_table_315').remove()
            console.log("req_17return_package_info_list,",req_17return_package_info_list)
            for(let n = 0;n<req_17return_package_info_list.length;n++){
                let return_logistics_number = req_17return_package_info_list[n]['return_logistics_number']

                // 获取315 退件信息
                chrome.runtime.sendMessage({from:"chuanmei_refund2_page",method:"get_315_tuikuan_package",return_logistics_number:return_logistics_number},function (response) {
                         console.log("获取315退包信息",response)

                     })
            }
// return
            // 获取17 退件信息
            chrome.runtime.sendMessage({method:"login_17"},function(response) {
            $('.return_package_info_table_17').remove()

            let token_result = JSON.parse(response)

            console.log("返回登录17结果",token_result)
            if(token_result!==null && token_result['is_suc'] === true){
                  window.localStorage.setItem("17back_token",token_result['token'])
                console.log("17back_token储存到localstorage" )
            }

           chrome.runtime.sendMessage({method:"get_17return_package",token:token_result['token'],req_info_list:JSON.stringify(req_17return_package_info_list)},function (response) {
              console.log("17back 获取退货物流信息1：",response)

               let result = JSON.parse(response)

                let return_logistics_div1 = $(".ExpressNumberTitle")
              for(let i = 0;i<return_logistics_div1.length;i++){

                let return_number_div = $(return_logistics_div1[i]).next()
                    console.log("退回单号div：",return_number_div)

                let order_number = return_number_div.text().trim().split("，")[1].trim()

                console.log("order_number",order_number)
                  let return_pacakge_17 = result[order_number]
                  if(return_pacakge_17!==undefined){
                        $(return_logistics_div1[i]).after("<div class='return_package_info_table_17' style=';background: yellowgreen'> [我仓收到]："+result[order_number]["return_logistics_number"]+"</div>")
                  }
               }
          })
        });
        })
        $(".show_warning_order_17").click(function () {
                 $(".RefundOrderBox").each(function(){
                    let cur_box_dis = $(this).css("display")
                    let cur_waring_order =      $(this).find(".warning_17")
                         if(cur_waring_order.length !== 0){
                             return true
                         }
                    if(cur_box_dis ==="none"){
                        $(this).css("display",'list-item')
                    }else{
                        $(this).css("display",'none')
                    }
                })
        })
}
function update_chuammei_wait_send_page_data(){
        let order_number_lb = $("label[class='tb_order_number_lb_17']")

        let tb_order_number_list = []
        for(let i = 0; i<order_number_lb.length;i++){

           let tb_order_number = $(order_number_lb[i]).text().trim()


           tb_order_number_list.push(tb_order_number)

         }

         console.log("传美待发货订单list",tb_order_number_list)
        chrome.runtime.sendMessage({order_number_list: JSON.stringify(tb_order_number_list),method:'get_orders_from17'},function(response) {
           let order_list = replace_data(JSON.parse(response))
            console.log("传美待发货页面获取17订单结果：",order_list)
            $('.order_info_table_17').remove()

            add_order_info_to_chuanmei_wait_send_page(order_list,"order")

	    });
        chrome.runtime.sendMessage({order_number_list: JSON.stringify(tb_order_number_list),method:'get_null_orders_from17'},function(response) {

           let order_list = replace_null_order_data(JSON.parse(response))
            console.log("传美待发货页面获取17空包结果：",order_list)
            $('.null_order_info_table_17').remove()
            add_order_info_to_chuanmei_wait_send_page(order_list,"null_order")

	    });
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
function find_order(tb_order_number,order_list){
        for(let i = 0;i<order_list.length;i++){
                    if(tb_order_number === order_list[i]['tb_order_number']){
                        return order_list[i]
                }
            }
            return null
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

// 更新列表里的数据
function update_order(order,order_list){
        for(let i = 0;i<order_list.length;i++){
                    if(order["tb_order_number"] === order_list[i]['tb_order_number']){
                          order_list[i] = order
                        break
                }
            }
            return order_list
}

