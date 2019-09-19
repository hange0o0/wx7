class WXDB{
    public static updata(dbName,data,fun?){
        DEBUG && console.log('update-'+dbName,data)
        var wx = window['wx'];
        if(!wx)
        {
            fun && fun();
            return;
        }
        console.log('update - user')
        const db = wx.cloud.database();
        db.collection(dbName).doc(UM_wx4.dbid).update({
            data: data,
            success: (res)=>{
                //DEBUG && console.log(res)
                fun && fun();
            },
        })
    }
}