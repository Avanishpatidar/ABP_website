// Function to create a copy button for code blocks
function addCopyButtonsToCodeBlocks() {
    const codeBlocks = document.querySelectorAll('.blog-content pre code'); // Target code blocks within blog content

    codeBlocks.forEach(codeBlock => {
        if (!codeBlock.parentElement.querySelector('.code-copy-button')) { // Prevent duplicate buttons
            const copyButton = document.createElement('button');
            copyButton.classList.add('code-copy-button');
            copyButton.textContent = 'Copy';

            copyButton.addEventListener('click', () => {
                navigator.clipboard.writeText(codeBlock.textContent)
                    .then(() => {
                        copyButton.textContent = 'Copied!';
                        setTimeout(() => {
                            copyButton.textContent = 'Copy';
                        }, 2000); // Reset button text after 2 seconds
                    })
                    .catch(err => {
                        console.error('Failed to copy code:', err);
                        copyButton.textContent = 'Error';
                    });
            });

            codeBlock.parentElement.appendChild(copyButton); // Append to the <pre> parent
        }
    });
}


// Function to observe sections for scroll-in animation
function setupSectionAnimations() {
    const sections = document.querySelectorAll('.section');
    const navLinks = document.querySelectorAll('.nav-link');

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fadeInSection'); // Re-use CSS animation
                observer.unobserve(entry.target); // Animate only once
            }
        });
    }, { threshold: 0.2 }); // Trigger animation when 20% of section is visible

    sections.forEach(section => {
        observer.observe(section);
    });

    window.addEventListener('scroll', () => {
        let current = '';

        // Check if we're at the bottom of the page
        if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 50) {
            current = 'contact';
        } else {
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.clientHeight;
                if (pageYOffset >= sectionTop - sectionHeight / 3) { // Highlight earlier
                    current = section.getAttribute('id');
                }
            });
        }

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') && (link.getAttribute('href').substring(1) === current)) {
                link.classList.add('active');
            }
        });
    });
}

document.addEventListener('DOMContentLoaded', () => {
    // Add categorized skills to the skills container
    const skillsContainer = document.getElementById('skills-container');
    if (skillsContainer && typeof skillsData !== 'undefined') {
        Object.entries(skillsData).forEach(([category, skills]) => {
            // Create category container
            const categoryDiv = document.createElement('div');
            categoryDiv.className = 'skill-category';

            // Create category title
            const categoryTitle = document.createElement('div');
            categoryTitle.className = 'skill-category-title';
            categoryTitle.textContent = category;
            categoryDiv.appendChild(categoryTitle);

            // Create skills grid
            const skillsGrid = document.createElement('div');
            skillsGrid.className = 'skill-category-grid';

            // Add skills to grid
            skills.forEach(skill => {
                const skillElement = document.createElement('div');
                skillElement.className = 'skill-tag';

                // Define which logos need an outline (white drop-shadow)
                const outlineSkills = ["Node.js", "Express.js", "Next.js", "Payload CMS", "Vercel", "Railway"];
                const imgClass = outlineSkills.includes(skill.name) ? 'skill-logo outline' : 'skill-logo';

                skillElement.innerHTML = `
                    <img src="${skill.logoUrl}" alt="${skill.name} logo" class="${imgClass}" />
                    ${skill.name}
                `;

                // Apply dynamic hover effect based on skill color
                skillElement.addEventListener('mouseenter', () => {
                    skillElement.style.borderColor = skill.color;
                    skillElement.style.backgroundColor = `${skill.color}15`;
                    skillElement.style.boxShadow = `0 8px 20px -4px ${skill.color}40`;
                    skillElement.style.color = "#fff";
                });

                skillElement.addEventListener('mouseleave', () => {
                    skillElement.style.borderColor = '';
                    skillElement.style.backgroundColor = '';
                    skillElement.style.boxShadow = '';
                    skillElement.style.color = '';
                });

                skillsGrid.appendChild(skillElement);
            });

            categoryDiv.appendChild(skillsGrid);
            skillsContainer.appendChild(categoryDiv);
        });
    }

    // Render Projects
    const projectsContainer = document.getElementById('projects-container');
    if (projectsContainer && typeof projects !== 'undefined') {
        // SVG Icons
        const globeIcon = `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/></svg>`;
        const githubIcon = `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.419-1.305.763-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>`;

        projects.forEach(project => {
            const projectElement = document.createElement('div');
            projectElement.className = 'work-item';

            let buttons = '';

            if (project.website) {
                buttons += `
                    <a href="${project.website}" class="work-link" target="_blank">
                        ${globeIcon}
                        Website
                    </a>
                `;
            }

            if (project.github) {
                buttons += `
                    <a href="${project.github}" class="work-link" target="_blank">
                        ${githubIcon}
                        GitHub
                    </a>
                `;
            }

            projectElement.innerHTML = `
                <div class="work-title">
                    ${project.title}
                    ${project.featured ? '<span class="featured-badge">Featured</span>' : ''}
                </div>
                <p class="work-description">${project.description}</p>
                <div class="work-links">${buttons}</div>
            `;

            projectsContainer.appendChild(projectElement);
        });
    }

    // Mobile Menu Logic
    const mobileBtn = document.getElementById('mobile-menu-btn');
    const mobileOverlay = document.getElementById('mobile-menu-overlay');
    const mobileLinks = document.querySelectorAll('.mobile-nav-link');
    let isMenuOpen = false;

    if (mobileBtn && mobileOverlay) {
        mobileBtn.addEventListener('click', () => {
            isMenuOpen = !isMenuOpen;
            if (isMenuOpen) {
                mobileOverlay.classList.add('active');
                mobileBtn.textContent = '// CLOSE';
                document.body.style.overflow = 'hidden'; // Prevent scrolling
            } else {
                mobileOverlay.classList.remove('active');
                mobileBtn.textContent = '// MENU';
                document.body.style.overflow = '';
            }
        });

        // Close menu when a link is clicked
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                isMenuOpen = false;
                mobileOverlay.classList.remove('active');
                mobileBtn.textContent = '// MENU';
                document.body.style.overflow = '';
            });
        });
    }

    // Scroll to Top Logic
    const scrollTopBtn = document.getElementById('scroll-to-top');

    if (scrollTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                scrollTopBtn.classList.add('active');
            } else {
                scrollTopBtn.classList.remove('active');
            }
        });

        scrollTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
        scrollTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // Mobile Scroll Animation Observer
    const animatedItems = document.querySelectorAll('.work-item, .strength-card');

    const scrollObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
            } else {
                entry.target.classList.remove('in-view');
            }
        });
    }, {
        threshold: 0.5, // Trigger when 50% visible
        rootMargin: "0px 0px -10% 0px" // Trigger slightly before bottom
    });

    animatedItems.forEach(item => {
        scrollObserver.observe(item);
    });

    // Initialize animations
    setupSectionAnimations();
});
