'use client'

import { MessageCircle, Camera, CheckCircle2 } from 'lucide-react'

const WHATSAPP_NUMBER = '573226370671'

const CLEANABLE_ITEMS = [
  { name: 'Sofás', description: '2, 3 o más puestos' },
  { name: 'Sillas', description: 'De comedor, oficina, etc.' },
  { name: 'Colchones', description: 'Sencillo, doble, queen, king' },
  { name: 'Alfombras', description: 'Pequeñas, medianas y grandes' },
  { name: 'Tapetes', description: 'De cualquier tamaño' },
  { name: 'Cortinas', description: 'De tela lavable' },
  { name: 'Cojines', description: 'Decorativos y de sofá' },
  { name: 'Sillas de carro', description: 'Para bebé o adulto' },
]

export default function QuoteBasedSelector() {
  const handleWhatsAppClick = () => {
    const message = encodeURIComponent(
      'Hola, me gustaría cotizar el servicio de lavado en seco. Adjunto fotos de los elementos que necesito limpiar.'
    )
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${message}`, '_blank')
  }

  return (
    <>
      <div className="space-y-6 pb-28 sm:pb-6">
        {/* Header */}
        <div>
          <h3 className="text-2xl font-bold text-black dark:text-zinc-50 mb-2">
            Servicio de Lavado en Seco
          </h3>
          <p className="text-zinc-600 dark:text-zinc-400">
            Limpieza profesional para tus muebles y textiles del hogar
          </p>
        </div>

        {/* Items list */}
        <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-4">
          <h4 className="font-semibold text-black dark:text-zinc-50 mb-4">
            ¿Qué podemos limpiar?
          </h4>
          <div className="grid grid-cols-2 gap-3">
            {CLEANABLE_ITEMS.map((item) => (
              <div
                key={item.name}
                className="flex items-start gap-2 p-3 bg-zinc-50 dark:bg-zinc-800 rounded-lg"
              >
                <CheckCircle2 className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-zinc-900 dark:text-zinc-100">
                    {item.name}
                  </p>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pricing info */}
        <div className="bg-blue-50 dark:bg-blue-950 rounded-xl border border-blue-200 dark:border-blue-800 p-4">
          <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
            ¿Cómo se calcula el precio?
          </h4>
          <p className="text-blue-800 dark:text-blue-200 text-sm leading-relaxed">
            El precio del servicio depende de la <strong>cantidad</strong>, <strong>tamaño</strong> y <strong>tipo</strong> de
            elemento a limpiar. Por eso necesitamos ver fotos para darte una cotización precisa.
          </p>
        </div>

        {/* Instructions */}
        <div className="bg-zinc-100 dark:bg-zinc-800 rounded-xl p-4">
          <h4 className="font-semibold text-black dark:text-zinc-50 mb-3 flex items-center gap-2">
            <Camera className="w-5 h-5" />
            ¿Cómo solicitar tu cotización?
          </h4>
          <ol className="space-y-2 text-sm text-zinc-700 dark:text-zinc-300">
            <li className="flex items-start gap-2">
              <span className="bg-blue-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs flex-shrink-0">
                1
              </span>
              <span>Toma fotos claras de los elementos que deseas limpiar</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="bg-blue-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs flex-shrink-0">
                2
              </span>
              <span>Indica la cantidad de cada elemento</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="bg-blue-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs flex-shrink-0">
                3
              </span>
              <span>Envíanos las fotos por WhatsApp</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="bg-blue-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs flex-shrink-0">
                4
              </span>
              <span>Te responderemos con el precio y disponibilidad</span>
            </li>
          </ol>
        </div>

        {/* Desktop WhatsApp CTA - hidden on mobile */}
        <div className="hidden sm:block">
          <button
            onClick={handleWhatsAppClick}
            className="w-full py-4 px-6 bg-green-500 hover:bg-green-600 text-white rounded-xl font-semibold text-lg flex items-center justify-center gap-3 transition-colors shadow-lg hover:shadow-xl"
          >
            <MessageCircle className="w-6 h-6" />
            Cotizar por WhatsApp
          </button>
          <p className="text-center text-sm text-zinc-500 dark:text-zinc-400 mt-4">
            Te responderemos en menos de 2 horas en horario laboral
          </p>
        </div>
      </div>

      {/* Fixed Mobile WhatsApp CTA */}
      <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-zinc-900 border-t border-zinc-200 dark:border-zinc-800 p-4 z-50 sm:hidden">
        <button
          onClick={handleWhatsAppClick}
          className="w-full py-4 px-6 bg-green-500 hover:bg-green-600 text-white rounded-xl font-semibold text-lg flex items-center justify-center gap-3 transition-colors shadow-lg"
        >
          <MessageCircle className="w-6 h-6" />
          Cotizar por WhatsApp
        </button>
      </div>
    </>
  )
}
