# TeamViewer pédagogique V1

Composant partagé de simulation de prise en main à distance. L'interface HTML/CSS/JS est autonome, indépendante des moteurs ChatCore et R2D3.

## Intégration

Page à embarquer :

`https://chaoli22000bzh.github.io/chatcore/teamviewer/v1/teamviewer.html?embed=1`

Dans un TP, placer cette page dans une `iframe`. Le contenu de TeamViewer n'affiche **jamais** le nom du client ou du poste. Le scénario hôte possède ses propres valeurs d'identifiant numérique et de mot de passe.

La communication se fait par `window.postMessage`. Les messages entrants sont acceptés uniquement depuis la fenêtre parente et son origine, déterminée par le navigateur via `document.referrer`. Les messages sortants sont envoyés à cette même origine.

### Messages TP → TeamViewer

Activation après accord explicite du client :

```js
iframe.contentWindow.postMessage({
  type: 'teamviewer:authorization',
  allowed: true,
  partnerId: '123456789',
  password: '123456'
}, 'https://chaoli22000bzh.github.io');
```

* `allowed: false` interdit toute connexion.
* `partnerId` et `password` : chaînes numériques choisies par le scénario pédagogique, vérifiées sans tenir compte des espaces dans l'identifiant.
* `{type:'teamviewer:reset'}` réinitialise la fenêtre, les champs et les autorisations.

Le TP transmet l'autorisation après la réponse positive du client, ou après toute autre condition pédagogique prévue. Il doit renvoyer l'autorisation sur l'événement `load` de l'iframe si nécessaire.

### Message TeamViewer → TP

```js
{ type: 'teamviewer:connected' }
```

Émis **uniquement** si l'autorisation a été reçue et si l'identifiant et le mot de passe correspondent. Le TP affiche alors l'application ou le bureau distant. Vérifier obligatoirement `event.source === iframe.contentWindow` et `event.origin` égal à l'origine du composant avant de débloquer l'accès.

## Compatibilité du TP de messagerie

Le laboratoire du portail pédagogique utilise la passerelle `ressources/chatcore/pont-teamviewer.html` pour conserver le protocole actuel entre son moteur de scénario et TeamViewer malgré la différence de domaines. Cette passerelle relaie seulement les trois types de messages autorisés.

L'ancien lien `ressources/chatcore/apercu-teamviewer.html` est conservé comme redirection de compatibilité et ne contient plus une deuxième copie du composant.

## Recette manuelle avant réutilisation

1. Sans autorisation, le champ et le bouton de connexion sont bloqués.
2. Après autorisation, le champ Partner ID est activé.
3. Identifiant erroné : message d'erreur, pas de session ouverte.
4. Identifiant correct : apparition du champ Password.
5. Mot de passe erroné : pas de session ouverte.
6. Identifiant et mot de passe corrects : émission de `teamviewer:connected`, puis ouverture de l'application distante par le TP.
7. Réinitialiser : autorisation et connexion annulées.
8. Vérifier que la saisie est visible sans défilement gênant sur PC.

Le composant est une simulation pédagogique, sans prise en main réelle.
