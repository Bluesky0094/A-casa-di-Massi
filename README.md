# A casa di Massi

Sito in italiano, inglese e spagnolo. HTML statico, CSS e JavaScript essenziale, generati con Node.js senza dipendenze npm. Navigazione, testi, cambio lingua e foto funzionano anche senza JavaScript; JavaScript aggiunge la galleria modale e piccoli miglioramenti di navigazione.

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

## Pubblicazione su GitHub Pages

Indirizzo pubblico: **https://bluesky0094.github.io/A-casa-di-Massi/**.

Ogni push su `main` avvia `.github/workflows/pages.yml`: Node.js 22 genera e verifica prima la versione locale, poi quella pubblica, e pubblica esclusivamente `dist/`. Si può avviare anche da Actions → Deploy GitHub Pages → Run workflow. In Settings → Pages, la sorgente deve essere GitHub Actions.

`SITE_URL` configura il dominio e il percorso base. Il workflow lo ricava da GitHub Pages. Per verificare la stessa build in locale:

```sh
SITE_URL=https://bluesky0094.github.io/A-casa-di-Massi/ npm run build
SITE_URL=https://bluesky0094.github.io/A-casa-di-Massi/ npm run check
```

Senza `SITE_URL`, sviluppo e anteprima restano sulla radice `/` e non indicizzabili. La build pubblica contiene canonical, alternate assoluti, immagine social, sitemap e indicizzazione abilitata; la pagina 404 resta `noindex`. `npm run dev` ripristina la build locale. Le fotografie originali e i documenti di lavoro non entrano nell’artefatto Pages (il repository GitHub è pubblico).

Per un futuro dominio personalizzato, configurarlo in GitHub Pages: il workflow userà il nuovo URL alla successiva esecuzione. Dettagli di rilascio in `docs/PROGETTO.md`.
