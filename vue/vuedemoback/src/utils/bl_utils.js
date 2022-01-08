import mGlobal from '../utils/mGlobal';
import  axios  from 'axios'
export default {

get_order_info_bl(order_info){
                   let order_list = []
                   order_list.push(order_info)

                   let url = mGlobal.DJANGO_SERVER_BASE_URL+"/back/bl_get_order_info/";
                   //设为true 就会带cookies 访问
                  axios.defaults.withCredentials=true;

                  axios.post(url,{"order_list":JSON.stringify(order_list)}).then((res)=>{
                   if(res.data.code === "1000"){

                     let return_order_list = res.data.order_info_list
                     if(return_order_list.length === 0){
                       alert("未从bl查到相关信息")
                       return
                     }
                     let cur_order  = return_order_list[0]
                     let str = ""
                     str = str +"订单："+cur_order['order_number']+'\n'
                     str = str +"订单状态："+cur_order['order_status']+'\n'
                      str = str +"----------------"+'\n'
                     let order_goods_list = cur_order['order_goods_list']
                     console.log("order_goods_list:  ",order_goods_list)
                     for(let i = 0;i<order_goods_list.length;i++){

                       str = str +"商品："+i+'\n'
                       str = str +"商品状态："+order_goods_list[i]['status']+'\n'
                       str = str +"商品价格： "+order_goods_list[i]["goods_price"] + " x" +order_goods_list[i]["goods_count"]+'\n'
                       str = str +"备注： "+order_goods_list[i]["mark"]+'\n'
                       str = str +"------------------"+'\n'
                     }
                     alert(str)

                   }else{
                      alert("提交失败")
                   }
              }).catch(error => {
                  console.log(error)
                   alert("提交失败")
              })
            },

 get_account_record_by_order_number_bl(order_number){


                   let url = mGlobal.DJANGO_SERVER_BASE_URL+"/back/bl_get_account_record_by_order_number/";
                   //设为true 就会带cookies 访问
                  axios.defaults.withCredentials=true;

                  axios.post(url,{"order_number":order_number}).then((res)=>{
                   if(res.data.code === "1000"){

                     let return_accout_record_list = res.data.accout_record_list
                     if(return_accout_record_list.length === 0){
                       alert("未从bl查到相关信息")
                       return
                     }

                     let str = ""

                      str = str +"----------------"+'\n'

                     for(let i = 0;i<return_accout_record_list.length;i++){
                       str = str +return_accout_record_list[i]['operater']+'/'+ return_accout_record_list[i]['type']+'/'+ return_accout_record_list[i]['money']+'/'+ return_accout_record_list[i]['remain_money']+'/'+ return_accout_record_list[i]['order_number']+'/'+ return_accout_record_list[i]['mark']+'/'+ return_accout_record_list[i]['add_time']
                       str = str +'\n'+"------------------"+'\n'
                     }
                     alert(str)

                   }else{
                      alert("提交失败")
                   }
              }).catch(error => {
                  console.log(error)
                   alert("提交失败")
              })
            },
}
