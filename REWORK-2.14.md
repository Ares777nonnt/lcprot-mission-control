# Clarity 2.14 — Risultato prima

Il percorso principale diventa **Organizza → Importa → Risultati**. Il report è un’azione nell’intestazione dell’esperimento.

## Uso

- Diario: ogni esperimento indica il prossimo passo utile. Impostazioni camera mancanti, condizioni vuote, associazioni incomplete e letture da verificare portano alla relativa attività. La gestione e l’eliminazione restano nel menu Gestisci; il cestino conserva il ripristino.
- Importa: camera comune prima dei CSV, valori comuni facoltativi, poi associazione di condizione e ID biologico per ciascun file. Le impostazioni comuni e le eccezioni per lettura restano distinte dai valori misurati nei CSV. La conferma è ancora esplicita; la preparazione resta una bozza recuperabile.
- Risultati: parametro e livello X nella stessa barra. Con due condizioni, differenza assoluta e percentuale rispetto al riferimento in primo piano. Le medie mantengono DS e n effettivo al parametro/X scelti. Con più condizioni, ciascuna scheda conserva il proprio confronto col riferimento. Con riferimento non positivo la percentuale non viene calcolata.
- Legenda selezionabile: attiva/disattiva le condizioni; il pulsante CSV apre le letture, la selezione parziale e l’annullamento. Le medie vengono ricalcolate senza modificare l’archivio. I conteggi di letture e ID dichiarati sono distinti da n effettivo al punto scelto. La selezione temporanea si azzera al ricaricamento.
- Un solo accesso agli approfondimenti: confronto A/B, altri parametri, vista delle singole letture, grafici aggiuntivi, dati, metodi e fit. I limiti del risultato rimangono visibili anche quando i dettagli sono chiusi.
- Report: ambito **Confronto selezionato** predefinito oppure **Intero esperimento**. Indice delle sezioni prima dell’esportazione. Nel sintetico si possono includere/escludere altri parametri, contesto/camera, spiegazione del metodo e lista delle letture. Risultato, grafico e limiti restano inclusi. Il dettagliato conserva l’appendice di dati, fit e tracciabilità. L’anteprima HTML è stampabile in PDF.

## Dati e compatibilità

Nessuna modifica agli schemi IndexedDB e nessuna riscrittura degli archivi dovuta al layout. Restano originali CSV, esclusioni, collegamenti alle schede, fit e bozze. Formule e aggregazione record → lettura → ID biologico → condizione non cambiano. Le linee fra medie sono guide visive, senza nuovi fit o interpolazione dei confronti. Rimangono logo, credito del creatore, Segoe UI, palette approvate e preferenze di leggibilità.

Nuovi file di interfaccia inclusi nella cache PWA; percorsi relativi compatibili con GitHub Pages. Cache: `lcprot-mission-clarity-2026-10-16-v29`.

## Verifiche

- `test-v214.cjs`: creazione e importazione guidata via interfaccia, camera comune, letture ripetute di C1 e replica C2, media biologica 31,25 contro 20, delta −11,25/−36%, inversione riferimento, parametro/X, condizioni e singoli CSV, selezione parziale, annullamento, archivio invariato; report selezionato/completo, sezioni facoltative, sintetico/dettagliato, schermi 320/390 px, temi e report offline.
- `test-regression-v214.cjs`: regressione storica con navigazione aggiornata; migrazione e originali immutati, esclusioni, A/Q e A/Ci, duplicati, bozze, SHA, backup completo, ripristino interrotto, fit correnti/obsoleti e report offline.
- `test-audit-v213.cjs`: camera con metadati pendenti, salvataggio bozza, avvisi chiudibili, fit invalidi, CSV incompleti, eliminazione/annullamento/ripristino e archivio storico offline.
- `test-audit-core-v213.cjs`, `test-v212-core.cjs`: parser, rapporti, aggregazione biologica, fit sintetici noti, precisione e report.
- `test-pwa-v213.cjs`: fallback con HTTP 503, riapertura offline e caricamento dei moduli.

Verifiche eseguite con fixture sintetiche e profili browser di prova. Non equivalgono a una validazione scientifica su ogni formato CSV o protocollo reale. Nessun test statistico di significatività aggiunto.
