class S30 extends SBase{
    constructor() {
        super();
    }

    public addRate = 0.2
    public hurtRate = 0.5
    public total = 300



    private addAtk;
    private addAtkDis;
    private addHitBack;
    private addSpeed
    private addAtkSpeed

    public step = 0

    public onCreate(){

        this.addRate = this.getValue(1)/100
        this.hurtRate = this.getValue(2)/100
        this.total = PKTool.getStepByTime(this.getValue(3)*1000)
    }


    public onUse(){
        var playerData = PKC.playerData;

        playerData.behurtAdd += this.hurtRate;

        this.addAtk = Math.ceil(playerData.atk * this.addRate)
        this.addAtkDis = Math.ceil(playerData.atkDis * this.addRate)
        this.addHitBack = Math.ceil(playerData.hitBack * this.addRate)
        this.addSpeed = Math.ceil(playerData.speed * this.addRate)
        this.addAtkSpeed = -Math.ceil(playerData.atkSpeed * this.addRate)


        playerData.atk += this.addAtk
        playerData.atkDis += this.addAtkDis
        playerData.hitBack += this.addHitBack
        playerData.speed += this.addSpeed
        playerData.atkSpeed += this.addAtkSpeed

        this.step = this.total;
        playerData.relateItem.renewSkin(7)

        return true;
    }

    public onStep(){
        if(this.step > 0)
        {
            this.step --;
            if(this.step == 0)
            {
                var playerData = PKC.playerData;

                playerData.behurtAdd -= this.hurtRate;
                playerData.atk -= this.addAtk
                playerData.atkDis -= this.addAtkDis
                playerData.hitBack -= this.addHitBack
                playerData.speed -= this.addSpeed
                playerData.atkSpeed -= this.addAtkSpeed

                playerData.relateItem.renewSkin(1)
            }
        }
    }
}