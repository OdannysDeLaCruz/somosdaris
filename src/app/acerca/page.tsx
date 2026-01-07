import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { Target, Eye, Heart, Users, MapPin, Sparkles, CheckCircle, Shield } from 'lucide-react'
import { ROUTES } from '@/lib/routes'

export const metadata: Metadata = {
  title: "Acerca de Nosotros - SomosDaris",
  description: "Conoce más sobre SomosDaris, empresa de limpieza profesional en Valledupar comprometida con la excelencia y el servicio de calidad.",
}

export default function AcercaPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 dark:bg-zinc-950/95 backdrop-blur-sm border-b border-zinc-200 dark:border-zinc-800">
        <nav className="max-w-7xl px-8 md:px-12">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center">
              <Image
                src="/images/logo-azul.png"
                alt="SomosDaris"
                width={150}
                height={50}
                className="h-9 md:h-14 w-auto"
                priority
              />
            </Link>

            {/* Navigation */}
            <div className="flex items-center gap-4">
              <Link
                href="/"
                className="text-zinc-700 dark:text-zinc-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium"
              >
                Inicio
              </Link>
              <Link
                href={ROUTES.APP_HOME}
                className="px-6 py-2.5 bg-blue-600 text-white font-semibold rounded-sm hover:bg-blue-700 transition-colors"
              >
                Reservar
              </Link>
            </div>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-600 to-blue-800 dark:from-blue-900 dark:to-zinc-900 text-white pt-32 pb-20 md:pt-40 md:pb-32 overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/portada.png"
            alt="Background"
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* Blue Overlay */}
        <div className="absolute inset-0 z-0 bg-gradient-to-br from-blue-700/90 to-blue-700/90"></div>

        {/* Decorative Elements */}
        <div className="absolute top-20 right-10">
          <Image src="/images/grupo-burbujas.png" alt="" width={100} height={100} className="float-animation opacity-30" />
        </div>
        <div className="absolute bottom-10 left-10">
          <Image src="/images/burbuja-sola.png" alt="" width={80} height={80} className="float-animation-slow opacity-30" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6">
            Acerca de Nosotros
          </h1>
          <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto">
            Somos más que un servicio de limpieza, somos tu aliado en el cuidado de tu hogar y negocio
          </p>
        </div>
      </section>

      {/* Who We Are Section */}
      <section className="py-20 md:py-28 bg-zinc-50 dark:bg-zinc-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center">
            {/* Image */}
            <div className="relative order-2 md:order-1">
              <div className="absolute inset-0 bg-blue-600/10 dark:bg-blue-400/10 rounded-3xl blur-3xl"></div>
              <Image
                src="/images/landing.png"
                alt="SomosDaris Team"
                width={600}
                height={500}
                className="relative z-10 rounded-2xl shadow-2xl w-full h-auto"
              />
            </div>

            {/* Content */}
            <div className="order-1 md:order-2 space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-full text-sm font-semibold">
                <Users className="w-4 h-4" />
                <span>Nuestro Equipo</span>
              </div>

              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-zinc-900 dark:text-white">
                ¿Quiénes Somos?
              </h2>

              <div className="space-y-4 text-zinc-600 dark:text-zinc-400 leading-relaxed text-lg">
                <p>
                  <strong className="text-zinc-900 dark:text-white">SomosDaris</strong> es una empresa de limpieza profesional con sede en <strong className="text-blue-600 dark:text-blue-400">Valledupar, Cesar</strong>, comprometida con brindar servicios de limpieza de la más alta calidad a hogares y negocios.
                </p>
                <p>
                  Nos especializamos en ofrecer soluciones de limpieza flexibles y confiables, adaptadas a las necesidades específicas de cada cliente. Nuestro equipo está conformado por profesionales capacitados y verificados que utilizan productos y técnicas de última generación.
                </p>
                <p>
                  Creemos que un espacio limpio es fundamental para el bienestar, la productividad y la salud de las personas. Por eso, nos esforzamos cada día en superar las expectativas de nuestros clientes.
                </p>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-6 pt-6">
                <div className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-blue-600 dark:text-blue-400">100+</div>
                  <div className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">Clientes Satisfechos</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-blue-600 dark:text-blue-400">500+</div>
                  <div className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">Servicios Realizados</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-blue-600 dark:text-blue-400">4.5★</div>
                  <div className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">Calificación</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="py-20 md:py-28 bg-white dark:bg-zinc-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-zinc-900 dark:text-white mb-4">
              Nuestra Misión y Visión
            </h2>
            <p className="text-lg md:text-xl text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
              Guiados por nuestros valores y compromiso con la excelencia
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 md:gap-12">
            {/* Mission */}
            <div className="bg-gradient-to-br from-blue-50 to-white dark:from-zinc-900 dark:to-zinc-800 rounded-3xl p-8 md:p-10 shadow-lg border border-zinc-200 dark:border-zinc-700 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/5 dark:bg-blue-400/5 rounded-full blur-3xl"></div>

              <div className="relative z-10">
                <div className="w-16 h-16 bg-blue-600 dark:bg-blue-500 rounded-2xl flex items-center justify-center mb-6">
                  <Target className="w-8 h-8 text-white" strokeWidth={1.5} />
                </div>

                <h3 className="text-2xl md:text-3xl font-bold text-zinc-900 dark:text-white mb-4">
                  Nuestra Misión
                </h3>

                <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed text-lg mb-6">
                  Proporcionar servicios de limpieza profesionales de la más alta calidad, garantizando la satisfacción total de nuestros clientes a través de un equipo comprometido, productos especializados y atención personalizada.
                </p>

                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-1" />
                    <span className="text-zinc-700 dark:text-zinc-300">Excelencia en cada servicio</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-1" />
                    <span className="text-zinc-700 dark:text-zinc-300">Atención personalizada</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-1" />
                    <span className="text-zinc-700 dark:text-zinc-300">Compromiso con la satisfacción</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Vision */}
            <div className="bg-gradient-to-br from-cyan-50 to-white dark:from-zinc-900 dark:to-zinc-800 rounded-3xl p-8 md:p-10 shadow-lg border border-zinc-200 dark:border-zinc-700 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-600/5 dark:bg-cyan-400/5 rounded-full blur-3xl"></div>

              <div className="relative z-10">
                <div className="w-16 h-16 bg-cyan-600 dark:bg-cyan-500 rounded-2xl flex items-center justify-center mb-6">
                  <Eye className="w-8 h-8 text-white" strokeWidth={1.5} />
                </div>

                <h3 className="text-2xl md:text-3xl font-bold text-zinc-900 dark:text-white mb-4">
                  Nuestra Visión
                </h3>

                <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed text-lg mb-6">
                  Convertirnos en la plataforma digital líder de servicios de limpieza en Colombia, ayudando a miles de hogares y negocios a mantener espacios limpios, saludables y productivos a través de tecnología innovadora y servicio excepcional.
                </p>

                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-cyan-600 dark:text-cyan-400 flex-shrink-0 mt-1" />
                    <span className="text-zinc-700 dark:text-zinc-300">Expansión nacional</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-cyan-600 dark:text-cyan-400 flex-shrink-0 mt-1" />
                    <span className="text-zinc-700 dark:text-zinc-300">Innovación tecnológica</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-cyan-600 dark:text-cyan-400 flex-shrink-0 mt-1" />
                    <span className="text-zinc-700 dark:text-zinc-300">Impacto positivo en la comunidad</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 md:py-28 bg-zinc-50 dark:bg-zinc-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-zinc-900 dark:text-white mb-4">
              Nuestros Valores
            </h2>
            <p className="text-lg md:text-xl text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
              Los principios que guían nuestro trabajo cada día
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Value 1 */}
            <div className="bg-white dark:bg-zinc-800 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-14 h-14 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center mb-6">
                <Heart className="w-7 h-7 text-blue-600 dark:text-blue-400" strokeWidth={1.5} />
              </div>
              <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-3">
                Compromiso
              </h3>
              <p className="text-zinc-600 dark:text-zinc-400">
                Dedicación total en cada servicio, superando las expectativas de nuestros clientes.
              </p>
            </div>

            {/* Value 2 */}
            <div className="bg-white dark:bg-zinc-800 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-14 h-14 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center mb-6">
                <Sparkles className="w-7 h-7 text-green-600 dark:text-green-400" strokeWidth={1.5} />
              </div>
              <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-3">
                Calidad
              </h3>
              <p className="text-zinc-600 dark:text-zinc-400">
                Excelencia en cada detalle, utilizando los mejores productos y técnicas.
              </p>
            </div>

            {/* Value 3 */}
            <div className="bg-white dark:bg-zinc-800 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-14 h-14 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center mb-6">
                <Users className="w-7 h-7 text-purple-600 dark:text-purple-400" strokeWidth={1.5} />
              </div>
              <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-3">
                Confianza
              </h3>
              <p className="text-zinc-600 dark:text-zinc-400">
                Personal verificado y capacitado en quien puedes confiar plenamente.
              </p>
            </div>

            {/* Value 4 */}
            <div className="bg-white dark:bg-zinc-800 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-14 h-14 bg-orange-100 dark:bg-orange-900/30 rounded-xl flex items-center justify-center mb-6">
                <MapPin className="w-7 h-7 text-orange-600 dark:text-orange-400" strokeWidth={1.5} />
              </div>
              <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-3">
                Cercanía
              </h3>
              <p className="text-zinc-600 dark:text-zinc-400">
                Orgullosamente de Valledupar, comprometidos con nuestra comunidad.
              </p>
            </div>

            {/* Value 5 */}
            <div className="bg-white dark:bg-zinc-800 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-14 h-14 bg-cyan-100 dark:bg-cyan-900/30 rounded-xl flex items-center justify-center mb-6">
                <Target className="w-7 h-7 text-cyan-600 dark:text-cyan-400" strokeWidth={1.5} />
              </div>
              <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-3">
                Innovación
              </h3>
              <p className="text-zinc-600 dark:text-zinc-400">
                Tecnología digital para hacer tu experiencia más fácil y conveniente.
              </p>
            </div>

            {/* Value 6 */}
            <div className="bg-white dark:bg-zinc-800 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-14 h-14 bg-pink-100 dark:bg-pink-900/30 rounded-xl flex items-center justify-center mb-6">
                <Shield className="w-7 h-7 text-pink-600 dark:text-pink-400" strokeWidth={1.5} />
              </div>
              <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-3">
                Responsabilidad
              </h3>
              <p className="text-zinc-600 dark:text-zinc-400">
                Cumplimos con lo prometido, garantizando tu satisfacción total.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-28 bg-gradient-to-br from-blue-600 to-blue-800 dark:from-blue-900 dark:to-zinc-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <Image src="/images/portada.png" alt="" fill className="object-cover" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
            ¿Listo para experimentar la diferencia?
          </h2>
          <p className="text-xl md:text-2xl text-blue-100 mb-8">
            Únete a cientos de clientes satisfechos que confían en nosotros
          </p>
          <Link
            href={ROUTES.APP_HOME}
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-blue-600 font-semibold rounded-lg shadow-lg hover:bg-blue-50 transition-all duration-300 transform hover:scale-105"
          >
            <span>Reservar servicio ahora</span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-zinc-900 dark:bg-black text-zinc-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Columna 1 - Info */}
            <div>
              <h3 className="text-white font-bold text-lg mb-4">SomosDaris</h3>
              <p className="text-sm leading-relaxed">
                Servicio profesional de limpieza en Valledupar, Cesar. Calidad y confianza garantizada.
              </p>
            </div>

            {/* Columna 2 - Enlaces */}
            <div>
              <h3 className="text-white font-bold text-lg mb-4">Enlaces</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/" className="hover:text-white transition-colors">
                    Inicio
                  </Link>
                </li>
                <li>
                  <Link href="/acerca" className="hover:text-white transition-colors">
                    Acerca
                  </Link>
                </li>
                <li>
                  <Link href={ROUTES.APP_HOME} className="hover:text-white transition-colors">
                    Servicios
                  </Link>
                </li>
                <li>
                  <Link href={ROUTES.LOGIN} className="hover:text-white transition-colors">
                    Iniciar Sesión
                  </Link>
                </li>
              </ul>
            </div>

            {/* Columna 3 - Contacto */}
            <div className="sm:col-span-2 lg:col-span-1">
              <h3 className="text-white font-bold text-lg mb-4">Contacto</h3>
              <ul className="space-y-2 text-sm mb-4">
                <li>Valledupar, Cesar</li>
                <li>Colombia</li>
              </ul>
              <a
                href="https://wa.me/573226370671?text=Hola,%20me%20gustaría%20obtener%20información%20sobre%20los%20servicios%20de%20limpieza"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold rounded-lg transition-colors"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                </svg>
                WhatsApp
              </a>
            </div>
          </div>

          <div className="border-t border-zinc-800 mt-8 pt-8 text-center text-sm">
            <p>&copy; {new Date().getFullYear()} SomosDaris. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
