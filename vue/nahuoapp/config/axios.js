import axios from 'axios'
 import router from '../src/router'
import pGlobal from "../src/utils/pGlobal"
import cookiesUtils from "../src/utils/cookieUtil"
import Vue from 'vue'
//使用vue-cookies
 import VueCookies from 'vue-cookies'
 Vue.use(VueCookies)
 Vue.prototype.$cookies2 = VueCookies

// 配置默认的host,假如你的API host是：
// axios.defaults.baseURL = 'http://192.168.1.100:8080'
// 添加请求拦截器
axios.interceptors.request.use(function (config) {
　　// 在发送请求之前做些什么
        console.log("拦截器--------------------------")
        console.log(config)
        Vue.prototype.$nprogress.start()
        console.log(VueCookies.get("access_token"))
        console.log("url")
        console.log(config.url)


        config.url = config.url+"?access_token_nh="+cookiesUtils.getCookies("access_token_nh")


        console.log(config.url)
        console.log("拦截器--------------------------")
        // console.log(this.$cookies.isKey("access_token"))
　　　　return config
}, function (error) {
　　// 对请求错误做些什么
return Promise.reject(error)
});

// 添加响应拦截器
axios.interceptors.response.use(function (response) {
　　// 对响应数据做点什么
        console.log("响应拦截器-------------------------------")
        console.log(response)
      //进度条
        Vue.prototype.$nprogress.done()
　　　　return response
}, function (error) {
　　// 对响应错误做点什么
     Vue.prototype.$nprogress.done()
     console.log("错误响应拦截器-------------------------------")
     console.log(error.response.status)
     let status = error.response.status
     if (status ===403 || status ===401){
       console.log(error.response.request.responseURL)
       router.replace("/Login")
     }
      console.log(error)
　　　return Promise.reject(error)
});
