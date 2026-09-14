// ===== ЦИТАТИ: Генератор мудрих цитат =====

const ukrainianQuotes = [
    { quote: "Життя — це те, що з тобою трапляється, поки ти будуєш плани.", author: "Джон Леннон" },
    { quote: "Єдиний спосіб робити велику роботу — любити те, що ти робиш.", author: "Стів Джобс" },
    { quote: "Майбутнє належить тим, хто вірить у красу своєї мрії.", author: "Елеонора Рузвельт" },
    { quote: "Не бійся йти повільно, бійся стояти на місці.", author: "Китайське прислів'я" },
    { quote: "Найкращий час посадити дерево було 20 років тому. Другий найкращий час — зараз.", author: "Китайське прислів'я" },
    { quote: "Мудрість приходить не з віком, а з освіти та досвіду.", author: "Аврелій Августин" },
    { quote: "Єдине обмеження — це твої сумніви.", author: "Брюс Лі" },
    { quote: "Мрії стають реальністю, коли ми починаємо діяти.", author: "Невідомий" },
    { quote: "Успіх — це сума малих зусиль, що повторюються щодня.", author: "Роберт Кіолосакі" },
    { quote: "Не важливо, як повільно ти йдеш, поки ти не зупиняєшся.", author: "Конфуцій" },
    { quote: "Щастя — це не готова річ. Його потрібно створювати.", author: "Бернард Шоу" },
    { quote: "Найбільша нагорода за працю — сама праця.", author: "Томас Едісон" },
    { quote: "Коли одна двері зачиняються, відчиняються інші.", author: "Аліса Еліс" },
    { quote: "Розумний чоловік вчиться на помилках інших, дурний — на своїх.", author: "Бісмарк" },
    { quote: "Пізнай себе — і ти пізнаєш всесвіт.", author: "Геракліт" },
    { quote: "Думки стають речами. Вибирай добрі думки.", author: "Невідомий" },
    { quote: "Любов — це найсильніша сила у всесвіті.", author: "Пабло Казальс" },
    { quote: "Кожна людина має в собі сонце.", author: "Ральф Вальдо Емерсон" },
    { quote: "Терпіння та час роблять свою справу.", author: "Жан де Лафонтен" },
    { quote: "Маленькі кроки ведуть до великих змін.", author: "Невідомий" }
];

async function fetchQuote() {
    document.getElementById('quotes-loading').classList.remove('hidden');
    document.getElementById('quotes-card').classList.add('hidden');
    document.getElementById('quotes-error').classList.add('hidden');
    const r = ukrainianQuotes[Math.floor(Math.random() * ukrainianQuotes.length)];
    setTimeout(() => {
        document.getElementById('quote-text').textContent = `"${r.quote}"`;
        document.getElementById('quote-author').textContent = `— ${r.author}`;
        document.getElementById('quotes-loading').classList.add('hidden');
        document.getElementById('quotes-card').classList.remove('hidden');
    }, 600);
}
