class LoadingUI extends game.BaseUI_wx4 {

    private static _instance:LoadingUI;

    public static getInstance():LoadingUI {
        if (!this._instance)
            this._instance = new LoadingUI();
        return this._instance;
    }


    private changeUser: ChangeUserUI;
    private startBtn: eui.Image;
    private loadText: eui.Label;


    private infoBtn:UserInfoBtn
    private haveGetInfo = false;
    private haveLoadFinish = false;
    private haveGetUser = false;
    private needShowStartBtn = false;

    public constructor() {
        super();
        this.skinName = "LoadingUISkin";
    }

    public childrenCreated() {
        super.childrenCreated();

        this.infoBtn = new UserInfoBtn(this.startBtn, (res)=>{
            this.renewInfo(res);
        }, this, Config.localResRoot + "wx_btn_info.png");
        this.infoBtn.visible = false;
        this.startBtn.visible = false;
    }

    private renewInfo(res?){
        var wx = window['wx'];
        if(!wx)
        {
            this.haveGetUser = true;

            //this.haveGetUser = false;
            //this.needShowStartBtn = true;

            this.initData();
            return;
        }
        if(res)
        {
            if(!res.userInfo)
            {
                //this.infoBtn.visible = false;
                if(UM_wx4.helpUser)
                {
                    wx.showModal({
                        title: '好友请求授权',
                        showCancel:true,
                        cancelText:'重新授权',
                        confirmText:'进入游戏',
                        content: '你是通过好友邀请进入的，不授权将无法完成该好友请求的帮助，是否继续？',
                        success: (res)=> {
                            if (res.confirm) {
                                this.infoBtn.visible = false;
                                this.haveGetUser = true;
                                this.initData();
                            }
                        }
                    })
                    //MyWindow.Confirm('你是通过好友邀请进入的，不授权将无法完成该好友请求的帮助，是否继续？',(b)=>{
                    //    if(b==1)
                    //    {
                    //        this.infoBtn.visible = false;
                    //        this.haveGetUser = true;
                    //        this.initData();
                    //    }
                    //    else
                    //    {
                    //        this.infoBtn.visible = true;
                    //    }
                    //},['重新授权','进入游戏']);
                    return;
                }
                this.infoBtn.visible = false;
                this.haveGetUser = true;
                this.initData();
                return;
            }
            this.infoBtn.visible = false;
            UM_wx4.renewInfo(res.userInfo)
            this.haveGetUser = true;
            this.initData();
            return;
        }
        wx.getSetting({
            success: (res) =>{
                console.log(res.authSetting)
                if(res.authSetting["scope.userInfo"])//已授权
                {
                    this.haveGetUser = true;
                    this.initData()
                    wx.getUserInfo({
                        success: (res) =>{
                            var userInfo = res.userInfo
                            UM_wx4.renewInfo(userInfo)
                        }
                    })
                }
                else
                {
                    this.needShowStartBtn = true;
                    this.initData()
                }
            }
        })
    }

    private initData(){
        if(this.haveLoadFinish && this.haveGetInfo && !this.haveGetUser && this.needShowStartBtn)
        {
            this.changeUser.renew()
            this.loadText.text = '点击屏幕进入游戏';
            this.needShowStartBtn = false;
            this.infoBtn.visible = true;
            return;
        }
        if(!this.haveLoadFinish || !this.haveGetInfo  || !this.haveGetUser)
            return;
        this.hide();
        this.infoBtn.visible = false;
        //GameUI.getInstance().show();

        GameTool.getInstance().preLoadMV();
        RES.loadGroup('hero');
        RES.loadGroup('monster');

        //GameUI.getInstance().show();
        //PKUI.getInstance().show();
        CreateListUI.getInstance().show();
    }

    public onShow(){
        var self = this;
        //ChangeUserUI.getAD();
        self.loadText.text = '正在加载素材，请耐心等候..'
        this.renewInfo();
        UM_wx4.getUserInfo(()=>{
            this.haveGetInfo = true;
            this.initData();
        });
        var wx =  window["wx"];
        if(wx)
        {
            const loadTask = wx.loadSubpackage({
                name: 'assets2', // name 可以填 name 或者 root
                success(res) {
                    self.callShow();
                    setTimeout(()=>{
                        self.changeUser.renew()
                    },5000)
                },
                fail(res) {
                }
            })

            loadTask.onProgressUpdate(res => {
                self.loadText.text = '正在加载素材..' + res.progress + '%'
            })
            return;
        }
        this.callShow();
    }

    private callShow(){
        this.loadText.text = '正在请求用户数据'
        if(this.needShowStartBtn)
        {
            this.haveLoadFinish = true;
            this.initData();
            return;
        }
        setTimeout(()=>{
            this.haveLoadFinish = true;
            this.initData();
        },1000)

    }
}