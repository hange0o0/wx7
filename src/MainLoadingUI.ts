//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-2015, Egret Technology Inc.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////

class MainLoadingUI extends egret.Sprite {
    private static instance:MainLoadingUI;
    public static getInstance() {
        if (!this.instance) this.instance = new MainLoadingUI();
        return this.instance;
    }

    public constructor() {
        super();
        this.createView();
    }

    private textField;
    private shape
    private icon


    private createView():void {

        this.shape = new eui.Rect();
        this.shape.width = 640;
        this.shape.fillColor = 0;
        this.shape.touchEnabled = true;
        this.addChild(this.shape)

        this.textField = new eui.Label();
        this.addChild(this.textField);
        this.textField.x = 80;

        this.textField.width = 480;
        this.textField.height = 100;
        this.textField.text = 'Loading...';
        this.textField.textAlign = "center";

        this.icon = new eui.Image();
        this.addChild(this.icon)
        //this.icon.source = 'resource/game_assets/logo/logo_180.png';
        this.icon.x = 230;

    }

    public show(con){
        con.addChild(this);

        this.width = 640;
        this.height = con.stage.stageHeight;
        this.shape.height = con.stage.stageHeight;
        this.textField.y = this.height/2;
        this.icon.y = this.textField.y - 230;
        this.textField.text = 'Loading...';
    }

    public setFinish(){
        this.textField.text = '加载完成，正在初始化....'
    }

    public showLogin(){
        this.textField.text = '登陆中....'
    }


    public setProgress(current, total):void {
        this.textField.text = "Loading..." + current + "/" + total;
    }

    public hide(){
        MyTool.removeMC(this);
    }

}
