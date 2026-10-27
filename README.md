# Portfólio – Viliam

Osobná webová stránka študenta inžinierskeho štúdia odboru **Počítačové siete** na Technickej univerzite v Košiciach (TUKE). Stránka predstavuje moje štúdium, projekty, zručnosti a kontakt.

Celý dizajn je postavený ako počítačová sieť:

- **Topológia v úvode:** profilová fotka je router a sekcie stránky sú uzly prepojené káblami. Kliknutím na uzol pošleš po kábli paket a stránka sa presunie do danej sekcie.
- **Farby káblov:** každá sekcia má farbu jedného páru vodičov z ethernetového kábla podľa zapojenia T568B (oranžová, zelená, modrá, hnedá). Rovnaká farba sa opakuje v topológii, v navigácii aj pri nadpise sekcie.
- **Živé pozadie:** sieť uzlov, po ktorej putujú pakety. Kurzor sa správa ako ďalší uzol a kliknutie do prázdneho miesta vyšle dávku paketov. Pri scrollovaní sa sieť posúva do hĺbky, zahustí sa prevádzka a cez obrazovku putuje žiara vo farbe aktuálnej sekcie.
- **Animácie pri scrollovaní:** pod lištou sa napĺňa kábel priebehu a sekcie sa pri príchode „pripoja“ (riadky sa dopĺňajú postupne ako trasy v smerovacej tabuľke).
- **Svetlý a tmavý režim:** predvolene podľa systému, dá sa prepnúť tlačidlom.
- **Slovenčina a angličtina:** jazyk sa vyberie podľa prehliadača a dá sa prepnúť tlačidlom SK/EN. Odkaz s `?lang=en` otvorí priamo anglickú verziu.
- **Projekty ako smerovacia tabuľka:** kliknutím na projekt sa otvorí jeho detail s popisom a obrázkom.
- **Technológie sú odkazy:** napríklad Python, React alebo SQLite sa otvoria v novej karte na oficiálnej stránke. Pojmy ako NLP alebo OSPF vedú na Wikipédiu.

Stránka funguje aj na mobile a dá sa ovládať klávesnicou. Animácie sa riadia nastavením systému (obmedzenie pohybu), ale návštevník si ich môže prepínačom zapnúť alebo vypnúť. Voľba režimu aj animácií sa pamätá v prehliadači.

## Technológie

- [React 19](https://react.dev/)
- [Vite](https://vite.dev/)
- čisté CSS (bez frameworku), písmo [Archivo](https://fonts.google.com/specimen/Archivo)
- Canvas API na animované pozadie
- ESLint

## Spustenie

Potrebuješ [Node.js](https://nodejs.org/) (odporúčaná je aktuálna LTS verzia).

```bash
npm install      # nainštaluje závislosti
npm run dev      # spustí vývojový server s automatickým obnovovaním
npm run lint     # skontroluje kód
npm run build    # vytvorí produkčnú verziu do priečinka dist/
npm run preview  # spustí lokálne už zostavenú verziu z dist/
```

## Štruktúra projektu

```text
site/
├── index.html               # vstupný HTML súbor, načítanie písma
├── public/
│   ├── favicon.svg          # ikonka stránky
│   └── prefs.js             # jazyk, tmavý režim a animácie pred vykreslením
└── src/
    ├── content.js           # VŠETKY TEXTY v slovenčine aj angličtine + kontaktné údaje
    ├── techLinks.js         # kam vedie kliknutie na jednotlivé technológie
    ├── main.jsx             # pripojenie Reactu do portfólia
    ├── App.jsx              # portfólio: sekcie, topológia, detail projektu
    ├── NetworkBackground.jsx  # animované sieťové pozadie (canvas)
    ├── App.css              # vzhľad portfólia
    ├── index.css            # farby (svetlé aj tmavé), písmo a globálne štýly
    └── assets/              # fotka a náhľady projektov
```

## Ako upraviť obsah

Všetky texty stránky sú v `src/content.js`, vždy v dvoch verziách: `sk` a `en`. Pri každej zmene uprav obe.

- **Osobné údaje** (meno, e-mail, LinkedIn, GitHub) sú v objekte `profile` na začiatku súboru. Hodnota v `[hranatých zátvorkách]` je zástupný text a na stránke sa nezobrazí ako odkaz.
- **Nový projekt:** pridaj ho do `projects.items` v oboch jazykoch a jeho technológie a obrázok do `projectBase`. Obrázok vlož do `src/assets/`.
- **Zručnosti:** zoznamy nástrojov sú v `skillTools`, názvy skupín v `skills.groups`.
- **Odkaz na technológiu:** pridaj dvojicu `'Názov': 'https://…'` do `src/techLinks.js`. Názov musí presne zodpovedať textu štítka.
- **Farby** sú CSS premenné na začiatku `src/index.css`, zvlášť pre svetlý a tmavý režim.

## Čo ešte treba doplniť

- obrázok a popis riešenia pre Packet Tracer projekt.

Ďalšie nápady: filtrovanie projektov podľa technológie, kontaktný formulár.
