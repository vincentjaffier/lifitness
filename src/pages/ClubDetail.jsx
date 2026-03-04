import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { MapPin, Clock, Phone, Mail, Star, Check, ArrowRight, ChevronLeft } from 'lucide-react'
import Section from '../components/ui/Section'
import Badge from '../components/ui/Badge'
import { clubs, amenitiesInfo } from '../data/mockData'

export default function ClubDetail() {
  const { slug } = useParams()
  const club = clubs.find(c => c.slug === slug)

  if (!club) {
    return (
      <Section>
        <div className="container-custom text-center">
          <h1 className="font-display text-2xl text-white mb-4">Club non trouvé</h1>
          <Link to="/clubs" className="btn-secondary">Retour aux clubs</Link>
        </div>
      </Section>
    )
  }

  return (
    <>
      {/* Hero */}
      <section className="relative h-[50vh] min-h-[400px]">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(/images/equipement.png)` }} />
        <div className="absolute inset-0 bg-gradient-to-t from-carbon-950 via-carbon-950/60 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 container-custom pb-8">
          <Link to="/clubs" className="inline-flex items-center gap-2 text-carbon-400 hover:text-white mb-4">
            <ChevronLeft className="w-4 h-4" /> Tous les clubs
          </Link>
          <div className="flex flex-wrap gap-2 mb-4">
            {club.isNew && <Badge variant="apex">Nouveau</Badge>}
            {club.isPremium && <Badge variant="neutral">Premium</Badge>}
          </div>
          <h1 className="font-display text-display-lg text-white mb-2">{club.name}</h1>
          <div className="flex items-center gap-4 text-carbon-300">
            <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {club.city}</span>
            <span className="flex items-center gap-1"><Star className="w-4 h-4 text-apex-400" /> {club.rating} ({club.reviewCount} avis)</span>
          </div>
        </div>
      </section>

      <Section>
        <div className="container-custom">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              <div className="card p-6">
                <h2 className="font-display text-xl text-white mb-4">À propos</h2>
                <p className="text-carbon-300">{club.description}</p>
                {club.highlights && (
                  <ul className="mt-4 space-y-2">
                    {club.highlights.map((h, i) => (
                      <li key={i} className="flex items-center gap-2 text-carbon-200">
                        <Check className="w-4 h-4 text-apex-400" /> {h}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="card p-6">
                <h2 className="font-display text-xl text-white mb-4">Équipements & Services</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {club.amenities.map(amenity => {
                    const info = amenitiesInfo[amenity]
                    return info ? (
                      <div key={amenity} className="flex items-center gap-2 text-carbon-300 bg-carbon-800/50 rounded-lg px-3 py-2">
                        <Check className="w-4 h-4 text-apex-400" />
                        <span className="text-sm">{info.label}</span>
                      </div>
                    ) : null
                  })}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <div className="card p-6">
                <h3 className="font-display text-lg text-white mb-4">Informations</h3>
                <div className="space-y-4 text-sm">
                  <div>
                    <div className="text-carbon-400 mb-1">Adresse</div>
                    <div className="text-carbon-200">{club.address}<br />{club.postalCode} {club.city}</div>
                  </div>
                  <div>
                    <div className="text-carbon-400 mb-1">Horaires</div>
                    <div className="text-carbon-200">
                      Lun-Ven: {club.openingHours.weekdays}<br />
                      Samedi: {club.openingHours.saturday}<br />
                      Dimanche: {club.openingHours.sunday}
                    </div>
                  </div>
                  <div>
                    <div className="text-carbon-400 mb-1">Contact</div>
                    <a href={`tel:${club.phone}`} className="text-apex-400 hover:underline block">{club.phone}</a>
                    <a href={`mailto:${club.email}`} className="text-apex-400 hover:underline">{club.email}</a>
                  </div>
                  <div>
                    <div className="text-carbon-400 mb-1">Surface</div>
                    <div className="text-carbon-200">{club.surface}m²</div>
                  </div>
                </div>
              </div>

              <Link to={`/inscription?club=${club.id}`} className="btn-primary w-full justify-center">
                S'inscrire à ce club <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </Section>
    </>
  )
}
