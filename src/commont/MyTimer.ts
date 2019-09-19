class MyTimer extends egret.EventDispatcher {
    private cd = 0;
    private timer
    private lastTime = 0;
    public constructor(v) {
        super();
        this.cd = v;
        this.timer = new egret.Timer(v);
        this.timer.addEventListener(egret.TimerEvent.TIMER,this.onE,this)


    }

    private onE(){
        var total = egret.getTimer() - this.lastTime;
        var num = Math.floor(total/this.cd)
        //if(total > 200)
        //{
        //     console.log(total)
        //}
        if(total > 3000)//卡太久，跳过
        {
            this.dispatchEventWith(egret.TimerEvent.TIMER)
            this.lastTime = egret.getTimer();
            return;
        }
        while(num>0)
        {
            num--;
            this.dispatchEventWith(egret.TimerEvent.TIMER)
            this.lastTime += this.cd;
        }
    }

    public start(){
       this.timer.start();
        this.lastTime = egret.getTimer()
    }

    public stop(){
        this.timer.stop();
    }



}