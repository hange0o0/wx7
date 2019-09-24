/**
 *
 * @author 
 *
 */
class PopUpManager {
    public static shape:eui.Image;
	public constructor() {
	}

    public static movieChange(oldWindow,newWindow,rota){
        this.removeShape();
        //MyTool.upMC(oldWindow)
        //MyTool.upMC(newWindow)
        newWindow.x = rota*640;
        oldWindow.visible = true
        newWindow.visible = true;
        egret.Tween.removeTweens(oldWindow);
        egret.Tween.removeTweens(newWindow);
        var tw:egret.Tween = egret.Tween.get(oldWindow);
        tw.to({x:-rota*640},300).call(function(){
            oldWindow.hide();
        },this)
        var tw:egret.Tween = egret.Tween.get(newWindow);
        tw.to({x:0},300)
    }

    public static removeShape(){
        MyTool.removeMC(this.shape);
    }
	
    public static addPopUp(display: egret.DisplayObject,isWindow:boolean,noMV? ){
        var haveShow = display.stage && display.visible;
        var ww = GameManager_wx4.container.width;
        var hh = GameManager_wx4.container.height;
        if(!this.shape)
        {
            this.shape = new eui.Image('black_bg_alpha_png');
            this.shape.width = 640;
            //this.shape.fillColor = 0;
            //this.shape.fillAlpha = 0.8;

            this.shape.top = 0
            this.shape.bottom = 0
            this.shape.touchEnabled = true;
            this.shape.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onTap,this)
        }
        var shape = this.shape;
        if(isWindow)
            GameManager_wx4.container.addChild(shape);
        GameManager_wx4.container.addChild(display);
        this.testVisible();
        if(isWindow) {
//            console.log(display.width,display.height);
//            display.x = (ww - display.width) / 2;
//            display.y = (hh - display.height) / 2;
            if(!haveShow)
                display.alpha = 0
            display.addEventListener(egret.Event.ENTER_FRAME,onEnterFrame,this);
        }

        var marginY = display['isShowAD']?100:0
        function onEnterFrame() {
            display.removeEventListener(egret.Event.ENTER_FRAME,onEnterFrame,this);
            
//            console.log(display.width,display.height);
            var x = display['baseX'] = (ww - display.width) / 2;
            var y = display['baseY'] = (hh - display.height) / 2 - marginY;
            var x2 = (ww - display.width*1.1) / 2;
            var y2 = (hh - display.height*1.1) / 2;
            display.alpha = 1;
            display.visible = true
            if(noMV || haveShow)
            {
                display.scaleX = 1;
                display.scaleY = 1
                display.x = x
                display.y = y
            }
            else
            {
                display.alpha = 0;
                display.scaleX = 0.6;
                display.scaleY = 0.6
                display.x = (ww - display.width*0.6) / 2;
                display.y = (hh - display.height*0.6) / 2;
                var tw = egret.Tween.get(display);
                tw.to({
                    alpha:1,
                    scaleX:1.1,
                    scaleY:1.1,
                    x:x2,
                    y:y2
                },150).to({
                    scaleX:1,
                    scaleY:1,
                    x:x,
                    y:y
                },150).call(()=>{
                    display['showFinish'] && display['showFinish']()
                })
            }

        }
    }

    public static setMiddle(display){
        var ww = GameManager_wx4.container.width;
        var hh = GameManager_wx4.container.height;
        var x = (ww - display.width) / 2;
        var y = (hh - display.height) / 2;
        display.x = x
        display.y = y
    }

    private static onTap(){
         var ui:game.BaseUI_wx4 = <game.BaseUI_wx4>this.shape.parent.getChildAt(this.shape.parent.numChildren-1);
        if(ui.canBGClose)
        {
            ui.hide();
        }
    }

    public static removePopUp(display: egret.DisplayObject) {
        if(display.parent) {
            var index = display.parent.getChildIndex(display);
            //GameManager.container.removeChildAt(index - 1);
            display.parent.removeChild(display);
            this.testShape();
            this.testVisible();
        }
    }

    public static testShape(strong?){
        if(this.shape.parent || strong)
        {
            MyTool.removeMC(this.shape)
            //找到最上一个BaseUI,放到其下方
            for(var i=GameManager_wx4.container.numChildren-1 ;i>=0;i--)
            {
                var ui = GameManager_wx4.container.getChildAt(i);
                if(ui instanceof game.BaseUI_wx4)
                {
                    if(ui.isWindow)
                        GameManager_wx4.container.addChildAt(this.shape,i)
                    return
                }
            }

        }
    }

    public static testVisible(){
        var setVisible = false;
        var testAD = false
        MyADManager.getInstance().hideBanner();
        for(var i=GameManager_wx4.container.numChildren-1 ;i>=0;i--)
        {
            var ui = GameManager_wx4.container.getChildAt(i);
            if(ui instanceof game.BaseUI_wx4)
            {
                if(!testAD)
                {
                    testAD = true;
                    if(ui.isShowAD)
                    {
                        MyADManager.getInstance().showBanner(ui.adBottom);
                    }
                }
                var lastVisible = ui.visible;
                if(!setVisible)
                {
                    ui.visible = true;
                    if(!ui.isWindow && ui.hideBehind)
                        setVisible = true;
                }
                else
                    ui.visible = false;
                if(lastVisible != ui.visible)
                    ui.onVisibleChange()
            }
        }
    }

    public static showToMain(){
        while(true)
        {
            for(var i=GameManager_wx4.container.numChildren-1 ;i>=0;i--)
            {
                var ui = GameManager_wx4.container.getChildAt(i);
                if(ui instanceof game.BaseUI_wx4)
                {
                    //if(ui == MainPageUI.getInstance())
                    //{
                    //    return;
                    //}
                    ui.hide();
                    break;
                }
            }
        }
    }


    public static hideAll(){
        while(true)
        {
            var isHide = false
            for(var i=GameManager_wx4.container.numChildren-1 ;i>=0;i--)
            {
                var ui = GameManager_wx4.container.getChildAt(i);
                if(ui instanceof game.BaseUI_wx4)
                {
                    if(ui == GameUI.getInstance())
                    {
                        isHide = true;
                        break;
                    }
                    ui.hide();
                    break;
                }
            }
            if(isHide)
                return;
        }
    }
}
