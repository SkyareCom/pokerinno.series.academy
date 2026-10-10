# Auditoria complementar com Meta AI

O último comando de POKERINNO ACADEMY 7 autorizou a revisão do motor e dos spots pela Meta AI. O pacote de auditoria contém o código atual, os 1.500 spots completos, hashes SHA-256, o registro de certificação recalculado e comparações refeitas a partir dos arquivos brutos disponíveis. Não contém um parecer da Meta AI: a revisão externa ainda precisa ocorrer.

Distribuição preservada: 720 pré-flop, 450 flop, 225 turn e 105 river. Os 780 pós-flop não são substituídos. Não há alterações de interface, login ou rodapé.

## Gerar e verificar

Use Node 22 ou superior, na raiz do repositório e na branch `feat/pokerinno-frontend`:

```bash
node scripts/export-meta-audit-bundle.mjs --out reports/meta-audit/bundle
node scripts/verify-meta-audit-bundle.mjs --bundle reports/meta-audit/bundle
```

O destino deve estar vazio. Cada geração descreve uma única versão por hashes dos arquivos. `sourceCommit` identifica o HEAD de referência; `sourceState` indica que os hashes descrevem o conteúdo efetivamente empacotado, inclusive alterações locais. A verificação confirma os hashes, o conjunto dos 1.500 IDs e as quantidades por street.

O exportador recompõe o registro oficial em um diretório separado. Ele não modifica o registro oficial nem aceita contagens vindas de pareceres. Havendo exports TexasSolver/DCFR em `reports/solver/certification/dual-engine`, o comparador relê inputs, cenário, execução, logs e estratégias. Arquivos antigos ou adulterados ficam registrados como rejeitados, sem concordância.

O CI `Academy Meta AI Audit Package` recupera os três solves reais do run `38060216526`, commit `875d386117e282bf4aa38a11aa580619b1b1894b`, e registra sua origem. Esses solves demonstram concordância diagnóstica em flop/turn/river. Seus ranges continuam heurísticos, sem probabilidades de alcance reconstruídas nas streets anteriores; a árvore CHECK/ALL-IN é simplificada. O pacote não incorpora binários dos solvers: os hashes registrados são evidências da compilação no CI.

## Solicitar o parecer

Entregue o ZIP gerado à Meta AI com `PROMPT_META_AI.md`. Se houver limite de contexto/anexos, envie os arquivos de código e os 30 lotes em sequência. Cada lote contém 50 spots. Exija IDs efetivamente revisados e achados com arquivo, SHA-256 e linha. Revisão parcial permanece parcial.

Salve a resposta JSON e importe para um destino novo:

```bash
node scripts/import-meta-audit-opinion.mjs --bundle reports/meta-audit/bundle --opinion parecer.json --out reports/meta-audit/parecer-importado.json
```

O importador verifica a versão do pacote, hashes e linhas citadas, IDs e abrangência. Rejeita campos de certificação e referências incompatíveis. Resolve caminhos reais para impedir desvios por links simbólicos; as pastas protegidas não dependem da pasta atual do terminal. Dentro do repositório, o destino fica em `reports/meta-audit`. O rótulo de autor é atribuído: sua identidade não é autenticada. O parecer nunca altera spots, ranges, exports, certificados ou gates de publicação. Um veredito sem achados em três spots não aprova os outros 1.497.

## Validação e bloqueio de liberação

```bash
node --test tests/meta-audit-bundle.mjs tests/certification-registry-integrity.mjs tests/solver-comparator-integrity.mjs
npm run i18n:audit
npm test
node scripts/certify-all-1500-spots.mjs
```

No estado de origem, `npm test` tem 81 testes aprovados e uma falha em `tests/audit-simulator-uniqueness.mjs`: são exigidos 1.500 resultados independentemente certificados. O registro oficial também rejeita liberação com 0/1.500 certificados. O sucesso do workflow de pacote confirma sua geração e integridade; não significa certificação ou publicação do app.
