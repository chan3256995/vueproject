<template>
  <div style="width: 110mm;">
    <div  class="print_data">
      <div style="width: 110mm; height:auto ">
            <div style="margin-right:2mm; margin-bottom:2mm;width: 50mm; height: 30mm; float: left;padding-left: 1.5mm ;background: darkgrey;">
              <label style="display: block ; font-size: 7mm">   女 4FE E426</label>
              <label style="display: block ;font-size: 5mm">货号：  1988</label>
              <div style="float: left;padding-left:0.2em;">
              <label style="font-size: 4mm;">黑色尺寸：L</label>
              <label style="display: block;font-size: 4mm">数量：1</label>
              <label style="display: block;font-size: 3mm">2019-07-03</label>
              </div>
              <div style="width: 1.5em; float: left;font-size: 11mm"><label>圆</label></div>
            </div>
            <div style="width: 50mm;margin-bottom:2mm; height: 30mm; float: left; padding-left: 1.5mm;background: darkgrey;">
              <label style="display: block ; font-size: 7mm">   女 4FE E426</label>
              <label style="display: block ;font-size: 5mm">货号：  1988</label>
              <div style="float: left;padding-left:0.2em;">
              <label style="font-size: 4mm;">黑色尺寸：L</label>
              <label style="display: block;font-size: 4mm">数量：1</label>
              <label style="display: block;font-size: 3mm">2019-07-03</label>
              </div>
              <div style="width: 1.5em; float: left;font-size: 11mm"><label>圆</label></div>
            </div>

   </div>
    </div>
  <div style="display: block;">
      <button  id="print2" @click="doPrint()">打印指定部分</button>
  </div>
</div>
</template>

<script>
    export default {
        name: "PrintFormatPage",
        data(){
          return  {
             order_list:JSON.parse(this.$route.query.order_list),
          }
        },
        methods:{
        doPrint() {// 1.设置要打印的区域 div的className
        let newstr = document.getElementsByClassName('print_data')[0].innerHTML;
        let oldstr = document.body.innerHTML
          // 2. 复制给body，并执行window.print打印功能
             document.body.innerHTML = newstr;
          // 3. 还原：将旧的页面储存起来，当打印完成后返给给页面。

        window.print()
          document.body.innerHTML = oldstr
          return false
        }
        },
      created(){

          console.log(this.order_list)
          let new_order_list = [];
          for(let i = 0;i<this.order_list.length;i++){

              for(let j = 0;j<this.order_list[i].orderGoods.length;j++){

                let new_order = JSON.parse(JSON.stringify(this.order_list[i]))
                let single_order_goods = [];
                 single_order_goods.push(JSON.parse(JSON.stringify(this.order_list[i].orderGoods[j])));
                console.log("i ---- j");
                console.log(i +"----"+j);
                new_order['orderGoods'] = single_order_goods
                new_order_list.push(new_order)
              }
          }
          console.log("new list*************************")
          this.order_list = new_order_list;
          console.log(new_order_list)
      }
    }


</script>

<style scoped>

</style>
