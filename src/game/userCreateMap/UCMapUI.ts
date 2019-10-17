class UCMapUI extends game.BaseUI_wx4 {

    private static _instance: UCMapUI;
    public static getInstance(): UCMapUI {
        if(!this._instance)
            this._instance = new UCMapUI();
        return this._instance;
    }

    private bg: eui.Image;
    private list: eui.List;
    private setBtn: eui.Button;
    private monsterBtn: eui.Button;
    private saveBtn: eui.Button;
    private backBtn: eui.Button;









    public map = new Map();


    public ww;
    public hh;
    public mapData;
    public hard;
    public title;
    public monsterList = [];

    public data;
    public isChange;
    public level
    public scale = 1
    public constructor() {
        super();
        this.skinName = "UCMapUISkin";
        this.canBGClose = false
    }

    public childrenCreated() {
        super.childrenCreated();
        this.addChild(this.map);
        this.map.initMap(1)
        this.map.isGame = false;

        this.list.itemRenderer = CreateMapItem
        this.list.selectedIndex = 0;
        this.list.dataProvider = new eui.ArrayCollection([0,2,3,4,5,6,7])//1,


        this.addBtnEvent(this.monsterBtn,()=>{
            UCMonsterChooseUI.getInstance().show(this.monsterList);
        })
        this.addBtnEvent(this.setBtn,()=>{
            UCMapSetUI.getInstance().show();
        })




        this.addBtnEvent(this.saveBtn,()=>{
            if(this.monsterList.length == 0)
            {
                MyWindow.ShowTips('还没设置怪物数据')
                var p = this.monsterBtn.localToGlobal(this.monsterBtn.width/2,this.monsterBtn.height/2);
                TowerManager.getInstance().showGuideMC(p)
                return;
            }

            this.data = new LevelVO();
            this.data.id = this.level
            this.data.width = this.ww;
            this.data.height = this.hh;
            this.data.hard = this.hard;
            this.data.title = this.title;
            this.data.data = this.getSaveData();
            this.isChange = false;
            this.data.reset(this.monsterList);

            TC.isTest = 2;
            DrawMapUI.getInstance().show(this.data);
            MyWindow.ShowTips('测试通关后，即可发布地图')
        })

        this.addBtnEvent(this.backBtn,()=>{
            this.hide();
        })

        this.map.addEventListener(egret.TouchEvent.TOUCH_BEGIN,this.onTouch,this)
        this.map.addEventListener(egret.TouchEvent.TOUCH_MOVE,this.onTouch,this)
        //this.map.addEventListener(egret.TouchEvent.TOUCH_END,this.renewLevelText,this)

    }

    private getSaveData(){
        var arr = []
        for(var i=0;i<this.mapData.length;i++)
        {
            var temp = this.mapData[i].concat();
            //for(var j=0;j<temp.length;j++)
            //{
            //    if(temp[j] == 1)
            //        temp[j] = 0;
            //}
            arr.push(temp.join(''))
        }
        return arr.join('')
    }

    private onTouch(e){
        var itemSize = 64*this.scale;
        var x = Math.floor((e.stageX - this.map.x)/itemSize)
        var y = Math.floor((e.stageY - this.y - this.map.y)/itemSize)
        if(y >= this.hh || y < 0 || x >= this.ww || x < 0)
            return;

        var type = this.list.selectedItem || 0;
        if(this.mapData[y][x] != type)
        {
            this.mapData[y][x] = type;
            this.isChange = true;
            this.renewMap();

            //显示路的数量，比例

        }
    }


    public resetData(ww,hh,hard,title){
        this.ww = ww
        this.hh = hh
        this.hard = hard
        this.title = title
        this.mapData.length = this.hh;
        for(var i=0;i<this.hh;i++)
        {
            if(!this.mapData[i])
                this.mapData[i] = [];
            this.mapData[i].length = this.ww
            for(var j=0;j<this.ww;j++)
            {
                if(!this.mapData[i][j])
                    this.mapData[i][j] = 0;
            }
        }

        this.isChange = true;
        this.renewMap();
    }

    private resetMapData(){
        this.mapData = [];
        for(var i=0;i<this.hh;i++)
        {
            this.mapData.push([]);
            for(var j=0;j<this.ww;j++)
            {
                this.mapData[i].push(0);
            }
        }
    }

    public show(){
        this.data = null;
        this.mapData = [];
        this.level = UM_wx4.level

        this.ww = 7
        this.hh = 10
        this.hard = 0
        this.title = '' + DateUtil_wx4.formatDate('MMddhhmm', new Date())
        this.resetMapData();

        super.show();
    }

    public hide() {
        super.hide();
    }

    public onShow(){
        this.bg.source = UM_wx4.getBG();
        this.renew()
    }

    private renewMap(){
        this.scale = TowerManager.getInstance().getScale(this.ww,this.hh,350)
        this.map.scaleX = this.map.scaleY = this.scale;


        this.map.horizontalCenter = 0
        this.map.verticalCenter = -80
        this.map.draw(this.mapData);

    }

    private renew(){
        this.isChange = false;
        this.renewMap();
    }

}