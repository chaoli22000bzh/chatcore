/* Adaptateur visuel ChatCore 0.1 : aucune connaissance métier. */
(function(global){
 'use strict';
 function mount(target,scenario){
   const root=typeof target==='string'?document.querySelector(target):target;
   if(!root)throw Error('ChatCore UI : élément introuvable');
   const chat=global.ChatCore.create(scenario);
   const client=scenario.clientName||'Client';
   root.classList.add('chatcore');
   root.innerHTML='<div class="cc-head"><span class="cc-avatar" aria-hidden="true"></span><div><strong class="cc-person"></strong><small>Conversation de support</small></div></div><div class="cc-history" role="log" aria-live="polite" aria-relevant="additions"></div><div class="cc-compose"><strong>Quel message veux-tu envoyer ?</strong><div class="cc-choices" role="group" aria-label="Messages à envoyer directement"></div><p class="cc-hint" aria-live="polite">Clique sur une phrase pour l'envoyer.</p></div>';
   root.querySelector('.cc-person').textContent=client;
   root.querySelector('.cc-avatar').textContent=client.split(/\s+/).map(x=>x[0]).join('').slice(0,2).toUpperCase();
   const historyHost=root.querySelector('.cc-history'),choiceHost=root.querySelector('.cc-choices'),hint=root.querySelector('.cc-hint');
   let rendered=0;
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
     choiceHost.replaceChildren();hint.textContent="Clique sur une phrase pour l'envoyer.";
     chat.available().forEach(item=>{
       const b=document.createElement('button');b.type='button';b.className='cc-choice';b.textContent=item.text;
       b.addEventListener('click',()=>{chat.send(item.id);});
       choiceHost.append(b);
     });
     if(!choiceHost.childElementCount)hint.textContent='Plus de message proposé pour le moment.';
     historyHost.scrollTop=historyHost.scrollHeight;
   }
   const unsubscribe=chat.subscribe(show);
   return Object.freeze({chat,restart:()=>chat.restart(),notify:event=>chat.notify(event),setFacts:patch=>chat.setFacts(patch),destroy:()=>{unsubscribe();root.replaceChildren();root.classList.remove('chatcore');}});
 }
 global.ChatCoreUI=Object.freeze({version:'0.1.0',mount});
})(window);
