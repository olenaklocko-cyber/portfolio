// ===== ЦІЛІ: Додавання та відображення наклейок =====

let stickers = [];

function loadStickers() {
    const s = localStorage.getItem('bt_stickers');
    if (s) stickers = JSON.parse(s);
}

function saveStickers() {
    localStorage.setItem('bt_stickers', JSON.stringify(stickers));
}

function addSticker() {
    const input = document.getElementById('sticker-input');
    const text = input.value.trim();
    const color = document.getElementById('sticker-color').value;
    if (!text) { alert('Введіть текст!'); return; }
    stickers.push({ id: Date.now(), text, color });
    saveStickers();
    renderStickers();
    input.value = '';
}

function renderStickers() {
    const board = document.getElementById('stickers-board');
    const empty = document.getElementById('empty-board');
    if (!stickers.length) {
        board.innerHTML = '';
        empty.classList.remove('hidden');
        return;
    }
    empty.classList.add('hidden');
    board.innerHTML = stickers.map(s => {
        const d = adjustColor(s.color, -40);
        return `<div class="sticker" style="background:linear-gradient(135deg,${s.color},${d})" data-id="${s.id}">
            <div class="sticker-text">${esc(s.text)}</div>
            <div class="sticker-actions">
                <button class="sticker-btn sticker-btn-edit" onclick="editSticker(${s.id})">✏️</button>
                <button class="sticker-btn sticker-btn-delete" onclick="deleteSticker(${s.id})">✕</button>
            </div></div>`;
    }).join('');
}

function editSticker(id) {
    const s = stickers.find(x => x.id === id);
    if (!s) return;
    const el = document.querySelector(`.sticker[data-id="${id}"] .sticker-text`);
    if (el.contentEditable === 'true') {
        el.contentEditable = 'false';
        s.text = el.textContent.trim();
        saveStickers();
    } else {
        el.contentEditable = 'true';
        el.focus();
        const r = document.createRange();
        r.selectNodeContents(el);
        window.getSelection().removeAllRanges();
        window.getSelection().addRange(r);
    }
}

function deleteSticker(id) {
    if (confirm('Видалити?')) {
        stickers = stickers.filter(s => s.id !== id);
        saveStickers();
        renderStickers();
    }
}

// Допоміжні функції
function esc(t) {
    const d = document.createElement('div');
    d.textContent = t;
    return d.innerHTML;
}

function adjustColor(hex, amt) {
    const n = parseInt(hex.slice(1), 16);
    const r = Math.min(255, Math.max(0, (n >> 16) + amt));
    const g = Math.min(255, Math.max(0, ((n >> 8) & 0xff) + amt));
    const b = Math.min(255, Math.max(0, (n & 0xff) + amt));
    return '#' + ((b | (g << 8) | (r << 16)).toString(16).padStart(6, '0'));
}
