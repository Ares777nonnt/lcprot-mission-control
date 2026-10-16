# Verifica Clarity 2.19 — Risultati delle curve

PASS — nuova gerarchia, fit visibili, punto al buio esplicito, report, selezione, mobile e offline. Migrazione 2.18.1 → 2.19 con archivi identici. Statistica e 50 riferimenti numerici conservati. Dettagli: [RISULTATI-2.19.md](RISULTATI-2.19.md).

---

# Verifica Clarity 2.18.1 — Prerequisiti della statistica

PASS — cause del pulsante disabilitato, inclusione esplicita dei CSV, disegno non confermato/complesso/da verificare, accesso alla configurazione e conservazione della selezione del grafico. Flusso statistico, report, backup, mobile/offline e validazione numerica conservati. Dettagli: [CORREZIONE-2.18.1.md](CORREZIONE-2.18.1.md).

---

# Verifica Clarity 2.18 — Statistica

PASS — 50 casi numerici contro SciPy 1.17.1 (t, gl, p, IC 95%), Holm e code di Cauchy. PASS — gerarchia biologica, coppie complete, sette parametri, X mancanti, tracciabilità, backup e risultati storici. PASS — flusso UI, report, mobile/temi, ripristino, migrazione 2.17 → 2.18 e nuovo calcolo offline. Fixture sintetiche, non validazione di esperimenti reali. Dettagli: [STATISTICA-2.18.md](STATISTICA-2.18.md).

---

# Verifica Clarity 2.17 — Disegno sperimentale

PASS — test core del disegno, flusso browser, persistenza, backup/ripristino, report e regressioni. PASS — aggiornamento 2.16 → 2.17 con archivio e service worker attivo, modulo disponibile offline. Fixture sintetiche; dettagli e limiti: [STATISTICA-2.17.md](STATISTICA-2.17.md).

---

# Verifica Clarity 2.16 — Smeraldo

PASS — palette e contrasto campionato ≥4,5:1, pannelli bianchi e valori inchiostro, logo/font conservati, assenza foglia e Tech Space. Flusso CSV/confronto/report, archivio invariato, 320/390 px, temi e offline senza eccezioni JavaScript. Fixture sintetiche; copertura e limiti: [STYLE-2.16.md](STYLE-2.16.md).

---

# Verifica Clarity 2.15 — Laboratorio

PASS — Diario/Importa/Risultati giorno e notte, foglia rimossa, logo e font preservati, contrasto campionato ≥4,5:1, mobile 320/390 px, flusso CSV e confronto biologico, report, archivio invariato e PWA offline. Nessuna eccezione JavaScript. Fixture sintetiche; copertura e limiti: [STYLE-2.15.md](STYLE-2.15.md).

---

# Verifica Clarity 2.14 — 16 ottobre 2026

PASS — flusso completo, risultati e selezioni, report con sezioni e ambito esplicito, migrazione/backup/fit, camera/cestino/bozze, PWA offline e HTTP 503, schermi 320/390 px e temi. Fixture sintetiche, nessuna eccezione JavaScript nei test. Copertura e limiti: [REWORK-2.14.md](REWORK-2.14.md).

---

# Verifica Clarity 2.13 — 16 ottobre 2026

PASS — audit mirato di camera bloccata da metadati pendenti, bozza recuperabile, errori chiudibili/contestuali, pulizia di fit e residui obsoleti, blocco del salvataggio con metadati non salvati. CSV incompleti rifiutati prima di scrivere; indici storici preservati.

PASS — eliminazione/conferma/annulla/ripristino esperimenti, CSV e fit preservati, bozze recuperate, reload/offline, conferma obsoleta rifiutata, esperimenti storici materializzati senza modificare l’originale. Cestino nei backup e rimappatura dei riferimenti.

PASS — regressione completa, camera comune/eccezioni, gestione singola/multipla letture, sette parametri, confronto e report, migrazione, SHA, backup e recupero interrotto. PWA con rete assente e HTTP 503; moduli mobile giorno/notte e nessuna eccezione JavaScript.

Resoconto completo: [AUDIT-PIPELINE-2.13.md](AUDIT-PIPELINE-2.13.md). Fixture sintetiche e profili di prova; archivio reale non modificato.

---

# Verifica Clarity 2.12 — 16 ottobre 2026

PASS — test-v212-core.cjs: report A/Q e A/Ci, parametro/X/riferimento espliciti, unità, valori minimi non azzerati, dati mancanti e vuoti, escaping HTML, gruppi di massimo tre condizioni per tabella e dati originali immutati. test-v29-core.cjs: formule, rapporti per record, medie biologiche annidate, DS/n e punti biologici.

PASS — test-v212.cjs in Edge: quattro viste e tastiera (frecce/Home/End), scelta parametri, selezioni CSV/condizioni conservate, medie e DS, confronto A/B, grafici, fit e qualità, esportazioni complete/filtrate. Report sintetico con valore principale e tabella dei sette parametri; selezione/parametro/X acquisiti prima dell’attesa di generazione. Schermi 320/390 px, caratteri ingranditi, giorno/notte, resa CSS di stampa, reload e uso offline. Nessuna eccezione JavaScript.

PASS — test-regression-v212.cjs: migrazione storica, archivio originale invariato, fit preesistenti e obsoleti, importazione per lotti, asse Ci, duplicati, bozze, backup completo, rifiuto SHA errata, ripristino interrotto, report dettagliato con parametri e metodi e uso offline.

Fixture sintetiche; archivio reale dell’utente non disponibile. Schemi, CSV e formule conservati. Verificate visivamente schede risultato e report anche in resa di stampa.

---

# Verifica Clarity 2.11 — 16 ottobre 2026

PASS — test-v211-core.cjs e test-v29-core.cjs: riepiloghi specifici per parametro/X, ID mancanti, CSV ripetuti senza inflazione di n, denominatori invalidi, X mancante, letture vuote/errori, piano delle repliche, report A/Q e A/Ci, formule dei sette parametri e assenza di modifiche ai dati di origine.

PASS — test-v211.cjs in Edge: selezione di condizioni/CSV, ricalcolo n/DS, confronti A/B e scambio, scale condivise, differenze e riferimenti nulli/negativi, export SVG, report completo/filtrato, riepiloghi qualità, fit coerenti/obsoleti, R²/RMSE/IC/avvisi. Layout 320/390 px, testo ingrandito, giorno/notte e uso offline. Nessun errore JavaScript raccolto. Verifica visiva di grafici, qualità, mobile e report.

PASS — test-regression-v210.cjs: parser e fit preesistenti, asse A/Ci, migrazione storica senza modifiche agli originali, metadati/diario, importazione per lotti, duplicati e guardie atomiche, bozze, backup completo, ripristino interrotto, verifica SHA, report e uso offline sotto sottocartella.

Fixture sintetiche; archivio reale dell’utente non disponibile. Nessuna migrazione di schema richiesta; testata la compatibilità della migrazione storica e dei backup.

---

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

## Scheda esperimento 2.6

`test-v26.cjs`: obiettivo e valori comuni; modifica condizione; importazione contestuale; più letture dello stesso ID raggruppate; cambiamento dei valori comuni senza riscrivere la bozza precedente; nuovo CSV con i nuovi valori; assegnazione e spostamento fra condizioni con CSV/SHA/ID preservati e audit; rifiuto di aggiornamento obsoleto; ricerca; apertura scheda nel contesto; note di protocollo preservate; revisione prima del report senza blocco; obiettivo nel report; nuovi metadati nel backup; smartphone, tema scuro e riapertura offline. Dati sintetici, nessun errore JavaScript.

Regressione in `test-regression-v26.cjs`: apre esplicitamente la sezione avanzata per i vecchi controlli di assegnazione e la vista Importa CSV per i valori comuni; mantiene le verifiche precedenti su archivio 1.6, A/Q e A/Ci, esclusioni, medie biologiche, bozze, backup, ripristino riprendibile e report.


## Aggiornamento grafico 2.6.1

PASS con test-v261-ui.cjs su Edge headless: flusso Diario/Esperimento/Strumenti, apertura e ritorno delle letture, esportazione, colori giorno/notte e Segoe UI. Dimensioni Standard/Grande/Molto grande a 320 e 390 px senza overflow orizzontale. Credito esatto Giuseppe Muscari Tomajoli, logo originale decodificato e attribuzioni ADC BioScientific ancora accessibili. Nessun errore JavaScript. Screenshot desktop e mobile controllati visivamente. Nessuna modifica ai dati o ai calcoli; restano applicabili i limiti delle verifiche precedenti.


## Gestione letture 2.6.2

Test test-v262.cjs su Microsoft Edge headless, fixture sintetiche sotto /lab/:

- Riassegnazione singola e multipla; conservazione di CSV, SHA, ID e metadati; ID biologici conservati oppure modificati solo tramite scelta esplicita. Letture ripetute della stessa unità biologica contate come n=1.
- Selezione delle sole letture visibili con ricerca, deselection e annullamento della conferma senza scritture.
- Rimozione singola/multipla dal confronto; schede tecniche conservate; ripristino individuale o completo con gli stessi CSV, SHA, metadati, esclusioni e ID.
- Persistenza dopo reload e operazioni offline; rimozione di una lettura storica tramite materializzazione senza alterare il record originale.
- Backup delle letture rimosse, controllo SHA, rimappatura degli ID e ripristino reale delle copie con recupero dei collegamenti alle analisi.
- Selezione obsoleta rifiutata atomicamente; nessuna rimozione parziale.
- Interfaccia desktop/mobile a 320 px, temi chiaro/scuro, assenza di overflow orizzontale e di eccezioni JavaScript.

PASS anche test-regression-v26.cjs: archivio storico, A/Q e A/Ci, gerarchia biologica, importazione guidata, bozze, backup e ripristino riprendibile, report e offline. Gli archivi reali dell’utente non sono disponibili per i test.


## Parametri fisiologici 2.7

PASS test-v27-core.cjs: formule e unità di tutti i sette parametri con risultati attesi indipendenti; Cref variabile senza sostituzione fissa; media dei rapporti per record prima delle medie annidate; più CSV di B1 e una replica B2 contati come n=2; DS campionaria e n specifico per parametro; dati mancanti, E/gs/Ci/Cref nulli e negativi; An negativo conservato; esclusioni e letture rimosse; asse Ci negli esperimenti A/Ci; A/An, separatore punto e virgola e virgola decimale; E distinta da e; oggetti originali invariati.

PASS test-v27-ui.cjs su Edge headless con importazione reale di quattro CSV sintetici in due condizioni: sette selettori e grafici, tabella a Qleaf=100 con An=31.25 e A/E=5.4375 (n=2), motivi ND, filtri delle condizioni, export delle medie e di tutti i record, report con sette parametri, scala e unità mobile, temi giorno/notte, assenza di overflow a 390 px, reload e ricalcolo offline, nessuna eccezione JavaScript.

PASS test-v262.cjs per la gestione delle letture importate: riassegnazione, rimozione recuperabile, backup, recupero offline e archivio storico immutato. PASS test-regression-v26.cjs per migrazione, parser, fit A/Q e A/Ci, bozze, backup riprendibile e report. Screenshot desktop, mobile e report controllati visivamente.

Sono test software con fixture sintetiche, non una validazione scientifica su misure reali o su ogni esportazione LCpro T. Le unità presuppongono le convenzioni CSV del manuale ADC; file convertiti in altre unità richiedono verifica prima dell’uso. Nessun test inferenziale fra condizioni aggiunto.


## Camera comune e scheda 2.8

PASS test-v28.cjs con Edge headless e CSV sintetici: richiesta camera prima della preparazione dei CSV, eredità comune nelle schede, campi strumentali nascosti e riepilogo leggibile, eccezione per una sola lettura e per un solo campo, ritorno ai valori comuni, propagazione alle letture già importate e conservazione del record archiviato durante la sola modifica comune. Firma dei fit salvata, invalidazione contestuale dopo modifica comune e parametri precedenti esclusi dal report corrente. Backup completo ripristinato realmente con impostazioni ed eccezioni; CSV originali invariati; reload offline e campi ereditati recuperati. Desktop e smartphone a 390 px senza overflow o eccezioni JavaScript; barra di salvataggio mobile disposta nel flusso.

PASS test-v28-metrics.cjs: i sette parametri rimangono calcolati dai dati CSV, con medie biologiche e n per parametro, report ed esportazioni. Le fixture dichiarano esplicitamente impostazioni sconosciute prima dell’importazione. test-regression-v28.cjs e test-v28-management.cjs aggiornano solo questa dichiarazione iniziale del flusso, conservando le verifiche precedenti di dati e migrazione. Limiti: dati sintetici, nessun archivio reale dell’utente disponibile; nessuna verifica su dispositivi iOS/Android fisici.

Verificati anche annullamento della richiesta camera senza importazione e nuova selezione dello stesso file; cambio lettura/esperimento rifiutato durante un salvataggio asincrono delle eccezioni, senza trasferire metadati al CSV successivo.


## Analizza 2.9

PASS test-v29-core.cjs: sette parametri, formule e medie biologiche preesistenti; punti per ID coerenti con le medie annidate (B1 con due CSV = un punto di valore 22.5, B2 = 40; media di condizione 31.25, n=2); oggetti originali invariati.

PASS test-v29.cjs su Edge: panoramica, tre famiglie di parametri, vista iniziale biologica e passaggio ai CSV, massimo tre pannelli, selezione X da menu e tastiera su SVG, evidenza coordinata, colori/simboli stabili con filtri, medie/DS/n nelle schede, spiegazione di ID mancanti senza sostituzione con zero. Download SVG principale/coordinato e medie CSV verificati, anteprima della portata delle esportazioni, apertura contestuale di una scheda e ritorno al confronto. Interfaccia a 320 e 390 px senza overflow orizzontale; temi giorno/notte e ricalcolo offline; nessuna eccezione JavaScript. Screenshot controllati visivamente.

PASS test-v28.cjs: camera comune, eccezioni, protezione del salvataggio, conservazione dei CSV, revisione dei fit, backup con ripristino reale e offline. La suite test-regression-v29.cjs conserva le verifiche precedenti, scegliendo esplicitamente la vista CSV quando conta i punti delle singole letture. Le verifiche usano fixture sintetiche, non archivi reali dell’utente; non costituiscono validazione scientifica o test su dispositivi mobili fisici.

PASS completo test-regression-v29.cjs: archivio e migrazione immutati, esclusioni, fit A/Q e A/Ci, diario e bozze, importazione da file/trascinamento, backup con rifiuto SHA errato, ripristino riprendibile e report. I test usano il nuovo accesso alle letture e attendono il completamento delle operazioni asincrone prima delle verifiche.


## Selezione e risultati 2.10

PASS test-v210.cjs su Edge headless: selezione per CSV e condizione, isolare una curva o condizione, mostrare/nascondere tutte, annullamento, stato parziale, rimozione dell’ultima curva dalla condizione e selezione automatica delle nuove condizioni. Medie attese a Qleaf=100: An iniziale 31.25, nascondendo B1-1 diventa 35 con n=2, nascondendo anche B1-2 diventa 40 con n=1 e DS non disponibile. Progetti e record dell’archivio confrontati prima/dopo: identici.

Differenze rispetto al riferimento: 20 contro 31.25 dà Δ=-11.25 e -36%; riferimento 20 dà +56.25% per 31.25. Riferimenti nulli/negativi non producono percentuali fuorvianti. Report filtrato con un solo CSV non include gli altri nomi, mentre il report completo li conserva; report con la sola seconda condizione mantiene il colore originale. SVG e medie CSV riportano la portata della selezione. Stato vuoto senza zeri, esportazioni filtrate disabilitate, selezione conservata fra viste e azzerata dopo reload, ricalcolo offline. Interfaccia a 320/390 px con testo molto grande, temi giorno/notte e nessuna eccezione JavaScript; screenshot controllati visivamente.

PASS test-regression-v210.cjs: formule, fit A/Q e A/Ci, migrazione e archivio storico, esclusioni, importazione guidata/trascinamento, bozze, backup e ripristino riprendibile, report e offline. PASS test-v28.cjs: camera condivisa, eccezioni, protezione del salvataggio e revisione dei fit. Le fixture sono sintetiche e non costituiscono una validazione su dati reali dell’utente o su telefoni fisici.
