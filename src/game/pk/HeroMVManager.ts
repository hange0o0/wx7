class HeroMVManager{

    private static instance: HeroMVManager;
    public static getInstance():HeroMVManager {
        if (!this.instance)
            this.instance = new HeroMVManager();
        return this.instance;
    }


    private _mcFactorys:Object;


    constructor(){
        this._mcFactorys = {};
    }

    public getFactory(id){
        if(this._mcFactorys[id])
            return this._mcFactorys[id];
        var data:any = RES.getRes(id+'_json'); //qid
        var texture:egret.Texture = RES.getRes(id+'_png');
        if(data && texture)
        {
            var mcFactory:egret.MovieClipDataFactory = new egret.MovieClipDataFactory(data, texture);
            mcFactory.enableCache = true;
            this._mcFactorys[id] = mcFactory;
            return mcFactory;
        }
        return null
    }
}