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
            var timer,stop = false;
            if(this._timeout){
                timer = setTimeout(function(){
                    _this._fire('timeout');
                    stop = true;
                },this._timeout);
            }
            (function tryfn(){
                if(!stop){
                    tried++;
                    if(tried > _this._max){
                        _this._fire('fail');
                        clearTimeout(timer);
                    }
                    else{
                        fn(function(done){
                            if(done === true){
                                _this._fire('done');
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
        on:function(type,cb){
            var cbs = this._cbs[type];
            cbs.push(cb);
        },
        un:function(type,cb){
            var cbs = this._cbs[type];
            if(cb){
                var i = cbs.indexOf(cb);
                if(i !== -1){
                    cbs.splice(i,1);
                }
            }
            else{
                cbs.splice(0);
            }
        },
        _fire:function(type){
            var cbs = this._cbs[type];
            if(cbs){
                for(var i = 0; i < cbs.length; i++){
                    cbs[i]();
                }
            }
        }
    };
    if(typeof module !== 'undefined'){
        module.exports = Retry;
    }
})(this);