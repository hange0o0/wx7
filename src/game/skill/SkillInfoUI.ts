class SkillInfoUI extends game.BaseWindow_wx4 {

    private static _instance: SkillInfoUI;
    public static getInstance(): SkillInfoUI {
        if(!this._instance)
            this._instance = new SkillInfoUI();
        return this._instance;
    }

    private nameText: eui.Label;
    private skillCDText: eui.Label;
    private levelText: eui.Label;
    private atkText: eui.Label;
    private img: eui.Image;
    private barMC: eui.Image;
    private rateText: eui.Label;
    private closeBtn: eui.Button;







    public skillID;
    public constructor() {
        super();
        this.skinName = "SkillInfoUISkin";
        this.canBGClose = false
    }

    public childrenCreated() {
        super.childrenCreated();
        this.setTitle('技能详情')
        this.addBtnEvent(this.closeBtn,this.hide)

    }

    public show(skillID?){
        this.skillID = skillID;
        super.show()
    }

    public hide() {
        super.hide();
    }

    public onShow(){
        var SM = SkillManager.getInstance();
        var svo = SkillVO.getObject(this.skillID);
        var cd = svo.getCD();
        if(cd)
            this.setHtml(this.skillCDText,'技能间隔:' + this.createHtml(MyTool.toFixed(cd/1000,1) + '秒',0xFFFF00))
        else
            this.setHtml(this.skillCDText,this.createHtml('被动技能',0xECAEF9))
        this.setHtml(this.atkText, svo.getDes())


        var lv = SM.getSkillLevel(svo.id);
        this.img.source = svo.getThumb();
        this.nameText.text = svo.name;
        this.levelText.text = 'LV.'+lv


        var currentNum = SM.getSkillNum(svo.id)
        var num1 = SM.getLevelNum(lv)
        var num2 = SM.getLevelNum(lv+1)

        var v1 = currentNum - num1
        var v2 = num2 - num1
        this.rateText.text = v1 + '/' + v2;
        this.barMC.width = 100 * v1 / v2;
    }

}