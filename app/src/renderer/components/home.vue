<template>
  <div class="oh">
    <div class="group">
        <label for="source" class="lb">源地址:</label>
        <input type="text" name="source" id="source" value="/Users/zqz/Desktop/">
    </div>
    <div class="group">
        <label for="target" class="lb">目标地址:</label>
        <input type="text" name="target" id="target" value="/imgs/">
    </div>
    <webview src="https://www.github.com/"></webview>
   <!--  <div class="group">
        <label for="target">是否同步到七牛:</label>
        <input type="radio" name="sync" value="qiniu" checked> 是
        <input type="radio" name="sync" value="noqiniu"> 否
    </div> -->
    <button @click="start" id='start'>运行</button>
    <!--打印运行log-->
    <p class="logger">日志:</p>
    <div id="log">

    </div>
  </div>
</template>

<script>
  import fs from 'fs';
  import Promise from 'bluebird';
  // import qiniu from 'qiniu'

  export default {
    name: 'home',

    data () {
      return {
         config: {},
         logger: {},
      }
    },
    methods: {
      /**
       * [setParams description]
       * 设置需要的参数
       */
      setParams () {
        let config = {}
        config.re = new RegExp('.png')
        config.srcPath = document.getElementById('source').value  || '/Users/zqz/Desktop/'
        config.targetPath = document.getElementById('target').value || '/imgs/'
        this.config = config
      },
      /**
       * [imgIntoFile description]
       * @param  {[type]} aImgs [description]
       * @return {[type]}       [description]
       * 图片写入文件
       */
      imgIntoFile (aImgs) {
         let config = this.config;
         let dir = config.targetPath + this.createDate();
         
         //递进式创建文件夹
         if(!fs.existsSync(dir)){
            this.logger.info('文件夹不存在');
            this.createDir(dir);
         }

         this.logger.info('开始移动文件...');
         this.operationImgs(aImgs, dir);
      },
      /**
       * [operationImgs description]
       * @param  {[type]} aImgs [description]
       * @param  {[type]} dir   [description]
       * @return {[type]}       [description]
       * 操作图片
       */
      operationImgs (aImgs, dir) {
        let config = this.config;
        aImgs.forEach((item) => {
            let itemSrc = config.srcPath + item;
            let fileReadStream = fs.createReadStream(itemSrc);
            let fileWriteStream = fs.createWriteStream(dir + '/' + item);
            fileReadStream.pipe(fileWriteStream);
            //监听流关闭事件
            fileWriteStream.on('close', () => {
                this.logger.info('移动文件成功!');
                this.delFile(itemSrc);
            })
        })
      },
      /**
       * 递进式创建文件夹
       * @param  {[type]} dir [description]
       * @return {[type]}     [description]
       */
      createDir (dir) {
        let dirArray = dir.split('/') || dir.split('/');

        if(dirArray[dirArray.length-1]==""){
            dirArray.pop();
        }

        let pathArray = [],
            everyIndex = 0,
            temp;
        for (let i = 0; i < (dirArray.length - 1); i++) {
            ++everyIndex;
            temp = "";
            for (let y = 0; y <= everyIndex; y++) {
                temp += dirArray[y] + "/";
            }
            pathArray.push(temp);
        }

        this.logger.info('>>>>> ' + pathArray)

        //一系列路径
        for(let i=0;i<pathArray.length;i++){
            if(!fs.existsSync(pathArray[i])){
                fs.mkdirSync(pathArray[i]);
            }
        }
        
        this.logger.info('创建文件夹' + dir + '成功!');
      },
      delFile (file) {
        fs.unlink(file);
        this.logger.info('删除文件' + file + '成功!');
      },
      createDate () {
        let day = (new Date).getDate();
        let month = (new Date).getMonth() + 1;
        let year = (new Date).getFullYear();
        return year + '_' + month + '_' + day;
      },
      /**
       * 获取合适的图片
       * @return {[type]} [description]
       */
      getFitImg () {
        let config = this.config;
        let opc = fs.readdirAsync(config.srcPath)
                      .then((files) => {
                        let imgs = [];
                        files.forEach(function(item) {
                            if ((config.re).test(item)) imgs.push(item)
                        })
                        this.logger.info('符合条件的图片数:' + imgs.length);

                        return imgs;
                      })
                      .then((results) => {
                        if (results.length) {
                            this.logger.info('开始文件操作...');
                            this.imgIntoFile(results);
                        } else {
                            this.logger.info('无图')
                        }

                        return true;
                      })
        opc.catch((err) => {
           this.logger.error('[getFitImg]' + err);
        })
      },
      log () {
        return {
            info: function(txt) {
              let logDom = document.getElementById('log');
              let pDom = document.createElement('p');
              let txtDom = document.createTextNode(txt);
              pDom.appendChild(txtDom);
              logDom.appendChild(pDom);
            },
            error: function(txt) {
              let logDom = document.getElementById('log');
              let pDom = document.createElement('p');
              let txtDom = document.createTextNode(txt);
              pDom.appendChild(txtDom);
              pDom.setAttribute('class', 'error');
              logDom.appendChild(pDom);
            }
        }
      },
      start () {
        document.getElementById('log').innerHTML = '';
        this.logger.info('开始...');
        this.setParams();
        this.getFitImg();
      }
    },
    created () {
      Promise.promisifyAll(fs);
      console.log(fs);
      this.logger = this.log();
    }
  }
</script>

<style scoped>
 body{
        font: 14px/100% "Microsoft yahei","Hiragino Sans GB","Hiragino Sans GB W3",arial,\5b8b\4f53;
    }

    .error {
        color: red;
    }

    .logger{
        border-bottom: 1px dotted;
        padding-bottom: 10px;
        text-align: center;
    }
    
    #start {
      padding: 5px;
      border-radius: 3px;
      background-color: #1dbfa9;
      border-style: none;
      color: white;
      margin-left: 5px;
    }

    #start:hover{
        background-color: #166bb5;
    }

    input[type="text"]{
        padding: 5px 10px;
        border-radius: 4px;
        border: none;
        border: 1px solid #357ebd;
        outline: none;
    }

    #app {
      height: 100%;
    }

    #log{
      background-color: #fff;
      height: 100%;
    }

    .group{
        margin: 10px 5px;
    }

    .oh{
      overflow:hidden;
      height: 100%;
    }

    .lb{
      width: 9%;
      display: inline-block;
    }

</style>
