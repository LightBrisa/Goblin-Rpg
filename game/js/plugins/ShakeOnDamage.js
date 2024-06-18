//=============================================================================
// ShakeOnDamage.js
// ----------------------------------------------------------------------------
// (C)2017 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.2.0 2019/05/02 敵キャラのダメージ時にもシェイクさせる機能、弱点攻撃時にシェイクさせる機能を追加
// 1.1.1 2018/03/04 YEP_BattleEngineCore.jsとの競合を解消
// 1.1.0 2017/08/19 パラメータに計算式を使用できる機能を追加
// 1.0.0 2017/08/13 初版
// ----------------------------------------------------------------------------
// [Blog]   : https://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:ja
 * @plugindesc ShakeOnDamagePlugin
 * @author triacontane
 *
 * @param ShakePower
 * @desc 通常ダメージを受けたときのシェイク強さです。
 * @default 5
 * @type number
 * @min 1
 * @max 9
 *
 * @param CriticalShakePower
 * @desc クリティカルダメージを受けたときのシェイク強さです。
 * @default 9
 * @type number
 * @min 1
 * @max 9
 *
 * @param EffectiveShakePower
 * @desc 弱点ダメージを受けたときのシェイク強さです。
 * @default 9
 * @type number
 * @min 1
 * @max 9
 *
 * @param ShakeSpeed
 * @desc シェイク速さです。
 * @default 9
 * @type number
 * @min 1
 * @max 9
 *
 * @param ShakeDuration
 * @desc シェイク時間(フレーム)です。
 * @default 30
 * @type number
 *
 * @param ApplyActor
 * @desc アクターのダメージ時にシェイクします。
 * @default true
 * @type boolean
 *
 * @param ApplyEnemy
 * @desc 敵キャラのダメージ時にシェイクします。
 * @default false
 * @type boolean
 *
 * @help ShakeOnDamage.js
 *
 * 戦闘でアクターがダメージを受けたときに画面を振動させます。
 * クリティカル時と通常時とで強さを変えることができます。
 *
 * 各パラメータには計算式を適用できます。さらにローカル変数として
 * 以下が使用可能です。
 * a : ダメージを受けた対象のアクターです。
 * r : ダメージを受けた対象のアクターの残りHP率(0-100)です。
 *
 * 計算式を入力する場合はパラメータ設定ダイアログで「テキスト」タブを
 * 選択してから入力してください。
 *
 * このプラグインにはプラグインコマンドはありません。
 *
 * This plugin is released under the MIT License.
 */
/*:
 * @plugindesc 受伤时的震动插件
 * @author トリアコンタン
 *
 * @param シェイク強さ
 * @text 震动强度
 * @desc 一般受到伤害时的震动强度。
 * @default 5
 * @type number
 * @min 1
 * @max 9
 *
 * @param クリティカルシェイク強さ
 * @text 暴击震动强度
 * @desc 受到暴击伤害时的震动强度。
 * @default 9
 * @type number
 * @min 1
 * @max 9
 *
 * @param 弱点シェイク強さ
 * @text 弱点震动强度
 * @desc 受到弱点伤害时的震动强度。
 * @default 9
 * @type number
 * @min 1
 * @max 9
 *
 * @param シェイク速さ
 * @text 震动速度
 * @desc 震动速度。
 * @default 9
 * @type number
 * @min 1
 * @max 9
 *
 * @param シェイク時間
 * @text 震动时间
 * @desc 抖动时间(帧)。
 * @default 30
 * @type number
 *
 * @param アクターに適用
 * @text 应用角色
 * @desc 在角色受到伤害时震动。
 * @default true
 * @type boolean
 *
 * @param 敵キャラに適用
 * @text 应用敌人
 * @desc 在敌人受到伤害时震动。
 * @default false
 * @type boolean
 *
 * @help ShakeOnDamage.js
 *
 * 在战斗中角色受到伤害时震动画面。
 * 可以在暴击伤害和一般伤害改变强度。
 *
 * 可以对每个参数应用计算公式。
 * 此外，以下内容可用作局部变量:
 * a : 受伤害的目标角色。
 * r : 受伤害目标角色的剩余HP%(0-100)。
 *
 * 要输入计算公式，请在参数设置对话框中选择「计算公式」，
 * 然后输入。
 *
 * 此插件没有插件命令。
 *
 * 使用条款:
 *  可擅自修改、重新发布给作者，使用方式(商用、18禁使用等)
 *  也没有限制。
 *  这个插件已经是你的了。
 */

(function() {
    'use strict';
    var pluginName = 'ShakeOnDamage';

    //=============================================================================
    // ローカル関数
    //  プラグインパラメータやプラグインコマンドパラメータの整形やチェックをします
    //=============================================================================
    var getParamString = function(paramNames) {
        if (!Array.isArray(paramNames)) paramNames = [paramNames];
        for (var i = 0; i < paramNames.length; i++) {
            var name = PluginManager.parameters(pluginName)[paramNames[i]];
            if (name) return name;
        }
        return '';
    };

    var getParamBoolean = function(paramNames) {
        var value = getParamString(paramNames).toUpperCase();
        return value === 'TRUE';
    };

    var convertEscapeCharacters = function(text) {
        if (isNotAString(text)) text = '';
        var windowLayer = SceneManager._scene._windowLayer;
        return windowLayer ? windowLayer.children[0].convertEscapeCharacters(text) : text;
    };

    var isNotAString = function(args) {
        return String(args) !== args;
    };

    //=============================================================================
    // パラメータの取得と整形
    //=============================================================================
    var param                 = {};
    param.shakePower          = getParamString(['ShakePower', 'シェイク強さ']);
    param.criticalShakePower  = getParamString(['CriticalShakePower', 'クリティカルシェイク強さ']);
    param.effectiveShakePower = getParamString(['EffectiveShakePower', '弱点シェイク強さ']);
    param.shakeSpeed          = getParamString(['ShakeSpeed', 'シェイク速さ']);
    param.shakeDuration       = getParamString(['ShakeDuration', 'シェイク時間']);
    param.applyActor          = getParamBoolean(['ApplyActor', 'アクターに適用']);
    param.applyEnemy          = getParamBoolean(['ApplyEnemy', '敵キャラに適用']);

    //=============================================================================
    // Game_Battler
    //  クリティカル判定を記憶します。
    //=============================================================================
    Game_Battler.prototype.setCriticalForShake = function(value) {
        this._criticalForShake = value;
    };

    Game_Battler.prototype.isCriticalForShake = function() {
        return this._criticalForShake;
    };

    Game_Battler.prototype.setEffectiveForShake = function(value) {
        this._effectiveForShake = value;
    };

    Game_Battler.prototype.isEffectiveForShake = function() {
        return this._effectiveForShake;
    };

    var _Game_Battler_performDamage      = Game_Battler.prototype.performDamage;
    Game_Battler.prototype.performDamage = function() {
        _Game_Battler_performDamage.apply(this, arguments);
        if (this.isShakeOnDamage()) {
            this.shakeOnDamage();
        }
    };

    Game_Battler.prototype.shakeOnDamage = function() {
        var power    = this.getDamageShakePower();
        var speed    = this.convertShakeParameter(param.shakeSpeed);
        var duration = this.convertShakeParameter(param.shakeDuration);
        $gameScreen.startShake(power, speed, duration);
        this.setCriticalForShake(false);
    };

    Game_Battler.prototype.getDamageShakePower = function() {
        var power = param.shakePower;
        if (param.criticalShakePower && this.isCriticalForShake()) {
            power = param.criticalShakePower;
        } else if (param.effectiveShakePower && this.isEffectiveForShake()) {
            power = param.effectiveShakePower;
        }
        return this.convertShakeParameter(power);
    };

    Game_Battler.prototype.convertShakeParameter = function(param) {
        var convertParam = convertEscapeCharacters(param);
        // use in eval
        var a            = this;
        var r            = a.hpRate() * 100;
        return isNaN(Number(convertParam)) ? eval(convertParam) : parseInt(convertParam);
    };

    Game_Battler.prototype.isShakeOnDamage = function() {
        return false;
    };

    Game_Actor.prototype.isShakeOnDamage = function() {
        return param.applyActor;
    };

    Game_Enemy.prototype.isShakeOnDamage = function() {
        return param.applyEnemy;
    };

    //=============================================================================
    // Game_Action
    //  クリティカル判定を記憶します。
    //=============================================================================
    var _Game_Action_makeDamageValue      = Game_Action.prototype.makeDamageValue;
    Game_Action.prototype.makeDamageValue = function(target, critical) {
        target.setCriticalForShake(critical);
        return _Game_Action_makeDamageValue.apply(this, arguments);
    };

    var _Game_Action_calcElementRate = Game_Action.prototype.calcElementRate;
    Game_Action.prototype.calcElementRate = function(target) {
        var result = _Game_Action_calcElementRate.apply(this, arguments);
        target.setEffectiveForShake(result > 1.0);
        return result;
    };
})();