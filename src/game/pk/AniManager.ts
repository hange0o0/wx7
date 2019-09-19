class AniManager_wx3 {

    private static _instance:AniManager_wx3;
    public static getInstance():AniManager_wx3 {
        if (!this._instance)
            this._instance = new AniManager_wx3();
        return this._instance;
    }

    private mcFactorys:any = {}
    private mcPool = [];
    private mvList = [];

    private imgPool = [];
    private imgList = [];


    //frameRate:默认是12，要变快就加大，慢变就减小
    public mvConfig = {
        '14':{frameRate:24,scale:1},
        '30':{scale:1.5},
        '39':{scale:1.5},
        '116':{frameRate:24}
        //'6':{frameRate:24},
        //'33':{scale:1.5},
        //'102':{scale:2},
        //'124':{frameRate:24,scale:1.5},
        //'154a':{frameRate:24},
        //'136':{frameRate:24},
        //'137':{frameRate:24},
        //'166':{frameRate:24,scale:1.5},
        //'176':{frameRate:24}
    };

    public mvSoundConfig = {}
    public aniList = []




    public constructor() {
        var sound = {
            1:[], //5,6,16
            2:[5,6,16,136,137,162,166,167,15],
            3:[30,109,119,138,139,128,36,134],
            4:[7,107,108,117,125,145,151,157,158,177],
            5:[12,32,148,168,135],
            6:[],
            7:[176,31,33,111,133],
            8:[8,14,13,22,27,37,39,124,132,143,146,35,144,147,149,172],
            9:[],
            10:[],
            11:[],
            12:[23,38,105,110,126,129],
            13:[],
            14:[3,4,21,131],
            15:[102,103,104,160,163,164,170,113,114,127,130,153,154],
            16:[11,24,25,26,28,29,34,106,112,115,116,118,120,121,122,123,140,141,142,161,175],
        }

        /* var aniList = [6, 8, 10, 14, 16, 21, 24, 28, 29, 30, 34, 39, 103, 104, 106, 107, 108, 111, 112, 113, 114, 115, 116, 117, 118, 120, 122, 123, 126, 127, 128, 133, 140, 149, 153];
         var data = {groups:[],resources:[]}
         var arr = data.resources;
         var addResources = function(name){
         var path = "ani/skill" + name+'.'
         arr.push({
         "name":"skill" + name + "_json",
         "type":"json",
         "url": path + 'json'
         })
         arr.push({
         "name":"skill" + name + "_png",
         "type":"image",
         "url": path + 'png'
         })
         }
         for(var i=0;i<aniList.length;i++)
         {
         addResources(aniList[i]);
         this.aniList.push('skill' + aniList[i]);
         }
         for(var i=1;i<=8;i++)
         {
         arr.push({
         "name":"bullet" + i + "_png",
         "type":"image",
         "url": "ani/bullet" + i+'.png'
         })
         }
         for(var i=1;i<=20;i++)
         {
         arr.push({
         "name":"pk_bg" + i + "_jpg",
         "type":"image",
         "url": "pk_bg/pk_bg" + i+'.jpg'
         })
         }
         RES.parseConfig(data, Config.localResRoot);*/




        for(var s in sound)
        {
            var temp = sound[s];
            for(var i=0;i<temp.length;i++)
            {
                var skillID = temp[i];
                if(this.mvSoundConfig[skillID])
                    console.log('same' + s + '--' + skillID + '--' + this.mvSoundConfig[skillID])
                this.mvSoundConfig[skillID] = s;
            }
        }

        //for(var i=1;i<180;i++)
        //{
        //    if(!RES.hasRes('skill' + i + '_json'))
        //        continue;
        //    this.aniList.push('skill' + i);
        //}
    }

    public getImg(source){
        var mc = this.imgPool.pop() || new eui.Image()
        mc.source = source;
        this.imgList.push(mc);

        return mc;
    }
    public removeImg(mc){
        var index = this.imgList.indexOf(mc);
        if(index != -1)
        {
            this.imgList.splice(index,1);
        }
        index = this.imgPool.indexOf(mc);
        if(index == -1)
        {
            this.imgPool.push(mc);
        }

        mc.rotation = 0
        mc.scaleX = 1
        mc.scaleY = 1
        mc.alpha = 1
        egret.Tween.removeTweens(mc);
        MyTool.removeMC(mc);
    }

    public removeAllMV(){
        while(this.mvList.length > 0)
        {
            this.removeMV(this.mvList[0])
        }

        while(this.imgList.length > 0)
        {
            this.removeImg(this.imgList[0])
        }
    }


    private onSkillAni(event:RES.ResourceEvent):void {
        if (event.groupName == "ani") {
            RES.removeEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onSkillAni, this);
            console.log(event);
            //var data:any = RES.getRes("ani_skill_json"); //qid
            //var texture:egret.Texture = RES.getRes("ani_skill_png");
            //var mcFactory:egret.MovieClipDataFactory = new egret.MovieClipDataFactory(data, texture);
            //mcFactory.enableCache = true;
            //this.mcFactory = mcFactory;
        }
    }

    //移除MC
    public removeMV(mc){
        var index = this.mvList.indexOf(mc);
        if(index != -1)
        {
            this.mvList.splice(index,1);
        }
        mc.stop();
        mc.removeEventListener(egret.Event.COMPLETE, this.onComp, this);
        this.mcPool.push(mc);

        mc.rotation = 0
        mc.scaleX = 1
        mc.scaleY = 1
        mc.alpha = 1
        egret.Tween.removeTweens(mc);

        MyTool.removeMC(mc);
    }

    public preLoadMV(id){
        //return;
        var name = this.getMVKey(id);
        if(this.mcFactorys[name])
            return true;
        var data:any = RES.getRes(name + "_json"); //qid
        var texture:egret.Texture = RES.getRes(name + "_png");
        if(data && texture)
            return true;
        var groupName = 'mv' + name;
        if(RES.getGroupByName(groupName).length == 0)
        {
            RES.createGroup(groupName, [name + "_json",name + "_png"], true);
            RES.loadGroup(groupName);
        }
        return false;
    }

    private getMV(name){
        var mcFactory:egret.MovieClipDataFactory = this.mcFactorys[name];
        if(!mcFactory)
        {
            var data:any = RES.getRes(name + "_json"); //qid
            var texture:egret.Texture = RES.getRes(name + "_png");
            if(data == null)
            {
                if(Config.isDebug)
                    throw new Error('111');
                return this.mcPool.pop() || new egret.MovieClip();
            }
            mcFactory = new egret.MovieClipDataFactory(data, texture);
            //mcFactory.enableCache = true;
            this.mcFactorys[name] = mcFactory
        }
        var mc:any = this.mcPool.pop() || new egret.MovieClip();
        mc.movieClipData = mcFactory.generateMovieClipData(name);
        if(mc.movieClipData == null)
        {
            if(Config.isDebug)
                throw new Error('222');
            return mc
        }
        mc.frameRate = 12//技能动画变慢
        mc.scaleX = mc.scaleY = 1;
        mc.rotation = 0;
        return mc;
    }

    //取重复播放的ani
    public getAni(id){
        var name = this.getMVKey(id);
        var mc = this.getMV(name);
        if(mc.totalFrames)
            mc.gotoAndPlay(1, -1);
        this.mvList.push(mc);
        return mc;
    }

    //取播完一次后回调的ani
    public getAniOnce(sid,fun?,thisObj?){
        var name = this.getMVKey(sid);
        var mc = this.getMV(name);
        if(!mc.totalFrames)
        {
            fun && fun.apply(thisObj);
            return mc;
        }
        mc.comFun = fun;
        mc.thisObj = thisObj;


        mc.gotoAndPlay(1, 1);
        mc.once(egret.Event.COMPLETE, this.onComp, this);


        this.mvList.push(mc);
        return mc;
    }

    private onComp(e:egret.Event){
        if(e.currentTarget.comFun)
            e.currentTarget.comFun.apply(e.currentTarget.thisObj);
        this.removeMV(e.currentTarget);

    }

    public getMVKey(key){
        return 'skill' + parseInt(key);
    }

    public playOnItem(mvID,item,xy?){
        if(!this.preLoadMV(mvID))
        {
            return;
        }
        var mv = this.getAniOnce(mvID);
        if(xy)
        {
            mv.x = xy.x;
            mv.y = xy.y;
        }
        else
        {
            mv.x = item.x;
            mv.y = item.y;
        }
        //mv.scaleX = mv.scaleY = 0.5
        item.parent.addChildAt(mv,item.parent.getChildIndex(item) + 1);
        return mv;
    }

    public playInItem(mvID,item,xy?){
        if(!this.preLoadMV(mvID))
        {
            return;
        }
        var mv = this.getAniOnce(mvID);
        mv.x = xy?xy.x:0
        mv.y = xy?xy.y:0
        item.addChild(mv);
        return mv;
    }

    //掉下来
    public drop(source,target){
        var mc = this.getImg(source)
        mc.y = target.y - 500
        mc.x = target.x
        target.parent.addChildAt(mc,target.parent.getChildIndex(target) + 1);
        var tw = egret.Tween.get(mc)
        tw.to({y:target.y},300).call(function(){
            this.removeImg(mc);
        },this)
        return mc
    }

    ////在某个位置闪一下
    //public showStar1(con,point,scaleIn = 0){
    //    var mc = new eui.Image()
    //    mc.source = 'coin_mv2_png';
    //    con.addChild(mc);
    //    mc.x = point.x
    //    mc.y = point.y
    //    mc.anchorOffsetX = 100/2
    //    mc.anchorOffsetY = 100/2
    //    mc.scaleX = 0
    //    mc.scaleY = 0
    //    mc.rotation = Math.random()*90
    //    var scale = scaleIn || (0.2 + Math.random()*0.5);
    //    var cd = 100/scale/scale + Math.random()*700 + 200;
    //    if(scaleIn)
    //        cd /= 2;
    //    var tw:egret.Tween = egret.Tween.get(mc);
    //    tw.to({scaleX:scale,scaleY:scale,rotation:mc.rotation + 180},cd).to({scaleX:0,scaleY:0,rotation:mc.rotation + 360},cd).call(function(){
    //        MyTool.removeMC(mc);
    //    })
    //}
    //
    ////流星
    //public showStar2(con,point){
    //    var mc = new eui.Image()
    //    mc.source = 'coin_mv1_png';
    //    con.addChild(mc);
    //
    //    mc.anchorOffsetX = 10
    //    mc.anchorOffsetY = 12
    //    mc.scale9Grid = new egret.Rectangle(5,20,10,160)
    //    var scale = 0.5 + Math.random()*0.3;
    //    mc.scaleX = scale
    //    mc.scaleY = scale
    //    var rota = Math.random()*20;
    //    mc.rotation = rota + 240
    //    mc.height = 190/scale
    //
    //    mc.x = 700
    //    mc.y = point.y - Math.tan((270 - mc.rotation)/180*Math.PI) * (mc.x - point.x)
    //    var cd = MyTool.getDis(mc,point)*1/scale;
    //
    //    var tw:egret.Tween = egret.Tween.get(mc);
    //    tw.to({x:point.x,y:point.y},cd).to({height:20},100/scale).call(function(){
    //        MyTool.removeMC(mc);
    //        this.showStar1(con,point,scale)
    //    },this)
    //}
    //
    ////闪电
    //public showFlash(con,point){
    //    var data:any = RES.getRes('flash' + "_json"); //qid
    //    var texture:egret.Texture = RES.getRes('flash' + "_png");
    //    if(data == null)
    //    {
    //        return
    //    }
    //    var mcFactory = new egret.MovieClipDataFactory(data, texture);
    //
    //    var mc:any = this.mcPool.pop() || new egret.MovieClip();
    //    mc.movieClipData = mcFactory.generateMovieClipData('flash' + Math.floor( 1 + Math.random()*5));
    //    var scale = 1 + Math.random();
    //    mc.x = point.x
    //    mc.y = point.y - (scale - 1) *10;
    //    mc.scaleX = scale
    //    mc.scaleY = scale
    //    con.addChild(mc);
    //    mc.gotoAndPlay(1, 1);
    //    mc.comFun = null;
    //    mc.frameRate = 12//技能动画变慢
    //    mc.once(egret.Event.COMPLETE, this.onComp, this);
    //    this.mvList.push(mc);
    //    return mc;
    //}
    //
    //
    ////云
    //public showCloud(con,rect,isPlace?){
    //    var mc = new eui.Image()
    //    var coundID  =  Math.floor(Math.random()*3+1);
    //    var cloudWidth = [0,239,193,112][coundID]
    //    var cloudHeight = [0,136,138,82][coundID]
    //    mc.source = 'cloud'+ coundID +'_png';
    //    con.addChild(mc);
    //
    //
    //    var scale = 0.8 + Math.random()*0.6;
    //    mc.scaleX = scale
    //    mc.scaleY = scale
    //    mc.touchEnabled = false;
    //    cloudWidth *= scale
    //    cloudHeight *= scale
    //
    //    var rota = Math.random()>0.5?1: -1;
    //    var toX =  rota > 0?rect.width:-cloudWidth;
    //    mc.y = rect.y + Math.random()*(rect.height-cloudHeight);
    //    if(isPlace)
    //    {
    //        mc.x = Math.random()*(con.width-cloudWidth);
    //    }
    //    else if(rota > 0)
    //    {
    //        mc.x = -cloudWidth
    //    }
    //    else
    //    {
    //        mc.x = rect.width
    //    }
    //    var cd = Math.abs(mc.x - toX) * (50 + Math.random()*20)
    //
    //    var tw:egret.Tween = egret.Tween.get(mc);
    //    tw.to({x:toX},cd).call(function(){
    //        MyTool.removeMC(mc);
    //    },this)
    //    return mc;
    //}
}