// LIF'ITNESS - Mock Data
// Complete dataset for clubs, subscriptions, activities, etc.

export const clubs = [
  {
    id: 'lifitness-almadies',
    slug: 'almadies',
    name: "LIF'ITNESS Almadies",
    city: 'Dakar',
    district: 'Almadies',
    address: '15 Route des Almadies',
    postalCode: '10700',
    phone: '+221 33 820 00 00',
    email: 'almadies@lifitness.fr',
    coordinates: { lat: 14.7455, lng: -17.5219 },
    rating: 4.9,
    reviewCount: 487,
    isNew: false,
    isPremium: true,
    surface: 2500,
    openingHours: {
      weekdays: '6h00 - 23h00',
      saturday: '7h00 - 22h00',
      sunday: '8h00 - 20h00'
    },
    images: [
      '/images/clubs/almadies-1.jpg',
      '/images/clubs/almadies-2.jpg',
      '/images/clubs/almadies-3.jpg'
    ],
    amenities: [
      'musculation',
      'cardio',
      'crossfit',
      'boxing',
      'spa',
      'sauna',
      'hammam',
      'piscine',
      'coaching',
      'parking',
      'vestiaires-premium',
      'espace-femmes'
    ],
    description: "Notre club flagship aux Almadies. Un espace de 2500m² dédié à votre transformation physique, avec les équipements les plus performants du marché.",
    highlights: [
      'Piscine intérieure chauffée',
      'Espace wellness complet',
      'Rooftop training',
      'Conciergerie fitness'
    ]
  },
  {
    id: 'lifitness-sacre-coeur',
    slug: 'sacre-coeur',
    name: "LIF'ITNESS Sacré Coeur",
    city: 'Dakar',
    district: 'Sacré Coeur',
    address: '42 Rue de la Corniche',
    postalCode: '10200',
    phone: '+221 33 821 00 00',
    email: 'sacrecoeur@lifitness.fr',
    coordinates: { lat: 14.7200, lng: -17.4833 },
    rating: 4.8,
    reviewCount: 356,
    isNew: false,
    isPremium: true,
    surface: 1800,
    openingHours: {
      weekdays: '6h00 - 23h00',
      saturday: '7h00 - 22h00',
      sunday: '8h00 - 20h00'
    },
    images: [
      '/images/clubs/sacre-coeur-1.jpg',
      '/images/clubs/sacre-coeur-2.jpg'
    ],
    amenities: [
      'musculation',
      'cardio',
      'crossfit',
      'yoga',
      'sauna',
      'coaching',
      'vestiaires-premium'
    ],
    description: "Un club intimiste au cœur de Sacré Coeur. Ambiance exclusive et équipements haut de gamme.",
    highlights: [
      'Architecture moderne unique',
      'Yoga studio dédié',
      'Coaching nutritionnel inclus'
    ]
  }
]

export const subscriptions = [
  {
    id: 'essential',
    name: 'Essential',
    tagline: "L'essentiel pour bien démarrer",
    price: 39.90,
    priceAnnual: 29.90,
    commitment: 'Sans engagement',
    popular: false,
    features: [
      { name: 'Accès à 1 club de votre choix', included: true },
      { name: 'Horaires illimités 6h-23h', included: true },
      { name: 'Espaces musculation & cardio', included: true },
      { name: 'Vestiaires équipés', included: true },
      { name: 'Application mobile', included: true },
      { name: 'Cours collectifs', included: false },
      { name: 'Espace wellness', included: false },
      { name: 'Coaching personnalisé', included: false },
      { name: 'Accès multi-clubs', included: false }
    ],
    color: 'carbon'
  },
  {
    id: 'premium',
    name: 'Premium',
    tagline: "L'expérience complète",
    price: 69.90,
    priceAnnual: 54.90,
    commitment: 'Sans engagement',
    popular: true,
    features: [
      { name: 'Accès à tous les clubs', included: true },
      { name: 'Horaires illimités 6h-23h', included: true },
      { name: "Tous les espaces d'entraînement", included: true },
      { name: 'Vestiaires premium', included: true },
      { name: 'Application mobile', included: true },
      { name: 'Cours collectifs illimités', included: true },
      { name: 'Espace wellness (sauna, hammam)', included: true },
      { name: '1 séance coaching/mois', included: true },
      { name: 'Accès prioritaire nouvelles salles', included: false }
    ],
    color: 'apex'
  },
  {
    id: 'elite',
    name: 'Elite',
    tagline: 'Le summum de l\'excellence',
    price: 149.90,
    priceAnnual: 119.90,
    commitment: 'Sans engagement',
    popular: false,
    features: [
      { name: 'Accès à tous les clubs', included: true },
      { name: 'Horaires étendus 5h-minuit', included: true },
      { name: "Tous les espaces d'entraînement", included: true },
      { name: 'Vestiaires VIP avec casier personnel', included: true },
      { name: 'Application mobile + conciergerie', included: true },
      { name: 'Cours collectifs illimités + priority booking', included: true },
      { name: 'Spa complet (piscine incluse)', included: true },
      { name: 'Coaching personnalisé illimité', included: true },
      { name: 'Invités gratuits (2/mois)', included: true }
    ],
    color: 'electric'
  }
]

export const activities = [
  {
    id: 'musculation',
    name: 'Musculation',
    slug: 'musculation',
    icon: 'Dumbbell',
    category: 'force',
    shortDescription: 'Développez votre masse musculaire avec des équipements haut de gamme.',
    description: 'Nos espaces musculation sont équipés des meilleures machines Technogym et Hammer Strength. Zones dédiées pour chaque groupe musculaire, avec miroirs, racks à squats multiples et plateformes de soulevé de terre.',
    benefits: [
      'Prise de masse musculaire',
      'Gain de force',
      'Amélioration de la posture',
      'Accélération du métabolisme'
    ],
    equipment: [
      'Machines Technogym Selection',
      'Haltères 1-60kg',
      'Barres olympiques',
      'Cages à squats',
      'Postes de câbles'
    ],
    image: '/images/musculation.png'
  },
  {
    id: 'cardio',
    name: 'Cardio Training',
    slug: 'cardio-training',
    icon: 'Heart',
    category: 'endurance',
    shortDescription: 'Améliorez votre endurance et brûlez des calories.',
    description: 'Un parc cardio complet avec tapis de course, vélos elliptiques, rameurs et escaliers. Chaque machine équipée d\'écrans connectés pour suivre vos performances.',
    benefits: [
      'Amélioration cardiovasculaire',
      'Perte de poids',
      'Endurance accrue',
      'Réduction du stress'
    ],
    equipment: [
      'Tapis de course Technogym',
      'Vélos elliptiques',
      'Rameurs Concept2',
      'Stairmaster',
      'Assault Bikes'
    ],
    image: '/images/cardio.png'
  },
  {
    id: 'crossfit',
    name: 'Cross Training',
    slug: 'cross-training',
    icon: 'Zap',
    category: 'functional',
    shortDescription: 'Entraînement fonctionnel haute intensité.',
    description: 'Nos zones cross training sont conçues pour des entraînements complets. Kettlebells, wall balls, cordes à grimper, rigs et tout l\'équipement nécessaire pour vos WODs.',
    benefits: [
      'Condition physique globale',
      'Puissance explosive',
      'Agilité',
      'Force fonctionnelle'
    ],
    equipment: [
      'Rigs de cross training',
      'Kettlebells 4-48kg',
      'Wall balls',
      'Boxes plyométriques',
      'Cordes à grimper'
    ],
    image: '/images/crossfit.png'
  },
  {
    id: 'boxing',
    name: 'Boxing',
    slug: 'boxing',
    icon: 'Target',
    category: 'combat',
    shortDescription: 'Libérez votre énergie sur nos rings et sacs.',
    description: 'Espaces dédiés à la boxe avec rings, sacs de frappe, speed balls et zones de shadow boxing. Cours collectifs et entraînements libres.',
    benefits: [
      'Défoulement total',
      'Cardio intense',
      'Coordination',
      'Confiance en soi'
    ],
    equipment: [
      'Ring de boxe',
      'Sacs de frappe',
      'Speed balls',
      'Gants et équipements',
      'Zone shadow boxing'
    ],
    image: '/images/boxing.png'
  },
  {
    id: 'yoga',
    name: 'Yoga & Pilates',
    slug: 'yoga-pilates',
    icon: 'Leaf',
    category: 'wellness',
    shortDescription: 'Trouvez l\'équilibre entre corps et esprit.',
    description: 'Studios dédiés au yoga et au pilates avec parquet, lumière naturelle et ambiance zen. Cours de tous niveaux : Hatha, Vinyasa, Yin, Pilates mat et Pilates reformer.',
    benefits: [
      'Flexibilité',
      'Renforcement profond',
      'Réduction du stress',
      'Meilleure posture'
    ],
    equipment: [
      'Tapis premium',
      'Blocs et sangles',
      'Reformers Pilates',
      'Roues de yoga',
      'Accessoires meditation'
    ],
    image: '/images/yoga.png'
  },
  {
    id: 'hyrox',
    name: 'HYROX Zone',
    slug: 'hyrox',
    icon: 'Trophy',
    category: 'competition',
    shortDescription: 'Préparez-vous pour les compétitions HYROX.',
    description: 'Zones officielles HYROX avec tout l\'équipement requis : SkiErg, sleds, wall balls, burpees zone. Préparez vos compétitions dans les meilleures conditions.',
    benefits: [
      'Préparation compétition',
      'Endurance extrême',
      'Force fonctionnelle',
      'Mental d\'acier'
    ],
    equipment: [
      'SkiErg',
      'Sleds push/pull',
      'Farmers carry',
      'Sandbags',
      'Zone de course'
    ],
    image: '/images/hyrox.png'
  }
]

export const classes = [
  {
    id: 'class-1',
    name: 'LIF BURN',
    activity: 'cardio',
    duration: 45,
    intensity: 'high',
    calories: '500-700',
    description: 'Cours cardio haute intensité pour brûler un maximum de calories.',
    instructor: 'Sarah M.',
    image: '/images/classes/burn.jpg'
  },
  {
    id: 'class-2',
    name: 'POWER LIFT',
    activity: 'musculation',
    duration: 60,
    intensity: 'high',
    calories: '400-500',
    description: 'Session de musculation guidée axée sur les mouvements composés.',
    instructor: 'Thomas K.',
    image: '/images/classes/powerlift.jpg'
  },
  {
    id: 'class-3',
    name: 'LIF WOD',
    activity: 'crossfit',
    duration: 50,
    intensity: 'extreme',
    calories: '600-800',
    description: 'Workout of the Day style CrossFit. Dépassez vos limites.',
    instructor: 'Marco V.',
    image: '/images/classes/wod.jpg'
  },
  {
    id: 'class-4',
    name: 'FLOW YOGA',
    activity: 'yoga',
    duration: 60,
    intensity: 'medium',
    calories: '200-300',
    description: 'Vinyasa flow pour force, flexibilité et sérénité.',
    instructor: 'Lisa P.',
    image: '/images/classes/yoga.jpg'
  },
  {
    id: 'class-5',
    name: 'COMBAT FIT',
    activity: 'boxing',
    duration: 45,
    intensity: 'high',
    calories: '500-600',
    description: 'Mix de boxe et cardio pour un défoulement total.',
    instructor: 'Karim B.',
    image: '/images/classes/combat.jpg'
  },
  {
    id: 'class-6',
    name: 'HYROX PREP',
    activity: 'hyrox',
    duration: 75,
    intensity: 'extreme',
    calories: '700-900',
    description: 'Entraînement spécifique compétition HYROX.',
    instructor: 'Alex R.',
    image: '/images/classes/hyrox.jpg'
  }
]

export const testimonials = [
  {
    id: 1,
    name: 'Marie Dupont',
    role: "Membre Elite depuis 2022",
    avatar: '/images/testimonials/marie.jpg',
    club: "LIF'ITNESS Almadies",
    rating: 5,
    text: "LIF'ITNESS a complètement transformé ma vision du fitness. L'ambiance, les équipements, les coachs... Tout est au niveau d'excellence qu'on attend d'un club premium. Je ne pourrais plus revenir en arrière.",
    transformation: {
      before: 'Sédentaire, 15kg en trop',
      after: '-15kg, marathon finisher'
    }
  },
  {
    id: 2,
    name: 'Thomas Martin',
    role: 'Membre Premium depuis 2021',
    avatar: '/images/testimonials/thomas.jpg',
    club: "LIF'ITNESS Sacré Coeur",
    rating: 5,
    text: "En tant qu'entrepreneur, mon temps est précieux. LIF'ITNESS me permet de m'entraîner efficacement avec un coaching de qualité.",
    transformation: {
      before: "Stressé, manque d'énergie",
      after: '+10kg de muscle, énergie au top'
    }
  },
  {
    id: 3,
    name: 'Sophie Laurent',
    role: 'Membre Elite depuis 2023',
    avatar: '/images/testimonials/sophie.jpg',
    club: "LIF'ITNESS Almadies",
    rating: 5,
    text: "L'espace femmes et les cours de yoga m'ont conquise. Je me sens en sécurité et motivée à chaque séance. Une vraie communauté bienveillante.",
    transformation: {
      before: 'Anxieuse, mal dans sa peau',
      after: 'Confiante, flexible, sereine'
    }
  }
]

export const blogPosts = [
  {
    id: 1,
    slug: 'guide-debutant-musculation',
    title: 'Le Guide Ultime du Débutant en Musculation',
    excerpt: 'Tout ce que vous devez savoir pour commencer la musculation du bon pied.',
    category: 'Training',
    author: 'Coach Thomas',
    date: '2024-01-15',
    readTime: 8,
    image: '/images/blog/musculation-guide.jpg',
    featured: true
  },
  {
    id: 2,
    slug: 'nutrition-prise-masse',
    title: 'Nutrition : Les Clés de la Prise de Masse',
    excerpt: "Macros, timing, suppléments... Optimisez votre alimentation pour gagner du muscle.",
    category: 'Nutrition',
    author: 'Dr. Claire N.',
    date: '2024-01-10',
    readTime: 12,
    image: '/images/blog/nutrition.jpg',
    featured: true
  },
  {
    id: 3,
    slug: 'hyrox-preparation',
    title: 'HYROX : Comment Se Préparer Pour Sa Première Compétition',
    excerpt: "Programme d'entraînement complet pour performer lors de votre premier HYROX.",
    category: 'Competition',
    author: 'Coach Alex',
    date: '2024-01-05',
    readTime: 15,
    image: '/images/blog/hyrox.jpg',
    featured: false
  },
  {
    id: 4,
    slug: 'recuperation-importance',
    title: "L'Importance de la Récupération dans la Performance",
    excerpt: "Sommeil, nutrition post-workout, stretching : ne négligez plus votre récupération.",
    category: 'Wellness',
    author: 'Dr. Marc R.',
    date: '2024-01-02',
    readTime: 6,
    image: '/images/blog/recovery.jpg',
    featured: false
  }
]

export const faqItems = [
  {
    category: 'Abonnements',
    questions: [
      {
        q: "Puis-je changer d'abonnement en cours de contrat ?",
        a: "Oui, vous pouvez upgrader votre abonnement à tout moment. Le changement prend effet immédiatement et la différence de prix est calculée au prorata. Pour un downgrade, il faudra attendre la fin de votre période d'engagement."
      },
      {
        q: "Y a-t-il des frais d'inscription ?",
        a: "Nous proposons régulièrement des offres sans frais d'inscription. En période standard, les frais sont de 49€ et incluent votre kit de bienvenue LIF'ITNESS (serviette, gourde, sac)."
      },
      {
        q: "Comment fonctionne l'engagement ?",
        a: "Nos formules sont disponibles avec ou sans engagement. Sans engagement, vous pouvez résilier avec un préavis de 30 jours. Avec engagement 12 mois, vous bénéficiez de tarifs préférentiels."
      }
    ]
  },
  {
    category: 'Accès aux clubs',
    questions: [
      {
        q: 'À quelles heures puis-je m\'entraîner ?',
        a: 'Nos clubs sont ouverts de 6h à 23h en semaine, 7h à 22h le samedi et 8h à 20h le dimanche. Les membres Elite bénéficient d\'horaires étendus de 5h à minuit.'
      },
      {
        q: 'Puis-je accéder à plusieurs clubs ?',
        a: "Les abonnements Premium et Elite donnent accès à l'ensemble de nos clubs. L'abonnement Essential est limité à un club de votre choix."
      },
      {
        q: "Comment fonctionne l'accès au club ?",
        a: "L'accès se fait via notre application mobile ou votre carte membre. Scannez simplement le QR code à l'entrée du club."
      }
    ]
  },
  {
    category: 'Cours et réservations',
    questions: [
      {
        q: 'Comment réserver un cours collectif ?',
        a: "Les réservations se font via notre application mobile ou votre espace membre en ligne. Les cours sont disponibles à la réservation jusqu'à 7 jours à l'avance."
      },
      {
        q: "Que se passe-t-il si un cours est complet ?",
        a: "Vous pouvez vous inscrire sur liste d'attente. Vous serez automatiquement notifié si une place se libère."
      },
      {
        q: 'Puis-je annuler une réservation ?',
        a: "Oui, jusqu'à 4 heures avant le début du cours sans pénalité. Les annulations tardives répétées peuvent entraîner une suspension temporaire du droit de réservation."
      }
    ]
  },
  {
    category: 'Coaching',
    questions: [
      {
        q: 'Comment fonctionne le coaching personnalisé ?',
        a: "Nos coachs certifiés établissent avec vous un programme sur mesure basé sur vos objectifs. Les séances peuvent être ponctuelles ou régulières selon vos besoins."
      },
      {
        q: 'Le coaching est-il inclus dans mon abonnement ?',
        a: "Les membres Premium bénéficient d'une séance de coaching par mois. Les membres Elite ont un accès illimité au coaching. Pour Essential, le coaching est en option."
      }
    ]
  }
]

export const amenitiesInfo = {
  musculation: { icon: 'Dumbbell', label: 'Musculation' },
  cardio: { icon: 'Heart', label: 'Cardio' },
  crossfit: { icon: 'Zap', label: 'Cross Training' },
  boxing: { icon: 'Target', label: 'Boxing' },
  yoga: { icon: 'Leaf', label: 'Yoga' },
  spa: { icon: 'Sparkles', label: 'Spa' },
  sauna: { icon: 'Flame', label: 'Sauna' },
  hammam: { icon: 'CloudRain', label: 'Hammam' },
  piscine: { icon: 'Waves', label: 'Piscine' },
  coaching: { icon: 'Users', label: 'Coaching' },
  parking: { icon: 'Car', label: 'Parking' },
  'vestiaires-premium': { icon: 'Shirt', label: 'Vestiaires Premium' },
  'espace-femmes': { icon: 'ShieldCheck', label: 'Espace Femmes' }
}

export const cities = [
  { name: 'Dakar', count: 2, slug: 'dakar' }
]