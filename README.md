# Visualizzatore grafo JSON-LD

Una Single Page Application (SPA) scritta in puro HTML, CSS e Vanilla JS per caricare, esplorare e visualizzare in maniera interattiva i dati semantici strutturati in formato JSON-LD.
Ottimizzata in particolar modo per gli standard ontologici per le Pubbliche Amministrazioni, ma compatibile con qualsiasi grafo JSON-LD.

## Funzionalità principali

* **Grafo interattivo**: Visualizza le dipendenze semantiche tramite un grafo di nodi espandibile con motore fisico integrato. I nodi possono essere trascinati per ispezionarli meglio.
* **Esplorazione approfondita**: Cliccando su un nodo, si accede all'elenco dei collegamenti *entranti* e *uscenti*, le proprietà chiave-valore normalizzate e la sorgente JSON-LD nativa. Fai *doppio-click* su un nodo del grafo per saltare direttamente al suo pannello di dettaglio in basso.
* **Filtri e Statistiche**: Scopri subito quanti nodi e tipi di dati esistono nel tuo file. Ricerca per tipo o testo libero.
* **Upload Locale**: Carica file `.jsonld` direttamente dal tuo computer senza che i dati lascino mai il tuo dispositivo.
* **Caricamento da Testo**: Incolla una porzione di JSON-LD sorgente e premi "Carica e Comprimi".
* **Condivisione tramite URL (Stateless)**: Per salvaguardare la condivisibilità senza dover ricorrere backend esterni, i dataset fino ad un massimo di grandezza compressa di circa 8KB vengono ridotti tramite **GZIP + Base64** in locale e archiviati all'interno dell'URL (`?data=`). Ti basterà ricopiare la barra degli indirizzi e inviare il link (che conterrà tutto il tuo JSON zippato!) a un collega affinché anche lui possa aprirlo in tempo reale. File macroscopici ignorano questo salvataggio ed elaborano il grafo comodamente in memoria senza superare i limiti di lunghezza dell'hosting.
* **Gestione Cronologia**: L'esplorazione nei nodi interattivi tiene traccia della sessione. I pulsanti *Indietro* e *Avanti* del tuo browser funzioneranno e terranno a memoria l'ultimo dettaglio visualizzato in sincronia.

## Struttura

* `index.html`: La struttura DOM e la UI principale.
* `styles.css`: Fogli di stile completi con variabili semantiche, animazioni micro-interattive e componentistica custom ispirata ai migliori design system (layout CSS Grid/Flexbox moderno).
* `app.js`: Contiene tutto il core logico. È diviso per ambiti: inizializzazione eventi, parser JSON-LD in struttura a grafo unio/bi-direzionale, motore fisico (Forza Layout) minimale basato su repulsione/attrazione, compression stream GZIP (Streams API).
