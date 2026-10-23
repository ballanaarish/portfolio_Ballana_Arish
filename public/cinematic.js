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
        if (window.innerWidth > 1024) close();
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

// --- Star-dust background (WebGL shader: dense fine animated dust over the
//     indigo base + glows, cleared through the centre for legibility) ---
(function () {
    const canvas = document.getElementById('star-canvas');
    if (!canvas) return;

    const gl = canvas.getContext('webgl', { alpha: true, premultipliedAlpha: false, antialias: false });
    if (!gl) return;  // graceful fallback: the CSS indigo + glows still show

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let raf = null;

    const VERT = 'attribute vec2 p; void main(){ gl_Position = vec4(p,0.0,1.0); }';
    const FRAG = [
        'precision highp float;',
        'uniform vec2 iResolution;',
        'uniform float iTime;',
        'float hash21(vec2 p){ p = fract(p*vec2(123.34,345.45)); p += dot(p,p+34.345); return fract(p.x*p.y); }',
        'float layer(vec2 uv, float scale, float seed, float thresh, float minSize, float maxSize, float t){',
        '  vec2 gv = uv*scale; gv.y -= t*0.5;',
        '  vec2 id = floor(gv); vec2 f = fract(gv); float a = 0.0;',
        '  for(int j=-1;j<=1;j++) for(int i=-1;i<=1;i++){',
        '    vec2 off = vec2(float(i),float(j)); vec2 cell = id + off;',
        '    float h = hash21(cell + seed);',
        '    if(h < thresh) continue;',
        '    vec2 pos = vec2(hash21(cell+seed+1.3), hash21(cell+seed+2.7));',
        '    float bright = mix(0.10, 1.0, hash21(cell+seed+5.1));',
        '    float size = mix(minSize, maxSize, hash21(cell+seed+7.9));',
        '    float tw = 0.5 + 0.5*sin(iTime*(0.35+bright*1.1) + h*6.2831);',
        '    float d = length(f - (pos + off));',
        '    a += smoothstep(size, size*0.15, d) * bright * tw;',
        '  }',
        '  return a;',
        '}',
        'void main(){',
        '  vec2 uv = gl_FragCoord.xy / iResolution.xy;',
        '  float aspect = iResolution.x / iResolution.y;',
        '  vec2 suv = vec2(uv.x*aspect, uv.y);',
        '  float a = 0.0;',
        '  a += layer(suv, 40.0,  0.0, 0.34, 0.045, 0.090, iTime);',
        '  a += layer(suv, 60.0, 19.0, 0.44, 0.035, 0.065, iTime)*0.85;',
        '  a += layer(suv, 26.0, 71.0, 0.68, 0.055, 0.120, iTime)*0.8;',
        '  float dy = abs(uv.y - 0.5);',
        '  float vmask = 0.45 + 0.55*smoothstep(0.06, 0.5, dy);',
        '  a = clamp(a, 0.0, 1.0) * vmask;',
        '  gl_FragColor = vec4(vec3(1.0), a);',
        '}'
    ].join('\n');

    function compile(type, src) {
        const s = gl.createShader(type);
        gl.shaderSource(s, src);
        gl.compileShader(s);
        if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) { console.error(gl.getShaderInfoLog(s)); return null; }
        return s;
    }
    const vs = compile(gl.VERTEX_SHADER, VERT);
    const fs = compile(gl.FRAGMENT_SHADER, FRAG);
    if (!vs || !fs) return;
    const prog = gl.createProgram();
    gl.attachShader(prog, vs); gl.attachShader(prog, fs); gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) { console.error(gl.getProgramInfoLog(prog)); return; }
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const locp = gl.getAttribLocation(prog, 'p');
    gl.enableVertexAttribArray(locp);
    gl.vertexAttribPointer(locp, 2, gl.FLOAT, false, 0, 0);
    const uRes = gl.getUniformLocation(prog, 'iResolution');
    const uTime = gl.getUniformLocation(prog, 'iTime');
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    function resize() {
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        canvas.width = Math.floor(canvas.clientWidth * dpr);
        canvas.height = Math.floor(canvas.clientHeight * dpr);
        gl.viewport(0, 0, canvas.width, canvas.height);
    }

    const t0 = performance.now();
    function render(time) {
        gl.uniform2f(uRes, canvas.width, canvas.height);
        gl.uniform1f(uTime, time);
        gl.drawArrays(gl.TRIANGLES, 0, 3);
    }
    function loop() {
        render((performance.now() - t0) / 1000);
        raf = requestAnimationFrame(loop);
    }
    function start() {
        resize();
        if (prefersReduced) render(0);
        else loop();
    }

    window.addEventListener('resize', () => {
        cancelAnimationFrame(raf); raf = null;
        resize();
        if (prefersReduced) render(0);
        else loop();
    });

    document.addEventListener('visibilitychange', () => {
        if (document.hidden) { cancelAnimationFrame(raf); raf = null; }
        else if (!raf && !prefersReduced) loop();
    });

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', start);
    } else {
        start();
    }
})();
