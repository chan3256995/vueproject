let zhaoyaojing_base_url = "http://106.13.166.248/"
let zhaoyaojing_query_url = zhaoyaojing_base_url+"/app/zyj/opQuery.jsp"
let zhaoyaojing_login_url = zhaoyaojing_base_url+"/app/zyj/op.jsp"
let zhaoyaojing_index_urll = zhaoyaojing_base_url+"/app/zyj/opIndex.jsp"
function zhaoyjingapi_get_user_info(){
    return {
        user_name:"13411269012",
        pwd:"a12345678"
    }
}
//检查账号
function zhaoyjingapi_check_user (user_name){
    let ret = {success:false,message:""}
    console.log("照妖镜api被调用，正在查询用户名：",user_name)

        let obj = {
            "m":"sAliim",
            "aliim":user_name,
            "ifQBase":true,
            "judgeAnother":true,

        }
        $.ajax({
            async : false,
            url :zhaoyaojing_index_urll,
            type : "POST",
            // dataType : 'json',
            data : {m:"getSmartCostType"},
            timeout : 5000,
            success : function(result) {
                    console.log("照妖镜查询结果0:",result)


            },
            error:function (err) {
                console.log("错了:" + err);
                 console.log(JSON.stringify(err))
            }
        });
        $.ajax({
            async : false,
            url :zhaoyaojing_query_url,
            type : "POST",
            // dataType : 'json',
            data : obj,
            timeout : 5000,
            success : function(result) {
                    console.log("照妖镜查询结果1:",result)
                    console.log("照妖镜查询结果2:",JSON.parse(result))
                    let res = JSON.parse(result)
                    let image_list = []
                    ret["success"] =true
                    image_list.push(res['baseImg'])
                    image_list.push(res['downImg'])
                    ret["image_list"] =image_list

            },
            error:function (err) {
                console.log("错了:" + err);
                 console.log(JSON.stringify(err))

            }
        });
        return ret
}
function zhaoyjingapi_login (user_name,pwd){
    let login_data = {
        m: "login",
        username: user_name,
        password: pwd,
        type: 1,
        origin: "xtoolApp",
    }
    let ret = {success:false,message:""}

        $.ajax({
            async : false,
            url :zhaoyaojing_login_url,
            type : "POST",
            // dataType : 'json',
            data : login_data,
            timeout : 5000,
            success : function(result) {
                    console.log("登录结果:",result)
                    ret['success'] = true

            },
            error:function (err) {
                console.log("错了:" + err);
                 console.log(JSON.stringify(err))
            }
        });

        return ret
}
function zhaoyjingapi_get_image_content (image_list){
    let req_data = {
        image_list: JSON.stringify(image_list),
        referer: zhaoyaojing_base_url
    }
    let ret = {success:false,message:""}
        let req_url = api17_get_server_base_url()
            // req_url =  "http://192.168.1.102:8009"
        $.ajax({
            async : false,
            url :req_url+"/back/getZhaoYaoJingImage/",
            type : "POST",
            // dataType : 'json',
            data : req_data,
            timeout : 5000,
            success : function(result) {
                    console.log("获取图片地址结果:",result)
                    if(result['code'] === "1000"){
                        ret['success'] = true
                        ret['image_list'] = result['image_list']
                    }


            },
            error:function (err) {
                console.log("错了:" + err);
                 console.log(JSON.stringify(err))
            }
        });

        return ret
}
