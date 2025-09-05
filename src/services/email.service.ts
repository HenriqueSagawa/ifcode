import * as nodemailer from 'nodemailer'

interface EmailOptions {
  to: string
  subject: string
  html: string
  text?: string
}

class EmailService {
  private transporter: nodemailer.Transporter | null = null

  constructor() {
    this.initializeTransporter()
  }

  private initializeTransporter() {
    // Configuração para Gmail (pode ser alterada para outros provedores)
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD, // Use App Password para Gmail
      },
    })
  }

  async sendEmail(options: EmailOptions): Promise<boolean> {
    if (!this.transporter) {
      console.error('Email transporter não inicializado')
      return false
    }

    try {
      await this.transporter.sendMail({
        from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
        to: options.to,
        subject: options.subject,
        html: options.html,
        text: options.text,
      })
      return true
    } catch (error) {
      console.error('Erro ao enviar email:', error)
      return false
    }
  }

  async sendPasswordResetEmail(email: string, name: string, resetUrl: string): Promise<boolean> {
    const subject = 'Redefinir senha - IFCode'
    
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Redefinir senha - IFCode</title>
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .header {
              background: linear-gradient(135deg, #10b981, #059669);
              color: white;
              padding: 30px;
              text-align: center;
              border-radius: 10px 10px 0 0;
            }
            .content {
              background: #f9fafb;
              padding: 30px;
              border-radius: 0 0 10px 10px;
            }
            .button {
              display: inline-block;
              background: #10b981;
              color: white;
              padding: 15px 30px;
              text-decoration: none;
              border-radius: 8px;
              font-weight: 600;
              margin: 20px 0;
            }
            .button:hover {
              background: #059669;
            }
            .footer {
              text-align: center;
              margin-top: 30px;
              color: #6b7280;
              font-size: 14px;
            }
            .warning {
              background: #fef3c7;
              border: 1px solid #f59e0b;
              border-radius: 8px;
              padding: 15px;
              margin: 20px 0;
              color: #92400e;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>🔐 Redefinir Senha</h1>
            <p>IFCode - Plataforma de Aprendizado</p>
          </div>
          
          <div class="content">
            <h2>Olá, ${name}!</h2>
            
            <p>Recebemos uma solicitação para redefinir a senha da sua conta no IFCode.</p>
            
            <p>Clique no botão abaixo para criar uma nova senha:</p>
            
            <div style="text-align: center;">
              <a href="${resetUrl}" class="button">Redefinir Senha</a>
            </div>
            
            <div class="warning">
              <strong>⚠️ Importante:</strong>
              <ul>
                <li>Este link expira em 1 hora</li>
                <li>Se você não solicitou esta redefinição, ignore este email</li>
                <li>Nunca compartilhe este link com outras pessoas</li>
              </ul>
            </div>
            
            <p>Se o botão não funcionar, copie e cole o link abaixo no seu navegador:</p>
            <p style="word-break: break-all; background: #e5e7eb; padding: 10px; border-radius: 5px; font-family: monospace;">
              ${resetUrl}
            </p>
          </div>
          
          <div class="footer">
            <p>Este email foi enviado automaticamente. Não responda a esta mensagem.</p>
            <p>© 2024 IFCode. Todos os direitos reservados.</p>
          </div>
        </body>
      </html>
    `

    const text = `
      Redefinir senha - IFCode
      
      Olá, ${name}!
      
      Recebemos uma solicitação para redefinir a senha da sua conta no IFCode.
      
      Acesse o link abaixo para criar uma nova senha:
      ${resetUrl}
      
      IMPORTANTE:
      - Este link expira em 1 hora
      - Se você não solicitou esta redefinição, ignore este email
      - Nunca compartilhe este link com outras pessoas
      
      Este email foi enviado automaticamente. Não responda a esta mensagem.
      © 2024 IFCode. Todos os direitos reservados.
    `

    return await this.sendEmail({
      to: email,
      subject,
      html,
      text,
    })
  }
}

export const emailService = new EmailService()
