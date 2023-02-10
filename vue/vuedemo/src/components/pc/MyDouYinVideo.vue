<template>
  <div id= 'container_id' class="container">
  <meta name="referrer" content="no-referrer"/>
    <div style="text-align: center">



    </div>
    <div style="padding-left: 5em">
        <!--<input v-model="query_q" style="width: 85%;height: 2em;max-width: 40em; " placeholder="店铺ID，店铺名称"/><button @click='on_shop_query(query_q)' style="margin-left: 0.5em">查询</button><button @click="add_shop()"  style="margin-left: 0.5em">添加店铺</button>-->
        <!--<label>时间选择</label><input @click="calendar_show = !calendar_show" v-model="during_str">-->
    </div>


<div style="margin-left: 3em">
         <input v-model="search_zhubo_remarks" style="width: 5em; height: 2em ; " placeholder="主播备注信息"/>
         <input v-model="search_zhubo_name" style="width: 5em; height: 2em ; " placeholder="主播名"/>
        <label @click="is_order_by_zhubo_click()" :class="{status_select:is_order_by_zhubo_data===true}" >按主播排序</label>
         <select  style="margin-left:0.5em;width: 5em"  v-model="order_by_selected1">
            <option :value="option" v-for="(option,index) in order_by_options1" :key="index">{{option.text}}</option>
         </select>
        <label @click="is_my_fav_click()" :class="{status_select:is_user_fav_zhubo_data===true}" >只显示我关注的</label>
          <select  style="margin-left:0.5em;width: 5em"  v-model="video_publish_time_selected1">
            <option :value="option" v-for="(option,index) in video_publish_time_options1" :key="index">{{option.text}}</option>
         </select>
        <button @click='mul_condition_query()' style="margin-left: 0.5em">条件筛选</button>
        <button @click="all_query()" >全部</button>
        <button @click="clean_douyin_videos()" >清除视频数据</button>
        <input v-model="clean_days" style="width: 5em; height: 2em ; " placeholder="清除多少天前数据"/>
      </div>
    <div  class = "items_ul">
          <div  class="global_background" style=" width:98% ">
            <table   style=" width:98% " >
              <tr>
                <td></td>
                <td>视频</td>
                <td>标题</td>
                <td>抖音名</td>
                <td>抖音id</td>
                <td>收藏</td>
                <td>评论</td>
                <td>分享</td>
                <td>点赞</td>
                <td>采集/发布时间</td>

              </tr>
              <tr style="background: white" v-for="(video,index2) in video_list">

                <td ><input type="checkbox"  ></td>

                <td><video class="video-js vjs-default-skin"   type="video/mp4" style="width: 8em;" v-bind:src="video.video_url"  ></video>
                <td style="width: 10em">{{video.desc}}</td>

                <td>

                    <img v-bind:src="video.dou_yin_zhubo.image_url" style="width: 2.5em;height: 2.5em;display: inline" />
                     <label style="display: block">{{video.dou_yin_zhubo.dou_yin_name}}</label>
                </td>
                 <td>
                    {{video.dou_yin_zhubo.dou_yin_id}}

                </td>



                <td>
                   <label>{{video.collect_count}} </label>
                </td>
                <td>
                   <label   > {{video.comment_count}} </label>
                </td>
                 <td>
                   <label   > {{video.share_count}} </label>
                </td>
                <td>
                   <label   > {{video.digg_count}} </label>
                </td>
                <td>
                   <label style="display: block"  >更新时间：{{video.update_time}}</label>
                   <label style="display: block"  >-------------------------</label>
                   <label   >发布时间：{{video.video_publish_time}}</label>

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
  import mtime from '../../utils/mtime.js';
  import mGlobal from '../../utils/mGlobal';
  import  axios  from 'axios'
  // import videojs from 'video.js'
  // import 'videojs-contrib-hls'
  // import '@videojs/http-streaming'

     //设为ttrue 就会带cookies 访问
    axios.defaults.withCredentials=true;
    export default {
        name: "MyDouYinVideo",
      data(){
          return{
            player : null,
            calendar_show:false,
            defaultDate:[],
            disabledDate:[],
            during_str:"",
            clean_days:20,

            search_zhubo_remarks:"",
            search_zhubo_name:"",
            is_order_by_update_time :false,
            order_by_selected1:{value:"",text:"排序选择"},
            video_publish_time_selected1:{value:"14400000",text:"4小时"},
            video_publish_time_options1 :[
              {value:"",text:"视频发布时间"},
              {value:"14400000",text:"4小时"},
              {value:"43200000",text:"12小时 "},
              {value:"86400000",text:"24小时 "},
              {value:"172800000",text:"48小时 "},

            ],
            order_by_options1:[
              {value:"",text:"排序选择"},
              {value:"-collect_count",text:"收藏"},
              {value:"-share_count",text:"分享 "},
              {value:"-comment_count",text:"评论 "},
              {value:"-digg_count",text:"点赞 "},

            ],
            // 加载数据后是否滚动到顶端
            is_scroll_top:true,
            is_user_fav_zhubo_data:true,
            is_order_by_zhubo_data:true,
            is_order_by_today_sell_num:false,
            prePageShow:true,
            nextPageShow:true,
            video_list:[],
            firstPageUrl:this.mGLOBAL.DJANGO_SERVER_BASE_URL+"/user/userDouYinVideoInfo/",
            prePageUrl:"",
            nextPageUrl:"",
          }
      },

      methods:{
          show_goods_record(id){

            this.$douYinGoodsCollectLogBox.showMsgBox({
                  title: '商品采集记录',
                  isShowInput: false,
                  req_dou_yin_goods_info: {"id":id},
                  isShowConfimrBtn: false,

              }).then(async (val) => {



              }).catch(() => {
                  // ...
              });

          },
          is_my_fav_click(){
            this.is_user_fav_zhubo_data = !this.is_user_fav_zhubo_data
          },
          is_order_by_zhubo_click(){
            this.is_order_by_zhubo_data = !this.is_order_by_zhubo_data
          },

         video_click(){
            console.log("----",this)
         },
          all_query(){

              this.is_user_fav_zhubo_data =false
              let query_data = { "search_condition":{


                 },}
              this.on_shop_query(query_data,"all_btn")

        },
          clean_douyin_videos(){
           let data = {"days":this.clean_days}
            const user_url = mGlobal.DJANGO_SERVER_BASE_URL+"/user/cleanDouVideosView/"
            axios.post(user_url,data).then((res)=>{
              console.log("res--->",res)
              if(res.data.code ==="1000"){

              }
            }).catch(error=>{
                console.log("请求错误")
            })


        },
          mul_condition_query(){
            let search_conditions  = {}
            let order_list  = []
              if(this.is_order_by_zhubo_data === true){
                order_list.push("-dou_yin_zhubo")
              }
              if(this.order_by_selected1.text !== "排序选择"){
                order_list.push(this.order_by_selected1.value)
              }
              if(this.video_publish_time_selected1.text !== "视频发布时间"){
                let publish_time = new Date().getTime() -  this.video_publish_time_selected1.value
                search_conditions["search_video_publish_time"] = publish_time
              }
              search_conditions["is_user_fav_zhubo_data"]=this.is_user_fav_zhubo_data,
              search_conditions["order_by_list"]=order_list,
              search_conditions["search_zhubo_remarks"]=this.search_zhubo_remarks
              search_conditions["search_zhubo_name"]=this.search_zhubo_name
              let query_data = { "search_condition":search_conditions,}



              this.on_shop_query(query_data,"search_condition_btn")

        },
           return_format_time(stmp){
            if (stmp === 0){
               return ""
            }
            return mtime.formatDateStrFromTimeSt(stmp)
          },






          on_goods_query(query_data,btn_tag){
            const url = this.mGLOBAL.DJANGO_SERVER_BASE_URL+"/user/userDouYinVideoInfo/"

            //
            // if(this.during_str!==""){
            //   Object.assign(query_data,{"during_time":this.during_str})
            // }

            this.loadOrderPage(url,query_data,btn_tag)
          },

           on_shop_query(query_data,btn){

             console.log(query_data)
            const url = this.mGLOBAL.DJANGO_SERVER_BASE_URL+"/user/userDouYinVideoInfo/";

            this.loadOrderPage(url,query_data)
          },

        //刷新当前页面
        refresh_cur_page(){
              let cur_page_url = "";
              let cur_page_num ;

              this.is_scroll_top = false;
              console.log("this.nextPageUrl",this.nextPageUrl)
            if(this.nextPageUrl !== null && this.nextPageUrl !==""){
              let next_page_num_arr= this.nextPageUrl.match(/page=\d+/);
              let next_page_num = next_page_num_arr[0].split("=")[1]
              let base_url = this.nextPageUrl.substring(0,next_page_num_arr.index);
              let cur_page_num = parseInt(next_page_num)-1;
              cur_page_url = base_url+"page="+cur_page_num;

            }else if(this.prePageUrl !== null && this.prePageUrl !==""){
               let pre_page_num_arr= this.prePageUrl.match(/page=\d+/);
               let pre_page_num = pre_page_num_arr[0].split("=")[1];
               let base_url = this.prePageUrl.substring(0,pre_page_num_arr.index);
               let  cur_page_num = parseInt(pre_page_num)-1;
               cur_page_url = base_url+"page="+cur_page_num;
            }else{
                cur_page_url = this.mGLOBAL.DJANGO_SERVER_BASE_URL+"/user/userDouYinVideoInfo/";
            }

            let query_data =""


             this.loadOrderPage(cur_page_url,query_data);
        },



          replaceData() {
            for(let i = 0;i<this.video_list.length;i++){
               let item =  this.video_list[i];
               let  mdate = mtime.formatDateStrFromTimeSt(item.add_time);
               let  update_time = mtime.formatDateStrFromTimeSt(item.update_time);
               let  video_publish_time = mtime.formatDateStrFromTimeSt( item.video_publish_time);

               mdate = mdate.substring(5,16)
               update_time = update_time.substring(5,16)
               video_publish_time = video_publish_time.substring(5,16)
              console.log(mdate)
              item.add_time =mdate;
              item.update_time =update_time;
              item.video_publish_time =video_publish_time;



              item['is_selected'] = false


            }
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
          this.video_list = res.data.results;
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
           //  this.player = videojs('cameraMonitoringVideo',{
           //   bigPlayButton:true,
           //   textTrakDisplay:false,
           //   errorDisplay:false,
           //   controlBar:true,
           //
           // },function () {
           //   this.play()
           // })
          // const url = this.mGLOBAL.DJANGO_SERVER_BASE_URL+"/user/userDouYinVideoInfo/"
          // this.loadOrderPage(url);
          this.mul_condition_query()




      },
      mount(){

      },
      beforeDestroy(){
          if(this.player != null){
            this.player.dispose()
          }
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
 .status_select{
    background: #f0f0f0 ;
    color: #3bb4f2;
    border:gainsboro solid 1px;
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
