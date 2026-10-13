# LCpro T Mission Control — Clarity 1.2

Interfaccia semplificata rispetto alla Research Edition Guided 1.1 (13 ottobre 2026).

## Quali sono le modifiche

- Schermata iniziale con tre azioni principali: **Nuovo esperimento**, **Riprendi esperimento**, **Ho già un CSV**.
- Navigazione primaria ridotta a **Inizio, Esperimento, Diario, Strumenti**.
- I dieci strumenti preesistenti non sono eliminati ma raggruppati nel pannello chiudibile **Strumenti**.
- Il percorso guidato mantiene **tutte le nove verifiche obbligatorie**, ma la panoramica delle nove fasi è nascosta in un pannello espandibile; viene mostrata subito solo la fase attiva.
- Header meno ingombrante e interfaccia responsive per tablet/smartphone; contrasto per tema giorno/notte.
- La creazione di un nuovo esperimento avviene dalla Home e conduce direttamente al percorso obbligato. Per un CSV già acquisito, si usa il Diario e poi **Registro retrospettivo**.
- Nessun cambiamento alle formule scientifiche, ai CSV originali, al database IndexedDB, al backup o alle regole Health Check.

## Aggiornamento su GitHub Pages

1. **Prima dell'aggiornamento:** nel Diario della versione precedente esporta **Backup JSON**. Conserva separatamente i CSV originali. Non cancellare i dati del sito.
2. Estrai lo ZIP e carica nella root del repository `lcprot-mission-control` questi **9 file**, con `Add file → Upload files`:
   - `index.html`
   - `manifest.webmanifest`
   - `sw.js`
   - `icon-192.png` / `icon-512.png`
   - `research-core.js` / `research-app.js`
   - `guided-workflow.js`
   - **`ux-shell.js` (nuovo)**
3. Conferma il commit su `main`. Attendi GitHub Pages → Actions e riapri l'URL del sito **online**.
4. L'aggiornamento offline utilizza la cache `lcprot-mission-clarity-2026-10-13-v1`. Non disinstallare l'app prima di fare backup.

## Collaudo dopo l'aggiornamento

- **Inizio:** verifica che le azioni aprano le sezioni corrette e che la navigazione sia leggibile su mobile.
- **Nuovo esperimento:** crea scheda, controlla che il percorso inizi dal passaggio 1 e che i vincoli siano ancora operativi.
- **Riprendi:** ritorna alla fase lasciata incompleta.
- **Ho già un CSV:** allega CSV nel Diario e attiva la modalità retrospettiva nel percorso.
- **Strumenti:** verifica che guida, SQS, grafici, diagnostica, fit e report siano tutti ancora presenti.
- **Dati:** conferma che i vecchi esperimenti siano visibili senza avere svuotato IndexedDB.

Non è effettuato alcun collegamento diretto con lo strumento LCpro T. Le verifiche restano attestate dall'operatore e non costituiscono validazione metrologica.


## Hotfix 1.2.1 — 13 ottobre 2026
Corretto errore `initSeqChecks is not defined` in `index.html` (prima chiamata a render prima della definizione). Aggiornata la versione della cache in `sw.js`. Per risolvere il problema pubblicare almeno `index.html` e `sw.js` nella root del repository e ricaricare la pagina online. Non eliminare i dati locali.
