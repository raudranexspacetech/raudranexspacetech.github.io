// Custom Three.js Space Scene with Earth, Satellites, and Spacecraft
document.addEventListener("DOMContentLoaded", function() {
    const container = document.getElementById('vanta-bg');
    if (!container) return;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);

    // Camera position
    camera.position.z = 30;
    camera.position.y = 10;
    camera.lookAt(0, 0, 0);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xffffff, 1, 100);
    pointLight.position.set(20, 20, 20);
    scene.add(pointLight);

    // Create Earth
    const earthGeometry = new THREE.SphereGeometry(5, 32, 32);
    const earthMaterial = new THREE.MeshPhongMaterial({
        color: 0x2233ff,
        emissive: 0x112244,
        shininess: 25,
        transparent: true,
        opacity: 0.8
    });
    const earth = new THREE.Mesh(earthGeometry, earthMaterial);
    scene.add(earth);

    // Add atmosphere glow
    const glowGeometry = new THREE.SphereGeometry(5.3, 32, 32);
    const glowMaterial = new THREE.MeshBasicMaterial({
        color: 0x00d9ff,
        transparent: true,
        opacity: 0.15,
        side: THREE.BackSide
    });
    const earthGlow = new THREE.Mesh(glowGeometry, glowMaterial);
    scene.add(earthGlow);

    // Create orbital rings
    function createOrbitRing(radius, color, opacity) {
        const curve = new THREE.EllipseCurve(
            0, 0,
            radius, radius,
            0, 2 * Math.PI,
            false,
            0
        );
        const points = curve.getPoints(100);
        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        const material = new THREE.LineBasicMaterial({
            color: color,
            transparent: true,
            opacity: opacity
        });
        const ellipse = new THREE.Line(geometry, material);
        ellipse.rotation.x = Math.PI / 2;
        return ellipse;
    }

    const orbit1 = createOrbitRing(8, 0x00d9ff, 0.3);
    const orbit2 = createOrbitRing(12, 0x9290c3, 0.25);
    const orbit3 = createOrbitRing(16, 0x00d9ff, 0.2);
    scene.add(orbit1, orbit2, orbit3);

    // Create satellites
    const satellites = [];
    function createSatellite(orbitRadius, speed, size) {
        const geometry = new THREE.BoxGeometry(size, size, size * 2);
        const material = new THREE.MeshPhongMaterial({
            color: 0x00d9ff,
            emissive: 0x005577,
            shininess: 100
        });
        const satellite = new THREE.Mesh(geometry, material);

        // Add solar panels
        const panelGeometry = new THREE.BoxGeometry(size * 2, size * 0.1, size);
        const panelMaterial = new THREE.MeshPhongMaterial({
            color: 0x444444,
            emissive: 0x222222
        });
        const panel1 = new THREE.Mesh(panelGeometry, panelMaterial);
        const panel2 = new THREE.Mesh(panelGeometry, panelMaterial);
        panel1.position.x = size * 1.5;
        panel2.position.x = -size * 1.5;
        satellite.add(panel1, panel2);

        satellite.userData = {
            orbitRadius: orbitRadius,
            speed: speed,
            angle: Math.random() * Math.PI * 2
        };

        satellites.push(satellite);
        scene.add(satellite);
        return satellite;
    }

    // Create multiple satellites
    createSatellite(8, 0.0015, 0.3);
    createSatellite(8, 0.002, 0.25);
    createSatellite(12, 0.001, 0.35);
    createSatellite(12, 0.0012, 0.3);
    createSatellite(16, 0.0008, 0.4);
    createSatellite(16, 0.0006, 0.35);

    // Create spacecraft (moving in different pattern)
    function createSpacecraft(distance) {
        const geometry = new THREE.ConeGeometry(0.3, 1, 4);
        const material = new THREE.MeshPhongMaterial({
            color: 0xffffff,
            emissive: 0x00d9ff,
            shininess: 100
        });
        const spacecraft = new THREE.Mesh(geometry, material);
        spacecraft.userData = {
            distance: distance,
            speed: 0.003,
            angle: Math.random() * Math.PI * 2,
            height: (Math.random() - 0.5) * 10
        };
        scene.add(spacecraft);
        return spacecraft;
    }

    const spacecraft1 = createSpacecraft(20);
    const spacecraft2 = createSpacecraft(25);

    // Create star field
    const starsGeometry = new THREE.BufferGeometry();
    const starsMaterial = new THREE.PointsMaterial({
        color: 0xffffff,
        size: 0.1,
        transparent: true,
        opacity: 0.8
    });

    const starsVertices = [];
    for (let i = 0; i < 1000; i++) {
        const x = (Math.random() - 0.5) * 200;
        const y = (Math.random() - 0.5) * 200;
        const z = (Math.random() - 0.5) * 200;
        starsVertices.push(x, y, z);
    }

    starsGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starsVertices, 3));
    const starField = new THREE.Points(starsGeometry, starsMaterial);
    scene.add(starField);

    // Mouse interaction
    let mouseX = 0;
    let mouseY = 0;
    let targetRotationX = 0;
    let targetRotationY = 0;

    document.addEventListener('mousemove', (event) => {
        mouseX = (event.clientX / window.innerWidth) * 2 - 1;
        mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
    });

    // Animation loop
    function animate() {
        requestAnimationFrame(animate);

        // Rotate Earth
        earth.rotation.y += 0.001;
        earthGlow.rotation.y += 0.001;

        // Rotate orbital rings slowly
        orbit1.rotation.z += 0.0002;
        orbit2.rotation.z -= 0.00015;
        orbit3.rotation.z += 0.0001;

        // Update satellites
        satellites.forEach(satellite => {
            satellite.userData.angle += satellite.userData.speed;
            satellite.position.x = Math.cos(satellite.userData.angle) * satellite.userData.orbitRadius;
            satellite.position.z = Math.sin(satellite.userData.angle) * satellite.userData.orbitRadius;
            satellite.lookAt(earth.position);
            satellite.rotation.y += 0.01;
        });

        // Update spacecraft
        [spacecraft1, spacecraft2].forEach(craft => {
            craft.userData.angle += craft.userData.speed;
            craft.position.x = Math.cos(craft.userData.angle) * craft.userData.distance;
            craft.position.z = Math.sin(craft.userData.angle) * craft.userData.distance;
            craft.position.y = craft.userData.height + Math.sin(craft.userData.angle * 2) * 2;

            // Point spacecraft in direction of movement
            const nextX = Math.cos(craft.userData.angle + 0.1) * craft.userData.distance;
            const nextZ = Math.sin(craft.userData.angle + 0.1) * craft.userData.distance;
            craft.lookAt(nextX, craft.position.y, nextZ);
        });

        // Rotate stars slowly
        starField.rotation.y += 0.0001;

        // Camera interaction with mouse
        targetRotationX = mouseY * 0.3;
        targetRotationY = mouseX * 0.3;

        camera.position.x += (targetRotationY * 30 - camera.position.x) * 0.05;
        camera.position.y += (10 + targetRotationX * 10 - camera.position.y) * 0.05;
        camera.lookAt(0, 0, 0);

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
