export const translations = {
  uz: {
    // Navigation & Tasks
    tasksTitle: "O'quv Topshiriqlari",
    task1Tab: "1. Loyihalash",
    task2Tab: "2. Diagnostika (10m)",
    task3Tab: "3. RJ-45 Siqish",
    task4Tab: "4. VLAN & IP",
    taskLockedTip: "Avvalgi topshiriqni yakunlang!",
    task1UnlockedTask2Toast: "Tabriklaymiz! 1-topshiriq himoya qilindi. 2-topshiriq (Diagnostika) ochildi!",
    task2UnlockedTask3Toast: "Ajoyib! Avariya bartaraf etildi. 3-topshiriq (RJ-45 Kabel) ochildi!",
    task3UnlockedTask4Toast: "Zo'r! Kabel muvaffaqiyatli siqildi. 4-topshiriq (VLAN) ochildi!",
    task4CompletedToast: "Tabriklaymiz! Barcha 4 ta topshiriq a'lo darajada yakunlandi! Sertifikat tayyor!",
    nextTaskBtn: "Keyingi topshiriqqa o'tish ➔",

    // Header & Meta (Task 1)
    appTitle: "Tarmoq Loyihasi: 10 Kishilik Ofis",
    appSubtitle: "8-sinf Informatika darsi amaliy simulyatori",
    roleBadge: "Tarmoq Muhandisi",
    budgetTitle: "Byudjet",
    budgetSpent: "Sarflangan",
    budgetLimit: "Cheklov",
    budgetRemaining: "Qoldi",
    budgetOver: "Byudjetdan oshib ketdi!",
    challengeToggle: "Chellenj -10%",
    challengeDesc: "Qat'iy $225 byudjet cheklovi!",
    challengeActiveBadge: "Chellenj Faol ($225)",
    seniorBadgeTitle: "Senior Muhandis",
    timerTitle: "Vaqt",
    timerChallengeLabel: "60s Sinov",
    pause: "To'xtatish",
    resume: "Davom etish",
    reset: "Qayta boshlash",
    soundOn: "Ovoz yoniq",
    soundOff: "Ovoz o'chiq",

    // Actions
    evaluateBtn: "Loyihani Himoya Qilish",
    pingTestBtn: "Ping Testi (Tarmoqni tekshirish)",
    clientCallBtn: "Mijoz Qo'ng'irog'i",
    resetBtn: "Qayta o'rnatish",
    undoBtn: "Bekor qilish",

    // Checklist HUD
    checklistTitle: "Asosiy Talablar (Nazorat ro'yxati)",
    reqIspRouter: "Internet (ISP) Wi-Fi routerga ulangan",
    reqSwitchRouter: "16 portli Switch routerga LAN orqali ulangan",
    reqPcsPrinter: "10 ta PC va 1 ta printer switchga ulangan",
    reqGuestWifi: "Mehmon Wi-Fi (Guest Zone) faollashtirilgan",
    reqSecurity: "5 ta kiberxavfsizlik chorasi yoqilgan",

    // Shop & Hardware
    hardwareShopTitle: "Uskunalar Do'koni",
    hardwareShopDesc: "Tarmoq arxitekturasi uchun zarur uskunalarni tanlang",
    hardwareInstalled: "O'rnatildi",
    hardwareAdd: "Qo'shish",
    hardwareRemove: "Olib tashlash",
    hardwareQty: "Soni",
    portsLabel: "Portlar",

    // Hardware items
    ispTitle: "Internet (ISP provayder)",
    ispDesc: "Yuqori tezlikdagi optik tolali tashqi Internet kanali",
    ispSpecs: "1 Gbps Optik aloqa, WAN kirish",

    routerTitle: "Wi-Fi Router (Dual-Band)",
    routerDesc: "2.4GHz va 5GHz tarmoqli asosiy marshrutizator",
    routerSpecs: "1 WAN port, 4 LAN port, Wi-Fi 6, DHCP server",

    switch16Title: "16 portli Gigabit Switch",
    switch16Desc: "10 ta PC, printer va routerni ulash uchun ideal kommutator",
    switch16Specs: "16x 1000Mbps RJ-45 port (12 tasi band, 4 tasi zaxira)",

    switch8Title: "8 portli Switch (Ehtiyot bo'ling!)",
    switch8Desc: "Arzon, ammo portlari yetarli bo'lmagan kommutator",
    switch8Specs: "8x 100Mbps port (Maksimal 7 ta qurilma ulanishi mumkin)",
    switch8WarningBadge: "Tuzoq xavfi!",

    pcTitle: "Ofis Kompyuteri (Ish o'rni)",
    pcDesc: "Xodimlar uchun ishchi kompyuter (tarmoq kartasi va sozlash)",
    pcSpecs: "Gigabit Ethernet, IP: 192.168.1.1X",
    addPcOne: "+1 PC",
    addPcFive: "+5 PC",
    addPcTen: "+10 PC (To'liq)",

    printerTitle: "Tarmoq Printeri",
    printerDesc: "Barcha 10 ta kompyuter foydalanishi mumkin bo'lgan umumiy printer",
    printerSpecs: "RJ-45 tarmoq porti, IP: 192.168.1.50",

    cablesTitle: "UTP Kabellar to'plami & RJ45",
    cablesDesc: "Cat5e kabel o'rami (100m) va 30 ta RJ45 konnektorlari",
    cablesSpecs: "Qurilmalarni bir-biriga ulash uchun majburiy!",
    cablesMissingWarning: "Kabellar xarid qilinmagan! Uskunalar o'zaro bog'lanmagan!",

    // 5 Security Measures
    securityTitle: "5 Kiberxavfsizlik Qoidasi",
    securityDesc: "Ofis tarmog'ini himoyalash uchun barcha 5 chorani yoqing ($0)",
    securityAllPassed: "Barcha 5 ta himoya chorasi faollashtirildi!",
    securityMissing: "Kiberxavfsizlik choralari to'liq yoqilmagan!",

    secGuestIsolationTitle: "1. Mehmon Wi-Fi Izolyatsiyasi",
    secGuestIsolationDesc: "Mijozlar ofis kompyuterlari va printeriga kira olmaydi (VLAN / AP Isolation).",

    secWpa3Title: "2. WPA2/WPA3 Kuchli Parol",
    secWpa3Desc: "Kamida 12 belgidan iborat, shifrlangan Wi-Fi paroli (buzib kirishdan himoya).",

    secAdminPassTitle: "3. Router Admin Parolini O'zgartirish",
    secAdminPassDesc: "Standart 'admin/admin' zavod paroli murakkab parolgacha yangilandi.",

    secFirewallTitle: "4. Tarmoqlararo Ekran (Firewall)",
    secFirewallDesc: "Tashqi shubhali trafik, DOS hujumlari va ochiq portlarni skanerlashni to'sadi.",

    secAntivirusTitle: "5. Antivirus va OT Yangilanishi",
    secAntivirusDesc: "10 ta kompyuterda litsenziyali antivirus va xavfsizlik yangilanishlari o'rnatildi.",

    // Canvas & Topology
    canvasTitle: "Tarmoq Topologiyasi (diagrams.net uslubida)",
    canvasSubtitle: "Yulduzsimon (Star) topologiya asosida yig'ilgan mahalliy tarmoq",
    zoomIn: "Kattalashtirish",
    zoomOut: "Kichiklashtirish",
    zoomReset: "Markazlashtirish",
    legendCable: "UTP LAN Kabeli (1 Gbps)",
    legendWifi: "Simsiz Mehmon Wi-Fi (Izolyatsiyalangan)",
    legendPacket: "Tarmoq ma'lumotlar paketi",
    statusOnline: "Faol / Ishlamoqda",
    statusWarning: "Xatolik mavjud",
    statusOffline: "Ulanmagan",
    portsUsedStatus: "port band",

    // Client Call Dynamic Event
    incomingCallTitle: "KIRUVCHI QO'NG'IROQ!",
    callerName: "Ofis Rahbari (Buyurtmachi)",
    callerRole: "Bosh Direktor",
    callAudioRinging: "Telefon jiringlamoqda...",
    callMessage: "«Salom, muhandis! Ofisimizga mijozlar va hamkorlar juda ko'p tashrif buyurmoqda. Zudlik bilan bizga alohida 'Mehmon Wi-Fi (Guest Zone)' ulab bering! Lekin diqqat qiling: mehmonlar hech qanday holatda ichki ofis kompyuterlari va printerimizga ulanolmasin, izolyatsiya qiling!»",
    acceptCallBtn: "Talabni qabul qilish (+Mehmon Wi-Fi)",
    declineCallBtn: "Keyinroq ko'rish",
    callAcceptedToast: "Buyurtmachi talabi qabul qilindi! Mehmon Wi-Fi tarmog'i yoqildi.",

    // Trap Alert
    trapModalTitle: "OGOHLANTIRISH: 8-PORTLI SWITCHOV TUZOG'I!",
    trapSubtitle: "Portlar yetishmovchiligi xatosi aniqlandi!",
    trapExplanation: "Siz 8 portli switchni tanladingiz. Hisob-kitob qilamiz:\n• 1 ta port routerni ulashga ketadi (Uplink)\n• Qolgan portlar soni: atigi 7 ta!\n• Ammo ofisda 10 ta kompyuter + 1 ta printer = 11 ta port kerak!\n\nNatijada 4 ta xodim kompyutersiz va internetsiz qoladi!",
    trapFixBtn: "16 portli Switchga almashtirish (+$30)",
    trapDismissBtn: "Tushundim, o'zim to'g'rilayman",

    // Ping Test
    pingModalTitle: "ICMP Tarmoq Diagnostikasi (Ping Test)",
    pingStarting: "Paketlar yuborilmoqda: PC-01 -> Router -> Internet (ISP)...",
    pingSuccessText: "Muammo yo'q! Barcha 10 ta kompyuter va printer orqali paketlar muvaffaqiyatli o'tdi. Kechikish (Latency): 1ms, Yo'qotish: 0%.",
    pingFailText: "Tarmoqda uzilish bor! Kabellar to'plami yoki router/switch ulanishlarini tekshiring.",
    closeBtn: "Yopish",

    // Presentation Defense Modal (Loyihani Himoya Qilish)
    defenseTitle: "Loyihani Himoya Qilish (Prezentatsiya)",
    defenseSubtitle: "8-sinf Informatika darsi uchun 60 soniyalik himoya nutqi va baholash",
    defenseScoreLabel: "Umumiy Baho",
    defenseReadyToPresent: "Loyiha muvaffaqiyatli himoyaga tayyor!",
    defenseNeedsWork: "Loyihada kamchiliklar mavjud, qayta ko'rib chiqing!",
    copySpeechBtn: "Nutq matnidan nusxa olish",
    speechCopiedToast: "60 soniyalik nutq matni xotiraga nusxalandi!",
    rehearseTimerBtn: "Nutq Taymeri (60 sek)",
    timerRunningLabel: "Nutq vaqti ketmoqda...",
    timerFinishedLabel: "Vaqt tugadi! Ajoyib chiqish!",

    // 60-Second Speech Segments
    speechTitle: "60 Soniyalik Loyiha Taqdimoti Nutqi (Darsda o'qish uchun)",
    speechText: `Assalomu alaykum, hurmatli ustoz va sinfdoshlar!

Men bugun 10 kishilik ofis uchun ishlab chiqqan xavfsiz va tejamkor mahalliy tarmoq (LAN) loyihamni himoya qilaman.

1. TOPOLOGIYA VA USKUNALAR [0-15 sek]:
Ofisimiz uchun eng ishonchli bo'lgan «Yulduzsimon» (Star) topologiyasini tanladim. Internet provayderdan kelayotgan optik tolali kabel Dual-Band Wi-Fi routerga ulandi. Routerning LAN portidan 16 portli Gigabit kommutatorga (Switch) asosiy aloqa o'rnatildi.

2. QURILMALAR VA ZAXIRA [15-30 sek]:
Kommutatorga 10 ta xodimning ishchi kompyuteri va 1 ta umumiy tarmoq printeri UTP Cat5e kabellari orqali ulandi. 8 portli emas, aynan 16 portli switch tanlaganimning sababi — 12 ta port darhol band bo'ldi va kelajakda ofis kengayishi uchun 4 ta zaxira port qoldirildi.

3. KIBERXAVFSIZLIK VA MEHMON WI-FI [30-45 sek]:
Buyurtmachining talabiga binoan alohida «Mehmon Wi-Fi» zonasi ochildi va u asosiy ofis tarmog'idan to'liq izolyatsiya qilindi. Tarmoqni xakerlardan himoyalash uchun WPA3 shifrlash, router admin parolini almashtirish, tarmoqlararo ekran (Firewall) hamda har bir kompyuterda antivirus yangilanishi yoqildi.

4. IQTISODIY TEJAMKORLIK VA XULOSA [45-60 sek]:
Loyiha belgilangan $250 byudjet me'yoriga to'liq mos keldi (jami $225 sarflandi va hatto -10% chellenj sharti ham a'lo darajada bajarildi). Tarmoq yuqori tezlikda va uzilishlarsiz ishlamoqda. 

E'tiboringiz uchun rahmat, savollaringizga javob berishga tayyorman!`,

    // Badges
    badgeMaster: "Tarmoq Magistri (100 ball)",
    badgeMasterDesc: "Topologiya va xavfsizlik talablari benuqson bajarildi",
    badgeSenior: "Senior Tarmoq Muhandisi",
    badgeSeniorDesc: "Qiyin -10% chellenj rejimida ($225 ichida) g'alaba qozondi!",
    badgeSecurity: "Kiberxavfsizlik Qalqoni",
    badgeSecurityDesc: "Barcha 5 ta xavfsizlik chorasi to'liq faollashtirildi",
    badgeBudget: "Tejamkor Muhandis",
    badgeBudgetDesc: "Byudjet limitidan bir dollar ham oshirmasdan yig'ildi",

    // Device Inspector
    inspectorTitle: "Qurilma Tafsilotlari va Xususiyatlari",
    roleLabel: "Vazifasi",
    ipLabel: "IP Manzili",
    macLabel: "MAC Manzili",
    portSpeedLabel: "Port Tezligi",
    gatewayLabel: "Shlyuz (Gateway)",
    maskLabel: "Tarmoq Niqobi (Subnet Mask)",
    curriculumNote: "8-sinf Darsligidan ma'lumot",

    // TASK 2: TROUBLESHOOTING TRANSLATIONS
    task2Title: "2-Topshiriq: Tarmoq Avariyasi va Diagnostika",
    task2Subtitle: "Ofis tarmog'i ishdan chiqdi! 10 daqiqa ichida 3 ta nosozlikni toping va tuzating.",
    task2TimerLabel: "Avariya Taymeri (10 daqiqa):",
    task2IncidentsResolved: "Nosozliklar bartaraf etildi",
    
    // Incident 1
    inc1Title: "1. IP-Manzillar To'qnashuvi (IP Conflict)",
    inc1Desc: "PC-03 va PC-07 bir xil IP manzilga (192.168.1.13) ega bo'lib qolgan. Natijada ikkala kompyuter ham tarmoqdan uzilgan!",
    inc1Action: "PC-07 IP manzilini to'g'rilash (192.168.1.17 ga almashtirish)",
    inc1Fixed: "IP to'qnashuvi bartaraf etildi (PC-07: 192.168.1.17)",

    // Incident 2
    inc2Title: "2. Noto'g'ri Standart Shlyuz (Wrong Gateway)",
    inc2Desc: "PC-05 internetga chiqa olmayapti. Tekshiruvda uning Default Gateway manzili 192.168.0.1 deb xato yozilganligi aniqlandi!",
    inc2Action: "Shlyuzni router IP manzili (192.168.1.1) ga to'g'rilash",
    inc2Fixed: "Shlyuz to'g'rilandi (Gateway: 192.168.1.1)",

    // Incident 3
    inc3Title: "3. Kiberhujum / Virusli Kompyuter (DDoS Bot)",
    inc3Desc: "PC-09 xodimi noma'lum fleshka ulab virus yuqtirgan! Kompyuterdan tarmoqqa millionlab soxta so'rovlar oqib kelib, switchni qizdirmoqda.",
    inc3Action: "PC-09 ni tarmoqdan ajratish va Antivirus tozalashni ishga tushirish",
    inc3Fixed: "Zararli dastur yo'q qilindi va PC-09 xavfsiz holatga keltirildi!",

    task2SuccessTitle: "Avariya to'liq bartaraf etildi!",
    task2SuccessDesc: "Ofis tarmog'i yana barqaror ishlayapti. 3-topshiriq (RJ-45 Kabel siqish) ochildi!",

    // TASK 3: RJ-45 CRIMPING TRANSLATIONS
    task3Title: "3-Topshiriq: RJ-45 UTP Kabelni Siqish Laboratoriyasi",
    task3Subtitle: "T568B standarti bo'yicha 8 ta rangli simni to'g'ri tartibda joylashtiring va testerda sinang.",
    task3StandardTitle: "EIA/TIA-568B Xalqaro Ranglar Standarti:",
    task3AvailableWires: "Mavjud rangli simlar (Bosib uyaga joylashtiring):",
    task3SlotLabel: "Konnektor Uyasi",
    task3ClearAll: "Simlarni tozalash",
    task3AutoFill: "Standart bo'yicha to'ldirish (Yordam)",
    task3RunTester: "Kabel Testerni Ishga Tushirish",
    task3TestingInProgress: "Tester signallarni tekshirmoqda (1 ➔ 8)...",
    task3TesterPassed: "TEST MUVAFFAQiYATLI! Barcha 8 ta sim to'g'ri ulandi (1000 Mbps Gigabit tayyor).",
    task3TesterFailed: "XATOLIK! Simlar ketma-ketligi buzilgan. Standartga qarab qayta terib chiqing.",

    // Wire colors
    wireWhiteOrange: "Oq-to'q sariq (White-Orange)",
    wireOrange: "To'q sariq (Orange)",
    wireWhiteGreen: "Oq-yashil (White-Green)",
    wireBlue: "Moviy (Blue)",
    wireWhiteBlue: "Oq-moviy (White-Blue)",
    wireGreen: "Yashil (Green)",
    wireWhiteBrown: "Oq-jigarrang (White-Brown)",
    wireBrown: "Jigarrang (Brown)",

    // TASK 4: VLAN & SUBNETTING TRANSLATIONS
    task4Title: "4-Topshiriq: Bo'limlararo VLAN & IP Segmentatsiya",
    task4Subtitle: "Kompaniya xavfsizligi uchun 10 ta kompyuterni 2 ta alohida bo'limga ajrating va kirish huquqlarini belgilang.",
    deptAccounting: "Buxgalteriya va Kadrlar (VLAN 10)",
    deptAccountingDesc: "Maxfiy moliyaviy ma'lumotlar. Statik IP (192.168.10.x). Umumiy printerga to'liq ruxsat.",
    deptSales: "Sotuv va Mijozlar (VLAN 20)",
    deptSalesDesc: "Tashqi sotuv bo'limi. Dinamik DHCP (192.168.20.x). Printerga ruxsat yo'q (faqat internet).",
    task4AssignDept: "Bo'limni biriktirish:",
    task4VerifyMatrix: "VLAN Xavfsizlik Matritsasini Tekshirish",
    task4SuccessTitle: "VLAN Segmentatsiyasi Benuqson Amalga Oshirildi!",
    task4SuccessDesc: "Buxgalteriya fayllari sotuv bo'limidan to'liq himoyalandi va printer huquqlari to'g'ri taqsimlandi.",
    viewCertificateBtn: "Diplom va Sertifikatni Ko'rish 🎓",

    // CERTIFICATE MODAL
    certTitle: "SENIOR TARMOQ MUHANDISI SERTIFIKATI",
    certSubtitle: "Al-Beruniy Nomidagi Amaliy Informatika Ta'lim Dasturi",
    certAwardedTo: "Taqdirlanadi:",
    certStudentRole: "8-Sinf O'quvchisi / Yosh Tarmoq Muhandisi",
    certBody: "Ushbu sertifikat egasi 10 kishilik ofis mahalliy hisoblash tarmog'ini (LAN) muvaffaqiyatli loyihaladi, yuz bergan avariya holatini 10 daqiqada bartaraf etdi, T568B RJ-45 kabelini siqishni bajardi hamda VLAN bo'limlar xavfsizligini 100% a'lo bahoga himoya qildi.",
    certSignTeacher: "Informatika fani ustozi",
    certSignAdmin: "Maktab Ma'muriyati",
    certDateLabel: "Sana:",
    printCertBtn: "Sertifikatni Chop Etish (PDF)"
  },

  ru: {
    // Navigation & Tasks
    tasksTitle: "Учебные Задания",
    task1Tab: "1. Проектирование",
    task2Tab: "2. Диагностика (10м)",
    task3Tab: "3. Обжим RJ-45",
    task4Tab: "4. VLAN & IP",
    taskLockedTip: "Завершите предыдущее задание!",
    task1UnlockedTask2Toast: "Поздравляем! Задание 1 защищено. Задание 2 (Диагностика) разблокировано!",
    task2UnlockedTask3Toast: "Отлично! Авария устранена. Задание 3 (Кабель RJ-45) разблокировано!",
    task3UnlockedTask4Toast: "Супер! Кабель успешно обжат. Задание 4 (VLAN) разблокировано!",
    task4CompletedToast: "Поздравляем! Все 4 задания выполнены на отлично! Сертификат готов!",
    nextTaskBtn: "Перейти к следующему заданию ➔",

    // Header & Meta (Task 1)
    appTitle: "Сетевой проект: Офис на 10 человек",
    appSubtitle: "Интерактивный симулятор для 8 класса по информатике",
    roleBadge: "Сетевой Инженер",
    budgetTitle: "Бюджет",
    budgetSpent: "Потрачено",
    budgetLimit: "Лимит",
    budgetRemaining: "Остаток",
    budgetOver: "Лимит бюджета превышен!",
    challengeToggle: "Челлендж -10%",
    challengeDesc: "Строгий лимит бюджета $225!",
    challengeActiveBadge: "Челлендж активен ($225)",
    seniorBadgeTitle: "Старший Инженер",
    timerTitle: "Время",
    timerChallengeLabel: "60с Вызов",
    pause: "Пауза",
    resume: "Продолжить",
    reset: "Сброс",
    soundOn: "Звук вкл",
    soundOff: "Звук выкл",

    // Actions
    evaluateBtn: "Защита Проекта",
    pingTestBtn: "Тест Пинга (Проверка сети)",
    clientCallBtn: "Звонок Заказчика",
    resetBtn: "Сбросить всё",
    undoBtn: "Отменить",

    // Checklist HUD
    checklistTitle: "Ключевые Требования (Чек-лист)",
    reqIspRouter: "Интернет (Провайдер) подключен к Wi-Fi роутеру",
    reqSwitchRouter: "Коммутатор (16 портов) подключен к роутеру по LAN",
    reqPcsPrinter: "10 рабочих ПК и 1 сетевой принтер подключены к коммутатору",
    reqGuestWifi: "Гостевой Wi-Fi (Guest Zone) активирован",
    reqSecurity: "Все 5 мер безопасности включены",

    // Shop & Hardware
    hardwareShopTitle: "Магазин Оборудования",
    hardwareShopDesc: "Выберите сетевое оборудование в рамках бюджета",
    hardwareInstalled: "Установлено",
    hardwareAdd: "Добавить",
    hardwareRemove: "Удалить",
    hardwareQty: "Кол-во",
    portsLabel: "Порты",

    // Hardware items
    ispTitle: "Интернет (Провайдер ISP)",
    ispDesc: "Внешний высокоскоростной оптоволоконный канал доступа в сеть",
    ispSpecs: "1 Гбит/с Оптика, WAN подключение",

    routerTitle: "Wi-Fi Роутер (Dual-Band)",
    routerDesc: "Двухдиапазонный маршрутизатор 2.4 ГГц и 5 ГГц с DHCP сервером",
    routerSpecs: "1 WAN порт, 4 LAN порта, Wi-Fi 6, встроенный фаервол",

    switch16Title: "Коммутатор на 16 портов (Switch)",
    switch16Desc: "Идеален для подключения 10 ПК, принтера и роутера с запасом",
    switch16Specs: "16x 1000 Мбит/с портов (12 занято, 4 в резерве)",

    switch8Title: "Коммутатор на 8 портов (Внимание!)",
    switch8Desc: "Дешёвый коммутатор с недостаточным числом портов для офиса",
    switch8Specs: "8x 100 Мбит/с портов (максимум 7 устройств + 1 апплинк)",
    switch8WarningBadge: "Ловушка!",

    pcTitle: "Рабочий ПК (Рабочее место)",
    pcDesc: "Рабочая станция сотрудника (сетевая карта, настройка и патч-корд)",
    pcSpecs: "Gigabit Ethernet, IP: 192.168.1.1X",
    addPcOne: "+1 ПК",
    addPcFive: "+5 ПК",
    addPcTen: "+10 ПК (Все)",

    printerTitle: "Сетевой Принтер",
    printerDesc: "Общий офисный лазерный принтер со встроенным сетевым интерфейсом",
    printerSpecs: "RJ-45 сетевой порт, статический IP: 192.168.1.50",

    cablesTitle: "Комплект UTP кабелей и RJ-45",
    cablesDesc: "Бухта витой пары Cat5e (100м) и 30 коннекторов RJ-45",
    cablesSpecs: "Обязателен для физического соединения всех сетевых устройств!",
    cablesMissingWarning: "Кабели не куплены! Оборудование не может быть соединено!",

    // 5 Security Measures
    securityTitle: "5 Мер Кибербезопасности",
    securityDesc: "Включите все 5 правил для защиты офисной сети ($0)",
    securityAllPassed: "Все 5 мер безопасности успешно активированы!",
    securityMissing: "Меры безопасности активированы не полностью!",

    secGuestIsolationTitle: "1. Изоляция Гостевого Wi-Fi",
    secGuestIsolationDesc: "Гости не имеют доступа к рабочим ПК и принтеру офиса (Guest Zone / VLAN).",

    secWpa3Title: "2. Надёжный Пароль WPA2/WPA3",
    secWpa3Desc: "Шифрование и стойкий пароль от 12 символов для защиты от взлома Wi-Fi.",

    secAdminPassTitle: "3. Смена Пароля Админ-панели Роутера",
    secAdminPassDesc: "Замена стандартного уязвимого пароля 'admin/admin' на сложный секретный.",

    secFirewallTitle: "4. Межсетевой Экран (Firewall)",
    secFirewallDesc: "Блокировка подозрительного внешнего трафика, DOS-атак и сканирования портов.",

    secAntivirusTitle: "5. Антивирус и Обновления ОС",
    secAntivirusDesc: "Установка лицензионного антивируса и патчей безопасности на все 10 ПК.",

    // Canvas & Topology
    canvasTitle: "Топология Сети (стиль diagrams.net)",
    canvasSubtitle: "Локальная сеть офиса на базе топологии «Звезда» (Star)",
    zoomIn: "Приблизить",
    zoomOut: "Отдалить",
    zoomReset: "Центрировать",
    legendCable: "Кабель UTP LAN (1 Гбит/с)",
    legendWifi: "Беспроводная сеть Wi-Fi (Изолированная)",
    legendPacket: "Пакет сетевых данных",
    statusOnline: "Работает / В сети",
    statusWarning: "Требует внимания",
    statusOffline: "Отключено",
    portsUsedStatus: "портов занято",

    // Client Call Dynamic Event
    incomingCallTitle: "ВХОДЯЩИЙ ЗВОНОК!",
    callerName: "Руководитель Офиса (Заказчик)",
    callerRole: "Генеральный директор",
    callAudioRinging: "Телефон звонит...",
    callMessage: "«Здравствуйте, сетевой инженер! В наш офис приходит очень много клиентов и гостей. Срочно настройте отдельный 'Гостевой Wi-Fi (Guest Zone)'! Но будьте предельно внимательны: клиенты ни при каких условиях не должны видеть рабочие компьютеры сотрудников и наш сетевой принтер, включите строгую изоляцию!»",
    acceptCallBtn: "Принять задачу (+Гостевой Wi-Fi)",
    declineCallBtn: "Отложить",
    callAcceptedToast: "Задача заказчика принята! Гостевая сеть активирована.",

    // Trap Alert
    trapModalTitle: "ВНИМАНИЕ: ЛОВУШКА 8-ПОРТОВОГО СВИТЧА!",
    trapSubtitle: "Обнаружена критическая нехватка портов!",
    trapExplanation: "Вы выбрали 8-портовый коммутатор. Давайте посчитаем:\n• 1 порт обязательно уходит на связь с роутером (Uplink)\n• Остается портов: всего 7!\n• А в офисе 10 компьютеров + 1 сетевой принтер = требуется 11 портов!\n\nВ результате 4 сотрудника останутся без интернета и доступа к сети!",
    trapFixBtn: "Заменить на 16-портовый свитч (+$30)",
    trapDismissBtn: "Понятно, исправлю сам",

    // Ping Test
    pingModalTitle: "Диагностика Сети ICMP (Ping Test)",
    pingStarting: "Отправка пакетов: ПК-01 -> Роутер -> Интернет (Провайдер)...",
    pingSuccessText: "Сеть работает стабильно! Пакеты успешно доставлены через все 10 ПК и принтер. Задержка: 1мс, Потери пакетов: 0%.",
    pingFailText: "Обрыв связи! Проверьте наличие кабелей UTP или подключение роутера и коммутатора.",
    closeBtn: "Закрыть",

    // Presentation Defense Modal
    defenseTitle: "Защита Сетевого Проекта (Презентация)",
    defenseSubtitle: "Готовая 60-секундная речь для выступления на уроке информатики в 8 классе",
    defenseScoreLabel: "Итоговая Оценка",
    defenseReadyToPresent: "Проект полностью готов к отличной защите!",
    defenseNeedsWork: "В проекте есть ошибки, сеть не готова к защите!",
    copySpeechBtn: "Скопировать текст речи",
    speechCopiedToast: "Текст 60-секундной речи скопирован в буфер обмена!",
    rehearseTimerBtn: "Таймер Репетиции (60 сек)",
    timerRunningLabel: "Идёт отсчёт речи...",
    timerFinishedLabel: "Время вышло! Отличное выступление!",

    // 60-Second Speech Segments
    speechTitle: "Текст 60-Секундной Речи для Защиты Проекта перед Классом",
    speechText: `Здравствуйте, уважаемый учитель и одноклассники!

Сегодня я представляю проект надёжной, защищённой и экономичной локальной вычислительной сети (LAN) для офиса на 10 сотрудников.

1. ТОПОЛОГИЯ И СТРУКТУРА [0-15 сек]:
Для проектирования сети я выбрал базовую топологию «Звезда», как самую отказоустойчивую. Оптоволоконный кабель от интернет-провайдера заходит в двухдиапазонный Wi-Fi роутер, выполняющий роль шлюза. От него LAN-кабель соединяется с 16-портовым гигабитным коммутатором.

2. ОБОРУДОВАНИЕ И ЗАПАС ПОРТОВ [15-30 сек]:
К коммутатору подключены 10 рабочих станций сотрудников и 1 общий сетевой принтер через кабели витой пары Cat5e. Важное инженерное решение: вместо дешевого 8-портового свитча установлен 16-портовый. Это позволило подключить все 12 устройств (1 апплинк + 10 ПК + 1 принтер) и сохранить 4 порта в резерве для расширения офиса.

3. КИБЕРБЕЗОПАСНОСТЬ И ГОСТЕВАЯ ЗОНА [30-45 сек]:
По требованию директора офиса был развернут «Гостевой Wi-Fi» с обязательной изоляцией трафика (Guest Zone), чтобы посетители не могли проникнуть к служебным файлам и принтеру. Также активированы WPA3-шифрование, смена заводского пароля роутера, межсетевой экран (Firewall) и антивирусная защита рабочих мест.

4. БЮДЖЕТ И ВЫВОД [45-60 сек]:
Весь проект полностью уложился в выделенный бюджет в $250 (итоговая стоимость составила ровно $225, что позволило успешно выполнить даже сложный челлендж -10%). Сеть протестирована пингом: задержка минимальна, потери 0%.

Спасибо за внимание, я готов ответить на ваши вопросы!`,

    // Badges
    badgeMaster: "Мастер Сетей (100 баллов)",
    badgeMasterDesc: "Топология, связность и правила защиты выполнены безупречно",
    badgeSenior: "Старший Сетевой Инженер",
    badgeSeniorDesc: "Победа в режиме челленджа -10% с бюджетом до $225!",
    badgeSecurity: "Щит Кибербезопасности",
    badgeSecurityDesc: "Все 5 ключевых мер защиты активированы без ошибок",
    badgeBudget: "Экономный Инженер",
    badgeBudgetDesc: "Ни единого лишнего доллара сверх бюджета",

    // Device Inspector
    inspectorTitle: "Спецификация и Параметры Устройства",
    roleLabel: "Назначение",
    ipLabel: "IP-Адрес",
    macLabel: "MAC-Адрес",
    portSpeedLabel: "Скорость Порта",
    gatewayLabel: "Основной Шлюз (Gateway)",
    maskLabel: "Маска Подсети (Subnet Mask)",
    curriculumNote: "Справка из учебника информатики 8 класса",

    // TASK 2: TROUBLESHOOTING TRANSLATIONS (RU)
    task2Title: "Задание 2: Диагностика и Устранение Аварии",
    task2Subtitle: "Сеть офиса вышла из строя! За 10 минут найдите и устраните 3 критические неисправности.",
    task2TimerLabel: "Таймер Аварии (10 минут):",
    task2IncidentsResolved: "Неисправности устранены",

    // Incident 1
    inc1Title: "1. Конфликт IP-адресов (IP Conflict)",
    inc1Desc: "ПК-03 и ПК-07 получили одинаковый статический IP-адрес (192.168.1.13). В результате оба компьютера потеряли доступ к сети!",
    inc1Action: "Изменить IP-адрес ПК-07 (установить свободный 192.168.1.17)",
    inc1Fixed: "Конфликт IP устранен (ПК-07: 192.168.1.17)",

    // Incident 2
    inc2Title: "2. Неверный Основной Шлюз (Wrong Gateway)",
    inc2Desc: "ПК-05 не имеет доступа к интернету. Диагностика показала, что Default Gateway ошибочно указан как 192.168.0.1 вместо роутера!",
    inc2Action: "Указать корректный шлюз роутера (192.168.1.1)",
    inc2Fixed: "Основной шлюз исправлен (Gateway: 192.168.1.1)",

    // Incident 3
    inc3Title: "3. Вирусная Атака / Зараженный ПК (DDoS Bot)",
    inc3Desc: "Сотрудник за ПК-09 подключил зараженную флешку! ПК отправляет миллионы паразитных пакетов, перегружая коммутатор.",
    inc3Action: "Изолировать ПК-09 и запустить антивирусное сканирование",
    inc3Fixed: "Вредоносное ПО обезврежено, ПК-09 возвращен в безопасный режим!",

    task2SuccessTitle: "Авария полностью ликвидирована!",
    task2SuccessDesc: "Сеть снова работает штатно. Задание 3 (Обжим кабеля RJ-45) разблокировано!",

    // TASK 3: RJ-45 CRIMPING TRANSLATIONS (RU)
    task3Title: "Задание 3: Лаборатория Обжима Кабеля RJ-45",
    task3Subtitle: "Разложите 8 цветных жил по стандарту T568B и протестируйте кабельным тестером.",
    task3StandardTitle: "Международный стандарт EIA/TIA-568B:",
    task3AvailableWires: "Цветные проводники (нажмите для укладки в гнездо):",
    task3SlotLabel: "Пин коннектора",
    task3ClearAll: "Очистить проводники",
    task3AutoFill: "Заполнить по стандарту (Подсказка)",
    task3RunTester: "Запустить Кабельный Тестер",
    task3TestingInProgress: "Тестер проверяет контакты (1 ➔ 8)...",
    task3TesterPassed: "ТЕСТ УСПЕШЕН! Все 8 жил соединены правильно (1000 Мбит/с Gigabit).",
    task3TesterFailed: "ОШИБКА! Порядок проводников нарушен. Сверьте со стандартом T568B.",

    // Wire colors
    wireWhiteOrange: "Бело-оранжевый (White-Orange)",
    wireOrange: "Оранжевый (Orange)",
    wireWhiteGreen: "Бело-зелёный (White-Green)",
    wireBlue: "Синий (Blue)",
    wireWhiteBlue: "Бело-синий (White-Blue)",
    wireGreen: "Зелёный (Green)",
    wireWhiteBrown: "Бело-коричневый (White-Brown)",
    wireBrown: "Коричневый (Brown)",

    // TASK 4: VLAN & SUBNETTING TRANSLATIONS (RU)
    task4Title: "Задание 4: Межсегментный VLAN и Сегментация IP",
    task4Subtitle: "Для защиты корпоративных данных разделите 10 рабочих ПК на 2 отдела и настройте права доступа.",
    deptAccounting: "Бухгалтерия и Кадры (VLAN 10)",
    deptAccountingDesc: "Конфиденциальные финансы. Статический IP (192.168.10.x). Полный доступ к сетевому принтеру.",
    deptSales: "Продажи и Клиенты (VLAN 20)",
    deptSalesDesc: "Отдел продаж. Динамический DHCP (192.168.20.x). Доступ к принтеру закрыт (только интернет).",
    task4AssignDept: "Назначить отдел:",
    task4VerifyMatrix: "Проверить Матрицу Безопасности VLAN",
    task4SuccessTitle: "VLAN-сегментация успешно завершена!",
    task4SuccessDesc: "Бухгалтерские данные изолированы от отдела продаж, сетевые права разграничены верно.",
    viewCertificateBtn: "Получить Диплом и Сертификат 🎓",

    // CERTIFICATE MODAL (RU)
    certTitle: "СЕРТИФИКАТ СТАРШЕГО СЕТЕВОГО ИНЖЕНЕРА",
    certSubtitle: "Образовательная программа по практической информатике им. Аль-Беруни",
    certAwardedTo: "Награждается:",
    certStudentRole: "Ученик 8 класса / Юный сетевой инженер",
    certBody: "Обладатель данного сертификата успешно спроектировал локальную сеть (LAN) на 10 сотрудников, за 10 минут ликвидировал сложную аварию в сети, выполнил стандартный обжим витой пары T568B и безупречно настроил безопасность отделов через VLAN.",
    certSignTeacher: "Учитель информатики",
    certSignAdmin: "Администрация школы",
    certDateLabel: "Дата:",
    printCertBtn: "Печать сертификата (PDF)"
  }
};
