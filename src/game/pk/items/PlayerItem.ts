class PlayerItem extends game.BaseItem{
    public constructor() {
        super();
        this.skinName = "PlayerItemSkin";
    }

    private roleCon: eui.Group;
    private body: eui.Group;
    private bodyMC: eui.Image;
    private leftCon: eui.Group;
    private leftKnifeMC: eui.Image;
    private leftHendMC: eui.Image;
    private rightCon: eui.Group;
    private rightKnifeMC: eui.Image;
    private rightHendMC: eui.Image;
    public hpBar: HPBar;






    private lastHpStep = -1;
    private mvKey = ''

    private atkStep = 0
    private ctrlRota = 0//控制面向的方向

    private lastMoveTime //上次移动的时间
    private wudiMC
    private stateYunMV

    public childrenCreated() {
        super.childrenCreated();
        this.anchorOffsetX = 40
        this.anchorOffsetY = 40


    }

    public dataChanged():void {
        var gunVO = GunVO.getObject(this.data.gunid)
        this.leftKnifeMC.source = 'knife_'+this.data.gunid+'_png'
        this.rightKnifeMC.source = 'knife_'+this.data.gunid+'_png'
        this.leftKnifeMC.anchorOffsetX = this.rightKnifeMC.anchorOffsetX = gunVO.anx
        this.leftKnifeMC.anchorOffsetY = this.rightKnifeMC.anchorOffsetY = gunVO.any

        this.cleanTween();
        this.mvKey = '';
        this.renewSkin(1);



        this.hpBar.visible = !PKC.isAuto
        this.renewHp();
        //this.showStandMV();
        this.ctrlRota = -90


    }

    public renewSkin(hpStep){
        this.bodyMC.source = 'role_'+hpStep+'_png'
        this.leftHendMC.source = 'role_'+hpStep+'_png'
        this.rightHendMC.source = 'role_'+hpStep+'_png'
    }

    public renewHp(){
        if(PKC.isAuto)
            return;
        this.hpBar.visible = true;
        this.hpBar.data = this.data;
    }

    public resetXY(x,y){
        //var r = 40;
        //if(x < r)
        //    x = r;
        //else if(x > PKC.mapW - r)
        //    x = PKC.mapW - r;
        //
        //if(y < r)
        //    y = r
        //else if(y > PKC.mapH - r)
        //    y = PKC.mapH - r

        this.x = x;
        this.y = y;
        this.data.x = x
        this.data.y = y
    }


    public cleanTween(){
        egret.Tween.removeTweens(this.leftCon);
        egret.Tween.removeTweens(this.rightCon);
        egret.Tween.removeTweens(this.body);
        this.leftCon.scaleY = this.leftCon.scaleX = 1;
        this.rightCon.scaleY = this.rightCon.scaleX = 1;
        this.body.scaleY = this.body.scaleX = 1;
    }

    public isAtking(){
        if(this.mvKey == 'atk')
            return true;
        if(this.mvKey == 'double')
            return true;
        if(this.mvKey == 'shoot')
            return true;
        return false;
    }


    public showWalkMV(){
        if(this.isAtking())
            return;
        if(this.mvKey == 'walk')
            return;
        if(this.mvKey == 'die')
            return;

        this.mvKey = 'walk'
        this.cleanTween();

        this.leftCon.scaleX = 1;
        this.leftCon.rotation =  20
        this.leftCon.x = -10;
        this.leftCon.y = 35;
        egret.Tween.get(this.leftCon,{loop:true}).to({x:-5,y:30},100).to({x:-15,y:40},200).to({x:-10,y:35},100);

        this.rightCon.scaleX = 1;
        this.rightCon.rotation =  -20
        this.rightCon.x = 90;
        this.rightCon.y = 35;
        egret.Tween.get(this.rightCon,{loop:true}).to({x:95,y:40},100).to({x:85,y:30},200).to({x:90,y:35},100);


        this.body.x = 40
        this.body.y = 40
    }

    public showStandMV(){
        if(this.mvKey == 'stand')
            return;
        if(this.mvKey == 'die')
            return;

        this.mvKey = 'stand'
        this.cleanTween();

        this.leftCon.scaleX = 1;
        this.leftCon.rotation =  20
        this.leftCon.x = -10;
        this.leftCon.y = 30;
        egret.Tween.get(this.leftCon,{loop:true}).to({x:-15,y:25},200).to({x:-10,y:30},200);

        this.rightCon.scaleX = 1;
        this.rightCon.rotation =  -20
        this.rightCon.x = 90;
        this.rightCon.y = 30;
        egret.Tween.get(this.rightCon,{loop:true}).to({x:95,y:25},200).to({x:90,y:30},200);


        this.body.x = 40
        this.body.y = 40

    }

    public showDieMV(){
        this.mvKey = 'die'
        this.hpBar.visible = false;
        this.cleanTween();
        egret.Tween.get(this.leftCon).to({scaleX:0,scaleY:0},500);
        egret.Tween.get(this.rightCon).to({scaleX:0,scaleY:0},500);
        egret.Tween.get(this.body).to({scaleX:0,scaleY:0},700).wait(500).call(()=>{
            this.data.isDie = 2;
        });
    }


    public showAtkMV(){
        if(this.mvKey == 'die')
            return;
        this.mvKey = 'atk'
        this.atkStep ++;

        this.cleanTween();
        var speed = Math.min(200,this.data.atkSpeed*(1000/PKC.frameRate)/2)
        if(this.atkStep %2 == 0) //
        {
            this.leftCon.scaleX = 1;
            this.leftCon.rotation =  - 120
            this.leftCon.x = -20;
            this.leftCon.y = 50;
            egret.Tween.get(this.leftCon).to({rotation:80,x:60,y:-20},speed).to({rotation:20,x:-10,y:30},speed);

            this.body.x = 35
            this.body.y = 50
            egret.Tween.get(this.body).to({x:45,y:35},speed).to({x:40,y:40},speed).call(this.showStandMV,this);

        }
        else
        {
            this.leftCon.scaleX = 1;
            this.rightCon.rotation =  120
            this.rightCon.x = 80 + 20;
            this.rightCon.y = 50;
            egret.Tween.get(this.rightCon).to({rotation:-80,x:20,y:-20},speed).to({rotation:-20,x:90,y:30},speed);

            this.body.x = 45
            this.body.y = 50
            egret.Tween.get(this.body).to({x:35,y:35},speed).to({x:40,y:40},speed).call(this.showStandMV,this);
        }
        SoundManager.getInstance().playEffect('atk')
    }

    public showDoubleMV(){
        if(this.mvKey == 'die')
            return;
        this.mvKey = 'double'
        var speed = Math.min(200,this.data.atkSpeed*(1000/PKC.frameRate)/2)
        this.cleanTween();

        this.leftCon.scaleX = -1;
        this.leftCon.rotation =  80
        this.leftCon.x = 60;
        this.leftCon.y = -20;
        egret.Tween.get(this.leftCon).to({rotation:-140,x:-20,y:60},speed).wait(speed/2).to({scaleX:1}).to({rotation:20,x:-10,y:30},speed);

        this.rightCon.rotation =  -80
        this.rightCon.x = 20;
        this.rightCon.y = -20;
        egret.Tween.get(this.rightCon).to({rotation:140,x:80+20,y:60},speed).wait(speed/2).to({scaleX:1}).to({rotation:-20,x:90,y:30},speed);

        this.body.x = 40
        this.body.y = 50
        egret.Tween.get(this.body).to({y:35},speed).wait(speed/2).to({y:40},speed).call(this.showStandMV,this);
        SoundManager.getInstance().playEffect('atk')

    }

    public showShootMV(){
        if(this.mvKey == 'die')
            return;
        this.mvKey = 'shoot'
        this.cleanTween()
        this.leftCon.rotation = 0
        this.leftCon.x = 30;
        this.leftCon.y = 30;
        egret.Tween.get(this.leftCon).to({y:100},100).to({y:30},100);

        this.rightCon.rotation = 0
        this.rightCon.x = 50;
        this.rightCon.y = 30;
        egret.Tween.get(this.rightCon).to({y:100},100).to({y:30},100);

        this.body.x = 40
        this.body.y = 40
        egret.Tween.get(this.body).to({y:50},100).to({y:40},100).call(this.showStandMV,this);
        SoundManager.getInstance().playEffect('arc')
    }


    public onE(){
        if(this.data.wudiStep > 0 && !this.data.isHide)
        {
            if(!this.wudiMC)
            {
                this.wudiMC = new eui.Image('21_png')
                this.wudiMC.anchorOffsetX = 251/2
                this.wudiMC.anchorOffsetY = 251/2
                this.wudiMC.scaleX = this.wudiMC.scaleY = 0.4
                this.wudiMC.x = this.wudiMC.y = 40
            }
            this.addChildAt(this.wudiMC,0);
        }
        else
            MyTool.removeMC(this.wudiMC)

        var playerData = this.data
        if(playerData.wudiStep<=0 && playerData.stopEnd > PKC.actionStep)//表现晕
        {

            if(!this.stateYunMV)
            {
                this.stateYunMV = new MovieSimpleSpirMC2()
                this.stateYunMV.x =  40 -  154/4
                this.stateYunMV.y = -10
                this.stateYunMV.setData('effect2_png',154/2,39,2,1000/6)
                this.stateYunMV.stop()
            }
            if(!this.stateYunMV.parent)
            {
                this.addChild(this.stateYunMV)
                this.stateYunMV.play()
            }

            return;
        }

        if(this.stateYunMV && this.stateYunMV.parent)
        {
            MyTool.removeMC(this.stateYunMV)
            this.stateYunMV.stop()
        }

        if(playerData.isFar)
        {
            this.testFarAtk()
            this.roleCon.rotation = this.ctrlRota+90
        }
        if(playerData.isSkilling)
            return;

        this.testAtk();
        if(playerData.hitEnemy)
        {
            var angle = PKTool.getRota(playerData,playerData.hitEnemy);
            this.roleCon.rotation = angle/Math.PI*180+90
        }

        if(this.mvKey != 'stand' && PKC.actionStep - this.lastMoveTime > 10 && !this.isAtking())
            this.showStandMV()
    }

    public move(touchID){
        var playerData = this.data
        if(playerData.isDie)
            return;

        this.lastMoveTime = PKC.actionStep


        var angle = Math.atan2(touchID.y2-touchID.y1,touchID.x2-touchID.x1)
        var rota1 = PKTool.resetAngle(angle/Math.PI*180);
        this.ctrlRota = rota1;


        if(playerData.wudiStep<=0 && playerData.stopEnd > PKC.actionStep)
            return;
        if(playerData.isSkillingStopMove)
            return;




        //如果这个方向有怪，则不能移动

        if(!playerData.isHide)
        {
            var monsterList = PKC.monsterList;
            var len = monsterList.length;
            for(var i=0;i<len;i++)
            {
                var monster = monsterList[i];
                if(monster.isDie)
                    continue;
                var dis = MyTool.getDis(monster,playerData)
                if(dis < 60 + monster.size)
                {
                    var rotaBase = PKTool.getRota(playerData,monster);
                    var rota2 = PKTool.resetAngle(rotaBase/Math.PI*180);
                    var rotaDes = Math.abs(rota2 - rota1)
                    if(rotaDes > 30 && rotaDes < 330)
                        continue;
                    //这个方向有怪
                    return;
                }
            }
        }



        var speed = playerData.speed;
        var x = Math.cos(angle)*speed
        var y = Math.sin(angle)*speed

        var targetX = this.x + x
        var targetY = this.y+y
        this.resetXY(targetX,targetY)

        var showWalk = !playerData.hitEnemy && !playerData.isSkilling //
        if(showWalk || playerData.isHide)
        {
            this.roleCon.rotation = this.ctrlRota  + 90
            this.showWalkMV();
        }
    }

    //攻击前方120度的怪
    public atkFront(nearItem,isDouble?){
        var playerData = this.data
        var monsterList = PKC.monsterList;
        var len = monsterList.length;
        var rota1 = PKTool.resetAngle(PKTool.getRota(playerData,nearItem,true));
        var atkRota = isDouble?120:90
        var atkRota1 = atkRota/2
        var atkRota2 = 360 - atkRota1
        var atk = playerData.getAtk();
        var beAtkStop = PKC.actionStep + 10;
        for(var i=0;i<len;i++)
        {
            var monster = monsterList[i];
            if(monster.isDie)
                continue;
            var dis = MyTool.getDis(monster,playerData)
            if(dis < playerData.atkDis)
            {
                var rotaBase = PKTool.getRota(playerData,monster);
                var rota2 = PKTool.resetAngle(rotaBase/Math.PI*180);
                var rotaDes = Math.abs(rota2 - rota1)
                if(rotaDes > atkRota1 && rotaDes < atkRota2)
                    continue;
                //在攻击范围内，可造成伤害
                var atk2 = 1+Math.max(0,(100-dis)/100);
                if(isDouble)
                    monster.addHp(-Math.ceil(atk*(1+playerData.doubleValue)*atk2));
                else
                    monster.addHp(-Math.ceil(atk*atk2));
                monster.beAtkStop = beAtkStop;
                if(playerData.hitBack && monster.hitBackAble)//可击退
                {
                    var hitBack = playerData.hitBack
                    if(isDouble)
                        hitBack *= 1.2;
                    var x = Math.cos(rotaBase)*hitBack
                    var y = Math.sin(rotaBase)*hitBack
                    monster.relateItem.resetXY(monster.x+x,monster.y+y)
                }
                playerData.addGunBuff(monster,true)
            }
        }
    }

    public testFarAtk(){
        var playerData = this.data
        if(!playerData.canAtk())
            return;
        playerData.lastAtkTime = PKC.actionStep;
        var bullet = PKCodeUI.getInstance().shoot(playerData,this.ctrlRota/180*Math.PI);
        bullet.setImage( 'knife_'+playerData.gunid+'_png');
        bullet.endTime = PKC.actionStep + 60
        bullet.speed = 30
        bullet.hitBack = 20
        bullet.hitSkill = true
        bullet.atk = Math.ceil(playerData.farAtkRate*playerData.atk)
        if(Math.random() < playerData.doubleRate)
            bullet.atk = Math.ceil(bullet.atk*playerData.doubleValue)

        this.showShootMV();


    }

    public testAtk(){
        var playerData = this.data
        if(playerData.isDie)
            return;
        if(!playerData.canAtk())
            return;

        var monsterList = PKC.monsterList;
        var len = monsterList.length;
        var nearLen = 999;
        var nearItem;
        for(var i=0;i<len;i++)
        {
            var monster = monsterList[i];
            if(monster.isDie)
                continue;
            var dis = MyTool.getDis(monster,playerData)
            if(dis < playerData.atkDis)
            {
                //如果玩家控制方向直接有怪，则攻击这个怪
                var rota2 = PKTool.resetAngle(PKTool.getRota(playerData,monster,true));
                var rotaDes = Math.abs(rota2 - this.ctrlRota)
                if(rotaDes < 15 || rotaDes > 345)
                {
                    nearItem = monster;
                    break;
                }

                if(!nearItem || dis < nearLen)
                {
                    nearItem = monster;
                    nearLen = dis;
                }
            }
        }
        playerData.hitEnemy = nearItem;
        if(nearItem)//最近的怪
        {
            playerData.lastAtkTime = PKC.actionStep;
            var isDouble = Math.random() < playerData.doubleRate
            var atkRota = PKTool.getRota(playerData,nearItem.getHitPos())
            if (isDouble) {
                this.showDoubleMV();
                PKCodeUI.getInstance().playerAtk(2,atkRota,playerData.atkDis)
            }
            else
            {
                this.showAtkMV();
                PKCodeUI.getInstance().playerAtk(1,atkRota,playerData.atkDis)
            }
            PKMonsterAction_wx3.getInstance().addList({
                target:playerData,
                onlyID:playerData.onlyID,
                step:5,
                fun:()=>{
                    this.atkFront(nearItem,isDouble);
                }
            })
        }
    }

}