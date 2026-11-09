// Favering: funziona anche offline. Cambiare VERSIONE a ogni aggiornamento del gioco.
var VERSIONE = "favering-v11";
var FILE = ["./", "index.html", "manifest.webmanifest", "icona-192.png", "icona-512.png", "icona-180.png", "pressstart2p.ttf", "baloo2.ttf"];
self.addEventListener("install", function(e){
  e.waitUntil(caches.open(VERSIONE).then(function(c){ return c.addAll(FILE); }).then(function(){ return self.skipWaiting(); }));
});
self.addEventListener("activate", function(e){
  e.waitUntil(caches.keys().then(function(k){ return Promise.all(k.filter(function(n){ return n !== VERSIONE; }).map(function(n){ return caches.delete(n); })); }).then(function(){ return self.clients.claim(); }));
});
self.addEventListener("fetch", function(e){
  if (e.request.method !== "GET") return;
  // prima la rete (così gli aggiornamenti arrivano), se manca internet la copia salvata
  e.respondWith(fetch(e.request).then(function(r){
    var copia = r.clone(); caches.open(VERSIONE).then(function(c){ c.put(e.request, copia); }); return r;
  }).catch(function(){ return caches.match(e.request).then(function(r){ return r || caches.match("index.html"); }); }));
});
