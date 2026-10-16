# Clarity 2.18 — Confronto statistico tra due condizioni

Questo aggiornamento aggiunge test t bilaterali su unità sperimentali dichiarate: Welch per gruppi indipendenti e t appaiato per le stesse unità. Il confronto riguarda un parametro a una X osservata identica, non l’intera curva.

## Percorso nell’app

1. **Organizza → Disegno e repliche**: confermare unità, modalità indipendente/appaiata e abbinamenti. Disegni non confermati, da verificare o con blocchi, ulteriori tempi o strutture miste non accedono a questo test semplice.
2. **Risultati**: selezionare le condizioni e i CSV da usare, poi **Confronto statistico → Prepara il confronto statistico**. Nel modulo scegliere riferimento A, condizione B, parametro principale e X. Si usano i CSV visibili all’apertura del modulo; condizioni senza CSV inclusi non sono analizzabili.
3. Indicare la domanda del confronto e se era principale, definito prima dei risultati, oppure esplorativo. La modalità iniziale è esplorativa. Dichiarare di avere verificato unità, indipendenza, abbinamenti e appropriatezza del modello t: l’app non può certificare queste assunzioni.
4. Se più parametri appartengono allo stesso confronto, includerli nella stessa famiglia prima del calcolo. Si applica Holm a tutti i p-value della famiglia. La famiglia include anche i parametri non calcolabili, trattati conservativamente come p = 1 per la correzione degli altri.
5. **Calcola e salva analisi**: vengono archiviati piano, dati biologici usati, risultati, disegno, fonti e impronte SHA-256. Differenza B − A, IC 95% e numerosità effettiva sono in evidenza. Nei dettagli sono disponibili t, gradi di libertà, p grezzo/aggiustato, esclusioni, dati individuali e assunzioni.
6. La cronologia conserva le analisi precedenti. Cambiare selezione o parametro nel grafico non ricalcola un’analisi salvata. **Mostra i CSV e il livello di questa analisi** ripristina il confronto salvato, con riferimento, parametro e X, quando la fonte è ancora verificabile. È possibile scaricare l’analisi completa e i dati biologici in JSON.
7. **Prepara report**: sintetico e dettagliato includono l’analisi scelta soltanto se le fonti sono attuali e la selezione dei CSV coincide. In caso contrario compare una spiegazione, senza associare il test a dati differenti. La sezione statistica dichiara il proprio parametro e X anche se diversi dal riepilogo descrittivo. Metodi e dati sono espansi nell’HTML esportato per essere disponibili nella stampa/PDF.

## Calcoli e interpretazione

- Sono mantenute le regole descrittive: rapporti per record → media entro CSV alla X → media dei CSV dello stesso ID → confronto delle unità, con uguale peso delle unità. Più letture della stessa unità non aumentano n.
- **Indipendenti**: differenza tra medie B − A; errore standard da varianze campionarie e numerosità; gradi di libertà di Welch-Satterthwaite. Non si impongono varianze uguali.
- **Appaiati**: differenza individuale B − A per ciascuna coppia completa, media delle differenze, errore standard e n − 1 gradi di libertà. Anche le medie A/B del test usano soltanto le coppie complete; possono differire dalle medie descrittive con tutti gli ID.
- Test bilaterale, H₀: differenza media = 0. Livello di riferimento 0,05. IC 95% per la differenza assoluta; nessun IC trasferito automaticamente alla percentuale.
- Gli IC sono **marginali**, non simultanei. Con più parametri, la conclusione sul test usa il p-value Holm; IC marginali e decisione corretta per molteplicità possono non coincidere.
- Analisi salvate separatamente non ricevono una correzione comune. Non dividere una famiglia in più analisi per evitare la correzione. L’app non può stabilire se una domanda fosse realmente precedente all’esplorazione dei dati.
- La mancata evidenza di differenza non dimostra equivalenza. Un risultato significativo non certifica rilevanza biologica, qualità del dato o causalità.
- Servono almeno due unità valide per gruppo o due coppie complete per la computabilità del test. Questo minimo non certifica adeguatezza scientifica, potenza o precisione; con poche unità l’interpretazione richiede particolare attenzione.
- Nessun test automatico di normalità sceglie il metodo. L’indipendenza tra soggetti e l’appropriatezza del modello delle medie, o delle differenze appaiate, devono essere valutate sul disegno e sui dati.
- Unità mancanti, valori non validi e coppie incomplete sono elencati. Nessuna imputazione o interpolazione. Il Ci misurato non viene sostituito dal setpoint CO₂; a Ci diversi il confronto puntuale può essere indisponibile.
- Variabilità nulla, statistiche non finite, intervalli sotto la risoluzione numerica o insufficienza di dati producono un risultato non calcolabile con motivazione, non p-value o IC inventati. I p-value non vengono mostrati come zero quando la coda scende sotto la precisione disponibile.

## Persistenza, verifica e backup

`statisticalAnalyses` è un campo aggiuntivo del progetto; i vecchi esperimenti non vengono riscritti né analizzati automaticamente. Ogni analisi registra schema 1, motore `LCStatistics/1.0.0`, data, piano e famiglia, disegno, valori biologici, coppie/esclusioni, file e SHA-256.

L’impronta del contesto considera CSV attivi, esclusioni, ID, condizioni, disegno, metadati e camera. Una modifica rende l’analisi storica. Anche il salvataggio controlla che i dati non siano cambiati durante la preparazione o il calcolo. Per dichiarare corrente un’analisi vengono verificati il contesto, le impronte dei CSV e la corrispondenza dei valori biologici salvati con quelli ricostruibili dalle fonti.

Backup e ripristino conservano cronologia e fonti; i nuovi ID dei CSV vengono propagati a piano, disegno e tracciabilità. La sola rimappatura del ripristino non rende obsolete le analisi. I risultati nei backup sono controllati rispetto ai dati biologici congelati e i riferimenti incoerenti non vengono presentati come fonti verificate. Massimo 200 analisi per esperimento; esportare e organizzare il lavoro prima di raggiungere il limite.

Nessun nuovo archivio IndexedDB o cambio di versione dei database esistenti. CSV originali, esclusioni, cestino, letture, fit e archivio legacy conservano le funzioni precedenti. Il motore e l’interfaccia sono inclusi nella cache v33: calcolo, salvataggio e report funzionano offline e su GitHub Pages, senza CDN o servizi di calcolo esterni.

## Validazione riproducibile

Nel pacchetto e nel repository sono inclusi:

- `statistics-reference.json`: 50 fixture numeriche prodotte da SciPy 1.17.1, con dati di ingresso e risultati attesi per t, gradi di libertà, p e IC 95%.
- `generate-statistics-reference.py`: generatore indipendente basato su `scipy.stats.ttest_ind(..., equal_var=False)`, `ttest_rel` e `confidence_interval`. Una traslazione e una scala comuni evitano overflow, underflow e cancellazione nel riferimento; t, gradi di libertà e p sono invarianti, gli estremi dell’IC sono riportati alla scala originale.
- `validate-statistics.cjs`: eseguire `node validate-statistics.cjs` nella cartella del pacchetto. Richiede Node, non necessario per usare la PWA. Il generatore richiede Python con SciPy. Include anche verifiche di Holm, casi degeneri e code t con un grado di libertà confrontate con la formula esatta di Cauchy.

Nel workspace sono conservati anche i test d’integrazione:

- `test-statistics-core-v218.cjs`: gerarchia delle medie, indipendenti/appaiati, sottoinsieme delle coppie complete, n per parametro, sette parametri/A-Ci, assenza di X comune, cambio riferimento, stato storico, dati congelati, rifiuto di p/n alterati, mancata verifica di impronte e valori incoerenti, doppio ripristino senza mutare gli originali.
- `test-statistics-ui-v218.cjs`: modulo effettivo, disegno obbligatorio, Welch/Holm, dati mancanti, selezione congelata/ripristinata, JSON, report sintetico/dettagliato/selezione diversa, modifiche concorrenti, storia, coppie complete, 320/390 px, temi, backup, riavvio e nuovo calcolo offline.
- `test-statistics-migration-v218.cjs`: aggiornamento reale da 2.17 con service worker attivo, dati e campi preesistenti invariati, nessuna inferenza di ID/disegno.
- `test-statistics-report-layout-v218.cjs`: report autonomo desktop/mobile e dettagli disponibili per la stampa.
- Regressioni del flusso precedente: camera, importazione, curve, repliche, rapporti, selezioni, report e offline.

Fixture sintetiche: queste verifiche riguardano l’implementazione e non validano il disegno o la qualità fisiologica di esperimenti reali. ANOVA, disegni misti, confronti di curve intere e modelli per misure ripetute restano fuori da questa versione.

## Riferimenti

- [NIST — Two-Sample t-Test, Welch-Satterthwaite](https://www.itl.nist.gov/div898/handbook/eda/section3/eda353.htm)
- [NIST — Analysis of paired observations](https://www.itl.nist.gov/div898/handbook/prc/section3/prc311.htm)
- [SciPy — ttest_ind](https://docs.scipy.org/doc/scipy/reference/generated/scipy.stats.ttest_ind.html)
- [SciPy — ttest_rel](https://docs.scipy.org/doc/scipy/reference/generated/scipy.stats.ttest_rel.html)
- [statsmodels — correzione Holm e altri metodi](https://www.statsmodels.org/stable/generated/statsmodels.stats.multitest.multipletests.html)
