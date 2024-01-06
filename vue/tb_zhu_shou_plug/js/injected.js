




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












