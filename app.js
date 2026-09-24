const FALLBACK_SCHEMA = { schema_version: 2, active: 'cybercore-tech', families: { 'cybercore-tech': ['cybercore-tech'], default: ['neon-night'] } };
const COLOR_ROLES = ['bg', 'white', 'acid_green', 'hot_pink', 'purple', 'cyan', 'orange', 'red', 'panel', 'line', 'muted'];
const FAMILY_LABELS = { 'cybercore-tech':'CYBERCORE TECH / MASTER MIX', cyberdyne:'CYBERDYNE', cyberpunk:'CYBERPUNK', default:'DEFAULT / CLASSICS', dystopian:'DYSTOPIAN', neosynth:'NEOSYNTH', synthwave:'SYNTHWAVE' };
const PROJECTS = [
  ['cybercore','Core','Shared schemas, palette, design tokens, and canonical paths.','cybercore','tile-cybercore.svg'], ['cybercore-mission-control','Core','Fleet visibility and mission control for the Cybercore ecosystem.','cybercore-mission-control',null], ['cyberdeck','Core','Central tool hub and live system status surface.','cyberdeck-hub','tile-cyberdeck.svg'], ['cyberplug','Core','Omarchy plugin distribution for the Cybercore desktop.','cyberplug','tile-cyberplug.svg'], ['apexdaemon','Active','Theme sync, fleet health, backup, and local automation.','apexdaemon','tile-apexdaemon.svg'], ['agentforge','Active','Local-first, model-agnostic, evidence-preserving agent work.','agentforge',null], ['gateflow','Tools','Real Linux network sandboxes for Rust tests.','gateflow','tile-gateflow.svg'], ['ghostport','Security','Encrypted NAT traversal for private network edges.','ghostport','tile-ghostport.svg'], ['wraithflow','Security','Config-driven TCP proxy pipelines for the dark edge.','wraithflow','tile-wraithflow.svg'], ['vortexwall','Security','Active-blackholing firewall and defensive network control.','vortexwall','tile-vortexwall.svg'], ['cybermeta','Security','EXIF privacy workstation for controlled metadata removal.','cybermeta','tile-cybermeta.svg'], ['cybervault','Security','Encrypted secrets with Argon2id and ChaCha20.','cybervault','tile-cybervault.svg'], ['cyberterm','Tools','Scriptable terminal emulator for the Cybercore desktop.','cyberterm','tile-cyberterm.svg'], ['diagprint','Tools','Rust diagnostics lifecycle framework for useful output.','diagprint','tile-diagprint.svg'], ['hermes','Tools','A watchful Rust service for repository and system signals.','hermes',null], ['cyberdesk','Tools','Darknotes portal and system-facing Cybercore workspace.','cyberdesk',null], ['cyberwatch','Tools','Host and service observation for the local systems layer.','cyberwatch',null], ['cyberwire','Security','Low-level connectivity and wire-oriented systems work.','cyberwire',null], ['aetherscope','Tools','Network visibility and diagnostic tooling.','aetherscope',null], ['sentrygrid','Security','Network sentry and defensive monitoring utilities.','sentrygrid',null], ['echo','Tools','Small network utilities for testing and inspection.','echo',null], ['chronicle','Security','Security event and evidence tooling.','chronicle',null], ['sigilward','Security','Security boundary and trust tooling.','sigilward',null], ['undertow','Security','Deep network and defensive systems utilities.','undertow',null], ['keysmith','Security','Key and secret handling utilities.','keysmith',null], ['cyberfleet','Core','Repository fleet configuration and roots.','cyberfleet',null], ['omniscient','Tools','Operator-oriented observation and intelligence tooling.','omniscient',null], ['dockspace','Tools','Workspace and desktop surface experiments.','dockspace',null], ['vexlang','Tools','Language and systems experiments in the wider grid.','vexlang',null]
];
const FALLBACK_SNIPPETS = {
  'cybercore-mission-control':'FLEET VISIBILITY / MISSION STATE',
  agentforge:'LOCAL AGENTS / EVIDENCE TRAILS',
  hermes:'REPOSITORY SIGNALS / WATCHFUL SERVICE',
  cyberdesk:'DARKNOTES / OPERATOR WORKSPACE',
  cyberwatch:'HOST OBSERVATION / SERVICE SIGNALS',
  cyberwire:'LOW-LEVEL CONNECTIVITY / WIRE WORK',
  aetherscope:'NETWORK VISIBILITY / DIAGNOSTICS',
  sentrygrid:'DEFENSIVE MONITORING / NETWORK SENTINEL',
  echo:'SMALL UTILITIES / TEST AND INSPECT',
  chronicle:'SECURITY EVENTS / PRESERVED EVIDENCE',
  sigilward:'TRUST BOUNDARIES / SECURITY CONTROL',
  undertow:'DEEP NETWORKS / DEFENSIVE SYSTEMS',
  keysmith:'KEY MATERIAL / SECRET HANDLING',
  cyberfleet:'REPOSITORY ROOTS / FLEET CONFIG',
  omniscient:'OPERATOR SIGNALS / SYSTEM INTELLIGENCE',
  dockspace:'WORKSPACE SURFACES / DESKTOP FLOWS',
  vexlang:'LANGUAGE EXPERIMENTS / SYSTEMS WORK'
};
const REPO_LABELS = ['OPEN THE CORE','INSPECT THE MISSION','ENTER THE HUB','OPEN THE PLUGIN','WATCH THE DAEMON','FORGE THE WORK','RUN THE BENCH','TRACE THE PORT','FOLLOW THE FLOW','CHECK THE WALL','STRIP THE METADATA','UNLOCK THE VAULT','OPEN THE TERMINAL','READ THE DIAGNOSTICS','FOLLOW THE SIGNAL','OPEN THE DARKNOTES','WATCH THE HOST','TRACE THE WIRE','SCOPE THE NETWORK','GUARD THE GRID','SEND AN ECHO','READ THE CHRONICLE','VERIFY THE SIGIL','GO UNDER','FORGE A KEY','OPEN THE FLEET','SEE EVERYTHING','ENTER THE DOCK','EXPLORE THE LANGUAGE'];
const RESOURCE_DETAILS = {
  containers: { title:'CONTAINERS', description:'Services and development stacks organized as repeatable, inspectable surfaces.', details:'CONTAINERS\n├── services\n├── development stacks\n├── repeatable environments\n└── operator documentation', link:'https://github.com/cybercore-tech?tab=repositories&q=container' },
  tooling: { title:'TOOLING', description:'The terminal-first layer: small tools with clear contracts, useful output, and focused jobs.', details:'TOOLING\n├── CYBERTERM\n├── DIAGPRINT\n├── GATEFLOW\n└── SUPPORTING UTILITIES', link:'https://github.com/cybercore-tech/cybercore' },
  hyprland: { title:'HYPRLAND', description:'Specialized workspaces and desktop flows for a focused Omarchy operating surface.', details:'HYPRLAND\n├── WORKSPACES\n├── WINDOWS\n├── KEYBINDINGS\n└── THEME / SHELL INTEGRATION', link:'https://github.com/darkstardevx/omarchy-darkbox-dotfiles' },
  darkbox: { title:'DARKBOX DOTFILES', description:'The current operator-facing desktop configuration tree, kept visible so the environment is explainable and reproducible.', details:'omarchy-darkbox-dotfiles/\n├── hypr/\n│   ├── hyprland.lua\n│   ├── bindings.lua\n│   ├── monitors.lua\n│   ├── input.lua\n│   └── looknfeel.lua\n├── ghostty/\n│   ├── config\n│   └── tab-style.css\n├── omarchy/\n│   ├── shell.toml\n│   ├── aliases\n│   └── workspace-profiles/\n├── waybar/\n├── yazi/\n└── starship.toml', link:'https://github.com/darkstardevx/omarchy-darkbox-dotfiles' }
};
let schema = FALLBACK_SCHEMA;
let themeIndex = {};
let themeCache = {};
let activeThemeName = 'cybercore-tech';
let showAll = false;
let activeFilter = 'all';
const $ = (selector) => document.querySelector(selector);
const repoUrl = (repo) => `https://github.com/cybercore-tech/${repo}`;
const slug = (name) => name.toLowerCase().replaceAll(' ', '-');
const displayTheme = (name) => name.replaceAll('-', ' ').toUpperCase();

function setPalette(palette) {
  const root = document.documentElement;
  const map = { bg:'--bg', white:'--white', acid_green:'--acid', hot_pink:'--pink', purple:'--purple', cyan:'--cyan', orange:'--orange', red:'--red', panel:'--panel', line:'--line', muted:'--muted' };
  Object.entries(map).forEach(([key, variable]) => root.style.setProperty(variable, `#${palette[key]}`));
  $('#activeTheme').textContent = displayTheme(activeThemeName);
  $('#swatches').innerHTML = ['acid_green','hot_pink','purple','cyan','orange','red'].map((key) => `<i style="background:#${palette[key]}" title="${key}"></i>`).join('');
}

async function getPalette(name) {
  if (themeCache[name]) return themeCache[name];
  const family = themeIndex[name];
  if (!family) return themeCache[name] || null;
  try { const response = await fetch(`data/themes/${family}/${name}.json`); if (response.ok) themeCache[name] = await response.json(); } catch (error) { console.info(`Theme ${name} unavailable.`, error); }
  return themeCache[name] || null;
}

async function applyTheme(name, persist = true, paletteOverride = null) {
  const palette = paletteOverride || await getPalette(name) || themeCache[schema.active];
  if (!palette) return;
  activeThemeName = name;
  setPalette(palette);
  document.documentElement.dataset.theme = name;
  $('#themeLabel').textContent = displayTheme(name);
  document.querySelectorAll('.theme-item').forEach((item) => item.classList.toggle('selected', item.dataset.theme === name));
  if (persist) localStorage.setItem('cybercore-theme', name);
}

function renderThemeDropdown() {
  const dropdown = $('#themeDropdown');
  dropdown.innerHTML = Object.entries(schema.families).map(([family, themes]) => `<div class="theme-group-label">${FAMILY_LABELS[family] || family.toUpperCase()}</div>${themes.map((name) => `<div class="theme-item" role="option" tabindex="0" data-theme="${name}">${displayTheme(name)}</div>`).join('')}`).join('');
  const custom = JSON.parse(localStorage.getItem('cybercore-custom-themes') || '{}');
  if (Object.keys(custom).length) dropdown.innerHTML += `<div class="theme-group-label">CUSTOM / THIS BROWSER</div>${Object.keys(custom).map((name) => `<div class="theme-item" role="option" tabindex="0" data-theme="custom:${name}">${displayTheme(name)}</div>`).join('')}`;
}

function closeThemeDropdown() { $('#themeDropdown').hidden = true; $('#themePickerButton').setAttribute('aria-expanded', 'false'); }
function openThemeDropdown() { const button = $('#themePickerButton'); const dropdown = $('#themeDropdown'); const rect = button.getBoundingClientRect(); dropdown.style.top = `${rect.bottom + 6}px`; dropdown.style.left = `${Math.max(8, Math.min(rect.left, innerWidth - 248))}px`; dropdown.hidden = false; button.setAttribute('aria-expanded', 'true'); }

function projectCard(project, index) {
  const [name, category, description, repo, art] = project;
  const isHidden = index >= 10 && !showAll;
  const passesFilter = activeFilter === 'all' || slug(category) === activeFilter || (activeFilter === 'active' && category === 'Active');
  const details = `${name.toUpperCase()}\n\nCATEGORY: ${category.toUpperCase()}\nSURFACE: CYBERCORE TECH\nSTATUS: TRACKED IN THE GRID`;
  const fallback = `<div class="fallback-art"><span>${String(index + 1).padStart(2, '0')}</span><div class="fallback-copy"><strong>${name.toUpperCase()}</strong><small>${FALLBACK_SNIPPETS[name] || description.toUpperCase()}</small></div></div>`;
  return `<article class="project-card${index < 10 ? ' top-card' : ''}${isHidden || !passesFilter ? ' is-hidden' : ''}" data-category="${slug(category)}" data-project="${index}"><div class="project-art">${art ? `<img src="assets/${art}" alt="${name} project card">` : fallback}</div><div class="project-meta"><i class="project-dot"></i>${category} system</div><h3>${name}</h3><p>${description}</p><div class="project-actions"><button class="project-open" type="button" data-project="${index}">PROFILE ↗</button><a class="project-link" href="${repoUrl(repo)}" target="_blank" rel="noreferrer">${REPO_LABELS[index]} <span>↗</span></a></div><template class="project-detail">${details}</template></article>`;
}

function renderProjects() {
  const visible = PROJECTS.filter((project, index) => (showAll || index < 10) && (activeFilter === 'all' || slug(project[1]) === activeFilter || (activeFilter === 'active' && project[1] === 'Active'))).length;
  $('#projectGrid').innerHTML = PROJECTS.map(projectCard).join('');
  $('#visibleCount').textContent = visible; $('#totalCount').textContent = PROJECTS.length;
  $('#showMore').innerHTML = showAll ? 'COLLAPSE TO TOP 10 <span>↑</span>' : 'SHOW THE FULL INVENTORY <span>↓</span>';
}

function openProjectModal(index) {
  const [name, category, description, repo] = PROJECTS[index];
  $('#modalCategory').textContent = `${category.toUpperCase()} / SYSTEM PROFILE`;
  $('#modalTitle').textContent = name.toUpperCase(); $('#modalDescription').textContent = description;
  $('#modalMeta').innerHTML = `<span>CYBERCORE GRID</span><span>${category.toUpperCase()}</span><span>PUBLIC REPOSITORY</span>`;
  $('#modalDetails').textContent = `${name.toUpperCase()}\n\nCATEGORY: ${category.toUpperCase()}\nROLE: ${description}\n\nVALIDATION SURFACE\n├── AI-ASSISTED CHECKS\n├── HUMAN REVIEW\n└── EVIDENCE PRESERVED`;
  $('#modalRepo').href = repoUrl(repo); $('#projectModal').hidden = false;
}

function openResourceModal(name) { const resource = RESOURCE_DETAILS[name]; if (!resource) return; $('#resourceKicker').textContent = `${resource.title} / SURFACE PROFILE`; $('#resourceTitle').textContent = resource.title; $('#resourceDescription').textContent = resource.description; $('#resourceDetails').textContent = resource.details; $('#resourceLink').href = resource.link; $('#resourceModal').hidden = false; }
function closeModals() { document.querySelectorAll('.modal-overlay').forEach((modal) => { modal.hidden = true; }); }

function openThemeCreator() {
  const palette = themeCache[activeThemeName] || { bg:'06080f', white:'e6eeff', acid_green:'c6ff45', hot_pink:'ff2d9e', purple:'b57bff', cyan:'22e6ff', orange:'ff9142', red:'ff3b52', panel:'0c1120', line:'20305c', muted:'8b97c9' };
  $('#customThemeName').value = activeThemeName.startsWith('custom:') ? activeThemeName.slice(7) : `custom-${activeThemeName}`;
  $('#swatchEditor').innerHTML = COLOR_ROLES.map((role) => `<label class="swatch-field"><input type="color" data-role="${role}" value="#${palette[role]}"><span>${role.toUpperCase()}</span></label>`).join('');
  $('#themeCreator').hidden = false;
}
function editorPalette() { return Object.fromEntries([...document.querySelectorAll('#swatchEditor input')].map((input) => [input.dataset.role, input.value.replace('#','')])); }
function saveCustomTheme() { const name = slug($('#customThemeName').value.trim() || 'custom-theme'); const themes = JSON.parse(localStorage.getItem('cybercore-custom-themes') || '{}'); themes[name] = editorPalette(); localStorage.setItem('cybercore-custom-themes', JSON.stringify(themes)); themeCache[`custom:${name}`] = themes[name]; themeIndex[`custom:${name}`] = 'custom'; renderThemeDropdown(); applyTheme(`custom:${name}`); closeModals(); }
function exportCustomTheme() { const name = slug($('#customThemeName').value.trim() || 'custom-theme'); const blob = new Blob([JSON.stringify(editorPalette(), null, 2)], { type:'application/json' }); const link = document.createElement('a'); link.href = URL.createObjectURL(blob); link.download = `${name}.json`; link.click(); URL.revokeObjectURL(link.href); }

async function loadSchema() {
  let schemaLoaded = false;
  try { const response = await fetch('data/cybergrid.json'); if (response.ok) { schema = await response.json(); schemaLoaded = true; } } catch (error) { console.info('Using embedded Cybergrid fallback.', error); }
  Object.entries(schema.families).forEach(([family, names]) => names.forEach((name) => { themeIndex[name] = family; }));
  for (const [name, palette] of Object.entries(JSON.parse(localStorage.getItem('cybercore-custom-themes') || '{}'))) { themeCache[`custom:${name}`] = palette; themeIndex[`custom:${name}`] = 'custom'; }
  const activePalette = await getPalette(schema.active); themeCache[schema.active] = activePalette;
  const sourceThemeCount = Object.values(schema.families).flat().filter((name) => name !== 'cybercore-tech').length;
  const themeCount = Object.values(schema.families).flat().length;
  $('#schemaVersion').textContent = schema.schema_version; $('#themeCount').textContent = `${sourceThemeCount}+1`; $('#systemCount').textContent = PROJECTS.length;
  $('#surfaceStatus').textContent = navigator.onLine ? 'SURFACE ONLINE' : 'LOCAL MODE';
  $('#surfaceChecked').textContent = `LAST CHECK ${new Date().toISOString().replace('T', ' ').replace(/\.\d{3}Z$/, 'Z')}`;
  $('#statusSchema').textContent = schemaLoaded ? `V${schema.schema_version} READY` : 'FALLBACK READY';
  $('#statusThemes').textContent = `${sourceThemeCount} + BRAND MIX`;
  $('#statusSystems').textContent = `${PROJECTS.length} INDEXED`;
  renderThemeDropdown(); const requested = new URLSearchParams(location.search).get('theme'); const saved = localStorage.getItem('cybercore-theme'); const selected = themeIndex[requested] ? requested : (themeIndex[saved] ? saved : schema.active); await applyTheme(selected, false);
}

$('#themePickerButton').addEventListener('click', (event) => { event.stopPropagation(); $('#themeDropdown').hidden ? openThemeDropdown() : closeThemeDropdown(); });
$('#themeDropdown').addEventListener('click', async (event) => { const item = event.target.closest('.theme-item'); if (!item) return; const name = item.dataset.theme; closeThemeDropdown(); if (name.startsWith('custom:')) await applyTheme(name); else await applyTheme(name); });
document.addEventListener('click', (event) => { if (!event.target.closest('.theme-picker-wrap')) closeThemeDropdown(); });
$('#openThemeCreator').addEventListener('click', openThemeCreator);
$('#saveTheme').addEventListener('click', saveCustomTheme); $('#exportTheme').addEventListener('click', exportCustomTheme); $('#resetTheme').addEventListener('click', openThemeCreator);
$('#showMore').addEventListener('click', () => { showAll = !showAll; renderProjects(); });
document.querySelectorAll('.filter').forEach((button) => button.addEventListener('click', () => { document.querySelectorAll('.filter').forEach((item) => item.classList.remove('active')); button.classList.add('active'); activeFilter = button.dataset.filter; renderProjects(); }));
$('#projectGrid').addEventListener('click', (event) => { const button = event.target.closest('[data-project]'); if (button) openProjectModal(Number(button.dataset.project)); });
document.querySelectorAll('[data-resource]').forEach((button) => button.addEventListener('click', () => openResourceModal(button.dataset.resource)));
document.querySelectorAll('[data-close-modal]').forEach((button) => button.addEventListener('click', closeModals));
document.querySelectorAll('.modal-overlay').forEach((overlay) => overlay.addEventListener('click', (event) => { if (event.target === overlay) closeModals(); }));
document.addEventListener('keydown', (event) => { if (event.key === 'Escape') { closeModals(); closeThemeDropdown(); } });
$('#copyInstall').addEventListener('click', async () => { await navigator.clipboard.writeText('cargo add cybercore --git https://github.com/cybercore-tech/cybercore'); $('#copyInstall').textContent = 'COPIED'; setTimeout(() => { $('#copyInstall').textContent = 'COPY'; }, 1400); });
$('#projectForm').addEventListener('submit', (event) => { event.preventDefault(); const data = new FormData(event.currentTarget); const subject = `Cybercore Tech project inquiry — ${data.get('type')}`; const body = [`NAME: ${data.get('name')}`, `EMAIL: ${data.get('email')}`, `PROJECT TYPE: ${data.get('type')}`, '', 'BRIEF:', data.get('brief')].join('\n'); window.location.href = `mailto:dev@cybercoretech.net?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`; const button = event.currentTarget.querySelector('button[type="submit"]'); button.textContent = 'INQUIRY PREPARED'; setTimeout(() => { button.textContent = 'PREPARE INQUIRY ↗'; }, 2200); });
[['#framework .eyebrow','02 / THE FOUNDATION'], ['#systems .eyebrow','03 / THE ECOSYSTEM'], ['.architecture-section .eyebrow','04 / HOW IT CONNECTS'], ['#about .eyebrow','05 / ABOUT CYBERCORE TECH'], ['#services .eyebrow','06 / SERVICES'], ['#proof .eyebrow','07 / QUALITY SYSTEM'], ['#work .eyebrow','08 / SELECTED BUILDS'], ['#connect .eyebrow','09 / CONNECT']].forEach(([selector, label]) => { const element = $(selector); if (element) element.textContent = label; });
document.querySelector('.menu-button').addEventListener('click', (event) => { const open = event.currentTarget.getAttribute('aria-expanded') === 'true'; event.currentTarget.setAttribute('aria-expanded', String(!open)); document.querySelector('.main-nav').classList.toggle('mobile-open', !open); });
const scrollToHash = () => { if (!location.hash) return; const target = document.querySelector(location.hash); if (target) target.scrollIntoView({ block:'start' }); };
renderProjects(); loadSchema().then(() => setTimeout(scrollToHash, 0));

let pointerFrame = 0;
window.addEventListener('pointermove', (event) => {
  if (pointerFrame) return;
  pointerFrame = requestAnimationFrame(() => {
    document.documentElement.style.setProperty('--pointer-x', `${event.clientX}px`);
    document.documentElement.style.setProperty('--pointer-y', `${event.clientY}px`);
    pointerFrame = 0;
  });
}, { passive: true });
