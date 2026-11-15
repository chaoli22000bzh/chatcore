/* Laboratoire ChatCore + copie isolée du vrai moteur Windows de D3-02. */
window.ChatCorePdfDemo={
  clientName:'Sophie Martin',
  typingSpeed:'normal',
  greeting:"Bonjour, j'ai un problème avec ma facture Orange : quand je l'ouvre, certains caractères ne s'affichent pas correctement. Pouvez-vous regarder ?",
  facts:{invoiceOpened:false,printPreviewOpened:false},
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
      id:'preview-visible',
      text:"Sophie, voyez-vous l'aperçu avant impression de votre facture ?",
      answer:"Non, l'aperçu avant impression n'est pas encore affiché.",
      fact:'printPreviewOpened',
      answers:{
        false:"Non, l'aperçu avant impression n'est pas encore affiché.",
        true:"Oui, je vois l'aperçu avant impression dans Chrome. Les caractères sont encore plus déformés que sur le document à l'écran."
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