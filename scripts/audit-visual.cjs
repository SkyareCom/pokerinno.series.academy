// Render every route and exercise; inspect text rather than only CSS declarations.
const fs=require('node:fs');
const {execFileSync}=require('node:child_process');
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const base=process.env.ACADEMY_AUDIT_URL||'http://127.0.0.1:8765';
const baseline=process.env.VISUAL_AUDIT_MODE==='baseline';
const report={cases:[],errors:[],questions:0,questionViews:0};
fs.mkdirSync('reports/visual',{recursive:true});
const fixed=['home','journey','practice','play','evolution','profile','chapter/discover','chapter/rules','chapter/betting','chapter/floor','chapter/formats','chapter/math','chapter/terms','chapter/etiquette','chapter/house-rules','chapter/dealing','chapter/decisions','chapter/practice','procedure/emb','procedure/mis','procedure/irr','profile/access','profile/language','profile/history','profile/plans','profile/coach','profile/privacy','practice-tool/0','practice-tool/1','practice-tool/2'];
async function inspect(page,label){
 const r=await page.evaluate(()=>{
  const visible=e=>e.getClientRects().length&&getComputedStyle(e).visibility!=='hidden';
  const findings=[],fonts={},words=[];
  const root=document.querySelector('#app');
  const bad=(kind,e,detail)=>findings.push({kind,text:e?.textContent.trim().slice(0,110),class:e?.className?.baseVal??e?.className,detail});
  const walker=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);
  let n;
  while(n=walker.nextNode()){
   const e=n.parentElement,text=n.textContent.trim();
   if(!text||!visible(e)||e.closest('script,style,footer,.mobile-nav'))continue;
   const s=getComputedStyle(e),size=parseFloat(s.fontSize);
   words.push(text);fonts[size]=(fonts[size]||0)+1;
   if(![12,16,20].includes(size))bad('font-scale',e,size);
   if(['hidden','clip'].includes(s.overflowY)&&e.clientHeight>0&&e.scrollHeight>e.clientHeight+2)bad('clipped-text',e,'height');
  }
  for(const e of root.querySelectorAll('h1,.page-title'))if(visible(e)&&getComputedStyle(e).fontSize!=='20px')bad('page-title-size',e,getComputedStyle(e).fontSize);
  for(const e of root.querySelectorAll('h2,h3,h4,h5,h6,.source-lesson>summary>strong,.glossary-term>strong,.next-app>strong,.editorial-note>strong,.discover-timeline strong,.source-body .ch>strong,.source-body .ci>strong,.source-body .rname,.quiz-counters article>span,.stats-metrics article>span')){
   if(!visible(e)||e.closest('.page-heading,.section-top')||e.matches('.source-question>h2'))continue;
   const s=getComputedStyle(e);
   if(s.color!=='rgb(244, 242, 231)')bad('title-color',e,s.color);
   if(s.textTransform!=='uppercase')bad('title-case',e,s.textTransform);
   const nested=e.closest('.source-body,.discover-compare,.stats-duel,.stats-swot,.decision-steps')||e.matches('.glossary-term>strong,.discover-timeline strong,.quiz-counters article>span,.stats-metrics article>span');
   const direct=e.matches(':is(.etiquette-page,.procedure-body)>.lg>.lc>h3')&&!e.closest('.source-lesson');
   const expected=nested&&!direct?'12px':'16px';
   if(s.fontSize!==expected)bad('card-title-size',e,s.fontSize+' / '+expected);
  }
  for(const e of root.querySelectorAll('p,li,small,label,input,select,textarea'))if(visible(e)&&getComputedStyle(e).fontSize!=='12px')bad('copy-size',e,getComputedStyle(e).fontSize);
  for(const p of root.querySelectorAll('p+p'))if(visible(p)){
   const s=getComputedStyle(p);if(Math.abs(parseFloat(s.marginBlockStart)-parseFloat(s.lineHeight))>1)bad('paragraph-gap',p,s.marginBlockStart+' / '+s.lineHeight);
  }
  for(const card of root.querySelectorAll('.learn-extra-pokerinno,.chapter:not(.lesson-block),.next-app'))if(visible(card)){
   const cr=card.getBoundingClientRect(),s=getComputedStyle(card);
   if(cr.height<99)bad('navigation-height',card,cr.height);
   for(const e of card.querySelectorAll('h3,p,strong,span:not(.pokerinno-sprite)'))if(visible(e)&&!e.closest('.learn-extra-host')){
    const er=e.getBoundingClientRect();if(er.bottom>cr.bottom+1||er.right>cr.right+1||er.left<cr.left-1)bad('card-content-overflow',e,{card:cr.height,bottom:er.bottom-cr.bottom,right:er.right-cr.right});
   }
   if(s.borderTopWidth!=='1px'||s.borderRadius!=='16px')bad('navigation-border',card,s.borderTopWidth+' / '+s.borderRadius);
  }
  const geometry=(e,radius,color,padding)=>{
   if(!visible(e))return;
   const s=getComputedStyle(e);
   for(const side of ['Top','Right','Bottom','Left'])if(s['border'+side+'Width']!=='1px'||s['border'+side+'Color']!==color)bad('card-border',e,side+' '+s['border'+side+'Width']+' '+s['border'+side+'Color']);
   if(s.borderRadius!==radius)bad('card-radius',e,s.borderRadius+' / '+radius);
   if(padding!==undefined&&['Top','Right','Bottom','Left'].some(side=>s['padding'+side]!==padding))bad('card-padding',e,s.padding+' / '+padding);
  };
  const inset=innerWidth<=800?'12px':'16px';
  for(const e of root.querySelectorAll('.chapter,.feature,.discover-section,.discover-hero-card,.stats-panel,.decision-cycle,.empty,.next-app,.setting,.editorial-note,.betting-info-card'))geometry(e,'16px','rgba(246, 165, 64, 0.32)',inset);
  for(const e of root.querySelectorAll('.source-lesson,.learn-extra-pokerinno,.pokerinno-context,.hero'))geometry(e,'16px','rgba(246, 165, 64, 0.32)');
  for(const e of root.querySelectorAll('.learn-extra-copy,.pokerinno-context>div:last-child,.source-lesson>summary'))if(visible(e)){
   const s=getComputedStyle(e);if(['Top','Right','Bottom','Left'].some(side=>s['padding'+side]!==inset))bad('card-padding',e,s.padding+' / '+inset);
  }
  for(const e of root.querySelectorAll('.glossary-term,.discover-compare article,.stats-duel article,.stats-swot article,.decision-steps li,.quiz-counters article,.stats-metrics article,.source-body .lc,.source-body .ch,.source-body .ci,.source-body .tip,.source-body .rrow')){
   if(e.closest('.betting-info-card'))continue; // These imported blocks are intentionally flattened into a primary card.
   const direct=e.matches(':is(.etiquette-page,.procedure-body)>.lg>.lc')&&!e.closest('.source-lesson');
   geometry(e,direct?'16px':'12px',direct?'rgba(246, 165, 64, 0.32)':'rgba(246, 165, 64, 0.18)',direct?inset:'12px');
  }
  for(const e of root.querySelectorAll('.list,.grid,.journey-chapters,.source-group,.stats-dashboard,.quiz-player,.discover-page,.glossary-list,.decision-steps,.level-list,.betting-learning-path,.betting-info-grid,.source-body .lg,.source-body .cg,.source-body .compare,.source-body .ranking,.source-body .steps,.stats-metrics,.quiz-counters,.stats-swot,.stats-duel,.training-session-metrics,.discover-compare,.discover-steps,.discover-timeline,.quiz-options'))if(visible(e)){
   const s=getComputedStyle(e);if(s.rowGap!=='10px'||s.columnGap!=='10px')bad('structural-gap',e,s.rowGap+' / '+s.columnGap);
  }
  const nav=[...document.querySelectorAll('.mobile-nav>a')];
  if(nav.length!==5)bad('footer-count',null,nav.length);
  const destinations=['#home','#journey','#practice','#play','#evolution'];
  nav.forEach((e,i)=>{const icon=e.querySelector('.nav-symbol'),s=getComputedStyle(icon);if(e.getAttribute('href')!==destinations[i]||getComputedStyle(e).fontSize!=='10px'||s.width!=='25px'||s.height!=='25px'||s.fontSize!=='25px')bad('frozen-footer',e,'geometry or route');});
  if(document.documentElement.scrollWidth>innerWidth+1)bad('horizontal-overflow',root,document.documentElement.scrollWidth+' / '+innerWidth);
  return {findings,fonts,textNodes:words.length,words:words.join(' ').split(/\s+/).length};
 });
 report.cases.push({label,...r});
}
async function open(page,route){
 await page.goto(base+'/?audit='+encodeURIComponent(route)+'#'+route);
 await page.locator('#app>*').first().waitFor();
 await page.evaluate(()=>document.fonts.ready);
 await page.locator('#app details').evaluateAll(nodes=>nodes.forEach(n=>n.open=true));
}
async function loginStyles(page){return page.evaluate(()=>[...document.querySelectorAll('#app *')].map(e=>{
 const s=getComputedStyle(e),r=e.getBoundingClientRect();
 return {tag:e.tagName,class:e.className?.baseVal??e.className,text:e.children.length?'':e.textContent,font:s.fontSize,weight:s.fontWeight,color:s.color,background:s.backgroundColor,border:s.border,padding:s.padding,gap:s.gap,radius:s.borderRadius,width:Math.round(r.width*100)/100,height:Math.round(r.height*100)/100};
}));}
(async()=>{
 const browser=await chromium.launch({args:['--no-sandbox','--disable-gpu']});
 try{
  const auditViewport=async(locale,width)=>{
   const context=await browser.newContext({viewport:{width,height:852},locale});
   await context.addInitScript(locale=>localStorage.setItem('stackup.locale',locale),locale);
   const page=await context.newPage();page.on('pageerror',e=>report.errors.push(e.message));
   await open(page,'practice');
   const modules=await page.locator('a[href^="#practice-module/"]').evaluateAll(nodes=>nodes.map(n=>n.getAttribute('href').slice(1)));
   for(const route of [...fixed,...modules]){
    await open(page,route);await inspect(page,locale+'/'+width+'/'+route);
    if(!baseline&&width===393&&locale==='pt-BR'&&['home','journey','chapter/rules','chapter/etiquette','practice','profile'].includes(route))await page.screenshot({path:'reports/visual/'+route.replaceAll('/','-')+'.png'});
    if(route.startsWith('practice-module/')&&!baseline){
     const total=Number((await page.locator('.source-question>.eyebrow').innerText()).match(/\/\s*(\d+)/)[1]);
     if(locale==='pt-BR'&&width===393)report.questions+=total;
     for(let i=0;i<total;i++){
      if(i){await page.locator('[data-quiz-next]').press('Enter');await inspect(page,locale+'/'+width+'/'+route+'/question/'+(i+1));}
      report.questionViews++;
      const current=await page.locator('.source-question>.eyebrow').innerText();
      if(!current.startsWith((i+1)+' /')||!await page.locator('[data-quiz-option]:enabled').count())throw new Error('Quiz traversal '+locale+'/'+width+'/'+route+'/'+(i+1)+': '+current+'; '+await page.locator('.quiz-player').innerText());
      do{const option=page.locator('[data-quiz-option]:enabled').first();if(i)await option.press('Enter');else await option.click();}while(await page.locator('[data-quiz-option]:enabled').count());
      await inspect(page,locale+'/'+width+'/'+route+'/feedback/'+(i+1));
     }
     console.log('Audited '+locale+'/'+width+'/'+route+': '+total+' questions and feedback');
    }
   }
   await open(page,'evolution');await inspect(page,locale+'/'+width+'/evolution/with-history');
   await open(page,'home');await page.locator('header [data-help]').click();
   await inspect(page,locale+'/'+width+'/messages');await page.locator('.pokerinno-dismiss').click();
   await open(page,'profile');await page.locator('[data-series]').first().click();
   await inspect(page,locale+'/'+width+'/dialog');await page.locator('#dialog .close').click();
   await page.goto(base+'/#login');await page.locator('.entry-form').waitFor();await page.evaluate(()=>document.fonts.ready);
   const current=await loginStyles(page);
   if(!baseline){
    const original={};for(const file of ['styles.css','spacing.css'])original[file]=execFileSync('git',['show','91e217dd155eac2a03b75b8387de6f9dc992e3fe:dist/'+file],{encoding:'utf8',maxBuffer:2e6});
    await page.route('**/*.css*',route=>{const file=new URL(route.request().url()).pathname.split('/').pop();return original[file]?route.fulfill({contentType:'text/css',body:original[file]}):route.continue();});
    await page.reload();await page.locator('.entry-form').waitFor();await page.evaluate(()=>document.fonts.ready);
    const frozen=await loginStyles(page);
    if(JSON.stringify(current)!==JSON.stringify(frozen))report.errors.push('Frozen login changed: '+locale+'/'+width);
   }
   await context.close();
  };
  // Three independent language contexts avoid serializing the complete responsive matrix.
  await Promise.all((baseline?['pt-BR']:['pt-BR','en-US','es-ES']).map(async locale=>{
   for(const width of baseline?[393]:[360,393,720,1280])await auditViewport(locale,width);
  }));
 }finally{await browser.close();}
 const problems=report.cases.flatMap(c=>c.findings.map(f=>({label:c.label,...f})));
 report.summary={cases:report.cases.length,questions:report.questions,questionViews:report.questionViews,textNodes:report.cases.reduce((n,c)=>n+c.textNodes,0),words:report.cases.reduce((n,c)=>n+c.words,0),violations:problems.length,errors:report.errors.length};
 fs.writeFileSync('reports/visual/audit.json',JSON.stringify(report,null,2));
 const unique=[...new Map(problems.map(p=>[JSON.stringify([p.kind,p.class,p.detail]),p])).values()];
 console.log(JSON.stringify(report.summary));console.log(JSON.stringify(unique.slice(0,100),null,2));
 if(problems.length||report.errors.length){console.error(report.errors);process.exitCode=1;}
})().catch(e=>{console.error(e);fs.writeFileSync('reports/visual/audit.json',JSON.stringify(report,null,2));process.exit(1);});
