/* ==========================================================================
   Premium Café & Restaurant Website - Custom JavaScript Controller
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize Core Features
    initPreloader();
    initThemeToggle();
    initStickyNavbar();
    initScrollProgress();
    initScrollToTop();
    initScrollReveal();
    initStatsCounter();
    initHeroSlider();
    initMenuFilterAndSearch();
    initLightboxGallery();
    initFormValidation();
});

/* ==========================================================================
   1. Preloader (Loading Screen)
   ========================================================================== */
function initPreloader() {
    const preloader = document.getElementById('preloader');
    if (preloader) {
        window.addEventListener('load', () => {
            preloader.style.opacity = '0';
            setTimeout(() => {
                preloader.style.display = 'none';
            }, 600); // match transition in CSS
        });
        
        // Fallback: If page takes too long, hide loader after 3 seconds
        setTimeout(() => {
            if (preloader.style.display !== 'none') {
                preloader.style.opacity = '0';
                setTimeout(() => {
                    preloader.style.display = 'none';
                }, 600);
            }
        }, 3000);
    }
}

/* ==========================================================================
   2. Dark/Light Theme Toggle
   ========================================================================== */
function initThemeToggle() {
    const themeToggleBtns = document.querySelectorAll('.btn-theme-toggle');
    if (themeToggleBtns.length === 0) return;

    // Check saved theme or default to system preference
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialTheme = savedTheme || (systemPrefersDark ? 'dark' : 'light');

    // Apply theme
    document.documentElement.setAttribute('data-theme', initialTheme);
    updateToggleIcons(initialTheme);

    themeToggleBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            updateToggleIcons(newTheme);
            
            // Dispatch a custom event to notify any theme-sensitive parts
            window.dispatchEvent(new CustomEvent('themeChanged', { detail: { theme: newTheme } }));
        });
    });

    function updateToggleIcons(theme) {
        themeToggleBtns.forEach(btn => {
            const icon = btn.querySelector('i');
            if (icon) {
                if (theme === 'dark') {
                    icon.className = 'fas fa-sun';
                } else {
                    icon.className = 'fas fa-moon';
                }
            }
        });
    }
}

/* ==========================================================================
   3. Sticky Navigation Header
   ========================================================================== */
function initStickyNavbar() {
    const navbar = document.querySelector('.navbar-custom');
    if (!navbar) return;

    const handleScroll = () => {
        if (window.scrollY > 50) {
            navbar.classList.add('sticky');
        } else {
            navbar.classList.remove('sticky');
        }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Run once at start in case page is loaded scrolled down
}

/* ==========================================================================
   4. Scroll Progress Indicator
   ========================================================================== */
function initScrollProgress() {
    const progressBar = document.getElementById('scroll-progress');
    if (!progressBar) return;

    window.addEventListener('scroll', () => {
        const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
        if (totalHeight > 0) {
            const progress = (window.scrollY / totalHeight) * 100;
            progressBar.style.width = `${progress}%`;
        }
    });
}

/* ==========================================================================
   5. Scroll-To-Top Button
   ========================================================================== */
function initScrollToTop() {
    const scrollBtn = document.querySelector('.scroll-to-top');
    if (!scrollBtn) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 400) {
            scrollBtn.classList.add('show');
        } else {
            scrollBtn.classList.remove('show');
        }
    });

    scrollBtn.addEventListener('click', (e) => {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

/* ==========================================================================
   6. Scroll Reveal Animations (Fade in on scroll)
   ========================================================================== */
function initScrollReveal() {
    const revealElements = document.querySelectorAll('.reveal-on-scroll');
    if (revealElements.length === 0) return;

    const observerOptions = {
        root: null, // viewport
        rootMargin: '0px',
        threshold: 0.15 // trigger when 15% of element is visible
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                // Once revealed, no need to track it further
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    revealElements.forEach(el => observer.observe(el));
}

/* ==========================================================================
   7. Restaurant Statistics Counters
   ========================================================================== */
function initStatsCounter() {
    const counterElements = document.querySelectorAll('.stats-number');
    if (counterElements.length === 0) return;

    const runCounter = (el) => {
        const target = parseFloat(el.getAttribute('data-target'));
        const duration = 2000; // 2 seconds animation
        const steps = 50;
        const stepTime = duration / steps;
        let current = 0;
        const increment = target / steps;

        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                el.textContent = formatStatNumber(target);
                clearInterval(timer);
            } else {
                el.textContent = formatStatNumber(Math.floor(current));
            }
        }, stepTime);
    };

    function formatStatNumber(num) {
        // Formatting: add '+' or shorthand suffix if needed
        return num.toLocaleString() + '+';
    }

    const observerOptions = {
        root: null,
        threshold: 0.5
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                runCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    counterElements.forEach(el => observer.observe(el));
}

/* ==========================================================================
   8. Hero Slide Transitions
   ========================================================================== */
function initHeroSlider() {
    const slides = document.querySelectorAll('.hero-slide');
    if (slides.length <= 1) return;

    let currentSlide = 0;
    const slideInterval = 6000; // 6 seconds per slide

    const nextSlide = () => {
        slides[currentSlide].classList.remove('active');
        currentSlide = (currentSlide + 1) % slides.length;
        slides[currentSlide].classList.add('active');
    };

    setInterval(nextSlide, slideInterval);
}

/* ==========================================================================
   9. Interactive Menu Filtering and live search
   ========================================================================== */
function initMenuFilterAndSearch() {
    const filterButtons = document.querySelectorAll('.menu-filter-btn');
    const menuGridItems = document.querySelectorAll('.menu-item-card');
    const searchBar = document.getElementById('menu-search-bar');
    
    if (filterButtons.length === 0 && !searchBar) return;

    let activeCategory = 'all';
    let searchQuery = '';

    // Apply combined filters (category + search)
    const applyFilters = () => {
        menuGridItems.forEach(item => {
            const category = item.getAttribute('data-category');
            const title = item.querySelector('.dish-title').textContent.toLowerCase();
            const description = item.querySelector('.dish-desc') ? item.querySelector('.dish-desc').textContent.toLowerCase() : '';
            
            const matchCategory = (activeCategory === 'all' || category === activeCategory);
            const matchSearch = (title.includes(searchQuery) || description.includes(searchQuery));

            if (matchCategory && matchSearch) {
                item.style.display = 'block';
                // Add fade-in classes
                setTimeout(() => {
                    item.style.opacity = '1';
                    item.style.transform = 'scale(1)';
                }, 50);
            } else {
                item.style.opacity = '0';
                item.style.transform = 'scale(0.8)';
                setTimeout(() => {
                    item.style.display = 'none';
                }, 300);
            }
        });
    };

    // Filter Buttons Click Listener
    filterButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            activeCategory = btn.getAttribute('data-filter');
            applyFilters();
        });
    });

    // Search input listener
    if (searchBar) {
        searchBar.addEventListener('input', (e) => {
            searchQuery = e.target.value.toLowerCase().trim();
            applyFilters();
        });
    }
}

/* ==========================================================================
   10. Lightbox Image Gallery Preview
   ========================================================================== */
function initLightboxGallery() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    const lightboxModal = document.getElementById('lightboxModal');
    
    if (galleryItems.length === 0 || !lightboxModal) return;

    // Use Bootstrap modal instance
    const bsModal = new bootstrap.Modal(lightboxModal);
    const lightboxImage = lightboxModal.querySelector('.lightbox-img');
    const lightboxCaption = lightboxModal.querySelector('.lightbox-caption');

    galleryItems.forEach(item => {
        item.addEventListener('click', () => {
            const img = item.querySelector('img');
            const largeSrc = item.getAttribute('data-large') || img.src;
            const captionTitle = item.querySelector('h5') ? item.querySelector('h5').textContent : '';
            const captionCategory = item.querySelector('p') ? item.querySelector('p').textContent : '';

            if (img && lightboxImage) {
                lightboxImage.src = largeSrc;
                if (lightboxCaption) {
                    lightboxCaption.innerHTML = `<strong>${captionTitle}</strong> - <span class="text-gold">${captionCategory}</span>`;
                }
                bsModal.show();
            }
        });
    });
}

/* ==========================================================================
   11. Contact & Newsletter Form Validation
   ========================================================================== */
function initFormValidation() {
    // Universal form validation handler
    const forms = document.querySelectorAll('.needs-validation');

    forms.forEach(form => {
        form.addEventListener('submit', event => {
            event.preventDefault();
            event.stopPropagation();

            if (!form.checkValidity()) {
                form.classList.add('was-validated');
            } else {
                // Form is valid! Show a premium toast alert or notification
                form.classList.remove('was-validated');
                showFormSuccessAlert(form);
            }
        }, false);
    });

    function showFormSuccessAlert(form) {
        // Find if there's a modal to close first
        const modalEl = form.closest('.modal');
        if (modalEl) {
            const bsModal = bootstrap.Modal.getInstance(modalEl);
            if (bsModal) bsModal.hide();
        }

        // Show generic confirmation alert
        const alertDiv = document.createElement('div');
        alertDiv.className = 'glass-card text-center p-5 reveal-on-scroll active';
        alertDiv.style.position = 'fixed';
        alertDiv.style.top = '50%';
        alertDiv.style.left = '50%';
        alertDiv.style.transform = 'translate(-50%, -50%)';
        alertDiv.style.zIndex = '9999';
        alertDiv.style.maxWidth = '450px';
        alertDiv.style.width = '90%';
        
        let message = 'Thank you! Your message has been sent successfully. We will get back to you shortly.';
        let iconHtml = '<i class="fas fa-check-circle fa-4x text-gold mb-3"></i>';
        
        if (form.id === 'reservation-form') {
            message = 'Your table reservation request has been received. A confirmation email is on its way to you!';
            iconHtml = '<i class="fas fa-calendar-check fa-4x text-gold mb-3"></i>';
        } else if (form.id === 'newsletter-form') {
            message = 'Welcome to the inner circle! You have successfully subscribed to our weekly newsletter.';
            iconHtml = '<i class="fas fa-envelope-open-text fa-4x text-gold mb-3"></i>';
        }

        alertDiv.innerHTML = `
            ${iconHtml}
            <h3 class="mb-3">Success!</h3>
            <p class="mb-4">${message}</p>
            <button class="btn btn-gold btn-close-alert">Wonderful</button>
        `;

        document.body.appendChild(alertDiv);

        // Add blur overlay
        const overlay = document.createElement('div');
        overlay.style.position = 'fixed';
        overlay.style.top = '0';
        overlay.style.left = '0';
        overlay.style.width = '100vw';
        overlay.style.height = '100vh';
        overlay.style.background = 'rgba(18, 11, 9, 0.6)';
        overlay.style.backdropFilter = 'blur(5px)';
        overlay.style.zIndex = '9998';
        document.body.appendChild(overlay);

        const closeBtn = alertDiv.querySelector('.btn-close-alert');
        const closeAlert = () => {
            alertDiv.remove();
            overlay.remove();
            form.reset();
        };

        closeBtn.addEventListener('click', closeAlert);
        overlay.addEventListener('click', closeAlert);
    }
}
