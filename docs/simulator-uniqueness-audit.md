# Auditoria de unicidade dos 1.500 candidatos — 9-max

**Estado: REPROVADO PARA CERTIFICAÇÃO E PUBLICAÇÃO COMO BANCO DE SPOTS.**

Reprodução local da função geradora e da assinatura em `dist/simulator-uniqueness.js`:

- Registros gerados: **1.500**
- Assinaturas estratégicas distintas: **808**
- Repetições por assinatura: **692 (46,13%)**
- Solves independentemente reproduzidos/certificados nesta auditoria: **0**

Esta contagem não é uma aprovação do CI. Reproduzir com `node tests/audit-simulator-uniqueness.mjs`; a execução deve falhar enquanto houver repetição ou contexto pós-flop ausente.

## Condições obrigatórias para substituir um candidato

1. Decisão única por situação estratégica: mesa 9-max, posição, mão, stack efetivo, adversário, ação anterior, sizing, ranges e street.
2. Não contam como novidade: trocar naipes globalmente, inverter cartas, mudar ID, pote cosmético, ou apenas renomear o mesmo cenário.
3. Registrar duas cartas concretas e board sem colisões, histórico real de apostas e pote derivado das contribuições.
4. Associar solve original com referência verificável e estratégia correspondente; sem projeção de posição, street ou ação.
5. Nenhum candidato sem contexto ou solve independente entra na contagem certificada ou no diagnóstico.

**Não substituir as 692 repetições por dados artificiais para atingir a meta.** Preservar o bloqueio até que existam 1.500 decisões completas, distintas e solver-validadas.
