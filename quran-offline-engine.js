/**
 * quran-offline-engine.js — محرك القراءة والتخزين السحابي للمصحف الشريف أوفلاين
 * يدعم التخزين الدائم في المتصفح بتقنية IndexedDB لجميع سور القرآن الـ 114
 * مع توفير 43 سورة مدمجة ذاتياً بدون أي تنزيل.
 */

window.QuranOfflineEngine = (function () {
  'use strict';

  const DB_NAME = 'IslamicEncyclopedia_FullQuranDB';
  const DB_VERSION = 1;
  const STORE_NAME = 'surahs_store';
  let db = null;

  function initDB() {
    return new Promise((resolve, reject) => {
      if (db) return resolve(db);
      const req = indexedDB.open(DB_NAME, DB_VERSION);
      req.onerror = e => reject('IndexedDB error: ' + e.target.errorCode);
      req.onsuccess = e => {
        db = e.target.result;
        resolve(db);
      };
      req.onupgradeneeded = e => {
        const d = e.target.result;
        if (!d.objectStoreNames.contains(STORE_NAME)) {
          d.createObjectStore(STORE_NAME, { keyPath: 'number' });
        }
      };
    });
  }

  // التحقق من حالة تحميل المصحف الكامل (114 سورة)
  async function isFullQuranDownloaded() {
    try {
      await initDB();
      return new Promise((resolve) => {
        const tx = db.transaction(STORE_NAME, 'readonly');
        const store = tx.objectStore(STORE_NAME);
        const req = store.count();
        req.onsuccess = () => resolve(req.result >= 114);
        req.onerror = () => resolve(false);
      });
    } catch (e) {
      return false;
    }
  }

  // تنزيل وحفظ المصحف كاملاً مع التفسير الميسر في IndexedDB
  async function downloadFullQuran(onProgress) {
    await initDB();

    if (onProgress) onProgress(10, 'جاري الاتصال بالسحابة القرآنية...');

    const [qRes, tRes] = await Promise.all([
      fetch('https://api.alquran.cloud/v1/quran/quran-uthmani').then(r => {
        if (!r.ok) throw new Error('تعذر تحميل نص القرآن الكريم');
        return r.json();
      }),
      fetch('https://api.alquran.cloud/v1/quran/ar.muyassar').then(r => {
        if (!r.ok) throw new Error('تعذر تحميل التفسير الميسر');
        return r.json();
      })
    ]);

    if (onProgress) onProgress(50, 'جاري معالجة ودمج آيات السور الـ 114 مع التفسير...');

    const qSurahs = qRes.data.surahs;
    const tSurahs = tRes.data.surahs;

    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);

      qSurahs.forEach((sQ, sIdx) => {
        const sT = tSurahs[sIdx];
        const ayahs = sQ.ayahs.map((a, aIdx) => ({
          numberInSurah: a.numberInSurah,
          text: a.text,
          tafsir: (sT && sT.ayahs && sT.ayahs[aIdx]) ? sT.ayahs[aIdx].text : ''
        }));

        store.put({
          number: sQ.number,
          name: sQ.name,
          englishName: sQ.englishName,
          revelationType: sQ.revelationType,
          numberOfAyahs: sQ.numberOfAyahs,
          ayahs: ayahs
        });
      });

      tx.oncomplete = () => {
        if (onProgress) onProgress(100, 'تم حفظ المصحف الشريف كاملاً بنجاح!');
        resolve(true);
      };
      tx.onerror = e => reject(e.target.error);
    });
  }

  // حذف المصحف الكامل من IndexedDB لتوفير المساحة
  async function deleteFullQuran() {
    await initDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const req = store.clear();
      req.onsuccess = () => resolve(true);
      req.onerror = e => reject(e);
    });
  }

  // جلب سورة محددة بالترتيب الهرمي (IndexedDB -> Built-in -> LocalStorage -> Network)
  async function getSurahData(id) {
    id = parseInt(id);

    // 1. فحص IndexedDB أولاً
    try {
      await initDB();
      const fromDB = await new Promise((res) => {
        const tx = db.transaction(STORE_NAME, 'readonly');
        const req = tx.objectStore(STORE_NAME).get(id);
        req.onsuccess = () => res(req.result || null);
        req.onerror = () => res(null);
      });
      if (fromDB) {
        return { data: fromDB, source: 'indexeddb' };
      }
    } catch (e) {}

    // 2. فحص السور المدمجة مسبقاً (الفاتحة، الكهف، يس، الملك، الرحمن، الواقعة، وجزء عم)
    if (window.BUILTIN_OFFLINE_SURAHS && window.BUILTIN_OFFLINE_SURAHS[id]) {
      return { data: window.BUILTIN_OFFLINE_SURAHS[id], source: 'builtin' };
    }

    // 3. فحص التخزين المحلي السريع (LocalStorage)
    try {
      const cachedQ = localStorage.getItem('cached_surah_' + id);
      const cachedT = localStorage.getItem('cached_tafsir_' + id);
      if (cachedQ) {
        const qData = JSON.parse(cachedQ).data;
        const tData = cachedT ? JSON.parse(cachedT).data : null;
        const ayahs = qData.ayahs.map((a, idx) => ({
          numberInSurah: a.numberInSurah,
          text: a.text,
          tafsir: (tData && tData.ayahs && tData.ayahs[idx]) ? tData.ayahs[idx].text : ''
        }));
        return {
          data: {
            number: qData.number,
            name: qData.name,
            englishName: qData.englishName,
            revelationType: qData.revelationType,
            numberOfAyahs: qData.numberOfAyahs,
            ayahs: ayahs
          },
          source: 'cache'
        };
      }
    } catch (e) {}

    // 4. جلب عبر الشبكة إذا كان هناك اتصال
    if (navigator.onLine) {
      const [qRes, tRes] = await Promise.all([
        fetch(`https://api.alquran.cloud/v1/surah/${id}/quran-uthmani`).then(r => r.json()),
        fetch(`https://api.alquran.cloud/v1/surah/${id}/ar.muyassar`).then(r => r.json())
      ]);

      if (qRes.code === 200 && qRes.data) {
        // حفظ في LocalStorage للمرات القادمة
        try {
          localStorage.setItem('cached_surah_' + id, JSON.stringify(qRes));
          localStorage.setItem('cached_tafsir_' + id, JSON.stringify(tRes));
        } catch (e) {}

        const ayahs = qRes.data.ayahs.map((a, idx) => ({
          numberInSurah: a.numberInSurah,
          text: a.text,
          tafsir: (tRes.code === 200 && tRes.data && tRes.data.ayahs && tRes.data.ayahs[idx])
                  ? tRes.data.ayahs[idx].text
                  : ''
        }));

        return {
          data: {
            number: qRes.data.number,
            name: qRes.data.name,
            englishName: qRes.data.englishName,
            revelationType: qRes.data.revelationType,
            numberOfAyahs: qRes.data.numberOfAyahs,
            ayahs: ayahs
          },
          source: 'network'
        };
      }
    }

    throw new Error('السورة غير متوفرة دون اتصال');
  }

  return {
    isFullQuranDownloaded,
    downloadFullQuran,
    deleteFullQuran,
    getSurahData
  };
})();
