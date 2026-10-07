import test from 'node:test';
import assert from 'node:assert/strict';
import {messages,supportedLanguages,createTranslator} from '../dist/i18n.js';

function flattenKeys(value,prefix=''){
  const keys=[];
  for(const [key,item] of Object.entries(value)){
    const path=prefix?`${prefix}.${key}`:key;
    if(item&&typeof item==='object'&&!Array.isArray(item)) keys.push(...flattenKeys(item,path));
    else keys.push(path);
  }
  return keys.sort();
}

test('all supported languages expose the same translation keys',()=>{
  const [baseLanguage,...others]=supportedLanguages;
  const baseKeys=flattenKeys(messages[baseLanguage]);
  for(const language of others){
    assert.deepEqual(
      flattenKeys(messages[language]),
      baseKeys,
      `${language} translation keys must match ${baseLanguage}`
    );
  }
});

test('all translation values are non-empty strings',()=>{
  for(const language of supportedLanguages){
    const walk=(value,path='')=>{
      for(const [key,item] of Object.entries(value)){
        const current=path?`${path}.${key}`:key;
        if(item&&typeof item==='object'&&!Array.isArray(item)) walk(item,current);
        else{
          assert.equal(typeof item,'string',`${language}:${current} must be a string`);
          assert.ok(item.trim(),`${language}:${current} must not be empty`);
        }
      }
    };
    walk(messages[language]);
  }
});

test('translator resolves every catalog key for every language',()=>{
  const keys=flattenKeys(messages['pt-BR']);
  for(const language of supportedLanguages){
    const t=createTranslator(language);
    for(const key of keys){
      assert.notEqual(t(key),key,`${language} must resolve ${key}`);
    }
  }
});
