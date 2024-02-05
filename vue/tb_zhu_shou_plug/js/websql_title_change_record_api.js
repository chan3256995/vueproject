// 记录自家店铺标题变化记录 tb_goods_title_update_table


 function websqlapi_init_tb_goods_title_update_table(tableName) {
     tableName = "tb_goods_title_update_table"
    var creatTableSQL = 'CREATE TABLE IF  NOT EXISTS ' + tableName + ' (rowid INTEGER PRIMARY KEY AUTOINCREMENT,goods_id text,img_url text,title text,add_time text,update_time text )';
    WEBSQL_DB.transaction(function(ctx, result) {
        ctx.executeSql(creatTableSQL, [], function(ctx, result) {
            console.log("表创建成功 " + tableName);
            Toast("表创建成功 " + tableName);
        }, function(tx, error) {
            alert('创建表失败:' + tableName + error.message);
        });
    });
}

  function websqlapi_insert_tb_goods_title_update_table_data( all_goods_list) {
    console.log("all_goods_list:",all_goods_list)
     //记录换图片

     let tableName = "tb_goods_title_update_table"
      // 数据库还未存在的数据
      let is_not_exits_goods_list  = []

    WEBSQL_DB.transaction(function(ctx) {

        for(let i=0;i<all_goods_list.length;i++){
            let item_data = all_goods_list[i]
            let cur_time = new Date().getTime()+""
            console.log("cur_time-->",cur_time)
            let item_data_list=[item_data['goods_id'],item_data['goods_pic'],cur_time,item_data['title'],cur_time]
            let insterTableSQL = 'INSERT INTO ' + tableName + ' (goods_id,img_url,add_time,title,update_time) VALUES (?,?,?,?,?)';
            let select_sql = "SELECT * FROM " + tableName + " where  title ='"+item_data['title'] + "' order by add_time DESC";

            console.log("查询sql:",select_sql)
            ctx.executeSql(select_sql, [], function(ctx, result) {
                console.log('查询成功: ' + tableName + result.rows.length);
                let len = result.rows.length;
                let  db_cur_item = null;
                let  new_item = null;
                if(result.rows.length!==0){
                    db_cur_item = result.rows.item(0)

                    let update_item_data_list = [cur_time,db_cur_item.rowid]
                    let   updateDataSQL = 'UPDATE ' + tableName + ' SET update_time = ? WHERE rowid = ?';

                     ctx.executeSql(updateDataSQL, update_item_data_list, function(ctx, result) {
                        console.log(" 更新" + tableName + item_data['title'] + "成功");

                     },
                 function(tx, error) {
                        console.error(' 更新: ' + error.message);
                    });
                }else{
                    ctx.executeSql(insterTableSQL, item_data_list, function(ctx, result) {
                        console.log("插入 " + tableName + item_data['title'] + "成功");

                     },
                 function(tx, error) {
                        console.error('插入 : ' + error.message);
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