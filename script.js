/* ============================================================
   SCRIPT.JS | Soumaan Ahmad Portfolio
   ============================================================ */

'use strict';

/* --- DOM References --- */
const navbar       = document.getElementById('navbar');
const hamburger    = document.getElementById('hamburger');
const mobileMenu   = document.getElementById('mobileMenu');
const modal        = document.getElementById('videoModal');
const modalClose   = document.getElementById('modalCloseBtn');
const modalHeading = document.getElementById('modalHeading');
const modalDesc    = document.getElementById('modalDescription');
const modalVideo   = document.getElementById('modalVideoArea');
const contactForm  = document.getElementById('contactForm');
const footerYear   = document.getElementById('footerYear');

/* ============================================================
   UTILITIES
   ============================================================ */

/** Build a responsive YouTube or Vimeo iframe string */
function buildEmbedHTML(platform, videoId, title) {
    const safeTitle = title.replace(/"/g, '&quot;');
    let src = '';

    if (platform === 'vimeo') {
        src = `https://player.vimeo.com/video/${videoId}?autoplay=1&title=0&byline=0&portrait=0&dnt=1&color=8b5cf6`;
    } else {
        // Default: YouTube
        src = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1&color=white`;
    }

    return `<div class="vid-responsive">
        <iframe
            src="${src}"
            title="${safeTitle}"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowfullscreen>
        </iframe>
    </div>`;
}

/* ============================================================
   NAVBAR
   ============================================================ */

/* Scroll effect — add glass blur once user scrolls */
window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
}, { passive: true });

/* Active nav link on scroll */
const sectionEls  = document.querySelectorAll('section[id]');
const navLinkEls  = document.querySelectorAll('.nav-links a');

const sectionObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const id = entry.target.id;
            navLinkEls.forEach(a => {
                a.classList.toggle('active-link', a.getAttribute('href') === `#${id}`);
            });
        }
    });
}, { threshold: 0.45 });

sectionEls.forEach(s => sectionObserver.observe(s));

/* ============================================================
   MOBILE MENU
   ============================================================ */

hamburger.addEventListener('click', () => {
    const isOpen = mobileMenu.classList.toggle('is-open');
    hamburger.classList.toggle('is-open', isOpen);
    hamburger.setAttribute('aria-expanded', isOpen);
    mobileMenu.setAttribute('aria-hidden', !isOpen);
});

mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        mobileMenu.classList.remove('is-open');
        hamburger.classList.remove('is-open');
        hamburger.setAttribute('aria-expanded', 'false');
        mobileMenu.setAttribute('aria-hidden', 'true');
    });
});

/* ============================================================
   SMOOTH SCROLL (all internal anchor links)
   ============================================================ */

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href   = this.getAttribute('href');
        const target = document.querySelector(href);
        if (!target) return;
        e.preventDefault();
        const offset = navbar.offsetHeight + 12;
        const top    = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
    });
});

/* ============================================================
   SCROLL REVEAL ANIMATION
   ============================================================ */

const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (!entry.isIntersecting) return;

        /* Stagger siblings for a cascade effect */
        const siblings = [...entry.target.parentElement.querySelectorAll('.reveal')];
        const idx      = siblings.indexOf(entry.target);
        entry.target.style.transitionDelay = `${Math.min(idx * 0.09, 0.45)}s`;

        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
    });
}, { threshold: 0.1, rootMargin: '0px 0px -36px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* ============================================================
   ANIMATED COUNTERS
   ============================================================ */

const counterObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el     = entry.target;
        const target = parseInt(el.getAttribute('data-target'), 10);
        const dur    = 1600;
        const step   = target / (dur / 16);
        let current  = 0;

        const tick = () => {
            current += step;
            if (current < target) {
                el.textContent = Math.floor(current);
                requestAnimationFrame(tick);
            } else {
                el.textContent = target;
            }
        };
        requestAnimationFrame(tick);
        counterObserver.unobserve(el);
    });
}, { threshold: 0.6 });

document.querySelectorAll('.counter').forEach(c => counterObserver.observe(c));

/* ============================================================
   SKILL BARS
   ============================================================ */

const skillBarObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const fill = entry.target;
        const w    = fill.getAttribute('data-width');
        setTimeout(() => { fill.style.width = `${w}%`; }, 200);
        skillBarObserver.unobserve(fill);
    });
}, { threshold: 0.4 });

document.querySelectorAll('.skill-fill').forEach(f => skillBarObserver.observe(f));

/* ============================================================
   HERO FACADE VIDEO (Showreel)
   ============================================================ */

document.querySelectorAll('.yt-facade').forEach(facade => {
    const activate = () => {
        const videoId = facade.getAttribute('data-video-id');
        const title   = facade.getAttribute('aria-label') || 'Video';
        if (!videoId || videoId === 'YOUR_SHOWREEL_VIDEO_ID') return;

        const src = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1&color=white`;
        const iframe = document.createElement('iframe');
        iframe.src           = src;
        iframe.title         = title;
        iframe.frameBorder   = '0';
        iframe.allow         = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
        iframe.allowFullscreen = true;
        iframe.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;border:none;border-radius:inherit;';

        facade.innerHTML = '';
        facade.appendChild(iframe);
        facade.style.cursor = 'default';
    };

    facade.addEventListener('click', activate);
    facade.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') activate(); });
});

/* ============================================================
   PROJECT FILTER
   ============================================================ */

const filterBtns   = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.getAttribute('data-filter');

        projectCards.forEach(card => {
            const cat    = card.getAttribute('data-category');
            const show   = filter === 'all' || cat === filter;

            card.classList.toggle('is-hidden', !show);

            if (show) {
                /* Trigger re-entrance animation */
                card.style.animation = 'none';
                void card.offsetWidth;
                card.style.animation = '';
            }
        });
    });
});

/* ============================================================
   VIDEO MODAL
   ============================================================ */

function openModal(videoId, platform, title, desc) {
    modalHeading.textContent  = title;
    modalDesc.textContent     = desc;
    modalVideo.innerHTML      = buildEmbedHTML(platform, videoId, title);

    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    modalClose.focus();
}

function closeModal() {
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';

    /* Delay clearing iframe to allow fade-out animation */
    setTimeout(() => { modalVideo.innerHTML = ''; }, 350);
}

/* Open modal when a project card is clicked */
projectCards.forEach(card => {
    card.addEventListener('click', () => {
        const videoId  = card.getAttribute('data-video-id');
        const platform = card.getAttribute('data-platform') || 'youtube';
        const title    = card.getAttribute('data-title');
        const desc     = card.getAttribute('data-desc');
        openModal(videoId, platform, title, desc);
    });
    /* Keyboard accessibility */
    card.setAttribute('tabindex', '0');
    card.setAttribute('role', 'button');
    card.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            card.click();
        }
    });
});

/* Close modal via button */
modalClose.addEventListener('click', closeModal);

/* Close modal when clicking the dark backdrop */
modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });

/* Close modal with Escape key */
document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && modal.classList.contains('is-open')) closeModal();
});

/* ============================================================
   CONTACT FORM (mailto fallback)
   ============================================================ */

if (contactForm) {
    contactForm.addEventListener('submit', e => {
        e.preventDefault();

        const name    = document.getElementById('fname').value.trim();
        const email   = document.getElementById('femail').value.trim();
        const service = document.getElementById('fservice').value;
        const message = document.getElementById('fmessage').value.trim();

        /* Basic client-side validation */
        if (!name || !email || !service || !message) {
            alert('Please fill in all fields before sending.');
            return;
        }

        const subject = encodeURIComponent(`[Portfolio Enquiry] ${service} — ${name}`);
        const body    = encodeURIComponent(
            `Name: ${name}\nEmail: ${email}\nService: ${service}\n\n---\n\n${message}`
        );

        /* Replace with your actual email address */
        window.location.href = `ahmadsoumaan6@gmail.com?subject=${subject}&body=${body}`;
    });
}

/* ============================================================
   FOOTER YEAR (auto-updates)
   ============================================================ */

if (footerYear) {
    footerYear.textContent = new Date().getFullYear();
}
