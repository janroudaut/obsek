# Assistant Inventaire & Estimation "Obsek"

## 1. Présentation

"Obsek" est une application web serverless conçue pour faciliter la création d'un inventaire d'objets personnels.
Elle permet d'analyser des objets à partir de photos, d'obtenir une estimation de leur valeur de revente grâce à l'intelligence artificielle (Google Gemini), et de gérer leur statut (à vendre, vendu, etc.).

Cette application est conçue pour être ultra-légère et fonctionner entièrement côté client, sans aucun serveur backend.

## 2. Architecture

L'application est contenue dans un seul et unique fichier HTML (par exemple, `index.html`). Son architecture repose sur les principes suivants :

- **100% Côté Client** : Tout le code (HTML, CSS, JavaScript) est dans un seul fichier.
- **Stockage Local** : Toutes les données, y compris les images (sous forme de miniatures encodées en Base64), sont sauvegardées dans le localStorage du navigateur.
- **Serverless** : L'application ne nécessite aucun serveur pour fonctionner, à l'exception des appels à l'API de Google Gemini.

## 3. Installation et Lancement

1. **Prérequis** : Un navigateur web moderne (Chrome, Firefox, Safari, etc.).
2. **Lancement** : Pour que les appels à l'API de Google fonctionnent, le fichier HTML doit être servi via un serveur web. Il ne fonctionnera pas correctement s'il est ouvert directement via le protocole file://.
  - En ligne (recommandé) : Déployez simplement le fichier (nommé `index.html`) sur un service comme GitHub Pages ou Netlify.
  - En local : Ouvrez un terminal dans le dossier où se trouve le fichier et lancez l'une des commandes suivantes :
    - **Avec Python 3 :** `python -m http.server`
    - **Avec Node.js (si vous avez `npx`)** : `npx serve`
  
    Ensuite, ouvrez votre navigateur à l'adresse indiquée (généralement `http://localhost:8000` ou `http://localhost:3000`).

## 4. Configuration

### 4.1. Clé API Google Gemini

L'application utilise l'API de Google Gemini pour l'analyse des images. Vous devez fournir votre propre clé API.

- **Obtention de la clé** : Créez une clé sur [Google AI Studio](https://aistudio.google.com/app/apikey).
- **Configuration dans l'application** :
  - Allez dans l'onglet **"Configuration"**.
  - Collez votre clé dans le champ "Clé API Google Gemini".
  - Cliquez sur "Sauvegarder". La clé est enregistrée dans le `localStorage` de votre navigateur.

### 4.2. Configuration par Paramètre d'URL (HTTP GET)

Pour faciliter l'utilisation, notamment sur mobile, vous pouvez pré-remplir la clé API en passant un paramètre dans l'URL.
C'est très utile pour créer un raccourci sur l'écran d'accueil de votre téléphone.

**Format :** `?apiKey=VOTRE_CLÉ_API_ICI`

**Exemples :**

- **En ligne :** `https://janroudaut.github.io/obsek/?apiKey=AIzaSy...`
- **En local :** `http://localhost:8000/?apiKey=AIzaSy...`

Lors du premier chargement, l'application détectera ce paramètre, sauvegardera la clé dans le `localStorage` et nettoiera l'URL pour des raisons de sécurité.

### 5. Gestion des Données (Export / Import)
   
Pour sauvegarder votre inventaire ou le transférer entre plusieurs appareils (par exemple, de votre téléphone à votre PC),
une fonctionnalité d'export/import est disponible dans l'onglet **Configuration"**.

- **Exporter :** Crée un fichier `obsek_backup.zip` contenant toutes vos données, y compris les images.
- **Importer :** Vous permet de sélectionner un fichier `obsek_backup.zip` pour restaurer un inventaire.
  **Attention :** l'importation écrasera toutes les données actuellement présentes dans l'application.
