// ===================================
// KASHMIR LOOM TOURS - MAIN SCRIPT
// ===================================

document.addEventListener('DOMContentLoaded', () => {
    // --- Preloader ---
    const preloader = document.getElementById('preloader');
    window.addEventListener('load', () => {
        setTimeout(() => {
            if (preloader) {
                preloader.classList.add('loaded');
                setTimeout(() => preloader.style.display = 'none', 600);
            }
        }, 1200);
    });

    // --- Mobile Navigation ---
    const navToggle = document.getElementById('nav-toggle');
    const navLinks = document.getElementById('nav-links');
    
    if (navToggle && navLinks) {
        navToggle.addEventListener('click', () => {
            navToggle.classList.toggle('active');
            navLinks.classList.toggle('active');
        });
    }

    // Close mobile nav on link click
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            if(navToggle) navToggle.classList.remove('active');
            if(navLinks) navLinks.classList.remove('active');
        });
    });

    // --- Navbar Scroll Effect ---
    const navbar = document.getElementById('navbar');
    const backToTop = document.getElementById('back-to-top');
    
    const handleScroll = () => {
        const scrollY = window.scrollY;
        
        // Navbar background
        if (navbar) {
            if (scrollY > 80) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        }

        // Back to top button
        if (backToTop) {
            if (scrollY > 600) {
                backToTop.classList.add('visible');
            } else {
                backToTop.classList.remove('visible');
            }
        }

        // Active nav link based on scroll position
        updateActiveNavLink();
    };

    window.addEventListener('scroll', handleScroll);

    // --- Active Nav Link ---
    function updateActiveNavLink() {
        const sections = document.querySelectorAll('section[id]');
        const scrollPos = window.scrollY + 120;

        sections.forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            const id = section.getAttribute('id');

            if (scrollPos >= top && scrollPos < top + height) {
                document.querySelectorAll('.nav-link').forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    // --- Counter Animation ---
    const statNumbers = document.querySelectorAll('.stat-number[data-target]');
    let counterTriggered = false;

    function animateCounters() {
        if (counterTriggered) return;
        
        const heroStats = document.querySelector('.hero-stats');
        if (!heroStats) return;

        const rect = heroStats.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
            counterTriggered = true;
            statNumbers.forEach(num => {
                const target = parseInt(num.getAttribute('data-target'));
                const duration = 2000;
                const start = Date.now();
                
                const animate = () => {
                    const elapsed = Date.now() - start;
                    const progress = Math.min(elapsed / duration, 1);
                    const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
                    const current = Math.floor(eased * target);
                    num.textContent = current;
                    
                    if (progress < 1) {
                        requestAnimationFrame(animate);
                    } else {
                        num.textContent = target;
                    }
                };
                animate();
            });
        }
    }

    window.addEventListener('scroll', animateCounters);
    animateCounters(); // Check on load

    // --- Scroll Reveal Animations ---
    function addRevealClasses() {
        const revealElements = [
            '.about-images', '.about-content',
            '.destination-card', '.package-card',
            '.gallery-item', '.review-card',
            '.contact-card', '.contact-form-wrapper',
            '.section-header', '.reviews-rating-summary',
            '.map-container', '.cta-content'
        ];

        revealElements.forEach(selector => {
            document.querySelectorAll(selector).forEach((el, index) => {
                el.classList.add('reveal');
                if (index > 0 && index < 5) {
                    el.classList.add(`reveal-delay-${index}`);
                }
            });
        });
    }

    function handleReveal() {
        document.querySelectorAll('.reveal').forEach(el => {
            const rect = el.getBoundingClientRect();
            const windowHeight = window.innerHeight;
            
            if (rect.top < windowHeight * 0.88) {
                el.classList.add('revealed');
            }
        });
    }

    addRevealClasses();
    window.addEventListener('scroll', handleReveal);
    handleReveal(); // Check on load

    // --- Reviews Slider ---
    const reviewsTrack = document.getElementById('reviews-track');
    const reviewPrev = document.getElementById('review-prev');
    const reviewNext = document.getElementById('review-next');
    const reviewDots = document.getElementById('review-dots');
    const reviewCards = document.querySelectorAll('.review-card');
    let currentSlide = 0;
    let slidesPerView = 3;
    let totalSlides = 0;
    let autoSlideInterval;

    function getSlideInfo() {
        const width = window.innerWidth;
        if (width <= 768) slidesPerView = 1;
        else if (width <= 1024) slidesPerView = 2;
        else slidesPerView = 3;
        
        totalSlides = Math.max(1, reviewCards.length - slidesPerView + 1);
    }

    function createDots() {
        reviewDots.innerHTML = '';
        for (let i = 0; i < totalSlides; i++) {
            const dot = document.createElement('span');
            dot.classList.add('review-dot');
            if (i === 0) dot.classList.add('active');
            dot.addEventListener('click', () => goToSlide(i));
            reviewDots.appendChild(dot);
        }
    }

    function goToSlide(index) {
        currentSlide = Math.max(0, Math.min(index, totalSlides - 1));
        const cardWidth = reviewCards[0].offsetWidth + 24; // includes gap
        reviewsTrack.style.transform = `translateX(-${currentSlide * cardWidth}px)`;
        
        document.querySelectorAll('.review-dot').forEach((dot, i) => {
            dot.classList.toggle('active', i === currentSlide);
        });
    }

    function nextSlide() {
        goToSlide(currentSlide >= totalSlides - 1 ? 0 : currentSlide + 1);
    }

    function prevSlide() {
        goToSlide(currentSlide <= 0 ? totalSlides - 1 : currentSlide - 1);
    }

    function startAutoSlide() {
        stopAutoSlide();
        autoSlideInterval = setInterval(nextSlide, 5000);
    }

    function stopAutoSlide() {
        clearInterval(autoSlideInterval);
    }

    reviewPrev.addEventListener('click', () => {
        prevSlide();
        stopAutoSlide();
        startAutoSlide();
    });

    reviewNext.addEventListener('click', () => {
        nextSlide();
        stopAutoSlide();
        startAutoSlide();
    });

    getSlideInfo();
    createDots();
    startAutoSlide();

    window.addEventListener('resize', () => {
        getSlideInfo();
        createDots();
        goToSlide(Math.min(currentSlide, totalSlides - 1));
    });

    // --- Gallery Lightbox ---
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxClose = document.getElementById('lightbox-close');

    document.querySelectorAll('.gallery-item').forEach(item => {
        item.addEventListener('click', () => {
            const img = item.querySelector('img');
            lightboxImg.src = img.src;
            lightboxImg.alt = img.alt;
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    });

    lightboxClose.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) closeLightbox();
    });

    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeLightbox();
    });

    // --- Contact Form ---
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
        
        const name = document.getElementById('form-name').value;
        const email = document.getElementById('form-email').value;
        const phone = document.getElementById('form-phone').value;
        const pkg = document.getElementById('form-package').value;
        const guests = document.getElementById('form-guests').value;
        const message = document.getElementById('form-message').value;

        // Build WhatsApp message
        let waMessage = `Hi Bilal Bhai! I'm interested in a Kashmir tour.\n\n`;
        waMessage += `*Name:* ${name}\n`;
        waMessage += `*Email:* ${email}\n`;
        waMessage += `*Phone:* ${phone}\n`;
        if (pkg) waMessage += `*Package:* ${pkg}\n`;
        if (guests) waMessage += `*Guests:* ${guests}\n`;
        if (message) waMessage += `*Message:* ${message}\n`;

        const waUrl = `https://wa.me/917889528922?text=${encodeURIComponent(waMessage)}`;
        
        // Show success indication
        const submitBtn = document.getElementById('form-submit');
        const originalHTML = submitBtn.innerHTML;
        submitBtn.innerHTML = '<span>Opening WhatsApp...</span><i class="fas fa-check"></i>';
        submitBtn.style.background = 'var(--clr-whatsapp)';
        
        window.open(waUrl, '_blank');
        
        setTimeout(() => {
            submitBtn.innerHTML = originalHTML;
            submitBtn.style.background = '';
            contactForm.reset();
        }, 3000);
    });
    }

    // --- Floating Particles in Hero ---
    function createParticles() {
        const container = document.getElementById('hero-particles');
        if (!container) return;

        for (let i = 0; i < 30; i++) {
            const particle = document.createElement('div');
            particle.style.cssText = `
                position: absolute;
                width: ${Math.random() * 4 + 1}px;
                height: ${Math.random() * 4 + 1}px;
                background: rgba(212, 168, 83, ${Math.random() * 0.3 + 0.1});
                border-radius: 50%;
                left: ${Math.random() * 100}%;
                top: ${Math.random() * 100}%;
                animation: particleFloat ${Math.random() * 8 + 6}s ease-in-out infinite;
                animation-delay: ${Math.random() * 5}s;
            `;
            container.appendChild(particle);
        }

        // Add particle animation style
        const style = document.createElement('style');
        style.textContent = `
            @keyframes particleFloat {
                0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.5; }
                25% { transform: translate(${Math.random() > 0.5 ? '' : '-'}20px, -30px) scale(1.2); opacity: 0.8; }
                50% { transform: translate(${Math.random() > 0.5 ? '' : '-'}40px, -10px) scale(0.8); opacity: 0.3; }
                75% { transform: translate(${Math.random() > 0.5 ? '' : '-'}10px, -40px) scale(1.1); opacity: 0.6; }
            }
        `;
        document.head.appendChild(style);
    }

    createParticles();

    // --- Smooth scroll for all anchor links ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            e.preventDefault();
            const target = document.querySelector(anchor.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    // --- Pause auto-slide on hover ---
    const reviewsSlider = document.getElementById('reviews-slider');
    if (reviewsSlider && reviewsTrack) {
        reviewsSlider.addEventListener('mouseenter', stopAutoSlide);
        reviewsSlider.addEventListener('mouseleave', startAutoSlide);
        
        let touchStartX = 0;
        let touchEndX = 0;

        reviewsTrack.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
            stopAutoSlide();
        }, { passive: true });

        reviewsTrack.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            const diff = touchStartX - touchEndX;
            
            if (Math.abs(diff) > 50) {
                if (diff > 0) nextSlide();
                else prevSlide();
            }
            startAutoSlide();
        }, { passive: true });
        
        if (reviewPrev) {
            reviewPrev.addEventListener('click', () => {
                prevSlide();
                stopAutoSlide();
                startAutoSlide();
            });
        }
        if (reviewNext) {
            reviewNext.addEventListener('click', () => {
                nextSlide();
                stopAutoSlide();
                startAutoSlide();
            });
        }
        
        getSlideInfo();
        createDots();
        startAutoSlide();
    }
});

// ===================================
// BOOKING SYSTEM LOGIC (Dynamic pages)
// ===================================
const tourPackages = {
    'pkg-group': {
        title: 'Kashmir Group Tour',
        basePrice: 76000,
        pax: 12,
        duration: '4 Days / 3 Nights',
        desc: 'Best for student & friends groups. Shared hotels, group cab & full Kashmir sightseeing included.',
        img: 'images/dal-lake.png',
        tag: 'Popular',
        itinerary: [
            { day: 'Day 1', title: 'Arrival in Srinagar', desc: 'Arrival at Srinagar Airport. Meet and greet by our representative. Transfer to Dal Lake and check in to a traditional Kashmiri Houseboat. In the late afternoon, enjoy a tranquil 1-hour Shikara ride on the pristine waters of Dal Lake, observing the floating gardens and local markets. Dinner and overnight stay at the Houseboat.' },
            { day: 'Day 2', title: 'Srinagar to Gulmarg', desc: 'After breakfast, embark on a full-day excursion to Gulmarg (Meadow of Flowers). The drive past colorful villages and rice fields gives you an insight into the rich cultural past of Kashmir. Enjoy the world-famous Gondola ride (Cable car) up to Phase 1 or Phase 2 (at your own cost). Return to Srinagar for dinner and an overnight stay at a hotel.' },
            { day: 'Day 3', title: 'Srinagar to Pahalgam', desc: 'After breakfast, proceed for a day trip to Pahalgam, widely known as the Valley of Shepherds. En route, visit the saffron fields of Pampore and the ancient Awantipora Ruins. On arrival, relax by the Lidder River or optionally visit Betaab Valley, Aru Valley, and Chandanwari via local union cabs (extra cost). Drive back to Srinagar in the evening for dinner.' },
            { day: 'Day 4', title: 'Departure', desc: 'Enjoy your final Kashmiri breakfast. Depending on your flight schedule, proceed for some last-minute shopping for local handicrafts, Pashmina shawls, and dry fruits in Srinagar city before being dropped off at the Srinagar Airport for your onward journey with beautiful memories.' }
        ]
    },
    'pkg-budget': {
        title: 'Budget Kashmir Tour',
        basePrice: 22000,
        pax: 2,
        duration: '4 Days / 3 Nights',
        desc: 'Affordable Kashmir tour for families, couples or solo travelers. Includes hotel, cab & sightseeing at best rates.',
        img: 'images/shikara.png',
        tag: 'Featured',
        itinerary: [
            { day: 'Day 1', title: 'Welcome to Srinagar', desc: 'Welcome to Srinagar! Upon arrival at the airport, our driver will transfer you to your hotel. After freshening up, head out for local city sightseeing, including visits to the famous Mughal Gardens (Shalimar Bagh and Nishat Bagh) and the Shankaracharya Temple, offering panoramic views of the city. Later, enjoy a peaceful Shikara ride on Dal Lake.' },
            { day: 'Day 2', title: 'Gulmarg Excursion', desc: 'Depart for Gulmarg after an early breakfast. Spend the day exploring the lush green meadows and snow-capped peaks. You have the option to experience the thrilling Gondola cable car ride or go for a pony ride across the scenic landscapes. Drive back to your Srinagar hotel by the evening.' },
            { day: 'Day 3', title: 'Srinagar to Sonmarg Excursion', desc: 'Enjoy a scenic drive to Sonmarg (Meadow of Gold). The drive is mesmerizing through the Sindh Valley. In Sonmarg, optionally hire ponies to visit the Thajiwas Glacier, an amazing spot where snow remains round the year. Return to your hotel in Srinagar for a cozy dinner.' },
            { day: 'Day 4', title: 'Farewell', desc: 'Check out after breakfast. Our representative will assist you with the transfer to the Srinagar Airport, marking the end of your budget-friendly yet memorable Kashmir tour.' }
        ]
    },
    'pkg-luxury': {
        title: 'Luxury Kashmir Tour',
        basePrice: 95999,
        pax: 2,
        duration: '7 Days / 6 Nights',
        desc: 'Premium Kashmir tour with luxury hotels, private transfers & personalized services. Ideal for high-end travel.',
        img: 'images/hero-bg.png',
        tag: 'Premium',
        itinerary: [
            { day: 'Day 1', title: 'Premium Arrival', desc: 'Arrive in style at Srinagar. Experience a premium luxury transfer to your 5-star equivalent traditional premium Houseboat. Enjoy an exclusive welcome drink. Later, take a private evening Shikara ride away from the crowds, visiting the secluded lotus gardens while watching the breathtaking sunset over Dal Lake. Candlelight dinner at the houseboat.' },
            { day: 'Day 2', title: 'Srinagar Premium Tour', desc: 'Morning visit to the majestic Mughal Gardens (Nishat, Shalimar, Chashma Shahi) followed by a guided heritage walk in the Old City. Enjoy premium local Kashmiri cuisine (Wazwan) for lunch. Evening at leisure at a luxury Srinagar hotel.' },
            { day: 'Day 3', title: 'Gulmarg Luxury Stay', desc: 'After a lavish breakfast, proceed in a private luxury SUV to Gulmarg. Check in to a premium resort. Enjoy priority access arrangements for the Gondola ride to Phase 2 (Apharwat Peak) and spend the afternoon skiing or relaxing in the high-altitude cafes.' },
            { day: 'Day 4', title: 'Pahalgam Retreat', desc: 'Depart Gulmarg and drive towards Pahalgam. Arrive and check in to a riverside luxury resort. Spend your afternoon leisurely walking along the gentle Lidder River or exploring the local boutique handicraft shops.' },
            { day: 'Day 5', title: 'Pahalgam Valleys', desc: 'Hire a premier local cab to explore the breathtaking Betaab Valley and Aru Valley. Enjoy a special picnic lunch surrounded by pine forests and snow-capped mountains. Return to the resort for an evening bonfire (weather permitting).' },
            { day: 'Day 6', title: 'Sonmarg Excursion', desc: 'Take a luxury day excursion to Sonmarg. The drive offers spectacular views of glaciers and alpine forests. Optional premium excursion to the Thajiwas Glacier. Head back to Srinagar for your final night.' },
            { day: 'Day 7', title: 'Departure', desc: 'Enjoy a relaxed morning. After an exquisite breakfast, your chauffeur will transfer you to the Srinagar Airport for your departure, ensuring your luxury experience concludes smoothly.' }
        ]
    },
    'pkg-family': {
        title: 'Family Kashmir Tour',
        basePrice: 48000,
        pax: 4,
        duration: '6 Days / 5 Nights',
        desc: 'Perfect Kashmir family trip with safe travel, kid-friendly sightseeing & comfortable hotel stays.',
        img: 'images/pahalgam.png',
        tag: 'Family',
        itinerary: [
            { day: 'Day 1', title: 'Arrival & Shikara', desc: 'Welcome to Kashmir! Arrival at Srinagar, check into a safe, family-friendly Houseboat on Dal or Nigeen Lake. Spend the evening on a fun Shikara ride where kids can interact with local floating vendors selling flowers and wooden crafts.' },
            { day: 'Day 2', title: 'Sonmarg Day Trip', desc: 'Head out for a day trip to Sonmarg. The journey is incredibly beautiful. In Sonmarg, the family can enjoy playing in the snow at Thajiwas Glacier (accessible via a short, fun pony ride that children love). Return to Srinagar for the night.' },
            { day: 'Day 3', title: 'Srinagar Local Sightseeing', desc: 'Explore the famous Mughal Gardens where children have ample space to run around and families can take beautiful pictures in traditional Kashmiri attire. Visit the Pari Mahal and Chashma Shahi. Have a relaxed family dinner at the hotel.' },
            { day: 'Day 4', title: 'Gulmarg Trip', desc: 'Drive to Gulmarg, famous for its family-friendly snow activities. Enjoy the famous Gondola ride together. The broad, safe meadows are perfect for snowball fights, sledding, and enjoying local snacks.' },
            { day: 'Day 5', title: 'Pahalgam Trip', desc: 'A scenic drive takes the family to Pahalgam. Enjoy a short pony ride to Baisaran Valley (Mini Switzerland), which offers a vast grassy meadow perfect for family picnics and safe horse riding.' },
            { day: 'Day 6', title: 'Departure', desc: 'Enjoy a wholesome breakfast before the driver drops you and your family safely at the Srinagar airport with wonderful family portraits and lifelong memories.' }
        ]
    },
    'pkg-best': {
        title: 'Best Kashmir Tour',
        basePrice: 26999,
        pax: 2,
        duration: '5 Days / 4 Nights',
        desc: 'Enjoy the best of Kashmir in 5 days. Visit Srinagar, Gulmarg & Pahalgam with stays, transport & local tours included.',
        img: 'images/dal-lake.png',
        tag: 'Recommended',
        itinerary: [
            { day: 'Day 1', title: 'Arrival in Srinagar', desc: 'Arrival at Srinagar Airport. Transfer to a comfortable hotel or Houseboat. Enjoy an evening of leisure at the Boulevard Road, exploring local cafes, and top off the day with a serene 1-hour Shikara ride on the world-famous Dal Lake.' },
            { day: 'Day 2', title: 'Gulmarg Day Trip', desc: 'After breakfast, head for a day excursion to Gulmarg. Known as the heartland of winter sports in India, spend your day enjoying the majestic views, taking the Gondola ride, and photographing the cinematic landscapes. Return to Srinagar by late afternoon.' },
            { day: 'Day 3', title: 'Pahalgam Arrival', desc: 'Check out early and drive to Pahalgam. This vibrant town is a hub for nature lovers. Check into your hotel and spend the afternoon walking through the pine forests or shopping in the colorful local markets.' },
            { day: 'Day 4', title: 'Pahalgam Sightseeing', desc: 'Spend the first half of the day exploring Pahalgam\'s iconic triad: Aru Valley, Betaab Valley, and Chandanwari via local cabs. After a fulfilling afternoon of sightseeing, drive back to Srinagar and check into your hotel.' },
            { day: 'Day 5', title: 'Return Journey', desc: 'After your morning breakfast, your dedicated driver will drop you at the Srinagar Airport. Tour concludes with beautiful memories of the Best of Kashmir.' }
        ]
    },
    'pkg-honeymoon': {
        title: 'Kashmir Honeymoon',
        basePrice: 33999,
        pax: 2,
        duration: '6 Days / 5 Nights',
        desc: 'Romantic honeymoon in Kashmir with stays in Srinagar, Gulmarg & Pahalgam. Private car, houseboat & Shikara ride included.',
        img: 'images/shikara.png',
        tag: 'Couples',
        itinerary: [
            { day: 'Day 1', title: 'Romantic Arrival', desc: 'Begin your romantic journey with a warm reception at Srinagar Airport. Check into a beautifully flower-decorated Houseboat room. In the evening, drift peacefully across Dal Lake on a private Shikara ride, culminating in a special candlelight dinner under the stars.' },
            { day: 'Day 2', title: 'Srinagar City Tour', desc: 'Explore the historical Garden of Love (Shalimar Bagh) and the vibrant Nishat Bagh. Enjoy a quiet, romantic stroll around the Pari Mahal overlooking the city. Evening free for a cozy walk along the Boulevard Road.' },
            { day: 'Day 3', title: 'Gulmarg Getaway', desc: 'Drive to the snowy paradise of Gulmarg. Take the Gondola ride to the Apharwat peak and marvel at the panoramic views of the Himalayas with your partner. Spend the afternoon in cozy snow-side cafes before returning to your hotel in Srinagar.' },
            { day: 'Day 4', title: 'Pahalgam Journey', desc: 'Embark on a breathtaking drive to Pahalgam, passing through the famous saffron fields of Pampore. Arrive at the Valley of Shepherds, check into a romantic resort, and spend the evening enjoying the natural sound of the Lidder River.' },
            { day: 'Day 5', title: 'Pahalgam Valleys', desc: 'Take a private local cab to explore the cinematic Betaab Valley (named after the famous Bollywood movie). Enjoy a secluded picnic in the pine forests or take a magical pony ride to Baisaran Valley. Return to Srinagar for your final night.' },
            { day: 'Day 6', title: 'Departure', desc: 'Wake up to a relaxed morning and enjoy your final Kashmiri tea (Kahwa) together. A private transfer will drop you at the Srinagar Airport, concluding a perfect, romantic honeymoon.' }
        ]
    },
    'pkg-6pax': {
        title: 'Kashmir Tour (6 Pax)',
        basePrice: 57999,
        pax: 6,
        duration: '6 Days / 5 Nights',
        desc: 'Explore Srinagar, Gulmarg, Pahalgam & Sonmarg with this 6-day Kashmir tour package. Includes hotel stay, transport & sightseeing.',
        img: 'images/sonamarg.png',
        tag: 'Group',
        itinerary: [
            { day: 'Day 1', title: 'Arrival', desc: 'Full group arrival at Srinagar. You will be picked up in a comfortable, spacious Innova/Tavera. Check-in to adjacent rooms in a traditional Houseboat so the group stays together. Evening group Shikara ride.' },
            { day: 'Day 2', title: 'Gulmarg', desc: 'Group excursion to Gulmarg. The meadows offer plenty of open space for group pictures. The entire group can take the Gondola ride together to enjoy the snow-covered peaks. Evening return to Srinagar.' },
            { day: 'Day 3', title: 'Sonmarg', desc: 'A thrilling group drive to Sonmarg. Known as the Meadow of Gold, it\'s the perfect backdrop for group treks. Optionally hire ponies together to reach the Thajiwas Glacier and enjoy snow sledding.' },
            { day: 'Day 4', title: 'Pahalgam', desc: 'Check out and travel together to Pahalgam. En route, stop at the apple orchards and saffron fields for group photos and souvenir shopping. Explore the local Pahalgam town in the evening.' },
            { day: 'Day 5', title: 'Srinagar Local', desc: 'Group sightseeing in Pahalgam covering Aru Valley and Betaab Valley. Return to Srinagar in the late afternoon for a final group dinner and shopping spree at Lal Chowk.' },
            { day: 'Day 6', title: 'Departure', desc: 'After breakfast, the group will be transferred to Srinagar Airport for the onward journey together.' }
        ]
    },
    'pkg-holiday': {
        title: 'Kashmir Holiday',
        basePrice: 39999,
        pax: 2,
        duration: '7 Days / 6 Nights',
        desc: 'Book a 7-day Kashmir holiday covering all major attractions with complete travel, stays, and guided sightseeing included.',
        img: 'images/hero-bg.png',
        tag: 'Holiday',
        itinerary: [
            { day: 'Day 1', title: 'Arrival', desc: 'Welcome to the Paradise on Earth! Landing at Srinagar airport, followed by a transfer to a beautiful Dal Lake houseboat. Enjoy the sunset over the lake during a complimentary Shikara ride.' },
            { day: 'Day 2', title: 'Srinagar Local', desc: 'Embark on a comprehensive local Srinagar sightseeing tour. Visit the Grand Mughal Gardens, the architectural marvel of Pari Mahal, and the sacred shrines in the Old City. Head back to the hotel for dinner.' },
            { day: 'Day 3', title: 'Gulmarg', desc: 'Head off to the majestic Gulmarg for a full-day trip. Ride the world\'s highest operating cable car (Gondola) and experience the thrill of the snow-clad peaks. Return to Srinagar.' },
            { day: 'Day 4', title: 'Sonmarg', desc: 'Take a vivid journey to Sonmarg. The drive alone, following the Sindh River, is an attraction. Spend the day admiring the glaciers and alpine scenery before heading back to Srinagar.' },
            { day: 'Day 5', title: 'Pahalgam', desc: 'Leave Srinagar and drive to Pahalgam. Enjoy the stark transition from urban Srinagar to the rustic, untouched beauty of the Lidder Valley. Check into your hotel and relax.' },
            { day: 'Day 6', title: 'Pahalgam Stay', desc: 'Dive deep into Pahalgam\'s beauty by visiting the famous three valleys: Aru, Betaab, and Chandanwari via local taxi. Engage with the local culture, take a nature walk, and enjoy the pristine mountain air.' },
            { day: 'Day 7', title: 'Farewell', desc: 'Enjoy a hearty final breakfast. Your driver will pick you up and drop you off at the Srinagar Airport with ample time for your departure flight.' }
        ]
    }
};

document.addEventListener('DOMContentLoaded', () => {
    // Check if we're on the booking page
    const bookingForm = document.getElementById('tour-checkout-form');
    if (bookingForm) {
        // Parse URL Parameters
        const urlParams = new URLSearchParams(window.location.search);
        let pkgId = urlParams.get('pkg');
        
        let pkgData = tourPackages[pkgId];
        
        // Fallback to best package if invalid or missing ID
        if (!pkgData) {
            pkgId = 'pkg-best';
            pkgData = tourPackages[pkgId];
        }

        // 1. Populate UI with Package Data
        document.getElementById('detail-title').textContent = pkgData.title;
        document.getElementById('detail-duration').innerHTML = `<i class="fas fa-calendar-alt"></i> ${pkgData.duration}`;
        document.getElementById('detail-pax-info').innerHTML = `<i class="fas fa-users"></i> Default ${pkgData.pax} Pax`;
        document.getElementById('detail-desc').textContent = pkgData.desc;
        document.getElementById('detail-img').src = pkgData.img;
        document.getElementById('detail-tag').textContent = pkgData.tag;
        
        // Cost per person calculation
        const costPerPerson = Math.round(pkgData.basePrice / pkgData.pax);
        document.getElementById('calc-base-price').textContent = `₹${costPerPerson.toLocaleString()}`;

        // Generate Itinerary
        const itineraryContainer = document.getElementById('detail-itinerary');
        let itineraryHTML = '';
        pkgData.itinerary.forEach(day => {
            itineraryHTML += `
                <div class="timeline-item">
                    <div class="timeline-day"><span>${day.day}</span></div>
                    <div class="timeline-content">
                        <h4>${day.title}</h4>
                        <p>${day.desc}</p>
                    </div>
                </div>
            `;
        });
        itineraryContainer.innerHTML = itineraryHTML;

        // 2. Booking Calculator Logic
        const guestsInput = document.getElementById('book-guests');
        const btnMinus = document.getElementById('btn-minus');
        const btnPlus = document.getElementById('btn-plus');
        
        const subtotalEl = document.getElementById('summary-subtotal');
        const taxEl = document.getElementById('summary-tax');
        const totalEl = document.getElementById('summary-total');

        // Initial values
        guestsInput.value = pkgData.pax;

        function calculateTotal() {
            let pax = parseInt(guestsInput.value) || 1;
            if (pax < 1) { pax = 1; guestsInput.value = 1; }

            const subtotal = costPerPerson * pax;
            const taxes = Math.round(subtotal * 0.05); // 5% GST/Taxes
            const grandTotal = subtotal + taxes;

            subtotalEl.textContent = `₹${subtotal.toLocaleString()}`;
            taxEl.textContent = `₹${taxes.toLocaleString()}`;
            totalEl.textContent = `₹${grandTotal.toLocaleString()}`;
        }

        btnMinus.addEventListener('click', () => {
            if (guestsInput.value > 1) {
                guestsInput.value = parseInt(guestsInput.value) - 1;
                calculateTotal();
            }
        });

        btnPlus.addEventListener('click', () => {
            if (guestsInput.value < 50) {
                guestsInput.value = parseInt(guestsInput.value) + 1;
                calculateTotal();
            }
        });

        guestsInput.addEventListener('change', calculateTotal);
        calculateTotal();

        // 3. WhatsApp Integration
        document.getElementById('btn-book-whatsapp').addEventListener('click', () => {
            const name = document.getElementById('book-name').value;
            const phone = document.getElementById('book-phone').value;
            const date = document.getElementById('book-date').value;
            const pax = guestsInput.value;
            
            if (!name || !phone || !date) {
                alert('Please fill out your Name, Phone Number, and Travel Date to proceed.');
                return;
            }

            const cleanTotal = totalEl.textContent;
            let waMessage = `Hi Bilal Bhai! I'd like to book a tour.\n\n`;
            waMessage += `*Tour:* ${pkgData.title}\n`;
            waMessage += `*Name:* ${name}\n`;
            waMessage += `*Phone:* ${phone}\n`;
            waMessage += `*Travel Date:* ${date}\n`;
            waMessage += `*Group Size:* ${pax} Person(s)\n\n`;
            waMessage += `*Estimated Total:* ${cleanTotal} (Including 5% Tax)`;

            const waUrl = `https://wa.me/917889528922?text=${encodeURIComponent(waMessage)}`;
            window.open(waUrl, '_blank');
        });
    }
});
