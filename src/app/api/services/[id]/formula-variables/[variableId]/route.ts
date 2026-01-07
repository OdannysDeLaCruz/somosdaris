import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string; variableId: string }> }
) {
  try {
    const { id: serviceId, variableId } = await params

    // Verificar que la variable existe y pertenece al servicio
    const existingVariable = await prisma.formulaVariable.findFirst({
      where: {
        id: variableId,
        serviceId,
      },
    })

    if (!existingVariable) {
      return NextResponse.json(
        { error: 'Variable de fórmula no encontrada' },
        { status: 404 }
      )
    }

    // Eliminar la variable
    await prisma.formulaVariable.delete({
      where: { id: variableId },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting formula variable:', error)
    return NextResponse.json(
      { error: 'Error al eliminar la variable de fórmula' },
      { status: 500 }
    )
  }
}
