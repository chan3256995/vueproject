/**
 *数据库操作辅助类,定义对象、数据操作方法都在这里定义
 */
const base_db_conf = {
    dbName: 'h5ds',
    /*数据库名*/
    version: '2.0',
    /*数据库版本*/
    dbDesc: 'h5ds 本地本地数据库',
    /*数据库描述*/
    dbSize: 50* 1024 * 1024 /*数据库大小 kb*/
}

/**
 * 打开数据库
 * @returns  dataBase:打开成功   or 打开失败
 */
 function websqlapi_open_db() {
    /*数据库有就打开 没有就创建*/
    let dataBase = window.openDatabase(base_db_conf.dbName, "", base_db_conf.dbDesc, base_db_conf.dbSize, function() {});
    if (dataBase) {
        console.log("websql 数据库创建/打开成功!");
    } else {
        console.log("websql 数据库创建/打开失败！");
    }
    window.WEBSQL_DB = dataBase;
};

/**
 * 新建数据库里面的表单
 * @param tableName:表单名
 */
 function websqlapi_init_tb_refund_table(tableName) {
     tableName = "tb_refund_table"

    var creatTableSQL = 'CREATE TABLE IF  NOT EXISTS ' + tableName + ' (rowid INTEGER PRIMARY KEY AUTOINCREMENT,shop_name text,refund_order_id text,goods_name text,goods_code text,sku_name text,sku_code text,goods_counts text,send_logistics_number text,return_logistics_number text,logistics_update_time text,order_number text,send_logistics_info text,return_logistics_info text,seller_memo text,seller_flag text,refund_address_tb text,seller_phone_tb text,seller_mobile_tb text,seller_wangwang_id_tb text,img_url text,goods_id text,return_logistics_name)';
    WEBSQL_DB.transaction(function(ctx, result) {
        ctx.executeSql(creatTableSQL, [], function(ctx, result) {
            alert("表创建成功 " + tableName);
            console.log("表创建成功 " + tableName);
        }, function(tx, error) {
            alert('创建表失败:' + tableName + error.message);
        });
    });
}

//根据标题更新商品图片
 function websqlapi_update_order_goods_img_data(title_img_obj) {
     let tableName = "tb_refund_table"

    WEBSQL_DB.transaction(function(ctx) {
             let updateDataSQL = 'UPDATE ' + tableName + ' SET img_url = ? WHERE goods_name = ?';
             for (let key in title_img_obj) {
                      let title = key
                      let img_url = title_img_obj[title]
                      ctx.executeSql(updateDataSQL, [img_url,title], function(ctx, result) {
                            console.log("更新图片成功" + tableName + img_url + "成功");
                        },function(tx, error) {
                            console.error('更新图片失败: ' + error.message);
                });
              }

    });
}


  function websqlapi_insert_tb_refund_order_data( refund_list,data_from) {
     let tableName = "tb_refund_table"
     let tb_goods_title_update_table = "tb_goods_title_update_table"

    WEBSQL_DB.transaction(function(ctx) {
        if(data_from ==="chuammei"){
            for(let i=0;i<refund_list.length;i++){
            let item_data = refund_list[i]
            let item_data_list=[item_data['shop_name'],item_data['refund_order_id'],item_data['goods_name'],item_data['goods_code'],item_data['sku_name'],item_data['sku_code'],item_data['goods_counts'],item_data['send_logistics_number'],item_data['return_logistics_number'],item_data['logistics_update_time'],item_data['order_number'],item_data['send_logistics_info'],item_data['return_logistics_info'],item_data['seller_memo'],item_data['seller_flag']]
            var insterTableSQL = 'INSERT INTO ' + tableName + ' ( shop_name,refund_order_id,goods_name, goods_code, sku_name,sku_code,goods_counts,send_logistics_number,return_logistics_number,logistics_update_time,order_number,send_logistics_info,return_logistics_info,seller_memo,seller_flag) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)';
             let selectDataSQL = 'select * from ' + tb_goods_title_update_table + '   WHERE title = ?';

             ctx.executeSql(selectDataSQL, [item_data['goods_name']], function(ctx, result) {
                   console.log('查询成功: ' + tb_goods_title_update_table + result.rows.length +"条");
                   if(result.rows.length!==0){
                       insterTableSQL = 'INSERT INTO ' + tableName + ' ( shop_name,refund_order_id,goods_name, goods_code, sku_name,sku_code,goods_counts,send_logistics_number,return_logistics_number,logistics_update_time,order_number,send_logistics_info,return_logistics_info,seller_memo,seller_flag,goods_id,img_url) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)';
                       item_data_list.push(result.rows[0].goods_id)
                       item_data_list.push(result.rows[0].img_url)
                             console.log("插入sql" +insterTableSQL);
                        ctx.executeSql(insterTableSQL, item_data_list, function(ctx, result) {
                            console.log("插入" + tableName + item_data['order_number'] + "成功");
                        },
            function(tx, error) {
                            console.error('插入失败: ' + error.message);
                        });
                   }

                   },
            function(tx, error) {
                            console.error('查询失败: ' + error.message);
                           console.log("插入sql" +insterTableSQL);
                            ctx.executeSql(insterTableSQL, item_data_list, function(ctx, result) {
                                console.log("插入" + tableName + item_data['order_number'] + "成功");
                            },
                function(tx, error) {
                                console.error('插入失败: ' + error.message);
            });
            });

        }



        }else if(data_from==="taobao"){
            for(let i=0;i<refund_list.length;i++){
            let item_data = refund_list[i]
            let item_data_list=[item_data['seller_wangwang_id_tb'],item_data['refund_address_tb'],item_data['seller_phone_tb'],item_data['seller_mobile_tb'],item_data['return_logistics_name'],item_data['order_number_tb']]
            // let insterTableSQL = 'INSERT INTO ' + tableName + ' ( seller_wangwang_id_tb,refund_address_tb,seller_phone_tb, seller_mobile_tb) VALUES (?,?,?,?)';
            let updateDataSQL = 'UPDATE ' + tableName + ' SET seller_wangwang_id_tb = ?,refund_address_tb = ?, seller_phone_tb = ?,seller_mobile_tb = ?,return_logistics_name = ? WHERE order_number = ?';
            console.log("insert_tb_item_data_list",item_data_list)
            console.log("insterTableSQL",insterTableSQL)
            ctx.executeSql(updateDataSQL, item_data_list, function(ctx, result) {
                console.log("更新成功" + tableName + item_data['order_number_tb'] + "成功");

            },
            function(tx, error) {
                console.error('更新成功: ' + error.message);
            });
        }
        }


    });
}
// 退货地址为代拿的地址插上蓝色旗子
function websqlapi_add_tb_flag(tableName) {
    //     0: "店铺名" // 1: "退款单ID"// 2: "商品名称"// 3: "商品编码"// 4: "属性名称"// 5: "属性编码"// 6: "数量"// 7: "发货单号"// 8: "回退单号"// 9: "退款标识"// 10: "更新时间"// 11: "订单号"// 12: "退款金额"// 13: "发货单号最新物流"// 14: "回退单号最新物流"// 15: "卖家备注"// 16: "卖家旗帜"

    tableName = "tb_refund_table"
    var selectALLSQL = 'SELECT * FROM ' + tableName +' where refund_address_tb !=""';


    WEBSQL_DB.transaction(function(ctx) {
        ctx.executeSql(selectALLSQL, [], function(ctx, result) {
            console.log('查询成功: ' + tableName + result.rows.length);
            var len = result.rows.length;
            let cm_refund_list_data  = []

            for (var i = 0; i < len; i++) {

                let  db_cur_item = result.rows.item(i)
                let cm_data_item = [ db_cur_item.seller_flag,db_cur_item.seller_phone_tb,db_cur_item.seller_mobile_tb,db_cur_item.seller_wangwang_id_tb,db_cur_item.refund_address_tb ]


                 let tb_flag = db_cur_item.seller_flag
                let seller_wangwang_id_tb =db_cur_item.seller_wangwang_id_tb
                let seller_phone_tb = db_cur_item.seller_phone_tb
                let seller_mobile_tb = db_cur_item.seller_mobile_tb
                let order_number_tb = db_cur_item.order_number
                let seller_remarks = db_cur_item.seller_memo
                    console.log("tb_flag",tb_flag)
                    console.log("seller_phone_tb",seller_phone_tb)
                    if(tb_flag !=='蓝色' && seller_phone_tb !== undefined && seller_phone_tb.indexOf("020")!==-1){
                        let result_ = apichuanmei_add_tag_tb(seller_wangwang_id_tb,order_number_tb,null,seller_remarks,4)
                        if(result_["success"] === false){
                        Toast(order_number_tb+" 插旗失败，"+result_["message"])
                        }else{
                            Toast(order_number_tb+" 插旗成功，"+result_["message"],300)
                        }
                    }

            }



        },
        function(tx, error) {
            console.error('查询失败: ' + error.message);
        });
    });

}

/**
 * 获取数据库一个表单里面的所有数据
 * @param tableName:表单名
 * 返回数据集合
 */
function websqlapi_query_tb_refund_order_data(tableName,params_obj) {
    //     0: "店铺名" // 1: "退款单ID"// 2: "商品名称"// 3: "商品编码"// 4: "属性名称"// 5: "属性编码"// 6: "数量"// 7: "发货单号"// 8: "回退单号"// 9: "退款标识"// 10: "更新时间"// 11: "订单号"// 12: "退款金额"// 13: "发货单号最新物流"// 14: "回退单号最新物流"// 15: "卖家备注"// 16: "卖家旗帜"
    console.log("params_obj",params_obj)
    tableName = "tb_refund_table"
    let where_sql = " where"
    let order_by = " logistics_update_time desc"
    var selectALLSQL = 'SELECT * FROM ' + tableName;
    let refund_address = ""
    if(params_obj!==undefined){
        if(  params_obj["order_by"]!==undefined ){
            let order_by_list =  params_obj["order_by"]
            order_by = " "
            for(let b = 0 ;b<order_by_list.length;b++){
                order_by= order_by+order_by_list[b] + ","
            }
            order_by = order_by.trim()
            order_by  = order_by.substring(0,order_by.length-1)

        }
        if(  params_obj["refund_address"]!==undefined && params_obj["refund_address"] === "我仓地址"){
             where_sql = where_sql+"  seller_mobile_tb = '18719368068'"
        }else  if(params_obj["refund_address"] === "315地址"){
             where_sql = where_sql+"  seller_mobile_tb like '%020%'"
        }

        if(  params_obj["logistics_status"]!==undefined && params_obj["logistics_status"] === "显示有物流的"){
             if(where_sql===" where"){
                 where_sql =   where_sql+" return_logistics_number != ''  "
             }else{
                where_sql =  where_sql+" and return_logistics_number != ''  "
             }

        }

        if(  params_obj["goods_id"]!==undefined && params_obj["goods_id"] !==""){
             if(where_sql===" where"){
                 where_sql =   where_sql+" goods_id = '"+params_obj["goods_id"]+"'  "
             }else{
                where_sql =  where_sql+" and goods_id = '"+params_obj["goods_id"]+"'  "
             }

        }

         if(  params_obj["color"]!==undefined && params_obj["color"] !==""){
             if(where_sql===" where"){
                 where_sql =   where_sql+" sku_name like '%"+params_obj["color"]+"%'  "
             }else{
                where_sql =  where_sql+" and sku_name like '%"+params_obj["color"]+"%'  "
             }

        }

         if(  params_obj["size"]!==undefined && params_obj["size"] !==""){
             if(where_sql===" where"){
                 where_sql =   where_sql+" sku_name like '%"+params_obj["size"]+"%'  "
             }else{
                where_sql =  where_sql+" and sku_name like '%"+params_obj["size"]+"%' "
             }

        }
    }
    if(where_sql === " where"){

       where_sql=  where_sql.replace(" where",'')

    }
    where_sql = where_sql + " order by   " +order_by

    selectALLSQL = selectALLSQL+where_sql
    console.log("查询sql",selectALLSQL)
    WEBSQL_DB.transaction(function(ctx) {
        ctx.executeSql(selectALLSQL, [], function(ctx, result) {
            console.log('查询成功: ' + tableName + result.rows.length);
            var len = result.rows.length;
            let cm_refund_list_data  = []
            let refund_list_data  = []
            for (var i = 0; i < len; i++) {

                let  db_cur_item = result.rows.item(i)
                let cm_data_item = [db_cur_item.shop_name,db_cur_item.refund_order_id,db_cur_item.goods_name,db_cur_item.goods_code,db_cur_item.sku_name,db_cur_item.sku_code,db_cur_item.goods_counts,db_cur_item.send_logistics_number,db_cur_item.return_logistics_number,"",db_cur_item.logistics_update_time,db_cur_item.order_number,"",db_cur_item.send_logistics_info,db_cur_item.return_logistics_info,db_cur_item.seller_memo,db_cur_item.seller_flag,db_cur_item.seller_phone_tb,db_cur_item.seller_mobile_tb,db_cur_item.seller_wangwang_id_tb,db_cur_item.img_url]
                let refund_item = {
                    "shop_name": db_cur_item.shop_name,
                    "refund_order_id": db_cur_item.refund_order_id,
                    "goods_name": db_cur_item.goods_name,
                    "goods_code": db_cur_item.goods_code,
                    "sku_name": db_cur_item.sku_name,
                    "sku_code": db_cur_item.sku_code,
                    "goods_counts": db_cur_item.goods_counts,
                    "send_logistics_number": db_cur_item.send_logistics_number,
                    "return_logistics_number": db_cur_item.return_logistics_number,
                    "return_logistics_name": db_cur_item.return_logistics_name,
                    "logistics_update_time": db_cur_item.logistics_update_time,
                    "order_number": db_cur_item.order_number,
                    "send_logistics_info": db_cur_item.send_logistics_info,
                    "return_logistics_info": db_cur_item.return_logistics_info,
                    "seller_memo": db_cur_item.seller_memo,
                    "seller_flag": db_cur_item.seller_flag,
                    "seller_phone_tb": db_cur_item.seller_phone_tb,
                    "seller_mobile_tb": db_cur_item.seller_mobile_tb,
                    "seller_wangwang_id_tb": db_cur_item.seller_wangwang_id_tb,
                    "img_url": db_cur_item.img_url,
                }
                cm_refund_list_data.push(cm_data_item)
                refund_list_data.push(refund_item)

            }
            console.log("-------- 我是分割线 -------");
            console.log("cm_refund_list_data",cm_refund_list_data)
            console.log("refund_list_data",refund_list_data)
            if(params_obj["update_page"] ==="备货页面" && params_obj["show_model"]==="统计模式"){
                 apichuammei_save_update_page_data_refund_order(refund_list_data)
            }else if(params_obj["update_page"] ==="备货页面" && params_obj["show_model"]==="列表模式"){
                 let append_elems_str = apichuammei_is_list_model(refund_list_data)
                 $(".data_div17_all_content").remove()
                 $(".data_div17_top").after(append_elems_str)
            }else if(params_obj["update_page"] ==="待发货页面" ){
                apichuanmei_show_refund_goods_log_dailog(refund_list_data, params_obj["click_button"])
            }else if(params_obj["submit_data"] ==="提交售后物流信息" ){
                apichuanmei_submit_logistic(refund_list_data )
            }

        },
        function(tx, error) {
            console.error('查询失败: ' + error.message);
        });
    });

}
/**
 * 获取数据库一个表单里面的部分数据
 * @param tableName:表单名
 * @param name:姓名
 */
 function websqlapi_getOneData(tableName, name) {

    var selectSQL = 'SELECT * FROM ' + tableName + ' WHERE NAME = ?'
    WEBSQL_DB.transaction(function(ctx) {
        ctx.executeSql(selectSQL, [name], function(ctx, result) {
                console.log('查询成功: ' + tableName + result.rows.length);
                var len = result.rows.length;
                for (var i = 0; i < len; i++) {
                    console.log("NAME = " + result.rows.item(i).NAME);
                    console.log("AGE = " + result.rows.item(i).AGE);
                    console.log("HEIGHT = " + result.rows.item(i).HEIGHT);
                    console.log("WEIGTH = " + result.rows.item(i).WEIGTH);
                }
            },
            function(tx, error) {
                console.error('查询失败: ' + error.message);
            });
    });
}
/**
 * 删除表单里的全部数据
 * @param tableName:表单名
 */
 function websqlapi_delete_all_data_from_table(tableName) {
     tableName = "tb_refund_table"
    var deleteTableSQL = 'DELETE FROM ' + tableName;
    localStorage.removeItem(tableName);
    WEBSQL_DB.transaction(function(ctx, result) {
        ctx.executeSql(deleteTableSQL, [], function(ctx, result) {
            console.log("删除表数据成功 " + tableName);
        }, function(tx, error) {
            console.error('删除表数据失败:' + tableName + error.message);
        });
    });
}

 function websqlapi_drop_table(tableName) {

    var deleteTableSQL = 'DROP TABLE  ' + tableName;

    WEBSQL_DB.transaction(function(ctx, result) {
        ctx.executeSql(deleteTableSQL, [], function(ctx, result) {
            console.log("删除表成功 " + tableName);
        }, function(tx, error) {
            console.error('删除表失败:' + tableName + error.message);
        });
    });
}


/**
 * 根据name删除数据
 * @param tableName:表单名
 * @param name:数据的姓名
 */
 function websqlapi_deleteOneDataFromTable(tableName, name) {
    var deleteDataSQL = 'DELETE FROM ' + tableName + ' WHERE NAME = ?';
    localStorage.removeItem(tableName);
    WEBSQL_DB.transaction(function(ctx, result) {
        ctx.executeSql(deleteDataSQL, [name], function(ctx, result) {
            console.log("删除成功 " + tableName + name);
        }, function(tx, error) {
            console.error('删除失败:' + tableName + name + error.message);
        });
    });
}
/**
 * 根据name修改数据
 * @param tableName:表单名
 * @param name:姓名
 * @param age:年龄
 */
 function websqlapi_updateOneData(tableName, name, age) {
    var updateDataSQL = 'UPDATE ' + tableName + ' SET AGE = ? WHERE NAME = ?';
    WEBSQL_DB.transaction(function(ctx, result) {
        ctx.executeSql(updateDataSQL, [age, name], function(ctx, result) {
            console.log("更新成功 " + tableName + name);
        }, function(tx, error) {
            console.error('更新失败:' + tableName + name + error.message);
        });
    });
}