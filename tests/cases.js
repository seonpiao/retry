describe('Retry', function() {
    describe('try', function() {
        it('try until done', function(done) {
            var retry = new Retry();
            var n = 0;
            retry.on('done',function(){
                assert.equal(10,n);
                done();
            });
            retry.start(function(cb){
                n++;
                if(n === 10){
                    cb(true);
                }
                else{
                    cb();
                }
            });
        });
    });
    describe('max',function(){
        it('try until max reached.', function(done) {
            var retry = new Retry({
                max:10
            });
            var n = 0;
            retry.on('fail',function(){
                assert.equal(10,n);
                done();
            });
            retry.start(function(cb){
                n++;
                cb();
            });
        });
    });
    describe('timeout',function(){
        it('try until timeout.', function(done) {
            this.timeout(2000);
            var retry = new Retry({
                timeout:1000
            });
            retry.on('timeout',function(){
                done();
            });
            retry.start(function(cb){
                setTimeout(cb,2000);
            });
        });
        it('stop when timeout.', function(done) {
            this.timeout(10000);
            var retry = new Retry({
                timeout:1000,
                interval:210
            });
            var n = 0;
            retry.on('timeout',function(){
                setTimeout(function(){
                    assert.equal(5,n);
                    done();
                },500);
            });
            retry.start(function(cb){
                n++;
                cb();
            });
        });
    });
    describe('events', function() {
        it('add multi callbacks', function(done) {
            var retry = new Retry();
            var n = 0;
            retry.on('done',function(){
                n++;
            });
            retry.on('done',function(){
                n++;
            });
            retry.on('done',function(){
                assert.equal(2,n);
                done();
            });
            retry.start(function(cb){
                cb(true);
            });
        });
        it('remove callback', function(done) {
            var retry = new Retry();
            var n = 0;
            retry.on('done',function(){
                n++;
            });
            var toRemove = function(){
                n++;
            };
            retry.on('done',toRemove);
            retry.on('done',function(){
                assert.equal(1,n);
                done();
            });
            retry.un('done',toRemove);
            retry.start(function(cb){
                cb(true);
            });
        });
        it('remove all callbacks', function(done) {
            var retry = new Retry();
            var n = 0;
            retry.on('done',function(){
                n++;
            });
            var toRemove = function(){
                n++;
            };
            retry.on('done',toRemove);
            retry.un('done');
            retry.on('done',function(){
                assert.equal(0,n);
                done();
            });
            retry.start(function(cb){
                cb(true);
            });
        });
        it('do not trigger done event when stopped.', function(done) {
            var retry = new Retry();
            var n = 0;
            retry.on('done',function(){
                n++;
            });
            retry.start(function(cb){
                setTimeout(function(){
                    cb(true);
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
                max:1
            });
            var n = 0;
            retry.on('fail',function(){
                n++;
            });
            retry.start(function(cb){
                setTimeout(function(){
                    cb();
                },100);
            });
            retry.stop();
            setTimeout(function(){
                assert.equal(0,n);
                done();
            },200);
        });
        it('do not trigger timeout event when stopped.', function(done) {
            var retry = new Retry({
                timeout:50
            });
            var n = 0;
            retry.on('timeout',function(){
                n++;
            });
            retry.start(function(cb){
                setTimeout(function(){
                    cb(true);
                },100);
            });
            retry.stop();
            setTimeout(function(){
                assert.equal(0,n);
                done();
            },100);
        });
        it('pass param to done event handler.', function(done) {
            var retry = new Retry();
            var n = 0;
            retry.on('done',function(num){
                n += num;
                assert.equal(5,n);
                done();
            });
            retry.start(function(cb){
                cb(true,5);
            });
        });
    });
});