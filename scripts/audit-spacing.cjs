// Run against a served dist: ACADEMY_AUDIT_URL=http://127.0.0.1:8765 npm run spacing:audit
const assert=require('node:assert/strict');
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
(async()=>{
 const browser=await chromium.launch({...(process.env.CHROMIUM_PATH?{executablePath:process.env.CHROMIUM_PATH}:{}),args:['--no-sandbox','--disable-gpu']});
 const page=await browser.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
 const routes=['home','journey','chapter/discover','chapter/rules','chapter/betting','chapter/floor','chapter/formats','chapter/terms','chapter/math','play','simulator','practice','practice-module/rules-rank','practice-module/rules-pos','evolution','profile','profile/access','profile/language','profile/history','profile/plans','profile/coach','profile/privacy','procedure/emb','procedure/mis','procedure/irr'];
 let checks=0,paragraphs=0,steps=0;
 for(const width of [360,393,720,1280])for(const route of routes){
  await page.setViewportSize({width,height:852});await page.goto((process.env.ACADEMY_AUDIT_URL||'http://127.0.0.1:8765')+'/#'+route);await page.locator('#app > *').first().waitFor();
  if(route==='simulator')await page.locator('.simulator-page').waitFor();
  // Open all imported lesson content to audit the complete reading surface.
  await page.locator('#app details').evaluateAll(nodes=>nodes.forEach(n=>n.open=true));
  const result=await page.evaluate(()=>{
   const visible=e=>e.getClientRects().length>0;
   const violations=[];let ps=0,ss=0;
   for(const p of document.querySelectorAll('#app p+p'))if(visible(p)){
    const s=getComputedStyle(p),expected=parseFloat(s.lineHeight),margin=parseFloat(s.marginBlockStart);ps++;
    if(Math.abs(margin-expected)>1)violations.push('paragraph gap '+margin+' vs '+expected);
   }
   for(const step of document.querySelectorAll('#app .step'))if(visible(step)){
    const n=step.querySelector('.n'),text=n?.nextElementSibling;
    if(n&&text){ss++;if(text.getBoundingClientRect().left-n.getBoundingClientRect().right<8)violations.push('step number attached');}
   }
   if(location.hash==='#simulator'){
    const heading=document.querySelector('#app>.page-heading');
    const parts=heading?[heading.querySelector('.eyebrow'),heading.querySelector('h1'),heading.querySelector('p')]:[];
    if(parts.length!==3||parts.some(part=>!part))violations.push('simulator standard heading missing');
    else{
     const rects=parts.map(part=>part.getBoundingClientRect());
     if(rects.some(rect=>Math.abs(rect.left-rects[0].left)>1)||rects[1].top<rects[0].bottom-1||rects[2].top<rects[1].bottom-1)violations.push('simulator heading must stack and align left');
     if(getComputedStyle(parts[1]).fontSize!=='20px')violations.push('simulator title must use 20px');
    }
   }
   return {overflow:document.documentElement.scrollWidth>innerWidth,violations,ps,ss};
  });
  assert.equal(result.overflow,false,`${width} ${route}: horizontal overflow`);assert.deepEqual(result.violations,[],`${width} ${route}`);
  paragraphs+=result.ps;steps+=result.ss;checks++;
 }
 assert.deepEqual(errors,[]);assert(paragraphs>0&&steps>0);console.log(`PASS ${checks} route/viewport checks; ${paragraphs} paragraph gaps; ${steps} numbered steps`);await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});
