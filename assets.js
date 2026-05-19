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
  'title_logo' : 'assets/ui/title_logo.png',
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
