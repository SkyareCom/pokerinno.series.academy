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
    description:'Conheça formatos e modalidades.',
    blocks:[
      ['JOGADORES X CASA','Na maior parte das modalidades tradicionais, os jogadores competem entre si e a casa apenas organiza o jogo e cobra sua taxa. Em algumas modalidades de cassino, o jogador compete diretamente contra a casa.'],
      ['CASH GAME','As fichas representam valor de jogo diretamente, os blinds costumam ser estáveis e o jogador pode entrar ou sair conforme as regras da mesa.'],
      ['TORNEIO','Os jogadores começam com um stack definido, os blinds aumentam ao longo do tempo e a disputa continua até a definição das colocações.'],
      ['CASH GAME X TORNEIO','A modalidade pode ser a mesma, mas a estrutura muda. Cash game prioriza fichas com valor direto; torneios priorizam sobrevivência, progressão e colocação.'],
      ['CARTAS COMUNITÁRIAS','Jogadores combinam cartas próprias com cartas abertas na mesa. Texas Hold’em e Omaha são os principais exemplos.'],
      ['DRAW','Cada jogador recebe sua própria mão e pode trocar cartas em determinadas etapas. O 5-Card Draw é o exemplo mais conhecido.'],
      ['STUD','Não há um board comunitário como no Hold’em. Cada jogador recebe cartas próprias, algumas abertas e outras fechadas.'],
      ['LOWBALL E HIGH-LOW','Algumas variantes premiam a mão mais baixa; outras dividem o pote entre mãos altas e baixas quando os critérios são atendidos.'],
      ['MIXED GAMES','Várias modalidades são alternadas em uma mesma sessão ou competição. H.O.R.S.E. é um exemplo clássico.']
    ]
  }
];
