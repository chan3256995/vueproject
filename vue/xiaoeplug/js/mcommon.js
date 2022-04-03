 
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

function mcommon_get_base_vue_url_17(){
    // let base_url_bl = "http://192.168.1.102:8082"
    let base_url_bl = "http://17daina.com"
    return base_url_bl
}


function mcommon_get_base_server_url_17(){
    // let base_url_bl = "http://192.168.1.102:8009"
     let base_url_bl = "http://39.96.69.115:8089"

    return base_url_bl
}


function mcommon_get_plugs_version(){

let cur_versin = "2.1"
$.ajax({
	type:"GET",
	url:mcommon_get_base_server_url_17()+"/user/getPlugsVersion/?version_name=tb_client",
	async:true,
	success: function(result){
	    try {
            let result_data = result.data
	         let last_version =  result_data.version_code

		    if(cur_versin!==last_version    ){
			alert('插件已升级到'+last_version+'，请及时更新');

		}
        }catch (e) {
            console.log(e.toString())
        }

	},
	error: function(){}
}
)
}

// 取代商家编码一些字符
function mcommon_replace_goods_code_str(code_str){
        let m_code =  code_str === "undefined" ? "" :code_str.trim()
        
        let new_code = m_code.replace(/#/g,"^^^").trim()

        if (new_code === default_tb_code2_youfei){
            return default_tb_code2_youfei
        }
        if (new_code === ""){

            return default_tb_code
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

 