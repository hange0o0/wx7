class TowerItem extends game.BaseItem{

    private static pool = [];
    public static createItem():TowerItem {
        var item:TowerItem = this.pool.pop();
        if (!item) {
            item = new TowerItem();
        }
        return item;
    }

    public static freeItem(item:TowerItem) {
        if (!item)
            return;
        item.remove();
        if (this.pool.indexOf(item) == -1)
            this.pool.push(item);
    }


    public constructor() {
        super();
        this.skinName = "TowerItemSkin";
    }

    private mc: eui.Image;


    public gData:GBase
    private tw;
    private mv;
    public childrenCreated() {
        super.childrenCreated();
        this.mc.bottom = 50;
        this.tw = egret.Tween.get(this.mc,{loop:true}).to({bottom:30},300).to({bottom:50},300)
        this.anchorOffsetX = 32
        this.anchorOffsetY = 32

        var arr = [];
        for(var i=1;i<=11;i++)
        {
            arr.push('resource/game_assets2/map/gun_mv/mv_' + i + '.png')
        }
        this.mv = new MovieSimpleSpirMC()
        this.addChildAt(this.mv,0)
        this.mv.setData(arr);
        this.mv.anchorOffsetX = 66/2
        this.mv.anchorOffsetY = 30
        this.mv.x = 32
        this.mv.y = 32
    }

    public dataChanged():void {
        this.tw.setPaused(false)
        this.mv.gotoAndPay()
        this.mc.source = ''
        if(this.data)
        {
            this.gData = GBase.getItem(this.data)
            this.mc.source = this.gData.getVO().getUrl();
        }
    }

    public remove(){
        MyTool.removeMC(this);
        this.tw.setPaused(true)
        this.mv.stop();
    }
}