class SBase {

    public static getClass(id){
        switch (Math.floor(id)){
            case 1:return S1;
            case 2:return S2;
            case 3:return S3;
            case 4:return S4;
            case 5:return S5;
            case 6:return S6;
            case 7:return S7;
            case 8:return S8;
            case 9:return S9;
            case 10:return S10;
            case 11:return S11;
            case 12:return S12;
            case 13:return S13;
            case 14:return S14;
            case 15:return S15;
            case 16:return S16;
            case 17:return S17;
            case 18:return S18;
            case 19:return S19;
            case 20:return S20;
            case 21:return S21;
            case 22:return S22;
            case 23:return S23;
            case 24:return S24;
            case 25:return S25;
            case 26:return S26;
            case 27:return S27;
            case 28:return S28;
            case 29:return S29;
            case 30:return S30;
            case 31:return S31;
            case 32:return S32;
            case 33:return S33;
            case 34:return S34;
            case 35:return S35;
            case 36:return S36;
            case 37:return S37;
            case 38:return S38;
            case 39:return S39;
            case 40:return S40;
            case 41:return S41;
            case 42:return S42;
            case 43:return S43;
            case 44:return S44;
            case 45:return S45;
            case 46:return S46;
            case 47:return S47;
            case 48:return S48;
            case 49:return S49;
            case 50:return S50;
            case 51:return S51;
            case 52:return S52;
        }
    }

    public static getItem(id):SBase{
        var cls = this.getClass(id);
        var item = new cls();
        item.sid = id;
        item.isActive = item.getVO().cd > 0;
        item.maxCD = PKTool.getStepByTime(item.getVO().getCD());

        //item.maxCD = 10
        return item;
    }


    public sid;
    public isActive;
    public maxCD;

    public getVO(){
        return SkillVO.getObject(this.sid)
    }

    public getValue(index){
        return this.getVO().getValue(index)
    }



    public onMove(){

    }

    public onAtk(){

    }

    public onDie(){

    }

    public onHit(){

    }

    public onBeHit(monster){

    }

    public onKill(){

    }

    public onUse(){

    }

    public onCreate(){

    }

    public onStep(){

    }

    public onRemoveSkill(){

    }
}