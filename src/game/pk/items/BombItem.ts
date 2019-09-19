class BombItem extends game.BaseItem{
    private static pool = [];

    public static createItem():BombItem {
        var item:BombItem = this.pool.pop();
        if (!item) {
            item = new BombItem();
        }
        return item;
    }

    public static freeItem(item:BombItem) {
        if (!item)
            return;
        item.remove();
        if (this.pool.indexOf(item) == -1)
            this.pool.push(item);
    }


    public isDie = 0
    public decHp = 100;
    public hurtDis = 100;
    public addTime

    private mv:MovieSimpleSpirMC;
    private baseScale = 1.5;
    public constructor() {
        super();
    }

    public childrenCreated() {
        super.childrenCreated();
        this.mv = new MovieSimpleSpirMC();
        this.mv.scaleX = this.mv.scaleY = this.baseScale;
        this.mv.addEventListener('complete',()=>{
             this.isDie = 2;
        },this)
        this.addChild(this.mv);
    }


    public dataChanged(){
        this.addTime = PKC.actionStep
        this.isDie = 0;
        this.mv.setData(['mine_png'])
        this.mv.gotoAndStop(0)
        this.mv.anchorOffsetX = 44/2
        this.mv.anchorOffsetY = 50*0.9

        egret.Tween.removeTweens(this.mv);
        this.mv.x = this.mv.y = 0
        this.mv.scaleX = this.mv.scaleY = this.baseScale;
        egret.Tween.get(this.mv,{loop:true}).to({scaleY:this.baseScale*0.8,scaleX:this.baseScale*1.2},100).to({scaleY:this.baseScale,scaleX:this.baseScale,y:-20},200).
            to({scaleY:this.baseScale*0.8,scaleX:this.baseScale*1.2,y:0},200).to({scaleY:this.baseScale,scaleX:this.baseScale},100).wait(500);
    }

    public remove(){
        this.mv && this.mv.stop();
        MyTool.removeMC(this);
    }

    public testHit(){
        if(this.isDie)
            return;
        if(PKC.actionStep - this.addTime < 20)
            return;
        var arr = PKC.monsterList;
        var len = arr.length;
        var dis = this.hurtDis/2
        for(var i=0;i<len;i++)
        {
            var mData =  arr[i];
            if(mData.isDie)
                continue;
            if(!mData.beSkillAble)
                continue;
            if(!mData.trapAble)
                continue;
            if(Math.abs(this.x - mData.x) < dis && Math.abs(this.y - mData.y) < dis)
            {
                this.playBoom();
                break;
            }
        }
    }

    public playBoom(){
        egret.Tween.removeTweens(this.mv);
        this.mv.x = this.mv.y = 0
        this.mv.scaleX = this.mv.scaleY = this.baseScale;
        this.isDie = 1;
        this.mv.setData(PKTool.getMVList('ani25',5),84)
        this.mv.anchorOffsetX = 136/2
        this.mv.anchorOffsetY = 136/2
        this.mv.gotoAndPay(0,1)


        var arr = PKC.monsterList;
        var len = arr.length;
        for(var i=0;i<len;i++)
        {
            var mData =  arr[i];
            if(mData.isDie)
                continue;
            if(Math.abs(this.x - mData.x) < this.hurtDis && Math.abs(this.y - mData.y) < this.hurtDis)
            {
                mData.addHp(-this.decHp);
            }
        }
        SoundManager.getInstance().playEffect('boom')
    }
}