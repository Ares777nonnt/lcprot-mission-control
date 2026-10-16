/* LCpro T Mission Control - offline cache - Clarity 2.18 */
const CACHE = 'lcprot-mission-clarity-2026-10-16-v34';
const PREFIX = 'lcprot-mission-';
const PRECACHE = ['./','./index.html','./manifest.webmanifest','./icon-192.png','./icon-512.png','./research-core.js','./research-app.js','./guided-workflow.js','./ux-shell.js','./clarity-flow.js','./visual-edition.css','./visual-edition.js','./experiments-core.js','./experiments-app.js','./experiments.css','./journal-core.js','./journal.js','./journal.css','./mission-core.js','./mission.js','./mission.css','./continuity-core.js','./vault.js','./recovery.js','./experiment-report.js','./continuity.css','./interface.css','./interface.js','./polish.css','./app-logo.jpg','./productivity.js','./productivity.css','./forest-night.css','./workspace.js','./workspace.css','./day-edition.css','./camera-core.js','./camera.js','./analysis-board.js','./analysis-board.css','./comparison-focus.js','./comparison-focus.css','./results-insight.js','./results-insight.css','./results-story.js','./results-story.css','./pipeline-care.js','./pipeline-care.css','./results-first.js','./results-first.css','./design-core.js','./design.js','./design.css','./statistics-core.js','./statistics.js','./statistics.css'];
self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE).then(c => c.addAll(PRECACHE)));
  self.skipWaiting();
});
self.addEventListener('activate', event => {
  event.waitUntil((async()=>{
    const keys=await caches.keys();
    await Promise.all(keys.filter(k=>k.startsWith(PREFIX)&&k!==CACHE).map(k=>caches.delete(k)));
    await self.clients.claim();
  })());
});
self.addEventListener('fetch', event => {
  const req=event.request, url=new URL(req.url);
  if(req.method!=='GET'||url.origin!==location.origin)return;
  if(req.mode==='navigate'){
    event.respondWith((async()=>{
      try {
        const res=await fetch(req);
        if(res.ok){const cache=await caches.open(CACHE);await cache.put('./index.html',res.clone());}
        return res.ok?res:((await caches.match(req))||(await caches.match('./index.html'))||res);
      }catch(e){return (await caches.match(req))||(await caches.match('./index.html'))||Response.error();}
    })());
  }else{
    // Network-first for app code prevents stale JS after a GitHub Pages update.
    event.respondWith((async()=>{
      const cached=await caches.match(req);
      try{const res=await fetch(req);if(res.ok){const cache=await caches.open(CACHE);await cache.put(req,res.clone());}return res.ok?res:(cached||res);}
      catch(e){return cached||Response.error();}
    })());
  }
});
