document.addEventListener("DOMContentLoaded", function() {

    // --- GSAP PLUGIN REGISTRATION ---
    gsap.registerPlugin(ScrollTrigger);

    // --- HERO TEXT ANIMATION (runs on page load) ---
    gsap.from("#hero h1, #hero p, #hero .cta-button", {
        opacity: 0.5,
        y: 50,
        duration: 1,
        stagger: 0.3,
        ease: "power3.out"
    });

    // --- SCROLL-BASED ANIMATION FOR PARTNERS SECTION ---
    gsap.from("#partners", {
        scrollTrigger: {
            trigger: "#partners", // The element that triggers the animation
            start: "top 80%",    // Start animation when the top of #partners is 80% from the top of the viewport
            toggleActions: "play none none none" // Play the animation once when it enters
        },
        opacity: 0,        // Start transparent
        y: 100,            // Start 100px down
        duration: 1.5,       // Animate over 1.5 seconds
        ease: "power3.out"
    });
});

document.addEventListener('DOMContentLoaded', () => {
  const links = document.querySelectorAll('.main-nav ul li a');
  let currentPath = window.location.pathname;
  if(currentPath=='/') currentPath="/index.html";
  links.forEach(link => {
    if (link['href'].includes(currentPath)) {      
      link.classList.add('active');
    }
  });
});



// Hamburger Menu Toggle
const hamburger = document.querySelector('.hamburger');
const nav = document.querySelector('.main-nav');
const menuOverlay = document.createElement('div');
menuOverlay.className = 'menu-overlay';

document.body.appendChild(menuOverlay);

hamburger.addEventListener('click', () => {
    const isActive = nav.classList.contains('active');
    
    hamburger.setAttribute('aria-expanded', !isActive);
    hamburger.classList.toggle('active');
    nav.classList.toggle('active');
    menuOverlay.classList.toggle('active');
    document.body.classList.toggle('menu-open');
});

// Close menu on overlay click or escape
menuOverlay.addEventListener('click', () => {
    hamburger.click();
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && nav.classList.contains('active')) {
        hamburger.click();
    }
});

// Close menu on nav link click
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.click();
    });
});
