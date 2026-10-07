export const routes=['home','journey','modalities','practice','evolution','profile','welcome'];
export function resolveRoute(hash){const key=hash.replace(/^#\/?/,'');return routes.includes(key)||/^chapter\/(discover|rules|decisions|formats|practice)$/.test(key)?key:'home'}
