/**
 * Portfolio Site - JavaScript
 * Handles smooth scrolling, accessibility, and user interactions
 */

// ===================================
// INTERSECTION OBSERVER - Scroll Animations
// ===================================

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe all sections for fade-in animation
document.querySelectorAll('section').forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(20px)';
    section.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
    observer.observe(section);
});

// ===================================
// SMOOTH SCROLL BEHAVIOR
// ===================================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ===================================
// NAVBAR SCROLL EFFECT
// ===================================

const navbar = document.querySelector('.navbar');
let lastScrollY = 0;

window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    
    if (scrollY > 50) {
        navbar.style.boxShadow = '0 4px 12px rgba(15, 23, 42, 0.1)';
    } else {
        navbar.style.boxShadow = '0 1px 3px rgba(15, 23, 42, 0.08)';
    }
    
    lastScrollY = scrollY;
}, { passive: true });

// ===================================
// ACTIVE NAVIGATION LINK
// ===================================

const navLinks = document.querySelectorAll('.nav-links a');
const sections = document.querySelectorAll('section[id]');

window.addEventListener('scroll', () => {
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (scrollY >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.style.color = '';
        if (link.getAttribute('href').includes(current) && current) {
            link.style.borderBottomColor = 'var(--color-accent)';
        }
    });
}, { passive: true });

// ===================================
// EXPERIENCE TIMELINE ANIMATION
// ===================================

const timelineItems = document.querySelectorAll('.experience-item');

const timelineObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animation = 'fadeInUp 0.6s ease-out forwards';
            timelineObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.1 });

timelineItems.forEach((item, index) => {
    item.style.opacity = '0';
    item.style.animationDelay = `${index * 0.1}s`;
    timelineObserver.observe(item);
});

// ===================================
// EMAIL LINK PROTECTION
// ===================================

document.querySelectorAll('a[href^="mailto:"]').forEach(link => {
    // Already safe in HTML, but we can add tracking if needed
    link.addEventListener('click', (e) => {
        // Analytics can be added here
    });
});

// ===================================
// EXTERNAL LINKS
// ===================================

document.querySelectorAll('a[target="_blank"]').forEach(link => {
    link.setAttribute('rel', 'noopener noreferrer');
});

// ===================================
// PERFORMANCE: Lazy Loading Images (if any)
// ===================================

if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.add('loaded');
                observer.unobserve(img);
            }
        });
    });

    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// ===================================
// ACCESSIBILITY: KEYBOARD NAVIGATION
// ===================================

document.addEventListener('keydown', (e) => {
    // Close any open dropdowns on Escape
    if (e.key === 'Escape') {
        // Add any open element closing logic here
    }
});

// ===================================
// UTILITY: Detect Reduced Motion Preference
// ===================================

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (prefersReducedMotion) {
    document.documentElement.style.setProperty('--transition-fast', '0ms');
    document.documentElement.style.setProperty('--transition-base', '0ms');
    document.documentElement.style.setProperty('--transition-slow', '0ms');
}

// ===================================
// MONITORING: Simple Performance Tracking
// ===================================

if (window.performance && window.performance.timing) {
    window.addEventListener('load', () => {
        const perfData = window.performance.timing;
        const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
        console.log('Page load time: ' + pageLoadTime + 'ms');
    });
}

// ===================================
// HERO — Knowledge Graph Background
// ===================================

(function () {
    const canvas = document.getElementById('kg-canvas');
    if (!canvas || prefersReducedMotion) return;
    const ctx = canvas.getContext('2d');
    let W, H, raf;

    const TAGS = [
        { label: 'AWS',                    cat: 'tech' },
        { label: 'Java',                   cat: 'tech' },
        { label: 'Microservices',          cat: 'tech' },
        { label: 'Spring Boot',            cat: 'tech' },
        { label: 'IoT',                    cat: 'tech' },
        { label: 'Cloud',                  cat: 'tech' },
        { label: 'CI/CD',                  cat: 'tech' },
        { label: 'Distributed Systems',    cat: 'tech' },
        { label: 'MBA',                    cat: 'biz'  },
        { label: 'Analytics',              cat: 'biz'  },
        { label: 'Leadership',             cat: 'biz'  },
        { label: 'SaaS',                   cat: 'biz'  },
        { label: 'Fraud Detection',        cat: 'biz'  },
        { label: 'Strategy',               cat: 'biz'  },
        { label: 'Payments',               cat: 'biz'  },
        { label: 'Risk Management',        cat: 'biz'  },
        { label: 'Agile',                  cat: 'biz'  },
        { label: 'Compliance',             cat: 'biz'  },
        { label: 'Mentoring',              cat: 'biz'  },
        { label: 'Digital Transformation', cat: 'biz'  },
        { label: 'Stakeholder',            cat: 'biz'  },
        { label: 'Banking',                cat: 'biz'  },
    ];

    const EDGES = [
        [0,2],[1,2],[2,5],[3,2],[4,0],[6,2],[7,2],
        [8,10],[9,10],[10,13],[11,8],[12,9],[13,16],
        [14,12],[15,16],[16,17],[18,10],[19,8],[20,13],[21,14],
        [0,11],[1,8],[5,19],[6,15],[7,21],
    ];

    let nodes = [];

    function initNodes() {
        nodes = TAGS.map((t, i) => ({
            ...t,
            x: 80 + Math.random() * (W - 160),
            y: 60 + Math.random() * (H - 120),
            vx: (Math.random() - 0.5) * 0.18,
            vy: (Math.random() - 0.5) * 0.18,
            phase: Math.random() * Math.PI * 2,
        }));
    }

    function resize() {
        W = canvas.offsetWidth;
        H = canvas.offsetHeight;
        canvas.width  = W * devicePixelRatio;
        canvas.height = H * devicePixelRatio;
        ctx.scale(devicePixelRatio, devicePixelRatio);
        initNodes();
    }

    let tick = 0;
    function draw() {
        ctx.clearRect(0, 0, W, H);
        tick++;

        // gentle drift
        nodes.forEach((n, i) => {
            n.x += n.vx + Math.sin(tick * 0.008 + n.phase) * 0.08;
            n.y += n.vy + Math.cos(tick * 0.007 + n.phase) * 0.08;
            if (n.x < 60)     { n.x = 60;     n.vx *= -1; }
            if (n.x > W - 60) { n.x = W - 60; n.vx *= -1; }
            if (n.y < 40)     { n.y = 40;     n.vy *= -1; }
            if (n.y > H - 40) { n.y = H - 40; n.vy *= -1; }
        });

        // edges
        EDGES.forEach(([a, b]) => {
            const na = nodes[a], nb = nodes[b];
            if (!na || !nb) return;
            const dist = Math.hypot(na.x - nb.x, na.y - nb.y);
            const alpha = Math.max(0, 0.14 - dist / 1800);
            ctx.beginPath();
            ctx.moveTo(na.x, na.y);
            ctx.lineTo(nb.x, nb.y);
            ctx.strokeStyle = `rgba(8,145,178,${alpha})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
        });

        // nodes + labels
        ctx.textAlign = 'center';
        nodes.forEach(n => {
            const isTech = n.cat === 'tech';
            const cr = isTech ? [8,145,178] : [15,23,42];

            // dot
            ctx.beginPath();
            ctx.arc(n.x, n.y, 3, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${cr.join(',')},0.5)`;
            ctx.fill();

            // label
            ctx.font = '500 11px system-ui, sans-serif';
            ctx.fillStyle = `rgba(${cr.join(',')},0.55)`;
            ctx.fillText(n.label, n.x, n.y - 9);
        });

        raf = requestAnimationFrame(draw);
    }

    function start() {
        resize();
        draw();
    }

    window.addEventListener('resize', () => {
        cancelAnimationFrame(raf);
        resize();
        draw();
    });

    document.addEventListener('visibilitychange', () => {
        if (document.hidden) { cancelAnimationFrame(raf); raf = null; }
        else if (!raf) draw();
    });

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
    else start();
})();

// ===================================
// PAGE BACKGROUND — Node Network
// ===================================

(function () {
    const canvas = document.getElementById('hero-canvas');
    if (!canvas || prefersReducedMotion) return;
    const ctx = canvas.getContext('2d');
    const ACCENT  = { r: 8,  g: 145, b: 178 };
    const PRIMARY = { r: 15, g: 23,  b: 42  };
    let nodes = [], raf, W, H;

    function resize() {
        W = canvas.offsetWidth;
        H = canvas.offsetHeight;
        canvas.width  = W * devicePixelRatio;
        canvas.height = H * devicePixelRatio;
        ctx.scale(devicePixelRatio, devicePixelRatio);
        initNodes();
    }

    function initNodes() {
        const count = Math.min(Math.floor((W * H) / 14000), 60);
        nodes = Array.from({ length: count }, () => ({
            x: Math.random() * W,
            y: Math.random() * H,
            vx: (Math.random() - 0.5) * 0.35,
            vy: (Math.random() - 0.5) * 0.35,
            r: Math.random() * 2 + 1.5,
            type: Math.random() > 0.6 ? 'accent' : 'primary',
        }));
    }

    const MAX_DIST_SQ = 160 * 160;

    function draw() {
        ctx.clearRect(0, 0, W, H);

        // grid
        ctx.strokeStyle = 'rgba(8,145,178,0.04)';
        ctx.lineWidth = 1;
        for (let x = 0; x < W; x += 60) { ctx.beginPath(); ctx.moveTo(x,0); ctx.lineTo(x,H); ctx.stroke(); }
        for (let y = 0; y < H; y += 60) { ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(W,y); ctx.stroke(); }

        for (const n of nodes) {
            n.x += n.vx; n.y += n.vy;
            if (n.x < -20) n.x = W + 20;
            if (n.x > W + 20) n.x = -20;
            if (n.y < -20) n.y = H + 20;
            if (n.y > H + 20) n.y = -20;
        }

        for (let i = 0; i < nodes.length; i++) {
            for (let j = i + 1; j < nodes.length; j++) {
                const a = nodes[i], b = nodes[j];
                const dx = a.x - b.x, dy = a.y - b.y;
                const dSq = dx*dx + dy*dy;
                if (dSq > MAX_DIST_SQ) continue;
                const t = 1 - dSq / MAX_DIST_SQ;
                ctx.beginPath();
                ctx.strokeStyle = `rgba(8,145,178,${t * 0.18})`;
                ctx.lineWidth = t * 1.2;
                ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y);
                ctx.stroke();
            }
        }

        for (const n of nodes) {
            const c = n.type === 'accent' ? ACCENT : PRIMARY;
            ctx.beginPath(); ctx.arc(n.x, n.y, n.r + 3, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${c.r},${c.g},${c.b},0.06)`; ctx.fill();
            ctx.beginPath(); ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${c.r},${c.g},${c.b},0.55)`; ctx.fill();
        }

        raf = requestAnimationFrame(draw);
    }

    function start() { resize(); draw(); }

    window.addEventListener('resize', () => { cancelAnimationFrame(raf); resize(); draw(); });
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) { cancelAnimationFrame(raf); raf = null; }
        else if (!raf) draw();
    });

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
    else start();
})();

// ===================================
// MOBILE NAV — Hamburger Toggle
// ===================================

(function () {
    const btn = document.querySelector('.nav-hamburger');
    const links = document.querySelector('.nav-links');
    if (!btn || !links) return;

    const BREAKPOINT = 640;

    function applyLayout() {
        if (window.innerWidth <= BREAKPOINT) {
            btn.style.display = 'flex';
            if (!links.classList.contains('open')) {
                links.style.display = 'none';
            }
        } else {
            btn.style.display = 'none';
            links.style.display = '';
            links.classList.remove('open');
            btn.classList.remove('open');
            btn.setAttribute('aria-expanded', 'false');
        }
    }

    btn.addEventListener('click', () => {
        const isOpen = links.classList.toggle('open');
        btn.classList.toggle('open', isOpen);
        btn.setAttribute('aria-expanded', isOpen);
        links.style.display = isOpen ? 'flex' : 'none';
    });

    links.querySelectorAll('a').forEach(a => {
        a.addEventListener('click', () => {
            links.classList.remove('open');
            btn.classList.remove('open');
            btn.setAttribute('aria-expanded', 'false');
            links.style.display = 'none';
        });
    });

    window.addEventListener('resize', applyLayout);
    applyLayout();
})();

// ===================================
// INITIALIZATION
// ===================================

console.log('Portfolio site loaded successfully - secure, self-hosted, no third-party dependencies.');
