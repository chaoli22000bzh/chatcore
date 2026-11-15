/* Adaptateur visuel ChatCore 0.1. Les réponses restent déterministes.
 * L'animation ne modifie ni l'historique du moteur ni les faits techniques. */
(function(global){
 'use strict';
 function mount(target,scenario){
   const root=typeof target==='string'?document.querySelector(target):target;
   if(!root)throw Error('ChatCore UI : élément introuvable');
   const chat=global.ChatCore.create(scenario);
   const client=scenario.clientName||'Client';
   root.classList.add('chatcore');
   root.innerHTML='<div class="cc-head"><span class="cc-avatar" aria-hidden="true"></span><div><strong class="cc-person"></strong><small>Conversation de support</small></div></div><div class="cc-history" role="log" aria-live="polite" aria-relevant="additions"></div><div class="cc-compose"><strong>Quel message veux-tu envoyer ?</strong><div class="cc-choices" role="group" aria-label="Messages à envoyer directement"></div><p class="cc-hint" aria-live="polite">Clique sur une phrase pour envoyer le message.</p></div>';
   root.querySelector('.cc-person').textContent=client;
   root.querySelector('.cc-avatar').textContent=client.split(/\s+/).map(x=>x[0]).join('').slice(0,2).toUpperCase();
   const historyHost=root.querySelector('.cc-history'),choiceHost=root.querySelector('.cc-choices'),hint=root.querySelector('.cc-hint');
   const reducedMotion=!!(global.matchMedia&&global.matchMedia('(prefers-reduced-motion: reduce)').matches);
   let rendered=0,typing=null,destroyed=false;
   let typingSpeed=scenario.typingSpeed??'slow';
   function scrollEnd(){historyHost.scrollTop=historyHost.scrollHeight;}
   function cancelTyping(){
     if(typing){clearTimeout(typing.timer);typing=null;}
   }
   function makeBubble(message){
     const bubble=document.createElement('div');
     bubble.className='cc-bubble '+(message.role==='client'?'cc-client':'cc-me');
     const name=document.createElement('strong');
     name.className='cc-author';name.textContent=message.role==='client'?client:'Moi';
     const body=document.createElement('p');
     // Une seule annonce accessible, pas une annonce répétée à chaque lettre.
     body.setAttribute('aria-label',message.text);
     bubble.append(name,body);
     historyHost.append(bubble);
     return body;
   }
   function renderChoices(){
     choiceHost.replaceChildren();
     hint.textContent='Clique sur une phrase pour envoyer le message.';
     chat.available().forEach(item=>{
       const b=document.createElement('button');
       b.type='button';b.className='cc-choice';b.textContent=item.text;
       b.disabled=!!typing;
       b.addEventListener('click',()=>{if(!typing&&!destroyed)chat.send(item.id);});
       choiceHost.append(b);
     });
     if(typing)hint.textContent=client+' écrit…';
     else if(!choiceHost.childElementCount)hint.textContent='Plus de message proposé pour le moment.';
   }
   function finishTyping(){
     if(!typing)return;
     const item=typing;clearTimeout(item.timer);typing=null;
     item.body.textContent=item.message.text;
     scrollEnd();renderChoices();
   }
   function animateReply(message){
     const body=makeBubble(message);
     const chars=Array.from(message.text);
     if(reducedMotion||chars.length===0){
       body.textContent=message.text;
       scrollEnd();
       return;
     }
     // Une lettre à la fois, vitesse configurable par scénario (lent 65, normal 35, rapide 15 ms).
     const profiles={slow:65,normal:35,fast:15};
     const setting=typingSpeed;
     const tickMs=typeof setting==='number'&&Number.isFinite(setting)
       ?Math.max(10,Math.min(200,setting))
       :(profiles[setting]??profiles.slow);
     typing={body,message,chars,index:0,timer:null};
     function tick(){
       if(destroyed||!typing||typing.body!==body)return;
       const item=typing;
       item.index=Math.min(chars.length,item.index+1);
       body.textContent=chars.slice(0,item.index).join('');
       scrollEnd();
       if(item.index>=chars.length){finishTyping();return;}
       item.timer=setTimeout(tick,tickMs);
     }
     typing.timer=setTimeout(tick,280);
   }
   function show(state){
     if(destroyed)return;
     if(state.history.length<rendered){
       cancelTyping();historyHost.replaceChildren();rendered=0;
     }
     const newMessages=state.history.slice(rendered);
     // Si un fait technique est communiqué pendant une réponse en cours, l'animation continue.
     // Une nouvelle conversation ou un retour historique ne laisse aucun minuteur orphelin.
     if(newMessages.length&&typing)finishTyping();
     newMessages.forEach(message=>{
       if(message.role==='client'&&message.id!=='greeting')animateReply(message);
       else{
         const body=makeBubble(message);body.textContent=message.text;scrollEnd();
       }
     });
     rendered=state.history.length;
     renderChoices();
   }
   const unsubscribe=chat.subscribe(show);
   return Object.freeze({
     chat,
     restart:()=>{cancelTyping();chat.restart();},
     notify:event=>chat.notify(event),
     setFacts:patch=>chat.setFacts(patch),
     setTypingSpeed:value=>{if(value!=='slow'&&value!=='normal'&&value!=='fast'&&!(typeof value==='number'&&Number.isFinite(value)))throw Error('ChatCore UI : vitesse invalide');typingSpeed=value;return typingSpeed;},
     destroy:()=>{destroyed=true;cancelTyping();unsubscribe();root.replaceChildren();root.classList.remove('chatcore');}
   });
 }
 global.ChatCoreUI=Object.freeze({version:'0.1.0',mount});
})(window);
