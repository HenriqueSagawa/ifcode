'use client';

import React, { useState } from 'react';
import { ChevronRight, FileText, Calendar, Clock, ArrowUp, Sun, Moon } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';

import { termsData } from './data/tems-data';
import { BackButton } from '@/components/BackButton';

const termsMetadata = {
  title: "Termos de Uso da Plataforma IFCode",
  effectiveDate: "28 de agosto de 2025",
  lastUpdate: "28 de agosto de 2025",
  description: "Bem‑vindo à plataforma IFCode. Estes Termos de Uso regulam o acesso e a utilização do site e dos recursos disponibilizados aos usuários. Ao criar uma conta, fazer login ou utilizar qualquer funcionalidade, você concorda integralmente com estes Termos."
};

export default function TermsOfUsePage() {
  const [activeSection, setActiveSection] = useState('introducao');
  const [showBackToTop, setShowBackToTop] = useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 400);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);


  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setActiveSection(sectionId);
    }
  };

  const renderContent = (content: string | string[]) => {
    if (typeof content === 'string') {
      return <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{content}</p>;
    }
    
    return (
      <div className="space-y-3">
        {content.map((paragraph: string, index: number) => (
          <p key={index} className="text-gray-600 dark:text-gray-300 leading-relaxed">
            {paragraph}
          </p>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-green-50/50 dark:from-black dark:via-gray-900 dark:to-green-900/20 transition-colors duration-300">
      {/* Header */}
      <div className="bg-white/80 dark:bg-black/50 backdrop-blur-sm border-b border-gray-200 dark:border-green-500/20 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <BackButton variant="ghost" size="sm" fallbackUrl="/" />
              <div className="p-2 bg-green-100 dark:bg-green-500/20 rounded-lg transition-colors duration-300">
                <FileText className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">IFCode</h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">Termos de Uso</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Badge variant="outline" className="border-green-600 dark:border-green-500/30 text-green-700 dark:text-green-400 bg-green-50 dark:bg-transparent">
                Vigente desde {termsMetadata.effectiveDate}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar - Navegação */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <Card className="bg-white/80 dark:bg-black/40 border-gray-200 dark:border-green-500/20 backdrop-blur-sm transition-colors duration-300">
                <CardHeader className="pb-3">
                  <CardTitle className="text-green-600 dark:text-green-400 text-lg flex items-center">
                    <FileText className="h-5 w-5 mr-2" />
                    Navegação
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-96">
                    <nav className="space-y-1">
                      {termsData.map((section, index) => (
                        <button
                          key={section.id}
                          onClick={() => scrollToSection(section.id)}
                          className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all duration-200 flex items-center group ${
                            activeSection === section.id
                              ? 'bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400 border-l-2 border-green-600 dark:border-green-400'
                              : 'text-gray-600 dark:text-gray-400 hover:text-green-700 dark:hover:text-green-300 hover:bg-green-50 dark:hover:bg-green-500/10'
                          }`}
                        >
                          <span className="text-xs font-mono mr-3 opacity-60">
                            {String(index + 1).padStart(2, '0')}
                          </span>
                          <span className="flex-1 leading-tight">{section.title}</span>
                          <ChevronRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </button>
                      ))}
                    </nav>
                  </ScrollArea>
                </CardContent>
              </Card>

              {/* Info Card */}
              <Card className="mt-6 bg-white/80 dark:bg-black/40 border-gray-200 dark:border-green-500/20 backdrop-blur-sm transition-colors duration-300">
                <CardHeader className="pb-3">
                  <CardTitle className="text-green-600 dark:text-green-400 text-lg">Informações</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center text-sm text-gray-700 dark:text-gray-300">
                    <Calendar className="h-4 w-4 mr-2 text-green-600 dark:text-green-400" />
                    Vigência: {termsMetadata.effectiveDate}
                  </div>
                  <div className="flex items-center text-sm text-gray-700 dark:text-gray-300">
                    <Clock className="h-4 w-4 mr-2 text-green-600 dark:text-green-400" />
                    Última atualização: {termsMetadata.lastUpdate}
                  </div>
                  <Separator className="bg-gray-200 dark:bg-green-500/20" />
                  <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                    Ao usar a plataforma IFCode, você concorda com estes termos automaticamente.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Conteúdo Principal */}
          <div className="lg:col-span-3">
            {/* Header do Documento */}
            <Card className="mb-8 bg-gradient-to-r from-green-100 to-white/80 dark:from-green-900/20 dark:to-black/40 border-gray-200 dark:border-green-500/30 backdrop-blur-sm transition-colors duration-300">
              <CardHeader className="pb-6">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
                      {termsMetadata.title}
                    </CardTitle>
                    <CardDescription className="text-gray-700 dark:text-gray-300 leading-relaxed max-w-3xl">
                      {termsMetadata.description}
                    </CardDescription>
                  </div>
                </div>
                <div className="flex flex-wrap gap-3 mt-6">
                  <Badge variant="secondary" className="bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-300 border-green-300 dark:border-green-500/30">
                    <Calendar className="h-3 w-3 mr-1" />
                    Vigente desde {termsMetadata.effectiveDate}
                  </Badge>
                  <Badge variant="secondary" className="bg-gray-100 dark:bg-black/20 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600">
                    <Clock className="h-3 w-3 mr-1" />
                    Atualizado em {termsMetadata.lastUpdate}
                  </Badge>
                </div>
              </CardHeader>
            </Card>

            {/* Seções dos Termos */}
            <div className="space-y-6">
              {termsData.map((section, index) => (
                <Card
                  key={section.id}
                  id={section.id}
                  className="bg-white/80 dark:bg-black/40 border-gray-200 dark:border-green-500/20 backdrop-blur-sm transition-all duration-300 hover:border-green-300 dark:hover:border-green-500/40 hover:shadow-lg"
                >
                  <CardHeader className="pb-4">
                    <CardTitle className="text-xl text-gray-900 dark:text-white flex items-start">
                      <span className="text-green-600 dark:text-green-400 font-mono text-sm mr-4 mt-1 bg-green-100 dark:bg-green-500/20 px-2 py-1 rounded">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      <span className="flex-1">{section.title}</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    {renderContent(section.content as string)}
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Footer */}
            <Card className="mt-8 bg-gradient-to-r from-gray-50/90 to-green-50/50 dark:from-black/60 dark:to-green-900/20 border-gray-200 dark:border-green-500/30 transition-colors duration-300">
              <CardContent className="py-6">
                <div className="text-center">
                  <p className="text-gray-700 dark:text-gray-300 mb-4">
                    Para dúvidas sobre estes termos, entre em contato através dos canais oficiais da plataforma.
                  </p>
                  <div className="flex justify-center">
                    <Badge variant="outline" className="border-green-600 dark:border-green-500/30 text-green-700 dark:text-green-400 bg-green-50 dark:bg-transparent">
                      IFCode - Plataforma Educacional
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Botão de Voltar ao Topo */}
      {showBackToTop && (
        <Button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 z-50 bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 text-white p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110"
          size="icon"
        >
          <ArrowUp className="h-5 w-5" />
        </Button>
      )}

      {/* Gradiente de fundo decorativo */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-1/4 w-96 h-96 bg-green-200/20 dark:bg-green-500/5 rounded-full blur-3xl transition-colors duration-300"></div>
        <div className="absolute bottom-1/4 -right-1/4 w-96 h-96 bg-green-200/20 dark:bg-green-500/5 rounded-full blur-3xl transition-colors duration-300"></div>
      </div>
    </div>
  );
}