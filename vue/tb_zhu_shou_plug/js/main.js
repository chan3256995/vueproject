var curLocation = window.location.href.toString();

console.log("curLocation",curLocation)
if(curLocation.indexOf("https://s.taobao.com/search?q=&imgfile")!==-1){
    console.log("tusou")
//
     window.onload=function(){
        setTimeout(function(){
            init_tusou_page_elems_data()
    },20000)

     }

}
if(curLocation.indexOf("trade.taobao.com/trade/itemlist/list_sold_items.htm")!==-1){
    console.log("近三个月已卖出订单.......")
//
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
     window.onload=function(){


     }

}
if(curLocation.indexOf("s.taobao.com/search")!==-1 && curLocation.indexOf("search?q=&imgfile")===-1){
    window.onload=function(){
      init_search_page_elems_data()

    }
}

console.log("当前页面地址：",curLocation)
if(curLocation.indexOf("taobao.vvic.com/item?id")!==-1 ) {
    window.onload = function () {
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
}else if(curLocation.indexOf("tusou.vvic.com/list")!==-1 || curLocation.indexOf("vvic.com/main/sameStyle")!==-1 || curLocation.indexOf("www.vvic.com/user/favorite")!==-1){
     //clearfix shop-name-box
    window.onload = function(){
        setTimeout(function(){
            $(".shop-name-box").prepend("<button class='query_315_btn' style='float: left'>315查询</button>")
            if(curLocation.indexOf("vvic.com/main/sameStyle")!==-1){
               $(".cont-info-stallInfo").prepend("<button class='query_315_btn_sameStyle' style='float: left'>315查询</button>")
            }
            $(".query_315_btn").click(function () {


                let art_no = $(this).next().text().trim()
                art_no = mcommon_replace_all(replace_art_no_str_list,art_no)
                console.log("art_no：",art_no)
                 //search_field=goods_sn&q="+art_no+"&status=&do=&reserdate=
                let params = {
                    "search_field":"goods_sn",
                    "q": art_no,
                    "status": "",
                    "reserdate": "",
                }



                chrome.runtime.sendMessage({from:"skw_tusou_page",method:"get_315_order",parms_str:JSON.stringify(params)},function (response) {
                         console.log("获取315订单嘻嘻",response)

                     })
            })
            $(".query_315_btn_sameStyle").click(function () {


                let art_no = $(this).next().next().text().trim()
                art_no = mcommon_replace_all(replace_art_no_str_list,art_no)
                console.log("art_no：",art_no)
                 //search_field=goods_sn&q="+art_no+"&status=&do=&reserdate=
                let params = {
                    "search_field":"goods_sn",
                    "q": art_no,
                    "status": "",
                    "reserdate": "",
                }



                chrome.runtime.sendMessage({from:"skw_tusou_page",method:"get_315_order",parms_str:JSON.stringify(params)},function (response) {
                         console.log("获取315订单嘻嘻",response)

                     })
            })
           console.log("shop_div",shop_div)
        },10000)

    }
}

if(curLocation.indexOf("#/pc/home/myorder")!==-1){
    window.onload = function () {
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
    window.onload = function () {
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

if(curLocation.indexOf("member/Taskmanage/advancePaymentManagement")!==-1 ) {
    window.onload = function () {
        console.log("垫付任务返款管理页面..........")


         let order_id_record_obj = []


    chrome.storage.local.get({"chuanmei_order_cache":{}},function (local_data) {

         console.log("读取本地储存记录,",local_data)
         let lacal_obj = local_data["chuanmei_order_cache"]
         let item_div = $("#form1").find("div[class='d-b']")
         for(let i = 0;i<item_div.length;i++){
             let  item_li_list = $(item_div[i]).find("li")
             let p_order_number = $(item_li_list[1]).find("p:contains('买手提交单号')")
             let input_order_number = $(p_order_number[0]).find("input")
             let order_number = $(input_order_number[0]).attr("data-copy").trim()
             let local_tb_order_data = lacal_obj[order_number]
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
         console.log("item：",item_div)

})







    }
}else if(curLocation.indexOf("pc/home/porder")!==-1){
    console.log("tb_zhusou_plug项目入注",curLocation)
    chrome.storage.local.get({"my_tb_wait_send_order_cache":null},function (local_data) {

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
if(curLocation.indexOf("sucai.wangpu.taobao.com/#/manage/video")!==-1){
    window.onload = function(){
           console.log("素材我的视频..........")

        $(".seller-tabs").before(" <div style='margin-top: 1em; width: 5em;height: 2em;background: #2d8cf0'><input style='width: 5em;height: 2em;background: #2d8cf0;color: white' type='button' id='open_mul_page'   value='打开5个当前页面'></div>");

        $("#open_mul_page").click(function () {
            for(var i = 0 ;i< 5;i++) {
                let m_time = i * 2 * 1000
                setTimeout(function () {
                    let url = curLocation +"&click_upload_btn=ok"
                    window.open(url)
                },m_time)

            }

        })
        if(curLocation.indexOf("click_upload_btn=ok") !==-1){
            $('div:contains("上传")').click()
             setTimeout(function () {
                 console.log("上传按钮：", $('input[type="file"]'))
                 console.log("上传按钮dvi：", $(".moxie-shim"))
                    $($('input[type="file"]')[0]).click()
                    $(".moxie-shim").click()
                },2000)
        }
          var jump_input = $(".next-pagination-jump").find("input")[0]
        console.log("jump_input：",jump_input)
         setTimeout(function () {
              $(jump_input).click()
             $(jump_input).val('5')

             $(jump_input).attr("value",'5')

         },3000)
         // var event = new Event('input')
         //                jump_input.dispatchEvent(event)
         //                $(jump_input).focus()
         //
         //                // $(jump_input).blur()
    }

}

if(curLocation.indexOf("item.upload.taobao.com/sell/publish.htm?itemId")!==-1){
    window.onload = function(){

         console.log("outerId:", $("input[id='outerId']"))

         $($("input[id='outerId']")[0]).focus()

    }

}

if(curLocation.indexOf("vvic.com/item/")!==-1){
    window.onload = function(){

         console.log("视频下载:", $("span:contains('图片/视频下载')"))
        if($("span:contains('图片/视频下载')").length === 0){
            return
        }
        if(curLocation.indexOf("down_video=true")!==-1){
            $("span:contains('图片/视频下载')").click()
            setTimeout(function () {
                 console.log("checkbook-item:",  $(".checkbox-item"))
                 $(".checkbox-item")[0].click()
                 console.log("下载div:",  $(".download-btn"))
                   $(".download-btn")[0].click()


            },1000)
        }




    }

}


if(curLocation.indexOf("item.manager.taobao.com/taobao/manager/render.htm?tab=in_stock")!==-1){

    setTimeout(function () {
        console.log("manage-container-filter  :", $("div[class='manage-container-filter  ']") )

         $("div[class='manage-container-filter  ']").after(" <div style='margin-top: 1em; width: 15em;height: 2em;background: #2d8cf0'><input style='width: 15em;height: 2em;background: #2d8cf0;color: white' type='button' id='btn_open_goods_edit'   value='打开当前页面所有商品编辑页'></div>");
           $("#btn_open_goods_edit").click(function () {

                var tbody = $("tr[class='next-table-row']").parent()
                console.log("999:",tbody.children().not(".next-table-row").remove())
               var tr_list = tbody.children()
                  console.log("100:",tbody.children() )
                for(var i = 0;i< tr_list.length;i++){
                    var tem_a = $(tr_list[i]).find("a")[0]
                    console.log("a:"+i,tem_a.href)

                    var goods_id = tem_a.href.substring(tem_a.href.indexOf("id=")+3,tem_a.href.length)
                    // var goods_publish_url = "https://item.upload.taobao.com/sell/publish.htm?itemId="+goods_id
                    var goods_publish_url = "https://upload.taobao.com/auction/publish/edit.htm?item_num_id="+goods_id+"&auto=false&itemId="+goods_id
                     console.log("商品id链接：",goods_publish_url)
                    window.open(goods_publish_url)
                    // setTimeout(function(goods_publish_url){
                    //     let url =  goods_publish_url
                    //    
                    // },i*1000 + 1000)

        }
     })
        },5000)

    window.onload = function(){



    }

}else if(curLocation.indexOf("chuanmeidayin.com/dist/index.html#/afterSales/refund")!==-1){
    // 传美退款页面
    console.log("传美退款页面")
    window.onload = function(){

         update_chuammei_refund_page_data()

    }


}else if(curLocation.indexOf("chuanmeidayin.com/dist/index.html#/print/waitPrintPage")!==-1){
    // 发货页面
    console.log("传美发货页面")
    window.onload = function(){
        // $(".TempList").append("<button id='order_cache_btn'>订单缓存到本地</button>")
        // $(".TempList").append(" <button id='to_place_order_17'  style='margin: 1em; padding-left: 1em;padding-right: 1em'>选中的获取地址去下单</button>")
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
                     '<div><button id="to_place_order_17"  style="margin: 1em; padding-left: 1em;padding-right: 1em">选中的获取地址去下单</button>' +
                     '<button id="order_cache_btn">订单缓存到本地</button>' +
                     '<input placeholder="缓存前几页" style="width: 6em" id="order_cache_page_count"/>' +
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
                 for(let i = 0 ;i<wait_send_list.length;i++){
                      append_elems_str  = append_elems_str +
                       '<div class="item_data_div17" style="margin-bottom: 0.5em">\n' +

                         '              <li style="margin-bottom: 1em">\n' +
                         '                <div style=" background: gainsboro;padding-left: 1em;">\n' +
                         '                  <input style="width: 2em;height: 2em" class="check_box_17" type="checkbox"/>\n' +
                         '                  <label>[买]：</label><label>'+wait_send_list[i]["buyer_nick"]+'</label><label> [卖]：</label><label>'+wait_send_list[i]["sellerNick"]+'</label><label> 订单编号：</label> <label class="tb_order_number_lb_17">'+wait_send_list[i]["tb_order_number"]+'</label><label> 地址：</label><label>'+wait_send_list[i]["name"]+','+wait_send_list[i]["phone"]+','+wait_send_list[i]["province"]+','+wait_send_list[i]["city"]+','+wait_send_list[i]["area"]+','+wait_send_list[i]["address"]+'</label>\n' +
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
                                 '    <label>商家编码：</label><label style="margin-left: 1em">'+goods_list[g]["code"]+'<label>\n' +
                                 '    <label style="'+goods_refund_tip+'">'+goods_list[g]["refund_status"]+'</label>'+
                                 '    <label style="color:red;">'+goods_list[g]["status"]+'</label><label>  颜色尺码：</label><label>'+goods_list[g]["color"]+'</label><label>'+goods_list[g]["size"]+'</label>\n' +
                                 '</div>\n'
                            append_elems_str = append_elems_str +goods_str
                          }
                           append_elems_str = append_elems_str+
                           '  <label>'+wait_send_list[i]["pay_time"]+'</label>\n'+
                         '   </div>\n' +
                         '  </li>\n' +
                         ' </div> '
                 }
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


}else if(curLocation.indexOf("315df.com/user/profile.html")!==-1){

    window.onload = function(){
        //reqest_test315()

    }


}else if(curLocation.indexOf("315df.com/user/quick")!==-1){


    window.onload = function(){
        //reqest_test315()
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
                url: "https://www.315df.com/user/profile.html",
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
db.transaction(function (tx) {
tx.executeSql('SELECT * FROM LOGS', [], function (tx, results) {
    console.log("results messgae：",results)
    var len = results.rows.length;
    msg = "<p>查询记录条数: " + len + "</p>";


    for (let i = 0; i < len; i++){
        msg = "<p><b>" + results.rows.item(i).log + "</b></p>";

    }
}, null);
console.log("messgae：",msg)
});



    }
}

if(curLocation.indexOf("refund2.taobao.com/dispute/sellerDisputeList.htm")!== -1){
    //淘宝售后页面
    window.onload = function () {
          update_tbrefund2_data()
        return


    }
}
if(curLocation.indexOf("www.315df.com/user/order/daifa")!== -1){
    window.onload = function () {
        let tr_ =  $(".daiFaGoods")
       let add_goods_btn =  $("button:contains('添加商品')")
        console.log("315添加商品按钮：",add_goods_btn)
            add_goods_btn.after("<button style='float:left;'>添加商品</button>")
      tr_.after("<span  class='init_btn'  style='margin-top: 2em;float:left;background: #2d8cf0;color: white'>初始化按钮</span>")


        $(".init_btn").click(function () {
             $(".tianjia_shanggpin").remove()
             $(".shanchu_shanggpin").remove()
             let add_goods_btn_item =  $("button:contains('增加商品')")
            let delete_goods_btn_item =  $("button:contains('删除商品')")

            add_goods_btn_item.parent().parent().prepend("<span  class='tianjia_shanggpin'  style='margin-top: 2em;float:left;background: #2d8cf0;color: white'>增加商品</span>")
            delete_goods_btn_item.parent().parent().prepend("<span  class='shanchu_shanggpin'  style='margin-top: 2em;float:left;background: #2d8cf0;color: white'>删除商品</span>")
             $(".tianjia_shanggpin").click(function () {
            console.log("tianjiasss ",$(this).parent().find("button:contains('增加商品')"))
            $(this).parent().find("button:contains('增加商品')").click()
            })
            $(".shanchu_shanggpin").click(function () {
                console.log("tianjiasss ",$(this).parent().find("button:contains('删除商品')"))
            $(this).parent().find("button:contains('删除商品')").click()
        })
        })
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
// 图搜页面
function init_tusou_page_elems_data(){
      //
      // $(".blank-row").each(function () {
      //      console.log( "blank-row")
      //      console.log( $(this))
      //   $(this).find(".item ").each(function () {
      //         let row_2 = $(this).find(".title")
      //         let a_elems = $($(this).find(".title")).find("a:eq(0)")
      //         let href = $(a_elems).attr("href");
      //
      //           console.log( href)
      //           console.log( $(this))
      //        console.log( "ITEM")
      //           console.log( row_2)
      //
      //        if(href !== undefined && href.indexOf("item.taobao") !== -1){
      //           // $(this).find("div:eq(0)").after(" <a class='btn' style='background-position:0 -25px;color:white'>17代发</a>");
      //            $(this).find(".row-4").after(" <button class='btn_m'  value='{" + href + "}'>显示上架时间</button>");
      //
      //          console.log("href:"+href)
      //     }
      //   })
      // })
     $(".item").each(function() {

          console.log( $(this))
          let a_elems = $($(this).find(".row-2")).find("a:eq(0)")

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
             update_tbrefund2_data()
        },1500)

        Toast("更新插件数据...")
    }else if(to ==="chuanmei_refund_page" && method ==="update_chuanmei_refund_page_data"){

        setTimeout(function () {
           $('.order_info_table_17').remove()
           update_chuammei_refund_page_data()
        },1500)

        Toast("更新插件数据...")
    }else if(to ==="chuanmei_wait_send_page" && method ==="update_chuanmei_wait_send_page_data"){

        setTimeout(function () {
           $('.order_info_table_17').remove()
           update_chuammei_refund_page_data()
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

        console.log("main_info_div",main_info_div)
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

                $(main_info_div[i]).after("<div> 发货物流："+result["send_info"]['logistics_name']+" "+result["send_info"]['logistics_number']+"</div>")


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
                $(main_info_div[i]).after("<div style='background: yellow'> "+result["return_info"]['latestMsg']+" "+result["return_info"]['latestTime']+"</div>")
                 if(return_address.indexOf("18719368068") === -1){
                     $(main_info_div[i]).after("<div style='background: yellow'> <button class='"+return_logistics_number+"'>从315获取退包信息</button></div>")
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

                 $(main_info_div[i]).after("<div style='background: yellow'> 退货物流："+result["return_info"]['return_logistics_name']+" "+return_logistics_number+"  退货地址："+return_address+  " </div>")
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
                        $(main_info_div[i]).after("<div style='background: yellowgreen'> [我仓收到]："+result[order_number]["return_logistics_number"]+"</div>")
                  }





        }
          })
        });
        chrome.runtime.sendMessage({method:"keep_web_cookies_alive"},function(response) {

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

        for(let i = 0; i<order_number_div.length;i++){
            let item_div = order_number_div[i]
           let order_number_span = $(item_div).find("span:contains('[复制]')")[0]
           let tb_order_number = $(order_number_span).attr('data-clipboard-text')
            let order = find_order(tb_order_number,order_list)
            console.log("order_number_span:",tb_order_number)



            let newget = null;

           if(order!==null){
                    let back_color = "ffff99"
                    var d=order
                    let goods_status_span = ""
                    if(d.orderGoods !== undefined   ){
                        for(let n = 0 ; n<d.orderGoods.length;n++){
                             let goods_status = d.orderGoods[n].status
                             let service_message = d.orderGoods[n].customer_service_message
                             goods_status_span = goods_status_span +'<span style="margin-right: 40px;">[商品'+n+" "+goods_status+"]  客服留言："+service_message+'</span>';
                             if(goods_status !== "已取消" && goods_status !== '已退款' ){
                                 back_color = 'red'
                             }
                        }
                    }
                    newget = '<table class = '+table_calss_17+' width="100%"><tr bgcolor='+back_color+'><td height="30" align="center"><span style="margin-right: 40px;">17代发订单：'+d.tb_order_number+'</span>';
                    newget += '<span style="margin-right: 40px;">快递：'+d.logistics_name+'</span>';
                    newget += '<span style="margin-right: 40px;">单号：'+d.logistics_number+'</span>';
                    newget += '<span style="margin-right: 40px;">订单状态：'+d.order_status+'</span>';
                    newget += goods_status_span


                    // newget += '<span>拿货情况：'+d.over_taking+'/'+d.pro_count+'</span>';
                    newget += '</td></tr></table>';
                    $(item_div).after(newget);
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

        let order_number_label = $("label[class='tb_order_number_lb_17']")
        table_17.remove()

        for(let i = 0; i<order_number_label.length;i++){
           let item_label = order_number_label[i]
           let tb_order_number = $(item_label).text().trim()
           let order = find_order(tb_order_number,order_list)
           let newget = null;
           if(order!==null){
                    let back_color = "ffff99"
                    var d=order
                    let goods_status_span = ""
                    if(d.orderGoods !== undefined   ){
                        for(let n = 0 ; n<d.orderGoods.length;n++){
                             let goods_status = d.orderGoods[n].status
                             goods_status_span = '<span style="margin-right: 40px;">[商品'+n+" "+goods_status+']</span>';

                        }
                    }
                    newget = '<table class = '+table_calss_17+' width="100%"><tr bgcolor='+back_color+'><td height="30" align="center"><span style="margin-right: 40px;">17代发订单：'+d.tb_order_number+'</span>';
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
        $(".check_return_package").remove()
        $('.return_package_info_table_17').remove()
        let req_17return_package_info_list  = []
        $("div[class='TempList']").after("<button class='check_return_package'>检测退件 </button>")
        let return_logistics_div1 = $(".ExpressNumberTitle")
        for(let i = 0;i<return_logistics_div1.length;i++){

        let return_number_div = $(return_logistics_div1[i]).next()


        let return_number = return_number_div.text().trim()
          console.log("退回单号0000000：",return_number)
        if(return_number!==""){
             let arr_tem = return_number.split("，")
            if(arr_tem.length >1){
                return_number = arr_tem[1].trim()

                req_17return_package_info_list.push({"order_number":"",return_logistics_number:return_number})
            }

        }


   }
        console.log("req_17return_package_info_list",req_17return_package_info_list)
        console.log("RefundOrderBox:",order_number_div)
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
        $(".check_return_package").click(function () {
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

