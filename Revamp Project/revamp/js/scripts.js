// Small interactive behaviours: nav toggle, footer year, simple form handler
document.addEventListener('DOMContentLoaded', function () {
    var toggle = document.getElementById('nav-toggle');
    var navList = document.querySelector('.nav-list');
    if (toggle && navList) {
        toggle.addEventListener('click', function () {
            var isShown = navList.classList.toggle('show');
            toggle.setAttribute('aria-expanded', isShown ? 'true' : 'false');
        });
    }

    var year = document.getElementById('year');
    if (year) year.textContent = new Date().getFullYear();

    var form = document.getElementById('contact-form');
    if (form) {
        form.addEventListener('submit', function (e) {
            e.preventDefault();
            alert('Thank you! Your message was sent.');
            form.reset();
        });
    }

    // Add reveal-on-scroll using IntersectionObserver
    var revealItems = document.querySelectorAll('.reveal');
    if ('IntersectionObserver' in window && revealItems.length) {
        var obs = new IntersectionObserver(function (entries, observer) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12 });

        revealItems.forEach(function (el) { obs.observe(el); });
    } else {
        // Fallback: make all visible
        revealItems.forEach(function (el) { el.classList.add('is-visible'); });
    }

    // Scroll-based hero interaction
    var profilePanel = document.getElementById('profile-panel');
    var heroContent = document.querySelector('.hero-content');

    if (profilePanel && heroContent) {
        function handleScroll() {
            var scrollPosition = window.scrollY;
            if (scrollPosition > 50) {
                profilePanel.classList.remove('is-scrolled');
                heroContent.classList.remove('is-scrolled');
            } else {
                profilePanel.classList.add('is-scrolled');
                heroContent.classList.add('is-scrolled');
            }
        }

        window.addEventListener('scroll', handleScroll);
        handleScroll(); // Initialize on load
    }

    // Carousel Logic
    const carouselContainer = document.querySelector('.carousel-container');
    if (carouselContainer) {
        const track = carouselContainer.querySelector('.carousel-track');
        const slides = Array.from(track.children);
        const nextButton = carouselContainer.querySelector('.carousel-button.next');
        const prevButton = carouselContainer.querySelector('.carousel-button.prev');

        let currentIndex = 0;
        let autoPlayInterval;

        const updateCarousel = () => {
            const slideWidth = slides[0].getBoundingClientRect().width;
            track.style.transform = 'translateX(-' + slideWidth * currentIndex + 'px)';
        };

        const moveToNext = () => {
            if (currentIndex < slides.length - 1) {
                currentIndex++;
            } else {
                currentIndex = 0; // Loop back to start
            }
            updateCarousel();
        };

        const moveToPrev = () => {
            if (currentIndex > 0) {
                currentIndex--;
            } else {
                currentIndex = slides.length - 1; // Loop to end
            }
            updateCarousel();
        };

        const startAutoPlay = () => {
            autoPlayInterval = setInterval(moveToNext, 1500); // Change slide 
        };

        const stopAutoPlay = () => {
            clearInterval(autoPlayInterval);
        };

        nextButton.addEventListener('click', () => {
            moveToNext();
            stopAutoPlay();
        });

        prevButton.addEventListener('click', () => {
            moveToPrev();
            stopAutoPlay();
        });

        carouselContainer.addEventListener('mouseenter', stopAutoPlay);
        carouselContainer.addEventListener('mouseleave', startAutoPlay);

        // Recalculate resize
        window.addEventListener('resize', () => {
            stopAutoPlay();
            updateCarousel();
            startAutoPlay();
        });

        startAutoPlay(); // auto-play initialization
    }


    //3D Carousel Logic
    const carousel3DContainer = document.querySelector('.carousel-3d-container');
    const carousel3DControlsContainer = document.querySelector('.carousel-3d-controls');
    const carousel3DItems = document.querySelectorAll('.carousel-3d-item');

    if (carousel3DContainer && carousel3DItems.length > 0) {
        class Carousel3D {
            constructor(container, items, controlsContainer) {
                this.carouselContainer = container;
                this.carouselControlsContainer = controlsContainer;
                this.carouselArray = [...items];
                this.currentIndex = 0;
                this.isAutoRotating = true;
                this.autoRotateInterval = null;

                this.createProgressIndicator();
            }

            updateCarousel() {
                this.carouselArray.forEach((el, index) => {
                    // Remove all position classes
                    el.classList.remove('carousel-3d-item-1', 'carousel-3d-item-2', 'carousel-3d-item-3', 'carousel-3d-item-4', 'carousel-3d-item-5');
                });

                // Apply classes to visible items (1-5) with wrap-around
                for (let i = 0; i < 5; i++) {
                    const itemIndex = (this.currentIndex + i) % this.carouselArray.length;
                    this.carouselArray[itemIndex].classList.add(`carousel-3d-item-${i + 1}`);
                }

                this.updateProgressIndicator();
            }

            setCurrentState(direction) {
                if (direction === 'previous') {
                    this.currentIndex = (this.currentIndex - 1 + this.carouselArray.length) % this.carouselArray.length;
                } else {
                    this.currentIndex = (this.currentIndex + 1) % this.carouselArray.length;
                }
                this.updateCarousel();
            }

            setupControls() {
                if (!this.carouselControlsContainer) return;

                // Clear existing controls
                this.carouselControlsContainer.innerHTML = '';

                const prevButton = document.createElement('button');
                prevButton.className = 'carousel-3d-controls-previous';
                prevButton.innerHTML = '‹';
                prevButton.setAttribute('aria-label', 'Previous image');

                const nextButton = document.createElement('button');
                nextButton.className = 'carousel-3d-controls-next';
                nextButton.innerHTML = '›';
                nextButton.setAttribute('aria-label', 'Next image');

                this.carouselControlsContainer.appendChild(prevButton);
                this.carouselControlsContainer.appendChild(nextButton);

                // Add event listeners
                prevButton.addEventListener('click', () => {
                    this.setCurrentState('previous');
                    this.pauseAutoRotate(3000); // Pause for 3 seconds after manual interaction
                });

                nextButton.addEventListener('click', () => {
                    this.setCurrentState('next');
                    this.pauseAutoRotate(3000);
                });
            }

            createProgressIndicator() {
                const progressContainer = document.createElement('div');
                progressContainer.className = 'carousel-3d-progress';

                this.carouselArray.forEach((_, index) => {
                    const dot = document.createElement('div');
                    dot.className = 'carousel-3d-progress-dot';
                    if (index === 0) dot.classList.add('active');

                    dot.addEventListener('click', () => {
                        this.currentIndex = index;
                        this.updateCarousel();
                        this.pauseAutoRotate(3000);
                    });

                    progressContainer.appendChild(dot);
                });

                this.carouselControlsContainer.parentNode.insertBefore(progressContainer, this.carouselControlsContainer.nextSibling);
            }

            updateProgressIndicator() {
                const dots = document.querySelectorAll('.carousel-3d-progress-dot');
                dots.forEach((dot, index) => {
                    dot.classList.toggle('active', index === this.currentIndex);
                });
            }

            startAutoRotate() {
                if (this.isAutoRotating) {
                    this.autoRotateInterval = setInterval(() => {
                        this.setCurrentState('next');
                    }, 6000);
                }
            }

            stopAutoRotate() {
                if (this.autoRotateInterval) {
                    clearInterval(this.autoRotateInterval);
                    this.autoRotateInterval = null;
                }
            }

            pauseAutoRotate(duration = 3000) {
                this.stopAutoRotate();
                setTimeout(() => {
                    if (this.isAutoRotating) {
                        this.startAutoRotate();
                    }
                }, duration);
            }

            toggleAutoRotate() {
                this.isAutoRotating = !this.isAutoRotating;
                if (this.isAutoRotating) {
                    this.startAutoRotate();
                } else {
                    this.stopAutoRotate();
                }
            }
        }

        const carousel3D = new Carousel3D(carousel3DContainer, carousel3DItems, carousel3DControlsContainer);

        // Initialize the carousel
        carousel3D.updateCarousel();
        carousel3D.setupControls();

        // Start auto-rotation
        carousel3D.startAutoRotate();

        // Pause auto-rotation on hover
        carousel3DContainer.addEventListener('mouseenter', () => {
            carousel3D.stopAutoRotate();
        });

        carousel3DContainer.addEventListener('mouseleave', () => {
            if (carousel3D.isAutoRotating) {
                carousel3D.startAutoRotate();
            }
        });

        // Touch support for mobile
        let touchStartX = 0;
        let touchEndX = 0;

        carousel3DContainer.addEventListener('touchstart', e => {
            touchStartX = e.changedTouches[0].screenX;
        });

        carousel3DContainer.addEventListener('touchend', e => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        });

        function handleSwipe() {
            const swipeThreshold = 50;
            const diff = touchStartX - touchEndX;

            if (Math.abs(diff) > swipeThreshold) {
                if (diff > 0) {
                    carousel3D.setCurrentState('next');
                } else {
                    carousel3D.setCurrentState('previous');
                }
                carousel3D.pauseAutoRotate(3000);
            }
        }
    }
});
