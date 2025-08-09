let bibleData = [];

async function loadBible() {
    const response = await fetch("bible_ua.json");
    bibleData = await response.json();
    fillBookSelect();
}

function fillBookSelect() {
    const bookSelect = document.getElementById("bookSelect");
    bookSelect.innerHTML = "";
    bibleData.forEach(book => {
        const opt = document.createElement("option");
        opt.value = book.number;
        opt.textContent = `${book.number}. ${book.name}`;
        bookSelect.appendChild(opt);
    });
    fillChapterSelect();
}

function fillChapterSelect() {
    const bookNumber = document.getElementById("bookSelect").value;
    const chapterSelect = document.getElementById("chapterSelect");
    chapterSelect.innerHTML = "";
    const book = bibleData.find(b => b.number === bookNumber);
    if (book) {
        book.chapters.forEach(ch => {
            const opt = document.createElement("option");
            opt.value = ch.number;
            opt.textContent = `Глава ${ch.number}`;
            chapterSelect.appendChild(opt);
        });
        displayVerses();
    }
}

function displayVerses() {
    const bookNumber = document.getElementById("bookSelect").value;
    const chapterNumber = document.getElementById("chapterSelect").value;
    const versesDiv = document.getElementById("verses");
    versesDiv.innerHTML = "";

    const book = bibleData.find(b => b.number === bookNumber);
    if (!book) return;
    const chapter = book.chapters.find(ch => ch.number === chapterNumber);
    if (!chapter) return;

    chapter.verses.forEach(v => {
        const p = document.createElement("div");
        p.className = "verse";
        p.innerHTML = `<span>${v.number}</span> ${v.text}`;
        versesDiv.appendChild(p);
    });
}

function searchBible(query) {
    const results = [];
    for (const book of bibleData) {
        for (const chapter of book.chapters) {
            for (const verse of chapter.verses) {
                if (verse.text.toLowerCase().includes(query.toLowerCase())) {
                    results.push({
                        book: book.name,
                        chapter: chapter.number,
                        verse: verse.number,
                        text: verse.text
                    });
                }
            }
        }
    }
    return results;
}

// ======== События ========
document.getElementById("bookSelect").addEventListener("change", fillChapterSelect);
document.getElementById("chapterSelect").addEventListener("change", displayVerses);
document.getElementById("searchBtn").addEventListener("click", () => {
    const query = document.getElementById("searchInput").value.trim();
    const resultsDiv = document.getElementById("results");
    resultsDiv.innerHTML = "";
    if (!query) return;
    const results = searchBible(query);
    if (results.length === 0) {
        resultsDiv.textContent = "Нічого не знайдено.";
        return;
    }
    results.forEach(r => {
        const div = document.createElement("div");
        div.className = "search-result";
        div.innerHTML = `<b>${r.book} ${r.chapter}:${r.verse}</b> — ${r.text}`;
        resultsDiv.appendChild(div);
    });
});

loadBible();
