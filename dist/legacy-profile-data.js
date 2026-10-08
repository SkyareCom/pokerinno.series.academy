export const legacyProfile={
  items:[
    ['access','DADOS DE ACESSO','Forma de acesso, nome, e-mail e sessão.'],
    ['language','IDIOMA','PT-BR, EN-US e ES-ES.'],
    ['history','SALVAMENTO DOS TREINOS','Controle do salvamento automático do histórico.'],
    ['plans','PLANOS','Plano atual e opções preparadas do Academy.'],
    ['coach','ACADEMY COACH','Configuração de contato e consentimento do Coach.'],
    ['privacy','SOBRE E PRIVACIDADE','Privacidade, dados locais e exclusão de conta.']
  ],
  plans:[
    {id:'free',name:'FREE',price:'R$ 0',period:'SEM PRAZO',benefits:['Ranking de mãos, Streets e Blinds e Ante','5 questões fixas por tema','Histórico de treinos']},
    {id:'monthly',name:'MENSAL',price:'R$ 39,90',period:'/ MÊS'},
    {id:'semiannual',name:'SEMESTRAL',price:'R$ 179,90',period:'/ 6 MESES'},
    {id:'annual',name:'ANUAL',price:'R$ 219,90',period:'/ ANO'}
  ]
};
