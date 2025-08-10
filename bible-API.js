const BibleAPI = {
    data: [],

    async load(url) {
        const response = await fetch(url);
        this.data = await response.json();
        return this.data;
    },

    getBooks() {
        return this.data.map(book => ({
            number: book.number,
            shortName: book.shortName,
            name: book.name
        }));
    },

    getChapters(bookNumber) {
        const book = this.data.find(b => b.number === String(bookNumber));
        return book ? book.chapters.map(ch => ch.number) : [];
    },

    getVerses(bookNumber, chapterNumber) {
        const book = this.data.find(b => b.number === String(bookNumber));
        if (!book) return [];
        const chapter = book.chapters.find(ch => ch.number === String(chapterNumber));
        return chapter ? chapter.verses : [];
    },

    getVerse(bookNumber, chapterNumber, verseNumber) {
        return this.getVerses(bookNumber, chapterNumber)
            .find(v => v.number === String(verseNumber)) || null;
    },

    // ✅ Новая функция — диапазон и отдельные номера стихов
    getVersesRange(bookNumber, chapterNumber, range) {
        let verses = this.getVerses(bookNumber, chapterNumber);
        let result = [];
        range.split(",").forEach(part => {
            if (part.includes("-")) {
                let [start, end] = part.split("-").map(v => parseInt(v.trim()));
                for (let i = start; i <= end; i++) {
                    let verse = verses.find(v => parseInt(v.number) === i);
                    if (verse) result.push(verse);
                }
            } else {
                let verse = verses.find(v => parseInt(v.number) === parseInt(part.trim()));
                if (verse) result.push(verse);
            }
        });
        return result;
    },

    // ✅ Новая функция — поиск книги по имени или сокращению
    getBookByName(name) {
        let lower = name.toLowerCase();
        return this.data.find(b =>
            b.name.toLowerCase().includes(lower) ||
            b.shortName.toLowerCase().includes(lower)
        ) || null;
    },

    // ✅ Поиск с помощью регулярного выражения
    searchRegex(pattern) {
        const regex = new RegExp(pattern, "i");
        const results = [];
        for (const book of this.data) {
            for (const chapter of book.chapters) {
                for (const verse of chapter.verses) {
                    if (regex.test(verse.text)) {
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
    },

    // ✅ Случайный стих
    getRandomVerse() {
        const book = this.data[Math.floor(Math.random() * this.data.length)];
        const chapter = book.chapters[Math.floor(Math.random() * book.chapters.length)];
        const verse = chapter.verses[Math.floor(Math.random() * chapter.verses.length)];
        return {
            book: book.name,
            chapter: chapter.number,
            verse: verse.number,
            text: verse.text
        };
    },

    // ✅ Стих в виде ссылки
    getVerseReference(bookNumber, chapterNumber, verseNumber) {
        const book = this.data.find(b => b.number === String(bookNumber));
        const verse = this.getVerse(bookNumber, chapterNumber, verseNumber);
        return verse ? `${book.name} ${chapterNumber}:${verseNumber} — ${verse.text}` : null;
    },

    // ✅ Текст всей главы
    getChapterText(bookNumber, chapterNumber) {
        return this.getVerses(bookNumber, chapterNumber)
            .map(v => `${v.number}. ${v.text}`)
            .join(" ");
    },

    // ✅ Все стихи книги
    getAllVerses(bookNumber) {
        const book = this.data.find(b => b.number === String(bookNumber));
        if (!book) return [];
        let all = [];
        book.chapters.forEach(ch => {
            ch.verses.forEach(v => {
                all.push({
                    chapter: ch.number,
                    verse: v.number,
                    text: v.text
                });
            });
        });
        return all;
    },

    // Старый поиск
    search(query) {
        const results = [];
        const q = query.toLowerCase();
        for (const book of this.data) {
            for (const chapter of book.chapters) {
                for (const verse of chapter.verses) {
                    if (verse.text.toLowerCase().includes(q)) {
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
};
