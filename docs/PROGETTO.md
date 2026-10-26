# A casa di Massi — prima versione locale

## Direzione visiva

La direzione attuale usa un unico colore riconoscibile, il turchese scuro `#15565b` degli arredi, con fondo calce `#faf7ef` e giallo `#edc451` per pulsanti e piccoli accenti. Le fotografie portano gli altri colori della casa. Apertura e posizione condividono il turchese; le sezioni centrali usano fondi chiari coerenti. Eliminati i blocchi rosa, i titoli lampone, il timbro decorativo sulla foto e i numeri sovrapposti.

Titoli e testi usano DM Sans locale, con titoli di peso 600 e paragrafi di almeno 16 px. Navigazione e didascalie sono più grandi; il marchio usa Georgia in grassetto. Il font sottile Italiana non viene più caricato. Le fotografie rimangono centrali, con impaginazione ariosa e galleria accessibile.

Sono state esaminate 114 fotografie della casa e 250 fotografie dell’evento, escludendo i file nascosti di metadati. La selezione principale usa il servizio diurno della casa: luce naturale, cielo luminoso, toni coerenti e nessuna persona riconoscibile. La sezione del ricordo di famiglia usa inoltre il dettaglio del pane `_DSC7907.jpg`, scattato di giorno durante l’evento, senza volti riconoscibili. Le fotografie notturne non sono usate. Nessun colore o elemento delle foto è stato alterato.

## Contenuti e fonti

- `AGENT.md`: identità, indirizzo comunicato, capienza, indipendenza, spazi privati, cucina, orto, barbecue, bici, ospitalità, ricordo del forno, territorio e autorizzazione fotografica.
- `PROMPT_INIZIALE.md`: amplia a **italiano, inglese e spagnolo** le due lingue originariamente indicate in AGENT.md. Questa versione segue il requisito trilingue.
- `src/content.mjs`: testi originali e metadati completi nelle tre lingue. Nessuna promessa di pane, attività organizzate, itinerari o eventi ricorrenti. Non sono stati inventati recapiti, orari o distanze.
- Direzione editoriale: le risposte di Massi sono il brief interno, non il testo da riportare sul sito. La voce pubblica si rivolge a chi soggiorna, racconta la casa e invita a viverla; evita formule come “Massi descrive”, “per Massi” o “le immagini che Massi associa”. Il ricordo del pane sostiene la storia familiare senza diventare il tema principale o una promessa di servizio.
- Airbnb verificato il **24 settembre 2026** tramite browser: `https://www.airbnb.it/rooms/1175206454292232540`. Titolo “a casa di Massi”, host Massimiliano, casa per quattro persone e fotografie della camera, bagno, cucina e amaca coincidenti con gli originali. La pagina indica Campanella-gianforma, Sicilia, e il percorso territoriale Modica. Il sito conserva l’indirizzo preciso fornito da Massi in AGENT.md.
- Dalla stessa pagina è stato verificato e riportato il CIN **IT088006C2S3KDESX8**. Non sono stati copiati recensioni, valutazioni o servizi aggiuntivi dall’annuncio.
- Il pulsante mappa esegue una ricerca Google Maps dell’indirizzo comunicato. Non è un profilo commerciale verificato e non usa coordinate inventate.
- I candidati profilo Google e PayTourist non sono usati.

## Foto derivate

`npm run images` (Python 3 + Pillow) genera esclusivamente `public/images/*.webp` e il manifest `src/images.json`. Gli originali in `sources/` non vengono modificati. Sono applicati orientamento EXIF, ridimensionamento proporzionale e compressione WebP qualità 81; i metadati dell’originale non vengono copiati. I ritagli di impaginazione sono CSS (`object-fit: cover`).

Ogni immagine ha versioni da 480, 800, 1200 e 1800 pixel. Il browser sceglie tramite `srcset` e `sizes`. L’apertura ha priorità alta, le altre immagini hanno caricamento differito. Il manifest documenta origine, dimensioni e peso di ogni variante.

| Nome web | Originale in Foto casa | Utilizzo |
| --- | --- | --- |
| casa | DSC07944.jpg | Apertura, galleria |
| cucina | DSC07885.jpg | Foto principale degli interni |
| camera | DSC07910.jpg | Camera |
| cortile | DSC07932.jpg | Spazio esterno |
| dettagli | DSC07890.jpg | Tavola |
| pane | Foto evento/_DSC7907.jpg | Ricordo di famiglia |
| amaca | DSC07950.jpg | Galleria |
| orto | DSC07997.jpg | Vita sul posto |
| bici | DSC07964.jpg | Vita sul posto |
| campagna | DSC07955.jpg | Territorio, didascalia riferita alla proprietà |
| pietra | DSC07973.jpg | Racconto di famiglia; non identifica il forno |
| bagno | DSC07913-HDR.jpg | Galleria |
| soppalco | DSC07904.jpg | Galleria |

## Pubblicazione su GitHub Pages — 25 settembre 2026

Pubblicazione autorizzata dall’utente su `https://bluesky0094.github.io/A-casa-di-Massi/`, senza dominio personalizzato. Il workflow `.github/workflows/pages.yml` verifica e pubblica solo `dist/` a ogni push su `main`.

`SITE_URL` determina percorso base e URL assoluti. La build pubblica abilita l’indicizzazione delle sei pagine di contenuto, genera sitemap, canonical, alternate e immagine social; la 404 resta esclusa. Senza questa variabile, la versione locale resta non indicizzabile. Link, immagini responsive, galleria e font supportano il sottopercorso del repository.

L’informativa nelle tre lingue descrive GitHub Pages, la registrazione degli IP per sicurezza e rimanda alla privacy di GitHub. I dati completi del titolare non sono stati forniti e non vengono inventati: restano da completare nell’informativa. Disponibilità, prezzi, regole e messaggi rimangono su Airbnb.

## Citazione di Massi sul pane — 25 settembre 2026

Testo originale fornito direttamente dall’utente: “è casa di famiglia adibita anche alla cottura del pane in forno a legna e quindi il ricordo dell'odore del pane”. Inserito come citazione firmata da Massi nella sezione familiare, con sole modifiche a maiuscole e punteggiatura; tradotto in inglese e spagnolo. Questa citazione è un’eccezione editoriale richiesta dall’utente: le altre risposte restano una guida interna. Il pane è un ricordo, non un servizio offerto. La foto del pane sostituisce i limoni solo nella sezione familiare; gli originali non sono modificati.


## Raccolta dei sorgenti utilizzati — 15 ottobre 2026

Tutti i 23 sorgenti utilizzati sono stati spostati in `sources/Casa di Massi/Used in website/`, conservandone i nomi e verificando che il contenuto SHA-256 sia identico prima e dopo lo spostamento. Le versioni WebP rimangono in `public/images/`. Il generatore e il manifest puntano alla nuova raccolta; i percorsi riportati nelle sezioni precedenti descrivono la provenienza storica.

| Immagine web | Provenienza prima dello spostamento | Nome nella raccolta utilizzata |
| --- | --- | --- |
| casa | `sources/Casa di Massi/Foto casa/DSC07944.jpg` | `DSC07944.jpg` |
| cucina | `sources/Casa di Massi/Foto casa/Selezionate/DSC07885.jpg` | `DSC07885.jpg` |
| camera | `sources/Casa di Massi/Foto casa/Selezionate/DSC07910.jpg` | `DSC07910.jpg` |
| cortile | `sources/Casa di Massi/Foto casa/DSC07932.jpg` | `DSC07932.jpg` |
| dettagli | `sources/Casa di Massi/Foto casa/DSC07937.jpg` | `DSC07937.jpg` |
| pane | `sources/Casa di Massi/Foto evento/_DSC7907.jpg` | `_DSC7907.jpg` |
| amaca | `sources/Casa di Massi/Foto casa/DSC07950.jpg` | `DSC07950.jpg` |
| orto | `sources/Casa di Massi/Foto casa/DSC07997.jpg` | `DSC07997.jpg` |
| bici | `sources/Casa di Massi/Foto casa/DSC07964.jpg` | `DSC07964.jpg` |
| campagna | `sources/Casa di Massi/Foto casa/DSC07955.jpg` | `DSC07955.jpg` |
| pietra | `sources/Casa di Massi/Foto casa/Selezionate/DSC07973.jpg` | `DSC07973.jpg` |
| bagno | `sources/Casa di Massi/Foto casa/DSC07913-HDR.jpg` | `DSC07913-HDR.jpg` |
| soppalco | `sources/Casa di Massi/Foto casa/Selezionate/DSC07904.jpg` | `DSC07904.jpg` |
| forno | `sources/Casa di Massi/Foto casa/WhatsApp Image 2025-04-18 at 17.09.38.jpg` | `WhatsApp Image 2025-04-18 at 17.09.38.jpg` |
| impasto | `sources/Casa di Massi/Foto casa/WhatsApp Image 2025-04-18 at 17.09.40.jpg` | `WhatsApp Image 2025-04-18 at 17.09.40.jpg` |
| lievitazione | `sources/Casa di Massi/Foto casa/WhatsApp Image 2025-04-18 at 17.09.41.jpg` | `WhatsApp Image 2025-04-18 at 17.09.41.jpg` |
| apertura | `output/imagegen/hero-colour-ai-draft.png` | `hero-colour-ai-draft.png` |
| cucina-ampia | `sources/Casa di Massi/Foto casa/DSC07882-HDR.jpg` | `DSC07882-HDR.jpg` |
| limoni | `sources/Casa di Massi/Foto casa/DSC07890.jpg` | `DSC07890.jpg` |
| erbe | `sources/Casa di Massi/Foto casa/DSC07891.jpg` | `DSC07891.jpg` |
| tavola | `sources/Casa di Massi/Foto casa/DSC07930.jpg` | `DSC07930.jpg` |
| giardino | `sources/Casa di Massi/Foto casa/DSC07957.jpg` | `DSC07957.jpg` |
| esterno | `sources/Casa di Massi/Foto casa/DSC07968.jpg` | `DSC07968.jpg` |

## Seconda vista d’apertura — 15 ottobre 2026

Esaminate le anteprime incorporate dei 18 file CR3 in `Foto Erika`. Scelto `IMG_8782.CR3` per la facciata laterale, il portico e il murale visibile fra le piante. Il RAW è stato spostato senza alterazioni da `Foto Erika/` a `Used in website/`; la raccolta dei sorgenti usati contiene ora 24 immagini.

La chiave web è `casa-laterale`. Sviluppo RAW riproducibile nel generatore tramite LibRaw `dcraw_emu`: bilanciamento del bianco della fotocamera, sRGB, fusione alte luci `-H 2`, luminosità `-b 1.35`, curva `-g 2.4 12.92`, interpolazione AHD. Nessuna modifica generativa, rimozione di oggetti o cambiamento dei colori della casa. Il confronto visivo con l’apertura esistente privilegia intonaco caldo, verde naturale e dettagli nelle ombre, rispettando la diversa luce solare della ripresa. WebP a 480/800/1200/1800 px; il RAW non viene distribuito nel sito.

Su richiesta esplicita dell’utente, l’apertura alterna automaticamente le due foto ogni sei secondi, con scorrimento orizzontale di 450 ms, frecce e pausa/ripresa. Nessuna altra animazione di pagina viene reintrodotta. I controlli e le descrizioni sono tradotti IT/EN/ES; il movimento ridotto disattiva riproduzione automatica e transizione. L’automatismo si sospende con hover, durante interazione manuale, quando la scheda è nascosta o l’apertura esce dal viewport. Senza JavaScript rimane visibile la prima foto.


## Vista laterale: versione Adobe approvata — 15 ottobre 2026

L’utente ha approvato la versione più ricca di colori (`artifacts/adobe/side-house-rich-colours.png`) e chiesto di inserirla nel sito. Il sorgente di `casa-laterale` è ora `Used in website/IMG_8782-adobe-colour-match.png`; il RAW originale è stato riportato in `Foto Erika/IMG_8782.CR3` senza modificarlo. La versione Adobe è un PNG di 1800 px ottenuto dalla precedente derivata web: il processore Adobe non accetta CR3 e il trasferimento del TIFF a piena risoluzione è scaduto. Nessun ingrandimento artificiale. La versione chiara precedente resta solo come anteprima negli artefatti.

Modifica Adobe non generativa, richiesta `03f17c6c-c210-42b1-95f4-214f35f6bbd4`: contrast 32, brightness 3, highlights -28, shadows -12, darks -10, vibrance 60, saturation 20, tempA 3, tempB 20, tempLuminance 50. Il generatore usa il PNG approvato per tutte le quattro varianti responsive, senza aggiungere altre correzioni cromatiche. Nessuna modifica al comportamento dello slideshow.

## Foto, galleria e piccoli movimenti — 26 ottobre 2026

La selezione visibile privilegia cucina, camera e cortile, con amaca ed esterno nella sezione all’aperto. Le otto immagini aggiuntive (soppalco, bagno, ingresso, cucina ampia, limoni, erbe, tavola e legnaia) restano nel pannello espandibile. Le 16 miniature della galleria non si ripetono nella pagina; tutte le 24 foto del sito rimangono utilizzate, senza modifiche ai sorgenti, al manifest o alle derivazioni WebP.

Le foto apribili hanno un indicatore di ingrandimento. La galleria mantiene frecce, tastiera, Escape e ripristino del focus, aggiungendo scorrimento orizzontale con un dito. Movimenti verticali, brevi, annullati o con più dita non cambiano foto; lo zoom del browser resta disponibile. Il riquadro della foto mantiene dimensioni stabili durante il caricamento. Zoom delle miniature, dissolvenza della galleria e piccoli movimenti di pulsanti e navigazione rispettano la preferenza di movimento ridotto.

Il testo iniziale IT/EN/ES presenta subito casa indipendente, quattro ospiti e Frigintini. Un collegamento alla disponibilità segue la galleria della casa e usa lo stesso annuncio Airbnb già presente nel sito, verificato nel settembre 2026; il tentativo di ricontrollo del 26 ottobre non ha restituito la pagina. Nessuna informazione pratica non confermata è stata aggiunta. Le modifiche sono locali, senza nuova pubblicazione.

`scripts/verify-gallery.mjs` esercita gesti touch reali nel browser, tastiera, focus e movimento ridotto; si affianca ai controlli responsive e di ancoraggio esistenti.

Il cambio lingua mantiene il percorso della pagina tradotta (home o privacy), senza copiare il frammento dell’ultima sezione visitata. Questo evita che un cambio lingua dall’intestazione faccia scorrere di nuovo la pagina verso una sezione ormai lasciata. I collegamenti espliciti alle sezioni conservano lo scorrimento fluido e l’allineamento a 24 px. La regressione è verificata in `scripts/verify-anchors.mjs` a 390, 768 e 1440 px.
