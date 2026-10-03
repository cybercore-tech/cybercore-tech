// Local, deterministic Cybergrid contract simulation. No shell or server mutations.
const labInput = document.querySelector('#labInput');
const defaultConfig = { schema_version: 2, theme: 'cybercore-tech', paths: { config: '/home/operator/.config/cybercore', artifacts: '/home/operator/builds' } };
let revision = 1, scannedRevision = 0, labFormat = 'terminal', diagnostics = [], repair = null;
const labSet = config => { labInput.value = JSON.stringify(config, null, 2); revision++; document.querySelector('#labRevision').textContent = `r${revision}`; };
labInput.value = JSON.stringify(defaultConfig, null, 2);
function renderLab() {
 const result = document.querySelector('#labResult');
 result.textContent = labFormat === 'json' ? JSON.stringify({revision: scannedRevision, diagnostics}, null, 2) : [`CYBERGRID / CONTRACT SCAN / r${scannedRevision}`, '', ...diagnostics.map(d => `${d.severity === 'error' ? '×' : '✓'} ${d.code}  ${d.message}\n  ${d.help || 'Contract satisfied.'}`)].join('\n\n');
}
function scanLab() {
 scannedRevision = revision; diagnostics = []; repair = null;
 try {
  const config = JSON.parse(labInput.value);
  if (!config || typeof config !== 'object' || Array.isArray(config)) throw new Error('Root must be a JSON object.');
  const proposed = structuredClone(config);
  if (config.schema_version !== 2) { diagnostics.push({ severity:'error',code:'GRID-001',message:'Schema version must be 2.',help:'Set schema_version to 2.' }); proposed.schema_version = 2; }
  if (!Object.hasOwn(themeIndex,config.theme)) { diagnostics.push({severity:'error',code:'GRID-002',message:'Theme is not in the loaded registry.',help:'Choose a registered theme.'}); proposed.theme = schema.active; }
  if (!config.paths || typeof config.paths !== 'object' || Array.isArray(config.paths)) proposed.paths = {};
  for (const key of ['config','artifacts']) if (typeof config.paths?.[key] !== 'string' || !config.paths[key].startsWith('/')) { diagnostics.push({severity:'error',code:'GRID-003',message:`paths.${key} must be an absolute path.`,help:`Use an absolute ${key} path.`}); proposed.paths[key] = defaultConfig.paths[key]; }
  if (diagnostics.length) repair = proposed;
  else diagnostics.push({severity:'ok',code:'GRID-OK',message:'All configuration contracts passed.'});
 } catch(error) { diagnostics.push({severity:'error',code:'GRID-JSON',message:'Cannot parse configuration.',help:error.message}); }
 document.querySelector('#labState').textContent = diagnostics.some(d=>d.severity==='error') ? 'FAULT DETECTED' : 'CONTRACT VALID';
 document.querySelector('#fixLab').disabled = !repair;
 document.querySelector('#labGuard').textContent = repair ? `Repair bound to r${scannedRevision}.` : 'No automatic repair prepared.';
 renderLab();
}
labInput.addEventListener('input',()=>{revision++;document.querySelector('#labRevision').textContent=`r${revision}`;document.querySelector('#labState').textContent='UNSCANNED CHANGES';document.querySelector('#labGuard').textContent=repair?'Buffer changed. Previous repair is stale.':'Scan to prepare a repair.';});
document.querySelector('#scanLab').addEventListener('click',scanLab);
document.querySelector('#breakLab').addEventListener('click',()=>{labSet({...defaultConfig,schema_version:0,theme:'unknown-signal',paths:{config:'relative/path',artifacts:defaultConfig.paths.artifacts}});scanLab();});
document.querySelector('#resetLab').addEventListener('click',()=>{labSet(defaultConfig);scanLab();});
document.querySelector('#fixLab').addEventListener('click',()=>{
 if (!repair) return;
 if (scannedRevision !== revision) {document.querySelector('#labState').textContent='STALE REPAIR REJECTED';document.querySelector('#labGuard').textContent='Nothing changed. Scan again to bind a new repair.';return;}
 labSet(repair);scanLab();document.querySelector('#labGuard').textContent='Repair applied and contract rechecked.';
});
const labTabs = [...document.querySelectorAll('[data-lab-tab]')];
function selectLabTab(button){labFormat=button.dataset.labTab;labTabs.forEach(b=>{b.setAttribute('aria-selected',String(b===button));b.tabIndex=b===button?0:-1;});document.querySelector('#labResult').setAttribute('aria-labelledby',button.id);renderLab();}
labTabs.forEach((button,index)=>{button.addEventListener('click',()=>selectLabTab(button));button.addEventListener('keydown',event=>{if(['ArrowLeft','ArrowRight','Home','End'].includes(event.key)){event.preventDefault();const next=event.key==='Home'?0:event.key==='End'?labTabs.length-1:(index+(event.key==='ArrowRight'?1:-1)+labTabs.length)%labTabs.length;selectLabTab(labTabs[next]);labTabs[next].focus();}});});
schemaReady.then(scanLab);
const systemSearch = document.querySelector('#systemSearch');
systemSearch.addEventListener('input',()=>{showAll=!!systemSearch.value.trim();renderProjects();});
const commandDialog = document.querySelector('#commandDialog');
const commandInput = document.querySelector('#commandInput');
const destinations = [{name:'System lab',section:'lab'},{name:'Framework',section:'framework'},{name:'System inventory',section:'systems'},{name:'Selected work',section:'work'},{name:'Services',section:'services'},{name:'Start a project',section:'connect'},...PROJECTS.map((p,index)=>({name:p[0],index,category:p[1]}))];
function renderCommands(){const query=commandInput.value.toLowerCase().trim();const results=document.querySelector('#commandResults');results.replaceChildren();const matches=destinations.filter(d=>`${d.name} ${d.category||''}`.toLowerCase().includes(query));if(!matches.length){const p=document.createElement('p');p.textContent='No matching systems or sections.';results.append(p);}for(const item of matches){const button=document.createElement('button');button.type='button';const name=document.createElement('span');name.textContent=item.name;const label=document.createElement('small');label.textContent=item.category||'SECTION';button.append(name,label);button.addEventListener('click',()=>{commandDialog.close();if(item.section)document.getElementById(item.section).scrollIntoView({behavior:'smooth'});else openProjectModal(item.index);});results.append(button);}}
function openCommand(){commandInput.value='';renderCommands();commandDialog.showModal();commandInput.focus();}
document.querySelector('#openCommand').addEventListener('click',openCommand);document.querySelector('#closeCommand').addEventListener('click',()=>commandDialog.close());commandInput.addEventListener('input',renderCommands);commandInput.addEventListener('keydown',event=>{if(event.key==='Enter'){event.preventDefault();document.querySelector('#commandResults button')?.click();}if(event.key==='ArrowDown'){event.preventDefault();document.querySelector('#commandResults button')?.focus();}});commandDialog.addEventListener('click',event=>{if(event.target===commandDialog){const r=commandDialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)commandDialog.close();}});
document.addEventListener('keydown',event=>{if((event.metaKey||event.ctrlKey)&&event.key.toLowerCase()==='k'){event.preventDefault();if(commandDialog.open)commandDialog.close();else openCommand();}});
// Existing detail overlays: focus containment, Escape, and focus restoration.
let modalReturnFocus = null;
const modalObserver = new MutationObserver(records=>{for(const record of records){const overlay=record.target;if(!overlay.hidden){modalReturnFocus=document.activeElement;overlay.querySelector('button,input,a[href]')?.focus();}else if(modalReturnFocus?.isConnected){modalReturnFocus.focus();}}});
document.querySelectorAll('.modal-overlay').forEach(overlay=>{modalObserver.observe(overlay,{attributes:true,attributeFilter:['hidden']});overlay.addEventListener('keydown',event=>{if(event.key!=='Tab')return;const controls=[...overlay.querySelectorAll('button,input,select,textarea,a[href],[tabindex="0"]')].filter(e=>!e.hidden&&!e.disabled&&e.getClientRects().length);const first=controls[0],last=controls.at(-1);if(event.shiftKey&&document.activeElement===first){event.preventDefault();last?.focus();}else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first?.focus();}});});
document.querySelectorAll('.main-nav a').forEach(a=>a.addEventListener('click',()=>{document.querySelector('.main-nav').classList.remove('mobile-open');document.querySelector('.menu-button').setAttribute('aria-expanded','false');}));
// Instrument panel interactions and bounded motion.
const eventStream = document.querySelector('#eventStream');
const logEvent = message => { eventStream.textContent = `${new Date().toLocaleTimeString('en-GB')} / ${message}`; };
logEvent('CYBERGRID READY · SELECT A NODE OR RUN A SCAN');
const nodeReadouts = {
 schema:()=>`SCHEMA / v${schema.schema_version}\n${PROJECTS.length} indexed systems · ${Object.keys(themeIndex).length} registered palettes\nContract → data/cybergrid.json`,
 tokens:()=>`DESIGN TOKENS / SHARED SURFACE\nType → Oxanium / IBM Plex Sans / JetBrains Mono\nPalette → ${displayTheme(activeThemeName)}`,
 paths:()=>`CANONICAL PATHS / SOURCE\nSchema → data/cybergrid.json\nPalettes → data/themes/ · Identity → assets/identity/`
};
document.querySelectorAll('[data-core-view]').forEach(button=>button.addEventListener('click',()=>{document.querySelectorAll('[data-core-view]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));document.querySelector('#coreReadout').textContent=nodeReadouts[button.dataset.coreView]();logEvent(`${button.dataset.coreView.toUpperCase()} CONTRACT INSPECTED`);}));
['scanLab','breakLab','fixLab','resetLab'].forEach(id=>document.getElementById(id).addEventListener('click',()=>logEvent(document.querySelector('#labState').textContent)));
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)');
const heroSurface = document.querySelector('.hero');
heroSurface.addEventListener('pointermove',event=>{if(reduceMotion.matches||event.pointerType==='touch')return;const box=heroSurface.getBoundingClientRect();heroSurface.style.setProperty('--reactor-x',`${((event.clientX-box.left)/box.width-.5)*12}px`);heroSurface.style.setProperty('--reactor-y',`${((event.clientY-box.top)/box.height-.5)*10}px`);});
const projectSurface = document.querySelector('#projectGrid');
projectSurface.addEventListener('pointermove',event=>{if(reduceMotion.matches||event.pointerType==='touch')return;const card=event.target.closest('.project-card');if(!card)return;const box=card.getBoundingClientRect();const x=(event.clientX-box.left)/box.width,y=(event.clientY-box.top)/box.height;card.style.setProperty('--card-x',`${x*100}%`);card.style.setProperty('--card-y',`${y*100}%`);card.style.setProperty('--tilt-x',`${(y-.5)*-5}deg`);card.style.setProperty('--tilt-y',`${(x-.5)*5}deg`);});
projectSurface.addEventListener('pointerout',event=>{const card=event.target.closest('.project-card');if(card&&!card.contains(event.relatedTarget)){card.style.setProperty('--tilt-x','0deg');card.style.setProperty('--tilt-y','0deg');}});
if(!reduceMotion.matches){const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('revealed');observer.unobserve(entry.target);}}),{threshold:.05});document.querySelectorAll('.section-heading,.foundation-grid,.lab-grid,.case-study-grid').forEach(element=>{element.classList.add('reveal-ready');observer.observe(element);});}
