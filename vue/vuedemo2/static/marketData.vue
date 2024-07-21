<template>

</template>

<script>
    export default {

          market_name_list : [
              '国投',
              '国大',
              '金富丽',
              '佰润',
              '女人街',
              '大时代',
              '非凡',
              '宝华',
              '新金马',
              '柏美',
              '新潮都',
              '三晟',
              '大西豪',
              '西街',
              '景叶',
              '跨客城',
              '国大金沙',
              '老金马',
              '国泰',
              '拼商城',
              '泓发',
              '大利广场',
              '国润',
              '国马',
              '东金网批',
              '金纱',
              '鸿胜',
              '东街',
              '西街富壹',
              '天福居',
              '轩宾网批',
              ],


        get_goods_list(goods_str,goods_str_format){
          let goods_str_list = this.get_goods_str_list(goods_str);
          let tt = this.ret_goods_list(goods_str_list,goods_str_format)
          return tt
        },

      // 根据商品字符串list  返回商品对象list
       ret_goods_list(goods_str_list,goods_str_format){

             let goods_list = [];
             for(let i=0;i<goods_str_list.length;i++){
               let goods_info = {"shop_market_name":"","shop_floor":"","shop_stalls_no":"","art_no":"","goods_price":"","goods_color":"",'goods_count':""}
               while(goods_str_list[i].search("  ")!== -1){
                 goods_str_list[i] = goods_str_list[i].replace("  "," ");
               }
               goods_str_list[i] = goods_str_list[i].trim()
               goods_str_list[i] = this.replace_stall_char(goods_str_list[i]);

               let goods_pro_list = goods_str_list[i].trim().split(/[@/_,， # .。-]/);

                  goods_info['shop_market_name'] =typeof (goods_pro_list[0]) === "undefined"?"":goods_pro_list[0];
                  goods_info['shop_floor'] = typeof (goods_pro_list[1]) === "undefined"?"":goods_pro_list[1];
                  let stalls_no = goods_pro_list[2];
                  if(typeof (stalls_no) === "undefined"){
                    stalls_no = "";
                  }else{
                    if(stalls_no.search("$")!==-1){
                      stalls_no = stalls_no.replace("$","-")
                    }
                  }
                  goods_info['shop_stalls_no'] = stalls_no;

                   let goods_price = "";
                   let goods_color = "";
                   let goods_count = "";

                   // *********************************************************
                  //  goods_info['art_no'] = typeof (goods_pro_list[3]) === "undefined"?"":goods_pro_list[3];
                  //   //如果价格是非数字字符串 就做特殊处理
                  // if( typeof (goods_pro_list[4])!=='undefined' && isNaN(goods_pro_list[4])) {
                  //   let goods_price_arr = goods_pro_list[4].match(/\d+\.?\d*/g);
                  //
                  //   if(goods_price_arr !==null) {
                  //     goods_price = goods_price_arr[0];
                  //     let price_index = goods_pro_list[4].indexOf(goods_price_arr[0]);
                  //          goods_color = goods_pro_list[4].substring(price_index+goods_price.length,goods_pro_list[4].length);
                  //          console.log("数量---------");
                  //          console.log(goods_pro_list[5])
                  //          if( typeof (goods_pro_list[5])!=='undefined') {
                  //            let goods_count_arr = goods_pro_list[5].match(/\d+\.?\d*/g)
                  //            if (goods_count_arr !== null) {
                  //              goods_count = goods_count_arr[0];
                  //            }
                  //          }
                  //            console.log(goods_count)
                  //   }else{
                  //     goods_price = "";
                  //     }
                  // }else{
                  //   goods_price = goods_pro_list[4];
                  // }
                  // *************************************
                let price_count_art_stall = {}

                  if(goods_str_format === "vvic"){

                     price_count_art_stall= this.ret_art_no_goods_colors_and_price2(goods_pro_list)
                  }else{

                     price_count_art_stall= this.ret_art_no_goods_colors_and_price(goods_pro_list)
                  }

                 goods_price = price_count_art_stall.goods_price
                 goods_info['art_no'] = price_count_art_stall.art_no
                 goods_color = price_count_art_stall.goods_color
                 goods_count = price_count_art_stall.goods_count
                  goods_info['goods_price'] = typeof (goods_price) === "undefined" || parseInt(goods_price)<0 ?"":goods_price;

                  if(goods_color!==""){
                      goods_info['goods_color'] = goods_color;
                  }else{
                    goods_info['goods_color'] = typeof (goods_pro_list[5]) === "undefined"?"":goods_pro_list[5];
                  }

                  if(goods_count.trim() ===""){
                     if( typeof (goods_pro_list[6])!=='undefined' && isNaN(goods_pro_list[6])) {
                         goods_count = goods_pro_list[6].match(/\d+\.?\d*/g);
                    if(goods_count !==null) {
                      goods_count = goods_count[0]
                    }else{
                      goods_count = "";
                      }
                      }else{
                       goods_count = goods_pro_list[6];
                     }

                  }

                  goods_info['goods_count'] = typeof (goods_count) === "undefined" || goods_count ==="" || parseInt(goods_count)< 1 ?"1":goods_count;
                  goods_list.push(goods_info)
            }
            return goods_list;
  },

      ret_art_no_goods_colors_and_price(goods_pro_list){
            let art_no = typeof (goods_pro_list[3]) === "undefined"?"":goods_pro_list[3];
            let goods_color = ""
            let goods_price = ""
            let goods_count = ""
            // goods_info['art_no'] = typeof (goods_pro_list[3]) === "undefined"?"":goods_pro_list[3];
                    //如果价格是非数字字符串 就做特殊处理
                  if( typeof (goods_pro_list[4])!=='undefined' && isNaN(goods_pro_list[4])) {
                    let goods_price_arr = goods_pro_list[4].match(/\d+\.?\d*/g);

                    if(goods_price_arr !==null) {
                      goods_price = goods_price_arr[0];
                      let price_index = goods_pro_list[4].indexOf(goods_price_arr[0]);
                           goods_color = goods_pro_list[4].substring(price_index+goods_price.length,goods_pro_list[4].length);
                           console.log("数量---------");
                           console.log(goods_pro_list[5])
                           if( typeof (goods_pro_list[5])!=='undefined') {
                             let goods_count_arr = goods_pro_list[5].match(/\d+\.?\d*/g)
                             if (goods_count_arr !== null) {
                               goods_count = goods_count_arr[0];
                             }
                           }
                             console.log(goods_count)
                    }else{
                      goods_price = "";
                      }
                  }else{
                    goods_price = goods_pro_list[4];
                  }
            return { "art_no":art_no,"goods_color":goods_color,"goods_price":goods_price,"goods_count":goods_count}
      },

      ret_art_no_goods_colors_and_price2(goods_pro_list){

            let goods_color = ""

            let goods_count = ""
            let goods_price = typeof (goods_pro_list[3]) === "undefined"?"":goods_pro_list[3];
            let art_no = typeof (goods_pro_list[4]) === "undefined"?"":goods_pro_list[4];
            // // goods_info['art_no'] = typeof (goods_pro_list[3]) === "undefined"?"":goods_pro_list[3];
            //         //如果价格是非数字字符串 就做特殊处理
            //       if( typeof (goods_pro_list[4])!=='undefined' && isNaN(goods_pro_list[4])) {
            //         let goods_price_arr = goods_pro_list[4].match(/\d+\.?\d*/g);
            //
            //         if(goods_price_arr !==null) {
            //           goods_price = goods_price_arr[0];
            //           let price_index = goods_pro_list[4].indexOf(goods_price_arr[0]);
            //                goods_color = goods_pro_list[4].substring(price_index+goods_price.length,goods_pro_list[4].length);
            //                console.log("数量---------");
            //                console.log(goods_pro_list[5])
            //                if( typeof (goods_pro_list[5])!=='undefined') {
            //                  let goods_count_arr = goods_pro_list[5].match(/\d+\.?\d*/g)
            //                  if (goods_count_arr !== null) {
            //                    goods_count = goods_count_arr[0];
            //                  }
            //                }
            //                  console.log(goods_count)
            //         }else{
            //           goods_price = "";
            //           }
            //       }else{
            //         goods_price = goods_pro_list[4];
            //       }
            return { "art_no":art_no,"goods_color":goods_color,"goods_price":goods_price,"goods_count":goods_count}
      },

//判断档口号有“-”并且把他处理掉替换成“$”
   replace_stall_char(goods_str){

        let index = goods_str.search("-");
        console.log(index);
        if(index == -1){
          console.log("没有找到横线");
            return goods_str;
        }
        let st = goods_str.substring(index+1,index+2);
        let tindex = st.search(/[a-zA-Z]/);
        if(tindex==-1){
          console.log("横线下一个字符不是字母")
          return goods_str;
        }
        //判断横线后面两位数是不是数字
        let sn = goods_str.substring(index+2,index+4);
     console.log("横线后两位:",sn);
     if(!isNaN(sn) && sn > 9){
          console.log("是两位数字:",goods_str)
          return goods_str;
        }else{
          console.log("不是两位大于零的数字，当口号有符号  -")
           goods_str = goods_str.replace("-","$");
           console.log(goods_str);
           return goods_str;


        }

   },
   get_goods_str_list(goods_str){
    let tem_goods_str = goods_str.trim();
    let goods_str_list = [];

    while(this.isfind_market(tem_goods_str,this.market_name_list,0)!==""){
           let reg = /[-, _/#.，@]{2}/;//括号中的字符出现两个 就匹配出来替换掉
           while(tem_goods_str.match(reg)){
                  let result =  tem_goods_str.match(reg);
                  tem_goods_str = tem_goods_str.replace(result[0],"，")
              }
console.log("-----------------------------------------------------------------------------------")
          // 寻找第一次出现市场明的位置 返回 该位置的市场名 索引 等信息
          let goods_start_info = this.isfind_market(tem_goods_str,this.market_name_list,0);

           // 寻找下一次出现市场明的位置 返回 该位置的市场名 索引 等信息

          let next_goods_info = this.isfind_market(tem_goods_str,this.market_name_list,goods_start_info.market_name.length);


          if(next_goods_info !==""){
             let goods_info = tem_goods_str.substring(0,next_goods_info.index).trim();
             goods_str_list.push(goods_info);
             tem_goods_str = tem_goods_str.substring(next_goods_info.index,tem_goods_str.length).trim()

          }else{

             goods_str_list.push(tem_goods_str);
             tem_goods_str = "";
          }



  }

    return goods_str_list;
  },

   isfind_market(address,market_list,start_index) {

    let tem_str = address.substring(start_index,address.length)

    let  find_start_str = tem_str
     for(let index = 0 ;index<tem_str.length;index++){

        for(let i = 0; i< market_list.length; i++){
          let is_find = find_start_str.startsWith(market_list[i])
          if(is_find){

            return {'index':start_index+index,'market_name':market_list[i]};
          }
    }
        find_start_str = tem_str.substr(index+1,tem_str.length-1)
     }
    //  for(let i = 0; i< market_list.length; i++){
    //   let index = tem_str.search(market_list[i])
    //   if(index !== -1){
    //      console.log("isfind_market_search_index",index,market_list[i],tem_str)
    //     return {'index':start_index+index,'market_name':market_list[i]};
    //   }
    // }
    return "";
  }
  }

</script>

<style scoped>

</style>
