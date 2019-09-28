/**
 *
 * @author 
 *
 */
class SoundManager {
    private static instance:SoundManager;

    public constructor() {
        this.init();
    }

    public static getInstance():SoundManager {
        if (!this.instance)
            this.instance = new SoundManager();
        return this.instance;
    }

    //默认关闭音乐
    private _soundPlaying:boolean = false;
    private _bgPlaying:boolean = false;
    private _openShake:boolean = true;
    private _isPlayMovie:boolean = true;
    private _isMessage:boolean = true;

    private currentChannel:egret.SoundChannel;
    private currentKey:string;
    private wxChannel;
    private bgKey:string;
    private lastBGKey:string;
    private isLoad:boolean = false;


    private bgTimer;
    public pkKey = [];
    public effectKey = [];

    public lastSoundTime = {};
    // private tween:egret.Tween

    public currentLoader;

    private init() {
        //if(!App.isMobile){//pc上默认开音乐
        //    this._soundPlaying = true;
        //    this._bgPlaying = true;
        //}
        //
        //if(Config.isDebug)
        //{
        this._soundPlaying = true;
        this._bgPlaying = true;
        //}

        var som = SharedObjectManager_wx4.getInstance();
        if (som.getValue("sound") != undefined)
            this._soundPlaying = som.getValue("sound");
        if (som.getValue("bgsound") != undefined)
            this._bgPlaying = som.getValue("bgsound");

        if (som.getValue("openShake") != undefined)
            this._openShake = som.getValue("openShake");
        if (som.getValue("playMovie") != undefined)
            this._isPlayMovie = som.getValue("playMovie");
        if (som.getValue("showMessage") != undefined)
            this._isMessage = som.getValue("showMessage");

        this.isLoad = this._soundPlaying;
    }

    public get soundPlaying() {
        // if(!Config.isDebug && !Config.testSound) return false;
        return this._soundPlaying
    }

    public get bgPlaying() {
        // if(!Config.isDebug && !Config.testSound) return false;
        return this._bgPlaying
    }

    public get openShake() {
        return this._openShake
    }

    public get isPlayMovie() {
        return this._isPlayMovie
    }

    public get isMessage() {
        return this._isMessage
    }

    public set soundPlaying(v) {
        if (this._soundPlaying != v)
            SharedObjectManager_wx4.getInstance().setValue("sound", v)
        this._soundPlaying = v;
        //this.loadEffectSound();
    }

    public set bgPlaying(v) {
        if (this._bgPlaying != v) {
            SharedObjectManager_wx4.getInstance().setValue("bgsound", v);
        }
        this._bgPlaying = v;

        if (!v) {
            this.stopBgSound();
        }
        else {
            this.playSound('main_bg');
        }
    }

    public set openShake(v) {
        if (this._openShake != v)
            SharedObjectManager_wx4.getInstance().setValue("openShake", v)
        this._openShake = v;
    }

    public set isPlayMovie(v) {
        if (this._isPlayMovie != v)
            SharedObjectManager_wx4.getInstance().setValue("playMovie", v)
        this._isPlayMovie = v;
    }

    public set isMessage(v) {
        if (this._isMessage != v)
            SharedObjectManager_wx4.getInstance().setValue("showMessage", v)
        this._isMessage = v;
    }

    public addBtnClickEffect(btn:egret.DisplayObject) {
        btn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.playBtn, this)
    }

    public playBtn() {
        this.playEffect('btn');
    }

    public testBGPlay() {
        //if (PKingUI.getInstance().stage)
        //    this.playSound('bg2')
        //else
        //    this.playSound('bg')
    }

    public stopBgSound() {
        this.lastBGKey = this.bgKey;
        this.bgKey = null;
        if(window['wx'])
        {
            if(this.wxChannel) {
                this.wxChannel.destroy()
                this.wxChannel = null
            }
            this.currentKey = null;
            return;
        }
        try {
            // if(this.tween){
            //     this.tween.pause();
            //     this.tween = null;
            // }

            egret.clearTimeout(this.playTime);
            if (this.currentChannel) {
                egret.Tween.removeTweens(this.currentChannel);
                this.currentChannel.stop();
            }
            this.onSoundComplete();
        } catch (e) {
        }
    }

    public playEffect(v:string, fun?, thisObj?) {
        //if(v == 'enemy_dead')
        //    throw new Error('1234')
        if (GuideManager.getInstance().isGuiding)
            return;
        if (!this.soundPlaying) return;
        if (this.lastSoundTime[v] && egret.getTimer() - this.lastSoundTime[v] < 200)
            return;
        if (v == 'die' && this.lastSoundTime[v] && egret.getTimer() - this.lastSoundTime[v] < 2000)
            return;
        this.lastSoundTime[v] = egret.getTimer();
        if(window['wx'])
        {
            const innerAudioContext = window['wx'].createInnerAudioContext()
            innerAudioContext.autoplay = true
            innerAudioContext.src = "resource/game_assets2/sound/" + v +".mp3";
            return;
        }

        var url = "resource/game_assets2/sound/" + v + ".mp3"
        var loader:egret.URLLoader = new egret.URLLoader();
        loader.dataFormat = egret.URLLoaderDataFormat.SOUND;
        loader.once(egret.Event.COMPLETE, ()=> {
            var sound:egret.Sound = <egret.Sound>loader.data;
            var channel = sound.play(0, 1);
            if (fun)
                channel.once(egret.Event.SOUND_COMPLETE, fun, thisObj)
        }, this);
        loader.load(new egret.URLRequest(url));
    }

    public resumeSound() {
        if (this.lastBGKey)
            this.playSound(this.lastBGKey);
    }

    private tempLoop:number;

    public playSound(key:string, loop:number = 9999) {

        if (GuideManager.getInstance().isGuiding)
            return;
        if (!this.bgPlaying) return;
        if (this.bgKey == key) return;



        var url = "resource/game_assets2/sound/" + key + ".mp3"
        if (this.currentKey == url) return;


        if (this.currentLoader) {
            this.onLoadError({target: this.currentLoader})
        }
        this.stopBgSound()
        this.bgKey = key;
        this.currentKey = url;

        if(window['wx'])
        {
            const innerAudioContext = this.wxChannel = window['wx'].createInnerAudioContext()
            innerAudioContext.autoplay = true
            innerAudioContext.src =url;
            innerAudioContext.loop =true;
            return;
        }


        try {

            this.tempLoop = loop;
            /*if(this.currentChannel && this.currentKey == url){
             return;
             }

             this.currentKey=url*/

            var loader:egret.URLLoader = this.currentLoader = new egret.URLLoader();
            loader.dataFormat = egret.URLLoaderDataFormat.SOUND;
            loader.addEventListener(egret.Event.COMPLETE, this.onLoadComplete, this);
            loader.addEventListener(egret.IOErrorEvent.IO_ERROR, this.onLoadError, this);
            loader.load(new egret.URLRequest(url));
        }
        catch (e) {
        }
    }

    /************************************************************************************************** */

    private playTime:number;

    private onLoadComplete(event:egret.Event):void {
        egret.clearTimeout(this.playTime);

        var loader:egret.URLLoader = <egret.URLLoader>event.target;
        if (loader != this.currentLoader)
            return;

        var self = this;
        try {
            this.onLoadError(event);
            if ((this.currentKey && loader.data.url != this.currentKey) || !this._bgPlaying)
                return;
            if (this.currentChannel) {

                self.currentChannel.stop();
                self.currentChannel = null;

                if (!self._bgPlaying)return;
                this.playTime = setTimeout(()=> {
                    fun();
                }, 150);
            }
            else
                fun();
        }
        catch (e) {
        }

        function fun() {
            var sound:egret.Sound = <egret.Sound>loader.data;
            if (!sound)
                return;
            var channel:egret.SoundChannel = sound.play(0, self.tempLoop);
            if (self.currentChannel) {
                self.currentChannel.stop();
            }
            self.currentChannel = channel;

            channel.addEventListener(egret.Event.SOUND_COMPLETE, self.onSoundComplete, self);
        }

    }

    private onSoundComplete(event?:egret.Event):void {
        this.currentChannel = null;
        this.currentKey = null;

    }

    private onLoadError(event):void {
        this.currentLoader = null;
        var loader:egret.URLLoader = <egret.URLLoader>event.target;
        loader.removeEventListener(egret.Event.COMPLETE, this.onLoadComplete, this);
        loader.removeEventListener(egret.IOErrorEvent.IO_ERROR, this.onLoadError, this);
    }
}
    

