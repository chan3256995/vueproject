export default {

setCookies(key,value) {

window.localStorage.setItem(key, value)

},

getCookies(key) {

let loginInfo = window.localStorage.getItem(key)

if (loginInfo === null) {

return "";

} else {

return loginInfo;

}

}

}
