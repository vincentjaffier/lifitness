import { QRCodeSVG } from 'qrcode.react'

export default function QRCodeCard({ user }) {
  if (!user?.id) return null

  return (
    <div className="card p-6 text-center">
      <h2 className="font-display text-lg text-white mb-4">Ma carte membre</h2>
      
      <div className="bg-white p-4 rounded-xl inline-block mb-4">
        <QRCodeSVG 
          value={user.id} 
          size={180}
          level="H"
          includeMargin={true}
        />
      </div>
      
      <p className="text-carbon-400 text-sm mb-2">
        {user.first_name} {user.last_name}
      </p>
      <p className="text-carbon-500 text-xs font-mono">
        {user.id.slice(0, 8).toUpperCase()}
      </p>
      
      <p className="text-carbon-500 text-xs mt-4">
        Présentez ce QR Code à l'entrée de la salle
      </p>
    </div>
  )
}