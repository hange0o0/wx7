class MTool {
    public static getDistance(){

    }

    public static nearAtkFun(itemData,fun?,fun2?){
        PKMonsterAction_wx3.getInstance().addList({
            target:itemData,
            onlyID:itemData.onlyID,
            step:itemData.getVO().mvAtk,
            fun:()=>{
                fun2 && fun2();
                if(MyTool.getDis(itemData,PKC.playerData) <= itemData.atkDis + itemData.atkDisAdd)
                {
                    var playerData = PKC.playerData
                    playerData.addHp(-itemData.atk,itemData);
                    fun && fun();
                }
            }
        })
    }

    private static getXYKey(x,y,r){
        x = Math.round(x/r);
        y = Math.round(y/r);
        return x + '_' + y;
    }


    //
    public static markAtkFun(r,num,markData){

        var playerData = PKC.playerData;
        var middle = {x:playerData.x,y:playerData.y};
        var markArr = []
        var keyObj = {}
        var itemWidth = 100
        var testNum = 100

        markArr.push({x:playerData.x + Math.random()*20-10,y:playerData.y + Math.random()*20-10})
        keyObj[this.getXYKey(playerData.x,playerData.y,itemWidth)] = 1;
        num --;

        while(num > 0 && testNum > 0)
        {

            testNum --;
            var x = middle.x - r + Math.random()*r*2;
            var y = middle.y - r + Math.random()*r*2;
            var key = this.getXYKey(x,y,itemWidth)
            if(keyObj[key])
                continue;
            num --;
            keyObj[key] = 1;
            markArr.push({x:x,y:y})
        }

        var len = markArr.length
        for(var i=0;i<len;i++)
        {
            var oo = markArr[i];
            PKCodeUI.getInstance().addMark(oo.x,oo.y,markData)
        }
    }

    public static moveSkillFun(monster,skillData){
        var playerData = PKC.playerData
        if(skillData.isFootPos)
            var hitPoint = monster
        else
            var hitPoint = monster.getHitPos();
        var rota = Math.atan2(playerData.y - hitPoint.y,playerData.x-hitPoint.x)/Math.PI*180 - 90
        return PKCodeUI.getInstance().addLine(hitPoint.x,hitPoint.y,rota,{
            isFollow:skillData.isFollow,
            isFootPos:skillData.isFootPos,
            owner:monster,
            len:1000,
            type:'mark',
            endFun:skillData.endFun
        })
    }

    public static addNewMonster(data){
        var mData = PKCodeUI.getInstance().addMonster(data.mid,data.x,data.y);
        if(data.hp)
        {
            mData.hp = data.hp;
            mData.relateItem.renewHp();
        }
        PKC.monsterList.push(mData)
        mData.isCall = true;
        return mData
    }

    public static getNearMonster(){
        var playerData = PKC.playerData
        var monsterList = PKC.monsterList;
        var len = monsterList.length;
        if(len == 0)
            return false;
        var minMonster;
        var minDis;
        for(var i=0;i<len;i++)
        {
            var monster = monsterList[i];
            if(monster.isDie)
                continue;
            if(!monster.beSkillAble)
                continue;

            var dis = MyTool.getDis(monster,playerData)
            if(!minMonster || dis < minDis)
            {
                minMonster = monster
                minDis = dis
            }
        }

        return minMonster;
    }

}