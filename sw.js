/* LCpro T Mission Control Research Edition · offline cache (2026-10-13) */
const CACHE = 'lcprot-mission-guided-2026-10-13-v2';
const PREFIX = 'lcprot-mission-';
const PRECACHE = ['./','./index.html','./manifest.webmanifest','./icon-192.png','./icon-512.png','./research-core.js','./research-app.js','./guided-workflow.js'];
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
    event.respondWith(caches.match(req).then(cached=>cached||fetch(req)));
  }
});
