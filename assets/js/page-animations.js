document.addEventListener("DOMContentLoaded", function() {
    gsap.registerPlugin(ScrollTrigger);

    gsap.from(".page-hero h1", {
        opacity: 0,
        y: 50,
        duration: 1,
        ease: "power3.out"
    });

    gsap.from(".page-hero p", {
        opacity: 0,
        y: 30,
        duration: 1,
        delay: 0.2,
        ease: "power3.out"
    });

    gsap.from(".content-section", {
        scrollTrigger: {
            trigger: ".content-section",
            start: "top 80%",
            toggleActions: "play none none none"
        },
        opacity: 0,
        y: 50,
        duration: 0.8,
        stagger: 0.2,
        ease: "power3.out"
    });

    gsap.from(".tech-card, .benefit, .job-card, .update-card", {
        scrollTrigger: {
            trigger: ".tech-grid, .benefits-grid, .jobs-list, .updates-grid",
            start: "top 80%",
            toggleActions: "play none none none"
        },
        opacity: 0,
        y: 30,
        duration: 0.6,
        stagger: 0.1,
        ease: "power3.out"
    });

    const canvas = document.getElementById('starfield');
    if (canvas) {
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
