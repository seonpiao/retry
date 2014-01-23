describe('Retry', function() {
    describe('try', function() {
        it('try until done', function(done) {
            var retry = new Retry({
                done:function(){
                    assert.equal(10,n);
                    done();
                }
            });
            var n = 0;
            retry.start(function(done,retry){
                n++;
                if(n === 10){
                    done();
                }
                else{
                    retry();
                }
            });
        });
    });
    describe('max',function(){
        it('try until max reached.', function(done) {
            var retry = new Retry({
                max:10,
                fail:function(){
                    assert.equal(10,n);
                    done();
                }
            });
            var n = 0;
            retry.start(function(done,retry){
                n++;
                retry();
            });
        });
    });
    describe('timeout',function(){
        it('try until timeout.', function(done) {
            this.timeout(2000);
            var retry = new Retry({
                timeout:1000,
                fail:function(type){
                    assert.equal('timeout',type);
                    done();
                }
            });
            retry.start(function(done){
                setTimeout(done,2000);
            });
        });
        it('stop when timeout.', function(done) {
            this.timeout(10000);
            var retry = new Retry({
                timeout:1000,
                interval:210,
                fail:function(type){
                    assert.equal('timeout',type);
                    setTimeout(function(){
                        assert.equal(5,n);
                        done();
                    },500);
                }
            });
            var n = 0;
            retry.start(function(done,retry){
                n++;
                retry();
            });
        });
    });
    describe('events', function() {
        it('do not trigger done event when stopped.', function(done) {
            var retry = new Retry({
                done:function(){
                    n++;
                }
            });
            var n = 0;
            retry.start(function(done){
                setTimeout(function(){
                    done();
                },100);
            });
            retry.stop();
            setTimeout(function(){
                assert.equal(0,n);
                done();
            },200);
        });
        it('do not trigger fail event when stopped.', function(done) {
            var retry = new Retry({
                max:1,
                fail:function(){
                    n++;
                }
            });
            var n = 0;
            retry.start(function(done){
                setTimeout(function(){
                    done();
                },100);
            });
            retry.stop();
            setTimeout(function(){
                assert.equal(0,n);
                done();
            },200);
        });
        it('pass params to done event handler.', function(done) {
            var retry = new Retry({
                done:function(num1,num2){
                    n += num1 + num2;
                    assert.equal(8,n);
                    done();
                }
            });
            var n = 0;
            retry.start(function(done){
                done(5,3);
            });
        });
    });
});