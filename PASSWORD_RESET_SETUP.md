# Configuração do Sistema de Reset de Senha

## Variáveis de Ambiente Necessárias

Adicione as seguintes variáveis ao seu arquivo `.env.local`:

```env
# Email Configuration (para reset de senha)
EMAIL_USER=seu-email@gmail.com
EMAIL_PASSWORD=sua-senha-de-app
EMAIL_FROM=IFCode <noreply@ifcode.com>
```

## Configuração do Gmail

Para usar o serviço de email com Gmail:

1. **Ative a verificação em duas etapas** na sua conta Google
2. **Gere uma senha de app**:
   - Vá para [myaccount.google.com](https://myaccount.google.com)
   - Segurança → Verificação em duas etapas → Senhas de app
   - Gere uma nova senha de app para "Email"
   - Use esta senha na variável `EMAIL_PASSWORD`

## Estrutura do Banco de Dados

O sistema criará automaticamente uma coleção `resetTokens` no Firestore com a seguinte estrutura:

```typescript
{
  userId: string,        // ID do usuário
  email: string,         // Email do usuário
  expiresAt: Date,       // Data de expiração (1 hora)
  used: boolean,         // Se o token foi usado
  createdAt: Date,       // Data de criação
  usedAt?: Date          // Data de uso (opcional)
}
```

## Funcionalidades Implementadas

### 1. Página de Esqueceu a Senha (`/forgot-password`)
- Formulário para inserir email
- Validação de email
- Envio de email de recuperação
- Feedback visual de sucesso

### 2. Página de Redefinir Senha (`/reset-password`)
- Verificação automática de token
- Formulário para nova senha
- Validação de senha forte
- Confirmação de senha
- Feedback visual de sucesso

### 3. Endpoints da API

#### `POST /api/auth/forgot-password`
- Valida se o usuário existe
- Verifica se a conta foi criada com credenciais
- Gera token seguro
- Envia email de recuperação

#### `GET /api/auth/verify-reset-token`
- Verifica se o token é válido
- Verifica se não expirou
- Verifica se não foi usado

#### `POST /api/auth/reset-password`
- Valida token
- Criptografa nova senha
- Atualiza senha do usuário
- Marca token como usado

### 4. Serviço de Email
- Template HTML responsivo
- Versão texto para compatibilidade
- Configuração via nodemailer
- Tratamento de erros

## Segurança

- Tokens com expiração de 1 hora
- Tokens únicos e não reutilizáveis
- Senhas criptografadas com bcrypt
- Validação de força da senha
- Verificação de existência do usuário

## Uso

1. Usuário clica em "Esqueceu sua senha?" na página de login
2. Insere seu email na página de recuperação
3. Recebe email com link de recuperação
4. Clica no link e é redirecionado para redefinir senha
5. Insere nova senha e confirma
6. Senha é atualizada e pode fazer login

## Tratamento de Erros

- Token inválido ou expirado
- Usuário não encontrado
- Conta criada com login social
- Falha no envio de email
- Erros de validação de senha
