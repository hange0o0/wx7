class PKTool {
    private static txtPool = [];
    private static wordList = []
    public static showHpChange(item,hp){
        if(hp == 0)
            return;
        var y = item.isPlayer?-40:300 - item.getVO().height - 20;
        var txt = this.txtPool.shift() || new eui.BitmapLabel()
        txt.text = ''
        txt.letterSpacing = -5
        txt.scaleX = txt.scaleY = 1;
        if(hp < 0)
        {
            txt.font = item.isPlayer?"pk_word4_fnt":"pk_word1_fnt"
            txt.text = hp
        }
        else
        {
            txt.font = "pk_word2_fnt"
            txt.text = '+' + hp
            if(item.isPlayer)
                txt.scaleX = txt.scaleY = 1.5;
        }
        this.showWordMC(txt,item.relateItem,y)
    }

    public static removeWordList(mc){
        var index = this.wordList.indexOf(mc);
        if(index != -1)
            this.wordList.splice(index,1)

        MyTool.removeMC(mc);
        if(mc instanceof eui.BitmapLabel)
        {
            index = this.txtPool.indexOf(mc);
            if(index == -1)
                this.txtPool.push(mc);
        }
    }

    public static showWordMC(mc,target,y){
        mc.horizontalCenter = 0
        target.addChild(mc);
        mc.y = y
        egret.Tween.get(mc).to({y:mc.y - 50},500).call(()=>{
            this.removeWordList(mc)
        })
        return mc;
    }



    public static getStepByTime(t){
        return Math.round(t*30/1000)
    }

    public static getRota(from,to,is180?)
    {
        var angle = Math.atan2(to.y-from.y,to.x-from.x)
        if(is180)
            return angle/Math.PI*180;
        return angle;
    }

    public static resetAngle(r){
        while(r<0)
            r+=360
        while(r>=360)
            r-=360
        return r;
    }



    /*
     {
     mvType:1,
     num:4,
     key:'zhen',
     type:'on',
     anX:167/2,
     anY:145/2,
     once:true,
     item:item,
     }
     */
    public static playMV(data){
        //var a = {
        //    mvType:1,
        //    num:4,
        //    key:'zhen',
        //    type:'on',
        //    anX:167/2,
        //    anY:145/2,
        //    once:true,
        //}
        var mv:any
        if(data.mvType == 1)//分开的图片组成
        {
            mv = MovieSimpleSpirMC.create();
            var arr = [];
            for(var i=1;i<=data.num;i++)
            {
                arr.push(data.key + '_' + i + '_png')
            }
            mv.setData(arr,84)
        }
        else{//合成的图片组成
            mv = MovieSimpleSpirMC2.create();
            mv.setData(data.url,data.width,data.height,data.num,84)
            mv.widthNum = data.widNum;
        }
        mv.anchorOffsetX = data.anX || 0;
        mv.anchorOffsetY = data.anY || 0;
        var xy = data.xy || data.item;
        mv.x = xy.x;
        mv.y = xy.y;

        if(data.type == 'on') {
            data.item.parent.addChild(mv)
        }
        else if(data.type == 'in')
        {
            data.item.addChild(mv)
        }
        else if(data.parent)
            data.parent.addChild(mv);

        if(data.once)
        {
            mv.once('complete',()=>{
                mv.dispose();
            },this)
            mv.gotoAndPay(0,1)
        }
        else
        {
            mv.gotoAndPay()
        }

        return mv
    }

    public static getMVList(key,num){
        var arr = [];
        for(var i=1;i<=num;i++)
        {
            arr.push( key + '_' + i + '_png')
        }
        return arr;
    }

    public static showLight(from,to){
        var mv = MovieSimpleSpirMC.create();
        var arr = [];
        for(var i=1;i<=3;i++)
        {
            arr.push( 'arc_' + i + '_png')
        }

        mv.setData(arr,84)
        mv.once('complete',()=>{
            mv.dispose();
        },this)
        mv.gotoAndPay(0,1)

        mv.icon.fillMode = 'repeat'
        mv.icon.width = MyTool.getDis(from,to);
        mv.anchorOffsetY = 35/2
        mv.anchorOffsetX = 0
        PKCodeUI.getInstance().bulletCon.addChild(mv);
        mv.x = from.x
        mv.y = from.y

        var angle = Math.atan2(to.y-from.y,to.x-from.x)
        mv.rotation = angle/Math.PI*180
    }



}


