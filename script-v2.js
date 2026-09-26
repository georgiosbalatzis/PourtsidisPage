/* Pourtsidis Generators — V2 prototype interactions (vanilla JS, no dependencies) */
document.addEventListener('DOMContentLoaded', function() {
    const root = document.documentElement;
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const desktopQuery = window.matchMedia('(min-width: 901px)');
    const prefersReducedMotion = function() { return motionQuery.matches; };

    /* ------------------------------------------------------------------
       Mobile navigation (full-screen menu with focus containment)
       ------------------------------------------------------------------ */
    const header = document.getElementById('navbar');
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('site-menu');

    const isMenuOpen = function() {
        return navToggle && navToggle.getAttribute('aria-expanded') === 'true';
    };

    const setMenuState = function(isOpen) {
        if (!navToggle || !navMenu) return;

        navToggle.setAttribute('aria-expanded', String(isOpen));
        navToggle.setAttribute('aria-label', isOpen ? navToggle.dataset.labelClose : navToggle.dataset.labelOpen);
        navMenu.classList.toggle('is-open', isOpen);
        header.classList.toggle('menu-is-open', isOpen);
        root.classList.toggle('menu-open', isOpen);

        if (isOpen) {
            const firstLink = navMenu.querySelector('a');
            if (firstLink) window.setTimeout(function() { firstLink.focus(); }, 60);
        }
    };

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            setMenuState(!isMenuOpen());
        });

        navMenu.addEventListener('click', function(event) {
            if (event.target.closest('a')) setMenuState(false);
        });

        document.addEventListener('keydown', function(event) {
            if (!isMenuOpen()) return;

            if (event.key === 'Escape') {
                setMenuState(false);
                navToggle.focus();
                return;
            }

            if (event.key !== 'Tab') return;

            // Keep keyboard focus inside the open menu (links + toggle button).
            const focusable = Array.from(navMenu.querySelectorAll('a, button')).concat(navToggle);
            const first = focusable[0];
            const last = focusable[focusable.length - 1];

            if (event.shiftKey && document.activeElement === first) {
                event.preventDefault();
                last.focus();
            } else if (!event.shiftKey && document.activeElement === last) {
                event.preventDefault();
                first.focus();
            }
        });

        desktopQuery.addEventListener('change', function(event) {
            if (event.matches) setMenuState(false);
        });
    }

    /* ------------------------------------------------------------------
       Header state, scroll progress and back-to-top (rAF-throttled)
       ------------------------------------------------------------------ */
    const scrollToTopBtn = document.getElementById('scrollToTop');
    const progressBar = document.querySelector('.site-header__progress');

    const updateScrollState = function() {
        const scrollY = window.scrollY;
        const maxScroll = document.documentElement.scrollHeight - window.innerHeight;

        if (header) header.classList.toggle('is-scrolled', scrollY > 40);
        if (progressBar) progressBar.style.setProperty('--progress', maxScroll > 0 ? (scrollY / maxScroll).toFixed(4) : 0);
        if (scrollToTopBtn) scrollToTopBtn.classList.toggle('is-visible', scrollY > 640);
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

    /* ------------------------------------------------------------------
       Anchor links: smooth scroll + focus management
       ------------------------------------------------------------------ */
    const subjectSelect = document.getElementById('subject');

    document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
        anchor.addEventListener('click', function(event) {
            const targetId = anchor.getAttribute('href');
            if (!targetId || targetId === '#') return;

            const target = document.querySelector(targetId);
            if (!target) return;

            event.preventDefault();

            // Links such as "Request rental quote" pre-select the form subject.
            if (anchor.dataset.subject && subjectSelect) {
                subjectSelect.value = anchor.dataset.subject;
                subjectSelect.dispatchEvent(new Event('change'));
            }

            target.scrollIntoView({
                behavior: prefersReducedMotion() ? 'auto' : 'smooth',
                block: 'start'
            });

            if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
            target.focus({ preventScroll: true });

            if (history.replaceState) history.replaceState(null, '', targetId === '#home' ? window.location.pathname : targetId);
        });
    });

    /* ------------------------------------------------------------------
       Product tabs (role=tablist, arrow / Home / End keys)
       ------------------------------------------------------------------ */
    const tabList = document.querySelector('.products__tabs');
    const tabButtons = tabList ? Array.from(tabList.querySelectorAll('[role="tab"]')) : [];
    const productCounter = document.querySelector('[data-product-index]');

    const selectTab = function(button) {
        tabButtons.forEach(function(tab) {
            const isSelected = tab === button;
            const panel = document.getElementById(tab.getAttribute('aria-controls'));

            tab.setAttribute('aria-selected', String(isSelected));
            tab.setAttribute('tabindex', isSelected ? '0' : '-1');
            if (panel) panel.classList.toggle('is-active', isSelected);
        });

        if (productCounter) {
            productCounter.textContent = String(tabButtons.indexOf(button) + 1).padStart(2, '0');
        }
    };

    tabButtons.forEach(function(button, index) {
        button.addEventListener('click', function() {
            selectTab(button);
        });

        button.addEventListener('keydown', function(event) {
            let nextIndex = null;

            if (event.key === 'ArrowRight' || event.key === 'ArrowDown') nextIndex = (index + 1) % tabButtons.length;
            if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') nextIndex = (index - 1 + tabButtons.length) % tabButtons.length;
            if (event.key === 'Home') nextIndex = 0;
            if (event.key === 'End') nextIndex = tabButtons.length - 1;
            if (nextIndex === null) return;

            event.preventDefault();
            tabButtons[nextIndex].focus();
            selectTab(tabButtons[nextIndex]);
        });
    });

    /* ------------------------------------------------------------------
       Rental panels: hover / focus / click reveals the related image
       (desktop). On smaller screens every panel is expanded.
       ------------------------------------------------------------------ */
    const rentals = Array.from(document.querySelectorAll('.rental'));

    const activateRental = function(rental) {
        rentals.forEach(function(item) {
            const isActive = item === rental;
            const trigger = item.querySelector('.rental__title button');

            item.classList.toggle('is-active', isActive);
            if (trigger) trigger.setAttribute('aria-expanded', String(isActive || !desktopQuery.matches));
        });
    };

    rentals.forEach(function(rental) {
        const trigger = rental.querySelector('.rental__title button');

        rental.addEventListener('mouseenter', function() {
            if (desktopQuery.matches) activateRental(rental);
        });

        if (trigger) {
            trigger.addEventListener('click', function() {
                if (desktopQuery.matches) activateRental(rental);
            });
            trigger.addEventListener('focus', function() {
                if (desktopQuery.matches) activateRental(rental);
            });
        }
    });

    const syncRentalsToViewport = function() {
        const active = rentals.find(function(item) { return item.classList.contains('is-active'); }) || rentals[0];
        if (active) activateRental(active);
    };

    syncRentalsToViewport();
    desktopQuery.addEventListener('change', syncRentalsToViewport);

    /* ------------------------------------------------------------------
       Scroll reveals (IntersectionObserver) with sibling stagger
       ------------------------------------------------------------------ */
    const revealElements = Array.from(document.querySelectorAll('[data-reveal]'));

    revealElements.forEach(function(element) {
        if (element.style.getPropertyValue('--i')) return;
        const siblings = Array.from(element.parentElement.children).filter(function(child) {
            return child.hasAttribute('data-reveal');
        });
        element.style.setProperty('--i', String(Math.max(0, siblings.indexOf(element))));
    });

    const showAll = function() {
        revealElements.forEach(function(element) { element.classList.add('is-inview'); });
    };

    if ('IntersectionObserver' in window && !prefersReducedMotion()) {
        const revealObserver = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (!entry.isIntersecting) return;
                entry.target.classList.add('is-inview');
                revealObserver.unobserve(entry.target);
            });
        }, { threshold: 0.14, rootMargin: '0px 0px -6% 0px' });

        revealElements.forEach(function(element) { revealObserver.observe(element); });
    } else {
        showAll();
    }

    /* ------------------------------------------------------------------
       Metric counters (34+, 1500 kW). 24/7 and 1991 are revealed, not counted.
       ------------------------------------------------------------------ */
    const counters = Array.from(document.querySelectorAll('[data-count]'));

    const runCounter = function(element) {
        const target = parseInt(element.dataset.count, 10);
        const duration = 1400;
        const start = performance.now();

        const tick = function(now) {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            element.textContent = String(Math.round(target * eased));
            if (progress < 1) window.requestAnimationFrame(tick);
        };

        window.requestAnimationFrame(tick);
    };

    if (counters.length && 'IntersectionObserver' in window && !prefersReducedMotion()) {
        counters.forEach(function(counter) { counter.textContent = '0'; });

        const counterObserver = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (!entry.isIntersecting) return;
                runCounter(entry.target);
                counterObserver.unobserve(entry.target);
            });
        }, { threshold: 0.6 });

        counters.forEach(function(counter) { counterObserver.observe(counter); });
    }

    /* ------------------------------------------------------------------
       Subtle scroll-linked image drift on the cinematic break (±30px)
       ------------------------------------------------------------------ */
    const parallaxItems = Array.from(document.querySelectorAll('[data-parallax]'));

    if (parallaxItems.length && 'IntersectionObserver' in window && !prefersReducedMotion()) {
        const visibleItems = new Set();
        let parallaxTicking = false;

        const updateParallax = function() {
            const viewport = window.innerHeight;
            visibleItems.forEach(function(item) {
                const rect = item.parentElement.getBoundingClientRect();
                const progress = (viewport - rect.top) / (viewport + rect.height);
                const offset = (Math.min(Math.max(progress, 0), 1) - 0.5) * 60;
                item.style.transform = 'translate3d(0,' + offset.toFixed(1) + 'px,0)';
            });
            parallaxTicking = false;
        };

        const requestParallax = function() {
            if (parallaxTicking || !visibleItems.size) return;
            parallaxTicking = true;
            window.requestAnimationFrame(updateParallax);
        };

        const parallaxObserver = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                const item = entry.target.querySelector('[data-parallax]');
                if (!item) return;
                if (entry.isIntersecting) visibleItems.add(item);
                else visibleItems.delete(item);
            });
            requestParallax();
        });

        parallaxItems.forEach(function(item) { parallaxObserver.observe(item.parentElement); });
        window.addEventListener('scroll', requestParallax, { passive: true });
        window.addEventListener('resize', requestParallax);
    }

    /* ------------------------------------------------------------------
       Active navigation link
       ------------------------------------------------------------------ */
    const navLinks = Array.from(document.querySelectorAll('.nav__link'));
    const observedSections = navLinks
        .map(function(link) { return document.querySelector(link.getAttribute('href')); })
        .filter(Boolean);

    if ('IntersectionObserver' in window) {
        const navigationObserver = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (!entry.isIntersecting) return;
                navLinks.forEach(function(link) {
                    const isActive = link.getAttribute('href') === '#' + entry.target.id;
                    link.classList.toggle('is-active', isActive);
                    if (isActive) link.setAttribute('aria-current', 'true');
                    else link.removeAttribute('aria-current');
                });
            });
        }, { rootMargin: '-40% 0px -55% 0px' });

        observedSections.forEach(function(section) { navigationObserver.observe(section); });
    }

    /* ------------------------------------------------------------------
       Contact form: validates, then opens a prepared email (mailto)
       ------------------------------------------------------------------ */
    const contactForm = document.getElementById('contactForm');

    if (contactForm) {
        const isGreek = root.lang === 'el';
        const status = document.getElementById('form-status');
        const requiredFields = ['name', 'email', 'subject', 'message'];
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        const setFieldError = function(field, message) {
            const error = document.getElementById(field.id + '-error');
            if (message) field.setAttribute('aria-invalid', 'true');
            else field.removeAttribute('aria-invalid');
            if (error) error.textContent = message || '';
        };

        const validateField = function(field) {
            const value = field.value.trim();
            if (!value) return contactForm.dataset.msgRequired;
            if (field.id === 'email' && !emailPattern.test(value)) return contactForm.dataset.msgEmail;
            return '';
        };

        requiredFields.forEach(function(id) {
            const field = document.getElementById(id);
            if (!field) return;
            const clearIfValid = function() {
                if (field.getAttribute('aria-invalid') === 'true' && !validateField(field)) setFieldError(field, '');
            };
            field.addEventListener('input', clearIfValid);
            field.addEventListener('change', clearIfValid);
        });

        contactForm.addEventListener('submit', function(event) {
            event.preventDefault();

            let firstInvalid = null;
            requiredFields.forEach(function(id) {
                const field = document.getElementById(id);
                if (!field) return;
                const message = validateField(field);
                setFieldError(field, message);
                if (message && !firstInvalid) firstInvalid = field;
            });

            if (firstInvalid) {
                if (status) status.textContent = contactForm.dataset.msgSummary;
                firstInvalid.focus();
                return;
            }

            if (status) status.textContent = '';

            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const phone = document.getElementById('phone').value.trim();
            const subject = document.getElementById('subject');
            const message = document.getElementById('message').value.trim();
            const subjectText = subject.options[subject.selectedIndex].text;
            const emailBody = [
                `${isGreek ? 'Όνομα' : 'Name'}: ${name}`,
                `Email: ${email}`,
                `${isGreek ? 'Τηλέφωνο' : 'Phone'}: ${phone || '-'}`,
                '',
                message
            ].join('\n');

            window.location.href = `mailto:dimitrispourtsidis@yahoo.gr?subject=${encodeURIComponent(subjectText)}&body=${encodeURIComponent(emailBody)}`;
        });
    }
});
