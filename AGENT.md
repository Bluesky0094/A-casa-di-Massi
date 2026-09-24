# A casa di Massi — istruzioni per lo sviluppo

## Obiettivo

Realizzare un sito bilingue (italiano e spagnolo) che faccia conoscere la casa e la sua atmosfera. La prima versione deve essere semplice, curata, veloce e utilizzabile su telefono, tablet e desktop. Il sito racconta ciò che sappiamo; non deve riempire con supposizioni le risposte lasciate vuote da Massi.

## Fonti e contenuti confermati

- Nome: **A casa di Massi**.
- Posizione comunicata da Massi: **via Calanchi 78, Frigintini, Modica**.
- È una casa di famiglia, in passato usata anche per cuocere il pane nel forno a legna. Il profumo del pane è un ricordo personale, non un'attività promessa agli ospiti.
- Massi descrive il posto con buona aria, colori e storia; desidera che gli ospiti conservino il ricordo di essersi sentiti a casa.
- La casa è indipendente, ospita **quattro persone**, ha un proprio spazio privato e consente agli ospiti di accedere al resto della proprietà.
- Cucina, orto, barbecue e bici sono disponibili. Le occasioni di condivisione variano; non presentarle come attività organizzate o sempre incluse.
- Massi è presente e disponibile secondo le preferenze degli ospiti e ne rispetta la privacy.
- Per il territorio, Massi cita alba, mare e città barocche. Non attribuire distanze, tempi di percorrenza o itinerari senza verifica.
- Obiettivo principale del sito: far conoscere meglio la casa e il progetto. Il significato specifico di “progetto” non è stato spiegato: non inventarlo.
- Lingue richieste: italiano e spagnolo.
- Massi ha risposto “sì” alla domanda sull'uso pubblico delle foto fornite, comprese quelle degli eventi. Scegliere comunque immagini pertinenti alla pagina e usare con attenzione quelle con persone riconoscibili.

La fonte primaria di queste informazioni è la risposta al modulo “Raccontami un po’ questo posto” del 24 settembre 2026. Le risposte non coprono la storia di murales e oggetti, gli eventi, le informazioni pratiche prima della prenotazione, né il link Airbnb esatto. Non sollecitare nuove risposte come prerequisito per la prima versione.

## Materiali disponibili

- `sources/Casa di Massi/Foto casa/`: fotografie della casa e degli spazi.
- `sources/Casa di Massi/Foto evento/`: fotografie di un evento; non presentarlo come ricorrente.
- `sources/links.md`: link di riferimento, compreso un candidato Airbnb. Verificare che rimandi alla struttura giusta prima di pubblicare il pulsante di prenotazione. Non assumere che il profilo Google o la pagina PayTourist siano ufficiali.

## Struttura della prima versione

1. Apertura visiva: casa, colori e sensazione di essere accolti.
2. La casa: fotografie, capienza e spazi, con informazioni concrete.
3. Vivere il posto: cucina, orto, barbecue, bici e ospitalità rispettosa della privacy, senza promesse di attività organizzate.
4. Il territorio: suggestioni su alba, mare e città barocche, senza dettagli logistici inventati.
5. Dove siamo e prenotare: posizione e collegamento Airbnb solo dopo verifica. Se manca una destinazione verificata, lasciare il contatto/prenotazione come elemento da completare, senza pulsante fittizio.

Non creare per ora pagine o sezioni autonome su eventi, “progetto”, murales o esperienze a pagamento. Evitare formule turistiche generiche, superlativi non dimostrati e classificazioni non confermate (agriturismo, resort, struttura di lusso).

## Design e implementazione

- Studiare le foto prima di definire colori, tipografia e gerarchia visiva. Dare priorità alle immagini della casa; usare quelle degli eventi solo quando sostengono un contenuto verificato.
- Scrivere testi originali, brevi e naturali in entrambe le lingue. La traduzione spagnola deve essere riveduta per senso e tono, non generata parola per parola.
- Progettare prima l'esperienza mobile e poi verificarla anche su tablet e desktop.
- Usare HTML semantico, navigazione da tastiera, contrasto adeguato, testi alternativi utili e immagini ottimizzate.
- Mantenere il sito statico e leggero finché non emerge un bisogno reale di funzioni dinamiche. Non aggiungere moduli di prenotazione, pagamenti, CMS o integrazioni non richieste.
- Prima di dichiarare pronta la versione, verificare build, link, cambio lingua, contenuti, layout responsive e accessibilità di base nel browser.
- Non pubblicare o collegare un dominio senza una richiesta esplicita. Segnalare con precisione ciò che resta da verificare prima della pubblicazione.

## Metodo di lavoro

Leggere queste istruzioni e i materiali in `sources/`, scegliere le immagini più adatte, proporre una direzione visiva concreta e costruire una prima versione locale completa. Fare scelte ragionevoli in autonomia; chiedere chiarimenti solo se un dato mancante impedisce davvero di proseguire. Conservare i file sorgente originali e documentare le eventuali immagini derivate usate nel sito.
