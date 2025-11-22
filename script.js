// Global variables
let presentationData = null;
let pageOrder = [];

// Load JSON data and initialize
document.addEventListener('DOMContentLoaded', async function() {
    console.log('DOM loaded, loading data...');
    
    try {
        const response = await fetch('data.json');
        presentationData = await response.json();
        console.log('Data loaded:', presentationData);
        
        // Initialize page order from navigation
        pageOrder = presentationData.navigation.map(nav => nav.id);
        
        // Build navigation
        buildNavigation();
        
        // Build pages
        await buildPages();
        
        // Initialize navigation functionality
        initializeNavigation();
        
        // Initialize hamburger menu
        initializeHamburgerMenu();
        
        // Show home page
        const homePage = document.getElementById('home');
        if (homePage) {
            homePage.style.display = 'block';
            homePage.classList.add('active');
            updateNavButtons('home');
        }
        
        console.log('Presentation initialized');
    } catch (error) {
        console.error('Error loading data:', error);
    }
});

// Build navigation menu
function buildNavigation() {
    const navMenu = document.getElementById('nav-menu');
    if (!navMenu || !presentationData) return;
    
    navMenu.innerHTML = '';
    presentationData.navigation.forEach((nav, index) => {
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.href = nav.href;
        a.className = 'nav-link';
        if (index === 0) a.classList.add('active');
        a.textContent = nav.label;
        li.appendChild(a);
        navMenu.appendChild(li);
    });
}

// Build all pages
async function buildPages() {
    const mainContainer = document.getElementById('main-container');
    if (!mainContainer || !presentationData) return;
    
    for (const page of presentationData.pages) {
        const section = document.createElement('section');
        section.id = page.id;
        section.className = 'page';
        
        if (page.type === 'home') {
            section.innerHTML = buildHomePage(page);
        } else if (page.type === 'content') {
            section.innerHTML = await buildContentPage(page);
        } else if (page.type === 'references') {
            section.innerHTML = buildReferencesPage(page);
        }
        
        mainContainer.appendChild(section);
    }
}

// Build home page
function buildHomePage(page) {
    return `
        <div class="hero-section">
            <div class="hero-image-container">
                <div class="hero-background"></div>
                <div class="hero-overlay"></div>
                <div class="hero-content">
                    <h1 class="main-title">${presentationData.presentation.title}</h1>
                    <p class="subtitle">${presentationData.presentation.subtitle}</p>
                    <p class="subtitle-secondary">${presentationData.presentation.subtitleSecondary}</p>
                </div>
            </div>
        </div>
        <div class="page-content team-section-bg">
            <div class="team-section">
                <h2 class="section-title">Team Members</h2>
                <div class="team-grid">
                    ${presentationData.teamMembers.map(member => `
                        <a href="${member.link}" class="team-card-link">
                            <div class="team-card">
                                <div class="team-name">${member.name}</div>
                            </div>
                        </a>
                    `).join('')}
                </div>
            </div>
        </div>
    `;
}

// Build content page
async function buildContentPage(page) {
    let contentHTML = `
        <div class="page-header">
            <h1 class="page-title">${page.title}</h1>
            ${page.speaker ? `<p class="page-speaker"><span class="speaker-label">Speaker: </span><span class="speaker-name">${page.speaker}</span></p>` : ''}
        </div>
        <div class="page-content">
    `;
    
    if (page.contentFile) {
        try {
            const response = await fetch(page.contentFile);
            const content = await response.text();
            contentHTML += content;
        } catch (error) {
            console.error(`Error loading content file ${page.contentFile}:`, error);
        }
    } else if (page.mainPoint) {
        // Conclusion page
        contentHTML += `
            <div class="content-section">
                <h2 class="content-title">Main Point</h2>
                <div class="main-point-box">
                    <p class="main-point-text">${page.mainPoint}</p>
                </div>
            </div>
            <div class="content-section">
                <h2 class="content-title">Key Takeaways</h2>
                <div class="takeaways-grid">
                    ${page.keyTakeaways.map(takeaway => `
                        <div class="info-box">
                            <h3>${takeaway.title}</h3>
                            <p>${takeaway.description}</p>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }
    
    contentHTML += '</div>';
    return contentHTML;
}

// Build references page
function buildReferencesPage(page) {
    return `
        <div class="page-header">
            <h1 class="page-title">${page.title}</h1>
        </div>
        <div class="page-content">
            <div class="content-section">
                <h2 class="content-title">References</h2>
                <div class="info-box">
                    <ul class="info-list" style="list-style: none; padding-left: 0;">
                        ${presentationData.references.map(ref => `
                            <li style="padding-left: 0; margin-bottom: 20px;">
                                ${ref.text}${ref.url ? ` <a href="${ref.url}" target="_blank" class="reference-link" style="color: #2563eb; text-decoration: underline;"><span class="reference-url">${ref.url}</span><span class="reference-icon">↗</span></a>` : ''}
                            </li>
                        `).join('')}
                    </ul>
                </div>
            </div>
        </div>
    `;
}

// Initialize navigation functionality
function initializeNavigation() {
    const allPages = document.querySelectorAll('.page');
    
    // Update nav buttons function
    function updateNavButtons(currentPageId) {
        const prevBtn = document.getElementById('nav-prev');
        const nextBtn = document.getElementById('nav-next');
        const pageIndicator = document.getElementById('page-indicator');
        
        if (!prevBtn || !nextBtn) return;
        
        const currentIndex = pageOrder.indexOf(currentPageId);
        const totalPages = pageOrder.length;
        
        if (pageIndicator) {
            const currentPageNum = currentIndex + 1;
            pageIndicator.textContent = `${currentPageNum} / ${totalPages}`;
        }
        
        if (currentIndex > 0) {
            prevBtn.disabled = false;
            prevBtn.onclick = () => {
                const prevPageId = pageOrder[currentIndex - 1];
                const prevLink = document.querySelector(`.nav-link[href="#${prevPageId}"]`);
                if (prevLink) prevLink.click();
            };
        } else {
            prevBtn.disabled = true;
            prevBtn.onclick = null;
        }
        
        if (currentIndex < pageOrder.length - 1) {
            nextBtn.disabled = false;
            nextBtn.onclick = () => {
                const nextPageId = pageOrder[currentIndex + 1];
                const nextLink = document.querySelector(`.nav-link[href="#${nextPageId}"]`);
                if (nextLink) nextLink.click();
            };
        } else {
            nextBtn.disabled = true;
            nextBtn.onclick = null;
        }
    }
    
    // Scroll to top function
    function scrollToTop() {
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
        
        const mainContainer = document.querySelector('.main-container');
        if (mainContainer) {
            mainContainer.scrollTop = 0;
        }
        
        const scrollableElements = document.querySelectorAll('*');
        scrollableElements.forEach(el => {
            if (el.scrollTop > 0) {
                el.scrollTop = 0;
            }
        });
    }
    
    // Switch page function
    function switchPage(pageId, clickedLink) {
        console.log('Switching to page:', pageId);
        
        scrollToTop();
        
        allPages.forEach(page => {
            page.style.display = 'none';
            page.classList.remove('active');
        });
        
        const targetPage = document.getElementById(pageId);
        if (targetPage) {
            targetPage.style.display = 'block';
            scrollToTop();
            
            requestAnimationFrame(() => {
                targetPage.classList.add('active');
                scrollToTop();
            });
            
            setTimeout(() => scrollToTop(), 50);
            setTimeout(() => scrollToTop(), 100);
            setTimeout(() => scrollToTop(), 200);
            setTimeout(() => scrollToTop(), 300);
            
            updateNavButtons(pageId);
            
            const navLinks = document.querySelectorAll('.nav-link');
            navLinks.forEach(l => l.classList.remove('active'));
            
            const correspondingNavLink = document.querySelector(`.nav-link[href="#${pageId}"]`);
            if (correspondingNavLink) {
                correspondingNavLink.classList.add('active');
            }
        } else {
            console.error('Page not found:', pageId);
        }
    }
    
    // Navigation links
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            scrollToTop();
            
            const href = this.getAttribute('href');
            if (!href || !href.startsWith('#')) return;
            
            const pageId = href.substring(1);
            switchPage(pageId, this);
        });
    });
    
    // Team card links
    const teamCardLinks = document.querySelectorAll('.team-card-link');
    teamCardLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const href = this.getAttribute('href');
            if (!href || !href.startsWith('#')) return;
            
            const pageId = href.substring(1);
            switchPage(pageId, this);
        });
    });
    
    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        const activePage = document.querySelector('.page[style*="display: block"]');
        if (!activePage) return;
        
        const pages = Array.from(allPages);
        const currentIndex = pages.indexOf(activePage);
        
        if (e.key === 'ArrowRight' && currentIndex < pages.length - 1) {
            const nextPage = pages[currentIndex + 1];
            const nextLink = document.querySelector(`.nav-link[href="#${nextPage.id}"]`);
            if (nextLink) nextLink.click();
        } else if (e.key === 'ArrowLeft' && currentIndex > 0) {
            const prevPage = pages[currentIndex - 1];
            const prevLink = document.querySelector(`.nav-link[href="#${prevPage.id}"]`);
            if (prevLink) prevLink.click();
        }
    });
    
    // Scroll event
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        window.addEventListener('scroll', function() {
            navbar.style.boxShadow = window.pageYOffset > 0 
                ? '0 4px 20px rgba(0, 0, 0, 0.6)' 
                : '0 2px 10px rgba(0, 0, 0, 0.4)';
        });
    }
    
    // Export updateNavButtons for use in switchPage
    window.updateNavButtons = updateNavButtons;
}

// Initialize hamburger menu
function initializeHamburgerMenu() {
    const hamburgerMenu = document.getElementById('hamburger-menu');
    const navMenu = document.getElementById('nav-menu');
    
    if (!hamburgerMenu || !navMenu) return;
    
    hamburgerMenu.addEventListener('click', (e) => {
        e.stopPropagation();
        hamburgerMenu.classList.toggle('active');
        navMenu.classList.toggle('active');
    });
    
    // Close menu when clicking on a nav link
    function setupNavLinks() {
        const navLinks = navMenu.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                hamburgerMenu.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }
    
    // Setup nav links immediately and also after navigation is built
    setupNavLinks();
    
    // Also setup when navigation is updated
    const observer = new MutationObserver(() => {
        setupNavLinks();
    });
    observer.observe(navMenu, { childList: true, subtree: true });
    
    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!hamburgerMenu.contains(e.target) && !navMenu.contains(e.target)) {
            hamburgerMenu.classList.remove('active');
            navMenu.classList.remove('active');
        }
    });
}

