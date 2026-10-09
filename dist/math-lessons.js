import data from './math-lesson-data.json?v=math-dedup-v2' with {type:'json'};

export const mathLessonData=data;
const escape=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

// Explain each method once; numerical variants remain examples within that lesson.
// Plain paragraphs use the shared Academy reading style, including inline examples.
export function renderMathLessons(translate,locale='pt-BR'){
  const number=new Intl.NumberFormat(locale,{maximumFractionDigits:2});
  const references=new Map(data.items.map(item=>[item.id,item.params]));
  const lessons=new Map(data.lessons.map(lesson=>[lesson.id,lesson]));
  const paragraph=(part,example=false)=>{
    const params=Object.fromEntries(Object.entries(references.get(part.source)||{}).map(([key,value])=>[key,typeof value==='number'?number.format(value):value]));
    const text=(example?translate('math.example')+' ':'')+translate(part.key,params);
    return '<p'+(example?' data-math-example':'')+'>'+escape(text)+'</p>';
  };
  const decisions={
    'outs':['Outs indicam quantas cartas podem melhorar sua mão. Converta os outs em probabilidade e compare com o custo do call; outs não garantem vitória.','Los outs indican cartas que pueden mejorar la mano. Conviértelos en probabilidad y compárala con el coste del call.','Outs are cards that may improve your hand. Convert them to probability and compare with the call cost.'],
    'combinatorics':['Combos estimam quantas combinações existem no range adversário. Use-os para ponderar probabilidades; a contagem isolada não determina call ou fold.','Los combos ponderan rangos, pero no deciden por sí solos.','Combos weight opponent ranges but do not determine a call alone.'],
    'probability':['Compare a probabilidade do resultado com o preço e as consequências da decisão. Probabilidade maior que zero não significa call lucrativo.','Una probabilidad mayor que cero no implica un call rentable.','A probability above zero does not make a call profitable.'],
    'odds':['Odds expressam chances, não uma ordem de pagar. Compare as chances de completar e vencer com as pot odds; se o preço for pior que sua chance real, o call tende a ser ruim.','Compara las odds con las pot odds; odds mayores que cero no justifican pagar.','Compare odds with pot odds; odds above zero do not justify a call.'],
    'frequency':['Frequências descrevem quantas vezes uma ação ou evento ocorre. Avalie a frequência junto com o valor ganho ou perdido em cada resultado.','Evalúa la frecuencia junto con las ganancias y pérdidas.','Evaluate frequency together with the payoff of each outcome.'],
    'starting-hands':['Uma mão inicial forte não garante call ou all-in. Considere posição, stacks, ranges e preço antes de agir.','Una mano fuerte no garantiza un call; considera posición, stacks y rangos.','A strong starting hand does not guarantee a call; consider position, stacks and ranges.'],
    'equity':['Para pagar um all-in sem apostas futuras, compare a equidade com a equidade mínima exigida pelo pote. Se a equidade for maior, o call tem EV positivo nas hipóteses usadas; se for menor, prefira fold.','Para pagar un all-in, compara equity con la equity mínima requerida.','For an all-in call, compare equity with the break-even equity required.'],
    'fold-equity':['Um blefe depende de quantas vezes o adversário desiste e do resultado quando paga. Se a frequência de fold necessária for maior que a estimada, o blefe puro não compensa.','El farol depende de la frecuencia de fold y de lo que sucede si pagan.','A bluff depends on fold frequency and what happens when called.'],
    'ev':['EV do call maior que zero: pagar é lucrativo em média nas hipóteses do modelo. EV do call menor que zero: fold é preferível se fold vale zero e não há outra opção superior. EV igual a zero: indiferente antes de outros fatores. Compare também bet e raise quando disponíveis.','EV del call positivo favorece pagar; negativo favorece fold si fold vale cero.','Positive call EV favors calling; negative call EV favors folding if fold is zero.'],
    'pot-odds':['Equidade necessária = valor do call ÷ (pote antes do call + valor do call). Se sua equidade estimada superar esse limite, o call é favorável sem apostas futuras; abaixo do limite, fold.','Equity mínima = call dividido por bote final. Paga si tu equity supera ese umbral.','Required equity = call divided by final pot. Call if estimated equity exceeds it.'],
    'implied-odds':['Um call aparentemente caro pode compensar se você conseguir ganhar fichas adicionais nas streets futuras. Não conte ganhos futuros que o adversário provavelmente não pagará.','Un call caro puede compensar por ganancias futuras realistas.','A costly call may pay off through realistic future winnings.'],
    'reverse-implied-odds':['Mesmo acertando sua mão, você pode perder um pote grande contra uma mão melhor. Desconte esse risco antes de pagar draws dominados.','Incluso mejorando puedes perder mucho; descuenta ese riesgo.','You may still lose a large pot after improving; account for that risk.'],
    'spr':['SPR = stack efetivo restante ÷ pote. SPR baixo facilita compromisso com mãos fortes; SPR alto exige mais cautela com um par. SPR não é EV e não existe regra SPR maior que EV = pagar.','SPR = stack efectivo dividido por bote. No se compara directamente con EV.','SPR = effective remaining stack divided by pot. It is not directly comparable to EV.'],
    'bluff-defense':['A frequência mínima de defesa é referência teórica contra blefes sem equity. Ajuste a defesa aos ranges e à distribuição das mãos; não pague automaticamente qualquer mão.','La defensa mínima es una referencia, no una orden de pagar cualquier mano.','Minimum defense frequency is a benchmark, not an instruction to call any hand.'],
    'draw-probability':['Converta a chance de completar o draw em equidade útil e compare com as pot odds. Considere se os outs são limpos e se haverá novas apostas.','Compara la probabilidad del proyecto con las pot odds y los outs limpios.','Compare draw probability with pot odds and clean outs.'],
    'suited':['Cartas do mesmo naipe aumentam algumas chances de flush, mas não tornam qualquer call lucrativo. Compare ranges, posição e preço.','Ser suited no justifica cualquier call.','Being suited does not justify every call.'],
    'flop-straight':['A chance de sequência no flop ajuda a entender a raridade do evento; não decide sozinha uma ação pré-flop.','La probabilidad de escalera en flop no decide sola el preflop.','Flopping a straight probability does not determine a preflop action.'],
    'flop-set':['Set mining depende da chance de acertar a trinca, do preço do call e das fichas que ainda podem ser ganhas.','Buscar set depende de probabilidad, precio y ganancias futuras.','Set mining depends on hit probability, price and future winnings.'],
    'flop-rank':['A frequência de pares e outras mãos no flop serve para estimar ranges e texturas, não para pagar automaticamente.','Las frecuencias de flop ayudan a estimar rangos, no calls automáticos.','Flop frequencies help estimate ranges, not automatic calls.'],
    'flop-two-pair':['A probabilidade de dois pares no flop não é um critério isolado para entrar no pote. Considere a força relativa da mão e o preço.','La probabilidad de dobles parejas no basta para pagar.','Flopping two pair probability alone is not enough to call.']
  };
  const decisionNote=id=>{const a=decisions[id];return a?'<p class="math-decision-note"><strong>'+escape(locale.startsWith('pt')?'DECISÃO NA MESA':locale.startsWith('es')?'DECISIÓN EN LA MESA':'AT THE TABLE')+'</strong> '+escape(a[locale.startsWith('pt')?0:locale.startsWith('es')?1:2])+'</p>':''};
  const matchupParts=lessons.get('equity').examples.filter(part=>part.source!=='equity'&&part.source!=='aa-random');
  const matchupSection='<section class="math-matchups"><h3>'+escape(locale.startsWith('pt')?'CONFRONTOS PRONTOS':locale.startsWith('es')?'ENFRENTAMIENTOS CALCULADOS':'READY-MADE MATCHUPS')+'</h3><p class="math-matchups-intro">'+escape(locale.startsWith('pt')?'Equidade pré-flop para as cartas e naipes mostrados.':locale.startsWith('es')?'Equidad preflop para las cartas y palos indicados.':'Preflop equity for the exact cards and suits shown.')+'</p><div class="math-matchups-grid">'+matchupParts.map(part=>{const hand=references.get(part.source);const pct=number.format(hand.percent);return '<article class="math-matchup-card"><div class="math-matchup-hands"><span>'+escape(hand.hero)+'</span><small>×</small><span>'+escape(hand.villain)+'</span></div><div class="math-matchup-equity"><strong>'+escape(pct)+'%</strong><span>'+escape(locale.startsWith('pt')?'EQUIDADE DA PRIMEIRA MÃO':locale.startsWith('es')?'EQUIDAD DE LA PRIMERA MANO':'FIRST HAND EQUITY')+'</span></div></article>'}).join('')+'</div></section>';
  return '<div class="discover-page glossary-page math-lessons">'+matchupSection+data.groups.map(group=>
    '<section class="discover-section glossary-group"><h3>'+escape(translate('math.groups.'+group.id))+'</h3><div class="glossary-list">'+group.items.map(id=>{
      const lesson=lessons.get(id);
      return '<article class="glossary-term math-lesson" data-math-item="'+id+'"><strong>'+escape(translate('math.lessons.'+id+'.name'))+'</strong>'+lesson.paragraphs.map(part=>paragraph(part)).join('')+lesson.examples.slice(0,1).map(part=>paragraph(part,true)).join('')+decisionNote(id)+'</article>';
    }).join('')+'</div></section>'
  ).join('')+'</div>';
}
