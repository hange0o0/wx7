class PKSkillItem extends game.BaseItem{
    public constructor() {
        super();
        this.skinName = "PKSkillItemSkin";
    }
    private mc: eui.Image;
    private rateBGMC: eui.Image;
    private rateMC: eui.Image;
    private selectMC: eui.Image;
    private videoMC: eui.Image;





    public childrenCreated() {
        super.childrenCreated();
        this.addBtnEvent(this,this.onClick)
        this.videoMC.visible = false;

    }

    private onClick(e){
        PKTowerUI.getInstance().showSkillInfo(this.data)
    }



    public dataChanged(){
        this.mc.source = 'skill_'+this.data+'_jpg'
        this.selectMC.visible = false;
        this.setRateVisible(false);
    }

    public setSelect(data){
        this.selectMC.visible = this.data == data;
        this.videoMC.visible = this.rateMC.visible && this.selectMC.visible;
    }

    public setRateVisible(b){
        this.rateMC.visible = b;
        this.rateBGMC.visible = b;
        this.videoMC.visible = this.rateMC.visible && this.selectMC.visible;
    }

    public onE(){
        if(!this.data)
            return;
        var cd = TC.getSkillCD(this.data);
        if(cd)
        {
            this.setRateVisible(true);
            this.rateMC.height = Math.min(1,cd/TC.skillBase[this.data].cd/TC.frameRate)*80
        }
        else
        {
            this.setRateVisible(false);
        }

    }
}