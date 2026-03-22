// ── NAV ──────────────────────────────────────────────────
const nav     = document.querySelector('.nav')
const toggle  = document.querySelector('.nav-toggle')
const navMenu = document.querySelector('.nav-links')
const links   = document.querySelectorAll('.nav-links a')
const sections = document.querySelectorAll('section[id]')

// Scrolled backdrop
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 20)
}, { passive: true })

// Mobile toggle
toggle?.addEventListener('click', () => {
  const open = toggle.getAttribute('aria-expanded') === 'true'
  toggle.setAttribute('aria-expanded', String(!open))
  navMenu.classList.toggle('open', !open)
})

// Close on link click
links.forEach(link => {
  link.addEventListener('click', () => {
    toggle?.setAttribute('aria-expanded', 'false')
    navMenu?.classList.remove('open')
  })
})

// Active section highlight
const navObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      links.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`)
      })
    }
  })
}, { rootMargin: '-40% 0px -55% 0px' })

sections.forEach(s => navObserver.observe(s))

// ── SCROLL ANIMATIONS ────────────────────────────────────
const animated = document.querySelectorAll('[data-animate]')

if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  animated.forEach(el => el.setAttribute('data-animate', 'visible'))
} else {
  const scrollObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.setAttribute('data-animate', 'visible')
        scrollObserver.unobserve(entry.target)
      }
    })
  }, { threshold: 0.08, rootMargin: '0px 0px -32px 0px' })

  animated.forEach((el, i) => {
    el.style.setProperty('--stagger', String(i % 4))
    scrollObserver.observe(el)
  })
}

