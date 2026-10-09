import data from './math-lesson-data.json?v=math-lessons-v1' with {type:'json'};

export const mathLessonData=data;
export const mathFields=['purpose','when','how','example'];
const escape=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

// Keep educational references separate from the original practice question bank.
// The shared glossary classes retain approved typography, borders and spacing.
export function renderMathLessons(translate,locale='pt-BR'){
  const number=new Intl.NumberFormat(locale,{maximumFractionDigits:2});
  const items=new Map(data.items.map(item=>[item.id,item]));
  return `<div class="discover-page glossary-page math-lessons">${data.groups.map(group=>`<section class="discover-section glossary-group"><h3>${escape(translate('math.groups.'+group.id))}</h3><div class="glossary-list">${group.items.map(id=>{
    const item=items.get(id);
    const params=Object.fromEntries(Object.entries(item.params).map(([key,value])=>[key,typeof value==='number'?number.format(value):value]));
    const prefix='math.items.'+id+'.';
    return `<article class="glossary-term math-lesson" data-math-item="${id}"><strong>${escape(translate(prefix+'name'))}</strong>${mathFields.map(field=>`<p data-math-field="${field}"><strong>${escape(translate('math.labels.'+field))}:</strong> ${escape(translate(prefix+field,params))}</p>`).join('')}</article>`;
  }).join('')}</div></section>`).join('')}</div>`;
}
