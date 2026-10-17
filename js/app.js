/* Ziyofat Choyxonasi — saytning ishlash mantig'i.
   Taom va narxlarni o'zgartirish uchun bu faylga tegmang — data.js ni tahrirlang.
   Tugma va sarlavha matnlari — i18n.js faylida. */
(() => {
  'use strict';

  const S = window.SAYT;
  const TIL = window.TIL;
  if (!S || !TIL) return;

  /* ---------- Yordamchi funksiyalar ---------- */
  const root = document.documentElement;
  const $ = (sel, scope = document) => scope.querySelector(sel);
  const $$ = (sel, scope = document) => [...scope.querySelectorAll(sel)];
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const num = (n) => String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  const slug = (s) => s.toLowerCase().replace(/['ʻ’`]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  const icon = (name) => `<svg class="i" aria-hidden="true"><use href="#i-${name}"/></svg>`;
  const digits = (t) => String(t).replace(/[^\d+]/g, '');
  const telHref = (t) => 'tel:' + digits(t);
  // Telegram'da username bo'lsa — t.me/username?text=..., bo'lmasa telefon raqam orqali chat ochiladi (t.me/+998...)
  const tgHref = (text) => S.telegram
    ? `https://t.me/${S.telegram}` + (text ? `?text=${encodeURIComponent(text)}` : '')
    : `https://t.me/${digits(S.telefon)}`;
  // "?&body=" ko'rinishi Android va iPhone'da birdek ishlaydi
  const smsHref = (text) => `sms:${digits(S.telefon)}` + (text ? `?&body=${encodeURIComponent(text)}` : '');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const store = {
    get(key) { try { return localStorage.getItem(key); } catch { return null; } },
    set(key, val) { try { localStorage.setItem(key, val); } catch { /* saqlanmasa ham ishlayveradi */ } },
  };

  /* =====================================================================
     TIL (uz / ru / en)
  ===================================================================== */
  const LANGS = ['uz', 'ru', 'en'];
  const LANG_KEY = 'ziyofat-til';
  const pickLang = () => {
    const fromUrl = new URLSearchParams(location.search).get('lang');
    if (LANGS.includes(fromUrl)) return fromUrl;
    const saved = store.get(LANG_KEY);
    if (LANGS.includes(saved)) return saved;
    // Birinchi kirishda sayt o'zbek tilida ochiladi; ?lang=ru yoki ?lang=en havolasi boshqa tilda ochadi
    return 'uz';
  };
  let lang = pickLang();

  // { uz, ru, en } ko'rinishidagi matndan joriy tildagisini oladi (oddiy matn bo'lsa — o'zini)
  const tr = (v) => (v && typeof v === 'object' ? v[lang] ?? v.uz ?? '' : v ?? '');
  const uzOf = (v) => (v && typeof v === 'object' ? v.uz ?? '' : v ?? '');
  const ui = (key) => TIL[lang][key] ?? TIL.uz[key] ?? key;
  const walk = (path) => path.split('.').reduce((o, k) => (o == null ? o : o[k]), S);

  // Son bo'yicha to'g'ri shakl: ruscha (1 филиал / 3 филиала / 5 филиалов), inglizcha (1 pc / 5 pcs)
  const plural = (n, forms) => {
    if (!Array.isArray(forms)) return forms;
    if (forms.length < 3) return n === 1 ? forms[0] : forms[1];
    if (!Number.isInteger(n)) return forms[1];
    const a = Math.abs(n) % 100;
    const b = a % 10;
    if (a > 10 && a < 20) return forms[2];
    if (b === 1) return forms[0];
    if (b > 1 && b < 5) return forms[1];
    return forms[2];
  };
  // "4 six" -> "4 шампура" / "4 skewers"
  const unit = (v) => {
    const text = tr(v);
    if (lang === 'uz' || typeof v === 'object') return text;
    const m = /^([\d.,]+)\s*(.+)$/.exec(text);
    const forms = m && TIL.olchov[m[2]] && TIL.olchov[m[2]][lang];
    if (!forms) return text;
    const n = parseFloat(m[1].replace(',', '.'));
    return `${lang === 'en' ? m[1].replace(',', '.') : m[1]} ${plural(n, forms)}`;
  };
  const narx = (n) => `${num(n)} ${ui('currency')}`;

  // "@kalit" — interfeys matni, "#yo'l" — o'lchov, "yo'l" — data.js dagi matn
  const get = (path) => {
    if (path[0] === '@') return ui(path.slice(1));
    if (path[0] === '#') return unit(walk(path.slice(1)));
    return tr(walk(path));
  };
  // Til almashganda o'zi yangilanadigan matnli element
  const tx = (tag, path, cls = '', attrs = '') => `<${tag}${cls ? ` class="${cls}"` : ''}${attrs ? ' ' + attrs : ''} data-tr="${path}">${esc(get(path))}</${tag}>`;
  const img = (src, altPath, extra = '') =>
    `<img src="${esc(src)}" alt="${altPath ? esc(get(altPath)) : ''}"${altPath ? ` data-tr-alt="${altPath}"` : ''} decoding="async" ${extra} onerror="this.closest('[data-media]').classList.add('noimg')">`;

  // data.js da  sigdir: true  bo'lsa, rasm qirqilmasdan to'liq ko'rinadi (oq fondagi mahsulot rasmlari uchun)
  const fitAttr = (t) => (t.sigdir ? ' class="fit"' : '');

  const applyTexts = () => {
    $$('[data-tr]').forEach((el) => { el.textContent = get(el.dataset.tr); });
    $$('[data-tr-html]').forEach((el) => { el.innerHTML = get(el.dataset.trHtml); });
    $$('[data-tr-n]').forEach((el) => { el.textContent = plural(+el.dataset.n, ui(el.dataset.trN.slice(1))); });
    $$('[data-tr-aria]').forEach((el) => el.setAttribute('aria-label', get(el.dataset.trAria)));
    $$('[data-tr-ph]').forEach((el) => el.setAttribute('placeholder', get(el.dataset.trPh)));
    $$('[data-tr-alt]').forEach((el) => el.setAttribute('alt', get(el.dataset.trAlt)));
  };

  /* ---------- Taomlar ro'yxati ---------- */
  const DISHES = new Map();
  S.menyu.forEach((cat, ci) => cat.taomlar.forEach((t, ti) => {
    t.id = `${cat.id}-${slug(uzOf(t.nom))}`;
    t.path = `menyu.${ci}.taomlar.${ti}`;
    t.catPath = `menyu.${ci}.nom`;
    DISHES.set(t.id, t);
  }));

  /* ---------- Savat holati ---------- */
  const CART_KEY = 'ziyofat-savat';
  let cart = {};
  try { cart = JSON.parse(store.get(CART_KEY)) || {}; } catch { cart = {}; }
  Object.keys(cart).forEach((id) => { if (!DISHES.has(id) || !(cart[id] > 0)) delete cart[id]; });
  const saveCart = () => store.set(CART_KEY, JSON.stringify(cart));
  const order = { tur: 0 };

  /* =====================================================================
     UMUMIY MA'LUMOTLAR (telefon, telegram, SMS, ish vaqti)
  ===================================================================== */
  const hours = (f) => `${f.ochilish} – ${f.yopilish}`;
  $$('[data-tel]').forEach((a) => { a.href = telHref(S.telefon); });
  $$('[data-tel-text]').forEach((el) => { el.textContent = S.telefon; });
  $$('[data-tg]').forEach((a) => { a.href = tgHref(); });
  $$('[data-sms]').forEach((a) => { a.href = smsHref(); });
  $$('[data-insta]').forEach((a) => { a.href = S.ijtimoiy.instagram; });
  $$('[data-insta-count]').forEach((el) => { el.textContent = S.instagramObuna; });
  $$('[data-hours]').forEach((el) => { el.textContent = hours(S.filiallar[0]); });
  $$('[data-year]').forEach((el) => { el.textContent = new Date().getFullYear(); });
  $('[data-stat="taom"]').dataset.to = DISHES.size;
  $('[data-tr-n="@stat.dishes"]').dataset.n = DISHES.size;
  $('#bizImg1').src = S.rasmlar.biz1;
  $('#bizImg2').src = S.rasmlar.biz2;
  $('#ctaImg').src = S.rasmlar.banner;
  $$('#bizImg1, #bizImg2, #ctaImg').forEach((el) => {
    el.addEventListener('error', () => el.closest('[data-media]').classList.add('noimg'));
  });

  /* =====================================================================
     TAOM KARTALARI
  ===================================================================== */
  const actHTML = (id) => {
    const q = cart[id] || 0;
    return q
      ? `<div class="stepper">
           <button type="button" data-dec="${id}" data-tr-aria="@a.less" aria-label="${esc(ui('a.less'))}">${icon('minus')}</button>
           <output>${q}</output>
           <button type="button" data-inc="${id}" data-tr-aria="@a.more" aria-label="${esc(ui('a.more'))}">${icon('plus')}</button>
         </div>`
      : `<button type="button" class="add" data-inc="${id}">${icon('plus')}${tx('span', '@add')}</button>`;
  };
  const priceHTML = (t) =>
    `<div class="price">${tx('small', '#' + t.path + '.olchov')}<span><b>${num(t.narx)}</b> ${tx('span', '@currency')}</span></div>`;

  const dishHTML = (t, i) => `
    <article class="dish" data-reveal style="--d:${(i % 4) * 70}ms">
      <div class="dish__media" data-media>
        ${img(t.img, t.path + '.nom', 'loading="lazy"' + fitAttr(t))}
        ${t.xit ? `<span class="dish__badge">${icon('star')}${tx('span', '@badge.hit')}</span>` : ''}
      </div>
      <div class="dish__body">
        ${tx('h4', t.path + '.nom', 'dish__name')}
        ${tx('p', t.path + '.tavsif', 'dish__desc')}
        <div class="dish__foot">${priceHTML(t)}<div data-act="${t.id}">${actHTML(t.id)}</div></div>
      </div>
    </article>`;

  const hitHTML = (t, i) => `
    <article class="hit on-dark" data-media>
      ${img(t.img, t.path + '.nom', 'loading="lazy"' + fitAttr(t))}
      <span class="hit__n">№ ${String(i + 1).padStart(2, '0')}</span>
      <div class="hit__body">
        ${tx('span', t.catPath, 'hit__cat')}
        ${tx('h3', t.path + '.nom')}
        <div class="dish__foot" style="padding-top:0">${priceHTML(t)}<div data-act="${t.id}">${actHTML(t.id)}</div></div>
      </div>
    </article>`;

  /* =====================================================================
     HERO KARUSEL
  ===================================================================== */
  const hero = $('#hero');
  $('#heroBg').innerHTML = S.slaydlar.map((s, i) =>
    `<div class="hero__img${i ? '' : ' is-active'}"><img src="${esc(s.img)}" alt="" ${i ? '' : 'fetchpriority="high"'}></div>`).join('');
  // Asosiy sarlavha (shior) doim turadi, slayd bilan faqat pastdagi matn almashadi
  $('#heroTexts').innerHTML = S.slaydlar.map((s, i) => {
    const p = `slaydlar.${i}`;
    return `
    <div class="hero__text${i ? '' : ' is-active'}"${i ? ' aria-hidden="true"' : ''}>
      <p class="hero__sub" style="--d:.05s">${tx('span', p + '.belgi', 'hero__tag')}${tx('span', p + '.sarlavha')} ${tx('em', p + '.urgu')}</p>
      ${tx('p', p + '.matn', 'hero__lead', 'style="--d:.16s"')}
    </div>`;
  }).join('');
  $('#heroDots').innerHTML = S.slaydlar.map((_, i) =>
    `<button type="button" class="hero__dot${i ? '' : ' is-active'}" data-slide="${i}" aria-label="${i + 1}"><i></i></button>`).join('');

  const heroImgs = $$('.hero__img', hero);
  const heroTexts = $$('.hero__text', hero);
  const heroDots = $$('.hero__dot', hero);
  let slide = 0;
  const goSlide = (n) => {
    slide = (n + S.slaydlar.length) % S.slaydlar.length;
    [heroImgs, heroTexts, heroDots].forEach((list) => list.forEach((el, i) => el.classList.toggle('is-active', i === slide)));
    heroTexts.forEach((el, i) => el.toggleAttribute('aria-hidden', i !== slide));
  };
  // Nuqtadagi chiziq to'lib bo'lgach keyingi slaydga o'tadi
  $('#heroDots').addEventListener('animationend', (e) => { if (!reduced && e.target.matches('.is-active i')) goSlide(slide + 1); });
  $('#heroDots').addEventListener('click', (e) => { const b = e.target.closest('[data-slide]'); if (b) goSlide(+b.dataset.slide); });
  $('#heroPrev').addEventListener('click', () => goSlide(slide - 1));
  $('#heroNext').addEventListener('click', () => goSlide(slide + 1));
  const heroTextsBox = $('#heroTexts');
  heroTextsBox.addEventListener('pointerenter', () => hero.classList.add('paused'));
  heroTextsBox.addEventListener('pointerleave', () => hero.classList.remove('paused'));
  let touchX = null;
  hero.addEventListener('pointerdown', (e) => { touchX = e.pointerType === 'mouse' ? null : e.clientX; });
  hero.addEventListener('pointerup', (e) => {
    if (touchX === null) return;
    const dx = e.clientX - touchX;
    touchX = null;
    if (Math.abs(dx) > 50) goSlide(slide + (dx < 0 ? 1 : -1));
  });

  /* =====================================================================
     YUGURUVCHI QATOR
  ===================================================================== */
  const wordsHTML = S.menyu.flatMap((c, ci) => [
    `menyu.${ci}.nom`,
    ...c.taomlar.filter((t) => t.xit).map((t) => t.path + '.nom'),
  ]).map((p) => tx('span', p)).join('');
  $('#marquee').innerHTML = wordsHTML + wordsHTML;

  /* =====================================================================
     XIT TAOMLAR KARUSELI
  ===================================================================== */
  const hits = $('#hits');
  hits.innerHTML = [...DISHES.values()].filter((t) => t.xit).map(hitHTML).join('');
  const hitStep = () => {
    const card = hits.firstElementChild;
    return card ? card.getBoundingClientRect().width + parseFloat(getComputedStyle(hits).columnGap || 20) : 300;
  };
  const hitsMove = (dir) => {
    const end = hits.scrollLeft + hits.clientWidth >= hits.scrollWidth - 8;
    if (dir > 0 && end) hits.scrollTo({ left: 0, behavior: 'smooth' });
    else hits.scrollBy({ left: dir * hitStep(), behavior: 'smooth' });
  };
  $('#hitsPrev').addEventListener('click', () => hitsMove(-1));
  $('#hitsNext').addEventListener('click', () => hitsMove(1));
  let hitsBusy = false;
  let hitsSeen = false;
  ['pointerenter', 'touchstart', 'focusin'].forEach((ev) => hits.addEventListener(ev, () => { hitsBusy = true; }, { passive: true }));
  ['pointerleave', 'touchend', 'focusout'].forEach((ev) => hits.addEventListener(ev, () => { hitsBusy = false; }, { passive: true }));
  new IntersectionObserver(([en]) => { hitsSeen = en.isIntersecting; }, { threshold: .4 }).observe(hits);

  // Sichqoncha bilan ushlab chapga-o'ngga surish (telefonda barmoq bilan brauzerning o'zi suradi)
  const drag = { on: false, moved: false, x: 0, left: 0, v: 0, lastX: 0, lastT: 0 };
  hits.addEventListener('pointerdown', (e) => {
    if (e.pointerType !== 'mouse' || e.button !== 0) return;
    Object.assign(drag, { on: true, moved: false, x: e.clientX, left: hits.scrollLeft, v: 0, lastX: e.clientX, lastT: performance.now() });
  });
  addEventListener('pointermove', (e) => {
    if (!drag.on) return;
    const dx = e.clientX - drag.x;
    if (!drag.moved && Math.abs(dx) > 6) { drag.moved = true; hits.classList.add('dragging'); }
    if (!drag.moved) return;
    hits.scrollLeft = drag.left - dx;
    const now = performance.now();
    drag.v = (e.clientX - drag.lastX) / Math.max(1, now - drag.lastT);
    drag.lastX = e.clientX;
    drag.lastT = now;
  });
  const endDrag = () => {
    if (!drag.on) return;
    drag.on = false;
    if (!drag.moved) return;
    hits.classList.remove('dragging');
    // Qo'yib yuborilganda lenta tezligiga qarab biroz davom etib, kartaga "yopishadi"
    hits.scrollBy({ left: -drag.v * 280, behavior: reduced ? 'auto' : 'smooth' });
  };
  addEventListener('pointerup', endDrag);
  addEventListener('pointercancel', endDrag);
  // Surish tugaganda karta ichidagi "Savatga" tugmasi bosilib ketmasin
  hits.addEventListener('click', (e) => {
    if (!drag.moved) return;
    e.preventDefault();
    e.stopPropagation();
    drag.moved = false;
  }, true);
  hits.addEventListener('dragstart', (e) => e.preventDefault());
  if (!reduced) setInterval(() => { if (hitsSeen && !hitsBusy && !document.hidden) hitsMove(1); }, 3800);

  /* =====================================================================
     MENYU
  ===================================================================== */
  const chips = $('#chips');
  chips.innerHTML = S.menyu.map((c, i) =>
    `<a class="chip${i ? '' : ' is-active'}" href="#m-${c.id}" data-chip="${c.id}">${tx('span', `menyu.${i}.nom`)}<sup>${c.taomlar.length}</sup></a>`).join('');
  $('#menuList').innerHTML = S.menyu.map((c, i) => `
    <section class="cat" id="m-${c.id}" data-cat="${c.id}">
      <header class="cat__head" data-reveal>${tx('h3', `menyu.${i}.nom`)}${tx('p', `menyu.${i}.tavsif`)}</header>
      <div class="grid">${c.taomlar.map(dishHTML).join('')}</div>
    </section>`).join('');

  const setChip = (id) => {
    $$('.chip', chips).forEach((ch) => {
      const on = ch.dataset.chip === id;
      ch.classList.toggle('is-active', on);
      if (on) chips.scrollTo({ left: ch.offsetLeft - chips.offsetLeft - 16, behavior: 'smooth' });
    });
  };
  const spy = new IntersectionObserver((entries) => {
    entries.forEach((en) => { if (en.isIntersecting) setChip(en.target.dataset.cat); });
  }, { rootMargin: '-30% 0px -65% 0px' });
  $$('.cat').forEach((el) => spy.observe(el));

  /* =====================================================================
     FILIALLAR VA XARITA
  ===================================================================== */
  const isOpen = (f) => {
    const now = new Date(Date.now() + (new Date().getTimezoneOffset() + 300) * 60000); // Toshkent vaqti (UTC+5)
    const m = now.getHours() * 60 + now.getMinutes();
    const [a, b] = [f.ochilish, f.yopilish].map((t) => { const [h, mm] = t.split(':').map(Number); return h * 60 + mm; });
    return b > a ? m >= a && m < b : m >= a || m < b;
  };
  const gRoute = (f) => f.google || `https://www.google.com/maps/dir/?api=1&destination=${f.lat},${f.lng}`;
  const yRoute = (f) => f.yandex || `https://yandex.uz/maps/?rtext=~${f.lat}%2C${f.lng}&rtt=auto`;
  // Xarita — Yandex (koordinatalar Apple Maps havolasidan olingan)
  const yLang = { uz: 'uz_UZ', ru: 'ru_RU', en: 'en_US' };
  const mapSrc = (f) =>
    `https://yandex.uz/map-widget/v1/?ll=${f.lng}%2C${f.lat}&z=16&pt=${f.lng}%2C${f.lat}%2Cpm2rdm&lang=${yLang[lang]}`;

  const map = { fil: 0, live: false };
  const filList = $('#filList');
  const renderFil = () => {
    const one = S.filiallar.length === 1;
    filList.innerHTML = S.filiallar.map((f, i) => {
      const p = `filiallar.${i}`;
      const open = isOpen(f);
      return `
      <article class="fcard${i === map.fil ? ' is-active' : ''}" data-fil="${i}"${one ? '' : ' tabindex="0"'}>
        <div class="fcard__top">
          ${one ? `<img class="fcard__logo" src="${esc(S.logo)}" alt="">` : `<span class="fcard__n">0${i + 1}</span>`}
          ${tx('h3', p + '.nom')}
          ${tx('span', open ? '@fil.open' : '@fil.closed', 'badge-open' + (open ? '' : ' badge-open--no'))}
        </div>
        ${tx('p', p + '.manzil', 'fcard__addr')}
        <div class="fcard__more"><div>
          <div class="fcard__rows">
            <span>${icon('pin')}${tx('span', p + '.moljal')}</span>
            <span>${icon('clock')}<span>${tx('span', '@fil.daily')} ${esc(hours(f))}</span></span>
            <a href="${telHref(f.telefon)}">${icon('phone')}${esc(f.telefon)}</a>
          </div>
          ${tx('p', '@fil.route', 'fcard__lbl')}
          <div class="fcard__btns">
            <a href="${esc(yRoute(f))}" target="_blank" rel="noopener">${icon('route')}Yandex Maps</a>
            <a href="${esc(gRoute(f))}" target="_blank" rel="noopener">${icon('route')}Google Maps</a>
          </div>
        </div></div>
      </article>`;
    }).join('');
  };
  const renderMap = () => {
    if (!map.live) return;
    const frame = $('#mapFrame');
    const src = mapSrc(S.filiallar[map.fil]);
    if (frame.src !== src) frame.src = src;
  };
  const pickFil = (i) => { map.fil = i; renderFil(); renderMap(); };
  filList.addEventListener('click', (e) => {
    if (e.target.closest('a')) return;
    const card = e.target.closest('[data-fil]');
    if (card && +card.dataset.fil !== map.fil) pickFil(+card.dataset.fil);
  });
  filList.addEventListener('keydown', (e) => {
    if (e.key !== 'Enter' && e.key !== ' ') return;
    const card = e.target.closest('[data-fil]');
    if (card && e.target === card) { e.preventDefault(); pickFil(+card.dataset.fil); $(`[data-fil="${map.fil}"]`).focus(); }
  });
  renderFil();
  // "Hozir ochiq / yopiq" belgisi har daqiqada yangilanadi
  setInterval(renderFil, 60000);
  // Xarita faqat foydalanuvchi shu bo'limga yaqinlashganda yuklanadi (sayt tez ochilishi uchun)
  new IntersectionObserver(([en], obs) => {
    if (en.isIntersecting) { map.live = true; renderMap(); obs.disconnect(); }
  }, { rootMargin: '500px' }).observe($('#manzil'));

  /* =====================================================================
     FOOTER
  ===================================================================== */
  $('#ftrFil').innerHTML = S.filiallar.map((f, i) =>
    `<a href="${esc(yRoute(f))}" target="_blank" rel="noopener">${tx('b', `filiallar.${i}.manzil`)}${tx('span', `filiallar.${i}.moljal`)}</a>`).join('');
  const socials = { instagram: 'Instagram', telegram: 'Telegram', facebook: 'Facebook', youtube: 'YouTube' };
  $('#social').innerHTML = Object.keys(socials).filter((k) => S.ijtimoiy[k]).map((k) =>
    `<a href="${esc(S.ijtimoiy[k])}" target="_blank" rel="noopener" aria-label="${socials[k]}">${icon(k === 'telegram' ? 'send' : k)}</a>`).join('');

  /* =====================================================================
     SAVAT
  ===================================================================== */
  const drawer = $('#drawer');
  const cartList = $('#cartList');
  const toast = $('#toast');
  let toastTimer;
  const showToast = (text) => {
    toast.innerHTML = icon('check') + esc(text);
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 2200);
  };

  $('#orderType').innerHTML = S.buyurtmaTurlari.map((_, i) =>
    `<label><input type="radio" name="tur" value="${i}"${i ? '' : ' checked'}>${tx('span', `buyurtmaTurlari.${i}`)}</label>`).join('');

  const totals = () => {
    const ids = Object.keys(cart);
    return {
      ids,
      count: ids.reduce((a, id) => a + cart[id], 0),
      sum: ids.reduce((a, id) => a + cart[id] * DISHES.get(id).narx, 0),
    };
  };
  // Oshxona xodimlari tushunishi uchun boshqa tilda ham taomning o'zbekcha nomi qo'shib yoziladi
  const orderName = (t) => {
    const uz = uzOf(t.nom);
    const cur = tr(t.nom);
    return cur === uz ? uz : `${cur} (${uz})`;
  };
  const orderText = () => {
    const { ids, sum } = totals();
    const note = $('#orderNote').value.trim();
    const lines = [
      ui('order.hello'),
      '',
      ...ids.map((id, i) => { const t = DISHES.get(id); return `${i + 1}. ${orderName(t)} × ${cart[id]} = ${narx(t.narx * cart[id])}`; }),
      '',
      `${ui('order.total')}: ${narx(sum)}`,
      `${ui('order.type')}: ${tr(S.buyurtmaTurlari[order.tur])}`,
    ];
    if (note) lines.push(`${ui('order.note')}: ${note}`);
    return lines.join('\n');
  };
  const syncOrderLinks = () => {
    const text = orderText();
    $('#orderTg').href = tgHref(text);
    $('#orderSms').href = smsHref(text);
    $('#orderCall').href = telHref(S.filiallar[0].telefon);
  };
  // Telegram'da username bo'lmagani uchun matnni oldindan yozib bo'lmaydi —
  // shuning uchun buyurtma matni nusxalanadi, mijoz uni chatga joylaydi
  const copyText = async (text) => {
    try { await navigator.clipboard.writeText(text); return true; } catch { /* eski usul */ }
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.setAttribute('readonly', '');
    ta.style.cssText = 'position:fixed;opacity:0;top:0;left:0';
    document.body.append(ta);
    ta.select();
    let ok = false;
    try { ok = document.execCommand('copy'); } catch { ok = false; }
    ta.remove();
    return ok;
  };
  $('#orderTg').addEventListener('click', () => {
    copyText(orderText()).then((ok) => { if (ok) showToast(ui('toast.copied')); });
  });
  $$('.drawer__hint').forEach((el) => { el.hidden = !!S.telegram; });

  // Taom kartalaridagi "Savatga" tugmasi / son hisoblagichi
  const renderActs = () => $$('[data-act]').forEach((el) => { el.innerHTML = actHTML(el.dataset.act); });
  const renderCart = (bump) => {
    const { ids, count, sum } = totals();
    $$('[data-count]').forEach((el) => {
      el.textContent = count;
      if (el.closest('.cartbtn')) el.hidden = !count;
      if (bump) { el.classList.remove('bump'); void el.offsetWidth; el.classList.add('bump'); }
    });
    cartList.innerHTML = ids.length ? ids.map((id) => {
      const t = DISHES.get(id);
      return `
        <li>
          <div class="cart__img" data-media>${img(t.img, '', fitAttr(t))}</div>
          <div><h3>${esc(tr(t.nom))}</h3><p>${esc(unit(t.olchov))} · <b>${narx(t.narx * cart[id])}</b></p></div>
          ${actHTML(id)}
        </li>`;
    }).join('') : `
        <li class="cart__empty">
          ${icon('bag')}
          <b>${esc(ui('cart.empty.t'))}</b>
          ${esc(ui('cart.empty.d'))}
          <br><a class="btn btn--gold" href="#menyu" data-close-cart>${esc(ui('cart.empty.btn'))}</a>
        </li>`;
    $('#cartTotal').textContent = narx(sum);
    $('#cartbarTotal').textContent = narx(sum);
    $('#orderForm').hidden = !ids.length;
    $('#cartFoot').hidden = !ids.length;
    $('#cartbar').hidden = !ids.length || drawer.classList.contains('open');
    syncOrderLinks();
  };

  const change = (id, delta) => {
    const t = DISHES.get(id);
    if (!t) return;
    const was = cart[id] || 0;
    const q = Math.max(0, Math.min(99, was + delta));
    if (q) cart[id] = q; else delete cart[id];
    saveCart();
    renderActs();
    renderCart(true);
    if (!was && q) showToast(ui('toast.added').replace('{nom}', tr(t.nom)));
  };

  let lastFocus = null;
  const openCart = () => {
    lastFocus = document.activeElement;
    drawer.classList.add('open');
    drawer.setAttribute('aria-hidden', 'false');
    root.classList.add('lock');
    $('#cartbar').hidden = true;
    $('.drawer__head .rbtn').focus();
  };
  const closeCart = () => {
    drawer.classList.remove('open');
    drawer.setAttribute('aria-hidden', 'true');
    root.classList.remove('lock');
    renderCart();
    if (lastFocus) lastFocus.focus({ preventScroll: true });
  };

  document.addEventListener('click', (e) => {
    const inc = e.target.closest('[data-inc]');
    const dec = e.target.closest('[data-dec]');
    if (inc) return change(inc.dataset.inc, 1);
    if (dec) return change(dec.dataset.dec, -1);
    if (e.target.closest('[data-close-cart]')) return closeCart();
    if (e.target.closest('[data-open-cart]')) return openCart();
  });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && drawer.classList.contains('open')) closeCart(); });
  $('#orderForm').addEventListener('input', () => {
    order.tur = +($('input[name="tur"]:checked').value);
    syncOrderLinks();
  });
  $('#orderForm').addEventListener('submit', (e) => e.preventDefault());
  $('#cartClear').addEventListener('click', () => { cart = {}; saveCart(); renderActs(); renderCart(); });

  /* =====================================================================
     YORUG' / QORONG'I REJIM
  ===================================================================== */
  const THEME_KEY = 'ziyofat-mavzu';
  const syncThemeUI = () => {
    const light = root.dataset.theme === 'light';
    const label = ui(light ? 'theme.dark' : 'theme.light'); // tugma bosilganda qaysi rejimga o'tishi
    $$('[data-theme-toggle]').forEach((b) => { b.setAttribute('aria-label', label); b.title = label; });
    $$('[data-theme-label]').forEach((el) => { el.textContent = label; });
    $('meta[name="theme-color"]').content = light ? '#fbf5ea' : '#170d06';
  };
  const setTheme = (theme, btn) => {
    const apply = () => { root.dataset.theme = theme; syncThemeUI(); };
    store.set(THEME_KEY, theme);
    if (reduced) return apply();
    if (!document.startViewTransition) {
      // Eski brauzerlar: ranglar silliq almashadi
      root.classList.add('theme-fade');
      apply();
      setTimeout(() => root.classList.remove('theme-fade'), 600);
      return;
    }
    // Yangi rejim bosilgan tugma joyidan doira bo'lib butun sahifaga yoyiladi
    const r = btn.getBoundingClientRect();
    const x = r.left + r.width / 2;
    const y = r.top + r.height / 2;
    const end = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
    root.classList.add('vt-theme');
    const vt = document.startViewTransition(apply);
    vt.ready.then(() => root.animate(
      { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${end}px at ${x}px ${y}px)`] },
      { duration: 750, easing: 'cubic-bezier(.4, 0, .2, 1)', pseudoElement: '::view-transition-new(root)' },
    )).catch(() => {});
    vt.finished.finally(() => root.classList.remove('vt-theme'));
  };
  $$('[data-theme-toggle]').forEach((b) => b.addEventListener('click', () => {
    setTheme(root.dataset.theme === 'light' ? 'dark' : 'light', b);
  }));

  /* =====================================================================
     TILNI ALMASHTIRISH
  ===================================================================== */
  const langBox = $('#lang');
  const syncLangUI = () => {
    langBox.style.setProperty('--i', LANGS.indexOf(lang));
    $$('[data-lang]', langBox).forEach((b) => {
      b.classList.toggle('is-active', b.dataset.lang === lang);
      b.setAttribute('aria-pressed', String(b.dataset.lang === lang));
    });
    $('[data-lang-cur]').textContent = lang.toUpperCase();
    $('[data-lang-flag]').setAttribute('href', `#f-${lang}`);
  };
  // Til almashganda: tanlangan bayroq aylanib "sakraydi", tepada bayroq ranglaridagi chiziq yugurib o'tadi
  const FLAG_COLORS = {
    uz: '#0099b5 0 31%, #ce1126 31% 35%, #fff 35% 65%, #ce1126 65% 69%, #1eb53a 69%',
    ru: '#fff 0 33.3%, #0039a6 33.3% 66.6%, #d52b1e 66.6%',
    en: '#012169 0 30%, #fff 30% 36%, #c8102e 36% 64%, #fff 64% 70%, #012169 70%',
  };
  const langFx = (next) => {
    if (reduced) return;
    const fx = $('#langfx');
    fx.style.setProperty('--flag', `linear-gradient(90deg, ${FLAG_COLORS[next]})`);
    fx.classList.remove('run');
    void fx.offsetWidth;
    fx.classList.add('run');
    $$(`[data-lang="${next}"] .flag, .lang__cur .flag`, langBox).forEach((f) => {
      f.classList.remove('flip');
      void f.offsetWidth;
      f.classList.add('flip');
    });
  };

  // Qidiruv tizimlari uchun ma'lumot (Google / Yandex — schema.org), joriy tilda
  const base = location.origin + location.pathname;
  const ldTag = document.createElement('script');
  ldTag.type = 'application/ld+json';
  document.head.append(ldTag);
  const writeLd = () => {
    ldTag.textContent = JSON.stringify(S.filiallar.map((f) => ({
      '@context': 'https://schema.org',
      '@type': 'Restaurant',
      name: S.filiallar.length === 1 ? S.brend : `${S.brend} — ${tr(f.nom)}`,
      url: base,
      logo: new URL(S.logo, base).href,
      image: S.slaydlar[0].img,
      telephone: f.telefon,
      servesCuisine: [ui('ld.cuisine')],
      priceRange: '$$',
      address: { '@type': 'PostalAddress', streetAddress: tr(f.moljal), addressLocality: 'Qarshi', addressRegion: 'Qashqadaryo', addressCountry: 'UZ' },
      geo: { '@type': 'GeoCoordinates', latitude: f.lat, longitude: f.lng },
      openingHoursSpecification: { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'], opens: f.ochilish, closes: f.yopilish },
      sameAs: Object.values(S.ijtimoiy).filter(Boolean),
      hasMenu: {
        '@type': 'Menu',
        inLanguage: lang,
        hasMenuSection: S.menyu.map((c) => ({
          '@type': 'MenuSection',
          name: tr(c.nom),
          hasMenuItem: c.taomlar.map((t) => ({
            '@type': 'MenuItem',
            name: tr(t.nom),
            description: tr(t.tavsif),
            offers: { '@type': 'Offer', price: t.narx, priceCurrency: 'UZS' },
          })),
        })),
      },
    })));
  };
  // Har bir til uchun alohida havola: sayt.uz/?lang=ru va sayt.uz/?lang=en
  LANGS.forEach((l) => {
    const link = document.createElement('link');
    link.rel = 'alternate';
    link.hreflang = l;
    link.href = l === 'uz' ? base : `${base}?lang=${l}`;
    document.head.append(link);
  });

  const applyLang = () => {
    root.lang = lang;
    document.title = ui('meta.title');
    $('meta[name="description"]').content = ui('meta.desc');
    applyTexts();
    renderCart();
    syncThemeUI();
    syncLangUI();
    writeLd();
  };

  const visible = (el) => {
    const r = el.getBoundingClientRect();
    if (!r.width || r.bottom < 0 || r.top > innerHeight || r.right < 0 || r.left > innerWidth) return null;
    if (el.checkVisibility && !el.checkVisibility({ visibilityProperty: true })) return null;
    return { el, top: r.top, left: r.left };
  };
  let langAnims = [];
  let langTimer;
  const switchLang = (next) => {
    if (next === lang || !LANGS.includes(next)) return;
    lang = next;
    store.set(LANG_KEY, lang);
    const url = new URL(location.href);
    if (lang === 'uz') url.searchParams.delete('lang'); else url.searchParams.set('lang', lang);
    history.replaceState(null, '', url);
    syncLangUI();
    langFx(lang);

    clearTimeout(langTimer);
    langAnims.forEach((a) => a.cancel());
    langAnims = [];
    // Ekrandagi matnlar xiralashib so'nadi, so'ng yangi tilda yuqoridan pastga to'lqin bo'lib chiqadi
    const seen = reduced ? [] : $$('[data-tr], [data-tr-html], [data-tr-n]').map(visible).filter(Boolean)
      .sort((a, b) => a.top - b.top || a.left - b.left);
    if (!seen.length) return applyLang();
    langAnims = seen.map(({ el }) => el.animate(
      { opacity: [1, 0], filter: ['blur(0px)', 'blur(7px)'] },
      { duration: 190, easing: 'ease-in', fill: 'forwards' },
    ));
    langTimer = setTimeout(() => {
      applyLang();
      if (map.live) renderMap();
      langAnims.forEach((a) => a.cancel());
      langAnims = seen.map(({ el }, i) => el.animate(
        { opacity: [0, 1], filter: ['blur(7px)', 'blur(0px)'], transform: ['translateY(12px)', 'translateY(0)'] },
        { duration: 620, delay: Math.min(i * 18, 480), easing: 'cubic-bezier(.2, .7, .2, 1)', fill: 'backwards' },
      ));
    }, 200);
  };

  langBox.addEventListener('click', (e) => {
    const b = e.target.closest('[data-lang]');
    if (b) { switchLang(b.dataset.lang); langBox.classList.remove('open'); }
    else if (e.target.closest('.lang__cur')) langBox.classList.toggle('open');
    $('.lang__cur').setAttribute('aria-expanded', String(langBox.classList.contains('open')));
  });
  document.addEventListener('click', (e) => {
    if (e.target.closest('#lang')) return;
    langBox.classList.remove('open');
    $('.lang__cur').setAttribute('aria-expanded', 'false');
  });

  applyLang();

  /* =====================================================================
     HEADER VA MOBIL MENYU
  ===================================================================== */
  const hdr = $('#hdr');
  const nav = $('#nav');
  const burger = $('#burger');
  const onScroll = () => hdr.classList.toggle('scrolled', scrollY > 30);
  addEventListener('scroll', onScroll, { passive: true });
  onScroll();
  const toggleNav = (open) => {
    nav.classList.toggle('open', open);
    burger.setAttribute('aria-expanded', String(open));
    burger.innerHTML = icon(open ? 'x' : 'menu');
  };
  burger.addEventListener('click', () => toggleNav(!nav.classList.contains('open')));
  nav.addEventListener('click', (e) => { if (e.target.closest('a')) toggleNav(false); });

  /* =====================================================================
     SCROLL ANIMATSIYALARI VA SANAGICH
  ===================================================================== */
  const reveal = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (!en.isIntersecting) return;
      const el = en.target;
      el.classList.add('in');
      reveal.unobserve(el);
      // Animatsiya tugagach belgini olib tashlaymiz — kartaning hover effekti kechikmasligi uchun
      setTimeout(() => { el.removeAttribute('data-reveal'); el.style.removeProperty('--d'); }, 1300);
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: .08 });
  $$('[data-reveal]').forEach((el) => reveal.observe(el));

  const runCounters = () => $$('[data-to]').forEach((el) => {
    const to = +el.dataset.to;
    if (reduced) { el.textContent = to; return; }
    const t0 = performance.now();
    const tick = (now) => {
      const p = Math.min(1, (now - t0) / 1400);
      el.textContent = Math.round(to * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  });

  /* =====================================================================
     KIRISH ANIMATSIYASI (logotip, choynakdan piyolaga choy, "Xush kelibsiz!")
     Har safar — sahifa yangilanganda ham — ko'rsatiladi, keyin 1-bo'lim ochiladi.
  ===================================================================== */
  const splash = $('#splash');
  // Yangilanganda brauzer avvalgi joyga yoki #havolaga sakramasin — doim tepadan boshlanadi
  const toTop = () => {
    if (location.hash) history.replaceState(null, '', location.pathname + location.search);
    root.style.scrollBehavior = 'auto';
    scrollTo(0, 0);
    root.style.removeProperty('scroll-behavior');
  };
  if (!root.classList.contains('splash-on')) {
    splash.remove();
    runCounters();
  } else {
    toTop();
    // Faqat splash hali ochiq bo'lsa — mehmon o'zi surishni boshlagan bo'lsa, tepaga qaytarmaymiz
    addEventListener('load', () => { if (!closed) toTop(); }, { once: true });
    // Birinchi kirishda animatsiya o'z tezligida; sahifa yangilanganda (shu oynada qayta ochilganda) tezroq o'tadi
    let seen = false;
    try { seen = sessionStorage.getItem('ziyofat-splash') === '1'; sessionStorage.setItem('ziyofat-splash', '1'); } catch { /* baribir ishlayveradi */ }
    const speed = seen ? 0.45 : 1; // CSS dagi .splash.fast { --k: .45 } bilan bir xil bo'lishi kerak
    if (seen) splash.classList.add('fast');

    // Har bir harf alohida chiqadi; so'zlar qatorda bo'linib ketmasligi uchun alohida o'raladi
    let k = 0;
    const letters = (text, start, step) => text.split(' ').map((word) =>
      `<span class="w">${[...word].map((ch) => `<span style="--d:${((start + k++ * step) * speed).toFixed(3)}s">${esc(ch)}</span>`).join('')}</span>`,
    ).join(' ');
    $('#splashL1').innerHTML = letters(ui('splash.l1'), 2.1, .045);
    k = 0;
    $('#splashL2').innerHTML = letters(ui('splash.l2'), 3.05, .05);
    splash.classList.add('go');

    let closed = false;
    const closeSplash = () => {
      if (closed) return;
      closed = true;
      clearTimeout(splashTimer);
      splash.classList.add('out');
      toTop();
      setTimeout(() => { root.classList.remove('splash-on'); splash.remove(); toTop(); runCounters(); }, 750 * speed);
    };
    const splashTimer = setTimeout(closeSplash, 5800 * speed);
    splash.addEventListener('click', closeSplash);
    addEventListener('keydown', (e) => { if (e.key === 'Escape' || e.key === 'Enter') closeSplash(); });
  }
})();
