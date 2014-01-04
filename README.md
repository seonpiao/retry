轻便简洁
==========

    var retry = new Retry({
        timeout:1000, //超时时间，默认不会超时
        interval:200, //每次执行的时间间隔，默认是0
        max:10        //最大重试次数，默认是无穷大
    });
    retry.on('done',function(){
        //成功
    });
    retry.on('fail',function(){
        //失败
    });
    retry.on('timeout',function(){
        //超时处理
    });
    /**
     * 开始执行
     * @param  {Function}   尝试执行的函数。
     *                      函数若执行成功，则调用cb(true)，Retry会停止重试，并触发done事件
     *                      若执行失败，则调用cb()，Retry将会继续进行重试。若超过最大重试次数，则会触发fail事件
     *                      若执行时间超过了设置的超时时间，Retry会停止重试，并触发timeout事件
     */
    retry.start(function(cb){
        cb(); 
    });

单元测试
==========

##In Node.js

    npm install -g mocha
    make test

##In Browser

    用浏览器打开tests/test.html