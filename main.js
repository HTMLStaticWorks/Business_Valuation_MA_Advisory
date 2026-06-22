document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initRTL();
  initStickyHeader();
  initMobileMenu();
  initScrollProgress();
  initScrollToTop();
  initCounters();
  initTestimonialSlider();
  initAccordion();
  initFormValidation();
  initActiveNavLink();
});

// Theme Management
function initTheme() {
  const themeToggle = document.getElementById('theme-toggle');
  if (!themeToggle) return;

  const currentTheme = localStorage.getItem('theme') || 'dark'; // Dark is default for premium luxury feel
  if (currentTheme === 'dark') {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }

  themeToggle.addEventListener('click', () => {
    if (document.documentElement.classList.contains('dark')) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    }
    updateThemeIcon();
  });
  updateThemeIcon();
}

function updateThemeIcon() {
  const themeToggle = document.getElementById('theme-toggle');
  if (!themeToggle) return;
  const isDark = document.documentElement.classList.contains('dark');
  const sunIcon = themeToggle.querySelector('.sun-icon');
  const moonIcon = themeToggle.querySelector('.moon-icon');
  
  if (isDark) {
    if (sunIcon) sunIcon.classList.remove('hidden');
    if (moonIcon) moonIcon.classList.add('hidden');
  } else {
    if (sunIcon) sunIcon.classList.add('hidden');
    if (moonIcon) moonIcon.classList.remove('hidden');
  }
}

// RTL Layout Management
function initRTL() {
  const rtlToggle = document.getElementById('rtl-toggle');
  if (!rtlToggle) return;

  const currentDir = localStorage.getItem('dir') || 'ltr';
  document.documentElement.setAttribute('dir', currentDir);
  updateRTLButtonText(currentDir);

  rtlToggle.addEventListener('click', () => {
    const activeDir = document.documentElement.getAttribute('dir') === 'rtl' ? 'ltr' : 'rtl';
    document.documentElement.setAttribute('dir', activeDir);
    localStorage.setItem('dir', activeDir);
    updateRTLButtonText(activeDir);
    // Reload AOS if present to recalculate coordinates
    if (window.AOS) {
      window.AOS.refresh();
    }
  });
}

function updateRTLButtonText(dir) {
  const rtlToggle = document.getElementById('rtl-toggle');
  if (!rtlToggle) return;
  rtlToggle.textContent = dir === 'rtl' ? 'LTR' : 'RTL';
}

// Sticky Header & Blur
function initStickyHeader() {
  const header = document.getElementById('header');
  if (!header) return;

  const handleScroll = () => {
    if (window.scrollY > 20) {
      header.classList.add('scrolled', 'bg-opacity-80', 'backdrop-blur-md', 'shadow-lg', 'border-b', 'border-slate-200/10');
      header.classList.remove('bg-transparent');
    } else {
      header.classList.remove('scrolled', 'bg-opacity-80', 'backdrop-blur-md', 'shadow-lg', 'border-b', 'border-slate-200/10');
      header.classList.add('bg-transparent');
    }
  };

  window.addEventListener('scroll', handleScroll);
  handleScroll(); // Run on initial load/refresh
}

// Mobile Hamburger Menu
function initMobileMenu() {
  const hamburger = document.getElementById('hamburger-menu');
  const mobileNav = document.getElementById('mobile-nav');
  if (!hamburger || !mobileNav) return;

  hamburger.addEventListener('click', () => {
    const isExpanded = hamburger.getAttribute('aria-expanded') === 'true';
    hamburger.setAttribute('aria-expanded', !isExpanded);
    mobileNav.classList.toggle('hidden');
    mobileNav.classList.toggle('flex');
    
    // Toggle icon if FontAwesome class is present
    const icon = hamburger.querySelector('#hamburger-icon');
    if (icon) {
      if (!isExpanded) {
        icon.classList.remove('fa-bars');
        icon.classList.add('fa-xmark');
      } else {
        icon.classList.remove('fa-xmark');
        icon.classList.add('fa-bars');
      }
    }
  });
}

// Scroll Progress Bar
function initScrollProgress() {
  const progress = document.getElementById('scroll-progress');
  if (!progress) return;

  window.addEventListener('scroll', () => {
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (totalHeight > 0) {
      const percentage = (window.scrollY / totalHeight) * 100;
      progress.style.width = `${percentage}%`;
    }
  });
}

// Scroll To Top Button
function initScrollToTop() {
  const scrollTopBtn = document.getElementById('scroll-to-top');
  if (!scrollTopBtn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      scrollTopBtn.classList.remove('opacity-0', 'pointer-events-none', 'translate-y-4');
      scrollTopBtn.classList.add('opacity-100', 'translate-y-0');
    } else {
      scrollTopBtn.classList.add('opacity-0', 'pointer-events-none', 'translate-y-4');
      scrollTopBtn.classList.remove('opacity-100', 'translate-y-0');
    }
  });

  scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

// Animated Statistics Counters
function initCounters() {
  const counters = document.querySelectorAll('.stat-counter');
  if (counters.length === 0) return;

  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const counterObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const counter = entry.target;
        const target = parseFloat(counter.getAttribute('data-target'));
        const duration = 2000; // 2 seconds animation
        const isDecimal = counter.getAttribute('data-decimal') === 'true';
        const suffix = counter.getAttribute('data-suffix') || '';
        let startTimestamp = null;

        const step = (timestamp) => {
          if (!startTimestamp) startTimestamp = timestamp;
          const progress = Math.min((timestamp - startTimestamp) / duration, 1);
          const currentVal = progress * target;
          
          if (isDecimal) {
            counter.textContent = currentVal.toFixed(1) + suffix;
          } else {
            counter.textContent = Math.floor(currentVal).toLocaleString() + suffix;
          }

          if (progress < 1) {
            window.requestAnimationFrame(step);
          } else {
            if (isDecimal) {
              counter.textContent = target.toFixed(1) + suffix;
            } else {
              counter.textContent = target.toLocaleString() + suffix;
            }
          }
        };

        window.requestAnimationFrame(step);
        observer.unobserve(counter);
      }
    });
  }, observerOptions);

  counters.forEach(counter => counterObserver.observe(counter));
}

// Testimonial Carousel Slider
function initTestimonialSlider() {
  const slider = document.getElementById('testimonial-slider');
  if (!slider) return;

  const slides = slider.querySelectorAll('.testimonial-slide');
  const dotsContainer = document.getElementById('slider-dots');
  let currentIndex = 0;
  let autoPlayInterval;

  if (slides.length === 0) return;

  // Create indicator dots
  if (dotsContainer) {
    dotsContainer.innerHTML = '';
    slides.forEach((_, index) => {
      const dot = document.createElement('button');
      dot.className = `w-3 h-3 rounded-full transition-all duration-300 ${index === 0 ? 'bg-[#c5a880] w-6' : 'bg-slate-400/40 dark:bg-slate-700/60'}`;
      dot.setAttribute('aria-label', `Go to slide ${index + 1}`);
      dot.addEventListener('click', () => {
        goToSlide(index);
        resetAutoPlay();
      });
      dotsContainer.appendChild(dot);
    });
  }

  function goToSlide(index) {
    slides[currentIndex].classList.add('opacity-0', 'hidden');
    slides[currentIndex].classList.remove('opacity-100', 'block');
    
    currentIndex = index;
    
    slides[currentIndex].classList.remove('hidden');
    // Simple delay for smoother fade in transition
    setTimeout(() => {
      slides[currentIndex].classList.add('opacity-100');
    }, 20);

    // Update dots
    if (dotsContainer) {
      const dots = dotsContainer.querySelectorAll('button');
      dots.forEach((dot, idx) => {
        if (idx === currentIndex) {
          dot.classList.add('bg-[#c5a880]', 'w-6');
          dot.classList.remove('bg-slate-400/40', 'dark:bg-slate-700/60');
        } else {
          dot.classList.remove('bg-[#c5a880]', 'w-6');
          dot.classList.add('bg-slate-400/40', 'dark:bg-slate-700/60');
        }
      });
    }
  }

  function startAutoPlay() {
    autoPlayInterval = setInterval(() => {
      const nextIndex = (currentIndex + 1) % slides.length;
      goToSlide(nextIndex);
    }, 5000); // Change slide every 5 seconds
  }

  function resetAutoPlay() {
    clearInterval(autoPlayInterval);
    startAutoPlay();
  }

  // Init first slide view state
  slides.forEach((slide, idx) => {
    if (idx !== 0) {
      slide.classList.add('opacity-0', 'hidden');
    } else {
      slide.classList.add('opacity-100', 'block');
    }
  });

  startAutoPlay();
}

// FAQ Accordion
function initAccordion() {
  const accordionHeaders = document.querySelectorAll('.accordion-header');
  
  accordionHeaders.forEach(header => {
    header.addEventListener('click', () => {
      const content = header.nextElementSibling;
      const icon = header.querySelector('.accordion-icon');
      const isOpen = !content.classList.contains('hidden');

      // Close all other accordion items
      const allHeaders = header.parentElement.parentElement.querySelectorAll('.accordion-header');
      allHeaders.forEach(otherHeader => {
        if (otherHeader !== header) {
          const otherContent = otherHeader.nextElementSibling;
          const otherIcon = otherHeader.querySelector('.accordion-icon');
          otherContent.classList.add('hidden');
          if (otherIcon) otherIcon.classList.remove('rotate-180');
          otherHeader.setAttribute('aria-expanded', 'false');
        }
      });

      // Toggle current item
      if (isOpen) {
        content.classList.add('hidden');
        if (icon) icon.classList.remove('rotate-180');
        header.setAttribute('aria-expanded', 'false');
      } else {
        content.classList.remove('hidden');
        if (icon) icon.classList.add('rotate-180');
        header.setAttribute('aria-expanded', 'true');
      }
    });
  });
}

// Contact Form & Newsletter Validation
function initFormValidation() {
  const forms = document.querySelectorAll('.validated-form');
  
  forms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      let isValid = true;
      
      const inputs = form.querySelectorAll('input[required], textarea[required], select[required]');
      inputs.forEach(input => {
        const errorMsg = input.parentElement.querySelector('.error-message');
        
        // Simple checks
        if (!input.value.trim()) {
          isValid = false;
          input.classList.add('border-red-500');
          if (errorMsg) errorMsg.textContent = 'This field is required';
        } else if (input.type === 'email' && !validateEmail(input.value)) {
          isValid = false;
          input.classList.add('border-red-500');
          if (errorMsg) errorMsg.textContent = 'Please enter a valid email address';
        } else {
          input.classList.remove('border-red-500');
          if (errorMsg) errorMsg.textContent = '';
        }
      });

      // Show success state
      if (isValid) {
        const successBanner = form.querySelector('.form-success-banner');
        if (successBanner) {
          successBanner.classList.remove('hidden');
          form.reset();
          setTimeout(() => {
            successBanner.classList.add('hidden');
          }, 5000);
        } else {
          alert('Form submitted successfully!');
          form.reset();
        }
      }
    });

    // Clear styling on input
    const fields = form.querySelectorAll('input, textarea, select');
    fields.forEach(field => {
      field.addEventListener('input', () => {
        field.classList.remove('border-red-500');
        const errorMsg = field.parentElement.querySelector('.error-message');
        if (errorMsg) errorMsg.textContent = '';
      });
    });
  });
}

function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email.toLowerCase());
}

// Active Nav Link Highlighting
function initActiveNavLink() {
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.nav-link');
  
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPath) {
      link.classList.add('text-[#c5a880]', 'font-semibold');
      link.classList.remove('text-slate-300', 'text-slate-700', 'dark:text-slate-300');
      
      // Underline/active indicator span
      const indicator = link.querySelector('.nav-indicator');
      if (indicator) {
        indicator.classList.remove('scale-x-0');
        indicator.classList.add('scale-x-100');
      }
    }
  });
}
