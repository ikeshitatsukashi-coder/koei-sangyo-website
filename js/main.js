/* ============================================
   MAIN JS — 株式会社港栄産業
   ============================================ */
(function () {
  'use strict';

  /* ---- NAV: scroll shadow ---- */
  const nav = document.querySelector('nav');
  if (nav) {
    const tick = () => nav.classList.toggle('is-scrolled', window.scrollY > 50);
    window.addEventListener('scroll', tick, { passive: true });
    tick();
  }

  /* ---- MOBILE MENU ---- */
  const hamburger = document.getElementById('hamburger');
  const mob = document.getElementById('mobile-menu');
  if (hamburger && mob) {
    const overlay = document.createElement('div');
    overlay.className = 'mob-overlay';
    document.body.appendChild(overlay);

    const openMenu = () => {
      hamburger.classList.add('open');
      mob.classList.add('open');
      overlay.classList.add('show');
      document.body.style.overflow = 'hidden';
    };
    const closeMenu = () => {
      hamburger.classList.remove('open');
      mob.classList.remove('open');
      overlay.classList.remove('show');
      document.body.style.overflow = '';
    };

    hamburger.addEventListener('click', () =>
      mob.classList.contains('open') ? closeMenu() : openMenu()
    );
    overlay.addEventListener('click', closeMenu);
    mob.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
  }

  /* ---- SCROLL REVEAL ---- */
  const revealEls = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .hl-item');
  if (revealEls.length) {
    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver((entries) => {
        entries.forEach(e => {
          if (e.isIntersecting) {
            e.target.classList.add('in');
            io.unobserve(e.target);
          }
        });
      }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });
      revealEls.forEach(el => io.observe(el));
    } else {
      revealEls.forEach(el => el.classList.add('in'));
    }
  }

  /* ---- COUNTER ANIMATION ---- */
  const counters = document.querySelectorAll('[data-count]');
  if (counters.length && 'IntersectionObserver' in window) {
    const cio = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        const el = e.target;
        const target = +el.dataset.count;
        const duration = 1800;
        const start = performance.now();
        const run = (now) => {
          const p = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - p, 4);
          el.textContent = Math.floor(eased * target);
          if (p < 1) requestAnimationFrame(run);
        };
        requestAnimationFrame(run);
        cio.unobserve(el);
      });
    }, { threshold: 0.5 });
    counters.forEach(c => cio.observe(c));
  }

  /* ---- FAQ ACCORDION ---- */
  document.querySelectorAll('.faq-item').forEach(item => {
    item.querySelector('.faq-q')?.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      // Close all
      document.querySelectorAll('.faq-item.open').forEach(o => o.classList.remove('open'));
      // Toggle clicked
      if (!isOpen) item.classList.add('open');
    });
  });

  /* ---- SMOOTH SCROLL (anchor links) ---- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (!href || href === '#') return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const offset = nav ? nav.offsetHeight + 16 : 16;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  /* ---- CONTACT FORM VALIDATION ---- */
  const form = document.getElementById('contact-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      let valid = true;

      // Required fields
      form.querySelectorAll('.form-group[data-required]').forEach(group => {
        const field = group.querySelector('input, textarea, select');
        if (!field || !field.value.trim()) {
          group.classList.add('err');
          valid = false;
        } else {
          group.classList.remove('err');
        }
      });

      // Email format
      const emailField = form.querySelector('input[type="email"]');
      if (emailField && emailField.value.trim()) {
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailField.value)) {
          emailField.closest('.form-group').classList.add('err');
          valid = false;
        }
      }

      // Privacy checkbox
      const privacy = form.querySelector('#privacy');
      const privacyWrap = form.querySelector('.privacy-wrap');
      if (privacy && !privacy.checked) {
        privacyWrap?.classList.add('err');
        valid = false;
      } else {
        privacyWrap?.classList.remove('err');
      }

      if (valid) {
        form.style.display = 'none';
        const success = document.getElementById('form-success');
        if (success) success.style.display = 'block';
      }
    });

    // Live validation clear
    form.querySelectorAll('input, textarea, select').forEach(field => {
      field.addEventListener('input', () => {
        field.closest('.form-group')?.classList.remove('err');
      });
    });
    form.querySelector('#privacy')?.addEventListener('change', () => {
      form.querySelector('.privacy-wrap')?.classList.remove('err');
    });
  }

})();
