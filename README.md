# الموسوعة الإسلامية الشاملة
### Comprehensive Islamic Encyclopedia

<div align="center">

![الموسوعة الإسلامية الشاملة](icons/logo.png)

[![PWA Ready](https://img.shields.io/badge/PWA-Ready-brightgreen?style=flat-square&logo=pwa)](https://web.dev/progressive-web-apps/)
[![Offline Support](https://img.shields.io/badge/Offline-Supported-blue?style=flat-square)](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow?style=flat-square)](LICENSE)
[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat-square&logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)

**موسوعة إسلامية شاملة تعمل كتطبيق ويب تقدمي (PWA) يعمل على جميع الأجهزة بدون إنترنت**

[🌐 زيارة الموقع](https://seifeddinn.github.io/ISlam-Encyclopedia) &nbsp;|&nbsp; [📱 تثبيت التطبيق](#التثبيت) &nbsp;|&nbsp; [📖 المحتويات](#المحتويات)

</div>

---

## ✨ الميزات الرئيسية

| الميزة | التفاصيل |
|:---|:---|
| 📴 **يعمل أوفلاين** | Service Worker + IndexedDB لتخزين كامل البيانات |
| 📱 **PWA قابل للتثبيت** | يُثبَّت كتطبيق على iOS وAndroid وسطح المكتب |
| 🌙 **وضع ليلي** | دعم كامل للوضع الداكن |
| 📐 **تجاوب كامل** | يعمل على الهاتف، الجهاز اللوحي، والحاسوب |
| 🕌 **مواقيت الصلاة** | حسب الموقع بدون API خارجي |
| 🔍 **بحث شامل** | فهرس بحث كامل بالعربية عبر كل المحتويات |
| 📿 **مسبحة ذكية** | مسبحة إلكترونية مع تتبع الأذكار |

---

## 📚 المحتويات

- 🕋 **القرآن الكريم** — تلاوات وقراءات وتجويد (مع دعم أوفلاين)
- 📜 **الحديث الشريف** — صحيح البخاري ومسلم، الأربعون النووية
- ⚖️ **الفقه الإسلامي** — المذاهب الأربعة: الحنفي، المالكي، الشافعي، الحنبلي
- 🌿 **السيرة النبوية** — سيرة النبي ﷺ والصحابة الكرام
- 🏛️ **التاريخ الإسلامي** — الخلافات والحضارة الإسلامية
- 🌟 **العقيدة الإسلامية** — التوحيد والإيمان
- 🤲 **حصن المسلم** — أذكار الصباح والمساء والأدعية
- 📿 **أسماء الله الحسنى** — الـ 99 اسماً مع المعاني واختبار تفاعلي
- 📖 **المكتبة الإسلامية** — أمهات الكتب الإسلامية

---

## 🚀 التثبيت والنشر

### التثبيت كتطبيق (PWA)
1. افتح الموقع في المتصفح
2. اضغط **"إضافة إلى الشاشة الرئيسية"** (iOS/Android) أو **"تثبيت التطبيق"** (Chrome)
3. يعمل الآن بشكل كامل بدون إنترنت ✅

### النشر على GitHub Pages
```bash
# 1. استنسخ المستودع
git clone https://github.com/your-username/islamic-encyclopedia.git

# 2. ادفع الكود
git add .
git commit -m "Initial deployment"
git push origin main

# 3. فعّل GitHub Pages من:
# Settings → Pages → Source: main branch / root
```

> **ملاحظة:** يحتوي الموقع على ملف `.nojekyll` لضمان عمل ملفات `_underscore` على GitHub Pages.

---

## 🛠️ التقنيات المستخدمة

- **HTML5 / CSS3 / Vanilla JavaScript** — بدون frameworks
- **Service Worker API** — للعمل أوفلاين والتخزين المؤقت
- **IndexedDB** — لقواعد البيانات المحلية
- **Web App Manifest** — لدعم PWA
- **Bootstrap 5** — للتخطيط والمكونات
- **Adhan.js** — لحساب مواقيت الصلاة

---

## 📁 هيكل الملفات

```
islamic-encyclopedia/
├── index.html              # الصفحة الرئيسية
├── hadith.html             # الحديث الشريف
├── fiqh.html               # الفقه الإسلامي
├── recitations.html        # التلاوات القرآنية
├── ...                     # بقية الصفحات
├── script.js               # المنطق الرئيسي للموقع
├── sw.js                   # Service Worker
├── manifest.json           # PWA Manifest
├── offline_db.js           # قاعدة بيانات IndexedDB
├── styles.css              # الأنماط الرئيسية
├── responsive.css          # الاستجابة للأجهزة
└── icons/                  # أيقونات التطبيق
```

---

## 🤝 المساهمة

المساهمات مرحب بها! يرجى:
1. عمل Fork للمستودع
2. إنشاء branch جديد: `git checkout -b feature/اسم-الميزة`
3. Commit التغييرات: `git commit -m 'إضافة ميزة جديدة'`
4. Push: `git push origin feature/اسم-الميزة`
5. فتح Pull Request

---

## 📄 الرخصة

هذا المشروع مرخص تحت [رخصة MIT](LICENSE).

---

<div align="center">

**بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ**

صُنع بـ ❤️ لخدمة الإسلام والمسلمين

</div>
