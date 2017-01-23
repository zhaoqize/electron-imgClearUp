var qiniu = require("qiniu");

//需要填写你的 Access Key 和 Secret Key
qiniu.conf.ACCESS_KEY = 'QwMQBmLcRT6WS5oafusfUz0uvXIxg2vkZABVratj';
qiniu.conf.SECRET_KEY = 'Tzg5r__7csoTsCufZ_YSNLoS_W0XATyRuucJUWzY';

//构建上传策略函数
function uptoken(bucket, key) {
  var putPolicy = new qiniu.rs.PutPolicy(bucket+":"+key);
  return putPolicy.token();
}

//构造上传函数
function uploadFile(uptoken, key, localFile) {
  var extra = new qiniu.io.PutExtra();
    qiniu.io.putFile(uptoken, key, localFile, extra, function(err, ret) {
      if(!err) {
        // 上传成功， 处理返回值
        //console.log(ret.hash, ret.key, ret.persistentId);
        console.log("上传七牛成功!")
      } else {
        // 上传失败， 处理返回代码
        console.log(err);
      }
  });
}

function init(imgname,sourcePath){
	var token = uptoken('imgs',imgname);
	var key = imgname;
	var localFile = sourcePath;
	uploadFile(token,key,localFile);
}


module.exports = init;
