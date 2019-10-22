<template>
  <div id="app">
    <!--<img src="./assets/logo.png">-->

    <router-view></router-view>
  </div>
</template>

<script>
import Home from './components/Home.vue'

import  axios  from 'axios'
     //设为true 就会带cookies 访问
    axios.defaults.withCredentials=true;

export default {
  name: 'App',
  components: {
    Home
  },

  //App.vue
  mounted() {

    if (this._isMobile()) {


    } else {
      // let cur_path= this.$route.path;
      // if(cur_path.substring(0, 3) !== "/pc"){
      //    this.$router.replace('/pc'+cur_path);
      // }


    }
  },
  methods:{
    _isMobile:function() {
	 let flag = navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i)
	 return flag;
}
  }
//App.vue


}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;

  margin: 0 auto;
  width: 100%;
  min-width: 40em;
}
</style>
