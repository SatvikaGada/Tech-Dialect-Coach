// Audio Recording
async function toggleRecording() {
    if (!isRecording) {
        await startRecording();
    } else {
        stopRecording();
    }
}

async function startRecording() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaRecorder = new MediaRecorder(stream);
        audioChunks = [];

        mediaRecorder.ondataavailable = event => {
            audioChunks.push(event.data);
        };

        mediaRecorder.onstop = () => {
            const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
            document.getElementById('analyze-btn').disabled = false;
        };

        mediaRecorder.start();
        isRecording = true;
        document.getElementById('record-btn').classList.add('recording');
        document.getElementById('recording-status').textContent = 'Recording... Click to stop';
        animateWaveform();
    } catch (error) {
        showNotification('Microphone access denied. Please allow microphone access.', 'error');
    }
}

function stopRecording() {
    if (mediaRecorder && isRecording) {
        mediaRecorder.stop();
        mediaRecorder.stream.getTracks().forEach(track => track.stop());
        isRecording = false;

        document.getElementById('record-btn').classList.remove('recording');
        document.getElementById('recording-status').textContent = 'Recording complete! Click analyze to see results.';

        stopWaveformAnimation();
    }
}

// Waveform Visualization
function generateWaveform() {
    const waveform = document.getElementById('waveform');
    waveform.innerHTML = '';

    for (let i = 0; i < 50; i++) {
        const bar = document.createElement('div');
        bar.className = 'wave-bar';
        bar.style.height = '10px';
        waveform.appendChild(bar);
    }
}

function animateWaveform() {
    const bars = document.querySelectorAll('.wave-bar');

    const animate = () => {
        if (!isRecording) return;

        bars.forEach(bar => {
            const height = Math.random() * 40 + 10;
            bar.style.height = height + 'px';
        });

        setTimeout(animate, 100);
    };

    animate();
}

function stopWaveformAnimation() {
    const bars = document.querySelectorAll('.wave-bar');
    bars.forEach(bar => {
        bar.style.height = '10px';
    });
}