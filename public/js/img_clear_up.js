(function() {
    var config = {};

    window.onload = function() {
        //websocket

        //向服务端发送请求
        document.getElementById('start').addEventListener('click', function(e) {
            config.srcPath = document.getElementById('source').value;
            config.targetPath = document.getElementById('target').value;
            for (var i = 0; i < 2; i++) {
                if (document.getElementsByName("sync")[i].checked == true) {
                    config.isQiniu = document.getElementsByName("sync")[i].value;
                }
            }

            var xhr = new XMLHttpRequest();
            xhr.open('get', 'http://localhost:3000/img_clear_up?srcPath=' + config.srcPath + '&targetPath=' + config.targetPath + '&isQiniu=' + config.isQiniu, true);
            xhr.onreadystatechange = function() {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        console.log('OK')
                    }
                }
            }
            xhr.ontimeout = function() {
                console.log('请求超时!')
            }
            xhr.timeout = 10000;

            xhr.send(null);
        }, false)

    }
}())