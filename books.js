const booksData = [
    {
        "id": "quran",
        "icon": "quran",
        "title": "تفسير ابن كثير",
        "author": "الإمام ابن كثير",
        "categoryName": "علوم القرآن"
    },
    {
        "id": "quran",
        "icon": "quran",
        "title": "تفسير القرطبي",
        "author": "الإمام القرطبي",
        "categoryName": "علوم القرآن"
    },
    {
        "id": "quran",
        "icon": "book-open",
        "title": "الإتقان في علوم القرآن",
        "author": "جلال الدين السيوطي",
        "categoryName": "علوم القرآن"
    },
    {
        "id": "quran",
        "icon": "quran",
        "title": "تفسير البغوي",
        "author": "الإمام البغوي",
        "categoryName": "علوم القرآن"
    },
    {
        "id": "quran",
        "icon": "quran",
        "title": "تفسير الجلالين",
        "author": "السيوطي والمحلي",
        "categoryName": "علوم القرآن"
    },
    {
        "id": "quran",
        "icon": "quran",
        "title": "أضواء البيان",
        "author": "الشنقيطي",
        "categoryName": "علوم القرآن"
    },
    {
        "id": "quran",
        "icon": "book-open",
        "title": "مباحث في علوم القرآن",
        "author": "مناع القطان",
        "categoryName": "علوم القرآن"
    },
    {
        "id": "quran",
        "icon": "quran",
        "title": "التحرير والتنوير",
        "author": "ابن عاشور",
        "categoryName": "علوم القرآن"
    },
    {
        "id": "quran",
        "icon": "quran",
        "title": "الكشاف",
        "author": "الزمخشري",
        "categoryName": "علوم القرآن"
    },
    {
        "id": "quran",
        "icon": "quran",
        "title": "تيسير الكريم الرحمن",
        "author": "السعدي",
        "categoryName": "علوم القرآن"
    },
    {
        "id": "quran",
        "icon": "book-open",
        "title": "البرهان في علوم القرآن",
        "author": "الزركشي",
        "categoryName": "علوم القرآن"
    },
    {
        "id": "quran",
        "icon": "book-open",
        "title": "مناهل العرفان",
        "author": "الزرقاني",
        "categoryName": "علوم القرآن"
    },
    {
        "id": "hadith",
        "icon": "scroll",
        "title": "صحيح البخاري",
        "author": "الإمام البخاري",
        "categoryName": "الحديث الشريف"
    },
    {
        "id": "hadith",
        "icon": "scroll",
        "title": "صحيح مسلم",
        "author": "الإمام مسلم",
        "categoryName": "الحديث الشريف"
    },
    {
        "id": "hadith",
        "icon": "scroll",
        "title": "رياض الصالحين",
        "author": "الإمام النووي",
        "categoryName": "الحديث الشريف"
    },
    {
        "id": "hadith",
        "icon": "scroll",
        "title": "سنن ابن ماجه",
        "author": "الإمام ابن ماجه",
        "categoryName": "الحديث الشريف"
    },
    {
        "id": "hadith",
        "icon": "scroll",
        "title": "مسند الإمام أحمد",
        "author": "الإمام أحمد بن حنبل",
        "categoryName": "الحديث الشريف"
    },
    {
        "id": "hadith",
        "icon": "scroll",
        "title": "بلوغ المرام",
        "author": "ابن حجر العسقلاني",
        "categoryName": "الحديث الشريف"
    },
    {
        "id": "hadith",
        "icon": "scroll",
        "title": "الأربعون النووية",
        "author": "الإمام النووي",
        "categoryName": "الحديث الشريف"
    },
    {
        "id": "hadith",
        "icon": "scroll",
        "title": "فتح الباري شرح صحيح البخاري",
        "author": "ابن حجر العسقلاني",
        "categoryName": "شروح الحديث"
    },
    {
        "id": "hadith",
        "icon": "scroll",
        "title": "شرح صحيح مسلم",
        "author": "الإمام النووي",
        "categoryName": "شروح الحديث"
    },
    {
        "id": "hadith",
        "icon": "scroll",
        "title": "نزهة النظر",
        "author": "ابن حجر العسقلاني",
        "categoryName": "مصطلح الحديث"
    },
    {
        "id": "hadith",
        "icon": "scroll",
        "title": "مقدمة ابن الصلاح",
        "author": "ابن الصلاح",
        "categoryName": "مصطلح الحديث"
    },
    {
        "id": "hadith",
        "icon": "scroll",
        "title": "عمدة الأحكام",
        "author": "عبد الغني المقدسي",
        "categoryName": "أحاديث الأحكام"
    },
    {
        "id": "fiqh",
        "icon": "balance-scale",
        "title": "المغني",
        "author": "ابن قدامة المقدسي",
        "categoryName": "الفقه الحنبلي"
    },
    {
        "id": "fiqh",
        "icon": "balance-scale",
        "title": "المبسوط",
        "author": "السرخسي",
        "categoryName": "الفقه الحنفي"
    },
    {
        "id": "fiqh",
        "icon": "balance-scale",
        "title": "الأم",
        "author": "الإمام الشافعي",
        "categoryName": "الفقه الشافعي"
    },
    {
        "id": "fiqh",
        "icon": "balance-scale",
        "title": "المجموع شرح المهذب",
        "author": "الإمام النووي",
        "categoryName": "الفقه الشافعي"
    },
    {
        "id": "fiqh",
        "icon": "balance-scale",
        "title": "الهداية شرح البداية",
        "author": "المرغيناني",
        "categoryName": "الفقه الحنفي"
    },
    {
        "id": "fiqh",
        "icon": "balance-scale",
        "title": "رد المحتار (حاشية ابن عابدين)",
        "author": "ابن عابدين",
        "categoryName": "الفقه الحنفي"
    },
    {
        "id": "fiqh",
        "icon": "balance-scale",
        "title": "الرسالة",
        "author": "ابن أبي زيد القيرواني",
        "categoryName": "الفقه المالكي"
    },
    {
        "id": "fiqh",
        "icon": "balance-scale",
        "title": "زاد المستقنع",
        "author": "الحجاوي",
        "categoryName": "الفقه الحنبلي"
    },
    {
        "id": "fiqh",
        "icon": "balance-scale",
        "title": "سبل السلام",
        "author": "الصنعاني",
        "categoryName": "فقه الحديث"
    },
    {
        "id": "fiqh",
        "icon": "balance-scale",
        "title": "روضة الطالبين",
        "author": "الإمام النووي",
        "categoryName": "الفقه الشافعي"
    },
    {
        "id": "fiqh",
        "icon": "balance-scale",
        "title": "حاشية الدسوقي",
        "author": "الدسوقي",
        "categoryName": "الفقه المالكي"
    },
    {
        "id": "fiqh",
        "icon": "balance-scale",
        "title": "كشاف القناع",
        "author": "البهوتي",
        "categoryName": "الفقه الحنبلي"
    },
    {
        "id": "fiqh",
        "icon": "balance-scale",
        "title": "الموافقات في أصول الشريعة",
        "author": "الشاطبي",
        "categoryName": "أصول الفقه"
    },
    {
        "id": "fiqh",
        "icon": "balance-scale",
        "title": "المستصفى",
        "author": "الغزالي",
        "categoryName": "أصول الفقه"
    },
    {
        "id": "fiqh",
        "icon": "balance-scale",
        "title": "الأشباه والنظائر",
        "author": "السيوطي",
        "categoryName": "القواعد الفقهية"
    },
    {
        "id": "aqeedah",
        "icon": "heart",
        "title": "العقيدة الواسطية",
        "author": "ابن تيمية",
        "categoryName": "العقيدة"
    },
    {
        "id": "aqeedah",
        "icon": "heart",
        "title": "شرح الطحاوية",
        "author": "ابن أبي العز الحنفي",
        "categoryName": "العقيدة"
    },
    {
        "id": "aqeedah",
        "icon": "heart",
        "title": "لمعة الاعتقاد",
        "author": "ابن قدامة المقدسي",
        "categoryName": "العقيدة"
    },
    {
        "id": "aqeedah",
        "icon": "heart",
        "title": "العقيدة الحموية",
        "author": "ابن تيمية",
        "categoryName": "العقيدة"
    },
    {
        "id": "aqeedah",
        "icon": "heart",
        "title": "الإيمان",
        "author": "ابن تيمية",
        "categoryName": "العقيدة"
    },
    {
        "id": "aqeedah",
        "icon": "heart",
        "title": "شرح السنة",
        "author": "البربهاري",
        "categoryName": "العقيدة"
    },
    {
        "id": "aqeedah",
        "icon": "heart",
        "title": "الإبانة عن أصول الديانة",
        "author": "أبو الحسن الأشعري",
        "categoryName": "العقيدة"
    },
    {
        "id": "aqeedah",
        "icon": "heart",
        "title": "معارج القبول",
        "author": "حافظ حكمي",
        "categoryName": "العقيدة"
    },
    {
        "id": "aqeedah",
        "icon": "heart",
        "title": "شرح الفقه الأكبر",
        "author": "ملا علي القاري",
        "categoryName": "العقيدة"
    },
    {
        "id": "aqeedah",
        "icon": "heart",
        "title": "درء تعارض العقل والنقل",
        "author": "ابن تيمية",
        "categoryName": "العقيدة"
    },
    {
        "id": "aqeedah",
        "icon": "heart",
        "title": "نونية القحطاني",
        "author": "الإمام القحطاني",
        "categoryName": "العقيدة"
    },
    {
        "id": "seerah",
        "icon": "history",
        "title": "الرحيق المختوم",
        "author": "صفي الرحمن المباركفوري",
        "categoryName": "السيرة النبوية"
    },
    {
        "id": "seerah",
        "icon": "history",
        "title": "البداية والنهاية",
        "author": "ابن كثير",
        "categoryName": "التاريخ الإسلامي"
    },
    {
        "id": "quran",
        "icon": "quran",
        "title": "تفسير الطبري",
        "author": "الإمام الطبري",
        "categoryName": "علوم القرآن"
    },
    {
        "id": "quran",
        "icon": "quran",
        "title": "تفسير السعدي",
        "author": "الشيخ السعدي",
        "categoryName": "علوم القرآن"
    },
    {
        "id": "hadith",
        "icon": "scroll",
        "title": "سنن أبي داود",
        "author": "الإمام أبو داود",
        "categoryName": "الحديث الشريف"
    },
    {
        "id": "hadith",
        "icon": "scroll",
        "title": "جامع الترمذي",
        "author": "الإمام الترمذي",
        "categoryName": "الحديث الشريف"
    },
    {
        "id": "hadith",
        "icon": "scroll",
        "title": "سنن النسائي",
        "author": "الإمام النسائي",
        "categoryName": "الحديث الشريف"
    },
    {
        "id": "hadith",
        "icon": "scroll",
        "title": "موطأ الإمام مالك",
        "author": "الإمام مالك",
        "categoryName": "الحديث الشريف"
    },
    {
        "id": "fiqh",
        "icon": "balance-scale",
        "title": "بداية المجتهد",
        "author": "ابن رشد الحفيد",
        "categoryName": "الفقه المقارن"
    },
    {
        "id": "aqeedah",
        "icon": "heart",
        "title": "كتاب التوحيد",
        "author": "محمد بن عبد الوهاب",
        "categoryName": "العقيدة"
    },
    {
        "id": "tazkiyah",
        "icon": "leaf",
        "title": "مدارج السالكين",
        "author": "ابن قيم الجوزية",
        "categoryName": "التزكية والرقائق"
    },
    {
        "id": "tazkiyah",
        "icon": "leaf",
        "title": "الوابل الصيب",
        "author": "ابن قيم الجوزية",
        "categoryName": "التزكية والرقائق"
    },
    {
        "id": "tazkiyah",
        "icon": "leaf",
        "title": "إحياء علوم الدين",
        "author": "الغزالي",
        "categoryName": "التزكية والرقائق"
    },
    {
        "id": "tazkiyah",
        "icon": "leaf",
        "title": "الفوائد",
        "author": "ابن قيم الجوزية",
        "categoryName": "التزكية والرقائق"
    },
    {
        "id": "tazkiyah",
        "icon": "leaf",
        "title": "طريق الهجرتين",
        "author": "ابن قيم الجوزية",
        "categoryName": "التزكية والرقائق"
    },
    {
        "id": "tazkiyah",
        "icon": "leaf",
        "title": "منهاج العابدين",
        "author": "الغزالي",
        "categoryName": "التزكية والرقائق"
    },
    {
        "id": "tazkiyah",
        "icon": "leaf",
        "title": "مختصر منهاج القاصدين",
        "author": "ابن قدامة المقدسي",
        "categoryName": "التزكية والرقائق"
    },
    {
        "id": "tazkiyah",
        "icon": "leaf",
        "title": "الداء والدواء",
        "author": "ابن قيم الجوزية",
        "categoryName": "التزكية والرقائق"
    },
    {
        "id": "tazkiyah",
        "icon": "leaf",
        "title": "صيد الخاطر",
        "author": "ابن الجوزي",
        "categoryName": "التزكية والرقائق"
    },
    {
        "id": "tazkiyah",
        "icon": "leaf",
        "title": "تلبيس إبليس",
        "author": "ابن الجوزي",
        "categoryName": "التزكية والرقائق"
    },
    {
        "id": "tazkiyah",
        "icon": "leaf",
        "title": "أيها الولد",
        "author": "الإمام الغزالي",
        "categoryName": "التزكية والرقائق"
    },
    {
        "id": "tazkiyah",
        "icon": "leaf",
        "title": "حلية الأولياء",
        "author": "أبو نعيم الأصبهاني",
        "categoryName": "التزكية والرقائق"
    },
    {
        "id": "tazkiyah",
        "icon": "leaf",
        "title": "صفة الصفوة",
        "author": "ابن الجوزي",
        "categoryName": "التزكية والرقائق"
    },
    {
        "id": "tazkiyah",
        "icon": "leaf",
        "title": "الحكم العطائية",
        "author": "ابن عطاء الله السكندري",
        "categoryName": "التزكية والرقائق"
    },
    {
        "id": "seerah",
        "icon": "history",
        "title": "سيرة ابن هشام",
        "author": "ابن هشام",
        "categoryName": "السيرة النبوية"
    },
    {
        "id": "seerah",
        "icon": "history",
        "title": "زاد المعاد في هدي خير العباد",
        "author": "ابن قيم الجوزية",
        "categoryName": "السيرة النبوية"
    },
    {
        "id": "seerah",
        "icon": "history",
        "title": "السيرة النبوية (عرض وقائع وتحليل أحداث)",
        "author": "علي محمد الصلابي",
        "categoryName": "السيرة النبوية"
    },
    {
        "id": "seerah",
        "icon": "history",
        "title": "فقه السيرة",
        "author": "محمد الغزالي",
        "categoryName": "السيرة النبوية"
    },
    {
        "id": "seerah",
        "icon": "history",
        "title": "نور اليقين في سيرة سيد المرسلين",
        "author": "محمد الخضري بك",
        "categoryName": "السيرة النبوية"
    },
    {
        "id": "seerah",
        "icon": "history",
        "title": "تاريخ الأمم والملوك",
        "author": "محمد بن جرير الطبري",
        "categoryName": "التاريخ الإسلامي"
    },
    {
        "id": "seerah",
        "icon": "history",
        "title": "الكامل في التاريخ",
        "author": "ابن الأثير",
        "categoryName": "التاريخ الإسلامي"
    },
    {
        "id": "seerah",
        "icon": "history",
        "title": "تاريخ الخلفاء",
        "author": "جلال الدين السيوطي",
        "categoryName": "التاريخ الإسلامي"
    },
    {
        "id": "seerah",
        "icon": "history",
        "title": "مقدمة ابن خلدون",
        "author": "ابن خلدون",
        "categoryName": "التاريخ الإسلامي"
    },
    {
        "id": "seerah",
        "icon": "history",
        "title": "سير أعلام النبلاء",
        "author": "الذهبي",
        "categoryName": "التاريخ الإسلامي"
    },
    {
        "id": "seerah",
        "icon": "history",
        "title": "الدولة الأموية",
        "author": "يوسف العش",
        "categoryName": "التاريخ الإسلامي"
    },
    {
        "id": "seerah",
        "icon": "history",
        "title": "تاريخ الدولة العلية العثمانية",
        "author": "محمد فريد بك",
        "categoryName": "التاريخ الإسلامي"
    },
    {
        "id": "seerah",
        "icon": "history",
        "title": "المنتظم في تاريخ الملوك والأمم",
        "author": "ابن الجوزي",
        "categoryName": "التاريخ الإسلامي"
    },
    {
        "id": "seerah",
        "icon": "history",
        "title": "قصص الأنبياء",
        "author": "ابن كثير",
        "categoryName": "التاريخ الإسلامي"
    },
    {
        "id": "seerah",
        "icon": "history",
        "title": "السيرة النبوية للدكتور مهدي رزق الله",
        "author": "مهدي رزق الله أحمد",
        "categoryName": "السيرة النبوية"
    },
    {
        "id": "seerah",
        "icon": "history",
        "title": "أطلس السيرة النبوية",
        "author": "شوقي أبو خليل",
        "categoryName": "السيرة النبوية"
    },
    {
        "id": "seerah",
        "icon": "history",
        "title": "عبقرية محمد",
        "author": "عباس محمود العقاد",
        "categoryName": "السيرة النبوية"
    },
    {
        "id": "seerah",
        "icon": "history",
        "title": "تاريخ الإسلام الثقافي والسياسي",
        "author": "صائب عبد الحميد",
        "categoryName": "التاريخ الإسلامي"
    },
    {
        "id": "aqeedah",
        "icon": "shield",
        "title": "العقيدة الطحاوية",
        "author": "أبو جعفر الطحاوي",
        "categoryName": "العقيدة الإسلامية"
    },
    {
        "id": "aqeedah",
        "icon": "shield",
        "title": "شرح العقيدة الطحاوية",
        "author": "ابن أبي العز الحنفي",
        "categoryName": "العقيدة الإسلامية"
    },
    {
        "id": "aqeedah",
        "icon": "shield",
        "title": "سلم الوصول إلى علم الأصول",
        "author": "حافظ الحكمي",
        "categoryName": "العقيدة الإسلامية"
    },
    {
        "id": "aqeedah",
        "icon": "shield",
        "title": "لمعة الاعتقاد الهادي إلى سبيل الرشاد",
        "author": "ابن قدامة المقدسي",
        "categoryName": "العقيدة الإسلامية"
    },
    {
        "id": "aqeedah",
        "icon": "shield",
        "title": "الأسماء والصفات",
        "author": "البيهقي",
        "categoryName": "العقيدة الإسلامية"
    },
    {
        "id": "aqeedah",
        "icon": "shield",
        "title": "التوحيد وإثبات صفات الرب",
        "author": "ابن خزيمة",
        "categoryName": "العقيدة الإسلامية"
    },
    {
        "id": "aqeedah",
        "icon": "shield",
        "title": "فتح المجيد شرح كتاب التوحيد",
        "author": "عبد الرحمن بن حسن آل الشيخ",
        "categoryName": "العقيدة الإسلامية"
    },
    {
        "id": "aqeedah",
        "icon": "shield",
        "title": "عقيدة السلف وأصحاب الحديث",
        "author": "أبو عثمان الصابوني",
        "categoryName": "العقيدة الإسلامية"
    },
    {
        "id": "aqeedah",
        "icon": "shield",
        "title": "منهاج السنة النبوية",
        "author": "ابن تيمية",
        "categoryName": "العقيدة الإسلامية"
    },
    {
        "id": "aqeedah",
        "icon": "shield",
        "title": "لوامع الأنوار البهية",
        "author": "السفاريني",
        "categoryName": "العقيدة الإسلامية"
    },
    {
        "id": "aqeedah",
        "icon": "shield",
        "title": "خلق أفعال العباد",
        "author": "الإمام البخاري",
        "categoryName": "العقيدة الإسلامية"
    },
    {
        "id": "aqeedah",
        "icon": "shield",
        "title": "الشفاعة",
        "author": "مقبل بن هادي الوادعي",
        "categoryName": "العقيدة الإسلامية"
    },
    {
        "id": "aqeedah",
        "icon": "shield",
        "title": "القواعد المثلى في صفات الله وأسمائه الحسنى",
        "author": "محمد بن صالح العثيمين",
        "categoryName": "العقيدة الإسلامية"
    },
    {
        "id": "aqeedah",
        "icon": "shield",
        "title": "التدمرية",
        "author": "ابن تيمية",
        "categoryName": "العقيدة الإسلامية"
    },
    {
        "id": "aqeedah",
        "icon": "shield",
        "title": "الوجيز في عقيدة السلف الصالح",
        "author": "عبد الله بن عبد الحميد الأثري",
        "categoryName": "العقيدة الإسلامية"
    }
];
