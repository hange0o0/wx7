class GunVO {
    public static dataKey = 'gun';
    public static key = 'id';
    public static getObject(id): GunVO{ //id有可能带\n or \r
        return CM_wx4.table[this.dataKey][Math.floor(id)];
    }
    public static get data(){
        return CM_wx4.table[this.dataKey]
    }


    public id: number;
    public name: string;
    public level: number;
    public atk: number;
    public atkspeed: number;
    public atkdis: number;
    public shootnum: number;
    public skilltype: string;
    public sv1: number;
    public sv2: number;
    public enemy: string;



    public enemys
    public constructor() {

    }

    public reInit(){
        this.enemys = this.enemy.split(',')
    }

    private enemyVOs
    public getEnemys(){
       if(!this.enemyVOs)
       {
           this.enemyVOs = [];
           for(var i=0;i<this.enemys.length;i++)
           {
               this.enemyVOs.push(MonsterVO.getObject(this.enemys[i]))
           }
           ArrayUtil_wx4.sortByField(this.enemyVOs,['level','id'],[0,0])
       }
        return this.enemyVOs;
    }

    //对这个怪有攻击加成
    public isAtkAdd(mid){
       return this.enemys.indexOf(mid+'') != -1
    }

    public getThumb(){
        return 'thum_'+this.id+'_png'
    }

    public getUrl(){
        return 'knife_'+this.id+'_png'
    }

    public getDes(){
        switch(this.skilltype)
        {
            case 'ice':
                return '降低目标 ' + MyTool.createHtml('50%',0xFFFF00) + ' 的移动速度，持续 '+ MyTool.createHtml(this.sv1,0xFFFF00) + '秒'
            case 'fire':
                return '点燃目标，每秒造成 ' + MyTool.createHtml('50',0xFFFF00) + ' 点伤害，持续 '+ MyTool.createHtml(this.sv1,0xFFFF00) + '秒'
            case 'poison':
                return '使目标中毒，每秒造成 ' + MyTool.createHtml('20',0xFFFF00) + ' 点伤害，直至目标死亡'
            case 'yun':
                return '有 ' + MyTool.createHtml(this.sv1 + '%',0xFFFF00) + ' 的机率使目标陷入晕眩，持续 '+ MyTool.createHtml(this.sv2,0xFFFF00) + '秒'
            case 'atk':
                return '增加' + MyTool.createHtml(this.sv1 + '格',0xFFFF00) + '范围内所有武器 ' + MyTool.createHtml(this.sv2 + '%',0xFFFF00) + ' 的攻击力,可以叠加'
            case 'speed':
                return '增加' + MyTool.createHtml(this.sv1 + '格',0xFFFF00) + '范围内所有武器 ' + MyTool.createHtml(this.sv2 + '%',0xFFFF00) + ' 的攻击速度,可以叠加'
            case 'dis':
                return '增加' + MyTool.createHtml(this.sv1 + '格',0xFFFF00) + '范围内所有武器 ' + MyTool.createHtml('1格',0xFFFF00) + ' 的攻击距离,不可叠加'
        }
        return ''
    }


}