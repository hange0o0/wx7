class RankItem extends game.BaseItem{

    private bg: eui.Rect;
    private headMC: eui.Image;
    private indexText: eui.Label;
    private nickText: eui.Label;
    private valueText: eui.Label;



    public constructor() {
        super();
        this.skinName = "RankItemSkin";
    }

    public childrenCreated() {
        super.childrenCreated();
    }

    public dataChanged():void {

        this.indexText.textColor = this.data.index < 4 ? 0xffffff : 0xcccccc;
        this.indexText.text = this.data.index;
        this.nickText.text = StringUtil.getStringByLength(this.data.nick,8)
        this.headMC.source = this.data.head
        this.valueText.text = '第 ' +this.data.value + ' 关'
    }


}