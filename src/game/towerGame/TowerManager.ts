class TowerManager extends egret.EventDispatcher {
    private static _instance:TowerManager;
    public static getInstance() {
        if (!this._instance) this._instance = new TowerManager();
        return this._instance;
    }

    public level = 1;

    public constructor(){
        super();

    }

    public getScale(ww,hh){
        ww = ww*64
        hh = hh*64

        var maxH = GameManager_wx4.uiHeight - 150 - 100
        var maxW = 640 - 100;
        var scale = Math.min(maxH/hh,maxW/ww);
        if(scale<1)
        {
            maxH += 100
            maxW += 100;
            scale = Math.min(maxH/hh,maxW/ww);
        }
        return scale;
    }



    public save(){

    }
}