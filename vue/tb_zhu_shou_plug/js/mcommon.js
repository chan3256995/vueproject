let seller_id_choies = {
    "小林林精品女装":"moonlight539",
    "小兔西女装":"chenqling3",
    "MuMu小店":"tb143754675",

}


// 需要取代的字符串列表
let replace_art_no_str_list = [
                    {"old":"套装","new":""},
                    {"old":"现货","new":""},
                    {"old":"实拍","new":""},
                    {"old":"非","new":""},
                    {"old":"大量","new":""},
                    {"old":"优质","new":""},
                    {"old":"#","new":""},
                    {"old":"直接来拿","new":""},
                    {"old":"原版","new":""},
                    {"old":"质量","new":""},
                    {"old":"千件","new":""},
                    {"old":"好质量","new":""},
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
    // let base_url_bl = "http://192.168.1.102:8082"
    let base_url_bl = "http://17daina.com"
    return base_url_bl
}


function mcommon_get_base_server_url_17(){
    // let base_url_bl = "http://192.168.0.108:8009"
     let base_url_bl = "http://39.96.69.115:8089"

    return base_url_bl
}

// 取代商家编码一些字符
function mcommon_replace_goods_code_str(code_str){
        let m_code =  code_str === "undefined" ? "" :code_str.trim()
        
        let new_code = m_code.replace(/#/g,"^^^").trim()

        if (new_code === default_tb_code2_youfei){
            return new_code
        }
        if (new_code === ""){
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

