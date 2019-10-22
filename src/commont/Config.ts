/**
 *
 * @author 
 *
 */
class Config {
	public constructor() {
	}

    public static isDebug: boolean = true;
    public static userHost: string = 'hangegame.com';
    public static host: string = 'hangegame.com';
    public static pkServerHost: string = '172.17.196.195';
    public static pkServerPose = 9029;
    public static serverID: number = 1;
    //public static host: string = '172.17.196.195:90';
    public static user_version: number = 1;
    public static version: number = 1;
    public static displayVersion = '1.0.0';
    public static pk_version: number = 1;
    public static cdn: string = "";
    public static localResRoot:string = "resource/game_assets/";
    public static localResRoot2:string = "resource/game_assets2/";
    public static getShare(id){
        id = id || Math.ceil(Math.random()*2)
       return "resource/game_assets2/share/share"+id+".jpg";
    }

    public static adHeight = 0

    public static openRate = 10;

    public static wx_ad = '';
    public static wx_video = '';
    public static wx_insert = '';
    public static myAppID = 'wxab49a5d0b64390db';

    public static readLocal = true;




    //public static friendLevel = 3;
    //public static gambleLevel = 20;
    //
    //
    //public static mapLevel = 5;
    //public static dayLevel = 15;
    //public static serverLevel = 25;//卡士二阶
    //public static serverEqualLevel = 45;  //卡士五阶
    //public static leaderLevel = 95;  //
    //public static leaderSkillLevel = 145;  //


    public static platform = '';
    public static platformGameidAdd = '';
    public static equalValue = 1000;


    public static isZJ: boolean = false;
    public static isQQ: boolean = false;
    public static isWX: boolean = false;
    public static serverPath = 'https://www.hangegame.com/wx7_server/'
    public static init(){
        this.isZJ = window['iszj']
        this.isQQ = window['isQQ']
        this.isWX = window['wx']
        if(this.isZJ)
        {
            this.isWX = false;

            this.wx_ad = '1101e9f3jjj97238i1';
            this.wx_video = '84a9kg52hc511ci052';
            this.wx_insert = '';
            this.myAppID = 'tt803ef6831f144a40';
            this.serverPath = 'https://www.hangegame.com/wx7_server/zj/'
        }

        if(this.isQQ)
        {
            this.isWX = false;
            this.wx_ad = '';
            this.wx_video = '';
            this.wx_insert = '';
            this.myAppID = '1109869435';

            this.serverPath = 'https://www.hangegame.com/wx7_server/qq/'
        }
    }

    private static createImg(name,path=''){
        return {
           "name":name.replace('.','_'),
           "type":"image",
           "url": path + name
       }
    }
    private static createJSON(name,path=''){
        return {
           "name":name.replace('.','_'),
           "type":"json",
           "url": path + name
       }
    }

    public static initURLRequest() {
        //if(AppQU.isApp) return;

        var url = location.hash || location.search || "";
        var splitStr = location.hash ? '#' : '?';
        //        var obj = new Object();
        if(url.indexOf(splitStr) != -1) {
            var str = url.substr(1);
            var strs = str.split("&");
            for(var i = 0;i < strs.length;i++) {
                _get[strs[i].split("=")[0]] = decodeURIComponent(strs[i].split("=")[1]);
            }
        }

        //if(ConfigQU.other){
        //    if(_get["iscloseSocket"]){
        //        ConfigQU.other.iscloseSocket = _get["iscloseSocket"];
        //        console.warn("设置了iscloseSocket：", _get["iscloseSocket"]);
        //    }
        //}
    }

}

class _get {
    public constructor() {
    }
}

