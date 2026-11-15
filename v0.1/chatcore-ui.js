/* Adaptateur visuel ChatCore 0.1 : aucune connaissance métier. */
(function(global){
 'use strict';
 function mount(target,scenario){
   const root=typeof target==='string'?document.querySelector(target):target;
   if(!root)throw Error('ChatCore UI : élément introuvable');
   const chat=global.ChatCore.create(scenario);
   const client=scenario.clientName||'Client';
   root.classList.add('chatcore');
   root.innerHTML='<div class="cc-head"><span class="cc-avatar" aria-hidden="true"></span><div><strong class="cc-person"></strong><small>Conversation de support</small></div></div><div class="cc-history" role="log" aria-live="polite" aria-relevant="additions"></div><div class="cc-compose"><strong>Quel message veux-tu envoyer ?</strong><div class="cc-choices" role="group" aria-label="Messages proposés"></div><div class="cc-sendline"><span class="cc-preview" aria-live="polite">Sélectionne un message.</span><button class="cc-send" type="button" disabled>Envoyer</button></div></div>';
   root.querySelector('.cc-person').textContent=client;
   root.querySelector('.cc-avatar').textContent=client.split(/\s+/).map(x=>x[0]).join('').slice(0,2).toUpperCase();
   const historyHost=root.querySelector('.cc-history'),choiceHost=root.querySelector('.cc-choices'),preview=root.querySelector('.cc-preview'),send=root.querySelector('.cc-send');
   let selected=null,rendered=0;
   function show(state){
     // Un événement technique ne supprime jamais la conversation.
     if(state.history.length<rendered){historyHost.replaceChildren();rendered=0;}
     state.history.slice(rendered).forEach(message=>{
       const bubble=document.createElement('div');bubble.className='cc-bubble '+(message.role==='client'?'cc-client':'cc-me');
       const name=document.createElement('strong');name.className='cc-author';name.textContent=message.role==='client'?client:'Moi';
       const body=document.createElement('p');body.textContent=message.text;
       bubble.append(name,body);historyHost.append(bubble);
     });
     rendered=state.history.length;
     choiceHost.replaceChildren();selected=null;send.disabled=true;preview.textContent='Sélectionne un message.';
     chat.available().forEach(item=>{
       const b=document.createElement('button');b.type='button';b.className='cc-choice';b.textContent=item.text;b.setAttribute('aria-pressed','false');
       b.addEventListener('click',()=>{
         selected=item.id;
         [...choiceHost.children].forEach(x=>x.setAttribute('aria-pressed',String(x===b)));
         preview.textContent=item.text;send.disabled=false;
       });
       choiceHost.append(b);
     });
     if(!choiceHost.childElementCount)preview.textContent='Plus de message proposé pour le moment.';
     historyHost.scrollTop=historyHost.scrollHeight;
   }
   send.addEventListener('click',()=>{if(selected)chat.send(selected);});
   const unsubscribe=chat.subscribe(show);
   return Object.freeze({chat,restart:()=>chat.restart(),notify:event=>chat.notify(event),setFacts:patch=>chat.setFacts(patch),destroy:()=>{unsubscribe();root.replaceChildren();root.classList.remove('chatcore');}});
 }
 global.ChatCoreUI=Object.freeze({version:'0.1.0',mount});
})(window);
