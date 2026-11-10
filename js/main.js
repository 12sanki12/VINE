document.addEventListener('DOMContentLoaded', () => {
  const sidebar = document.getElementById('sidebar');
  const menuToggle = document.getElementById('mobileMenuToggle');
  const navLinks = [...document.querySelectorAll('.side-nav .nav-link')];

  // Mobile sidebar toggle
  menuToggle?.addEventListener('click', () => {
    const isOpen = sidebar.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', String(isOpen));
    menuToggle.setAttribute('aria-label', isOpen ? 'Close navigation' : 'Open navigation');
    menuToggle.innerHTML = isOpen ? '<i class="bi bi-x-lg"></i>' : '<i class="bi bi-list"></i>';
  });

  // Close mobile navigation after selecting a section
  navLinks.forEach(link => link.addEventListener('click', () => {
    sidebar.classList.remove('open');
    menuToggle?.setAttribute('aria-expanded', 'false');
    if (menuToggle) {
      menuToggle.setAttribute('aria-label', 'Open navigation');
      menuToggle.innerHTML = '<i class="bi bi-list"></i>';
    }
  }));

  // Update active sidebar item as the visitor scrolls
  const sections = [...document.querySelectorAll('.section-anchor')];
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      navLinks.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`);
      });
    });
  }, { rootMargin: '-25% 0px -60% 0px', threshold: 0 });
  sections.forEach(section => observer.observe(section));

  // Team carousel: automatic movement every 3 seconds with manual controls
  const track = document.getElementById('teamTrack');
  const cards = [...document.querySelectorAll('.team-card')];
  const prev = document.getElementById('teamPrev');
  const next = document.getElementById('teamNext');
  const progress = document.getElementById('carouselProgress');
  const carouselWindow = document.querySelector('.team-carousel-window');
  let activeIndex = 0;
  let timer = null;
  let visibleCount = 3;

  function getVisibleCount() {
    if (window.innerWidth <= 767) return 1;
    if (window.innerWidth <= 1200) return 2;
    return 3;
  }
  function maxIndex() {
    return Math.max(0, cards.length - visibleCount);
  }
  function updateCarousel() {
    if (!track || !cards.length) return;
    visibleCount = getVisibleCount();
    activeIndex = Math.min(activeIndex, maxIndex());
    const cardWidth = cards[0].getBoundingClientRect().width;
    const gap = parseFloat(getComputedStyle(track).gap) || 0;
    track.style.transform = `translateX(-${activeIndex * (cardWidth + gap)}px)`;
    if (progress) progress.style.width = `${((activeIndex + 1) / (maxIndex() + 1)) * 100}%`;
    if (prev) prev.disabled = maxIndex() === 0;
    if (next) next.disabled = maxIndex() === 0;
  }
  function moveNext() {
    activeIndex = activeIndex >= maxIndex() ? 0 : activeIndex + 1;
    updateCarousel();
  }
  function movePrev() {
    activeIndex = activeIndex <= 0 ? maxIndex() : activeIndex - 1;
    updateCarousel();
  }
  function startAutoPlay() {
    clearInterval(timer);
    timer = setInterval(moveNext, 3000);
  }
  next?.addEventListener('click', () => { moveNext(); startAutoPlay(); });
  prev?.addEventListener('click', () => { movePrev(); startAutoPlay(); });
  carouselWindow?.addEventListener('mouseenter', () => clearInterval(timer));
  carouselWindow?.addEventListener('mouseleave', startAutoPlay);
  carouselWindow?.addEventListener('focusin', () => clearInterval(timer));
  carouselWindow?.addEventListener('focusout', startAutoPlay);
  window.addEventListener('resize', updateCarousel);
  updateCarousel();
  startAutoPlay();

  // Contact form: opens the visitor's email app with the message addressed to V.I.N.E - Africa
  const form = document.getElementById('contactForm');
  const feedback = document.getElementById('formFeedback');
  form?.addEventListener('submit', event => {
    event.preventDefault();
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
    const name = document.getElementById('fullName').value.trim();
    const email = document.getElementById('email').value.trim();
    const subject = document.getElementById('subject').value.trim() || 'Website enquiry';
    const message = document.getElementById('message').value.trim();
    const body = `${message}\n\n- ${name} (${email})`;
    window.location.href = `mailto:vineafrica2000@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    feedback.classList.remove('error');
    feedback.textContent = `Thank you${name ? `, ${name}` : ''}! Your email app should open with your message ready to send to V.I.N.E - Africa.`;
    form.reset();
  });

  const year = new Date().getFullYear();
  document.getElementById('year').textContent = year;
  document.getElementById('footerYear').textContent = year;
});
