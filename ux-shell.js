/* LCpro T Mission Control · Clarity UX shell 1.4
 * Only changes navigation and presentation; does not alter experiment data or analysis.
 */
(function(){'use strict';
const $=id=>document.getElementById(id);
const stages=['Scheda','Sequenza SQS','Camera','Acclimatazione','Acquisizione','Importazione CSV','Controllo qualità','Curve Lab','Report e backup'];
const escapeHTML=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const existing=window.switchLab;
let active='home';
function get(){return window.LCResearch?.getState?.()||{};}
function status(){
 const s=get().session,host=$('uxCurrent'),continueButton=$('uxContinue'),desc=$('uxContinueDesc');
 if(!host)return;
 if(!s){host.innerHTML='<b>Nessun esperimento aperto.</b> Inizia una nuova scheda o carica un CSV già acquisito.';continueButton.disabled=true;desc.textContent='Crea prima una scheda sperimentale.';return;}
 continueButton.disabled=false;
 const n=Math.min(8,Math.max(0,Number(s.workflow?.at||0)));
 const done=s.workflow?.done?.length||0;
 const name=[s.meta?.plant,s.meta?.species].filter(Boolean).join(' · ')||'Esperimento senza ID';
 const file=s.rawCsv?' · CSV collegato':' · CSV non ancora caricato';
 const at=stages[n];
 host.innerHTML='<b>'+escapeHTML(name)+'</b>'+escapeHTML(file)+'<div>Passaggio corrente: <strong>'+escapeHTML(at)+'</strong> · '+done+' / 9 verifiche dichiarate.</div>';
 desc.textContent='Torna a '+at+' e continua con le verifiche.';
}
function stageStatus(){const e=$('uxStageSummary');if(!e)return;const s=get().session;
 if(!s){e.textContent='Crea un esperimento per iniziare le verifiche.';return;}
 const at=Math.min(8,Math.max(0,Number(s.workflow?.at||0)));
 const phase=at<=3?'Preparazione':at===4?'Misura':'Analisi e archiviazione';
 e.textContent='Fase: '+phase+' · Passaggio '+(at+1)+' di 9 · '+stages[at];
}
function go(name){
 if(name==='home'){
  active='home';
  document.querySelectorAll('.lab-panel').forEach(el=>el.hidden=el.id!=='lab-home');
  for(const el of document.querySelectorAll('#modeChooser,#modebar,.beginner-only,#expertArea'))el.classList.add('lab-hidden');
  document.querySelectorAll('.lab-tab').forEach(b=>b.classList.remove('selected'));
 }else{
  $('lab-home').hidden=true;
  if(typeof existing==='function')existing(name);
  // Guard may redirect to protocol; always reflect the actual visible panel.
  const visible=['protocol','wizard','sequence','analysis','compare','log','health','research-curves','report'].find(k=>!$('lab-'+k)?.hidden);
  active=name==='guide'||!visible?name:visible;
 }
 document.querySelectorAll('[data-ux-go]').forEach(b=>{const on=b.dataset.uxGo===active;b.classList.toggle('active',on);if(on)b.setAttribute('aria-current','page');else b.removeAttribute('aria-current')});
 $('uxTools')?.classList.toggle('ux-tool-selected',!['home','protocol','log'].includes(active));
 status();stageStatus();
 if(name==='home')window.scrollTo?.({top:0,behavior:'smooth'});
}
// Redirect existing global tab callbacks through the shell too.
window.switchLab=go;
async function startNew(){try{
 if(!window.LCResearch?.makeNew)throw new Error('Archivio non disponibile. Ricarica la pagina online.');
 await window.LCResearch.makeNew();
 if(!get().session)return;
 window.LCGuided?.sync?.(true);go('protocol');
 }catch(err){alert('Impossibile creare la scheda: '+err.message);}}
async function already(){
 try{
  if(!window.LCResearch?.makeNew)throw new Error('Archivio non disponibile');
  // Ogni nuovo CSV deve conservare un originale in una scheda distinta.
  await window.LCResearch.makeNew();
  if(!get().session)return;
  window.LCGuided?.sync?.(true);
  await window.LCGuided?.setRetrospective?.(true);
  go('protocol');
  const n=$('flowNotice');if(n)n.textContent='Misura già conclusa: compila la scheda breve. Il percorso retrospettivo registrerà soltanto i controlli documentabili.';
 }catch(err){alert('Impossibile iniziare l’analisi retrospettiva: '+err.message);}
}

function init(){
 if(!$('lab-home')||typeof existing!=='function')return;
 document.querySelectorAll('[data-ux-go]').forEach(b=>b.addEventListener('click',()=>go(b.dataset.uxGo)));
 $('uxNew').addEventListener('click',startNew);
 $('uxContinue').addEventListener('click',()=>go('protocol'));
 $('uxAlreadyHaveCsv').addEventListener('click',already);
 $('uxHelp').addEventListener('click',()=>go('guide'));
 $('uxTools').addEventListener('toggle',()=>{const t=document.querySelector('[data-ux-tools]');if(t)t.setAttribute('aria-expanded',String($('uxTools').open))});
 document.querySelector('[data-ux-tools]').addEventListener('click',()=>{$('uxTools').open=!$('uxTools').open;if($('uxTools').open)$('uxTools').scrollIntoView({behavior:'smooth',block:'nearest'})});
 // Sync after asynchronously saving or selecting an experiment; never write user data.
 const obs=new MutationObserver(()=>{if(active==='home')status();if(active==='protocol')stageStatus();});
 const el=$('flowNotice');if(el)obs.observe(el,{childList:true,characterData:true,subtree:true});
 go('home');
}
window.addEventListener('DOMContentLoaded',init);
})();
