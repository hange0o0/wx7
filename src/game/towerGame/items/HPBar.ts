class HPBar extends game.BaseItem{
    public constructor() {
        super();
        this.skinName = "HPBarSkin";
    }

    public barMC: eui.Image;
    public hpText: eui.BitmapLabel;

    public childrenCreated() {
        super.childrenCreated();
    }


    public dataChanged(){
        var hp = this.data.hp;
        if(hp < 0)
            hp = 0
        var rate = hp/this.data.maxHp
        this.hpText.text = hp
        this.barMC.width = 69 * rate
    }

}