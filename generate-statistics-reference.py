import json, math
from pathlib import Path
import scipy
from scipy import stats
cases = [
 ('welch-basic','independent',[10,12,11,14,13],[15,17,16,20,18]),
 ('welch-unequal','independent',[1,2,3],[1,10,20,30,40,50,60]),
 ('welch-one-constant','independent',[2,2,2],[1,3,5,8]),
 ('same-means','independent',[-1,0,1],[-2,0,2]),
 ('two-each','independent',[1,2],[4,7]),
 ('tiny','independent',[1e-100,2e-100,4e-100],[2e-100,5e-100,9e-100,10e-100]),
 ('large','independent',[1e100,2e100,4e100],[2e100,5e100,9e100,10e100]),
 ('offset','independent',[1e12+1,1e12+2,1e12+4],[1e12+5,1e12+7,1e12+9]),
 ('paired','paired',[10,12,11,14,13],[15,15,17,16,19]),
 ('paired-negative','paired',[10,12,11,14,13],[5,10,6,10,10]),
 ('paired-tiny','paired',[1e-100,2e-100,3e-100],[2e-100,5e-100,4e-100]),
 ('paired-offset','paired',[1e12+1,1e12+2,1e12+4],[1e12+3,1e12+7,1e12+9]),
 ('paired-two','paired',[12,20],[18,25]),
 ('paired-zero-mean','paired',[10,20,30,40],[9,22,28,41]),
 ('large-df','independent',[math.sin(i) for i in range(1000)],[math.cos(i)+.02 for i in range(1200)]),
]
for i in range(35):
 a=[math.sin(j*1.13+i)*3+i/3 for j in range(2+i%12)]
 b=[math.cos(j*.71+i)*(.2+i%7)+i/2 for j in range(2+i%17)]
 cases.append((f'deterministic-{i}','independent',a,b))
out=[]
for name,mode,a,b in cases:
 # B minus A consistently with the application.
 origin=a[0]
 scale=max(abs(v-origin) for v in a+b) or 1
 aa=[(v-origin)/scale for v in a]
 bb=[(v-origin)/scale for v in b]
 result=stats.ttest_rel(bb,aa) if mode=='paired' else stats.ttest_ind(bb,aa,equal_var=False)
 ci=result.confidence_interval(.95)
 out.append(dict(name=name,mode=mode,a=a,b=b,t=float(result.statistic),p=float(result.pvalue),df=float(result.df),ci=[float(ci.low)*scale,float(ci.high)*scale],referencePreconditioning='Common translation/scale (t, df and p invariant; CI multiplied by scale), prevents reference underflow/overflow and offset cancellation'))
Path(__file__).with_name('statistics-reference.json').write_text(json.dumps(dict(software='SciPy '+scipy.__version__,cases=out),indent=2),'utf8')
print(f'Generated {len(out)} independent SciPy reference cases; SciPy {scipy.__version__}')
