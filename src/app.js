/**
 * ZETA WIKI - Modern, Secure, High-Performance Encyclopedia (v2.1)
 * Features:
 * - Dynamic I18n with localized categories and home feeds
 * - Native Article Language Links (Cross-language switching)
 * - Web Speech API Text-to-Speech (TTS) article narration
 * - Reader Mode (Font size, Serif/Sans/Mono, Column width)
 * - Browsing History tracking with offline persistence
 * - Mobile Table of Contents (TOC) collapsible accordion
 * - Power User Keyboard Shortcuts (Ctrl+K, Esc, Alt+R, Alt+T, Alt+H)
 * - Floating Back-to-Top button
 * - Automated Code block copy buttons
 * - PWA Service Worker & Offline detection banner
 * - Strict DOMParser HTML Sanitization & AbortController race-condition prevention
 */

(function () {
    'use strict';

    // =========================================================================
    // I18N DICTIONARY & CATEGORY MAPPING
    // =========================================================================
    const I18N = {
        ru: {
            homeQuery: 'Научные открытия и технологии',
            homeTitle: 'Главные темы',
            homeDesc: 'Свободная современная энциклопедия. Выберите категорию или воспользуйтесь быстрым поиском.',
            searchTitle: 'Результаты поиска',
            searchDesc: 'Найдено по запросу: «{query}»',
            searchEmpty: 'По вашему запросу ничего не найдено.',
            searchPlaceholder: 'Поиск в Википедии (Ctrl+K)...',
            savedTitle: 'Закладки',
            savedDesc: 'Сохраненные статьи для быстрого чтения оффлайн или позже.',
            historyTitle: 'История просмотров',
            historyDesc: 'Недавно прочитанные статьи в этом браузере.',
            ttsPlay: 'Слушать статью',
            ttsPause: 'Пауза',
            ttsStop: 'Стоп',
            ttsSpeaking: 'Озвучивание статьи...',
            categories: {
                people: { query: 'Знаменитости и биографии', label: 'Люди и биографии' },
                countries: { query: 'Страны и география', label: 'Страны и география' },
                tech: { query: 'Информационные технологии', label: 'Технологии и IT' },
                science: { query: 'Наука и космос', label: 'Наука и космос' },
                history: { query: 'Всемирная история', label: 'История и эпохи' },
                games: { query: 'Видеоигры', label: 'Видеоигры' }
            }
        },
        en: {
            homeQuery: 'Scientific discoveries and technology',
            homeTitle: 'Featured Topics',
            homeDesc: 'Modern free encyclopedia. Choose a category or use the quick search.',
            searchTitle: 'Search Results',
            searchDesc: 'Results for: "{query}"',
            searchEmpty: 'No articles found for your query.',
            searchPlaceholder: 'Search Wikipedia (Ctrl+K)...',
            savedTitle: 'Bookmarks',
            savedDesc: 'Saved articles for quick reading offline or later.',
            historyTitle: 'Reading History',
            historyDesc: 'Recently viewed articles in this browser.',
            ttsPlay: 'Listen to article',
            ttsPause: 'Pause',
            ttsStop: 'Stop',
            ttsSpeaking: 'Narrating article...',
            categories: {
                people: { query: 'Celebrities and biographies', label: 'People & Biographies' },
                countries: { query: 'Countries and geography', label: 'Countries & Geography' },
                tech: { query: 'Information technology and computing', label: 'Technology & IT' },
                science: { query: 'Science and space exploration', label: 'Science & Cosmos' },
                history: { query: 'World history', label: 'History & Eras' },
                games: { query: 'Video games', label: 'Video Games' }
            }
        },
        uz: {
            homeQuery: 'Ilmiy kashfiyotlar va texnologiyalar',
            homeTitle: 'Asosiy mavzular',
            homeDesc: 'Zamonaviy erkin ensiklopediya. Kategoriya tanlang yoki qidiruvdan foydalaning.',
            searchTitle: 'Qidiruv natijalari',
            searchDesc: '«{query}» soʻrovi boʻyicha natijalar',
            searchEmpty: 'Soʻrovingiz boʻyicha hech narsa topilmadi.',
            searchPlaceholder: 'Vikipediyadan qidirish (Ctrl+K)...',
            savedTitle: 'Xatchoʻplar',
            savedDesc: 'Keyinroq oʻqish uchun saqlangan maqolalar.',
            historyTitle: 'Koʻrishlar tarixi',
            historyDesc: 'Yaqinda oʻqilgan maqolalar.',
            ttsPlay: 'Maqolani tinglash',
            ttsPause: 'Pauza',
            ttsStop: 'Toʻxtatish',
            ttsSpeaking: 'Maqola oʻqilmoqda...',
            categories: {
                people: { query: 'Mashhur shaxslar biografiyasi', label: 'Mashhur shaxslar' },
                countries: { query: 'Dunyo davlatlari geografiyasi', label: 'Davlatlar va geografiya' },
                tech: { query: 'Axborot texnologiyalari', label: 'Texnologiyalar va IT' },
                science: { query: 'Fan va koinot', label: 'Fan va koinot' },
                history: { query: 'Jahon tarixi', label: 'Tarix va davrlar' },
                games: { query: 'Video o‘yinlar', label: 'Video oʻyinlar' }
            }
        },
        de: {
            homeQuery: 'Wissenschaftliche Entdeckungen und Technologie',
            homeTitle: 'Hauptthemen',
            homeDesc: 'Moderne freie Enzyklopädie. Wählen Sie eine Kategorie oder suchen Sie gezielt.',
            searchTitle: 'Suchergebnisse',
            searchDesc: 'Gefunden für: «{query}»',
            searchEmpty: 'Keine Artikel zu Ihrer Suchanfrage gefunden.',
            searchPlaceholder: 'Wikipedia durchsuchen (Ctrl+K)...',
            savedTitle: 'Lesezeichen',
            savedDesc: 'Gespeicherte Artikel für späteres Lesen.',
            historyTitle: 'Verlauf',
            historyDesc: 'Kürzlich angesehene Artikel.',
            ttsPlay: 'Artikel anhören',
            ttsPause: 'Pause',
            ttsStop: 'Stopp',
            ttsSpeaking: 'Artikel wird vorgelesen...',
            categories: {
                people: { query: 'Berühmte Persönlichkeiten', label: 'Menschen & Biografien' },
                countries: { query: 'Länder und Geographie', label: 'Länder & Geographie' },
                tech: { query: 'Informationstechnik', label: 'Technologie & IT' },
                science: { query: 'Wissenschaft und Kosmos', label: 'Wissenschaft & Raumfahrt' },
                history: { query: 'Weltgeschichte', label: 'Geschichte & Epochen' },
                games: { query: 'Videospiele', label: 'Videospiele' }
            }
        },
        es: {
            homeQuery: 'Descubrimientos científicos y tecnología',
            homeTitle: 'Temas Destacados',
            homeDesc: 'Enciclopedia moderna y libre. Explora categorías o busca un artículo.',
            searchTitle: 'Resultados de búsqueda',
            searchDesc: 'Resultados para: «{query}»',
            searchEmpty: 'No se encontraron artículos.',
            searchPlaceholder: 'Buscar en Wikipedia (Ctrl+K)...',
            savedTitle: 'Marcadores',
            savedDesc: 'Artículos guardados para leer más tarde.',
            historyTitle: 'Historial',
            historyDesc: 'Artículos leídos recientemente.',
            ttsPlay: 'Escuchar artículo',
            ttsPause: 'Pausa',
            ttsStop: 'Detener',
            ttsSpeaking: 'Reproduciendo artículo...',
            categories: {
                people: { query: 'Biografías de personajes célebres', label: 'Gente y biografías' },
                countries: { query: 'Países y geografía', label: 'Países y geografía' },
                tech: { query: 'Tecnología de la información', label: 'Tecnología e IT' },
                science: { query: 'Ciencia y astronomía', label: 'Ciencia y espacio' },
                history: { query: 'Historia universal', label: 'Historia y épocas' },
                games: { query: 'Videojuegos', label: 'Videojuegos' }
            }
        },
        fr: {
            homeQuery: 'Découvertes scientifiques et technologie',
            homeTitle: 'Thèmes Principaux',
            homeDesc: 'Encyclopédie moderne et gratuite. Choisissez une catégorie ou lancez une recherche.',
            searchTitle: 'Résultats de recherche',
            searchDesc: 'Résultats pour: «{query}»',
            searchEmpty: 'Aucun article trouvé pour cette recherche.',
            searchPlaceholder: 'Rechercher sur Wikipédia (Ctrl+K)...',
            savedTitle: 'Signets',
            savedDesc: 'Articles sauvegardés pour lecture hors-ligne ou ultérieure.',
            historyTitle: 'Historique',
            historyDesc: 'Articles consultés récemment.',
            ttsPlay: 'Écouter l\'article',
            ttsPause: 'Pause',
            ttsStop: 'Arrêter',
            ttsSpeaking: 'Lecture de l\'article en cours...',
            categories: {
                people: { query: 'Biographies de personnalités', label: 'Gens et biographies' },
                countries: { query: 'Pays et géographie', label: 'Pays et géographie' },
                tech: { query: 'Technologies de l\'information', label: 'Technologie & IT' },
                science: { query: 'Science et astronomie', label: 'Science et espace' },
                history: { query: 'Histoire du monde', label: 'Histoire et époques' },
                games: { query: 'Jeux vidéo', label: 'Jeux vidéo' }
            }
        }
    };

    // =========================================================================
    // STATE & CONFIGURATION
    // =========================================================================
    const STATE = {
        lang: localStorage.getItem('zeta_wiki_lang') || 'ru',
        theme: localStorage.getItem('zeta_wiki_theme') || 'dark',
        bookmarks: JSON.parse(localStorage.getItem('zeta_wiki_bookmarks') || '[]'),
        history: JSON.parse(localStorage.getItem('zeta_wiki_history') || '[]'),
        readerSettings: JSON.parse(localStorage.getItem('zeta_wiki_reader_settings') || '{"fontSize":17,"fontFamily":"sans","width":"normal"}'),
        activeAbortController: null,
        currentArticleData: null,
        currentLangLinks: {}, // Cross-language Wikipedia links
        cache: new Map(), // In-memory API cache
        searchDebounceTimer: null,
        selectedSuggestionIndex: -1,
        suggestions: [],
        tts: {
            synth: window.speechSynthesis,
            utterance: null,
            isPlaying: false,
            isPaused: false
        }
    };

    const VIGER_TAGS = ['viger', 'viger yt', 'vigerix', 'temurshoh', 'temurshoh ahmadaliyev'];

    // DOM Elements
    const DOM = {
        appContent: document.getElementById('app-content'),
        searchForm: document.getElementById('search-form'),
        searchInput: document.getElementById('searchInput'),
        searchClearBtn: document.getElementById('search-clear-btn'),
        searchSuggestions: document.getElementById('search-suggestions'),
        suggestionsList: document.getElementById('suggestions-list'),
        sidebar: document.getElementById('sidebar'),
        sidebarOverlay: document.getElementById('sidebar-overlay'),
        mobileBtn: document.getElementById('mobile-menu-btn'),
        sidebarCloseBtn: document.getElementById('sidebar-close-btn'),
        navLinks: document.querySelectorAll('.nav-link'),
        langSelect: document.getElementById('lang-select'),
        themeToggleBtn: document.getElementById('theme-toggle-btn'),
        bookmarksBadge: document.getElementById('bookmarks-count-badge'),
        historyBadge: document.getElementById('history-count-badge'),
        readingProgressBar: document.getElementById('reading-progress-bar'),
        toastContainer: document.getElementById('toast-container'),
        btnBackToTop: document.getElementById('btn-back-to-top'),
        btnReaderSettings: document.getElementById('btn-reader-settings'),
        readerSettingsPanel: document.getElementById('reader-settings-panel'),
        btnCloseReaderSettings: document.getElementById('btn-close-reader-settings'),
        btnFontSmaller: document.getElementById('btn-font-smaller'),
        btnFontLarger: document.getElementById('btn-font-larger'),
        fontSizeIndicator: document.getElementById('font-size-indicator'),
        fontChoiceBtns: document.querySelectorAll('.font-choice-btn'),
        widthChoiceBtns: document.querySelectorAll('.width-choice-btn'),
        offlineBanner: document.getElementById('offline-banner')
    };

    // =========================================================================
    // SECURITY & SANITIZATION UTILITIES
    // =========================================================================

    function escapeHTML(str) {
        if (str === null || str === undefined) return '';
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }

    function sanitizeArticleHTML(dirtyHTML) {
        if (!dirtyHTML) return '';

        const parser = new DOMParser();
        const doc = parser.parseFromString(dirtyHTML, 'text/html');

        const ALLOWED_TAGS = new Set([
            'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'ul', 'ol', 'li',
            'b', 'strong', 'i', 'em', 'u', 's', 'strike', 'blockquote',
            'code', 'pre', 'table', 'thead', 'tbody', 'tfoot', 'tr', 'th', 'td',
            'a', 'span', 'div', 'br', 'hr', 'sub', 'sup', 'figure', 'figcaption',
            'img', 'small', 'abbr', 'cite', 'dl', 'dt', 'dd'
        ]);

        const ALLOWED_ATTRS = new Set([
            'href', 'src', 'alt', 'title', 'id', 'class', 'width', 'height', 'data-anchor'
        ]);

        const walker = document.createTreeWalker(doc.body, NodeFilter.SHOW_ELEMENT);
        const elementsToRemove = [];

        while (walker.nextNode()) {
            const el = walker.currentNode;
            const tag = el.tagName.toLowerCase();

            if (!ALLOWED_TAGS.has(tag)) {
                elementsToRemove.push(el);
                continue;
            }

            const attrs = Array.from(el.attributes);
            for (const attr of attrs) {
                const attrName = attr.name.toLowerCase();
                const attrVal = attr.value.trim().toLowerCase();

                if (!ALLOWED_ATTRS.has(attrName) || attrName.startsWith('on')) {
                    el.removeAttribute(attr.name);
                } else if ((attrName === 'href' || attrName === 'src') && (attrVal.startsWith('javascript:') || attrVal.startsWith('data:text/html'))) {
                    el.removeAttribute(attr.name);
                }
            }

            // Convert Wikipedia internal links to app hash links
            if (tag === 'a') {
                const href = el.getAttribute('href');
                if (href) {
                    if (href.startsWith('/wiki/') || href.startsWith('./')) {
                        const rawTitle = href.replace(/^(\/wiki\/|\.\/)/, '');
                        if (!rawTitle.startsWith('File:') && !rawTitle.startsWith('Файл:')) {
                            el.setAttribute('href', `#article/${encodeURIComponent(decodeURIComponent(rawTitle))}`);
                        } else {
                            el.removeAttribute('href');
                        }
                    } else if (href.startsWith('http://') || href.startsWith('https://')) {
                        el.setAttribute('target', '_blank');
                        el.setAttribute('rel', 'noopener noreferrer');
                    }
                }
            }
        }

        elementsToRemove.forEach(el => el.remove());
        return doc.body.innerHTML;
    }

    // =========================================================================
    // API CLIENT (With Dynamic Language, Langlinks & AbortController)
    // =========================================================================

    function getApiBaseUrl() {
        return `https://${STATE.lang}.wikipedia.org/w/api.php?origin=*&format=json`;
    }

    function getLocale() {
        return I18N[STATE.lang] || I18N.ru;
    }

    async function cachedFetch(url) {
        if (STATE.cache.has(url)) {
            return STATE.cache.get(url);
        }

        if (STATE.activeAbortController) {
            STATE.activeAbortController.abort();
        }
        STATE.activeAbortController = new AbortController();

        try {
            const res = await fetch(url, { signal: STATE.activeAbortController.signal });
            if (!res.ok) throw new Error(`HTTP error ${res.status}`);
            const data = await res.json();

            if (STATE.cache.size > 80) {
                const firstKey = STATE.cache.keys().next().value;
                STATE.cache.delete(firstKey);
            }
            STATE.cache.set(url, data);
            return data;
        } catch (err) {
            if (err.name === 'AbortError') {
                return null;
            }
            throw err;
        }
    }

    async function fetchWikiSearchWithImages(query, limit = 16) {
        try {
            const url = `${getApiBaseUrl()}&action=query&generator=search&gsrsearch=${encodeURIComponent(query)}&gsrlimit=${limit}&prop=pageimages|extracts&exchars=180&exintro=1&explaintext=1&piprop=thumbnail&pithumbsize=400`;
            const data = await cachedFetch(url);
            if (!data || !data.query || !data.query.pages) return [];

            const pages = Object.values(data.query.pages).sort((a, b) => (a.index || 0) - (b.index || 0));
            return pages.map(p => ({
                title: p.title,
                snippet: p.extract || "",
                thumbnail: p.thumbnail ? p.thumbnail.source : null
            }));
        } catch (e) {
            console.error("Wiki Search Error:", e);
            return [];
        }
    }

    async function fetchWikiArticle(title) {
        try {
            // Fetch article extract, original image banner, AND language links (prop=langlinks)
            const url = `${getApiBaseUrl()}&action=query&prop=extracts|pageimages|langlinks&titles=${encodeURIComponent(title)}&piprop=original&lllimit=50`;
            const data = await cachedFetch(url);
            if (!data || !data.query || !data.query.pages) return null;

            const pageId = Object.keys(data.query.pages)[0];
            const pageData = data.query.pages[pageId];

            // Parse langlinks
            STATE.currentLangLinks = {};
            if (pageData && pageData.langlinks) {
                pageData.langlinks.forEach(ll => {
                    STATE.currentLangLinks[ll.lang] = ll['*'];
                });
            }

            return pageData || null;
        } catch (e) {
            console.error("Wiki Article Error:", e);
            return null;
        }
    }

    async function fetchRandomArticle() {
        try {
            const url = `${getApiBaseUrl()}&action=query&generator=random&grnnamespace=0&grnlimit=1&prop=info`;
            const data = await cachedFetch(url);
            if (!data || !data.query || !data.query.pages) return null;

            const page = Object.values(data.query.pages)[0];
            return page ? page.title : null;
        } catch (e) {
            console.error("Wiki Random Error:", e);
            return null;
        }
    }

    async function fetchSearchSuggestions(term) {
        if (!term || term.length < 2) return [];
        try {
            const url = `https://${STATE.lang}.wikipedia.org/w/api.php?origin=*&action=opensearch&format=json&search=${encodeURIComponent(term)}&limit=6`;
            const res = await fetch(url);
            const data = await res.json();
            return data[1] || [];
        } catch (e) {
            return [];
        }
    }

    // =========================================================================
    // UI TOASTS, BOOKMARKS & READING HISTORY
    // =========================================================================

    function showToast(message, icon = '✓') {
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.innerHTML = `<span>${icon}</span> <span>${escapeHTML(message)}</span>`;
        DOM.toastContainer.appendChild(toast);

        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateY(10px)';
            toast.style.transition = 'all 0.3s ease';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    function updateBadges() {
        if (DOM.bookmarksBadge) DOM.bookmarksBadge.textContent = STATE.bookmarks.length;
        if (DOM.historyBadge) DOM.historyBadge.textContent = STATE.history.length;
    }

    function isBookmarked(title) {
        return STATE.bookmarks.some(b => b.title.toLowerCase() === title.toLowerCase());
    }

    function toggleBookmark(article) {
        const index = STATE.bookmarks.findIndex(b => b.title.toLowerCase() === article.title.toLowerCase());
        if (index > -1) {
            STATE.bookmarks.splice(index, 1);
            showToast('Статья удалена из закладок', '🗑️');
        } else {
            STATE.bookmarks.unshift({
                title: article.title,
                snippet: article.snippet || '',
                thumbnail: article.thumbnail || null,
                addedAt: Date.now()
            });
            showToast('Статья сохранена в закладки', '⭐');
        }
        localStorage.setItem('zeta_wiki_bookmarks', JSON.stringify(STATE.bookmarks));
        updateBadges();

        const bookmarkBtn = document.getElementById('btn-bookmark-action');
        if (bookmarkBtn) {
            bookmarkBtn.classList.toggle('active', isBookmarked(article.title));
            bookmarkBtn.innerHTML = isBookmarked(article.title)
                ? `<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2"><path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/></svg> Сохранено`
                : `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/></svg> В закладки`;
        }
    }

    function recordReadingHistory(article) {
        if (!article || !article.title) return;
        // Deduplicate
        STATE.history = STATE.history.filter(h => h.title.toLowerCase() !== article.title.toLowerCase());
        STATE.history.unshift({
            title: article.title,
            snippet: article.snippet || '',
            thumbnail: article.thumbnail || null,
            viewedAt: Date.now()
        });
        // Limit to 30 items
        if (STATE.history.length > 30) STATE.history.pop();
        localStorage.setItem('zeta_wiki_history', JSON.stringify(STATE.history));
        updateBadges();
    }

    // =========================================================================
    // TEXT-TO-SPEECH (TTS) AUDIO NARRATOR
    // =========================================================================

    function stopTTS() {
        if (STATE.tts.synth) {
            STATE.tts.synth.cancel();
        }
        STATE.tts.isPlaying = false;
        STATE.tts.isPaused = false;
        updateTTSPlayerUI();
    }

    function toggleTTS(textToRead) {
        if (!STATE.tts.synth) {
            showToast('Синтез речи не поддерживается браузером', '⚠️');
            return;
        }

        if (STATE.tts.isPlaying && !STATE.tts.isPaused) {
            STATE.tts.synth.pause();
            STATE.tts.isPaused = true;
            updateTTSPlayerUI();
            return;
        }

        if (STATE.tts.isPaused) {
            STATE.tts.synth.resume();
            STATE.tts.isPaused = false;
            updateTTSPlayerUI();
            return;
        }

        // Fresh Speech
        stopTTS();
        const cleanText = textToRead.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').slice(0, 4000);
        STATE.tts.utterance = new SpeechSynthesisUtterance(cleanText);
        
        // Voice matching active language
        const langMap = { ru: 'ru-RU', en: 'en-US', uz: 'uz-UZ', de: 'de-DE', es: 'es-ES', fr: 'fr-FR' };
        STATE.tts.utterance.lang = langMap[STATE.lang] || 'ru-RU';
        STATE.tts.utterance.rate = 1.05;

        STATE.tts.utterance.onend = () => {
            stopTTS();
        };

        STATE.tts.utterance.onerror = () => {
            stopTTS();
        };

        STATE.tts.synth.speak(STATE.tts.utterance);
        STATE.tts.isPlaying = true;
        STATE.tts.isPaused = false;
        updateTTSPlayerUI();
    }

    function updateTTSPlayerUI() {
        const player = document.getElementById('article-tts-player');
        const playBtn = document.getElementById('tts-play-btn');
        const statusText = document.getElementById('tts-status-text');
        if (!player || !playBtn) return;

        const loc = getLocale();
        if (STATE.tts.isPlaying && !STATE.tts.isPaused) {
            player.classList.add('tts-playing');
            playBtn.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg> ${loc.ttsPause}`;
            if (statusText) statusText.textContent = loc.ttsSpeaking;
        } else if (STATE.tts.isPaused) {
            player.classList.remove('tts-playing');
            playBtn.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg> Возобновить`;
            if (statusText) statusText.textContent = 'Озвучивание приостановлено';
        } else {
            player.classList.remove('tts-playing');
            playBtn.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg> ${loc.ttsPlay}`;
            if (statusText) statusText.textContent = 'Аудиоверсия статьи (Text-to-Speech)';
        }
    }

    // =========================================================================
    // READER CUSTOMIZATION SETTINGS
    // =========================================================================

    function applyReaderSettings() {
        const root = document.documentElement;
        root.style.setProperty('--article-font-size', `${STATE.readerSettings.fontSize}px`);

        if (STATE.readerSettings.fontFamily === 'serif') {
            root.style.setProperty('--article-font-family', 'var(--font-serif)');
        } else if (STATE.readerSettings.fontFamily === 'mono') {
            root.style.setProperty('--article-font-family', 'var(--font-mono)');
        } else {
            root.style.setProperty('--article-font-family', 'var(--font-main)');
        }

        if (STATE.readerSettings.width === 'wide') {
            root.style.setProperty('--article-max-width', '1050px');
        } else {
            root.style.setProperty('--article-max-width', '820px');
        }

        if (DOM.fontSizeIndicator) {
            DOM.fontSizeIndicator.textContent = `${STATE.readerSettings.fontSize}px`;
        }

        DOM.fontChoiceBtns?.forEach(btn => {
            btn.classList.toggle('active', btn.getAttribute('data-font') === STATE.readerSettings.fontFamily);
        });

        DOM.widthChoiceBtns?.forEach(btn => {
            btn.classList.toggle('active', btn.getAttribute('data-width') === STATE.readerSettings.width);
        });

        localStorage.setItem('zeta_wiki_reader_settings', JSON.stringify(STATE.readerSettings));
    }

    function setupReaderControls() {
        DOM.btnReaderSettings?.addEventListener('click', (e) => {
            e.stopPropagation();
            DOM.readerSettingsPanel?.classList.toggle('hidden');
        });

        DOM.btnCloseReaderSettings?.addEventListener('click', () => {
            DOM.readerSettingsPanel?.classList.add('hidden');
        });

        document.addEventListener('click', (e) => {
            if (!e.target.closest('#reader-settings-panel') && !e.target.closest('#btn-reader-settings')) {
                DOM.readerSettingsPanel?.classList.add('hidden');
            }
        });

        DOM.btnFontSmaller?.addEventListener('click', () => {
            if (STATE.readerSettings.fontSize > 14) {
                STATE.readerSettings.fontSize -= 1;
                applyReaderSettings();
            }
        });

        DOM.btnFontLarger?.addEventListener('click', () => {
            if (STATE.readerSettings.fontSize < 24) {
                STATE.readerSettings.fontSize += 1;
                applyReaderSettings();
            }
        });

        DOM.fontChoiceBtns?.forEach(btn => {
            btn.addEventListener('click', () => {
                STATE.readerSettings.fontFamily = btn.getAttribute('data-font');
                applyReaderSettings();
            });
        });

        DOM.widthChoiceBtns?.forEach(btn => {
            btn.addEventListener('click', () => {
                STATE.readerSettings.width = btn.getAttribute('data-width');
                applyReaderSettings();
            });
        });
    }

    // =========================================================================
    // UI RENDERERS
    // =========================================================================

    function showSkeletonGrid() {
        let html = `
            <div class="page-header">
                <div class="skeleton skeleton-title"></div>
                <div class="skeleton skeleton-line short"></div>
            </div>
            <div class="grid-cards">
        `;
        for (let i = 0; i < 6; i++) {
            html += `<div class="skeleton skeleton-card"></div>`;
        }
        html += `</div>`;
        DOM.appContent.innerHTML = html;
    }

    function showSkeletonArticle() {
        DOM.appContent.innerHTML = `
            <div class="article-view-layout">
                <div class="article-main-column">
                    <div class="skeleton skeleton-title"></div>
                    <div class="skeleton skeleton-banner"></div>
                    <div class="skeleton skeleton-line"></div>
                    <div class="skeleton skeleton-line"></div>
                    <div class="skeleton skeleton-line"></div>
                    <div class="skeleton skeleton-line short"></div>
                </div>
            </div>
        `;
    }

    function updateActiveNav(hash) {
        DOM.navLinks.forEach(link => {
            link.classList.remove('active');
            const targetNav = link.getAttribute('data-nav');
            if (
                (hash === '#home' && targetNav === 'home') ||
                (hash === '' && targetNav === 'home') ||
                (hash === '#saved' && targetNav === 'saved') ||
                (hash === '#history' && targetNav === 'history') ||
                (hash.startsWith('#category/') && targetNav === hash.substring(1))
            ) {
                link.classList.add('active');
            }
        });

        // Update category label translations
        const loc = getLocale();
        document.querySelectorAll('.cat-label').forEach(label => {
            const catKey = label.getAttribute('data-cat');
            if (loc.categories[catKey]) {
                label.textContent = loc.categories[catKey].label;
            }
        });

        if (DOM.searchInput) {
            DOM.searchInput.placeholder = loc.searchPlaceholder;
        }
    }

    function renderCardsGrid(items, title, desc, emptyMsg) {
        const loc = getLocale();
        const safeTitle = escapeHTML(title);
        const safeDesc = escapeHTML(desc);

        let html = `
            <div class="page-header">
                <h1 class="page-title">${safeTitle}</h1>
                <p class="page-desc">${safeDesc}</p>
            </div>
        `;

        if (!items || items.length === 0) {
            html += `
                <div class="error-state-card">
                    <div class="error-icon">🔍</div>
                    <div class="error-title">Ничего не найдено</div>
                    <div class="error-desc">${escapeHTML(emptyMsg || loc.searchEmpty)}</div>
                    <a href="#home" class="btn-primary">На главную</a>
                </div>
            `;
        } else {
            html += `<div class="grid-cards">`;
            items.forEach(item => {
                const safeItemTitle = escapeHTML(item.title);
                const safeSnippet = escapeHTML(item.snippet);
                const imgMarkup = item.thumbnail
                    ? `<img src="${escapeHTML(item.thumbnail)}" class="wiki-card-img" alt="${safeItemTitle}" loading="lazy">`
                    : `<div class="wiki-card-placeholder-img">${safeItemTitle.charAt(0)}</div>`;

                html += `
                    <a href="#article/${encodeURIComponent(item.title)}" class="wiki-card">
                        <div class="wiki-card-img-wrapper">
                            ${imgMarkup}
                        </div>
                        <h2 class="wiki-card-title">${safeItemTitle}</h2>
                        <p class="wiki-card-snippet">${safeSnippet}</p>
                        <div class="wiki-card-footer">
                            <span>Читать статью &rarr;</span>
                        </div>
                    </a>
                `;
            });
            html += `</div>`;
        }

        DOM.appContent.innerHTML = html;
        document.title = `${title} — ZETA Wiki`;
    }

    function renderSavedArticlesView() {
        const loc = getLocale();
        const items = STATE.bookmarks;
        let html = `
            <div class="page-header" style="display: flex; justify-content: space-between; align-items: flex-end; flex-wrap: wrap; gap: 16px;">
                <div>
                    <h1 class="page-title">${loc.savedTitle}</h1>
                    <p class="page-desc">${loc.savedDesc}</p>
                </div>
                ${items.length > 0 ? `<button id="btn-clear-bookmarks" class="article-tool-btn">Очистить закладки</button>` : ''}
            </div>
        `;

        if (items.length === 0) {
            html += `
                <div class="error-state-card">
                    <div class="error-icon">⭐</div>
                    <div class="error-title">Закладок пока нет</div>
                    <div class="error-desc">Нажмите кнопку «В закладки» во время чтения любой статьи, чтобы сохранить её сюда.</div>
                    <a href="#home" class="btn-primary">Исследовать темы</a>
                </div>
            `;
        } else {
            html += `<div class="grid-cards">`;
            items.forEach(item => {
                const safeTitle = escapeHTML(item.title);
                const safeSnippet = escapeHTML(item.snippet || 'Статья сохранена.');
                const imgMarkup = item.thumbnail
                    ? `<img src="${escapeHTML(item.thumbnail)}" class="wiki-card-img" alt="${safeTitle}" loading="lazy">`
                    : `<div class="wiki-card-placeholder-img">${safeTitle.charAt(0)}</div>`;

                html += `
                    <a href="#article/${encodeURIComponent(item.title)}" class="wiki-card">
                        <div class="wiki-card-img-wrapper">
                            ${imgMarkup}
                        </div>
                        <h2 class="wiki-card-title">${safeTitle}</h2>
                        <p class="wiki-card-snippet">${safeSnippet}</p>
                        <div class="wiki-card-footer">
                            <span>Открыть статью &rarr;</span>
                        </div>
                    </a>
                `;
            });
            html += `</div>`;
        }

        DOM.appContent.innerHTML = html;
        document.title = `${loc.savedTitle} (${items.length}) — ZETA Wiki`;

        document.getElementById('btn-clear-bookmarks')?.addEventListener('click', () => {
            if (confirm('Очистить все закладки?')) {
                STATE.bookmarks = [];
                localStorage.setItem('zeta_wiki_bookmarks', '[]');
                updateBadges();
                renderSavedArticlesView();
                showToast('Все закладки удалены', '🗑️');
            }
        });
    }

    function renderHistoryView() {
        const loc = getLocale();
        const items = STATE.history;
        let html = `
            <div class="page-header" style="display: flex; justify-content: space-between; align-items: flex-end; flex-wrap: wrap; gap: 16px;">
                <div>
                    <h1 class="page-title">${loc.historyTitle}</h1>
                    <p class="page-desc">${loc.historyDesc}</p>
                </div>
                ${items.length > 0 ? `<button id="btn-clear-history" class="article-tool-btn">Очистить историю</button>` : ''}
            </div>
        `;

        if (items.length === 0) {
            html += `
                <div class="error-state-card">
                    <div class="error-icon">🕒</div>
                    <div class="error-title">История пуста</div>
                    <div class="error-desc">Прочитанные статьи будут автоматически сохраняться в этом списке.</div>
                    <a href="#home" class="btn-primary">На главную</a>
                </div>
            `;
        } else {
            html += `<div class="grid-cards">`;
            items.forEach(item => {
                const safeTitle = escapeHTML(item.title);
                const safeSnippet = escapeHTML(item.snippet || 'Статья была прочитана.');
                const timeStr = item.viewedAt ? new Date(item.viewedAt).toLocaleDateString() : '';
                const imgMarkup = item.thumbnail
                    ? `<img src="${escapeHTML(item.thumbnail)}" class="wiki-card-img" alt="${safeTitle}" loading="lazy">`
                    : `<div class="wiki-card-placeholder-img">${safeTitle.charAt(0)}</div>`;

                html += `
                    <a href="#article/${encodeURIComponent(item.title)}" class="wiki-card">
                        <div class="wiki-card-img-wrapper">
                            ${imgMarkup}
                        </div>
                        <h2 class="wiki-card-title">${safeTitle}</h2>
                        <p class="wiki-card-snippet">${safeSnippet}</p>
                        <div class="wiki-card-footer">
                            <span>Прочитать снова &rarr;</span>
                            <small style="color: var(--text-muted);">${timeStr}</small>
                        </div>
                    </a>
                `;
            });
            html += `</div>`;
        }

        DOM.appContent.innerHTML = html;
        document.title = `${loc.historyTitle} — ZETA Wiki`;

        document.getElementById('btn-clear-history')?.addEventListener('click', () => {
            if (confirm('Очистить историю просмотров?')) {
                STATE.history = [];
                localStorage.setItem('zeta_wiki_history', '[]');
                updateBadges();
                renderHistoryView();
                showToast('История просмотров очищена', '🗑️');
            }
        });
    }

    function renderArticleView(pageData) {
        stopTTS();

        if (!pageData || pageData.missing !== undefined) {
            DOM.appContent.innerHTML = `
                <div class="error-state-card">
                    <div class="error-icon">⚠️</div>
                    <div class="error-title">Статья не найдена</div>
                    <div class="error-desc">К сожалению, такой страницы в выбранном языковом разделе Википедии нет.</div>
                    <a href="#home" class="btn-primary">На главную</a>
                </div>
            `;
            document.title = 'Статья не найдена — ZETA Wiki';
            return;
        }

        const safeTitle = escapeHTML(pageData.title);
        const cleanHTML = sanitizeArticleHTML(pageData.extract || '');
        const originalImageUrl = pageData.original ? pageData.original.source : null;
        const bookmarked = isBookmarked(pageData.title);

        const textOnly = (pageData.extract || '').replace(/<[^>]*>/g, ' ');
        const wordCount = textOnly.trim().split(/\s+/).length;
        const readMinutes = Math.max(1, Math.ceil(wordCount / 180));
        const wikiSourceUrl = `https://${STATE.lang}.wikipedia.org/wiki/${encodeURIComponent(pageData.title)}`;
        const loc = getLocale();

        let html = `
            <div class="article-view-layout">
                <article class="article-main-column">
                    <header class="article-header">
                        <h1 class="article-title">${safeTitle}</h1>
                        
                        <div class="article-toolbar">
                            <button id="btn-bookmark-action" class="article-tool-btn ${bookmarked ? 'active' : ''}">
                                ${bookmarked
                                    ? `<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2"><path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/></svg> Сохранено`
                                    : `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/></svg> В закладки`
                                }
                            </button>

                            <button id="btn-share-action" class="article-tool-btn">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/></svg>
                                Поделиться
                            </button>

                            <a href="${escapeHTML(wikiSourceUrl)}" target="_blank" rel="noopener noreferrer" class="article-tool-btn">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                                Источник
                            </a>

                            <div class="article-read-time">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                                <span>~${readMinutes} мин чтения</span>
                            </div>
                        </div>

                        <!-- Audio TTS Narrator Widget -->
                        <div class="article-tts-player" id="article-tts-player">
                            <button id="tts-play-btn" class="tts-btn">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                                ${loc.ttsPlay}
                            </button>
                            <button id="tts-stop-btn" class="tts-btn-stop" title="Остановить">${loc.ttsStop}</button>
                            
                            <div class="tts-audio-waves">
                                <div class="audio-bar"></div>
                                <div class="audio-bar"></div>
                                <div class="audio-bar"></div>
                                <div class="audio-bar"></div>
                            </div>

                            <span class="tts-status-text" id="tts-status-text">Аудиоверсия статьи (Text-to-Speech)</span>
                        </div>

                        <!-- Mobile Collapsible Table of Contents -->
                        <details class="mobile-toc-accordion" id="mobile-toc-accordion">
                            <summary class="mobile-toc-summary">
                                <span>📑 Содержание статьи</span>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>
                            </summary>
                            <div class="mobile-toc-content">
                                <ul class="mobile-toc-list" id="mobile-toc-list"></ul>
                            </div>
                        </details>
                    </header>

                    ${originalImageUrl ? `<img src="${escapeHTML(originalImageUrl)}" alt="${safeTitle}" class="article-image-banner">` : ''}

                    <div class="article-content" id="article-body">
                        ${cleanHTML}
                    </div>
                </article>

                <!-- Desktop Sticky Table of Contents -->
                <aside class="article-toc-column" id="article-toc-column">
                    <div class="toc-title">Содержание</div>
                    <ul class="toc-list" id="toc-list"></ul>
                </aside>
            </div>
        `;

        DOM.appContent.innerHTML = html;
        document.title = `${pageData.title} — ZETA Wiki`;

        // Cache and Record History
        STATE.currentArticleData = {
            title: pageData.title,
            snippet: textOnly.slice(0, 150),
            thumbnail: originalImageUrl
        };
        recordReadingHistory(STATE.currentArticleData);

        // Attach Toolbar Listeners
        document.getElementById('btn-bookmark-action')?.addEventListener('click', () => {
            if (STATE.currentArticleData) toggleBookmark(STATE.currentArticleData);
        });

        document.getElementById('btn-share-action')?.addEventListener('click', () => {
            navigator.clipboard.writeText(window.location.href).then(() => {
                showToast('Ссылка скопирована в буфер обмена', '🔗');
            }).catch(() => {
                showToast('Не удалось скопировать', '❌');
            });
        });

        // TTS Audio Listeners
        document.getElementById('tts-play-btn')?.addEventListener('click', () => {
            toggleTTS(textOnly);
        });

        document.getElementById('tts-stop-btn')?.addEventListener('click', () => {
            stopTTS();
        });

        // Enhance Code Blocks with Copy button
        enhanceCodeBlocks();

        // Generate Table of Contents
        generateTableOfContents();
    }

    function enhanceCodeBlocks() {
        const articleBody = document.getElementById('article-body');
        if (!articleBody) return;

        const pres = articleBody.querySelectorAll('pre');
        pres.forEach((pre) => {
            const wrapper = document.createElement('div');
            wrapper.className = 'code-block-wrapper';

            const header = document.createElement('div');
            header.className = 'code-block-header';
            header.innerHTML = `<span>КОД / ТЕКСТ</span><button class="code-copy-btn">Копировать</button>`;

            pre.parentNode.insertBefore(wrapper, pre);
            wrapper.appendChild(header);
            wrapper.appendChild(pre);

            const copyBtn = header.querySelector('.code-copy-btn');
            copyBtn.addEventListener('click', () => {
                navigator.clipboard.writeText(pre.textContent).then(() => {
                    copyBtn.textContent = 'Скопировано!';
                    setTimeout(() => copyBtn.textContent = 'Копировать', 2000);
                });
            });
        });
    }

    function generateTableOfContents() {
        const articleBody = document.getElementById('article-body');
        const tocList = document.getElementById('toc-list');
        const mobileTocList = document.getElementById('mobile-toc-list');
        const tocColumn = document.getElementById('article-toc-column');
        const mobileTocAccordion = document.getElementById('mobile-toc-accordion');
        if (!articleBody || !tocList || !tocColumn) return;

        const headings = articleBody.querySelectorAll('h2, h3');
        if (headings.length < 2) {
            tocColumn.style.display = 'none';
            if (mobileTocAccordion) mobileTocAccordion.style.display = 'none';
            return;
        }

        headings.forEach((heading, index) => {
            const headingId = `sec-${index}`;
            heading.id = headingId;

            // Desktop TOC item
            const li = document.createElement('li');
            li.className = `toc-item depth-${heading.tagName === 'H2' ? '2' : '3'}`;
            li.setAttribute('data-target', headingId);

            const a = document.createElement('a');
            a.href = `#${headingId}`;
            a.textContent = heading.textContent.trim();
            a.addEventListener('click', (e) => {
                e.preventDefault();
                heading.scrollIntoView({ behavior: 'smooth' });
            });
            li.appendChild(a);
            tocList.appendChild(li);

            // Mobile TOC item
            if (mobileTocList) {
                const mLi = document.createElement('li');
                const mA = document.createElement('a');
                mA.href = `#${headingId}`;
                mA.textContent = heading.textContent.trim();
                mA.addEventListener('click', (e) => {
                    e.preventDefault();
                    mobileTocAccordion.removeAttribute('open');
                    heading.scrollIntoView({ behavior: 'smooth' });
                });
                mLi.appendChild(mA);
                mobileTocList.appendChild(mLi);
            }
        });

        // IntersectionObserver for active heading
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.id;
                    tocList.querySelectorAll('.toc-item').forEach(item => {
                        item.classList.toggle('active', item.getAttribute('data-target') === id);
                    });
                }
            });
        }, { root: DOM.appContent, threshold: 0.2 });

        headings.forEach(h => observer.observe(h));
    }

    function renderDeveloperPortal() {
        stopTTS();
        DOM.appContent.innerHTML = `
            <div class="dev-portal-view">
                <div class="dev-hero">
                    <div class="dev-avatar-lg">V</div>
                    <h1 class="dev-hero-title">VIGER Developer Portal</h1>
                    <p class="dev-hero-subtitle">Темуршох Ахмадалиев &bull; Software Engineer & Creator</p>
                    
                    <div class="dev-badges-row">
                        <span class="dev-pill">⚡ Architecture & Fullstack</span>
                        <span class="dev-pill">🤖 AI Automation</span>
                        <span class="dev-pill">🚀 Open Source</span>
                        <span class="dev-pill">🎧 Built-in TTS Narrator</span>
                    </div>
                </div>

                <div class="dev-terminal">
                    <div class="dev-terminal-header">
                        <div class="dot dot-red"></div>
                        <div class="dot dot-yellow"></div>
                        <div class="dot dot-green"></div>
                        <span class="terminal-title">viger@zeta-core:~</span>
                    </div>
                    <div><span class="terminal-green">$</span> zeta-wiki --full-audit-report</div>
                    <div class="terminal-text"><span class="terminal-green">[OK]</span> Zero XSS (Strict Browser DOMParser Sanitizer)</div>
                    <div class="terminal-text"><span class="terminal-green">[OK]</span> Race Conditions Eliminated (AbortController)</div>
                    <div class="terminal-text"><span class="terminal-green">[OK]</span> Multi-Language Wikipedia Integration (RU, EN, UZ, DE, ES, FR)</div>
                    <div class="terminal-text"><span class="terminal-green">[OK]</span> Cross-Language Article Redirection (prop=langlinks)</div>
                    <div class="terminal-text"><span class="terminal-green">[OK]</span> Web Speech Audio Narrator Active</div>
                    <div class="terminal-text"><span class="terminal-green">[OK]</span> Reader Mode (Sans, Serif Book, Mono + Sizing)</div>
                    <div class="terminal-text"><span class="terminal-green">[OK]</span> Progressive Web App (PWA + Service Worker) Enabled</div>
                    <br>
                    <div><span class="terminal-green">$</span> echo "Built with speed, precision and security."</div>
                    <div class="terminal-yellow">"Built with speed, precision and security."</div>
                </div>

                <div style="text-align: center;">
                    <a href="#home" class="btn-primary">Вернуться к энциклопедии</a>
                </div>
            </div>
        `;
        document.title = 'Developer Portal — ZETA Wiki';
    }

    // =========================================================================
    // ROUTER
    // =========================================================================

    async function handleRoute() {
        const hash = window.location.hash || '#home';
        updateActiveNav(hash);
        closeMobileSidebar();
        DOM.appContent.scrollTo({ top: 0, behavior: 'instant' });
        const loc = getLocale();

        try {
            if (hash === '#home' || hash === '') {
                showSkeletonGrid();
                const items = await fetchWikiSearchWithImages(loc.homeQuery, 16);
                renderCardsGrid(items, loc.homeTitle, loc.homeDesc);
            }
            else if (hash === '#saved') {
                renderSavedArticlesView();
            }
            else if (hash === '#history') {
                renderHistoryView();
            }
            else if (hash === '#random') {
                showSkeletonArticle();
                const randomTitle = await fetchRandomArticle();
                if (randomTitle) {
                    window.location.hash = `#article/${encodeURIComponent(randomTitle)}`;
                } else {
                    DOM.appContent.innerHTML = `<div class="error-state-card"><div class="error-title">Ошибка</div><div class="error-desc">Не удалось получить случайную статью.</div></div>`;
                }
            }
            else if (hash.startsWith('#category/')) {
                const catSlug = decodeURIComponent(hash.replace('#category/', ''));
                const catObj = loc.categories[catSlug] || { query: catSlug, label: catSlug };
                showSkeletonGrid();
                const items = await fetchWikiSearchWithImages(catObj.query, 18);
                renderCardsGrid(items, catObj.label, `Подборка актуальных статей по теме «${catObj.label}».`);
            }
            else if (hash.startsWith('#search/')) {
                const query = decodeURIComponent(hash.replace('#search/', ''));
                showSkeletonGrid();
                const items = await fetchWikiSearchWithImages(query, 24);
                renderCardsGrid(items, loc.searchTitle, loc.searchDesc.replace('{query}', query));
            }
            else if (hash.startsWith('#article/')) {
                const title = decodeURIComponent(hash.replace('#article/', ''));
                showSkeletonArticle();
                const articleData = await fetchWikiArticle(title);
                renderArticleView(articleData);
            }
            else if (hash === '#viger') {
                renderDeveloperPortal();
            }
            else {
                DOM.appContent.innerHTML = `
                    <div class="error-state-card">
                        <div class="error-icon">404</div>
                        <div class="error-title">Страница не найдена</div>
                        <div class="error-desc">Такого раздела не существует. Воспользуйтесь меню или строкой поиска.</div>
                        <a href="#home" class="btn-primary">На главную</a>
                    </div>
                `;
                document.title = 'Страница не найдена — ZETA Wiki';
            }
        } catch (err) {
            console.error('Route handling error:', err);
            DOM.appContent.innerHTML = `
                <div class="error-state-card">
                    <div class="error-icon">📡</div>
                    <div class="error-title">Ошибка сети</div>
                    <div class="error-desc">Не удалось загрузить данные из Wikipedia API. Проверьте подключение к интернету.</div>
                    <button class="btn-primary" onclick="window.location.reload()">Повторить попытку</button>
                </div>
            `;
        }
    }

    // =========================================================================
    // SEARCH & AUTOCOMPLETE LOGIC
    // =========================================================================

    function closeSuggestions() {
        DOM.searchSuggestions.classList.add('hidden');
        STATE.selectedSuggestionIndex = -1;
        STATE.suggestions = [];
    }

    function renderSuggestions(list) {
        STATE.suggestions = list;
        STATE.selectedSuggestionIndex = -1;

        if (list.length === 0) {
            closeSuggestions();
            return;
        }

        DOM.suggestionsList.innerHTML = list.map((item, idx) => `
            <li class="suggestion-item" data-index="${idx}" role="option">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
                <span>${escapeHTML(item)}</span>
            </li>
        `).join('');

        DOM.searchSuggestions.classList.remove('hidden');
    }

    DOM.searchInput.addEventListener('input', (e) => {
        const val = e.target.value.trim();
        DOM.searchClearBtn.classList.toggle('hidden', val.length === 0);

        clearTimeout(STATE.searchDebounceTimer);
        if (val.length < 2) {
            closeSuggestions();
            return;
        }

        STATE.searchDebounceTimer = setTimeout(async () => {
            const suggestions = await fetchSearchSuggestions(val);
            renderSuggestions(suggestions);
        }, 220);
    });

    DOM.searchClearBtn.addEventListener('click', () => {
        DOM.searchInput.value = '';
        DOM.searchClearBtn.classList.add('hidden');
        closeSuggestions();
        DOM.searchInput.focus();
    });

    // Keyboard navigation in search suggestions
    DOM.searchInput.addEventListener('keydown', (e) => {
        const items = DOM.suggestionsList.querySelectorAll('.suggestion-item');

        if (e.key === 'ArrowDown') {
            e.preventDefault();
            if (items.length > 0) {
                STATE.selectedSuggestionIndex = (STATE.selectedSuggestionIndex + 1) % items.length;
                updateSuggestionHighlight(items);
            }
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (items.length > 0) {
                STATE.selectedSuggestionIndex = (STATE.selectedSuggestionIndex - 1 + items.length) % items.length;
                updateSuggestionHighlight(items);
            }
        } else if (e.key === 'Enter') {
            if (STATE.selectedSuggestionIndex >= 0 && STATE.suggestions[STATE.selectedSuggestionIndex]) {
                e.preventDefault();
                selectSuggestion(STATE.suggestions[STATE.selectedSuggestionIndex]);
            } else {
                handleSearchSubmit();
            }
        } else if (e.key === 'Escape') {
            closeSuggestions();
        }
    });

    function updateSuggestionHighlight(items) {
        items.forEach((item, idx) => {
            item.classList.toggle('selected', idx === STATE.selectedSuggestionIndex);
            if (idx === STATE.selectedSuggestionIndex) {
                DOM.searchInput.value = STATE.suggestions[idx];
            }
        });
    }

    function selectSuggestion(title) {
        closeSuggestions();
        DOM.searchInput.value = '';
        DOM.searchClearBtn.classList.add('hidden');
        DOM.searchInput.blur();
        window.location.hash = `#article/${encodeURIComponent(title)}`;
    }

    DOM.suggestionsList.addEventListener('click', (e) => {
        const item = e.target.closest('.suggestion-item');
        if (item) {
            const idx = parseInt(item.getAttribute('data-index'), 10);
            if (!isNaN(idx) && STATE.suggestions[idx]) {
                selectSuggestion(STATE.suggestions[idx]);
            }
        }
    });

    document.addEventListener('click', (e) => {
        if (!e.target.closest('#search-container')) {
            closeSuggestions();
        }
    });

    function handleSearchSubmit() {
        const query = DOM.searchInput.value.trim();
        if (query) {
            closeSuggestions();
            if (VIGER_TAGS.includes(query.toLowerCase())) {
                window.location.hash = '#viger';
            } else {
                window.location.hash = `#search/${encodeURIComponent(query)}`;
            }
            DOM.searchInput.value = '';
            DOM.searchClearBtn.classList.add('hidden');
            DOM.searchInput.blur();
        }
    }

    DOM.searchForm.addEventListener('submit', (e) => {
        e.preventDefault();
        handleSearchSubmit();
    });

    // =========================================================================
    // THEME & LANGUAGE HANDLERS
    // =========================================================================

    function applyTheme(theme) {
        document.body.classList.remove('theme-dark', 'theme-light', 'theme-oled');
        document.body.classList.add(`theme-${theme}`);
        localStorage.setItem('zeta_wiki_theme', theme);
        STATE.theme = theme;
    }

    DOM.themeToggleBtn.addEventListener('click', () => {
        const nextTheme = STATE.theme === 'dark' ? 'light' : STATE.theme === 'light' ? 'oled' : 'dark';
        applyTheme(nextTheme);
        showToast(`Тема: ${nextTheme.toUpperCase()}`, '🎨');
    });

    DOM.langSelect.value = STATE.lang;
    DOM.langSelect.addEventListener('change', (e) => {
        const newLang = e.target.value;
        const oldLang = STATE.lang;
        STATE.lang = newLang;
        localStorage.setItem('zeta_wiki_lang', STATE.lang);
        STATE.cache.clear();

        showToast(`Язык: ${STATE.lang.toUpperCase()}`, '🌐');

        // Check if currently on an article and cross-language translation exists
        const hash = window.location.hash || '';
        if (hash.startsWith('#article/') && STATE.currentLangLinks[newLang]) {
            const translatedTitle = STATE.currentLangLinks[newLang];
            window.location.hash = `#article/${encodeURIComponent(translatedTitle)}`;
        } else {
            handleRoute();
        }
    });

    // =========================================================================
    // MOBILE DRAWER, SCROLL PROGRESS & BACK TO TOP
    // =========================================================================

    function openMobileSidebar() {
        DOM.sidebar.classList.add('open');
        DOM.sidebarOverlay.classList.add('active');
    }

    function closeMobileSidebar() {
        DOM.sidebar.classList.remove('open');
        DOM.sidebarOverlay.classList.remove('active');
    }

    DOM.mobileBtn.addEventListener('click', openMobileSidebar);
    DOM.sidebarCloseBtn?.addEventListener('click', closeMobileSidebar);
    DOM.sidebarOverlay.addEventListener('click', closeMobileSidebar);

    // Reading progress tracker & Back to top button listener
    DOM.appContent.addEventListener('scroll', () => {
        const scrollTop = DOM.appContent.scrollTop;
        const scrollHeight = DOM.appContent.scrollHeight - DOM.appContent.clientHeight;
        const progress = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
        DOM.readingProgressBar.style.width = `${Math.min(100, Math.max(0, progress))}%`;

        // Back to top button visibility
        if (DOM.btnBackToTop) {
            DOM.btnBackToTop.classList.toggle('hidden', scrollTop < 350);
        }
    });

    DOM.btnBackToTop?.addEventListener('click', () => {
        DOM.appContent.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // =========================================================================
    // POWER USER KEYBOARD SHORTCUTS
    // =========================================================================

    window.addEventListener('keydown', (e) => {
        const isInputFocused = ['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName);

        // Ctrl + K or "/" to focus search
        if ((e.ctrlKey && e.key.toLowerCase() === 'k') || (e.key === '/' && !isInputFocused)) {
            e.preventDefault();
            DOM.searchInput.focus();
            DOM.searchInput.select();
        }
        // Esc to dismiss modals and focus
        else if (e.key === 'Escape') {
            closeSuggestions();
            DOM.readerSettingsPanel?.classList.add('hidden');
            closeMobileSidebar();
            if (isInputFocused) DOM.searchInput.blur();
        }
        // Alt + R: Random article
        else if (e.altKey && e.key.toLowerCase() === 'r') {
            e.preventDefault();
            window.location.hash = '#random';
        }
        // Alt + T: Cycle theme
        else if (e.altKey && e.key.toLowerCase() === 't') {
            e.preventDefault();
            const nextTheme = STATE.theme === 'dark' ? 'light' : STATE.theme === 'light' ? 'oled' : 'dark';
            applyTheme(nextTheme);
            showToast(`Тема: ${nextTheme.toUpperCase()}`, '🎨');
        }
        // Alt + H: Go home
        else if (e.altKey && e.key.toLowerCase() === 'h') {
            e.preventDefault();
            window.location.hash = '#home';
        }
    });

    // =========================================================================
    // OFFLINE DETECTION & SERVICE WORKER
    // =========================================================================

    function updateOnlineStatus() {
        if (DOM.offlineBanner) {
            DOM.offlineBanner.classList.toggle('hidden', navigator.onLine);
        }
    }

    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);
    updateOnlineStatus();

    // Register PWA Service Worker if available
    if ('serviceWorker' in navigator && (location.protocol === 'https:' || location.hostname === 'localhost')) {
        navigator.serviceWorker.register('sw.js').catch(err => {
            console.log('SW registration skipped or failed:', err);
        });
    }

    // =========================================================================
    // INITIALIZATION
    // =========================================================================

    window.addEventListener('hashchange', handleRoute);

    // Apply saved preferences
    applyTheme(STATE.theme);
    applyReaderSettings();
    setupReaderControls();
    updateBadges();

    // Initial Route Execution
    handleRoute();

})();
