class M36 extends MBase{
    //牛头人      一次复活
    constructor() {
        super();
    }

    private reborned  = false;

    public onDie(){
        if(this.reborned)
            return

        var mData = MTool.addNewMonster({mid:36,x:this.x,y:this.y})
        mData.reborned = true;
        AniManager_wx3.getInstance().playInItem(128,this.relateItem,{
            x:50,
            y:300 - this.getVO().height*0.4
        })
    }
}