# Tarmoq Loyihasi: 10 Kishilik Ofis / Сетевой проект: Офис на 10 человек
> **Al-Beruniy nomidagi ta'limiy loyiha — 8-sinf Informatika va axborot texnologiyalari fani uchun interaktiv 2D tarmoq arxitekturasi simulyatori va 60 soniyalik himoya nutqi platformasi.**

---

## 🌐 Loyiha Haqida / О проекте

Ushbu interaktiv simulyator o'quvchilarga 10 kishilik kichik ofis uchun mahalliy hisoblash tarmog'ini (**LAN**) tejamkor va xavfsiz loyihalashni o'rgatadi. 

O'yin 8-sinf Informatika darsligi dasturi asosida tuzilgan bo'lib, o'quvchi **Tarmoq Muhandisi** rolida $250 (yoki qat'iy -10% chellenjda $225) byudjet doirasida optimal uskunalar va 5 ta kiberxavfsizlik chorasini tanlashi kerak.

---

## ✨ Asosiy Imkoniyatlar / Ключевые возможности

- 🇺🇿 🇷🇺 **To'liq ikki tilli interfeys (Bilingual UZ | RU):** Bir bosishda butun interfeys, texnik parametrlar, buyurtmachi qo'ng'irog'i va 60 soniyalik dars nutqi o'zbek va rus tillari o'rtasida sinxronlashadi.
- 🎨 **Minimalistik va zamonaviy UI/UX:** Linear / Figma uslubidagi toza interfeys, ko'zni charchatmaydigan nozik nuqtali muhandislik to'ri (dot-pattern grid) va shaffof glassmorphism elementlari.
- 📐 **Diagrams.net uslubidagi Yulduzsimon (Star) Topologiya:** 
  - Internet (ISP) ➔ Wi-Fi Router ➔ 16-port Gigabit Switch ➔ 10 PC + 1 Printer + Mehmon Wi-Fi.
  - SVG orqali animatsion oqayotgan ma'lumotlar paketlari (Data flow pulses).
- ⚠️ **Pedagogik "8-Portli Switch" Tuzog'i:** O'quvchi arzonroq 8-portli switchni tanlaganda, port yetishmasligi (12 ta ulanish zarur, atigi 7 ta bo'sh port) va 4 ta xodim internetsiz qolishi haqida tushuntirish beruvchi ta'limiy ogohlantirish.
- 📞 **Dinamik Voqea — "Buyurtmachi qo'ng'irog'i" (Client Call):** Real vaqtda telefon qo'ng'irog'i ovozi bilan keluvchi shoshilinch topshiriq (izolyatsiyalangan Mehmon Wi-Fi zonasini qo'shish).
- 🛡️ **5 Kiberxavfsizlik Qoidasi ($0):**
  1. Mehmon Wi-Fi izolyatsiyasi (Guest Zone / VLAN)
  2. WPA2/WPA3 kuchli shifrlash va 12+ belgili parol
  3. Router Admin standart parolini yangilash
  4. Tarmoqlararo ekran (Firewall)
  5. Antivirus va OT yangilanishi
- 📡 **ICMP Ping Tarmoq Diagnostikasi:** Paketlarni yo'naltirish, kechikish (latency) va 0% paket yo'qotilishini simulyatsiya qiluvchi terminal oynasi.
- 🎓 **60 Soniyalik Taqdimot Himoya Nutqi:** O'quvchi sinfda doskaga chiqib loyihani himoya qilishi uchun soniyalar bo'yicha tayyor nutq matni, nusxa olish tugmasi va mashq qilish uchun **60 soniyalik interaktiv nutq taymeri**.
- 🔊 **Web Audio API Ovoz Effektlari:** 100% oflayn ishlovchi simulyatsiya tovushlari (kabel chertilishi, telefon jiringlashi, radar sonar, zafar akkordi).

---

## 🛠️ Texnologiyalar / Стек технологий

- **React 19**
- **TypeScript**
- **Tailwind CSS v4** (`@tailwindcss/vite`)
- **Lucide Icons**
- **Canvas-Confetti**
- **Vite**

---

## 🚀 Ishga tushirish / Установка и запуск

```bash
# 1. Repozitoriyani klonlash
git clone https://github.com/Artikov-dev/AL-BERUNIY.git

# 2. Loyiha papkasiga kirish
cd AL-BERUNIY

# 3. Bog'liqliklarni o'rnatish
npm install

# 4. Dasturni ishga tushirish
npm run dev
```

Brauzerda ochish: **http://localhost:5173/**

---

## 📦 Loyiha Strukturasi / Структура проекта

```
src/
├── components/
│   ├── Canvas.tsx              # 2D Yulduzsimon topologiya maydoni va animatsion kabellar
│   ├── Checklist.tsx           # Asosiy talablar nazorat chizig'i (status-strip)
│   ├── ClientCallModal.tsx     # Buyurtmachi qo'ng'irog'i (Dinamik voqea)
│   ├── DefenseModal.tsx        # 100 ballik baholash va 60 soniyalik himoya nutqi
│   ├── Header.tsx              # HUD, Byudjet, Taymer, Chellenj va Til boshqaruvi
│   ├── NodeInspectorModal.tsx  # Qurilma texnik tafsilotlari (IP, MAC, Gateway)
│   ├── PingTestModal.tsx       # ICMP paketlar diagnostikasi terminali
│   ├── Sidebar.tsx             # Uskunalar do'koni va iOS-style 5 ta xavfsizlik kaliti
│   └── TrapAlertModal.tsx      # 8-portli switch pedagogik tuzog'i ogohlantirishi
├── i18n/
│   └── translations.ts         # O'zbek va Rus tillaridagi 100% to'liq lug'at
├── types/
│   └── index.ts                # TypeScript interfeyslari va turlari
├── utils/
│   └── audio.ts                # Web Audio API ovoz sintezatori
├── App.tsx                     # Asosiy o'yin holati va muvofiqlashtiruvchi
├── index.css                   # Minimalist uslub va animatsiyalar
└── main.tsx                    # React ilovasining kirish nuqtasi
```

---

## 👨‍💻 Muallif / Автор

- **Rozimuhammad Artikov** ([Artikov-dev](https://github.com/Artikov-dev))
- Al-Beruniy maktabi / 8-sinf ta'limiy loyihasi
