function setPage(side, entry, dom) {
  const isLeft = side === 'left';
  const img  = isLeft ? dom.leftImg : dom.rightImg;
  const name = isLeft ? dom.leftName : dom.rightName;
  const phot = isLeft ? dom.leftPhotographer : dom.rightPhotographer;
  const loc  = isLeft ? dom.leftLocation : dom.rightLocation;
  const txt  = isLeft ? dom.leftDiary : dom.rightDiary;

  if (!img || !name || !phot || !loc || !txt) return;

  if (!entry) {
    img.setAttribute(
      'src',
      img.dataset.placeholder ||
      img.getAttribute('data-placeholder') ||
      img.getAttribute('src') ||
      ''
    );
    name.textContent = '';
    phot.textContent = '';
    loc.textContent = '';
    txt.textContent = '';
    return;
  }

  img.setAttribute('src', entry.imageUrl || img.getAttribute('src') || '');
  name.textContent = entry.catName || '';
  phot.textContent = entry.photographer || 'Feline Spotter';
  loc.textContent = entry.location || '';
  txt.textContent = entry.description || '';
}

function updateBoundaryLinks(prevBtns, nextBtns, base, lastBase, entries) {
  for (const btn of prevBtns) {
    btn.setAttribute('href', base <= 0 ? '/' : '#prev-spread');
  }
  const goAdd = entries.length <= 1 || base >= lastBase;
  for (const btn of nextBtns) {
    btn.setAttribute('href', goAdd ? '/add-entry' : '#next-spread');
  }
}

function render(state) {
  setPage('left',  state.entries[state.base]     || null, state.dom);
  setPage('right', state.entries[state.base + 1] || null, state.dom);
  updateBoundaryLinks(state.prevBtns, state.nextBtns, state.base, state.lastBase, state.entries);
}

function nextSpread(state) {
  if (state.base >= state.lastBase || state.entries.length <= 1) {
    window.location.href = '/add-entry';
    return;
  }
  state.base = Math.min(state.base + 2, state.lastBase);
  render(state);
}

function prevSpread(state) {
  if (state.base <= 0) {
    window.location.href = '/';
    return;
  }
  state.base = Math.max(state.base - 2, 0);
  render(state);
}

window.onload = function () {
  const flash = document.querySelector('.flash');
  if (flash) setTimeout(() => flash.remove(), 3000);

  const path = window.location.pathname;

  if (path === '/') {
    const paws = document.querySelectorAll('.cover .cover-paw');
    for (const el of paws) el.setAttribute('href', '/diary');
    return;
  }

  if (path === '/add-entry') {
    const prev = document.querySelectorAll('.page--left .paw-prev');
    for (const el of prev) el.setAttribute('href', '/diary');
    const next = document.querySelectorAll('.page--right .paw-next');
    for (const el of next) el.setAttribute('href', '/report');
    return;
  }

  if (path === '/report') {
    const prev = document.querySelectorAll('.page--left .paw-prev');
    for (const el of prev) el.setAttribute('href', '/add-entry');
    const next = document.querySelectorAll('.page--right .paw-next');
    for (const el of next) el.setAttribute('href', '/about');
    return;
  }

  if (path === '/about') {
    const prev = document.querySelectorAll('.page--left .paw-prev');
    for (const el of prev) el.setAttribute('href', '/report');
    const next = document.querySelectorAll('.page--right .paw-next');
    for (const el of next) el.style.display = 'none'; 
    return;
  }

  // ---------- diary page ----------
  if (path !== '/diary') return;
  const notebook = document.querySelector('.notebook--diary');
  if (!notebook) return;

  const entries =
    (window.__ENTRIES__ && Array.isArray(window.__ENTRIES__)) ? window.__ENTRIES__ :
    (window.entries && Array.isArray(window.entries)) ? window.entries : [];

  const prevBtns = document.querySelectorAll('.paw-prev');
  const nextBtns = document.querySelectorAll('.paw-next');

  const dom = {
    leftImg: document.getElementById('left-photo'),
    leftName: document.getElementById('left-catname'),
    leftPhotographer: document.getElementById('left-photographer'),
    leftLocation: document.getElementById('left-location'),
    leftDiary: document.getElementById('left-diary'),

    rightImg: document.getElementById('right-photo'),
    rightName: document.getElementById('right-catname'),
    rightPhotographer: document.getElementById('right-photographer'),
    rightLocation: document.getElementById('right-location'),
    rightDiary: document.getElementById('right-diary'),
  };

  const params = new URLSearchParams(window.location.search);
  const openAtLast = params.get('at') === 'last';
  const lastBase = entries.length >= 2 ? (entries.length - 2) : 0;
  const base = openAtLast ? lastBase : 0;

  const state = { entries, base, lastBase, dom, prevBtns, nextBtns };

  // initial render
  render(state);

  // listeners
  for (const btn of nextBtns) {
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      nextSpread(state);
    });
  }
  for (const btn of prevBtns) {
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      prevSpread(state);
    });
  }
};
