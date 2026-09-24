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

## Prima della pubblicazione

Il sito non è pubblicato e nessun dominio è collegato. `noindex, nofollow` e `robots.txt` impediscono l’indicizzazione ordinaria di questa anteprima, senza costituire un controllo di accesso.

Prima del rilascio occorre scegliere dominio e hosting, confermare i dati del titolare da riportare nell’informativa privacy e adeguarla al servizio di hosting effettivo (eventuali log). L’informativa attuale descrive solo il comportamento tecnico della versione statica e non sostituisce quei dati. Si dovranno inoltre impostare URL canonici, URL assoluti delle lingue e immagine social sul dominio definitivo, rimuovendo il blocco di indicizzazione solo quando autorizzati a pubblicare.

Disponibilità, prezzi, regole e messaggi rimangono su Airbnb, senza essere duplicati sul sito. Nessun nuovo chiarimento è necessario per usare la versione locale.

## Citazione di Massi sul pane — 25 settembre 2026

Testo originale fornito direttamente dall’utente: “è casa di famiglia adibita anche alla cottura del pane in forno a legna e quindi il ricordo dell'odore del pane”. Inserito come citazione firmata da Massi nella sezione familiare, con sole modifiche a maiuscole e punteggiatura; tradotto in inglese e spagnolo. Questa citazione è un’eccezione editoriale richiesta dall’utente: le altre risposte restano una guida interna. Il pane è un ricordo, non un servizio offerto. La foto del pane sostituisce i limoni solo nella sezione familiare; gli originali non sono modificati.
