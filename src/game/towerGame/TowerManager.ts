class TowerManager extends egret.EventDispatcher {
    private static _instance:TowerManager;
    public static getInstance() {
        if (!this._instance) this._instance = new TowerManager();
        return this._instance;
    }

    public constructor(){
        super();

    }



    public save(){

    }
}