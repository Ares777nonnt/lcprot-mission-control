(function(root){'use strict';
const keys=['area','tlmethod','co2mode','co2set','flow','temp'];
const defaults={area:'',tlmethod:'unknown',co2mode:'unknown',co2set:'',flow:'',temp:''};
function validate(values,partial=false){if(!values||typeof values!=='object'||Array.isArray(values)||Object.keys(values).some(k=>!keys.includes(k)||typeof values[k]!=='string'||values[k].length>100))throw Error('Impostazioni camera non valide');const v=partial?values:{...defaults,...values};for(const [k,allowed] of [['tlmethod',['unknown','measured','calculated']],['co2mode',['unknown','ambient','controlled']]])if(k in v&&!allowed.includes(v[k]))throw Error('Modalità camera non valida');for(const k of ['area','co2set','flow','temp'])if(k in v&&v[k]!==''&&(!Number.isFinite(Number(v[k]))||(['area','flow'].includes(k)&&Number(v[k])<=0)||(k==='co2set'&&Number(v[k])<0)))throw Error('Valore camera non valido: '+k);return structuredClone(v);}
function values(project,reading){return project?.cameraSettings?{...defaults,...project.cameraSettings.values,...reading?.cameraOverrides}:null;}
function signature(project,reading){const v=values(project,reading);return v?JSON.stringify(keys.map(k=>[k,v[k]])):null;}
function resolve(project,reading,record){if(!record)return record;const v=values(project,reading),out=structuredClone(record);delete out.cameraChanged;if(!v)return out;out.meta={...out.meta,...v};const fit=out.fitSnapshots?.at(-1);out.cameraChanged=!!fit&&fit.cameraSignature!==signature(project,reading);return out;}
const api={keys,defaults,validate,values,signature,resolve};root.LCCameraCore=api;if(typeof module!=='undefined')module.exports=api;
})(globalThis);
