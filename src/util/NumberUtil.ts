class NumberUtil_wx4 {
	public constructor() {
	}


	
    public static addNumSeparator(num,len = 0){
        var s = String(num);
        
        var ss="";
        
        if(s.length<=3)
        {
            ss = s;
        }
        
        while (s.length>3) {
            
            ss = (ss=="") ? s.substr(-3): s.substr(-3) + "," + ss;
            
            s = s.substr(0,s.length-3);
            
            if(s.length<=3)
            {
                ss = s + "," + ss;
            }
        }
        if(len > 0)
        {
            var arr = ss.split(',');
            if(arr.length > len)
            {
                var index = arr.length - len;
                arr.length = len;
                ss = arr.join(',')+ ['K','M','G','T'][index-1];
            }
        }
        
        return ss;
    }
    
    //将数字格式化为带有逗号千位分隔符
    //from: http://stackoverflow.com/questions/2901102/how-to-print-a-number-with-commas-as-thousands-separators-in-javascript/2901298#2901298
    public static numberWithCommas(num) {
        if(num >= 10000) return num/10000 + "万";
        var parts = num.toString().split(".");
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        return parts.join(".");
   }

    /**
     * 格式化 数字显示，10万以下显示数字，10以上显示字母
     * 例如 100M 33,445a
     */
    public static formatStrNum(value: number): string {
        if(value < 10000) {
            return "" + value;
        }
        var numCode: Array<string> = ["K","M","G","T"];
        var newValue: number;
        for(var i: number = 0;i < numCode.length;i++) {
            newValue = value / (Math.pow(1000,(i + 1)));
            if(newValue < 1000){
                return Math.floor(newValue*100)/100 + numCode[i];
            }
        }
        return "999.9T+";
    }

    public static cNum(id){
        return ['一','二','三','四','五','六','七','八','九','十','十一','十二','十三','十四','十五','十六','十七','十八','十九','二十',
            '二十一','二十二','二十三','二十四','二十五','二十六','二十七','二十八','二十九','三十','三十一','三十二','三十三','三十四','三十五','三十六','三十七','三十八','三十九'][id-1]
    }
}
