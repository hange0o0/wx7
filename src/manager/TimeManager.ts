class TimeManager_wx4 {

	public constructor() {
	}
	
    private static _instance: TimeManager_wx4;
    
    public static getInstance():TimeManager_wx4{
        if(!TimeManager_wx4._instance)
            TimeManager_wx4._instance = new TimeManager_wx4();
        return TimeManager_wx4._instance;
    }

    public timeDiff: number = 0;
    public timeDiffMs: number = 0;

    public initlogin(time:number):void{
        this.timeDiffMs = Date.now() - time*1000
        this.timeDiff = Math.floor(this.timeDiffMs / 1000);
    }

    public now():number{
        return Math.floor(this.nowMS() / 1000)//Math.floor(Date.now() / 1000) - this.timeDiff //+ 24*3600 *7;
    }
    public nowMS():number{
        return Date.now() - this.timeDiffMs //+ 24*3600 *7;
    }

    public getLastDayOfWeekDate(time:number, endDay:any):Date{
        endDay = endDay || 5;
        //得到今天是周几
        var d = new Date(time * 1000);
            var curDay = d.getDay();
            var add = endDay > curDay
            ? endDay - curDay
            : 7 - (curDay - endDay);
            
            return new Date(d.getTime() + add * 24 * 3600 * 1000);
    }
    
    public offsetDate():Date{
        var offsetTime = -21600;
        var time = this.now();
        time += offsetTime;
        return DateUtil_wx4.timeToChineseDate(time);
    }
    
    public chineseDate():Date{
        return DateUtil_wx4.timeToChineseDate(this.now());
    }
    
    public getNextDateTime():number{
        return DateUtil_wx4.getNextDateTimeByHours(6);
    }
    
}
