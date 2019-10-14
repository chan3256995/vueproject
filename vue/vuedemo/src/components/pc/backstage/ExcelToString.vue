<template style="width: 100%; ">
  <div style="width:50em; text-align: center">
     <input type="file" ref="upload" accept=".xls,.xlsx" class="outputlist_upload">
    <textarea style="display: block; height: 30em;width: 30em" v-text="data_string"></textarea>
  </div>

</template>

<script>
  import axios from 'axios'
  import XLSX from 'xlsx'
    export default {
        name: "ExcelToString",
        data(){
          return{
             outputs: [],
             data_string:""
          }
        },
      mounted() {
    this.$refs.upload.addEventListener('change', e => {//绑定监听表格导入事件
    this.readExcel(e);
    })
  },
        methods:{
          readExcel(e) {//表格导入
            var that = this;
            const files = e.target.files;
            console.log(files);
            if(files.length<=0){//如果没有文件名
            return false;
            }else if(!/\.(xls|xlsx)$/.test(files[0].name.toLowerCase())){
            this.$Message.error('上传格式不正确，请上传xls或者xlsx格式');
            return false;
            }

            const fileReader = new FileReader();
            fileReader.onload = (ev) => {
            try {
                const data = ev.target.result;
                const workbook = XLSX.read(data, {
                type: 'binary'
                });
                const wsname = workbook.SheetNames[0];//取第一张表
                const ws = XLSX.utils.sheet_to_json(workbook.Sheets[wsname]);//生成json表格内容
                console.log(ws);
                that.outputs = [];//清空接收数据
                that.data_string = ""
                //编辑数据
                for(var i= 0;i<ws.length;i++){
                    this.data_string =this.data_string + ws[i].收件人 +" "+ ws[i].电话+" " +ws[i].快递+ws[i].单号 +"\n"

                  // that.outputs.push(sheetData);
                }
                console.log(this.data_string)

                // this.$refs.upload.value = '';

            } catch (e) {

                return false;
            }
            };
            fileReader.readAsBinaryString(files[0]);
}

        }
    }
</script>

<style scoped>

</style>
