class MBase {



    public mid;
    public onlyID = 0;
    public scale = 1;


    public isCall = false;//召唤OR分裂


    public size = 100//体积半径
    public hp = 100
    public maxHp = 100
    public _atk = 10
    public atkDis = 100
    public _speed = 2
    public atkSpeed = 60//帧
    public atkStop = 60//帧
    public beHitRate = 0
    public beAtkStop = 0//被攻击导至僵直

    public atkDisAdd = 20//判断命中时，增加的判断距离


    public bulletSpeed = 7//子弹速度

    public stopEnd = 0//这个时间前停止行动
    public atkEnd = 0//这个时间前停止行动 攻击中
    public skillEnd = 0//这个时间前停止行动 技能中
    public lastAtkTime = 0//最近一次攻击的时间

    public skillDis = 500//技能距离
    public skillCD = 0//5000//技能间隔
    public lastSkillTime = 0//最近一次技能时间


    public isFarAtk = 1
    public lastBeHitTime = 1//上一次被刀伤害的时间

    public beSkillAble = true;
    public trapAble = true;
    public hitBackAble = true;

    public moveStartTime//开始移动的时间

    public relateItem//
    public buffList = [];

    public x;
    public y;
    public isDie

    public initData(){
        var vo = this.getVO();
        this.size = vo.width/2
        this.atkDis = vo.atkrage + this.size + 40

        var rate = 1 + (UM_wx4.level-1)*0.2

        this.hp = this.maxHp = Math.floor(vo.hp*rate)
        this._atk = Math.floor(vo.atk *rate)
        this._speed = vo.speed/10
        this.atkSpeed = PKTool.getStepByTime(vo.atkcd);
        this.atkStop = PKTool.getStepByTime(vo.atkstop);
        this.isFarAtk = vo.isfar;


        this.lastSkillTime = PKC.actionStep
        this.lastAtkTime = PKC.actionStep - 100

        this.onCreate();
    }

    public get atk(){
        return this._atk + PKC.monsterAddAtk
    }
    public get speed(){
        return this._speed + PKC.monsterAddSpeed
    }

    public getHitPos(){
          return {
              x:this.x,
              y:this.y - this.getVO().height*0.4
          }
    }

    public getVO(){
        return MonsterVO.getObject(this.mid)
    }

    public addHp(v){
        if(v < 0 && this.beHitRate)
        {
            v = Math.floor(v*this.beHitRate)
        }

        this.hp += v;
        if(v<0)
        {
            this.onBeHit();
        }
        if(this.hp > this.maxHp)
        {
            this.hp = this.maxHp
        }
        else if(this.hp <= 0)
        {
            this.hp = 0;
            this.isDie = 1;
            this.relateItem.dieMV();
        }
        PKTool.showHpChange(this,v)
        this.relateItem.renewHp();
    }

    public canSkill(){
        return this.skillCD && PKC.actionStep - this.lastSkillTime >= this.skillCD;
    }

    public skillFun(){

    }

    public onCreate(){
    }

    public move(){

    }

    public atkFun(){

    }

    public onDie(){

    }

    public onBeHit(){

    }

    private delayStep  = 0;
    private delayFun ;
    public runDelay(fun,cd){
        this.delayStep = cd;
        this.delayFun = fun;
    }
    public onDelay(){
        if(this.delayStep > 0)
        {
            this.delayStep --;
            if(this.delayStep == 0)
            {
                this.delayFun && this.delayFun.apply(this);
            }
        }
    }

    //如果长时间一直移动没攻击,则闪到玩家身后
    public changeRandomPos(dis,angle){
        this.moveStartTime = 0;
        dis += 300 + Math.random()*300;
        angle += -Math.PI/4 + Math.random()*Math.PI/2
        var x = this.x + Math.cos(angle) * dis
        var y = this.y + Math.sin(angle) * dis
        this.relateItem.resetXY(x,y);

        this.skillEnd = PKC.actionStep + 10;
        this.relateItem.visible = false;
        var mv = PKTool.playMV({
            mvType:1,
            num:5,
            key:'zhaohuan',
            type:'on',
            anX:98/2,
            anY:89/2,
            item:this.relateItem,
            once:true,
            xy:this.getHitPos()
        })
        mv.scaleX = mv.scaleY = 1.5

        this.runDelay(()=>{
            this.relateItem.visible = true;
        },5)
    }



    public onStep(){
        //雷电法师 召唤闪电
        //幻影剌客  闪过去攻击
        //宝石狂徒  远程，直线3个
        //矿工    基础
        //重装撕裂者 攻高
        //狂战士   冲过去，过程会造成伤害
        //斧王        冲过去攻击
        //守卫者   拆陷阱
        //掌旗使    大范围增加攻击力,移动速度
        //回血，单体电
        //蛮荒兽人 魔免
        //基础
        //烧
        //盾卫    高防
        //近战巫师 死后变成毒巫师
        //毒巫师 攻击时有几率分身
        //铁甲卫士  不会被打退
        //饥饿兽人  自动回血
        //黑耀石菇  激光
        //碧玉药菇     瞄准激光
        //橙光仙菇     移动激光
        //蓝瘦香菇  追踪激光
        //炽红花菇  两条合起来的激光
        //牛头人      一次复活
        //豌豆射手  攻速快
        //黑石守卫  攻击范围大
        //橙石守卫  攻击范围大
        //蓝石守卫  攻击范围大
        //红石守卫  攻击范围大
        //黑色风暴  远程风
        //红色风暴  召唤风,持续一段时间
        //蓝色风暴  召唤风+移动
        //橙色风暴  追踪风
        //溶岩精灵  喷火
        //黑泥怪   自爆
        //橙泥怪   自爆 血
        //绿泥怪   自爆 定时分裂
        //骷髅弓箭手 瞄准 ＋ 快剪
        //骷髅士兵  平
        //死神    闪过去攻击
        //骷髅矿工  死后变骷髅士兵*2
        //幽灵    前方随机多个球攻击
        //亡灵    移动快
        //蓝泥怪   自爆 速
        //巫妖    扇形
        //红袍怨灵 召唤骷髅弓箭
        //木乃伊   吸血
        //白袍怨灵 召唤骷髅士兵
        //红泥怪   自爆 攻

        //********ｂｏｓｓ都会召唤
        //幽魂    死后分裂，３次
        //幽鬼    分裂
        //地狱巨龙　喷火
        //针刺兽   不会被打退 + 魔免
        //钢刺兽  吸血
        //大包兽   攻击范围大
        //神圣波利  复活2次
        //恶魔波利  死后爆出N个自爆
        //巫鼠   前方随机多个球攻击
        //天使    大范围加血

    }


    /****************************************************************************/
    private static id = 1;
    public static getClass(id){
        switch (Math.floor(id)){
            case 1:return M1;
            case 2:return M2;
            case 3:return M3;
            case 4:return M4;
            case 5:return M5;
            case 6:return M6;
            case 7:return M7;
            case 8:return M8;
            case 9:return M9;
            case 10:return M10;
            case 11:return M11;
            case 12:return M12;
            case 13:return M13;
            case 14:return M14;
            case 15:return M15;
            case 16:return M16;
            case 17:return M17;
            case 18:return M18;
            case 31:return M31;
            case 32:return M32;
            case 33:return M33;
            case 34:return M34;
            case 35:return M35;
            case 36:return M36;
            case 38:return M38;
            case 39:return M39;
            case 40:return M40;
            case 41:return M41;
            case 42:return M42;
            case 43:return M43;
            case 44:return M44;
            case 45:return M45;
            case 46:return M46;
            case 48:return M48;
            case 61:return M61;
            case 62:return M62;
            case 63:return M63;
            case 64:return M64;
            case 65:return M65;
            case 66:return M66;
            case 67:return M67;
            case 68:return M68;
            case 69:return M69;
            case 70:return M70;
            case 71:return M71;
            case 72:return M72;
            case 73:return M73;
            case 74:return M74;
            case 76:return M76;

            case 101:return M101;
            case 102:return M102;
            case 103:return M103;
            case 104:return M104;
            case 105:return M105;
            case 106:return M106;
            case 107:return M107;
            case 108:return M108;
            case 109:return M109;
            case 110:return M110;

        }
    }

    public static getItem(id){
        var cls = this.getClass(id);
        var item = new cls();
        item.mid = id;
        item.onlyID = this.id;
        item.initData();
        this.id++;
        return item;
    }
}