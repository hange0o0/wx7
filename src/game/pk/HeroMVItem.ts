class HeroMVItem extends game.BaseItem {

    public constructor() {
        super();

    }


    public mc:egret.MovieClip = new egret.MovieClip();//动画mc
    public mcFactory:egret.MovieClipDataFactory;
    private footShadow
    private scale = 1//1.2;


    public state = 'stand'
    public heroid;
    public runing
    public speed

    public frameRate = 8

    public heroScale = {
        101:0.8,
        102:0.6,
        103:0.6,
        104:0.6,
        105:0.6,
        113:0.7,
        114:0.7,
        115:0.5,
    }
    public childrenCreated() {
        this.touchChildren = this.touchEnabled = false;
        this.addChild(this.mc);

        this.mc.scaleX = -1;
        this.mc.scaleY = 1;


        this.footShadow = new eui.Image("m_shadow_mc_png");
        this.addChildAt(this.footShadow,0);

        this.footShadow.anchorOffsetX = 174/2;
        this.footShadow.anchorOffsetY = 77/2;
    }


    public setSpeed(speed){
        this.frameRate = 8*speed
        this.mc.frameRate = this.frameRate;
    }

    public load(heroid): void {
        this.mc.visible = true;
        this.mc.alpha = 1;
        this.state = 'stand'
        this.heroid = heroid
        this.footShadow.scaleX = this.footShadow.scaleY = 0.5
        if(heroid >= 108 && heroid <= 112)
            this.mc.y = -30
        else if(heroid >= 113 && heroid <= 115)
            this.mc.y = 10
        else
            this.mc.y =  0



        var scale = this.heroScale[heroid] || 1
        this.mc.x = 356*scale
        this.anchorOffsetX = 356/2*scale;
        this.anchorOffsetY = 356/2*scale + 40;

        this.footShadow.x = this.anchorOffsetX;
        this.footShadow.y = this.anchorOffsetY;
        this.renew();
    }

    private renew(){
        this.mcFactory = HeroMVManager.getInstance().getFactory(this.heroid);
        this.reset();
    }

    public stop(){
        this.runing = false
        this.mc.stop();
        egret.Tween.removeTweens(this)
        egret.Tween.removeTweens(this.mc)
    }
    public play(){
        this.runing = true
        this.mc.play();
    }

    public run(){
        this.state = MonsterMV.STAT_RUN
        this.reset();
    }

    public stand(){
        this.state = MonsterMV.STAT_STAND
        this.reset();
    }

    public die(){
        this.state = MonsterMV.STAT_DIE
        this.reset();
    }

    public atk(){
        this.state = MonsterMV.STAT_ATK
        this.reset();
    }

    private reset(round?){
        if(!this.mcFactory)
            return;
        this.mc.removeEventListener(egret.Event.COMPLETE, this.stand, this);
        //this.mc.frameRate
        switch(this.state)
        {
            case MonsterMV.STAT_RUN:
            case MonsterMV.STAT_STAND:
                var mcData = this.mcFactory.generateMovieClipData('move');
                if(mcData && mcData.frames.length > 0){
                    this.mc.movieClipData = mcData;
                    this.mc.gotoAndPlay(1, -1)
                }
                break;
            case MonsterMV.STAT_ATK:
                var mcData = this.mcFactory.generateMovieClipData('atk');
                if(mcData && mcData.frames.length > 0){
                    this.mc.movieClipData = mcData;
                    this.mc.gotoAndPlay(1, round)
                    this.mc.once(egret.Event.COMPLETE, this.stand, this);
                }
                break;
            case MonsterMV.STAT_DIE:
                egret.Tween.get(this.mc).to({alpha:0},500).call(()=>{
                    this.stop();
                    this.dispatchEventWith('mv_die')
                })
                break;

        }
        this.mc.frameRate = this.frameRate;
    }

}