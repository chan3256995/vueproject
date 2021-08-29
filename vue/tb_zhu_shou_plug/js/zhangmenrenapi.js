
let zhangmenren_base_url = "http://www.zmr188.com/"

let zhangmenren_progress_and_history_url = "member/Taskmanage/progressAndHistoricalOrders.html"
//淘宝打标
function zhangmenrenapi_get_order_tb_link (order_id){
 let params = "?shopName=全部&taskType=&stime=&etime=&buyId=&taskId=&orderId="+order_id+"&revaccount=&platformId=&title=&keyword=&praiseType=0"
        let request_url = zhangmenren_base_url +zhangmenren_progress_and_history_url+params
        let tb_link = ""
        $.ajax({
            async : false,
            url :request_url,
            type : "GET",
            // dataType : 'json',
            // data : obj,
            timeout : 5000,
            success : function(result) {
                    console.log("掌门人查询进行中跟历史订单结果:",result)
                         let html = result.substring(result.indexOf("<html>"),result.indexOf("</html>")+7)
                         html = $.parseHTML(html)
                     let order_list_tr = $(html).find(".orderlist").find('tr')
                    for(let i=0;i<order_list_tr.length;i++){
                    let tr = order_list_tr[i]
                    let order_id2 =$( $(tr).find("td")[3]).text().trim()
                    console.log("order_id2",order_id2)
                    if(order_id===order_id2){
                          let a__link = $($(tr).find("td")[9]).find('a')[0]
                         tb_link = a__link.href
                        break
                    }
                }
            },
            error:function (err) {
                console.log("错了:" + err);
                 console.log(JSON.stringify(err))

            }
        });
 return tb_link
}
 