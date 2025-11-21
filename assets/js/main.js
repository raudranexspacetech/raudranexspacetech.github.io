document.addEventListener("DOMContentLoaded", function() {

    // --- GSAP PLUGIN REGISTRATION ---
    gsap.registerPlugin(ScrollTrigger);

    // --- HERO TEXT ANIMATION (runs on page load) ---
    gsap.from("#hero h1, #hero p, #hero .cta-button", {
        opacity: 0,
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