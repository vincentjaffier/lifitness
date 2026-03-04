import { Link } from 'react-router-dom'
import { FileText, Download, Calendar } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import Section from '../../components/ui/Section'
import Badge from '../../components/ui/Badge'

const mockInvoices = [
  { id: 'INV-2024-001', date: '2024-02-01', amount: 69.90, status: 'paid' },
  { id: 'INV-2024-002', date: '2024-01-01', amount: 69.90, status: 'paid' },
  { id: 'INV-2023-012', date: '2023-12-01', amount: 69.90, status: 'paid' },
  { id: 'INV-2023-011', date: '2023-11-01', amount: 69.90, status: 'paid' },
]

export default function MyInvoices() {
  const { isAuthenticated } = useAuth()

  if (!isAuthenticated) return <Section><div className="container-custom text-center"><Link to="/connexion" className="btn-primary">Se connecter</Link></div></Section>

  return (
    <Section size="sm">
      <div className="container-custom max-w-2xl">
        <h1 className="font-display text-display-sm text-white mb-8">Mes factures</h1>

        {mockInvoices.length > 0 ? (
          <div className="space-y-3">
            {mockInvoices.map(invoice => (
              <div key={invoice.id} className="card p-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-carbon-800 flex items-center justify-center">
                    <FileText className="w-5 h-5 text-carbon-400" />
                  </div>
                  <div>
                    <div className="font-medium text-white">{invoice.id}</div>
                    <div className="text-sm text-carbon-400 flex items-center gap-1">
                      <Calendar className="w-3 h-3" /> {invoice.date}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="font-medium text-white">{invoice.amount.toFixed(2)}€</div>
                    <Badge variant="success">Payée</Badge>
                  </div>
                  <button className="btn-icon">
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="card p-8 text-center">
            <FileText className="w-12 h-12 text-carbon-600 mx-auto mb-4" />
            <p className="text-carbon-400">Aucune facture disponible</p>
          </div>
        )}
      </div>
    </Section>
  )
}
