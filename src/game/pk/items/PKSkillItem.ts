class PKSkillItem extends game.BaseItem{
    public constructor() {
        super();
        this.skinName = "PKSkillItemSkin";
    }
    private mc: eui.Image;
    private rateBGMC: eui.Image;
    private rateMC: eui.Image;
    private selectMC: eui.Image;
    private beMC: eui.Image;





    public mv = new MovieSimpleSpirMC()
    public touchTime = 0
    public childrenCreated() {
        super.childrenCreated();
        //this.addBtnEvent(this,this.onClick)

        this.addEventListener(egret.TouchEvent.TOUCH_BEGIN,this.onBegin,this)

        this.beMC.visible = false

        this.addChild(this.mv);
        this.mv.setData(PKTool.getMVList('board_mv',10),100)
        this.mv.visible = false
        this.mv.isLoop = true
        this.mv.x = -2
        this.mv.y = -5
        this.mv.scaleX = this.mv.scaleY = 2.1
        this.mv.stop();
    }

    private onBegin(e){
        if(!this.data)
            return;
        this.touchTime = egret.getTimer();
        PKUI.getInstance().showSkillInfo(this,e.touchPointID)
    }

    //private onClick(){
    //    if(!this.data)
    //        return;
    //    if(egret.getTimer() - this.touchTime > 1000)
    //        return;
    //    PKC.playerData.useSkill(this.data.sid)
    //    PKUI.getInstance().hideSkillInfo()
    //}


    public dataChanged(){
        this.mv.visible = false
        this.mv.stop();
        this.beMC.visible = false


        if(!this.data)
        {
            this.currentState = 'lock'
            return;
        }

        this.currentState = 'normal'
        this.mc.source = 'skill_'+this.data.sid+'_jpg'
        this.selectMC.visible = false;
        this.setRateVisible(false);
        this.beMC.visible = !this.data.isActive
    }

    public setSelect(data){
        this.selectMC.visible = this.data == data;
    }

    public setRateVisible(b){
        this.rateMC.visible = b;
        this.rateBGMC.visible = b;
    }

    public onE(){
        if(!this.data)
            return;
        if(!this.data.isActive)
            return;
        var playerData = PKC.playerData
        if(playerData.isSkilling)
        {
            if(playerData.isSkilling == this.data.sid)
            {
                this.setRateVisible(false);
                this.mv.visible = false
                this.mv.stop();
            }
            else
            {
                this.setRateVisible(true);
                this.rateMC.height = this.mc.height
            }
            return;
        }
        var cd = playerData.getSkillCD(this.data.sid)
        if(cd)
        {
            this.setRateVisible(true);
            this.rateMC.height = Math.min(1,cd/this.data.maxCD)*80
            this.mv.visible = false
            this.mv.stop();
        }
        else
        {
            this.setRateVisible(false);
            this.mv.visible = true
            this.mv.play();
        }

    }
}