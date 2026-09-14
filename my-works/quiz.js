// ===== КВІЗ: Питання та логіка тесту =====

const defaultQuestions = [
    { id: 1, question: "🚪 Ви стоїте перед двома дверима. За одними — смерть, за іншими — вихід. Біля дверей стоять два охоронці: один завжди бреше, інший завжди каже правду. Яке питання ви задасте?", options: ["Який охоронець скаже правду?", "Якщо я запитаю іншого охоронця, куди вести двері, що він відповість?", "Які двері ведуть до виходу?", "Який охоронець бреше?"], correct: 1, category: "Логіка" },
    { id: 2, question: "🎲 Ви кидаєте два кубики. Яка ймовірність того, що сума очок буде більше 9?", options: ["1/6", "1/4", "5/36", "1/12"], correct: 2, category: "Математика" },
    { id: 3, question: "🧩 Яка цифра замість знака питання?\n1 → 1\n2 → 5\n3 → 14\n4 → 30\n5 → ?", options: ["55", "60", "65", "50"], correct: 0, category: "Послідовність" },
    { id: 4, question: "🏃 Чоловік дістався в аеропорт за годину до відльоту. Він погуляв по терміналу. Коли повернувся — літак вилетів. Чому?", options: ["Літак вилетів раніше", "Він переплутав час", "Він гуляв по іншому терміналу", "Він запізнився"], correct: 2, category: "Загадка" },
    { id: 5, question: "⚖️ У вас є 9 кульок, одна важча. Ваги без гирь. Як знайти важчу за мінімум зважувань?", options: ["Зважувати по одній", "Розділити на 3 групи по 3 і зважувати двічі", "Розділити на дві групи", "Зважувати всі одночасно"], correct: 1, category: "Логіка" }
];

let questions = [...defaultQuestions];
let customQuestions = [];
let currentQuestion = 0;
let score = 0;
let answered = false;

function updateTotalQuestions() {
    document.getElementById('total-questions').textContent = questions.length;
}

function loadCustomQuestions() {
    const s = localStorage.getItem('bt_questions');
    if (s) {
        customQuestions = JSON.parse(s);
        questions = [...defaultQuestions, ...customQuestions];
        updateTotalQuestions();
    }
}

function saveCustomQuestions() {
    localStorage.setItem('bt_questions', JSON.stringify(customQuestions));
}

function startQuiz() {
    currentQuestion = 0;
    score = 0;
    answered = false;
    showScreen('question');
    renderQuestion();
}

function showScreen(name) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(name + '-screen').classList.add('active');
}

function renderQuestion() {
    const q = questions[currentQuestion];
    document.getElementById('progress-fill').style.width = ((currentQuestion + 1) / questions.length * 100) + '%';
    document.getElementById('question-number').textContent = `Питання ${currentQuestion + 1} з ${questions.length}`;
    document.getElementById('question-category').textContent = q.category;
    document.getElementById('question-text').textContent = q.question;
    document.getElementById('answers').innerHTML = q.options.map((o, i) =>
        `<button class="answer-btn" onclick="selectAnswer(${i})">${o}</button>`
    ).join('');
    document.getElementById('next-btn').classList.remove('show');
    answered = false;
}

function selectAnswer(i) {
    if (answered) return;
    answered = true;
    const c = questions[currentQuestion].correct;
    document.querySelectorAll('.answer-btn').forEach((b, idx) => {
        b.style.pointerEvents = 'none';
        if (idx === c) b.classList.add('correct');
        else if (idx === i) b.classList.add('wrong');
    });
    if (i === c) score++;
    setTimeout(() => {
        const btn = document.getElementById('next-btn');
        btn.classList.add('show');
        btn.textContent = currentQuestion === questions.length - 1 ? 'Показати результат' : 'Наступне питання →';
    }, 500);
}

function nextQuestion() {
    currentQuestion++;
    if (currentQuestion >= questions.length) showResult();
    else renderQuestion();
}

function showResult() {
    showScreen('result');
    const p = Math.round((score / questions.length) * 100);
    let icon, title, msg;
    if (p === 100) { icon = '🏆'; title = 'Ідеально!'; msg = 'Ви відповіли правильно на все!'; }
    else if (p >= 80) { icon = '🎉'; title = 'Чудово!'; msg = `${score} з ${questions.length} — відмінно!`; }
    else if (p >= 60) { icon = '👍'; title = 'Непогано!'; msg = `${score} з ${questions.length} — продовжуйте!`; }
    else { icon = '💪'; title = 'Не здавайтесь!'; msg = `${score} з ${questions.length}`; }
    document.getElementById('result-icon').textContent = icon;
    document.getElementById('result-title').textContent = title;
    document.getElementById('result-score').textContent = `${score} з ${questions.length}`;
    document.getElementById('result-message').textContent = msg;
}

function restartQuiz() {
    showScreen('start');
}

function addQuestion(e) {
    e.preventDefault();
    const q = document.getElementById('new-question').value.trim();
    const o1 = document.getElementById('new-option1').value.trim();
    const o2 = document.getElementById('new-option2').value.trim();
    const o3 = document.getElementById('new-option3').value.trim();
    const o4 = document.getElementById('new-option4').value.trim();
    const cat = document.getElementById('new-category').value;
    if (!q) { alert('Введіть питання!'); return; }
    if (!o1) { alert('Введіть правильну відповідь!'); return; }
    if (!o2) { alert('Введіть неправильну відповідь!'); return; }
    const options = [o1, o2];
    if (o3) options.push(o3);
    if (o4) options.push(o4);
    customQuestions.push({ id: Date.now(), question: q, options, correct: 0, category: cat });
    questions = [...defaultQuestions, ...customQuestions];
    saveCustomQuestions();
    updateTotalQuestions();
    renderCustomQuestions();
    document.getElementById('add-question-form').reset();
    alert('Питання додано! 🎉');
}

function renderCustomQuestions() {
    const el = document.getElementById('custom-questions-list');
    if (!customQuestions.length) {
        el.innerHTML = '<p style="color:#666;font-size:14px;">Ще не додано</p>';
        return;
    }
    el.innerHTML = customQuestions.map((q, i) =>
        `<div class="custom-question-item"><span>${q.question.substring(0, 40)}${q.question.length > 40 ? '...' : ''}</span><button class="delete-btn" onclick="deleteQuestion(${i})">Видалити</button></div>`
    ).join('');
}

function deleteQuestion(i) {
    if (confirm('Видалити?')) {
        customQuestions.splice(i, 1);
        questions = [...defaultQuestions, ...customQuestions];
        saveCustomQuestions();
        updateTotalQuestions();
        renderCustomQuestions();
    }
}

function openQuestionForm() {
    document.getElementById('create-card').style.display = 'none';
    document.getElementById('form-panel').classList.remove('hidden');
}

function closeQuestionForm() {
    document.getElementById('form-panel').classList.add('hidden');
    document.getElementById('create-card').style.display = 'block';
    document.getElementById('add-question-form').reset();
}
