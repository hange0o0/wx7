class MonsterVO {
    public static dataKey = 'monster';
    public static key = 'id';
    public static getObject(id): MonsterVO{ //id有可能带\n or \r
        return CM_wx4.table[this.dataKey][Math.floor(id)];
    }
    public static get data(){
        return CM_wx4.table[this.dataKey]
    }

    public isMonster = true;
    public temp


    public width: number;
    public height: number;
    public mcheight: number;
    public mcwidth: number;






    public id: number;
    public name: string;
    public des: string;
    public level: number;
    public diesound: number;
    public cost: number;

    public atk: number;
    public atkcd: number;
    public atkstop: number;
    public atkrage: number;
    public isfar: number;
    public speed: number;
    public hp: number;


    public mvAtk;//攻击前摇
    public constructor() {

    }

    public reInit(){
        this.atkcd = this.atkcd * 1000
        this.atkstop = this.atkstop * 1000

        if(this.isHero)
            this.mvAtk = 15
        else
            this.mvAtk = 10
    }


    public isHero(){
        return this.id > 100;
    }

    public playDieSound(){
        if(this.id == 99)
            SoundManager.getInstance().playEffect('die')
        else if(this.isHero())
            SoundManager.getInstance().playEffect('enemy_dead4')
        else
            SoundManager.getInstance().playEffect('enemy_dead' + this.diesound)
    }

    public getThumb(){
        return 'm_head'+this.id+'_jpg'
    }

    private enemys;
    public getEnemys(){
        if(!this.enemys)
        {
            this.enemys = [];

            for(var s in GunVO.data)
            {
                var gvo = GunVO.data[s];
                if(gvo.enemys.indexOf(this.id + '') != -1)
                    this.enemys.push(gvo)
            }
            ArrayUtil_wx4.sortByField(this.enemys,['level','id'],[0,0])
        }
        return this.enemys
    }
}