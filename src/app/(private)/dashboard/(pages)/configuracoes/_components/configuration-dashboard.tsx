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
  Palette, 
  Globe, 
  Trash2,
  Save,
  Lock,
  AlertTriangle,
  Moon,
  Sun,
  Monitor
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { addToast } from "@heroui/toast"
import { User as UserProps } from '../../../../../../../types/next-auth'
import { useTheme } from 'next-themes'
import { getAccessibilitySettings, updateAccessibilitySettings, type AccessibilitySettings } from '@/hooks/useAccessibility'
import { useLanguage, type LanguageSettings } from '@/hooks/useLanguage'

export function SettingsContent({ userData }: { userData: UserProps }) {
  const {theme, setTheme} = useTheme()
  const [activeSection, setActiveSection] = useState('accessibility')
  const router = useRouter()
  const [confirmEmail, setConfirmEmail] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)
  const [deleteError, setDeleteError] = useState<string | null>(null)
  
  // Language settings
  const { languageSettings, setLanguageSettings } = useLanguage()
  
  // Accessibility settings state
  const [accessibilitySettings, setAccessibilitySettings] = useState<AccessibilitySettings>(() => {
    if (typeof window !== 'undefined') {
      return getAccessibilitySettings()
    }
    return {
      fontSize: 'md',
      highContrast: false,
      reduceAnimations: false,
      underlineLinks: false
    }
  })

  const menuItems = [
    { id: "accessibility", label: "Acessibilidade", icon: Settings },
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

  // Function to update accessibility settings
  const updateAccessibilitySetting = (key: keyof AccessibilitySettings, value: any) => {
    const newSettings = { ...accessibilitySettings, [key]: value }
    setAccessibilitySettings(newSettings)
    updateAccessibilitySettings(newSettings)
  }

  // Function to update language settings
  const updateLanguageSetting = (key: keyof LanguageSettings, value: any) => {
    const newSettings = { ...languageSettings, [key]: value }
    setLanguageSettings(newSettings)
  }

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

            {/* Accessibility Section */}
            {activeSection === 'accessibility' && (
              <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-gray-900 dark:text-white">
                    <Settings className="h-5 w-5" />
                    <span>Acessibilidade</span>
                  </CardTitle>
                  <CardDescription className="text-gray-600 dark:text-gray-400">
                    Ajuste preferências para melhorar a legibilidade e usabilidade
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label className="text-gray-700 dark:text-gray-300">Tamanho do Texto</Label>
                    <Select 
                      value={accessibilitySettings.fontSize} 
                      onValueChange={(value) => updateAccessibilitySetting('fontSize', value)}
                    >
                      <SelectTrigger className="border-gray-300 dark:border-gray-600 focus:border-green-500">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sm">Pequeno</SelectItem>
                        <SelectItem value="md">Médio</SelectItem>
                        <SelectItem value="lg">Grande</SelectItem>
                        <SelectItem value="xl">Extra Grande</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Separator className="bg-gray-200 dark:bg-gray-700" />

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <label className="text-sm font-medium text-gray-900 dark:text-white">Alto Contraste</label>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Melhora o contraste de cores para melhor leitura</p>
                    </div>
                    <Switch 
                      checked={accessibilitySettings.highContrast}
                      onCheckedChange={(checked) => updateAccessibilitySetting('highContrast', checked)}
                      className="data-[state=checked]:bg-green-600" 
                    />
                  </div>

                  <Separator className="bg-gray-200 dark:bg-gray-700" />

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <label className="text-sm font-medium text-gray-900 dark:text-white">Reduzir Animações</label>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Minimiza animações para evitar desconforto</p>
                    </div>
                    <Switch 
                      checked={accessibilitySettings.reduceAnimations}
                      onCheckedChange={(checked) => updateAccessibilitySetting('reduceAnimations', checked)}
                      className="data-[state=checked]:bg-green-600" 
                    />
                  </div>

                  <Separator className="bg-gray-200 dark:bg-gray-700" />

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <label className="text-sm font-medium text-gray-900 dark:text-white">Sublinhar Links</label>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Deixa links sempre sublinhados</p>
                    </div>
                    <Switch 
                      checked={accessibilitySettings.underlineLinks}
                      onCheckedChange={(checked) => updateAccessibilitySetting('underlineLinks', checked)}
                      className="data-[state=checked]:bg-green-600" 
                    />
                  </div>
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
                      <Select 
                        value={languageSettings.language}
                        onValueChange={(value) => updateLanguageSetting('language', value)}
                      >
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
                      <Select 
                        value={languageSettings.timezone}
                        onValueChange={(value) => updateLanguageSetting('timezone', value)}
                      >
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
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" className="bg-red-600 hover:bg-red-700">
                          <Trash2 className="h-4 w-4 mr-2" />
                          Excluir Conta
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-2xl">
                        <AlertDialogHeader>
                          <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                          <AlertDialogDescription>
                            Digite seu e-mail ({userData?.email}) para confirmar a exclusão definitiva da sua conta e de todos os dados relacionados.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <div className="space-y-2">
                          <Label htmlFor="confirm-email" className="text-gray-700 dark:text-gray-300">Seu e-mail</Label>
                          <Input
                            id="confirm-email"
                            type="email"
                            placeholder={userData?.email || "seu-email@exemplo.com"}
                            value={confirmEmail}
                            onChange={(e) => setConfirmEmail(e.target.value)}
                            className="border-gray-300 dark:border-gray-600 focus:border-red-500 dark:focus:border-red-400"
                          />
                          {deleteError && (
                            <p className="text-sm text-red-600 dark:text-red-400">{deleteError}</p>
                          )}
                        </div>
                        <AlertDialogFooter>
                          <AlertDialogCancel onClick={() => { setConfirmEmail(''); setDeleteError(null); }}>
                            Cancelar
                          </AlertDialogCancel>
                          <AlertDialogAction
                            className="bg-red-600 hover:bg-red-700"
                            disabled={isDeleting || confirmEmail.trim().toLowerCase() !== (userData?.email || '').toLowerCase()}
                            onClick={async () => {
                              try {
                                setDeleteError(null)
                                setIsDeleting(true)
                                const res = await fetch('/api/users/delete-account', {
                                  method: 'POST',
                                  headers: { 'Content-Type': 'application/json' },
                                  body: JSON.stringify({ email: confirmEmail.trim() })
                                })
                                if (!res.ok) {
                                  const data = await res.json().catch(() => ({}))
                                  throw new Error(data?.error || 'Falha ao excluir a conta')
                                }
                                addToast({
                                  title: 'Conta excluída',
                                  description: 'Sua conta e dados foram removidos com sucesso.',
                                  color: 'default',
                                })
                                await signOut({ redirect: false })
                                router.replace('/')
                              } catch (err: any) {
                                setDeleteError(err.message || 'Erro ao excluir conta')
                                addToast({
                                  title: 'Erro ao excluir',
                                  description: err.message || 'Tente novamente mais tarde.',
                                  color: 'danger',
                                })
                              } finally {
                                setIsDeleting(false)
                              }
                            }}
                          >
                            {isDeleting ? 'Excluindo...' : 'Excluir definitivamente'}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
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