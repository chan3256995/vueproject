
 // let user_name = "root"
 // let password = "a123a123a"
 // let base_url = "http://39.96.69.115:8089"


function websqlapi_open_db(){
    var db = openDatabase('mydb', '1.0', 'TMYDB', 5 * 1024 * 1024);
    if(db){
        console.log("websql 数据库创建/打开成功!");
    }else {
        console.log("websql 数据库创建/打开失败!");
    }
     window.WEBSQL_DB = db;
     // return db
}


function  websqlapi_init_tb_refund_table(){



    window.WEBSQL_DB.transaction(function (tx) {
    // tx.executeSql('CREATE TABLE IF NOT EXISTS TB_REFUND_ORDER (tb_ordre_number unique, shop_name,refund_order_number,goods_name,goods_code,goods_sku,goods_code,goods_counts,send_logistics_number,return_logistics_number,update_time,refund_rmb,send_logistics_info,return_logistics_info,seller_remarks,seller_flag,return_address,seller_phone)');
    tx.executeSql('CREATE TABLE IF NOT EXISTS TB_REFUND_ORDER2 (tb_ordre_number unique, shop_name)');


});
}
function websqlapi_insert_tb_refund_order_data(chuammei_refund_data){
        websqlapi_open_db()
    websqlapi_init_tb_refund_table()
         console.log("websqlapi_init_tb_refund_tablechuammei_refund_data",chuammei_refund_data)
        window.WEBSQL_DB.transaction(function (tx,result) {
            console.log("websqlapi_insert_tb_refund_order_data transaction" )
        let insert_sql = 'INSERT INTO TB_REFUND_ORDER2 (tb_ordre_number,shop_name) VALUES ("778587851", "moonlight539")'
            // console.log("插入数据结果：", result)
        tx.executeSql(insert_sql)
            websqlapi_query_tb_refund_order_data()
        // tx.executeSql('INSERT INTO TB_REFUND_ORDER ( tb_ordre_number,shop_name) VALUES ("666666", "moonlight539")');
});
}

function websqlapi_query_tb_refund_order_data(){

     window.WEBSQL_DB.transaction(function (tx) {
   //   tx.executeSql('SELECT * FROM TB_REFUND_ORDER2', [], function (tx, results) {
   //    let len = results.rows.length, i;
   //
   //
   //    for (i = 0; i < len; i++){
   //       console.log(results.rows.item(i).tb_ordre_number );
   //    }
   //
   // }, null);
});
}
function websqlapi_delete_all_data_from_table(tableName) {

    var deleteTableSQL = 'DELETE FROM ' + tableName;
    localStorage.removeItem(tableName);
    window.WEBSQL_DB.transaction(function(ctx, result) {
        ctx.executeSql(deleteTableSQL, [], function(ctx, result) {
            console.log("删除表成功 " + tableName);
        }, function(tx, error) {
            console.error('删除表失败:' + tableName + error.message);
        });
    });
}



