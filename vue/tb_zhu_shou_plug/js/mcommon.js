

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

