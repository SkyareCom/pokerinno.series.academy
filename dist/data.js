export const chapters=[['discover','Descobrir o jogo','Primeiro contato com o poker.'],['rules','Conhecer as regras','Regras, termos e dinâmica.'],['decisions','Entender as decisões','Observe, decida e aja.'],['formats','Explorar modalidades','Conheça outras modalidades.'],['practice','Preparar-se para a mesa','Pratique o básico e comece a jogar.']].map(([id,title,description],i)=>({id,title,description,order:i+1,lessons:[]}));
export const emptyAdapter={async load(){return {user:null,chapters,modalities:[],challenges:[],results:[],achievements:[],progress:[]}}};
export async function loadAcademy(adapter=emptyAdapter){try{return {status:'ready',data:await adapter.load(),error:null}}catch{return {status:'error',data:null,error:'Não foi possível carregar sua jornada.'}}}

export const discoverLessons=[
  {
    id:'intro',
    title:'INTRODUÇÃO AO POKER',
    description:'Entenda o jogo antes das regras.',
    blocks:[
      ['O QUE É POKER','Poker é um jogo de decisões com cartas, apostas e informação incompleta.'],
      ['OBJETIVO','O objetivo de cada mão é conquistar o pote, no showdown ou fazendo os adversários desistirem.'],
      ['COMO UMA MÃO ACONTECE','Os jogadores recebem cartas, participam de rodadas de ação e tomam decisões até a mão terminar.'],
      ['INFORMAÇÃO INCOMPLETA','Você conhece suas cartas e observa a mesa, mas não vê as cartas dos adversários.'],
      ['DECISÕES IMPORTAM','Cartas, posição, apostas, adversários, risco e recompensa influenciam cada escolha.'],
      ['HABILIDADE E VARIÂNCIA','Bons resultados não acontecem em toda mão. No longo prazo, decisões melhores fazem diferença.'],
      ['A MESA DE POKER','Jogadores, posições, fichas, cartas e dealer formam o ambiente onde as decisões acontecem.'],
      ['DINÂMICA SOCIAL','Agir na sua vez, respeitar a mesa e acompanhar a ação também fazem parte do jogo.']
    ]
  },
  {
    id:'history',
    title:'UM POUCO DE HISTÓRIA',
    description:'Veja como o poker evoluiu.',
    blocks:[
      ['ORIGENS','As origens exatas do poker são debatidas e foram influenciadas por diferentes jogos de cartas e apostas.'],
      ['SÉCULO XIX','O poker ganhou força nos Estados Unidos e começou a consolidar regras, apostas e formas de comparação de mãos.'],
      ['EVOLUÇÃO DO JOGO','Com o tempo surgiram novas formas de jogar, diferentes estruturas e maneiras de distribuir as cartas.'],
      ['TEXAS HOLD’EM','O Texas Hold’em ganhou popularidade no século XX e se tornou uma das principais referências do poker moderno.'],
      ['TORNEIOS','Grandes competições ajudaram a transformar o poker em um jogo de alcance internacional.'],
      ['POKER ONLINE','A internet ampliou o acesso ao jogo e acelerou sua expansão pelo mundo.'],
      ['POKER ATUAL','Hoje o poker é jogado ao vivo e online, em cash games, torneios e diferentes variantes.']
    ]
  },
  {
    id:'types',
    title:'TIPOS DE JOGOS',
    description:'Entenda os formatos principais.',
    blocks:[
      ['JOGADORES X CASA','Na maior parte do poker, os jogadores competem entre si. Em alguns jogos de cassino, a disputa pode ser contra a casa.'],
      ['CASH GAME','As fichas representam valor de jogo e a sessão não depende de eliminação.'],
      ['TORNEIO','Os jogadores disputam uma estrutura progressiva até a definição das colocações.'],
      ['FORMATOS E MODALIDADES','Existem diferentes modalidades de poker. As regras de cada uma serão estudadas nos capítulos específicos.']
    ]
  }
];

export const discoverSections=[
  {type:'host',eyebrow:'POKERINNO APRESENTA',title:'ANTES DAS REGRAS',text:'Antes de decorar regras, entenda o que está acontecendo na mesa e por que cada decisão importa.',host:'Primeiro você entende o jogo. Depois aprende a jogá-lo.'},
  {type:'content',title:'O QUE É POKER',text:'Poker é um jogo de cartas, apostas e decisões. Os jogadores disputam potes usando informação incompleta, leitura da situação e escolhas estratégicas.'},
  {type:'content',title:'QUAL É O OBJETIVO',text:'Em cada mão, o objetivo é conquistar o pote. Isso pode acontecer mostrando a melhor mão no final ou fazendo os adversários desistirem antes disso.',host:'Você não precisa vencer sempre com a melhor mão. Precisa tomar decisões melhores.'},
  {type:'steps',title:'COMO UMA MÃO ACONTECE',items:['Os jogadores recebem cartas.','A primeira rodada de ações começa.','Novas cartas podem aparecer na mesa.','Os jogadores voltam a decidir.','A mão termina com desistência geral ou showdown.']},
  {type:'scene',title:'A MESA DE POKER',text:'Jogadores, dealer, posições, fichas, cartas e pote formam o ambiente do jogo. A posição e a ordem das ações mudam a quantidade de informação disponível para cada decisão.'},
  {type:'content',title:'INFORMAÇÃO INCOMPLETA',text:'Você conhece suas cartas, vê o que está na mesa e acompanha as apostas. Mas não conhece as cartas dos adversários. Por isso, cada decisão é tomada com informação parcial.'},
  {type:'compare',title:'JOGADORES X CASA',leftTitle:'POKER TRADICIONAL',leftText:'Os jogadores competem entre si. A casa organiza a mesa e aplica as regras.',rightTitle:'JOGOS DE CASSINO',rightText:'Em alguns formatos específicos, o jogador pode competir diretamente contra a casa.'},
  {type:'compare',title:'CASH GAME X TORNEIO',leftTitle:'CASH GAME',leftText:'As fichas representam valor direto e a sessão não depende de eliminação.',rightTitle:'TORNEIO',rightText:'Os jogadores começam com um stack e avançam até a definição das colocações.',host:'É o mesmo universo, mas com ritmos e objetivos bem diferentes.'},
  {type:'timeline',title:'UM POUCO DE HISTÓRIA',items:[['ORIGENS','As origens exatas do poker são debatidas e receberam influência de diferentes jogos de cartas e apostas.'],['SÉCULO XIX','O jogo ganhou força nos Estados Unidos e começou a consolidar regras e formas de comparação de mãos.'],['POKER MODERNO','Novas variantes, torneios e o Texas Hold’em ajudaram a popularizar o poker.'],['ERA ONLINE','A internet ampliou o acesso e transformou o poker em uma atividade global.']]},
  {type:'summary',title:'O QUE VOCÊ JÁ ENTENDE',items:['Poker é um jogo de decisões.','O objetivo é conquistar o pote.','Informação incompleta faz parte do jogo.','Cash game e torneio têm estruturas diferentes.','O poker evoluiu e hoje possui diversas formas de jogo.'],host:'Agora as regras vão fazer muito mais sentido.'}
];

export const rulesSections=[
  {type:'host',eyebrow:'POKERINNO EXPLICA',title:'COMO O JOGO SE ORGANIZA',text:'Agora que você já conhece o universo do poker, é hora de entender a estrutura que faz cada mão funcionar.',host:'Não precisa decorar tudo de uma vez. Entenda a sequência e as regras começam a se encaixar.'},
  {type:'content',title:'RANKING DE MÃOS',text:'As combinações têm uma ordem de força. Saber reconhecer pares, dois pares, trinca, sequência, flush, full house, quadra, straight flush e royal flush é a base para identificar quem vence no showdown.'},
  {type:'scene',title:'POSIÇÕES NA MESA',text:'A posição indica quando cada jogador age. Button, blinds e demais posições definem a ordem das decisões e a quantidade de informação disponível antes de agir.'},
  {type:'compare',title:'BLINDS E ANTE',leftTitle:'BLINDS',leftText:'Small Blind e Big Blind são apostas obrigatórias que iniciam a disputa pelo pote.',rightTitle:'ANTE',rightText:'Em algumas estruturas, todos ou parte dos jogadores colocam uma pequena aposta adicional antes da mão começar.'},
  {type:'steps',title:'AS STREETS',items:['PRÉ-FLOP — decisões antes das cartas comunitárias.','FLOP — três cartas comunitárias aparecem.','TURN — a quarta carta comunitária é revelada.','RIVER — a quinta e última carta comunitária aparece.']},
  {type:'steps',title:'SEQUÊNCIA DAS AÇÕES',items:['Identifique quem deve agir primeiro.','Acompanhe check, bet, call, raise ou fold.','Espere sua vez de agir.','A rodada termina quando as apostas estão igualadas ou todos, menos um, desistiram.']},
  {type:'content',title:'CHECK, BET, CALL, RAISE E FOLD',text:'Check passa a ação sem apostar quando permitido. Bet inicia uma aposta. Call iguala uma aposta. Raise aumenta o valor. Fold abandona a mão.'},
  {type:'content',title:'SHOWDOWN',text:'Quando dois ou mais jogadores chegam ao final da mão, as cartas são comparadas. A melhor combinação válida leva o pote, salvo situações de empate.'},
  {type:'content',title:'MUCK',text:'Muck é descartar a mão sem mostrá-la quando isso é permitido. Em determinadas situações, as regras da mesa podem exigir que as cartas sejam reveladas.'},
  {type:'content',title:'AÇÃO VERBAL E FICHAS',text:'Declarações verbais e a forma de colocar fichas no pote podem ser vinculantes. Falar com clareza e agir corretamente evita dúvidas e decisões do floor.'},
  {type:'scene',title:'DEALER E FLOOR',text:'O dealer conduz a mão e controla o fluxo da mesa. O floor resolve dúvidas, interpreta regras e toma decisões quando surge uma situação fora do procedimento normal.'},
  {type:'content',title:'MISDEAL',text:'Misdeal é uma distribuição inválida. Quando ocorre, a mão pode ser interrompida e redistribuída conforme as regras da casa ou do torneio.'},
  {type:'content',title:'ETIQUETA NA MESA',text:'Aja na sua vez, mantenha suas cartas protegidas, não comente uma mão em andamento e respeite jogadores e equipe. Boa etiqueta melhora o ritmo e evita interferências.'},
  {type:'summary',title:'O QUE VOCÊ PRECISA LEVAR',items:['Reconhecer a força das mãos.','Entender posições, blinds e streets.','Acompanhar a ordem das ações.','Conhecer as ações básicas.','Saber como showdown, muck e procedimentos funcionam.','Respeitar a etiqueta e a equipe da mesa.'],host:'Com essa estrutura na cabeça, você já consegue acompanhar uma mão sem se perder.'}
];

export const rulesGroups=[
  {
    id:'structure',
    title:'ESTRUTURA DA MÃO',
    description:'Mãos, posições, blinds e streets.',
    sections:[
      {type:'content',title:'RANKING DE MÃOS',text:'As combinações têm uma ordem de força. Saber reconhecer pares, dois pares, trinca, sequência, flush, full house, quadra, straight flush e royal flush é a base para identificar quem vence no showdown.'},
      {type:'scene',title:'POSIÇÕES NA MESA',text:'A posição indica quando cada jogador age. Button, blinds e demais posições definem a ordem das decisões e a quantidade de informação disponível antes de agir.'},
      {type:'compare',title:'BLINDS E ANTE',leftTitle:'BLINDS',leftText:'Small Blind e Big Blind são apostas obrigatórias que iniciam a disputa pelo pote.',rightTitle:'ANTE',rightText:'Em algumas estruturas, todos ou parte dos jogadores colocam uma pequena aposta adicional antes da mão começar.'},
      {type:'steps',title:'AS STREETS',items:['PRÉ-FLOP — decisões antes das cartas comunitárias.','FLOP — três cartas comunitárias aparecem.','TURN — a quarta carta comunitária é revelada.','RIVER — a quinta e última carta comunitária aparece.']}
    ]
  },
  {
    id:'actions',
    title:'AÇÕES E FLUXO',
    description:'Ordem das decisões e ações básicas.',
    sections:[
      {type:'steps',title:'SEQUÊNCIA DAS AÇÕES',items:['Identifique quem deve agir primeiro.','Acompanhe check, bet, call, raise ou fold.','Espere sua vez de agir.','A rodada termina quando as apostas estão igualadas ou todos, menos um, desistiram.']},
      {type:'content',title:'CHECK, BET, CALL, RAISE E FOLD',text:'Check passa a ação sem apostar quando permitido. Bet inicia uma aposta. Call iguala uma aposta. Raise aumenta o valor. Fold abandona a mão.'},
      {type:'content',title:'SHOWDOWN',text:'Quando dois ou mais jogadores chegam ao final da mão, as cartas são comparadas. A melhor combinação válida leva o pote, salvo situações de empate.'},
      {type:'host',eyebrow:'POKERINNO EXPLICA',title:'ACOMPANHE A AÇÃO',text:'Entender quem age, quanto foi apostado e o que ainda pode acontecer evita boa parte da confusão de quem está começando.',host:'Antes de pensar na sua jogada, descubra exatamente onde a ação está.'}
    ]
  },
  {
    id:'procedures',
    title:'PROCEDIMENTOS DE MESA',
    description:'Muck, fichas, dealer, floor e misdeal.',
    sections:[
      {type:'content',title:'MUCK',text:'Muck é descartar a mão sem mostrá-la quando isso é permitido. Em determinadas situações, as regras da mesa podem exigir que as cartas sejam reveladas.'},
      {type:'content',title:'AÇÃO VERBAL E FICHAS',text:'Declarações verbais e a forma de colocar fichas no pote podem ser vinculantes. Falar com clareza e agir corretamente evita dúvidas e decisões do floor.'},
      {type:'scene',title:'DEALER E FLOOR',text:'O dealer conduz a mão e controla o fluxo da mesa. O floor resolve dúvidas, interpreta regras e toma decisões quando surge uma situação fora do procedimento normal.'},
      {type:'content',title:'MISDEAL',text:'Misdeal é uma distribuição inválida. Quando ocorre, a mão pode ser interrompida e redistribuída conforme as regras da casa ou do torneio.'}
    ]
  },
  {
    id:'etiquette',
    title:'ETIQUETA',
    description:'Comportamento e boas práticas na mesa.',
    sections:[
      {type:'content',title:'AJA NA SUA VEZ',text:'Espere a ação chegar até você antes de falar, apostar ou abandonar a mão.'},
      {type:'content',title:'PROTEJA SUAS CARTAS',text:'Mantenha suas cartas sob controle e evite que sejam recolhidas ou expostas acidentalmente.'},
      {type:'content',title:'NÃO INTERFIRA NA MÃO',text:'Não revele cartas, não comente decisões e não forneça informações enquanto uma mão estiver em andamento.'},
      {type:'content',title:'RESPEITE A MESA',text:'Trate jogadores, dealer e equipe com respeito. Clareza, ritmo e boa convivência fazem parte do jogo.'},
      {type:'summary',title:'REGRAS DE CONVIVÊNCIA',items:['Espere sua vez.','Proteja suas cartas.','Não interfira em mãos alheias.','Seja claro nas ações.','Respeite jogadores e equipe.'],host:'Boa etiqueta também é parte de jogar bem.'}
    ]
  }
];
