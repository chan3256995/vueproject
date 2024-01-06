




(function () {
                console.log("执行了ijected.js");
                var XHR = XMLHttpRequest.prototype;
            // Remember references to original methods
                var open = XHR.open;
                var send = XHR.send;

            // Overwrite native methods
            // Collect data:
                XHR.open = function(method, url) {
                    this._method = method;
                    this._url = url;
                    return open.apply(this, arguments);
                };

            // Implement "ajaxSuccess" functionality
                XHR.send = function(postData) {
                    this.addEventListener('load', function() {
                        //这里是监听获取以后的操作
                        console.log("xhrRrl:  "+this._url);

                         window.postMessage({"responseText":this.responseText,"url":this._url},"*");


                        // /* Request y  */ postData
                    });
                    return send.apply(this, arguments);
                };
            })();
// (function () {
//
//     console.log("fetch.js");
// const originalFetch = window.fetch;
// const originFetch = window.fetch;
//
// // / *************
//    window.fetch = function newFetch(url, config) {
//         let method;
//         let params;
//         if (config) {
//             method = config.method.toUpperCase() || 'get'
//             params = config.body || ''
//         } else {
//             method = 'get'
//             params = ''
//         }
//         const startTime = Date.now()
//         const reportData = {
//             kind: 'stability',
//             type: 'fetch',
//             startTime,
//             url,
//             method,
//             params,
//         }
//
//         return originalFetch(url, config)
//             .then(res => {
//                  console.log("fetch55555555555555555555");
//                      console.log(res)
//                 reportData.endTime = Date.now()
//                 reportData.duration = reportData.endTime - reportData.startTime
//
//                 const data = res.clone()
//                 reportData.status = data.status
//                 reportData.success = String(data.ok)
//
//
//                 //数据上报
//
//
//                 return res
//             })
//             .catch(err => {
//                   console.log("fetch66666666");
//                 reportData.endTime = Date.now()
//                 reportData.duration = reportData.endTime - reportData.startTime
//                 reportData.status = 0
//                 reportData.success = 'false'
//
//                 console.log(reportData)
//                 //数据上报
//
//                 throw err
//             })
//     }
//     /// *************
//
//
//
//
//
// //*************************
// //       window.unsafeWindow.fetch = (url, options) => {
// //         return originFetch(url, options).then(async (response) => {
// //             console.log(url)
// //              console.log("fetch777777777777777777777777");
// //             if(url === 'http://localhost:3002/api/query'){
// //                 const responseClone = response.clone();
// //                 let res = await responseClone.json();
// //                 res.data.push('油猴脚本修改数据')
// //                 const responseNew = new Response(JSON.stringify(res), response);
// //                 return responseNew;
// //             }else{
// //                 return response;
// //
// //             }
// //         });
// //     };
//  //*************************
//
//
//     //
//     // window.fetch = async function (...args) {
//     //     const response = await origFetch(...args);
//     //     console.log('fetch request:', args);
//     //
//     //     response
//     //         .clone()
//     //         .blob() // 此处需要根据不同数据调用不同方法，这里演示的是二进制大文件，比如音频
//     //         .then(data => {
//     //         	// 对于二进制大文件可以创建为URL(blob:开头)，供其它脚本访问
//     //         	//sessionStorage['wave'] = URL.createObjectURL(data); // 插件需要添加'storage'权限
//     //               console.log("fetch监听到的数据 ")
//     //             window.postMessage({ type: 'fetch', data: URL.createObjectURL(data) }, '*'); // send to content script
//     //         })
//     //         .catch(err => console.error(err));
//     //     return response;
//     // }
// })();











