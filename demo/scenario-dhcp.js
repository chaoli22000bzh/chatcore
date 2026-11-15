/* Scénario pédagogique de démonstration. Il appartient à l'application, pas à ChatCore. */
window.ChatCoreDemo={
 clientName:'Sophie Martin',
 typingSpeed:'normal', // Essai enseignant : 35 ms par lettre.
 greeting:"Bonjour,\nPlusieurs ordinateurs de notre site n'arrivent plus à accéder au réseau. Pouvez-vous regarder ?\nMerci, Sophie.",
 facts:{networkRestored:false},
 events:{'dhcp.lease-restored':{networkRestored:true}},
 messages:[
  {id:'scope',text:'Est-ce que tous les ordinateurs sont concernés ?',answer:'Non, seuls les PC du VLAN 30 ont le problème. Ceux du VLAN 10 fonctionnent normalement.'},
  {id:'when',text:'Depuis quand rencontrez-vous ce problème ?',answer:'Depuis ce matin.'},
  {id:'symptoms',text:'Que se passe-t-il exactement sur les ordinateurs concernés ?',answer:"Ils n'arrivent plus à accéder au réseau."},
  {id:'others',text:"Est-ce que d'autres personnes rencontrent le même problème ?",answer:'Oui, plusieurs postes sont concernés.'},
  {id:'location',text:'Sur quel site se trouvent les ordinateurs concernés ?',answer:'Sur le site de Rennes.'},
  {id:'reboot',text:'Avez-vous essayé de redémarrer un ordinateur concerné ?',answer:"Je ne sais pas si cela a été fait sur tous les PC concernés."},
  {id:'access',text:'Pouvez-vous me laisser accéder à un poste pour effectuer des vérifications ?',answer:'Oui, nous pouvons organiser un accès à un poste concerné.'},
  {id:'technical',text:"Connaissez-vous l'adresse IP des ordinateurs concernés ?",answer:'Non, je ne connais pas leurs adresses IP.'},
  {id:'check',text:'Sophie, est-ce que les ordinateurs accèdent maintenant au réseau ?',fact:'networkRestored',
    answer:"Non, ils n'arrivent toujours pas à accéder au réseau.",
    answers:{true:"Oui, je viens de vérifier : l'accès au réseau fonctionne à nouveau.",false:"Non, ils n'arrivent toujours pas à accéder au réseau."},
    once:false}
 ]
};