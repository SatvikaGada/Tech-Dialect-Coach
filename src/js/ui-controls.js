// Tab Switching (Practice/Contribute/Analytics)
function setupTabSwitching() {
    const practiceTab = document.getElementById('practice-tab');
    const contributeTab = document.getElementById('contribute-tab');
    const analyticsTab = document.getElementById('analytics-tab');

    practiceTab.addEventListener('click', () => switchTab('practice'));
    contributeTab.addEventListener('click', () => switchTab('contribute'));
    analyticsTab.addEventListener('click', () => switchTab('analytics'));
}

function switchTab(tabName) {
    // Hide all sections
    document.querySelectorAll('.question-section').forEach(section => {
        section.classList.remove('active');
    });

    // Show selected section
    document.getElementById(`${tabName}-section`).classList.add('active');

    // Update active tab styling
    document.querySelectorAll('.nav-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    document.getElementById(`${tabName}-tab`).classList.add('active');
}

// Category Switching (General/CS Interview) - NEW FUNCTION
function setupCategorySwitching() {
    const generalBtn = document.querySelector('.category-btn[data-category="general"]');
    const interviewBtn = document.querySelector('.category-btn[data-category="interview"]');

    generalBtn.addEventListener('click', () => selectCategory('general'));
    interviewBtn.addEventListener('click', () => selectCategory('interview'));
}

function selectCategory(category) {
    currentCategory = category;

    // Update active category button
    document.querySelectorAll('.category-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');

    // Update category display
    document.getElementById('question-category').textContent =
        `Category: ${category === 'general' ? 'General' : 'CS Interview'}`;

    // Load a new question from selected category
    getNewQuestion();
}

// Initialize everything when DOM loads
document.addEventListener('DOMContentLoaded', () => {
    setupTabSwitching();
    setupCategorySwitching();
});