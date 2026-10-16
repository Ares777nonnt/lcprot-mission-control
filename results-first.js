/* Clarity 2.18.1: one comparison, progressive detail, explicit report scope.
 * Presentation and report preferences only. IndexedDB schemas are unchanged. */
(function(root){'use strict';
const $=id=>document.getElementById(id),C=root.LCExperimentsCore,I=root.LCResultsInsight,
esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])),finite=Number.isFinite,
fmt=v=>finite(v)?(Math.abs(v)>0&&Math.abs(v)<.001?v.toExponential(3).replace('.',','):Number(v.toPrecision(4)).toLocaleString('it-IT',{maximumFractionDigits:6})):'Non disponibile';
let ready=false,state=null,lastProject='',reportSettings=new Map(),step='setup';
function settings(id){if(!reportSettings.has(id))reportSettings.set(id,{scope:'selection',parameters:true,context:true,methods:true,sources:true});return reportSettings.get(id);}
function symbol(p,id){const s=C.conditionStyle(p,id);return `<svg viewBox="0 0 20 20" width="20" height="20" aria-hidden="true">${root.LCAnalysisBoard.marker(s.shape,10,10,5,s.color)}</svg>`;}
function render(){if(!ready)return;const p=root.LCExperiments.current();if(!p)return;
 const changed=lastProject!==p.id;lastProject=p.id;
 $('resultsPrepareReport').disabled=!p.conditions.some(c=>c.readings.length);
 $('workspaceFrame').dataset.resultsFirstStep=step;
 const notice=$('expNotice'),dismiss=notice.nextElementSibling?.classList.contains('pipeline-dismiss')?notice.nextElementSibling:null,noticeHost=$('expPane-'+step);if(noticeHost&&notice.parentElement!==noticeHost)noticeHost.prepend(...[notice,dismiss].filter(Boolean));
 if(changed){$('storyCurveDetails').open=false;$('resultsDetails').open=false;root.LCResultsStory.show('summary');}
 const prefs=settings(p.id);$('reportScope').value=prefs.scope;
 for(const el of document.querySelectorAll('[data-report-section]'))el.checked=prefs[el.dataset.reportSection];
 const current=state?.project.id===p.id?state:null,selection=root.LCComparisonSelection.snapshot(),ids=new Set(selection?.visible||[]),rows=p.conditions.flatMap(c=>c.readings.filter(r=>ids.has(r.id))),bio=new Set(rows.map(r=>r.bio.trim()).filter(Boolean));
 $('resultsScopeButton').textContent=rows.length+' CSV · '+bio.size+' ID biologici';
 $('resultsScopeButton').setAttribute('aria-expanded',String($('storyCurveDetails').open));
 $('resultsScopeHint').textContent='Selezione temporanea · Più CSV con lo stesso ID contano come una replica. Gli ID comuni tra condizioni non si sommano come unità indipendenti.';
 $('resultsSelectionLegend').innerHTML=p.conditions.map(c=>{const visible=c.readings.filter(r=>ids.has(r.id)),count=visible.length,total=c.readings.length,n=new Set(visible.map(r=>r.bio.trim()).filter(Boolean)).size;return `<label class="results-condition-toggle"><input type="checkbox" data-result-toggle="${esc(c.id)}" ${selection?.selected.includes(c.id)?'checked':''}>${symbol(p,c.id)}<span><strong>${esc(c.name)}</strong><small>${count}/${total} letture · ${n} ID biologici</small></span></label>`;}).join('');
 for(const el of document.querySelectorAll('[data-result-toggle]')){const c=p.conditions.find(c=>c.id===el.dataset.resultToggle),n=c.readings.filter(r=>ids.has(r.id)).length;el.indeterminate=n>0&&n<c.readings.length;}
 if(current){const x=$('expMetricX').value===''?null:Number($('expMetricX').value),metric=C.metricDefinition(current.key),conditions=p.conditions.filter(c=>current.selected.includes(c.id)),reference=$('comparisonReference').value,stats=current.stats[current.key]||[],ref=stats.find(v=>v.condition===reference&&v.x===x),other=conditions.length===2?conditions.find(c=>c.id!==reference):null,value=other&&stats.find(v=>v.condition===other.id&&v.x===x);
  const delta=value&&ref?value.mean-ref.mean:null,refName=p.conditions.find(c=>c.id===reference)?.name||'riferimento';
  $('comparisonReference').closest('label').hidden=conditions.length<2;
  $('resultsHeadline').hidden=!other;
  $('comparisonResultCards').classList.toggle('results-pair-cards',!!other);
  if(other)$('resultsHeadline').innerHTML=`<div><span>${esc(other.name)} rispetto a ${esc(refName)}</span><strong>${delta===null?'Differenza non disponibile':(delta>0?'+':'')+fmt(delta)}</strong><small>${esc(metric.unit)}</small></div><p>${delta!==null&&ref.mean>0?`<strong>${delta>0?'+':''}${fmt(100*delta/ref.mean)}%</strong><span>rispetto al riferimento</span>`:'Percentuale non disponibile'}<small>${p.kind==='aci'?'Ci':'Qleaf'} = ${fmt(x)}</small></p>`;
  $('resultsMetricMeaning').textContent=metric.label+' · '+root.LCResultsStory.names[current.key];
  $('resultsValuesUnit').textContent=metric.label+' · '+metric.unit+' · '+(p.kind==='aci'?'Ci':'Qleaf')+' = '+fmt(x);
  $('resultsMetricHelp').textContent=metric.description;
  $('resultsChartTitle').textContent=metric.label+' · '+(p.kind==='aci'?'risposta alla CO₂ interna':'risposta alla luce');
  const inspected=I.inspect(p,current.dataset.filter(s=>current.selected.includes(s.condition)),current.key,x).filter(r=>current.selected.includes(r.id)),limitations=inspected.filter(r=>r.notices.length),total=limitations.length;
  $('resultsQualityLink').textContent=total?total+(total===1?' condizione con limiti · verifica':' condizioni con limiti · verifica'):'Dati e numerosità';
  $('resultsQualityLink').classList.toggle('needs-review',total>0);
  $('resultsCaution').hidden=!total;
  $('resultsCaution').textContent=total?'Da verificare: '+limitations.map(r=>r.name+' — '+r.notices[0]).join(' · '):'';
  $('reportPreviewContext').textContent=(prefs.scope==='selection'?root.LCComparisonSelection.shortLabel(p):p.conditions.reduce((n,c)=>n+c.readings.length,0)+' letture · intero esperimento')+' · '+metric.label+' · '+(p.kind==='aci'?'Ci':'Qleaf')+' = '+fmt(x);
 }else $('reportPreviewContext').textContent='Apri i risultati per scegliere parametro e livello del riepilogo.';
 $('reportContentsPreview').innerHTML='<li>Risultato principale, medie, DS e n biologico</li><li>Grafico e limiti del confronto</li>'+[['parameters','Altri parametri allo stesso livello'],['context','Condizioni e camera'],['methods','Metodo di calcolo'],['sources','Elenco delle letture incluse']].filter(([key])=>prefs[key]).map(([,label])=>'<li>'+label+'</li>').join('')+($('experimentReportMode').value==='full'?'<li>Appendice: dati completi, fit salvati e tracciabilità</li>':'');
 const available=prefs.scope==='selection'?rows.length:p.conditions.reduce((n,c)=>n+c.readings.length,0);
 for(const id of ['experimentReportOpen','experimentReportDownload'])$(id).disabled=!available;
 syncImport();
}
function syncImport(){const p=root.LCExperiments.current();if(!p)return;const configured=!!p.cameraSettings,pending=$('intakeRows').children.length;
 $('resultsImportCameraState').textContent=configured?'1 · Camera impostata':'1 · Imposta la camera';
 $('resultsImportCameraHint').textContent=configured?'Valida per tutti i CSV. Apri le impostazioni solo per modificarle.':'Dichiara le impostazioni comuni prima dei CSV. I valori sconosciuti possono restare non dichiarati.';
 $('resultsImportCameraEdit').textContent=configured?'Modifica camera':'Imposta la camera';
 $('resultsImportCameraDetails').hidden=!configured;
 $('resultsImportCameraDetails').textContent=root.LCCamera.summary(p);
 $('resultsImportFlow').dataset.configured=String(configured);
 $('resultsImportFilesTitle').textContent=pending?'2 · Associa e conferma '+pending+' CSV':'2 · Aggiungi i CSV';
 $('resultsImportDone').hidden=pending>0||!p.conditions.some(c=>c.readings.length);
}
root.LCResultsFirst={reportSettings:p=>({...settings(p.id)}),render};
window.addEventListener('DOMContentLoaded',()=>{
 document.body.classList.add('results-first');
 // Keep report as a main action, rather than a fourth numbered step.
 const exportButton=document.querySelector('[data-workspace-step="export"]');exportButton.textContent='Prepara report';exportButton.id='resultsPrepareReport';exportButton.classList.add('primary');document.querySelector('.workspace-title').append(exportButton);
 const names={setup:'Organizza',readings:'Importa',compare:'Risultati'};
 for(const el of document.querySelectorAll('[data-workspace-step]'))if(names[el.dataset.workspaceStep])el.textContent=names[el.dataset.workspaceStep];
 $('expToReadings').textContent='Continua · camera e CSV';$('expToCompare').textContent='Apri risultati';
 const pane=$('expPane-compare');pane.classList.add('results-first-pane');pane.querySelector('h2').textContent='Risultati';
 const tools=document.createElement('div');tools.id='resultsToolbar';
 const metric=$('expMetric').closest('label'),x=$('expMetricX').closest('label');tools.append(metric,x);
 const scopeButton=document.createElement('button');scopeButton.type='button';scopeButton.id='resultsScopeButton';scopeButton.setAttribute('aria-controls','storyCurveDetails');tools.append(scopeButton);pane.prepend(tools);
 const metricMeaning=document.createElement('details');metricMeaning.id='resultsMetricDefinition';metricMeaning.innerHTML='<summary id="resultsMetricMeaning"></summary><p id="resultsMetricHelp"></p>';tools.after(metricMeaning);
 const curveDetails=$('storyCurveDetails');curveDetails.querySelector('summary').after($('curveSelection').querySelector('.curve-selection-actions'));curveDetails.querySelector('summary').textContent='Seleziona letture / CSV';
 const scopeHint=document.createElement('p');scopeHint.id='resultsScopeHint';curveDetails.append(scopeHint);metricMeaning.after($('curveSelection'));
 scopeButton.onclick=()=>{curveDetails.open=!curveDetails.open;scopeButton.setAttribute('aria-expanded',String(curveDetails.open));if(curveDetails.open)curveDetails.scrollIntoView({block:'nearest',behavior:'smooth'});};
 curveDetails.addEventListener('toggle',()=>scopeButton.setAttribute('aria-expanded',String(curveDetails.open)));
 const summary=$('storyPanel-summary');$('curveSelection').after(summary);
 const headline=document.createElement('div');headline.id='resultsHeadline';headline.setAttribute('aria-live','polite');$('comparisonResultCards').before(headline);
 const unit=document.createElement('p');unit.id='resultsValuesUnit';$('comparisonResultCards').before(unit);
 const caution=document.createElement('p');caution.id='resultsCaution';caution.setAttribute('role','status');$('comparisonResultCards').after(caution);
 const plotHeading=document.createElement('h3');plotHeading.id='resultsChartTitle';const legend=document.createElement('div');legend.id='resultsSelectionLegend';legend.setAttribute('aria-label','Condizioni incluse nel confronto');$('boardPlots').prepend(plotHeading,legend);
 legend.onchange=e=>{if(e.target.dataset.resultToggle)root.LCComparisonSelection.toggleCondition(e.target.dataset.resultToggle,e.target.checked);};
 const detail=document.createElement('details');detail.id='resultsDetails';detail.innerHTML='<summary>Dati, confronto approfondito e metodi</summary>';
 const tabs=$('storyTabs');detail.append(tabs,$('storyPanel-pair'),$('storyPanel-parameters'),$('storyPanel-quality'));summary.after(detail);
 $('storyTab-summary').textContent='Chiudi dettagli';$('storyTab-pair').textContent='Confronto A/B';$('storyTab-parameters').textContent='Altri parametri';$('storyTab-quality').textContent='Dati e modelli';
 const originalShow=root.LCResultsStory.show;root.LCResultsStory.show=(view,focus)=>{originalShow(view,focus);summary.hidden=false;detail.open=view!=='summary';};
 // Existing tab and jump listeners call their original function. Reconcile after them.
 tabs.addEventListener('click',e=>{const t=e.target.closest('[data-story-tab]');if(t){summary.hidden=false;detail.open=t.dataset.storyTab!=='summary';}});
 tabs.addEventListener('keydown',()=>{summary.hidden=false;detail.open=$('storyTab-summary').getAttribute('aria-selected')!=='true';});
 detail.addEventListener('toggle',()=>{if(detail.open&&$('storyTab-summary').getAttribute('aria-selected')==='true')root.LCResultsStory.show('quality');});
 const quality=document.createElement('button');quality.type='button';quality.id='resultsQualityLink';quality.onclick=()=>{root.LCResultsStory.show('quality');detail.scrollIntoView({block:'start',behavior:'smooth'});};
 const secondary=document.createElement('div');secondary.id='resultsSecondaryActions';secondary.append(quality);detail.before(secondary);
 document.addEventListener('click',e=>{const b=e.target.closest('[data-board-jump]');if(b&&$(b.dataset.boardJump)?.closest('#resultsDetails')){summary.hidden=false;detail.open=true;}});
 const method=document.createElement('details');method.id='resultsGraphMethod';method.innerHTML='<summary>Come leggere il grafico</summary>';method.append($('boardPlotNote'));$('boardPlots').append(method);
 // All advanced presentation settings share the same drawer.
 const advanced=document.createElement('details');advanced.id='resultsAdvancedView';advanced.innerHTML='<summary>Vista letture e grafici aggiuntivi</summary>';advanced.append($('expView').closest('label'),$('boardPanelControls'),$('storyExtraPlots'),$('boardPanelsDownload'));$('storyPanel-parameters').prepend(advanced);
 for(const d of pane.querySelectorAll(':scope > details'))if(d.querySelector('summary')?.textContent.includes('Come sono calcolate le medie'))$('boardTechnical').append(d);
 const reference=$('comparisonReference').closest('label');reference.classList.add('results-reference');$('comparisonSpotlight').append(reference);
 // Guided import: camera appears first, then defaults/files and per-file assignments.
 const camera=document.querySelector('.camera-intake'),flow=document.createElement('section');flow.id='resultsImportFlow';flow.innerHTML='<div class="results-import-camera"><div><h3 id="resultsImportCameraState"></h3><p id="resultsImportCameraHint"></p></div><button type="button" id="resultsImportCameraEdit"></button></div><details><summary>Impostazioni comuni della camera</summary><p id="resultsImportCameraDetails"></p></details><h3 id="resultsImportFilesTitle"></h3>';camera.before(flow);camera.hidden=true;$('resultsImportCameraEdit').onclick=()=>$('cameraIntakeEdit').click();
 flow.append($('intakeDefaults'));$('intakeDrop').before(flow);
 const done=document.createElement('div');done.id='resultsImportDone';done.innerHTML='<span>Letture salvate. Puoi aggiungere altri CSV o aprire il confronto.</span><button type="button" class="primary">Apri risultati</button>';done.querySelector('button').onclick=()=>root.LCExperiments.setStep('compare');document.querySelector('.mission-intake').append(done);
 // A single report composer: explicit scope and optional sections, before export.
 const composer=document.createElement('section');composer.id='resultsReportComposer';composer.innerHTML='<h3>Cosa vuoi condividere?</h3><label>Ambito del report<select id="reportScope"><option value="selection">Confronto selezionato</option><option value="all">Intero esperimento</option></select></label><p id="reportPreviewContext" role="status"></p><details id="reportSectionOptions"><summary>Personalizza le sezioni</summary><p>Risultato, grafico e limiti del confronto sono sempre inclusi.</p>'+[['parameters','Altri parametri'],['context','Condizioni e camera'],['methods','Metodo di calcolo'],['sources','Letture incluse']].map(([key,label])=>`<label class="results-report-check"><input type="checkbox" data-report-section="${key}" checked>${label}</label>`).join('')+'</details><div class="results-report-outline"><strong>Nel documento</strong><ol id="reportContentsPreview"></ol></div>';
 $('exportReportCard').prepend(composer);$('experimentReportOpen').textContent='Anteprima / PDF';$('experimentReportDownload').textContent='Scarica HTML';
 $('reportScope').onchange=()=>{settings(root.LCExperiments.current().id).scope=$('reportScope').value;render();};
 composer.addEventListener('change',e=>{if(e.target.dataset.reportSection){settings(root.LCExperiments.current().id)[e.target.dataset.reportSection]=e.target.checked;render();}});
 $('experimentReportMode').addEventListener('change',render);
 const reportOptions=root.LCResultsStory.currentReportOptions;root.LCResultsStory.currentReportOptions=p=>({...reportOptions(p),sections:{...settings(p.id)}});
 $('expPane-export').querySelector('h2').textContent='Prepara il report';$('workspaceReview').open=false;
 $('exportData').append($('boardExportPreview'));
 // Move operational messages close to the action that produced them.
 $('intakeDrop').after($('intakeNotice'));
 // Shorter diary; the existing cards retain their data and action handlers.
 $('journalOverview').hidden=true;$('journalLibrary').querySelector('.journal-header h2').textContent='I tuoi esperimenti';
 $('journalLibrary').querySelector('.journal-header p').textContent='Riprendi il lavoro dal prossimo passo utile.';
 function journal(){for(const card of document.querySelectorAll('.journal-project-card')){const metrics=card.querySelector('.journal-card-metrics');if(metrics)metrics.setAttribute('aria-label','Letture, condizioni e ID biologici distinti');const management=card.querySelector('[data-project-trash]');if(management&&!management.closest('details')){const d=document.createElement('details');d.className='results-project-management';d.innerHTML='<summary>Gestisci</summary>';d.append(management);card.append(d);}}}
 window.addEventListener('lc:journal-render',journal);journal();
 for(const event of ['lc:metrics-render','lc:metric-x','lc:intake-render','lc:experiments-idle','lc:research'])window.addEventListener(event,e=>{if(event==='lc:metrics-render')state=e.detail;render();});
 window.addEventListener('lc:experiment-step',e=>{if(step!==e.detail.step&&!$('expNotice').classList.contains('bad'))$('expNotice').textContent='';step=e.detail.step;render();});
 $('comparisonReference').addEventListener('change',render);ready=true;render();
});
})(globalThis);
