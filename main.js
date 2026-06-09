/* ============================================================
   AI Portfolio — main.js
   ============================================================ */

/* ---- Navbar scroll shadow ---- */
const navbar = document.getElementById('navbar');
if (navbar) {
  // passive: true でスクロールスレッドをブロックしない
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 10);
  }, { passive: true });
}

/* ---- Hamburger menu ---- */
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');

if (hamburger && mobileMenu) {
  // メニューを閉じる処理を1か所に集約（Reuse / Altitude）
  function closeMobileMenu() {
    mobileMenu.setAttribute('aria-hidden', 'true');
    hamburger.setAttribute('aria-expanded', 'false');
    hamburger.setAttribute('aria-label', 'メニューを開く');
  }

  hamburger.addEventListener('click', () => {
    // aria-hidden を唯一の真実源として開閉管理（Altitude: .open クラス不要）
    const isOpen = mobileMenu.getAttribute('aria-hidden') === 'true';
    mobileMenu.setAttribute('aria-hidden', String(!isOpen));
    hamburger.setAttribute('aria-expanded', String(isOpen));
    hamburger.setAttribute('aria-label', isOpen ? 'メニューを閉じる' : 'メニューを開く');
    if (isOpen) {
      const firstLink = mobileMenu.querySelector('a');
      if (firstLink) firstLink.focus();
    }
  });

  document.querySelectorAll('.mobile-link').forEach(link => {
    link.addEventListener('click', closeMobileMenu);
  });
}

/* ---- Filter tabs ---- */
const filterTabs = document.querySelectorAll('.filter-tab');
const workCards  = document.querySelectorAll('.work-card');

// activeTab を変数で追跡して全タブ走査を回避（Efficiency）
let activeTab = document.querySelector('.filter-tab.active');

filterTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    if (tab === activeTab) return;           // 同じタブは処理不要
    activeTab?.classList.remove('active');
    tab.classList.add('active');
    activeTab = tab;

    const filter = tab.dataset.filter;
    workCards.forEach(card => {
      card.classList.toggle('hidden', filter !== 'all' && card.dataset.category !== filter);
    });
  });
});

/* ---- Smooth scroll for nav ---- */
// CSS scroll-behavior: smooth と併用。navbar オフセット補正のため JS 側も維持。
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
  rootMargin: '0px 0px -50px 0px'
});
fadeEls.forEach(el => observer.observe(el));
