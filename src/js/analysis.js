function analyzeResponse() {
    if (!currentQuestionData) {
        showNotification('Please select a question first!', 'error');
        return;
    }

    // Show loading state
    document.getElementById('analyze-btn').innerHTML = '<div class="loading"></div>Analyzing...';
    document.getElementById('analyze-btn').disabled = true;

    // Simulate AI processing time
    setTimeout(() => {
        // Generate realistic scores with some randomness
        const scores = generateAnalysisScores();

        // Update score displays
        document.getElementById('pronunciation-score').textContent = scores.pronunciation + '%';
        document.getElementById('grammar-score').textContent = scores.grammar + '%';
        document.getElementById('fluency-score').textContent = scores.fluency + '%';
        document.getElementById('confidence-score').textContent = scores.confidence + '%';

        // Generate feedback
        const feedback = generateFeedback(scores);
        updateFeedbackList(feedback);

        // Show sample response
        document.getElementById('sample-response').textContent = currentQuestionData.sample;

        // Show analysis panel
        document.getElementById('analysis-panel').classList.add('show');

        // Save session data
        saveSession(scores);

        // Reset button
        document.getElementById('analyze-btn').innerHTML = 'Analyze Response';

        showNotification('Analysis complete! Check your detailed feedback below.');

    }, 2000);
}

function generateAnalysisScores() {
    // Simulate realistic score generation with some learning curve
    const sessionCount = userSessions.length;
    const baseImprovement = Math.min(sessionCount * 2, 20); // Cap improvement

    return {
        pronunciation: Math.min(Math.max(70 + Math.random() * 25 + baseImprovement, 60), 95),
        grammar: Math.min(Math.max(75 + Math.random() * 20 + baseImprovement, 65), 98),
        fluency: Math.min(Math.max(68 + Math.random() * 27 + baseImprovement, 55), 92),
        confidence: Math.min(Math.max(72 + Math.random() * 23 + baseImprovement, 60), 90)
    };
}

function generateFeedback(scores) {
    const feedback = [];

    if (scores.pronunciation < 80) {
        feedback.push("Focus on clear consonant sounds, particularly 'th' and 'r' sounds typical in UK English");
    }

    if (scores.grammar < 85) {
        feedback.push("Pay attention to verb tenses and subject-verb agreement");
    }

    if (scores.fluency < 75) {
        feedback.push("Try to reduce filler words like 'um', 'uh', and 'like'");
    }

    if (scores.confidence < 70) {
        feedback.push("Speak with more conviction - avoid uptalk at the end of statements");
    }

    // Add positive feedback
    if (scores.pronunciation >= 85) {
        feedback.push("Excellent pronunciation! Your UK English accent is clear and professional");
    }

    if (scores.grammar >= 90) {
        feedback.push("Outstanding grammar usage - your sentence structure is precise");
    }

    // Add keyword-based feedback
    feedback.push(`Include keywords: ${currentQuestionData.keywords.join(', ')} to strengthen your response`);

    return feedback;
}

function updateFeedbackList(feedback) {
    const feedbackList = document.getElementById('feedback-list');
    feedbackList.innerHTML = '';

    feedback.forEach(item => {
        const li = document.createElement('li');
        li.className = 'feedback-item';
        li.textContent = item;
        feedbackList.appendChild(li);
    });
}

// Session Management
function saveSession(scores) {
    const session = {
        date: new Date().toISOString(),
        category: currentCategory,
        question: currentQuestionData.text,
        scores: scores,
        overallScore: Math.round((scores.pronunciation + scores.grammar + scores.fluency + scores.confidence) / 4)
    };

    userSessions.push(session);
    localStorage.setItem('speechai_sessions', JSON.stringify(userSessions));
    updateAnalytics();
}

function updateAnalytics() {
    const totalSessions = userSessions.length;
    document.getElementById('total-sessions').textContent = totalSessions;

    if (totalSessions > 0) {
        const avgScore = userSessions.reduce((sum, session) => sum + session.overallScore, 0) / totalSessions;
        document.getElementById('avg-score').textContent = Math.round(avgScore) + '%';

        // Calculate improvement
        if (totalSessions >= 2) {
            const recent = userSessions.slice(-5);
            const older = userSessions.slice(0, Math.max(1, totalSessions - 5));
            const recentAvg = recent.reduce((sum, s) => sum + s.overallScore, 0) / recent.length;
            const olderAvg = older.reduce((sum, s) => sum + s.overallScore, 0) / older.length;
            const improvement = Math.round(recentAvg - olderAvg);
            document.getElementById('improvement').textContent = (improvement > 0 ? '+' : '') + improvement + '%';
        }

        // Calculate streak (simplified)
        const today = new Date().toDateString();
        const yesterday = new Date(Date.now() - 86400000).toDateString();
        const lastSession = new Date(userSessions[userSessions.length - 1].date).toDateString();

        if (lastSession === today || lastSession === yesterday) {
            document.getElementById('streak').textContent = '1+';
        }

        // Update insights
        updateAnalyticsInsights();
    }
}

function updateAnalyticsInsights() {
    const insights = [];

    if (userSessions.length >= 5) {
        const recent = userSessions.slice(-5);
        const avgPronunciation = recent.reduce((sum, s) => sum + s.scores.pronunciation, 0) / recent.length;
        const avgGrammar = recent.reduce((sum, s) => sum + s.scores.grammar, 0) / recent.length;
        const avgFluency = recent.reduce((sum, s) => sum + s.scores.fluency, 0) / recent.length;
        const avgConfidence = recent.reduce((sum, s) => sum + s.scores.confidence, 0) / recent.length;

        const weakest = Math.min(avgPronunciation, avgGrammar, avgFluency, avgConfidence);

        if (weakest === avgPronunciation) {
            insights.push("Focus on pronunciation practice - consider watching UK English pronunciation videos");
        } else if (weakest === avgGrammar) {
            insights.push("Review grammar fundamentals - your sentence structure could be improved");
        } else if (weakest === avgFluency) {
            insights.push("Practice speaking without pauses - try reading aloud daily");
        } else {
            insights.push("Work on confidence - practice power poses before speaking");
        }

        insights.push(`You've completed ${userSessions.length} sessions - consistency is key to improvement!`);

        if (userSessions.length >= 10) {
            insights.push("Excellent dedication! Consider recording yourself for self-assessment");
        }
    }

    const insightsList = document.getElementById('analytics-insights');
    insightsList.innerHTML = '';

    insights.forEach(insight => {
        const li = document.createElement('li');
        li.className = 'feedback-item';
        li.textContent = insight;
        insightsList.appendChild(li);
    });
}

// Question Contribution
function contributeQuestion() {
    const category = document.getElementById('contribute-category').value;
    const questionText = document.getElementById('contribute-question').value.trim();
    const keywords = document.getElementById('contribute-keywords').value.trim();
    const sampleAnswer = document.getElementById('contribute-sample').value.trim();

    // Input validation with security checks
    if (!questionText || questionText.length < 10) {
        showNotification('Question must be at least 10 characters long', 'error');
        return;
    }

    if (!keywords) {
        showNotification('Please provide at least one keyword', 'error');
        return;
    }

    if (!sampleAnswer || sampleAnswer.length < 20) {
        showNotification('Sample answer must be at least 20 characters long', 'error');
        return;
    }

    // Sanitize inputs (basic XSS prevention)
    const sanitizedQuestion = sanitizeInput(questionText);
    const sanitizedKeywords = sanitizeInput(keywords);
    const sanitizedSample = sanitizeInput(sampleAnswer);

    // Create new question object
    const newQuestion = {
        text: sanitizedQuestion,
        keywords: sanitizedKeywords.split(',').map(k => k.trim()),
        sample: sanitizedSample,
        contributed: true,
        date: new Date().toISOString()
    };

    // Add to questions array
    questions[category].push(newQuestion);

    // In a real application, this would be sent to the backend
    // For demo purposes, we'll store in localStorage
    localStorage.setItem('speechai_questions', JSON.stringify(questions));

    // Clear form
    document.getElementById('contribute-question').value = '';
    document.getElementById('contribute-keywords').value = '';
    document.getElementById('contribute-sample').value = '';

    showNotification('Question contributed successfully! Thank you for helping improve the platform.');

    // Log contribution for security monitoring
    logSecurityEvent('question_contribution', { category, length: questionText.length });
}

