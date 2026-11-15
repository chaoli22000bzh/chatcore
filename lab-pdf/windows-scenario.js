/* Copie de test autonome extraite de chaoli22000bzh/C2 (tps/D3-02/js/windows-scenario.js), SHA 54998131fb70e2901a74fea8ee57ebf493242eb0. Ne pas modifier C2 depuis ce laboratoire. */
/* Scénario Windows C² — D3-01 : Association de .pdf */
(()=>{'use strict';
function orangeInvoice({mode,app}){
 const bad=mode==='print'&&app==='chrome';
 const mild=mode==='screen'&&app==='chrome';
 let body=`<div class="d301-invoice ${bad?'is-bad':(mild?'is-mild-bad':'')}">
 <header><div class="d301-orange">orange™</div><div><h2>Votre facture</h2><b>services mobiles Orange Business</b></div><aside>n° de facture : <b>OB-260901</b><br>date : <b>01/09/2026</b></aside></header>
 <div class="d301-cols"><section><h4>Vos coordonnées</h4><p>CyberNet Los Angeles<br>Succursale France<br>42 rue de la Clarté Numérique<br>35700 RENNES<br>France</p><p>n° client : <b>700 123 456</b><br>n° de compte : <b>701234567</b></p></section><section class="contact"><h4>Orange disponible pour vous</h4><p>Sur Internet : business.orange.fr/mon-espace</p><p>Par téléphone : <b>3000</b><br>assistance technique 24h/7j</p></section></div>
 <h3>détail de votre facture</h3><table><tr><th>abonnements, forfaits et options</th><th>période</th><th>coût HT</th></tr><tr><td>Business Mobile 20 Go</td><td>01/09/2026 - 30/09/2026</td><td>18,00 €</td></tr><tr><td>Business Mobile 120 Go</td><td>01/09/2026 - 30/09/2026</td><td>58,00 €</td></tr></table><div class="total">total HT　76,00 €<br>TVA (20,00 %)　15,20 €<br><b>total TTC　91,20 €</b></div><footer>Orange, partenaire de votre réussite <span>page 1/2</span></footer></div>`;
 if(mild)body=body.replace('Votre facture','Votre factur€').replace('Orange disponible pour vous','Orange disponible  pour vous').replace('42 rue de la Clarté Numérique','42 rue de la Clarté  Numérique');
 if(bad)body=body.replaceAll('a','@').replaceAll('e','€');
 return body;
}
const scenario={
 computer:'PC-SMARTIN',
 printer:'HP LaserJet - Rennes',
 association:{'.pdf':'chrome'},
 apps:[
  {id:'chrome',label:'Google Chrome',icon:'chrome',kind:'browser'},
  {id:'reader',label:'Adobe Acrobat Reader',icon:'reader',kind:'reader'},
  {id:'teams',label:'Microsoft Teams',icon:'teams',kind:'generic'}
 ],
 files:[
  {name:'factureorange.pdf',icon:'pdf',meta:'Document PDF · 2 pages',render:orangeInvoice},
  {name:'planning_reunion.pdf',icon:'pdf',meta:'Document PDF · 1 page',render:()=>'<div class="c2win-paper"><h2>Planning de réunion</h2><p>Lundi 9 h 30 — équipe technique</p><p>Mardi 14 h — suivi clients</p></div>'},
  {name:'attestation_mutuelle.pdf',icon:'pdf',meta:'Document PDF · 1 page',render:()=>'<div class="c2win-paper"><h2>Attestation</h2><p>Document administratif.</p></div>'},
  {name:'notes_reunion.docx',icon:'file',meta:'Document Microsoft Word · 3 pages',defaultApp:'word'},
  {name:'photo_badge.jpg',icon:'file',meta:'Image JPEG · 842 Ko',defaultApp:'photos'}
 ]
};
window.C2WindowsScenarios=window.C2WindowsScenarios||{};window.C2WindowsScenarios.D301=scenario;
window.c2MountD301=function(root){return new C2Windows11(root,scenario)};
})();