export const chapters=[
['discover','Descobrir o jogo','Primeiro contato com o poker.'],
['rules','Conceitos básicos','Estrutura e fluxo de uma mão.'],
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
  {type:'host',eyebrow:'POKERINNO APRESENTA',title:'ANTES DE PENSAR EM ESTRATÉGIA',text:'Primeiro entenda o que está acontecendo na mesa. Poker não é apenas receber cartas: é observar informação, tomar decisões e lidar com consequências.',host:'Entender a mão vem antes de tentar jogar bem.'},
  {type:'content',title:'O QUE É POKER',text:'Poker é um jogo de cartas, apostas e decisões. Você conhece apenas parte da informação: suas cartas, o board e as ações realizadas. As cartas dos adversários permanecem ocultas. Por isso, cada decisão trabalha com possibilidades, não com certezas.'},
  {type:'content',title:'QUAL É O OBJETIVO',text:'O objetivo de cada mão é conquistar o pote. Isso pode acontecer de duas formas: chegar ao showdown com a melhor combinação válida ou fazer todos os adversários desistirem antes. A consequência é importante: uma mão forte pode perder valor se ninguém pagar, e uma mão fraca pode vencer se todos foldarem.'},
  {type:'steps',title:'COMO UMA MÃO ACONTECE',items:['As apostas obrigatórias formam o pote inicial.','Os jogadores recebem suas cartas.','A ação acontece na ordem correta.','Novas cartas podem ser abertas no board.','Cada nova street cria outra rodada de decisões.','A mão termina por fold geral ou showdown.']},
  {type:'scene',title:'O QUE EXISTE NA MESA',text:'Dealer, button, blinds, jogadores, stacks, fichas, cartas e pote formam a estrutura da mão. Cada elemento tem função própria. Saber onde você está sentado, quem já agiu e quanto existe no pote muda completamente a decisão disponível.'},
  {type:'content',title:'INFORMAÇÃO INCOMPLETA',text:'Você nunca vê todas as cartas relevantes enquanto decide. Em vez de adivinhar exatamente o que o adversário possui, aprende a trabalhar com um conjunto de possibilidades. Quanto mais ações acontecem, mais informação surge e algumas possibilidades deixam de fazer sentido.'},
  {type:'compare',title:'JOGADORES X CASA',leftTitle:'POKER TRADICIONAL',leftText:'Os jogadores competem entre si. A casa organiza o jogo, fornece dealer e estrutura e pode cobrar rake ou taxa.',rightTitle:'JOGOS CONTRA A CASA',rightText:'Alguns jogos de cassino usam cartas de poker, mas a disputa é contra a casa. A lógica estratégica e as regras são diferentes.'},
  {type:'compare',title:'CASH GAME X TORNEIO',leftTitle:'CASH GAME',leftText:'As fichas representam dinheiro diretamente. O jogador pode entrar e sair conforme as regras da mesa e os blinds normalmente permanecem fixos.',rightTitle:'TORNEIO',rightText:'As fichas representam posição competitiva, não dinheiro direto. Blinds aumentam, jogadores são eliminados e a estrutura avança até as colocações finais.'},
  {type:'timeline',title:'UM POUCO DE HISTÓRIA',items:[['ORIGENS','As origens exatas são debatidas, mas o poker recebeu influência de diferentes jogos de cartas e apostas.'],['SÉCULO XIX','O jogo se consolidou nos Estados Unidos e passou a desenvolver regras e formatos reconhecíveis.'],['POKER MODERNO','Texas Hold’em, torneios e grandes eventos ajudaram a transformar o poker em competição global.'],['ERA ONLINE','A internet ampliou o acesso, acelerou o estudo estratégico e criou novas formas de jogar e treinar.']]},
  {type:'summary',title:'ANTES DE AVANÇAR',items:['Poker é um jogo de informação incompleta.','O pote pode ser ganho sem showdown.','A ordem das ações importa.','Cada decisão altera as opções futuras.','Cash game e torneio usam estruturas diferentes.'],host:'Agora você já consegue olhar para uma mesa e entender o que está acontecendo.'}
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
  {type:'host',eyebrow:'POKERINNO EXPLICA',title:'CONCEITOS QUE ORGANIZAM A MÃO',text:'Aqui você aprende a estrutura que sustenta qualquer decisão: força das mãos, posição, blinds, streets e ordem da ação.',host:'Se você souber onde está, quem age e o que está valendo, metade da confusão desaparece.'},
  {type:'content',title:'RANKING DE MÃOS',text:'A mão final é formada pelas melhores cinco cartas permitidas pela modalidade. Royal Flush e Straight Flush ficam no topo; depois vêm Quadra, Full House, Flush, Sequência, Trinca, Dois Pares, Um Par e Carta Alta. Primeiro compare a categoria. Só depois use os critérios de desempate.'},
  {type:'content',title:'EMPATES E KICKERS',text:'Quando dois jogadores têm a mesma categoria, compare as cartas que formam essa combinação. Se ainda houver igualdade, entram os kickers. Se as melhores cinco cartas forem exatamente iguais, o pote é dividido. No poker padrão, naipe não desempata mãos.'},
  {type:'scene',title:'POSIÇÕES NA MESA',text:'A posição determina quando você age. Pré-flop, a ação normalmente começa à esquerda do big blind. Pós-flop, começa no primeiro jogador ativo à esquerda do button. Agir por último oferece mais informação; agir primeiro exige decidir antes de conhecer a intenção dos adversários.'},
  {type:'content',title:'BUTTON, SMALL BLIND E BIG BLIND',text:'O button marca a posição nominal do dealer e gira a cada mão. À sua esquerda ficam Small Blind e Big Blind, que colocam apostas obrigatórias. Essas posições não existem apenas para “pagar fichas”: elas ajudam a organizar a ordem de ação e garantem que sempre exista algo no pote.'},
  {type:'steps',title:'STREETS',items:['PRÉ-FLOP — cada jogador decide usando apenas suas cartas fechadas e a ação anterior.','FLOP — três cartas comunitárias são abertas e a força relativa das mãos muda.','TURN — uma quarta carta é aberta; draws podem completar ou perder valor.','RIVER — a quinta carta é aberta; não haverá novas cartas depois dela.','SHOWDOWN — se restarem dois ou mais jogadores, as mãos válidas são comparadas.']},
  {type:'content',title:'CHECK, BET, CALL, RAISE E FOLD',text:'Check passa a ação sem apostar quando não existe valor pendente. Bet inicia uma aposta. Call iguala o valor para continuar. Raise aumenta a aposta e cria um novo preço. Fold encerra sua participação naquela mão. Cada ação muda o que os jogadores seguintes podem fazer.'},
  {type:'content',title:'O POTE E O STACK',text:'O pote é o total em disputa. Stack é a quantidade de fichas disponíveis de um jogador. Quanto menor o stack em relação ao pote, menos espaço existe para decisões futuras. Quanto maior, mais streets e tamanhos de aposta podem ser usados.'},
  {type:'content',title:'COMO A RODADA TERMINA',text:'Uma rodada de apostas só termina quando todos os jogadores ativos tiveram oportunidade de responder ao valor atual. Se todos foldam menos um, a mão termina imediatamente. Se mais de um continua após o river, ocorre showdown.'},
  {type:'summary',title:'O QUE VOCÊ PRECISA DOMINAR',items:['Reconhecer a força das mãos.','Saber quem age primeiro e quem age depois.','Entender blinds, button e pote.','Acompanhar as streets.','Distinguir check, bet, call, raise e fold.']}
];

export const bettingSections=[
  {type:'host',eyebrow:'POKERINNO EXPLICA',title:'APOSTAR É DEFINIR UM PREÇO',text:'Toda aposta oferece um preço para os outros jogadores continuarem. O valor escolhido muda quem pode pagar, quem pode aumentar e quanto do stack pode entrar no pote.',host:'Antes de olhar o número, entenda o que aquele valor está obrigando os outros a decidir.'},
  {type:'content',title:'APOSTA MÍNIMA',text:'Em no-limit e pot-limit, a primeira aposta de uma street normalmente deve respeitar pelo menos o valor do big blind vigente, salvo regra específica. Se o mínimo não for atingido, a ação pode ser corrigida pelo dealer ou floor.'},
  {type:'content',title:'RAISE MÍNIMO',text:'Um raise completo precisa aumentar pelo menos o mesmo valor do último aumento completo. Exemplo: alguém aposta 1.000 e recebe raise para 3.000. O aumento foi de 2.000; portanto, um novo raise completo precisa acrescentar pelo menos outros 2.000, chegando a 5.000.'},
  {type:'content',title:'ALL-IN MENOR QUE O RAISE MÍNIMO',text:'Um jogador pode ficar all-in sem ter fichas suficientes para completar o aumento mínimo. O all-in continua válido porque o stack acabou, mas esse aumento curto pode não reabrir a ação para jogadores que já tinham agido.'},
  {type:'content',title:'AÇÃO REABERTA OU BLOQUEADA',text:'Se o all-in não completa um raise, quem já agiu pode ficar limitado a call ou fold quando a ação retorna. Se o aumento for completo, o raise volta a ser permitido. Com vários all-ins curtos, a regra aplicada pela casa pode exigir avaliação do valor total acumulado; em dúvida, pare e confirme com o floor.'},
  {type:'content',title:'UMA FICHA GRANDE',text:'Em muitas regras ao vivo, colocar uma única ficha de valor superior diante de uma aposta, sem anunciar raise, é interpretado como call. Exemplo: aposta de 400 e o jogador coloca uma ficha de 1.000 silenciosamente; o dealer pode considerar apenas call de 400 e devolver o troco.'},
  {type:'content',title:'STRING BET E STRING RAISE',text:'Colocar fichas em movimentos separados para decidir o valor depois de observar reações pode ser irregular. O padrão seguro é anunciar claramente a ação e o valor antes de movimentar as fichas, ou colocar o montante em um único movimento.'},
  {type:'content',title:'ALL-IN E POTES LATERAIS',text:'Um jogador all-in disputa apenas o valor que conseguiu cobrir. Se outros jogadores têm stacks maiores e continuam apostando, surge um side pot. Cada pote possui seus próprios jogadores elegíveis; por isso o dealer separa os valores antes do showdown.'},
  {type:'content',title:'APOSTA FORA DA VEZ',text:'Agir antes da sua vez pode fornecer informação indevida e alterar decisões. Dependendo do que acontecer antes de a ação voltar ao jogador, a aposta fora de vez pode ser vinculante ou perder validade. Não tente “corrigir” sozinho: mantenha as fichas visíveis e chame o dealer ou floor.'},
  {type:'summary',title:'ANTES DE COLOCAR AS FICHAS',items:['Saiba qual é o valor atual.','Confirme se é bet, call ou raise.','Entenda o mínimo permitido.','Anuncie sua intenção quando houver dúvida.','Espere sua vez de agir.']}
];

export const dealingSections=[
  {type:'host',eyebrow:'POKERINNO EXPLICA',title:'ERRO DE CARTA NÃO É SEMPRE MISDEAL',text:'O tipo de erro, o momento em que ele é descoberto e a quantidade de ação já realizada determinam a solução.',host:'Primeiro preserve a situação. Depois descubra qual procedimento se aplica.'},
  {type:'content',title:'O QUE É MISDEAL',text:'Misdeal é uma distribuição inicial inválida dentro dos critérios definidos pela regra. Pode envolver jogador que deveria receber cartas e não recebeu, jogador sem direito recebendo cartas, quantidade incorreta de cartas ou exposições específicas. Quando reconhecido no tempo correto, a mão é anulada e redistribuída.'},
  {type:'content',title:'AÇÃO SUBSTANCIAL',text:'Depois que uma quantidade relevante de ações em ordem já aconteceu, alguns erros iniciais deixam de permitir que a mão inteira seja anulada. A partir desse ponto, o objetivo passa a ser corrigir o problema preservando o máximo possível da ação válida.'},
  {type:'content',title:'CARTA EXPOSTA NO PRÉ-FLOP',text:'Uma carta exposta pelo dealer não significa automaticamente misdeal. O tratamento depende de qual carta foi exposta, quando ocorreu e das regras da casa. O jogador não deve escolher uma carta substituta nem tocar no baralho para “resolver”.'},
  {type:'content',title:'JOGADOR COM CARTA A MAIS OU A MENOS',text:'Se um jogador recebe número incorreto de cartas, a solução depende do momento da descoberta. Antes de ação relevante pode haver redistribuição; depois, a mão pode ser corrigida ou declarada morta conforme a regra e a possibilidade de identificar as cartas com segurança.'},
  {type:'content',title:'FLOP INCORRETO',text:'Flop com duas, quatro ou mais cartas, flop aberto antes de a ação pré-flop terminar ou flop retirado incorretamente exige interrupção imediata. Ninguém deve escolher qual carta “fica”. O procedimento busca restaurar a aleatoriedade sem favorecer jogadores.'},
  {type:'content',title:'TURN PREMATURO',text:'Se o turn é aberto antes de a ação do flop terminar, a carta não deve simplesmente continuar valendo. O dealer preserva o baralho e chama o floor quando necessário. A correção tenta garantir que a carta futura volte a ser determinada de forma aleatória conforme o procedimento local.'},
  {type:'content',title:'RIVER PREMATURO',text:'O princípio é semelhante ao turn prematuro. A ação da street anterior deve ser concluída primeiro, e o river correto é definido pelo procedimento previsto. Jogadores não escolhem se preferem manter ou trocar a carta.'},
  {type:'content',title:'CARTAS A MAIS NO BOARD',text:'Quando cartas extras aparecem na mesa, nenhuma delas deve ser retirada por consenso entre jogadores. Isso poderia alterar aleatoriamente o resultado. O dealer interrompe a ação e aplica o procedimento oficial.'},
  {type:'content',title:'BARALHO CONTAMINADO OU CARTA IMPOSSÍVEL',text:'Carta duplicada de forma impossível, carta de outro baralho ou elemento estranho no deck exige paralisação. A integridade do baralho precisa ser verificada antes de qualquer continuação.'},
  {type:'summary',title:'COMO AGIR DIANTE DE UM ERRO',items:['Pare a ação.','Não misture cartas.','Não mova fichas.','Informe exatamente o que aconteceu.','Aguarde dealer ou floor definir a correção.']}
];

export const floorSections=[
  {type:'host',eyebrow:'POKERINNO ORIENTA',title:'O FLOOR NÃO ESTÁ ALI PARA “DAR RAZÃO”',text:'O floor reconstrói os fatos, identifica a regra aplicável e decide como preservar a integridade do jogo.',host:'Explique a sequência do que aconteceu, não apenas o resultado que você gostaria.'},
  {type:'content',title:'QUANDO CHAMAR O FLOOR',text:'Chame o floor quando houver disputa sobre aposta, ação fora da vez, all-in e reabertura, carta exposta, misdeal, board incorreto, mão morta, pote ou side pot, showdown, comportamento inadequado ou qualquer situação que exija interpretação de regra.'},
  {type:'content',title:'APOSTA CONTESTADA',text:'Se existe dúvida sobre quanto foi apostado, se houve call ou raise, se uma declaração verbal é vinculante ou se a ação foi reaberta, pare antes que novos jogadores ajam. Quanto mais ações posteriores ocorrerem, mais difícil pode ser reconstruir a situação.'},
  {type:'content',title:'POTE OU SIDE POT INCORRETO',text:'Quando há stacks diferentes, cada pote tem jogadores elegíveis específicos. Se os valores foram misturados ou alguém discorda da elegibilidade, o pote não deve ser empurrado até a conferência.'},
  {type:'content',title:'SHOWDOWN CONTESTADO',text:'Se há dúvida sobre a mão vencedora, muck, ordem de exposição ou leitura das cartas, mantenha as mãos e o board identificáveis. Uma carta descartada e misturada pode perder a possibilidade de ser recuperada.'},
  {type:'content',title:'AÇÃO FORA DA VEZ',text:'A decisão depende do que aconteceu antes e depois da ação irregular. Em algumas situações ela permanece vinculante; em outras pode mudar. O floor analisa se a ação anterior se alterou e se outros jogadores já reagiram à informação indevida.'},
  {type:'content',title:'COMPORTAMENTO INADEQUADO',text:'Ofensas, ameaças, exposição intencional de cartas, ajuda estratégica durante a mão, demora deliberada, collusion, chip dumping e repetidas violações de procedimento podem exigir intervenção e penalidade.'},
  {type:'steps',title:'COMO O JOGADOR DEVE AGIR',items:['Diga claramente que existe uma dúvida e peça o floor.','Não misture sua mão com o muck.','Não recolha apostas de volta.','Não reorganize o pote por conta própria.','Explique os fatos na ordem em que ocorreram.','Aguarde a decisão antes de continuar.']},
  {type:'content',title:'PENALIDADES POSSÍVEIS',text:'A consequência depende da gravidade, intenção, reincidência e regra local. Podem existir aviso verbal, advertência formal, mão morta quando aplicável, perda de mãos ou órbitas, afastamento, desclassificação ou remoção do local. Uma penalidade disciplinar e a correção técnica da mão são decisões diferentes.'},
  {type:'content',title:'A REGRA DA CASA IMPORTA',text:'Poker ao vivo não possui um único regulamento universal aplicado de forma idêntica em todos os lugares. Organizações como Poker TDA criam padrões amplamente usados, mas cassinos, clubes e torneios podem adotar procedimentos próprios. Na mesa, a decisão da autoridade responsável pelo evento prevalece.'},
  {type:'summary',title:'A MELHOR FORMA DE AJUDAR O FLOOR',items:['Preserve cartas e fichas.','Não discuta enquanto a situação muda.','Relate fatos, valores e ordem das ações.','Deixe o dealer confirmar o que observou.','Retome o jogo somente após a decisão.']}
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
      ['FLOP','As três primeiras cartas comunitárias abertas juntas. O flop transforma a informação disponível: mãos prontas, draws e texturas passam a existir. A partir dele, cada jogador reavalia a força relativa da própria mão e como o board interage com os ranges envolvidos.'],
      ['HOLE CARDS','Cartas fechadas pertencentes ao jogador.'],
      ['KICKER','Carta de desempate usada quando mãos têm a mesma combinação principal.'],
      ['RIVER','Quinta e última carta comunitária no Hold’em e Omaha. Como não haverá novas cartas, toda decisão passa a depender da força final das mãos, dos ranges possíveis e da relação entre valor, blefe, call ou fold.'],
      ['TURN','Quarta carta comunitária. Ela pode completar draws, criar novos projetos ou mudar a força relativa das mãos. Como resta apenas uma carta por vir, decisões de aposta e call costumam ter consequências maiores sobre o tamanho final do pote.'],
      ['UPCARD','Carta distribuída aberta em modalidades que utilizam cartas expostas.'],
      ['DOWNCARD','Carta distribuída fechada.']
    ]
  },
  {
    title:'AÇÕES E APOSTAS',
    terms:[
      ['ALL-IN','Colocar todas as fichas disponíveis em jogo naquela mão. O jogador não pode apostar mais, mas continua disputando a parte do pote que conseguiu cobrir. Se outros jogadores tiverem stacks maiores, podem surgir side pots. Um all-in também pode ser menor que o raise mínimo e, nesse caso, nem sempre reabre a ação.'],
      ['BET','Colocar a primeira aposta de uma street. A aposta pode buscar valor de mãos piores, provocar folds, negar cartas gratuitas ou construir o pote. O tamanho escolhido altera o preço oferecido ao adversário e influencia quais mãos podem continuar.'],
      ['CALL','Igualar o valor necessário para continuar na mão. Um call mantém o pote aberto sem aumentar a pressão. Pode ser correto para realizar equity, manter blefes adversários ou controlar o tamanho do pote, mas também pode deixar o jogador vulnerável a apostas futuras.'],
      ['CHECK','Passar a ação sem colocar fichas quando não existe aposta pendente. Mantém o jogador na mão e transfere a decisão ao próximo. Pode ser usado para controlar o pote, induzir uma aposta, proteger um range de check ou simplesmente porque apostar não oferece vantagem suficiente.'],
      ['FOLD','Abandonar a mão e abrir mão de disputar o pote. As fichas já investidas permanecem no pote. Fold não é simplesmente “perder”: muitas vezes é a decisão que evita investir mais em uma situação desfavorável.'],
      ['RAISE','Aumentar uma aposta já existente. O raise pode buscar valor, proteção, isolamento ou folds. Ele força os adversários a responder ao novo preço e pode aumentar rapidamente o tamanho do pote; por isso, posição, stack e tamanho do raise mudam bastante suas consequências.'],
      ['RE-RAISE','Novo aumento após um raise.'],
      ['3-BET','Re-raise sobre um raise anterior. No pré-flop, a sequência típica é: blind, open raise e então 3-bet. Pode ser usada por valor, blefe ou isolamento. Seu tamanho altera o pote, o SPR e as decisões das streets seguintes.'],
      ['4-BET','Novo aumento sobre uma 3-bet. No pré-flop, costuma representar ranges mais fortes ou blefes selecionados. Como o pote cresce rapidamente, stacks efetivos e possibilidade de all-in passam a ser decisivos.'],
      ['MIN-RAISE','Menor aumento completo permitido pela regra.'],
      ['OPEN','Primeira entrada voluntária no pote por aposta ou raise.'],
      ['OPEN RAISE','Primeiro raise voluntário pré-flop.'],
      ['LIMP','Entrar no pote pré-flop apenas pagando o big blind.'],
      ['OVERBET','Aposta maior que o tamanho atual do pote.'],
      ['BLOCK BET','Aposta pequena usada para controlar preço ou extrair valor específico.'],
      ['DONK BET','Aposta feita por quem não foi o agressor da street anterior, antes que esse agressor tenha a chance de apostar novamente. Ela muda o fluxo esperado da mão: pode ser usada por valor, proteção ou blefe. Quem enfrenta uma donk bet precisa entender quem representa força, quais mãos podem apostar assim e como responder com call, raise ou fold.'],
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
      ['SHOWDOWN','Momento em que os jogadores ainda ativos ao fim da última rodada apresentam as mãos para definir o vencedor. A melhor combinação válida leva o pote, salvo empate. Procedimentos de exposição podem variar, e muck prematuro pode ter consequências.'],
      ['MUCK','Descartar a mão sem mostrá-la quando isso é permitido. O descarte pode encerrar o direito de disputar o pote se as cartas deixarem de ser identificáveis. Por isso, no showdown ou em situações contestadas, é importante não liberar as cartas antes de a decisão estar clara.'],
      ['DEAD HAND','Mão que perdeu o direito de disputar o pote.'],
      ['MISDEAL','Erro de distribuição que torna o início da mão inválido segundo a regra aplicada. Pode envolver número incorreto de cartas, distribuição fora da ordem ou outras falhas previstas. Se identificado cedo, a mão pode ser anulada e redistribuída; depois de ação substancial, a solução pode ser diferente.'],
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
      ['BLUFF','Aposta ou raise feito principalmente para fazer mãos melhores desistirem. Um blefe funciona quando representa força de forma coerente e existe chance suficiente de fold. Se for usado contra jogadores ou ranges que quase nunca desistem, perde eficiência.'],
      ['SEMI-BLUFF','Bluff com uma mão que ainda pode melhorar.'],
      ['SQUEEZE','Re-raise pré-flop feito depois de um raise e de pelo menos um call. A jogada pressiona o raiser original e também os callers. Pode ser usada por valor ou blefe, mas depende de posição, stacks, tamanho do raise e perfil dos adversários.'],
      ['VALUE BET','Aposta feita porque existem mãos piores capazes de pagar. O objetivo não é apenas “ter uma mão forte”, mas escolher um valor que extraia fichas de uma parte suficiente do range adversário sem afastar todas as mãos piores.'],
      ['THIN VALUE','Aposta por valor em situação de vantagem pequena.'],
      ['RANGE','Conjunto de mãos possíveis que um jogador pode representar em determinada situação. Em vez de tentar adivinhar uma única mão, o raciocínio por range considera várias combinações compatíveis com posição, ações anteriores, tamanhos de aposta e perfil do jogador.'],
      ['POSITION','Relação entre sua ordem de ação e a dos adversários. Agir depois permite observar decisões antes de escolher, oferecendo mais informação. Agir antes exige decidir com menos informação e pode tornar controle de pote, blefes e extração de valor mais difíceis.'],
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
      ['REC / RECREATIONAL','Abreviação de recreational player: jogador recreativo, normalmente participa principalmente por lazer e pode ter menor volume ou estudo técnico. É uma descrição de perfil, não uma medida automática de habilidade.'],
      ['REG / REGULAR','Jogador regular de determinado jogo, limite ou circuito. Em geral possui maior volume e familiaridade com o ambiente, mas “reg” não significa necessariamente profissional ou vencedor.'],
      ['PRO / PROFESSIONAL','Jogador profissional: pessoa que trata o poker como atividade profissional ou fonte relevante de renda. O termo descreve relação com a atividade, não garante nível técnico ou resultado.'],
      ['RECREATIONAL PLAYER','Jogador que participa principalmente por lazer.'],
      ['TELL','Comportamento que pode fornecer informação sobre uma mão.'],
      ['TABLE IMAGE','Percepção que a mesa construiu sobre o estilo de um jogador.']
    ]
  },
  {
    title:'TORNEIOS E CASH GAME',
    terms:[
      ['BUY-IN','Valor necessário para entrar em um jogo ou torneio. Em torneios, normalmente inclui a parcela destinada à premiação e a taxa da organização.'],
      ['MTT — MULTI-TABLE TOURNAMENT','Torneio disputado em várias mesas ao mesmo tempo. Conforme jogadores são eliminados, as mesas são balanceadas e consolidadas até restar a mesa final.'],
      ['ICM — INDEPENDENT CHIP MODEL','Modelo usado em torneios para estimar o valor monetário relativo dos stacks considerando fichas e estrutura de premiação. Perto da bolha ou de grandes saltos de prêmio, uma ficha perdida pode custar mais do que uma ficha ganha acrescenta em valor.'],
      ['BUBBLE / BOLHA','Fase imediatamente anterior à entrada na premiação ou a outro corte relevante, como mesa final. A pressão de eliminação muda bastante a estratégia porque stacks médios e curtos podem evitar riscos que aceitariam em outras fases.'],
      ['FIELD','Conjunto total de participantes de um torneio. Field pequeno, médio ou grande altera duração, variância, quantidade de mesas e caminho necessário até as premiações finais.'],
      ['HIGH ROLLER','Torneio ou evento com buy-in significativamente mais alto que o padrão da série ou circuito. O termo descreve principalmente o nível de entrada, não necessariamente a habilidade individual dos participantes.'],
      ['TURBO','Estrutura de torneio com níveis de blinds mais curtos que o padrão. Os stacks perdem profundidade mais rápido, aumentando a frequência de decisões pré-flop e situações de all-in.'],
      ['HYPER-TURBO / HIGH TURBO','Estrutura ainda mais rápida que um turbo. “Hyper-turbo” é o termo mais comum. Os níveis sobem muito depressa e a relação entre stack e blinds cai rapidamente, exigindo decisões mais comprimidas.'],
      ['REBUY','Compra adicional de fichas permitida em determinada fase sem necessariamente exigir eliminação, conforme a estrutura do evento. Regras de quantidade, valor e momento variam por torneio.'],
      ['RE-ENTRY / REENTRY','Nova entrada no torneio após eliminação, criando uma nova participação. Diferente do rebuy, normalmente a entrada anterior terminou e o jogador volta como uma nova inscrição.'],
      ['ADD-ON','Compra adicional de fichas oferecida em momento específico, normalmente ao fim do período de rebuy. Pode estar disponível mesmo para jogadores que ainda possuem fichas.'],
      ['FREEZEOUT','Formato em que cada jogador possui uma única entrada. Após perder todas as fichas, está eliminado e não pode fazer re-entry.'],
      ['LATE REGISTRATION','Período em que novas entradas ainda são aceitas depois do início do torneio. Entrar tarde reduz o tempo de jogo inicial e pode significar começar com menos big blinds.'],
      ['BLIND LEVEL','Período durante o qual blinds e, quando aplicável, antes permanecem em valores definidos. Ao fim do nível, os valores aumentam conforme a estrutura.'],
      ['IN THE MONEY (ITM)','Situação em que o jogador já garantiu uma colocação premiada. Estar ITM não significa necessariamente ter lucro, pois isso depende do valor do buy-in e da premiação recebida.'],
      ['FINAL TABLE','Última mesa de um torneio, formada quando restam apenas jogadores suficientes para uma mesa. Os saltos de premiação tendem a tornar ICM ainda mais importante.'],
      ['CHIP LEADER','Jogador com o maior stack em determinado momento. Um stack grande pode aumentar a capacidade de pressionar adversários, especialmente em fases sensíveis a ICM.'],
      ['SHORT STACK','Stack pequeno em relação aos blinds. Quanto menor o número de big blinds, menor a margem para jogar várias streets e maior a importância das decisões pré-flop.'],
      ['DEEP STACK','Stack grande em relação aos blinds. A profundidade cria mais espaço para decisões pós-flop e amplia o impacto de posição, tamanhos de aposta e ranges.'],
      ['CASH GAME','Jogo em que as fichas representam valor monetário direto. Diferentemente de torneios, não existe escalada obrigatória de blinds nem premiação por colocação.'],
      ['TABLE LIMIT','Limites mínimos e máximos definidos para uma mesa, incluindo blinds, buy-in e outras regras de entrada.']
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
      ['FISH','Gíria informal para um jogador considerado menos experiente ou que comete erros frequentes. Não descreve uma estratégia específica e pode ser pejorativa. O importante é identificar comportamentos reais — como pagar demais, jogar mãos fracas ou errar tamanhos de aposta — em vez de simplesmente rotular o adversário.'],
      ['SHARK','Jogador experiente e tecnicamente forte.'],
      ['WHALE','Jogador recreativo que costuma movimentar valores altos.'],
      ['NIT','Jogador extremamente seletivo e conservador.'],
      ['MANIAC','Jogador muito agressivo e de range bastante amplo.'],
      ['CALLING STATION','Jogador que paga muitas apostas e desiste pouco.'],
      ['GRINDER','Jogador de grande volume que busca resultado consistente.'],
      ['REG','Abreviação de regular: jogador frequente em determinado jogo, limite ou circuito. Costuma conhecer bem a dinâmica local e acumular volume, mas ser reg não significa automaticamente ser profissional.']
    ]
  },
  {
    title:'LINHAS E JOGADAS',
    terms:[
      ['DONK BET','Aposta feita fora de posição contra o agressor da street anterior antes que ele possa agir.'],
      ['SLOW PLAY','Jogar uma mão muito forte de forma mais passiva do que o normal para esconder sua força e induzir apostas ou raises posteriores. Pode aumentar o valor extraído quando o adversário continua apostando, mas também pode permitir cartas gratuitas que melhoram mãos adversárias ou reduzir o tamanho final do pote.'],
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

export const editorialPrinciples={
  audience:'Do primeiro contato ao conhecimento sólido.',
  rule:'Explicar o que acontece, por que acontece, quais alternativas existem e quais consequências cada decisão pode produzir.',
  tone:'Linguagem simples, direta e tecnicamente correta.',
  depth:'Básico na linguagem; profundo no tema.',
  progression:'Cada conceito deve preparar o próximo.'
};
