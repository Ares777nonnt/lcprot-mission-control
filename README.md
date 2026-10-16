## Clarity 2.17 — Disegno e repliche

Configurazione esplicita di unità indipendenti, condizioni indipendenti/appaiate e abbinamenti manuali. Dichiarazione verificabile, backup e report coordinati, PWA offline. Prima fase preparatoria: nessun test inferenziale aggiunto. Guida e verifiche: [STATISTICA-2.17.md](STATISTICA-2.17.md).

## Clarity 2.16 — Bianco, Inchiostro e Smeraldo

Palette scelta: sfondi chiari, schede bianche, testi e numeri inchiostro, verde smeraldo per azioni e selezioni. Curve blu/arancio, report coordinati e tema scuro leggibile. Layout, logo, dati e formule conservati. Dettagli: [STYLE-2.16.md](STYLE-2.16.md).

## Clarity 2.15 — Laboratorio

Nuova palette bianco, blu petrolio e azzurro, anche nel tema scuro. Rimossa la foglia decorativa, superfici più pulite e report coordinati. Logo, font, archivio e flusso della 2.14 conservati. Dettagli: [STYLE-2.15.md](STYLE-2.15.md).

## Clarity 2.14 — Risultato prima

Percorso Organizza → Importa → Risultati, camera prima dei CSV, confronto numerico e grafico in primo piano, legenda selezionabile e approfondimenti su richiesta. Report con ambito esplicito e sezioni personalizzabili. Archivio e formule preservati. Dettagli e verifiche: [REWORK-2.14.md](REWORK-2.14.md).

## Correzioni e audit Clarity 2.13 — 16 ottobre 2026

Camera: il modulo si apre anche con metadati non salvati e offre salvataggio della scheda o conservazione di una bozza. Gli avvisi operativi sono contestuali e chiudibili; le cautele dei fit sono espandibili. Grafici e residui obsoleti sono rimossi quando il fit non è valido. Il salvataggio dei fit richiede metadati salvati.

**Elimina esperimento** è disponibile nelle schede del Diario e in **Organizza → Gestisci esperimento**. Dopo conferma, l’esperimento passa nel **Cestino esperimenti** del Diario; **Ripristina esperimento** recupera struttura, CSV, assegnazioni, collegamenti ai fit e bozze, anche offline. Il cestino è incluso nel backup completo. Le schede individuali già salvate non vengono eliminate. Nessun nuovo schema di database: `trashedAt` è un campo facoltativo del progetto.

Nuove importazioni con righe strutturalmente incomplete sono bloccate prima del salvataggio. I file storici sono segnalati senza alterare originali o indici delle esclusioni. La PWA usa la cache anche in caso di errori HTTP temporanei del server.

Copertura, problemi riprodotti e limiti: [Audit della pipeline](AUDIT-PIPELINE-2.13.md).

## Aggiornamento Clarity 2.12 — 16 ottobre 2026

Le analisi sono raccolte in quattro viste: Risultati, Confronto A/B, Tutti i parametri, Qualità e modelli. La selezione di condizioni e CSV è espandibile e resta comune alle viste. Il parametro principale è accompagnato da nome esteso, unità dei valori, X e guida a media/DS/n. Gli altri grafici si aprono su richiesta. Nessuna nuova formula o migrazione dei database.

Report sintetico: valori principali, riferimento, differenze, grafico biologico, sette parametri alla X scelta, limiti, camera e note. Le tabelle sono suddivise in gruppi di massimo tre condizioni. Valori molto piccoli in notazione scientifica, senza trasformarli in zero. Report dettagliato: stesso riepilogo iniziale, indice, letture, tabelle estese, fit coerenti, intervalli e tracciabilità. Il backup resta la fonte dei CSV originali.

L’ambito completo o selezionato è esplicito. Parametro, X, riferimento, modalità e curve vengono acquisiti all’avvio della generazione, anche se l’utente cambia selezione durante l’attesa. HTML autonomo stampabile in PDF. Tutte le nuove risorse sono incluse nella cache PWA offline.

## Aggiornamento Clarity 2.11 — 16 ottobre 2026

- Riepilogo del confronto: CSV, ID dichiarati, n effettivo al parametro e alla X scelti, condizioni da completare e limiti.
- Qualità per condizione: valori mancanti e motivi, record senza X, CSV senza ID biologico, errori di lettura, n inferiore al piano e DS indisponibile con una sola replica. Gli avvisi non certificano la qualità fisiologica.
- Confronto affiancato A/B fra condizioni selezionate: stesse scale X e Y, medie e ID biologici, scambio del riferimento, differenze assolute e percentuali solo con riferimento positivo. SVG autonomo da condividere. Nessuna interpolazione o test statistico aggiunto.
- Misure e modelli distinti: fit salvati coerenti separati dai grafici osservati, R², RMSE, unità, IC bootstrap e avvisi. Fit obsoleti esclusi dalle stime correnti; accesso diretto alla lettura.
- Report HTML autonomo stampabile in PDF: risultati al parametro/X correnti, qualità, confronto a due, note, camera e metodi esistenti. Report completo e report della selezione mantengono ambiti distinti.

Nessuna modifica ai database o alle formule. Selezioni temporanee come nella 2.10; archivi, CSV originali, esclusioni e fit conservati. Nuovi asset inclusi nella cache offline. Test con fixture sintetiche: prova sul campo con un esperimento reale ancora consigliata.

# LCpro T Mission Control · Clarity 2.10

PWA locale, senza dipendenze remote. Esperimenti → condizioni → letture → controllo qualità → curve e report. Conserva lo stesso indirizzo GitHub Pages per mantenere accessibili i dati del browser.

## Curve selezionabili e risultati in evidenza · 2.10

In **Analizza → Quali curve vuoi vedere?**, seleziona condizioni o singoli CSV. **Mostra tutte**, **Nascondi tutte**, **Solo questa condizione**, **Solo questa curva** e **Annulla ultima selezione** rendono esplicito cosa viene confrontato. Il checkbox della condizione indica anche una selezione parziale; nascondere l’ultimo CSV deseleziona la condizione. Le letture selezionate compaiono in etichette rimovibili, con conteggi visibili. Una nuova condizione viene resa selezionabile e inclusa automaticamente senza riattivare quelle già nascoste.

La selezione è **temporanea e limitata al confronto**: grafici, medie, DS, n biologico e CSV esportati si aggiornano sui soli CSV selezionati, mantenendo la gerarchia record → lettura → ID biologico → condizione. Non equivale all’esclusione permanente di record e non modifica archivio, audit o file originali. Rimane passando da una vista all’altra durante la sessione; ricaricando l’app si torna a tutte le letture. Per recuperare subito tutto usa Mostra tutte. Non viene dedotta l’indipendenza delle repliche dalla selezione.

**Risultati in evidenza** mostra il valore del parametro principale alla X scelta, con DS e n biologico per ogni condizione. Scegli un riferimento per vedere Δ assoluta e variazione percentuale. La percentuale viene calcolata solo rispetto a una media di riferimento positiva; con riferimento zero, negativo o mancante resta non disponibile. Sono differenze descrittive, non test di significatività. Colori e simboli identificano le condizioni senza giudicare un valore maggiore come migliore.

**Report del confronto selezionato** include soltanto condizioni e CSV selezionati, mantenendo colori e simboli originali. Il report completo dell’esperimento rimane disponibile separatamente e comprende tutte le letture. Grafico SVG, grafici coordinati, medie CSV e parametri per record rispettano la selezione; CSV e SVG riportano il conteggio delle letture selezionate. L’anteprima delle esportazioni chiarisce questa distinzione. Se non è selezionata alcuna curva, i risultati non vengono sostituiti con zeri e le esportazioni del confronto sono disabilitate; backup e report completo restano disponibili.

## Nuova pagina Analizza · 2.9

**Panoramica → confronto → dettaglio**: riepilogo di condizioni, letture, ID biologici distinti e letture da verificare; camera comune richiudibile; scorciatoie verso grafici, riepilogo e letture.

I parametri sono organizzati in **Scambi gassosi** (An, gs, E), **Uso dell’acqua** (A/E, An/gs) e **Rapporti con la CO₂** (Ci/Ca, An/Ci). Nomi, unità e spiegazioni restano accessibili. La vista iniziale mostra punti degli ID biologici e media ± DS per condizione; **Singole letture / CSV** è una vista di approfondimento. Ogni punto biologico è ottenuto mediando prima i record a X uguale nella lettura e poi le letture dello stesso ID: nessun CSV aggiuntivo diventa una replica indipendente.

Affianca fino a tre parametri con lo stesso intervallo X, ciascuno con scala Y e unità proprie. Seleziona Qleaf o Ci dal menu, oppure attiva un punto con clic o Invio/Spazio: il livello è evidenziato su tutti i pannelli e aggiorna le schede riepilogative. Nessuna interpolazione. Le condizioni mantengono colore e simbolo nel confronto e nei grafici del report. I colori identificano le condizioni e non esprimono un giudizio sui valori.

Il riepilogo usa schede per parametro, raggruppate in sezioni richiudibili. Ogni condizione riporta media, DS e proprio n biologico. Quando manca una media, appare **Non disponibile** con motivo (livello assente, denominatore non valido, ID biologici mancanti); non viene inserito zero. Su smartphone le schede si dispongono in verticale. Record, motivi di indisponibilità ed elenco delle letture restano nei dettagli.

In **Esporta**, l’anteprima distingue il report dell’intero esperimento dai grafici e CSV delle condizioni selezionate. Il report conserva le curve osservate delle singole letture e le tabelle biologiche. Il grafico principale SVG corrisponde alla vista selezionata; **Scarica i grafici coordinati** include tutti i pannelli visibili, ciascuno con scala e legenda. I dati, le formule, i fit e gli schemi degli archivi rimangono compatibili con le versioni precedenti.

## Camera comune e scheda semplificata · 2.8

In **Organizza → Impostazioni della camera**, dichiara una volta area inserita nello strumento, metodo Tleaf, modalità CO₂, eventuale setpoint, flusso e temperatura camera impostata. Se non lo hai ancora fatto, l’app lo chiede prima di leggere i CSV scelti o trascinati. I valori sconosciuti possono restare non dichiarati; annullare non importa file. Il setpoint compare solo per CO₂ controllata.

Le impostazioni comuni valgono per tutti i CSV dell’esperimento, anche quelli già importati e le letture ripristinate da “Letture rimosse”. Nella **Scheda** restano in primo piano specie, pianta, foglia, data e note. Tipo di curva e condizione sono definiti dall’esperimento. Il riepilogo **Camera: impostazioni ereditate** evita di reinserire i campi strumentali. Attiva **Personalizza per questa lettura** solo per un’eccezione; disattivala e salva per tornare ai valori comuni. Le eccezioni sono per campo: una diversa area non blocca l’eredità del flusso o della temperatura. Una modifica comune conserva le eccezioni esplicite.

I setpoint dichiarati non sostituiscono Qleaf, Ci, Cref, Area o altre misure nei CSV. I sette parametri fisiologici continuano a usare i file originali. I valori comuni sono applicati contestualmente a scheda, controlli qualità e report, senza riscrivere gli archivi storici quando si aprono le letture o si cambia la configurazione comune. Il salvataggio esplicito della scheda conserva una fotografia dei metadati come nelle versioni precedenti.

I fit nuovi registrano anche la firma delle impostazioni camera effettive. Un fit con firma differente o senza firma, quando viene dichiarata una configurazione comune, appare **da rivedere** nel contesto dell’esperimento e non viene presentato come risultato coerente nel report. Gli snapshot precedenti restano conservati. Impostazioni comuni ed eccezioni sono incluse nel backup completo e nel report; i riferimenti non dipendono dagli ID generati durante il ripristino. Nessuna modifica alla versione degli archivi IndexedDB.

## Parametri fisiologici · 2.7

In **Esperimento → Analizza**, scegli An, gs, E, Ci/Ca, A/E, An/gs o An/Ci. Il grafico usa Qleaf per gli esperimenti A/Q e Ci per A/Ci; i filtri delle condizioni e la vista singole letture / media biologica si applicano al parametro selezionato. La tabella confronta tutti i parametri a una stessa X scelta dall’operatore: non si mediano livelli diversi della curva.

| Parametro | Origine o formula | Unità |
|---|---|---|
| An | A (oppure An) dal CSV | µmol CO₂ m⁻² s⁻¹ |
| gs | gs dal CSV | mol H₂O m⁻² s⁻¹ |
| E | E maiuscola dal CSV | mmol H₂O m⁻² s⁻¹ |
| Ci/Ca | Ci / Cref | adimensionale |
| A/E | An / E | µmol CO₂ mmol⁻¹ H₂O |
| An/gs | An / gs | µmol CO₂ mol⁻¹ H₂O |
| An/Ci | An / Ci | mol m⁻² s⁻¹ |

**Ca = Cref**, CO₂ di riferimento in ingresso registrata nel file, anche quando alimentata da bombola. Non si sostituisce con 400 ppm, con il setpoint o con la CO₂ in uscita. Cref mancante rende Ci/Ca non disponibile. Definizioni e unità: [manuale ADC LCpro T, appendici 1 e 3](https://www.adc.co.uk/wp-content/uploads/LCproT-manual.pdf). An, gs ed E sono valori già elaborati dallo strumento, non ricalcolati dall’app dai segnali grezzi. An/Ci è un rapporto descrittivo, non Vcmax né una pendenza di carbossilazione.

I rapporti vengono calcolati **per record**, prima della media dei record a X identiche per lettura, delle letture per ID biologico e degli ID per condizione. Lo stesso ID in più CSV non aumenta n. Ogni parametro ha un proprio n: i dati mancanti non diventano zeri. DS campionaria solo per n ≥ 2. Denominatori mancanti, non numerici, nulli o negativi non producono rapporti; Ci negativo non produce Ci/Ca. An negativo resta visibile. Nessuna soglia arbitraria per denominatori positivi piccoli. Esclusioni e letture rimosse restano fuori dai calcoli.

**Esporta → Grafico e dati del confronto** scarica il grafico e le medie del parametro e delle condizioni selezionate. **Scarica tutti i parametri per record** include tutti e sette i valori, ID, condizioni, X, Ca e motivi di indisponibilità, conservando la precisione numerica. I CSV numerici usano il punto decimale. Il report HTML include tutti i parametri e le medie biologiche; per contenere la dimensione, ogni tabella del report mostra al massimo 500 righe, esplicitando il limite. Le esportazioni CSV comprendono tutte le righe.

I dati storici vengono riletti dai CSV originali; nessun cambio agli schemi IndexedDB, ai fit salvati o ai backup precedenti. Calcolo ed esportazioni disponibili offline dopo l’aggiornamento della cache.

## Gestione delle letture importate · 2.6.2

In **Esperimento → Acquisisci → Letture salvate**, ogni lettura offre **Riassegna** e **Rimuovi dall’esperimento**. Seleziona più letture per lavorare in gruppo; **Seleziona visibili** rispetta ricerca e filtro, mentre il conteggio comprende tutte le letture selezionate. La riassegnazione multipla conserva gli ID biologici salvo attivazione esplicita della loro modifica. Uno stesso ID identifica la stessa unità biologica: più CSV non aumentano il numero di repliche.

La rimozione richiede conferma e toglie la lettura da curve, medie e report dell’esperimento. Non cancella fisicamente il CSV né la scheda di analisi: **Letture rimosse** permette **Ripristina** o **Annulla tutte le rimozioni**, anche dopo reload offline. I dati recuperabili sono inclusi nel backup completo, con verifica delle impronte e riallacciamento alle analisi durante il ripristino. Le operazioni sono registrate nell’audit; una selezione cambiata nel frattempo viene rifiutata senza applicare modifiche parziali. Nessun cambio alla versione dei database.

## Tema chiaro e firma 2.6.1

Tema Bosco e terracotta più caldo: intestazioni verdi, riepiloghi colorati, accenti terracotta e ombre leggere sulle schede. Footer con il logo originale e il credito **Creato da Giuseppe Muscari Tomajoli**; guida, fonti e attribuzioni restano accessibili nel pannello dedicato. Segoe UI, dimensioni del testo e tema Notte botanica conservati. Nessuna modifica agli archivi, agli schemi dei database o ai calcoli.

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
