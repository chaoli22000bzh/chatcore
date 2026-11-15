# ChatCore

Composant conversationnel commun et réutilisable pour les simulations pédagogiques de support informatique.

## Première version expérimentale : 0.1.0

**Page de test :** https://chaoli22000bzh.github.io/chatcore/

La version 0.1 propose des messages prédéfinis envoyés par l'élève (« Moi ») et des réponses déterministes d'un client virtuel. Les interlocuteurs sont distingués par deux couleurs, sur ordinateur comme sur smartphone. Dans C², l'interface suit automatiquement les cinq thèmes officiels (Clair, Sombre, TRON, Star Wars, Minitel 80).

**Périmètre :** le chat reste indépendant du diagnostic. Il n'exécute aucune intervention technique et ne prétend jamais résoudre un incident. Il peut toutefois recevoir des **faits** ou un **événement technique** depuis un simulateur, sans fermer la conversation ou perdre son historique.

## Fichiers

- `v0.1/chatcore.js` : moteur commun, sans dépendance et sans accès réseau.
- `v0.1/chatcore-ui.js` : rendu des bulles et choix de messages.
- `v0.1/chatcore.css` : styles isolés, responsive, mode sombre et compatibilité automatique avec les cinq thèmes C².
- `demo/scenario-dhcp.js` : scénario de démonstration uniquement.
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

Le moteur expose `ChatCore.create(scenario)` et l'interface expose `ChatCoreUI.mount(element, scenario)`. Une instance offre `send(id)`, `available()`, `setFacts(patch)`, `notify(event)`, `getState()`, `restart()` et `subscribe(fn)`. Le montage visuel renvoie `{chat, notify, setFacts, restart, destroy}`.

**Sécurité pédagogique :** un événement ne modifie les faits que si le scénario l'a prévu. Le simulateur reste seul responsable de la réalité technique. Un clic sur « Envoyer » n'a jamais pour effet de déclarer une réparation sans état correspondant.

## Limites et suites

Cette version est un **prototype**, pas une intégration validée à C², R2D3 ou DiagCore. Le bouton « Simuler : réseau rétabli » sert à vérifier la persistance du chat pendant une intervention technique fictive. Il ne commande aucun simulateur de production.

L'intégration dans les TP D3-01/D3-02 ou dans R2D3 nécessitera un adaptateur aux événements techniques réels, testé séparément. Aucune modification des dépôts d'origine n'a été effectuée.

## Compatibilité avec les thèmes C²

Le composant observe exclusivement la valeur CSS native du document hôte : `html[data-ctp-theme]`. Les valeurs confirmées dans `C2/assets/themes.js` sont `pure` (Clair), `dark` (Sombre), `neon` (TRON), `space` (Star Wars) et `80` (Minitel 80).

Les couleurs utilisent les variables C² existantes (`--ctp-panel`, `--ctp-text`, `--ctp-line`, `--ctp-accent`, `--ctp-accent-text`, `--ctp-choice-bg`) avec des valeurs de secours pour le laboratoire indépendant. Les bulles Sophie/Moi conservent des couleurs distinctes et lisibles pour chaque thème. Les changements de thème sont gérés directement par CSS, sans remonter ni interrompre la conversation.

**Aucune préférence de thème n'est enregistrée par ChatCore.** Aucun sélecteur supplémentaire ne doit apparaître dans C². Le sélecteur visible sur la page de test ChatCore sert uniquement à vérifier les cinq rendus sans C².

L’intégration réelle de ChatCore aux TP C² nécessitera encore une recette visuelle sur les cinq thèmes. Les CSS de C² n'ont pas été modifiées.

## Référence d'intégration C² et R2D3

Les choix d'architecture communs, la séparation des responsabilités, le statut des TP D3-01/D3-02/D3-03 et la liste des recettes restantes sont maintenus dans [C2/docs/INTEGRATION_CHATCORE.md](https://github.com/chaoli22000bzh/C2/blob/main/docs/INTEGRATION_CHATCORE.md).

Ce README reste la **documentation technique propre à ChatCore** (API, fichiers, démonstration, tests). L'intégration dans les projets hôtes ne doit pas être considérée comme validée avant leurs recettes. Après les tests, mettre à jour les documents existants plutôt que créer des fichiers de suivi concurrents.
