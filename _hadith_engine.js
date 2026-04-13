/**
 * _hadith_engine.js — محرك الأحاديث الذكي الشامل
 * ════════════════════════════════════════════════════════════════
 * المصدر: fawazahmed0/hadith-api via jsDelivr CDN (مفتوح المصدر)
 * يوفر: ~35,000+ حديث من 8 مصادر رئيسية
 * التخزين: IndexedDB (دائم، بدون إنترنت بعد التحميل الأول)
 * ════════════════════════════════════════════════════════════════
 */

(function() {
  'use strict';

  var DB_NAME    = 'IslamicEncyclopedia_Hadiths';
  var DB_VERSION = 2;
  var STORE_NAME = 'hadiths';
  var META_STORE = 'meta';

  // ── مصادر الأحاديث (CDN مجاني، مفتوح المصدر) ──
  var COLLECTIONS = [
    { key: 'bukhari',   label: 'صحيح البخاري',      bookKey: 'bukhari',   url: 'https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1/editions/ara-bukhari.min.json',   scholar: 'البخاري',   grade: 'صحيح' },
    { key: 'muslim',    label: 'صحيح مسلم',          bookKey: 'muslim',    url: 'https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1/editions/ara-muslim.min.json',    scholar: 'مسلم',      grade: 'صحيح' },
    { key: 'abudawud',  label: 'سنن أبي داود',       bookKey: 'abudawud',  url: 'https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1/editions/ara-abudawud.min.json',  scholar: 'أبو داود',  grade: 'صحيح وحسن' },
    { key: 'tirmidhi',  label: 'سنن الترمذي',        bookKey: 'tirmidhi',  url: 'https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1/editions/ara-tirmizi.min.json',   scholar: 'الترمذي',  grade: 'صحيح وحسن' },
    { key: 'nasai',     label: 'سنن النسائي',        bookKey: 'nasai',     url: 'https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1/editions/ara-nasai.min.json',     scholar: 'النسائي',   grade: 'صحيح والحسن' },
    { key: 'ibnmajah',  label: 'سنن ابن ماجه',      bookKey: 'ibnmajah',  url: 'https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1/editions/ara-ibnmajah.min.json',  scholar: 'ابن ماجه', grade: 'صحيح وحسن' },
    { key: 'malik',     label: 'موطأ مالك',          bookKey: 'all',       url: 'https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1/editions/ara-malik.min.json',     scholar: 'الإمام مالك', grade: 'صحيح' },
    { key: 'nawawi40',  label: 'الأربعون النووية',   bookKey: 'all',       url: 'https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1/editions/ara-nawawi40.min.json',  scholar: 'النووي',   grade: 'صحيح' },
  ];

  // ════════════════════════════════════════════
  // IndexedDB  Helpers
  // ════════════════════════════════════════════
  function openDB() {
    return new Promise(function(resolve, reject) {
      var req = indexedDB.open(DB_NAME, DB_VERSION);
      req.onupgradeneeded = function(e) {
        var db = e.target.result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          var store = db.createObjectStore(STORE_NAME, { keyPath: 'id', autoIncrement: true });
          store.createIndex('bookKey', 'bookKey', { unique: false });
          store.createIndex('grade',   'grade',   { unique: false });
        }
        if (!db.objectStoreNames.contains(META_STORE)) {
          db.createObjectStore(META_STORE, { keyPath: 'key' });
        }
      };
      req.onsuccess = function(e) { resolve(e.target.result); };
      req.onerror   = function(e) { reject(e.target.error); };
    });
  }

  function countRecords(db) {
    return new Promise(function(resolve) {
      var tx = db.transaction(STORE_NAME, 'readonly');
      var req = tx.objectStore(STORE_NAME).count();
      req.onsuccess = function() { resolve(req.result); };
      req.onerror   = function() { resolve(0); };
    });
  }

  function getMeta(db, key) {
    return new Promise(function(resolve) {
      var tx = db.transaction(META_STORE, 'readonly');
      var req = tx.objectStore(META_STORE).get(key);
      req.onsuccess = function() { resolve(req.result ? req.result.value : null); };
      req.onerror   = function() { resolve(null); };
    });
  }

  function setMeta(db, key, value) {
    return new Promise(function(resolve) {
      var tx = db.transaction(META_STORE, 'readwrite');
      tx.objectStore(META_STORE).put({ key: key, value: value });
      tx.oncomplete = function() { resolve(); };
    });
  }

  function bulkInsert(db, records) {
    return new Promise(function(resolve, reject) {
      var tx   = db.transaction(STORE_NAME, 'readwrite');
      var store = tx.objectStore(STORE_NAME);
      var i = 0;
      function next() {
        if (i >= records.length) return;
        store.add(records[i++]);
        if (i % 500 === 0) {
          setTimeout(next, 0); // yield to browser
        } else {
          next();
        }
      }
      next();
      tx.oncomplete = function() { resolve(); };
      tx.onerror    = function(e) { reject(e.target.error); };
    });
  }

  // Full-text search in IndexedDB (iterates cursor)
  function searchDB(db, query, type, limit) {
    limit = limit || 100;
    return new Promise(function(resolve) {
      var results = [];
      var lq = query;
      var tx    = db.transaction(STORE_NAME, 'readonly');
      var store = tx.objectStore(STORE_NAME);
      var req   = store.openCursor();

      req.onsuccess = function(e) {
        var cursor = e.target.result;
        if (!cursor || results.length >= limit) {
          resolve(results);
          return;
        }
        var h = cursor.value;
        var match = false;
        if (type === 'narrator') {
          match = (h.narrator || '').includes(lq);
        } else if (type === 'book') {
          match = (h.book || '').includes(lq) || (h.bookKey || '').includes(lq);
        } else {
          match = (h.text     || '').includes(lq) ||
                  (h.narrator || '').includes(lq);
        }
        if (match) results.push(h);
        cursor.continue();
      };
      req.onerror = function() { resolve(results); };
    });
  }

  // ════════════════════════════════════════════
  // Downloader
  // ════════════════════════════════════════════
  async function downloadCollection(col) {
    var resp = await fetch(col.url);
    if (!resp.ok) throw new Error('HTTP ' + resp.status);
    var data = await resp.json();
    var rawList = data.hadiths || data.data || [];
    return rawList.map(function(h) {
      return {
        bookKey:  col.bookKey,
        book:     col.label,
        scholar:  col.scholar,
        grade:    h.grade_en || col.grade,
        narrator: h.narrator_ar || h.narrator || '',
        text:     h.text || h.body || h.hadith || '',
        number:   h.hadithnumber || h.number || 0,
      };
    }).filter(function(h) { return h.text && h.text.length > 10; });
  }

  // ════════════════════════════════════════════
  // UI Progress
  // ════════════════════════════════════════════
  function showProgress(msg, pct) {
    var bar = document.getElementById('heProgressBar');
    var lbl = document.getElementById('heProgressLabel');
    var cnt = document.getElementById('heProgressCount');
    if (bar) { bar.style.width = (pct || 0) + '%'; bar.setAttribute('aria-valuenow', pct || 0); }
    if (lbl) lbl.textContent = msg || '';
    if (cnt) cnt.textContent = pct ? Math.round(pct) + '%' : '';
  }

  function showStatus(msg, type) {
    var el = document.getElementById('heStatusMsg');
    if (el) {
      el.textContent = msg;
      el.className = 'he-status he-status-' + (type || 'info');
      el.style.display = 'block';
    }
    updateCountDisplay();
  }

  function updateCountDisplay() {
    var el = document.getElementById('heHadithCount');
    if (!el) return;
    openDB().then(function(db) {
      countRecords(db).then(function(n) {
        el.textContent = n ? n.toLocaleString('ar-EG') + ' حديث' : '';
      });
    });
  }

  function renderCollectionStatus(col, status, count) {
    var el = document.getElementById('heCol-' + col.key);
    if (!el) return;
    if (status === 'loading') {
      el.innerHTML = '<span class="he-col-spinner"></span> ' + col.label + ' …';
      el.className = 'he-col-item loading';
    } else if (status === 'done') {
      el.innerHTML = '<i class="fas fa-check-circle" style="color:#10b981;"></i> ' + col.label + ' <span class="he-col-count">(' + (count||0).toLocaleString('ar-EG') + ')</span>';
      el.className = 'he-col-item done';
    } else if (status === 'error') {
      el.innerHTML = '<i class="fas fa-times-circle" style="color:#ef4444;"></i> ' + col.label + ' <span class="he-col-count">(تعذّر التحميل)</span>';
      el.className = 'he-col-item error';
    } else {
      el.innerHTML = '<i class="fas fa-circle" style="color:#cbd5e1;"></i> ' + col.label;
      el.className = 'he-col-item pending';
    }
  }

  // ════════════════════════════════════════════
  // Main Init
  // ════════════════════════════════════════════
  window.HadithEngine = {

    db: null,
    ready: false,
    totalCount: 0,

    async init() {
      var db = await openDB();
      this.db = db;
      var total = await countRecords(db);
      this.totalCount = total;

      // Mark all cols as pending
      COLLECTIONS.forEach(function(col) { renderCollectionStatus(col, 'pending'); });

      if (total > 1000) {
        // Already loaded
        this.ready = true;
        showStatus('قاعدة البيانات جاهزة — ' + total.toLocaleString('ar-EG') + ' حديث نبوي محفوظ على جهازك ✓', 'success');
        updateCountDisplay();
        // Check if new collections need downloading
        this._checkForNewCollections(db);
        return;
      }

      // Fresh download
      showStatus('جارٍ تحميل قاعدة الأحاديث الشاملة لأول مرة... (مرة واحدة فقط)', 'loading');
      showProgress('التحضير…', 0);

      var totalRecords = 0;
      for (var i = 0; i < COLLECTIONS.length; i++) {
        var col = COLLECTIONS[i];
        renderCollectionStatus(col, 'loading');
        try {
          showProgress('تحميل ' + col.label + '…', Math.round((i / COLLECTIONS.length) * 90));
          var records = await downloadCollection(col);
          await bulkInsert(db, records);
          await setMeta(db, 'loaded_' + col.key, true);
          totalRecords += records.length;
          renderCollectionStatus(col, 'done', records.length);
        } catch(e) {
          renderCollectionStatus(col, 'error');
          console.warn('[HadithEngine] Failed to load', col.key, e);
        }
      }

      this.totalCount = await countRecords(db);
      this.ready = true;
      showProgress('اكتمل!', 100);
      showStatus('✅ تم تحميل ' + this.totalCount.toLocaleString('ar-EG') + ' حديث نبوي وحفظها على جهازك', 'success');
      updateCountDisplay();
    },

    async _checkForNewCollections(db) {
      for (var i = 0; i < COLLECTIONS.length; i++) {
        var col = COLLECTIONS[i];
        var loaded = await getMeta(db, 'loaded_' + col.key);
        if (loaded) {
          renderCollectionStatus(col, 'done');
        } else {
          // Download missing collection in background
          renderCollectionStatus(col, 'loading');
          try {
            var records = await downloadCollection(col);
            await bulkInsert(db, records);
            await setMeta(db, 'loaded_' + col.key, true);
            renderCollectionStatus(col, 'done', records.length);
            this.totalCount = await countRecords(db);
            updateCountDisplay();
          } catch(e) {
            renderCollectionStatus(col, 'error');
          }
        }
      }
    },

    // ── Public search method ──
    async search(query, type, limit) {
      if (!this.db) this.db = await openDB();
      var count = await countRecords(this.db);
      if (count < 100) return []; // DB not ready, let JSONP handle it
      return searchDB(this.db, query, type || 'text', limit || 150);
    },

    // ── Clear & re-download ──
    async reset() {
      if (!this.db) return;
      var tx = this.db.transaction([STORE_NAME, META_STORE], 'readwrite');
      tx.objectStore(STORE_NAME).clear();
      tx.objectStore(META_STORE).clear();
      this.ready = false;
      this.totalCount = 0;
      updateCountDisplay();
      await this.init();
    },

    getCollections: function() { return COLLECTIONS; }
  };

  // Auto-init when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() { window.HadithEngine.init(); });
  } else {
    window.HadithEngine.init();
  }

})();
