class DebugManager {
    private static _instance:DebugManager;
    private static cd = 0
    public static getInstance():DebugManager {
        if (!this._instance)
            this._instance = new DebugManager();
        return this._instance;
    }

    public jumpPK = false;
    public stop = 0;
    public winCardArr = [];
    public finishFun = function(winArr){return false}


    public constructor() {

    }


    public printDetail = false;  //打印胜出怪物
    public winMonster = {}
    public winUseCard = []

    public outPut = []

    public callCost = 0
    public callLevel = 0
    public callNum = 0
    public repeatNum = 0

    public addTime = 0;
    public addTimeCD(t){
        this.addTime += t;
        SharedObjectManager_wx4.getInstance().setMyValue('addTime',this.addTime)


    }





}

//DM.testCard('1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16','1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16')
//DM.testMV('mv2',10,[30,31])
//javascript:DM.showAllMV();
//Net.send('clean_server')
//DM.test();
//DM.createHang(0,5);
//DM.stop = 1;