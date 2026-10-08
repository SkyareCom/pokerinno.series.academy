export const chapters=[['discover','Descobrir o jogo','Primeiro contato com o poker.'],['rules','Conhecer as regras','Regras, termos e dinâmica.'],['decisions','Entender as decisões','Observe, decida e aja.'],['formats','Explorar modalidades','Conheça outras modalidades.'],['practice','Preparar-se para a mesa','Pratique o básico e comece a jogar.']].map(([id,title,description],i)=>({id,title,description,order:i+1,lessons:[]}));
export const emptyAdapter={async load(){return {user:null,chapters,modalities:[],challenges:[],results:[],achievements:[],progress:[]}}};
export async function loadAcademy(adapter=emptyAdapter){try{return {status:'ready',data:await adapter.load(),error:null}}catch{return {status:'error',data:null,error:'Não foi possível carregar sua jornada.'}}}

export const discoverLessons=[
  {
    id:'intro',
    title:'INTRODUÇÃO AO POKER',
    description:'Objetivo, decisões e essência do jogo.',
    blocks:[
      ['O QUE É POKER','Poker é uma família de jogos de cartas em que jogadores disputam potes tomando decisões com informação incompleta. Cartas, apostas e leitura da situação se combinam a cada mão.'],
      ['O OBJETIVO','O objetivo imediato é conquistar o pote. Isso pode acontecer mostrando a melhor mão quando há showdown ou fazendo os adversários desistirem antes dele.'],
      ['DECISÕES, NÃO APENAS CARTAS','As cartas importam, mas o poker também envolve posição, tamanho das apostas, comportamento dos adversários, risco e recompensa. A mesma mão pode exigir decisões diferentes em situações diferentes.'],
      ['HABILIDADE E VARIÂNCIA','No curto prazo, a distribuição das cartas cria variação nos resultados. Ao longo de muitas decisões, conhecimento, disciplina e qualidade das escolhas ganham importância.']
    ]
  },
  {
    id:'history',
    title:'UM POUCO DE HISTÓRIA',
    description:'Das primeiras mesas ao poker moderno.',
    blocks:[
      ['ORIGENS','As origens exatas do poker são debatidas. Jogos de cartas europeus e práticas de aposta do século XIX contribuíram para a formação do jogo que passou a ser conhecido como poker nos Estados Unidos.'],
      ['EXPANSÃO','Durante o século XIX, o poker se espalhou pelos Estados Unidos e ganhou novas formas de distribuição, apostas e construção de mãos. Draw e Stud se tornaram referências importantes.'],
      ['TEXAS HOLD’EM','O Texas Hold’em surgiu no Texas e ganhou força em Las Vegas no século XX. A combinação de cartas próprias com cartas comunitárias ajudou a transformar a modalidade em uma das mais populares do mundo.'],
      ['TORNEIOS E INTERNET','A World Series of Poker começou em 1970. Décadas depois, o poker online ampliou o acesso ao jogo e acelerou sua popularização internacional.'],
      ['POKER ATUAL','Hoje o poker reúne cash games, torneios e inúmeras variantes, tanto ao vivo quanto online, com comunidades, circuitos e competições em diversos países.']
    ]
  },
  {
    id:'types',
    title:'TIPOS DE JOGOS',
    description:'Conheça as principais famílias do poker.',
    blocks:[
      ['CARTAS COMUNITÁRIAS','Jogadores combinam cartas próprias com cartas abertas na mesa. Texas Hold’em e Omaha são os principais exemplos.'],
      ['DRAW','Cada jogador recebe sua própria mão e pode trocar cartas em determinadas etapas. O 5-Card Draw é o exemplo mais conhecido.'],
      ['STUD','Não há um board comunitário como no Hold’em. Cada jogador recebe cartas próprias, algumas abertas e outras fechadas.'],
      ['LOWBALL E HIGH-LOW','Algumas variantes premiam a mão mais baixa; outras dividem o pote entre mãos altas e baixas quando os critérios são atendidos.'],
      ['MIXED GAMES','Várias modalidades são alternadas em uma mesma sessão ou competição. H.O.R.S.E. é um exemplo clássico.'],
      ['CASH GAME E TORNEIO','Além da modalidade, o poker pode ser disputado em cash game, com fichas ligadas diretamente ao valor em jogo, ou em torneios, com stacks e estrutura competitiva própria.']
    ]
  }
];
