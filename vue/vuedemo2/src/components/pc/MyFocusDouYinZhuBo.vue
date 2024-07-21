<template>
  <div id= 'container_id' class="container">

    <div style="text-align: center">



    </div>
    <div style="padding-left: 5em">
        <input v-model="query_q" style="width: 85%;height: 2em;max-width: 40em; " placeholder="店铺ID，店铺名称"/><button @click='on_shop_query(query_q)' style="margin-left: 0.5em">查询</button><button @click="add_zhubo()"  style="margin-left: 0.5em">添加主播</button>

      <button @click='on_query({"no_new_goods_shop":10})' style="margin-left: 0.5em">显示10天无新品店铺</button>
    </div>

    <div style="padding-left: 1em;margin-top: 1em;margin-bottom:0.2em">
      <button @click="select_all(is_all_selected)">全选</button>
      <button @click="go_to_collect()">选中的进行数据采集</button>

    </div>

    <div  class = "items_ul">


          <div  class="global_background" style=" width:98% ">


            <table   style=" width:98% " >

              <tr>
                <td></td>
                <td></td>
                <td>主播头像</td>
                <td>监控地址</td>
                <td>抖音名</td>

                <td>主播抖音id</td>

                <td>备注</td>
                <td>更新时间</td>
              </tr>
              <tr style="background: white" v-for="(fav_zhu_bo,index2) in zhubo_list">

                <td ><input type="checkbox" v-model="fav_zhu_bo.is_selected" ></td>
                 <td style="width: 5em"><button @click="delete_zhu_bo({'id_list':[fav_zhu_bo.dou_yin_zhubo.id]})" style="width: 4em;padding-left: 0;padding-right: 0px">删除</button> <button @click="alter_zhubo(fav_zhu_bo.dou_yin_zhubo)" style="width: 6em;margin-top:0.2em;display: inline">确定修改</button></td>
                <td><img @click="img_click(fav_zhu_bo.dou_yin_zhubo.sec_user_id)" v-bind:src="fav_zhu_bo.dou_yin_zhubo.image_url"style="width: 3em;height: 3em"/> <input style="width: 5em" v-model="fav_zhu_bo.dou_yin_zhubo.image_url" placeholder="图片地址"></td>
                <td>
                  <input  v-model="fav_zhu_bo.dou_yin_zhubo.monitor_url" placeholder="监控地址">
                </td>
                <td>
                  <input  v-model="fav_zhu_bo.dou_yin_zhubo.dou_yin_name" placeholder="主播名">
                </td>

                <td>
                  <label>{{fav_zhu_bo.dou_yin_zhubo.dou_yin_id}}</label>
                </td>


                <td>
                   <input  v-model="fav_zhu_bo.remarks" placeholder="备注">
                  <button @click="alert_fav_info({'remarks':fav_zhu_bo.remarks,'id':fav_zhu_bo.id})">修改备注</button>
                </td>
                <td>

                  <label style="display: block">更新时间：{{fav_zhu_bo.dou_yin_zhubo.update_time}}</label>
                  <label style="display: block">----------------------</label>
                  <label style="display: block">添加时间：{{fav_zhu_bo.dou_yin_zhubo.add_time}}</label>
                </td>



                <td>
                  <div style="border: grey solid 1px;margin-bottom: 2px"><label style="float: left">锁定监控</label><input type="checkbox"  v-model="fav_zhu_bo.dou_yin_zhubo.is_monitor" ></div>

                </td>


              </tr>
            </table>


          </div>



    </div>
    <table class="page_table">
      <tr>
        <td style=" cursor:pointer;"><a @click="firstPage">首页</a></td>
        <td style=" cursor:pointer;" v-if="prePageShow"><a  @click="prePage" style="">上一页</a></td>
        <td  style=" cursor:pointer;" v-if="nextPageShow"><a @click="nextPage">下一页</a></td>

      </tr>
    </table>
</div>
</template>

<script>
  import mcommon_function from '../../utils/mcommon_function';
  import mtime from '../../utils/mtime.js';
  import mGlobal from '../../utils/mGlobal';
  import  axios  from 'axios'

     //设为ttrue 就会带cookies 访问
    axios.defaults.withCredentials=true;
    export default {
      // 复用模块组件
    mixins:[mcommon_function],
        name: "MyDouYinZhuBo",
      data(){
          return{
            sell_num:"",
            shop_name:"",
            calendar_show:false,
            defaultDate:[],
            disabledDate:[],
            during_str:"",

            is_all_selected :true,
            is_order_by_update_time :false,
            // 加载数据后是否滚动到顶端
            is_scroll_top:true,
            query_q:"",
            prePageShow:true,
            nextPageShow:true,
            zhubo_list:[],
            firstPageUrl:this.mGLOBAL.DJANGO_SERVER_BASE_URL+"/user/userFavDouYinZhuBoInfo/",
            prePageUrl:"",
            nextPageUrl:"",
            curPageUrl:"",
          }
      },

      methods:{

        img_click(sec_user_id){
          // https://www.douyin.com/user/MS4wLjABAAAABaMFSbUEbA422Nzz2VaAV_MTaHUckUMpoHKP1r5DvWgIclYJwdHzc9W02jeJMmdx
          let url = "https://www.douyin.com/user/"+sec_user_id
          window.open(url)
        },

        go_to_collect(){
          let is_selected_shop_list = []

          let collect_target_list = []
          for(let i = 0;i< this.zhubo_list.length;i++){
              if(this.zhubo_list[i]["is_selected"] === true){
                 let collect_target_obj = {}
                is_selected_shop_list.push(this.zhubo_list[i])
                collect_target_obj['collect_url'] = this.zhubo_list[i]['dou_yin_zhubo']['monitor_url']
                let params = this.mcommon_return_url_params(collect_target_obj['collect_url'])
                 collect_target_obj['params'] =params

                 collect_target_obj['headers'] ={"User-Agent": "com.ss.android.ugc.aweme/200301 (Linux; U; Android 6.0.1; zh_CN; MI 5s; Build/V417IR;tt-ok/3.10.0.2)"}
                collect_target_list.push(collect_target_obj)
              }
            }
            console.log("collect_target_list:",collect_target_list)

                 let url = this.mGLOBAL.DJANGO_SERVER_BASE_URL+"/user/collectDouYinVideoData/";

                 let post_data = {"target_list":collect_target_list}

                axios.post(url,post_data,{timeout:100000}).then((res)=>{
                 if(res.data.code === "1000"){
                   alert("采集完成le ")
                    this.refresh_cur_page();
                 }else if(res.data.code === "1001"){
                    alert("采集失败")
                 }
            }).catch(error => {
                 alert("访问错误")
            })
        },
        select_all(is_selected){
            console.log("zhubo_list",this.zhubo_list)

             for(let i = 0;i< this.zhubo_list.length;i++){

              this.$delete(this.zhubo_list[i], 'is_selected');
              this.$set(this.zhubo_list[i], 'is_selected', is_selected);


            }
            this.is_all_selected = !is_selected;


        },
        //修改收藏备注
        alert_fav_info(fav_info){
          if(!confirm("确定修改吗？")) {
                return ;
              }

              const url = this.mGLOBAL.DJANGO_SERVER_BASE_URL+"/user/userDouYinFavZhuBoInfoEdit/";
              let post_goods = {
     	          "user_dou_yin_fav_zhubo_data":{
     	   	      "id":fav_info.id,

                "remarks": fav_info.remarks,

     	          }
     }
               axios.post(url,post_goods).then((res)=>{
              if(res.data.code ==="1000"){
                console.log(res.data)
                this.$toast("提交成功！")
                 this.refresh_cur_page();
              }else{
                this.$toast("修改失败！"+res.data.message)
                this.refresh_cur_page();
              }

            }).catch(error=>{
                console.log("提交失败")
                this.$toast("请求错误")
            })

        },
          // 修改商品信息
        alter_zhubo(zhubo){
              if(!confirm("确定修改吗？")) {
                return ;
              }
              const url = this.mGLOBAL.DJANGO_SERVER_BASE_URL+"/user/useDouYinZhuBoEdit/";
              let post_goods = {
     	          "user_dou_yin_zhubo_data":{
     	   	      "id":zhubo.id,
     	   	      "monitor_url":zhubo.monitor_url,
     	   	      "dou_yin_id":zhubo.dou_yin_id,
     	   	      "sec_user_id": zhubo.sec_user_id,
     	   	      "image_url": zhubo.image_url,
                "dou_yin_name":  zhubo.dou_yin_name,
                "remarks": zhubo.remarks,
                "is_monitor": zhubo.is_monitor,
     	          }
     }
               axios.post(url,post_goods).then((res)=>{
              if(res.data.code ==="1000"){
                console.log(res.data)
                this.$toast("提交成功！")
                 this.refresh_cur_page();
              }else{
                this.$toast("修改失败！"+res.data.message)
                this.refresh_cur_page();
              }

            }).catch(error=>{
                console.log("提交失败")
                this.$toast("请求错误")
            })
      },
        replaceData() {
            for(let i = 0;i<this.zhubo_list.length;i++){
               let item =  this.zhubo_list[i];
               let update_time = mtime.formatDateStrFromTimeSt(item.dou_yin_zhubo.update_time);
               let  mdate = mtime.formatDateStrFromTimeSt(item.add_time);



              item.dou_yin_zhubo.update_time =update_time;
              item.dou_yin_zhubo.add_time =mdate;


              item['is_selected'] = false

            }
          },
        on_orders_query(query_data,btn_tag){
            const url = this.mGLOBAL.DJANGO_SERVER_BASE_URL+"/user/userDouYinShopDelete/"

            if(this.during_str!==""){
              Object.assign(query_data,{"during_time":this.during_str})
            }

            this.loadOrderPage(url,query_data,btn_tag)
          },

          // 添加商品
        add_zhubo(){
            this.$myDouYinZhuboBox2.showMsgBox({
                  title: '添加主播',
                  isShowInput: false,

              }).then(async (val) => {
                   if(val === "confirm"){
                     this.refresh_cur_page();
                   }


              }).catch(() => {
                  // ...
              });
          },
                  // 删除订单(
        delete_zhu_bo(zhubo_id_list){
                  if(!confirm("确定删除吗？删除后不可恢复。")) {
                    return ;
                  }
                const url = this.mGLOBAL.DJANGO_SERVER_BASE_URL+"/user/userDouYinZhuBoDelete/";
                axios.post(url,zhubo_id_list).then((res)=>{
                 if(res.data.code === "1000"){
                   alert("删除成功")

                    this.refresh_cur_page();
                 }else if(res.data.code === "1001"){
                    alert("删除失败")
                 }
            }).catch(error => {
                 alert("访问错误")
            })
          },




          on_query(query_data){


            const url = this.mGLOBAL.DJANGO_SERVER_BASE_URL+"/user/userFavDouYinZhuBoInfo/";

            this.loadOrderPage(url,query_data)
          },
        on_shop_query(query_keys){

             console.log(query_keys)
            const url = this.mGLOBAL.DJANGO_SERVER_BASE_URL+"/user/userFavDouYinZhuBoInfo/";
            let query_data = null
            if(query_keys.trim()!==""){
              query_data = {"keys":query_keys.trim()};
            }

            this.loadOrderPage(url,query_data)
          },

        //刷新当前页面
      refresh_cur_page(){
            let cur_page_url = "";
            let cur_page_num ;
            let url_params = {}
             let base_url = this.mGLOBAL.DJANGO_SERVER_BASE_URL+"/user/userFavDouYinZhuBoInfo/";
            this.is_scroll_top = false;
              console.log("this.nextPageUrl",this.nextPageUrl)
            if(this.nextPageUrl !== null && this.nextPageUrl !==""){

              base_url = this.nextPageUrl.substring(0,this.nextPageUrl.indexOf("?"));
              url_params = this.mcommon_return_url_params(this.nextPageUrl)
              if(url_params["page"]===undefined){
                url_params["page"] = 1
              }
              url_params["page"] = parseInt(url_params["page"])-1;

            }else if(this.prePageUrl !== null && this.prePageUrl !==""){

              base_url = this.prePageUrl.substring(0,this.prePageUrl.indexOf("?"));
               url_params = this.mcommon_return_url_params(this.prePageUrl)
              console.log("上一页 一页获取的参数： ",url_params)
              if(url_params["page"]===undefined){
                url_params["page"] = 1
              }
              url_params["page"] = parseInt(url_params["page"])+1;
            }



             cur_page_url = base_url+"?"
            for(let key in url_params){
              cur_page_url = cur_page_url+key+"="+url_params[key]+"&"
            }
            cur_page_url = cur_page_url.substring(0,cur_page_url.length-1)
             this.loadOrderPage(cur_page_url);
        },




          prePage(){
            this.is_scroll_top = true
            console.log(this.prePageUrl)
            this.loadOrderPage(this.prePageUrl)
          },

          nextPage(){
            this.is_scroll_top = true
            console.log(this.nextPageUrl)
            this.loadOrderPage(this.nextPageUrl)
          },

          firstPage(){
            this.is_scroll_top = true
            if(this.firstPageUrl!==""){
              this.loadOrderPage(this.firstPageUrl)
            }

          },
        loadOrderPage(url,query_data){

           axios.defaults.withCredentials=true;
           this.$axios.get(url,{
              params:query_data,
          }
        ).then((res)=>{
          console.log(res.data)
          this.zhubo_list = res.data.results;
          this.replaceData()
          if(this.is_scroll_top){
            window.scrollTo(0,0);
          }

          // this.replaceData()


          if(res.data.previous == null){
            this.prePageShow = false;
          }else{
              this.prePageShow = true;
          }
           this.prePageUrl = res.data.previous;

          if(res.data.next == null){
            this.nextPageShow = false;
          }else{
            this.nextPageShow = true;
          }
           this.nextPageUrl = res.data.next;

        }).catch(error => {
          this.$toast("加载错误哦")
          console.log(error) ;
        })
        },



      },
      watch:{

      },
      created(){

          const url = this.mGLOBAL.DJANGO_SERVER_BASE_URL+"/user/userFavDouYinZhuBoInfo/"
          this.loadOrderPage(url);



      },
      mount(){

      }
    }
</script>

<style scoped>

  @import "../../../static/css/PGLOBALCSS.css";

  .status_ul{
      display: block;
      height: 1.5em;
  }
  .status_select{
    background: #f0f0f0 ;
    color: #3bb4f2;
    border:gainsboro solid 1px;
  }
  .status_ul li{
    list-style: none;
    float: left;
  }
   .status_ul a{
     list-style: none;
     padding: 0.3em;
     cursor: pointer;
  }
  .red_color{
    color: red;
  }
  .item_order{
    margin-top: 3em;
    padding-bottom: 0.5em;
    border-top:1px solid gray;
  }
  .items_ul{
    padding-top: 0px;
    margin-top: 0px;
  }
.items_ul li{
  list-style: none;
}
  .container{
    width: 100%;
    height: 1000px;
    margin: 0 auto;
    text-align: left;

  }
  .page_table{
    margin: 0 auto;
    float: bottom;
    font-size: 2em;
  }

  .order_div {
    width: 100%;
    padding-top: 0.5em;
    padding-bottom: 0.5em;
    color: #000;
  }
  /*.item_goods label{*/
    /*display: block; padding-bottom: 0.4em*/
  /*}*/



  .order_div label{
  text-align: left;
    padding-left: 0.5em;
  display: inline-block;

}

  .refund_apply_btn{
    cursor:pointer;
    width: 4em;
    height: 2em;
    margin-top: 2px;
    margin-bottom: 2px;

    color: #fff;
   padding: 0.2em;
    font-size: 1.0em;
    border-radius: 4px;
  background: #3bb4f2;
  border-color: #3bb4f2;
  }

</style>
