var electron = require('electron');
var Menu = electron.Menu;
var app = electron.app;
 
var BrowserWindow = electron.BrowserWindow;
 
var mainWindow;

const menu = new Menu();
 
function createWindow(){
    //设置主进程窗口大小
    mainWindow = new BrowserWindow({
        //width:800,
        //height:400,
        //titleBarStyle: 'hidden' //mac上的样式
        //transparent: true
        //frame: false
        //backgroundColor:'#eee',
        autoHideMenuBar:true
        //titleBarStyle :"backgroundColor:red"
    })
    
    //主进程启动后打开的页面
    mainWindow.loadURL(`file://${__dirname}/index.html`);
    
    //谷歌调试工具
    mainWindow.webContents.openDevTools()
    
    //主进程关闭后触发的事件
    mainWindow.on('closed', function () {
 
        mainWindow = null;
    })

}

//应用启动成功后触发ready
app.on('ready',createWindow);

//应用窗口关闭按钮
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit();
  }
})
