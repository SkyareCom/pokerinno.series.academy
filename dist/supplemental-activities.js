/* Additional independently identifiable exercises. No recycled prompt IDs. */
const q=(id,prompt,options,answer,analysis)=>({id,type:'choice',prompt,options,answer,analysis});
const bank={discover:[],rules:[],floor:[],etiquette:[], 'house-rules':[],terms:[]};
const add=(topic,id,prompt,options,answer,analysis)=>bank[topic].push(q('NEW-'+topic+'-'+id,prompt,options,answer,analysis));
const ranks='23456789TJQKA'.split('');
const name={T:'10',J:'Valete',Q:'Dama',K:'Rei',A:'Ás'};
for(let i=0;i<ranks.length;i++)for(let j=i+1;j<ranks.length;j++){
 const a=ranks[i],b=ranks[j],label=x=>name[x]||x;
 add('discover','rank-'+a+b,'Em um confronto de cartas altas, qual carta tem maior valor: '+label(a)+' ou '+label(b)+'?',[label(a),label(b)],label(b),'Na ordem de valores, '+label(b)+' supera '+label(a)+'.');
}
const seats=['UTG','UTG+1','UTG+2','LJ','HJ','CO','BTN','SB','BB'];
for(let i=0;i<seats.length;i++)for(let j=i+1;j<seats.length;j++){
 const a=seats[i],b=seats[j];
 add('rules','order-'+i+'-'+j,'Sem straddle, quem age primeiro pré-flop entre '+a+' e '+b+'?',[a,b],a,'Na ordem pré-flop da mesa 9-max, '+a+' precede '+b+'.');
}
for(let i=0;i<seats.length;i++)for(let j=i+1;j<seats.length;j++){
 const a=seats[i],b=seats[j];
 add('rules','post-'+i+'-'+j,'No pós-flop, entre '+a+' e '+b+' ainda ativos, quem age primeiro?',[a,b],a==='SB'?'SB':a==='BB'?'BB':b==='SB'?'SB':b==='BB'?'BB':a,'Pós-flop, a ação começa no primeiro jogador ativo à esquerda do botão.');
}
const phases=['pré-flop','flop','turn','river'];
for(const phase of phases)for(const players of [2,3,4,5,6,7,8,9])for(const issue of ['aposta fora de vez','cartas expostas acidentalmente','fichas misturadas ao pote']){
 const answers=['Interromper a ação e solicitar decisão da direção','Ignorar a ocorrência e continuar','Aplicar penalidade por conta própria'];
 add('floor',phase+'-'+players+'-'+issue,'Em '+phase+', com '+players+' jogadores na mão, ocorre '+issue+'. Qual é a conduta mais segura para o dealer?',answers,answers[0],'O dealer deve preservar o estado da mão e consultar a direção, pois a solução depende das regras aplicáveis.');
}
const etiquetteSituations=[
 ['jogador fora da mão tenta revelar a carta que viu','Solicitar que não interfira e avisar o dealer'],
 ['um jogador pede para ver cartas privadas de outro durante a mão','Preservar o sigilo das cartas'],
 ['alguém anuncia ação enquanto outro jogador ainda decide','Aguardar a vez e solicitar orientação ao dealer'],
 ['jogador comemora provocando diretamente o adversário','Celebrar sem ofender nem provocar'],
 ['uma pessoa de fora tenta aconselhar jogador em ação','Não permitir orientação externa durante a mão'],
 ['jogador coloca fichas de maior valor atrás de pilhas pequenas','Deixar fichas de maior valor visíveis'],
 ['um participante tenta tocar nas fichas do adversário','Não tocar em fichas alheias sem autorização'],
 ['jogador usa celular para discutir mão em andamento','Evitar compartilhar informação sobre a mão ativa'],
 ['jogador insulta dealer após perder um pote','Tratar o dealer com respeito'],
 ['jogador comenta a força de cartas descartadas','Não comentar cartas durante a mão']
];
const environments=['mesa de cash game','torneio regular','mesa final','jogo com jogadores iniciantes','torneio com transmissão','jogo presencial de clube','evento com dealer profissional','mesa com vários all-ins','jogo com observadores','torneio de classificação'];
for(let i=0;i<etiquetteSituations.length;i++)for(let j=0;j<environments.length;j++){
 const [situation,correct]=etiquetteSituations[i];
 add('etiquette',i+'-'+j,'Em '+environments[j]+', '+situation+'. Qual atitude respeita a etiqueta?', [correct,'Estimular a interferência','Desconsiderar os demais participantes'],correct,'A etiqueta protege o respeito e a integridade da partida.');
}
const policies=[
 ['uso de telefone à mesa','consultar a regra específica do evento'],
 ['reentrada em torneio','verificar o regulamento e o período permitido'],
 ['tempo de decisão','verificar a política de relógio da casa'],
 ['valor mínimo de buy-in','consultar os limites publicados da mesa'],
 ['premiação de torneio','conferir a estrutura oficial de pagamentos'],
 ['troca de assento','pedir autorização conforme a regra local'],
 ['consumo de bebidas na mesa','seguir as orientações do estabelecimento'],
 ['uso de fones de ouvido','verificar as restrições do torneio'],
 ['procedimento para misdeal','chamar o dealer ou a direção'],
 ['regras de straddle','consultar se a modalidade é permitida'],
 ['desempate em premiação','consultar o regulamento publicado'],
 ['inscrição tardia','verificar o horário-limite oficial'],
 ['comportamento abusivo','comunicar o responsável pelo evento'],
 ['exibição de cartas em showdown','seguir o procedimento oficial da casa'],
 ['reposição de fichas em cash game','observar mínimo e máximo autorizados'],
 ['política de filmagem','pedir autorização conforme as normas do local'],
 ['limites de aposta','verificar a estrutura e os limites da mesa'],
 ['mudança de blind em torneio','conferir o cronograma oficial'],
 ['uso de aplicativos durante a mão','consultar a política de dispositivos e assistência'],
 ['encerramento de mesa','seguir o procedimento anunciado pela direção']
];
for(let i=0;i<policies.length;i++)for(const setting of ['em torneio','em cash game','em evento especial','em clube','em mesa televisionada']){
 const [subject,correct]=policies[i];
 add('house-rules',i+'-'+setting,'Antes de decidir sobre '+subject+' '+setting+', qual fonte prevalece?', [correct,'Uma regra presumida de outra casa','Uma opinião de espectador'],correct,'As regras particulares devem ser consultadas no regulamento vigente da casa ou evento.');
}
const glossary=[
 ['stack','total de fichas de um jogador'],['pot','fichas disputadas na mão'],['kicker','carta usada para desempatar mãos equivalentes'],['ante','contribuição obrigatória anterior à distribuição'],['blind','aposta obrigatória de posição'],['flop','três primeiras cartas comunitárias'],['turn','quarta carta comunitária'],['river','quinta carta comunitária'],['showdown','revelação e comparação das mãos'],['fold','desistir da mão'],['call','igualar aposta vigente'],['raise','aumentar a aposta'],['check','passar sem apostar quando permitido'],['bet','fazer uma aposta'],['all-in','colocar todas as fichas disponíveis em jogo'],['button','marcador da posição do dealer'],['cutoff','posição imediatamente anterior ao botão'],['under the gun','primeiro a agir pré-flop sem straddle'],['outs','cartas que podem melhorar a mão para o resultado desejado'],['draw','mão que ainda busca completar combinação'],['nut flush','maior flush possível no board'],['open-ended','projeto de sequência com duas pontas'],['gutshot','projeto de sequência com lacuna interna'],['board','cartas comunitárias'],['range','conjunto de mãos possíveis'],['equity','parcela esperada do pote segundo probabilidades'],['value bet','aposta visando receber calls de mãos piores'],['bluff','aposta buscando fazer mão melhor desistir'],['check-raise','passar e depois aumentar uma aposta'],['limp','entrar pagando o big blind sem aumentar'],['3-bet','terceira aposta na sequência de aumentos'],['4-bet','aumento após uma 3-bet'],['SPR','razão entre stack efetivo e pote'],['ICM','modelo do valor monetário das fichas em torneios'],['bubble','fase próxima da entrada na premiação'],['heads-up','confronto entre dois jogadores'],['short stack','stack pequeno em relação aos blinds'],['effective stack','menor stack entre jogadores envolvidos'],['side pot','pote paralelo para quem tem fichas adicionais'],['rake','taxa retirada pela casa']
];
for(let i=0;i<glossary.length;i++)for(let j=0;j<3;j++){
 const [term,meaning]=glossary[i],wrong1=glossary[(i+7+j)%glossary.length][1],wrong2=glossary[(i+17+j)%glossary.length][1];
 add('terms',i+'-'+j,'No glossário de poker, o termo '+term+' significa o quê?'+(j===1?' Considere o uso durante uma mão.':j===2?' Considere o uso em estudo técnico.':''),[meaning,wrong1,wrong2],meaning,term+': '+meaning+'.');
}
export const supplementalActivities=bank;
