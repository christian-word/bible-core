// bible-core.js v1.1

const BibleCore = (() => {
  let bibleData = null;
  let bookNames = {
    ua: [],
    en: []
  };

  const bookNameMap = new Map(); // for resolving any name to index

  function parseReference(text) {
    if (typeof text !== 'string') return null;
    const ref = text.trim();

    // If index-based: "1,3:5,7-9"
    if (/^\d+,\d+:/.test(ref)) return parseIndexReference(ref);

    // If named-based: "Матвія 5:3" or "John 3:16"
    const match = ref.match(/^([^\d]+?)\s*(\d+)?(?::(\d+(?:[-–]\d+)?(?:,\d+(?:[-–]\d+)?)*)?)?$/);
    if (!match) return null;
    const name = match[1].trim();
    const chapter = match[2] ? parseInt(match[2], 10) : null;
    const verses = match[3] ? parseVerseSpec(match[3]) : null;
    const index = bookNameMap.get(name.toLowerCase());
    if (index == null) return null;
    return { bookIndex: index, chapterIndex: chapter ? chapter - 1 : null, verses };
  }

  function parseIndexReference(text) {
    const [bk, chv] = text.split(':');
    const [bIndexStr, cIndexStr] = bk.split(',');
    const verses = chv ? parseVerseSpec(chv) : null;
    return {
      bookIndex: parseInt(bIndexStr, 10) - 1,
      chapterIndex: parseInt(cIndexStr, 10) - 1,
      verses
    };
  }

  function parseVerseSpec(spec) {
    const parts = spec.split(',');
    const verses = [];
    parts.forEach(part => {
      if (part.includes('-') || part.includes('–')) {
        const [start, end] = part.split(/[-–]/).map(Number);
        for (let i = start; i <= end; i++) verses.push(i);
      } else {
        verses.push(Number(part));
      }
    });
    return verses;
  }

  function get(ref) {
    const parsed = typeof ref === 'string' ? parseReference(ref) : ref;
    if (!parsed || !bibleData) return null;
    const { bookIndex, chapterIndex, verses } = parsed;
    const book = bibleData[bookIndex];
    if (!book) return null;
    if (chapterIndex == null) return book;
    const chapter = book.chapters[chapterIndex];
    if (!chapter) return null;
    if (!verses) return chapter;
    return verses.map(v => ({
      verse: v,
      text: chapter[v - 1] || '',
      reference: `${book.name} ${chapterIndex + 1}:${v}`
    }));
  }

  function getCanonicalNames(lang = 'ua') {
    return bookNames[lang] || [];
  }

  async function load(source) {
    if (typeof source === 'string') {
      const res = await fetch(source);
      bibleData = await res.json();
    } else if (typeof source === 'object') {
      bibleData = source;
    }
    // Build name maps
    bookNames.ua = bibleData.map(b => b.name);
    bookNames.en = bibleData.map((_, i) => EN_BOOK_NAMES[i]);
    for (let i = 0; i < bibleData.length; i++) {
      bookNameMap.set(bookNames.ua[i].toLowerCase(), i);
      bookNameMap.set(bookNames.en[i].toLowerCase(), i);
    }
  }

  const EN_BOOK_NAMES = [
    "Genesis", "Exodus", "Leviticus", "Numbers", "Deuteronomy", "Joshua", "Judges", "Ruth",
    "1 Samuel", "2 Samuel", "1 Kings", "2 Kings", "1 Chronicles", "2 Chronicles", "Ezra", "Nehemiah",
    "Esther", "Job", "Psalms", "Proverbs", "Ecclesiastes", "Song of Songs", "Isaiah", "Jeremiah",
    "Lamentations", "Ezekiel", "Daniel", "Hosea", "Joel", "Amos", "Obadiah", "Jonah",
    "Micah", "Nahum", "Habakkuk", "Zephaniah", "Haggai", "Zechariah", "Malachi",
    "Matthew", "Mark", "Luke", "John", "Acts", "Romans", "1 Corinthians", "2 Corinthians",
    "Galatians", "Ephesians", "Philippians", "Colossians", "1 Thessalonians", "2 Thessalonians",
    "1 Timothy", "2 Timothy", "Titus", "Philemon", "Hebrews", "James", "1 Peter", "2 Peter",
    "1 John", "2 John", "3 John", "Jude", "Revelation"
  ];

  return {
    load,
    get,
    getCanonicalNames,
    parseReference
  };
})();

// For CDN compatibility
if (typeof window !== 'undefined') {
  window.BibleCore = BibleCore;
}
