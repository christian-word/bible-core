const bibleCore = {
  books: [],
  async init() {
    const res = await fetch("https://raw.githubusercontent.com/christian-word/bible-core/refs/heads/main/bible_ua.json");
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    this.books = data.books;
  }
};

window.bibleCore = bibleCore;
