// Security Features
function addSecurityFeatures() {
    // Rate limiting for question requests
    let requestCount = 0;
    const originalGetNewQuestion = getNewQuestion;

    getNewQuestion = function() {
        requestCount++;
        if (requestCount > 20) {
            showNotification('Rate limit exceeded. Please wait before requesting more questions.', 'error');
            return;
        }
        originalGetNewQuestion();
    };

    // Reset rate limit every minute
    setInterval(() => {
        requestCount = 0;
    }, 60000);

    // Monitor for suspicious activity
    document.addEventListener('copy', () => {
        logSecurityEvent('content_copy', { timestamp: new Date().toISOString() });
    });

    // Secure session management
    if (!sessionStorage.getItem('speechai_session')) {
        sessionStorage.setItem('speechai_session', generateSecureToken());
    }

    // Update security indicator
    updateSecurityStatus();
}

function sanitizeInput(input) {
    // Basic XSS prevention
    return input.replace(/[<>\"']/g, function(match) {
        switch(match) {
            case '<': return '&lt;';
            case '>': return '&gt;';
            case '"': return '&quot;';
            case "'": return '&#x27;';
            default: return match;
        }
    });
}

function generateSecureToken() {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

function logSecurityEvent(eventType, data) {
    const securityLogs = JSON.parse(localStorage.getItem('speechai_security_logs') || '[]');
    securityLogs.push({
        timestamp: new Date().toISOString(),
        event: eventType,
        data: data,
        userAgent: navigator.userAgent,
        sessionToken: sessionStorage.getItem('speechai_session')
    });

    // Keep only last 100 logs
    if (securityLogs.length > 100) {
        securityLogs.splice(0, securityLogs.length - 100);
    }

    localStorage.setItem('speechai_security_logs', JSON.stringify(securityLogs));
}

function updateSecurityStatus() {
    const isSecure = location.protocol === 'https:' || location.hostname === 'localhost';
    const indicator = document.querySelector('.security-status');

    if (isSecure) {
        indicator.style.background = '#00b894';
    } else {
        indicator.style.background = '#fdcb6e';
    }
}

// Utility Functions
function showNotification(message, type = 'success') {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.style.display = 'block';
    notification.style.background = type === 'error' ? '#e17055' : '#00b894';

    setTimeout(() => {
        notification.style.display = 'none';
    }, 3000);
}

// Machine Learning Simulation
function simulateMLAnalysis(audioData) {
    // In a real application, this would:
    // 1. Send audio to speech-to-text API
    // 2. Analyze phonemes for pronunciation
    // 3. Use BERT embeddings for semantic analysis
    // 4. Apply ML models for fluency and confidence scoring

    return {
        transcription: "Simulated transcription of user speech...",
        phonemeAnalysis: "Detected mispronunciation in 'th' sounds",
        semanticSimilarity: 0.85,
        fluencyScore: 78,
        confidenceLevel: 82
    };
}

// Advanced Features
function exportProgress() {
    const data = {
        sessions: userSessions,
        questions: questions,
        analytics: {
            totalSessions: userSessions.length,
            averageScore: userSessions.reduce((sum, s) => sum + s.overallScore, 0) / userSessions.length
        }
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'speechai_progress.json';
    a.click();
    URL.revokeObjectURL(url);
}

// Voice Activity Detection (simplified)
function detectVoiceActivity(audioStream) {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const source = audioContext.createMediaStreamSource(audioStream);
    const analyser = audioContext.createAnalyser();

    source.connect(analyser);
    analyser.fftSize = 256;

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const checkActivity = () => {
        analyser.getByteFrequencyData(dataArray);
        const average = dataArray.reduce((sum, value) => sum + value) / bufferLength;

        // Simple voice activity detection
        if (average > 50) {
            // Voice detected
            document.querySelector('.record-btn').style.boxShadow = '0 0 20px rgba(255, 107, 107, 0.8)';
        } else {
            document.querySelector('.record-btn').style.boxShadow = '0 10px 20px rgba(255, 107, 107, 0.3)';
        }

        if (isRecording) {
            requestAnimationFrame(checkActivity);
        }
    };

    checkActivity();
}
