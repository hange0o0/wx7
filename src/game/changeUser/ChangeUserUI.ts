class ChangeUserUI extends game.BaseItem {



    private list: eui.List;
    private dataProvider:eui.ArrayCollection
    public stopRed = false;

    public constructor() {
        super();
        this.skinName = "ChangeUserUISkin";
    }

    //public static adList = []
    //private static lastGetADTime = 0;
    //public static getAD(fun?){
    //    if(this.lastGetADTime)
    //    {
    //        fun && fun();
    //        return;
    //    }
    //
    //    var splitList = ['wxd5d9d807682d46bb',"wxf9c8e218c23e2eb7","wxe066524f2972cb1a"]
    //    this.adList.length = 0;
    //    this.adList.push({
    //        isSelf:true,
    //        "appid": "wxd5d9d807682d46bb",
    //        "logo": "logo_wx1_png",
    //        "desc": "右手油门，左手刹车，做一个平民车神",
    //        name:'前方有测速监控'
    //    })
    //    this.adList.push({
    //        isSelf:true,
    //        "appid": "wxf9c8e218c23e2eb7",
    //        "logo": "logo_wx2_png",
    //        name:'怪物斗兽场'
    //    })
    //    this.adList.push({
    //        isSelf:true,
    //        "appid": "wxe066524f2972cb1a",
    //        "logo": "logo_wx3_png",
    //        name:'怪物争霸'
    //    })
    //
    //
    //    var num = 20
    //    var wx = window['wx'];
    //    //console.log(333333)
    //    if(!wx) {
    //        //var oo = {
    //        //    "appid": "wxec9471079f8b6c27",
    //        //    "desc": '免费抽大奖，免费领奖品，再奖⼀一个亿',
    //        //    "img": "https://wllm.oss-cn-beijing.aliyuncs.com/trackposter/wxec9471079f8b6c27/75428.jpg",
    //        //    "logo": "",
    //        //    "name": "测试号1"
    //        //}
    //        //this.adList = [oo,oo,oo,oo,oo,oo,oo,oo,oo,oo]
    //        fun && fun();
    //        //MyTool.removeMC(this);
    //        return;
    //    }
    //
    //
    //
    //    wx.wladGetAds(num,function (res) { //第⼀一个参数为获取⼴广告条数，第⼆二个参数为获取成功后回调⽅方法;
    //        //console.log(res);
    //        ChangeUserUI.lastGetADTime = TM_wx4.now();
    //        for(var i=0;i<res.data.length;i++)
    //        {
    //            if(splitList.indexOf(res.data[i].appid) != -1)
    //            {
    //                res.data.split(i,1);
    //                i--;
    //            }
    //        }
    //        ChangeUserUI.adList = ChangeUserUI.adList.concat(res.data);
    //        fun && fun();
    //    })
    //
    //    window['xhtad'].xhtAdsData('fixed').then(ads => {
    //        console.log('ads is ', ads)
    //        if(ads)
    //        {
    //            ChangeUserUI.lastGetADTime = TM_wx4.now();
    //            ads.appid = ads.appId;
    //            ads.logo = ads.img;
    //            ads.img = ads.qrImg;
    //            ads.isXiaoHu = true;
    //            ChangeUserUI.adList.push(ads)
    //        }
    //    })
    //}
    //
    ////取指定长度的数据
    //public static getListByNum(num,fun?){
    //    var arr = SharedObjectManager_wx4.getInstance().getMyValue('exchangeUserAppid')|| [];
    //    for(var i=0;i<this.adList.length;i++)
    //    {
    //        this.adList[i].temp = arr.indexOf(this.adList[i].appid)
    //
    //        if(this.adList[i].isSelf)
    //            this.adList[i].temp2 = 1
    //        else if(this.adList[i].isXiaoHu)
    //            this.adList[i].temp2 = 2
    //        else
    //            this.adList[i].temp2 = 3
    //        this.adList[i].fun = fun;
    //    }
    //    ArrayUtil_wx4.sortByField(this.adList,['temp','temp2'],[0,0]);
    //    return this.adList.slice(0,num);
    //}

    public childrenCreated() {
        super.childrenCreated();
        this.list.itemRenderer = ChangeUserItem
        this.list.dataProvider = this.dataProvider = new eui.ArrayCollection();
    }

    //private isSet = false;
    //public dataChanged(){
    //    if(this.isSet)
    //        return;
    //    ChangeUserUI.getAD(()=>{
    //        this.renew();
    //    });
    //}

    private timer
    private lastNum = 0
    public renew(){
        if(!this.stage)
            return
        var list = MyADManager.getInstance().getListByNum(10)
        if(list.length < 10)
        {
            if(this.lastNum != list.length)
            {
                this.dataProvider.source = list;
                this.dataProvider.refresh();
                this.lastNum = list.length
            }
            clearTimeout(this.timer)
            this.timer = setTimeout(()=>{
                this.renew();
            },1000);
            return;
        }
        this.dataProvider.source = list;
        this.dataProvider.refresh();
    }
}