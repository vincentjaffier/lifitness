import { useState, useEffect } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, User, ChevronDown } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { cn } from '../../utils/helpers'

const navigation = [
  { name: 'Clubs', href: '/clubs' },
  { name: 'Abonnements', href: '/abonnements' },
  { name: 'Activités', href: '/activites' },
  { name: 'Coaching', href: '/coaching' },
  { name: 'Planning', href: '/planning' },
]

const secondaryNav = [
  { name: 'Blog', href: '/blog' },
  { name: 'FAQ', href: '/faq' },
  { name: 'Contact', href: '/contact' },
]

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { isAuthenticated, user } = useAuth()
  const location = useLocation()

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [location])

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isMobileMenuOpen])

  return (
    <>
      <header
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
          isScrolled
            ? 'bg-carbon-950/95 backdrop-blur-md shadow-lg'
            : 'bg-transparent'
        )}
      >
        {/* Top bar - Hidden on mobile */}
        <div className="hidden lg:block border-b border-carbon-800/50">
          <div className="container-custom">
            <div className="flex items-center justify-between h-10 text-sm">
              <div className="flex items-center gap-6 text-carbon-400">
                <span>Ouvert 7j/7 de 6h à 23h</span>
                <span className="h-3 w-px bg-carbon-700" />
                <span>+33 1 00 00 00 00</span>
              </div>
              <nav className="flex items-center gap-6">
                {secondaryNav.map((item) => (
                  <NavLink
                    key={item.name}
                    to={item.href}
                    className={({ isActive }) =>
                      cn(
                        'text-carbon-400 hover:text-white transition-colors',
                        isActive && 'text-apex-400'
                      )
                    }
                  >
                    {item.name}
                  </NavLink>
                ))}
              </nav>
            </div>
          </div>
        </div>

        {/* Main navigation */}
        <div className="container-custom">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
            <div className="relative">
                <img 
                  src="/logo.png" 
                  alt="Lif'itness" 
                  className="w-12 h-12 object-contain transform group-hover:scale-105 transition-transform"
                />
              </div>
              <div className="flex flex-col">
                <span className="font-display font-bold text-xl text-white tracking-tight">
                  LIF 'ITNESS
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1">
              {navigation.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.href}
                  className={({ isActive }) =>
                    cn(
                      'px-4 py-2 text-sm font-medium rounded-lg transition-all duration-300',
                      isActive
                        ? 'text-apex-400 bg-apex-500/10'
                        : 'text-carbon-300 hover:text-white hover:bg-carbon-800/50'
                    )
                  }
                >
                  {item.name}
                </NavLink>
              ))}
            </nav>

            {/* CTA Buttons */}
            <div className="hidden lg:flex items-center gap-4">
              {isAuthenticated ? (
                <Link
                  to="/espace-membre"
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-carbon-300 hover:text-white rounded-lg hover:bg-carbon-800/50 transition-all"
                >
                  <User className="w-4 h-4" />
                  <span>{user?.firstName || 'Mon espace'}</span>
                </Link>
              ) : (
                <Link
                  to="/connexion"
                  className="px-4 py-2 text-sm font-medium text-carbon-300 hover:text-white transition-colors"
                >
                  Connexion
                </Link>
              )}
              <Link
                to="/inscription"
                className="btn-primary btn-sm"
              >
                S'inscrire
              </Link>
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 text-carbon-300 hover:text-white transition-colors"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 lg:hidden"
          >
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-carbon-950/90 backdrop-blur-sm"
              onClick={() => setIsMobileMenuOpen(false)}
            />

            {/* Menu content */}
            <motion.nav
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="absolute right-0 top-0 bottom-0 w-80 max-w-full bg-carbon-900 border-l border-carbon-800 overflow-y-auto"
            >
              <div className="p-6 pt-24">
                {/* Main nav */}
                <div className="space-y-1">
                  {navigation.map((item) => (
                    <NavLink
                      key={item.name}
                      to={item.href}
                      className={({ isActive }) =>
                        cn(
                          'block px-4 py-3 text-lg font-medium rounded-xl transition-all',
                          isActive
                            ? 'text-apex-400 bg-apex-500/10'
                            : 'text-carbon-200 hover:text-white hover:bg-carbon-800/50'
                        )
                      }
                    >
                      {item.name}
                    </NavLink>
                  ))}
                </div>

                {/* Divider */}
                <div className="my-6 h-px bg-carbon-800" />

                {/* Secondary nav */}
                <div className="space-y-1">
                  {secondaryNav.map((item) => (
                    <NavLink
                      key={item.name}
                      to={item.href}
                      className={({ isActive }) =>
                        cn(
                          'block px-4 py-3 text-base rounded-xl transition-all',
                          isActive
                            ? 'text-apex-400 bg-apex-500/10'
                            : 'text-carbon-400 hover:text-white hover:bg-carbon-800/50'
                        )
                      }
                    >
                      {item.name}
                    </NavLink>
                  ))}
                </div>

                {/* Divider */}
                <div className="my-6 h-px bg-carbon-800" />

                {/* Auth buttons */}
                <div className="space-y-3">
                  {isAuthenticated ? (
                    <Link
                      to="/espace-membre"
                      className="flex items-center gap-3 px-4 py-3 text-carbon-200 hover:text-white rounded-xl hover:bg-carbon-800/50 transition-all"
                    >
                      <User className="w-5 h-5" />
                      <span>Mon espace membre</span>
                    </Link>
                  ) : (
                    <Link
                      to="/connexion"
                      className="block px-4 py-3 text-carbon-300 hover:text-white rounded-xl hover:bg-carbon-800/50 transition-all"
                    >
                      Connexion
                    </Link>
                  )}
                  <Link
                    to="/inscription"
                    className="btn-primary w-full justify-center"
                  >
                    S'inscrire maintenant
                  </Link>
                </div>

                {/* Contact info */}
                <div className="mt-8 p-4 bg-carbon-800/30 rounded-xl">
                  <p className="text-sm text-carbon-400">Besoin d'aide ?</p>
                  <p className="text-white font-medium mt-1">+33 1 00 00 00 00</p>
                  <p className="text-sm text-carbon-400 mt-2">
                    Ouvert 7j/7 de 6h à 23h
                  </p>
                </div>
              </div>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Spacer for fixed header */}
      <div className="h-20 lg:h-[7.5rem]" />
    </>
  )
}
