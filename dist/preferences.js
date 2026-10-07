export function readPreferences(storage){try{const p=JSON.parse(storage.getItem('academy.preferences')||'{}');return {sound:p?.sound===true,reducedMotion:p?.reducedMotion===true}}catch{return {sound:false,reducedMotion:false}}}
export function savePreferences(storage,value){try{storage.setItem('academy.preferences',JSON.stringify(value));return true}catch{return false}}
