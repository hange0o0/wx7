class MonsterMV extends eui.Group {
    public static factory = {};
    public static STAT_RUN = 'run'
    public static STAT_STAND = 'stand'
    public static STAT_ATK = 'atk'
    public static STAT_DIE = 'die'

    //private mc:eui.Image;
    //private atkMV:MonsterAtkMV;


    //public frameTotal = 20//40播放完一轮需要的帧数

    public state = 'stand';
    //private index = 0;
    //
    //private mw = 480/4
    //private mh = 480/4
    //
    //public speed = 0;//增加or减少速度百分比
    public runing = false
    public atkStop = false

    public mv = new egret.MovieClip()
    public mcFactory = new egret.MovieClipDataFactory()
    public vo:MonsterVO;
    constructor(){
        super();
        this.init();
    }

    private init() {
        //var
        //this.mc = new eui.Image();
        //this.mc.cacheAsBitmap = true;
        this.addChild(this.mv);
        this.mv.addEventListener(egret.Event.COMPLETE,this.onEnd,this)
        //this.mv.addEventListener(egret.Event.ENTER_FRAME,this.onE,this)

        //
        //MyTool.addTestBlock(this)

    }

    //private onE(e){
    //    if(this.atkStop && this.state == MonsterMV.STAT_ATK)
    //    {
    //        if(this.mv.currentFrame == 3)
    //            this.mv.stop();
    //    }
    //}

    //private initAtkMV(){
    //    if(this.atkMV)
    //        return;
    //    this.atkMV = new MonsterAtkMV();
    //    this.addChild(this.atkMV);
    //    this.atkMV.visible = false;
    //    this.atkMV.addEventListener('mv_end',this.onAtkMVEnd,this)
    //}
    //
    //private onAtkMVEnd(){
    //    this.atkMV.stop();
    //    this.atkMV.visible = false
    //    this.play();
    //}

    public set speed(v){
        if(v < 0)
        {
            v = -v;
            this.mv.frameRate = 8*(1-v/(100+v))
        }
        else
        {
            this.mv.frameRate = 8*(1+v/100)
        }
    }

    public load(id,isHd?){

        var vo = this.vo = MonsterVO.getObject(id);


        var mw = vo.mcwidth/4
        var mh = vo.mcheight/4

        if(!MonsterMV.factory[id])
        {
            var data:any = RES.getRes(vo.mcwidth + "_json"); //qid
            var texture:egret.Texture = RES.getRes('enemy' + id + '_png');
            MonsterMV.factory[id] = new egret.MovieClipDataFactory(data, texture);
        }

        this.mcFactory = MonsterMV.factory[id];
        //this.mv.y = vo.heightoff
        this.width = mw
        this.height = mh

        this.anchorOffsetX = mw/2
        this.anchorOffsetY = mh

        //this.atkStop = [31,32,33,34,35].indexOf(vo.id) != -1
    }

    public run(){
        this.state = MonsterMV.STAT_RUN
        if(this.vo.id == 99)
        {
            this.speed = 100
        }
        this.mv.movieClipData = this.mcFactory.generateMovieClipData(this.state);
        this.mv.gotoAndPlay(0,-1)
    }

    public stand(){
        this.state = MonsterMV.STAT_STAND
        if([61,62,63,70,76].indexOf(this.vo.id) != -1)
            this.state = MonsterMV.STAT_RUN
        this.mv.movieClipData = this.mcFactory.generateMovieClipData(this.state);
        this.mv.gotoAndPlay(0,-1)
    }

    public die(){
        this.state = MonsterMV.STAT_DIE
        this.mv.movieClipData = this.mcFactory.generateMovieClipData(this.state);
        this.mv.gotoAndPlay(0,1)
    }

    public atk(){
        this.state = MonsterMV.STAT_ATK
        if(this.vo.id == 99)
        {
            this.speed = 100
        }
        this.mv.movieClipData = this.mcFactory.generateMovieClipData(this.state);
        this.mv.gotoAndPlay(0,1)
    }

    public play(){
        this.runing = true
        this.mv.play()
        //EM_wx4.addEventListener(GameEvent.client.timerE,this.onE,this)
    }

    public stop(){
        this.runing = false
        this.mv.stop()
        //EM_wx4.removeEventListener(GameEvent.client.timerE,this.onE,this)
    }

    //public reset(){
    //    //this.index = 0;
    //    //if(this.atkMV)
    //    //{
    //    //    this.atkMV.visible = false;
    //    //    this.atkMV.stop();
    //    //}
    //
    //    //this.onE();
    //    if(!this.runing)
    //        this.play();
    //}

    //public onE(){
    //    if(!this.runing)
    //        return;
    //    var w = this.mw
    //    var h = this.mh
    //    var speed = (this.speed || 0);
    //
    //    if(speed)
    //    {
    //        if(speed > 0)
    //            var frameStep = Math.round(this.frameTotal*(1-speed/(100 + speed))/this.vo.mcnum);
    //        else
    //            var frameStep = Math.round(this.frameTotal*(1-speed/100)/this.vo.mcnum);
    //    }
    //    else
    //    {
    //        var frameStep = Math.round(this.frameTotal/this.vo.mcnum);
    //    }
    //    //if(this.state == MonsterMV.STAT_ATK && this.vo.id == 99)
    //    //    frameStep = 1;
    //    var x = Math.floor(this.index/frameStep)*w
    //    var y = (this.state - 1)*h
    //    this.mc.scrollRect = new egret.Rectangle(x,y,w,h)
    //
    //    this.index ++;
    //
    //    if(this.index>=this.vo.mcnum*frameStep)
    //    {
    //        this.index = 0;
    //        this.onEnd()
    //    }
    //}

    private onEnd(){
        switch(this.state)
        {
            case MonsterMV.STAT_RUN:
                if(this.vo.id == 99)
                {
                    this.speed = 0
                    this.stand();
                }
                break;
            case MonsterMV.STAT_STAND:
                break;
            case MonsterMV.STAT_ATK:
                if(this.vo.id == 99)
                {
                    this.speed = 0
                }
                this.stand();
                break;
            case MonsterMV.STAT_DIE:
                this.stop();
                this.dispatchEventWith('mv_die')
                break;
        }
    }
}

//
//class MonsterMV extends eui.Group {
//    public static STAT_RUN = 1
//    public static STAT_STAND = 2
//    public static STAT_ATK = 3
//    public static STAT_DIE = 4
//
//    private mc:eui.Image;
//    private atkMV:MonsterAtkMV;
//
//
//    public frameTotal = 20//40播放完一轮需要的帧数
//
//    public state = 2;
//    private index = 0;
//
//    private mw = 480/4
//    private mh = 480/4
//
//    public speed = 0;//增加or减少速度百分比
//    public runing = false
//
//    public vo:MonsterVO;
//    constructor(){
//        super();
//        this.init();
//    }
//
//    private init() {
//        this.mc = new eui.Image();
//        //this.mc.cacheAsBitmap = true;
//        this.addChild(this.mc);
//
//        //
//        //MyTool.addTestBlock(this)
//
//    }
//
//    private initAtkMV(){
//        if(this.atkMV)
//            return;
//        this.atkMV = new MonsterAtkMV();
//        this.addChild(this.atkMV);
//        this.atkMV.visible = false;
//        this.atkMV.addEventListener('mv_end',this.onAtkMVEnd,this)
//    }
//
//    private onAtkMVEnd(){
//        this.atkMV.stop();
//        this.atkMV.visible = false
//        this.play();
//    }
//
//    public load(id,isHd?){
//
//        var vo = this.vo = MonsterVO.getObject(id);
//        this.mw = vo.mcwidth/vo.mcnum
//        this.mh = vo.mcheight/4
//
//        this.mc.y = vo.heightoff
//
//
//        MyTool.setImgSource(this.mc,'enemy' + id + '_png');
//        this.width = this.mw
//        this.height = this.mh
//        this.anchorOffsetX = this.mw/2
//        this.anchorOffsetY = this.mh
//        this.mc.scrollRect = new egret.Rectangle(0,0,this.mw,this.mh)
//        this.speed = 0;
//    }
//
//    public run(){
//        this.state = MonsterMV.STAT_RUN
//        if(this.vo.id == 99)
//        {
//            this.speed = 100
//        }
//        //this.state = MonsterMV.STAT_STAND
//        this.reset();
//    }
//
//    public stand(){
//        this.state = MonsterMV.STAT_STAND
//        if([61,62,63,70,76].indexOf(this.vo.id) != -1)
//            this.state = MonsterMV.STAT_RUN
//        this.reset();
//    }
//
//    public die(){
//        this.state = MonsterMV.STAT_DIE
//        this.reset();
//    }
//
//    public atk(){
//        this.state = MonsterMV.STAT_ATK
//        if(this.vo.id == 99)
//        {
//            this.speed = 100
//        }
//        this.reset();
//    }
//
//    public play(){
//        this.runing = true
//        //EM_wx4.addEventListener(GameEvent.client.timerE,this.onE,this)
//    }
//
//    public stop(){
//        this.runing = false
//        //EM_wx4.removeEventListener(GameEvent.client.timerE,this.onE,this)
//    }
//
//    public reset(){
//        this.index = 0;
//        if(this.atkMV)
//        {
//            this.atkMV.visible = false;
//            this.atkMV.stop();
//        }
//
//        this.onE();
//        if(!this.runing)
//            this.play();
//    }
//
//    public onE(){
//        if(!this.runing)
//            return;
//        var w = this.mw
//        var h = this.mh
//        var speed = (this.speed || 0);
//
//        if(speed)
//        {
//            if(speed > 0)
//                var frameStep = Math.round(this.frameTotal*(1-speed/(100 + speed))/this.vo.mcnum);
//            else
//                var frameStep = Math.round(this.frameTotal*(1-speed/100)/this.vo.mcnum);
//        }
//        else
//        {
//            var frameStep = Math.round(this.frameTotal/this.vo.mcnum);
//        }
//        //if(this.state == MonsterMV.STAT_ATK && this.vo.id == 99)
//        //    frameStep = 1;
//        var x = Math.floor(this.index/frameStep)*w
//        var y = (this.state - 1)*h
//        this.mc.scrollRect = new egret.Rectangle(x,y,w,h)
//
//        this.index ++;
//
//        if(this.index>=this.vo.mcnum*frameStep)
//        {
//            this.index = 0;
//            this.onEnd()
//        }
//    }
//
//    private onEnd(){
//        switch(this.state)
//        {
//            case MonsterMV.STAT_RUN:
//                if(this.vo.id == 99)
//                {
//                    this.speed = 0
//                    this.stand();
//                }
//                break;
//            case MonsterMV.STAT_STAND:
//                break;
//            case MonsterMV.STAT_ATK:
//                if(this.vo.id == 99)
//                {
//                    this.speed = 0
//                }
//                this.stand();
//                break;
//            case MonsterMV.STAT_DIE:
//                this.stop();
//                this.dispatchEventWith('mv_die')
//                break;
//        }
//    }
//}