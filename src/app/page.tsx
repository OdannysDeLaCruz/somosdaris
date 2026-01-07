import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { BadgeCheck, ShieldCheck, CreditCard, CheckCircle, Lock, Shield, Smartphone, Wallet, Home, Clock, Droplets, ArrowRight } from 'lucide-react'
import { ROUTES } from '@/lib/routes'

export const metadata: Metadata = {
  title: "SomosDaris - Servicio de Limpieza Profesional en Valledupar",
  description: "Servicio profesional de limpieza en Valledupar, Cesar. Limpieza de casas, oficinas y espacios comerciales. Reserva fácil y rápido con diferentes opciones de precios.",
  keywords: ["limpieza", "Valledupar", "Cesar", "servicio de limpieza", "limpieza profesional", "limpieza de casas", "limpieza de oficinas"],
  openGraph: {
    title: "SomosDaris - Servicio de Limpieza Profesional en Valledupar",
    description: "Servicio profesional de limpieza en Valledupar, Cesar. Reserva fácil y rápido con diferentes opciones de precios.",
    type: "website",
  }
}

export default async function LandingPage() {
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

            {/* Navigation - Desktop */}
            <div className="hidden md:flex items-center space-x-12">
              <a href="#inicio" className="text-black hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium">
                Inicio
              </a>
              <Link href="/acerca" className="text-black hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium">
                Acerca
              </Link>
              <a
                href="https://wa.me/573226370671?text=Hola,%20me%20gustaría%20obtener%20información%20sobre%20los%20servicios%20de%20limpieza"
                target="_blank"
                rel="noopener noreferrer"
                className="text-black hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium"
              >
                Contactanos
              </a>
              <Link
                href={ROUTES.APP_HOME}
                className="px-6 py-2.5 bg-blue-600 text-white font-semibold rounded-sm hover:bg-blue-700 transition-colors"
              >
                Reservar
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <Link
              href={ROUTES.APP_HOME}
              className="md:hidden px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-sm hover:bg-blue-700 transition-colors"
            >
              Reservar
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section id="inicio" className="relative bg-gradient-to-br from-blue-600 to-blue-800 dark:from-blue-900 dark:to-zinc-900 text-white pt-24 md:pt-32 overflow-hidden">
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
        <div className="absolute inset-0 z-0 bg-gradient-to-br from-blue-700/80 to-blue-700"></div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center mt-12 md:mt-0">
            <div className="space-y-6 text-center md:text-left relative mb-16">
              
              <Image src="/images/grupo-burbujas.png" alt="Somos Daris" width={50} height={50} className="mx-auto md:mx-0 absolute -top-10 -left-5 float-animation" />
              <Image src="/images/burbuja-sola.png" alt="Somos Daris" width={50} height={50} className="mx-auto md:mx-0 absolute -top-10 -right-0 z-5 rotate-180 float-animation-slow" />

              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight z-10 relative text-white">
                Limpieza Profesional en Valledupar
              </h1>
              <p className="text-lg sm:text-xl md:text-2xl text-blue-100">
                Servicio de limpieza confiable y profesional para tu hogar u oficina
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                <Link
                  href={ROUTES.APP_HOME}
                  className="inline-block px-8 py-4 bg-white text-blue-600 font-semibold rounded-sm hover:bg-blue-50 transition-colors text-center"
                >
                  Reservar servicio
                </Link>
                <Link
                  href={ROUTES.LOGIN}
                  className="inline-block px-8 py-4 border-2 border-white text-white font-semibold rounded-sm hover:bg-white/10 transition-colors text-center"
                >
                  Iniciar sesión
                </Link>
              </div>
            </div>
            <div className="flex justify-center mt-auto">
              <Image
                src="/images/landing.png"
                alt="SomosDaris Logo"
                width={300}
                height={300}
                className="w-48 sm:w-64 md:w-72 lg:w-80 h-auto"
                priority
                style={{ width: 'auto', height: 'auto' }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="acerca" className="py-16 md:py-24 bg-zinc-50 dark:bg-zinc-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
            {/* Feature 1 - Servicio de Calidad */}
            <div className="bg-white dark:bg-zinc-800 p-6 md:p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow relative">
              <Image src="/images/grupo-burbujas.png" alt="Somos Daris" width={50} height={50} className="mx-auto md:mx-0 absolute -top-10 left-10 float-animation" />
              <BadgeCheck className="w-10 h-10 md:w-15 md:h-15 mb-3 text-blue-600 dark:text-blue-400" strokeWidth={1} />
              <h3 className="text-xl md:text-2xl font-bold text-zinc-900 dark:text-white mb-3">
                Servicio de Calidad
              </h3>
              <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
                Personal altamente capacitado y productos profesionales para garantizar los mejores resultados en cada servicio.
              </p>
            </div>

            {/* Feature 2 - Garantizado */}
            <div className="bg-white dark:bg-zinc-800 p-6 md:p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow relative">
               <Image src="/images/burbuja-sola.png" alt="Somos Daris" width={60} height={70} className="mx-auto md:mx-0 absolute top-40 -left-9 float-animation-slow" />
              <ShieldCheck className="w-10 h-10 md:w-15 md:h-15 mb-3 text-blue-600 dark:text-blue-400" strokeWidth={1} />
              <h3 className="text-xl md:text-2xl font-bold text-zinc-900 dark:text-white mb-3">
                Garantizado
              </h3>
              <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
                Tu satisfacción es nuestra prioridad. Si no quedas satisfecho, <strong>volvemos sin costo adicional</strong>.
              </p>
            </div>

            {/* Feature 3 - Pagos en Línea */}
            <div className="bg-white dark:bg-zinc-800 p-6 md:p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow sm:col-span-2 lg:col-span-1 relative">
              <Image src="/images/grupo-burbujas.png" alt="Somos Daris" width={60} height={60} className="mx-auto md:mx-0 absolute -top-15 right-5 rotate-50" />
              <CreditCard className="w-10 h-10 md:w-15 md:h-15 mb-3 text-blue-600 dark:text-blue-400" strokeWidth={1} />
              <h3 className="text-xl md:text-2xl font-bold text-zinc-900 dark:text-white mb-3">
                Pagos en Línea
              </h3>
              <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
                Reserva y paga de forma segura a través de nuestra plataforma. Múltiples métodos de pago disponibles.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 md:py-28 bg-white dark:bg-zinc-950 relative overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute top-20 left-10 opacity-10">
          <Image src="/images/grupo-burbujas.png" alt="" width={100} height={100} className="float-animation-slow" />
        </div>
        <div className="absolute bottom-10 right-10 opacity-10">
          <Image src="/images/burbuja-sola.png" alt="" width={80} height={80} className="float-animation" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-zinc-900 dark:text-white mb-4">
              Nuestros Servicios
            </h2>
            <p className="text-lg md:text-xl text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
              Soluciones profesionales de limpieza adaptadas a tus necesidades
            </p>
          </div>

          {/* Services Grid */}
          <div className="grid md:grid-cols-2 gap-8 md:gap-12">
            {/* Service 1 - Limpieza por Horas */}
            <div className="group relative bg-gradient-to-br from-blue-50 to-white dark:from-zinc-900 dark:to-zinc-800 rounded-3xl p-8 md:p-10 shadow-lg hover:shadow-2xl transition-all duration-300 border border-zinc-200 dark:border-zinc-700">
              {/* Icon */}
              <div className="w-16 h-16 md:w-20 md:h-20 bg-blue-600 dark:bg-blue-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Home className="w-8 h-8 md:w-10 md:h-10 text-white" strokeWidth={1.5} />
              </div>

              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-full text-xs font-semibold mb-4">
                <Clock className="w-3 h-3" />
                <span>Por horas</span>
              </div>

              {/* Content */}
              <h3 className="text-2xl md:text-3xl font-bold text-zinc-900 dark:text-white mb-4">
                Limpieza del Hogar
              </h3>
              <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed mb-6">
                Servicio de limpieza profesional por horas para tu casa u oficina. Flexible, confiable y adaptado a tu horario. Elige las horas que necesites.
              </p>

              {/* Features List */}
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-2 text-black font-bold">
                  <CheckCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                  <span className="text-md">Paquetes de 4, 6 y 8 horas</span>
                </li>
                <li className="flex items-center gap-2 text-black font-bold">
                  <CheckCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                  <span className="text-md">Personal capacitado y verificado</span>
                </li>
                <li className="flex items-center gap-2 text-black font-bold">
                  <CheckCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                  <span className="text-md">Productos y equipos incluidos</span>
                </li>
              </ul>

              {/* CTA Button */}
              <Link
                href={ROUTES.APP_HOME}
                className="inline-flex items-center justify-center gap-2 w-full px-6 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-all duration-300 group"
              >
                <span>Reservar servicio</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            {/* Service 2 - Limpieza de Tanques */}
            <div className="group relative bg-gradient-to-br from-cyan-50 to-white dark:from-zinc-900 dark:to-zinc-800 rounded-3xl p-8 md:p-10 shadow-lg hover:shadow-2xl transition-all duration-300 border border-zinc-200 dark:border-zinc-700">
              {/* Icon */}
              <div className="w-16 h-16 md:w-20 md:h-20 bg-cyan-600 dark:bg-cyan-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Droplets className="w-8 h-8 md:w-10 md:h-10 text-white" strokeWidth={1.5} />
              </div>

              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-cyan-100 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-400 rounded-full text-xs font-semibold mb-4">
                <Shield className="w-3 h-3" />
                <span>Especializado</span>
              </div>

              {/* Content */}
              <h3 className="text-2xl md:text-3xl font-bold text-zinc-900 dark:text-white mb-4">
                Limpieza de Tanques Elevados
              </h3>
              <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed mb-6">
                Limpieza y desinfección profesional de tanques de agua elevados. Agua limpia y segura para tu familia con técnicas especializadas.
              </p>

              {/* Features List */}
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-2 text-black font-bold">
                  <CheckCircle className="w-5 h-5 text-cyan-600 dark:text-cyan-400 flex-shrink-0" />
                  <span className="text-md">Desinfección completa del tanque</span>
                </li>
                <li className="flex items-center gap-2 text-black font-bold">
                  <CheckCircle className="w-5 h-5 text-cyan-600 dark:text-cyan-400 flex-shrink-0" />
                  <span className="text-md">Productos certificados y seguros</span>
                </li>
                <li className="flex items-center gap-2 text-black font-bold">
                  <CheckCircle className="w-5 h-5 text-cyan-600 dark:text-cyan-400 flex-shrink-0" />
                  <span className="text-md">Certificado de limpieza incluido</span>
                </li>
              </ul>

              {/* CTA Button */}
              <Link
                href={ROUTES.APP_HOME}
                className="inline-flex items-center justify-center gap-2 w-full px-6 py-4 bg-cyan-600 hover:bg-cyan-700 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-all duration-300 group"
              >
                <span>Reservar servicio</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Pay After Completion Section */}
      <section className="relative py-20 md:py-32 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-zinc-900 dark:to-blue-950 overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute top-10 right-10">
          <Image src="/images/grupo-burbujas.png" alt="" width={120} height={120} className="float-animation" />
        </div>
        <div className="absolute bottom-20 left-20">
          <Image src="/images/burbuja-sola.png" alt="" width={80} height={80} className="float-animation-slow" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center">
            {/* Image Side */}
            <div className="order-2 md:order-1 flex justify-center">
              <div className="relative">
                <div className="absolute inset-0 bg-blue-600/20 dark:bg-blue-400/20 rounded-3xl blur-3xl"></div>
                <Image
                  src="/images/portada.png"
                  alt="Paga cuando termines"
                  width={500}
                  height={400}
                  className="relative z-10 rounded-2xl shadow-2xl"
                  style={{ width: 'auto', height: 'auto' }}
                />
              </div>
            </div>

            {/* Content Side */}
            <div className="order-1 md:order-2 space-y-6">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full text-sm font-semibold">
                <CheckCircle className="w-4 h-4" />
                <span>Tranquilidad Garantizada</span>
              </div>

              {/* Heading */}
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-zinc-900 dark:text-white leading-tight">
                Paga solo cuando el trabajo esté
                <span className="text-blue-600 dark:text-blue-400"> terminado</span>
              </h2>

              {/* Description */}
              <p className="text-lg md:text-xl text-zinc-600 dark:text-zinc-400 leading-relaxed">
                Tu tranquilidad es lo primero. Inspecciona el trabajo completado y paga únicamente cuando estés 100% satisfecho con el resultado.
              </p>

              {/* Features List */}
              <div className="space-y-4 pt-4">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mt-1">
                    <CheckCircle className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <p className="text-zinc-700 dark:text-zinc-300">Sin pagos anticipados ni sorpresas</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mt-1">
                    <CheckCircle className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <p className="text-zinc-700 dark:text-zinc-300">Verifica la calidad antes de pagar</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mt-1">
                    <CheckCircle className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <p className="text-zinc-700 dark:text-zinc-300">Paga cómodamente desde la app</p>
                </div>
              </div>

              {/* CTA */}
              <div className="pt-6">
                <Link
                  href={ROUTES.APP_HOME}
                  className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                >
                  <span>Reservar servicio ahora</span>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Secure Payments Section */}
      <section className="py-16 md:py-24 bg-white dark:bg-zinc-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-12 md:mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-full text-sm font-semibold mb-4">
              <Lock className="w-4 h-4" />
              <span>Pagos 100% Seguros</span>
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-zinc-900 dark:text-white mb-4">
              Protegemos cada transacción
            </h2>
            <p className="text-lg md:text-xl text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
              Todos los pagos se procesan de forma segura a través de nuestra aplicación
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 mb-12">
            {/* Feature 1 */}
            <div className="text-center p-6 rounded-xl bg-zinc-50 dark:bg-zinc-900 hover:shadow-lg transition-shadow">
              <div className="w-14 h-14 mx-auto mb-4 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                <Lock className="w-7 h-7 text-blue-600 dark:text-blue-400" strokeWidth={1.5} />
              </div>
              <h3 className="font-bold text-zinc-900 dark:text-white mb-2">Encriptación SSL</h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">Tus datos están protegidos con tecnología de última generación</p>
            </div>

            {/* Feature 2 */}
            <div className="text-center p-6 rounded-xl bg-zinc-50 dark:bg-zinc-900 hover:shadow-lg transition-shadow">
              <div className="w-14 h-14 mx-auto mb-4 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                <Shield className="w-7 h-7 text-green-600 dark:text-green-400" strokeWidth={1.5} />
              </div>
              <h3 className="font-bold text-zinc-900 dark:text-white mb-2">Verificación Segura</h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">Autenticación de dos factores en cada transacción</p>
            </div>

            {/* Feature 3 */}
            <div className="text-center p-6 rounded-xl bg-zinc-50 dark:bg-zinc-900 hover:shadow-lg transition-shadow">
              <div className="w-14 h-14 mx-auto mb-4 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center">
                <Smartphone className="w-7 h-7 text-purple-600 dark:text-purple-400" strokeWidth={1.5} />
              </div>
              <h3 className="font-bold text-zinc-900 dark:text-white mb-2">Pago en la App</h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">Todo desde tu móvil de forma rápida y segura</p>
            </div>

            {/* Feature 4 */}
            <div className="text-center p-6 rounded-xl bg-zinc-50 dark:bg-zinc-900 hover:shadow-lg transition-shadow">
              <div className="w-14 h-14 mx-auto mb-4 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center">
                <Wallet className="w-7 h-7 text-orange-600 dark:text-orange-400" strokeWidth={1.5} />
              </div>
              <h3 className="font-bold text-zinc-900 dark:text-white mb-2">Múltiples Métodos</h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">Tarjetas, transferencias y más opciones de pago</p>
            </div>
          </div>

          {/* Trust Badges */}
          <div className="flex flex-wrap justify-center items-center gap-8 pt-8 border-t border-zinc-200 dark:border-zinc-800">
            <div className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400">
              <Shield className="w-5 h-5 text-green-600 dark:text-green-400" />
              <span className="text-sm font-medium">Certificado SSL</span>
            </div>
            <div className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400">
              <Lock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <span className="text-sm font-medium">Datos Encriptados</span>
            </div>
            <div className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400">
              <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
              <span className="text-sm font-medium">Pagos Verificados</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contacto" className="bg-zinc-900 dark:bg-black text-zinc-300">
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
                  <a href="#inicio" className="hover:text-white transition-colors">
                    Inicio
                  </a>
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
