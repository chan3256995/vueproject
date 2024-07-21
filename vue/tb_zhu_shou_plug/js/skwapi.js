 // let  DJANGO_SERVER_BASE_URL = "http://39.96.69.115:8089"
  DJANGO_SERVER_BASE_URL = "http://192.168.2.33:8009"
SKW_SHOP_RECOMMEND = {
    1:"https://main.vvic.com/img/stall-recommend-1.a11f8895.gif",
    2:"https://main.vvic.com/img/stall-recommend-2.3a42ebf5.gif",
    3:"https://main.vvic.com/img/stall-recommend-3.52d8dcb1.gif",
    4:"https://main.vvic.com/img/stall-recommend-4.7c62827c.gif",
    5:"https://main.vvic.com/img/stall-recommend-5.062c5742.gif",

}

 //搜款网关注店铺页面
function apiskw_fav_shop_page_init(){
        console.log("搜款网关注店铺页面初始化............")
        console.log("批量管理span",$(".main-bar").find("span:contains('关注档口')"))
        $(".main-bar").find("div:contains('关注档口')").parent().parent().prepend("<button id='query_shop_recommend_goods'>查询店铺recommend商品</button>")
        $("#query_shop_recommend_goods").click(function () {
        let content_div =  $(".care-content")
        let shop_id_list = []
        $(content_div).find(".care-list").each(function () {
            let shop_a = $(this).find("a:contains('进入档口')")
            console.log("shop_a",shop_a)
            let href_value = $(shop_a).attr('href')
           href_value  = href_value.replace("/shop/","").trim()
            $(shop_a).attr('class',href_value)
            console.log("href_value",href_value)
            shop_id_list.push(href_value)
        })



            for(let i = 0 ;i<shop_id_list.length;i++){
                 let params = {"skw_shop_url": "https://www.vvic.com/apif/shop/slzz/index?id="+shop_id_list[i]}
                 chrome.runtime.sendMessage({from:"skw_fav_shop_page",method:"get_shop_recommend_goods_list",parms_str:JSON.stringify(params)},function (response) {
                         // console.log("获取315订单嘻嘻",response)
                       // get_shop_recommend_goods_list_result 在listen

                     })

            }


    })
}
function apiskw_tusou_fav_goods_page_init(){
        console.log("图片搜索 商品收藏页面............")
        setTimeout(function(){
            $(".class_17").remove()
            if(curLocation.indexOf("vvic.com/main/sameStyle")!==-1){
               $(".cont-info-stallInfo").prepend("<button class='query_315_btn_sameStyle class_17' style='float: left'>315查询</button>")

                $(".filter-tab").append("<button class='clean_checkbox class_17'>清除勾选</button><button class='query_recommend_btn class_17' style='float: left'>选中的商品是否为stall_recommend商品</button>")
                 $(".cont-info-stallInfo").parents(".goods-item").prepend("<input class='get_goods_details_input class_17' type='checkbox'  style='opacity:0.8;height:2em;width:2em; float: left;z-index:999 ;position: absolute'>")
                let title_a = $(".cont-info-stallInfo").parents(".goods-item").find(".commodity-card-item-cont-info-title").find("a")
                title_a.each(function () {
                let goods_id_str = $(this).attr("href").replace("/item/","").substring()
                let goods_id =     goods_id_str.substring(0,goods_id_str.indexOf("?"))
                $(this).attr("class",goods_id)


                })
                 let index_m = 0;
                $(".goods-item").each(function (){

                    if(index_m === 0){
                        $(this).prepend(" <button class='all_input_17 class_17'    style='background:gray;margin-left:3em;opacity:0.8;height:3em;width:3em; float: left;z-index:999 ;position: absolute'>")

                    }
                    index_m = index_m +1
                    if(index_m === 5){
                        index_m= 0
                        }
                    })
            }else{
                  $(".shop-name-box").prepend("<button class='query_315_btn class_17' style='float: left'>315查询</button>")
                 $(".shop-name-box").parents(".item").parent().prepend("<input class='get_goods_details_input class_17' type='checkbox'  style='opacity:0.8;height:2em;width:2em; float: left;z-index:999 ;position: absolute'>")
                let title_a = $(".shop-name-box").parents(".item").find(".desc").find(".title").find("a")

                title_a.each(function () {
                    let goods_id = $(this).attr("href").replace("https://www.vvic.com/item/","")
                    $(this).attr("class",goods_id)
                })

                $(".top-nav").append("<button class='clean_checkbox class_17'>清除勾选</button><button class='query_recommend_btn class_17' style='float: left'>选中的商品是否为stall_recommend商品</button>")
                 let index_m = 0;
                $(".item").each(function (){

                    if(index_m === 0){
                        $(this).prepend(" <button class='all_input_17 class_17'    style='background:gray;margin-left:3em;opacity:0.8;height:3em;width:3em; float: left;z-index:999 ;position: absolute'>")

                    }
                    index_m = index_m +1
                    if(index_m === 5){
                        index_m= 0
                        }
                    })
            }

            $(".clean_checkbox").click(function () {


                $(".get_goods_details_input").each(function () {
                    $(this).attr("checked",false)
                })
            })
             $(".all_input_17").click(function () {
                let item = $(this).parents(".goods-item")
                 if(item.length ===0){
                     item = $(this).parents(".item-with-slogan")
                 }
                let next_nextAll_goods_item =    $(item).nextAll()
                 console.log("next_nextAll_goods_item",next_nextAll_goods_item)
                 let is_checked = !$(next_nextAll_goods_item.eq(0)).find(".get_goods_details_input").prop("checked")
                 console.log("is_checked",is_checked)
                 item.find(".get_goods_details_input").prop("checked",is_checked)
                 $(next_nextAll_goods_item.eq(0)).find(".get_goods_details_input").prop("checked",is_checked)
                 $(next_nextAll_goods_item.eq(1)).find(".get_goods_details_input").prop("checked",is_checked)
                 $(next_nextAll_goods_item.eq(2)).find(".get_goods_details_input").prop("checked",is_checked)
                 $(next_nextAll_goods_item.eq(3)).find(".get_goods_details_input").prop("checked",is_checked)

            })
            $(".query_recommend_btn").click(function () {
                let goods_src_list = []
                $(".get_goods_details_input:checked").each(function () {
                   let goods_a =  $(this).parent().find(".title").find("a")[0]
                   if(curLocation.indexOf("vvic.com/main/sameStyle")!==-1){
                       goods_a =  $(this).parent().find(".commodity-card-item-cont-info-title").find("a")[0]
                   }
                   let goods_href  =  $(goods_a).attr("href")
                    if(curLocation.indexOf("vvic.com/main/sameStyle")!==-1){
                         goods_href =     goods_href.substring(0,goods_href.indexOf("?"))
                        goods_href = "https://www.vvic.com/apif"+goods_href+"/detail"
                   }else{
                       goods_href =  goods_href.replace("https://www.vvic.com","").trim()
                        goods_href = "https://www.vvic.com/apif"+goods_href+"/detail"
                    }
                    goods_src_list.push(goods_href)

                })
                for(let i = 0;i<goods_src_list.length;i++){
                     let params  = {
                     "url":goods_src_list[i],
                     "goods_id":goods_src_list[i].replace("https://www.vvic.com/item/","").trim(),
                 }
                console.log("goods_src_list",goods_src_list)
                  chrome.runtime.sendMessage({from:"skw_tusou_page",method:"get_skw_goods_details",parms_str:JSON.stringify(params)},function (response) {
                         console.log("get_skw_goods_details",response)
                       let goods_details_obj = JSON.parse(response)
                      let goods_id = goods_details_obj["goods_url"].replace("https://www.vvic.com/apif/item/","").replace("/detail","")
                      let stall_recommend_img_src  = SKW_SHOP_RECOMMEND[goods_details_obj["recommend_id"]]
                      console.log("stall_recommend_img_src",stall_recommend_img_src)
                      if(stall_recommend_img_src!==undefined && stall_recommend_img_src!==""){
                          console.log("goods_id:",goods_id)
                          console.log("goods-item:",$('.'+goods_id).parents(".item-with-slogan"))
                           $('.'+goods_id).parents(".item-with-slogan").prepend('<img style="float: left; width: 5em; height: 2em; z-index:998 ;position: absolute"   src="'+stall_recommend_img_src+'"  >')
                          if(curLocation.indexOf("vvic.com/main/sameStyle")!==-1){
                            $("."+goods_id).parents(".goods-item").prepend('<img style="float: left; width: 5em; height: 2em; z-index:998 ;position: absolute"   src="'+stall_recommend_img_src+'"  >')
                        }
                      }


                     })
                }

            })
            $(".query_315_btn").click(function () {


                let art_no = $(this).next().text().trim()
                art_no = mcommon_replace_all(replace_art_no_str_list,art_no)
                console.log("art_no：",art_no)
                Toast("款号："+art_no)
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

        },5000)

}

// 获取档口现货推荐新品商品列表
function apiskw_get_shop_recommend_goods_list(skw_shop_url,cookie_obj_skw){
    // cookie_obj_skw  ={
    //     "vvic_token":"bd8344ac-6493-4b65-be7c-0089dc280129",
    //     "cu":"8BCBC503584D9C653234CAB8F4ECEBFC",
    //     "uid":"779312",
    //     "userName":"vvic9200776044",
    //     "acw_tc":"2f61f26816823353163195551e612309774280d83c37549e5e7bfa56f31875",
    //     "acw_sc__v2":"64466c667e0b67c1a6484e0e42a7140dfe09d1f5",
    //     "generateToken":"eyJhbGciOiJIUzUxMiJ9.eyJpc3MiOiJ2dmljLmNvbSIsInN1YiI6Ijc3OTMxMnwyMDIzMDQyNDE3NDI1NTg4MHxlY2EwN2E4YTk0ZjA0NzNmYmJjYjk5NTgzMTRjZjVjNCJ9.5W0N2Uut-OglhYCZ-X9xBeblFQpmxRpfTfX4iVdt8b79pgrULjYEW6IqCdzSR5xW4jxukBmlpuONKc0tiZplLg",
    // }
    console.log("cookie_obj_skw",cookie_obj_skw)
    console.log("cookie_obj_skw2",JSON.stringify(cookie_obj_skw))
      // skw_shop_url =  "https://www.vvic.com/shop/46165"
      // skw_shop_url =  "https://www.vvic.com/shop/14848"
      let ser_url = DJANGO_SERVER_BASE_URL+"/user/getWebPageContent/"
       // skw_shop_url = "https://www.vvic.com/apif/shop/slzz/index?id=14848"
      let result_ = {
          "success":"ok",
          "recommend_list":[],
          "skw_shop_url":skw_shop_url

      }
           let  header = {


        "Host": "www.vvic.com",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.169 Safari/537.36",

          'Content-Type': 'application/x-www-form-urlencoded',

                'referer': 'https://www.vvic.com',
    }
      let params_obj = {
            "method":"GET",
            "url":skw_shop_url,
            "header":header,
            "cookies":cookie_obj_skw,
          }
 $.ajax({
            async : false,
            url :ser_url,
            // url :"https://wuliu.taobao.com/user/batch_consign.htm",
            type : "POST",
            // dataType : 'json',
            data :{"req_parms": JSON.stringify(params_obj)},
            timeout : 5000,
            success : function(result) {
                let recommend_list = []
                console.log("result",result)
                      let data = JSON.parse(result['data'])['data']
 console.log("data",data)
                let recomment_data_list =data['recommendItemList']

                for(let i=0;i<recomment_data_list.length;i++){
                    let item = {}
                    item["img"] = recomment_data_list[i]["index_img_url"]
                    item["goods_id"] = recomment_data_list[i]["id"]
                    item["goods_src"] = "/item/"+recomment_data_list[i]["vid"]
                    item["recommend"] = recomment_data_list[i]["recommend"]
                    item["recommend_id"] = recomment_data_list[i]["recommend_id"]
                    item["recommend_img_url"] = SKW_SHOP_RECOMMEND[recomment_data_list[i]["recommend_id"]]
                    item["recommend_time"] = recomment_data_list[i]["recommend_time"]
                    item["recommend_time2"] = recomment_data_list[i]["recommend_time2"]
                    item["skw_shop_url"] = skw_shop_url
                    recommend_list.push(item)
                }

                result_["recommend_list"] = recommend_list
                return result_

            },
            error:function (err) {
                console.log("错了:" + err);
                result_['success'] = false
                return result_
            }

        });

     return result_


}

 function apiskw_get_skw_goods_details(url){
        console.log("开始抓取.....")

        let responsse_obj = {
          goods_url:"",
          shop_name:"",
          market_name:"",
          floor:"",
          shop_stalls_no:"",
          art_no:"",
          main_img:"",
          goods_color:"",
          goods_size:"",
          goods_price:0,
        }
          $.ajax({
          async : false,
          url :url,
          type : "GET",

          timeout : 5000,
          success : function(res) {
             console.log("result",res)
             let resopnse_obj = res['data']
              responsse_obj['main_img'] = "http:"+resopnse_obj['index_img_url']
              responsse_obj['goods_color'] = resopnse_obj['color']
              responsse_obj['goods_size'] = resopnse_obj['size']
              responsse_obj['goods_price'] = resopnse_obj['discount_price']
              responsse_obj['art_no'] = resopnse_obj['art_no']
              responsse_obj['recommend'] = resopnse_obj['recommend']
              responsse_obj['recommend_id'] = resopnse_obj['recommend_id']
              responsse_obj['goods_url'] = url

              console.log("抓取搜款网商品结果responsse_obj",responsse_obj)
            },
          error:function (err) {
             console.log("错了:" + err);

            }
          });



        return responsse_obj
      }
window.addEventListener("message",e=>{
    // {"responseText":this.responseText,"url":this._url},"*"

    if(e.data.url !==undefined && e.data.url.indexOf('vvic.com/apif/samestyle/')!==-1 ){
        console.log("搜款网js接收到搜同款结果消息",e.data.responseText)
        apiskw_tusou_fav_goods_page_init()
        return
    }

})
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    var method = request.method;
    var to = request.to;
    console.log("main-tb_search_page:",request)

    if(to ==="skw_fav_shop_page" && method ==="get_shop_recommend_goods_list_result"){
         let result = JSON.parse(request.result_data)
          let recommend_list = result["recommend_list"]
          console.log("recommend_list:",recommend_list)
          let skw_shop_url = result["skw_shop_url"]
          let shop_id = skw_shop_url.replace("https://www.vvic.com/apif/shop/slzz/index?id=","")
        let tmp   = "."+shop_id
        console.log("shop========", $(tmp))
        let care_list =  $(tmp).parents(".care-list")
         console.log("care_list========", care_list)
         let care_goods_list_ul =  $(care_list).find(".care-goods-list")[0]
         let care_goods_list_li =  $(care_goods_list_ul).find("li")
        console.log("care_goods_list========", care_goods_list_li)
        care_goods_list_li.each(function () {
            let item_a = $(this).find("a")[0]
            console.log("item_a")
            let a_src  =  $(item_a).attr("href")
            console.log("a_src",a_src)
            for(let i = 0 ;i<recommend_list.length;i++){
                if(a_src === recommend_list[i]['goods_src']){
                    console.log("相同=============================================")
                    let img_src = recommend_list[i]["recommend_img_url"]
                    $(item_a).parent().prepend('<img style="float: left; width: 5em; height: 2em; position: absolute"   src="'+img_src+'"  >')
                }
            }
        })


    }
})