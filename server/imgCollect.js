var fs = require('fs');
var Promise = require('bluebird');
var syncQiniu = require("./uploadFile.js");
Promise.promisifyAll(fs);

var config = {};
config.re = new RegExp(".png");

//选取合适的资源
function getFitImg() {
    fs.readdirAsync(config.srcPath).then(function(files) {
            var imgs = [];
            files.forEach(function(item) {
                if ((config.re).test(item)) imgs.push(item);;
            })
            console.log('符合条件的图片数:' + imgs.length);

            return imgs;
        })
        .then(function(results) {
            if (results.length) {
                console.log('开始文件操作...')
                imgIntoFile(results);
            } else {
                console.log('无图');
            }
        })
        .catch(function(err) {
            console.log(err);
        })
}

//写入文件
function imgIntoFile(aImgs) {
    var dir = config.targetPath + createDate();
    fs.existsAsync(dir).then(function(exists) {
            //递进式创建文件夹
            if (!exists) {
                console.log('文件夹不存在');
                createDir(dir);
            }
            console.log('执行doImgs...');
            doImgs(aImgs, dir);
        })
        .catch(function(err) {
            console.log(err)
        })
}

function doImgs(aImgs, target) {
    if (config.isQiniu == "qiniu") {
        aImgs.forEach(function(item) {
            var itemSrc = config.srcPath + item;
            var fileReadStream = fs.createReadStream(itemSrc);
            var fileWriteStream = fs.createWriteStream(target + '/' + item);
            fileReadStream.pipe(fileWriteStream);
            //监听流关闭事件
            fileWriteStream.on('close', function() {
                console.log('移动文件成功!');
                //同步到七牛
                syncQiniu(item, itemSrc);
                //再删除
                delFile(itemSrc);
            })
        })
    } else {
        aImgs.forEach(function(item) {
            var itemSrc = config.srcPath + item;
            var fileReadStream = fs.createReadStream(itemSrc);
            var fileWriteStream = fs.createWriteStream(target + '/' + item);
            fileReadStream.pipe(fileWriteStream);
            //监听流关闭事件
            fileWriteStream.on('close', function() {
                console.log('移动文件成功!');
                delFile(itemSrc);
            })
        })
    }

}

//创建文件
function createDir(dir) {
    var dirArray = dir.split('\\') || dir.split('/');

    if(dirArray[dirArray.length-1]==""){
        dirArray.pop();
    }

    var pathArray = [],
        everyIndex = 0,
        temp;
    for (var i = 0; i < (dirArray.length - 1); i++) {
        ++everyIndex;
        temp = "";
        for (var y = 0; y <= everyIndex; y++) {
            temp += dirArray[y] + "\\";
        }
        pathArray.push(temp);
    }

    console.log('>>>>> ',pathArray);

    //一系列路径
    for(var i=0;i<pathArray.length;i++){
        if(!fs.existsSync(pathArray[i])){
            fs.mkdirSync(pathArray[i]);
        }
    }
    
    console.log('创建文件夹' + dir + '成功!');
}

//删除文件
function delFile(file) {
    fs.unlink(file);
    console.log('删除文件' + file + '成功!');
}

//创建日期
function createDate() {
    var day = (new Date).getDate();
    var month = (new Date).getMonth() + 1;
    var year = (new Date).getFullYear();
    return year + '_' + month + '_' + day;
}

function init(obj) {
    config.srcPath = obj.srcPath || 'C:\\Users\\Administrator\\Desktop\\';
    config.targetPath = obj.targetPath || 'E:\\blogShortCut\\';
    config.isQiniu = obj.isQiniu || 'qiniu';
    getFitImg();
}

module.exports = init;
