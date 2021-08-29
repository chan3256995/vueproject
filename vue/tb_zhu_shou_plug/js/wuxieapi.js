
let wuxie_base_url = "https://wuxiegj.com/"
let wuxie_dabiao_url = "https://db.wuxiegj.com/user/1/tag"
//淘宝打标
function wuxieapi_dabiao (key_word,goods_link,wangwang_id){
    console.log("开始淘宝打标id：",wangwang_id)
    console.log("开始淘宝打标链接：",goods_link)
    console.log("开始淘宝打标关键词：",key_word)
    let return_message = "打标失败"
    if(key_word===undefined || goods_link === undefined || wangwang_id === undefined){
        return_message =  " 打标失败"
    }
    if(goods_link.trim()==="" || key_word.trim()==="" || wangwang_id.trim() ===""){
        return_message =  "打标失败"
    }
// keyword: 雪纺衬衫女
// productId:  https://item.taobao.com/item.htm?id=654202351734
// nick1: 洁h韩f
        let obj = {
            "keyword":key_word,
            "productId":goods_link,
            "nick1":wangwang_id,


        }

        $.ajax({
            async : false,
            url :wuxie_dabiao_url,
            type : "POST",
            // dataType : 'json',
            data : obj,
            timeout : 5000,
            success : function(result) {
                    console.log("打标结果:",result)
                    let str= JSON.stringify(result)
                    if(str.indexOf("打标成功")!==-1){
                        return_message =  "打标成功"
                    }else{
                         return_message =  "打标失败0"
                    }

            },
            error:function (err) {
                console.log("错了:" + err);
                 console.log(JSON.stringify(err))
 return_message =  "打标失败"
            }
        });
    return return_message
}
 