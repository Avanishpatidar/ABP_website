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


// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
    // Add skills to the skills container
    const skillsContainer = document.getElementById('skills-container');
    if (skillsContainer) {
        skills.forEach(skill => {
            const skillElement = document.createElement('div');
            skillElement.className = 'skill-tag';
            skillElement.innerHTML = `
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="${skill.svgPath}" fill="${skill.color}"/>
                </svg>
                ${skill.name}
            `;
            skillsContainer.appendChild(skillElement);
        });
    }

    // Add recent projects (No longer needed on homepage)
    // const recentProjects = document.getElementById('recent-projects');
    // if (recentProjects) {
    //     // Show only 2 most recent projects
    //     projects.slice(0, 2).forEach(project => {
    //         const projectElement = document.createElement('div');
    //         projectElement.className = 'work-item';

    //         let websiteLink = '';
    //         if (project.website) {
    //             websiteLink = `
    //                 <div class="work-links">
    //                     <a href="${project.website}" class="work-link">
    //                         <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    //                             <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20Z" fill="currentColor"/>
    //                             <path d="M12 8L8 12L12 16L16 12L12 8Z" fill="currentColor"/>
    //                         </svg>
    //                         Website
    //                     </a>
    //                 </div>
    //             `;
    //         }

    //         projectElement.innerHTML = `
    //             <div class="work-title">
    //                 <span>${project.title}</span>
    //             </div>
    //             <p class="work-description">${project.description}</p>
    //             ${websiteLink}
    //         `;

    //         recentProjects.appendChild(projectElement);
    //     });
    // }

    // Add recent blog posts (No longer needed on homepage)
    // const recentPosts = document.getElementById('recent-posts');
    // if (recentPosts) {
    //     // Show only 2 most recent posts
    //     blogPosts.slice(0, 2).forEach(post => {
    //         const postElement = document.createElement('div');
    //         postElement.className = 'blog-post';
    //         postElement.innerHTML = `
    //             <h3 class="blog-title"><a href="pages/writings.html#${post.slug}">${post.title}</a></h3>
    //             <span class="blog-date">${post.date}</span>
    //         `;
    //         recentPosts.appendChild(postElement);
    //     });
    // }


    setupSectionAnimations(); // Initialize scroll-in section animations
});