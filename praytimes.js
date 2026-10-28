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

  // قائمة كافة الولايات الجزائرية (58 ولاية) + أشهر عواصم ومدن العالم الإسلامي
  const CITIES = [
      {
          "name": "01. أدرار (الجزائر)",
          "lat": 27.8743,
          "lng": -0.2939,
          "tz": 1,
          "method": "Algeria"
      },
      {
          "name": "02. الشلف (الجزائر)",
          "lat": 36.1652,
          "lng": 1.3345,
          "tz": 1,
          "method": "Algeria"
      },
      {
          "name": "03. الأغواط (الجزائر)",
          "lat": 33.8,
          "lng": 2.8651,
          "tz": 1,
          "method": "Algeria"
      },
      {
          "name": "04. أم البواقي (الجزائر)",
          "lat": 35.8754,
          "lng": 7.1135,
          "tz": 1,
          "method": "Algeria"
      },
      {
          "name": "05. باتنة (الجزائر)",
          "lat": 35.5559,
          "lng": 6.1741,
          "tz": 1,
          "method": "Algeria"
      },
      {
          "name": "06. بجاية (الجزائر)",
          "lat": 36.7559,
          "lng": 5.0843,
          "tz": 1,
          "method": "Algeria"
      },
      {
          "name": "07. بسكرة (الجزائر)",
          "lat": 34.8504,
          "lng": 5.7281,
          "tz": 1,
          "method": "Algeria"
      },
      {
          "name": "08. بشار (الجزائر)",
          "lat": 31.6167,
          "lng": -2.2167,
          "tz": 1,
          "method": "Algeria"
      },
      {
          "name": "09. البليدة (الجزائر)",
          "lat": 36.47,
          "lng": 2.83,
          "tz": 1,
          "method": "Algeria"
      },
      {
          "name": "10. البويرة (الجزائر)",
          "lat": 36.3749,
          "lng": 3.902,
          "tz": 1,
          "method": "Algeria"
      },
      {
          "name": "11. تمنراست (الجزائر)",
          "lat": 22.785,
          "lng": 5.5228,
          "tz": 1,
          "method": "Algeria"
      },
      {
          "name": "12. تبسة (الجزائر)",
          "lat": 35.4042,
          "lng": 8.1242,
          "tz": 1,
          "method": "Algeria"
      },
      {
          "name": "13. تلمسان (الجزائر)",
          "lat": 34.8783,
          "lng": -1.315,
          "tz": 1,
          "method": "Algeria"
      },
      {
          "name": "14. تيارت (الجزائر)",
          "lat": 35.371,
          "lng": 1.317,
          "tz": 1,
          "method": "Algeria"
      },
      {
          "name": "15. تيزي وزو (الجزائر)",
          "lat": 36.7118,
          "lng": 4.0459,
          "tz": 1,
          "method": "Algeria"
      },
      {
          "name": "16. الجزائر العاصمة (الجزائر)",
          "lat": 36.7538,
          "lng": 3.0588,
          "tz": 1,
          "method": "Algeria"
      },
      {
          "name": "17. الجلفة (الجزائر)",
          "lat": 34.6728,
          "lng": 3.263,
          "tz": 1,
          "method": "Algeria"
      },
      {
          "name": "18. جيجل (الجزائر)",
          "lat": 36.8206,
          "lng": 5.7667,
          "tz": 1,
          "method": "Algeria"
      },
      {
          "name": "19. سطيف (الجزائر)",
          "lat": 36.1911,
          "lng": 5.4137,
          "tz": 1,
          "method": "Algeria"
      },
      {
          "name": "20. سعيدة (الجزائر)",
          "lat": 34.8303,
          "lng": 0.1517,
          "tz": 1,
          "method": "Algeria"
      },
      {
          "name": "21. سكيكدة (الجزائر)",
          "lat": 36.8792,
          "lng": 6.9075,
          "tz": 1,
          "method": "Algeria"
      },
      {
          "name": "22. سيدي بلعباس (الجزائر)",
          "lat": 35.1899,
          "lng": -0.6308,
          "tz": 1,
          "method": "Algeria"
      },
      {
          "name": "23. عنابة (الجزائر)",
          "lat": 36.9,
          "lng": 7.7667,
          "tz": 1,
          "method": "Algeria"
      },
      {
          "name": "24. قالمة (الجزائر)",
          "lat": 36.4621,
          "lng": 7.4261,
          "tz": 1,
          "method": "Algeria"
      },
      {
          "name": "25. قسنطينة (الجزائر)",
          "lat": 36.365,
          "lng": 6.6147,
          "tz": 1,
          "method": "Algeria"
      },
      {
          "name": "26. المدية (الجزائر)",
          "lat": 36.2642,
          "lng": 2.7539,
          "tz": 1,
          "method": "Algeria"
      },
      {
          "name": "27. مستغانم (الجزائر)",
          "lat": 35.9312,
          "lng": 0.0892,
          "tz": 1,
          "method": "Algeria"
      },
      {
          "name": "28. المسيلة (الجزائر)",
          "lat": 35.7058,
          "lng": 4.5419,
          "tz": 1,
          "method": "Algeria"
      },
      {
          "name": "29. معسكر (الجزائر)",
          "lat": 35.3944,
          "lng": 0.1403,
          "tz": 1,
          "method": "Algeria"
      },
      {
          "name": "30. ورقلة (الجزائر)",
          "lat": 31.9493,
          "lng": 5.325,
          "tz": 1,
          "method": "Algeria"
      },
      {
          "name": "31. وهران (الجزائر)",
          "lat": 35.6987,
          "lng": -0.6349,
          "tz": 1,
          "method": "Algeria"
      },
      {
          "name": "32. البيض (الجزائر)",
          "lat": 33.6832,
          "lng": 1.0193,
          "tz": 1,
          "method": "Algeria"
      },
      {
          "name": "33. إليزي (الجزائر)",
          "lat": 26.5073,
          "lng": 8.4813,
          "tz": 1,
          "method": "Algeria"
      },
      {
          "name": "34. برج بوعريريج (الجزائر)",
          "lat": 36.0732,
          "lng": 4.7611,
          "tz": 1,
          "method": "Algeria"
      },
      {
          "name": "35. بومرداس (الجزائر)",
          "lat": 36.7664,
          "lng": 3.4772,
          "tz": 1,
          "method": "Algeria"
      },
      {
          "name": "36. الطارف (الجزائر)",
          "lat": 36.7672,
          "lng": 8.3139,
          "tz": 1,
          "method": "Algeria"
      },
      {
          "name": "37. تندوف (الجزائر)",
          "lat": 27.6711,
          "lng": -8.1474,
          "tz": 1,
          "method": "Algeria"
      },
      {
          "name": "38. تسمسيلت (الجزائر)",
          "lat": 35.6072,
          "lng": 1.8108,
          "tz": 1,
          "method": "Algeria"
      },
      {
          "name": "39. الوادي (الجزائر)",
          "lat": 33.3683,
          "lng": 6.8675,
          "tz": 1,
          "method": "Algeria"
      },
      {
          "name": "40. خنشلة (الجزائر)",
          "lat": 35.4358,
          "lng": 7.1433,
          "tz": 1,
          "method": "Algeria"
      },
      {
          "name": "41. سوق أهراس (الجزائر)",
          "lat": 36.2864,
          "lng": 7.9511,
          "tz": 1,
          "method": "Algeria"
      },
      {
          "name": "42. تيبازة (الجزائر)",
          "lat": 36.5897,
          "lng": 2.4475,
          "tz": 1,
          "method": "Algeria"
      },
      {
          "name": "43. ميلة (الجزائر)",
          "lat": 36.4503,
          "lng": 6.2644,
          "tz": 1,
          "method": "Algeria"
      },
      {
          "name": "44. عين الدفلى (الجزائر)",
          "lat": 36.265,
          "lng": 1.9678,
          "tz": 1,
          "method": "Algeria"
      },
      {
          "name": "45. النعامة (الجزائر)",
          "lat": 33.2667,
          "lng": -0.3167,
          "tz": 1,
          "method": "Algeria"
      },
      {
          "name": "46. عين تموشنت (الجزائر)",
          "lat": 35.2975,
          "lng": -1.1403,
          "tz": 1,
          "method": "Algeria"
      },
      {
          "name": "47. غرداية (الجزائر)",
          "lat": 32.4909,
          "lng": 3.6736,
          "tz": 1,
          "method": "Algeria"
      },
      {
          "name": "48. غليزان (الجزائر)",
          "lat": 35.7403,
          "lng": 0.5558,
          "tz": 1,
          "method": "Algeria"
      },
      {
          "name": "49. المغير (الجزائر)",
          "lat": 33.9489,
          "lng": 5.9242,
          "tz": 1,
          "method": "Algeria"
      },
      {
          "name": "50. المنيعة (الجزائر)",
          "lat": 30.5847,
          "lng": 2.8778,
          "tz": 1,
          "method": "Algeria"
      },
      {
          "name": "51. أولاد جلال (الجزائر)",
          "lat": 34.4331,
          "lng": 5.0664,
          "tz": 1,
          "method": "Algeria"
      },
      {
          "name": "52. برج باجي مختار (الجزائر)",
          "lat": 21.3283,
          "lng": 0.9547,
          "tz": 1,
          "method": "Algeria"
      },
      {
          "name": "53. بني عباس (الجزائر)",
          "lat": 30.1333,
          "lng": -2.1667,
          "tz": 1,
          "method": "Algeria"
      },
      {
          "name": "54. تيميمون (الجزائر)",
          "lat": 29.2639,
          "lng": 0.2311,
          "tz": 1,
          "method": "Algeria"
      },
      {
          "name": "55. تقرت (الجزائر)",
          "lat": 33.1064,
          "lng": 6.0644,
          "tz": 1,
          "method": "Algeria"
      },
      {
          "name": "56. جانت (الجزائر)",
          "lat": 24.5539,
          "lng": 9.4847,
          "tz": 1,
          "method": "Algeria"
      },
      {
          "name": "57. إن صالح (الجزائر)",
          "lat": 27.1936,
          "lng": 2.4831,
          "tz": 1,
          "method": "Algeria"
      },
      {
          "name": "58. إن قزام (الجزائر)",
          "lat": 19.5717,
          "lng": 5.7697,
          "tz": 1,
          "method": "Algeria"
      },
      {
          "name": "مكة المكرمة (السعودية)",
          "lat": 21.4225,
          "lng": 39.8262,
          "tz": 3,
          "method": "Makkah"
      },
      {
          "name": "المدينة المنورة (السعودية)",
          "lat": 24.4672,
          "lng": 39.6111,
          "tz": 3,
          "method": "Makkah"
      },
      {
          "name": "القدس الشريف (فلسطين)",
          "lat": 31.7683,
          "lng": 35.2137,
          "tz": 2,
          "method": "MWL"
      },
      {
          "name": "الرياض (السعودية)",
          "lat": 24.7136,
          "lng": 46.6753,
          "tz": 3,
          "method": "Makkah"
      },
      {
          "name": "القاهرة (مصر)",
          "lat": 30.0444,
          "lng": 31.2357,
          "tz": 2,
          "method": "Egypt"
      },
      {
          "name": "الرباط (المغرب)",
          "lat": 34.0209,
          "lng": -6.8416,
          "tz": 1,
          "method": "MWL"
      },
      {
          "name": "الدار البيضاء (المغرب)",
          "lat": 33.5731,
          "lng": -7.5898,
          "tz": 1,
          "method": "MWL"
      },
      {
          "name": "تونس العاصمة (تونس)",
          "lat": 36.8065,
          "lng": 10.1815,
          "tz": 1,
          "method": "MWL"
      },
      {
          "name": "طرابلس (ليبيا)",
          "lat": 32.8872,
          "lng": 13.1913,
          "tz": 2,
          "method": "MWL"
      },
      {
          "name": "بغداد (العراق)",
          "lat": 33.3152,
          "lng": 44.3661,
          "tz": 3,
          "method": "MWL"
      },
      {
          "name": "دمشق (سوريا)",
          "lat": 33.5138,
          "lng": 36.2765,
          "tz": 3,
          "method": "MWL"
      },
      {
          "name": "عمان (الأردن)",
          "lat": 31.9454,
          "lng": 35.9284,
          "tz": 3,
          "method": "MWL"
      },
      {
          "name": "بيروت (لبنان)",
          "lat": 33.8938,
          "lng": 35.5018,
          "tz": 2,
          "method": "MWL"
      },
      {
          "name": "الكويت (الكويت)",
          "lat": 29.3759,
          "lng": 47.9774,
          "tz": 3,
          "method": "Makkah"
      },
      {
          "name": "الدوحة (قطر)",
          "lat": 25.2854,
          "lng": 51.531,
          "tz": 3,
          "method": "Makkah"
      },
      {
          "name": "أبوظبي (الإمارات)",
          "lat": 24.4539,
          "lng": 54.3773,
          "tz": 4,
          "method": "Makkah"
      },
      {
          "name": "دبي (الإمارات)",
          "lat": 25.2048,
          "lng": 55.2708,
          "tz": 4,
          "method": "Makkah"
      },
      {
          "name": "المنامة (البحرين)",
          "lat": 26.2285,
          "lng": 50.586,
          "tz": 3,
          "method": "Makkah"
      },
      {
          "name": "مسقط (عمان)",
          "lat": 23.588,
          "lng": 58.3829,
          "tz": 4,
          "method": "MWL"
      },
      {
          "name": "صنعاء (اليمن)",
          "lat": 15.3694,
          "lng": 44.191,
          "tz": 3,
          "method": "Makkah"
      },
      {
          "name": "الخرطوم (السودان)",
          "lat": 15.5007,
          "lng": 32.5599,
          "tz": 2,
          "method": "Egypt"
      },
      {
          "name": "إسطنبول (تركيا)",
          "lat": 41.0082,
          "lng": 28.9784,
          "tz": 3,
          "method": "MWL"
      },
      {
          "name": "كوالالمبور (ماليزيا)",
          "lat": 3.139,
          "lng": 101.6869,
          "tz": 8,
          "method": "MWL"
      },
      {
          "name": "جاكرتا (إندونيسيا)",
          "lat": -6.2088,
          "lng": 106.8456,
          "tz": 7,
          "method": "MWL"
      }
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

  // حساب زاوية القبلة والمسافة بدقة فلكية إلى الكعبة المشرفة بمكة المكرمة
  function getQibla(lat1, lon1) {
    const lat2 = 21.422487 * Math.PI / 180.0;
    const lon2 = 39.826206 * Math.PI / 180.0;
    const phi1 = lat1 * Math.PI / 180.0;
    const deltaLambda = lon2 - (lon1 * Math.PI / 180.0);
    const y = Math.sin(deltaLambda) * Math.cos(lat2);
    const x = Math.cos(phi1) * Math.sin(lat2) - Math.sin(phi1) * Math.cos(lat2) * Math.cos(deltaLambda);
    const qibla = (Math.atan2(y, x) * 180.0 / Math.PI + 360.0) % 360.0;

    // حساب المسافة الكروية (Haversine)
    const R = 6371; // نصف قطر الأرض بالكيلومتر
    const deltaPhi = (21.422487 - lat1) * Math.PI / 180.0;
    const a = Math.sin(deltaPhi / 2) ** 2 + Math.cos(phi1) * Math.cos(lat2) * Math.sin(deltaLambda / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = Math.round(R * c);

    return {
      bearing: Math.round(qibla * 10) / 10,
      distance: distance
    };
  }

  return {
    getTimes,
    getQibla,
    CITIES,
    METHODS
  };
})();
