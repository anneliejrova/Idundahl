# Idundahl

Skolprojekt i kursen JavaScript3 — en e-handelsliknande sajt för ett fiktivt porslinsföretag, byggd med Angular, Express och Supabase.

Kursen är fokuserad på Angular, men inkluderade databas + Express + Angular. Jag valde att använda Supabase som bostad för min db men hellre än att utnyttja Supabases färdiga lösningar valde jag att fortfarande gå igenom ett Express lager. Anledningen var att jag ville få insyn i **hela** flödet, inte bara frontend-delen — om jag hade valt bort Express hade jag missat att förstå detaljerna kring hur datan faktiskt hänger ihop.

---

## Tech stack

- **Angular 22 + TypeScript** — frontend

- **Express + TypeScript** — API-lager mellan Angular och databasen

- **Supabase (Postgres)** — databas + filhantering för bilder

---

## Hur man startar projektet

Projektet har två delar som körs separat, i varsin terminal.

**Server:**

```bash

cd server

npm install

npm run dev

```

Kör på `http://localhost:8000`.

**Client:**

```bash

cd client

npm install

npm start

```

Kör på `http://localhost:4200`, och pratar med servern via en proxy (`proxy.config.json`) — ingen CORS-konfiguration behövs.

**Miljövariabler:** servern behöver en `.env`-fil (finns inte i repot av säkerhetsskäl) med Supabase-uppgifter:

```

PORT=8000

SUPABASE_URL=...

SUPABASE_SERVICE_KEY=...

```

---

## Vad som är uppfyllt

**G — alla krav uppfyllda:**

- Start (Hero, Spots, Populära Produkter)

- Sökresultat

- Produktdetaljsida

- Administration: lista produkter

- Administration: ny produkt

**VG — alla krav uppfyllda:**

- "Nyhet"-bricka på produktkort

- Liknande produkter, minst 5 kort, bläddringsbart

- Varukorg (`/basket`) med redigerbart antal

- "Lägg i varukorg" fungerar på riktigt (sparas i webbläsarens `localStorage`)

- Kassasida med kunduppgifter — "Köp"-knappen gör medvetet ingenting, exakt som wireframen visade

---

## Var jag följt mallen, och var jag valt att avvika

Uppgiften tillåter (och kräver) att man använder AI, och sätter inget tak på komplexitet — så jag har på några ställen valt att bygga mer än vad kravet bad om, om det kändes motiverat.

**Följt mallen rakt av:**

- G/VG-sidornas grundstruktur (Start, Sökresultat, Detaljsida, Admin)

- Kassasidans formulärfält och att "Köp"-knappen inte gör något

**Medvetet gått längre än kravet:**

- **Databasen är normaliserad, inte platt.** Uppgiften visar en enda produkttabell (namn, bild, pris osv). Min modell har separata tabeller för kategori, serie, variant, produkttyp och produkt, kopplade till varandra. Det gör admin-formuläret krångligare än mallens fem fält (man måste välja serie, variant och produkttyp också), men det speglar hur en riktig porslinsserie faktiskt är uppbyggd — en serie har flera varianter (färger), och varje variant har flera produkter.

- **SKU sätts automatiskt av servern, inte av admin.** Mallen visar ett fritt textfält för SKU. Jag byggde istället en funktion som bygger SKU:n automatiskt utifrån serie, produkttyp, variant och storlek — admin behöver aldrig skriva eller komma ihåg ett eget format, och risken för felstavning/inkonsekvens försvinner.

- **EAN-fältet finns i databasen men syns inte i admin-formuläret.** Eftersom alla serier i projektet är påhittade och aldrig haft en riktig streckkod, tog jag bort fältet ur formuläret istället för att låta det stå tomt i onödan.

- **Extra sidor utöver kraven:** en sida som listar alla serier, och fyra kategorisidor (kopplade från Start-sidans "Spots") som visar vilka serier som hör till respektive kategori. Ingen av dem krävdes, men de gör sajten lättare att navigera och kändes närmare "en riktig product".

- **Publiceringsdatum i admin-formuläret.** Mallen nämner att produkter med framtida publiceringsdatum inte ska visas, vilket fick mig att inse att admin borde kunna sätta ett eget datum när en produkt "skapas" eller går live (inte bara "nu"). Jag lade till ett datumfält, plus en kryssruta som måste bockas i om datumet är dagens — annars går det inte att skicka formuläret. Poängen är att göra det svårt att av misstag publicera något för tidigt.

- **Intrinsic/fluid design, istället för wireframens tre fasta brytpunkter.**  Wireframen är byggd kring tre specifika breddmått (som jag estimate till ungefär 375, tablet på 640 och desktop 1024px). Jag valde att i stället för att luta mig mot intrinsic design och bygga layouten med clamp(), container queries och uträknade grid-formler, som matchar wireframens mått vid de angivna punkterna men skalar mjukt mellan dem, snarare än att hoppa i tvära steg. Jag föredrar den principen framför fasta brytpunkter rent generellt. En positiv bieffekt jag inte planerat för: eftersom layouten är byggd för att skala kontinuerligt snarare än att reagera på specifika skärmstorlekar, fungerade den direkt även i liggande läge på mobil, utan extra anpassning. Jag brukar planera för liggande läge medvetet, men den här gången kom det på köpet av hur resten redan var byggt. Hero-bilden är det enda stället jag hade kunnat tänkt mig viss justering av, beskärningen känns inte lika genomtänkt i liggande läge som resten av sidan.

---

## Tekniska val jag vill lyfta fram (Angular-delen)

**Formulär är till min bästa förmåga byggt med Signal Forms.** Jag har velat jobba mot senaste Angular-praxis genom hela projektet, så jag valde den här tekniken från början. Formuläret validerar bland annat att pris och lagersaldo faktiskt är ifyllda (inte bara `0`, vilket visade sig vara en lurig detalj — ett tomt sifferfält rapporterar `0`, inte "tomt"). Samt att jag skapade en regel om att en storleksetikett måste anges om något mått fylls i, annars löser Express det med det lilla ordet "Lagom".

**Ett medvetet undantag från signals: `switchMap`.** Admin-formulärets sökfält (serie → variant → produkttyp) beror på varandra — väljer man en serie ska bara den seriens produkttyper visas, hämtat med ett nytt nätverksanrop. Jag använde RxJS's `switchMap` för det, kombinerat med `toObservable`/`toSignal` som brygga mellan de två systemen, eftersom `switchMap` löser ett problem som jag inte kunde hitta en enkel, inbyggd motsvarighet till inom signals: att automatiskt avbryta ett gammalt, pågående anrop om användaren hinner byta val innan svaret kommit tillbaka.

**Dark mode, byggt för att fungera oavsett vald teknik.** Jag ville ha med dark mode av tillgänglighetsskäl och för att öva på något jag vill bli bättre på. Bilder byter automatiskt mellan en ljus och en mörk variant beroende på användarens systeminställning (eller ett manuellt val senare, om jag bygger en switch-knapp). Första lösningar AI presenterade var picture men tyckte det kändes opraktiskt att sätta på varje bild. Så jag efterfrågade om det inte kunde göras i ändelsen. Då fick jag bättre svar, min tanke från början var att jag skulle behöva namnge båda varianterna separat (`_light`/`_dark`), men jag hade snubblat på en praxis igen och fick lära mig det räckte med bas-filnamnet som ljust läge, och bara `_dark` som valfri extra fil — enklare än jag väntat mig. Alt-text på bilder hann jag inte få med i den här versionen, en tydlig lucka jag kommer täppa till om projektet blir ett portföljprojekt senare.

**Fallback-bilder grupperade efter FORM, inte efter produkttyp.** Många av de 132 produkterna saknar fortfarande riktiga foton (bara en serie hann bli helt klar). Istället för att skapa en fallback-bild per produkttyp (41 stycken) insåg jag att flera produkttyper delar samma grundform — en assiett och en mattallrik ser i princip likadana ut, bara olika stora. Jag grupperade produkttyperna i 19 formgrupper istället, vilket betydde 19 bilder att skapa istället för 41.

---

## Tankar efter vägen — vad jag skulle gjort annorlunda

- Jag bytte riktning några gånger under bildhanteringen (SVG → WebP, produktbild → sammansatt bild per variant) innan jag landade rätt. Hade jag vetat AI-begränsningar från början hade jag valt en ändå lättare produkttyp. Nästa gång blir det kaffe eller ljus med samma paketering hela vägen, men jag lärde mig mer av att faktiskt testa fel vägar och planera för dem innan jag anpassade mig.

- Jag skrev flera gånger kod som "kändes klar" i huvudet men aldrig faktiskt sparades i rätt fil, vilket gav samma sorts fel upprepade gånger. Att alltid dubbelkolla att en ändring verkligen ligger i filen och i värsta fall känna igen var den saknas är en vana jag tar med mig framåt.

---

## Kända begränsningar

- De flesta av de 132 produkterna saknar riktiga foton — de visar en formbaserad platshållarbild istället. Bara en serie, Geometria har fullständiga produktbilder i två varianter.

- Produktbeskrivningar är just nu lorem ipsum-text för de produkter som saknade egen beskrivning, för att kunna visa hur sidan ser ut med text. Inte avsedd som riktigt innehåll.

- Variant-switching på serie-sidan visar alltid huvudvarianten, oavsett vilken variant man klickade sig dit ifrån.

- EAN kan tekniskt sparas i databasen men fylls aldrig i via adminformuläret, av skäl som beskrivs ovan.

## I listan av To-do för att detta ska bli ett portföljprojekt

- Variant-switching på serie-sidan (byta färg/variant utan att ladda om — isFreshLoad-logiken var redan planerad i detalj men aldrig implementerad)

- requireAdmin — admin-inloggning, POST /api/products är öppen utan skydd

- "Gillade" (hjärtat) spara i localStorage.

- Fullständigt orderflöde (riktig POST /api/orders, orderbekräftelse)

- Switch-knapp light-/darkmode

- Mood-bilder + description för 6 av 8 serier och flytta nuvarande Hero till att bli "Serie Heros"

- Riktiga produktbeskrivningar istället för lorem ipsum

- I mån av tid fler produktbilder

- Alt-text på bilder (tillgänglighet)

- Trust-badges innehåll mer rätt för poslin

- stock_quantity = 0 borde vara giltigt (just nu blockerat av samma regel som pris)

- Hero, ny designad för hela produkten där bildens beskärning funkar lika bra i liggande mobilläge

- "Populära produkter" → "Rekommenderade produkter" (rubrik + klassnamn)