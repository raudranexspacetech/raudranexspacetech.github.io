// Clean Deep Space Scene with Spacecraft
document.addEventListener("DOMContentLoaded", function() {
    const container = document.getElementById('vanta-bg');
    if (!container) return;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 2000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);

    // Camera position
    camera.position.z = 50;
    camera.position.y = 0;

    // Ambient lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight.position.set(10, 10, 10);
    scene.add(directionalLight);

    // Create deep space star field (multiple layers for depth)
    function createStarLayer(count, size, distance, speed) {
        const geometry = new THREE.BufferGeometry();
        const positions = [];
        const colors = [];

        for (let i = 0; i < count; i++) {
            const x = (Math.random() - 0.5) * distance;
            const y = (Math.random() - 0.5) * distance;
            const z = (Math.random() - 0.5) * distance;
            positions.push(x, y, z);

            // Vary star colors (white, blue-white, cyan)
            const colorChoice = Math.random();
            if (colorChoice > 0.7) {
                colors.push(0, 0.85, 1); // Cyan
            } else if (colorChoice > 0.4) {
                colors.push(0.7, 0.9, 1); // Blue-white
            } else {
                colors.push(1, 1, 1); // White
            }
        }

        geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

        const material = new THREE.PointsMaterial({
            size: size,
            vertexColors: true,
            transparent: true,
            opacity: 0.8,
            sizeAttenuation: true
        });

        const stars = new THREE.Points(geometry, material);
        stars.userData = { speed: speed };
        return stars;
    }

    // Create three star layers for depth
    const starLayer1 = createStarLayer(2000, 0.15, 1000, 0.0001);
    const starLayer2 = createStarLayer(1000, 0.25, 500, 0.00015);
    const starLayer3 = createStarLayer(500, 0.4, 300, 0.0002);

    scene.add(starLayer1, starLayer2, starLayer3);

    // Create sleek spacecraft
    function createSpacecraft() {
        const group = new THREE.Group();

        // Main body (elongated)
        const bodyGeometry = new THREE.CylinderGeometry(0.3, 0.5, 3, 8);
        const bodyMaterial = new THREE.MeshPhongMaterial({
            color: 0xcccccc,
            emissive: 0x00d9ff,
            emissiveIntensity: 0.3,
            shininess: 100
        });
        const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
        body.rotation.x = Math.PI / 2;
        group.add(body);

        // Nose cone
        const noseGeometry = new THREE.ConeGeometry(0.3, 1, 8);
        const nose = new THREE.Mesh(noseGeometry, bodyMaterial);
        nose.rotation.x = Math.PI / 2;
        nose.position.z = 2;
        group.add(nose);

        // Wings/Solar panels
        const wingGeometry = new THREE.BoxGeometry(3, 0.05, 0.8);
        const wingMaterial = new THREE.MeshPhongMaterial({
            color: 0x00d9ff,
            emissive: 0x005577,
            transparent: true,
            opacity: 0.8
        });
        const wings = new THREE.Mesh(wingGeometry, wingMaterial);
        wings.position.z = -0.5;
        group.add(wings);

        // Engine glow
        const glowGeometry = new THREE.SphereGeometry(0.4, 16, 16);
        const glowMaterial = new THREE.MeshBasicMaterial({
            color: 0x00d9ff,
            transparent: true,
            opacity: 0.6
        });
        const glow = new THREE.Mesh(glowGeometry, glowMaterial);
        glow.position.z = -1.8;
        glow.scale.set(0.6, 0.6, 1.2);
        group.add(glow);

        return group;
    }

    // Create two spacecraft with different paths
    const spacecraft1 = createSpacecraft();
    const spacecraft2 = createSpacecraft();

    spacecraft1.userData = {
        pathRadius: 60,
        speed: 0.002,
        angle: 0,
        height: 15
    };

    spacecraft2.userData = {
        pathRadius: 80,
        speed: 0.0015,
        angle: Math.PI,
        height: -10
    };

    scene.add(spacecraft1, spacecraft2);

    // Mouse interaction variables
    let mouseX = 0;
    let mouseY = 0;

    document.addEventListener('mousemove', (event) => {
        mouseX = (event.clientX / window.innerWidth - 0.5) * 2;
        mouseY = (event.clientY / window.innerHeight - 0.5) * 2;
    });

    // Animation loop
    function animate() {
        requestAnimationFrame(animate);

        // Rotate star layers for parallax depth
        starLayer1.rotation.y += starLayer1.userData.speed;
        starLayer1.rotation.x += starLayer1.userData.speed * 0.5;

        starLayer2.rotation.y += starLayer2.userData.speed;
        starLayer2.rotation.x -= starLayer2.userData.speed * 0.3;

        starLayer3.rotation.y += starLayer3.userData.speed;

        // Animate spacecraft along paths
        [spacecraft1, spacecraft2].forEach(craft => {
            craft.userData.angle += craft.userData.speed;

            // Circular path with height variation
            craft.position.x = Math.cos(craft.userData.angle) * craft.userData.pathRadius;
            craft.position.z = Math.sin(craft.userData.angle) * craft.userData.pathRadius - 50;
            craft.position.y = craft.userData.height + Math.sin(craft.userData.angle * 2) * 5;

            // Point in direction of travel
            const lookX = Math.cos(craft.userData.angle + 0.1) * craft.userData.pathRadius;
            const lookZ = Math.sin(craft.userData.angle + 0.1) * craft.userData.pathRadius - 50;
            const lookY = craft.userData.height + Math.sin((craft.userData.angle + 0.1) * 2) * 5;
            craft.lookAt(lookX, lookY, lookZ);

            // Subtle rotation for realism
            craft.rotation.z += 0.002;
        });

        // Camera follows mouse slightly (parallax)
        camera.position.x += (mouseX * 10 - camera.position.x) * 0.05;
        camera.position.y += (-mouseY * 5 - camera.position.y) * 0.05;
        camera.lookAt(0, 0, -50);

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
