/* Copie de test autonome extraite de chaoli22000bzh/C2 (assets/windows-c2/windows-c2.js), SHA c4a5ad54a5ba535e13d12b9648cb85d1e6c75f9b. Ne pas modifier C2 depuis ce laboratoire. */
/* Windows C² — moteur commun réutilisable
 * Le TP fournit son scénario; ce fichier fournit le poste Windows, les fenêtres,
 * l'Explorateur, les applications, les états et les traces.
 */
(()=>{'use strict';
class C2Windows11{
 constructor(root,scenario={}){
  this.root=typeof root==='string'?document.querySelector(root):root;
  this.scenario=scenario;this.state={connected:false,association:{...(scenario.association||{})},trace:[],openWindow:null,currentFile:null,currentApp:null};
  if(!this.root)throw new Error('Windows C²: conteneur absent');
  this.render();this.bind();
 }
 emit(type,detail={}){const e={type,at:Date.now(),...detail};this.state.trace.push(e);this.root.dispatchEvent(new CustomEvent('c2win:'+type,{bubbles:true,detail:e}));}
 app(id){return (this.scenario.apps||[]).find(a=>a.id===id)}
 file(name){return (this.scenario.files||[]).find(f=>f.name===name)}
 render(){
  const apps=this.scenario.apps||[];
  this.root.classList.add('c2win');
  this.root.innerHTML=`
  <div class="c2win-remote"><b>PRISE EN MAIN À DISTANCE</b><strong>${this.scenario.computer||'PC-DISTANT'} · Windows 11</strong><span>● Connecté</span></div>
  <div class="c2win-desktop">
   <div class="c2win-icons">
    <button data-c2="explorer"><i class="c2ico folder"></i><span>Documents</span></button>
    ${apps.filter(a=>a.desktop!==false).map(a=>`<button data-app="${a.id}"><i class="c2ico ${a.icon||a.id}"></i><span>${a.label}</span></button>`).join('')}
    <button data-c2="trash"><i class="c2ico trash">🗑</i><span>Corbeille</span></button>
   </div>
   <div class="c2win-stage"></div>
   <div class="c2win-start" hidden><div class="c2win-search">🔎 Rechercher des applications</div>${apps.map(a=>`<button data-app="${a.id}"><i class="c2ico ${a.icon||a.id}"></i>${a.label}</button>`).join('')}<button data-c2="settings"><i class="c2ico settings">⚙</i>Paramètres</button></div>
   <div class="c2win-taskbar"><button data-c2="start" class="c2win-taskicon" aria-label="Démarrer"><svg class="c2win-tasksvg" viewBox="0 0 64 64" aria-hidden="true"><path fill="#25a9e0" d="M5 6h25v24H5z"/><path fill="#0786d5" d="M34 6h25v24H34z"/><path fill="#168fd7" d="M5 34h25v24H5z"/><path fill="#087bd1" d="M34 34h25v24H34z"/></svg></button><button data-c2="explorer" class="c2win-taskicon" aria-label="Explorateur de fichiers"><svg class="c2win-tasksvg" viewBox="0 0 64 64" aria-hidden="true"><path fill="#dda000" d="M6 15c0-4 3-7 7-7h14l8 8h16c4 0 7 3 7 7v5H6z"/><path fill="#ffd04b" d="M6 25c0-4 3-7 7-7h38c4 0 7 3 7 7v25c0 4-3 7-7 7H13c-4 0-7-3-7-7z"/><path fill="#147fd0" d="M23 47c0-4 3-7 7-7h12c4 0 7 3 7 7v10H23z"/><path fill="#3155a4" d="M29 44h14v3H29z"/></svg></button><span></span><time>09:58<small>04/10/2026</small></time></div>
   <div class="c2win-toast" hidden></div>
  </div>`;
 }
 bind(){
  this.root.addEventListener('click',e=>{
   const close=e.target.closest('[data-close]');if(close){this.close();return}
   const f=e.target.closest('[data-file]');if(f){this.openFile(f.dataset.file,f.dataset.with||'');return}
   const x=e.target.closest('[data-c2]');
   if(!x){const a=e.target.closest('[data-app]');if(a){this.openApp(a.dataset.app)}return}
   const act=x.dataset.c2;
   if(act==='start'){const m=this.root.querySelector('.c2win-start');m.hidden=!m.hidden}
   else if(act==='explorer')this.explorer();
   else if(act==='settings')this.settings();
   else if(act==='print')this.printPreview(x.dataset.app||this.state.currentApp);
   else if(act==='open-dialog')this.explorer(x.dataset.app||'');
   else if(act==='settings-installed')this.settingsInstalled();
   else if(act==='settings-defaults')this.settingsDefaults();
   else if(act==='assoc-menu')this.associationMenu(x.dataset.ext);
   else if(act==='associate')this.setAssociation(x.dataset.ext,x.dataset.app);
   else if(act==='trash')this.toast('La Corbeille est vide.');
  });
 }
 window(title,body,cls=''){this.root.querySelector('.c2win-start').hidden=true;const s=this.root.querySelector('.c2win-stage');s.innerHTML=`<section class="c2win-window ${cls}"><header><span>${title}</span><button data-close>×</button></header>${body}</section>`;this.state.openWindow=title}
 close(){this.root.querySelector('.c2win-stage').innerHTML='';this.state.openWindow=null}
 explorer(openWith=''){
  const files=this.scenario.files||[];
  this.window('📁 Documents',`<div class="c2win-explorerbar">Accueil　 Trier　 Afficher</div><div class="c2win-files">${files.map(f=>`<button data-file="${f.name}" ${openWith?`data-with="${openWith}"`:''}><i class="c2ico ${this.fileIcon(f)}"></i><span><b>${f.name}</b><small>${f.meta||this.meta(f.name)}</small></span></button>`).join('')}</div>`,'explorer');
  this.emit('explorer',{openWith});
 }
 fileIcon(f){const n=f.name||'';const ext='.'+n.split('.').pop().toLowerCase();const associated=this.state.association[ext];return associated?(this.app(associated)?.icon||associated):(f.icon||this.extIcon(n))}
 extIcon(n){return n.toLowerCase().endsWith('.pdf')?'pdf':'file'}
 meta(n){return n.toLowerCase().endsWith('.pdf')?'Document PDF':'Fichier'}
 openApp(id){
  const a=this.app(id);if(!a)return this.toast('Application indisponible.');
  this.state.currentApp=id;this.emit('app-open',{app:id});
  if(a.kind==='reader')this.reader(a);
  else if(a.kind==='browser')this.browser(a);
  else if(a.kind==='settings')this.settings();
  else this.window(a.label,`<div class="c2win-appempty"><i class="c2ico ${a.icon||id}"></i><h2>${a.label}</h2><p>Application ouverte.</p></div>`);
 }
 browser(a,file=null){
  const body=file?this.documentView(file,a.id):`<div class="c2win-browserhome"><i class="c2ico chrome big"></i><h2>${a.label}</h2><div>Rechercher sur Google ou saisir une URL</div></div>`;
  this.window(`${a.label}${file?' · '+file.name:''}`,`<div class="c2win-browserbar"><span>←　→　↻</span><div>${file?'Fichier local · '+file.name:'Nouvel onglet'}</div><button data-c2="open-dialog" data-app="${a.id}">📂 Ouvrir</button>${file?'<button data-c2="print" data-app="'+a.id+'">🖨 Aperçu avant impression</button>':''}</div>${body}`,'browser');
 }
 reader(a,file=null){
  if(!file){this.window(a.label,`<div class="c2win-readerbar"><b>${a.label}</b><button data-c2="open-dialog" data-app="${a.id}">📂 Ouvrir</button></div><div class="c2win-readerhome"><nav><b>Accueil</b><span>Récents</span><span>Favoris</span><h5>Fichiers</h5><span>Vos documents</span><span>Votre ordinateur</span></nav><main><h2>Bienvenue dans Acrobat Reader</h2><div class="c2win-tools"><span>Ajouter des commentaires</span><span>Remplir et signer</span><span>Partager</span><span>Exporter un PDF</span></div><h3>Récents</h3><p>Aucun document récent dans cette session.</p></main></div>`,'reader');return}
  this.window(`${a.label} · ${file.name}`,`<div class="c2win-readerbar"><b>${a.label}</b><button data-c2="open-dialog" data-app="${a.id}">📂 Ouvrir</button><button data-c2="print" data-app="${a.id}">🖨 Aperçu avant impression</button></div>${this.documentView(file,a.id)}`,'reader');
 }
 openFile(name,forced=''){
  const f=this.file(name);if(!f)return;
  const ext='.'+name.split('.').pop().toLowerCase(),app=forced||this.state.association[ext]||f.defaultApp||'';
  this.state.currentFile=name;this.state.currentApp=app;this.emit('file-open',{file:name,app});
  const a=this.app(app);if(!a)return this.toast('Aucune application associée à ce fichier.');
  if(a.kind==='reader')this.reader(a,f);else if(a.kind==='browser')this.browser(a,f);else this.openApp(app);
 }
 documentView(f,app){
  const content=typeof f.render==='function'?f.render({mode:'screen',app,state:this.state}):(f.html||'<div class="c2win-paper"><h2>'+f.name+'</h2></div>');
  return `<div class="c2win-document">${content}</div>`;
 }
 printPreview(app){
  const f=this.file(this.state.currentFile);if(!f)return;
  const content=typeof f.render==='function'?f.render({mode:'print',app,state:this.state}):(f.html||'');
  this.emit('print-preview',{file:f.name,app});
  this.window(`Aperçu avant impression · ${f.name}`,`<div class="c2win-printbar"><span>Imprimante : <b>${this.scenario.printer||'HP LaserJet - Rennes'}</b></span><button>Imprimer</button></div><div class="c2win-preview">${content}</div>`,'print');
 }
 settings(){
  this.window('⚙ Paramètres',`<div class="c2win-settings"><nav><h3>Paramètres</h3><span>Système</span><span>Bluetooth et appareils</span><span>Réseau et Internet</span><span>Personnalisation</span><b>Applications</b><span>Comptes</span><span>Heure et langue</span><span>Accessibilité</span><span>Confidentialité et sécurité</span><span>Windows Update</span></nav><main><h2>Applications</h2><button class="c2win-settingcard" data-c2="settings-installed"><b>Applications installées</b><small>Désinstaller et gérer les applications</small><em>›</em></button><button class="c2win-settingcard" data-c2="settings-defaults"><b>Applications par défaut</b><small>Définir les valeurs par défaut pour les types de fichiers</small><em>›</em></button><div class="c2win-settingcard muted"><b>Paramètres avancés des applications</b><small>Choisir où obtenir les applications et gérer les fonctionnalités</small></div></main></div>`,'settings');
  this.emit('settings-open');
 }
 settingsInstalled(){
  const apps=(this.scenario.apps||[]).map(a=>`<div class="c2win-installed"><i class="c2ico ${a.icon||a.id}"></i><span><b>${a.label}</b><small>Application installée</small></span><button>⋯</button></div>`).join('');
  this.window('Paramètres · Applications installées',`<div class="c2win-settings"><nav><h3>Paramètres</h3><span>Système</span><b>Applications</b><span>Comptes</span><span>Accessibilité</span><span>Windows Update</span></nav><main><button class="c2win-back" data-c2="settings">← Applications</button><h2>Applications installées</h2><div class="c2win-settings-search">🔎 Rechercher dans les applications</div>${apps}</main></div>`,'settings');
  this.emit('installed-apps-view');
 }
 settingsDefaults(){
  const assoc=Object.entries(this.state.association).map(([ext,app])=>`<div class="c2win-assoc"><b>${ext}</b><button data-c2="assoc-menu" data-ext="${ext}"><i class="c2ico ${this.app(app)?.icon||app}"></i>${this.app(app)?.label||app}</button></div>`).join('');
  this.window('Paramètres · Applications par défaut',`<div class="c2win-settings"><nav><h3>Paramètres</h3><span>Système</span><b>Applications</b><span>Comptes</span><span>Accessibilité</span><span>Windows Update</span></nav><main><button class="c2win-back" data-c2="settings">← Applications</button><h2>Applications par défaut</h2><div class="c2win-settings-search">🔎 Rechercher un type de fichier ou une application</div><p>Définissez les valeurs par défaut pour les types de fichiers.</p>${assoc}</main></div>`,'settings');
  this.emit('defaults-view');
  Object.entries(this.state.association).forEach(([ext,app])=>this.emit('association-view',{ext,current:app,source:'defaults'}));
 }
 associationMenu(ext){
  const choices=(this.scenario.apps||[]).filter(a=>['browser','reader'].includes(a.kind));
  const current=this.state.association[ext];
  this.window('Choisir une application par défaut',`<div class="c2win-choose"><h2>Comment voulez-vous ouvrir les fichiers ${ext} ?</h2>${choices.map(a=>`<button data-c2="associate" data-ext="${ext}" data-app="${a.id}"><i class="c2ico ${a.icon||a.id}"></i><span><b>${a.label}</b><small>${a.id===current?'Application actuelle':'Définir par défaut'}</small></span></button>`).join('')}</div>`,'choose');
  this.emit('association-view',{ext,current});
 }
 setAssociation(ext,app){this.state.association[ext]=app;this.emit('association-change',{ext,app});this.settings()}
 toast(t){const x=this.root.querySelector('.c2win-toast');x.textContent=t;x.hidden=false;clearTimeout(x._t);x._t=setTimeout(()=>x.hidden=true,1800)}
 getTrace(){return [...this.state.trace]}
 has(type,predicate=()=>true){return this.state.trace.some(e=>e.type===type&&predicate(e))}
}
window.C2Windows11=C2Windows11;
})();