export function trainingNotice(activities=[],pending=0){
 if(pending>0)return {key:'messages.unsaved',params:{count:pending}};
 if(activities.length)return {key:'messages.progress',params:{count:activities.length}};
 return {key:'messages.start',params:{}};
}

const preferenceKey='academy.pokerinno.messages.v1',visitKey='academy.pokerinno.last-access.v1';
export const messageTypes=['welcome','training','theory','forgetting'];
export function readMessagePreferences(storage){let value;try{value=JSON.parse(storage.getItem(preferenceKey)||'{}')}catch{}return Object.fromEntries(messageTypes.map(key=>[key,value?.[key]!==false]))}
export function saveMessagePreference(storage,type,enabled){if(!messageTypes.includes(type))return false;try{storage.setItem(preferenceKey,JSON.stringify({...readMessagePreferences(storage),[type]:enabled===true}));return true}catch{return false}}
export function trackMessageVisit(storage,now=Date.now()){let previous=0;try{previous=Number(storage.getItem(visitKey));storage.setItem(visitKey,String(now))}catch{}return Number.isFinite(previous)&&previous>0&&now-previous>3*86400000}
export function buildPokerinnoMessages({preferences={},activities=[],pending=0,absent=false}={}){
 const messages=[];
 if(absent&&preferences.forgetting!==false)messages.push({type:'forgetting',key:'messages.return',params:{},mood:'surprised',href:'#practice',action:'messages.practice'});
 if(preferences.welcome!==false)messages.push({type:'welcome',key:'messages.welcome',params:{},mood:'happy',href:'#journey',action:'messages.learn'});
 if(preferences.training!==false){const notice=trainingNotice(activities,pending);messages.push({type:'training',...notice,mood:'motivated',href:pending?'#profile/history':'#practice',action:pending?'messages.save':'messages.practice'})}
 if(preferences.theory!==false){const mistake=[...activities].filter(a=>a.correct===false).sort((a,b)=>b.at-a.at)[0];const routes={rules:'rules',staff:'floor',formats:'formats',terms:'terms',math:'math'};messages.push({type:'theory',key:mistake?'messages.theoryMistake':'messages.theory',params:{},mood:'learning',href:mistake&&routes[mistake.theme]?'#chapter/'+routes[mistake.theme]:'#journey',action:'messages.review'})}
 return messages;
}
