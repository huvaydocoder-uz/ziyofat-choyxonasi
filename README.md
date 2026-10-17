# Ziyofat Choyxonasi

> Ziyofat — haqiqiy o'zbekona mehmondo'stlik maskani

Qarshidagi **Ziyofat Choyxonasi** uchun bir sahifali sayt: menyu va narxlar, onlayn savat, manzil va xarita, buyurtma berish (Telegram, SMS, qo'ng'iroq).

- 📍 Qarshi, Eco Oil zapravkasi ro'parasi
- ⏱️ Har kuni 08:00 – 23:00
- 📞 +998 88 801 24 22
- 📸 Instagram: [@ziyofat__](https://www.instagram.com/ziyofat__/)

## Imkoniyatlar

- **Kirish animatsiyasi** — logotip, choynakdan piyolaga choy quyilishi va "Ziyofat Choyxonasiga / Xush kelibsiz!" yozuvi. Birinchi kirishda to'liq, sahifa yangilanganda tezroq.
- **Uch til** — o'zbekcha, ruscha, inglizcha (bayroqchalar bilan, animatsiyali almashish). `?lang=ru` / `?lang=en` havolalari ishlaydi.
- **Yorug' / qorong'i rejim** — tanlov eslab qolinadi.
- **Menyu** — 6 bo'lim, har bir taomning tarkibi, o'lchovi va narxi; xit taomlar lentasi (sichqoncha yoki barmoq bilan suriladi).
- **Savat va buyurtma** — Telegram (matn nusxalanadi), SMS (tayyor matn bilan) yoki qo'ng'iroq.
- **Yandex xarita** va yo'l chizish (Yandex Maps / Google Maps).
- **SEO** — meta teglar, `hreflang`, schema.org `Restaurant` ma'lumotlari.

## Tuzilishi

```
index.html        Sahifa tuzilishi
css/style.css     Dizayn (ranglar faylning eng boshida)
js/data.js        Taomlar, narxlar, manzil, telefon — kontent shu yerda
js/i18n.js        Tugma va sarlavha matnlari (3 tilda)
js/app.js         Saytning ishlash mantig'i
images/           Logotip va taom rasmlari
QOLLANMA.txt      Sayt egasi uchun qo'llanma (narx, taom, rasm almashtirish)
```

Hech qanday build yoki o'rnatish talab qilinmaydi — oddiy HTML, CSS va JavaScript.

## Ishga tushirish

`index.html` faylini brauzerda oching. Yoki istalgan statik server bilan:

```bash
npx serve .
# yoki
python -m http.server 5173
```

## Kontentni o'zgartirish

Narx, taom, manzil va telefonlar — [`js/data.js`](js/data.js), interfeys matnlari — [`js/i18n.js`](js/i18n.js). Batafsil: [`QOLLANMA.txt`](QOLLANMA.txt).

## Internetga joylash (GitHub Pages)

1. Repozitoriyda **Settings → Pages** bo'limini oching.
2. **Source:** `Deploy from a branch`, **Branch:** `main`, papka `/ (root)`.
3. Bir necha daqiqadan so'ng sayt `https://<username>.github.io/<repo>/` manzilida ochiladi.

> Taom rasmlarining bir qismi hozircha Unsplash'dan olingan namunalar — ularni `images/` papkasidagi haqiqiy rasmlar bilan almashtirish tavsiya etiladi.
