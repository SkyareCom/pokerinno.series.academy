export const routes=['home','journey','practice','play','evolution','profile','welcome'];
export function resolveRoute(hash){
  const key=hash.replace(/^#\/?/,'');
  const aliases={
    base:'chapter/rules',
    modalities:'chapter/formats'
  };
  if(aliases[key])return aliases[key];
  if(/^base\/\d+$/.test(key))return 'chapter/rules';
  if(/^modality\/\d+$/.test(key))return 'chapter/formats';
  if(/^discover\//.test(key))return 'chapter/discover';
  if(routes.includes(key)||/^(?:chapter\/(discover|rules|terms|betting|math|dealing|floor|etiquette|house-rules|decisions|formats|practice)|practice-tool\/\d+|practice-module\/[a-z0-9-]+|practice-bank|procedure\/(emb|mis|irr)|profile\/(access|language|history|plans|coach|privacy))$/.test(key))return key;
  return 'home';
}
