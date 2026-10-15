# Verifica Clarity 2.3 — 15 ottobre 2026

Test automatici Node.js e Microsoft Edge headless tramite Playwright. App servita sotto /lab/ per simulare una sottocartella GitHub Pages. Fixture sintetiche; nessun archivio reale dell'utente disponibile.

PASS — regressione delle versioni precedenti:

- Parser, assi Qleaf/Ci, fit A/Q, esclusioni e confronto biologico senza inflazione di n da file ripetuti.
- Migrazione di schede storiche senza alterare l'oggetto originale di controllo.
- Importazione guidata, anteprime, duplicati espliciti, validazione atomica delle letture e piano delle repliche.
- Diario, ricerca, metadati progressivi, salvataggio note, guardia sulle modifiche non salvate e collegamento delle letture.
- Persistenza offline, schermate mobile e tema notte; nessuna eccezione JavaScript raccolta.

PASS — novità 2.1:

- Backup completo con entrambi gli archivi e le bozze; rimappatura degli ID con relazioni a schede tecniche, metadati e CSV in preparazione.
- Compatibilità dei formati precedenti; rifiuto di ID duplicati e di CSV con impronta alterata.
- Anteprima del ripristino senza scritture; conferma che aggiunge copie e conserva gli originali.
- Recupero del CSV e delle assegnazioni dopo reload offline senza importazione implicita.
- Recupero esplicito di una bozza dei metadati; scheda originale invariata fino al salvataggio; rimozione della bozza dopo conferma.
- Ripresa di un ripristino simulato come interrotto dopo aggiunte parziali: riutilizzo delle copie presenti e conservazione di una modifica successiva.
- Backup esportabile anche durante un errore simulato di persistenza della bozza, senza sovrascrivere la scheda archiviata.
- Report HTML completo: condizioni, repliche, curva osservata, parametri e IC disponibili dal fit salvato, metodi e tracciabilità.
- Modifica dei metadati dopo il fit: stato da rivedere e parametri esclusi dal nuovo report.
- Report sintetico senza appendice; esportazione HTML offline; rendering e controllo visivo del report completo.

Non verificati: archivi reali dell'utente, pressione su quota/memoria con file molto grandi, comportamento su iOS/Android, stampa fisica o resa PDF di ogni browser. I test non costituiscono validazione scientifica dei modelli fisiologici. Il ripristino fra database diversi è riprendibile, non globalmente atomico.

Script riproducibile: test-v21.cjs, separato dal pacchetto web. Richiede Node.js, Playwright ed Edge; adattare il percorso della dipendenza al proprio ambiente.


## Verifica interfaccia 2.2

Suite `test-v22.cjs`: regressione 2.1 adattata ai quattro passaggi; preservazione record 1.6, migrazione, medie biologiche, esclusioni, A/Q e A/Ci, recupero bozze, backup/ripristino con interruzione e report. Dati sintetici; nessun accesso all’archivio reale dell’utente.

Suite `test-v22-ui.cjs`: Diario predefinito, tre aree principali, creazione dall’archivio, quattro passaggi, elenco e dettaglio affiancati su desktop, apertura lettura e ritorno al confronto, esportazione separata, strumenti contestuali, 390 px senza overflow della pagina, tema scuro e assenza di errori JavaScript. Controllo visivo di schermate desktop e mobile. Edge su Windows; non sostituisce una prova su dispositivi fisici né una valutazione di usabilità con utenti.

## Veste grafica 2.3

Suite di interfaccia esistente superata in Edge: navigazione, importazione di esempio, selezione lettura, ritorno al confronto, export, strumenti, larghezza mobile 390 px senza overflow ed errori JavaScript assenti. Schermate desktop, mobile e tema scuro controllate visivamente. Modifica di presentazione, senza variazioni agli schemi dati o ai calcoli.

## Leggibilità 2.3.2

Suite di interfaccia esistente superata su desktop e smartphone 390 px, con controllo visivo delle nuove dimensioni. Riepiloghi su due colonne e grafici scorrevoli senza overflow della pagina. Stampa esclusa dalle nuove regole tipografiche.

## Produttività 2.4

Suite `test-v24.cjs` con dati sintetici in Edge: anteprima e annullamento senza scritture; applicazione su letture non ancora materializzate; conservazione dei CSV, esclusioni e ID biologici; audit e sincronizzazione dei metadati nelle viste esperimento; conflitto su una sola scheda con annullamento dell’intera transazione; protezione bozze; invalidazione workflow e stato fit da rivedere; preferenze persistenti dopo reload; larghezze 320/390/1440 px; dialoghi su smartphone e recupero offline. Nessun errore JavaScript.

Regressione precedente in `test-regression-v24.cjs`, con il selettore del dialogo limitato a quello aperto per distinguere il nuovo editor multiplo dal dialogo delle esclusioni. La migrazione non cambia gli schemi dei database. Archivio reale dell’utente non disponibile; verifica effettuata su fixture sintetiche.

## Restyling 2.5

`test-v25-ui.cjs`: colori giorno/notte verificati nei valori CSS effettivi; Segoe UI; conteggi del Diario confrontati con fixture; navigazione, analisi e ritorno al confronto; letture Standard/Grande/Molto grande a 320 e 390 px senza overflow della pagina; screenshot desktop, smartphone e tema scuro. `test-v24.cjs`: modifica multipla, audit, conflitti, bozze e preferenze persistenti/offline superati. `test-regression-v24.cjs`: migrazione dell’archivio precedente, importazione A/Q e A/Ci, esclusioni, repliche, backup/ripristino e report superati. Dati sintetici; nessun errore JavaScript.
