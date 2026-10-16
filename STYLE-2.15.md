# Clarity 2.15 — Laboratorio

Aspetto scelto: bianco, blu petrolio e azzurro. Il tema scuro usa superfici blu profonde, testi chiari e accenti azzurri. Font Segoe UI, logo con il fiore e credito del creatore conservati.

La foglia stilizzata è stata rimossa dalle definizioni CSS. Eliminati i fondi decorativi botanici del Diario e le superfici verdi/terracotta: navigazione, schede, camera, importazione, risultati, report e credito seguono la nuova palette. Bordi più sobri, forme meno arrotondate e selezione attiva evidenziata in azzurro.

I colori semantici degli avvisi e l’identità cromatica delle condizioni nei grafici restano distinti dal colore dell’interfaccia. Nessuna formula, assegnazione, esclusione, replica o archivio modificato. Il flusso Risultato prima della 2.14 resta operativo.

## Verifiche

- `test-v215.cjs`: resa reale di Diario, Importa e Risultati; assenza della foglia nei temi chiaro/scuro; logo originale e font presenti; contrasto testo/sfondo almeno 4,5:1 sui controlli e testi principali campionati. Controllati schermi 320/390 px e desktop, anteprima e download dei report, persistenza del tema, intestazione di sistema, riapertura offline e assenza di eccezioni JavaScript.
- Lo stesso test ripercorre creazione, camera, CSV, aggregazione biologica, selezione delle condizioni e delle letture, riferimento/delta, approfondimenti e report con ambito/sezioni. Confronto dell’archivio prima/dopo le selezioni: invariato.
- `test-v212-core.cjs`: report A/Q e A/Ci, precisione, unità, riferimento/X, valori mancanti, escaping e dati originali immutati.
- Integrità ZIP e risorse PWA verificate. Cache nuova: `lcprot-mission-clarity-2026-10-16-v30`.

Verifiche su dati sintetici e profili browser di prova. Il campionamento del contrasto non costituisce un audit completo di accessibilità di ogni schermata della guida.
