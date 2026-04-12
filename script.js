document.addEventListener('DOMContentLoaded', function() {
    // Navbar Toggle
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('nav-menu');
    const navbar = document.getElementById('navbar');
    const navLinksItems = document.querySelectorAll('.nav-link');
    const scrollToTopBtn = document.getElementById('scrollToTop');

    const closeMobileNav = function() {
        if (!navMenu || !navToggle) return;

        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
        navToggle.setAttribute('aria-expanded', 'false');
    };

    // Toggle mobile navigation
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            const expanded = navToggle.getAttribute('aria-expanded') === 'true';
            const nextExpanded = !expanded;

            navMenu.classList.toggle('active', nextExpanded);
            navToggle.classList.toggle('active', nextExpanded);
            navToggle.setAttribute('aria-expanded', String(nextExpanded));
        });

        document.addEventListener('click', function(e) {
            if (navMenu.classList.contains('active')) {
                if (!navMenu.contains(e.target) && !navToggle.contains(e.target)) {
                    closeMobileNav();
                }
            }
        });
    }

    // Close mobile menu when a navigation link is clicked
    navLinksItems.forEach(link => {
        link.addEventListener('click', function() {
            closeMobileNav();
        });
    });

    const updateScrollState = function() {
        if (navbar) {
            if (window.scrollY > 100) {
                navbar.classList.add('nav-scrolled');
            } else {
                navbar.classList.remove('nav-scrolled');
            }
        }

        if (scrollToTopBtn) {
            if (window.scrollY > 500) {
                scrollToTopBtn.classList.add('active');
            } else {
                scrollToTopBtn.classList.remove('active');
            }
        }
    };

    let scrollTicking = false;
    updateScrollState();

    window.addEventListener('scroll', function() {
        if (!scrollTicking) {
            requestAnimationFrame(function() {
                updateScrollState();
                scrollTicking = false;
            });
            scrollTicking = true;
        }
    });

    // Product category tabs
    const tabBtns = document.querySelectorAll('.tab-btn');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Remove active class from all tabs
            tabBtns.forEach(tab => tab.classList.remove('active'));
            // Add active class to clicked tab
            this.classList.add('active');

            // Hide all product categories
            const categories = document.querySelectorAll('.product-category');
            categories.forEach(category => category.classList.remove('active'));

            // Show selected category
            const category = this.getAttribute('data-category');
            document.querySelector(`.product-category[data-category="${category}"]`).classList.add('active');
        });
    });

    // Contact Form Validation and Submission
    const contactForm = document.getElementById('contactForm');

    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();

            // Basic form validation
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const subject = document.getElementById('subject').value;
            const message = document.getElementById('message').value;

            if (!name || !email || !subject || !message) {
                alert('Παρακαλώ συμπληρώστε όλα τα απαιτούμενα πεδία.');
                return;
            }

            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                alert('Παρακαλώ εισάγετε μια έγκυρη διεύθυνση email.');
                return;
            }

            // If validation passes, you would typically send form data to a server
            // For demo purposes, we'll just show a success message
            alert('Ευχαριστούμε για το μήνυμά σας! Θα επικοινωνήσουμε μαζί σας σύντομα.');
            contactForm.reset();
        });
    }

    // Scroll to Top Button
    if (scrollToTopBtn) {
        scrollToTopBtn.addEventListener('click', function(e) {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // Smooth scrolling for all anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            // Skip if it's not an anchor link
            if (this.getAttribute('href') === '#') return;

            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                const navHeight = document.querySelector('nav').offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top + window.scrollY;

                window.scrollTo({
                    top: targetPosition - navHeight,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Add animations to elements when they come into view
    const animatedElements = document.querySelectorAll('.service-card, .product-content, .why-us-card');
    animatedElements.forEach(element => element.classList.add('animate-on-scroll'));

    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        animatedElements.forEach(element => observer.observe(element));
    } else {
        animatedElements.forEach(element => {
            element.classList.add('visible');
        });
    }

    // Initialize product grid
    // Show the first category by default
    const initialCategory = document.querySelector('.product-category[data-category="residential"]');
    if (initialCategory) {
        initialCategory.classList.add('active');
    }
});
