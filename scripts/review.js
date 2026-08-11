// Handle localStorage counter on review confirmation page
document.addEventListener('DOMContentLoaded', function() {
    // Get current count from localStorage or initialize to 0
    let reviewCount = parseInt(localStorage.getItem('reviewCount')) || 0;
    
    // Increment the count
    reviewCount++;
    
    // Save updated count back to localStorage
    localStorage.setItem('reviewCount', reviewCount);
    
    // Display the count
    document.getElementById('reviewCount').textContent = reviewCount;
});