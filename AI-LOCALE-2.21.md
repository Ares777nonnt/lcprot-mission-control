# Clarity 2.21 — Assistente AI locale

## Uso

In Bionic/LM Studio avviare il server locale e abilitare CORS. Aprire l’esperimento in LCpro T, premere «Assistente AI locale» e «Verifica collegamento». Configurazione iniziale: `http://localhost:1235/v1`, modello `google/gemma-4-e4b`. Se il browser chiede l’accesso al computer/rete locale, consentirlo per collegarsi al servizio. Il server deve girare sullo stesso computer su cui si apre la PWA.

Selezionare i CSV nei risultati, scegliere una domanda rapida o scriverne una. La risposta arriva progressivamente e può essere interrotta. Controllare il testo, eventualmente modificarlo, selezionare la conferma di revisione e salvare una nota. Le note sono conservate nell’esperimento e nel backup completo; sono esportabili anche come JSON.

Nel compositore del report si può scegliere di includere l’ultima nota revisionata corrispondente. Si verifica che dati, fit, analisi salvate, selezione dei CSV, parametro e X coincidano. Note storiche o di una selezione diversa non vengono presentate come commenti correnti del report.

## Cosa viene inviato

Solo su azione esplicita: riepilogo strutturato dell’esperimento e dei CSV selezionati, impostazioni della camera, disegno dichiarato, medie biologiche dei sette parametri alla X scelta, massimo osservato di An e fino a sei punti osservati campionati per condizione per il parametro scelto. Fit coerenti aggregati per ID biologico e avvisi inclusi. La statistica salvata entra nel contesto soltanto se verificata, corrente e corrispondente agli stessi CSV, X e parametro.

Non si inviano CSV integrali, backup, token nel contesto del modello o file estranei all’esperimento. Le note e l’obiettivo possono essere abbreviati e i limiti sono dichiarati nel contesto. La richiesta viene rifiutata se il riepilogo eccede il limite iniziale di dimensione: ridurre i CSV selezionati.

## Confini

- Endpoint consentiti soltanto su localhost, 127.0.0.1 o loopback IPv6; nessun provider cloud o fallback remoto.
- Nessuna connessione automatica, nessuna ricerca web, nessuna esecuzione di strumenti o istruzioni contenute nei dati.
- Token API facoltativo, mantenuto soltanto nella memoria della pagina e mai nel backup o nelle note. URL e identificativo modello sono preferenze locali del browser.
- Risposte mostrate come testo, senza eseguire HTML o codice. Il ragionamento separato del server non viene mostrato come risposta.
- Calcoli fisiologici, fit e statistica restano nei moduli esistenti. L’AI genera interpretazioni che richiedono revisione, senza garanzia di correttezza scientifica.
- Budget iniziale di generazione 2.500 token, incluse le eventuali parti di ragionamento del modello; tempo massimo cinque minuti. Risposte interrotte o incomplete non sono salvabili come note complete.
- Massimo 20 note revisionate per esperimento, eliminabili dall’interfaccia. Nessun cambio dello schema IndexedDB; backup precedenti compatibili. IDs delle fonti rimappati nel ripristino.

## Verifiche

PASS: endpoint solo loopback; contesto limitato; ripetizioni tecniche e n biologico; DS mancante con n=1; avvisi fit; separazione fra dati e istruzioni; output testuale; risposta progressiva; interruzione; risposta incompleta; HTTP 401; server non raggiungibile; token escluso da preferenze persistenti, contesto e backup; revisione prima del salvataggio; report con fonte/selezione corrispondenti; backup, ripristino e rimappatura; archivio dei CSV invariato; tema chiaro/scuro e larghezze 320/390/1380 px; app utilizzabile senza server AI.

PASS: aggiornamento reale 2.20 → 2.21 con service worker attivo e archivi originali identici. Confronto fisiologico e flusso statistico precedenti conservati; 50 casi numerici confrontati con SciPy 1.17.1.

Prova reale sul modello locale Gemma 4 E4B: una richiesta sintetica ha completato una risposta in circa 20 secondi, riconoscendo due repliche nel controllo e una nel trattamento e l’assenza di evidenza di significatività. Questo misura il funzionamento tecnico del collegamento e non costituisce validazione scientifica generale del modello.

Verifica ripetibile: `node local-ai.test.cjs` nella cartella dell’app. Documentazione del protocollo: https://lmstudio.ai/docs/developer/openai-compat/chat-completions e https://lmstudio.ai/docs/developer/core/server/settings.
