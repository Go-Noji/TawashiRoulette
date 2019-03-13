/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/index.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/Roulette.ts":
/*!*************************!*\
  !*** ./src/Roulette.ts ***!
  \*************************/
/*! exports provided: Roulette */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Roulette", function() { return Roulette; });
var Roulette = /** @class */ (function () {
    /**
     * このクラスが扱うコンテキストと幅(縦も同義)を注入する
     * @param ctx
     * @param width
     */
    function Roulette(canvas, width) {
        //カンバスが使用できるかチェック
        if (!canvas.getContext) {
            console.log('[Roulette.constructor] カンバスが使用できません');
            this.enable = false;
            return;
        }
        //カンバス・コンテキスト・大きさ・アニメーション時間を注入する
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.width = width;
        //enable を true にする
        this.enable = true;
        //pieces を [] にする
        this.pieces = [];
        //piece を null にする
        this.piece = null;
    }
    /**
     * number が正の数であるか判定する
     * allowZero を true にすると 0 の場合も true が返る
     * @param number
     * @param allowZero
     * @private
     */
    Roulette.prototype._isNatural = function (number, allowZero) {
        if (allowZero === void 0) { allowZero = true; }
        return allowZero ? number >= 0 : number > 0;
    };
    /**
     * 入力されたピース情報に不備がないか判定する
     * 具体的には、
     * probability or ratio に0未満の値が無いか
     * それぞれの合算値が0より上か
     * を判断基準に、問題が無ければ true, 問題があれば false を返す
     * @param pieces
     * @private
     */
    Roulette.prototype._isPeaces = function (pieces) {
        //割合の合算値
        var totalProbability = 0;
        //表示割合の合算値
        var totalRatio = 0;
        //各ピースごとに検査
        for (var i = 0; i < pieces.length; i++) {
            //もし probability or ratio が0未満だったらエラー
            if (!this._isNatural(pieces[i].probability) || !this._isNatural(pieces[i].ratio)) {
                return false;
            }
            //合算値に加算
            totalProbability += pieces[i].probability;
            totalRatio += pieces[i].ratio;
        }
        //各合算値が0より大きい場合は true を返す
        return this._isNatural(totalProbability, false) && this._isNatural(totalRatio, false);
    };
    /**
     * this.pieces[index] が存在するか判定する
     * SetPieces 型の pieces がセットされていたら this.pieces[index] ではなく pieces[index] を調べる
     * @param index
     * @param pieces
     * @private
     */
    Roulette.prototype._isIndex = function (index, pieces) {
        if (pieces === void 0) { pieces = null; }
        return pieces === null ? this.pieces[index] !== undefined : pieces[index] !== undefined;
    };
    /**
     * max ~ min 間のランダムな数を返す
     * 少数を考慮する場合、小数点下 decimal 桁まで正しい精度で返す
     * @param min
     * @param max
     * @param decimal
     * @private
     */
    Roulette.prototype._getRand = function (min, max, decimal) {
        if (decimal === void 0) { decimal = 0; }
        //decimal を整数に直す
        //decimal が 0 未満の場合は 0 に直す
        decimal = decimal < 0 ? 0 : Math.floor(decimal);
        //10 の digit 乗を算出
        var digit = Math.pow(10, decimal);
        //ランダム値を生成
        var result = Math.round(Math.random() * (max * digit - min * digit - 1) + min * digit) / digit;
        //小数点下の精度によっては min ~ max の範囲を超えることがあるので整形
        if (result < min) {
            return result + Math.pow(0.1, decimal);
        }
        if (result > max) {
            return result - Math.pow(0.1, decimal);
        }
        return result;
    };
    /**
     * this.pieces の 0番目 から index番目まで ratio を加算した数値を返す
     * this.pieces[index] が存在しなかったら 0 を返す
     * SetPieces 型の pieces がセットされていたら this.pieces[index] ではなく pieces[index] を調べる
     * @param pieces
     * @param index
     * @private
     */
    Roulette.prototype._getAngleRatioByIndex = function (index, pieces) {
        if (pieces === void 0) { pieces = null; }
        //this.pieces[index] が存在するか判定
        if (!this._isIndex(index, pieces)) {
            return 0;
        }
        //このメソッドが返す変数
        var angle = 0;
        //実際に角度を加算
        for (var i = 0; i <= index; i = (i + 1) | 0) {
            angle += pieces === null ? this.pieces[i].ratio : pieces[i].ratio;
        }
        //返す
        return angle;
    };
    /**
     * 2π を360度として、pieces の ratio から算出される角度を返す
     * ratio に調べたいピースまでの ratio 合算値、total に全てのピース ratio 合算値を渡す
     * total が0だったら0除算回避ため0を返す
     * @param ratio
     * @param total
     * @private
     */
    Roulette.prototype._getRadian = function (ratio, total) {
        return total === 0 ? 0 : ratio / total * 2 * Math.PI;
    };
    /**
     * 原点座標 x, y で半径が r の円の中心から外側に向かって角度 radian ラジアンの直線を引いた時、 円周と線の交点座標を返す
     * @param x
     * @param y
     * @param r
     * @param radian
     * @private
     */
    Roulette.prototype._getCircleCoordinates = function (x, y, r, radian) {
        return {
            x: x + r * Math.cos(radian),
            y: y + r * Math.sin(radian)
        };
    };
    /**
     * 0~1の時間(t)に対してイージング加工された値を返す
     * @param t
     * @private
     */
    Roulette.prototype._ease = function (t) {
        return t < .5 ? 8 * t * t * t * t : 1 - 8 * (--t) * t * t * t;
    };
    /**
     * カンバスをクリアする
     * @private
     */
    Roulette.prototype._clear = function () {
        this.ctx.clearRect(0, 0, this.width, this.width);
    };
    /**
     * this.pieces の情報を元に angle ラジアンぶん回転させたルーレットを描写する
     * @param angle
     * @private
     */
    Roulette.prototype._draw = function (angle) {
        var _this = this;
        //角度の始点となる値
        var point = 0;
        //半径の算出
        var r = this.width / 2;
        //ズレ無しで描画しようとすると90度の位置から描画しようとするが、0度の位置に data の0番がくるように初期ズレ値を算出する
        var initAngle = 0.5 * Math.PI + angle;
        //既に描画してあるものを全て削除する
        this._clear();
        //図形に共通の描画設定をしておく
        this.ctx.font = "bold 15px '游ゴシック'";
        this.ctx.textAlign = 'center';
        this.ctx.shadowColor = 'rgba(0, 0, 0, 0)';
        this.ctx.shadowBlur = 2;
        //テキスト描画情報退避変数
        var labels = [];
        //ループして要素の数だけピースを描画する
        for (var i = 0, max = this.pieces.length; i < max; i = (i + 1) | 0) {
            //中心以外の頂点ラジアンを取得
            var startRadian = point - initAngle;
            var endRadian = this.pieces[i]._angle - initAngle;
            //描画に必要な変数を先に算出(中央くり抜きの半径, 描画3点目の座標)
            var clip = this.width * .15;
            var thirdCoordinate = this._getCircleCoordinates(r, r, clip, endRadian);
            //扇形を描画
            this.ctx.beginPath();
            this.ctx.arc(r, r, r, startRadian, endRadian, false);
            this.ctx.lineTo(thirdCoordinate.x, thirdCoordinate.y);
            this.ctx.arc(r, r, clip, endRadian, startRadian, true);
            this.ctx.fillStyle = this.pieces[i].color;
            this.ctx.fill();
            //扇形の中心を取得し、テキストを描画するための情報を labels に追加
            labels.push({ _label: this.pieces[i]._label, angle: (endRadian - startRadian) / 2 + startRadian, r: (r - clip) / 2 + clip });
            //point を加算する
            point = endRadian + initAngle;
        }
        //一文字当たりの高さ * 1.2 を取得
        var labelHeight = this.ctx.measureText('Ｗ').width * 1.2;
        //テキストを図形と同タイミングで描写すると後から描写された図形の後ろに回ってしまうので後から描写
        this.ctx.fillStyle = '#fff';
        this.ctx.shadowColor = 'rgba(0, 0, 0, .8)';
        var _loop_1 = function (i, max) {
            //縦書き文章の中心を描画座標にしたいので文章の縦幅 / 2 を算出
            var center = labelHeight * labels[i]._label.length / 2;
            //一文字ずつ角度に沿った縦書きで描画
            labels[i]._label.forEach(function (label, index) {
                //描画位置の座標を取得
                var coordinate = _this._getCircleCoordinates(r, r, labels[i].r - labelHeight * (index + 0.5) + center, labels[i].angle);
                //描写
                _this.ctx.fillText(label, coordinate.x, coordinate.y);
            });
        };
        for (var i = 0, max = labels.length; i < max; i = (i + 1) | 0) {
            _loop_1(i, max);
        }
        this.ctx.font = "bold 10px '游ゴシック'";
        for (var i = 0; i < 360; i = i + 5) {
            var coordinate = this._getCircleCoordinates(r, r, r - 10, i * Math.PI / 180 - angle + (1.5 * Math.PI));
            this.ctx.fillText(String(i), coordinate.x, coordinate.y);
        }
    };
    /**
     * ピース情報をセットする
     * SetPieces 型から Pieces 型への変換も行われる
     * アニメーション中でも実行可能
     * ピース情報が this._isPeaces() で false と判定される内容であれば描画がストップする
     * @param pieces
     */
    Roulette.prototype.setPieces = function (pieces) {
        var _this = this;
        //入力された情報が正しいか検査
        if (!this._isPeaces(pieces)) {
            //カンバスを消し、描画をストップする
            this.enable = false;
            this._clear();
            console.log('[Roulette.setPieces] セットされた情報が正しくありません');
            //失敗を返す
            return false;
        }
        //全ピースの合算値を算出
        var total = this._getAngleRatioByIndex(pieces.length - 1, pieces);
        //_angle, _label を追加しつつ this.pieces をセット
        this.pieces = pieces.map(function (current, index) {
            return {
                label: current.label,
                probability: current.probability,
                ratio: current.ratio,
                color: current.color,
                _angle: _this._getRadian(_this._getAngleRatioByIndex(index, pieces), total),
                _label: current.label.split('')
            };
        });
        //描画ができるようにする
        this.enable = true;
        //初期描画
        this._draw(0);
        //成功を返す
        return true;
    };
    /**
     * this.pieces の probability による確率を基にランダムな index を返す
     */
    Roulette.prototype.getRandIndex = function () {
        //probability の合算値を取得
        var sum = 0;
        for (var i = 0, max = this.pieces.length; i < max; i = (i + 1) | 0) {
            sum = sum + this.pieces[i].probability;
        }
        //1 ~ sum 間でランダムな数を取得
        var rand = this._getRand(1, sum);
        //ランダムに選ばれた index を返す
        for (var i = 0, max = this.pieces.length; i < max; i = (i + 1) | 0) {
            if ((sum -= this.pieces[i].probability) < rand) {
                return i;
            }
        }
        //万が一なにも選ばれなかったら0を返す
        return 0;
    };
    /**
     * ルーレットをスタートさせる
     * index は当てたいピースのインデックス
     * duration はアニメーションさせたい秒数
     * rotation は最終的なルーレットの回転数(index で指定されたピースで回転を止めるため、指定された分 + 0度 ~ 360度回転する)
     * @param index
     * @param duration
     * @param rotation
     */
    Roulette.prototype.start = function (index, duration, rotation) {
        var _this = this;
        //描画可能状態か判定
        if (!this.enable) {
            console.log('[Roulette.start] 描画不可状態です');
            return;
        }
        //this.pieces[index] が存在するか判定
        if (!this._isIndex(index)) {
            console.log('[Roulette.start] this.pieces が空です');
            return;
        }
        //this.piece をセット
        this.piece = this.pieces[index];
        //duration をミリ秒に変換
        var millDuration = duration * 1000;
        //duration 秒間描画不可状態にする
        this.enable = false;
        setTimeout(function () {
            _this.enable = true;
        }, millDuration);
        //index 番目のピースが該当する範囲の角度をランダムに算出し、それに rotation * 2π を加算してアニメーション完了時にまでに回転する角度を求める
        var angle = this._getRand(this.pieces[index - 1] === undefined ? 0 : this.pieces[index - 1]._angle, this.pieces[index]._angle, 1) + rotation * Math.PI * 2;
        //アニメーション開始時刻の定義
        var start = new Date().getTime();
        //アニメーション関数
        var loop = function () {
            //この関数をループ
            var animation = requestAnimationFrame(loop);
            //経過時間から終了時間までの間を0 ~ 1割合で算出
            var passage = (new Date().getTime() - start) / millDuration;
            //easeInOutQuart のイージングで経過時間から現在の速さを取得し、回す
            _this._draw(_this._ease(passage) * angle);
            //passage が 1 以下だったらここで終了
            if (passage < 1) {
                return;
            }
            //もし passage が1以上だった場合は最終回転角度でアニメーションを止める
            _this._draw(angle);
            cancelAnimationFrame(animation);
            //this.canvas へ endRoulette イベントを登録
            if (typeof (Event) === 'function') {
                //IE 以外
                _this.canvas.dispatchEvent(new Event('endRoulette'));
            }
            else {
                //IE
                var event_1 = document.createEvent('Event');
                event_1.initEvent('endRoulette', true, true);
                _this.canvas.dispatchEvent(event_1);
            }
        };
        //アニメーション開始
        loop();
    };
    /**
     * 当たったピース情報を取得する
     * @param index
     */
    Roulette.prototype.getPiece = function () {
        return this.piece;
    };
    return Roulette;
}());



/***/ }),

/***/ "./src/index.ts":
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _Roulette__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Roulette */ "./src/Roulette.ts");

document.addEventListener('DOMContentLoaded', function () {
    //カンバスをセット
    var canvas = document.getElementById('canvas');
    var roulette = new _Roulette__WEBPACK_IMPORTED_MODULE_0__["Roulette"](canvas, 500);
    //情報をセット
    roulette.setPieces([
        {
            label: 'タワシ',
            probability: 30,
            ratio: 30,
            color: '#cfd8dc'
        },
        {
            label: 'ウニ',
            probability: 0,
            ratio: 20,
            color: '#ff5722'
        },
        {
            label: 'タワシ',
            probability: 30,
            ratio: 30,
            color: '#cfd8dc'
        },
        {
            label: 'パジェロ',
            probability: 0,
            ratio: 10,
            color: '#d81b60'
        },
        {
            label: 'タワシ',
            probability: 30,
            ratio: 30,
            color: '#cfd8dc'
        },
        {
            label: '高級ホッチキス',
            probability: 0,
            ratio: 10,
            color: '#7cb342'
        },
        {
            label: 'タワシ',
            probability: 30,
            ratio: 30,
            color: '#cfd8dc'
        },
        {
            label: 'Mac Book',
            probability: 0,
            ratio: 20,
            color: '#039be5'
        },
        {
            label: 'タワシ',
            probability: 30,
            ratio: 30,
            color: '#cfd8dc'
        },
        {
            label: 'お食事券',
            probability: 0,
            ratio: 20,
            color: '#fdd835'
        },
    ]);
    //スタート
    document.getElementById('button').addEventListener('click', function () {
        document.getElementById('result').innerHTML = '&nbsp;';
        roulette.start(roulette.getRandIndex(), 6, 30);
    });
    //カンバスのアニメーションが完了したタイミングで当たったピース情報を取得して表示する
    canvas.addEventListener('endRoulette', function () {
        //ピース情報の取得
        var piece = roulette.getPiece();
        //null でなければ描画
        if (piece !== null) {
            document.getElementById('result').innerText = '☆祝☆ ' + piece.label + 'を獲得しました！！！ ☆祝☆';
        }
    });
});


/***/ })

/******/ });
//# sourceMappingURL=main.bundle.js.map