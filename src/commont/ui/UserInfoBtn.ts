
class UserInfoBtn {

    private sourceBtn;
    private callFun:Function;
    private wx4_functionX_54769(){console.log(3398)}
    private parent:game.BaseUI_wx4;
    private okBtn;
    private isNew:string;

    public force = false;

    public constructor(btn, fun:Function, parent:game.BaseUI_wx4, url:string) {

        this.sourceBtn = btn;
        this.parent = parent;
        this.callFun = fun;

        this.isNew = url;

    }

    private wx4_functionX_54770(){console.log(6613)}
    private initBtn_5365(btnw, btnh, btnx, btny, imgUrl){
        if(!window['wx'])
            return;


        if(Config.isZJ)
        {
            this.okBtn = new eui.Image(imgUrl);
            this.okBtn.width = btnw
            this.okBtn.height = btnh
            this.okBtn.x = btnx
            this.okBtn.y = btny
            this.parent.addChild(this.okBtn)
            this.okBtn.addEventListener(egret.TouchEvent.TOUCH_TAP,() => {
                console.log('1111111111')
                window['wx'].authorize({
                    scope: "scope.userInfo",
                    success: (res)=>{
                        if((res.data && res.data['scope.userInfo'] == 'ok') || res['scope.userInfo'] == 'ok')
                        {
                            console.log(res)
                            window['wx'].getUserInfo({
                                success: (res) =>{
                                    this.callFun && this.callFun(res)
                                    //console.log(res)
                                },
                                fail:(res)=>{
                                    console.log(`getUserInfo调用失败`);
                                }
                            })
                        }
                        else
                        {
                            this.callFun && this.callFun(res)
                        }
                    },
                    fail:(res)=>{
                        if(this.force)
                        {
                            console.log(UM_wx4.loginSuccess,UM_wx4.gameid,UM_wx4.gameid2)
                            if(!UM_wx4.loginSuccess)
                            {
                                UM_wx4.getUserInfoZJ(()=>{
                                    this.openSetting();
                                },true)
                                return;
                            }
                            this.openSetting();
                            return;
                        }
                        this.callFun && this.callFun(res)
                        console.log(`authorize调用失败!`,res);
                    }
                })
            },this)
            return;
        }


        //if(RELEASE){
        //这里存在界面坐标、尺寸换算关系 width="180" height="60" bottom="40" x="230"
        // let btnw = 244, btnh = 71, btnx = 98, btny = 381;
        wx4_function(473);
        let scalex = screen.availWidth/640;
        let scaley = screen.availHeight/GameManager_wx4.stage.stageHeight;
        // let left = scalex * ((640-this.width)/2 + btnx);
        // let top = scaley * ((GameManagerHitPeng.uiHeight-this.height)/2 + btny + (AppF.isIOS ? 52 : 0));
        let left = scalex * (this.parent['baseX'] + btnx);
        let top = scaley * (this.parent['baseY'] + btny);
        let width = scalex * btnw;
        let height = scalex * btnh;
        wx4_function(412);

        var button = window["wx"].createUserInfoButton({
            type: 'image',
            image: '' + imgUrl,
            style: {
                left: left,
                top: top,
                width: width,
                height: height//,
                // lineHeight: height,
                // backgroundColor: '#d0e995',
                // color: '#526830',
                // textAlign: 'center',
                // fontSize: 16,
                // borderRadius: 20
            }
        })
        let self = this;
        wx4_function(5536);
        button.onTap((res) => {
            this.callFun && this.callFun(res)
        })



        return button;
        //}
    }

    private openSetting(){
        window['wx'].openSetting ({
            success: (res)=>{
                if(res.authSetting && res.authSetting['scope.userInfo'])//答应了
                {
                    window['wx'].getUserInfo({
                        success: (res) =>{
                            this.callFun && this.callFun(res)
                        }
                    })
                }
            }
        })
    }

    private wx4_functionX_54771(){console.log(9492)}
    public set visible(v:boolean){
        //console.log(v,this.isNew)
        if(v && this.isNew && !this.okBtn){
            let btn = this.sourceBtn;
            // console.log(btn.width, btn.height, btn.x, btn.y, btn.right, btn.bottom, this.parent.width, this.parent.height);
            if(Config.isWX)
            {
                if(!isNaN(btn.right))
                    btn.x = this.parent.width - btn.right - btn.width;
                if(!isNaN(btn.horizontalCenter))
                    btn.x = (this.parent.width - btn.width)/2;
                if(!isNaN(btn.bottom)){
                    btn.y = this.parent.height - btn.bottom - btn.height;
                    // console.log("111111111");
                }
            }

            this.okBtn = this.initBtn_5365(btn.width, btn.height, btn.x, btn.y, this.isNew);
        }
        //console.log(this.okBtn)
        if(!this.okBtn) return;

        if(Config.isZJ)
        {
            this.okBtn.visible = v;
            console.log('okbtn visible:',v)
            return;
        }


        if(v){
            this.sourceBtn.visible = false;
            this.okBtn.show();
            this.parent.once(egret.Event.REMOVED_FROM_STAGE, this.hide, this);
        }
        else{
            this.hide();
        }
    }

    private checkWindow_1023(e:egret.Event){
        if(e.data == this.parent) return;

        this.parent.hide();
    }

    public hide(){
        if(this.okBtn){
            this.okBtn.hide();
        }
        this.sourceBtn.visible = true;
    }
}