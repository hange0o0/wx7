class UCMapSetUI extends game.BaseWindow_wx4 {

    private static _instance: UCMapSetUI;
    public static getInstance(): UCMapSetUI {
        if(!this._instance)
            this._instance = new UCMapSetUI();
        return this._instance;
    }

    private nameText: eui.EditableText;
    private wDecBtn: eui.Button;
    private widthText: eui.EditableText;
    private wAddBtn: eui.Button;
    private hDecBtn: eui.Button;
    private heightText: eui.EditableText;
    private hAddBtn: eui.Button;
    private hardDecBtn: eui.Button;
    private hardText: eui.EditableText;
    private hardAddBtn: eui.Button;
    private cancelBtn: eui.Button;
    private okBtn: eui.Button;




    private change = false
    public constructor() {
        super();
        this.skinName = "UCMapSetUISkin";
        this.canBGClose = false
    }

    public childrenCreated() {
        super.childrenCreated();
        this.setTitle('设置地图')


        this.addBtnEvent(this.okBtn,()=>{
            UCMapUI.getInstance().resetData(
                parseInt(this.widthText.text),
                parseInt(this.heightText.text),
                parseInt(this.hardText.text),
                this.nameText.text
            );
        })

        this.addBtnEvent(this.cancelBtn,this.hide)


        this.addBtnEvent(this.wAddBtn,()=>{
            var w = parseInt(this.widthText.text);
            w ++;
            if(w > 10)
                w = 10
            this.widthText.text = '' + w
            this.change = true;
        })

        this.addBtnEvent(this.wDecBtn,()=>{
            var w = parseInt(this.widthText.text);
            w --;
            if(w < 5)
                w = 5;
            this.widthText.text = '' + w
            this.change = true;
        })

        this.widthText.addEventListener(egret.Event.CHANGE,()=>{
            var w = parseInt(this.widthText.text);
            if(w > 10)
                w = 10
            if(w < 5)
                w = 5;
            this.widthText.text = '' + w
            this.change = true;
        },this)



        this.addBtnEvent(this.hAddBtn,()=>{
            var w = parseInt(this.heightText.text);
            w ++;
            if(w > 15)
                w = 15
            this.heightText.text = '' + w
            this.change = true;
        })

        this.addBtnEvent(this.hDecBtn,()=>{
            var w = parseInt(this.heightText.text);
            w --;
            if(w < 5)
                w = 5;
            this.heightText.text = '' + w
            this.change = true;
        })

        this.heightText.addEventListener(egret.Event.CHANGE,()=>{
            var w = parseInt(this.heightText.text);
            if(w > 15)
                w = 15
            if(w < 5)
                w = 5;
            this.heightText.text = '' + w
            this.change = true;
        },this)



        this.addBtnEvent(this.hardAddBtn,()=>{
            var w = parseInt(this.hardText.text);
            w ++;
            if(w > 100)
                w = 100
            this.hardText.text = '' + w
            this.change = true;
        })

        this.addBtnEvent(this.hardDecBtn,()=>{
            var w = parseInt(this.hardText.text);
            w --;
            if(w < 0)
                w = 0;
            this.hardText.text = '' + w
            this.change = true;
        })

        this.hardText.addEventListener(egret.Event.CHANGE,()=>{
            var w = parseInt(this.hardText.text);
            if(w > 100)
                w = 100
            if(w < 0)
                w = 0;
            this.hardText.text = '' + w
            this.change = true;
        },this)


        this.nameText.addEventListener(egret.Event.CHANGE,()=>{
            this.change = true;
        },this)


    }

    public show(){
        super.show()
    }

    public hide() {
        super.hide();
    }

    public onShow(){
        this.change = false;
        this.renew();
    }


    public renew(){
        var ui = UCMapUI.getInstance();
        this.nameText.text = '' + ui.title
        this.hardText.text = '' + ui.hard
        this.widthText.text = '' + ui.ww
        this.heightText.text = '' + ui.hh
    }

}