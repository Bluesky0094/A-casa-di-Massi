# A casa di Massi

Prima versione locale del sito in italiano, inglese e spagnolo. HTML statico, CSS e JavaScript essenziale, generati con Node.js senza dipendenze npm. Navigazione, testi, cambio lingua e foto funzionano anche senza JavaScript; JavaScript aggiunge la galleria modale e piccoli miglioramenti di navigazione.

## Avvio

Richiede Node.js 22 o successivo. Non serve `npm install`.

```sh
npm run dev
```

Apri l'indirizzo stampato nel terminale, normalmente **http://127.0.0.1:4321/**. Il server ascolta solo su `127.0.0.1`, ricompila al cambio dei file in `src/` e `public/`; aggiorna il browser per vedere le modifiche. Lascia aperto il terminale e premi **Ctrl+C** per fermarlo.

Se la porta 4321 è già occupata, il comando prova automaticamente la 4322 e le successive (fino alla 4331). L'indirizzo effettivo viene sempre stampato nel terminale. Se il sito è già avviato, puoi semplicemente aprire il suo indirizzo senza avviare un altro server.

```sh
npm run build   # genera dist/
npm run check   # verifica pagine, lingue, link, immagini e font
npm run preview # anteprima locale senza ricompilazione automatica
```

Per usare una porta precisa: `npm run dev -- --port 4322`. `PORT` è supportata come alternativa. Se una porta esplicitamente richiesta è occupata, il comando termina con un messaggio utile senza lasciare watcher attivi.

### Five Server e index.html

La pagina HTML viene generata dalla build: si trova in **`dist/index.html`**, non nella cartella principale. Non modificarla direttamente: i sorgenti sono in `src/` e la build la sovrascrive.

Per usare Five Server in VS Code:

1. Esegui `npm run build`.
2. Ferma Five Server se è già attivo, poi premi **Go Live**. Il file `.fiveserverrc` imposta `dist/` come radice del sito.
3. In alternativa, fai clic destro sulla cartella **dist** → **Open with Five Server (root)**.

Servi `dist/` come radice: aprire `/dist/index.html` da un server avviato sulla cartella principale interrompe i percorsi di immagini, CSS e lingue. Anche aprire il file con un doppio clic (`file://`) non è il modo corretto di visualizzarlo. Dopo modifiche ai sorgenti, ripeti `npm run build` oppure lascia attivo `npm run dev` per ricompilare automaticamente.

## File principali

- `src/content.mjs`: contenuti e testi alternativi nelle tre lingue.
- `src/template.mjs`: HTML condiviso; collegamento Airbnb verificato.
- `public/styles.css`: stili responsive.
- `public/site.js`: menu mobile e galleria accessibile da tastiera.
- `public/images/`: fotografie WebP ottimizzate.
- `src/images.json`: manifest delle immagini derivate e dei rispettivi originali.
- `scripts/prepare-images.py`: rigenerazione delle foto (`npm run images`, richiede Pillow).
- `docs/PROGETTO.md`: direzione visiva, fonti, selezione fotografica e preparazione alla pubblicazione.
- `docs/VERIFICHE.md`: verifiche sulla prima versione.

Le pagine sono `/`, `/en/`, `/es/`, con una pagina privacy per ciascuna lingua e una pagina 404. Le lingue hanno URL propri, attributi `lang` e collegamenti `hreflang`; il cambio lingua conserva la sezione corrente quando JavaScript è attivo. La galleria si usa anche con frecce, Tab ed Esc.

Il server serve solo `dist/`: documenti di lavoro e fotografie originali non vengono esposti. Non ci sono analytics, cookie, iframe, moduli, prenotazioni interne o font caricati da servizi esterni.

Questa è un’anteprima **non pubblicata**, con indicizzazione disabilitata. Per pubblicare occorre un’autorizzazione esplicita; la preparazione al rilascio è documentata in `docs/PROGETTO.md`.
