

let taojingling_base_url = "https://agent.xmf688.com/"

 function taojinglingapi_init_fankuan_page(){

    chrome.storage.local.get({"chuanmei_order_cache":{}},function (local_data) {

         console.log("读取本地储存记录,",local_data)
         let lacal_obj = local_data["chuanmei_order_cache"]
         let item_div = $("tbody").find(".el-table__row")
         $("span:contains('返款失败')").parent().after("<button id='add_tag_to_chuammei'> 选中的标记到传美</button>")
         for(let i = 0;i<item_div.length;i++){
             let item_data_obj = {}

             let p_order_number = $(item_div[i]).find("p[title='平台订单号']")
             let p_wangwang_id = $(item_div[i]).find("p[title='平台昵称']")
             let div_shop_name = $($(item_div[i]).find("td")[4]).find("div")
             let p_my_money = $(item_div[i]).find("p[title='押金']")
             let p_platm_money = $(item_div[i]).find("p[title='买手实付']")
             console.log("p_order_number",p_order_number)
             console.log("p_wangwang_id",p_wangwang_id)
             console.log("div_shop_name",div_shop_name)
             console.log("p_my_money",p_my_money)

             let order_number = $(p_order_number[0]).text().trim()
             let wangwang_id = $(p_wangwang_id[0]).text().trim()

             let shop_name = $(div_shop_name[0]).text().trim()

             let my_money = $(p_my_money[0]).text().replace("押金：","").trim()
             let platm_money = $(p_platm_money[0]).text().trim()


             let local_tb_order_data = lacal_obj[order_number]

             item_data_obj["order_number"]  = order_number
             item_data_obj["maishou_money"]  = platm_money
             item_data_obj["my_money"]  = my_money
             item_data_obj["shop_name"]  = shop_name
             item_data_obj["wangwang_id"]  = wangwang_id


             console.log("页面数据:",item_data_obj)
              let p_input = $(item_div[i]).find("input[type='checkbox']").attr("data",JSON.stringify(item_data_obj))

             if(local_tb_order_data!== undefined && local_tb_order_data !== null){
                 let refund_ = ""
                  for(let g = 0;g<local_tb_order_data['order_goods'].length;g++){

                      if(local_tb_order_data["order_goods"][g]['refund_status'] !== "无退款"){
                          refund_ = "有售后"
                      }
                  }
                 $($(p_platm_money[0])).append("<p   style='margin-top: 1em; color:red;display: block'> 淘宝 "+local_tb_order_data['order_status']+" "+ local_tb_order_data['payFee']+" "+ refund_+"</p>")
             }


         }
         $("#add_tag_to_chuammei").click(function () {
              $("input[type='checkbox']")
              let tid_list = []
              let post_data = {
                  "cmflag":4,
                  "memo":'',
                  "is_cover":0,
                  "from":0,
              }
              $(".el-checkbox__original:checked").each(function(){

                  let input_data_str = $(this).attr("data")
                  let tid_item = {}
                  console.log("选中的数据:",input_data_str)

                  if(input_data_str!==undefined && input_data_str!==""){
                     let input_data = JSON.parse(input_data_str)



                        tid_item = {
                         "name":seller_id_choies[input_data['shop_name']],
                         "tid":input_data['order_number'],
                        }
                      tid_list.push(tid_item)
                     // let result = apichuanmei_add_tag_tb(seller_id_choies[input_data['shop_name']],input_data['order_number'],4,input_data["my_money"]+"/"+input_data["platm_money"])
                     // console.log("标记"+result['success']+"，"+result['message'])
                     console.log("tid_order_list1:",tid_list)

                  }
                  })
               post_data['tid_order_list'] = tid_list
              console.log("tid_order_list:2", post_data['tid_order_list'])
               chrome.runtime.sendMessage({"method":"batch_add_tag_to_chuanmei_tb","post_data":JSON.stringify(post_data)},function (response) {
                              console.log("传美插旗结果，",response)
                              let result = JSON.parse(response)
                               if(result["success"] === false){
                                   Toast(" 插旗失败，"+result["message"])
                               }else{
                                    Toast(" 插旗成功，"+result["message"]+result["data"]['succNum']+"/"+result["data"]['totalNum'],300)
                               }

                            })

         })
         console.log("item：",item_div)

})



 }