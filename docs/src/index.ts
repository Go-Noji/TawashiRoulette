import {Roulette} from "./Roulette";

document.addEventListener('DOMContentLoaded', () => {
  //カンバスをセット
  const canvas = <HTMLCanvasElement>document.getElementById('canvas');
  const roulette = new Roulette(canvas, 500);

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
  document.getElementById('button').addEventListener('click', () => {
    document.getElementById('result').innerHTML = '&nbsp;';
    roulette.start(roulette.getRandIndex(), 6, 30);
  });

  //カンバスのアニメーションが完了したタイミングで当たったピース情報を取得して表示する
  canvas.addEventListener('endRoulette', () => {
    //ピース情報の取得
    const piece = roulette.getPiece();

    //null でなければ描画
    if (piece !== null) {
      document.getElementById('result').innerText = '☆祝☆ '+piece.label+'を獲得しました！！！ ☆祝☆';
    }
  });

});
