# Regra de idiomas — série POKERINNO

Esta regra se aplica a toda alteração de interface neste repositório.

- Manter PT-BR (`pt-BR`), EN-US (`en-US`) e ES-ES (`es-ES`) em paralelo.
- Ao criar ou alterar texto visível, traduzir os três idiomas na mesma tarefa, sem aguardar novo pedido.
- Usar chaves semânticas e `t()` de `dist/i18n.js`; não inserir novos textos fixos nas telas.
- Incluir login, cadastro, títulos, botões, cards, descrições, menus, mensagens, estados vazios, diálogos, placeholders, acessibilidade e erros.
- Preservar nomes de marca, siglas de poker e nomes dos apps. Adaptar datas, números e moeda ao idioma e ao formato de jogo.
- Manter o idioma escolhido persistente e aplicar `document.documentElement.lang`.
- Não enviar dados pessoais ou credenciais a serviços de tradução. Traduzir somente conteúdo da interface durante o desenvolvimento.
- Executar `npm run i18n:audit` após toda alteração. Resolver chaves ausentes, vazias, interpolação incompatível e novos textos fora do catálogo.
- Usar `npm run i18n:audit:strict` ao concluir a migração do texto legado. Não declarar o app totalmente traduzido enquanto a varredura apontar candidatos legados.
- Revisar legibilidade e transbordamento nos três idiomas. Não ocultar controles para acomodar traduções.
- Não substituir autenticação ou motores existentes. Não alterar main nem publicar Railway.

# Contrato de espaçamento

- Hierarquia visual atual, autorizada em 08/10/2026: títulos de cards e subcards em MAIÚSCULAS e branco `#f4f2e7`. Títulos de página brancos, 20px; títulos primários, 16px; títulos de subcards, textos e metadados, 12px. Ênfase dentro de frases herda o tamanho do texto.
- Usar somente 12/16/20px fora do rodapé. Login e rodapé congelados continuam com as referências e exceções aprovadas.
- Cards primários: borda 1px `rgba(246,165,64,.32)`, raio 16px. Subcards: borda 1px `rgba(246,165,64,.18)`, raio 12px. Padding 16px desktop e 12px mobile; intervalos entre estruturas 10px. Cards de navegação têm altura mínima 100px e crescem sem truncar textos; cards de leitura têm altura automática.
- `npm run visual:audit` percorre todos os textos renderizados, rotas, conteúdos expandidos, estados e questões. O workflow de publicação só publica após os testes e auditorias.

- `dist/spacing.css` é a fonte única dos espaçamentos compartilhados e deve ser carregado depois dos estilos de componentes.
- Usar `--space-1/2/3/4/6/8` (4/8/12/16/24/32px) em novas estruturas. Intervalos compartilhados de cards, listas e seções: `--component-gap` (10px); padding de card: 16px (conteúdo interno mobile: 12px).
- Parágrafos consecutivos têm uma linha de distância (`--paragraph-gap: 1lh`), além da entrelinha de 1.55. Não inserir `<br>` vazios para espaçar.
- Números e textos de etapas devem usar colunas separadas; nunca concatenar o número com o texto.
- Não sobrescrever tracking, word-spacing ou margens compartilhadas em novos componentes. Exceções geométricas (cartas, gráficos e navegação fixa) devem permanecer locais.
- Executar `npm test` e a auditoria de espaçamento mobile antes de publicar mudanças de layout.

# Rodapé congelado — autorização explícita obrigatória

- O rodapé atual está aprovado e CONGELADO por instrução do usuário em 08/10/2026.
- Não alterar o rodapé em tarefas futuras sem pedido explícito do usuário especificamente para o rodapé.
- Preservar os cinco itens, nesta ordem: HOME, APRENDER, PRATICAR, JOGAR, DASH; preservar seus destinos, ícones atuais, cores, destaque ativo, alinhamento, espaçamento e posição fixa.
- Atualização explicitamente autorizada em 08/10/2026: JOGAR acessa `#play`, DASH acessa `#evolution` e PERFIL fica apenas no canto superior, com ícone de usuário. O rodapé continua congelado após essa atualização.
- Preservar ícones em caixas de 25px (caracteres com font-size 25px e SVG com width/height 25px) e textos de 10px.
- Regras globais de tipografia, espaçamento, temas ou refatorações não podem alterar o rodapé. Em particular, seletores de texto de 10px devem excluir .nav-symbol para não reduzir os ícones.
- Antes de entregar alterações de interface, verificar que o rodapé continua com cinco ícones de 25px e legendas de 10px. Não reinterpretar nem redesenhar os ícones para padronizar outros componentes.

# Tela de login congelada — autorização explícita obrigatória

- A tela de login atual está aprovada e CONGELADA por instrução do usuário em 08/10/2026.
- Referência aprovada: commit `83f90d205c2fea1039e89c881614f0e6741312e8` da branch `feat/pokerinno-frontend`.
- Não alterar estrutura, imagens, logos, ícones, textos, fontes, tamanhos, pesos, cores, bordas, dimensões, espaçamentos, alinhamento ou comportamento da tela de login sem pedido explícito do usuário especificamente para essa tela.
- Preservar a imagem e a marca Pokerinno, o título “Sua jornada no poker começa aqui.” em 16px, os idiomas PT-BR/EN-US/ES-ES, os três botões de acesso, o cadastro, o formulário StackUp ID e o acesso à prévia.
- Preservar o Google G oficial colorido, a impressão digital da biometria e o mini logo StackUp com o fundo externo transparente; preservar as caixas dos ícones em 32px e seu alinhamento atual.
- Arquivos de referência: `dist/login.js`, as regras de login de `dist/styles.css` e `dist/spacing.css`, `dist/assets/google-g-official.png` e `dist/assets/stackup-logo-transparent.png`.
- Alterações globais de tipografia, temas, espaçamento, imagens, componentes ou refatorações não podem modificar a tela de login. Manter os estilos dessas alterações fora do escopo de `body.login-screen` quando necessário.
- Antes de entregar alterações de interface em outras telas, verificar que o login mantém a aparência e o comportamento da referência aprovada nos três idiomas e nos layouts responsivos.
