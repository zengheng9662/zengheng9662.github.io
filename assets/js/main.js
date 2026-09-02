const menuBtn = document.querySelector('.menu-btn');
const nav = document.querySelector('.nav');

// V7 content pass: keep the homepage concise and let ABOUT ME start with facts, not another introduction.
const heroFields = document.querySelector('.hero-fields');
const heroCopy = document.querySelector('.hero-copy');
const aboutIntro = document.querySelector('.about-intro');
const aboutPanels = document.querySelector('.about-panels');

if (heroFields) {
  heroFields.innerHTML = 'Urban Planning<br/>Exhibition, Content &amp;<br/>Project Coordination';
}
if (heroCopy) {
  heroCopy.textContent = '城市规划背景，项目经历涉及城市研究、展陈与公共空间。擅长梳理信息、协调推进，也喜欢把内容转化成更直观的表达。';
}
aboutIntro?.remove();
if (aboutPanels) aboutPanels.style.marginTop = '0';

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

// Homepage avatar: the head remains fixed. On desktop, only two tightly masked eye regions
// make a small, eased movement toward the pointer. Click still switches to the wink image.
const avatar = document.querySelector('.avatar-button');
const avatarImg = avatar?.querySelector('img');
let winkTimer;

if (avatar && avatarImg) {
  const normalSrc = 'assets/images/v6/avatar-normal.png';
  const winkSrc = 'assets/images/v6/avatar-wink.png';

  const avatarStyle = document.createElement('style');
  avatarStyle.id = 'avatar-final-style';
  avatarStyle.textContent = `
    .avatar-button{
      overflow:visible!important;
      border:0!important;
      border-radius:50%!important;
      outline:none!important;
      background:#eee7ff!important;
      box-shadow:0 18px 46px rgba(98,65,211,.09)!important;
      isolation:isolate;
      --eye-x:0px;
      --eye-y:0px;
    }
    .avatar-button::after{display:none!important}
    .avatar-button:active{transform:none!important}
    .avatar-button:focus{outline:none!important}
    .avatar-button:focus-visible{
      outline:none!important;
      box-shadow:0 0 0 4px rgba(111,70,255,.10),0 18px 46px rgba(98,65,211,.09)!important;
    }
    .avatar-button .avatar-layer{
      position:absolute!important;
      inset:0!important;
      width:100%!important;
      height:100%!important;
      max-width:none!important;
      border:0!important;
      border-radius:50%!important;
      object-fit:cover!important;
      object-position:50% 50%!important;
      transform:none!important;
      pointer-events:none!important;
      transition:opacity .055s linear!important;
      will-change:opacity;
      image-rendering:auto!important;
    }
    .avatar-button .avatar-normal{z-index:1!important;opacity:1}
    .avatar-button .avatar-wink{z-index:4!important;opacity:0}
    .avatar-button.is-winking .avatar-normal{opacity:0!important}
    .avatar-button.is-winking .avatar-wink{opacity:1!important}
    .avatar-hi{
      position:absolute;
      z-index:7;
      right:-2.5%;
      top:10%;
      padding:7px 11px 8px;
      border:1px solid rgba(111,70,255,.18);
      border-radius:999px;
      background:rgba(255,255,255,.96);
      box-shadow:0 8px 24px rgba(79,53,155,.10);
      color:#5530d8;
      font-size:11px;
      font-weight:700;
      line-height:1;
      letter-spacing:.01em;
      white-space:nowrap;
      opacity:0;
      transform:translateY(4px) scale(.98);
      transition:opacity .18s ease,transform .18s ease;
      pointer-events:none;
    }
    .avatar-button:hover .avatar-hi,
    .avatar-button:focus-visible .avatar-hi{
      opacity:1;
      transform:translateY(0) scale(1);
    }
    .avatar-eye-window{
      position:absolute;
      z-index:3;
      width:7%;
      height:7%;
      overflow:hidden;
      border-radius:50%;
      pointer-events:none;
      opacity:1;
      transition:opacity .07s linear;
      backface-visibility:hidden;
    }
    .avatar-eye-window.eye-left{left:38.75%;top:42.65%}
    .avatar-eye-window.eye-right{left:57.15%;top:43.20%}
    .avatar-eye-sprite{
      position:absolute!important;
      width:1428.571%!important;
      height:1428.571%!important;
      max-width:none!important;
      border:0!important;
      border-radius:0!important;
      object-fit:fill!important;
      pointer-events:none!important;
      transform:translate3d(var(--eye-x),var(--eye-y),0)!important;
      transition:none!important;
      will-change:transform;
      image-rendering:auto!important;
    }
    .eye-left .avatar-eye-sprite{left:-553.57%!important;top:-609.29%!important}
    .eye-right .avatar-eye-sprite{left:-816.43%!important;top:-617.14%!important}
    .avatar-button.is-winking .avatar-eye-window{opacity:0!important}
    @media (hover:none),(pointer:coarse){
      .avatar-hi,.avatar-eye-window{display:none!important}
    }
    @media (prefers-reduced-motion:reduce){
      .avatar-hi{transition:none}
      .avatar-eye-window{display:none!important}
    }
  `;
  document.head.appendChild(avatarStyle);

  avatarImg.classList.add('avatar-layer', 'avatar-normal');
  avatarImg.src = normalSrc;
  avatarImg.removeAttribute('data-wink');
  avatarImg.removeAttribute('data-normal');
  avatarImg.decoding = 'async';

  const hi = document.createElement('span');
  hi.className = 'avatar-hi';
  hi.textContent = 'Hi!';
  hi.setAttribute('aria-hidden', 'true');
  avatar.appendChild(hi);

  if (winkSrc) {
    const winkImg = document.createElement('img');
    winkImg.className = 'avatar-layer avatar-wink';
    winkImg.src = winkSrc;
    winkImg.alt = '';
    winkImg.decoding = 'async';
    winkImg.setAttribute('aria-hidden', 'true');
    avatar.appendChild(winkImg);

    const preload = new Image();
    preload.src = winkSrc;
    if (preload.decode) preload.decode().catch(() => {});

    avatar.addEventListener('click', () => {
      clearTimeout(winkTimer);
      avatar.classList.add('is-winking');
      winkTimer = setTimeout(() => {
        avatar.classList.remove('is-winking');
      }, 460);
    });
  }

  const canTrackEyes = window.matchMedia?.('(hover: hover) and (pointer: fine)').matches
    && !window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

  if (canTrackEyes) {
    const eyeConfig = [
      ['eye-left', '左眼'],
      ['eye-right', '右眼'],
    ];

    eyeConfig.forEach(([className, label]) => {
      const windowEl = document.createElement('span');
      windowEl.className = `avatar-eye-window ${className}`;
      windowEl.setAttribute('aria-label', label);
      windowEl.setAttribute('aria-hidden', 'true');

      const sprite = document.createElement('img');
      sprite.className = 'avatar-eye-sprite';
      sprite.src = normalSrc;
      sprite.alt = '';
      sprite.decoding = 'async';
      sprite.setAttribute('aria-hidden', 'true');

      windowEl.appendChild(sprite);
      avatar.appendChild(windowEl);
    });

    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;
    let eyeRaf = 0;

    const renderEyes = () => {
      currentX += (targetX - currentX) * 0.14;
      currentY += (targetY - currentY) * 0.14;
      avatar.style.setProperty('--eye-x', `${currentX.toFixed(2)}px`);
      avatar.style.setProperty('--eye-y', `${currentY.toFixed(2)}px`);

      if (Math.abs(targetX - currentX) > 0.03 || Math.abs(targetY - currentY) > 0.03) {
        eyeRaf = requestAnimationFrame(renderEyes);
      } else {
        currentX = targetX;
        currentY = targetY;
        avatar.style.setProperty('--eye-x', `${currentX.toFixed(2)}px`);
        avatar.style.setProperty('--eye-y', `${currentY.toFixed(2)}px`);
        eyeRaf = 0;
      }
    };

    const wakeEyes = () => {
      if (!eyeRaf) eyeRaf = requestAnimationFrame(renderEyes);
    };

    const resetEyes = () => {
      targetX = 0;
      targetY = 0;
      wakeEyes();
    };

    window.addEventListener('pointermove', (event) => {
      const rect = avatar.getBoundingClientRect();
      if (rect.bottom < 0 || rect.top > window.innerHeight) return;

      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const dx = event.clientX - centerX;
      const dy = event.clientY - centerY;
      const distance = Math.hypot(dx, dy) || 1;
      const strength = Math.min(distance / (rect.width * 1.15), 1);
      const maxX = Math.min(4, rect.width * 0.011);
      const maxY = Math.min(2.8, rect.width * 0.0075);

      targetX = (dx / distance) * maxX * strength;
      targetY = (dy / distance) * maxY * strength;
      wakeEyes();
    }, { passive: true });

    document.documentElement.addEventListener('mouseleave', resetEyes);
    window.addEventListener('blur', resetEyes);
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
