/**
 * LUXE BEAUTY SALON - LUXURY WOMEN'S HAIR SALON
 * Vanilla JavaScript Logic
 */

document.addEventListener('DOMContentLoaded', () => {
  // --------------------------------------------------------------------------
  // 1. Preloader Fadeout
  // --------------------------------------------------------------------------
  const preloader = document.getElementById('preloader');
  if (preloader) {
    window.addEventListener('load', () => {
      setTimeout(() => {
        preloader.classList.add('hidden');
      }, 500);
    });
    // Fallback if load event already fired or takes too long
    setTimeout(() => {
      preloader.classList.add('hidden');
    }, 2000);
  }

  // --------------------------------------------------------------------------
  // 2. Scroll Progress Bar & Sticky Header
  // --------------------------------------------------------------------------
  const scrollProgress = document.getElementById('scrollProgress');
  const navbar = document.getElementById('navbar');
  const scrollTopBtn = document.getElementById('scrollTopBtn');

  window.addEventListener('scroll', () => {
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPosition = window.scrollY;

    if (scrollProgress && totalHeight > 0) {
      const progress = (scrollPosition / totalHeight) * 100;
      scrollProgress.style.width = `${progress}%`;
    }

    if (navbar) {
      if (scrollPosition > 50) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    }

    if (scrollTopBtn) {
      if (scrollPosition > 400) {
        scrollTopBtn.classList.add('visible');
      } else {
        scrollTopBtn.classList.remove('visible');
      }
    }

    updateActiveNavLink();
  });

  // Scroll to Top action
  if (scrollTopBtn) {
    scrollTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // --------------------------------------------------------------------------
  // 3. Active Nav Link Tracking
  // --------------------------------------------------------------------------
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  function updateActiveNavLink() {
    let currentSectionId = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 120;
      const sectionHeight = section.offsetHeight;
      if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
        currentSectionId = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSectionId}`) {
        link.classList.add('active');
      }
    });
  }

  // Smooth scroll for nav links
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href');
      if (targetId && targetId.startsWith('#')) {
        e.preventDefault();
        const targetSection = document.querySelector(targetId);
        if (targetSection) {
          const offsetTop = targetSection.offsetTop - 80;
          window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
          });
          // Close mobile menu if open
          closeMobileMenu();
        }
      }
    });
  });

  // --------------------------------------------------------------------------
  // 4. Mobile Navigation Menu Toggle
  // --------------------------------------------------------------------------
  const mobileToggle = document.getElementById('mobileToggle');
  const mobileMenu = document.getElementById('mobileMenu');

  if (mobileToggle && mobileMenu) {
    mobileToggle.addEventListener('click', () => {
      mobileToggle.classList.toggle('active');
      mobileMenu.classList.toggle('active');
    });

    document.addEventListener('click', (e) => {
      if (!mobileMenu.contains(e.target) && !mobileToggle.contains(e.target) && mobileMenu.classList.contains('active')) {
        closeMobileMenu();
      }
    });
  }

  function closeMobileMenu() {
    if (mobileToggle && mobileMenu) {
      mobileToggle.classList.remove('active');
      mobileMenu.classList.remove('active');
    }
  }

  // --------------------------------------------------------------------------
  // 5. Custom Interactive Cursor (Desktop)
  // --------------------------------------------------------------------------
  const cursorDot = document.querySelector('.cursor-dot');
  const cursorOutline = document.querySelector('.cursor-outline');

  if (cursorDot && cursorOutline && window.matchMedia('(pointer: fine)').matches) {
    window.addEventListener('mousemove', (e) => {
      const posX = e.clientX;
      const posY = e.clientY;

      cursorDot.style.left = `${posX}px`;
      cursorDot.style.top = `${posY}px`;

      cursorOutline.animate({
        left: `${posX}px`,
        top: `${posY}px`
      }, { duration: 500, fill: 'forwards' });
    });

    const hoverableElements = document.querySelectorAll('a, button, .glass-card, .color-card, .style-card, .gallery-item');
    hoverableElements.forEach(el => {
      el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
      el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
    });
  }

  // --------------------------------------------------------------------------
  // 6. Scroll Reveal Animations (IntersectionObserver)
  // --------------------------------------------------------------------------
  const revealElements = document.querySelectorAll('.reveal-fade-up, .reveal-fade-left, .reveal-fade-right, .reveal-zoom-in');

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('reveal-active');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));

  // --------------------------------------------------------------------------
  // 7. Animated Statistics Counters
  // --------------------------------------------------------------------------
  const counterElements = document.querySelectorAll('.counter-number[data-target]');
  let countersAnimated = false;

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !countersAnimated) {
        countersAnimated = true;
        animateCounters();
      }
    });
  }, { threshold: 0.3 });

  const counterSection = document.querySelector('.counters-bar');
  if (counterSection) {
    counterObserver.observe(counterSection);
  }

  function animateCounters() {
    counterElements.forEach(counter => {
      const target = parseFloat(counter.getAttribute('data-target'));
      const prefix = counter.getAttribute('data-prefix') || '';
      const suffix = counter.getAttribute('data-suffix') || '';
      const isDecimal = target % 1 !== 0;
      const duration = 2000;
      const stepTime = 20;
      const steps = duration / stepTime;
      const increment = target / steps;
      let current = 0;

      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          current = target;
          clearInterval(timer);
        }
        counter.textContent = `${prefix}${isDecimal ? current.toFixed(1) : Math.floor(current)}${suffix}`;
      }, stepTime);
    });
  }

  // --------------------------------------------------------------------------
  // 8. Interactive Before & After Transformation Slider
  // --------------------------------------------------------------------------
  const baContainer = document.querySelector('.ba-container');
  const baAfter = document.querySelector('.ba-after');
  const baSliderLine = document.querySelector('.ba-slider-line');
  const baHandle = document.querySelector('.ba-handle');

  if (baContainer && baAfter && baHandle) {
    let isDragging = false;

    const setSliderPosition = (x) => {
      const rect = baContainer.getBoundingClientRect();
      let offsetX = x - rect.left;
      if (offsetX < 0) offsetX = 0;
      if (offsetX > rect.width) offsetX = rect.width;

      const percentage = (offsetX / rect.width) * 100;
      baAfter.style.width = `${percentage}%`;
      if (baSliderLine) baSliderLine.style.left = `${percentage}%`;
      baHandle.style.left = `${percentage}%`;
    };

    baHandle.addEventListener('mousedown', () => isDragging = true);
    window.addEventListener('mouseup', () => isDragging = false);
    window.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      setSliderPosition(e.clientX);
    });

    // Touch support for mobile devices
    baHandle.addEventListener('touchstart', () => isDragging = true);
    window.addEventListener('touchend', () => isDragging = false);
    window.addEventListener('touchmove', (e) => {
      if (!isDragging) return;
      if (e.touches.length > 0) {
        setSliderPosition(e.touches[0].clientX);
      }
    });

    // Click anywhere on container to move handle
    baContainer.addEventListener('click', (e) => {
      setSliderPosition(e.clientX);
    });
  }

  // --------------------------------------------------------------------------
  // 9. Pricing Category Filter Tabs
  // --------------------------------------------------------------------------
  const pricingTabs = document.querySelectorAll('.pricing-tab');
  const priceItems = document.querySelectorAll('.price-item');

  pricingTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      pricingTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const filter = tab.getAttribute('data-filter');

      priceItems.forEach(item => {
        const itemCat = item.getAttribute('data-category');
        if (filter === 'all' || itemCat === filter) {
          item.style.display = 'flex';
          setTimeout(() => { item.style.opacity = '1'; item.style.transform = 'translateY(0)'; }, 50);
        } else {
          item.style.opacity = '0';
          item.style.transform = 'translateY(10px)';
          setTimeout(() => { item.style.display = 'none'; }, 200);
        }
      });
    });
  });

  // --------------------------------------------------------------------------
  // 10. Gallery Category Filter & Lightbox
  // --------------------------------------------------------------------------
  const filterBtns = document.querySelectorAll('.filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const lightboxClose = document.querySelector('.lightbox-close');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      galleryItems.forEach(item => {
        const cat = item.getAttribute('data-category');
        if (filter === 'all' || cat === filter) {
          item.style.display = 'block';
          setTimeout(() => { item.style.opacity = '1'; item.style.transform = 'scale(1)'; }, 50);
        } else {
          item.style.opacity = '0';
          item.style.transform = 'scale(0.9)';
          setTimeout(() => { item.style.display = 'none'; }, 250);
        }
      });
    });
  });

  // Lightbox Modal trigger
  galleryItems.forEach(item => {
    item.addEventListener('click', () => {
      const img = item.querySelector('img');
      const title = item.querySelector('.gallery-title')?.textContent || '';
      const cat = item.querySelector('.gallery-cat')?.textContent || '';

      if (lightbox && lightboxImg && img) {
        lightboxImg.src = img.src;
        lightboxCaption.textContent = title ? `${title} — ${cat}` : '';
        lightbox.classList.add('active');
      }
    });
  });

  if (lightboxClose && lightbox) {
    lightboxClose.addEventListener('click', () => {
      lightbox.classList.remove('active');
    });

    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) {
        lightbox.classList.remove('active');
      }
    });
  }

  // --------------------------------------------------------------------------
  // 11. Customer Reviews Testimonial Slider
  // --------------------------------------------------------------------------
  const reviewsTrack = document.querySelector('.reviews-track');
  const reviewCards = document.querySelectorAll('.review-card');
  const dotsContainer = document.querySelector('.carousel-dots');
  let currentSlide = 0;
  let autoSlideTimer = null;

  if (reviewsTrack && reviewCards.length > 0 && dotsContainer) {
    // Generate dots
    dotsContainer.innerHTML = '';
    reviewCards.forEach((_, index) => {
      const dot = document.createElement('div');
      dot.classList.add('dot');
      if (index === 0) dot.classList.add('active');
      dot.addEventListener('click', () => goToSlide(index));
      dotsContainer.appendChild(dot);
    });

    const dots = dotsContainer.querySelectorAll('.dot');

    function goToSlide(index) {
      currentSlide = index;
      reviewsTrack.style.transform = `translateX(-${currentSlide * 100}%)`;
      dots.forEach((d, i) => {
        d.classList.toggle('active', i === currentSlide);
      });
    }

    function nextSlide() {
      currentSlide = (currentSlide + 1) % reviewCards.length;
      goToSlide(currentSlide);
    }

    // Auto-advance every 5 seconds
    autoSlideTimer = setInterval(nextSlide, 5000);

    // Pause on hover
    const carouselContainer = document.querySelector('.reviews-carousel');
    if (carouselContainer) {
      carouselContainer.addEventListener('mouseenter', () => clearInterval(autoSlideTimer));
      carouselContainer.addEventListener('mouseleave', () => {
        clearInterval(autoSlideTimer);
        autoSlideTimer = setInterval(nextSlide, 5000);
      });
    }
  }

  // --------------------------------------------------------------------------
  // 12. Button Ripple Effect
  // --------------------------------------------------------------------------
  const rippleButtons = document.querySelectorAll('.ripple');

  rippleButtons.forEach(button => {
    button.addEventListener('click', function (e) {
      const rect = button.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const circle = document.createElement('span');
      circle.classList.add('ripple-effect');
      circle.style.left = `${x}px`;
      circle.style.top = `${y}px`;

      this.appendChild(circle);

      setTimeout(() => circle.remove(), 600);
    });
  });
});
