// bible-core.js
const bibleCore = {
  books: [],

  // Инициализация — загружаем JSON
  async init(url = "https://raw.githubusercontent.com/christian-word/bible-core/refs/heads/main/bible_ua.json") {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Помилка HTTP ${res.status}`);
    const data = await res.json();

    if (!Array.isArray(data)) throw new Error("Невірний формат Біблії");
    this.books = data;
  },

  // Получить все книги
  getBooks() {
    return this.books;
  },

  // Получить главы книги по индексу
  getChapters(bookIndex) {
    if (!this.books[bookIndex]) throw new Error("Книга не знайдена");
    return this.books[bookIndex].chapters;
  },

  // Получить стихи главы
  getVerses(bookIndex, chapterIndex) {
    const book = this.books[bookIndex];
    if (!book) throw new Error("Книга не знайдена");
    const chapter = book.chapters[chapterIndex];
    if (!chapter) throw new Error("Глава не знайдена");
    return chapter.verses;
  }
};
