class GardenAStarModel implements IMapTileModel{
    public array = [];
    public isBlock(p_startX : number, p_startY : number, p_endX : number, p_endY : number){
        //return 1;
        //p_startX = Math.floor(p_startX/10)
        //p_startY = Math.floor(p_startY/10)
        //p_endX = Math.floor(p_endX/10)
        //p_endY = Math.floor(p_endY/10)
        if(this.array[p_startY] && this.array[p_startY][p_startX])
        {
            if(this.array[p_endY])
                return this.array[p_endY][p_endX] || 0;
        }
        return 0;
    }

    public reset(){
        this.array.length = 0;
    }

    public setOK(y,x){
        if(!this.array[y])
            this.array[y] = [];
        this.array[y][x] = 1;
    }
    public setNotOK(y,x){
        if(!this.array[y])
            this.array[y] = [];
        this.array[y][x] = 0;
    }

    public checkCanPass(x,y)
    {
        return this.array[y] && this.array[y][x] || 0
    }
}