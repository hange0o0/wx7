
class LoadingQueue {

    /**
     * 加载进度界面
     * loading process interface
     */
    //private loadingView:LoadingUI;
    private loadFiles:Array<string>;
    private callBack: any;
    private callBackTarget: any;
    private loadCount: number = 0;
    
    private loaderList: Array<any> = [];
    private loadReuslt: Object = new Object();

    public constructor() {
    }

    /*
     * array ['party', 'js_xxxxx'];
     */ 
    public load(array:Array<string>, callBack:any, callBackTarget:any):void {
        
        this.loadFiles = array;
        this.callBack = callBack;
        this.callBack = callBack;
        this.callBackTarget = callBackTarget;
        
        //设置加载进度界面
//        this.loadingView = new LoadingUI();
//        GameManager.stage.addChild(this.loadingView);
        this.startLoad();
    }
    
    private startLoad(){

        while(this.loaderList.length < 3 && this.loadCount <this.loadFiles.length) {

            this.loaderList.push( this.createLoader(this.loadFiles[this.loadCount]) );
            this.loadCount++;
        }
    }
    
    private createLoader(url:string):egret.URLLoader{
        var loader: egret.URLLoader = new egret.URLLoader();
        var type: string = url.substring(url.lastIndexOf(".")+1, url.length);
        var format: string;
        switch(type){
            case "json": 
                format = egret.URLLoaderDataFormat.TEXT;
                break;
            default:
                format = egret.URLLoaderDataFormat.TEXTURE;
        }
        loader.dataFormat = format;
        loader.addEventListener(egret.Event.COMPLETE,this.onLoadComplete,this);
        var request: egret.URLRequest = new egret.URLRequest(url);
        loader.load(request);
        
        return loader;
    }
    
    private onLoadComplete(e: egret.Event){
        var loader = <egret.URLLoader>e.currentTarget; 
        var url: string = loader._request.url;
        
        var type: string = url.substring(url.lastIndexOf(".") + 1,url.length);
        var format: string;
        switch(type) {
            case "json":
                this.loadReuslt[url] = JSON.parse(loader.data);
                break;
            default:
                this.loadReuslt[url] = loader.data;
        }
        
        for(var key in this.loaderList){
            if(this.loaderList[key] == e.currentTarget){
                this.loaderList[key].removeEventListener(egret.Event.COMPLETE,this.onLoadComplete,this);
            }
        }
        var num = ObjectUtil_wx4.objLength(this.loadReuslt);
        if(num == this.loadFiles.length){
            this.callBack.apply(this.callBackTarget,[this.loadReuslt]);
        }
        else
            this.startLoad();
    }

}


