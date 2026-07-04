/* ============================================
   GUDAS STUDIO - Main JavaScript
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  initHeader();
  initMobileMenu();
  initScrollReveal();
  initGalleryLightbox();
  initScheduleFilters();
  initSmoothScroll();
  initStatCounters();
  initAnnouncementBar();
});

/* --- Header Scroll Effect --- */
function initHeader() {
  const header = document.querySelector('.header');
  if (!header) return;

  const announcementBar = document.querySelector('.announcement-bar');
  let lastScroll = 0;

  function handleScroll() {
    const currentScroll = window.scrollY;
    
    if (currentScroll > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    // Hide announcement bar on scroll and adjust header position
    if (announcementBar) {
      if (currentScroll > 100) {
        announcementBar.classList.add('hidden');
        header.classList.add('announcement-hidden');
      } else {
        announcementBar.classList.remove('hidden');
        header.classList.remove('announcement-hidden');
      }
    }

    lastScroll = currentScroll;
  }

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();
}

/* --- Mobile Menu --- */
function initMobileMenu() {
  const toggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.header__nav');
  const navLinks = document.querySelectorAll('.nav__link');

  if (!toggle || !nav) return;

  toggle.addEventListener('click', () => {
    toggle.classList.toggle('active');
    nav.classList.toggle('open');
    document.body.style.overflow = nav.classList.contains('open') ? 'hidden' : '';
  });

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      toggle.classList.remove('active');
      nav.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
}

/* --- Scroll Reveal Animations --- */
function initScrollReveal() {
  const reveals = document.querySelectorAll('.reveal, .stagger-children');
  if (!reveals.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // Optionally unobserve after revealing
        // observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  });

  reveals.forEach(el => observer.observe(el));
}

/* --- Gallery Lightbox --- */
function initGalleryLightbox() {
  const galleryItems = document.querySelectorAll('.gallery-item');
  const lightbox = document.querySelector('.lightbox');
  
  if (!galleryItems.length || !lightbox) return;

  const lightboxContent = lightbox.querySelector('.lightbox__content');
  const closeBtn = lightbox.querySelector('.lightbox__close');

  galleryItems.forEach(item => {
    item.addEventListener('click', () => {
      const media = item.querySelector('img, video');
      if (!media) return;

      lightboxContent.innerHTML = '';

      if (media.tagName === 'VIDEO') {
        const video = document.createElement('video');
        video.src = media.src || media.querySelector('source')?.src;
        video.controls = true;
        video.autoplay = true;
        video.style.maxWidth = '90%';
        video.style.maxHeight = '90vh';
        video.style.borderRadius = '12px';
        lightboxContent.appendChild(video);
      } else {
        const img = document.createElement('img');
        img.src = media.src;
        img.alt = media.alt || 'GUDAS Studio';
        lightboxContent.appendChild(img);
      }

      lightbox.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });

  // Close lightbox
  if (closeBtn) {
    closeBtn.addEventListener('click', closeLightbox);
  }

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeLightbox();
  });

  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
    // Stop any playing video
    const video = lightboxContent.querySelector('video');
    if (video) video.pause();
  }
}

/* --- Schedule Filters --- */
function initScheduleFilters() {
  const filters = document.querySelectorAll('.schedule-filter');
  const classes = document.querySelectorAll('.schedule-class');

  if (!filters.length) return;

  filters.forEach(filter => {
    filter.addEventListener('click', () => {
      // Update active state
      filters.forEach(f => f.classList.remove('active'));
      filter.classList.add('active');

      const category = filter.dataset.filter;

      classes.forEach(cls => {
        if (category === 'all' || cls.dataset.category === category) {
          cls.style.display = 'block';
          cls.style.opacity = '1';
        } else {
          cls.style.opacity = '0';
          setTimeout(() => {
            cls.style.display = 'none';
          }, 200);
        }
      });
    });
  });
}

/* --- Smooth Scroll --- */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        const headerHeight = document.querySelector('.header')?.offsetHeight || 80;
        const targetPosition = target.getBoundingClientRect().top + window.scrollY - headerHeight;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
}

/* --- Stat Counter Animation --- */
function initStatCounters() {
  const stats = document.querySelectorAll('.stat__number');
  if (!stats.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = entry.target;
        const finalValue = target.dataset.count;
        if (!finalValue) return;

        animateCounter(target, 0, parseInt(finalValue), 2000);
        observer.unobserve(target);
      }
    });
  }, { threshold: 0.5 });

  stats.forEach(stat => observer.observe(stat));
}

function animateCounter(element, start, end, duration) {
  const range = end - start;
  const increment = end > start ? 1 : -1;
  const stepTime = Math.abs(Math.floor(duration / range));
  let current = start;
  const suffix = element.dataset.suffix || '';

  const timer = setInterval(() => {
    current += increment * Math.max(1, Math.floor(range / 60));
    if ((increment > 0 && current >= end) || (increment < 0 && current <= end)) {
      current = end;
      clearInterval(timer);
    }
    element.textContent = current + suffix;
  }, stepTime);
}

/* --- Announcement Bar --- */
function initAnnouncementBar() {
  const bar = document.querySelector('.announcement-bar');
  if (!bar) return;
  
  bar.style.transition = 'transform 0.4s ease, opacity 0.4s ease';
}

/* --- Active Nav Link Highlighter --- */
function highlightActiveNav() {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.nav__link');

  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });
}

// Run immediately
highlightActiveNav();

/* --- Form Validation (basic) --- */
function initContactForm() {
  const form = document.querySelector('.contact-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const inputs = form.querySelectorAll('[required]');
    let valid = true;

    inputs.forEach(input => {
      if (!input.value.trim()) {
        valid = false;
        input.style.borderColor = '#E8956A';
        input.addEventListener('input', () => {
          input.style.borderColor = '';
        }, { once: true });
      }
    });

    if (valid) {
      // Show success message
      const btn = form.querySelector('.btn');
      const originalText = btn.textContent;
      btn.textContent = '¡Mensaje Enviado! ✓';
      btn.style.background = '#27ae60';
      btn.disabled = true;

      setTimeout(() => {
        btn.textContent = originalText;
        btn.style.background = '';
        btn.disabled = false;
        form.reset();
      }, 3000);
    }
  });
}

// Init contact form if on contact page
initContactForm();
