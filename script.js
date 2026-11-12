// Mobile Navigation Toggle
const burger = document.querySelector('.burger');
const nav = document.querySelector('.nav-links');
const navLinks = document.querySelectorAll('.nav-links li');

burger.addEventListener('click', () => {
    // Toggle Nav
    nav.classList.toggle('active');
    
    // Burger Animation
    burger.classList.toggle('toggle');
});

// Close mobile menu when clicking on a link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        nav.classList.remove('active');
        burger.classList.remove('toggle');
    });
});

// Smooth Scrolling for Navigation Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Navbar Background on Scroll
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 100) {
        navbar.style.background = 'rgba(10, 14, 39, 1)';
    } else {
        navbar.style.background = 'rgba(10, 14, 39, 0.95)';
    }
});

// Typing Animation for Hero Section
const typingText = document.querySelector('.typing-text');
const originalText = typingText.textContent;
typingText.textContent = '';

let i = 0;
function typeWriter() {
    if (i < originalText.length) {
        typingText.textContent += originalText.charAt(i);
        i++;
        setTimeout(typeWriter, 100);
    }
}

// Start typing animation when page loads
window.addEventListener('load', () => {
    setTimeout(typeWriter, 500);
});

// Project Wheel: cards roll left/right on a horizontal cylinder
document.querySelectorAll('.projects-grid').forEach(grid => {
    const cards = [...grid.querySelectorAll('.project-card')];
    const n = cards.length;
    if (!n) return;

    grid.classList.add('wheel');
    grid.tabIndex = 0;
    let active = 0;
    let dragged = false;

    function render() {
        cards.forEach((card, i) => {
            // Signed distance from the front card, wrapping around
            let d = (i - active + n) % n;
            if (d > n / 2) d -= n;

            const prev = Number(card.style.getPropertyValue('--d') || d);
            if (Math.abs(d - prev) > 1) {
                // Wrapping card: snap to the other side hidden, then fade in
                card.classList.add('jump');
                card.style.setProperty('--d', d);
                void card.offsetWidth;
                card.classList.remove('jump');
            } else {
                card.style.setProperty('--d', d);
            }

            card.style.zIndex = n - Math.abs(d);
            card.classList.toggle('is-active', d === 0);
            card.classList.toggle('is-far', Math.abs(d) > 1);
        });
    }

    const go = step => {
        active = (active + step + n) % n;
        render();
    };

    render();
    if (n < 2) return; // one card: same wheel look, nothing to roll yet

    // Swipe / drag
    let startX = null;
    grid.addEventListener('pointerdown', e => {
        startX = e.clientX;
        dragged = false;
    });
    grid.addEventListener('pointerup', e => {
        if (startX === null) return;
        const dx = e.clientX - startX;
        startX = null;
        if (Math.abs(dx) > 40) {
            dragged = true;
            go(dx < 0 ? 1 : -1);
        }
    });

    // Clicking a side card brings it to the front (instead of opening its link)
    cards.forEach((card, i) => card.addEventListener('click', e => {
        if (dragged || !card.classList.contains('is-active')) {
            e.preventDefault();
            if (!dragged) {
                active = i;
                render();
            }
        }
    }));

    // Touchpad horizontal swipe / Shift + mouse wheel
    let acc = 0, locked = false, quiet;
    grid.addEventListener('wheel', e => {
        const horizontal = Math.abs(e.deltaX) > Math.abs(e.deltaY);
        if (!horizontal && !e.shiftKey) return; // plain vertical scroll still scrolls the page
        e.preventDefault();

        // One gesture = one turn: unlock only after the scrolling goes quiet
        clearTimeout(quiet);
        quiet = setTimeout(() => { locked = false; acc = 0; }, 200);
        if (locked) return;

        acc += horizontal ? e.deltaX : e.deltaY;
        if (Math.abs(acc) > 30) {
            locked = true;
            go(acc > 0 ? 1 : -1);
        }
    }, { passive: false });

    // Small usage hint under the wheel
    grid.insertAdjacentHTML('afterend',
        '<p class="wheel-hint"><i class="fas fa-arrows-left-right"></i> Swipe, drag, or Click</p>');

    // Arrow keys when the wheel is focused
    grid.addEventListener('keydown', e => {
        if (e.key === 'ArrowRight') go(1);
        if (e.key === 'ArrowLeft') go(-1);
    });
});

// Intersection Observer for Fade-in Animation
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe all sections and cards
// (wheel cards are skipped: their transform is controlled by the wheel)
document.querySelectorAll('section, .skill-card, .projects-grid:not(.wheel) .project-card').forEach(element => {
    element.style.opacity = '0';
    element.style.transform = 'translateY(30px)';
    element.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
    observer.observe(element);
});

// Contact Form Handling (Basic validation)
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const name = this.querySelector('input[type="text"]').value;
        const email = this.querySelector('input[type="email"]').value;
        const message = this.querySelector('textarea').value;
        
        if (name && email && message) {
            // Here you would typically send the form data to a server
            // For now, we'll just show an alert
            alert('Thank you for your message! I will get back to you soon.');
            this.reset();
        } else {
            alert('Please fill in all fields.');
        }
    });
}

// Terminal Animation Enhancement
const terminalBody = document.querySelector('.terminal-body');
if (terminalBody) {
    const commands = [
        { prompt: 'root@security:~$', command: 'whoami', output: 'cybersecurity_specialist' },
        { prompt: 'root@security:~$', command: 'cat skills.txt', output: 'Network Security, Penetration Testing, Ethical Hacking...' },
        { prompt: 'root@security:~$', command: 'ls certifications/', output: 'CEH.cert CompTIA_Security+.cert OSCP.cert' },
        { prompt: 'root@security:~$', command: '', output: '' }
    ];
    
    let currentCommand = 0;
    
    function animateTerminal() {
        if (currentCommand < commands.length) {
            const cmd = commands[currentCommand];
            setTimeout(() => {
                const line = document.createElement('p');
                line.innerHTML = `<span class="prompt">${cmd.prompt}</span> ${cmd.command}`;
                terminalBody.appendChild(line);
                
                if (cmd.output) {
                    setTimeout(() => {
                        const outputLine = document.createElement('p');
                        outputLine.className = 'output';
                        outputLine.textContent = cmd.output;
                        terminalBody.appendChild(outputLine);
                        currentCommand++;
                        animateTerminal();
                    }, 500);
                } else {
                    const cursorLine = document.createElement('p');
                    cursorLine.innerHTML = `<span class="prompt">${cmd.prompt}</span> <span class="cursor">_</span>`;
                    terminalBody.appendChild(cursorLine);
                }
            }, 1000);
        }
    }
}

// Project Cards Hover Effect Enhancement
const projectCards = document.querySelectorAll('.projects-grid:not(.wheel) .project-card');
projectCards.forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-10px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
    });
});

// Skill Cards Hover Effect
const skillCards = document.querySelectorAll('.skill-card');
skillCards.forEach(card => {
    card.addEventListener('mouseenter', function() {
        const icon = this.querySelector('i');
        icon.style.transform = 'scale(1.2) rotate(5deg)';
        icon.style.transition = 'transform 0.3s ease';
    });
    
    card.addEventListener('mouseleave', function() {
        const icon = this.querySelector('i');
        icon.style.transform = 'scale(1) rotate(0deg)';
    });
});

// Parallax Effect for Hero Section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const heroContent = document.querySelector('.hero-content');
    const terminal = document.querySelector('.terminal');
    
    if (heroContent && terminal) {
        heroContent.style.transform = `translateY(${scrolled * 0.5}px)`;
        terminal.style.transform = `translateY(${scrolled * 0.3}px)`;
    }
});

// Add active state to navigation based on scroll position
window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section[id]');
    const scrollY = window.pageYOffset;
    
    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        const sectionId = section.getAttribute('id');
        const navLink = document.querySelector(`.nav-links a[href="#${sectionId}"]`);
        
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            document.querySelectorAll('.nav-links a').forEach(link => {
                link.style.color = '';
            });
            if (navLink) {
                navLink.style.color = 'var(--primary-color)';
            }
        }
    });
});

// Preloader (Optional - uncomment if you want a loading screen)
/*
window.addEventListener('load', () => {
    const preloader = document.createElement('div');
    preloader.className = 'preloader';
    preloader.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: var(--dark-bg);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 9999;
        transition: opacity 0.5s ease;
    `;
    preloader.innerHTML = '<i class="fas fa-shield-halved fa-3x" style="color: var(--primary-color); animation: spin 2s linear infinite;"></i>';
    
    document.body.prepend(preloader);
    
    setTimeout(() => {
        preloader.style.opacity = '0';
        setTimeout(() => preloader.remove(), 500);
    }, 1000);
});
*/

console.log('%c🔒 Cybersecurity Portfolio Loaded Successfully! 🔒', 'color: #00d9ff; font-size: 20px; font-weight: bold;');
console.log('%cStay secure! 🛡️', 'color: #ff006e; font-size: 14px;');