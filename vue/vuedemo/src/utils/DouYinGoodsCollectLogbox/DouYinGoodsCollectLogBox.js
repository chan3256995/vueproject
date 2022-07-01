import msgboxVue from './DouYinGoodsCollectLog_Box';

// 定义插件对象
const DouYinGoodsCollectLogBox = {};
// vue的install方法，用于定义vue插件
DouYinGoodsCollectLogBox.install = function (Vue, options) {

  const MessageBoxInstance = Vue.extend(msgboxVue,options);
  let currentMsg;
  const initInstance = (options) => {
    // 实例化vue实例
    currentMsg = new MessageBoxInstance();

    if (typeof options === 'string') {
        currentMsg.content = options;
      } else if (typeof options === 'object') {
        Object.assign(currentMsg, options);
      }
    let msgBoxEl = currentMsg.$mount().$el;
 


    document.body.appendChild(msgBoxEl);

  };
  // 在Vue的原型上添加实例方法，以全局调用 需要在main.js 上配置
  Vue.prototype.$douYinGoodsCollectLogBox = {
    showMsgBox (options) {
      if (!currentMsg) {
        initInstance(options);
      }

      // if (typeof options === 'string') {
      //   currentMsg.content = options;
      // } else if (typeof options === 'object') {
      //   Object.assign(currentMsg, options);
      // }
    
      return currentMsg.showMsgBox()
        .then(val => {
          console.log('val',val);
          currentMsg = null;
          return Promise.resolve(val);
        })
        .catch(err => {
           console.log('err',err);
          currentMsg = null;
          return Promise.reject(err);
        });
    }
  };
};

export default DouYinGoodsCollectLogBox;
