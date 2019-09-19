class Net extends egret.EventDispatcher{
    private static instance: Net;
    public static getInstance() {
        if(!this.instance) this.instance = new Net();
        return this.instance;
    }

    public constructor() {
        super();
    }

    public send(url,msg){
        var loader = new egret.URLLoader();
        loader.dataFormat = egret.URLLoaderDataFormat.TEXT;
        loader['msg'] = msg;
        var request = new egret.URLRequest(url);
        request.method = egret.URLRequestMethod.POST;
        var variables = new egret.URLVariables('a=1');
        var oo:any = {};
        oo.msg = JSON.stringify(msg);
        variables.variables = oo;
        request.data = variables;
        if(Config.isDebug )
        {
            console.log('send===>      '+JSON.stringify(msg) +'   '+TM_wx4.now());
        }
        loader.load(request);
    }


    private refresh(){
        location.reload();
    }

    private addLoading(){
        MsgingUI.getInstance().show();
    }

    private removeLoading(){
        MsgingUI.getInstance().hide();
    }
}