/**
 * ZETA WIKI - Modern, Secure, High-Performance Encyclopedia
 * Pure Vanilla JavaScript Architecture
 */

(function () {
    'use strict';

    // =========================================================================
    // STATE & CONFIGURATION
    // =========================================================================
    const STATE = {
        lang: localStorage.getItem('zeta_wiki_lang') || 'ru',
        theme: localStorage.getItem('zeta_wiki_theme') || 'dark',
        bookmarks: JSON.parse(localStorage.getItem('zeta_wiki_bookmarks') || '[]'),
        activeAbortController: null,
        currentArticleData: null,
        cache: new Map(), // In-memory API cache
        searchDebounceTimer: null,
        selectedSuggestionIndex: -1,
        suggestions: []
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
        readingProgressBar: document.getElementById('reading-progress-bar'),
        toastContainer: document.getElementById('toast-container')
    };

    // =========================================================================
    // SECURITY & SANITIZATION UTILITIES
    // =========================================================================

    /**
     * Escape string to prevent XSS in HTML attribute or text context
     */
    function escapeHTML(str) {
        if (str === null || str === undefined) return '';
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }

    /**
     * Comprehensive DOM Sanitizer for Wikipedia extracts
     * Parses HTML, removes dangerous tags and attributes, converts internal links
     */
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

        // TreeWalker to traverse all elements
        const walker = document.createTreeWalker(doc.body, NodeFilter.SHOW_ELEMENT);
        const elementsToRemove = [];

        while (walker.nextNode()) {
            const el = walker.currentNode;
            const tag = el.tagName.toLowerCase();

            if (!ALLOWED_TAGS.has(tag)) {
                elementsToRemove.push(el);
                continue;
            }

            // Remove unapproved attributes and any event handlers (on*)
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
                        // Check if it's not a special file/help link
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

        // Remove dangerous/unsupported elements
        elementsToRemove.forEach(el => el.remove());

        return doc.body.innerHTML;
    }

    // =========================================================================
    // API CLIENT (With Cache, Dynamic Language & AbortController)
    // =========================================================================

    function getApiBaseUrl() {
        return `https://${STATE.lang}.wikipedia.org/w/api.php?origin=*&format=json`;
    }

    /**
     * Fetch with active AbortController and caching
     */
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

            // Cache up to 60 items
            if (STATE.cache.size > 60) {
                const firstKey = STATE.cache.keys().next().value;
                STATE.cache.delete(firstKey);
            }
            STATE.cache.set(url, data);
            return data;
        } catch (err) {
            if (err.name === 'AbortError') {
                return null; // Gracefully handle navigation abort
            }
            throw err;
        }
    }

    async function fetchWikiSearchWithImages(query, limit = 15) {
        try {
            const url = `${getApiBaseUrl()}&action=query&generator=search&gsrsearch=${encodeURIComponent(query)}&gsrlimit=${limit}&prop=pageimages|extracts&exchars=180&exintro=1&explaintext=1&piprop=thumbnail&pithumbsize=400`;
            const data = await cachedFetch(url);
            if (!data || !data.query || !data.query.pages) return [];

            const pages = Object.values(data.query.pages).sort((a, b) => (a.index || 0) - (b.index || 0));
            return pages.map(p => ({
                title: p.title,
                snippet: p.extract || "Описание отсутствует.",
                thumbnail: p.thumbnail ? p.thumbnail.source : null
            }));
        } catch (e) {
            console.error("Wiki Search Error:", e);
            return [];
        }
    }

    async function fetchWikiArticle(title) {
        try {
            // Fetch full article extract with HTML formatting
            const url = `${getApiBaseUrl()}&action=query&prop=extracts|pageimages&titles=${encodeURIComponent(title)}&piprop=original`;
            const data = await cachedFetch(url);
            if (!data || !data.query || !data.query.pages) return null;

            const pageId = Object.keys(data.query.pages)[0];
            return data.query.pages[pageId] || null;
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
    // UI TOASTS & BOOKMARKS
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

    function updateBookmarksBadge() {
        if (DOM.bookmarksBadge) {
            DOM.bookmarksBadge.textContent = STATE.bookmarks.length;
        }
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
        updateBookmarksBadge();

        const bookmarkBtn = document.getElementById('btn-bookmark-action');
        if (bookmarkBtn) {
            bookmarkBtn.classList.toggle('active', isBookmarked(article.title));
            bookmarkBtn.innerHTML = isBookmarked(article.title)
                ? `<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2"><path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/></svg> Сохранено`
                : `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/></svg> В закладки`;
        }
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
                (hash.startsWith('#category/') && targetNav === hash.substring(1))
            ) {
                link.classList.add('active');
            }
        });
    }

    function renderCardsGrid(items, title, desc, emptyMsg = 'Ничего не найдено.') {
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
                    <div class="error-title">Нет результатов</div>
                    <div class="error-desc">${escapeHTML(emptyMsg)}</div>
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
        const items = STATE.bookmarks;
        let html = `
            <div class="page-header" style="display: flex; justify-content: space-between; align-items: flex-end; flex-wrap: wrap; gap: 16px;">
                <div>
                    <h1 class="page-title">Закладки</h1>
                    <p class="page-desc">Сохраненные статьи для быстрого чтения оффлайн или позже.</p>
                </div>
                ${items.length > 0 ? `<button id="btn-clear-bookmarks" class="article-tool-btn">Очистить все</button>` : ''}
            </div>
        `;

        if (items.length === 0) {
            html += `
                <div class="error-state-card">
                    <div class="error-icon">⭐</div>
                    <div class="error-title">Закладок пока нет</div>
                    <div class="error-desc">Нажмите кнопку «В закладки» во время чтения любой статьи, чтобы сохранить её сюда.</div>
                    <a href="#home" class="btn-primary">Исследовать статьи</a>
                </div>
            `;
        } else {
            html += `<div class="grid-cards">`;
            items.forEach(item => {
                const safeTitle = escapeHTML(item.title);
                const safeSnippet = escapeHTML(item.snippet || 'Статья сохранена пользователем.');
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
        document.title = `Закладки (${items.length}) — ZETA Wiki`;

        const clearBtn = document.getElementById('btn-clear-bookmarks');
        if (clearBtn) {
            clearBtn.addEventListener('click', () => {
                if (confirm('Очистить все закладки?')) {
                    STATE.bookmarks = [];
                    localStorage.setItem('zeta_wiki_bookmarks', '[]');
                    updateBookmarksBadge();
                    renderSavedArticlesView();
                    showToast('Все закладки удалены', '🗑️');
                }
            });
        }
    }

    function renderArticleView(pageData) {
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

        // Estimate reading time
        const textOnly = (pageData.extract || '').replace(/<[^>]*>/g, ' ');
        const wordCount = textOnly.trim().split(/\s+/).length;
        const readMinutes = Math.max(1, Math.ceil(wordCount / 180));

        // Wikipedia source link
        const wikiSourceUrl = `https://${STATE.lang}.wikipedia.org/wiki/${encodeURIComponent(pageData.title)}`;

        // Build article layout
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
                    </header>

                    ${originalImageUrl ? `<img src="${escapeHTML(originalImageUrl)}" alt="${safeTitle}" class="article-image-banner">` : ''}

                    <div class="article-content" id="article-body">
                        ${cleanHTML}
                    </div>
                </article>

                <!-- Interactive Table of Contents -->
                <aside class="article-toc-column" id="article-toc-column">
                    <div class="toc-title">Содержание</div>
                    <ul class="toc-list" id="toc-list">
                        <!-- Populated dynamically -->
                    </ul>
                </aside>
            </div>
        `;

        DOM.appContent.innerHTML = html;
        document.title = `${pageData.title} — ZETA Wiki`;

        // Cache current article data for bookmarking
        STATE.currentArticleData = {
            title: pageData.title,
            snippet: textOnly.slice(0, 150),
            thumbnail: originalImageUrl
        };

        // Attach Toolbar Listeners
        document.getElementById('btn-bookmark-action')?.addEventListener('click', () => {
            if (STATE.currentArticleData) {
                toggleBookmark(STATE.currentArticleData);
            }
        });

        document.getElementById('btn-share-action')?.addEventListener('click', () => {
            const url = window.location.href;
            navigator.clipboard.writeText(url).then(() => {
                showToast('Ссылка скопирована в буфер обмена', '🔗');
            }).catch(() => {
                showToast('Не удалось скопировать ссылку', '❌');
            });
        });

        // Generate Table of Contents from H2 and H3 headings
        generateTableOfContents();
    }

    function generateTableOfContents() {
        const articleBody = document.getElementById('article-body');
        const tocList = document.getElementById('toc-list');
        const tocColumn = document.getElementById('article-toc-column');
        if (!articleBody || !tocList || !tocColumn) return;

        const headings = articleBody.querySelectorAll('h2, h3');
        if (headings.length < 2) {
            tocColumn.style.display = 'none';
            return;
        }

        headings.forEach((heading, index) => {
            const headingId = `heading-${index}`;
            heading.id = headingId;

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
        });

        // IntersectionObserver for active section highlight
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
                        <span class="dev-pill">🎮 Game Dev Alum</span>
                    </div>
                </div>

                <div class="dev-terminal">
                    <div class="dev-terminal-header">
                        <div class="dot dot-red"></div>
                        <div class="dot dot-yellow"></div>
                        <div class="dot dot-green"></div>
                        <span class="terminal-title">viger@zeta-core:~</span>
                    </div>
                    <div><span class="terminal-green">$</span> whoami</div>
                    <div class="terminal-text">Темуршох Ахмадалиев (VIGER / VIGERIX) — разработчик современных веб-систем, исследователь генеративных интерфейсов.</div>
                    <br>
                    <div><span class="terminal-green">$</span> zeta-wiki --audit-status</div>
                    <div class="terminal-text"><span class="terminal-green">[OK]</span> XSS Vulnerabilities Eliminated (DOMParser Strict Sanitization)</div>
                    <div class="terminal-text"><span class="terminal-green">[OK]</span> Race Conditions Fixed via AbortController</div>
                    <div class="terminal-text"><span class="terminal-green">[OK]</span> Multi-Language Wikipedia Integration Native (No Google Translate Bloat)</div>
                    <div class="terminal-text"><span class="terminal-green">[OK]</span> Table of Contents & Reader Mode Active</div>
                    <div class="terminal-text"><span class="terminal-green">[OK]</span> Dark / Light / OLED Themes Supported</div>
                    <br>
                    <div><span class="terminal-green">$</span> echo "Build fast, stay secure."</div>
                    <div class="terminal-yellow">"Build fast, stay secure."</div>
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

        try {
            if (hash === '#home' || hash === '') {
                showSkeletonGrid();
                const items = await fetchWikiSearchWithImages('Научные открытия и технологии', 15);
                renderCardsGrid(items, 'Главные темы', 'Свободная современная энциклопедия. Выберите категорию или воспользуйтесь быстрым поиском.');
            }
            else if (hash === '#saved') {
                renderSavedArticlesView();
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
                const category = decodeURIComponent(hash.replace('#category/', ''));
                showSkeletonGrid();
                const items = await fetchWikiSearchWithImages(category, 18);
                renderCardsGrid(items, `Категория: ${category}`, `Подборка актуальных статей по направлению «${category}».`);
            }
            else if (hash.startsWith('#search/')) {
                const query = decodeURIComponent(hash.replace('#search/', ''));
                showSkeletonGrid();
                const items = await fetchWikiSearchWithImages(query, 24);
                renderCardsGrid(items, `Результаты поиска`, `Найдено по запросу: «${query}»`, `По запросу «${query}» ничего не найдено.`);
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
        showToast(`Тема переключена: ${nextTheme.toUpperCase()}`, '🎨');
    });

    DOM.langSelect.value = STATE.lang;
    DOM.langSelect.addEventListener('change', (e) => {
        STATE.lang = e.target.value;
        localStorage.setItem('zeta_wiki_lang', STATE.lang);
        STATE.cache.clear(); // Clear cache for new language
        showToast(`Язык изменен на: ${STATE.lang.toUpperCase()}`, '🌐');
        handleRoute();
    });

    // =========================================================================
    // MOBILE DRAWER & READING SCROLL PROGRESS
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

    // Reading progress tracker
    DOM.appContent.addEventListener('scroll', () => {
        const scrollTop = DOM.appContent.scrollTop;
        const scrollHeight = DOM.appContent.scrollHeight - DOM.appContent.clientHeight;
        const progress = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
        DOM.readingProgressBar.style.width = `${Math.min(100, Math.max(0, progress))}%`;
    });

    // Delegated click for internal wiki links inside article content
    DOM.appContent.addEventListener('click', (e) => {
        const link = e.target.closest('a');
        if (!link) return;

        const href = link.getAttribute('href');
        if (href && href.startsWith('#article/')) {
            // Already an app internal hash link
            closeMobileSidebar();
        }
    });

    // =========================================================================
    // INITIALIZATION
    // =========================================================================

    window.addEventListener('hashchange', handleRoute);

    // Apply saved preferences
    applyTheme(STATE.theme);
    updateBookmarksBadge();

    // Initial Route Execution
    handleRoute();

})();
