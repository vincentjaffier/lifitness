# APEX FITNESS - Premium Fitness Club Platform

## 🚀 Installation & Lancement

```bash
npm install
npm run dev
```

## 📁 Architecture à 3 niveaux

```
apex-fitness/
├── src/
│   ├── components/
│   │   ├── layout/      # Header, Footer, Layout public
│   │   ├── admin/       # AdminLayout, AdminProtectedRoute
│   │   ├── ui/          # Composants réutilisables
│   │   └── cards/       # ClubCard, SubscriptionCard
│   ├── context/
│   │   ├── AuthContext.jsx      # Auth membres
│   │   ├── BookingContext.jsx   # Réservations
│   │   └── AdminContext.jsx     # Auth + data admin
│   ├── pages/
│   │   ├── (public)     # Home, Clubs, Abonnements...
│   │   ├── auth/        # Login, Signup membres
│   │   ├── member/      # Dashboard, Réservations, Profil...
│   │   └── admin/       # Dashboard, Clubs, Coachs, Cours...
│   └── data/
│       └── mockData.js  # Données de démonstration
```

## 👥 3 Espaces Séparés

### 1. Espace Visiteur (/)
Pages publiques accessibles à tous :
- Accueil, Clubs, Abonnements, Activités
- Coaching, Planning, Blog, FAQ, Contact
- Inscription, Connexion

### 2. Espace Membre (/espace-membre)
Réservé aux abonnés connectés :
- Dashboard personnel
- Gestion abonnement
- Réservations de cours
- Profil et factures

### 3. Espace Admin (/admin)
Back-office sécurisé pour administrateurs :
- **Dashboard** : KPIs, alertes, actions rapides
- **Clubs** : CRUD complet, stats par club
- **Coachs** : Gestion équipe, spécialités
- **Cours** : Création, modification, capacité, réservations
- **Membres** : Consultation, suspension, modification abo
- **Contacts** : Traitement demandes entrantes
- **Promotions** : Codes promo, limites, dates
- **Statistiques** : Revenus, remplissage, tendances

## 🔐 Identifiants de démonstration

### Membre
- Email : `marie.dupont@email.com`
- Password : n'importe quel mot de passe

### Admin
| Rôle | Email | Password |
|------|-------|----------|
| Super Admin | admin@apex-fitness.fr | admin123 |
| Manager | manager@apex-fitness.fr | manager123 |

## 🎨 Design System

- **Thème** : Dark premium (Carbon #0d0d0d → #1a1a1a)
- **Accent** : Orange APEX (#e8751e)
- **Typo** : Clash Display (titres), Inter (body)
- **Animations** : Framer Motion

## 🛠 Stack

React 18 + Vite + Tailwind CSS + Framer Motion + React Router 6
