class CreateMapUI extends game.BaseUI_wx4 {

    private static _instance: CreateMapUI;
    public static getInstance(): CreateMapUI {
        if(!this._instance)
            this._instance = new CreateMapUI();
        return this._instance;
    }

    private list: eui.List;
    private widthText: eui.EditableText;
    private heightText: eui.EditableText;
    private treeText: eui.EditableText;
    private roadText: eui.EditableText;
    private towerText: eui.EditableText;
    private setBtn: eui.Button;
    private randomBtn: eui.Button;
    private saveBtn: eui.Button;
    private backBtn: eui.Button;
    private beforeBtn: eui.Button;
    private levelText: eui.Label;
    private nextBtn: eui.Button;
    private testBtn: eui.Button;







    public map = new Map();


    public ww;
    public hh;
    public treeNum;
    public towerNum;
    public roadNum;
    public mapData;

    public data;
    public isChange;
    public level
    public constructor() {
        super();
        this.skinName = "CreateMapUISkin";
        this.canBGClose = false
    }

    public childrenCreated() {
        super.childrenCreated();
        this.addChild(this.map);
        this.map.initMap(1)
        this.map.isGame = false;

        this.list.itemRenderer = CreateMapItem
        this.list.selectedIndex = 0;
        this.list.dataProvider = new eui.ArrayCollection([0,2,3,4,5,6])//1,



        this.addBtnEvent(this.saveBtn,()=>{
            if(!this.data)
            {
                this.data = new LevelVO();
                this.data.id = this.level
                LevelVO.list.push(this.data)
                LevelVO.data[this.data.id] = this.data;
            }
            this.data.width = this.ww;
            this.data.height = this.hh;
            this.data.data = this.getSaveData();
            this.isChange = false;
            CreateMapManager.getInstance().save();
        })
        this.addBtnEvent(this.randomBtn,()=>{
            this.randomMap();
        })
        this.addBtnEvent(this.testBtn,()=>{
            var data = new LevelVO();
            data.id = this.level
            data.width = this.ww;
            data.height = this.hh;
            data.data = this.getSaveData();
            DrawMapUI.getInstance().show(data);
        })
        this.addBtnEvent(this.setBtn,()=>{
            this.setHeight()
        })
        this.addBtnEvent(this.backBtn,()=>{
            if(this.isChange)
            {
                MyWindow.Confirm('还没保存，确定退出吗？',(b)=>{
                    if(b==1)
                    {
                        this.hide();
                    }
                },['取消','确定']);
                return
            }
            this.hide();
        })
        this.addBtnEvent(this.beforeBtn,()=>{
            if(this.isChange)
            {
                MyWindow.Confirm('还没保存，确定退出吗？',(b)=>{
                    if(b==1)
                    {
                        this.gotoLevel(-1);
                    }
                },['取消','确定']);
                return
            }
            this.gotoLevel(-1);
        })
        this.addBtnEvent(this.nextBtn,()=>{
            if(this.isChange)
            {
                MyWindow.Confirm('还没保存，确定退出吗？',(b)=>{
                    if(b==1)
                    {
                        this.gotoLevel(1);
                    }
                },['取消','确定']);
                return
            }
            this.gotoLevel(1);
        })

        this.map.addEventListener(egret.TouchEvent.TOUCH_BEGIN,this.onTouch,this)
        this.map.addEventListener(egret.TouchEvent.TOUCH_MOVE,this.onTouch,this)
    }

    private gotoLevel(add){
        if(this.data)
            var lv = this.data.id
        else
            var lv = LevelVO.list.length + 1;
        lv += add;
        if(lv < 1)
            return;
        this.show(LevelVO.getObject(lv));
    }

    private getSaveData(){
        var arr = []
        for(var i=0;i<this.mapData.length;i++)
        {
            arr.push(this.mapData[i].join(''))
        }
        return arr.join('')
    }

    private onTouch(e){
        var x = Math.floor((e.stageX - this.map.x)/64)
        var y = Math.floor((e.stageY - this.y - this.map.y)/64)
        if(y >= this.hh || y < 0 || x >= this.ww || x < 0)
            return;

        var type = this.list.selectedItem || 0;
        if(this.mapData[y][x] != type)
        {
            this.mapData[y][x] = type;
            this.isChange = true;
            this.renewMap();
        }
    }

    private randomMap(){
        this.resetMapData();
        this.roadNum = parseInt(this.roadText.text)
        this.treeNum = parseInt(this.treeText.text)
        this.towerNum = parseInt(this.towerText.text)
        var roadNum = this.roadNum
        var treeNum = this.treeNum
        var towerNum = this.towerNum
        while(roadNum || treeNum || towerNum)
        {
            var x = Math.floor(Math.random()*this.ww)
            var y = Math.floor(Math.random()*this.hh)
            if(this.mapData[y][x])
                continue;

            var id = 0
            if(roadNum)
            {
                id = 4;
                roadNum --
            }
            else if(treeNum)
            {
                id = 3;
                treeNum --
            }
            else if(towerNum)
            {
                id = 2;
                towerNum --
            }
            this.mapData[y][x] = id;
        }
        this.isChange = true;
        this.renewMap();
    }

    private setHeight(){
        this.ww = Math.min(10,parseInt(this.widthText.text))
        this.hh = Math.min(15,parseInt(this.heightText.text))
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

    public show(data?){
        this.data = data;
        this.mapData = [];
        this.treeNum = 0
        this.towerNum = 0
        this.roadNum = 0
        if(!data)
        {
            var level = this.level = LevelVO.list.length + 1;
            this.ww = Math.min(10,6 + Math.floor(level/5))
            this.hh = Math.min(15,8 + Math.floor(level/5))

            if(level > 10)
                this.treeNum = Math.ceil((level-10)/5)
            if(level > 30)
                this.roadNum = Math.ceil((level-30)/5)
            this.towerNum = 3 + Math.floor(level/10)

            this.resetMapData();

            this.levelText.text = level;

        }
        else
        {
            this.level = data.id;
            this.levelText.text = data.id;

            this.ww = data.width
            this.hh = data.height
            var arr1 = data.getRoadData();
            for(var i=0;i<this.hh;i++)
            {
                this.mapData.push([]);
                for(var j=0;j<this.ww;j++)
                {
                    var id = Math.floor(arr1[i][j]) || 0
                    this.mapData[i].push(id);
                    if(id == 3)
                        this.treeNum ++
                    if(id == 2)
                        this.towerNum ++
                    if(id == 4)
                        this.roadNum ++
                }
            }
        }
        super.show();
    }

    public hide() {
        super.hide();
    }

    public onShow(){
        this.renew()
    }

    private renewMap(){
        this.map.x = (640 - 64*this.ww)/2
        this.map.draw(this.mapData);
    }

    private renew(){
        this.isChange = false;
        this.renewMap();
        this.widthText.text = this.ww + ''
        this.heightText.text = this.hh + ''
        this.treeText.text = this.treeNum + ''
        this.towerText.text = this.towerNum + ''
        this.roadText.text = this.roadNum + ''

    }

}