# LCpro T Mission Control · Clarity 1.6 — Visual Edition

## Nuovo in questa versione

- **Colori semantici:** Amax osservata (verde petrolio), Asat del modello (blu), messaggi di cautela (ambra), dati non validi o errori (rosso), completamenti verificati (verde). Il colore non implica automaticamente che un valore elevato sia fisiologicamente positivo.
- **Microanimazioni:** comparsa discreta dei passaggi e dei riquadri principali, progressione della curva adattata e dei punti, feedback del messaggio dopo un salvataggio effettivo. Nessuna animazione modifica valori o calcoli.
- **Accessibilità:** pulsante *Animazioni on/off*, memorizzato su questo dispositivo; rispetto automatico di `prefers-reduced-motion`, contrasto anche in modalità notte. Colori sempre accompagnati da testo o simboli.
- **Report PDF:** nel report HTML stampabile i risultati misurati e stimati hanno colori differenti; legenda e impaginazione minimali mantenute. La stampa è statica e senza animazioni.

**Non modificati:** parser CSV, fit matematici, Diario IndexedDB, regole Health Check, sequenze SQS, workflow e struttura degli esperimenti.

## Aggiornamento GitHub Pages

1. **Prima di aggiornare:** esporta il backup JSON dal Diario e conserva i CSV originali. Non cancellare i dati del sito.
2. Estrai lo ZIP e carica *tutti i file dell'applicazione* nella radice del repository `lcprot-mission-control` (non una sottocartella), sovrascrivendo quelli omonimi.
3. Due file **nuovi e necessari**: `visual-edition.css` e `visual-edition.js`. Quattro file aggiornati: `index.html`, `research-app.js`, `manifest.webmanifest`, `sw.js`. Gli altri sono invariati e possono restare nel repository.
4. Conferma il commit e aspetta il deployment di GitHub Pages. Apri l'app con Internet attivo e ricarica. Verifica che la Console non mostri 404 per i nuovi file.
5. Verifica su una curva A/Q: Amax verde, Asat blu, avvisi ambra/rosso; prova il pulsante animazioni e il report PDF.
6. **Offline:** dopo che la pagina aggiornata ha completato il primo caricamento online, prova la modalità aereo. Non rimuovere la PWA e non cancellare i dati per aggiornare la cache.

## Limitazioni

Il browser può conservare temporaneamente file di una vecchia versione: se il sito appare invariato, controlla in DevTools > Application > Service Workers e Network quali risorse sono effettivamente caricate. L'opzione per ridurre il movimento del sistema prevale sull'interruttore dell'app. I colori rappresentano categorie di informazione, non diagnosi fisiologiche. Il report PDF deriva dal comando Stampa → Salva PDF e la resa cromatica può dipendere dalle impostazioni di stampa (attivare stampa sfondi, se necessario).
