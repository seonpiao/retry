var assert = {
    equal:function(a,b){
        if(a !== b){
            throw new Error(a + ' not equal to ' + b);
        }
    }
};