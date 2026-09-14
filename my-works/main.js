// ===== ГОЛОВНИЙ ФАЙЛ: Перемикання вкладок та ініціалізація =====

// Звуки (Web Audio API)
let audioCtx = null;

function initAudio() {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
}

function playJumpSound() {
    initAudio();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.type = 'sine';
    osc.frequency.setValueAtTime(400, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(800, audioCtx.currentTime + 0.1);
    gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.15);
    osc.start(audioCtx.currentTime);
    osc.stop(audioCtx.currentTime + 0.15);
}

function playScoreSound() {
    initAudio();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.type = 'sine';
    osc.frequency.setValueAtTime(600, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1200, audioCtx.currentTime + 0.15);
    gain.gain.setValueAtTime(0.25, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.2);
    osc.start(audioCtx.currentTime);
    osc.stop(audioCtx.currentTime + 0.2);
}

function playGameOverSound() {
    initAudio();
    const notes = [400, 350, 300, 250];
    notes.forEach((freq, i) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.type = 'square';
        osc.frequency.setValueAtTime(freq, audioCtx.currentTime + i * 0.15);
        gain.gain.setValueAtTime(0.2, audioCtx.currentTime + i * 0.15);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + i * 0.15 + 0.15);
        osc.start(audioCtx.currentTime + i * 0.15);
        osc.stop(audioCtx.currentTime + i * 0.15 + 0.15);
    });
}

// Перемикання вкладок
function switchTab(tabId) {
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
    event.target.classList.add('active');
    document.getElementById(tabId + '-tab').classList.add('active');
    const addSection = document.getElementById('add-question-section');
    if (tabId === 'quiz') addSection.classList.remove('hidden');
    else addSection.classList.add('hidden');
    if (tabId === 'quotes') fetchQuote();
    if (tabId === 'game') initGame();
}

// Ініціалізація при завантаженні
document.addEventListener('DOMContentLoaded', function() {
    // Квіз
    updateTotalQuestions();
    loadCustomQuestions();
    renderCustomQuestions();
    document.getElementById('start-btn').addEventListener('click', startQuiz);
    document.getElementById('next-btn').addEventListener('click', nextQuestion);
    document.getElementById('restart-btn').addEventListener('click', restartQuiz);
    document.getElementById('add-question-form').addEventListener('submit', addQuestion);

    // Цілі
    loadStickers();
    renderStickers();
    document.getElementById('add-sticker-btn').addEventListener('click', addSticker);
    document.getElementById('sticker-input').addEventListener('keypress', e => { if (e.key === 'Enter') addSticker(); });

    // Цитати
    document.getElementById('new-quote-btn').addEventListener('click', fetchQuote);
    document.getElementById('retry-btn').addEventListener('click', fetchQuote);

    // Гра
    document.getElementById('game-start-btn').addEventListener('click', startGame);
    document.getElementById('game-restart-btn').addEventListener('click', () => { initGame(); startGame(); });
    document.getElementById('game-win-restart-btn').addEventListener('click', () => { initGame(); startGame(); });
});
