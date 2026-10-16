# Clarity 2.19 — Risultati leggibili

## Percorso

1. Intera curva: massimo delle medie biologiche osservate per condizione, X alla quale si trova, DS e n a quella X. Grafico e selezione delle curve subito sotto.
2. Parametri dei modelli: Asat, α apparente, respirazione apparente, LCP e Q90 per A/Q; Vcmax apparente, J operativo e respirazione apparente per A/Ci. Solo fit già salvati e coerenti. Accesso diretto alla lettura e ai dettagli.
3. Confronto a un livello: scelta X accanto ai valori, con avviso esplicito per Qleaf = 0. Statistica e approfondimenti conservati.

Il report sintetico e il dettagliato iniziano nello stesso ordine. Gli avvisi dei modelli sono espansi nel report per renderli visibili nella stampa. Le stime mancanti sono spiegate senza generare fit automatici.

## Significato dei risultati

Il massimo della media osservata è ottenuto aggregando record → CSV → ID biologico → condizione a X identiche, poi cercando il massimo fra queste medie. Non è il massimo di tutti i record, non è la media dei massimi delle singole foglie e non è Asat. Le condizioni possono avere massimi a X diverse; non si calcola una differenza fra questi massimi come confronto a pari condizioni.

I parametri dei modelli sono presentati per CSV, con identificazione della replica biologica. Non si inventano repliche e non si mediano automaticamente stime di fit diversi. Q90 mantiene la definizione originale: 90% dell’asintoto lordo. J operativo non viene rinominato Jmax. Nessuna formula fisiologica o statistica modificata.

## Conservazione e verifica

Nessun cambio di schema IndexedDB, nomi degli archivi, URL manifest o scope PWA. Cache applicativa aggiornata; CSV, esclusioni, fit, disegno e analisi statistiche conservati.

Verifiche eseguite:

- Massimo delle medie, ripetizioni tecniche, n biologico, ID mancanti e messaggi A/Q–A/Ci.
- Fit assenti, fit corrente, avvisi, selezione di condizioni, accesso alla lettura e ai dettagli.
- Report sintetico e dettagliato, verifica visiva desktop/mobile e PDF dimostrativo.
- Layout a 320, 390 e 1380 px, tema chiaro/scuro e assenza di overflow della pagina.
- Aggiornamento reale 2.18.1 → 2.19 con service worker attivo: confronto integrale di progetti e record prima/dopo; CSV ed esclusioni identici.
- Reload offline, fallback HTTP 503, flusso statistico completo, backup/ripristino e conservazione delle analisi.
- 50 casi numerici della statistica confrontati con SciPy 1.17.1.

Verifica ripetibile delle nuove funzioni: `node curve-results.test.cjs` dalla cartella dell’app. Il PDF dimostrativo usa dati sintetici e non rianalizza l’esperimento reale del basilico.
