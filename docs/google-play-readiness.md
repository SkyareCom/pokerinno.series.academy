# POKERINNO ACADEMY — Google Play readiness

Status: **PREPARAÇÃO, NÃO PUBLICADO / AAB NÃO GERADO**.

## Escopo
- Fonte: `SkyareCom/pokerinno.series.academy`; front web em `dist/`.
- Não modificar Academy Verde, Academy Definitivo, outros apps, ou branch `main`.
- Preservar identidade, login, rodapé congelado, cores e layout.
- Idiomas PT-BR, EN-US, ES-ES, auditados antes do release.

## Pendências obrigatórias
- [x] **Decisão de produto:** POKERINNO ACADEMY substituirá o STACKUP HOLD’EM ACADEMY existente na Google Play.\n- [x] **applicationId a preservar:** `com.skyare.stackupacademy` (confirmar com o artefato publicado antes do build).\n- [ ] Confirmar o maior `versionCode` já enviado à Play; usar valor estritamente superior (não presumir 235).\n- [ ] Confirmar continuidade da chave de upload/assinatura via Play App Signing; não criar nova identidade de assinatura inadvertidamente.
- [ ] Definir nome exibido POKERINNO ACADEMY, novo `versionName`, categoria, classificação etária e contato de suporte; preservar a ficha existente na Play.
- [ ] Criar wrapper Android WebView **com assets locais** de `dist/`, sem dependência de GitHub Pages para o front.
- [ ] Garantir roteamento `#/...`, botão Voltar Android, safe areas, navegação, viewport, teclado, rolagem, armazenamento e permissões mínimas.
- [ ] Configurar ícone adaptativo, splash, tema, imagens e ficha Play Store.
- [ ] Implementar e validar login Google/StackUp ID/biometria **somente onde houver implementação real**, sem simular funcionalidade.
- [ ] Definir política de privacidade, formulário Data Safety, exclusão de conta (quando aplicável), declaração de anúncios e acesso para revisão.
- [ ] Avaliar assinatura digital, Play App Signing e credenciais em secrets; **não adicionar keystore ou senhas ao Git**.
- [ ] Usar versão de Android Gradle Plugin, targetSdk e políticas exigidas pela Play no momento do envio.
- [ ] Configurar workflow CI para rodar testes e compilar `.aab` assinado somente após configuração e secrets.
- [ ] Rodar `npm test`, `npm run i18n:audit`, `npm run spacing:audit`, `npm run visual:audit`; documentar resultados reais.
- [ ] Testar AAB em dispositivo e Play internal testing; revisar crashes, login, pagamentos, navegação e offline.
- [ ] Enviar à Google Play somente após aprovação explícita.

## Estado verificado em 2026-10-10
O diretório raiz consultado contém `dist/`, `tests/`, `scripts/`, `docs/`, `package.json` e workflows web/solver. **Não há diretório Android/Gradle na raiz consultada.** Nenhum AAB, assinatura, build Android ou aprovação Play foi verificado.

## Estratégia de substituição confirmada\nNão criar nova ficha Play Store. Gerar um AAB de atualização com o mesmo package ID e continuidade de assinatura; atualizar nome e identidade visual conforme autorizado. Evitar apagar dados locais sem plano de migração. Não alterar o app já publicado antes de build, testes e aprovação.\n\n## Regra de liberação
Nunca declarar 'pronto para Google Play' antes de um build Android real, testes executados e artefato `.aab` comprovado.
