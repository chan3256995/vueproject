chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
	var method = request.method;
    console.log("method---",method)
	if (method === "get_goods_time") {

           let goods_url = request.goods_url
        console.log("goods_url")
        console.log(goods_url)
           let result = get_goods_details(goods_url)
           let res_arr =  result.match("dbst             : \\d+")
           let match_time = 0
           if(res_arr.length>0){
                              console.log("match_time:",res_arr[0].replace("dbst             :"))
               match_time = res_arr[0].replace("dbst             :","").trim()
               match_time = format(match_time)

                         }
           sendResponse(JSON.stringify(match_time));
	}else if(method === "zhaoyaojing_query"){
	     // zhaoyjingapi_check_user("")
        let result = "{\"lowMonth\":\"no\",\"isNeedCost\":false,\"result\":\"dataImg\",\"costMonsterCoin\":null,\"nearWeekShop\":9,\"point_num\":600,\"lastWeekShop\":4,\"baseImg\":\"http://i.cy1788.cn/data/m/20210823/b3c212ea58284a11938d09e9068f4618.png\",\"costCoin\":0,\"downImg\":\"http://i.cy1788.cn/data/m/20210823/76264877be2245f2bac970b2daa6b971.png\",\"queryTime\":\"2021-08-23 19:12:16\",\"msg\":null,\"costPoint\":50}\n"
         sendResponse(result);
    }else if(method === "get_zhangmenren_task_tb_link"){
	    
        let result = {'tb_link':''}
        let order_id = request.order_id
         let req_result = zhangmenrenapi_get_order_tb_link(order_id)
        console.log("根据订单号查找淘宝链接结果：",req_result)
        result['tb_link'] = req_result
         sendResponse(JSON.stringify(result));
    } else if(method === "wuxie_dabiao"){

        let result = {'tb_link':''}
        let wangwang_id = request.wangwang_id
        let tb_link = request.tb_link
        let key_words = request.key_words
         let dabiao_resutl = wuxieapi_dabiao(key_words,tb_link,wangwang_id)
        console.log("d打标结果：",dabiao_resutl)

         sendResponse(dabiao_resutl);
    }

});
function add0(m){return m<10?'0'+m:m }
function format(shijianchuo)
{
//shijianchuo是整数，否则要parseInt转换
     shijianchuo = parseInt(shijianchuo)
var time = new Date(shijianchuo);
var y = time.getFullYear();
var m = time.getMonth()+1;
var d = time.getDate();
var h = time.getHours();
var mm = time.getMinutes();
var s = time.getSeconds();
return y+'-'+add0(m)+'-'+add0(d)+' '+add0(h)+':'+add0(mm)+':'+add0(s);
}
function get_goods_details(goods_url) {
            let ret_result = null
		   $.ajax({
            async : false,
            url :goods_url,
            type : "GET",
            // dataType : 'json',
            // data : {'tb_order_number_list':order_number_list},
            timeout : 5000,
            success : function(result) {
                    console.log("page_result:",result)
                    ret_result =  result

            },
            error:function (err) {
                console.log("错了:" + err);
            }
        });
            return ret_result
}

chrome.webRequest.onCompleted.addListener(

    function(details) {
        
        if(details.url.indexOf("s.taobao.com/search")!== -1){
console.log("tabs000url",details.url)
         chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
             console.log("tabs000",tabs)
          chrome.tabs.sendMessage(tabs[0].id, {from:'background',method:'update_tb_search_page_data',to:'tb_search_page'}, function(response)
          {

          });
         });
        }
    },{urls: ["<all_urls>"]}
);