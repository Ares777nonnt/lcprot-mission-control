/* LCpro T Mission Control Research Edition UI · Clarity 1.6 · No telemetry, no remote dependencies */
(function(){'use strict';
const C=window.LCResearchCore, dbName='LCproTResearch_v1',store='experiments';
const $=id=>document.getElementById(id);
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const f=(v,d=2)=>Number.isFinite(v)?Number(v).toFixed(d):'—';
const log=(severity,title,detail,action)=>({severity,title,detail,action});
let db,session=null,parsed=null,analysis=null,sessions=[],exclusions=new Set(),renderedPoints=[];
let lastManualQC=[],metadataSaving=false;
function toast(msg,bad=false){let el=$('researchNotice');el.textContent=msg;el.className='research-notice'+(bad?' bad':'');}
function uniqueId(){return (crypto.randomUUID?crypto.randomUUID():Date.now().toString(36)+'-'+Math.random().toString(36).slice(2));}
function transact(mode,operation){return new Promise((resolve,reject)=>{let tx=db.transaction(store,mode),req=operation(tx.objectStore(store));let result;req.onsuccess=()=>{result=req.result;};tx.oncomplete=()=>resolve(result);tx.onabort=()=>reject(tx.error||Error('Transazione annullata'));tx.onerror=()=>reject(tx.error);});}
function openDb(){return new Promise((resolve,reject)=>{if(!('indexedDB' in window))return reject(Error('IndexedDB non disponibile.'));let req=indexedDB.open(dbName,1);req.onupgradeneeded=()=>{let d=req.result;if(!d.objectStoreNames.contains(store))d.createObjectStore(store,{keyPath:'id'})};req.onsuccess=()=>resolve(req.result);req.onerror=()=>reject(req.error);});}
async function refresh(){sessions=await transact('readonly',o=>o.getAll());sessions.sort((a,b)=>String(b.updated).localeCompare(String(a.updated)));renderSessionSelectors();}
function renderSessionSelectors(){let controls=['researchSelect','healthSelect','curveSelect','reportSelect'];for(let id of controls){const el=$(id);if(!el)continue;let current=session?.id||'';el.innerHTML='<option value="">— Scegli lettura —</option>'+sessions.map(x=>'<option value="'+esc(x.id)+'">'+esc(x.meta?.plant||'Senza ID')+' · '+esc(x.meta?.species||'Specie')+' · '+esc(x.filename||'Nessun CSV')+'</option>').join('');el.value=sessions.some(s=>s.id===current)?current:'';}}
const dateNow=()=>{let d=new Date();return new Date(d.getTime()-d.getTimezoneOffset()*60000).toISOString().slice(0,16)};
const baseMeta=()=>({species:'Ocimum basilicum',cultivar:'',plant:'',leaf:'',operator:'',date:dateNow(),type:'aq',light:'led',treatment:'',area:'',tlmethod:'unknown',co2mode:'ambient',co2set:'',flow:'',temp:'',notes:''});
function metaValue(meta,k){let v=String(meta?.[k]??'');if(k==='date'&&/(Z|[+-]\d\d:\d\d)$/.test(v)){const d=new Date(v);if(!Number.isNaN(+d))v=new Date(d.getTime()-d.getTimezoneOffset()*60000).toISOString().slice(0,16);}return v;}
function fillMeta(meta){for(let e of document.querySelectorAll('[data-rmeta]'))e.value=metaValue(meta,e.dataset.rmeta);}
function readMeta(){let m={};for(let e of document.querySelectorAll('[data-rmeta]'))m[e.dataset.rmeta]=e.value.trim();return m;}
function storageSession(){const out=structuredClone(session);delete out.cameraChanged;return out;}
function stamp(type,detail){session.audit.push({at:new Date().toISOString(),type,detail});session.updated=new Date().toISOString();}
function hasUnsavedChanges(){return !!session&&Object.entries(readMeta()).some(([k,v])=>metaValue(session.meta,k)!==v);}
function allowSwitch(){if(metadataSaving){toast('Attendi il salvataggio della scheda.');return false;}if(!hasUnsavedChanges())return true;if(!confirm('La lettura contiene modifiche non salvate. Scartarle e cambiare lettura?'))return false;window.dispatchEvent(new CustomEvent('lc:draft-discard',{detail:{id:session.id}}));return true;}
async function makeNew(){if(!allowSwitch())return false;
let now=new Date().toISOString();session={id:uniqueId(),created:now,updated:now,meta:baseMeta(),filename:'',rawCsv:'',sha256:'',exclusions:[],exclusionNotes:{},audit:[{at:now,type:'create',detail:'Nuovo esperimento creato'}]};parsed=null;analysis=null;exclusions=new Set();await transact('readwrite',o=>o.put(storageSession()));await refresh();fillMeta(session.meta);renderCurrent();toast('Nuova lettura creata: completa specie, pianta e data, poi salva.');return true;}
async function selectExperiment(id,skipGuard=false,preferredProject){if(metadataSaving)return false;if(id===session?.id&&hasUnsavedChanges())return true;if(id!==session?.id&&!skipGuard&&!allowSwitch()){renderSessionSelectors();return false;}if(!id){session=null;parsed=null;analysis=null;exclusions=new Set();renderCurrent();return;}let found=sessions.find(s=>s.id===id);if(!found){toast('Esperimento non trovato.',true);return;}session=structuredClone(found);const cameraContext=window.LCCamera?.context(session,preferredProject);if(cameraContext)session=window.LCCameraCore.resolve(cameraContext.p,cameraContext.r,session);try{parsed=session.rawCsv?C.readCSV(session.rawCsv):null;}catch(e){parsed=null;toast('CSV archiviato non leggibile: '+e.message,true);}exclusions=new Set(session.exclusions||[]);analysis=null;fillMeta(session.meta||baseMeta());
if(session.fitSettings){$('curveModel').value=session.fitSettings.model||'rect';$('curveGamma').value=String(session.fitSettings.gamma??42.75);$('curveK').value=String(session.fitSettings.k??710);$('curveBootstrap').checked=session.fitSettings.bootstrap!==false;}
else {$('curveModel').value='rect';$('curveGamma').value='42.75';$('curveK').value='710';$('curveBootstrap').checked=true;}
renderSessionSelectors();renderCurrent();return true;}
async function saveMeta(){if(metadataSaving)return false;metadataSaving=true;$('researchSave').disabled=true;try{return await saveMetaInternal();}finally{metadataSaving=false;$('researchSave').disabled=!session;window.dispatchEvent(new Event('lc:research'));}}
async function saveMetaInternal(){if(!session)return toast('Crea o scegli prima un esperimento.',true);let previous=JSON.stringify(session.meta),oldMeta=structuredClone(session.meta),next=readMeta();if(!next.species||!next.plant||!next.date){toast('Completa specie, ID pianta e data prima di salvare.',true);return false;}
if(metaValue(session.meta,'date')===next.date)next.date=session.meta.date;
if(next.type!==session.meta.type){analysis=null;}
const critical=['species','plant','leaf','date','type','area','tlmethod','co2mode','co2set','flow','temp','light','treatment'];
if(session.workflow && critical.some(k=>String(session.meta[k]??'')!==String(next[k]??''))){
 session.workflow.done=[];session.workflow.at=0;session.workflow.checks={};
 stamp('workflow_invalidation','Parametri sperimentali fondamentali modificati: riconsiderare tutte le fasi');
}try{await window.LCCamera?.saveOverrides(session,next);}catch(e){toast(e.message,true);return false;}session.meta=next;delete session.cameraChanged;if(previous!==JSON.stringify(next)){const changes=Object.keys(next).filter(k=>String(oldMeta[k]??'')!==String(next[k]??'')).map(k=>k+': '+String(oldMeta[k]??'')+' → '+String(next[k]??''));stamp('metadata','Modifiche: '+changes.join(' | '));}await transact('readwrite',o=>o.put(storageSession()));await refresh();renderCurrent();if(window.LCGuided)window.LCGuided.sync(true);toast('Metadati della lettura salvati sul dispositivo.');window.dispatchEvent(new CustomEvent('lc:metadata-saved',{detail:{id:session.id}}));return true;}
async function delExperiment(){if(!session||!confirm('Eliminare definitivamente questo esperimento da questo dispositivo? Esporta prima il backup.'))return;let id=session.id;await transact('readwrite',o=>o.delete(id));session=null;parsed=null;analysis=null;exclusions=new Set();await refresh();renderCurrent();toast('Scheda rimossa dall’archivio locale.');}
async function sha256(text){if(!crypto.subtle)return 'non disponibile';const hash=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(text));return [...new Uint8Array(hash)].map(x=>x.toString(16).padStart(2,'0')).join('')}
async function attachCSV(input){let file=input.files?.[0];input.value='';if(!file)return;if(!session)return toast('Prima crea o seleziona una scheda sperimentale.',true);if(session.rawCsv)return toast('CSV originale già allegato e immutabile. Crea una nuova scheda per un altro file.',true);if(file.size>8*1024*1024)return toast('CSV oltre 8 MB: importazione bloccata per la memoria mobile.',true);
try{let raw=await file.text(),test=C.readCSV(raw);if(!test.n)throw Error('Nessun record');session.rawCsv=raw;session.filename=file.name;session.sha256=await sha256(raw);stamp('attach','CSV originale acquisito: '+file.name+'; SHA-256: '+session.sha256);await transact('readwrite',o=>o.put(storageSession()));parsed=test;analysis=null;await refresh();renderCurrent();toast('CSV originale conservato localmente: '+test.n+' record.');}
catch(e){toast('Importazione rifiutata: '+e.message,true);}}
async function saveQuickMeta(changes){if(!session)return false;
  for(const [k,v] of Object.entries(changes)){const el=document.querySelector(`[data-rmeta="${k}"]`);if(el)el.value=v;}
  const m=readMeta();if(!m.species||!m.plant||!m.date){toast('Inserisci almeno specie, ID pianta e data.',true);return false;}
  return await saveMeta();
}
async function attachFile(file){if(!file)return;await attachCSV({files:[file],value:''});}
function download(content,name,type){const blob=content instanceof Blob?content:new Blob([content],{type:type||'application/octet-stream'}),u=URL.createObjectURL(blob),a=document.createElement('a');a.href=u;a.download=name;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(u),15000);}
async function exportBackup(){if(!sessions.length)return toast('Nessun esperimento da esportare.',true);let data={format:'LCproT-Research-Backup',schema:1,exported:new Date().toISOString(),experiments:sessions};download(JSON.stringify(data,null,2),'LCproT_Research_Backup_'+new Date().toISOString().slice(0,10)+'.json','application/json;charset=utf-8');toast('Backup completo esportato. Conserva il file in un luogo sicuro.');}
async function importBackup(input){let file=input.files?.[0];input.value='';if(!file)return;if(file.size>45*1024*1024)return toast('Backup oltre 45 MB: non importabile.',true);let data;try{data=JSON.parse(await file.text());if(data.format!=='LCproT-Research-Backup'||data.schema!==1||!Array.isArray(data.experiments))throw Error('Formato o versione backup non supportati');if(data.experiments.length>2000)throw Error('Troppe schede');if(!confirm('Importare '+data.experiments.length+' esperimenti? Gli ID già presenti saranno importati con un nuovo ID, senza sovrascrivere.'))return;
let count=0;for(const x of data.experiments){if(!x?.id||!x?.meta||!Array.isArray(x.audit)||typeof x.rawCsv!=='string')continue;if(x.rawCsv){let parsedFile=C.readCSV(x.rawCsv);if(parsedFile.n<1)continue;let hash=await sha256(x.rawCsv);if(x.sha256&&x.sha256!=='non disponibile'&&x.sha256!==hash)throw Error('Impronta SHA-256 non valida per '+x.filename);}
let item=structuredClone(x);if(sessions.some(s=>s.id===item.id)||await transact('readonly',o=>o.get(item.id))){item.id=uniqueId();item.audit.push({at:new Date().toISOString(),type:'backup_collision',detail:'Importato con nuovo ID per collisione'});}item.updated=new Date().toISOString();await transact('readwrite',o=>o.put(item));count++;}await refresh();toast('Importati '+count+' esperimenti.');}
catch(e){toast('Backup non importato completamente: '+e.message,true);await refresh();}}
function metaCSV(){let cols=['id','species','plant','leaf','date','type','treatment','filename','sha256','created','updated'];let quote=v=>'"'+String(v??'').replaceAll('"','""')+'"';download([cols.join(','),...sessions.map(s=>cols.map(c=>quote(c in s?s[c]:s.meta[c])).join(','))].join('\r\n'),'LCproT_Registro_esperimenti.csv','text/csv;charset=utf-8');}
function renderCurrent(){const cameraContext=window.LCCamera?.context(session);if(cameraContext&&session){const fit=session.fitSnapshots?.at(-1);session.cameraChanged=!!fit&&!!cameraContext.p.cameraSettings&&fit.cameraSignature!==window.LCCameraCore.signature(cameraContext.p,cameraContext.r);}let active=session;for(let id of ['researchSelect','healthSelect','curveSelect','reportSelect'])if($(id))$(id).value=active?.id||'';
$('researchSummary').innerHTML=active?'<b>'+esc(active.meta?.species)+' / '+esc(active.meta?.plant||'ID da inserire')+'</b> · '+esc(active.meta?.type?.toUpperCase())+' · '+(active.rawCsv?'<b>'+esc(active.filename)+'</b>, '+(parsed?.n||'?')+' record':'Nessun CSV collegato')+'<br><small>Creato: '+esc(active.created)+' · SHA-256: '+esc(active.sha256||'—')+'</small>':'Nessuna scheda selezionata. Crea un esperimento per iniziare.';
$('researchAudit').innerHTML=active?(active.audit||[]).slice().reverse().map(e=>'<li><time>'+esc(e.at)+'</time> · <strong>'+esc(e.type)+'</strong> · '+esc(e.detail)+'</li>').join(''):'<li>Nessun evento</li>';
renderHealth();renderCurve();renderReport();if(window.LCGuided)window.LCGuided.sync();window.dispatchEvent(new CustomEvent('lc:research'));}
function showRules(items,target){$(target).innerHTML=items.map(x=>'<div class="research-rule '+esc(x.severity)+'"><b>'+({error:'⛔',warning:'⚠️',info:'ℹ️',ok:'✓'}[x.severity]||'•')+' '+esc(x.title)+'</b><p>'+esc(x.detail)+'</p><small><strong>Verifica consigliata:</strong> '+esc(x.action)+'</small></div>').join('')||'<p>Non valutabile: dati assenti.</p>'}
function renderHealth(){if(session&&parsed){let checks=C.diagnose(parsed.rows,session.meta);showRules(checks,'healthRules');$('healthSummary').textContent=parsed.rows.length+' record · '+checks.filter(x=>x.severity==='warning'||x.severity==='error').length+' segnalazioni da verificare. Regole v1.0 (non certificazione strumentale).';}else {$('healthRules').innerHTML='<p class="research-faint">Nessun CSV collegato: puoi usare il controllo manuale qui sotto.</p>';$('healthSummary').textContent='Apri una scheda con CSV per avviare la diagnosi automatica.';}}
function runManual(){let o={};for(let el of document.querySelectorAll('[data-rmanual]'))o[el.dataset.rmanual]=C.num(el.value);o.tlmethod=$('manualTlMethod').value;const meta={tlmethod:o.tlmethod,co2mode:$('manualCo2Mode').value,co2set:$('manualCO2set').value};lastManualQC=C.diagnose(o,meta);showRules(lastManualQC,'manualHealthResults');$('healthManualNote').textContent='Controllo manuale eseguito: non archiviato automaticamente nella scheda sperimentale.';}
function getPoints(){if(!parsed||!session)return [];let kind=session.meta.type;return parsed.rows.map(r=>({index:r.index,x:kind==='aci'?r.ci:r.q,a:r.a,q:r.q,ci:r.ci})).filter(r=>Number.isFinite(r.x)&&Number.isFinite(r.a)&&!exclusions.has(r.index));}
function currentModel(){return $('curveModel').value;}
function renderCurve(){if(!session||!parsed){$('curveIntro').textContent='Seleziona una scheda con CSV per analizzare la curva.';$('curveResults').innerHTML='';$('curvePoints').innerHTML='';$('researchSVG').innerHTML='';$('curveNotes').innerHTML='';analysis=null;return;}
const kind=session.meta.type;if(kind==='spot'){$('curveIntro').textContent='Misura puntuale: fit di curva non applicabile.';$('curveResults').innerHTML='';$('curvePoints').innerHTML='';$('researchSVG').innerHTML='';analysis=null;return;}
$('curveIntro').textContent='Lettura '+session.meta.plant+' · '+session.filename+' · '+parsed.rows.length+' record; '+exclusions.size+' esclusi. '+(kind==='aci'?'Ci misurato/calcolato dall’LCpro T sull’asse X.':'Qleaf effettivo sull’asse X.');
$('curveControlsAQ').hidden=kind!=='aq';$('curveControlsCi').hidden=kind!=='aci';$('curveModel').value=['rect','nonrect'].includes($('curveModel').value)?$('curveModel').value:'rect';
let valid=parsed.rows.filter(r=>Number.isFinite(kind==='aci'?r.ci:r.q)&&Number.isFinite(r.a));$('curvePoints').innerHTML=valid.map(r=>{let excluded=exclusions.has(r.index);return '<tr><td><input type="checkbox" data-point="'+r.index+'" '+(!excluded?'checked':'')+' aria-label="Includi record '+r.index+'"></td><td>'+r.index+'</td><td>'+esc(String(kind==='aci'?r.ci:r.q))+'</td><td>'+esc(String(r.a))+'</td><td>'+esc(session.exclusionNotes?.[r.index]||'')+'</td></tr>'}).join('');
$('curvePoints').querySelectorAll('[data-point]').forEach(el=>el.addEventListener('change',()=>togglePoint(Number(el.dataset.point),el.checked)));
recomputeFit();}
async function togglePoint(idx,included){if(!session)return;if(!included){let reason=window.LCClarity?.chooseExclusion?await window.LCClarity.chooseExclusion(idx):prompt('Motivo dell’esclusione del record '+idx+' (obbligatorio):','Misura non stabilizzata / anomalia documentata');if(!reason?.trim()){renderCurve();return;}exclusions.add(idx);session.exclusionNotes=session.exclusionNotes||{};session.exclusionNotes[idx]=reason.trim();stamp('exclude','Record '+idx+' escluso: '+reason.trim());}else {exclusions.delete(idx);delete session.exclusionNotes?.[idx];stamp('include','Record '+idx+' nuovamente incluso');}session.exclusions=[...exclusions];await transact('readwrite',o=>o.put(storageSession()));await refresh();renderCurve();}
function recomputeFit(){if(!parsed||!session||session.meta.type==='spot')return;let points=getPoints(),kind=session.meta.type;const opts={bootstrap: $('curveBootstrap').checked};if(kind==='aq')opts.model=currentModel();else{opts.gamma=C.num($('curveGamma').value);opts.k=C.num($('curveK').value);if(!Number.isFinite(opts.gamma)||opts.gamma<0||opts.gamma>150||!Number.isFinite(opts.k)||opts.k<=100){$('curveResults').innerHTML='<p>Controlla Γ* e K prima del fit.</p>';analysis=null;return;}}
analysis=kind==='aci'?C.fitCi(points,opts):C.fitLight(points,opts);
if(analysis.ok){
  const quality=[];
  if(kind==='aci'){
    const par=parsed.rows.filter(z=>!exclusions.has(z.index)&&Number.isFinite(z.q)).map(z=>z.q);
    if(par.length>2){let mean=par.reduce((a,b)=>a+b,0)/par.length, range=Math.max(...par)-Math.min(...par);
      if(mean<400)quality.push('PAR medio relativamente basso per una curva A/Ci ('+f(mean,0)+'): la risposta non può essere interpretata automaticamente come limitata dalla sola CO₂.');
      if(range>Math.max(50,mean*.10))quality.push('PAR non costante lungo la curva A/Ci (intervallo '+f(range,0)+'): stimatori biochimici potenzialmente confusi.');
    }else quality.push('Manca Qleaf per documentare luce costante durante la curva A/Ci.');
  }else{
    const cref=parsed.rows.filter(z=>!exclusions.has(z.index)&&Number.isFinite(z.cref)).map(z=>z.cref);
    if(cref.length>2&&Math.max(...cref)-Math.min(...cref)>30)quality.push('CO₂ref varia oltre 30 ppm tra gli step A/Q: la risposta potrebbe non dipendere soltanto dal PAR.');
  }
  const tl=parsed.rows.filter(z=>!exclusions.has(z.index)&&Number.isFinite(z.tleaf)).map(z=>z.tleaf);
  if(!tl.length)quality.push('Tleaf non disponibile nei record: interpretazione fisiologica e parametri termodipendenti non validabili.');
  else if(Math.max(...tl)-Math.min(...tl)>2)quality.push('Tleaf varia di oltre 2 °C nella sequenza: verificare il protocollo.');
  analysis.issues.push(...quality);
  if(kind==='aq'){
    let alt=C.fitLight(points,{model:opts.model==='rect'?'nonrect':'rect',bootstrap:false});
    if(alt.ok){analysis.comparison={alternative:alt.model,aicc:alt.metrics.aicc,r2:alt.metrics.r2};}
  }
}
if(!analysis.ok){$('curveResults').innerHTML='<p class="research-warning">'+esc(analysis.reason)+'</p>';$('curveNotes').innerHTML='';drawSVG(points,null);return;}
let p=analysis.params,m=analysis.metrics,rows=Object.entries(p).map(([k,v])=>'<tr><td>'+esc(k)+'</td><td>'+f(v,4)+'</td><td>'+ (analysis.ci[k]&&analysis.ci[k][0]!=null?f(analysis.ci[k][0],4)+' – '+f(analysis.ci[k][1],4):'non stimabile')+'</td></tr>').join('');
const observed=Math.max(...points.map(z=>z.a));
const qmax=Math.max(...points.map(z=>z.x));
const hasSat=kind==='aq'&&Number.isFinite(p.Asat);
const saturationBeyond=kind==='aq'&&Number.isFinite(p.Q90)&&p.Q90>qmax;
const headline='<div class="clarity-photosynthesis"><div><small>Amax osservata · massimo reale nei punti inclusi</small><strong>'+f(observed,2)+'</strong><span>µmol CO₂ m⁻² s⁻¹</span></div><div><small>'+(kind==='aq'?'Asat stimata · asintoto netto del modello':'Asat · non prevista dal modello A/Ci')+'</small><strong>'+(hasSat?f(p.Asat,2):'—')+'</strong><span>'+(hasSat?'µmol CO₂ m⁻² s⁻¹':'Non applicabile')+'</span></div></div>'+(saturationBeyond?'<p class="clarity-fit-warning">⚠ Q90 oltre il massimo PAR misurato: saturazione stimata per estrapolazione. Asat non è una misura diretta.</p>':'');
$('curveResults').innerHTML=headline+'<div class="research-metrics"><div><strong>'+f(m.r2,3)+'</strong><small>R²</small></div><div><strong>'+f(m.rmse,3)+'</strong><small>RMSE (A)</small></div><div><strong>'+f(m.aicc,2)+'</strong><small>AICc</small></div><div><strong>'+m.n+'</strong><small>Punti inclusi</small></div></div><div class="lab-table-wrap"><table class="lab-table"><thead><tr><th>Parametro</th><th>Stima</th><th>Bootstrap IC 95% esplorativo</th></tr></thead><tbody>'+rows+'</tbody></table></div>'+ (analysis.comparison?'<p class="research-faint">Confronto AICc a parità di dati: modello alternativo '+esc(analysis.comparison.alternative)+' = '+f(analysis.comparison.aicc,2)+'; modello selezionato = '+f(m.aicc,2)+'. Confrontare anche plausibilità e residui, non solo AICc.</p>':'')+'<p class="research-faint">Bootstrap resampling: '+analysis.bootstrapN+' campioni validi; gli IC sono indicativi e non sostituiscono repliche biologiche.</p>';
$('curveNotes').innerHTML=analysis.issues.map(s=>'<p class="research-warning">⚠ '+esc(s)+'</p>').join('')+(kind==='aq'?'<p>α: pendenza apparente; Rd del modello non equivale necessariamente alla respirazione mitocondriale alla luce. Q90 = 90% della saturazione lorda prevista; non è automaticamente saturazione sperimentale.</p>':'<p>Modello FvCB minimale con Γ* e K fissati; Joper è il trasporto elettronico operativo modellizzato, NON Jmax. Vcmax apparente dipende anche da gm e dalle ipotesi adottate. Per pubblicazione utilizzare procedure e costanti fisiologiche validate.</p>');drawSVG(points,analysis);}
function drawSVG(points,fit){let svg=$('researchSVG');if(!points.length){svg.innerHTML='';return;}let xvals=points.map(p=>p.x),yvals=points.map(p=>p.a),xmin=Math.min(...xvals),xmax=Math.max(...xvals),ymin=Math.min(0,...yvals),ymax=Math.max(0,...yvals);if(xmax<=xmin)xmax=xmin+1;if(ymax<=ymin)ymax=ymin+1;let dy=ymax-ymin;ymin-=dy*.12;ymax+=dy*.12;
const W=920,H=490,L=80,R=25,T=25,B=70,xx=x=>L+(x-xmin)/(xmax-xmin)*(W-L-R),yy=y=>H-B-(y-ymin)/(ymax-ymin)*(H-T-B);let a=['<rect x="0" y="0" width="920" height="490" rx="16" fill="#f6fbfd"/>'];for(let j=0;j<=5;j++){let px=L+(W-L-R)*j/5,py=T+(H-T-B)*j/5;a.push(`<path d="M ${px} ${T} V ${H-B} M ${L} ${py} H ${W-R}" stroke="#dbe8ed"/>`,`<text x="${px}" y="${H-B+22}" text-anchor="middle" font-size="13" fill="#526a77">${f(xmin+(xmax-xmin)*j/5,0)}</text>`,`<text x="${L-13}" y="${py+5}" text-anchor="end" font-size="13" fill="#526a77">${f(ymax-(ymax-ymin)*j/5,1)}</text>`)}
if(fit?.ok){let line='';for(let i=0;i<=200;i++){let x=xmin+(xmax-xmin)*i/200,y=fit.curve(x,fit.rawParams);line+=(i?'L ':'M ')+f(xx(x),2)+' '+f(yy(y),2)+' ';}a.push('<path class="lc-fit-line" pathLength="1" d="'+line+'" fill="none" stroke="#d37a39" stroke-width="3"/>');}
for(let p of points){a.push(`<circle cx="${xx(p.x)}" cy="${yy(p.a)}" r="5" fill="#087b77" stroke="#ffffff" stroke-width="1.5"><title>Record ${p.index}, X=${p.x}, A=${p.a}</title></circle>`)}
a.push(`<text x="${W/2}" y="${H-15}" font-size="16" font-weight="700" fill="#274d5e" text-anchor="middle">${session.meta.type==='aci'?'Ci (µmol mol⁻¹)':'Qleaf (µmol fotoni m⁻² s⁻¹)'}</text><text x="18" y="240" font-size="16" font-weight="700" fill="#274d5e" transform="rotate(-90 18 240)" text-anchor="middle">A (µmol CO₂ m⁻² s⁻¹)</text>`);svg.innerHTML=a.join('');
let residual=$('researchResidualSVG');if(!fit?.ok){residual.innerHTML='';return;}let res=points.map(p=>({x:p.x,y:p.a-fit.curve(p.x,fit.rawParams)})),mag=Math.max(.05,...res.map(z=>Math.abs(z.y)));residual.innerHTML='<rect width="920" height="210" fill="#f6fbfd" rx="12"/><path d="M 80 105 H 895" stroke="#5c7c89" stroke-dasharray="5 4"/>'+res.map(p=>`<circle cx="${xx(p.x)}" cy="${105-p.y/mag*65}" r="4.5" fill="#087b77"><title>${f(p.y,4)}</title></circle>`).join('')+'<text x="35" y="24" fill="#3a5864" font-size="14">Residui A</text>';}
function saveCurveSvg(){if(!analysis?.ok)return toast('Adatta prima una curva valida.',true);download('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 920 490">'+$('researchSVG').innerHTML+'</svg>','LCproT_Research_Curve.svg','image/svg+xml');}
async function commitFit(){
 if(!session||!analysis?.ok)return toast('Importa un CSV e produci un fit valido prima di salvare.',true);
 const settings={model:currentModel(),gamma:C.num($('curveGamma').value),k:C.num($('curveK').value),bootstrap:$('curveBootstrap').checked};
 const ctx=window.LCCamera?.context(session);const cameraSignature=ctx?window.LCCameraCore.signature(ctx.p,ctx.r):null;
 const snapshot={cameraSignature,at:new Date().toISOString(),originalSHA256:session.sha256,kind:analysis.kind,model:analysis.model,settings,excluded:[...exclusions],excludeNotes:structuredClone(session.exclusionNotes||{}),params:structuredClone(analysis.params),metrics:structuredClone(analysis.metrics),ci:structuredClone(analysis.ci),issues:[...analysis.issues],bootstrapN:analysis.bootstrapN};
 delete session.cameraChanged;session.fitSettings=settings;session.fitSnapshots=[...(session.fitSnapshots||[]),snapshot].slice(-30);
 stamp('fit_saved','Fit '+analysis.model+' salvato: '+analysis.metrics.n+' punti, esclusi '+exclusions.size+'; R² = '+f(analysis.metrics.r2,3));
 await transact('readwrite',o=>o.put(storageSession()));await refresh();renderCurrent();toast('Analisi, scelte del modello e parametri salvati nel diario (ultime 30 versioni).');
}
function saveAnalysisJson(){if(!session||!analysis?.ok)return toast('Nessun fit da esportare.',true);let r={software:'LCproT Research 1.1.0',experimentId:session.id,file:session.filename,sha256:session.sha256,meta:session.meta,exclusions:session.exclusions,exclusionNotes:session.exclusionNotes,fit:{kind:analysis.kind,model:analysis.model,params:analysis.params,metrics:analysis.metrics,issues:analysis.issues,bootstrapN:analysis.bootstrapN,ci:analysis.ci,regimes:analysis.regimes,setup:analysis.setup}};download(JSON.stringify(r,null,2),'LCproT_Research_fit_'+session.meta.plant+'.json','application/json');}
function makeReport(){
 if(!session)return null;
 const a=analysis?.ok?analysis:null;
 const m=session.meta||{};
 const all=parsed?.rows||[];
 const included=all.filter((r)=>Number.isFinite(r.a)&&!(session.exclusions||[]).includes(r.index));
 const ys=included.map(r=>r.a);
 const observed=ys.length?Math.max(...ys):NaN;
 const q=parsed?C.diagnose(all,m):[];
 const finite=n=>Number.isFinite(n);
 const display=(v)=>v===undefined||v===null||String(v).trim()===''?'—':esc(String(v));
 const fmt=(v,n=2)=>finite(v)?f(v,n):'—';
 const unitAQ='µmol CO₂ m⁻² s⁻¹',unitPAR='µmol fotoni m⁻² s⁻¹';
 const modelA=a?.kind==='aq'&&finite(a.params?.Asat)?a.params.Asat:NaN;
 const metrics=a?.metrics||{};
 const aqLegend={alpha:['α (rendimento apparente)','Pendenza iniziale della risposta alla luce','mol CO₂ / mol fotoni'],P:['P (asintoto lordo)','Assimilazione lorda asintotica stimata',unitAQ],Rd:['Rd (apparente)','Termine respiratorio stimato dal modello, non una misura indipendente',unitAQ],Asat:['Asat (netta stimata)','Asintoto netto P − Rd; può richiedere estrapolazione',unitAQ],LCP:['LCP','Luce alla quale A netta = 0',unitPAR],Q90:['Q90','PAR per il 90% della risposta modellizzata',unitPAR]};
 const aciLegend={Vcmax:['Vcmax apparente','Capacità massima apparente di carbossilazione; dipende dalle ipotesi',unitAQ],Joper:['J operativo','Flusso elettronico operativo modellizzato, non Jmax','µmol e⁻ m⁻² s⁻¹'],Rd:aqLegend.Rd};
 const legend=a?.kind==='aci'?aciLegend:aqLegend;
 const keyParams=a?Object.entries(a.params||{}).filter(([k,v])=>legend[k]&&finite(v)):[];
 const legendRows=keyParams.map(([k,v])=>{const [label,explain,unit]=legend[k];return `<tr><td><b>${esc(label)}</b></td><td class="n">${fmt(v,k==='alpha'?4:2)}</td><td>${esc(unit)}</td><td>${esc(explain)}</td></tr>`}).join('');
 const conciseMeta=[['Specie',m.species],['Pianta / foglia',[m.plant,m.leaf].filter(Boolean).join(' / ')],['Tipo',m.type==='aq'?'A/Q':m.type==='aci'?'A/Ci':m.type],['Trattamento',m.treatment],['Data',m.date],['CO₂',m.co2mode],['Tleaf',m.tlmethod],['Area fogliare',m.area?String(m.area)+' cm²':'']].filter(([k,v])=>v!==undefined&&v!==null&&String(v).trim());
 const metadata=conciseMeta.map(([k,v])=>`<span><b>${esc(k)}</b> ${display(v)}</span>`).join('');
 const hasIssue=Array.isArray(a?.issues)&&a.issues.length;
 const qa=q.filter(x=>x.severity==='warning'||x.severity==='error'); const qItems=qa.slice(0,4).map(x=>esc(x.title)).join(' · ');
 const issues=a?.issues?.slice(0,2).map(x=>esc(x)).join(' · ')||'';
 const qMore=Math.max(0,qa.length-4), modelIssuesMore=Math.max(0,(a?.issues||[]).length-2);
 const notes=String(session.workflow?.qcNote||'').trim();
 const notesHtml=notes?`<p class="user-note"><b>Nota operatore (non validazione):</b> ${esc(notes)}</p>`:'';
 const svg= a&&$('researchSVG')?.innerHTML?`<svg viewBox="0 0 920 490" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Curva sperimentale A/Q o A/Ci">${$('researchSVG').innerHTML}</svg>`:'';
 const upperQ=a?.kind==='aq'&&finite(a.params?.Q90)&&all.some(z=>Number.isFinite(z.q))&&a.params.Q90>Math.max(...all.map(z=>z.q).filter(finite));
 const caution=upperQ?'<p class="caution">La saturazione è stimata oltre la PAR misurata: non interpretare Asat come un massimo osservato.</p>':'';
 const reportDate=esc(new Date().toLocaleString('it-IT'));
 return `<!doctype html><html lang="it"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>LCpro T · ${display(m.plant||'Report')}</title><style>
 *{box-sizing:border-box}html{color-scheme:light}body{max-width:840px;margin:0 auto;padding:24px 30px;font-family:system-ui,-apple-system,'Segoe UI',Arial,sans-serif;font-size:12.5px;line-height:1.42;color:#233d42;background:#fff}
 header{display:flex;justify-content:space-between;gap:16px;align-items:start;border-bottom:2px solid #087b77;padding-bottom:14px;margin-bottom:13px}.eyebrow{font-size:10px;letter-spacing:1.15px;font-weight:800;color:#098073;text-transform:uppercase}h1{font-size:22px;line-height:1.18;margin:5px 0}header .sub{font-size:11px;color:#647780}.tag{font-size:11px;color:#536e6d;text-align:right}
 .printbar{display:flex;justify-content:space-between;align-items:center;gap:15px;position:sticky;top:0;background:#f0f8f5;border:1px solid #d6e5dd;padding:10px 12px;margin:-10px 0 19px;border-radius:9px}.printbar button{padding:9px 13px;color:#fff;background:#087b77;border:0;border-radius:7px;font-weight:700;cursor:pointer}
 h2{font-size:12px;text-transform:uppercase;letter-spacing:.6px;color:#356563;margin:19px 0 9px}section{break-inside:avoid} .metadata{display:flex;flex-wrap:wrap;gap:6px}.metadata span{background:#f0f6f4;padding:6px 9px;border-radius:6px;white-space:normal}.metadata b{color:#57716e;margin-right:4px;font-size:10px}.kpis{display:grid;grid-template-columns:repeat(3,1fr);gap:9px;margin:12px 0}.kpi{border:1px solid #d7e6e1;background:#f7fbf9;border-radius:9px;padding:11px}.kpi small{display:block;color:#507069;font-size:10px}.kpi strong{display:block;font-size:22px;margin:3px 0;color:#123c3b;font-weight:750}.kpi span{font-size:9px;color:#607b74}
 /* Semantic emphasis: observed green, modeled blue. Neither is an automatic quality rating. */
 .kpi:first-child{background:#eef9f4;border:1px solid #9bceba;border-left:4px solid #14795d}
 .kpi:first-child strong{color:#0b6c52}
 .kpi:nth-child(2){background:#f0f6fd;border:1px solid #b3cfe8;border-left:4px solid #3474a9}
 .kpi:nth-child(2) strong{color:#235d93}
 .kpi:nth-child(3){background:#f5f8fa;border-color:#dbe5e9}
 .kpi strong{font-variant-numeric:tabular-nums}
 .qa-summary{border-left:3px solid #c99235;padding-left:10px}
 .caution{font-weight:650}
 
 svg{display:block;width:100%;height:auto;max-height:340px;break-inside:avoid;border:1px solid #e2ebeb;border-radius:7px} .fitline{margin:9px 0;color:#4d6869;font-size:11px}.caution{background:#fff7e8;color:#714b17;border-left:3px solid #dba44d;padding:8px 11px;border-radius:3px} .user-note{margin:7px 0}ul{margin:5px 0 0;padding-left:18px}li{margin:4px 0} .muted{color:#60757b;font-size:11px}
 table{width:100%;border-collapse:collapse;table-layout:auto;font-size:10px}th{background:#f1f6f5;color:#426362;text-align:left;font-size:10px}th,td{padding:6px 7px;border-bottom:1px solid #e0e9e8;vertical-align:top}td.n{text-align:right;font-variant-numeric:tabular-nums;white-space:nowrap;font-weight:700}td:nth-child(3){white-space:normal;min-width:80px}.qa-summary p{margin:4px 0;font-size:10.3px}.qa-summary .muted{font-size:9.5px}footer{border-top:1px solid #dce6e3;margin-top:18px;padding-top:9px;font-size:9px;color:#617576;line-height:1.5;overflow-wrap:anywhere}.legend{break-before:auto;break-inside:avoid}
 @media(max-width:600px){body{padding:16px}.kpis{grid-template-columns:repeat(2,1fr)}h1{font-size:20px}table{font-size:9px}}
 @media print{@page{size:A4;margin:10mm}body{width:auto;max-width:none;padding:0;font-size:9.5pt;zoom:.90;-webkit-print-color-adjust:exact;print-color-adjust:exact}.printbar{display:none}h2{break-after:avoid;margin:13px 0 7px}.kpi strong{font-size:20px}svg{max-height:67mm}section{break-inside:auto}.metadata span{padding:4px 6px}table{font-size:8.5pt}footer{font-size:8pt} .legend{break-inside:auto}tr{break-inside:avoid}}
 </style></head><body>
 <div class="printbar"><span>Anteprima pulita · PDF tramite stampa del browser</span><button onclick="window.print()">Stampa / Salva PDF</button></div>
 <header><div><div class="eyebrow">LCpro T · Research report</div><h1>${display(m.species||'Esperimento fotosintetico')}</h1><div class="sub">${display(m.plant||'Campione')} · ${display(session.filename||'CSV non allegato')}</div></div><div class="tag">${reportDate}<br>${a?'Fit disponibile':'Fit non disponibile'}</div></header>
 <section><div class="metadata">${metadata}</div></section>
 <section><h2>Risultati principali</h2><div class="kpis"><div class="kpi"><small>Amax osservata</small><strong>${fmt(observed)}</strong><span>${unitAQ}</span></div><div class="kpi"><small>Asat stimata ${a?.kind==='aq'?'(modello)':''}</small><strong>${fmt(modelA)}</strong><span>${unitAQ}</span></div><div class="kpi"><small>R² / RMSE</small><strong>${a?fmt(metrics.r2,3)+' / '+fmt(metrics.rmse,2):'—'}</strong><span>${a?'Qualità matematica del fit':'Esegui prima l’analisi'}</span></div></div>${caution}</section>
 <section><h2>Curva ${m.type==='aci'?'A/Ci':'A/Q'}</h2>${svg||'<p class="muted">Grafico non disponibile. Apri Curve Lab ed esegui il fit.</p>'}<p class="fitline"><b>Modello:</b> ${a?display(a.model):'—'} &nbsp; · &nbsp; <b>Punti utilizzati:</b> ${a?fmt(metrics.n,0):'—'} &nbsp; · &nbsp; <b>Esclusi:</b> ${(session.exclusions||[]).length}</p></section>
 <section><h2>Parametri e legenda</h2><table><thead><tr><th>Parametro</th><th style="text-align:right">Stima</th><th>Unità</th><th>Significato</th></tr></thead><tbody>${legendRows||'<tr><td colspan="4">Parametri non disponibili: eseguire prima il fit.</td></tr>'}</tbody></table><p class="muted">A = assimilazione netta; Qleaf = luce effettiva sulla foglia; Ci = CO₂ intercellulare stimata; gs = conduttanza stomatica; E = traspirazione. Le stime del modello non equivalgono sempre a osservazioni dirette.</p></section>
 ${(qItems||issues||notesHtml)?`<section class="qa-summary"><h2>Qualità dei dati</h2>${notesHtml}${qItems?`<p><b>Avvisi:</b> ${qItems}${qMore?` · +${qMore} nell'app`:''}</p>`:''}${issues?`<p><b>Limiti del fit:</b> ${issues}${modelIssuesMore?` · +${modelIssuesMore} nell'app`:''}</p>`:''}<p class="muted">Controllo automatico orientativo; dettagli nell'app.</p></section>`:''}
 <footer><b>Origine dati:</b> ${display(session.filename||'non allegato')} · ${all.length} record originali · Esclusioni: ${display((session.exclusions||[]).join(', ')||'nessuna')}<br>Hash CSV (SHA-256): ${display(session.sha256||'non disponibile')}<br>Per riprodurre l'analisi conserva CSV originale, backup JSON e impostazioni di Curve Lab. Il registro completo delle decisioni resta nell'archivio dati, non in questo riepilogo.</footer>
 </body></html>`;
}
function openReport(){let html=makeReport();if(!html)return toast('Seleziona un esperimento prima di creare il report.',true);let blob=new Blob([html],{type:'text/html;charset=utf-8'}),url=URL.createObjectURL(blob);const tab=window.open(url,'_blank');if(!tab){download(html,'LCproT_Research_Report.html','text/html;charset=utf-8');toast('Popup bloccato: report HTML scaricato. Aprilo e usa Stampa → Salva come PDF.');}else{toast('Report aperto in nuova scheda. Premi Stampa / Salva PDF.');setTimeout(()=>URL.revokeObjectURL(url),60000);}}
function saveReportHtml(){let html=makeReport();if(!html)return toast('Seleziona un esperimento.',true);download(html,'LCproT_Research_Report_'+(session.meta.plant||'exp')+'.html','text/html;charset=utf-8');}
function renderReport(){let e=$('reportSummary');const obs=parsed?parsed.rows.filter(r=>Number.isFinite(r.a)).map(r=>r.a):[];const amax=obs.length?Math.max(...obs):NaN;const asym=analysis?.ok&&analysis.kind==='aq'?analysis.params.Asat:NaN;e.innerHTML=session?'<b>'+esc(session.meta.species)+' · '+esc(session.meta.plant||'ID da inserire')+'</b><p>'+esc(session.filename||'Nessun CSV')+' · '+(analysis?.ok?'Fit disponibile ('+esc(analysis.model)+')':'Fit non presente / non eseguibile')+'</p><div class="clarity-summary-numbers"><div><b>Amax osservata</b><strong>'+f(amax,2)+'</strong></div><div><b>Asat stimata</b><strong>'+f(asym,2)+'</strong></div></div><small>Valori in µmol CO₂ m⁻² s⁻¹. Asat è una stima del modello e potrebbe richiedere estrapolazione.</small><br><small>Apri Curve Lab ed esegui il fit PRIMA del report per includere grafico e parametri. Il report fotografa lo stato della sessione corrente.</small>':'Nessun esperimento selezionato.';}
function onTab(name){if(['health','research-curves','report','log','protocol'].includes(name))renderCurrent();}
async function saveWorkflow(w){if(!session)return;const old=session.workflow;
// All stages are operator-attested; log stage completion changes and preserve original CSV.
const newlyDone=(w.done||[]).filter(n=>!(old?.done||[]).includes(n));
session.workflow=w;
for(const n of newlyDone)stamp('workflow_stage','Passaggio '+(n+1)+' completato: '+['Scheda','SQS','Camera','Acclimatazione','Acquisizione','CSV','Health Check','Curve Lab','Report / Backup'][n]);
await transact('readwrite',o=>o.put(storageSession()));await refresh();}
async function openReading(reading,context){
 const id='reading:'+reading.id;if(id!==session?.id&&!allowSwitch())return false;const existing=await transact('readonly',o=>o.get(id));
 if(!existing){const now=new Date().toISOString(),meta={...baseMeta(),species:'',...(reading.meta||{}),plant:reading.bio||reading.meta?.plant||'Da assegnare',type:context.kind,treatment:context.condition,notes:[reading.meta?.notes,'Esperimento: '+context.experiment].filter(Boolean).join('\n')};
 const item={id,created:now,updated:now,meta,filename:reading.name,rawCsv:reading.rawCsv,sha256:reading.sha256||'',exclusions:reading.exclusions||[],exclusionNotes:{},audit:[{at:now,type:'experiment_reading',detail:'Lettura collegata a '+context.experiment+' / '+context.condition}]};await transact('readwrite',o=>o.put(item));}
 await refresh();return await selectExperiment(id,true);
}
async function bulkMetadata(items,changes){
 const allowed=['species','cultivar','operator','date','treatment'];
 const keys=Object.keys(changes);if(!items.length||items.length>200||!keys.length||keys.some(k=>!allowed.includes(k)||typeof changes[k]!=='string'||!changes[k].trim()))throw Error('Seleziona fino a 200 letture e almeno un campo non vuoto.');
 if(keys.some(k=>changes[k].length>1000))throw Error('Valore troppo lungo.');
 if(changes.date&&!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(changes.date))throw Error('Data non valida.');
 const ids=new Set(items.map(i=>i.id));if(ids.size!==items.length)throw Error('Letture duplicate nella selezione.');
 if(session&&ids.has(session.id)&&hasUnsavedChanges())throw Error('Salva prima le modifiche della lettura aperta.');
 await window.LCRecovery?.flushMetadata();const drafts=await window.LCVault.getDrafts();if(drafts.some(d=>d.type==='metadata'&&ids.has(d.recordId)))throw Error('Alcune letture hanno bozze di metadati: recuperale o scartale nel Diario prima della modifica multipla.');
 let changed=0;const batch=uniqueId(),now=new Date().toISOString();
 await new Promise((resolve,reject)=>{const t=db.transaction(store,'readwrite'),o=t.objectStore(store),q=o.getAll();let failure;
 q.onsuccess=()=>{try{const next=[];for(const item of items){const found=q.result.find(r=>r.id===item.id);
 if(item.expected===null?!!found:!found||JSON.stringify(found)!==item.expected)throw Error('Una lettura è cambiata dopo l’anteprima. Chiudi e prepara una nuova selezione.');
 const r=structuredClone(found||item.template);if(!r||r.id!==item.id||typeof r.rawCsv!=='string')throw Error('Lettura non valida.');
 const old=r.meta||{},meta={...old,...changes},diff=keys.filter(k=>String(old[k]??'')!==changes[k]);if(!diff.length)continue;
 r.meta=meta;r.audit=Array.isArray(r.audit)?r.audit:[];if(r.workflow&&diff.some(k=>['species','date','treatment'].includes(k))){r.workflow.done=[];r.workflow.at=0;r.workflow.checks={};r.audit.push({at:now,type:'workflow_invalidation',detail:'Metadati modificati in gruppo: riconsiderare le fasi.'});}
 r.audit.push({at:now,type:'metadata',detail:'Modifica multipla '+batch+': '+diff.map(k=>k+': '+String(old[k]??'')+' → '+changes[k]).join(' | ')});r.updated=now;next.push(r);
 }for(const r of next)o.put(r);changed=next.length;}catch(e){failure=e;t.abort();}};
 t.oncomplete=resolve;t.onabort=()=>reject(failure||t.error||Error('Modifica annullata'));t.onerror=()=>reject(t.error);
 });
 let refreshWarning='';try{await refresh();if(session&&ids.has(session.id)){session=structuredClone(sessions.find(s=>s.id===session.id));analysis=null;fillMeta(session.meta);renderCurrent();}}catch(e){refreshWarning=e.message;}
 window.dispatchEvent(new Event('lc:bulk-metadata'));return {changed,batch,refreshWarning};
}
window.LCResearch={isSavingMetadata:()=>metadataSaving,bulkMetadata,reloadArchive:refresh,hasUnsavedChanges,openReading,onTab,getState:()=>({session,sessions,parsed,analysis}),saveWorkflow,makeNew,selectExperiment,saveMeta,saveQuickMeta,attachFile};
async function init(){for(let selectId of ['researchSelect','healthSelect','curveSelect','reportSelect'])$(selectId).addEventListener('change',e=>selectExperiment(e.target.value));
$('researchNew').onclick=makeNew;$('researchSave').onclick=saveMeta;$('researchDelete').onclick=delExperiment;$('researchFile').onchange=e=>attachCSV(e.target);$('researchBackup').onclick=exportBackup;$('researchRestore').onchange=e=>importBackup(e.target);$('researchIndex').onclick=metaCSV;
$('healthManualButton').onclick=runManual;
$('curveModel').onchange=recomputeFit;$('curveGamma').onchange=recomputeFit;$('curveK').onchange=recomputeFit;$('curveBootstrap').onchange=recomputeFit;
$('curveSvgSave').onclick=saveCurveSvg;$('curveJsonSave').onclick=saveAnalysisJson;$('curveCommit').onclick=commitFit;
$('reportPreview').onclick=openReport;$('reportHTML').onclick=saveReportHtml;
try{db=await openDb();await refresh();if(sessions.length){await selectExperiment(sessions[0].id);toast('Archivio locale caricato: '+sessions.length+' letture.');}else{fillMeta(baseMeta());renderCurrent();toast('Archivio pronto. Crea il tuo primo esperimento.');}}
catch(e){toast('Archivio non disponibile ('+e.message+'). Verifica le impostazioni del browser, esci dalla modalità privata e riprova.',true);for(let id of ['researchNew','researchSave','researchDelete','researchBackup'])$(id).disabled=true;}}
window.addEventListener('DOMContentLoaded',init);
})();
