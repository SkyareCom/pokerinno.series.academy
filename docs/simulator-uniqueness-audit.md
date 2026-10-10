# Auditoria de spots 9-max

Estado: BLOQUEADO PARA CERTIFICACAO.

Evidencia: GitHub Actions 38013840293, commit b8f3527.

- Candidatos: 1500.
- Assinaturas estrategicas distintas: 1500.
- Duplicacoes: 0.
- Decisoes com certificacao independente: 0.
- Testes: 54 passaram, 1 falhou (audit-simulator-uniqueness.mjs).

As 720 decisoes preflop possuem referencias importadas DCFR 9-max RFI e correspondencia estrutural com as linhas importadas. Isso NAO equivale a certificacao independente do solver.

Os 780 candidatos pos-flop nao possuem solves associados. Nao contam como certificados.

Nao liberar os candidatos como banco validado. Nao remover o bloqueio de CI ate existir comprovacao individual verificavel de 1500 solves.

Log: https://github.com/SkyareCom/pokerinno.series.academy/actions/runs/38013840293
