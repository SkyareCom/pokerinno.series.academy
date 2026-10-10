import {createHash,randomUUID} from 'node:crypto';
import {readFileSync,mkdirSync} from 'node:fs';
import {join} from 'node:path';

export const pinnedEngines={
 TexasSolver:{repository:'https://github.com/bupticybee/TexasSolver',commit:'6dfb65b4d7ed081da509e8d8c3d82138c4708267'},
 'Postflop-Poker-Solver':{repository:'https://github.com/kfg021/Postflop-Poker-Solver',commit:'2319e0d5f1bd6f5976faf4d1041ff0b49605e192',capacityPatch:'scripts/patches/dcfr-stack-capacity.patch'}
};
export const sha256=s=>createHash('sha256').update(s).digest('hex');
export function allocateRunDirectory(root,spotId,prepareOnly=false){
 const dir=join(root,String(spotId),prepareOnly?'':randomUUID());
 mkdirSync(dir,{recursive:true});return dir;
}
const stableRange=r=>Object.fromEntries(Object.entries(r).sort(([a],[b])=>a.localeCompare(b)).map(([h,w])=>{
 if(!Number.isFinite(w)||w<0||w>1)throw Error('Invalid range weight '+h);
 return [h,Number(w.toFixed(6))];
}));
const rangeText=r=>Object.entries(r).filter(([,w])=>w>0).map(([h,w])=>h+':'+w.toFixed(6)).join(',');
const comboKey=h=>[h.slice(0,2),h.slice(2)].sort().join('');

export function canonicalScenario(spot){
 if(!['flop','turn','river'].includes(spot.street))throw Error('Postflop only');
 const cards=[...spot.heroCards,...spot.board];
 if(spot.board.length!=={flop:3,turn:4,river:5}[spot.street]||
  spot.heroCards.length!==2||cards.some(c=>!/^[2-9TJQKA][shdc]$/.test(c))||new Set(cards).size!==cards.length)throw Error('Invalid cards');
 const potChips=spot.pot*4,stackChips=spot.effectiveStack*4;
 if(!Number.isInteger(potChips)||potChips%2||!Number.isInteger(stackChips)||potChips<=0||stackChips<=0)throw Error('Lossy chip conversion');
 const ranges={oop:stableRange(spot.villainRange),ip:stableRange(spot.heroRange)};
 const tree={kind:'CHECK_OR_ALL_IN',streets:['flop','turn','river'],betSizes:[],raiseSizes:[],allIn:true,rake:0};
 const decision={street:spot.street,heroCards:spot.heroCards,board:spot.board,potChips,stackChips,nodePath:['CHECK'],ranges,tree};
 return {schemaVersion:1,originalSpotId:spot.id,street:spot.street,heroCards:spot.heroCards,
  board:spot.board,potChips,stackChips,nodePath:['CHECK'],ranges,tree,
  inputHash:sha256(JSON.stringify(decision)),rangeHash:sha256(JSON.stringify(ranges)),treeHash:sha256(JSON.stringify(tree)),
  spotSourceHash:sha256(JSON.stringify(spot)),rangeVerified:false,rangeProvenance:spot.rangeProvenance,
  scope:'DIAGNOSTIC_SIMPLIFIED_HU_GAME',warning:'Source ranges are not verified GTO ranges; prior-street reach probabilities are not reconstructed. No original spot certification.'};
}

export function renderTexasInput(s,output,{iterations=1000,accuracy=.05}={}){
 return [`set_pot ${s.potChips}`,`set_effective_stack ${s.stackChips}`,`set_board ${s.board.join(',')}`,
  `set_range_ip ${rangeText(s.ranges.ip)}`,`set_range_oop ${rangeText(s.ranges.oop)}`,
  ...['oop','ip'].flatMap(p=>s.tree.streets.flatMap(st=>[
   `set_bet_sizes ${p},${st},bet`,`set_bet_sizes ${p},${st},raise`,`set_bet_sizes ${p},${st},allin`])),
  'set_allin_threshold 1','build_tree','set_thread_num 2',`set_accuracy ${accuracy}`,
  `set_max_iteration ${iterations}`,'set_print_interval 10','set_use_isomorphism 1','start_solve',
  'set_dump_rounds 1',`dump_result ${output}`].join('\n')+'\n';
}

export function renderDcfrInput(s,{iterations=1000,accuracy=.05}={}){
 const actions=['oop','ip'].flatMap(p=>['    '+p+':',...s.tree.streets.flatMap(st=>[
  '      '+st+':','        bet-sizes: []','        raise-sizes: []'
 ])]).join('\n');
 return `ranges:\n  oop: "${rangeText(s.ranges.oop)}"\n  ip: "${rangeText(s.ranges.ip)}"\n`+
  `board: "${s.board.join(', ')}"\ntree:\n  starting-wager-per-player: ${s.potChips/2}\n`+
  `  effective-stack-remaining: ${s.stackChips}\n  dead-money-in-pot: 0\n  use-isomorphism: true\n  actions:\n${actions}\n`+
  `solver:\n  threads: 2\n  target-exploitability: ${accuracy}\n  max-iterations: ${iterations}\n  exploitability-check-frequency: 10\n`;
}

function validateFrequencies(f){
 const v=Object.values(f);
 if(!v.length||v.some(x=>!Number.isFinite(x)||x<0||x>1)||Math.abs(v.reduce((a,b)=>a+b,0)-1)>.0011)throw Error('Invalid frequencies');
 return f;
}

export function parseTexasResult(raw,s){
 const n=raw.childrens?.CHECK;
 if(!n||n.player!==0||!Array.isArray(n.actions))throw Error('Missing IP decision node after CHECK');
 if(JSON.stringify(n.actions)!==JSON.stringify(['CHECK',`BET ${s.stackChips.toFixed(6)}`]))throw Error('Unexpected Texas tree actions');
 const matches=Object.entries(n.strategy?.strategy??{}).filter(([h])=>comboKey(h)===s.heroCards.slice().sort().join(''));
 if(matches.length!==1)throw Error('Exact hero combo missing or duplicated');
 const [check,allIn]=matches[0][1];
 return validateFrequencies({CHECK:check,['ALL_IN:'+s.stackChips]:allIn});
}

export function parseDcfrResult(log,s){
 if(/Error:|Game settings not loaded|Could not load field/.test(log))throw Error('DCFR reported an error');
 const lastIp=log.lastIndexOf('Player to act: IP');
 if(lastIp<0)throw Error('Missing IP decision node');
 const block=log.slice(lastIp);
 const labels=[...block.matchAll(/^\s*\[(\d+)\] (.+)$/gm)].map(m=>[Number(m[1]),m[2].trim()]);
 if(JSON.stringify(labels)!==JSON.stringify([[0,'Check'],[1,'All-in '+s.stackChips]]))throw Error('Unexpected DCFR tree actions');
 const rows=[...block.matchAll(/^\|\s*([2-9TJQKA][shdc][2-9TJQKA][shdc])\s*\|\s*([\d.]+)\s*\|\s*([\d.]+)\s*\|\s*([\d.]+)\s*\|/gm)]
  .filter(m=>comboKey(m[1])===s.heroCards.slice().sort().join(''));
 if(rows.length!==1||Number(rows[0][2])<=0)throw Error('Exact hero combo missing, duplicate or unreachable');
 return validateFrequencies({CHECK:Number(rows[0][3]),['ALL_IN:'+s.stackChips]:Number(rows[0][4])});
}

export function readConvergence(engine,log,exitCode){
 if(exitCode!==0)throw Error('Solver exit code '+exitCode);
 const re=engine==='TexasSolver'?/Total exploitability ([\d.eE+-]+) precent/g:/Exploitability: [\d.eE+-]+ \(([\d.eE+-]+)%\)/g;
 const samples=[...log.matchAll(re)].map(m=>Number(m[1]));
 const value=samples.at(-1);
 if(!Number.isFinite(value)||value<0)throw Error('Missing measured exploitability');
 return value;
}

export function normalizeRun({engine,scenario,inputPath,rawPath,logPath,exitCode,binaryPath,enginePatchSha256=null}){
 const pin=pinnedEngines[engine];if(!pin)throw Error('Unsupported engine');
 const raw=readFileSync(rawPath),log=readFileSync(logPath,'utf8');
 const exploitabilityPercent=readConvergence(engine,log,exitCode);
 const actionFrequencies=engine==='TexasSolver'?parseTexasResult(JSON.parse(raw),scenario):parseDcfrResult(log,scenario);
 return {schemaVersion:2,spotId:scenario.originalSpotId,street:scenario.street,engine,engineCommit:pin.commit,engineRepository:pin.repository,enginePatchSha256,
  inputHash:scenario.inputHash,rangeHash:scenario.rangeHash,treeHash:scenario.treeHash,
  rangeVerified:scenario.rangeVerified,scope:scenario.scope,spotSourceHash:scenario.spotSourceHash,
  converged:exploitabilityPercent<=.3,exploitabilityPercent,actionFrequencies,rawOutputHash:sha256(raw),
  artifacts:{input:{path:inputPath,sha256:sha256(readFileSync(inputPath))},raw:{path:rawPath,sha256:sha256(raw)},
   log:{path:logPath,sha256:sha256(log)},binary:{path:binaryPath,sha256:sha256(readFileSync(binaryPath))}},
  nodePath:scenario.nodePath,heroCards:scenario.heroCards,warning:scenario.warning};
}
