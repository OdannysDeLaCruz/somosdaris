import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const formulaVariableSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido'),
  label: z.string().min(1, 'La etiqueta es requerida'),
  type: z.enum(['number', 'select'], { message: 'Tipo debe ser "number" o "select"' }),
  options: z.any().optional(),
  minValue: z.number().int().optional(),
  maxValue: z.number().int().optional(),
  defaultValue: z.string().optional(),
  multiplier: z.number().optional(),
  displayOrder: z.number().int().optional(),
})

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const variables = await prisma.formulaVariable.findMany({
      where: {
        serviceId: id,
      },
      orderBy: {
        displayOrder: 'asc',
      },
    })

    return NextResponse.json(variables)
  } catch (error) {
    console.error('Error fetching formula variables:', error)
    return NextResponse.json(
      { error: 'Error al obtener variables de fórmula' },
      { status: 500 }
    )
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: serviceId } = await params
    const body = await request.json()
    const validatedData = formulaVariableSchema.parse(body)

    // Verificar que el servicio existe
    const service = await prisma.service.findUnique({
      where: { id: serviceId },
    })

    if (!service) {
      return NextResponse.json(
        { error: 'Servicio no encontrado' },
        { status: 404 }
      )
    }

    // Crear la variable de fórmula
    const formulaVariable = await prisma.formulaVariable.create({
      data: {
        serviceId,
        name: validatedData.name,
        label: validatedData.label,
        type: validatedData.type,
        options: validatedData.options,
        minValue: validatedData.minValue,
        maxValue: validatedData.maxValue,
        defaultValue: validatedData.defaultValue,
        multiplier: validatedData.multiplier,
        displayOrder: validatedData.displayOrder ?? 0,
      },
    })

    return NextResponse.json(formulaVariable, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Datos inválidos', details: error.issues },
        { status: 400 }
      )
    }

    console.error('Error creating formula variable:', error)
    return NextResponse.json(
      { error: 'Error al crear la variable de fórmula' },
      { status: 500 }
    )
  }
}
