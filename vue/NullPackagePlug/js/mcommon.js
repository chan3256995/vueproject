
// 获取登录账号密码 实单下单地址 登录账号名和密码
function mcommon_order_get_login_account_info_bl(){
    if(mcommon_get_null_package_base_url_bl() === "http://speed.tkttt.com"){
        return {"user_name":"海文","password":"137637653"}
    }else if(mcommon_get_null_package_base_url_bl() === "http://www.17to17.vip"){
        return {"user_name":"gs01","password":"a123a123a"}
    }

}
// 获取登录账号密码 空包下单地址 登录账号名和密码
function mcommon_nul_order_get_login_account_info_bl(){

}

function mcommon_get_null_package_logistics_type_choise_bl(){
      //gs网 空包物流类型
    let null_package_logistics_type_choise_gs = {"圆通洗衣粉": 19,"圆通纸板":20}
    // js 网空包物流类型
    let null_package_logistics_type_choise_js = {"圆通空包": 12,"圆通实包":13}
    let null_package_logistics_type_choise = null_package_logistics_type_choise_gs
    return null_package_logistics_type_choise
}

function mcommon_get_null_package_base_url_bl(){
     // 空包代发地址
    let null_package_base_url_gs = "http://www.17to17.vip"
    let null_package_base_url_js = "http://speed.tkttt.com"
    let null_package_base_url = null_package_base_url_gs
    return null_package_base_url
}

function mcommon_get_base_url_bl(){
    // let base_url_bl = "http://www.17to17.vip"
    let base_url_bl = "http://speed.tkttt.com"
    return base_url_bl
}
function mcommon_get_base_url_315(){

    let base_url_bl = "https://www.315df.com"
    return base_url_bl
}
function mcommon_get_base_url_17(){
    // let base_url_bl = "http://192.168.2.110:8009"
    let base_url_bl = "http://39.96.69.115:8089"
    return base_url_bl
}
function mcommon_get_base_vue_url_17(){
    let base_url_bl = "http://39.96.69.115:8080"
    // let base_url_bl = "http://192.168.2.110:8088"
    return base_url_bl
}

function mcommon_get_base_url_remote_server_address_17(){
    let base_url_bl = "http://39.96.69.115:8089"
    return base_url_bl
}

function mcommon_get_logistics_type_choies_bl(){
            // ho网 订单物流类型
      let mcommon_logistics_type_choies_ho = {}
    if( mcommon_get_base_url_bl() === "http://speed.tkttt.com"){
         mcommon_logistics_type_choies_ho = {
            "圆通[菜鸟]":"圆通速递",
            "圆通[拼多多]":"圆通速递",
            "韵达":"韵达快递",
}
    }else{
         mcommon_logistics_type_choies_ho = {
            "圆通[菜鸟]":"圆通速递",
              "圆通[拼多多]":"圆通速递",
            "中通":"中通速递",
        }
    }

return mcommon_logistics_type_choies_ho
}

function mcommon_find_order(tb_order_number,order_list){
        for(let i = 0;i<order_list.length;i++){
                    if(tb_order_number === order_list[i]['tb_order_number']){
                        return order_list[i]
                }
            }
            return null
}
function mcommon_get_goods_status(){
     let GOODS_STATUS={
              1:"未付款",//未付款
              2:"已付款",//已付款
              3:"拿货中",//拿货中
              4:"已拿货",//已拿货
              5:"已发货",//已发货
              6:"已退款",//已退款
              7:"明日有货",//明日有货
               8:"已取消",
               9:"缺货",
               10:"标签打印",
               11:"快递打印",
              12: '已下架',
              13: '2-5天有货',
              14:'其他',
            }
     return GOODS_STATUS
}
function mcommon_find_order2(order_number,order_list){
        for(let i = 0;i<order_list.length;i++){
                    if(order_number === order_list[i]['order_number']){
                        return order_list[i]
                }
            }
            return null
}

function mcommon_form_serialize_data_to_obj(serialize_data){
       serialize_data = decodeURIComponent(serialize_data)
        let    serialize_data_array = serialize_data.split("&")
        // let  submit_data_obj = {'ctl00$ContentPlaceHolder1$btnNew':'重新解析'}
        let  data_obj = {}
        for(let i = 0;i < serialize_data_array.length;i++){
             let data_arr = serialize_data_array[i].split("=");
             let tem_datA ="";
             if(data_arr.length >2){
                      tem_datA =serialize_data_array[i].substring(serialize_data_array[i].indexOf("=")+1,serialize_data_array[i].length)
             }else{
                  tem_datA = data_arr[1]
             }
             if(data_obj[data_arr[0]] === undefined){
                  data_obj[data_arr[0]] = tem_datA
             }else{
                 data_obj[data_arr[0]] += "," +tem_datA
             }

         }
        return data_obj
}
