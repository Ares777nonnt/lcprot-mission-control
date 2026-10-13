# LCpro T Mission Control — Research Edition 1.1 · Guided Protocol

**PWA per GitHub Pages · iPhone/iPad/Android/PC · 13 ottobre 2026**

La nuova scheda **🧭 Percorso guidato · Inizia qui** diventa la prima schermata dell'app. Un esperimento è accompagnato dalla preparazione della foglia alla generazione del report. La guida precedente, SQS, CSV, confronto curve, Diario, Health Check, Curve Lab e Report Studio restano presenti; la scheda **Manuale** precedentemente rimossa non viene ripristinata.

## Aggiornamento del sito GitHub Pages esistente

1. **Prima di aggiornare:** apri la versione online → **Diario → Backup completo JSON**; conserva il backup e i CSV originali fuori dal browser. Non usare *Clear site data* e non disinstallare l'app prima di avere effettuato il backup.
2. Estrai lo ZIP. Dal repository pubblico `lcprot-mission-control` clicca **Add file → Upload files**.
3. Carica **gli 8 file** nella **radice** del repository, sostituendo i nomi già presenti: `index.html`, `sw.js`, `manifest.webmanifest`, `research-core.js`, `research-app.js`, `guided-workflow.js` (**nuovo**), `icon-192.png`, `icon-512.png`.
4. Conferma con **Commit changes** sul branch `main`. Le impostazioni Pages `main` → `/(root)` non cambiano.
5. Aspetta la pubblicazione in **Actions**, apri **lo stesso URL** GitHub Pages (`https://ares777nonnnt.github.io/lcprot-mission-control/`, se quello è il tuo indirizzo), ricarica **online** e controlla la nuova scheda **Percorso guidato**.
6. Per aggiornare una PWA già installata, aprila online, chiudila e riaprila. Il Service Worker usa la cache `lcprot-mission-guided-2026-10-13-v2` con **8 risorse**. Se la vecchia versione persiste, controlla in Chrome DevTools → Application → Service workers, ma **non cancellare dati/IndexedDB senza backup**.

## Percorso guidato (9 fasi)

1. **Scheda** — crea o seleziona esperimento; compila specie, ID pianta, data, tipo, metodo Tleaf, area fogliare, condizioni pre-esposizione e note. Richiede verifiche dichiarate dall'operatore.
2. **Sequenza** — carica il `.SQS` realmente usato (lettura locale di file a 6 colonne: dwell, temperatura, PAR, CO₂, H₂O, opzioni) oppure trascrivi i dati manualmente. Analizza numero di step, prima/ultima condizione, direzione e dwell. Le cifre vengono confrontate **visivamente** dall'operatore con l'LCpro T; l'app **non legge la memoria dell'apparecchio**.
3. **Camera** — controlla stato foglia, area, tenuta, temperatura fogliare `meas./calc.`, CO₂ Ambient/controllata, flow e ambiente camera.
4. **Acclimatazione** — scelta della strategia dipendente dal protocollo; registra **tempi effettivi**, osservazioni su A e gs e limitazioni. La salita **PAR 0→2000** presenta avvisi specifici su punto al buio e **induzione fotosintetica**. Non prescrive un tempo fisso come prova di equilibrio.
5. **Acquisizione** — conferma che SQS sia effettivamente caricata sullo strumento, logger attivo, valori monitorati e sequenza conclusa. Le verifiche sono **auto-attestazioni**.
6. **CSV** — allega l'originale al Diario; controlla colonne/record; segnala discordanza fra numero di step e record senza interpretarla automaticamente come errore.
7. **Health Check** — leggi anomalie e scrivi una **valutazione motivata** di dati e limiti (Tleaf, gs, Ci, Cref, stabilità ecc.).
8. **Curve Lab** — per curve A/Q e A/Ci richiede **almeno un fit salvato** prima di avanzare; selezione punti e avvisi restano sotto controllo umano. Le misure puntuali non richiedono fit.
9. **Report / backup** — produci il report PDF/HTML via stampa e conserva backup JSON e CSV originale. Conclude solo dopo conferme dell'operatore.

Le tappe critiche vengono bloccate finché i controlli richiesti non vengono completati. I pulsanti di Diagnostica, Curve Lab e Report Studio sono soggetti all'ordine del percorso **quando l'esperimento corrente ha un workflow attivo**. Gli strumenti separati rimangono disponibili per i lavori precedenti, ma non costituiscono di per sé un workflow completato.

### Esperimenti già registrati / CSV già acquisiti

Quando scegli una scheda contenente già un CSV, puoi selezionare **Registro retrospettivo**: per preflight, acclimatazione e acquisizione la guida chiede **informazioni verificabili, lacune e note esplicite**, anziché obbligarti ad attestare falsamente attività non documentate. Non inventare mai tempi di acclimatazione o letture che non hai acquisito.

## Precisazioni scientifiche

- Per la curva A/Q crescente da PAR 0, la possibilità di avere un vero punto di respirazione al buio dipende da buio e stabilizzazione effettiva. In fase crescente, la riattivazione fotosintetica può influenzare i primi punti: senza osservazioni temporali non si può certificare che ogni step sia allo stato stazionario.
- La pre-acclimatazione a PAR 500 può essere un punto di partenza **solo se appropriata alle condizioni di crescita e allo scopo**, non un requisito scientifico universale. Durate come 10–20 minuti di luce o 15–30 minuti di buio sono indicative, non valori garantiti. Questa release obbliga a registrare i **tempi effettivamente usati**.
- Una foglia appena esposta per un'ora al sole potrebbe aver aumentato sia l'attivazione fotosintetica sia il carico termico/idrodinamico: condizioni idriche e di crescita vanno annotate.
- Non confondere `Tleaf calc.` con una misura indipendente. `Ci` e `gs` sono valori derivati; eventuali problemi di configurazione della temperatura fogliare possono comprometterne l'interpretazione.
- Il sistema **non verifica** direttamente tenuta, sensori, VPD, stabilità, durata reale degli step o inizio/fine dell'acquisizione; non è software metrologico validato. Le conferme sono dichiarazioni registrate del ricercatore.

## Archivio, privacy e riproducibilità

- I nuovi dati del workflow sono conservati in `session.workflow` nell'**IndexedDB già esistente**; non cambia lo schema di backup (`LCproT-Research-Backup`, schema 1), quindi il backup include i nuovi dati. `CSV originale`, audit trail e fit salvati rimangono separati.
- Modificare metadati scientificamente critici richiede nuovamente le conferme. Modificare i parametri di sequenza/acclimatazione può invalidare i checkpoint successivi.
- Nessun dato sperimentale viene caricato automaticamente su GitHub. Non pubblicare CSV e backup nel repository pubblico.
- Backup da un dispositivo non sincronizzato con altri: esporta e conserva una copia fuori dal dispositivo.

## Test e limitazioni

- `node validation/run-tests.cjs` (Node.js >=18): parser CSV, formule su dati sintetici, diagnostica, sintassi, asset offline.
- `python validation/test_guided_ui.py` (Playwright + Chromium installati): collaudo del percorso completo con **archivio simulato**, inclusi blocchi, parsing SQS, CSV, fit, report/backup auto-attestati. Il test usa un CSV di laboratorio non incluso nel pacchetto; per rieseguirlo va sostituita la fixture indicata nello script.
- L'ambiente di test blocca `localStorage` per pagine create senza origine HTTPS: gli errori di tale policy non indicano necessariamente problemi sul sito reale. **La persistenza reale IndexedDB, il Service Worker e l'installazione su Chrome/Safari mobili devono essere verificati sul GitHub Pages pubblicato** prima dell'uso ordinario in laboratorio.
- Report Studio usa la stampa del browser per salvare PDF; non genera un PDF con librerie separate.

**Questa app non sostituisce il manuale ufficiale ADC BioScientific, le istruzioni di sicurezza o una SOP di laboratorio approvata.**
