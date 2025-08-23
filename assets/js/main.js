/**
* Template Name: UpConstruction
* Template URL: https://bootstrapmade.com/upconstruction-bootstrap-construction-website-template/
* Updated: Aug 07 2024 with Bootstrap v5.3.3
* Author: BootstrapMade.com
* License: https://bootstrapmade.com/license/
*/

(function() {
  "use strict";

  /**
   * Apply .scrolled class to the body as the page is scrolled down
   */
  function toggleScrolled() {
    const selectBody = document.querySelector('body');
    const selectHeader = document.querySelector('#header');
    if (!selectHeader.classList.contains('scroll-up-sticky') && !selectHeader.classList.contains('sticky-top') && !selectHeader.classList.contains('fixed-top')) return;
    window.scrollY > 100 ? selectBody.classList.add('scrolled') : selectBody.classList.remove('scrolled');
  }

  document.addEventListener('scroll', toggleScrolled);
  window.addEventListener('load', toggleScrolled);

  /**
   * Mobile nav toggle
   */
  const mobileNavToggleBtn = document.querySelector('.mobile-nav-toggle');

  function mobileNavToogle() {
    document.querySelector('body').classList.toggle('mobile-nav-active');
    mobileNavToggleBtn.classList.toggle('bi-list');
    mobileNavToggleBtn.classList.toggle('bi-x');
  }
  mobileNavToggleBtn.addEventListener('click', mobileNavToogle);

  /**
   * Hide mobile nav on same-page/hash links
   */
  document.querySelectorAll('#navmenu a').forEach(navmenu => {
    navmenu.addEventListener('click', () => {
      if (document.querySelector('.mobile-nav-active')) {
        mobileNavToogle();
      }
    });

  });

  /**
   * Toggle mobile nav dropdowns
   */
  document.querySelectorAll('.navmenu .toggle-dropdown').forEach(navmenu => {
    navmenu.addEventListener('click', function(e) {
      e.preventDefault();
      this.parentNode.classList.toggle('active');
      this.parentNode.nextElementSibling.classList.toggle('dropdown-active');
      e.stopImmediatePropagation();
    });
  });

  /**
   * Preloader
   */
  const preloader = document.querySelector('#preloader');
  if (preloader) {
    window.addEventListener('load', () => {
      preloader.remove();
    });
  }

  /**
   * Scroll top button
   */
  let scrollTop = document.querySelector('.scroll-top');

  function toggleScrollTop() {
    if (scrollTop) {
      window.scrollY > 100 ? scrollTop.classList.add('active') : scrollTop.classList.remove('active');
    }
  }
  scrollTop.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });

  window.addEventListener('load', toggleScrollTop);
  document.addEventListener('scroll', toggleScrollTop);

  /**
   * Animation on scroll function and init
   */
  function aosInit() {
    AOS.init({
      duration: 600,
      easing: 'ease-in-out',
      once: true,
      mirror: false
    });
  }
  window.addEventListener('load', aosInit);

  /**
   * Initiate glightbox
   */
  const glightbox = GLightbox({
    selector: '.glightbox'
  });

  /**
   * Init isotope layout and filters
   */
  document.querySelectorAll('.isotope-layout').forEach(function(isotopeItem) {
    let layout = isotopeItem.getAttribute('data-layout') ?? 'masonry';
    let filter = isotopeItem.getAttribute('data-default-filter') ?? '*';
    let sort = isotopeItem.getAttribute('data-sort') ?? 'original-order';

    let initIsotope;
    let container = isotopeItem.querySelector('.isotope-container');
    
    // Initialize Isotope regardless of imagesLoaded to handle empty containers
    function initializeIsotope() {
      initIsotope = new Isotope(container, {
        itemSelector: '.isotope-item',
        layoutMode: layout,
        filter: filter,
        sortBy: sort
      });
    }

    // Try to initialize with imagesLoaded, but fallback to immediate initialization
    if (container.querySelectorAll('.isotope-item').length > 0) {
      imagesLoaded(container, function() {
        initializeIsotope();
      });
    } else {
      // Initialize immediately for empty containers
      setTimeout(initializeIsotope, 100);
    }

    isotopeItem.querySelectorAll('.isotope-filters li').forEach(function(filters) {
      filters.addEventListener('click', function() {
        isotopeItem.querySelector('.isotope-filters .filter-active').classList.remove('filter-active');
        this.classList.add('filter-active');
        if (initIsotope) {
          initIsotope.arrange({
            filter: this.getAttribute('data-filter')
          });
          if (typeof aosInit === 'function') {
            aosInit();
          }
        }
      }, false);
    });

  });

  /**
   * Init swiper sliders
   */
  function initSwiper() {
    document.querySelectorAll(".init-swiper").forEach(function(swiperElement) {
      let config = JSON.parse(
        swiperElement.querySelector(".swiper-config").innerHTML.trim()
      );

      if (swiperElement.classList.contains("swiper-tab")) {
        initSwiperWithCustomPagination(swiperElement, config);
      } else {
        new Swiper(swiperElement, config);
      }
    });
  }

  window.addEventListener("load", initSwiper);

  /**
   * Initiate Pure Counter
   */

  // Replace with your WhatsApp number (international format, no '+' or dashes)
var phoneNumber = "233241197078";

// Prefilled message (encoded)
var message = encodeURIComponent("Hello, I need assistance");

// Create the full WhatsApp URL
var whatsappLink = "https://whatsapp.com/dl/";

// Assign the link to the button if it exists
var chatButton = document.getElementById("chat-button");
if (chatButton) {
  chatButton.href = 'https://whatsapp.com/dl/';
}

  new PureCounter();

  // EmailJS initialization moved to firebase-config.js

  /**
   * Contact Form Submission with EmailJS
   */
  const contactForm = document.getElementById('firebaseContactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const formData = new FormData(this);
      const loading = this.querySelector('.loading');
      const errorMessage = this.querySelector('.error-message');
      const sentMessage = this.querySelector('.sent-message');

      // Show loading
      loading.style.display = 'block';
      if (errorMessage) errorMessage.style.display = 'none';
      if (sentMessage) sentMessage.style.display = 'none';

      // Send email using EmailJS via firebase-config.js
      sendEmailJS(formData)
      .then(function() {
        loading.style.display = 'none';
        if (sentMessage) sentMessage.style.display = 'block';
        contactForm.reset();
      }, function(error) {
        loading.style.display = 'none';
        if (errorMessage) {
          errorMessage.textContent = 'Failed to send message. Please try again: ' + error.text;
          errorMessage.style.display = 'block';
        }
        console.error('EmailJS error:', error);
      });
    });
  }

  /**
   * Quote Form Submission with Firebase EmailJS
   */
  const quoteForm = document.getElementById('firebaseQuoteForm');
  if (quoteForm) {
    quoteForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Show loading
      const loading = quoteForm.querySelector('.loading');
      const errorMessage = quoteForm.querySelector('.error-message');
      const sentMessage = quoteForm.querySelector('.sent-message');
      
      loading.style.display = 'block';
      errorMessage.style.display = 'none';
      sentMessage.style.display = 'none';

      const formData = new FormData(quoteForm);
      
      sendQuoteEmailJS(formData)
        .then(function(response) {
          console.log('SUCCESS!', response.status, response.text);
          loading.style.display = 'none';
          sentMessage.style.display = 'block';
          quoteForm.reset();
        }, function(error) {
          console.log('FAILED...', error);
          loading.style.display = 'none';
          errorMessage.style.display = 'block';
          errorMessage.textContent = 'Failed to send quote request. Please try again or contact us directly at info.moxieghana@gmail.com';
        });
    });
  }

})();