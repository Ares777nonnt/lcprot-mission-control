# Clarity 2.20 — Parametri delle curve fra condizioni

La sezione «Capacità fotosintetica e altri parametri» presenta prima il confronto fra condizioni: parametro selezionabile, riferimento, media, DS, n biologico, CSV utilizzati e differenze descrittive assolute e percentuali. Il dettaglio dei singoli CSV resta apribile sotto. Se nessun fit è salvato, rimane visibile il percorso per prepararlo.

## Calcolo e limiti

- Solo fit salvati e coerenti con dati e impostazioni correnti, con ID biologico assegnato.
- Parametro del fit → media dei CSV dello stesso ID nella condizione → media e DS campionaria fra ID. Ogni ID ha lo stesso peso; i CSV ripetuti non aumentano n.
- n e CSV effettivi sono calcolati separatamente per ogni parametro. Una stima mancante non è zero; DS non disponibile con n < 2.
- Modelli A/Q rettangolare e non rettangolare tenuti separati. Per A/Ci sono separate anche diverse Γ* e K del modello FvCB minimale.
- Fit con avvisi inclusi e segnalati, senza certificare validità fisiologica. L’operatore deve verificare protocollo, condizioni della camera e intervallo misurato prima di interpretare le differenze.
- Percentuali solo con media di riferimento positiva. Nessuna colorazione interpreta una differenza come automaticamente migliore o peggiore.
- Nessun test inferenziale sui parametri delle curve. La statistica esistente dei valori a X identica è conservata e resta distinta.

La selezione temporanea dei CSV vale anche per il confronto dei parametri. Il report usa il proprio ambito dichiarato (selezione oppure intero esperimento), riporta tutti i parametri e gruppi di modelli e mantiene il riferimento scelto per i fit. Tabelle divise in gruppi di massimo tre condizioni per leggibilità.

## Conservazione e verifiche

Nessuna modifica a CSV, fit salvati, schema IndexedDB o formule dei fit. Nessuna nuova stima generata automaticamente. Manifest e scope PWA conservati; cache aggiornata.

PASS: aggregazione biologica e ripetizioni tecniche, DS, n per parametro, ID assenti, fit obsoleti, stime assenti, modelli e costanti diverse, percentuali, escaping dei nomi, controlli reali dell’interfaccia, selezione, accesso ai CSV, report sintetico/dettagliato, 320/390/1380 px, tema chiaro/scuro, reload offline. Archivio completo identico prima e dopo l’uso della nuova vista.

PASS: aggiornamento reale 2.19 → 2.20 con service worker attivo e confronto integrale degli archivi prima/dopo. Statistica esistente verificata con flusso UI, report, backup e 50 riferimenti numerici SciPy 1.17.1.

Verifica ripetibile: `node fit-comparison.test.cjs` nella cartella dell’app. Immagini e PDF di prova usano dati sintetici, senza modificare l’esperimento reale dell’utente.
