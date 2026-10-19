/* Clarity 2.21: descriptive comparisons of saved curve parameters.
 * CSV fits -> declared biological ID -> condition. No new fit or statistical test. */
(function(root){'use strict';
const F=Number.isFinite,C=root.LCExperimentsCore,esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])),fmt=v=>F(v)?Number(v.toPrecision(4)).toLocaleString('it-IT',{maximumFractionDigits:6}):'Non disponibile';
const defs={Asat:['Asat','µmol CO₂ m⁻² s⁻¹'],alpha:['α apparente','mol CO₂ mol⁻¹ fotoni'],Rd:['Respirazione apparente','µmol CO₂ m⁻² s⁻¹'],LCP:['LCP','µmol fotoni m⁻² s⁻¹'],Q90:['Q90 lordo','µmol fotoni m⁻² s⁻¹'],Vcmax:['Vcmax apparente','µmol CO₂ m⁻² s⁻¹'],Joper:['J operativo','µmol elettroni m⁻² s⁻¹']};
const keys=p=>p.kind==='aci'?['Vcmax','Joper','Rd']:['Asat','alpha','Rd','LCP','Q90'];
function modelGroup(f,kind){
 if(kind==='aq'&&['rect','nonrect'].includes(f.model))return {id:JSON.stringify(['aq',f.model]),label:f.model==='rect'?'Iperbole rettangolare':'Iperbole non rettangolare · θ = 0,7'};
 if(kind==='aci'&&f.model==='FvCB-min'){
  const gamma=F(f.settings?.gamma)?f.settings.gamma:42.75,k=F(f.settings?.k)?f.settings.k:710;
  return {id:JSON.stringify(['aci',f.model,gamma,k]),label:`FvCB minimale · Γ* ${fmt(gamma)} · K ${fmt(k)}`};
 }
 return null;
}
function aggregate(p,items){
 const groups=new Map();let missing=0,unassigned=0,unsupported=0;
 for(const item of items){const f=item.state.fit;if(!f){missing++;continue;}const g=modelGroup(f,p.kind);if(!g){unsupported++;continue;}if(!String(item.r.bio||'').trim()){unassigned++;continue;}
  if(!groups.has(g.id))groups.set(g.id,{...g,items:[]});groups.get(g.id).items.push(item);
 }
 return {missing,unassigned,unsupported,total:items.length,groups:[...groups.values()].map(g=>({...g,conditions:p.conditions.map(c=>{
  const readings=g.items.filter(i=>i.c.id===c.id),byKey={};
  for(const key of keys(p)){const bio=new Map();let invalid=0;
   for(const i of readings){const v=i.state.fit.params?.[key];if(!F(v)){invalid++;continue;}const id=i.r.bio.trim();if(!bio.has(id))bio.set(id,[]);bio.get(id).push(v);}
   const points=[...bio].map(([id,values])=>({id,value:values.reduce((a,b)=>a+b,0)/values.length,csv:values.length})),n=points.length,mean=n?points.reduce((a,b)=>a+b.value,0)/n:null,sd=n>1?Math.sqrt(points.reduce((a,b)=>a+(b.value-mean)**2,0)/(n-1)):null;
   byKey[key]={points,n,mean,sd,invalid,csv:points.reduce((a,b)=>a+b.csv,0)};
  }
  return {id:c.id,name:c.name,readings:readings.length,warnings:readings.filter(i=>i.state.fit.issues?.length).length,byKey};
 })}))};
}
function delta(row,ref){if(row===ref)return 'Riferimento';if(!F(row?.mean)||!F(ref?.mean))return 'Differenza non disponibile';const d=row.mean-ref.mean;return 'Δ '+(d>0?'+':'')+fmt(d)+(ref.mean>0?' · '+(d>0?'+':'')+fmt(d/ref.mean*100)+'%':' · % non disponibile: riferimento ≤ 0');}
function cardsHTML(p,group,key,reference){const ref=group.conditions.find(c=>c.id===reference)?.byKey[key];return '<div class="fit-condition-grid">'+group.conditions.map(c=>{const r=c.byKey[key],style=C.conditionStyle(p,c.id);return `<article class="fit-condition-card" data-fit-condition="${esc(c.id)}" style="border-top-color:${style.color}"><h4>${esc(c.name)}</h4><strong class="fit-condition-value">${fmt(r.mean)}</strong><span>${esc(defs[key][1])}</span><p>${r.sd===null?'DS non disponibile':'± '+fmt(r.sd)+' DS'} · <b>n biologico = ${r.n}</b><br>${r.csv} CSV usati per questo parametro</p><p class="fit-condition-delta">${esc(delta(r,ref))}</p>${c.warnings?'<p class="fit-condition-warning">'+c.warnings+' fit con avvisi · verifica i dettagli delle letture.</p>':''}${r.invalid?'<p>'+r.invalid+' stime mancanti per questo parametro.</p>':''}${r.points.length?'<details><summary>Valori delle repliche biologiche</summary><ul>'+r.points.map(v=>'<li>ID '+esc(v.id)+': <b>'+fmt(v.value)+'</b> · '+v.csv+' CSV</li>').join('')+'</ul></details>':'<p>Servono fit coerenti con ID biologici assegnati.</p>'}</article>`;}).join('')+'</div>';}
function methodHTML(data,report=false){return `<p class="fit-comparison-method">Descrittivo · media dei parametri dei CSV dello stesso ID, poi media e DS fra ID della condizione. Ogni ID pesa allo stesso modo. La DS descrive la variabilità biologica; non è l’intervallo di incertezza del fit. Nessun test di significatività sui parametri delle curve.</p><p class="curve-note">${data.missing} letture senza fit corrente · ${data.unassigned} fit senza ID biologico · ${data.unsupported} fit di modello non supportato: esclusi da queste medie. ${report?'Le letture seguono l’ambito indicato nell’intestazione del report.':'La selezione del grafico vale anche qui.'} Modelli diversi e costanti biochimiche diverse sono tenuti separati. Verifica che protocolli, camera e intervalli misurati consentano il confronto; la compatibilità del modello non lo certifica.</p>`;}
function reportHTML(p,items,reference){const data=aggregate(p,items);if(!data.groups.length)return '<p>Confronto dei parametri fra condizioni non disponibile: servono fit correnti e ID biologici assegnati.</p>'+methodHTML(data,true);
 return '<h3>Parametri delle curve a confronto fra condizioni</h3>'+data.groups.map(g=>'<h4>'+esc(g.label)+'</h4>'+Array.from({length:Math.ceil(g.conditions.length/3)},(_,i)=>g.conditions.slice(i*3,i*3+3)).map(conditions=>'<div class="curve-table-scroll"><table class="fit-comparison-table"><thead><tr><th>Parametro</th>'+conditions.map(c=>'<th>'+esc(c.name)+'</th>').join('')+'</tr></thead><tbody>'+keys(p).map(key=>'<tr><th>'+esc(defs[key][0])+'<small>'+esc(defs[key][1])+'</small></th>'+conditions.map(c=>{const r=c.byKey[key],ref=g.conditions.find(z=>z.id===reference)?.byKey[key];return '<td><b>'+fmt(r.mean)+'</b><small>'+(r.sd===null?'DS non disponibile':'± '+fmt(r.sd)+' DS')+' · n = '+r.n+'<br>'+r.csv+' CSV · '+esc(delta(r,ref))+'</small>'+(c.warnings?'<small>'+c.warnings+' fit con avvisi</small>':'')+'</td>';}).join('')+'</tr>').join('')+'</tbody></table></div>').join('')).join('')+methodHTML(data,true);}
root.LCFitComparison={aggregate,modelGroup,cardsHTML,reportHTML,delta};if(typeof document==='undefined')return;
const $=id=>document.getElementById(id);let state=null,ready=false,lastProject='',groupChoice='',metric='Asat',ref='';
function render(){if(!ready||!state)return;const p=root.LCExperiments.current();if(!p||p.id!==state.project.id)return;const ids=new Set(root.LCComparisonSelection.snapshot()?.visible||[]),scope={...p,conditions:p.conditions.filter(c=>state.selected.includes(c.id))},items=root.LCResultsInsight.fitInfo(p,root.LCResearch.getState().sessions).filter(i=>ids.has(i.r.id)),data=aggregate(scope,items);
 if(lastProject!==p.id){lastProject=p.id;metric=keys(p)[0];groupChoice='';ref='';}if(!keys(p).includes(metric))metric=keys(p)[0];
 const available=items.some(i=>i.state.fit);$('fitConditionComparison').hidden=!available;$('fitReadingDetails').hidden=!available;$('curveEstimatesBody').hidden=false;
 // When no fit exists, keep the original direct preparation actions visible.
 if(available&&$('curveEstimatesBody').parentElement!==$('fitReadingDetails'))$('fitReadingDetails').append($('curveEstimatesBody'));
 if(!available&&$('curveEstimatesBody').parentElement!==$('curveEstimates'))$('fitReadingDetails').before($('curveEstimatesBody'));
 $('fitReadingSummary').textContent='Dettaglio dei fit per lettura / CSV · '+items.length;
 $('fitCompareMetric').innerHTML=keys(p).map(k=>'<option value="'+k+'">'+esc(defs[k][0])+'</option>').join('');$('fitCompareMetric').value=metric;
 if(!scope.conditions.some(c=>c.id===ref))ref=scope.conditions[0]?.id||'';$('fitCompareReference').innerHTML=scope.conditions.map(c=>'<option value="'+esc(c.id)+'">'+esc(c.name)+'</option>').join('');$('fitCompareReference').value=ref;
 if(!data.groups.some(g=>g.id===groupChoice))groupChoice=data.groups[0]?.id||'';$('fitCompareModel').innerHTML=data.groups.map(g=>'<option value="'+esc(g.id)+'">'+esc(g.label)+'</option>').join('');$('fitCompareModel').value=groupChoice;$('fitCompareModel').closest('label').hidden=data.groups.length<2;
 const group=data.groups.find(g=>g.id===groupChoice);$('fitCompareValues').innerHTML=group?cardsHTML(scope,group,metric,ref):'<p>Assegna gli ID biologici alle letture per confrontare le condizioni.</p>';
 $('fitCompareContext').textContent=group?defs[metric][0]+' · '+group.label+' · '+group.items.length+' fit inclusi':'Nessun gruppo di fit confrontabile';
 $('fitCompareMethod').innerHTML=methodHTML(data);
}
window.addEventListener('DOMContentLoaded',()=>{
 const section=document.createElement('section');section.id='fitConditionComparison';section.innerHTML='<h4>Confronta le condizioni</h4><div class="fit-compare-controls"><label>Parametro della curva<select id="fitCompareMetric"></select></label><label>Condizione di riferimento<select id="fitCompareReference"></select></label><label>Modello e costanti<select id="fitCompareModel"></select></label></div><p id="fitCompareContext"></p><div id="fitCompareValues"></div><details class="curve-definitions"><summary>Come si ottiene il confronto e cosa verificare</summary><div id="fitCompareMethod"></div></details>';
 $('curveEstimatesBody').before(section);const details=document.createElement('details');details.id='fitReadingDetails';details.innerHTML='<summary id="fitReadingSummary">Dettaglio dei fit per lettura / CSV</summary>';section.after(details);
 $('fitCompareMetric').onchange=()=>{metric=$('fitCompareMetric').value;render();};$('fitCompareReference').onchange=()=>{ref=$('fitCompareReference').value;render();};$('fitCompareModel').onchange=()=>{groupChoice=$('fitCompareModel').value;render();};
 const decorate=root.LCCurveResults.decorateReport;root.LCCurveResults.decorateReport=(html,p,records,options={})=>{const doc=new DOMParser().parseFromString(decorate(html,p,records,options),'text/html'),estimates=doc.querySelector('.curve-estimates');if(!estimates)return html;const comparison=doc.createElement('div');comparison.className='fit-comparison-report';const requested=options.fitReference||options.reference,reference=p.conditions.some(c=>c.id===requested)?requested:p.conditions[0]?.id;comparison.innerHTML=reportHTML(p,root.LCResultsInsight.fitInfo(p,records),reference);estimates.querySelector('h2').after(comparison);doc.querySelector('style').textContent+=' .fit-comparison-table{width:100%;table-layout:fixed}.fit-comparison-table th,.fit-comparison-table td{overflow-wrap:anywhere}@media print{.fit-comparison-table{font-size:8pt}.fit-comparison-table small{font-size:7.5pt}.fit-comparison-table td,.fit-comparison-table th{padding:7px}.fit-comparison-method{font-size:8pt;line-height:1.5}}';return '<!doctype html>'+doc.documentElement.outerHTML;};
 const reportOptions=root.LCResultsStory.currentReportOptions;root.LCResultsStory.currentReportOptions=p=>({...reportOptions(p),fitReference:lastProject===p.id?ref:null});
 ready=true;window.addEventListener('lc:metrics-render',e=>{state=e.detail;render();});for(const event of ['lc:research','lc:experiment-step'])window.addEventListener(event,render);
});
})(globalThis);
