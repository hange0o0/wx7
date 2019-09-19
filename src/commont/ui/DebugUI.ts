class DebugUI extends game.BaseUI_wx4 {

    private static _instance:DebugUI;

    public static getInstance() {
        if (!this._instance) this._instance = new DebugUI();
        return this._instance;
    }

    private con: eui.Group;
    private backBtn: eui.Button;
    private desText: eui.Label;


    public debugTimer = 0;
    public debugOpen = false;
    public constructor() {
        super();
        this.skinName = "DebugUISkin";
    }

    public childrenCreated() {
        super.childrenCreated();
        this.addBtnEvent(this.backBtn,this.hide)


        this.addB('清除本地数据',()=>{
            MyWindow.Confirm('确定清除所有本地数据？',(b)=>{
                if(b==1)
                {
                     SharedObjectManager_wx4.getInstance().removeMyValue('localSave')
                }
            });
        })

        this.addB('清除公网数据',()=>{
            MyWindow.Confirm('确定清除所有公网数据？',(b)=>{
                if(b==1)
                {
                    var wx = window['wx'];
                    if(!wx)
                    {
                        MyWindow.ShowTips('只在公网生效')
                        return;
                    }
                    const db = wx.cloud.database();
                    db.collection('user').doc(UM_wx4.dbid).remove({
                        success(res) {
                            UM_wx4.needUpUser = false;
                            wx.exitMiniProgram();
                        }
                    })
                }
            });
        })


        this.addB('加10000钱',()=>{
            var coin = 10000
           UM_wx4.addCoin(coin)
            MyWindow.ShowTips('钱 + ' + NumberUtil_wx4.addNumSeparator(coin,2))
        })
        this.addB('加10000000000钱',()=>{
            var coin = 10000000000
           UM_wx4.addCoin(coin)
            MyWindow.ShowTips('钱 + ' + NumberUtil_wx4.addNumSeparator(coin,2))
        })

        this.addB('跳1关',()=>{
            UM_wx4.level ++;
            MyWindow.ShowTips('第'+UM_wx4.level+'关')
        })
        this.addB('跳10关',()=>{
            UM_wx4.level +=10;
            MyWindow.ShowTips('第'+UM_wx4.level+'关')
        })
        this.addB('降1关',()=>{
            UM_wx4.level --;
            MyWindow.ShowTips('第'+UM_wx4.level+'关')
        })
        this.addB('降10关',()=>{
            UM_wx4.level -=10;
            MyWindow.ShowTips('第'+UM_wx4.level+'关')
        })

        this.addB('加好友1',()=>{
            UM_wx4.shareUser[1] = !UM_wx4.shareUser[1]
            MyWindow.ShowTips(UM_wx4.shareUser[1])
        })

        this.addB('加好友2',()=>{
            UM_wx4.shareUser[2] = !UM_wx4.shareUser[2]
            MyWindow.ShowTips(UM_wx4.shareUser[2])
        })

        this.addB('胜一场',()=>{
            var result = PKManager.getInstance().getWinResult()
            PKManager.getInstance().endGame(result);
            PKManager.getInstance().endGame(result);
            PKManager.getInstance().endGame(result);
            MyWindow.ShowTips('OK')
        })

        this.addB('插屏广告',()=>{
            MyADManager.getInstance().showInsert()
        })
    }

    private addB(label,fun){
       var btn = new eui.Button();
        btn.skinName = 'Btn2Skin'
        btn.width = 190
        btn.label = label;
        this.con.addChild(btn);
        this.addBtnEvent(btn,fun);
    }

    public onShow(){
        var arr = [];
        arr.push('已经过游戏时间：' + DateUtil_wx4.getStringBySeconds(TM_wx4.now() - UM_wx4.loginTime))
        arr.push('当前时间：'+DateUtil_wx4.formatDate('yyyy-MM-dd hh:mm:ss',TM_wx4.chineseDate()))
        arr.push('实际时间：' + DateUtil_wx4.formatDate('yyyy-MM-dd hh:mm:ss',new Date()))
        this.desText.text = arr.join('\n')
    }

}