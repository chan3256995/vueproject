export default {

setCookies(key,value) {
window.localStorage.setItem(key, value)
},

deleteCookies(key){
  window.localStorage.removeItem(key)
  },
getCookies(key) {

let info = window.localStorage.getItem(key)

if (info === null) {

return "";

} else {

return info;

}

}

}
