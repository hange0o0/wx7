/**
 *
 * @author 
 *
 */
class StringUtil {
	public constructor() {
	}
		
	/**
		 * 获取指定宽度的字符串
		 * @param str 源字符串
		 * @param textfield 宽度
		 * @param showPoint 是否把最后两位换成"..."符号
		 * @return 
		 */
    public static getString(str: string,label:eui.Label,showPoint: boolean = true):string {
        if(str && label) {
    //        textfield.defaultTextFormat = new TextFormat("SimSun",size);
            var textfield = new eui.Label();
            textfield.size = label.size;
            var width = label.width;
            textfield.text = str;
            if(textfield.textWidth > width) {
                textfield.text = "";
                for(var i: number = 0,j: number = str.length;i < j;i++) {
                    var d: string = str.substr(i,1);
                    textfield.appendText(d);
                    if(textfield.textWidth > width) {
                        if(showPoint == false)
                            return str.substr(0,i);
                        else {
                            if(i >= 2)
                                return str.substr(0,i - 2) + "...";
                            else
                                return str;
                        }
                    }
                }
            }
        }
        return str;
    }

    public static  getStringLength(char){
        return char.replace(/[^\x00-\xff]/g,"aa").length;
    }

    public static getStringByLength(str,len){
        len = len*2;
        for(var i=1;i<=str.length;i++)
        {
            var rs = str.substr(0,i);
            if(StringUtil.getStringLength(rs) > len)
                return   str.substr(0,i-1);
        }
        return str;
    }

    public static numToStr(v){
        return ['零','一','二','三','四','五','六','七','八','九','十','十一','十二','十三','十四','十五','十六','十七','十八','十九',
            '二十','二十一','二十二','二十三','二十四','二十五','二十六','二十七','二十八','二十九',
            '三十','三十一','三十二','三十三','三十四','三十五','三十六','三十七','三十八','三十九',
            '四十','四十一','四十二','四十三','四十四','四十五','四十六','四十七','四十八','四十九',
            '五十','五十一','五十二','五十三','五十四','五十五','五十六','五十七','五十八','五十九',
            '六十','六十一','六十二','六十三','六十四','六十五','六十六','六十七','六十八','六十九'
        ][v] || v;
    }
}
