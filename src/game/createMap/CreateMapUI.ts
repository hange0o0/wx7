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
    private wDecBtn0: eui.Button;
    private wAddBtn: eui.Button;
    private hDecBtn: eui.Button;
    private hDecBtn0: eui.Button;
    private hAddBtn: eui.Button;
    private wAddBtn0: eui.Button;
    private hAddBtn0: eui.Button;













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
        this.list.dataProvider = new eui.ArrayCollection([0,1,2,3,4,5,6,7])//1,


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


        this.addBtnEvent(this.wDecBtn0,()=>{
            this.ww --;
            this.widthText.text = this.ww + ''

            for(var i=0;i<this.hh;i++)
            {
                this.mapData[i].shift();
            }
            this.isChange = true;
            this.renewMap();
        })

        this.addBtnEvent(this.hDecBtn0,()=>{
            this.hh --;
            this.heightText.text = this.hh + ''
            this.mapData.shift();

            this.isChange = true;
            this.renewMap();
        })


        this.addBtnEvent(this.wAddBtn0,()=>{
            this.ww ++;
            this.widthText.text = this.ww + ''

            for(var i=0;i<this.hh;i++)
            {
                this.mapData[i].unshift(0);
            }
            this.isChange = true;
            this.renewMap();
        })

        this.addBtnEvent(this.hAddBtn0,()=>{
            this.hh ++;
            this.heightText.text = this.hh + ''
            var arr = [];
            for(var i=0;i<this.ww;i++)
                arr.push(0)
            this.mapData.unshift(arr);

            this.isChange = true;
            this.renewMap();
        })




        this.addBtnEvent(this.wDecBtn,()=>{
            this.ww --;
            this.widthText.text = this.ww + ''
            this.setHeight()
        })
        this.addBtnEvent(this.wAddBtn,()=>{
            this.ww ++;
            this.widthText.text = this.ww + ''
            this.setHeight()
        })
        this.addBtnEvent(this.hDecBtn,()=>{
            this.hh --;
            this.heightText.text = this.hh + ''
            this.setHeight()
        })
        this.addBtnEvent(this.hAddBtn,()=>{
            this.hh ++;
            this.heightText.text = this.hh + ''
            this.setHeight()
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
            DrawMapUI.getInstance().isTest = 1;
            DrawMapUI.getInstance().show(data);

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
        //this.map.addEventListener(egret.TouchEvent.TOUCH_END,this.renewLevelText,this)

        MyTool.addLongTouch(this.testBtn,()=>{
            if(DEBUG || DebugUI.getInstance().debugOpen)
            {
                var data = new LevelVO();
                data.id = this.level
                data.width = this.ww;
                data.height = this.hh;
                data.data = this.getSaveData();
                data.reset();
                DrawMapUI.getInstance().isTest = 1;
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



        var count = 50
        var lastMap;
        var lastRate;
        while(count--)
        {
            this.resetMapData();
            this.randomRoad();
            var rate = this.roadArr.length/(this.ww*this.hh)
            if(rate > 0.6)
                break;

            if(!lastMap || rate > lastRate)
            {
                lastRate = rate;
                lastMap = this.mapData
            }
        }
        if(count < 0)
            this.mapData = lastMap;




        this.isChange = true;
        this.renewMap();
    }


    private roadArr = []
    private randomRoad(){
        this.roadArr.length = 0;
        var x = Math.floor(this.ww*Math.random())
        var y = Math.floor(this.hh*Math.random())


        this.addRoad(x,y);

        while(this.testAddRoad(this.roadArr[this.roadArr.length-1],this.roadArr[this.roadArr.length-2]))
        {

        }

        this.roadArr.reverse();

        while(this.testAddRoad(this.roadArr[this.roadArr.length-1],this.roadArr[this.roadArr.length-2]))
        {

        }

    }

    private testAddRoad(currentPos,lastPos){
        var arr = [];
        if(lastPos)
        {
            var addY = currentPos.y - lastPos.y;
            var addX = currentPos.x - lastPos.x;
            var xx = addX + currentPos.x
            var yy = addY + currentPos.y
            if(this.isRoadBlockOK(xx,yy))
            {
                arr.push({x:xx,y:yy})
                arr.push({x:xx,y:yy})
                arr.push({x:xx,y:yy})
            }
        }

        if(this.isRoadBlockOK(currentPos.x,currentPos.y + 1))
            arr.push({x:currentPos.x,y:currentPos.y + 1})

        if(this.isRoadBlockOK(currentPos.x,currentPos.y - 1))
            arr.push({x:currentPos.x,y:currentPos.y - 1})

        if(this.isRoadBlockOK(currentPos.x-1,currentPos.y))
            arr.push({x:currentPos.x-1,y:currentPos.y})

        if(this.isRoadBlockOK(currentPos.x+1,currentPos.y))
            arr.push({x:currentPos.x+1,y:currentPos.y})

        if(arr.length == 0)//没有可加的路
        {
            return false
        }

        var road = ArrayUtil_wx4.randomOne(arr);
        this.addRoad(road.x,road.y)
        return true;

    }

    //如果这个位置OK，则放到数组里
    private isRoadBlockOK(x,y){
        if(!this.mapData[y] || this.mapData[y][x] !== 0)
            return false;

        var count = 0;
        if(this.mapData[y + 1] && this.mapData[y + 1][x] == 1)
            count ++
        if(this.mapData[y - 1] && this.mapData[y - 1][x] == 1)
            count ++
        if(this.mapData[y] && this.mapData[y][x+1] == 1)
            count ++
        if(this.mapData[y] && this.mapData[y][x-1] == 1)
            count ++
        return count <= 1;
    }

    private addRoad(x,y)
    {
        this.roadArr.push({x:x,y:y});
        this.mapData[y][x] = 1
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

        this.renew()
    }

    private renewMap(){
        this.scale = TowerManager.getInstance().getScale(this.ww,this.hh,350)
        this.map.scaleX = this.map.scaleY = this.scale;


        this.map.horizontalCenter = 0
        this.map.verticalCenter = -150
        this.map.draw(this.mapData);

        this.renewLevelText();
    }

    private renew(){
        this.isChange = false;
        this.renewMap();
        this.widthText.text = this.ww + ''
        this.heightText.text = this.hh + ''
    }

}