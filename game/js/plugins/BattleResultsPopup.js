//=============================================================================
// BattleResultsPopup.js
//=============================================================================

/*:
 * @plugindesc 用一个战斗结果结算窗口来替代系统默认的文本战斗结果显示。
 * @author Yoji Ojima
 *
 * @help 可用于学习自定义新的Window类，创建自定义窗口，使用战斗管理器
 * (BattleManager)，修改游戏角色处理机制以及场景管理。
 *重要的命令
*this.resetTextColor();//清除字体颜色
*Window_BattleResults.prototype.initialize 方法 // 战斗开始获取角色数据 可用于战斗结算对比 人物属性 经验 技能 等
*this.changeTextColor( this.systemColor());//显示的文字改为蓝色
*this.drawText('123',x,y）//将123显示在 界面x，y轴坐标上。
*var rewards = BattleManager._rewards;//获取战斗奖励（物品，经验，金钱）并且储存到变量rewards里

*var width = 900;//战斗结算窗口宽度
*var height = this.fittingHeight(Math.min(100,rewards.items.length + 2));//战斗结算窗口高度度
*var rect = new Rectangle(x, y, width, height);//在界面x，y坐标创建指定 宽度 高度 的 空白系统默认半透明窗口
*Window_Base.prototype.initialize.call(this,rect); //将创建的半透明窗口显示在界面
 * 此外将会学习到以上所有内容的链接和交互。
 */

(function() {


 var sdeefgf = new Array();
 var j1 = new Array();

// ** get Result Data 获取结果数据
//==============================
//不重要的代码
BattleManager.huoqujiangli = function() {
	 this.makeRewards();
     $gameTemp._bResult[0] = true;	 
	 $gameTemp._bResult[1] = this._rewards.exp;//获取经验值
	 $gameTemp._bResult[2] = this._rewards.gold;//获取金钱
	 $gameTemp._bResult[3] = this._rewards.items;//获取掉落物品
	 $gameTemp._bResult[4] = []; 
};
//不重要的代码
//
//不重要的代码
    var resultDisplaying = 0;

    var _BattleManager_initMembers = BattleManager.initMembers;
    BattleManager.initMembers = function() {
        _BattleManager_initMembers.call(this);
        resultDisplaying = 0;
    };
//不重要的代码
    var _BattleManager_update = BattleManager.update;
    BattleManager.update = function() {
        _BattleManager_update.call(this);
        if (resultDisplaying > 0) {
            if (++resultDisplaying >= 60) {
                if (Input.isTriggered('ok') || TouchInput.isTriggered()) {
                    resultDisplaying = 0;
                }
            }
        }
    };
//不重要的代码

//战斗开始播放战斗bgm 并且获取角色的等级和技能数据 很多战斗结算窗口的数据获取 都是修改此方法
  BattleManager.playBattleBgm = function() {
    AudioManager.playBgm($gameSystem.battleBgm());
    AudioManager.stopBgs();
	for (var i = 0; i < $gameParty._actors.length; i++) {//获取当前出战人数并且进行计次循环
	 sdeefgf.push($gameActors._data[$gameParty._actors[i]].level);//将角色的等级数据输入sdeefgf数组
	 j1.push($gameActors._data[$gameParty._actors[i]]._skills.length);//将角色的技能数据输入j1数组
	                                                 //将角色的攻击数据输入？？数组
	};
	//战斗开始播放战斗bgm 并且获取角色的等级和技能数据 很多战斗结算窗口的数据获取 都是修改此方法
	
  };
  //不重要的代码
    var _BattleManager_isBusy = BattleManager.isBusy;
    BattleManager.isBusy = function() {
        return _BattleManager_isBusy.call(this) || resultDisplaying > 0;
    };
   //不重要的代码
    BattleManager.displayVictoryMessage = function() {
    };
	//不重要的代码

    BattleManager.displayRewards = function() {
        resultDisplaying = 1;
    };
//不重要的代码
    Game_Actor.prototype.shouldDisplayLevelUp = function() {
        return false;
    };
   //不重要的代码
	
    var _Scene_Battle_update = Scene_Battle.prototype.update;
    Scene_Battle.prototype.update = function() {
        _Scene_Battle_update.call(this);
        if (resultDisplaying > 30 && !this._resultWindow) {
            this._resultWindow = new Window_BattleResults();
            this.addWindow(this._resultWindow);
        }
    };
//不重要的代码
    var _Scene_Battle_stop = Scene_Battle.prototype.stop;
    Scene_Battle.prototype.stop = function() {
        _Scene_Battle_stop.call(this);
        if (this._resultWindow) {
            this._resultWindow.close();
        }
    };
//不重要的代码
    function Window_BattleResults() {
        this.initialize.apply(this, arguments);
    }

    Window_BattleResults.prototype = Object.create(Window_Base.prototype);
    Window_BattleResults.prototype.constructor = Window_BattleResults;
 //不重要的代码
 
 
 //创建战斗结算窗口方法
    Window_BattleResults.prototype.initialize = function() {
        var rewards = BattleManager._rewards;
        var width = Graphics.boxWidth-150;
		var sdjkghskh = rewards.items.length + 1;//获取战斗物品奖励数量
		
		if(sdjkghskh > $gameParty._actors.length ){ //如果战斗物品奖励数量大于战斗人员数量则运行下面代码
			if(sdjkghskh > $gameParty._actors.length*2-1){
				var height = this.fittingHeight(Math.min(100,rewards.items.length + 2));
			}else{
				var height = this.fittingHeight(Math.min(100, $gameParty._actors.length*2+1));
			};
			
		}else{
			var height = this.fittingHeight(Math.min(100, $gameParty._actors.length*2+1));
		};
       //console.log(rewards.items.length);
		
        var statusHeight = this.fittingHeight(4);
        var x = (Graphics.boxWidth - width) / 2;
        var y = (Graphics.boxHeight - statusHeight - height) / 2;
		var rect = new Rectangle(x, y, width, height);
		//创建战斗结算窗口
        Window_Base.prototype.initialize.call(this,rect);
		//创建战斗结算窗口
        this.refresh();//新增战斗结算窗口方法
        this.openness = 0;
        this.open();
    };
    //创建战斗结算窗口方法
	//新增战斗结算窗口方法
    Window_BattleResults.prototype.refresh = function() {
        var x = this.itemPadding();
        var y = 0;
        var width = this.contents.width;
        var lineHeight = this.lineHeight();
        var rewards = BattleManager._rewards;
        var items = rewards.items;
        this.contents.clear();
		
        this.resetTextColor();//清除之前的字体颜色
		this.changeTextColor( this.systemColor());//设定当前输出字体的颜色
        this.drawText('战斗结算窗口', width / 2-60, y);//写出战斗结算窗口到指定的 x,y位置

        y += lineHeight;//界面纵向位置换行

        this.resetTextColor();
        this.drawText(rewards.exp, x, y);
        x += this.textWidth(rewards.exp) + 6;//界面水平位置向右边移动6
        this.changeTextColor(this.systemColor());
        this.drawText(TextManager.expA, x, y);
        x += this.textWidth(TextManager.expA + '  ');

        this.resetTextColor();
        this.drawText(rewards.gold, x, y);
        x += this.textWidth(rewards.gold) + 6;
        this.changeTextColor(this.systemColor());
        this.drawText(TextManager.currencyUnit, x, y);
        var z = y;
        var ff = x + 90;	//界面水平位置向右边移动90 此代码 为角色升级类 写出文本横向位置	
        x = 0;
        y += lineHeight;
        //将获得物品的图标和文字写出
        items.forEach(function(item) {
            BattleManager.gainDropItems();
			this.drawItemName(item, x, y, width);
            y += lineHeight;
        }, this);
		//将获得物品的图标和文字写出
		
		//将升级和技能文字写出
		for (var i = 0; i < $gameParty._actors.length; i++) {
        this.resetTextColor();
		//this.changeTextColor(this.systemColor());
		if($gameActors._data[$gameParty._actors[i]].level > sdeefgf[i]){//如果i角色升级了 则运行下面的代码
			this.changeTextColor( this.systemColor());
			this.drawText($gameActors._data[$gameParty._actors[i]]._name + ' 升级 '+sdeefgf[i]+'  ››  '+$gameActors._data[$gameParty._actors[i]].level , ff, z);
			z += lineHeight;
			//if(j1.length > $gameActors._data[$gameParty._actors[i]]._skills.length){
				var erer =$gameActors._data[$gameParty._actors[i]]._skills.length-j1[i];
				var seeefef= $gameActors._data[$gameParty._actors[i]]._name + ' 学会技能  ';
			for (var ssd = 0; ssd < erer; ssd++) {
			//seeefef=$dataSkills[$gameActors._data[$gameParty._actors[i]]._skills[ssd]].name, ff, z);	
				seeefef=seeefef+' ['+$dataSkills[$gameActors._data[$gameParty._actors[i]]._skills[ssd]].name+']';	
				//console.log(j1[i])
			};
			this.resetTextColor();
			this.drawText(seeefef,ff, z);
			z += lineHeight;
			//将升级和技能文字写出
			//}else{
				
			//};

			
			
		}else{//如果i角色没有升级 则运行下面的代码
			this.drawText($gameActors._data[$gameParty._actors[i]]._name + ' 等级 '+sdeefgf[i]+'  ››  '+$gameActors._data[$gameParty._actors[i]].level , ff, z);
			z += lineHeight;
		};
        //新增战斗结算窗口方法
		
		// $gameParty._actors[1]获取队伍角色名称
		//$gameActors._data[$gameParty._actors[1]]
	
		
		};
		//console.log(rewards.gold); 
    };

})();
