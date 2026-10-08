import {t} from './i18n.js?v=practice-modules-20261008';
const escape=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const activities=new Map();let nextId=0;
export function sourceQuiz(questions){
 const id=String(nextId++);activities.set(id,questions);
 return `<details class="source-quiz" data-quiz="${id}"><summary>${t('quiz.title')} · ${questions.length}</summary><p class="quiz-progress" aria-live="polite">${t('quiz.progress')}: 0 / ${questions.length}</p><div class="source-quiz-list">${questions.map((q,i)=>{
 const items=q.type==='sequence'?[...(q.items||q.answer)].reverse():q.options||[];
 return `<section class="source-question" data-question="${i}"><strong>${String(i+1).padStart(2,'0')} · ${escape(q.prompt||q.question)}</strong>${q.visual?.cards?`<p>${q.visual.cards.map(escape).join(' ')}</p>`:''}${q.type==='sequence'?`<p>${t('quiz.sequence')}</p>`:''}<div class="quiz-options">${items.map((item,j)=>`<button type="button" data-quiz-option="${j}" aria-pressed="false">${escape(item)}</button>`).join('')}</div><p class="quiz-selection"></p><div class="quiz-feedback" role="status" hidden></div><button type="button" class="quiz-reset" data-quiz-reset hidden>${t('quiz.reset')}</button></section>`;
 }).join('')}</div></details>`;
}
document.addEventListener('click',event=>{
 const button=event.target.closest('[data-quiz-option],[data-quiz-reset]');if(!button)return;
 const section=button.closest('[data-question]'),quiz=button.closest('[data-quiz]');if(!quiz)return;
 const q=activities.get(quiz.dataset.quiz)?.[Number(section.dataset.question)];if(!q)return;
 const options=[...section.querySelectorAll('[data-quiz-option]')],feedback=section.querySelector('.quiz-feedback'),selection=section.querySelector('.quiz-selection'),reset=section.querySelector('[data-quiz-reset]');
 if(button.hasAttribute('data-quiz-reset')){options.forEach(b=>{b.disabled=false;b.setAttribute('aria-pressed','false')});delete section.dataset.selection;delete section.dataset.answered;selection.textContent='';feedback.hidden=true;feedback.textContent='';reset.hidden=true;}
 else{
 if(section.dataset.answered)return;
 const items=q.type==='sequence'?[...(q.items||q.answer)].reverse():q.options||[];
 let answer;
 if(q.type==='sequence'){
 const selected=JSON.parse(section.dataset.selection||'[]');selected.push(Number(button.dataset.quizOption));section.dataset.selection=JSON.stringify(selected);button.disabled=true;button.setAttribute('aria-pressed','true');selection.textContent=selected.map(i=>items[i]).join(' → ');if(selected.length<items.length)return;answer=selected.map(i=>items[i]);
 }else{answer=items[Number(button.dataset.quizOption)];button.setAttribute('aria-pressed','true')}
 const correct=JSON.stringify(answer)===JSON.stringify(q.answer);section.dataset.answered='true';options.forEach(b=>b.disabled=true);
 feedback.innerHTML=`<strong>${t(correct?'quiz.correct':'quiz.incorrect')}</strong><p><b>${t('quiz.answer')}:</b> ${escape(Array.isArray(q.answer)?q.answer.join(' → '):q.answer)}</p><p><b>${t('quiz.why')}:</b> ${escape(q.analysis||q.why||'')}</p>`;feedback.hidden=false;reset.hidden=false;
 }
 quiz.querySelector('.quiz-progress').textContent=`${t('quiz.progress')}: ${quiz.querySelectorAll('[data-answered]').length} / ${activities.get(quiz.dataset.quiz).length}`;
});
