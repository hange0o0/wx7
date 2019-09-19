class BasePanel extends game.BaseContainer_wx4 {
    public constructor() {
        super();
        this.skinName = "BasePanelSkin";
    }

    private nameText: eui.Label;
    private closeBtn: eui.Group;



    public relateMC
    public setTitle(title){
       this.nameText.text = title
    }

    public childrenCreated() {
        super.childrenCreated();
        this.addBtnEvent(this.closeBtn,()=>{
             this.relateMC && this.relateMC.hide();
        })
    }

    public setBottomHeight(v){
       //this.bottomGroup.height = v
    }
}