/**
 * praytimes.js — المحرك الفلكي الرياضي لحساب مواقيت الصلاة أوفلاين 100%
 * يعمل ذاتياً في المتصفح دون الحاجة لأي اتصال بالإنترنت أو واجهات برمجية خارجية.
 * مبني على المعادلات الفلكية الدقيقة لحركة الشمس وميلها وانكسار الضوء.
 */

window.PrayTimes = (function () {
  'use strict';

  // الثوابت الفلكية وطرق الحساب المعتمدة
  const METHODS = {
    Makkah: {
      name: 'جامعة أم القرى - مكة المكرمة',
      fajrAngle: 18.5,
      ishaAngle: 0,
      ishaInterval: 90, // 90 دقيقة بعد المغرب (120 في رمضان)
      params: [18.5, 1, 0, 1, 90]
    },
    MWL: {
      name: 'رابطة العالم الإسلامي',
      fajrAngle: 18.0,
      ishaAngle: 17.0,
      params: [18.0, 1, 0, 0, 17.0]
    },
    Egypt: {
      name: 'الهيئة المصرية العامة للمساحة',
      fajrAngle: 19.5,
      ishaAngle: 17.5,
      params: [19.5, 1, 0, 0, 17.5]
    },
    ISNA: {
      name: 'الجمعية الإسلامية لأمريكا الشمالية',
      fajrAngle: 15.0,
      ishaAngle: 15.0,
      params: [15.0, 1, 0, 0, 15.0]
    },
    Algeria: {
      name: 'وزارة الشؤون الدينية والأوقاف - الجزائر',
      fajrAngle: 18.0,
      ishaAngle: 17.0,
      params: [18.0, 1, 0, 0, 17.0]
    }
  };

  // قائمة أشهر عواصم ومدن العالم الإسلامي مخزنة محلياً للاختيار الفوري أوفلاين
  const CITIES = [
    { name: 'مكة المكرمة (السعودية)', lat: 21.4225, lng: 39.8262, tz: 3, method: 'Makkah' },
    { name: 'المدينة المنورة (السعودية)', lat: 24.4672, lng: 39.6111, tz: 3, method: 'Makkah' },
    { name: 'الرياض (السعودية)', lat: 24.7136, lng: 46.6753, tz: 3, method: 'Makkah' },
    { name: 'القدس الشريف (فلسطين)', lat: 31.7683, lng: 35.2137, tz: 2, method: 'MWL' },
    { name: 'القاهرة (مصر)', lat: 30.0444, lng: 31.2357, tz: 2, method: 'Egypt' },
    { name: 'الجزائر العاصمة (الجزائر)', lat: 36.7538, lng: 3.0588, tz: 1, method: 'Algeria' },
    { name: 'وهران (الجزائر)', lat: 35.6987, lng: -0.6349, tz: 1, method: 'Algeria' },
    { name: 'قسنطينة (الجزائر)', lat: 36.3650, lng: 6.6147, tz: 1, method: 'Algeria' },
    { name: 'الرباط (المغرب)', lat: 34.0209, lng: -6.8416, tz: 1, method: 'MWL' },
    { name: 'الدار البيضاء (المغرب)', lat: 33.5731, lng: -7.5898, tz: 1, method: 'MWL' },
    { name: 'تونس العاصمة (تونس)', lat: 36.8065, lng: 10.1815, tz: 1, method: 'MWL' },
    { name: 'طرابلس (ليبيا)', lat: 32.8872, lng: 13.1913, tz: 2, method: 'MWL' },
    { name: 'بغداد (العراق)', lat: 33.3152, lng: 44.3661, tz: 3, method: 'MWL' },
    { name: 'دمشق (سوريا)', lat: 33.5138, lng: 36.2765, tz: 3, method: 'MWL' },
    { name: 'عمان (الأردن)', lat: 31.9454, lng: 35.9284, tz: 3, method: 'MWL' },
    { name: 'بيروت (لبنان)', lat: 33.8938, lng: 35.5018, tz: 2, method: 'MWL' },
    { name: 'الكويت (الكويت)', lat: 29.3759, lng: 47.9774, tz: 3, method: 'Makkah' },
    { name: 'الدوحة (قطر)', lat: 25.2854, lng: 51.5310, tz: 3, method: 'Makkah' },
    { name: 'أبوظبي (الإمارات)', lat: 24.4539, lng: 54.3773, tz: 4, method: 'Makkah' },
    { name: 'دبي (الإمارات)', lat: 25.2048, lng: 55.2708, tz: 4, method: 'Makkah' },
    { name: 'المنامة (البحرين)', lat: 26.2285, lng: 50.5860, tz: 3, method: 'Makkah' },
    { name: 'مسقط (عمان)', lat: 23.5880, lng: 58.3829, tz: 4, method: 'MWL' },
    { name: 'صنعاء (اليمن)', lat: 15.3694, lng: 44.1910, tz: 3, method: 'Makkah' },
    { name: 'الخرطوم (السودان)', lat: 15.5007, lng: 32.5599, tz: 2, method: 'Egypt' },
    { name: 'إسطنبول (تركيا)', lat: 41.0082, lng: 28.9784, tz: 3, method: 'MWL' },
    { name: 'كوالالمبور (ماليزيا)', lat: 3.1390, lng: 101.6869, tz: 8, method: 'MWL' },
    { name: 'جاكرتا (إندونيسيا)', lat: -6.2088, lng: 106.8456, tz: 7, method: 'MWL' }
  ];

  // دوال التحويل المثلثي للدرجات
  const dtr = d => (d * Math.PI) / 180.0;
  const rtd = r => (r * 180.0) / Math.PI;
  const sin = d => Math.sin(dtr(d));
  const cos = d => Math.cos(dtr(d));
  const tan = d => Math.tan(dtr(d));
  const arcsin = d => rtd(Math.asin(d));
  const arccos = d => rtd(Math.acos(d));
  const arctan = d => rtd(Math.atan(d));
  const arccot = x => rtd(Math.atan(1.0 / x));
  const fixAngle = a => {
    a = a - 360.0 * Math.floor(a / 360.0);
    return a < 0 ? a + 360.0 : a;
  };
  const fixHour = a => {
    a = a - 24.0 * Math.floor(a / 24.0);
    return a < 0 ? a + 24.0 : a;
  };

  // حساب اليوم اليولياني (Julian Day)
  function getJulian(year, month, day) {
    if (month <= 2) {
      year -= 1;
      month += 12;
    }
    const A = Math.floor(year / 100);
    const B = 2 - A + Math.floor(A / 4);
    return Math.floor(365.25 * (year + 4716)) + Math.floor(30.6001 * (month + 1)) + day + B - 1524.5;
  }

  // موقع الشمس الفلكي (الميل وزاوية المعادلة الزمانية)
  function sunPosition(jd) {
    const D = jd - 2451545.0;
    const g = fixAngle(357.529 + 0.98560028 * D);
    const q = fixAngle(280.459 + 0.98564736 * D);
    const L = fixAngle(q + 1.915 * sin(g) + 0.02 * sin(2 * g));
    const e = 23.439 - 0.00000036 * D;
    const d = arcsin(sin(e) * sin(L));
    let RA = arctan(cos(e) * sin(L) / cos(L)) / 15.0;
    if (cos(L) < 0) RA += 12;
    else if (sin(L) < 0) RA += 24;
    const EqT = q / 15.0 - RA;
    return { declination: d, equation: EqT };
  }

  // حساب زاوية الارتفاع للشمس
  function computeMidDay(t, eqt) {
    return fixHour(12 - eqt);
  }

  function computeTime(t, g, lat, dec, midDay, isMorning) {
    const cosAngle = (sin(g) - sin(lat) * sin(dec)) / (cos(lat) * cos(dec));
    if (cosAngle > 1 || cosAngle < -1) return null; // لا توجد ظاهرة في هذا اليوم
    const diff = arccos(cosAngle) / 15.0;
    return fixHour(isMorning ? midDay - diff : midDay + diff);
  }

  function computeAsr(step, lat, dec, midDay) {
    const d = arccot(step + tan(Math.abs(lat - dec)));
    return computeTime(0, d, lat, dec, midDay, false);
  }

  // الحساب الرئيسي
  function getTimes(date, lat, lng, timezone, methodName = 'Makkah', asrJuristic = 1) {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();

    const tz = (typeof timezone === 'number') ? timezone : -date.getTimezoneOffset() / 60.0;
    const method = METHODS[methodName] || METHODS.Makkah;

    const jd = getJulian(year, month, day) - lng / (15.0 * 24.0);
    const sun = sunPosition(jd);

    const midDay = fixHour(12 + tz - lng / 15.0 - sun.equation);
    const fajr = computeTime(0, -method.fajrAngle, lat, sun.declination, midDay, true);
    const sunrise = computeTime(0, -0.8333, lat, sun.declination, midDay, true);
    const dhuhr = midDay;
    const asr = computeAsr(asrJuristic, lat, sun.declination, midDay);
    const sunset = computeTime(0, -0.8333, lat, sun.declination, midDay, false);
    const maghrib = sunset; // غروب الشمس
    
    let isha;
    if (method.ishaAngle > 0) {
      isha = computeTime(0, -method.ishaAngle, lat, sun.declination, midDay, false);
    } else {
      isha = fixHour(maghrib + (method.ishaInterval || 90) / 60.0);
    }

    const formatHour = val => {
      if (val === null || isNaN(val)) return '--:--';
      val = fixHour(val + 0.5 / 60.0); // تقريب للدقيقة
      const hours = Math.floor(val);
      const minutes = Math.floor((val - hours) * 60);
      return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
    };

    return {
      Fajr: formatHour(fajr),
      Sunrise: formatHour(sunrise),
      Dhuhr: formatHour(dhuhr),
      Asr: formatHour(asr),
      Maghrib: formatHour(maghrib),
      Isha: formatHour(isha),
      method: method.name
    };
  }

  return {
    getTimes,
    CITIES,
    METHODS
  };
})();
