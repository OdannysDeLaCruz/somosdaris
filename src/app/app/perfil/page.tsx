'use client'

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Mail, Phone, CreditCard, IdCard, Copy, Check } from "lucide-react";
import { useAuth } from '@/components/AuthProvider'

import { AuthRedirect } from "@/components/AuthRedirect";

export default function PerfilPage() {
  const { user } = useAuth()
  const [carnetCopied, setCarnetCopied] = useState(false)
  const [carnetLoading, setCarnetLoading] = useState(false)

  const isAlly = user?.role?.name === 'ally'

  const handleCopyCarnet = async () => {
    if (!user) return
    setCarnetLoading(true)
    try {
      const response = await fetch('/api/carnet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'cvu', allyId: user.id }),
      })

      if (!response.ok) throw new Error('Error al generar enlace')

      const { url } = await response.json()
      await navigator.clipboard.writeText(url)
      setCarnetCopied(true)
      setTimeout(() => setCarnetCopied(false), 2000)
    } catch (error) {
      console.error('Error copying carnet link:', error)
    } finally {
      setCarnetLoading(false)
    }
  }

  return (
    <AuthRedirect>
      <div className="container mx-auto py-8 max-w-md md:max-w-2xl pb-24">
        <Card className="shadow-lg border-none sm:border">
          <CardHeader className="space-y-1 text-center sm:text-left">
            <CardTitle className="text-2xl font-bold tracking-tight">Mi Perfil</CardTitle>
            <CardDescription>
              {/* Consulta la información personal registrada en tu cuenta. */}
            </CardDescription>
          </CardHeader>
          
          <CardContent className="grid gap-5 px-4">
            {/* Nombre y Apellido */}
            <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
              <div className="mb-2">
                <Label htmlFor="nombre" className="flex items-center gap-2 text-gray-600 text-base font-normal mb-2">
                  <User className="w-4 h-4 text-muted-foreground" />
                  Nombre
                </Label>
                <Input id="nombre" value={user?.name || ''} readOnly className="cursor-default focus-visible:ring-0 border border-gray-500 px-3 py-5 text-base" />
              </div>
              <div className="mb-2">
                <Label htmlFor="apellido" className="flex items-center gap-2 text-gray-600 text-base  font-normal mb-2">
                  <User className="w-4 h-4 text-muted-foreground" />
                  Apellido
                </Label>
                <Input id="apellido" value={user?.lastname || ''} readOnly className="cursor-default focus-visible:ring-0 border border-gray-500 px-3 py-5 text-base" />
              </div>
            </div>

            {/* Teléfono */}
            <div className="mb-2">
              <Label htmlFor="telefono" className="flex items-center gap-2 text-gray-600 text-base  font-normal mb-2">
                <Phone className="w-4 h-4 text-muted-foreground" />
                Número de teléfono
              </Label>
              <Input id="telefono" value={user?.phone || ''} readOnly className="cursor-default focus-visible:ring-0 border border-gray-500 px-3 py-5 text-base" />
            </div>

            {/* Documento de Identidad */}
            <div className="mb-2">
              <Label htmlFor="documento" className="flex items-center gap-2 text-gray-600 text-base font-normal mb-2">
                <CreditCard className="w-4 h-4 text-muted-foreground" />
                Número de Documento (CC)
              </Label>
              <Input id="documento" value="--- --- ---" readOnly className="cursor-default focus-visible:ring-0 border border-gray-500 px-3 py-5 text-base" />
            </div>

            {/* Correo Electrónico */}
            <div className="mb-2">
              <Label htmlFor="email" className="flex items-center gap-2 text-gray-600 text-base font-normal mb-2">
                <Mail className="w-4 h-4 text-muted-foreground" />
                Correo Electrónico
              </Label>
              <Input id="email" type="email" value={user?.email || '------@------'} readOnly className="cursor-default focus-visible:ring-0 border border-gray-500 px-3 py-5 text-base" />
            </div>

            {/* Mi Carnet Virtual (solo para aliados) */}
            {isAlly && (
              <div className="pt-4 border-t border-muted">
                <Label className="flex items-center gap-2 text-gray-600 text-base font-normal mb-3">
                  <IdCard className="w-4 h-4 text-muted-foreground" />
                  Mi Carnet Virtual
                </Label>
                <button
                  onClick={handleCopyCarnet}
                  disabled={carnetLoading}
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {carnetCopied ? (
                    <>
                      <Check className="w-4 h-4" />
                      Enlace copiado
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      {carnetLoading ? 'Generando...' : 'Copiar enlace de mi carnet'}
                    </>
                  )}
                </button>
              </div>
            )}

            <div className="pt-4 border-t border-muted">
              <p className="text-xs text-center text-muted-foreground italic">
                Para modificar estos datos, por favor contacta al administrador del sistema.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </AuthRedirect>
  )
}