class GunListItem extends game.BaseItem{

    private mc: eui.Image;
    private levelText: eui.Label;
    private lockGroup: eui.Group;





    public constructor() {
        super();
        this.skinName = "GunListItemSkin";
    }

    public childrenCreated() {
        super.childrenCreated();
        this.addBtnEvent(this,this.onClick)

    }

    private onClick(){
        var GM = GunManager.getInstance();
        if(this.lockGroup.visible)
        {
            if(DEBUG)
            {
                GM.addGun(this.data.id);
                return;
            }
            ShareTool.openGDTV(()=>{
                GM.addGun(this.data.id)
            })

        }
        else
        {
            GM.useGun(this.data.id)
        }
    }

    public dataChanged():void {
        var GM = GunManager.getInstance();
        var vo:GunVO = this.data
        this.lockGroup.visible = !GM.isHaveGun(vo.id)

        this.mc.source = vo.getThumb()
        this.levelText.text = this.lockGroup.visible?'': vo.name

        this.currentState = GM.gunid == vo.id?'choose':'normal'
    }



}