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

function setTheme(isLight) {
  if (isLight) {
    document.documentElement.classList.add('light-theme');
    localStorage.setItem('theme', 'light');
    if (themeIcon) {
      themeIcon.innerHTML = `
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
      `;
    }
  } else {
    document.documentElement.classList.remove('light-theme');
    localStorage.setItem('theme', 'dark');
    if (themeIcon) {
      themeIcon.innerHTML = `
        <circle cx="12" cy="12" r="5"></circle>
        <path d="M12 1v2"></path>
        <path d="M12 21v2"></path>
        <path d="M4.22 4.22l1.42 1.42"></path>
        <path d="M18.36 18.36l1.42 1.42"></path>
        <path d="M1 12h2"></path>
        <path d="M21 12h2"></path>
        <path d="M4.22 19.78l1.42-1.42"></path>
        <path d="M18.36 5.64l1.42-1.42"></path>
      `;
    }
  }
}

function toggleTheme() {
  const isLight = document.documentElement.classList.contains('light-theme');
  setTheme(!isLight);
}

if (themeToggle) {
  themeToggle.addEventListener('click', toggleTheme);
  // On load, set theme from localStorage or system preference
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme) {
    setTheme(savedTheme === 'light');
  } else {
    // Default to dark theme (original black theme)
    setTheme(!prefersDark);
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
  animateStaggered('.work-item', 'fadeInSection', 150);
  animateStaggered('.blog-post', 'fadeInSection', 120);

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

  // Add hover effects to work items and blog posts
  document.querySelectorAll('.work-item, .blog-post').forEach(item => {
    item.addEventListener('mouseenter', () => {
      item.style.transform = 'translateY(-5px) scale(1.02)';
    });
    item.addEventListener('mouseleave', () => {
      item.style.transform = 'translateY(0) scale(1)';
    });
  });
});