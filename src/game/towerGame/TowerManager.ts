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
        if(!Config.isWX)
            return;
        var wx = window['wx'];
        if(!wx)
            return;



        console.log('getServerData')
        var url = MyADManager.getInstance().cloudPath + 'map.txt'
        wx.cloud.downloadFile({
            fileID: url,
            success: res => {
                var url =  res.tempFilePath;
                var loader: egret.URLLoader = new egret.URLLoader();
                loader.dataFormat = egret.URLLoaderDataFormat.TEXT;
                loader.once(egret.Event.COMPLETE,(e)=>{
                    var txt = loader.data;
                    var arr = txt.split('\n')
                    arr.shift();
                    if(arr.length && !arr[arr.length-1])
                        arr.pop()

                    //-1是因为标题行
                    if(arr.length-1 < LevelVO.list.length)
                    {
                        return;//公网数据短，不用
                    }


                    LevelVO.clear();
                    CM_wx4.initData(arr.join('\n'),'level');
                    EM_wx4.dispatch(GameEvent.client.LOAD_SERVER_DATA)
                    console.log('getServerData OK')
                    //GameUI.getInstance().onLoadServerData();
                },this);
                loader.load(new egret.URLRequest(url));
            },
            fail: err => {
                console.log(err)
            }
        })

    }

    private guideLight;
    private guideTimer;
    public showGuideMC(p) {
        if (!this.guideLight) {
            var data:any = RES.getRes('guide_mv' + "_json"); //qid
            var texture:egret.Texture = RES.getRes('guide_mv' + "_png");
            if (data == null || texture == null) {
                return
            }
            var mcFactory = new egret.MovieClipDataFactory(data, texture);

            this.guideLight = new egret.MovieClip();
            this.guideLight.movieClipData = mcFactory.generateMovieClipData('click_guide');
            this.guideLight.addEventListener(egret.MovieClipEvent.COMPLETE, ()=>{
                this.guideLight.stop();
                MyTool.removeMC(this.guideLight);
            }, this)
            this.guideLight.frameRate = 12//技能动画变慢
            this.guideLight.touchEnabled = false;
        }

        egret.clearTimeout(this.guideTimer);
        this.guideTimer = egret.setTimeout(function(){
            this.guideLight.x = p.x
            this.guideLight.y = p.y
            this.guideLight.gotoAndPlay(1, 2);
            GameManager_wx4.container.addChild(this.guideLight);
        },this,200);
    }



    public save(){
        var url = MyADManager.getInstance().cloudPath + 'map.txt'
        var wx = window['wx'];
        wx.cloud.downloadFile({
            fileID: url,
            success: res => {
                var url =  res.tempFilePath;
                var loader: egret.URLLoader = new egret.URLLoader();
                loader.dataFormat = egret.URLLoaderDataFormat.TEXT;
                loader.once(egret.Event.COMPLETE,(data)=>{
                    console.log(data);
                    console.log(loader.data);
                },this);
                loader.load(new egret.URLRequest(url));
            },
            fail: err => {
                console.log(err)
            }
        })
    }
}