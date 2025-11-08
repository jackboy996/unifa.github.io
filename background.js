// 背景动画实现
document.addEventListener('DOMContentLoaded', function() {
    // 检查是否已加载Three.js
    if (typeof THREE !== 'undefined') {
        initBackgroundAnimation();
    } else {
        console.warn('Three.js not loaded yet, background animation will not work');
    }
});

function initBackgroundAnimation() {
    // 创建场景
    const scene = new THREE.Scene();
    
    // 创建相机
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;
    
    // 创建渲染器
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    
    // 添加到DOM
    const container = document.getElementById('background-animation');
    if (container) {
        container.appendChild(renderer.domElement);
    } else {
        console.error('Background container not found');
        return;
    }
    
    // 创建粒子系统
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 1500;
    
    const posArray = new Float32Array(particlesCount * 3);
    
    for (let i = 0; i < particlesCount * 3; i++) {
        posArray[i] = (Math.random() - 0.5) * 10;
    }
    
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    
    // 创建材质
    const particlesMaterial = new THREE.PointsMaterial({
        size: 0.02,
        color: 0x0073f5,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending
    });
    
    // 创建粒子系统
    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);
    
    // 创建连接线
    const lineMaterial = new THREE.LineBasicMaterial({ 
        color: 0x5d15f5,
        transparent: true,
        opacity: 0.2
    });
    
    const lineGeometry = new THREE.BufferGeometry();
    const linePositions = new Float32Array(particlesCount * 6); // 每条线两个点，每个点xyz三个坐标
    lineGeometry.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));
    
    const linesMesh = new THREE.LineSegments(lineGeometry, lineMaterial);
    scene.add(linesMesh);
    
    // 动画循环
    function animate() {
        requestAnimationFrame(animate);
        
        particlesMesh.rotation.x += 0.0005;
        particlesMesh.rotation.y += 0.0005;
        
        // 更新连接线
        updateLines();
        
        renderer.render(scene, camera);
    }
    
    // 更新连接线
    function updateLines() {
        const positions = particlesMesh.geometry.attributes.position.array;
        const linePositions = linesMesh.geometry.attributes.position.array;
        
        let lineIndex = 0;
        
        // 寻找最近的粒子并连接
        for (let i = 0; i < particlesCount; i++) {
            const ix = i * 3;
            const x = positions[ix];
            const y = positions[ix + 1];
            const z = positions[ix + 2];
            
            let minDist = 1.5; // 最大连接距离
            let closestParticle = null;
            
            // 检查最近的粒子
            for (let j = i + 1; j < particlesCount; j++) {
                const jx = j * 3;
                const x2 = positions[jx];
                const y2 = positions[jx + 1];
                const z2 = positions[jx + 2];
                
                const dist = Math.sqrt(
                    Math.pow(x - x2, 2) + 
                    Math.pow(y - y2, 2) + 
                    Math.pow(z - z2, 2)
                );
                
                if (dist < minDist) {
                    minDist = dist;
                    closestParticle = j;
                }
            }
            
            // 如果找到最近的粒子，创建连接线
            if (closestParticle !== null && lineIndex < linePositions.length - 6) {
                const jx = closestParticle * 3;
                
                // 第一个点
                linePositions[lineIndex++] = x;
                linePositions[lineIndex++] = y;
                linePositions[lineIndex++] = z;
                
                // 第二个点
                linePositions[lineIndex++] = positions[jx];
                linePositions[lineIndex++] = positions[jx + 1];
                linePositions[lineIndex++] = positions[jx + 2];
            }
        }
        
        linesMesh.geometry.attributes.position.needsUpdate = true;
    }
    
    // 窗口大小调整
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
    
    // 开始动画
    animate();
    
    // 添加鼠标交互
    document.addEventListener('mousemove', (event) => {
        const mouseX = (event.clientX / window.innerWidth) * 2 - 1;
        const mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
        
        // 根据鼠标位置轻微移动粒子系统
        gsap.to(particlesMesh.rotation, {
            x: mouseY * 0.1,
            y: mouseX * 0.1,
            duration: 2
        });
    });
}
