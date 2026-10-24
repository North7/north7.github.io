// Aron Lab：全部由 data/lab.js 產生。即時數據直接讀各作品在 GitHub Pages 上的公開 JSON（GitHub Pages 允許跨來源讀取）。
(() => {
  'use strict';
  const L = window.LAB;
  const P = L.products;
  const $ = (id) => document.getElementById(id);
  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const pad = (n, w) => String(n).padStart(w, '0');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const ME = { id: 'me', name: 'Aron Song', zh: '個人', color: 'var(--ink)' };
  const byId = Object.fromEntries(P.map((p) => [p.id, p]));
  const swatch = (p) => (p.color2 ? `linear-gradient(180deg, ${p.color2}, ${p.color})` : p.color);
  const DOW = '日一二三四五六';

  // ── 日期（以台北時間為準） ──
  const tpe = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Taipei', year: 'numeric', month: '2-digit', day: '2-digit' });
  const todayISO = tpe.format(new Date());
  const toDate = (iso) => new Date(iso + 'T00:00:00Z');
  const dayDiff = (a, b) => Math.round((toDate(b) - toDate(a)) / 864e5);
  const dotted = (iso) => iso.replace(/-/g, '.');
  const md = (iso) => iso.slice(5).replace('-', '/');
  const dow = (iso) => DOW[toDate(iso).getUTCDay()];

  // ── 網址 ──
  const abs = (base, u) => {
    if (!u) return null;
    if (/^https?:\/\//.test(u)) return u;
    return base ? new URL(u, base).href : u;
  };
  const shortUrl = (u) => u.replace(/^https:\/\/north7\.github\.io/, '').replace(/^https?:\/\//, '');
  const external = (u) => (/^https?:/.test(u) ? ' target="_blank" rel="noopener"' : '');

  // ── 配色 ──
  const root = document.documentElement;
  const setTheme = (t) => {
    root.dataset.theme = t;
    try { t === 'auto' ? localStorage.removeItem('lab.theme') : localStorage.setItem('lab.theme', t); } catch (e) { /* 無痕模式 */ }
    document.querySelectorAll('[data-theme-set]').forEach((b) => b.classList.toggle('on', b.dataset.themeSet === t));
  };
  document.querySelectorAll('[data-theme-set]').forEach((b) => b.addEventListener('click', () => setTheme(b.dataset.themeSet)));
  setTheme(root.dataset.theme || 'auto');

  // ── 品牌標記：每個作品一格，作品變多就自動變寬 ──
  $('mark').innerHTML = P.map((p) => `<i style="background:${swatch(p)}"></i>`).join('');
  root.style.setProperty('--strip', `linear-gradient(90deg, ${P.map((p, i) => `${p.color} ${(i / P.length) * 100}% ${((i + 1) / P.length) * 100}%`).join(', ')})`);
  $('foot-strip').innerHTML = P.map((p) => `<i style="background:${swatch(p)}"></i>`).join('');

  $('k-count').textContent = 'No.' + pad(P.length, 3);
  $('k-date').textContent = `${dotted(todayISO)}（${dow(todayISO)}）`;

  // ── 所有入口 ──
  const TYPES = {
    site: '首頁', section: '分頁', case: '作品集', lang: '語言版本', tool: '工具', data: '資料',
    media: '宣傳素材', social: '社群', repo: '原始碼', local: '本機', legacy: '舊版', archive: '封存', private: '私人',
  };
  const promoUrl = (p, f) => new URL(p.promo.dir + f, location.href).href;
  const entries = [];
  P.forEach((p) => {
    if (p.site) entries.push({ p, t: `${p.name} 首頁`, u: p.site, type: 'site' });
    p.sections.forEach((s) => {
      if (s.u) entries.push({ p, n: s.n, t: s.t, u: abs(p.sectionsBase || p.site, s.u), type: 'section', label: p.sectionsLabel });
    });
    p.links.forEach((l) => entries.push({ p, t: l.t, u: abs(p.site, l.u), type: l.type }));
    (p.archive || []).forEach((l) => entries.push({ p, t: l.t, u: abs(p.site, l.u), type: l.type }));
    if (p.promo) {
      const m = p.promo;
      if (m.video) entries.push({ p, t: m.video.t, u: promoUrl(p, m.video.src), type: 'media' });
      if (m.pdf) entries.push({ p, t: m.pdf.t, u: promoUrl(p, m.pdf.src), type: 'media' });
      if (m.poster) entries.push({ p, t: m.poster.t, u: promoUrl(p, m.poster.src), type: 'media' });
      if (m.release) entries.push({ p, t: `宣傳素材原始檔（GitHub release${p.repoPrivate ? '，私人' : ''}）`, u: m.release, type: 'media' });
    }
    L.works.filter((w) => w.product === p.id && w.chapters).forEach((w) => {
      w.chapters.forEach(([t, h]) => entries.push({ p, t: `作品集 › ${t}`, u: abs(w.url, h), type: 'case' }));
    });
    if (!p.site && !p.links.some((l) => l.type === 'local')) entries.push({ p, t: `${p.name} ${p.zh}（只在自己的 Mac 上開啟）`, u: null, type: 'private' });
  });
  L.works.filter((w) => !w.product).forEach((w) => entries.push({ p: ME, t: w.sub, u: w.url, type: 'case' }));
  entries.push({ p: ME, t: 'GitHub · North7', u: L.owner.github, type: 'social' });
  entries.push({ p: ME, t: `X ${L.owner.xHandle}`, u: L.owner.x, type: 'social' });
  const linked = entries.filter((e) => e.u);
  const countFor = (p) => entries.filter((e) => e.p === p).length;

  // ── 首屏數字 ──
  const first = P.map((p) => p.started).sort()[0];
  const stats = [
    [P.length, '個作品', 'WORKS'],
    [P.filter((p) => p.status === 'live').length, '個公開上線、自動更新', 'LIVE'],
    [linked.length, '個入口，全部收在索引', 'LINKS'],
    [dayDiff(first, todayISO) + 1, `天，從 ${md(first)} 第一個作品開工`, 'DAYS'],
  ];
  $('stats').innerHTML = stats.map(([n, t, en]) => `<div class="stat"><b data-n="${n}">${reduced ? n : 0}</b><span>${t}<i>${en}</i></span></div>`).join('');
  if (!reduced) {
    const t0 = performance.now();
    const els = [...document.querySelectorAll('.stat b')];
    const tick = (t) => {
      const k = Math.min(1, (t - t0) / 1100), e = 1 - Math.pow(1 - k, 3);
      els.forEach((el) => { el.textContent = Math.round(+el.dataset.n * e); });
      if (k < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }

  // ── 作品 ──
  const STATUS = { live: '已上線', local: '本機', private: '私人' };
  const privateCover = (p) => `
    <div class="cover cover-private" role="img" aria-label="${esc(p.name)} 只在本機，不公開">
      <span class="bar"></span>
      <div>
        <svg viewBox="0 0 360 120" aria-hidden="true"><path d="M0 64h96l14-30 22 62 20-46 14 14h60l12-22 18 40 14-18h90" fill="none" stroke="${p.color}" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></svg>
        <div class="lock">PRIVATE · LOCAL ONLY<span>資料只在自己的 Mac 和 iCloud，不公開</span></div>
      </div>
    </div>`;
  const prodHTML = (p) => {
    const caseLink = p.links.find((l) => l.type === 'case');
    const caseUrl = caseLink && abs(p.site, caseLink.u);
    const coverHref = p.site || caseUrl;
    const cover = p.cover
      ? `<a class="cover${p.coverFit === 'contain' ? ' contain' : ''}" href="${coverHref}"${external(coverHref)} aria-label="開啟 ${esc(p.name)}">
           <span class="bar"></span>
           <img src="${p.cover}" alt="${esc(p.name)} 畫面" loading="lazy" decoding="async">
           <span class="open">${p.site ? '開啟網站' : '看產品案例'} ↗</span>
         </a>`
      : privateCover(p);
    const secs = p.sections.map((s) => {
      const u = abs(p.sectionsBase || p.site, s.u);
      const inner = `<i>${esc(s.n)}</i><span>${esc(s.t)}</span>`;
      return u ? `<a class="sc" href="${u}"${external(u)}>${inner}</a>` : `<div class="sc">${inner}</div>`;
    }).join('');
    const primary = p.site
      ? `<a class="btn btn-ink" href="${p.site}" target="_blank" rel="noopener">開啟 ${esc(p.name)} ↗</a>`
      : caseUrl
        ? `<a class="btn btn-ink" href="${caseUrl}" target="_blank" rel="noopener">看產品案例 ↗</a>`
        : `<span class="btn" aria-disabled="true">只在本機開啟</span>`;
    const second = [
      p.site && caseUrl ? `<a class="btn sm" href="${caseUrl}" target="_blank" rel="noopener">作品集</a>` : '',
      p.promo ? `<a class="btn sm" href="#media-${p.id}">宣傳素材</a>` : '',
      p.repo ? `<a class="btn sm" href="${p.repo}" target="_blank" rel="noopener">原始碼${p.repoPrivate ? '（私人）' : ''}</a>` : '',
    ].join('');
    const domains = p.domains.map((d) => L.domains[d]).join('・');
    return `
    <article class="prod" id="p-${p.id}" data-domains="${p.domains.join(' ')}" style="--pc:${p.color};--pk:${p.ink || p.color}">
      <div class="prod-no">${p.no}<small>${esc(p.kind)}</small></div>
      ${cover}
      <div class="prod-info">
        <div class="prod-meta">
          <span class="status ${p.status}"><i></i>${STATUS[p.status]} · ${esc(p.cadence)}</span>
          <span class="mono">${esc(domains)}</span>
          <span class="mono">${dotted(p.started)} 開工</span>
        </div>
        <div class="prod-name">
          <span class="logo" aria-hidden="true">${p.logo}</span>
          <h3>${esc(p.name)}<small>${esc(p.zh)}</small></h3>
        </div>
        <p class="tagline">${esc(p.tagline)}</p>
        <p class="desc">${esc(p.desc)}</p>
        ${p.live ? `<div class="live wait" data-live="${p.live}">讀取即時資料…</div>` : ''}
        <ul class="facts">${p.facts.map((f) => `<li>${esc(f)}</li>`).join('')}</ul>
        <div class="secs">
          <div class="secs-h">${esc(p.sectionsLabel)} · ${p.sections.length}<hr></div>
          <div class="secs-grid">${secs}</div>
        </div>
        <div class="acts">
          ${primary}${second}
          <button type="button" class="more" data-goto="${p.id}">全部 ${countFor(p)} 個入口 →</button>
        </div>
      </div>
    </article>`;
  };
  const nextNo = pad(P.length + 1, 2);
  $('prods').innerHTML = P.map(prodHTML).join('') + `
    <article class="prod next" data-domains="*">
      <div class="prod-no">${nextNo}<small>NEXT</small></div>
      <div class="next-box">
        <div><b>下一個作品</b><p>製作中。新的作品會依序編號，加進這一頁和索引。</p></div>
        <div class="next-tray" aria-hidden="true">${P.map((p) => `<i style="background:${swatch(p)}"></i>`).join('')}<i></i></div>
      </div>
    </article>`;

  // 領域篩選
  const domainKeys = Object.keys(L.domains).filter((d) => P.some((p) => p.domains.includes(d)));
  const domF = $('domain-filter');
  domF.innerHTML = [['all', '全部', P.length], ...domainKeys.map((d) => [d, L.domains[d], P.filter((p) => p.domains.includes(d)).length])]
    .map(([k, t, n]) => `<button type="button" class="fchip${k === 'all' ? ' on' : ''}" data-d="${k}">${t}<span class="n">${n}</span></button>`).join('');
  domF.addEventListener('click', (ev) => {
    const b = ev.target.closest('[data-d]');
    if (!b) return;
    domF.querySelectorAll('.fchip').forEach((x) => x.classList.toggle('on', x === b));
    const d = b.dataset.d;
    document.querySelectorAll('.prod').forEach((el) => {
      const ds = el.dataset.domains;
      el.hidden = !(d === 'all' || (ds !== '*' && ds.split(' ').includes(d)));
    });
  });

  // ── 索引 ──
  const state = { prod: 'all', type: 'all', q: '' };
  const groups = [...P, ME];
  const idxProd = $('idx-prod'), idxType = $('idx-type');
  idxProd.innerHTML = [`<button type="button" class="fchip on" data-p="all">全部作品</button>`,
    ...groups.map((p) => `<button type="button" class="fchip" data-p="${p.id}"><span class="sw" style="background:${swatch(p)}"></span>${esc(p.name)}<span class="n">${countFor(p)}</span></button>`)].join('');
  const typeKeys = Object.keys(TYPES).filter((k) => entries.some((e) => e.type === k));
  idxType.innerHTML = [`<button type="button" class="fchip on" data-t="all">全部類型</button>`,
    ...typeKeys.map((k) => `<button type="button" class="fchip" data-t="${k}">${TYPES[k]}<span class="n">${entries.filter((e) => e.type === k).length}</span></button>`)].join('');

  const hl = (s, q) => {
    const t = esc(s);
    if (!q) return t;
    const i = s.toLowerCase().indexOf(q);
    return i < 0 ? t : esc(s.slice(0, i)) + '<mark>' + esc(s.slice(i, i + q.length)) + '</mark>' + esc(s.slice(i + q.length));
  };
  const renderIndex = () => {
    const q = state.q.trim().toLowerCase();
    const rows = entries.filter((e) =>
      (state.prod === 'all' || e.p.id === state.prod) &&
      (state.type === 'all' || e.type === state.type) &&
      (!q || [e.t, e.u || '', e.p.name, e.p.zh, TYPES[e.type], e.label || ''].join(' ').toLowerCase().includes(q)));
    $('idx-count').textContent = rows.length === entries.length ? `共 ${entries.length} 個入口` : `顯示 ${rows.length} / ${entries.length}`;
    if (!rows.length) { $('idx').innerHTML = `<div class="idx-empty">沒有符合的入口。換個關鍵字，或清除篩選。</div>`; return; }
    let last = null;
    const html = rows.map((e) => {
      const grp = e.p !== last; last = e.p;
      const ty = e.type === 'section' ? e.label : TYPES[e.type];
      const cells = `
        <span class="pn${grp ? '' : ' rep'}" role="cell"><span class="sw" style="background:${swatch(e.p)}"></span>${esc(e.p.name)}<small>${esc(e.p.zh)}</small></span>
        <span class="t" role="cell">${e.n ? `<i>${esc(e.n)}</i>` : ''}${hl(e.t, q)}</span>
        <span class="ty ${e.type}" role="cell">${esc(ty)}</span>
        <span class="u" role="cell">${e.u ? hl(shortUrl(e.u), q) : '—'}</span>
        <span class="go" aria-hidden="true">↗</span>`;
      return e.u
        ? `<a class="ir${grp ? ' grp' : ''}" role="row" href="${e.u}"${external(e.u)}>${cells}</a>`
        : `<div class="ir nolink${grp ? ' grp' : ''}" role="row">${cells}</div>`;
    }).join('');
    $('idx').innerHTML = `<div class="ir head" role="row"><span role="columnheader">作品</span><span role="columnheader">入口</span><span role="columnheader">類型</span><span role="columnheader">網址</span><span></span></div>` + html;
  };
  const pick = (box, attr, key) => box.addEventListener('click', (ev) => {
    const b = ev.target.closest(`[data-${attr}]`);
    if (!b) return;
    state[key] = b.dataset[attr];
    box.querySelectorAll('.fchip').forEach((x) => x.classList.toggle('on', x === b));
    renderIndex();
  });
  pick(idxProd, 'p', 'prod');
  pick(idxType, 't', 'type');
  $('q').addEventListener('input', (ev) => { state.q = ev.target.value; renderIndex(); });
  document.addEventListener('keydown', (ev) => {
    if (ev.key === '/' && !/^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement.tagName)) {
      ev.preventDefault();
      $('q').focus({ preventScroll: true });
      $('index').scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' });
    }
  });
  // 作品卡片的「全部 N 個入口」→ 篩好索引再捲過去
  document.addEventListener('click', (ev) => {
    const b = ev.target.closest('[data-goto]');
    if (!b) return;
    const btn = idxProd.querySelector(`[data-p="${b.dataset.goto}"]`);
    if (btn) btn.click();
    idxType.querySelector('[data-t="all"]').click();
    $('q').value = ''; state.q = ''; renderIndex();
    $('index').scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' });
  });
  renderIndex();

  // ── 作品集 ──
  $('case-list').innerHTML = L.works.map((w) => {
    const p = byId[w.product] || ME;
    const chap = (w.chapters || []).map(([t, h]) => `<a href="${abs(w.url, h)}" target="_blank" rel="noopener">${esc(t)}</a>`).join('');
    return `
    <article class="case" style="--pc:${p.color}">
      <a class="cover" href="${w.url}" target="_blank" rel="noopener" aria-label="閱讀 ${esc(w.sub)}">
        <span class="bar"></span>
        <img src="${w.cover}" alt="${esc(w.sub)} 封面" loading="lazy" decoding="async">
        <span class="open">閱讀 ↗</span>
      </a>
      <div class="case-b">
        <div class="case-sub"><span class="sw" style="background:${swatch(p)}"></span>${esc(w.sub)}</div>
        <h3>${esc(w.title)}</h3>
        <p>${esc(w.desc)}</p>
        <dl>${w.meta.map(([k, v]) => `<dt>${esc(k)}</dt><dd>${esc(v)}</dd>`).join('')}</dl>
        ${chap ? `<div class="chap">${chap}</div>` : ''}
        <div class="acts"><a class="btn btn-ink sm" href="${w.url}" target="_blank" rel="noopener">閱讀全文 ↗</a></div>
      </div>
    </article>`;
  }).join('');

  // ── 宣傳素材 ──
  const promoted = P.filter((p) => p.promo);
  const shots = []; // 可放大檢視的圖：{ src, t, n }
  if (!promoted.length) {
    $('media').hidden = true;
    document.querySelector('[data-nav="media"]').hidden = true;
  }
  $('media-list').innerHTML = promoted.map((p) => {
    const m = p.promo, u = (f) => m.dir + f;
    const fig = (inner, cap, ar) => `<figure class="m-fig" style="--ar:${ar}">${inner}<figcaption>${cap}</figcaption></figure>`;
    const shot = (src, thumb, t, n, ar) => {
      const i = shots.push({ src: u(src), t, n }) - 1;
      return fig(`<button type="button" class="m-item" data-shot="${i}" aria-label="放大：${esc(t)}"><img src="${u(thumb)}" alt="${esc(t)}" loading="lazy" decoding="async"></button>`,
        `${n ? `<i>${n}</i>` : ''}${esc(t)}`, ar);
    };
    const items = [];
    if (m.video) {
      items.push(fig(`<div class="m-item m-video">
          <video muted loop playsinline preload="none" poster="${u(m.video.poster)}" aria-label="${esc(p.name)} ${esc(m.video.t)}"><source src="${u(m.video.src)}" type="video/mp4"></video>
          <button type="button" class="m-play" aria-label="播放／暫停"><span></span></button>
        </div>`, esc(m.video.t), '9 / 16'));
    }
    if (m.poster) items.push(shot(m.poster.src, m.poster.thumb, m.poster.t, 'POSTER', m.poster.ar));
    m.slides.forEach((t, i) => {
      const n = pad(i + 1, 2);
      items.push(shot(`slide-${n}.jpg`, `slide-${n}-s.jpg`, t, `${n} / ${pad(m.slides.length, 2)}`, m.slidesAr));
    });
    const dl = [
      m.video ? `<a class="btn sm" href="${u(m.video.src)}" download>影片 MP4 ↓</a>` : '',
      m.pdf ? `<a class="btn sm" href="${u(m.pdf.src)}" target="_blank" rel="noopener">說明圖 PDF ↓</a>` : '',
      m.poster ? `<a class="btn sm" href="${u(m.poster.src)}" download>海報 ↓</a>` : '',
    ].join('');
    const kinds = [m.video && '影片', m.poster && '海報', m.slides.length && `${m.slides.length} 張說明圖`].filter(Boolean).join(' · ');
    return `
    <article class="mk" id="media-${p.id}" style="--pc:${p.color}">
      <div class="mk-head">
        <span class="logo" aria-hidden="true">${p.logo}</span>
        <div class="mk-t">
          <h3>${esc(p.name)}<small>${esc(p.zh)}</small></h3>
          <span class="mono dim">${dotted(m.date)} · ${kinds}</span>
        </div>
        <div class="mk-dl">${dl}</div>
        <div class="mk-nav" aria-hidden="true"><button type="button" data-strip="-1">←</button><button type="button" data-strip="1">→</button></div>
      </div>
      ${m.note ? `<p class="mk-note">${esc(m.note)}</p>` : ''}
      <div class="strip" tabindex="0" aria-label="${esc(p.name)} 宣傳素材">${items.join('')}</div>
    </article>`;
  }).join('');

  // 左右捲動
  document.addEventListener('click', (ev) => {
    const b = ev.target.closest('[data-strip]');
    if (!b) return;
    const s = b.closest('.mk').querySelector('.strip');
    s.scrollBy({ left: Math.sign(+b.dataset.strip) * s.clientWidth * 0.8, behavior: reduced ? 'auto' : 'smooth' });
  });

  // 影片：捲到畫面裡才自動播放（無聲）；減少動態時只在按下時播放
  document.querySelectorAll('.m-video').forEach((box) => {
    const v = box.querySelector('video');
    const sync = () => box.classList.toggle('playing', !v.paused);
    v.addEventListener('play', sync);
    v.addEventListener('pause', sync);
    box.querySelector('.m-play').addEventListener('click', () => (v.paused ? v.play() : v.pause()));
    if (!reduced) {
      new IntersectionObserver(([en]) => {
        if (en.isIntersecting) v.play().catch(() => {});
        else v.pause();
      }, { threshold: 0.6 }).observe(box);
    }
  });

  // 放大檢視
  const lb = $('lb');
  let cur = 0;
  const show = (i) => {
    cur = (i + shots.length) % shots.length;
    const s = shots[cur];
    $('lb-img').src = s.src;
    $('lb-img').alt = s.t;
    $('lb-cap').textContent = s.t;
    $('lb-n').textContent = `${cur + 1} / ${shots.length}`;
  };
  document.addEventListener('click', (ev) => {
    const b = ev.target.closest('[data-shot]');
    if (!b) return;
    show(+b.dataset.shot);
    lb.showModal();
  });
  lb.addEventListener('click', (ev) => {
    const b = ev.target.closest('[data-lb]');
    if (b) b.dataset.lb === 'x' ? lb.close() : show(cur + +b.dataset.lb);
    else if (ev.target === lb) lb.close();
  });
  lb.addEventListener('keydown', (ev) => {
    if (ev.key === 'ArrowLeft') show(cur - 1);
    if (ev.key === 'ArrowRight') show(cur + 1);
  });

  // ── 時間軸 ──
  const startISO = first.slice(0, 8) + '01';
  const span = Math.max(dayDiff(startISO, todayISO) + 3, 14);
  const x = (iso) => (Math.min(Math.max(dayDiff(startISO, iso), 0), span) / span) * 100;
  const ticks = [];
  for (let i = 0; i <= span; i += 7) {
    const d = new Date(toDate(startISO).getTime() + i * 864e5).toISOString().slice(0, 10);
    if (Math.abs(dayDiff(d, todayISO)) > 2) ticks.push(`<span class="g-tick" style="left:${x(d)}%"><span>${md(d)}</span></span>`);
  }
  ticks.push(`<span class="g-tick today" style="left:${x(todayISO)}%"><span>今天 ${md(todayISO)}</span></span>`);
  const gRows = P.map((p) => {
    const dots = L.milestones.filter((m) => m.p === p.id)
      .map((m) => `<span class="g-dot" style="left:${x(m.d)}%" title="${md(m.d)} ${esc(m.t)}"></span>`).join('');
    const bar = p.color2 ? `linear-gradient(90deg, ${p.color2}, ${p.color})` : p.color;
    return `<div class="g-row" style="--pc:${bar}">
      <div class="g-l"><span class="sw" style="background:${swatch(p)}"></span>${esc(p.name)}</div>
      <div class="g-track">
        <a class="g-bar${p.status === 'private' ? ' private' : ''}" href="#p-${p.id}" style="left:${x(p.started)}%;width:${Math.max(x(todayISO) - x(p.started), 1)}%" title="${esc(p.name)}：${md(p.started)} 開工至今"></a>
        ${dots}
      </div>
    </div>`;
  }).join('');
  $('gantt').innerHTML = `<div class="g-axis" aria-hidden="true">${ticks.join('')}</div>${gRows}`;

  const events = [
    ...P.map((p) => ({ d: p.started, p, start: true, t: `<b>${esc(p.name)} ${esc(p.zh)}</b>：${esc(p.tagline)}` })),
    ...L.milestones.map((m) => ({ d: m.d, p: byId[m.p] || null, t: esc(m.t) })),
  ].sort((a, b) => (a.d < b.d ? 1 : a.d > b.d ? -1 : (a.start ? 1 : 0) - (b.start ? 1 : 0)));
  $('log-list').innerHTML = events.map((e) => `
    <li class="${e.start ? 'start' : ''}">
      <time datetime="${e.d}">${dotted(e.d)}（${dow(e.d)}）</time>
      <span class="lp">${e.p
        ? `<span class="sw" style="background:${swatch(e.p)}"></span><a href="#p-${e.p.id}">${esc(e.p.name)}</a>`
        : `<span class="sw" style="background:var(--strip)"></span>Aron Lab`}</span>
      <span class="lt">${e.t}</span>
    </li>`).join('');

  // ── 頁尾 ──
  $('foot-prods').innerHTML = P.map((p) => `<li><a href="#p-${p.id}"><span class="sw" style="background:${swatch(p)}"></span>${esc(p.name)} ${esc(p.zh)}</a></li>`).join('');
  $('foot-cases').innerHTML = L.works.map((w) => `<li><a href="${w.url}" target="_blank" rel="noopener">${esc(w.sub)} ↗</a></li>`).join('');
  $('foot-upd').textContent = `ARON LAB · 內容更新 ${L.updated} · ${P.length} 個作品 · ${entries.length} 個入口`;

  // ── 目前所在章節 ──
  const navLinks = [...document.querySelectorAll('[data-nav]')];
  const io = new IntersectionObserver((list) => {
    list.forEach((en) => {
      if (en.isIntersecting) navLinks.forEach((a) => a.classList.toggle('on', a.dataset.nav === en.target.id));
    });
  }, { rootMargin: '-35% 0px -60% 0px' });
  ['works', 'index', 'cases', 'media', 'log'].forEach((id) => io.observe($(id)));

  // ── 即時數據 ──
  const fmtNum = (v, d = 0) => (v == null || isNaN(v) ? '—' : Number(v).toLocaleString('en-US', { minimumFractionDigits: d, maximumFractionDigits: d }));
  // tw：台灣慣例紅漲綠跌（Morningbell）；其他作品綠漲紅跌
  const pct = (v, tw) => {
    if (v == null || isNaN(v)) return '—';
    const upCls = tw ? 'down' : 'up', dnCls = tw ? 'up' : 'down';
    return `<span class="${v >= 0 ? upCls : dnCls}">${v >= 0 ? '+' : ''}${Number(v).toFixed(2)}%</span>`;
  };
  const FEEDS = {
    tidemark: {
      url: 'https://north7.github.io/tidemark/latest.json',
      read: (d) => ({
        when: d.date,
        items: [['底部訊號', fmtNum(d.bottom_signal)], ['頂部訊號', fmtNum(d.top_signal)], ['BTC', '$' + fmtNum(d.price_usd)]],
        tape: `底部 <b>${fmtNum(d.bottom_signal)}</b> · 頂部 <b>${fmtNum(d.top_signal)}</b>`,
      }),
    },
    daybreak: {
      url: 'https://north7.github.io/daybreak/data/latest.json',
      read: (d) => {
        const b = (d.price && d.price.bar) || {};
        return {
          when: d.meta && d.meta.bar_date,
          items: [['BTC 收盤', '$' + fmtNum(b.c)], ['日漲跌', pct(b.chg_pct)]],
          tape: `BTC <b>$${fmtNum(b.c)}</b> ${pct(b.chg_pct)}`,
        };
      },
    },
    morningbell: {
      url: 'https://north7.github.io/morningbell/data/latest.json',
      read: (d) => {
        const s = d.quotes.SPX || {}, t = d.quotes.TW_TAIEX || {};
        return {
          when: d.meta && (d.meta.us_date || d.meta.bar_date),
          items: [['S&P 500', `${fmtNum(s.c, 2)} ${pct(s.chg_pct, true)}`], ['加權指數', `${fmtNum(t.c)} ${pct(t.chg_pct, true)}`]],
          tape: `S&amp;P <b>${fmtNum(s.c)}</b> ${pct(s.chg_pct, true)} · 加權 <b>${fmtNum(t.c)}</b>`,
        };
      },
    },
    ticker: {
      url: 'https://north7.github.io/market-ticker/version.json',
      read: (d) => ({ when: d.built + ' 部署', items: [['線上版本', esc(d.version)], ['commit', esc(d.sha)]], tape: `<b>${esc(d.version)}</b> · ${esc(d.built)}` }),
    },
  };

  // 跑馬燈：先放靜態的狀態，即時數據回來再替換
  const tapeVal = Object.fromEntries(P.map((p) => [p.id, p.status === 'live' ? esc(p.cadence) : STATUS[p.status]]));
  const renderTape = () => {
    const items = [`<span class="tape-item"><b>ARON LAB</b><span class="k">${dotted(todayISO)}</span></span>`,
      ...P.map((p) => `<span class="tape-item"><span class="dot" style="background:${swatch(p)}"></span><b>${esc(p.name.toUpperCase())}</b><span class="k">${p.no}</span>${tapeVal[p.id]}</span>`)].join('');
    $('tape').innerHTML = `<div class="tape-group">${items}</div><div class="tape-group" aria-hidden="true">${items}</div>`;
  };
  renderTape();

  const loadFeed = async (key, el) => {
    const f = FEEDS[key];
    const p = P.find((x) => x.live === key);
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 15000);
    try {
      const r = await fetch(f.url, { signal: ctrl.signal, cache: 'no-cache' });
      if (!r.ok) throw new Error(r.status);
      const v = f.read(await r.json());
      if (el) {
        el.classList.remove('wait');
        el.innerHTML = v.items.map(([k, val]) => `<span><span class="k">${k}</span><b>${val}</b></span>`).join('') +
          `<span class="when">● 更新 ${esc(v.when || '')}</span>`;
      }
      if (p) { tapeVal[p.id] = v.tape; renderTape(); }
    } catch (e) {
      if (el) el.textContent = '暫時讀不到即時資料，點上方按鈕直接開啟。';
    } finally {
      clearTimeout(timer);
    }
  };
  const startLive = () => document.querySelectorAll('[data-live]').forEach((el) => loadFeed(el.dataset.live, el));
  ('requestIdleCallback' in window) ? requestIdleCallback(startLive, { timeout: 1500 }) : setTimeout(startLive, 300);
})();
