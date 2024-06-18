
var hsyf16_drawItem = Window_BattleEnemy.prototype.drawItem
//绘制项目
Window_BattleEnemy.prototype.drawItem = function (index) {
    hsyf16_drawItem.call(this, index)      //原	
    const actor = this._enemies[index];   //获取角色
    const rect = this.itemLineRect(index); //物品/战斗角色的矩阵

    //    const nameX = this.nameX(rect);  //角色名字的x轴
    //    const nameY = this.nameY(rect); //角色名字的y轴
    const stateIconX = this.stateIconX(rect); //角色异常或buff 的y轴
    const stateIconY = this.stateIconY(rect); //角色异常或buff的y轴

    //   const basicGaugesX = rect.x;  //设置血条和蓝条的x
    //    const basicGaugesY = rect.y; //设置血条和蓝条的y	

    this.placeStateIcon(actor, stateIconX, stateIconY); //绘制角色 异常状态 图标
    this.placeBasicGauges(actor, rect.x, rect.y); //绘制血条 和蓝条以及数值
    //    this.drawText("aaaa", rect.x, rect.y, rect.width);        //默认任何窗口都直接调用base里的, 没有基础重写


    //console.log(actor);	  //测试 已经死亡的敌人 不会再经过这里(即无法直接消除) #所有必须自定义一个 清除绘制 的方法
    this.deadMembers_place();  //清除死亡的敌人绘制
};


//清除死亡的敌人绘制
Window_BattleEnemy.prototype.deadMembers_place = function () {
    for (const actor of $gameTroop.deadMembers()) { //迭代 缓存组 给 临时sprite
        //console.log(actor.index());	  

        const key = "enemy%1-gauge-hp";     //只显示血量hp	
        this._additionalSprites[key].hide();
        //console.log(this._additionalSprites[key]);

        const key3 = "enemy%1-stateIcon".format(actor.index());  //为了下面的 创建批量 的识别key不冲突
        this._additionalSprites[key3].hide();


    }
};	 //func


var hsyf16_initialize = Window_BattleEnemy.prototype.initialize
//  初始化* @param {Rectangle} rect 矩形
Window_BattleEnemy.prototype.initialize = function (rect) {
    this._additionalSprites = {};      //需要放入批量精灵,为了方便的显示/隐藏 初始空的哈希表  #必须放原(里面含调用) 上面,否则没有定义

    hsyf16_initialize.call(this, rect)      //原	

};

// 总数量    #! 敌人小队 默认没有总数的方法       //new    #未使用
Game_Troop.prototype.size = function () {
    return this.members().length;
};



//绘制hp,mp,tp #mz
Window_BattleEnemy.prototype.placeBasicGauges = function (actor, x, y) {     //new
    this.placeGauge(actor, "hp", x + 80, y); //只绘制血量hp

};

//绘制血条 和蓝条以及数值
Window_BattleEnemy.prototype.placeGauge = function (actor, type, x, y) {
    const key = "enemy%1-gauge-hp";     //只显示血量hp
    const sprite = this.createInnerSprite(key, Sprite_Gauge);//创建画布精灵("唯一key",调用的类名)
    sprite.setup(actor, type);
    sprite.move(x, y);
    sprite.show();      //bug 绘制正常,但只有最后的敌人显示了

};


//绘制角色 异常状态 图标
Window_BattleEnemy.prototype.placeStateIcon = function (actor, x, y) {
    const key = "enemy%1-stateIcon".format(actor.index());  //为了下面的 创建批量 的识别key不冲突     
    const sprite = this.createInnerSprite(key, Sprite_StateIcon);//创建画布精灵("唯一key",调用的类名)
    sprite.setup(actor); //设置单个精灵(这里指将 角色数据传递/绑定 给Sprite_StateIcon类)
    sprite.move(x, y);  //移动单个精灵
    sprite.show();      //显示单个精灵


};





//创建画布精灵("唯一key",调用的类名)
Window_BattleEnemy.prototype.createInnerSprite = function (key, spriteClass) {

    const dict = this._additionalSprites;
    if (dict && dict[key]) {
        return dict[key];
    } else {
        const sprite = new spriteClass();
        dict[key] = sprite;
        this.addInnerChild(sprite);    //装载精灵 #window类里 初始化的,接近全局
        return sprite;
    }
};


Window_BattleEnemy.prototype.stateIconX = function (rect) {
    return rect.x + rect.width - ImageManager.iconWidth / 2 + 4;
};

Window_BattleEnemy.prototype.stateIconY = function (rect) {
    return rect.y + ImageManager.iconHeight / 2 + 4;
};















