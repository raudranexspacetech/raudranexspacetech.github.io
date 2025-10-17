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


    // --- INTERACTIVE STARFIELD BACKGROUND ---
    const canvas = document.getElementById('starfield');
    if (canvas) { // Check if canvas exists to prevent errors on other pages
        const ctx = canvas.getContext('2d');

        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();

        const stars = [];
        const numStars = 200;
        let mouse = { x: canvas.width / 2, y: canvas.height / 2 };

        for (let i = 0; i < numStars; i++) {
            stars.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                z: Math.random() * canvas.width,
                size: Math.random() * 2 + 1,
                speed: Math.random() * 0.5 + 0.1
            });
        }

        document.addEventListener('mousemove', (e) => {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
        });

        function draw() {
            if (!ctx) return;
            ctx.fillStyle = "#050505";
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            for (let i = 0; i < numStars; i++) {
                let star = stars[i];
                let perspective = canvas.width / (canvas.width + star.z);
                let x = (star.x - canvas.width / 2) * perspective + canvas.width / 2;
                let y = (star.y - canvas.height / 2) * perspective + canvas.height / 2;
                let dx = x - mouse.x;
                let dy = y - mouse.y;
                x -= dx * 0.02;
                y -= dy * 0.02;
                star.z -= star.speed;
                if (star.z < 1) {
                    star.z = canvas.width;
                    star.x = Math.random() * canvas.width;
                    star.y = Math.random() * canvas.height;
                }
                ctx.beginPath();
                ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
                ctx.arc(x, y, star.size * perspective, 0, 2 * Math.PI);
                ctx.fill();
            }
            requestAnimationFrame(draw);
        }
        draw();
    }
});