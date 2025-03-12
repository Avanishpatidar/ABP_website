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
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (pageYOffset >= sectionTop - sectionHeight / 3) { // Highlight earlier
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') && (link.getAttribute('href').substring(1) === current)) {
                link.classList.add('active');
            }
        });
    });
}

document.addEventListener('DOMContentLoaded', () => {
    // Add skills to the skills container
    const skillsContainer = document.getElementById('skills-container');
    if (skillsContainer) {
      skills.forEach(skill => {
        const skillElement = document.createElement('div');
        skillElement.className = 'skill-tag';
        
        // Define which logos need an outline (white drop-shadow)
        const outlineSkills = ["Node.js", "Express.js", "Next.js"];
        const imgClass = outlineSkills.includes(skill.name) ? 'skill-logo outline' : 'skill-logo';
        
        skillElement.innerHTML = `
          <img src="${skill.logoUrl}" width="16" height="16" alt="${skill.name} logo" class="${imgClass}" style="vertical-align:middle; margin-right:4px;"/>
          ${skill.name}
        `;
        skillsContainer.appendChild(skillElement);
      });
    }
  });
  