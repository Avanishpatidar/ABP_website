// Modern "Floating Dust" Particle System
class ParticleBackground {
    constructor() {
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.mouse = { x: null, y: null, radius: 200 };
        this.particleCount = 60; // Fewer particles for a cleaner look

        this.init();
    }

    init() {
        // Setup canvas
        this.canvas.id = 'particle-canvas';
        this.canvas.style.position = 'fixed';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.canvas.style.width = '100%';
        this.canvas.style.height = '100%';
        this.canvas.style.pointerEvents = 'none';
        this.canvas.style.zIndex = '-1'; // Behind everything
        this.canvas.style.opacity = '0.6'; // Slightly more visible but soft

        // Ensure it's the very first element to stay in background
        document.body.insertBefore(this.canvas, document.body.firstChild);

        this.resize();
        this.createParticles();
        this.setupEventListeners();
        this.animate();
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    createParticles() {
        this.particles = [];
        for (let i = 0; i < this.particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                // Very slow, drift-like movement
                vx: (Math.random() - 0.5) * 0.2,
                vy: (Math.random() - 0.5) * 0.2,
                // Varied sizes for depth (bokeh effect)
                radius: Math.random() * 3 + 1,
                // Alpha for transparency variation
                alpha: Math.random() * 0.5 + 0.1,
                // Pulse effect variables
                pulse: Math.random() * Math.PI * 2,
                pulseSpeed: 0.02 + Math.random() * 0.03
            });
        }
    }

    setupEventListeners() {
        window.addEventListener('resize', () => {
            this.resize();
            this.createParticles();
        });

        window.addEventListener('mousemove', (e) => {
            this.mouse.x = e.x;
            this.mouse.y = e.y;
        });

        window.addEventListener('mouseout', () => {
            this.mouse.x = null;
            this.mouse.y = null;
        });
    }

    drawParticle(p) {
        this.ctx.beginPath();
        this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);

        // Soft white/off-white glow
        this.ctx.fillStyle = `rgba(255, 255, 255, ${p.alpha})`;
        this.ctx.fill();

        // Optional: Very subtle glow for larger particles
        if (p.radius > 2.5) {
            this.ctx.shadowBlur = 10;
            this.ctx.shadowColor = `rgba(255, 255, 255, ${p.alpha * 0.5})`;
        } else {
            this.ctx.shadowBlur = 0;
        }
    }

    updateParticles() {
        this.particles.forEach(p => {
            // Mouse interaction - subtle repulsion/drift
            if (this.mouse.x !== null && this.mouse.y !== null) {
                const dx = p.x - this.mouse.x;
                const dy = p.y - this.mouse.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < this.mouse.radius) {
                    const force = (this.mouse.radius - distance) / this.mouse.radius;
                    const angle = Math.atan2(dy, dx);
                    // Gentle push
                    p.x += Math.cos(angle) * force * 1.5;
                    p.y += Math.sin(angle) * force * 1.5;
                }
            }

            // Constant slow drift
            p.x += p.vx;
            p.y += p.vy;

            // Pulse opacity slightly for "alive" feel
            p.alpha += Math.sin(p.pulse) * 0.005;
            p.pulse += p.pulseSpeed;

            // Clamp alpha
            if (p.alpha < 0.1) p.alpha = 0.1;
            if (p.alpha > 0.6) p.alpha = 0.6;

            // Wrap around screen (infinite space feel)
            if (p.x < -50) p.x = this.canvas.width + 50;
            if (p.x > this.canvas.width + 50) p.x = -50;
            if (p.y < -50) p.y = this.canvas.height + 50;
            if (p.y > this.canvas.height + 50) p.y = -50;
        });
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.updateParticles();

        this.particles.forEach(p => {
            this.drawParticle(p);
        });

        requestAnimationFrame(() => this.animate());
    }
}

// Initialize
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new ParticleBackground();
    });
} else {
    new ParticleBackground();
}
