# LCpro T Mission Control — Research Edition 1.0.0

**PWA statica per GitHub Pages** · 13 ottobre 2026 · Italiano · iPhone/iPad/Android/desktop

Questa release amplia la precedente Mission Control senza reintrodurre la sezione Manuale. La guida operativa, il generatore `.SQS`, l'analisi CSV originale, il confronto multi-CSV, il tema giorno/notte e le due modalità di guida rimangono disponibili.

## Nuove funzioni utilizzabili

1. **📓 Diario / Experiment Log**: archivio esperimenti in IndexedDB, campi per specie/pianta/foglia/protocollo, CSV originale associato a impronta SHA-256, cronologia locale delle modifiche, esclusioni motivate, versioni del fit salvate; backup JSON integrale, importazione di backup, indice CSV.
2. **🩺 Diagnostica / Health Check**: screening batch sul CSV e controllo manuale di A, gs, E, Ci, Tleaf, Cref e Qleaf. Regole esplicite per valori invalidi, gs arrotondata a 0, Tleaf assente/calcolata, anomalie di Ci, area discordante e CO₂ ambient/controllata.
3. **📈 Curve Lab**: due fit A/Q (iperbole rettangolare o non rettangolare a theta fisso), A/Ci C3 minimale vincolato, residui, R², RMSE, AICc, stime bootstrap *esplorative*, CSV originale intatto, esclusioni con motivazione, SVG e JSON dei risultati. Pulsante **Salva analisi nel diario** per registrare la scelta del modello e l'esito del fit.
4. **📄 Report Studio**: report HTML autonomo, pronto da **Stampa → Salva come PDF**, con metadati, QC, grafico SVG, modello, parametri, hash del file originale e storico. Nessuna libreria remota. Il file PDF è creato dall'interfaccia di stampa del dispositivo, non da un generatore PDF integrato.

## Aggiorna il repository GitHub già pubblicato

L'app è già online nel repository `lcprot-mission-control`: **non crearne un altro**.

### 0. Prima di aggiornare

Se hai già esperimenti registrati nel browser, esporta **Diario → Backup completo JSON**. La vecchia versione non gestiva l'archivio Research, ma questo passaggio sarà utile nei successivi aggiornamenti.

### 1. File da caricare nella radice (root)

Sostituisci/carica questi **sette file** (tutti allo stesso livello, non in una sottocartella):

- `index.html`
- `manifest.webmanifest`
- `sw.js`
- `icon-192.png`
- `icon-512.png`
- `research-core.js` (**nuovo**)
- `research-app.js` (**nuovo**)

Puoi caricare anche `README.md` e `validation/` per documentare la versione. Non caricare lo ZIP come singolo file.

### 2. Pubblica

1. Apri il repository su GitHub → `Add file` → `Upload files`.
2. Trascina i sette file dell'app dalla cartella estratta; conferma il commit.
3. GitHub Pages continuerà a pubblicare da `main` → `/(root)` senza cambiare le impostazioni.
4. Attendi che la build in `Actions`/`Settings → Pages` risulti completata e apri **lo stesso URL** già usato, per esempio `https://ares777nonnt.github.io/lcprot-mission-control/` se quello è il tuo indirizzo effettivo.
5. Ricarica online, chiudi e riapri la PWA già installata. Potrebbe servire una seconda apertura per aggiornare il Service Worker.

### 3. Verifica l'installazione e l'offline

- In Chrome desktop: `F12` → **Applicazione → Service workers**: verifica `sw.js` attivato; **Spazio di archiviazione cache** deve contenere una cache `lcprot-mission-research-2026-10-13-v1` con **7 risorse** (anche `research-core.js` e `research-app.js`).
- Verifica che l'app si apra online, poi attiva **Offline** in DevTools e ricarica. La guida e le funzioni Research dovrebbero aprirsi; i dati IndexedDB sono locali al dispositivo.
- Su iPhone/iPad: Safari → Condividi → Aggiungi alla schermata Home. Su Android: Chrome → ⋮ → Installa app / Aggiungi alla schermata Home.
- Su mobile: apri prima online, attendi il caricamento; poi chiudi completamente, attiva modalità aereo (Wi‑Fi spento) e riapri.

**Non eliminare i dati del sito per riparare l'offline prima di avere esportato il backup JSON**: la cancellazione può rimuovere l'archivio IndexedDB.

## Esempio pratico con basilico

1. Apri **Diario** → **Nuovo esperimento**. Compila `Ocimum basilicum`, `BAS-01`, `L01`, tipo `A/Q`, metodo Tleaf (`meas.` o `calc.`), CO₂ `Ambient`, area usata per i calcoli e condizioni di crescita. Premi **Salva scheda**.
2. Allega un CSV originale LCpro T dalla SD (`LOG-xxx.CSV`), senza modificarlo.
3. Apri **Diagnostica** per lo screening. Tleaf `under` e gs `0` devono produrre avvisi e nessuna validazione fisiologica automatica.
4. Apri **Curve Lab**, prova i due modelli A/Q. Escludi un punto solo con una motivazione documentata e premi **Salva analisi nel diario**.
5. Apri **Report PDF** → **Apri report** → **Stampa / Salva PDF**. Archivia il PDF assieme a backup JSON e CSV originale.

## Validazione scientifica: limiti importanti

### A/Q

- Iperbole rettangolare: `A(Q)=α·Q·P/(α·Q+P)−Rd`.
- Iperbole non rettangolare a `θ=0,7` **fisso**: `A(Q)=[αQ+P−sqrt((αQ+P)^2−4θαQP)]/(2θ)−Rd`.
- `α` è rendimento quantico **apparente di CO₂**, non efficienza massima di PSII / Fv/Fm.
- `Asat=P−Rd` è asintoto netto stimato. `Q90` è il PAR modellizzato al 90% dell'asintoto lordo, non necessariamente la soglia fisiologica di saturazione. `Rd` è il termine respiratorio del modello, non una misura indipendente di respirazione alla luce.
- R² elevato non certifica affidabilità se CO₂/Tleaf variano o gs e Ci sono invalidi.

### A/Ci

- Implementato **screening biochimico C3 minimale**, con `Ac=Vcmax(Ci−Γ*)/(Ci+K)`, `Aj=J(Ci−Γ*)/[4(Ci+2Γ*)]`, `A=min(Ac,Aj)−Rd`; ipotesi implicita `Cc≈Ci` (gm non modellata), TPU esclusa.
- Valori iniziali `Γ*=42,75 ppm`, `K≈710 ppm` corrispondono approssimativamente a 25 °C e 1 atmosfera; sono **configurabili**, non sostituiscono correzioni termiche o di pressione.
- Il fit fornisce `Joper`, il **trasporto elettronico operativo alla luce della misura**, **non Jmax**. L'app segnala se PAR non è costante, temperature mancano o una regione limitante non è identificabile.
- Sono necessari fit di riferimento/controlli esterni per uso in pubblicazioni e comparazione fra trattamenti.

### Diagnostica e incertezza

- Le soglie sono strumenti di **screening**, non tolleranze di fabbrica o limiti fisiologici universali.
- Bootstrap = ricampionamento **dei punti di una singola curva**, non delle repliche biologiche: intervalli esplorativi, dipendenza temporale non risolta.
- Un solo punto a fine step non dimostra la stabilizzazione. Ci e gs sono grandezze calcolate in modo correlato; Tleaf `calc.` non è una verifica indipendente.
- Il registro di audit è consultabile ma **non a prova di manomissione**; non offre firme digitali, sincronizzazione o conformità GLP automatica.

**Riferimenti di metodo**:

- Sharkey TD, Bernacchi CJ, Farquhar GD & Singsaas EL (2007). *Fitting photosynthetic carbon dioxide response curves for C3 leaves*. *Plant, Cell & Environment* 30, 1035–1040. https://doi.org/10.1111/j.1365-3040.2007.01710.x
- Bernacchi CJ et al. (2001). *Improved temperature response functions for models of Rubisco-limited photosynthesis*. *Plant, Cell & Environment*. https://doi.org/10.1111/j.1365-3040.2001.00668.x

## Esegui i test automatici

Con Node.js ≥18 installato, dalla cartella dell'app:

```bash
node validation/run-tests.cjs
```

La suite usa valori noti e dataset sintetici: testa parser, regole QC, recupero dei parametri A/Q e A/Ci, gestione dei dataset insufficienti, sintassi JS e asset PWA. Non equivale a una validazione metrologica su più strumenti o una conferma in tutti i browser.

## Privacy e backup

- Nessun cloud di elaborazione, CDN o account richiesto: i CSV vengono letti in locale dal browser, i dati del diario sono salvati in **IndexedDB** sotto l'origine GitHub Pages.
- **L'installazione su un altro dispositivo non trasferisce i dati**: esporta il backup JSON e importalo dall'altro dispositivo.
- Non mettere CSV di ricerca o backup reali in un repository pubblico.
- Il backup include il contenuto integrale dei CSV allegati: trattalo come dato di ricerca riservato.
- Prima di eliminare cache e dati del sito, esporta il backup. Aggiornare solo i file statici non dovrebbe cancellare IndexedDB, ma un backup resta essenziale.

## Conformità GitHub Pages

File e asset relativi `./`, nessuna build né server, manifest e Service Worker dedicato. L'app deve essere servita via HTTPS o localhost per il Service Worker e l'hash SHA-256: aprendo direttamente `index.html` dal disco alcune funzioni di archiviazione o PWA potrebbero non essere disponibili.
