(function(global){
    var Retry = function(options){
        options = options || {};
        this._timeout = options.timeout;
        this._max = options.max || Infinity;
        this._interval = options.interval || 0;
        this._cbs = {
            done:[],
            fail:[],
            timeout:[]
        };
    };
    Retry.prototype = {
        start:function(fn){
            var tried = 0;
            var _this = this;
            var timer;
            this._stop = false;
            if(this._timeout){
                timer = setTimeout(function(){
                    _this._fire('timeout');
                    _this._stop = true;
                },this._timeout);
            }
            (function tryfn(){
                if(!_this._stop){
                    tried++;
                    if(tried > _this._max){
                        _this._fire('fail');
                        clearTimeout(timer);
                    }
                    else{
                        fn(function(done){
                            if(done === true){
                                var args = Array.prototype.slice.call(arguments,1);
                                args.unshift('done');
                                _this._fire.apply(_this,args);
                                clearTimeout(timer);
                            }
                            else{
                                if(_this._interval){
                                    setTimeout(tryfn,_this._interval);
                                }
                                else{
                                    tryfn();
                                }
                            }
                        });
                    }    
                }
            })();
        },
        stop:function(){
            this._stop = true;
        },
        on:function(type,cb){
            var cbs = this._cbs[type];
            cbs.push(cb);
        },
        un:function(type,cb){
            var cbs = this._cbs[type];
            if(cb){
                //为兼容ie6，不用indexOf方法
                for(var i = 0; i < cbs.length; i++){
                    if(cbs[i] === cb){
                        cbs.splice(i,1);
                        break;
                    }
                }
            }
            else{
                cbs.splice(0,cbs.length);
            }
        },
        _fire:function(type){
            var args = Array.prototype.slice.call(arguments,1);
            var cbs = this._cbs[type];
            if(cbs && !this._stop){
                for(var i = 0; i < cbs.length; i++){
                    cbs[i].apply(null,args);
                }
            }
        }
    };
    if(typeof module !== 'undefined'){
        module.exports = Retry;
    }
    global.Retry = Retry;
})(this);