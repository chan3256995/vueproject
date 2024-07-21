/**
 * 自动复制剪贴板并加密
 * @file    :  popup.js
 * @author  :  Steven.liao
 * @mail    :  lxq73061@gmail.com
 * @version :  1.0
 * @date    :  2017-06-27
 *
 */
// var url = "http://192.168.1.110:8082/#/pc/home/myorder";
var url =""
// trim the spaces
String.prototype.trim = function() {
	var re = /(^\s*)|(\s*)$/g;
	return this.replace(re, "");
}

// get element by id
function $(s) {
	return document.getElementById(s);
}

// set cookie
function set_cookie(cookie){
	fragment = url.split('/');
	url = fragment[0] + '//' + fragment[2];
	
	// init chrome.cookies 
	// reference : http://src.chromium.org/viewvc/chrome/trunk/src/chrome/common/extensions/docs/examples/api/cookies/manager.js
	if (!chrome.cookies) {
		chrome.cookies = chrome.experimental.cookies;
	}
	
	//alert("set cookie:" + cookie);
	ck = cookie.split(';');
	var counter = 0;
	for(i in ck){
		c = ck[i].trim();
		if(!c) continue;
		k = c.split('=')[0].trim();
		v = c.split('=')[1].trim();
		
		//reference : https://developer.chrome.com/extensions/cookies#method-set
		chrome.cookies.set({
			'url': url,
			'name': k,
			'value': v,
		}, function() {
			get_cookie();
		});
	}
	alert("Set cookie successfully!");
}

// get cookie
function get_cookie() {
	var cookie_str = "";
	var cookie_string = "";
	var is_login=true;
	var cs={};
	chrome.cookies.getAll({'url':url}, function(cookie) {

		for(i in cookie) {
			name = cookie[i].name;
			value = cookie[i].value;
			cs[name]=value;
			cookie_str += (name + "=" + value + ";\n");
			cookie_string += (name + "=" + value + "; ");
		}
		is_login = 0;

		fragment = url.split('/');
		var host = fragment[2];
		url = fragment[0] + '//' + fragment[2];
		
		if(host=='pub.alimama.com'){
			if(cs['cookie2']==null||cs['login']==null){

			}else{
				is_login =1
			}
		}else if(cs['cookie2']==null||cs['_m_h5_tk']==null){
			is_login =0
		}else{
			is_login =1
		}

		$('cookie').value = base64_encode(cookie_string);
		$('cookie2').value = (cookie_string);

		if(!is_login){
			$('status').innerHTML = "please login taobao.com after use the tool.";
			// $('cookie').value="please login taobao.com after use the tool.";
			// $('cookie').value += base64_encode(cookie_string);
			//window.location.href="http://member1.taobao.com/member/fresh/account_security.htm";	
			return;

		}
		$('status').innerHTML = host+" ok";


		

		$('cookie').select();
  		document.execCommand('copy');
  		if(!$('cookie').value)
			{

				$('status').innerHTML ='unknow error!';
				return;
			}  		
  		// alert("Success! SESSION has been copied to your clipboard.");
  			// console.log($('cookie').value );
  		if(host=='pub.alimama.com'){

  			window.open('http://api.onebound.cn/taobao/tools/session.html?cookie='+$('cookie').value+'&host='+'pub.alimama.com');
  		}else{
  			
  			window.open('http://api.onebound.cn/taobao/tools/session.html?cookie='+$('cookie').value);
  		}
  		// window.open('http://ob.l.onebound.cn/api/taobao/tools/session.html?key=test_api_key&secret=ob8899.&&cookie='+$('cookie').value);
  		// window.open('http://ob.l.onebound.cn/api/taobao/api_call.php?key=test_api_key&secret=ob8899.&&api_name=buyer_info&cookie='+$('cookie').value);
  		// $.getJSON('http://ob.l.onebound.cn/api/taobao/api_call.php?key=test_api_key&secret=ob8899.&&api_name=buyer_info&cookie='+$('cookie').value,function(d,s){
  		// 	console.log(d);
  		// 	alert(d);
  		// });
  		window.close();
	})
}

function createXMLHttpRequest() {
        var xmlHttp;
        // 适用于大多数浏览器，以及IE7和IE更高版本
        try{
            xmlHttp = new XMLHttpRequest();
        } catch (e) {
            // 适用于IE6
            try {
                xmlHttp = new ActiveXObject("Msxml2.XMLHTTP");
            } catch (e) {
                // 适用于IE5.5，以及IE更早版本
                try{
                    xmlHttp = new ActiveXObject("Microsoft.XMLHTTP");
                } catch (e){}
            }
        }
        return xmlHttp;
    }
function base64_encode(str){
               var c1, c2, c3;
               var base64EncodeChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";               
               var i = 0, len= str.length, string = '';
               while (i < len){
                       c1 = str.charCodeAt(i++) & 0xff;
                       if (i == len){
                               string += base64EncodeChars.charAt(c1 >> 2);
                               string += base64EncodeChars.charAt((c1 & 0x3) << 4);
                               string += "==";
                               break;
                       }
                       c2 = str.charCodeAt(i++);
                       if (i == len){
                               string += base64EncodeChars.charAt(c1 >> 2);
                               string += base64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
                               string += base64EncodeChars.charAt((c2 & 0xF) << 2);
                               string += "=";
                               break;
                       }
                       c3 = str.charCodeAt(i++);
                       string += base64EncodeChars.charAt(c1 >> 2);
                       string += base64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
                       string += base64EncodeChars.charAt(((c2 & 0xF) << 2) | ((c3 & 0xC0) >> 6));
                       string += base64EncodeChars.charAt(c3 & 0x3F)
               }
                       return string
       }
function ajax_req(){
  	$('status').innerHTML = "please login taobao.com after use the tool 6666666.";

var xmlHttp = new XMLHttpRequest();
xmlHttp.open("GET", "http://192.168.1.110:8009/trade/logistics/", true);
xmlHttp.setRequestHeader('Referer', 'http://192.168.1.110:8009/');
xmlHttp.setRequestHeader('User-Agent', 'MSIidiidss');
// xmlHttp.open("GET", "www.baidu.com", true);
 //  post
 //        xmlHttp.open("post","/sendAjax/");
	$('status').innerHTML = "please login taobao.com after use the tool33333333.";
          // （4） 回调函数  success
        xmlHttp.onreadystatechange = function() {

            if(this.readyState==4 && this.status==200){
                console.log(this.responseText)
	$('status').innerHTML = "please this.responseText"+this.responseText;
            }
        };
        xmlHttp.send();
       }
function onload() {
// ajax_req();

		get_cookie();

	// if（!window.localStorage){
 //        alert("浏览器支持localstorage");
 //        return false;
 //    }else{
 //    	alert("浏览器不支持localstorage");
 //        var storage=window.localStorage;

	// 	get_cookie();

	// }
	
	// $('submit').addEventListener('click', function () {
		
	// 	//set_cookie($('cookie').value);
	// });
}

document.addEventListener('DOMContentLoaded', function() {

	if(url == "") {
		chrome.tabs.getSelected(null,function(tab) {
			url = tab.url;
			
			// alert("DOMContentLoaded url: " + url); 异步事件，把onload函数放在回调函数里，url才能取得到
			onload();
		});
	}else{
	  onload()
	  // get_cookie()
  }
});
