/* Laboratoire ChatCore + copie isolée du vrai moteur Windows de D3-02. */
window.ChatCorePdfDemo={
  clientName:'Sophie Martin',
  typingSpeed:'normal',
  greeting:"Bonjour, j'ai un problème avec ma facture Orange : quand je l'ouvre, certains caractères ne s'affichent pas correctement. Pouvez-vous regarder ?",
  facts:{invoiceOpened:false,printPreviewOpened:false,readerOpened:false,pdfAssociationChanged:false,repairVerified:false},
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
      id:'reader-check',
      text:"Sophie, avez-vous pu comparer l'affichage de votre facture dans Adobe Acrobat Reader ?",
      answer:"Non, je n'ai pas encore ouvert la facture avec Adobe Acrobat Reader.",
      once:false,
      resolve:({facts})=>{
        if(!facts.readerOpened)return "Non, je n'ai pas encore ouvert la facture avec Adobe Acrobat Reader.";
        if(!facts.invoiceOpened)return "Oui, je viens de regarder dans Adobe Acrobat Reader : la facture s'affiche correctement. Je n'ai pas encore comparé avec Chrome.";
        return "Oui, j'ai comparé : la facture présente des caractères anormaux dans Chrome, mais elle s'affiche correctement dans Adobe Acrobat Reader.";
      }
    },
    {
      id:'repair-check',
      text:"Sophie, est-ce que votre facture s'ouvre désormais correctement ?",
      answer:"Non, je n'ai pas encore constaté de correction.",
      once:false,
      resolve:({facts})=>{
        if(facts.repairVerified)return "Oui, je viens de rouvrir la facture normalement : elle s'affiche correctement dans Adobe Acrobat Reader. Le problème est résolu.";
        if(facts.pdfAssociationChanged)return "Adobe Acrobat Reader est maintenant l'application par défaut, mais je préfère rouvrir la facture pour vérifier que le problème est bien résolu.";
        return "Non, nous n'avons pas encore vérifié que le problème est corrigé. Le fichier PDF s'ouvre toujours par défaut avec Chrome.";
      }
    },
    {
      id:'filename',
      text:'Quel est le nom du fichier qui pose problème ?',
      answer:'Le fichier s’appelle factureorange.pdf.'
    }
  ]
};