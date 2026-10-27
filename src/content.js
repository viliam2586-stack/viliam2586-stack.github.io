import oopJavaImage from './assets/OOP_java.png'
import bakalarkaImage from './assets/bakalarka.png'
import portfolioImage from './assets/Portfolio.png'

// Osobné údaje. Hodnoty v [hranatých zátvorkách] sú zástupný text
// a na stránke sa zobrazia bez odkazu.
export const profile = {
  firstName: 'Viliam',
  fullName: 'Viliam Džubara',
  email: 'viliam2586@gmail.com',
  location: 'Košice',
  linkedin: 'https://www.linkedin.com/in/viliam-d%C5%BEubara-7388203a3/',
  github: 'https://github.com/viliam2586-stack',
}

export function isPlaceholder(value) {
  return value.startsWith('[')
}

// Adresu zobrazíme bez https://www. a koncovej lomky, s dekódovanou diakritikou
// (linkedin.com/in/viliam-džubara-… namiesto %C5%BE).
export function displayUrl(value) {
  return decodeURIComponent(value)
    .replace(/^https?:\/\/(www\.)?/, '')
    .replace(/\/$/, '')
}

// Spoločné pre oba jazyky: technológie a obrázky projektov.
const projectBase = {
  'bakalarska-praca': {
    technologies: ['Python', 'Flask', 'React', 'SQLite', 'NLP'],
    image: bakalarkaImage,
  },
  'objektovo-orientovane-programovanie': {
    technologies: ['Java', 'OOP'],
    image: oopJavaImage,
  },
  'packet-tracer-projekt': {
    technologies: ['Packet Tracer', 'VLAN', 'OSPF'],
  },
  portfolio: {
    technologies: ['React', 'JavaScript', 'CSS'],
    image: portfolioImage,
  },
}

function withBase(projects) {
  return projects.map((project) => ({ ...projectBase[project.id], ...project }))
}

const skillTools = {
  networks: ['TCP/IP', 'VLAN', 'OSPF', 'Cisco Packet Tracer', 'GNS3'],
  systems: ['Linux', 'Windows Server', 'VirtualBox', 'VMware'],
  programming: ['Java', 'C++', 'Python', 'HTML', 'CSS', 'JavaScript', 'Git'],
}

const sk = {
  meta: {
    title: 'Viliam Džubara – portfólio',
    description: 'Viliam Džubara, študent počítačových sietí na TUKE. Projekty, zručnosti a kontakt.',
  },
  nav: {
    label: 'Hlavná navigácia',
    sections: {
      'o-mne': { label: 'O mne', note: 'štúdium a zameranie' },
      projekty: { label: 'Projekty', note: (count) => `${count} projekty` },
      zrucnosti: { label: 'Zručnosti', note: 'siete, systémy, kód' },
      kontakt: { label: 'Kontakt', note: 'ozvi sa' },
    },
  },
  settings: {
    language: 'Switch to English',
    languageShort: 'EN',
    dark: 'Tmavý režim',
    toDark: 'Prepnúť na tmavý režim',
    toLight: 'Prepnúť na svetlý režim',
    motion: 'Animácie',
  },
  intro: {
    lead: 'Študujem počítačové siete na Technickej univerzite v Košiciach. Zameriavam sa na smerovanie, prepínané siete a servery a popri škole programujem vlastné projekty.',
    hint: 'Klikni na uzol v sieti a pošli paket do sekcie, ktorá ťa zaujíma.',
    photoAlt: 'Viliam',
  },
  about: {
    title: 'O mne',
    subtitle: 'Siete, servery a chuť stále sa zlepšovať.',
    lead: 'Som študentom inžinierskeho štúdia odboru Počítačové siete na Technickej univerzite v Košiciach.',
    paragraphs: [
      'Bakalársky titul som získal v rovnakom odbore, počas ktorého som sa venoval počítačovým sieťam, operačným systémom, bezpečnosti a programovaniu vrátane objektovo orientovaného programovania a webových technológií.',
      'Momentálne sa zameriavam najmä na smerovanie, prepínané siete a serverové technológie. Vo voľnom čase rád pracujem na vlastných projektoch, kde si získané vedomosti skúšam v praxi.',
    ],
    facts: [
      ['Vzdelanie', 'Ing. štúdium, Počítačové siete'],
      ['Zameranie', 'Siete a serverové technológie'],
      ['Vo voľnom čase', 'Posilňovňa, šport a učenie sa C++'],
    ],
  },
  projects: {
    title: 'Projekty',
    subtitle: 'Vyber projekt a otvorí sa jeho detail. Technológie otvoria svoju stránku v novej karte.',
    columns: ['Projekt', 'Popis', 'Technológie'],
    detailKind: 'Detail projektu',
    close: 'Zavrieť',
    imageAlt: (title) => `Náhľad projektu ${title}`,
    imageMissing: 'Obrázok topológie doplním čoskoro.',
    items: withBase([
      {
        id: 'bakalarska-praca',
        title: 'AI Fact Checker',
        kind: 'Bakalárska práca',
        shortDescription: 'Full-stack aplikácia na overovanie pravdivosti tvrdení pomocou AI.',
        details:
          'AI Fact Checker je full-stack webová aplikácia na overovanie pravdivosti tvrdení. Používateľ zadá tvrdenie, aplikácia vyhľadá relevantné zdroje pomocou SerpAPI a následne ich analyzuje pomocou modelov Natural Language Inference. Výsledkom je verdikt Pravda, Nepravda alebo Nejednoznačné spolu s nájdenými dôkazmi a zdrojmi. Na projekte som pracoval s backendom vo Flasku a Pythone, frontendovým rozhraním v Reacte a databázou SQLite. Pri analýze tvrdení sú použité modely RoBERTa a mDeBERTa-v3. Aplikácia obsahuje aj históriu overovaní, štatistiky a cache vrstvu.',
      },
      {
        id: 'objektovo-orientovane-programovanie',
        title: 'Objektovo orientované programovanie',
        kind: 'Školský projekt',
        shortDescription: 'Java projekt, v ktorom som vytváral vesmír, planéty, slnečnú sústavu a zvieratá.',
        details:
          'Školský projekt zameraný na učenie sa programovacieho jazyka Java a princípov objektovo orientovaného programovania. V rámci projektu som vytváral rôzne objekty a modely, napríklad vesmír, planéty, slnečnú sústavu a zvieratá. Pri práci som si precvičil tvorbu tried a objektov, ich vlastnosti a správanie.',
      },
      {
        id: 'packet-tracer-projekt',
        title: 'Packet Tracer projekt',
        kind: 'Sieťový návrh',
        shortDescription: 'Návrh a konfigurácia počítačovej siete.',
        details: 'Sem neskôr doplníme topológiu siete, konfiguráciu zariadení a vysvetlenie riešenia.',
      },
      {
        id: 'portfolio',
        title: 'Toto portfólio',
        kind: 'Osobný projekt',
        shortDescription: 'Osobná webová stránka s mojimi projektmi a zručnosťami.',
        details:
          'Osobná webová stránka vytvorená na prezentáciu mojich skúseností, zručností a projektov. Pri tvorbe pracujem s Reactom, JavaScriptom a CSS a postupne sa učím vytvárať prehľadné, responzívne a interaktívne webové rozhrania.',
      },
    ]),
  },
  skills: {
    title: 'Zručnosti',
    subtitle: 'Oblasti, s ktorými som pracoval v škole alebo na vlastných projektoch.',
    groups: [
      { title: 'Siete', cable: 'orange', skills: skillTools.networks },
      { title: 'Systémy a servery', cable: 'green', skills: skillTools.systems },
      { title: 'Programovanie', cable: 'blue', skills: skillTools.programming },
      { title: 'Databázy a jazyky', cable: 'brown', skills: ['SQL', 'Slovenčina', 'Angličtina (B2)'] },
    ],
    newTab: 'otvorí sa v novej karte',
  },
  contact: {
    title: 'Kontakt',
    subtitle: 'Chceš spolupracovať alebo sa niečo opýtať? Ozvi sa.',
    email: 'E-mail',
  },
  footer: {
    backToTop: 'Späť na začiatok',
  },
}

const en = {
  meta: {
    title: 'Viliam Džubara – portfolio',
    description: 'Viliam Džubara, computer networks student at the Technical University of Košice. Projects, skills and contact.',
  },
  nav: {
    label: 'Main navigation',
    sections: {
      'o-mne': { label: 'About', note: 'studies and focus' },
      projekty: { label: 'Projects', note: (count) => `${count} projects` },
      zrucnosti: { label: 'Skills', note: 'networks, systems, code' },
      kontakt: { label: 'Contact', note: 'get in touch' },
    },
  },
  settings: {
    language: 'Prepnúť do slovenčiny',
    languageShort: 'SK',
    dark: 'Dark mode',
    toDark: 'Switch to dark mode',
    toLight: 'Switch to light mode',
    motion: 'Animations',
  },
  intro: {
    lead: 'I study computer networks at the Technical University of Košice. I focus on routing, switched networks and servers, and I build my own projects alongside my studies.',
    hint: 'Click a node in the network to send a packet to the section you want to see.',
    photoAlt: 'Viliam',
  },
  about: {
    title: 'About me',
    subtitle: 'Networks, servers and a drive to keep improving.',
    lead: 'I am a master’s (Ing.) student of Computer Networks at the Technical University of Košice, Slovakia.',
    paragraphs: [
      'I earned my bachelor’s degree in the same field, covering computer networks, operating systems, security and programming, including object-oriented programming and web technologies.',
      'Right now I focus mainly on routing, switched networks and server technologies. In my free time I work on my own projects, where I put what I have learned into practice.',
    ],
    facts: [
      ['Education', 'Master’s (Ing.) studies, Computer Networks'],
      ['Focus', 'Networks and server technologies'],
      ['Free time', 'Gym, sports and learning C++'],
    ],
  },
  projects: {
    title: 'Projects',
    subtitle: 'Choose a project to see its details. Technologies open their website in a new tab.',
    columns: ['Project', 'Description', 'Technologies'],
    detailKind: 'Project detail',
    close: 'Close',
    imageAlt: (title) => `Preview of ${title}`,
    imageMissing: 'A topology diagram is coming soon.',
    items: withBase([
      {
        id: 'bakalarska-praca',
        title: 'AI Fact Checker',
        kind: 'Bachelor’s thesis',
        shortDescription: 'A full-stack app that checks whether claims are true using AI.',
        details:
          'AI Fact Checker is a full-stack web application for verifying claims. The user enters a claim, the app finds relevant sources with SerpAPI and analyses them with Natural Language Inference models. The result is a verdict of True, False or Inconclusive, together with the evidence and sources found. I built the backend in Python with Flask, the frontend in React and the database in SQLite. Claims are analysed with the RoBERTa and mDeBERTa-v3 models. The app also keeps a history of checks, statistics and a cache layer.',
      },
      {
        id: 'objektovo-orientovane-programovanie',
        title: 'Object-oriented programming',
        kind: 'University project',
        shortDescription: 'A Java project modelling the universe, planets, the solar system and animals.',
        details:
          'A university project for learning Java and the principles of object-oriented programming. I modelled various objects such as the universe, planets, the solar system and animals, and practised designing classes and objects, their properties and behaviour.',
      },
      {
        id: 'packet-tracer-projekt',
        title: 'Packet Tracer project',
        kind: 'Network design',
        shortDescription: 'Design and configuration of a computer network.',
        details: 'The network topology, device configuration and an explanation of the solution will be added here.',
      },
      {
        id: 'portfolio',
        title: 'This portfolio',
        kind: 'Personal project',
        shortDescription: 'My personal website with my projects and skills.',
        details:
          'A personal website that presents my experience, skills and projects. Building it, I work with React, JavaScript and CSS and keep learning how to create clear, responsive and interactive web interfaces.',
      },
    ]),
  },
  skills: {
    title: 'Skills',
    subtitle: 'Areas I have worked with at university or in my own projects.',
    groups: [
      { title: 'Networking', cable: 'orange', skills: skillTools.networks },
      { title: 'Systems and servers', cable: 'green', skills: skillTools.systems },
      { title: 'Programming', cable: 'blue', skills: skillTools.programming },
      { title: 'Databases and languages', cable: 'brown', skills: ['SQL', 'Slovak (native)', 'English (B2)'] },
    ],
    newTab: 'opens in a new tab',
  },
  contact: {
    title: 'Contact',
    subtitle: 'Want to work together or ask something? Get in touch.',
    email: 'Email',
  },
  footer: {
    backToTop: 'Back to top',
  },
}

export const content = { sk, en }

export const languages = ['sk', 'en']

export function currentLanguage() {
  return document.documentElement.lang === 'en' ? 'en' : 'sk'
}

// Zmena jazyka prepínačom: <html lang>, uložená voľba a ?lang= v adrese,
// aby sa dal poslať odkaz priamo na anglickú verziu. Počiatočný jazyk
// nastavuje public/prefs.js.
export function applyLanguage(lang) {
  document.documentElement.lang = lang
  try {
    localStorage.setItem('lang', lang)
  } catch {
    // Bez úložiska platí voľba len do zatvorenia stránky.
  }

  const url = new URL(window.location.href)
  if (lang === 'en') {
    url.searchParams.set('lang', 'en')
  } else {
    url.searchParams.delete('lang')
  }
  history.replaceState(null, '', url)
}

export function setDocumentMeta({ title, description }) {
  document.title = title
  document.querySelector('meta[name="description"]')?.setAttribute('content', description)
}
