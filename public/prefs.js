// Nastavenia návštevníka sa aplikujú ešte pred vykreslením stránky, aby
// animácie, tmavý režim ani jazyk pri načítaní neprebleskli.
// Poradie: ?lang= v adrese, potom uložená voľba, potom nastavenie systému.
;(function () {
  function stored(key) {
    try {
      return localStorage.getItem(key)
    } catch {
      return null
    }
  }

  var root = document.documentElement
  var motion = stored('motion')
  var theme = stored('theme')
  var lang = new URLSearchParams(window.location.search).get('lang') || stored('lang')
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  var dark = window.matchMedia('(prefers-color-scheme: dark)').matches
  var browserSlovak = /^(sk|cs)\b/i.test(navigator.language || '')

  root.dataset.motion = motion === 'on' || motion === 'off' ? motion : reduce ? 'off' : 'on'
  root.dataset.theme = theme === 'light' || theme === 'dark' ? theme : dark ? 'dark' : 'light'
  root.lang = lang === 'sk' || lang === 'en' ? lang : browserSlovak ? 'sk' : 'en'
})()
