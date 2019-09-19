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
    public childrenCreated() {
        this.touchChildren = this.touchEnabled = false;
        this.addChild(this.mc);
        this.mc.x = 356*1.5
        this.mc.y = 0
        this.mc.scaleX = -1.5;
        this.mc.scaleY = 1.5;
        this.anchorOffsetX = 356*1.5/2;
        this.anchorOffsetY = 356*1.5/2 + 60;

        this.footShadow = new eui.Image("m_shadow_mc_png");
        this.addChildAt(this.footShadow,0);
        this.footShadow.x = this.anchorOffsetX;
        this.footShadow.y = this.anchorOffsetY;
        this.footShadow.anchorOffsetX = 401/2;
        this.footShadow.anchorOffsetY = 178/2;
    }


    public load(heroid): void {
        this.mc.visible = true;
        this.mc.alpha = 1;
        this.state = 'stand'
        this.heroid = heroid
        this.footShadow.scaleX = this.footShadow.scaleY = 0.75
        if(heroid >= 108 && heroid <= 112)
            this.mc.y =  -30
        else
            this.mc.y =  0
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
    }

}