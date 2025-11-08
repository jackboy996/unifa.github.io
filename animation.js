// Animation and Three.js related functions

// Initialize Three.js scene
function initThreeScene() {
    const canvas = document.getElementById('hero-canvas');
    if(!canvas) return;
    
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    
    const renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        alpha: true,
        antialias: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    
    // Create particles
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 1500;
    
    const posArray = new Float32Array(particlesCount * 3);
    
    for(let i = 0; i < particlesCount * 3; i++) {
        posArray[i] = (Math.random() - 0.5) * 5;
    }
    
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    
    const particlesMaterial = new THREE.PointsMaterial({
        size: 0.005,
        color: 0x0073f5,
        transparent: true,
        opacity: 0.8
    });
    
    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);
    
    camera.position.z = 2;
    
    // Animation
    function animate() {
        requestAnimationFrame(animate);
        
        particlesMesh.rotation.y += 0.001;
        
        renderer.render(scene, camera);
    }
    
    animate();
    
    // Handle resize
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
}

// Animate stats
function animateStats() {
    const stats = {
        projects: {
            element: document.getElementById('stats-projects'),
            target: 125
        },
        volume: {
            element: document.getElementById('stats-volume'),
            target: 50
        },
        users: {
            element: document.getElementById('stats-users'),
            target: 25000
        },
        funds: {
            element: document.getElementById('stats-funds'),
            target: 12
        }
    };
    
    const duration = 2000; // 2 seconds
    const frameRate = 60;
    const totalFrames = duration / (1000 / frameRate);
    
    let frame = 0;
    
    function updateStats() {
        if(frame >= totalFrames) return;
        
        for(const key in stats) {
            const stat = stats[key];
            if(!stat.element) continue;
            
            const progress = frame / totalFrames;
            const current = Math.floor(stat.target * progress);
            
            if(key === 'volume' || key === 'funds') {
                stat.element.textContent = `$${current}M`;
            } else if(key === 'users') {
                stat.element.textContent = current.toLocaleString();
            } else {
                stat.element.textContent = current;
            }
        }
        
        frame++;
        requestAnimationFrame(updateStats);
    }
    
    updateStats();
}

// Animate elements on scroll
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if(entry.isIntersecting) {
                entry.target.classList.add('animate-fadeIn');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1
    });
    
    animatedElements.forEach(element => {
        observer.observe(element);
    });
}
