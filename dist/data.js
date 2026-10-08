export const chapters=[
['discover','Descobrir o jogo','Primeiro contato com o poker.'],
['rules','Conceitos básicos','Estrutura e fluxo de uma mão.'],
['terms','Terminologia do poker','Termos e significados usados no jogo.'],
['betting','Apostas e all-in','Valores, raises e potes.'],
['math','Matemática do poker','Odds, equity, outs e valor esperado.'],
['dealing','Erros e correções','Distribuição e cartas incorretas.'],
['floor','Floor e conduta','Conflitos, decisões e penalidades.'],
['decisions','Entender as decisões','Observe, decida e aja.'],
['formats','Explorar modalidades','Conheça outras modalidades.'],
['practice','Preparar-se para a mesa','Pratique o básico e comece a jogar.']
].map(([id,title,description],i)=>({id,title,description,order:i+1,lessons:[]}));
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
      {type:'content',title:'RANKING DE MÃOS',text:'As combinações seguem uma ordem de força: carta alta, par, dois pares, trinca, sequência, flush, full house, quadra, straight flush e royal flush.'},
      {type:'content',title:'EMPATES E KICKERS',text:'Quando dois jogadores têm a mesma categoria de mão, cartas de desempate podem decidir o pote. Se as cinco melhores cartas forem idênticas, o pote é dividido.'},
      {type:'scene',title:'POSIÇÕES NA MESA',text:'Button, Small Blind, Big Blind e demais posições determinam a ordem da ação e quanta informação cada jogador possui antes de agir.'},
      {type:'content',title:'BUTTON E BLINDS',text:'O Button marca a posição de referência. À esquerda ficam Small Blind e Big Blind, que colocam apostas obrigatórias antes da ação começar.'},
      {type:'compare',title:'BLINDS E ANTE',leftTitle:'BLINDS',leftText:'Small Blind e Big Blind criam o pote inicial e obrigam a ação.',rightTitle:'ANTE',rightText:'Algumas estruturas adicionam uma contribuição obrigatória antes da mão, feita por todos ou por uma posição específica.'},
      {type:'content',title:'O POTE',text:'O pote reúne as fichas apostadas. Seu tamanho muda ao longo da mão e influencia decisões de risco e recompensa.'},
      {type:'steps',title:'AS STREETS',items:['PRÉ-FLOP — decisões com as cartas iniciais.','FLOP — três cartas comunitárias são reveladas.','TURN — a quarta carta comunitária aparece.','RIVER — a quinta carta comunitária é revelada.','SHOWDOWN — se houver mais de um jogador, as mãos são comparadas.']},
      {type:'content',title:'QUANDO A MÃO TERMINA ANTES',text:'Se todos os adversários desistirem, o último jogador restante recebe o pote sem precisar mostrar a mão, salvo exigência específica da regra local.'}
    ]
  },
  {
    id:'betting',
    title:'APOSTAS E ALL-IN',
    description:'Valores mínimos, raises, all-ins e potes laterais.',
    sections:[
      {type:'host',eyebrow:'POKERINNO EXPLICA',title:'QUANTO É UMA APOSTA VÁLIDA?',text:'Aposta e aumento têm valores mínimos. Um all-in menor que o mínimo pode mudar quem ainda pode aumentar.',host:'Não olhe apenas para o total. Compare com a aposta anterior e com o tamanho do último aumento válido.'},
      {type:'content',title:'APOSTA MÍNIMA',text:'Em jogos no-limit e pot-limit, a primeira aposta de uma rodada normalmente deve ser pelo menos o valor do big blind vigente, salvo regra específica da estrutura.'},
      {type:'content',title:'RAISE MÍNIMO',text:'Um raise completo normalmente precisa aumentar pelo menos o mesmo valor do último aumento completo. O valor exato depende da sequência de apostas da rodada.'},
      {type:'content',title:'ALL-IN ABAIXO DO RAISE MÍNIMO',text:'Um jogador pode ir all-in por menos que um raise mínimo completo. Esse aumento pode ser válido como all-in, mas não necessariamente reabre a ação para quem já agiu.'},
      {type:'content',title:'AÇÃO NÃO REABERTA',text:'Se o all-in não constitui um aumento completo, jogadores que já completaram sua ação podem ficar impedidos de aumentar novamente. Eles normalmente podem apenas pagar ou desistir, conforme a regra aplicada.'},
      {type:'content',title:'MÚLTIPLOS ALL-INS CURTOS',text:'Mais de um all-in curto pode, em algumas regras, somar aumentos suficientes para reabrir a ação. Esse é um caso típico para confirmação do dealer ou floor.'},
      {type:'content',title:'ALL-IN MAIOR QUE O MÍNIMO',text:'Se o valor do all-in representa um aumento completo, a ação é reaberta normalmente para os jogadores ainda ativos.'},
      {type:'content',title:'APOSTA COM UMA FICHA GRANDE',text:'Sem anúncio verbal, colocar uma única ficha de valor maior diante de uma aposta pode ser interpretado apenas como call em muitas regras ao vivo.'},
      {type:'content',title:'APOSTA DE VALOR INCORRETO',text:'Se um jogador coloca fichas em quantidade insuficiente ou excessiva, o dealer deve interromper a ação antes que outros jogadores ajam e aplicar a interpretação prevista pela regra local.'},
      {type:'content',title:'STRING BET E STRING RAISE',text:'Colocar fichas em várias etapas sem declarar previamente a intenção pode invalidar parte do aumento. Anunciar o valor antes de mover as fichas evita dúvida.'},
      {type:'content',title:'POTE PRINCIPAL E SIDE POTS',text:'Quando stacks são diferentes, cada jogador só disputa o valor que conseguiu cobrir. O excedente forma um ou mais side pots entre os jogadores elegíveis.'},
      {type:'content',title:'APOSTA FORA DA VEZ',text:'Uma aposta feita fora da vez pode ser vinculante ou não dependendo de como a ação anterior se modifica. O floor pode ser chamado quando a situação altera decisões posteriores.'}
    ]
  },
  {
    id:'actions',
    title:'AÇÕES E FLUXO',
    description:'Ordem, decisões e fechamento de cada rodada.',
    sections:[
      {type:'steps',title:'ORDEM DA AÇÃO',items:['Identifique a street atual.','Veja quem deve agir primeiro.','Acompanhe cada ação até chegar em você.','Confirme o valor atual da aposta.','A rodada termina quando todos os jogadores ativos completam a ação necessária.']},
      {type:'content',title:'CHECK',text:'Check passa a ação sem apostar quando não existe valor pendente para igualar.'},
      {type:'content',title:'BET',text:'Bet inicia uma aposta em uma rodada na qual ninguém apostou ainda.'},
      {type:'content',title:'CALL',text:'Call iguala o valor necessário para permanecer na mão.'},
      {type:'content',title:'RAISE',text:'Raise aumenta uma aposta existente e cria um novo valor a ser respondido pelos jogadores ainda ativos.'},
      {type:'content',title:'FOLD',text:'Fold abandona a mão. O jogador perde o direito ao pote e qualquer valor já investido permanece nele.'},
      {type:'content',title:'ALL-IN',text:'All-in coloca todas as fichas disponíveis do jogador em risco naquela mão.'},
      {type:'content',title:'AÇÃO FORA DA VEZ',text:'Agir antes da sua vez pode influenciar outros jogadores e gerar correção ou penalidade. O correto é aguardar a ação chegar.'},
      {type:'content',title:'AÇÃO SUBSTANCIAL',text:'Depois que uma quantidade suficiente de ações posteriores ocorre, alguns erros anteriores podem deixar de ser totalmente reversíveis. Esse é outro cenário comum para decisão do floor.'},
      {type:'content',title:'SHOWDOWN',text:'Ao final da última rodada, as mãos elegíveis são comparadas. A melhor mão válida leva o pote ou ele é dividido em caso de empate.'}
    ]
  },
  {
    id:'dealing',
    title:'ERROS DE DISTRIBUIÇÃO',
    description:'Pré-flop, flop, turn, river e cartas incorretas.',
    sections:[
      {type:'host',eyebrow:'POKERINNO EXPLICA',title:'QUANDO AS CARTAS SAEM ERRADO',text:'Nem todo erro de distribuição tem a mesma solução. O momento em que ele é percebido muda completamente o procedimento.',host:'Quanto mais cedo o erro é identificado, mais simples costuma ser a correção.'},
      {type:'content',title:'PRÉ-FLOP DISTRIBUÍDO ERRADO',text:'Cartas faltando, cartas extras, ordem incorreta ou exposição indevida no início podem resultar em misdeal se o erro estiver dentro dos critérios previstos pela regra. Se ação substancial já ocorreu, a solução pode ser diferente.'},
      {type:'content',title:'JOGADOR SEM CARTAS OU COM CARTAS A MAIS',text:'Se um jogador recebe número incorreto de cartas, a mão pode ser declarada morta ou a distribuição pode ser corrigida, dependendo do momento em que o problema é percebido e da regra usada.'},
      {type:'content',title:'CARTA EXPOSTA NO PRÉ-FLOP',text:'Uma carta exposta pelo dealer pode ser substituída conforme o procedimento da modalidade. Exposição causada pelo próprio jogador costuma ter tratamento diferente.'},
      {type:'content',title:'FLOP COM NÚMERO ERRADO DE CARTAS',text:'Um flop com duas, quatro ou mais cartas é uma irregularidade. O dealer deve parar a ação imediatamente e chamar o floor quando a correção não for óbvia.'},
      {type:'content',title:'FLOP ERRADO',text:'Se o flop foi retirado do baralho de maneira incorreta ou antes da hora, o procedimento busca preservar ao máximo a aleatoriedade restante. A solução varia conforme a regra adotada.'},
      {type:'content',title:'TURN PREMATURO',text:'Se o turn é aberto antes de todos completarem a ação do flop, a carta não deve simplesmente permanecer em jogo. O floor pode determinar sua retirada temporária e a reconstrução correta da sequência.'},
      {type:'content',title:'RIVER PREMATURO',text:'O mesmo princípio se aplica ao river aberto antes da hora: interromper a mão, preservar as cartas e seguir o procedimento previsto para restaurar a ordem correta.'},
      {type:'content',title:'TURN OU RIVER INCORRETO',text:'Quando uma carta comunitária é revelada de forma errada, a correção procura preservar as cartas que ainda deveriam estar aleatórias e evitar escolher manualmente um resultado.'},
      {type:'content',title:'CARTAS A MAIS NO BOARD',text:'Se aparecem cartas comunitárias extras, ninguém deve escolher qual retirar. O dealer e o floor aplicam o procedimento definido para reconstruir o board.'},
      {type:'content',title:'BARALHO CONTAMINADO OU CARTA ESTRANHA',text:'Se surge uma carta incompatível com o baralho em uso, duplicada de forma impossível ou pertencente a outro deck, a mão deve ser interrompida para investigação do floor.'}
    ]
  },
  {
    id:'procedures',
    title:'PROCEDIMENTOS DE MESA',
    description:'Cartas, fichas, dealer, floor e situações especiais.',
    sections:[
      {type:'content',title:'PROTEÇÃO DAS CARTAS',text:'O jogador é responsável por manter suas cartas identificáveis e protegidas. Cartas recolhidas acidentalmente podem ser consideradas mortas dependendo da situação.'},
      {type:'content',title:'MUCK',text:'Muck é descartar as cartas sem mostrá-las quando permitido. Depois que uma mão não pode mais ser identificada com segurança, normalmente ela não retorna ao jogo.'},
      {type:'content',title:'AÇÃO VERBAL',text:'Declarações claras como call, raise ou fold podem ser vinculantes. Frases ambíguas devem ser evitadas.'},
      {type:'content',title:'MOVIMENTO DE FICHAS',text:'A forma de colocar fichas no pote também comunica uma ação. O jogador deve anunciar a intenção quando houver possibilidade de interpretação.'},
      {type:'scene',title:'DEALER',text:'O dealer distribui cartas, acompanha a ordem, organiza o pote e chama o floor quando surge uma situação que exige decisão.'},
      {type:'scene',title:'FLOOR',text:'O floor interpreta regras, resolve disputas, corrige irregularidades e pode aplicar penalidades. A decisão pode considerar a regra escrita, a sequência da ação e a integridade do jogo.'},
      {type:'content',title:'DEAD HAND',text:'Uma mão pode ser declarada morta em situações específicas, como descarte irreversível, cartas não recuperáveis ou determinadas violações de procedimento.'},
      {type:'content',title:'SIDE POT',text:'Valores que excedem o all-in de um jogador formam potes laterais separados. A elegibilidade deve ser controlada corretamente.'}
    ]
  },
  {
    id:'floor',
    title:'QUANDO CHAMAR O FLOOR',
    description:'Conflitos, erros, decisões e formas de resolver.',
    sections:[
      {type:'host',eyebrow:'POKERINNO ORIENTA',title:'PARE A AÇÃO E CHAME O FLOOR',text:'Quando há dúvida real sobre regra, valor, ordem ou integridade da mão, continuar jogando pode tornar a correção mais difícil.',host:'Não tente resolver uma disputa importante discutindo na mesa. Preserve as cartas e chame o floor.'},
      {type:'content',title:'APOSTA CONTESTADA',text:'Chame o floor quando jogadores discordam sobre o valor anunciado, quantidade de fichas, se houve call ou raise, ou se a ação reabriu.'},
      {type:'content',title:'AÇÃO FORA DA VEZ COM IMPACTO',text:'Se alguém age fora da vez e jogadores posteriores reagem, o floor pode precisar decidir quais ações permanecem válidas.'},
      {type:'content',title:'DÚVIDA SOBRE ALL-IN MÍNIMO',text:'Quando um all-in é menor que o raise mínimo e há dúvida se a ação foi reaberta, o floor deve confirmar quem ainda pode aumentar.'},
      {type:'content',title:'ERRO NO BOARD',text:'Flop, turn ou river incorretos, prematuros ou com cartas extras devem ser interrompidos antes que novas decisões sejam tomadas.'},
      {type:'content',title:'MÃO POSSIVELMENTE MORTA',text:'Se há discussão sobre muck, cartas misturadas, cartas recolhidas ou número incorreto de cartas, preserve tudo que ainda puder ser identificado e chame o floor.'},
      {type:'content',title:'POTE OU SIDE POT INCORRETO',text:'Se valores foram colocados no pote errado ou jogadores não concordam sobre elegibilidade, pare a distribuição do pote até a conferência.'},
      {type:'content',title:'SHOWDOWN CONTESTADO',text:'Quando existe dúvida sobre leitura da mão, ordem de exposição ou direito ao pote, o dealer deve manter as cartas e pedir decisão antes de empurrar as fichas.'},
      {type:'content',title:'COMPORTAMENTO INADEQUADO',text:'Ofensas, ameaças, colaboração indevida, exposição intencional de cartas, atraso deliberado ou qualquer comportamento que afete a integridade do jogo pode exigir intervenção.'},
      {type:'steps',title:'COMO RESOLVER UMA SITUAÇÃO',items:['Pare a ação assim que o problema for percebido.','Não misture cartas nem mova fichas desnecessariamente.','Explique ao dealer exatamente o que aconteceu.','Mantenha as versões dos jogadores separadas quando houver discordância.','Chame o floor quando a solução não for puramente mecânica.','Aplique a decisão e só então retome a mão.']},
      {type:'content',title:'REGRA DA CASA PREVALECE',text:'Procedimentos podem variar entre cassinos, clubes e torneios. Em jogo ao vivo, a decisão final pertence à autoridade responsável pela mesa conforme as regras vigentes no evento.'}
    ]
  },
  {
    id:'etiquette',
    title:'ETIQUETA E PENALIDADES',
    description:'Comportamento, infrações e consequências possíveis.',
    sections:[
      {type:'host',eyebrow:'POKERINNO LEMBRA',title:'COMPORTAMENTO TAMBÉM TEM REGRA',text:'Etiqueta protege o ritmo e a convivência. Quando o comportamento afeta a integridade do jogo, pode deixar de ser apenas etiqueta e virar infração.',host:'Respeito e clareza evitam boa parte dos problemas de mesa.'},
      {type:'content',title:'AJA NA SUA VEZ',text:'Ações antecipadas podem fornecer informação e alterar decisões. Reincidência pode gerar advertência ou penalidade.'},
      {type:'content',title:'NÃO MOSTRE CARTAS DURANTE A AÇÃO',text:'Expor cartas enquanto outros ainda decidem pode prejudicar a mão e, se intencional ou recorrente, pode levar a penalidades.'},
      {type:'content',title:'NÃO COMENTE A MÃO',text:'Não sugira ações, revele leituras ou indique o que um jogador deveria fazer enquanto a mão está em andamento.'},
      {type:'content',title:'ONE PLAYER TO A HAND',text:'Cada jogador deve tomar suas próprias decisões. Ajuda externa durante a mão não é permitida.'},
      {type:'content',title:'LINGUAGEM ABUSIVA OU AMEAÇAS',text:'Ofensas, intimidação e ameaças podem levar a advertência, afastamento temporário ou remoção do jogo, conforme gravidade e regra local.'},
      {type:'content',title:'ATRASO DELIBERADO',text:'Demorar sem necessidade de forma repetida pode ser tratado como conduta inadequada e receber intervenção do floor.'},
      {type:'content',title:'COLUSÃO E CHIP DUMPING',text:'Combinar ações, transferir fichas intencionalmente ou cooperar para prejudicar outros jogadores compromete a integridade do jogo e pode levar à desclassificação ou expulsão.'},
      {type:'content',title:'USO INDEVIDO DE DISPOSITIVOS',text:'Celulares, fones e outros dispositivos podem ter restrições durante mãos ou torneios. O uso proibido pode resultar em advertência ou penalidade.'},
      {type:'content',title:'PUNIÇÕES POSSÍVEIS',text:'Dependendo da regra e da gravidade, podem existir aviso verbal, advertência formal, mão morta, perda de órbitas ou mãos, afastamento temporário, desclassificação ou remoção do local.'},
      {type:'content',title:'PENALIDADE NÃO MUDA O RESULTADO AUTOMATICAMENTE',text:'Uma penalidade disciplinar e a resolução técnica de uma mão são coisas diferentes. O floor pode corrigir a mão e aplicar uma penalidade separadamente.'},
      {type:'summary',title:'REGRA PRÁTICA',items:['Pare quando houver dúvida.','Não altere cartas ou fichas antes da decisão.','Explique o fato, não a opinião.','Deixe dealer e floor aplicarem o procedimento.','Aceite que regras locais podem variar.'],host:'Resolver bem uma irregularidade é preservar o jogo, não vencer uma discussão.'}
    ]
  }
];


export const rulesBasicSections=[
  {type:'host',eyebrow:'POKERINNO EXPLICA',title:'A LINGUAGEM DO POKER',text:'Antes de avançar para apostas e situações especiais, aprenda os conceitos e palavras que aparecem o tempo todo na mesa.',host:'Quando você entende os termos, começa a acompanhar a mão sem se perder.'},
  {type:'content',title:'RANKING E EMPATES',text:'Reconheça a força das mãos e use kickers quando a categoria for igual.'},
  {type:'scene',title:'POSIÇÕES E BLINDS',text:'Button, Small Blind e Big Blind são referências básicas para posição e ordem de ação.'},
  {type:'steps',title:'STREETS',items:['PRÉ-FLOP — antes das cartas comunitárias.','FLOP — três cartas comunitárias.','TURN — quarta carta comunitária.','RIVER — quinta carta comunitária.','SHOWDOWN — comparação final das mãos.']},
  {type:'content',title:'AÇÕES BÁSICAS',text:'Check, bet, call, raise e fold formam o vocabulário principal de cada rodada.'},
  {type:'content',title:'TERMINOLOGIAS ESSENCIAIS',text:'Pote é o total em disputa. Stack é a quantidade de fichas do jogador. Board são as cartas comunitárias. Hole cards são as cartas fechadas do jogador. Dealer conduz a mão. Button marca a posição de referência.'},
  {type:'content',title:'TERMOS DE APOSTA',text:'Bet é aposta, call é pagar, raise é aumentar, fold é desistir, all-in é colocar todas as fichas disponíveis e action é a sequência de decisões da mão.'},
  {type:'content',title:'TERMOS DE MESA',text:'Muck é descartar sem mostrar quando permitido. Showdown é a abertura das mãos no final. Pot odds, side pot, ante, blinds e posição serão aprofundados nos capítulos seguintes.'},
  {type:'content',title:'FIM DA MÃO',text:'A mão termina quando todos desistem, exceto um jogador, ou quando ocorre o showdown.'},
  {type:'summary',title:'ESSENCIAL',items:['Reconheça a força das mãos.','Entenda posições e streets.','Aprenda as ações básicas.','Familiarize-se com os principais termos da mesa.']}
];

export const bettingSections=[
  {type:'content',title:'APOSTA MÍNIMA',text:'A aposta inicial deve respeitar o mínimo previsto pela estrutura do jogo.'},
  {type:'content',title:'RAISE MÍNIMO',text:'Um aumento completo precisa respeitar o tamanho mínimo definido pelo último aumento válido.'},
  {type:'content',title:'ALL-IN CURTO',text:'Um all-in abaixo do raise mínimo pode ser válido sem necessariamente reabrir a ação para quem já agiu.'},
  {type:'content',title:'AÇÃO REABERTA OU BLOQUEADA',text:'Quando houver dúvida se um all-in reabre a ação, dealer ou floor deve confirmar antes da próxima decisão.'},
  {type:'content',title:'FICHA GRANDE E STRING BET',text:'Uma única ficha grande ou fichas colocadas em etapas podem ter interpretação específica. Anunciar a ação evita dúvida.'},
  {type:'content',title:'SIDE POTS',text:'Stacks diferentes podem gerar pote principal e potes laterais entre jogadores elegíveis.'}
];

export const dealingSections=[
  {type:'content',title:'PRÉ-FLOP INCORRETO',text:'Cartas faltando, extras, expostas ou distribuídas fora da ordem podem exigir correção ou misdeal.'},
  {type:'content',title:'FLOP INCORRETO',text:'Flop prematuro, com número errado de cartas ou retirado incorretamente exige interrupção imediata da ação.'},
  {type:'content',title:'TURN E RIVER PREMATUROS',text:'Uma carta aberta antes da conclusão da street anterior deve ser tratada pelo procedimento da regra local.'},
  {type:'content',title:'CARTAS A MAIS',text:'Cartas extras no board não devem ser removidas por escolha dos jogadores. Dealer e floor aplicam a correção prevista.'},
  {type:'content',title:'CARTA ESTRANHA OU DUPLICADA',text:'Uma carta impossível, de outro baralho ou duplicada de forma irregular exige paralisação e verificação.'},
  {type:'summary',title:'REGRA PRÁTICA',items:['Pare a ação.','Preserve cartas e fichas.','Chame o dealer ou floor antes de continuar.']}
];

export const floorSections=[
  {type:'host',eyebrow:'POKERINNO ORIENTA',title:'QUANDO CHAMAR O FLOOR',text:'Chame o floor quando houver dúvida real sobre regra, valor, ordem, cartas ou comportamento.',host:'Quanto menos a mesa mexer em cartas e fichas, mais fácil será resolver.'},
  {type:'content',title:'APOSTAS CONTESTADAS',text:'Dúvidas sobre call, raise, all-in, ação reaberta ou valor apostado podem exigir decisão do floor.'},
  {type:'content',title:'ERROS DE DISTRIBUIÇÃO',text:'Flop, turn ou river incorretos, mão com cartas a mais ou situação de misdeal podem exigir intervenção.'},
  {type:'content',title:'POTE OU SHOWDOWN',text:'Pote incorreto, side pot, mão possivelmente morta ou leitura contestada devem ser resolvidos antes de mover as fichas.'},
  {type:'content',title:'COMPORTAMENTO',text:'Ação fora da vez, exposição intencional, ofensas, ajuda externa e outras condutas inadequadas podem gerar intervenção.'},
  {type:'steps',title:'COMO RESOLVER',items:['Pare a ação.','Não misture cartas nem fichas.','Explique o que aconteceu.','Aguarde a decisão.','Só então retome a mão.']},
  {type:'content',title:'PENALIDADES POSSÍVEIS',text:'Advertência, mão morta, afastamento temporário, perda de mãos ou órbitas, desclassificação ou remoção podem ser aplicados conforme gravidade e regra local.'}
];

export const pokerTermsGroups=[
  {
    title:'MESA E ESTRUTURA',
    terms:[
      ['ACTION','A sequência de decisões e apostas de uma mão.'],
      ['ANTE','Aposta obrigatória colocada antes da mão em determinadas estruturas.'],
      ['BIG BLIND (BB)','Maior blind obrigatório e referência comum de valor.'],
      ['BLIND','Aposta obrigatória feita antes da distribuição das cartas.'],
      ['BUTTON (BTN)','Marcador que identifica a posição nominal do dealer.'],
      ['DEALER','Pessoa que distribui cartas e conduz o procedimento da mão.'],
      ['FLOOR','Responsável por decisões de regra e situações excepcionais.'],
      ['HAND','Uma mão completa, da distribuição ao encerramento.'],
      ['ORBIT','Uma volta completa do button por todas as posições da mesa.'],
      ['POT','Total de fichas ou dinheiro em disputa na mão.'],
      ['RAKE','Taxa cobrada pela casa em determinados jogos.'],
      ['SEAT','Assento ou posição física do jogador na mesa.'],
      ['SMALL BLIND (SB)','Menor blind obrigatório, normalmente à esquerda do button.'],
      ['STACK','Quantidade de fichas que um jogador possui.'],
      ['TABLE STAKES','Regra que limita o jogador às fichas disponíveis no início da mão.']
    ]
  },
  {
    title:'CARTAS E BOARD',
    terms:[
      ['BOARD','Conjunto de cartas comunitárias abertas na mesa.'],
      ['BURN CARD','Carta descartada pelo dealer antes de abrir uma street comunitária.'],
      ['COMMUNITY CARDS','Cartas comunitárias compartilhadas pelos jogadores.'],
      ['FLOP','As três primeiras cartas comunitárias.'],
      ['HOLE CARDS','Cartas fechadas pertencentes ao jogador.'],
      ['KICKER','Carta de desempate usada quando mãos têm a mesma combinação principal.'],
      ['RIVER','Quinta e última carta comunitária no Hold’em e Omaha.'],
      ['TURN','Quarta carta comunitária.'],
      ['UPCARD','Carta distribuída aberta em modalidades que utilizam cartas expostas.'],
      ['DOWNCARD','Carta distribuída fechada.']
    ]
  },
  {
    title:'AÇÕES E APOSTAS',
    terms:[
      ['ALL-IN','Colocar todas as fichas disponíveis na mão.'],
      ['BET','Iniciar uma aposta em uma rodada ainda sem aposta.'],
      ['CALL','Igualar a aposta necessária para continuar na mão.'],
      ['CHECK','Passar a ação sem apostar quando não há valor pendente.'],
      ['FOLD','Desistir da mão.'],
      ['RAISE','Aumentar uma aposta já existente.'],
      ['RE-RAISE','Novo aumento após um raise.'],
      ['3-BET','Segundo aumento de uma sequência de apostas.'],
      ['4-BET','Terceiro aumento de uma sequência de apostas.'],
      ['MIN-RAISE','Menor aumento completo permitido pela regra.'],
      ['OPEN','Primeira entrada voluntária no pote por aposta ou raise.'],
      ['OPEN RAISE','Primeiro raise voluntário pré-flop.'],
      ['LIMP','Entrar no pote pré-flop apenas pagando o big blind.'],
      ['OVERBET','Aposta maior que o tamanho atual do pote.'],
      ['BLOCK BET','Aposta pequena usada para controlar preço ou extrair valor específico.'],
      ['DONK BET','Aposta feita antes do agressor da street anterior ter chance de agir.'],
      ['CONTINUATION BET (C-BET)','Aposta do agressor anterior na street seguinte.'],
      ['CHECK-RAISE','Dar check e depois aumentar após uma aposta adversária.'],
      ['STRING BET','Aposta ou raise feito em movimentos sucessivos sem anúncio válido.'],
      ['STRING RAISE','Raise realizado em etapas de forma irregular.'],
      ['SPLASH THE POT','Jogar fichas diretamente no pote, dificultando a conferência do valor.']
    ]
  },
  {
    title:'FLUXO DA MÃO',
    terms:[
      ['PRE-FLOP','Rodada de ação antes do flop.'],
      ['STREET','Cada etapa de apostas da mão.'],
      ['SHOWDOWN','Momento em que as mãos são mostradas e comparadas.'],
      ['MUCK','Descartar cartas sem exibi-las quando permitido.'],
      ['DEAD HAND','Mão que perdeu o direito de disputar o pote.'],
      ['MISDEAL','Distribuição inválida que pode exigir nova distribuição.'],
      ['OUT OF TURN','Ação realizada fora da vez correta.'],
      ['SUBSTANTIAL ACTION','Quantidade de ação posterior que pode limitar a reversão de um erro anterior.'],
      ['HEADS-UP','Pote ou jogo disputado entre dois jogadores.'],
      ['MULTIWAY','Pote disputado por três ou mais jogadores.'],
      ['SIDE POT','Pote lateral criado quando jogadores têm stacks diferentes em all-ins.'],
      ['MAIN POT','Pote principal que inclui o valor coberto por todos os jogadores elegíveis.'],
      ['CHOP / SPLIT POT','Divisão do pote entre jogadores empatados ou conforme a modalidade.']
    ]
  },
  {
    title:'POSIÇÕES',
    terms:[
      ['EARLY POSITION (EP)','Posições que agem cedo na rodada.'],
      ['MIDDLE POSITION (MP)','Posições intermediárias da mesa.'],
      ['LATE POSITION (LP)','Posições que agem mais tarde.'],
      ['UNDER THE GUN (UTG)','Primeiro jogador a agir pré-flop em mesas com blinds.'],
      ['HIJACK (HJ)','Posição duas cadeiras antes do button em uma mesa cheia.'],
      ['CUTOFF (CO)','Posição imediatamente antes do button.'],
      ['BUTTON (BTN)','Posição do dealer nominal, geralmente uma das últimas a agir pós-flop.'],
      ['SMALL BLIND (SB)','Posição do blind pequeno.'],
      ['BIG BLIND (BB)','Posição do blind grande.'],
      ['IN POSITION (IP)','Agir depois do adversário na street.'],
      ['OUT OF POSITION (OOP)','Agir antes do adversário na street.']
    ]
  },
  {
    title:'MÃOS E TEXTURAS',
    terms:[
      ['AIR','Mão sem valor de showdown relevante e sem draw forte.'],
      ['BACKDOOR','Draw que precisa acertar cartas consecutivas em duas streets.'],
      ['DRAW','Mão que ainda pode completar uma combinação forte.'],
      ['FLUSH DRAW','Quatro cartas do mesmo naipe com possibilidade de completar flush.'],
      ['OPEN-ENDED STRAIGHT DRAW','Draw de sequência que pode completar pelas duas pontas.'],
      ['GUTSHOT','Draw de sequência que precisa de um valor interno específico.'],
      ['MADE HAND','Mão que já possui uma combinação formada.'],
      ['NUTS','Melhor mão possível naquela situação.'],
      ['SECOND NUTS','Segunda melhor mão possível.'],
      ['OVERPAIR','Par de mão maior que qualquer carta do board.'],
      ['TOP PAIR','Par formado com a carta mais alta do board.'],
      ['MIDDLE PAIR','Par formado com uma carta intermediária do board.'],
      ['BOTTOM PAIR','Par formado com a carta mais baixa do board.'],
      ['SET','Trinca formada com um pocket pair e uma carta igual no board.'],
      ['TRIPS','Trinca formada usando uma carta da mão e um par no board.'],
      ['TWO PAIR','Dois pares distintos.'],
      ['BOARD PAIRED','Board com pelo menos duas cartas do mesmo valor.'],
      ['MONOTONE','Board em que as cartas visíveis relevantes são do mesmo naipe.'],
      ['RAINBOW','Board com naipes diferentes, sem flush draw imediato entre as cartas iniciais.'],
      ['DRY BOARD','Board com poucas conexões e poucos draws.'],
      ['WET BOARD','Board conectado, com muitos draws possíveis.']
    ]
  },
  {
    title:'ESTRATÉGIA',
    terms:[
      ['BLUFF','Aposta feita principalmente para provocar folds de mãos melhores.'],
      ['SEMI-BLUFF','Bluff com uma mão que ainda pode melhorar.'],
      ['VALUE BET','Aposta feita esperando ser paga por mãos piores.'],
      ['THIN VALUE','Aposta por valor em situação de vantagem pequena.'],
      ['RANGE','Conjunto de mãos que um jogador pode ter.'],
      ['POSITION','Vantagem ou desvantagem gerada pela ordem de ação.'],
      ['BLOCKER','Carta que reduz combinações possíveis na mão adversária.'],
      ['POLARIZED RANGE','Range concentrado em mãos muito fortes e blefes.'],
      ['MERGED RANGE','Range com mãos de força mais contínua e intermediária.']
    ]
  },
  {
    title:'PERFIS E DINÂMICA',
    terms:[
      ['TIGHT','Jogador que seleciona poucas mãos para participar.'],
      ['LOOSE','Jogador que participa de muitas mãos.'],
      ['AGGRESSIVE','Jogador que aposta e aumenta com frequência.'],
      ['PASSIVE','Jogador que tende mais a pagar do que apostar ou aumentar.'],
      ['TAG','Tight-aggressive: seletivo e agressivo.'],
      ['LAG','Loose-aggressive: amplo e agressivo.'],
      ['NIT','Jogador extremamente seletivo e conservador.'],
      ['CALLING STATION','Jogador que paga muitas apostas e desiste pouco.'],
      ['MANIAC','Jogador excessivamente agressivo e de range muito amplo.'],
      ['REG','Jogador regular, frequente e geralmente experiente.'],
      ['RECREATIONAL PLAYER','Jogador que participa principalmente por lazer.'],
      ['TELL','Comportamento que pode fornecer informação sobre uma mão.'],
      ['TABLE IMAGE','Percepção que a mesa construiu sobre o estilo de um jogador.']
    ]
  },
  {
    title:'TORNEIOS E CASH GAME',
    terms:[
      ['BUY-IN','Valor necessário para entrar no jogo ou torneio.'],
      ['REBUY','Nova compra de fichas permitida em certas estruturas.'],
      ['ADD-ON','Compra adicional de fichas em momento específico do torneio.'],
      ['RE-ENTRY','Nova entrada no torneio após eliminação, quando permitida.'],
      ['FREEZEOUT','Torneio sem re-entry após a eliminação.'],
      ['LATE REGISTRATION','Período em que novas entradas ainda são aceitas após o início.'],
      ['BLIND LEVEL','Período com valores específicos de blinds e ante.'],
      ['BUBBLE','Fase imediatamente anterior à zona de premiação.'],
      ['IN THE MONEY (ITM)','Jogador já garantido na faixa de premiação.'],
      ['FINAL TABLE','Mesa final de um torneio.'],
      ['HEADS-UP','Disputa final ou mesa entre dois jogadores.'],
      ['CHIP LEADER','Jogador com maior stack em determinado momento.'],
      ['SHORT STACK','Stack pequeno em relação aos blinds ou adversários.'],
      ['DEEP STACK','Stack grande em relação aos blinds.'],
      ['CASH GAME','Jogo em que as fichas representam valor monetário direto.'],
      ['TABLE LIMIT','Limites mínimos e máximos definidos para uma mesa.']
    ]
  },
  {
    title:'PROCEDIMENTOS E CONDUTA',
    terms:[
      ['ANGLE SHOOTING','Conduta que explora ambiguidades sem necessariamente quebrar uma regra explícita.'],
      ['COLLUSION','Cooperação ilícita entre jogadores para obter vantagem.'],
      ['CHIP DUMPING','Transferência deliberada de fichas para favorecer outro jogador.'],
      ['ONE PLAYER TO A HAND','Princípio de que cada jogador deve tomar sozinho as decisões da própria mão.'],
      ['CLOCK','Pedido para limitar o tempo de decisão de um jogador.'],
      ['PENALTY','Sanção aplicada por violação de regra ou conduta.'],
      ['WARNING','Advertência por comportamento ou procedimento inadequado.'],
      ['DEAD BUTTON','Procedimento em que o button pode permanecer sem jogador para preservar blinds corretamente.'],
      ['MISSED BLIND','Blind obrigatório não pago por ausência ou mudança de posição.'],
      ['LIVE CARDS','Mão ainda válida e elegível para disputar o pote.'],
      ['EXPOSED CARD','Carta revelada acidentalmente ou de forma irregular.']
    ]
  }
];

export const mathTermsGroups=[
  {
    title:'PROBABILIDADES E CARTAS',
    terms:[
      ['OUT','Carta que pode melhorar sua mão para a combinação desejada.'],
      ['OUTS','Quantidade de cartas ainda disponíveis que podem melhorar sua mão.'],
      ['ODDS','Relação matemática entre a chance de um evento acontecer e não acontecer.'],
      ['PROBABILIDADE','Chance percentual de um evento ocorrer.'],
      ['COMBO','Uma combinação específica de cartas possíveis.'],
      ['COMBINATÓRIA','Contagem das combinações possíveis dentro de um conjunto de cartas.']
    ]
  },
  {
    title:'EQUITY E VALOR',
    terms:[
      ['EQUITY','Parcela estimada do pote correspondente à chance de vitória de uma mão ou range.'],
      ['FOLD EQUITY','Valor gerado pela possibilidade de o adversário desistir.'],
      ['EXPECTED VALUE (EV)','Valor médio esperado de uma decisão no longo prazo.'],
      ['BREAK-EVEN','Ponto em que uma decisão não ganha nem perde valor esperado.'],
      ['RISK / REWARD','Relação entre o valor arriscado e o ganho potencial.']
    ]
  },
  {
    title:'POTE E APOSTAS',
    terms:[
      ['POT ODDS','Relação entre o valor necessário para pagar e o tamanho do pote disponível.'],
      ['IMPLIED ODDS','Valor potencial futuro que pode ser ganho se a mão melhorar.'],
      ['REVERSE IMPLIED ODDS','Risco de melhorar a mão e ainda perder um pote maior.'],
      ['SPR','Stack-to-Pot Ratio: relação entre stack efetivo e tamanho do pote.'],
      ['EFFECTIVE STACK','Menor stack relevante entre os jogadores envolvidos em uma mão.']
    ]
  },
  {
    title:'REFERÊNCIAS RÁPIDAS',
    terms:[
      ['REGRA DO 2','Estimativa rápida: com uma carta por vir, multiplique os outs por aproximadamente 2 para obter uma porcentagem aproximada.'],
      ['REGRA DO 4','Estimativa rápida: com duas cartas por vir, multiplique os outs por aproximadamente 4 para obter uma porcentagem aproximada.'],
      ['PERCENTUAL DE CALL','Percentual do pote que você precisa investir para continuar na mão.'],
      ['FREQUÊNCIA','Percentual de vezes em que uma ação, mão ou evento ocorre.']
    ]
  }
];

export const pokerExtraTermsGroups=[
  {
    title:'GÍRIAS E PERFIS',
    terms:[
      ['FISH','Jogador considerado inexperiente ou que comete muitos erros. Termo informal e muitas vezes pejorativo.'],
      ['SHARK','Jogador experiente e tecnicamente forte.'],
      ['WHALE','Jogador recreativo que costuma movimentar valores altos.'],
      ['NIT','Jogador extremamente seletivo e conservador.'],
      ['MANIAC','Jogador muito agressivo e de range bastante amplo.'],
      ['CALLING STATION','Jogador que paga muitas apostas e desiste pouco.'],
      ['GRINDER','Jogador de grande volume que busca resultado consistente.'],
      ['REG','Jogador regular e frequente em determinado jogo ou limite.']
    ]
  },
  {
    title:'LINHAS E JOGADAS',
    terms:[
      ['DONK BET','Aposta feita fora de posição contra o agressor da street anterior antes que ele possa agir.'],
      ['SLOW PLAY','Jogar uma mão forte de forma passiva para esconder força e induzir ações posteriores.'],
      ['TRAP','Armadilha: linha usada para induzir o adversário a apostar ou aumentar com uma mão pior.'],
      ['CHECK-RAISE','Dar check e depois aumentar após uma aposta adversária.'],
      ['CHECK-CALL','Dar check e depois pagar uma aposta.'],
      ['CHECK-FOLD','Dar check e desistir diante de uma aposta.'],
      ['BET-FOLD','Apostar e desistir se receber um raise.'],
      ['FLOAT','Pagar uma aposta, frequentemente no flop, com intenção de disputar o pote em street posterior.'],
      ['PROBE BET','Aposta feita após o agressor anterior deixar de apostar na street precedente.'],
      ['DELAYED C-BET','Continuation bet feita uma street depois de optar por check na primeira oportunidade.'],
      ['BARREL','Apostar em streets sucessivas.'],
      ['DOUBLE BARREL','Apostar flop e turn em sequência.'],
      ['TRIPLE BARREL','Apostar flop, turn e river em sequência.'],
      ['LEAD','Apostar primeiro em uma street.'],
      ['STAB','Aposta oportunista feita quando os adversários demonstram fraqueza.'],
      ['BLOCK BET','Aposta pequena usada para controlar preço ou extrair valor específico.'],
      ['OVERBET','Aposta maior que o tamanho atual do pote.'],
      ['C-BET','Continuation bet: aposta do agressor anterior na street seguinte.']
    ]
  },
  {
    title:'SITUAÇÕES E RESULTADOS',
    terms:[
      ['BAD BEAT','Derrota de uma mão muito favorita após cartas improváveis.'],
      ['COOLER','Confronto entre mãos muito fortes em que a perda é difícil de evitar.'],
      ['SUCKOUT','Virada improvável de uma mão que estava atrás.'],
      ['RIVERED','Ser superado por uma carta decisiva no river.'],
      ['CRACKED','Quando uma mão premium acaba derrotada.'],
      ['HERO CALL','Call difícil feito acreditando que o adversário está blefando.'],
      ['HERO FOLD','Fold difícil de uma mão forte diante de ação que indica força superior.'],
      ['SNAP CALL','Call feito quase imediatamente.'],
      ['SNAP FOLD','Fold feito quase imediatamente.'],
      ['TANK','Usar bastante tempo para tomar uma decisão.'],
      ['SLOWROLL','Demorar sem necessidade para mostrar uma mão claramente vencedora no showdown.']
    ]
  },
  {
    title:'APELIDOS DE MÃOS',
    terms:[
      ['AA — POCKET ROCKETS / BULLETS','Apelidos tradicionais do par de ases.'],
      ['KK — COWBOYS','Apelido tradicional do par de reis.'],
      ['QQ — LADIES','Apelido tradicional do par de damas.'],
      ['JJ — HOOKS','Apelido tradicional do par de valetes.'],
      ['88 — SNOWMEN','Apelido do par de oito.'],
      ['22 — DUCKS / DEUCES','Apelidos do par de dois.'],
      ['AK — BIG SLICK','Apelido clássico de Ás-Rei.'],
      ['KJ — KOJAK','Apelido tradicional de Rei-Valete.'],
      ['T2 — DOYLE BRUNSON','Mão historicamente associada a Doyle Brunson.'],
      ['72 — THE HAMMER','Apelido clássico de 7-2, especialmente offsuit.'],
      ['93 — CHUCK NORRIS','Apelido usado em comunidades brasileiras para 9-3.'],
      ['95 — DOLLY PARTON','Referência ao “9 to 5”.']
    ]
  },
  {
    title:'NOTAÇÃO E ABREVIAÇÕES',
    terms:[
      ['s','Suited: cartas do mesmo naipe, como AKs.'],
      ['o','Offsuit: cartas de naipes diferentes, como AKo.'],
      ['PP','Pocket pair.'],
      ['SC','Suited connectors.'],
      ['RFI','Raise First In.'],
      ['VPIP','Frequência de entrada voluntária no pote.'],
      ['PFR','Frequência de raise pré-flop.'],
      ['WTSD','Went to Showdown.'],
      ['W$SD','Won Money at Showdown.'],
      ['AF','Aggression Factor.'],
      ['MTT','Multi-Table Tournament.'],
      ['SNG','Sit & Go.'],
      ['PKO','Progressive Knockout.'],
      ['KO','Knockout.'],
      ['ITM','In The Money.']
    ]
  }
];
