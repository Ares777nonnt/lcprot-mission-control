# LCpro T Mission Control — versione mobile / PWA

Questa è la versione **senza la sezione Manuale**, con **grafico CSV corretto**, tema giorno/notte, modalità esperto/inesperto, generatore `.SQS`, analisi CSV e confronto multi-CSV. I file necessari sono tutti nella stessa cartella.

## Pubblicazione su GitHub Pages

1. Accedi a [github.com](https://github.com) e crea un repository (es. `lcprot-mission-control`).
2. Carica **nella radice del repository** questi cinque file: `index.html`, `manifest.webmanifest`, `sw.js`, `icon-192.png`, `icon-512.png`. Non caricare soltanto lo ZIP.
3. Apri **Settings → Pages**; sotto *Build and deployment* scegli **Deploy from a branch**, quindi il branch `main` e la cartella `/(root)`. Salva.
4. Attendi la pubblicazione e apri `https://TUO-UTENTE.github.io/lcprot-mission-control/`. L'indirizzo esatto appare in Settings → Pages.
5. Apri e verifica la guida, importa un CSV e controlla il grafico prima dell'installazione sui dispositivi.

> **Privacy:** un repository GitHub Pages pubblico è raggiungibile da chiunque conosca l'URL. Non caricare CSV, dati dei campioni o documenti riservati nel repository. I CSV selezionati dall'app vengono elaborati localmente sul dispositivo.

## Installare su iPhone e iPad

1. Apri l'indirizzo della PWA in **Safari**.
2. Tocca **Condividi** → **Aggiungi alla schermata Home** (su alcune versioni di iOS puoi dover scorrere le azioni).
3. Se mostrato, scegli **Apri come app web** e poi **Aggiungi**.
4. Aprila dall'icona sulla Home. Dopo averla caricata almeno una volta online, metti il dispositivo in modalità aereo per verificare l'uso offline.

## Installare su Android

1. Apri l'indirizzo della PWA in **Chrome**.
2. Menu **⋮** → **Installa app** oppure **Aggiungi a schermata Home**, a seconda del dispositivo.
3. Conferma e apri l'icona installata; prova poi l'uso offline.

## Aggiornamenti

Per distribuire nuove versioni, sostituisci `index.html` e gli altri file modificati nel repository. Quando cambi i file precaricati, **aggiorna il nome `CACHE` in `sw.js`** (es. da `v4` a `v5`) per forzare il rinnovo della cache offline. Poi apri l'app mentre sei online, ricarica e riavviala. Su alcuni dispositivi è necessario chiuderla e riaprirla.

## Uso su computer / senza GitHub Pages

`index.html` può essere aperto da solo dal computer; la registrazione della PWA e la cache offline richiedono invece HTTPS oppure `localhost`. Per fare un test locale da computer, apri un terminale nella cartella e lancia `python -m http.server 8000`, quindi visita `http://localhost:8000`.

## Note funzionali

- Il pulsante **Reset sessione** azzera le checklist secondo la procedura implementata, non i file originali.
- Il salvataggio delle preferenze (es. tema) è locale al browser/dispositivo e non viene sincronizzato.
- Le elaborazioni dei grafici e le stime fisiologiche sono strumenti di supporto: validare i risultati e le condizioni della camera prima dell'uso scientifico.
- La modalità offline richiede **una prima apertura online completata**; svuotare la cache del browser può rimuovere la disponibilità offline.
