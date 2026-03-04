import { Link } from 'react-router-dom'
import { 
  MapPin, 
  Phone, 
  Mail, 
  Instagram, 
  Youtube,
  Facebook,
  Linkedin,
  ArrowRight
} from 'lucide-react'

const footerLinks = {
  explore: [
    { name: 'Nos clubs', href: '/clubs' },
    { name: 'Abonnements', href: '/abonnements' },
    { name: 'Activités', href: '/activites' },
    { name: 'Planning des cours', href: '/planning' },
    { name: 'Coaching', href: '/coaching' },
  ],
  company: [
    { name: 'À propos', href: '/a-propos' },
    { name: 'Carrières', href: '/carrieres' },
    { name: 'Presse', href: '/presse' },
    { name: 'Partenariats', href: '/partenariats' },
    { name: 'Blog', href: '/blog' },
  ],
  support: [
    { name: 'FAQ', href: '/faq' },
    { name: 'Contact', href: '/contact' },
    { name: 'Espace membre', href: '/espace-membre' },
    { name: 'Application mobile', href: '/app' },
    { name: 'Offres entreprise', href: '/entreprise' },
  ],
  legal: [
    { name: 'Mentions légales', href: '/mentions-legales' },
    { name: 'CGV', href: '/cgv' },
    { name: 'Politique de confidentialité', href: '/confidentialite' },
    { name: 'Cookies', href: '/cookies' },
    { name: 'Accessibilité', href: '/accessibilite' },
  ]
}

const socialLinks = [
  { name: 'Instagram', icon: Instagram, href: 'https://instagram.com' },
  { name: 'YouTube', icon: Youtube, href: 'https://youtube.com' },
  { name: 'Facebook', icon: Facebook, href: 'https://facebook.com' },
  { name: 'LinkedIn', icon: Linkedin, href: 'https://linkedin.com' },
]

export default function Footer() {
  return (
    <footer className="bg-carbon-900 border-t border-carbon-800">
      {/* Newsletter Section */}
      <div className="border-b border-carbon-800">
        <div className="container-custom py-12 md:py-16">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="text-center lg:text-left">
              <h3 className="font-display text-2xl md:text-3xl text-white mb-2">
                Restez informé
              </h3>
              <p className="text-carbon-400 max-w-md">
                Recevez nos conseils fitness, offres exclusives et nouveautés directement dans votre boîte mail.
              </p>
            </div>
            <form className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
              <input
                type="email"
                placeholder="Votre email"
                className="input sm:w-72"
              />
              <button type="submit" className="btn-primary whitespace-nowrap">
                S'abonner
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="container-custom py-12 md:py-16">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 lg:gap-12">
          {/* Brand Column */}
          <div className="col-span-2 md:col-span-3 lg:col-span-2">
            <Link to="/" className="inline-flex items-center gap-3 group mb-6">
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-apex rounded-lg flex items-center justify-center">
                  <span className="font-display font-bold text-white text-xl">A</span>
                </div>
              </div>
              <div className="flex flex-col">
                <span className="font-display font-bold text-xl text-white tracking-tight">
                  APEX
                </span>
                <span className="text-[10px] text-apex-400 uppercase tracking-[0.2em] -mt-1">
                  Fitness
                </span>
              </div>
            </Link>
            <p className="text-carbon-400 mb-6 max-w-sm">
              Le réseau de salles de sport premium. Des équipements haut de gamme, des coachs d'élite et une communauté passionnée pour atteindre l'excellence.
            </p>
            
            {/* Contact Info */}
            <div className="space-y-3 mb-6">
              <a 
                href="tel:+33100000000" 
                className="flex items-center gap-3 text-carbon-300 hover:text-apex-400 transition-colors"
              >
                <Phone className="w-4 h-4" />
                <span>+33 1 00 00 00 00</span>
              </a>
              <a 
                href="mailto:contact@apex-fitness.fr" 
                className="flex items-center gap-3 text-carbon-300 hover:text-apex-400 transition-colors"
              >
                <Mail className="w-4 h-4" />
                <span>contact@apex-fitness.fr</span>
              </a>
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-carbon-800 text-carbon-400 hover:bg-apex-500 hover:text-white transition-all"
                  aria-label={social.name}
                >
                  <social.icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Links Columns */}
          <div>
            <h4 className="font-display font-semibold text-white mb-4">Explorer</h4>
            <ul className="space-y-3">
              {footerLinks.explore.map((link) => (
                <li key={link.name}>
                  <Link 
                    to={link.href}
                    className="text-carbon-400 hover:text-apex-400 transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-display font-semibold text-white mb-4">Entreprise</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link 
                    to={link.href}
                    className="text-carbon-400 hover:text-apex-400 transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-display font-semibold text-white mb-4">Support</h4>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                  <Link 
                    to={link.href}
                    className="text-carbon-400 hover:text-apex-400 transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-display font-semibold text-white mb-4">Légal</h4>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <Link 
                    to={link.href}
                    className="text-carbon-400 hover:text-apex-400 transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-carbon-800">
        <div className="container-custom py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-carbon-500">
            <p>© 2024 APEX FITNESS. Tous droits réservés.</p>
            <div className="flex items-center gap-6">
              <span className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-success-500 animate-pulse" />
                8 clubs en France
              </span>
              <span>Paiement 100% sécurisé</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
