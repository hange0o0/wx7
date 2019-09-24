class TowerManager extends egret.EventDispatcher {
    private static _instance:TowerManager;
    public static getInstance() {
        if (!this._instance) this._instance = new TowerManager();
        return this._instance;
    }

    public level = 1;
    public emptyLevelVO
    public isLoadServerMap = false

    public constructor(){
        super();
        this.emptyLevelVO = new LevelVO()
        this.emptyLevelVO.id = 9999
        this.emptyLevelVO.width = 9
        this.emptyLevelVO.height = 12
        this.emptyLevelVO.data = '000222000002222200022000220022000220000000220000000220000222200000222000000000000000222000000222000000000000'
    }

    public getScale(ww,hh,offY = 250){
        ww = ww*64
        hh = hh*64

        var maxH = GameManager_wx4.uiHeight - offY - 100
        var maxW = 640 - 100;
        var scale = Math.min(maxH/hh,maxW/ww);
        if(scale<1)
        {
            maxH += 100
            maxW += 100;
            scale = Math.min(maxH/hh,maxW/ww);
        }

        return Math.min(1.3,scale);
    }

    //取服务器数据
    public getServerData(){
        if(this.isLoadServerMap)
            return;
        this.isLoadServerMap = true
        var wx = window['wx'];
        if(!wx)
            return;
        var url = MyADManager.getInstance().cloudPath + 'map.txt'
        wx.cloud.downloadFile({
            fileID: url,
            success: res => {
                var url =  res.tempFilePath;
                var loader: egret.URLLoader = new egret.URLLoader();
                loader.dataFormat = egret.URLLoaderDataFormat.TEXT;
                loader.once(egret.Event.COMPLETE,()=>{
                    var txt = loader.data;
                    LevelVO.clear();
                    var arr = txt.split('\n')
                    arr.shift();
                    CM_wx4.initData(arr.join('\n'),'level');
                    EM_wx4.dispatch(GameEvent.client.LOAD_SERVER_DATA)
                    //GameUI.getInstance().onLoadServerData();
                },this);
                loader.load(new egret.URLRequest(url));
            },
            fail: err => {
                console.log(err)
            }
        })

    }



    public save(){

    }
}