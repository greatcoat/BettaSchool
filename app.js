/**
 * BettaSchool - Interactive Motion & Watercolor Background
 */

document.addEventListener('DOMContentLoaded', () => {
    
    // ==========================================================================
    // 1. Mobile Menu Toggle (Tailwind Compatible)
    // ==========================================================================
    const mobileNavToggle = document.getElementById('mobile-menu-btn');
    const studioNav = document.getElementById('nav-menu');
    
    if (mobileNavToggle && studioNav) {
        mobileNavToggle.addEventListener('click', () => {
            const isExpanded = mobileNavToggle.getAttribute('aria-expanded') === 'true';
            mobileNavToggle.setAttribute('aria-expanded', !isExpanded);
            mobileNavToggle.classList.toggle('active');
            
            // Toggle Tailwind layout classes dynamically
            studioNav.classList.toggle('hidden');
            studioNav.classList.toggle('flex');
            studioNav.classList.toggle('flex-col');
            studioNav.classList.toggle('absolute');
            studioNav.classList.toggle('top-full');
            studioNav.classList.toggle('left-0');
            studioNav.classList.toggle('w-full');
            studioNav.classList.toggle('bg-surface-bright');
            studioNav.classList.toggle('p-6');
            studioNav.classList.toggle('border-b');
            studioNav.classList.toggle('border-outline-variant/20');
            studioNav.classList.toggle('shadow-md');
            studioNav.classList.toggle('z-50');
            studioNav.classList.toggle('gap-4');
        });

        // Close menu when nav links are clicked on mobile
        const navLinks = studioNav.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileNavToggle.setAttribute('aria-expanded', 'false');
                mobileNavToggle.classList.remove('active');
                
                studioNav.classList.add('hidden');
                studioNav.classList.remove('flex', 'flex-col', 'absolute', 'top-full', 'left-0', 'w-full', 'bg-surface-bright', 'p-6', 'border-b', 'border-outline-variant/20', 'shadow-md', 'z-50', 'gap-4');
            });
        });
    }

    // ==========================================================================
    // 2. Header Scroll Effect
    // ==========================================================================
    const header = document.querySelector('header');
    
    const handleScroll = () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });

    // ==========================================================================
    // 3. Floating Art Supplies Parallax & Tilt
    // ==========================================================================
    const artSupplies = document.querySelectorAll('.art-supply');
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;
    
    window.addEventListener('mousemove', (e) => {
        targetX = (e.clientX - window.innerWidth / 2) / (window.innerWidth / 2);
        targetY = (e.clientY - window.innerHeight / 2) / (window.innerHeight / 2);
    }, { passive: true });
    
    const updateParallax = () => {
        mouseX += (targetX - mouseX) * 0.08;
        mouseY += (targetY - mouseY) * 0.08;
        
        const scrollY = window.scrollY;
        
        artSupplies.forEach(supply => {
            const speed = parseFloat(supply.getAttribute('data-speed')) || 1;
            const rotationOffset = parseFloat(supply.getAttribute('data-rotation')) || 0;
            
            const moveX = mouseX * speed * 25;
            const moveY = mouseY * speed * 25;
            const scrollOffset = scrollY * speed * 0.15;
            const currentRotation = rotationOffset + (mouseX * speed * 8);
            
            supply.style.transform = `translate3d(${moveX}px, ${moveY + scrollOffset}px, 0) rotate(${currentRotation}deg)`;
        });
        
        requestAnimationFrame(updateParallax);
    };
    
    if (window.matchMedia('(pointer: fine)').matches) {
        updateParallax();
    }

    // ==========================================================================
    // 4. HTML5 Canvas Watercolor Paint Engine
    // ==========================================================================
    const canvas = document.getElementById('paint-canvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    let particles = [];
    let lastPaintTime = 0;
    let activeColorIndex = 0;
    
    // Updated BettaSchool Colors in RGBA format
    const paintColors = [
        { r: 153, g: 65,  b: 36  }, // Primary (Terracotta Red-Brown)
        { r: 79,  g: 100, b: 67  }, // Secondary (Sage Green)
        { r: 52,  g: 99,  b: 107 }, // Tertiary (Teal)
        { r: 240, g: 237, b: 233 }  // Surface Container (Warm Sand Shadow)
    ];
    
    const resizeCanvas = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    };
    
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    
    class WatercolorParticle {
        constructor(x, y, color) {
            this.x = x;
            this.y = y;
            this.color = color;
            this.radius = Math.random() * 15 + 10;
            this.targetRadius = Math.random() * 60 + 50;
            this.maxOpacity = Math.random() * 0.18 + 0.08;
            this.opacity = this.maxOpacity;
            this.life = 1.0;
            this.decay = Math.random() * 0.003 + 0.0015;
            this.growthSpeed = Math.random() * 0.03 + 0.015;
            
            this.points = [];
            const numPoints = Math.floor(Math.random() * 5) + 6;
            for (let i = 0; i < numPoints; i++) {
                this.points.push({
                    angle: (i / numPoints) * Math.PI * 2,
                    offset: Math.random() * 0.25 - 0.125
                });
            }
        }
        
        update() {
            if (this.radius < this.targetRadius) {
                this.radius += (this.targetRadius - this.radius) * this.growthSpeed;
            }
            
            this.life -= this.decay;
            if (this.life <= 0) {
                this.life = 0;
                return false;
            }
            
            if (this.life > 0.8) {
                this.opacity = this.maxOpacity * ((1 - this.life) / 0.2);
            } else {
                this.opacity = this.maxOpacity * (this.life / 0.8);
            }
            
            return true;
        }
        
        draw(context) {
            context.save();
            
            const grad = context.createRadialGradient(
                this.x, this.y, this.radius * 0.1,
                this.x, this.y, this.radius
            );
            
            const r = this.color.r;
            const g = this.color.g;
            const b = this.color.b;
            
            grad.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${this.opacity})`);
            grad.addColorStop(0.5, `rgba(${r}, ${g}, ${b}, ${this.opacity * 0.6})`);
            grad.addColorStop(0.85, `rgba(${r}, ${g}, ${b}, ${this.opacity * 0.15})`);
            grad.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);
            
            context.fillStyle = grad;
            
            context.beginPath();
            this.points.forEach((pt, index) => {
                const curRadius = this.radius * (1 + pt.offset);
                const px = this.x + Math.cos(pt.angle) * curRadius;
                const py = this.y + Math.sin(pt.angle) * curRadius;
                
                if (index === 0) {
                    context.moveTo(px, py);
                } else {
                    context.lineTo(px, py);
                }
            });
            context.closePath();
            context.fill();
            
            context.restore();
        }
    }
    
    const addPaint = (x, y) => {
        const now = Date.now();
        if (now - lastPaintTime < 25) return;
        lastPaintTime = now;
        
        const activeColor = paintColors[activeColorIndex];
        
        particles.push(new WatercolorParticle(x, y, activeColor));
        if (Math.random() < 0.3) {
            const ox = x + (Math.random() * 30 - 15);
            const oy = y + (Math.random() * 30 - 15);
            particles.push(new WatercolorParticle(ox, oy, activeColor));
        }
        
        if (Math.random() < 0.05) {
            activeColorIndex = (activeColorIndex + 1) % paintColors.length;
        }
    };
    
    window.addEventListener('mousemove', (e) => {
        addPaint(e.clientX, e.clientY);
    }, { passive: true });
    
    window.addEventListener('touchmove', (e) => {
        if (e.touches.length > 0) {
            addPaint(e.touches[0].clientX, e.touches[0].clientY);
        }
    }, { passive: true });
    
    const drawAmbientBlobs = () => {
        particles.push(new WatercolorParticle(
            window.innerWidth * 0.15,
            window.innerHeight * 0.25,
            paintColors[1] // Sage
        ));
        particles.push(new WatercolorParticle(
            window.innerWidth * 0.8,
            window.innerHeight * 0.6,
            paintColors[0] // Terracotta
        ));
    };
    
    drawAmbientBlobs();
    
    let idleTimer;
    const resetIdleTimer = () => {
        clearTimeout(idleTimer);
        idleTimer = setTimeout(() => {
            const rx = Math.random() * window.innerWidth;
            const ry = Math.random() * window.innerHeight;
            const randomColor = paintColors[Math.floor(Math.random() * paintColors.length)];
            
            const bloom = new WatercolorParticle(rx, ry, randomColor);
            bloom.maxOpacity = Math.random() * 0.05 + 0.03;
            bloom.targetRadius = Math.random() * 120 + 80;
            particles.push(bloom);
            
            resetIdleTimer();
        }, Math.random() * 6000 + 4000);
    };
    
    window.addEventListener('mousemove', resetIdleTimer, { passive: true });
    window.addEventListener('touchmove', resetIdleTimer, { passive: true });
    resetIdleTimer();
    
    const drawLoop = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Use multiply composition for realistic watercolor color mixing dynamics
        ctx.globalCompositeOperation = 'multiply';
        
        particles = particles.filter(p => {
            const isAlive = p.update();
            if (isAlive) {
                p.draw(ctx);
            }
            return isAlive;
        });
        
        requestAnimationFrame(drawLoop);
    };
    
    drawLoop();

    // ==========================================================================
    // 5. Scroll Reveal Observer
    // ==========================================================================
    const revealElements = document.querySelectorAll('.reveal');
    
    if ('IntersectionObserver' in window) {
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.08,
            rootMargin: '0px 0px -40px 0px'
        });
        
        revealElements.forEach(el => revealObserver.observe(el));
    } else {
        revealElements.forEach(el => el.classList.add('active'));
    }
});
