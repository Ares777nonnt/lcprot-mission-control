# Clarity 2.22 — AI locale leggera

## Preparazione

In Bionic / LM Studio disattivare il caricamento dei modelli su richiesta. Prima della domanda caricare manualmente una sola istanza di Gemma con contesto 4096, Evaluation Batch Size 128, Physical Batch Size 64 e Max Concurrent Predictions 1. Sul portatile della prova GPU Offload era impostato dall’utente a 18; questo valore non è imposto né verificabile dalla PWA. Controllare RAM e memoria video: distribuire il modello sulla CPU riduce la VRAM ma aumenta la RAM occupata. Il profilo non garantisce la stabilità del driver o dell’hardware.

Avviare il server locale con CORS, aprire l’esperimento e «Assistente AI locale», quindi «Verifica collegamento». URL iniziale http://localhost:1235/v1 e modello google/gemma-4-e4b. Il campo URL resta compatibile con le preferenze 2.21; internamente la versione 2.22 usa esclusivamente le API native /api/v1/models e /api/v1/chat, che supportano reasoning=off. Se il browser lo richiede, consentire l’accesso al server locale.

## Limiti applicati

- Ragionamento disattivato esplicitamente, nessuna integrazione di strumenti o ricerca web, nessuna conversazione persistita sul server (store=false).
- Massimo 320 token di risposta, richiesta di circa 120 parole, domanda fino a 600 caratteri. Nessun riutilizzo automatico della cronologia.
- Massimo 7000 byte UTF-8 per istruzioni, JSON e domanda insieme: se superato, selezionare meno CSV/condizioni. È un limite di dimensione, non una misura esatta dei token; Bionic applica il proprio limite di contesto 4096. Nessuna selezione viene ridotta silenziosamente.
- Prima di ogni domanda: verifica di una sola istanza caricata, contesto 4096, batch non superiore a 128, parallelismo 1, batch fisico non superiore a 64 quando esposto dal server, e supporto del ragionamento disattivato. In caso contrario nessuna generazione viene avviata. L’app non carica né modifica modelli.
- Una generazione per origine del sito fra schede tramite Web Locks, senza coda automatica. Non blocca richieste da altri programmi o browser. Scadenza della richiesta browser dopo 90 secondi, interruzione manuale sempre disponibile: l’effettivo arresto del lavoro sul server dipende da Bionic.
- Risposte incomplete, al limite massimo, con errori, ragionamento o strumenti non sono salvabili come note complete. Il testo resta da revisionare.

## Dati, note e report

L’aggregazione rimane record → CSV → ID biologico → condizione. Sono inclusi solo i CSV selezionati: sette parametri alla X scelta, curve osservate campionate, massimo osservato distinto da Asat, fit e avvisi, camera e disegno dichiarato. Statistiche solo se correnti e corrispondenti al confronto. I CSV integrali non vengono inviati.

Note precedenti, incluse domande oltre 600 caratteri, restano valide ed esportabili. Il limite nuovo vale solo per nuove richieste. Nessuna modifica di schema IndexedDB o dei calcoli fisiologici/statistici. Note nuove revisionate, backup e report mantengono la tracciabilità già presente. Il token API resta soltanto in memoria nella pagina.

PWA offline: l’app, l’archivio e le note funzionano senza internet; una nuova risposta richiede Bionic locale attivo. Nessun fallback cloud.

Protocollo: https://lmstudio.ai/docs/developer/rest/chat e https://lmstudio.ai/docs/developer/rest/list .
