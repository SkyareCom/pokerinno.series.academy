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
