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
        if (!card.hasAttribute('data-href') && !card.hasAttribute('data-img')) {
            card.setAttribute('data-href', '#');
        }
        card.addEventListener('click', function (e) {
            if (e.target.closest('a')) return;
            if (card.hasAttribute('data-img')) return;
            var href = card.getAttribute('data-href');
            if (href && href !== '#') {
                window.open(href, '_blank');
            }
        });
    });

    // Card image preview (facility cards, info cards, etc.)
    var activePreview = null;
    var activeCard = null;
    document.querySelectorAll('[data-img]').forEach(function (item) {
        item.addEventListener('click', function (e) {
            if (e.target.closest('a')) return;

            // If clicking the same card, close it
            if (activeCard === item && activePreview) {
                var closing = activePreview;
                closing.classList.remove('open');
                item.classList.remove('active');
                activePreview = null;
                activeCard = null;
                setTimeout(function () { closing.remove(); }, 400);
                return;
            }

            // Close any existing preview
            if (activePreview) {
                var old = activePreview;
                old.classList.remove('open');
                if (activeCard) activeCard.classList.remove('active');
                activePreview = null;
                activeCard = null;
                setTimeout(function () { old.remove(); }, 400);
            }

            // Build new preview
            var preview = document.createElement('div');
            preview.className = 'facility-preview';
            var srcs = item.getAttribute('data-img').split(',');
            srcs.forEach(function (src) {
                var img = document.createElement('img');
                img.src = src.trim();
                img.alt = item.getAttribute('data-alt') || '';
                img.loading = 'lazy';
                preview.appendChild(img);
            });

            // Insert after the clicked item
            item.after(preview);
            item.classList.add('active');

            // Force layout reflow then add open class for animation
            preview.offsetHeight;
            preview.classList.add('open');

            activePreview = preview;
            activeCard = item;
        });
    });
});
