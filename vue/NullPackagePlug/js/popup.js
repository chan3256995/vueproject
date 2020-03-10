function DOMContentLoaded() {

          var xmlHttp = new XMLHttpRequest();
xmlHttp.open("GET", "http://192.168.1.110:8009/trade/logistics/", true);

// xmlHttp.open("GET", "www.baidu.com", true);
 //  post
 //        xmlHttp.open("post","/sendAjax/");

          // （4） 回调函数  success
        xmlHttp.onreadystatechange = function() {

            if(this.readyState==4 && this.status==200){
                console.log(this.responseText)

            }
        };
        xmlHttp.send();
}
document.addEventListener('DOMContentLoaded', DOMContentLoaded);
 