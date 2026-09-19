# CLAUDE.md — Angular-klient (skoluppgift)

## Projekt
Webbshop för porslinsserviser, skolprojekt med inlämning 23/9. Detta repo är Angular-klienten. Datan kommer från ett separat, färdigt Express-API som anropas via relativa URL:er (`/api/...`) genom en dev-proxy. Klienten pratar aldrig direkt med Supabase och ska inte innehålla någon databasklient eller några hemligheter.

## Så vill jag arbeta
- Jag har begränsad erfarenhet av TypeScript och Angular och vill förstå VARFÖR. Förklara vad du gör och varför, gärna med en kort avvägning mot alternativet.
- Skriv INTE hela komponenter oombedd. Föreslå och förklara, så skriver eller granskar jag själv. Kort kodutdrag eller skiss är bra.
- Bygg bara det jag ber om. Fråga om något är oklart, gissa inte.
- Fånga buggar och inkonsekvenser du ser, och säg till om något känns som mer än jag bad om.
- Jag skriver ibland hastigt med stavfel, läs med god vilja.
- Använd `ng generate` för nya komponenter och services i stället för att skapa filer för hand.
- Committa inte själv. Föreslå commit-meddelande, så committar jag.

## Teknikval (beslutade, ändra inte utan att fråga)
- Angular 22, TypeScript.
- ES modules (`import`/`export`), aldrig CommonJS (`require`/`module.exports`).
- Standalone components, signals, `@if`/`@for`, `provideHttpClient()`. Inga NgModules.
- Vanilla CSS, ingen Tailwind. Intrinsic design med `clamp()` och container-baserad layout, inte fasta brytpunkter.
- CSS-variabler (`var(--text-primary)` osv.) för alla färger, aldrig hårdkodade värden. Dark mode ska gå att lägga till i efterhand utan att skriva om komponenterna.
- Ingen SSR, ren SPA. Kod som använder `window` eller `localStorage` behöver därför inga servervakter.
- Dev-proxy mot Express, inte CORS.

## Konventioner
- Fält som kan sakna värde typas `fält: typ | null` i typer som beskriver API-svar (API:et skickar alltid fältet, aldrig utelämnat). `?` bara för input-typer, t.ex. formulärdata.
- Git: en branch per komponent eller sida (`feature/...`, `fix/...`). Conventional Commits i imperativ form: `feat:`, `fix:`, `docs:`, `refactor:`.
