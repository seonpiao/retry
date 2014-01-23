轻便简洁
==========

    var retry = new Retry({
        timeout:1000, //超时时间，默认不会超时
        interval:200, //每次执行的时间间隔，默认是0
        max:10        //最大重试次数，默认是无穷大
        done:function(){
            //成功
        },
        fail:function(type){
            //失败
            if(type === 'timeout'){
                //超时
            }
            if(type === 'exceedmax'){
                //重试次数超限
            }
        }
    });
    /**
     * 开始执行
     * @param  {Function}   尝试执行的函数。
     */
    retry.start(function(done,retry){
        done();  //执行成功
        retry();  //本次执行失败，开始下一次重试 
    });
    retry.stop();  //停止重试

单元测试
==========

##In Node.js

    npm install -g mocha
    make test

##In Browser

    用浏览器打开tests/test.html