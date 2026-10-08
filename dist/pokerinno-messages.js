export function trainingNotice(activities=[],pending=0){
 if(pending>0)return {key:'messages.unsaved',params:{count:pending}};
 if(activities.length)return {key:'messages.progress',params:{count:activities.length}};
 return {key:'messages.start',params:{}};
}
