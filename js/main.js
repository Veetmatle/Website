/* ============================================
   PORTFOLIO - MAIN JAVASCRIPT
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        document.body.classList.add('page-loaded');
    }, 100);

    initNavbar();
    initMobileMenu();
    initProjectsScroll();
    initSmoothScroll();
});

/* ============================================
   NAVBAR
   ============================================ */
function initNavbar() {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;

    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        if (currentScroll > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        updateActiveNavLink();

        lastScroll = currentScroll;
    });
}

function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id], footer[id]');
    const navLinks = document.querySelectorAll('.nav-links a:not(.nav-cta)');

    let current = '';
    const isAtBottom = (window.innerHeight + window.pageYOffset) >= document.body.offsetHeight - 100;

    if (isAtBottom) {
        const lastSection = sections[sections.length - 1];
        if (lastSection) {
            current = lastSection.getAttribute('id');
        }
    } else {
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;

            if (window.pageYOffset >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });
    }

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
}

/* ============================================
   MOBILE MENU
   ============================================ */
function initMobileMenu() {
    const menuBtn = document.querySelector('.mobile-menu-btn');
    const mobileNav = document.querySelector('.mobile-nav');

    if (!menuBtn || !mobileNav) return;

    menuBtn.addEventListener('click', () => {
        mobileNav.classList.toggle('active');
        menuBtn.classList.toggle('active');
    });

    const mobileLinks = mobileNav.querySelectorAll('a');
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileNav.classList.remove('active');
            menuBtn.classList.remove('active');
        });
    });

    document.addEventListener('click', (e) => {
        if (!menuBtn.contains(e.target) && !mobileNav.contains(e.target)) {
            mobileNav.classList.remove('active');
            menuBtn.classList.remove('active');
        }
    });
}

/* ============================================
   PROJECTS HORIZONTAL SCROLL
   ============================================ */
function initProjectsScroll() {
    const container = document.querySelector('.projects-grid');
    const prevBtn = document.querySelector('.projects-nav-btn.prev');
    const nextBtn = document.querySelector('.projects-nav-btn.next');

    if (!container) return;

    const scrollAmount = 400;

    function updateButtons() {
        if (!prevBtn || !nextBtn) return;
        
        const maxScroll = container.scrollWidth - container.clientWidth;
        
        prevBtn.disabled = container.scrollLeft <= 0;
        nextBtn.disabled = container.scrollLeft >= maxScroll - 10;
    }

    if (prevBtn && nextBtn) {
        prevBtn.addEventListener('click', () => {
            container.scrollBy({
                left: -scrollAmount,
                behavior: 'smooth'
            });
        });

        nextBtn.addEventListener('click', () => {
            container.scrollBy({
                left: scrollAmount,
                behavior: 'smooth'
            });
        });

        container.addEventListener('scroll', updateButtons);
        updateButtons();
        window.addEventListener('resize', updateButtons);
    }

    // Touch events for mobile swipe
    let touchStartX = 0;
    let touchEndX = 0;
    let scrollStartLeft = 0;
    
    container.addEventListener('touchstart', (e) => {
        touchStartX = e.touches[0].clientX;
        scrollStartLeft = container.scrollLeft;
    }, { passive: true });
    
    container.addEventListener('touchmove', (e) => {
        if (!touchStartX) return;
        
        const touchCurrentX = e.touches[0].clientX;
        const diff = touchStartX - touchCurrentX;
        container.scrollLeft = scrollStartLeft + diff;
    }, { passive: true });
    
    container.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].clientX;
        touchStartX = 0;
    }, { passive: true });

    // Desktop mouse drag
    let isDown = false;
    let startX;
    let scrollLeft;

    container.addEventListener('mousedown', (e) => {
        isDown = true;
        container.style.cursor = 'grabbing';
        startX = e.pageX - container.offsetLeft;
        scrollLeft = container.scrollLeft;
    });

    container.addEventListener('mouseleave', () => {
        isDown = false;
        container.style.cursor = 'grab';
    });

    container.addEventListener('mouseup', () => {
        isDown = false;
        container.style.cursor = 'grab';
    });

    container.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - container.offsetLeft;
        const walk = (x - startX) * 2;
        container.scrollLeft = scrollLeft - walk;
    });

    container.style.cursor = 'grab';
}

/* ============================================
   SMOOTH SCROLL FOR ANCHOR LINKS
   ============================================ */
function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');

    links.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            
            if (href === '#') return;

            const target = document.querySelector(href);
            
            if (target) {
                e.preventDefault();
                
                const offsetTop = target.offsetTop - 80; 

                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });

                setTimeout(() => {
                    updateActiveNavLink();
                }, 500);
            }
        });
    });
}

/* ============================================
   INTERSECTION OBSERVER FOR ANIMATIONS
   ============================================ */
function initScrollAnimations() {
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    animatedElements.forEach(el => observer.observe(el));
}

/* ============================================
   UTILITY FUNCTIONS
   ============================================ */

function debounce(func, wait = 10, immediate = true) {
    let timeout;
    return function() {
        const context = this, args = arguments;
        const later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
}

function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}