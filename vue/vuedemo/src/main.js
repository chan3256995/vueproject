 // The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
 import router from './router'
 import '../config/axios'
import m_global from './utils/mGlobal'
 import "babel-polyfill" //这个插件是用来把es6语法转为es5  为了兼容ie等问题
 Vue.prototype.mGLOBAL = m_global
 Vue.config.devtools = true
import MessageBox from './utils/messagebox/messagbox';
Vue.use(MessageBox);
import MessageBox2 from './utils/qrbox/qrbox';
Vue.use(MessageBox2);

import Axios from 'axios'
Vue.prototype.$axios = Axios

Axios.defaults.headers.get['Content-Type'] = 'application/json';
Axios.defaults.withCredentials = true
// Axios.defaults.headers.common['token'] = "6666"

 import NProgress from 'nprogress' // 进度条
import 'nprogress/nprogress.css' //这个样式必须引入
Vue.prototype.$nprogress = NProgress

 //使用vue-cookies
 import VueCookies from 'vue-cookies'
 Vue.use(VueCookies)
 Vue.prototype.$cookies2 = VueCookies

import toastRegistry from './utils/toast/index'
// 这里也可以直接执行 toastRegistry()
Vue.use(toastRegistry)

 //页面滚动
 import VueScroller from 'vue-scroller'
Vue.use(VueScroller)
  Vue.prototype.$scroller = VueScroller


/* eslint-disable no-new */
 Vue.prototype.setLocalValue = function(name, value) {
    if (window.localStorage) {
        localStorage.setItem(name, value);
    } else {
        alert('This browser does NOT support localStorage');
    }
};
Vue.prototype.getLocalValue = function (name) {
    const value = localStorage.getItem(name);
    if (value) {
        return value;
    } else {
        return '';
    }
};


new Vue({
  el: '#app',
  components: { App },
  template: '<App/>',
  router
})
