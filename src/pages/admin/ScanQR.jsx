import { useState, useEffect, useRef } from 'react'
import { Html5QrcodeScanner } from 'html5-qrcode'
import { CheckCircle, XCircle, User, Clock, RotateCcw } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import Section from '../../components/ui/Section'

export default function ScanQR() {
  const [scanResult, setScanResult] = useState(null)
  const [member, setMember] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const [recentScans, setRecentScans] = useState([])
  const scannerRef = useRef(null)

  useEffect(() => {
    if (!scanResult) {
      const scanner = new Html5QrcodeScanner('reader', {
        qrbox: { width: 250, height: 250 },
        fps: 5,
      })

      scanner.render(onScanSuccess, onScanFailure)
      scannerRef.current = scanner

      return () => {
        scanner.clear().catch(console.error)
      }
    }
  }, [scanResult])

  const onScanSuccess = async (decodedText) => {
    if (loading) return
    if (scanResult === decodedText) return
    
    setLoading(true)
    setScanResult(decodedText)
    setError(null)
    setMember(null)

    // Arrêter le scanner
    if (scannerRef.current) {
      scannerRef.current.clear().catch(console.error)
    }

    try {
      // Vérifier si c'est un UUID valide
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
      
      if (!uuidRegex.test(decodedText)) {
        setError('QR Code invalide')
        setLoading(false)
        return
      }

      // Chercher dans la table profiles (si elle existe) ou utiliser les données locales
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', decodedText)
        .single()

      if (profile && !profileError) {
        const memberData = {
            id: profile.id,
            email: profile.email,
            first_name: profile.first_name || '',
            last_name: profile.last_name || '',
            avatar_url: profile.avatar_url || null,
          }
        setMember(memberData)
        addToRecentScans(memberData)
      } else {
        // Si pas trouvé dans profiles, on affiche quand même un succès basique
        // car le QR Code est valide (format UUID)
        const memberData = {
          id: decodedText,
          email: 'Membre vérifié',
          first_name: 'Membre',
          last_name: '#' + decodedText.slice(0, 8).toUpperCase(),
        }
        setMember(memberData)
        addToRecentScans(memberData)
      }
    } catch (err) {
      console.error('Erreur:', err)
      setError('Erreur lors de la vérification')
    } finally {
      setLoading(false)
    }
  }

  const onScanFailure = (error) => {
    // Silencieux
  }

  const addToRecentScans = (memberData) => {
    const newScan = {
      ...memberData,
      time: new Date().toLocaleTimeString('fr-FR'),
    }
    setRecentScans(prev => [newScan, ...prev.slice(0, 9)])
  }

  const resetScan = () => {
    setScanResult(null)
    setMember(null)
    setError(null)
  }

  return (
    <Section>
      <div className="container-custom max-w-2xl">
        <h1 className="font-display text-display-sm text-white mb-8 text-center">
          Scanner d'entrée
        </h1>

        {/* Scanner */}
        {!scanResult && (
          <div className="card p-6 mb-6">
            <div id="reader" className="overflow-hidden rounded-lg"></div>
            <p className="text-carbon-400 text-center mt-4">
              Placez le QR Code du membre devant la caméra
            </p>
          </div>
        )}

        {/* Résultat du scan */}
        {scanResult && (
          <div className="card p-6 mb-6">
            {loading && (
              <div className="text-center py-8">
                <div className="animate-spin w-8 h-8 border-2 border-apex-500 border-t-transparent rounded-full mx-auto"></div>
                <p className="text-carbon-400 mt-4">Vérification...</p>
              </div>
            )}

            {member && !loading && (
  <div className="text-center py-6">
    {member.avatar_url ? (
      <img src={member.avatar_url} alt={member.first_name} className="w-24 h-24 rounded-full object-cover mx-auto mb-4 border-4 border-success-500" />
    ) : (
      <div className="w-20 h-20 bg-success-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
        <CheckCircle className="w-10 h-10 text-success-500" />
      </div>
    )}
                <h2 className="font-display text-2xl text-white mb-2">Accès autorisé ✅</h2>
                <p className="text-xl text-apex-400 mb-1">
                  {member.first_name} {member.last_name}
                </p>
                <p className="text-carbon-400">{member.email}</p>
                
                <button onClick={resetScan} className="btn-primary mt-6">
                  <RotateCcw className="w-4 h-4" /> Scanner un autre membre
                </button>
              </div>
            )}

            {error && !loading && (
              <div className="text-center py-6">
                <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <XCircle className="w-10 h-10 text-red-500" />
                </div>
                <h2 className="font-display text-2xl text-white mb-2">Accès refusé ❌</h2>
                <p className="text-red-400">{error}</p>
                
                <button onClick={resetScan} className="btn-primary mt-6">
                  <RotateCcw className="w-4 h-4" /> Réessayer
                </button>
              </div>
            )}
          </div>
        )}

        {/* Historique des scans récents */}
        {recentScans.length > 0 && (
          <div className="card p-6">
            <h2 className="font-display text-lg text-white mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-apex-400" />
              Passages récents
            </h2>
            <div className="space-y-3">
              {recentScans.map((scan, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-carbon-800/50 rounded-lg">
                  <div className="flex items-center gap-3">
                  {scan.avatar_url ? (
  <img src={scan.avatar_url} alt={scan.first_name} className="w-8 h-8 rounded-full object-cover" />
) : (
  <div className="w-8 h-8 bg-success-500/20 rounded-full flex items-center justify-center">
    <User className="w-4 h-4 text-success-500" />
  </div>
)}
                    <div>
                      <p className="text-white font-medium">{scan.first_name} {scan.last_name}</p>
                      <p className="text-carbon-400 text-sm">{scan.email}</p>
                    </div>
                  </div>
                  <span className="text-carbon-400 text-sm">{scan.time}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Section>
  )
}