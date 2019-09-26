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


    public downLoadBtn
    public upLoadBtn
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


        this.addB('加1000000钱',()=>{
            var coin = 1000000
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

        this.addB('加好友',()=>{
            for(var i=0;i<20;i++)
            {
                UM_wx4.shareUser[i] = 1
            }

            MyWindow.ShowTips('加好友')
        })


        this.addB('插屏广告',()=>{
            MyADManager.getInstance().showInsert()
        })

        var dataBtn = this.addB('加载本地数据',()=>{
            var txt = egret.localStorage.getItem('levelData');
            if(txt)
            {
                var arr = txt.split('\n')
                arr.shift();
                CM_wx4.initData(arr.join('\n'),'level');
            }
            MyWindow.ShowTips('OK')
            dataBtn.label = '加载缓存数据OK'
            dataBtn.touchEnabled = false
            dataBtn.touchChildren = false
            dataBtn.skinName = 'Btn1Skin'
        })

        this.downLoadBtn = this.addB('下载数据',()=>{

            this.downLoadData((txt)=>{
                LevelVO.clear();
                var arr = txt.split('\n')
                arr.shift();
                CM_wx4.initData(arr.join('\n'),'level');

                MyWindow.ShowTips('OK')
                this.downLoadBtn.label = '下载数据OK'
                this.downLoadBtn.touchEnabled = false
                this.downLoadBtn.touchChildren = false
                this.downLoadBtn.skinName = 'Btn1Skin'

                this.upLoadBtn.touchEnabled = true
                this.upLoadBtn.skinName = 'Btn2Skin'
            })
        })

        this.upLoadBtn = this.addB('上传数据',()=>{
            var str = egret.localStorage.getItem('levelData');
            if(!str)
            {
                MyWindow.Alert('没有数据')
                return;
            }
            var url = 'https://www.hangegame.com/error_wx7/log_map.php'
            Net.getInstance().send(url,{str:str});
            MyWindow.ShowTips('已发送服务器')
        })
        this.upLoadBtn.touchEnabled = false
        this.upLoadBtn.touchChildren = false
        this.upLoadBtn.skinName = 'Btn1Skin'

        this.addB('复制数据',()=>{
            var str = egret.localStorage.getItem('levelData');
            if(!str)
            {
                MyWindow.Alert('没有数据')
                return;
            }
            MyTool.copyStr(str)
        })

        this.addB('地图列表',()=>{
            CreateListUI.getInstance().show();
        })

        this.addB('设计地图',()=>{
            CreateMapUI.getInstance().show();
        })
    }

    private addB(label,fun){
       var btn = new eui.Button();
        btn.skinName = 'Btn2Skin'
        btn.width = 190
        btn.label = label;
        this.con.addChild(btn);
        this.addBtnEvent(btn,fun);
        return btn
    }

    public onShow(){
        var arr = [];
        arr.push('已经过游戏时间：' + DateUtil_wx4.getStringBySeconds(TM_wx4.now() - UM_wx4.loginTime))
        arr.push('当前时间：'+DateUtil_wx4.formatDate('yyyy-MM-dd hh:mm:ss',TM_wx4.chineseDate()))
        arr.push('实际时间：' + DateUtil_wx4.formatDate('yyyy-MM-dd hh:mm:ss',new Date()))
        this.desText.text = arr.join('\n')
    }

    public downLoadData(fun){
        var url = 'https://www.hangegame.com/error_wx7/get_map.php'
        RES.getResByUrl(url, (data, url)=>{
            if(data)
            {
                fun && fun(data)
            }
            else
            {
                MyWindow.Alert('下载数据失败')
            }

        }, this, RES.ResourceItem.TYPE_TEXT);
    }

}