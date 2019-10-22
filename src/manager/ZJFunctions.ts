class ZijieScreenBtn extends game.BaseContainer_wx4{
    private img:eui.Image;
    public step:number;

    public startTime:number = 0;
    private videoPath:string;

    public static e:ZijieScreenBtn;

    public constructor() {
        super();
        ZijieScreenBtn.e = this;

        let img = this.img = new eui.Image();
        this.addChild(img);
        this.addBtnEvent(this.img, this.click);

        this.init();

        if(!window["tt"]) return;
        let self = this;
        const recorder = window["tt"].getGameRecorderManager();
        recorder.onStop(({ videoPath })=>{
            self.videoPath = videoPath;
            self.stopStat();
            /*recorder.clipVideo({
             path: videoPath,
             success(res){
             spritLog("TKYbNc5TRk88RZ8Nabz4JpDKdhaM");
             console.log(res.videoPath);
             self.videoPath = res.videoPath;
             self.stopStat();
             }
             })*/
        })
    }

    //录一段时间的屏
    public recordClip(time){
        if(!window["tt"]) return;
        const recorder = window["tt"].getGameRecorderManager();
        recorder.recordClip({timeRange: [0, time] })
    }

    private click():void{
        if(!window["tt"]) return;
        const recorder = window["tt"].getGameRecorderManager();
        switch(this.step){
            case 1://录制
                recorder.start({ duration: 120 });
                this.startStat();
                this.startTime = Date.now();

                // // 记录当前时刻前三秒，后三秒，支持多次调用
                //  recorder.recordClip({timeRange: [5, 5] })
                break;
            case 2://结束
                recorder.stop();
                break;
            case 3://发布
                this.publish();
                break;
        }
    }

    public publish(successFun?: Function, failFun?: Function){
        let canPublish = Date.now() - this.startTime > 3500;
        if(!canPublish){
            !failFun && MyWindow.ShowTips("发布失败，录像视频太短哦~");
            failFun && failFun();
            this.init();
            return;
        }
        if(DEBUG){
            successFun && successFun();
            return;
        }
        if(!this.videoPath) return; //正在等待生成
        let wordtype = 1;
        //if(shareArgs){
        //    let vo = CMSPT.wxsSet.getObject(shareArgs.ACT_TYPE);
        //    if(vo) wordtype = vo.source;
        //}
        // let svo = CMSPT.z_share.getOne(wordtype);
        //特殊分享类型，需要用数据填充
        //var cid = ChapterManager.getInstance().lastCid || 1;
        //var num = ChapterManager.getInstance().getTotalPassNum(cid);
        //let svo = CMSPT.z_share.getOne(wordtype, {level:cid, day: num});

        let self = this;
        var obj = {
            channel: "video",
            title: '疯狂割草' || "",
            imageUrl: Config.getShare(0) || "",
            //query: StringUtilSpir.join(shareArgs),
            extra:{
                videoPath: this.videoPath,
                videoTopics: ["游戏视频"],
                createChallenge: true
            },
            success () {
                console.log(`分享成功！`);
                successFun && successFun();
            },
            fail (e) {
                MyWindow.ShowTips("发布失败~");
                console.log(`分享失败！`);
                failFun && failFun();
            },
            complete (e){
                self.init();
            }
        }
        window["wx"].shareAppMessage(obj);

        //抖音发布视频没有回调, 500ms后自动触发
        /*if(ZijieFunction.isDouYin && !ConfigSPT.appData["zj_dy_can_shareBack"]){
         egret.setTimeout(()=>{
         self.init();
         spritLog("2GJrMDzxJK6ji5wR4QTTaztj2Z3Xj");
         successFun && successFun();
         }, this, 500);
         }*/
    }

    public init(){
        // this.img.source = ConfigSPT.localResRoot + "zijie/a1.png";

        this.startTime = 0;
        this.step = 1;
    }

    private startStat(){
        // this.img.source = ConfigSPT.localResRoot + "zijie/a2.png";

        this.step = 2;
    }

    private stopStat(){
        // this.img.source = ConfigSPT.localResRoot + "zijie/a3.png";

        this.step = 3;
    }

    public stop(){
        // console.log("stop")
        if(!window["tt"]) return;
        const recorder = window["tt"].getGameRecorderManager();
        recorder.stop();
    }

    public start(){
        // console.log("start")
        if(this.step == 2) return; //正在录屏，无需再start了

        this.init();
        this.click();
    }

    //录屏时间
    public checkScreenLength(){
        if(!this.startTime) return false;
        return Date.now() - this.startTime >= 10000; //本游戏最少10秒
    }

    public awardPublish(coin,fun:Function){
        this.publish(()=>{
            UM_wx4.addCoin(coin);
            MyWindow.ShowTips('发布成功，获得金币：'+MyTool.createHtml('+' + NumberUtil_wx4.addNumSeparator(coin,2),0xFFFF00),1000)
            fun && fun();
        })
    }

}