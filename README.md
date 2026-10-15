# LCpro T Mission Control · Clarity 1.7

Aggiornamento del pacchetto 1.6 fornito, senza dipendenze remote.

## Uso rapido

Apri **Esperimenti · condizioni e confronto curve** dalla Home.

1. Crea un esperimento A/Q o A/Ci.
2. Aggiungi condizioni e metadati: trattamento, temperatura, CO₂, luce, unità e protocollo.
3. Scegli condizione, ID biologico e campione/foglia. Importa uno o più CSV della stessa replica. Per altre piante ripeti con un altro ID.
4. Confronta singole letture oppure medie biologiche ± deviazione standard. Filtra le condizioni; esporta SVG, CSV delle medie o stampa/PDF.

Espandi la condizione per modificare nome, metadati e ID biologici, poi premi **Salva condizioni e repliche**. Il tipo di curva è fissato alla creazione. Un CSV corrisponde a una lettura: non si segmentano automaticamente file contenenti più condizioni.

## Repliche e statistiche

L'unità biologica viene dichiarata dall'operatore, non dedotta da file o foglia. Usa lo stesso ID per la stessa unità anche fra condizioni. I conteggi per condizione non sono sommabili fra trattamenti appaiati.

Per ogni X esatta: media dei record per lettura → media delle letture dello stesso ID → media fra ID biologici. Le letture hanno pari peso nella replica; le repliche pari peso nella condizione. n varia con X. DS campionaria con n ≥ 2. ID mancanti esclusi dalle medie, visibili come singole letture. Nessuna interpolazione, test inferenziale o fit nel nuovo confronto. Le linee congiungono osservazioni. Il CSV esporta tutte le condizioni, il grafico quelle selezionate.

In A/Ci le ascisse esattamente uguali possono essere rare: n=1 è possibile. Non vengono forzate griglie comuni. Fit e report storici restano disponibili nel percorso originale. Per adattare individualmente un CSV nuovo, importalo anche nel percorso originale Curve Lab.

## Archivio e backup

Il database originale **LCproTResearch_v1**, store **experiments**, mantiene nome e versione. Le schede sono presentate come esperimenti storici a una condizione, senza assegnare automaticamente repliche biologiche. Alla prima modifica viene creata una copia nel database aggiuntivo **LCproTExperiments_v17**, store **projects**. Il modulo nuovo non modifica le schede originali. Le esclusioni sono rispettate. Puoi anche aggiungere copie di letture storiche a condizioni di nuovi esperimenti.

Il Diario originale conserva audit, workflow, fit, CSV e report. In research-app.js il salvataggio ora attende il completamento della transazione IndexedDB.

Conserva **entrambi** i backup: JSON del Diario originale e backup 1.7 dell'area Esperimenti. Il backup 1.7 contiene condizioni, letture, metadati, CSV, SHA-256 ed esclusioni; non sostituisce audit/workflow/fit del Diario. Il ripristino 1.7 valida tutto prima della scrittura atomica e aggiunge copie con nuovi ID senza sovrascrivere. Limiti importazione: 8 MB/CSV, 45 MB/backup.

## Aggiornamento GitHub Pages

1. Esporta il backup del Diario e conserva CSV e vecchio ZIP.
2. Carica tutti i file del pacchetto nella stessa cartella del repository, sovrascrivendo gli omonimi. Mantieni dominio e percorso dell'app.
3. Dopo il deployment apri online, lascia aggiornare il service worker e ricarica. Controlla Clarity 1.7 nell'area Esperimenti.
4. Verifica le schede storiche e prova offline dopo il caricamento online completo. Non cancellare i dati del sito o disinstallare la PWA per aggiornare.

Nuovi file necessari: experiments-core.js, experiments-app.js, experiments.css. Cache aggiornata; percorsi relativi compatibili con sottocartelle. Manifest id, start_url e scope preservati. Nessuna pubblicazione remota effettuata.

Vedi TEST-REPORT.md. Tornando alla 1.6 il database originale rimane disponibile, ma quella versione non legge il database aggiuntivo 1.7.
