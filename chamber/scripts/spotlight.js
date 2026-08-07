async function loadSpotlights() {
    const spotlightContainer = document.getElementById('spotlight-cards');
    try {
        const response = await fetch('data/members.json');
        if (!response.ok) throw new Error('Could not load member data');
        const members = await response.json();
        const goldSilverMembers = members.filter(member => member.level === 'Gold' || member.level === 'Silver');

    // Shuffle and select 2 or 3 random members
    const selectedMembers = goldSilverMembers.sort(() => 0.5 - Math.random()).slice(0, 3);

        spotlightContainer.innerHTML = selectedMembers.map(member => `
        <div class="spotlight-card">
            <img src="${member.logo.replace(/^images\\//i, 'Images/')}" alt="${member.name} logo" loading="lazy">
            <h4>${member.name}</h4>
            <p>Phone: ${member.phone}</p>
            <p>Address: ${member.address}</p>
            <a href="${member.website}" target="_blank" rel="noopener">Visit Website</a>
        </div>
    `).join('');
    } catch (error) {
        spotlightContainer.textContent = 'Member spotlights are temporarily unavailable.';
        console.error(error);
    }
}

loadSpotlights();
