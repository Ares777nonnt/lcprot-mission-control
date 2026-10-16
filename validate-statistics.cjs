const assert=require('node:assert/strict'),fs=require('fs');const S=require('./statistics-core.js');
const ref=JSON.parse(fs.readFileSync(require('path').join(__dirname,'statistics-reference.json'),'utf8'));
const close=(a,b,label)=>assert(Math.abs(a-b)<=2e-9*Math.max(Math.abs(b),1e-200),label+': '+a+' ≠ '+b);
for(const c of ref.cases){const r=S.test(c.a,c.b,c.mode);assert.equal(r.status,'ok',c.name);for(const k of ['t','p','df']){if(Math.abs(c[k])<1e-12)assert(Math.abs(r[k]-c[k])<1e-12,c.name+' '+k);else close(r[k],c[k],c.name+' '+k);}r.ci.forEach((v,i)=>close(v,c.ci[i],c.name+' ci'+i));}
assert.deepEqual(S.holm([.01,.04,.03,.002]),[.03,.06,.06,.008]);
assert.deepEqual(S.holm([.01,1]),[.02,1]);
for(const [a,b,mode] of [[[1],[2],'independent'],[[1,1],[2,2],'independent'],[[1,2],[2,3],'paired'],[[1,2],[1,2],'paired'],[[1,Infinity],[2,3],'independent'],[[-1e308,1e308],[1,2],'independent']])assert.equal(S.test(a,b,mode).status,'blocked');
assert.equal(S.test([1e200,2e200,4e200],[2e200,5e200,9e200,10e200],'independent').status,'ok');
for(const t of [1e4,1e100,1e200])close(S.tP(t,1),2/Math.PI*Math.atan(1/t),'Cauchy tail df=1, t='+t);
console.log('PASS '+ref.cases.length+' cases vs '+ref.software+' (t, df, p, 95% CI), Welch/paired, unequal n/variance, constant group, signs, small/large/offset values, Holm and guarded degenerate cases');
