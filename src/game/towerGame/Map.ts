class Map extends eui.Group {
    public constructor() {
        super();
        this.cacheAsBitmap = true
    }
    public pool = [];
    public mapItem = [];


    public isGame = true
    public randomSeed
    public random(seedIn?){
        var seed = seedIn || this.randomSeed;
        seed = ( seed * 9301 + 49297 ) % 233280;
        var rd = seed / ( 233280.0 );
        if(!seedIn)
            this.randomSeed = rd * 100000000;
        return rd;
    }

    //用于绘制地图的材资
    public initMap(randomSeed){
        this.randomSeed = randomSeed;
    }

    //10*15
    //画图
    public draw(mapArr){
        if(this.mapItem.length)
        {
            this.pool = this.pool.concat(this.mapItem)
            this.mapItem.length = 0;
        }

        this.removeChildren()

        //先扩张数据

        for(var i=0;i<mapArr.length;i++)
        {
            var len = mapArr[i].length
            for(var j=0;j<len;j++)
            {
                this.addItem(j,i,mapArr[i][j])
            }
        }
    }

    public addItem(x,y,type){
        var id = Math.ceil(this.random(x*1000 + y*10000000 + this.randomSeed)*3)
        if(type == 5 || type == 6 || type == 7)
        {
            if(this.isGame)
            {
                type = 4
            }
            else
                id = 1;
        }


        var img = this.pool.pop() || new eui.Image()
        img.source = 'map_'+type+'_'+id+'_png';
        this.addChild(img);
        img.x =  x*64
        img.y =  y*64

        if(type == 1 || type == 4)
            img.y += 10
        //else if(type == 2)
        //    img.y -= 10
    }



}