/* ============================================
   PORTFOLIO – MAIN JAVASCRIPT
   Abhishek Prasad | AI/ML Engineer
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
    initParticles();
    initCustomCursor();
    initNavbar();
    initTypingEffect();
    initScrollReveal();
    initCountUp();
    initNeuralNetwork();
    initContactForm();
    initSmoothScroll();
    initTiltEffect();
    initLightbox();
});

/* ============================================
   1. PARTICLE BACKGROUND
   ============================================ */
function initParticles() {
    const canvas = document.getElementById('particle-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let width, height, particles, mouse;

    mouse = { x: null, y: null, radius: 150 };

    function resize() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    }

    class Particle {
        constructor() {
            this.reset();
        }

        reset() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.size = Math.random() * 2 + 0.5;
            this.speedX = (Math.random() - 0.5) * 0.5;
            this.speedY = (Math.random() - 0.5) * 0.5;
            this.opacity = Math.random() * 0.5 + 0.1;
            // AI-themed colors
            const colors = [
                '124, 58, 237',   // Purple
                '6, 182, 212',    // Cyan
                '16, 185, 129',   // Emerald
                '167, 139, 250',  // Light purple
            ];
            this.color = colors[Math.floor(Math.random() * colors.length)];
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;

            // Mouse interaction
            if (mouse.x !== null) {
                const dx = mouse.x - this.x;
                const dy = mouse.y - this.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < mouse.radius) {
                    const force = (mouse.radius - dist) / mouse.radius;
                    this.x -= dx * force * 0.02;
                    this.y -= dy * force * 0.02;
                }
            }

            // Wrap around
            if (this.x < 0) this.x = width;
            if (this.x > width) this.x = 0;
            if (this.y < 0) this.y = height;
            if (this.y > height) this.y = 0;
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${this.color}, ${this.opacity})`;
            ctx.fill();
        }
    }

    function createParticles() {
        const count = Math.min(Math.floor((width * height) / 12000), 120);
        particles = Array.from({ length: count }, () => new Particle());
    }

    function drawConnections() {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < 120) {
                    const opacity = (1 - dist / 120) * 0.15;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `rgba(124, 58, 237, ${opacity})`;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            }
        }
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        drawConnections();
        requestAnimationFrame(animate);
    }

    resize();
    createParticles();
    animate();

    window.addEventListener('resize', () => {
        resize();
        createParticles();
    });

    window.addEventListener('mousemove', e => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });

    window.addEventListener('mouseout', () => {
        mouse.x = null;
        mouse.y = null;
    });
}

/* ============================================
   2. CUSTOM CURSOR
   ============================================ */
function initCustomCursor() {
    const dot = document.getElementById('cursor-dot');
    const outline = document.getElementById('cursor-outline');
    if (!dot || !outline) return;

    // Check for touch device
    if ('ontouchstart' in window) {
        dot.style.display = 'none';
        outline.style.display = 'none';
        document.body.style.cursor = 'auto';
        return;
    }

    let mouseX = 0, mouseY = 0;
    let outlineX = 0, outlineY = 0;

    document.addEventListener('mousemove', e => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        dot.style.left = mouseX + 'px';
        dot.style.top = mouseY + 'px';
    });

    function animateOutline() {
        outlineX += (mouseX - outlineX) * 0.15;
        outlineY += (mouseY - outlineY) * 0.15;
        outline.style.left = outlineX + 'px';
        outline.style.top = outlineY + 'px';
        requestAnimationFrame(animateOutline);
    }
    animateOutline();

    // Hover effect on interactive elements
    const hoverTargets = document.querySelectorAll('a, button, .project-card, .skill-chip, .info-item, .contact-item, .timeline-card, .social-link, .gallery-img-wrapper, .gallery-item');
    hoverTargets.forEach(el => {
        el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
        el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
    });
}

/* ============================================
   3. GLASSMORPHISM NAVBAR
   ============================================ */
function initNavbar() {
    const navbar = document.getElementById('navbar');
    const toggle = document.getElementById('nav-toggle');
    const links = document.getElementById('nav-links');
    const navAnchors = document.querySelectorAll('.nav-link');

    // Scroll effect
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;

        if (scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        lastScroll = scrollY;

        // Active section highlighting
        updateActiveNavLink();
    });

    // Mobile toggle
    toggle.addEventListener('click', () => {
        toggle.classList.toggle('active');
        links.classList.toggle('active');
    });

    // Close mobile menu on link click
    navAnchors.forEach(anchor => {
        anchor.addEventListener('click', () => {
            toggle.classList.remove('active');
            links.classList.remove('active');
        });
    });

    function updateActiveNavLink() {
        const sections = document.querySelectorAll('section[id]');
        const scrollPos = window.scrollY + 200;

        sections.forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            const id = section.getAttribute('id');

            if (scrollPos >= top && scrollPos < top + height) {
                navAnchors.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('data-section') === id) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }
}

/* ============================================
   4. TYPING EFFECT
   ============================================ */
function initTypingEffect() {
    const el = document.getElementById('typed-text');
    if (!el) return;

    const phrases = [
        'AI/ML Engineer',
        'Computer Vision Developer',
        'Deep Learning Enthusiast',
        'Flutter Developer',
        'Python Programmer',
    ];

    let phraseIdx = 0;
    let charIdx = 0;
    let isDeleting = false;
    let speed = 80;

    function type() {
        const current = phrases[phraseIdx];

        if (isDeleting) {
            el.textContent = current.substring(0, charIdx - 1);
            charIdx--;
            speed = 40;
        } else {
            el.textContent = current.substring(0, charIdx + 1);
            charIdx++;
            speed = 80;
        }

        if (!isDeleting && charIdx === current.length) {
            speed = 2000; // Pause at end
            isDeleting = true;
        } else if (isDeleting && charIdx === 0) {
            isDeleting = false;
            phraseIdx = (phraseIdx + 1) % phrases.length;
            speed = 500; // Pause before next phrase
        }

        setTimeout(type, speed);
    }

    type();
}

/* ============================================
   5. SCROLL REVEAL ANIMATIONS
   ============================================ */
function initScrollReveal() {
    const reveals = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');

    // Immediately reveal hero elements
    const heroReveals = document.querySelectorAll('.hero .reveal-up');
    heroReveals.forEach((el, i) => {
        setTimeout(() => {
            el.classList.add('revealed');
        }, i * 150 + 300);
    });

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Stagger animation for grouped elements
                const delay = entry.target.style.animationDelay || '0s';
                const delayMs = parseFloat(delay) * 1000;

                setTimeout(() => {
                    entry.target.classList.add('revealed');
                }, delayMs);

                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    reveals.forEach(el => {
        // Don't observe hero elements (handled above)
        if (!el.closest('.hero')) {
            observer.observe(el);
        }
    });
}

/* ============================================
   6. COUNT-UP ANIMATION
   ============================================ */
function initCountUp() {
    const stats = document.querySelectorAll('.stat-number');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const target = parseFloat(el.getAttribute('data-count'));
                const isDecimal = target % 1 !== 0;
                const duration = 2000;
                const startTime = performance.now();

                function update(currentTime) {
                    const elapsed = currentTime - startTime;
                    const progress = Math.min(elapsed / duration, 1);

                    // Ease out cubic
                    const ease = 1 - Math.pow(1 - progress, 3);
                    const current = target * ease;

                    el.textContent = isDecimal ? current.toFixed(2) : Math.floor(current);

                    if (progress < 1) {
                        requestAnimationFrame(update);
                    } else {
                        el.textContent = isDecimal ? target.toFixed(2) : target;
                    }
                }

                requestAnimationFrame(update);
                observer.unobserve(el);
            }
        });
    }, { threshold: 0.5 });

    stats.forEach(stat => observer.observe(stat));
}

/* ============================================
   7. NEURAL NETWORK CANVAS VISUALIZATION
   ============================================ */
function initNeuralNetwork() {
    const canvas = document.getElementById('neural-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    function resize() {
        const rect = canvas.parentElement.getBoundingClientRect();
        canvas.width = rect.width;
        canvas.height = 200;
    }

    resize();

    const layers = [4, 6, 8, 6, 3]; // Neural network layer structure
    let nodes = [];
    let animationPhase = 0;

    function createNodes() {
        nodes = [];
        const layerSpacing = canvas.width / (layers.length + 1);

        layers.forEach((count, layerIdx) => {
            const x = layerSpacing * (layerIdx + 1);
            const nodeSpacing = canvas.height / (count + 1);

            for (let i = 0; i < count; i++) {
                const y = nodeSpacing * (i + 1);
                nodes.push({
                    x, y,
                    layer: layerIdx,
                    radius: 5,
                    activation: Math.random(),
                });
            }
        });
    }

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        animationPhase += 0.005;

        // Draw connections
        for (let i = 0; i < nodes.length; i++) {
            for (let j = 0; j < nodes.length; j++) {
                if (nodes[j].layer === nodes[i].layer + 1) {
                    const pulse = (Math.sin(animationPhase * 2 + i * 0.3 + j * 0.2) + 1) / 2;
                    const opacity = 0.05 + pulse * 0.12;

                    ctx.beginPath();
                    ctx.moveTo(nodes[i].x, nodes[i].y);
                    ctx.lineTo(nodes[j].x, nodes[j].y);

                    const grad = ctx.createLinearGradient(nodes[i].x, nodes[i].y, nodes[j].x, nodes[j].y);
                    grad.addColorStop(0, `rgba(124, 58, 237, ${opacity})`);
                    grad.addColorStop(1, `rgba(6, 182, 212, ${opacity})`);
                    ctx.strokeStyle = grad;
                    ctx.lineWidth = 1;
                    ctx.stroke();

                    // Travelling pulse dot
                    if (pulse > 0.7) {
                        const t = (pulse - 0.7) / 0.3;
                        const px = nodes[i].x + (nodes[j].x - nodes[i].x) * t;
                        const py = nodes[i].y + (nodes[j].y - nodes[i].y) * t;
                        ctx.beginPath();
                        ctx.arc(px, py, 1.5, 0, Math.PI * 2);
                        ctx.fillStyle = `rgba(6, 182, 212, ${0.6})`;
                        ctx.fill();
                    }
                }
            }
        }

        // Draw nodes
        nodes.forEach((node, i) => {
            const pulse = (Math.sin(animationPhase * 3 + i) + 1) / 2;
            const radius = node.radius + pulse * 2;

            // Glow
            ctx.beginPath();
            ctx.arc(node.x, node.y, radius + 6, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(124, 58, 237, ${0.05 + pulse * 0.08})`;
            ctx.fill();

            // Node
            ctx.beginPath();
            ctx.arc(node.x, node.y, radius, 0, Math.PI * 2);
            const grad = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, radius);
            grad.addColorStop(0, `rgba(167, 139, 250, ${0.8 + pulse * 0.2})`);
            grad.addColorStop(1, `rgba(124, 58, 237, ${0.4 + pulse * 0.3})`);
            ctx.fillStyle = grad;
            ctx.fill();
        });

        requestAnimationFrame(draw);
    }

    createNodes();
    draw();

    window.addEventListener('resize', () => {
        resize();
        createNodes();
    });
}

/* ============================================
   8. CONTACT FORM
   ============================================ */
function initContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const btn = document.getElementById('form-submit');
        const originalText = btn.querySelector('.btn-text').textContent;

        // Get form values
        const name = document.getElementById('form-name').value;
        const email = document.getElementById('form-email').value;
        const subject = document.getElementById('form-subject').value || 'General Inquiry';
        const message = document.getElementById('form-message').value;

        // Update button state immediately
        btn.querySelector('.btn-text').textContent = 'Opening WhatsApp...';
        btn.disabled = true;
        btn.style.opacity = '0.7';

        // Construct WhatsApp Message
        const whatsappText = `*New Portfolio Message*%0A%0A` +
            `*Name:* ${encodeURIComponent(name)}%0A` +
            `*Email:* ${encodeURIComponent(email)}%0A` +
            `*Subject:* ${encodeURIComponent(subject)}%0A%0A` +
            `*Message:*%0A${encodeURIComponent(message)}`;

        const whatsappUrl = `https://wa.me/919835268065?text=${whatsappText}`;

        // Open WhatsApp immediately to avoid popup blocker
        window.open(whatsappUrl, '_blank');

        // Success state UI (on the page)
        setTimeout(() => {
            btn.querySelector('.btn-text').textContent = 'Redirected! ✓';
            btn.style.background = 'linear-gradient(135deg, #10b981 0%, #06b6d4 100%)';
            
            setTimeout(() => {
                btn.querySelector('.btn-text').textContent = originalText;
                btn.disabled = false;
                btn.style.opacity = '1';
                btn.style.background = '';
                form.reset();
            }, 3000);
        }, 500);
    });
}

/* ============================================
   9. SMOOTH SCROLL
   ============================================ */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const target = document.querySelector(targetId);
            if (target) {
                const offsetTop = target.offsetTop - 72; // nav height
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/* ============================================
   10. TILT EFFECT ON PROJECT CARDS
   ============================================ */
function initTiltEffect() {
    const cards = document.querySelectorAll('.project-card, .gallery-card');

    // Skip on touch devices
    if ('ontouchstart' in window) return;

    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = ((y - centerY) / centerY) * -5;
            const rotateY = ((x - centerX) / centerX) * 5;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });
}

/* ============================================
   11. PARALLAX ON SCROLL (subtle)
   ============================================ */
window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;

    // Parallax the hero visual
    const heroVisual = document.querySelector('.hero-visual');
    if (heroVisual && scrollY < window.innerHeight) {
        heroVisual.style.transform = `translateY(${scrollY * 0.15}px)`;
    }

    // Parallax floating icons
    const floatIcons = document.querySelectorAll('.float-icon');
    floatIcons.forEach((icon, i) => {
        const speed = 0.05 + i * 0.02;
        icon.style.marginTop = `${scrollY * speed}px`;
    });
});

/* ============================================
   12. LIGHTBOX CONTEXT
   ============================================ */
function initLightbox() {
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCaption = document.getElementById('lightbox-caption');
    const closeBtn = document.getElementById('lightbox-close');
    const prevBtn = document.getElementById('lightbox-prev');
    const nextBtn = document.getElementById('lightbox-next');
    const galleryImgs = document.querySelectorAll('.gallery-img-wrapper');

    let currentIndex = 0;

    if (!lightbox || galleryImgs.length === 0) return;

    function openLightbox(index) {
        currentIndex = index;
        const wrapper = galleryImgs[currentIndex];
        const img = wrapper.querySelector('img');
        const caption = wrapper.getAttribute('data-caption');

        lightboxImg.src = img.src;
        lightboxCaption.textContent = caption;
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent scroll
    }

    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }

    function showNext() {
        currentIndex = (currentIndex + 1) % galleryImgs.length;
        openLightbox(currentIndex);
    }

    function showPrev() {
        currentIndex = (currentIndex - 1 + galleryImgs.length) % galleryImgs.length;
        openLightbox(currentIndex);
    }

    galleryImgs.forEach((img, index) => {
        img.addEventListener('click', () => openLightbox(index));
    });

    closeBtn.addEventListener('click', closeLightbox);
    nextBtn.addEventListener('click', e => {
        e.stopPropagation();
        showNext();
    });
    prevBtn.addEventListener('click', e => {
        e.stopPropagation();
        showPrev();
    });

    lightbox.querySelector('.lightbox-overlay').addEventListener('click', closeLightbox);

    // Keyboard navigation
    document.addEventListener('keydown', e => {
        if (!lightbox.classList.contains('active')) return;
        
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowRight') showNext();
        if (e.key === 'ArrowLeft') showPrev();
    });
}
