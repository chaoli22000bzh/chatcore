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
        if(facts.repairVerified)return "Oui, depuis que vous avez rouvert ma facture avec Adobe Acrobat Reader, elle s'affiche correctement. Merci, le problème est résolu.";
        if(facts.pdfAssociationChanged)return "Vous avez changé l'application par défaut, mais nous n'avons pas encore vérifié le résultat. Pouvez-vous rouvrir ma facture ?";
        return "Non, nous n'avons pas encore vérifié que le problème est corrigé. Le fichier PDF s'ouvre toujours par défaut avec Chrome.";
      }
    },
    {
      id:'closing',
      text:"Sophie, j'ai terminé mon intervention. Pouvez-vous me confirmer que tout fonctionne correctement ?",
      answer:"Je préfère attendre la vérification avant de confirmer la fin du dépannage.",
      once:false,
      resolve:({facts})=>{
        if(facts.repairVerified)return "Oui, je vous confirme que ma facture s'ouvre correctement maintenant. Tout fonctionne, merci pour votre intervention. Bonne journée !";
        if(facts.pdfAssociationChanged)return "Merci, mais je préfère que vous vérifiiez la facture après votre modification avant de terminer l'intervention.";
        return "Je rencontre encore le problème avec ma facture. Je ne peux pas confirmer la fin de l'intervention pour le moment.";
      }
    },
    {
      id:'filename',
      text:'Quel est le nom du fichier qui pose problème ?',
      answer:'Le fichier s’appelle factureorange.pdf.'
    }
  ]
};