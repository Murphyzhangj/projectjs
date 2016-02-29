// 路径解析

// test.json!txt  --> 匹配 !txt
var SUFFIX_EXTRA_REG = /![^!]+$/;
// test.json?xx --> test.json
function removeUrlSeachAndHash(uri){
    return uri.replace(/(\?|#).*$/, "");
};
var path = {
    // 路径格式化
    normal: function(uri){
        // 1. ./a/./b//c/d/../e/ ==> ./a//b//c/d/../e/
        // 2. ./a//b/c/d/../e/ ==> ./a/b/c/d/../e/
        // 3. ./a/b/c/d/../e/ ==> ./a/b/c/e/
        return uri.replace(/\/\.\//g, "\/\/").replace(/([^:])\/{2,}/g, "$1\/").replace(/[^/]+\/\.\.\/([^/]*)/g, "$1");
    },
    // 是否绝对路径, ftp:// 或 http:// ，不过 // 这种不知道算不算呢?
    isAbsolute: function(uri){
        return /(https?|ftp):\/\//.test(uri);
    },
    // 路径合并
    join: function(){
        return path.normal([].join.call(arguments, "\/"));
    },
    // 目录，http://www.100bt.com 这样的，会有BUG，现实不存在这样的路径，先无视
    //  删除 search 和 hash 部分
    dir: function(uri){
        return removeUrlSeachAndHash(uri).replace(/(.*\/).*$/, "$1");
    },
    root: function(uri){
        // http://www.baidu.com/xxx/index.html --> http://www.baidu.com/
        var res = uri.match(/.*:\/{2,}.*?(\/|$)/g);
        return res ? res[0] : "";
    },
    // 后缀名
    ext: function(uri){
        // test.txt!js  --> "!js"
        // test.json --> "json"
        var ext = uri.match(SUFFIX_EXTRA_REG);
        if (ext) {
            return ext[0].slice(1);
        } else {
            uri = removeUrlSeachAndHash(uri);
            return uri.match(/\.([^.]*)$/)[1];
        }
    },
    clearExtra: function(uri){
        return uri.replace(SUFFIX_EXTRA_REG, "");
    }
};
