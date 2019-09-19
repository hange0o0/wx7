class SkillVO {
    public static dataKey = 'skill';
    public static key = 'id';
    public static getObject(id): SkillVO{ //id有可能带\n or \r
        return CM_wx4.table[this.dataKey][Math.floor(id)];
    }
    public static get data(){
        return CM_wx4.table[this.dataKey]
    }

    public id: number;
    public name: string;
    public des: string;
    public level: number;
    public cd: number;
    public cdup: number;
    public v1: number;
    public v1up: number;
    public v2: number;
    public v2up: number;
    public v3: number;
    public v3up: number;


    public temp

    public constructor() {

    }

    public reInit(){
        this.cd = this.cd*1000
        this.cdup = this.cdup*1000
    }

    public getThumb(){
        return 'skill_'+this.id+'_jpg'
    }

    public getCD(level = -1){
        if(level == -1)
            level = SkillManager.getInstance().getSkillLevel(this.id) || 1
        var v = this.cd || 0;
        var vup = this.cdup || 0;
        return v - vup*(level-1)
    }

    public getDes(){
        var level = SkillManager.getInstance().getSkillLevel(this.id) || 1
        var v1 = this.getValue(1,level)
        var v2 = this.getValue(2,level)
        var v3 = this.getValue(3,level)
        var str = this.des.replace('#1',this.createColor(MyTool.toFixed(v1,1)));
        str = str.replace('#2',this.createColor(MyTool.toFixed(v2,1)))
        str = str.replace('#3',this.createColor(MyTool.toFixed(v3,1)))
        str = str.replace('@1',this.createColor(Math.floor(v1) + ''))
        str = str.replace('@2',this.createColor(Math.floor(v2) + ''))
        str = str.replace('@3',this.createColor(Math.floor(v3) + ''))
        return str
    }

    private createColor(str){
        return ' ' + MyTool.createHtml(str,0xFFFF00) + ' '
    }

    public getValue(index,level=-1){
        if(level == -1)
            level = SkillManager.getInstance().getSkillLevel(this.id) || 1
        var v = this['v' + index] || 0;
        var vup = this['v' + index + 'up'] || 0;
        return v + vup*(level-1)
    }


}