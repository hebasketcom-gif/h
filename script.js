/**
 * ELITE MEN'S SALON - LUXURY GROOMING SCRIPT
 * Pure Vanilla JavaScript (No jQuery, No external frameworks)
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Preloader
  const preloader = document.getElementById('preloader');
  window.addEventListener('load', () => {
    if (preloader) {
      setTimeout(() => {
        preloader.classList.add('loaded');
      }, 400);
    }
  });

  // Fallback preloader hide after 2.5s if window load takes time
  setTimeout(() => {
    if (preloader && !preloader.classList.contains('loaded')) {
      preloader.classList.add('loaded');
    }
  }, 2500);

  // 2. Scroll Progress Bar & Sticky Navbar
  const progressBar = document.getElementById('scrollProgressBar');
  const header = document.getElementById('header');
  const scrollTopBtn = document.getElementById('scrollTopBtn');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  window.addEventListener('scroll', () => {
    const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (window.scrollY / windowHeight) * 100;
    if (progressBar) {
      progressBar.style.width = `${Math.min(scrolled, 100)}%`;
    }

    // Sticky Header
    if (header) {
      if (window.scrollY > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }

    // Scroll to top button
    if (scrollTopBtn) {
      if (window.scrollY > 400) {
        scrollTopBtn.classList.add('visible');
      } else {
        scrollTopBtn.classList.remove('visible');
      }
    }

    // Nav active link highlighting
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
  });

  // Scroll to Top Click
  if (scrollTopBtn) {
    scrollTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // 3. Mobile Hamburger Navigation
  const hamburger = document.getElementById('hamburger');
  const navMenu = document.getElementById('navMenu');

  if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      navMenu.classList.toggle('active');
    });

    // Close menu when clicking nav link
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
      });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!navMenu.contains(e.target) && !hamburger.contains(e.target) && navMenu.classList.contains('active')) {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
      }
    });
  }

  // 4. Scroll Reveal Animations via IntersectionObserver
  const revealElements = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');

          // Trigger counters if element contains stats
          if (entry.target.classList.contains('has-counter')) {
            startCounters(entry.target);
          }

          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.15,
      rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    // Fallback for older browsers
    revealElements.forEach(el => el.classList.add('active'));
  }

  // 5. Animated Counter Stats
  function startCounters(container) {
    const counters = container.querySelectorAll('.stat-counter');
    counters.forEach(counter => {
      const target = parseInt(counter.getAttribute('data-target'), 10);
      const duration = 2000;
      const stepTime = 20;
      const steps = duration / stepTime;
      const increment = target / steps;
      let current = 0;

      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          counter.textContent = target.toLocaleString();
          clearInterval(timer);
        } else {
          counter.textContent = Math.floor(current).toLocaleString();
        }
      }, stepTime);
    });
  }

  // Separate trigger for hero counters
  const heroSection = document.querySelector('.hero');
  if (heroSection) {
    setTimeout(() => {
      startCounters(heroSection);
    }, 600);
  }

  // 6. Category Filter Tabs (Hairstyles & Gallery)
  setupFilterTabs('.hairstyles-filter-btn', '.hairstyle-card');
  setupFilterTabs('.gallery-filter-btn', '.gallery-item');

  function setupFilterTabs(btnSelector, itemSelector) {
    const buttons = document.querySelectorAll(btnSelector);
    const items = document.querySelectorAll(itemSelector);

    buttons.forEach(btn => {
      btn.addEventListener('click', () => {
        buttons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filterValue = btn.getAttribute('data-filter');

        items.forEach(item => {
          const category = item.getAttribute('data-category');
          if (filterValue === 'all' || category === filterValue) {
            item.style.display = '';
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
      });
    });
  }

  // 7. Before & After Image Slider Drag Logic
  const baContainer = document.getElementById('baContainer');
  const baWrapper = document.getElementById('baWrapper');
  const baHandle = document.getElementById('baHandle');

  if (baContainer && baWrapper && baHandle) {
    let isDragging = false;

    const setPosition = (x) => {
      const rect = baContainer.getBoundingClientRect();
      let offsetX = x - rect.left;
      if (offsetX < 0) offsetX = 0;
      if (offsetX > rect.width) offsetX = rect.width;

      const percentage = (offsetX / rect.width) * 100;
      baWrapper.style.width = `${percentage}%`;
      baHandle.style.left = `${percentage}%`;
    };

    const onMove = (e) => {
      if (!isDragging) return;
      const x = e.touches ? e.touches[0].clientX : e.clientX;
      setPosition(x);
    };

    baHandle.addEventListener('mousedown', () => isDragging = true);
    baContainer.addEventListener('mousedown', (e) => {
      isDragging = true;
      setPosition(e.clientX);
    });

    window.addEventListener('mouseup', () => isDragging = false);
    window.addEventListener('mousemove', onMove);

    baHandle.addEventListener('touchstart', () => isDragging = true, { passive: true });
    baContainer.addEventListener('touchstart', (e) => {
      isDragging = true;
      setPosition(e.touches[0].clientX);
    }, { passive: true });

    window.addEventListener('touchend', () => isDragging = false);
    window.addEventListener('touchmove', onMove, { passive: true });
  }

  // 8. Customer Reviews Auto Slider
  const track = document.getElementById('reviewsTrack');
  const dotsContainer = document.getElementById('carouselDots');

  if (track && dotsContainer) {
    const slides = Array.from(track.children);
    let currentIndex = 0;
    let autoplayTimer = null;

    // Create dots
    slides.forEach((_, index) => {
      const dot = document.createElement('div');
      dot.classList.add('dot');
      if (index === 0) dot.classList.add('active');
      dot.addEventListener('click', () => goToSlide(index));
      dotsContainer.appendChild(dot);
    });

    const dots = Array.from(dotsContainer.children);

    function goToSlide(index) {
      currentIndex = index;
      track.style.transform = `translateX(-${currentIndex * 100}%)`;
      dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === currentIndex);
      });
    }

    function nextSlide() {
      const nextIndex = (currentIndex + 1) % slides.length;
      goToSlide(nextIndex);
    }

    function startAutoplay() {
      autoplayTimer = setInterval(nextSlide, 5000);
    }

    function stopAutoplay() {
      clearInterval(autoplayTimer);
    }

    startAutoplay();

    const carouselEl = document.querySelector('.reviews-carousel');
    if (carouselEl) {
      carouselEl.addEventListener('mouseenter', stopAutoplay);
      carouselEl.addEventListener('mouseleave', startAutoplay);
    }

    // Touch Swipe Support
    let startX = 0;
    let dist = 0;

    track.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX;
      stopAutoplay();
    }, { passive: true });

    track.addEventListener('touchend', (e) => {
      dist = e.changedTouches[0].clientX - startX;
      if (dist > 50) {
        goToSlide((currentIndex - 1 + slides.length) % slides.length);
      } else if (dist < -50) {
        nextSlide();
      }
      startAutoplay();
    }, { passive: true });
  }

  // 9. Lightbox Modal
  const modal = document.getElementById('lightboxModal');
  const modalImg = document.getElementById('lightboxImg');
  const modalCaption = document.getElementById('lightboxCaption');
  const modalClose = document.getElementById('lightboxClose');

  if (modal && modalImg && modalCaption) {
    const galleryTriggers = document.querySelectorAll('[data-lightbox]');

    galleryTriggers.forEach(trigger => {
      trigger.addEventListener('click', () => {
        const imgSrc = trigger.getAttribute('data-img') || trigger.querySelector('img')?.src;
        const caption = trigger.getAttribute('data-title') || trigger.querySelector('h3, h4')?.textContent || 'Elite Grooming';

        if (imgSrc) {
          modalImg.src = imgSrc;
          modalCaption.textContent = caption;
          modal.classList.add('active');
          document.body.style.overflow = 'hidden';
        }
      });
    });

    const closeModal = () => {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    };

    if (modalClose) modalClose.addEventListener('click', closeModal);

    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.classList.contains('active')) closeModal();
    });
  }

  // 10. Custom Cursor (Desktop only)
  if (window.matchMedia('(pointer: fine)').matches) {
    const cursor = document.createElement('div');
    cursor.classList.add('custom-cursor');
    const follower = document.createElement('div');
    follower.classList.add('custom-cursor-follower');

    document.body.appendChild(cursor);
    document.body.appendChild(follower);

    let mouseX = -100, mouseY = -100;
    let followerX = -100, followerY = -100;

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursor.style.left = `${mouseX}px`;
      cursor.style.top = `${mouseY}px`;
    });

    function animateFollower() {
      followerX += (mouseX - followerX) * 0.15;
      followerY += (mouseY - followerY) * 0.15;
      follower.style.left = `${followerX}px`;
      follower.style.top = `${followerY}px`;
      requestAnimationFrame(animateFollower);
    }
    animateFollower();

    const hoverables = document.querySelectorAll('a, button, .glass-card, .color-card, .hairstyle-card, .beard-card, .gallery-item');
    hoverables.forEach(el => {
      el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
      el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
    });
  }

  // 11. Ripple Button Effect
  const rippleBtns = document.querySelectorAll('.ripple');
  rippleBtns.forEach(btn => {
    btn.addEventListener('click', function (e) {
      const rect = this.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const ink = document.createElement('span');
      ink.classList.add('ripple-ink');
      ink.style.left = `${x}px`;
      ink.style.top = `${y}px`;
      const size = Math.max(rect.width, rect.height);
      ink.style.width = `${size}px`;
      ink.style.height = `${size}px`;

      this.appendChild(ink);

      setTimeout(() => {
        ink.remove();
      }, 600);
    });
  });
});
