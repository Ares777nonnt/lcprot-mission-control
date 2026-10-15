/* Clarity 1.4: contextual navigation and lightweight documented decisions.
 * Presentation only: instrument readings and scientific fits remain in the existing modules.
 */
(function(){'use strict';
const $=id=>document.getElementById(id);
const stages=['Scheda','SQS','Camera','Acclimatazione','Misura','CSV','Health Check','Curve Lab','Report'];
const phases=[{label:'Prepara',range:[0,3]},{label:'Misura',range:[4,4]},{label:'Carica dati',range:[5,5]},{label:'Analizza',range:[6,7]},{label:'Concludi',range:[8,8]}];
const names={log:'Diario',health:'Health Check','research-curves':'Curve Lab',report:'Report PDF',analysis:'Analisi CSV',sequence:'Sequenze',wizard:'Wizard',compare:'Confronto curve',guide:'Guida operativa'};
const escapeHtml=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let lastStage=0;
function stage(){return window.LCGuided?.getPosition?.()?.at??lastStage;}
function updatePhases(){const holder=$('clarityPhaseNav');if(!holder)return;
 const n=stage();const done=window.LCGuided?.getPosition?.()?.done||[];
 holder.innerHTML=phases.map((p,i)=>{
 const active=n>=p.range[0]&&n<=p.range[1], complete=p.range.every(k=>done.includes(k));
 return `<div class="clarity-phase ${active?'active':''} ${complete?'done':''}" ${active?'aria-current="step"':''}>${complete?'✓ ':' '}${escapeHtml(p.label)}<small>${active?'Ora · '+(n+1)+'/9':complete?'Completata':(i+1)+'/5'}</small></div>`;
 }).join('');
}
function syncNav(){if(!$('lab-home')?.hidden){$('clarityBreadcrumb').hidden=true;return;}const current=[...document.querySelectorAll('.lab-panel')].find(x=>!x.hidden&&getComputedStyle(x).display!=='none')?.id?.replace(/^lab-/,'')||'';
 const bar=$('clarityBreadcrumb');if(!bar)return;
 if(!names[current]||(window.LCJournal&&['log','health','research-curves','report'].includes(current))){bar.hidden=true;return;}
 const s=window.LCResearch?.getState?.().session;
 bar.hidden=false;
 $('clarityLocation').textContent=(s?.meta?.plant||'Esperimento')+' · '+names[current]+' · Passaggio '+(stage()+1)+'/9';
 $('clarityReturn').textContent='← Torna al percorso · '+stages[stage()];
 updatePhases();
}
function chooseExclusion(index){return new Promise(resolve=>{
 const dialog=document.createElement('dialog');dialog.className='clarity-reason';
 dialog.innerHTML=`<form method="dialog" class="inner"><h3>Escludi il punto ${Number(index)}?</h3><p>La misura originale resta conservata. Registra il motivo dell'esclusione.</p><label>Motivazione<select id="clarityReasonSelect"><option value="Misura non stabilizzata">Misura non stabilizzata</option><option value="Anomalia strumentale documentata">Anomalia strumentale documentata</option><option value="Problema di posizionamento della foglia">Problema di posizionamento della foglia</option><option value="Scostamento dal protocollo documentato">Scostamento dal protocollo documentato</option><option value="other">Altro...</option></select></label><label id="clarityOtherReason" hidden>Altra motivazione<input id="clarityReasonText" placeholder="Scrivi il motivo, anche breve"></label><div class="actions"><button type="button" id="clarityCancel">Annulla</button><button class="primary" type="submit" value="save">Conferma esclusione</button></div></form>`;
 document.body.append(dialog);
 const sel=dialog.querySelector('select'),other=dialog.querySelector('#clarityOtherReason'),free=dialog.querySelector('#clarityReasonText');
 sel.addEventListener('change',()=>{other.hidden=sel.value!=='other';if(!other.hidden)free.focus();});
 dialog.querySelector('#clarityCancel').onclick=()=>dialog.close('cancel');
 dialog.querySelector('form').addEventListener('submit',e=>{if(sel.value==='other'&&!free.value.trim()){e.preventDefault();free.focus();return;}});
 dialog.addEventListener('close',()=>{const answer=dialog.returnValue==='save'?(sel.value==='other'?free.value.trim():sel.value):null;dialog.remove();resolve(answer);},{once:true});
 if(typeof dialog.showModal==='function')dialog.showModal();else {dialog.remove();resolve(prompt('Motivo esclusione del punto '+index+':','Misura non stabilizzata'));}
 });}
function init(){
 $('clarityReturn')?.addEventListener('click',()=>window.switchLab?.('protocol'));
 window.addEventListener('lc:stage',e=>{lastStage=e.detail.stage;updatePhases();});
 const observer=new MutationObserver(()=>syncNav());
 for(const panel of document.querySelectorAll('.lab-panel'))observer.observe(panel,{attributes:true,attributeFilter:['hidden']});
 const n=$('flowNotice');if(n)observer.observe(n,{childList:true,subtree:true,characterData:true});
 updatePhases();syncNav();
}
window.LCClarity={chooseExclusion,updatePhases,syncNav};
window.addEventListener('DOMContentLoaded',init);
})();
