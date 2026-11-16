// --- Portfolio Dynamic Renderer, Navigation, 3D Particles & Scroll Animations ---

document.addEventListener('DOMContentLoaded', () => {
    // 1. Load Portfolio Data (from data.js / localStorage)
    const portfolioData = (typeof window.getPortfolioData === 'function') 
        ? window.getPortfolioData() 
        : (window.DEFAULT_PORTFOLIO_DATA || null);

    // 2. Dynamically Render Sections from Data
    if (portfolioData) {
        renderDynamicPortfolio(portfolioData);
    }

    // 3. Mobile Menu Drawer Toggle
    initMobileMenu();

    // 4. Dynamic Typewriter Subtitle Effect
    const typewriterPhrases = (portfolioData && portfolioData.hero && portfolioData.hero.typewriter) || [
        "VeerGatha 3.0 Winner",
        "B.Tech Computer Science & Engineering Student",
        "Aspiring Software Engineer",
        "Java Developer"
    ];
    initTypewriterEffect(typewriterPhrases);

    // 5. Interactive Skill Category Filter Tabs
    initSkillFilters();

    // 6. Interactive Certificate Category Filter Tabs
    initCertFilters();

    // 7. Interactive Certificate Lightbox Modal
    initCertificateModal();

    // 8. Achievement Sliding Gallery Engine
    initAchievementSlider();

    // 9. Three.js 3D Interactive Particles Background Engine
    init3DParticleScene();

    // 10. IntersectionObserver for Smooth Scroll Reveal
    initScrollReveal();

    // 11. Admin Hotkey (Ctrl + Shift + A) to open Admin Dashboard
    window.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
            window.location.href = 'admin.html';
        }
    });
});

// --- Dynamic Portfolio Content Renderer ---
function renderDynamicPortfolio(data) {
    if (!data) return;

    // --- Hero Section ---
    if (data.hero) {
        const logo = document.getElementById('nav-logo');
        if (logo) {
            logo.innerHTML = `<span class="text-[#3B82F6] font-mono">&lt;</span>${escapeHTML(data.hero.name)}<span class="text-[#3B82F6] font-mono"> /&gt;</span>`;
        }

        const badgeText = document.getElementById('hero-badge-text');
        if (badgeText) badgeText.textContent = data.hero.badge || 'B.Tech CS Student';

        const heroName = document.getElementById('hero-name');
        if (heroName) heroName.textContent = data.hero.name || 'Arjun Singh Jadon';

        const heroBio = document.getElementById('hero-bio');
        if (heroBio) heroBio.textContent = data.hero.bio || '';

        const heroImg = document.getElementById('hero-profile-img');
        if (heroImg && data.hero.profileImage) {
            heroImg.src = data.hero.profileImage;
            heroImg.alt = data.hero.name || 'Profile Picture';
        }

        // Update all Resume Download links
        const resumeLinks = document.querySelectorAll('.resume-link');
        const resumeUrl = data.hero.resumeUrl || 'Resume.pdf';
        resumeLinks.forEach(link => {
            link.setAttribute('href', resumeUrl);
        });

        // Hero Socials
        const socials = document.getElementById('hero-socials');
        if (socials) {
            socials.innerHTML = `
                ${data.hero.githubUrl ? `<a href="${escapeAttr(data.hero.githubUrl)}" target="_blank" rel="noopener noreferrer" class="social-btn-modern" aria-label="GitHub"><i class="fab fa-github"></i></a>` : ''}
                ${data.hero.linkedinUrl ? `<a href="${escapeAttr(data.hero.linkedinUrl)}" target="_blank" rel="noopener noreferrer" class="social-btn-modern" aria-label="LinkedIn"><i class="fab fa-linkedin-in"></i></a>` : ''}
                ${data.hero.email ? `<a href="mailto:${escapeAttr(data.hero.email)}" class="social-btn-modern" aria-label="Email"><i class="fas fa-envelope"></i></a>` : ''}
            `;
        }
    }

    // --- About Section ---
    if (data.about) {
        const storyContainer = document.getElementById('about-story-container');
        if (storyContainer && Array.isArray(data.about.paragraphs)) {
            storyContainer.innerHTML = `
                <h3 class="text-xl font-bold text-[#3B82F6] flex items-center gap-2">
                    <i class="fas fa-compass text-[#60A5FA]"></i> ${escapeHTML(data.about.journeyHeading || 'My Journey & Vision')}
                </h3>
                ${data.about.paragraphs.map((p, idx) => `
                    <p class="${idx === 0 ? 'text-[#F9FAFB] leading-relaxed text-base font-normal' : 'text-[#9CA3AF] leading-relaxed text-sm'}">
                        ${p}
                    </p>
                `).join('')}
            `;
        }

        const highlightsList = document.getElementById('about-highlights-list');
        if (highlightsList && Array.isArray(data.about.highlights)) {
            highlightsList.innerHTML = data.about.highlights.map(h => `
                <li class="flex items-start gap-3">
                    <div class="w-7 h-7 rounded-lg bg-[#3B82F6]/10 flex items-center justify-center text-[#3B82F6] shrink-0 mt-0.5">
                        <i class="${escapeAttr(h.icon || 'fas fa-circle-check')}"></i>
                    </div>
                    <div>
                        <strong class="text-[#F9FAFB] block text-xs">${escapeHTML(h.title)}</strong>
                        <span>${escapeHTML(h.desc)}</span>
                    </div>
                </li>
            `).join('');
        }
    }

    // --- Education Section ---
    if (Array.isArray(data.education)) {
        const eduGrid = document.getElementById('education-grid');
        if (eduGrid) {
            eduGrid.innerHTML = data.education.map(item => `
                <div class="card-base p-8 relative border-l-4 border-l-[#3B82F6] space-y-4 flex flex-col justify-between">
                    <div class="space-y-4">
                        <div class="flex items-center justify-between">
                            <span class="text-xs font-semibold px-3.5 py-1 rounded-full bg-[#3B82F6]/10 border border-[#3B82F6]/20 text-[#60A5FA]">
                                ${escapeHTML(item.year || '')}
                            </span>
                            ${item.score ? `
                                <span class="text-xs font-semibold text-[#3B82F6] bg-[#3B82F6]/10 px-3 py-1 rounded-full border border-[#3B82F6]/20">
                                    ${escapeHTML(item.score)}
                                </span>
                            ` : (item.location ? `
                                <span class="text-xs text-[#9CA3AF] font-medium"><i class="fas fa-location-dot text-[#3B82F6] mr-1"></i> ${escapeHTML(item.location)}</span>
                            ` : '')}
                        </div>

                        <h3 class="text-xl font-bold text-[#F9FAFB] leading-snug">
                            ${escapeHTML(item.degree || '')}
                        </h3>

                        <p class="text-sm font-semibold text-[#3B82F6]">
                            ${escapeHTML(item.institution || '')}
                        </p>

                        ${item.description ? `
                            <p class="text-xs text-[#9CA3AF] leading-relaxed">
                                ${escapeHTML(item.description)}
                            </p>
                        ` : ''}
                    </div>

                    ${Array.isArray(item.tags) && item.tags.length ? `
                        <div class="pt-2 flex flex-wrap gap-2 text-xs">
                            ${item.tags.map(t => `<span class="px-2.5 py-1 bg-[#08090D] border border-white/10 text-[#9CA3AF] rounded-md">${escapeHTML(t)}</span>`).join('')}
                        </div>
                    ` : ''}
                </div>
            `).join('');
        }
    }

    // --- Skills Section ---
    if (data.skills) {
        const langMeter = document.getElementById('skills-languages-meter');
        if (langMeter && Array.isArray(data.skills.languages)) {
            langMeter.innerHTML = data.skills.languages.map(lang => `
                <div class="space-y-1.5">
                    <div class="flex justify-between text-xs font-semibold">
                        <span class="text-[#F9FAFB] flex items-center gap-2">
                            <i class="${escapeAttr(lang.icon || 'fas fa-code')} ${lang.color ? `text-[${lang.color}]` : 'text-[#3B82F6]'}"></i> 
                            ${escapeHTML(lang.name)}
                        </span>
                        <span class="${lang.level === 'Primary' ? 'text-[#FB923C] font-bold' : 'text-[#60A5FA]'}">${escapeHTML(lang.level || '')}</span>
                    </div>
                    <div class="skill-bar-track">
                        <div class="skill-bar-fill" style="width: ${Math.min(100, Math.max(10, lang.percentage || 70))}%; ${lang.level === 'Primary' ? 'background: linear-gradient(90deg, #FB923C 0%, #3B82F6 100%);' : ''}"></div>
                    </div>
                </div>
            `).join('');
        }

        const langBadges = document.getElementById('skills-languages-badges');
        if (langBadges && Array.isArray(data.skills.languages)) {
            langBadges.innerHTML = data.skills.languages.map(lang => `
                <span class="brand-badge ${lang.brandClass || ''}">
                    <i class="${escapeAttr(lang.icon || 'fas fa-code')}"></i> ${escapeHTML(lang.name.split('(')[0].trim())}
                </span>
            `).join('');
        }

        const webBadges = document.getElementById('skills-web-badges');
        if (webBadges && Array.isArray(data.skills.webBadges)) {
            webBadges.innerHTML = data.skills.webBadges.map(b => `
                <span class="brand-badge"><i class="fas fa-check-circle text-[#60A5FA]"></i> ${escapeHTML(b)}</span>
            `).join('');
        }

        const coreBadges = document.getElementById('skills-core-badges');
        if (coreBadges && Array.isArray(data.skills.coreBadges)) {
            coreBadges.innerHTML = data.skills.coreBadges.map(b => `
                <span class="brand-badge"><i class="fas fa-cubes text-[#3B82F6]"></i> ${escapeHTML(b)}</span>
            `).join('');
        }

        const toolBadges = document.getElementById('skills-tools-badges');
        if (toolBadges && Array.isArray(data.skills.toolBadges)) {
            toolBadges.innerHTML = data.skills.toolBadges.map(b => `
                <span class="brand-badge"><i class="fas fa-wrench text-[#60A5FA]"></i> ${escapeHTML(b)}</span>
            `).join('');
        }
    }

    // --- Projects Section ---
    if (Array.isArray(data.projects)) {
        const projectsGrid = document.getElementById('projects-grid');
        if (projectsGrid) {
            projectsGrid.innerHTML = data.projects.map(proj => {
                const isWIP = proj.status === 'In Development' || proj.category === 'WIP';
                const hasImg = !!proj.image;

                return `
                <div class="card-base overflow-hidden flex flex-col justify-between group ${isWIP ? 'border-amber-500/20' : ''}">
                    <div>
                        <!-- Project Visual Header -->
                        ${hasImg ? `
                            <div data-cert-modal 
                                 data-cert-src="${escapeAttr(proj.image)}" 
                                 data-cert-title="${escapeAttr(proj.title)}" 
                                 data-cert-desc="${escapeAttr(proj.description || '')}" 
                                 class="h-64 bg-gradient-to-b from-[#121626] to-[#08090D] border-b border-white/5 relative overflow-hidden flex items-center justify-center p-3 group-hover:border-[#3B82F6]/40 transition-colors cursor-pointer">
                                <img src="${escapeAttr(proj.image)}" alt="${escapeAttr(proj.title)}" class="max-h-full w-auto object-contain rounded-xl shadow-[0_10px_25px_rgba(0,0,0,0.7)] border border-white/10 group-hover:scale-105 group-hover:-translate-y-1 transition-all duration-500">
                                <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                                    <span class="text-[11px] font-bold text-white uppercase tracking-wider bg-black/80 px-3 py-1.5 rounded-full border border-white/20 shadow-lg flex items-center gap-1.5">
                                        <i class="fas fa-magnifying-glass-plus text-[#60A5FA]"></i> Enlarge Preview
                                    </span>
                                </div>
                            </div>
                        ` : `
                            <div class="h-64 bg-gradient-to-b from-[#121626] to-[#08090D] border-b border-white/5 relative overflow-hidden flex flex-col items-center justify-center p-3 ${isWIP ? 'group-hover:border-amber-500/40' : 'group-hover:border-[#3B82F6]/40'} transition-colors">
                                ${isWIP ? `
                                    <span class="absolute top-3 right-3 px-3 py-1 text-[11px] font-bold rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-400 flex items-center gap-1.5 backdrop-blur-md z-10">
                                        <span class="relative flex h-2 w-2">
                                          <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                                          <span class="relative inline-flex rounded-full h-2 w-2 bg-amber-400"></span>
                                        </span>
                                        In Development
                                    </span>
                                    <div class="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mb-3 group-hover:scale-110 transition-transform">
                                        <i class="fas fa-hammer text-2xl animate-pulse"></i>
                                    </div>
                                    <span class="text-xs font-mono text-amber-400 font-semibold uppercase tracking-wider">Work In Progress</span>
                                    <span class="text-[11px] text-[#9CA3AF] mt-1">Launching Soon</span>
                                ` : `
                                    <div class="w-16 h-16 rounded-2xl bg-[#3B82F6]/10 border border-[#3B82F6]/20 flex items-center justify-center text-[#3B82F6] mb-3 group-hover:scale-110 transition-transform">
                                        <i class="fas fa-laptop-code text-2xl"></i>
                                    </div>
                                    <span class="text-xs font-mono text-[#60A5FA] font-semibold uppercase tracking-wider">${escapeHTML(proj.title)}</span>
                                `}
                            </div>
                        `}

                        <!-- Project Info Content -->
                        <div class="p-6 space-y-4">
                            <div class="flex items-center justify-between">
                                <h3 class="text-xl font-bold text-[#F9FAFB] ${isWIP ? 'group-hover:text-amber-400' : 'group-hover:text-[#3B82F6]'} transition-colors">
                                    ${escapeHTML(proj.title)}
                                </h3>
                                <span class="text-[10px] font-bold px-2.5 py-0.5 rounded-full ${isWIP ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : 'bg-[#3B82F6]/10 text-[#60A5FA] border border-[#3B82F6]/20'}">
                                    ${escapeHTML(proj.category || 'Project')}
                                </span>
                            </div>
                            
                            <p class="text-xs text-[#9CA3AF] leading-relaxed">
                                ${escapeHTML(proj.description || '')}
                            </p>

                            ${Array.isArray(proj.tags) && proj.tags.length ? `
                                <div class="flex flex-wrap gap-1.5 text-[11px]">
                                    ${proj.tags.map(t => `
                                        <span class="px-2.5 py-1 bg-[#08090D] border ${isWIP ? 'border-amber-500/20 text-amber-300' : 'border-[#3B82F6]/20 text-[#60A5FA]'} rounded-md font-medium">
                                            ${escapeHTML(t)}
                                        </span>
                                    `).join('')}
                                </div>
                            ` : ''}
                        </div>
                    </div>

                    <!-- Action Buttons -->
                    <div class="p-6 pt-0 flex items-center gap-3">
                        ${proj.githubUrl ? `
                            <a href="${escapeAttr(proj.githubUrl)}" target="_blank" rel="noopener noreferrer" class="flex-1 py-2 px-3 rounded-lg border border-white/10 bg-[#08090D] hover:border-[#3B82F6] hover:text-[#60A5FA] text-xs font-semibold text-[#F9FAFB] text-center transition-colors inline-flex items-center justify-center gap-1.5">
                                <i class="fab fa-github text-sm"></i> GitHub
                            </a>
                        ` : ''}
                        ${proj.demoUrl ? `
                            <a href="${escapeAttr(proj.demoUrl)}" target="_blank" rel="noopener noreferrer" class="flex-1 py-2 px-3 rounded-lg bg-[#3B82F6] hover:bg-[#2563EB] text-white text-xs font-bold text-center transition-all inline-flex items-center justify-center gap-1.5">
                                <i class="fas fa-external-link-alt text-xs"></i> Live Demo
                            </a>
                        ` : (isWIP ? `
                            <span class="flex-1 py-2 px-3 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold text-center inline-flex items-center justify-center gap-1.5 cursor-not-allowed opacity-90">
                                <i class="fas fa-clock text-xs"></i> Coming Soon
                            </span>
                        ` : '')}
                    </div>
                </div>
                `;
            }).join('');
        }
    }

    // --- Achievements Section ---
    if (data.achievements) {
        const ach = data.achievements;
        const b = document.getElementById('achievement-badge');
        if (b && ach.badge) b.innerHTML = `<i class="fas fa-award text-amber-400 mr-1.5"></i> ${escapeHTML(ach.badge)}`;

        const s = document.getElementById('achievement-stat');
        if (s && ach.stat) s.textContent = ach.stat;

        const headingContainer = document.getElementById('achievement-heading-container');
        if (headingContainer) {
            headingContainer.innerHTML = `
                <h3 class="text-2xl sm:text-3xl font-extrabold text-[#F9FAFB] leading-tight">
                    ${escapeHTML(ach.title || 'National Winner')}
                </h3>
                <p class="text-xs sm:text-sm font-semibold text-amber-300">
                    ${escapeHTML(ach.organizer || '')}
                </p>
            `;
        }

        const d = document.getElementById('achievement-desc');
        if (d && ach.description) d.textContent = ach.description;

        const t = document.getElementById('achievement-tags');
        if (t && Array.isArray(ach.tags)) {
            t.innerHTML = ach.tags.map(tag => `
                <span class="px-3 py-1.5 bg-[#08090D] border border-amber-500/20 text-amber-300 rounded-lg font-medium flex items-center gap-1.5">
                    <i class="fas fa-star text-amber-400"></i> ${escapeHTML(tag)}
                </span>
            `).join('');
        }
    }

    // --- Upgraded Certifications Section (With Rich Visual Image Thumbnails) ---
    if (Array.isArray(data.certifications)) {
        const certsGrid = document.getElementById('certifications-grid');
        if (certsGrid) {
            certsGrid.innerHTML = data.certifications.map(cert => {
                const hasImg = !!cert.image;
                const isPdf = cert.url && cert.url.toLowerCase().endsWith('.pdf');
                const cat = cert.category || 'other';

                // Determine filter category group
                let filterGroup = 'professional';
                if (cat === 'programming') filterGroup = 'programming';
                else if (cat === 'ai' || cat === 'data' || cat === 'networking') filterGroup = 'ai-data';

                return `
                <div class="card-base overflow-hidden flex flex-col justify-between group border-t-2 border-t-[#3B82F6]/60 transition-all duration-300" data-cert-card-cat="${filterGroup}">
                    <div>
                        <!-- Certificate Visual Showcase Frame Container -->
                        <div class="cert-preview-frame h-52 sm:h-56 flex items-center justify-center p-3 relative cursor-pointer"
                             data-cert-modal
                             data-cert-src="${escapeAttr(cert.image || cert.url)}"
                             data-cert-title="${escapeAttr(cert.title)}"
                             data-cert-desc="${escapeAttr((cert.issuer || '') + (cert.score ? ' • ' + cert.score : ''))}">
                            
                            ${hasImg ? `
                                <!-- Real Certificate Image Display -->
                                <img src="${escapeAttr(cert.image)}" 
                                     alt="${escapeAttr(cert.title)}" 
                                     class="max-h-full max-w-[90%] object-contain rounded-lg shadow-[0_10px_25px_rgba(0,0,0,0.8)] border border-white/15 group-hover:scale-105 transition-all duration-500 bg-[#08090D]">
                            ` : (isPdf ? `
                                <!-- Dynamic PDF Live Canvas Preview + Document Mockup -->
                                <canvas data-pdf-thumbnail="${escapeAttr(cert.url)}" class="hidden max-h-full max-w-[90%] object-contain rounded-lg shadow-[0_10px_25px_rgba(0,0,0,0.8)] border border-white/15 group-hover:scale-105 transition-all duration-500 bg-[#08090D]"></canvas>
                                
                                <div class="pdf-placeholder-card w-48 h-40 bg-gradient-to-br from-[#181E30] via-[#0E121E] to-[#080A10] border-2 border-amber-500/30 rounded-xl p-3.5 flex flex-col justify-between items-center text-center shadow-xl relative overflow-hidden group-hover:border-amber-400/60 transition-colors">
                                    <div class="w-full flex items-center justify-between text-[10px] text-amber-300/80 font-mono border-b border-amber-500/20 pb-1.5">
                                        <span class="flex items-center gap-1"><i class="fas fa-file-pdf text-amber-400"></i> PDF Document</span>
                                        <span class="font-bold text-amber-300">Verified</span>
                                    </div>
                                    <div class="w-11 h-11 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 text-lg shadow-[0_0_15px_rgba(245,158,11,0.25)] my-1">
                                        <i class="fas fa-award"></i>
                                    </div>
                                    <div class="w-full space-y-0.5">
                                        <span class="block text-xs font-bold text-white truncate">${escapeHTML(cert.title)}</span>
                                        <span class="block text-[10px] text-amber-300 font-semibold truncate">${escapeHTML(cert.issuer || 'Official Certificate')}</span>
                                    </div>
                                    <span class="text-[9px] font-mono px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                                        <i class="fas fa-file-arrow-down text-[8px]"></i> Click to Preview PDF
                                    </span>
                                </div>
                            ` : `
                                <!-- Stylized Verified Credential Blueprint for Cisco / Exams -->
                                <div class="w-48 h-40 bg-gradient-to-br from-[#0F1A30] via-[#0B1220] to-[#080A10] border-2 border-blue-500/30 rounded-xl p-3.5 flex flex-col justify-between items-center text-center shadow-xl relative overflow-hidden group-hover:border-blue-400/60 transition-colors">
                                    <div class="w-full flex items-center justify-between text-[10px] text-blue-300 font-mono border-b border-blue-500/20 pb-1.5">
                                        <span class="flex items-center gap-1"><i class="fas fa-network-wired text-blue-400"></i> Academy</span>
                                        <span class="font-bold text-emerald-400">Active</span>
                                    </div>
                                    <div class="w-11 h-11 rounded-full bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 text-lg shadow-[0_0_15px_rgba(59,130,246,0.25)] my-1">
                                        <i class="${escapeAttr(cert.icon || 'fas fa-shield-halved')}"></i>
                                    </div>
                                    <div class="w-full space-y-0.5">
                                        <span class="block text-xs font-bold text-white truncate">${escapeHTML(cert.title)}</span>
                                        <span class="block text-[10px] text-blue-300 font-semibold truncate">${escapeHTML(cert.issuer || 'Credential')}</span>
                                    </div>
                                    <span class="text-[9px] font-mono px-2 py-0.5 rounded-full bg-blue-500/15 text-blue-300 border border-blue-500/30">
                                        Verified Credential
                                    </span>
                                </div>
                            `)}

                            <!-- Hover Overlay Click Hint -->
                            <div class="absolute inset-0 bg-black/45 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px] z-10">
                                <span class="text-[11px] font-bold text-white uppercase tracking-wider bg-black/85 px-3.5 py-1.5 rounded-full border border-blue-500/40 shadow-xl flex items-center gap-1.5">
                                    <i class="fas fa-magnifying-glass-plus text-[#60A5FA]"></i> Enlarge Certificate
                                </span>
                            </div>
                        </div>

                        <!-- Card Content Body -->
                        <div class="p-6 space-y-4">
                            <!-- Issuer and Score Ribbon -->
                            <div class="flex items-center justify-between gap-2">
                                <div class="flex items-center gap-2.5 min-w-0">
                                    <div class="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 text-sm shrink-0">
                                        <i class="${escapeAttr(cert.icon || 'fas fa-certificate')}"></i>
                                    </div>
                                    <span class="text-xs font-semibold text-gray-300 truncate">${escapeHTML(cert.issuer || '')}</span>
                                </div>
                                ${cert.score ? `
                                    <span class="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-blue-500/15 border border-blue-500/30 text-[#60A5FA] shrink-0">
                                        ${escapeHTML(cert.score)}
                                    </span>
                                ` : ''}
                            </div>

                            <h3 class="text-base font-bold text-[#F9FAFB] group-hover:text-[#3B82F6] transition-colors leading-snug">
                                ${escapeHTML(cert.title)}
                            </h3>

                            <p class="text-xs text-[#9CA3AF] leading-relaxed line-clamp-2">
                                ${escapeHTML(cert.description || '')}
                            </p>

                            ${Array.isArray(cert.tags) && cert.tags.length ? `
                                <div class="flex flex-wrap gap-1.5 pt-1 text-[11px]">
                                    ${cert.tags.map(t => `
                                        <span class="px-2 py-0.5 bg-[#08090D] border border-white/10 text-gray-400 rounded-md text-[10px]">
                                            ${escapeHTML(t)}
                                        </span>
                                    `).join('')}
                                </div>
                            ` : ''}
                        </div>
                    </div>

                    <!-- Action Buttons -->
                    <div class="p-6 pt-0 flex items-center gap-2.5">
                        <button type="button" 
                                data-cert-modal 
                                data-cert-src="${escapeAttr(cert.image || cert.url)}" 
                                data-cert-title="${escapeAttr(cert.title)}" 
                                data-cert-desc="${escapeAttr((cert.issuer || '') + (cert.score ? ' • ' + cert.score : ''))}" 
                                class="flex-1 py-2 px-3 rounded-lg border border-white/10 bg-[#08090D] hover:border-[#3B82F6] hover:text-[#60A5FA] text-xs font-semibold text-[#F9FAFB] text-center transition-colors inline-flex items-center justify-center gap-1.5 cursor-pointer">
                            <i class="fas fa-eye text-xs"></i> Quick Preview
                        </button>
                        ${cert.url && cert.url !== '#' ? `
                            <a href="${escapeAttr(cert.url)}" target="_blank" rel="noopener noreferrer" class="flex-1 py-2 px-3 rounded-lg bg-[#3B82F6] hover:bg-[#2563EB] text-white text-xs font-bold text-center transition-all inline-flex items-center justify-center gap-1.5 shadow-sm">
                                <i class="fas fa-arrow-up-right-from-square text-[10px]"></i> View Document
                            </a>
                        ` : `
                            <span class="flex-1 py-2 px-3 rounded-lg bg-white/5 border border-white/10 text-gray-400 text-xs font-semibold text-center inline-flex items-center justify-center gap-1.5 cursor-default">
                                <i class="fas fa-check-circle text-xs text-blue-400"></i> Verified
                            </span>
                        `}
                    </div>
                </div>
                `;
            }).join('');

            // Trigger rendering of live PDF thumbnails
            setTimeout(renderPdfThumbnails, 120);
        }
    }

    // --- Contact & Footer ---
    if (data.contact) {
        const c = data.contact;
        const emailLink = document.getElementById('contact-email-link');
        if (emailLink && c.email) {
            emailLink.href = `mailto:${c.email}`;
            const label = emailLink.querySelector('.contact-label');
            if (label) label.textContent = c.email;
        }

        const linkedinLink = document.getElementById('contact-linkedin-link');
        if (linkedinLink && c.linkedin) {
            linkedinLink.href = c.linkedin;
            const label = linkedinLink.querySelector('.contact-label');
            if (label) label.textContent = c.linkedinHandle || 'LinkedIn Profile';
        }

        const githubLink = document.getElementById('contact-github-link');
        if (githubLink && c.github) {
            githubLink.href = c.github;
            const label = githubLink.querySelector('.contact-label');
            if (label) label.textContent = c.githubHandle || 'GitHub Profile';
        }

        const resumeLink = document.getElementById('contact-resume-link');
        if (resumeLink && c.resumeUrl) {
            resumeLink.href = c.resumeUrl;
        }

        const copyright = document.getElementById('footer-copyright');
        if (copyright && c.footerText) {
            copyright.textContent = c.footerText;
        }
    }
}

// Render PDF first page onto canvas thumbnail
function renderPdfThumbnails() {
    if (typeof pdfjsLib === 'undefined') return;
    try {
        pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
    } catch (e) {}

    const canvases = document.querySelectorAll('canvas[data-pdf-thumbnail]');
    canvases.forEach(canvas => {
        const url = canvas.getAttribute('data-pdf-thumbnail');
        if (!url) return;

        pdfjsLib.getDocument(url).promise.then(pdf => {
            return pdf.getPage(1);
        }).then(page => {
            const viewport = page.getViewport({ scale: 0.5 });
            canvas.height = viewport.height;
            canvas.width = viewport.width;
            const ctx = canvas.getContext('2d');
            const renderTask = page.render({ canvasContext: ctx, viewport: viewport });
            return renderTask.promise;
        }).then(() => {
            canvas.classList.remove('hidden');
            const parent = canvas.parentElement;
            if (parent) {
                const placeholder = parent.querySelector('.pdf-placeholder-card');
                if (placeholder) placeholder.classList.add('hidden');
            }
        }).catch(err => {
            // Keep the stylish fallback document mockup visible
            console.log('PDF thumbnail fallback active for:', url);
        });
    });
}

// Utility: Sanitize Strings for HTML Text Content
function escapeHTML(str) {
    if (str == null) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

// Utility: Sanitize Strings for HTML Attributes
function escapeAttr(str) {
    if (str == null) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
}

// --- Mobile Navigation Drawer Engine ---
function initMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');

    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });

        const mobileLinks = mobileMenu.querySelectorAll('a');
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.add('hidden');
            });
        });
    }
}

// --- Smooth Scroll Reveal (IntersectionObserver) ---
function initScrollReveal() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('opacity-100', 'translate-y-0');
                entry.target.classList.remove('opacity-0', 'translate-y-6');
                revealObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const revealElements = document.querySelectorAll('.reveal-on-scroll');
    revealElements.forEach(el => {
        el.classList.add('transition-all', 'duration-700', 'ease-out', 'opacity-0', 'translate-y-6');
        revealObserver.observe(el);
    });
}

// --- Achievement Sliding Gallery Engine ---
function initAchievementSlider() {
    const track = document.getElementById('achievement-slider-track');
    const prevBtn = document.getElementById('slider-prev');
    const nextBtn = document.getElementById('slider-next');
    const dotsContainer = document.getElementById('slider-dots');

    if (!track) return;

    const slides = track.querySelectorAll('.achievement-slide');
    if (!slides.length) return;

    let currentIndex = 0;
    let autoSlideInterval = null;

    if (dotsContainer) {
        dotsContainer.innerHTML = '';
        slides.forEach((_, idx) => {
            const dot = document.createElement('button');
            dot.className = `w-2 h-2 rounded-full transition-all duration-300 ${idx === 0 ? 'bg-amber-400 w-5' : 'bg-white/30'}`;
            dot.setAttribute('aria-label', `Go to slide ${idx + 1}`);
            dot.addEventListener('click', () => goToSlide(idx));
            dotsContainer.appendChild(dot);
        });
    }

    function updateSlider() {
        track.style.transform = `translateX(-${currentIndex * 100}%)`;

        if (dotsContainer) {
            const dots = dotsContainer.querySelectorAll('button');
            dots.forEach((dot, idx) => {
                if (idx === currentIndex) {
                    dot.className = 'w-5 h-2 rounded-full bg-amber-400 transition-all duration-300';
                } else {
                    dot.className = 'w-2 h-2 rounded-full bg-white/30 transition-all duration-300';
                }
            });
        }
    }

    function goToSlide(index) {
        currentIndex = (index + slides.length) % slides.length;
        updateSlider();
    }

    function nextSlide() {
        goToSlide(currentIndex + 1);
    }

    function prevSlide() {
        goToSlide(currentIndex - 1);
    }

    if (nextBtn) nextBtn.addEventListener('click', nextSlide);
    if (prevBtn) prevBtn.addEventListener('click', prevSlide);

    function startAutoSlide() {
        stopAutoSlide();
        autoSlideInterval = setInterval(nextSlide, 3500);
    }

    function stopAutoSlide() {
        if (autoSlideInterval) clearInterval(autoSlideInterval);
    }

    const sliderContainer = track.closest('.achievement-slider-container');
    if (sliderContainer) {
        sliderContainer.addEventListener('mouseenter', stopAutoSlide);
        sliderContainer.addEventListener('mouseleave', startAutoSlide);
    }

    startAutoSlide();
}

// --- Certificate Lightbox Modal Engine (Supports Images & PDF Documents) ---
function initCertificateModal() {
    const modal = document.getElementById('cert-modal');
    const modalImg = document.getElementById('modal-img');
    const modalIframe = document.getElementById('modal-iframe');
    const modalDirectLink = document.getElementById('modal-direct-link');
    const modalTitle = document.getElementById('modal-title');
    const modalDesc = document.getElementById('modal-desc');
    const modalClose = document.getElementById('modal-close');

    if (!modal || !modalClose) return;

    document.addEventListener('click', (e) => {
        const trigger = e.target.closest('[data-cert-modal]');
        if (!trigger) return;

        e.preventDefault();
        const src = trigger.getAttribute('data-cert-src') || '';
        const title = trigger.getAttribute('data-cert-title') || 'Certificate & Recognition';
        const desc = trigger.getAttribute('data-cert-desc') || '';
        const isPdf = src.toLowerCase().endsWith('.pdf');

        if (modalDirectLink) {
            if (src && src !== '#') {
                modalDirectLink.href = src;
                modalDirectLink.classList.remove('hidden');
            } else {
                modalDirectLink.classList.add('hidden');
            }
        }

        if (isPdf) {
            if (modalImg) modalImg.style.display = 'none';
            if (modalIframe) {
                modalIframe.src = src;
                modalIframe.classList.remove('hidden');
                modalIframe.style.display = 'block';
            }
        } else {
            if (modalIframe) {
                modalIframe.src = '';
                modalIframe.classList.add('hidden');
                modalIframe.style.display = 'none';
            }
            if (modalImg) {
                if (src && src !== '#') {
                    modalImg.src = src;
                    modalImg.style.display = 'block';
                } else {
                    modalImg.style.display = 'none';
                }
            }
        }

        if (modalTitle) modalTitle.textContent = title;
        if (modalDesc) modalDesc.textContent = desc;

        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    });

    const closeModal = () => {
        modal.classList.remove('active');
        document.body.style.overflow = '';
        if (modalIframe) modalIframe.src = '';
    };

    modalClose.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) closeModal();
    });
}

// --- Category Filter Tabs Engine for Skills ---
function initSkillFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const skillCards = document.querySelectorAll('[data-skill-category]');

    if (!filterBtns.length || !skillCards.length) return;

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const category = btn.getAttribute('data-filter');

            skillCards.forEach(card => {
                const cardCat = card.getAttribute('data-skill-category');
                if (category === 'all' || cardCat.includes(category)) {
                    card.style.display = '';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'scale(1)';
                    }, 50);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'scale(0.95)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 250);
                }
            });
        });
    });
}

// --- Category Filter Tabs Engine for Certifications ---
function initCertFilters() {
    const filterBtns = document.querySelectorAll('.cert-filter-btn');
    const certCards = document.querySelectorAll('[data-cert-card-cat]');

    if (!filterBtns.length || !certCards.length) return;

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.getAttribute('data-cert-filter');

            certCards.forEach(card => {
                const cardCat = card.getAttribute('data-cert-card-cat');
                if (filter === 'all' || cardCat === filter || (filter === 'ai-data' && (cardCat === 'ai' || cardCat === 'data' || cardCat === 'ai-data'))) {
                    card.style.display = '';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'scale(1)';
                    }, 50);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'scale(0.95)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 250);
                }
            });
        });
    });
}

// --- Dynamic Typewriter Engine ---
function initTypewriterEffect(phrases) {
    const typewriterElement = document.getElementById('typewriter-text');
    if (!typewriterElement) return;

    if (!Array.isArray(phrases) || !phrases.length) {
        phrases = [
            "VeerGatha 3.0 Winner",
            "B.Tech Computer Science & Engineering Student",
            "Aspiring Software Engineer",
            "Java Developer"
        ];
    }

    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typeSpeed = 70;

    function type() {
        const currentPhrase = phrases[phraseIndex] || '';

        if (isDeleting) {
            typewriterElement.textContent = currentPhrase.substring(0, charIndex - 1);
            charIndex--;
            typeSpeed = 40;
        } else {
            typewriterElement.textContent = currentPhrase.substring(0, charIndex + 1);
            charIndex++;
            typeSpeed = 70;
        }

        if (!isDeleting && charIndex === currentPhrase.length) {
            typeSpeed = 2200;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            phraseIndex = (phraseIndex + 1) % phrases.length;
            typeSpeed = 400;
        }

        setTimeout(type, typeSpeed);
    }

    type();
}

// --- 3D Particle Space Background (Three.js) ---
function init3DParticleScene() {
    const canvas = document.getElementById('bg-canvas');
    if (!canvas || typeof THREE === 'undefined') return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 400;

    const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const particleCount = 1200;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
        positions[i] = (Math.random() - 0.5) * 1200;
        positions[i + 1] = (Math.random() - 0.5) * 1200;
        positions[i + 2] = (Math.random() - 0.5) * 800;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const canvasTexture = document.createElement('canvas');
    canvasTexture.width = 16;
    canvasTexture.height = 16;
    const ctx = canvasTexture.getContext('2d');
    const grad = ctx.createRadialGradient(8, 8, 0, 8, 8, 8);
    grad.addColorStop(0, 'rgba(59, 130, 246, 1)');
    grad.addColorStop(0.5, 'rgba(96, 165, 250, 0.6)');
    grad.addColorStop(1, 'rgba(59, 130, 246, 0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 16, 16);

    const texture = new THREE.CanvasTexture(canvasTexture);

    const material = new THREE.PointsMaterial({
        size: 5,
        map: texture,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    let mouseX = 0;
    let mouseY = 0;
    let targetMouseX = 0;
    let targetMouseY = 0;

    window.addEventListener('mousemove', (e) => {
        targetMouseX = (e.clientX - window.innerWidth / 2) * 0.08;
        targetMouseY = (e.clientY - window.innerHeight / 2) * 0.08;
    });

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    function animate() {
        requestAnimationFrame(animate);

        mouseX += (targetMouseX - mouseX) * 0.05;
        mouseY += (targetMouseY - mouseY) * 0.05;

        particles.rotation.y += 0.0006;
        particles.rotation.x += 0.0003;

        camera.position.x = mouseX;
        camera.position.y = -mouseY;
        camera.lookAt(scene.position);

        renderer.render(scene, camera);
    }

    animate();
}
