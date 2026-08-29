

Un tableau de bord météo interactif en single page application qui permet de consulter la météo actuelle et les prévisions sur 5 jours pour n'importe quelle ville dans le monde.

Dashboard Météo est une application web développée en HTML, CSS et JavaScript vanilla. Elle utilise l'API OpenWeatherMap pour récupérer les données météo en temps réel et les afficher.

- Recherche d'une ville par nom
- Affichage de la météo actuelle (température, ressenti, humidité, vent, visibilité)
- Prévisions météo sur 5 jours
- Historique des recherches récentes (sauvegardé en LocalStorage)
- Rechargement automatique de la dernière ville au rafraîchissement de la page
- Interface responsive (mobile et desktop)

- HTML5
- CSS3
- JavaScript (Vanilla JS)
- jQuery 3.6.0
- Bootstrap 5.2
- Moment.js (avec locale français)
- API OpenWeatherMap

## Mode d'emploi

### 1. télécharger le projet

Télécharger et extraire via Winrar

### 2. Comment obtenir une clé API OpenWeatherMap ( Uniquement si une erreur est produite dans la recherche de ville )

1. Créer un compte gratuit sur [openweathermap.org](https://openweathermap.org)
2. Aller dans **API Keys** dans ton profil
3. Copier ta clé API

### 3. Ajouter ta clé API

Aller dans index.js, appuyer sur ctrl F et coller const API_KEY de là colle encore ta clés API et patiente 15 min environs 

### 4. Lancer l'application

Ouvrir le fichier `index.html` dans ton navigateur. (Ou plus simplement double clique dessus)

## Structure du projet

```
dashboard-meteo/
├── index.html
├── README.md
└── assets/
    ├── css/
    │   └── styles.css
    └── js/
        └── index.js

        

