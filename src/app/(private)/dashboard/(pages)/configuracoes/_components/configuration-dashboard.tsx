'use client'

import React, { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  Settings, 
  User, 
  Bell, 
  Shield, 
  Palette, 
  Globe, 
  Trash2,
  Save,
  Eye,
  EyeOff,
  Mail,
  Smartphone,
  Lock,
  AlertTriangle,
  Check,
  Moon,
  Sun,
  Monitor
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { User as UserProps } from '../../../../../../../types/next-auth'
import { useTheme } from 'next-themes'

export function SettingsContent({ userData }: { userData: UserProps }) {
  const {theme, setTheme} = useTheme()
  const [activeSection, setActiveSection] = useState('notifications')

  const menuItems = [
    { id: "notifications", label: "Notificações", icon: Bell },
    { id: "security", label: "Segurança", icon: Shield },
    { id: "appearance", label: "Aparência", icon: Palette },
    { id: "language", label: "Idioma", icon: Globe },
    { id: "danger", label: "Zona de Perigo", icon: AlertTriangle }
  ]

  // Apply theme to document
  useEffect(() => {
    const root = document.documentElement
    if (theme === 'dark') {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
  }, [theme])

  const handleThemeChange = (newTheme: string) => {
    setTheme(newTheme)
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 bg-transparent`}>
      <div className="container mx-auto py-6 max-w-6xl">
        <div className="mb-6">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Configurações</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Gerencie suas preferências e configurações da conta
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="space-y-4">
            <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
              <CardContent className="p-4">
                <nav className="space-y-2">
                  {menuItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setActiveSection(item.id)}
                      className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                        item.id === activeSection 
                          ? "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300" 
                          : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      }`}
                    >
                      <item.icon className="h-4 w-4" />
                      <span className="text-sm font-medium">{item.label}</span>
                    </button>
                  ))}
                </nav>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-3 space-y-6">
            {/* Profile Section */}
            {activeSection === 'profile' && (
              <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-gray-900 dark:text-white">
                    <User className="h-5 w-5" />
                    <span>Informações do Perfil</span>
                  </CardTitle>
                  <CardDescription className="text-gray-600 dark:text-gray-400">
                    Atualize suas informações pessoais e foto de perfil
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-20 w-20">
                      <AvatarImage src={userData?.image} />
                      <AvatarFallback className="bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300">
                        {userData?.name?.split(' ').map((n) => n[0]).join('').toUpperCase() || <User className="h-8 w-8" />}
                      </AvatarFallback>
                    </Avatar>
                    <div className="space-y-2">
                      <Button variant="outline" className="border-green-300 dark:border-green-600 text-green-700 dark:text-green-300 hover:bg-green-50 dark:hover:bg-green-900/20">
                        Alterar Foto
                      </Button>
                      <p className="text-xs text-gray-500 dark:text-gray-400">JPG, GIF ou PNG. Máximo 1MB.</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-gray-700 dark:text-gray-300">Nome Completo</Label>
                      <Input 
                        id="name" 
                        defaultValue={userData?.name || ""} 
                        className="border-gray-300 dark:border-gray-600 focus:border-green-500 dark:focus:border-green-400"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-gray-700 dark:text-gray-300">Email</Label>
                      <Input 
                        id="email" 
                        type="email" 
                        defaultValue={userData?.email || ""} 
                        className="border-gray-300 dark:border-gray-600 focus:border-green-500 dark:focus:border-green-400"
                      />
                    </div>
                  </div>
                  
                  <Button className="bg-green-600 hover:bg-green-700 text-white">
                    <Save className="h-4 w-4 mr-2" />
                    Salvar Alterações
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Notifications Section */}
            {activeSection === 'notifications' && (
              <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-gray-900 dark:text-white">
                    <Bell className="h-5 w-5" />
                    <span>Notificações</span>
                  </CardTitle>
                  <CardDescription className="text-gray-600 dark:text-gray-400">
                    Configure como você deseja receber notificações
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <label className="text-sm font-medium text-gray-900 dark:text-white">Comentários em Posts</label>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Receba notificações quando alguém comentar em seus posts</p>
                    </div>
                    <Switch defaultChecked className="data-[state=checked]:bg-green-600" />
                  </div>
                  
                  <Separator className="bg-gray-200 dark:bg-gray-700" />
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <label className="text-sm font-medium text-gray-900 dark:text-white">Respostas aos Comentários</label>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Notificações quando responderem seus comentários</p>
                    </div>
                    <Switch defaultChecked className="data-[state=checked]:bg-green-600" />
                  </div>
                  
                  <Separator className="bg-gray-200 dark:bg-gray-700" />
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <label className="text-sm font-medium text-gray-900 dark:text-white">Emails de Marketing</label>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Receba novidades e atualizações por email</p>
                    </div>
                    <Switch className="data-[state=checked]:bg-green-600" />
                  </div>
                  
                  <Separator className="bg-gray-200 dark:bg-gray-700" />
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <label className="text-sm font-medium text-gray-900 dark:text-white">Notificações Push</label>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Receba notificações no navegador</p>
                    </div>
                    <Switch defaultChecked className="data-[state=checked]:bg-green-600" />
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Security Section */}
            {activeSection === 'security' && (
              <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-gray-900 dark:text-white">
                    <Shield className="h-5 w-5" />
                    <span>Segurança</span>
                  </CardTitle>
                  <CardDescription className="text-gray-600 dark:text-gray-400">
                    Mantenha sua conta segura
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="current-password" className="text-gray-700 dark:text-gray-300">Senha Atual</Label>
                    <Input 
                      id="current-password" 
                      type="password" 
                      placeholder="Digite sua senha atual"
                      className="border-gray-300 dark:border-gray-600 focus:border-green-500 dark:focus:border-green-400"
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="new-password" className="text-gray-700 dark:text-gray-300">Nova Senha</Label>
                      <Input 
                        id="new-password" 
                        type="password" 
                        placeholder="Nova senha"
                        className="border-gray-300 dark:border-gray-600 focus:border-green-500 dark:focus:border-green-400"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirm-password" className="text-gray-700 dark:text-gray-300">Confirmar Senha</Label>
                      <Input 
                        id="confirm-password" 
                        type="password" 
                        placeholder="Confirme a nova senha"
                        className="border-gray-300 dark:border-gray-600 focus:border-green-500 dark:focus:border-green-400"
                      />
                    </div>
                  </div>
                  
                  <Button className="bg-green-600 hover:bg-green-700 text-white">
                    <Lock className="h-4 w-4 mr-2" />
                    Alterar Senha
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Appearance Section */}
            {activeSection === 'appearance' && (
              <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-gray-900 dark:text-white">
                    <Palette className="h-5 w-5" />
                    <span>Aparência</span>
                  </CardTitle>
                  <CardDescription className="text-gray-600 dark:text-gray-400">
                    Customize a aparência da interface
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-3">
                    <Label className="text-gray-700 dark:text-gray-300">Tema</Label>
                    <div className="grid grid-cols-3 gap-3">
                      <button 
                        onClick={() => handleThemeChange("light")} 
                        className={`flex flex-col items-center space-y-2 p-4 border-2 rounded-lg transition-all ${
                          theme === "light" 
                            ? "border-green-500 bg-green-50 dark:bg-green-900/20" 
                            : "border-gray-200 dark:border-gray-600 hover:border-green-400"
                        }`}
                      >
                        <Sun className={`h-6 w-6 ${theme === "light" ? "text-green-600" : "text-gray-600 dark:text-gray-400"}`} />
                        <span className={`text-sm font-medium ${theme === "light" ? "text-green-700 dark:text-green-300" : "text-gray-700 dark:text-gray-300"}`}>
                          Claro
                        </span>
                      </button>
                      <button 
                        onClick={() => handleThemeChange("dark")} 
                        className={`flex flex-col items-center space-y-2 p-4 border-2 rounded-lg transition-all ${
                          theme === "dark" 
                            ? "border-green-500 bg-green-50 dark:bg-green-900/20" 
                            : "border-gray-200 dark:border-gray-600 hover:border-green-400"
                        }`}
                      >
                        <Moon className={`h-6 w-6 ${theme === "dark" ? "text-green-600 dark:text-green-400" : "text-gray-600 dark:text-gray-400"}`} />
                        <span className={`text-sm font-medium ${theme === "dark" ? "text-green-700 dark:text-green-300" : "text-gray-700 dark:text-gray-300"}`}>
                          Escuro
                        </span>
                      </button>
                      <button 
                        onClick={() => handleThemeChange("system")} 
                        className={`flex flex-col items-center space-y-2 p-4 border-2 rounded-lg transition-all ${
                          theme === "system" 
                            ? "border-green-500 bg-green-50 dark:bg-green-900/20" 
                            : "border-gray-200 dark:border-gray-600 hover:border-green-400"
                        }`}
                      >
                        <Monitor className={`h-6 w-6 ${theme === "system" ? "text-green-600 dark:text-green-400" : "text-gray-600 dark:text-gray-400"}`} />
                        <span className={`text-sm font-medium ${theme === "system" ? "text-green-700 dark:text-green-300" : "text-gray-700 dark:text-gray-300"}`}>
                          Sistema
                        </span>
                      </button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Language Section */}
            {activeSection === 'language' && (
              <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-gray-900 dark:text-white">
                    <Globe className="h-5 w-5" />
                    <span>Idioma e Região</span>
                  </CardTitle>
                  <CardDescription className="text-gray-600 dark:text-gray-400">
                    Configure seu idioma e fuso horário
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="text-gray-700 dark:text-gray-300">Idioma</Label>
                      <Select defaultValue="pt-BR">
                        <SelectTrigger className="border-gray-300 dark:border-gray-600 focus:border-green-500">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pt-BR">Português (Brasil)</SelectItem>
                          <SelectItem value="en-US">English (US)</SelectItem>
                          <SelectItem value="es-ES">Español</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-gray-700 dark:text-gray-300">Fuso Horário</Label>
                      <Select defaultValue="America/Sao_Paulo">
                        <SelectTrigger className="border-gray-300 dark:border-gray-600 focus:border-green-500">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="America/Sao_Paulo">São Paulo (GMT-3)</SelectItem>
                          <SelectItem value="America/New_York">Nova York (GMT-5)</SelectItem>
                          <SelectItem value="Europe/London">Londres (GMT+0)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Danger Zone */}
            {activeSection === 'danger' && (
              <Card className="bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-red-700 dark:text-red-300">
                    <AlertTriangle className="h-5 w-5" />
                    <span>Zona de Perigo</span>
                  </CardTitle>
                  <CardDescription className="text-red-600 dark:text-red-400">
                    Ações irreversíveis que afetam permanentemente sua conta
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 bg-red-100 dark:bg-red-900/30 rounded-lg">
                    <h4 className="font-medium text-red-800 dark:text-red-200 mb-2">Excluir Conta</h4>
                    <p className="text-sm text-red-700 dark:text-red-300 mb-4">
                      Esta ação não pode ser desfeita. Todos os seus dados, posts e comentários serão permanentemente removidos.
                    </p>
                    <Button variant="destructive" className="bg-red-600 hover:bg-red-700">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Excluir Conta
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}