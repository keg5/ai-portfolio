/* ============================================================
   AI Portfolio — main.js
   ============================================================ */

/* ---- Navbar scroll shadow ---- */
// [BUG-01] null チェックを追加
const navbar = document.getElementById('navbar');
if (navbar) {
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 10);
  });
}

/* ---- Hamburger menu ---- */
// [BUG-01] null チェックを追加
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');

if (hamburger && mobileMenu) {
  hamburger.addEventListener('click', () => {
    const isOpen = mobileMenu.classList.toggle('open');

    // [A11Y-02] aria-hidden をメニュー開閉に同期
    mobileMenu.setAttribute('aria-hidden', isOpen ? 'false' : 'true');

    // aria-expanded / aria-label をボタンに同期
    hamburger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    hamburger.setAttribute('aria-label', isOpen ? 'メニューを閉じる' : 'メニューを開く');

    // [A11Y-01] メニューを開いたらフォーカスを先頭リンクへ移動
    if (isOpen) {
      const firstLink = mobileMenu.querySelector('a');
      if (firstLink) firstLink.focus();
    }
  });

  document.querySelectorAll('.mobile-link').forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
      mobileMenu.setAttribute('aria-hidden', 'true');
      hamburger.setAttribute('aria-expanded', 'false');
      hamburger.setAttribute('aria-label', 'メニューを開く');
    });
  });
}

/* ---- Filter tabs ---- */
const filterTabs = document.querySelectorAll('.filter-tab');
const workCards  = document.querySelectorAll('.work-card');

filterTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    filterTabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');

    const filter = tab.dataset.filter;
    workCards.forEach(card => {
      const match = filter === 'all' || card.dataset.category === filter;
      card.classList.toggle('hidden', !match);
    });
  });
});

/* ---- Smooth scroll for nav ---- */
// [Q-4] href が空文字・不正な場合の安全チェック
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const hash = a.getAttribute('href');
    if (!hash || hash === '#') return;
    try {
      const target = document.querySelector(hash);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    } catch (_) {
      // querySelector が不正セレクタで throw した場合は何もしない
    }
  });
});

/* ---- Fade-up on scroll (IntersectionObserver) ---- */
// [PERF-02] rootMargin を追加してモバイルでの発火タイミングを改善
const fadeEls = document.querySelectorAll('.fade-up');
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.15,
  rootMargin: '0px 0px -50px 0px'  // 要素が少し手前に来たタイミングで発火
});
fadeEls.forEach(el => observer.observe(el));
