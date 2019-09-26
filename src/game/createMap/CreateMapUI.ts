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
    private setBtn: eui.Button;
    private randomBtn: eui.Button;
    private saveBtn: eui.Button;
    private backBtn: eui.Button;
    private upBtn: eui.Button;
    private downBtn: eui.Button;
    private levelText: eui.Label;
    private beforeBtn: eui.Button;
    private nextBtn: eui.Button;
    private testBtn: eui.Button;
    private wDecBtn: eui.Button;
    private wAddBtn: eui.Button;
    private hDecBtn: eui.Button;
    private hAddBtn: eui.Button;










    public map = new Map();


    public ww;
    public hh;
    public mapData;

    public data;
    public isChange;
    public level
    public scale = 1
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
        this.list.dataProvider = new eui.ArrayCollection([0,1,2,3,4,5,6])//1,

        this.addBtnEvent(this.upBtn,()=>{
            if(this.isChange || !LevelVO.getObject(this.level))
            {
                MyWindow.Alert('还没保存，请先保存');
                return;
            }
            if(this.level <= 1)
                return;
            LevelVO.swap(this.level-1,this.level)
            this.level --;
            this.renewLevelText();

        })

        this.addBtnEvent(this.downBtn,()=>{
            if(this.isChange || !LevelVO.getObject(this.level))
            {
                MyWindow.Alert('还没保存，请先保存');
                return;
            }
            if(!LevelVO.getObject(this.level+1))
                return;
            LevelVO.swap(this.level+1,this.level)
            this.level ++;
            this.renewLevelText();
        })



        this.addBtnEvent(this.wDecBtn,()=>{
            this.ww --;
            this.widthText.text = this.ww + ''
        })
        this.addBtnEvent(this.wAddBtn,()=>{
            this.ww ++;
            this.widthText.text = this.ww + ''
        })
        this.addBtnEvent(this.hDecBtn,()=>{
            this.hh --;
            this.heightText.text = this.hh + ''
        })
        this.addBtnEvent(this.hAddBtn,()=>{
            this.hh ++;
            this.heightText.text = this.hh + ''
        })




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
            this.data.reset();
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
            data.reset();
            DrawMapUI.getInstance().isTest = true;
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
        this.map.addEventListener(egret.TouchEvent.TOUCH_END,this.renewLevelText,this)

        MyTool.addLongTouch(this.testBtn,()=>{
            if(DEBUG || DebugUI.getInstance().debugOpen)
            {
                var data = new LevelVO();
                data.id = this.level
                data.width = this.ww;
                data.height = this.hh;
                data.data = this.getSaveData();
                data.reset();
                DrawMapUI.getInstance().isTest = true;
                DrawMapUI.getInstance().show(data,true);
            }
        },this)
    }


    private renewLevelText(){
        var roadNum = 0;
        var totalNum = 0;
        for(var i=0;i<this.mapData.length;i++)
        {
            var temp = this.mapData[i];
            for(var j=0;j<temp.length;j++)
            {
                if(temp[j] == 1 || temp[j] == 4)
                    roadNum ++;
                totalNum ++;
            }
        }

        this.levelText.text = this.level + '\nn:' + roadNum + ' r:' + Math.floor(roadNum/totalNum*100);
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

    private randomMap(){

        var ww = (5 + this.level/30)
        var hh = (7 + this.level/30)
        if(ww > 10)
            ww = 10
        if(hh > 15)
            hh = 15


        this.ww = Math.round(ww*(0.75+0.5*Math.random()))
        this.hh = Math.round(hh*(0.75+0.5*Math.random()))
        this.widthText.text = this.ww + ''
        this.heightText.text = this.hh + ''

        if(this.ww > 10)
            this.ww = 10
        if(this.hh > 15)
            this.hh = 15
        this.resetMapData();

        //var towerNum = Math.round((this.ww*this.hh/12)*(0.8+0.4*Math.random()));
        //var nearNum = 0//
        //if(this.level >= 12)//靠近的位置出塔的数量
        //{
        //    nearNum ++;
        //    if(Math.random() < 0.5)
        //        nearNum ++;
        //}
        //if(this.level >= 50)
        //{
        //    nearNum ++
        //}
        //if(this.level >= 100 && Math.random() < 0.5)
        //{
        //    nearNum ++
        //}
        //if(this.level >= 150 && Math.random() < 0.5)
        //{
        //    nearNum ++
        //}
        //if(nearNum >= towerNum)
        //    nearNum = towerNum-1
        //var orginPos
        ////放入塔
        //while(towerNum >0)
        //{
        //    if(orginPos)
        //    {
        //        var begin = -1
        //        var size = 3
        //        if(nearNum > 1 && Math.random()< 0.4)
        //        {
        //            begin = -2;
        //            size = 5
        //        }
        //
        //        var x = begin + Math.floor(Math.random()*size)
        //        var y = begin + Math.floor(Math.random()*size)
        //        if(x<0)
        //            x = 0
        //        else if(x>= this.ww)
        //            x = this.ww - 1
        //
        //        if(y<0)
        //            y = 0
        //        else if(y>= this.hh)
        //            y = this.hh - 1
        //    }
        //    else
        //    {
        //        var x = Math.floor(Math.random()*this.ww)
        //        var y = Math.floor(Math.random()*this.hh)
        //    }
        //
        //    if(this.mapData[y][x])
        //        continue;
        //
        //    var id = 0
        //    if(towerNum > 0)
        //    {
        //        towerNum --
        //        id = 2
        //    }
        //
        //    this.mapData[y][x] = id;
        //    if(orginPos)
        //    {
        //        nearNum --;
        //        if(nearNum <= 0)
        //            orginPos = null;
        //    }
        //    else if(nearNum > 0)
        //    {
        //        orginPos = {x:x,y:y}
        //    }
        //}
        //
        ////放入起点
        //var startNum = 1;
        //if(this.level > 50 && Math.random() < 0.5)
        //    startNum ++;
        //if(this.level > 100 && Math.random() < 0.5)
        //    startNum ++;
        //if(this.level > 150 && Math.random() < 0.5)
        //    startNum ++;
        //
        //var endNum = 1;
        //if(this.level > 80 && Math.random() < 0.5)
        //    startNum ++;
        //if(this.level > 160 && Math.random() < 0.5)
        //    startNum ++;
        //
        //while(startNum >0 || endNum > 0)
        //{
        //    if(Math.random() < 0.1)
        //    {
        //        var x = Math.floor(Math.random()*this.ww)
        //        var y = Math.floor(Math.random()*this.hh)
        //    }
        //    else if(Math.random() > 0.5)
        //    {
        //        var x = Math.random() > 0.5?0:this.ww-1
        //        var y = Math.floor(Math.random()*this.hh)
        //    }
        //    else
        //    {
        //        var x = Math.floor(Math.random()*this.ww)
        //        var y = Math.random() > 0.5?0:this.hh-1
        //    }
        //
        //    if(this.mapData[y][x] && this.mapData[y][x] != 1)
        //        continue;
        //
        //    var id = 0
        //    if(startNum > 0)
        //    {
        //        startNum --
        //        id = 5
        //    }
        //    else if(endNum > 0)
        //    {
        //        endNum --
        //        id = 6
        //    }
        //
        //    this.mapData[y][x] = id;
        //}


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
        if(!data)
        {
            var level = this.level = LevelVO.list.length + 1;
            this.ww = Math.min(10,6 + Math.floor(level/5))
            this.hh = Math.min(15,8 + Math.floor(level/5))

            this.resetMapData();

        }
        else
        {
            this.level = data.id;

            this.ww = data.width
            this.hh = data.height
            var arr1 = data.getRoadData(true);
            for(var i=0;i<this.hh;i++)
            {
                this.mapData.push([]);
                for(var j=0;j<this.ww;j++)
                {
                    var id = Math.floor(arr1[i][j]) || 0
                    this.mapData[i].push(id);
                }
            }
        }
        super.show();
    }

    public hide() {
        super.hide();
    }

    public onShow(){

        this.renewLevelText();
        this.renew()
    }

    private renewMap(){
        this.scale = TowerManager.getInstance().getScale(this.ww,this.hh,350)
        this.map.scaleX = this.map.scaleY = this.scale;


        this.map.horizontalCenter = 0
        this.map.verticalCenter = -150
        this.map.draw(this.mapData);
    }

    private renew(){
        this.isChange = false;
        this.renewMap();
        this.widthText.text = this.ww + ''
        this.heightText.text = this.hh + ''
    }

}