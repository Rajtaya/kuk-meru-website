document.addEventListener('DOMContentLoaded', function () {
    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('navToggle');
    const navLinks = document.getElementById('navLinks');

    window.addEventListener('scroll', function () {
        navbar.classList.toggle('scrolled', window.scrollY > 50);
    });

    navToggle.addEventListener('click', function () {
        navLinks.classList.toggle('active');
    });

    navLinks.querySelectorAll('a').forEach(function (link) {
        link.addEventListener('click', function () {
            navLinks.classList.remove('active');
        });
    });

    var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    document.querySelectorAll(
        '.vm-card, .stat-card, .info-card, .infra-card, .research-detail, ' +
        '.research-stat, .skill-card, .collab-card, .intl-card, .entre-card-large, ' +
        '.entre-card-small, .rank-card, .inclusive-card, .nep-card, .facility-item'
    ).forEach(function (el) {
        el.classList.add('animate-on-scroll');
        observer.observe(el);
    });

    var style = document.createElement('style');
    style.textContent =
        '.animate-on-scroll { opacity: 0; transform: translateY(24px); transition: opacity 0.6s ease-out, transform 0.6s ease-out; }' +
        '.animate-on-scroll.visible { opacity: 1; transform: translateY(0); }';
    document.head.appendChild(style);

    var cardSelectors = [
        '.vm-card', '.stat-card', '.info-card', '.infra-card',
        '.skill-card', '.collab-card', '.intl-card',
        '.entre-card-large', '.entre-card-small',
        '.rank-card', '.inclusive-card', '.nep-card', '.facility-item'
    ];
    document.querySelectorAll(cardSelectors.join(', ')).forEach(function (card) {
        card.classList.add('clickable-card');
        if (!card.hasAttribute('data-href')) {
            card.setAttribute('data-href', '#');
        }
        card.addEventListener('click', function (e) {
            if (e.target.closest('a')) return;
            var href = card.getAttribute('data-href');
            if (href && href !== '#') {
                window.open(href, '_blank');
            }
        });
    });
});
