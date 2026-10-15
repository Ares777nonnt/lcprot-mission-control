# Verifica Clarity 1.7 — 15 ottobre 2026

Test con Node.js, Playwright e Microsoft Edge headless, profilo temporaneo. App servita sotto /lab/ come sottocartella GitHub Pages. Dati sintetici; nessun archivio reale fornito.

PASS:

- Sintassi moduli nuovi e research-app.js.
- Migrazione in memoria senza mutazioni, esclusioni originali rispettate, repliche sconosciute escluse dalle medie.
- Asse A/Ci distinto da Qleaf; fit A/Q del core originale operativo sulla fixture.
- Medie gerarchiche record/lettura/replica, numerosità biologica e DS assente con n=1.
- Prima modifica di una scheda storica crea una copia: oggetto originale riletto identico da IndexedDB, inclusi audit, esclusioni e fit di prova.
- Esperimento con due condizioni; due CSV per Pianta-01 e uno per Pianta-02 nella prima condizione danno n biologico 2.
- Confronto e filtro condizioni verificati tramite conteggio punti del grafico.
- Esportazione backup e ripristino in nuove copie, senza sovrascrittura.
- Persistenza dopo reload, riapertura offline con quattro letture, archivio originale ancora identico.
- Viewport mobile 390 × 844, chiusura disponibile, verifica visiva; nessuna eccezione JavaScript raccolta.

Non verificati: archivio reale utente, installazione iOS/Android, deployment remoto, stampa PDF fisica, quota e memoria con archivi molto grandi. Il controllo A/Ci riguarda asse e logica condivisa, non una validazione scientifica dei modelli.

Script test-v17.cjs fornito separatamente dal pacchetto web. Richiede Node.js, Playwright ed Edge; adattare il percorso Playwright al proprio ambiente.
