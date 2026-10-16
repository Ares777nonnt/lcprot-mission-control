# Clarity 2.17 — Disegno e repliche

Primo incremento preparatorio alla statistica. I risultati restano descrittivi: nessun t-test, ANOVA, p-value o nuovo intervallo di confidenza è stato introdotto.

## Uso

In **Esperimento → Organizza → Disegno e repliche**, aprire **Configura disegno e unità**.

1. Indicare l’unità indipendente che riceve il trattamento: pianta, vaso, parcella o altra unità.
2. Scegliere unità diverse oppure le stesse unità tra condizioni. È possibile lasciare il disegno da definire.
3. Segnalare blocchi, ulteriori tempi o strutture miste, che richiederanno un’analisi dedicata.
4. Verificare la tabella degli ID già assegnati. Più CSV dello stesso ID nella stessa condizione restano un solo gruppo; foglie e ripetizioni non aumentano automaticamente la numerosità indipendente. Gli ID si correggono dagli strumenti esistenti delle letture salvate.
5. Per le stesse unità, inserire manualmente una riga per soggetto, selezionando gli ID delle condizioni. Nessun abbinamento viene dedotto da nomi uguali. Le righe incomplete sono ammesse; un ID non può comparire in due abbinamenti nella stessa condizione.
6. Confermare la dichiarazione oppure salvare una bozza. Per confermare occorrono CSV con ID assegnati; nel disegno appaiato almeno un abbinamento tra due condizioni. Nei gruppi indipendenti gli ID devono essere distinti anche tra condizioni.

In **Risultati**, il riquadro espandibile del disegno mostra il contesto e n per parametro/X e condizioni visibili. Con due condizioni appaiate mostra le coppie complete con dati validi a quella X. La numerosità disponibile non certifica qualità, indipendenza o adeguatezza delle assunzioni statistiche.

## Persistenza e compatibilità

- Metadati aggiuntivi `statisticalDesign`, schema 1. Nessuna riscrittura automatica degli esperimenti preesistenti: restano «Disegno da definire».
- Registro delle condizioni, ID e ID dei CSV al momento della dichiarazione. Se cambiano le assegnazioni, il numero di letture o le condizioni, il disegno diventa da verificare. La sostituzione dell’ordine dei CSV non invalida la dichiarazione.
- Il salvataggio verifica che disegno e assegnazioni non siano cambiati durante l’apertura del modulo.
- Backup completi e importazione dei backup esperimenti conservano i nuovi metadati; i riferimenti ai CSV vengono rimappati sui nuovi ID. Il ripristino ripetuto conserva collegamenti e stato della dichiarazione.
- CSV, esclusioni, formule, camera, archivio legacy e cestino conservano le funzioni precedenti.
- Report sintetico (sezione contesto) e dettagliato includono la dichiarazione e gli abbinamenti. Un report con selezione parziale esplicita la verifica dello stato sul sottoinsieme incluso; una selezione diversa può far risultare il registro da verificare.
- Tre nuovi file di esecuzione inclusi nella cache offline, versione v32. Nessuna dipendenza esterna o CDN aggiunta.

## Verifiche e limiti

Fixture sintetiche, non dati sperimentali reali. Script conservati nel workspace:

- `test-design-core-v217.cjs`: vecchi progetti immutati, modalità indipendente/appaiata/complessa, ID mancanti, repliche tecniche, coppie incomplete/duplicate, conteggi a X, registro da verificare, validazione backup, doppio ripristino, cestino ed escaping.
- `test-design-v217.cjs`: modulo effettivo, conferma e bozze, rifiuto duplicati, salvataggio e riavvio, ripristino da interfaccia, report scaricati sintetico/dettagliato, selezione CSV/condizioni, formule precedenti, 320/390 px, chiaro/scuro, PWA offline, errori JavaScript.
- `test-design-migration-v217.cjs`: passaggio dal pacchetto 2.16 con service worker attivo alla 2.17, preservando dati originali e campi aggiuntivi, con nuova configurazione utilizzabile offline.
- `test-statistics-readiness.cjs` e regressioni numeriche/report delle versioni precedenti.

L’aggiornamento prepara i metadati necessari. La scelta e la validazione dei test inferenziali e l’analisi delle curve complete sono incrementi successivi.
