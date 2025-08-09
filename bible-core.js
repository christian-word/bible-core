(function (global) {
  const bibleCore = {
    books: [],
    data: null,

    async init(options = {}) {
      const jsonUrl = options.jsonUrl ||
        'https://raw.githubusercontent.com/christian-word/bible-core/main/bible_ua.json';
      const res = await fetch(jsonUrl);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      this.data = await res.json();

      // Преобразуем структуру
      this.books = this.data.map((book, bookIndex) => ({
        number: bookIndex + 1,
        name: book.name,
        chapters: book.chapters
      }));

      return true;
    },

    getChapter(bookNumber, chapterNumber) {
      const book = this.books.find(b => b.number === bookNumber);
      if (!book) return null;
      const chapter = book.chapters[chapterNumber - 1];
      if (!chapter) return null;
      return chapter.map((verseText, idx) => ({
        number: idx + 1,
        text: verseText
      }));
    }
  };

  global.bibleCore = bibleCore;
})(typeof window !== 'undefined' ? window : globalThis);
