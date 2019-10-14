class UCMapListItem extends game.BaseItem{
    public constructor() {
        super();
        this.skinName = "UCMapListItemSkin";
    }

    private headMC: eui.Image;
    private btn: eui.Button;
    private needCoinText: eui.Label;
    private awardText: eui.Label;
    private titleText: eui.Label;
    private desText: eui.Label;
    private nameText: eui.Label;




    public childrenCreated() {
        super.childrenCreated();
        this.addBtnEvent(this.btn,this.onClick)
    }

    private onClick(){
        if(this.btn.label == '领取')
        {

        }
        else if(this.btn.label == '分享')
        {

        }
        else if(this.btn.label == '挑战')
        {

        }
    }


    public dataChanged(){
        this.headMC.source = this.data.head
        this.awardText.text = '' + this.data.coin
        this.nameText.text = StringUtil.getStringByLength(this.data.nick,5)
        this.titleText.text = this.data.title
        this.desText.text = '挑战人数：' + (this.data.time || 0)

        if(this.data.gameid == UM_wx4.gameid)
        {
            this.currentState = 's2'
            if(TM_wx4.now() - this.data.time > 48*3600)
                this.btn.label = '领取'
            else
                this.btn.label = '分享'
        }
        else
        {
            this.needCoinText.text = Math.ceil(this.data.coin/10) + ''
            this.currentState = 's1'
            this.btn.label = '挑战'
        }

    }

}