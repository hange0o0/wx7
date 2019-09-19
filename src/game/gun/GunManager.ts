class GunManager extends egret.EventDispatcher {
    private static _instance:GunManager;
    public static getInstance() {
        if (!this._instance) this._instance = new GunManager();
        return this._instance;
    }

    public myGun = []
    public gunid = 1;

    public initData(data){
        var gunData = data || {};
        this.myGun = gunData.myGun?gunData.myGun.split(','):['1']
        this.gunid = _get['gunid'] || gunData.gunid || 1;
    }

    public getSave(){
        return {
            myGun:this.myGun.join(','),
            gunid:this.gunid
        }
    }

    public isHaveGun(id){
        return this.myGun.indexOf(id+'')  != -1;
    }

    public addGun(id){
        if(!this.isHaveGun(id))
        {
            SoundManager.getInstance().playEffect('unlock')
            this.gunid = id;
            this.myGun.push(id+'')
            UM_wx4.needUpUser = true;
            EM_wx4.dispatchEventWith(GameEvent.client.GUN_CHANGE)
        }
    }

    public useGun(id){
        this.gunid = id;
        UM_wx4.needUpUser = true;
        EM_wx4.dispatchEventWith(GameEvent.client.GUN_CHANGE)
    }

    public getUnlockNum(){
        return Math.min(50,5 + Math.floor(UM_wx4.level/3)*2);
    }

}