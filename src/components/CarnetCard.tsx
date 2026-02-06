import Image from 'next/image'

interface CarnetCardProps {
  type: 'cvt' | 'cvu'
  allyName: string
  allyPhoto: string | null
  identificationNumber: string | null
  serviceName: string | string[]
}

export default function CarnetCard({
  type,
  allyName,
  allyPhoto,
  identificationNumber,
  serviceName,
}: CarnetCardProps) {
  const initials = allyName
    .split(' ')
    .map((n) => n.charAt(0))
    .slice(0, 2)
    .join('')
    .toUpperCase()

  const services = Array.isArray(serviceName) ? serviceName : [serviceName]

  return (
    <div className="w-full max-w-sm mx-auto">
      <div className="rounded-3xl shadow-2xl overflow-hidden relative bg-gradient-to-b from-[#1a56db] via-[#1e40af] to-[#0f2a6e]">

        {/* Decorative wave shape */}
        <div className="absolute top-[52%] left-0 right-0 h-[50%] z-0">
          <svg viewBox="0 0 400 80" fill="none" className="w-full" preserveAspectRatio="none">
            <path
              d="M0 40 C80 0, 160 70, 240 30 C300 0, 360 50, 400 20 L400 80 L0 80Z"
              fill="rgba(255,255,255,0.06)"
            />
          </svg>
        </div>
        <div className="absolute top-[58%] left-0 right-0 h-[45%] z-0">
          <svg viewBox="0 0 400 80" fill="none" className="w-full" preserveAspectRatio="none">
            <path
              d="M0 50 C100 20, 200 60, 300 25 C350 10, 380 40, 400 30 L400 80 L0 80Z"
              fill="rgba(255,255,255,0.04)"
            />
          </svg>
        </div>

        {/* Bubbles */}
        <Image
          src="/images/burbuja-sola.png"
          alt=""
          width={60}
          height={60}
          className="absolute top-4 right-4 opacity-20 pointer-events-none"
          aria-hidden
        />
        <Image
          src="/images/burbuja-sola.png"
          alt=""
          width={35}
          height={35}
          className="absolute top-16 right-16 opacity-15 pointer-events-none"
          aria-hidden
        />
        <Image
          src="/images/burbuja-sola.png"
          alt=""
          width={25}
          height={25}
          className="absolute top-10 left-6 opacity-10 pointer-events-none"
          aria-hidden
        />
        <Image
          src="/images/burbuja-sola.png"
          alt=""
          width={45}
          height={45}
          className="absolute bottom-20 left-4 opacity-15 pointer-events-none"
          aria-hidden
        />
        <Image
          src="/images/burbuja-sola.png"
          alt=""
          width={30}
          height={30}
          className="absolute bottom-8 right-8 opacity-10 pointer-events-none"
          aria-hidden
        />

        {/* Content */}
        <div className="relative z-10">
          {/* Header */}
          <div className="px-6 pt-6 pb-2 text-center">
            <Image
              src="/images/logo-azul.png"
              alt="SomosDaris"
              width={150}
              height={38}
              className="mx-auto brightness-0 invert drop-shadow-md"
            />
            <div className="mt-2 inline-block px-4 py-1 rounded-full bg-white/10 backdrop-blur-sm border border-white/20">
              <span className="text-blue-100 text-[11px] tracking-[0.2em] uppercase font-medium">
                {type === 'cvt' ? 'Carnet Temporal' : 'Carnet de Identificación'}
              </span>
            </div>
          </div>

          {/* Photo Section */}
          <div className="flex justify-center mt-4 mb-3">
            <div className="relative">
              {/* Glow ring */}
              <div className="absolute -inset-1.5 rounded-full bg-gradient-to-br from-sky-300/40 to-blue-500/40 blur-sm" />
              {allyPhoto ? (
                <Image
                  src={allyPhoto}
                  alt={allyName}
                  width={110}
                  height={110}
                  className="relative w-28 h-28 rounded-full border-[3px] border-white/80 shadow-lg object-cover"
                />
              ) : (
                <div className="relative w-28 h-28 rounded-full border-[3px] border-white/80 shadow-lg bg-gradient-to-br from-sky-200 to-blue-300 flex items-center justify-center">
                  <span className="text-3xl font-bold text-blue-700 drop-shadow-sm">{initials}</span>
                </div>
              )}
            </div>
          </div>

          {/* Info */}
          <div className="px-6 pt-1 pb-6 text-center space-y-3">
            <div>
              <h2 className="text-2xl font-bold text-white tracking-wide drop-shadow-sm">{allyName}</h2>
              {identificationNumber && (
                <p className="text-sm text-blue-200/80 mt-1 font-mono tracking-wider">
                  CC {identificationNumber}
                </p>
              )}
            </div>

            {/* Divider */}
            <div className="flex items-center gap-3 px-4">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
              <Image
                src="/images/burbuja-sola.png"
                alt=""
                width={14}
                height={14}
                className="opacity-40"
                aria-hidden
              />
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
            </div>

            {/* Services */}
            <div className="flex flex-wrap gap-2 justify-center">
              {services.map((svc) => (
                <span
                  key={svc}
                  className="inline-block px-4 py-1.5 bg-white/15 backdrop-blur-sm text-white text-sm font-medium rounded-full border border-white/20 shadow-sm"
                >
                  {svc}
                </span>
              ))}
            </div>

            {/* Type Badge */}
            <div className="pt-1">
              {type === 'cvt' ? (
                <span className="inline-block px-5 py-1.5 bg-amber-400/20 text-amber-200 text-xs font-bold rounded-full border border-amber-300/30 uppercase tracking-[0.15em]">
                  Temporal
                </span>
              ) : (
                <span className="inline-block px-5 py-1.5 bg-emerald-400/20 text-emerald-200 text-xs font-bold rounded-full border border-emerald-300/30 uppercase tracking-[0.15em]">
                  Verificado
                </span>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-3 text-center border-t border-white/10">
            <p className="text-[11px] text-blue-300/60 tracking-wider">
              somosdaris.com
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
