class GameTool extends egret.EventDispatcher {

    private static _instance:GameTool;
    public static getInstance():GameTool {
        if (!GameTool._instance)
            GameTool._instance = new GameTool();
        return GameTool._instance;
    }

    public preLoadMV(){
         var idObj = {};
        //for(var s in MonsterVO.data)
        //{
        //    if(MonsterVO.data[s].mvid)
        //        idObj[MonsterVO.data[s].mvid] = true;
        //}
        //for(var s in idObj)
        //{
            //AniManager_wx3.getInstance().preLoadMV(8)
            //AniManager_wx3.getInstance().preLoadMV(103)
            //AniManager_wx3.getInstance().preLoadMV(112)
            //AniManager_wx3.getInstance().preLoadMV(128)
            //AniManager_wx3.getInstance().preLoadMV(200)
        //}
    }
}