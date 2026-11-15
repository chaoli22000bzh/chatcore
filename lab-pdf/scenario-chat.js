/* Laboratoire ChatCore + copie isolée du vrai moteur Windows de D3-02. */
window.ChatCorePdfDemo={
  clientName:'Sophie Martin',
  typingSpeed:'normal',
  greeting:"Bonjour, j'ai un problème avec ma facture Orange : quand je l'ouvre, certains caractères ne s'affichent pas correctement. Pouvez-vous regarder ?",
  facts:{invoiceOpened:false},
  messages:[
    {
      id:'pdf-visible',
      text:'Sophie, voyez-vous votre facture Orange à l’écran ?',
      answer:"Non, je ne vois pas encore ma facture à l'écran.",
      fact:'invoiceOpened',
      answers:{
        false:"Non, je ne vois pas encore ma facture à l'écran.",
        true:"Oui, je vois maintenant la facture Orange dans Google Chrome. Certains caractères semblent anormaux."
      },
      once:false
    },
    {
      id:'filename',
      text:'Quel est le nom du fichier qui pose problème ?',
      answer:'Le fichier s’appelle factureorange.pdf.'
    }
  ]
};