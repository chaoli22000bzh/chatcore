/* ChatCore 0.1.0 - conversation déterministe et autonome.
 * Aucun service externe. Les scénarios et leurs réponses sont fournis par le projet hôte.
 */
(function(global){
  'use strict';
  function create(config){
    if(!config||!Array.isArray(config.messages))throw Error('ChatCore : messages manquants');
    const definitions=new Map();
    for(const item of config.messages){
      if(!item.id||typeof item.text!=='string'||typeof item.answer!=='string'||definitions.has(item.id))
        throw Error('ChatCore : message invalide ou identifiant dupliqué');
      definitions.set(item.id,item);
    }
    const listeners=new Set();
    const originalFacts=Object.assign({},config.facts||{});
    let facts=Object.assign({},originalFacts),history=[],asked=new Set(),revision=0;
    function snapshot(){return {history:history.map(x=>({...x})),asked:[...asked],facts:{...facts},revision};}
    function emit(){const state=snapshot();for(const fn of listeners)fn(state);}
    function add(role,text,id){history.push({role,text:String(text),id:id||null});revision++;}
    function responseFor(item){
      if(typeof item.resolve==='function')return item.resolve({facts:{...facts},asked:new Set(asked),history:snapshot().history});
      if(item.answers&&item.fact){
        const value=facts[item.fact],key=String(value);
        return Object.prototype.hasOwnProperty.call(item.answers,key)?item.answers[key]:(item.answers.default||item.answer);
      }
      return asked.has(item.id)&&item.repeat?item.repeat:item.answer;
    }
    function available(){
      return [...definitions.values()].filter(item=>{
        if(item.once!==false&&asked.has(item.id))return false;
        if(item.requires&&item.requires.some(id=>!asked.has(id)))return false;
        if(typeof item.enabled==='function'&&!item.enabled({facts:{...facts},asked:new Set(asked)}))return false;
        return true;
      }).map(({id,text})=>({id,text}));
    }
    function send(id){
      const item=definitions.get(id);
      if(!item||!available().some(m=>m.id===id))return false;
      const reply=responseFor(item);
      if(typeof reply!=='string')throw Error('ChatCore : réponse non textuelle');
      add('me',item.text,item.id);add('client',reply,item.id);asked.add(item.id);emit();return true;
    }
    function setFacts(patch){
      if(!patch||typeof patch!=='object'||Array.isArray(patch))throw Error('ChatCore : faits invalides');
      facts=Object.assign({},facts,patch);revision++;emit();return snapshot();
    }
    function notify(event){
      if(!event||typeof event.type!=='string')throw Error('ChatCore : événement invalide');
      // L'adaptateur du simulateur reste maître de l'état technique.
      // notify n'affiche pas automatiquement une réussite ni une réparation.
      if(config.events&&config.events[event.type]){
        const transition=config.events[event.type];
        if(typeof transition==='function'){
          const result=transition(event,{...facts});
          if(result&&typeof result==='object')setFacts(result);
        }else if(typeof transition==='object')setFacts(transition);
      }
      return snapshot();
    }
    function restart(){facts={...originalFacts};history=[];asked=new Set();revision=0;if(config.greeting)add('client',config.greeting,'greeting');emit();return snapshot();}
    function subscribe(fn){if(typeof fn!=='function')throw Error('ChatCore : écouteur invalide');listeners.add(fn);fn(snapshot());return ()=>listeners.delete(fn);}
    restart();
    return Object.freeze({send,available,setFacts,notify,restart,subscribe,getState:snapshot,version:'0.1.0'});
  }
  global.ChatCore=Object.freeze({version:'0.1.0',create});
})(typeof window!=='undefined'?window:globalThis);
