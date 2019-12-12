<template>
 <div style="padding-bottom: 5em">
   <div class  = "main-content"><keep-alive><router-view></router-view></keep-alive></div>
    <div class="footer">
      <div class="module-nav">
        <div class="nav-i">
          <div class="iconfont icon">&#xe610;</div>
           <router-link   to = "/home" >首页</router-link>
        </div>
        <div class="nav-i">
          <div class="iconfont icon">&#xe629;</div>
          <router-link   to = "/find" >发现</router-link>
        </div>
        <div class="nav-i">
          <div class="iconfont icon">&#xe84f;</div>
        </div>
        <div class="nav-i">
          <div class="iconfont icon">&#xe62c;</div>
           <router-link   to = "/output" >导出</router-link>
        </div>
        <div class="nav-i">
          <div class="iconfont icon">&#xe601;</div>
           <router-link   to = "/my" >我的</router-link>
        <div>
      </div>
    </div>
  </div>
    </div>
   </div>
</template>

<script type='text/ecmascript-6'>
let scan = null;
export default {
  name: 'HelloWorld',
  data() {
    return {
      codeUrl2: "",
      codeUrl: "",
    };
  },
  mounted() {

  },
  methods: {

  }
};
</script>
<style >
.footer{
    position: fixed;
  bottom:  0;
  z-index:  999;
  max-width:  1080px;
  width:  100%;
  border-top:  1px solid #C0C0C0;
  background: white;
}

  .module-nav{
    display :flex;
    justify-content :space-around;
  }

    .nav-i{
       width :40px;
      text-align :center;
    }

      /*.icon{*/
         /*font-size :25px;*/
          /*padding :5px 0;*/
      /*}*/

      .icon-add{
        font-size :60px
      }

      h3{
        font-size :15px;
        font-weight :normal;
        margin :0;
        padding-bottom :5px;
      }

</style>

