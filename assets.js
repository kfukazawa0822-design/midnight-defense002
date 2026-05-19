/**
 * assets.js — MIDNIGHT DEFENSE
 * 画像アセット管理・プリロード
 *
 * 使い方:
 *   Assets.load().then(() => { /* ゲーム開始 *\/ })
 *
 * 読み込み後:
 *   Assets.get('fruit.png')        → HTMLImageElement | null
 *   Assets.src('title_bg')         → パス文字列
 */

const Assets = (() => {
  // ─────────────────────────────────────────────
  // アセット定義マップ  key → 相対パス
  // ─────────────────────────────────────────────
  const MANIFEST = {
    // ■ enemies
    'fruit.png'         : 'assets/enemies/fruit.png',
    'soda_ice.png'      : 'assets/enemies/soda_ice.png',
    'macaron.png'       : 'assets/enemies/macaron.png',
    'pudding.png'       : 'assets/enemies/pudding.png',
    'shortcake.png'     : 'assets/enemies/shortcake.png',
    'bread.png'         : 'assets/enemies/bread.png',
    'onigiri.png'       : 'assets/enemies/onigiri.png',
    'pasta.png'         : 'assets/enemies/pasta.png',
    'hamburger.png'     : 'assets/enemies/hamburger.png',
    'shoyu_ramen.png'   : 'assets/enemies/shoyu_ramen.png',
    'butter.png'        : 'assets/enemies/butter.png',
    'french_fries.png'  : 'assets/enemies/french_fries.png',
    'steak.png'         : 'assets/enemies/steak.png',
    'karaage.png'       : 'assets/enemies/karaage.png',
    'backfat_ramen.png' : 'assets/enemies/backfat_ramen.png',
    'beer.png'          : 'assets/enemies/beer.png',
    'wine.png'          : 'assets/enemies/wine.png',
    'tequila.png'       : 'assets/enemies/tequila.png',
    'cheese_plate.png'  : 'assets/enemies/cheese_plate.png',
    'pizza.png'         : 'assets/enemies/pizza.png',

    // ■ items
    'item_dumbbell.png' : 'assets/items/item_dumbbell.png',
    'item_macho.png'    : 'assets/items/item_machoa.png',

    // ■ ui
    'title_bg'          : 'assets/backgrounds/title_bg.webp',
    'title_logo'        : 'assets/ui/title_logo.png',
    'result_bg'         : 'assets/backgrounds/result_bg.webp',
    'rank_S'            : 'assets/ui/rank_S.png',
    'rank_A'            : 'assets/ui/rank_A.png',
    'rank_B'            : 'assets/ui/rank_B.png',
    'rank_C'            : 'assets/ui/rank_C.png',
    'stage2_tutorial'   : 'assets/ui/stage2_tutorial.png',
    'stage3_tutorial'   : 'assets/ui/stage3_tutorial.png',
    'stage4_tutorial'   : 'assets/ui/stage4_tutorial.png',
    'endless_tutorial_01': 'assets/ui/endless_tutorial_01.png',
    'endless_tutorial_02': 'assets/ui/endless_tutorial_02.png',
    'endless_tutorial_03': 'assets/ui/endless_tutorial_03.png',
    'endless_result'    : 'assets/ui/endless_result.png',

    // ■ player
    'player_ship'       : 'assets/player/player_ship.png',

    // ■ backgrounds
    'stage_bg'          : 'assets/backgrounds/stage_bg.webp',
  };

  // ロード済み画像キャッシュ  key → HTMLImageElement
  const _cache = {};
  let _loaded = false;

  /**
   * 全アセットをプリロードする
   * @returns {Promise<void>}
   */
  function load() {
    if (_loaded) return Promise.resolve();

    const entries = Object.entries(MANIFEST);
    let done = 0;
    const total = entries.length;

    const promises = entries.map(([key, path]) =>
      new Promise(resolve => {
        const img = new Image();

        img.onload = () => {
          _cache[key] = img;
          done++;
          resolve();
        };

        img.onerror = () => {
          console.error(`[Assets] 画像ロード失敗: ${path} (key="${key}")`);
          _cache[key] = null;   // null を入れてキーの存在を保持
          done++;
          resolve();            // 失敗してもゲームを止めない
        };

        img.src = path;
      })
    );

    return Promise.all(promises).then(() => {
      _loaded = true;
      const ok   = Object.values(_cache).filter(Boolean).length;
      const fail = total - ok;
      console.log(`[Assets] プリロード完了: ${ok}/${total} OK${fail ? `, ${fail} 件失敗` : ''}`);
    });
  }

  /**
   * ロード済み画像を取得
   * @param {string} key  MANIFEST のキー
   * @returns {HTMLImageElement|null}
   */
  function get(key) {
    if (!(key in _cache)) return null;
    return _cache[key];
  }

  /**
   * アセットのパス文字列を取得（img.src や background-image 用）
   * @param {string} key
   * @returns {string}
   */
  function src(key) {
    return MANIFEST[key] || '';
  }

  /**
   * ロード済みかどうか
   * @returns {boolean}
   */
  function isLoaded() {
    return _loaded;
  }

  return { load, get, src, isLoaded };
})();
