// Guarda o app no aparelho para abrir sem internet. VERSAO muda a cada atualização (feito pelo build).
const VERSAO='central-373821693d';
const ARQUIVOS=['./','./index.html','./manifest.webmanifest','./icon-180.png','./icon-192.png','./icon-512.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(VERSAO).then(c=>c.addAll(ARQUIVOS)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==VERSAO&&k!=='fontes').map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET')return;
  const u=new URL(e.request.url);
  if(u.hostname==='fonts.googleapis.com'||u.hostname==='fonts.gstatic.com'){ // fontes: guardadas para uso offline
    e.respondWith(caches.open('fontes').then(c=>c.match(e.request).then(r=>r||fetch(e.request).then(n=>{c.put(e.request,n.clone());return n}))));return}
  if(u.origin!==location.origin)return; // API do GitHub passa direto
  e.respondWith(fetch(e.request).then(r=>{const cp=r.clone();caches.open(VERSAO).then(c=>c.put(e.request,cp));return r}).catch(()=>caches.match(e.request,{ignoreSearch:true}).then(r=>r||caches.match('./index.html'))));
});
