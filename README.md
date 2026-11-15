# ChatCore

Composant conversationnel commun et réutilisable pour les simulations pédagogiques de support informatique.

## Première version expérimentale : 0.1.0

**Page de test :** https://chaoli22000bzh.github.io/chatcore/

La version 0.1 propose des messages prédéfinis envoyés par l'élève (« Moi ») et des réponses déterministes d'un client virtuel. Les interlocuteurs sont distingués par deux couleurs, sur ordinateur comme sur smartphone, y compris en mode sombre.

**Périmètre :** le chat reste indépendant du diagnostic. Il n'exécute aucune intervention technique et ne prétend jamais résoudre un incident. Il peut toutefois recevoir des **faits** ou un **événement technique** depuis un simulateur, sans fermer la conversation ou perdre son historique.

## Fichiers

- `v0.1/chatcore.js` : moteur commun, sans dépendance et sans accès réseau.
- `v0.1/chatcore-ui.js` : rendu des bulles et choix de messages.
- `v0.1/chatcore.css` : styles isolés, responsive et mode sombre.
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
