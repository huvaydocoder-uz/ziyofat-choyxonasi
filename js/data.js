/* =====================================================================
   ZIYOFAT CHOYXONASI — SAYT MA'LUMOTLARI

   Saytdagi taomlar, narxlar, manzil va telefon SHU FAYLDA turadi.
   Narxni o'zgartirish uchun  narx: 12000  dagi sonni almashtiring.

   UCH TIL: har bir matn uch tilda yoziladi —
       nom: { uz: "Tandir somsa", ru: "Тандыр-самса", en: "Tandoor samsa" },
   Tarjimasi bo'lmasa, oddiy qilib bitta matn yozsangiz ham bo'ladi:
       nom: "Tandir somsa",
   — shunda u uchala tilda ham shu ko'rinishda chiqadi.

   Qoidalar:
   • Matnlar "qo'shtirnoq" ichida yoziladi.
   • Har bir qator oxirida vergul  ,  turadi.
   • narx — faqat son, bo'sh joysiz (12000 — to'g'ri, 12 000 — noto'g'ri).
   • xit: true — taom "Xit taomlar" karuselida ham chiqadi.
   • olchov — "1 dona", "1 kosa", "1 portsiya", "1 six", "300 g", "1 litr",
     "1 choynak" ko'rinishida yozing: ruscha va inglizchaga o'zi o'giriladi.

   Rasm almashtirish: o'z rasmingizni  images  papkasiga tashlang va
   img: rasm("...")  o'rniga  img: "images/osh.jpg"  deb yozing.
===================================================================== */

// Vaqtinchalik namuna rasmlar (Unsplash). O'z taomlaringiz rasmi bilan almashtiring.
const rasm = (id, eni = 900) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${eni}&q=75`;

window.SAYT = {
  brend: "Ziyofat Choyxonasi",
  logo: "images/logo.png",

  /* ---------- ALOQA ---------- */
  telefon: "+998 88 801 24 22",      // qo'ng'iroq, SMS va Telegram shu raqamga
  telegram: "",                      // Telegram'da username ochilsa, shu yerga yozing (masalan: "ziyofat_choyxona")
  instagramObuna: "13K+",            // Instagram obunachilar soni (bosh sahifada ko'rinadi)
  ijtimoiy: {                        // keraksizini "" qilib qo'ysangiz, saytdan yo'qoladi
    instagram: "https://www.instagram.com/ziyofat__/",
    telegram: "https://t.me/+998888012422",
    facebook: "",
    youtube: "",
  },

  // Buyurtma turlari. Yetkazib berish bo'lmasa, o'sha qatorni o'chirib tashlang.
  buyurtmaTurlari: [
    { uz: "Olib ketaman", ru: "Самовывоз", en: "Pickup" },
    { uz: "Choyxonada ovqatlanaman", ru: "Поем в чайхане", en: "Dine in" },
    { uz: "Yetkazib berish", ru: "Доставка", en: "Delivery" },
  ],

  /* ---------- MANZIL ----------
     lat / lng — xaritadagi nuqta (Yandex xaritada shu nuqta ko'rsatiladi). */
  filiallar: [
    {
      nom: { uz: "Ziyofat Choyxonasi", ru: "Чайхана Ziyofat", en: "Ziyofat Choyxona" },
      manzil: {
        uz: "Qashqadaryo viloyati, Qarshi shahri",
        ru: "Кашкадарьинская область, г. Карши",
        en: "Qarshi, Kashkadarya region, Uzbekistan",
      },
      moljal: {
        uz: "Mo'ljal: Eco Oil zapravkasi ro'parasi",
        ru: "Ориентир: напротив заправки Eco Oil",
        en: "Landmark: opposite the Eco Oil gas station",
      },
      telefon: "+998 88 801 24 22",
      ochilish: "08:00",
      yopilish: "23:00",
      lat: 38.879264,
      lng: 65.816324,
      google: "",
      yandex: "",
    },
  ],

  /* ---------- BOSH SAHIFADAGI KATTA KARUSEL ---------- */
  slaydlar: [
    {
      belgi: { uz: "Qozondan — dasturxonga", ru: "Из казана — на стол", en: "From the kazan to your table" },
      sarlavha: { uz: "Har kuni damlanadigan", ru: "Каждый день свежий", en: "Cooked fresh every day:" },
      urgu: { uz: "Ziyofat oshi", ru: "плов Ziyofat", en: "Ziyofat plov" },
      matn: {
        uz: "Lazer guruch, sariq sabzi, saralangan go'sht va qozonning o'z ta'mi. Choy bilan, issiq non bilan — choyxonadagidek.",
        ru: "Рис лазер, жёлтая морковь, отборное мясо и тот самый вкус казана. С чаем и горячей лепёшкой — как в настоящей чайхане.",
        en: "Lazer rice, yellow carrots, choice meat and that real kazan flavour. Served with tea and hot bread, the choyxona way.",
      },
      img: rasm("1634324092536-74480096b939", 1800),
    },
    {
      belgi: { uz: "Tandirdan uzilgan", ru: "Прямо из тандыра", en: "Straight from the tandoor" },
      sarlavha: { uz: "Issiq, qip-qizil", ru: "Горячая и румяная", en: "Hot and golden" },
      urgu: { uz: "tandir somsa", ru: "тандыр-самса", en: "tandoor samsa" },
      matn: {
        uz: "Pichoqda to'g'ralgan go'sht, dumba va qatlam-qatlam xamir. Ertalabdan tandirda yopiladi.",
        ru: "Рубленое мясо, курдюк и слоёное тесто. Печём в тандыре с самого утра.",
        en: "Hand-chopped meat, tail fat and layered pastry, baked in the tandoor from early morning.",
      },
      img: "images/somsa-tandir.jpg",
    },
    {
      belgi: { uz: "Cho'g'da pishadi", ru: "Готовим на углях", en: "Grilled over charcoal" },
      sarlavha: { uz: "Sersuv va xushbo'y", ru: "Сочный и ароматный", en: "Juicy and smoky" },
      urgu: { uz: "shashliklar", ru: "шашлыки", en: "shashlik" },
      matn: {
        uz: "Qiyma, tugunli, o'rdak va tovuq go'shtidan — buyurtmangizdan keyin cho'g'ga qo'yiladi va issiq holda tortiladi.",
        ru: "Люля, «тугун», утка и курица — ставим на угли после заказа и подаём горячими.",
        en: "Minced, tugun, duck and chicken — grilled only after you order and served piping hot.",
      },
      img: rasm("1747253255646-3bffa4565a7a", 1800),
    },
  ],

  /* ---------- "BIZ HAQIMIZDA" VA PASTKI BANNER RASMLARI ---------- */
  rasmlar: {
    biz1: rasm("1661994215679-cde7c2c5c060", 1000),
    biz2: rasm("1606377695906-236fdfcef767", 700),
    banner: rasm("1705359573325-f2006d5e459f", 1800),
  },

  /* ---------- MENYU (NARXLARNI TEKSHIRING VA O'ZGARTIRING) ---------- */
  menyu: [
    /* ======================= OSH VA SOMSA ======================= */
    {
      id: "osh",
      nom: { uz: "Osh va somsa", ru: "Плов и самса", en: "Plov & samsa" },
      tavsif: {
        uz: "Osh har kuni qozonda damlanadi, somsa tandirda yopiladi.",
        ru: "Плов каждый день готовим в казане, самсу печём в тандыре.",
        en: "Plov cooked in the kazan and samsa baked in the tandoor, every day.",
      },
      taomlar: [
        {
          nom: { uz: "Osh", ru: "Плов", en: "Plov" },
          tavsif: {
            uz: "Lazer guruch, mol go'shti, sariq sabzi va no'xat. Qozonda damlangan haqiqiy o'zbek oshi.",
            ru: "Рис лазер, говядина, жёлтая морковь и нут. Настоящий узбекский плов из казана.",
            en: "Lazer rice, beef, yellow carrot and chickpeas — real Uzbek plov from the kazan.",
          },
          olchov: "1 portsiya", narx: 35000, xit: true, img: rasm("1671048116858-e8ef69175b2d"),
        },
        {
          nom: { uz: "Tandir somsa", ru: "Тандыр-самса", en: "Tandoor samsa" },
          tavsif: {
            uz: "Pichoqda to'g'ralgan go'sht, dumba va piyoz. Tandirda qip-qizil bo'lib pishadi.",
            ru: "Рубленое мясо, курдюк и лук. Выпекается в тандыре до румяной корочки.",
            en: "Hand-chopped meat, tail fat and onion, baked in the tandoor until golden.",
          },
          olchov: "1 dona", narx: 10000, xit: true, img: "images/somsa.jpg",
        },
      ],
    },

    /* ======================= SHASHLIKLAR ======================= */
    {
      id: "shashlik",
      nom: { uz: "Shashliklar", ru: "Шашлыки", en: "Shashlik" },
      tavsif: {
        uz: "Buyurtmadan keyin cho'g'ga qo'yiladi. Piyoz va sirka bilan.",
        ru: "Ставим на угли после заказа. Подаём с луком и уксусом.",
        en: "Grilled to order. Served with onion and vinegar.",
      },
      taomlar: [
        {
          nom: { uz: "Qiyma shashlik", ru: "Люля-кебаб", en: "Minced meat shashlik" },
          tavsif: {
            uz: "Ziravorli go'sht qiymasi sixga tortilib, cho'g'da pishiriladi.",
            ru: "Пряный мясной фарш на шампуре, жаренный на углях.",
            en: "Spiced minced meat on a skewer, grilled over charcoal.",
          },
          olchov: "1 six", narx: 14000, xit: true, img: rasm("1532636875304-0c89119d9b4d"),
        },
        {
          nom: { uz: "Tugunli shashlik", ru: "Шашлык «Тугун»", en: "Tugun shashlik" },
          tavsif: {
            uz: "Charviga o'ralgan sersuv go'sht — cho'g'da pishib, og'izda eriydi.",
            ru: "Сочное мясо в сальнике — тает во рту после углей.",
            en: "Juicy meat wrapped in caul fat — melts in your mouth straight off the coals.",
          },
          olchov: "1 six", narx: 18000, xit: true, img: rasm("1629117408224-e583a7bcb195"),
        },
        {
          nom: { uz: "O'rdak go'shtidan shashlik", ru: "Шашлык из утки", en: "Duck shashlik" },
          tavsif: {
            uz: "Marinadda tindirilgan yumshoq o'rdak go'shti, cho'g'da pishirilgan.",
            ru: "Нежная маринованная утка, приготовленная на углях.",
            en: "Tender marinated duck, grilled over charcoal.",
          },
          olchov: "1 six", narx: 20000, xit: true, img: rasm("1603360946369-dc9bb6258143"),
        },
        {
          nom: { uz: "Tovuq go'shtidan shashlik", ru: "Шашлык из курицы", en: "Chicken shashlik" },
          tavsif: {
            uz: "Tovuq go'shti yumshoq marinadda, cho'g'da qizartirilgan.",
            ru: "Курица в нежном маринаде, обжаренная на углях.",
            en: "Chicken in a mild marinade, browned over charcoal.",
          },
          olchov: "1 six", narx: 12000, img: rasm("1594266063697-304befca9629"),
        },
      ],
    },

    /* ======================= QUYUQ TAOMLAR VA BALIQ ======================= */
    {
      id: "quyuq",
      nom: { uz: "Quyuq taomlar va baliq", ru: "Горячие блюда и рыба", en: "Mains & fish" },
      tavsif: {
        uz: "Qozon kabob, tandir go'sht va baliq — katta davralar uchun ham.",
        ru: "Казан-кабоб, тандыр-гушт и рыба — и для больших компаний.",
        en: "Kazan kabob, tandoor meat and fish — great for big groups too.",
      },
      taomlar: [
        {
          nom: { uz: "Qozon kabob", ru: "Казан-кабоб", en: "Kazan kabob" },
          tavsif: {
            uz: "Qozonda qizartirilgan go'sht va kartoshka, piyoz va ko'katlar bilan.",
            ru: "Мясо и картофель, обжаренные в казане, с луком и зеленью.",
            en: "Meat and potatoes browned in a kazan, with onion and herbs.",
          },
          olchov: "1 portsiya", narx: 50000, xit: true, img: rasm("1633436375795-12b3b339712f"),
        },
        {
          nom: { uz: "Tandir go'sht", ru: "Тандыр-гушт", en: "Tandoor meat" },
          tavsif: {
            uz: "Tandirda sekin pishgan, suyakdan o'zi ajraladigan yumshoq go'sht.",
            ru: "Мясо, томлённое в тандыре, — само отходит от кости.",
            en: "Meat slow-roasted in the tandoor until it falls off the bone.",
          },
          olchov: "300 g", narx: 65000, xit: true, img: rasm("1612690194179-65e8a2bdc470"),
        },
        {
          nom: { uz: "Baliq", ru: "Рыба", en: "Fish" },
          tavsif: {
            uz: "Qarsildoq qovurilgan baliq, limon va ko'katlar bilan tortiladi.",
            ru: "Хрустящая жареная рыба с лимоном и зеленью.",
            en: "Crisp fried fish served with lemon and herbs.",
          },
          olchov: "1 portsiya", narx: 45000, xit: true, img: rasm("1519708227418-c8fd9a32b7a2"),
        },
      ],
    },

    /* ======================= SALATLAR ======================= */
    {
      id: "salat",
      nom: { uz: "Salatlar", ru: "Салаты", en: "Salads" },
      tavsif: {
        uz: "Yangi uzilgan sabzavot va ko'katlardan, har kuni tayyorlanadi.",
        ru: "Из свежих овощей и зелени, готовим каждый день.",
        en: "Made fresh every day from vegetables and herbs.",
      },
      taomlar: [
        {
          nom: { uz: "Yangi sabzavot salati (svejiy)", ru: "Салат «Свежий»", en: "Fresh vegetable salad" },
          tavsif: {
            uz: "Bodring, pomidor, ko'katlar va o'simlik yog'i.",
            ru: "Огурцы, помидоры, зелень и растительное масло.",
            en: "Cucumber, tomato, herbs and vegetable oil.",
          },
          olchov: "200 g", narx: 12000, img: rasm("1602093811733-7aca4b7d32ca"),
        },
        {
          nom: { uz: "Choponcha salat", ru: "Чабанский салат", en: "Shepherd's salad" },
          tavsif: {
            uz: "Mayda to'g'ralgan pomidor, bodring, piyoz, qalampir va ko'katlar.",
            ru: "Мелко нарезанные помидоры, огурцы, лук, перец и зелень.",
            en: "Finely chopped tomato, cucumber, onion, pepper and herbs.",
          },
          olchov: "200 g", narx: 15000, xit: true, img: rasm("1625944230945-1b7dd3b949ab"),
        },
        {
          nom: { uz: "Olivye", ru: "Оливье", en: "Olivier salad" },
          tavsif: {
            uz: "Kartoshka, sabzi, tuxum, bodring, ko'k no'xat va mayonez.",
            ru: "Картофель, морковь, яйцо, огурец, зелёный горошек и майонез.",
            en: "Potato, carrot, egg, pickles, green peas and mayonnaise.",
          },
          olchov: "200 g", narx: 18000, img: rasm("1546793665-c74683f339c1"),
        },
        {
          nom: { uz: "Achichuk", ru: "Ачичук", en: "Achichuk" },
          tavsif: {
            uz: "Pomidor, piyoz va rayhon. Oshning eng yaqin hamrohi.",
            ru: "Помидоры, лук и райхон. Лучший спутник плова.",
            en: "Tomato, onion and basil — plov's best companion.",
          },
          olchov: "200 g", narx: 10000, img: rasm("1660991016747-b083fe0b0db4"),
        },
        {
          nom: { uz: "Toshkent salati", ru: "Салат «Ташкент»", en: "Tashkent salad" },
          tavsif: {
            uz: "Ko'k turp, qaynatilgan mol go'shti, tuxum va qovurilgan piyoz.",
            ru: "Зелёная редька, отварная говядина, яйцо и жареный лук.",
            en: "Green radish, boiled beef, egg and fried onion.",
          },
          olchov: "200 g", narx: 20000, img: rasm("1529059997568-3d847b1154f0"),
        },
      ],
    },

    /* ======================= CHOY ======================= */
    {
      id: "choy",
      nom: { uz: "Choy", ru: "Чай", en: "Tea" },
      tavsif: {
        uz: "Choyxonaning yuragi — choynakda damlangan choy.",
        ru: "Сердце чайханы — чай, заваренный в чайнике.",
        en: "The heart of any choyxona — tea brewed by the pot.",
      },
      taomlar: [
        {
          nom: { uz: "Ko'k choy", ru: "Зелёный чай", en: "Green tea" },
          tavsif: {
            uz: "Choynakda damlangan xushbo'y ko'k choy.",
            ru: "Ароматный зелёный чай в чайнике.",
            en: "Fragrant green tea brewed in a teapot.",
          },
          olchov: "1 choynak", narx: 5000, xit: true, img: rasm("1606377695906-236fdfcef767"),
        },
        {
          nom: { uz: "Qora choy", ru: "Чёрный чай", en: "Black tea" },
          tavsif: {
            uz: "Achchiq damlangan qora choy.",
            ru: "Крепко заваренный чёрный чай.",
            en: "Strong-brewed black tea.",
          },
          olchov: "1 choynak", narx: 5000, img: rasm("1646288401762-632357729f59"),
        },
        {
          nom: { uz: "Limonli choy", ru: "Чай с лимоном", en: "Lemon tea" },
          tavsif: {
            uz: "Qora yoki ko'k choy, limon va shakar bilan.",
            ru: "Чёрный или зелёный чай с лимоном и сахаром.",
            en: "Black or green tea with lemon and sugar.",
          },
          olchov: "1 choynak", narx: 8000, img: rasm("1548855917-74db67f6f74e"),
        },
      ],
    },

    /* ======================= ICHIMLIKLAR ======================= */
    {
      id: "ichimlik",
      nom: { uz: "Ichimliklar", ru: "Напитки", en: "Drinks" },
      tavsif: {
        uz: "Salqin gazli ichimliklar, mevali sharbatlar va Chortoq mineral suvi.",
        ru: "Прохладные газированные напитки, фруктовые соки и минеральная вода «Чортак».",
        en: "Chilled soft drinks, fruit juices and Chortoq mineral water.",
      },
      taomlar: [
        {
          nom: "Coca-Cola",
          tavsif: { uz: "Salqin holda tortiladi.", ru: "Подаётся охлаждённой.", en: "Served chilled." },
          olchov: "1 litr", narx: 12000, img: "images/cola.jpg", sigdir: true,
        },
        {
          nom: "Pepsi",
          tavsif: { uz: "Salqin holda tortiladi.", ru: "Подаётся охлаждённой.", en: "Served chilled." },
          olchov: "1 litr", narx: 12000, img: "images/pepsi.jpg", sigdir: true,
        },
        {
          nom: "Fanta",
          tavsif: { uz: "Apelsin ta'mli gazli ichimlik.", ru: "Газированный напиток со вкусом апельсина.", en: "Orange-flavoured soft drink." },
          olchov: "1 litr", narx: 12000, img: "images/fanta.jpg", sigdir: true,
        },
        {
          nom: "Sprite",
          tavsif: { uz: "Limon-laym ta'mli gazli ichimlik.", ru: "Газированный напиток со вкусом лимона и лайма.", en: "Lemon-lime soft drink." },
          olchov: "1 litr", narx: 12000, img: "images/sprite.jpg", sigdir: true,
        },
        {
          nom: { uz: "Mevali sharbat", ru: "Фруктовый сок", en: "Fruit juice" },
          tavsif: {
            uz: "Sochnaya Dolina, Dena, Pro100Sok va boshqalar — olma, apelsin, shaftoli, olcha va boshqa ta'mlar.",
            ru: "«Сочная Долина», Dena, «Про100Сок» и другие — яблоко, апельсин, персик, вишня и другие вкусы.",
            en: "Sochnaya Dolina, Dena, Pro100Sok and more — apple, orange, peach, cherry and other flavours.",
          },
          olchov: "1 litr", narx: 15000, img: "images/sharbat.jpg",
        },
        {
          nom: { uz: "Chortoq", ru: "Чортак", en: "Chortoq" },
          tavsif: {
            uz: "Shifobaxsh Chortoq mineral suvi.",
            ru: "Целебная минеральная вода «Чортак».",
            en: "Healing Chortoq mineral water.",
          },
          olchov: "0,5 litr", narx: 6000, img: "images/chortoq.jpg", sigdir: true,
        },
      ],
    },
  ],
};
