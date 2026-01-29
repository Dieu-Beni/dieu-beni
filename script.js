// Initialiser EmailJS avec votre user ID
emailjs.init('LTbzPVpiChR3t4eBe');
// Gestion du formulaire de contact
const form = document.getElementById('contactForm');
const menuIcon = document.getElementById('menuIcon');
const themeToggle = document.getElementById('themeToggle');

const yearSpan = document.getElementById('currentYear');

// Mettre à jour l'année courante dans le footer
if (yearSpan) {
    const currentYear = new Date().getFullYear();
    yearSpan.textContent = currentYear;
}

// Fonction pour basculer entre les thèmes clair et sombre
function toggleTheme() {
    document.body.classList.toggle('light-mode');
    if (document.body.classList.contains('light-mode')) {
        themeToggle.classList.remove('bi-sun');
        themeToggle.classList.add('bi-moon');
    } else {
        themeToggle.classList.remove('bi-moon');
        themeToggle.classList.add('bi-sun');
    }
}

// Fonction pour afficher/masquer le menu de navigation


function showMenu() {
    const navbar = document.querySelector('.navbar');
    if (navbar.style.display === 'flex') {
        navbar.style.display = 'none';
        menuIcon.classList.remove('bi-x-lg');
        menuIcon.classList.add('bi-list');
    } else {
        navbar.style.display = 'flex';
        menuIcon.classList.remove('bi-list');
        menuIcon.classList.add('bi-x-lg');
    }
}
form.addEventListener('submit', function(event) {

    event.preventDefault(); // Empêcher le rechargement de la page
    // Récupérer les valeurs du formulaire
    const templateParams = {
        name:  document.getElementById('name').value,
        email: document.getElementById('email').value,
        message: document.getElementById('message').value
    };

    // Envoyer l'email via EmailJS
    emailjs.send('service_ac2akcp', 'template_0pcfaeo', templateParams)
        .then(function(response) {
            alert('SUCCESS!', response.status, response.text);

        }, function(error) {
            alert('FAILED...', error);
        });

    // Réinitialiser le formulaire
    form.reset();
});
// Carrousel functionality
document.addEventListener('DOMContentLoaded', function() {
    // Initialiser tous les carrousels
    
    document.querySelectorAll('.project-carousel').forEach(carousel => {
        const slides = carousel.querySelectorAll('.carousel-slide');
        const prevBtn = carousel.querySelector('.prev-btn');
        const nextBtn = carousel.querySelector('.next-btn');
        const currentSlideSpan = carousel.querySelector('.current-slide');
        const totalSlidesSpan = carousel.querySelector('.total-slides');

        let currentSlide = 0;
        
        // Mettre à jour le compteur total
        if (totalSlidesSpan) {
            totalSlidesSpan.textContent = slides.length;
        }
        
        function showSlide(index) {
            // Masquer toutes les slides
            slides.forEach(slide => {
                slide.classList.remove('active');
            });
            
            // Afficher la slide active
            slides[index].classList.add('active');
            
            // Mettre à jour le compteur
            if (currentSlideSpan) {
                currentSlideSpan.textContent = index + 1;
            }
            
            currentSlide = index;
        }
        
        // Navigation avec les flèches
        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                let newIndex = currentSlide - 1;
                if (newIndex < 0) newIndex = slides.length - 1;
                showSlide(newIndex);
            });
        }
        
        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                let newIndex = currentSlide + 1;
                if (newIndex >= slides.length) newIndex = 0;
                showSlide(newIndex);
            });
        }
        
        // Navigation au clavier
        carousel.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') {
                let newIndex = currentSlide - 1;
                if (newIndex < 0) newIndex = slides.length - 1;
                showSlide(newIndex);
            } else if (e.key === 'ArrowRight') {
                let newIndex = currentSlide + 1;
                if (newIndex >= slides.length) newIndex = 0;
                showSlide(newIndex);
            }
        });
        
        // Rendre le carrousel focusable pour la navigation clavier
        carousel.setAttribute('tabindex', '0');
        
        // Initialiser la première slide
        showSlide(0);
    });
});


// Gestionnaire de navigation active au scroll
document.addEventListener('DOMContentLoaded', initNavScroll);

function initNavScroll() {
    const navLinks = document.querySelectorAll('.navLink');
    const sections = document.querySelectorAll('section');
    
    // Vérification des éléments nécessaires
    if (navLinks.length === 0 || sections.length === 0) {
        console.warn('Navigation: éléments manquants (liens ou sections)');
        return;
    }
    
    let isScrolling = false;
    let scrollTimer;
    let lastKnownScrollPosition = 0;
    
    // --- FONCTION PRINCIPALE ---
    function updateActiveLink() {
        // Ne pas exécuter pendant le scroll fluide
        if (isScrolling) return;
        
        const scrollPosition = window.scrollY + (window.innerHeight / 3);
        let closestSection = null;
        let smallestDistance = Infinity;
        
        // Trouver la section la plus proche
        sections.forEach(section => {
            const sectionId = section.id;
            if (!sectionId) return;
            
            const sectionElement = document.getElementById(sectionId);
            if (!sectionElement) return;
            
            const sectionTop = sectionElement.offsetTop;
            const sectionHeight = sectionElement.offsetHeight;
            const sectionBottom = sectionTop + sectionHeight;
            
            // Vérifier si la section est dans la zone visible
            const isInViewport = 
                (scrollPosition >= sectionTop && scrollPosition <= sectionBottom) ||
                (scrollPosition >= sectionTop - 100 && scrollPosition <= sectionBottom + 100);
            
            if (isInViewport) {
                // Calculer la distance au centre de la section
                const sectionCenter = sectionTop + (sectionHeight / 2);
                const distance = Math.abs(scrollPosition - sectionCenter);
                
                if (distance < smallestDistance) {
                    smallestDistance = distance;
                    closestSection = sectionId;
                }
            }
        });
        
        // Mettre à jour les liens actifs
        if (closestSection) {
            setActiveLink(`#${closestSection}`);
        }
        
        // Sauvegarder la position pour le debug
        lastKnownScrollPosition = scrollPosition;
    }
    
    // Fonction pour activer un lien spécifique
    function setActiveLink(targetHash) {
        navLinks.forEach(link => {
            const linkHash = link.getAttribute('href');
            
            if (linkHash === targetHash) {
                link.classList.add('active');
                link.setAttribute('aria-current', 'page');
            } else {
                link.classList.remove('active');
                link.removeAttribute('aria-current');
            }
        });
    }
    
    // --- GESTION DU SCROLL AVEC DEBOUNCING ---
    function handleScroll() {
        isScrolling = true;
        
        // Annuler le timer précédent
        clearTimeout(scrollTimer);
        
        // Mettre à jour immédiatement (pour la réactivité)
        updateActiveLink();
        
        // Réinitialiser le flag après un délai
        scrollTimer = setTimeout(() => {
            isScrolling = false;
            // Dernière mise à jour après arrêt du scroll
            updateActiveLink();
        }, 100);
    }
    
    // --- GESTION DES CLICS SUR LES LIENS ---
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Seulement pour les ancres internes
            if (href && href.startsWith('#')) {
                // Activer immédiatement le lien cliqué
                setActiveLink(href);
                
                // Attendre un peu puis recalculer (pour le scroll smooth)
                setTimeout(() => {
                    isScrolling = true;
                    setTimeout(() => {
                        isScrolling = false;
                        updateActiveLink();
                    }, 300);
                }, 100);
            }
        });
    });
    
    // --- ÉVÉNEMENTS ---
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Recalculer lors du redimensionnement
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(updateActiveLink, 150);
    }, { passive: true });
    
    // Initialisation
    updateActiveLink();
    
    // Debug optionnel (à désactiver en production)
    window.debugNavScroll = function() {
        console.log('=== DEBUG Navigation Scroll ===');
        console.log('Liens trouvés:', navLinks.length);
        console.log('Sections trouvées:', sections.length);
        console.log('Scroll position:', lastKnownScrollPosition);
        console.log('Active link:', document.querySelector('.navLink.active')?.getAttribute('href'));
        sections.forEach(s => {
            console.log(`Section #${s.id}: offsetTop=${s.offsetTop}, height=${s.offsetHeight}`);
        });
    };
}