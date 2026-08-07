const memberList = document.getElementById('member-list');
const gridViewBtn = document.getElementById('grid-view-btn');
const listViewBtn = document.getElementById('list-view-btn');
const menuButton = document.getElementById('menu-button');
const primaryNav = document.getElementById('primary-nav');

function memberCard(member) {
    const card = document.createElement('article');
    card.className = 'member-card';

    if (member.logo) {
        const image = document.createElement('img');
        image.src = member.logo.replace(/^images\//i, 'Images/');
        image.alt = `${member.name} logo`;
        image.loading = 'lazy';
        card.append(image);
    }

    const name = document.createElement('h3');
    name.textContent = member.name;
    card.append(name);

    const details = document.createElement('p');
    details.textContent = member.address || member.info || 'Chamber member';
    card.append(details);

    const level = document.createElement('p');
    level.className = 'membership-level';
    level.textContent = `${member.level} member`;
    card.append(level);

    if (member.phone) {
        const phone = document.createElement('p');
        phone.textContent = member.phone;
        card.append(phone);
    }

    if (member.website) {
        const link = document.createElement('a');
        link.href = member.website;
        link.target = '_blank';
        link.rel = 'noopener';
        link.textContent = 'Visit website';
        card.append(link);
    }
    return card;
}

function displayMembers(members, view = 'grid') {
    memberList.className = view;
    memberList.replaceChildren(...members.map(memberCard));
    gridViewBtn.setAttribute('aria-pressed', String(view === 'grid'));
    listViewBtn.setAttribute('aria-pressed', String(view === 'list'));
}

async function loadMembers() {
    try {
        const response = await fetch('data/members.json');
        if (!response.ok) throw new Error('Could not load member data');
        const members = await response.json();
        displayMembers(members);
        gridViewBtn.addEventListener('click', () => displayMembers(members, 'grid'));
        listViewBtn.addEventListener('click', () => displayMembers(members, 'list'));
    } catch (error) {
        memberList.innerHTML = '<p>Member directory is temporarily unavailable.</p>';
        console.error(error);
    }
}

document.getElementById('current-year').textContent = new Date().getFullYear();
document.getElementById('last-modified').textContent = document.lastModified;
menuButton.addEventListener('click', () => {
    const open = primaryNav.classList.toggle('open');
    menuButton.setAttribute('aria-expanded', String(open));
    menuButton.setAttribute('aria-label', open ? 'Close navigation menu' : 'Open navigation menu');
    menuButton.textContent = open ? '×' : '☰';
});
loadMembers();
