export default {
  saveToken(token){
    window.localStorage.setitem('token',JSON.stringify(token))
  },
  readToken(){
    return JSON.parse(window.localStorage.getItem("token" || '[]'))
  }
}
