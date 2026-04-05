// Islamic Encyclopedia - Main JavaScript File

// --- Configuration & Data ---

// Static Content Index for Client-Side Search
const searchIndex = [
    {
        title: "سورة البقرة",
        type: "quran",
        category: "القرآن الكريم",
        desc: "سورة مدنية، هي أطول سورة في القرآن الكريم، تحتوي على أعظم آية في كتاب الله (آية الكرسي).",
        url: "quran.html",
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

