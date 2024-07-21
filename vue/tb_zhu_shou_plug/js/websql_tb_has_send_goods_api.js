// 记录已发货订单




    function websqlapi_init_tb_has_send_goods_table() {
    let tableName = "tb_has_send_goods_table"
    var creatTableSQL = 'CREATE TABLE IF  NOT EXISTS ' + tableName + ' (rowid INTEGER PRIMARY KEY AUTOINCREMENT,refund_status text,tb_order_number text,seller_remarks text,sellerFlag text,cmFlag text,order_status text,create_time text,send_time text,sellerNick text,goods_id text,img_url text,title text,add_time text,update_time text )';
    WEBSQL_DB.transaction(function(ctx, result) {
        ctx.executeSql(creatTableSQL, [], function(ctx, result) {
            console.log("表创建成功 " + tableName);
            Toast("表创建成功 " + tableName);
        }, function(tx, error) {
            alert('创建表失败:' + tableName + error.message);
        });
    });
}

// 保存已发货商品
    function websqlapi_insert_tb_has_send_goods_table_data( all_goods_list) {
    console.log("all_goods_list:",all_goods_list)
     //记录换图片

     let tableName = "tb_has_send_goods_table"
      // 数据库还未存在的数据
      let is_not_exits_goods_list  = []

    WEBSQL_DB.transaction(function(ctx) {

        for(let i=0;i<all_goods_list.length;i++){
            let item_data = all_goods_list[i]
            let cur_time = new Date().getTime()+""
            console.log("cur_time-->",cur_time)
            let item_data_list=[
                item_data['order_info']['tb_order_number'],
                item_data['order_info']['seller_remarks'],
                item_data['order_info']['sellerFlag']+"",
                item_data['order_info']['cmFlag']+"",
                item_data['order_info']['order_status'],
                item_data['order_info']['create_time'],
                item_data['order_info']['send_time'],
                item_data['order_info']['sellerNick'],
                item_data['refund_status'],
                item_data['goods_id'],
                item_data['goods_pic'],
                cur_time,
                item_data['title'],
                cur_time]
            let insterTableSQL = 'INSERT INTO ' + tableName + ' (tb_order_number,seller_remarks,sellerFlag,cmFlag,order_status,create_time,send_time,sellerNick,refund_status,goods_id,img_url,add_time,title,update_time) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)';
            let select_sql = "SELECT * FROM " + tableName + " where  tb_order_number ='"+item_data['order_info']['tb_order_number'] + "' order by add_time DESC";
            let delete_data_sql = "DELETE FROM " + tableName +" where tb_order_number = '"+item_data['order_info']['tb_order_number']+"'";
            console.log("删除sql:",delete_data_sql)
            ctx.executeSql(delete_data_sql, [], function(ctx, result) {
                console.log('删除成功: ' + tableName + result.rows +"条");

                ctx.executeSql(insterTableSQL, item_data_list, function(ctx, result) {
                        console.log("插入 " + tableName + item_data['order_info']['tb_order_number'] + "成功");

                     },
                 function(tx, error) {
                        console.error('插入 : ' + error.message);
                    });

        },
        function(tx, error) {
            console.error('查询失败: ' + error.message);
        });


        }

        console.log("is_not_exits_goods_lis",is_not_exits_goods_list)

    });
}

    function websqlapi_query_tb_has_send_goods_table_data(goods_list,params_obj) {

        console.log("params_obj",params_obj)
        console.log("goods_list",goods_list)
        let order_by = params_obj["order_by"]
        //goods_id 不为空 就是单个查询
        let goods_id = params_obj["goods_id"]
        let return_data  = {}
       let tableName = "tb_has_send_goods_table"
        let where_sql = " where "
        let where_condition = params_obj['where_condition']
        var selectALLSQL = 'SELECT * FROM ' + tableName;
        if(where_condition !==undefined && where_condition !=='') {
            where_sql = where_sql +where_condition
        }
        if(goods_id!==undefined && goods_id !==""){
            where_sql = where_sql + " and goods_id ='"+goods_id+"'"
        }
        if(where_sql === " where"){
           where_sql=  where_sql.replace(" where",'')
        }

        selectALLSQL = selectALLSQL+where_sql
        if(order_by !==undefined){
            selectALLSQL = selectALLSQL + " order by "+ order_by
        }
        console.log("查询sql",selectALLSQL)
        WEBSQL_DB.transaction(function(ctx) {
            ctx.executeSql(selectALLSQL, [], function(ctx, result) {
                console.log('查询成功: ' + tableName + result.rows.length);
                var len = result.rows.length;
                let has_send_order_list  = []

                for (var i = 0; i < len; i++) {

                    let  db_cur_item = result.rows.item(i)
                    let addtime = format_stmp_to_time(db_cur_item.add_time)
                    let sql_item = {

                        "goods_id": db_cur_item.goods_id,
                        "img_url": db_cur_item.img_url,
                        "cmFlag": db_cur_item.cmFlag,
                        "sellerFlag": db_cur_item.sellerFlag,
                        "title": db_cur_item.title,
                        "create_time": db_cur_item.create_time,
                        "send_time": db_cur_item.send_time,
                        "refund_status": db_cur_item.refund_status,
                        "tb_order_number": db_cur_item.tb_order_number,
                        "add_time": addtime,
                    }
                    has_send_order_list.push(sql_item)
                }
                console.log("-------- 我是分割线 -------");
                return_data['has_send_order_list'] = has_send_order_list

                console.log("has_send_order_list",has_send_order_list)
                let calc_resul = {}
                if(params_obj["show_model"]==="单个商品退货率"){
                    calc_resul= apichuammei_calculate_one_goods_refund_percent(has_send_order_list)
                }else{
                     calc_resul = apichuammei_calculate_refund_percent(has_send_order_list)
                }

                if(params_obj["update_page"] ==="备货页面" && params_obj["show_model"]==="单个商品退货率"){
                    let append_elems_str = apichuammei_one_goods_refund_percent_model(calc_resul)
                    let click_button = params_obj["click_button"]
                     $(".refund_goods_log_div_17").remove()
                     $(".data_div17_top").after(append_elems_str)
                    let m_postion = $(click_button).offset();
                     $(".refund_goods_log_div_17").offset(m_postion)
                     $(".single_goods_refund_percent_span_17").click(function (){
                         $(".refund_goods_log_div_17").remove()
                     })

                }else if(params_obj["update_page"] ==="备货页面" && params_obj["show_model"]==="多商品退货率"){
                     let append_elems_str = apichuammei_goods_refund_percent_model_model(calc_resul)
                     $(".data_div17_all_content").remove()
                     $(".data_div17_top").after(append_elems_str)
                     $(".refund_goods_id_show_17").click(function (){
                           let goods_id = $(this).text().trim()
                           let  tb_shop_select_17 = $("#tb_shop_select_17").find("option:selected").val()
                          let where_condition = "cmFlag != '4'"
                          if(tb_shop_select_17 !=="显示全部"){
                                where_condition = where_condition +" and sellerNick='"+tb_shop_select_17+"'"
                          }
                          websqlapi_open_db()
                          websqlapi_query_tb_has_send_goods_table_data([],{"click_button":$(this),"update_page":"备货页面","show_model":"单个商品退货率","goods_id":goods_id,"order_by":[ " send_time desc"],"where_condition":where_condition})


                     })
                }



            },
            function(tx, error) {
                console.error('查询失败: ' + error.message);
            });
        });


}

