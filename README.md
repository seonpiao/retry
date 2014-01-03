轻便简洁
==========

    var retry = new Retry({
        timeout:1000, //超时时间，默认是30秒
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
    //重试完成需要调用，传入参数true表示成功，将会停止重试，并触发done事件
    //否则表示失败，将会继续重试
    retry.start(function(cb){
        cb(); 
    });