# LCpro T Mission Control — Clarity 1.3

Release del 13 ottobre 2026. PWA statica per **GitHub Pages**, PC, iPhone/iPad e Android.

## Novità della versione 1.3

Il percorso sperimentale guidato ha **nove passaggi**. Ciascuno presenta nell'ordine:

1. **Sull’LCpro T** — poche azioni da eseguire sullo strumento.
2. **Nell'app** — cosa annotare, verificare o aprire in Mission Control.
3. **Perché è importante?** — giustificazione scientifica consultabile a richiesta.
4. **Dati e strumenti** — campi necessari e collegamenti al Diario/Health Check/Curve Lab.
5. **Conferma le verifiche** — etichette brevi e criteri completi espandibili; avanzamento bloccato se sono assenti attestazioni o dati richiesti.

La sequenza `.SQS` viene **letta localmente** e non inviata automaticamente all'LCpro T. L'app non comanda lo strumento e non rileva direttamente la stabilità. Per una curva A/Q crescente da PAR 0, la guida segnala il rischio di induzione fotosintetica e richiede di documentare la scelta del protocollo; **non impone tempi o PAR iniziali universali e non preseleziona una strategia per i nuovi esperimenti**.

Non sono state cambiate le formule di Curve Lab, i controlli di Health Check, il formato del Diario, il backup o il CSV originale. Le schede 1.1/1.2 sono compatibili: la nuova interfaccia riutilizza i record già esistenti.

## Aggiornamento del sito GitHub Pages

1. Nell'app pubblicata apri **Diario → Esporta backup JSON**, e conserva i CSV originali anche fuori dal browser.
2. Estrai l'archivio ZIP. Carica i **9 file applicativi** nella radice del repository già esistente `lcprot-mission-control`:
   - `index.html`
   - `sw.js`
   - `manifest.webmanifest`
   - `guided-workflow.js`
   - `ux-shell.js`
   - `research-app.js`
   - `research-core.js`
   - `icon-192.png`
   - `icon-512.png`
3. Puoi caricare anche `README.md` per aggiornare le istruzioni nel repository. **Non serve pubblicare `validation/`**.
4. Conferma il commit e attendi che **GitHub → Actions → pages build and deployment** risulti completato.
5. Apri `https://ares777nonnnt.github.io/lcprot-mission-control/` con connessione attiva; se occorre aggiorna la pagina. La versione deve mostrare **Clarity 1.3** nella scheda del percorso.
6. **Non cancellare i dati del sito** e non disinstallare la PWA per forzare un aggiornamento: potresti cancellare il Diario salvato localmente.

## Uso guidato

Dalla Home scegli **Inizia un nuovo esperimento** oppure **Riprendi**. La sezione «Esperimento» mostra la fase corrente: non è necessario navigare fra tutti i tool. Per le spiegazioni apri «Perché è importante?»; per la formulazione precisa delle attestazioni usa «Mostra criteri completi».

Per un CSV già registrato, apri «Ho già un CSV da analizzare», compila la scheda in Diario, importa il file e attiva «Registro retrospettivo» nel percorso. In tale modalità **non affermare di aver eseguito in tempo reale verifiche non documentate**.

## Validazione e limiti

- Test JavaScript di sintassi; test numerici su curve sintetiche per il motore scientifico; interazione completa dei 9 passaggi con IndexedDB simulato.
- Esame dei blocchi obbligatori, lettura di .SQS crescente, importazione CSV reale di prova `LOG-030.CSV` e salvataggio fit.
- Verifica responsiva su Chromium desktop/mobile simulato, non sostitutiva di un test fisico su iOS/Android.
- Il service worker precache la shell tramite percorsi **relativi** compatibili con il sottopercorso GitHub Pages; la prima visita richiede connessione. Il funzionamento offline sui dispositivi reali è ancora da verificare.
- Le stime numeriche non sono validate per uso diretto in pubblicazioni senza controllo indipendente; l'app non sostituisce un SOP approvato o la formazione all'LCpro T.
