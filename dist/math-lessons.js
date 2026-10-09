import data from './math-lesson-data.json?v=math-dedup-v2' with {type:'json'};

export const mathLessonData=data;
const escape=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

// Explain each method once; numerical variants remain examples within that lesson.
// Plain paragraphs use the shared Academy reading style, including inline examples.
export function renderMathLessons(translate,locale='pt-BR'){
  const number=new Intl.NumberFormat(locale,{maximumFractionDigits:2});
  const references=new Map(data.items.map(item=>[item.id,item.params]));
  const lessons=new Map(data.lessons.map(lesson=>[lesson.id,lesson]));
  const paragraph=(part,example=false)=>{
    const params=Object.fromEntries(Object.entries(references.get(part.source)||{}).map(([key,value])=>[key,typeof value==='number'?number.format(value):value]));
    const text=(example?translate('math.example')+' ':'')+translate(part.key,params);
    return '<p'+(example?' data-math-example':'')+'>'+escape(text)+'</p>';
  };
  return '<div class="discover-page glossary-page math-lessons">'+data.groups.map(group=>
    '<section class="discover-section glossary-group"><h3>'+escape(translate('math.groups.'+group.id))+'</h3><div class="glossary-list">'+group.items.map(id=>{
      const lesson=lessons.get(id);
      return '<article class="glossary-term math-lesson" data-math-item="'+id+'"><strong>'+escape(translate('math.lessons.'+id+'.name'))+'</strong>'+lesson.paragraphs.map(part=>paragraph(part)).join('')+lesson.examples.slice(0,1).map(part=>paragraph(part,true)).join('')+'</article>';
    }).join('')+'</div></section>'
  ).join('')+'</div>';
}
