// ===== ГРА: Імпульс мізків (Flappy Bird Style) =====

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let gameRunning = false;
let gameStarted = false;
let gameAnimId = null;
let gameScore = 0;
let gameLives = 3;
let frameCount = 0;

// Пташка
let bird = { x: 80, y: 250, vy: 0, r: 18, wing: 0, wingDir: 1, startDelay: 0 };

// Гравітація та стрибок
const GRAVITY = 0.1;
const JUMP_FORCE = -3.2;
const JUMP_INTERVAL = 120;

// Зірочки що падають з пташки
const SPARKLES = [];

// Стовпчики (перешкоди)
const PIPES = [];
const PIPE_WIDTH = 55;
const PIPE_GAP = 200;
const PIPE_SPEED = 1.5;
const PIPE_SPAWN_INTERVAL = 150;

// Зірки на фоні
const STARS = [];
for (let i = 0; i < 50; i++) {
    STARS.push({ x: Math.random() * 400, y: Math.random() * 500, size: Math.random() * 2 + 0.5, speed: Math.random() * 0.5 + 0.2 });
}

function initGame() {
    if (gameAnimId) cancelAnimationFrame(gameAnimId);
    gameRunning = false;
    gameStarted = false;
    gameScore = 0;
    gameLives = 3;
    frameCount = 0;
    PIPES.length = 0;
    SPARKLES.length = 0;
    bird = { x: 80, y: 250, vy: 0, r: 18, wing: 0, wingDir: 1 };
    updateGameUI();
    drawFlappyFrame();
    document.getElementById('game-start-overlay').classList.remove('hidden');
    document.getElementById('game-over-overlay').classList.add('hidden');
    document.getElementById('game-win-overlay').classList.add('hidden');
}

function startGame() {
    document.getElementById('game-start-overlay').classList.add('hidden');
    document.getElementById('game-over-overlay').classList.add('hidden');
    gameRunning = true;
    gameStarted = true;
    bird = { x: 80, y: 250, vy: 0, r: 18, wing: 0, wingDir: 1, startDelay: 60 };
    PIPES.length = 0;
    SPARKLES.length = 0;
    gameScore = 0;
    gameLives = 3;
    frameCount = 0;
    updateGameUI();
    updateFlappy();
}

function jumpBird() {
    if (!gameRunning) return;
    bird.vy = JUMP_FORCE;
    bird.y += bird.vy;
    playJumpSound();
}

function drawBird(x, y, wingAngle) {
    ctx.save();
    ctx.translate(x, y);
    
    // Тіло
    const bodyGrad = ctx.createRadialGradient(-2, -2, 0, 0, 0, bird.r);
    bodyGrad.addColorStop(0, '#ffdd00');
    bodyGrad.addColorStop(0.6, '#ffaa00');
    bodyGrad.addColorStop(1, '#ff6600');
    ctx.fillStyle = bodyGrad;
    ctx.shadowColor = '#ffaa00';
    ctx.shadowBlur = 15;
    ctx.beginPath();
    ctx.arc(0, 0, bird.r, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
    
    // Крило
    ctx.fillStyle = '#ff8800';
    ctx.beginPath();
    const wingY = Math.sin(wingAngle) * 8;
    ctx.ellipse(-5, wingY, 12, 7, -0.3, 0, Math.PI * 2);
    ctx.fill();
    
    // Очко
    ctx.fillStyle = 'white';
    ctx.beginPath();
    ctx.arc(7, -5, 6, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.fillStyle = '#111';
    ctx.beginPath();
    ctx.arc(9, -5, 3, 0, Math.PI * 2);
    ctx.fill();
    
    // Блиск в оці
    ctx.fillStyle = 'white';
    ctx.beginPath();
    ctx.arc(10, -6, 1.5, 0, Math.PI * 2);
    ctx.fill();
    
    // Дзьоб
    ctx.fillStyle = '#ff4400';
    ctx.beginPath();
    ctx.moveTo(14, 0);
    ctx.lineTo(24, 2);
    ctx.lineTo(14, 6);
    ctx.closePath();
    ctx.fill();
    
    // Щічка
    ctx.fillStyle = 'rgba(255, 100, 100, 0.4)';
    ctx.beginPath();
    ctx.arc(5, 5, 5, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.restore();
}

function addSparkle(x, y) {
    for (let i = 0; i < 3; i++) {
        SPARKLES.push({
            x: x + Math.random() * 10 - 5,
            y: y - 10,
            vx: Math.random() * 2 - 1,
            vy: Math.random() * -2 - 1,
            life: 1,
            size: Math.random() * 4 + 2,
            color: ['#ffdd00', '#ff00ff', '#00f5ff', '#ffffff'][Math.floor(Math.random() * 4)]
        });
    }
}

function updateSparkles() {
    for (let i = SPARKLES.length - 1; i >= 0; i--) {
        const s = SPARKLES[i];
        s.x += s.vx;
        s.y += s.vy;
        s.vy += 0.05;
        s.life -= 0.02;
        if (s.life <= 0) SPARKLES.splice(i, 1);
    }
}

function drawSparkles() {
    SPARKLES.forEach(s => {
        ctx.globalAlpha = s.life;
        ctx.fillStyle = s.color;
        ctx.shadowColor = s.color;
        ctx.shadowBlur = 8;
        ctx.beginPath();
        const spikes = 4;
        const outerR = s.size;
        const innerR = s.size * 0.4;
        for (let i = 0; i < spikes * 2; i++) {
            const r = i % 2 === 0 ? outerR : innerR;
            const angle = (i * Math.PI) / spikes - Math.PI / 2;
            const px = s.x + Math.cos(angle) * r;
            const py = s.y + Math.sin(angle) * r;
            if (i === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
        }
        ctx.closePath();
        ctx.fill();
        ctx.shadowBlur = 0;
    });
    ctx.globalAlpha = 1;
}

function drawFlappyFrame() {
    // Фон
    const bgGrad = ctx.createLinearGradient(0, 0, 0, canvas.height);
    bgGrad.addColorStop(0, '#0a0a2e');
    bgGrad.addColorStop(0.5, '#1a1a4e');
    bgGrad.addColorStop(1, '#0d0d2b');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Зірки
    STARS.forEach(s => {
        ctx.fillStyle = `rgba(255,255,255,${0.3 + Math.sin(frameCount * 0.02 + s.x) * 0.3})`;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
        ctx.fill();
    });

    // Стовпчики
    PIPES.forEach(p => {
        const topGrad = ctx.createLinearGradient(p.x, 0, p.x + PIPE_WIDTH, 0);
        topGrad.addColorStop(0, '#4a0faa');
        topGrad.addColorStop(1, '#7b2fff');
        ctx.fillStyle = topGrad;
        ctx.shadowColor = '#7b2fff';
        ctx.shadowBlur = 12;
        ctx.beginPath();
        ctx.roundRect(p.x, 0, PIPE_WIDTH, p.gapY, 8);
        ctx.fill();

        const bottomY = p.gapY + PIPE_GAP;
        const bottomH = canvas.height - bottomY;
        const botGrad = ctx.createLinearGradient(p.x, bottomY, p.x + PIPE_WIDTH, bottomY);
        botGrad.addColorStop(0, '#4a0faa');
        botGrad.addColorStop(1, '#7b2fff');
        ctx.fillStyle = botGrad;
        ctx.beginPath();
        ctx.roundRect(p.x, bottomY, PIPE_WIDTH, bottomH, 8);
        ctx.fill();

        ctx.strokeStyle = '#ff00ff';
        ctx.lineWidth = 2;
        ctx.shadowColor = '#ff00ff';
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.roundRect(p.x, 0, PIPE_WIDTH, p.gapY, 8);
        ctx.stroke();
        ctx.beginPath();
        ctx.roundRect(p.x, bottomY, PIPE_WIDTH, bottomH, 8);
        ctx.stroke();
        ctx.shadowBlur = 0;

        ctx.fillStyle = 'rgba(0, 245, 255, 0.08)';
        ctx.fillRect(p.x, p.gapY, PIPE_WIDTH, PIPE_GAP);
    });

    drawSparkles();

    bird.wing += 0.25 * bird.wingDir;
    if (bird.wing > 1 || bird.wing < -1) bird.wingDir *= -1;
    drawBird(bird.x, bird.y, bird.wing);

    if (!gameStarted) {
        ctx.fillStyle = 'rgba(255,255,255,0.6)';
        ctx.font = 'bold 16px Nunito';
        ctx.textAlign = 'center';
        ctx.fillText('Натисни "СТАРТ" або Пробіл', canvas.width / 2, canvas.height - 40);
    }
}

function updateFlappy() {
    if (!gameRunning) return;

    frameCount++;

    if (isJumping) {
        bird.vy += GRAVITY * 0.3;
        bird.y += bird.vy;
    } else {
        bird.vy += GRAVITY;
        bird.y += bird.vy;
    }

    if (frameCount % 3 === 0) addSparkle(bird.x, bird.y);
    updateSparkles();

    STARS.forEach(s => { s.x -= s.speed; if (s.x < 0) { s.x = canvas.width; s.y = Math.random() * canvas.height; } });

    if (frameCount % PIPE_SPAWN_INTERVAL === 0) {
        const minGapY = 60;
        const maxGapY = canvas.height - PIPE_GAP - 60;
        const gapY = Math.random() * (maxGapY - minGapY) + minGapY;
        PIPES.push({ x: canvas.width + 10, gapY: gapY, scored: false });
    }

    PIPES.forEach(p => { p.x -= PIPE_SPEED; });

    PIPES.forEach(p => {
        if (!p.scored && p.x + PIPE_WIDTH < bird.x) {
            p.scored = true;
            gameScore++;
            playScoreSound();
            updateGameUI();
        }
    });

    while (PIPES.length > 0 && PIPES[0].x + PIPE_WIDTH < -10) PIPES.shift();

    if (bird.y - bird.r <= 0 || bird.y + bird.r >= canvas.height) {
        if (!gameOverBird()) return;
    }

    for (const p of PIPES) {
        const inX = bird.x + bird.r > p.x && bird.x - bird.r < p.x + PIPE_WIDTH;
        const hitTop = bird.y - bird.r < p.gapY;
        const hitBot = bird.y + bird.r > p.gapY + PIPE_GAP;
        if (inX && (hitTop || hitBot)) {
            if (!gameOverBird()) return;
        }
    }

    drawFlappyFrame();
    gameAnimId = requestAnimationFrame(updateFlappy);
}

function gameOverBird() {
    gameLives--;
    playGameOverSound();
    updateGameUI();
    
    if (gameLives <= 0) {
        gameRunning = false;
        cancelAnimationFrame(gameAnimId);
        document.getElementById('final-score').textContent = gameScore;
        document.getElementById('game-over-overlay').classList.remove('hidden');
        return false;
    }
    
    bird = { x: 80, y: 250, vy: 0, r: 18, wing: 0, wingDir: 1 };
    PIPES.length = 0;
    isJumping = false;
    return true;
}

function updateGameUI() {
    document.getElementById('game-score').textContent = gameScore;
    const hearts = '❤️'.repeat(gameLives) + '🖤'.repeat(3 - gameLives);
    document.getElementById('game-lives').textContent = hearts;
}

// Управління
let jumpInterval = null;
let isJumping = false;

function startJump() {
    if (!gameStarted) { startGame(); return; }
    if (!gameRunning) return;
    isJumping = true;
    bird.vy = JUMP_FORCE;
    clearInterval(jumpInterval);
    jumpInterval = setInterval(() => {
        if (isJumping && gameRunning) {
            bird.vy = JUMP_FORCE * 0.5;
        }
    }, 100);
}

function stopJump() {
    isJumping = false;
    clearInterval(jumpInterval);
}

// Клавіатура (тільки коли НЕ друкуєш в інпуті)
document.addEventListener('keydown', e => {
    const tag = document.activeElement.tagName;
    if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;
    if (e.code === 'Space' || e.key === ' ') {
        e.preventDefault();
        if (!isJumping) startJump();
    }
});
document.addEventListener('keyup', e => {
    const tag = document.activeElement.tagName;
    if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;
    if (e.code === 'Space' || e.key === ' ') stopJump();
});

// Мишка та тач на Canvas
canvas.addEventListener('mousedown', e => { e.preventDefault(); startJump(); });
canvas.addEventListener('mouseup', stopJump);
canvas.addEventListener('mouseleave', stopJump);
canvas.addEventListener('touchstart', e => { e.preventDefault(); startJump(); }, { passive: false });
canvas.addEventListener('touchend', e => { e.preventDefault(); stopJump(); }, { passive: false });
canvas.addEventListener('touchcancel', e => { e.preventDefault(); stopJump(); }, { passive: false });

// Кнопка стрибка
const btnJump = document.getElementById('btn-jump');
btnJump.addEventListener('mousedown', e => { e.preventDefault(); startJump(); });
btnJump.addEventListener('mouseup', e => { e.preventDefault(); stopJump(); });
btnJump.addEventListener('mouseleave', stopJump);
btnJump.addEventListener('touchstart', e => { e.preventDefault(); startJump(); }, { passive: false });
btnJump.addEventListener('touchend', e => { e.preventDefault(); stopJump(); }, { passive: false });
btnJump.addEventListener('touchcancel', e => { e.preventDefault(); stopJump(); }, { passive: false });
