export default {
  formatDateStrFromTimeSt(timeStm) {
  if(timeStm===null){
    return timeStm
  }
  if( timeStm.toString().length === 10){
       timeStm = parseInt(timeStm)*1000
  }

//shijianchuo是整数，否则要parseInt转换
let time = new Date(timeStm);
let y = time.getFullYear();
let m = time.getMonth()+1;
let d = time.getDate();
let h = time.getHours();
let mm = time.getMinutes();
let s = time.getSeconds();
return y+'-'+this.add0(m)+'-'+this.add0(d)+' '+this.add0(h)+':'+this.add0(mm)+':'+this.add0(s);
},
  add0(m){return m<10?'0'+m:m }
}


