/**
 * notifications.js — نظام الإشعارات الإسلامية الذكية
 * الموسوعة الإسلامية الشاملة
 *
 * يدعم:
 *  - إشعارات مواقيت الصلاة (فجر، شروق، ظهر، عصر، مغرب، عشاء)
 *  - آية اليوم في الصباح
 *  - حديث اليوم في الصباح
 *  - تذكير القراءة اليومية
 *  - تذكير الأذكار مساءً
 *  - يعمل 100% محلياً بدون خادم
 */

(function () {
  'use strict';

  // ═══════════════════════════════════════════════════
  // الثوابت
  // ═══════════════════════════════════════════════════
  const STORAGE_KEY   = 'islamic_notif_settings';
  const SCHEDULE_KEY  = 'islamic_notif_timers';
  const ICON_PATH     = './icons/icon-192x192.png';
  const BADGE_PATH    = './icons/favicon-32x32.png';

  // أوقات الإشعارات اليومية الثابتة (ساعة:دقيقة)
  const DAILY_SCHEDULES = {
    ayah:    { h: 7,  m: 0,  label: 'آية اليوم' },
    hadith:  { h: 7,  m: 30, label: 'حديث اليوم' },
    reading: { h: 9,  m: 0,  label: 'تذكير القراءة' },
    azkar:   { h: 21, m: 0,  label: 'أذكار المساء' },
  };

  // أسماء الصلوات بالعربية
  const PRAYER_NAMES = {
    fajr:    'الفجر',
    sunrise: 'الشروق',
    dhuhr:   'الظهر',
    asr:     'العصر',
    maghrib: 'المغرب',
    isha:    'العشاء',
  };

  // آيات اليوم (مجموعة مدمجة أوفلاين)
  const AYAHS = [
    { text: 'إِنَّ مَعَ الْعُسْرِ يُسْرًا', ref: 'الشرح: 6' },
    { text: 'وَمَن يَتَّقِ اللَّهَ يَجْعَل لَّهُ مَخْرَجًا', ref: 'الطلاق: 2' },
    { text: 'فَإِنَّ مَعَ الْعُسْرِ يُسْرًا', ref: 'الشرح: 5' },
    { text: 'وَاللَّهُ يَعْصِمُكَ مِنَ النَّاسِ', ref: 'المائدة: 67' },
    { text: 'إِنَّ اللَّهَ مَعَ الصَّابِرِينَ', ref: 'البقرة: 153' },
    { text: 'وَلَا تَيْأَسُوا مِن رَّوْحِ اللَّهِ', ref: 'يوسف: 87' },
    { text: 'حَسْبُنَا اللَّهُ وَنِعْمَ الْوَكِيلُ', ref: 'آل عمران: 173' },
    { text: 'وَإِذَا سَأَلَكَ عِبَادِي عَنِّي فَإِنِّي قَرِيبٌ', ref: 'البقرة: 186' },
    { text: 'يَا أَيُّهَا الَّذِينَ آمَنُوا اذْكُرُوا اللَّهَ ذِكْرًا كَثِيرًا', ref: 'الأحزاب: 41' },
    { text: 'وَفِي ذَٰلِكَ فَلْيَتَنَافَسِ الْمُتَنَافِسُونَ', ref: 'المطففين: 26' },
    { text: 'أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ', ref: 'الرعد: 28' },
    { text: 'وَلَنَجْزِيَنَّ الَّذِينَ صَبَرُوا أَجْرَهُم بِأَحْسَنِ مَا كَانُوا يَعْمَلُونَ', ref: 'النحل: 96' },
    { text: 'إِنَّ اللَّهَ لَا يُضِيعُ أَجْرَ الْمُحْسِنِينَ', ref: 'التوبة: 120' },
    { text: 'وَمَن يَتَوَكَّلْ عَلَى اللَّهِ فَهُوَ حَسْبُهُ', ref: 'الطلاق: 3' },
  ];

  // أحاديث اليوم (مجموعة مدمجة أوفلاين)
  const HADITHS = [
    { text: 'إنما الأعمال بالنيات، وإنما لكل امرئ ما نوى', src: 'متفق عليه' },
    { text: 'من كان يؤمن بالله واليوم الآخر فليقل خيراً أو ليصمت', src: 'متفق عليه' },
    { text: 'لا يؤمن أحدكم حتى يحب لأخيه ما يحب لنفسه', src: 'متفق عليه' },
    { text: 'الطهور شطر الإيمان، والحمد لله تملأ الميزان', src: 'صحيح مسلم' },
    { text: 'خير الناس أنفعهم للناس', src: 'صحيح الجامع' },
    { text: 'ابتسامتك في وجه أخيك صدقة', src: 'سنن الترمذي' },
    { text: 'من سلك طريقاً يلتمس فيه علماً سهّل الله له طريقاً إلى الجنة', src: 'صحيح مسلم' },
    { text: 'الدنيا سجن المؤمن وجنة الكافر', src: 'صحيح مسلم' },
    { text: 'احرص على ما ينفعك واستعن بالله ولا تعجز', src: 'صحيح مسلم' },
    { text: 'كلمتان خفيفتان على اللسان، ثقيلتان في الميزان: سبحان الله وبحمده، سبحان الله العظيم', src: 'متفق عليه' },
    { text: 'من صلى البردين دخل الجنة', src: 'متفق عليه' },
    { text: 'إن الله جميل يحب الجمال', src: 'صحيح مسلم' },
    { text: 'تبسمك في وجه أخيك صدقة، وأمرك بالمعروف صدقة', src: 'سنن الترمذي' },
    { text: 'لا حسد إلا في اثنتين: رجل آتاه الله مالاً فسلّطه على هلكته في الحق، ورجل آتاه الله الحكمة فهو يقضي بها ويعلمها', src: 'متفق عليه' },
  ];

  // أذكار المساء (للتذكير)
  const AZKAR_REMINDERS = [
    'أذكار المساء: "اللهم بك أمسينا وبك أصبحنا وبك نحيا وبك نموت وإليك المصير"',
    'أذكار المساء: لا تنسَ "أعوذ بكلمات الله التامات من شر ما خلق" ثلاث مرات',
    'أذكار المساء: "سبحان الله" 33 و"الحمد لله" 33 و"الله أكبر" 34',
    'حان وقت أذكار المساء — لا تغفل عن ذكر الله',
    'أذكار المساء: "حسبي الله لا إله إلا هو عليه توكلت وهو رب العرش العظيم" سبع مرات',
  ];

  // ═══════════════════════════════════════════════════
  // الإعدادات
  // ═══════════════════════════════════════════════════
  function loadSettings() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) return JSON.parse(raw);
    } catch (e) {}
    return {
      enabled: false,
      prayers: true,
      ayah: true,
      hadith: true,
      reading: true,
      azkar: true,
      minutesBefore: 5, // تنبيه قبل الصلاة بـ N دقيقة
    };
  }

  function saveSettings(s) {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(s)); } catch (e) {}
  }

  // ═══════════════════════════════════════════════════
  // أداة: اليوم (index بناء على التاريخ)
  // ═══════════════════════════════════════════════════
  function dayIndex(arr) {
    const d = new Date();
    return (d.getFullYear() * 365 + d.getMonth() * 31 + d.getDate()) % arr.length;
  }

  // ═══════════════════════════════════════════════════
  // إرسال إشعار واحد
  // ═══════════════════════════════════════════════════
  function sendNotification(title, body, tag, url) {
    if (Notification.permission !== 'granted') return;

    const options = {
      body: body,
      icon: ICON_PATH,
      badge: BADGE_PATH,
      tag: tag || 'islamic-notif',
      dir: 'rtl',
      lang: 'ar',
      requireInteraction: false,
      silent: false,
      data: { url: url || './index.html' },
    };

    // استخدم Service Worker إن وُجد (يظهر حتى عند إغلاق التبويب)
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({
        type: 'SHOW_NOTIFICATION',
        title: title,
        options: options,
      });
    } else {
      // fallback: Notification API مباشرة
      try {
        const n = new Notification(title, options);
        n.onclick = function () {
          window.focus();
          if (options.data && options.data.url) window.location.href = options.data.url;
          n.close();
        };
      } catch (e) {
        console.warn('[Notif] Failed:', e);
      }
    }
  }

  // ═══════════════════════════════════════════════════
  // حساب التأخير (ms) حتى وقت محدد اليوم أو الغد
  // ═══════════════════════════════════════════════════
  function msUntil(h, m) {
    const now = new Date();
    const target = new Date(now);
    target.setHours(h, m, 0, 0);
    if (target <= now) target.setDate(target.getDate() + 1);
    return target - now;
  }

  function msUntilTimeStr(timeStr) {
    // timeStr مثل "05:12" أو "05:12:00"
    const parts = timeStr.split(':');
    const h = parseInt(parts[0], 10);
    const m = parseInt(parts[1], 10);
    return msUntil(h, m);
  }

  // ═══════════════════════════════════════════════════
  // جدولة الإشعارات اليومية
  // ═══════════════════════════════════════════════════
  const _timers = [];

  function clearAllTimers() {
    _timers.forEach(id => clearTimeout(id));
    _timers.length = 0;
  }

  function scheduleDaily(h, m, callback) {
    const delay = msUntil(h, m);
    const id = setTimeout(function fire() {
      callback();
      // إعادة الجدولة للغد
      const nextId = setTimeout(fire, 24 * 60 * 60 * 1000);
      _timers.push(nextId);
    }, delay);
    _timers.push(id);
  }

  // ═══════════════════════════════════════════════════
  // إشعار آية اليوم
  // ═══════════════════════════════════════════════════
  function notifyAyah() {
    const a = AYAHS[dayIndex(AYAHS)];
    sendNotification(
      '📖 آية اليوم',
      `« ${a.text} »\n— ${a.ref}`,
      'daily-ayah',
      './index.html'
    );
  }

  // ═══════════════════════════════════════════════════
  // إشعار حديث اليوم
  // ═══════════════════════════════════════════════════
  function notifyHadith() {
    const h = HADITHS[dayIndex(HADITHS)];
    sendNotification(
      '📜 حديث اليوم',
      `« ${h.text} »\n— ${h.src}`,
      'daily-hadith',
      './hadith.html'
    );
  }

  // ═══════════════════════════════════════════════════
  // إشعار تذكير القراءة
  // ═══════════════════════════════════════════════════
  function notifyReading() {
    sendNotification(
      '📚 تذكير القراءة اليومية',
      'لا تنسَ قراءة ورد القرآن اليومي — خير ما يُبدأ به الصباح',
      'daily-reading',
      './recitations.html'
    );
  }

  // ═══════════════════════════════════════════════════
  // إشعار أذكار المساء
  // ═══════════════════════════════════════════════════
  function notifyAzkar() {
    const msg = AZKAR_REMINDERS[dayIndex(AZKAR_REMINDERS)];
    sendNotification(
      '🌙 أذكار المساء',
      msg,
      'daily-azkar',
      './azkar.html'
    );
  }

  // ═══════════════════════════════════════════════════
  // إشعارات مواقيت الصلاة
  // ═══════════════════════════════════════════════════
  function schedulePrayerNotifications(settings) {
    if (!settings.prayers) return;
    if (!window.PrayTimes || typeof window.PrayTimes.getTimes !== 'function') {
      console.warn('[Notif] PrayTimes not loaded yet');
      return;
    }

    const saved = localStorage.getItem('selected_prayer_city');
    let lat = 21.4225, lng = 39.8262, tz = 3;
    let cityName = 'مكة المكرمة';

    if (saved) {
      try {
        const c = JSON.parse(saved);
        lat = c.lat; lng = c.lng;
        tz = c.timezone !== undefined ? c.timezone : Math.round(lng / 15);
        cityName = c.name || cityName;
      } catch (e) {}
    } else {
      // محاولة الحصول على الإحداثيات من localStorage
      const gpsLat = parseFloat(localStorage.getItem('gps_lat'));
      const gpsLng = parseFloat(localStorage.getItem('gps_lng'));
      if (!isNaN(gpsLat) && !isNaN(gpsLng)) {
        lat = gpsLat; lng = gpsLng;
        tz = Math.round(lng / 15);
        cityName = 'موقعك الحالي';
      }
    }

    const today = new Date();
    const times = window.PrayTimes.getTimes(today, lat, lng, tz);
    const minutesBefore = settings.minutesBefore || 5;

    const prayersToNotify = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'];

    prayersToNotify.forEach(function (prayer) {
      const timeStr = times[prayer];
      if (!timeStr || timeStr === '--') return;

      // تنبيه قبل الصلاة
      if (minutesBefore > 0) {
        const parts = timeStr.split(':');
        const pH = parseInt(parts[0], 10);
        const pM = parseInt(parts[1], 10);
        const beforeMs = msUntil(pH, pM) - minutesBefore * 60 * 1000;
        if (beforeMs > 0) {
          const tid = setTimeout(function () {
            sendNotification(
              `🕌 ${minutesBefore} دقائق على ${PRAYER_NAMES[prayer]}`,
              `حان قريباً وقت صلاة ${PRAYER_NAMES[prayer]} — ${timeStr}\n${cityName}`,
              `prayer-before-${prayer}`,
              './index.html'
            );
          }, beforeMs);
          _timers.push(tid);
        }
      }

      // تنبيه عند حلول وقت الصلاة
      const onTimeMs = msUntilTimeStr(timeStr);
      if (onTimeMs > 0 && onTimeMs < 24 * 60 * 60 * 1000) {
        const tid2 = setTimeout(function () {
          sendNotification(
            `🕌 حان وقت صلاة ${PRAYER_NAMES[prayer]}`,
            `الله أكبر الله أكبر — ${timeStr}\n${cityName}`,
            `prayer-${prayer}`,
            './index.html'
          );
        }, onTimeMs);
        _timers.push(tid2);
      }
    });
  }

  // ═══════════════════════════════════════════════════
  // البدء الكامل
  // ═══════════════════════════════════════════════════
  function startAll(settings) {
    clearAllTimers();
    if (!settings.enabled) return;

    if (settings.ayah)    scheduleDaily(DAILY_SCHEDULES.ayah.h,    DAILY_SCHEDULES.ayah.m,    notifyAyah);
    if (settings.hadith)  scheduleDaily(DAILY_SCHEDULES.hadith.h,  DAILY_SCHEDULES.hadith.m,  notifyHadith);
    if (settings.reading) scheduleDaily(DAILY_SCHEDULES.reading.h, DAILY_SCHEDULES.reading.m, notifyReading);
    if (settings.azkar)   scheduleDaily(DAILY_SCHEDULES.azkar.h,   DAILY_SCHEDULES.azkar.m,   notifyAzkar);

    // جدولة إشعارات الصلاة اليوم + تجديدها كل منتصف ليل
    if (settings.prayers) {
      schedulePrayerNotifications(settings);
      scheduleDaily(0, 1, function () { schedulePrayerNotifications(settings); });
    }
  }

  // ═══════════════════════════════════════════════════
  // طلب إذن الإشعارات وتفعيل النظام
  // ═══════════════════════════════════════════════════
  async function requestAndEnable() {
    if (!('Notification' in window)) {
      return { success: false, reason: 'browser_unsupported' };
    }

    let permission = Notification.permission;

    if (permission === 'denied') {
      return { success: false, reason: 'denied' };
    }

    if (permission !== 'granted') {
      permission = await Notification.requestPermission();
    }

    if (permission !== 'granted') {
      return { success: false, reason: 'denied' };
    }

    const settings = loadSettings();
    settings.enabled = true;
    saveSettings(settings);
    startAll(settings);

    return { success: true };
  }

  function disable() {
    clearAllTimers();
    const settings = loadSettings();
    settings.enabled = false;
    saveSettings(settings);
  }

  // ═══════════════════════════════════════════════════
  // واجهة عامة
  // ═══════════════════════════════════════════════════
  window.IslamicNotifications = {
    loadSettings,
    saveSettings,
    requestAndEnable,
    disable,
    startAll,
    sendNotification,
    notifyAyah,
    notifyHadith,
    notifyReading,
    notifyAzkar,
    schedulePrayerNotifications,
    PRAYER_NAMES,
    DAILY_SCHEDULES,
  };

  // ─── تشغيل تلقائي عند تحميل الصفحة إن كانت الإشعارات مُفعَّلة مسبقاً ───
  document.addEventListener('DOMContentLoaded', function () {
    const settings = loadSettings();
    if (settings.enabled && Notification.permission === 'granted') {
      // انتظر PrayTimes قبل الجدولة
      function tryStart() {
        if (window.PrayTimes) {
          startAll(settings);
        } else {
          setTimeout(tryStart, 300);
        }
      }
      tryStart();
    }
  });

})();

