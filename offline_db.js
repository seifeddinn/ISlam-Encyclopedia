// ================================================================
// الباحث الحديثي — Offline Cloud-Sync Engine (IndexedDB)
// ================================================================

window.OfflineEngine = (function() {
    const DB_NAME = 'IslamicEncyclopedia_HadithDB';
    const DB_VERSION = 1;
    const STORE_NAME = 'offline_books';
    let db = null;

    // Books supported by the cloud CDN (fawazahmed0 API)
    const SUPPORTED_BOOKS = {
        'bukhari':   { title: 'صحيح البخاري', size: '2.5MB', endpoint: 'ara-bukhari.min.json' },
        'muslim':    { title: 'صحيح مسلم', size: '2.2MB', endpoint: 'ara-muslim.min.json' },
        'abudawud':  { title: 'سنن أبي داود', size: '1.4MB', endpoint: 'ara-abudawud.min.json' },
        'tirmidhi':  { title: 'جامع الترمذي', size: '1.1MB', endpoint: 'ara-tirmidhi.min.json' },
        'nasai':     { title: 'سنن النسائي', size: '1.6MB', endpoint: 'ara-nasai.min.json' },
        'ibnmajah':  { title: 'سنن ابن ماجه', size: '1.2MB', endpoint: 'ara-ibnmajah.min.json' },
        'malik':     { title: 'موطأ مالك', size: '0.6MB', endpoint: 'ara-malik.min.json' },
        'ahmed':     { title: 'مسند أحمد', size: '4.5MB', endpoint: 'ara-musnadahmad.min.json' },
        'darimi':    { title: 'سنن الدارمي', size: '0.8MB', endpoint: 'ara-darimi.min.json' }
    };

    // Initialize IndexedDB
    function initDB() {
        return new Promise((resolve, reject) => {
            if (db) return resolve(db);
            const request = indexedDB.open(DB_NAME, DB_VERSION);
            request.onerror = e => reject('IndexedDB Error: ' + e.target.errorCode);
            request.onsuccess = e => { db = e.target.result; resolve(db); };
            request.onupgradeneeded = e => {
                const dbInstance = e.target.result;
                if (!dbInstance.objectStoreNames.contains(STORE_NAME)) {
                    dbInstance.createObjectStore(STORE_NAME, { keyPath: 'bookKey' });
                }
            };
        });
    }

    // Check which books are already downloaded
    async function getDownloadedBooks() {
        await initDB();
        return new Promise((resolve, reject) => {
            const tx = db.transaction(STORE_NAME, 'readonly');
            const store = tx.objectStore(STORE_NAME);
            const req = store.getAllKeys();
            req.onsuccess = () => resolve(req.result || []);
            req.onerror = () => reject(req.error);
        });
    }

    // Delete a downloaded book
    async function deleteBook(bookKey) {
        await initDB();
        return new Promise((resolve, reject) => {
            const tx = db.transaction(STORE_NAME, 'readwrite');
            const store = tx.objectStore(STORE_NAME);
            const req = store.delete(bookKey);
            req.onsuccess = () => resolve(true);
            req.onerror = () => reject(req.error);
        });
    }

    // Download and Save to IndexedDB
    async function downloadBook(bookKey, onProgress) {
        await initDB();
        const bookInfo = SUPPORTED_BOOKS[bookKey];
        if (!bookInfo) throw new Error("الكتاب غير مدعوم");
        
        try {
            if (onProgress) onProgress('جاري الاتصال بالسحابة...');
            
            // Note: fawazahmed0 json files
            const url = `https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1/editions/${bookInfo.endpoint}`;
            const res = await fetch(url);
            if (!res.ok) throw new Error("تعذر جلب البيانات");
            
            if (onProgress) onProgress('جاري معالجة البيانات...');
            const json = await res.json();
            
            // Format data into unified structure
            const arr = (json.hadiths || []).map(h => {
                let primaryGrade = "غير محدد";
                let primaryScholar = "—";
                
                // For Bukhari & Muslim they are Sahih naturally
                if (bookKey === 'bukhari' || bookKey === 'muslim') {
                    primaryGrade = "صحيح";
                    primaryScholar = bookKey === 'bukhari' ? "البخاري" : "مسلم";
                } else if (h.grades && h.grades.length > 0) {
                    primaryGrade = h.grades[0].grade;
                    primaryScholar = h.grades[0].name;
                }

                return {
                    text: h.text,
                    book: bookInfo.title,
                    bookKey: bookKey,
                    grade: primaryGrade,
                    scholar: primaryScholar,
                    narrator: "عن الراوي من السند", // Text contains full isnad in structural APIs
                    source: `${bookInfo.title} (رقم: ${h.hadithnumber})`
                };
            });

            // Save array to DB
            return new Promise((resolve, reject) => {
                if (onProgress) onProgress('جاري الحفظ في الذاكرة المحلية (Offline)...');
                const tx = db.transaction(STORE_NAME, 'readwrite');
                const store = tx.objectStore(STORE_NAME);
                const req = store.put({ bookKey: bookKey, timestamp: Date.now(), title: bookInfo.title, data: arr });
                
                req.onsuccess = () => resolve(true);
                req.onerror = () => reject(req.error);
            });
            
        } catch (e) {
            console.error(e);
            throw e;
        }
    }

    // Ultra-fast Offline Search Engine
    async function searchOffline(query, activeBooks) {
        await initDB();
        return new Promise((resolve, reject) => {
            const tx = db.transaction(STORE_NAME, 'readonly');
            const store = tx.objectStore(STORE_NAME);
            const req = store.getAll(); // fetch all allowed books sequentially is fast locally
            
            req.onsuccess = () => {
                const results = [];
                const q = query.trim();
                
                (req.result || []).forEach(record => {
                    // Filter by selected books, if "all" just search all downloaded books
                    if (activeBooks && activeBooks.length > 0 && activeBooks[0] !== 'all') {
                        if (!activeBooks.includes(record.bookKey)) return;
                    }
                    
                    // Native inner-loop filtering
                    for(let i=0; i<record.data.length; i++) {
                        const h = record.data[i];
                        if (h.text.includes(q)) {
                            results.push(h);
                        }
                    }
                });
                resolve({ data: results, source: 'المكتبة المدمجة (Offline IndexedDB)' });
            };
            req.onerror = () => reject(req.error);
        });
    }

    // Wipe specific or entire DB
    async function clearLibrary() {
        await initDB();
        return new Promise((resolve, reject) => {
            const tx = db.transaction(STORE_NAME, 'readwrite');
            const store = tx.objectStore(STORE_NAME);
            const req = store.clear();
            req.onsuccess = () => resolve(true);
            req.onerror = () => reject(req.error);
        });
    }

    return {
        DB_NAME,
        SUPPORTED_BOOKS,
        initDB,
        getDownloadedBooks,
        downloadBook,
        deleteBook,
        searchOffline,
        clearLibrary
    };
})();
