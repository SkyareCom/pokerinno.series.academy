export const chapters=[['discover','Descobrir o jogo','Primeiro contato com o poker.'],['rules','Conhecer as regras','Regras, termos e dinâmica.'],['decisions','Entender as decisões','Observe, decida e aja.'],['formats','Explorar modalidades','Conheça outras modalidades.'],['practice','Preparar-se para a mesa','Pratique o básico e comece a jogar.']].map(([id,title,description],i)=>({id,title,description,order:i+1,lessons:[]}));
export const emptyAdapter={async load(){return {user:null,chapters,modalities:[],challenges:[],results:[],achievements:[],progress:[]}}};
export async function loadAcademy(adapter=emptyAdapter){try{return {status:'ready',data:await adapter.load(),error:null}}catch{return {status:'error',data:null,error:'Não foi possível carregar sua jornada.'}}}

export const discoverLessons=[
  {
    id:'intro',
    title:'INTRODUÇÃO AO POKER',
    description:'Entenda o jogo antes das regras.',
    blocks:[
      ['O QUE É POKER','Poker é uma família de jogos de cartas em que jogadores disputam potes tomando decisões com informação incompleta. Cartas, apostas e leitura da situação se combinam a cada mão.'],
      ['O OBJETIVO','O objetivo imediato é conquistar o pote. Isso pode acontecer mostrando a melhor mão quando há showdown ou fazendo os adversários desistirem antes dele.'],
      ['A MESA DE POKER','Uma mesa reúne jogadores, posições, fichas, cartas e um dealer. A posição ocupada e a ordem das ações influenciam a informação disponível em cada decisão.'],
      ['INFORMAÇÃO INCOMPLETA','Você nunca conhece todas as cartas e intenções dos adversários. As decisões são tomadas a partir do que está visível, do histórico da ação e das probabilidades.'],
      ['DECISÕES, NÃO APENAS CARTAS','As cartas importam, mas também contam posição, tamanho das apostas, comportamento dos adversários, risco e recompensa. A mesma mão pode exigir escolhas diferentes.'],
      ['HABILIDADE E VARIÂNCIA','No curto prazo, a distribuição das cartas provoca variação nos resultados. Ao longo de muitas decisões, conhecimento, disciplina e qualidade das escolhas ganham importância.'],
      ['DINÂMICA SOCIAL','Poker também envolve convivência à mesa: agir na sua vez, respeitar dealer e jogadores, proteger suas cartas e acompanhar a ação sem interferir nas decisões dos outros.']
    ]
  },
  {
    id:'history',
    title:'UM POUCO DE HISTÓRIA',
    description:'Veja como o poker evoluiu.',
    blocks:[
      ['ORIGENS','As origens exatas do poker são debatidas. Jogos de cartas europeus e práticas de aposta do século XIX contribuíram para a formação do jogo que passou a ser conhecido como poker nos Estados Unidos.'],
      ['EXPANSÃO','Durante o século XIX, o poker se espalhou pelos Estados Unidos e ganhou novas formas de distribuição, apostas e construção de mãos. Draw e Stud se tornaram referências importantes.'],
      ['TEXAS HOLD’EM','O Texas Hold’em surgiu no Texas e ganhou força em Las Vegas no século XX. A combinação de cartas próprias com cartas comunitárias ajudou a transformar a modalidade em uma das mais populares do mundo.'],
      ['TORNEIOS','A World Series of Poker começou em 1970 e ajudou a consolidar o poker competitivo e os grandes torneios.'],
      ['POKER ONLINE','Décadas depois, o poker online ampliou o acesso ao jogo e acelerou sua popularização internacional.'],
      ['POKER ATUAL','Hoje o poker reúne cash games, torneios e inúmeras variantes, tanto ao vivo quanto online, com comunidades, circuitos e competições em diversos países.']
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
      ['FORMATOS E MODALIDADES','O poker possui diferentes famílias e variantes. Aqui basta reconhecer que elas existem; as regras e características de cada uma serão estudadas nos capítulos de Modalidades.']
    ]
  }
];
