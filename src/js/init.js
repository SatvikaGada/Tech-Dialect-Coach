// Initialization
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    generateWaveform();
    updateAnalytics();
    addSecurityFeatures();

    // Load saved questions - FIXED VERSION
    const savedQuestions = localStorage.getItem('speechai_questions');
    if (savedQuestions) {
        // Merge loaded questions instead of reassigning
        const loadedQuestions = JSON.parse(savedQuestions);
        Object.assign(questions.general, loadedQuestions.general || []);
        Object.assign(questions.interview, loadedQuestions.interview || []);
    }

    // Welcome message
    setTimeout(() => {
        showNotification('Welcome to SpeechAI Pro! Select a category and get your first question.');
    }, 1000);

    // Keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        if (e.ctrlKey || e.metaKey) {
            switch(e.key) {
                case 'r': e.preventDefault(); toggleRecording(); break;
                case 'n': e.preventDefault(); getNewQuestion(); break;
                case 'a':
                    if (!document.getElementById('analyze-btn').disabled) {
                        analyzeResponse();
                    }
                    break;
            }
        }
    });

    // Performance monitoring
    let performanceData = {
        loadTime: performance.now(),
        interactions: 0
    };
    document.addEventListener('click', function() {
        performanceData.interactions++;
    });

    // Auto-save progress
    setInterval(function() {
        if (userSessions.length > 0) {
            localStorage.setItem('speechai_sessions', JSON.stringify(userSessions));
        }
    }, 30000);
});