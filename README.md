# Ambasciata di Mare — sito web

Sito in italiano per il ristorante Ambasciata di Mare a Rimini, realizzato con Next.js App Router, PostgreSQL, Drizzle ORM e Tailwind CSS. Include animazioni responsive, menu navigabile, richieste di prenotazione persistenti ed esportazione Excel.

## Avvio locale

1. `npm install`
2. Crea `.env` con `DATABASE_URL=postgresql://postgres:postgres@127.0.0.1:5432/app_db` e `BOOKING_EXPORT_TOKEN=` seguito da una password lunga e casuale. Non pubblicare `.env` su GitHub.
3. Crea il database PostgreSQL e applica lo schema con `npx drizzle-kit push`.
4. Avvia con `npm run dev`.

Per la pubblicazione configura le stesse variabili d'ambiente nel provider di hosting e usa un database PostgreSQL accessibile dal server. Applica lo schema al database di produzione prima di accettare prenotazioni.

## Prenotazioni

Il modulo invia una richiesta a `POST /api/reservations`. I dati sono validati sul server e salvati nella tabella `reservations`. Lunedì chiuso; le date sono selezionabili fino a 90 giorni nel futuro. Le richieste sono **in attesa**, non automaticamente confermate: lo staff deve contattare il cliente. Per gruppi oltre 12 persone, invitare il cliente a telefonare. Nessuna email automatica è inviata.

## Excel

Apri `/gestione-prenotazioni`. Inserisci il token segreto impostato come `BOOKING_EXPORT_TOKEN` per scaricare un CSV Excel-compatible con separatore `;` e UTF-8. La stessa pagina genera codice Power Query da incollare nell'**Editor avanzato** di Excel, per aggiornare il foglio con **Dati → Aggiorna tutto**. L'endpoint `GET /api/reservations/export` richiede l'header `x-export-token` o `Authorization: Bearer ...`; senza token configurato l'esportazione è disabilitata. Il codice in Excel include il token: custodisci il file e condividilo solo con lo staff autorizzato.

## Fotografie

Non sono state generate immagini artificiali. La foto dell'interno del locale è stata reperita dal link Google Maps fornito nel brief. Le fotografie illustrative dei piatti, della tavola e della spiaggia sono fotografie reali da Pexels (non vengono presentate come piatti fotografati nel ristorante): Adriano Bragi, Nadin Sh, Antigoni Pavlaki, Shameel mukkath, Tobi &Chris e altri autori Pexels. Prima di una pubblicazione ufficiale verificare i diritti d'uso della foto del locale e sostituire le immagini illustrative con foto originali approvate dal ristorante quando disponibili.

## Nota

Recapiti, indirizzo e orari derivano dalle informazioni fornite nel brief; verificare gli orari aggiornati direttamente con il ristorante prima di pubblicare.
