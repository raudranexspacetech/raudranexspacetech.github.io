document.addEventListener("DOMContentLoaded", function() {
    const container = document.getElementById('vanta-bg');
    if (!container) return;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x050505); // Dark background
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 2000);
    const renderer = new THREE.WebGLRenderer({ antialias: true });

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);

    // Camera position
    camera.position.z = 1;

    // Create starfield with depth (stars moving towards camera)
    const starCount = 3000;
    const starGeometry = new THREE.BufferGeometry();
    const positions = [];
    const velocities = [];
    const sizes = [];

    for (let i = 0; i < starCount; i++) {
        // Spread stars in a large cube around the camera
        const x = (Math.random() - 0.5) * 2000;
        const y = (Math.random() - 0.5) * 2000;
        const z = (Math.random() - 0.5) * 2000;
        positions.push(x, y, z);

        // Random velocity for each star
        velocities.push(Math.random() * 2 + 1);

        // Random size
        sizes.push(Math.random() * 2 + 0.5);
    }

    starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    starGeometry.setAttribute('size', new THREE.Float32BufferAttribute(sizes, 1));

    // Create star material
    const starMaterial = new THREE.PointsMaterial({
        color: 0xffffff,
        size: 2,
        transparent: true,
        opacity: 0.8,
        sizeAttenuation: true,
        blending: THREE.AdditiveBlending
    });

    const stars = new THREE.Points(starGeometry, starMaterial);
    scene.add(stars);

    // Store velocities as userData
    stars.userData = { velocities: velocities };

    // Mouse interaction variables
    let mouseX = 0;
    let mouseY = 0;
    let targetMouseX = 0;
    let targetMouseY = 0;

    document.addEventListener('mousemove', (event) => {
        targetMouseX = (event.clientX / window.innerWidth - 0.5) * 2;
        targetMouseY = (event.clientY / window.innerHeight - 0.5) * 2;
    });

    // Animation loop
    function animate() {
        requestAnimationFrame(animate);

        // Smooth mouse following
        mouseX += (targetMouseX - mouseX) * 0.05;
        mouseY += (targetMouseY - mouseY) * 0.05;

        // Move stars towards camera
        const positions = stars.geometry.attributes.position.array;
        const velocities = stars.userData.velocities;

        for (let i = 0; i < starCount; i++) {
            const i3 = i * 3;

            // Move star towards camera (increase z position)
            positions[i3 + 2] += velocities[i];

            // Reset star to back when it passes camera
            if (positions[i3 + 2] > 1000) {
                positions[i3 + 2] = -1000;
                positions[i3] = (Math.random() - 0.5) * 2000;
                positions[i3 + 1] = (Math.random() - 0.5) * 2000;
            }
        }

        stars.geometry.attributes.position.needsUpdate = true;

        // Camera follows mouse for parallax effect
        camera.position.x = mouseX * 50;
        camera.position.y = -mouseY * 50;
        camera.lookAt(0, 0, 0);

        // Subtle rotation based on mouse
        stars.rotation.z = mouseX * 0.05;

        renderer.render(scene, camera);
    }

    animate();

    // Handle window resize
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
});
