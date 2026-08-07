function showModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('open');
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('open');
    }
}

document.querySelectorAll('.modal-trigger').forEach((button) => {
    button.addEventListener('click', () => showModal(button.dataset.modal));
});

document.querySelectorAll('.close-btn').forEach((button) => {
    button.addEventListener('click', () => closeModal(button.dataset.modal));
});

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


// Set current year in the footer
document.getElementById("current-year").textContent = new Date().getFullYear();

// Set the last modified date in the footer
document.getElementById("last-modified").textContent = document.lastModified;

