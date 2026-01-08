import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

interface PricingItem {
  name: string
  quantity: number
  price: number
}

interface PricingData {
  cantidad?: number
  altura?: number
  items?: PricingItem[]
}

interface ReservationEmailData {
  reservationId: string
  clientName: string
  clientEmail: string
  clientPhone: string
  serviceName: string
  serviceType: string
  date: string
  time: string
  address: string
  packageName?: string | null
  pricingOptionName?: string | null
  finalPrice: number
  pricingData?: PricingData
}

export async function sendAdminReservationNotification(data: ReservationEmailData) {
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@somosdaris.com'
  const fromEmail = process.env.RESEND_FROM_EMAIL || 'noreply@notifications.somosdaris.com'

  const htmlContent = `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Nueva Reserva</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
        }
        .header {
          background-color: #2563eb;
          color: white;
          padding: 20px;
          text-align: center;
          border-radius: 8px 8px 0 0;
        }
        .content {
          background-color: #f9fafb;
          padding: 30px;
          border-radius: 0 0 8px 8px;
        }
        .section {
          margin-bottom: 25px;
          background-color: white;
          padding: 20px;
          border-radius: 6px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }
        .section-title {
          font-size: 16px;
          font-weight: bold;
          color: #2563eb;
          margin-bottom: 12px;
          border-bottom: 2px solid #e5e7eb;
          padding-bottom: 8px;
        }
        .info-row {
          display: flex;
          margin-bottom: 8px;
        }
        .info-label {
          font-weight: bold;
          min-width: 140px;
          color: #6b7280;
        }
        .info-value {
          color: #111827;
        }
        .price {
          font-size: 24px;
          font-weight: bold;
          color: #059669;
          text-align: center;
          margin: 20px 0;
        }
        .footer {
          text-align: center;
          margin-top: 30px;
          padding-top: 20px;
          border-top: 1px solid #e5e7eb;
          color: #6b7280;
          font-size: 14px;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1 style="margin: 0;">Nueva Reserva Recibida</h1>
        <p style="margin: 10px 0 0 0;">ID: ${data.reservationId}</p>
      </div>

      <div class="content">
        <div class="section">
          <div class="section-title">Información del Cliente</div>
          <div class="info-row">
            <span class="info-label">Nombre:</span>
            <span class="info-value">${data.clientName}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Email:</span>
            <span class="info-value">${data.clientEmail}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Teléfono:</span>
            <span class="info-value">${data.clientPhone}</span>
          </div>
        </div>

        <div class="section">
          <div class="section-title">Detalles del Servicio</div>
          <div class="info-row">
            <span class="info-label">Servicio:</span>
            <span class="info-value">${data.serviceName}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Tipo:</span>
            <span class="info-value">${data.serviceType === 'home' ? 'Casa/Apartamento' : 'Oficina'}</span>
          </div>
          ${data.packageName ? `
          <div class="info-row">
            <span class="info-label">Paquete:</span>
            <span class="info-value">${data.packageName}</span>
          </div>
          ` : ''}
          ${data.pricingOptionName ? `
          <div class="info-row">
            <span class="info-label">Opción:</span>
            <span class="info-value">${data.pricingOptionName}</span>
          </div>
          ` : ''}
          ${data.pricingData ? `
          <div class="info-row">
            <span class="info-label">Detalles:</span>
            <span class="info-value">${formatPricingData(data.pricingData)}</span>
          </div>
          ` : ''}
        </div>

        <div class="section">
          <div class="section-title">Fecha y Hora</div>
          <div class="info-row">
            <span class="info-label">Fecha:</span>
            <span class="info-value">${data.date}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Hora:</span>
            <span class="info-value">${data.time}</span>
          </div>
        </div>

        <div class="section">
          <div class="section-title">Dirección del Servicio</div>
          <div class="info-value">${data.address}</div>
        </div>

        <div class="price">
          Total: $${data.finalPrice.toLocaleString('es-CO')}
        </div>

        <div class="footer">
          <p>Este es un correo automático generado por el sistema de reservas de SomosDaris.</p>
          <p>No responder a este correo.</p>
        </div>
      </div>
    </body>
    </html>
  `

  try {
    const result = await resend.emails.send({
      from: `Somos Daris <${fromEmail}>`,
      to: adminEmail,
      subject: `Nueva Reserva - ${data.serviceName} - ${data.clientName}`,
      html: htmlContent,
    })

    console.log('Email enviado al admin:', result)
    return result
  } catch (error) {
    console.error('Error enviando email al admin:', error)
    throw error
  }
}

function formatPricingData(pricingData: PricingData): string {
  const parts: string[] = []

  if (pricingData.cantidad !== undefined) {
    parts.push(`Cantidad: ${pricingData.cantidad}`)
  }

  if (pricingData.altura !== undefined) {
    parts.push(`Altura: ${pricingData.altura}`)
  }

  if (pricingData.items && Array.isArray(pricingData.items)) {
    const itemsText = pricingData.items
      .map((item) => `${item.name} (x${item.quantity})`)
      .join(', ')
    parts.push(itemsText)
  }

  return parts.join(' | ')
}
