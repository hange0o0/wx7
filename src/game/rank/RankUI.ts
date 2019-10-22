class RankUI extends game.BaseWindow_wx4{

    private static _instance:RankUI;
    public static getInstance() {
        if (!this._instance) this._instance = new RankUI();
        return this._instance;
    }

    private tab: eui.TabBar;
    private desText: eui.Label;
    private scroller: eui.Scroller;
    private list: eui.List;
    private openBtn: eui.Image;



    private bitmap: egret.Bitmap;
    private isdisplay = false;

    private rankData = {};

    private infoBtn:UserInfoBtn

    public constructor() {
        super();
        this.skinName = "RankUISkin";
    }

    public childrenCreated() {
        super.childrenCreated();
        this.setTitle('')

        this.infoBtn = new UserInfoBtn(this.openBtn, (res)=>{
            this.renewInfo(res);
        }, this, Config.localResRoot + "wx_btn_info.png");
        this.infoBtn.force = true

        this.scroller.viewport = this.list;
        this.list.itemRenderer = RankItem;

        this.tab.addEventListener(egret.Event.CHANGE,this.onTab,this)
        this.tab.selectedIndex = 0;

        if(Config.isZJ)//字节不显示好友
        {
            //let ss = (<eui.ArrayCollection>this.tab.dataProvider).source;
            //ss.shift();
            //ss.shift();
            //this.tab.dataProvider = new eui.ArrayCollection(ss);
            this.tab.visible = false;
            this.tab.selectedIndex = 0;
            this.setTitle('过关排行榜')
        }
    }

    private renewInfo(res?){
        var wx = window['wx'];
        if(!wx)
            return;
        if(res && res.userInfo)
        {
            this.infoBtn.visible = false;
            UM_wx4.renewInfo(res.userInfo)
            this.renew();
        }
    }

    private onTab(){
        this.renew()
    }


    public onShow(){

        this.renew();
    }


    public renew(){
        if(!window['wx'])
            return;
        this.remove();
        var selectindex = this.tab.selectedIndex;
        if(Config.isZJ)
            selectindex += 1;
        if(selectindex == 1)
        {
            this.worldRank('level',UM_wx4.level);
        }
        else
        {
            this.showBitmapList()
        }
    }

    private worldRank(type,myValue){
        var wx = window['wx'];
        if(!wx)
        {
            return;
        }

        if(this.rankData[type])
        {
            this.showRank(type);
            return;
        }

        var oo:any = {
            type:type,
            openid:UM_wx4.gameid,
            nick:UM_wx4.nick,
            head:UM_wx4.head,
            value:myValue,
        }

        if(Config.isZJ || Config.isQQ)
        {
            oo.openid2 = UM_wx4.gameid2;
            Net.getInstance().getRankData(oo,(data)=>{
                this.rankData[oo.type] = {
                    list:data.result,
                    time:TM_wx4.now()
                }
                this.showRank(type);
            })
            return;
        }

        console.log(oo)
        MsgingUI.getInstance().show()
        wx.cloud.callFunction({      //取玩家openID,
            name: 'getRank',
            data: oo,
            complete: (res) => {
                console.log(res)
                if(res.result)
                {
                    this.rankData[oo.type] = {
                        list:res.result,
                        time:TM_wx4.now()
                    }
                    this.showRank(type);
                }
                MsgingUI.getInstance().hide()
            },
            fail:()=>{
                MyWindow.Alert('排行榜拉取失败')
                MsgingUI.getInstance().hide()
            }
        })
    }

    public showRank(type){
        if(!this.rankData[type])
            return;
        this.scroller.visible = true;
        var arr = this.rankData[type].list;
        var b = false;
        var myScore = UM_wx4.level
        for(var i=0;i<arr.length;i++) //更新自己成绩
        {
            arr[i].type = type;
            if(arr[i].openid == UM_wx4.gameid && UM_wx4.nick)
            {
                arr[i].value = myScore;
                arr[i].nick = UM_wx4.nick;
                arr[i].head = UM_wx4.head;
                b = true;
            }
        }
        if(!b && UM_wx4.nick && arr.length<50 && myScore > 1)
        {
            arr.push({
                nick:UM_wx4.nick,
                value:myScore,
                type:type,
                head:UM_wx4.head,
                openid:UM_wx4.gameid
            })
        }
        ArrayUtil_wx4.sortByField(arr,['value'],[1])
        var myRank = 0
        for(var i=0;i<arr.length;i++)
        {
            arr[i].index = i+1;
            if(arr[i].openid == UM_wx4.gameid)
                myRank = i+1;
        }
        this.list.dataProvider = new eui.ArrayCollection(arr)
        this.scroller.stopAnimation();
        this.scroller.viewport.scrollV = 0;
        if(UM_wx4.nick)
        {
            if(myRank)
                this.desText.text = '你当前排名为：' + myRank;
            else
                this.desText.text = '你还没进入前50名';
        }
        else
        {
            this.desText.text = '点击授权后可在排行榜中显示你的名次';
            this.infoBtn.visible = true;
        }
    }



    private poseData(){
        if(this.tab.selectedIndex == 0)
        {
            var key = 'level'
            var value = UM_wx4.level
        }
        //else if(this.tab.selectedIndex == 1)
        //{
        //    var key = 'endless'
        //    //var value = UM_wx4.endLess
        //}
        let param:any = {
            me: UM_wx4.gameid,
            command: 'open',
            key:key,
            rankHeight:this.height-this.bitmap.y - 20,
            x:this.bitmap.x + (GameManager_wx4.uiWidth - this.width)/2,
            y:this.bitmap.y + (GameManager_wx4.uiHeight - this.height)/2,
            me_value: value,// + ',0', //第2位时间传0，永远排在最上面
            root: "openDataContext/",
        }

        //发送消息
        var platform = window['platform']
        platform.openDataContext.postMessage(param);
    }

    //0 好友榜，2群排行
    public showBitmapList(){
        if(!window["wx"] || !window["wx"].getOpenDataContext) return;
        this.remove();
        var platform = window['platform']
        if (!this.isdisplay) {

            this.bitmap = platform.openDataContext.createDisplayObject(null, this.stage.stageWidth, this.stage.stageHeight);
            this.bitmap.x = 30;
            this.bitmap.y = 90;
            this.addChild(this.bitmap);
            this.bitmap.touchEnabled = false

            this.isdisplay = true;
            this.poseData();
        }
    }

    protected remove(){
        var platform = window['platform']
        if(this.isdisplay){
            this.isdisplay = false;
            this.bitmap.parent && this.bitmap.parent.removeChild(this.bitmap);

            if(platform.openDataContext){
                platform.openDataContext.postMessage({ command: 'close' });
            }
        }

        this.scroller.visible = false
        this.desText.text = ''
        this.infoBtn.visible = false;
    }
    public hide(){
        this.remove();
        super.hide();
    }
}