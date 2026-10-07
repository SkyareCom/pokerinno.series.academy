export const routes=['login','create-account','home','journey','modalities','practice','evolution','profile','welcome'];
export function resolveRoute(hash){
  const key=hash.replace(/^#\/?/,'');
  if(!key)return 'login';
  return routes.includes(key)||/^chapter\/(discover|rules|decisions|formats|practice)$/.test(key)?key:'home';
}
