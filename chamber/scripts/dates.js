document.getElementById('current-year').textContent = new Date().getFullYear();
document.getElementById('last-modified').textContent = document.lastModified;

const menuButton = document.getElementById('menu-button');
const primaryNav = document.getElementById('primary-nav');

if (menuButton && primaryNav) {
    menuButton.addEventListener('click', () => {
        const open = primaryNav.classList.toggle('open');
        menuButton.setAttribute('aria-expanded', String(open));
        menuButton.setAttribute('aria-label', open ? 'Close navigation menu' : 'Open navigation menu');
        menuButton.textContent = open ? '×' : '☰';
    });
}
