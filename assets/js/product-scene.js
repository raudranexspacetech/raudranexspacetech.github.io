document.addEventListener('DOMContentLoaded', () => {
    // --- Data for our products ---
    const productData = {
        mayukha: {
            name: "MAYUKHA",
            subtitle: "AF-MPD Thruster",
            image: 'assets/images/mayukha.png',
            details: `<ul><li><strong>Thrust:</strong> 70-95 mN</li><li><strong>ISP:</strong> 1300-1400s</li><li><strong>Fuel:</strong> Ar/Xe/H2</li><li><strong>Power:</strong> 1.0 kW</li></ul>`
        },
        mihira: {
            name: "MIHIRA",
            subtitle: "RF-GRIDDED ION Thruster",
            image: 'assets/images/mihira.png',
            details: `<ul><li><strong>Thrust:</strong> 20-35 mN</li><li><strong>ISP:</strong> ~1050s</li><li><strong>Fuel:</strong> Air/N2</li><li><strong>Power:</strong> 400 W</li></ul>`
        }
    };

    let isModalOpen = false;

    // --- Scene, Camera, Renderer Setup ---
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById('product-scene-container').appendChild(renderer.domElement);
    
    // --- POSITION CAMERA AND ADD LIGHTS ---
    camera.position.set(0, 1.5, 9);
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7); // Add soft white light
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5); // Add a light from the front
    directionalLight.position.set(0, 1, 5);
    scene.add(directionalLight);

    // --- CREATE THE PERSPECTIVE GRID PLANE ---
    const planeGeometry = new THREE.PlaneGeometry(100, 100, 50, 50);
    const planeMaterial = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        wireframe: true,
        transparent: true,
        opacity: 0.15
    });
    const gridPlane = new THREE.Mesh(planeGeometry, planeMaterial);
    gridPlane.rotation.x = -Math.PI / 2; // Lay it flat
    gridPlane.position.y = -2; // Position it below the products
    scene.add(gridPlane);

    // --- CREATE FLOATING PRODUCT PNGs ---
    const productsGroup = new THREE.Group();
    scene.add(productsGroup);
    const loader = new THREE.TextureLoader();
    const productMeshes = [];

    function createProductPlane(data, position) {
        const material = new THREE.MeshBasicMaterial({
            side: THREE.DoubleSide
        });

        const loader = new THREE.TextureLoader();
        loader.load(data.image, function(texture) {
            material.map = texture;
            material.needsUpdate = true;
        }, undefined, function(err) {
            console.error('An error occurred while loading the texture:', err);
        });

        const geometry = new THREE.PlaneGeometry(4, 4);
        const plane = new THREE.Mesh(geometry, material);
        plane.position.copy(position);
        plane.userData = data;
        productsGroup.add(plane);
        productMeshes.push(plane);
    }
    
    createProductPlane(productData.mayukha, new THREE.Vector3(-3, 0.5, 0));
    createProductPlane(productData.mihira, new THREE.Vector3(3, 0.5, 0));

    // --- TOOLTIP FOR HOVER ---
    const tooltip = document.createElement('div');
    tooltip.style.position = 'absolute';
    tooltip.style.backgroundColor = 'rgba(0,0,0,0.8)';
    tooltip.style.color = 'white';
    tooltip.style.padding = '5px 10px';
    tooltip.style.borderRadius = '3px';
    tooltip.style.pointerEvents = 'none';
    tooltip.style.display = 'none';
    document.body.appendChild(tooltip);

    // --- MOUSE INTERACTION & RAYCASTING ---
    const mouse = new THREE.Vector2();
    const raycaster = new THREE.Raycaster();
    let hoveredProduct = null;
    
    window.addEventListener('mousemove', (event) => {
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        tooltip.style.left = `${event.clientX + 15}px`;
        tooltip.style.top = `${event.clientY}px`;
    });

    // --- MODAL HANDLING ---
    const modal = document.getElementById('product-modal');
    const modalBody = document.querySelector('.modal-body');
    const closeModalBtn = document.querySelector('.modal-close-btn');
    function showModal(data) {
        isModalOpen = true;
        hoveredProduct = null; // Prevent re-opening modal on close
        modalBody.innerHTML = `<h2>${data.name}</h2><h3>${data.subtitle}</h3>${data.details}`;
        modal.classList.remove('modal-hidden');
    }
    function hideModal(e) { 
        if (e) e.stopPropagation(); // Prevent click from bubbling to window
        isModalOpen = false;
        modal.classList.add('modal-hidden'); 
    }
    closeModalBtn.addEventListener('click', hideModal);
    modal.addEventListener('click', (e) => { if (e.target === modal) hideModal(e); });

    window.addEventListener('click', () => {
        if (hoveredProduct && !isModalOpen) showModal(hoveredProduct.userData);
    });

    // --- ANIMATION LOOP ---
    function animate() {
        requestAnimationFrame(animate);

        if (!isModalOpen) {
            // Hover detection
            raycaster.setFromCamera(mouse, camera);
            const intersects = raycaster.intersectObjects(productMeshes);
            
            if (intersects.length > 0) {
                const firstIntersect = intersects[0].object;
                if (hoveredProduct !== firstIntersect) {
                    hoveredProduct = firstIntersect;
                    tooltip.textContent = hoveredProduct.userData.name;
                    tooltip.style.display = 'block';
                    document.body.style.cursor = 'pointer';
                }
            } else {
                if (hoveredProduct) {
                    tooltip.style.display = 'none';
                    document.body.style.cursor = 'default';
                    hoveredProduct = null;
                }
            }
            
            // Product animations
            productMeshes.forEach(p => {
                p.scale.x = p.scale.y = p.scale.z = (hoveredProduct === p) ? 1.15 : 1; // Scale up on hover
            });

        }

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