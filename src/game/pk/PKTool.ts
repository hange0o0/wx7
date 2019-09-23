class PKTool {
      public static getStepByTime(t){
        return Math.round(t*30/1000)
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

}


