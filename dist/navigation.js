export const routes=['home','journey','base','modalities','practice','evolution','profile','welcome'];
export function resolveRoute(hash){const key=hash.replace(/^#\/?/,'');return routes.includes(key)||/^(?:chapter\/(discover|rules|decisions|formats|practice)|base\/\d+|modality\/\d+|practice-tool\/\d+)$/.test(key)?key:'home'}
