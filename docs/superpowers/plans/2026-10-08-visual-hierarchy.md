# Padronização visual do Pokerinno Academy

Escopo autorizado: percorrer todas as rotas, conteúdo expandido, exercícios e estados internos; padronizar fontes, cores, geometria e espaçamentos por função. Branch feat/pokerinno-frontend. Login e rodapé congelados; main e Railway fora do escopo.

1. Inventariar HTML e CSS atuais. Criar auditoria de navegador que percorra todos os textos renderizados, capítulos, procedimentos, perfil, módulos e questões, com relatórios de tamanho, cor, cortes e overflow. Demonstrar falhas da versão atual no CI antes da correção.
2. Consolidar o contrato em dist/spacing.css: página 20px; seção e card primário 16px; texto, metadados e subcard 12px. Card primário branco #f4f2e7 e maiúsculas; subcard branco #f4f2e7 e maiúsculas. Ênfase em frases herda o tamanho do texto. Preservar na íntegra estilos congelados.
3. Unificar bordas primárias de 1px, raio 16px, subcards raio 12px, padding 16px desktop/12px mobile, intervalos 10px. Navegação tem mínimo de 100px e cresce sem cortar conteúdo; leitura tem altura automática. Remover regras concorrentes em vez de acumular correções globais. Documentar o padrão em AGENTS.md.
4. Executar npm test, i18n:audit, spacing:audit e a auditoria visual em 360/393/720/1280px e PT/EN/ES. Validar login contra estilos congelados, cinco ícones de 25px e legendas de 10px. A publicação Pages só segue se as auditorias passarem. Revisar a versão publicada e fornecer link desde #login.

Interfaces: spacing.css é a autoridade visual; styles.css conserva arte e controles; scripts/audit-visual.cjs valida comportamento renderizado. O workflow existente recebe as verificações antes da etapa de upload, sem mudança de destino de hospedagem.

Critério de conclusão: zero texto fora da escala, zero título de card ou subcard fora do branco, zero corte ou overflow nas rotas/estados auditados, testes e CI reais verdes.

Atualização de 08/10/2026: o pedido “Títulos dos cards e subcards em branco” substitui a cor laranja anteriormente aprovada. Tamanhos, bordas, espaçamentos, login e rodapé permanecem conforme o contrato.
