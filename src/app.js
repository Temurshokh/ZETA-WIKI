/**
 * ZETA WIKI - Modern, Secure, High-Performance Encyclopedia (v2.1)
 * Features:
 * - Dynamic I18n with full UI localization (Navigation, Categories, Modals, Banners)
 * - Native Article Language Links (Cross-language switching with redirect handling)
 * - Web Speech API Text-to-Speech (TTS) article narration with auto-voice matching
 * - Reader Mode (Font size, Serif/Sans/Mono, True Wide Column width 1050px)
 * - Browsing History & Offline Bookmarks with Full-Article Content Persistence
 * - Responsive Table of Contents (Desktop Sticky + Mobile Collapsible Accordion)
 * - In-Article Citation & Anchor Interception (No 404 on #cite_note jumps)
 * - Safe HTML Sanitizer (RFC-compliant protocol whitelisting & URIError protection)
 * - Asynchronous Generation Token (Race-condition free SPA Routing)
 * - PWA Service Worker & Real-time Network/Offline Status Detection
 */

(function () {
    'use strict';

    // =========================================================================
    // I18N DICTIONARY & FULL UI LOCALIZATION
    // =========================================================================
    const I18N = {
        ru: {
            navSections: 'Разделы',
            navHome: 'Главная',
            navSaved: 'Закладки',
            navHistory: 'История',
            navRandom: 'Случайная',
            navCategories: 'Категории',
            suggestionsHeader: 'Подсказки',
            offlineBanner: 'Вы находитесь в оффлайн-режиме. Доступны сохранённые статьи и закладки.',
            offlineBadge: 'Оффлайн-копия',
            homeQuery: 'Научные открытия и технологии',
            homeTitle: 'Главные темы',
            homeDesc: 'Свободная современная энциклопедия. Выберите категорию или воспользуйтесь быстрым поиском.',
            searchTitle: 'Результаты поиска',
            searchDesc: 'Найдено по запросу: «{query}»',
            searchEmpty: 'По вашему запросу ничего не найдено.',
            searchPlaceholder: 'Поиск в Википедии (Ctrl+K)...',
            savedTitle: 'Закладки',
            savedDesc: 'Сохраненные статьи для быстрого чтения оффлайн или позже.',
            savedEmptyTitle: 'Закладок пока нет',
            savedEmptyDesc: 'Нажмите кнопку «В закладки» во время чтения любой статьи, чтобы сохранить её с текстом для оффлайн-доступа.',
            clearSaved: 'Очистить закладки',
            clearSavedConfirm: 'Очистить все сохранённые закладки?',
            savedToast: 'Статья сохранена в закладки (доступна оффлайн)',
            removedToast: 'Статья удалена из закладок',
            historyTitle: 'История просмотров',
            historyDesc: 'Недавно прочитанные статьи в этом браузере.',
            historyEmptyTitle: 'История пуста',
            historyEmptyDesc: 'Прочитанные статьи будут автоматически сохраняться в этом списке.',
            clearHistory: 'Очистить историю',
            clearHistoryConfirm: 'Очистить всю историю просмотров?',
            readAgain: 'Прочитать снова &rarr;',
            readArticle: 'Читать статью &rarr;',
            ttsPlay: 'Слушать статью',
            ttsPause: 'Пауза',
            ttsResume: 'Возобновить',
            ttsStop: 'Стоп',
            ttsSpeaking: 'Озвучивание статьи...',
            ttsPaused: 'Озвучивание приостановлено',
            ttsDefault: 'Аудиоверсия статьи (Text-to-Speech)',
            articleNotFoundTitle: 'Статья не найдена',
            articleNotFoundDesc: 'К сожалению, такой страницы в выбранном языковом разделе Википедии нет.',
            netErrorTitle: 'Ошибка сети',
            netErrorDesc: 'Не удалось загрузить данные из Wikipedia API. Проверьте интернет-соединение.',
            retryBtn: 'Повторить попытку',
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
            navSections: 'Sections',
            navHome: 'Home',
            navSaved: 'Bookmarks',
            navHistory: 'History',
            navRandom: 'Random',
            navCategories: 'Categories',
            suggestionsHeader: 'Suggestions',
            offlineBanner: 'You are currently offline. Saved bookmarks and cached articles are available.',
            offlineBadge: 'Offline Copy',
            homeQuery: 'Scientific discoveries and technology',
            homeTitle: 'Featured Topics',
            homeDesc: 'Free modern encyclopedia. Choose a category or use the instant search.',
            searchTitle: 'Search Results',
            searchDesc: 'Results for: "{query}"',
            searchEmpty: 'No articles found for your query.',
            searchPlaceholder: 'Search Wikipedia (Ctrl+K)...',
            savedTitle: 'Bookmarks',
            savedDesc: 'Saved articles for fast reading offline or later.',
            savedEmptyTitle: 'No bookmarks yet',
            savedEmptyDesc: 'Click "Bookmark" while reading any article to save it with text for offline reading.',
            clearSaved: 'Clear bookmarks',
            clearSavedConfirm: 'Remove all saved bookmarks?',
            savedToast: 'Article bookmarked (available offline)',
            removedToast: 'Article removed from bookmarks',
            historyTitle: 'Reading History',
            historyDesc: 'Recently viewed articles in this browser.',
            historyEmptyTitle: 'History is empty',
            historyEmptyDesc: 'Articles you read will automatically appear here.',
            clearHistory: 'Clear history',
            clearHistoryConfirm: 'Clear all reading history?',
            readAgain: 'Read again &rarr;',
            readArticle: 'Read article &rarr;',
            ttsPlay: 'Listen to article',
            ttsPause: 'Pause',
            ttsResume: 'Resume',
            ttsStop: 'Stop',
            ttsSpeaking: 'Narrating article...',
            ttsPaused: 'Narration paused',
            ttsDefault: 'Audio version (Text-to-Speech)',
            articleNotFoundTitle: 'Article not found',
            articleNotFoundDesc: 'Unfortunately, this article does not exist in the selected language section.',
            netErrorTitle: 'Network Error',
            netErrorDesc: 'Failed to fetch data from Wikipedia API. Check your connection.',
            retryBtn: 'Retry',
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
            navSections: 'Boʻlimlar',
            navHome: 'Bosh sahifa',
            navSaved: 'Xatchoʻplar',
            navHistory: 'Tarix',
            navRandom: 'Tasodifiy',
            navCategories: 'Kategoriyalar',
            suggestionsHeader: 'Tavsiyalar',
            offlineBanner: 'Siz oflayn rejimdasiz. Saqlangan xatchoʻplar va maqolalar mavjud.',
            offlineBadge: 'Oflayn nusxa',
            homeQuery: 'Ilmiy kashfiyotlar va texnologiyalar',
            homeTitle: 'Asosiy mavzular',
            homeDesc: 'Zamonaviy erkin ensiklopediya. Kategoriya tanlang yoki tezkor qidiruvdan foydalaning.',
            searchTitle: 'Qidiruv natijalari',
            searchDesc: '«{query}» soʻrovi boʻyicha natijalar',
            searchEmpty: 'Soʻrovingiz boʻyicha hech narsa topilmadi.',
            searchPlaceholder: 'Vikipediyadan qidirish (Ctrl+K)...',
            savedTitle: 'Xatchoʻplar',
            savedDesc: 'Keyinroq oflayn oʻqish uchun saqlangan maqolalar.',
            savedEmptyTitle: 'Xatchoʻplar hali yoʻq',
            savedEmptyDesc: 'Maqolani oflayn oʻqish uchun «Xatchoʻpga» tugmasini bosing.',
            clearSaved: 'Xatchoʻplarni tozalash',
            clearSavedConfirm: 'Barcha xatchoʻplar oʻchirilsinmi?',
            savedToast: 'Maqola xatchoʻplarga saqlandi (oflayn mavjud)',
            removedToast: 'Maqola xatchoʻplardan oʻchirildi',
            historyTitle: 'Koʻrishlar tarixi',
            historyDesc: 'Ushbu brauzerda yaqinda oʻqilgan maqolalar.',
            historyEmptyTitle: 'Tarix boʻsh',
            historyEmptyDesc: 'Oʻqilgan maqolalar avtomatik ravishda bu yerda saqlanadi.',
            clearHistory: 'Tarixni tozalash',
            clearHistoryConfirm: 'Barcha koʻrishlar tarixi tozalansinmi?',
            readAgain: 'Qayta oʻqish &rarr;',
            readArticle: 'Maqolani ochish &rarr;',
            ttsPlay: 'Maqolani tinglash',
            ttsPause: 'Pauza',
            ttsResume: 'Davom ettirish',
            ttsStop: 'Toʻxtatish',
            ttsSpeaking: 'Maqola oʻqilmoqda...',
            ttsPaused: 'Oʻqish toʻxtatib turildi',
            ttsDefault: 'Ovozli versiya (Text-to-Speech)',
            articleNotFoundTitle: 'Maqola topilmadi',
            articleNotFoundDesc: 'Afsuski, tanlangan tildagi boʻlimda bunday maqola mavjud emas.',
            netErrorTitle: 'Tarmoq xatosi',
            netErrorDesc: 'Vikipediya API bilan aloqa oʻrnatib boʻlmadi. Internetni tekshiring.',
            retryBtn: 'Qayta urinish',
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
            navSections: 'Abschnitte',
            navHome: 'Startseite',
            navSaved: 'Lesezeichen',
            navHistory: 'Verlauf',
            navRandom: 'Zufall',
            navCategories: 'Kategorien',
            suggestionsHeader: 'Vorschläge',
            offlineBanner: 'Sie sind offline. Gespeicherte Lesezeichen sind verfügbar.',
            offlineBadge: 'Offline-Kopie',
            homeQuery: 'Wissenschaftliche Entdeckungen und Technologie',
            homeTitle: 'Hauptthemen',
            homeDesc: 'Moderne freie Enzyklopädie. Wählen Sie eine Kategorie oder suchen Sie gezielt.',
            searchTitle: 'Suchergebnisse',
            searchDesc: 'Gefunden für: «{query}»',
            searchEmpty: 'Keine Artikel zu Ihrer Suchanfrage gefunden.',
            searchPlaceholder: 'Wikipedia durchsuchen (Ctrl+K)...',
            savedTitle: 'Lesezeichen',
            savedDesc: 'Gespeicherte Artikel für späteres Offline-Lesen.',
            savedEmptyTitle: 'Noch keine Lesezeichen',
            savedEmptyDesc: 'Klicken Sie beim Lesen auf «Lesezeichen», um den Artikel zu speichern.',
            clearSaved: 'Lesezeichen leeren',
            clearSavedConfirm: 'Alle Lesezeichen entfernen?',
            savedToast: 'Artikel gespeichert (offline verfügbar)',
            removedToast: 'Artikel aus Lesezeichen entfernt',
            historyTitle: 'Verlauf',
            historyDesc: 'Kürzlich angesehene Artikel in diesem Browser.',
            historyEmptyTitle: 'Verlauf ist leer',
            historyEmptyDesc: 'Gelesene Artikel werden automatisch hier erfasst.',
            clearHistory: 'Verlauf leeren',
            clearHistoryConfirm: 'Gesamten Verlauf löschen?',
            readAgain: 'Erneut lesen &rarr;',
            readArticle: 'Artikel lesen &rarr;',
            ttsPlay: 'Artikel anhören',
            ttsPause: 'Pause',
            ttsResume: 'Fortsetzen',
            ttsStop: 'Stopp',
            ttsSpeaking: 'Artikel wird vorgelesen...',
            ttsPaused: 'Wiedergabe pausiert',
            ttsDefault: 'Audioversion (Text-to-Speech)',
            articleNotFoundTitle: 'Artikel nicht gefunden',
            articleNotFoundDesc: 'Dieser Artikel existiert in dieser Sprachversion leider nicht.',
            netErrorTitle: 'Netzwerkfehler',
            netErrorDesc: 'Verbindung zur Wikipedia API fehlgeschlagen.',
            retryBtn: 'Erneut versuchen',
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
            navSections: 'Secciones',
            navHome: 'Inicio',
            navSaved: 'Marcadores',
            navHistory: 'Historial',
            navRandom: 'Aleatorio',
            navCategories: 'Categorías',
            suggestionsHeader: 'Sugerencias',
            offlineBanner: 'Estás sin conexión. Los marcadores guardados están disponibles.',
            offlineBadge: 'Copia sin conexión',
            homeQuery: 'Descubrimientos científicos y tecnología',
            homeTitle: 'Temas Destacados',
            homeDesc: 'Enciclopedia moderna y libre. Explora categorías o busca un artículo.',
            searchTitle: 'Resultados de búsqueda',
            searchDesc: 'Resultados para: «{query}»',
            searchEmpty: 'No se encontraron artículos.',
            searchPlaceholder: 'Buscar en Wikipedia (Ctrl+K)...',
            savedTitle: 'Marcadores',
            savedDesc: 'Artículos guardados para leer sin conexión.',
            savedEmptyTitle: 'Sin marcadores',
            savedEmptyDesc: 'Pulsa «Guardar» en cualquier artículo para tenerlo sin conexión.',
            clearSaved: 'Borrar marcadores',
            clearSavedConfirm: '¿Eliminar todos los marcadores guardados?',
            savedToast: 'Artículo guardado en marcadores',
            removedToast: 'Artículo eliminado de marcadores',
            historyTitle: 'Historial',
            historyDesc: 'Artículos leídos recientemente.',
            historyEmptyTitle: 'El historial está vacío',
            historyEmptyDesc: 'Los artículos que leas aparecerán aquí.',
            clearHistory: 'Borrar historial',
            clearHistoryConfirm: '¿Eliminar todo el historial?',
            readAgain: 'Leer de nuevo &rarr;',
            readArticle: 'Abrir artículo &rarr;',
            ttsPlay: 'Escuchar artículo',
            ttsPause: 'Pausa',
            ttsResume: 'Reanudar',
            ttsStop: 'Detener',
            ttsSpeaking: 'Reproduciendo artículo...',
            ttsPaused: 'Reproducción pausada',
            ttsDefault: 'Versión en audio (Text-to-Speech)',
            articleNotFoundTitle: 'Artículo no encontrado',
            articleNotFoundDesc: 'No existe este artículo en la Wikipedia seleccionada.',
            netErrorTitle: 'Error de red',
            netErrorDesc: 'No se pudieron cargar datos desde Wikipedia API.',
            retryBtn: 'Reintentar',
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
            navSections: 'Sections',
            navHome: 'Accueil',
            navSaved: 'Signets',
            navHistory: 'Historique',
            navRandom: 'Aléatoire',
            navCategories: 'Catégories',
            suggestionsHeader: 'Suggestions',
            offlineBanner: 'Vous êtes hors-ligne. Les signets enregistrés sont accessibles.',
            offlineBadge: 'Copie hors-ligne',
            homeQuery: 'Découvertes scientifiques et technologie',
            homeTitle: 'Thèmes Principaux',
            homeDesc: 'Encyclopédie moderne et gratuite. Choisissez une catégorie ou lancez une recherche.',
            searchTitle: 'Résultats de recherche',
            searchDesc: 'Résultats pour: «{query}»',
            searchEmpty: 'Aucun article trouvé pour cette recherche.',
            searchPlaceholder: 'Rechercher sur Wikipédia (Ctrl+K)...',
            savedTitle: 'Signets',
            savedDesc: 'Articles sauvegardés pour lecture hors-ligne ou ultérieure.',
            savedEmptyTitle: 'Aucun signet',
            savedEmptyDesc: 'Cliquez sur «Enregistrer» dans un article pour le lire hors-ligne.',
            clearSaved: 'Effacer les signets',
            clearSavedConfirm: 'Supprimer tous les signets?',
            savedToast: 'Article sauvegardé dans les signets',
            removedToast: 'Article retiré des signets',
            historyTitle: 'Historique',
            historyDesc: 'Articles consultés récemment.',
            historyEmptyTitle: 'Historique vide',
            historyEmptyDesc: 'Les articles consultés s\'afficheront ici automatiquement.',
            clearHistory: 'Effacer l\'historique',
            clearHistoryConfirm: 'Effacer tout l\'historique?',
            readAgain: 'Relire l\'article &rarr;',
            readArticle: 'Lire l\'article &rarr;',
            ttsPlay: 'Écouter l\'article',
            ttsPause: 'Pause',
            ttsResume: 'Reprendre',
            ttsStop: 'Arrêter',
            ttsSpeaking: 'Lecture de l\'article en cours...',
            ttsPaused: 'Lecture suspendue',
            ttsDefault: 'Version audio (Text-to-Speech)',
            articleNotFoundTitle: 'Article non trouvé',
            articleNotFoundDesc: 'Cette page n\'existe pas dans la section Wikipédia sélectionnée.',
            netErrorTitle: 'Erreur réseau',
            netErrorDesc: 'Impossible de joindre l\'API Wikipédia.',
            retryBtn: 'Réessayer',
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
    // STORAGE HELPERS
    // =========================================================================
    function safeStorageGet(key, fallback) {
        try {
            const val = localStorage.getItem(key);
            return val ? JSON.parse(val) : fallback;
        } catch (e) {
            console.warn('Storage parsing error for', key, e);
            return fallback;
        }
    }

    // =========================================================================
    // STATE & CONFIGURATION
    // =========================================================================
    const STATE = {
        lang: localStorage.getItem('zeta_wiki_lang') || 'ru',
        theme: localStorage.getItem('zeta_wiki_theme') || 'dark',
        bookmarks: safeStorageGet('zeta_wiki_bookmarks', []),
        history: safeStorageGet('zeta_wiki_history', []),
        readerSettings: safeStorageGet('zeta_wiki_reader_settings', { fontSize: 17, fontFamily: 'sans', width: 'normal' }),
        activeAbortController: null,
        currentArticleData: null,
        currentLangLinks: {},
        cache: new Map(),
        searchDebounceTimer: null,
        selectedSuggestionIndex: -1,
        suggestions: [],
        currentRouteId: 0,
        currentTOCObserver: null,
        tts: {
            synth: window.speechSynthesis,
            utterance: null,
            sentences: [],
            currentSentenceIndex: 0,
            isPlaying: false,
            isPaused: false,
            rate: parseFloat(localStorage.getItem('zeta_wiki_tts_rate') || '1.0'),
            selectedVoiceURI: localStorage.getItem('zeta_wiki_tts_voice') || '',
            availableVoices: []
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
        suggestionsHeader: document.getElementById('suggestions-header'),
        sidebar: document.getElementById('sidebar'),
        sidebarOverlay: document.getElementById('sidebar-overlay'),
        mobileBtn: document.getElementById('mobile-menu-btn'),
        sidebarCloseBtn: document.getElementById('sidebar-close-btn'),
        navLinks: document.querySelectorAll('.nav-link'),
        langSelect: document.getElementById('lang-select'),
        themeToggleBtn: document.getElementById('theme-toggle-btn'),
        metaThemeColor: document.getElementById('meta-theme-color'),
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
        offlineBanner: document.getElementById('offline-banner'),
        labelNavSections: document.getElementById('label-nav-sections'),
        labelNavCategories: document.getElementById('label-nav-categories'),
        navTextHome: document.getElementById('nav-text-home'),
        navTextSaved: document.getElementById('nav-text-saved'),
        navTextHistory: document.getElementById('nav-text-history'),
        navTextRandom: document.getElementById('nav-text-random')
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
                const rawAttrVal = attr.value;
                const cleanVal = rawAttrVal.trim().toLowerCase().replace(/[\x00-\x20]/g, '');

                if (!ALLOWED_ATTRS.has(attrName) || attrName.startsWith('on')) {
                    el.removeAttribute(attr.name);
                    continue;
                }

                // Strict URI checking for href & src
                if (attrName === 'href') {
                    const isSafeHref = cleanVal.startsWith('http://') ||
                        cleanVal.startsWith('https://') ||
                        cleanVal.startsWith('#') ||
                        cleanVal.startsWith('/wiki/') ||
                        cleanVal.startsWith('./') ||
                        cleanVal.startsWith('mailto:');

                    if (!isSafeHref || cleanVal.startsWith('javascript:') || cleanVal.startsWith('vbscript:') || cleanVal.startsWith('data:')) {
                        el.removeAttribute(attr.name);
                    }
                } else if (attrName === 'src') {
                    const isSafeSrc = cleanVal.startsWith('http://') ||
                        cleanVal.startsWith('https://') ||
                        cleanVal.startsWith('data:image/png') ||
                        cleanVal.startsWith('data:image/jpeg') ||
                        cleanVal.startsWith('data:image/webp') ||
                        cleanVal.startsWith('data:image/gif');

                    if (!isSafeSrc) {
                        el.removeAttribute(attr.name);
                    }
                }
            }

            // Convert Wikipedia internal links to app hash links
            if (tag === 'a') {
                const href = el.getAttribute('href');
                if (href) {
                    if (href.startsWith('/wiki/') || href.startsWith('./')) {
                        let rawTitle = href.replace(/^(\/wiki\/|\.\/)/, '');
                        // Strip section hash if present to avoid 404 in Wikipedia API
                        const hashIdx = rawTitle.indexOf('#');
                        if (hashIdx !== -1) {
                            rawTitle = rawTitle.slice(0, hashIdx);
                        }
                        try {
                            rawTitle = decodeURIComponent(rawTitle);
                        } catch (e) {
                            // Safe fallback on invalid URI encoding
                        }
                        if (!rawTitle.startsWith('File:') && !rawTitle.startsWith('Файл:')) {
                            el.setAttribute('href', `#article/${encodeURIComponent(rawTitle)}`);
                        } else {
                            el.removeAttribute('href');
                        }
                    } else if (href.startsWith('#')) {
                        // Mark internal section/citation anchor to prevent SPA 404
                        el.classList.add('citation-anchor');
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
    // API CLIENT (With Dynamic Language, Langlinks, AbortController & Redirects)
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
        const url = `${getApiBaseUrl()}&action=query&generator=search&gsrsearch=${encodeURIComponent(query)}&gsrlimit=${limit}&prop=pageimages|extracts&exchars=180&exintro=1&explaintext=1&piprop=thumbnail&pithumbsize=400`;
        const data = await cachedFetch(url);
        if (!data || !data.query || !data.query.pages) return [];

        const pages = Object.values(data.query.pages).sort((a, b) => (a.index || 0) - (b.index || 0));
        return pages.map(p => ({
            title: p.title,
            snippet: p.extract || "",
            thumbnail: p.thumbnail ? p.thumbnail.source : null
        }));
    }

    async function fetchWikiArticle(title) {
        // Check if article was saved offline in bookmarks
        const offlineSaved = STATE.bookmarks.find(b => b.title.toLowerCase() === title.toLowerCase() && b.extract);

        try {
            // prop=extracts|pageimages|langlinks with redirects=1 to resolve redirects like США -> Соединённые Штаты
            const url = `${getApiBaseUrl()}&action=query&prop=extracts|pageimages|langlinks&titles=${encodeURIComponent(title)}&redirects=1&piprop=original&lllimit=50`;
            const data = await cachedFetch(url);
            if (!data || !data.query || !data.query.pages) {
                if (offlineSaved) {
                    return { ...offlineSaved, isOfflineSaved: true };
                }
                return null;
            }

            const pageId = Object.keys(data.query.pages)[0];
            const pageData = data.query.pages[pageId];

            // Parse language links for cross-language switcher
            STATE.currentLangLinks = {};
            if (pageData && pageData.langlinks) {
                pageData.langlinks.forEach(ll => {
                    STATE.currentLangLinks[ll.lang] = ll['*'];
                });
            }

            return pageData || null;
        } catch (e) {
            if (offlineSaved) {
                return { ...offlineSaved, isOfflineSaved: true };
            }
            throw e;
        }
    }

    async function fetchRandomArticle() {
        try {
            // Bypass cache with timestamp nonce so random is always fresh
            const nonce = Date.now();
            const url = `${getApiBaseUrl()}&action=query&generator=random&grnnamespace=0&grnlimit=1&prop=info&_t=${nonce}`;
            const res = await fetch(url);
            if (!res.ok) return null;
            const data = await res.json();
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
        const loc = getLocale();
        const index = STATE.bookmarks.findIndex(b => b.title.toLowerCase() === article.title.toLowerCase());
        if (index > -1) {
            STATE.bookmarks.splice(index, 1);
            showToast(loc.removedToast, '🗑️');
        } else {
            // Save full extract for true offline accessibility
            STATE.bookmarks.unshift({
                title: article.title,
                snippet: article.snippet || '',
                extract: article.extract || '',
                thumbnail: article.thumbnail || null,
                addedAt: Date.now()
            });
            showToast(loc.savedToast, '⭐');
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

    function removeBookmarkItem(title, e) {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }
        const loc = getLocale();
        STATE.bookmarks = STATE.bookmarks.filter(b => b.title.toLowerCase() !== title.toLowerCase());
        localStorage.setItem('zeta_wiki_bookmarks', JSON.stringify(STATE.bookmarks));
        updateBadges();
        showToast(loc.removedToast, '🗑️');
        if (window.location.hash === '#saved') {
            renderSavedArticlesView();
        }
    }

    function removeHistoryItem(title, e) {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }
        STATE.history = STATE.history.filter(h => h.title.toLowerCase() !== title.toLowerCase());
        localStorage.setItem('zeta_wiki_history', JSON.stringify(STATE.history));
        updateBadges();
        showToast('Удалено из истории', '🗑️');
        if (window.location.hash === '#history') {
            renderHistoryView();
        }
    }

    function recordReadingHistory(article) {
        if (!article || !article.title) return;
        STATE.history = STATE.history.filter(h => h.title.toLowerCase() !== article.title.toLowerCase());
        STATE.history.unshift({
            title: article.title,
            snippet: article.snippet || '',
            thumbnail: article.thumbnail || null,
            viewedAt: Date.now()
        });
        if (STATE.history.length > 30) STATE.history.pop();
        localStorage.setItem('zeta_wiki_history', JSON.stringify(STATE.history));
        updateBadges();
    }

    // =========================================================================
    // TEXT-TO-SPEECH (TTS) AUDIO NARRATOR ENGINE
    // =========================================================================

    function prepareSpeechSentences(htmlText) {
        if (!htmlText) return [];

        let text = htmlText;

        // 1. Remove references, footnotes, sup/sub, small, styles
        text = text.replace(/<sup\b[^>]*>[\s\S]*?<\/sup>/gi, ' ');
        text = text.replace(/<small\b[^>]*>[\s\S]*?<\/small>/gi, ' ');
        text = text.replace(/<sub\b[^>]*>[\s\S]*?<\/sub>/gi, ' ');
        text = text.replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, ' ');
        text = text.replace(/<[^>]*>/g, ' ');

        // 2. Decode entities
        text = text.replace(/&nbsp;/g, ' ')
                   .replace(/&#160;/g, ' ')
                   .replace(/&amp;/g, 'и')
                   .replace(/&quot;/g, '"')
                   .replace(/&#39;/g, "'")
                   .replace(/&[a-z0-9#]+;/gi, ' ');

        // 3. Remove citations in brackets [1], [2], [источник не указан], [править]
        text = text.replace(/\[[^\]]*\]/g, ' ');

        // 4. Remove IPA phonetic slashes e.g. /ˈdʒɑːvəskrɪpt/ or /dʒeɪ.ɛs/
        text = text.replace(/\/[^\/\n]{2,50}\//g, ' ');

        // 5. Remove parenthetical foreign phonetic & language notes: (англ. ...), (нем. ...), (фр. ...), etc.
        text = text.replace(/\(\s*(?:англ\.|нем\.|фр\.|лат\.|исп\.|греч\.|итал\.|швед\.|араб\.|яп\.|кит\.|узб\.|мфа:?)[^)]*\)/gi, ' ');

        // 6. Clean birth/death dates in parentheses e.g. (14 марта 1879 — 18 апреля 1955)
        text = text.replace(/\(\s*([0-9]{1,2}\s+[а-яёa-z]+\s+[0-9]{4})\s*[—–-]\s*([0-9]{1,2}\s+[а-яёa-z]+\s+[0-9]{4})[^\)]*\)/gi, ', жил с $1 по $2, ');
        text = text.replace(/\(\s*род\.?\s*([^,)]+)(?:,\s*ум\.?\s*([^)]+))?\)/gi, ', родился $1, ');

        // 7. Expand abbreviations into natural spoken language
        const abbrevs = [
            [/\b([0-9]{3,4})\s*гг?\./gi, '$1 года'],
            [/\b([0-9]+)\s*вв?\./gi, '$1 века'],
            [/\bг\.\s*(?=[0-9])/gi, 'году '],
            [/\bт\.\s*е\./gi, 'то есть'],
            [/\bт\.\s*к\./gi, 'так как'],
            [/\bт\.\s*д\./gi, 'так далее'],
            [/\bт\.\s*п\./gi, 'тому подобное'],
            [/\bи\s*др\./gi, 'и другие'],
            [/\bаббр\.\s*/gi, 'сокращённо '],
            [/\bнапр\./gi, 'например'],
            [/\bмлн\b/gi, 'миллионов'],
            [/\bмлрд\b/gi, 'миллиардов'],
            [/\bтыс\.\b/gi, 'тысяч'],
            [/\bкм\b/gi, 'километров'],
            [/\bсм\b/gi, 'сантиметров'],
            [/\bмм\b/gi, 'миллиметров'],
            [/\bкг\b/gi, 'килограммов'],
            [/\bруб\./gi, 'рублей']
        ];
        abbrevs.forEach(([pat, rep]) => { text = text.replace(pat, rep); });

        // 8. Clean up symbols, brackets, dashes
        text = text.replace(/[—–]/g, ' — ');
        text = text.replace(/[\(\)\[\]\{\}\<\>\|\\_#\*\^~]/g, ' ');
        text = text.replace(/\s*;\s*/g, ', ');
        text = text.replace(/,\s*,/g, ',');
        text = text.replace(/\s+/g, ' ').trim();

        // 9. Split into clean, natural sentences
        const rawSentences = text.match(/[^.!?]+[.!?]+(?:\s|$)|[^.!?]+$/g) || [text];
        return rawSentences
            .map(s => s.replace(/^[\s,;—–-]+/, '').trim())
            .filter(s => s.length > 6 && /[a-zа-яё0-9]/i.test(s));
    }

    function formatVoiceInfo(voice) {
        const raw = (voice && voice.name) || '';
        const lower = raw.toLowerCase();
        let name = raw
            .replace(/Microsoft\s*/gi, '')
            .replace(/Desktop\s*/gi, '')
            .replace(/Online\s*\(Natural\)\s*/gi, '')
            .replace(/Natural\s*/gi, '')
            .replace(/\(.*?\)/g, '')
            .replace(/-\s*Russian/gi, '')
            .replace(/-\s*English/gi, '')
            .replace(/русский/gi, '')
            .trim();

        let icon = '🎙️';

        if (lower.includes('google')) {
            icon = '🌐';
            name = 'Google';
        } else if (lower.includes('irina') || lower.includes('ирина')) {
            icon = '👩';
            name = 'Ирина';
        } else if (lower.includes('pavel') || lower.includes('павел')) {
            icon = '👨';
            name = 'Павел';
        } else if (lower.includes('dariya') || lower.includes('дарья')) {
            icon = '👩';
            name = 'Дарья';
        } else if (lower.includes('svetlana') || lower.includes('светлана')) {
            icon = '👩';
            name = 'Светлана';
        } else if (lower.includes('dmitry') || lower.includes('дмитрий')) {
            icon = '👨';
            name = 'Дмитрий';
        } else if (lower.includes('yuri') || lower.includes('юрий')) {
            icon = '👨';
            name = 'Юрий';
        } else if (/female|zira|susan|hazel|jenny|elena|victoria|anna|tatyana/i.test(lower)) {
            icon = '👩';
        } else if (/male|david|george|guy|aleksandr|artem/i.test(lower)) {
            icon = '👨';
        }

        if (!name || name.length === 0) {
            name = raw.split(' ')[0] || 'Голос';
        }

        return { icon, name, raw };
    }

    function loadAvailableVoices() {
        if (!STATE.tts.synth) return [];
        const allVoices = STATE.tts.synth.getVoices() || [];
        const langCode = STATE.lang.toLowerCase();

        let matched = allVoices.filter(v => v.lang.toLowerCase().startsWith(langCode));
        if (matched.length === 0) {
            matched = allVoices;
        }

        // Prioritize natural / neural / online voices over legacy robotic synthesizers
        matched.sort((a, b) => {
            const isNaturalA = /natural|online|google|neural|apple/i.test(a.name);
            const isNaturalB = /natural|online|google|neural|apple/i.test(b.name);
            return (isNaturalB ? 1 : 0) - (isNaturalA ? 1 : 0);
        });

        STATE.tts.availableVoices = matched;
        return matched;
    }

    function renderVoiceSelectorUI() {
        const container = document.getElementById('tts-voice-container');
        if (!container) return;

        const voices = loadAvailableVoices();
        if (voices.length === 0) {
            container.innerHTML = '<span style="font-size: 0.78rem; color: var(--text-muted); padding: 4px 8px;">Системный голос</span>';
            return;
        }

        if (!STATE.tts.selectedVoiceURI || !voices.some(v => v.voiceURI === STATE.tts.selectedVoiceURI)) {
            STATE.tts.selectedVoiceURI = voices[0].voiceURI;
            localStorage.setItem('zeta_wiki_tts_voice', STATE.tts.selectedVoiceURI);
        }

        if (voices.length <= 4) {
            let html = '<div class="tts-voice-group" role="group" aria-label="Выбор голоса">';
            voices.forEach(v => {
                const info = formatVoiceInfo(v);
                const isActive = v.voiceURI === STATE.tts.selectedVoiceURI;
                html += `
                    <button type="button" class="tts-voice-pill ${isActive ? 'active' : ''}" 
                            data-voice-uri="${escapeHTML(v.voiceURI)}" 
                            title="${escapeHTML(v.name)}">
                        <span class="voice-icon">${info.icon}</span>
                        <span class="voice-label">${escapeHTML(info.name)}</span>
                    </button>
                `;
            });
            html += '</div>';
            container.innerHTML = html;

            container.querySelectorAll('.tts-voice-pill').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.preventDefault();
                    const uri = btn.getAttribute('data-voice-uri');
                    if (uri && uri !== STATE.tts.selectedVoiceURI) {
                        setTTSVoice(uri);
                    }
                });
            });
        } else {
            let html = '<select id="tts-voice-select" class="tts-voice-select" title="Выбор голоса" aria-label="Голос озвучки">';
            voices.forEach(v => {
                const info = formatVoiceInfo(v);
                const isSelected = v.voiceURI === STATE.tts.selectedVoiceURI ? 'selected' : '';
                html += `<option value="${escapeHTML(v.voiceURI)}" ${isSelected}>${info.icon} ${escapeHTML(info.name)}</option>`;
            });
            html += '</select>';
            container.innerHTML = html;

            const select = document.getElementById('tts-voice-select');
            select?.addEventListener('change', (e) => {
                setTTSVoice(e.target.value);
            });
        }
    }

    function updateVoiceSelectorUI() {
        document.querySelectorAll('.tts-voice-pill').forEach(pill => {
            pill.classList.toggle('active', pill.getAttribute('data-voice-uri') === STATE.tts.selectedVoiceURI);
        });
        const select = document.getElementById('tts-voice-select');
        if (select && select.value !== STATE.tts.selectedVoiceURI) {
            select.value = STATE.tts.selectedVoiceURI;
        }
    }

    function restartCurrentSentence() {
        if (!STATE.tts.sentences || STATE.tts.sentences.length === 0) return;

        if (STATE.tts.currentSentenceIndex < 0) STATE.tts.currentSentenceIndex = 0;
        if (STATE.tts.currentSentenceIndex >= STATE.tts.sentences.length) {
            STATE.tts.currentSentenceIndex = 0;
        }

        if (STATE.tts.isPlaying && !STATE.tts.isPaused) {
            playSentence(STATE.tts.currentSentenceIndex);
        } else {
            if (STATE.tts.utterance) {
                STATE.tts.utterance.onend = null;
                STATE.tts.utterance.onerror = null;
            }
            if (STATE.tts.synth) {
                STATE.tts.synth.cancel();
            }
            updateTTSPlayerUI();
        }
    }

    function setTTSVoice(voiceURI) {
        if (!voiceURI) return;
        STATE.tts.selectedVoiceURI = voiceURI;
        localStorage.setItem('zeta_wiki_tts_voice', voiceURI);
        updateVoiceSelectorUI();
        restartCurrentSentence();
    }

    function setTTSSpeed(rate) {
        STATE.tts.rate = rate;
        localStorage.setItem('zeta_wiki_tts_rate', String(rate));
        document.querySelectorAll('.tts-speed-btn').forEach(btn => {
            btn.classList.toggle('active', parseFloat(btn.getAttribute('data-speed')) === rate);
        });
        restartCurrentSentence();
    }

    function stopTTS(resetIndex = false) {
        if (STATE.tts.utterance) {
            STATE.tts.utterance.onend = null;
            STATE.tts.utterance.onerror = null;
        }
        if (STATE.tts.synth) {
            STATE.tts.synth.cancel();
        }
        STATE.tts.isPlaying = false;
        STATE.tts.isPaused = false;
        if (resetIndex) {
            STATE.tts.currentSentenceIndex = 0;
        }
        updateTTSPlayerUI();
    }

    function playSentence(index) {
        if (!STATE.tts.synth) return;
        if (!STATE.tts.sentences || STATE.tts.sentences.length === 0) return;

        if (index < 0) index = 0;
        if (index >= STATE.tts.sentences.length) {
            stopTTS(true);
            showToast('Статья полностью прочитана', '🎧');
            return;
        }

        if (STATE.tts.utterance) {
            STATE.tts.utterance.onend = null;
            STATE.tts.utterance.onerror = null;
        }

        STATE.tts.currentSentenceIndex = index;
        STATE.tts.synth.cancel();

        const sentenceText = STATE.tts.sentences[index];
        const utterance = new SpeechSynthesisUtterance(sentenceText);
        STATE.tts.utterance = utterance;

        utterance.rate = STATE.tts.rate;
        utterance.pitch = 1.0;

        const voices = STATE.tts.availableVoices.length > 0 ? STATE.tts.availableVoices : loadAvailableVoices();
        const voice = voices.find(v => v.voiceURI === STATE.tts.selectedVoiceURI) || voices[0];
        if (voice) {
            utterance.voice = voice;
            utterance.lang = voice.lang;
        } else {
            const langMap = { ru: 'ru-RU', en: 'en-US', uz: 'uz-UZ', de: 'de-DE', es: 'es-ES', fr: 'fr-FR' };
            utterance.lang = langMap[STATE.lang] || 'ru-RU';
        }

        utterance.onend = () => {
            if (STATE.tts.isPlaying && !STATE.tts.isPaused) {
                playSentence(index + 1);
            }
        };

        utterance.onerror = (e) => {
            if (e.error !== 'canceled' && e.error !== 'interrupted') {
                console.warn('TTS playback error:', e);
                if (STATE.tts.isPlaying && !STATE.tts.isPaused) {
                    playSentence(index + 1);
                }
            }
        };

        STATE.tts.isPlaying = true;
        STATE.tts.isPaused = false;
        updateTTSPlayerUI();

        setTimeout(() => {
            if (STATE.tts.isPlaying && !STATE.tts.isPaused && STATE.tts.utterance === utterance) {
                STATE.tts.synth.speak(utterance);
            }
        }, 25);
    }

    function toggleTTS(rawHtmlOrText) {
        if (!STATE.tts.synth) {
            showToast('Синтез речи не поддерживается браузером', '⚠️');
            return;
        }

        if (STATE.tts.isPlaying && !STATE.tts.isPaused) {
            if (STATE.tts.utterance) {
                STATE.tts.utterance.onend = null;
                STATE.tts.utterance.onerror = null;
            }
            STATE.tts.synth.cancel();
            STATE.tts.isPlaying = false;
            STATE.tts.isPaused = true;
            updateTTSPlayerUI();
            return;
        }

        if (!STATE.tts.sentences || STATE.tts.sentences.length === 0) {
            const sentences = prepareSpeechSentences(rawHtmlOrText);
            if (sentences.length === 0) {
                showToast('В статье нет текста для воспроизведения', '⚠️');
                return;
            }
            STATE.tts.sentences = sentences;
            STATE.tts.currentSentenceIndex = 0;
        }

        if (STATE.tts.currentSentenceIndex >= STATE.tts.sentences.length) {
            STATE.tts.currentSentenceIndex = 0;
        }

        playSentence(STATE.tts.currentSentenceIndex);
    }

    function nextSentence() {
        if (!STATE.tts.sentences || !STATE.tts.sentences.length) return;
        if (STATE.tts.currentSentenceIndex < STATE.tts.sentences.length - 1) {
            const nextIdx = STATE.tts.currentSentenceIndex + 1;
            if (STATE.tts.isPlaying && !STATE.tts.isPaused) {
                playSentence(nextIdx);
            } else {
                STATE.tts.currentSentenceIndex = nextIdx;
                updateTTSPlayerUI();
            }
        }
    }

    function prevSentence() {
        if (!STATE.tts.sentences || !STATE.tts.sentences.length) return;
        if (STATE.tts.currentSentenceIndex > 0) {
            const prevIdx = STATE.tts.currentSentenceIndex - 1;
            if (STATE.tts.isPlaying && !STATE.tts.isPaused) {
                playSentence(prevIdx);
            } else {
                STATE.tts.currentSentenceIndex = prevIdx;
                updateTTSPlayerUI();
            }
        }
    }

    function updateTTSPlayerUI() {
        const player = document.getElementById('article-tts-player');
        const playBtn = document.getElementById('tts-play-btn');
        const statusText = document.getElementById('tts-status-text');
        const counterText = document.getElementById('tts-counter-text');
        const progressFill = document.getElementById('tts-progress-fill');
        const sentencePreview = document.getElementById('tts-sentence-preview');
        const prevBtn = document.getElementById('tts-prev-btn');
        const nextBtn = document.getElementById('tts-next-btn');

        if (!player || !playBtn) return;
        const loc = getLocale();
        const total = STATE.tts.sentences.length;
        const current = STATE.tts.currentSentenceIndex;

        if (STATE.tts.isPlaying && !STATE.tts.isPaused) {
            player.classList.add('tts-playing');
            playBtn.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg> <span id="tts-play-label">${loc.ttsPause}</span>`;
            if (statusText) statusText.textContent = loc.ttsSpeaking;
        } else if (STATE.tts.isPaused) {
            player.classList.remove('tts-playing');
            playBtn.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg> <span id="tts-play-label">${loc.ttsResume}</span>`;
            if (statusText) statusText.textContent = loc.ttsPaused;
        } else {
            player.classList.remove('tts-playing');
            playBtn.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg> <span id="tts-play-label">${loc.ttsPlay}</span>`;
            if (statusText) statusText.textContent = loc.ttsDefault;
        }

        // Progress bar and counter
        if (total > 0) {
            const isStarted = STATE.tts.isPlaying || STATE.tts.isPaused || current > 0;
            const pct = isStarted ? Math.min(100, Math.round(((current + 1) / total) * 100)) : 0;
            if (progressFill) progressFill.style.width = `${pct}%`;
            if (counterText) counterText.textContent = `${current + 1} / ${total} (${pct}%)`;
            if (sentencePreview && STATE.tts.sentences[current]) {
                sentencePreview.innerHTML = `<span>«${escapeHTML(STATE.tts.sentences[current])}»</span>`;
            }
        } else {
            if (progressFill) progressFill.style.width = '0%';
            if (counterText) counterText.textContent = '0 / 0';
            if (sentencePreview) sentencePreview.innerHTML = `<span>Нажмите «Слушать статью», чтобы начать естественное воспроизведение.</span>`;
        }

        const canNavigate = total > 0;
        if (prevBtn) prevBtn.disabled = !canNavigate || current <= 0;
        if (nextBtn) nextBtn.disabled = !canNavigate || current >= total - 1;
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

        // Full UI Translation
        const loc = getLocale();
        if (DOM.labelNavSections) DOM.labelNavSections.textContent = loc.navSections;
        if (DOM.labelNavCategories) DOM.labelNavCategories.textContent = loc.navCategories;
        if (DOM.navTextHome) DOM.navTextHome.textContent = loc.navHome;
        if (DOM.navTextSaved) DOM.navTextSaved.textContent = loc.navSaved;
        if (DOM.navTextHistory) DOM.navTextHistory.textContent = loc.navHistory;
        if (DOM.navTextRandom) DOM.navTextRandom.textContent = loc.navRandom;
        if (DOM.suggestionsHeader) DOM.suggestionsHeader.textContent = loc.suggestionsHeader;
        if (DOM.searchInput) DOM.searchInput.placeholder = loc.searchPlaceholder;

        document.querySelectorAll('.cat-label').forEach(label => {
            const catKey = label.getAttribute('data-cat');
            if (loc.categories[catKey]) {
                label.textContent = loc.categories[catKey].label;
            }
        });

        if (DOM.offlineBanner) {
            const span = DOM.offlineBanner.querySelector('span');
            if (span) span.textContent = loc.offlineBanner;
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
                    <a href="#home" class="btn-primary">${loc.navHome}</a>
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
                            <span>${loc.readArticle}</span>
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
                ${items.length > 0 ? `<button id="btn-clear-bookmarks" class="article-tool-btn">${loc.clearSaved}</button>` : ''}
            </div>
        `;

        if (items.length === 0) {
            html += `
                <div class="error-state-card">
                    <div class="error-icon">⭐</div>
                    <div class="error-title">${loc.savedEmptyTitle}</div>
                    <div class="error-desc">${loc.savedEmptyDesc}</div>
                    <a href="#home" class="btn-primary">${loc.navHome}</a>
                </div>
            `;
        } else {
            html += `<div class="grid-cards">`;
            items.forEach((item, idx) => {
                const safeTitle = escapeHTML(item.title);
                const safeSnippet = escapeHTML(item.snippet || 'Статья сохранена.');
                const imgMarkup = item.thumbnail
                    ? `<img src="${escapeHTML(item.thumbnail)}" class="wiki-card-img" alt="${safeTitle}" loading="lazy">`
                    : `<div class="wiki-card-placeholder-img">${safeTitle.charAt(0)}</div>`;

                html += `
                    <div class="wiki-card-wrapper" style="position: relative;">
                        <a href="#article/${encodeURIComponent(item.title)}" class="wiki-card">
                            <button type="button" class="card-remove-btn" data-remove-bookmark="${encodeURIComponent(item.title)}" title="Удалить из закладок" aria-label="Удалить">✕</button>
                            <div class="wiki-card-img-wrapper">
                                ${imgMarkup}
                            </div>
                            <h2 class="wiki-card-title">${safeTitle}</h2>
                            <p class="wiki-card-snippet">${safeSnippet}</p>
                            <div class="wiki-card-footer">
                                <span>${loc.readArticle}</span>
                            </div>
                        </a>
                    </div>
                `;
            });
            html += `</div>`;
        }

        DOM.appContent.innerHTML = html;
        document.title = `${loc.savedTitle} (${items.length}) — ZETA Wiki`;

        // Clear all bookmarks
        document.getElementById('btn-clear-bookmarks')?.addEventListener('click', () => {
            if (confirm(loc.clearSavedConfirm)) {
                STATE.bookmarks = [];
                localStorage.setItem('zeta_wiki_bookmarks', '[]');
                updateBadges();
                renderSavedArticlesView();
                showToast(loc.removedToast, '🗑️');
            }
        });

        // Individual remove buttons
        DOM.appContent.querySelectorAll('[data-remove-bookmark]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const title = decodeURIComponent(btn.getAttribute('data-remove-bookmark'));
                removeBookmarkItem(title, e);
            });
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
                ${items.length > 0 ? `<button id="btn-clear-history" class="article-tool-btn">${loc.clearHistory}</button>` : ''}
            </div>
        `;

        if (items.length === 0) {
            html += `
                <div class="error-state-card">
                    <div class="error-icon">🕒</div>
                    <div class="error-title">${loc.historyEmptyTitle}</div>
                    <div class="error-desc">${loc.historyEmptyDesc}</div>
                    <a href="#home" class="btn-primary">${loc.navHome}</a>
                </div>
            `;
        } else {
            html += `<div class="grid-cards">`;
            items.forEach((item, idx) => {
                const safeTitle = escapeHTML(item.title);
                const safeSnippet = escapeHTML(item.snippet || 'Статья была прочитана.');
                const timeStr = item.viewedAt ? new Date(item.viewedAt).toLocaleDateString() : '';
                const imgMarkup = item.thumbnail
                    ? `<img src="${escapeHTML(item.thumbnail)}" class="wiki-card-img" alt="${safeTitle}" loading="lazy">`
                    : `<div class="wiki-card-placeholder-img">${safeTitle.charAt(0)}</div>`;

                html += `
                    <div class="wiki-card-wrapper" style="position: relative;">
                        <a href="#article/${encodeURIComponent(item.title)}" class="wiki-card">
                            <button type="button" class="card-remove-btn" data-remove-history="${encodeURIComponent(item.title)}" title="Удалить из истории" aria-label="Удалить">✕</button>
                            <div class="wiki-card-img-wrapper">
                                ${imgMarkup}
                            </div>
                            <h2 class="wiki-card-title">${safeTitle}</h2>
                            <p class="wiki-card-snippet">${safeSnippet}</p>
                            <div class="wiki-card-footer">
                                <span>${loc.readAgain}</span>
                                <small style="color: var(--text-muted);">${timeStr}</small>
                            </div>
                        </a>
                    </div>
                `;
            });
            html += `</div>`;
        }

        DOM.appContent.innerHTML = html;
        document.title = `${loc.historyTitle} — ZETA Wiki`;

        // Clear all history
        document.getElementById('btn-clear-history')?.addEventListener('click', () => {
            if (confirm(loc.clearHistoryConfirm)) {
                STATE.history = [];
                localStorage.setItem('zeta_wiki_history', '[]');
                updateBadges();
                renderHistoryView();
                showToast('История просмотров очищена', '🗑️');
            }
        });

        // Individual remove buttons
        DOM.appContent.querySelectorAll('[data-remove-history]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const title = decodeURIComponent(btn.getAttribute('data-remove-history'));
                removeHistoryItem(title, e);
            });
        });
    }

    function renderArticleView(pageData) {
        stopTTS(true);
        const loc = getLocale();

        if (!pageData || pageData.missing !== undefined) {
            DOM.appContent.innerHTML = `
                <div class="error-state-card">
                    <div class="error-icon">⚠️</div>
                    <div class="error-title">${loc.articleNotFoundTitle}</div>
                    <div class="error-desc">${loc.articleNotFoundDesc}</div>
                    <a href="#home" class="btn-primary">${loc.navHome}</a>
                </div>
            `;
            document.title = `${loc.articleNotFoundTitle} — ZETA Wiki`;
            return;
        }

        const safeTitle = escapeHTML(pageData.title);
        const cleanHTML = sanitizeArticleHTML(pageData.extract || '');
        const originalImageUrl = pageData.original ? pageData.original.source : (pageData.thumbnail || null);
        const bookmarked = isBookmarked(pageData.title);

        const textOnly = (pageData.extract || '').replace(/<[^>]*>/g, ' ');
        const wordCount = textOnly.trim().split(/\s+/).filter(Boolean).length;
        const readMinutes = Math.max(1, Math.ceil(wordCount / 180));
        const wikiSourceUrl = `https://${STATE.lang}.wikipedia.org/wiki/${encodeURIComponent(pageData.title)}`;

        let html = `
            <div class="article-view-layout">
                <article class="article-main-column">
                    <header class="article-header">
                        ${pageData.isOfflineSaved ? `<div class="offline-badge-pill" style="display: inline-flex; align-items: center; gap: 6px; padding: 4px 12px; background: rgba(245, 158, 11, 0.15); color: #F59E0B; border: 1px solid rgba(245, 158, 11, 0.3); border-radius: 999px; font-size: 0.8rem; font-weight: 600; margin-bottom: 12px;">💾 ${loc.offlineBadge}</div>` : ''}
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

                        <!-- Modernized Audio TTS Narrator Widget -->
                        <div class="article-tts-player" id="article-tts-player">
                            <div class="tts-header-row">
                                <div class="tts-controls-main">
                                    <button id="tts-play-btn" class="tts-btn" title="Воспроизвести / Пауза">
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                                        <span id="tts-play-label">${loc.ttsPlay}</span>
                                    </button>
                                    <button id="tts-prev-btn" class="tts-ctrl-icon-btn" title="Предыдущее предложение" aria-label="Предыдущее предложение">
                                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="19 20 9 12 19 4 19 20"></polygon><line x1="5" y1="19" x2="5" y2="5"></line></svg>
                                    </button>
                                    <button id="tts-next-btn" class="tts-ctrl-icon-btn" title="Следующее предложение" aria-label="Следующее предложение">
                                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="5 4 15 12 5 20 5 4"></polygon><line x1="19" y1="5" x2="19" y2="19"></line></svg>
                                    </button>
                                    <button id="tts-stop-btn" class="tts-ctrl-icon-btn btn-stop" title="Остановить" aria-label="Остановить">
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><rect x="5" y="5" width="14" height="14" rx="2"></rect></svg>
                                    </button>

                                    <div class="tts-audio-waves">
                                        <div class="audio-bar"></div>
                                        <div class="audio-bar"></div>
                                        <div class="audio-bar"></div>
                                        <div class="audio-bar"></div>
                                        <div class="audio-bar"></div>
                                        <div class="audio-bar"></div>
                                    </div>
                                </div>

                                <div class="tts-meta-controls">
                                    <div id="tts-voice-container" class="tts-voice-container"></div>

                                    <div class="tts-speed-group" title="Скорость воспроизведения">
                                        <button class="tts-speed-btn ${STATE.tts.rate === 0.8 ? 'active' : ''}" data-speed="0.8">0.8x</button>
                                        <button class="tts-speed-btn ${STATE.tts.rate === 1.0 ? 'active' : ''}" data-speed="1.0">1.0x</button>
                                        <button class="tts-speed-btn ${STATE.tts.rate === 1.2 ? 'active' : ''}" data-speed="1.2">1.2x</button>
                                        <button class="tts-speed-btn ${STATE.tts.rate === 1.5 ? 'active' : ''}" data-speed="1.5">1.5x</button>
                                    </div>
                                </div>
                            </div>

                            <div class="tts-progress-wrap">
                                <div class="tts-progress-meta">
                                    <span id="tts-status-text">${loc.ttsDefault}</span>
                                    <span id="tts-counter-text">0 / 0</span>
                                </div>
                                <div class="tts-progress-bar-bg">
                                    <div id="tts-progress-fill" class="tts-progress-bar-fill"></div>
                                </div>
                            </div>

                            <div id="tts-sentence-preview" class="tts-sentence-preview">
                                <span>Нажмите «Слушать статью», чтобы начать естественное воспроизведение.</span>
                            </div>
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

        // Cache and Record History with extract for offline capability
        STATE.currentArticleData = {
            title: pageData.title,
            snippet: textOnly.slice(0, 150),
            extract: pageData.extract || '',
            thumbnail: originalImageUrl
        };
        recordReadingHistory(STATE.currentArticleData);

        // Attach Toolbar Listeners
        document.getElementById('btn-bookmark-action')?.addEventListener('click', () => {
            if (STATE.currentArticleData) toggleBookmark(STATE.currentArticleData);
        });

        document.getElementById('btn-share-action')?.addEventListener('click', () => {
            if (navigator.share) {
                navigator.share({
                    title: pageData.title,
                    text: pageData.title + ' — ZETA Wiki',
                    url: window.location.href
                }).catch(() => { });
            } else {
                navigator.clipboard.writeText(window.location.href).then(() => {
                    showToast('Ссылка скопирована в буфер обмена', '🔗');
                }).catch(() => {
                    showToast('Не удалось скопировать', '❌');
                });
            }
        });

        // TTS Audio Listeners
        document.getElementById('tts-play-btn')?.addEventListener('click', () => {
            toggleTTS(pageData.extract || '');
        });

        document.getElementById('tts-stop-btn')?.addEventListener('click', () => {
            stopTTS(true);
        });

        document.getElementById('tts-prev-btn')?.addEventListener('click', () => {
            prevSentence();
        });

        document.getElementById('tts-next-btn')?.addEventListener('click', () => {
            nextSentence();
        });

        document.querySelectorAll('.tts-speed-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const speed = parseFloat(btn.getAttribute('data-speed'));
                if (!isNaN(speed)) setTTSSpeed(speed);
            });
        });

        // Pre-parse speech sentences so counter and preview are ready immediately
        STATE.tts.sentences = prepareSpeechSentences(pageData.extract || '');
        STATE.tts.currentSentenceIndex = 0;
        updateTTSPlayerUI();

        // Initialize voice selector UI (Pills for Google / Irina / Pavel)
        renderVoiceSelectorUI();

        // Intercept internal in-page anchors & citations to prevent SPA 404
        const articleBody = document.getElementById('article-body');
        articleBody?.addEventListener('click', (e) => {
            const link = e.target.closest('a[href^="#"]');
            if (link) {
                const targetId = link.getAttribute('href').slice(1);
                e.preventDefault();
                if (targetId) {
                    const targetEl = document.getElementById(targetId) || document.querySelector(`[name="${CSS.escape(targetId)}"]`);
                    if (targetEl) {
                        targetEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }
                }
            }
        });

        // Enhance Code Blocks & Generate TOC
        enhanceCodeBlocks();
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
                }).catch(() => {
                    showToast('Не удалось скопировать текст', '❌');
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

        // Disconnect previous IntersectionObserver
        if (STATE.currentTOCObserver) {
            STATE.currentTOCObserver.disconnect();
            STATE.currentTOCObserver = null;
        }

        const rawHeadings = Array.from(articleBody.querySelectorAll('h2, h3'));
        const headings = rawHeadings.filter(h => h.textContent.trim().length > 0);

        if (headings.length < 2) {
            tocColumn.style.display = 'none';
            if (mobileTocAccordion) mobileTocAccordion.style.display = 'none';
            return;
        }

        headings.forEach((heading, index) => {
            const headingId = heading.id || `sec-${index}`;
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
                heading.scrollIntoView({ behavior: 'smooth', block: 'start' });
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
                    if (mobileTocAccordion) mobileTocAccordion.removeAttribute('open');
                    heading.scrollIntoView({ behavior: 'smooth', block: 'start' });
                });
                mLi.appendChild(mA);
                mobileTocList.appendChild(mLi);
            }
        });

        // Track active heading
        STATE.currentTOCObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.id;
                    tocList.querySelectorAll('.toc-item').forEach(item => {
                        item.classList.toggle('active', item.getAttribute('data-target') === id);
                    });
                }
            });
        }, { root: DOM.appContent, threshold: 0.2 });

        headings.forEach(h => STATE.currentTOCObserver.observe(h));
    }

    function renderDeveloperPortal() {
        stopTTS();
        DOM.appContent.innerHTML = `
            <div class="dev-portal-view">
                <!-- Hero Header -->
                <div class="dev-hero">
                    <div class="dev-avatar-lg">V</div>
                    <h1 class="dev-hero-title">VIGER Dev</h1>
                    <p class="dev-hero-subtitle">Темуршох Ахмадалиев &bull; Разработчик, создатель контента и исследователь технологий</p>
                    
                    <div class="dev-badges-row">
                        <span class="dev-pill">🎮 Gamer since 2 y.o.</span>
                        <span class="dev-pill">🎬 Монтаж & YouTube</span>
                        <span class="dev-pill">🛠️ 23 переустановки ОС</span>
                        <span class="dev-pill">🤖 AI & Codex</span>
                        <span class="dev-pill">🚀 Автор ZETA Wiki</span>
                    </div>

                    <div class="dev-quote-lead">
                        «Мой интерес к IT начался задолго до того, как я вообще понял, что такое программирование. Сначала это были игры, потом компьютер, интернет, Minecraft, YouTube, монтаж и только потом — программирование и создание собственных проектов. И во многом всё началось благодаря моему старшему брату.»
                    </div>
                </div>

                <!-- Timeline: С чего всё началось -->
                <div class="dev-timeline-wrapper">
                    <h2 class="dev-section-heading">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                        </svg>
                        Хроника пути VIGER Dev
                    </h2>

                    <div class="dev-timeline">
                        <div class="timeline-card">
                            <div class="timeline-dot"><div class="timeline-dot-inner"></div></div>
                            <div class="timeline-header">
                                <h3 class="timeline-title">Первый компьютер и «Узбекская GTA»</h3>
                                <span class="timeline-badge">2–4 года</span>
                            </div>
                            <div class="timeline-body">
                                <p>Когда мне было около <strong>2 лет</strong>, родители купили моему старшему брату ноутбук. Для того времени это был довольно мощный компьютер, и именно он стал моим первым настоящим знакомством с цифровым миром.</p>
                                <p>Примерно в <strong>4 года</strong> брат однажды пришёл из школы с диском, на котором были <strong>GTA III, GTA Vice City и GTA San Andreas</strong>. Сначала я просто смотрел, как он играет, а потом начал запускать игры сам, когда его не было дома.</p>
                                <div class="timeline-highlight-box">
                                    🚗 <strong>Забавная история:</strong> В GTA III я почему-то решил, что это практически «узбекская GTA». В игре было много машин, похожих на те, что ездили по нашим улицам: <em>Daewoo Nexia, Lacetti, Tico, Spark</em> и даже что-то вроде <em>Damas</em>. Брат сначала смеялся, а потом сам стал называть её «узбекской GTA».
                                </div>
                                <p>К 5 годам я обожал <strong>GTA Vice City</strong>. Читать по-английски я ещё почти не умел, но брат оставлял мне на листочках шпаргалки с чит-кодами, ориентируя по расположению клавиш. Он даже перебиндил чит на танк на одну кнопку — нажал клавишу, и с неба падает танк!</p>
                            </div>
                        </div>

                        <div class="timeline-card">
                            <div class="timeline-dot"><div class="timeline-dot-inner"></div></div>
                            <div class="timeline-header">
                                <h3 class="timeline-title">Самостоятельное освоение и Dendy</h3>
                                <span class="timeline-badge">6 лет</span>
                            </div>
                            <div class="timeline-body">
                                <p>К шести годам я уже свободно ориентировался на клавиатуре и учился разбирать английские буквы. Отец купил диск с играми: <strong>Plants vs. Zombies, Trials Evolution</strong> и бильярдом. За ними я проводил часы.</p>
                                <p>На компьютере стояла <strong>Windows 7</strong>, и постепенно меня начала завораживать сама операционная система: дизайн интерфейса, проводник, настройки, программы, установка софта. Параллельно я рубился в <strong>Dendy</strong>: <em>Battle City (Танчики), Donkey Kong</em> и старые 8-битные платформеры стали важной частью моего детства.</p>
                            </div>
                        </div>

                        <div class="timeline-card">
                            <div class="timeline-dot"><div class="timeline-dot-inner"></div></div>
                            <div class="timeline-header">
                                <h3 class="timeline-title">Интернет, переезд и открытие Minecraft</h3>
                                <span class="timeline-badge">7 лет</span>
                            </div>
                            <div class="timeline-body">
                                <p>Мы переехали в город, и дома появился настоящий <strong>Wi-Fi</strong>. Поначалу я не понимал, как работает интернет, но мгновенно освоился. Перекидывал файлы с телефона брата на ПК.</p>
                                <p>Именно тогда брат показал мне мобильный клон Minecraft, который мне совсем не зашел. Но затем он установил <strong>настоящий оригинальный Minecraft</strong> — и мир перевернулся. Я загорелся желанием играть в него на ПК.</p>
                            </div>
                        </div>

                        <div class="timeline-card">
                            <div class="timeline-dot"><div class="timeline-dot-inner"></div></div>
                            <div class="timeline-header">
                                <h3 class="timeline-title">Эпоха Alan Becker и первый YouTube-канал</h3>
                                <span class="timeline-badge">Творческий старт</span>
                            </div>
                            <div class="timeline-body">
                                <p>Установив Minecraft на ПК, я стал залипать на YouTube. Увидев легендарные анимации <strong>Alan Becker</strong> по Minecraft, в голове щёлкнуло: <em>«Я тоже хочу такое делать!»</em></p>
                                <p>Я нашел софт для анимации, стал экспериментировать и открыл свой YouTube-канал (на первых порах с монтажом помогал брат).</p>
                                <div class="timeline-highlight-box">
                                    ⚡ <strong>Monomarkaz и шейдеры:</strong> Брат устроился работать в Monomarkaz, где стояли мощные моноблоки на Ryzen 5. Он поднял свой сервер, и мы играли вместе. Когда он показал мне Minecraft с шейдерами, я впервые осознал мощь компьютерной графики. Появилось твёрдое желание: <strong>не просто играть, а создавать контент вокруг этого</strong>.
                                </div>
                            </div>
                        </div>

                        <div class="timeline-card">
                            <div class="timeline-dot"><div class="timeline-dot-inner"></div></div>
                            <div class="timeline-header">
                                <h3 class="timeline-title">От анимаций — к монтажу в 20 FPS</h3>
                                <span class="timeline-badge">Закалка навыка</span>
                            </div>
                            <div class="timeline-body">
                                <p>Я переключился на создание роликов по Minecraft. Мой старенький компьютер с трудом выдавал <strong>20 FPS</strong>, поэтому о лёгком процессе речи не шло. Но именно эта техническая сложность заставила меня досконально изучить <strong>видеомонтаж</strong>.</p>
                                <p>Монтировал на всём, что находил под рукой. Учился чувствовать динамику и темп, резать склейки, накладывать эффекты, придумывать интересную подачу и самостоятельно доводить идею до готового ролика. Монтаж стал моим вторым дыханием.</p>
                            </div>
                        </div>

                        <div class="timeline-card">
                            <div class="timeline-dot"><div class="timeline-dot-inner"></div></div>
                            <div class="timeline-header">
                                <h3 class="timeline-title">Программирование через старшего брата</h3>
                                <span class="timeline-badge">Первый код</span>
                            </div>
                            <div class="timeline-body">
                                <p>Мой старший брат сам увлёкся кодингом, изучая материалы на YouTube. Он стал делиться знаниями со мной, объяснять логику и алгоритмы. Так я написал свои первые строчки кода.</p>
                                <p>Я совмещал сразу четыре увлечения: <strong>игры, монтаж, YouTube и программирование</strong>. Даже когда позже фокус смещался, желание создавать собственные цифровые продукты уже никуда не исчезало.</p>
                            </div>
                        </div>

                        <div class="timeline-card">
                            <div class="timeline-dot"><div class="timeline-dot-inner"></div></div>
                            <div class="timeline-header">
                                <h3 class="timeline-title">Эксперимент с ОС: 23 переустановки</h3>
                                <span class="timeline-badge">Инженерный азарт</span>
                            </div>
                            <div class="timeline-body">
                                <p>Я увлёкся операционными системами настолько, что за один сезон переустановил систему около <strong>23 раз</strong>! На флешку по очереди записывались:</p>
                                <div class="timeline-highlight-box">
                                    💾 <em>Windows 7 32-bit &rarr; Windows 7 64-bit &rarr; кастомные сборки &rarr; Windows 10 &rarr; Windows 11 Pro &rarr; Ubuntu Linux</em>
                                </div>
                                <p>Был даже безумный эксперимент с модифицированной Windows 7, перерисованной под <strong>macOS</strong> (выглядело стильно, но дико тормозило). Этот период научил меня главному инженерному рефлексу: <strong>не бояться экспериментировать, ломать, переустанавливать и докапываться до сути того, как всё устроено</strong>.</p>
                            </div>
                        </div>

                        <div class="timeline-card">
                            <div class="timeline-dot"><div class="timeline-dot-inner"></div></div>
                            <div class="timeline-header">
                                <h3 class="timeline-title">Искусственный интеллект и свои проекты</h3>
                                <span class="timeline-badge">2024–2026</span>
                            </div>
                            <div class="timeline-body">
                                <p>С приходом генеративного ИИ я погрузился в изучение нейросетей. Пытался обучить собственную AI-модель (железа не хватало, обучение шло медленно, но проект дал колоссальный опыт архитектуры).</p>
                                <p>Сегодня я активно использую современные AI-инструменты разработки (включая Codex). Для меня ИИ — это не замена мышления программиста, а <strong>мощнейший мультипликатор</strong>, позволяющий одному человеку реализовывать масштабные идеи со скоростью целой команды.</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div style="margin: 48px 0 24px;">
                    <h2 class="dev-section-heading">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/>
                        </svg>
                        Почему именно IT? Эволюция трёх вопросов
                    </h2>
                    <p style="color: var(--text-secondary); line-height: 1.6; margin-bottom: 24px;">
                        Компьютер для меня никогда не был просто игрушкой. Мое отношение к нему развивалось через три фундаментальных вопроса:
                    </p>

                    <div class="dev-questions-grid">
                        <div class="question-card">
                            <span class="question-number">01</span>
                            <h3 class="question-title">«Как это работает?»</h3>
                            <p class="question-desc">Детский интерес: как устроена игра, откуда берутся машины в GTA, как запускается Windows 7 и что прячется внутри настроек.</p>
                        </div>
                        <div class="question-card">
                            <span class="question-number">02</span>
                            <h3 class="question-title">«А могу ли я сделать это сам?»</h3>
                            <p class="question-desc">Творческий этап: создать анимацию как у Alan Becker, смонтировать ролик в 20 FPS, написать первый код и переустановить 23 системы.</p>
                        </div>
                        <div class="question-card">
                            <span class="question-number">03</span>
                            <h3 class="question-title">«Что будет, если создать это по-своему?»</h3>
                            <p class="question-desc">Зрелый подход инженера: разработка собственных архитектур, синтез ИИ и веб-технологий, создание продуктов вроде ZETA Wiki.</p>
                        </div>
                    </div>
                </div>

                <div class="dev-brother-card">
                    <div class="brother-card-header">
                        <div class="brother-icon-circle">⭐</div>
                        <h3 class="brother-card-title">Главный человек, с которого всё началось</h3>
                    </div>
                    <div class="brother-card-text">
                        Главный человек, который повлиял на мой интерес к IT — <strong>мой старший брат</strong>.
                        Он первым показал мне игры, ноутбук, Minecraft, основы программирования и привил ключевой принцип исследователя:
                    </div>
                    <div class="brother-card-quote">
                        «Не только пользоваться технологией, но и разбираться, как она устроена изнутри.»
                    </div>
                </div>

                <div style="margin: 48px 0;">
                    <h2 class="dev-section-heading">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
                        </svg>
                        VIGER Dev сегодня
                    </h2>
                    <p style="color: var(--text-secondary); line-height: 1.6; margin-bottom: 20px;">
                        Сейчас я развиваюсь сразу в нескольких ключевых сферах: <strong>монтаж, YouTube, разработка, дизайн, эксперименты с технологиями и AI</strong>.
                        За день у меня может появиться до 10 небольших идей и экспериментальных прототипов, из которых я отбираю самые перспективные и развиваю дальше.
                    </p>

                    <div class="dev-today-grid">
                        <div class="today-stat-card">
                            <div class="today-stat-icon">🎬</div>
                            <div class="today-stat-label">Монтаж & YouTube</div>
                            <div class="today-stat-sub">Чувство ритма, динамика, эффекты</div>
                        </div>
                        <div class="today-stat-card">
                            <div class="today-stat-icon">🌐</div>
                            <div class="today-stat-label">Web & ZETA Wiki</div>
                            <div class="today-stat-sub">Создание быстрых и чистых интерфейсов</div>
                        </div>
                        <div class="today-stat-card">
                            <div class="today-stat-icon">🤖</div>
                            <div class="today-stat-label">AI-Driven Coding</div>
                            <div class="today-stat-sub">Быстрая трансформация мыслей в код</div>
                        </div>
                        <div class="today-stat-card">
                            <div class="today-stat-icon">🚀</div>
                            <div class="today-stat-label">Свои технологии</div>
                            <div class="today-stat-sub">«Не просто пользоваться, а создавать»</div>
                        </div>
                    </div>

                    <div class="dev-quote-lead" style="text-align: center; border-left: none; border: 1px dashed rgba(245, 158, 11, 0.4); border-radius: var(--radius-lg); font-size: 1.15rem; font-weight: 600;">
                        «Я буквально рос вместе с компьютером. Это и есть история VIGER Dev.»
                    </div>
                </div>

                <div style="text-align: center; margin-top: 40px; display: flex; justify-content: center; gap: 14px; flex-wrap: wrap;">
                    <a href="#home" class="btn-primary">Вернуться к энциклопедии</a>
                    <a href="#random" class="article-tool-btn">🎲 Случайная статья</a>
                </div>
            </div>
        `;
        document.title = 'VIGER Dev — История разработчика | ZETA Wiki';
    }

    // =========================================================================
    // ROUTER WITH GENERATION TOKEN (RACE CONDITION FREE)
    // =========================================================================

    async function handleRoute() {
        stopTTS();
        const routeId = ++STATE.currentRouteId;
        const hash = window.location.hash || '#home';
        updateActiveNav(hash);
        closeMobileSidebar();
        DOM.appContent.scrollTo({ top: 0, behavior: 'instant' });
        if (DOM.readingProgressBar) DOM.readingProgressBar.style.width = '0%';
        const loc = getLocale();

        try {
            if (hash === '#home' || hash === '') {
                showSkeletonGrid();
                const items = await fetchWikiSearchWithImages(loc.homeQuery, 16);
                if (routeId !== STATE.currentRouteId) return;
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
                if (routeId !== STATE.currentRouteId) return;
                if (randomTitle) {
                    // Use replace to prevent infinite back-button loop!
                    window.location.replace(`#article/${encodeURIComponent(randomTitle)}`);
                } else {
                    DOM.appContent.innerHTML = `<div class="error-state-card"><div class="error-title">Ошибка</div><div class="error-desc">Не удалось получить случайную статью.</div></div>`;
                }
            }
            else if (hash.startsWith('#category/')) {
                const catSlug = decodeURIComponent(hash.replace('#category/', ''));
                const catObj = loc.categories[catSlug] || { query: catSlug, label: catSlug };
                showSkeletonGrid();
                const items = await fetchWikiSearchWithImages(catObj.query, 18);
                if (routeId !== STATE.currentRouteId) return;
                renderCardsGrid(items, catObj.label, `Подборка актуальных статей по теме «${catObj.label}».`);
            }
            else if (hash.startsWith('#search/')) {
                const query = decodeURIComponent(hash.replace('#search/', ''));
                showSkeletonGrid();
                const items = await fetchWikiSearchWithImages(query, 24);
                if (routeId !== STATE.currentRouteId) return;
                renderCardsGrid(items, loc.searchTitle, loc.searchDesc.replace('{query}', query));
            }
            else if (hash.startsWith('#article/')) {
                const title = decodeURIComponent(hash.replace('#article/', ''));
                showSkeletonArticle();
                const articleData = await fetchWikiArticle(title);
                if (routeId !== STATE.currentRouteId) return;
                renderArticleView(articleData);
            }
            else if (hash === '#viger') {
                renderDeveloperPortal();
            }
            else {
                // If it's a stray in-page anchor, do not show 404
                if (hash.startsWith('#cite_note') || hash.startsWith('#sec-')) {
                    return;
                }
                DOM.appContent.innerHTML = `
                    <div class="error-state-card">
                        <div class="error-icon">404</div>
                        <div class="error-title">Страница не найдена</div>
                        <div class="error-desc">Такого раздела не существует. Воспользуйтесь меню или строкой поиска.</div>
                        <a href="#home" class="btn-primary">${loc.navHome}</a>
                    </div>
                `;
                document.title = 'Страница не найдена — ZETA Wiki';
            }
        } catch (err) {
            if (routeId !== STATE.currentRouteId) return;
            console.error('Route handling network error:', err);
            DOM.appContent.innerHTML = `
                <div class="error-state-card">
                    <div class="error-icon">📡</div>
                    <div class="error-title">${loc.netErrorTitle}</div>
                    <div class="error-desc">${loc.netErrorDesc}</div>
                    <button class="btn-primary" id="btn-route-retry">${loc.retryBtn}</button>
                </div>
            `;
            document.getElementById('btn-route-retry')?.addEventListener('click', () => {
                handleRoute();
            });
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
            e.preventDefault();
            if (STATE.selectedSuggestionIndex >= 0 && STATE.suggestions[STATE.selectedSuggestionIndex]) {
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
                DOM.searchClearBtn.classList.remove('hidden');
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

    function updateThemeIcon(theme) {
        if (!DOM.themeToggleBtn) return;
        if (theme === 'light') {
            DOM.themeToggleBtn.innerHTML = `
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
                </svg>
            `;
        } else if (theme === 'oled') {
            DOM.themeToggleBtn.innerHTML = `
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <path d="M12 2a10 10 0 0 0 0 20z" fill="currentColor"></path>
                </svg>
            `;
        } else {
            DOM.themeToggleBtn.innerHTML = `
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="12" cy="12" r="5"/>
                    <line x1="12" y1="1" x2="12" y2="3"/>
                    <line x1="12" y1="21" x2="12" y2="23"/>
                    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
                    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
                    <line x1="1" y1="12" x2="3" y2="12"/>
                    <line x1="21" y1="12" x2="23" y2="12"/>
                    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
                    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
                </svg>
            `;
        }
    }

    function applyTheme(theme) {
        document.body.classList.remove('theme-dark', 'theme-light', 'theme-oled');
        document.body.classList.add(`theme-${theme}`);
        localStorage.setItem('zeta_wiki_theme', theme);
        STATE.theme = theme;

        if (DOM.metaThemeColor) {
            DOM.metaThemeColor.setAttribute('content', theme === 'light' ? '#F8FAFC' : theme === 'oled' ? '#000000' : '#0B0D14');
        }

        updateThemeIcon(theme);
    }

    DOM.themeToggleBtn.addEventListener('click', () => {
        const nextTheme = STATE.theme === 'dark' ? 'light' : STATE.theme === 'light' ? 'oled' : 'dark';
        applyTheme(nextTheme);
        showToast(`Тема: ${nextTheme.toUpperCase()}`, '🎨');
    });

    DOM.langSelect.value = STATE.lang;
    DOM.langSelect.addEventListener('change', (e) => {
        const newLang = e.target.value;
        STATE.lang = newLang;
        localStorage.setItem('zeta_wiki_lang', STATE.lang);
        STATE.cache.clear();

        showToast(`Язык: ${STATE.lang.toUpperCase()}`, '🌐');

        // Check if currently on an article and cross-language translation exists
        const hash = window.location.hash || '';
        if (hash.startsWith('#article/') && STATE.currentLangLinks[newLang]) {
            const translatedTitle = STATE.currentLangLinks[newLang];
            const targetHash = `#article/${encodeURIComponent(translatedTitle)}`;
            if (window.location.hash === targetHash) {
                handleRoute();
            } else {
                window.location.hash = targetHash;
            }
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

    DOM.appContent.addEventListener('scroll', () => {
        const scrollTop = DOM.appContent.scrollTop;
        const scrollHeight = DOM.appContent.scrollHeight - DOM.appContent.clientHeight;
        const progress = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
        if (DOM.readingProgressBar) {
            DOM.readingProgressBar.style.width = `${Math.min(100, Math.max(0, progress))}%`;
        }

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
        else if (e.altKey && e.key.toLowerCase() === 'r' && !isInputFocused) {
            e.preventDefault();
            window.location.hash = '#random';
        }
        // Alt + T: Cycle theme
        else if (e.altKey && e.key.toLowerCase() === 't' && !isInputFocused) {
            e.preventDefault();
            const nextTheme = STATE.theme === 'dark' ? 'light' : STATE.theme === 'light' ? 'oled' : 'dark';
            applyTheme(nextTheme);
            showToast(`Тема: ${nextTheme.toUpperCase()}`, '🎨');
        }
        // Alt + H: Go home
        else if (e.altKey && e.key.toLowerCase() === 'h' && !isInputFocused) {
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

    // Register PWA Service Worker
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

    // Initialize voices
    if (window.speechSynthesis) {
        window.speechSynthesis.onvoiceschanged = () => {
            loadAvailableVoices();
            renderVoiceSelectorUI();
        };
        loadAvailableVoices();
    }

    // Initial Route Execution
    handleRoute();

})();
