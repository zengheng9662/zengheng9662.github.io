const menuBtn = document.querySelector('.menu-btn');
const nav = document.querySelector('.nav');

if (menuBtn && nav) {
  menuBtn.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    menuBtn.setAttribute('aria-expanded', String(open));
  });
  nav.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => nav.classList.remove('open')));
}

const revealEls = [...document.querySelectorAll('.reveal')];
if ('IntersectionObserver' in window) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08 });
  revealEls.forEach((el) => io.observe(el));
} else {
  revealEls.forEach((el) => el.classList.add('in'));
}

document.querySelectorAll('[data-year]').forEach((el) => {
  el.textContent = new Date().getFullYear();
});

const navLinks = [...document.querySelectorAll('.nav a[href^="#"]')];
const sections = navLinks.map((a) => document.querySelector(a.getAttribute('href'))).filter(Boolean);
if ('IntersectionObserver' in window) {
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        navLinks.forEach((a) => {
          a.classList.toggle('active', a.getAttribute('href') === `#${entry.target.id}`);
        });
      }
    });
  }, { rootMargin: '-35% 0px -55% 0px', threshold: 0 });
  sections.forEach((section) => sectionObserver.observe(section));
}

// Avatar: swap the entire pre-rendered portrait for a natural wink state.
const avatar = document.querySelector('.avatar-button');
const avatarImg = avatar?.querySelector('img');
let winkTimer;
if (avatar && avatarImg) {
  const normalSrc = avatarImg.dataset.normal || avatarImg.src;
  const winkSrc = avatarImg.dataset.wink;
  if (winkSrc) {
    const preload = new Image();
    preload.src = winkSrc;
    avatar.addEventListener('click', () => {
      clearTimeout(winkTimer);
      avatar.classList.add('is-winking');
      avatarImg.src = winkSrc;
      winkTimer = setTimeout(() => {
        avatarImg.src = normalSrc;
        avatar.classList.remove('is-winking');
      }, 560);
    });
  }
}

// Internship image carousels. These images never open in the detail lightbox.
document.querySelectorAll('[data-carousel]').forEach((carousel) => {
  const track = carousel.querySelector('.carousel-track');
  const slides = [...carousel.querySelectorAll('.carousel-slide')];
  const prev = carousel.querySelector('.carousel-prev');
  const next = carousel.querySelector('.carousel-next');
  const dotsWrap = carousel.querySelector('.carousel-dots');
  if (!track || slides.length < 2) {
    prev?.remove();
    next?.remove();
    dotsWrap?.remove();
    return;
  }

  let index = 0;
  const dots = slides.map((_, i) => {
    const dot = document.createElement('button');
    dot.type = 'button';
    dot.className = `carousel-dot${i === 0 ? ' active' : ''}`;
    dot.setAttribute('aria-label', `查看第 ${i + 1} 张图片`);
    dot.addEventListener('click', (event) => {
      event.preventDefault();
      event.stopPropagation();
      index = i;
      render();
    });
    dotsWrap?.appendChild(dot);
    return dot;
  });

  const render = () => {
    track.style.transform = `translateX(-${index * 100}%)`;
    dots.forEach((dot, i) => dot.classList.toggle('active', i === index));
  };
  const step = (delta) => {
    index = (index + delta + slides.length) % slides.length;
    render();
  };
  prev?.addEventListener('click', (event) => { event.preventDefault(); event.stopPropagation(); step(-1); });
  next?.addEventListener('click', (event) => { event.preventDefault(); event.stopPropagation(); step(1); });

  let touchX = null;
  carousel.addEventListener('touchstart', (event) => { touchX = event.touches[0]?.clientX ?? null; }, { passive: true });
  carousel.addEventListener('touchend', (event) => {
    if (touchX == null) return;
    const endX = event.changedTouches[0]?.clientX ?? touchX;
    const delta = endX - touchX;
    touchX = null;
    if (Math.abs(delta) > 45) step(delta > 0 ? -1 : 1);
  }, { passive: true });
});

const lightbox = document.getElementById('lightbox');
const lightboxImg = lightbox?.querySelector('img');
const lightboxCaption = lightbox?.querySelector('.lightbox-caption');

function closeLightbox() {
  if (!lightbox) return;
  lightbox.classList.remove('open');
  lightbox.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

// Detail-view quality guard: only reasonably high-resolution images can open in the lightbox.
// This prevents low-resolution source images from being enlarged into a visibly blurry detail view.
const MIN_DETAIL_WIDTH = 1200;
const MIN_DETAIL_HEIGHT = 800;

document.querySelectorAll('.detail-image').forEach((button) => {
  const img = button.querySelector('img');
  if (!img) return;

  const assessQuality = () => {
    const canOpen = img.naturalWidth >= MIN_DETAIL_WIDTH && img.naturalHeight >= MIN_DETAIL_HEIGHT;
    button.dataset.detailAllowed = String(canOpen);
    button.classList.toggle('preview-only', !canOpen);
    button.setAttribute('aria-label', canOpen ? `查看大图：${img.alt}` : `${img.alt}（预览图清晰度有限，不提供放大查看）`);
    if (!canOpen) button.title = '预览图清晰度有限，已关闭放大查看';
  };

  if (img.complete) assessQuality();
  else img.addEventListener('load', assessQuality, { once: true });

  button.addEventListener('click', () => {
    if (button.dataset.detailAllowed !== 'true') return;
    if (!lightbox || !lightboxImg || !lightboxCaption) return;
    lightboxImg.src = button.dataset.src || img.src || '';
    lightboxImg.alt = img.alt || '';
    lightboxCaption.textContent = button.dataset.caption || '';
    lightbox.classList.add('open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  });
});

lightbox?.querySelector('.lightbox-close')?.addEventListener('click', closeLightbox);
lightbox?.addEventListener('click', (event) => {
  if (event.target === lightbox) closeLightbox();
});
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') closeLightbox();
});
