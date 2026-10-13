# LCpro T Mission Control — Clarity 1.4

PWA locale/statica pronta per GitHub Pages. Aggiornamento dedicato a **navigazione, continuità del percorso e chiarezza dei risultati fotosintetici**, non a nuove formule di fitting.

## Novità della 1.4

- **Cinque fasi visive** (Prepara → Misura → Carica dati → Analizza → Concludi) che raccolgono i nove passaggi scientifici già previsti, con avanzamento salvato per esperimento.
- **Scheda breve direttamente nel percorso**, con specie, ID pianta, tipo di curva, Tleaf, area e trattamento. I metadati avanzati restano nel Diario. La scheda è salvata in IndexedDB dopo aver premuto il relativo pulsante.
- **Importazione CSV nel passaggio 6**, collegata all'esperimento attivo, senza dover cambiare scheda o selezionare nuovamente l'esperimento. Originale immutato e tracciato come nelle versioni precedenti.
- Se si apre Diario, Health Check, Curve Lab o Report, compare una **barra per tornare al punto esatto del percorso**.
- Le motivazioni retrospettive e la valutazione di qualità **non richiedono più 20 caratteri**. Restano richieste attestazioni esplicite; per i dati non disponibili si può dichiarare “Non documentato”. La valutazione qualità offre scelte rapide e una nota facoltativa.
- L'esclusione di un record dal fit propone **motivazioni standard selezionabili** o una motivazione libera, sempre conservata nel registro delle modifiche.
- **Amax osservata e Asat stimata** ben separate nelle metriche di Curve Lab, nel riepilogo del passo 9, nel Report Studio e nel report stampabile. Avviso quando Q90 è oltre il massimo PAR misurato. Nessuna modifica alle formule numeriche del modello.
- “**Ho già un CSV da analizzare**” crea una nuova scheda in modalità retrospettiva e apre il percorso direttamente, senza prima passare dal Diario.
- Layout responsive e colori ad alto contrasto in tema giorno/notte.

## Installazione / aggiornamento GitHub Pages

1. **Prima di aggiornare**: nel sito attuale vai su **Diario → Backup completo JSON** e conserva i CSV originali separatamente. Verifica che il file JSON scaricato sia stato salvato correttamente.
2. Estrai lo ZIP e carica nella **radice** del repository GitHub Pages, sostituendo quelli già presenti, i seguenti **10 file applicativi**:

   - `index.html`
   - `sw.js`
   - `manifest.webmanifest`
   - `research-core.js`
   - `research-app.js`
   - `guided-workflow.js`
   - `ux-shell.js`
   - `clarity-flow.js` **(nuovo)**
   - `icon-192.png`
   - `icon-512.png`

   Puoi caricare anche questo `README.md` (facoltativo). **Non** caricare lo ZIP come file del sito.
3. Premi **Commit changes**, attendi che la pubblicazione Pages sia terminata e apri online `https://ares777nonnnt.github.io/lcprot-mission-control/`.
4. Controlla nel percorso la dicitura **CLARITY 1.4**. La cache PWA aggiornata contiene anche `clarity-flow.js`.
5. Se l'interfaccia appare ancora vecchia, attendi il rinnovo del Service Worker e ricarica online. **Non cancellare dati del sito o disinstallare la PWA** per forzare l'aggiornamento: cancellare IndexedDB può eliminare l'archivio locale.

## Primo collaudo consigliato

1. **Inizia un nuovo esperimento** → compila i campi brevi direttamente nel passaggio 1 → **Salva scheda**.
2. Completa le verifiche realmente effettuate. Se la misura è già conclusa, seleziona **Ho già un CSV da analizzare** dalla Home per la modalità retrospettiva.
3. Nel passaggio **CSV**, importa il file originale e verifica record, unità e ordine.
4. In **Health Check**, valuta gli avvisi. Non usare l'assenza di segnalazioni come validazione scientifica.
5. In **Curve Lab**, controlla **Amax osservata** e **Asat stimata** separatamente, oltre a fit, residui e incertezza. Salva il fit nel Diario.
6. Torna al percorso → completa le verifiche → in **Report Studio** genera il documento e conserva backup JSON e CSV.

## Principi scientifici e limiti

- Un'asserzione in checklist documenta una verifica dell'operatore: l'app **non comunica in tempo reale con l'LCpro T** e non certifica la stabilizzazione.
- I termini Amax osservata (valore misurato) e Asat stimata (asintoto netto del modello) **non sono equivalenti**. Asat può richiedere estrapolazione quando la saturazione non è raggiunta entro la PAR misurata.
- I valori per Curve Lab non sono ancora validati per un impiego diretto in pubblicazioni senza analisi indipendente e una valutazione del protocollo.
- Lo storage IndexedDB è **locale al browser/dispositivo** e non è automaticamente sincronizzato: programma backup regolari.
- Il PDF si ottiene tramite **Stampa → Salva come PDF** dal report HTML. Su alcuni browser mobili, disponibilità e percorso di salvataggio possono variare.

## Verifiche eseguite in preparazione

- Controllo di sintassi di tutti gli script JavaScript e degli script incorporati nell'HTML.
- Test in Chromium con **IndexedDB simulato**: creazione e salvataggio scheda rapida; navigazione e ritorno al percorso; caricamento del CSV originale `LOG-030.CSV` con 15 record; fit A/Q; salvataggio snapshot; riepilogo e Report Studio.
- Numeri di regressione sul CSV di prova: **Amax osservata 11,11; Asat stimata 12,68 µmol CO₂ m⁻² s⁻¹** con il modello iperbolico rettangolare (bootstrap disattivato durante il test).
- Test su viewport mobile a 390 px: assenza di overflow orizzontale e apertura del percorso retrospettivo.
- Non è stato possibile verificare in questo ambiente il comportamento completo **di IndexedDB e Service Worker reali** o l'installazione e la stampa su iOS/Android. Serve collaudo sul sito pubblicato.
