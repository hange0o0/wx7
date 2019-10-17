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
            UCMapManager.getInstance().getAward(this.data._id,()=>{

            });
        }
        else if(this.btn.label == '分享')
        {
            ShareTool.share('我设计了一个新地图，要来挑战一下吗？',Config.getShare(0),{type:2,nick:UM_wx4.nick,id:this.data._id},()=>{

            },true)
        }
        else if(this.btn.label == '挑战')
        {
            var needCoin = Math.ceil(this.data.coin/10);
            MyWindow.Confirm('确定花费'+this.createHtml(needCoin,0xFFFF00)+'金币开始挑战？',(b)=>{
                if(b == 1)
                {
                    if(!UM_wx4.checkCoin(needCoin))
                        return;
                    UM_wx4.addCoin(-needCoin);
                    TC.isTest = 3
                    var vo = new LevelVO();
                    for(var s in this.data)
                    {
                        vo[s] = this.data[s];
                    }
                    vo.reset(this.data.monsterArr)
                    DrawMapUI.getInstance().show(vo);
                    UCMapManager.getInstance().pkMap(this.data._id,needCoin);
                }
            })


        }
    }


    public dataChanged(){
        this.headMC.source = this.data.head
        this.awardText.text = '' + this.data.coin
        this.nameText.text = StringUtil.getStringByLength(this.data.nick,5)
        this.titleText.text = this.data.title
        this.desText.text = '挑战人数：' + (this.data.pkNum || 0)

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