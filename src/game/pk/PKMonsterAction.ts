class PKMonsterAction_wx3 {
    private static instance:PKMonsterAction_wx3;

    public static getInstance() {
        if (!this.instance) this.instance = new PKMonsterAction_wx3();
        return this.instance;
    }

    private atkList = [];

    public addList(data){
        this.atkList.push(data)
    }

    public init(){
        this.atkList.length = 0;
    }

    public actionAtk(){
        for(var i=0;i<this.atkList.length;i++)
        {
            var data = this.atkList[i];
            data.step--;
            if(data.step <= 0)  //事件生效
            {

                this.atkList.splice(i,1);
                i--;

                if(data.onlyID == data.target.onlyID) //不一样的话代表怪物变了
                {
                    data.fun && data.fun();
                }


            }
        }
    }


}