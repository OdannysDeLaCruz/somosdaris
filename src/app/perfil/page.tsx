'use client'

import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Mail, Phone, CreditCard } from "lucide-react";
import { useAuth } from '@/components/AuthProvider'

import { AuthRedirect } from "@/components/AuthRedirect";

export default function PerfilPage() {
  const { user } = useAuth()

  return (
    <AuthRedirect>
      <div className="container mx-auto px-4 py-8 max-w-md md:max-w-2xl">
      <Card className="shadow-lg border-none sm:border">
        <CardHeader className="space-y-1 text-center sm:text-left">
          <CardTitle className="text-2xl font-bold tracking-tight">Mi Perfil</CardTitle>
          <CardDescription>
            {/* Consulta la información personal registrada en tu cuenta. */}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="grid gap-6">
          {/* Nombre y Apellido */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="mb-5">
              <Label htmlFor="nombre" className="flex items-center gap-2 text-gray-600 text-base font-normal mb-4">
                <User className="w-4 h-4 text-muted-foreground" />
                Nombre
              </Label>
              <Input id="nombre" value={user?.name || ''} className="cursor-default focus-visible:ring-0 border border-gray-500 px-3 py-5 text-base" />
            </div>
            <div className="mb-5">
              <Label htmlFor="apellido" className="flex items-center gap-2 text-gray-600 text-base  font-normal mb-4">
                <User className="w-4 h-4 text-muted-foreground" />
                Apellido
              </Label>
              <Input id="apellido" value={user?.lastname || ''} readOnly className="cursor-default focus-visible:ring-0 border border-gray-500 px-3 py-5 text-base" />
            </div>
          </div>

          {/* Teléfono */}
          <div className="mb-5">
            <Label htmlFor="telefono" className="flex items-center gap-2 text-gray-600 text-base  font-normal mb-4">
              <Phone className="w-4 h-4 text-muted-foreground" />
              Número de teléfono
            </Label>
            <Input id="telefono" value={user?.phone || ''} readOnly className="cursor-default focus-visible:ring-0 border border-gray-500 px-3 py-5 text-base" />
          </div>

          {/* Documento de Identidad */}
          <div className="mb-5">
            <Label htmlFor="documento" className="flex items-center gap-2 text-gray-600 text-base font-normal mb-4">
              <CreditCard className="w-4 h-4 text-muted-foreground" />
              Número de Documento (CC)
            </Label>
            <Input id="documento" value="--- --- ---" readOnly className="cursor-default focus-visible:ring-0 border border-gray-500 px-3 py-5 text-base" />
          </div>

          {/* Correo Electrónico */}
          <div className="mb-5">
            <Label htmlFor="email" className="flex items-center gap-2 text-gray-600 text-base font-normal mb-4">
              <Mail className="w-4 h-4 text-muted-foreground" />
              Correo Electrónico
            </Label>
            <Input id="email" type="email" value={user?.email || '------@------'} readOnly className="cursor-default focus-visible:ring-0 border border-gray-500 px-3 py-5 text-base" />
          </div>

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