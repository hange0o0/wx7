class ChangeGunItem extends game.BaseItem{

    private mc: eui.Image;
    private m0: eui.Image;
    private m1: eui.Image;
    private m2: eui.Image;
    private selectMC: eui.Image;
    private nameText: eui.Label;
    private rateBGMC: eui.Image;



    private mArr = []
    public constructor() {
        super();
        this.skinName = "ChangeGunItemSkin";
    }

    public childrenCreated() {
        super.childrenCreated();
        this.touchChildren = false
        this.mArr.push(this.m0)
        this.mArr.push(this.m1)
        this.mArr.push(this.m2)

    }

    public dataChanged():void {
        var vo = GunVO.getObject(this.data.id)
        this.mc.source = vo.getThumb();
        this.renewNum();
        this.setSelect();

        var enemys = [];
        var monsterList = DrawMapUI.getInstance().data.monsterArr;
        for(var i=0;i<vo.enemys.length;i++)
        {
            var mid = parseInt(vo.enemys[i])
            if(monsterList.indexOf(mid) != -1)
            {
                enemys.push(mid);
            }
        }

        for(var i=0;i<3;i++)
        {
            if(enemys[i])
            {
                this.mArr[i].visible = true;
                this.mArr[i].source = MonsterVO.getObject(enemys[i]).getThumb();
            }
            else
            {
                this.mArr[i].visible = false;
            }
        }
    }

    public setSelect(){
        this.selectMC.visible = this.data == ChangeGunUI.getInstance().list.selectedItem;
    }


    public renewNum(){
        var vo = GunVO.getObject(this.data.id)
        this.touchChildren = this.touchEnabled = this.data.num > 0
        this.rateBGMC.visible = this.data.num <= 0
        this.nameText.text = vo.name + ' x' + this.data.num

    }
}