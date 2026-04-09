// =============================================
// KASHMIR LOOM TOURS — MAIN SCRIPT
// Bugs fixed:
//  - Review slider card width uses container px, not % 
//  - Mobile nav overlay wired up
//  - Counter triggers on hero-stats visibility
//  - Lightbox fully wired
//  - Body scroll-lock on lightbox
//  - aria-expanded on nav toggle
// =============================================

document.addEventListener('DOMContentLoaded', () => {

    // -----------------------------------------------
    // PRELOADER
    // -----------------------------------------------
    const preloader = document.getElementById('preloader');
    window.addEventListener('load', () => {
        setTimeout(() => {
            preloader.classList.add('loaded');
        }, 900);
    });

    // -----------------------------------------------
    // MOBILE NAVIGATION
    // -----------------------------------------------
    const navToggle = document.getElementById('nav-toggle');
    const navLinks  = document.getElementById('nav-links');
    const navOverlay = document.getElementById('nav-overlay');

    function openNav() {
        navToggle.classList.add('active');
        navLinks.classList.add('active');
        navOverlay.classList.add('active');
        navToggle.setAttribute('aria-expanded', 'true');
        document.body.style.overflow = 'hidden';
    }

    function closeNav() {
        navToggle.classList.remove('active');
        navLinks.classList.remove('active');
        navOverlay.classList.remove('active');
        navToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
    }

    navToggle.addEventListener('click', () => {
        if (navLinks.classList.contains('active')) {
            closeNav();
        } else {
            openNav();
        }
    });

    navOverlay.addEventListener('click', closeNav);

    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', closeNav);
    });

    // -----------------------------------------------
    // NAVBAR SCROLL EFFECT
    // -----------------------------------------------
    const navbar    = document.getElementById('navbar');
    const backToTop = document.getElementById('back-to-top');

    function onScroll() {
        const y = window.scrollY;

        navbar.classList.toggle('scrolled', y > 70);
        backToTop.classList.toggle('visible', y > 600);

        updateActiveNav();
        if (!counterDone) triggerCounters();
    }

    window.addEventListener('scroll', onScroll, { passive: true });

    // -----------------------------------------------
    // ACTIVE NAV LINK
    // -----------------------------------------------
    function updateActiveNav() {
        const sections  = document.querySelectorAll('section[id]');
        const scrollPos = window.scrollY + 130;

        sections.forEach(sec => {
            const top    = sec.offsetTop;
            const height = sec.offsetHeight;
            const id     = sec.getAttribute('id');

            if (scrollPos >= top && scrollPos < top + height) {
                document.querySelectorAll('.nav-link').forEach(link => {
                    const isActive = link.getAttribute('href') === `#${id}`;
                    link.classList.toggle('active', isActive);
                });
            }
        });
    }

    // -----------------------------------------------
    // COUNTER ANIMATION
    // -----------------------------------------------
    const statNumbers = document.querySelectorAll('.stat-number[data-target]');
    let counterDone   = false;

    function triggerCounters() {
        const statsEl = document.querySelector('.hero-stats');
        if (!statsEl) return;

        const rect = statsEl.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
            counterDone = true;
            statNumbers.forEach(el => {
                const target   = parseInt(el.getAttribute('data-target'), 10);
                const duration = 1800;
                const start    = performance.now();

                function tick(now) {
                    const elapsed  = now - start;
                    const progress = Math.min(elapsed / duration, 1);
                    const eased    = 1 - Math.pow(1 - progress, 3); // ease-out cubic
                    el.textContent = Math.floor(eased * target);
                    if (progress < 1) requestAnimationFrame(tick);
                    else el.textContent = target;
                }
                requestAnimationFrame(tick);
            });
        }
    }

    // Run on load in case hero is immediately visible
    triggerCounters();

    // -----------------------------------------------
    // SCROLL REVEAL
    // -----------------------------------------------
    const REVEAL_SELECTORS = [
        '.about-images', '.about-content',
        '.destination-card', '.package-card',
        '.gallery-item', '.review-card',
        '.contact-card', '.contact-form-wrapper',
        '.section-header', '.reviews-summary',
        '.map-container', '.cta-content',
        '.service-card',
    ];

    function addRevealClasses() {
        REVEAL_SELECTORS.forEach(sel => {
            document.querySelectorAll(sel).forEach((el, i) => {
                el.classList.add('reveal');
                if (i >= 1 && i <= 4) el.classList.add(`reveal-delay-${i}`);
            });
        });
    }

    function handleReveal() {
        document.querySelectorAll('.reveal:not(.revealed)').forEach(el => {
            if (el.getBoundingClientRect().top < window.innerHeight * 0.9) {
                el.classList.add('revealed');
            }
        });
    }

    addRevealClasses();
    window.addEventListener('scroll', handleReveal, { passive: true });
    handleReveal();

    // -----------------------------------------------
    // REVIEWS SLIDER
    // -----------------------------------------------
    const track      = document.getElementById('reviews-track');
    const btnPrev    = document.getElementById('review-prev');
    const btnNext    = document.getElementById('review-next');
    const dotsEl     = document.getElementById('review-dots');
    const slider     = document.getElementById('reviews-slider');
    const cards      = Array.from(document.querySelectorAll('.review-card'));

    let current   = 0;
    let perView   = 3;
    let total     = 0;
    let autoTimer = null;

    function calcLayout() {
        const w = window.innerWidth;
        perView = w <= 680 ? 1 : w <= 1024 ? 2 : 3;
        total   = Math.max(1, cards.length - perView + 1);

        // Set card widths precisely from container width
        const gap       = 22;
        const container = slider.offsetWidth;
        const cardW     = (container - gap * (perView - 1)) / perView;
        cards.forEach(c => {
            c.style.minWidth = cardW + 'px';
            c.style.maxWidth = cardW + 'px';
        });
    }

    function buildDots() {
        dotsEl.innerHTML = '';
        for (let i = 0; i < total; i++) {
            const dot = document.createElement('button');
            dot.classList.add('review-dot');
            dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
            if (i === 0) dot.classList.add('active');
            dot.addEventListener('click', () => goTo(i));
            dotsEl.appendChild(dot);
        }
    }

    function goTo(idx) {
        current = Math.max(0, Math.min(idx, total - 1));

        // Calculate offset: first card width + gap per step
        const cardW   = cards[0].offsetWidth;
        const gap     = 22;
        const offset  = current * (cardW + gap);
        track.style.transform = `translateX(-${offset}px)`;

        document.querySelectorAll('.review-dot').forEach((d, i) => {
            d.classList.toggle('active', i === current);
        });
    }

    function next()  { goTo(current >= total - 1 ? 0 : current + 1); }
    function prev()  { goTo(current <= 0 ? total - 1 : current - 1); }

    function startAuto() { stopAuto(); autoTimer = setInterval(next, 5000); }
    function stopAuto()  { clearInterval(autoTimer); }

    btnNext.addEventListener('click', () => { next(); stopAuto(); startAuto(); });
    btnPrev.addEventListener('click', () => { prev(); stopAuto(); startAuto(); });

    slider.addEventListener('mouseenter', stopAuto);
    slider.addEventListener('mouseleave', startAuto);

    // Touch swipe
    let touchX = 0;
    track.addEventListener('touchstart', e => {
        touchX = e.changedTouches[0].screenX;
        stopAuto();
    }, { passive: true });

    track.addEventListener('touchend', e => {
        const diff = touchX - e.changedTouches[0].screenX;
        if (Math.abs(diff) > 48) diff > 0 ? next() : prev();
        startAuto();
    }, { passive: true });

    // Init
    calcLayout();
    buildDots();
    goTo(0);
    startAuto();

    window.addEventListener('resize', () => {
        calcLayout();
        buildDots();
        goTo(Math.min(current, total - 1));
    });

    // -----------------------------------------------
    // GALLERY LIGHTBOX
    // -----------------------------------------------
    const lightbox      = document.getElementById('lightbox');
    const lightboxImg   = document.getElementById('lightbox-img');
    const lightboxClose = document.getElementById('lightbox-close');

    function openLightbox(src, alt) {
        lightboxImg.src = src;
        lightboxImg.alt = alt;
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
        lightboxClose.focus();
    }

    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
        lightboxImg.src = '';
    }

    document.querySelectorAll('.gallery-item').forEach(item => {
        item.addEventListener('click', () => {
            const img = item.querySelector('img');
            if (img) openLightbox(img.src, img.alt);
        });

        item.addEventListener('keydown', e => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                const img = item.querySelector('img');
                if (img) openLightbox(img.src, img.alt);
            }
        });

        item.setAttribute('tabindex', '0');
        item.setAttribute('role', 'button');
    });

    lightboxClose.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });
    document.addEventListener('keydown', e => {
        if (e.key === 'Escape') closeLightbox();
    });

    // -----------------------------------------------
    // CONTACT FORM → WHATSAPP
    // -----------------------------------------------
    const form     = document.getElementById('contact-form');
    const submitBtn = document.getElementById('form-submit');

    form.addEventListener('submit', e => {
        e.preventDefault();

        const name    = document.getElementById('form-name').value.trim();
        const email   = document.getElementById('form-email').value.trim();
        const phone   = document.getElementById('form-phone').value.trim();
        const pkg     = document.getElementById('form-package').value;
        const guests  = document.getElementById('form-guests').value;
        const message = document.getElementById('form-message').value.trim();

        let msg = `Hi Bilal Bhai! I'm interested in a Kashmir tour.\n\n`;
        msg += `*Name:* ${name}\n`;
        msg += `*Email:* ${email}\n`;
        msg += `*Phone:* ${phone}\n`;
        if (pkg)     msg += `*Package:* ${pkg}\n`;
        if (guests)  msg += `*Guests:* ${guests}\n`;
        if (message) msg += `*Message:* ${message}\n`;

        const waUrl = `https://wa.me/917889528922?text=${encodeURIComponent(msg)}`;

        // Visual feedback
        const origHTML = submitBtn.innerHTML;
        submitBtn.innerHTML = '<span>Opening WhatsApp…</span><i class="fas fa-check"></i>';
        submitBtn.disabled = true;

        window.open(waUrl, '_blank', 'noopener');

        setTimeout(() => {
            submitBtn.innerHTML = origHTML;
            submitBtn.disabled  = false;
            form.reset();
        }, 3000);
    });

    // -----------------------------------------------
    // HERO PARTICLES
    // -----------------------------------------------
    const particleContainer = document.getElementById('hero-particles');

    if (particleContainer) {
        const PARTICLE_CSS = `@keyframes pFloat {
            0%,100% { transform:translate(0,0) scale(1); opacity:.5; }
            33%      { transform:translate(18px,-28px) scale(1.15); opacity:.85; }
            66%      { transform:translate(-22px,-10px) scale(.8); opacity:.3; }
        }`;
        const styleTag = document.createElement('style');
        styleTag.textContent = PARTICLE_CSS;
        document.head.appendChild(styleTag);

        const frag = document.createDocumentFragment();
        for (let i = 0; i < 28; i++) {
            const p = document.createElement('div');
            const size  = Math.random() * 3.5 + 1;
            const dur   = (Math.random() * 8 + 6).toFixed(1);
            const delay = (Math.random() * 5).toFixed(1);
            p.style.cssText = `
                position:absolute;
                width:${size}px; height:${size}px;
                background:rgba(212,168,83,${(Math.random() * 0.28 + 0.08).toFixed(2)});
                border-radius:50%;
                left:${(Math.random() * 100).toFixed(1)}%;
                top:${(Math.random() * 100).toFixed(1)}%;
                animation:pFloat ${dur}s ease-in-out ${delay}s infinite;
                pointer-events:none;
            `;
            frag.appendChild(p);
        }
        particleContainer.appendChild(frag);
    }

    // -----------------------------------------------
    // SMOOTH SCROLL — anchor links
    // -----------------------------------------------
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', e => {
            const href = anchor.getAttribute('href');
            if (href === '#') return;
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

});
