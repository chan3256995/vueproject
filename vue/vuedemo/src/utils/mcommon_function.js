
import  axios  from 'axios'
export default {


   copyToClipboard(txt) {
   if (window.clipboardData) {
    window.clipboardData.clearData();
    window.clipboardData.setData("Text", txt);
    alert("复制成功！");

   } else if (navigator.userAgent.indexOf("Opera") != -1) {
    window.location = txt;
   } else if (window.netscape) {
    try {
     window.netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect");
    } catch (e) {
     alert("被浏览器拒绝！\n请在浏览器地址栏输入'about:config'并回车\n然后将 'signed.applets.codebase_principal_support'设置为'true'");
    }
    let clip = Components.classes['@mozilla.org/widget/clipboard;1'].createInstance(Components.interfaces.nsIClipboard);
    if (!clip)
     return;
    let trans = Components.classes['@mozilla.org/widget/transferable;1'].createInstance(Components.interfaces.nsITransferable);
    if (!trans)
     return;
    trans.addDataFlavor("text/unicode");
    let str = new Object();
    let len = new Object();
     str = Components.classes["@mozilla.org/supports-string;1"].createInstance(Components.interfaces.nsISupportsString);
    let copytext = txt;
    str.data = copytext;
    trans.setTransferData("text/unicode", str, copytext.length * 2);
    let clipid = Components.interfaces.nsIClipboard;
    if (!clip)
     return false;
    clip.setData(trans, null, clipid.kGlobalClipboard);
    alert("复制成功！");
   }
  },
  
  copy_to_clipboard(copyTxt)
        {
            let createInput = document.createElement('input');
            createInput.value = copyTxt;
            document.body.appendChild(createInput);
            createInput.select(); // 选择对象
            document.execCommand("Copy"); // 执行浏览器复制命令
            createInput.className = 'createInput';
            createInput.style.display='none';
            alert("复制成功");//没有layui的可以改为alert
        },


}


