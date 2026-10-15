# LCpro T Mission Control · Clarity 2.6

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

## Veste grafica 2.3

Palette botanica con verde salvia e avorio, navigazione con icone vettoriali locali, intestazione del Diario, schede e riepiloghi con colori leggeri. Nessuna dipendenza da font o immagini remote; tema scuro, animazioni ridotte e stampa preservati. Il flusso e i database restano quelli della versione 2.2.

## Logo 2.3.1

Logo fornito dall’utente conservato senza modifiche in app-logo.jpg (1024×1024). Usato da intestazione, favicon, icona Apple e manifest PWA. Nel solo header il margine bianco viene nascosto via CSS; per le icone di sistema il file originale mantiene il margine sicuro. Inclusione offline nel service worker.

## Leggibilità 2.3.2

Testi di supporto da 14 px, pulsanti da 15 px, campi da 16 px. Su smartphone riepiloghi in due colonne, azioni su righe distinte nei display stretti e grafici scorrevoli con assi ingranditi. Modifiche limitate alla presentazione a schermo; stampa e dati invariati.

## Produttività 2.4

Nel Diario, passa a **Letture**, seleziona le schede e premi **Modifica selezionate**. Puoi applicare specie, cultivar, operatore, data/ora e trattamento a un massimo di 200 letture. Ogni campo deve essere selezionato esplicitamente e non può essere vuoto. L’anteprima mostra prima/dopo; nessuna scrittura avviene prima di **Applica alle letture**. Filtrando il Diario la selezione viene limitata alle sole schede ancora visualizzate.

La modifica è una transazione unica nel database delle schede di analisi: tutte le variazioni vengono salvate insieme o annullate. Le letture prive di scheda ricevono una scheda tecnica collegata al loro ID originale, senza creare nuovi esperimenti. CSV, SHA, esclusioni, ID biologici e snapshot dei fit sono conservati. Le modifiche entrano nell’audit; i fit precedenti diventano da rivedere e le verifiche guidate vengono invalidate quando cambiano campi sperimentali fondamentali. Bozze di metadati e modifiche non salvate della lettura selezionata bloccano l’operazione. Un controllo sul contenuto della scheda rifiuta anteprime diventate obsolete. Le copie negli esperimenti leggono i metadati correnti dalla scheda collegata.

La modifica multipla riguarda i metadati delle letture: condizioni dell’esperimento, pianta, foglia e ID delle repliche si gestiscono individualmente, per evitare raggruppamenti biologici involontari.

In **Leggibilità**, accanto ai controlli del tema, scegli testo Standard, Grande o Molto grande e spaziatura Comoda o Compatta. Le preferenze persistono sul dispositivo e funzionano offline; il pulsante Ripristina riporta ai valori iniziali. Non modificano la scala dei report di stampa e non entrano nei backup dei dati scientifici.

## Restyling approvato 2.5

Segoe UI per titoli e interfaccia, palette **Bosco e terracotta** per il giorno e **Notte botanica** per il tema scuro. Il selettore Tema chiaro/scuro conserva la preferenza già presente. Anche il colore della barra di sistema segue il tema. Logo originale, preferenze di testo, spaziatura e animazioni ridotte restano disponibili.

Il Diario mostra riepiloghi calcolati sull’archivio reale, schede con letture/condizioni/ID biologici dichiarati e uno stato aggregato. Gli ID sono conteggi di etichette dichiarate, non una valutazione di indipendenza biologica. Un esperimento senza letture è Bozza; metadati/ID mancanti richiedono completamento; letture da analizzare o fit da rivedere richiedono verifica. Il resto è Salvato.

La palette è estesa a esperimento, importazione, analisi, editor multiplo e recupero bozze. Nel confronto il testo dei filtri resta ad alto contrasto con un campione del colore della serie; i colori delle curve e i dati esportati non cambiano. Nessuna migrazione o modifica agli schemi dei database.

## Scheda esperimento 2.6

**Organizza** raccoglie obiettivo, nome, valori comuni, condizioni e piano facoltativo. Ogni condizione permette di modificare nome/note, aprire le proprie letture o iniziare un’importazione già contestualizzata. La creazione di una condizione porta all’importazione con quella condizione selezionata.

In **Acquisisci**, **Letture salvate** e **Importa CSV** sono due viste distinte. Le letture confermate sono raggruppate per condizione e ID biologico dichiarato; ID vuoti rimangono un gruppo da assegnare, senza inferenze. Ricerca e filtro mostrano un sottoinsieme senza modificare i dati. Scheda/note, qualità/fit e correzione dell’assegnazione sono accessibili dalla lettura mantenendo l’esperimento visibile. Le vecchie modifiche collettive restano in Modifica avanzata.

**Condizione e replica** sposta una lettura all’interno dello stesso esperimento o corregge l’ID nel confronto, con audit dell’esperimento. Conserva ID della lettura, CSV, SHA, esclusioni e scheda di analisi. Non cambia il campo Pianta della scheda originale; ID biologico del confronto e metadati originali sono distinti. Una verifica di concorrenza rifiuta un’assegnazione diventata obsoleta. Nome/obiettivo/valori comuni e nome/note di condizione hanno controlli analoghi, su transazioni del database progetti. Gli esperimenti virtuali 1.6 vengono copiati alla prima modifica, conservando la scheda storica.

Specie, operatore e protocollo comuni sono valori predefiniti solo per i CSV aggiunti successivamente. Vengono copiati nella bozza all’ingresso, quindi un cambiamento dei valori comuni non riscrive bozze o letture esistenti. Ogni file può fare eccezione nell’anteprima. La data di misura resta esplicita, mai dedotta dall’importazione.

**Esporta** mostra un controllo preliminare con collegamenti alle letture da completare/verificare e avvisi sulle bozze escluse. L’esportazione resta disponibile per le letture confermate. Il report riporta l’obiettivo se dichiarato; i metodi dei fit e delle medie non cambiano. Tutti i nuovi metadati dei progetti sono inclusi nel backup completo; schema e nomi dei database restano invariati.
