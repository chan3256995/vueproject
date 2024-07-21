// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
 import '../config/axios'
Vue.config.productionTip = false
import Axios from 'axios'
Vue.prototype.$axios = Axios
Axios.defaults.headers.get['Content-Type'] = 'application/json';
Axios.defaults.withCredentials = true

 import NProgress from 'nprogress' // 进度条
import 'nprogress/nprogress.css' //这个样式必须引入
Vue.prototype.$nprogress = NProgress

import toastRegistry from './utils/toast/index'
// 这里也可以直接执行 toastRegistry()
Vue.use(toastRegistry)
  // Vue.prototype.$toast = toastRegistry

 //使用vue-cookies
 import VueCookies from 'vue-cookies'
 Vue.use(VueCookies)
 Vue.prototype.$cookies2 = VueCookies


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
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
