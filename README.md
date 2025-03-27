# Brief Validator

Une application web qui vous permet d'analyser des briefs clients à l'aide de l'IA (GPT-4) pour obtenir une analyse détaillée, des questions de clarification, des approches alternatives et une structure de projet.

## Fonctionnalités

- Analyse détaillée des forces et faiblesses du brief
- Identification des informations manquantes
- Questions de clarification classées par importance et catégorie
- Proposition d'approches fonctionnelles et techniques alternatives
- Structure de projet avec phases, objectifs, livrables et tâches
- Exportation des résultats au format JSON
- Intégration avec l'API OpenAI GPT-4

## Prérequis

- Node.js (v18 ou supérieur)
- Clé API OpenAI (avec accès à GPT-4)

## Installation

1. **Cloner le dépôt**

```
git clone https://github.com/votreutilisateur/brief-validator.git
cd brief-validator
```

2. **Installer les dépendances**

```
npm install
```

3. **Configurer les variables d'environnement**

Créez un fichier `.env` à la racine du projet et ajoutez votre clé API OpenAI :

```
VITE_OPENAI_API_KEY=votre_cle_api_openai_ici
```

Vous pouvez également configurer la clé API directement dans l'interface de l'application.

4. **Lancer l'application en mode développement**

```
npm run dev
```

L'application sera disponible à l'adresse [http://localhost:5173](http://localhost:5173).

## Structure du projet

```
brief-validator/
├── public/            # Ressources statiques
├── src/               # Code source
│   ├── components/    # Composants React
│   ├── types.ts       # Types TypeScript
│   ├── App.tsx        # Composant principal
│   ├── main.tsx       # Point d'entrée
│   └── ...
├── .env               # Variables d'environnement (à créer)
├── .env.example       # Exemple de variables d'environnement
├── index.html         # Page HTML principale
├── package.json       # Dépendances et scripts
├── tsconfig.json      # Configuration TypeScript
└── vite.config.ts     # Configuration Vite
```

## Technologies utilisées

- React 19
- TypeScript
- Vite
- Tailwind CSS
- API OpenAI GPT-4

## Déploiement

Pour construire l'application pour la production :

```
npm run build
```

Les fichiers générés seront disponibles dans le répertoire `dist/`.

## Sécurité

- Les clés API sont stockées localement dans le navigateur et ne sont jamais envoyées à un serveur autre que l'API OpenAI.
- Aucune donnée n'est collectée ou stockée en dehors de votre navigateur.

## Licence

MIT
