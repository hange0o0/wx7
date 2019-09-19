
module game {

    /**
    *  界面基类
    */
    export class BaseContainer_wx4 extends eui.Component {
        
        
        public constructor(skinName?:string) {
            super();
            
            if(skinName)
                this.skinName = skinName;
        }
                    
        public childrenCreated() {
        }
                    
        public partAdded(partName:string, instance:any):void {
            super.partAdded(partName, instance);
            instance.id = partName;

            //赋予btn图片按钮的行为
            if(instance instanceof eui.Image) {
                if(partName.toLowerCase().indexOf("btn") > -1) {
                }else{
                    instance.touchEnabled = false;
                }
            }
            else if(instance instanceof eui.Label){ //label不可交互
                instance.touchEnabled = false;
            }
        }
        //
        //public getImg(name:string):eui.Image{
        //    return <eui.Image>this[name];
        //}
        //
        //public getLabel(name: string): eui.Label {
        //    return <eui.Label>this[name];
        //}
        //
        //public getText(name: string): egret.TextField {
        //    return <egret.TextField>this[name];
        //}
        //
        //public getButton(name: string): eui.Button {
        //    return <eui.Button>this[name];
        //}
        //
        //public getItem(name: string): game.BaseItem {
        //    return <game.BaseItem>this[name];
        //}

                
        /*
        * 设置html  
        * this.setHtml(this.txt,"<font color=0xff0000>五23424</font>");
        */ 
        public setHtml(txt:eui.Label, str:string):void{
            txt.textFlow = new egret.HtmlTextParser().parser(str);
        }  
                
        /*
        * 给按钮添加事件  
        * this.addBtnEvent(this.btn, this.btnClick);
        */ 
        public addBtnEvent(btn: egret.DisplayObject, fun:any, thisObject?:any,stopAddSound?):void{
            btn.touchEnabled = true;
            btn.addEventListener(egret.TouchEvent.TOUCH_TAP,fun,thisObject || this);

            var btnName = (btn['id'] || '').toLocaleLowerCase();
            if(!stopAddSound && (btnName.indexOf('btn')!=-1 || btnName.indexOf('button')!=-1))
                SoundManager.getInstance().addBtnClickEffect(btn);
        }

        public createHtml(str:string | number, color?:number, size?:number):string{
            return MyTool.createHtml(str,color,size);
        }

        /*
        * 给按钮移除事件  
        * this.removeBtnEvent(this.btn, this.btnClick);
        */ 
        public removeBtnEvent(btn: egret.DisplayObject, fun:any, thisObject?:any):void{
            btn.removeEventListener(egret.TouchEvent.TOUCH_TAP, fun, thisObject || this);
        }

        public clearList(list:eui.List | Array<eui.List>){
            var lists:any = list;
            if(list instanceof eui.List){
                lists = [list];
            }
            for(var key in lists){
                try{
                    lists[key].dataProvider = null;
                    //必现调用下面2句，并且 需要在hide之前调用
                    lists[key].dataProviderRefreshed();
                }
                catch(e){
                }
            }
            this.validateNow();
        }
        
    }
    
    
    /**
    *  界面基类
    */
    export class BaseUI_wx4 extends game.BaseContainer_wx4 {
        
        public LoadFiles: Array<string>;//加载文件配置['party', 'js_xxxxx'];
        private isStartLoad: boolean = false;
        
        private static UIshowList: any = {};
        public BaseTypeList: Array<number> = [];//页面模块配置，主要用来控制全局调用
        public isInitUI: boolean = true;//是否已经初始化完皮肤
        
        private _arguments: Array<any>;
        private sizeList: Array<any> = [];

        public isWindow: boolean = false;
        public noMV: boolean = false;
        public isHideFlag:boolean = true;
        public canBGClose:boolean = false;


        public loadData = null;
        public loadUI = null;

        public hideBehind = true;

        public showFinishFunList = []; //显示成功后回调的方法

        private panelEvents: any = {};

        public isShowAD = false;
        public adBottom = 0;

        public baseX = 0
        public baseY = 0

        public constructor(isWindow?:boolean) {
            super();
            this.isWindow = isWindow;
            if(!this.isWindow)
                GameManager_wx4.stage.addEventListener(egret.Event.RESIZE,this.onResize,this);
        }
                    
                    
        public childrenCreated() {
            this.isInitUI = true;
            
            if(!this.isWindow)
                this.onResize(null);
            
//            if(this.parent){
//                this.addEventListener(egret.Event.ENTER_FRAME,this.createComplete,this);
//            }
        }
        private createComplete(e:egret.Event){
            this.removeEventListener(egret.Event.ENTER_FRAME,this.createComplete,this);
            if(this._arguments)
                this.onShow.apply(this,this._arguments);
            else
                this.onShow();

            this.runShowFinish();
        }

        private runShowFinish(){
            while(this.showFinishFunList.length > 0)
            {
                this.showFinishFunList.shift()();
            }
        }

        public addShowFinishFun(fun){
            this.showFinishFunList.push(fun);
        }
                    
        public partAdded(partName:string, instance:any):void {
            super.partAdded(partName, instance);
        }
                    
        /*public show(){
        eui.PopUpManager.addPopUp(this,true);
        this.verticalCenter = -700;
        egret.Tween.get(this).to({verticalCenter:0} , 500 , egret.Ease.backOut);
                            
        }*/

        public addPanelOpenEvent(type:string, callBack:Function){
            this.panelEvents[type] = callBack;
            EM_wx4.addEvent(type, callBack, this);
        }
            
        public addListenerSizeY(list:Array<any>):void{
            while(list.length > 0){
                this.sizeList.push({ui:list.pop(), type:"y"});
            }
        }
        public addListenerSizeH(list:Array<any>):void{
            while(list.length > 0){
                this.sizeList.push({ui:list.pop(), type:"h"});
            }
        }

        public resizeFun(){

        }
        public onVisibleChange(){

        }

        public onResize(e:Event):void{
//            console.log(GameManager.stage.stageWidth, GameManager.stage.stageHeight)
//            console.log(GameManager.stage.width, GameManager.stage.height)
            this.height = GameManager_wx4.uiHeight;
            var item: any;
            for(var i = 0;i < this.sizeList.length; i++){
                /*
                item = this.sizeList[i];
                if(item.type == "h"){
                    item.ui.height = GameManager.stage.stageHeight - item.ui.y;
                }
                else if(item.type == "y"){
                    item.ui.y = GameManager.stage.stageHeight - item.ui.height;
                }*/
            }

            this.scrollRect = new egret.Rectangle(0,0, GameManager_wx4.uiWidth, GameManager_wx4.uiHeight);
            if(GameManager_wx4.isLiuHai())
                this.y = 50
            else
                this.y = 0;
            //this.y = (GameManager.stage.stageHeight - GameManager.uiHeight)/2

            if(this.parent)
                this.resizeFun();
        }
            
        public cacheFunArguments(...argument:any[]):void{
            this._arguments = argument;
        }
                            
        public onShow(...argument:any[]):any{
            return this;      
        }
                        
                        		
        public show():any{

            if(this.LoadFiles && this.LoadFiles.length > 0){
                if(this.isStartLoad) return;
                this.isStartLoad = true;
                LoadingFile.getInstance().loadGroup(this.LoadFiles, this.showFun, this,this.loadUI,this.loadData);
                this.LoadFiles = [];
                return;
            }
            this.showFun();
            
            return this;
        }

        //public showToTop(){
        //    if(this.stage)
        //        PopUpManager.addPopUp(this,this.isWindow);
        //}

        
        private showFun():void{
            this.isStartLoad = false;
            
            if(this.BaseTypeList){
                for(var i=0; i<this.BaseTypeList.length; i++){
                    var _type = this.BaseTypeList[i];
                    if( !BaseUI_wx4.UIshowList[ _type ]){
                        BaseUI_wx4.UIshowList[ _type ] = [];
                    }
                    if(BaseUI_wx4.UIshowList[ _type ].indexOf(this) == -1)
                        BaseUI_wx4.UIshowList[ _type ].push(this);
                }
            }
            //1102
//            this.invalidateSkinState();
//            eui.PopUpManager.addPopUp(this,true);
            PopUpManager.addPopUp(this,this.isWindow,this.noMV);
            
            if(this.isInitUI){
                this.isHideFlag = false
                if(this._arguments)
                    this.onShow.apply(this,this._arguments);
                else
                    this.onShow();

                this.runShowFinish();
            }
            BaseUI_wx4.setStopEevent();
        }

        public isHide():boolean{
            return this.isHideFlag
        }
                    
        public hide():any{
            this.beforeHide();

            for(var key in this.panelEvents){
                EM_wx4.removeEvent(key, this.panelEvents[key], this);
            }

            if(this.BaseTypeList){
                for(var i=0; i<this.BaseTypeList.length; i++){
                    var _type = this.BaseTypeList[i];
                    var list = BaseUI_wx4.UIshowList[ _type ];
                    if( list ){
                        for(var j=list.length - 1; j>=0; j--){
                            if(list[j] == self)
                                list.splice(j, 1);
                        }
                    }
                }
            }

            this.isHideFlag = true;
            //1102
//            eui.PopUpManager.removePopUp(this);
//            this.validateSkinState();
            PopUpManager.removePopUp(this);
            return this;
        }
        
        private onAddToStage(event:egret.Event) {
            console.log(222);
        }
        
        // 批量关闭UI， 用法：this.BaseTypeList = [1, 2];
        // 1xxxx 2xxxx
        public static hideType = function(type){
            var list = BaseUI_wx4.UIshowList[type];
            if(list){
                for(var i=list.length-1; i>=0; i--){
                    list[i].hide();
                }
            }
        }
        
        //用来记录和判断一个界面打开后 禁止马上响应交互事件（最常见的是触摸屏幕关闭界面）
        private static openTime: number;
        public static get isStopEevent():boolean{
            return (Date.now() - BaseUI_wx4.openTime < 400); //面板打开后500秒内不响应交互事件（触摸、单击） 
        }
        
        public static setStopEevent() {
            BaseUI_wx4.openTime = Date.now();
        }
        
        public paySound(key:string, delay?:number):void{
            
        }



        public beforeHide(){

        }
                
    }
    
    /**
    *  界面基类
    */
    export class BaseWindow_wx4 extends game.BaseUI_wx4 {

        public constructor() {
            super(true);
            this.canBGClose = true;
        }

        public setTitle(title,h?){
            var bg:any = this.getChildAt(0)
            bg.setTitle(title);
            bg.relateMC = this;
            //if(h)
            //    bg.setBottomHeight(h);
        }
    }
    
    export class BaseItem extends eui.ItemRenderer {
        public constructor() {
            super();

        }

        public partAdded(partName:string, instance:any):void {
            super.partAdded(partName, instance);
            instance.id = partName;

            //赋予btn图片按钮的行为
            if(instance instanceof eui.Image) {
                if(partName.toLowerCase().indexOf("btn") > -1) {
                }else{
                    instance.touchEnabled = false;
                }
            }
            else if(instance instanceof eui.Label){ //label不可交互
                instance.touchEnabled = false;
            }
        }
        
        /*
        * 设置html  
        * this.setHtml(this.txt,"<font color=0xff0000>五23424</font>");
        */ 
        public setHtml(txt:eui.Label, str:string):void{
            txt.textFlow = new egret.HtmlTextParser().parser(str);
        }
                        
        /*
        * 给按钮添加事件
        * this.addBtnEvent(this.btn, this.btnClick);
        */
        public addBtnEvent(btn:eui.UIComponent, fun:any,stopSound?):void{
            btn.touchEnabled = true;
            btn.addEventListener(egret.TouchEvent.TOUCH_TAP, fun, this);

            if(!stopSound)
            {
                var btnName = (btn['id'] || '').toLocaleLowerCase();
                if(btnName.indexOf('btn')!=-1 || btnName.indexOf('button')!=-1)
                    SoundManager.getInstance().addBtnClickEffect(btn);
            }

        }

        public createHtml(str:string | number, color?:number, size?:number):string{
            return MyTool.createHtml(str,color,size);
        }
        /*
        * 给按钮移除事件
        * this.removeBtnEvent(this.btn, this.btnClick);
        */
        public removeBtnEvent(btn:eui.UIComponent, fun:any, thisObject?:any):void{
            btn.removeEventListener(egret.TouchEvent.TOUCH_TAP, fun, thisObject || this);
        }
                
    }

}
