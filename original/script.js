document.addEventListener('DOMContentLoaded', function() {
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('nav-menu');
    const navbar = document.getElementById('navbar');
    const navLinks = Array.from(document.querySelectorAll('.nav-link'));
    const scrollToTopBtn = document.getElementById('scrollToTop');
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const setMenuState = function(isOpen) {
        if (!navMenu || !navToggle) return;

        navMenu.classList.toggle('active', isOpen);
        navToggle.classList.toggle('active', isOpen);
        navToggle.setAttribute('aria-expanded', String(isOpen));

        const icon = navToggle.querySelector('i');
        if (icon) {
            icon.classList.toggle('fa-bars', !isOpen);
            icon.classList.toggle('fa-xmark', isOpen);
        }
    };

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            setMenuState(navToggle.getAttribute('aria-expanded') !== 'true');
        });

        document.addEventListener('click', function(event) {
            const isOpen = navToggle.getAttribute('aria-expanded') === 'true';
            if (isOpen && !navMenu.contains(event.target) && !navToggle.contains(event.target)) {
                setMenuState(false);
            }
        });

        document.addEventListener('keydown', function(event) {
            if (event.key === 'Escape') {
                setMenuState(false);
                navToggle.focus();
            }
        });

        window.addEventListener('resize', function() {
            if (window.innerWidth > 850) setMenuState(false);
        });
    }

    navLinks.forEach(function(link) {
        link.addEventListener('click', function() {
            setMenuState(false);
        });
    });

    const updateScrollState = function() {
        const scrollY = window.scrollY;
        if (navbar) navbar.classList.toggle('nav-scrolled', scrollY > 40);
        if (scrollToTopBtn) scrollToTopBtn.classList.toggle('active', scrollY > 560);
    };

    let scrollTicking = false;
    updateScrollState();

    window.addEventListener('scroll', function() {
        if (scrollTicking) return;

        window.requestAnimationFrame(function() {
            updateScrollState();
            scrollTicking = false;
        });
        scrollTicking = true;
    }, { passive: true });

    const tabButtons = Array.from(document.querySelectorAll('.tab-btn'));
    const productCategories = Array.from(document.querySelectorAll('.product-category'));

    tabButtons.forEach(function(button, index) {
        const category = button.dataset.category;
        const panel = document.querySelector(`.product-category[data-category="${category}"]`);
        const tabId = `product-tab-${index}`;
        const panelId = `product-panel-${index}`;

        button.id = tabId;
        button.setAttribute('role', 'tab');
        button.setAttribute('aria-selected', String(button.classList.contains('active')));
        button.setAttribute('aria-controls', panelId);
        button.setAttribute('tabindex', button.classList.contains('active') ? '0' : '-1');

        if (panel) {
            panel.id = panelId;
            panel.setAttribute('role', 'tabpanel');
            panel.setAttribute('aria-labelledby', tabId);
        }

        button.addEventListener('click', function() {
            tabButtons.forEach(function(tab) {
                tab.classList.remove('active');
                tab.setAttribute('aria-selected', 'false');
                tab.setAttribute('tabindex', '-1');
            });

            productCategories.forEach(function(item) {
                item.classList.remove('active');
            });

            button.classList.add('active');
            button.setAttribute('aria-selected', 'true');
            button.setAttribute('tabindex', '0');
            if (panel) panel.classList.add('active');
        });

        button.addEventListener('keydown', function(event) {
            if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;

            event.preventDefault();
            const direction = event.key === 'ArrowRight' ? 1 : -1;
            const nextIndex = (index + direction + tabButtons.length) % tabButtons.length;
            tabButtons[nextIndex].focus();
            tabButtons[nextIndex].click();
        });
    });

    const tabList = document.querySelector('.category-tabs');
    if (tabList) tabList.setAttribute('role', 'tablist');

    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(event) {
            event.preventDefault();

            const isGreek = document.documentElement.lang === 'el';
            const requiredFields = ['name', 'email', 'subject', 'message'];
            const hasEmptyField = requiredFields.some(function(id) {
                const field = document.getElementById(id);
                return !field || !field.value.trim();
            });

            if (hasEmptyField) {
                window.alert(isGreek
                    ? 'Παρακαλώ συμπληρώστε όλα τα απαιτούμενα πεδία.'
                    : 'Please complete all required fields.');
                return;
            }

            const email = document.getElementById('email').value.trim();
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                window.alert(isGreek
                    ? 'Παρακαλώ εισάγετε μια έγκυρη διεύθυνση email.'
                    : 'Please enter a valid email address.');
                return;
            }

            const name = document.getElementById('name').value.trim();
            const phone = document.getElementById('phone').value.trim();
            const subject = document.getElementById('subject');
            const message = document.getElementById('message').value.trim();
            const subjectText = subject.options[subject.selectedIndex].text;
            const emailBody = [
                `${isGreek ? 'Όνομα' : 'Name'}: ${name}`,
                `${isGreek ? 'Email' : 'Email'}: ${email}`,
                `${isGreek ? 'Τηλέφωνο' : 'Phone'}: ${phone || '-'}`,
                '',
                message
            ].join('\n');

            window.location.href = `mailto:dimitrispourtsidis@yahoo.gr?subject=${encodeURIComponent(subjectText)}&body=${encodeURIComponent(emailBody)}`;
        });
    }

    document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
        anchor.addEventListener('click', function(event) {
            const targetId = anchor.getAttribute('href');
            if (!targetId || targetId === '#') return;

            const target = document.querySelector(targetId);
            if (!target) return;

            event.preventDefault();
            target.scrollIntoView({
                behavior: prefersReducedMotion ? 'auto' : 'smooth',
                block: 'start'
            });
        });
    });

    const animatedElements = document.querySelectorAll('.service-card, .product-content, .why-us-card, .about-content');
    animatedElements.forEach(function(element) {
        element.classList.add('animate-on-scroll');
    });

    if ('IntersectionObserver' in window && !prefersReducedMotion) {
        const revealObserver = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (!entry.isIntersecting) return;
                entry.target.classList.add('visible');
                revealObserver.unobserve(entry.target);
            });
        }, { threshold: 0.12 });

        animatedElements.forEach(function(element) {
            revealObserver.observe(element);
        });
    } else {
        animatedElements.forEach(function(element) {
            element.classList.add('visible');
        });
    }

    const observedSections = navLinks
        .map(function(link) { return document.querySelector(link.getAttribute('href')); })
        .filter(Boolean);

    if ('IntersectionObserver' in window) {
        const navigationObserver = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (!entry.isIntersecting) return;
                navLinks.forEach(function(link) {
                    link.classList.toggle('is-active', link.getAttribute('href') === `#${entry.target.id}`);
                });
            });
        }, { rootMargin: '-35% 0px -55% 0px' });

        observedSections.forEach(function(section) {
            navigationObserver.observe(section);
        });
    }
});
