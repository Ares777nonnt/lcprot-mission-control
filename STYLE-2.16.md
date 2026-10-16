# Clarity 2.16 — Bianco, Inchiostro e Smeraldo

Palette scelta dallo snapshot: sfondo `#F3F6F4`, schede bianche, testi `#182C26`, secondari `#4D6259`, azioni e selezioni `#087B63`. I valori principali restano color inchiostro. Grafici blu/arancio con simboli differenti, coerenti fra legenda, schede, SVG e report. Nel tema scuro le prime due serie hanno colori più luminosi sullo schermo; i file esportati mantengono i colori adatti allo sfondo chiaro.

Il layout della versione pubblicata 2.15 è conservato. La proposta Tech Space non viene inclusa. Logo con il fiore, Segoe UI e credito del creatore conservati; foglia decorativa assente. Report coordinati alla palette; cache PWA aggiornata a `lcprot-mission-clarity-2026-10-16-v31`. Nessuna modifica agli schemi IndexedDB, alle formule o ai dati archiviati.

## Verifiche

- `test-smeraldo-v216.cjs`: creazione/importazione CSV con camera comune, aggregazione biologica, selezione di condizioni/letture e annullamento, delta e riferimento, report sintetico/dettagliato, ambito e sezioni, anteprima reale e download; archivio invariato durante le selezioni.
- Colori effettivi di sfondo, pulsante principale, valori inchiostro e pannelli bianchi verificati; assenza di Tech Space e foglia decorativa; logo/font conservati. Contrasto almeno 4,5:1 sui controlli e testi principali campionati.
- Desktop e 320/390 px, tema chiaro/scuro, persistenza del tema, riapertura e report offline; nessuna eccezione JavaScript nei test.
- `test-v212-core.cjs`: report A/Q e A/Ci, unità, precisione, riferimento/X, valori mancanti, escaping e originali immutati.
- Integrità ZIP, riferimenti locali e risorse precaricate verificati.

Fixture sintetiche e profili browser di prova. Il campionamento del contrasto non costituisce una verifica completa di accessibilità di ogni schermata della guida.
