/* LCpro T Mission Control Research Edition Â· offline cache (2026-10-13) Â· Clarity 1.6 */
const CACHE = 'lcprot-mission-clarity-2026-10-15-v7';
const PREFIX = 'lcprot-mission-';
const PRECACHE = ['./','./index.html','./manifest.webmanifest','./icon-192.png','./icon-512.png','./research-core.js','./research-app.js','./guided-workflow.js','./ux-shell.js','./clarity-flow.js','./visual-edition.css','./visual-edition.js','./experiments-core.js','./experiments-app.js','./experiments.css'];
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
        return res;
      }catch(e){return (await caches.match(req))||(await caches.match('./index.html'))||Response.error();}
    })());
  }else{
    // Network-first for app code prevents stale JS after a GitHub Pages update.
    event.respondWith((async()=>{
      const cached=await caches.match(req);
      try{const res=await fetch(req);if(res.ok){const cache=await caches.open(CACHE);await cache.put(req,res.clone());}return res;}
      catch(e){return cached||Response.error();}
    })());
  }
});
