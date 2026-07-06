/**
 * Cinematic site — starfield background + mobile nav toggle.
 * External file (server CSP blocks inline <script>). Cache-busted via ?v=N.
 */

// --- Mobile nav (hamburger) ---
(function () {
    const burger = document.querySelector('.cine-burger');
    const menu = document.querySelector('.cine-menu');
    if (!burger || !menu) return;

    function close() {
        menu.classList.remove('open');
        burger.classList.remove('open');
        burger.setAttribute('aria-expanded', 'false');
    }

    burger.addEventListener('click', function () {
        const open = menu.classList.toggle('open');
        burger.classList.toggle('open', open);
        burger.setAttribute('aria-expanded', open);
    });
    menu.querySelectorAll('a').forEach(function (a) {
        a.addEventListener('click', close);
    });
    window.addEventListener('resize', function () {
        if (window.innerWidth > 860) close();
    });
})();

// --- Avatar: fade the video in only when it can actually play ---
// The photo sits underneath as the default/fallback; the video starts hidden
// and cross-fades in once ready, so it never flashes photo -> avatar frame.
(function () {
    var v = document.querySelector('.avatar-video');
    if (!v) return;
    var revealed = false;
    function reveal() {
        if (revealed) return;
        revealed = true;
        v.classList.add('is-ready');
    }
    // readyState >= 3 (HAVE_FUTURE_DATA) means a frame is ready to show.
    if (v.readyState >= 3) reveal();
    v.addEventListener('playing', reveal);
    v.addEventListener('canplay', reveal);
})();

// --- Recognition lightbox ---
(function () {
    var lb = document.getElementById('cine-lightbox');
    if (!lb) return;
    var img = lb.querySelector('.cine-lightbox-img');
    var cap = lb.querySelector('.cine-lightbox-cap');

    function open(src, caption) {
        img.src = src;
        cap.textContent = caption || '';
        lb.classList.add('open');
        lb.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    }
    function close() {
        lb.classList.remove('open');
        lb.setAttribute('aria-hidden', 'true');
        img.src = '';
        document.body.style.overflow = '';
    }

    document.querySelectorAll('.cine-rec-view').forEach(function (btn) {
        btn.addEventListener('click', function () {
            open(btn.getAttribute('data-img'), btn.getAttribute('data-caption'));
        });
    });
    lb.addEventListener('click', function (e) {
        if (e.target === lb || e.target.classList.contains('cine-lightbox-close')) close();
    });
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && lb.classList.contains('open')) close();
    });
})();

// --- Starfield background ---
(function () {
    const canvas = document.getElementById('star-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let W, H, stars = [], raf = null;

    function resize() {
        W = canvas.offsetWidth;
        H = canvas.offsetHeight;
        canvas.width = W * devicePixelRatio;
        canvas.height = H * devicePixelRatio;
        ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
        initStars();
    }

    function initStars() {
        const count = Math.min(Math.floor((W * H) / 6500), 260);
        stars = Array.from({ length: count }, () => ({
            x: Math.random() * W,
            y: Math.random() * H,
            r: Math.random() * 1.4 + 0.3,
            a: Math.random() * 0.5 + 0.2,
            tw: Math.random() * Math.PI * 2,
            tws: Math.random() * 0.02 + 0.004,
            vx: (Math.random() - 0.5) * 0.04,
            vy: (Math.random() - 0.5) * 0.04,
            warm: Math.random() > 0.85,
        }));
    }

    function paintStar(s, alpha) {
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = s.warm
            ? `rgba(255,214,170,${alpha})`
            : `rgba(255,255,255,${alpha})`;
        ctx.fill();
    }

    function draw() {
        ctx.clearRect(0, 0, W, H);
        for (const s of stars) {
            s.tw += s.tws;
            s.x += s.vx;
            s.y += s.vy;
            if (s.x < 0) s.x = W;
            if (s.x > W) s.x = 0;
            if (s.y < 0) s.y = H;
            if (s.y > H) s.y = 0;
            paintStar(s, Math.max(0, s.a + Math.sin(s.tw) * 0.18));
        }
        raf = requestAnimationFrame(draw);
    }

    function drawStatic() {
        ctx.clearRect(0, 0, W, H);
        for (const s of stars) paintStar(s, s.a);
    }

    function start() {
        resize();
        if (prefersReduced) drawStatic();
        else draw();
    }

    window.addEventListener('resize', () => {
        cancelAnimationFrame(raf);
        resize();
        if (prefersReduced) drawStatic();
        else draw();
    });

    document.addEventListener('visibilitychange', () => {
        if (document.hidden) { cancelAnimationFrame(raf); raf = null; }
        else if (!raf && !prefersReduced) draw();
    });

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', start);
    } else {
        start();
    }
})();
