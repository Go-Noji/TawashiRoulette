/**
 * pieces 内のオブジェクト定義
 * label: 表示名
 * probability: 当たる確率
 * ratio: 描写されるときの角度割合
 * color: rgb(a) or # 記法の色指定
 * _angle: setPieces() によって自動算出される弧度法の角度
 * _label: setPieces() によって自動整形される縦書き用の label
 */
interface Piece {
  label: string,
  probability: number,
  ratio: number,
  color: string,
  _angle: number,
  _label: string[]
}

/**
 * 上記 Piece のセッター用 interface
 * _angle は自動算出されるため含まれない
 */
interface SetPiece {
  label: string,
  probability: number,
  ratio: number,
  color: string
}

/**
 * 座標用の型
 */
interface Coordinate {
  x: number,
  y: number
}

export class Roulette {

  /**
   * このクラスが扱うカンバスのコンテキスト
   */
  readonly ctx: CanvasRenderingContext2D;

  /**
   * このクラスが扱うカンバスの横幅(縦幅)
   */
  readonly width: number;

  /**
   * この値が false だと描画が行われない
   */
  private enable: boolean;

  /**
   * 描写する
   */
  private pieces: Piece[];

  /**
   * start() を呼んだ時にセットされる当選したピース情報
   */
  private piece: Piece | null;

  /**
   * このクラスが扱うカンバス
   */
  private canvas: HTMLCanvasElement;

  /**
   * number が正の数であるか判定する
   * allowZero を true にすると 0 の場合も true が返る
   * @param number
   * @param allowZero
   * @private
   */
  private _isNatural(number: number, allowZero: boolean = true): boolean {
    return allowZero ? number >= 0 : number > 0;
  }

  /**
   * 入力されたピース情報に不備がないか判定する
   * 具体的には、
   * probability or ratio に0未満の値が無いか
   * それぞれの合算値が0より上か
   * を判断基準に、問題が無ければ true, 問題があれば false を返す
   * @param pieces
   * @private
   */
  private _isPeaces(pieces: SetPiece[]): boolean {
    //割合の合算値
    let totalProbability: number = 0;

    //表示割合の合算値
    let totalRatio: number = 0;

    //各ピースごとに検査
    for (let i = 0; i < pieces.length; i++){
      //もし probability or ratio が0未満だったらエラー
      if (! this._isNatural(pieces[i].probability) || ! this._isNatural(pieces[i].ratio)){
        return false;
      }

      //合算値に加算
      totalProbability += pieces[i].probability;
      totalRatio += pieces[i].ratio;
    }

    //各合算値が0より大きい場合は true を返す
    return this._isNatural(totalProbability, false) && this._isNatural(totalRatio, false);
  }

  /**
   * this.pieces[index] が存在するか判定する
   * SetPieces 型の pieces がセットされていたら this.pieces[index] ではなく pieces[index] を調べる
   * @param index
   * @param pieces
   * @private
   */
  private _isIndex(index: number, pieces: SetPiece[] | null = null): boolean {
    return pieces === null ? this.pieces[index] !== undefined : pieces[index] !== undefined;
  }

  /**
   * max ~ min 間のランダムな数を返す
   * 少数を考慮する場合、小数点下 decimal 桁まで正しい精度で返す
   * @param min
   * @param max
   * @param decimal
   * @private
   */
  private _getRand(min: number, max: number, decimal: number = 0): number {
    //decimal を整数に直す
    //decimal が 0 未満の場合は 0 に直す
    decimal = decimal < 0 ? 0 : Math.floor(decimal);

    //10 の digit 乗を算出
    const digit = Math.pow(10, decimal);

    //ランダム値を生成
    const result = Math.round(Math.random() * (max * digit - min * digit - 1) + min * digit) / digit;

    //小数点下の精度によっては min ~ max の範囲を超えることがあるので整形
    if (result < min) {
      return result + Math.pow(0.1, decimal);
    }
    if (result > max) {
      return result - Math.pow(0.1, decimal);
    }
    return result;
  }

  /**
   * this.pieces の 0番目 から index番目まで ratio を加算した数値を返す
   * this.pieces[index] が存在しなかったら 0 を返す
   * SetPieces 型の pieces がセットされていたら this.pieces[index] ではなく pieces[index] を調べる
   * @param pieces
   * @param index
   * @private
   */
  private _getAngleRatioByIndex(index: number, pieces: SetPiece[] | null = null): number {
    //this.pieces[index] が存在するか判定
    if (!this._isIndex(index, pieces)) {
      return 0;
    }

    //このメソッドが返す変数
    let angle = 0;

    //実際に角度を加算
    for (let i = 0; i <= index; i = (i + 1)|0) {
      angle += pieces === null ? this.pieces[i].ratio : pieces[i].ratio;
    }

    //返す
    return angle;
  }

  /**
   * 2π を360度として、pieces の ratio から算出される角度を返す
   * ratio に調べたいピースまでの ratio 合算値、total に全てのピース ratio 合算値を渡す
   * total が0だったら0除算回避ため0を返す
   * @param ratio
   * @param total
   * @private
   */
  private _getRadian(ratio: number, total: number): number {
    return total === 0 ? 0 : ratio / total * 2 * Math.PI;
  }

  /**
   * 原点座標 x, y で半径が r の円の中心から外側に向かって角度 radian ラジアンの直線を引いた時、 円周と線の交点座標を返す
   * @param x
   * @param y
   * @param r
   * @param radian
   * @private
   */
  private _getCircleCoordinates(x: number, y: number, r: number, radian: number): Coordinate {
    return {
      x: x + r * Math.cos(radian),
      y: y + r * Math.sin(radian)
    };
  }

  /**
   * 0~1の時間(t)に対してイージング加工された値を返す
   * @param t
   * @private
   */
  private _ease(t: number) {
    return t <.5 ? 8*t*t*t*t : 1-8*(--t)*t*t*t;
  }

  /**
   * カンバスをクリアする
   * @private
   */
  private _clear() {
    this.ctx.clearRect(0, 0, this.width, this.width);
  }

  /**
   * this.pieces の情報を元に angle ラジアンぶん回転させたルーレットを描写する
   * @param angle
   * @private
   */
  private _draw(angle: number) {
    //角度の始点となる値
    let point = 0;

    //半径の算出
    const r = this.width / 2;

    //ズレ無しで描画しようとすると90度の位置から描画しようとするが、0度の位置に data の0番がくるように初期ズレ値を算出する
    const initAngle = 0.5 * Math.PI + angle;

    //既に描画してあるものを全て削除する
    this._clear();

    //図形に共通の描画設定をしておく
    this.ctx.font = "bold 15px '游ゴシック'";
    this.ctx.textAlign = 'center';
    this.ctx.shadowColor = 'rgba(0, 0, 0, 0)';
    this.ctx.shadowBlur  = 2;

    //テキスト描画情報退避変数
    let labels: {_label: string[], angle: number, r: number}[] = [];

    //ループして要素の数だけピースを描画する
    for (let i = 0, max = this.pieces.length; i < max; i = (i + 1)|0)
    {
      //中心以外の頂点ラジアンを取得
      const startRadian = point - initAngle;
      const endRadian = this.pieces[i]._angle - initAngle;

      //描画に必要な変数を先に算出(中央くり抜きの半径, 描画3点目の座標)
      const clip = this.width * .15;
      const thirdCoordinate = this._getCircleCoordinates(r, r, clip, endRadian);

      //扇形を描画
      this.ctx.beginPath();
      this.ctx.arc(r, r, r, startRadian, endRadian, false);
      this.ctx.lineTo(thirdCoordinate.x, thirdCoordinate.y);
      this.ctx.arc(r, r, clip, endRadian, startRadian, true);
      this.ctx.fillStyle = this.pieces[i].color;
      this.ctx.fill();

      //扇形の中心を取得し、テキストを描画するための情報を labels に追加
      labels.push({_label: this.pieces[i]._label, angle: (endRadian - startRadian) / 2 + startRadian, r: (r - clip) / 2 + clip});

      //point を加算する
      point = endRadian + initAngle;
    }

    //一文字当たりの高さ * 1.2 を取得
    const labelHeight = this.ctx.measureText('Ｗ').width * 1.2;

    //テキストを図形と同タイミングで描写すると後から描写された図形の後ろに回ってしまうので後から描写
    this.ctx.fillStyle = '#fff';
    this.ctx.shadowColor = 'rgba(0, 0, 0, .8)';
    for (let i = 0, max = labels.length; i < max; i = (i + 1)|0) {
      //縦書き文章の中心を描画座標にしたいので文章の縦幅 / 2 を算出
      const center = labelHeight * labels[i]._label.length / 2;

      //一文字ずつ角度に沿った縦書きで描画
      labels[i]._label.forEach((label, index) => {
        //描画位置の座標を取得
        const coordinate = this._getCircleCoordinates(r, r, labels[i].r - labelHeight * (index + 0.5) + center, labels[i].angle);

        //描写
        this.ctx.fillText(label, coordinate.x, coordinate.y);
      });
    }

    this.ctx.font = "bold 10px '游ゴシック'";
    for (let i = 0; i < 360; i = i + 5) {
      const coordinate = this._getCircleCoordinates(r, r, r - 10, i * Math.PI / 180 - angle + (1.5 * Math.PI));
      this.ctx.fillText(String(i), coordinate.x, coordinate.y);
    }
  }

  /**
   * このクラスが扱うコンテキストと幅(縦も同義)を注入する
   * @param ctx
   * @param width
   */
  public constructor(canvas: HTMLCanvasElement, width: number) {
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
   * ピース情報をセットする
   * SetPieces 型から Pieces 型への変換も行われる
   * アニメーション中でも実行可能
   * ピース情報が this._isPeaces() で false と判定される内容であれば描画がストップする
   * @param pieces
   */
  public setPieces(pieces: SetPiece[]): boolean {
    //入力された情報が正しいか検査
    if (! this._isPeaces(pieces)) {
      //カンバスを消し、描画をストップする
      this.enable = false;
      this._clear();
      console.log('[Roulette.setPieces] セットされた情報が正しくありません');

      //失敗を返す
      return false;
    }

    //全ピースの合算値を算出
    const total = this._getAngleRatioByIndex(pieces.length - 1, pieces);

    //_angle, _label を追加しつつ this.pieces をセット
    this.pieces = pieces.map((current, index) => {
      return {
        label: current.label,
        probability: current.probability,
        ratio: current.ratio,
        color: current.color,
        _angle: this._getRadian(this._getAngleRatioByIndex(index, pieces), total),
        _label: current.label.split('')
      };
    });

    //描画ができるようにする
    this.enable = true;

    //初期描画
    this._draw(0);

    //成功を返す
    return true;
  }

  /**
   * this.pieces の probability による確率を基にランダムな index を返す
   */
  public getRandIndex(): number {
    //probability の合算値を取得
    let sum = 0;
    for (let i = 0, max = this.pieces.length; i < max; i = (i + 1)|0) {
      sum = sum + this.pieces[i].probability;
    }

    //1 ~ sum 間でランダムな数を取得
    const rand = this._getRand(1, sum);

    //ランダムに選ばれた index を返す
    for (let i = 0, max = this.pieces.length; i < max; i = (i + 1)|0) {
      if ((sum -= this.pieces[i].probability) < rand)
      {
        return i;
      }
    }

    //万が一なにも選ばれなかったら0を返す
    return 0;
  }

  /**
   * ルーレットをスタートさせる
   * index は当てたいピースのインデックス
   * duration はアニメーションさせたい秒数
   * rotation は最終的なルーレットの回転数(index で指定されたピースで回転を止めるため、指定された分 + 0度 ~ 360度回転する)
   * @param index
   * @param duration
   * @param rotation
   */
  public start(index: number, duration: number, rotation: number) {
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
    const millDuration = duration * 1000;

    //duration 秒間描画不可状態にする
    this.enable = false;
    setTimeout(() => {
      this.enable = true;
    }, millDuration);

    //index 番目のピースが該当する範囲の角度をランダムに算出し、それに rotation * 2π を加算してアニメーション完了時にまでに回転する角度を求める
    const angle = this._getRand(this.pieces[index - 1] === undefined ? 0 : this.pieces[index - 1]._angle, this.pieces[index]._angle, 1) + rotation * Math.PI * 2;

    //アニメーション開始時刻の定義
    const start = new Date().getTime();

    //アニメーション関数
    const loop = () => {
      //この関数をループ
      const animation = requestAnimationFrame(loop);

      //経過時間から終了時間までの間を0 ~ 1割合で算出
      const passage = (new Date().getTime() - start) / millDuration;

      //easeInOutQuart のイージングで経過時間から現在の速さを取得し、回す
      this._draw(this._ease(passage) * angle);

      //passage が 1 以下だったらここで終了
      if (passage < 1)
      {
        return;
      }

      //もし passage が1以上だった場合は最終回転角度でアニメーションを止める
      this._draw(angle);
      cancelAnimationFrame(animation);

      //this.canvas へ endRoulette イベントを登録
      if (typeof(Event) === 'function') {
        //IE 以外
        this.canvas.dispatchEvent(new Event('endRoulette'));
      }
      else {
        //IE
        const event = document.createEvent('Event');
        event.initEvent('endRoulette', true, true);
        this.canvas.dispatchEvent(event);
      }
    };

    //アニメーション開始
    loop();
  }

  /**
   * 当たったピース情報を取得する
   * @param index
   */
  public getPiece(): Piece | null {
    return this.piece;
  }

}
