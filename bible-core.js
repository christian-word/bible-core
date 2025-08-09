// bible-core.js — универсальная логика для работы с JSON Библии
// Подключение: <script src="bible-core.js"></script>

(function (global) {
    'use strict';

    const BibleCore = {
        data: null,
        isLoaded: false,
        checkPassed: false,

        /**
         * Загружает JSON-файл и возвращает флаг проверки
         * @param {string} url - путь к bible_ua.json
         * @returns {Promise<boolean>}
         */
        async load(url) {
            try {
                const response = await fetch(url);
                if (!response.ok) throw new Error(`HTTP error ${response.status}`);
                this.data = await response.json();
                this.isLoaded = true;
                this.checkPassed = this._checkIntegrity();
                return this.checkPassed;
            } catch (err) {
                console.error('BibleCore load error:', err);
                this.isLoaded = false;
                this.checkPassed = false;
                return false;
            }
        },

        /**
         * Приватная проверка структуры: книги, главы, стихи
         * @returns {boolean}
         */
        _checkIntegrity() {
            if (!Array.isArray(this.data)) return false;
            const booksCount = this.data.length;
            let chaptersCount = 0, versesCount = 0;
            this.data.forEach(book => {
                if (Array.isArray(book.chapters)) {
                    chaptersCount += book.chapters.length;
                    book.chapters.forEach(chap => {
                        if (Array.isArray(chap.verses)) {
                            versesCount += chap.verses.length;
                        }
                    });
                }
            });
            return booksCount === 66 && chaptersCount === 1189 && versesCount === 31102;
        },

        getBooks() {
            return this.isLoaded ? this.data : [];
        },

        getChapters(bookIndex) {
            return (this.isLoaded && this.data[bookIndex] && Array.isArray(this.data[bookIndex].chapters))
                ? this.data[bookIndex].chapters
                : [];
        },

        getVerses(bookIndex, chapterIndex) {
            const chapters = this.getChapters(bookIndex);
            return Array.isArray(chapters[chapterIndex]?.verses)
                ? chapters[chapterIndex].verses
                : [];
        }
    };

    // Экспорт: для Node.js и браузера
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = BibleCore;
    } else {
        global.BibleCore = BibleCore;
    }

})(typeof window !== 'undefined' ? window : globalThis);
