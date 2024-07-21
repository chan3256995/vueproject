
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
    let null_package_logistics_type_choise_gs = {"圆通洗衣粉": 19,"圆通纸板":20,"中通空包":16}
    // js 网空包物流类型
    let null_package_logistics_type_choise_js = {"圆通空包": 12,"圆通实包":13}
    let null_package_logistics_type_choise = null_package_logistics_type_choise_gs
    return null_package_logistics_type_choise
}

function mcommon_get_null_package_base_url_bl(web_site_name){

        let base_url_bl = "http://www.17to17.vip"
    let site_name = {
        "光速代发":"http://17to17.tkttt.com/",
        "海鸥代发":"http://haiou.xuanhuoba.com",

    }
    base_url_bl = site_name[web_site_name]
    return base_url_bl

}

//循环取代所有字符
function mcommon_replace_all(replace_list,str){
    for(let i = 0 ; i<replace_list.length;i++){
        let replace_old = replace_list[i]["old"]
        let replace_new = replace_list[i]["new"]
        str = str.replace(new RegExp(replace_old,"g"),replace_new)
        
    }
    return str.trim()
    
}
function mcommon_get_base_url_bl(web_site_name){
    let base_url_bl = "http://www.17to17.vip"
    let site_name = {
        "光速代发":"http://17to17.tkttt.com",
        "海鸥代发":"http://haiou.xuanhuoba.com",

    }
    base_url_bl = site_name[web_site_name]
    return base_url_bl
}
function mcommon_get_base_url_315(){

    // let base_url_bl = "https://www.315df.com"
    let base_url_bl =BASE_URL_315
    return base_url_bl
}
function mcommon_get_base_url_17(){
    // let base_url_bl = "http://192.168.0.108:8009"
    let base_url_bl = "http://39.96.69.115:8089"
    return base_url_bl
}
function mcommon_get_base_vue_url_17(){
    let base_url_bl = "http://39.96.69.115:8080"
    // let base_url_bl = "http://192.168.0.108:8088"
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
// 网页表格数据导出到excel
function common_exportExcel_table_data(table_element){

    // 创建工作簿
        const workbook = XLSX.utils.book_new();

        var worksheet = XLSX.utils.table_to_sheet($(table_element));
        // 将工作表添加到工作簿中
        XLSX.utils.book_append_sheet(workbook, worksheet, "ddddd");
        // 导出 Excel 文件
            const wbout = XLSX.write(workbook, { bookType: 'xlsx', type: 'binary' });

            // 字符串转ArrayBuffer


            const blob = new Blob([s2ab(wbout)], { type: 'application/octet-stream' });
            function s2ab(s) {
                var buf = new ArrayBuffer(s.length);
                var view = new Uint8Array(buf);
                for (var i=0; i!=s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
                return buf;
            }
            // 生成一个下载链接并模拟点击进行下载
            const downloadLink = document.createElement('a');
            downloadLink.href = URL.createObjectURL(blob);
            downloadLink.download = 'data.xlsx';
            downloadLink.click();
}

//list 列表数据导出到excel
function common_exportExcel_list_data(data,file_name) {
    console.log("exportExcel................",data)
    // 模拟一些数据，用于导出到 Excel
    //      data = [
    //         ["订单编号", "收件人", "固话","手机","地址","发货信息","备注","代收金额","保价金额","业务类型"],
    //         ["1r", "李晓珊 ", "","13825862259 ","山东省,潍坊市,奎文区,清池街道樱前街8088号十地金隅园北区高层702","","","","",""],
    //         ["12r", "于云香 ", "","18764734204-5830 ","广东省,汕头市,金平区,岐山街道下岐报本路48号401","","","","",""],
    //
    //     ];
         let tem_file_name = "data"
        if(file_name !== undefined && file_name !==""){
            tem_file_name = file_name
        }
        // 创建工作簿
        const workbook = XLSX.utils.book_new();

        // 创建一个工作表
        const worksheet = XLSX.utils.aoa_to_sheet(data);

        // 将工作表添加到工作簿中
        XLSX.utils.book_append_sheet(workbook, worksheet, "sheet1");

        // 导出 Excel 文件
            const wbout = XLSX.write(workbook, { bookType: 'xlsx', type: 'binary' });

            // 字符串转ArrayBuffer


            const blob = new Blob([s2ab(wbout)], { type: 'application/octet-stream' });
            function s2ab(s) {
                var buf = new ArrayBuffer(s.length);
                var view = new Uint8Array(buf);
                for (var i=0; i!=s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
                return buf;
            }
            // 生成一个下载链接并模拟点击进行下载
            const downloadLink = document.createElement('a');
            downloadLink.href = URL.createObjectURL(blob);
            downloadLink.download = tem_file_name +'.xlsx';
            downloadLink.click();
        }


