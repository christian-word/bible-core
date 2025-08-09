// bible-core.js — универсальный скрипт для работы с JSON Библии
// Подключение: <script src="bible-core.js"></script>

(function (global) {
    'use strict';

    const BibleCore = {
        data: null,
        isLoaded: false,
        checkPassed: false,

        /**
         * Загрузка JSON-файла
         * @param {string} url - путь к файлу bible_ua.json
         * @returns {Promise<boolean>} - true если файл загружен и проверен
         */
        async load(url) {
            try {
                const response = await fetch(url);
                if (!response.ok) throw new Error(`HTTP error ${response.status}`);
                this.data = await response.json();
                this.isLoaded = true;

                // Проверка целостности
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
         * Проверка количества книг, глав и стихов
         * @returns {boolean}
         * @private
         */
        _checkIntegrity() {
            if (!Array.isArray(this.data)) return false;

            const booksCount = this.data.length;
            let chaptersCount = 0;
            let versesCount = 0;

            this.data.forEach(book => {
                if (book.chapters && Array.isArray(book.chapters)) {
                    chaptersCount += book.chapters.length;
                    book.chapters.forEach(chap => {
                        if (chap.verses && Array.isArray(chap.verses)) {
                            versesCount += chap.verses.length;
                        }
                    });
                }
            });

            return booksCount === 66 && chaptersCount === 1189 && versesCount === 31102;
        },

        /**
         * Получить список книг
         * @returns {Array}
         */
        getBooks() {
            return this.isLoaded ? this.data : [];
        },

        /**
         * Получить главы книги
         * @param {number} bookIndex
         * @returns {Array}
         */
        getChapters(bookIndex) {
            if (!this.isLoaded || !this.data[bookIndex]) return [];
            return this.data[bookIndex].chapters;
        },

        /**
         * Получить стихи главы
         * @param {number} bookIndex
         * @param {number} chapterIndex
         * @returns {Array}
         */
        getVerses(bookIndex, chapterIndex) {
            if (!this.isLoaded || !this.data[bookIndex]) return [];
            const chapters = this.data[bookIndex].chapters || [];
            return chapters[chapterIndex] ? chapters[chapterIndex].verses : [];
        }
    };

    // Экспорт
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = BibleCore; // Node.js
    } else {
        global.BibleCore = BibleCore; // Browser
    }

})(typeof window !== 'undefined' ? window : globalThis);
