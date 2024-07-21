import mGlobal from '/pGlobal';
import  axios  from 'axios'
export default {
 // 解析物流数据
analysis_logistics(data){
  let logistics_list = []
  for(let i = 0;i<data.length;i++){
    let item = {}
    item["logistics_name"] = data[i].logistics_name
    item["logistics_price"] = data[i].logistics_price
    logistics_list.push(item)
  }
  return logistics_list
},

   // 加载用户信息
 load_user(){
            const url = mGlobal.DJANGO_SERVER_BASE_URL+"/user/details/-1/"
            return axios.get(url)
          },
  
  
  
}


