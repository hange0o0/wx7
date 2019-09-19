class GBase {

    public static getClass(id){
        switch (Math.floor(id)){
            case 1:return G1;
            case 49:return G49;
        }
    }

    public static getItem(id):GBase{
        var cls = this.getClass(id);
        var item = new cls();
        item.id = id;
        return item;
    }


    public id;


    public getVO(){
        return GunVO.getObject(this.id)
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