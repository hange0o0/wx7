/**
 *
 * @author
 *
 */
class SharedObjectManager_wx4 {
    public constructor() {
    }

    private static _instance: SharedObjectManager_wx4;
    public static getInstance():SharedObjectManager_wx4{
        if(!SharedObjectManager_wx4._instance)
            SharedObjectManager_wx4._instance = new SharedObjectManager_wx4();
        return SharedObjectManager_wx4._instance;
    }

    private getUserSign():string{
        return UM_wx4.gameid;
    }

    public setMyValue(key:string,value:any){
        key = this.getUserSign() + "_" + key;
        this.setValue(key,value);
    }

    public getMyValue(key:string):any{
        key = this.getUserSign() + "_" + key;
        return this.getValue(key);
    }

    public removeMyValue(key:string) {

        key = this.getUserSign() + "_" + key;
        egret.localStorage.removeItem(key);
    }

    public setValue(key:string,value:any) {

        var data:any = {};
        data.data = value;
        data = JSON.stringify(data);
        egret.localStorage.setItem(key, data);
        //console.log('setValue',key,data)
    }

    public getValue(key:string):any {
        let value = egret.localStorage.getItem(key);
        //console.log('getValue',key,value)
        if(!value)
            return null;
        var data = JSON.parse(value);
        return data.data;
    }
}
