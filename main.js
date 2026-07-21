import './style.css'

// Year
document.getElementById('year').textContent = new Date().getFullYear()

// Nav scroll + mobile menu
const nav = document.getElementById('nav')
const menuBtn = document.getElementById('menuBtn')
const navLinks = document.getElementById('navLinks')
window.addEventListener('scroll', () => nav.classList.toggle('scrolled', window.scrollY > 20))
menuBtn.addEventListener('click', () => {
  menuBtn.classList.toggle('open')
  navLinks.classList.toggle('open')
})
navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
  menuBtn.classList.remove('open')
  navLinks.classList.remove('open')
}))

// Theme toggle
const themeToggle = document.getElementById('themeToggle')
themeToggle.addEventListener('click', () => {
  const root = document.documentElement
  const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark'
  root.setAttribute('data-theme', next)
})

// Reveal on scroll
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target) } })
}, { threshold: 0.12 })
document.querySelectorAll('.reveal').forEach(el => io.observe(el))

// Animated counters
const countObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (!e.isIntersecting) return
    const el = e.target
    const target = parseInt(el.dataset.count, 10)
    let cur = 0
    const step = Math.max(1, Math.ceil(target / 40))
    const t = setInterval(() => {
      cur += step
      if (cur >= target) { cur = target; clearInterval(t) }
      el.textContent = cur + '+'
    }, 30)
    countObserver.unobserve(el)
  })
}, { threshold: 0.5 })
document.querySelectorAll('.stat-num').forEach(el => countObserver.observe(el))

// Terminal
const termOutput = document.getElementById('terminalOutput')
const termInput = document.getElementById('terminalInput')
const commands = {
  help: 'Available commands: help, about, skills, projects, contact, cv, clear',
  about: "Hi, I'm Mohamed Aziz Nasri.\nSoftware Engineering Student at ESPRIT.\nFull-Stack Developer & Graphic Designer.",
  skills: 'Java, PHP, JavaScript, TypeScript, C++, SQL\nSymfony, Next.js, React, Bootstrap\nMySQL, Oracle | Cisco, VPN, OSPF\nPhotoshop, Illustrator, Figma',
  projects: '1. Smart Pharmacy — PHP/Symfony\n2. EduTech — E-learning platform\n3. Enterprise Network — Cisco/VPN',
  contact: 'Email: aziz@example.com\nGitHub: github.com/aziz\nLinkedIn: linkedin.com/in/aziz',
  cv: 'Downloading CV... (link your resume file here)',
}
function printTerm(text) {
  const div = document.createElement('div')
  div.className = 't-out'
  div.textContent = text
  termOutput.appendChild(div)
  termOutput.parentElement.scrollTop = termOutput.parentElement.scrollHeight
}
termInput.addEventListener('keydown', (e) => {
  if (e.key !== 'Enter') return
  const cmd = termInput.value.trim().toLowerCase()
  termInput.value = ''
  const prompt = document.createElement('div')
  prompt.className = 't-out'
  prompt.innerHTML = `<strong style="color:#27c93f">visitor@portfolio:~$</strong> ${cmd}`
  termOutput.appendChild(prompt)
  if (cmd === 'clear') { termOutput.innerHTML = ''; return }
  printTerm(commands[cmd] || `Command not found: ${cmd}. Type 'help'.`)
})
document.querySelector('.terminal').addEventListener('click', () => termInput.focus())

// Design filters
const filterBtns = document.querySelectorAll('.filter-btn')
const designItems = document.querySelectorAll('.design-item')
filterBtns.forEach(btn => btn.addEventListener('click', () => {
  filterBtns.forEach(b => b.classList.remove('active'))
  btn.classList.add('active')
  const f = btn.dataset.filter
  designItems.forEach(item => item.classList.toggle('hide', f !== 'all' && item.dataset.cat !== f))
}))

// Lightbox
const lightbox = document.getElementById('lightbox')
const lightboxContent = document.getElementById('lightboxContent')
const lightboxClose = document.getElementById('lightboxClose')
designItems.forEach(item => item.addEventListener('click', () => {
  lightboxContent.style.background = item.style.background
  lightboxContent.textContent = item.querySelector('span').textContent
  lightbox.classList.add('open')
  lightbox.setAttribute('aria-hidden', 'false')
}))
lightboxClose.addEventListener('click', closeLightbox)
lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox() })
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeLightbox() })
function closeLightbox() {
  lightbox.classList.remove('open')
  lightbox.setAttribute('aria-hidden', 'true')
}

// Contact form
const form = document.getElementById('contactForm')
const status = document.getElementById('formStatus')
form.addEventListener('submit', (e) => {
  e.preventDefault()
  status.textContent = 'Sending...'
  setTimeout(() => {
    status.textContent = 'Thanks! Your message has been queued. (Connect EmailJS to deliver.)'
    form.reset()
  }, 900)
})

// Particles canvas
const canvas = document.getElementById('particles')
const ctx = canvas.getContext('2d')
let particles = []
let mouse = { x: -1000, y: -1000 }
function resize() {
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight
}
resize()
window.addEventListener('resize', resize)
window.addEventListener('mousemove', (e) => { mouse.x = e.clientX; mouse.y = e.clientY })
function initParticles() {
  particles = []
  const count = Math.min(60, Math.floor(window.innerWidth / 22))
  for (let i = 0; i < count; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      r: Math.random() * 1.8 + 0.6,
    })
  }
}
initParticles()
function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  particles.forEach(p => {
    p.x += p.vx; p.y += p.vy
    if (p.x < 0 || p.x > canvas.width) p.vx *= -1
    if (p.y < 0 || p.y > canvas.height) p.vy *= -1
    const dx = p.x - mouse.x, dy = p.y - mouse.y
    const dist = Math.sqrt(dx * dx + dy * dy)
    if (dist < 120) {
      p.x += (dx / dist) * 0.8
      p.y += (dy / dist) * 0.8
    }
    ctx.beginPath()
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
    ctx.fillStyle = 'rgba(56,189,248,0.5)'
    ctx.fill()
  })
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x, dy = particles[i].y - particles[j].y
      const d = Math.sqrt(dx * dx + dy * dy)
      if (d < 130) {
        ctx.beginPath()
        ctx.moveTo(particles[i].x, particles[i].y)
        ctx.lineTo(particles[j].x, particles[j].y)
        ctx.strokeStyle = `rgba(37,99,235,${0.15 * (1 - d / 130)})`
        ctx.lineWidth = 0.6
        ctx.stroke()
      }
    }
  }
  requestAnimationFrame(animate)
}
animate()
