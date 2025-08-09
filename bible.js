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
