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
}


if(curLocation.indexOf("member/auditBuyerAccount/index")!==-1 ) {
    window.onload = function () {
        console.log("掌门人审核管理页面..........")
         $('#tasklist').prepend("   <input id='key_words' style='margin-top: 1em; width: 20em;display: block' placeholder='打标词' value=''   ><input id='tb_link' style='margin-top: 1em;width: 40em;display: block' placeholder='淘宝链接' value=''   >  <input id='dabiao_wangwang_id' placeholder='旺旺id' value='' style='margin-top: 1em;width: 20em;display: block'  ><button id='wuxie_dabiao_btn' style='margin-top: 1em;display: block'>进行打标</button>");

         $('tbody').find('tr').append("<td><input style='width: 5em;height: 1.5em; background: #adadad' type='button' value='获取打标信息' class='wuxietagbtn'></td>")
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
         console.log("tr",$('tbody').find('tr'))
         let item_list_tr = $('tbody').find('tr')
         let order_id_record_obj = []
         let order_item_record_obj_list = []
         for(let i = 0 ;i< item_list_tr.length;i++){
             let  item  =item_list_tr[i]
             //订单id
             let  action_time = $($(item).find("td")[1]).text().trim()
             let order_id = $($(item).find("td")[4]).text().trim()
             let  task_id = $($(item).find("td")[5]).text().trim()
             let  buyer_id = $($(item).find("td")[6]).text().trim()
             // 买手购物平台账号
             let  buyer_account = $($(item).find("td")[6]).text().trim()
             let obj = {"action_time":action_time,"order_id":order_id,"task_id":task_id,"buyer_id":buyer_id}
              console.log("ORDER_ID:",order_id)
             let tem_str = window.localStorage.getItem("zhangmenren_data")
             console.log("本地储存0:",tem_str)
             if(tem_str!== null){
                 order_id_record_obj = JSON.parse(tem_str)
             }else{
                 order_id_record_obj = {}
             }
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

             console.log("本地储存:",JSON.parse(window.localStorage.getItem("zhangmenren_data")))
         }

        $("#wuxie_dabiao_btn").click(function () {
                  chrome.runtime.sendMessage({method:'wuxie_dabiao',wangwang_id:$("#dabiao_wangwang_id").val(),tb_link: $("#tb_link").val(),key_words: $("#key_words").val()},function(response) {

                    console.log(response)
                      Toast(response,3000)

        });
        })








    }
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


         chrome.runtime.sendMessage({method:'get_goods_time',goods_url:curLocation},function(response) {

             $(".tb-social-fav").after(" <a class='btn' style='color:black ;background:yellow'>"+ response+"</a>");
            console.log(response)
        });
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

    }
})

 $(".btn_m").click(function () {
     console.log("click")
     console.log( $(this))
     let href = $(this).val()
     Toast(href,3000)
 })






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


 
