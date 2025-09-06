'use client';

import { useState, useRef, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { MessageCircle, Send, X, ExternalLink, Mail, Phone, MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';
import { SupportService, SupportMessage } from '@/services/gemini/support.service';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface AISupportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const siteInfo = {
  name: 'IFCode',
  description: 'Plataforma educacional do Instituto Federal do Paraná para ensino de programação',
  email: 'ifcodeprojeto@gmail.com',
  phone: '(44) 99805-0846',
  address: 'Instituto Federal do Paraná - Campus Assis Chateaubriand',
  website: 'https://ifcode.com.br'
};

const quickLinks = [
  { title: 'Página Inicial', url: '/', description: 'Conheça nossa plataforma' },
  { title: 'Sobre Nós', url: '/sobre', description: 'História e missão do IFCode' },
  { title: 'Equipe', url: '/equipe', description: 'Conheça nossa equipe' },
  { title: 'Contato', url: '/contato', description: 'Entre em contato conosco' },
  { title: 'Chat IA', url: '/chat', description: 'Assistente de programação' },
  { title: 'Posts', url: '/posts', description: 'Artigos e tutoriais' }
];

const commonQuestions = [
  {
    question: 'Como posso me cadastrar na plataforma?',
    answer: 'Para se cadastrar, clique em "Cadastrar" no menu superior e preencha o formulário com seus dados. Você receberá um email de confirmação.'
  },
  {
    question: 'O que é o IFCode?',
    answer: 'O IFCode é uma plataforma educacional desenvolvida pelo Instituto Federal do Paraná para ensinar programação de forma interativa e prática.'
  },
  {
    question: 'Como posso entrar em contato?',
    answer: `Você pode nos contatar através do email ${siteInfo.email}, telefone ${siteInfo.phone}, ou preenchendo o formulário na página de contato.`
  },
  {
    question: 'A plataforma é gratuita?',
    answer: 'Sim! O IFCode é uma plataforma totalmente gratuita para estudantes e interessados em aprender programação.'
  }
];

const supportService = SupportService.getInstance();

export function AISupportModal({ isOpen, onClose }: AISupportModalProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Resetar chat quando o modal for fechado
  useEffect(() => {
    if (!isOpen) {
      setMessages([]);
      supportService.resetChat();
    }
  }, [isOpen]);

  const handleSendMessage = async (message: string) => {
    if (!message.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: message,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      // Converter mensagens para o formato do SupportService
      const supportMessages: SupportMessage[] = [
        ...messages.map(msg => ({
          role: msg.role as "user" | "model",
          content: msg.content
        })),
        {
          role: 'user',
          content: message
        }
      ];

      const response = await supportService.sendMessage(supportMessages);
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Desculpe, ocorreu um erro ao processar sua mensagem. Por favor, tente novamente ou entre em contato conosco diretamente.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };


  const handleQuickQuestion = (question: string) => {
    setInputValue(question);
  };

  const handleQuickLink = (url: string) => {
    window.open(url, '_blank');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl h-[600px] flex flex-col p-0 bg-black border-green-500/30">
        <DialogHeader className="p-4 border-b border-green-500/20 bg-gradient-to-r from-green-900/20 to-black">
          <DialogTitle className="flex items-center gap-2 text-white">
            <MessageCircle className="h-5 w-5 text-green-400" />
            Suporte IA - IFCode
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 flex flex-col min-h-0">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 && (
              <div className="space-y-4">
                <div className="text-center text-white">
                  <MessageCircle className="h-12 w-12 mx-auto mb-2 text-green-400/70" />
                  <p>Olá! Como posso te ajudar hoje?</p>
                </div>

                {/* Quick Links */}
                <div className="space-y-2">
                  <h4 className="font-medium text-sm text-white">Links Úteis:</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {quickLinks.map((link, index) => (
                      <Card
                        key={index}
                        className="p-3 cursor-pointer hover:bg-green-900/30 transition-colors bg-gray-900/50 border-green-500/20"
                        onClick={() => handleQuickLink(link.url)}
                      >
                        <div className="flex items-center gap-2">
                          <ExternalLink className="h-4 w-4 text-green-400" />
                          <div>
                            <p className="font-medium text-sm text-white">{link.title}</p>
                            <p className="text-xs text-gray-300">{link.description}</p>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>

                {/* Common Questions */}
                <div className="space-y-2">
                  <h4 className="font-medium text-sm text-white">Perguntas Frequentes:</h4>
                  <div className="space-y-2">
                    {commonQuestions.map((qa, index) => (
                      <Card
                        key={index}
                        className="p-3 cursor-pointer hover:bg-green-900/30 transition-colors bg-gray-900/50 border-green-500/20"
                        onClick={() => handleQuickQuestion(qa.question)}
                      >
                        <p className="text-sm font-medium text-white">{qa.question}</p>
                      </Card>
                    ))}
                  </div>
                </div>

                {/* Contact Info */}
                <div className="space-y-2">
                  <h4 className="font-medium text-sm text-white">Informações de Contato:</h4>
                  <Card className="p-3 bg-gray-900/50 border-green-500/20">
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-green-400" />
                        <span className="text-white">{siteInfo.email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-green-400" />
                        <span className="text-white">{siteInfo.phone}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-green-400" />
                        <span className="text-white">{siteInfo.address}</span>
                      </div>
                    </div>
                  </Card>
                </div>
              </div>
            )}

            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  'flex',
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                )}
              >
                <div
                  className={cn(
                    'max-w-[80%] rounded-lg p-3 text-sm',
                    message.role === 'user'
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-800 text-white border border-green-500/30'
                  )}
                >
                  <p className="whitespace-pre-wrap">{message.content}</p>
                  <p className="text-xs opacity-70 mt-1">
                    {message.timestamp.toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-800 rounded-lg p-3 text-sm border border-green-500/30">
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-400"></div>
                    <span className="text-white">Pensando...</span>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-green-500/20 bg-gradient-to-r from-green-900/10 to-black">
            <div className="flex gap-2">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Digite sua pergunta..."
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage(inputValue);
                  }
                }}
                disabled={isLoading}
                className="bg-gray-900 border-green-500/30 text-white placeholder:text-gray-400 focus:border-green-400 focus:ring-green-400/20"
              />
              <Button
                onClick={() => handleSendMessage(inputValue)}
                disabled={!inputValue.trim() || isLoading}
                size="icon"
                className="bg-green-600 hover:bg-green-700 text-white border-green-500/30"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
