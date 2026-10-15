# LCpro T Mission Control · Clarity 2.2

PWA locale, senza dipendenze remote. Esperimenti → condizioni → letture → controllo qualità → curve e report. Conserva lo stesso indirizzo GitHub Pages per mantenere accessibili i dati del browser.

## Interfaccia 2.2

Tre aree: **Diario** (apertura predefinita e archivio), **Esperimento** (lavoro attivo), **Strumenti** (supporto). Quattro passaggi: **Organizza → Acquisisci → Analizza → Esporta**. Nome e tipo di curva restano visibili anche nella lettura. Su desktop l’elenco letture affianca il confronto e i dettagli; su smartphone è richiudibile. Gli stati del Diario sono Bozza, Da completare, Da verificare e Salvato; il pulsante indica l’azione specifica. Palette, controlli, tema scuro e animazioni ridotte sono coerenti. Nessun cambiamento agli schemi dei database o ai calcoli scientifici.

## Uso

1. Crea un esperimento A/Q o A/Ci e definisci le condizioni.
2. Carica o trascina i CSV. Assegna condizione, replica biologica e campione a ogni file; verifica anteprime e duplicati, poi conferma le letture.
3. In Analizza confronta le condizioni; scegli una lettura nell’elenco per completare la scheda, controllare la qualità e salvare il fit.
4. In Esporta genera il report dell’intero esperimento, il grafico o le medie CSV.
5. Dal Diario o dall'esperimento scarica periodicamente il backup completo.

Le repliche biologiche sono dichiarate dall'operatore; non vengono dedotte dai file o dalle foglie. Le medie nell'app usano X esattamente uguali, prima mediano i record della lettura, poi le letture dello stesso ID e infine gli ID biologici. DS disponibile con n ≥ 2. Nessuna interpolazione o inferenza aggiunta. Il piano delle repliche è opzionale e non certifica indipendenza o sufficienza statistica.

## Un solo backup

**Scarica backup completo** produce un JSON che contiene entrambi gli archivi: esperimenti, condizioni, ID biologici, CSV originali, metadati, esclusioni e motivazioni, audit, impostazioni e snapshot dei fit. Include anche le bozze dei CSV e dei metadati, separatamente dalle letture confermate.

Il ripristino mostra un'anteprima e valida formato, CSV e impronte SHA-256 disponibili prima delle scritture. Aggiunge copie con nuovi ID, riallacciando riferimenti a schede di analisi e bozze: non sovrascrive i dati già presenti. I backup precedenti LCproT-Research-Backup e LCproT-Experiments sono ancora importabili; ciascuno contiene solo i dati previsti dal vecchio formato.

Un ripristino fra i due database può essere interrotto dalla chiusura del browser. L'operazione viene registrata prima di aggiungere dati: nel Diario compare **Completa ripristino**. Le copie già aggiunte vengono riutilizzate e non sovrascritte, anche se nel frattempo sono state modificate. Non è una singola transazione fra database diversi: è un processo riprendibile con fasi idempotenti.

Limite di ripristino JSON: 100 MB. Archivi più grandi richiedono una gestione dedicata. Le bozze prive di un esperimento o di una lettura sorgente nel backup vengono segnalate nell'anteprima ed escluse dal ripristino.

## Recupero bozze

I CSV in preparazione e le assegnazioni vengono salvati automaticamente sul dispositivo. Attendi la dicitura **Bozza salvata sul dispositivo**. Il recupero dopo reload non li trasforma in letture archiviate: serve sempre la conferma dell'importazione. I file non selezionati rimangono in preparazione anche dopo l'importazione degli altri.

Le modifiche ai metadati della scheda nel Diario sono conservate come bozze separate. Nel riquadro **Recupero locale**, **Recupera bozza** le riapplica ai campi; verifica e premi **Salva scheda** per modificare l'archivio. Una bozza non è un backup esterno. I campi incompleti di altri strumenti, come un generatore SQS non salvato, non sono coperti da questo recupero.

Il backup può includere le bozze ancora in memoria anche se un errore impedisce la loro persistenza locale. Pulizia dei dati del sito, cancellazione del profilo o indisponibilità dello spazio del browser possono comunque eliminare i dati locali: conserva i backup esterni.

Limiti importazione CSV: 20 file, 32 MB per gruppo e 8 MB per file. La data di importazione resta distinta dalla data della misura.

## Report dell'esperimento

Dalla scheda Confronto scegli **Sintetico** oppure **Con metodi e dettagli**. Apri il report per Stampa → Salva PDF o scarica l'HTML autonomo, utilizzabile offline.

Il documento riunisce condizioni, metadati, repliche dichiarate, curve osservate e risultati per lettura. Riporta solo l'ultimo fit salvato coerente con impronta del CSV, tipo di curva, esclusioni e modifiche successive dei metadati. I fit da rivedere sono marcati ed esclusi dalla tabella dei parametri. Le cautele dei modelli rimangono visibili anche nel report sintetico.

Non vengono calcolati nuovi fit per il report. Le linee congiungono osservazioni e non sono medie o test fra condizioni. L'appendice esplicita unità, significati dei parametri, esclusioni, impronte, impostazioni e limiti; gli eventuali IC bootstrap restano esplorativi. Grafici molto grandi possono essere ridotti visivamente a circa 2.000 punti per lettura, mantenendo i conteggi completi.

## Compatibilità e aggiornamento

I database LCproTResearch_v1 e LCproTExperiments_v17 mantengono nomi, versioni e store precedenti. LCproTVault_v1 è un database aggiuntivo per bozze e ripristini in corso. Non viene effettuata una riscrittura generale dell'archivio esistente.

1. Esporta un backup prima dell'aggiornamento.
2. Carica tutti i file del pacchetto nella stessa cartella del repository GitHub Pages, sovrascrivendo gli omonimi.
3. Apri online e ricarica dopo l'attivazione del service worker. Non cancellare i dati del sito per aggiornare.
4. Verifica Diario, bozze e riapertura offline.

Nuovi file necessari nella 2.1: continuity-core.js, vault.js, recovery.js, experiment-report.js e continuity.css. Tutti i file del pacchetto sono necessari. Per i test e le limitazioni vedi TEST-REPORT.md.
