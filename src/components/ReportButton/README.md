# Sistema de Denúncias - IFCode

## Visão Geral

O sistema de denúncias foi implementado seguindo o padrão de desenvolvimento do IFCode, permitindo que usuários denunciem posts e comentários inadequados, com um painel de moderação completo para administradores e moderadores.

## Funcionalidades Implementadas

### 1. Sistema de Denúncias
- **Botão de denúncia** em posts e comentários
- **Modal de denúncia** com opções de motivo:
  - Spam
  - Linguagem Ofensiva
  - Assédio
  - Conteúdo Inadequado
  - Desinformação
  - Violação de Direitos Autorais
  - Outro
- **Prevenção de denúncias duplicadas** (um usuário não pode denunciar o mesmo conteúdo várias vezes)

### 2. Painel de Moderação
- **Dashboard com estatísticas** de denúncias
- **Fila de moderação** com filtros e busca
- **Análise detalhada** de cada denúncia
- **Ações de moderação**:
  - Aprovar denúncia (remover/ocultar conteúdo)
  - Rejeitar denúncia
  - Adicionar notas do moderador
  - Descrever ação tomada

### 3. Sistema de Permissões
- **Controle de acesso** baseado em roles (user, moderator, admin)
- **Proteção de rotas** para o painel de moderação
- **Hook personalizado** para verificar permissões

### 4. Notificações
- **Notificações automáticas** para:
  - Denunciantes (quando denúncia é aprovada/rejeitada)
  - Autores de conteúdo (quando conteúdo é removido)
- **Sistema de notificações** integrado com o Firebase

## Estrutura de Arquivos

```
src/
├── types/
│   └── reports.ts                    # Tipos TypeScript para denúncias
├── actions/
│   └── reports.ts                    # Ações do servidor para gerenciar denúncias
├── components/
│   ├── ReportButton/
│   │   ├── index.tsx                 # Componente do botão de denúncia
│   │   └── ReportModal.tsx           # Modal de denúncia
│   └── ModerationGuard/
│       └── index.tsx                 # Proteção de rotas para moderação
├── hooks/
│   └── useModerationPermissions.ts   # Hook para verificar permissões
├── services/
│   └── moderationNotifications.ts    # Serviço de notificações
└── app/(private)/moderation/
    ├── page.tsx                      # Página principal do painel
    └── _components/
        ├── ModerationStats.tsx       # Estatísticas de denúncias
        ├── ModerationQueue.tsx       # Fila de moderação
        ├── ModerationDashboard.tsx   # Dashboard do moderador
        └── ReportDetailsModal.tsx    # Modal de detalhes da denúncia
```

## Como Usar

### Para Usuários
1. **Denunciar conteúdo**: Clique no botão "🚩 Denunciar" em qualquer post ou comentário
2. **Selecionar motivo**: Escolha o motivo da denúncia no modal
3. **Adicionar descrição**: Opcionalmente, adicione mais detalhes
4. **Enviar denúncia**: A denúncia será enviada para análise

### Para Moderadores/Administradores
1. **Acessar painel**: Vá para `/moderation` (apenas usuários com permissão)
2. **Visualizar estatísticas**: Veja o resumo das denúncias no dashboard
3. **Analisar denúncias**: Clique em uma denúncia na fila para ver detalhes
4. **Tomar ação**: Aprove ou rejeite a denúncia com notas explicativas

## Configuração de Permissões

Para atribuir permissões de moderação a um usuário, atualize o campo `role` no documento do usuário no Firestore:

```javascript
// Para moderador
{
  role: "moderator"
}

// Para administrador
{
  role: "admin"
}
```

## Banco de Dados

### Coleção: `reports`
```typescript
{
  id: string;
  contentId: string;        // ID do post/comentário denunciado
  contentType: "post" | "comment";
  reporterId: string;       // ID do usuário que denunciou
  reason: ReportReason;     // Motivo da denúncia
  description?: string;     // Descrição adicional
  status: ReportStatus;     // Status da denúncia
  createdAt: string;
  updatedAt: string;
  moderatorId?: string;     // ID do moderador que analisou
  moderatorNotes?: string;  // Notas do moderador
  actionTaken?: string;     // Ação tomada
}
```

### Coleção: `notifications`
```typescript
{
  id: string;
  userId: string;           // ID do usuário que recebe a notificação
  type: NotificationType;   // Tipo da notificação
  title: string;
  message: string;
  data?: object;            // Dados adicionais
  read: boolean;
  createdAt: string;
}
```

## Recursos Adicionais

- **Filtros avançados** na fila de moderação
- **Busca por conteúdo** e usuários
- **Estatísticas em tempo real**
- **Interface responsiva** e acessível
- **Sistema de logs** para auditoria
- **Prevenção de abuso** (denúncias duplicadas)

## Próximos Passos Sugeridos

1. **Sistema de reputação** para usuários
2. **Ações em lote** para moderadores
3. **Relatórios automáticos** de moderação
4. **Sistema de apelação** para usuários banidos
5. **Integração com IA** para detecção automática de conteúdo inadequado
