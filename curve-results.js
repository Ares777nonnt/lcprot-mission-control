/* Clarity 2.19: whole-curve observations, saved model estimates, then a chosen level.
 * Presentation only. No automatic fitting or changes to archived records. */
(function(root){'use strict';
const C=root.LCExperimentsCore,F=Number.isFinite,
esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])),
fmt=v=>F(v)?Number(v.toPrecision(4)).toLocaleString('it-IT',{maximumFractionDigits:6}):'Non disponibile';
const definitions={
 Asat:['Asat','Asintoto netto stimato','µmol CO₂ m⁻² s⁻¹'],
 alpha:['α apparente','Pendenza iniziale rispetto alla luce incidente','mol CO₂ mol⁻¹ fotoni'],
 Rd:['Resp. apparente','Intercetta respiratoria del modello; parametro Rd archiviato','µmol CO₂ m⁻² s⁻¹'],
 LCP:['LCP','Luce alla quale il modello stima An = 0','µmol fotoni m⁻² s⁻¹'],
 Q90:['Q90 lordo','Luce al 90% dell’asintoto lordo del modello','µmol fotoni m⁻² s⁻¹'],
 Vcmax:['Vcmax apparente','Stima condizionata alle ipotesi biochimiche del modello','µmol CO₂ m⁻² s⁻¹'],
 Joper:['J operativo','Trasporto elettronico operativo stimato; non equivale automaticamente a Jmax','µmol elettroni m⁻² s⁻¹']
};
function overview(p,dataset){
 const stats=C.summarize(C.metricSeries(dataset,'an'));
 return p.conditions.map(c=>{
  const rows=stats.filter(v=>v.condition===c.id&&F(v.mean)),peak=rows.reduce((a,b)=>!a||b.mean>a.mean?b:a,null);
  return {condition:c,peak};
 });
}
function observedHTML(p,dataset){if(!p.conditions.length)return '<p>Seleziona almeno una condizione per leggere la risposta della curva.</p>';return '<div class="curve-observed-grid">'+overview(p,dataset).map(({condition:c,peak})=>`<article class="curve-observed-card" style="border-top-color:${C.conditionStyle(p,c.id).color}"><h4>${esc(c.name)}</h4><span>Massimo della media osservata di An</span><strong>${fmt(peak?.mean)}</strong><span>µmol CO₂ m⁻² s⁻¹</span><p>${peak?`${p.kind==='aci'?'Ci':'Qleaf'} = ${fmt(peak.x)} ${p.kind==='aci'?'µmol mol⁻¹':'µmol fotoni m⁻² s⁻¹'}<br>n biologico = ${peak.n} · ${peak.sd===null?'DS non disponibile':'DS '+fmt(peak.sd)}`:'Assegna ID biologici e verifica i dati per ottenere una media.'}</p></article>`).join('')+'</div><p class="curve-note">Osservato · massimo fra le medie biologiche ai livelli misurati. I massimi possono trovarsi a livelli diversi: non sono un confronto a pari luce o CO₂ e non sono Asat stimata.</p>';}
function savedItems(p,records,ids){return root.LCResultsInsight.fitInfo(p,records).filter(i=>!ids||ids.has(i.r.id));}
function estimatesHTML(p,items,interactive){
 const keys=p.kind==='aci'?['Vcmax','Joper','Rd']:['Asat','alpha','Rd','LCP','Q90'],available=items.filter(i=>i.state.fit).length;
 const intro=`<p class="curve-fit-status"><strong>${available} / ${items.length} fit salvati coerenti</strong> · ${available===items.length&&items.length?'Stime disponibili per le letture selezionate.':'Le stime mancanti non sono zero. Apri una lettura, verifica i dati e calcola / salva il fit.'}</p>`;
 if(!items.length)return intro+'<p>Nessuna lettura selezionata.</p>';
 if(!available)return intro+(interactive?'<details class="curve-definitions"><summary>Scegli una lettura per preparare il fit</summary>'+items.map(({c,r,state})=>`<p><strong>${esc(c.name)} · ${esc(r.name)}</strong><br>ID ${esc(r.bio||'non assegnato')} · ${esc(state.label)} <button type="button" data-ws-open="${esc(r.id)}" data-cond="${esc(c.id)}" data-target="health">Apri lettura e fit</button></p>`).join('')+'</details>':`<p>${p.kind==='aci'?'Vcmax, J operativo e respirazione apparente non disponibili':'Asat, α, respirazione apparente, LCP e Q90 non disponibili'}: nessun fit corrente salvato. Le curve osservate restano disponibili.</p>`);
 const table='<div class="curve-table-scroll" tabindex="0" role="region" aria-label="Parametri stimati per lettura"><table class="curve-fit-table"><thead><tr><th scope="col">Lettura / replica</th>'+keys.map(k=>`<th scope="col" title="${esc(definitions[k][1])}">${esc(definitions[k][0])}<small>${esc(definitions[k][2])}</small></th>`).join('')+'<th scope="col">Stato e verifica</th></tr></thead><tbody>'+items.map(({c,r,state})=>{
  const f=state.fit,issues=f?.issues||[];
  return `<tr data-curve-fit="${esc(r.id)}"><th scope="row">${esc(r.name)}<small>${esc(c.name)} · ID ${esc(r.bio||'non assegnato')}</small></th>`+keys.map(k=>`<td>${f?fmt(f.params?.[k]):'—'}</td>`).join('')+`<td><strong>${esc(state.label)}</strong>${f?'<small>'+esc(f.model)+' · R² '+fmt(f.metrics?.r2)+'</small>':''}${issues.length?`<details><summary>${issues.length} avvisi del modello</summary><ul>${issues.map(s=>'<li>'+esc(s)+'</li>').join('')}</ul></details>`:''}${interactive?`<button type="button" data-ws-open="${esc(r.id)}" data-cond="${esc(c.id)}" data-target="health">${f?'Rivedi fit':'Apri lettura e fit'}</button>`:''}</td></tr>`;
 }).join('')+'</tbody></table></div>';
 return intro+table+'<p class="curve-note">Stimato · parametri per singolo CSV, senza media automatica fra letture. Più CSV dello stesso ID non sono nuove repliche biologiche. Un fit coerente con il file può comunque essere poco affidabile: controlla avvisi, intervalli e protocollo nei dettagli.</p><details class="curve-definitions"><summary>Significato e limiti dei parametri</summary><dl>'+keys.map(k=>`<dt>${esc(definitions[k][0])}</dt><dd>${esc(definitions[k][1])}.</dd>`).join('')+'</dl><p>Asat è l’asintoto netto del modello nelle condizioni della misura. La respirazione apparente del fit non dimostra la respirazione mitocondriale in luce. Q90 può essere estrapolato oltre la luce misurata: controlla gli avvisi. Gli intervalli bootstrap restano nei dettagli del fit.</p></details>';
}
function levelText(p,x){return p.kind==='aq'&&x===0?'Misura al buio · Qleaf = 0. An negativa può indicare rilascio netto di CO₂: qui il confronto riguarda il punto al buio.':F(x)?`Confronto a ${p.kind==='aci'?'Ci':'Qleaf'} = ${fmt(x)}. Valori riferiti soltanto a questo livello, non all’intera curva.`:'Scegli un livello misurato per confrontare le condizioni.';}
const reportStyle=`.curve-overview,.curve-estimates{margin:24px 0}.curve-observed-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(210px,1fr));gap:14px}.curve-observed-card{border:1px solid #ccdad4;border-top:4px solid;padding:16px;border-radius:10px;break-inside:avoid}.curve-observed-card h4{font-size:17px;margin:0 0 10px}.curve-observed-card span{display:block;font-size:13px}.curve-observed-card strong{display:block;font-size:29px;margin:5px 0}.curve-observed-card p,.curve-note{font-size:13px;line-height:1.6}.curve-fit-status{padding:12px;background:#e7f4ee;border-radius:8px}.curve-table-scroll{overflow:auto}.curve-fit-table{font-size:13px;min-width:760px}.curve-fit-table small{font-size:11px}.curve-definitions dt{font-weight:600}.curve-definitions dd{margin:0 0 10px}.curve-level-note{padding:12px;background:#e7f4ee;border-left:4px solid #087b63}.curve-eyebrow{font-size:12px;font-weight:600;color:#4d6259}.curve-fit-table details{max-width:240px}@media(max-width:650px){.curve-observed-grid{grid-template-columns:1fr}}@media print{.curve-table-scroll{overflow:visible}.curve-fit-table{min-width:0;table-layout:fixed;font-size:7.5pt}.curve-fit-table small{font-size:7pt}.curve-fit-table td,.curve-fit-table th{padding:5px;overflow-wrap:anywhere}.curve-observed-grid{grid-template-columns:repeat(3,minmax(0,1fr))}.curve-observed-card{padding:10px}.curve-observed-card strong{font-size:20pt}.curve-observed-card span,.curve-observed-card p,.curve-note{font-size:8pt}}`;
function decorateReport(html,p,records,options={}){
 const doc=new DOMParser().parseFromString(html,'text/html'),main=doc.querySelector('main');if(!main)return html;
 const point=main.firstElementChild,graph=point.nextElementSibling;
 if(!point.querySelector('.lead'))return html;
 const dataset=C.metricDataset(p,root.LCResearchCore),title=point.querySelector('h2');title.textContent='Confronto al livello scelto';point.classList.add('curve-point-section');
 const note=doc.createElement('p');note.className='curve-level-note';note.textContent=levelText(p,root.LCResultsStory.context(p,options).x);title.after(note);
 const observed=doc.createElement('section');observed.className='curve-overview';observed.innerHTML='<span class="curve-eyebrow">OSSERVATO · INTERA CURVA</span><h2>La risposta dell’esperimento</h2>'+observedHTML(p,dataset);
 const estimates=doc.createElement('section');estimates.className='curve-estimates';estimates.innerHTML='<span class="curve-eyebrow">STIMATO · MODELLO DELLA CURVA</span><h2>Capacità fotosintetica e altri parametri</h2>'+estimatesHTML(p,savedItems(p,records),false);
 main.prepend(observed);if(graph?.querySelector('.chart'))observed.after(graph);(graph||observed).after(estimates);
 for(const detail of estimates.querySelectorAll('details:not(.curve-definitions)'))detail.open=true;
 doc.querySelector('style').textContent+=reportStyle+' @media print{.curve-point-section{break-inside:avoid}}';
 const context=doc.querySelector('[data-report-section=context] .note:last-child');if(context?.textContent.includes('fit salvati coerenti'))context.textContent='Stime per lettura riportate sopra. Intervalli esplorativi, metodi e tracciabilità sono disponibili nel report dettagliato.';
 return '<!doctype html>'+doc.documentElement.outerHTML;
}
root.LCCurveResults={overview,observedHTML,estimatesHTML,levelText,decorateReport};
if(typeof document==='undefined')return;
let state=null,ready=false;const $=id=>document.getElementById(id);
function render(){if(!ready||!state)return;const p=root.LCExperiments.current();if(!p||p.id!==state.project.id)return;
 const ids=new Set(root.LCComparisonSelection.snapshot()?.visible||[]),dataset=state.dataset.filter(s=>ids.has(s.reading)),scope={...p,conditions:p.conditions.filter(c=>state.selected.includes(c.id))};
 $('curveObserved').innerHTML=observedHTML(scope,dataset);
 const items=savedItems(p,root.LCResearch.getState().sessions,ids);$('curveEstimatesBody').innerHTML=estimatesHTML(p,items,true);
 $('curveOverviewContext').textContent=root.LCComparisonSelection.shortLabel(p)+' · massimi descrittivi';
 const x=$('expMetricX').value===''?null:Number($('expMetricX').value);$('curveLevelNote').textContent=levelText(p,x);$('curveLevelNote').classList.toggle('is-dark-point',p.kind==='aq'&&x===0);
 $('curvePointTitle').textContent=p.kind==='aq'&&x===0?'3 · Confronto al buio':'3 · Confronto a un livello';
 const current=state.dataset.some(s=>ids.has(s.reading));$('curveFitsJump').disabled=!current;
 $('reportContentsPreview').insertAdjacentHTML('afterbegin','<li>Intera curva: massimo osservato e parametri dei fit salvati</li>');
 const first=$('reportContentsPreview').querySelectorAll('li');for(let i=1;i<first.length;i++)if(first[i].textContent==='Intera curva: massimo osservato e parametri dei fit salvati')first[i].remove();
}
window.addEventListener('DOMContentLoaded',()=>{
 const summary=$('storyPanel-summary'),plot=$('boardPlots'),spot=$('comparisonSpotlight');
 const overviewPanel=document.createElement('section');overviewPanel.id='curveOverview';overviewPanel.className='curve-overview';overviewPanel.innerHTML='<div class="curve-section-heading"><div><span class="curve-eyebrow">OSSERVATO · INTERA CURVA</span><h3>1 · La risposta dell’esperimento</h3><p id="curveOverviewContext"></p></div><button type="button" id="curveFitsJump">Asat e parametri del modello ↓</button></div><div id="curveObserved"></div>';
 summary.prepend(overviewPanel);overviewPanel.after(plot);
 const estimates=document.createElement('section');estimates.id='curveEstimates';estimates.className='curve-estimates';estimates.innerHTML='<span class="curve-eyebrow">STIMATO · MODELLO DELLA CURVA</span><h3>2 · Capacità fotosintetica e altri parametri</h3><div id="curveEstimatesBody"></div><button type="button" id="curveFitDetails">Apri dettagli, intervalli e metodi dei fit</button>';plot.after(estimates);estimates.after(spot);
 const point=document.createElement('div');point.id='curvePointHeading';point.innerHTML='<h3 id="curvePointTitle">3 · Confronto a un livello</h3><p id="curveLevelNote" class="curve-level-note"></p>';point.append($('expMetricX').closest('label'));spot.prepend(point);
 $('curveFitsJump').onclick=()=>estimates.scrollIntoView({block:'start',behavior:'smooth'});
 $('curveFitDetails').onclick=()=>{root.LCResultsStory.show('quality');$('insightFits').open=true;$('insightFits').scrollIntoView({block:'start',behavior:'smooth'});};
 $('storyTab-parameters').textContent='Parametri al livello scelto';
 $('reportPreviewContext').after(Object.assign(document.createElement('p'),{className:'curve-note',textContent:'Il report inizia dall’intera curva e dalle stime salvate. Il confronto a un livello è una sezione separata.'}));
 ready=true;
 window.addEventListener('lc:metrics-render',e=>{state=e.detail;render();});
 for(const event of ['lc:metric-x','lc:research','lc:experiment-step'])window.addEventListener(event,render);
 $('experimentReportMode').addEventListener('change',render);$('reportScope').addEventListener('change',render);
 $('resultsReportComposer').addEventListener('change',render);
});
})(globalThis);
