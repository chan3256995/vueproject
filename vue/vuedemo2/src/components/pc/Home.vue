<template>
  <div style="width: 100%;margin: 0 auto; padding-top: 1em ">

    <div class="top">
      <ul style="padding-right: 3em; margin: 0 auto ">
      <li><a style="cursor:pointer;color: red" @click="go_to_my_dou_dian_page()" >我关注的抖店</a></li>
      <li><a style="cursor:pointer;color: red" @click="go_to_my_goods_page()" >我的商品库</a></li>
      <li><a style="cursor:pointer;color: red" @click="go_to_plugs_page()" >淘宝订单同步教程</a></li>
      <li><a style="cursor:pointer;color: blue" @click="on_logout" >退出登录</a></li>
      <li style=""><a style="cursor:pointer;color: blue" @click="go_to_personal" v-text="user"> 个人中心</a></li>
    </ul>
    </div>

    <div class="nav_div"  >
      <router-link class="nav" to = "/pc/home/porder" >下订单</router-link>
      <router-link class="nav" to = "/pc/home/myorder" >我的订单</router-link>
      <router-link class="nav" to = "/pc/personal/recharge2" >充值</router-link>

      <a class="nav" @click="go_to_null_package_page" >空包</a>
      <a class="nav tb_order_old"       @click="show_plugs_tip"  >同步淘宝已付款订单</a>
      <a class="nav delivery_tb_order_old"   @click="show_plugs_tip" >已发货订单同步到淘宝</a>
      <a class="nav tb_order"     style="display: none"   >同步淘宝已付款订单</a>
      <a class="nav delivery_tb_order"  style="display: none"    >已发货订单同步到淘宝</a>
    </div>
    <div style="width: 100%; " >
      <keep-alive><router-view style="width: 100%"></router-view></keep-alive>
    </div>
  </div>
</template>

<script>
    import  axios  from 'axios'
    import ajaxhk from 'ajax-hook'
//
// ajaxhk.hookAjax({
//   onreadystatechange:function(xhr){
//     console.log("onreadystatechange---->",xhr)
//   },
//   onload:function(xhr){  console.log("onload---->",xhr) },
//      open:function(arg){
//           console.log("open called: method:%s,url:%s,async:%s",arg[0],arg[1],arg[2])
//
//
//         },

// })

    //*****************222
//  let request_url = "https://wuliu.taobao.com/user/order_list_new.htm"
//        $.ajax({
//             async : false,
//             url :request_url,
//             type : "POST",
//             // jsonp:'callback',
//             // jsonpCallback:"jsonpCallback",
//             dataType : 'jsonp',
//        // crossDomain: true,
//        //      data : parms,
//             timeout : 5000,
//             xhrFields:{
//               withCredentials:true
//             },
//
//
//             success : function(result, status, xhr) {
//                     console.log('状态为：' + status + ',状态是：' + xhr.statusText);
//                     console.log(result);
//
//                     let html = result.substring(result.indexOf("<html>"),result.indexOf("</html>")+7)
//                          html = $.parseHTML(html)
//                      if(page_number===1){
//                           let dom = html
//                           let page_dom = $(dom).find(".page-top")[0]
//                           let  papge_a = $(page_dom).find("a")
//                           papge_a.each(function () {
//                           if(!isNaN($(this).text())){
//                             page_counts = $(this).text()
//                         }
//                     })
//                      }
//
//
//
//
//
//             },
//             error:function (err) {
//                 console.log("错了:" + err);
//                 console.log("错了:" + JSON.stringify(err));
//
//             }
//         });
//      //设为ttrue 就会带cookies 访问
//     axios.defaults.withCredentials=true;
//     // $.ajaxPrefilter("json script", function(options, originalOptions, jqXHR) {
//     //   if (options.dataFilter) {
//     //     options._success = options.success;
//     //     options._dataFilter = options.dataFilter;
//     //     options.dataFilter = undefined;
//     //     options.success = function (a, b, c) {
//     //       options._success(options._dataFilter(a, options.dataType), b, c);
//     //     }
//     //   }
//     // })
//     $.ajaxSetup({
//       dataFilter:function (data,type) {
//         console.log("arguments--->00",data)
//         console.log("arguments--->type",type)
//         return data
//       }
//     })
//       $(document).ajaxComplete(function (event,request,settings) {
//         console.log("ajaxComplete--->",request)
//         console.log("event--->",event)
//         console.log("settings--->",settings)
//
//       });
//      function jsonpCallback(response){
//           console.log(response)
// //处理 data
// }

//*****************222
    export default {
      name: "Home",
      data(){
        return{
          user :"个人中心"
        }
      },
      methods:{
        tet(){
          let request_url = "https://wuliu.taobao.com/user/order_list_new.htm"
           // request_url = "/api555"
           // request_url = "/api444"
           // request_url = "https://www.baidu.com"

          let parms = {
                 "source":"",
                 "callUrl":"",
                 // "_tb_token_":"ffe0157689337",
                 "orderStatusShow" :"send",
                 "receiverName" :"",
                 "receiverWangWangId":"" ,
                 "beginDate" :"",
                 "endDate" :"",
                 "taobaoTradeId" :"",
                 "shipping2":"-1",
                 "orderType":"-1",
                 "orderSource":"0",
                 "currentPage" :1,

             }
               axios.defaults.withCredentials=true;

//               axios.post(request_url,parms).then((res)=>{
//                 console.log("res---->",res)
//             }).catch(error => {
// console.log("error---->",error)
//               })

   // ******************
//      var script = document.createElement('script');
//     // script.type = 'text/javascript';
//
//     // 传参并指定回调执行函数为onBack
//     script.src = request_url+"?order_status_show=send&callback=onBack3"
//      document.body.insertBefore(script,document.body.firstChild);
//        window.onBack3=function(response){
//           console.log(response)
// //处理 data
// }
//     // 回调执行函数
//     function onBack2(res) {
//       alert(JSON.stringify(res));
//     }
    // ******************

    $.ajax({
            async : false,
            url :request_url,
            type : "POST",
            // jsonp:'callback',
            // jsonpCallback:"jsonpCallback",
            dataType : 'jsonp',
       // crossDomain: true,
            data : parms,
            timeout : 5000,
            xhrFields:{
              withCredentials:true
            },

            dataFilter:function(data,type){
              console.log('data：',data);
              console.log('type：',type);
            },
            success : function(result, status, xhr) {
                    console.log('状态为：' + status + ',状态是：' + xhr.statusText);
                    console.log(result);

                    let html = result.substring(result.indexOf("<html>"),result.indexOf("</html>")+7)
                         html = $.parseHTML(html)
                     if(page_number===1){
                          let dom = html
                          let page_dom = $(dom).find(".page-top")[0]
                          let  papge_a = $(page_dom).find("a")
                          papge_a.each(function () {
                          if(!isNaN($(this).text())){
                            page_counts = $(this).text()
                        }
                    })
                     }





            },
            error:function (err) {
                console.log("错了:" + err);
                console.log("错了:" + JSON.stringify(err));

            }
        });

          // request_url = request_url+"?order_status_show=send&callback=jsonpCallback"
//           request_url = request_url+"/?callback=jsonpCallback"
// $.getJSON( request_url, function(data){
//                 console.log(data);
//             });
          //****
// parms = Object.assign(parms,{callbackQuery:"callbackParam",callbackName:"jsonpCallback"})
//    this.$jsonp(request_url,parms).then(json=>{
//      console.log("json",json)
//    })
            //****

        },
        go_to_my_dou_dian_page(){
             let  routeData = this.$router.resolve({ path: '/pc/douYinHome/pMyFocusDouYinShop'})
            window.open(routeData.href, '_blank')
          },
        go_to_my_goods_page(){
             let  routeData = this.$router.resolve({ path: '/pc/pMyGoods'})
            window.open(routeData.href, '_blank')
          },
          go_to_plugs_page(){
             let  routeData = this.$router.resolve({ path: '/pc/pPlugsInfo'})
            window.open(routeData.href, '_blank')
          },
          go_to_personal(){
             let  routeData = this.$router.resolve({ path: '/pc/personal/userDetails'})
            window.open(routeData.href, '_blank')
          },
           go_to_null_package_page(){
             let  routeData = this.$router.resolve({ path: "/pc/nullPackageHome/pNullOrder" })
            window.open(routeData.href, '_blank')
          },
          show_plugs_tip(){
            alert("请安装插件")
          },
          load_tb_order(){


                    let response =this.get_all_page_order_from_tb()
                    let order_page = JSON.parse(response)
                    let is_success = order_page.is_success
                    let message = order_page.message
                    if(is_success===false && message==="go_to_login_tb"){
                        window.open("https://login.taobao.com/");
                        return
                    }
                    let order_list = order_page.result
                    let tb_order_number_list = []

                   for(let i = 0;i<order_list.length;i++){
                      let  tb_order_number = order_list[i].tb_order_number
                      tb_order_number_list.push(tb_order_number)
                   }



          },
          on_logout(){
             this.setLocalValue("user","")
            this.$cookies.set("access_token" ,"");
            this.$router.replace("/pc/login/")
          },

 // 回调执行函数
     onBack2:function(response) {
            console.log(response)
      alert(JSON.stringify(response));
    },

 get_page_order_from_tb(page_number,page_counts){

    if(page_number === undefined || page_number === null){
        page_number = 1
    }
    if(page_counts === undefined ||  page_counts === null){
        page_counts = 1
    }
    let request_url = "https://wuliu.taobao.com/user/order_list_new.htm"
    let parms = {
                 "source":"",
                 "callUrl":"",
                 // "_tb_token_":"ffe0157689337",
                 "orderStatusShow" :"send",
                 "receiverName" :"",
                 "receiverWangWangId":"" ,
                 "beginDate" :"",
                 "endDate" :"",
                 "taobaoTradeId" :"",
                 "shipping2":"-1",
                 "orderType":"-1",
                 "orderSource":"0",
                 "currentPage" :page_number,

             }
    let  return_data = null
//               axios.post(request_url,parms).then((res)=>{
//                 console.log("res---->",res)
//             }).catch(error => {
// console.log("error---->",error)
//               })

   // ******************
//      var script = document.createElement('script');
//     // script.type = 'text/javascript';
//
//     // 传参并指定回调执行函数为onBack
//     script.src = request_url+"?order_status_show=send&callback=onBack3"
//      document.body.insertBefore(script,document.body.firstChild);
//        window.onBack3=function(response){
//           console.log(response)
// //处理 data
// }
//     // 回调执行函数
//     function onBack2(res) {
//       alert(JSON.stringify(res));
//     }
    // ******************

    // $.ajax({
    //         async : false,
    //         url :request_url,
    //         type : "GET",
    //         jsonp:'callback',
    //         jsonpCallback:"onBack3",
    //         dataType : 'jsonp',
    //    // crossDomain: true,
    //         data : parms,
    //         timeout : 5000,
    //         xhrFields:{
    //           withCredentials:true
    //         },
    //
    //         success : function(result, status, xhr) {
    //                 console.log('状态为：' + status + ',状态是：' + xhr.statusText);
    //                 console.log(result);
    //
    //                 let html = result.substring(result.indexOf("<html>"),result.indexOf("</html>")+7)
    //                      html = $.parseHTML(html)
    //                  if(page_number===1){
    //                       let dom = html
    //                       let page_dom = $(dom).find(".page-top")[0]
    //                       let  papge_a = $(page_dom).find("a")
    //                       papge_a.each(function () {
    //                       if(!isNaN($(this).text())){
    //                         page_counts = $(this).text()
    //                     }
    //                 })
    //                  }
    //                 result = get_order_goods_str_from_elems(html)
    //
    //
    //                 $(html).find(".J_Trigger").each(function () {
    //                     // console.log("11",$(this))
    //
    //                 })
    //
    //                  return_data =  {
    //                      "result":result,
    //                      "page_number":page_number,
    //                      "page_counts":page_counts,
    //                      "is_success":true
    //                  }
    //
    //
    //         },
    //         error:function (err) {
    //             console.log("错了:" + err);
    //             console.log("错了:" + JSON.stringify(err));
    //             if(JSON.stringify(err).indexOf("NetworkError: Failed to execute 'send'")){
    //                 return_data =  {"is_success":false, "message":"go_to_login_tb", }
    //             }else{
    //                 return_data =  {
    //
    //                      "is_success":false,
    //                      "message":"",
    //                  }
    //             }
    //
    //             return return_data
    //         }
    //     });

// $.getJSON( request_url+"?order_status_show=send&callback=onBack", function(data){
//                 console.log(data);
//             });
parms = Object.assign(parms,{callbackQuery:"callbackParam",callbackName:"jsonpCallback"})
   this.$jsonp(request_url,parms).then(json=>{
     console.log("json",json)
   })
            console.log("return_data",return_data)

     return return_data
},
          // 回调执行函数
     onBack(res) {
      alert(JSON.stringify(res));
    },
 get_all_page_order_from_tb(){
    let order_list = []
    let order_page = null

    order_page =this.get_page_order_from_tb()
   return
    let is_success = order_page.is_success
    if(is_success===false && order_page.message==="go_to_login_tb"){
        return {
                "is_success":false,
                "message":"go_to_login_tb"
            }

          }
     let order_page_result = order_page.result;

     order_list = order_list.concat(order_page_result)
     let page_numb =order_page.page_number
     let page_counts = order_page.page_counts

     while(page_numb < page_counts){

        console.log("page_numb",page_numb)
        console.log("page_counts",page_counts)
        order_page = this.get_page_order_from_tb(page_numb+1,page_counts)
        if(order_page.is_success===false && order_page.message==="go_to_login_tb"){
            return {"is_success":false,"message":"go_to_login_tb" }

         }
        page_numb =order_page.page_number
        page_counts = order_page.page_counts
        order_list = order_list.concat(order_page.result)
     }


          return    {"result":order_list,"is_success":true }

},
 get_order_goods_str_from_elems(elems){
     if( $(elems).find("label:contains(尺码：)").length !==0){
         $(elems).find("label:contains(尺码：)").next().addClass("17_size");
     }
     if(  $(elems).find("label:contains(尺寸：)").length !==0){
         $(elems).find("label:contains(尺寸：)").next().addClass("17_size");
     }
      var order_list = []
    $(elems).find(".info").not(".msg").each(function() {
        var tbody_elems = $(this).parents("tbody");

        var orderdetail_size = tbody_elems.find(".orderdetail").size();
        var m = "";
        var total = "";

        var order_goods_list=[]
        for (var i = 0; i <= orderdetail_size - 1; i++) {

            var order_goods_obj = {}
            m = "";

            m+= '"img":"'+tbody_elems.find("img:eq("+i+")").attr("src")+'",';
            order_goods_obj['img'] = tbody_elems.find("img:eq("+i+")").attr("src")

            total = tbody_elems.find(".total:eq(" + i + ")").text().toString().trim();
            total = total.substring(total.indexOf("×") + 1).trim();
            order_goods_obj['total'] = total

            if (tbody_elems.find(".desc:eq(" + i + ")").length != 0) {
                m += '"code":"' + tbody_elems.find(".desc:eq(" + i + ")").attr("title")+'",';
                order_goods_obj['code'] = tbody_elems.find(".desc:eq(" + i + ")").attr("title")
            }


            if (tbody_elems.find(".17_size:eq(" + i + ")").length != 0) {
                m += '"size":"' + tbody_elems.find(".17_size:eq(" + i + ")").text().toString() + '",';
                order_goods_obj['size'] = tbody_elems.find(".17_size:eq(" + i + ")").text().toString()
            }
            if (tbody_elems.find(".17_color:eq(" + i + ")").length != 0) {
                m += '"color":"' + tbody_elems.find(".17_color:eq(" + i + ")").text().toString() + '",';
                order_goods_obj['color'] = tbody_elems.find(".17_color:eq(" + i + ")").text().toString()
            }
            m += '"total":"' + total + '"';
            order_goods_list.push(order_goods_obj)


        }
        var order_goods_list_str = JSON.stringify(order_goods_list)

        var order_obj = new Object();
        var c = new Array();
        var f = tbody_elems

        f.find(".info").children("span").not(".j_telephone,.j_mobilePhone").remove();
        var l = f.find(".info").text().toString().trim("	");
        //console.log(l);
        var g = l.split("，");
        var b = g[g.length - 2].trim();//name
        var m = g[0].trim();
        var h = g[g.length - 1].trim();//phone

        order_obj['name'] = b;
        order_obj['address']  = m;
        order_obj['phone'] = h;

        // d.postscript = f.find("span.postscript").text().trim(" ");
       order_obj['tb_order_number'] = f.find("span.order-number").text().replace("订单编号：",'').trim();
       var new_goods_str_list = []
       for (var x = 0; x < order_goods_list.length; x++) {
        var order_goods = new Object()


        order_goods['code'] =  typeof order_goods_list[x].code === "undefined" ? "" :order_goods_list[x].code.replace("#","^^^")
        order_goods['img']= typeof order_goods_list[x].img === "undefined" ? "" : order_goods_list[x].img;
        order_goods['size']= typeof order_goods_list[x].size === "undefined" ? "" : order_goods_list[x].size
        order_goods['color']= typeof order_goods_list[x].color === "undefined" ? "" : order_goods_list[x].color;
        order_goods['count']= typeof order_goods_list[x].total === "undefined" ? "" : order_goods_list[x].total;
        new_goods_str_list.push(order_goods)
    // d.goodinfo[x] = ordergoodslist[x];

    }

        order_obj['order_goods_list']=new_goods_str_list
        order_list.push(order_obj)

    })
    return order_list
},


      },
      created(){
            let user_info = this.getLocalValue("user");


            if(user_info !==""){
              this.user = JSON.parse(user_info).user_name
            }
      },
      mounted(){
         window.jsonpCallback =(response)=>{
          console.log(response)
//处理 data
}
      }
    }
</script>

<style scoped>
  .nav_div{
    width: 100%;
    text-align: center;

    height: 2em;

  }
  .top{
    width: 100%;
    height: 2em;
    padding-right: 2em;


  }
  .top ul{
    float: right;
  }
  .top ul li{
    width: auto;
    float: left;
    list-style: none;
    padding-left: 0.5em;
  }
.nav{
  text-decoration:none;
  border-radius: 4px;
  font-weight: bold;
  padding: 5px;
  cursor:pointer;
}
</style>
