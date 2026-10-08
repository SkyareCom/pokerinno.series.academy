export const routes=['home','journey','practice','evolution','profile','welcome'];
export function resolveRoute(hash){
  const key=hash.replace(/^#\/?/,'');
  const aliases={
    base:'chapter/rules',
    modalities:'chapter/formats'
  };
  if(aliases[key])return aliases[key];
  if(/^base\/\d+$/.test(key))return 'chapter/rules';
  if(/^modality\/\d+$/.test(key))return 'chapter/formats';
  if(/^rule\/\d+$/.test(key))return 'chapter/rules';
  if(/^discover\//.test(key))return 'chapter/discover';
  if(routes.includes(key)||/^(?:chapter\/(discover|rules|decisions|formats|practice)|rules\/(structure|actions|procedures|etiquette)|practice-tool\/\d+|profile\/(access|language|history|plans|coach|privacy))$/.test(key))return key;
  return 'home';
}
