import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Search, MapPin, Filter, X } from 'lucide-react'
import Section, { SectionHeader } from '../components/ui/Section'
import ClubCard from '../components/cards/ClubCard'
import { clubs, cities } from '../data/mockData'

export default function Clubs() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCity, setSelectedCity] = useState('')

  const filteredClubs = useMemo(() => {
    return clubs.filter(club => {
      const matchesSearch = !searchQuery || 
        club.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        club.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
        club.postalCode.includes(searchQuery)
      const matchesCity = !selectedCity || club.city.toLowerCase() === selectedCity.toLowerCase()
      return matchesSearch && matchesCity
    })
  }, [searchQuery, selectedCity])

  return (
    <>
      {/* Hero */}
      <section className="relative py-20 bg-carbon-900/50">
        <div className="container-custom">
          <SectionHeader badge="Nos clubs" title="Trouvez votre club APEX" subtitle="8 adresses premium en France" />
          
          {/* Search */}
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-carbon-400" />
              <input
                type="text"
                placeholder="Rechercher par ville ou code postal..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input pl-12 pr-4"
              />
            </div>
            
            {/* City filters */}
            <div className="flex flex-wrap gap-2 mt-4 justify-center">
              <button
                onClick={() => setSelectedCity('')}
                className={`px-4 py-2 rounded-full text-sm transition-all ${!selectedCity ? 'bg-apex-500 text-white' : 'bg-carbon-800 text-carbon-300 hover:bg-carbon-700'}`}
              >
                Toutes les villes
              </button>
              {cities.map(city => (
                <button
                  key={city.slug}
                  onClick={() => setSelectedCity(city.name)}
                  className={`px-4 py-2 rounded-full text-sm transition-all ${selectedCity === city.name ? 'bg-apex-500 text-white' : 'bg-carbon-800 text-carbon-300 hover:bg-carbon-700'}`}
                >
                  {city.name} ({city.count})
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Results */}
      <Section>
        <div className="container-custom">
          <div className="flex items-center justify-between mb-8">
            <p className="text-carbon-400">{filteredClubs.length} club{filteredClubs.length > 1 ? 's' : ''} trouvé{filteredClubs.length > 1 ? 's' : ''}</p>
            {(searchQuery || selectedCity) && (
              <button onClick={() => { setSearchQuery(''); setSelectedCity(''); }} className="text-apex-400 text-sm flex items-center gap-1">
                <X className="w-4 h-4" /> Réinitialiser
              </button>
            )}
          </div>

          {filteredClubs.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredClubs.map((club, i) => <ClubCard key={club.id} club={club} index={i} />)}
            </div>
          ) : (
            <div className="text-center py-16">
              <MapPin className="w-12 h-12 text-carbon-600 mx-auto mb-4" />
              <h3 className="font-display text-xl text-white mb-2">Aucun club trouvé</h3>
              <p className="text-carbon-400">Essayez avec une autre recherche</p>
            </div>
          )}
        </div>
      </Section>
    </>
  )
}
