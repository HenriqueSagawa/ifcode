"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function ConfigurationDashboardContent() {
  return (
    <div className="space-y-6">
      <Tabs defaultValue="geral" className="space-y-4">
        <TabsList>
          <TabsTrigger value="geral">Geral</TabsTrigger>
          <TabsTrigger value="aparencia">Aparência</TabsTrigger>
          <TabsTrigger value="seo">SEO</TabsTrigger>
          <TabsTrigger value="integracoes">Integrações</TabsTrigger>
        </TabsList>

        <TabsContent value="geral" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Informações do Site</CardTitle>
              <CardDescription>Configure as informações básicas do seu site</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="nome-site">Nome do Site</Label>
                <Input id="nome-site" defaultValue="Meu Blog Pessoal" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="descricao-site">Descrição</Label>
                <Textarea id="descricao-site" defaultValue="Um blog sobre tecnologia, desenvolvimento e inovação." />
              </div>
              <div className="space-y-2">
                <Label htmlFor="url-site">URL do Site</Label>
                <Input id="url-site" defaultValue="https://meublog.com" />
              </div>
              <Button>Salvar Alterações</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="aparencia" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Tema e Cores</CardTitle>
              <CardDescription>Personalize a aparência do seu site</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Tema</Label>
                <Select defaultValue="dark">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Claro</SelectItem>
                    <SelectItem value="dark">Escuro</SelectItem>
                    <SelectItem value="system">Sistema</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="cor-primaria">Cor Primária</Label>
                <div className="flex items-center space-x-2">
                  <Input id="cor-primaria" defaultValue="#22c55e" className="w-20" />
                  <div className="w-8 h-8 rounded bg-green-500 border"></div>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="cor-secundaria">Cor Secundária</Label>
                <div className="flex items-center space-x-2">
                  <Input id="cor-secundaria" defaultValue="#000000" className="w-20" />
                  <div className="w-8 h-8 rounded bg-black border"></div>
                </div>
              </div>
              <Button>Aplicar Tema</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="seo" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Configurações de SEO</CardTitle>
              <CardDescription>Otimize seu site para mecanismos de busca</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="meta-title">Meta Título</Label>
                <Input id="meta-title" defaultValue="Meu Blog - Tecnologia e Inovação" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="meta-description">Meta Descrição</Label>
                <Textarea
                  id="meta-description"
                  defaultValue="Descubra as últimas tendências em tecnologia, desenvolvimento web e inovação digital."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="palavras-chave">Palavras-chave</Label>
                <Input id="palavras-chave" defaultValue="tecnologia, desenvolvimento, web, inovação" />
              </div>
              <div className="flex items-center space-x-2">
                <Switch id="sitemap" defaultChecked />
                <Label htmlFor="sitemap">Gerar sitemap automaticamente</Label>
              </div>
              <Button>Salvar SEO</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="integracoes" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Integrações</CardTitle>
              <CardDescription>Configure integrações com serviços externos</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h4 className="text-sm font-medium">EmailJS</h4>
                <div className="space-y-2">
                  <Label htmlFor="emailjs-service">Service ID</Label>
                  <Input id="emailjs-service" placeholder="service_xxxxxxx" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="emailjs-template">Template ID</Label>
                  <Input id="emailjs-template" placeholder="template_xxxxxxx" />
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-sm font-medium">Firebase</h4>
                <div className="space-y-2">
                  <Label htmlFor="firebase-config">Configuração Firebase</Label>
                  <Textarea id="firebase-config" placeholder="Cole aqui a configuração do Firebase..." />
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-sm font-medium">Redes Sociais</h4>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="facebook">Facebook</Label>
                    <Input id="facebook" placeholder="https://facebook.com/..." />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="twitter">Twitter</Label>
                    <Input id="twitter" placeholder="https://twitter.com/..." />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="instagram">Instagram</Label>
                    <Input id="instagram" placeholder="https://instagram.com/..." />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="linkedin">LinkedIn</Label>
                    <Input id="linkedin" placeholder="https://linkedin.com/..." />
                  </div>
                </div>
              </div>

              <Button>Salvar Integrações</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
