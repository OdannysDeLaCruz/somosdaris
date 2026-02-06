/**
 * Constantes de rutas de la aplicación
 * Centraliza todas las rutas para facilitar actualizaciones y evitar hardcoding
 */

export const ROUTES = {
  // Landing & Public
  LANDING: '/',
  ACERCA: '/acerca',
  LOGIN: '/login',

  // App Main Pages
  APP_HOME: '/app',
  SERVICIOS_RESERVAR: (id: string) => `/app/servicios/${id}/reservar`,
  CONFIRMACION: '/app/confirmacion',
  HISTORIAL: '/app/historial',
  FAVORITOS: '/app/favoritos',
  DIRECCIONES: '/app/direcciones',
  PERFIL: '/app/perfil',
  CONFIGURACION: '/app/configuracion',

  // Carnet (public)
  CARNET: (token: string) => `/carnet/${token}`,

  // Dashboard
  DASHBOARD: '/app/dashboard',
  DASHBOARD_RESERVAS: '/app/dashboard/reservas',
  DASHBOARD_RESERVA_DETAIL: (id: string) => `/app/dashboard/reservas/${id}`,
  DASHBOARD_SERVICIOS: '/app/dashboard/servicios',
  DASHBOARD_SERVICIO_PRICING: (id: string) => `/app/dashboard/servicios/${id}/pricing`,
  DASHBOARD_CLIENTES: '/app/dashboard/clientes',
  DASHBOARD_ALIADOS: '/app/dashboard/aliados',
  DASHBOARD_ALIADO_DETAIL: (id: string) => `/app/dashboard/aliados/${id}`,
} as const
