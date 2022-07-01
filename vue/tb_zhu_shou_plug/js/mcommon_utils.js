
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

//线程休眠
 function mcomon_thread_sleep(time){
 console.log("休眠"+time)
    const startDate   = new Date().getTime()
     while(new Date().getTime() - startDate<time){}
 }


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

function mcommon_get_base_server_url_17(){
    // let base_url_bl = "http://192.168.1.102:8009"
     let base_url_bl = "http://39.96.69.115:8089"

    return base_url_bl
}

