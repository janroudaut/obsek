# Assistant Inventaire & Estimation "Obsek"

## 1. Présentation

"Obsek" est une application web *serverless* conçue pour faciliter la création d'un inventaire d'objets personnels. Elle permet d'analyser des objets à partir de photos, d'obtenir une estimation de leur valeur de revente grâce à l'intelligence artificielle (Google Gemini), et de gérer leur statut (à vendre, vendu, etc.).

Cette application est conçue pour être ultra-légère et fonctionner entièrement côté client, sans aucun serveur backend.

## 2. Architecture

L'application repose sur un **fichier HTML unique** (`index.html`) qui contient tout le code (HTML, CSS, JavaScript).

* **Stockage Local Avancé :** Toutes les données de l'inventaire, y compris les **images originales** et les miniatures, sont sauvegardées dans **IndexedDB**. Cette approche est utilisée en lieu et place de `localStorage` pour dépasser la limite de stockage de 5-10 Mo et permettre la sauvegarde d'un grand nombre d'images en haute résolution.
* **Serverless :** L'application ne nécessite aucun serveur pour fonctionner, à l'exception des appels à l'API de Google Gemini.

### Fichiers de support pour l'expérience PWA

Pour permettre une expérience "plein écran" (standalone) et une utilisation hors-ligne, deux fichiers supplémentaires sont nécessaires :

1.  **`manifest.json`** : Ce fichier décrit l'application au navigateur. Il permet de définir le nom, la couleur du thème (`#596878`) et l'icône à utiliser lorsque vous **ajoutez l'application à votre écran d'accueil**.
2.  **`sw.js` (Service Worker)** : C'est un petit script qui s'exécute en arrière-plan. Il est **exigé par les navigateurs** (notamment Chrome) pour débloquer le mode `standalone`. Son rôle ici est de mettre en cache les ressources de base de l'application (le fichier HTML, les scripts CDN) pour qu'elle puisse se charger même sans connexion réseau.

**Note :** L'application principale reste le fichier `index.html`. Le `manifest.json` et le `sw.js` ne sont que des "fichiers de configuration" pour améliorer l'intégration mobile.

## 3. Installation et Lancement

1.  **Prérequis :** Un navigateur web moderne (Chrome, Firefox, Safari, etc.).
2.  **Lancement :** Pour que les appels à l'API de Google et le Service Worker fonctionnent, les fichiers doivent être servis via un serveur web (protocole `https://` ou `http://localhost`). Ils ne fonctionneront pas correctement si vous ouvrez `index.html` directement via le protocole `file://`.

    * **En ligne (recommandé) :** Déployez les trois fichiers (`index.html`, `manifest.json`, `sw.js`) sur un service comme [GitHub Pages](https://pages.github.com/) ou [Netlify](https://www.netlify.com/).
    * **En local :** Ouvrez un terminal dans le dossier où se trouvent les fichiers et lancez l'une des commandes suivantes :
        * **Avec Python 3 :** `python -m http.server`
        * **Avec Node.js (si vous avez `npx`) :** `npx serve`

    Ensuite, ouvrez votre navigateur à l'adresse indiquée (généralement `http://localhost:8000`).

## 4. Configuration

### 4.1. Clé API Google Gemini

L'application utilise l'API de Google Gemini pour l'analyse des images. Vous devez fournir votre propre clé API.

* **Obtention de la clé :** Créez une clé sur [Google AI Studio](https://aistudio.google.com/app/apikey).
* **Configuration dans l'application :**
    1.  Allez dans l'onglet **"Configuration"**.
    2.  Collez votre clé dans le champ "Clé API Google Gemini".
    3.  Cliquez sur "Sauvegarder". La clé est enregistrée dans le `localStorage` de votre navigateur (elle est conservée même si vous réinitialisez l'inventaire).

### 4.2. Configuration par Paramètre d'URL (HTTP GET)

Pour faciliter l'utilisation, notamment sur mobile, vous pouvez pré-remplir la clé API en passant un paramètre dans l'URL. C'est très utile pour créer un raccourci sur l'écran d'accueil de votre téléphone.

**Format :** `?apiKey=VOTRE_CLÉ_API_ICI`

**Exemples :**

* **En ligne :** `https://janroudaut.github.io/obsek/?apiKey=AIzaSy...`
* **En local :** `http://localhost:8000/?apiKey=AIzaSy...`

Lors du premier chargement, l'application détectera ce paramètre, sauvegardera la clé dans le `localStorage` et nettoiera l'URL pour des raisons de sécurité.

## 5. Gestion des Données (Export / Import)

Pour sauvegarder votre inventaire ou le transférer entre plusieurs appareils (par exemple, de votre PC à votre téléphone), une fonctionnalité d'export/import est disponible dans l'onglet **"Configuration"**.

* **Exporter :** Crée un fichier `obsek_backup.zip` contenant `inventory.json`. Ce fichier contient l'intégralité de votre base de données, y compris les images originales et les miniatures.
* **Importer :** Vous permet de sélectionner un fichier `obsek_backup.zip` pour restaurer un inventaire.
    * **Logique de Fusion :** L'importation n'écrase pas aveuglément vos données. L'application compare les objets de l'inventaire local et de l'inventaire importé. Pour chaque objet, elle conserve la version la plus récente en se basant sur la date de dernière modification. Les nouveaux objets sont simplement ajoutés.
    * **Import à vide :** Si votre inventaire local est vide, l'importation se fait directement sans demande de confirmation.
