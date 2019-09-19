/**
 * 简化版 MovieClip(素材是多张图，通过设置不同图片实现动画)
 * @author
 */
class MovieSimpleSpirMC extends eui.Group{
    public static pool = [];
    public static create(){
        var item =  this.pool.shift() || new MovieSimpleSpirMC()
        return item
    }
    public icon: eui.Image;
    private list: Array<string>;
    public current: number = 0;
    private max: number;

    public sleepFrame:number = 0;//一个循环后停止多少帧播放下一次
    public currSleep:number = 0;
    private playTimes:number;
    private loopIndex:number = 0;
    public isLoop = false;

    private timeID: egret.Timer;



    public constructor() {
        super();
        this.icon = new eui.Image();
        this.icon.x = 0;
        this.icon.y = 0;
        this.addChild(this.icon)

        return this;
    }

    public setData(data:Array<string>, millisecond?:number, sleepFrame?:number)
    {
        this.setList(data);
        this.sleepFrame = sleepFrame || 0;
        this.currSleep = 0;
        if(!this.timeID){
            this.timeID = new egret.Timer(millisecond || 42,0);//24帧每秒
            this.timeID.addEventListener(egret.TimerEvent.TIMER,this.updateTime,this);
        }
    }

    public renewTimer(millisecond=0)
    {
        if(this.timeID)
        {
            this.timeID.stop()
            this.timeID.removeEventListener(egret.TimerEvent.TIMER,this.updateTime,this);
            this.timeID = null
        }
        this.timeID = new egret.Timer(millisecond || 42,0);//24帧每秒
        this.timeID.addEventListener(egret.TimerEvent.TIMER,this.updateTime,this);
    }
    public setTimer(v){
        if(this.timeID.delay != v)
            this.timeID.delay = v;
    }

    public play(){
        if(this.list.length == 1){
            this.icon.source = this.list[0];
            this.stop();
            return;
        }
        this.currSleep = 0;
        this.timeID.start();
        return this;
    }

    public stop(){
        this.timeID && this.timeID.stop();
    }

    //playTimes 播放次数，-1表示循环
    //loopIndex 循环播放的起始帧，默认是0
    public gotoAndPay(value:number=0, playTimes:number=0,loopIndex=0){
        this.current = value;
        this.playTimes = playTimes;
        if(this.playTimes == 0)
        {
            this.isLoop = true
            this.loopIndex = loopIndex
        }
        else
        {
            this.isLoop = false
        }
        this.icon.source = this.list[this.current];
        this.play();
    }

    public gotoAndStop(value:number=0){
        this.current = value;
        this.icon.source = this.list[this.current];
        this.timeID.stop();
    }

    public setList(data:Array<string>){
        this.list = data;
        this.max = data.length;
    }

    private updateTime(){
        if(this.sleepFrame != 0 && this.currSleep > 0){
            if(++this.currSleep == this.sleepFrame){
                this.currSleep = 0;
            }
            return;
        }
        this.icon.source = this.list[this.current];
        this.dispatchEventWith("changed")

        if(++this.current == this.max){
            this.currSleep = 1;
            this.current = 0;
            if(this.isLoop)
            {
                this.current = this.loopIndex
                return;
            }


            this.playTimes--;
            if(this.playTimes == 0)
            {
                this.stop();
                this.dispatchEventWith("complete")
            }
        }
    }

    public dispose(){
        this.stop();
        this.timeID.removeEventListener(egret.TimerEvent.TIMER,this.updateTime,this);
        this.timeID = null;

        this.visible = true
        this.alpha = 1
        this.icon.width = undefined;
        this.icon.height = undefined;
        this.icon.x = 0;
        this.icon.y = 0;
        this.width = undefined;
        this.height = undefined;
        this.icon.scaleX = this.icon.scaleY = 1
        this.scaleX = this.scaleY = 1
        MyTool.removeMC(this);

        if(MovieSimpleSpirMC.pool.indexOf(this) == -1)
            MovieSimpleSpirMC.pool.push(this)
    }
}


/**
 * 简化版 MovieClip (素材是1张图，通过设置不同区域实现动画)
 * @author
 */
class MovieSimpleSpirMC2 extends eui.Group {
    public static pool = [];
    public static create(){
        var item =  this.pool.shift() || new MovieSimpleSpirMC2()
        return item
    }


    private icon: eui.Image;
    public iconWidth:number;
    public iconHeight: number;
    public current: number = 0;
    public max: number;
    public min: number = 0;

    public stopLoop;

    private timeID: egret.Timer;

    /**
     * 播放次数
     * 默认为0
     * 0为无限循环
     * 1为只播放1次，2为播放2次，如此累推
     spritLog("fS");
     */
    private playTimes:number;
    private now_playTimes:number;
    /**
     * 是否循环
     */
    public isLoop:boolean;

    public widthNum = 999
    public desY // 偏移的Y
    public currSleep:number = 0;
    public sleepFrame:number = 0;
    
    public constructor() {
        super();
        this.touchEnabled = this.touchChildren = false;
    }
    

    private spriteSheet:egret.SpriteSheet;
    public setData(icon: string,width: number,height: number,num: number,millisecond?: number,playTimes?:number,desY?:number):MovieSimpleSpirMC2 {
        this.width = width;
        this.height = height;
        this.iconWidth = width;
        this.iconHeight = height;
        this.max = num;
        this.desY = desY || 0;

        if(!this.timeID){
            this.timeID = new egret.Timer(millisecond || 42,0);//24帧每秒
            this.timeID.addEventListener(egret.TimerEvent.TIMER,this.updateTime,this);
        }

        //播放次数
        this.playTimes = playTimes || 0;
        this.isLoop = ((this.playTimes == 0 ) ? true : false);

        this.reSet();
 
        if(!this.icon)
        {
            this.icon = new eui.Image();
            this.addChild(this.icon);
        }
        this.icon.source = ''
        this.reSetSource(icon);
      
        return this;
    }
    
    public reSetSource(source:string){
        this.spriteSheet = null;
        RES.getResByUrl(source, (bitmapData)=>{
            if(this.timeID == null){ //如果在加载期间 dispose掉了，就忽略
                return;
            }
            if(!bitmapData) return;
            this.spriteSheet = new egret.SpriteSheet(bitmapData);
            let x:number, y:number;
            for(var i=0; i< this.max; i++){
                x = i % this.widthNum;
                y = Math.floor(i/this.widthNum);
                this.spriteSheet.createTexture("temp_key" + i, x * this.iconWidth, y*this.iconHeight+this.desY, this.iconWidth, this.iconHeight);
            }
            this.renewCurrent();
        })
    }
    
    public play() {
        if(this.timeID)
        {
            this.currSleep = 0;
            this.timeID.start();
        }
    }

    public stop() {
        if(this.timeID)
            this.timeID.stop();
    }

    public reSet(){
        this.now_playTimes = 0;
    }

    public gotoAndPay(value: number = 0,times?) {
        this.current = value;
        this.renewCurrent();
        this.playTimes = times || 0;
        this.isLoop = ((this.playTimes == 0 ) ? true : false);
        this.reSet();
        this.play();
    }
    
    public gotoAndStop(value: number = 0){
        this.current = value;
        this.renewCurrent();
        this.stop();
    }

    private updateTime()
    {
        if(this.sleepFrame != 0 && this.currSleep > 0){
            if(++this.currSleep == this.sleepFrame){
                this.currSleep = 0;
            }
            return;
        }
        this.renewCurrent();
        this.dispatchEventWith("changed")
        if(++this.current == this.max)
        {
            this.currSleep = 1;
            this.current = this.min;
            if( !this.isLoop )
            {
                if( ++this.now_playTimes == this.playTimes)
                {
                    if(this.stopLoop)
                    {
                        this.loop(this.stopLoop,null);
                        return;
                    }
                    this.stop();
                    this.dispatchEventWith("complete");
                }
            }
        }
    }

    private renewCurrent(){
        if(this.icon && this.spriteSheet)
        {
            this.icon.source = this.spriteSheet.getTexture("temp_key" + this.current);
        }
    }

    public dispose() {
        this.stop();
        this.timeID.removeEventListener(egret.TimerEvent.TIMER,this.updateTime,this);
        this.timeID = null;
        this.widthNum = 999;

        this.visible = true
        this.alpha = 1
        this.icon.width = undefined;
        this.icon.height = undefined;
        this.width = undefined;
        this.height = undefined;
        this.icon.scaleX = this.icon.scaleY = 1
        this.scaleX = this.scaleY = 1
        MyTool.removeMC(this);

        if(MovieSimpleSpirMC2.pool.indexOf(this) == -1)
            MovieSimpleSpirMC2.pool.push(this)
    }

    public loop(data,nextData){
        this.stopLoop = nextData
        var from = data[0];
        var to = data[1];
        this.min = from;
        this.max = to;

        this.current = this.min
        this.play();
        if(!nextData && data[2])
            this.isLoop = true;
        else
        {
            this.isLoop = false;
            this.playTimes = 1;
            this.now_playTimes = 0;
        }

    }
}
