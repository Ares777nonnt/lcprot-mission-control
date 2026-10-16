# Audit della pipeline — Clarity 2.13

Data: 16 ottobre 2026. Revisione del codice e prove riproducibili con Node.js e Microsoft Edge/Playwright. Database temporanei e fixture sintetiche: nessuna modifica all’archivio reale dell’utente.

## Problemi riprodotti e corretti

1. **Imposta la camera senza risposta apparente.** Le modifiche non salvate nella scheda impedivano l’apertura. Ora il modulo si apre e permette di salvare la scheda oppure conservare una bozza recuperabile prima di continuare. Le scritture restano bloccate finché le modifiche non sono gestite.
2. **Messaggi di errore persistenti.** Gli avvisi operativi potevano rimanere rossi dopo un successo o in una sezione diversa. Ora sono contestuali, chiudibili e perdono lo stato di errore quando cambia il messaggio. Le cautele scientifiche rimangono disponibili in una sezione espandibile del fit.
3. **Esperimenti non eliminabili.** Aggiunti pulsante nel Diario e gestione nell’esperimento, conferma esplicita, cestino e ripristino. CSV, assegnazioni, collegamenti ai fit e bozze sono conservati e inclusi nel backup. Nessuna cancellazione definitiva automatica. Le schede individuali già salvate rimangono nel Diario.
4. **Grafico precedente dopo impostazioni del fit non valide.** Riprodotti curva stimata e residui ancora visibili con analisi nulla. Ora vengono rimossi; restano solo le osservazioni e una spiegazione dell’errore. Anche una scheda vuota o puntuale pulisce i residui precedenti.
5. **Salvataggio del fit con metadati ancora modificati.** Ora richiede prima il salvataggio della scheda, evitando ambiguità fra modulo e analisi persistita.
6. **Righe CSV incomplete ignorate senza segnalazione.** Le nuove importazioni strutturalmente incomplete sono rifiutate prima di scrivere nell’archivio. Per i CSV storici resta una segnalazione esplicita, senza reinterpretare gli indici delle esclusioni già salvate.
7. **PWA con errore temporaneo del server.** Verificato il recupero dalla cache sia senza rete sia quando il server risponde HTTP 503, per pagina e risorse dell’app.
8. **Esperimento non più disponibile ancora attivo.** Il caricamento ora rimuove il contesto di un progetto scomparso dall’archivio attivo. Le conferme di eliminazione obsolete e le importazioni/scritture in corso sono protette.

## Copertura delle prove — PASS

| Area | Casi controllati |
|---|---|
| Creazione e organizzazione | Nome, condizioni, obiettivo, valori comuni, piano repliche, modifiche concorrenti |
| Importazione | CSV multipli, limiti, anteprima, duplicati espliciti, assegnazioni, salvataggio atomico, file incompleti |
| Parser | BOM, preambolo, CRLF, separatore punto e virgola, decimali con virgola, E distinta da e, valori mancanti |
| Camera | Apertura iniziale, modifiche pendenti, conservazione bozza, ereditarietà, eccezioni, reset e fit obsoleti |
| Calcoli | An, gs, E, Ci/Cref, A/E, An/gs, An/Ci; rapporti per record, medie annidate, DS campionaria e n biologico |
| Confronto | Selezione CSV/condizioni, annulla, confronto A/B, riferimento nullo/negativo, assi e unità, quattro viste |
| Fit | Recupero di curve A/Q e A/Ci sintetiche note, dati insufficienti, impostazioni non valide, snapshot coerenti/obsoleti |
| Diario e letture | Note, guardie sulle modifiche, riassegnazione, operazioni multiple, rimozione e recupero letture |
| Eliminazione esperimenti | Annulla/conferma, cestino, ripristino dopo reload e offline, esperimenti storici, conservazione originali e fit |
| Report | Sintetico/dettagliato, riferimenti e X fissati all’avvio, selezione/completo, metodi, fit e intervalli, stampa |
| Backup e migrazione | SHA-256, vecchi formati, rimappatura relazioni, bozze, cestino, ripristino interrotto e originali immutati |
| PWA e interfaccia | Sottocartella Pages, reload offline, errore HTTP 503, finestre 320/390 px, testo ingrandito e tema giorno/notte |

Suite eseguite: `test-audit-v213.cjs`, `test-audit-core-v213.cjs`, `test-pwa-v213.cjs`, `test-regression-v212.cjs`, `test-v212.cjs`, `test-v28.cjs`, `test-v28-management.cjs`, `test-v212-core.cjs`, `test-v211-core.cjs`, `test-v29-core.cjs`. Le prove browser non hanno raccolto eccezioni JavaScript. Verifica visiva dei moduli camera/eliminazione e del cestino.

## Coerenza scientifica e limiti

Unità e colonne confrontate con il [manuale ADC LCpro T, appendici 1 e 3](https://www.adc.co.uk/wp-content/uploads/LCproT-manual.pdf): E registrata in mmol m⁻² s⁻¹, gs in mol m⁻² s⁻¹, Cref come riferimento in ingresso. E non viene confusa con e, la pressione del vapore. Nessuna nuova formula o correzione automatica dei dati introdotta.

Le differenze rimangono descrittive. Gli ID sono dichiarati dall’operatore; nessun aumento di n per CSV ripetuti, nessuna interpolazione e nessun test di significatività implicito. Fit e bootstrap restano stime condizionate alle ipotesi documentate.

Non sono disponibili CSV reali o accesso fisico allo strumento per una validazione sul campo. Le prove coprono i percorsi e i casi elencati; non sono una certificazione strumentale né una garanzia per ogni file possibile.
