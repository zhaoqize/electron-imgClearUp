var fs = require('fs');
var Promise = require('bluebird');
Promise.promisifyAll(fs);

var config = {};
config.srcPath = document.getElementById('source').value || 'C:/Users/Administrator/Desktop/';
config.targetPath = document.getElementById('target').value || 'F:/blogShortCut/';
for(var i=0;i<2;i++){
  if(document.getElementsByName("sync")[i].checked === "checked"){
    config.isQiniu = document.getElementsByName("sync")[i].value;
  }
}

config.re = new RegExp(".png");

var logger = new logg();

document.getElementById('start').addEventListener('click', function(event) {
    doCollection();
}, false)

var logDom = document.getElementById('log');

//开始收集图片
function doCollection() {
    logger.info('开始执行...');
    getFitImg();
}

//选取合适的资源
function getFitImg() {
    fs.readdirAsync(config.srcPath).then(function(files) {
            var imgs = [];
            files.forEach(function(item) {
                if ((config.re).test(item)) imgs.push(item);;
            })
            logger.info('符合条件的图片数:' + imgs.length);

            return imgs;
        })
        .then(function(results) {
            if (results.length) {
                logger.info('开始文件操作...')
                imgIntoFile(results);
            }else{
                logger.info('无图');
            }
        })
        .catch(function(err) {
            logger.error(err);
        })
}

//写入文件
function imgIntoFile(aImgs) {
    var dir = config.targetPath + createDate();
    fs.existsAsync(dir).then(function(exists) {
        if (!exists) {
            logger.info('文件夹不存在');
            createDir(dir);
        }
        doImgs(aImgs, dir);
    })
}

function doImgs(aImgs, target) {
    aImgs.forEach(function(item) {
        var itemSrc = config.srcPath + item;
        var fileReadStream = fs.createReadStream(itemSrc);
        var fileWriteStream = fs.createWriteStream(target + '/' + item);
        fileReadStream.pipe(fileWriteStream);
        //监听流关闭事件
        fileWriteStream.on('close', function() {
            logger.info('移动文件成功!');
            delFile(itemSrc);
        })
    })
}

//创建文件
function createDir(dir) {
    fs.mkdir(dir);
    logger.info('创建文件夹' + dir + '成功!');
}

//删除文件
function delFile(file) {
    fs.unlink(file);
    logger.info('删除文件' + file + '成功!');
}

//创建日期
function createDate() {
    var day = (new Date).getDate();
    var month = (new Date).getMonth() + 1;
    var year = (new Date).getFullYear();
    return year + '_' + month + '_' + day;
}

//log
function logg() {
    return {
        info: function(txt) {
            var pDom = document.createElement('p');
            var txtDom = document.createTextNode(txt);
            pDom.appendChild(txtDom);
            logDom.appendChild(pDom);
        },
        error: function(txt) {
            var pDom = document.createElement('p');
            var txtDom = document.createTextNode(txt);
            pDom.appendChild(txtDom);
            pDom.setAttribute('class', 'error');
            logDom.appendChild(pDom);
        }
    }
}
