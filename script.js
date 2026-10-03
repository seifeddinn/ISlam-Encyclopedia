// Islamic Encyclopedia - Main JavaScript File

// ===========================================================
// SPLASH SCREEN — Dismiss Logic Only
// HTML is injected directly in each page's <body> for instant first-paint
// ===========================================================
(function manageSplash() {
    var MIN_DISPLAY = 2000;
    var startTime = Date.now();

    function dismissSplash() {
        var el = document.getElementById('islamicSplashScreen');
        if (!el || el.classList.contains('splash-hide')) return;
        var fill = el.querySelector('.splash-progress-fill');
        if (fill) {
            fill.style.transition = 'width 0.3s ease';
            fill.style.width = '100%';
        }
        setTimeout(function () {
            el.classList.add('splash-hide');
            el.addEventListener('transitionend', function () {
                if (el.parentNode) el.parentNode.removeChild(el);
            }, { once: true });
            setTimeout(function () {
                if (el && el.parentNode) el.parentNode.removeChild(el);
            }, 1000);
        }, 320);
    }

    function tryDismiss() {
        var elapsed = Date.now() - startTime;
        var remaining = Math.max(0, MIN_DISPLAY - elapsed);
        setTimeout(dismissSplash, remaining);
    }

    if (document.readyState === 'complete') {
        tryDismiss();
    } else {
        window.addEventListener('load', tryDismiss, { once: true });
    }
    setTimeout(dismissSplash, 5000);
})();

// --- Configuration & Data ---

// Static Content Index for Client-Side Search
const searchIndex = [
    {
        title: "سورة البقرة",
        type: "quran",
        category: "القرآن الكريم",
        desc: "سورة مدنية، هي أطول سورة في القرآن الكريم، تحتوي على أعظم آية في كتاب الله (آية الكرسي).",
        url: "recitations.html",
        keywords: "بقرة, مدنية, قران, قرآن, اطول, كرسي"
    },
    {
        title: "حديث الأعمال بالنيات",
        type: "hadith",
        category: "الحديث الشريف",
        desc: "حديث عمر بن الخطاب: إنما الأعمال بالنيات. أصل في قبول الأعمال وتصحيح العبادات.",
        url: "hadith.html",
        keywords: "نية, نيات, عمر, خطاب, بخاري"
    },
    {
        title: "أركان الإسلام",
        type: "hadith",
        category: "الحديث الشريف",
        desc: "حديث بني الإسلام على خمس. يوضح الأسس التي يقوم عليها الدين الإسلامي.",
        url: "hadith.html",
        keywords: "اركان, اسلام, صلاة, زكاة, حج, صوم, شهادة"
    },
    {
        title: "أحكام الصلاة",
        type: "fiqh",
        category: "الفقه الإسلامي",
        desc: "شروط وأركان وواجبات الصلاة في الفقه الإسلامي. أهمية الصلاة كعمود للدين.",
        url: "fiqh.html",
        keywords: "صلاة, فقه, عبادات, طهارة, وضوء"
    },
    {
        title: "غزوة بدر الكبرى",
        type: "history",
        category: "التاريخ الإسلامي",
        desc: "أول معركة فاصلة في تاريخ الإسلام، وقعت في السابع عشر من رمضان في السنة الثانية للهجرة.",
        url: "history.html",
        keywords: "بدر, غزوة, تاريخ, معركة, رمضان"
    },
    {
        title: "سيرة النبي محمد ﷺ",
        type: "seerah",
        category: "السيرة النبوية",
        desc: "ميلاده، نشأته، بعثته، وهجرته ﷺ. لمحات من حياته العطرة قبل وبعد النبوة.",
        url: "seerah.html",
        keywords: "سيرة, نبي, محمد, رسول, مكة, مدينة"
    },
    {
        title: "أركان الإيمان",
        type: "aqeedah",
        category: "العقيدة الإسلامية",
        desc: "الإيمان بالله وملائكته وكتبه ورسله واليوم الآخر والقدر خيره وشره.",
        url: "aqeedah.html",
        keywords: "ايمان, عقيدة, توحيد, ملائكة, رسل"
    }
];

// Daily Verses Data
const dailyVerses = [
    { text: "وَاسْتَعِينُوا بِالصَّبْرِ وَالصَّلَاةِ ۚ وَإِنَّهَا لَكَبِيرَةٌ إِلَّا عَلَى الْخَاشِعِينَ", surah: "سورة البقرة: 45" },
    { text: "إِنَّ اللَّهَ مَعَ الصَّابِرِينَ", surah: "سورة البقرة: 153" },
    { text: "فَإِنَّ مَعَ الْعُسْرِ يُسْرًا * إِنَّ مَعَ الْعُسْرِ يُسْرًا", surah: "سورة الشرح: 5-6" },
    { text: "وَقُلْ رَبِّ زِدْنِي عِلْمًا", surah: "سورة طه: 114" },
    { text: "لَا يُكَلِّفُ اللَّهُ نَفْسًا إِلَّا وُسْعَهَا", surah: "سورة البقرة: 286" }
];

// --- UI Helpers ---

// Toast Notification System
function showToast(message, type = 'success') {
    // Create toast container if it doesn't exist
    let toastContainer = document.querySelector('.toast-container');
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.className = 'toast-container position-fixed bottom-0 start-0 p-3';
        toastContainer.style.zIndex = '1050';
        document.body.appendChild(toastContainer);
    }

    // Create toast element
    const toastId = 'toast-' + Date.now();
    const bgClass = type === 'success' ? 'text-bg-success' : (type === 'error' ? 'text-bg-danger' : 'text-bg-primary');
    const icon = type === 'success' ? 'check-circle' : (type === 'error' ? 'exclamation-circle' : 'info-circle');

    const toastHtml = `
        <div id="${toastId}" class="toast align-items-center ${bgClass} border-0" role="alert" aria-live="assertive" aria-atomic="true">
            <div class="d-flex">
                <div class="toast-body d-flex align-items-center gap-2">
                    <i class="fas fa-${icon}"></i>
                    ${message}
                </div>
                <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
            </div>
        </div>
    `;

    toastContainer.insertAdjacentHTML('beforeend', toastHtml);

    // Initialize and show toast using Bootstrap API
    const toastElement = document.getElementById(toastId);
    if (window.bootstrap) {
        const toast = new bootstrap.Toast(toastElement, { delay: 3000 });
        toast.show();

        // Remove from DOM after hidden
        toastElement.addEventListener('hidden.bs.toast', () => {
            toastElement.remove();
        });
    }
}

// Global Event Delegation for Dynamic Elements
document.addEventListener('click', function (e) {
    // Handle Bookmark Buttons
    const bookmarkBtn = e.target.closest('.btn-bookmark');
    if (bookmarkBtn) {
        e.preventDefault();
        const card = bookmarkBtn.closest('.content-card') || bookmarkBtn.closest('.card');
        if (card) {
            // Try to get data from attributes first, fallback to parsing content
            const title = card.getAttribute('data-title') || card.querySelector('.card-title')?.innerText || document.title;
            const url = card.getAttribute('data-url') || window.location.href;
            const id = card.getAttribute('data-id') || url;

            toggleBookmark(id, title, url);
        } else {
            // Fallback for page-level bookmark
            toggleBookmark(window.location.pathname, document.title, window.location.href);
        }
    }

    // Handle Share Buttons
    const shareBtn = e.target.closest('.btn-share');
    if (shareBtn) {
        e.preventDefault();
        const card = shareBtn.closest('.content-card') || shareBtn.closest('.card');
        const title = card?.getAttribute('data-title') || document.title;
        const text = card?.getAttribute('data-desc') || "شاهد هذا المحتوى المميز من الموسوعة الإسلامية الشاملة";
        const url = card?.getAttribute('data-url') || window.location.href;

        shareContent(title, text, url);
    }

    // Handle Download Buttons (Mock)
    const downloadBtn = e.target.closest('.btn-download');
    if (downloadBtn) {
        e.preventDefault();
        const card = downloadBtn.closest('.content-card');
        const title = card?.getAttribute('data-title') || 'الملف';

        // Mock download process
        showToast(`جاري بدء تحميل: ${title}`, 'info');
        setTimeout(() => {
            showToast('تم التحميل بنجاح', 'success');
        }, 2000);
    }
});


// --- Core Functionality ---

// Search Functionality
function performSearch(query) {
    if (!query || query.trim() === '') {
        showToast('الرجاء إدخال كلمة البحث', 'warning');
        return;
    }

    // Redirect to search page with query parameter if we're not already there
    if (!window.location.pathname.includes('search.html')) {
        window.location.href = `search.html?q=${encodeURIComponent(query)}`;
    } else {
        // If we are on search page, just update results (handled by search.html script, 
        // but we can trigger a custom event or let the page helper handle it)
        const url = new URL(window.location);
        url.searchParams.set('q', query);
        window.history.pushState({}, '', url);
        renderSearchResults(query);
    }
}

function renderSearchResults(query) {
    const resultsContainer = document.getElementById('searchResultsContainer');
    const countElement = document.getElementById('resultCount');
    const resultsSection = document.getElementById('results');

    if (!resultsContainer || !countElement || !resultsSection) return;

    const normalizedQuery = query.toLowerCase().trim();
    const results = searchIndex.filter(item => {
        return item.title.toLowerCase().includes(normalizedQuery) ||
            item.desc.toLowerCase().includes(normalizedQuery) ||
            item.keywords.includes(normalizedQuery) ||
            item.category.includes(normalizedQuery);
    });

    resultsSection.style.display = 'block';
    countElement.textContent = results.length;
    resultsContainer.innerHTML = '';

    if (results.length === 0) {
        resultsContainer.innerHTML = `
            <div class="text-center py-5">
                <i class="fas fa-search fa-3x text-muted mb-3 opacity-50"></i>
                <h5 class="text-muted">لم يتم العثور على نتائج لـ "${query}"</h5>
                <p class="text-muted">جرب كلمات مفتاحية مختلفة أو تأكد من صحة الإملاء</p>
            </div>
        `;
        return;
    }

    results.forEach(item => {
        // Map types to badge colors
        const badgeColor = {
            'quran': 'success',
            'hadith': 'primary',
            'fiqh': 'warning text-dark',
            'history': 'info text-dark',
            'seerah': 'danger',
            'aqeedah': 'secondary'
        }[item.type] || 'secondary';

        const html = `
            <div class="card mb-3 content-card fade-in" data-title="${item.title}" data-url="${item.url}" data-desc="${item.desc}">
                <div class="card-body">
                    <div class="d-flex justify-content-between align-items-start mb-2">
                        <h5 class="card-title">
                            <a href="${item.url}" class="text-decoration-none text-primary-custom hover-link">
                                ${item.title}
                            </a>
                        </h5>
                        <span class="badge bg-${badgeColor}">${item.category}</span>
                    </div>
                    <p class="card-text text-muted">${item.desc}</p>
                    <div class="d-flex gap-2 mt-3">
                        <a href="${item.url}" class="btn btn-sm btn-outline-primary">
                            <i class="fas fa-eye me-1"></i> عرض
                        </a>
                        <button class="btn btn-sm btn-outline-secondary btn-share">
                            <i class="fas fa-share me-1"></i> مشاركة
                        </button>
                    </div>
                </div>
            </div>
        `;
        resultsContainer.insertAdjacentHTML('beforeend', html);
    });
}

// Local Storage & Bookmarks
function toggleBookmark(itemId, itemTitle, itemUrl) {
    let bookmarks = getFromLocalStorage('bookmarks') || [];
    const index = bookmarks.findIndex(b => b.id === itemId);

    if (index > -1) {
        bookmarks.splice(index, 1);
        showToast('تم إزالة الإشارة المرجعية', 'info');
    } else {
        bookmarks.push({
            id: itemId,
            title: itemTitle,
            url: itemUrl,
            date: new Date().toISOString()
        });
        showToast('تم إضافة الإشارة المرجعية بنجاح', 'success');
    }

    saveToLocalStorage('bookmarks', bookmarks);
}

function saveToLocalStorage(key, value) {
    try {
        localStorage.setItem(key, JSON.stringify(value));
        return true;
    } catch (e) {
        console.error('Error saving to localStorage:', e);
        return false;
    }
}

function getFromLocalStorage(key) {
    try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : null;
    } catch (e) {
        console.error('Error reading from localStorage:', e);
        return null;
    }
}

// Share Functionality
function shareContent(title, text, url) {
    if (navigator.share) {
        navigator.share({
            title: title,
            text: text,
            url: window.location.origin + '/' + url // Ensure full URL
        }).catch(err => {
// Fallback to clipboard if share was cancelled or failed but not due to lack of support
            copyToClipboard(url);
        });
    } else {
        copyToClipboard(url);
    }
}

function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        showToast('تم نسخ الرابط إلى الحافظة', 'success');
    }).catch(err => {
        console.error('Failed to copy', err);
        showToast('حدث خطأ أثناء نسخ الرابط', 'error');
    });
}


// --- Initialization ---

document.addEventListener('DOMContentLoaded', function () {
    // 1. Initialize Navbar Scroll Effect
    window.addEventListener('scroll', function () {
        const navbar = document.querySelector('.navbar');
        if (navbar) {
            if (window.scrollY > 50) {
                navbar.classList.add('shadow-sm');
                navbar.style.background = 'rgba(26, 60, 93, 0.95)';
                navbar.style.backdropFilter = 'blur(10px)';
            } else {
                navbar.classList.remove('shadow-sm');
                navbar.style.background = 'var(--primary-color)';
                navbar.style.backdropFilter = 'none';
            }
        }
    });

    // 2. Initialize Search Interactions
    const searchButtons = document.querySelectorAll('.search-btn-trigger'); // Add this class to buttons
    const searchInputs = document.querySelectorAll('.search-input-field'); // Add this class to inputs

    // Also bind to existing selectors in index/hero
    const heroSearchBtn = document.querySelector('.search-box .btn-primary');
    const heroSearchInput = document.querySelector('.search-box input[type="text"]');

    function bindSearch(btn, input) {
        if (btn && input) {
            btn.addEventListener('click', () => performSearch(input.value));
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') performSearch(input.value);
            });
        }
    }

    bindSearch(heroSearchBtn, heroSearchInput);
    searchButtons.forEach((btn, i) => bindSearch(btn, searchInputs[i]));

    // 3. Initialize Animations (Intersection Observer)
    const observerOptions = { threshold: 0.1, rootMargin: '0px 0px -50px 0px' };
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-visible');
                observer.unobserve(entry.target); // Only animate once
            }
        });
    }, observerOptions);

    document.querySelectorAll('.card, .section-title, .list-group-item').forEach(el => {
        el.classList.add('fade-in-hidden'); // Add initial hidden state via CSS if needed, or assume opacity 0
        observer.observe(el);
    });

    // 4. Initialize Audio Players (Single play policy)
    document.querySelectorAll('audio').forEach(audio => {
        audio.addEventListener('play', function () {
            document.querySelectorAll('audio').forEach(other => {
                if (other !== audio) other.pause();
            });
        });
    });

    // 5. Check URL for Search Query (if on search page)
    if (window.location.pathname.includes('search.html')) {
        const urlParams = new URLSearchParams(window.location.search);
        const query = urlParams.get('q');
        const input = document.getElementById('searchInput');
        if (query && input) {
            input.value = query;
            renderSearchResults(query);
        }
    }

    // 6. Initialize Daily Verse
    const dailyVerseContainer = document.querySelector('.quran-card p.fs-4');
    const dailyVerseSource = document.querySelector('.quran-card p.text-muted');
    if (dailyVerseContainer && dailyVerseSource) {
        // Simple daily rotation based on date
        const today = new Date().getDate();
        const verseIndex = today % dailyVerses.length;
        const verse = dailyVerses[verseIndex];

        dailyVerseContainer.innerText = `﴿${verse.text}﴾`;
        dailyVerseSource.innerText = verse.surah;
    }

    // 7. Initialize Dark Mode Theme
    initTheme();
});

// --- Theme Management ---

function initTheme() {
    // Only allow dark mode on index.html
    const path = window.location.pathname;
    const isHomePage = path.endsWith('index.html') || path === '/' || path.endsWith('/');
    
    if (!isHomePage) {
        // Enforce light mode on other pages
        document.documentElement.removeAttribute('data-theme');
        return;
    }

    // Check localStorage or System Preference
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
        document.documentElement.setAttribute('data-theme', 'dark');
    }

    // Inject Toggle Button into Navbar
    injectThemeToggle();
}

function injectThemeToggle() {
    const navbarContainer = document.querySelector('.navbar .container');
    const navbarNav = document.querySelector('.navbar-nav');

    // We want to place it before the navbar toggler on mobile, or at the start/end of actions on desktop.
    // Let's create the button element
    const toggleBtn = document.createElement('button');
    toggleBtn.className = 'theme-toggle-btn ms-2'; // ms-2 for margin
    toggleBtn.setAttribute('aria-label', 'Toggle Dark Mode');
    toggleBtn.innerHTML = isDark() ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';

    toggleBtn.addEventListener('click', toggleTheme);

    // Insert logic: Try to insert before the navbar-toggler if it exists (for mobile layout consistency)
    // or append to the container if simpler.
    // Best place: Before the 'navbar-toggler' button if present, otherwise inside container.

    const toggler = document.querySelector('.navbar-toggler');
    if (toggler) {
        // Insert before the hamburger menu on mobile
        toggler.parentNode.insertBefore(toggleBtn, toggler);
    } else if (navbarContainer) {
        navbarContainer.appendChild(toggleBtn);
    }
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);

    // Update button icon
    const icon = document.querySelector('.theme-toggle-btn i');
    if (icon) {
        icon.className = newTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    }

    showToast(newTheme === 'dark' ? 'تم تفعيل الوضع الليلي' : 'تم تفعيل الوضع النهاري', 'info');
}

function isDark() {
    return document.documentElement.getAttribute('data-theme') === 'dark';
}

// --- Service Worker Registration & PWA Installation Manager ---
let deferredPrompt = null;

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        const swPath = './sw.js';
        navigator.serviceWorker.register(swPath)
            .then(reg => {
                console.log('PWA Service Worker registered successfully:', reg.scope);
            })
            .catch(err => {
                navigator.serviceWorker.register('/sw.js').catch(e => {
                    console.warn('PWA Service Worker registration fallback failed:', e);
                });
            });
    });
}

// Check if currently running in standalone mode (installed)
function isPwaStandalone() {
    return window.matchMedia('(display-mode: standalone)').matches ||
           window.navigator.standalone === true ||
           document.referrer.includes('android-app://');
}

// Detect iOS devices
function isIosDevice() {
    return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
}

// PWA Install UI initialization
window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    initPwaInstallUI();
});

window.addEventListener('appinstalled', () => {
    deferredPrompt = null;
    const btn = document.getElementById('pwaInstallBtn');
    if (btn) btn.style.display = 'none';
    const modalEl = document.getElementById('pwaInstallModal');
    if (modalEl && window.bootstrap && bootstrap.Modal) {
        const modal = bootstrap.Modal.getInstance(modalEl);
        if (modal) modal.hide();
    }
    if (typeof showToast === 'function') {
        showToast('تهانينا! تم تثبيت تطبيق الموسوعة الإسلامية على جهازك بنجاح.', 'success');
    }
});

function initPwaInstallUI() {
    if (isPwaStandalone()) return;
    if (document.getElementById('pwaInstallBtn')) return;

    // Create floating install button
    const installBtn = document.createElement('button');
    installBtn.id = 'pwaInstallBtn';
    installBtn.className = 'btn btn-gold shadow-lg pwa-floating-btn';
    installBtn.innerHTML = '<i class="fas fa-arrow-down-to-bracket ms-2"></i><span>تثبيت التطبيق</span>';
    installBtn.setAttribute('title', 'تثبيت تطبيق الموسوعة الإسلامية على جهازك');
    installBtn.style.cssText = `
        position: fixed;
        bottom: 25px;
        left: 25px;
        z-index: 9999;
        display: flex;
        align-items: center;
        gap: 8px;
        background: linear-gradient(135deg, #d4af37, #f9f1d8);
        color: #0b192c;
        border: 2px solid rgba(212,175,55,0.6);
        border-radius: 50px;
        padding: 10px 22px;
        font-weight: 800;
        font-family: 'Cairo', sans-serif;
        font-size: 0.95rem;
        box-shadow: 0 10px 25px rgba(0,0,0,0.4);
        cursor: pointer;
        transition: transform 0.3s ease, box-shadow 0.3s ease;
    `;

    installBtn.addEventListener('mouseenter', () => {
        installBtn.style.transform = 'translateY(-3px) scale(1.03)';
    });
    installBtn.addEventListener('mouseleave', () => {
        installBtn.style.transform = 'translateY(0) scale(1)';
    });

    installBtn.addEventListener('click', () => {
        triggerPwaInstall();
    });

    document.body.appendChild(installBtn);
}

// Fallback for iOS & general setup on DOM ready
document.addEventListener('DOMContentLoaded', () => {
    if (!isPwaStandalone() && isIosDevice()) {
        initPwaInstallUI();
    }
    createPwaInstallModal();
    initMobileBottomNav();
});

function triggerPwaInstall() {
    if (deferredPrompt) {
        deferredPrompt.prompt();
        deferredPrompt.userChoice.then((choiceResult) => {
            if (choiceResult.outcome === 'accepted') {
                console.log('User accepted PWA installation');
                const btn = document.getElementById('pwaInstallBtn');
                if (btn) btn.style.display = 'none';
            }
            deferredPrompt = null;
        });
    } else {
        // Open guidance modal for iOS or manual instructions
        const modalEl = document.getElementById('pwaInstallModal');
        if (modalEl && window.bootstrap && bootstrap.Modal) {
            const modal = bootstrap.Modal.getOrCreateInstance(modalEl);
            modal.show();
        } else if (modalEl) {
            modalEl.classList.add('show');
            modalEl.style.display = 'block';
        }
    }
}

function createPwaInstallModal() {
    if (document.getElementById('pwaInstallModal')) return;

    const modal = document.createElement('div');
    modal.id = 'pwaInstallModal';
    modal.className = 'modal fade';
    modal.setAttribute('tabindex', '-1');
    modal.setAttribute('aria-hidden', 'true');
    modal.innerHTML = `
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content" style="background:#0b192c; color:white; border:1px solid rgba(212,175,55,0.4); border-radius:24px; overflow:hidden;">
                <div class="modal-header border-0 pb-0 justify-content-between">
                    <h5 class="modal-title font-amiri fs-3 text-warning"><i class="fas fa-mobile-screen-button me-2"></i>تثبيت التطبيق على جهازك</h5>
                    <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body p-4 text-center">
                    <img src="icons/icon-192x192.png" alt="App Icon" style="width:72px; height:72px; border-radius:18px; margin-bottom:15px; border:2px solid #d4af37;">
                    <h4 class="font-amiri fw-bold text-white mb-2">الموسوعة الإسلامية الشاملة</h4>
                    <p class="text-secondary small mb-4">ثبّت الموسوعة كتطبيق مباشر على هاتفك أو حاسوبك للوصول السريع والتصفح الأوفلاين بدون إنترنت.</p>
                    
                    <div id="pwaIosGuide" style="${isIosDevice() ? 'display:block;' : 'display:none;'}" class="p-3 rounded-4 mb-3 text-start" style="background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.1);">
                        <div class="d-flex align-items-center mb-2">
                            <span class="badge bg-warning text-dark me-2">1</span>
                            <span>اضغط على أيقونة المشاركة <strong>(Share ⎋)</strong> في أسفل متصفح Safari.</span>
                        </div>
                        <div class="d-flex align-items-center">
                            <span class="badge bg-warning text-dark me-2">2</span>
                            <span>مرر للأسفل واختر <strong>"إضافة إلى الصفحة الرئيسية" ➕</strong>.</span>
                        </div>
                    </div>

                    <div id="pwaGeneralGuide" style="${!isIosDevice() ? 'display:block;' : 'display:none;'}" class="mb-3">
                        <button type="button" class="btn btn-warning w-100 py-3 fw-bold rounded-pill font-cairo" onclick="if(deferredPrompt){triggerPwaInstall();}else{alert('يمكنك تثبيت التطبيق من قائمة المتصفح (⋮) ثم اختيار تثبيت التطبيق');}">
                            <i class="fas fa-download me-2"></i> تثبيت التطبيق الآن
                        </button>
                    </div>

                    <div class="d-flex justify-content-around text-secondary small pt-3 border-top border-secondary">
                        <span><i class="fas fa-bolt text-warning me-1"></i> فائق السرعة</span>
                        <span><i class="fas fa-wifi text-warning me-1"></i> يعمل بدون نت</span>
                        <span><i class="fas fa-bell text-warning me-1"></i> مواقيت وأذكار</span>
                    </div>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
}

// --- Native Mobile Bottom Navigation & Quick Sections Drawer ---
function initMobileBottomNav() {
    if (document.getElementById('islamicBottomNav') || document.getElementById('bottomNav')) return;

    const rawPath = window.location.pathname.split('/').pop().toLowerCase() || 'index.html';
    const currentPath = rawPath.endsWith('.html') ? rawPath : (rawPath === '' ? 'index.html' : rawPath + '.html');

    const isHome = currentPath === 'index.html' || currentPath === '';
    const isQuran = currentPath === 'recitations.html' || currentPath.includes('quran');
    const isHadith = currentPath === 'hadith.html';
    const isFiqh = currentPath.startsWith('fiqh');
    const isMoreActive = !isHome && !isQuran && !isHadith && !isFiqh;

    // Create Bottom Nav Bar
    const nav = document.createElement('nav');
    nav.id = 'islamicBottomNav';
    nav.className = 'islamic-bottom-nav';
    nav.setAttribute('aria-label', 'شريط التنقل السفلي للموبايل');
    nav.innerHTML = `
        <a href="index.html" class="bottom-nav-item ${isHome ? 'active' : ''}">
            <i class="fas fa-house"></i>
            <span>الرئيسية</span>
        </a>
        <a href="recitations.html" class="bottom-nav-item nav-item-highlight ${isQuran ? 'active' : ''}">
            <i class="fas fa-quran"></i>
            <span>القرآن</span>
        </a>
        <a href="hadith.html" class="bottom-nav-item ${isHadith ? 'active' : ''}">
            <i class="fas fa-book-open"></i>
            <span>الحديث</span>
        </a>
        <a href="fiqh.html" class="bottom-nav-item ${isFiqh ? 'active' : ''}">
            <i class="fas fa-scale-balanced"></i>
            <span>الفقه</span>
        </a>
        <button type="button" id="bottomNavMoreBtn" class="bottom-nav-item ${isMoreActive ? 'active' : ''}" aria-label="عرض باقي الأقسام">
            <i class="fas fa-grip"></i>
            <span>الأقسام</span>
        </button>
    `;
    document.body.appendChild(nav);

    // Create Backdrop & More Sheet
    const backdrop = document.createElement('div');
    backdrop.id = 'mobileSheetBackdrop';
    backdrop.className = 'mobile-sheet-backdrop';
    document.body.appendChild(backdrop);

    const sheet = document.createElement('div');
    sheet.id = 'mobileMoreSheet';
    sheet.className = 'mobile-more-sheet';
    sheet.setAttribute('role', 'dialog');
    sheet.setAttribute('aria-modal', 'true');
    sheet.innerHTML = `
        <div class="mobile-sheet-handle"></div>
        <div class="d-flex align-items-center justify-content-between mb-3">
            <h5 class="m-0 font-amiri fw-bold text-warning fs-4"><i class="fas fa-compass me-2"></i>أقسام الموسوعة</h5>
            <button type="button" id="closeMobileSheetBtn" class="btn-close btn-close-white" style="font-size:0.75rem;" aria-label="إغلاق"></button>
        </div>
        
        <form action="search.html" method="GET" class="mb-3">
            <div class="input-group">
                <span class="input-group-text bg-dark border-secondary text-warning"><i class="fas fa-search"></i></span>
                <input type="text" name="q" class="form-control bg-dark text-white border-secondary" placeholder="ابحث في علوم الموسوعة..." style="font-size:0.9rem; box-shadow:none;">
            </div>
        </form>

        <div class="mobile-sheet-grid">
            <a href="fatwa.html" class="mobile-sheet-card ${currentPath.startsWith('fatwa') ? 'border-warning shadow-sm' : ''}">
                <i class="fas fa-gavel"></i>
                <span>فتاوى العلماء</span>
            </a>
            <a href="seerah.html" class="mobile-sheet-card ${currentPath.startsWith('seerah') ? 'border-warning shadow-sm' : ''}">
                <i class="fas fa-route"></i>
                <span>السيرة النبوية</span>
            </a>
            <a href="aqeedah.html" class="mobile-sheet-card ${currentPath.startsWith('aqeedah') ? 'border-warning shadow-sm' : ''}">
                <i class="fas fa-pray"></i>
                <span>العقيدة والتوحيد</span>
            </a>
            <a href="history.html" class="mobile-sheet-card ${currentPath.startsWith('history') ? 'border-warning shadow-sm' : ''}">
                <i class="fas fa-landmark"></i>
                <span>التاريخ الإسلامي</span>
            </a>
            <a href="library.html" class="mobile-sheet-card ${currentPath.startsWith('library') ? 'border-warning shadow-sm' : ''}">
                <i class="fas fa-book-reader"></i>
                <span>المكتبة الشاملة</span>
            </a>
            <a href="usul.html" class="mobile-sheet-card ${currentPath.startsWith('usul') ? 'border-warning shadow-sm' : ''}">
                <i class="fas fa-scroll"></i>
                <span>أصول الفقه</span>
            </a>
            <a href="share.html" class="mobile-sheet-card ${currentPath.startsWith('share') ? 'border-warning shadow-sm' : ''}">
                <i class="fas fa-share-nodes"></i>
                <span>شارك الأجر</span>
            </a>
            <a href="contact.html" class="mobile-sheet-card ${currentPath.startsWith('contact') ? 'border-warning shadow-sm' : ''}">
                <i class="fas fa-envelope"></i>
                <span>اتصل بنا</span>
            </a>
            <a href="register.html" class="mobile-sheet-card ${currentPath.startsWith('register') ? 'border-warning shadow-sm' : ''}">
                <i class="fas fa-user-circle"></i>
                <span>حسابي</span>
            </a>
        </div>

        <div class="d-flex align-items-center justify-content-between mt-4 pt-3 border-top border-secondary border-opacity-25">
            <button type="button" class="btn btn-outline-warning btn-sm rounded-pill font-cairo" onclick="toggleTheme();">
                <i class="fas fa-circle-half-stroke me-1"></i> تبديل المظهر
            </button>
            <button type="button" class="btn btn-warning btn-sm rounded-pill font-cairo fw-bold text-dark" onclick="triggerPwaInstall();">
                <i class="fas fa-download me-1"></i> تثبيت التطبيق
            </button>
        </div>
    `;
    document.body.appendChild(sheet);

    // Event Listeners for drawer
    const moreBtn = document.getElementById('bottomNavMoreBtn');
    const closeBtn = document.getElementById('closeMobileSheetBtn');

    function openSheet() {
        sheet.classList.add('show');
        backdrop.classList.add('show');
        document.body.style.overflow = 'hidden';
    }

    function closeSheet() {
        sheet.classList.remove('show');
        backdrop.classList.remove('show');
        document.body.style.overflow = '';
    }

    if (moreBtn) moreBtn.addEventListener('click', openSheet);
    if (closeBtn) closeBtn.addEventListener('click', closeSheet);
    if (backdrop) backdrop.addEventListener('click', closeSheet);
}



// --- Universal Tab & Scroll Position State Persistence ---
(function () {
    'use strict';

    const pagePath = window.location.pathname.split('/').pop() || 'index.html';
    const tabStorageKey = 'activeTab_' + pagePath;
    const scrollStorageKey = 'scrollPos_' + pagePath;

    function saveTab(tabId) {
        if (!tabId || tabId === '#') return;
        try {
            localStorage.setItem(tabStorageKey, tabId);
        } catch (e) { }
    }

    function activateTab(targetId) {
        if (!targetId || targetId === '#') return false;
        if (!targetId.startsWith('#')) targetId = '#' + targetId;

        const targetPane = document.querySelector(targetId);
        if (!targetPane) return false;

        const cleanId = targetId.replace('#', '');
        const trigger = document.querySelector(
            `[data-bs-target="${targetId}"], [href="${targetId}"], [data-bs-target="#${cleanId}"], [href="#${cleanId}"]`
        );

        if (trigger) {
            if (window.bootstrap && bootstrap.Tab) {
                try {
                    const bsTab = bootstrap.Tab.getOrCreateInstance(trigger);
                    bsTab.show();
                } catch (err) {
                    trigger.click();
                }
            } else {
                trigger.click();
            }
        } else {
            const parent = targetPane.parentElement;
            if (parent) {
                parent.querySelectorAll('.tab-pane').forEach(pane => {
                    pane.classList.remove('show', 'active');
                });
                targetPane.classList.add('show', 'active');
            }
        }

        saveTab(targetId);

        if (history.replaceState) {
            history.replaceState(null, null, targetId);
        }
        return true;
    }

    let scrollTimer;
    window.addEventListener('scroll', function () {
        clearTimeout(scrollTimer);
        scrollTimer = setTimeout(function () {
            try {
                sessionStorage.setItem(scrollStorageKey, window.scrollY.toString());
            } catch (e) { }
        }, 100);
    }, { passive: true });

    document.addEventListener('click', function (e) {
        const tabBtn = e.target.closest('[data-bs-toggle="tab"], [data-bs-toggle="pill"], .nav-link[data-bs-target], .nav-link[href^="#"]');
        if (tabBtn) {
            const targetId = tabBtn.getAttribute('data-bs-target') || tabBtn.getAttribute('href');
            if (targetId && targetId.startsWith('#') && targetId.length > 1) {
                saveTab(targetId);
                if (history.replaceState) {
                    history.replaceState(null, null, targetId);
                }
            }
        }
    });

    document.addEventListener('shown.bs.tab', function (e) {
        const targetId = e.target.getAttribute('data-bs-target') || e.target.getAttribute('href');
        if (targetId) {
            saveTab(targetId);
            if (history.replaceState) {
                history.replaceState(null, null, targetId);
            }
        }
    });

    function restoreState() {
        let savedTab = window.location.hash;
        
        if (!savedTab || savedTab === '#' || !document.querySelector(savedTab)) {
            try {
                savedTab = localStorage.getItem(tabStorageKey);
            } catch (e) { }
        }

        let tabRestored = false;
        if (savedTab && savedTab !== '#' && document.querySelector(savedTab)) {
            tabRestored = activateTab(savedTab);
        }

        try {
            const savedScroll = sessionStorage.getItem(scrollStorageKey);
            if (savedScroll !== null) {
                const y = parseInt(savedScroll, 10);
                if (!isNaN(y) && y > 0) {
                    setTimeout(function () {
                        window.scrollTo({ top: y, behavior: 'instant' });
                    }, 100);
                }
            }
        } catch (e) { }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', restoreState);
    } else {
        restoreState();
    }
})();

// ========================================================
// GLOBAL THEME MANAGER (DARK / LIGHT MODE FOR ALL PAGES)
// ========================================================
(function initGlobalThemeManager() {
    function applyTheme(isDark) {
        if (isDark) {
            document.documentElement.classList.add('dark-mode');
            if (document.body) document.body.classList.add('dark-mode');
            document.documentElement.setAttribute('data-hr-mode', 'dark');
            document.documentElement.setAttribute('data-theme', 'dark');
            var tabSearch = document.getElementById('tab-search');
            if (tabSearch) tabSearch.dataset.hrMode = 'dark';
            var modeDarkBtn = document.getElementById('modeDark');
            if (modeDarkBtn) {
                document.querySelectorAll('.hr-mode-btn').forEach(b => b.classList.remove('active'));
                modeDarkBtn.classList.add('active');
            }
        } else {
            document.documentElement.classList.remove('dark-mode');
            if (document.body) document.body.classList.remove('dark-mode');
            document.documentElement.setAttribute('data-hr-mode', 'light');
            document.documentElement.setAttribute('data-theme', 'light');
            var tabSearch = document.getElementById('tab-search');
            if (tabSearch && tabSearch.dataset.hrMode === 'dark') tabSearch.dataset.hrMode = 'light';
            var modeLightBtn = document.getElementById('modeLight');
            if (modeLightBtn && document.getElementById('modeDark') && document.getElementById('modeDark').classList.contains('active')) {
                document.querySelectorAll('.hr-mode-btn').forEach(b => b.classList.remove('active'));
                modeLightBtn.classList.add('active');
            }
        }

        const buttons = document.querySelectorAll('#themeToggle, .theme-toggle-btn');
        buttons.forEach(btn => {
            btn.innerHTML = isDark ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
            btn.setAttribute('title', isDark ? 'الوضع النهاري' : 'الوضع الليلي');
            btn.setAttribute('aria-label', isDark ? 'الوضع النهاري' : 'الوضع الليلي');
        });
    }

    // Apply immediately to prevent flash
    const savedTheme = localStorage.getItem('theme');
    const isDark = (savedTheme === 'dark');
    applyTheme(isDark);

    function setupThemeToggleButtons() {
        const isCurrentDark = localStorage.getItem('theme') === 'dark';
        applyTheme(isCurrentDark);

        const buttons = document.querySelectorAll('#themeToggle, .theme-toggle-btn');
        buttons.forEach(btn => {
            if (btn.dataset.themeBound === 'true') return;

            // Replace with clone to remove legacy inline or duplicate listeners
            const cleanBtn = btn.cloneNode(true);
            cleanBtn.dataset.themeBound = 'true';
            btn.parentNode.replaceChild(cleanBtn, btn);

            cleanBtn.addEventListener('click', function (e) {
                e.preventDefault();
                const willBeDark = !document.body.classList.contains('dark-mode');
                localStorage.setItem('theme', willBeDark ? 'dark' : 'light');
                applyTheme(willBeDark);
            });
        });
    }

    // Listen across multi-tab changes
    window.addEventListener('storage', function(e) {
        if (e.key === 'theme') {
            applyTheme(e.newValue === 'dark');
        }
    });

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', setupThemeToggleButtons);
    } else {
        setupThemeToggleButtons();
    }
})();





// =========================================================
// GLOBAL PERSISTENT AUDIO MINI-PLAYER (Idea #2)
// Native App-like Experience with Glassmorphism & MediaSession
// =========================================================
(function() {
    const SURAH_NAMES = [
        "الفاتحة","البقرة","آل عمران","النساء","المائدة","الأنعام","الأعراف","الأنفال","التوبة","يونس",
        "هود","يوسف","الرعد","إبراهيم","الحجر","النحل","الإسراء","الكهف","مريم","طه",
        "الأنبياء","الحج","المؤمنون","النور","الفرقان","الشعراء","النمل","القصص","العنكبوت","الروم",
        "لقمان","السجدة","الأحزاب","سبأ","فاطر","يس","الصافات","ص","الزمر","غافر",
        "فصلت","الشورى","الزخرف","الدخان","الجاثية","الأحقاف","محمد","الفتح","الحجرات","ق",
        "الذاريات","الطور","النجم","القمر","الرحمن","الواقعة","الحديد","المجادلة","الحشر","الممتحنة",
        "الصف","الجمعة","المنافقون","التغابن","الطلاق","التحريم","الملك","القلم","الحاقة","المعارج",
        "نوح","الجن","المزمل","المدثر","القيامة","الإنسان","المرسلات","النبأ","النازعات","عبس",
        "التكوير","الانفطار","المطففين","الانشقاق","البروج","الطارق","الأعلى","الغاشية","الفجر","البلد",
        "الشمس","الليل","الضحى","الشرح","التين","العلق","القدر","البينة","الزلزلة","العاديات",
        "القارعة","التكاثر","العصر","الهمزة","الفيل","قريش","الماعون","الكوثر","الكافرون","النصر",
        "المسد","الإخلاص","الفلق","الناس"
    ];

    let playerState = {
        id: 1,
        name: "الفاتحة",
        serverUrl: "https://server8.mp3quran.net/afs/",
        reciterName: "مشاري العفاسي",
        time: 0,
        active: false,
        isPlaying: false
    };

    function loadSavedState() {
        try {
            const raw = localStorage.getItem('islamic_player_state');
            if (raw) {
                const parsed = JSON.parse(raw);
                if (parsed && typeof parsed === 'object') {
                    playerState = Object.assign(playerState, parsed);
                }
            }
        } catch(e) {}
    }

    function saveState() {
        try {
            localStorage.setItem('islamic_player_state', JSON.stringify(playerState));
        } catch(e) {}
    }

    function formatTime(secs) {
        if (!secs || isNaN(secs)) return '00:00';
        const m = Math.floor(secs / 60);
        const s = Math.floor(secs % 60);
        return (m < 10 ? '0' : '') + m + ':' + (s < 10 ? '0' : '') + s;
    }

    function ensurePlayerMarkup() {
        let el = document.getElementById('globalPlayer');
        if (el) return el;

        el = document.createElement('div');
        el.id = 'globalPlayer';
        el.className = 'global-player';
        el.setAttribute('role', 'region');
        el.setAttribute('aria-label', 'مشغل القرآن الصوتي العائم');
        el.innerHTML = `
            <div class="container-fluid px-lg-4 px-2 h-100">
                <div class="gp-inner">
                    <div class="gp-disc" id="playerDisc" title="الانتقال لصفحة التلاوات" style="cursor:pointer;" onclick="location.href='recitations.html'">
                        <i class="fas fa-compact-disc"></i>
                    </div>
                    <div class="gp-info" style="cursor:pointer;" onclick="location.href='recitations.html'">
                        <div class="d-flex align-items-center gap-2">
                            <div class="gp-title" id="playerTitle">سورة ${playerState.name}</div>
                            <div class="gp-wave" id="playerWave" aria-hidden="true">
                                <span></span><span></span><span></span><span></span><span></span>
                            </div>
                        </div>
                        <div class="gp-reciter" id="playerReciter">${playerState.reciterName}</div>
                    </div>
                    <div class="gp-progress-row">
                        <span class="gp-time" id="audioCurrentTime">00:00</span>
                        <input type="range" class="gp-range" id="audioProgress" value="0" min="0" max="100" step="0.1" aria-label="شريط تقدم التلاوة">
                        <span class="gp-time" id="audioDuration">00:00</span>
                    </div>
                    <div class="gp-controls">
                        <button type="button" class="gp-btn" onclick="window.globalPlayerNextPrev(-1)" title="السورة السابقة" aria-label="السورة السابقة">
                            <i class="fas fa-step-forward"></i>
                        </button>
                        <button type="button" class="gp-btn gp-btn-play" onclick="window.globalPlayerToggle()" id="playPauseBtn" title="تشغيل / إيقاف مؤقت" aria-label="تشغيل أو إيقاف مؤقت">
                            <i class="fas fa-play"></i>
                        </button>
                        <button type="button" class="gp-btn" onclick="window.globalPlayerNextPrev(1)" title="السورة التالية" aria-label="السورة التالية">
                            <i class="fas fa-step-backward"></i>
                        </button>
                    </div>
                    <a id="downloadAudioBtn" href="#" download class="gp-download" title="تحميل التلاوة MP3">
                        <i class="fas fa-arrow-down-to-bracket"></i>
                        <span>تحميل</span>
                    </a>
                    <button type="button" class="gp-btn gp-btn-close" onclick="window.globalPlayerClose()" title="إغلاق المشغل" aria-label="إغلاق المشغل">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="gp-mobile-progress">
                    <span class="gp-time" id="audioCurrentTimeMobile">00:00</span>
                    <input type="range" class="gp-range" id="audioProgressMobile" value="0" min="0" max="100" step="0.1" aria-label="شريط تقدم التلاوة للموبايل">
                    <span class="gp-time" id="audioDurationMobile">00:00</span>
                </div>
            </div>
            <audio id="quranAudio" preload="auto" class="d-none"></audio>
        `;
        document.body.appendChild(el);
        return el;
    }

    function setupMediaSession(name, reciter) {
        if (!('mediaSession' in navigator)) return;
        try {
            navigator.mediaSession.metadata = new MediaMetadata({
                title: 'سورة ' + name,
                artist: reciter || playerState.reciterName,
                album: 'الموسوعة الإسلامية الشاملة',
                artwork: [
                    { src: 'icons/icon-192x192.png', sizes: '192x192', type: 'image/png' },
                    { src: 'icons/icon-512x512.png', sizes: '512x512', type: 'image/png' }
                ]
            });
            navigator.mediaSession.setActionHandler('play', () => window.globalPlayerToggle());
            navigator.mediaSession.setActionHandler('pause', () => window.globalPlayerToggle());
            navigator.mediaSession.setActionHandler('previoustrack', () => window.globalPlayerNextPrev(-1));
            navigator.mediaSession.setActionHandler('nexttrack', () => window.globalPlayerNextPrev(1));
        } catch(e) {}
    }

    let saveTimer = null;
    function bindAudioEvents(audio, playerEl) {
        if (audio.dataset.eventsBound === 'true') return;
        audio.dataset.eventsBound = 'true';

        const pProg = document.getElementById('audioProgress');
        const pProgMob = document.getElementById('audioProgressMobile');
        const pTime = document.getElementById('audioCurrentTime');
        const pTimeMob = document.getElementById('audioCurrentTimeMobile');
        const pDur = document.getElementById('audioDuration');
        const pDurMob = document.getElementById('audioDurationMobile');
        const pBtn = document.getElementById('playPauseBtn');
        const pDisc = document.getElementById('playerDisc');
        const pWave = document.getElementById('playerWave');

        audio.addEventListener('timeupdate', () => {
            if (audio.duration) {
                const pct = (audio.currentTime / audio.duration) * 100;
                if (pProg) pProg.value = pct;
                if (pProgMob) pProgMob.value = pct;
                playerEl.style.setProperty('--player-progress', pct + '%');
                const tStr = formatTime(audio.currentTime);
                if (pTime) pTime.innerText = tStr;
                if (pTimeMob) pTimeMob.innerText = tStr;

                playerState.time = audio.currentTime;
                if (!saveTimer) {
                    saveTimer = setTimeout(() => {
                        saveState();
                        saveTimer = null;
                    }, 2500);
                }
            }
        });

        audio.addEventListener('loadedmetadata', () => {
            const dStr = formatTime(audio.duration);
            if (pDur) pDur.innerText = dStr;
            if (pDurMob) pDurMob.innerText = dStr;
        });

        audio.addEventListener('play', () => {
            playerState.isPlaying = true;
            saveState();
            if (pBtn) pBtn.innerHTML = '<i class="fas fa-pause"></i>';
            if (pDisc) pDisc.classList.add('spinning');
            if (pWave) pWave.classList.add('playing');
        });

        audio.addEventListener('pause', () => {
            playerState.isPlaying = false;
            saveState();
            if (pBtn) pBtn.innerHTML = '<i class="fas fa-play"></i>';
            if (pDisc) pDisc.classList.remove('spinning');
            if (pWave) pWave.classList.remove('playing');
        });

        audio.addEventListener('ended', () => {
            window.globalPlayerNextPrev(1);
        });

        function doSeek(val) {
            if (audio.duration) {
                audio.currentTime = (val / 100) * audio.duration;
            }
        }
        if (pProg) pProg.addEventListener('input', e => doSeek(e.target.value));
        if (pProgMob) pProgMob.addEventListener('input', e => doSeek(e.target.value));
    }

    window.playGlobalAudio = function(id, name, serverUrl, reciterName, startTime, autoPlay = true) {
        loadSavedState();
        playerState.id = id;
        playerState.name = name || SURAH_NAMES[id - 1] || ("سورة " + id);
        playerState.serverUrl = serverUrl || playerState.serverUrl || "https://server8.mp3quran.net/afs/";
        playerState.reciterName = reciterName || playerState.reciterName || "مشاري العفاسي";
        playerState.active = true;

        const playerEl = ensurePlayerMarkup();
        const audio = document.getElementById('quranAudio');
        if (!audio) return;

        bindAudioEvents(audio, playerEl);

        const titleEl = document.getElementById('playerTitle');
        const reciterEl = document.getElementById('playerReciter');
        const dlBtn = document.getElementById('downloadAudioBtn');

        if (titleEl) titleEl.innerText = 'سورة ' + playerState.name;
        if (reciterEl) reciterEl.innerText = playerState.reciterName;

        const numStr = String(id).padStart(3, '0');
        const fileUrl = playerState.serverUrl + numStr + '.mp3';

        if (dlBtn) dlBtn.href = fileUrl;

        playerEl.classList.add('active');
        document.body.classList.add('player-active');

        // Only reload src if changed
        if (!audio.src || !audio.src.includes(numStr + '.mp3') || audio.src !== fileUrl) {
            audio.src = fileUrl;
            if (startTime) {
                audio.currentTime = startTime;
            }
        }

        if (autoPlay) {
            audio.play().catch(e => console.log('Autoplay deferred:', e));
        }

        setupMediaSession(playerState.name, playerState.reciterName);
        saveState();
    };

    window.globalPlayerToggle = function() {
        const audio = document.getElementById('quranAudio');
        if (!audio) return;
        if (audio.paused) {
            audio.play().catch(e => console.log(e));
        } else {
            audio.pause();
        }
    };

    window.globalPlayerNextPrev = function(direction) {
        let nextId = playerState.id + direction;
        if (nextId > 114) nextId = 1;
        if (nextId < 1) nextId = 114;
        const name = SURAH_NAMES[nextId - 1] || ("سورة " + nextId);
        window.playGlobalAudio(nextId, name, playerState.serverUrl, playerState.reciterName, 0, true);
    };

    window.globalPlayerClose = function() {
        const playerEl = document.getElementById('globalPlayer');
        const audio = document.getElementById('quranAudio');
        if (audio) audio.pause();
        if (playerEl) playerEl.classList.remove('active');
        document.body.classList.remove('player-active');
        playerState.active = false;
        playerState.isPlaying = false;
        saveState();
    };

    // Forward playMegaAudio to playGlobalAudio for universal compatibility
    window.playMegaAudio = window.playGlobalAudio;

    function initPlayerOnReady() {
        loadSavedState();
        if (playerState.active) {
            const playerEl = ensurePlayerMarkup();
            const audio = document.getElementById('quranAudio');
            if (audio) {
                bindAudioEvents(audio, playerEl);
                const titleEl = document.getElementById('playerTitle');
                const reciterEl = document.getElementById('playerReciter');
                const dlBtn = document.getElementById('downloadAudioBtn');

                if (titleEl) titleEl.innerText = 'سورة ' + playerState.name;
                if (reciterEl) reciterEl.innerText = playerState.reciterName;

                const numStr = String(playerState.id).padStart(3, '0');
                const fileUrl = playerState.serverUrl + numStr + '.mp3';
                if (dlBtn) dlBtn.href = fileUrl;

                audio.src = fileUrl;
                if (playerState.time) {
                    audio.currentTime = playerState.time;
                }

                playerEl.classList.add('active');
                document.body.classList.add('player-active');
                setupMediaSession(playerState.name, playerState.reciterName);
            }
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initPlayerOnReady);
    } else {
        initPlayerOnReady();
    }
})();
