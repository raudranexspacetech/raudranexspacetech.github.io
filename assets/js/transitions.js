document.addEventListener('DOMContentLoaded', () => {
    const transitionOverlay = document.createElement('div');
    transitionOverlay.classList.add('page-transition');
    document.body.appendChild(transitionOverlay);

    // On page load, trigger the fade-in animation for the page
    window.setTimeout(() => {
        document.body.classList.add('is-animating-in');
    }, 100); // Small delay to ensure transition is applied

    // Intercept navigation
    const navLinks = document.querySelectorAll('.main-nav a, .logo a, .cta-button');

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');

            // Ignore links that open in a new tab or are not local
            if (link.target === '_blank' || !href || !href.startsWith('/') && !href.startsWith('.')) {
                return;
            }

            e.preventDefault();

            // Trigger the fade-out animation
            document.body.classList.add('is-animating-out');
            document.body.classList.remove('is-animating-in');

            // Wait for the animation to finish, then navigate
            setTimeout(() => {
                window.location.href = href;
            }, 500); // This duration should match the CSS transition duration
        });
    });
});
