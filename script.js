// Living Portfolio - Interactive JavaScript

// DOM Elements
const loadingScreen = document.getElementById('loadingScreen');
const welcomePopup = document.getElementById('welcomePopup');
const themePanel = document.getElementById('themePanel');
const themeBtns = document.querySelectorAll('.theme-btn');
const modeBtns = document.querySelectorAll('.mode-btn');
const demoModal = document.getElementById('demoModal');
const demoTitle = document.getElementById('demoTitle');
const demoProjectTitle = document.getElementById('demoProjectTitle');
const demoDescription = document.getElementById('demoDescription');
const demoIframe = document.getElementById('demoIframe');
const controlBtns = document.querySelectorAll('.control-btn');
const showcaseItems = document.querySelectorAll('.showcase-item');
const statNumbers = document.querySelectorAll('.stat-number');
const skillProgress = document.querySelectorAll('.skill-progress');

// Geometry Background Elements
let geometryCanvas = null;
let geometryCtx = null;

// State Management
let currentTheme = localStorage.getItem('theme') || 'cosmic';
let currentMode = localStorage.getItem('mode') || 'dark';
let isThemePanelOpen = false;

// Welcome Popup State
let hasShownWelcome = localStorage.getItem('hasShownWelcome') === 'true';
let selectedWelcomeTheme = 'cosmic';
let selectedWelcomeMode = 'dark';

// For testing - uncomment this line to always show welcome popup
// hasShownWelcome = false;

// Geometry Background State
let geometryNodes = [];
let geometryConnections = [];
let mouseX = 0;
let mouseY = 0;
let canvasWidth = 0;
let canvasHeight = 0;

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initializePortfolio();
    
    // Initialize project filtering if on projects page
    if (window.location.pathname.includes('projects.html')) {
        initProjectFiltering();
    }
});

// Main Initialization Function
function initializePortfolio() {
    // Initialize canvas context
    geometryCanvas = document.getElementById('geometryCanvas');
    if (geometryCanvas) {
        geometryCtx = geometryCanvas.getContext('2d');
        console.log('Canvas context initialized:', !!geometryCtx);
    }
    
    // Simulate loading
    setTimeout(() => {
        loadingScreen.style.opacity = '0';
        setTimeout(() => {
            loadingScreen.style.display = 'none';
            
            // Show welcome popup if it's the first visit
            if (!hasShownWelcome) {
                setTimeout(() => {
                    showWelcomePopup();
                }, 500);
            }
        }, 500);
    }, 3000);

    // Initialize all systems
    initThemeSystem();
    initGeometryBackground();
    initShowcase();
    initAnimations();
    initScrollEffects();
    initSkillAnimations();
    initContactForm();
    
    // Add event listeners
    bindEventListeners();
    
    // Start background animations
    startBackgroundAnimations();
}

// Theme System
function initThemeSystem() {
    // Apply saved theme and mode
    applyTheme(currentTheme);
    applyMode(currentMode);
    
    // Update UI to reflect current state
    updateThemeUI();
    updateModeUI();
}

function applyTheme(theme) {
    document.body.setAttribute('data-theme', theme);
    currentTheme = theme;
    localStorage.setItem('theme', theme);
    
    // Update theme buttons
    themeBtns.forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.theme === theme) {
            btn.classList.add('active');
        }
    });
    
    // Recreate geometry nodes with new theme colors
    if (geometryCanvas) {
        createGeometryNodes();
    }
}

function applyMode(mode) {
    document.body.setAttribute('data-mode', mode);
    currentMode = mode;
    localStorage.setItem('mode', mode);
    
    // Update mode buttons
    modeBtns.forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.mode === mode) {
            btn.classList.add('active');
        }
    });
}

function updateThemeUI() {
    themeBtns.forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.theme === currentTheme) {
            btn.classList.add('active');
        }
    });
}

function updateModeUI() {
    modeBtns.forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.mode === currentMode) {
            btn.classList.add('active');
        }
    });
}

// Theme Panel Controls
function toggleThemePanel() {
    isThemePanelOpen = !isThemePanelOpen;
    themePanel.classList.toggle('active', isThemePanelOpen);
}

// Mobile Menu Controls
function toggleMobileMenu() {
    const mobileMenu = document.getElementById('mobileNavMenu');
    mobileMenu.classList.toggle('active');
}

// Geometry Background System
function initGeometryBackground() {
    if (!geometryCanvas) {
        console.error('Canvas element not found');
        return;
    }
    
    // Get canvas context
    if (!geometryCtx) {
        console.error('Canvas context not available');
        return;
    }
    
    console.log('Initializing geometry background...');
    
    // Set canvas size
    resizeCanvas();
    
    // Create initial nodes
    createGeometryNodes();
    
    // Start animation loop
    animateGeometry();
    
    // Add event listeners
    window.addEventListener('resize', resizeCanvas);
    document.addEventListener('mousemove', handleMouseMove);
    
    console.log('Geometry background initialized with', geometryNodes.length, 'nodes');
}

function resizeCanvas() {
    canvasWidth = window.innerWidth;
    canvasHeight = window.innerHeight;
    geometryCanvas.width = canvasWidth;
    geometryCanvas.height = canvasHeight;
}

function createGeometryNodes() {
    geometryNodes = [];
    // Increased node count for more dots
    const isMobile = window.innerWidth < 768;
    const baseCount = isMobile ? 80 : Math.floor((canvasWidth * canvasHeight) / 15000);
    const nodeCount = Math.min(baseCount, isMobile ? 150 : 400);
    
    for (let i = 0; i < nodeCount; i++) {
        geometryNodes.push({
            x: Math.random() * canvasWidth,
            y: Math.random() * canvasHeight,
            vx: (Math.random() - 0.5) * (isMobile ? 0.2 : 0.3),
            vy: (Math.random() - 0.5) * (isMobile ? 0.2 : 0.3),
            size: Math.random() * (isMobile ? 1.5 : 2.5) + 0.5,
            originalSize: Math.random() * (isMobile ? 1.5 : 2.5) + 0.5, // Store original size
            opacity: Math.random() * 0.4 + 0.2,
            type: Math.random() > 0.8 ? 'triangle' : Math.random() > 0.6 ? 'square' : 'circle',
            colorIndex: Math.floor(Math.random() * 4)
        });
    }
    console.log('Created', nodeCount, 'geometry nodes');
}

function handleMouseMove(e) {
    mouseX = e.clientX;
    mouseY = e.clientY;
}

function animateGeometry() {
    // Check if context is available
    if (!geometryCtx || !geometryCanvas) {
        console.error('Canvas context not available for animation');
        return;
    }
    
    // Clear canvas
    geometryCtx.clearRect(0, 0, canvasWidth, canvasHeight);
    
    // Update and draw nodes
    updateGeometryNodes();
    drawGeometryNodes();
    drawGeometryConnections();
    
    // Continue animation
    requestAnimationFrame(animateGeometry);
}

function updateGeometryNodes() {
    geometryNodes.forEach(node => {
        // Update position
        node.x += node.vx;
        node.y += node.vy;
        
        // Bounce off edges
        if (node.x <= 0 || node.x >= canvasWidth) node.vx *= -1;
        if (node.y <= 0 || node.y >= canvasHeight) node.vy *= -1;
        
        // Mouse interaction with growth effect
        const distanceToMouse = Math.sqrt(
            Math.pow(node.x - mouseX, 2) + Math.pow(node.y - mouseY, 2)
        );
        
        if (distanceToMouse < 150) {
            const force = (150 - distanceToMouse) / 150;
            const angle = Math.atan2(node.y - mouseY, node.x - mouseX);
            
            // Gentle repel from mouse
            node.x += Math.cos(angle) * force * 1.5;
            node.y += Math.sin(angle) * force * 1.5;
            
            // Make shapes grow when near mouse - Fixed growth logic
            const growthFactor = 1 + (force * 2); // 1x to 3x size
            node.size = node.originalSize * growthFactor;
            
            // Increase opacity when near mouse
            node.opacity = Math.min(0.9, node.opacity + force * 0.3);
        } else {
            // Gradually return to normal size and opacity
            node.size = node.originalSize + (node.size - node.originalSize) * 0.95;
            node.opacity = Math.max(0.2, node.opacity - 0.01);
        }
    });
}

function drawGeometryNodes() {
    if (!geometryCtx) return;
    
    geometryNodes.forEach(node => {
        geometryCtx.save();
        geometryCtx.globalAlpha = node.opacity;
        
        if (node.type === 'triangle') {
            drawTriangle(node.x, node.y, node.size, node.colorIndex);
        } else if (node.type === 'square') {
            drawSquare(node.x, node.y, node.size, node.colorIndex);
        } else {
            drawCircle(node.x, node.y, node.size, node.colorIndex);
        }
        
        geometryCtx.restore();
    });
}

function drawCircle(x, y, size, colorIndex) {
    if (!geometryCtx) return;
    
    // Add glow effect for larger circles (when near cursor)
    if (size > 2) {
        geometryCtx.shadowColor = getGeometryColor(colorIndex);
        geometryCtx.shadowBlur = size * 0.5;
    }
    
    geometryCtx.beginPath();
    geometryCtx.arc(x, y, size, 0, Math.PI * 2);
    geometryCtx.fillStyle = getGeometryColor(colorIndex);
    geometryCtx.fill();
    
    // Reset shadow
    geometryCtx.shadowBlur = 0;
}

function drawSquare(x, y, size, colorIndex) {
    if (!geometryCtx) return;
    
    // Add glow effect for larger squares (when near cursor)
    if (size > 2) {
        geometryCtx.shadowColor = getGeometryColor(colorIndex);
        geometryCtx.shadowBlur = size * 0.5;
    }
    
    geometryCtx.beginPath();
    geometryCtx.rect(x - size, y - size, size * 2, size * 2);
    geometryCtx.fillStyle = getGeometryColor(colorIndex);
    geometryCtx.fill();
    
    // Reset shadow
    geometryCtx.shadowBlur = 0;
}

function drawTriangle(x, y, size, colorIndex) {
    if (!geometryCtx) return;
    
    // Add glow effect for larger triangles (when near cursor)
    if (size > 2) {
        geometryCtx.shadowColor = getGeometryColor(colorIndex);
        geometryCtx.shadowBlur = size * 0.5;
    }
    
    geometryCtx.beginPath();
    geometryCtx.moveTo(x, y - size);
    geometryCtx.lineTo(x - size * 0.866, y + size * 0.5);
    geometryCtx.lineTo(x + size * 0.866, y + size * 0.5);
    geometryCtx.closePath();
    geometryCtx.fillStyle = getGeometryColor(colorIndex);
    geometryCtx.fill();
    
    // Reset shadow
    geometryCtx.shadowBlur = 0;
}

function drawGeometryConnections() {
    if (!geometryCtx) return;
    
    // Increased connection checks for more visual appeal
    const maxConnections = Math.min(geometryNodes.length, 80);
    
    for (let i = 0; i < maxConnections; i++) {
        for (let j = i + 1; j < maxConnections; j++) {
            const node1 = geometryNodes[i];
            const node2 = geometryNodes[j];
            
            const distance = Math.sqrt(
                Math.pow(node1.x - node2.x, 2) + Math.pow(node1.y - node2.y, 2)
            );
            
            if (distance < 150) {
                const opacity = (150 - distance) / 150 * 0.4;
                geometryCtx.globalAlpha = opacity;
                
                // Use gradient color based on node colors
                const gradient = geometryCtx.createLinearGradient(node1.x, node1.y, node2.x, node2.y);
                const color1 = getGeometryColor(node1.colorIndex);
                const color2 = getGeometryColor(node2.colorIndex);
                gradient.addColorStop(0, color1);
                gradient.addColorStop(1, color2);
                
                geometryCtx.strokeStyle = gradient;
                geometryCtx.lineWidth = 1.2;
                
                geometryCtx.beginPath();
                geometryCtx.moveTo(node1.x, node1.y);
                geometryCtx.lineTo(node2.x, node2.y);
                geometryCtx.stroke();
            }
        }
    }
    
    geometryCtx.globalAlpha = 1;
}

function getGeometryColor(colorIndex = 0) {
    const colors = getThemeColors();
    return colors[colorIndex % colors.length];
}

function getThemeColors() {
    const theme = document.body.getAttribute('data-theme') || 'cosmic';
    const mode = document.body.getAttribute('data-mode') || 'dark';
    
    // Enhanced color schemes with better visibility across themes
    const colorSchemes = {
        cosmic: [
            'rgba(100, 255, 218, 0.8)', // Bright cyan
            'rgba(255, 107, 107, 0.7)', // Bright red
            'rgba(78, 205, 196, 0.8)',  // Bright teal
            'rgba(255, 184, 108, 0.7)'  // Bright orange
        ],
        neon: [
            'rgba(255, 0, 255, 0.8)',   // Bright magenta
            'rgba(0, 255, 255, 0.8)',   // Bright cyan
            'rgba(255, 255, 0, 0.8)',   // Bright yellow
            'rgba(0, 255, 0, 0.7)'      // Bright green
        ],
        minimal: [
            'rgba(0, 123, 255, 0.8)',   // Bright blue
            'rgba(111, 66, 193, 0.7)',  // Purple
            'rgba(40, 167, 69, 0.8)',   // Green
            'rgba(255, 193, 7, 0.7)'    // Yellow
        ],
        retro: [
            'rgba(255, 107, 53, 0.8)',  // Bright orange
            'rgba(247, 147, 30, 0.8)',  // Gold
            'rgba(255, 210, 63, 0.8)',  // Bright yellow
            'rgba(255, 99, 132, 0.7)'   // Pink
        ]
    };
    
    // Light mode adjustments for better visibility
    if (mode === 'light') {
        const lightModeColors = {
            cosmic: [
                'rgba(0, 150, 136, 0.8)',   // Darker teal
                'rgba(198, 40, 40, 0.8)',   // Darker red
                'rgba(0, 121, 107, 0.8)',   // Darker cyan
                'rgba(230, 81, 0, 0.8)'     // Darker orange
            ],
            neon: [
                'rgba(156, 39, 176, 0.8)',  // Darker purple
                'rgba(0, 150, 136, 0.8)',   // Darker cyan
                'rgba(255, 193, 7, 0.8)',   // Darker yellow
                'rgba(76, 175, 80, 0.8)'    // Darker green
            ],
            minimal: [
                'rgba(33, 150, 243, 0.8)',  // Darker blue
                'rgba(156, 39, 176, 0.8)',  // Darker purple
                'rgba(76, 175, 80, 0.8)',   // Darker green
                'rgba(255, 152, 0, 0.8)'    // Darker orange
            ],
            retro: [
                'rgba(230, 81, 0, 0.8)',    // Darker orange
                'rgba(255, 152, 0, 0.8)',   // Darker gold
                'rgba(255, 193, 7, 0.8)',   // Darker yellow
                'rgba(233, 30, 99, 0.8)'    // Darker pink
            ]
        };
        return lightModeColors[theme] || lightModeColors.cosmic;
    }
    
    return colorSchemes[theme] || colorSchemes.cosmic;
}



// Project Showcase
function initShowcase() {
    // Set up filtering
    setupShowcaseFiltering();
    
    // Add hover effects
    addShowcaseHoverEffects();
}

function setupShowcaseFiltering() {
    controlBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const filter = btn.dataset.filter;
            
            // Update active button
            controlBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Filter items
            filterShowcaseItems(filter);
        });
    });
}

function filterShowcaseItems(filter) {
    showcaseItems.forEach(item => {
        const category = item.dataset.category;
        
        if (filter === 'all' || category === filter) {
            item.style.display = 'block';
            item.classList.add('fade-in');
        } else {
            item.style.display = 'none';
        }
    });
}

function addShowcaseHoverEffects() {
    showcaseItems.forEach(item => {
        item.addEventListener('mouseenter', () => {
            // Remove inline styles to let CSS handle the animation
            item.style.transform = '';
            item.classList.add('hover-active');
            console.log('Showcase item hovered - animation should trigger');
        });
        
        item.addEventListener('mouseleave', () => {
            item.classList.remove('hover-active');
            console.log('Showcase item unhovered');
        });
    });
    console.log('Showcase hover effects initialized for', showcaseItems.length, 'items');
}

// Project Demo Modal
function openProjectDemo(projectId) {
    // Navigate to individual project detail page
    const projectData = getProjectData(projectId);
    
    if (projectData) {
        // Create the project detail page URL
        const projectPageUrl = `project-${projectId}.html`;
        
        // Navigate to the project detail page
        window.location.href = projectPageUrl;
    }
}

function closeProjectDemo() {
    demoModal.classList.remove('active');
    document.body.style.overflow = '';
    
    // Clear project image
    const demoImage = document.getElementById('demoImage');
    if (demoImage) {
        demoImage.src = '';
    }
}

function getProjectData(projectId) {
    const projects = {
        homeautomation: {
            title: 'Home Automation System',
            description: 'Smart home automation system built with Arduino and C++ programming. This project demonstrates IoT capabilities and hardware integration for creating intelligent home solutions.',
            demoUrl: 'https://github.com/Harshverma-ui/home-automation',
            liveSite: 'https://home-automation-demo.vercel.app',
            sourceCode: 'https://github.com/Harshverma-ui/home-automation',
            image: 'images/home-automation.jpg'
        },
        selfbalancing: {
            title: 'Self Balancing Car',
            description: 'Autonomous self-balancing vehicle using Raspberry Pi Pico and MicroPython. This robotics project showcases advanced control systems and sensor integration.',
            demoUrl: 'https://github.com/Harshverma-ui/self-balancing-car',
            liveSite: 'https://self-balancing-car.vercel.app',
            sourceCode: 'https://github.com/Harshverma-ui/self-balancing-car',
            image: 'images/self-balancing-car.jpg'
        },
        gesturecar: {
            title: 'Hand Gesture Control Car',
            description: 'Gesture-controlled robotic car using Raspberry Pi Pico and MicroPython. Features computer vision for hand gesture recognition and wireless control.',
            demoUrl: 'https://github.com/Harshverma-ui/gesture-car',
            liveSite: 'https://gesture-car-demo.vercel.app',
            sourceCode: 'https://github.com/Harshverma-ui/gesture-car',
            image: 'images/gesture-car.jpg'
        },
        portfolio: {
            title: 'Interactive Portfolio Website',
            description: 'Modern, responsive portfolio website with interactive themes and animations. Features dynamic content, smooth transitions, and multiple theme options.',
            demoUrl: 'https://github.com/Harshverma-ui/portfolio',
            liveSite: 'https://harsh-verma-portfolio.vercel.app',
            sourceCode: 'https://github.com/Harshverma-ui/portfolio',
            image: 'images/portfolio-website.jpg'
        },
        dataanalysis: {
            title: 'Data Analysis Dashboard',
            description: 'Comprehensive data visualization dashboard using Python and Tableau. Features interactive charts, real-time data updates, and comprehensive analytics.',
            demoUrl: 'https://github.com/Harshverma-ui/data-analysis',
            liveSite: 'https://data-analysis-dashboard.vercel.app',
            sourceCode: 'https://github.com/Harshverma-ui/data-analysis',
            image: 'images/data-analysis.jpg'
        }
    };
    
    return projects[projectId];
}

// Animations and Effects
function initAnimations() {
    // Initialize floating elements
    initFloatingElements();
    
    // Initialize particle system
    initParticleSystem();
}

function initFloatingElements() {
    const floatingElements = document.querySelectorAll('.floating-element');
    
    floatingElements.forEach((element, index) => {
        const speed = parseFloat(element.dataset.speed) || 1;
        const delay = index * 2;
        
        element.style.animationDelay = `${delay}s`;
        element.style.animationDuration = `${20 / speed}s`;
    });
}

function initParticleSystem() {
    // Create dynamic particles
    createParticles();
    
    // Animate particles
    animateParticles();
}

function createParticles() {
    const particleContainer = document.createElement('div');
    particleContainer.className = 'particle-container';
    particleContainer.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: -1;
    `;
    
    // Create fewer particles for minimal animation
    for (let i = 0; i < 8; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.cssText = `
            position: absolute;
            width: 3px;
            height: 3px;
            background: var(--cosmic-accent-primary);
            border-radius: 50%;
            opacity: 0.4;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            animation: particleFloat ${15 + Math.random() * 25}s infinite linear;
        `;
        
        particleContainer.appendChild(particle);
    }
    
    document.body.appendChild(particleContainer);
}

function animateParticles() {
    const particles = document.querySelectorAll('.particle');
    
    particles.forEach(particle => {
        // Minimal mouse interaction
        document.addEventListener('mousemove', (e) => {
            const rect = particle.getBoundingClientRect();
            const particleCenterX = rect.left + rect.width / 2;
            const particleCenterY = rect.top + rect.height / 2;
            
            const distanceToMouse = Math.sqrt(
                Math.pow(particleCenterX - e.clientX, 2) +
                Math.pow(particleCenterY - e.clientY, 2)
            );
            
            if (distanceToMouse < 80) {
                const force = (80 - distanceToMouse) / 80;
                const angle = Math.atan2(
                    particleCenterY - e.clientY,
                    particleCenterX - e.clientX
                );
                
                const offsetX = Math.cos(angle) * force * 15;
                const offsetY = Math.sin(angle) * force * 15;
                
                particle.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
                particle.style.opacity = Math.min(0.8, 0.4 + force * 0.3);
            } else {
                particle.style.transform = 'translate(0, 0)';
                particle.style.opacity = 0.4;
            }
        });
    });
}

// Scroll Effects
function initScrollEffects() {
    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animatedElements = document.querySelectorAll('.showcase-item, .skill-circle, .about-content');
    animatedElements.forEach(el => {
        observer.observe(el);
    });
}

// Skill Animations
function initSkillAnimations() {
    // Animate skill circles
    animateSkillCircles();
    
    // Animate statistics
    animateStatistics();
}

function animateSkillCircles() {
    skillProgress.forEach(progress => {
        const value = parseInt(progress.dataset.value);
        const skill = progress.dataset.skill;
        
        // Create animated progress
        const duration = 2000; // 2 seconds
        const startTime = Date.now();
        
        function updateProgress() {
            const elapsed = Date.now() - startTime;
            const progressPercent = Math.min(elapsed / duration, 1);
            const currentValue = Math.floor(value * progressPercent);
            
            // Update the conic gradient
            const degrees = (currentValue / 100) * 360;
            progress.style.background = `conic-gradient(var(--cosmic-accent-primary) 0deg, var(--cosmic-accent-primary) ${degrees}deg, var(--cosmic-bg-tertiary) ${degrees}deg)`;
            
            if (progressPercent < 1) {
                requestAnimationFrame(updateProgress);
            }
        }
        
        // Start animation when element comes into view
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    updateProgress();
                    observer.unobserve(entry.target);
                }
            });
        });
        
        observer.observe(progress);
    });
}

function animateStatistics() {
    statNumbers.forEach(stat => {
        const target = parseInt(stat.dataset.target);
        const duration = 2000; // 2 seconds
        const startTime = Date.now();
        
        function updateStat() {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const currentValue = Math.floor(target * progress);
            
            stat.textContent = currentValue;
            
            if (progress < 1) {
                requestAnimationFrame(updateStat);
            }
        }
        
        // Start animation when element comes into view
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    updateStat();
                    observer.unobserve(entry.target);
                }
            });
        });
        
        observer.observe(stat);
    });
}

// Background Animations
function startBackgroundAnimations() {
    // Add CSS animations based on theme
    addThemeBasedAnimations();
    
    // Start floating animations
    startFloatingAnimations();
}

function addThemeBasedAnimations() {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes particleFloat {
            0%, 100% { transform: translate(0, 0) rotate(0deg); opacity: 0.6; }
            25% { transform: translate(100px, -50px) rotate(90deg); opacity: 0.8; }
            50% { transform: translate(50px, 100px) rotate(180deg); opacity: 0.4; }
            75% { transform: translate(-50px, -100px) rotate(270deg); opacity: 0.7; }
        }
        
        .floating-element {
            animation: float 20s ease-in-out infinite;
        }
        
        @keyframes float {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            33% { transform: translateY(-20px) rotate(120deg); }
            66% { transform: translateY(20px) rotate(240deg); }
        }
    `;
    
    document.head.appendChild(style);
}

function startFloatingAnimations() {
    const floatingElements = document.querySelectorAll('.floating-element');
    
    floatingElements.forEach((element, index) => {
        const delay = index * 2;
        element.style.animationDelay = `${delay}s`;
    });
}



// Contact Form
function initContactForm() {
    const contactForm = document.querySelector('.contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactSubmit);
    }
}

function handleContactSubmit(e) {
    e.preventDefault();
    
    const name = document.getElementById('contactName').value;
    const email = document.getElementById('contactEmail').value;
    const message = document.getElementById('contactMessage').value;
    
    if (!name || !email || !message) {
        showNotification('Please fill in all fields', 'error');
        return;
    }
    
    // Simulate form submission
    showNotification('Message sent successfully!', 'success');
    
    // Clear form
    document.getElementById('contactName').value = '';
    document.getElementById('contactEmail').value = '';
    document.getElementById('contactMessage').value = '';
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    notification.style.cssText = `
        position: fixed;
        top: 2rem;
        right: 2rem;
        padding: 1rem 2rem;
        background: var(--cosmic-accent-primary);
        color: var(--cosmic-bg-primary);
        border-radius: 10px;
        z-index: 10000;
        animation: slideInRight 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Utility Functions
function scrollToSection(sectionId) {
    // Remove the # if present
    const cleanId = sectionId.replace('#', '');
    const section = document.getElementById(cleanId);
    
    if (section) {
        const offsetTop = section.offsetTop - 80;
        window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
        });
        console.log('Scrolled to section:', cleanId);
    } else {
        console.error('Section not found:', cleanId);
    }
}

// Add this function to handle form submission
function submitContactForm() {
    const name = document.getElementById('contactName').value;
    const email = document.getElementById('contactEmail').value;
    const message = document.getElementById('contactMessage').value;
    
    if (!name || !email || !message) {
        showNotification('Please fill in all fields', 'error');
        return;
    }
    
    // Simulate form submission
    showNotification('Message sent successfully!', 'success');
    
    // Clear form
    document.getElementById('contactName').value = '';
    document.getElementById('contactEmail').value = '';
    document.getElementById('contactMessage').value = '';
}

function toggleFullscreen() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
    } else {
        document.exitFullscreen();
    }
}

// Event Listeners
function bindEventListeners() {
    // Theme button clicks
    themeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const theme = btn.dataset.theme;
            applyTheme(theme);
        });
    });
    
    // Mode button clicks
    modeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const mode = btn.dataset.mode;
            applyMode(mode);
        });
    });
    

    
    // Close modal when clicking outside
    document.addEventListener('click', (e) => {
        if (e.target === demoModal) {
            closeProjectDemo();
        }
    });
    
    // Close modal with Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && demoModal.classList.contains('active')) {
            closeProjectDemo();
        }
    });
    
    // Smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');
    console.log('Found navigation links:', navLinks.length); // Debug log
    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            console.log('Navigation clicked, scrolling to:', targetId); // Debug log
            scrollToSection(targetId);
            
            // Close mobile menu if open
            const mobileMenu = document.getElementById('mobileNavMenu');
            if (mobileMenu && mobileMenu.classList.contains('active')) {
                mobileMenu.classList.remove('active');
            }
        });
    });
    
    // Mobile navigation toggle
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            hamburger.classList.toggle('active');
        });
        
        // Close mobile menu when clicking on a link
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                hamburger.classList.remove('active');
            });
        });
    }
}

// Add CSS for additional animations
const additionalStyles = document.createElement('style');
additionalStyles.textContent = `
    @keyframes slideInRight {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOutRight {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
    
    .notification.success {
        background: var(--cosmic-accent-tertiary);
    }
    
    .notification.error {
        background: var(--cosmic-accent-secondary);
    }
    
    .output-line.error {
        color: var(--cosmic-accent-secondary);
    }
    
    .output-line.success {
        color: var(--cosmic-accent-tertiary);
    }
    
    .output-line.info {
        color: var(--cosmic-accent-primary);
    }
    
    .mobile-nav {
        display: none;
    }
    
    @media (max-width: 768px) {
        .mobile-nav {
            display: block;
        }
        
        .nav-menu.active {
            display: flex;
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            background: var(--cosmic-bg-secondary);
            backdrop-filter: blur(20px);
            border-bottom: 1px solid var(--cosmic-border);
            flex-direction: column;
            padding: 2rem;
            box-shadow: 0 8px 32px var(--cosmic-shadow);
        }
        
        .hamburger.active span:nth-child(1) {
            transform: rotate(45deg) translate(5px, 5px);
        }
        
        .hamburger.active span:nth-child(2) {
            opacity: 0;
        }
        
        .hamburger.active span:nth-child(3) {
            transform: rotate(-45deg) translate(7px, -6px);
        }
    }
`;

document.head.appendChild(additionalStyles);

// Performance optimization
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Optimize scroll events
const optimizedScrollHandler = debounce(() => {
    // Handle scroll-based animations
}, 16);

window.addEventListener('scroll', optimizedScrollHandler);

// Welcome Popup Functions
function showWelcomePopup() {
    welcomePopup.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Set up theme selection
    setupWelcomeThemeSelection();
}

function setupWelcomeThemeSelection() {
    const themeOptions = document.querySelectorAll('.welcome-theme-option');
    const modeOptions = document.querySelectorAll('.welcome-mode-option');
    
    // Theme selection
    themeOptions.forEach(option => {
        option.addEventListener('click', () => {
            // Remove previous selection
            themeOptions.forEach(opt => opt.classList.remove('selected'));
            // Select current option
            option.classList.add('selected');
            selectedWelcomeTheme = option.dataset.theme;
        });
    });
    
    // Mode selection
    modeOptions.forEach(option => {
        option.addEventListener('click', () => {
            // Remove previous selection
            modeOptions.forEach(opt => opt.classList.remove('selected'));
            // Select current option
            option.classList.add('selected');
            selectedWelcomeMode = option.dataset.mode;
        });
    });
    
    // Set default selections
    document.querySelector('[data-theme="cosmic"]').classList.add('selected');
    document.querySelector('[data-mode="dark"]').classList.add('selected');
}

function applyWelcomeSettings() {
    // Apply selected theme and mode
    applyTheme(selectedWelcomeTheme);
    applyMode(selectedWelcomeMode);
    
    // Hide welcome popup
    hideWelcomePopup();
    
    // Mark as shown
    localStorage.setItem('hasShownWelcome', 'true');
    hasShownWelcome = true;
    
    // Show success message
    showNotification('Theme applied successfully! Welcome to my portfolio! 🎉', 'success');
}

function skipWelcomeSetup() {
    // Use default theme (cosmic dark)
    applyTheme('cosmic');
    applyMode('dark');
    
    // Hide welcome popup
    hideWelcomePopup();
    
    // Mark as shown
    localStorage.setItem('hasShownWelcome', 'true');
    hasShownWelcome = true;
    
    // Show message
    showNotification('Using default theme. You can customize anytime! ✨', 'info');
}

function hideWelcomePopup() {
    welcomePopup.classList.remove('active');
    document.body.style.overflow = '';
}

// Function to reset welcome popup (for testing)
function resetWelcomePopup() {
    localStorage.removeItem('hasShownWelcome');
    hasShownWelcome = false;
    showWelcomePopup();
}

// Certificates Functions
function openCertificatesPage() {
    // Open certificates page in a new tab
    const certificatesUrl = 'certificates.html';
    window.open(certificatesUrl, '_blank');
    
    // Show notification
    showNotification('Opening certificates page in new tab! 📜', 'success');
}

function downloadCertificates() {
    // This function can be used to download a PDF version of the portfolio
    // For now, we'll show a notification
    showNotification('Portfolio download feature coming soon! 📥', 'info');
    
    // You can implement actual download functionality here
    // Example: Create a PDF version of the portfolio and trigger download
    // const link = document.createElement('a');
    // link.href = 'portfolio.pdf';
    // link.download = 'Harsh_Verma_Portfolio.pdf';
    // link.click();
}

// Initialize when everything is ready
window.addEventListener('load', () => {
    // Final initialization steps
    console.log('Living Portfolio initialized successfully! 🚀');
    
    // Ensure navigation links work
    ensureNavigationWorks();
    
    // Add some fun interactive elements
    addEasterEggs();
});

// Fallback function to ensure navigation works
function ensureNavigationWorks() {
    // Re-bind navigation links as a fallback
    const allNavLinks = document.querySelectorAll('a[href^="#"]');
    allNavLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            scrollToSection(targetId);
        });
    });
    console.log('Navigation fallback applied to', allNavLinks.length, 'links');
}

function addEasterEggs() {
    // Konami code easter egg
    let konamiCode = [];
    const konamiSequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'KeyB', 'KeyA'];
    
    document.addEventListener('keydown', (e) => {
        konamiCode.push(e.code);
        
        if (konamiCode.length > konamiSequence.length) {
            konamiCode.shift();
        }
        
        if (konamiCode.join(',') === konamiSequence.join(',')) {
            // Trigger special effect
            triggerSpecialEffect();
            konamiCode = [];
        }
    });
}

function triggerSpecialEffect() {
    // Create a fun particle explosion
    const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57'];
    
    for (let i = 0; i < 50; i++) {
        const particle = document.createElement('div');
        particle.style.cssText = `
            position: fixed;
            left: 50%;
            top: 50%;
            width: 10px;
            height: 10px;
            background: ${colors[Math.floor(Math.random() * colors.length)]};
            border-radius: 50%;
            pointer-events: none;
            z-index: 10000;
            animation: particleExplosion 1s ease-out forwards;
        `;
        
        document.body.appendChild(particle);
        
        // Remove particle after animation
        setTimeout(() => {
            if (particle.parentNode) {
                particle.parentNode.removeChild(particle);
            }
        }, 1000);
    }
    
    // Add explosion animation CSS
    const explosionStyle = document.createElement('style');
    explosionStyle.textContent = `
        @keyframes particleExplosion {
            0% {
                transform: translate(-50%, -50%) scale(0);
                opacity: 1;
            }
            100% {
                transform: translate(-50%, -50%) scale(1) translate(${Math.random() * 200 - 100}px, ${Math.random() * 200 - 100}px);
                opacity: 0;
            }
        }
    `;
    
    document.head.appendChild(explosionStyle);
    
    // Remove style after animation
    setTimeout(() => {
        if (explosionStyle.parentNode) {
            explosionStyle.parentNode.removeChild(explosionStyle);
        }
    }, 1000);
}

// Project Filtering Functionality
function initProjectFiltering() {
    const categoryBtns = document.querySelectorAll('.category-btn');
    const projectCards = document.querySelectorAll('.project-card');
    
    categoryBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const category = btn.getAttribute('data-category');
            
            // Update active button
            categoryBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Filter projects
            projectCards.forEach(card => {
                if (category === 'all' || card.getAttribute('data-category') === category) {
                    card.style.display = 'block';
                    card.style.animation = 'fadeInUp 0.6s ease forwards';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
}

// Scroll to Top Function
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}
