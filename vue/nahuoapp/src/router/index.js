import Vue from 'vue'
import Router from 'vue-router'

import Main from '../components/Main'
import Home from '../components/Home'
import Find from '../components/Find'
import OutPut from '../components/OutPut'
import My from '../components/My'
import Login from '../components/Login'

Vue.use(Router)

export default new Router({
routes: [
   //根目录默认地址
    {path: '/', redirect: '/home'},

      {
      path:'/login',
      name:'Login',
      component:Login
    },
  {
    path:"/",
    name:"main",
    component:Main,
    children:[
      {
      path: "/home",
      name: "home",
      component: Home
    },
    {
      path: "/find",
      name: "find",
      component: Find
    },
    {
      path: "/output",
      name: "output",
      component: OutPut
    },
    {
      path: "/my",
      name: "my",
      component: My
    }
    ]
  },

  ]


})
