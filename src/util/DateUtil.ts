/**
 *
 * @author 
 *
 */
class DateUtil_wx4 {
    private static offsetTime: number = 0// -21600//6*3600 6小时修正（当日6点至次日6点为一天、本月1号6点至次月1号6点为一个月）
    
    public constructor() {
    }
		
    //是不是同一周
    public static isSameWeek(time1: number,time2?: number): boolean {
        if(Boolean(time2) == false)
            time2 = TimeManager_wx4.getInstance().now();
        return DateUtil_wx4.getWeekDec(time1,time2) == 0;
    }
	
    //转化为北京时间的Date
    public static timeToChineseDate(time: number): Date {
        var date = new Date(time * 1000);
        date.setMinutes(date.getMinutes() + 480 + date.getTimezoneOffset());
        return date;
    }
	
    //是否同一天
    public static isSameDay(time1: number,time2?: number,offset = -1): boolean {
        var oft = DateUtil_wx4.offsetTime
        if(offset != -1)
            oft = offset;

        if(Boolean(time2) == false)
            time2 = TimeManager_wx4.getInstance().now();
        time1 -= oft;
        time2 -= oft;

        var date1 = DateUtil_wx4.timeToChineseDate(time1);
        var date2 = DateUtil_wx4.timeToChineseDate(time2);

        if(date1.getDate() == date2.getDate() && date1.getMonth() == date2.getMonth() && date1.getFullYear() == date2.getFullYear())
            return true;
        return false;
    }
	
    //与今天的天数差异，以6点为界
    public static getDayDes(time: number, isZero?: boolean): number {
        var ttt = DateUtil_wx4.offsetTime;
        if(isZero)
            ttt = 0;
        var t1 = time + ttt;
        var t2 = TimeManager_wx4.getInstance().now() + ttt;
        var date1 = DateUtil_wx4.timeToChineseDate(t1);
        var date2 = DateUtil_wx4.timeToChineseDate(t2);
        if(t1 >= t2) {
            return DateUtil_wx4.datediff(date1,date2)
        }
        else {
            return -DateUtil_wx4.datediff(date2,date1)
        }
    }

    public static isThisDate(time: number): boolean {
        time += DateUtil_wx4.offsetTime;
        var date1 = DateUtil_wx4.timeToChineseDate(time);
        var date2 = DateUtil_wx4.timeToChineseDate(TimeManager_wx4.getInstance().now());
        return date1.getDate() == date2.getDate();
    }
	
    //判断时间戳是否是当前月
    public static isThisMonth(time: number): boolean {
        var date1 = DateUtil_wx4.timeToChineseDate(time);
        var date2 = DateUtil_wx4.timeToChineseDate(TimeManager_wx4.getInstance().now());
        return date1.getMonth() == date2.getMonth()
    }
    
    //转成 XX：XX：XX 格式
    public static getStringBySecond(value: number): string {
        if(value < 0)
            value = 0;
        var hour = Math.floor(value / 3600);
        var minute = Math.floor((value % 3600) / 60);
        var second = Math.floor(value % 60);
        var msg = "";

        var h = "" + hour;
        if(h.length < 2)
            h = "0" + h;
        msg += h;
        var m = "0" + minute;
        m = m.substr(m.length - 2,2);
        msg += ":" + m;
        var s = "0" + second;
        s = s.substr(s.length - 2,2);
        msg += ":" + s;

        return msg;
    }
    
    //比较天数差异   (前大后小)
    public static datediff(startTime: Date,endTime: Date): number {
        if(startTime == null || endTime == null)
            return 0;

        var pd = 8 + new Date().getTimezoneOffset() / 60;
        startTime.setHours(0 - pd);
        startTime.setMinutes(0);
        startTime.setSeconds(0);
        startTime.setMilliseconds(0);
        endTime.setHours(0 - pd);
        endTime.setMinutes(0);
        endTime.setSeconds(0);
        endTime.setMilliseconds(0);

        return (startTime.getTime() - endTime.getTime()) / (24 * 3600000);
    }
    
    //判断两个时间错相差的周数 (注意这个 周1到周7为同一周)  0点
    public static getWeekDec(time1: number,time2: number): number {
        var min = Math.min(time1,time2);
        var max = Math.max(time1,time2);
        var d1 = DateUtil_wx4.timeToChineseDate(min);
        var d2 = DateUtil_wx4.timeToChineseDate(max);

        var pd = 8 + new Date().getTimezoneOffset() / 60;

        var w = (d1.getDay() || 7) - 1;
        newDate(d1,d1.getDate() - w,-pd,0,0);

        var w = (d2.getDay() || 7) - 1;
        newDate(d2,d2.getDate() - w,-pd,0,0);

        function newDate(date,d,h,m,s) {
            date.setDate(d);
            date.setHours(h);
            date.setMinutes(m);
            date.setSeconds(s);
        }

        return (d2.getTime() - d1.getTime()) / 24 / 3600 / 1000 / 7;
    }
    
    /**
    * 获取北京时间xx点的时间戳
    * @param h
    * @returns {number}
    */
    public static getNextDateTimeByHours(h: number): number {
        var now = TimeManager_wx4.getInstance().now();
        var date = new Date(now * 1000);
        var diffMinus = -480 - date.getTimezoneOffset();//和本地时区的 分钟间隔
        var localMinutes = (h - date.getHours()) * 60 + diffMinus//转换为本地时间
        var newMintes = localMinutes;
        if(localMinutes <= 0) newMintes += 24 * 60;//跨天了
        if(localMinutes <= -24 * 60) newMintes += 24 * 60;//西时区 跨了两天的情况
        date.setMinutes(newMintes);
        date.setSeconds(0);
        return Math.floor(date.getTime() / 1000);
    }
    
    /**
    * 获取某个时间的时间对象
    * @param h
    * @returns {number}
    */
    public static getNextChineseDateByHours(h: number,date: Date): Date {
        date = date || TimeManager_wx4.getInstance().chineseDate();
        if(date.getHours() >= h)
            date.setDate(date.getDate() + 1);
        date.setHours(0);
        date.setMinutes(0);
        date.setSeconds(0);
        return date;
    }

    public static getStringBySeconds(m: number,isSimple?: boolean,type?: number,addNumber?: number): string {
        if(m < 0)
            m = 0;
        isSimple = isSimple || false;
        type = type || 0;
        addNumber = addNumber || 0;
        
        
        //把秒换成分钟
        var second = m % 60;
        var temp = Math.floor(m / 60);
        var day = Math.floor(temp / (60 * 24));
        var hour = Math.floor((temp / 60)) % 24;
        var minute = temp % 60;

        var t = "";
        if(day != 0) {
            t += (day + addNumber) + "天";
            if(isSimple) {
                return t;
            }
        }
        if(hour != 0) {
            t += (hour + addNumber) + "小时";
            if(isSimple) {
                return t;
            }

            if(type == 2 && day != 0)
                return t;
        }
        if(minute != 0) {
            if(isSimple) {
                t += (minute + addNumber) + "分钟";
                return t;
            }
            else {
                t += (minute + addNumber) + "分";
            }
            if(type == 2 && hour != 0)
                return t;
        }
        if((day == 0 && hour == 0) || type == 3) {

            if(isSimple && type == 1) {
                t = DateUtil_wx4.getStringBySecond(m);//XX：XX：XX格式
                return t.substr(-5);
            }
            t += second + "秒";
            if(isSimple || type == 3) {
                return t;
            }

            if(type == 2 && minute != 0)
                return t;
        }
        if(second < 0) {
            return "";
        }
        return t;
    }

    public static getMonthWeek(a: number): number {
        /*
        a = d = 当前日期
        b = 6 - w = 当前周的还有几天过完（不算今天）
        a + b 的和在除以7 就是当天是当前月份的第几周
        */
        var date = this.timeToChineseDate(a),
            w = date.getDay(),
            d = date.getDate();
        return Math.ceil(
            (d + 6 - w) / 7
            );
    }

    public static getStringByDate(date: Date,type: number): string {
        if(type == 1) {
            var h: string = "" + date.getFullYear();
            var m: string = "0" + (date.getMonth() + 1);
            var s: string = "0" + date.getDate();
            return h + "-" + m.substr(m.length - 2,2) + "-" + s.substr(s.length - 2,2);
        }

        var h: string = "0" + date.getHours();
        var m: string = "0" + date.getMinutes();
        var s: string = "0" + date.getSeconds();
        return h.substr(h.length - 2,2) + ":" + m.substr(m.length - 2,2) + ":" + s.substr(s.length - 2,2);
    }

    public static StringToDate(s: string): Date {
        if(s == null || s == "") return new Date();

        var Sarr = s.split(" ");
        if(Sarr.length != 2) return new Date();

        var Darr: Array<any> = (Sarr[0]).split("-");
        if(Darr.length != 3) return new Date();

        var Tarr: Array<any> = (Sarr[1]).split(":");
        if(Tarr.length != 3) return new Date();
        //构造服务端时间的时间戳，不用关注客户端的时区 打印的也是服务器电脑时间
        var da = new Date(<number> Darr[0],Darr[1] - 1,Darr[2],Tarr[0],Tarr[1],Tarr[2]);
        return da;
    }
    
    //str: "2015-07-15 0:0:0"
    public static getTimestampByChineseDate(str: string): number {
        var date = DateUtil_wx4.StringToDate(str);
        var diffMinus = -480 - date.getTimezoneOffset();//和本地时区的 分钟间隔
        date.setMinutes(date.getMinutes() - diffMinus);
        return Math.floor(date.getTime() / 1000);
    }
    
    //格式化日期 例: DateUtils.formatDate('yyyy-MM-dd hh:mm', new Date());
    public static formatDate(format,date): string {

        var o = {
            "M+": date.getMonth() + 1, //month
            "d+": date.getDate(),    //day
            "h+": date.getHours(),   //hour
            "m+": date.getMinutes(), //minute
            "s+": date.getSeconds(), //second
            "q+": Math.floor((date.getMonth() + 3) / 3),  //quarter
            "S": date.getMilliseconds() //millisecond
        };

        if(/(y+)/.test(format)) {
            format = format.replace(RegExp.$1,(date.getFullYear() + "").substr(4 - RegExp.$1.length));
        }

        for(var k in o) {
            if(new RegExp("(" + k + ")").test(format)) {
                format = format.replace(RegExp.$1,RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
            }
        }
        return format;
    }
}
