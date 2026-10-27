import { useEffect, useRef, useState } from 'react'
import profileImage from './assets/profile.JPEG'
import NetworkBackground from './NetworkBackground.jsx'
import {
  applyLanguage,
  content,
  currentLanguage,
  displayUrl,
  isPlaceholder,
  profile,
  setDocumentMeta,
} from './content.js'
import { techLinks } from './techLinks.js'
import './App.css'

// Každá sekcia je uzol v topológii. Farba zodpovedá páru vodičov v kábli T568B,
// x/y sú percentá v rámci štvorcovej plochy topológie. Texty sú v content.js.
const sectionLayout = [
  { id: 'o-mne', cable: 'orange', x: 21, y: 20 },
  { id: 'projekty', cable: 'green', x: 80, y: 25 },
  { id: 'zrucnosti', cable: 'blue', x: 22, y: 80 },
  { id: 'kontakt', cable: 'brown', x: 79, y: 77 },
]

function buildSections(t) {
  return sectionLayout.map((layout) => {
    const text = t.nav.sections[layout.id]
    const note =
      typeof text.note === 'function' ? text.note(t.projects.items.length) : text.note
    return { ...layout, label: text.label, note }
  })
}

// Počiatočnú hodnotu nastaví skript v index.html ešte pred vykreslením:
// uložená voľba návštevníka, inak nastavenie systému (prefers-reduced-motion).
function initialMotion() {
  return document.documentElement.dataset.motion !== 'off'
}

function initialDark() {
  return document.documentElement.dataset.theme === 'dark'
}

function savePreference(key, value) {
  try {
    localStorage.setItem(key, value)
  } catch {
    // Bez úložiska platí voľba len do zatvorenia stránky.
  }
}

function TechTag({ name, newTabLabel }) {
  const url = techLinks[name]

  if (!url) {
    return <span className="tag">{name}</span>
  }

  return (
    <a
      className="tag tag-link"
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      title={`${name}: ${newTabLabel}`}
    >
      {name}
      <svg className="tag-icon" viewBox="0 0 12 12" aria-hidden="true">
        <path d="M4.5 2.5h5v5M9.5 2.5 3 9" />
      </svg>
      <span className="visually-hidden"> ({newTabLabel})</span>
    </a>
  )
}

function Topology({ sections, photoAlt, onSend, packet, onPacketArrived }) {
  return (
    <div className="topology">
      <svg
        className="topology-links"
        viewBox="0 0 100 100"
        aria-hidden="true"
      >
        {sections.map((section, index) => (
          <line
            key={section.id}
            className={`topology-link${packet?.id === section.id ? ' is-sending' : ''}`}
            x1="50"
            y1="50"
            x2={section.x}
            y2={section.y}
            pathLength="1"
            style={{ '--cable': `var(--${section.cable})`, '--i': index }}
          />
        ))}
      </svg>

      <div className="topology-router">
        <img src={profileImage} alt={photoAlt} />
      </div>

      {sections.map((section, index) => (
        <a
          key={section.id}
          className="topology-node"
          href={`#${section.id}`}
          onClick={(event) => {
            event.preventDefault()
            onSend(section)
          }}
          style={{
            left: `${section.x}%`,
            top: `${section.y}%`,
            '--cable': `var(--${section.cable})`,
            '--i': index,
          }}
        >
          <span className="topology-port" aria-hidden="true" />
          <span className="topology-label">{section.label}</span>
          <span className="topology-note">{section.note}</span>
        </a>
      ))}

      {packet && (
        <span
          key={packet.key}
          className="packet"
          aria-hidden="true"
          onAnimationEnd={onPacketArrived}
          style={{
            '--to-x': `${packet.x}%`,
            '--to-y': `${packet.y}%`,
            '--cable': `var(--${packet.cable})`,
          }}
        />
      )}
    </div>
  )
}

function App() {
  const [activeSection, setActiveSection] = useState('uvod')
  const [motionOn, setMotionOn] = useState(initialMotion)
  const [darkOn, setDarkOn] = useState(initialDark)
  const [lang, setLang] = useState(currentLanguage)
  const [packet, setPacket] = useState(null)
  const [selectedProject, setSelectedProject] = useState(null)
  const [modalExpanded, setModalExpanded] = useState(false)
  const [modalOrigin, setModalOrigin] = useState(null)
  const closeButtonRef = useRef(null)
  const lastTriggerRef = useRef(null)

  useEffect(() => {
    setDocumentMeta(content[lang].meta)
  }, [lang])

  // Navigácia zvýrazní sekciu, ktorá je práve v strede obrazovky.
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id)
          }
        })
      },
      { rootMargin: '-45% 0px -50% 0px' },
    )

    document
      .querySelectorAll('main > section[id]')
      .forEach((section) => observer.observe(section))

    return () => observer.disconnect()
  }, [])

  // Sekcia sa pri prvom príchode na obrazovku „pripojí“ (trieda is-visible spustí
  // animáciu v CSS). Priebeh scrollovania ide do premennej --scroll pre kábel v lište.
  useEffect(() => {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
            revealObserver.unobserve(entry.target)
          }
        })
      },
      { rootMargin: '0px 0px -15% 0px' },
    )

    document
      .querySelectorAll('main > .section')
      .forEach((section) => revealObserver.observe(section))

    let frame = 0
    function updateScrollProgress() {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        const scrollable = document.documentElement.scrollHeight - window.innerHeight
        const progress = scrollable > 0 ? window.scrollY / scrollable : 0
        document.documentElement.style.setProperty('--scroll', progress.toFixed(4))

        // Posledná sekcia je krátka a do stredu obrazovky sa nemusí dostať,
        // preto ju na úplnom konci stránky označíme ako aktívnu.
        if (scrollable > 0 && progress > 0.995) {
          setActiveSection(sectionLayout[sectionLayout.length - 1].id)
        }
      })
    }

    updateScrollProgress()
    window.addEventListener('scroll', updateScrollProgress, { passive: true })
    window.addEventListener('resize', updateScrollProgress)

    return () => {
      revealObserver.disconnect()
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', updateScrollProgress)
      window.removeEventListener('resize', updateScrollProgress)
    }
  }, [])

  useEffect(() => {
    if (!selectedProject) {
      return undefined
    }

    const animationFrame = requestAnimationFrame(() => {
      setModalExpanded(true)
      closeButtonRef.current?.focus({ preventScroll: true })
    })

    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        setModalExpanded(false)
        setSelectedProject(null)
        lastTriggerRef.current?.focus({ preventScroll: true })
      }
    }

    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      cancelAnimationFrame(animationFrame)
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [selectedProject])

  function toggleMotion() {
    const next = motionOn ? 'off' : 'on'
    document.documentElement.dataset.motion = next
    savePreference('motion', next)
    setMotionOn(!motionOn)
  }

  function toggleTheme() {
    const next = darkOn ? 'light' : 'dark'
    document.documentElement.dataset.theme = next
    savePreference('theme', next)
    setDarkOn(!darkOn)
  }

  function toggleLanguage() {
    const next = lang === 'sk' ? 'en' : 'sk'
    applyLanguage(next)
    setLang(next)
  }

  function scrollToSection(id) {
    document.getElementById(id)?.scrollIntoView({
      behavior: motionOn ? 'smooth' : 'auto',
    })
    history.replaceState(null, '', `#${id}`)
  }

  function sendPacket(section) {
    if (!motionOn) {
      scrollToSection(section.id)
      return
    }

    setPacket({ ...section, key: Date.now() })
  }

  function handlePacketArrived() {
    const target = packet.id
    setPacket(null)
    scrollToSection(target)
  }

  function openProject(project, event) {
    const row = event.currentTarget.closest('.route-row') ?? event.currentTarget
    const bounds = row.getBoundingClientRect()
    const targetWidth = Math.min(900, window.innerWidth - 64)

    lastTriggerRef.current = event.currentTarget
    setModalOrigin({
      x: bounds.left + bounds.width / 2 - window.innerWidth / 2,
      y: bounds.top + bounds.height / 2 - window.innerHeight / 2,
      scale: Math.min(bounds.width / targetWidth, 0.85),
    })
    setModalExpanded(false)
    setSelectedProject(project)
  }

  function closeProject() {
    setModalExpanded(false)
    setSelectedProject(null)
    lastTriggerRef.current?.focus({ preventScroll: true })
  }

  const t = content[lang]
  const sections = buildSections(t)
  const activeCable = sections.find((section) => section.id === activeSection)?.cable
  // Detail projektu sa pri zmene jazyka prekreslí v novom jazyku.
  const openedProject = selectedProject
    ? t.projects.items.find((project) => project.id === selectedProject.id)
    : null

  return (
    <div
      className="site-shell"
      style={{ '--tint': `var(--${activeCable ?? 'blue'})` }}
    >
      <div className="background-tint" aria-hidden="true" />
      <NetworkBackground animate={motionOn} dark={darkOn} />
      <header className="top-bar">
        <a className="brand" href="#uvod">
          {profile.firstName}
        </a>
        <nav className="navigation" aria-label={t.nav.label}>
          {sections.map((section) => (
            <a
              key={section.id}
              className="nav-link"
              href={`#${section.id}`}
              aria-current={activeSection === section.id ? 'true' : undefined}
              style={{ '--cable': `var(--${section.cable})` }}
            >
              {section.label}
            </a>
          ))}
        </nav>
        <div className="settings">
          <button
            className="language-toggle"
            type="button"
            lang={lang === 'sk' ? 'en' : 'sk'}
            aria-label={t.settings.language}
            title={t.settings.language}
            onClick={toggleLanguage}
          >
            {t.settings.languageShort}
          </button>
          <button
            className="theme-toggle"
            type="button"
            aria-pressed={darkOn}
            aria-label={t.settings.dark}
            title={darkOn ? t.settings.toLight : t.settings.toDark}
            onClick={toggleTheme}
          >
            {darkOn ? (
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <circle cx="12" cy="12" r="4.5" />
                <path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.3 5.3l1.4 1.4M17.3 17.3l1.4 1.4M5.3 18.7l1.4-1.4M17.3 6.7l1.4-1.4" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5Z" />
              </svg>
            )}
          </button>
          <button
            className="motion-toggle"
            type="button"
            aria-pressed={motionOn}
            aria-label={t.settings.motion}
            onClick={toggleMotion}
          >
            <span className="motion-toggle-label" aria-hidden="true">
              {t.settings.motion}
            </span>
            <span className="motion-switch" aria-hidden="true" />
          </button>
        </div>
        <span
          className="scroll-cable"
          aria-hidden="true"
          style={{
            '--cable': activeCable
              ? `var(--${activeCable})`
              : 'var(--ink)',
          }}
        >
          <span className="scroll-cable-fill" />
          <span className="scroll-packet" />
        </span>
      </header>

      <main>
        <section id="uvod" className="intro">
          <div className="intro-text">
            <h1>{profile.firstName}</h1>
            <p className="intro-lead">{t.intro.lead}</p>
            <p className="intro-hint">{t.intro.hint}</p>
          </div>
          <Topology
            sections={sections}
            photoAlt={t.intro.photoAlt}
            onSend={sendPacket}
            packet={packet}
            onPacketArrived={handlePacketArrived}
          />
        </section>

        <section id="o-mne" className="section" style={{ '--cable': 'var(--orange)' }}>
          <div className="section-head">
            <h2>{t.about.title}</h2>
            <p>{t.about.subtitle}</p>
          </div>
          <div className="section-body about">
            <p className="about-lead">{t.about.lead}</p>
            {t.about.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
            <dl className="facts">
              {t.about.facts.map(([term, value]) => (
                <div key={term}>
                  <dt>{term}</dt>
                  <dd>{value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        <section id="projekty" className="section" style={{ '--cable': 'var(--green)' }}>
          <div className="section-head">
            <h2>{t.projects.title}</h2>
            <p>{t.projects.subtitle}</p>
          </div>
          <div className="section-body">
            <div className="route-table" role="list">
              <div className="route-row route-header" aria-hidden="true">
                {t.projects.columns.map((column) => (
                  <span key={column}>{column}</span>
                ))}
              </div>
              {t.projects.items.map((project) => (
                <div className="route-row" key={project.id} role="listitem">
                  <span className="route-title">
                    <button
                      className="route-open"
                      type="button"
                      onClick={(event) => openProject(project, event)}
                    >
                      {project.title}
                    </button>
                    <span>{project.kind}</span>
                  </span>
                  <span className="route-description">
                    {project.shortDescription}
                  </span>
                  <span className="tag-list">
                    {project.technologies.map((technology) => (
                      <TechTag
                        name={technology}
                        newTabLabel={t.skills.newTab}
                        key={technology}
                      />
                    ))}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="zrucnosti" className="section" style={{ '--cable': 'var(--blue)' }}>
          <div className="section-head">
            <h2>{t.skills.title}</h2>
            <p>{t.skills.subtitle}</p>
          </div>
          <div className="section-body skills">
            {t.skills.groups.map((group) => (
              <div
                className="skill-group"
                key={group.cable}
                style={{ '--cable': `var(--${group.cable})` }}
              >
                <h3>{group.title}</h3>
                <ul className="tag-list">
                  {group.skills.map((skill) => (
                    <li key={skill}>
                      <TechTag name={skill} newTabLabel={t.skills.newTab} />
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <section id="kontakt" className="section" style={{ '--cable': 'var(--brown)' }}>
          <div className="section-head">
            <h2>{t.contact.title}</h2>
            <p>{t.contact.subtitle}</p>
          </div>
          <div className="section-body">
            <dl className="contact-list">
              <div>
                <dt>{t.contact.email}</dt>
                <dd>
                  {isPlaceholder(profile.email) ? (
                    profile.email
                  ) : (
                    <a href={`mailto:${profile.email}`}>{profile.email}</a>
                  )}
                </dd>
              </div>
              {[
                ['LinkedIn', profile.linkedin],
                ['GitHub', profile.github],
              ].map(([label, url]) => (
                <div key={label}>
                  <dt>{label}</dt>
                  <dd>
                    {isPlaceholder(url) ? (
                      url
                    ) : (
                      <a href={url} target="_blank" rel="noopener noreferrer">
                        {displayUrl(url)}
                      </a>
                    )}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </section>
      </main>

      {openedProject && (
        <div
          className="project-modal"
          role="presentation"
          onClick={closeProject}
        >
          <div
            className={`project-modal-content${modalExpanded ? ' is-expanded' : ''}`}
            role="dialog"
            aria-modal="true"
            aria-labelledby="project-modal-title"
            onClick={(event) => event.stopPropagation()}
            style={{
              '--modal-start-x': `${modalOrigin?.x ?? 0}px`,
              '--modal-start-y': `${modalOrigin?.y ?? 0}px`,
              '--modal-start-scale': modalOrigin?.scale ?? 0.8,
            }}
          >
            <div className="modal-head">
              <div>
                <p className="modal-kind">{openedProject.kind}</p>
                <h2 id="project-modal-title">{openedProject.title}</h2>
              </div>
              <button
                ref={closeButtonRef}
                className="modal-close"
                type="button"
                onClick={closeProject}
              >
                {t.projects.close}
              </button>
            </div>
            <div className="modal-body">
              <div>
                <p className="modal-description">{openedProject.details}</p>
                <div className="tag-list">
                  {openedProject.technologies.map((technology) => (
                    <TechTag
                      name={technology}
                      newTabLabel={t.skills.newTab}
                      key={technology}
                    />
                  ))}
                </div>
              </div>
              {openedProject.image ? (
                <img
                  className="project-image"
                  src={openedProject.image}
                  alt={t.projects.imageAlt(openedProject.title)}
                />
              ) : (
                <div className="project-placeholder">
                  {t.projects.imageMissing}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <footer className="bottom-bar">
        <span>© 2026 {profile.fullName}</span>
        <a href="#uvod">{t.footer.backToTop}</a>
      </footer>
    </div>
  )
}

export default App
