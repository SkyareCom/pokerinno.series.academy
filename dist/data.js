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
    description:'Mãos, posições, blinds, pote e streets.',
    sections:[
      {type:'host',eyebrow:'POKERINNO EXPLICA',title:'COMO UMA MÃO GANHA FORMA',text:'Antes da primeira decisão, a mesa já tem posições, apostas obrigatórias e uma ordem definida. Entender essa estrutura evita que o jogo pareça aleatório.',host:'Olhe primeiro para a estrutura. Depois, para as cartas.'},
      {type:'content',title:'RANKING DE MÃOS',text:'As combinações seguem uma ordem de força: carta alta, par, dois pares, trinca, sequência, flush, full house, quadra, straight flush e royal flush. Em empates, entram os critérios de desempate da própria combinação.'},
      {type:'content',title:'EMPATES E KICKERS',text:'Quando dois jogadores têm a mesma categoria de mão, cartas de desempate podem decidir o pote. Se as cinco melhores cartas forem idênticas para ambos, o pote é dividido.'},
      {type:'scene',title:'POSIÇÕES NA MESA',text:'Button, Small Blind, Big Blind e demais posições determinam a ordem da ação. Jogar mais tarde na rodada normalmente oferece mais informação sobre o que os outros fizeram.'},
      {type:'content',title:'BUTTON E BLINDS',text:'O Button marca a posição de referência da mão. À esquerda dele ficam Small Blind e Big Blind, que colocam apostas obrigatórias antes das cartas serem jogadas.'},
      {type:'compare',title:'BLINDS E ANTE',leftTitle:'BLINDS',leftText:'Small Blind e Big Blind criam o pote inicial e obrigam a ação a começar.',rightTitle:'ANTE',rightText:'Algumas estruturas adicionam uma contribuição obrigatória antes da mão, feita por todos ou por uma posição específica.'},
      {type:'content',title:'O POTE',text:'O pote reúne todas as fichas apostadas na mão. Seu tamanho muda a cada ação e é uma das referências para avaliar risco e recompensa.'},
      {type:'steps',title:'AS STREETS',items:['PRÉ-FLOP — decisões com as cartas iniciais.','FLOP — três cartas comunitárias são reveladas.','TURN — a quarta carta comunitária aparece.','RIVER — a quinta e última carta comunitária é revelada.','SHOWDOWN — se ainda houver mais de um jogador, as mãos são comparadas.']},
      {type:'content',title:'QUANDO A MÃO TERMINA ANTES',text:'A mão pode terminar antes do showdown se todos os adversários desistirem. Nesse caso, o último jogador restante recebe o pote sem precisar comparar cartas.'}
    ]
  },
  {
    id:'actions',
    title:'AÇÕES E FLUXO',
    description:'Ordem, apostas e decisões em cada rodada.',
    sections:[
      {type:'host',eyebrow:'POKERINNO EXPLICA',title:'ACOMPANHE A AÇÃO',text:'Grande parte dos erros de iniciante acontece por perder a ordem da mão. Primeiro descubra quem age, qual foi a última ação e quanto custa continuar.',host:'Antes de pensar na sua jogada, descubra exatamente onde a ação está.'},
      {type:'steps',title:'ORDEM DA AÇÃO',items:['Identifique a street atual.','Veja quem deve agir primeiro.','Acompanhe cada ação até chegar em você.','Confirme o valor atual da aposta.','A rodada termina quando todos os jogadores ativos completam a ação necessária.']},
      {type:'content',title:'CHECK',text:'Check passa a ação sem colocar fichas adicionais. Só é possível quando não existe uma aposta pendente para igualar.'},
      {type:'content',title:'BET',text:'Bet inicia uma aposta em uma rodada em que ninguém apostou ainda. Os adversários passam a escolher entre pagar, aumentar ou desistir.'},
      {type:'content',title:'CALL',text:'Call iguala o valor da aposta atual para permanecer na mão.'},
      {type:'content',title:'RAISE',text:'Raise aumenta uma aposta existente. Depois de um raise, os jogadores ainda ativos precisam responder ao novo valor.'},
      {type:'content',title:'FOLD',text:'Fold abandona a mão. O jogador perde qualquer valor já colocado no pote e deixa de participar das ações seguintes.'},
      {type:'content',title:'ALL-IN',text:'All-in acontece quando o jogador coloca todas as fichas disponíveis. Ele continua elegível ao pote correspondente ao valor que conseguiu cobrir.'},
      {type:'content',title:'QUANDO HÁ MAIS DE UM ALL-IN',text:'Se jogadores têm stacks diferentes, podem surgir pote principal e side pots. Cada jogador disputa apenas os potes para os quais contribuiu.'},
      {type:'content',title:'AÇÃO FORA DA VEZ',text:'Agir antes da sua vez pode interferir na mão e gerar penalidades ou decisões específicas conforme a regra aplicada. O correto é esperar a ação chegar até você.'},
      {type:'content',title:'SHOWDOWN',text:'Quando a última rodada termina com dois ou mais jogadores, as mãos são comparadas. A melhor mão válida recebe o pote, ou ele é dividido em caso de empate.'}
    ]
  },
  {
    id:'procedures',
    title:'PROCEDIMENTOS DE MESA',
    description:'Cartas, fichas, dealer, floor e situações especiais.',
    sections:[
      {type:'content',title:'PROTEÇÃO DAS CARTAS',text:'O jogador é responsável por manter suas cartas identificáveis e protegidas. Cartas recolhidas acidentalmente podem ser consideradas mortas dependendo da situação.'},
      {type:'content',title:'MUCK',text:'Muck é descartar as cartas sem mostrá-las quando isso é permitido. Depois que uma mão é descartada e não pode mais ser identificada com segurança, normalmente não volta ao jogo.'},
      {type:'content',title:'AÇÃO VERBAL',text:'Declarações claras como call, raise ou fold podem ser vinculantes. Evite frases ambíguas para não criar dúvida sobre sua intenção.'},
      {type:'content',title:'MOVIMENTO DE FICHAS',text:'A forma de colocar fichas no pote pode representar uma ação. Em muitas regras, colocar uma ficha grande sem anunciar raise pode ser interpretado apenas como call.'},
      {type:'content',title:'STRING BET',text:'Colocar fichas em várias etapas sem declarar corretamente a intenção pode ser considerado string bet. O ideal é anunciar a ação ou colocar o valor de uma só vez.'},
      {type:'scene',title:'DEALER',text:'O dealer distribui cartas, conduz a ordem da ação, organiza o pote e comunica situações da mão. Ele não decide estratégia e não deve favorecer nenhum jogador.'},
      {type:'scene',title:'FLOOR',text:'O floor é chamado quando há dúvida, disputa ou situação fora do procedimento comum. Sua função é interpretar as regras e preservar a integridade do jogo.'},
      {type:'content',title:'MISDEAL',text:'Misdeal é uma distribuição inválida detectada dentro dos critérios previstos pela regra. A mão pode ser cancelada e redistribuída.'},
      {type:'content',title:'CARTA EXPOSTA',text:'Se uma carta é exposta acidentalmente, o procedimento depende do momento e da modalidade. O dealer deve ser chamado para aplicar a regra correta.'},
      {type:'content',title:'DEAD HAND',text:'Uma mão pode ser declarada morta em situações específicas, como descarte irreversível, ação irregular grave ou descumprimento de procedimentos definidos.'},
      {type:'content',title:'SIDE POT',text:'Quando um jogador está all-in por menos fichas que os demais, valores adicionais formam potes laterais. Nem todos os jogadores participam de todos os potes.'}
    ]
  },
  {
    id:'etiquette',
    title:'ETIQUETA',
    description:'Comportamento, ritmo e convivência na mesa.',
    sections:[
      {type:'host',eyebrow:'POKERINNO LEMBRA',title:'JOGAR BEM TAMBÉM É SABER SE COMPORTAR',text:'Etiqueta não substitui regra, mas evita confusão, protege a integridade da mão e melhora a experiência de todos.',host:'Uma mesa organizada ajuda todo mundo a pensar melhor.'},
      {type:'content',title:'AJA NA SUA VEZ',text:'Espere a ação chegar até você antes de falar, apostar, mostrar cartas ou abandonar a mão.'},
      {type:'content',title:'ACOMPANHE A MÃO',text:'Preste atenção às apostas e ao andamento da rodada. Fazer a mesa repetir constantemente a ação deixa o jogo lento e aumenta o risco de erro.'},
      {type:'content',title:'PROTEJA SUAS CARTAS',text:'Mantenha suas cartas próximas e claramente sob seu controle. Um protetor de cartas pode ajudar em mesas ao vivo.'},
      {type:'content',title:'NÃO MOSTRE CARTAS DURANTE A AÇÃO',text:'Expor cartas enquanto outros jogadores ainda tomam decisões pode fornecer informação indevida e alterar o comportamento da mesa.'},
      {type:'content',title:'NÃO COMENTE UMA MÃO EM ANDAMENTO',text:'Evite analisar, sugerir ações, falar sobre possíveis mãos ou reagir de forma que revele informação enquanto a mão ainda estiver ativa.'},
      {type:'content',title:'ONE PLAYER TO A HAND',text:'Cada jogador deve tomar suas próprias decisões. Não peça nem ofereça ajuda estratégica durante uma mão em andamento.'},
      {type:'content',title:'SEJA CLARO AO APOSTAR',text:'Declare sua ação com clareza e coloque fichas de maneira organizada. Isso reduz interpretações e conflitos.'},
      {type:'content',title:'RITMO DE JOGO',text:'Pensar faz parte do poker, mas atrasos desnecessários prejudicam a mesa. Tome seu tempo quando a decisão exigir, sem transformar ações simples em demora constante.'},
      {type:'content',title:'RESPEITO',text:'Respeite adversários, dealer e equipe mesmo após perder uma mão. Ofensas, intimidação e comportamento abusivo não fazem parte de uma boa experiência de jogo.'},
      {type:'content',title:'CELULAR E DISTRAÇÕES',text:'O uso de celular pode ter restrições durante uma mão ou torneio. Siga as regras locais e evite distrações que atrasem sua ação.'},
      {type:'summary',title:'REGRAS DE CONVIVÊNCIA',items:['Espere sua vez.','Acompanhe a ação.','Proteja suas cartas.','Não revele informação.','Não interfira na decisão de outros jogadores.','Seja claro com fichas e palavras.','Respeite jogadores e equipe.'],host:'Boa etiqueta não é detalhe: ela mantém o jogo claro, justo e agradável.'}
    ]
  }
];

