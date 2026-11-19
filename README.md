# Tarmoq Loyihasi: 10 Kishilik Ofis / Сетевой проект: Офис на 10 человек
> **Al-Beruniy nomidagi ta'limiy loyiha — 8-sinf Informatika va axborot texnologiyalari fani uchun 4 bosqichli interaktiv tarmoq arxitekturasi va kiberxavfsizlik simulyatori.**

---

## 🌐 4 Bosqichli Ketma-ket O'quv Dasturi / 4-Этапная Учебная Программа

Topshiriqlar ketma-ket ochiladi: o'quvchi 1-topshiriqni muvaffaqiyatli himoya qilgandan so'ngгина keyingi bosqichlar qulfdan yechiladi!

### 1️⃣ 1-Topshiriq: "Tarmoq Loyihasi" (Star Topology & $250 Budget)
- 10 kishilik ofis uchun yulduzsimon (Star) mahalliy tarmoqni yig'ish.
- Internet (ISP), Wi-Fi Router, 16 portli Gigabit Switch, 10 ta PC, printer, kabellar.
- 5 ta Kiberxavfsizlik choralari ($0).
- "Buyurtmachi qo'ng'irog'i" (Dinamik voqea) ➔ Mehmon Wi-Fi.
- 60 soniyalik dars himoya nutqi (Prezentatsiya).

### 2️⃣ 2-Topshiriq: "Tarmoq Avariyasi va Diagnostika" (10 daqiqa, Tasodifiy Kvest)
- 10 daqiqalik sinov taymeri va noaniqlik sharoitida tekshiruv (10 ta kompyuterni birma-bir ochib ko'rish).
- Har gal **tasodifiy generatsiya qilinadigan 3 ta nosozlik**:
  1. **IP Conflict:** Tasodifiy kompyuterda IP ziddiyati. Bo'sh IP manzil klaviaturadan qo'lda kiritiladi.
  2. **Wrong Gateway:** Noto'g'ri kiritilgan shlyuzni aniqlash va router shlyuzini (`192.168.1.1`) qo'lda kiritish.
  3. **Malware / DDoS:** Virusli botnetni aniqlash va Terminal konsolida `scan` yoki `antivirus scan` deb yozish.

### 3️⃣ 3-Topshiriq: "RJ-45 UTP Kabelni Siqish Laboratoriyasi" (Tasodifiy T568A / T568B)
- Tasodifiy ravishda **EIA/TIA-568A** yoki **EIA/TIA-568B** standarti buyurtma qilinadi.
- 8 ta rangli sim pastdagi panelda **aralashtirilgan tartibda** beriladi (o'quvchi standartni bilishi shart).
- 8 kanalli interaktiv kabel testerida tekshirish; noto'g'ri sim qo'yilgan pin qizil LED va xato diagnostikasi bilan ko'rsatiladi.

### 4️⃣ 4-Topshiriq: "Bo'limlararo VLAN va IP Segmentatsiya" (Tasodifiy Reja)
- Kompaniya ichki xavfsizlik rejasi har gal 10 ta kompyuterni **tasodifiy 5+5 tartibda** taqsimlaydi:
  - **Buxgalteriya va Kadrlar (VLAN 10):** Statik IP, umumiy printerga to'liq ruxsat.
  - **Sotuv va Marketing (VLAN 20):** Dinamik DHCP IP, printer bloklangan (faqat internet).
- Xavfsizlik matritsasi orqali tekshirish va yakuniy **"Senior Tarmoq Muhandisi Sertifikati"**ni qo'lga kiritish!

---

## 🛠️ Texnologiyalar / Стек технологий

- **React 19**
- **TypeScript**
- **Tailwind CSS v4** (`@tailwindcss/vite`)
- **Lucide Icons**
- **Canvas-Confetti**
- **Web Audio API** (100% oflayn simulyatsiya tovushlari)
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

## 👨‍💻 Muallif / Автор

- **Rozimuhammad Artikov** ([Artikov-dev](https://github.com/Artikov-dev))
- Al-Beruniy maktabi / 8-sinf ta'limiy loyihasi
