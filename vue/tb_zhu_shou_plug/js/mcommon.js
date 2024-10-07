let seller_id_choies = {
    "小林林精品女装":"moonlight539",
    "小兔西女装":"chenqling3",
    "MuMu小店":"tb143754675",

}


// 需要取代的字符串列表
let replace_art_no_str_list = [
                    {"old":"真实有货","new":""},
                    {"old":"真实现货","new":""},
                    {"old":"优质版","new":""},
                    {"old":"直接来拿","new":""},
                    {"old":"好质量","new":""},
                    {"old":"档口现货","new":""},
                    {"old":"已出货","new":""},
                    {"old":"套装","new":""},
                    {"old":"档口","new":""},
                    {"old":"现货","new":""},
                    {"old":"实拍","new":""},
                    {"old":"非","new":""},
                    {"old":"大量","new":""},
                    {"old":"优质","new":""},
                    {"old":"##","new":""},
                    {"old":"#","new":""},

                    {"old":"原版","new":""},
                    {"old":"质量","new":""},
                    {"old":"千件","new":""},
                    {"old":"品质","new":""},
                    {"old":"天猫","new":""},
                    {"old":"浙江","new":""},
                    {"old":"优质","new":""},
                    {"old":"一套","new":""},

                    {"old":"抖音","new":""},
                    {"old":"爆款","new":""},

                    {"old":"实价","new":""},
                    {"old":"不加绒","new":""},
                    {"old":"加绒","new":""},
                    {"old":"款","new":""},
                    // {"old":"*","new":""},
                ]
function format_stmp_to_time(shijianchuo){
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


//判断是否已经签收的包裹订单
function mcommon_is_recieved(return_logistic_str){
    // console.log("return_logistic_str:",return_logistic_str)
    //根据物流判断是否签收
    let keys_list = [
        // '送达',
        '已签收',
        '代收',
        '签收',
        '暂存',
        '待取件',

        '取件地址',
        '请及时取件',
        // '派件中',
        // '派送中',
        // '正在派件',
        // '正在为您派件',
        // '正在为您派送',
        // '到达,兴宁',
    ]
    if(return_logistic_str === undefined || return_logistic_str===""){
        return false
    }
    for(let i = 0 ;i<keys_list.length;i++){
        let keys_arry = keys_list[i].split(",")

        let is_item_true = true
        for(let k = 0;k<keys_arry.length;k++){
            if(return_logistic_str.indexOf(keys_arry[k]) === -1){

               is_item_true = false
                break
        }

        }
        if(is_item_true){
            return is_item_true
        }


    }

 return false
}


 function add0(m){return m<10?'0'+m:m }


//谷歌cookie 转换为 key - value 键值对对象
function mcommon_chrome_cookie_to_obj(chrome_cookie){
	 let cookies_obj = {}
                let cookie_str = ""
                let cookie_string = ""
                for (let i in chrome_cookie) {
                    let name = chrome_cookie[i].name;
                    let value = chrome_cookie[i].value;
                    cookies_obj[name] = value;
                    cookie_str += (name + "=" + value + ";\n");
                    cookie_string += (name + "=" + value +"&");
                }


                console.log("result88888",cookies_obj)
                 
	 return cookies_obj
}
function mcommon_get_base_vue_url_17(){
    // let base_url_bl = "http://192.168.2.33:8082"
    let base_url_bl = "http://17daina.com"
    return base_url_bl
}


function mcommon_get_base_server_url_17(){
    // let base_url_bl = "http://192.168.2.33:8009"
     let base_url_bl = "http://39.96.69.115:8089"

    return base_url_bl
}

// 取代商家编码一些字符
function mcommon_replace_goods_code_str(code_str){
        let m_code =  code_str === "undefined" ? "" :code_str.trim()
        m_code = m_code.replace("＃","#")
        let new_code = m_code.replace(/#/g,"^^^").trim()

        if (new_code === default_tb_code2_youfei){
            return new_code
        }
        if (new_code === ""){
            new_code = default_tb_code
        }
        if (!isNaN(new_code)){
            new_code = default_tb_code
        }
        // ***********************************************************去除搜款网编码的尾巴（id）
        // 搜款网商品id
        let skw_goods_id= new_code.substring(new_code.lastIndexOf('-')+1,new_code.length)
           
        if(!isNaN(skw_goods_id) &&  skw_goods_id >1000000){
             
            //去掉数字id
            new_code = new_code.substring(0,new_code.lastIndexOf('-'))

        }else{
            console.log("收款网id 不是数字")
        }
         // ***********************************************************去除搜款网编码的尾巴（id）
          
         
        return new_code
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

//计算list相同值得数量
function mcommon_clcle_list_same_value_counts(datalist){
         // let arr = ['苹果','芒果 ','橘子','苹果']
	     let newArr = [...new Set(datalist)]
	     let lastArr = []
	     newArr.forEach(item=>{

	         let num = 0
	         datalist.forEach(i=>{
	             if(item==i){
	               num++
	             }
	         })
             lastArr.push({
             name:item,
             num
	         })
	     })

    return lastArr

}










