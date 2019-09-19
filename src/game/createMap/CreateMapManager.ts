class CreateMapManager extends egret.EventDispatcher {
    private static _instance:CreateMapManager;
    public static getInstance() {
        if (!this._instance) this._instance = new CreateMapManager();
        return this._instance;
    }

    public initData(data) {

    }

    public save(){
        var arr = [DateUtil_wx4.formatDate('MM-dd hh:mm:ss',new Date()),'id\twidth\theight\tdata'];
        for(var i=0;i<LevelVO.list.length;i++)
        {
            var vo = LevelVO.list[i]
            arr.push(vo.id + '\t' + vo.width + '\t' + vo.height + '\t' + vo.data)
        }
        egret.localStorage.setItem('levelData', arr.join('\n'));
        MyWindow.ShowTips('保存成功')
    }
}