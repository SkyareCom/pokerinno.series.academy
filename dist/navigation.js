export const routes=['home','journey','practice','evolution','profile','welcome'];
export function resolveRoute(hash){
  const key=hash.replace(/^#\/?/,'');
  const aliases={
    base:'chapter/rules',
    modalities:'chapter/formats'
  };
  if(aliases[key])return aliases[key];
  const baseMatch=key.match(/^base\/(\d+)$/);
  if(baseMatch)return 'rule/'+baseMatch[1];
  if(routes.includes(key)||/^(?:chapter\/(discover|rules|decisions|formats|practice)|discover\/(intro|history|types)|rule\/\d+|modality\/\d+|practice-tool\/\d+|profile\/(access|language|history|plans|coach|privacy))$/.test(key))return key;
  return 'home';
}
