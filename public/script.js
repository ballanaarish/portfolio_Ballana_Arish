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
// INITIALIZATION
// ===================================

console.log('Portfolio site loaded successfully - secure, self-hosted, no third-party dependencies.');
