// 记录竞争淘宝店铺新商品数据


/**
 * 新建数据库里面的表单
 * @param tableName:表单名
 */
 function websqlapi_init_tb_goods_update_table(tableName) {
     tableName = "tb_goods_update_table"
    var creatTableSQL = 'CREATE TABLE IF  NOT EXISTS ' + tableName + ' (rowid INTEGER PRIMARY KEY AUTOINCREMENT,goods_id text,img_url text,add_time text)';
    WEBSQL_DB.transaction(function(ctx, result) {
        ctx.executeSql(creatTableSQL, [], function(ctx, result) {
            alert("表创建成功 " + tableName);
        }, function(tx, error) {
            alert('创建表失败:' + tableName + error.message);
        });
    });
}


  function websqlapi_insert_tb_goods_update_data( goods_list) {
     let tableName = "tb_goods_update_table"
      // 数据库还未存在的数据
      let is_not_exits_goods_list  = []

    WEBSQL_DB.transaction(function(ctx) {

        for(let i=0;i<goods_list.length;i++){
            let item_data = goods_list[i]
            let cur_time = new Date().getTime()+""
            console.log("cur_time-->",cur_time)
            let item_data_list=[item_data['goods_id'],item_data['image'],cur_time]
            let insterTableSQL = 'INSERT INTO ' + tableName + ' (goods_id,img_url,add_time) VALUES (?,?,?)';
            let select_sql = 'SELECT * FROM ' + tableName + ' where goods_id ='+item_data['goods_id'] + ' order by add_time DESC';
            console.log("查询sql:",select_sql)
            ctx.executeSql(select_sql, [], function(ctx, result) {
                console.log('查询成功: ' + tableName + result.rows.length);
                let len = result.rows.length;
                let  db_cur_item = null;
                let  new_item = null;
                if(result.rows.length!==0){
                    db_cur_item = result.rows.item(0)
                    console.log(db_cur_item.img_url)
                    console.log(db_cur_item.add_time)
                    // new_item = {
                    //     "goods_id": db_cur_item.goods_id,
                    //     "img_url": db_cur_item.img_url,
                    // }
                }

                if(db_cur_item === null || ((db_cur_item.img_url !== item_data['image'])) ){
                    //不存在的图片才插入
                     ctx.executeSql(insterTableSQL, item_data_list, function(ctx, result) {
                        console.log("插入" + tableName + item_data['goods_id'] + "成功");
                        let return_obj = {}
                         let image_url = item_data['image']
                         return_obj[image_url] = item_data
                         console.log("return_obj-------->",return_obj)
                         update_pc_shop_page_data_old_version(return_obj)
                    },
                     function(tx, error) {
                        console.error('插入失败: ' + error.message);
                      });
                }


        },
        function(tx, error) {
            console.error('查询失败: ' + error.message);
        });


        }

        console.log("is_not_exits_goods_lis",is_not_exits_goods_list)

    });
}


function websqlapi_query_tb_goods_update_data(goods_list,params_obj) {

    console.log("params_obj",params_obj)
    console.log("goods_list",goods_list)
    let return_list_data  = []
    let tableName = "tb_goods_update_table"
    let where_sql = " where"
    var selectALLSQL = 'SELECT * FROM ' + tableName;
    if(goods_list!==undefined){

         where_sql = where_sql+"  goods_id in ( "
        for(let g=0;g<goods_list.length;g++){
            where_sql = where_sql + goods_list[g]["goods_id"] +","
        }
        where_sql = where_sql.substring(0,where_sql.length-1)
        where_sql  = where_sql+" )"

    }
    if(where_sql === " where"){
       where_sql=  where_sql.replace(" where",'')
    }

    selectALLSQL = selectALLSQL+where_sql
    // selectALLSQL = "SELECT * FROM tb_goods_update_table where  goods_id in ( 753780745463,753647368426 )"
    console.log("查询sql",selectALLSQL)
    WEBSQL_DB.transaction(function(ctx) {
        ctx.executeSql(selectALLSQL, [], function(ctx, result) {
            console.log('查询成功: ' + tableName + result.rows.length);
            var len = result.rows.length;
            let cm_refund_list_data  = []

            for (var i = 0; i < len; i++) {

                let  db_cur_item = result.rows.item(i)

                let sql_item = {

                    "goods_id": db_cur_item.goods_id,
                    "img_url": db_cur_item.img_url,
                }

                return_list_data.push(sql_item)

            }
            console.log("-------- 我是分割线 -------");

            console.log("return_list_data",return_list_data)

        },
        function(tx, error) {
            console.error('查询失败: ' + error.message);
        });
    });


}