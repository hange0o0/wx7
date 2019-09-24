class PKMonsterMV_wx3 extends eui.Group {
    private static pool = [];
    public static createItem():PKMonsterMV_wx3{
        var item:PKMonsterMV_wx3 = this.pool.pop();
        if(!item)
        {
            item = new PKMonsterMV_wx3();
            item.touchChildren = item.touchEnabled =false;
        }
        return item;
    }
    public static freeItem(item){
        if(!item)
            return;
        item.remove();
        if(this.pool.indexOf(item) == -1)
            this.pool.push(item);
    }

    public monsterMV:MonsterMV
    public currentMV;

    public id;
    public set speed(v){
        this.currentMV.speed = v;
    }

    public get speed(){
        return this.currentMV.speed;
    }

    public get state(){
        return this.currentMV.state;
    }

    public remove(){
        this.stop()
        MyTool.removeMC(this);
    }

    public showHeight(){
        return MonsterVO.getObject(this.id).height
    }
    public showWidth(){
        return MonsterVO.getObject(this.id).width
    }
    private wx3_fun_asdfasdfasdf(){}
    private wx3_fun_ast34(){}

     public load(id){
         this.id = id;
         //if(id == 1)
         //    id = 101
         var vo = MonsterVO.getObject(id)
         if(this.currentMV)
             this.currentMV.stop();
         MyTool.removeMC(this.currentMV)

         if (!this.monsterMV) {
             this.monsterMV = new MonsterMV()
             this.monsterMV.addEventListener('mv_die', this.fireDie, this)
         }

         this.currentMV = this.monsterMV;
         this.addChild(this.monsterMV)
         this.monsterMV.load(id)


     }

    private fireDie(){
        this.dispatchEventWith('mv_die')
    }

     public reset(){
         this.currentMV.reset();
     }

     public play(){
         this.currentMV.play();
     }

     public stop(){
         if(this.currentMV)
            this.currentMV.stop();
     }

     public run(){
         this.currentMV.run();
     }

     public stand(){
         this.currentMV.stand();
     }

     public atk(){
         this.currentMV.atk();
     }

     public die(){
         this.currentMV.speed = 0
         this.currentMV.die();
     }

    public onE(){
        this.currentMV && this.currentMV.onE && this.currentMV.onE();
    }
}