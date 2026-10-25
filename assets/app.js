// Aron Lab 色場版：內容全部來自 data/lab.js。
// ROOT 是頁面到網站根目錄的相對路徑（首頁在根目錄，所以是空字串）。
(() => {
  'use strict';
  const ROOT = '';
  const root = document.documentElement;
  const $ = (id) => document.getElementById(id);
  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const pad = (n, w = 2) => String(n).padStart(w, '0');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ── 語言：index.html 開頭已決定 data-lang；介面文字寫成 tr('中文', 'English') ──
  const EN = root.dataset.lang === 'en';
  const tr = (zh, en) => (EN ? en : zh);
  // 資料的英文版：每一筆都可以帶 en（字串＝換標題 t；物件＝換掉裡面列出的欄位），沒寫的就沿用中文
  const loc = (o) => (!EN || !o || o.en == null ? o : typeof o.en === 'string' ? { ...o, t: o.en } : { ...o, ...o.en });
  const locPromo = (m) => (!EN || !m.en ? m : {
    ...m, note: m.en.note || m.note, slides: m.en.slides || m.slides,
    video: m.video && { ...m.video, t: m.en.video || m.video.t },
    poster: m.poster && { ...m.poster, t: m.en.poster || m.poster.t },
    pdf: m.pdf && { ...m.pdf, t: m.en.pdf || m.pdf.t },
  });
  const D = window.LAB;
  const L = !EN ? D : {
    ...D,
    domains: { ...D.domains, ...(D.en && D.en.domains) },
    products: D.products.map((p0) => { const p = loc(p0); return { ...p, sections: p.sections.map(loc), links: p.links.map(loc), archive: p.archive && p.archive.map(loc), promo: p.promo && locPromo(p.promo) }; }),
    works: D.works.map(loc),
    milestones: D.milestones.map(loc),
  };
  const P = L.products;
  const ME = { id: 'me', name: 'Aron Song', zh: tr('個人', 'Personal'), color: '#8A8A8A' };
  const byId = Object.fromEntries(P.map((p) => [p.id, p]));
  const asset = (path) => (path ? ROOT + path : null);

  // 介面上寫死在 index.html 的字：英文版換成 data-en 系列屬性裡的英文
  if (EN) {
    document.title = 'Aron Lab · Product Index';
    document.querySelectorAll('[data-en]').forEach((el) => { el.textContent = el.dataset.en; });
    document.querySelectorAll('[data-en-html]').forEach((el) => { el.innerHTML = el.dataset.enHtml; });
    document.querySelectorAll('[data-en-label]').forEach((el) => el.setAttribute('aria-label', el.dataset.enLabel));
    document.querySelectorAll('[data-en-ph]').forEach((el) => { el.placeholder = el.dataset.enPh; });
  }
  root.classList.add('i18n');
  // 切換語言：記住選擇、網址帶 ?lang=（無痕模式存不了也能切），重新載入後回到原本捲到的位置
  document.querySelectorAll('[data-lang-set]').forEach((b) => {
    const mine = (b.dataset.langSet === 'en') === EN;
    b.classList.toggle('on', mine);
    b.setAttribute('aria-pressed', String(mine));
    b.addEventListener('click', () => {
      if (mine) return;
      // 兩種語言的段落高度不同，所以記「捲到哪一段、在那一段的幾成」，不記像素
      const el = [...layers()].find((s) => s.getBoundingClientRect().bottom > 0), r = el && el.getBoundingClientRect();
      try { localStorage.setItem('lab.lang', b.dataset.langSet); if (el) sessionStorage.setItem('lab.y', JSON.stringify({ id: el.id, f: -r.top / r.height })); } catch (e) { /* 無痕模式 */ }
      const u = new URL(location.href); u.searchParams.set('lang', b.dataset.langSet); location.replace(u);
    });
  });

  // ── 日期（台北時間） ──
  const tpe = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Taipei', year: 'numeric', month: '2-digit', day: '2-digit' });
  const todayISO = tpe.format(new Date());
  const toDate = (iso) => new Date(iso + 'T00:00:00Z');
  const dayDiff = (a, b) => Math.round((toDate(b) - toDate(a)) / 864e5);
  const dotted = (iso) => iso.replace(/-/g, '.');
  const md = (iso) => iso.slice(5).replace('-', '/');
  const DOW = tr('日一二三四五六', ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']);
  const dow = (iso) => DOW[toDate(iso).getUTCDay()];

  // ── 網址 ──
  const abs = (base, u) => (!u ? null : /^https?:\/\//.test(u) ? u : base ? new URL(u, base).href : new URL(ROOT + u, location.href).href);
  const shortUrl = (u) => u.replace(/^https:\/\/north7\.github\.io/, '').replace(/^https?:\/\//, '');
  const ext = (u) => (/^https?:/.test(u) && !u.startsWith(location.origin) ? ' target="_blank" rel="noopener"' : '');
  const caseUrl = (p) => { const c = p.links.find((l) => l.type === 'case'); return c ? abs(p.site, c.u) : null; };
  const mainUrl = (p) => p.site || caseUrl(p);
  // 英文版有自己網址的作品（例如 Tidemark 的 en/）在資料裡寫 en.open
  const home = (p) => (p.open ? abs(p.site, p.open) : mainUrl(p));
  const zhOnly = (p) => EN && p.ui === 'zh';

  // ── 配色切換 ──
  const setTheme = (t) => {
    root.dataset.theme = t;
    try { t === 'auto' ? localStorage.removeItem('lab.theme') : localStorage.setItem('lab.theme', t); } catch (e) { /* 無痕模式 */ }
    document.querySelectorAll('[data-theme-set]').forEach((b) => b.classList.toggle('on', b.dataset.themeSet === t));
  };
  document.querySelectorAll('[data-theme-set]').forEach((b) => b.addEventListener('click', () => setTheme(b.dataset.themeSet)));
  setTheme(root.dataset.theme || 'auto');
  $('mark').innerHTML = P.map(() => '<i></i>').join('');

  // ── 所有入口（和正式首頁的索引同一套算法） ──
  const TYPES = tr(
    { site: '首頁', section: '分頁', case: '作品集', lang: '語言版本', tool: '工具', data: '資料', media: '宣傳素材', social: '社群', repo: '原始碼', local: '本機', legacy: '舊版', archive: '封存', private: '私人' },
    { site: 'Home', section: 'Page', case: 'Case study', lang: 'Language', tool: 'Tool', data: 'Data', media: 'Media', social: 'Social', repo: 'Source', local: 'Local', legacy: 'Legacy', archive: 'Archive', private: 'Private' },
  );
  const promoUrl = (p, f) => abs(null, p.promo.dir + f);
  const entries = [];
  P.forEach((p) => {
    if (p.site) entries.push({ p, t: tr(`${p.name} 首頁`, `${p.name} home`), u: home(p), type: 'site' });
    p.sections.forEach((s) => { if (s.u) entries.push({ p, n: s.n, t: s.t, u: abs(p.sectionsBase || p.site, s.u), type: 'section', label: p.sectionsLabel }); });
    p.links.forEach((l) => entries.push({ p, t: l.t, u: abs(p.site, l.u), type: l.type }));
    (p.archive || []).forEach((l) => entries.push({ p, t: l.t, u: abs(p.site, l.u), type: l.type }));
    if (p.promo) {
      const m = p.promo;
      if (m.video) entries.push({ p, t: m.video.t, u: promoUrl(p, m.video.src), type: 'media' });
      if (m.pdf) entries.push({ p, t: m.pdf.t, u: promoUrl(p, m.pdf.src), type: 'media' });
      if (m.poster) entries.push({ p, t: m.poster.t, u: promoUrl(p, m.poster.src), type: 'media' });
      if (m.release) entries.push({ p, t: tr(`宣傳素材原始檔（GitHub release${p.repoPrivate ? '，私人' : ''}）`, `Promo source files (GitHub release${p.repoPrivate ? ', private' : ''})`), u: m.release, type: 'media' });
    }
    L.works.filter((w) => w.product === p.id && w.chapters).forEach((w) => w.chapters.forEach(([t, h]) => entries.push({ p, t: `${tr('作品集', 'Case study')} › ${t}`, u: abs(w.url, h), type: 'case' })));
    if (!p.site && !p.links.some((l) => l.type === 'local')) entries.push({ p, t: tr(`${p.name} ${p.zh}（只在自己的 Mac 上開啟）`, `${p.name} (runs only on my own Mac)`), u: null, type: 'private' });
  });
  L.works.filter((w) => !w.product).forEach((w) => {
    entries.push({ p: ME, t: w.sub, u: w.url, type: w.type || 'case' });
    (w.chapters || []).forEach(([t, h]) => entries.push({ p: ME, t, u: abs(w.url, h), type: 'section', label: w.chaptersLabel }));
  });
  entries.push({ p: ME, t: 'GitHub · North7', u: L.owner.github, type: 'social' });
  entries.push({ p: ME, t: `X ${L.owner.xHandle}`, u: L.owner.x, type: 'social' });
  const countFor = (p) => entries.filter((e) => e.p === p).length;

  // ── 即時數據 ──
  const num = (v, d = 0) => (v == null || isNaN(v) ? '—' : Number(v).toLocaleString('en-US', { minimumFractionDigits: d, maximumFractionDigits: d }));
  const pct = (v, tw) => (v == null || isNaN(v) ? '' : `<em class="${(v >= 0) !== !!tw ? 'up' : 'down'}" style="font-style:normal">${v >= 0 ? '+' : ''}${Number(v).toFixed(2)}%</em>`);
  const FEEDS = {
    tidemark: ['https://north7.github.io/tidemark/latest.json', (d) => ({ when: d.date, items: [[tr('底部訊號', 'Bottom signal'), num(d.bottom_signal)], [tr('頂部訊號', 'Top signal'), num(d.top_signal)], ['BTC', '$' + num(d.price_usd)]] })],
    daybreak: ['https://north7.github.io/daybreak/data/latest.json', (d) => ({ when: d.meta.bar_date, items: [[tr('BTC 收盤', 'BTC close'), '$' + num(d.price.bar.c)], ['', pct(d.price.bar.chg_pct)]] })],
    morningbell: ['https://north7.github.io/morningbell/data/latest.json', (d) => ({ when: d.meta.us_date, items: [['S&amp;P 500', `${num(d.quotes.SPX.c, 2)} ${pct(d.quotes.SPX.chg_pct, true)}`], [tr('加權', 'TAIEX'), `${num(d.quotes.TW_TAIEX.c)} ${pct(d.quotes.TW_TAIEX.chg_pct, true)}`]] })],
    ticker: ['https://north7.github.io/market-ticker/version.json', (d) => ({ when: d.built + tr(' 部署', ' deployed'), items: [[tr('線上版本', 'Live version'), esc(d.version)]] })],
  };
  const live = {};
  const liveLine = (v) => v.items.filter(([k, val]) => val).map(([k, val]) => `${k ? k + ' ' : ''}<b>${val}</b>`).join(' · ');

  // ── 首屏數字 ──
  const first = P.map((p) => p.started).sort()[0];
  $('stats').innerHTML = [
    [pad(P.length), tr('個作品', 'works')], [pad(P.filter((p) => p.status === 'live').length), tr('個每天自動更新', 'update daily')],
    [entries.length, tr('個入口', 'entries')],
  ].map(([n, t]) => `<div><dt>${n}</dt><dd>${t}</dd></div>`).join('');

  // ── 首屏：每 4.2 秒換成下一個作品的配色 ──
  const hero = $('hero'), topBar = $('top');
  hero.classList.add('pc'); topBar.classList.add('pc');
  // 先放「台北現在這個時間」該看的作品，時刻照各作品的排程：
  // Morningbell 晨刊 07:00（週二到週六）、午後刊 16:00（週一到週五）；Tidemark 08:15、Daybreak 08:30；Signal Tower 每根 4 小時 K 線收盤時檢查
  const tpeNow = () => {
    const t = Object.fromEntries(new Intl.DateTimeFormat('en-US', { timeZone: 'Asia/Taipei', weekday: 'short', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).formatToParts(new Date()).map((x) => [x.type, x.value]));
    return { h: +t.hour, m: +t.minute, dow: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(t.weekday), hm: `${t.hour}:${t.minute}` };
  };
  const SLOTS = [ // [從幾點開始（分鐘）, 作品, 說明, 只在星期幾（0 = 週日）]
    [0, 'market-ticker', () => tr('BTC 不收盤，行情一直在跳', 'BTC never closes; the price keeps moving')],
    [7 * 60, 'morningbell', () => tr('07:00 晨刊：美股收盤', '07:00 morning edition: the US close'), [2, 3, 4, 5, 6]],
    [8 * 60 + 15, 'tidemark', () => tr('08:15 更新頂部與底部訊號', '08:15 top and bottom signals update')],
    [8 * 60 + 30, 'daybreak', () => tr('08:30 出刊的比特幣簡報', 'the Bitcoin brief, out at 08:30')],
    [12 * 60, 'signals', (t) => { const hh = pad(Math.floor(t.h / 4) * 4); return tr(`4 小時 K 線 ${hh}:00 收盤`, `4-hour candle closed at ${hh}:00`); }],
    [16 * 60, 'morningbell', () => tr('16:00 午後刊：台股收盤', '16:00 afternoon edition: the Taiwan close'), [1, 2, 3, 4, 5]],
    [20 * 60, 'market-ticker', () => tr('BTC 不收盤，行情一直在跳', 'BTC never closes; the price keeps moving')],
  ];
  const pickNow = () => {
    const t = tpeNow(), min = t.h * 60 + t.m;
    const s = SLOTS.filter(([from, id, , days]) => from <= min && byId[id] && (!days || days.includes(t.dow))).pop();
    return s ? { i: P.indexOf(byId[s[1]]), line: `${tr('台北', 'Taipei')} ${t.hm} · ${s[2](t)}` } : { i: 0, line: '' };
  };
  // 頂欄左上角 7 個小方塊 = 7 個作品：正在看哪一個，其他的就變空心
  const markAt = (i) => [...$('mark').children].forEach((m, j) => m.classList.toggle('off', i >= 0 && j !== i));
  let k = 0, timer = null, onHeroNow = true;
  const show = (i) => {
    k = (i + P.length) % P.length;
    const p = P[k], now = pickNow(), line = now.i === k ? now.line : '';
    hero.style.setProperty('--pc', p.color);
    topBar.style.setProperty('--pc', p.color);
    if (onHeroNow) markAt(k);
    $('stage').href = `#w-${p.id}`;
    $('now-k').textContent = line || 'Now showing';
    $('now-k').classList.toggle('t', !!line);
    $('now-name').textContent = `${p.name} ${p.zh}`;
    $('now-live').innerHTML = p.live && live[p.live] ? liveLine(live[p.live]) : esc(p.tagline);
    document.querySelectorAll('#dots button').forEach((b, j) => b.classList.toggle('on', j === k));
  };
  $('dots').innerHTML = P.map((p) => `<button type="button" aria-label="${esc(p.name)}"></button>`).join('');
  $('dots').addEventListener('click', (e) => { const b = e.target.closest('button'); if (!b) return; clearInterval(timer); timer = null; show([...b.parentNode.children].indexOf(b)); });
  show(pickNow().i);
  if (!reduced) timer = setInterval(() => show(k + 1), 4200);

  // ── 手機頂欄：跟著正在頂欄底下的色場換底色與字色（桌機仍用混色模式，這些變數不會用到） ──
  const layers = () => document.querySelectorAll('.hero, .field, .sec, .foot');
  let painting = false;
  const paintTop = () => {
    painting = false;
    const at = (y) => [...layers()].find((el) => { const r = el.getBoundingClientRect(); return r.top <= y && r.bottom > y; });
    // 頂欄底色看頂欄正下方；左上角的作品方塊看畫面 40% 高的地方（眼睛正在看的那一段）
    const s = at(topBar.offsetHeight / 2), cur = at(innerHeight * .4);
    const onHero = !s || s === hero;
    onHeroNow = !cur || cur === hero;
    markAt(onHeroNow ? k : cur.classList.contains('field') ? P.findIndex((p) => cur.id === `w-${p.id}`) : -1);
    topBar.classList.toggle('over-hero', onHero);
    if (onHero) { topBar.style.removeProperty('--top-bg'); topBar.style.removeProperty('--top-fg'); return; }
    const cs = getComputedStyle(s);
    topBar.style.setProperty('--top-bg', cs.backgroundColor);
    topBar.style.setProperty('--top-fg', cs.color);
  };
  addEventListener('scroll', () => { if (!painting) { painting = true; requestAnimationFrame(paintTop); } }, { passive: true });
  addEventListener('resize', paintTop);
  document.querySelectorAll('[data-theme-set]').forEach((b) => b.addEventListener('click', () => requestAnimationFrame(paintTop)));
  matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => requestAnimationFrame(paintTop));
  requestAnimationFrame(paintTop);

  // ── 作品色場 ──
  const GLYPH = {
    crypto: '<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="50"/></svg>',
    stocks: '<svg viewBox="0 0 100 100"><rect width="100" height="100"/></svg>',
    sport: '<svg viewBox="0 0 100 100"><polygon points="50,0 100,100 0,100"/></svg>',
    health: '<svg viewBox="0 0 100 100"><path d="M0 100 A50 50 0 0 1 100 100 Z"/></svg>',
  };
  const STATUS = tr({ live: '已上線', local: '本機', private: '私人' }, { live: 'Live', local: 'Local', private: 'Private' });
  const inZh = tr('', ' (Chinese)');
  $('works').innerHTML = P.map((p) => {
    const url = home(p), cs = caseUrl(p);
    const blocks = p.sections.map((s) => {
      const u = abs(p.sectionsBase || p.site, s.u);
      return u ? `<a href="${u}"${ext(u)}><i>${esc(s.n)}</i>${esc(s.t)}</a>` : `<span><i>${esc(s.n)}</i>${esc(s.t)}</span>`;
    }).join('');
    const pic = p.cover ? `<img src="${asset(p.cover)}" alt="${esc(p.name)} ${tr('畫面', 'screenshot')}" loading="lazy">` : '';
    const domains = p.domains.map((d) => L.domains[d]).join(tr('・', ' / '));
    return `<section class="field pc" id="w-${p.id}" style="--pc:${p.color}" aria-label="${esc(p.name)}">
      <a class="stage" ${url ? `href="${url}"${ext(url)}` : `href="#w-${p.id}"`} aria-label="${tr('開啟', 'Open')} ${esc(p.name)}"><div class="sq s0"><div class="sq s1"><div class="sq s2">${pic}<span class="glyph">${GLYPH[p.domains[0]] || GLYPH.stocks}</span></div></div></div></a>
      <div class="info">
        <div class="no"><button type="button" class="hex" data-hex="${p.color}" title="${tr('複製色碼', 'Copy color')} ${p.color}" aria-label="${tr(`複製 ${esc(p.name)} 的色碼`, `Copy the ${esc(p.name)} color`)} ${p.color}"></button><span>No.${p.no} · ${esc(domains)} · ${esc(p.kind)}</span><span class="st">${STATUS[p.status]} · ${esc(p.cadence)}</span></div>
        <h2>${esc(p.name)}<small>${esc(p.zh)}</small></h2>
        <p class="tag">${esc(p.tagline)}</p>
        <p class="desc">${esc(p.desc)}</p>
        ${p.live ? `<div class="live wait" data-live="${p.live}"><span>${tr('讀取即時資料…', 'Loading live data…')}</span></div>` : ''}
        <ul class="facts">${p.facts.map((f) => `<li>${esc(f)}</li>`).join('')}</ul>
        <div class="blocks">${blocks}</div>
        <div class="go">
          ${url ? `<a href="${url}"${ext(url)}>${p.site ? 'Open' : tr('產品案例', 'Case study')}${zhOnly(p) ? inZh : ''} ↗</a>` : `<span>${tr('只在本機', 'Local only')}</span>`}
          ${p.site && cs ? `<a class="alt" href="${cs}"${ext(cs)}>${tr('作品集', 'Case study')}</a>` : ''}
          ${p.promo ? `<a class="alt" href="#media-${p.id}">${tr('宣傳素材', 'Media')}</a>` : ''}
          ${p.repo ? `<a class="alt" href="${p.repo}" target="_blank" rel="noopener">${tr('原始碼', 'Source')}${p.repoPrivate ? tr('（私人）', ' (private)') : ''}</a>` : ''}
          <button type="button" class="more" data-goto="${p.id}">${tr(`全部 ${countFor(p)} 個入口`, `All ${countFor(p)} entries`)} →</button>
        </div>
      </div>
    </section>`;
  }).join('') + `<section class="field next pc" id="w-next"><div class="stage"><div class="sq s0"><div class="sq s1"><div class="sq s2"></div></div></div></div><div><h2>No.${pad(P.length + 1)} · ${tr('製作中', 'In progress')}</h2><p>${tr('新的作品會依序編號，加進這一頁和索引。', 'New works take the next number and join this page and the index.')}</p></div></section>`;
  // 手機沒有滑鼠：色場進到畫面中間時直接把畫面顯示出來
  if (!matchMedia('(hover: hover)').matches) {
    const io = new IntersectionObserver((list) => list.forEach((en) => en.target.classList.toggle('show', en.isIntersecting)), { rootMargin: '-35% 0px -35% 0px' });
    document.querySelectorAll('.field').forEach((f) => io.observe(f));
  }

  // ── 索引 ──
  const state = { prod: 'all', type: 'all', q: '' };
  const groups = [...P, ME];
  const idxProd = $('idx-prod'), idxType = $('idx-type');
  idxProd.innerHTML = `<button type="button" class="on" data-p="all">${tr('全部作品', 'All works')}</button>` + groups.map((p) => `<button type="button" data-p="${p.id}"><span class="sw" style="background:${p.color}"></span>${esc(p.name)}<span class="n">${countFor(p)}</span></button>`).join('');
  const typeKeys = Object.keys(TYPES).filter((t) => entries.some((e) => e.type === t));
  idxType.innerHTML = `<button type="button" class="on" data-t="all">${tr('全部類型', 'All types')}</button>` + typeKeys.map((t) => `<button type="button" data-t="${t}">${TYPES[t]}<span class="n">${entries.filter((e) => e.type === t).length}</span></button>`).join('');
  const hl = (s, q) => { const t = esc(s); if (!q) return t; const i = s.toLowerCase().indexOf(q); return i < 0 ? t : esc(s.slice(0, i)) + '<mark>' + esc(s.slice(i, i + q.length)) + '</mark>' + esc(s.slice(i + q.length)); };
  // 預設每個作品只露出第一列，其餘收在「＋ 其餘 N 個入口」；搜尋或只看單一作品時全部攤開
  const open = new Set();
  const tyName = (e) => (e.type === 'section' ? e.label : TYPES[e.type]);
  const row = (e, grp, q) => {
    const cells = `<span class="pn${grp ? '' : ' rep'}" role="cell"><span class="sw" style="background:${e.p.color}"></span>${esc(e.p.name)}<small>${esc(e.p.zh)}</small></span>
      <span class="t" role="cell">${e.n ? `<i>${esc(e.n)}</i>` : ''}${hl(e.t, q)}</span>
      <span class="ty ${e.type}" role="cell">${esc(tyName(e))}</span>
      <span class="u" role="cell">${e.u ? hl(shortUrl(e.u), q) : '—'}</span><span class="go2" aria-hidden="true">↗</span>`;
    return e.u ? `<a class="ir${grp ? ' grp' : ''}" role="row" href="${e.u}"${ext(e.u)}>${cells}</a>` : `<div class="ir nolink${grp ? ' grp' : ''}" role="row">${cells}</div>`;
  };
  const foldRow = (p, rest, isOpen) => {
    const by = new Map(); rest.forEach((e) => by.set(tyName(e), (by.get(tyName(e)) || 0) + 1));
    return `<div class="ir fold-row" role="row"><button type="button" role="cell" data-fold="${p.id}" aria-expanded="${isOpen}">` +
      (isOpen ? `<b>− ${tr('收合', 'Collapse')} ${esc(p.name)}</b>` : `<b>${tr(`＋ 其餘 ${rest.length} 個入口`, `+ ${rest.length} more entries`)}</b><span>${[...by].map(([k, n]) => `<i>${esc(k)} ${n}</i>`).join(' · ')}</span>`) + '</button></div>';
  };
  let foldable = [];
  const renderIndex = () => {
    const q = state.q.trim().toLowerCase();
    const rows = entries.filter((e) => (state.prod === 'all' || e.p.id === state.prod) && (state.type === 'all' || e.type === state.type) &&
      (!q || [e.t, e.u || '', e.p.name, e.p.zh, TYPES[e.type], e.label || ''].join(' ').toLowerCase().includes(q)));
    $('idx-count').textContent = rows.length === entries.length ? tr(`共 ${entries.length} 個入口`, `${entries.length} entries`) : tr(`顯示 ${rows.length} / ${entries.length}`, `Showing ${rows.length} of ${entries.length}`);
    const byP = new Map(); rows.forEach((e) => byP.set(e.p, [...(byP.get(e.p) || []), e]));
    foldable = !q && state.prod === 'all' ? [...byP].filter(([, list]) => list.length > 3).map(([p]) => p.id) : [];
    const fa = $('idx-fold');
    fa.hidden = !foldable.length;
    fa.textContent = foldable.every((id) => open.has(id)) ? tr('全部收合', 'Collapse all') : tr('全部展開', 'Expand all');
    if (!rows.length) { $('idx').innerHTML = `<div class="idx-empty">${tr('沒有符合的入口。換個關鍵字，或清除篩選。', 'No matching entries. Try another keyword, or clear the filters.')}</div>`; return; }
    $('idx').innerHTML = `<div class="ir head" role="row">${tr(['作品', '入口', '類型', '網址'], ['Work', 'Entry', 'Type', 'URL']).map((h) => `<span role="columnheader">${h}</span>`).join('')}<span></span></div>` +
      [...byP].map(([p, list]) => {
        if (!foldable.includes(p.id)) return list.map((e, i) => row(e, i === 0, q)).join('');
        const isOpen = open.has(p.id);
        return (isOpen ? list : list.slice(0, 1)).map((e, i) => row(e, i === 0, q)).join('') + foldRow(p, list.slice(1), isOpen);
      }).join('');
  };
  $('idx').addEventListener('click', (ev) => {
    const b = ev.target.closest('[data-fold]'); if (!b) return;
    const id = b.dataset.fold, closing = open.has(id), top = b.getBoundingClientRect().top;
    closing ? open.delete(id) : open.add(id);
    renderIndex();
    const nb = $('idx').querySelector(`[data-fold="${id}"]`);
    if (!nb) return;
    // 收合時讓按鈕留在原本的位置，不然畫面會跳到下一個作品之後
    if (closing) window.scrollBy({ top: nb.getBoundingClientRect().top - top, behavior: 'instant' });
    nb.focus({ preventScroll: true });
  });
  $('idx-fold').addEventListener('click', () => {
    const all = foldable.every((id) => open.has(id));
    foldable.forEach((id) => (all ? open.delete(id) : open.add(id)));
    renderIndex();
  });
  const pick = (box, attr, key) => box.addEventListener('click', (ev) => {
    const b = ev.target.closest(`[data-${attr}]`); if (!b) return;
    state[key] = b.dataset[attr];
    box.querySelectorAll('button').forEach((x) => x.classList.toggle('on', x === b));
    renderIndex();
  });
  pick(idxProd, 'p', 'prod'); pick(idxType, 't', 'type');
  $('q').addEventListener('input', (ev) => { state.q = ev.target.value; renderIndex(); });
  document.addEventListener('keydown', (ev) => {
    if (ev.key === '/' && !/^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement.tagName)) { ev.preventDefault(); $('q').focus({ preventScroll: true }); $('index').scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' }); }
  });
  document.addEventListener('click', (ev) => {
    const b = ev.target.closest('[data-goto]'); if (!b) return;
    idxProd.querySelector(`[data-p="${b.dataset.goto}"]`).click();
    idxType.querySelector('[data-t="all"]').click();
    $('q').value = ''; state.q = ''; renderIndex();
    $('index').scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' });
  });
  renderIndex();
  // 404 頁的搜尋框會帶 ?q= 過來；切換語言前捲到哪裡，重新載入後回到那裡
  const atLoad = (fn) => (document.readyState === 'complete' ? fn() : addEventListener('load', fn, { once: true }));
  const q0 = new URLSearchParams(location.search).get('q');
  if (q0) {
    $('q').value = q0; state.q = q0; renderIndex();
    atLoad(() => $('index').scrollIntoView({ behavior: 'instant' }));
  } else {
    let at0 = null;
    try { at0 = JSON.parse(sessionStorage.getItem('lab.y')); sessionStorage.removeItem('lab.y'); } catch (e) { /* 無痕模式 */ }
    const el0 = at0 && at0.id && $(at0.id);
    if (el0) atLoad(() => { const r = el0.getBoundingClientRect(); window.scrollTo({ top: r.top + scrollY + at0.f * r.height, behavior: 'instant' }); });
  }

  // ── 作品集 ──
  // 欄數：3 篇以內一排放完；4 篇排成 2×2，避免最後一排只剩一張
  const nw = L.works.length;
  $('case-list').style.setProperty('--cols', nw <= 3 ? nw : nw % 3 === 1 ? 2 : 3);
  $('case-list').innerHTML = L.works.map((w) => {
    const p = byId[w.product] || ME;
    const ch = (w.chapters || []).map(([t, h]) => `<a href="${abs(w.url, h)}" target="_blank" rel="noopener">${esc(t)}</a>`).join('');
    return `<article class="case pc" style="--pc:${p.color}">
      <a class="cv" href="${w.url}" target="_blank" rel="noopener" aria-label="${esc(w.go || tr('閱讀', 'Read'))} ${esc(w.sub)}"><img src="${asset(w.cover)}" alt="${esc(w.sub)} ${tr('封面', 'cover')}" loading="lazy"></a>
      <div class="b">
        <div class="sub"><i></i>${esc(w.sub)}</div>
        <h3>${esc(w.title)}</h3>
        <p>${esc(w.desc)}</p>
        <dl>${w.meta.map(([k2, v]) => `<dt>${esc(k2)}</dt><dd>${esc(v)}</dd>`).join('')}</dl>
        ${ch ? `<div class="ch">${ch}</div>` : ''}
        <div class="go"><a href="${w.url}" target="_blank" rel="noopener">${esc(w.go || tr('閱讀全文', 'Read'))} ↗</a></div>
      </div>
    </article>`;
  }).join('');

  // ── 宣傳素材 ──
  const promoted = P.filter((p) => p.promo);
  const shots = [];
  if (!promoted.length) { $('media').hidden = true; document.querySelector('[data-nav="media"]').hidden = true; }
  $('media-list').innerHTML = promoted.map((p) => {
    const m = p.promo, u = (f) => asset(m.dir + f);
    const fig = (inner, cap, ar) => `<figure class="m-fig" style="--ar:${ar}">${inner}<figcaption>${cap}</figcaption></figure>`;
    const shot = (src, thumb, t, n, ar) => { const i = shots.push({ src: u(src), t }) - 1; return fig(`<button type="button" class="m-item" data-shot="${i}" aria-label="${tr('放大：', 'Enlarge: ')}${esc(t)}"><img src="${u(thumb)}" alt="${esc(t)}" loading="lazy" decoding="async"></button>`, `<i>${esc(n)}</i>${esc(t)}`, ar); };
    const items = [];
    if (m.video) items.push(fig(`<div class="m-item m-video"><video muted loop playsinline preload="none" poster="${u(m.video.poster)}"><source src="${u(m.video.src)}" type="video/mp4"></video><button type="button" class="m-play" aria-label="${tr('播放／暫停', 'Play / pause')}"><span></span></button></div>`, `<i>VIDEO</i>${esc(m.video.t)}`, '9 / 16'));
    if (m.poster) items.push(shot(m.poster.src, m.poster.thumb, m.poster.t, 'POSTER', m.poster.ar));
    m.slides.forEach((t, i) => { const n = pad(i + 1); items.push(shot(`slide-${n}.jpg`, `slide-${n}-s.jpg`, t, `${n} / ${pad(m.slides.length)}`, m.slidesAr)); });
    const dl = [m.video && `<a href="${u(m.video.src)}" download>${tr('影片 MP4', 'Video MP4')} ↓</a>`, m.pdf && `<a href="${u(m.pdf.src)}" target="_blank" rel="noopener">${tr('說明圖 PDF', 'Slides PDF')} ↓</a>`, m.poster && `<a href="${u(m.poster.src)}" download>${tr('海報', 'Poster')} ↓</a>`].filter(Boolean).join('');
    return `<article class="mk pc" id="media-${p.id}" style="--pc:${p.color}">
      <div class="mk-head"><span class="sq1" aria-hidden="true"></span><div><h3>${esc(p.name)}<small>${esc(p.zh)}</small></h3><span class="meta">${dotted(m.date)} · ${[m.video && tr('影片', 'video'), m.poster && tr('海報', 'poster'), tr(`${m.slides.length} 張說明圖`, `${m.slides.length} slides`)].filter(Boolean).join(' · ')}</span></div>
        <div class="mk-dl">${dl}</div><div class="mk-nav" aria-hidden="true"><button type="button" data-strip="-1">←</button><button type="button" data-strip="1">→</button></div></div>
      ${m.note ? `<p class="mk-note">${esc(m.note)}</p>` : ''}
      <div class="strip" tabindex="0" aria-label="${esc(p.name)} ${tr('宣傳素材', 'media')}">${items.join('')}</div>
    </article>`;
  }).join('');
  document.addEventListener('click', (e) => { const b = e.target.closest('[data-strip]'); if (!b) return; const s = b.closest('.mk').querySelector('.strip'); s.scrollBy({ left: Math.sign(+b.dataset.strip) * s.clientWidth * .8, behavior: reduced ? 'auto' : 'smooth' }); });
  document.querySelectorAll('.m-video').forEach((box) => {
    const v = box.querySelector('video'), sync = () => box.classList.toggle('playing', !v.paused);
    v.addEventListener('play', sync); v.addEventListener('pause', sync);
    box.querySelector('.m-play').addEventListener('click', () => (v.paused ? v.play() : v.pause()));
    if (!reduced) new IntersectionObserver(([en]) => { if (en.isIntersecting) v.play().catch(() => {}); else v.pause(); }, { threshold: .6 }).observe(box);
  });
  const lb = $('lb'); let cur = 0;
  const showShot = (i) => { cur = (i + shots.length) % shots.length; $('lb-img').src = shots[cur].src; $('lb-img').alt = shots[cur].t; $('lb-cap').textContent = shots[cur].t; $('lb-n').textContent = `${cur + 1} / ${shots.length}`; };
  document.addEventListener('click', (e) => { const b = e.target.closest('[data-shot]'); if (b) { showShot(+b.dataset.shot); lb.showModal(); } });
  lb.addEventListener('click', (e) => { const b = e.target.closest('[data-lb]'); if (b) b.dataset.lb === 'x' ? lb.close() : showShot(cur + +b.dataset.lb); else if (e.target === lb) lb.close(); });
  lb.addEventListener('keydown', (e) => { if (e.key === 'ArrowLeft') showShot(cur - 1); if (e.key === 'ArrowRight') showShot(cur + 1); });

  // ── 時間軸 ──
  const startISO = first.slice(0, 8) + '01';
  const span = Math.max(dayDiff(startISO, todayISO) + 3, 14);
  const x = (iso) => (Math.min(Math.max(dayDiff(startISO, iso), 0), span) / span) * 100;
  const ticks = [];
  for (let d = 0; d <= span; d += 7) {
    const iso = new Date(toDate(startISO).getTime() + d * 864e5).toISOString().slice(0, 10);
    if (Math.abs(dayDiff(iso, todayISO)) > 2) ticks.push(`<span class="g-tick" style="left:${x(iso)}%"><span>${md(iso)}</span></span>`);
  }
  ticks.push(`<span class="g-tick today" style="left:${x(todayISO)}%"><span>${tr('今天', 'Today')} ${md(todayISO)}</span></span>`);
  $('gantt').innerHTML = `<div class="g-axis" aria-hidden="true">${ticks.join('')}</div>` + P.map((p) => {
    const dots = L.milestones.filter((m) => m.p === p.id).map((m) => `<span class="g-dot" style="left:${x(m.d)}%" title="${md(m.d)} ${esc(m.t)}"></span>`).join('');
    return `<div class="g-row pc" style="--pc:${p.color}"><div class="l"><i></i>${esc(p.name)}</div><div class="g-track"><a class="g-bar${p.status === 'private' ? ' private' : ''}" href="#w-${p.id}" style="left:${x(p.started)}%;width:${Math.max(x(todayISO) - x(p.started), 1)}%" title="${esc(p.name)}${tr(`：${md(p.started)} 開工至今`, `: ${md(p.started)} to today`)}"></a>${dots}</div></div>`;
  }).join('');
  // 窄螢幕上「今天」的標籤會壓到旁邊的日期，壓到的就先藏起來
  const fitTicks = () => {
    const labels = [...$('gantt').querySelectorAll('.g-tick span')];
    const today = labels.pop().getBoundingClientRect();
    let edge = -Infinity;
    labels.forEach((s) => {
      s.style.visibility = '';
      const r = s.getBoundingClientRect();
      const hit = r.left < edge + 8 || (r.right + 8 > today.left && r.left < today.right + 8);
      s.style.visibility = hit ? 'hidden' : '';
      if (!hit) edge = r.right;
    });
  };
  new ResizeObserver(fitTicks).observe($('gantt'));
  document.fonts.ready.then(fitTicks);
  const events = [
    ...P.map((p) => ({ d: p.started, p, start: true, t: `<b>${esc(p.name)} ${esc(p.zh)}</b>${tr('：', ': ')}${esc(p.tagline)}` })),
    ...L.milestones.map((m) => ({ d: m.d, p: byId[m.p] || null, t: esc(m.t) })),
  ].sort((a, b) => (a.d < b.d ? 1 : a.d > b.d ? -1 : (a.start ? 1 : 0) - (b.start ? 1 : 0)));
  $('log-list').innerHTML = events.map((e) => `<li class="${e.start ? 'start' : ''}${e.p ? ' pc' : ''}" ${e.p ? `style="--pc:${e.p.color}"` : ''}>
    <time datetime="${e.d}">${dotted(e.d)}${tr(`（${dow(e.d)}）`, ` · ${dow(e.d)}`)}</time>
    <span class="lp">${e.p ? `<i></i><a href="#w-${e.p.id}">${esc(e.p.name)}</a>` : '<i style="background:var(--tx)"></i>Aron Lab'}</span>
    <span class="lt">${e.t}</span></li>`).join('');

  // ── 頁尾 ──
  $('next-no').textContent = pad(P.length + 1);
  $('foot-tray').innerHTML = P.map((p) => `<button type="button" data-hex="${p.color}" style="background:${p.color}" title="${esc(p.name)} ${p.color}" aria-label="${tr(`複製 ${esc(p.name)} 的色碼`, `Copy the ${esc(p.name)} color`)} ${p.color}"></button>`).join('') +
    `<button type="button" class="nx" id="next-sq" title="${tr(`幫 No.${pad(P.length + 1)} 挑個顏色`, `Pick a color for No.${pad(P.length + 1)}`)}" aria-label="${tr('幫下一個作品隨機挑個顏色', 'Pick a random color for the next work')}"></button>`;
  $('foot-prods').innerHTML = P.map((p) => `<li><a href="#w-${p.id}"><i style="background:${p.color}"></i>${esc(p.name)} ${esc(p.zh)}</a></li>`).join('');
  $('foot-cases').innerHTML = L.works.map((w) => `<li><a href="${w.url}" target="_blank" rel="noopener">${esc(w.sub)} ↗</a></li>`).join('');
  $('foot-upd').textContent = tr(`ARON LAB · 內容更新 ${L.updated} · ${P.length} 個作品 · ${entries.length} 個入口`, `ARON LAB · Updated ${L.updated} · ${P.length} works · ${entries.length} entries`);

  // ── 目前章節 ──
  const navLinks = [...document.querySelectorAll('[data-nav]')];
  const io2 = new IntersectionObserver((list) => list.forEach((en) => { if (en.isIntersecting) navLinks.forEach((a) => a.classList.toggle('on', a.dataset.nav === en.target.dataset.sec)); }), { rootMargin: '-40% 0px -55% 0px' });
  document.querySelectorAll('.field').forEach((f) => { f.dataset.sec = 'works'; io2.observe(f); });
  ['index', 'cases', 'media', 'log'].forEach((id) => { $(id).dataset.sec = id; io2.observe($(id)); });

  // ── 小細節：複製色碼、幫下一個作品挑顏色 ──
  const toast = (msg) => {
    const t = $('toast'); t.textContent = msg; t.classList.add('on');
    clearTimeout(toast.h); toast.h = setTimeout(() => t.classList.remove('on'), 2000);
  };
  document.addEventListener('click', async (e) => {
    const b = e.target.closest('[data-hex]'); if (!b) return;
    try { await navigator.clipboard.writeText(b.dataset.hex); toast(`${tr('已複製', 'Copied')} ${b.dataset.hex}`); } catch (err) { toast(b.dataset.hex); }
  });
  const hslHex = (h, s, l) => {
    s /= 100; l /= 100;
    const f = (n) => { const q = (n + h / 30) % 12, a = s * Math.min(l, 1 - l); return Math.round(255 * (l - a * Math.max(-1, Math.min(q - 3, 9 - q, 1)))).toString(16).padStart(2, '0'); };
    return `#${f(0)}${f(8)}${f(4)}`.toUpperCase();
  };
  $('next-sq').addEventListener('click', () => {
    const c = hslHex(Math.random() * 360, 55 + Math.random() * 30, 42 + Math.random() * 16);
    $('next-sq').style.background = c; $('next-sq').classList.add('on'); $('next-no').style.color = c;
    toast(tr(`No.${pad(P.length + 1)} 會是這個顏色嗎？${c}`, `Will No.${pad(P.length + 1)} be this color? ${c}`));
  });

  // ── 彩蛋：Albers《色彩互動》的同色錯覺。點首屏的「Josef Albers」，或在頁面上打 albers ──
  const egg = $('egg'), EGG = '#8C7B6B';
  const syncEgg = () => {
    const r = $('egg-pair').classList.contains('reveal');
    $('egg-reveal').textContent = r ? tr('放回底色', 'Put the grounds back') : tr('拿掉底色', 'Remove the grounds');
    $('egg-a').textContent = r ? tr(`是同一個顏色（${EGG}）。放在亮的底色上看起來偏暗，放在暗的底色上就偏亮。`, `They're the same color (${EGG}). On a light ground it looks darker; on a dark ground it looks lighter.`)
      : tr('Albers 在《色彩互動》裡示範過：顏色會被旁邊的顏色改變。先猜猜看，再拿掉底色。', 'Albers showed this in Interaction of Color: a color changes with the colors around it. Take a guess, then remove the grounds.');
  };
  const openEgg = () => { $('egg-pair').classList.remove('reveal'); syncEgg(); if (!egg.open) egg.showModal(); };
  $('egg-reveal').addEventListener('click', () => { $('egg-pair').classList.toggle('reveal'); syncEgg(); });
  document.querySelectorAll('dialog.pop').forEach((d) => d.addEventListener('click', (e) => { if (e.target === d || e.target.closest('[data-pop-close]')) d.close(); }));
  document.addEventListener('click', (e) => { if (e.target.closest('[data-egg]')) openEgg(); else if (e.target.closest('[data-keys]')) $('keys').showModal(); });

  // ── 鍵盤：1–7 跳到作品、t 切換深淺色、? 看說明、打 albers 開彩蛋（/ 搜尋在索引那段） ──
  $('keys-list').innerHTML = [
    ['/', tr('搜尋所有入口', 'Search all entries')], [['1', String(P.length)], tr('跳到第幾號作品', 'Jump to work No. 1 to ' + P.length)],
    ['t', tr('切換深淺色', 'Switch light / dark')], ['?', tr('打開這個說明', 'Open this help')], ['Esc', tr('關閉視窗', 'Close a dialog')],
  ].map(([k2, t]) => `<dt>${[].concat(k2).map((x) => `<kbd>${esc(x)}</kbd>`).join(' – ')}</dt><dd>${t}</dd>`).join('');
  let typed = '';
  document.addEventListener('keydown', (ev) => {
    if (ev.metaKey || ev.ctrlKey || ev.altKey || /^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement.tagName) || document.querySelector('dialog[open]')) return;
    typed = (typed + (ev.key.length === 1 ? ev.key.toLowerCase() : '')).slice(-6);
    if (typed === 'albers') { typed = ''; openEgg(); return; }
    const n = +ev.key, f = n >= 1 && P[n - 1] && $(`w-${P[n - 1].id}`);
    if (f) f.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' });
    else if (ev.key === 't') {
      const cur = root.dataset.theme === 'auto' ? (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light') : root.dataset.theme;
      setTheme(cur === 'dark' ? 'light' : 'dark'); requestAnimationFrame(paintTop);
    } else if (ev.key === '?') $('keys').showModal();
  });

  // ── 給打開主控台的人 ──
  console.log(P.map(() => '%c   ').join(''), ...P.map((p) => `background:${p.color};font-size:16px;line-height:26px`));
  console.log(`%cARON LAB%c  ${tr('自己每天要用的，就自己做成產品。', 'What I need every day, I build into a product.')}`, 'font:700 15px Jost,sans-serif;letter-spacing:.14em', 'font:13px sans-serif');
  console.log(tr(
    `全部內容都在 data/lab.js，原始碼：https://github.com/North7/north7.github.io\n按 ? 看鍵盤快捷鍵；還有一個彩蛋：在頁面上打 albers。\n個人主頁：${L.owner.portfolio}`,
    `Everything on this page comes from data/lab.js. Source: https://github.com/North7/north7.github.io\nPress ? for keyboard shortcuts. There's also an easter egg: type albers anywhere on the page.\nHomepage: ${L.owner.portfolio}`,
  ));

  // ── 讀即時數據 ──
  const loadAll = () => Object.entries(FEEDS).forEach(async ([key, [url, read]]) => {
    try {
      const r = await fetch(url, { cache: 'no-cache' });
      if (!r.ok) throw new Error(r.status);
      const v = read(await r.json());
      live[key] = v;
      document.querySelectorAll(`[data-live="${key}"]`).forEach((el) => {
        el.classList.remove('wait');
        el.innerHTML = v.items.filter(([, val]) => val).map(([k2, val]) => `<span>${k2}<b>${val}</b></span>`).join('') + `<span>${tr('更新', 'Updated')} ${esc(v.when || '')}</span>`;
      });
      if (P[k].live === key) show(k);
    } catch (e) {
      document.querySelectorAll(`[data-live="${key}"]`).forEach((el) => { el.innerHTML = `<span>${tr('暫時讀不到即時資料', 'Live data is unavailable right now')}</span>`; });
    }
  });
  ('requestIdleCallback' in window) ? requestIdleCallback(loadAll, { timeout: 1500 }) : setTimeout(loadAll, 300);
})();
