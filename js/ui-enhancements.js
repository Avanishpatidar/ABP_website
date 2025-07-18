// Loader logic
window.addEventListener('load', () => {
  const loader = document.getElementById('loader');
  if (loader) {
    loader.classList.add('hidden');
    setTimeout(() => loader.style.display = 'none', 600);
  }
});

// Theme toggle logic
const themeToggle = document.getElementById('theme-toggle');
const themeIcon = document.getElementById('theme-icon');
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

function setTheme(dark) {
  if (dark) {
    document.documentElement.classList.add('dark-theme');
    localStorage.setItem('theme', 'dark');
    if (themeIcon) themeIcon.style.transform = 'rotate(40deg)';
  } else {
    document.documentElement.classList.remove('dark-theme');
    localStorage.setItem('theme', 'light');
    if (themeIcon) themeIcon.style.transform = 'rotate(0deg)';
  }
}

function toggleTheme() {
  const isDark = document.documentElement.classList.contains('dark-theme');
  setTheme(!isDark);
}

if (themeToggle) {
  themeToggle.addEventListener('click', toggleTheme);
  // On load, set theme from localStorage or system
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme) {
    setTheme(savedTheme === 'dark');
  } else {
    setTheme(prefersDark);
  }
}

// Enhanced entrance animation for skills and social links
function animateStaggered(selector, className, delay = 100) {
  const items = document.querySelectorAll(selector);
  items.forEach((item, i) => {
    setTimeout(() => {
      item.classList.add(className);
    }, i * delay);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  animateStaggered('.skill-tag', 'fadeInSection', 80);
  animateStaggered('.social-link', 'fadeInSection', 120);
  animateStaggered('.view-button', 'fadeInSection', 120);

  // Add hover animation to nav links
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('mouseenter', () => {
      link.classList.add('nav-hover-animate');
    });
    link.addEventListener('mouseleave', () => {
      link.classList.remove('nav-hover-animate');
    });
  });

  // Add pop/bounce to skill tags on hover
  document.querySelectorAll('.skill-tag').forEach(tag => {
    tag.addEventListener('mouseenter', () => {
      tag.classList.add('pop-animate');
    });
    tag.addEventListener('mouseleave', () => {
      tag.classList.remove('pop-animate');
    });
  });
});