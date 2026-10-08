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
