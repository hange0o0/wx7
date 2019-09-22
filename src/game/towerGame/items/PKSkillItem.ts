class PKSkillItem extends game.BaseItem{
    public constructor() {
        super();
        this.skinName = "PKSkillItemSkin";
    }
    private mc: eui.Image;
    private rateBGMC: eui.Image;
    private rateMC: eui.Image;
    private selectMC: eui.Image;




    public childrenCreated() {
        super.childrenCreated();
        this.addBtnEvent(this,this.onClick)

    }

    private onClick(e){
        PKTowerUI.getInstance().showSkillInfo(this.data)
    }



    public dataChanged(){
        this.mc.source = 'skill_'+this.data.sid+'_jpg'
        this.selectMC.visible = false;
        this.setRateVisible(false);
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
        var cd = TC.getSkillCD(this.data.sid)
        if(cd)
        {
            this.setRateVisible(true);
            this.rateMC.height = Math.min(1,cd/this.data.maxCD)*80
        }
        else
        {
            this.setRateVisible(false);
        }

    }
}