# POKERINNO ACADEMY — Google Play readiness

Status: **AAB NÃO ASSINADO GERADO EM CI; NÃO PUBLICADO / NÃO APTO À PLAY**.

## Escopo
- Fonte: `SkyareCom/pokerinno.series.academy`; front web em `dist/`.
- Não modificar Academy Verde, Academy Definitivo, outros apps, ou branch `main`.
- Preservar identidade, login, rodapé congelado, cores e layout.
- Idiomas PT-BR, EN-US, ES-ES, auditados antes do release.

## Pendências obrigatórias
- [x] **Decisão de produto:** POKERINNO ACADEMY substituirá o STACKUP HOLD’EM ACADEMY existente na Google Play.
- [x] **applicationId a preservar:** `com.skyare.stackupacademy` (confirmar com o artefato publicado antes do build).
- [ ] Confirmar o maior `versionCode` já enviado à Play; usar valor estritamente superior (não presumir 235).
- [ ] Confirmar continuidade da chave de upload/assinatura via Play App Signing; não criar nova identidade de assinatura inadvertidamente.
- [ ] Definir nome exibido POKERINNO ACADEMY, novo `versionName`, categoria, classificação etária e contato de suporte; preservar a ficha existente na Play.
- [x] Criado wrapper Android WebView **com assets locais** de `dist/`; compilação CI concluída com sucesso. Teste funcional no dispositivo ainda pendente.
- [ ] Garantir roteamento `#/...`, botão Voltar Android, safe areas, navegação, viewport, teclado, rolagem, armazenamento e permissões mínimas.
- [ ] Configurar ícone adaptativo, splash, tema, imagens e ficha Play Store.
- [ ] Implementar e validar login Google/StackUp ID/biometria **somente onde houver implementação real**, sem simular funcionalidade.
- [ ] Definir política de privacidade, formulário Data Safety, exclusão de conta (quando aplicável), declaração de anúncios e acesso para revisão.
- [ ] Avaliar assinatura digital, Play App Signing e credenciais em secrets; **não adicionar keystore ou senhas ao Git**.
- [ ] Usar versão de Android Gradle Plugin, targetSdk e políticas exigidas pela Play no momento do envio.
- [x] Workflow CI gerou AAB **não assinado** com sucesso: execução `38056815635`, artefato `11671013430` (2.645.240 bytes).
- [x] Integrar execução dos testes e auditorias ao workflow antes da compilação (commit `756f8a1`; resultado da execução ainda pendente).
- [ ] Configurar assinatura de release somente após validar chave de upload/secret e versão Play.
- [ ] Gerar AAB **assinado** e comprovar aceitação em Play internal testing.
- [ ] Corrigir bloqueios CI da execução `38057029067`: `npm test` = 55 aprovados, 5 falharam. Auditorias seguintes não executadas devido ao bloqueio.\n- [ ] Certificação de 1.500 decisões solver independentes exigida por `tests/audit-simulator-uniqueness.mjs`; não alterar critério ou declarar certificação sem evidência.\n- [ ] Corrigir testes do Perfil (Coach, idioma, salvamento) e integridade dos ranges 9-max.
- [ ] Testar AAB em dispositivo e Play internal testing; revisar crashes, login, pagamentos, navegação e offline.
- [ ] Enviar à Google Play somente após aprovação explícita.

## Estado verificado em 2026-10-10
O diretório raiz consultado contém `dist/`, `tests/`, `scripts/`, `docs/`, `package.json` e workflows web/solver. **Não há diretório Android/Gradle na raiz consultada.** Posteriormente, em 2026-10-10, o workflow Android passou e gerou um AAB não assinado (execução 38056815635, artefato 11671013430). Assinatura e aprovação Play continuam não verificadas.

## Estratégia de substituição confirmada
Não criar nova ficha Play Store. Gerar um AAB de atualização com o mesmo package ID e continuidade de assinatura; atualizar nome e identidade visual conforme autorizado. Evitar apagar dados locais sem plano de migração. Não alterar o app já publicado antes de build, testes e aprovação.

## Regra de liberação
Nunca declarar 'pronto para Google Play' antes de um build Android real, testes executados e artefato `.aab` comprovado.
