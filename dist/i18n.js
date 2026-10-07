export const supportedLanguages=['pt-BR','en-US','es-ES'];

const messages={
  'pt-BR':{
    nav:{home:'Início',journey:'Jornada',practice:'Prática',evolution:'Evolução',profile:'Perfil',homeM:'INÍCIO',journeyM:'APRENDER',practiceM:'PRATICAR',evolutionM:'JOGAR',profileM:'PERFIL'},
    common:{exploreJourney:'Explorar a jornada',backJourney:'Voltar à jornada',continue:'Continuar',back:'Voltar',retry:'Tentar novamente',understood:'Entendi'},
    login:{intro:'Entre para continuar sua primeira aventura.',language:'Idioma',google:'Entrar com Google',biometric:'Entrar com Biometria',or:'OU',emailPlaceholder:'seuemail@exemplo.com',stackup:'Entrar com StackUp ID',create:'Criar conta StackUp',createTitle:'Criar conta StackUp',createDesc:'Uma conta para acessar os aplicativos StackUp.'},
    home:{eyebrow:'ACADEMY · A PRIMEIRA DESCOBERTA',hero:'APRENDER.<br>PRATICAR.<br><em>JOGAR.</em>',quote:'“Poker é um jogo que demora minutos para aprender. Mas leva uma vida para dominar.”',cta:'Começar a aprender',note:'COM POKERINNO, CADA PASSO CONTA.',section:'Escolha sua aventura',base:'Sua base',baseDesc:'Os primeiros passos para entender o jogo.',modalities:'Modalidades',modalitiesDesc:'Novas mesas. Diferentes possibilidades.',practice:'Prática',practiceDesc:'Um espaço para suas próximas decisões.',evolution:'Sua evolução',evolutionDesc:'Cada descoberta faz parte da sua história.'},
    journey:{tag:'PRIMEIRA AVENTURA',title:'APRENDER',desc:'Aprenda o essencial para acompanhar o jogo e participar da mesa.',chapterTag:'CAPÍTULO',pendingTitle:'Seu próximo capítulo está sendo preparado.',pendingDesc:'As aulas aparecerão aqui quando o conteúdo da jornada estiver disponível. Seu aprendizado começa com uma base bem construída.'},
    modalities:{tag:'NOVOS CAMINHOS',title:'Um jogo. Muitas possibilidades.',desc:'Descubra as diferentes formas de viver o poker.',pendingTitle:'Novas mesas estão a caminho.',pendingDesc:'As modalidades e seus percursos serão apresentados aqui quando os conteúdos estiverem disponíveis.'},
    practice:{tag:'DA DESCOBERTA À DECISÃO',title:'Pratique o básico.',desc:'Entenda a dinâmica antes de enfrentar a mesa.',quick:'Treino rápido',quickDesc:'Pratique as decisões básicas.',custom:'Treino personalizado',customDesc:'Reforce o que você aprendeu.',challenges:'Desafios',challengesDesc:'Confira sua compreensão do jogo.',review:'Revisão de mãos',reviewDesc:'Entenda o básico das suas decisões.',pendingTitle:'As primeiras decisões estão a caminho.',pendingDesc:'Quando os treinos estiverem disponíveis, você encontrará aqui seus desafios e a revisão das suas decisões.'},
    evolution:{tag:'SUA HISTÓRIA',title:'Sua preparação para a mesa.',desc:'Acompanhe os fundamentos que você está aprendendo.',pendingTitle:'Sua história ainda vai começar.',pendingDesc:'Você ainda não possui aulas concluídas, treinos ou conquistas. O progresso aparecerá a partir das suas atividades reais.'},
    profile:{tag:'DO SEU JEITO',title:'Seu espaço no Academy.',desc:'Pequenos ajustes para acompanhar a sua jornada.',hello:'Olá, explorador.',connect:'Conecte sua conta StackUp para sincronizar a jornada.',account:'Acessar minha conta',sounds:'Sons da jornada',soundsDesc:'Preferência preparada para as experiências com áudio.',motion:'Reduzir movimentos',motionDesc:'Uma navegação mais tranquila, com menos animações.',privacy:'Privacidade e conta',privacyDesc:'Conta e sincronização ficam disponíveis após a autenticação.',consult:'Consultar'},
    chapters:{
      discover:{title:'Descobrir o jogo',description:'O primeiro encontro com o universo do poker.'},
      rules:{title:'Conhecer as regras',description:'Entenda a linguagem e a dinâmica da mesa.'},
      decisions:{title:'Entender as decisões',description:'Aprenda a observar antes de agir.'},
      formats:{title:'Explorar modalidades',description:'Encontre novos caminhos para aprender.'},
      practice:{title:'Preparar-se para a mesa',description:'Pratique o básico e prepare-se para jogar.'}
    }
  },
  'en-US':{
    nav:{home:'Home',journey:'Journey',practice:'Practice',evolution:'Progress',profile:'Profile',homeM:'HOME',journeyM:'LEARN',practiceM:'PRACTICE',evolutionM:'PLAY',profileM:'PROFILE'},
    common:{exploreJourney:'Explore the journey',backJourney:'Back to journey',continue:'Continue',back:'Back',retry:'Try again',understood:'Got it'},
    login:{intro:'Sign in to continue your first adventure.',language:'Language',google:'Sign in with Google',biometric:'Sign in with Biometrics',or:'OR',emailPlaceholder:'you@example.com',stackup:'Sign in with StackUp ID',create:'Create StackUp account',createTitle:'Create StackUp account',createDesc:'One account to access StackUp apps.'},
    home:{eyebrow:'ACADEMY · THE FIRST DISCOVERY',hero:'LEARN.<br>PRACTICE.<br><em>PLAY.</em>',quote:'“Poker takes minutes to learn, but a lifetime to master.”',cta:'Start learning',note:'WITH POKERINNO, EVERY STEP COUNTS.',section:'Choose your adventure',base:'Your foundation',baseDesc:'The first steps to understand the game.',modalities:'Formats',modalitiesDesc:'New tables. Different possibilities.',practice:'Practice',practiceDesc:'A space for your next decisions.',evolution:'Your progress',evolutionDesc:'Every discovery becomes part of your story.'},
    journey:{tag:'FIRST ADVENTURE',title:'LEARN',desc:'Learn the essentials to follow the game and join the table.',chapterTag:'CHAPTER',pendingTitle:'Your next chapter is being prepared.',pendingDesc:'Lessons will appear here when this part of the journey is available. Your learning starts with a solid foundation.'},
    modalities:{tag:'NEW PATHS',title:'One game. Many possibilities.',desc:'Discover different ways to experience poker.',pendingTitle:'New tables are on the way.',pendingDesc:'Formats and their learning paths will appear here when the content is available.'},
    practice:{tag:'FROM DISCOVERY TO DECISION',title:'Practice the basics.',desc:'Understand the flow before facing the table.',quick:'Quick training',quickDesc:'Practice basic decisions.',custom:'Custom training',customDesc:'Reinforce what you learned.',challenges:'Challenges',challengesDesc:'Check your understanding of the game.',review:'Hand review',reviewDesc:'Understand the basics behind your decisions.',pendingTitle:'Your first decisions are on the way.',pendingDesc:'When training is available, you will find challenges and hand reviews here.'},
    evolution:{tag:'YOUR STORY',title:'Your preparation for the table.',desc:'Track the fundamentals you are learning.',pendingTitle:'Your story is about to begin.',pendingDesc:'You have not completed lessons, training or achievements yet. Progress will appear from your real activity.'},
    profile:{tag:'YOUR WAY',title:'Your space in Academy.',desc:'Small settings to support your journey.',hello:'Hello, explorer.',connect:'Connect your StackUp account to sync your journey.',account:'Access my account',sounds:'Journey sounds',soundsDesc:'Preference ready for audio experiences.',motion:'Reduce motion',motionDesc:'A calmer navigation experience with fewer animations.',privacy:'Privacy and account',privacyDesc:'Account and sync become available after authentication.',consult:'View'},
    chapters:{
      discover:{title:'Discover the game',description:'Your first encounter with the world of poker.'},
      rules:{title:'Learn the rules',description:'Understand the language and flow of the table.'},
      decisions:{title:'Understand decisions',description:'Learn to observe before acting.'},
      formats:{title:'Explore formats',description:'Find new paths to learn.'},
      practice:{title:'Prepare for the table',description:'Practice the basics and get ready to play.'}
    }
  },
  'es-ES':{
    nav:{home:'Inicio',journey:'Ruta',practice:'Práctica',evolution:'Evolución',profile:'Perfil',homeM:'INICIO',journeyM:'APRENDER',practiceM:'PRACTICAR',evolutionM:'JUGAR',profileM:'PERFIL'},
    common:{exploreJourney:'Explorar la ruta',backJourney:'Volver a la ruta',continue:'Continuar',back:'Volver',retry:'Intentar de nuevo',understood:'Entendido'},
    login:{intro:'Entra para continuar tu primera aventura.',language:'Idioma',google:'Entrar con Google',biometric:'Entrar con Biometría',or:'O',emailPlaceholder:'tucorreo@ejemplo.com',stackup:'Entrar con StackUp ID',create:'Crear cuenta StackUp',createTitle:'Crear cuenta StackUp',createDesc:'Una cuenta para acceder a las apps de StackUp.'},
    home:{eyebrow:'ACADEMY · EL PRIMER DESCUBRIMIENTO',hero:'APRENDER.<br>PRACTICAR.<br><em>JUGAR.</em>',quote:'“El poker se aprende en minutos, pero dominarlo lleva toda una vida.”',cta:'Empezar a aprender',note:'CON POKERINNO, CADA PASO CUENTA.',section:'Elige tu aventura',base:'Tu base',baseDesc:'Los primeros pasos para entender el juego.',modalities:'Modalidades',modalitiesDesc:'Nuevas mesas. Diferentes posibilidades.',practice:'Práctica',practiceDesc:'Un espacio para tus próximas decisiones.',evolution:'Tu evolución',evolutionDesc:'Cada descubrimiento forma parte de tu historia.'},
    journey:{tag:'PRIMERA AVENTURA',title:'APRENDER',desc:'Aprende lo esencial para seguir el juego y participar en la mesa.',chapterTag:'CAPÍTULO',pendingTitle:'Tu próximo capítulo se está preparando.',pendingDesc:'Las clases aparecerán aquí cuando este contenido esté disponible. Tu aprendizaje comienza con una base sólida.'},
    modalities:{tag:'NUEVOS CAMINOS',title:'Un juego. Muchas posibilidades.',desc:'Descubre diferentes formas de vivir el poker.',pendingTitle:'Nuevas mesas están en camino.',pendingDesc:'Las modalidades y sus recorridos aparecerán aquí cuando el contenido esté disponible.'},
    practice:{tag:'DEL DESCUBRIMIENTO A LA DECISIÓN',title:'Practica lo básico.',desc:'Entiende la dinámica antes de enfrentarte a la mesa.',quick:'Entrenamiento rápido',quickDesc:'Practica las decisiones básicas.',custom:'Entrenamiento personalizado',customDesc:'Refuerza lo que aprendiste.',challenges:'Desafíos',challengesDesc:'Comprueba tu comprensión del juego.',review:'Revisión de manos',reviewDesc:'Entiende lo básico de tus decisiones.',pendingTitle:'Tus primeras decisiones están en camino.',pendingDesc:'Cuando los entrenamientos estén disponibles, encontrarás aquí desafíos y revisión de manos.'},
    evolution:{tag:'TU HISTORIA',title:'Tu preparación para la mesa.',desc:'Sigue los fundamentos que estás aprendiendo.',pendingTitle:'Tu historia está por comenzar.',pendingDesc:'Aún no tienes clases completadas, entrenamientos ni logros. El progreso aparecerá a partir de tu actividad real.'},
    profile:{tag:'A TU MANERA',title:'Tu espacio en Academy.',desc:'Pequeños ajustes para acompañar tu recorrido.',hello:'Hola, explorador.',connect:'Conecta tu cuenta StackUp para sincronizar tu recorrido.',account:'Acceder a mi cuenta',sounds:'Sonidos de la ruta',soundsDesc:'Preferencia preparada para experiencias con audio.',motion:'Reducir movimientos',motionDesc:'Una navegación más tranquila, con menos animaciones.',privacy:'Privacidad y cuenta',privacyDesc:'La cuenta y la sincronización estarán disponibles después de autenticarte.',consult:'Consultar'},
    chapters:{
      discover:{title:'Descubrir el juego',description:'El primer encuentro con el universo del poker.'},
      rules:{title:'Conocer las reglas',description:'Entiende el lenguaje y la dinámica de la mesa.'},
      decisions:{title:'Entender las decisiones',description:'Aprende a observar antes de actuar.'},
      formats:{title:'Explorar modalidades',description:'Encuentra nuevos caminos para aprender.'},
      practice:{title:'Prepararte para la mesa',description:'Practica lo básico y prepárate para jugar.'}
    }
  }
};

export function createTranslator(language){
  const lang=supportedLanguages.includes(language)?language:'pt-BR';
  const source=messages[lang];
  const read=key=>key.split('.').reduce((value,part)=>value?.[part],source);
  const fallback=key=>key.split('.').reduce((value,part)=>value?.[part],messages['pt-BR']);
  return key=>read(key)??fallback(key)??key;
}
