# ChatCore

Composant conversationnel commun et réutilisable pour les simulations pédagogiques de support informatique.

## Première version expérimentale : 0.1.0

**Laboratoire DHCP :** https://chaoli22000bzh.github.io/chatcore/  
**Laboratoire PDF D3-02 :** https://chaoli22000bzh.github.io/chatcore/lab-pdf.html

La version 0.1 propose des messages prédéfinis envoyés par l'élève (« Moi ») et des réponses déterministes d'un client virtuel. Les interlocuteurs sont distingués par deux couleurs, sur ordinateur comme sur smartphone. Dans C², l'interface suit automatiquement les cinq thèmes officiels (Clair, Sombre, TRON, Star Wars, Minitel 80).

**Périmètre :** le chat reste indépendant du diagnostic. Il n'exécute aucune intervention technique et ne prétend jamais résoudre un incident. Il peut toutefois recevoir des **faits** ou un **événement technique** depuis un simulateur, sans fermer la conversation ou perdre son historique.

## Fichiers

- `v0.1/chatcore.js` : moteur commun, sans dépendance et sans accès réseau.
- `v0.1/chatcore-ui.js` : rendu des bulles et choix de messages.
- `v0.1/chatcore.css` : styles isolés, responsive, mode sombre et compatibilité automatique avec les cinq thèmes C².
- `demo/scenario-dhcp.js` : scénario DHCP de démonstration uniquement.
- `lab-pdf.html` : laboratoire PDF D3-02 autonome, validé jusqu'à la clôture de l'intervention.
- `lab-pdf/scenario-chat.js` : questions, réponses et faits liés à l'incident PDF.
- `lab-pdf/windows-c2.js`, `lab-pdf/windows-c2.css`, `lab-pdf/windows-scenario.js`, `lab-pdf/windows-scenario.css` : copies isolées du simulateur Windows/PDF de C², destinées uniquement au laboratoire.
- `index.html` : laboratoire GitHub Pages.
- `tests/chatcore.test.mjs` : tests autonomes exécutés avec Node.
- `.github/workflows/tests.yml` : exécution GitHub Actions.

## Contrat d'intégration (expérimental)

```html
<link rel="stylesheet" href="https://chaoli22000bzh.github.io/chatcore/v0.1/chatcore.css">
<div id="conversation"></div>
<script src="https://chaoli22000bzh.github.io/chatcore/v0.1/chatcore.js"></script>
<script src="https://chaoli22000bzh.github.io/chatcore/v0.1/chatcore-ui.js"></script>
<script src="mon-scenario.js"></script>
<script>
const ui = ChatCoreUI.mount('#conversation', window.MonScenario);
ui.notify({type:'impression.test-ok'}); // seulement si le simulateur confirme ce fait
</script>
```

Le projet hôte fournit `{clientName, greeting, facts, messages, events}`. Chaque message contient au minimum `id`, `text`, `answer`. Des variantes `answers` peuvent être conditionnées par un `fact` du simulateur. `once:false` permet de reposer une question, par exemple pour vérifier une réparation.

Le moteur expose `ChatCore.create(scenario)` et l'interface expose `ChatCoreUI.mount(element, scenario)`. Une instance offre `send(id)`, `available()`, `setFacts(patch)`, `notify(event)`, `getState()`, `restart()` et `subscribe(fn)`. Le montage visuel renvoie `{chat, notify, setFacts, setTypingSpeed, restart, destroy}`. Les choix de messages sont envoyés directement au clic, sans bouton Envoyer. Les réponses du client apparaissent lettre par lettre. La vitesse initiale est configurable dans le scénario par `typingSpeed: 'slow' | 'normal' | 'fast'` (65, 35 et 15 ms par lettre), ou par une valeur numérique en millisecondes. `ui.setTypingSpeed(...)` ajuste les prochaines réponses sans relancer la conversation. Les sélecteurs de vitesse des laboratoires ne sont pas imposés aux projets hôtes. L'animation est désactivée si le navigateur demande une réduction du mouvement.

**Sécurité pédagogique :** un événement ne modifie les faits que si le scénario l'a prévu. Le simulateur reste seul responsable de la réalité technique. La sélection d'une phrase n'a jamais pour effet de déclarer une réparation sans état correspondant. **Le technicien réalise les manipulations ; le client constate le résultat.** Ne jamais attribuer au client les opérations effectuées par le technicien.

## Recette laboratoire PDF : tests 6 à 10 validés le 15 novembre 2026

Le professeur a validé les cinq étapes fonctionnelles dans **le laboratoire autonome** :

1. **Test 6 :** le document `factureorange.pdf` est réellement ouvert dans Google Chrome et Sophie adapte sa réponse.
2. **Test 7 :** l'aperçu avant impression dans Chrome génère une trace distincte ; Sophie n'en décrit les anomalies qu'après cet événement.
3. **Test 8 :** l'ouverture du même fichier dans Adobe Acrobat Reader permet à Sophie de comparer les deux rendus, sans inventer une comparaison non réalisée.
4. **Test 9 :** l'association `.pdf` est changée vers Reader ; la résolution n'est confirmée qu'après une **nouvelle ouverture postérieure** du fichier avec Reader. Les formulations attribuent les actions au technicien.
5. **Test 10 :** le client refuse une clôture anticipée et confirme seulement après vérification, en conservant l'historique.

**Architecture de la recette :** la page `lab-pdf.html` utilise des copies indépendantes des sources Windows/PDF de C². Elle écoute `c2win:file-open`, `c2win:print-preview` et `c2win:association-change`, puis contrôle les événements enregistrés dans `getTrace()` et l'association active. Les faits `invoiceOpened`, `printPreviewOpened`, `readerOpened`, `pdfAssociationChanged` et `repairVerified` alimentent les réponses conditionnelles. Les tests automatiques du dépôt ChatCore exécutés via GitHub Actions ont réussi. Le test manuel de l'ensemble des scénarios a été validé étape par étape par le professeur.

**Portée :** cette validation ne couvre pas une intégration effective dans C², DiagTree, DiagCore ou R2D3. Elle ne constitue pas non plus une preuve de fonctionnement des cinq thèmes dans une page hôte, d'une persistance au rechargement, ni d'une recette exhaustive du navigateur.

## Limites et suites

Cette version est un **prototype**, pas une intégration validée à C², R2D3 ou DiagCore. Le bouton « Simuler : réseau rétabli » du seul laboratoire DHCP représente un événement fictif. Le laboratoire PDF, à l'inverse, s'appuie sur les événements d'une copie autonome du simulateur Windows, sans raccorder le dépôt de production.

L'intégration dans les TP D3-01/D3-02 ou dans R2D3 nécessitera un adaptateur aux événements et au cycle de vie de ces applications hôtes, testé séparément. Aucune modification des dépôts d'origine n'a été effectuée.

## Compatibilité avec les thèmes C²

Le composant observe exclusivement la valeur CSS native du document hôte : `html[data-ctp-theme]`. Les valeurs confirmées dans `C2/assets/themes.js` sont `pure` (Clair), `dark` (Sombre), `neon` (TRON), `space` (Star Wars) et `80` (Minitel 80).

Les couleurs utilisent les variables C² existantes (`--ctp-panel`, `--ctp-text`, `--ctp-line`, `--ctp-accent`, `--ctp-accent-text`, `--ctp-choice-bg`) avec des valeurs de secours pour le laboratoire indépendant. Les bulles Sophie/Moi conservent des couleurs distinctes et lisibles pour chaque thème. Les changements de thème sont gérés directement par CSS, sans remonter ni interrompre la conversation.

**Aucune préférence de thème n'est enregistrée par ChatCore.** Aucun sélecteur supplémentaire ne doit apparaître dans C². Le sélecteur visible sur la page de test ChatCore sert uniquement à vérifier les cinq rendus sans C².

L’intégration réelle de ChatCore aux TP C² nécessitera encore une recette visuelle sur les cinq thèmes. Les CSS de C² n'ont pas été modifiées.

## Référence d'intégration C² et R2D3

Les choix d'architecture communs, la séparation des responsabilités, le statut des TP D3-01/D3-02/D3-03 et la liste des recettes restantes sont maintenus dans [C2/docs/INTEGRATION_CHATCORE.md](https://github.com/chaoli22000bzh/C2/blob/main/docs/INTEGRATION_CHATCORE.md).

Ce README reste la **documentation technique propre à ChatCore** (API, fichiers, démonstration, tests). L'intégration dans les projets hôtes ne doit pas être considérée comme validée avant leurs recettes. Après les tests, mettre à jour les documents existants plutôt que créer des fichiers de suivi concurrents.
