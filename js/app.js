document.addEventListener('DOMContentLoaded', () => {

    // --- Snow Logic (Moved to Top to Fix ReferenceError) ---
    let snowInterval;
    const snowContainer = document.getElementById('snowContainer');

    function createSnowflake() {
        if (!snowContainer) return;
        const flake = document.createElement('div');
        flake.classList.add('snowflake');
        flake.innerHTML = '❄'; // Ice/Snow character

        // Randomize - Gentle Version
        const size = Math.random() * 5 + 8 + 'px'; // 8px - 13px (Smaller)
        const left = Math.random() * 100 + 'vw';
        const duration = Math.random() * 5 + 3 + 's'; // 3s - 8s (Slower)
        const opacity = Math.random() * 0.5 + 0.1; // 0.1 - 0.6 (More transparent)

        flake.style.left = left;
        flake.style.fontSize = size;
        flake.style.opacity = opacity;
        flake.style.animationDuration = duration;

        snowContainer.appendChild(flake);

        // Remove after animation
        setTimeout(() => {
            flake.remove();
        }, parseFloat(duration) * 1000);
    }

    function startSnow() {
        if (snowInterval) clearInterval(snowInterval);
        snowInterval = setInterval(createSnowflake, 400); // New flake every 400ms (Much lighter)
    }

    function stopSnow() {
        if (snowInterval) clearInterval(snowInterval);
        if (snowContainer) snowContainer.innerHTML = '';
    }

    // --- Navigation & Menu ---
    const menuToggle = document.getElementById('menuToggle');
    const navLinks = document.querySelector('.nav-links');

    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('active');
            navLinks.classList.toggle('active');
        });
    }

    // --- Smooth Scroll (Fixed Selector Error) ---
    const links = document.querySelectorAll('a[href^="#"]');

    links.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');

            // Fix: Check if targetId is valid and not just '#'
            if (targetId && targetId !== '#' && targetId.length > 1) {
                const targetelement = document.querySelector(targetId);

                if (targetelement) {
                    targetelement.scrollIntoView({
                        behavior: 'smooth'
                    });
                    if (navLinks.classList.contains('active')) {
                        menuToggle.classList.remove('active');
                        navLinks.classList.remove('active');
                    }
                }
            }
        });
    });

    // --- Intersection Observer for Animations ---
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const animatedElements = document.querySelectorAll('.animate-on-scroll, .glass-card, .section-title, .project-row');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(40px)';
        el.style.transition = 'opacity 1.2s cubic-bezier(0.23, 1, 0.32, 1), transform 1.2s cubic-bezier(0.23, 1, 0.32, 1)';
        el.style.willChange = 'opacity, transform';
        observer.observe(el);
    });

    const style = document.createElement('style');
    style.innerHTML = `
        .visible {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
    `;
    document.head.appendChild(style);

    // --- Advanced Interactives ---

    // 1. Spotlight / Torch Effect
    const heroSection = document.querySelector('.hero');
    if (heroSection) {
        heroSection.addEventListener('mousemove', (e) => {
            const rect = heroSection.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            heroSection.style.setProperty('--mouse-x', `${x}px`);
            heroSection.style.setProperty('--mouse-y', `${y}px`);
        });
    }

    // 2. 3D Tilt Effect for Bento Cards
    const cards = document.querySelectorAll('.bento-card');
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = ((y - centerY) / centerY) * -5; // Max 5deg rotation
            const rotateY = ((x - centerX) / centerX) * 5;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
        });
    });

    // 3. Scroll Spy (Active Nav Link)
    const sections = document.querySelectorAll('section');
    const navItems = document.querySelectorAll('.nav-link');

    const spyObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                // Remove active from all
                navItems.forEach(link => link.classList.remove('active'));
                // Add active to current
                const activeLink = document.querySelector(`.nav-link[href="#${id}"]`);
                if (activeLink) {
                    activeLink.classList.add('active');
                }
            }
        });
    }, { threshold: 0.5 }); // 50% visible

    sections.forEach(section => spyObserver.observe(section));

    // 4. Back to Top Button
    const scrollTopBtn = document.getElementById('scrollTop');

    if (scrollTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 500) {
                scrollTopBtn.classList.add('visible');
            } else {
                scrollTopBtn.classList.remove('visible');
            }
        });

        scrollTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
    const themeBtn = document.getElementById('themeToggle');
    const html = document.documentElement;

    function setTheme(theme) {
        html.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);

        // Update Icon safely
        if (themeBtn) {
            const icon = themeBtn.querySelector('i');
            if (icon) {
                if (theme === 'dark') {
                    icon.className = 'fas fa-moon';
                    stopSnow();
                } else if (theme === 'light') {
                    icon.className = 'fas fa-sun';
                    stopSnow();
                } else if (theme === 'christmas') {
                    icon.className = 'fas fa-snowflake';
                    startSnow();
                }
            }
        } else {
            // Fallback if button missing
            if (theme === 'christmas') startSnow();
            else stopSnow();
        }
    }

    // Check saved
    const savedTheme = localStorage.getItem('theme') || 'dark';
    setTheme(savedTheme);

    if (themeBtn) {
        themeBtn.addEventListener('click', () => {
            const current = html.getAttribute('data-theme') || 'dark';
            let next = 'light';
            if (current === 'light') next = 'christmas';
            else if (current === 'christmas') next = 'dark';

            setTheme(next);
        });
    }
});
