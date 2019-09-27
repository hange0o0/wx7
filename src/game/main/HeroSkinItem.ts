class HeroSkinItem extends game.BaseItem{
    public constructor() {
        super();
        this.skinName = "HeroSkinItemSkin";
    }

    private mc: eui.Image;
    private selectMC: eui.Image;



    private isHave = false
    public childrenCreated() {
        super.childrenCreated();
        this.addBtnEvent(this,()=>{
            if(this.isHave)
            {
                PKManager.getInstance().setHeroID(this.data)
            }
            else
            {
                ShareUnlockUI.getInstance().show(this.data,'解锁新皮肤','只需邀请一个好友新加入游戏，即可'+this.createHtml('永久拥有',0xFFFF00)+'该皮肤！')
            }
        })
    }

    public dataChanged():void {
        var myList = PKManager.getInstance().heroList;
        if(myList.indexOf(this.data) == -1)
        {
            this.mc.source = this.data + '_2_png'
            this.isHave = false
        }
        else
        {
            this.mc.source = this.data + '_1_png'
            this.isHave = true;
        }

        this.selectMC.visible = PKManager.getInstance().heroid == this.data
    }
}