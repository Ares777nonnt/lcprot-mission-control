# Clarity 2.18.1 — Pulsante statistico e motivi del blocco

Correzione dell’interfaccia. Motore statistico `LCStatistics/1.0.0`, formule e archivi delle analisi invariati.

Il pulsante **Calcola e salva analisi** era disabilitato in presenza di prerequisiti mancanti, ma il modulo non ne spiegava il motivo in modo riconoscibile.

Ora il modulo presenta:

- Un riquadro **Stato del disegno** in alto, con stato e descrizione dell’unità e della relazione tra condizioni. Quando serve, **Apri Disegno e repliche** chiude il modulo e apre la configurazione in Organizza.
- Un riquadro **Perché il pulsante è disabilitato**, vicino al pulsante, con tutti i blocchi effettivi: disegno non definito/non confermato/da verificare/complesso, gruppi uguali o mancanti, CSV non inclusi o assenti, livello X non disponibile.
- Il comando esplicito **Includi tutti i CSV dei due gruppi** quando il filtro del grafico aveva escluso tutte le letture di un gruppo. Aggiorna soltanto la selezione del modulo statistico: non modifica i CSV, gli ID o la selezione del grafico e non ricalcola vecchie analisi.
- Un collegamento alle letture da importare per le condizioni senza CSV.
- Il messaggio **Selezione pronta** quando i blocchi sono risolti. Domanda e conferma delle assunzioni restano obbligatorie tramite la validazione del modulo. Numerosità, dati mancanti e variabilità vengono controllati dal motore al calcolo, come nella 2.18.

Il calcolo non viene abilitato automaticamente per disegni non confermati o non supportati. Nessun abbinamento, ID o dichiarazione viene inferito dal programma. Per accedere manualmente alla configurazione: **Esperimento → Organizza → Disegno e repliche → Configura disegno e unità**, sopra le impostazioni della camera.

Verifiche nel workspace: `test-statistics-readiness-ui-v2181.cjs` controlla i casi di filtro che esclude un gruppo, inclusione esplicita, disegno non confermato e apertura diretta della configurazione, disegno complesso e assegnazioni cambiate; esegue inoltre il flusso statistico, report, backup, mobile e offline della 2.18. Il test numerico incluso nel pacchetto resta disponibile con `node validate-statistics.cjs`.

Cache offline aggiornata a v35. Gli esperimenti e le analisi preesistenti rimangono compatibili.
