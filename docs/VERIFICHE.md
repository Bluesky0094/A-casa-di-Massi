# Verifiche della prima versione locale

Sessione del 24 settembre 2026. Sito locale: `http://localhost:4321`. Nessuna pubblicazione o connessione di dominio eseguita.

## Build e file

- `npm run build`: completata; tre home, tre pagine privacy e pagina 404.
- `npm run check`: superato; struttura delle tre traduzioni, lingua HTML, titoli, metadati, destinazioni di 217 link, 54 utilizzi di immagini responsive, due font WOFF2 validi. Le foto uniche ottimizzate sono 12, in quattro dimensioni ciascuna.
- Controllo sintattico Node di JavaScript client e server: superato.
- `git diff --no-index --check` sui file di progetto: nessun errore di whitespace. La cartella di partenza non era un repository Git; non sono stati creati commit.
- Verifica HTTP: `200` su tutte e sei le pagine IT/EN/ES e privacy; `404` per una pagina inesistente e per `/sources/links.md`. Il server espone solo la build, non i materiali originali.

## Browser e layout

Browser Chromium, tramite agent-browser. Screenshot e risultati si trovano in `artifacts/` (esclusa da Git).

| Dimensione | Italiano | Inglese | Spagnolo |
| --- | --- | --- | --- |
| Mobile 390 × 844 | Superato | Superato | Superato |
| Tablet 768 × 1024 | Superato | Superato | Superato |
| Desktop 1440 × 1000 | Superato | Superato | Superato |

Per ogni combinazione: contenuti visibili, un solo h1, font caricati, immagini presenti dopo lo scorrimento, assenza di scorrimento orizzontale e di elementi fuori pagina. Le schermate sono state anche ispezionate visivamente, comprese le sezioni inferiori su mobile e tablet.

Audit axe-core 4.12.1 su tutte e nove le home: **0 violazioni, 0 controlli incompleti**. Il primo controllo aveva rilevato contrasto insufficiente nei numeri delle didascalie: corretto e verificato nuovamente. L’audit automatico è un controllo di base, non una certificazione di accessibilità o un test con ogni lettore di schermo.

## Interazioni

- Menu mobile: apertura, collegamenti alle sezioni e chiusura al click verificati.
- Lingue: IT → EN → ES verificato tramite click; conservazione di `#casa`, aggiornamento di titolo e attributo `lang`.
- Galleria: espansione delle otto foto, apertura della camera e della cucina, foto successiva tramite freccia, chiusura con Esc e ripristino del focus sulla foto iniziale.
- Focus nel dialogo: Shift+Tab dal pulsante di chiusura raggiunge l’ultimo comando; Tab torna al primo. Il contenuto sottostante rimane non interattivo.
- Test senza lo script del sito: caricamento di `site.js` bloccato intenzionalmente, menu nativo e cambio lingua IT → EN funzionanti, contenuti presenti. Blocco rimosso al termine.
- Console ed errori della versione finale locale: nessun errore o avviso rilevato. I log della visita ad Airbnb e del blocco intenzionale dello script sono stati separati da questo controllo.

## Risorse

- Nessuna risorsa caricata da domini esterni nelle nove home. Font e fotografie sono serviti localmente; Airbnb e Google Maps sono collegamenti esterni, senza iframe.
- Foto di apertura effettivamente scelta dal browser (DPR 1): circa 40 kB mobile, 105 kB tablet, 218 kB desktop.
- Le risorse fuori schermo usano il caricamento differito. Sono state verificate con scorrimento reale prima degli screenshot completi.
- Questi dati descrivono l’anteprima locale. Tempi reali e Core Web Vitals di produzione dipenderanno da hosting, rete e dispositivo.

## Ripetere i controlli

```sh
npm run build
npm run check
npm run dev
# In un altro terminale, con agent-browser installato:
node scripts/verify-browser.mjs
```

Se il comando non è nel PATH, indicare `AGENT_BROWSER_BIN=/percorso/agent-browser`. Il rapporto delle nove combinazioni viene salvato in `artifacts/responsive-report.json`; il controllo finale della galleria è in `artifacts/a11y-gallery-final.json`.

Dominio, hosting e dati del titolare per completare l’informativa privacy restano da definire prima della pubblicazione. Vedi `PROGETTO.md` per gli interventi legati al dominio definitivo e all’indicizzazione.

## Revisione editoriale e fotografie — 25 settembre 2026

Rimossi i simboli “+” sovrapposti alle fotografie e la firma decorativa sotto il racconto familiare. Riscritti i testi di presentazione, soggiorno, ospitalità, storia e territorio in IT/EN/ES, usando le risposte come brief interno.

Build e controlli dei file superati. Ripetute le nove combinazioni lingua/viewport: nessun overflow, immagine mancante o violazione axe. Verificati visivamente i testi e le fotografie senza icone. Confermati apertura della foto cliccandola, chiusura con Esc e ritorno del focus alla foto.

## Revisione colori — 25 settembre 2026

Palette ispirata ai murales e agli arredi: apertura giallo sole, sezione vita turchese, chiusura rosa, accenti lampone e verde scuro. Aggiornati anche il riquadro di prenotazione e il favicon. Fotografie e testi invariati.

Verificate tutte le nove combinazioni IT/EN/ES su mobile 390×844, tablet 768×1024 e desktop 1440×1000: nessun overflow, immagine mancante o violazione axe; zero controlli incompleti. Controllate visivamente le schermate dell’apertura desktop e della pagina mobile. `npm run check` supera i controlli sulle sette pagine generate. Anteprima locale, nessuna pubblicazione.


## Revisione identità e leggibilità — 25 settembre 2026

Sostituita la precedente direzione multicolore con turchese, calce e accenti gialli. Titoli DM Sans più solidi, paragrafi da 16 px, navigazione e didascalie ingrandite; rimossi timbro e numeri decorativi sulle fotografie. Controllate visivamente apertura desktop inglese, apertura mobile italiana e sezioni interne mobili. Nove combinazioni lingua/viewport superano i controlli: nessun overflow, immagine mancante, violazione axe o controllo incompleto. Galleria aperta e chiusa con Escape, cambio lingua funzionante e nessun errore browser riportato. Anteprima locale, nessuna pubblicazione.

## Pane e ricordo di Massi — 25 settembre 2026

Sostituita la foto dei limoni nella sezione familiare con `_DSC7907.jpg` (pane nel cesto), con quattro varianti WebP e testi alternativi IT/EN/ES. Inserita la risposta originale fornita dall’utente come citazione firmata da Massi, con punteggiatura rivista e traduzioni. Build e controlli statici superati; nove combinazioni lingua/viewport senza overflow, immagini mancanti o violazioni axe. Verificata visivamente la composizione desktop in `artifacts/pane-citazione-desktop.png`.

## Ancoraggi — 13 ottobre 2026

Rimosso l’offset di 110 px previsto per un header fisso: l’intestazione è nel normale flusso della pagina. Gli ancoraggi delle sezioni compensano ora il padding superiore e lasciano 24 px prima dei contenuti, con valori coerenti ai tre breakpoint. Nessuna intercettazione JavaScript: URL con frammento, navigazione nativa e preferenza per movimento ridotto restano funzionanti.

`AGENT_BROWSER_BIN=/home/stefano/.local/npm/bin/agent-browser node scripts/verify-anchors.mjs` verifica CTA, menu mobile/desktop, benvenuti, ritorno in alto, skip link e conservazione del frammento nei link lingua a 390, 768 e 1440 px in IT/EN/ES, oltre ai link privacy → casa nelle tre lingue. Tutti superati. Verificato anche l’arrivo del CTA (arrivo prima: circa 210 px; dopo: 24 px) e la schermata `artifacts/anchors-casa-desktop.png`. Controlli statici e whitespace superati. Modifiche locali, nessuna pubblicazione.

## Viewer: foto precedente durante il caricamento — 15 ottobre 2026

L’immagine viene nascosta prima di cambiare `src` e mostrata soltanto dopo la decodifica della richiesta corrente. Alla chiusura si cancella la sorgente; le richieste completate dopo chiusura o navigazione non possono ripristinare immagini precedenti. In caso di errore si espone il testo alternativo della foto corrente senza conservare il vecchio bitmap.

Verifica browser con decodifica ritardata artificialmente di 700 ms: apertura dopo un’altra foto, navigazione rapida e chiusura/riapertura durante il caricamento superate. Sorgente cancellata alla chiusura e focus ripristinato correttamente. Nessun errore browser rilevato; controlli statici e whitespace superati. Modifica locale.

## Vista laterale e apertura a due foto — 15 ottobre 2026

Verificati sviluppo RAW, manifest e percorsi della nuova immagine `casa-laterale`. Confronto visivo con la foto attuale e controllo dei ritagli desktop/mobile (`artifacts/hero-side-desktop.png`, `artifacts/hero-side-mobile.png`). Tutte le nove combinazioni IT/EN/ES × mobile/tablet/desktop superano i controlli responsive e axe: nessun overflow, immagine mancante, violazione o controllo incompleto. Il test di overflow considera correttamente il clipping delle diapositive nel loro viewport.

Nel browser verificati avanzamento automatico dopo sei secondi, frecce, pausa stabile oltre un intero intervallo e controlli inglesi/spagnoli. Con movimento ridotto: autoplay inizialmente disattivato, transizione di zero secondi e frecce manuali funzionanti. Nessun errore browser rilevato. Build e controlli statici superati. Anteprima locale, nessuna pubblicazione.

## Inserimento della versione Adobe approvata — 15 ottobre 2026

Sostituito il sorgente di `casa-laterale` con il PNG dai colori più ricchi approvato dall’utente. Rigenerate esclusivamente le quattro varianti WebP interessate, aggiornati manifest e provenienza; RAW riportato nella raccolta Foto Erika senza alterazioni. Build, controlli statici e whitespace superati. Nel browser la seconda diapositiva carica la nuova immagine senza overflow; verificata visivamente in `artifacts/adobe/approved-photo-on-site.png`. Anteprima locale avviata sulla porta 4321; nessuna pubblicazione.
