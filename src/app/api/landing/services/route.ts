import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const services = await prisma.service.findMany({
      where: {
        comingSoon: false
      },
      include: {
        pricingOptions: {
          where: {
            isActive: true
          },
          orderBy: {
            displayOrder: 'asc'
          }
        },
        formulaVariables: {
          orderBy: {
            displayOrder: 'asc'
          }
        }
      }
    })

    return NextResponse.json({ services })
  } catch (error) {
    console.error('Error fetching services:', error)
    return NextResponse.json(
      { error: 'Error al cargar servicios' },
      { status: 500 }
    )
  }
}
