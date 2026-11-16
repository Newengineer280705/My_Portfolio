// --- Portfolio Admin Dashboard Engine ---

let currentData = null;

document.addEventListener('DOMContentLoaded', () => {
    initAuth();
    loadDashboardData();
    initTabNavigation();
    initModalHandlers();
    initFormSaveHandlers();
    initExportAndSettingsHandlers();
});

// --- Authentication Engine ---
function initAuth() {
    const authScreen = document.getElementById('auth-screen');
    const dashboardScreen = document.getElementById('dashboard-screen');
    const pinForm = document.getElementById('pin-login-form');
    const pinInput = document.getElementById('admin-pin-input');
    const pinError = document.getElementById('pin-error');
    const togglePinBtn = document.getElementById('toggle-pin-btn');
    const logoutBtn = document.getElementById('btn-logout');

    const isAuthenticated = sessionStorage.getItem('portfolio_admin_auth') === 'true';

    if (isAuthenticated) {
        showDashboard();
    } else {
        showAuth();
    }

    if (togglePinBtn && pinInput) {
        togglePinBtn.addEventListener('click', () => {
            const isPassword = pinInput.type === 'password';
            pinInput.type = isPassword ? 'text' : 'password';
            togglePinBtn.innerHTML = isPassword ? '<i class="fas fa-eye-slash"></i>' : '<i class="fas fa-eye"></i>';
        });
    }

    if (pinForm) {
        pinForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const inputVal = pinInput.value.trim();
            const correctPin = window.getAdminPin ? window.getAdminPin() : 'arjun123';

            if (inputVal === correctPin) {
                sessionStorage.setItem('portfolio_admin_auth', 'true');
                if (pinError) pinError.classList.add('hidden');
                showDashboard();
                showToast('Welcome back, Admin!');
            } else {
                if (pinError) pinError.classList.remove('hidden');
                pinInput.focus();
                pinInput.select();
            }
        });
    }

    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            sessionStorage.removeItem('portfolio_admin_auth');
            showAuth();
            showToast('Locked and logged out.');
        });
    }

    function showDashboard() {
        if (authScreen) authScreen.classList.add('hidden');
        if (dashboardScreen) dashboardScreen.classList.remove('hidden');
    }

    function showAuth() {
        if (authScreen) authScreen.classList.remove('hidden');
        if (dashboardScreen) dashboardScreen.classList.add('hidden');
        if (pinInput) {
            pinInput.value = '';
            pinInput.focus();
        }
    }
}

// --- Load and Populate Dashboard Data ---
function loadDashboardData() {
    currentData = (typeof window.getPortfolioData === 'function')
        ? window.getPortfolioData()
        : JSON.parse(JSON.stringify(window.DEFAULT_PORTFOLIO_DATA || {}));

    populateHeroTab();
    populateAboutTab();
    populateEducationTab();
    populateSkillsTab();
    populateProjectsTab();
    populateAchievementsTab();
    populateCertificationsTab();
    populateContactTab();
}

// 1. Populate Hero & Profile
function populateHeroTab() {
    if (!currentData.hero) return;
    const h = currentData.hero;

    setVal('hero-name-input', h.name || '');
    setVal('hero-badge-input', h.badge || '');
    setVal('hero-typewriter-input', Array.isArray(h.typewriter) ? h.typewriter.join('\n') : '');
    setVal('hero-bio-input', h.bio || '');
    setVal('avatar-url-input', h.profileImage || '');
    setVal('hero-resume-input', h.resumeUrl || 'Resume.pdf');

    const preview = document.getElementById('avatar-preview');
    if (preview && h.profileImage) preview.src = h.profileImage;

    // File input reader for profile avatar
    const fileInput = document.getElementById('avatar-file-input');
    if (fileInput) {
        fileInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (re) => {
                    const base64 = re.target.result;
                    setVal('avatar-url-input', base64);
                    if (preview) preview.src = base64;
                    showToast('Profile image preview loaded!');
                };
                reader.readAsDataURL(file);
            }
        });
    }
}

// 2. Populate About
function populateAboutTab() {
    if (!currentData.about) return;
    const a = currentData.about;

    setVal('about-heading-input', a.journeyHeading || 'My Journey & Vision');
    const paras = Array.isArray(a.paragraphs) ? a.paragraphs : [];
    setVal('about-p1-input', stripHTML(paras[0] || ''));
    setVal('about-p2-input', stripHTML(paras[1] || ''));
}

// 3. Populate Education
function populateEducationTab() {
    const list = document.getElementById('admin-education-list');
    if (!list) return;

    const eduList = Array.isArray(currentData.education) ? currentData.education : [];
    if (!eduList.length) {
        list.innerHTML = `<p class="text-xs text-gray-500 py-4 text-center">No education history added yet.</p>`;
        return;
    }

    list.innerHTML = eduList.map((item, idx) => `
        <div class="p-4 rounded-xl border border-white/10 bg-dark-900 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div class="space-y-1">
                <div class="flex items-center gap-2">
                    <span class="text-xs font-semibold px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">${escapeHTML(item.year || '')}</span>
                    ${item.score ? `<span class="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">${escapeHTML(item.score)}</span>` : ''}
                </div>
                <h4 class="text-sm font-bold text-white">${escapeHTML(item.degree)}</h4>
                <p class="text-xs text-gray-400">${escapeHTML(item.institution)}</p>
            </div>
            <div class="flex items-center gap-2 shrink-0">
                <button type="button" onclick="editEducation('${item.id || idx}')" class="py-1.5 px-3 rounded-lg border border-white/10 hover:border-blue-500/40 bg-white/5 text-xs text-blue-400 font-semibold">
                    <i class="fas fa-pen-to-square mr-1"></i> Edit
                </button>
                <button type="button" onclick="deleteEducation('${item.id || idx}')" class="py-1.5 px-3 rounded-lg border border-red-500/20 hover:border-red-500/40 bg-red-500/10 text-xs text-red-400 font-semibold">
                    <i class="fas fa-trash-can mr-1"></i> Delete
                </button>
            </div>
        </div>
    `).join('');
}

// 4. Populate Skills
function populateSkillsTab() {
    if (!currentData.skills) return;
    const s = currentData.skills;

    const list = document.getElementById('admin-languages-list');
    if (list && Array.isArray(s.languages)) {
        list.innerHTML = s.languages.map((lang, idx) => `
            <div class="p-3.5 rounded-xl border border-white/10 bg-dark-900 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div class="flex items-center gap-3">
                    <i class="${escapeAttr(lang.icon || 'fas fa-code')} text-lg text-blue-400 w-6 text-center"></i>
                    <div>
                        <h4 class="text-xs font-bold text-white">${escapeHTML(lang.name)}</h4>
                        <span class="text-[11px] text-gray-400">Level: <strong class="text-blue-400">${escapeHTML(lang.level || 'Learnt')}</strong> • ${lang.percentage || 70}%</span>
                    </div>
                </div>
                <div class="flex items-center gap-2">
                    <button type="button" onclick="editLanguage(${idx})" class="py-1 px-2.5 rounded border border-white/10 bg-white/5 text-xs text-blue-400 font-medium">Edit</button>
                    <button type="button" onclick="deleteLanguage(${idx})" class="py-1 px-2.5 rounded border border-red-500/20 bg-red-500/10 text-xs text-red-400 font-medium">Delete</button>
                </div>
            </div>
        `).join('');
    }

    setVal('skills-web-input', Array.isArray(s.webBadges) ? s.webBadges.join(', ') : '');
    setVal('skills-core-input', Array.isArray(s.coreBadges) ? s.coreBadges.join(', ') : '');
    setVal('skills-ai-input', Array.isArray(s.aiBadges) ? s.aiBadges.join(', ') : '');
    setVal('skills-tools-input', Array.isArray(s.toolBadges) ? s.toolBadges.join(', ') : '');
}

// 5. Populate Projects
function populateProjectsTab() {
    const list = document.getElementById('admin-projects-list');
    if (!list) return;

    const projs = Array.isArray(currentData.projects) ? currentData.projects : [];
    if (!projs.length) {
        list.innerHTML = `<p class="col-span-2 text-xs text-gray-500 py-6 text-center">No projects added yet.</p>`;
        return;
    }

    list.innerHTML = projs.map((p, idx) => `
        <div class="admin-card overflow-hidden flex flex-col justify-between border border-white/10">
            <div>
                <div class="h-32 bg-[#08090D] border-b border-white/10 relative flex items-center justify-center p-2">
                    ${p.image ? `
                        <img src="${escapeAttr(p.image)}" alt="${escapeAttr(p.title)}" class="max-h-full max-w-full object-contain rounded">
                    ` : `
                        <div class="text-center text-gray-600">
                            <i class="fas fa-laptop-code text-3xl mb-1"></i>
                            <span class="block text-[10px]">No Image Provided</span>
                        </div>
                    `}
                    <span class="absolute top-2 right-2 text-[10px] font-bold px-2 py-0.5 rounded-full ${p.status === 'Live' ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30' : 'bg-amber-500/15 text-amber-400 border border-amber-500/30'}">
                        ${escapeHTML(p.status || 'Live')}
                    </span>
                </div>

                <div class="p-4 space-y-2">
                    <div class="flex items-center justify-between">
                        <h4 class="text-sm font-bold text-white">${escapeHTML(p.title)}</h4>
                        <span class="text-[10px] px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">${escapeHTML(p.category || 'App')}</span>
                    </div>
                    <p class="text-xs text-gray-400 line-clamp-2">${escapeHTML(p.description || '')}</p>
                    ${Array.isArray(p.tags) && p.tags.length ? `
                        <div class="flex flex-wrap gap-1 pt-1 text-[10px]">
                            ${p.tags.slice(0, 3).map(t => `<span class="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-gray-400">${escapeHTML(t)}</span>`).join('')}
                            ${p.tags.length > 3 ? `<span class="text-gray-500 text-[10px]">+${p.tags.length - 3}</span>` : ''}
                        </div>
                    ` : ''}
                </div>
            </div>

            <div class="p-4 pt-0 border-t border-white/5 flex items-center justify-between gap-2 mt-2">
                <button type="button" onclick="editProject('${p.id || idx}')" class="flex-1 py-1.5 px-3 rounded-lg border border-white/10 hover:border-blue-500/40 bg-white/5 text-xs text-blue-400 font-semibold text-center">
                    <i class="fas fa-pen-to-square mr-1"></i> Edit
                </button>
                <button type="button" onclick="deleteProject('${p.id || idx}')" class="flex-1 py-1.5 px-3 rounded-lg border border-red-500/20 hover:border-red-500/40 bg-red-500/10 text-xs text-red-400 font-semibold text-center">
                    <i class="fas fa-trash-can mr-1"></i> Delete
                </button>
            </div>
        </div>
    `).join('');
}

// 6. Populate Achievements
function populateAchievementsTab() {
    if (!currentData.achievements) return;
    const a = currentData.achievements;

    setVal('ach-badge-input', a.badge || '');
    setVal('ach-stat-input', a.stat || '');
    setVal('ach-title-input', a.title || '');
    setVal('ach-organizer-input', a.organizer || '');
    setVal('ach-desc-input', a.description || '');
    setVal('ach-tags-input', Array.isArray(a.tags) ? a.tags.join(', ') : '');
}

// 7. Populate Certifications
function populateCertificationsTab() {
    const list = document.getElementById('admin-certifications-list');
    if (!list) return;

    const certs = Array.isArray(currentData.certifications) ? currentData.certifications : [];
    if (!certs.length) {
        list.innerHTML = `<p class="col-span-2 text-xs text-gray-500 py-6 text-center">No certifications added yet.</p>`;
        return;
    }

    list.innerHTML = certs.map((c, idx) => {
        const isPdf = c.url && c.url.toLowerCase().endsWith('.pdf');
        return `
        <div class="admin-card overflow-hidden flex flex-col justify-between border border-white/10 group">
            <div>
                <!-- Certificate Image / Thumbnail Preview -->
                <div class="h-32 bg-[#08090D] border-b border-white/10 relative flex items-center justify-center p-2 overflow-hidden">
                    ${c.image ? `
                        <img src="${escapeAttr(c.image)}" alt="${escapeAttr(c.title)}" class="max-h-full max-w-full object-contain rounded">
                    ` : (isPdf ? `
                        <div class="w-32 h-24 bg-gradient-to-br from-amber-950/40 via-dark-900 to-[#08090D] border border-amber-500/30 rounded p-2 flex flex-col items-center justify-center text-center">
                            <i class="fas fa-file-pdf text-amber-400 text-2xl mb-1"></i>
                            <span class="text-[9px] text-amber-300 font-mono">PDF Document</span>
                        </div>
                    ` : `
                        <div class="w-32 h-24 bg-gradient-to-br from-blue-950/40 via-dark-900 to-[#08090D] border border-blue-500/30 rounded p-2 flex flex-col items-center justify-center text-center">
                            <i class="${escapeAttr(c.icon || 'fas fa-award')} text-blue-400 text-2xl mb-1"></i>
                            <span class="text-[9px] text-blue-300 font-mono">Verified Credential</span>
                        </div>
                    `)}
                    ${c.score ? `
                        <span class="absolute top-2 right-2 text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">
                            ${escapeHTML(c.score)}
                        </span>
                    ` : ''}
                </div>

                <div class="p-4 space-y-2">
                    <div class="flex items-center justify-between">
                        <span class="text-[10px] uppercase font-semibold text-gray-400 flex items-center gap-1.5 truncate max-w-[160px]">
                            <i class="${escapeAttr(c.icon || 'fas fa-certificate')} text-blue-400"></i> ${escapeHTML(c.issuer || 'Issuer')}
                        </span>
                        <span class="text-[9px] font-mono px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-gray-400 shrink-0">
                            ${escapeHTML(c.category || 'Certification')}
                        </span>
                    </div>
                    <h4 class="text-xs font-bold text-white group-hover:text-blue-400 transition-colors">${escapeHTML(c.title)}</h4>
                    <p class="text-[11px] text-gray-400 line-clamp-2">${escapeHTML(c.description || '')}</p>
                    ${Array.isArray(c.tags) && c.tags.length ? `
                        <div class="flex flex-wrap gap-1 pt-1 text-[10px]">
                            ${c.tags.slice(0, 3).map(t => `<span class="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-gray-400">${escapeHTML(t)}</span>`).join('')}
                        </div>
                    ` : ''}
                </div>
            </div>

            <div class="p-4 pt-0 border-t border-white/5 flex items-center justify-end gap-2 mt-2">
                <button type="button" onclick="editCertificate('${c.id || idx}')" class="flex-1 py-1.5 px-3 rounded-lg border border-white/10 hover:border-blue-500/40 bg-white/5 text-xs text-blue-400 font-semibold text-center">
                    <i class="fas fa-pen-to-square mr-1"></i> Edit
                </button>
                <button type="button" onclick="deleteCertificate('${c.id || idx}')" class="flex-1 py-1.5 px-3 rounded-lg border border-red-500/20 hover:border-red-500/40 bg-red-500/10 text-xs text-red-400 font-semibold text-center">
                    <i class="fas fa-trash-can mr-1"></i> Delete
                </button>
            </div>
        </div>
        `;
    }).join('');
}

// 8. Populate Contact
function populateContactTab() {
    if (!currentData.contact) return;
    const c = currentData.contact;

    setVal('contact-email-input', c.email || '');
    setVal('contact-linkedin-input', c.linkedin || '');
    setVal('contact-github-input', c.github || '');
    setVal('contact-footer-input', c.footerText || '');
}

// --- Tab Switching Navigation ---
function initTabNavigation() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetId = btn.getAttribute('data-tab');
            if (!targetId) return;

            tabBtns.forEach(b => b.classList.remove('active'));
            tabPanes.forEach(p => p.classList.add('hidden'));

            btn.classList.add('active');
            const targetPane = document.getElementById(targetId);
            if (targetPane) targetPane.classList.remove('hidden');
        });
    });
}

// --- Gather Inputs from All Form Tabs ---
function syncAllFormsToData() {
    // 1. Hero
    if (!currentData.hero) currentData.hero = {};
    currentData.hero.name = getVal('hero-name-input');
    currentData.hero.badge = getVal('hero-badge-input');
    currentData.hero.typewriter = getVal('hero-typewriter-input')
        .split('\n')
        .map(s => s.trim())
        .filter(Boolean);
    currentData.hero.bio = getVal('hero-bio-input');
    currentData.hero.profileImage = getVal('avatar-url-input') || 'MYpic2.png';
    currentData.hero.resumeUrl = getVal('hero-resume-input') || 'Resume.pdf';

    // 2. About
    if (!currentData.about) currentData.about = {};
    currentData.about.journeyHeading = getVal('about-heading-input');
    currentData.about.paragraphs = [
        getVal('about-p1-input'),
        getVal('about-p2-input')
    ].filter(Boolean);

    // 3. Skills
    if (!currentData.skills) currentData.skills = {};
    currentData.skills.webBadges = getVal('skills-web-input').split(',').map(s => s.trim()).filter(Boolean);
    currentData.skills.coreBadges = getVal('skills-core-input').split(',').map(s => s.trim()).filter(Boolean);
    currentData.skills.aiBadges = getVal('skills-ai-input').split(',').map(s => s.trim()).filter(Boolean);
    currentData.skills.toolBadges = getVal('skills-tools-input').split(',').map(s => s.trim()).filter(Boolean);

    // 4. Achievements
    if (!currentData.achievements) currentData.achievements = {};
    currentData.achievements.badge = getVal('ach-badge-input');
    currentData.achievements.stat = getVal('ach-stat-input');
    currentData.achievements.title = getVal('ach-title-input');
    currentData.achievements.organizer = getVal('ach-organizer-input');
    currentData.achievements.description = getVal('ach-desc-input');
    currentData.achievements.tags = getVal('ach-tags-input').split(',').map(s => s.trim()).filter(Boolean);

    // 5. Contact
    if (!currentData.contact) currentData.contact = {};
    currentData.contact.email = getVal('contact-email-input');
    currentData.contact.linkedin = getVal('contact-linkedin-input');
    currentData.contact.github = getVal('contact-github-input');
    currentData.contact.footerText = getVal('contact-footer-input');
}

// --- Save and Toast ---
function commitChanges() {
    syncAllFormsToData();
    const success = window.savePortfolioData(currentData);
    if (success) {
        showToast('Saved! Portfolio updated dynamically.');
    } else {
        alert('Failed to save to local storage.');
    }
}

function initFormSaveHandlers() {
    const quickSaveBtn = document.getElementById('btn-quick-save');
    if (quickSaveBtn) {
        quickSaveBtn.addEventListener('click', commitChanges);
    }
}

// --- Modals Engine (Projects, Certificates, Education) ---
function initModalHandlers() {
    // Close buttons for all modals
    document.querySelectorAll('.modal-close-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('#modal-project, #modal-certificate, #modal-education').forEach(m => {
                m.classList.add('hidden');
                m.classList.remove('flex');
            });
        });
    });

    // 1. Project Modal
    const btnAddProject = document.getElementById('btn-add-project');
    const projectForm = document.getElementById('project-form');
    const projFileInput = document.getElementById('proj-file-input');

    if (btnAddProject) {
        btnAddProject.addEventListener('click', () => {
            document.getElementById('modal-project-title').textContent = 'Add New Project';
            document.getElementById('proj-edit-id').value = '';
            setVal('proj-title-input', '');
            setVal('proj-category-input', 'Web Tool');
            setVal('proj-status-input', 'Live');
            setVal('proj-desc-input', '');
            setVal('proj-tags-input', 'React, JavaScript, CSS');
            setVal('proj-github-input', '');
            setVal('proj-demo-input', '');
            setVal('proj-img-url-input', '');

            openModal('modal-project');
        });
    }

    if (projFileInput) {
        projFileInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (re) => {
                    setVal('proj-img-url-input', re.target.result);
                    showToast('Screenshot loaded into form!');
                };
                reader.readAsDataURL(file);
            }
        });
    }

    if (projectForm) {
        projectForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const editId = document.getElementById('proj-edit-id').value;
            const newProj = {
                id: editId || 'proj-' + Date.now(),
                title: getVal('proj-title-input'),
                category: getVal('proj-category-input') || 'Project',
                status: getVal('proj-status-input') || 'Live',
                description: getVal('proj-desc-input'),
                tags: getVal('proj-tags-input').split(',').map(s => s.trim()).filter(Boolean),
                githubUrl: getVal('proj-github-input'),
                demoUrl: getVal('proj-demo-input'),
                image: getVal('proj-img-url-input')
            };

            if (!Array.isArray(currentData.projects)) currentData.projects = [];

            if (editId) {
                const idx = currentData.projects.findIndex(p => (p.id || '') === editId);
                if (idx !== -1) currentData.projects[idx] = newProj;
            } else {
                currentData.projects.unshift(newProj);
            }

            closeModal('modal-project');
            populateProjectsTab();
            commitChanges();
            showToast('Project saved successfully!');
        });
    }

    // 2. Certificate Modal
    const btnAddCert = document.getElementById('btn-add-certificate');
    const certForm = document.getElementById('cert-form');
    const certFileInput = document.getElementById('cert-file-input');
    const certUrlInput = document.getElementById('cert-url-input');
    const certPreviewImg = document.getElementById('cert-modal-preview-img');
    const certPreviewPlaceholder = document.getElementById('cert-modal-preview-placeholder');

    function updateCertModalPreview(src) {
        if (!certPreviewImg || !certPreviewPlaceholder) return;
        if (src && (src.match(/\.(jpeg|jpg|png|webp|gif|svg)$/i) || src.startsWith('data:image/'))) {
            certPreviewImg.src = src;
            certPreviewImg.classList.remove('hidden');
            certPreviewPlaceholder.classList.add('hidden');
        } else {
            certPreviewImg.src = '';
            certPreviewImg.classList.add('hidden');
            certPreviewPlaceholder.classList.remove('hidden');
        }
    }

    if (certUrlInput) {
        certUrlInput.addEventListener('input', () => {
            updateCertModalPreview(certUrlInput.value.trim());
        });
    }

    if (btnAddCert) {
        btnAddCert.addEventListener('click', () => {
            document.getElementById('modal-cert-title').textContent = 'Add New Certificate';
            document.getElementById('cert-edit-id').value = '';
            setVal('cert-title-input', '');
            setVal('cert-issuer-input', '');
            setVal('cert-score-input', 'Certified');
            setVal('cert-category-input', 'programming');
            setVal('cert-desc-input', '');
            setVal('cert-tags-input', '');
            setVal('cert-icon-input', 'fas fa-certificate');
            setVal('cert-url-input', '');
            updateCertModalPreview('');

            openModal('modal-certificate');
        });
    }

    if (certFileInput) {
        certFileInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (re) => {
                    const res = re.target.result;
                    setVal('cert-url-input', res);
                    updateCertModalPreview(res);
                    showToast('Certificate file loaded!');
                };
                reader.readAsDataURL(file);
            }
        });
    }

    if (certForm) {
        certForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const editId = document.getElementById('cert-edit-id').value;
            const certUrl = getVal('cert-url-input');
            const isImg = certUrl.match(/\.(jpeg|jpg|png|webp|gif|svg)$/i) || certUrl.startsWith('data:image/');

            const newCert = {
                id: editId || 'cert-' + Date.now(),
                title: getVal('cert-title-input'),
                issuer: getVal('cert-issuer-input'),
                score: getVal('cert-score-input'),
                category: getVal('cert-category-input') || 'programming',
                description: getVal('cert-desc-input'),
                tags: getVal('cert-tags-input').split(',').map(s => s.trim()).filter(Boolean),
                icon: getVal('cert-icon-input') || 'fas fa-certificate',
                image: isImg ? certUrl : '',
                url: certUrl
            };

            if (!Array.isArray(currentData.certifications)) currentData.certifications = [];

            if (editId) {
                const idx = currentData.certifications.findIndex(c => (c.id || '') === editId);
                if (idx !== -1) currentData.certifications[idx] = newCert;
            } else {
                currentData.certifications.push(newCert);
            }

            closeModal('modal-certificate');
            populateCertificationsTab();
            commitChanges();
            showToast('Certificate saved successfully!');
        });
    }

    // 3. Education Modal
    const btnAddEdu = document.getElementById('btn-add-education');
    const eduForm = document.getElementById('edu-form');

    if (btnAddEdu) {
        btnAddEdu.addEventListener('click', () => {
            document.getElementById('modal-edu-title').textContent = 'Add Education Entry';
            document.getElementById('edu-edit-id').value = '';
            setVal('edu-degree-input', '');
            setVal('edu-inst-input', '');
            setVal('edu-year-input', '');
            setVal('edu-score-input', '');
            setVal('edu-desc-input', '');
            setVal('edu-tags-input', '');

            openModal('modal-education');
        });
    }

    if (eduForm) {
        eduForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const editId = document.getElementById('edu-edit-id').value;
            const newEdu = {
                id: editId || 'edu-' + Date.now(),
                degree: getVal('edu-degree-input'),
                institution: getVal('edu-inst-input'),
                year: getVal('edu-year-input'),
                score: getVal('edu-score-input'),
                description: getVal('edu-desc-input'),
                tags: getVal('edu-tags-input').split(',').map(s => s.trim()).filter(Boolean)
            };

            if (!Array.isArray(currentData.education)) currentData.education = [];

            if (editId) {
                const idx = currentData.education.findIndex(ed => (ed.id || '') === editId);
                if (idx !== -1) currentData.education[idx] = newEdu;
            } else {
                currentData.education.push(newEdu);
            }

            closeModal('modal-education');
            populateEducationTab();
            commitChanges();
            showToast('Education history saved!');
        });
    }
}

function openModal(id) {
    const modal = document.getElementById(id);
    if (modal) {
        modal.classList.remove('hidden');
        modal.classList.add('flex');
    }
}

function closeModal(id) {
    const modal = document.getElementById(id);
    if (modal) {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
    }
}

// Global Edit/Delete Functions attached to window
window.editProject = function(id) {
    const proj = currentData.projects.find((p, idx) => (p.id || String(idx)) === String(id));
    if (!proj) return;

    document.getElementById('modal-project-title').textContent = 'Edit Project';
    document.getElementById('proj-edit-id').value = proj.id || id;
    setVal('proj-title-input', proj.title || '');
    setVal('proj-category-input', proj.category || '');
    setVal('proj-status-input', proj.status || 'Live');
    setVal('proj-desc-input', proj.description || '');
    setVal('proj-tags-input', Array.isArray(proj.tags) ? proj.tags.join(', ') : '');
    setVal('proj-github-input', proj.githubUrl || '');
    setVal('proj-demo-input', proj.demoUrl || '');
    setVal('proj-img-url-input', proj.image || '');

    openModal('modal-project');
};

window.deleteProject = function(id) {
    if (!confirm('Are you sure you want to delete this project?')) return;
    currentData.projects = currentData.projects.filter((p, idx) => (p.id || String(idx)) !== String(id));
    populateProjectsTab();
    commitChanges();
    showToast('Project removed.');
};

window.editCertificate = function(id) {
    const cert = currentData.certifications.find((c, idx) => (c.id || String(idx)) === String(id));
    if (!cert) return;

    document.getElementById('modal-cert-title').textContent = 'Edit Certificate';
    document.getElementById('cert-edit-id').value = cert.id || id;
    setVal('cert-title-input', cert.title || '');
    setVal('cert-issuer-input', cert.issuer || '');
    setVal('cert-score-input', cert.score || '');
    setVal('cert-category-input', cert.category || 'programming');
    setVal('cert-desc-input', cert.description || '');
    setVal('cert-tags-input', Array.isArray(cert.tags) ? cert.tags.join(', ') : '');
    setVal('cert-icon-input', cert.icon || 'fas fa-certificate');
    setVal('cert-url-input', cert.image || cert.url || '');

    const previewSrc = cert.image || cert.url || '';
    const certPreviewImg = document.getElementById('cert-modal-preview-img');
    const certPreviewPlaceholder = document.getElementById('cert-modal-preview-placeholder');
    if (certPreviewImg && certPreviewPlaceholder) {
        if (previewSrc && (previewSrc.match(/\.(jpeg|jpg|png|webp|gif|svg)$/i) || previewSrc.startsWith('data:image/'))) {
            certPreviewImg.src = previewSrc;
            certPreviewImg.classList.remove('hidden');
            certPreviewPlaceholder.classList.add('hidden');
        } else {
            certPreviewImg.src = '';
            certPreviewImg.classList.add('hidden');
            certPreviewPlaceholder.classList.remove('hidden');
        }
    }

    openModal('modal-certificate');
};

window.deleteCertificate = function(id) {
    if (!confirm('Are you sure you want to delete this certificate?')) return;
    currentData.certifications = currentData.certifications.filter((c, idx) => (c.id || String(idx)) !== String(id));
    populateCertificationsTab();
    commitChanges();
    showToast('Certificate removed.');
};

window.editEducation = function(id) {
    const edu = currentData.education.find((e, idx) => (e.id || String(idx)) === String(id));
    if (!edu) return;

    document.getElementById('modal-edu-title').textContent = 'Edit Education';
    document.getElementById('edu-edit-id').value = edu.id || id;
    setVal('edu-degree-input', edu.degree || '');
    setVal('edu-inst-input', edu.institution || '');
    setVal('edu-year-input', edu.year || '');
    setVal('edu-score-input', edu.score || '');
    setVal('edu-desc-input', edu.description || '');
    setVal('edu-tags-input', Array.isArray(edu.tags) ? edu.tags.join(', ') : '');

    openModal('modal-education');
};

window.deleteEducation = function(id) {
    if (!confirm('Delete this education entry?')) return;
    currentData.education = currentData.education.filter((e, idx) => (e.id || String(idx)) !== String(id));
    populateEducationTab();
    commitChanges();
    showToast('Education entry deleted.');
};

window.editLanguage = function(idx) {
    const lang = currentData.skills.languages[idx];
    if (!lang) return;

    const name = prompt('Language Name (and subtitle in brackets):', lang.name);
    if (name === null) return;
    const level = prompt('Proficiency Level (Primary, Proficient, Learnt):', lang.level || 'Learnt');
    if (level === null) return;
    const pct = prompt('Progress percentage (1-100):', lang.percentage || 70);
    if (pct === null) return;

    lang.name = name;
    lang.level = level;
    lang.percentage = parseInt(pct, 10) || 70;

    populateSkillsTab();
    commitChanges();
};

window.deleteLanguage = function(idx) {
    if (!confirm('Remove this programming language?')) return;
    currentData.skills.languages.splice(idx, 1);
    populateSkillsTab();
    commitChanges();
};

const btnAddLang = document.getElementById('btn-add-language');
if (btnAddLang) {
    btnAddLang.addEventListener('click', () => {
        const name = prompt('Language Name: (e.g. Python)');
        if (!name) return;
        const level = prompt('Level: (e.g. Proficient or Learnt)', 'Learnt');
        const pct = prompt('Percentage (1-100):', '75');

        if (!currentData.skills) currentData.skills = {};
        if (!Array.isArray(currentData.skills.languages)) currentData.skills.languages = [];

        currentData.skills.languages.push({
            name: name,
            level: level || 'Learnt',
            percentage: parseInt(pct, 10) || 75,
            icon: 'fas fa-code',
            color: '#3B82F6'
        });

        populateSkillsTab();
        commitChanges();
    });
}

// --- Export, Backup & Security Settings ---
function initExportAndSettingsHandlers() {
    const btnExportDataJs = document.getElementById('btn-export-data-js');
    const btnDownloadDataJs2 = document.getElementById('btn-download-data-js-2');
    const btnExportJson = document.getElementById('btn-export-json');
    const jsonImportInput = document.getElementById('json-import-input');
    const btnChangePin = document.getElementById('btn-change-pin');
    const newPinInput = document.getElementById('new-pin-input');
    const btnResetDefaults = document.getElementById('btn-reset-defaults');

    function downloadDataJs() {
        syncAllFormsToData();
        const fileContent = generateDataJsFileContent(currentData);
        downloadFile('data.js', fileContent, 'text/javascript');
        showToast('data.js downloaded! Replace in your repository.');
    }

    if (btnExportDataJs) btnExportDataJs.addEventListener('click', downloadDataJs);
    if (btnDownloadDataJs2) btnDownloadDataJs2.addEventListener('click', downloadDataJs);

    if (btnExportJson) {
        btnExportJson.addEventListener('click', () => {
            syncAllFormsToData();
            downloadFile('portfolio-data.json', JSON.stringify(currentData, null, 2), 'application/json');
            showToast('JSON backup downloaded.');
        });
    }

    if (jsonImportInput) {
        jsonImportInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = (re) => {
                try {
                    const parsed = JSON.parse(re.target.result);
                    currentData = parsed;
                    commitChanges();
                    loadDashboardData();
                    showToast('Data imported and applied!');
                } catch (err) {
                    alert('Invalid JSON file format.');
                }
            };
            reader.readAsText(file);
        });
    }

    if (btnChangePin && newPinInput) {
        btnChangePin.addEventListener('click', () => {
            const newPin = newPinInput.value.trim();
            if (!newPin || newPin.length < 4) {
                alert('PIN must be at least 4 characters.');
                return;
            }
            if (window.setAdminPin) {
                window.setAdminPin(newPin);
                newPinInput.value = '';
                showToast(`Admin PIN updated successfully!`);
            }
        });
    }

    if (btnResetDefaults) {
        btnResetDefaults.addEventListener('click', () => {
            if (confirm('Are you sure you want to reset all data to original defaults? All unsaved custom edits will be lost.')) {
                if (window.resetPortfolioData) window.resetPortfolioData();
                loadDashboardData();
                showToast('Reset to original default data.');
            }
        });
    }
}

// Generate the complete data.js source code string
function generateDataJsFileContent(data) {
    return `// --- Dynamic Portfolio Data Store ---
// Generated automatically by Antigravity Portfolio Admin Dashboard

const DEFAULT_PORTFOLIO_DATA = ${JSON.stringify(data, null, 4)};

const STORAGE_KEY = 'portfolio_custom_data_v1';
const ADMIN_PIN_KEY = 'portfolio_admin_pin_v1';
const DEFAULT_PIN = 'arjun123';

function getPortfolioData() {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            const parsed = JSON.parse(stored);
            return {
                ...DEFAULT_PORTFOLIO_DATA,
                ...parsed,
                hero: { ...DEFAULT_PORTFOLIO_DATA.hero, ...(parsed.hero || {}) },
                about: { ...DEFAULT_PORTFOLIO_DATA.about, ...(parsed.about || {}) },
                skills: { ...DEFAULT_PORTFOLIO_DATA.skills, ...(parsed.skills || {}) },
                achievements: { ...DEFAULT_PORTFOLIO_DATA.achievements, ...(parsed.achievements || {}) },
                contact: { ...DEFAULT_PORTFOLIO_DATA.contact, ...(parsed.contact || {}) },
                education: parsed.education || DEFAULT_PORTFOLIO_DATA.education,
                projects: parsed.projects || DEFAULT_PORTFOLIO_DATA.projects,
                certifications: parsed.certifications || DEFAULT_PORTFOLIO_DATA.certifications
            };
        }
    } catch (e) {
        console.warn('Could not read custom portfolio data from localStorage, using defaults.', e);
    }
    return JSON.parse(JSON.stringify(DEFAULT_PORTFOLIO_DATA));
}

function savePortfolioData(data) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        return true;
    } catch (e) {
        console.error('Failed to save to localStorage:', e);
        return false;
    }
}

function resetPortfolioData() {
    localStorage.removeItem(STORAGE_KEY);
}

function getAdminPin() {
    return localStorage.getItem(ADMIN_PIN_KEY) || DEFAULT_PIN;
}

function setAdminPin(newPin) {
    localStorage.setItem(ADMIN_PIN_KEY, newPin);
}

if (typeof window !== 'undefined') {
    window.DEFAULT_PORTFOLIO_DATA = DEFAULT_PORTFOLIO_DATA;
    window.getPortfolioData = getPortfolioData;
    window.savePortfolioData = savePortfolioData;
    window.resetPortfolioData = resetPortfolioData;
    window.getAdminPin = getAdminPin;
    window.setAdminPin = setAdminPin;
}
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        DEFAULT_PORTFOLIO_DATA,
        getPortfolioData,
        savePortfolioData,
        resetPortfolioData,
        getAdminPin,
        setAdminPin
    };
}
`;
}

// Helper: Download a file to user's computer
function downloadFile(filename, content, mimeType) {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// Toast Helper
let toastTimeout = null;
function showToast(msg) {
    const toast = document.getElementById('toast');
    const toastMsg = document.getElementById('toast-message');
    if (!toast) return;

    if (toastMsg) toastMsg.textContent = msg;
    toast.classList.remove('translate-y-20', 'opacity-0');
    toast.classList.add('translate-y-0', 'opacity-100');

    if (toastTimeout) clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
        toast.classList.add('translate-y-20', 'opacity-0');
        toast.classList.remove('translate-y-0', 'opacity-100');
    }, 2800);
}

// Helpers
function getVal(id) {
    const el = document.getElementById(id);
    return el ? el.value.trim() : '';
}

function setVal(id, val) {
    const el = document.getElementById(id);
    if (el) el.value = val;
}

function stripHTML(html) {
    const div = document.createElement('div');
    div.innerHTML = html;
    return div.textContent || div.innerText || '';
}

function escapeHTML(str) {
    if (str == null) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

function escapeAttr(str) {
    if (str == null) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
}
