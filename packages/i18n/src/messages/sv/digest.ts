/** Weekly digest copy for the Swedish interface. */
export const digestMessages = {
  'digest.title': 'Denna vecka',
  'digest.subtitle': 'Vad vi kan se från {windowStart} till {windowEnd}.',
  'digest.empty': 'Det finns inget att sammanfatta för denna vecka ännu. Publicera något så visas det här.',
  'digest.regenerate': 'Bygg om denna veckas sammanfattning',
  'digest.generating': 'Bygger denna veckas sammanfattning',
  'digest.source.deterministic': 'Skrivet från dina publiceringsregister och egna mätningar, utan skrivassistenten.',
  'digest.source.ai': 'Skrivet av assistenten från dina egna register. Varje siffra har kontrollerats mot dem.',
  'digest.unavailable.aiOff': 'Skrivassistenten är avstängd, så detta är den enkla versionen. Inget saknas.',
  'digest.unavailable.rejected':
    'Assistentversionen matchade inte dina data och förkastades. Detta är den enkla versionen.',
  'digest.headline.published':
    '{published, plural, =0 {Inga inlägg slutförda} one {# inlägg slutfört} other {# inlägg slutförda}} mellan {windowStart} och {windowEnd}.',
  'digest.headline.nothingPublished': 'Inget publicerades mellan {windowStart} och {windowEnd}.',
  'digest.outcome.published':
    '{count, plural, one {# inlägg slutfört på {provider}} other {# inlägg slutförda på {provider}}}.',
  'digest.outcome.partial':
    '{count, plural, one {# inlägg nådde bara vissa av sina mål på {provider}} other {# inlägg nådde bara vissa av sina mål på {provider}}}.',
  'digest.outcome.failed':
    '{count, plural, one {# inlägg gick inte ut på {provider}} other {# inlägg gick inte ut på {provider}}}.',
  'digest.metrics.noneYet':
    'Inga mätningar har kommit in för denna vecka. Det betyder att vi inte vet hur dessa inlägg presterade, inte att de presterade dåligt.',
  'digest.freshness.statement':
    '{label, select, fresh {Mätningar synkades senast {lastObservedAt}.} stale {Mätningar har inte synkats sedan {lastObservedAt}, så siffrorna ovan kan vara inaktuella.} other {Inget har synkats ännu, så inget ovan är mätt.}}',
  'digest.narrative.headline': '{statement}',
  'digest.narrative.observation': '{statement}',
  'digest.narrative.confounder': 'Värt att veta: {confounder}',
  'digest.narrative.notSupported': '{statement}',
  'digest.narrative.nextAction': '{statement}',
  'digest.settings.title': 'Veckovis sammanfattning via e-post',
  'digest.settings.description': 'Ett kort e-postmeddelande varje vecka med vad som skickades och vad vi kunde mäta. På som standard.',
  'digest.settings.enabled': 'Skicka veckosammanfattningen',
  'email.digest.subject': 'Din vecka i {workspaceName}',
  'email.digest.intro': 'Här är vad vi kan se för {workspaceName} mellan {windowStart} och {windowEnd}.',
  'email.digest.noData':
    'Vi kunde inte mäta något denna vecka. När ett nummer saknas beror det på att vi inte kunde läsa det, inte på att det var noll.',
  'email.digest.footer':
    'Du får detta eftersom veckosammanfattningen är på för {workspaceName}. Stäng av den i arbetsytans inställningar.',
} as const;
