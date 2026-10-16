/* LCpro T Research Edition · scientific analysis core v1.0.0
 * Deterministic, local, dependency-free. Parameters are descriptive/conditional estimates.
 * Do not use modelled values as independently measured physiological quantities.
 */
(function(root){'use strict';
const EPS=1e-10;
const num=v=>{const t=String(v??'').trim();if(!t||/^(under|n\/?a|nan|inf|-+)$/i.test(t))return NaN;const x=t.includes(',')&&!t.includes('.')?Number(t.replace(',','.')):Number(t);return Number.isFinite(x)?x:NaN};
const normalize=v=>String(v??'').toLowerCase().replace(/[\s_\-]+/g,'').replace(/\^/g,'');
const finite=v=>Number.isFinite(v);
function csvLine(line,sep){let out=[],v='',quote=false;for(let i=0;i<line.length;i++){let c=line[i];if(c==='"'){if(quote&&line[i+1]==='"'){v+='"';i++}else quote=!quote}else if(c===sep&&!quote){out.push(v.trim());v=''}else v+=c;}out.push(v.trim());return out}
function delimiter(s){return [',',';','\t'].sort((a,b)=>csvLine(s,b).length-csvLine(s,a).length)[0]}
function readCSV(raw){const lines=String(raw).replace(/^\uFEFF/,'').split(/\r\n|\n|\r/).filter(s=>s.trim()&&!s.trim().startsWith('#'));
const hidx=lines.findIndex(line=>{let f=csvLine(line,delimiter(line)).map(normalize);return (f.includes('a')||f.includes('an'))&&(f.includes('qleaf')||f.includes('par')||f.includes('ci'))});let usable=hidx>=0?lines.slice(hidx):lines; if(usable.length<2)throw Error('CSV privo di intestazioni e record sufficienti.');
const sep=delimiter(usable[0]),h=csvLine(usable[0],sep),norm=h.map(normalize);if(!norm.includes('a')&&!norm.includes('an'))throw Error('Colonna A non identificata: servono intestazioni CSV originali LCpro T.');
const candidateRows=usable.slice(1).map(l=>csvLine(l,sep)),rows=candidateRows.filter(r=>r.length>=Math.min(8,h.length)),skippedRows=candidateRows.length-rows.length;if(!rows.length)throw Error('Nessun record riconoscibile.');
if(rows.length>100000)throw Error('Troppe righe per il laboratorio in browser (max 100.000).');
const map={a:['a','an'],q:['qleaf','par'],ci:['ci'],gs:['gs'],e:['e'],tleaf:['tleaf'],tlmethod:['tlmtd'],tch:['tch'],cref:['cref'],co2ctl:['cctl'],area:['area'],record:['record'],datetime:['dt'],time:['tm'],flow:['u'],pressure:['p'],co2delta:['c'],vpd:['vpd']};
const cols={};for(let k of Object.keys(map)){cols[k]=norm.findIndex(z=>map[k].includes(z));}
cols.e=h.findIndex(x=>x.trim()==='E');
const data=rows.map((r,i)=>{const x={index:i+1};for(let k of Object.keys(cols)){let j=cols[k];x[k]=j<0?NaN:(k==='tlmethod'||k==='co2ctl'||k==='datetime'||k==='time'?String(r[j]??'').trim():num(r[j]))};x.raw=r;return x});
return {headers:h,columns:cols,rows:data,n:data.length,delimiter:sep,preamble:hidx>=0,skippedRows,warnings:skippedRows?[skippedRows+' righe dati incomplete (campi insufficienti)']:[]};}
function fmt(v,d=3){return finite(v)?v.toFixed(d):'—'}
const rule=(severity,title,detail,action,code)=>({severity,title,detail,action,code});
function diagnose(input,meta={}){
const r=Array.isArray(input)?input:[input];if(!r.length)return [];
const samples=r.filter(x=>x&&typeof x==='object'),last=samples.at(-1);const n=samples.length;let warnings=[];
const good=(k)=>samples.filter(p=>finite(p[k]));const known=k=>good(k).length;
const mark=(severity,title,detail,action,code)=>warnings.push(rule(severity,title,detail,action,code));
if(!known('a'))mark('error','Assimilazione non disponibile','Nessun valore numerico di A.','Verificare letture, colonne CSV e integrità del file.','A_MISSING');
const badA=samples.filter(p=>finite(p.q)&&p.q>=200&&finite(p.a)&&p.a<0);
if(badA.length)mark('warning','A negativa con luce moderata/alta',`${badA.length}/${n} record con PAR ≥ 200 e A < 0; la causa non è determinabile dal solo CSV.`,'Verificare stabilizzazione, foglia, area, tenuta camera e condizioni fisiologiche.','A_NEG_LIGHT');
if(!known('gs'))mark('info','gs non valutabile','Colonna mancante o senza numeri.','Controllare CSV e disponibilità di Tleaf.','GS_MISSING');
else if(good('gs').every(p=>p.gs===0))mark('warning','gs = 0 in tutti i record','La visualizzazione potrebbe essere arrotondata; Ci dipende anche dal calcolo degli scambi gassosi.','Controllare i valori non arrotondati e Tl mtd; verificare il sensore se selezionato “meas.”.','GS_ZERO');
else if(finite(last?.gs)&&last.gs>0&&last.gs<.05)mark('info','gs relativamente bassa',`Ultima gs ${fmt(last.gs,3)} mol m⁻² s⁻¹: una soglia universale non è applicabile.`, 'Controllare idratazione, VPD, acclimatazione e stabilità prima di interpretare.','GS_LOW');
if(samples.some(p=>p.raw&&p.raw.some(v=>String(v).trim().toLowerCase()==='under'))||samples.some(p=>p.tleaf==='under'))mark('warning','Valori “under” rilevati','Una o più letture del file risultano non valide.','Identificare la colonna interessata, verificare configurazione e sensori.','UNDER');
const noTleaf=samples.filter(p=>!finite(p.tleaf));if(noTleaf.length)mark('warning','Tleaf non disponibile',`${noTleaf.length}/${n} record senza temperatura fogliare numerica.`,'Verificare modalità Tl mtd e sensore; se calc., annotare che è una stima.','TL_MISSING');
if(meta.tlmethod==='calculated'||samples.some(p=>String(p.tlmethod).toLowerCase().startsWith('calc')))mark('info','Tleaf calcolata','La temperatura fogliare stimata non costituisce una misura indipendente.', 'Documentare nel report il metodo Tleaf e la qualità dell’ambiente camera.','TL_CALC');
const mismatch=samples.filter(p=>finite(p.ci)&&finite(p.cref)&&(p.ci>p.cref+25||p.ci<0));if(mismatch.length)mark('warning','Ci da verificare',`${mismatch.length}/${n} valori Ci negativi o > CO₂ref +25 ppm.`,'Controllare qualità di A, gs, E, Tleaf e impostazioni della camera.','CI_RANGE');
let ratios=samples.filter(p=>finite(p.ci)&&finite(p.cref)&&p.cref>0&&finite(p.gs)&&p.gs>0);
if(ratios.length&&ratios.at(-1).ci/ratios.at(-1).cref<.5&&ratios.at(-1).gs<.05)mark('info','Ci/Cref relativamente bassa',`Ultimo rapporto = ${fmt(ratios.at(-1).ci/ratios.at(-1).cref,2)}; Ci e gs non sono misure indipendenti.`, 'Considerare l’ipotesi stomatica solo assieme a VPD, stabilità e condizioni di crescita.','CI_RATIO');
if(meta.co2mode==='ambient')mark('ok','Modalità CO₂ Ambient','La CO₂ref può variare con l’aria aspirata; non va confrontata con un setpoint fisso.','Controllare comunque le oscillazioni durante la sessione.','CO2_AMBIENT');
else if(meta.co2mode==='controlled'){let setp=num(meta.co2set);if(finite(setp)&&known('cref')){let off=good('cref').filter(p=>Math.abs(p.cref-setp)>30);if(off.length)mark('warning','CO₂ref diversa dal setpoint',`${off.length}/${n} record oltre ±30 ppm rispetto al setpoint dichiarato (soglia di screening, non tolleranza strumentale).`,'Controllare modalità di controllo CO₂, concentrazione realmente raggiunta e hardware.','CO2_DRIFT');}}
const areas=good('area');let expected=num(meta.area);if(finite(expected)&&expected>0&&areas.length&&areas.some(p=>Math.abs(p.area-expected)>Math.max(.05,.03*expected)))mark('warning','Area fogliare discordante','L’area dichiarata non coincide con una o più aree riportate dal CSV.','Confermare area effettivamente illuminata e usata nei calcoli dello strumento.','AREA_MISMATCH');
if(samples.length>1){mark('info','Stabilità intra-step non valutabile','Una sequenza con un record per step non permette di determinare la stabilizzazione A/gs nel tempo.','Per valutarla servono letture ripetute a condizioni costanti e relative marche temporali.','STABILITY_UNKNOWN');}
else mark('info','Stabilità non valutabile','Una singola lettura non dimostra la stabilità fisiologica.','Verificare una serie temporale prima di registrare.','STABILITY_UNKNOWN');
if(!warnings.some(w=>w.severity==='warning'||w.severity==='error'))mark('ok','Nessuna anomalia secondo le regole applicate','Questa verifica automatica non certifica l’accuratezza delle misure.','Controllare protocollo e dati originali.','BASIC_OK');
return warnings;}
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
function optimize(data,func,starts,bounds,iterations=230){let best=null;for(const start of starts){let p=start.map((v,j)=>clamp(v,bounds[j][0],bounds[j][1]));let obj=q=>data.reduce((s,z)=>{let err=z.a-func(z.x,q);return s+err*err},0);let loss=obj(p),steps=bounds.map(([l,h],i)=>Math.max((h-l)*.045,Math.abs(p[i])*.2));for(let it=0;it<iterations;it++){let improved=false;for(let j=0;j<p.length;j++){for(let d of [-1,1]){let q=p.slice();q[j]=clamp(p[j]+d*steps[j],bounds[j][0],bounds[j][1]);let f=obj(q);if(f<loss-1e-11){loss=f;p=q;improved=true;}}}if(!improved)steps=steps.map(v=>v*.65);if(Math.max(...steps)<1e-6)break;}if(!best||loss<best.loss)best={params:p,loss};}return best;}
function lightEquation(model,q,p){let [alpha,P,Rd]=p;if(q<0)return NaN;let z=alpha*q;if(model==='rect')return z*P/(z+P)-Rd;const theta=.7;let disc=Math.max(0,(z+P)**2-4*theta*z*P);return (z+P-Math.sqrt(disc))/(2*theta)-Rd;}
function ciEquation(ci,p,setup={}){let [Vc,J,Rd]=p,g=setup.gamma??42.75,k=setup.k??710;let x=Math.max(0,ci-g),ac=Vc*x/(ci+k),aj=J*x/(4*(ci+2*g));return Math.min(ac,aj)-Rd;}
function metrics(data,func,p){const n=data.length,mean=data.reduce((s,z)=>s+z.a,0)/n,sse=data.reduce((s,z)=>s+(z.a-func(z.x,p))**2,0),sst=data.reduce((s,z)=>s+(z.a-mean)**2,0),k=p.length;return {n,sse,rmse:Math.sqrt(sse/n),r2:sst>EPS?1-sse/sst:NaN,aicc:n>k+1&&sse>EPS?n*Math.log(sse/n)+2*k+(2*k*(k+1))/(n-k-1):NaN};}
function bootstrap(data,func,starts,bounds,count){if(!count)return [];let seed=57421,random=()=>{seed=(1664525*seed+1013904223)>>>0;return seed/4294967296};let out=[];for(let i=0;i<count;i++){let r=Array.from({length:data.length},()=>data[Math.floor(random()*data.length)]);if(new Set(r.map(p=>p.x)).size<5)continue;let b=optimize(r,func,starts,bounds,130);if(b&&Number.isFinite(b.loss))out.push(b.params);}return out;}
function percentile(vals,p){let a=vals.filter(finite).sort((x,y)=>x-y);if(a.length<15)return null;let k=(a.length-1)*p,f=Math.floor(k);return a[f]+(a[Math.min(f+1,a.length-1)]-a[f])*(k-f);}
function fitLight(points,opts={}){let model=opts.model==='nonrect'?'nonrect':'rect';let data=points.filter(p=>finite(p.x)&&finite(p.a)&&p.x>=0).map(p=>({x:p.x,a:p.a}));let uniq=new Set(data.map(p=>p.x));let minQ=Math.min(...data.map(p=>p.x)),maxQ=Math.max(...data.map(p=>p.x));let issues=[];
if(data.length<7||uniq.size<6)return {ok:false,reason:'Servono almeno 7 record e 6 valori distinti di Qleaf.',issues:['Dati insufficienti']};
if(minQ>100)issues.push('Mancano punti a PAR basso (≤100): α e Rd meno affidabili.');if(maxQ<500)issues.push('PAR massimo <500: asintoto poco identificabile.');
const span=Math.max(2,Math.max(...data.map(p=>p.a))-Math.min(...data.map(p=>p.a))),Ptop=Math.max(30,Math.max(...data.map(p=>p.a))+span*3),bounds=[[.0005,.3],[.1,Math.max(30,Ptop*5)],[0,Math.max(4,span*3)]],base=[[.05,Ptop/2,Math.max(0,-Math.min(...data.map(p=>p.a)))],[.025,Ptop,1],[.09,Ptop,2],[.015,Ptop*2,0]];
const func=(x,p)=>lightEquation(model,x,p),best=optimize(data,func,base,bounds),m=metrics(data,func,best.params),[alpha,P,Rd]=best.params;
if(m.r2<.85)issues.push('R² <0,85: descrizione del modello scarsa (soglia di screening).');for(let j=0;j<3;j++)if(Math.abs(best.params[j]-bounds[j][1])/(bounds[j][1]-bounds[j][0])<.015)issues.push('Parametro al limite superiore del fit: identificabilità dubbia.');
if(Rd<.0001)issues.push('Rd apparente al limite 0: controllare presenza di misure al buio.');
let lcp=null,hi=Math.max(10000,maxQ*3);if(func(0,best.params)<0&&func(hi,best.params)>0){let lo=0;for(let j=0;j<65;j++){let mid=(lo+hi)/2;if(func(mid,best.params)>0)hi=mid;else lo=mid;}lcp=(lo+hi)/2;}
let q90=null,asym=P-Rd,target=.9*P-Rd;if(P>0&&func(1e6,best.params)>=target){let low=0,high=1e6;for(let i=0;i<65;i++){let z=(low+high)/2;if(func(z,best.params)>=target)high=z;else low=z;}q90=(low+high)/2;if(q90>maxQ)issues.push('Q90 estrapolato oltre il range misurato.');}
let bs=bootstrap(data,func,base,bounds,opts.bootstrap===false?0:80),names=['alpha','P','Rd'],ci={};names.forEach((name,j)=>ci[name]=[percentile(bs.map(z=>z[j]),.025),percentile(bs.map(z=>z[j]),.975)]);
return {ok:true,kind:'aq',model,params:{alpha,P,Rd,Asat:P-Rd,LCP:lcp,Q90:q90},metrics:m,issues,ci,bootstrapN:bs.length,curve:func,rawParams:best.params};}
function fitCi(points,opts={}){const data=points.filter(p=>finite(p.x)&&finite(p.a)&&p.x>0).map(p=>({x:p.x,a:p.a})),uniq=new Set(data.map(p=>p.x)),minCi=Math.min(...data.map(p=>p.x)),maxCi=Math.max(...data.map(p=>p.x)),setup={gamma:opts.gamma??42.75,k:opts.k??710};let issues=[];
if(data.length<8||uniq.size<7)return {ok:false,reason:'Servono almeno 8 record con 7 valori distinti di Ci.',issues:['Dati insufficienti']};
if(minCi>200)issues.push('Mancano valori Ci bassi (≤200): Vcmax non ben vincolato.');if(maxCi<600)issues.push('Mancano valori Ci elevati (≥600): J operativo non ben vincolato.');if(minCi>=setup.gamma+25)issues.push('Mancano osservazioni vicine al punto di compensazione.');
const bounds=[[.01,300],[.01,600],[0,12]],starts=[[65,125,1],[100,200,1.5],[35,85,0.5],[150,280,2]],func=(x,p)=>ciEquation(x,p,setup),best=optimize(data,func,starts,bounds),[Vc,J,Rd]=best.params,m=metrics(data,func,best.params);
const acN=data.filter(d=>{let c=d.x,g=setup.gamma,k=setup.k;return Vc*Math.max(0,c-g)/(c+k)<J*Math.max(0,c-g)/(4*(c+2*g))}).length;
const ajN=data.length-acN;
if(acN<2||ajN<2)issues.push('Una delle due regioni biochimiche ha meno di 2 punti: Vcmax e/o J operativo non identificabili separatamente.');
if(m.r2<.85)issues.push('R² <0,85: adattamento insufficiente.');
for(let j=0;j<3;j++){let lo=bounds[j][0],hi=bounds[j][1];if(Math.min((best.params[j]-lo)/(hi-lo),(hi-best.params[j])/(hi-lo))<.02)issues.push('Un parametro è al limite numerico imposto: stima non identificabile.');}
issues.push('Stima condizionata a Γ*='+setup.gamma+' e K='+setup.k+' (approssimazioni a circa 25 °C / 1 atm). Richiede validazione di temperatura, pressione, gm e qualità della curva.');
let bs=(acN>=2&&ajN>=2)?bootstrap(data,func,starts,bounds,opts.bootstrap===false?0:80):[];let ci={};['Vcmax','Joper','Rd'].forEach((n,j)=>ci[n]=[percentile(bs.map(z=>z[j]),.025),percentile(bs.map(z=>z[j]),.975)]);
return {ok:true,kind:'aci',model:'FvCB-min',params:{Vcmax:Vc,Joper:J,Rd},metrics:m,issues,ci,bootstrapN:bs.length,regimes:{ac:acN,aj:ajN},setup,curve:func,rawParams:best.params};}
const api={readCSV,diagnose,fitLight,fitCi,lightEquation,ciEquation,fmt,num,normalize};root.LCResearchCore=api;if(typeof module!=='undefined'&&module.exports)module.exports=api;
})(typeof globalThis!=='undefined'?globalThis:this);
